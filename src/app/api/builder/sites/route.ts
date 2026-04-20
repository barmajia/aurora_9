import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user_id");
    const siteId = searchParams.get("site_id");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const query = supabase
      .from("site_builds")
      .select("*")
      .eq("user_id", userId);

    if (siteId) {
      const { data: site, error: siteError } = await query
        .eq("id", siteId)
        .single();
      if (siteError) throw siteError;

      const { data: pages } = await supabase
        .from("site_pages")
        .select("*")
        .eq("site_id", siteId)
        .order("display_order");

      const { data: domains } = await supabase
        .from("site_custom_domains")
        .select("*")
        .eq("site_id", siteId);

      return NextResponse.json({ ...site, pages, custom_domains: domains });
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching sites:", error);
    return NextResponse.json(
      { error: "Failed to fetch sites" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user_id, template_id, name, slug, theme_config } = body;

    if (!user_id || !name) {
      return NextResponse.json(
        { error: "User ID and name required" },
        { status: 400 },
      );
    }

    const siteSlug =
      slug ||
      name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

    const { data, error } = await supabase
      .from("site_builds")
      .insert({
        user_id,
        template_id,
        name,
        slug: siteSlug,
        theme_config: theme_config || {
          primaryColor: "#000000",
          secondaryColor: "#ffffff",
          fontFamily: "inter",
        },
        seo_config: {
          title: name,
          description: "",
          ogImage: "",
        },
      })
      .select()
      .single();

    if (error) throw error;

    await supabase.from("site_pages").insert({
      site_id: data.id,
      title: "Home",
      slug: "home",
      page_type: "home",
      is_homepage: true,
      is_published: false,
      sections: [],
      display_order: 0,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating site:", error);
    return NextResponse.json(
      { error: "Failed to create site" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { site_id, ...updates } = body;

    if (!site_id) {
      return NextResponse.json({ error: "Site ID required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("site_builds")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", site_id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating site:", error);
    return NextResponse.json(
      { error: "Failed to update site" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get("site_id");

    if (!siteId) {
      return NextResponse.json({ error: "Site ID required" }, { status: 400 });
    }

    const { error } = await supabase
      .from("site_builds")
      .delete()
      .eq("id", siteId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting site:", error);
    return NextResponse.json(
      { error: "Failed to delete site" },
      { status: 500 },
    );
  }
}

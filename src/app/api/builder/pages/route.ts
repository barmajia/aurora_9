import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get('site_id');
    const pageId = searchParams.get('page_id');

    if (!siteId && !pageId) {
      return NextResponse.json({ error: 'Site ID or Page ID required' }, { status: 400 });
    }

    if (pageId) {
      const { data, error } = await supabase
        .from('site_pages')
        .select('*')
        .eq('id', pageId)
        .single();
      
      if (error) throw error;
      return NextResponse.json(data);
    }

    const { data, error } = await supabase
      .from('site_pages')
      .select('*')
      .eq('site_id', siteId)
      .order('display_order');

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching pages:', error);
    return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { site_id, title, slug, page_type, is_homepage, sections, seo_config, display_order } = body;

    if (!site_id || !title || !slug) {
      return NextResponse.json({ error: 'Site ID, title, and slug required' }, { status: 400 });
    }

    if (is_homepage) {
      await supabase
        .from('site_pages')
        .update({ is_homepage: false })
        .eq('site_id', site_id)
        .eq('is_homepage', true);
    }

    const { data, error } = await supabase
      .from('site_pages')
      .insert({
        site_id,
        title,
        slug,
        page_type: page_type || 'custom',
        is_homepage: is_homepage || false,
        is_published: false,
        sections: sections || [],
        seo_config: seo_config || { title: '', description: '' },
        display_order: display_order || 0
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating page:', error);
    return NextResponse.json({ error: 'Failed to create page' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { page_id, ...updates } = body;

    if (!page_id) {
      return NextResponse.json({ error: 'Page ID required' }, { status: 400 });
    }

    if (updates.is_homepage) {
      const { data: page } = await supabase
        .from('site_pages')
        .select('site_id')
        .eq('id', page_id)
        .single();
      
      if (page) {
        await supabase
          .from('site_pages')
          .update({ is_homepage: false })
          .eq('site_id', page.site_id)
          .eq('is_homepage', true)
          .neq('id', page_id);
      }
    }

    const { data, error } = await supabase
      .from('site_pages')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', page_id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating page:', error);
    return NextResponse.json({ error: 'Failed to update page' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pageId = searchParams.get('page_id');

    if (!pageId) {
      return NextResponse.json({ error: 'Page ID required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('site_pages')
      .delete()
      .eq('id', pageId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting page:', error);
    return NextResponse.json({ error: 'Failed to delete page' }, { status: 500 });
  }
}
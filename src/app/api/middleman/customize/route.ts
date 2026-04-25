import { NextRequest, NextResponse } from 'next/server';
import { TemplateController } from '@/lib/controllers/middleman-controller';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// GET /api/middleman/customize?storeId=xxx
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const storeId = searchParams.get('storeId');

    if (!storeId) {
      return NextResponse.json(
        { success: false, error: 'Store ID is required' },
        { status: 400 }
      );
    }

    const customization = await TemplateController.getStoreCustomization(storeId);
    return NextResponse.json({ success: true, data: customization });
  } catch (error: any) {
    console.error('Error fetching customization:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/middleman/customize - Update store customization
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { storeId, ...updates } = body;

    if (!storeId) {
      return NextResponse.json(
        { success: false, error: 'Store ID is required' },
        { status: 400 }
      );
    }

    // Verify authentication
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify store ownership
    const { data: store } = await supabase
      .from('middleman_profiles')
      .select('user_id')
      .eq('id', storeId)
      .single();

    if (!store || store.user_id !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Store not found or unauthorized' },
        { status: 403 }
      );
    }

    // Validate allowed fields
    const allowedFields = [
      'layout_mode',
      'products_per_page',
      'show_sidebar',
      'primary_color',
      'secondary_color',
      'font_family',
      'hero_banner_url',
      'hero_title',
      'hero_subtitle',
    ];

    const filteredUpdates: any = {};
    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        filteredUpdates[key] = value;
      }
    }

    if (Object.keys(filteredUpdates).length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid update fields provided' },
        { status: 400 }
      );
    }

    const result = await TemplateController.updateCustomization(storeId, filteredUpdates);
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Error updating customization:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

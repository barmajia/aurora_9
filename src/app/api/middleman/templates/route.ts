import { NextRequest, NextResponse } from 'next/server';
import { TemplateController } from '@/lib/controllers/middleman-controller';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(request: NextRequest) {
  try {
    const templates = await TemplateController.getTemplates();
    return NextResponse.json({ success: true, data: templates });
  } catch (error: any) {
    console.error('Error fetching templates:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { storeId, templateId } = body;

    if (!storeId || !templateId) {
      return NextResponse.json(
        { success: false, error: 'Store ID and Template ID are required' },
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

    const result = await TemplateController.applyTemplate(storeId, templateId);
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Error applying template:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

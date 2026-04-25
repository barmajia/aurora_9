import { NextRequest, NextResponse } from 'next/server';
import { ProductController } from '@/lib/controllers/middleman-controller';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// GET /api/middleman/products?storeId=xxx
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

    const products = await ProductController.getStoreProducts(storeId);
    return NextResponse.json({ success: true, data: products });
  } catch (error: any) {
    console.error('Error fetching store products:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/middleman/products - Add product to store
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { storeId, asin, asins } = body;

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

    let result;
    if (asins && Array.isArray(asins)) {
      // Bulk add
      result = await ProductController.bulkAddProducts(storeId, asins);
    } else if (asin) {
      // Single add
      result = await ProductController.addProductToStore(storeId, asin);
    } else {
      return NextResponse.json(
        { success: false, error: 'ASIN or ASINs array is required' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Error adding product to store:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/middleman/products?storeId=xxx&asin=yyy
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const storeId = searchParams.get('storeId');
    const asin = searchParams.get('asin');

    if (!storeId || !asin) {
      return NextResponse.json(
        { success: false, error: 'Store ID and ASIN are required' },
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

    const result = await ProductController.removeProductFromStore(storeId, asin);
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Error removing product from store:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

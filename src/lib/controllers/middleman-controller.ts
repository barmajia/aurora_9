import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Template Controller - Manages template selection and customization for middleman stores
 */
export class TemplateController {
  /**
   * Get all available templates
   */
  static async getTemplates() {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .order('name');

    if (error) throw error;
    return data;
  }

  /**
   * Get a specific template by ID
   */
  static async getTemplateById(templateId: string) {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('id', templateId)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Apply a template to a store
   */
  static async applyTemplate(storeId: string, templateId: string) {
    // Check if customization exists
    const { data: existing } = await supabase
      .from('store_customizations')
      .select('id')
      .eq('store_id', storeId)
      .single();

    if (existing) {
      // Update existing customization
      const { data, error } = await supabase
        .from('store_customizations')
        .update({
          template_id: templateId,
          updated_at: new Date().toISOString(),
        })
        .eq('store_id', storeId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      // Create new customization
      const { data, error } = await supabase
        .from('store_customizations')
        .insert({
          store_id: storeId,
          template_id: templateId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  }

  /**
   * Get store customization settings
   */
  static async getStoreCustomization(storeId: string) {
    const { data, error } = await supabase
      .from('store_customizations')
      .select('*')
      .eq('store_id', storeId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
    return data;
  }

  /**
   * Update store customization settings
   */
  static async updateCustomization(storeId: string, updates: {
    layout_mode?: string;
    products_per_page?: number;
    show_sidebar?: boolean;
    primary_color?: string;
    secondary_color?: string;
    font_family?: string;
    hero_banner_url?: string;
    hero_title?: string;
    hero_subtitle?: string;
  }) {
    const { data, error } = await supabase
      .from('store_customizations')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('store_id', storeId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Get complete store data with template and products
   */
  static async getCompleteStore(storeSlug: string) {
    // Get store profile
    const { data: profile, error: profileError } = await supabase
      .from('middleman_profiles')
      .select('*, store_customizations(*), store_products(asin)')
      .eq('store_slug', storeSlug)
      .single();

    if (profileError) throw profileError;
    if (!profile) return null;

    // Get products from main catalog
    const asins = profile.store_products?.map((sp: any) => sp.asin) || [];
    
    let products = [];
    if (asins.length > 0) {
      const { data: prodData } = await supabase
        .from('products')
        .select('*')
        .in('asin', asins);
      
      products = prodData || [];
    }

    return {
      profile,
      customization: profile.store_customizations,
      products,
    };
  }

  /**
   * Preview template with sample data
   */
  static async previewTemplate(templateId: string) {
    const { data: template } = await supabase
      .from('templates')
      .select('*')
      .eq('id', templateId)
      .single();

    if (!template) throw new Error('Template not found');

    // Get sample products for preview
    const { data: sampleProducts } = await supabase
      .from('products')
      .select('*')
      .limit(8);

    return {
      template,
      sampleProducts: sampleProducts || [],
    };
  }
}

/**
 * Product Controller - Manages products for middleman stores
 */
export class ProductController {
  /**
   * Add a product to a store by ASIN
   */
  static async addProductToStore(storeId: string, asin: string) {
    // Check if already exists
    const { data: existing } = await supabase
      .from('store_products')
      .select('id')
      .eq('store_id', storeId)
      .eq('asin', asin)
      .single();

    if (existing) {
      return { success: false, message: 'Product already in store' };
    }

    // Verify product exists in main catalog
    const { data: product } = await supabase
      .from('products')
      .select('asin')
      .eq('asin', asin)
      .single();

    if (!product) {
      return { success: false, message: 'Product not found in catalog' };
    }

    // Add to store
    const { data, error } = await supabase
      .from('store_products')
      .insert({
        store_id: storeId,
        asin: asin,
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  }

  /**
   * Remove a product from a store
   */
  static async removeProductFromStore(storeId: string, asin: string) {
    const { error } = await supabase
      .from('store_products')
      .delete()
      .eq('store_id', storeId)
      .eq('asin', asin);

    if (error) throw error;
    return { success: true };
  }

  /**
   * Get all products for a store
   */
  static async getStoreProducts(storeId: string) {
    const { data: storeProducts, error } = await supabase
      .from('store_products')
      .select('asin, added_at')
      .eq('store_id', storeId)
      .order('added_at', { ascending: false });

    if (error) throw error;

    if (!storeProducts || storeProducts.length === 0) {
      return [];
    }

    const asins = storeProducts.map(sp => sp.asin);
    const { data: products } = await supabase
      .from('products')
      .select('*')
      .in('asin', asins);

    return products || [];
  }

  /**
   * Bulk add products by ASINs
   */
  static async bulkAddProducts(storeId: string, asins: string[]) {
    const results = {
      added: 0,
      skipped: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (const asin of asins) {
      try {
        const result = await this.addProductToStore(storeId, asin.trim());
        if (result.success) {
          results.added++;
        } else {
          results.skipped++;
        }
      } catch (error: any) {
        results.failed++;
        results.errors.push(`ASIN ${asin}: ${error.message}`);
      }
    }

    return results;
  }
}

/**
 * Dashboard Controller - Manages dashboard data and operations
 */
export class DashboardController {
  /**
   * Get dashboard overview for a store
   */
  static async getDashboardOverview(storeId: string) {
    // Get product count
    const { count: productCount } = await supabase
      .from('store_products')
      .select('*', { count: 'exact', head: true })
      .eq('store_id', storeId);

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { count: recentAdds } = await supabase
      .from('store_products')
      .select('*', { count: 'exact', head: true })
      .eq('store_id', storeId)
      .gte('added_at', sevenDaysAgo.toISOString());

    // Get store info
    const { data: store } = await supabase
      .from('middleman_profiles')
      .select('store_name, store_slug, created_at')
      .eq('id', storeId)
      .single();

    return {
      productCount: productCount || 0,
      recentAdds: recentAdds || 0,
      store,
    };
  }

  /**
   * Get analytics data for dashboard
   */
  static async getAnalytics(storeId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // This would be enhanced with actual view/purchase tracking
    return {
      period: `${days} days`,
      startDate: startDate.toISOString(),
      endDate: new Date().toISOString(),
      // Placeholder metrics - would integrate with analytics system
      views: 0,
      clicks: 0,
      conversions: 0,
    };
  }
}

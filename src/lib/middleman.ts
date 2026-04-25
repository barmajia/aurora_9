import { createClient } from '@/lib/supabase/client';

export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail_url: string | null;
  config: any;
  is_premium: boolean;
}

export interface MiddlemanProfile {
  id: string;
  user_id: string;
  store_name: string;
  store_slug: string;
  bio: string | null;
  avatar_url: string | null;
  template_id: string | null;
  is_active: boolean;
}

export interface StoreProduct {
  id: string;
  profile_id: string;
  asin: string;
  custom_title: string | null;
  custom_price: number | null;
  sort_order: number;
}

const supabase = createClient();

// Templates
export async function getTemplates() {
  const { data, error } = await supabase
    .from('templates')
    .select('*')
    .order('created_at', { ascending: true });
  
  if (error) throw error;
  return data as Template[];
}

export async function getTemplateById(id: string) {
  const { data, error } = await supabase
    .from('templates')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data as Template;
}

// Profiles
export async function getProfileBySlug(slug: string) {
  const { data, error } = await supabase
    .from('middleman_profiles')
    .select('*, templates(*)')
    .eq('store_slug', slug)
    .eq('is_active', true)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data as (MiddlemanProfile & { templates: Template | null }) | null;
}

export async function getCurrentUserProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('middleman_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data as MiddlemanProfile | null;
}

export async function createProfile(profile: {
  store_name: string;
  store_slug: string;
  bio?: string;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('middleman_profiles')
    .insert({
      user_id: user.id,
      store_name: profile.store_name,
      store_slug: profile.store_slug.toLowerCase().replace(/\s+/g, '-'),
      bio: profile.bio || null,
      is_active: true,
    })
    .select()
    .single();
  
  if (error) throw error;
  return data as MiddlemanProfile;
}

export async function updateProfile(id: string, updates: Partial<MiddlemanProfile>) {
  const { data, error } = await supabase
    .from('middleman_profiles')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as MiddlemanProfile;
}

// Store Products
export async function getStoreProducts(profileId: string) {
  const { data, error } = await supabase
    .from('store_products')
    .select('*, products(*)')
    .eq('profile_id', profileId)
    .order('sort_order', { ascending: true });
  
  if (error) throw error;
  return data;
}

export async function addProductToStore(profileId: string, asin: string) {
  const { data, error } = await supabase
    .from('store_products')
    .insert({
      profile_id: profileId,
      asin,
      sort_order: 0,
    })
    .select()
    .single();
  
  if (error) throw error;
  return data as StoreProduct;
}

export async function removeProductFromStore(profileId: string, asin: string) {
  const { error } = await supabase
    .from('store_products')
    .delete()
    .eq('profile_id', profileId)
    .eq('asin', asin);
  
  if (error) throw error;
}

export async function updateProductOrder(profileId: string, asin: string, sortOrder: number) {
  const { data, error } = await supabase
    .from('store_products')
    .update({ sort_order: sortOrder })
    .eq('profile_id', profileId)
    .eq('asin', asin)
    .select()
    .single();
  
  if (error) throw error;
  return data as StoreProduct;
}

// Helper to fetch products by ASINs from main catalog
export async function getProductsByAsins(asins: string[]) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .in('asin', asins);
  
  if (error) throw error;
  return data || [];
}

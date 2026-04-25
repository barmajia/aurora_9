import { notFound } from 'next/navigation';
import { getProfileBySlug, getStoreProducts } from '@/lib/middleman';
import { getProductsByAsins } from '@/lib/products';
import Storefront from './Storefront';

interface PageProps {
  params: Promise<{ storeSlug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { storeSlug } = await params;
  const profile = await getProfileBySlug(storeSlug);
  
  if (!profile) {
    return {
      title: 'Store Not Found',
    };
  }

  return {
    title: `${profile.store_name} | Aurora`,
    description: profile.bio || `Shop at ${profile.store_name}`,
    openGraph: {
      title: profile.store_name,
      description: profile.bio || `Shop at ${profile.store_name}`,
      images: profile.avatar_url ? [{ url: profile.avatar_url }] : [],
    },
  };
}

export default async function StorePage({ params }: PageProps) {
  const { storeSlug } = await params;
  
  // Get profile with template info
  const profile = await getProfileBySlug(storeSlug);
  
  if (!profile || !profile.is_active) {
    notFound();
  }

  // Get store products
  const storeProducts = await getStoreProducts(profile.id);
  
  // Extract ASINs
  const asins = storeProducts.map((sp: any) => sp.asin);
  
  // Fetch product details from main catalog
  let products = [];
  if (asins.length > 0) {
    products = await getProductsByAsins(asins);
  }

  return (
    <Storefront 
      profile={profile} 
      products={products} 
      templateConfig={profile.templates?.config || {}}
    />
  );
}

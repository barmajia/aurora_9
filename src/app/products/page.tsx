'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';
import { Package } from 'lucide-react';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number | null;
  currency: string;
  images: any[];
  category?: string;
  subcategory?: string;
  quantity: number;
  status: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="pulse-glow" style={{ padding: '3rem', borderRadius: '20px' }}>
          <Package size={48} className="gradient-text" />
          <p style={{ marginTop: '1rem', color: 'rgba(255,255,255,0.6)' }}>Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2 className="auth-title">Error</h2>
          <p style={{ color: '#ef4444', textAlign: 'center' }}>{error}</p>
          <button onClick={fetchProducts} className="auth-button">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 className="hero-title" style={{ fontSize: '3.5rem' }}>Our Products</h1>
        <p className="hero-subtitle" style={{ margin: '1rem auto', maxWidth: '600px' }}>
          Discover our curated collection of premium products
        </p>
      </div>

      {products.length === 0 ? (
        <div className="empty-cart">
          <Package size={64} style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
          <p>No products available yet</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

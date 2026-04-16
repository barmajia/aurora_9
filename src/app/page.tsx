'use client';

import Link from 'next/link';
import { ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import { useCartStore } from '@/store/cart';

export default function Home() {
  const { items } = useCartStore();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="hero">
      <div className="hero-bg" />
      <div className="hero-content">
        <div className="float-animation" style={{ marginBottom: '2rem' }}>
          <Sparkles size={64} className="gradient-text" />
        </div>
        <h1 className="hero-title">Welcome to Aurora</h1>
        <p className="hero-subtitle">
          Discover premium products with a stunning shopping experience. 
          Your journey to exceptional quality starts here.
        </p>
        <div className="hero-buttons">
          <Link href="/products" className="btn-primary">
            Browse Products
            <ArrowRight size={20} />
          </Link>
          <Link href="/cart" className="btn-secondary">
            <ShoppingBag size={20} />
            Cart ({totalItems})
          </Link>
        </div>
        
        <div style={{ marginTop: '5rem', display: 'flex', gap: '3rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <div className="glass-card" style={{ padding: '2rem', minWidth: '200px', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', background: 'var(--gradient-1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>500+</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', marginTop: '0.5rem' }}>Products</div>
          </div>
          <div className="glass-card" style={{ padding: '2rem', minWidth: '200px', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', background: 'var(--gradient-2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>10K+</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', marginTop: '0.5rem' }}>Customers</div>
          </div>
          <div className="glass-card" style={{ padding: '2rem', minWidth: '200px', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #ec4899 0%, #06b6d4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>24/7</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', marginTop: '0.5rem' }}>Support</div>
          </div>
        </div>
      </div>
    </div>
  );
}
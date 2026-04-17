'use client';

import Link from 'next/link';
import { ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import { useCartStore } from '@/store/cart';

export default function Home() {
  const { items } = useCartStore();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="hero min-h-screen relative overflow-hidden flex items-center justify-center py-20">
      <div className="hero-bg" />
      
      {/* 🔮 Background Glow Orbs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-rose-500/10 rounded-full blur-[100px] animate-pulse delay-700" />
      
      <div className="hero-content relative z-10 max-w-5xl mx-auto px-6 text-center">
        <div className="animate-float mb-12 inline-block">
          <div className="w-24 h-24 glass rounded-[2.5rem] flex items-center justify-center shadow-2xl border-white/20">
            <Sparkles size={48} className="text-primary" />
          </div>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-none italic uppercase">
          Welcome to <br />
          <span className="gradient-text">Aurora</span>
        </h1>
        
        <p className="hero-subtitle text-xl md:text-2xl text-white/60 mb-12 max-w-2xl mx-auto font-medium lowercase tracking-tight">
          discover premium products with a stunning shopping experience. 
          your journey to exceptional quality starts here.
        </p>
        
        <div className="hero-buttons flex flex-wrap gap-6 justify-center">
          <Link href="/products" className="btn-primary h-16 px-10 rounded-2xl flex items-center gap-3 text-lg font-black uppercase tracking-widest shadow-2xl shadow-primary/40 hover:scale-105 active:scale-95 transition-all">
            Browse Products
            <ArrowRight size={24} />
          </Link>
          <Link href="/cart" className="btn-secondary h-16 px-10 rounded-2xl flex items-center gap-3 text-lg font-black uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all glass">
            <ShoppingBag size={24} />
            Cart ({totalItems})
          </Link>
        </div>
        
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: "Products", value: "500+", gradient: "var(--gradient-1)" },
            { label: "Customers", value: "10K+", gradient: "var(--gradient-2)" },
            { label: "Support", value: "24/7", gradient: "linear-gradient(135deg, #ec4899 0%, #06b6d4 100%)" },
          ].map((stat, idx) => (
            <div key={idx} className="glass-card p-10 rounded-[2.5rem] border-white/10 group">
              <div 
                className="text-5xl font-black italic tracking-tighter mb-2 group-hover:scale-110 transition-transform duration-500" 
                style={{ background: stat.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
              >
                {stat.value}
              </div>
              <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
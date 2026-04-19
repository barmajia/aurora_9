'use client';

import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';
import { ProductCardSkeleton, Button } from '@/components/ui';
import { Package, Search, SlidersHorizontal, X, ChevronDown, LayoutGrid, List, Filter, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Product } from '@/types';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }

  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category || 'General'));
    return ['all', ...Array.from(cats)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        (p.title || p.name || '').toLowerCase().includes(query) || 
        (p.description || '').toLowerCase().includes(query)
      );
    }
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }
    
    if (sortBy === 'price-low') result.sort((a, b) => (a.price || 0) - (b.price || 0));
    if (sortBy === 'price-high') result.sort((a, b) => (b.price || 0) - (a.price || 0));
    if (sortBy === 'name') result.sort((a, b) => (a.title || a.name || '').localeCompare(b.title || b.name || ''));
    
    return result;
  }, [products, searchQuery, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 max-w-[1600px] mx-auto">
      {/* 🚀 Page Header */}
      <header className="mb-12 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 mb-4"
          >
            <div className="w-1.5 h-1.5 bg-black rounded-full" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Inventory</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
          >
            Curated <span className="text-zinc-400">Products</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-500 font-medium text-sm"
          >
            Discover exceptional quality and engineering.
          </motion.p>
        </div>

         <div className="flex items-center gap-3">
            <div className="p-1 bg-zinc-50 border border-zinc-100 rounded-xl flex items-center">
               <button 
                 onClick={() => setViewMode('grid')}
                 className={cn("p-2 rounded-lg transition-all", viewMode === 'grid' ? "bg-white text-black shadow-sm" : "text-zinc-400 hover:text-zinc-600")}
               >
                 <LayoutGrid size={16} />
               </button>
               <button 
                 onClick={() => setViewMode('list')}
                 className={cn("p-2 rounded-lg transition-all", viewMode === 'list' ? "bg-white text-black shadow-sm" : "text-zinc-400 hover:text-zinc-600")}
               >
                 <List size={16} />
               </button>
            </div>
         </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12 items-start">
        {/* 🛠️ Dynamic Sidebar */}
        <aside className="hidden lg:flex flex-col gap-10 sticky top-32">
          <section>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-6 flex items-center gap-2">
              <Filter size={12} /> Search Parameters
            </h3>
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Find item..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-xs font-black uppercase tracking-widest outline-none focus:border-primary/50 transition-all placeholder:opacity-20"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={16} />
            </div>
          </section>

          <section>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-6 flex items-center gap-2">
              Modules
            </h3>
            <nav className="flex flex-col gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "w-full text-left px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                    selectedCategory === cat 
                      ? "bg-primary text-white shadow-lg shadow-primary/20" 
                      : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"
                  )}
                >
                  {cat === 'all' ? 'Universal' : cat}
                </button>
              ))}
            </nav>
          </section>

          <section>
             <div className="p-6 rounded-[2.5rem] bg-gradient-to-br from-primary/20 to-secondary/20 border border-white/5 relative overflow-hidden group">
                <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-125 transition-transform duration-700">
                  <Sparkles size={120} />
                </div>
                <h4 className="text-sm font-black italic text-white mb-2 relative z-10">Premium Support</h4>
                <p className="text-[10px] font-medium text-white/50 mb-4 relative z-10">24/7 Concierge for all verified owners.</p>
                <Button size="sm" className="w-full text-[10px] uppercase font-black relative z-10">Contact</Button>
             </div>
          </section>
        </aside>

        {/* 📦 Results Window */}
        <main>
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
             <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 italic">
               Synchronized: {filteredProducts.length} Entities
             </div>
             <div className="flex items-center gap-4">
                <div className="relative group">
                   <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white/5 border border-white/10 rounded-xl pl-4 pr-10 py-2.5 text-[10px] font-black uppercase tracking-widest outline-none hover:bg-white/10 cursor-pointer"
                   >
                     <option value="newest">Recent First</option>
                     <option value="price-low">Value: Low-High</option>
                     <option value="price-high">Value: High-Low</option>
                     <option value="name">Alpha: A-Z</option>
                   </select>
                   <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" size={14} />
                </div>
             </div>
          </div>

          <AnimatePresence mode="popLayout">
            {loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {[...Array(6)].map((_, i) => <ProductCardSkeleton key={i} />)}
              </motion.div>
            ) : filteredProducts.length === 0 ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-40 bg-white/5 rounded-[3rem] border border-dashed border-white/10"
              >
                <Package className="text-white/10 mb-6" size={80} strokeWidth={1} />
                <h3 className="text-2xl font-black italic text-white/40 uppercase">Zero Matches Found</h3>
                <p className="text-white/20 text-xs font-bold mt-2 uppercase tracking-widest">Adjust your parameters</p>
                <Button variant="secondary" onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }} className="mt-8">Clear Parameters</Button>
              </motion.div>
            ) : (
              <motion.div 
                key="grid"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "grid gap-6 transition-all duration-500",
                  viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
                )}
              >
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

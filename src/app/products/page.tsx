"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";
import { ProductCardSkeleton, Button } from "@/components/ui";
import {
  Package,
  Search,
  ChevronDown,
  LayoutGrid,
  List,
  Sparkles,
  RefreshCw,
  Box,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Product } from "@/types";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category || "General"));
    return ["all", ...Array.from(cats)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          (p.title || p.name || "").toLowerCase().includes(query) ||
          (p.description || "").toLowerCase().includes(query),
      );
    }
    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (sortBy === "price-low")
      result.sort((a, b) => (a.price || 0) - (b.price || 0));
    if (sortBy === "price-high")
      result.sort((a, b) => (b.price || 0) - (a.price || 0));
    if (sortBy === "name")
      result.sort((a, b) =>
        (a.title || a.name || "").localeCompare(b.title || b.name || ""),
      );

    return result;
  }, [products, searchQuery, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 pt-32 px-6 md:px-12 lg:px-24 p-10">
      <div className=" mx-auto">
        {/* 🚀 Page Header */}
        <header className="mb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 mb-6"
              >
                <div className="w-10 h-1 bg-blue-500 rounded-full" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
                  Inventory Node
                </span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-6xl md:text-8xl font-black italic tracking-tighter text-zinc-900 dark:text-white uppercase leading-[0.9]"
              >
                System <span className="text-blue-500">Catalog</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-8 text-black dark:text-zinc-400 font-medium text-lg leading-relaxed"
              >
                Explore the foundational components of the Aurora Ecosystem.
                Curated for performance, aesthetics, and reliability.
              </motion.p>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-1.5 aurora-glass rounded-2xl flex items-center shadow-lg">
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                    viewMode === "grid"
                      ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xl"
                      : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300",
                  )}
                  title="Grid View"
                >
                  <LayoutGrid size={20} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                    viewMode === "list"
                      ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xl"
                      : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300",
                  )}
                  title="List View"
                >
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-20 items-start">
          {/* 🛠️ Dynamic Sidebar */}
          <aside className="hidden lg:flex flex-col gap-12 sticky top-32">
            <section>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 flex items-center gap-2">
                  <Search size={12} className="text-blue-500" /> Identifier
                  Search
                </h3>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-[10px] font-black uppercase tracking-widest text-rose-500"
                  >
                    Reset
                  </button>
                )}
              </div>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Scan for item..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full aurora-glass rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-widest outline-none focus:border-blue-500/50 transition-all placeholder:opacity-30"
                />
                <Search
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-300 dark:text-zinc-700 group-focus-within:text-blue-500 transition-colors"
                  size={16}
                />
              </div>
            </section>

            <section>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-6 flex items-center gap-2">
                <Box size={12} className="text-blue-500" /> System Modules
              </h3>
              <nav className="flex flex-col gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      "w-full text-left px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                      selectedCategory === cat
                        ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xl translate-x-2"
                        : "aurora-glass text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:translate-x-1",
                    )}
                  >
                    {cat === "all" ? "Universal Sync" : cat}
                  </button>
                ))}
              </nav>
            </section>

            <section>
              <div className="aurora-card p-8 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 relative overflow-hidden group border-blue-500/10">
                <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-125 transition-transform duration-1000 rotate-12">
                  <Sparkles size={160} />
                </div>
                <h4 className="text-lg font-black italic tracking-tighter text-zinc-900 dark:text-white mb-2 relative z-10 uppercase leading-none">
                  Aurora <br /> Priority
                </h4>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-6 relative z-10 leading-relaxed">
                  24/7 Priority support for all ecosystem participants.
                </p>
                <Button
                  size="sm"
                  className="w-full font-black uppercase tracking-widest relative z-10"
                >
                  Access Support
                </Button>
              </div>
            </section>
          </aside>

          {/* 📦 Results Window */}
          <main>
            <div className="flex items-center justify-between mb-12 pb-6 border-b border-zinc-100 dark:border-zinc-900">
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 italic">
                Active Nodes:{" "}
                <span className="text-zinc-900 dark:text-white font-black">
                  {filteredProducts.length}
                </span>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
                    Sort Protocol:
                  </span>
                  <div className="relative group">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none aurora-glass rounded-xl pl-5 pr-12 py-3 text-[10px] font-black uppercase tracking-widest outline-none hover:border-blue-500/30 cursor-pointer transition-all"
                    >
                      <option value="newest">Recent Initialization</option>
                      <option value="price-low">Value: Ascending</option>
                      <option value="price-high">Value: Descending</option>
                      <option value="name">Alpha Signature</option>
                    </select>
                    <ChevronDown
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
                      size={14}
                    />
                  </div>
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
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {[...Array(6)].map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))}
                </motion.div>
              ) : filteredProducts.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-48 aurora-glass rounded-[4rem] border-dashed border-zinc-200 dark:border-zinc-800"
                >
                  <Package
                    className="text-zinc-100 dark:text-zinc-900 mb-8"
                    size={100}
                    strokeWidth={1}
                  />
                  <h3 className="text-3xl font-black italic tracking-tighter text-zinc-400 uppercase">
                    Zero Matches Detected
                  </h3>
                  <p className="text-zinc-300 dark:text-zinc-700 text-[10px] font-black mt-4 uppercase tracking-[0.3em]">
                    Recalibrate search parameters
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                    }}
                    className="mt-12 rounded-full px-10"
                  >
                    Clear Protocol
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key={viewMode}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className={cn(
                    "grid gap-8 transition-all duration-500",
                    viewMode === "grid"
                      ? "grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
                      : "grid-cols-1",
                  )}
                >
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {!loading && filteredProducts.length > 0 && (
              <div className="mt-24 text-center">
                <Button
                  variant="outline"
                  className="rounded-full px-12 py-6 text-xs font-black uppercase tracking-[0.3em]"
                  onClick={fetchProducts}
                >
                  <RefreshCw size={14} className="mr-3" /> Reload Ecosystem
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

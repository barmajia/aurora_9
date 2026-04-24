"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Heart, Trash2, ShoppingCart, ArrowRight, ChevronLeft } from "lucide-react";
import { useWishlistStore } from "@/store/wishlist";
import { useCartStore } from "@/store/cart";
import { useToastStore } from "@/store/toast";
import { Button } from "@/components/ui";
import type { WishlistItem } from "@/types";

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore();
  const addItem = useCartStore((state) => state.addItem);
  const addToast = useToastStore((state) => state.addToast);

  const handleMoveToCart = (item: WishlistItem) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category,
      description: item.description || "",
    });
    removeItem(item.id);
    addToast(`${item.name} moved to cart`, "success");
  };

  const handleRemove = (id: string) => {
    removeItem(id);
    addToast("Removed from wishlist", "info");
  };

  if (items.length === 0) {
    return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-12 lg:p-24 pt-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-24 h-24 bg-zinc-100 dark:bg-zinc-900 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-zinc-200 dark:border-zinc-800">
            <Heart className="text-rose-500" size={40} />
          </div>
          <h1 className="text-4xl font-black italic tracking-tighter text-zinc-900 dark:text-white mb-4 uppercase">
            Wishlist Empty
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mb-10 leading-relaxed">
            Your collection of desired items is currently empty. Initialize your preferences by browsing our catalog.
          </p>
          <Link href="/products">
            <Button size="lg" className="group w-full">
              Explore Products
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-12 lg:p-24 pt-32">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
            <div>
              <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter text-zinc-900 dark:text-white uppercase mb-4">
                My <span className="text-rose-500">Wishlist</span>
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400 font-medium uppercase tracking-widest text-sm">
                Saved {items.length} premium selections
              </p>
            </div>
            <Link
              href="/products"
              className="group flex items-center gap-2 text-sm font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Continue Browsing
            </Link>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {items.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <div className="aurora-card group h-full flex flex-col p-4">
                  <div className="aspect-[4/5] relative mb-6 overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md flex items-center justify-center text-rose-500 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg"
                      title="Remove from wishlist"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="flex flex-col flex-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-2">
                      {item.category}
                    </span>
                    <h3 className="text-lg font-black italic tracking-tighter text-zinc-900 dark:text-white uppercase mb-4 line-clamp-1">
                      {item.name}
                    </h3>
                    <div className="mt-auto pt-4 flex items-center justify-between gap-4">
                      <p className="text-2xl font-black italic tracking-tighter text-zinc-900 dark:text-white">
                        ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </p>
                      <Button
                        size="sm"
                        onClick={() => handleMoveToCart(item)}
                        className="rounded-full w-12 h-12 p-0 flex items-center justify-center"
                        title="Add to Cart"
                      >
                        <ShoppingCart size={18} />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

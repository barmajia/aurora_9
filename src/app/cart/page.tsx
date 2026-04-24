"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  ArrowRight,
  Truck,
  CreditCard,
  ChevronLeft,
  ShieldCheck,
} from "lucide-react";
import { useCartStore } from "@/store/cart";
import CartItemComponent from "@/components/CartItem";
import { Button, Card } from "@/components/ui";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  const subtotal = items.reduce(
    (sum, item) => sum + (item.price || 0) * item.quantity,
    0,
  );

  const shipping = subtotal > 500 ? 0 : 25;
  const tax = subtotal * 0.08;
  const discount = subtotal > 1000 ? subtotal * 0.05 : 0;
  const finalTotal = subtotal + shipping + tax - discount;
  const totalSavings = discount + (shipping === 0 ? 25 : 0);

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background text-foreground pt-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-24 h-24 bg-zinc-100 dark:bg-zinc-900 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-zinc-200 dark:border-zinc-800">
            <ShoppingBag className="text-zinc-400 dark:text-zinc-600" size={40} />
          </div>

          <h1 className="text-4xl font-black italic tracking-tighter text-zinc-900 dark:text-white mb-4 uppercase">
            Cart is Empty
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mb-10 leading-relaxed">
            Your ecosystem is waiting for its first components. Start exploring our premium selections.
          </p>

          <Link href="/products">
            <Button size="lg" className="group w-full">
              Initialize Shopping
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground px-6 md:px-12 lg:px-24 py-32">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
            <div>
              <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter text-zinc-900 dark:text-white uppercase mb-4">
                Your <span className="text-blue-500">Cart</span>
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400 font-medium uppercase tracking-widest text-sm">
                System contains {items.length} unique components
              </p>
            </div>
            <Link
              href="/products"
              className="group flex items-center gap-2 text-sm font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Return to Catalog
            </Link>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-16 items-start">
          <div className="space-y-8">
            <div className="flex items-center justify-between pb-6 border-b border-zinc-100 dark:border-zinc-900">
              <span className="text-xs font-black uppercase tracking-widest text-zinc-400">
                Component Manifest
              </span>
              <button
                onClick={clearCart}
                className="text-xs font-black uppercase tracking-widest text-rose-500 hover:text-rose-600 transition-colors"
              >
                Flush All Items
              </button>
            </div>

            <div className="space-y-6">
              <AnimatePresence mode="popLayout" initial={false}>
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    layout
                  >
                    <div className="aurora-card p-2">
                      <CartItemComponent item={item} />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <aside className="lg:sticky lg:top-32">
            <div className="aurora-card p-8 bg-zinc-50 dark:bg-zinc-900/50">
              <h2 className="text-2xl font-black italic tracking-tighter text-zinc-900 dark:text-white uppercase mb-8">
                Order <span className="text-blue-500">Summary</span>
              </h2>

              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 dark:text-zinc-400 uppercase text-xs font-black tracking-widest">Subtotal</span>
                  <span className="font-bold text-zinc-900 dark:text-white">
                    ${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-500 dark:text-zinc-400 uppercase text-xs font-black tracking-widest">Logistics</span>
                    <Truck size={14} className="text-zinc-400" />
                  </div>
                  <span className="font-bold text-zinc-900 dark:text-white">
                    {shipping === 0 ? (
                      <span className="text-emerald-500">COMPLIMENTARY</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 dark:text-zinc-400 uppercase text-xs font-black tracking-widest">Protocol Tax</span>
                  <span className="font-bold text-zinc-900 dark:text-white">
                    ${tax.toFixed(2)}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between items-center text-emerald-500">
                    <span className="uppercase text-xs font-black tracking-widest text-emerald-500/70">Ecosystem Discount</span>
                    <span className="font-bold">-${discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800">
                  <div className="flex justify-between items-end">
                    <span className="font-black italic uppercase tracking-tighter text-zinc-900 dark:text-white text-xl">
                      Total
                    </span>
                    <div className="text-right">
                      <span className="text-4xl font-black italic tracking-tighter text-zinc-900 dark:text-white">
                        ${finalTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>

                {totalSavings > 0 && (
                  <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/20">
                    <p className="text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 text-center">
                      Net Savings: ${totalSavings.toFixed(2)}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-10">
                <Link href="/checkout" className="block w-full">
                  <Button size="lg" className="w-full group">
                    Initialize Checkout
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>

              <div className="mt-8 flex flex-col gap-3">
                <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  <ShieldCheck size={14} className="text-emerald-500" />
                  <span>End-to-End Encryption</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  <CreditCard size={14} />
                  <span>Secure Protocol Active</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

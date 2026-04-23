"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  Gift,
  Clock,
  CreditCard,
  Zap,
} from "lucide-react";
import { useCartStore } from "@/store/cart";
import CartItemComponent from "@/components/CartItem";
import { Button, Card, Magnetic } from "@/components/ui";

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
      <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-white dark:black">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-600px h-600px bg-primary/10 dark:bg-primary/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 dark:bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center relative z-10"
        >
          <motion.div
            className="w-32 h-32 bg-gradient-to-br from-black/5 to-black/10 dark:from-white/10 dark:to-white/5 border border-black/10 dark:border-white/10 rounded-[3.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl relative group"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-[3.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <ShoppingBag
              className="text-black/30 dark:text-white/30 group-hover:text-black dark:group-hover:text-white transition-all relative z-10"
              size={56}
              strokeWidth={1.5}
            />
          </motion.div>

          <h1 className="text-6xl md:text-7xl font-black tracking-tighter text-black dark:text-white mb-6 italic">
            Empty <span className="text-black/20 dark:text-white/20">Cart</span>
          </h1>
          <p className="text-sm font-medium text-black/40 dark:text-white/40 mb-12 uppercase tracking-[0.2em] leading-loose max-w-md mx-auto">
            Your collection awaits discovery. Explore our premium inventory.
          </p>

          <Magnetic strength={0.1}>
            <Link href="/products">
              <Button
                size="lg"
                className="h-16 px-12 rounded-2xl text-base gap-3"
              >
                <Zap size={18} />
                Explore Collection
                <ArrowRight size={16} />
              </Button>
            </Link>
          </Magnetic>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      {/* Main Background */}
      <div className="flex bg-white dark:bg-black" />
      {/* Animated Blobs */}
      <div className="fixed top-1/4 -left-48 w-96 h-96 bg-primary/10 dark:bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-1/4 -right-48 w-96 h-96 bg-white-500/10 dark:bg-black-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="min-h-screen pb-28 px-6 md:px-12 lg:px-24  mx-auto relative">
        {/* Header Section */}
        <header className="mb-16 pt-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between flex-wrap gap-4 mb-8"
          >
            <div className="flex items-center gap-3">
              <Sparkles size={16} className="text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-black dark:text-white italic">
                Secure Session • Encrypted
              </span>
            </div>
            <div className="flex items-center gap-2 text-black dark:text-white">
              <Clock size={12} />
              <span className="text-[9px] font-black uppercase tracking-wider">
                30min reserve
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-baseline justify-between flex-wrap gap-6"
          >
            <div>
              <h1 className="text-7xl md:text-8xl font-black italic tracking-tighter text-black dark:text-white uppercase mb-3">
                Shopping
                <span className="text-black/20 dark:text-white/20">Cart</span>
              </h1>
              <p className="text-black/30 dark:text-white/30 text-sm font-medium tracking-wide">
                {items.length} {items.length === 1 ? "item" : "items"} in your
                collection
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="px-6 py-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white backdrop-blur-sm"
            >
              <div className="flex items-center gap-2">
                <Gift size={14} className="text-primary" />
                <span className="text-9px font-black uppercase tracking-wider text-black dark:text-white">
                  Free shipping on orders $500+
                </span>
              </div>
            </motion.div>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12 xl:gap-20 items-start">
          {/* Cart Items Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between px-4 pb-4 border-b border-black/10 dark:border-white/10">
              <span className="text-[10px] font-black uppercase tracking-widest text-black/30 dark:text-white/30 italic">
                Inventory Assets ({items.length})
              </span>
              <button
                onClick={clearCart}
                className="group text-[9px] font-black uppercase tracking-widest text-black/30 dark:text-white/30 hover:text-rose-500 transition-all flex items-center gap-2"
              >
                <Trash2
                  size={14}
                  className="group-hover:scale-110 transition-transform"
                />
                Purge Cart
              </button>
            </div>

            <div className="space-y-3">
              <AnimatePresence mode="popLayout" initial={false}>
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    layout
                  >
                    <Card className="bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 transition-all duration-300 overflow-hidden group/card shadow-sm dark:shadow-none">
                      <CartItemComponent item={item} />
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Continue Shopping Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="pt-4"
            >
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black dark:text-white/30 hover:text-black/60 dark:hover:text-white/60 transition-colors group"
              >
                <ArrowRight
                  size={12}
                  className="group-hover:translate-x-1 transition-transform"
                />
                Continue Shopping
              </Link>
            </motion.div>
          </div>

          {/* Order Summary Sidebar */}
          <aside className="lg:sticky lg:top-32 flex flex-col gap-6">
            <Card className="bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-3xl overflow-hidden shadow-sm dark:shadow-none backdrop-blur-sm">
              <div className="p-8">
                <div className="flex items-center gap-2 mb-8">
                  <CreditCard size={16} className="text-primary" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-black/30 dark:text-white/30 italic">
                    Order Summary
                  </h3>
                </div>

                <div className="space-y-5">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm font-medium text-black/50 dark:text-white/50">
                      Subtotal
                    </span>
                    <span className="text-sm font-bold text-black dark:text-white">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-black/50 dark:text-white/50">
                        Shipping
                      </span>
                      <Truck
                        size={12}
                        className="text-black/30 dark:text-white/30"
                      />
                    </div>
                    <span className="text-sm font-bold text-black dark:text-white">
                      {shipping === 0 ? (
                        <span className="text-emerald-600 dark:text-emerald-400 text-[10px] font-black tracking-widest">
                          FREE
                        </span>
                      ) : (
                        `$${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm font-medium text-black/50 dark:text-white/50">
                      Tax (8%)
                    </span>
                    <span className="text-sm font-bold text-black dark:text-white">
                      ${tax.toFixed(2)}
                    </span>
                  </div>

                  {discount > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="flex justify-between items-center py-2 border-t border-black/10 dark:border-white/10 pt-4"
                    >
                      <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                        <Zap size={12} />
                        Discount (5%)
                      </span>
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        -${discount.toFixed(2)}
                      </span>
                    </motion.div>
                  )}

                  <div className="flex justify-between items-center pt-6 border-t border-black/10 dark:border-white/10">
                    <span className="text-base font-black uppercase tracking-wider text-black/60 dark:text-white/60">
                      Total
                    </span>
                    <motion.span
                      key={finalTotal}
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      className="text-4xl font-black italic text-black dark:text-white tracking-tighter"
                    >
                      ${finalTotal.toFixed(2)}
                    </motion.span>
                  </div>

                  {totalSavings > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-4 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20"
                    >
                      <p className="text-[9px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 text-center">
                        You saved ${totalSavings.toFixed(2)} on this order! ✨
                      </p>
                    </motion.div>
                  )}
                </div>

                <div className="mt-10 space-y-5">
                  <Magnetic strength={0.15}>
                    <Link href="/checkout" className="block w-full">
                      <Button
                        size="lg"
                        className="w-full h-14 rounded-xl text-sm gap-3 bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/20"
                        rightIcon={<ArrowRight size={16} />}
                      >
                        Proceed to Checkout
                      </Button>
                    </Link>
                  </Magnetic>

                  <div className="flex items-center justify-center gap-3 pt-4 opacity-60 dark:opacity-50">
                    <ShieldCheck
                      size={14}
                      className="text-black dark:text-white"
                    />
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-black dark:text-white">
                      256-bit SSL Secure
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Additional Info Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
                <Truck
                  size={18}
                  className="text-black/40 dark:text-white/40 mb-3"
                />
                <p className="text-[9px] font-black uppercase tracking-wider text-black/60 dark:text-white/60">
                  Fast Delivery
                </p>
                <p className="text-[8px] text-black/30 dark:text-white/30 mt-1">
                  3-5 business days
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
                <ShieldCheck
                  size={18}
                  className="text-black/40 dark:text-white/40 mb-3"
                />
                <p className="text-[9px] font-black uppercase tracking-wider text-black/60 dark:text-white/60">
                  Secure Payment
                </p>
                <p className="text-[8px] text-black/30 dark:text-white/30 mt-1">
                  Buyer protection
                </p>
              </div>
            </div>

            {/* Trust Badge */}
            <div className="p-5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-500 animate-pulse" />
                <span className="text-[8px] font-black uppercase tracking-wider text-black/50 dark:text-white/50">
                  Live Inventory
                </span>
              </div>
              <p className="text-[9px] text-black/30 dark:text-white/30">
                Items are reserved for 30 minutes
              </p>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

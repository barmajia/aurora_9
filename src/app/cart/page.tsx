'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Trash2, ArrowRight, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import CartItemComponent from '@/components/CartItem';
import { Button, Card, Magnetic } from '@/components/ui';

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const total = items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
  const shipping = total > 500 ? 0 : 25;
  const tax = total * 0.08;
  const finalTotal = total + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#020203]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center relative z-10"
        >
          <div className="w-32 h-32 bg-white/5 border border-white/10 rounded-[3.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl relative group">
             <div className="absolute inset-0 bg-primary/20 rounded-[3.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
             <ShoppingBag className="text-white/20 group-hover:text-white transition-colors relative z-10" size={56} strokeWidth={1} />
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-white mb-6 italic">Your bag is <span className="text-white/40">empty.</span></h1>
          <p className="text-sm font-medium text-white/30 mb-10 uppercase tracking-widest leading-loose">Discovery awaits in our premium inventory.</p>
          <Magnetic strength={0.1}>
            <Link href="/products">
              <Button size="lg" className="h-16 px-10 rounded-2xl">
                Explore The Market
              </Button>
            </Link>
          </Magnetic>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 max-w-[1400px] mx-auto">
      <header className="mb-16">
         <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-4"
         >
            <Sparkles size={16} className="text-primary animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Secured Session</span>
         </motion.div>
         <h1 className="text-6xl font-black italic tracking-tighter text-white uppercase">Shopping <span className="text-white/30">Cart</span></h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-16 items-start">
        <div className="space-y-6">
          <div className="flex items-center justify-between px-4 pb-6 border-b border-white/5">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/20 italic">Inventory Assets ({items.length})</span>
            <button onClick={clearCart} className="text-[9px] font-black uppercase tracking-widest text-white/20 hover:text-rose-500 transition-colors flex items-center gap-2">
              <Trash2 size={12} /> Purge Bag
            </button>
          </div>
          
          <div className="space-y-4">
            <AnimatePresence mode="popLayout" initial={false}>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card className="aurora-glass p-0 border-white/5 overflow-hidden group">
                     <CartItemComponent item={item} />
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <aside className="lg:sticky lg:top-32 gap-6 flex flex-col">
          <Card className="aurora-glass p-10 rounded-[3rem] border-white/5 shadow-2xl bg-white/[0.02]">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-10 italic">Financing Summary</h3>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-white/40">Subtotal</span>
                <span className="text-sm font-bold text-white">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                   <span className="text-sm font-bold text-white/40">Shipping</span>
                   <Truck size={12} className="text-white/20" />
                </div>
                <span className="text-sm font-bold text-white">
                  {shipping === 0 ? <span className="text-emerald-500 uppercase text-[10px] font-black tracking-widest">Free</span> : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between items-center pb-6 border-b border-white/10">
                <span className="text-sm font-bold text-white/40">Tax (8%)</span>
                <span className="text-sm font-bold text-white">${tax.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center pt-2">
                <span className="text-md font-black uppercase tracking-widest text-white/60">Total Value</span>
                <span className="text-3xl font-black italic text-white tracking-tighter">${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-12 space-y-4">
              <Magnetic strength={0.1}>
                <Link href="/checkout" className="block w-full">
                  <Button size="lg" className="w-full h-18 rounded-[1.5rem]" rightIcon={<ArrowRight size={18} />}>
                    Initialize Checkout
                  </Button>
                </Link>
              </Magnetic>
              <div className="flex items-center justify-center gap-3 py-4 opacity-30 grayscale saturate-0 pointer-events-none">
                 <ShieldCheck size={16} className="text-white" />
                 <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white">Secure Encrypted Protocol</span>
              </div>
            </div>
          </Card>

          <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 flex flex-col gap-4">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
                   <Truck size={18} className="text-white/40" />
                </div>
                <div className="flex flex-col">
                   <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Global Transit</span>
                   <span className="text-[9px] font-bold text-white/20 italic tracking-wide">3-5 Business Days Delivery</span>
                </div>
             </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
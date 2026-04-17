'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ShoppingBag, User, LogOut, Package, Menu, X, Heart, Store, Factory, Moon, Sun, Search, Globe, Sparkles, ChevronDown } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useAuthStore } from '@/store/auth';
import { useWishlistStore } from '@/store/wishlist';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import SellerHeader from './SellerHeader';
import FactoryHeader from './FactoryHeader';

export default function Header() {
  const pathname = usePathname();
  
  // 🧭 Route Guard - Switch to specialized headers
  if (pathname.startsWith('/seller')) return <SellerHeader />;
  if (pathname.startsWith('/factory')) return <FactoryHeader />;

  // --- Main Customer Header Logic ---
  const { items } = useCartStore();
  const { user, logout } = useAuthStore();
  const { items: wishlistItems } = useWishlistStore();
  const router = useRouter();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(true); // Default to dark for premium feel

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    // Theme sync
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, [darkMode]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
    router.push('/login');
  };

  return (
    <>
      <header className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-1000 py-6 px-6",
        isScrolled ? "py-3" : "py-6"
      )}>
        <div className="max-w-[1400px] mx-auto">
          <div className={cn(
            "rounded-[2.5rem] px-8 py-4 flex items-center justify-between transition-all duration-700 border border-white/10 shadow-2xl backdrop-blur-3xl",
            isScrolled ? "bg-black/60 scale-[0.98]" : "bg-white/5"
          )}>
            
            {/* Logo Section */}
            <div className="flex items-center gap-12">
              <Link href="/" className="flex items-center gap-3 group transition-transform hover:scale-105 active:scale-95">
                <div className="relative">
                  <div className="absolute -inset-2 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-rose-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                    <Sparkles size={20} />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-black italic tracking-tighter leading-none dark:text-white">
                    AURORA
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 leading-none mt-1">
                    Ecosystem
                  </span>
                </div>
              </Link>

              {/* Primary Navigation */}
              <nav className="hidden xl:flex items-center gap-2">
                <Link href="/products" className="px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-white/5 transition-all text-white/60 hover:text-white">
                  Collections
                </Link>
                <div className="relative group">
                   <button className="px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-white/5 transition-all text-white/60 hover:text-white flex items-center gap-2">
                     Services <ChevronDown size={12} />
                   </button>
                   {/* Deep dropdown menu can go here */}
                </div>
                <Link href="/seller" className="px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl border border-white/10 hover:border-emerald-500/50 hover:text-emerald-500 transition-all text-white/40">
                  Seller Portal
                </Link>
              </nav>
            </div>

            {/* Utility Actions */}
            <div className="flex items-center gap-6">
              <div className="hidden lg:relative lg:block group">
                <input
                  type="text"
                  placeholder="Initiate search..."
                  className="w-48 pl-12 pr-6 py-3 glass bg-white/5 border-white/10 rounded-2xl text-[10px] font-black tracking-widest uppercase focus:w-80 outline-none transition-all duration-700 placeholder:text-white/20"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-primary transition-colors" size={15} />
              </div>

              <div className="flex items-center gap-3">
                <Link href="/wishlist" className="p-3 text-white/40 hover:text-rose-500 transition-all relative">
                   <Heart size={20} />
                   {wishlistItems.length > 0 && (
                     <span className="absolute top-2 right-2 w-4 h-4 bg-rose-500 text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-black">
                       {wishlistItems.length}
                     </span>
                   )}
                </Link>
                
                <Link href="/cart" className="p-3 glass rounded-2xl border-white/10 hover:bg-white/10 transition-all relative group">
                  <ShoppingBag size={20} className="group-hover:rotate-12 transition-transform" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] px-1 bg-primary text-white text-[10px] font-black italic rounded-lg shadow-lg shadow-primary/30 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Link>

                <div className="h-8 w-[1px] bg-white/10 mx-2" />

                {user ? (
                  <div className="flex items-center gap-3 pl-2">
                    <button 
                      onClick={() => router.push('/profile')}
                      className="w-10 h-10 rounded-xl glass border-primary/20 flex items-center justify-center hover:scale-105 transition-all"
                    >
                       <User size={20} className="text-primary" />
                    </button>
                    <button onClick={handleLogout} className="text-white/40 hover:text-rose-500 transition-colors">
                      <LogOut size={20} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Link href="/login" className="text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white px-4">
                      Login
                    </Link>
                    <Link href="/signup" className="px-6 py-3 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all">
                      Join Now
                    </Link>
                  </div>
                )}
                
                <button
                  className="xl:hidden p-3 text-white"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  <Menu size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer placeholder */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-xl p-8 flex flex-col gap-8">
           <div className="flex justify-between items-center">
             <span className="text-2xl font-black italic tracking-tighter">AURORA</span>
             <button onClick={() => setMobileMenuOpen(false)}><X size={32} /></button>
           </div>
            {/* Mobile Navigation Links */}
            <nav className="flex flex-col gap-4 mt-8">
              <Link
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-4 p-6 glass rounded-2xl text-lg font-black uppercase tracking-widest text-white/80"
              >
                <Package size={24} className="text-primary" />
                Collections
              </Link>
              <Link
                href="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-4 p-6 glass rounded-2xl text-lg font-black uppercase tracking-widest text-white/80"
              >
                <ShoppingBag size={24} className="text-rose-500" />
                Shopping Bag ({totalItems})
              </Link>
              <Link
                href="/seller"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-4 p-6 glass rounded-2xl text-lg font-black uppercase tracking-widest text-white/80 border-emerald-500/20"
              >
                <Store size={24} className="text-emerald-500" />
                Seller Portal
              </Link>
              <Link
                href="/factory"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-4 p-6 glass rounded-2xl text-lg font-black uppercase tracking-widest text-white/80 border-indigo-500/20"
              >
                <Factory size={24} className="text-indigo-500" />
                Factory Hub
              </Link>
            </nav>

            <div className="mt-auto space-y-4">
               {user ? (
                 <button 
                   onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                   className="w-full p-6 glass rounded-2xl text-rose-500 font-black uppercase tracking-widest flex items-center justify-center gap-3"
                 >
                   <LogOut size={24} /> Terminate Session
                 </button>
               ) : (
                 <Link
                   href="/signup"
                   onClick={() => setMobileMenuOpen(false)}
                   className="w-full p-6 bg-primary text-white rounded-2xl text-center font-black uppercase tracking-widest shadow-2xl shadow-primary/30 flex items-center justify-center gap-3"
                 >
                   <Sparkles size={24} /> Get Started
                 </Link>
               )}
            </div>
         </div>
      )}
    </>
  );
}

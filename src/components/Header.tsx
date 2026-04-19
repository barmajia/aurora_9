"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  User,
  LogOut,
  Menu,
  X,
  Heart,
  Search,
  Sparkles,
  Sun,
  Moon,
} from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { useWishlistStore } from "@/store/wishlist";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import {
  Button,
  LanguageSwitcher,
  ThemeSwitcher,
  Magnetic,
} from "@/components/ui";

export default function Header() {
  const pathname = usePathname();
  const { items } = useCartStore();
  const { user } = useAuthStore();
  const { items: wishlistItems } = useWishlistStore();
  const router = useRouter();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname.startsWith("/seller")) return null;
  if (pathname.startsWith("/factory")) return null;

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-[100] transition-all duration-500 pt-6",
          isScrolled ? "pt-2" : "pt-6"
        )}
      >
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className={cn(
            "flex justify-between items-center gap-8 px-8 py-3 rounded-full transition-all duration-500 border",
            isScrolled
              ? "bg-white/70 dark:bg-zinc-900/70 backdrop-blur-3xl border-zinc-200 dark:border-zinc-800 shadow-sm"
              : "bg-transparent border-transparent"
          )}>
            <Link href="/" className="flex items-center gap-3 group">
              <div
                className={cn(
                  "w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-500",
                  isScrolled
                    ? "bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700"
                    : "bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 group-hover:scale-105",
                )}
              >
                <Sparkles className="h-5 w-5 text-black dark:text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-black dark:text-white leading-none uppercase">
                  Aurora
                </span>
                <span className="text-[9px] font-medium tracking-[0.2em] text-zinc-400 uppercase leading-none mt-1">
                  Ecosystem
                </span>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-1 p-1 bg-zinc-50/50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 rounded-full">
              {[
                { label: "Inventory", path: "/products" },
                { label: "Community", path: "/about" },
                { label: "Updates", path: "/templates" },
              ].map((item) => {
                const isActive = pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={cn(
                      "px-6 py-2 text-sm font-medium transition-all duration-300 rounded-full",
                      isActive
                        ? "text-black dark:text-white bg-white dark:bg-zinc-900 shadow-sm font-bold"
                        : "text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-4">
              <div className="hidden xl:block relative group">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-40 pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700 rounded-full text-sm font-medium outline-none focus:w-56 focus:bg-white dark:focus:bg-black focus:border-zinc-200 dark:focus:border-zinc-600 transition-all placeholder:text-zinc-300 dark:placeholder:text-zinc-600 text-zinc-900 dark:text-white"
                />
                <Search
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-300 dark:text-zinc-600 group-focus-within:text-zinc-900 dark:group-focus-within:text-white transition-colors"
                  size={14}
                />
              </div>

              <div className="flex items-center gap-1.5">
                <ThemeSwitcher />
                <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 mx-1 hidden lg:block" />
                
                <Magnetic strength={0.2}>
                  <Link
                    href="/wishlist"
                    className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-rose-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-full transition-all relative"
                  >
                    <Heart size={18} />
                    {wishlistItems.length > 0 && (
                      <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-rose-500 rounded-full" />
                    )}
                  </Link>
                </Magnetic>

                <Magnetic strength={0.2}>
                  <Link
                    href="/cart"
                    className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-full transition-all relative"
                  >
                    <ShoppingBag size={18} />
                    {totalItems > 0 && (
                      <span className="absolute top-1.5 right-1.5 min-w-[16px] h-[16px] bg-black dark:bg-white text-white dark:text-black text-[8px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-zinc-900">
                        {totalItems}
                      </span>
                    )}
                  </Link>
                </Magnetic>
              </div>

              <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 mx-1 hidden lg:block" />

              {user ? (
                <div className="hidden lg:flex items-center gap-3">
                  <button
                    onClick={() => router.push("/profile")}
                    className="flex items-center gap-3 pl-3 pr-1 py-1 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-full transition-all group"
                  >
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-bold text-zinc-900 dark:text-white leading-none">
                        {user.name?.split(" ")[0] || "User"}
                      </span>
                      <span className="text-[8px] font-medium tracking-widest text-zinc-400 uppercase mt-1">
                        Profile
                      </span>
                    </div>
                    <div className="w-9 h-9 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center border border-zinc-200 dark:border-zinc-700 overflow-hidden">
                      {user.avatar_url ? (
                        <Image src={user.avatar_url} alt="Avatar" width={36} height={36} className="object-cover" />
                      ) : (
                        <User size={14} className="text-zinc-400" />
                      )}
                    </div>
                  </button>
                </div>
              ) : (
                <div className="hidden lg:flex items-center gap-3">
                  <Button
                    onClick={() => router.push("/signup")}
                    size="sm"
                    className="h-9 px-5 rounded-full"
                  >
                    Join
                  </Button>
                </div>
              )}

              <button
                className="lg:hidden w-10 h-10 flex items-center justify-center bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-full"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu size={18} className="text-zinc-600 dark:text-zinc-300" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            className="fixed inset-0 z-[200] bg-white dark:bg-zinc-950 flex flex-col p-8 lg:hidden"
          >
            <div className="flex justify-between items-center mb-16">
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-black dark:text-white leading-none uppercase">
                  Aurora
                </span>
                <span className="text-[9px] font-medium tracking-[0.2em] text-zinc-400 uppercase leading-none mt-1">
                  Premium Ecosystem
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-12 h-12 flex items-center justify-center bg-zinc-50 dark:bg-zinc-900 rounded-full"
              >
                <X size={24} className="text-black dark:text-white" />
              </button>
            </div>

            <nav className="flex flex-col gap-8">
              {[
                { label: "Inventory", path: "/products" },
                { label: "Community", path: "/about" },
                { label: "Updates", path: "/templates" },
              ].map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-4xl font-bold tracking-tighter text-black dark:text-white hover:text-zinc-500 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto pt-12 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <ThemeSwitcher />
                  <LanguageSwitcher />
               </div>
               {user ? (
                 <Button variant="ghost" onClick={handleLogout} className="text-rose-500">Sign Out</Button>
               ) : (
                 <Button onClick={() => router.push('/login')}>Sign In</Button>
               )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  LogOut,
  Bell,
  User,
  Search,
  Store,
  Menu,
  X,
} from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function SellerHeader() {
  const { user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const navLinks = [
    { href: "/seller/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/seller/products", label: "Products", icon: Package },
    { href: "/seller/orders", label: "Orders", icon: ShoppingCart },
    { href: "/seller/analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-[100] transition-all duration-700 h-20 flex items-center",
          isScrolled
            ? "bg-[#050508]/80 backdrop-blur-2xl border-b border-white/5 shadow-2xl"
            : "bg-transparent border-b border-transparent",
        )}
      >
        <div className="w-full px-6 lg:px-12 flex justify-between items-center gap-8">
          {/* Logo & Seller Brand */}
          <Link href="/" className="flex items-center gap-4 group">
            <div
              className={cn(
                "w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-500 shadow-xl",
                isScrolled
                  ? "bg-white/5 border border-white/10"
                  : "bg-emerald-500/20 border border-emerald-500/30 group-hover:scale-110",
              )}
            >
              <Store className="h-6 w-6 text-emerald-500 transition-transform group-hover:rotate-12" />
            </div>
            <div className="flex flex-col hidden sm:flex">
              <span className="text-2xl font-black italic tracking-tighter leading-none text-emerald-500 transition-colors group-hover:text-emerald-400">
                AURORA
              </span>
              <span className="text-[8px] font-black uppercase tracking-[0.5em] text-emerald-500/50 italic mt-1 relative left-[2px]">
                Merchant Node
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-2 p-2 bg-white/5 border border-white/10 rounded-[2rem] backdrop-blur-md">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 px-6 py-2.5 rounded-3xl text-[10px] font-black uppercase tracking-widest transition-all",
                    isActive
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                      : "text-white/40 hover:text-white hover:bg-white/10",
                  )}
                >
                  <Icon size={14} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Quick Actions */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:block relative group">
              <input
                type="text"
                placeholder="Search orders..."
                className="w-56 pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-1.5rem text-[10px] font-bold uppercase tracking-widest outline-none focus:w-72 focus:bg-white/10 transition-all placeholder:text-white/20"
              />
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-emerald-500 transition-colors"
                size={16}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded-md bg-white/10 text-[8px] font-black opacity-50">
                ⌘K
              </div>
            </div>

            <button className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all relative">
              <Bell
                size={18}
                className="text-white/60 hover:text-emerald-500"
              />
              <span className="absolute top-3 right-3 w-2 h-2 bg-emerald-500 rounded-full border-2 border-[#050508]" />
            </button>

            <div className="h-8 w-px bg-white/10 mx-2 hidden md:block" />

            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end hidden lg:flex">
                <span className="text-[10px] font-black uppercase tracking-widest text-white">
                  {user?.displayName ||
                    user?.name ||
                    user?.email?.split("@")[0] ||
                    "Seller Admin"}
                </span>
                <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500/50">
                  ID: {user?.id?.slice(0, 6) || "SYS"}
                </span>
              </div>
              <button
                onClick={() => router.push("/profile")}
                className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center hover:bg-emerald-500/20 transition-all group"
              >
                <User
                  size={18}
                  className="text-emerald-500 group-hover:scale-110 transition-transform"
                />
              </button>
              <button
                onClick={handleLogout}
                className="hidden md:flex w-12 h-12 items-center justify-center border border-transparent rounded-2xl hover:bg-white/5 hover:text-rose-500 transition-colors"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
              <button
                className="xl:hidden w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[200] bg-[#050508]/95 backdrop-blur-3xl flex flex-col p-8"
          >
            <div className="flex justify-between items-center mb-16">
              <div className="flex flex-col">
                <span className="text-3xl font-black italic tracking-tighter text-emerald-500 leading-none">
                  AURORA
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-500/50 italic mt-1 relative left-[2px]">
                  Merchant Node
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <nav className="flex flex-col gap-6">
              {navLinks.map((link, i) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="group flex items-center gap-6"
                    >
                      <div
                        className={cn(
                          "w-16 h-16 rounded-[2rem] flex items-center justify-center border transition-all",
                          isActive
                            ? "bg-emerald-500/20 border-emerald-500/30"
                            : "bg-white/5 border-white/5 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20",
                        )}
                      >
                        <Icon
                          size={20}
                          className={cn(
                            "transition-all",
                            isActive
                              ? "text-emerald-500"
                              : "text-white/40 group-hover:text-emerald-500 group-hover:translate-x-2",
                          )}
                        />
                      </div>
                      <span
                        className={cn(
                          "text-2xl font-black uppercase tracking-widest transition-colors",
                          isActive
                            ? "text-emerald-500"
                            : "text-white/60 group-hover:text-white",
                        )}
                      >
                        {link.label}
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            <div className="mt-auto pt-10 border-t border-white/5 flex gap-4">
              <button
                onClick={() => {
                  router.push("/profile");
                  setMobileMenuOpen(false);
                }}
                className="flex-1 h-16 rounded-[2rem] bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3"
              >
                <User size={18} />
                Profile
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="h-16 px-8 rounded-[2rem] bg-rose-500/10 text-rose-500 border-0 flex items-center justify-center hover:bg-rose-500/20"
              >
                <LogOut size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

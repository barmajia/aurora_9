'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Factory, Cpu, LineChart, Users, Forklift, Settings, LogOut, Bell, User, Search, Activity } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

export default function FactoryHeader() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
    router.push('/login');
  };

  const navLinks = [
    { href: '/factory/dashboard', label: 'Monitor', icon: Cpu },
    { href: '/factory/production', label: 'Production', icon: Activity },
    { href: '/factory/connections', label: 'Network', icon: Users },
    { href: '/factory/logistics', label: 'Logistics', icon: Forklift },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] transition-all duration-500 py-4 px-6">
      <div className="max-w-[1600px] mx-auto">
        <div className="glass rounded-[2rem] px-8 py-3 flex items-center justify-between border-white/10 shadow-2xl backdrop-blur-3xl bg-indigo-500/5">
          {/* Logo & Factory Identity */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                <Factory size={22} />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black italic tracking-tighter leading-none text-indigo-500">
                  AURORA
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 leading-none mt-1 dark:text-white">
                  Industrial Core
                </span>
              </div>
            </Link>

            <div className="h-8 w-[1px] bg-white/10 hidden md:block" />

            {/* Factory Navigation */}
            <nav className="hidden xl:flex items-center gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300",
                      isActive
                        ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                        : "text-foreground/60 hover:text-foreground hover:bg-white/5"
                    )}
                  >
                    <Icon size={14} />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Core Controls */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-3 px-4 py-2 rounded-2xl glass bg-white/5 border-white/10">
               <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_10px_#6366f1]" />
               <span className="text-[9px] font-black uppercase tracking-widest opacity-60">System Live</span>
            </div>

            <button className="p-3 glass rounded-2xl hover:bg-white/10 transition-all relative">
              <Bell size={18} className="text-foreground/60" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-background" />
            </button>

            <div className="h-8 w-[1px] bg-white/10" />

            <div className="flex items-center gap-3 pl-2">
              <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-[10px] font-black italic tracking-tight">
                  {user?.user_metadata?.full_name || 'Plant Supervisor'}
                </span>
                <span className="text-[8px] font-black uppercase tracking-widest text-indigo-500 text-right">
                  Optimal Capacity
                </span>
              </div>
              <button 
                onClick={() => router.push('/profile')}
                className="w-10 h-10 rounded-xl glass border-indigo-500/20 flex items-center justify-center hover:scale-105 transition-all overflow-hidden"
              >
                 <User size={20} className="text-indigo-500" />
              </button>
              <button 
                onClick={handleLogout}
                className="p-3 hover:text-rose-500 transition-colors"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

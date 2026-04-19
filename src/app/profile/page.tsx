'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { User, Package, ShoppingBag, DollarSign, Settings, LogOut, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { Button, Card } from '@/components/ui';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  age_range: string;
  total_orders: number;
  total_spent: number;
  last_purchase_date: string;
  created_at: string;
}

export default function ProfilePage() {
  const { t } = useTranslation();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const fetchCustomer = useCallback(async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setCustomer(data);
    } catch (err) {
      console.error('Error fetching customer:', err);
    } finally {
      setLoading(false);
    }
  }, [user, router]);

  useEffect(() => {
    fetchCustomer();
  }, [fetchCustomer]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
    router.push('/login');
  };

  if (loading || !customer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="pulse-glow p-12 rounded-3xl">
          <p className="text-white/60">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-40 pb-20 px-6">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 items-start">
        <div className="space-y-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-8"
          >
            <div className="w-32 h-32 bg-gradient-to-br from-primary to-secondary rounded-[3rem] p-0.5 shadow-2xl relative group">
               <div className="absolute inset-0 bg-primary/20 blur-2xl group-hover:blur-3xl transition-all" />
               <div className="w-full h-full bg-[#050508] rounded-[3rem] flex items-center justify-center text-5xl font-black italic relative z-10">
                {customer.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500/60">Active Session</span>
              </div>
              <h1 className="text-6xl font-black italic tracking-tighter text-white uppercase leading-none">
                {customer.name || 'User'}
              </h1>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mt-3 italic">
                Synchronization started on {new Date(customer.created_at).toLocaleDateString()}
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8">
              <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/20 mb-8 flex items-center gap-3 italic">
                <User size={14} className="text-primary" /> Identifier Protocol
              </h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center group">
                  <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Global Mail</span>
                  <span className="text-sm font-black italic text-white group-hover:text-primary transition-colors">{customer.email || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center group">
                  <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Network Node</span>
                  <span className="text-sm font-black italic text-white group-hover:text-primary transition-colors">{customer.phone || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center group">
                  <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Cycle Phase</span>
                  <span className="text-sm font-black italic text-white group-hover:text-primary transition-colors">{customer.age_range || 'Unknown'}</span>
                </div>
              </div>
            </Card>

            <Card className="p-8">
              <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/20 mb-8 flex items-center gap-3 italic">
                <ShoppingBag size={14} className="text-secondary" /> Asset Statistics
              </h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center group">
                  <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Acquired Assets</span>
                  <span className="text-xl font-black italic text-white group-hover:text-secondary transition-all">{customer.total_orders || 0}</span>
                </div>
                <div className="flex justify-between items-center group">
                  <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Investment</span>
                  <span className="text-xl font-black italic text-emerald-400 group-hover:scale-110 transition-all">${(customer.total_spent || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center group">
                  <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Last Activity</span>
                  <span className="text-sm font-black italic text-white group-hover:text-secondary transition-colors">
                    {customer.last_purchase_date 
                      ? new Date(customer.last_purchase_date).toLocaleDateString()
                      : 'Zero Activity'}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <aside className="space-y-8">
          <Card className="p-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-10 italic">Module Shortcuts</h3>
            <div className="space-y-4">
              {[
                { label: 'Inventory History', path: '/orders', icon: Package },
                { label: 'Security Protocols', path: '/settings', icon: Settings },
              ].map((link) => (
                <Link key={link.path} href={link.path} className="flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all group">
                  <span className="flex items-center gap-4 text-[11px] font-black uppercase tracking-widest text-white/60 group-hover:text-white transition-colors">
                    <link.icon size={16} className="text-white/20 group-hover:text-primary transition-colors" /> {link.label}
                  </span>
                  <ChevronRight size={16} className="text-white/20 group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
              
              <button onClick={handleLogout} className="w-full flex items-center justify-between p-5 bg-rose-500/5 border border-rose-500/10 rounded-2xl hover:bg-rose-500/10 hover:border-rose-500/20 transition-all group text-rose-500">
                <span className="flex items-center gap-4 text-[11px] font-black uppercase tracking-widest group-hover:text-rose-400 transition-colors">
                  <LogOut size={16} className="opacity-40 group-hover:opacity-100 transition-opacity" /> Terminate Session
                </span>
                <ChevronRight size={16} className="opacity-40 group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </Card>
          
          <div className="p-10 aurora-glass rounded-[3rem] text-center relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
             <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center mx-auto mb-6 transition-transform group-hover:rotate-12">
                <Settings size={28} className="text-white/20 group-hover:text-white" />
             </div>
             <h4 className="text-sm font-black uppercase tracking-widest mb-2 italic">Support Protocol</h4>
             <p className="text-[10px] font-medium text-white/30 uppercase leading-relaxed">Direct connection to the core administration.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Package, ChevronRight, Calendar, DollarSign, Clock, ArrowLeft, Search, Filter } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { Button, Card } from '@/components/ui';

interface Order {
  id: string;
  user_id: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_method: string;
  created_at: string;
  shipping_address: any;
}

const STATUS_COLORS = {
  pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  processing: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  shipped: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  delivered: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  cancelled: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
};

const STATUS_LABELS = {
  pending: 'Pending Authorization',
  processing: 'Processing',
  shipped: 'In Transit',
  delivered: 'Delivered',
  cancelled: 'Terminated',
};

export default function OrdersPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | Order['status']>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchOrders = useCallback(async () => {
    if (!user) {
      router.push('/login?redirect=/orders');
      return;
    }
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  }, [user, router]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === 'all' || order.status === filter;
    const matchesSearch = searchTerm === '' || 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (!user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="pulse-glow p-12 rounded-3xl">
          <p className="text-white/60">Synchronizing order history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-40 pb-20 px-6">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <Link href="/profile" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white transition-colors mb-6">
            <ArrowLeft size={14} strokeWidth={3} /> Return to Profile
          </Link>
          <h1 className="text-6xl font-black italic tracking-tighter text-white uppercase leading-[0.8]">
            Order <span className="text-blue-500">History</span>
          </h1>
          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mt-3 italic">
            {orders.length} Total Transactions Recorded
          </p>
        </motion.div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-6 mb-12">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
            <input
              type="text"
              placeholder="SEARCH BY ORDER ID OR STATUS"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold uppercase tracking-widest text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-2">
            {(['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                  filter === status
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-white/5 text-white/40 border border-white/10 hover:bg-white/10'
                }`}
              >
                {status === 'all' ? 'All Orders' : STATUS_LABELS[status]}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <Card className="p-16 text-center">
            <Package className="mx-auto mb-6 text-white/10" size={64} />
            <h3 className="text-xl font-black italic uppercase text-white/40 mb-2">No Orders Found</h3>
            <p className="text-sm text-white/20 uppercase tracking-widest">
              {searchTerm || filter !== 'all' 
                ? 'Adjust your search parameters' 
                : 'Initialize your first transaction'}
            </p>
            {!searchTerm && filter === 'all' && (
              <Link href="/products" className="mt-8 inline-block">
                <Button size="lg">Explore Catalog</Button>
              </Link>
            )}
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order, idx) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link href={`/orders/${order.id}`}>
                  <Card className="p-8 hover:bg-white/[0.03] transition-colors group cursor-pointer">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      {/* Left: Order Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
                            Order #{order.id.substring(0, 8).toUpperCase()}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${STATUS_COLORS[order.status]}`}>
                            {STATUS_LABELS[order.status]}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                          <div className="flex items-center gap-3">
                            <Calendar className="text-white/20" size={16} />
                            <div>
                              <p className="text-[9px] font-black uppercase tracking-widest text-white/20">Date</p>
                              <p className="text-sm font-bold text-white">
                                {new Date(order.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <DollarSign className="text-white/20" size={16} />
                            <div>
                              <p className="text-[9px] font-black uppercase tracking-widest text-white/20">Total</p>
                              <p className="text-sm font-bold text-emerald-400">
                                ${order.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <Package className="text-white/20" size={16} />
                            <div>
                              <p className="text-[9px] font-black uppercase tracking-widest text-white/20">Payment</p>
                              <p className="text-sm font-bold text-white uppercase">{order.payment_method}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <Clock className="text-white/20" size={16} />
                            <div>
                              <p className="text-[9px] font-black uppercase tracking-widest text-white/20">Status</p>
                              <p className="text-sm font-bold text-white capitalize">{order.status}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Right: Arrow */}
                      <div className="flex items-center">
                        <ChevronRight className="text-white/20 group-hover:text-blue-500 group-hover:translate-x-2 transition-all" size={24} />
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

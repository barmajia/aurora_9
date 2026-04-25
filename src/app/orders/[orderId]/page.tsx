"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Package, Calendar, DollarSign, CreditCard, Truck, 
  CheckCircle, Clock, Download, RotateCcw, Home
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { Button, Card } from '@/components/ui';
import { useCartStore } from '@/store/cart';
import { useToastStore } from '@/store/toast';

interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  products?: any;
}

interface Order {
  id: string;
  user_id: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_method: string;
  fawry_ref?: string | null;
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

const TIMELINE_STEPS = [
  { status: 'pending', label: 'Order Placed', icon: Clock },
  { status: 'processing', label: 'Processing', icon: Package },
  { status: 'shipped', label: 'Shipped', icon: Truck },
  { status: 'delivered', label: 'Delivered', icon: CheckCircle },
];

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuthStore();
  const addItem = useCartStore((state) => state.addItem);
  const addToast = useToastStore((state) => state.addToast);
  
  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrder = useCallback(async () => {
    if (!user || !params.orderId) {
      router.push('/login?redirect=/orders');
      return;
    }
    try {
      // Fetch order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', params.orderId)
        .eq('user_id', user.id)
        .single();

      if (orderError) throw orderError;
      if (!orderData) {
        router.push('/orders');
        return;
      }
      setOrder(orderData);

      // Fetch order items
      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select('*, products(*)')
        .eq('order_id', params.orderId);

      if (itemsError) throw itemsError;
      setOrderItems(itemsData || []);
    } catch (err) {
      console.error('Error fetching order:', err);
    } finally {
      setLoading(false);
    }
  }, [user, params.orderId, router]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleReorder = () => {
    orderItems.forEach((item) => {
      if (item.products) {
        for (let i = 0; i < item.quantity; i++) {
          addItem({
            ...item.products,
            price: item.price,
          });
        }
      }
    });
    addToast(`All items from order added to cart`, "success");
    router.push('/cart');
  };

  const handleDownloadInvoice = () => {
    // In a real app, this would generate a PDF
    addToast("Invoice download initiated", "info");
  };

  if (!user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="pulse-glow p-12 rounded-3xl">
          <p className="text-white/60">Retrieving order data...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="mx-auto mb-6 text-white/10" size={64} />
          <h2 className="text-2xl font-black italic uppercase text-white/40 mb-4">Order Not Found</h2>
          <Link href="/orders">
            <Button>Return to Orders</Button>
          </Link>
        </div>
      </div>
    );
  }

  const shippingAddress = typeof order.shipping_address === 'string' 
    ? JSON.parse(order.shipping_address) 
    : order.shipping_address;

  const currentStatusIndex = TIMELINE_STEPS.findIndex(step => step.status === order.status);

  return (
    <div className="min-h-screen pt-40 pb-20 px-6">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <Link href="/orders" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white transition-colors mb-6">
            <ArrowLeft size={14} strokeWidth={3} /> Back to Orders
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
                  Order #{order.id.substring(0, 8).toUpperCase()}
                </span>
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${STATUS_COLORS[order.status]}`}>
                  {order.status.toUpperCase()}
                </span>
              </div>
              <h1 className="text-5xl font-black italic tracking-tighter text-white uppercase leading-[0.8]">
                Order <span className="text-blue-500">Details</span>
              </h1>
            </div>
            
            <div className="flex gap-4">
              <Button onClick={handleDownloadInvoice} variant="outline" className="gap-2">
                <Download size={18} />
                Invoice
              </Button>
              <Button onClick={handleReorder} className="gap-2">
                <RotateCcw size={18} />
                Reorder
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12">
          {/* Main Content */}
          <div className="space-y-12">
            {/* Order Items */}
            <Card className="p-8">
              <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/20 mb-8 flex items-center gap-3 italic">
                <Package size={14} className="text-blue-500" /> Transaction Items
              </h2>
              
              <div className="space-y-6">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex gap-6 pb-6 border-b border-white/5 last:border-0 last:pb-0">
                    <div className="w-24 h-24 rounded-2xl bg-white/5 overflow-hidden flex-shrink-0">
                      {item.products?.images?.[0]?.url ? (
                        <img 
                          src={item.products.images[0].url} 
                          alt={item.products.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/10">
                          <Package size={32} />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-black italic uppercase text-white mb-2">
                        {item.products?.name || 'Product Unavailable'}
                      </h3>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">
                        {item.products?.category || 'Unknown Category'}
                      </p>
                      <div className="flex items-center gap-6">
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-white/20">Quantity</p>
                          <p className="text-sm font-bold text-white">{item.quantity}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-white/20">Unit Price</p>
                          <p className="text-sm font-bold text-white">${item.price.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-white/20">Subtotal</p>
                          <p className="text-sm font-bold text-emerald-400">
                            ${(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Order Timeline */}
            <Card className="p-8">
              <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/20 mb-8 flex items-center gap-3 italic">
                <Truck size={14} className="text-blue-500" /> Logistics Tracking
              </h2>
              
              <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-px bg-white/10" />
                
                {TIMELINE_STEPS.map((step, idx) => {
                  const isCompleted = idx <= currentStatusIndex;
                  const isCurrent = idx === currentStatusIndex;
                  const Icon = step.icon;
                  
                  return (
                    <div key={step.status} className="flex gap-6 mb-8 last:mb-0 relative">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 z-10 transition-all ${
                        isCompleted 
                          ? isCurrent 
                            ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
                            : 'bg-emerald-500/20 text-emerald-500'
                          : 'bg-white/5 text-white/20'
                      }`}>
                        <Icon size={20} />
                      </div>
                      
                      <div className="pt-3">
                        <h3 className={`text-sm font-black uppercase tracking-widest mb-1 ${
                          isCompleted ? 'text-white' : 'text-white/20'
                        }`}>
                          {step.label}
                        </h3>
                        {isCurrent && (
                          <p className="text-[10px] font-medium text-blue-400 uppercase tracking-widest animate-pulse">
                            Current Status
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            {/* Order Summary */}
            <Card className="p-8">
              <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/20 mb-8 flex items-center gap-3 italic">
                <DollarSign size={14} className="text-emerald-500" /> Financial Summary
              </h2>
              
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Subtotal</span>
                  <span className="text-sm font-bold text-white">
                    ${order.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Payment Method</span>
                  <span className="text-sm font-bold text-white uppercase flex items-center gap-2">
                    <CreditCard size={14} />
                    {order.payment_method}
                  </span>
                </div>
                
                {order.fawry_ref && (
                  <div className="p-4 bg-[#FFD700]/10 border border-[#FFD700]/20 rounded-xl">
                    <p className="text-[9px] font-black uppercase tracking-widest text-[#FFD700] mb-1">Fawry Reference</p>
                    <p className="text-sm font-mono font-bold text-[#FFD700]">{order.fawry_ref}</p>
                  </div>
                )}
                
                <div className="pt-6 border-t border-white/10">
                  <div className="flex justify-between items-end">
                    <span className="font-black italic uppercase tracking-tighter text-white text-xl">Total Paid</span>
                    <span className="text-3xl font-black italic tracking-tighter text-emerald-400">
                      ${order.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Shipping Address */}
            <Card className="p-8">
              <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/20 mb-8 flex items-center gap-3 italic">
                <Home size={14} className="text-blue-500" /> Delivery Coordinates
              </h2>
              
              {shippingAddress ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-1">Recipient</p>
                    <p className="text-sm font-bold text-white">{shippingAddress.name}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-1">Address</p>
                    <p className="text-sm font-bold text-white">{shippingAddress.address}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-1">City</p>
                      <p className="text-sm font-bold text-white">{shippingAddress.city}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-1">Postal Code</p>
                      <p className="text-sm font-bold text-white">{shippingAddress.zip}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-white/40">Shipping address not available</p>
              )}
            </Card>

            {/* Order Date */}
            <Card className="p-8">
              <div className="flex items-center gap-4">
                <Calendar className="text-white/20" size={24} />
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-1">Order Placed</p>
                  <p className="text-sm font-bold text-white">
                    {new Date(order.created_at).toLocaleDateString(undefined, { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}

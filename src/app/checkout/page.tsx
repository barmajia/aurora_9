'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, CreditCard, Lock, Truck, CheckCircle, 
  ArrowLeft, ArrowRight, Package, AlertTriangle, Sparkles, ShieldCheck,
  QrCode, Zap
} from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useAuthStore } from '@/store/auth';
import { supabase } from '@/lib/supabase';
import { Button, Input, Card, Magnetic } from '@/components/ui';
import { cn } from '@/lib/utils';

interface CheckoutForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  cardNumber: string;
  expDate: string;
  cvv: string;
}

const STEPS = [
  { id: 'shipping', label: 'Logistics', icon: Truck },
  { id: 'payment', label: 'Financing', icon: CreditCard },
  { id: 'confirm', label: 'Review', icon: CheckCircle },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [step, setStep] = useState<'shipping' | 'payment' | 'confirm'>('shipping');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'fawry'>('card');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fawryRef, setFawryRef] = useState<string | null>(null);
  
  const [form, setForm] = useState<CheckoutForm>({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardNumber: '',
    expDate: '',
    cvv: '',
  });

  const subtotal = items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 25;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/checkout');
    }
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [user, items.length, router]);

  const validateShipping = () => {
    const newErrors: Record<string, string> = {};
    if (!form.firstName) newErrors.firstName = 'Required';
    if (!form.lastName) newErrors.lastName = 'Required';
    if (!form.email) newErrors.email = 'Required';
    if (!form.phone) newErrors.phone = 'Required';
    if (!form.address) newErrors.address = 'Required';
    if (!form.city) newErrors.city = 'Required';
    if (!form.zipCode) newErrors.zipCode = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePayment = () => {
    if (paymentMethod === 'fawry') return true;
    const newErrors: Record<string, string> = {};
    if (!form.cardNumber || form.cardNumber.replace(/\s/g, '').length < 16) {
      newErrors.cardNumber = 'Invalid card number';
    }
    if (!form.expDate || !/^\d{2}\/\d{2}$/.test(form.expDate)) {
      newErrors.expDate = 'Invalid (MM/YY)';
    }
    if (!form.cvv || form.cvv.length < 3) {
      newErrors.cvv = 'Invalid CVV';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleShippingSubmit = () => {
    if (validateShipping()) {
      setStep('payment');
    }
  };

  const handlePaymentSubmit = () => {
    if (validatePayment()) {
      if (paymentMethod === 'fawry' && !fawryRef) {
        const ref = `FWRY-${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Date.now().toString().slice(-4)}`;
        setFawryRef(ref);
      }
      setStep('confirm');
    }
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user?.id,
          total: total,
          status: 'pending',
          payment_method: paymentMethod,
          fawry_ref: fawryRef,
          shipping_address: JSON.stringify({
            name: `${form.firstName} ${form.lastName}`,
            address: form.address,
            city: form.city,
            state: form.state,
            zip: form.zipCode,
          }),
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
      }));

      await supabase.from('order_items').insert(orderItems);
      clearCart();
      router.push('/checkout/success');
    } catch (error) {
      setErrors({ form: 'System synchronization failed. Please retry initialization.' });
    } finally {
      setLoading(false);
    }
  };

  if (!user || items.length === 0) return null;

  return (
    <div className="min-h-screen pb-24 px-6 md:px-12 max-w-[1400px] mx-auto bg-[#020203]">
      <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
           <Link href="/cart" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white transition-colors mb-6">
              <ArrowLeft size={14} strokeWidth={3} /> Return to Assets
           </Link>
           <h1 className="text-6xl font-black italic tracking-tighter text-white uppercase leading-[0.8]">
              Finalize <span className="text-white/30">Transaction</span>
           </h1>
        </div>

        {/* 🏔️ Advanced Step Indicator */}
        <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-3xl p-2 h-16">
          {STEPS.map((s, idx) => {
            const isActive = step === s.id;
            const isCompleted = STEPS.findIndex(step_item => step_item.id === step) > idx;
            const Icon = s.icon;
            
            return (
              <div key={s.id} className="flex items-center">
                <div className={cn(
                  "flex items-center gap-3 px-5 py-2.5 rounded-2xl transition-all duration-500",
                  isActive ? "bg-white text-black shadow-xl scale-105" : "text-white/40"
                )}>
                  {isCompleted ? <CheckCircle size={16} className="text-emerald-500" /> : <Icon size={16} />}
                  <span className="text-[10px] font-black uppercase tracking-widest hidden xl:block">{s.label}</span>
                </div>
                {idx < 2 && <div className="w-4 h-px bg-white/10 mx-2" />}
              </div>
            );
          })}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-16 items-start">
        <main>
          <Card className="aurora-glass p-12 rounded-[3.5rem] border-white/5 shadow-2xl bg-white/[0.02] min-h-[500px]">
            <AnimatePresence mode="wait">
              {step === 'shipping' && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-10"
                >
                  <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-6">
                     <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 italic">Logistics Information</h2>
                     <div className="flex items-center gap-2 text-emerald-500/60">
                        <Truck size={14} />
                        <span className="text-[9px] font-black uppercase tracking-widest">Priority Transit</span>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Input
                      label="First Name"
                      value={form.firstName}
                      onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                      error={errors.firstName}
                      placeholder="GIVEN NAME"
                      required
                    />
                    <Input
                      label="Last Name"
                      value={form.lastName}
                      onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                      error={errors.lastName}
                      placeholder="SURNAME"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Input
                      label="Email Address"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      error={errors.email}
                      placeholder="EMAIL"
                      required
                    />
                    <Input
                      label="Contact Phone"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      error={errors.phone}
                      placeholder="NUMBER"
                      required
                    />
                  </div>

                  <Input
                    label="Physical Address"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    error={errors.address}
                    placeholder="LINE 1"
                    required
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Input label="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} error={errors.city} placeholder="CITY" required />
                    <Input label="State/Province" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} placeholder="REGION" />
                    <Input label="Postal Code" value={form.zipCode} onChange={(e) => setForm({ ...form, zipCode: e.target.value })} error={errors.zipCode} placeholder="ZIP" required />
                  </div>

                  <div className="flex justify-end pt-8">
                    <Magnetic strength={0.1}>
                      <Button size="lg" onClick={handleShippingSubmit} className="h-16 px-10 rounded-[1.5rem]" rightIcon={<ArrowRight size={18} />}>
                        Continue to Financing
                      </Button>
                    </Magnetic>
                  </div>
                </motion.div>
              )}

              {step === 'payment' && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-10"
                >
                  <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-6">
                     <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 italic">Financing Portal</h2>
                     <div className="flex items-center gap-2 text-emerald-500/60">
                        <Lock size={14} />
                        <span className="text-[9px] font-black uppercase tracking-widest">Encrypted Key</span>
                     </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setPaymentMethod('card')}
                      className={cn(
                        "p-6 rounded-3xl border transition-all flex flex-col gap-3",
                        paymentMethod === 'card' 
                          ? "bg-white border-white text-black shadow-xl" 
                          : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
                      )}
                    >
                      <CreditCard size={24} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Secure Card</span>
                    </button>
                    <button 
                      onClick={() => setPaymentMethod('fawry')}
                      className={cn(
                        "p-6 rounded-3xl border transition-all flex flex-col gap-3",
                        paymentMethod === 'fawry' 
                          ? "bg-[#FFD700] border-[#FFD700] text-black shadow-xl" 
                          : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
                      )}
                    >
                      <Zap size={24} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Fawry Pay</span>
                    </button>
                  </div>

                  {paymentMethod === 'card' ? (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <Input
                        label="Credit/Debit Number"
                        value={form.cardNumber}
                        onChange={(e) => setForm({ ...form, cardNumber: e.target.value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim() })}
                        error={errors.cardNumber}
                        placeholder="CARD IDENTIFIER"
                        maxLength={19}
                        leftIcon={<CreditCard size={18} />}
                        required
                      />

                      <div className="grid grid-cols-2 gap-8">
                        <Input
                          label="Expiration Date"
                          value={form.expDate}
                          onChange={(e) => setForm({ ...form, expDate: e.target.value.replace(/\D/g, '').replace(/(\d{2})(\d{2})/, '$1/$2').trim() })}
                          error={errors.expDate}
                          placeholder="MM/YY"
                          maxLength={5}
                          required
                        />
                        <Input
                          label="CVV Code"
                          type="password"
                          value={form.cvv}
                          onChange={(e) => setForm({ ...form, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                          error={errors.cvv}
                          placeholder="KEY"
                          maxLength={4}
                          leftIcon={<Lock size={18} />}
                          required
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="p-10 rounded-[2.5rem] bg-[#FFD700]/5 border border-[#FFD700]/20 space-y-6 animate-in fade-in zoom-in-95 duration-500">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-[#FFD700] rounded-2xl flex items-center justify-center text-black">
                             <QrCode size={24} />
                          </div>
                          <div>
                             <h4 className="text-sm font-black text-[#FFD700] uppercase tracking-tighter italic">Fawry Secure Node</h4>
                             <p className="text-[10px] text-[#FFD700]/60 font-bold uppercase tracking-widest">Instant Reference Protocol</p>
                          </div>
                       </div>
                       <p className="text-xs text-white/60 leading-relaxed">
                          A unique secure reference key will be generated upon authorization. You can complete your payment at any Fawry point or via the Fawry app using this encrypted token.
                       </p>
                       <div className="flex items-center gap-2 p-3 bg-white/5 rounded-xl border border-white/5">
                          <ShieldCheck size={14} className="text-[#FFD700]" />
                          <span className="text-[9px] font-black uppercase text-white/40 tracking-widest">Encrypted Fawry Gateway Active</span>
                       </div>
                    </div>
                  )}

                  <div className="flex justify-between pt-8">
                    <Button variant="ghost" onClick={() => setStep('shipping')} className="text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 italic">
                      Previous
                    </Button>
                    <Magnetic strength={0.1}>
                      <Button size="lg" onClick={handlePaymentSubmit} className="h-16 px-10 rounded-[1.5rem]" rightIcon={<ArrowRight size={18} />}>
                        Review Verification
                      </Button>
                    </Magnetic>
                  </div>
                </motion.div>
              )}

              {step === 'confirm' && (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-10"
                >
                  <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-6">
                     <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 italic">Final Verification</h2>
                     <div className="flex items-center gap-2 text-primary/60">
                        <Sparkles size={14} strokeWidth={3} />
                        <span className="text-[9px] font-black uppercase tracking-widest">Universal Synergy</span>
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5">
                      <span className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-4 block italic leading-none">Shipping Terminal</span>
                      <p className="text-sm font-bold text-white mb-1 leading-none">{form.firstName} {form.lastName}</p>
                      <p className="text-xs text-white/40 mb-4">{form.email}</p>
                      <p className="text-xs text-white/60 leading-relaxed font-medium">
                        {form.address}<br />
                        {form.city}, {form.state} {form.zipCode}
                      </p>
                    </div>

                    <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5">
                      <span className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-4 block italic leading-none">Payment Node</span>
                      {paymentMethod === 'card' ? (
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                              <CreditCard size={14} className="text-white/60" />
                           </div>
                           <span className="text-sm font-bold text-white uppercase tracking-tighter italic">VISA ···· {form.cardNumber.slice(-4)}</span>
                        </div>
                      ) : (
                        <div className="space-y-3">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-[#FFD700] rounded-lg flex items-center justify-center text-black">
                                 <Zap size={14} />
                              </div>
                              <span className="text-sm font-black text-[#FFD700] uppercase tracking-tighter italic">Fawry Protocol</span>
                           </div>
                           <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                              <p className="text-[8px] font-black uppercase text-white/20 tracking-widest mb-1">Generated Key</p>
                              <p className="text-xs font-black text-white tracking-widest">{fawryRef}</p>
                           </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between pt-8">
                    <Button variant="ghost" onClick={() => setStep('payment')} className="text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 italic">
                      Previous
                    </Button>
                    <Magnetic strength={0.1}>
                      <Button size="lg" onClick={handlePlaceOrder} isLoading={loading} className="h-16 px-12 rounded-[1.5rem] bg-primary/20 text-primary border-primary/20 hover:bg-primary/30 shadow-none">
                        Authorize Payment (${total.toFixed(2)})
                      </Button>
                    </Magnetic>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </main>

        <aside className="lg:sticky lg:top-32 space-y-8">
          <Card className="aurora-glass p-10 rounded-[3rem] border-white/5 shadow-2xl bg-white/[0.02]">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-8 italic">Inventory Cluster</h3>
            <div className="space-y-6 max-h-[300px] overflow-auto pr-4 scrollbar-thin">
              {items.map((item) => (
                <div key={item.id} className="flex gap-5 items-center group">
                  <div className="relative w-16 h-16 shrink-0 overflow-hidden rounded-2xl border border-white/10 group-hover:scale-105 transition-transform duration-500">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-x-0 bottom-0 top-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black italic uppercase text-white/80 group-hover:text-white transition-colors leading-tight mb-1">{item.name}</p>
                    <p className="text-[9px] font-black uppercase tracking-widest text-white/20">Unit x{item.quantity}</p>
                  </div>
                  <p className="text-[11px] font-black italic text-white/40 tracking-tighter">${((item.price || 0) * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            
            <div className="border-t border-white/10 mt-10 pt-8 space-y-4">
              <div className="flex justify-between items-center text-[10px] font-bold">
                <span className="text-white/20 uppercase tracking-[0.2em]">Inventory subtotal</span>
                <span className="text-white/60 tracking-wider">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-bold">
                <span className="text-white/20 uppercase tracking-[0.2em]">Logistics fee</span>
                <span>{shipping === 0 ? <span className="text-emerald-500 uppercase text-[9px] font-black tracking-widest">Included</span> : <span className="text-white/60 tracking-wider">${shipping.toFixed(2)}</span>}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-bold">
                <span className="text-white/20 uppercase tracking-[0.2em]">Ecosystem tax</span>
                <span className="text-white/60 tracking-wider">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pt-6 mt-2 border-t border-white/10">
                <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white/60 leading-none italic">Cluster Total</span>
                <span className="text-3xl font-black italic text-white tracking-tighter leading-none">${total.toFixed(2)}</span>
              </div>
            </div>
          </Card>

          <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 flex flex-col gap-4">
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                   <ShieldCheck size={16} className="text-emerald-500" />
                </div>
                <div className="flex flex-col">
                   <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Verified Integrity</span>
                   <span className="text-[9px] font-bold text-white/20 italic tracking-wide">Consumer protection active</span>
                </div>
             </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

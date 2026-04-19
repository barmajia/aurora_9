'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { CheckCircle, Package, ShoppingBag, ArrowRight, Home } from 'lucide-react';
import { Button, Card } from '@/components/ui';

export default function OrderSuccessPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Generate random order number
    setOrderNumber(`ORD-${Date.now().toString(36).toUpperCase()}`);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.2 }}
          className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="text-green-400" size={48} />
        </motion.div>

        <h1 className="text-3xl md:text-4xl font-black italic tracking-tighter mb-4">
          Order <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">Confirmed!</span>
        </h1>

        <p className="text-white/50 mb-2">Thank you for your purchase</p>
        <p className="text-white/30 text-sm mb-8">
          Order number: <span className="font-mono text-primary">{orderNumber}</span>
        </p>

        <Card className="text-left mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-primary/20 rounded-xl">
              <Package className="text-primary" size={24} />
            </div>
            <div>
              <h3 className="font-bold">What's Next?</h3>
              <p className="text-white/50 text-sm">We'll send you an email confirmation shortly.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-secondary/20 rounded-xl">
              <ShoppingBag className="text-secondary" size={24} />
            </div>
            <div>
              <h3 className="font-bold">Delivery Estimate</h3>
              <p className="text-white/50 text-sm">3-5 business days</p>
            </div>
          </div>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/products" className="flex-1">
            <Button className="w-full" rightIcon={<ArrowRight size={18} />}>
              Continue Shopping
            </Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button variant="secondary" className="w-full" leftIcon={<Home size={18} />}>
              Back to Home
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
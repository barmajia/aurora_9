'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { Heart, Trash2, ShoppingCart, Package } from 'lucide-react';
import { useWishlistStore } from '@/store/wishlist';
import { useCartStore } from '@/store/cart';
import { useToastStore } from '@/store/toast';
import { Button, Card } from '@/components/ui';
  import type { WishlistItem } from '@/types';

  export default function WishlistPage() {
    const { t } = useTranslation();
    const { items, removeItem } = useWishlistStore();
    const addItem = useCartStore((state) => state.addItem);
    const addToast = useToastStore((state) => state.addToast);

    const handleMoveToCart = (item: WishlistItem) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category,
      description: item.description || '',
    });
    removeItem(item.id);
    addToast(`${item.name} moved to cart`, 'success');
  };

  const handleRemove = (id: string) => {
    removeItem(id);
    addToast('Removed from wishlist', 'info');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-primary/20 rounded-[2rem] flex items-center justify-center mx-auto mb-4">
            <Heart className="text-primary" size={40} />
          </div>
          <h1 className="text-2xl font-bold mb-2">Your wishlist is empty</h1>
          <p className="text-white/50 mb-6">Save items you love by clicking the heart icon</p>
          <Link href="/products">
            <Button>Browse Products</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-black italic tracking-tighter mb-2">
            My <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Wishlist</span>
          </h1>
          <p className="text-white/50">
            {items.length} {items.length === 1 ? 'item' : 'items'} saved
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <Card hover>
                  <div className="aspect-square relative mb-4 overflow-hidden rounded-xl">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-white/40">{item.category}</span>
                  <h3 className="font-bold mb-2">{item.name}</h3>
                  <p className="text-xl font-black italic text-primary mb-4">${item.price.toFixed(2)}</p>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1" onClick={() => handleMoveToCart(item)} leftIcon={<ShoppingCart size={16} />}>
                      Move to Cart
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleRemove(item.id)}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

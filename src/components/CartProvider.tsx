'use client';

import { useCartStore } from '@/store/cart';
import { useEffect } from 'react';

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const hydrate = useCartStore((state) => state.items);

  useEffect(() => {
    const stored = localStorage.getItem('cart');
    if (stored) {
      const parsed = JSON.parse(stored);
      useCartStore.setState({ items: parsed });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(useCartStore.getState().items));
  }, [hydrate]);

  return <>{children}</>;
}
'use client';

import Link from 'next/link';
import { useCartStore } from '@/store/cart';

export default function Header() {
  const items = useCartStore((state) => state.items);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="header">
      <div className="header-content">
        <Link href="/" className="logo">
          MyStore
        </Link>
        <nav className="nav">
          <Link href="/" className="nav-link">
            Products
          </Link>
          <Link href="/cart" className="nav-link">
            Cart ({itemCount})
          </Link>
        </nav>
      </div>
    </header>
  );
}
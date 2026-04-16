'use client';

import Link from 'next/link';
import { ShoppingBag, User, LogOut, Package } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function Header() {
  const { items } = useCartStore();
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
    router.push('/login');
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link href="/" className="logo">
          Aurora
        </Link>
        <nav className="nav">
          <Link href="/products" className="nav-link">Products</Link>
          
          {user ? (
            <>
              {user.role === 'seller' ? (
                <Link href="/seller/dashboard" className="nav-link">Dashboard</Link>
              ) : (
                <>
                  <Link href="/profile" className="nav-link">Profile</Link>
                  <Link href="/cart" className="nav-link">
                    <ShoppingBag size={20} />
                    {totalItems > 0 && <span style={{ marginLeft: '4px' }}>({totalItems})</span>}
                  </Link>
                </>
              )}
              <button onClick={handleLogout} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--secondary)' }}>
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="nav-link">Login</Link>
              <Link href="/signup" className="btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.9rem' }}>
                Sign Up
              </Link>
              <Link href="/seller/login" className="nav-link">Seller Login</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
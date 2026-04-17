'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { supabase } from '@/lib/supabase';
import { 
  LayoutDashboard, Package, BarChart3, Users, MessageSquare, 
  Settings, LogOut, Store, Bell, ChevronRight, TrendingUp,
  ShoppingCart, DollarSign, Eye, Package as PackageIcon
} from 'lucide-react';

interface SellerData {
  full_name: string;
  email: string;
  is_verified: boolean;
  location: string;
}

interface Product {
  id: string;
  title: string;
  price: number;
  quantity: number;
  status: string;
  images: { url: string }[];
  category: string;
}

interface OrderStats {
  total_orders: number;
  pending_orders: number;
  total_revenue: number;
}

export default function SellerDashboard() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [seller, setSeller] = useState<SellerData | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<OrderStats>({ total_orders: 0, pending_orders: 0, total_revenue: 0 });

  useEffect(() => {
    if (!user || user.role !== 'seller') {
      router.push('/seller/login');
      return;
    }
    fetchData();
  }, [user]);

  async function fetchData() {
    if (!user) return;
    
    try {
      const { data: sellerData } = await supabase
        .from('sellers')
        .select('full_name, email, is_verified, location')
        .eq('user_id', user.id)
        .single();
      
      if (sellerData) setSeller(sellerData);

      const { data: productsData } = await supabase
        .from('products')
        .select('id, title, price, quantity, status, images, category')
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (productsData) setProducts(productsData);

      const { data: ordersData } = await supabase
        .from('orders')
        .select('status, total')
        .eq('seller_id', user.id);
      
      if (ordersData) {
        const total = ordersData.reduce((sum, o) => sum + (o.total || 0), 0);
        const pending = ordersData.filter(o => o.status === 'pending').length;
        setStats({ 
          total_orders: ordersData.length, 
          pending_orders: pending, 
          total_revenue: total 
        });
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
    router.push('/seller');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="pulse-glow" style={{ padding: '3rem', borderRadius: '20px' }}>
          <Store size={48} className="gradient-text" />
          <p style={{ marginTop: '1rem', color: 'rgba(255,255,255,0.6)' }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar glass-card">
        <div className="sidebar-header">
          <Store size={32} className="gradient-text" />
          <div className="sidebar-title">
            <h3>Seller Dashboard</h3>
            {seller?.is_verified && <span className="verified-badge">Verified</span>}
          </div>
        </div>

        <nav className="sidebar-nav">
          <Link href="/seller/dashboard" className="nav-item active">
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link href="/seller/products" className="nav-item">
            <Package size={20} />
            Products
          </Link>
          <Link href="/seller/analytics" className="nav-item">
            <BarChart3 size={20} />
            Analytics
          </Link>
          <Link href="/seller/orders" className="nav-item">
            <ShoppingCart size={20} />
            Orders
            {stats.pending_orders > 0 && (
              <span className="nav-badge">{stats.pending_orders}</span>
            )}
          </Link>
          <Link href="/seller/messages" className="nav-item">
            <MessageSquare size={20} />
            Messages
          </Link>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="nav-item logout">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1>Welcome back, {seller?.full_name || 'Seller'}</h1>
            <p className="header-subtitle">
              {seller?.location ? `📍 ${seller.location}` : 'Complete your profile'}
            </p>
          </div>
          <button className="notification-btn">
            <Bell size={22} />
            {stats.pending_orders > 0 && <span className="notification-dot" />}
          </button>
        </header>

        <div className="stats-grid">
          <div className="stat-card glass-card">
            <div className="stat-icon purple">
              <DollarSign size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">${stats.total_revenue.toFixed(2)}</div>
              <div className="stat-label">Total Revenue</div>
              <div className="stat-trend positive">
                <TrendingUp size={14} />
                +12.5%
              </div>
            </div>
          </div>

          <div className="stat-card glass-card">
            <div className="stat-icon pink">
              <ShoppingCart size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.total_orders}</div>
              <div className="stat-label">Total Orders</div>
              <div className="stat-trend positive">
                <TrendingUp size={14} />
                +8.3%
              </div>
            </div>
          </div>

          <div className="stat-card glass-card">
            <div className="stat-icon cyan">
              <PackageIcon size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{products.length}</div>
              <div className="stat-label">Active Products</div>
              <div className="stat-trend neutral">
                <Eye size={14} />
                View all
              </div>
            </div>
          </div>

          <div className="stat-card glass-card">
            <div className="stat-icon green">
              <Users size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.pending_orders}</div>
              <div className="stat-label">Pending Orders</div>
              <div className="stat-trend negative">
                Action needed
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          <section className="dashboard-section glass-card">
            <div className="section-header">
              <h2>Recent Products</h2>
              <Link href="/seller/products" className="section-link">
                View All <ChevronRight size={16} />
              </Link>
            </div>
            <div className="products-list">
              {products.length === 0 ? (
                <div className="empty-state-small">
                  <Package size={32} />
                  <p>No products yet</p>
                  <Link href="/seller/products/add" className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                    Add Product
                  </Link>
                </div>
              ) : (
                products.map((product) => (
                  <div key={product.id} className="product-item">
                    <img 
                      src={product.images?.[0]?.url || 'https://via.placeholder.com/60'} 
                      alt={product.title}
                      className="product-thumb"
                    />
                    <div className="product-info">
                      <h4>{product.title}</h4>
                      <span className="product-category">{product.category || 'Uncategorized'}</span>
                    </div>
                    <div className="product-meta">
                      <span className="product-price">${product.price?.toFixed(2) || '0.00'}</span>
                      <span className={`product-status ${product.status}`}>{product.status}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="dashboard-section glass-card">
            <div className="section-header">
              <h2>Quick Actions</h2>
            </div>
            <div className="quick-actions">
              <Link href="/seller/products/add" className="quick-action glass-button">
                <Package size={24} />
                Add Product
              </Link>
              <Link href="/seller/analytics" className="quick-action glass-button">
                <BarChart3 size={24} />
                View Analytics
              </Link>
              <Link href="/seller/settings" className="quick-action glass-button">
                <Settings size={24} />
                Settings
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { 
  LayoutDashboard, Package, BarChart3, Users, MessageSquare, 
  Settings, LogOut, Factory, Bell, ChevronRight, TrendingUp,
  ShoppingCart, DollarSign, MapPin, Star
} from 'lucide-react';

interface FactoryData {
  full_name: string;
  company_name: string;
  email: string;
  is_verified: boolean;
  location: string;
  production_capacity: string;
  min_order_quantity: number;
  wholesale_discount: number;
  latitude: number | null;
  longitude: number | null;
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

interface Connection {
  id: string;
  seller_id: string;
  status: string;
  created_at: string;
}

export default function FactoryDashboard() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [factory, setFactory] = useState<FactoryData | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'factory') {
      router.push('/factory/login');
      return;
    }
    fetchData();
  }, [user]);

  async function fetchData() {
    if (!user) return;
    
    try {
      const { data: factoryData } = await supabase
        .from('sellers')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_factory', true)
        .single();
      
      if (factoryData) setFactory(factoryData);

      const { data: productsData } = await supabase
        .from('products')
        .select('id, title, price, quantity, status, images, category')
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (productsData) setProducts(productsData);

      const { data: connectionsData } = await supabase
        .from('factory_connections')
        .select('*')
        .eq('factory_id', user.id);
      
      if (connectionsData) setConnections(connectionsData);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
    router.push('/factory');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="pulse-glow" style={{ padding: '3rem', borderRadius: '20px' }}>
          <Factory size={48} className="gradient-text" />
          <p style={{ marginTop: '1rem', color: 'rgba(255,255,255,0.6)' }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const activeConnections = connections.filter(c => c.status === 'accepted').length;
  const pendingConnections = connections.filter(c => c.status === 'pending').length;

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar glass-card">
        <div className="sidebar-header">
          <Factory size={32} className="gradient-text" />
          <div className="sidebar-title">
            <h3>Factory Dashboard</h3>
            {factory?.is_verified && <span className="verified-badge factory">Verified</span>}
          </div>
        </div>

        <nav className="sidebar-nav">
          <Link href="/factory/dashboard" className="nav-item active">
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link href="/factory/products" className="nav-item">
            <Package size={20} />
            Products
          </Link>
          <Link href="/factory/analytics" className="nav-item">
            <BarChart3 size={20} />
            Analytics
          </Link>
          <Link href="/factory/connections" className="nav-item">
            <Users size={20} />
            Sellers
            {pendingConnections > 0 && (
              <span className="nav-badge">{pendingConnections}</span>
            )}
          </Link>
          <Link href="/factory/messages" className="nav-item">
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
            <h1>Welcome, {factory?.full_name || factory?.company_name || 'Factory'}</h1>
            <p className="header-subtitle">
              {factory?.location && <><MapPin size={14} /> {factory.location}</>}
            </p>
          </div>
          <button className="notification-btn">
            <Bell size={22} />
            {pendingConnections > 0 && <span className="notification-dot" />}
          </button>
        </header>

        <div className="stats-grid">
          <div className="stat-card glass-card">
            <div className="stat-icon purple">
              <Package size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{products.length}</div>
              <div className="stat-label">Listed Products</div>
              <div className="stat-trend neutral">
                <MapPin size={14} />
                {factory?.production_capacity || 'N/A'}
              </div>
            </div>
          </div>

          <div className="stat-card glass-card">
            <div className="stat-icon pink">
              <Users size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{activeConnections}</div>
              <div className="stat-label">Active Partners</div>
              <div className="stat-trend positive">
                <TrendingUp size={14} />
                +3 this month
              </div>
            </div>
          </div>

          <div className="stat-card glass-card">
            <div className="stat-icon cyan">
              <ShoppingCart size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{pendingConnections}</div>
              <div className="stat-label">Pending Requests</div>
              <div className="stat-trend negative">
                Action needed
              </div>
            </div>
          </div>

          <div className="stat-card glass-card">
            <div className="stat-icon green">
              <Star size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">4.8</div>
              <div className="stat-label">Factory Rating</div>
              <div className="stat-trend positive">
                <TrendingUp size={14} />
                +0.2
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          <section className="dashboard-section glass-card">
            <div className="section-header">
              <h2>Your Products</h2>
              <Link href="/factory/products" className="section-link">
                View All <ChevronRight size={16} />
              </Link>
            </div>
            <div className="products-list">
              {products.length === 0 ? (
                <div className="empty-state-small">
                  <Package size={32} />
                  <p>No products listed</p>
                  <Link href="/factory/products/add" className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
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
              <h2>Factory Info</h2>
              <Link href="/factory/settings" className="section-link">
                Edit <ChevronRight size={16} />
              </Link>
            </div>
            <div className="factory-info">
              <div className="info-item">
                <span className="info-label">Min Order Qty</span>
                <span className="info-value">{factory?.min_order_quantity || 1}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Wholesale Discount</span>
                <span className="info-value">{factory?.wholesale_discount || 0}%</span>
              </div>
              <div className="info-item">
                <span className="info-label">Status</span>
                <span className={`info-value ${factory?.is_verified ? 'verified' : 'pending'}`}>
                  {factory?.is_verified ? 'Verified' : 'Pending'}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Location</span>
                <span className="info-value">{factory?.location || 'Not set'}</span>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

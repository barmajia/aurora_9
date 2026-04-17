'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { supabase } from '@/lib/supabase';
import { 
  BarChart3, TrendingUp, TrendingDown, DollarSign, ShoppingCart, 
  Users, Package, Calendar, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

interface Analytics {
  kpis: {
    total_revenue: number;
    total_sales: number;
    total_items_sold: number;
    total_customers: number;
    unique_customers_in_period: number;
    average_order_value: number;
    conversion_rate: number;
  };
  top_products: Array<{
    id: string;
    name: string;
    times_sold: number;
    units_sold: number;
    revenue: number;
  }>;
  top_customers: Array<{
    id: string;
    name: string;
    phone: string;
    orders_in_period: number;
    spent_in_period: number;
  }>;
  daily_breakdown: Array<{
    date: string;
    sales: number;
    revenue: number;
  }>;
}

export default function SellerAnalyticsPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30d');

  useEffect(() => {
    if (!user || user.role !== 'seller') {
      router.push('/seller/login');
      return;
    }
    fetchAnalytics();
  }, [user, period]);

  async function fetchAnalytics() {
    if (!user) return;
    try {
      const { data, error } = await supabase.rpc('get_seller_kpis', {
        p_seller_id: user.id,
        p_period: period
      });

      if (error) throw error;
      setAnalytics(data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="dashboard-container">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <BarChart3 size={48} className="gradient-text" />
        </div>
      </div>
    );
  }

  const kpis = analytics?.kpis || {
    total_revenue: 0,
    total_sales: 0,
    total_items_sold: 0,
    total_customers: 0,
    unique_customers_in_period: 0,
    average_order_value: 0,
    conversion_rate: 0
  };

  return (
    <div className="dashboard-container">
      <header className="page-header">
        <div>
          <h1>Analytics</h1>
          <p className="header-subtitle">Track your performance and growth</p>
        </div>
        <div className="period-selector">
          <button 
            className={period === '7d' ? 'active' : ''} 
            onClick={() => setPeriod('7d')}
          >
            7 Days
          </button>
          <button 
            className={period === '30d' ? 'active' : ''} 
            onClick={() => setPeriod('30d')}
          >
            30 Days
          </button>
          <button 
            className={period === '90d' ? 'active' : ''} 
            onClick={() => setPeriod('90d')}
          >
            90 Days
          </button>
          <button 
            className={period === '1y' ? 'active' : ''} 
            onClick={() => setPeriod('1y')}
          >
            1 Year
          </button>
        </div>
      </header>

      <div className="kpi-grid">
        <div className="kpi-card glass-card">
          <div className="kpi-icon purple">
            <DollarSign size={24} />
          </div>
          <div className="kpi-content">
            <div className="kpi-value">${kpis.total_revenue.toFixed(2)}</div>
            <div className="kpi-label">Total Revenue</div>
            <div className="kpi-trend positive">
              <ArrowUpRight size={14} />
              +15.2%
            </div>
          </div>
        </div>

        <div className="kpi-card glass-card">
          <div className="kpi-icon pink">
            <ShoppingCart size={24} />
          </div>
          <div className="kpi-content">
            <div className="kpi-value">{kpis.total_sales}</div>
            <div className="kpi-label">Total Sales</div>
            <div className="kpi-trend positive">
              <ArrowUpRight size={14} />
              +8.5%
            </div>
          </div>
        </div>

        <div className="kpi-card glass-card">
          <div className="kpi-icon cyan">
            <Users size={24} />
          </div>
          <div className="kpi-content">
            <div className="kpi-value">{kpis.unique_customers_in_period}</div>
            <div className="kpi-label">Unique Customers</div>
            <div className="kpi-trend positive">
              <ArrowUpRight size={14} />
              +12.1%
            </div>
          </div>
        </div>

        <div className="kpi-card glass-card">
          <div className="kpi-icon green">
            <Package size={24} />
          </div>
          <div className="kpi-content">
            <div className="kpi-value">{kpis.total_items_sold}</div>
            <div className="kpi-label">Items Sold</div>
            <div className="kpi-trend positive">
              <ArrowUpRight size={14} />
              +22.3%
            </div>
          </div>
        </div>

        <div className="kpi-card glass-card">
          <div className="kpi-icon purple">
            <TrendingUp size={24} />
          </div>
          <div className="kpi-content">
            <div className="kpi-value">${kpis.average_order_value.toFixed(2)}</div>
            <div className="kpi-label">Avg Order Value</div>
            <div className="kpi-trend negative">
              <ArrowDownRight size={14} />
              -2.4%
            </div>
          </div>
        </div>

        <div className="kpi-card glass-card">
          <div className="kpi-icon pink">
            <BarChart3 size={24} />
          </div>
          <div className="kpi-content">
            <div className="kpi-value">{kpis.conversion_rate.toFixed(1)}%</div>
            <div className="kpi-label">Conversion Rate</div>
            <div className="kpi-trend positive">
              <ArrowUpRight size={14} />
              +1.2%
            </div>
          </div>
        </div>
      </div>

      <div className="analytics-grid">
        <section className="analytics-section glass-card">
          <h2>Top Products</h2>
          <div className="top-list">
            {analytics?.top_products?.length ? (
              analytics.top_products.map((product, index) => (
                <div key={product.id} className="top-item">
                  <span className="top-rank">#{index + 1}</span>
                  <div className="top-info">
                    <span className="top-name">{product.name}</span>
                    <span className="top-meta">{product.units_sold} sold</span>
                  </div>
                  <span className="top-revenue">${product.revenue?.toFixed(2)}</span>
                </div>
              ))
            ) : (
              <p className="empty-message">No sales data yet</p>
            )}
          </div>
        </section>

        <section className="analytics-section glass-card">
          <h2>Top Customers</h2>
          <div className="top-list">
            {analytics?.top_customers?.length ? (
              analytics.top_customers.map((customer, index) => (
                <div key={customer.id} className="top-item">
                  <span className="top-rank">#{index + 1}</span>
                  <div className="top-info">
                    <span className="top-name">{customer.name}</span>
                    <span className="top-meta">{customer.orders_in_period} orders</span>
                  </div>
                  <span className="top-revenue">${customer.spent_in_period?.toFixed(2)}</span>
                </div>
              ))
            ) : (
              <p className="empty-message">No customer data yet</p>
            )}
          </div>
        </section>
      </div>

      <section className="analytics-section glass-card full-width">
        <h2>Daily Sales Trend</h2>
        <div className="chart-placeholder">
          <BarChart3 size={48} style={{ color: 'var(--primary)', opacity: 0.5 }} />
          <p>Sales chart visualization</p>
          <div className="chart-bars">
            {(analytics?.daily_breakdown || []).slice(-7).map((day, i) => (
              <div key={i} className="chart-bar-container">
                <div 
                  className="chart-bar" 
                  style={{ 
                    height: `${Math.min(100, (day.revenue / (kpis.total_revenue || 1)) * 100)}%` 
                  }}
                />
                <span className="chart-label">
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

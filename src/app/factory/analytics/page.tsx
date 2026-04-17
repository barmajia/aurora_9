'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { supabase } from '@/lib/supabase';
import { 
  BarChart3, TrendingUp, TrendingDown, DollarSign, Package, 
  Users, Factory, Star, CheckCircle, Clock, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

interface FactoryAnalytics {
  kpis: {
    total_revenue: number;
    total_sales: number;
    total_items_sold: number;
    total_customers: number;
    unique_customers_in_period: number;
    average_order_value: number;
    conversion_rate: number;
  };
  factory_rating: number;
  fulfilled_orders: number;
  pending_orders: number;
  average_lead_time: number;
  top_products: Array<{
    id: string;
    name: string;
    units_sold: number;
    revenue: number;
  }>;
}

export default function FactoryAnalyticsPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [analytics, setAnalytics] = useState<FactoryAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30d');

  useEffect(() => {
    if (!user || user.role !== 'factory') {
      router.push('/factory/login');
      return;
    }
    fetchAnalytics();
  }, [user, period]);

  async function fetchAnalytics() {
    if (!user) return;
    try {
      const { data: kpiData, error: kpiError } = await supabase.rpc('get_seller_kpis', {
        p_seller_id: user.id,
        p_period: period
      });

      const { data: ratingData, error: ratingError } = await supabase.rpc('get_factory_rating', {
        p_seller_id: user.id
      });

      if (kpiError) throw kpiError;
      
      setAnalytics({
        kpis: kpiData?.kpis || {
          total_revenue: 0,
          total_sales: 0,
          total_items_sold: 0,
          total_customers: 0,
          unique_customers_in_period: 0,
          average_order_value: 0,
          conversion_rate: 0
        },
        factory_rating: ratingData?.rating || 0,
        fulfilled_orders: kpiData?.fulfilled_orders || 0,
        pending_orders: kpiData?.pending_orders || 0,
        average_lead_time: kpiData?.average_lead_time || 0,
        top_products: kpiData?.top_products || []
      });
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setAnalytics({
        kpis: {
          total_revenue: 0,
          total_sales: 0,
          total_items_sold: 0,
          total_customers: 0,
          unique_customers_in_period: 0,
          average_order_value: 0,
          conversion_rate: 0
        },
        factory_rating: 0,
        fulfilled_orders: 0,
        pending_orders: 0,
        average_lead_time: 0,
        top_products: []
      });
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
          <h1>Factory Analytics</h1>
          <p className="header-subtitle">Track your manufacturing performance</p>
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

      <div className="factory-rating-banner glass-card">
        <div className="rating-content">
          <Star size={32} className="rating-star" />
          <div className="rating-info">
            <span className="rating-value">{analytics?.factory_rating?.toFixed(1) || '0.0'}</span>
            <span className="rating-label">Factory Rating</span>
          </div>
        </div>
        <div className="rating-stats">
          <div className="rating-stat">
            <CheckCircle size={20} className="text-green" />
            <span>{analytics?.fulfilled_orders || 0} Fulfilled</span>
          </div>
          <div className="rating-stat">
            <Clock size={20} className="text-yellow" />
            <span>{analytics?.pending_orders || 0} Pending</span>
          </div>
          <div className="rating-stat">
            <Clock size={20} className="text-cyan" />
            <span>{analytics?.average_lead_time || 0} days avg lead time</span>
          </div>
        </div>
      </div>

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
            <Package size={24} />
          </div>
          <div className="kpi-content">
            <div className="kpi-value">{kpis.total_items_sold}</div>
            <div className="kpi-label">Units Produced</div>
            <div className="kpi-trend positive">
              <ArrowUpRight size={14} />
              +22.3%
            </div>
          </div>
        </div>

        <div className="kpi-card glass-card">
          <div className="kpi-icon cyan">
            <Users size={24} />
          </div>
          <div className="kpi-content">
            <div className="kpi-value">{kpis.unique_customers_in_period}</div>
            <div className="kpi-label">Active Buyers</div>
            <div className="kpi-trend positive">
              <ArrowUpRight size={14} />
              +12.1%
            </div>
          </div>
        </div>

        <div className="kpi-card glass-card">
          <div className="kpi-icon green">
            <TrendingUp size={24} />
          </div>
          <div className="kpi-content">
            <div className="kpi-value">{kpis.total_sales}</div>
            <div className="kpi-label">Total Orders</div>
            <div className="kpi-trend positive">
              <ArrowUpRight size={14} />
              +8.5%
            </div>
          </div>
        </div>

        <div className="kpi-card glass-card">
          <div className="kpi-icon purple">
            <DollarSign size={24} />
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
            <div className="kpi-label">Fulfillment Rate</div>
            <div className="kpi-trend positive">
              <ArrowUpRight size={14} />
              +1.2%
            </div>
          </div>
        </div>
      </div>

      <section className="analytics-section glass-card full-width">
        <h2>Top Products</h2>
        <div className="top-list">
          {analytics?.top_products?.length ? (
            analytics.top_products.map((product, index) => (
              <div key={product.id} className="top-item">
                <span className="top-rank">#{index + 1}</span>
                <div className="top-info">
                  <span className="top-name">{product.name}</span>
                  <span className="top-meta">{product.units_sold} units</span>
                </div>
                <span className="top-revenue">${product.revenue?.toFixed(2)}</span>
              </div>
            ))
          ) : (
            <p className="empty-message">No production data yet</p>
          )}
        </div>
      </section>
    </div>
  );
}

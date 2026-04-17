'use client';

import Link from 'next/link';
import { Store, BarChart3, Package, Users, Settings, ArrowRight, TrendingUp, Shield, Zap, Globe } from 'lucide-react';

export default function SellerPage() {
  return (
    <div className="portal-page">
      <div className="portal-hero">
        <div className="portal-hero-bg" />
        <div className="portal-hero-content">
          <div className="float-animation" style={{ marginBottom: '2rem' }}>
            <Store size={80} className="gradient-text" />
          </div>
          <h1 className="hero-title">Seller Portal</h1>
          <p className="hero-subtitle">
            Grow your business with Aurora. Manage products, track analytics, 
            and connect with customers all in one powerful dashboard.
          </p>
          <div className="hero-buttons">
            <Link href="/seller/login" className="btn-primary">
              Start Selling
              <ArrowRight size={20} />
            </Link>
            <Link href="/seller/signup" className="btn-secondary">
              Get the App
            </Link>
          </div>
        </div>
      </div>

      <section className="portal-features">
        <h2 className="section-title">Everything you need to succeed</h2>
        <div className="features-grid">
          <div className="feature-card glass-card">
            <div className="feature-icon purple">
              <Package size={28} />
            </div>
            <h3>Product Management</h3>
            <p>Upload, edit, and organize your products with ASIN tracking and inventory management.</p>
          </div>
          <div className="feature-card glass-card">
            <div className="feature-icon pink">
              <BarChart3 size={28} />
            </div>
            <h3>Analytics Dashboard</h3>
            <p>Track sales, revenue, and customer insights with real-time analytics.</p>
          </div>
          <div className="feature-card glass-card">
            <div className="feature-icon cyan">
              <Users size={28} />
            </div>
            <h3>Customer Insights</h3>
            <p>Understand your customers with detailed profiles and purchase history.</p>
          </div>
          <div className="feature-card glass-card">
            <div className="feature-icon green">
              <TrendingUp size={28} />
            </div>
            <h3>Growth Tools</h3>
            <p>Access factory connections and wholesale pricing to grow your margins.</p>
          </div>
          <div className="feature-card glass-card">
            <div className="feature-icon purple">
              <Shield size={28} />
            </div>
            <h3>Secure Platform</h3>
            <p>Enterprise-grade security with verified sellers and safe transactions.</p>
          </div>
          <div className="feature-card glass-card">
            <div className="feature-icon pink">
              <Globe size={28} />
            </div>
            <h3>Multi-Region</h3>
            <p>Expand your business across different regions with local support.</p>
          </div>
        </div>
      </section>

      <section className="portal-stats">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number gradient-text">10K+</div>
            <div className="stat-label">Active Sellers</div>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <div className="stat-number gradient-text">50K+</div>
            <div className="stat-label">Products Listed</div>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <div className="stat-number gradient-text">$2M+</div>
            <div className="stat-label">Monthly Sales</div>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <div className="stat-number gradient-text">98%</div>
            <div className="stat-label">Satisfaction</div>
          </div>
        </div>
      </section>

      <section className="portal-cta">
        <div className="cta-content">
          <Zap size={48} className="gradient-text" />
          <h2>Ready to start selling?</h2>
          <p>Join thousands of sellers already growing their business with Aurora.</p>
          <div className="hero-buttons">
            <Link href="/seller/signup" className="btn-primary">
              Download Seller App
              <ArrowRight size={20} />
            </Link>
            <Link href="/seller/login" className="btn-secondary">
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

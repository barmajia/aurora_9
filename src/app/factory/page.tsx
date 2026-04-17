'use client';

import Link from 'next/link';
import { Factory, BarChart3, Package, Users, Settings, ArrowRight, Shield, Zap, Globe, MapPin } from 'lucide-react';

export default function FactoryPage() {
  return (
    <div className="portal-page">
      <div className="portal-hero">
        <div className="portal-hero-bg" />
        <div className="portal-hero-content">
          <div className="float-animation" style={{ marginBottom: '2rem' }}>
            <Factory size={80} className="gradient-text" />
          </div>
          <h1 className="hero-title">Factory Portal</h1>
          <p className="hero-subtitle">
            Connect directly with sellers. Showcase your products, manage wholesale orders, 
            and grow your manufacturing business.
          </p>
          <div className="hero-buttons">
            <Link href="/factory/login" className="btn-primary">
              Partner With Us
              <ArrowRight size={20} />
            </Link>
            <Link href="/factory/signup" className="btn-secondary">
              Get the App
            </Link>
          </div>
        </div>
      </div>

      <section className="portal-features">
        <h2 className="section-title">Built for manufacturers</h2>
        <div className="features-grid">
          <div className="feature-card glass-card">
            <div className="feature-icon purple">
              <Package size={28} />
            </div>
            <h3>Product Catalog</h3>
            <p>Showcase your products with detailed specs, images, and wholesale pricing.</p>
          </div>
          <div className="feature-card glass-card">
            <div className="feature-icon pink">
              <Users size={28} />
            </div>
            <h3>Seller Network</h3>
            <p>Connect with verified sellers looking for quality manufacturers.</p>
          </div>
          <div className="feature-card glass-card">
            <div className="feature-icon cyan">
              <MapPin size={28} />
            </div>
            <h3>Location-Based</h3>
            <p>Sellers can find factories nearby using geolocation search.</p>
          </div>
          <div className="feature-card glass-card">
            <div className="feature-icon green">
              <BarChart3 size={28} />
            </div>
            <h3>Order Analytics</h3>
            <p>Track orders, production capacity, and fulfillment metrics.</p>
          </div>
          <div className="feature-card glass-card">
            <div className="feature-icon purple">
              <Shield size={28} />
            </div>
            <h3>Verified Factories</h3>
            <p>Build trust with factory verification and ratings system.</p>
          </div>
          <div className="feature-card glass-card">
            <div className="feature-icon pink">
              <Globe size={28} />
            </div>
            <h3>Global Reach</h3>
            <p>Expand beyond local markets to national and international buyers.</p>
          </div>
        </div>
      </section>

      <section className="portal-stats">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number gradient-text">500+</div>
            <div className="stat-label">Verified Factories</div>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <div className="stat-number gradient-text">10K+</div>
            <div className="stat-label">Products Listed</div>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <div className="stat-number gradient-text">$5M+</div>
            <div className="stat-label">Wholesale Volume</div>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <div className="stat-number gradient-text">95%</div>
            <div className="stat-label">On-Time Delivery</div>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <h2 className="section-title">How it works</h2>
        <div className="steps-container">
          <div className="step glass-card">
            <div className="step-number">1</div>
            <h3>Register</h3>
            <p>Download the factory app and create your profile with license verification.</p>
          </div>
          <div className="step-connector" />
          <div className="step glass-card">
            <div className="step-number">2</div>
            <h3>List Products</h3>
            <p>Add your products with wholesale pricing and production capacity.</p>
          </div>
          <div className="step-connector" />
          <div className="step glass-card">
            <div className="step-number">3</div>
            <h3>Connect</h3>
            <p>Sellers discover your factory and request partnerships.</p>
          </div>
          <div className="step-connector" />
          <div className="step glass-card">
            <div className="step-number">4</div>
            <h3>Grow</h3>
            <p>Fulfill orders and build long-term business relationships.</p>
          </div>
        </div>
      </section>

      <section className="portal-cta">
        <div className="cta-content">
          <Zap size={48} className="gradient-text" />
          <h2>Ready to grow your factory?</h2>
          <p>Join the network of manufacturers connecting with sellers.</p>
          <div className="hero-buttons">
            <Link href="/factory/signup" className="btn-primary">
              Download Factory App
              <ArrowRight size={20} />
            </Link>
            <Link href="/factory/login" className="btn-secondary">
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

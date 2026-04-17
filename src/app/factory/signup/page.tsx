'use client';

import Link from 'next/link';
import { Download, Smartphone, Monitor, Shield, Check, ArrowLeft, Factory } from 'lucide-react';

export default function FactorySignupPage() {
  return (
    <div className="portal-page">
      <div className="auth-container" style={{ maxWidth: '900px' }}>
        <Link href="/factory" className="back-link">
          <ArrowLeft size={20} />
          Back to Factory Portal
        </Link>

        <div className="auth-card" style={{ maxWidth: '900px' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <Factory size={64} className="gradient-text" />
            <h1 className="auth-title" style={{ fontSize: '2.5rem' }}>Get the Factory App</h1>
            <p className="auth-subtitle">
              Download our mobile app to manage your factory operations, products, and orders
            </p>
          </div>

          <div className="download-options">
            <div className="download-card glass-card">
              <div className="download-icon">
                <Smartphone size={48} />
              </div>
              <h3>Mobile App</h3>
              <p>Best for managing orders and production on the go</p>
              <ul className="download-features">
                <li><Check size={16} /> Order notifications</li>
                <li><Check size={16} /> Product management</li>
                <li><Check size={16} /> Production tracking</li>
                <li><Check size={16} /> Seller messaging</li>
              </ul>
              <button className="btn-primary download-btn">
                <Download size={20} />
                Download for iOS
              </button>
              <button className="btn-secondary download-btn">
                <Download size={20} />
                Download for Android
              </button>
            </div>

            <div className="download-card glass-card">
              <div className="download-icon">
                <Monitor size={48} />
              </div>
              <h3>Desktop App</h3>
              <p>Best for bulk operations and analytics</p>
              <ul className="download-features">
                <li><Check size={16} /> Advanced inventory</li>
                <li><Check size={16} /> Bulk import/export</li>
                <li><Check size={16} /> Production planning</li>
                <li><Check size={16} /> Multi-factory support</li>
              </ul>
              <button className="btn-primary download-btn">
                <Download size={20} />
                Download for Windows
              </button>
              <button className="btn-secondary download-btn">
                <Download size={20} />
                Download for Mac
              </button>
            </div>
          </div>

          <div className="verification-note">
            <Shield size={20} />
            <span>Factory accounts require license verification. This will be completed during app setup.</span>
          </div>

          <div className="auth-divider">or</div>

          <div className="signup-alternative">
            <p>Already registered?</p>
            <Link href="/factory/login" className="auth-link">
              Sign in to your factory account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

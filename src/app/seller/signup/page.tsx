'use client';

import Link from 'next/link';
import { Download, Smartphone, Monitor, Shield, Check, ArrowLeft, Store } from 'lucide-react';

export default function SellerSignupPage() {
  return (
    <div className="portal-page">
      <div className="auth-container" style={{ maxWidth: '900px' }}>
        <Link href="/seller" className="back-link">
          <ArrowLeft size={20} />
          Back to Seller Portal
        </Link>

        <div className="auth-card" style={{ maxWidth: '900px' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <Store size={64} className="gradient-text" />
            <h1 className="auth-title" style={{ fontSize: '2.5rem' }}>Get the Seller App</h1>
            <p className="auth-subtitle">
              Download our mobile app for the best seller experience on the go
            </p>
          </div>

          <div className="download-options">
            <div className="download-card glass-card">
              <div className="download-icon">
                <Smartphone size={48} />
              </div>
              <h3>Mobile App</h3>
              <p>Best for managing orders and inventory on the move</p>
              <ul className="download-features">
                <li><Check size={16} /> Real-time order notifications</li>
                <li><Check size={16} /> Quick product updates</li>
                <li><Check size={16} /> Sales analytics</li>
                <li><Check size={16} /> Customer messaging</li>
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
              <p>Best for bulk operations and detailed analytics</p>
              <ul className="download-features">
                <li><Check size={16} /> Advanced product management</li>
                <li><Check size={16} /> Bulk import/export</li>
                <li><Check size={16} /> Full analytics suite</li>
                <li><Check size={16} /> Multi-account support</li>
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

          <div className="security-note">
            <Shield size={20} />
            <span>All downloads are verified and secure. Your data is encrypted end-to-end.</span>
          </div>

          <div className="auth-divider">or</div>

          <div className="signup-alternative">
            <p>Want to use the web version?</p>
            <Link href="/seller/login" className="auth-link">
              Sign in to your seller account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

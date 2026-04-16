'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, Github, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3 className="footer-brand">Aurora</h3>
          <p className="footer-description">
            Your destination for premium products with an exceptional shopping experience.
          </p>
          <div className="footer-social">
            <a href="#" className="social-link" aria-label="Twitter">
              <Twitter size={20} />
            </a>
            <a href="#" className="social-link" aria-label="Instagram">
              <Instagram size={20} />
            </a>
            <a href="#" className="social-link" aria-label="GitHub">
              <Github size={20} />
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h4 className="footer-title">Quick Links</h4>
          <ul className="footer-links">
            <li><Link href="/products">Products</Link></li>
            <li><Link href="/cart">Cart</Link></li>
            <li><Link href="/profile">My Account</Link></li>
            <li><Link href="/login">Login</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-title">Categories</h4>
          <ul className="footer-links">
            <li><Link href="/products">Electronics</Link></li>
            <li><Link href="/products">Clothing</Link></li>
            <li><Link href="/products">Home & Garden</Link></li>
            <li><Link href="/products">Sports</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-title">Contact Us</h4>
          <ul className="footer-contact">
            <li>
              <Mail size={16} />
              <span>support@aurora.com</span>
            </li>
            <li>
              <Phone size={16} />
              <span>+1 (555) 123-4567</span>
            </li>
            <li>
              <MapPin size={16} />
              <span>123 Market Street, CA</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Aurora. All rights reserved.</p>
        <div className="footer-legal">
          <Link href="#">Privacy Policy</Link>
          <Link href="#">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}

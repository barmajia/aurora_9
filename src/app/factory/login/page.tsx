'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { Factory, Shield, MapPin, Phone } from 'lucide-react';

export default function FactoryLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { setUser } = useAuthStore();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      const { data: factoryData, error: factoryError } = await supabase
        .from('sellers')
        .select('*')
        .eq('user_id', authData.user.id)
        .eq('is_factory', true)
        .single();

      if (factoryError || !factoryData) {
        throw new Error('Access denied: This account is not registered as a factory');
      }

      setUser({
        id: authData.user.id,
        email: authData.user.email || '',
        name: factoryData.full_name || factoryData.company_name || 'Factory',
        role: 'factory',
      });

      router.push('/factory/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: '500px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Factory size={48} className="gradient-text" style={{ marginBottom: '1rem' }} />
          <h2 className="auth-title">Factory Portal</h2>
          <p className="auth-subtitle">Access your factory dashboard</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', color: '#ef4444' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Business Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="Enter your factory email"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Signing in...' : 'Access Dashboard'}
          </button>
        </form>

        <div className="auth-divider">or</div>

        <p className="auth-switch">
          Want to sell?{' '}
          <Link href="/seller">Become a Seller</Link>
        </p>

        <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '16px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
          <h4 style={{ color: 'var(--primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shield size={18} /> Factory Benefits
          </h4>
          <ul style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.8', fontSize: '0.9rem' }}>
            <li>Connect with verified sellers</li>
            <li>Showcase products with wholesale pricing</li>
            <li>Track orders and production</li>
            <li>Location-based discovery</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

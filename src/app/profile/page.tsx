'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { User, Mail, Phone, Calendar, ShoppingBag, DollarSign } from 'lucide-react';

export default function ProfilePage() {
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchCustomer();
  }, [user]);

  async function fetchCustomer() {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      setCustomer(data);
    } catch (err: any) {
      console.error('Error fetching customer:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading || !customer) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="pulse-glow" style={{ padding: '3rem', borderRadius: '20px' }}>
          <p style={{ color: 'rgba(255,255,255,0.6)' }}>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          {customer.name?.charAt(0).toUpperCase() || 'C'}
        </div>
        <div className="profile-info">
          <h2>{customer.name}</h2>
          <p>Member since {new Date(customer.created_at).toLocaleDateString()}</p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <span className="glass-button" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
              Customer
            </span>
            {customer.total_orders > 0 && (
              <span className="glass-button" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', background: 'rgba(34, 197, 94, 0.2)', borderColor: 'rgba(34, 197, 94, 0.3)' }}>
                VIP Customer
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="profile-details">
        <div className="detail-card">
          <h3>Contact Information</h3>
          <div className="detail-item">
            <span className="detail-label">Email</span>
            <span className="detail-value">{customer.email || 'Not provided'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Phone</span>
            <span className="detail-value">{customer.phone || 'Not provided'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Age Range</span>
            <span className="detail-value">{customer.age_range || 'Not specified'}</span>
          </div>
        </div>

        <div className="detail-card">
          <h3>Order Statistics</h3>
          <div className="detail-item">
            <span className="detail-label">Total Orders</span>
            <span className="detail-value" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShoppingBag size={18} /> {customer.total_orders || 0}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Total Spent</span>
            <span className="detail-value" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4ade80' }}>
              <DollarSign size={18} /> ${(customer.total_spent || 0).toFixed(2)}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Last Purchase</span>
            <span className="detail-value">
              {customer.last_purchase_date 
                ? new Date(customer.last_purchase_date).toLocaleDateString()
                : 'No purchases yet'}
            </span>
          </div>
        </div>

        <div className="detail-card">
          <h3>Account Details</h3>
          <div className="detail-item">
            <span className="detail-label">Account ID</span>
            <span className="detail-value" style={{ fontSize: '0.875rem', fontFamily: 'monospace' }}>
              {customer.id.slice(0, 8)}...{customer.id.slice(-8)}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Created At</span>
            <span className="detail-value">{new Date(customer.created_at).toLocaleDateString()}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Updated At</span>
            <span className="detail-value">{new Date(customer.updated_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

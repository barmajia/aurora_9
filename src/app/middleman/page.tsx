'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { createProfile, getCurrentUserProfile } from '@/lib/middleman';
import { useMiddlemanStore } from '@/stores/middleman';
import { motion } from 'framer-motion';

export default function MiddlemanPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { setProfile } = useMiddlemanStore();
  const [storeName, setStoreName] = useState('');
  const [storeSlug, setStoreSlug] = useState('');
  const [bio, setBio] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const [existingProfile, setExistingProfile] = useState<any>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/middleman');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadExistingProfile();
    }
  }, [user]);

  useEffect(() => {
    if (storeName) {
      setStoreSlug(storeName.toLowerCase().replace(/\s+/g, '-'));
    }
  }, [storeName]);

  async function loadExistingProfile() {
    try {
      const profile = await getCurrentUserProfile();
      if (profile) {
        setExistingProfile(profile);
        setProfile(profile);
      }
    } catch (err) {
      console.error('Error loading profile:', err);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsCreating(true);

    try {
      if (!storeName.trim() || !storeSlug.trim()) {
        throw new Error('Store name and slug are required');
      }

      const profile = await createProfile({
        store_name: storeName.trim(),
        store_slug: storeSlug.trim(),
        bio: bio.trim() || undefined,
      });

      setProfile(profile);
      router.push('/template');
    } catch (err: any) {
      setError(err.message || 'Failed to create store');
    } finally {
      setIsCreating(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (existingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-card border border-border rounded-2xl p-8 shadow-2xl"
        >
          <div className="text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🏪</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">Welcome Back!</h1>
            <p className="text-muted-foreground mb-6">
              You already have a store: <strong>{existingProfile.store_name}</strong>
            </p>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full btn-primary py-3 rounded-lg font-medium"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => router.push(`/${existingProfile.store_slug}`)}
                className="w-full btn-outline py-3 rounded-lg font-medium"
              >
                View Your Store
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-card border border-border rounded-2xl p-8 shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🚀</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Create Your Store</h1>
          <p className="text-muted-foreground">
            Start your journey as a middleman seller
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="storeName" className="block text-sm font-medium mb-2">
              Store Name
            </label>
            <input
              id="storeName"
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="e.g., John's Tech Store"
              className="input-field w-full"
              required
            />
          </div>

          <div>
            <label htmlFor="storeSlug" className="block text-sm font-medium mb-2">
              Store URL Slug
            </label>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">localhost:3000/</span>
              <input
                id="storeSlug"
                type="text"
                value={storeSlug}
                onChange={(e) => setStoreSlug(e.target.value)}
                placeholder="johns-tech-store"
                className="input-field flex-1"
                required
                pattern="[a-z0-9-]+"
                title="Lowercase letters, numbers, and hyphens only"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              This will be your unique store URL
            </p>
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium mb-2">
              Bio (Optional)
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell customers about your store..."
              rows={3}
              className="input-field w-full resize-none"
            />
          </div>

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isCreating}
            className="w-full btn-primary py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? 'Creating Store...' : 'Create Store & Choose Template'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

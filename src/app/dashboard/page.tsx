'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMiddlemanStore } from '@/stores/middleman';
import { getCurrentUserProfile, getStoreProducts, addProductToStore, removeProductFromStore } from '@/lib/middleman';
import { motion } from 'framer-motion';
import { Package, Plus, Trash2, ExternalLink, LayoutDashboard, ShoppingBag, Settings } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const { profile, setProfile } = useMiddlemanStore();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [newAsin, setNewAsin] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState('products');

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const userProfile = await getCurrentUserProfile();
      if (!userProfile) {
        router.push('/middleman');
        return;
      }
      setProfile(userProfile);
      
      // Load products
      const storeProducts = await getStoreProducts(userProfile.id);
      setProducts(storeProducts || []);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!profile || !newAsin.trim()) return;

    setIsAdding(true);
    try {
      await addProductToStore(profile.id, newAsin.trim());
      setNewAsin('');
      await loadProfile(); // Reload products
    } catch (error: any) {
      alert(error.message || 'Failed to add product');
    } finally {
      setIsAdding(false);
    }
  }

  async function handleRemoveProduct(asin: string) {
    if (!profile) return;
    
    if (!confirm('Remove this product from your store?')) return;

    try {
      await removeProductFromStore(profile.id, asin);
      await loadProfile();
    } catch (error: any) {
      alert(error.message || 'Failed to remove product');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card/50 p-6 hidden lg:block">
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-1">Dashboard</h2>
          <p className="text-sm text-muted-foreground">{profile?.store_name}</p>
        </div>

        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'products' 
                ? 'bg-primary text-primary-foreground' 
                : 'hover:bg-muted'
            }`}
          >
            <Package className="w-5 h-5" />
            <span>Products</span>
          </button>
          
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'settings' 
                ? 'bg-primary text-primary-foreground' 
                : 'hover:bg-muted'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>

          <Link
            href={`/${profile?.store_slug}`}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
          >
            <ExternalLink className="w-5 h-5" />
            <span>View Store</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {activeTab === 'products' ? 'Manage Products' : 'Store Settings'}
              </h1>
              <p className="text-muted-foreground">
                {activeTab === 'products' 
                  ? 'Add and manage products in your store' 
                  : 'Configure your store settings'}
              </p>
            </div>
            
            <Link
              href="/template"
              className="btn-outline flex items-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              Change Template
            </Link>
          </div>

          {activeTab === 'products' && (
            <>
              {/* Add Product Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-2xl p-6 mb-8"
              >
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add Product by ASIN
                </h3>
                
                <form onSubmit={handleAddProduct} className="flex gap-4">
                  <input
                    type="text"
                    value={newAsin}
                    onChange={(e) => setNewAsin(e.target.value)}
                    placeholder="Enter Amazon ASIN (e.g., B08N5WRWNW)"
                    className="input-field flex-1"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isAdding}
                    className="btn-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAdding ? 'Adding...' : 'Add Product'}
                  </button>
                </form>
                
                <p className="text-xs text-muted-foreground mt-3">
                  Tip: You can find the ASIN in the Amazon product URL or details section.
                </p>
              </motion.div>

              {/* Products List */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card border border-border rounded-2xl overflow-hidden"
              >
                <div className="p-6 border-b border-border">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5" />
                    Your Products ({products.length})
                  </h3>
                </div>

                {products.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="text-6xl mb-4">📦</div>
                    <h4 className="text-lg font-semibold mb-2">No Products Yet</h4>
                    <p className="text-muted-foreground mb-4">
                      Start by adding your first product using its ASIN above.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {products.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          {item.products?.image_url ? (
                            <img
                              src={item.products.image_url}
                              alt={item.products.title}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                              <span className="text-2xl">📷</span>
                            </div>
                          )}
                          
                          <div>
                            <h4 className="font-medium line-clamp-1 max-w-md">
                              {item.products?.title || `ASIN: ${item.asin}`}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              ASIN: {item.asin}
                              {item.products?.price && (
                                <span className="ml-2 text-primary font-semibold">
                                  ${item.products.price.toFixed(2)}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleRemoveProduct(item.asin)}
                          className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </>
          )}

          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold mb-6">Store Settings</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Store Name</label>
                  <input
                    type="text"
                    defaultValue={profile?.store_name}
                    className="input-field w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Bio</label>
                  <textarea
                    defaultValue={profile?.bio || ''}
                    rows={4}
                    className="input-field w-full resize-none"
                    placeholder="Tell customers about your store..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Store URL</label>
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                    <code className="text-sm">localhost:3000/</code>
                    <span className="font-mono font-semibold">{profile?.store_slug}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    The store URL cannot be changed after creation.
                  </p>
                </div>

                <button className="btn-primary px-6">
                  Save Changes
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}

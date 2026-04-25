'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart, Star } from 'lucide-react';

interface Product {
  id: string;
  asin: string;
  title: string;
  price: number;
  image_url: string | null;
  rating?: number;
  reviews_count?: number;
}

interface Profile {
  id: string;
  store_name: string;
  store_slug: string;
  bio: string | null;
  avatar_url: string | null;
}

interface StorefrontProps {
  profile: Profile;
  products: Product[];
  templateConfig: any;
}

export default function Storefront({ profile, products, templateConfig }: StorefrontProps) {
  const primaryColor = templateConfig?.primaryColor || '#7C3AED';
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {profile.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={profile.store_name}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
              ) : (
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-white"
                  style={{ backgroundColor: primaryColor }}
                >
                  {profile.store_name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h1 className="text-xl font-bold">{profile.store_name}</h1>
                {profile.bio && (
                  <p className="text-sm text-muted-foreground line-clamp-1">{profile.bio}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-muted rounded-full transition-colors relative">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                  0
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      {products.length > 0 && (
        <section className="bg-gradient-to-r from-primary/10 to-secondary/10 py-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Welcome to {profile.store_name}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground text-lg max-w-2xl mx-auto"
            >
              Curated products just for you
            </motion.p>
          </div>
        </section>
      )}

      {/* Products Grid */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {products.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold mb-2">No Products Yet</h3>
            <p className="text-muted-foreground">
              The store owner hasn't added any products yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Product Image */}
                <div className="aspect-square relative overflow-hidden bg-muted">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <span className="text-4xl">📷</span>
                    </div>
                  )}
                  
                  {/* Quick Actions */}
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 bg-card/90 backdrop-blur-sm rounded-full hover:bg-primary hover:text-primary-foreground transition-colors">
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <Link href={`/products/${product.asin}`}>
                    <h3 className="font-medium mb-2 line-clamp-2 hover:text-primary transition-colors cursor-pointer">
                      {product.title}
                    </h3>
                  </Link>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">
                      ${product.price?.toFixed(2) || '0.00'}
                    </span>
                    
                    {product.rating && (
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                        <span>{product.rating.toFixed(1)}</span>
                        <span className="text-muted-foreground">
                          ({product.reviews_count || 0})
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <button 
                    className="w-full mt-4 btn-primary py-2 rounded-lg font-medium text-sm"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Add to Cart
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {profile.store_name}. Powered by Aurora.</p>
        </div>
      </footer>
    </div>
  );
}

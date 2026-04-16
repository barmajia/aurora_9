'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useWishlistStore } from '@/store/wishlist';
import { useToastStore } from '@/store/toast';
import ProductQuickView from './ProductQuickView';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number | null;
  currency: string;
  images: any[];
  category?: string;
  subcategory?: string;
  quantity: number;
}

export default function ProductCard({ product }: { product: Product }) {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  const addToast = useToastStore((state) => state.addToast);
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.title,
      price: product.price || 0,
      image: product.images?.[0]?.url || '/placeholder.jpg',
      category: product.category || 'Uncategorized',
      description: product.description,
    });
    addToast(`${product.title} added to cart`, 'success');
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(product.id);
      addToast('Removed from wishlist', 'info');
    } else {
      addToWishlist({
        id: product.id,
        name: product.title,
        price: product.price || 0,
        image: product.images?.[0]?.url || '/placeholder.jpg',
        category: product.category || 'Uncategorized',
      });
      addToast('Added to wishlist', 'success');
    }
  };

  return (
    <>
      <div className="product-card" onClick={() => setIsQuickViewOpen(true)}>
        <div className="product-image-wrapper">
          <img
            src={product.images?.[0]?.url || 'https://via.placeholder.com/400x300?text=No+Image'}
            alt={product.title}
            className="product-image"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Image';
            }}
          />
          <div className="product-badge">
            {product.quantity > 0 ? 'New' : 'Sold Out'}
          </div>
          <button
            className={`product-wishlist ${inWishlist ? 'active' : ''}`}
            onClick={handleWishlist}
          >
            <Heart size={18} fill={inWishlist ? 'currentColor' : 'none'} />
          </button>
          <button
            className="quick-view-btn"
            onClick={(e) => {
              e.stopPropagation();
              setIsQuickViewOpen(true);
            }}
          >
            Quick View
          </button>
        </div>
        <div className="product-info">
          <span className="product-category">{product.category || product.subcategory || 'General'}</span>
          <h3 className="product-name">{product.title}</h3>
          <p className="product-description">{product.description}</p>
          <div className="product-footer">
            <span className="product-price">
              {product.currency || '$'}{(product.price || 0).toFixed(2)}
            </span>
            <button
              onClick={handleAddToCart}
              className="add-to-cart-btn"
              disabled={product.quantity <= 0}
            >
              {product.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>

      <ProductQuickView
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </>
  );
}

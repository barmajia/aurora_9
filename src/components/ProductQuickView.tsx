'use client';

import { X, Heart, ShoppingCart, Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { useCartStore } from '@/store/cart';
import { useWishlistStore } from '@/store/wishlist';
import { useToastStore } from '@/store/toast';

interface ProductQuickViewType {
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

interface ProductQuickViewProps {
  product: ProductQuickViewType | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductQuickView({ product, isOpen, onClose }: ProductQuickViewProps) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  const addToast = useToastStore((state) => state.addToast);

  if (!isOpen || !product) return null;

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.title,
        price: product.price || 0,
        image: product.images?.[0]?.url || '/placeholder.jpg',
        category: product.category || 'Uncategorized',
        description: product.description,
      });
    }
    addToast(`Added ${quantity} ${quantity === 1 ? 'item' : 'items'} to cart`, 'success');
    setQuantity(1);
  };

  const handleWishlist = () => {
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content quick-view-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="quick-view-grid">
          <div className="quick-view-image">
            <img
              src={product.images?.[0]?.url || 'https://via.placeholder.com/500x500?text=No+Image'}
              alt={product.title}
            />
            <button
              className={`wishlist-btn ${inWishlist ? 'active' : ''}`}
              onClick={handleWishlist}
            >
              <Heart size={20} fill={inWishlist ? 'currentColor' : 'none'} />
            </button>
          </div>

          <div className="quick-view-details">
            <span className="product-category">{product.category || product.subcategory || 'General'}</span>
            <h2 className="quick-view-title">{product.title}</h2>

            <div className="quick-view-price">
              {product.currency || '$'}{(product.price || 0).toFixed(2)}
            </div>

            <p className="quick-view-description">{product.description}</p>

            <div className="quick-view-stock">
              {product.quantity > 0 ? (
                <span className="in-stock">
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
                    <circle cx="4" cy="4" r="4" />
                  </svg>
                  In Stock ({product.quantity} available)
                </span>
              ) : (
                <span className="out-of-stock">Out of Stock</span>
              )}
            </div>

            <div className="quick-view-actions">
              <div className="quantity-selector">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}>
                  <Minus size={18} />
                </button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} disabled={quantity >= product.quantity}>
                  <Plus size={18} />
                </button>
              </div>

              <button
                className="add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={product.quantity <= 0}
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

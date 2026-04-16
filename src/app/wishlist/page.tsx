'use client';

import Link from 'next/link';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import { useWishlistStore } from '@/store/wishlist';
import { useCartStore } from '@/store/cart';
import { useToastStore } from '@/store/toast';

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore();
  const addItem = useCartStore((state) => state.addItem);
  const addToast = useToastStore((state) => state.addToast);

  const handleMoveToCart = (item: typeof items[0]) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category,
      description: item.description || '',
    });
    removeItem(item.id);
    addToast(`${item.name} moved to cart`, 'success');
  };

  const handleRemove = (id: string) => {
    removeItem(id);
    addToast('Removed from wishlist', 'info');
  };

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <Heart size={64} style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
        <h3>Your wishlist is empty</h3>
        <p>Save items you love by clicking the heart icon</p>
        <Link href="/products" className="btn-primary">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="wishlist-container">
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="hero-title" style={{ fontSize: '3rem' }}>My Wishlist</h1>
        <p className="hero-subtitle" style={{ marginTop: '0.5rem' }}>
          {items.length} {items.length === 1 ? 'item' : 'items'} saved
        </p>
      </div>

      <div className="wishlist-grid">
        {items.map((item) => (
          <div key={item.id} className="wishlist-item glass-card">
            <img src={item.image} alt={item.name} className="wishlist-item-image" />
            <div className="wishlist-item-info">
              <span className="wishlist-item-category">{item.category}</span>
              <h3 className="wishlist-item-name">{item.name}</h3>
              <p className="wishlist-item-price">${item.price.toFixed(2)}</p>
            </div>
            <div className="wishlist-item-actions">
              <button
                className="btn-primary"
                style={{ padding: '0.75rem 1.5rem', fontSize: '0.9rem' }}
                onClick={() => handleMoveToCart(item)}
              >
                <ShoppingCart size={16} />
                Move to Cart
              </button>
              <button
                className="remove-btn"
                onClick={() => handleRemove(item.id)}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

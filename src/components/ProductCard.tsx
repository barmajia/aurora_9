'use client';

import { useCartStore } from '@/store/cart';

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
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.title,
      price: product.price || 0,
      image: product.images?.[0]?.url || '/placeholder.jpg',
      category: product.category || 'Uncategorized',
      description: product.description,
    });
  };

  return (
    <div className="product-card">
      <img
        src={product.images?.[0]?.url || 'https://via.placeholder.com/400x300?text=No+Image'}
        alt={product.title}
        className="product-image"
        onError={(e) => {
          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Image';
        }}
      />
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
  );
}
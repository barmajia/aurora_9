'use client';

import Link from 'next/link';
import { useCartStore } from '@/store/cart';
import CartItemComponent from '@/components/CartItem';

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="empty-cart">
        <h1>Your cart is empty</h1>
        <p>Add some products to get started!</p>
        <Link href="/" className="continue-shopping">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>
      {items.map((item) => (
        <CartItemComponent key={item.id} item={item} />
      ))}
      <div className="cart-summary">
        <p className="cart-total">Total: ${total.toFixed(2)}</p>
        <button className="checkout-btn" onClick={clearCart}>
          Checkout (Demo)
        </button>
      </div>
    </div>
  );
}
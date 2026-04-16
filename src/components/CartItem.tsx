'use client';

import { CartItem as CartItemType } from '@/types';
import { useCartStore } from '@/store/cart';

export default function CartItem({ item }: { item: CartItemType }) {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="cart-item">
      <img src={item.image} alt={item.name} className="cart-item-image" />
      <div className="cart-item-details">
        <h3>{item.name}</h3>
        <p>${item.price.toFixed(2)}</p>
      </div>
      <div className="cart-item-quantity">
        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
        <span>{item.quantity}</span>
        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
      </div>
      <button onClick={() => removeItem(item.id)} className="remove-btn">
        Remove
      </button>
    </div>
  );
}
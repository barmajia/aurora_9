'use client';

import Image from 'next/image';
import { CartItem as CartItemType } from '@/types';
import { useCartStore } from '@/store/cart';

export default function CartItem({ item }: { item: CartItemType }) {
  const { updateQuantity, removeItem } = useCartStore();
  const itemPrice = item.price || 0;
  const itemName = item.name || 'Product';
  const itemImage = item.image || '/images/placeholder.jpg';

  return (
    <div className="flex items-center gap-6 p-6 group">
      <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-white/10 shrink-0">
        <Image
          src={itemImage}
          alt={itemName}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-black text-primary uppercase tracking-widest mb-1.5">{item.category || 'Asset'}</div>
        <h3 className="text-lg font-black italic tracking-tighter text-white uppercase truncate">{itemName}</h3>
        <div className="text-sm font-bold text-white/40 mt-1">${itemPrice.toFixed(2)}</div>
      </div>

      <div className="flex flex-col items-end gap-4">
        <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/5">
          <button 
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-all disabled:opacity-20"
          >-</button>
          <span className="w-8 text-center text-xs font-black italic text-white">{item.quantity}</span>
          <button 
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-all"
          >+</button>
        </div>
        
        <button 
          onClick={() => removeItem(item.id)} 
          className="text-[9px] font-black uppercase tracking-widest text-white/10 hover:text-rose-500 transition-colors"
        >
          Remove Entity
        </button>
      </div>
    </div>
  );
}
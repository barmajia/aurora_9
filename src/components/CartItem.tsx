"use client";

import Image from "next/image";
import { Minus, Plus, Trash2, Heart } from "lucide-react";
import { memo, useCallback } from "react";
import { CartItem as CartItemType } from "@/types";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";

interface CartItemProps {
  item: CartItemType;
}

function CartItemComponent({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();
  const { addItem: addToWishlist, isInWishlist } = useWishlistStore();

  const itemPrice = item.price ?? 0;
  const itemName = item.name ?? item.title ?? "Product";
  const itemImage =
    item.image ?? item.images?.[0]?.url ?? "/images/placeholder.jpg";
  const lineTotal = itemPrice * item.quantity;

  const inWishlist = isInWishlist(item.id);

  const handleDecreaseQuantity = useCallback(() => {
    updateQuantity(item.id, Math.max(1, item.quantity - 1));
  }, [updateQuantity, item.id, item.quantity]);

  const handleIncreaseQuantity = useCallback(() => {
    updateQuantity(item.id, item.quantity + 1);
  }, [updateQuantity, item.id, item.quantity]);

  const handleRemoveItem = useCallback(() => {
    removeItem(item.id);
  }, [removeItem, item.id]);

  const handleAddToWishlist = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      addToWishlist({
        id: item.id,
        name: itemName,
        price: itemPrice,
        image: itemImage,
        category: item.category ?? "General",
      });
    },
    [addToWishlist, item.id, itemName, itemPrice, itemImage, item.category],
  );

  const isDecrementDisabled = item.quantity <= 1;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-6 p-6 group border-b border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
      <div className="flex items-center gap-5 min-w-0 flex-1">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 shrink-0 bg-black/5 dark:bg-white/5">
          <Image
            src={itemImage}
            alt={itemName}
            fill
            sizes="(max-width: 640px) 80px, 96px"
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
          />
          {/* Badge */}
          {item.badge && (
            <span className="absolute top-2 left-2 z-10 bg-black/80 dark:bg-white/90 text-white dark:text-black text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full backdrop-blur-sm">
              {item.badge}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="text-[10px] font-black text-primary uppercase tracking-widest mb-1.5">
              {item.category ?? item.subcategory ?? "Asset"}
            </div>
            {/* Wishlist button */}
            <button
              onClick={handleAddToWishlist}
              className="p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-black/40 dark:text-white/40 hover:text-rose-500 lg:opacity-0 lg:group-hover:opacity-100"
              aria-label="Add to wishlist"
            >
              <Heart
                size={14}
                fill={inWishlist ? "currentColor" : "none"}
                className={inWishlist ? "text-rose-500" : ""}
              />
            </button>
          </div>

          <h3 className="text-lg font-black italic tracking-tighter text-black dark:text-white uppercase truncate">
            {itemName}
          </h3>

          {/* Rating and reviews */}
          {(item.rating !== undefined || item.reviews !== undefined) && (
            <div className="flex items-center gap-2 mt-1.5">
              {item.rating !== undefined && (
                <div className="flex items-center gap-0.5">
                  <StarRating rating={item.rating} size="sm" />
                </div>
              )}
              {item.reviews !== undefined && item.reviews > 0 && (
                <span className="text-[9px] font-bold text-black/30 dark:text-white/30 uppercase tracking-widest">
                  {item.reviews} Reviews
                </span>
              )}
            </div>
          )}

          <div className="text-[11px] font-bold text-black/40 dark:text-white/40 mt-1 flex items-center gap-2 flex-wrap">
            <span>${itemPrice.toFixed(2)}</span>
            {item.oldPrice && item.oldPrice > itemPrice && (
              <>
                <span className="text-black/10 dark:text-white/10">•</span>
                <span className="text-black/30 dark:text-white/30 line-through">
                  ${item.oldPrice.toFixed(2)}
                </span>
                <span className="text-green-600 dark:text-green-400 text-[9px] font-black">
                  {Math.round(
                    ((item.oldPrice - itemPrice) / item.oldPrice) * 100,
                  )}
                  % OFF
                </span>
              </>
            )}
            <span className="text-black/10 dark:text-white/10">•</span>
            <span className="text-black/20 dark:text-white/20 uppercase tracking-widest font-black">
              Unit
            </span>
          </div>

          {/* Stock status */}
          {item.stock !== undefined && (
            <div className="flex items-center gap-1.5 mt-2">
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  item.stock > 0
                    ? "bg-emerald-600 dark:bg-emerald-500"
                    : "bg-rose-600 dark:bg-rose-500"
                }`}
              />
              <span className="text-[8px] font-bold text-black/30 dark:text-white/30 uppercase tracking-widest">
                {item.stock > 0 ? `${item.stock} in stock` : "Out of stock"}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-4 sm:gap-3">
        <div className="flex items-center gap-1.5 bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-black/10 dark:border-white/10">
          <button
            type="button"
            aria-label={`Decrease quantity for ${itemName}`}
            onClick={handleDecreaseQuantity}
            disabled={isDecrementDisabled}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition-all disabled:opacity-20 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <Minus size={14} />
          </button>

          <span className="w-8 text-center text-xs font-black italic text-black dark:text-white">
            {item.quantity}
          </span>

          <button
            type="button"
            aria-label={`Increase quantity for ${itemName}`}
            onClick={handleIncreaseQuantity}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <Plus size={14} />
          </button>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="text-sm font-black italic text-black dark:text-white tracking-tight">
            ${lineTotal.toFixed(2)}
          </div>

          <button
            type="button"
            onClick={handleRemoveItem}
            aria-label={`Remove ${itemName} from cart`}
            className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-black/20 dark:text-white/20 hover:text-rose-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40 rounded"
          >
            <Trash2 size={12} />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

// StarRating component
const StarRating = ({
  rating,
  size = "sm",
}: {
  rating: number;
  size?: "sm" | "md";
}) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  const iconSize = size === "sm" ? "w-3 h-3" : "w-4 h-4";

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(fullStars)].map((_, i) => (
        <svg
          key={`full-${i}`}
          className={`${iconSize} text-yellow-500 fill-current`}
          viewBox="0 0 20 20"
        >
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      ))}
      {hasHalfStar && (
        <svg
          className={`${iconSize} text-yellow-500 fill-current`}
          viewBox="0 0 20 20"
        >
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0v15z" />
        </svg>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <svg
          key={`empty-${i}`}
          className={`${iconSize} text-gray-300 dark:text-gray-600 fill-current`}
          viewBox="0 0 20 20"
        >
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      ))}
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export const CartItem = memo(CartItemComponent);

// Default export for convenience
export default CartItem;

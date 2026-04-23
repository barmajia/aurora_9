"use client";

import { useState } from "react";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import Image from "next/image";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { useToastStore } from "@/store/toast";
import ProductQuickView from "./ProductQuickView";
import { Product } from "@/types";

const StarRating = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(fullStars)].map((_, i) => (
        <svg
          key={`full-${i}`}
          className="w-4 h-4 text-yellow-400 fill-current"
          viewBox="0 0 20 20"
        >
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      ))}
      {hasHalfStar && (
        <svg
          className="w-4 h-4 text-yellow-400 fill-current"
          viewBox="0 0 20 20"
        >
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0v15z" />
        </svg>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <svg
          key={`empty-${i}`}
          className="w-4 h-4 text-gray-300 dark:text-gray-600 fill-current"
          viewBox="0 0 20 20"
        >
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      ))}
    </div>
  );
};

export default function ProductCard({ product }: { product: Product }) {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const {
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
    isInWishlist,
  } = useWishlistStore();
  const addToast = useToastStore((state) => state.addToast);
  const inWishlist = isInWishlist(product.id);

  const productName = product.name || product.title || "Product";
  const productImage =
    product.image || product.images?.[0]?.url || "/images/placeholder.jpg";
  const productPrice = product.price || 0;
  const productOldPrice = product.oldPrice;
  const productDescription = product.description || "";
  const productCategory = product.category || "";
  const productRating = product.rating || 0;
  const productReviews = product.reviews || 0;
  const productBadge = product.badge || "";
  const productInStock = product.stock ?? true;

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: productName,
      price: productPrice,
      image: productImage,
      category: productCategory,
      description: productDescription,
    });
    addToast(`${productName} added to cart`, "success");
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(product.id);
      addToast("Removed from wishlist", "info");
    } else {
      addToWishlist({
        id: product.id,
        name: productName,
        price: productPrice,
        image: productImage,
        category: productCategory,
      });
      addToast("Added to wishlist", "success");
    }
  };

  return (
    <>
      <div
        className="aurora-card group cursor-pointer"
        onClick={() => setIsQuickViewOpen(true)}
      >
        {/* Badge and Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden bg-zinc-50 border-b border-zinc-100">
          {productBadge && (
            <span className="absolute top-4 left-4 z-10 bg-black text-white text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full shadow-lg">
              {productBadge}
            </span>
          )}

          <button
            onClick={handleWishlist}
            className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-md border border-zinc-200 text-zinc-400 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300 shadow-sm"
            aria-label="Add to wishlist"
          >
            <Heart
              size={18}
              fill={inWishlist ? "currentColor" : "none"}
              className={inWishlist ? "text-rose-500" : ""}
            />
          </button>

          <Image
            src={productImage}
            alt={productName}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-60" />

          <div className="absolute bottom-4 left-4 right-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart();
              }}
              className="w-full h-11 bg-black text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2 shadow-xl"
            >
              <ShoppingBag size={14} />
              Add to Cart
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">
                {productCategory || "Uncategorized"}
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white line-clamp-1 uppercase tracking-tight">
                {productName}
              </h3>
            </div>
            <div className="text-xl font-bold text-zinc-900 dark:text-white">
              <span className="text-sm font-medium text-zinc-400 mr-0.5">
                $
              </span>
              {productPrice.toFixed(0)}
              <span className="text-[10px] font-medium text-zinc-400">
                .{(productPrice % 1).toFixed(2).slice(2)}
              </span>
            </div>
          </div>

          <p className="text-zinc-500 text-xs mb-6 line-clamp-2 font-medium leading-relaxed">
            {productDescription}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <StarRating rating={productRating} />
              <span className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest">
                {productReviews} Reviews
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                Stocked
              </span>
            </div>
          </div>
        </div>
      </div>

      <ProductQuickView
        product={
          product
            ? {
                id: product.id,
                title: product.title || product.name || "Product",
                description: product.description || "",
                price: product.price || null,
                currency: product.currency || "USD",
                images:
                  product.images ||
                  (product.image ? [{ url: product.image }] : []),
                category: product.category,
                subcategory: product.subcategory,
                quantity: product.quantity || 1,
              }
            : null
        }
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </>
  );
}

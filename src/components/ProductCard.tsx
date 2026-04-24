"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Eye, Star } from "lucide-react";
import Image from "next/image";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { useToastStore } from "@/store/toast";
import ProductQuickView from "./ProductQuickView";
import { Product } from "@/types";
import { cn } from "@/lib/utils";
import { obfuscateId } from "@/lib/id-utils";

const StarRating = ({
  rating,
  reviews,
}: {
  rating: number;
  reviews: number;
}) => {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={10}
            className={cn(
              "fill-current",
              i < Math.floor(rating)
                ? "text-blue-500"
                : "text-zinc-300 dark:text-zinc-800",
            )}
          />
        ))}
      </div>
      <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">
        ({reviews})
      </span>
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
  const productDescription = product.description || "";
  const productCategory = product.category || "";
  const productRating = product.rating || 0;
  const productReviews = product.reviews || 0;
  const productBadge = product.badge || "";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id: product.id,
      name: productName,
      price: productPrice,
      image: productImage,
      category: productCategory,
      description: productDescription,
    });
    addToast(productName + " added to cart", "success");
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
      <div className="aurora-card group flex flex-col h-full cursor-pointer overflow-hidden p-2.5 relative">
        <div className="relative aspect-square rounded-[1.25rem] overflow-hidden bg-zinc-100 dark:bg-zinc-900 mb-4 z-2">
          {productBadge && (
            <div className="absolute top-3 left-3 z-10 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md px-2 py-1 rounded-full shadow-sm">
              <span className="text-[8px] font-black uppercase tracking-widest text-zinc-900 dark:text-white">
                {productBadge}
              </span>
            </div>
          )}

          <button
            onClick={handleWishlist}
            className={cn(
              "absolute top-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm",
              inWishlist
                ? "bg-rose-500 text-white"
                : "bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md text-zinc-400 hover:text-rose-500",
            )}
          >
            <Heart size={14} fill={inWishlist ? "currentColor" : "none"} />
          </button>

          <Image
            src={productImage}
            alt={productName}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />

          {/* Quick Actions Overlay */}
          <div className="absolute bottom-3 left-3 right-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex gap-1.5 z-20">
            <button
              onClick={handleAddToCart}
              className="flex-1 h-10 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[9px] font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-1.5 shadow-xl hover:scale-[1.02] transition-all"
            >
              <ShoppingBag size={12} />
              Add
            </button>
            <button
              className="w-10 h-10 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md text-zinc-900 dark:text-white rounded-xl flex items-center justify-center shadow-xl hover:scale-[1.02] transition-all"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsQuickViewOpen(true);
              }}
            >
              <Eye size={14} />
            </button>
          </div>
        </div>

        <div className="flex flex-col flex-1 px-1.5 pb-1 z-[2]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[8px] font-black uppercase tracking-widest text-blue-500">
              {productCategory || "Universal"}
            </span>
            <StarRating rating={productRating} reviews={productReviews} />
          </div>

          <h3 className="text-sm font-black italic tracking-tighter text-zinc-900 dark:text-white uppercase mb-3 line-clamp-1">
            {productName}
          </h3>

          <div className="mt-auto flex items-end justify-between gap-2">
            <div className="flex flex-col">
              <span className="text-[7px] font-black uppercase tracking-widest text-zinc-400 leading-none mb-0.5">
                Price Unit
              </span>
              <p className="text-lg font-black italic tracking-tighter text-zinc-900 dark:text-white leading-none">
                $
                {productPrice.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
            <div className="h-8 px-2.5 rounded-lg border border-zinc-100 dark:border-zinc-800 flex items-center gap-1.5">
              <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                Sync
              </span>
            </div>
          </div>
        </div>
        <Link
          href={`/products/${obfuscateId(product.id)}`}
          className="absolute inset-0 z-[5]"
        ></Link>
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

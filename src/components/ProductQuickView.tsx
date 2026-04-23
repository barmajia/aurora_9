"use client";

import {
  X,
  Heart,
  ShoppingCart,
  Minus,
  Plus,
  Truck,
  Shield,
  RotateCcw,
  Star,
  Share2,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { useToastStore } from "@/store/toast";
import { useAuthStore } from "@/store/auth";

interface ProductImage {
  url: string;
}

interface ProductQuickViewType {
  id: string;
  title: string;
  description: string;
  price: number | null;
  currency: string;
  images: ProductImage[];
  category?: string;
  subcategory?: string;
  quantity: number;
  rating?: number;
  reviews?: number;
  oldPrice?: number;
  discount?: number;
}

interface ProductQuickViewProps {
  product: ProductQuickViewType | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductQuickView({
  product,
  isOpen,
  onClose,
}: ProductQuickViewProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<
    "overview" | "shipping" | "reviews"
  >("overview");
  const addItem = useCartStore((state) => state.addItem);
  const {
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
    isInWishlist,
  } = useWishlistStore();
  const addToast = useToastStore((state) => state.addToast);
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  if (!isOpen || !product) return null;

  const inWishlist = isInWishlist(product.id);
  const productImages =
    product.images && product.images.length > 0
      ? product.images
      : [{ url: "/images/placeholder.jpg" }];
  const discount =
    product.oldPrice && product.price
      ? Math.round(
          ((product.oldPrice - product.price) / product.oldPrice) * 100,
        )
      : 0;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.title,
        price: product.price || 0,
        image: product.images?.[0]?.url || "/placeholder.jpg",
        category: product.category || "Uncategorized",
        description: product.description,
      });
    }
    addToast(
      `Added ${quantity} ${quantity === 1 ? "item" : "items"} to cart`,
      "success",
    );
    setQuantity(1);
  };

  const handleBuyNow = () => {
    // Add item to cart
    handleAddToCart();

    // Redirect to checkout
    setTimeout(() => {
      onClose();
      router.push("/checkout");
    }, 300);
  };

  const handleCheckout = () => {
    if (!user) {
      addToast("Please login to checkout", "info");
      router.push("/login");
      return;
    }
    handleBuyNow();
  };

  const handleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
      addToast("Removed from wishlist", "info");
    } else {
      addToWishlist({
        id: product.id,
        name: product.title,
        price: product.price || 0,
        image: product.images?.[0]?.url || "/placeholder.jpg",
        category: product.category || "Uncategorized",
      });
      addToast("Added to wishlist", "success");
    }
  };

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    return (
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              className={
                i < Math.floor(rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-zinc-300 dark:text-zinc-600"
              }
            />
          ))}
        </div>
        <span className="text-sm text-zinc-600 dark:text-zinc-400">
          ({product.reviews || 0} reviews)
        </span>
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-[85vw] h-[85vh] bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-zinc-200 dark:border-zinc-800">
          <h1 className="text-2xl font-bold text-foreground">
            Product Details
          </h1>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
          >
            <X size={24} className="text-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6 h-full">
            {/* Left: Image Gallery */}
            <div className="lg:col-span-1 flex flex-col gap-4">
              {/* Main Image */}
              <div className="relative bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900 rounded-2xl aspect-square overflow-hidden flex items-center justify-center group">
                <Image
                  src={
                    productImages[selectedImageIndex]?.url ||
                    "/images/placeholder.jpg"
                  }
                  alt={product.title}
                  width={500}
                  height={500}
                  className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-300"
                  placeholder="blur"
                  blurDataURL="/images/placeholder.jpg"
                />
                {discount > 0 && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    -{discount}%
                  </div>
                )}
                <button
                  onClick={handleWishlist}
                  className={`absolute top-4 right-4 p-3 rounded-full transition-all duration-300 ${
                    inWishlist
                      ? "bg-red-500/20 text-red-500"
                      : "bg-zinc-200 dark:bg-zinc-700 text-foreground hover:bg-zinc-300 dark:hover:bg-zinc-600"
                  }`}
                >
                  <Heart
                    size={24}
                    fill={inWishlist ? "currentColor" : "none"}
                  />
                </button>
              </div>

              {/* Image Thumbnails */}
              {productImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {productImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImageIndex === idx
                          ? "border-indigo-500"
                          : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600"
                      }`}
                    >
                      <Image
                        src={img.url}
                        alt={`Product ${idx + 1}`}
                        width={100}
                        height={100}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Details */}
            <div className="lg:col-span-2 flex flex-col gap-6 overflow-y-auto max-h-[calc(85vh-120px)] pr-4">
              {/* Category & Badge */}
              <div className="flex items-center gap-3">
                <span className="inline-block px-4 py-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm font-semibold rounded-full">
                  {product.category || product.subcategory || "General"}
                </span>
                <span className="inline-block px-3 py-1 bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-semibold rounded-full">
                  Verified Seller
                </span>
              </div>

              {/* Title */}
              <div>
                <h2 className="text-3xl lg:text-4xl font-black text-foreground mb-3">
                  {product.title}
                </h2>
                {renderStars(product.rating)}
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {product.currency || "$"}
                  {(product.price || 0).toFixed(2)}
                </span>
                {product.oldPrice && (
                  <span className="text-lg text-zinc-400 dark:text-zinc-500 line-through">
                    {product.currency || "$"}
                    {product.oldPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-bold text-foreground mb-2">
                  DESCRIPTION
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Quick Specs */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-xl text-center">
                  <Truck className="h-6 w-6 mx-auto mb-2 text-indigo-600" />
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                    Free Shipping
                  </p>
                  <p className="text-xs font-bold text-foreground">
                    Orders $50+
                  </p>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-xl text-center">
                  <Shield className="h-6 w-6 mx-auto mb-2 text-green-600" />
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                    Secure Payment
                  </p>
                  <p className="text-xs font-bold text-foreground">100% Safe</p>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-xl text-center">
                  <RotateCcw className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                    Easy Returns
                  </p>
                  <p className="text-xs font-bold text-foreground">30 Days</p>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-zinc-200 dark:border-zinc-800 flex gap-6">
                {["overview", "shipping", "reviews"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`py-3 px-1 font-semibold text-sm transition-colors border-b-2 ${
                      activeTab === tab
                        ? "border-indigo-600 text-indigo-600"
                        : "border-transparent text-zinc-600 dark:text-zinc-400 hover:text-foreground"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="space-y-4">
                {activeTab === "overview" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium mb-1">
                          SKU
                        </p>
                        <p className="font-semibold text-foreground">
                          {product.id.slice(0, 8).toUpperCase()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium mb-1">
                          Availability
                        </p>
                        <p
                          className={`font-semibold ${product.quantity > 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {product.quantity > 0
                            ? `${product.quantity} in stock`
                            : "Out of stock"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "shipping" && (
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold text-foreground mb-2">
                        Shipping Information
                      </p>
                      <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                        <li className="flex items-start gap-2">
                          <span className="text-indigo-600 font-bold mt-0.5">
                            •
                          </span>
                          <span>Free shipping on orders over $50</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-indigo-600 font-bold mt-0.5">
                            •
                          </span>
                          <span>Delivery within 3-7 business days</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-indigo-600 font-bold mt-0.5">
                            •
                          </span>
                          <span>Track your order in real-time</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-foreground">
                          {product.rating || 4.5}
                        </p>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400">
                          out of 5
                        </p>
                      </div>
                      <div className="flex-1">
                        {[5, 4, 3, 2, 1].map((stars) => (
                          <div
                            key={stars}
                            className="flex items-center gap-2 text-sm"
                          >
                            <span className="w-12 text-zinc-600 dark:text-zinc-400">
                              {stars} star
                            </span>
                            <div className="flex-1 h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-yellow-400"
                                style={{ width: `${stars * 20}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {product.reviews || 0} customer reviews
                    </p>
                  </div>
                )}
              </div>

              {/* Stock Status */}
              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                {product.quantity > 0 ? (
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold">
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 8 8"
                      fill="currentColor"
                    >
                      <circle cx="4" cy="4" r="4" />
                    </svg>
                    In Stock ({product.quantity} available)
                  </div>
                ) : (
                  <div className="text-red-600 dark:text-red-400 font-semibold">
                    Out of Stock
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="space-y-4 sticky bottom-0 bg-white dark:bg-zinc-900 pt-4 -mx-4 px-6">
                {/* Quantity & Share */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-3 bg-zinc-100 dark:bg-zinc-800 p-2 rounded-xl flex-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="flex-1 text-center font-bold">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      disabled={quantity >= product.quantity}
                      className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  <button className="p-3 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-xl transition-colors">
                    <Share2 size={20} />
                  </button>
                </div>

                {/* Buttons Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    disabled={product.quantity <= 0}
                    className="py-4 bg-gradient-to-r from-indigo-600/60 to-purple-600/60 hover:from-indigo-600 hover:to-purple-600 disabled:from-zinc-400 disabled:to-zinc-400 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:shadow-none"
                  >
                    <ShoppingCart size={20} />
                    <span className="hidden sm:inline">Cart</span>
                  </button>

                  {/* Buy Now Button */}
                  <button
                    onClick={handleCheckout}
                    disabled={product.quantity <= 0}
                    className="py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-zinc-400 disabled:to-zinc-400 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:shadow-none"
                  >
                    <Zap size={20} />
                    <span className="hidden sm:inline">Buy Now</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

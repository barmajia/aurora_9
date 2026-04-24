"use client";

import { motion } from "framer-motion";
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
  Zap,
  Box,
  CheckCircle2,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { useToastStore } from "@/store/toast";
import { useAuthStore } from "@/store/auth";
import { cn } from "@/lib/utils";

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
    handleAddToCart();
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

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-md p-4 lg:p-8"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="w-full max-w-7xl h-[90vh] bg-white dark:bg-black rounded-[3rem] shadow-2xl overflow-hidden flex flex-col border border-zinc-200 dark:border-zinc-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-8 border-b border-zinc-100 dark:border-zinc-900">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Box size={20} />
            </div>
            <div>
              <h1 className="text-xl font-black italic tracking-tighter text-zinc-900 dark:text-white uppercase leading-none">
                Component <span className="text-blue-500">Analysis</span>
              </h1>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mt-1">
                Ref: {product.id.slice(0, 12).toUpperCase()}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-12 h-12 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-900 flex items-center justify-center transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800"
          >
            <X size={24} className="text-zinc-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-0 h-full">
            {/* Left: Image Gallery */}
            <div className="p-8 lg:p-12 bg-zinc-50/50 dark:bg-zinc-950/50 border-r border-zinc-100 dark:border-zinc-900">
              <div className="flex flex-col gap-8 h-full">
                {/* Main Image */}
                <div className="relative aurora-card aspect-square rounded-[2.5rem] overflow-hidden flex items-center justify-center group bg-white dark:bg-zinc-900">
                  <Image
                    src={productImages[selectedImageIndex]?.url || "/images/placeholder.jpg"}
                    alt={product.title}
                    fill
                    className="object-contain p-12 transition-transform duration-700 group-hover:scale-105"
                  />
                  {discount > 0 && (
                    <div className="absolute top-6 left-6 bg-rose-500 text-white px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
                      -{discount}% OFF
                    </div>
                  )}
                  <button
                    onClick={handleWishlist}
                    className={cn(
                      "absolute top-6 right-6 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 shadow-xl",
                      inWishlist 
                        ? "bg-rose-500 text-white" 
                        : "bg-white dark:bg-zinc-800 text-zinc-400 hover:text-rose-500"
                    )}
                  >
                    <Heart size={24} fill={inWishlist ? "currentColor" : "none"} />
                  </button>
                </div>

                {/* Thumbnails */}
                {productImages.length > 1 && (
                  <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    {productImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        className={cn(
                          "flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all duration-300",
                          selectedImageIndex === idx
                            ? "border-blue-500 shadow-lg shadow-blue-500/20"
                            : "border-zinc-200 dark:border-transparent opacity-50 hover:opacity-100"
                        )}
                      >
                        <Image
                          src={img.url}
                          alt={`Thumbnail ${idx + 1}`}
                          width={100}
                          height={100}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Specs Summary */}
                <div className="mt-auto grid grid-cols-3 gap-4">
                  {[
                    { icon: Truck, label: "Logistics", value: "Complimentary" },
                    { icon: Shield, label: "Protocol", value: "E2E Secured" },
                    { icon: RotateCcw, label: "Cycle", value: "30-Day Window" },
                  ].map((spec, i) => (
                    <div key={i} className="aurora-glass p-6 rounded-[2rem] text-center border border-zinc-100 dark:border-zinc-900">
                      <spec.icon size={20} className="mx-auto mb-3 text-blue-500" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">{spec.label}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-900 dark:text-white">{spec.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Info */}
            <div className="p-8 lg:p-12 flex flex-col">
              <div className="space-y-10">
                {/* Meta */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="px-4 py-1.5 bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase tracking-widest rounded-full">
                      {product.category || "Universal"}
                    </span>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest rounded-full">
                      <CheckCircle2 size={12} />
                      Verified
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} className={cn("fill-current", i < Math.floor(product.rating || 0) ? "text-blue-500" : "text-zinc-200")} />
                      ))}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">({product.reviews || 0})</span>
                  </div>
                </div>

                {/* Title & Price */}
                <div>
                  <h2 className="text-4xl lg:text-5xl font-black italic tracking-tighter text-zinc-900 dark:text-white uppercase leading-none mb-6">
                    {product.title}
                  </h2>
                  <div className="flex items-baseline gap-4">
                    <span className="text-5xl font-black italic tracking-tighter text-zinc-900 dark:text-white">
                      ${(product.price || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                    {product.oldPrice && (
                      <span className="text-2xl font-black italic tracking-tighter text-zinc-300 dark:text-zinc-700 line-through">
                        ${product.oldPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Tabs */}
                <div className="space-y-6">
                  <div className="flex gap-8 border-b border-zinc-100 dark:border-zinc-900">
                    {["overview", "shipping", "reviews"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab as "overview" | "shipping" | "reviews")}
                        className={cn(
                          "pb-4 text-[10px] font-black uppercase tracking-widest transition-all relative",
                          activeTab === tab
                            ? "text-blue-500"
                            : "text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                        )}
                      >
                        {tab}
                        {activeTab === tab && (
                          <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-full" />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="min-h-[160px] text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
                    {activeTab === "overview" && (
                      <div className="space-y-6">
                        <p>{product.description}</p>
                        <div className="grid grid-cols-2 gap-8">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Protocol Availability</p>
                            <p className={cn("text-xs font-black uppercase tracking-widest", product.quantity > 0 ? "text-emerald-500" : "text-rose-500")}>
                              {product.quantity > 0 ? `${product.quantity} UNITS ACTIVE` : "NODE DEPLETED"}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Technical SKU</p>
                            <p className="text-xs font-black uppercase tracking-widest text-zinc-900 dark:text-white">
                              {product.id.slice(0, 16).toUpperCase()}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    {activeTab === "shipping" && (
                      <ul className="space-y-4">
                        {[
                          "Priority global logistics network",
                          "Express delivery within 3-5 operational cycles",
                          "Real-time node tracking and verification",
                          "Complimentary protection on high-value items"
                        ].map((text, i) => (
                          <li key={i} className="flex items-center gap-3">
                            <div className="w-1 h-1 rounded-full bg-blue-500" />
                            <span className="text-xs font-black uppercase tracking-widest">{text}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {activeTab === "reviews" && (
                      <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-6 p-6 aurora-glass rounded-3xl">
                          <div className="text-4xl font-black italic text-zinc-900 dark:text-white">{product.rating || 4.8}</div>
                          <div className="flex-1 space-y-2">
                             {[1, 2, 3, 4, 5].reverse().map(s => (
                               <div key={s} className="flex items-center gap-2">
                                 <span className="text-[8px] font-black w-4">{s}</span>
                                 <div className="flex-1 h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                   <div className="h-full bg-blue-500" style={{ width: s > 3 ? '80%' : '20%' }} />
                                 </div>
                               </div>
                             ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-auto space-y-6 pt-10 border-t border-zinc-100 dark:border-zinc-900">
                  <div className="flex items-center gap-4">
                    <div className="h-16 flex items-center bg-zinc-100 dark:bg-zinc-900 rounded-2xl px-2">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-12 h-12 rounded-xl flex items-center justify-center hover:bg-white dark:hover:bg-zinc-800 transition-all text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                      >
                        <Minus size={18} />
                      </button>
                      <span className="w-12 text-center font-black italic text-xl text-zinc-900 dark:text-white">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-12 h-12 rounded-xl flex items-center justify-center hover:bg-white dark:hover:bg-zinc-800 transition-all text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                    
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                      <ShoppingCart size={20} />
                      Initialize Cart
                    </button>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full h-16 aurora-glass border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-900 dark:text-white rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-widest transition-all"
                  >
                    <Zap size={20} className="text-blue-500" />
                    Immediate Acquisition
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

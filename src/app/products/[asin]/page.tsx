'use client';

import { safeSelect } from "@/lib/database";
import { Product } from "@/types";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowLeft, 
  ShoppingBag, 
  Heart, 
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  Star,
  Zap,
  Info,
  Minus,
  Plus
} from "lucide-react";
import { Button, Magnetic } from "@/components/ui";
import { deobfuscateId } from "@/lib/id-utils";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { useToastStore } from "@/store/toast";
import { useState, useEffect } from "react";
import ProductQuickView from "@/components/ProductQuickView";

async function getProductById(id: string): Promise<Product | null> {
  try {
    const { data, error } = await safeSelect("products", {
      filters: [{ column: "id", operator: "eq", value: id }],
      limit: 1,
    });

    if (error || !data || data.length === 0) {
      return null;
    }

    return data[0] as unknown as Product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

interface ProductClientProps {
  product: Product;
  actualId: string;
}

function ProductClient({ product, actualId }: ProductClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedConfig, setSelectedConfig] = useState<string>("Base");
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  const addItem = useCartStore((state) => state.addItem);
  const { items: wishlistItems, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlistStore();
  const addToast = useToastStore((state) => state.addToast);
  
  const isInWishlist = wishlistItems.some(item => item.id === product.id);
  
  const productName = product.name || product.title || "Unknown Product";
  const basePrice = product.price || 0;
  const configMultipliers: Record<string, number> = {
    "Base": 1,
    "Pro": 1.3,
    "Ultra": 1.6
  };
  const currentPrice = basePrice * (configMultipliers[selectedConfig] || 1);
  
  const productImages = product.images && product.images.length > 0 
    ? product.images.map(img => img.url) 
    : [product.image || `https://picsum.photos/seed/${actualId}/1200/1200`].filter(Boolean);
  
  const mainImage = productImages[0];
  const productDescription = product.description || "No description available for this industrial node.";

  const handleAddToCart = () => {
    setIsAddingToCart(true);
    const productWithQuantity = {
      ...product,
      price: currentPrice,
      quantity: quantity,
      configuration: selectedConfig
    };
    
    // Add item multiple times based on quantity
    for (let i = 0; i < quantity; i++) {
      addItem(productWithQuantity);
    }
    
    setTimeout(() => {
      setIsAddingToCart(false);
      addToast(`${quantity}x ${productName} deployed to cart`, "success");
      setQuantity(1);
    }, 500);
  };

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      removeFromWishlist(product.id);
      addToast("Removed from wishlist", "info");
    } else {
      addToWishlist({
        id: product.id,
        name: productName,
        price: currentPrice,
        image: mainImage,
        category: product.category || "Universal",
        description: productDescription
      });
      addToast("Pinned to wishlist", "success");
    }
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  return (
    <div className="min-h-screen pt-32 pb-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        {/* Navigation Breadcrumb */}
        <div className="mb-12">
          <Link 
            href="/products" 
            className="group inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 hover:text-blue-500 transition-colors"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to Ecosystem
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left: Visual Node */}
          <div className="lg:col-span-7 space-y-8">
            <div className="relative aspect-square rounded-[3rem] overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 shadow-2xl">
              <Image
                src={mainImage}
                alt={productName}
                fill
                priority
                className="object-cover"
              />
              <div className="absolute top-8 left-8">
                 <div className="px-4 py-1.5 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-zinc-200 dark:border-white/10 shadow-xl">
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">Node Secure</span>
                 </div>
              </div>
            </div>
            
            {/* Gallery Grid */}
            {productImages.length > 1 && (
              <div className="flex flex-wrap gap-4">
                 {productImages.map((img, i) => (
                   <div 
                    key={i} 
                    className="w-24 h-24 relative rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 cursor-pointer hover:border-blue-500 transition-all overflow-hidden group"
                   >
                     <Image 
                      src={img} 
                      alt={`${productName} thumbnail ${i}`} 
                      fill 
                      className="object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                     />
                   </div>
                 ))}
              </div>
            )}
          </div>

          {/* Right: Data & Protocol */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 px-3 py-1 bg-blue-500/10 rounded-full">
                  {product.category || "Universal"}
                </span>
                <div className="flex items-center gap-1.5 text-zinc-400">
                  <Star size={12} className="fill-blue-500 text-blue-500" />
                  <span className="text-[10px] font-black">{product.rating || 4.9}</span>
                  <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">({product.reviews || 128} Reviews)</span>
                </div>
              </div>

              <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter text-zinc-900 dark:text-white uppercase leading-[0.9] mb-6">
                {productName}
              </h1>

              <div className="flex items-baseline gap-4 mb-8">
                <p className="text-4xl font-black italic tracking-tighter text-blue-600 dark:text-blue-400">
                  ${currentPrice.toLocaleString()}
                </p>
                {product.oldPrice && (
                  <p className="text-xl font-bold text-zinc-400 line-through decoration-rose-500/50">
                    ${(product.oldPrice * (configMultipliers[selectedConfig] || 1)).toLocaleString()}
                  </p>
                )}
                {selectedConfig !== "Base" && (
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full">
                    {selectedConfig} Tier
                  </span>
                )}
              </div>

              <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed mb-10 text-sm">
                {productDescription}
              </p>
            </div>

            {/* Config Options */}
            <div className="space-y-8 mb-12">
               <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-4">Select Configuration</h3>
                  <div className="flex gap-3">
                     {["Base", "Pro", "Ultra"].map((spec) => (
                       <button 
                        key={spec} 
                        onClick={() => setSelectedConfig(spec)}
                        className={`px-6 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                          selectedConfig === spec 
                            ? "border-blue-500 bg-blue-500/10 text-blue-500" 
                            : "border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-blue-500"
                        }`}
                       >
                         {spec} {spec !== "Base" && `(+${Math.round((configMultipliers[spec] - 1) * 100)}%)`}
                       </button>
                     ))}
                  </div>
               </div>
               
               {/* Quantity Selector */}
               <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-4">Quantity</h3>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => handleQuantityChange(-1)}
                      className="w-12 h-12 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-500 hover:border-blue-500 hover:text-blue-500 transition-all"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="text-2xl font-black text-zinc-900 dark:text-white w-12 text-center">{quantity}</span>
                    <button 
                      onClick={() => handleQuantityChange(1)}
                      className="w-12 h-12 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-500 hover:border-blue-500 hover:text-blue-500 transition-all"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
               </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-auto">
               <Magnetic strength={0.1}>
                  <Button 
                    size="lg" 
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                    className="w-full h-16 rounded-2xl flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isAddingToCart ? (
                      <Zap size={20} className="animate-pulse" />
                    ) : (
                      <ShoppingBag size={20} />
                    )}
                    {isAddingToCart ? "Deploying..." : `Deploy ${quantity > 1 ? `${quantity}x ` : ''}to Cart`}
                  </Button>
               </Magnetic>
               <button 
                onClick={handleWishlistToggle}
                className={`h-16 rounded-2xl border flex items-center justify-center gap-3 transition-all ${
                  isInWishlist 
                    ? "border-rose-500 bg-rose-500/10 text-rose-500" 
                    : "border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-rose-500 hover:border-rose-500/50"
                }`}
               >
                  <Heart size={20} className={isInWishlist ? "fill-rose-500" : ""} />
                  {isInWishlist ? "Pinned" : "Pin to Node"}
               </button>
            </div>

            {/* Trust Badges */}
            <div className="mt-12 grid grid-cols-3 gap-6 pt-12 border-t border-zinc-100 dark:border-zinc-900">
               <div className="flex flex-col items-center text-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                     <ShieldCheck size={18} />
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Secure Protocol</span>
               </div>
               <div className="flex flex-col items-center text-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                     <Truck size={18} />
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Global Logistics</span>
               </div>
               <div className="flex flex-col items-center text-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                     <RefreshCw size={18} />
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400">30D Return Cycle</span>
               </div>
            </div>
          </div>
        </div>

        {/* Technical Specs Tab */}
        <section className="mt-24 pt-24 border-t border-zinc-100 dark:border-zinc-900">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
              <div>
                 <h2 className="text-3xl font-black italic tracking-tighter uppercase mb-12">Technical Specifications</h2>
                 <div className="space-y-6">
                    {[
                      { label: "Hardware Hash", value: "AU-RX-900-V4" },
                      { label: "Security Token", value: actualId.substring(0, 12).toUpperCase() },
                      { label: "Encryption", value: "AES-512-NODE" },
                      { label: "Logistics Latency", value: "< 48 Hours" }
                    ].map((spec) => (
                      <div key={spec.label} className="flex justify-between items-center py-4 border-b border-zinc-50 dark:border-white/5">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{spec.label}</span>
                        <span className="text-[11px] font-bold text-zinc-900 dark:text-white uppercase">{spec.value}</span>
                      </div>
                    ))}
                 </div>
              </div>
              <div className="p-12 rounded-[3rem] bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Info size={120} className="text-blue-500" />
                 </div>
                 <h3 className="text-xl font-black italic tracking-tighter uppercase mb-6 flex items-center gap-3">
                    <Zap size={20} className="text-blue-500" />
                    Security Protocol Note
                 </h3>
                 <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Access to this industrial node is protected by a unique Security Key. Raw ASIN identifiers are obfuscated within our edge network to prevent unauthorized metadata harvesting and ensure transaction integrity.
                 </p>
              </div>
           </div>
        </section>
      </div>
    </div>
  );
}

export default async function ProductDetailPage({ params }: { params: Promise<{ asin: string }> }) {
  const { asin: key } = await params;
  const actualId = deobfuscateId(key);
  const product = await getProductById(actualId);

  if (!product) {
    notFound();
  }

  return <ProductClient product={product} actualId={actualId} />;
}

import { safeSelect } from "@/lib/database";
import ProductCard from "./ProductCard";
import { Product } from "@/types";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const { data, error } = await safeSelect("products", {
      select: "id,name,title,description,price,image,images,category,rating,reviews,badge,created_at,status",
      limit: 4,
      filters: [{ column: "status", operator: "eq", value: "active" }],
      orderBy: [{ column: "created_at", ascending: false }],
    });

    if (error || !data) {
      console.error("Error fetching featured products:", error);
      return [];
    }

    return data as unknown as Product[];
  } catch (error) {
    console.error("Failed to fetch featured products:", error);
    return [];
  }
}

export default async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  if (products.length === 0) return null;

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
         <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-500 mb-4">
              <Sparkles size={12} className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest">Featured Node</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter text-zinc-900 dark:text-white uppercase leading-none">
              Premium <br />
              <span className="text-blue-600 dark:text-blue-400">Inventory</span>
            </h2>
          </div>
          <Link
            href="/products"
            className="group flex items-center gap-2 text-sm font-black uppercase tracking-widest text-zinc-400 hover:text-blue-500 transition-colors"
          >
            Access Full Database
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

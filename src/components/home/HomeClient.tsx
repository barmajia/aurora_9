"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronRight,
  Zap,
  Shield,
  Truck,
  RefreshCw,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui";

const CATEGORIES = [
  {
    name: "Electronics",
    icon: "🖥️",
    color: "from-blue-500 to-cyan-500",
    count: "1.2k+ Items",
  },
  {
    name: "Fashion",
    icon: "👗",
    color: "from-pink-500 to-rose-500",
    count: "800+ Items",
  },
  {
    name: "Home",
    icon: "🏠",
    color: "from-orange-500 to-amber-500",
    count: "2.5k+ Items",
  },
  {
    name: "Sports",
    icon: "⚽",
    color: "from-green-500 to-emerald-500",
    count: "400+ Items",
  },
  {
    name: "Beauty",
    icon: "💄",
    color: "from-purple-500 to-pink-500",
    count: "1.5k+ Items",
  },
  {
    name: "Books",
    icon: "📚",
    color: "from-indigo-500 to-blue-500",
    count: "3k+ Items",
  },
];

const FEATURES = [
  {
    icon: Zap,
    title: "Instant Delivery",
    description:
      "Experience lightning-fast logistics with our global edge network.",
  },
  {
    icon: Shield,
    title: "Secure Node",
    description: "Enterprise-grade encryption protecting every transaction.",
  },
  {
    icon: Truck,
    title: "Global Logistics",
    description: "Free worldwide shipping on all premium ecosystem orders.",
  },
  {
    icon: RefreshCw,
    title: "30-Day Cycle",
    description: "Hassle-free returns within our 30-day satisfaction window.",
  },
  {
    icon: Award,
    title: "Verified Source",
    description: "Every product is authenticated and verified for quality.",
  },
];

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-20">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(59,130,246,0.15),transparent_70%)]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-200/50 bg-white/50 dark:border-zinc-800/50 dark:bg-zinc-900/50 backdrop-blur-md mb-8"
          >
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-black dark:text-white">
              Aurora Ecosystem v4.0
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-6xl md:text-8xl font-black italic tracking-tighter leading-[0.8]  mb-8 uppercase"
          >
            The Future of <br />
            <span className="bg-linear-to-r from-blue-600 via-indigo-500 to-emerald-500 bg-clip-text text-transparent">
              Premium Commerce
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed mb-12"
          >
            Experience a curated selection of world-class products. Powered by
            the Aurora network for ultimate speed and security.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <Link href="/products">
              <Button className="group w-full sm:w-auto">
                Explore Ecosystem
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/seller">
              <Button variant="outline" className="w-full sm:w-auto">
                Join as Merchant
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function CategoriesSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter text-zinc-900 dark:text-white uppercase mb-4">
              Core Verticals
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-lg">
              Navigate through our specialized industrial sectors.
            </p>
          </div>
          <Link
            href="/products"
            className="group flex items-center gap-2 text-sm font-black uppercase tracking-widest text-blue-500"
          >
            View All Categories
            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((category, idx) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link href={`/products?category=${category.name.toLowerCase()}`}>
                <div className="group relative h-64 rounded-2rem overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-all duration-500 hover:border-blue-500/50">
                  <div
                    className={`absolute inset-0 bg-linear-to-br ${category.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                  />
                  <div className="absolute inset-0 p-8 flex flex-col justify-between">
                    <div className="text-5xl transform group-hover:scale-110 transition-transform duration-500">
                      {category.icon}
                    </div>
                    <div>
                      <span className="text-xs font-black uppercase tracking-widest text-blue-500 mb-2 block">
                        {category.count}
                      </span>
                      <h3 className="text-2xl font-black italic tracking-tighter text-zinc-900 dark:text-white uppercase">
                        {category.name}
                      </h3>
                    </div>
                  </div>
                  <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                      <ArrowRight size={20} />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FeaturesSection() {
  return (
    <section className="py-24 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white overflow-hidden relative">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 right-0 w-800px h-800px bg-blue-600/20 rounded-full blur-[150px] dark:opacity-50 opacity-20" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase mb-6 text-zinc-900 dark:text-white">
            Ecosystem <span className="text-blue-500">Standards</span>
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-lg max-w-2xl mx-auto">
            Our commitment to technical excellence and user security.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group p-8 rounded-3xl bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 hover:border-blue-500/50 transition-all duration-500 shadow-sm hover:shadow-xl"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                  <Icon size={24} />
                </div>
                <h3 className="text-lg font-black uppercase tracking-widest mb-4 italic text-zinc-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

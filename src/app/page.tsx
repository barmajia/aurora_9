"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Shield,
  Truck,
  Zap,
  Globe,
  Sparkles,
  Heart,
  Award,
  RefreshCw,
  
} from "lucide-react";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cart";
import { Button, Card, Magnetic } from "@/components/ui";
import Image from "next/image";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* 🚀 Hero Section - Cinematic Minimalism */}
      <section className="relative pt-48 pb-32 px-6 overflow-hidden">
        {/* Subtle Background Glows */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-primary/[0.02] rounded-full blur-[150px]" />

        <div className="max-w-[1600px] mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "circOut" }}
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-[10px] font-bold uppercase tracking-[0.2em] mb-12 text-zinc-500"
              >
                <Sparkles size={12} className="text-primary animate-pulse" />
                Next-Gen Retail Infrastructure
              </motion.div>
              
              <h1 className="text-6xl md:text-[8rem] font-bold tracking-tighter mb-10 leading-[0.85] text-foreground">
                Digital <br />
                <span className="text-zinc-300 dark:text-zinc-700">Standards.</span>
              </h1>
              
              <p className="text-xl text-zinc-500 dark:text-zinc-400 max-w-xl mb-14 font-medium leading-relaxed">
                Experience curated collections of exceptional quality. 
                Aurora unites brands, logistics, and consumers into a single premium ecosystem.
              </p>

              <div className="flex flex-col sm:flex-row gap-6">
                <Magnetic strength={0.1}>
                  <Link href="/products">
                    <Button size="lg" className="h-16 px-12 rounded-full font-bold uppercase tracking-widest text-[10px] shadow-2xl">
                      Explore Store <ArrowRight size={16} className="ml-2" />
                    </Button>
                  </Link>
                </Magnetic>
                <Magnetic strength={0.1}>
                  <Link href="/about">
                    <Button variant="outline" size="lg" className="h-16 px-12 rounded-full font-bold uppercase tracking-widest text-[10px]">
                      Our Story
                    </Button>
                  </Link>
                </Magnetic>
              </div>

              <div className="mt-24 flex items-center gap-12">
                {[
                  { value: "12K+", label: "Products" },
                  { value: "48K+", label: "Members" },
                  { value: "4.9", label: "Rating" },
                ].map((stat, idx) => (
                  <div key={idx} className="group">
                    <div className="text-3xl font-bold tracking-tight text-foreground transition-transform group-hover:-translate-y-1">{stat.value}</div>
                    <div className="text-[10px] font-bold text-zinc-300 dark:text-zinc-700 uppercase tracking-widest mt-1">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 1, ease: "circOut" }}
              className="relative"
            >
              <div className="relative aspect-square rounded-[4rem] overflow-hidden border border-zinc-100 dark:border-zinc-800 shadow-2xl dark:shadow-none bg-zinc-50 dark:bg-zinc-900 group">
                 <Image 
                   src="/aurora_hero_mesh_1776510786445.png" 
                   alt="Aurora Design" 
                   fill 
                   className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-[2s]"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
                 
                 {/* Floating Info Card */}
                 <div className="absolute bottom-12 left-12 right-12 p-8 bg-white/80 dark:bg-black/80 backdrop-blur-3xl rounded-[2.5rem] border border-white/20 dark:border-zinc-800 shadow-2xl">
                    <div className="flex justify-between items-center">
                       <div>
                          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Active Mesh</p>
                          <p className="text-2xl font-bold tracking-tight">Global Core</p>
                       </div>
                       <div className="w-12 h-12 bg-black dark:bg-white text-white dark:text-black rounded-2xl flex items-center justify-center">
                          <Globe size={20} className="animate-spin-slow" />
                       </div>
                    </div>
                 </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 🏛️ Philosophy Section */}
      <section className="py-48 px-6 bg-zinc-50 dark:bg-zinc-950/50">
        <div className="max-w-[1600px] mx-auto text-center mb-32">
          <span className="text-primary text-[10px] font-bold uppercase tracking-[0.4em] mb-6 block">Our Standards</span>
          <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground max-w-4xl mx-auto leading-[1.1]">
            Curating the finest digital <br /> and physical assets.
          </h2>
        </div>

        <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            { icon: Heart, title: "Curated Selections", desc: "Every item in our ecosystem is vetted through a multi-stage quality protocol." },
            { icon: Globe, title: "Global Presence", desc: "Operating a high-speed logistics mesh that spans across 48 sectors globally." },
            { icon: Award, title: "Certified Status", desc: "Industry-leading certification on every product, guaranteed by our ledger." },
            { icon: Zap, title: "Instant Sync", desc: "Real-time inventory orchestration between factories and consumer hubs." },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group"
            >
              <div className="w-16 h-16 bg-white dark:bg-zinc-900 rounded-3xl flex items-center justify-center mb-10 border border-zinc-100 dark:border-zinc-800 shadow-sm group-hover:bg-primary group-hover:text-background transition-all duration-500">
                <feature.icon size={28} />
              </div>
              <h3 className="text-xl font-bold mb-4 tracking-tight">{feature.title}</h3>
              <p className="text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 🛠️ Ecosystem Grid */}
      <section className="py-48 px-6 border-y border-zinc-100 dark:border-zinc-800">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-24 gap-12">
             <div className="max-w-2xl">
                <h2 className="text-5xl md:text-6xl font-bold tracking-tighter text-foreground mb-8">Performance Driven.</h2>
                <p className="text-xl text-zinc-400 dark:text-zinc-600 font-medium leading-relaxed">
                  Our infrastructure is optimized for high-throughput commerce, ensuring a seamless experience for every member of the Aurora network.
                </p>
             </div>
             <Link href="/products" className="group flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-foreground transition-all">
                Browse Full Catalog <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
             </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             {[
               { icon: Shield, title: "Secure Operations", desc: "Protected by bank-grade encryption across every transactional endpoint." },
               { icon: Truck, title: "Integrated Mesh", desc: "Direct factory-to-door delivery with optimized routing protocols." },
               { icon: RefreshCw, title: "Agile Flow", desc: "Instant returns and automated stock rebalancing for merchants." },
             ].map((item, idx) => (
               <Card key={idx} className="p-16 rounded-[3rem] hover:border-primary/20 transition-all cursor-default">
                  <div className="w-14 h-14 bg-zinc-50 dark:bg-zinc-950 rounded-2xl flex items-center justify-center mb-10 text-zinc-300 dark:text-zinc-700">
                     <item.icon size={32} />
                  </div>
                  <h3 className="text-3xl font-bold mb-6 tracking-tight">{item.title}</h3>
                  <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">{item.desc}</p>
               </Card>
             ))}
          </div>
        </div>
      </section>

      {/* 💎 Final CTA */}
      <section className="relative py-60 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-zinc-50 dark:bg-zinc-950/20" />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block p-6 bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 mb-16 shadow-2xl"
          >
            <Sparkles size={48} className="text-primary animate-pulse" />
          </motion.div>
          <h2 className="text-6xl md:text-[9rem] font-bold tracking-tighter mb-12 leading-[0.8] text-foreground">
            Join the <br />
            <span className="text-zinc-200 dark:text-zinc-800">Ecosystem.</span>
          </h2>
          <p className="text-2xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto mb-20 font-medium">
            Redefine your commerce experience with Aurora. Limited memberships available for optimized performance.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Magnetic strength={0.1}>
              <Link href="/signup">
                <Button size="lg" className="h-20 px-16 rounded-full font-bold uppercase tracking-widest text-xs shadow-2xl">
                  Get Started
                </Button>
              </Link>
            </Magnetic>
            <Magnetic strength={0.1}>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="h-20 px-16 rounded-full font-bold uppercase tracking-widest text-xs">
                  Contact Support
                </Button>
              </Link>
            </Magnetic>
          </div>
        </div>
      </section>
    </div>
  );
}
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layout,
  ShoppingBag,
  Smartphone,
  Utensils,
  Briefcase,
  Image as ImageIcon,
  Search,
  Eye,
  Check,
  Star,
  ArrowRight,
  Shield,
  Sparkles,
  Layers
} from "lucide-react";
import { TEMPLATE_CATEGORIES } from "@/lib/builder";
import { REAL_TEMPLATES } from "@/data/templates";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui";

const ICONS = {
  layout: Layout,
  shirt: ShoppingBag,
  smartphone: Smartphone,
  utensils: Utensils,
  briefcase: Briefcase,
  image: ImageIcon,
};

export default function TemplateGallery() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTemplates = REAL_TEMPLATES.filter((template) => {
    const matchesCategory =
      selectedCategory === "all" || template.category === selectedCategory;
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background text-foreground pt-32 pb-24 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(59,130,246,0.1),transparent_70%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-200/50 bg-zinc-50/50 dark:border-zinc-800/50 dark:bg-zinc-900/50 backdrop-blur-md mb-8"
          >
            <Layers size={14} className="text-blue-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-900 dark:text-white">
              Template Infrastructure
            </span>
          </motion.div>

          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.85] mb-8">
            Deploy your <br />
            <span className="text-blue-600 dark:text-blue-400">Digital Node</span>
          </h1>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto uppercase tracking-widest font-medium">
            Select a high-performance architectural foundation for your digital ecosystem.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
          <div className="relative w-full md:max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="SEARCH ARCHITECTURES..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setSelectedCategory("all")}
              className={cn(
                "px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                selectedCategory === "all"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "bg-zinc-50 dark:bg-zinc-900 text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-zinc-200 dark:border-white/5",
              )}
            >
              All Protocols
            </button>
            {TEMPLATE_CATEGORIES.map((category) => {
              const Icon = ICONS[category.icon as keyof typeof ICONS] || Layout;
              return (
                 <button
                   key={category.id}
                   onClick={() => setSelectedCategory(category.id)}
                   className={cn(
                     "px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                     selectedCategory === category.id
                       ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                       : "bg-zinc-50 dark:bg-zinc-900 text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-zinc-200 dark:border-white/5",
                   )}
                 >
                   <Icon className="h-3 w-3" />
                   {category.label}
                 </button>
              );
            })}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredTemplates.map((template, idx) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05 }}
                className="group relative"
              >
                <div className="aurora-card overflow-hidden bg-white dark:bg-zinc-900/50 hover:border-blue-500/50 transition-all duration-500 shadow-sm hover:shadow-2xl flex flex-col h-full">
                  {/* Thumbnail */}
                  <div className="aspect-[16/10] relative overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                    <img
                      src={template.thumbnailUrl}
                      alt={template.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {template.isPremium && (
                      <div className="absolute top-4 right-4 bg-amber-500 text-white text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                        <Star className="h-2 w-2 fill-current" />
                        Premium Node
                      </div>
                    )}

                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                       <Link href={`/templates/${template.slug}`} className="w-full">
                          <Button variant="secondary" className="w-full h-10 rounded-xl bg-white/90 backdrop-blur-md text-black text-[10px] font-black uppercase tracking-widest hover:bg-white">
                             <Eye size={14} className="mr-2" />
                             Analyze Architecture
                          </Button>
                       </Link>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 mb-2 block">
                          {template.category}
                        </span>
                        <h3 className="text-2xl font-black italic tracking-tighter text-zinc-900 dark:text-white uppercase">
                          {template.name}
                        </h3>
                      </div>
                      {template.isPremium && (
                        <span className="text-lg font-black italic text-amber-500">
                          ${template.price}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-widest leading-relaxed mb-8 flex-1">
                      {template.description}
                    </p>

                    <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                       <div className="flex -space-x-2">
                          {[1,2,3].map(i => (
                             <div key={i} className="w-6 h-6 rounded-full border-2 border-white dark:border-zinc-900 bg-zinc-200 dark:bg-zinc-800" />
                          ))}
                          <span className="ml-4 text-[8px] font-black text-zinc-400 uppercase tracking-widest self-center">+12 Uses Today</span>
                       </div>
                       <Link href={`/templates/${template.slug}/deploy`}>
                          <button className="text-zinc-900 dark:text-white hover:text-blue-500 transition-colors">
                             <ArrowRight size={20} />
                          </button>
                       </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-900 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-zinc-200 dark:border-white/5">
               <Layout className="h-10 w-10 text-zinc-300" />
            </div>
            <h3 className="text-2xl font-black italic tracking-tighter uppercase text-zinc-900 dark:text-white mb-2">
              No Protocols Found
            </h3>
            <p className="text-zinc-500 dark:text-zinc-400 uppercase tracking-widest text-xs">
              Adjust your search parameters to find compatible architectures.
            </p>
          </div>
        )}

        {/* Bottom Trust Section */}
        <div className="mt-32 pt-24 border-t border-zinc-100 dark:border-zinc-900 grid grid-cols-1 md:grid-cols-3 gap-12">
           {[
              { icon: Shield, title: "Verified Security", desc: "All templates undergo a strict 12-point security audit before deployment." },
              { icon: Sparkles, title: "Neural Optimization", desc: "AI-driven layout adjustments ensure maximum conversion for your specific node." },
              { icon: Layout, title: "Atomic Design", desc: "Built with modular components for infinite scalability and custom protocols." }
           ].map((trust, i) => (
              <div key={i} className="flex gap-6">
                 <div className="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 border border-zinc-200 dark:border-white/5">
                    <trust.icon size={24} />
                 </div>
                 <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-zinc-900 dark:text-white mb-2">{trust.title}</h4>
                    <p className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-widest leading-relaxed">{trust.desc}</p>
                 </div>
              </div>
           ))}
        </div>
      </div>
    </div>
  );
}

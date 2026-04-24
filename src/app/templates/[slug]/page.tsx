import { REAL_TEMPLATES } from "@/data/templates";
import { safeSelect } from "@/lib/database";
import { Product } from "@/types";
import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Sparkles, 
  ShoppingCart, 
  Zap, 
  Layers, 
  ShieldCheck, 
  Cpu, 
  User, 
  Camera, 
  MessageSquare, 
  ThumbsUp, 
  Share2,
  Info,
  MoreHorizontal,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui";
import ProductCard from "@/components/ProductCard";
import { cn } from "@/lib/utils";

async function getProductsByAsins(asins: string[]): Promise<Product[]> {
  if (!asins || asins.length === 0) return [];

  try {
    const { data, error } = await safeSelect("products", {
      filters: [{ column: "id", operator: "in", value: asins }],
    });

    if (error || !data) {
      console.error("Error fetching template products:", error);
      return [];
    }

    return data as unknown as Product[];
  } catch (error) {
    console.error("Failed to fetch template products:", error);
    return [];
  }
}

export default async function TemplatePreviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // SECURITY: Validate slug format
  if (!/^[a-z0-9-]+$/.test(slug)) {
    notFound();
  }

  const template = REAL_TEMPLATES.find((t) => t.slug === slug);

  if (!template) {
    notFound();
  }

  const products = await getProductsByAsins(template.productAsins);

  if (template.layoutType === "social-profile") {
    return (
      <div className="min-h-screen bg-[#f0f2f5] dark:bg-zinc-950 pt-20 pb-24">
        <div className="max-w-5xl mx-auto px-4">
           {/* Navigation */}
           <div className="mb-6">
              <Link 
                href="/templates" 
                className="inline-flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-blue-600 transition-colors bg-white dark:bg-zinc-900 px-4 py-2 rounded-full shadow-sm"
              >
                <ArrowLeft size={14} />
                Registry Dashboard
              </Link>
           </div>

           {/* Profile Header */}
           <div className="bg-white dark:bg-zinc-900 rounded-b-2xl shadow-sm overflow-hidden mb-6">
              {/* Cover Photo */}
              <div className="h-64 md:h-96 relative group bg-zinc-200 dark:bg-zinc-800">
                 <img 
                    src={template.thumbnailUrl} 
                    alt="Cover" 
                    className="w-full h-full object-cover"
                 />
                 <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all" />
                 <button className="absolute bottom-4 right-4 bg-white/90 dark:bg-zinc-800/90 p-2 rounded-lg shadow-lg flex items-center gap-2 text-xs font-bold">
                    <Camera size={16} />
                    Edit Cover
                 </button>
              </div>

              {/* Profile Info Row */}
              <div className="px-4 md:px-8 pb-4 relative">
                 <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-12 md:-mt-16 relative z-10">
                    <div className="w-32 h-32 md:w-44 md:h-44 rounded-full border-4 border-white dark:border-zinc-900 bg-zinc-100 dark:bg-zinc-800 overflow-hidden shadow-xl relative group">
                       <div className="w-full h-full flex items-center justify-center text-zinc-400">
                          <User size={64} />
                       </div>
                       <button className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                          <Camera size={24} />
                       </button>
                    </div>
                    <div className="flex-1 text-center md:text-left mb-2">
                       <h1 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter italic">
                          {template.name}
                       </h1>
                       <p className="text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest text-[10px] mt-1">
                          {template.category} Architecture • Verified Protocol
                       </p>
                    </div>
                    <div className="flex gap-2 mb-2">
                       <Button className="rounded-xl h-10 px-6 text-[10px] font-black uppercase tracking-widest">
                          <Plus size={16} className="mr-2" /> Deploy Node
                       </Button>
                       <Button variant="outline" className="rounded-xl h-10 px-4">
                          <MessageSquare size={16} />
                       </Button>
                       <Button variant="outline" className="rounded-xl h-10 px-4">
                          <MoreHorizontal size={16} />
                       </Button>
                    </div>
                 </div>

                 {/* Profile Tabs */}
                 <div className="mt-8 border-t border-zinc-100 dark:border-zinc-800 flex gap-2">
                    {['Inventory', 'About', 'Analytics', 'Logistics'].map((tab, i) => (
                       <button 
                          key={tab} 
                          className={cn(
                             "px-4 py-4 text-xs font-black uppercase tracking-widest border-b-4 transition-all",
                             i === 0 ? "border-blue-600 text-blue-600" : "border-transparent text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                          )}
                       >
                          {tab}
                       </button>
                    ))}
                 </div>
              </div>
           </div>

           {/* Main Feed Content */}
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Sidebar */}
              <div className="lg:col-span-4 space-y-6">
                 <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm">
                    <h2 className="text-xl font-black italic tracking-tighter uppercase mb-4">Architecture Intro</h2>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                       {template.description}
                    </p>
                    <div className="space-y-4">
                       <div className="flex items-center gap-3 text-sm font-medium text-zinc-500">
                          <Info size={18} className="text-zinc-400" />
                          <span>Layout: <span className="text-zinc-900 dark:text-white uppercase font-black text-[10px] tracking-widest">{template.layoutType}</span></span>
                       </div>
                       <div className="flex items-center gap-3 text-sm font-medium text-zinc-500">
                          <Layers size={18} className="text-zinc-400" />
                          <span>Features: <span className="text-zinc-900 dark:text-white uppercase font-black text-[10px] tracking-widest">{template.features.join(", ")}</span></span>
                       </div>
                       <div className="flex items-center gap-3 text-sm font-medium text-zinc-500">
                          <ShieldCheck size={18} className="text-zinc-400" />
                          <span>Status: <span className="text-emerald-500 uppercase font-black text-[10px] tracking-widest">Active Protocol</span></span>
                       </div>
                    </div>
                    <Button variant="outline" className="w-full mt-6 rounded-xl text-[10px] font-black uppercase tracking-widest">
                       View Extended Data
                    </Button>
                 </div>

                 <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                       <h2 className="text-xl font-black italic tracking-tighter uppercase">Gallery Nodes</h2>
                       <button className="text-blue-600 text-[10px] font-black uppercase tracking-widest">View All</button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                       {[...Array(6)].map((_, i) => (
                          <div key={i} className="aspect-square bg-zinc-100 dark:bg-zinc-800 rounded-lg overflow-hidden border border-zinc-200 dark:border-white/5">
                             <img 
                                src={`https://images.unsplash.com/photo-${1500000000000 + i * 1000000}?q=80&w=200`} 
                                alt="Gallery" 
                                className="w-full h-full object-cover grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer"
                             />
                          </div>
                       ))}
                    </div>
                 </div>
              </div>

              {/* Inventory Feed */}
              <div className="lg:col-span-8 space-y-6">
                 <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm">
                    <div className="flex gap-4">
                       <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
                          <User size={20} />
                       </div>
                       <button className="flex-1 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full text-left px-6 text-sm text-zinc-500 font-medium transition-colors">
                          Deploy a new product to the feed...
                       </button>
                    </div>
                    <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 grid grid-cols-3">
                       <button className="flex items-center justify-center gap-2 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition-all text-xs font-black uppercase tracking-widest text-zinc-500">
                          <Camera size={16} className="text-rose-500" /> Image
                       </button>
                       <button className="flex items-center justify-center gap-2 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition-all text-xs font-black uppercase tracking-widest text-zinc-500">
                          <Zap size={16} className="text-amber-500" /> Action
                       </button>
                       <button className="flex items-center justify-center gap-2 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition-all text-xs font-black uppercase tracking-widest text-zinc-500">
                          <Sparkles size={16} className="text-blue-500" /> Meta
                       </button>
                    </div>
                 </div>

                 {products.length > 0 ? (
                    products.map((product) => (
                       <div key={product.id} className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm overflow-hidden border border-zinc-100 dark:border-zinc-800">
                          {/* Post Header */}
                          <div className="p-4 flex justify-between items-center">
                             <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                                   <Layers size={20} />
                                </div>
                                <div>
                                   <p className="text-sm font-black uppercase tracking-widest text-zinc-900 dark:text-white">{template.name}</p>
                                   <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">System Broadcast • Just Now</p>
                                </div>
                             </div>
                             <button className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
                                <MoreHorizontal size={20} />
                             </button>
                          </div>
                          
                          {/* Post Content */}
                          <div className="px-4 pb-4">
                             <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 font-medium italic">
                                New operational node synchronized: <span className="font-black text-blue-500 uppercase not-italic">#{product.title?.replace(/\s+/g, '')}</span>
                             </p>
                          </div>

                          <div className="border-y border-zinc-50 dark:border-zinc-800">
                             <ProductCard product={product} />
                          </div>

                          {/* Post Stats */}
                          <div className="p-4 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-zinc-400 border-b border-zinc-50 dark:border-zinc-800">
                             <div className="flex items-center gap-1">
                                <div className="flex -space-x-1">
                                   <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-[6px] text-white"><ThumbsUp size={8} /></div>
                                   <div className="w-4 h-4 rounded-full bg-rose-500 flex items-center justify-center text-[6px] text-white"><Sparkles size={8} /></div>
                                </div>
                                <span className="ml-1">856 Nodes Engaged</span>
                             </div>
                             <div>12 Transmissions • 4 Echoes</div>
                          </div>

                          {/* Post Actions */}
                          <div className="px-2 py-1 grid grid-cols-3">
                             <button className="flex items-center justify-center gap-2 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition-all text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                                <ThumbsUp size={16} /> Engage
                             </button>
                             <button className="flex items-center justify-center gap-2 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition-all text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                                <MessageSquare size={16} /> Feedback
                             </button>
                             <button className="flex items-center justify-center gap-2 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition-all text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                                <Share2 size={16} /> Broadcast
                             </button>
                          </div>
                       </div>
                    ))
                 ) : (
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-12 text-center shadow-sm">
                       <Cpu size={48} className="mx-auto mb-4 text-zinc-300" />
                       <h3 className="text-xl font-black italic tracking-tighter uppercase mb-2">No Active Feeds</h3>
                       <p className="text-xs text-zinc-500 uppercase tracking-widest">Connect products to initialize the social protocol.</p>
                    </div>
                 )}
              </div>
           </div>
        </div>
      </div>
    );
  }

  // Standard Template Layout (for other types)
  return (
    <div className="min-h-screen bg-background text-foreground pt-32 pb-24 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(59,130,246,0.1),transparent_70%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Navigation */}
        <div className="mb-12">
           <Link 
            href="/templates" 
            className="group inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 hover:text-blue-500 transition-colors"
           >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to Registry
           </Link>
        </div>

        {/* Template Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24 items-end">
           <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-500 mb-6">
                <Layers size={12} />
                <span className="text-[10px] font-black uppercase tracking-widest">Active Architecture</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.85] mb-8">
                {template.name}
              </h1>
              <p className="text-lg text-zinc-500 dark:text-zinc-400 uppercase tracking-widest font-medium leading-relaxed max-w-xl">
                {template.description}
              </p>
           </div>
           <div className="flex flex-col gap-6 lg:items-end">
              <div className="flex gap-4">
                 {template.features.map((feature, i) => (
                    <div key={i} className="px-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-400">
                       {feature}
                    </div>
                 ))}
              </div>
              <Button className="h-16 px-12 rounded-2xl text-[10px] font-black uppercase tracking-widest group">
                 Deploy Architecture
                 <Zap className="ml-2 h-4 w-4 fill-current group-hover:scale-125 transition-transform" />
              </Button>
           </div>
        </div>

        {/* Products Visualizer */}
        <div className="mb-32">
           <div className="flex items-center justify-between mb-12 pb-6 border-b border-zinc-100 dark:border-zinc-900">
              <div className="flex items-center gap-3">
                 <Cpu size={20} className="text-blue-500" />
                 <h2 className="text-2xl font-black italic tracking-tighter uppercase">Pre-Loaded Inventory</h2>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                 {products.length} Compatible Nodes Found
              </span>
           </div>

           {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                 {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                 ))}
              </div>
           ) : (
              <div className="aurora-card p-20 text-center bg-zinc-50/50 dark:bg-zinc-900/50">
                 <p className="text-zinc-500 dark:text-zinc-400 uppercase tracking-widest text-xs font-black">
                    No actual inventory nodes mapped to this ASIN set yet.
                 </p>
                 <Link href="/products" className="mt-8 inline-block">
                    <Button variant="outline" size="sm">Add Real Products</Button>
                 </Link>
              </div>
           )}
        </div>

        {/* Technical Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="aurora-card p-10 bg-white dark:bg-zinc-900/50 border-l-4 border-l-blue-500">
              <ShieldCheck className="text-blue-500 mb-6" size={32} />
              <h3 className="text-lg font-black italic uppercase tracking-tighter mb-4">Security Protocol</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-widest leading-relaxed">
                 Every product in this template is verified for transaction integrity and metadata security.
              </p>
           </div>
           <div className="aurora-card p-10 bg-white dark:bg-zinc-900/50 border-l-4 border-l-indigo-500">
              <ShoppingCart className="text-indigo-500 mb-6" size={32} />
              <h3 className="text-lg font-black italic uppercase tracking-tighter mb-4">Conversion Logic</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-widest leading-relaxed">
                 Optimized product placement based on neural interaction patterns within the {template.category} vertical.
              </p>
           </div>
           <div className="aurora-card p-10 bg-white dark:bg-zinc-900/50 border-l-4 border-l-emerald-500">
              <Sparkles className="text-emerald-500 mb-6" size={32} />
              <h3 className="text-lg font-black italic uppercase tracking-tighter mb-4">Aesthetic Consistency</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-widest leading-relaxed">
                 Dynamic layout adjustments ensure a seamless visual experience across all device viewports.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}

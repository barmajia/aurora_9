'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Sparkles, Command, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SearchCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const suggestions = [
    { label: 'Explore Collections', href: '/products', icon: Sparkles },
    { label: 'View Cart', href: '/cart', icon: Command },
    { label: 'Seller Dashboard', href: '/seller', icon: ArrowRight },
  ];

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[10vh] px-4 md:px-0">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            {/* Modal */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: -20 }}
              className="relative w-full max-w-2xl overflow-hidden rounded-[2.5rem] aurora-glass shadow-2xl border border-white/10"
            >
              <div className="p-6 border-b border-white/5 flex items-center gap-4">
                <Search className="text-primary" size={24} />
                <input
                  autoFocus
                  placeholder="What are you looking for?"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-grow bg-transparent border-none outline-none text-xl font-black italic tracking-tight placeholder:opacity-20"
                />
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-4">
                <div className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 mb-4 px-4">Popular Actions</div>
                <div className="flex flex-col gap-2">
                  {suggestions.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => { router.push(item.href); setIsOpen(false); }}
                      className="group flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-all text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <item.icon size={18} className="group-hover:text-primary transition-colors" />
                        </div>
                        <span className="text-sm font-black uppercase tracking-widest opacity-60 group-hover:opacity-100">{item.label}</span>
                      </div>
                      <kbd className="hidden sm:block text-[10px] font-mono opacity-20 px-2 py-1 bg-white/5 rounded-md self-center">ENTER</kbd>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-black/40 p-4 border-top border-white/5 flex justify-between items-center px-8">
                 <div className="flex items-center gap-4 opacity-30">
                    <div className="flex items-center gap-1"><kbd className="text-[10px] font-mono border border-white/20 px-1 rounded">ESC</kbd> <span className="text-[9px] font-black uppercase">Close</span></div>
                    <div className="flex items-center gap-1"><kbd className="text-[10px] font-mono border border-white/20 px-1 rounded">↑↓</kbd> <span className="text-[9px] font-black uppercase">Navigate</span></div>
                 </div>
                 <div className="text-[9px] font-black uppercase tracking-widest opacity-20 italic">Aurora Command Center</div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

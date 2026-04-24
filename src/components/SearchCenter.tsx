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
              className="relative w-full max-w-2xl overflow-hidden rounded-[2.5rem] bg-white dark:bg-zinc-900 shadow-2xl border border-zinc-200 dark:border-white/10"
            >
              <div className="p-6 border-b border-zinc-100 dark:border-white/5 flex items-center gap-4">
                <Search className="text-blue-500" size={24} />
                <input
                  autoFocus
                  placeholder="Scan for components..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-grow bg-transparent border-none outline-none text-xl font-black italic tracking-tight text-zinc-900 dark:text-white placeholder:opacity-20"
                />
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-xl transition-colors">
                  <X size={20} className="text-zinc-400" />
                </button>
              </div>

              <div className="p-4 bg-white dark:bg-zinc-900">
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-4 px-4">Node Operations</div>
                <div className="flex flex-col gap-2">
                  {suggestions.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => { router.push(item.href); setIsOpen(false); }}
                      className="group flex items-center justify-between p-4 rounded-2xl hover:bg-zinc-50 dark:hover:bg-white/5 transition-all text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-white/5 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                          <item.icon size={18} className="text-zinc-500 group-hover:text-blue-500 transition-colors" />
                        </div>
                        <span className="text-sm font-black uppercase tracking-widest text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white">{item.label}</span>
                      </div>
                      <kbd className="hidden sm:block text-[10px] font-mono text-zinc-300 dark:text-zinc-600 px-2 py-1 bg-zinc-50 dark:bg-white/5 rounded-md self-center">ENTER</kbd>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-zinc-50 dark:bg-black/40 p-4 border-t border-zinc-100 dark:border-white/5 flex justify-between items-center px-8">
                 <div className="flex items-center gap-4 text-zinc-400">
                    <div className="flex items-center gap-1"><kbd className="text-[10px] font-mono border border-zinc-200 dark:border-white/20 px-1 rounded">ESC</kbd> <span className="text-[9px] font-black uppercase">Terminate</span></div>
                    <div className="flex items-center gap-1"><kbd className="text-[10px] font-mono border border-zinc-200 dark:border-white/20 px-1 rounded">↑↓</kbd> <span className="text-[9px] font-black uppercase">Seek</span></div>
                 </div>
                 <div className="text-[9px] font-black uppercase tracking-widest text-zinc-300 dark:text-zinc-700 italic">Aurora Command Node</div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

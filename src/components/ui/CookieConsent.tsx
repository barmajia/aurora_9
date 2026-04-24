"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, X, Cookie } from "lucide-react";
import { Button } from "./Button";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted
    const consent = localStorage.getItem("aurora-cookie-consent");
    if (!consent) {
      // Show after a short delay for better UX
      const timer = setTimeout(() => setVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("aurora-cookie-consent", "accepted");
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("aurora-cookie-consent", "declined");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.95 }}
          className="fixed bottom-6 left-6 right-6 z-[100] sm:left-auto sm:right-8 sm:max-w-md"
        >
          <div className="relative overflow-hidden rounded-[2rem] border border-zinc-200 dark:border-white/10 bg-white/80 dark:bg-zinc-900/80 p-8 shadow-2xl backdrop-blur-2xl">
            {/* Background Accent */}
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <Cookie size={20} />
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-900 dark:text-white italic">
                    Cookie <span className="text-blue-500">Protocol</span>
                  </h3>
                </div>
                <button 
                  onClick={() => setVisible(false)}
                  className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <p className="mb-8 text-xs font-medium leading-relaxed text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
                We utilize cryptographic data nodes (cookies) to optimize your ecosystem interface and ensure secure transaction integrity.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={handleAccept}
                  className="flex-1 text-[10px] font-black uppercase tracking-widest"
                >
                  Accept Protocol
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleDecline}
                  className="flex-1 text-[10px] font-black uppercase tracking-widest"
                >
                  Configure
                </Button>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 text-[8px] font-black uppercase tracking-[0.3em] text-zinc-400">
                <Shield size={12} className="text-emerald-500" />
                <span>GDPR Compliant Node</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

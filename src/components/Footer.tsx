"use client";

import Link from "next/link";
import { Mail, Phone, MapPin, Globe, ShieldCheck, Box, Cpu, HardDrive, Network } from "lucide-react";
import { motion } from "framer-motion";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-background text-foreground border-t border-zinc-100 dark:border-zinc-900 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-50">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1800px] px-6 lg:px-12 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-8">
          {/* Brand & Manifesto */}
          <div className="lg:col-span-4 space-y-8">
            <Link href="/" className="inline-block group">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black italic text-xl shadow-xl shadow-blue-600/20 group-hover:scale-110 transition-transform duration-500">
                  A
                </div>
                <div className="flex flex-col">
                  <span className="font-black italic text-2xl tracking-tighter text-zinc-900 dark:text-white uppercase leading-none">
                    Aurora
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 mt-1">
                    Ecosystem v4.0
                  </span>
                </div>
              </div>
            </Link>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm leading-relaxed">
              Architecting the future of global commerce. A decentralized, high-performance ecosystem for premium goods and industrial services.
            </p>
            <div className="flex gap-3">
              {[Cpu, HardDrive, Network, Globe].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-blue-500 hover:bg-blue-500/5 transition-all border border-zinc-100 dark:border-zinc-800"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Matrix */}
          <div className="lg:col-span-2 space-y-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Core Nodes</h3>
            <ul className="space-y-4 text-sm">
              {["Products", "Services", "About Ecosystem", "Technical Specs", "Logistics"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-zinc-600 dark:text-zinc-400 hover:text-blue-500 transition-colors font-medium">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Governance</h3>
            <ul className="space-y-4 text-sm">
              {["Seller Protocol", "Factory Standards", "Middleman Node", "Verification", "Dispute Resolution"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-zinc-600 dark:text-zinc-400 hover:text-blue-500 transition-colors font-medium">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Node */}
          <div className="lg:col-span-4 space-y-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Global Uplink</h3>
            <div className="aurora-glass rounded-3xl p-8 border border-zinc-100 dark:border-zinc-900 space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Direct Protocol</p>
                  <a href="mailto:uplink@aurora.eco" className="text-sm font-bold text-zinc-900 dark:text-white hover:text-blue-500 transition-colors">
                    uplink@aurora.eco
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Security Node</p>
                  <p className="text-sm font-bold text-zinc-900 dark:text-white">
                    Verified End-to-End
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 shrink-0">
                  <Globe size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">HQ Origin</p>
                  <p className="text-sm font-bold text-zinc-900 dark:text-white">
                    SF_LAT_37.7749_LON_-122.4194
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Status & Copyright */}
        <div className="mt-24 pt-12 border-t border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
            <p>&copy; {currentYear} Aurora Ecosystem. All systems nominal.</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-emerald-500">
                <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                Network Live
              </div>
              <div className="flex items-center gap-1.5 text-blue-500">
                <div className="w-1.5 h-1.5 rounded-full bg-current" />
                v4.0.12 Stable
              </div>
            </div>
          </div>
          
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.2em]">
            <Link href="/privacy" className="text-zinc-500 hover:text-blue-500 transition-colors">Privacy Protocol</Link>
            <Link href="/terms" className="text-zinc-500 hover:text-blue-500 transition-colors">Service Terms</Link>
            <Link href="/cookies" className="text-zinc-500 hover:text-blue-500 transition-colors">Node Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

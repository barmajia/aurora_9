'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, Globe, Send, Code, Briefcase, Camera, Sparkles } from 'lucide-react';
import { Magnetic } from '@/components/ui';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-20 pt-32 pb-12 overflow-hidden border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 md:gap-24 relative z-10">
        {/* Brand & Mission */}
        <div className="space-y-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl flex items-center justify-center group-hover:bg-black dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black transition-all duration-500">
               <Sparkles size={18} />
            </div>
            <span className="text-xl font-bold tracking-tight text-black dark:text-white uppercase">Aurora</span>
          </Link>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
            Building the next generation of unified commerce. We harmonize brands, logistics, and consumers into a single premium ecosystem.
          </p>
          <div className="flex items-center gap-2">
            {[
              { icon: Send, label: 'Twitter' },
              { icon: Camera, label: 'Instagram' },
              { icon: Code, label: 'Github' },
              { icon: Briefcase, label: 'LinkedIn' },
            ].map((social) => (
              <Magnetic key={social.label}>
                <a 
                  href="#" 
                  className="w-10 h-10 flex items-center justify-center bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-full hover:bg-black dark:hover:bg-white text-zinc-400 hover:text-white dark:hover:text-black transition-all"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </a>
              </Magnetic>
            ))}
          </div>
        </div>

        {/* Navigation Categories */}
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-8">Ecosystem</h4>
          <ul className="space-y-4">
            {[
              { label: 'Inventory', path: '/products' },
              { label: 'Community', path: '/about' },
              { label: 'Updates', path: '/templates' },
              { label: 'Terms', path: '/terms' },
            ].map((link) => (
              <li key={link.label}>
                <Link href={link.path} className="text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-all">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Intelligence */}
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-8">Intelligence</h4>
          <ul className="space-y-4">
             {[
              { label: 'Insights', path: '#' },
              { label: 'Protocols', path: '#' },
              { label: 'Security', path: '#' },
              { label: 'Partners', path: '#' },
            ].map((link) => (
              <li key={link.label}>
                <Link href={link.path} className="text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-all">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-8">Contact</h4>
          <ul className="space-y-6">
            <li className="flex items-start gap-4">
              <div className="mt-1 p-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-lg">
                <Mail size={14} className="text-zinc-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Email</span>
                <span className="text-sm font-medium text-zinc-900 dark:text-white">hello@aurora.io</span>
              </div>
            </li>
            <li className="flex items-start gap-4">
                <div className="mt-1 p-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-lg">
                  <MapPin size={14} className="text-zinc-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Location</span>
                  <span className="text-sm font-medium text-zinc-900 dark:text-white">Global Infrastructure</span>
                </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 md:px-12 mt-24 pt-8 border-t border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest">
            &copy; {currentYear} Aurora Ecosystem. All rights reserved.
        </p>
        <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Operational</span>
            </div>
        </div>
      </div>
    </footer>
  );
}

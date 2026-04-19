'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Button, Input, Card, Magnetic } from '@/components/ui';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#020203] pt-20">
      {/* 🏙️ Luxury Atmospheric Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-[480px] relative z-10"
      >
        <div className="text-center mb-12">
           <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-white mb-4 uppercase">
              Welcome <span className="aurora-gradient-text">Back.</span>
           </h1>
           <p className="text-[10px] font-black text-white/30 tracking-[0.3em] uppercase">Enter your portal credentials</p>
        </div>

        <Card className="aurora-glass p-12 rounded-[3.5rem] border-white/5 shadow-2xl bg-white/[0.02]">
          <form onSubmit={handleLogin} className="space-y-8">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-5 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-100 text-[10px] font-black uppercase tracking-wider flex items-center gap-4"
                >
                  <ShieldCheck size={18} className="text-red-500" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-6">
              <Input
                type="email"
                label="Identifier"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="EMAIL@DOMAIN.COM"
                leftIcon={<Mail size={18} />}
                required
              />

              <div className="space-y-2">
                <Input
                  type="password"
                  label="Security Key"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  leftIcon={<Lock size={18} />}
                  required
                />
                <div className="flex justify-end pr-2">
                   <button type="button" className="text-[10px] font-bold text-white/20 hover:text-white transition-colors uppercase tracking-widest">Forgot Passcode?</button>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Magnetic strength={0.1}>
                <Button 
                  type="submit" 
                  size="lg"
                  className="w-full h-18 rounded-[1.5rem]" 
                  isLoading={loading} 
                  rightIcon={<ArrowRight size={18} />}
                >
                  Authorize Session
                </Button>
              </Magnetic>
            </div>
          </form>

          <footer className="mt-12 pt-10 border-t border-white/5 text-center space-y-6">
            <p className="text-[11px] font-bold uppercase tracking-widest text-white/20">
              New explorer?{' '}
              <Link href="/signup" className="text-white hover:text-primary transition-all ml-1 border-b border-white/20 hover:border-primary">
                Join Ecosystem
              </Link>
            </p>
            <div className="h-px w-10 bg-white/5 mx-auto" />
            <Link href="/seller/login" className="block text-[9px] font-black uppercase tracking-[0.4em] text-white/10 hover:text-white transition-colors">
              Merchant Terminal Login
            </Link>
          </footer>
        </Card>
      </motion.div>
    </div>
  );
}

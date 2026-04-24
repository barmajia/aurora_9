"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Button, Input, Card, Magnetic } from "@/components/ui";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#010103]">
      {/* 🏙️ Luxury Atmospheric Glows & Textures */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] dark:opacity-[0.05]" />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-[#010103]/50 to-[#010103]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[500px] relative z-10"
      >
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-md mb-8"
          >
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">
              Aurora Auth Protocol v4.0
            </span>
          </motion.div>

          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter text-white mb-6 uppercase leading-[0.8]">
            Portal <br />
            <span className="aurora-gradient-text">Access.</span>
          </h1>
          <p className="text-[11px] font-black text-white/30 tracking-[0.5em] uppercase">
            Initialize Security Handshake
          </p>
        </div>

        <Card className="aurora-glass p-12 rounded-[4rem] border-white/5 shadow-[0_32px_64px_rgba(0,0,0,0.4)] bg-white/[0.01] relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <form onSubmit={handleLogin} className="space-y-10">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-3xl text-rose-200 text-[10px] font-black uppercase tracking-widest flex items-center gap-4"
                >
                  <ShieldCheck size={20} className="text-rose-500 shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-8">
              <Input
                type="email"
                label="Node Identity (Email)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="OPERATOR@AURORA.ECO"
                leftIcon={<Mail size={18} />}
                required
                className="bg-white/[0.02] border-white/5 focus:border-blue-500/50 transition-all"
              />

              <div className="space-y-4">
                <Input
                  type="password"
                  label="Access Cipher"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  leftIcon={<Lock size={18} />}
                  showPasswordToggle
                  required
                  className="bg-white/[0.02] border-white/5 focus:border-blue-500/50 transition-all"
                />
                <div className="flex justify-end px-2">
                  <button
                    type="button"
                    className="text-[9px] font-black text-white/20 hover:text-blue-400 transition-colors uppercase tracking-[0.2em]"
                  >
                    Recover Cipher Key?
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Magnetic strength={0.1}>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-20 rounded-3xl text-xs font-black uppercase tracking-[0.3em] shadow-xl shadow-blue-600/10"
                  isLoading={loading}
                  rightIcon={<ArrowRight size={20} />}
                >
                  Establish Link
                </Button>
              </Magnetic>
            </div>
          </form>

          <footer className="mt-14 pt-12 border-t border-white/5 text-center space-y-8">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
              Unregistered Node?{" "}
              <Link
                href="/signup"
                className="text-white hover:text-blue-400 transition-all ml-2 border-b border-white/20 hover:border-blue-400 pb-0.5"
              >
                Join Network
              </Link>
            </p>
            <div className="flex items-center justify-center gap-6 grayscale opacity-20">
               <div className="h-px flex-1 bg-white/10" />
               <Sparkles size={16} />
               <div className="h-px flex-1 bg-white/10" />
            </div>
            <Link
              href="/seller/login"
              className="block text-[8px] font-black uppercase tracking-[0.5em] text-white/10 hover:text-white transition-colors"
            >
              Industrial Terminal Access
            </Link>
          </footer>
        </Card>
      </motion.div>
    </div>
  );
}

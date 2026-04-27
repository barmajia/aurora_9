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
  const [theme, setTheme] = useState<"light" | "dark">("light");
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
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-white dark:bg-[#010103]">
      {/* Light Theme Background */}
      <div className="absolute inset-0 z-0">
        <div className="hidden dark:block absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[140px] animate-pulse" />
        <div className="hidden dark:block absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="hidden dark:block absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] dark:opacity-[0.05]" />
        <div className="hidden dark:block absolute inset-0 bg-linear-to-b from-transparent via-[#010103]/50 to-[#010103]" />
        
        {/* Light mode gradients */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-emerald-200/40 to-teal-200/40 rounded-full blur-3xl animate-pulse dark:hidden" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-teal-200/40 to-cyan-200/40 rounded-full blur-3xl animate-pulse dark:hidden" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-emerald-100/30 to-teal-100/30 rounded-full blur-3xl dark:hidden" />
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
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
              Aurora Auth v4.0
            </span>
          </motion.div>

          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter text-slate-900 mb-6 uppercase leading-[0.8]">
            Welcome <br />
            <span className="aurora-gradient-text">Back.</span>
          </h1>
          <p className="text-[11px] font-black text-slate-400 tracking-[0.5em] uppercase">
            Sign in to continue
          </p>
        </div>

        <Card className="p-12 rounded-[3rem] border border-slate-200 shadow-xl bg-white relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
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
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                leftIcon={<Mail size={18} />}
                required
                className="bg-slate-50 border-slate-200 focus:border-emerald-500 transition-all"
              />

              <div className="space-y-4">
                <Input
                  type="password"
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  leftIcon={<Lock size={18} />}
                  showPasswordToggle
                  required
                  className="bg-slate-50 border-slate-200 focus:border-emerald-500 transition-all"
                />
                <div className="flex justify-end px-2">
                  <Link
                    href="/forgot-password"
                    className="text-[9px] font-medium text-slate-400 hover:text-emerald-600 transition-colors uppercase tracking-[0.2em]"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Magnetic strength={0.1}>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-20 rounded-3xl text-xs font-black uppercase tracking-[0.3em] shadow-lg"
                  isLoading={loading}
                  rightIcon={<ArrowRight size={20} />}
                >
                  Sign In
                </Button>
              </Magnetic>
            </div>
          </form>

          <footer className="mt-14 pt-12 border-t border-slate-200 text-center space-y-8">
            <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-slate-400">
              Do not have an account?{" "}
              <Link
                href="/signup"
                className="text-emerald-600 hover:text-emerald-700 transition-all ml-2 border-b border-emerald-300 pb-0.5"
              >
                Sign up
              </Link>
            </p>
            <div className="flex items-center justify-center gap-6 text-slate-300">
               <div className="h-px flex-1 bg-slate-200" />
               <Sparkles size={16} />
               <div className="h-px flex-1 bg-slate-200" />
            </div>
            <Link
              href="/seller/login"
              className="block text-[8px] font-medium uppercase tracking-[0.5em] text-slate-300 hover:text-emerald-600 transition-colors"
            >
              Seller Login
            </Link>
          </footer>
        </Card>
      </motion.div>
    </div>
  );
}

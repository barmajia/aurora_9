"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  Lock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Button, Input, Card, Magnetic } from "@/components/ui";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name, phone } },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Failed to create account");

      await supabase.from("customers").insert({
        user_id: authData.user.id,
        name,
        email,
        phone,
      });

      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
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
        
        {/* Light mode gradients */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-emerald-200/40 to-teal-200/40 rounded-full blur-3xl animate-pulse dark:hidden" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-teal-200/40 to-cyan-200/40 rounded-full blur-3xl animate-pulse dark:hidden" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-emerald-100/30 to-teal-100/30 rounded-full blur-3xl dark:hidden" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[550px] relative z-10"
      >
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-200 bg-emerald-50 mb-8"
          >
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-emerald-600">
              Create Account
            </span>
          </motion.div>

          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter text-slate-900 mb-6 uppercase leading-[0.8]">
            Get <br />
            <span className="text-emerald-600">Started.</span>
          </h1>
          <p className="text-[11px] font-medium text-slate-400 tracking-[0.5em] uppercase">
            Join Aurora today
          </p>
        </div>

        <Card className="p-12 rounded-[3rem] border border-slate-200 shadow-xl bg-white relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <form onSubmit={handleSignup} className="space-y-8">
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

            <div className="space-y-6">
              <Input
                type="text"
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                leftIcon={<User size={18} />}
                required
                className="bg-slate-50 border-slate-200 focus:border-emerald-500 transition-all"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <Input
                  type="tel"
                  label="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 234 567 8900"
                  leftIcon={<Phone size={18} />}
                  required
                  className="bg-slate-50 border-slate-200 focus:border-emerald-500 transition-all"
                />
              </div>

              <Input
                type="password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                leftIcon={<Lock size={18} />}
                minLength={6}
                required
                className="bg-slate-50 border-slate-200 focus:border-emerald-500 transition-all"
              />
            </div>

            <div className="pt-4">
              <Magnetic strength={0.1}>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-20 rounded-3xl text-xs font-bold uppercase tracking-[0.3em] shadow-lg"
                  isLoading={loading}
                  rightIcon={<ArrowRight size={20} />}
>
                  Create Account
                </Button>
              </Magnetic>
            </div>
          </form>

          <footer className="mt-14 pt-12 border-t border-slate-200 text-center">
            <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-slate-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-emerald-600 hover:text-emerald-700 transition-all ml-2 border-b border-emerald-300 pb-0.5"
              >
                Sign in
              </Link>
            </p>
          </footer>
        </Card>

        <div className="mt-12 flex justify-center gap-10 text-slate-300">
          <div className="flex items-center gap-3">
            <Sparkles size={16} className="text-emerald-500" />
            <span className="text-[9px] font-medium uppercase tracking-[0.4em] text-slate-400">Secure</span>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck size={16} className="text-emerald-500" />
            <span className="text-[9px] font-medium uppercase tracking-[0.4em] text-slate-400">Protected</span>
          </div>
        </div>

        <Link
          href="/seller/signup"
          className="block mt-8 text-center text-[8px] font-medium uppercase tracking-[0.5em] text-slate-300 hover:text-emerald-600 transition-colors"
        >
          Become a Seller
        </Link>
      </motion.div>
    </div>
  );
}

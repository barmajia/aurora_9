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
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#010103]">
      {/* 🏙️ Luxury Atmospheric Glows & Textures */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] dark:opacity-[0.05]" />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-[#010103]/50 to-[#010103]" />
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
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-md mb-8"
          >
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">
              Aurora Node Initiation
            </span>
          </motion.div>

          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter text-white mb-6 uppercase leading-[0.8]">
            Genesis <br />
            <span className="aurora-gradient-text text-emerald-400">Registry.</span>
          </h1>
          <p className="text-[11px] font-black text-white/30 tracking-[0.5em] uppercase">
            Create Global Identity Node
          </p>
        </div>

        <Card className="aurora-glass p-12 rounded-[4rem] border-white/5 shadow-[0_32px_64px_rgba(0,0,0,0.4)] bg-white/[0.01] relative overflow-hidden group">
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
                label="Identity Alias (Full Name)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="OPERATOR NAME"
                leftIcon={<User size={18} />}
                required
                className="bg-white/[0.02] border-white/5 focus:border-emerald-500/50 transition-all"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  type="email"
                  label="Node Uplink (Email)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="EMAIL"
                  leftIcon={<Mail size={18} />}
                  required
                  className="bg-white/[0.02] border-white/5 focus:border-emerald-500/50 transition-all"
                />
                <Input
                  type="tel"
                  label="Comm Link (Phone)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="PHONE"
                  leftIcon={<Phone size={18} />}
                  required
                  className="bg-white/[0.02] border-white/5 focus:border-emerald-500/50 transition-all"
                />
              </div>

              <Input
                type="password"
                label="Security Cipher"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                leftIcon={<Lock size={18} />}
                minLength={6}
                required
                className="bg-white/[0.02] border-white/5 focus:border-emerald-500/50 transition-all"
              />
            </div>

            <div className="pt-4">
              <Magnetic strength={0.1}>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-20 rounded-3xl text-xs font-black uppercase tracking-[0.3em] shadow-xl shadow-emerald-600/10 bg-emerald-600 hover:bg-emerald-500 border-none"
                  isLoading={loading}
                  rightIcon={<ArrowRight size={20} />}
                >
                  Initialize Node
                </Button>
              </Magnetic>
            </div>
          </form>

          <footer className="mt-14 pt-12 border-t border-white/5 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
              Existing Node?{" "}
              <Link
                href="/login"
                className="text-white hover:text-emerald-400 transition-all ml-2 border-b border-white/20 hover:border-emerald-400 pb-0.5"
              >
                Return to Portal
              </Link>
            </p>
          </footer>
        </Card>

        <div className="mt-12 flex justify-center gap-10 grayscale opacity-20 hover:opacity-100 transition-opacity duration-500">
          <div className="flex items-center gap-3">
            <Sparkles size={16} className="text-white" />
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white">Encrypted Node</span>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck size={16} className="text-white" />
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white">Verified Origin</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

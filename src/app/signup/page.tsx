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
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#020203]">
      {/* 🏙️ Luxury Atmospheric Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-[500px] relative z-10"
      >
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-white mb-4 uppercase">
            Join the <span className="aurora-gradient-text">Future.</span>
          </h1>
          <p className="text-[10px] font-black text-white/30 tracking-[0.3em] uppercase">
            Create your global identity
          </p>
        </div>

        <Card className="aurora-glass p-12 rounded-[3.5rem] border-white/5 shadow-2xl bg-white/[0.02]">
          <form onSubmit={handleSignup} className="space-y-8">
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
                type="text"
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="YOUR NAME"
                leftIcon={<User size={18} />}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  type="email"
                  label="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="EMAIL"
                  leftIcon={<Mail size={18} />}
                  required
                />
                <Input
                  type="tel"
                  label="Contact Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="PHONE"
                  leftIcon={<Phone size={18} />}
                  required
                />
              </div>

              <Input
                type="password"
                label="Security Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                leftIcon={<Lock size={18} />}
                minLength={6}
                required
              />
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
                  Initialize Account
                </Button>
              </Magnetic>
            </div>
          </form>

          <div className="mt-12 pt-10 border-t border-white/5 text-center">
            <p className="text-[11px] font-bold uppercase tracking-widest text-white/20">
              Already a member?{" "}
              <Link
                href="/login"
                className="text-white hover:text-primary transition-all ml-1 border-b border-white/20 hover:border-primary"
              >
                Return to Portal
              </Link>
            </p>
          </div>
        </Card>

        <div className="mt-10 flex justify-center gap-10">
          <div className="flex items-center gap-2 opacity-20 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
            <Sparkles size={14} className="text-white" />
            <span className="text-[9px] font-black uppercase tracking-widest text-white">
              Encrypted
            </span>
          </div>
          <div className="flex items-center gap-2 opacity-20 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
            <ShieldCheck size={14} className="text-white" />
            <span className="text-[9px] font-black uppercase tracking-widest text-white">
              Verified
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

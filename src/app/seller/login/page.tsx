
"use client";

import Link from "next/link";
import {
  Store,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Globe,
  ShieldCheck,
  BarChart3,
  Package,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/auth";
import { useToastStore } from "@/store/toast";
import { Router } from "next/router";

// Background gradient elements
function BackgroundGradients({ theme }: { theme: "light" | "dark" }) {
  if (theme === "light") {
    return (
      <>
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-500/5 rounded-full blur-[120px] animate-pulse pointer-events-none" />
      </>
    );
  }
  return (
    <>
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/20 rounded-full blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-500/10 rounded-full blur-[120px] animate-pulse pointer-events-none" />
    </>
  );
}

// Top navigation bar
interface TopNavProps {
  theme: "light" | "dark";
  onThemeToggle: () => void;
}

function TopNav({ theme, onThemeToggle }: TopNavProps) {
  const router = useRouter();
  const bgClass =
    theme === "light"
      ? "bg-black/5 border-black/10 text-slate-700 hover:bg-black/10"
      : "bg-white/5 border-white/10 text-white/80 hover:bg-white/10";

  const handleBack = () => {
    if (window.history.length > 2) {
      router.back();
    } else {
      router.push("/seller");
    }
  };

  return (
    <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20">
      <button
        onClick={handleBack}
        className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md border transition-all text-sm font-medium ${bgClass}`}
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <button
        onClick={onThemeToggle}
        className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md border transition-all text-sm font-medium ${bgClass}`}
      >
        {theme === "light" ? "🌙" : "☀️"}
      </button>
    </div>
  );
}

// Header section
function HeaderSection({ theme }: { theme: "light" | "dark" }) {
  const bgClass =
    theme === "light"
      ? "bg-black/5 border-black/10"
      : "bg-white/5 border-white/20";
  const textClass =
    theme === "light" ? "text-slate-900" : "from-white to-white/70";
  const subtextClass = theme === "light" ? "text-slate-600" : "text-white/60";
  const linkClass =
    theme === "light"
      ? "text-emerald-600 hover:text-emerald-700"
      : "text-emerald-400 hover:text-emerald-300";

  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10 animate-in fade-in slide-in-from-top-8 duration-700">
      <div className="flex justify-center mb-6">
        <div
          className={`p-4 backdrop-blur-md rounded-3xl shadow-inner border ${bgClass}`}
        >
          <Store className="h-12 w-12 text-emerald-400 mx-auto" />
        </div>
      </div>
      <h2
        className={`text-4xl font-black tracking-tight ${theme === "light" ? "text-slate-900" : "bg-gradient-to-br from-white to-white/70 bg-clip-text text-transparent"}`}
      >
        Seller Portal
      </h2>
      <p className={`mt-3 font-medium ${subtextClass}`}>
        Need the seller app?{" "}
        <Link
          href="/seller/signup"
          className={`hover:underline transition-all underline-offset-4 ${linkClass}`}
        >
          Download here
        </Link>
      </p>
    </div>
  );
}

// Form input component
interface FormInputProps {
  label: string;
  type?: string;
  placeholder: string;
  icon: React.ReactNode;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  hasPasswordToggle?: boolean;
  theme?: "light" | "dark";
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

function FormInput({
  label,
  type = "text",
  placeholder,
  icon,
  showPassword,
  onTogglePassword,
  hasPasswordToggle,
  theme = "dark",
  value,
  onChange,
  required,
}: FormInputProps) {
  const labelClass = theme === "light" ? "text-slate-700" : "text-white";
  const bgClass =
    theme === "light"
      ? "bg-black/5 border-black/10 focus:ring-emerald-500/30 focus:border-emerald-600 text-slate-900 placeholder:text-slate-400"
      : "bg-white/5 border-white/10 focus:ring-emerald-500/50 focus:border-emerald-400 text-white placeholder:text-white/30";
  const iconColorClass =
    theme === "light"
      ? "group-focus-within:text-emerald-600"
      : "group-focus-within:text-emerald-400";
  const buttonTextClass =
    theme === "light"
      ? "text-slate-400 hover:text-emerald-600"
      : "text-white/40 hover:text-emerald-400";

  return (
    <div className="space-y-2">
      {label && (
        <label className={`text-sm font-bold ml-1 ${labelClass}`}>
          {label}
        </label>
      )}
      <div className="relative group">
        <div
          className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${iconColorClass}`}
        >
          {icon}
        </div>
        <input
          type={hasPasswordToggle ? (showPassword ? "text" : "password") : type}
          className={`w-full pl-12 pr-12 h-14 border rounded-2xl focus:ring-2 transition-all text-lg outline-none ${bgClass}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
        />
        {hasPasswordToggle && (
          <button
            type="button"
            className={`absolute inset-y-0 right-0 pr-4 flex items-center transition-colors ${buttonTextClass}`}
            onClick={onTogglePassword}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

// Login form section
interface LoginFormProps {
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  showPassword: boolean;
  onTogglePassword: () => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  error: string | null;
  theme?: "light" | "dark";
}

function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  onTogglePassword,
  onSubmit,
  loading,
  error,
  theme = "dark",
}: LoginFormProps) {
  const linkClass =
    theme === "light"
      ? "text-emerald-600 hover:text-emerald-700"
      : "text-emerald-400/70 hover:text-emerald-400";
  const buttonClass =
    theme === "light"
      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
      : "bg-emerald-600 hover:bg-emerald-700 text-white";

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-rose-500/20 border border-rose-500/30 rounded-2xl text-rose-500 text-sm font-bold text-center animate-in fade-in zoom-in duration-300">
          {error}
        </div>
      )}

      <FormInput
        label="Business Email"
        type="email"
        placeholder="Enter your business email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        icon={
          <Mail
            className={`h-5 w-5 ${theme === "light" ? "text-slate-400" : "text-white/40"}`}
          />
        }
        theme={theme}
      />

      <div className="space-y-2">
        <div className="flex justify-between items-center ml-1">
          <label
            className={`text-sm font-bold ${theme === "light" ? "text-slate-700" : "text-white"}`}
          >
            Password
          </label>
          <Link
            href="/forgot-password"
            className={`text-xs font-semibold transition-colors ${linkClass}`}
          >
            Forgot password?
          </Link>
        </div>
        <FormInput
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          icon={
            <Lock
              className={`h-5 w-5 ${theme === "light" ? "text-slate-400" : "text-white/40"}`}
            />
          }
          showPassword={showPassword}
          onTogglePassword={onTogglePassword}
          hasPasswordToggle
          label=""
          theme={theme}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full h-14 text-lg font-bold rounded-2xl shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${buttonClass}`}
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Verifying Node...
          </div>
        ) : (
          "Access Dashboard"
        )}
      </button>
    </form>
  );
}

// Divider component
function Divider({ theme = "dark" }: { theme?: "light" | "dark" }) {
  const borderClass = theme === "light" ? "border-black/10" : "border-white/10";
  const bgClass =
    theme === "light"
      ? "bg-black/5 border-black/10 text-slate-600"
      : "bg-white/5 border-white/10 text-white/50";

  return (
    <div className="relative my-8">
      <div className="absolute inset-0 flex items-center">
        <div className={`w-full border-t ${borderClass}`} />
      </div>
      <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
        <span
          className={`px-4 backdrop-blur-md py-1 rounded-full border ${bgClass}`}
        >
          Or continue with
        </span>
      </div>
    </div>
  );
}

// Social login button
function SocialLoginButton({ theme = "dark" }: { theme?: "light" | "dark" }) {
  const bgClass =
    theme === "light"
      ? "bg-black/5 border-black/10 hover:bg-black/10 text-slate-900"
      : "bg-white/5 border-white/10 hover:bg-white/10 text-white";

  return (
    <button
      className={`w-full border h-14 text-lg font-bold rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 ${bgClass}`}
    >
      <Globe className="h-6 w-6 text-emerald-400" />
      Sign in with Google
    </button>
  );
}

// Quick navigation card
interface NavCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  theme?: "light" | "dark";
}

function NavCard({ icon, title, description, theme = "dark" }: NavCardProps) {
  const bgClass =
    theme === "light"
      ? "bg-black/5 border-black/10 hover:bg-emerald-500/10 hover:border-emerald-500/30 text-slate-900"
      : "bg-white/5 border-white/10 hover:bg-emerald-500/10 hover:border-emerald-500/30 text-white";
  const subtextClass = theme === "light" ? "text-slate-600" : "text-white/80";

  return (
    <button
      className={`p-4 border rounded-2xl text-center space-y-1 group transition-all cursor-pointer ${bgClass}`}
    >
      <div className="flex justify-center group-hover:animate-bounce">
        {icon}
      </div>
      <p
        className={`text-[10px] font-black uppercase tracking-tighter ${theme === "light" ? "text-slate-500" : "text-white/60"}`}
      >
        {title}
      </p>
      <p className={`text-[11px] font-bold leading-none ${subtextClass}`}>
        {description}
      </p>
    </button>
  );
}

// Quick navigation grid
function QuickNavigation({ theme = "dark" }: { theme?: "light" | "dark" }) {
  return (
    <div className="mt-8 grid grid-cols-2 gap-4">
      <NavCard
        icon={<Package className="h-5 w-5 text-emerald-400" />}
        title="Products"
        description="Manage inventory"
        theme={theme}
      />
      <NavCard
        icon={<BarChart3 className="h-5 w-5 text-emerald-400" />}
        title="Analytics"
        description="View dashboard"
        theme={theme}
      />
    </div>
  );
}

// Footer component
function Footer({ theme = "dark" }: { theme?: "light" | "dark" }) {
  const textClass = theme === "light" ? "text-slate-400" : "text-white/40";

  return (
    <div
      className={`mt-8 flex items-center justify-center gap-6 font-bold text-[10px] uppercase tracking-[0.2em] animate-in fade-in duration-1000 ${textClass}`}
    >
      <div className="flex items-center gap-1.5">
        <ShieldCheck className="h-3 w-3" />
        <span>Secure SSL</span>
      </div>
      <div
        className={`w-1 h-1 rounded-full ${theme === "light" ? "bg-black/20" : "bg-white/20"}`}
      />
      <span>Verified Enterprise</span>
    </div>
  );
}

// Main component
export default function SellerLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { setUser } = useAuthStore();
  const addToast = useToastStore((state) => state.addToast);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Auth check
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        if (authError.message === "Invalid login credentials") {
          throw new Error("Invalid email or password. Please verify your credentials or create a new seller account.");
        }
        throw authError;
      }

      // 2. Seller table verification (by user_id)
      // const { data: sellerData, error: sellerError } = await supabase
      //   .from("sellers")
      //   .select("*")
      //   .eq("user_id", authData.user.id)
      //   .single();

      // if (sellerError || !sellerData) {
      //   // Sign out if not a seller
      //   await supabase.auth.signOut();
      //   throw new Error("Access denied: Node not registered in sellers matrix.");
      // }

      // 3. Update store and redirect
      // setUser({
      //   id: authData.user.id,
      //   email: authData.user.email || "",
      //   // name: sellerData.full_name || "Seller Admin",
      //   role: "seller",
      //   isVerified: sellerData.is_verified,
      //   storeName: sellerData.full_name,
      // });

      addToast("Uplink established. Redirecting to dashboard...", "success");
      router.push("/seller/dashboard");
    } catch (err: unknown) {
      console.error("Login Error:", err);
      const message = err instanceof Error ? err.message : "Failed to establish connection to Aurora network.";
      setError(message);
      addToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  const bgClass =
    theme === "light"
      ? "bg-white dark:bg-white"
      : "bg-slate-950 dark:bg-slate-950";

  return (
    <div
      className={`min-h-screen relative overflow-hidden flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 ${bgClass}`}
    >
      <BackgroundGradients theme={theme} />
      <TopNav
        theme={theme}
        onThemeToggle={() => setTheme(theme === "light" ? "dark" : "light")}
      />
      <HeaderSection theme={theme} />

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div
          className={`p-8 sm:p-10 rounded-[2.5rem] shadow-2xl border animate-in fade-in slide-in-from-bottom-8 duration-700 ${theme === "light" ? "bg-white/50 backdrop-blur-xl border-black/10" : "bg-white/5 backdrop-blur-xl border-white/10"}`}
        >
          <LoginForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
            onSubmit={handleLogin}
            loading={loading}
            error={error}
            theme={theme}
          />
          <Divider theme={theme} />
          <SocialLoginButton theme={theme} />
          <QuickNavigation theme={theme} />
        </div>
        <Footer theme={theme} />
      </div>
    </div>
  );
}

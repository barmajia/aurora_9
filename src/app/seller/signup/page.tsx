"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Store,
  Mail,
  Lock,
  User,
  Building2,
  FileText,
  Shield,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/hooks/useAuth";
import { useTranslation } from "react-i18next";

export default function SellerSignupPage() {
  const { t } = useTranslation();
  const { signup, isLoading, error } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    storeName: "",
    storeDescription: "",
    agreeToTerms: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target as HTMLInputElement &
      HTMLTextAreaElement;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const validateForm = (): boolean => {
    if (
      !formData.email ||
      !formData.password ||
      !formData.name ||
      !formData.storeName
    ) {
      setFormError("Please fill in all required fields");
      return false;
    }
    if (formData.password.length < 8) {
      setFormError("Password must be at least 8 characters");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setFormError("Passwords do not match");
      return false;
    }
    if (!formData.agreeToTerms) {
      setFormError("Please agree to the terms and conditions");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!validateForm()) return;

    const result = await signup({
      email: formData.email,
      password: formData.password,
      name: formData.name,
      role: "seller",
      storeName: formData.storeName,
    });

    if (result.success) {
      window.location.href = "/seller/dashboard";
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Background Gradients */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-rose-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="max-w-2xl mx-auto px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            href="/seller/login"
            className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Login
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-6 text-white"
          >
            <Store size={40} />
          </motion.div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
            <span className="text-foreground">Join as a</span>
            <br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Seller
            </span>
          </h1>

          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
            Start your journey and reach millions of customers on Aurora
          </p>
        </motion.div>

        {/* Signup Form */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="aurora-card p-8 mb-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Messages */}
            {(formError || error) && (
              <motion.div
                variants={itemVariants}
                className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3"
              >
                <AlertCircle
                  className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
                  size={20}
                />
                <p className="text-sm text-red-700 dark:text-red-300">
                  {formError || error}
                </p>
              </motion.div>
            )}

            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <User size={20} />
                Personal Information
              </h3>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-foreground placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  required
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-3.5 text-zinc-400"
                    size={20}
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-foreground placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    required
                  />
                </div>
              </motion.div>
            </div>

            {/* Store Information */}
            <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-700">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <Building2 size={20} />
                Store Information
              </h3>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Store Name *
                </label>
                <input
                  type="text"
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleChange}
                  placeholder="My Awesome Store"
                  className="w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-foreground placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  required
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Store Description
                </label>
                <textarea
                  name="storeDescription"
                  value={formData.storeDescription}
                  onChange={handleChange}
                  placeholder="Tell us about your store..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-foreground placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                />
              </motion.div>
            </div>

            {/* Password */}
            <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-700">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <Lock size={20} />
                Security
              </h3>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Password *
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-3.5 text-zinc-400"
                    size={20}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-foreground placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-3.5 text-zinc-400"
                    size={20}
                  />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-foreground placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Terms & Conditions */}
            <motion.div
              variants={itemVariants}
              className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-700"
            >
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500 mt-1"
                />
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              variants={itemVariants}
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <Check size={20} />
                  Create Seller Account
                </>
              )}
            </motion.button>

            {/* Login Link */}
            <motion.p
              variants={itemVariants}
              className="text-center text-zinc-600 dark:text-zinc-400"
            >
              Already have an account?{" "}
              <Link
                href="/seller/login"
                className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
              >
                Sign In
              </Link>
            </motion.p>
          </form>
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {[
            {
              icon: Shield,
              title: "Secure",
              desc: "Enterprise-grade security",
            },
            {
              icon: Check,
              title: "Easy Setup",
              desc: "Get started in minutes",
            },
            {
              icon: Store,
              title: "Low Fees",
              desc: "Competitive commission rates",
            },
          ].map((benefit, idx) => {
            const BenefitIcon = benefit.icon;
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="text-center p-4 rounded-lg border border-zinc-200 dark:border-zinc-800"
              >
                <BenefitIcon
                  className="mx-auto mb-2 text-indigo-600 dark:text-indigo-400"
                  size={28}
                />
                <p className="font-semibold text-foreground text-sm mb-1">
                  {benefit.title}
                </p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  {benefit.desc}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}

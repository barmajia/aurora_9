"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Store,
  BarChart3,
  Package,
  Users,
  TrendingUp,
  Shield,
  Globe,
  ArrowRight,
  CheckCircle,
  ArrowUp,
  Sparkles,
  ChevronRight,
  Play,
  Zap,
  Clock,
  Star,
  CheckCircle2,
} from "lucide-react";

const t = (key: string, fallback: string) => fallback;

const SELLER_FEATURES = [
  {
    icon: Package,
    title: "Product Management",
    description:
      "Upload, edit, and organize your products with inventory tracking and ASIN management.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Track sales, revenue, and customer insights with real-time analytics and reports.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Users,
    title: "Customer Insights",
    description:
      "Understand your customers with detailed profiles and purchase history analysis.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: TrendingUp,
    title: "Growth Tools",
    description:
      "Access factory connections and wholesale pricing to expand your business margins.",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Shield,
    title: "Secure Platform",
    description:
      "Enterprise-grade security with verified sellers and protected transactions.",
    color: "from-indigo-500 to-purple-500",
  },
  {
    icon: Globe,
    title: "Multi-Region Expansion",
    description:
      "Expand your business across regions with local support and multi-currency.",
    color: "from-rose-500 to-pink-500",
  },
];

const SELLER_STATS = [
  { number: "10K+", label: "Active Sellers" },
  { number: "50K+", label: "Products Listed" },
  { number: "$2M+", label: "Monthly Sales" },
  { number: "98%", label: "Seller Satisfaction" },
];

// Icon components mapped to each stat
const STAT_ICONS = [Users, Package, TrendingUp, CheckCircle];

const benefits = [
  {
    icon: <Package className="h-8 w-8" />,
    title: "Zero Commission on First 100 Sales",
    description: "Keep more of your revenue as you scale your store.",
    borderColor: "border-emerald-200 dark:border-emerald-800",
    shadowColor: "hover:shadow-emerald-500/10",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    color: "text-emerald-600 dark:text-emerald-400",
  },
  {
    icon: <HeadphonesIcon className="h-8 w-8" />,
    title: "24/7 Dedicated Seller Support",
    description: "Get help whenever you need it from our expert team.",
    borderColor: "border-blue-200 dark:border-blue-800",
    shadowColor: "hover:shadow-blue-500/10",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    color: "text-blue-600 dark:text-blue-400",
  },
  {
    icon: <Sparkles className="h-8 w-8" />,
    title: "Free Marketing Tools & Resources",
    description: "Access templates, ad credits, and growth guides.",
    borderColor: "border-purple-200 dark:border-purple-800",
    shadowColor: "hover:shadow-purple-500/10",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
    color: "text-purple-600 dark:text-purple-400",
  },
];

const steps = [
  {
    number: "01",
    icon: <Store className="h-8 w-8" />,
    title: "Create Your Account",
    description:
      "Sign up in minutes with your business details and verify your identity.",
  },
  {
    number: "02",
    icon: <Package className="h-8 w-8" />,
    title: "List Your Products",
    description:
      "Upload catalogs, set pricing, and configure inventory with our intuitive dashboard.",
  },
  {
    number: "03",
    icon: <TrendingUp className="h-8 w-8" />,
    title: "Start Selling",
    description:
      "Go live instantly, track performance, and scale globally with built-in tools.",
  },
];

const testimonials = [
  {
    rating: 5,
    content:
      "Aurora completely transformed our wholesale business. The analytics alone helped us increase margins by 40%.",
    avatar: "JD",
    name: "Jane Doe",
    role: "Founder, TechGadgets Co.",
  },
  {
    rating: 5,
    content:
      "The onboarding process was seamless. We went from zero to 500 monthly orders in under 30 days.",
    avatar: "MK",
    name: "Michael Kim",
    role: "Owner, StyleHouse",
  },
  {
    rating: 4,
    content:
      "Customer support is unmatched. Every time we had a question, it was resolved within hours.",
    avatar: "AL",
    name: "Amanda Lee",
    role: "Manager, EcoHome Supplies",
  },
];

// Placeholder for missing icon in benefits
function HeadphonesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>
  );
}

// Simple placeholder for FloatingParticles (replace with your actual implementation)
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-emerald-400/30 rounded-full animate-pulse"
          style={{
            top: `${20 + i * 15}%`,
            left: `${10 + i * 18}%`,
            animationDelay: `${i * 0.5}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function SellerPage() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Build stats with icons inside the component
  const stats = SELLER_STATS.map((stat, i) => ({
    ...stat,
    icon: STAT_ICONS[i],
  }));

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 overflow-hidden">
      {/* Scroll to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-8 right-8 z-50 p-3 rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:scale-110 hover:bg-emerald-700 ${
          isScrolled
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10 pointer-events-none"
        }`}
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-5 w-5" />
      </button>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-100 via-emerald-50 to-slate-100 dark:from-slate-900 dark:via-emerald-950 dark:to-slate-900 pt-16">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)] dark:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]" />
          <FloatingParticles />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl animate-pulse dark:bg-emerald-500/20" />
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-300/20 rounded-full blur-3xl animate-pulse dark:bg-teal-500/20"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-600px h-600px bg-emerald-200/10 rounded-full blur-3xl animate-pulse dark:bg-emerald-500/10"
            style={{ animationDelay: "2s" }}
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="max-w-5xl mx-auto text-center space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-100 dark:bg-emerald-500/10 backdrop-blur-md border border-emerald-300 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-sm font-medium mx-auto transition-all duration-300 hover:bg-emerald-200 dark:hover:bg-emerald-500/20 hover:scale-105 cursor-pointer">
              <Sparkles className="h-4 w-4 animate-spin-slow" />
              <span>
                {t("sellerWelcome.hero.badge", "Become a Seller on Aurora")}
              </span>
              <ChevronRight className="h-4 w-4" />
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-emerald-600 via-emerald-800 to-teal-600 dark:from-emerald-300 dark:via-white dark:to-teal-300 bg-clip-text text-transparent">
                {t("sellerWelcome.hero.title", "Sell to the World")}
              </span>
            </h1>

            <p className="text-lg md:text-2xl text-slate-600 dark:text-white/70 max-w-3xl mx-auto leading-relaxed">
              {t(
                "sellerWelcome.hero.subtitle",
                "Join thousands of successful sellers growing their business on Aurora. Reach global customers, manage your store, and scale with powerful tools.",
              )}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <button
                type="button"
                onClick={() => router.push("/seller/signup")}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-lg px-10 py-7 rounded-xl shadow-2xl shadow-emerald-500/30 transition-all duration-300 hover:scale-105 hover:shadow-emerald-500/40 flex items-center gap-2"
              >
                {t("sellerWelcome.hero.signupCta", "Sign Up as Seller")}
                <ArrowRight className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => router.push("/seller/login")}
                className="border-2 border-emerald-500/30 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-200 hover:bg-emerald-200 dark:hover:bg-emerald-500/20 text-lg px-10 py-7 rounded-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
              >
                <Play className="h-5 w-5" />
                {t("sellerWelcome.hero.loginCta", "Login as Seller")}
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-8 pt-8 text-slate-500 dark:text-white/60 text-sm">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                <span>
                  {t("sellerWelcome.hero.instantSetup", "Instant Setup")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>
                  {t("sellerWelcome.hero.securePayments", "Secure Payments")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>
                  {t("sellerWelcome.hero.support247", "24/7 Support")}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-emerald-500/30 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-emerald-400/60 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-slate-900 dark:to-emerald-950">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-slate-600 dark:text-slate-400 font-medium">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-white dark:bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              <span>
                {t("sellerWelcome.benefits.title", "Why Sell on Aurora")}
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              {t(
                "sellerWelcome.benefits.heading",
                "Everything You Need to Succeed",
              )}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              {t(
                "sellerWelcome.benefits.subheading",
                "Powerful tools, global reach, and dedicated support to grow your business.",
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className={`group p-8 rounded-2xl border-2 bg-white dark:bg-slate-800 ${benefit.borderColor} ${benefit.shadowColor} hover:-translate-y-2 hover:shadow-2xl transition-all duration-500`}
              >
                <div
                  className={`w-16 h-16 rounded-2xl ${benefit.bgColor} flex items-center justify-center ${benefit.color} mb-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6`}
                >
                  {benefit.icon}
                </div>
                <h3 className="font-semibold text-xl text-slate-900 dark:text-white mb-3">
                  {benefit.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gradient-to-br from-slate-100 via-emerald-50 to-slate-100 dark:from-slate-900 dark:via-emerald-950 dark:to-slate-900 text-slate-800 dark:text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-300/15 dark:bg-emerald-500/15 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-300/15 dark:bg-teal-500/15 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-white/10 backdrop-blur-md border border-emerald-300 dark:border-white/20 text-emerald-700 dark:text-white/90 text-sm font-medium mb-4">
              <TrendingUp className="h-4 w-4" />
              <span>{t("sellerWelcome.steps.title", "How It Works")}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white">
              {t(
                "sellerWelcome.steps.heading",
                "Start Selling in 3 Easy Steps",
              )}
            </h2>
            <p className="text-lg text-slate-600 dark:text-white/60">
              {t(
                "sellerWelcome.steps.subheading",
                "Getting started is simple. Be up and running in minutes.",
              )}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="relative group">
                <div className="absolute -top-4 -left-4 text-7xl font-black text-emerald-300/20 dark:text-emerald-500/10 group-hover:text-emerald-500/20 transition-colors duration-300">
                  {step.number}
                </div>

                <div className="relative p-8 rounded-2xl bg-white dark:bg-white/5 backdrop-blur-sm border border-slate-200 dark:border-white/10 hover:bg-emerald-50 dark:hover:bg-white/10 hover:border-emerald-500/30 transition-all duration-500 hover:-translate-y-2 h-full">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6 transition-all duration-300 group-hover:scale-110 group-hover:bg-emerald-500/30">
                    {step.icon}
                  </div>
                  <h3 className="font-semibold text-xl text-slate-900 dark:text-white mb-3">{step.title}</h3>
                  <p className="text-slate-600 dark:text-white/60 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-px bg-emerald-300/30 dark:bg-emerald-500/30" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white dark:bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-4">
              <Star className="h-4 w-4" />
              <span>
                {t("sellerWelcome.testimonials.title", "Success Stories")}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              {t(
                "sellerWelcome.testimonials.heading",
                "Loved by Sellers Worldwide",
              )}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              {t(
                "sellerWelcome.testimonials.subheading",
                "Hear from sellers who transformed their business with Aurora.",
              )}
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 p-8 md:p-12 text-white">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

              <div className="relative z-10">
                <div className="flex gap-1 mb-6">
                  {Array.from({
                    length: testimonials[activeTestimonial].rating,
                  }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-6 w-6 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                <blockquote className="text-xl md:text-2xl font-medium mb-8 leading-relaxed">
                  &ldquo;{testimonials[activeTestimonial].content}&rdquo;
                </blockquote>

                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-lg font-bold">
                    {testimonials[activeTestimonial].avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-lg">
                      {testimonials[activeTestimonial].name}
                    </div>
                    <div className="text-white/70">
                      {testimonials[activeTestimonial].role}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-8">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setActiveTestimonial(index)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index === activeTestimonial
                          ? "w-8 bg-white"
                          : "w-2 bg-white/40 hover:bg-white/60"
                      }`}
                      aria-label={`View testimonial ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Aurora Section */}
      <section className="py-24 bg-gradient-to-r from-slate-50 to-emerald-50 dark:from-slate-900 dark:to-emerald-950">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              {t(
                "sellerWelcome.why.title",
                "Why Choose Aurora for Your Business?",
              )}
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              {t(
                "sellerWelcome.why.subtitle",
                "A platform built for sellers, by people who understand e-commerce.",
              )}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center group">
              <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:scale-110 group-hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h3 className="font-semibold text-xl text-slate-900 dark:text-white mb-3">
                {t("sellerWelcome.why.verified", "Verified & Trusted")}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                {t(
                  "sellerWelcome.why.verifiedDesc",
                  "Build trust with verified seller badges and customer reviews.",
                )}
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:scale-110 group-hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="h-10 w-10" />
              </div>
              <h3 className="font-semibold text-xl text-slate-900 dark:text-white mb-3">
                {t("sellerWelcome.why.grow", "Scale Your Business")}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                {t(
                  "sellerWelcome.why.growDesc",
                  "From your first sale to thousands of orders, Aurora grows with you.",
                )}
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:scale-110 group-hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                <Globe className="h-10 w-10" />
              </div>
              <h3 className="font-semibold text-xl text-slate-900 dark:text-white mb-3">
                {t("sellerWelcome.why.global", "Sell Everywhere")}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                {t(
                  "sellerWelcome.why.globalDesc",
                  "Multi-currency, multi-language support to reach customers worldwide.",
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-50" />
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-medium mb-6">
              <Zap className="h-4 w-4" />
              <span>
                {t("sellerWelcome.cta.badge", "Ready to Get Started?")}
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {t("sellerWelcome.cta.title", "Start Your Selling Journey Today")}
            </h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              {t(
                "sellerWelcome.cta.subtitle",
                "Join thousands of sellers already growing their business on Aurora. Create your free account in minutes.",
              )}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                type="button"
                onClick={() => router.push("/seller/signup")}
                className="bg-white text-emerald-700 hover:bg-white/90 text-lg px-10 py-7 rounded-xl shadow-2xl shadow-black/20 transition-all duration-300 hover:scale-105 font-semibold flex items-center gap-2"
              >
                {t("sellerWelcome.cta.signupCta", "Create Seller Account")}
                <ArrowRight className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => router.push("/seller/login")}
                className="border-2 border-white/40 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 text-lg px-10 py-7 rounded-xl transition-all duration-300 hover:scale-105"
              >
                {t("sellerWelcome.cta.loginCta", "Sign In to Dashboard")}
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-6 pt-10 text-white/70 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>{t("sellerWelcome.cta.free", "Free to sign up")}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>
                  {t("sellerWelcome.cta.noCommitment", "No commitment")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>
                  {t("sellerWelcome.cta.cancelAnytime", "Cancel anytime")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer navigation links */}
      <section className="py-12 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10">
                <Store className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="font-semibold text-slate-900 dark:text-white">
                {t("sellerWelcome.footer.brand", "Aurora Seller Hub")}
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link
                href="/seller/signup"
                className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium"
              >
                {t("sellerWelcome.footer.signup", "Sign Up")}
              </Link>
              <Link
                href="/seller/login"
                className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium"
              >
                {t("sellerWelcome.footer.login", "Login")}
              </Link>
              <Link
                href="/"
                className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium"
              >
                {t("sellerWelcome.footer.marketplace", "Browse Marketplace")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

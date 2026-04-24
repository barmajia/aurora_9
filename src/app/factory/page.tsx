"use client";

import Link from "next/link";
import {
  Factory,
  Users,
  Package,
  MapPin,
  BarChart3,
  Shield,
  Globe,
  ArrowRight,

  ChevronRight,
  Clock,
  Award,
  ArrowUp,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

// Intersection Observer Hook for scroll animations
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isInView };
}

// Animated Counter Component
function AnimatedCounter({
  end,
  duration = 2000,
  suffix = "",
}: {
  end: number;
  duration?: number;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const { ref, isInView } = useInView();
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (isInView && !hasAnimated.current) {
      hasAnimated.current = true;
      let startTime: number;
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        setCount(Math.floor(progress * end));
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [isInView, end, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

// Floating Particles Component
function FloatingParticles() {
  const particles = useState(() => Array.from({ length: 25 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  })))[0];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-white/10"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animation: `float ${particle.duration}s ease-in-out ${particle.delay}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-30px) translateX(10px); }
          50% { transform: translateY(-60px) translateX(-10px); }
          75% { transform: translateY(-30px) translateX(15px); }
        }
      `}</style>
    </div>
  );
}

const FACTORY_FEATURES = [
  {
    icon: Package,
    title: "Product Catalog",
    description:
      "Showcase your products with detailed specifications, images, and wholesale pricing.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Users,
    title: "Seller Network",
    description:
      "Connect with verified sellers actively looking for quality manufacturers.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: MapPin,
    title: "Location-Based Discovery",
    description:
      "Sellers find your factory using geolocation search and proximity filters.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: BarChart3,
    title: "Order Analytics",
    description:
      "Track orders, production capacity, and fulfillment metrics in real-time.",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Shield,
    title: "Verified Factories",
    description:
      "Build trust with factory verification and authentic seller reviews.",
    color: "from-indigo-500 to-purple-500",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description:
      "Expand beyond local markets to national and international buyers.",
    color: "from-rose-500 to-pink-500",
  },
];

const FACTORY_STATS = [
  { number: "500+", label: "Verified Factories" },
  { number: "10K+", label: "Products Showcased" },
  { number: "$5M+", label: "Wholesale Volume" },
  { number: "95%", label: "On-Time Delivery" },
];

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Register & Verify",
    description:
      "Download the factory app and create your profile with license verification.",
  },
  {
    step: "2",
    title: "List Your Products",
    description:
      "Add your products with wholesale pricing and production capacity details.",
  },
  {
    step: "3",
    title: "Connect with Sellers",
    description: "Sellers discover your factory and send partnership requests.",
  },
  {
    step: "4",
    title: "Grow Your Business",
    description:
      "Fulfill orders and build long-term, profitable relationships.",
  },
];

const FACTORY_BENEFITS = [
  "Factory verification increases credibility",
  "24/7 dedicated manufacturing support",
  "Marketing to verified seller network",
  "Secure bulk order management",
];

export default function FactoryPage() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Scroll to top button */}
      <motion.button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-8 right-8 z-50 p-3 rounded-full bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 transition-all duration-300 hover:scale-110 ${isScrolled ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        animate={{ y: isScrolled ? 0 : 100 }}
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-5 w-5" />
      </motion.button>

      {/* ==================== HERO SECTION ==================== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-br from-slate-950 via-blue-950 to-indigo-950">
        {/* Animated Background */}
        <div className="absolute inset-0">
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]" />
          <FloatingParticles />
          {/* Gradient Orbs */}
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1.5s" }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-cyan-500/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "3s" }}
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full py-20">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-medium mx-auto hover:bg-white/15 hover:scale-105 transition-all"
            >
              <Factory className="h-4 w-4 text-blue-400" />
              <span>For Manufacturers & Producers</span>
              <ChevronRight className="h-4 w-4" />
            </motion.div>

            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
                <span className="bg-linear-to-r from-white via-blue-200 to-indigo-200 bg-clip-text text-transparent">
                  Power Your Factory
                </span>
                <br />
                <span className="bg-linear-to-r from-blue-300 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                  Reach the World
                </span>
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg md:text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed"
            >
              Join Aurora&apos;s manufacturing network. Manage production, connect
              with global buyers, and scale your operations with
              enterprise-grade tools.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
            >
              <Link href="/factory/signup">
                <button className="group flex items-center gap-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-lg px-8 py-4 rounded-xl shadow-2xl shadow-blue-500/25 transition-all duration-300 hover:scale-105 hover:shadow-blue-500/40 font-semibold">
                  Sign Up as Factory
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </button>
              </Link>
              <Link href="/factory/login">
                <button className="flex items-center gap-2 border-2 border-white/30 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 text-lg px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 font-semibold">
                  Login as Factory
                </button>
              </Link>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center gap-8 pt-8 text-white/60 text-sm"
            >
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Verified Factories</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span>Global Network</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>24/7 Support</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-white/60 rounded-full animate-pulse" />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-linear-to-b from-background to-zinc-50 dark:to-zinc-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {FACTORY_STATS.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-black bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
              Built for manufacturers
            </h2>
            <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto">
              Powerful platform designed specifically for factories to showcase
              products and manage wholesale orders.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FACTORY_FEATURES.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="aurora-card p-8 hover:shadow-lg transition-all duration-300 group"
                >
                  <div
                    className={`inline-flex p-4 bg-linear-to-br ${feature.color} rounded-xl mb-4 text-white group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-linear-to-b from-background to-zinc-50 dark:to-zinc-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
              How it works
            </h2>
            <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto">
              Simple 4-step process to start connecting with verified sellers.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative"
              >
                {/* Connector Line */}
                {idx < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-[60%] right-[-25%] h-1 bg-linear-to-r from-indigo-500 to-transparent" />
                )}

                <div className="aurora-card p-8 text-center">
                  <div className="w-12 h-12 rounded-full bg-linear-to-r from-indigo-600 to-purple-600 text-white font-bold flex items-center justify-center mx-auto mb-4 text-lg">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-linear-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-center text-white"
          >
            <h2 className="text-3xl sm:text-4xl font-black mb-4">
              Ready to grow your factory?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Join hundreds of manufacturers connecting with verified sellers on
              Aurora and expanding your wholesale business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/factory/signup"
                className="px-8 py-3 bg-white text-indigo-600 font-bold rounded-lg hover:bg-zinc-100 transition-colors"
              >
                Download Factory App
              </Link>
              <Link
                href="/factory/login"
                className="px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors"
              >
                Sign In to Dashboard
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

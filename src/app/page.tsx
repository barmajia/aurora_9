"use client";

import Link from "next/link";
import {
  ArrowRight,
  Star,
  Zap,
  Shield,
  Truck,
  RefreshCw,
  Award,
} from "lucide-react";
import { motion } from "framer-motion";

const FEATURES = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Ultra-fast performance with edge caching",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level encryption & protection",
  },
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders over $100 worldwide",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    description: "30-day money-back guarantee",
  },
  {
    icon: Award,
    title: "Premium Quality",
    description: "Handpicked premium products",
  },
];

const CATEGORIES = [
  { name: "Electronics", icon: "🖥️", color: "from-blue-500 to-cyan-500" },
  { name: "Fashion", icon: "👗", color: "from-pink-500 to-rose-500" },
  { name: "Home", icon: "🏠", color: "from-orange-500 to-amber-500" },
  { name: "Sports", icon: "⚽", color: "from-green-500 to-emerald-500" },
  { name: "Beauty", icon: "💄", color: "from-purple-500 to-pink-500" },
  { name: "Books", icon: "📚", color: "from-indigo-500 to-blue-500" },
];

const TESTIMONIALS = [
  {
    name: "Sarah Chen",
    role: "Verified Buyer",
    text: "Best shopping experience ever. Fast delivery and amazing product quality!",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Regular Customer",
    text: "Aurora never disappoints. Great prices and excellent customer service.",
    rating: 5,
  },
  {
    name: "Emma Davis",
    role: "First-time Buyer",
    text: "Easy checkout process, secure payment, and quick support response!",
    rating: 5,
  },
];

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-background">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-rose-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-full px-4 py-2 backdrop-blur-sm"
              >
                <span className="animate-pulse">✨</span>
                <span className="text-sm font-semibold text-indigo-400">
                  Discover Premium Products
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-tight text-white"
              >
                Your
                <br />
                <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Premium Shopping
                </span>
                <br />
                Destination
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-zinc-400 max-w-lg leading-relaxed"
              >
                Explore curated collections of premium products from trusted
                sellers worldwide. Quality, security, and excellence in every
                purchase.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/products"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                Shop Now
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center px-8 py-4 bg-zinc-800 border border-zinc-700 text-white font-bold rounded-xl hover:bg-zinc-700 transition-all duration-300"
              >
                Learn More
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-8 pt-4"
            >
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium text-zinc-400">
                  100% Secure
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium text-zinc-400">
                  Free Shipping
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-500" />
                <span className="text-sm font-medium text-zinc-400">
                  Premium Quality
                </span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative h-96 lg:h-full hidden lg:flex items-center justify-center"
          >
            <div className="relative w-full h-full max-w-md">
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute top-0 left-0 w-40 h-56 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-xl p-4 text-white"
              >
                <div className="text-sm font-semibold mb-2">Premium Deal</div>
                <div className="text-2xl font-black">50% OFF</div>
                <div className="text-xs mt-4">Selected Items</div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute bottom-0 right-0 w-40 h-56 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl shadow-xl p-4 text-white"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-300 text-yellow-300"
                    />
                  ))}
                </div>
                <div className="text-sm font-semibold mt-2">4.9/5 Rating</div>
                <div className="text-xs mt-4">50K+ Reviews</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function CategoriesSection() {
  return (
    <section className="py-20 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 text-white">
            Shop by Category
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Explore our curated collections across all major categories
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((category, idx) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group"
            >
              <Link href={`/products?category=${category.name.toLowerCase()}`}>
                <div
                  className={`bg-gradient-to-br ${category.color} p-8 rounded-2xl transition-all duration-300 group-hover:shadow-xl group-hover:scale-105 cursor-pointer`}
                >
                  <div className="text-5xl mb-4">{category.icon}</div>
                  <h3 className="text-white font-bold text-lg">
                    {category.name}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section className="py-20 bg-zinc-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 text-white">
            Why Shop at Aurora
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            We're committed to delivering excellence in every aspect of your
            shopping experience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-zinc-800 border border-zinc-700 p-8 rounded-2xl text-center hover:shadow-lg transition-all duration-300"
              >
                <div className="inline-flex p-4 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl mb-4">
                  <Icon className="h-8 w-8 text-indigo-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-zinc-400">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="py-20 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 text-white">
            Loved by Customers
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Join thousands of satisfied customers enjoying premium shopping
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial, idx) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-zinc-300 mb-4 italic">
                &quot;{testimonial.text}&quot;
              </p>
              <div className="border-t border-zinc-800 pt-4">
                <p className="font-bold text-white">{testimonial.name}</p>
                <p className="text-sm text-zinc-500">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function NewsletterSection() {
  return (
    <section className="py-20 bg-zinc-900">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-center text-white"
        >
          <h2 className="text-3xl sm:text-4xl font-black mb-4">
            Stay Updated with Exclusive Deals
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and get 15% off your first order
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-zinc-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <button className="px-8 py-3 bg-white text-indigo-600 font-bold rounded-lg hover:bg-zinc-100 transition-colors duration-300">
              Subscribe
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <HeroSection />
      <CategoriesSection />
      <FeaturesSection />
      <TestimonialsSection />
      <NewsletterSection />
    </div>
  );
}

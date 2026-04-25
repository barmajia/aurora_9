"use client";

import { motion } from "framer-motion";
import { Award, Globe, Shield, Cpu, Zap } from "lucide-react";
import { Button } from "@/components/ui";

export default function AboutPage() {
  const stats = [
    { label: "Active Nodes", value: "5.2k+" },
    { label: "Global Users", value: "125k+" },
    { label: "Verified Merchants", value: "850+" },
    { label: "Protocol Cycles", value: "24/7" },
  ];

  const values = [
    {
      icon: Shield,
      title: "Security Protocol",
      description:
        "Enterprise-grade encryption protecting the integrity of every ecosystem transaction.",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      icon: Cpu,
      title: "Neural Infrastructure",
      description:
        "Leveraging advanced computation to provide the fastest commerce experience on the edge.",
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
    },
    {
      icon: Zap,
      title: "Instant Latency",
      description:
        "Near-zero delay in logistics and data synchronization across our global network.",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      icon: Globe,
      title: "Universal Access",
      description:
        "A borderless commerce manifesto connecting premium sources with elite users.",
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground pt-32 pb-24 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(59,130,246,0.1),transparent_70%)] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-500px h-500px bg-blue-500/5 rounded-full blur-[120px] pointer-events-none animate-pulse" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-200/50 bg-zinc-50/50 dark:border-zinc-800/50 dark:bg-zinc-900/50 backdrop-blur-md mb-8"
          >
            <span className="flex h-2 w-2 rounded-full bg-blue-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-900 dark:text-white">
              The Aurora Manifesto
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.85] mb-8"
          >
            Evolving the <br />
            <span className="text-blue-600 dark:text-blue-400">
              Digital Interface
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 max-w-3xl mx-auto leading-relaxed"
          >
            Aurora isn&apos;t just an e-commerce platform. It&apos;s a
            high-performance ecosystem designed for the next generation of
            premium commerce and industrial-grade security.
          </motion.p>
        </div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-32"
        >
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="aurora-card p-10 text-center bg-zinc-50/50 dark:bg-zinc-900/50 group hover:border-blue-500/50 transition-all duration-500"
            >
              <div className="text-4xl md:text-5xl font-black italic tracking-tighter  mb-2 group-hover:scale-110 transition-transform duration-500">
                {stat.value}
              </div>
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Narrative Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase mb-8 leading-none">
              Our <span className="text-blue-500">Origin</span> <br /> Protocol
            </h2>
            <div className="space-y-6 text-zinc-500 dark:text-zinc-400 leading-relaxed text-lg">
              <p>
                Aurora was initiated from a critical need: the demand for a
                commerce interface that combines the raw power of industrial
                technology with the elegance of minimalist design.
              </p>
              <p>
                We engineered a platform that prioritizes security, speed, and
                user experience above all else. Every node in our network is
                optimized to ensure that the distance between a premium product
                and your doorstep is minimized to the lowest possible latency.
              </p>
            </div>
            <div className="mt-12">
              <Button className="h-14 px-10 rounded-2xl text-xs font-black uppercase tracking-widest">
                Initialize Connection
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square rounded-[3rem] overflow-hidden border border-zinc-200 dark:border-white/5 bg-zinc-100 dark:bg-zinc-900 relative p-8">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 dark:opacity-20" />
              <div className="h-full w-full rounded-[2rem] border border-zinc-200 dark:border-zinc-800 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-500/5 animate-pulse" />
                <Cpu size={120} className="text-zinc-200 dark:text-zinc-800" />
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="aurora-glass p-6 rounded-2xl border border-white/10">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 mb-2">
                      System Status
                    </p>
                    <p className="text-xs font-medium text-white/80 uppercase tracking-widest leading-relaxed">
                      Aurora Ecosystem active. 99.99% Uptime across 32 global
                      regions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Values Grid */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase mb-4">
              Core <span className="text-blue-500">Architectures</span>
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 uppercase tracking-widest text-[10px] font-black">
              The fundamental protocols that govern our ecosystem
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="aurora-card p-8 group hover:border-blue-500/50 transition-all duration-500 bg-white dark:bg-zinc-900/50 shadow-sm hover:shadow-xl"
              >
                <div
                  className={`w-14 h-14 ${value.bg} rounded-2xl flex items-center justify-center ${value.color} mb-8 group-hover:scale-110 transition-transform duration-500`}
                >
                  <value.icon size={28} />
                </div>
                <h3 className="text-lg font-black uppercase tracking-widest mb-4 italic italic">
                  {value.title}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed uppercase tracking-wider">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mission Statement */}
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-[4rem] overflow-hidden bg-zinc-900 p-16 md:p-24 text-center border border-white/5"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]" />
          <div className="relative z-10 max-w-4xl mx-auto">
            <div className="mb-8 flex justify-center">
              <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                <Award size={32} />
              </div>
            </div>
            <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase text-white mb-10 leading-[0.9]">
              To democratize{" "}
              <span className="text-blue-500">premium quality</span> through
              technical excellence.
            </h2>
            <p className="text-zinc-400 uppercase tracking-[0.3em] text-xs font-black">
              The Aurora Mission v4.0.0
            </p>
          </div>
        </motion.section>
      </div>
    </div>
  );
}

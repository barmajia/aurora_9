"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Send,
  Clock,
  HeadphonesIcon,
  Shield,
  ArrowRight,
  Zap
} from "lucide-react";
import { Button, Input } from "@/components/ui";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate secure protocol transmission
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setSent(true);
    setLoading(false);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Secure Email",
      value: "comms@aurora.network",
      description: "24/7 Priority Protocol",
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      icon: Phone,
      title: "Direct Uplink",
      value: "+1 (888) AURORA-0",
      description: "Mon-Fri 09:00 - 18:00 UTC",
      color: "text-indigo-500",
      bg: "bg-indigo-500/10"
    },
    {
      icon: MapPin,
      title: "HQ Node",
      value: "Innovation Sector 7\nSilicon Valley, CA 94025",
      description: "Global Operations Center",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground pt-32 pb-24 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(59,130,246,0.1),transparent_70%)] pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-200/50 bg-zinc-50/50 dark:border-zinc-800/50 dark:bg-zinc-900/50 backdrop-blur-md mb-8"
          >
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-900 dark:text-white">
              Communication Protocol
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase mb-6 leading-none"
          >
            Connect <span className="text-blue-600 dark:text-blue-400">With Aurora</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto uppercase tracking-widest font-medium"
          >
            Establish a secure connection with our technical support and merchant relations teams.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Contact Info - Left */}
          <div className="lg:col-span-5 space-y-6">
            <div className="mb-12">
               <h2 className="text-2xl font-black italic tracking-tighter uppercase mb-4">Support Infrastructure</h2>
               <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
                  Our ecosystem maintains 99.9% support availability. Select a communication channel 
                  below to initiate your query.
               </p>
            </div>

            {contactInfo.map((info, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="aurora-card p-8 group hover:border-blue-500/50 transition-all duration-500 bg-white dark:bg-zinc-900/50 shadow-sm"
              >
                <div className="flex items-start gap-6">
                  <div className={`w-12 h-12 ${info.bg} rounded-2xl flex items-center justify-center ${info.color} group-hover:scale-110 transition-transform duration-500`}>
                    <info.icon size={24} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest mb-1 italic">
                      {info.title}
                    </h3>
                    <p className="text-lg font-bold text-zinc-900 dark:text-white whitespace-pre-line mb-1">
                      {info.value}
                    </p>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                      {info.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Live Chat Card */}
            <motion.div
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.4 }}
               className="aurora-card p-8 bg-blue-600 text-white border-transparent overflow-hidden relative group"
            >
               <div className="absolute top-0 right-0 p-8 opacity-20 transform translate-x-4 -translate-y-4 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-700">
                  <MessageCircle size={100} />
               </div>
               <div className="relative z-10">
                  <h3 className="text-xl font-black italic tracking-tighter uppercase mb-2">Live Node Support</h3>
                  <p className="text-blue-100 text-xs font-medium uppercase tracking-widest mb-6">Real-time resolution with human agents.</p>
                  <Button variant="secondary" className="bg-white text-blue-600 hover:bg-zinc-100 h-12 px-8 rounded-xl font-black uppercase tracking-widest text-[10px]">
                     Initialize Chat
                  </Button>
               </div>
            </motion.div>
          </div>

          {/* Contact Form - Right */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="aurora-card p-10 md:p-16 bg-white dark:bg-zinc-900/50 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                 <Zap size={150} className="text-blue-500" />
              </div>

              {sent ? (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-20"
                  >
                    <div className="w-24 h-24 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-emerald-500/20">
                      <Send className="text-emerald-500" size={40} />
                    </div>
                    <h3 className="text-4xl font-black italic tracking-tighter uppercase mb-4">Protocol Transmitted</h3>
                    <p className="text-zinc-500 dark:text-zinc-400 uppercase tracking-widest text-sm font-medium">
                      Your query has been logged in our secure database. <br />
                      Response expected within 1 operational cycle.
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-12 h-14 px-10 rounded-2xl text-[10px] font-black uppercase tracking-widest"
                      onClick={() => setSent(false)}
                    >
                      New Transmission
                    </Button>
                  </motion.div>
                </AnimatePresence>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 ml-2">Operator Name</label>
                       <Input
                         value={form.name}
                         onChange={(e) => setForm({ ...form, name: e.target.value })}
                         placeholder="Enter your name"
                         className="h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-white/5"
                         required
                       />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 ml-2">Secure Email</label>
                       <Input
                         type="email"
                         value={form.email}
                         onChange={(e) => setForm({ ...form, email: e.target.value })}
                         placeholder="operator@network.com"
                         className="h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-white/5"
                         required
                       />
                    </div>
                  </div>

                  <div className="space-y-3">
                     <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 ml-2">Protocol Subject</label>
                     <Input
                       value={form.subject}
                       onChange={(e) => setForm({ ...form, subject: e.target.value })}
                       placeholder="What is your query regarding?"
                       className="h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-white/5"
                       required
                     />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 ml-2">
                      Message Data
                    </label>
                    <textarea
                      value={form.message}
                      onChange={(e) =>
                        setForm({ ...form, message: e.target.value })
                      }
                      rows={6}
                      className="w-full px-6 py-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-[2rem] text-sm text-zinc-900 dark:text-white placeholder:text-zinc-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none transition-all"
                      placeholder="Input your transmission data here..."
                      required
                    />
                  </div>

                  <div className="pt-4">
                     <Button
                       type="submit"
                       className="w-full h-16 rounded-[2rem] text-xs font-black uppercase tracking-[0.2em] group"
                       isLoading={loading}
                     >
                       Execute Transmission
                       <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                     </Button>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-[8px] font-black uppercase tracking-[0.4em] text-zinc-400 mt-8">
                     <Shield size={12} className="text-blue-500" />
                     <span>End-to-End Encrypted Transmission Active</span>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

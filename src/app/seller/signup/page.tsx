"use client";

import Link from "next/link";
import { ArrowLeft, Download, Apple, Monitor, Smartphone } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";

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

export default function SellerDownloadPage() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const router = useRouter();

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

  const bgClass =
    theme === "light"
      ? "bg-white dark:bg-white"
      : "bg-slate-950 dark:bg-slate-950";

  const textClass = theme === "light" ? "text-slate-900" : "text-white";
  const subtextClass = theme === "light" ? "text-slate-600" : "text-white/60";
  const cardBgClass = theme === "light" ? "bg-white/50 border-black/10 text-slate-900" : "bg-white/5 border-white/10 text-white";
  const iconBgClass = theme === "light" ? "bg-black/5" : "bg-white/10";
  const buttonClass = theme === "light" ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20" : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20";

  return (
    <div className={`min-h-screen relative overflow-hidden flex flex-col items-center justify-center pt-24 pb-12 transition-colors duration-300 ${bgClass}`}>
      <BackgroundGradients theme={theme} />
      <TopNav
        theme={theme}
        onThemeToggle={() => setTheme(theme === "light" ? "dark" : "light")}
      />

      <div className="max-w-5xl mx-auto px-6 lg:px-8 w-full z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className={`inline-flex p-4 backdrop-blur-md rounded-3xl shadow-inner border mb-6 ${theme === "light" ? "bg-black/5 border-black/10" : "bg-white/5 border-white/20"}`}
          >
            <Download className="h-12 w-12 text-emerald-400 mx-auto" />
          </motion.div>

          <h1 className={`text-4xl sm:text-6xl font-black tracking-tight mb-6 ${theme === "light" ? "text-slate-900" : "bg-gradient-to-br from-white to-white/70 bg-clip-text text-transparent"}`}>
            Download the
            <br />
            Seller App
          </h1>

          <p className={`text-lg sm:text-xl max-w-2xl mx-auto font-medium leading-relaxed ${subtextClass}`}>
            Manage your store, track orders, and reach millions of customers directly from your device. Download the Aurora Seller App today.
          </p>
        </motion.div>

        {/* Download Options */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          {[
            {
              icon: Apple,
              title: "macOS",
              desc: "For Mac computers",
              buttonText: "Download for Mac",
            },
            {
              icon: Monitor,
              title: "Windows",
              desc: "For Windows PCs",
              buttonText: "Download for Windows",
            },
            {
              icon: Smartphone,
              title: "Mobile",
              desc: "For iOS & Android",
              buttonText: "Get the Mobile App",
            },
          ].map((platform, idx) => {
            const PlatformIcon = platform.icon;
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                className={`p-8 flex flex-col items-center text-center group hover:-translate-y-2 transition-transform duration-300 backdrop-blur-xl border rounded-[2.5rem] shadow-2xl ${cardBgClass}`}
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ${iconBgClass}`}>
                  <PlatformIcon className={textClass} size={32} />
                </div>
                <h3 className={`text-2xl font-black mb-2 ${textClass}`}>
                  {platform.title}
                </h3>
                <p className={`mb-8 flex-grow font-medium ${subtextClass}`}>
                  {platform.desc}
                </p>
                <button className={`w-full py-4 px-4 text-lg font-bold rounded-2xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${buttonClass}`}>
                  <Download size={20} />
                  {platform.buttonText}
                </button>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}

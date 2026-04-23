"use client";

import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function ThemeSwitcher({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Hydration check - set mounted flag
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return (
      <div
        className={cn(
          "relative w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 overflow-hidden",
          "bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800",
          "text-zinc-500 dark:text-zinc-400",
          className,
        )}
      >
        <Sun size={18} />
      </div>
    );
  }

  const currentTheme = resolvedTheme ?? theme;

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
      className={cn(
        "relative w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 overflow-hidden",
        "bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800",
        "text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white",
        className,
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        {currentTheme === "dark" ? (
          <motion.div
            key="moon"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Moon size={18} />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Sun size={18} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

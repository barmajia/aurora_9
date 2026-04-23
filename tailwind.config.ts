import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          hover: "var(--primary-hover)",
        },
        secondary: "var(--secondary)",
        accent: "var(--accent)",
        "card-bg": "var(--card-bg)",
        glass: {
          bg: "var(--glass-bg)",
          border: "var(--glass-border)",
        },
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        glass: "var(--glass-shadow)",
        premium: "0 1px 3px rgba(0,0,0,0.02), 0 20px 50px rgba(0,0,0,0.05)",
        hover: "0 1px 3px rgba(0,0,0,0.02), 0 30px 60px rgba(0,0,0,0.1)",
      },
      animation: {
        float: "float 5s ease-in-out infinite",
        reveal: "fade-in-up 1s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        marquee: "marquee 30s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      backgroundImage: {
        "gradient-radial-top":
          "radial-gradient(circle at top left, rgba(59, 130, 246, 0.12), transparent 20%)",
        "gradient-radial-bottom":
          "radial-gradient(circle at bottom right, rgba(16, 185, 129, 0.08), transparent 25%)",
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
export default config;

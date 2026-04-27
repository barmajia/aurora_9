"use client";

import { forwardRef, useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";
import { Globe } from "lucide-react";

const languages = [
  { code: "en", label: "EN", name: "English" },
  { code: "es", label: "ES", name: "Español" },
  { code: "fr", label: "FR", name: "Français" },
  { code: "ar", label: "AR", name: "العربية" },
  { code: "zh", label: "中", name: "中文" },
  { code: "de", label: "DE", name: "Deutsch" },
  { code: "ja", label: "日本語", name: "日本語" },
  { code: "pt", label: "PT", name: "Português" },
  { code: "ru", label: "RU", name: "Русский" },
  { code: "hi", label: "HI", name: "हिन्दी" },
];

export const LanguageSwitcher = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className = "", ...props }, ref) => {
  const { t } = useTranslation();
  const [currentLang, setCurrentLang] = useState(() => i18n.language || "en");

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setCurrentLang(langCode);
  };

  const currentLanguage = languages.find((l) => l.code === currentLang) || languages[0];

  return (
    <div
      ref={ref}
      className={`relative group ${className}`}
      {...props}
    >
      <button className="inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white/90 px-3 py-2 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-100">
        <Globe size={16} className="mr-2" />
        {currentLanguage.label}
      </button>
      <div className="absolute right-0 top-full mt-2 w-40 rounded-xl border border-zinc-200 bg-white shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
        <div className="py-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-zinc-100 transition-colors ${
                currentLang === lang.code ? "font-semibold text-blue-600" : "text-zinc-700"
              }`}
            >
              {lang.label} - {lang.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});

LanguageSwitcher.displayName = "LanguageSwitcher";

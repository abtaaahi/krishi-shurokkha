"use client";

import { createContext, useContext, useState, useEffect } from "react";

type Lang = "bn" | "en";

const LanguageContext = createContext<{
  lang: Lang;
  setLang: (lang: Lang) => void;
}>({
  lang: "bn",
  setLang: () => {},
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  // Read from localStorage first for initial state (avoid setState in useEffect)
  const getInitialLang = (): Lang => {
    if (typeof window === "undefined") return "bn"; // SSR fallback
    const saved = localStorage.getItem("global_lang");
    return saved === "bn" || saved === "en" ? saved : "bn";
  };

  const [lang, setLang] = useState<Lang>(getInitialLang);

  // Sync to localStorage whenever lang changes
  useEffect(() => {
    localStorage.setItem("global_lang", lang);
  }, [lang]);

  const switchLang = (l: Lang) => {
    setLang(l);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: switchLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

"use client";

import { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext({
  lang: "bn",
  setLang: (lang: string) => {},
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState("bn");

  useEffect(() => {
    const saved = localStorage.getItem("global_lang");
    if (saved) setLang(saved);
  }, []);

  const switchLang = (l: string) => {
    setLang(l);
    localStorage.setItem("global_lang", l);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: switchLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

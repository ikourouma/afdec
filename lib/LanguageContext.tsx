"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import en from "./dictionaries/en.json";
import fr from "./dictionaries/fr.json";

type Language = "en" | "fr";
type Dictionary = typeof en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: () => "",
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<Language>("en");

  // Load language from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("afdec_lang") as Language;
    if (saved === "en" || saved === "fr") {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("afdec_lang", lang);
  };

  // Safe dot-notation object parsing helper for deeply nested JSON
  const t = (path: string): string => {
    const keys = path.split(".");
    let current: any = language === "fr" ? fr : en;
    
    for (const key of keys) {
      if (current[key] === undefined) {
        console.warn(`Translation missing for key: ${path} in ${language}`);
        return path; // Fallback to key path if missing
      }
      current = current[key];
    }
    
    return current as string;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

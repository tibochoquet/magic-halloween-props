"use client";

import { createContext, useContext, useState, useEffect } from "react";

export type Language = "nl" | "en";

interface LanguageContextValue {
  language: Language;
  setLanguage: (l: Language) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("nl");

  useEffect(() => {
    const saved = localStorage.getItem("lang") as Language | null;
    if (saved === "nl" || saved === "en") setLanguageState(saved);
  }, []);

  function setLanguage(l: Language) {
    setLanguageState(l);
    localStorage.setItem("lang", l);
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be inside LanguageProvider");
  return ctx;
}

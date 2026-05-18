"use client";

import { useLanguage } from "@/context/LanguageContext";
import { nl } from "@/locales/nl";
import { en } from "@/locales/en";

export function useTranslation() {
  const { language } = useLanguage();
  return language === "nl" ? nl : en;
}

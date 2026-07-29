"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { fr, type Dict } from "./fr";
import { en } from "./en";

export type Lang = "fr" | "en";

const dicts: Record<Lang, Dict> = { fr, en };
const STORAGE_KEY = "buildnivo.lang";

interface I18nContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  /** Dictionnaire typé : d.pointage.title */
  d: Dict;
  /** Accès dynamique : t("trades.grosOeuvre") */
  t: (path: string) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "fr" || saved === "en") setLangState(saved);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    window.localStorage.setItem(STORAGE_KEY, l);
    document.documentElement.lang = l;
  }, []);

  const value = useMemo<I18nContextValue>(() => {
    const d = dicts[lang];
    const t = (path: string): string => {
      const out = path
        .split(".")
        .reduce<unknown>((acc, key) => (acc && typeof acc === "object" ? (acc as Record<string, unknown>)[key] : undefined), d);
      return typeof out === "string" ? out : path;
    };
    return { lang, setLang, d, t };
  }, [lang, setLang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

export function fmtEuro(n: number, lang: Lang, compact = false): string {
  return new Intl.NumberFormat(lang === "fr" ? "fr-FR" : "en-GB", {
    style: "currency",
    currency: "EUR",
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: compact ? 2 : 0,
  }).format(n);
}

export function fmtDate(iso: string, lang: Lang, opts?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat(lang === "fr" ? "fr-FR" : "en-GB", {
    day: "numeric",
    month: "short",
    ...opts,
  }).format(new Date(iso + (iso.length === 10 ? "T12:00:00" : "")));
}

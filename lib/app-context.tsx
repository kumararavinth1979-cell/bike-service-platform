"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DICTIONARIES, type Dictionary, type Lang } from "@/lib/i18n/dictionary";

type Theme = "light" | "dark";

interface AppContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
  t: Dictionary;
}

const AppContext = createContext<AppContextValue | null>(null);

function readStored<T extends string>(key: string, valid: readonly T[], fallback: T): T {
  try {
    const v = window.localStorage.getItem(key) as T | null;
    return v && valid.includes(v) ? v : fallback;
  } catch {
    return fallback;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const [theme, setThemeState] = useState<Theme>("light");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setLangState(readStored("bsp.lang", ["en", "ta"] as const, "en"));
    setThemeState(readStored("bsp.theme", ["light", "dark"] as const, "light"));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.lang = lang;
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [lang, theme, ready]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem("bsp.lang", l);
    } catch {
      // ignore
    }
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    try {
      window.localStorage.setItem("bsp.theme", t);
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({ lang, setLang, theme, setTheme, t: DICTIONARIES[lang] }),
    [lang, setLang, theme, setTheme],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}

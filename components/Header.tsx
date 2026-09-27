"use client";

import Link from "next/link";
import { useApp } from "@/lib/app-context";

export function Header() {
  const { t, lang, setLang, theme, setTheme } = useApp();
  return (
    <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white/90 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="text-base font-semibold tracking-tight">
          {t.appName}
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setLang(lang === "en" ? "ta" : "en")}
            aria-label={t.language}
            className="rounded-md border border-neutral-300 px-2.5 py-1 text-sm hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
          >
            {lang === "en" ? "தமிழ்" : "English"}
          </button>
          <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={t.theme}
            className="rounded-md border border-neutral-300 px-2.5 py-1 text-sm hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
          >
            {theme === "dark" ? t.light : t.dark}
          </button>
        </div>
      </div>
    </header>
  );
}

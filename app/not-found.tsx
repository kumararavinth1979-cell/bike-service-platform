"use client";

import Link from "next/link";
import { useApp } from "@/lib/app-context";

export default function NotFound() {
  const { t } = useApp();
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 text-center">
      <p className="text-sm text-neutral-500">{t.notFound}</p>
      <Link href="/" className="mt-4 inline-block text-sm text-teal-700 underline dark:text-teal-400">
        {t.back}
      </Link>
    </div>
  );
}

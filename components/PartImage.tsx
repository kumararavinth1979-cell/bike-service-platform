"use client";

import { useState } from "react";
import Image from "next/image";
import { useApp } from "@/lib/app-context";

export function PartImage({ src, alt }: { src: string; alt: string }) {
  const { t } = useApp();
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-lg border border-neutral-300 bg-neutral-100 text-sm text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900">
        {t.imageError}
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      width={480}
      height={480}
      onError={() => setFailed(true)}
      className="aspect-square w-full rounded-lg border border-neutral-200 object-cover dark:border-neutral-800"
      sizes="(min-width: 1024px) 320px, 90vw"
      priority
    />
  );
}

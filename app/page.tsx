"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { searchBikes } from "@/lib/data/bikes";
import { useApp } from "@/lib/app-context";

export default function HomePage() {
  const { t } = useApp();
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchBikes(query), [query]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof results>();
    for (const bike of results) {
      const list = map.get(bike.brand) ?? [];
      list.push(bike);
      map.set(bike.brand, list);
    }
    return Array.from(map.entries());
  }, [results]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <label className="block text-sm font-medium" htmlFor="bike-search">
        {t.selectBike}
      </label>
      <input
        id="bike-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t.searchPlaceholder}
        className="mt-2 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-base outline-none focus:border-teal-600 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:border-teal-500"
      />

      {grouped.length === 0 ? (
        <p className="mt-8 text-center text-sm text-neutral-500">{t.noResults}</p>
      ) : (
        <div className="mt-6 space-y-6">
          {grouped.map(([brand, bikes]) => (
            <section key={brand}>
              <h2 className="text-sm font-semibold text-neutral-600 dark:text-neutral-400">
                {brand}
              </h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {bikes.map((bike) => (
                  <Link
                    key={bike.slug}
                    href={`/bike/${bike.slug}`}
                    className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm hover:border-teal-600 hover:text-teal-700 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-teal-500 dark:hover:text-teal-400"
                  >
                    {bike.model}
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

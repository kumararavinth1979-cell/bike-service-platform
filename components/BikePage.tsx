"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Bike, PartId, ServiceAction, ServiceRecord } from "@/lib/types";
import { partsForBike } from "@/lib/data/parts";
import { attentionItems, bikeActionStatuses } from "@/lib/service/status";
import { loadOdometers, loadRecords, saveOdometer, saveRecord } from "@/lib/storage";
import { useApp } from "@/lib/app-context";
import { PartPanel } from "./PartPanel";
import { ReminderList } from "./ReminderList";

const BikeViewer = dynamic(
  () => import("@/components/viewer/BikeViewer").then((m) => m.BikeViewer),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800" />
    ),
  },
);

export function BikePage({ bike }: { bike: Bike }) {
  const { t, theme } = useApp();
  const parts = useMemo(() => partsForBike(bike), [bike]);
  const [selected, setSelected] = useState<PartId | null>(null);
  const [anchors, setAnchors] = useState<Partial<Record<PartId, [number, number, number]>>>({});
  const [resetSignal, setResetSignal] = useState(0);
  const [records, setRecords] = useState<ServiceRecord[]>([]);
  const [odometer, setOdometer] = useState<number | null>(null);

  useEffect(() => {
    setRecords(loadRecords());
    setOdometer(loadOdometers()[bike.slug] ?? null);
    setSelected(null);
  }, [bike.slug]);

  const statuses = useMemo(
    () => bikeActionStatuses(bike, parts, records, odometer),
    [bike, parts, records, odometer],
  );
  const attention = useMemo(() => attentionItems(statuses), [statuses]);
  const selectedPart = parts.find((p) => p.id === selected) ?? null;
  const selectedStatuses = useMemo(
    () => statuses.filter((s) => s.partId === selected),
    [statuses, selected],
  );

  const onAnchors = useCallback(
    (a: Partial<Record<PartId, [number, number, number]>>) => setAnchors(a),
    [],
  );

  const handleOdometer = (km: number) => {
    setOdometer(km);
    saveOdometer(bike.slug, km);
  };

  const handleMark = (partId: PartId, action: ServiceAction) => {
    const recs = saveRecord({
      bikeSlug: bike.slug,
      partId,
      action,
      odometerKm: odometer ?? 0,
      dateISO: new Date().toISOString(),
    });
    setRecords(recs);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-4">
      <nav className="text-sm">
        <Link href="/" className="text-teal-700 hover:underline dark:text-teal-400">
          {t.back}
        </Link>
        <span className="mx-2 text-neutral-400">/</span>
        <span className="font-medium">
          {bike.brand} {bike.model}
        </span>
      </nav>

      <div className="mt-3 grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="relative h-[46vh] min-h-[320px] overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 lg:h-[68vh]">
          <BikeViewer
            bike={bike}
            selected={selected}
            onSelect={setSelected}
            anchors={anchors}
            onAnchors={onAnchors}
            resetSignal={resetSignal}
            fallbackText={t.viewerError}
            dark={theme === "dark"}
          />
          <button
            type="button"
            onClick={() => setResetSignal((n) => n + 1)}
            className="absolute right-2 top-2 rounded-md border border-neutral-300 bg-white/90 px-2.5 py-1 text-xs hover:bg-white dark:border-neutral-700 dark:bg-neutral-900/90 dark:hover:bg-neutral-800"
          >
            {t.resetView}
          </button>
          <p className="pointer-events-none absolute bottom-2 left-2 text-[11px] text-neutral-500 dark:text-neutral-400">
            {t.modelNote}
          </p>
        </section>

        <aside className="space-y-4">
          <section className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
            <h2 className="text-sm font-semibold">{t.parts}</h2>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {parts.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelected(p.id === selected ? null : p.id)}
                  aria-pressed={selected === p.id}
                  className={`rounded-full border px-2.5 py-1 text-xs ${
                    selected === p.id
                      ? "border-teal-700 bg-teal-700 text-white dark:border-teal-500 dark:bg-teal-600"
                      : "border-neutral-300 hover:border-teal-700 dark:border-neutral-700 dark:hover:border-teal-500"
                  }`}
                >
                  {t.partsNames[p.id]}
                </button>
              ))}
            </div>
            {!selectedPart && (
              <p className="mt-3 text-xs text-neutral-500">{t.tapPartHint}</p>
            )}
          </section>

          <ReminderList items={attention} onSelect={setSelected} />

          {selectedPart && (
            <PartPanel
              part={selectedPart}
              statuses={selectedStatuses}
              odometer={odometer}
              onOdometer={handleOdometer}
              onMark={handleMark}
            />
          )}

          <p className="px-1 text-[11px] text-neutral-500">{t.typicalNote}</p>
        </aside>
      </div>
    </div>
  );
}

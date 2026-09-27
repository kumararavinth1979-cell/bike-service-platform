"use client";

import type { PartDef, PartId, ServiceAction } from "@/lib/types";
import type { ActionStatus } from "@/lib/service/status";
import { useApp } from "@/lib/app-context";
import { PartImage } from "./PartImage";
import { StatusChip } from "./StatusChip";

const DAY = 86400000;

function fmtDate(iso: string, lang: string): string {
  return new Date(iso).toLocaleDateString(lang === "ta" ? "ta-IN" : "en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function intervalText(
  def: ActionStatus["def"],
  t: ReturnType<typeof useApp>["t"],
): string {
  if (def.condition) return t.whenWorn;
  const bits: string[] = [];
  if (def.intervalKm) bits.push(`${def.intervalKm.toLocaleString("en-IN")} ${t.km}`);
  if (def.intervalMonths) bits.push(`${def.intervalMonths} ${t.months}`);
  return bits.length ? bits.join(" / ") : "—";
}

export function PartPanel({
  part,
  statuses,
  odometer,
  onOdometer,
  onMark,
}: {
  part: PartDef;
  statuses: ActionStatus[];
  odometer: number | null;
  onOdometer: (km: number) => void;
  onMark: (partId: PartId, action: ServiceAction) => void;
}) {
  const { t, lang } = useApp();
  const name = t.partsNames[part.id];

  return (
    <section className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
      <h2 className="text-lg font-semibold">{name}</h2>
      <div className="mt-3">
        <PartImage src={part.image} alt={name} />
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        <label htmlFor="odometer" className="text-sm text-neutral-600 dark:text-neutral-400">
          {t.odometer}
        </label>
        <input
          id="odometer"
          type="number"
          inputMode="numeric"
          min={0}
          value={odometer ?? ""}
          onChange={(e) => onOdometer(Number(e.target.value) || 0)}
          className="w-28 rounded-md border border-neutral-300 bg-white px-2 py-1 text-right text-sm dark:border-neutral-700 dark:bg-neutral-950"
        />
      </div>

      <div className="mt-4 space-y-3">
        {statuses.map((st) => {
          const dueKm =
            st.def.intervalKm && st.last ? st.last.odometerKm + st.def.intervalKm : null;
          const dueDate =
            st.def.intervalMonths && st.last
              ? new Date(new Date(st.last.dateISO).getTime() + st.def.intervalMonths * 30 * DAY)
              : null;
          return (
            <div key={st.action} className="border-t border-neutral-200 pt-3 dark:border-neutral-800">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium">{t.actions[st.action]}</p>
                  <p className="text-xs text-neutral-500">
                    {t.interval}: {intervalText(st.def, t)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {st.last ? (
                    <StatusChip status={st.status} />
                  ) : (
                    <span className="text-xs text-neutral-500">{t.noRecord}</span>
                  )}
                  <button
                    type="button"
                    onClick={() => onMark(part.id, st.action)}
                    className="rounded-md bg-teal-700 px-2.5 py-1 text-xs font-medium text-white hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700"
                  >
                    {t.markServiced}
                  </button>
                </div>
              </div>
              {st.last && (
                <p className="mt-1 text-xs text-neutral-500">
                  {t.lastService}: {fmtDate(st.last.dateISO, lang)} ·{" "}
                  {st.last.odometerKm.toLocaleString("en-IN")} {t.km}
                  {dueKm !== null || dueDate !== null ? (
                    <>
                      {" · "}
                      {t.nextService}:{" "}
                      {[
                        dueKm !== null ? `${dueKm.toLocaleString("en-IN")} ${t.km}` : null,
                        dueDate !== null ? fmtDate(dueDate.toISOString(), lang) : null,
                      ]
                        .filter(Boolean)
                        .join(" / ")}
                    </>
                  ) : null}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

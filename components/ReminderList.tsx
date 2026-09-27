"use client";

import type { PartId } from "@/lib/types";
import type { ActionStatus } from "@/lib/service/status";
import { useApp } from "@/lib/app-context";
import { StatusChip } from "./StatusChip";

export function ReminderList({
  items,
  onSelect,
}: {
  items: ActionStatus[];
  onSelect: (id: PartId) => void;
}) {
  const { t } = useApp();
  if (items.length === 0) return null;
  return (
    <section className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
      <h2 className="text-sm font-semibold">{t.reminders}</h2>
      <ul className="mt-2 space-y-1">
        {items.map((st) => (
          <li key={`${st.partId}-${st.action}`}>
            <button
              type="button"
              onClick={() => onSelect(st.partId)}
              className="flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <span>
                {t.partsNames[st.partId]} · {t.actions[st.action]}
              </span>
              <StatusChip status={st.status} />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

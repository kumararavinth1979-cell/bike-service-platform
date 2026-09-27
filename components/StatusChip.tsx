"use client";

import { useApp } from "@/lib/app-context";
import type { ServiceStatus } from "@/lib/types";

const STYLES: Record<ServiceStatus, string> = {
  ok: "bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
  "due-soon": "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  due: "bg-orange-200 text-orange-900 dark:bg-orange-900/50 dark:text-orange-300",
  overdue: "bg-red-200 text-red-900 dark:bg-red-900/50 dark:text-red-300",
};

export function StatusChip({ status }: { status: ServiceStatus }) {
  const { t } = useApp();
  const label =
    status === "overdue"
      ? t.statusOverdue
      : status === "due"
        ? t.statusDue
        : status === "due-soon"
          ? t.statusDueSoon
          : t.statusOk;
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STYLES[status]}`}>
      {label}
    </span>
  );
}

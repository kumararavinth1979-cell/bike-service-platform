import type {
  Bike,
  PartDef,
  ServiceAction,
  ServiceActionDef,
  ServiceRecord,
  ServiceStatus,
} from "@/lib/types";

const DAY = 86400000;

export interface ActionStatus {
  partId: PartDef["id"];
  action: ServiceAction;
  def: ServiceActionDef;
  last?: ServiceRecord;
  status: ServiceStatus;
  kmLeft?: number;
  daysLeft?: number;
}

function rank(s: ServiceStatus): number {
  return s === "overdue" ? 3 : s === "due" ? 2 : s === "due-soon" ? 1 : 0;
}

export function computeActionStatus(
  part: PartDef,
  def: ServiceActionDef,
  records: ServiceRecord[],
  bikeSlug: string,
  odometer: number | null,
): ActionStatus {
  const last = records
    .filter((r) => r.bikeSlug === bikeSlug && r.partId === part.id && r.action === def.action)
    .sort((a, b) => b.dateISO.localeCompare(a.dateISO))[0];

  if (!last) {
    return { partId: part.id, action: def.action, def, status: "ok" };
  }

  let kmLeft: number | undefined;
  let daysLeft: number | undefined;

  if (def.intervalKm && odometer !== null) {
    kmLeft = last.odometerKm + def.intervalKm - odometer;
  }
  if (def.intervalMonths) {
    const dueAt = new Date(last.dateISO).getTime() + def.intervalMonths * 30 * DAY;
    daysLeft = Math.round((dueAt - Date.now()) / DAY);
  }

  let status: ServiceStatus = "ok";
  const kmOver = kmLeft !== undefined && kmLeft <= 0;
  const dayOver = daysLeft !== undefined && daysLeft <= 0;
  const kmNear = kmLeft !== undefined && kmLeft <= 500;
  const dayNear = daysLeft !== undefined && daysLeft <= 21;

  if (kmOver || dayOver) status = "overdue";
  else if (kmNear || dayNear) status = "due";
  else if ((kmLeft !== undefined && kmLeft <= 1000) || (daysLeft !== undefined && daysLeft <= 45))
    status = "due-soon";

  return { partId: part.id, action: def.action, def, last, status, kmLeft, daysLeft };
}

export function bikeActionStatuses(
  bike: Bike,
  parts: PartDef[],
  records: ServiceRecord[],
  odometer: number | null,
): ActionStatus[] {
  const out: ActionStatus[] = [];
  for (const part of parts) {
    for (const def of part.actions(bike)) {
      out.push(computeActionStatus(part, def, records, bike.slug, odometer));
    }
  }
  return out;
}

export function attentionItems(statuses: ActionStatus[]): ActionStatus[] {
  return statuses
    .filter((s) => rank(s.status) >= 2)
    .sort((a, b) => rank(b.status) - rank(a.status));
}

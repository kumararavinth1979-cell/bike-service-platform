import type { ServiceRecord } from "@/lib/types";

const RECORDS_KEY = "bsp.records.v1";
const ODOMETER_KEY = "bsp.odometer.v1";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage unavailable (private mode): reminders stay in-memory only
  }
}

export function loadRecords(): ServiceRecord[] {
  return read<ServiceRecord[]>(RECORDS_KEY, []);
}

export function saveRecord(record: ServiceRecord): ServiceRecord[] {
  const records = [...loadRecords(), record];
  write(RECORDS_KEY, records);
  return records;
}

export function loadOdometers(): Record<string, number> {
  return read<Record<string, number>>(ODOMETER_KEY, {});
}

export function saveOdometer(bikeSlug: string, km: number): Record<string, number> {
  const all = { ...loadOdometers(), [bikeSlug]: km };
  write(ODOMETER_KEY, all);
  return all;
}

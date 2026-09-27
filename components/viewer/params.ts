import type { Bike } from "@/lib/types";

export interface BikeParams {
  wb: number;
  rf: number;
  rr: number;
  sf: number;
  sr: number;
  seatH: number;
  rake: number;
  tankY: number;
  engineY: number;
  headX: number;
  headY: number;
  isScooter: boolean;
}

const STYLE_TABLE: Record<
  Bike["style"],
  { wb: number; seat: number; rake: number }
> = {
  commuter: { wb: 1.26, seat: 0.79, rake: 26 },
  naked: { wb: 1.34, seat: 0.8, rake: 25 },
  sport: { wb: 1.35, seat: 0.81, rake: 24 },
  cruiser: { wb: 1.44, seat: 0.7, rake: 30 },
  adventure: { wb: 1.42, seat: 0.85, rake: 27 },
  scooter: { wb: 1.28, seat: 0.77, rake: 27 },
  classic: { wb: 1.37, seat: 0.8, rake: 28 },
  "modern-classic": { wb: 1.39, seat: 0.8, rake: 26 },
};

function wheelRadius(inch: number, scooter: boolean, adventure: boolean): number {
  const section = scooter ? 0.075 : adventure ? 0.1 : 0.09;
  return inch * 0.0127 + section;
}

export function deriveParams(bike: Bike): BikeParams {
  const s = STYLE_TABLE[bike.style];
  const isScooter = bike.drive === "belt-cvt";
  const adv = bike.style === "adventure";
  const rf = wheelRadius(bike.wheelInch.front, isScooter, adv);
  const rr = wheelRadius(bike.wheelInch.rear, isScooter, false);
  const rake = (s.rake * Math.PI) / 180;
  const forkLen = isScooter ? 0.36 : 0.44;
  return {
    wb: s.wb,
    rf,
    rr,
    sf: isScooter ? 0.075 : adv ? 0.1 : 0.09,
    sr: isScooter ? 0.075 : 0.09,
    seatH: s.seat,
    rake,
    tankY: s.seat + 0.08,
    engineY: isScooter ? 0.26 : 0.3,
    headX: s.wb / 2 - Math.sin(rake) * forkLen,
    headY: rf + Math.cos(rake) * forkLen,
    isScooter,
  };
}

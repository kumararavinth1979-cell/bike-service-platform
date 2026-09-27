import type { Bike, PartDef, ServiceActionDef } from "@/lib/types";

const isScooter = (b: Bike) => b.drive === "belt-cvt";
const isManual = (b: Bike) => b.gearbox === "manual";
const isLiquid = (b: Bike) => b.cooling === "liquid";
const hasFrontDisc = (b: Bike) => b.brakes.front === "disc";
const hasRearDisc = (b: Bike) => b.brakes.rear === "disc";
const hasDrum = (b: Bike) => b.brakes.front === "drum" || b.brakes.rear === "drum";
const isCarb = (b: Bike) => b.fuelSystem === "carburetor";

function oilIntervalKm(b: Bike): number {
  if (isScooter(b)) return 3000;
  if (b.engineCC >= 400 || isLiquid(b)) return 6000;
  if (b.engineCC >= 200) return 5000;
  return 4000;
}

const a = (
  action: ServiceActionDef["action"],
  intervalKm?: number,
  intervalMonths?: number,
  condition?: boolean,
): ServiceActionDef => ({ action, intervalKm, intervalMonths, condition });

export const PARTS: PartDef[] = [
  {
    id: "engine-oil",
    image: "/images/parts/engine-oil.jpg",
    anchor: "engine",
    applies: () => true,
    actions: (b) => [
      a("inspect", oilIntervalKm(b), 6),
      a("replace", oilIntervalKm(b), 6),
    ],
  },
  {
    id: "oil-filter",
    image: "/images/parts/oil-filter.jpg",
    anchor: "engine",
    applies: () => true,
    actions: (b) => [a("replace", oilIntervalKm(b) * 2, 12)],
  },
  {
    id: "air-filter",
    image: "/images/parts/air-filter.jpg",
    anchor: "airbox",
    applies: () => true,
    actions: (b) =>
      isScooter(b)
        ? [a("inspect", 4000), a("clean", 4000), a("replace", 16000)]
        : [a("inspect", 6000), a("replace", 18000)],
  },
  {
    id: "spark-plug",
    image: "/images/parts/spark-plug.jpg",
    anchor: "engine",
    applies: () => true,
    actions: () => [a("inspect", 6000), a("replace", 12000)],
  },
  {
    id: "battery",
    image: "/images/parts/battery.jpg",
    anchor: "battery",
    applies: () => true,
    actions: () => [a("inspect", undefined, 6), a("replace", undefined, 36)],
  },
  {
    id: "engine",
    image: "/images/parts/engine.jpg",
    anchor: "engine",
    applies: () => true,
    actions: () => [a("inspect", 6000, 6)],
  },
  {
    id: "brake-pads",
    image: "/images/parts/brake-pad.jpg",
    anchor: "front-brake",
    applies: hasFrontDisc,
    actions: () => [a("inspect", 6000), a("replace", undefined, undefined, true)],
  },
  {
    id: "brake-disc",
    image: "/images/parts/brake-disc.jpg",
    anchor: "front-brake",
    applies: hasFrontDisc,
    actions: () => [a("inspect", 6000), a("replace", undefined, undefined, true)],
  },
  {
    id: "brake-drum",
    image: "/images/parts/brake-drum.jpg",
    anchor: "rear-brake",
    applies: hasDrum,
    actions: () => [a("inspect", 6000), a("clean", 12000), a("adjust", 6000)],
  },
  {
    id: "brake-fluid",
    image: "/images/parts/brake-fluid.jpg",
    anchor: "handlebar",
    applies: (b) => hasFrontDisc(b) || hasRearDisc(b),
    actions: () => [a("inspect", 6000), a("fill", 6000), a("replace", undefined, 24)],
  },
  {
    id: "chain",
    image: "/images/parts/chain.jpg",
    anchor: "chain",
    applies: (b) => b.drive === "chain",
    actions: () => [
      a("inspect", 1000),
      a("clean", 1000),
      a("lubricate", 1000),
      a("adjust", 3000),
      a("replace", 25000),
    ],
  },
  {
    id: "sprockets",
    image: "/images/parts/sprocket.jpg",
    anchor: "chain",
    applies: (b) => b.drive === "chain",
    actions: () => [a("inspect", 6000), a("replace", 25000)],
  },
  {
    id: "tyres",
    image: "/images/parts/tyre.jpg",
    anchor: "front-wheel",
    applies: () => true,
    actions: () => [
      a("inspect", 3000, 1),
      a("replace", undefined, 60, true),
    ],
  },
  {
    id: "coolant",
    image: "/images/parts/coolant.jpg",
    anchor: "radiator",
    applies: isLiquid,
    actions: () => [a("inspect", 6000), a("fill", 6000), a("replace", 24000, 24)],
  },
  {
    id: "radiator",
    image: "/images/parts/radiator.jpg",
    anchor: "radiator",
    applies: isLiquid,
    actions: () => [a("inspect", 6000), a("clean", 12000)],
  },
  {
    id: "cvt-belt",
    image: "/images/parts/cvt-belt.jpg",
    anchor: "cvt",
    applies: isScooter,
    actions: () => [a("inspect", 8000), a("replace", 24000)],
  },
  {
    id: "clutch",
    image: "/images/parts/clutch.jpg",
    anchor: "engine",
    applies: isManual,
    actions: () => [a("inspect", 6000), a("adjust", 6000)],
  },
  {
    id: "front-fork",
    image: "/images/parts/front-fork.jpg",
    anchor: "fork",
    applies: () => true,
    actions: () => [a("inspect", 6000), a("replace", 24000, 24)],
  },
  {
    id: "rear-shock",
    image: "/images/parts/rear-shock.jpg",
    anchor: "shock",
    applies: () => true,
    actions: () => [a("inspect", 6000)],
  },
  {
    id: "headlight",
    image: "/images/parts/headlight.jpg",
    anchor: "headlight",
    applies: () => true,
    actions: () => [a("inspect", 6000), a("replace", undefined, undefined, true)],
  },
  {
    id: "taillight",
    image: "/images/parts/taillight.jpg",
    anchor: "tail",
    applies: () => true,
    actions: () => [a("inspect", 6000), a("replace", undefined, undefined, true)],
  },
  {
    id: "exhaust",
    image: "/images/parts/exhaust.jpg",
    anchor: "exhaust",
    applies: () => true,
    actions: () => [a("inspect", 6000)],
  },
  {
    id: "carburetor",
    image: "/images/parts/carburetor.jpg",
    anchor: "airbox",
    applies: isCarb,
    actions: () => [a("inspect", 6000), a("clean", 12000), a("adjust", 12000)],
  },
  {
    id: "fuel-filter",
    image: "/images/parts/fuel-filter.jpg",
    anchor: "tank",
    applies: () => true,
    actions: () => [a("inspect", 6000), a("replace", 20000)],
  },
  {
    id: "cables",
    image: "/images/parts/cables.jpg",
    anchor: "handlebar",
    applies: isManual,
    actions: () => [
      a("inspect", 6000),
      a("lubricate", 6000),
      a("adjust", 6000),
      a("replace", undefined, undefined, true),
    ],
  },
  {
    id: "wheel",
    image: "/images/parts/wheel.jpg",
    anchor: "rear-wheel",
    applies: () => true,
    actions: () => [a("inspect", 6000), a("clean", 6000)],
  },
];

export function partsForBike(bike: Bike): PartDef[] {
  return PARTS.filter((p) => p.applies(bike));
}

export type Cooling = "air" | "oil" | "liquid";
export type FuelSystem = "carburetor" | "fuel-injection";
export type DriveType = "chain" | "belt-cvt";
export type Gearbox = "manual" | "automatic-cvt";
export type BrakeType = "disc" | "drum";
export type FrontSuspension = "telescopic" | "usd";
export type RearSuspension = "twin-shock" | "mono-shock";
export type EngineConfig = "single" | "parallel-twin";
export type BodyStyle =
  | "commuter"
  | "naked"
  | "sport"
  | "cruiser"
  | "adventure"
  | "scooter"
  | "classic"
  | "modern-classic";
export type HeadlightShape = "round" | "angular" | "swept";
export type ExhaustStyle = "short" | "long" | "underbelly" | "upswept" | "dual";
export type WheelStyle = "alloy" | "spoke";

export interface BikeColors {
  body: string;
  frame: string;
  seat: string;
  wheels: string;
}

export interface Bike {
  slug: string;
  brand: string;
  model: string;
  engineCC: number;
  engineConfig: EngineConfig;
  cooling: Cooling;
  fuelSystem: FuelSystem;
  drive: DriveType;
  gearbox: Gearbox;
  brakes: { front: BrakeType; rear: BrakeType };
  suspension: { front: FrontSuspension; rear: RearSuspension };
  style: BodyStyle;
  headlight: HeadlightShape;
  exhaust: ExhaustStyle;
  wheelStyle: WheelStyle;
  wheelInch: { front: number; rear: number };
  colors: BikeColors;
}

export type ServiceAction =
  | "replace"
  | "clean"
  | "lubricate"
  | "inspect"
  | "adjust"
  | "fill";

export interface ServiceActionDef {
  action: ServiceAction;
  intervalKm?: number;
  intervalMonths?: number;
  condition?: boolean;
}

export type PartId =
  | "engine-oil"
  | "oil-filter"
  | "air-filter"
  | "spark-plug"
  | "battery"
  | "engine"
  | "brake-pads"
  | "brake-disc"
  | "brake-drum"
  | "brake-fluid"
  | "chain"
  | "sprockets"
  | "tyres"
  | "coolant"
  | "radiator"
  | "cvt-belt"
  | "clutch"
  | "front-fork"
  | "rear-shock"
  | "headlight"
  | "taillight"
  | "exhaust"
  | "carburetor"
  | "fuel-filter"
  | "cables"
  | "wheel";

export type PartAnchor =
  | "engine"
  | "airbox"
  | "battery"
  | "front-brake"
  | "rear-brake"
  | "front-wheel"
  | "rear-wheel"
  | "chain"
  | "radiator"
  | "fork"
  | "shock"
  | "headlight"
  | "tail"
  | "exhaust"
  | "cvt"
  | "handlebar"
  | "tank";

export interface PartDef {
  id: PartId;
  image: string;
  anchor: PartAnchor;
  applies: (bike: Bike) => boolean;
  actions: (bike: Bike) => ServiceActionDef[];
}

export interface ServiceRecord {
  bikeSlug: string;
  partId: PartId;
  action: ServiceAction;
  odometerKm: number;
  dateISO: string;
}

export type ServiceStatus = "ok" | "due-soon" | "due" | "overdue";

export interface ServiceStatusInfo {
  status: ServiceStatus;
  kmLeft?: number;
  daysLeft?: number;
}

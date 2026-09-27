import type { PartId, ServiceAction } from "@/lib/types";

export type Lang = "en" | "ta";

interface Dictionary {
  appName: string;
  searchPlaceholder: string;
  selectBike: string;
  brands: string;
  models: string;
  noResults: string;
  back: string;
  parts: string;
  selectPart: string;
  tapPartHint: string;
  service: string;
  interval: string;
  lastService: string;
  nextService: string;
  markServiced: string;
  odometer: string;
  save: string;
  reminders: string;
  statusOk: string;
  statusDueSoon: string;
  statusDue: string;
  statusOverdue: string;
  noRecord: string;
  resetView: string;
  loading: string;
  viewerError: string;
  imageError: string;
  notFound: string;
  typicalNote: string;
  modelNote: string;
  km: string;
  months: string;
  whenWorn: string;
  theme: string;
  light: string;
  dark: string;
  language: string;
  actions: Record<ServiceAction, string>;
  partsNames: Record<PartId, string>;
}

const en: Dictionary = {
  appName: "Bike Service",
  searchPlaceholder: "Search bike or brand",
  selectBike: "Select bike",
  brands: "Brands",
  models: "Models",
  noResults: "No bike found",
  back: "Back",
  parts: "Parts",
  selectPart: "Select a part",
  tapPartHint: "Tap a part on the bike",
  service: "Service",
  interval: "Interval",
  lastService: "Last service",
  nextService: "Next service",
  markServiced: "Mark as serviced",
  odometer: "Odometer (km)",
  save: "Save",
  reminders: "Reminders",
  statusOk: "OK",
  statusDueSoon: "Due soon",
  statusDue: "Due",
  statusOverdue: "Overdue",
  noRecord: "No record",
  resetView: "Reset view",
  loading: "Loading",
  viewerError: "3D view unavailable",
  imageError: "Image unavailable",
  notFound: "Bike not found",
  typicalNote: "Intervals are typical values. Follow your owner's manual.",
  modelNote: "Representative 3D view, not an exact model.",
  km: "km",
  months: "months",
  whenWorn: "When worn",
  theme: "Theme",
  light: "Light",
  dark: "Dark",
  language: "Language",
  actions: {
    replace: "Replace",
    clean: "Clean",
    lubricate: "Lubricate",
    inspect: "Inspect",
    adjust: "Adjust",
    fill: "Fill / Top-up",
  },
  partsNames: {
    "engine-oil": "Engine oil",
    "oil-filter": "Oil filter",
    "air-filter": "Air filter",
    "spark-plug": "Spark plug",
    battery: "Battery",
    engine: "Engine",
    "brake-pads": "Brake pads",
    "brake-disc": "Brake disc",
    "brake-drum": "Drum brake",
    "brake-fluid": "Brake fluid",
    chain: "Chain",
    sprockets: "Sprockets",
    tyres: "Tyres",
    coolant: "Coolant",
    radiator: "Radiator",
    "cvt-belt": "Drive belt",
    clutch: "Clutch",
    "front-fork": "Front fork",
    "rear-shock": "Rear shock",
    headlight: "Headlight",
    taillight: "Tail light",
    exhaust: "Exhaust",
    carburetor: "Carburetor",
    "fuel-filter": "Fuel filter",
    cables: "Control cables",
    wheel: "Wheels",
  },
};

const ta: Dictionary = {
  appName: "பைக் பராமரிப்பு",
  searchPlaceholder: "பைக் அல்லது நிறுவனத்தை தேடு",
  selectBike: "பைக்கை தேர்வு செய்",
  brands: "நிறுவனங்கள்",
  models: "மாடல்கள்",
  noResults: "பைக் கிடைக்கவில்லை",
  back: "பின்",
  parts: "பாகங்கள்",
  selectPart: "பாகத்தை தேர்வு செய்",
  tapPartHint: "பைக்கில் பாகத்தை தட்டு",
  service: "பராமரிப்பு",
  interval: "இடைவெளி",
  lastService: "கடைசி பராமரிப்பு",
  nextService: "அடுத்த பராமரிப்பு",
  markServiced: "முடிந்தது என குறி",
  odometer: "கிலோமீட்டர் அளவு",
  save: "சேமி",
  reminders: "நினைவூட்டல்",
  statusOk: "சரியாக உள்ளது",
  statusDueSoon: "விரைவில் செய்ய வேண்டும்",
  statusDue: "செய்ய வேண்டும்",
  statusOverdue: "தாமதமாகிவிட்டது",
  noRecord: "பதிவு இல்லை",
  resetView: "காட்சியை மீட்டமை",
  loading: "ஏற்றுகிறது",
  viewerError: "முப்பரிமாண காட்சி கிடைக்கவில்லை",
  imageError: "படம் கிடைக்கவில்லை",
  notFound: "பைக் கிடைக்கவில்லை",
  typicalNote: "இடைவெளிகள் பொதுவான அளவுகள். உங்கள் கையேட்டை பின்பற்றவும்.",
  modelNote: "பிரதிநிதி 3D காட்சி; துல்லியமான மாடல் அல்ல.",
  km: "கி.மீ.",
  months: "மாதம்",
  whenWorn: "தேய்ந்த பிறகு",
  theme: "தோற்றம்",
  light: "வெளிச்சம்",
  dark: "இருள்",
  language: "மொழி",
  actions: {
    replace: "மாற்று",
    clean: "சுத்தம் செய்",
    lubricate: "மசகு இடு",
    inspect: "சரிபார்",
    adjust: "சீரமை",
    fill: "நிரப்பு",
  },
  partsNames: {
    "engine-oil": "எஞ்சின் எண்ணெய்",
    "oil-filter": "எண்ணெய் வடிகட்டி",
    "air-filter": "காற்று வடிகட்டி",
    "spark-plug": "ஸ்பார்க் பிளக்",
    battery: "மின்கலம்",
    engine: "எஞ்சின்",
    "brake-pads": "தடுப்புத் தகடுகள்",
    "brake-disc": "தடுப்பு வட்டு",
    "brake-drum": "உருளைத் தடுப்பு",
    "brake-fluid": "தடுப்பு எண்ணெய்",
    chain: "சங்கிலி",
    sprockets: "பற்சக்கரங்கள்",
    tyres: "டயர்கள்",
    coolant: "குளிர்விக்கும் நீர்மம்",
    radiator: "ரேடியேட்டர்",
    "cvt-belt": "இயக்கப் பட்டை",
    clutch: "கிளட்ச்",
    "front-fork": "முன் போர்க்",
    "rear-shock": "பின் அதிர்வு தாங்கி",
    headlight: "முன் விளக்கு",
    taillight: "பின் விளக்கு",
    exhaust: "புகைக்குழாய்",
    carburetor: "கார்புரேட்டர்",
    "fuel-filter": "எரிபொருள் வடிகட்டி",
    cables: "கட்டுப்பாட்டு கம்பிகள்",
    wheel: "சக்கரங்கள்",
  },
};

export const DICTIONARIES: Record<Lang, Dictionary> = { en, ta };
export type { Dictionary };

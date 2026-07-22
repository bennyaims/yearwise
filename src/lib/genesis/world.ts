/**
 * Deep world model: chemicals, air quality, orbital cycles, seasons, food webs.
 */

export type StarType = "red-dwarf" | "yellow" | "blue-giant" | "white-dwarf";

export type SeasonName = "spring" | "summer" | "autumn" | "winter";

export type Atmosphere = {
  oxygen: number; // 0–1
  co2: number;
  nitrogen: number;
  toxin: number; // hostile gas 0–1
  pressure: number; // 0.2–3 relative Earth
  /** methane / VOC-like organics 0–1 — fuel for chemo, smog for lungs */
  methane: number;
  /** water vapour 0–1 — humidity, cloud, rain potential */
  humidity: number;
  /** particulate / smoke 0–1 — lowers air quality & light */
  particulates: number;
};

/** Soil / ocean dissolved chemicals organisms can use */
export type ChemicalPool = {
  /** nitrates / fixed nitrogen for growth */
  nitrogenNutrient: number; // 0–1
  /** phosphate-like growth limit */
  phosphate: number;
  /** free minerals for shells/structure */
  minerals: number;
  /** dissolved organic carbon (detritus food) */
  organics: number;
  /** acidity proxy 0 alkaline … 1 very acidic */
  acidity: number;
};

export type OrbitConfig = {
  /** year length in simulation ticks */
  yearLengthTicks: number;
  /** axial tilt degrees 0–45 — stronger seasons */
  axialTilt: number;
  /** orbital eccentricity 0–0.4 — perihelion/aphelion light swing */
  eccentricity: number;
  /** starting phase 0–1 along the year */
  phase: number;
};

export type FoodWebConfig = {
  /** baseline plant/primary productivity 0–1 */
  primaryProductivity: number;
  /** number of food patches in the arena */
  patchCount: number;
  /** how fast patches regrow each tick */
  regrowth: number;
  /** max energy stored per patch */
  patchCapacity: number;
};

/** Surface water & vegetation coverage (drive 3D + ecology live) */
export type SurfaceBiosphere = {
  /** 0–1 fraction of surface as water bodies */
  waterCoverage: number;
  /** 0–1 plant/tree density target */
  floraCoverage: number;
  /** relative tree vs ground-cover mix 0=only moss 1=mostly trees */
  canopyRatio: number;
  /** introduce predators when fauna can support them */
  predatorPressure: number;
  /** chance intelligent morphs emerge / are seeded */
  intelligenceSeed: number;
};

export type WorldEnv = {
  name: string;
  gravity: number; // g, 0.1–3
  star: StarType;
  atmosphere: Atmosphere;
  chemicals: ChemicalPool;
  orbit: OrbitConfig;
  foodWeb: FoodWebConfig;
  surface: SurfaceBiosphere;
  /** base temperature offset °C (planet greenhouse tweak) */
  temperatureC: number;
  seed: number;
};

/** Static flora instances for 3D (regenerated when surface/env changes) */
export type FloraNode = {
  id: string;
  x: number;
  z: number;
  height: number;
  radius: number;
  kind: "moss" | "shrub" | "tree" | "kelp";
  health: number;
};

export type FoodPatch = {
  id: string;
  x: number;
  z: number;
  energy: number;
  kind: "photo" | "detritus" | "mineral";
};

export const STAR_PRESETS: Record<
  StarType,
  { label: string; energy: number; uv: number; color: string; blurb: string }
> = {
  "red-dwarf": {
    label: "Red dwarf",
    energy: 0.55,
    uv: 0.25,
    color: "#ff6b4a",
    blurb: "Dim, long-lived — favours efficient light-harvesters.",
  },
  yellow: {
    label: "Yellow (Sol-like)",
    energy: 1,
    uv: 0.55,
    color: "#ffd666",
    blurb: "Balanced energy — Earth-like niches.",
  },
  "blue-giant": {
    label: "Blue giant",
    energy: 1.85,
    uv: 1.2,
    color: "#7ec8ff",
    blurb: "Harsh UV and heat — rewards armour & resistance.",
  },
  "white-dwarf": {
    label: "White dwarf",
    energy: 0.35,
    uv: 0.4,
    color: "#e8f0ff",
    blurb: "Faint light — metabolism and storage matter.",
  },
};

/**
 * Default: thriving Eden garden — plants + animals, land + water.
 * No human seed (school journey introduces humanity later).
 */
export function defaultWorld(): WorldEnv {
  return {
    name: "Eden Garden",
    gravity: 0.95,
    star: "yellow",
    atmosphere: {
      oxygen: 0.22,
      co2: 0.038,
      nitrogen: 0.78,
      toxin: 0.002,
      pressure: 1.0,
      methane: 0.01,
      humidity: 0.7,
      particulates: 0.02,
    },
    chemicals: {
      nitrogenNutrient: 0.92,
      phosphate: 0.88,
      minerals: 0.82,
      organics: 0.9,
      acidity: 0.14,
    },
    orbit: {
      yearLengthTicks: 200,
      axialTilt: 10,
      eccentricity: 0.03,
      phase: 0.2,
    },
    foodWeb: {
      primaryProductivity: 0.99,
      patchCount: 40,
      regrowth: 0.12,
      patchCapacity: 3.8,
    },
    surface: {
      waterCoverage: 0.42,
      floraCoverage: 0.98,
      canopyRatio: 0.88, // heaps of forest
      predatorPressure: 0.12,
      intelligenceSeed: 0, // mind/humans via school journey
    },
    temperatureC: 20,
    seed: 42,
  };
}

/** Harsher contrast world students can switch to for extinction pressure */
export function harshWorld(): WorldEnv {
  return {
    name: "Stress World",
    gravity: 1.6,
    star: "blue-giant",
    atmosphere: {
      oxygen: 0.12,
      co2: 0.08,
      nitrogen: 0.7,
      toxin: 0.35,
      pressure: 1.3,
      methane: 0.12,
      humidity: 0.2,
      particulates: 0.35,
    },
    chemicals: {
      nitrogenNutrient: 0.3,
      phosphate: 0.25,
      minerals: 0.4,
      organics: 0.2,
      acidity: 0.55,
    },
    orbit: {
      yearLengthTicks: 90,
      axialTilt: 32,
      eccentricity: 0.18,
      phase: 0.7,
    },
    foodWeb: {
      primaryProductivity: 0.4,
      patchCount: 8,
      regrowth: 0.02,
      patchCapacity: 1.4,
    },
    surface: {
      waterCoverage: 0.12,
      floraCoverage: 0.2,
      canopyRatio: 0.15,
      predatorPressure: 0.7,
      intelligenceSeed: 0.05,
    },
    temperatureC: 8,
    seed: 7,
  };
}

/** 0–1 phase of year from tick */
export function yearPhase(env: WorldEnv, tick: number): number {
  const L = Math.max(20, env.orbit.yearLengthTicks);
  return (env.orbit.phase + tick / L) % 1;
}

export function seasonFromPhase(phase: number): SeasonName {
  if (phase < 0.25) return "spring";
  if (phase < 0.5) return "summer";
  if (phase < 0.75) return "autumn";
  return "winter";
}

export function seasonLabel(s: SeasonName): string {
  return { spring: "Spring", summer: "Summer", autumn: "Autumn", winter: "Winter" }[s];
}

/**
 * Air quality index 0–1 (1 = clean).
 * Combines toxin, particulates, extreme O₂, methane smog, pressure extremes.
 */
export function airQualityIndex(atm: Atmosphere): number {
  const toxinHit = atm.toxin * 0.45;
  const dustHit = atm.particulates * 0.3;
  const methaneHit = Math.max(0, atm.methane - 0.05) * 0.25;
  const o2Hit = Math.abs(atm.oxygen - 0.21) * 0.35;
  const pressureHit = Math.abs(atm.pressure - 1) * 0.12;
  return clamp(1 - toxinHit - dustHit - methaneHit - o2Hit - pressureHit, 0, 1);
}

export function airQualityLabel(q: number): string {
  if (q >= 0.85) return "Excellent";
  if (q >= 0.7) return "Good";
  if (q >= 0.5) return "Moderate";
  if (q >= 0.3) return "Poor";
  return "Hazardous";
}

/** Dynamic climate at a simulation tick */
export function deriveClimate(
  env: WorldEnv,
  tick = 0,
): {
  tempC: number;
  lightLevel: number;
  habitability: number;
  season: SeasonName;
  yearPhase: number;
  airQuality: number;
  orbitalLightMod: number;
  seasonalLightMod: number;
  foodProductivity: number;
  dayLengthFactor: number;
} {
  const star = STAR_PRESETS[env.star];
  const phase = yearPhase(env, tick);
  const season = seasonFromPhase(phase);

  // Eccentricity: closer at perihelion (phase ~0) more light/heat
  const orbitalLightMod =
    1 + env.orbit.eccentricity * Math.cos(phase * Math.PI * 2);

  // Axial tilt seasons: summer peak at phase 0.35–0.4
  const tilt = env.orbit.axialTilt / 45; // 0–1
  const seasonalWave = Math.sin((phase - 0.12) * Math.PI * 2);
  const seasonalLightMod = 1 + tilt * 0.35 * seasonalWave;
  const seasonalTempMod = tilt * 18 * seasonalWave;

  const greenhouse =
    env.atmosphere.co2 * 40 +
    env.atmosphere.methane * 25 +
    env.atmosphere.pressure * 5 +
    env.atmosphere.humidity * 6;
  const cooling = env.atmosphere.nitrogen * 2 + env.atmosphere.particulates * 8;

  // temperatureC is a strong baseline (so Eden can sit near ~20°C)
  const tempC =
    env.temperatureC +
    (star.energy - 1) * 18 * orbitalLightMod +
    (greenhouse - 12) * 0.55 -
    cooling * 0.4 +
    seasonalTempMod * 0.85;

  const aq = airQualityIndex(env.atmosphere);
  const lightLevel =
    star.energy *
    orbitalLightMod *
    seasonalLightMod *
    (1 - env.atmosphere.toxin * 0.15) *
    (1 - env.atmosphere.particulates * 0.35) *
    (0.75 + aq * 0.25);

  // Day length proxy (summer longer days)
  const dayLengthFactor = clamp(0.65 + 0.35 * (0.5 + 0.5 * seasonalWave), 0.4, 1.15);

  // Food productivity: light × nutrients × season × humidity − acidity stress
  const chem =
    0.35 * env.chemicals.nitrogenNutrient +
    0.25 * env.chemicals.phosphate +
    0.2 * env.chemicals.organics +
    0.2 * env.chemicals.minerals;
  const seasonFood =
    season === "spring"
      ? 1.15
      : season === "summer"
        ? 1.25
        : season === "autumn"
          ? 0.9
          : 0.45;
  const foodProductivity = clamp(
    env.foodWeb.primaryProductivity *
      chem *
      seasonFood *
      (0.5 + lightLevel * 0.5) *
      (0.6 + env.atmosphere.humidity * 0.5) *
      (1 - env.chemicals.acidity * 0.4) *
      dayLengthFactor,
    0.05,
    2.2,
  );

  const habitability = clamp(
    1 -
      Math.abs(tempC - 18) / 60 -
      env.atmosphere.toxin * 0.4 -
      (1 - aq) * 0.35 -
      Math.abs(env.gravity - 1) * 0.12 -
      Math.abs(env.atmosphere.oxygen - 0.21) * 0.3 -
      env.chemicals.acidity * 0.15,
    0,
    1,
  );

  return {
    tempC,
    lightLevel,
    habitability,
    season,
    yearPhase: phase,
    airQuality: aq,
    orbitalLightMod,
    seasonalLightMod,
    foodProductivity,
    dayLengthFactor,
  };
}

export function biomeFromEnv(
  env: WorldEnv,
  tick = 0,
): {
  ground: string;
  fog: string;
  sky: string;
  label: string;
} {
  const { tempC, lightLevel, season, airQuality } = deriveClimate(env, tick);
  const starCol = STAR_PRESETS[env.star].color;

  // Seasonal ground tint
  const seasonGround: Record<SeasonName, string> = {
    spring: "#5a9a6a",
    summer: "#3d8a50",
    autumn: "#9a7a40",
    winter: "#c5d0dc",
  };

  if (tempC > 48)
    return {
      ground: "#c4a574",
      fog: "#e8c99a",
      sky: starCol,
      label: `Arid / scorched · ${seasonLabel(season)}`,
    };
  if (tempC < -12)
    return {
      ground: "#d0dce8",
      fog: "#e8eef5",
      sky: "#a8c0e0",
      label: `Frozen crust · ${seasonLabel(season)}`,
    };
  if (airQuality < 0.35)
    return {
      ground: "#6b5b3a",
      fog: "#9a8b4a",
      sky: "#b8a86a",
      label: `Smog / poor air · ${seasonLabel(season)}`,
    };
  if (env.atmosphere.toxin > 0.4)
    return {
      ground: "#6b5b3a",
      fog: "#9a8b4a",
      sky: "#c4b86a",
      label: `Toxic haze · ${seasonLabel(season)}`,
    };
  if (env.gravity > 1.6)
    return {
      ground: "#5a5a68",
      fog: "#8a8a9a",
      sky: starCol,
      label: `Heavy-gravity rock · ${seasonLabel(season)}`,
    };
  if (env.atmosphere.oxygen > 0.28 && lightLevel > 0.7)
    return {
      ground: seasonGround[season],
      fog: "#8fbf9f",
      sky: starCol,
      label: `Lush oxygen world · ${seasonLabel(season)}`,
    };
  return {
    ground: seasonGround[season],
    fog: season === "winter" ? "#c8d4e0" : "#a8c5b0",
    sky: starCol,
    label: `Temperate zone · ${seasonLabel(season)}`,
  };
}

/** Seed spatial food patches */
export function createFoodPatches(
  env: WorldEnv,
  rng: () => number,
): FoodPatch[] {
  const n = Math.max(4, env.foodWeb.patchCount);
  const patches: FoodPatch[] = [];
  for (let i = 0; i < n; i++) {
    const r = rng();
    const kind: FoodPatch["kind"] =
      r < 0.45 ? "photo" : r < 0.8 ? "detritus" : "mineral";
    patches.push({
      id: `food-${i}`,
      x: (rng() - 0.5) * 20,
      z: (rng() - 0.5) * 20,
      energy: env.foodWeb.patchCapacity * (0.4 + rng() * 0.6),
      kind,
    });
  }
  return patches;
}

export function regrowFoodPatches(
  patches: FoodPatch[],
  env: WorldEnv,
  tick: number,
): FoodPatch[] {
  const climate = deriveClimate(env, tick);
  const grow =
    env.foodWeb.regrowth *
    climate.foodProductivity *
    (0.7 + env.chemicals.nitrogenNutrient * 0.4);

  return patches.map((p) => {
    let rate = grow;
    if (p.kind === "photo") rate *= 1.15 * climate.lightLevel;
    if (p.kind === "detritus") rate *= 0.7 + env.chemicals.organics;
    if (p.kind === "mineral") rate *= 0.5 + env.chemicals.minerals;
    // winter slows photo patches hard
    if (climate.season === "winter" && p.kind === "photo") rate *= 0.25;
    return {
      ...p,
      energy: Math.min(
        env.foodWeb.patchCapacity,
        p.energy + rate * env.foodWeb.patchCapacity * 0.08,
      ),
    };
  });
}

/** Deterministic flora layout from env + seed (live-updates when sliders change) */
export function generateFlora(env: WorldEnv, tick = 0): FloraNode[] {
  const rng = (() => {
    let s = (env.seed * 7919 + Math.floor(tick / 40) * 104729) >>> 0;
    return () => {
      s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
      return s / 4294967296;
    };
  })();

  const climate = deriveClimate(env, tick);
  const density =
    env.surface.floraCoverage *
    climate.foodProductivity *
    (0.5 + env.atmosphere.humidity * 0.5) *
    (climate.season === "winter" ? 0.55 : 1);
  // Dense canopy worlds get many more plant nodes (heaps of forest)
  const count = Math.floor(
    12 + density * 55 + env.surface.canopyRatio * 35,
  );
  const waterR = Math.sqrt(env.surface.waterCoverage) * 9.5;
  const nodes: FloraNode[] = [];

  for (let i = 0; i < count; i++) {
    let x = 0;
    let z = 0;
    let tries = 0;
    do {
      x = (rng() - 0.5) * 22;
      z = (rng() - 0.5) * 22;
      tries++;
    } while (x * x + z * z < waterR * waterR * 0.75 && tries < 12);

    const inShallowWater = x * x + z * z < waterR * waterR * 1.15;
    const roll = rng();
    let kind: FloraNode["kind"] = "moss";
    if (inShallowWater && env.surface.waterCoverage > 0.15) {
      kind = rng() > 0.35 ? "kelp" : "moss";
    } else if (roll < env.surface.canopyRatio * 0.85) {
      kind = "tree"; // forest-dominant when canopy high
    } else if (roll < 0.5 + env.surface.canopyRatio * 0.25) {
      kind = "shrub";
    }

    const hBase =
      kind === "tree"
        ? 1.4 + rng() * 2.6
        : kind === "shrub"
          ? 0.5 + rng() * 0.6
          : kind === "kelp"
            ? 0.8 + rng() * 1.4
            : 0.15 + rng() * 0.2;

    nodes.push({
      id: `flora-${i}`,
      x,
      z,
      height: hBase * (0.75 + density * 0.4),
      radius:
        kind === "tree"
          ? 0.4 + rng() * 0.4
          : kind === "shrub"
            ? 0.25 + rng() * 0.2
            : 0.12 + rng() * 0.1,
      kind,
      health: clamp(
        density * (0.65 + rng() * 0.35) * (1 - env.chemicals.acidity * 0.3),
        0.2,
        1,
      ),
    });
  }
  return nodes;
}

/** Standing timber estimate from live flora (for infrastructure economy) */
export function estimateForestTimber(
  flora: { kind: string; height: number; health: number }[],
): number {
  let t = 0;
  for (const f of flora) {
    if (f.kind === "tree") t += f.height * f.health * 0.55;
    else if (f.kind === "shrub") t += f.height * f.health * 0.12;
  }
  return t;
}

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

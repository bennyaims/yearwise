/**
 * Technology, population pressure, pollution, scientific tests & external fixes.
 *
 * Design rule for students:
 *  - Adjustments CREATE locked “history events” (cannot rewrite the past).
 *  - Damage can be REMEDIATED from the outside (cleanup, filters, rewilding…)
 *    but the event still happened and stays on the record for the essay.
 */

import type { WorldEnv } from "./world";
import { airQualityIndex, deriveClimate } from "./world";

// ─── Technology ladder ───────────────────────────────

export type TechLevelId =
  | "none"
  | "tools"
  | "agriculture"
  | "industry"
  | "digital"
  | "space";

export const TECH_LEVELS: {
  id: TechLevelId;
  rank: number;
  label: string;
  kidLabel: string;
  blurb: string;
  science: string;
  /** pollution emitted per human per tick (base) */
  pollutionRate: number;
  /** population growth boost */
  popBoost: number;
}[] = [
  {
    id: "none",
    rank: 0,
    label: "No tech",
    kidLabel: "Wild living",
    blurb: "No tools beyond nature.",
    science: "Baseline biology only.",
    pollutionRate: 0,
    popBoost: 0,
  },
  {
    id: "tools",
    rank: 1,
    label: "Simple tools",
    kidLabel: "Tools & fire",
    blurb: "Stone, wood, controlled fire — small camps.",
    science: "Energy use begins; local smoke.",
    pollutionRate: 0.0008,
    popBoost: 0.05,
  },
  {
    id: "agriculture",
    rank: 2,
    label: "Agriculture",
    kidLabel: "Farms & villages",
    blurb: "Crops, irrigation, more food → more people.",
    science: "Carrying capacity rises; soil and water stress.",
    pollutionRate: 0.0018,
    popBoost: 0.15,
  },
  {
    id: "industry",
    rank: 3,
    label: "Industry",
    kidLabel: "Factories & engines",
    blurb: "Machines, fuels, mass production.",
    science: "Rapid energy + waste; air and water pollution.",
    pollutionRate: 0.0045,
    popBoost: 0.28,
  },
  {
    id: "digital",
    rank: 4,
    label: "Digital age",
    kidLabel: "Computers & networks",
    blurb: "Sensors, data, global communication.",
    science: "Efficiency gains possible; energy still needed.",
    pollutionRate: 0.0035,
    popBoost: 0.22,
  },
  {
    id: "space",
    rank: 5,
    label: "Space-capable",
    kidLabel: "High tech / space",
    blurb: "Advanced materials, off-world options.",
    science: "Highest leverage for fix-from-outside missions.",
    pollutionRate: 0.0028,
    popBoost: 0.18,
  },
];

export function techInfo(id: TechLevelId) {
  return TECH_LEVELS.find((t) => t.id === id) ?? TECH_LEVELS[0]!;
}

// ─── Locked events vs external fixes ─────────────────

export type LockedEventKind =
  | "tech-upgrade"
  | "population-boom"
  | "pollution-spike"
  | "industrial-spill"
  | "deforestation-pulse"
  | "test-result";

export type LockedEvent = {
  id: string;
  tick: number;
  kind: LockedEventKind;
  title: string;
  /** permanent history — cannot be deleted */
  description: string;
  scienceTeach: string;
  /** env deltas applied at the time (for teaching) */
  impact: Partial<{
    toxin: number;
    particulates: number;
    methane: number;
    co2: number;
    organics: number;
    acidity: number;
    floraCoverage: number;
    primaryProductivity: number;
  }>;
};

export type ExternalFixId =
  | "air-scrubbers"
  | "water-filters"
  | "rewild-planting"
  | "emission-caps"
  | "soil-repair"
  | "monitoring-network";

export const EXTERNAL_FIXES: {
  id: ExternalFixId;
  label: string;
  kidLabel: string;
  blurb: string;
  science: string;
  /** does not erase history; only improves present state */
  note: string;
  costLabel: string;
}[] = [
  {
    id: "air-scrubbers",
    label: "Deploy air scrubbers",
    kidLabel: "Clean the air from outside",
    blurb: "Filters cut toxins and dust in the atmosphere.",
    science: "Engineering remediation — treats symptoms of past emissions.",
    note: "History of pollution stays on the record; air can still improve.",
    costLabel: "Mission resource: medium",
  },
  {
    id: "water-filters",
    label: "Water filtration arrays",
    kidLabel: "Clean rivers & lakes",
    blurb: "Lowers acidity stress and supports aquatic life.",
    science: "Hydrology + chemistry cleanup.",
    note: "Spill events remain history; water quality can recover.",
    costLabel: "Mission resource: medium",
  },
  {
    id: "rewild-planting",
    label: "External rewilding drop",
    kidLabel: "Plant forests from orbit/ship",
    blurb: "Adds plant cover and food productivity.",
    science: "Ecological restoration from outside the local society.",
    note: "Past clearing still happened; biomass can regrow.",
    costLabel: "Mission resource: high",
  },
  {
    id: "emission-caps",
    label: "Emission regulations",
    kidLabel: "Rules that cut new pollution",
    blurb: "Slows future pollution from tech & population.",
    science: "Policy as a control system on industrial output.",
    note: "Does not undo past smoke — reduces new smoke.",
    costLabel: "Mission resource: low",
  },
  {
    id: "soil-repair",
    label: "Soil & nutrient repair",
    kidLabel: "Heal the ground",
    blurb: "Restores nutrients and reduces toxic load in soils.",
    science: "Soil science / bioremediation metaphor.",
    note: "Past farm pressure stays recorded.",
    costLabel: "Mission resource: medium",
  },
  {
    id: "monitoring-network",
    label: "Science monitoring grid",
    kidLabel: "Sensors everywhere",
    blurb: "Improves tests and early warning; slight culture boost.",
    science: "Measurement enables better decisions.",
    note: "Does not clean pollution itself — supports smart fixes.",
    costLabel: "Mission resource: low",
  },
];

// ─── Scientific tests ────────────────────────────────

export type ScienceTestId =
  | "air-quality"
  | "water-health"
  | "biodiversity"
  | "human-pressure"
  | "tech-footprint"
  | "carrying-capacity";

export type ScienceTestResult = {
  id: ScienceTestId;
  tick: number;
  title: string;
  score: number; // 0–100
  band: "critical" | "poor" | "moderate" | "good" | "excellent";
  reading: string;
  teaching: string;
  recommendation: string;
};

export const SCIENCE_TESTS: {
  id: ScienceTestId;
  label: string;
  kidLabel: string;
  blurb: string;
}[] = [
  {
    id: "air-quality",
    label: "Atmospheric assay",
    kidLabel: "Test the air",
    blurb: "Measure toxins, dust, O₂ balance.",
  },
  {
    id: "water-health",
    label: "Water chemistry panel",
    kidLabel: "Test the water",
    blurb: "Acidity, organics, mineral load.",
  },
  {
    id: "biodiversity",
    label: "Biodiversity index",
    kidLabel: "Count life types",
    blurb: "Plant groups + animal roles + generations.",
  },
  {
    id: "human-pressure",
    label: "Human pressure index",
    kidLabel: "How heavy are people?",
    blurb: "Population, towns, behaviour intensity.",
  },
  {
    id: "tech-footprint",
    label: "Technology footprint",
    kidLabel: "Tech impact test",
    blurb: "Tech level × pollution ledger.",
  },
  {
    id: "carrying-capacity",
    label: "Carrying capacity estimate",
    kidLabel: "How many can live well?",
    blurb: "Food, flora, air vs population.",
  },
];

export type CivilizationState = {
  techLevel: TechLevelId;
  /** cumulative pollution ledger 0–∞ (history) */
  pollutionLedger: number;
  /** current pollution intensity 0–1 (affects env coupling) */
  pollutionNow: number;
  /** population growth modifier from tech/policy 0–2 */
  growthModifier: number;
  /** emission caps policy 0–1 (reduces new pollution) */
  emissionCap: number;
  /** monitoring quality 0–1 */
  monitoring: number;
  /** locked history — never deleted */
  lockedEvents: LockedEvent[];
  /** last test results */
  tests: ScienceTestResult[];
  /** external fixes applied count */
  fixesApplied: ExternalFixId[];
  /** teaching log for essay */
  teachings: string[];
  /** Standing forest timber stock (planet resource) */
  forestTimber: number;
  /** Planetary mineral stock */
  planetaryMinerals: number;
  /** Total infrastructure built from local resources 0–∞ */
  infrastructureBuilt: number;
  /** Trees harvested (locked ledger) */
  treesHarvested: number;
};

export function defaultCivilization(): CivilizationState {
  return {
    techLevel: "none",
    pollutionLedger: 0,
    pollutionNow: 0,
    growthModifier: 1,
    emissionCap: 0,
    monitoring: 0,
    lockedEvents: [],
    tests: [],
    fixesApplied: [],
    teachings: [
      "Rule: history events cannot be erased. Outside fixes can improve the present.",
      "Infrastructure is built from forest timber and minerals on this planet — not from nowhere.",
    ],
    forestTimber: 0,
    planetaryMinerals: 40,
    infrastructureBuilt: 0,
    treesHarvested: 0,
  };
}

/**
 * Harvest forest for timber → settlement wood.
 * Removes / damages trees; locked as resource extraction history.
 */
export function harvestForestForTimber(
  flora: {
    id: string;
    kind: string;
    height: number;
    health: number;
    x: number;
    z: number;
  }[],
  civ: CivilizationState,
  near: { x: number; z: number },
  tick: number,
  amount = 1,
): {
  flora: typeof flora;
  timberGained: number;
  civ: CivilizationState;
  teaching: string;
} {
  const sorted = [...flora]
    .filter((f) => f.kind === "tree" && f.health > 0.15)
    .sort((a, b) => {
      const da = (a.x - near.x) ** 2 + (a.z - near.z) ** 2;
      const db = (b.x - near.x) ** 2 + (b.z - near.z) ** 2;
      return da - db;
    });

  let timberGained = 0;
  let harvested = 0;
  const next = flora.map((f) => ({ ...f }));
  for (const t of sorted) {
    if (timberGained >= amount) break;
    const idx = next.findIndex((x) => x.id === t.id);
    if (idx < 0) continue;
    const node = next[idx]!;
    const yieldT = node.height * node.health * 0.45;
    timberGained += yieldT;
    harvested++;
    // Fell or badly damage tree
    if (node.health < 0.45 || node.height < 1.2) {
      next.splice(idx, 1);
    } else {
      next[idx] = {
        ...node,
        health: node.health * 0.35,
        height: node.height * 0.4,
      };
    }
  }

  const teaching =
    timberGained > 0
      ? `Harvested forest timber +${timberGained.toFixed(1)} (${harvested} trees). Infrastructure needs wood from this planet — forests shrink when we build.`
      : "No healthy trees nearby to harvest — protect or rewild forests first.";

  const ev =
    timberGained > 0.5
      ? ([
          {
            id: `evt-timber-${tick}-${harvested}`,
            tick,
            kind: "deforestation-pulse" as const,
            title: `Forest harvest (+${timberGained.toFixed(1)} timber)`,
            description: `${harvested} trees used for wood. This extraction is permanent history.`,
            scienceTeach:
              "Infrastructure on a new world must come from local materials. Timber harvest reduces canopy and habitat.",
            impact: { floraCoverage: -0.02 * harvested },
          },
        ] as CivilizationState["lockedEvents"])
      : [];

  return {
    flora: next,
    timberGained,
    civ: {
      ...civ,
      forestTimber: Math.max(0, civ.forestTimber - timberGained * 0.3),
      treesHarvested: civ.treesHarvested + harvested,
      lockedEvents: [...civ.lockedEvents, ...ev],
      teachings: [...civ.teachings, teaching].slice(-40),
    },
    teaching,
  };
}

function band(score: number): ScienceTestResult["band"] {
  if (score < 25) return "critical";
  if (score < 40) return "poor";
  if (score < 60) return "moderate";
  if (score < 80) return "good";
  return "excellent";
}

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

export function runScienceTest(
  id: ScienceTestId,
  env: WorldEnv,
  snap: {
    tick: number;
    humanCount: number;
    population: number;
    floraCount: number;
    predatorCount: number;
    settlementCount: number;
    maxGeneration: number;
  },
  civ: CivilizationState,
): ScienceTestResult {
  const climate = deriveClimate(env, snap.tick);
  const aq = airQualityIndex(env.atmosphere);
  const tech = techInfo(civ.techLevel);
  const mon = 0.85 + civ.monitoring * 0.15; // better monitoring = clearer readings

  let score = 50;
  let reading = "";
  let teaching = "";
  let recommendation = "";
  let title = SCIENCE_TESTS.find((t) => t.id === id)?.label ?? id;

  switch (id) {
    case "air-quality": {
      score = Math.round(aq * 100 * mon);
      reading = `AQ index ${(aq * 100).toFixed(0)}/100 · toxin ${(env.atmosphere.toxin * 100).toFixed(1)}% · dust ${(env.atmosphere.particulates * 100).toFixed(1)}% · O₂ ${(env.atmosphere.oxygen * 100).toFixed(0)}%`;
      teaching =
        "Air quality falls when toxins and particulates rise. Industry and large populations often raise both. Outside scrubbers can lower present levels, but past emissions stay in the pollution ledger.";
      recommendation =
        score < 50
          ? "Deploy air scrubbers and raise emission caps. Retest after 50 ticks."
          : "Maintain monitoring. Avoid industrial spikes without filters.";
      break;
    }
    case "water-health": {
      const acid = env.chemicals.acidity;
      const org = env.chemicals.organics;
      score = Math.round((1 - acid * 0.7 - Math.max(0, org - 0.7) * 0.4) * 100 * mon);
      score = Math.max(0, Math.min(100, score));
      reading = `Acidity ${(acid * 100).toFixed(0)}% · organics ${(org * 100).toFixed(0)}% · water cover ${(env.surface.waterCoverage * 100).toFixed(0)}% · N ${env.chemicals.nitrogenNutrient.toFixed(2)} P ${env.chemicals.phosphate.toFixed(2)}`;
      teaching =
        "Water health depends on acidity and dissolved organics. Farm and industry waste can acidify or overload water. Filters help now; the spill event remains history.";
      recommendation =
        score < 50
          ? "Apply water filters and soil repair. Protect kelp/shore zones."
          : "Keep nutrient balance; avoid dumping organics into water.";
      break;
    }
    case "biodiversity": {
      const roleProxy =
        (snap.predatorCount > 0 ? 15 : 0) +
        Math.min(40, snap.floraCount) +
        Math.min(30, snap.population / 3) +
        Math.min(15, snap.maxGeneration);
      score = Math.round(Math.min(100, roleProxy) * mon);
      reading = `Flora groups ${snap.floraCount} · fauna ${snap.population} · predators ${snap.predatorCount} · max gen ${snap.maxGeneration}`;
      teaching =
        "Biodiversity is variety of living forms. High plant + animal diversity buffers climate and disease. Pollution and overpopulation can shrink it.";
      recommendation =
        score < 50
          ? "Rewild planting from outside; reduce hunting pressure; retest."
          : "Protect producer plants — they underpin the whole web.";
      break;
    }
    case "human-pressure": {
      const pressure =
        snap.humanCount * 2.2 +
        snap.settlementCount * 8 +
        tech.rank * 6 +
        civ.pollutionNow * 40;
      score = Math.round(Math.max(0, 100 - pressure) * mon);
      reading = `Humans ${snap.humanCount} · towns ${snap.settlementCount} · tech ${tech.label} · pollution now ${(civ.pollutionNow * 100).toFixed(0)}%`;
      teaching =
        "Human pressure rises with population, towns and technology. Pressure is not always ‘bad’, but it needs matching cleanup and food systems.";
      recommendation =
        score < 45
          ? "Slow growth, raise emission caps, add rewilding. Essay: discuss carrying capacity."
          : "Pressure is manageable; keep monitoring population vs flora.";
      break;
    }
    case "tech-footprint": {
      const foot =
        tech.rank * 12 +
        civ.pollutionLedger * 0.8 +
        civ.pollutionNow * 50 -
        civ.emissionCap * 20 -
        (civ.fixesApplied.length > 0 ? 8 : 0);
      score = Math.round(Math.max(0, 100 - foot) * mon);
      reading = `Tech ${tech.label} (rank ${tech.rank}) · ledger ${civ.pollutionLedger.toFixed(1)} · now ${(civ.pollutionNow * 100).toFixed(0)}% · caps ${(civ.emissionCap * 100).toFixed(0)}%`;
      teaching =
        "Technology multiplies both good (food, medicine, filters) and waste. Footprint tests ask: does tech outrun cleanup?";
      recommendation =
        score < 50
          ? "Install emission caps + air scrubbers before further tech upgrades."
          : "Tech is in balance with remediation — document this for the essay.";
      break;
    }
    case "carrying-capacity": {
      const food =
        climate.foodProductivity * env.foodWeb.primaryProductivity * 40 +
        snap.floraCount * 0.6 +
        env.chemicals.nitrogenNutrient * 15;
      const demand = Math.max(1, snap.humanCount * 1.8 + snap.population * 0.15);
      const ratio = food / demand;
      score = Math.round(Math.min(100, ratio * 45) * mon);
      reading = `Supply proxy ${food.toFixed(0)} · demand proxy ${demand.toFixed(0)} · ratio ${ratio.toFixed(2)} · season ${climate.season}`;
      teaching =
        "Carrying capacity is how many organisms an environment can support sustainably. Seasons change supply. Exceeding capacity raises death and pollution stress.";
      recommendation =
        score < 50
          ? "Increase plant cover (rewild), improve farms carefully, or slow population growth."
          : "Capacity looks healthy for current numbers — retest in winter.";
      break;
    }
  }

  score = Math.max(0, Math.min(100, score));
  return {
    id,
    tick: snap.tick,
    title,
    score,
    band: band(score),
    reading,
    teaching,
    recommendation,
  };
}

/** Advance tech — locks an irreversible upgrade event */
export function applyTechUpgrade(
  civ: CivilizationState,
  next: TechLevelId,
  tick: number,
): { civ: CivilizationState; teaching: string } {
  const cur = techInfo(civ.techLevel);
  const nxt = techInfo(next);
  if (nxt.rank <= cur.rank) {
    return {
      civ,
      teaching: "Tech level already at or above that stage — no change.",
    };
  }
  const ev: LockedEvent = {
    id: `evt-tech-${tick}-${next}`,
    tick,
    kind: "tech-upgrade",
    title: `Technology unlocked: ${nxt.label}`,
    description: `Society moved from ${cur.label} → ${nxt.label}. This historical step cannot be undone.`,
    scienceTeach: nxt.science,
    impact: {
      toxin: nxt.pollutionRate * 8,
      particulates: nxt.pollutionRate * 12,
      co2: nxt.rank * 0.002,
    },
  };
  const teaching = `LOCKED EVENT: ${ev.title}. ${ev.scienceTeach} You cannot reverse the upgrade, but you can fix pollution from the outside.`;
  return {
    civ: {
      ...civ,
      techLevel: next,
      growthModifier: 1 + nxt.popBoost,
      lockedEvents: [...civ.lockedEvents, ev],
      teachings: [...civ.teachings, teaching].slice(-40),
    },
    teaching,
  };
}

/** Population boom pulse — locked */
export function applyPopulationPulse(
  civ: CivilizationState,
  tick: number,
  intensity: number,
): { civ: CivilizationState; teaching: string; extraHumans: number } {
  const extra = Math.max(2, Math.round(3 + intensity * 10));
  const ev: LockedEvent = {
    id: `evt-pop-${tick}`,
    tick,
    kind: "population-boom",
    title: `Population pulse (+${extra} founders)`,
    description: `A migration/birth wave added people. History keeps this growth event forever.`,
    scienceTeach:
      "Rapid population rise increases resource demand and pollution if tech waste is high.",
    impact: { toxin: 0.01 * intensity, particulates: 0.015 * intensity },
  };
  const teaching = `LOCKED EVENT: population +${extra}. Demand on food and air rises. Fix with food systems, rewilding, or emission caps — not by erasing the arrivals.`;
  return {
    civ: {
      ...civ,
      growthModifier: Math.min(2.2, civ.growthModifier + 0.08 * intensity),
      lockedEvents: [...civ.lockedEvents, ev],
      teachings: [...civ.teachings, teaching].slice(-40),
    },
    teaching,
    extraHumans: extra,
  };
}

/** Deliberate pollution introduction — locked history */
export function applyPollutionEvent(
  civ: CivilizationState,
  env: WorldEnv,
  tick: number,
  kind: "smog" | "spill" | "smoke",
): { civ: CivilizationState; env: WorldEnv; teaching: string } {
  const intensity = kind === "spill" ? 0.12 : kind === "smog" ? 0.1 : 0.08;
  const atm = { ...env.atmosphere };
  const chem = { ...env.chemicals };
  if (kind === "smog" || kind === "smoke") {
    atm.toxin = clamp01(atm.toxin + intensity);
    atm.particulates = clamp01(atm.particulates + intensity * 1.2);
    atm.methane = clamp01(atm.methane + intensity * 0.5);
    atm.co2 = clamp01(atm.co2 + intensity * 0.15);
  } else {
    chem.acidity = clamp01(chem.acidity + intensity);
    chem.organics = clamp01(chem.organics + intensity * 0.8);
    atm.toxin = clamp01(atm.toxin + intensity * 0.4);
  }
  const ev: LockedEvent = {
    id: `evt-poll-${tick}-${kind}`,
    tick,
    kind: kind === "spill" ? "industrial-spill" : "pollution-spike",
    title:
      kind === "spill"
        ? "Industrial / farm spill"
        : kind === "smog"
          ? "Smog event"
          : "Smoke pulse",
    description: `A pollution event of type “${kind}” entered the world record at tick ${tick}.`,
    scienceTeach:
      kind === "spill"
        ? "Spills raise acidity and organics in water/soil pathways."
        : "Combustion and industry raise airborne toxins and particulates, lowering air quality and light.",
    impact: {
      toxin: intensity,
      particulates: kind === "spill" ? 0 : intensity,
      acidity: kind === "spill" ? intensity : 0,
    },
  };
  const teaching = `LOCKED EVENT: ${ev.title}. ${ev.scienceTeach} You cannot un-happen it — use EXTERNAL FIXES to improve present conditions.`;
  return {
    env: { ...env, atmosphere: atm, chemicals: chem },
    civ: {
      ...civ,
      pollutionLedger: civ.pollutionLedger + intensity * 20,
      pollutionNow: clamp01(civ.pollutionNow + intensity),
      lockedEvents: [...civ.lockedEvents, ev],
      teachings: [...civ.teachings, teaching].slice(-40),
    },
    teaching,
  };
}

/** External fix — improves present, never deletes locked events */
export function applyExternalFix(
  civ: CivilizationState,
  env: WorldEnv,
  fixId: ExternalFixId,
  tick: number,
): { civ: CivilizationState; env: WorldEnv; teaching: string } {
  const fix = EXTERNAL_FIXES.find((f) => f.id === fixId)!;
  const atm = { ...env.atmosphere };
  const chem = { ...env.chemicals };
  const surface = { ...env.surface };
  const foodWeb = { ...env.foodWeb };
  let emissionCap = civ.emissionCap;
  let monitoring = civ.monitoring;
  let pollutionNow = civ.pollutionNow;
  let growthModifier = civ.growthModifier;

  switch (fixId) {
    case "air-scrubbers":
      atm.toxin = clamp01(atm.toxin * 0.55);
      atm.particulates = clamp01(atm.particulates * 0.5);
      atm.methane = clamp01(atm.methane * 0.7);
      pollutionNow = clamp01(pollutionNow * 0.65);
      break;
    case "water-filters":
      chem.acidity = clamp01(chem.acidity * 0.6);
      chem.organics = clamp01(chem.organics * 0.75);
      break;
    case "rewild-planting":
      surface.floraCoverage = clamp01(surface.floraCoverage + 0.12);
      foodWeb.primaryProductivity = clamp01(foodWeb.primaryProductivity + 0.08);
      foodWeb.regrowth = Math.min(0.2, foodWeb.regrowth + 0.02);
      break;
    case "emission-caps":
      emissionCap = clamp01(emissionCap + 0.25);
      pollutionNow = clamp01(pollutionNow * 0.85);
      growthModifier = Math.max(0.7, growthModifier * 0.92);
      break;
    case "soil-repair":
      chem.nitrogenNutrient = clamp01(chem.nitrogenNutrient + 0.08);
      chem.phosphate = clamp01(chem.phosphate + 0.06);
      chem.acidity = clamp01(chem.acidity * 0.75);
      break;
    case "monitoring-network":
      monitoring = clamp01(monitoring + 0.3);
      break;
  }

  const teaching = `EXTERNAL FIX applied: ${fix.label}. ${fix.science} ${fix.note} (tick ${tick})`;
  return {
    env: {
      ...env,
      atmosphere: atm,
      chemicals: chem,
      surface,
      foodWeb,
    },
    civ: {
      ...civ,
      emissionCap,
      monitoring,
      pollutionNow,
      growthModifier,
      fixesApplied: [...civ.fixesApplied, fixId],
      teachings: [...civ.teachings, teaching].slice(-40),
    },
    teaching,
  };
}

/**
 * Each sim tick: tech + humans generate pollution into env (coupled).
 */
export function stepCivilizationPollution(
  civ: CivilizationState,
  env: WorldEnv,
  humanCount: number,
  tick: number,
): { civ: CivilizationState; env: WorldEnv } {
  if (humanCount <= 0 && civ.techLevel === "none") {
    // slow natural decay of pollutionNow
    return {
      civ: {
        ...civ,
        pollutionNow: clamp01(civ.pollutionNow * 0.995),
      },
      env,
    };
  }

  const tech = techInfo(civ.techLevel);
  const emit =
    tech.pollutionRate *
    (0.3 + humanCount * 0.12) *
    (1 - civ.emissionCap * 0.75) *
    civ.growthModifier;

  const pollutionNow = clamp01(civ.pollutionNow * 0.992 + emit * 3);
  const pollutionLedger = civ.pollutionLedger + emit * 10;

  const atm = { ...env.atmosphere };
  atm.toxin = clamp01(atm.toxin + emit * 0.35);
  atm.particulates = clamp01(atm.particulates + emit * 0.5);
  atm.co2 = clamp01(atm.co2 + emit * 0.08);
  atm.methane = clamp01(atm.methane + emit * 0.05);

  // natural attenuation
  atm.toxin = clamp01(atm.toxin * 0.998);
  atm.particulates = clamp01(atm.particulates * 0.997);

  // rare locked spike if pollution high
  let lockedEvents = civ.lockedEvents;
  let teachings = civ.teachings;
  if (
    pollutionNow > 0.55 &&
    tick % 100 === 0 &&
    humanCount > 4 &&
    tech.rank >= 2
  ) {
    const ev: LockedEvent = {
      id: `evt-auto-${tick}`,
      tick,
      kind: "pollution-spike",
      title: "Chronic pollution threshold crossed",
      description:
        "Sustained emissions crossed a scientific threshold. This remains on the permanent record.",
      scienceTeach:
        "Threshold effects: systems can absorb waste until a point, then air/water quality drops nonlinearly.",
      impact: { toxin: 0.03, particulates: 0.04 },
    };
    lockedEvents = [...lockedEvents, ev];
    teachings = [
      ...teachings,
      `LOCKED: ${ev.title}. Fix from outside with scrubbers/caps — history stays.`,
    ].slice(-40);
  }

  return {
    civ: {
      ...civ,
      pollutionNow,
      pollutionLedger,
      lockedEvents,
      teachings,
    },
    env: { ...env, atmosphere: atm },
  };
}

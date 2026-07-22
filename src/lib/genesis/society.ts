/**
 * Society layer for Genesis Lab:
 *  - sexual mating / procreation (DNA crossover)
 *  - flora sexual & vegetative reproduction
 *  - human inhabitants + human behaviour AI
 */

import { expressGene, replicateDna, type LifeRole } from "./dna";
import type { FloraNode, WorldEnv } from "./world";
import { deriveClimate } from "./world";

// ─── Sex & kinship ───────────────────────────────────

export type Sex = "female" | "male" | "hermaphrodite";

export type KinBond = {
  partnerId: string | null;
  offspringCount: number;
  mateCooldown: number;
  familyId: string;
  parentIds: [string | null, string | null];
};

/** Behaviour for fauna (incl. humans) */
export type CreatureBehaviour =
  | "photosynthesize"
  | "graze"
  | "forage"
  | "hunt"
  | "flee"
  | "migrate"
  | "rest"
  // Human / sapient behaviours
  | "mate-seek"
  | "court"
  | "parent"
  | "farm"
  | "gather"
  | "build"
  | "craft"
  | "teach"
  | "trade"
  | "socialize"
  | "explore"
  | "defend"
  | "ritual";

export type Settlement = {
  id: string;
  x: number;
  z: number;
  size: number; // 0–1 built footprint
  foodStore: number;
  culture: number; // 0–1 shared knowledge
  name: string;
  /** Harvested timber stock (from forest) */
  woodStore: number;
  /** Mined / gathered minerals */
  mineralStore: number;
  /** Roads, halls, workshops 0–1 — built only from wood+minerals */
  infrastructure: number;
};

export function assignSex(rng: () => number, role: LifeRole): Sex {
  if (role === "flora-morph") {
    return rng() < 0.55 ? "hermaphrodite" : rng() < 0.5 ? "female" : "male";
  }
  if (role === "human" || role === "intelligent") {
    return rng() < 0.5 ? "female" : "male";
  }
  // Many invertebrates etc. — some hermaphrodites
  if (rng() < 0.12) return "hermaphrodite";
  return rng() < 0.5 ? "female" : "male";
}

export function newKinBond(
  familyId: string,
  rng: () => number,
): KinBond {
  return {
    partnerId: null,
    offspringCount: 0,
    mateCooldown: Math.floor(rng() * 4),
    familyId,
    parentIds: [null, null],
  };
}

/** Compatible pair for sexual reproduction */
export function canMateSex(a: Sex, b: Sex): boolean {
  if (a === "hermaphrodite" || b === "hermaphrodite") return true;
  return a !== b;
}

/**
 * Sexual procreation: crossover of two DNA strands + mutation.
 * Models meiosis-like mixing of parental genomes.
 */
export function sexualCrossover(
  dnaA: string,
  dnaB: string,
  mutRate: number,
  rng: () => number,
): string {
  const len = Math.max(dnaA.length, dnaB.length);
  const pad = (s: string) =>
    s.length >= len ? s.slice(0, len) : s + s.slice(0, len - s.length);
  const A = pad(dnaA);
  const B = pad(dnaB);
  // 1–3 crossover points
  const cuts = Math.max(1, Math.floor(1 + rng() * 3));
  const points = Array.from({ length: cuts }, () =>
    Math.floor(rng() * len),
  ).sort((x, y) => x - y);

  let useA = rng() < 0.5;
  let out = "";
  let pi = 0;
  for (let i = 0; i < len; i++) {
    if (pi < points.length && i === points[pi]) {
      useA = !useA;
      pi++;
    }
    out += useA ? A[i]! : B[i]!;
  }
  return replicateDna(out, mutRate, rng);
}

// ─── Human behaviour AI ──────────────────────────────

export function isHumanLike(role: LifeRole, intelligence: number): boolean {
  return role === "human" || (role === "intelligent" && intelligence >= 0.7);
}

/**
 * Pick next behaviour from needs, role, environment, settlement.
 * Educational model of human behavioural ecology.
 */
export function chooseBehaviour(opts: {
  role: LifeRole;
  intelligence: number;
  energy: number;
  age: number;
  sex: Sex;
  kin: KinBond;
  predation: number;
  nearbyMate: boolean;
  nearbyThreat: boolean;
  nearSettlement: boolean;
  settlementFood: number;
  season: string;
  rng: () => number;
}): CreatureBehaviour {
  const {
    role,
    intelligence,
    energy,
    age,
    kin,
    nearbyMate,
    nearbyThreat,
    nearSettlement,
    settlementFood,
    season,
    rng,
  } = opts;

  const human = isHumanLike(role, intelligence);

  // Universal threats
  if (nearbyThreat && energy > 0.3) return "flee";
  if (energy < 0.35) {
    if (role === "predator") return "hunt";
    if (role === "flora-morph") return "photosynthesize";
    if (human && nearSettlement && settlementFood > 0.5) return "gather";
    if (human && season !== "winter") return "farm";
    return role === "scavenger" ? "forage" : "graze";
  }

  // Mating drive (humans less often — culture first)
  if (
    age > 6 &&
    kin.mateCooldown <= 0 &&
    energy > (human ? 1.05 : 0.9) &&
    kin.offspringCount < (human ? 4 : 7)
  ) {
    if (nearbyMate && rng() < (human ? 0.55 : 0.75))
      return human ? "court" : "mate-seek";
    if (rng() < (human ? 0.18 : 0.2)) return "mate-seek";
  }

  // Parenting
  if (kin.offspringCount > 0 && age < 40 && human && rng() < 0.2) {
    return "parent";
  }

  if (!human) {
    if (role === "flora-morph") return "photosynthesize";
    if (role === "predator") return rng() < 0.55 ? "hunt" : "rest";
    if (role === "scavenger") return rng() < 0.5 ? "forage" : "migrate";
    if (rng() < 0.15) return "rest";
    if (rng() < 0.2) return "migrate";
    return "graze";
  }

  // ── Human behaviour repertoire ──
  if (nearbyThreat) return "defend";
  if (season === "winter" && energy < 1.2) {
    const w = rng();
    if (w < 0.35) return "gather";
    if (w < 0.5) return "craft";
    if (w < 0.65) return "socialize";
    if (w < 0.8) return "rest";
    return "ritual";
  }

  const r = rng();
  if (!nearSettlement && r < 0.2) return "explore";
  if (nearSettlement) {
    if (settlementFood < 1.2 && r < 0.28) return "farm";
    if (r < 0.12) return "build";
    if (r < 0.2) return "craft";
    if (r < 0.28) return "trade";
    if (r < 0.36) return "teach";
    if (r < 0.48) return "socialize";
    if (r < 0.55) return "ritual";
    if (r < 0.65) return "gather";
    if (r < 0.72) return "explore";
    if (r < 0.8) return "parent";
    return "rest";
  }
  // Nomadic human
  if (r < 0.3) return "forage";
  if (r < 0.45) return "explore";
  if (r < 0.55) return "gather";
  if (r < 0.65) return "socialize";
  return "migrate";
}

/** Apply behaviour effects on energy / settlement / position intent */
export function applyBehaviourEffects(opts: {
  behaviour: CreatureBehaviour;
  energy: number;
  intelligence: number;
  settlement: Settlement | null;
  climateLight: number;
  season: string;
  rng: () => number;
}): {
  energyDelta: number;
  settlementDelta: Partial<Settlement> | null;
  cultureGain: number;
  note: string | null;
} {
  const { behaviour, intelligence, settlement, climateLight, season, rng } =
    opts;
  let energyDelta = 0;
  let cultureGain = 0;
  let settlementDelta: Partial<Settlement> | null = null;
  let note: string | null = null;

  switch (behaviour) {
    case "photosynthesize":
      energyDelta = 0.12 * climateLight;
      break;
    case "graze":
    case "forage":
      energyDelta = 0.08 + rng() * 0.06;
      break;
    case "hunt":
      energyDelta = -0.04; // net from hunt elsewhere
      break;
    case "flee":
      energyDelta = -0.06;
      break;
    case "migrate":
    case "explore":
      energyDelta = -0.03;
      cultureGain = behaviour === "explore" ? 0.01 * intelligence : 0;
      break;
    case "rest":
      energyDelta = 0.04;
      break;
    case "mate-seek":
    case "court":
      energyDelta = -0.05;
      break;
    case "parent":
      energyDelta = -0.06;
      cultureGain = 0.015 * intelligence;
      note = "parenting / alloparenting care";
      break;
    case "farm": {
      const grow =
        (season === "winter" ? 0.15 : 0.55) * climateLight * (0.6 + intelligence);
      energyDelta = 0.05 + grow * 0.08;
      if (settlement) {
        settlementDelta = {
          foodStore: Math.min(12, settlement.foodStore + grow * 0.35),
        };
      }
      note = "farming / cultivation";
      break;
    }
    case "gather":
      energyDelta = 0.1;
      if (settlement) {
        // Gather food + some loose wood/minerals from the land
        settlementDelta = {
          foodStore: Math.min(12, settlement.foodStore + 0.25),
          woodStore: Math.min(20, (settlement.woodStore ?? 0) + 0.08),
          mineralStore: Math.min(16, (settlement.mineralStore ?? 0) + 0.05),
        };
      }
      break;
    case "build": {
      energyDelta = -0.08;
      if (settlement) {
        // Infrastructure requires planetary resources (timber + minerals)
        const wood = settlement.woodStore ?? 0;
        const min = settlement.mineralStore ?? 0;
        const needW = 0.35;
        const needM = 0.15;
        if (wood >= needW && min >= needM) {
          const gain = 0.04 + intelligence * 0.025;
          settlementDelta = {
            woodStore: wood - needW,
            mineralStore: min - needM,
            infrastructure: Math.min(
              1,
              (settlement.infrastructure ?? 0) + gain,
            ),
            size: Math.min(1, settlement.size + gain * 0.7),
          };
          note = "building infrastructure from timber & minerals";
        } else {
          // Not enough stock — only gather attempt, no build
          settlementDelta = {
            woodStore: Math.min(20, wood + 0.12),
            mineralStore: Math.min(16, min + 0.06),
          };
          note = "need more forest timber / minerals to build";
          energyDelta = -0.04;
        }
      }
      break;
    }
    case "craft":
      energyDelta = -0.05;
      cultureGain = 0.02 * intelligence;
      if (settlement) {
        const wood = settlement.woodStore ?? 0;
        settlementDelta = {
          culture: Math.min(1, settlement.culture + 0.015),
          // Craft spends a little wood
          woodStore: Math.max(0, wood - 0.05),
        };
      }
      note = "crafting tools / goods from local materials";
      break;
    case "teach":
      energyDelta = -0.03;
      cultureGain = 0.03 * intelligence;
      if (settlement) {
        settlementDelta = {
          culture: Math.min(1, settlement.culture + 0.025),
        };
      }
      note = "teaching next generation";
      break;
    case "trade":
      energyDelta = 0.04;
      cultureGain = 0.01;
      if (settlement) {
        settlementDelta = {
          foodStore: Math.min(12, settlement.foodStore + 0.1),
          culture: Math.min(1, settlement.culture + 0.01),
        };
      }
      note = "trade / exchange";
      break;
    case "socialize":
      energyDelta = -0.02;
      cultureGain = 0.012 * intelligence;
      note = "social bonding";
      break;
    case "defend":
      energyDelta = -0.07;
      note = "defending kin / settlement";
      break;
    case "ritual":
      energyDelta = -0.02;
      cultureGain = 0.02;
      if (settlement) {
        settlementDelta = {
          culture: Math.min(1, settlement.culture + 0.02),
        };
      }
      note = "ritual / shared culture";
      break;
    default:
      break;
  }

  return { energyDelta, settlementDelta, cultureGain, note };
}

// ─── Settlements ─────────────────────────────────────

const PLACE_NAMES = [
  "Hearth",
  "Riverford",
  "Oakrest",
  "Sunvale",
  "Mistglen",
  "Stonebarrow",
  "Greenhold",
  "Dawnmere",
];

export function seedSettlements(
  env: WorldEnv,
  humanCount: number,
  rng: () => number,
): Settlement[] {
  if (humanCount < 2) return [];
  const n = Math.min(3, Math.max(1, Math.floor(humanCount / 4)));
  const out: Settlement[] = [];
  for (let i = 0; i < n; i++) {
    const ang = (i / n) * Math.PI * 2 + rng();
    const r = 4 + rng() * 5;
    out.push({
      id: `town-${i}`,
      x: Math.cos(ang) * r,
      z: Math.sin(ang) * r,
      size: 0.2 + rng() * 0.15,
      foodStore: 2 + rng() * 2,
      culture: 0.15 + rng() * 0.15,
      name: PLACE_NAMES[i % PLACE_NAMES.length]!,
      woodStore: 0.1 + rng() * 0.15, // must harvest forest to build more
      mineralStore: 0.2 + rng() * 0.25,
      infrastructure: 0.04 + rng() * 0.06,
    });
  }
  return out;
}

export function nearestSettlement(
  x: number,
  z: number,
  towns: Settlement[],
): { town: Settlement | null; dist: number } {
  let best: Settlement | null = null;
  let bd = Infinity;
  for (const t of towns) {
    const d = (t.x - x) ** 2 + (t.z - z) ** 2;
    if (d < bd) {
      bd = d;
      best = t;
    }
  }
  return { town: best, dist: Math.sqrt(bd) };
}

// ─── Flora reproduction ──────────────────────────────

export type LiveFlora = FloraNode & {
  age: number;
  energy: number;
  generation: number;
  sex: Sex;
  mateCooldown: number;
  parentId: string | null;
};

export function toLiveFlora(nodes: FloraNode[], rng: () => number): LiveFlora[] {
  return nodes.map((n, i) => ({
    ...n,
    age: Math.floor(rng() * 20),
    energy: 0.5 + n.health * 0.5,
    generation: 0,
    sex:
      rng() < 0.4 ? "hermaphrodite" : rng() < 0.5 ? "female" : ("male" as Sex),
    mateCooldown: Math.floor(rng() * 5),
    parentId: null,
    id: n.id || `flora-${i}`,
  }));
}

/**
 * Step flora: grow, photosynthesize, vegetative budding, sexual seeding.
 */
export function stepFloraReproduction(
  flora: LiveFlora[],
  env: WorldEnv,
  tick: number,
  rng: () => number,
): { flora: LiveFlora[]; births: number; seeds: number; log: string[] } {
  const climate = deriveClimate(env, tick);
  const log: string[] = [];
  let births = 0;
  let seeds = 0;
  const maxFlora = Math.floor(20 + env.surface.floraCoverage * 70);
  const next: LiveFlora[] = [];
  const mated = new Set<string>();

  for (const f of flora) {
    if (f.health < 0.05) continue;

    // Photosynthesis / growth
    const photo =
      climate.lightLevel *
      climate.foodProductivity *
      (0.06 + env.atmosphere.co2 * 0.1) *
      (climate.season === "winter" ? 0.55 : 1) *
      (f.kind === "tree" ? 1.15 : f.kind === "moss" ? 0.8 : 1);
    let energy = Math.max(0.15, f.energy + photo - 0.012);
    let health = f.health;
    let height = f.height;
    const age = f.age + 1;
    let mateCooldown = Math.max(0, f.mateCooldown - 1);

    if (climate.season === "winter") {
      energy = Math.max(0.12, energy - 0.015);
      health *= 0.998;
    } else if (climate.season === "spring" || climate.season === "summer") {
      height = Math.min(
        f.kind === "tree" ? 4.5 : f.kind === "shrub" ? 1.4 : 1.8,
        height + 0.008 * photo * 10,
      );
      health = Math.min(1, health + 0.012 * photo);
    }

    // Trees live long; only remove very old/weak
    if (age > (f.kind === "tree" ? 280 : 140) && energy < 0.2) {
      continue;
    }
    if (health < 0.04) continue;

    // Vegetative reproduction (cloning / runners / budding)
    if (
      next.length < maxFlora &&
      energy > 1.1 &&
      age > 8 &&
      health > 0.45 &&
      rng() < env.surface.floraCoverage * 0.04 * (climate.season === "spring" ? 2 : 1)
    ) {
      const ang = rng() * Math.PI * 2;
      const dist = 0.6 + rng() * 1.4;
      next.push({
        id: `flora-${tick}-${births}-${f.id}`,
        x: clamp(f.x + Math.cos(ang) * dist, -11, 11),
        z: clamp(f.z + Math.sin(ang) * dist, -11, 11),
        height: f.height * (0.35 + rng() * 0.25),
        radius: f.radius * 0.55,
        kind: f.kind,
        health: 0.4 + rng() * 0.25,
        age: 0,
        energy: 0.45,
        generation: f.generation + 1,
        sex: assignFloraSex(rng),
        mateCooldown: 3,
        parentId: f.id,
      });
      energy -= 0.35;
      births++;
    }

    // Sexual seeding: nearby compatible flora exchange pollen/seeds
    if (
      !mated.has(f.id) &&
      mateCooldown <= 0 &&
      energy > 0.9 &&
      age > 12 &&
      next.length < maxFlora &&
      (climate.season === "spring" || climate.season === "summer")
    ) {
      let partner: LiveFlora | null = null;
      let bestD = 3.2 * 3.2;
      for (const o of flora) {
        if (o.id === f.id || mated.has(o.id)) continue;
        if (!canMateSex(f.sex, o.sex)) continue;
        if (o.mateCooldown > 0 || o.age < 12 || o.energy < 0.85) continue;
        // Same kind prefers sexual seed
        const d = (o.x - f.x) ** 2 + (o.z - f.z) ** 2;
        const pen = o.kind === f.kind ? 1 : 1.4;
        if (d * pen < bestD) {
          bestD = d * pen;
          partner = o;
        }
      }
      if (partner && bestD < 3.2 * 3.2 && rng() < 0.35) {
        mated.add(f.id);
        mated.add(partner.id);
        mateCooldown = 10;
        energy -= 0.2;
        // Seed offspring hybrid kind sometimes
        const kind =
          rng() < 0.85
            ? f.kind
            : rng() < 0.5
              ? f.kind
              : partner.kind;
        const ang = rng() * Math.PI * 2;
        const dist = 1.2 + rng() * 2.5;
        next.push({
          id: `seed-${tick}-${seeds}-${f.id}`,
          x: clamp(f.x + Math.cos(ang) * dist, -11, 11),
          z: clamp(f.z + Math.sin(ang) * dist, -11, 11),
          height: Math.min(f.height, partner.height) * 0.3,
          radius: (f.radius + partner.radius) * 0.3,
          kind,
          health: 0.35 + rng() * 0.3,
          age: 0,
          energy: 0.4,
          generation: Math.max(f.generation, partner.generation) + 1,
          sex: assignFloraSex(rng),
          mateCooldown: 5,
          parentId: f.id,
        });
        seeds++;
        if (seeds <= 2 && tick % 30 < 3) {
          log.push(
            `t=${tick}: flora sexual seed (${f.kind} × ${partner.kind}) → new ${kind}.`,
          );
        }
      }
    }

    next.push({
      ...f,
      energy: Math.min(2.5, energy),
      health,
      height,
      age,
      mateCooldown,
    });
  }

  // Soft floor — never let flora go fully extinct on vegetated worlds
  if (
    next.length < 6 &&
    env.surface.floraCoverage > 0.3 &&
    climate.season !== "winter"
  ) {
    for (let i = next.length; i < 8; i++) {
      next.push({
        id: `flora-regen-${tick}-${i}`,
        x: (rng() - 0.5) * 16,
        z: (rng() - 0.5) * 16,
        height: 0.4 + rng() * 0.8,
        radius: 0.2 + rng() * 0.2,
        kind: rng() < env.surface.canopyRatio ? "tree" : "shrub",
        health: 0.5,
        age: 0,
        energy: 0.6,
        generation: 0,
        sex: assignFloraSex(rng),
        mateCooldown: 2,
        parentId: null,
      });
      births++;
    }
  }

  const capped = next.slice(0, maxFlora);
  return { flora: capped, births, seeds, log };
}

function assignFloraSex(rng: () => number): Sex {
  if (rng() < 0.45) return "hermaphrodite";
  return rng() < 0.5 ? "female" : "male";
}

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

/** Human starter genome — high DNA-binding / mind theme */
export const HUMAN_STARTER_DNA =
  "ATGAAGCGCAAGCGCAAGAAGAGCGCCAAGCGCAAGTGCGGCAAGCGTAACTACCTGCGTAAG";

export function classifyHumanRole(
  intelligence: number,
  culture: number,
  current: LifeRole,
): LifeRole {
  if (intelligence >= 0.62 && culture >= 0.12) return "human";
  if (intelligence >= 0.55) return "intelligent";
  return current;
}

/** Behaviour label for UI */
export function behaviourLabel(b: CreatureBehaviour): string {
  const map: Record<CreatureBehaviour, string> = {
    photosynthesize: "Photosynthesizing",
    graze: "Grazing",
    forage: "Foraging",
    hunt: "Hunting",
    flee: "Fleeing",
    migrate: "Migrating",
    rest: "Resting",
    "mate-seek": "Seeking mate",
    court: "Courting",
    parent: "Parenting",
    farm: "Farming",
    gather: "Gathering",
    build: "Building",
    craft: "Crafting",
    teach: "Teaching",
    trade: "Trading",
    socialize: "Socializing",
    explore: "Exploring",
    defend: "Defending",
    ritual: "Ritual",
  };
  return map[b] ?? b;
}


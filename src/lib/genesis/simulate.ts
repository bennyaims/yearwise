import {
  classifyLifeRole,
  expressGene,
  randomDna,
  replicateDna,
  STARTER_STRAINS,
  type GeneExpression,
  type LifeRole,
  type OrganismTraits,
} from "./dna";
import {
  buildFaunaDna,
  faunaForceRole,
  FLORA_KINDS,
  type FaunaBlueprint,
  type FloraBlueprint,
} from "./creator";
import {
  applyBehaviourEffects,
  assignSex,
  behaviourLabel,
  canMateSex,
  chooseBehaviour,
  HUMAN_STARTER_DNA,
  isHumanLike,
  nearestSettlement,
  newKinBond,
  seedSettlements,
  sexualCrossover,
  stepFloraReproduction,
  toLiveFlora,
  type CreatureBehaviour,
  type KinBond,
  type LiveFlora,
  type Settlement,
  type Sex,
} from "./society";
import {
  defaultCivilization,
  harvestForestForTimber,
  stepCivilizationPollution,
  type CivilizationState,
} from "./tech-science";
import {
  airQualityIndex,
  createFoodPatches,
  deriveClimate,
  estimateForestTimber,
  generateFlora,
  regrowFoodPatches,
  STAR_PRESETS,
  type FoodPatch,
  type WorldEnv,
} from "./world";

/** Biology ORFs used when seeding a full food-web without extinction */
const SEED_PHOTO =
  STARTER_STRAINS.find((s) => s.id === "photosystem")?.dna ??
  "ATGTTCTGGTACCTGGCCCTGGGCCTGTTCTGGTAA";
const SEED_MOTOR =
  STARTER_STRAINS.find((s) => s.id === "motor")?.dna ??
  "ATGGAGAAGCTGCGCAAGGAGCTGGTGGAGAAGTAAG";
const SEED_PRED =
  STARTER_STRAINS.find((s) => s.id === "predator-motor")?.dna ??
  "ATGGAGAAGATTATCCTGCGCGAGGTGGCCTGGTAA";
const SEED_MIND =
  STARTER_STRAINS.find((s) => s.id === "tf-mind")?.dna ??
  "ATGAAGCGCAAGCGCAAGAAGAGCGCCAAGTAAG";
const SEED_MEMBRANE =
  STARTER_STRAINS.find((s) => s.id === "membrane")?.dna ??
  "ATGCTGATTGTGCTGTTCCTGGTGGCCATCTACTAAG";
const SEED_GLOBIN =
  STARTER_STRAINS.find((s) => s.id === "globin")?.dna ??
  "ATGGCCCTGCACGAGCTGGCCAAGCACCTGGCCTAAG";
const SEED_COAT =
  STARTER_STRAINS.find((s) => s.id === "coat-shell")?.dna ??
  "ATGTGCGGACCTGGCTGCCCGGGCTGCTGCTAAG";

export type Organism = {
  id: string;
  generation: number;
  expression: GeneExpression;
  role: LifeRole;
  x: number;
  z: number;
  energy: number;
  age: number;
  lineage: string;
  kills: number;
  /** Biological sex for mating */
  sex: Sex;
  kin: KinBond;
  /** Current behaviour (incl. human behaviours) */
  behaviour: CreatureBehaviour;
  /** Individual culture / skill 0–1 */
  culture: number;
  /** Born via sexual mating (vs asexual clone) */
  sexualBirth: boolean;
};

export type SimStats = {
  tick: number;
  population: number;
  births: number;
  deaths: number;
  avgFitness: number;
  dominantProtein: string;
  maxGeneration: number;
  season: string;
  airQuality: number;
  lightLevel: number;
  tempC: number;
  foodTotal: number;
  yearPhase: number;
  floraCount: number;
  predatorCount: number;
  intelligentCount: number;
  herbivoreCount: number;
  waterCoverage: number;
  /** Sexual matings this run */
  matings: number;
  /** Sexual births */
  sexualBirths: number;
  asexualBirths: number;
  floraBirths: number;
  floraSeeds: number;
  humanCount: number;
  settlementCount: number;
  dominantBehaviour: string;
  /** Technology rank label */
  techLevel: string;
  /** Current pollution intensity 0–100 */
  pollutionPct: number;
  /** Cumulative pollution ledger (history) */
  pollutionLedger: number;
  /** Locked irreversible events count */
  lockedEventCount: number;
  /** Standing forest timber resource */
  forestTimber: number;
  /** Town wood stock total */
  woodStock: number;
  /** Town mineral stock total */
  mineralStock: number;
  /** Average infrastructure 0–100% */
  infrastructurePct: number;
  /** Trees felled (ledger) */
  treesHarvested: number;
};

export type SimState = {
  organisms: Organism[];
  env: WorldEnv;
  foodPatches: FoodPatch[];
  flora: LiveFlora[];
  settlements: Settlement[];
  /** Tech, pollution, tests, locked history */
  civilization: CivilizationState;
  stats: SimStats;
  log: string[];
};

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function dist2(ax: number, az: number, bx: number, bz: number) {
  const dx = ax - bx;
  const dz = az - bz;
  return dx * dx + dz * dz;
}

export function fitness(
  traits: OrganismTraits,
  env: WorldEnv,
  tick = 0,
  foodBonus = 0,
  role?: LifeRole,
): number {
  const climate = deriveClimate(env, tick);
  const star = STAR_PRESETS[env.star];
  const aq = climate.airQuality;

  const lightIncome =
    traits.lightUse * climate.lightLevel * 1.15 * climate.dayLengthFactor;
  const chemoIncome =
    traits.chemoUse *
    (0.35 * env.chemicals.minerals +
      0.25 * env.chemicals.organics +
      0.2 * env.atmosphere.methane +
      0.15 * env.chemicals.phosphate) *
    1.1;
  const digestIncome = foodBonus * traits.digestion * 1.3;
  // Flora coverage boosts photo/herbivore background
  const floraBoost =
    env.surface.floraCoverage * climate.foodProductivity * 0.25;
  const metaBackground =
    traits.metabolism * 0.12 * (1 - climate.lightLevel * 0.25);

  let income =
    lightIncome +
    chemoIncome +
    digestIncome +
    metaBackground +
    (role === "flora-morph" || role === "herbivore" ? floraBoost * traits.lightUse : 0) +
    (role === "herbivore" || role === "omnivore" || role === "scavenger"
      ? floraBoost * traits.digestion * 0.5
      : 0);

  // Water access: high water helps humidity-linked life, hurts pure land giants slightly
  income *= 0.9 + env.surface.waterCoverage * 0.2 * (0.5 + traits.chemoUse);

  const nutrient =
    0.5 +
    0.25 * env.chemicals.nitrogenNutrient +
    0.15 * env.chemicals.phosphate +
    0.1 * env.chemicals.organics;
  income *= 0.75 + nutrient * 0.35;

  const o2 = env.atmosphere.oxygen;
  const o2Fit = 1 - Math.abs(traits.oxygenNeed * 0.4 - o2) * 1.5;
  income *= clamp(o2Fit, 0.15, 1.3);
  income += traits.lightUse * env.atmosphere.co2 * 0.85;

  const aqNeed = 0.3 + traits.oxygenNeed * 0.25 - traits.toxinResist * 0.15;
  income *= clamp(1 - Math.max(0, aqNeed - aq) * 0.9, 0.25, 1.15);

  // Intelligence culture bonus (tool use / cooperation proxy)
  if (traits.intelligence > 0.5) {
    income += traits.intelligence * 0.2 * (0.5 + aq);
  }

  let cost =
    traits.size * 0.25 * env.gravity +
    traits.speed * 0.12 +
    traits.metabolism * 0.2 +
    traits.armor * 0.15 +
    traits.digestion * 0.05 +
    traits.predation * 0.08 +
    traits.intelligence * 0.1;

  cost *= 0.7 + env.gravity * 0.35;

  const tempStress = Math.abs(climate.tempC - 20) / 50;
  cost +=
    tempStress *
    (1.2 - traits.toxinResist * 0.2 - traits.seasonalHardiness * 0.25);

  if (climate.season === "winter") {
    cost += 0.25 * (1.1 - traits.seasonalHardiness);
    income *= 0.75 + traits.seasonalHardiness * 0.3;
  }
  if (climate.season === "summer" && climate.tempC > 38) {
    cost += 0.12 * (1 - traits.armor * 0.3);
  }

  cost += star.uv * 0.12 * climate.orbitalLightMod * (1 - traits.armor * 0.4);
  cost += env.atmosphere.toxin * 0.85 * (1.2 - traits.toxinResist);
  cost += env.chemicals.acidity * 0.35 * (1.1 - traits.chemoUse * 0.5);
  cost += env.atmosphere.particulates * 0.2 * (1 - aq);

  income += traits.sensing * 0.07;
  income += traits.energyEfficiency * 0.25;

  return clamp(income - cost, 0.01, 4.5);
}

export function createOrganism(
  dna: string,
  generation: number,
  lineage: string,
  rng: () => number,
  opts?: {
    energyBoost?: number;
    forceRole?: LifeRole;
    sex?: Sex;
    familyId?: string;
    parentIds?: [string | null, string | null];
    sexualBirth?: boolean;
    culture?: number;
    x?: number;
    z?: number;
  },
): Organism {
  const expression = expressGene(dna);
  let role = opts?.forceRole ?? classifyLifeRole(expression.traits);
  if (opts?.forceRole === "human") role = "human";
  const boost = opts?.energyBoost ?? 0;
  const sex = opts?.sex ?? assignSex(rng, role);
  const familyId = opts?.familyId ?? `F-${lineage}-${Math.floor(rng() * 1e5)}`;
  const kin = newKinBond(familyId, rng);
  if (opts?.parentIds) kin.parentIds = opts.parentIds;
  const culture =
    opts?.culture ??
    (role === "human" || role === "intelligent"
      ? 0.2 + expression.traits.intelligence * 0.3
      : 0.05);
  const behaviour: CreatureBehaviour =
    role === "human"
      ? "socialize"
      : role === "flora-morph"
        ? "photosynthesize"
        : role === "predator"
          ? "hunt"
          : "graze";
  return {
    id: `org-${Math.floor(rng() * 1e9)}`,
    generation,
    expression,
    role,
    x: opts?.x ?? (rng() - 0.5) * 18,
    z: opts?.z ?? (rng() - 0.5) * 18,
    energy: 2.2 + expression.traits.size * 0.55 + boost,
    age: 0,
    lineage,
    kills: 0,
    sex,
    kin,
    behaviour,
    culture: clamp(culture, 0, 1),
    sexualBirth: opts?.sexualBirth ?? false,
  };
}

function countRoles(organisms: Organism[]) {
  let predatorCount = 0;
  let intelligentCount = 0;
  let herbivoreCount = 0;
  let humanCount = 0;
  for (const o of organisms) {
    if (o.role === "predator") predatorCount++;
    if (o.role === "intelligent") intelligentCount++;
    if (o.role === "human") {
      humanCount++;
      intelligentCount++;
    }
    if (o.role === "herbivore" || o.role === "flora-morph") herbivoreCount++;
  }
  return { predatorCount, intelligentCount, herbivoreCount, humanCount };
}

function dominantBehaviour(organisms: Organism[]): string {
  const m = new Map<string, number>();
  for (const o of organisms) {
    m.set(o.behaviour, (m.get(o.behaviour) ?? 0) + 1);
  }
  const top = [...m.entries()].sort((a, b) => b[1] - a[1])[0];
  return top ? behaviourLabel(top[0] as CreatureBehaviour) : "—";
}

export type SeedOptions = {
  /** School journey: no humans until pathway (default true for Eden education) */
  allowHumans?: boolean;
  /** Allow intelligent (non-human) mind spark */
  allowMind?: boolean;
  /** Extra plant/animal diversity packs */
  maxDiversity?: boolean;
};

/**
 * Seed biosphere. Educational default: thriving Eden with plant + animal
 * diversity on land and water — humans only if allowHumans.
 */
export function seedWorld(
  env: WorldEnv,
  strainDna: string,
  count = 22,
  opts: SeedOptions = {},
): SimState {
  const allowHumans = opts.allowHumans ?? false;
  const allowMind = opts.allowMind ?? env.surface.intelligenceSeed > 0.15;
  const maxDiversity = opts.maxDiversity ?? true;
  const rng = mulberry32(env.seed);
  const organisms: Organism[] = [];
  const paradise =
    env.foodWeb.primaryProductivity >= 0.85 &&
    env.atmosphere.toxin < 0.05 &&
    env.surface.floraCoverage >= 0.7;

  // Core colony from selected strain
  const core = paradise ? Math.max(count, maxDiversity ? 16 : 14) : count;
  for (let i = 0; i < core; i++) {
    const dna = replicateDna(strainDna, paradise ? 0.015 : 0.02, rng);
    organisms.push(
      createOrganism(dna, 0, `Wild${i}`, rng, {
        energyBoost: paradise ? 0.8 : 0,
      }),
    );
  }

  // Rich fauna diversity: land + water-adapted themes
  if (paradise || env.surface.floraCoverage > 0.5 || maxDiversity) {
    const diversify: {
      dna: string;
      lineage: string;
      n: number;
      forceRole?: LifeRole;
    }[] = [
      { dna: SEED_PHOTO, lineage: "Leaf", n: maxDiversity ? 8 : 5, forceRole: "flora-morph" },
      { dna: SEED_MEMBRANE, lineage: "Shore", n: maxDiversity ? 5 : 3 },
      { dna: SEED_GLOBIN, lineage: "Breath", n: maxDiversity ? 4 : 2 },
      { dna: SEED_MOTOR, lineage: "Runner", n: maxDiversity ? 5 : 3 },
      { dna: SEED_COAT, lineage: "Shell", n: maxDiversity ? 4 : 2 },
      // Water-leaning (membrane + photo mix)
      {
        dna: "ATGCTGATTGTGCTGTTCCTGGTGGCCATCTACCTGATTGTGTAAG",
        lineage: "Wave",
        n: maxDiversity ? 5 : 2,
      },
      {
        dna: "ATGTTCTGGTACCTGGCCCTGGGCCTGTTCTGGTACCTGCACCTGGCCTAAG",
        lineage: "Sun",
        n: maxDiversity ? 4 : 2,
        forceRole: "flora-morph",
      },
      {
        dna: "ATGGAGAAGCTGCGCAAGGAGCTGGTGGAGAAGGGCAAGGAGAAGTAAG",
        lineage: "Swift",
        n: maxDiversity ? 3 : 2,
      },
      {
        dna: "ATGCTTCTCCTAGGTGGTGGCAGAGGTAAG",
        lineage: "Sift",
        n: maxDiversity ? 3 : 1,
        forceRole: "scavenger",
      },
    ];
    for (const d of diversify) {
      for (let i = 0; i < d.n; i++) {
        // Place water lineages nearer the pond
        const waterR = Math.sqrt(env.surface.waterCoverage) * 9.5;
        const nearWater =
          d.lineage === "Wave" || d.lineage === "Shore" || d.lineage === "Sun";
        const ang = rng() * Math.PI * 2;
        const r = nearWater
          ? waterR * (0.75 + rng() * 0.5)
          : 3 + rng() * 9;
        organisms.push(
          createOrganism(
            replicateDna(d.dna, 0.02, rng),
            0,
            `${d.lineage}${i}`,
            rng,
            {
              energyBoost: paradise ? 0.7 : 0.2,
              forceRole: d.forceRole,
              x: Math.cos(ang) * r,
              z: Math.sin(ang) * r,
            },
          ),
        );
      }
    }
  }

  // Predators — few, so diversity thrives
  if (env.surface.predatorPressure > 0.08) {
    const n = paradise
      ? maxDiversity
        ? 3
        : 2
      : Math.min(3, Math.max(1, Math.floor(env.surface.predatorPressure * 3)));
    for (let i = 0; i < n; i++) {
      organisms.push(
        createOrganism(replicateDna(SEED_PRED, 0.02, rng), 0, `Hunt${i}`, rng, {
          energyBoost: 0.4,
          forceRole: "predator",
        }),
      );
    }
  }

  // Mind spark only if allowed (Y10+) — not humans
  if (allowMind && env.surface.intelligenceSeed > 0.1) {
    const mindN = Math.min(2, Math.floor(1 + env.surface.intelligenceSeed * 2));
    for (let i = 0; i < mindN; i++) {
      organisms.push(
        createOrganism(
          replicateDna(SEED_MIND, 0.02, rng),
          0,
          `Mind${i}`,
          rng,
          {
            energyBoost: 0.8,
            forceRole: "intelligent",
            culture: 0.15,
          },
        ),
      );
    }
  }

  // Humans only when school pathway / options allow
  if (allowHumans && env.surface.intelligenceSeed > 0.2) {
    const humanN = Math.max(4, Math.floor(env.surface.intelligenceSeed * 8));
    for (let i = 0; i < humanN; i++) {
      organisms.push(
        createOrganism(
          replicateDna(HUMAN_STARTER_DNA, 0.01, rng),
          0,
          `Human${i}`,
          rng,
          {
            energyBoost: 1.5,
            forceRole: "human",
            sex: i % 2 === 0 ? "female" : "male",
            familyId: `Clan-${Math.floor(i / 2)}`,
            culture: 0.4 + rng() * 0.2,
          },
        ),
      );
    }
  }

  const foodPatches = createFoodPatches(env, rng);
  const filledPatches = paradise
    ? foodPatches.map((p) => ({
        ...p,
        energy: env.foodWeb.patchCapacity * (0.75 + rng() * 0.25),
      }))
    : foodPatches;

  // Dense multi-kind flora (land + water)
  let flora = toLiveFlora(generateFlora(env, 0), rng);
  if (maxDiversity) {
    const waterR = Math.sqrt(env.surface.waterCoverage) * 9.5;
    const extra: typeof flora = [];
    // Heaps of forest: trees dominate extras
    const kinds: Array<"moss" | "shrub" | "tree" | "kelp"> = [
      "tree",
      "tree",
      "tree",
      "tree",
      "tree",
      "shrub",
      "moss",
      "kelp",
      "tree",
    ];
    for (let i = 0; i < 48; i++) {
      const kind = kinds[i % kinds.length]!;
      const ang = rng() * Math.PI * 2;
      const r =
        kind === "kelp"
          ? waterR * (0.5 + rng() * 0.45)
          : 1.5 + rng() * 11;
      extra.push({
        id: `flora-div-${i}`,
        x: clamp(Math.cos(ang) * r, -11, 11),
        z: clamp(Math.sin(ang) * r, -11, 11),
        height:
          kind === "tree"
            ? 2 + rng() * 2.2
            : kind === "shrub"
              ? 0.5 + rng() * 0.5
              : kind === "kelp"
                ? 1 + rng() * 1.2
                : 0.12 + rng() * 0.15,
        radius: kind === "tree" ? 0.45 : kind === "shrub" ? 0.28 : 0.15,
        kind,
        health: 0.7 + rng() * 0.28,
        age: Math.floor(rng() * 20),
        energy: 0.75 + rng() * 0.4,
        generation: 0,
        sex:
          rng() < 0.4 ? "hermaphrodite" : rng() < 0.5 ? "female" : "male",
        mateCooldown: Math.floor(rng() * 4),
        parentId: null,
      });
    }
    flora = [...flora, ...extra].slice(0, 120);
  }

  const climate = deriveClimate(env, 0);
  const roles = countRoles(organisms);
  const settlements =
    allowHumans && roles.humanCount > 0
      ? seedSettlements(env, roles.humanCount, rng)
      : [];

  if (settlements[0]) {
    let hi = 0;
    for (const o of organisms) {
      if (o.role !== "human") continue;
      const t = settlements[hi % settlements.length]!;
      o.x = t.x + (rng() - 0.5) * 2.5;
      o.z = t.z + (rng() - 0.5) * 2.5;
      hi++;
    }
  }

  const timber = estimateForestTimber(flora);
  const treeCount = flora.filter((f) => f.kind === "tree").length;
  const civilization: CivilizationState = {
    ...defaultCivilization(),
    forestTimber: timber,
    planetaryMinerals: 35 + env.chemicals.minerals * 40,
  };
  return {
    organisms,
    env,
    foodPatches: filledPatches,
    flora,
    settlements,
    civilization,
    stats: {
      tick: 0,
      population: organisms.length,
      births: 0,
      deaths: 0,
      avgFitness: 0,
      dominantProtein: "—",
      maxGeneration: 0,
      season: climate.season,
      airQuality: climate.airQuality,
      lightLevel: climate.lightLevel,
      tempC: climate.tempC,
      foodTotal: filledPatches.reduce((a, p) => a + p.energy, 0),
      yearPhase: climate.yearPhase,
      floraCount: flora.length,
      waterCoverage: env.surface.waterCoverage,
      matings: 0,
      sexualBirths: 0,
      asexualBirths: 0,
      floraBirths: 0,
      floraSeeds: 0,
      settlementCount: settlements.length,
      dominantBehaviour: dominantBehaviour(organisms),
      techLevel: civilization.techLevel,
      pollutionPct: 0,
      pollutionLedger: 0,
      lockedEventCount: 0,
      forestTimber: Math.round(timber),
      woodStock: 0,
      mineralStock: Math.round(civilization.planetaryMinerals),
      infrastructurePct: 0,
      treesHarvested: 0,
      ...roles,
    },
    log: [
      `Mission world: ${organisms.length} animals · ${flora.length} plants (${treeCount} trees) — dense forest for timber.`,
      allowHumans
        ? `Humans present (${roles.humanCount}) · settlements ${settlements.length}.`
        : "Survey mode: heaps of forest & wildlife — infrastructure later uses local wood & minerals.",
      `Standing timber ≈ ${timber.toFixed(0)} · minerals ≈ ${civilization.planetaryMinerals.toFixed(0)}.`,
      "Build from the planet: harvest forest → wood → infrastructure. History of felling is locked.",
    ],
  };
}

/** Bring humanity into an existing Eden sim (school pathway) */
export function introduceHumanity(
  state: SimState,
  entry:
    | "evolved"
    | "wanderers"
    | "boat-people"
    | "sky-gift"
    | "students-seed"
    | "science-outpost",
  count = 6,
): SimState {
  const rng = mulberry32(state.env.seed + state.stats.tick * 3331 + 99);
  // Science outpost = small team
  const n =
    entry === "science-outpost"
      ? Math.max(2, Math.min(4, count))
      : Math.max(2, Math.min(12, count));
  const added: Organism[] = [];
  const waterR = Math.sqrt(state.env.surface.waterCoverage) * 9.5;

  for (let i = 0; i < n; i++) {
    const ang = rng() * Math.PI * 2;
    let x = 0;
    let z = 0;
    if (entry === "boat-people") {
      const r = waterR * (0.9 + rng() * 0.35);
      x = Math.cos(ang) * r;
      z = Math.sin(ang) * r;
    } else if (entry === "wanderers") {
      const r = 8 + rng() * 3;
      x = Math.cos(ang) * r;
      z = Math.sin(ang) * r;
    } else if (entry === "science-outpost") {
      // tight cluster = research camp
      x = (rng() - 0.5) * 3;
      z = (rng() - 0.5) * 3;
    } else {
      x = (rng() - 0.5) * 8;
      z = (rng() - 0.5) * 8;
    }
    const culture =
      entry === "sky-gift"
        ? 0.55
        : entry === "science-outpost"
          ? 0.65
          : entry === "evolved"
            ? 0.3
            : 0.4;
    added.push(
      createOrganism(
        replicateDna(HUMAN_STARTER_DNA, 0.015, rng),
        entry === "evolved" ? 1 : 0,
        entry === "evolved" ? `Evolved${i}` : `Human${i}`,
        rng,
        {
          energyBoost: 1.6,
          forceRole: "human",
          sex: i % 2 === 0 ? "female" : "male",
          familyId: `Arrive-${entry}-${Math.floor(i / 2)}`,
          culture,
          x,
          z,
        },
      ),
    );
  }

  const baseOrgs =
    entry === "evolved"
      ? state.organisms.map((o) =>
          o.role === "intelligent"
            ? { ...o, culture: Math.min(1, o.culture + 0.15) }
            : o,
        )
      : state.organisms;

  const organisms = [...baseOrgs, ...added].slice(0, 100);
  const roles = countRoles(organisms);
  let settlements = state.settlements;
  if (settlements.length === 0) {
    settlements = seedSettlements(state.env, roles.humanCount, rng);
  }

  const entryLabel: Record<string, string> = {
    evolved: "evolved from mind-spark life",
    wanderers: "walked in as land wanderers",
    "boat-people": "arrived by water to the shore",
    "sky-gift": "entered as a story-gift with purpose",
    "students-seed": "seeded by the student Creator",
    "science-outpost": "arrived as a small science outpost",
  };

  return {
    ...state,
    organisms,
    settlements,
    civilization: state.civilization ?? defaultCivilization(),
    stats: {
      ...state.stats,
      population: organisms.length,
      settlementCount: settlements.length,
      ...roles,
      dominantBehaviour: dominantBehaviour(organisms),
    },
    log: [
      ...state.log.slice(-50),
      `Humanity enters: ${entryLabel[entry] ?? entry} (+${added.length} people).`,
      "Tech & pollution systems online. Locked events cannot be erased — fix from outside.",
    ],
  };
}

/** Apply live slider env to running sim without full reseed */
export function applyEnvLive(state: SimState, env: WorldEnv): SimState {
  // Preserve live flora energy/age; only regenerate layout if coverage changed a lot
  const prevCount = state.flora.length;
  const targetCount = Math.floor(8 + env.surface.floraCoverage * 48);
  let flora = state.flora;
  if (Math.abs(prevCount - targetCount) > 12) {
    const rng = mulberry32(env.seed + state.stats.tick * 3);
    flora = toLiveFlora(generateFlora(env, state.stats.tick), rng);
  }
  let foodPatches = state.foodPatches;
  // regenerate patches if count changed a lot
  if (
    Math.abs(foodPatches.length - env.foodWeb.patchCount) > 2 ||
    foodPatches.length === 0
  ) {
    const rng = mulberry32(env.seed + state.stats.tick);
    foodPatches = createFoodPatches(env, rng);
  }
  const roles = countRoles(state.organisms);
  const climate = deriveClimate(env, state.stats.tick);
  return {
    ...state,
    env,
    flora,
    foodPatches,
    stats: {
      ...state.stats,
      season: climate.season,
      airQuality: climate.airQuality,
      lightLevel: climate.lightLevel,
      tempC: climate.tempC,
      yearPhase: climate.yearPhase,
      floraCount: flora.length,
      waterCoverage: env.surface.waterCoverage,
      foodTotal: foodPatches.reduce((a, p) => a + p.energy, 0),
      ...roles,
    },
  };
}

function forage(
  org: Organism,
  patches: FoodPatch[],
  traits: OrganismTraits,
): { energyGain: number; patches: FoodPatch[] } {
  if (traits.digestion < 0.12 && traits.chemoUse < 0.15 && traits.lightUse < 0.5) {
    return { energyGain: 0, patches };
  }
  let best = -1;
  let bestD = 3.2 * 3.2;
  for (let i = 0; i < patches.length; i++) {
    const p = patches[i]!;
    if (p.energy < 0.08) continue;
    let prefer = 1;
    if (p.kind === "photo" && traits.lightUse > 0.4) prefer = 0.65;
    if (p.kind === "detritus" && traits.digestion > 0.3) prefer = 0.6;
    if (p.kind === "mineral" && traits.chemoUse > 0.3) prefer = 0.6;
    const d = dist2(org.x, org.z, p.x, p.z) * prefer;
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  }
  if (best < 0) return { energyGain: 0, patches };

  const p = patches[best]!;
  const reach = 1.2 + traits.sensing * 0.8 + traits.speed * 0.3;
  if (bestD > reach * reach) return { energyGain: 0, patches };

  const take =
    Math.min(
      p.energy,
      0.12 + traits.digestion * 0.35 + traits.chemoUse * 0.2 + traits.lightUse * 0.1,
    ) * (0.6 + traits.metabolism * 0.2);

  const nextPatches = patches.map((patch, i) =>
    i === best ? { ...patch, energy: Math.max(0, patch.energy - take) } : patch,
  );
  return { energyGain: take, patches: nextPatches };
}

/** Predators gain energy by attacking smaller/weaker prey */
function tryHunt(
  hunter: Organism,
  others: Organism[],
  env: WorldEnv,
  rng: () => number,
  alreadyKilled: Set<string>,
): { gain: number; victimId: string | null } {
  if (hunter.role !== "predator" && hunter.expression.traits.predation < 0.5) {
    return { gain: 0, victimId: null };
  }

  const preyAlive = others.filter(
    (o) =>
      o.id !== hunter.id &&
      !alreadyKilled.has(o.id) &&
      o.role !== "predator",
  ).length;
  // Refuse to hunt when prey base is thin — prevents food-web collapse
  if (preyAlive < 8) return { gain: 0, victimId: null };

  const pressure = env.surface.predatorPressure;
  // Lower attempt rate on mild worlds
  if (rng() > pressure * 0.55 + 0.08) {
    return { gain: 0, victimId: null };
  }

  const ht = hunter.expression.traits;
  let best: Organism | null = null;
  let bestScore = 0;
  for (const o of others) {
    if (o.id === hunter.id || alreadyKilled.has(o.id)) continue;
    // Humans not hunted (cultural protection / tools)
    if ((o.role as string) === "human") continue;
    if (o.role === "predator" && o.expression.traits.size >= ht.size) continue;
    if (
      o.role === "intelligent" &&
      o.expression.traits.intelligence > ht.intelligence
    )
      continue;
    const d = dist2(hunter.x, hunter.z, o.x, o.z);
    if (d > 4.0) continue;
    const pt = o.expression.traits;
    const advantage =
      ht.speed * 0.35 +
      ht.predation * 0.45 +
      ht.size * 0.15 -
      pt.armor * 0.5 -
      pt.speed * 0.28 -
      (o.role === "intelligent" ? 0.35 : 0);
    const score = advantage / (Math.sqrt(d) + 0.4);
    if (score > bestScore) {
      bestScore = score;
      best = o;
    }
  }
  if (!best || bestScore < 0.42) return { gain: 0, victimId: null };
  if (rng() > clamp(0.15 + bestScore * 0.28 * pressure, 0.08, 0.55)) {
    return { gain: 0, victimId: null };
  }
  const gain =
    (0.28 + best.expression.traits.size * 0.3 + best.energy * 0.15) *
    (0.55 + pressure * 0.5);
  return { gain, victimId: best.id };
}

function normalizeSettlement(s: Settlement): Settlement {
  return {
    ...s,
    woodStore: s.woodStore ?? 0,
    mineralStore: s.mineralStore ?? 0,
    infrastructure: s.infrastructure ?? 0,
  };
}

export function stepSimulation(state: SimState): SimState {
  const tick = state.stats.tick;
  const rng = mulberry32(state.env.seed + tick * 9973);
  let env = state.env;
  const climate = deriveClimate(env, tick);
  let births = 0;
  let deaths = 0;
  let matings = 0;
  let sexualBirths = 0;
  let civWorking = state.civilization ?? defaultCivilization();
  let infraGainTick = 0;
  const resourceLog: string[] = [];
  let asexualBirths = 0;
  const next: Organism[] = [];
  const proteinCounts: Record<string, number> = {};
  const killed = new Set<string>();
  const matedThisTick = new Set<string>();

  let patches = regrowFoodPatches(state.foodPatches, env, tick);
  let settlements = state.settlements.map((s) => ({ ...s }));

  // Flora reproduction step (grow, bud, sexual seed)
  const floraStep = stepFloraReproduction(state.flora, env, tick, rng);
  let flora = floraStep.flora;
  let log = [...state.log, ...floraStep.log];

  // Mind spark only (school path: humans enter via journey, not random)
  if (
    tick > 0 &&
    tick % 80 === 0 &&
    env.surface.intelligenceSeed > 0.15 &&
    rng() < env.surface.intelligenceSeed * 0.2
  ) {
    const mind = createOrganism(
      replicateDna(SEED_MIND, 0.04, rng),
      0,
      "Mind+",
      rng,
      {
        energyBoost: 0.5,
        forceRole: "intelligent",
        sex: rng() < 0.5 ? "female" : "male",
        culture: 0.15,
      },
    );
    next.push(mind);
    log.push(`t=${tick}: mind-spark creature appears (not human yet).`);
  }

  // Settlements only if humans already introduced
  if (
    settlements.length === 0 &&
    state.organisms.some((o) => o.role === "human")
  ) {
    settlements = seedSettlements(env, 4, rng);
    log.push(
      `t=${tick}: people build settlement ${settlements[0]?.name ?? ""}.`,
    );
  }

  const paradise =
    env.foodWeb.primaryProductivity >= 0.85 &&
    env.atmosphere.toxin < 0.05 &&
    env.surface.floraCoverage >= 0.7;
  const hab = climate.habitability;

  for (const org of state.organisms) {
    if (killed.has(org.id)) {
      deaths++;
      continue;
    }
    const t = org.expression.traits;
    let role = org.role;
    // Humans / predators / hunt lineages keep identity (school pathway)
    if (
      role === "human" ||
      org.lineage.startsWith("Human") ||
      org.lineage.startsWith("Evolved") ||
      org.lineage.startsWith("Arrive")
    ) {
      role = "human";
    } else if (
      org.lineage.startsWith("P") ||
      org.lineage.startsWith("Hunt") ||
      role === "predator"
    ) {
      role = org.lineage.startsWith("Hunt") || org.lineage.startsWith("P")
        ? "predator"
        : role === "predator"
          ? "predator"
          : classifyLifeRole(t);
    } else {
      role = classifyLifeRole(t);
      // Never auto-promote to human mid-sim — only journey introduction
    }

    let kin: KinBond = {
      ...org.kin,
      mateCooldown: Math.max(0, org.kin.mateCooldown - 1),
    };
    let culture = org.culture;
    let x = org.x;
    let z = org.z;
    const waterR = Math.sqrt(env.surface.waterCoverage) * 9.5;

    const { town, dist: townDist } = nearestSettlement(x, z, settlements);
    const nearSettlement = townDist < 3.5;
    let nearbyMate = false;
    let mateTarget: Organism | null = null;
    let nearbyThreat = false;
    for (const o of state.organisms) {
      if (o.id === org.id || killed.has(o.id)) continue;
      const d = dist2(x, z, o.x, o.z);
      if (
        d < 4 &&
        canMateSex(org.sex, o.sex) &&
        o.kin.mateCooldown <= 0 &&
        o.age > 5 &&
        (o.role === role ||
          isHumanLike(o.role, o.expression.traits.intelligence) ===
            isHumanLike(role, t.intelligence))
      ) {
        nearbyMate = true;
        if (!mateTarget || d < dist2(x, z, mateTarget.x, mateTarget.z)) {
          mateTarget = o;
        }
      }
      if (
        d < 9 &&
        o.role === "predator" &&
        role !== "predator" &&
        o.expression.traits.predation > 0.4
      ) {
        nearbyThreat = true;
      }
    }

    const behaviour = chooseBehaviour({
      role,
      intelligence: t.intelligence,
      energy: org.energy,
      age: org.age,
      sex: org.sex,
      kin,
      predation: t.predation,
      nearbyMate,
      nearbyThreat,
      nearSettlement,
      settlementFood: town?.foodStore ?? 0,
      season: climate.season,
      rng,
    });

    const stepBase = t.speed * 0.38 * (0.5 + rng());
    if (behaviour === "photosynthesize" || role === "flora-morph") {
      x += (rng() - 0.5) * 0.05;
      z += (rng() - 0.5) * 0.05;
    } else if (
      (behaviour === "mate-seek" || behaviour === "court") &&
      mateTarget
    ) {
      const ang = Math.atan2(mateTarget.z - z, mateTarget.x - x);
      x += Math.cos(ang) * stepBase * 1.1;
      z += Math.sin(ang) * stepBase * 1.1;
    } else if (behaviour === "hunt" || role === "predator") {
      let target: Organism | null = null;
      let td = Infinity;
      for (const o of state.organisms) {
        if (o.id === org.id || killed.has(o.id)) continue;
        if (o.role === "predator" || o.role === "human") continue;
        const d = dist2(x, z, o.x, o.z);
        if (d < td) {
          td = d;
          target = o;
        }
      }
      if (target) {
        const ang = Math.atan2(target.z - z, target.x - x);
        x += Math.cos(ang) * stepBase;
        z += Math.sin(ang) * stepBase;
      }
    } else if (behaviour === "flee" && nearbyThreat) {
      let pred: Organism | null = null;
      let pd = Infinity;
      for (const o of state.organisms) {
        if (o.role !== "predator" || killed.has(o.id)) continue;
        const d = dist2(x, z, o.x, o.z);
        if (d < pd) {
          pd = d;
          pred = o;
        }
      }
      if (pred) {
        const ang = Math.atan2(z - pred.z, x - pred.x);
        x += Math.cos(ang) * stepBase * 1.3;
        z += Math.sin(ang) * stepBase * 1.3;
      }
    } else if (
      (behaviour === "farm" ||
        behaviour === "build" ||
        behaviour === "trade" ||
        behaviour === "socialize" ||
        behaviour === "teach" ||
        behaviour === "ritual" ||
        behaviour === "parent") &&
      town
    ) {
      const ang = Math.atan2(town.z - z, town.x - x);
      const pull = townDist > 1.2 ? stepBase * 0.9 : stepBase * 0.15;
      x += Math.cos(ang) * pull + (rng() - 0.5) * 0.1;
      z += Math.sin(ang) * pull + (rng() - 0.5) * 0.1;
    } else if (t.sensing > 0.2 && patches.length && behaviour !== "rest") {
      let target = patches[0]!;
      let bestScore = -1;
      for (const p of patches) {
        const d = Math.sqrt(dist2(x, z, p.x, p.z)) + 0.1;
        const score = (p.energy * (1 + t.digestion)) / d;
        if (score > bestScore) {
          bestScore = score;
          target = p;
        }
      }
      const ang = Math.atan2(target.z - z, target.x - x);
      x += Math.cos(ang) * stepBase;
      z += Math.sin(ang) * stepBase;
    } else {
      const ang = rng() * Math.PI * 2;
      x += Math.cos(ang) * stepBase * (behaviour === "rest" ? 0.1 : 1);
      z += Math.sin(ang) * stepBase * (behaviour === "rest" ? 0.1 : 1);
    }

    const r2 = x * x + z * z;
    if (
      r2 < waterR * waterR * 0.5 &&
      t.chemoUse < 0.35 &&
      t.lightUse < 0.5 &&
      role !== "human"
    ) {
      const ang = Math.atan2(z, x);
      x = Math.cos(ang) * waterR * 0.75;
      z = Math.sin(ang) * waterR * 0.75;
    }
    x = clamp(x, -11, 11);
    z = clamp(z, -11, 11);

    const moved: Organism = { ...org, x, z, role, behaviour, kin };
    const forageResult = forage(moved, patches, t);
    patches = forageResult.patches;

    let huntGain = 0;
    if (behaviour === "hunt" || role === "predator") {
      const hunt = tryHunt(moved, state.organisms, env, rng, killed);
      if (hunt.victimId && !killed.has(hunt.victimId)) {
        killed.add(hunt.victimId);
        huntGain = hunt.gain * Math.min(1, env.surface.predatorPressure + 0.35);
        deaths++;
      }
    }

    const f = fitness(
      t,
      env,
      tick,
      forageResult.energyGain + huntGain * 0.5,
      role,
    );
    const baseDrain = paradise ? 0.022 : 0.04;
    const winterDrain =
      climate.season === "winter" ? (paradise ? 0.012 : 0.03) : 0;
    let energy =
      org.energy +
      f * (paradise ? 0.38 : 0.3) +
      forageResult.energyGain * 0.85 +
      huntGain -
      t.metabolism * (paradise ? 0.055 : 0.08) * env.gravity -
      baseDrain -
      winterDrain;

    const fx = applyBehaviourEffects({
      behaviour,
      energy,
      intelligence: t.intelligence,
      settlement: town,
      climateLight: climate.lightLevel,
      season: climate.season,
      rng,
    });
    energy += fx.energyDelta;
    culture = clamp(culture + fx.cultureGain, 0, 1);
    if (town && fx.settlementDelta) {
      const idx = settlements.findIndex((s) => s.id === town.id);
      if (idx >= 0) {
        const prev = normalizeSettlement(settlements[idx]!);
        let nextTown = { ...prev, ...fx.settlementDelta };
        nextTown = normalizeSettlement(nextTown);

        // Building needs timber: harvest nearby forest (planet resource)
        if (
          behaviour === "build" &&
          (prev.woodStore < 0.45 ||
            (fx.note ?? "").includes("need more forest"))
        ) {
          const harvest = harvestForestForTimber(
            flora,
            civWorking,
            { x: town.x, z: town.z },
            tick,
            1.2,
          );
          flora = harvest.flora as typeof flora;
          civWorking = harvest.civ;
          nextTown.woodStore = Math.min(
            24,
            nextTown.woodStore + harvest.timberGained,
          );
          if (harvest.timberGained > 0.2 && resourceLog.length < 4) {
            resourceLog.push(harvest.teaching);
          }
        }

        // Also mine minerals slowly when gathering near mineral-rich ground
        if (behaviour === "gather" || behaviour === "build") {
          const takeMin = Math.min(0.12, civWorking.planetaryMinerals * 0.002);
          civWorking = {
            ...civWorking,
            planetaryMinerals: Math.max(
              0,
              civWorking.planetaryMinerals - takeMin,
            ),
          };
          nextTown.mineralStore = Math.min(
            20,
            nextTown.mineralStore + takeMin,
          );
        }

        if (
          behaviour === "build" &&
          (nextTown.infrastructure ?? 0) > (prev.infrastructure ?? 0)
        ) {
          infraGainTick +=
            (nextTown.infrastructure ?? 0) - (prev.infrastructure ?? 0);
        }

        settlements[idx] = nextTown;
        if (behaviour === "gather" && energy < 1) {
          const take = Math.min(0.15, settlements[idx]!.foodStore);
          settlements[idx]!.foodStore -= take;
          energy += take * 0.8;
        }
      }
    }

    if (role === "human" || isHumanLike(role, t.intelligence)) {
      const minds = state.organisms.filter(
        (o) =>
          (o.role === "human" ||
            isHumanLike(o.role, o.expression.traits.intelligence)) &&
          !killed.has(o.id),
      ).length;
      energy += Math.min(0.35, minds * 0.05) * Math.max(0.4, t.intelligence) * (0.55 + culture);
      if (town) energy += town.culture * 0.06 + town.size * 0.05 + 0.04;
      // Settlement food insurance
      if (town && energy < 0.8 && town.foodStore > 0.2) {
        const eat = Math.min(0.25, town.foodStore * 0.08);
        const idx = settlements.findIndex((s) => s.id === town.id);
        if (idx >= 0) {
          settlements[idx] = {
            ...settlements[idx]!,
            foodStore: settlements[idx]!.foodStore - eat,
          };
        }
        energy += eat * 1.1;
      }
    }

    if (paradise) {
      energy +=
        env.surface.floraCoverage * climate.foodProductivity * 0.04 +
        hab * 0.03;
    }

    const age = org.age + 1;
    const kills = org.kills + (huntGain > 0 ? 1 : 0);

    const deathChance =
      (paradise ? 0.003 : 0.008) +
      age * (paradise ? 0.0009 : 0.0014) +
      (energy < 0.15 ? (paradise ? 0.12 : 0.28) : 0) +
      (climate.tempC > 50 ? 0.05 : 0) +
      (climate.tempC < -15 ? 0.04 * (1 - t.seasonalHardiness) : 0) +
      env.atmosphere.toxin * 0.03 * (1 - t.toxinResist * 0.5) +
      (1 - climate.airQuality) * 0.025 * (1 - t.toxinResist * 0.3) +
      env.chemicals.acidity * 0.02 * (1 - t.chemoUse * 0.4);

    const maxAge =
      (paradise ? 110 : 80) +
      t.armor * 20 +
      t.intelligence * 15 +
      culture * 20 +
      hab * 15 +
      (role === "human" ? 25 : 0);

    if (energy <= 0 || rng() < deathChance || age > maxAge) {
      deaths++;
      continue;
    }

    for (const p of org.expression.proteins) {
      proteinCounts[p.klass] = (proteinCounts[p.klass] ?? 0) + 1;
    }

    const popCap = paradise ? 100 : 90;
    let child: Organism | null = null;

    // Sexual mating
    if (
      !matedThisTick.has(org.id) &&
      kin.mateCooldown <= 0 &&
      energy > 1.0 + t.size * 0.25 &&
      age > 6 &&
      (behaviour === "court" ||
        behaviour === "mate-seek" ||
        (role !== "human" && rng() < t.replicationRate * 0.025)) &&
      next.length + state.organisms.length < popCap
    ) {
      const partner = mateTarget;
      if (partner && !matedThisTick.has(partner.id)) {
        const d = dist2(x, z, partner.x, partner.z);
        if (d < 2.8 && canMateSex(org.sex, partner.sex)) {
          const mutRate =
            0.012 +
            env.atmosphere.toxin * 0.015 +
            STAR_PRESETS[env.star].uv * 0.008 +
            (1 - climate.airQuality) * 0.008;
          const childDna = sexualCrossover(
            org.expression.dna,
            partner.expression.dna,
            mutRate,
            rng,
          );
          const humanParents =
            role === "human" || partner.role === "human";
          child = createOrganism(
            childDna,
            Math.max(org.generation, partner.generation) + 1,
            humanParents
              ? `Human${org.generation}`
              : `${org.lineage}×${partner.lineage}`.slice(0, 24),
            rng,
            {
              energyBoost: humanParents ? 1.0 : 0.4,
              familyId: org.kin.familyId,
              parentIds: [org.id, partner.id],
              sexualBirth: true,
              culture: humanParents
                ? Math.max(0.35, (culture + partner.culture) * 0.55)
                : (culture + partner.culture) * 0.45,
              x: x + (rng() - 0.5),
              z: z + (rng() - 0.5),
              forceRole: humanParents ? "human" : undefined,
            },
          );
          if (humanParents) child.role = "human";
          energy -= 0.45 + t.size * 0.1;
          kin = {
            ...kin,
            partnerId: partner.id,
            offspringCount: kin.offspringCount + 1,
            mateCooldown: role === "human" ? 14 : 8,
          };
          matedThisTick.add(org.id);
          matedThisTick.add(partner.id);
          matings++;
          sexualBirths++;
          births++;
          if (matings <= 3 || tick % 40 === 0) {
            log.push(
              `t=${tick + 1}: mating ${org.sex}×${partner.sex} (${role}) → sexual offspring gen ${child.generation}.`,
            );
          }
        }
      }
    }

    // Asexual budding for non-humans
    if (
      !child &&
      role !== "human" &&
      energy > (paradise ? 0.95 : 1.15) + t.size * 0.35 &&
      age > (paradise ? 4 : 5) &&
      next.length + state.organisms.length < popCap
    ) {
      const repChance =
        t.replicationRate * (paradise ? 0.1 : 0.08) * (0.5 + f * 0.3);
      if (rng() < repChance) {
        const mutRate =
          0.01 +
          env.atmosphere.toxin * 0.02 +
          STAR_PRESETS[env.star].uv * 0.01 * climate.orbitalLightMod;
        const childDna = replicateDna(org.expression.dna, mutRate, rng);
        child = createOrganism(childDna, org.generation + 1, org.lineage, rng, {
          parentIds: [org.id, null],
          sexualBirth: false,
          familyId: kin.familyId,
          x: x + (rng() - 0.5) * 1.5,
          z: z + (rng() - 0.5) * 1.5,
        });
        energy -= 0.55 + t.size * 0.15;
        asexualBirths++;
        births++;
        kin = { ...kin, offspringCount: kin.offspringCount + 1 };
      }
    }

    next.push({
      ...org,
      x,
      z,
      energy,
      age,
      role,
      kills,
      sex: org.sex,
      kin,
      behaviour,
      culture,
      sexualBirth: org.sexualBirth,
    });
    if (child) next.push(child);
  }

  let organisms = next
    .filter((o) => !killed.has(o.id))
    .slice(0, paradise ? 88 : 72);

  // Soft floor: if population collapses on a rich world, reseed diversity
  // instead of full extinction (students still see evolution, not a blank world)
  if (organisms.length === 0) {
    const rescueDna = paradise ? SEED_PHOTO : randomDna(36, rng);
    organisms = [
      createOrganism(rescueDna, 0, "rescued", rng, { energyBoost: 1.2 }),
      createOrganism(
        replicateDna(SEED_MOTOR, 0.03, rng),
        0,
        "rescued-m",
        rng,
        { energyBoost: 1.0 },
      ),
    ];
    log = [
      ...log.slice(-40),
      paradise
        ? "Near-extinction buffer — photo + motor rescue genomes injected (Eden safety net)."
        : "Extinction event — spontaneous rescue genome injected.",
    ];
  } else if (paradise && organisms.length < 10 && (tick + 1) % 12 === 0) {
    // Occasional top-up so complex web stays multi-role, not every tick spam
    organisms.push(
      createOrganism(
        replicateDna(SEED_PHOTO, 0.02, rng),
        0,
        "boost-photo",
        rng,
        { energyBoost: 1.2 },
      ),
      createOrganism(
        replicateDna(SEED_MOTOR, 0.02, rng),
        0,
        "boost-mot",
        rng,
        { energyBoost: 1.0 },
      ),
    );
    log = [
      ...log.slice(-40),
      `t=${tick + 1}: Eden buffer — photo + motor top-up (pop was ${organisms.length - 2}).`,
    ];
  }

  const fits = organisms.map((o) =>
    fitness(o.expression.traits, env, tick, 0, o.role),
  );
  const avgFitness =
    fits.reduce((a, b) => a + b, 0) / Math.max(fits.length, 1);
  const dominantProtein =
    Object.entries(proteinCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
  const maxGeneration = organisms.reduce(
    (m, o) => Math.max(m, o.generation),
    0,
  );
  const roles = countRoles(organisms);

  const nextTick = tick + 1;
  const nextClimate = deriveClimate(env, nextTick);
  const foodTotal = patches.reduce((a, p) => a + p.energy, 0);

  if (nextClimate.season !== climate.season) {
    log.push(
      `Season → ${nextClimate.season} · light ${nextClimate.lightLevel.toFixed(2)} · food ${nextClimate.foodProductivity.toFixed(2)} · AQ ${nextClimate.airQuality.toFixed(2)}`,
    );
  }
  if (nextTick % 25 === 0) {
    log.push(
      `t=${nextTick}: pop ${organisms.length} (humans ${roles.humanCount}, pred ${roles.predatorCount}), matings ${state.stats.matings + matings}, flora ${flora.length} (+${floraStep.births}b/${floraStep.seeds}s), beh ${dominantBehaviour(organisms)}, ${nextClimate.season}`,
    );
  }

  // Settlements slowly decay food, grow culture floor
  settlements = settlements.map((s) => {
    const n = normalizeSettlement(s);
    return {
      ...n,
      foodStore: Math.max(0, n.foodStore * 0.992),
      culture: Math.min(1, n.culture * 0.999 + 0.001),
      woodStore: Math.max(0, n.woodStore * 0.998),
      mineralStore: Math.max(0, n.mineralStore * 0.998),
    };
  });

  // Settlements low on wood: harvest planetary forest (local materials)
  if (countRoles(organisms).humanCount > 0) {
    for (let ti = 0; ti < settlements.length; ti++) {
      const town = normalizeSettlement(settlements[ti]!);
      if (town.woodStore >= 2.5) continue;
      if (rng() > 0.45) continue;
      const harvest = harvestForestForTimber(
        flora,
        civWorking,
        { x: town.x, z: town.z },
        nextTick,
        1.4,
      );
      flora = harvest.flora as typeof flora;
      civWorking = harvest.civ;
      settlements[ti] = {
        ...town,
        woodStore: Math.min(24, town.woodStore + harvest.timberGained),
      };
      if (harvest.timberGained > 0.3 && resourceLog.length < 5) {
        resourceLog.push(harvest.teaching);
      }
      // Spend some wood+minerals into infrastructure automatically (camp expansion)
      const t2 = normalizeSettlement(settlements[ti]!);
      if (t2.woodStore >= 0.5 && t2.mineralStore >= 0.2 && rng() < 0.5) {
        const gain = 0.03 + rng() * 0.04;
        settlements[ti] = {
          ...t2,
          woodStore: t2.woodStore - 0.45,
          mineralStore: Math.max(0, t2.mineralStore - 0.15),
          infrastructure: Math.min(1, t2.infrastructure + gain),
          size: Math.min(1, t2.size + gain * 0.6),
        };
        infraGainTick += gain;
      }
    }
  }

  // Standing forest timber resource updates from live flora
  const timberNow = estimateForestTimber(flora);
  civWorking = {
    ...civWorking,
    forestTimber: timberNow,
    infrastructureBuilt: civWorking.infrastructureBuilt + infraGainTick,
  };

  // Light canopy pressure when infrastructure grows (local clearing)
  if (infraGainTick > 0.02) {
    env = {
      ...env,
      surface: {
        ...env.surface,
        floraCoverage: Math.max(
          0.35,
          env.surface.floraCoverage - infraGainTick * 0.15,
        ),
        canopyRatio: Math.max(
          0.25,
          env.surface.canopyRatio - infraGainTick * 0.12,
        ),
      },
    };
  }

  // Tech + population → pollution coupling (locked history may append)
  const polled = stepCivilizationPollution(
    civWorking,
    env,
    roles.humanCount,
    nextTick,
  );
  let civilization = polled.civ;
  env = polled.env;
  log = [...log, ...resourceLog];

  // Tech-boosted human replication chance (population technology)
  if (
    roles.humanCount > 0 &&
    civilization.growthModifier > 1.05 &&
    nextTick % 40 === 0 &&
    organisms.length < 95
  ) {
    const boostN = Math.min(
      2,
      Math.floor((civilization.growthModifier - 1) * 3),
    );
    for (let i = 0; i < boostN; i++) {
      if (rng() < 0.35 * civilization.growthModifier) {
        const parent = organisms.find((o) => o.role === "human");
        if (parent) {
          organisms.push(
            createOrganism(
              replicateDna(parent.expression.dna, 0.02, rng),
              parent.generation + 1,
              parent.lineage,
              rng,
              {
                forceRole: "human",
                familyId: parent.kin.familyId,
                culture: parent.culture * 0.9,
                energyBoost: 0.8,
                x: parent.x + (rng() - 0.5) * 2,
                z: parent.z + (rng() - 0.5) * 2,
                sexualBirth: false,
              },
            ),
          );
          asexualBirths++;
          births++;
        }
      }
    }
  }

  const finalRoles = countRoles(organisms);
  const finalClimate = deriveClimate(env, nextTick);

  const woodStock = settlements.reduce((a, s) => a + (s.woodStore ?? 0), 0);
  const mineralStock = settlements.reduce(
    (a, s) => a + (s.mineralStore ?? 0),
    0,
  );
  const infraPct =
    settlements.length === 0
      ? 0
      : Math.round(
          (settlements.reduce((a, s) => a + (s.infrastructure ?? 0), 0) /
            settlements.length) *
            100,
        );

  if (nextTick % 40 === 0 && roles.humanCount > 0) {
    log.push(
      `t=${nextTick}: tech ${civilization.techLevel} · pollution ${(civilization.pollutionNow * 100).toFixed(0)}% · timber ${timberNow.toFixed(0)} · wood stock ${woodStock.toFixed(1)} · infra ${infraPct}% · trees cut ${civilization.treesHarvested}`,
    );
  }

  return {
    organisms,
    env,
    foodPatches: patches,
    flora,
    settlements,
    civilization,
    stats: {
      tick: nextTick,
      population: organisms.length,
      births: state.stats.births + births,
      deaths: state.stats.deaths + deaths,
      avgFitness,
      dominantProtein,
      maxGeneration,
      season: finalClimate.season,
      airQuality: finalClimate.airQuality,
      lightLevel: finalClimate.lightLevel,
      tempC: finalClimate.tempC,
      foodTotal,
      yearPhase: finalClimate.yearPhase,
      floraCount: flora.length,
      waterCoverage: env.surface.waterCoverage,
      matings: state.stats.matings + matings,
      sexualBirths: state.stats.sexualBirths + sexualBirths,
      asexualBirths: state.stats.asexualBirths + asexualBirths,
      floraBirths: state.stats.floraBirths + floraStep.births,
      floraSeeds: state.stats.floraSeeds + floraStep.seeds,
      settlementCount: settlements.length,
      dominantBehaviour: dominantBehaviour(organisms),
      techLevel: civilization.techLevel,
      pollutionPct: Math.round(civilization.pollutionNow * 100),
      pollutionLedger: Math.round(civilization.pollutionLedger),
      lockedEventCount: civilization.lockedEvents.length,
      forestTimber: Math.round(timberNow),
      woodStock: Math.round(woodStock * 10) / 10,
      mineralStock: Math.round(
        mineralStock + civilization.planetaryMinerals * 0.01,
      ),
      infrastructurePct: infraPct,
      treesHarvested: civilization.treesHarvested,
      ...finalRoles,
    },
    log: log.slice(-90),
  };
}

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

/** Inject student-designed fauna into a running world */
export function injectFauna(
  state: SimState,
  bp: FaunaBlueprint,
): SimState {
  const rng = mulberry32(state.env.seed + state.stats.tick * 9137 + Date.now() % 1e6);
  const added: Organism[] = [];
  const forceRole = faunaForceRole(bp);
  const n = Math.max(1, Math.min(12, Math.floor(bp.count)));

  for (let i = 0; i < n; i++) {
    const dna = buildFaunaDna(bp, rng);
    const sex: Sex =
      bp.sex === "random"
        ? assignSex(rng, forceRole ?? "omnivore")
        : bp.sex;
    const scatter = 2 + bp.scatter * 14;
    const ang = rng() * Math.PI * 2;
    const r = rng() * scatter;
    const org = createOrganism(dna, 0, bp.name.slice(0, 16) || "Created", rng, {
      energyBoost: bp.energyBoost,
      forceRole,
      sex,
      culture:
        forceRole === "human"
          ? Math.max(0.35, bp.culture)
          : bp.culture,
      familyId: `Create-${bp.name.slice(0, 8)}-${i}`,
      x: Math.cos(ang) * r,
      z: Math.sin(ang) * r,
    });
    if (forceRole === "human") org.role = "human";
    if (forceRole === "predator") org.role = "predator";
    if (forceRole === "flora-morph") org.role = "flora-morph";
    added.push(org);
  }

  const organisms = [...state.organisms, ...added].slice(0, 100);
  const roles = countRoles(organisms);
  let settlements = state.settlements;
  if (roles.humanCount > 0 && settlements.length === 0) {
    settlements = seedSettlements(state.env, roles.humanCount, rng);
  }

  return {
    ...state,
    organisms,
    settlements,
    stats: {
      ...state.stats,
      population: organisms.length,
      settlementCount: settlements.length,
      ...roles,
      dominantBehaviour: dominantBehaviour(organisms),
    },
    log: [
      ...state.log.slice(-60),
      `Creator: +${added.length} fauna “${bp.name}” (${bp.template}${forceRole ? ` → ${forceRole}` : ""}).`,
    ],
  };
}

/** Inject student-designed flora into a running world */
export function injectFlora(
  state: SimState,
  bp: FloraBlueprint,
): SimState {
  const rng = mulberry32(state.env.seed + state.stats.tick * 7717 + Date.now() % 1e6);
  const kindDef = FLORA_KINDS.find((k) => k.id === bp.kind) ?? FLORA_KINDS[2]!;
  const n = Math.max(1, Math.min(24, Math.floor(bp.count)));
  const waterR = Math.sqrt(state.env.surface.waterCoverage) * 9.5;
  const added: LiveFlora[] = [];

  for (let i = 0; i < n; i++) {
    const ang = rng() * Math.PI * 2;
    let r: number;
    if (bp.nearWater || bp.kind === "kelp") {
      r = waterR * (0.7 + rng() * 0.45);
    } else {
      r = 1 + rng() * (2 + bp.scatter * 12);
    }
    const x = clamp(Math.cos(ang) * r, -11, 11);
    const z = clamp(Math.sin(ang) * r, -11, 11);
    const sex: Sex =
      bp.sex === "random"
        ? rng() < 0.45
          ? "hermaphrodite"
          : rng() < 0.5
            ? "female"
            : "male"
        : bp.sex;

    added.push({
      id: `flora-create-${state.stats.tick}-${i}-${Math.floor(rng() * 1e6)}`,
      x,
      z,
      height: kindDef.baseHeight * bp.height * (0.85 + rng() * 0.3),
      radius: kindDef.baseRadius * (0.8 + bp.height * 0.2),
      kind: bp.kind,
      health: clamp(bp.health, 0.15, 1),
      age: 0,
      energy: 0.6 + bp.health * 0.5,
      generation: 0,
      sex,
      mateCooldown: 2,
      parentId: null,
    });
  }

  const maxFlora = Math.floor(20 + state.env.surface.floraCoverage * 80);
  const flora = [...state.flora, ...added].slice(0, maxFlora);

  return {
    ...state,
    flora,
    stats: {
      ...state.stats,
      floraCount: flora.length,
    },
    log: [
      ...state.log.slice(-60),
      `Creator: +${added.length} flora “${bp.name}” (${bp.kind}, h×${bp.height.toFixed(1)}).`,
    ],
  };
}

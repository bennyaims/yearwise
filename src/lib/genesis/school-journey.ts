/**
 * World Habitation Science Mission (Years 7–12)
 * ─────────────────────────────────────────────
 * Educational frame: you are preparing to understand and eventually inhabit
 * an Earth-like world with diverse flora and fauna.
 *
 * Step-by-step science introductions. There is no single “correct” path —
 * every choice is valid evidence for a final essay.
 */

import type { YearLevel } from "@/lib/types";
import type { SimState } from "./simulate";
import type { WorldEnv } from "./world";

export type JourneyStageId =
  | "planet-climate"
  | "water-chemistry"
  | "flora-diversity"
  | "fauna-diversity"
  | "dna-structures"
  | "food-webs"
  | "evolution-mating"
  | "mind-culture"
  | "human-arrival"
  | "settlement-intent"
  | "final-essay";

/** How people might arrive / begin life on this world (no wrong answer) */
export type HumanityEntry =
  | "none"
  | "evolved"
  | "wanderers"
  | "boat-people"
  | "sky-gift"
  | "students-seed"
  | "science-outpost"; // research first, settle carefully

/** Settlement / life intentions (evidence for essay — any mix is OK) */
export type HumanityIntention =
  | "steward"
  | "explore"
  | "farm"
  | "build"
  | "trade"
  | "defend"
  | "dominate"
  | "wonder"
  | "research" // measure, experiment, publish
  | "restore"; // heal damaged systems

export type SchoolJourneyState = {
  schoolYear: YearLevel;
  stagesCompleted: JourneyStageId[];
  humanityEntered: boolean;
  humanityEntry: HumanityEntry;
  intentions: HumanityIntention[];
  /** short notes while exploring (feed the essay) */
  intentionNote: string;
  /** per-stage science notes */
  stageNotes: Partial<Record<JourneyStageId, string>>;
  /** final essay body */
  essayDraft: string;
  essayTitle: string;
  ticksObserved: number;
  startedAt: string;
};

export type StageInfo = {
  id: JourneyStageId;
  minYear: YearLevel;
  order: number;
  title: string;
  kidTitle: string;
  scienceFocus: string;
  learning: string[];
  unlocks: string[];
  story: string;
  /** prompts that build toward the final essay */
  essayPrompts: string[];
  /** what to do in the sim this step */
  tryThis: string[];
};

/**
 * Science-first sequence for understanding an Earth-like world
 * before (and while) planning habitation.
 */
export const JOURNEY_STAGES: StageInfo[] = [
  {
    id: "planet-climate",
    minYear: 7,
    order: 1,
    title: "Planet, star & climate",
    kidTitle: "Step 1 · Is this world livable?",
    scienceFocus: "Astronomy · physics · Earth science",
    learning: [
      "Star type changes light, heat and UV stress",
      "Gravity affects body size and energy cost",
      "Seasons come from tilt and orbit",
      "Air quality (O₂, toxins, dust) filters who survives",
    ],
    unlocks: ["Star & gravity sliders", "Seasons & weather", "Air quality readouts"],
    story:
      "Mission brief: this planet is Earth-like but not Earth. Before anyone lives here, scientists study the star, gravity, temperature and seasons. There is no wrong setting to try — record what you notice.",
    essayPrompts: [
      "What star and gravity would you recommend for long-term human health, and why?",
      "How do seasons on this world compare with Earth?",
    ],
    tryThis: [
      "Change star type and watch light / temperature",
      "Nudge gravity up and down — who thrives?",
      "Watch a full seasonal cycle in the log",
    ],
  },
  {
    id: "water-chemistry",
    minYear: 7,
    order: 2,
    title: "Water & chemical nutrients",
    kidTitle: "Step 2 · Water and chemistry of life",
    scienceFocus: "Chemistry · hydrology",
    learning: [
      "Water coverage shapes land vs aquatic niches",
      "Nitrogen, phosphate, minerals and organics limit growth",
      "Acidity and toxins stress organisms differently",
      "Life needs both energy and raw materials",
    ],
    unlocks: ["Water %", "Chemical pool sliders", "Food patch types"],
    story:
      "Life is chemistry in motion. Map the water and nutrients. Kelp needs shores; trees need land. Your notes become science evidence — not a test of ‘right answers’.",
    essayPrompts: [
      "Where would you place the first water supply for a settlement?",
      "Which nutrients seem most important for plant growth here?",
    ],
    tryThis: [
      "Raise and lower water coverage",
      "Boost organics vs minerals and compare food patches",
      "Zoom the 3D view to water and land zones",
    ],
  },
  {
    id: "flora-diversity",
    minYear: 7,
    order: 3,
    title: "Flora diversity (primary producers)",
    kidTitle: "Step 3 · Plants of a new world",
    scienceFocus: "Botany · ecology · photosynthesis",
    learning: [
      "Primary producers capture light energy",
      "Moss, shrub, tree and kelp fill different niches",
      "Plant diversity stabilises oxygen and food webs",
      "Flora can bud and seed (reproduction)",
    ],
    unlocks: ["Dense plant life", "Flora creator", "Land + water plants"],
    story:
      "A world ready for habitation needs a green engine. Explore the diverse flora — there is no single ‘best’ plant. Diversity is the lesson.",
    essayPrompts: [
      "Describe three plant types on this world and the niche of each.",
      "Why might introducing only one crop plant be risky?",
    ],
    tryThis: [
      "Use Flora creator to add trees and kelp",
      "Watch plant buds and seeds in the log",
      "Note winter vs summer plant health",
    ],
  },
  {
    id: "fauna-diversity",
    minYear: 7,
    order: 4,
    title: "Fauna diversity",
    kidTitle: "Step 4 · Animals of land and water",
    scienceFocus: "Zoology · behaviour",
    learning: [
      "Animals fill roles: grazer, scavenger, predator, light-lover",
      "Body plans link to DNA and protein structures (simplified)",
      "Sex and mating create genetic mixing",
      "Diversity buffers against disease and change",
    ],
    unlocks: ["Many animal lineages", "Fauna creator", "Click-to-inspect attributes"],
    story:
      "Before humans arrive, map who already lives here. Click animals, zoom in, read traits. Every species is a clue for safe co-existence.",
    essayPrompts: [
      "Compare a herbivore and a predator using energy and behaviour.",
      "Would you protect any species before settlement? Why?",
    ],
    tryThis: [
      "Click fauna in 3D and read attributes",
      "Add a custom animal with the creator",
      "List land vs shore/water animals",
    ],
  },
  {
    id: "dna-structures",
    minYear: 8,
    order: 5,
    title: "DNA → proteins → structures",
    kidTitle: "Step 5 · The code of life",
    scienceFocus: "Molecular biology · genetics",
    learning: [
      "DNA bases encode amino acids (genetic code)",
      "Proteins fold into helices, sheets and loops",
      "Known assemblies (membrane, photosystem, motor…) shape traits",
      "Mutations change DNA and can change fitness",
    ],
    unlocks: ["Structure panel", "AA sequence view", "Starter ORF themes"],
    story:
      "Scientists don’t just count animals — they ask how bodies are built. Read DNA, amino acids and structures. There is no wrong genome to inspect; explain what you see.",
    essayPrompts: [
      "Explain central dogma in one short paragraph using this sim.",
      "Link one known structure (e.g. photosystem) to a survival advantage.",
    ],
    tryThis: [
      "Select an organism and open its structure list",
      "Compare a photosystem strain with a motor strain",
      "Note secondary structure α / β / loop %",
    ],
  },
  {
    id: "food-webs",
    minYear: 8,
    order: 6,
    title: "Food webs & energy",
    kidTitle: "Step 6 · Who eats whom?",
    scienceFocus: "Ecology · energy flow",
    learning: [
      "Energy flows: light → plants → herbivores → predators",
      "Detritus and minerals support scavengers and chemistry users",
      "Removing one link can cascade",
      "Human food systems sit on top of natural webs",
    ],
    unlocks: ["Food patches", "Predator pressure", "Population log lines"],
    story:
      "If your species settles here, you join the food web. Study energy paths first. Any observation helps your essay — even ‘this winter crashed the grazers’.",
    essayPrompts: [
      "Draw or describe a food chain of at least four links on this world.",
      "How should a first settlement get food without collapsing plants?",
    ],
    tryThis: [
      "Watch green (photo) vs brown (detritus) food pads",
      "Change predator pressure carefully",
      "Record population before/after a season change",
    ],
  },
  {
    id: "evolution-mating",
    minYear: 9,
    order: 7,
    title: "Evolution, mating & adaptation",
    kidTitle: "Step 7 · Change over generations",
    scienceFocus: "Evolutionary biology",
    learning: [
      "Sexual reproduction mixes DNA (crossover model)",
      "Asexual budding copies genomes with mutation",
      "Environment selects which traits become common",
      "Adaptation is local — what works here may fail on another world",
    ],
    unlocks: ["Sexual matings stats", "Generations", "Mutation under UV/toxin"],
    story:
      "Life is not fixed. Over school years of simulated time, lineages change. Track a family line. There is no wrong lineage to follow — explain the science of change.",
    essayPrompts: [
      "What is the difference between sexual and asexual births in this lab?",
      "Give one example of environment selecting a trait.",
    ],
    tryThis: [
      "Run the sim and note sexual vs asexual birth counts",
      "Inspect a high-generation organism",
      "Try a harsher star and describe who struggles",
    ],
  },
  {
    id: "mind-culture",
    minYear: 10,
    order: 8,
    title: "Mind, tools & culture",
    kidTitle: "Step 8 · Thinking life",
    scienceFocus: "Behaviour · anthropology (intro)",
    learning: [
      "Some organisms show higher sensing and planning (model)",
      "Culture can accumulate as shared skill",
      "Intelligence has energy costs",
      "Ethics begins before full human settlement",
    ],
    unlocks: ["Mind-spark creatures", "Culture %", "Teaching-like behaviours"],
    story:
      "Before full human habitation, notice if any life plans, teaches or tools. How you treat mind-bearing life is part of science ethics — write what you believe, not a ‘correct’ answer.",
    essayPrompts: [
      "Should intelligent non-humans have rights in a settlement plan? Argue either way.",
      "How does culture differ from pure instinct in this model?",
    ],
    tryThis: [
      "Year 10+: watch for Mind lineages",
      "Compare culture values on selected organisms",
      "Note behaviours like teach / socialize if humans are present",
    ],
  },
  {
    id: "human-arrival",
    minYear: 11,
    order: 9,
    title: "Human arrival scenarios",
    kidTitle: "Step 9 · How do we enter?",
    scienceFocus: "Human geography · migration · origin scenarios",
    learning: [
      "Arrival route changes first camps and impacts",
      "Water landings vs land routes vs research outposts",
      "Stories and science both shape how we explain ‘beginning’",
      "No single arrival is ‘wrong’ — defend yours with evidence",
    ],
    unlocks: ["Humanity entry choices", "First settlements", "Shore vs inland spawn"],
    story:
      "Now you may introduce people. Pick any arrival story that you can justify with science or ethics. The essay rewards clear reasoning, not a secret right path.",
    essayPrompts: [
      "Justify your arrival scenario using water, food and climate data from the sim.",
      "What is the first scientific survey you would run before building homes?",
    ],
    tryThis: [
      "Choose an arrival path in the panel",
      "Zoom to new humans and inspect attributes",
      "Compare shore vs inland placement",
    ],
  },
  {
    id: "settlement-intent",
    minYear: 11,
    order: 10,
    title: "Settlement intentions",
    kidTitle: "Step 10 · What do we intend to do?",
    scienceFocus: "Sustainability · sociology · technology",
    learning: [
      "Intentions guide farming, building, research, stewardship",
      "Trade-offs: food security vs biodiversity",
      "Culture and tools change the planet faster than claws",
      "Multiple intentions can combine — that is realistic",
    ],
    unlocks: ["Intention set (up to 4)", "Town size / food / culture", "Behaviour diversity"],
    story:
      "People act with goals. Choose any mix of intentions. Record predictions, then watch the sim. Surprises are good essay material.",
    essayPrompts: [
      "Which two intentions conflict most on this world, and how would you balance them?",
      "Predict what happens to plant cover under your plan after many seasons.",
    ],
    tryThis: [
      "Select up to four intentions",
      "Watch settlement food stores and culture",
      "Note dominant human behaviours",
    ],
  },
  {
    id: "final-essay",
    minYear: 12,
    order: 11,
    title: "Final habitation essay",
    kidTitle: "Step 11 · Your final essay",
    scienceFocus: "Scientific communication · ethics · systems thinking",
    learning: [
      "A scientist explains evidence, not just opinions",
      "Link DNA, ecosystems, climate and human choices",
      "Acknowledge uncertainty and trade-offs",
      "There is no wrong conclusion if it is evidence-based",
    ],
    unlocks: ["Essay editor", "Auto evidence pack from sim", "Copy / download report"],
    story:
      "Write the final briefing as if advising a real mission council. Use what you measured. Any thoughtful plan is valid — depth and honesty matter most.",
    essayPrompts: [
      "Recommend: settle now, wait, or never — with three scientific reasons.",
      "Describe the world in 100 years under your intentions (theory).",
      "What did this lab teach you about Earth life that surprised you?",
    ],
    tryThis: [
      "Fill the essay using prompts and your stage notes",
      "Paste sim evidence (counts, structures, climate)",
      "Copy or download the full report for school",
    ],
  },
];

export const HUMANITY_ENTRIES: {
  id: HumanityEntry;
  label: string;
  kidLabel: string;
  blurb: string;
  scienceAngle: string;
}[] = [
  {
    id: "none",
    label: "Observe only",
    kidLabel: "Study first — no people yet",
    blurb: "Keep the world as a pure biological reserve while you learn.",
    scienceAngle: "Baseline ecology without human disturbance.",
  },
  {
    id: "science-outpost",
    label: "Science outpost",
    kidLabel: "Small research team first",
    blurb: "Arrive to measure, sample and report — not to conquer.",
    scienceAngle: "Minimal-impact fieldwork model.",
  },
  {
    id: "evolved",
    label: "Local evolution",
    kidLabel: "People grew from local mind-life",
    blurb: "Intelligence on this world gradually becomes human-like.",
    scienceAngle: "Continuity with local ecosystems and DNA history.",
  },
  {
    id: "wanderers",
    label: "Overland migration",
    kidLabel: "Walked in following resources",
    blurb: "Follow food, water and climate corridors on land.",
    scienceAngle: "Human geography / migration ecology.",
  },
  {
    id: "boat-people",
    label: "Coastal arrival",
    kidLabel: "Came by water to the shore",
    blurb: "Landfall at coasts and rivers — water routes first.",
    scienceAngle: "Maritime entry, estuaries, aquatic food.",
  },
  {
    id: "sky-gift",
    label: "Intentional placement",
    kidLabel: "Placed with a purpose (story + ethics)",
    blurb: "A deliberate beginning — useful for discussing responsibility.",
    scienceAngle: "Ethics of directed settlement / mythic framing.",
  },
  {
    id: "students-seed",
    label: "Designer founders",
    kidLabel: "I seeded the first people in the Creator",
    blurb: "You used the fauna creator as the founding population.",
    scienceAngle: "Synthetic / designed founding stock (lab metaphor).",
  },
];

export const HUMANITY_INTENTIONS: {
  id: HumanityIntention;
  label: string;
  kidLabel: string;
  emoji: string;
  blurb: string;
  scienceAngle: string;
}[] = [
  {
    id: "research",
    label: "Research",
    kidLabel: "Measure & learn",
    emoji: "🔬",
    blurb: "Prioritise data, experiments and understanding.",
    scienceAngle: "Scientific method as habitation strategy.",
  },
  {
    id: "steward",
    label: "Stewardship",
    kidLabel: "Care for the biosphere",
    emoji: "🌿",
    blurb: "Protect diversity, water and air quality.",
    scienceAngle: "Conservation biology.",
  },
  {
    id: "restore",
    label: "Restoration",
    kidLabel: "Heal damaged systems",
    emoji: "♻️",
    blurb: "Rebuild plant cover and balance after stress.",
    scienceAngle: "Ecological restoration.",
  },
  {
    id: "explore",
    label: "Exploration",
    kidLabel: "Map land & water",
    emoji: "🧭",
    blurb: "Travel, survey niches, expand knowledge of place.",
    scienceAngle: "Field survey / biogeography.",
  },
  {
    id: "farm",
    label: "Agriculture",
    kidLabel: "Grow food",
    emoji: "🌾",
    blurb: "Cultivate for population support.",
    scienceAngle: "Agronomy & carrying capacity.",
  },
  {
    id: "build",
    label: "Infrastructure",
    kidLabel: "Build homes & tools",
    emoji: "🏠",
    blurb: "Settlements, craft and material culture.",
    scienceAngle: "Technology & urban ecology.",
  },
  {
    id: "trade",
    label: "Exchange",
    kidLabel: "Trade & share",
    emoji: "🤝",
    blurb: "Move goods and ideas between groups.",
    scienceAngle: "Networks / cooperation.",
  },
  {
    id: "defend",
    label: "Safety",
    kidLabel: "Protect people",
    emoji: "🛡️",
    blurb: "Reduce predator and hazard risk to settlers.",
    scienceAngle: "Risk management.",
  },
  {
    id: "wonder",
    label: "Meaning & culture",
    kidLabel: "Story, art, big questions",
    emoji: "✨",
    blurb: "Ritual, ethics and science identity.",
    scienceAngle: "STS / cultural evolution.",
  },
  {
    id: "dominate",
    label: "Maximum control",
    kidLabel: "Control nature hard",
    emoji: "⚔️",
    blurb: "Expand power over ecosystems (high impact — still a valid essay path).",
    scienceAngle: "Resource extraction trade-offs.",
  },
];

export function defaultJourney(year: YearLevel = 7): SchoolJourneyState {
  return {
    schoolYear: year,
    stagesCompleted: [],
    humanityEntered: false,
    humanityEntry: "none",
    intentions: [],
    intentionNote: "",
    stageNotes: {},
    essayDraft: "",
    essayTitle: "Habitation briefing: an Earth-like world",
    ticksObserved: 0,
    startedAt: new Date().toISOString(),
  };
}

export function stagesForYear(year: YearLevel): StageInfo[] {
  return JOURNEY_STAGES.filter((s) => s.minYear <= year).sort(
    (a, b) => a.order - b.order,
  );
}

export function currentStage(journey: SchoolJourneyState): StageInfo {
  const available = stagesForYear(journey.schoolYear);
  for (const s of available) {
    if (!journey.stagesCompleted.includes(s.id)) return s;
  }
  return available[available.length - 1] ?? JOURNEY_STAGES[0]!;
}

export function canUnlockStage(
  stageId: JourneyStageId,
  year: YearLevel,
): boolean {
  const s = JOURNEY_STAGES.find((x) => x.id === stageId);
  return !!s && s.minYear <= year;
}

export function canEnterHumanity(year: YearLevel): boolean {
  return year >= 11;
}

export function canSetIntentions(year: YearLevel): boolean {
  return year >= 11;
}

export function canWriteFinalEssay(year: YearLevel): boolean {
  return year >= 11; // draft from Y11, formal finish Y12
}

/** Earth-like mission world by school year */
export function edenWorldForSchool(year: YearLevel): WorldEnv {
  const late = year >= 9;
  return {
    name:
      year <= 8
        ? "Mission world · survey"
        : year <= 10
          ? "Mission world · biosphere study"
          : "Mission world · habitation trials",
    gravity: 0.95,
    star: "yellow",
    atmosphere: {
      oxygen: 0.22,
      co2: 0.038,
      nitrogen: 0.78,
      toxin: 0.002,
      pressure: 1,
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
      axialTilt: year >= 8 ? 14 : 10,
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
      canopyRatio: 0.9, // dense forest for timber infrastructure
      predatorPressure: late ? 0.18 : 0.12,
      intelligenceSeed: year >= 10 ? 0.25 : 0,
    },
    temperatureC: 20,
    seed: 42 + year,
  };
}

const STORAGE_KEY = "yearwise-genesis-habitation-v2";

export function loadJourney(): SchoolJourneyState {
  if (typeof window === "undefined") return defaultJourney(7);
  try {
    const raw =
      localStorage.getItem(STORAGE_KEY) ||
      localStorage.getItem("yearwise-genesis-journey-v1");
    if (!raw) return defaultJourney(7);
    const parsed = JSON.parse(raw) as Partial<SchoolJourneyState>;
    return {
      ...defaultJourney((parsed.schoolYear as YearLevel) || 7),
      ...parsed,
      stageNotes: parsed.stageNotes ?? {},
      essayDraft: parsed.essayDraft ?? "",
      essayTitle:
        parsed.essayTitle ?? "Habitation briefing: an Earth-like world",
    };
  } catch {
    return defaultJourney(7);
  }
}

export function saveJourney(j: SchoolJourneyState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(j));
  } catch {
    /* ignore */
  }
}

export function completeStage(
  j: SchoolJourneyState,
  id: JourneyStageId,
): SchoolJourneyState {
  if (j.stagesCompleted.includes(id)) return j;
  if (!canUnlockStage(id, j.schoolYear)) return j;
  return { ...j, stagesCompleted: [...j.stagesCompleted, id] };
}

/** Build evidence pack + essay scaffolding from journey + live sim */
export function buildHumanityOutcome(
  journey: SchoolJourneyState,
  sim: SimState,
): {
  title: string;
  kidSummary: string;
  scientificSummary: string;
  strengths: string[];
  risks: string[];
  longTerm: string;
  essayScaffold: string;
  markdown: string;
} {
  const entry = HUMANITY_ENTRIES.find((e) => e.id === journey.humanityEntry);
  const intents = journey.intentions
    .map((id) => HUMANITY_INTENTIONS.find((i) => i.id === id))
    .filter(Boolean) as (typeof HUMANITY_INTENTIONS)[number][];

  const humans = sim.stats.humanCount;
  const flora = sim.stats.floraCount;
  const pred = sim.stats.predatorCount;
  const towns = sim.stats.settlementCount;
  const culture =
    sim.settlements.reduce((a, s) => a + s.culture, 0) /
    Math.max(1, sim.settlements.length);

  const hasSteward =
    journey.intentions.includes("steward") ||
    journey.intentions.includes("restore");
  const hasDominate = journey.intentions.includes("dominate");
  const hasFarm = journey.intentions.includes("farm");
  const hasResearch = journey.intentions.includes("research");
  const hasBuild = journey.intentions.includes("build");
  const hasTrade = journey.intentions.includes("trade");

  let kidSummary = "";
  if (!journey.humanityEntered || journey.humanityEntry === "none") {
    kidSummary = `You studied an Earth-like world as pure biology: about ${flora} plant groups and ${sim.stats.population} animals, with water covering ${(sim.stats.waterCoverage * 100).toFixed(0)}% of the surface. No wrong path — this is a valid science-first approach before habitation.`;
  } else {
    kidSummary = `Arrival: “${entry?.kidLabel ?? "people"}”. Intentions: ${
      intents.map((i) => i.kidLabel).join(", ") || "still open"
    }. Snapshot: ~${humans} humans, ${flora} plant groups, ${pred} predators, ${towns} settlements. Use these numbers as essay evidence.`;
  }

  const strengths: string[] = [];
  const risks: string[] = [];

  if (flora > 40)
    strengths.push("High plant diversity supports oxygen, food and habitat.");
  if (flora < 15)
    risks.push("Low plant cover — settlement food and air quality may suffer.");
  if (hasResearch)
    strengths.push("Research intention fits a science-led habitation plan.");
  if (hasSteward)
    strengths.push("Stewardship/restoration reduces long-term collapse risk.");
  if (hasDominate)
    risks.push(
      "Maximum-control intention can reduce biodiversity (discuss trade-offs honestly).",
    );
  if (hasFarm && flora > 25)
    strengths.push("Agriculture is feasible while wild producers remain strong.");
  if (hasFarm && flora < 20)
    risks.push("Farming on a thin plant base is high risk.");
  if (hasBuild && towns > 0)
    strengths.push("Infrastructure and culture metrics are already rising.");
  if (journey.humanityEntry === "science-outpost")
    strengths.push("Outpost-first arrival matches minimal-impact science ethics.");
  if (journey.humanityEntry === "boat-people")
    strengths.push("Coastal arrival links people to water resources and kelp zones.");
  if (journey.humanityEntry === "evolved")
    strengths.push("Local evolution ties humans to existing food webs and DNA history.");
  if (sim.stats.sexualBirths > 0)
    strengths.push(
      `Genetic mixing observed (sexual births ≈ ${sim.stats.sexualBirths}).`,
    );

  let longTerm: string;
  if (!journey.humanityEntered || journey.humanityEntry === "none") {
    longTerm =
      "Theoretical long term without settlement: the biosphere continues under orbital seasons. Your essay can argue for delayed habitation until surveys finish.";
  } else if (hasResearch && hasSteward && !hasDominate) {
    longTerm =
      "Theoretical long term: careful science-led co-existence. Settlements stay modest; biodiversity remains a mission asset.";
  } else if (hasDominate && hasFarm) {
    longTerm =
      "Theoretical long term: farmland and control expand; wild systems shrink. Essay should weigh short-term food security vs long-term resilience.";
  } else if (hasBuild && hasTrade) {
    longTerm =
      "Theoretical long term: networked towns and exchange. Success still depends on water and plant foundations.";
  } else {
    longTerm =
      "Theoretical long term: mixed strategy. Outcomes depend on keeping producers (plants) healthy and not over-hunting.";
  }

  const completed = journey.stagesCompleted.length;
  const available = stagesForYear(journey.schoolYear).length;

  const scientificSummary = [
    `Year ${journey.schoolYear} · stages completed ${completed}/${available}.`,
    `Climate snapshot: ${sim.stats.tempC.toFixed(1)}°C, light ${sim.stats.lightLevel.toFixed(2)}, AQ ${sim.stats.airQuality.toFixed(2)}, season ${sim.stats.season}.`,
    `Biosphere: flora ${flora}, fauna ${sim.stats.population}, predators ${pred}, humans ${humans}, water ${(sim.stats.waterCoverage * 100).toFixed(0)}%.`,
    `Genetics/repro: sexual births ${sim.stats.sexualBirths}, asexual ${sim.stats.asexualBirths}, flora seeds ${sim.stats.floraSeeds}.`,
    `Human pathway: entry=${journey.humanityEntry}; intentions=${journey.intentions.join("|") || "none"}; town culture≈${culture.toFixed(2)}.`,
    journey.intentionNote ? `Student note: ${journey.intentionNote}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  const stageNotesBlock = JOURNEY_STAGES.filter(
    (s) => journey.stageNotes[s.id],
  )
    .map((s) => `### ${s.kidTitle}\n${journey.stageNotes[s.id]}`)
    .join("\n\n");

  const essayScaffold = [
    `# ${journey.essayTitle || "Habitation briefing: an Earth-like world"}`,
    ``,
    `## 1. Mission context`,
    `I am advising on whether and how to inhabit an Earth-like world with diverse flora and fauna.`,
    ``,
    `## 2. Planetary conditions`,
    `(Use Step 1–2 notes: star, gravity, seasons, water, chemistry.)`,
    ``,
    `## 3. Biosphere survey`,
    `(Flora niches, fauna roles, food webs — Steps 3–6.)`,
    `Current counts: plants ${flora}, animals ${sim.stats.population}, predators ${pred}.`,
    ``,
    `## 4. Genetic and evolutionary evidence`,
    `(DNA → structures → traits; mating and generations — Steps 5 & 7.)`,
    ``,
    `## 5. Human arrival & intentions`,
    entry
      ? `Arrival choice: **${entry.label}** — ${entry.scienceAngle}`
      : "No human arrival yet (science-only survey).",
    intents.length
      ? `Intentions: ${intents.map((i) => i.label).join(", ")}.`
      : "Intentions not set.",
    ``,
    `## 6. Risks, ethics and trade-offs`,
    `There is no single correct plan. I compare benefits and harms using sim evidence.`,
    ``,
    `## 7. Recommendation`,
    `(Settle now / phased / wait / never — defend with data.)`,
    ``,
    `## 8. Reflection`,
    journey.essayDraft ||
      journey.intentionNote ||
      "(Write your own words here — any honest, evidence-based conclusion is valid.)",
  ].join("\n");

  const title = `Habitation science report · Year ${journey.schoolYear} · ${
    journey.humanityEntered ? entry?.label ?? "Settlement" : "Survey-only"
  }`;

  const markdown = [
    `# ${title}`,
    ``,
    `> **Assessment note:** There is no wrong pathway. Marks should reward clear science, use of evidence from the sim, and honest discussion of trade-offs.`,
    ``,
    `## Student-friendly summary`,
    kidSummary,
    ``,
    `## Science progress`,
    ...stagesForYear(journey.schoolYear).map(
      (s) =>
        `- [${journey.stagesCompleted.includes(s.id) ? "x" : " "}] **${s.order}. ${s.kidTitle}** (${s.scienceFocus})`,
    ),
    ``,
    `## Live evidence pack`,
    scientificSummary,
    ``,
    `## Strengths of current plan`,
    ...strengths.map((s) => `- ${s}`),
    ``,
    `## Risks / open questions`,
    ...(risks.length ? risks : ["Continue monitoring seasons and plant cover."]).map(
      (s) => `- ${s}`,
    ),
    ``,
    `## Long-term theory`,
    longTerm,
    ``,
    stageNotesBlock ? `## Field notes by step\n\n${stageNotesBlock}\n` : "",
    `## Final essay`,
    journey.essayDraft
      ? journey.essayDraft
      : essayScaffold,
    ``,
    `## Essay prompts bank`,
    ...JOURNEY_STAGES.filter((s) => s.minYear <= journey.schoolYear).flatMap(
      (s) => s.essayPrompts.map((p) => `- (${s.order}) ${p}`),
    ),
  ]
    .filter(Boolean)
    .join("\n");

  return {
    title,
    kidSummary,
    scientificSummary,
    strengths: strengths.length
      ? strengths
      : ["You are gathering evidence systematically."],
    risks: risks.length
      ? risks
      : ["Keep linking claims to sim measurements."],
    longTerm,
    essayScaffold,
    markdown,
  };
}

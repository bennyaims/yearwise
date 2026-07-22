/**
 * Fauna & Flora creator — student designs for injection into Genesis Lab.
 * Builds real ATG open reading frames from trait themes / structure kits.
 */

import { expressGene, STARTER_STRAINS, type LifeRole } from "./dna";
import type { Sex } from "./society";

// ─── Codon helpers (DNA form of genetic code) ────────

const AA_TO_DNA: Record<string, string[]> = {
  A: ["GCT", "GCC", "GCA"],
  R: ["CGT", "CGC", "AGA"],
  N: ["AAT", "AAC"],
  D: ["GAT", "GAC"],
  C: ["TGT", "TGC"],
  Q: ["CAA", "CAG"],
  E: ["GAA", "GAG"],
  G: ["GGT", "GGC", "GGA"],
  H: ["CAT", "CAC"],
  I: ["ATT", "ATC"],
  L: ["CTT", "CTG", "TTA"],
  K: ["AAA", "AAG"],
  M: ["ATG"],
  F: ["TTT", "TTC"],
  P: ["CCT", "CCC", "CCA"],
  S: ["TCT", "TCC", "AGT"],
  T: ["ACT", "ACC"],
  W: ["TGG"],
  Y: ["TAT", "TAC"],
  V: ["GTT", "GTC", "GTG"],
};

function aaToDna(aa: string, rng: () => number): string {
  let out = "ATG"; // start Met
  for (const ch of aa.toUpperCase()) {
    if (ch === "M" && out.length === 3) continue;
    const codons = AA_TO_DNA[ch];
    if (!codons) continue;
    out += codons[Math.floor(rng() * codons.length)]!;
  }
  out += "TAA"; // stop
  return out;
}

// ─── Fauna templates ─────────────────────────────────

export type FaunaTemplateId =
  | "custom"
  | "phototroph"
  | "herbivore"
  | "predator"
  | "scavenger"
  | "armoured"
  | "flyer-ish"
  | "aquatic"
  | "sapient"
  | "human"
  | "chimera"
  | "from-strain";

export type FaunaBlueprint = {
  name: string;
  template: FaunaTemplateId;
  /** when template is from-strain */
  strainId?: string;
  /** custom AA sequence (no start/stop required) */
  customAa?: string;
  sex: Sex | "random";
  count: number;
  energyBoost: number;
  culture: number;
  forceRole?: LifeRole;
  /** spawn near origin (0) … scatter (1) */
  scatter: number;
};

export const FAUNA_TEMPLATES: {
  id: FaunaTemplateId;
  label: string;
  blurb: string;
  /** representative AA theme (after start M) */
  aaTheme: string;
  forceRole?: LifeRole;
}[] = [
  {
    id: "phototroph",
    label: "Phototroph / flora-morph",
    blurb: "Aromatic + TM helices — light-harvesting body.",
    aaTheme: "FWYLALGLFWYLHLAALFW",
    forceRole: "flora-morph",
  },
  {
    id: "herbivore",
    label: "Herbivore grazer",
    blurb: "Digestive enzyme theme + mild mobility.",
    aaTheme: "SHDEALVKGSFTLKEVAD",
    forceRole: "herbivore",
  },
  {
    id: "predator",
    label: "Predator hunter",
    blurb: "Motor + toxin Cys — hunting morph.",
    aaTheme: "EKIILREVAWCGCKEKL",
    forceRole: "predator",
  },
  {
    id: "scavenger",
    label: "Scavenger / detritivore",
    blurb: "Catalytic + polar — eats detritus patches.",
    aaTheme: "SHDGSFTNEDKLAVGS",
  },
  {
    id: "armoured",
    label: "Armoured / shell",
    blurb: "Cys coat + collagen Gly-Pro — heavy defence.",
    aaTheme: "CGPGCPGCCGPGPGPG",
  },
  {
    id: "flyer-ish",
    label: "Fast / winged morph",
    blurb: "Motor + coiled-coil + light frame.",
    aaTheme: "EKLRKELVEKEKLLKE",
    forceRole: undefined,
  },
  {
    id: "aquatic",
    label: "Aquatic / chemo",
    blurb: "Membrane + channel + negative — water niche.",
    aaTheme: "LIVLFLVAIYDEEQTL",
  },
  {
    id: "sapient",
    label: "Sapient mind",
    blurb: "DNA-binding poly-basic — intelligence path.",
    aaTheme: "KRKRKKSAKRKCGKRK",
    forceRole: "intelligent",
  },
  {
    id: "human",
    label: "Human inhabitant",
    blurb: "Full human with culture — joins settlements.",
    aaTheme: "KRKRKKSAKRKCGKNYLRK",
    forceRole: "human",
  },
  {
    id: "chimera",
    label: "Chimera mix",
    blurb: "Mixed chemistry — unpredictable morph.",
    aaTheme: "FIACYERTHEKWVGLDS",
  },
  {
    id: "from-strain",
    label: "Lab starter strain",
    blurb: "Use an existing Genesis starter ORF.",
    aaTheme: "",
  },
  {
    id: "custom",
    label: "Custom amino acids",
    blurb: "Type your own AA sequence (A–Y letters).",
    aaTheme: "ALKEVAD",
  },
];

export function defaultFaunaBlueprint(): FaunaBlueprint {
  return {
    name: "Custom fauna",
    template: "herbivore",
    sex: "random",
    count: 2,
    energyBoost: 1,
    culture: 0.1,
    scatter: 0.7,
  };
}

export function buildFaunaDna(bp: FaunaBlueprint, rng: () => number = Math.random): string {
  if (bp.template === "from-strain" && bp.strainId) {
    const s = STARTER_STRAINS.find((x) => x.id === bp.strainId);
    return s?.dna ?? STARTER_STRAINS[0]!.dna;
  }
  if (bp.template === "custom" && bp.customAa && bp.customAa.length >= 3) {
    return aaToDna(bp.customAa.replace(/[^A-Za-z]/g, ""), rng);
  }
  const tpl = FAUNA_TEMPLATES.find((t) => t.id === bp.template);
  const theme = tpl?.aaTheme || "ALKEVAD";
  // slight variation per individual
  let aa = theme;
  if (rng() < 0.4 && aa.length > 4) {
    const i = 1 + Math.floor(rng() * (aa.length - 1));
    const mut = "ACDEFGHIKLMNPQRSTVWY"[Math.floor(rng() * 20)]!;
    aa = aa.slice(0, i) + mut + aa.slice(i + 1);
  }
  return aaToDna(aa, rng);
}

export function previewFauna(bp: FaunaBlueprint) {
  const dna = buildFaunaDna(bp, () => 0.42);
  const expr = expressGene(dna);
  const tpl = FAUNA_TEMPLATES.find((t) => t.id === bp.template);
  return {
    dna,
    expression: expr,
    suggestedRole: tpl?.forceRole ?? expr.traits,
    template: tpl,
  };
}

// ─── Flora templates ─────────────────────────────────

export type FloraKind = "moss" | "shrub" | "tree" | "kelp";

export type FloraBlueprint = {
  name: string;
  kind: FloraKind;
  count: number;
  height: number; // relative 0.3–1.5 multiplier
  health: number;
  sex: Sex | "random";
  scatter: number;
  /** clustered near water */
  nearWater: boolean;
};

export const FLORA_KINDS: {
  id: FloraKind;
  label: string;
  blurb: string;
  baseHeight: number;
  baseRadius: number;
}[] = [
  {
    id: "moss",
    label: "Moss / ground cover",
    blurb: "Low carpet — fast vegetative spread.",
    baseHeight: 0.18,
    baseRadius: 0.14,
  },
  {
    id: "shrub",
    label: "Shrub / bush",
    blurb: "Mid canopy — berries / cover for fauna.",
    baseHeight: 0.7,
    baseRadius: 0.32,
  },
  {
    id: "tree",
    label: "Tree",
    blurb: "Tall canopy — long-lived sexual seeder.",
    baseHeight: 2.2,
    baseRadius: 0.45,
  },
  {
    id: "kelp",
    label: "Kelp / aquatic",
    blurb: "Water column producer — shallow shores.",
    baseHeight: 1.3,
    baseRadius: 0.2,
  },
];

export function defaultFloraBlueprint(): FloraBlueprint {
  return {
    name: "Custom flora",
    kind: "tree",
    count: 3,
    height: 1,
    health: 0.75,
    sex: "random",
    scatter: 0.8,
    nearWater: false,
  };
}

export function faunaForceRole(bp: FaunaBlueprint): LifeRole | undefined {
  if (bp.forceRole) return bp.forceRole;
  return FAUNA_TEMPLATES.find((t) => t.id === bp.template)?.forceRole;
}

/**
 * DNA → RNA → amino acids → known structures → traits for Genesis Lab.
 * Uses the standard genetic code and structure chemistry from biology.ts.
 */

import {
  BIOLOGY_STARTER_GENOMES,
  expressBiology,
  structuresToTraits,
  type BioComplex,
  type BioStructure,
  type BioStructureId,
  type SecondaryElement,
  type StructureLevel,
} from "./biology";

export type Base = "A" | "T" | "G" | "C";
export type RnaBase = "A" | "U" | "G" | "C";

/** Functional protein classes that shape organism morphology & behaviour */
export type ProteinClass =
  | "STRUCT" // body structure / size
  | "MOTILE" // movement appendages
  | "PHOTO" // light harvesting
  | "RESP" // respiration / O2 use
  | "SHELL" // armour / shell
  | "SENSE" // sensors
  | "REP" // replication rate
  | "META" // metabolism speed
  | "PIGM" // pigment / colour
  | "TOX" // toxin resistance
  | "DIGEST" // consume food patches / organics
  | "CHEM" // chemo / mineral / acid tolerance
  | "PRED" // predation / hunting drive
  | "MIND" // cognition / intelligence
  | "NONE";

export type Protein = {
  name: string;
  klass: ProteinClass;
  strength: number; // 1–3 from codon usage / structure score
};

/** Known structure summary for UI / theory reports */
export type StructureHit = {
  id: BioStructureId;
  name: string;
  score: number;
  realWorld: string;
  description: string;
  level: StructureLevel;
  complexity: number;
};

export type GeneExpression = {
  dna: string;
  rna: string;
  proteins: Protein[];
  traits: OrganismTraits;
  /** Polypeptide (single-letter AA codes) from standard genetic code */
  aminoAcidSequence: string;
  /** Secondary structure runs (α-helix / β-sheet / loop) */
  secondary: SecondaryElement[];
  /** Compact secondary summary e.g. "α 42% · β 18% · loop 40%" */
  secondarySummary: string;
  /** Known biological assemblies built from fold chemistry */
  structures: StructureHit[];
  /** Supramolecular systems (organelle / tissue level) */
  complexes: BioComplex[];
  /** Detected sequence motifs */
  motifs: string[];
  primaryStructures: BioStructureId[];
};

export type OrganismTraits = {
  size: number; // 0.3–2.5
  speed: number;
  energyEfficiency: number;
  lightUse: number;
  oxygenNeed: number;
  armor: number;
  sensing: number;
  replicationRate: number;
  metabolism: number;
  hue: number; // 0–360
  toxinResist: number;
  limbCount: number;
  symmetry: number;
  /** ability to eat detritus / food patches */
  digestion: number;
  /** chemo / mineral use & acid tolerance */
  chemoUse: number;
  /** seasonal hardiness (winter survival) */
  seasonalHardiness: number;
  /** hunting / predation strength */
  predation: number;
  /** intelligence / tool-culture potential 0–1+ */
  intelligence: number;
};

/** Ecological / behavioural role for flora–fauna–human food web */
export type LifeRole =
  | "flora-morph" // sessile photo producer-like animal
  | "herbivore"
  | "omnivore"
  | "predator"
  | "scavenger"
  | "intelligent" // proto-sapient
  | "human"; // full human inhabitant with culture/behaviour

const CODON_TABLE: Record<string, ProteinClass> = {
  // Structure
  GCU: "STRUCT",
  GCC: "STRUCT",
  GCA: "STRUCT",
  GCG: "STRUCT",
  // Motility
  AUU: "MOTILE",
  AUC: "MOTILE",
  AUA: "MOTILE",
  // Photosynthesis-like
  UUU: "PHOTO",
  UUC: "PHOTO",
  UUA: "PHOTO",
  // Respiration
  CGU: "RESP",
  CGC: "RESP",
  CGA: "RESP",
  // Shell
  UGU: "SHELL",
  UGC: "SHELL",
  // Sense
  ACU: "SENSE",
  ACC: "SENSE",
  ACA: "SENSE",
  // Replication
  AGA: "REP",
  AGG: "REP",
  // Metabolism
  GAA: "META",
  GAG: "META",
  // Pigment
  UAU: "PIGM",
  UAC: "PIGM",
  // Toxin resist
  CAU: "TOX",
  CAC: "TOX",
  // Digestion / heterotrophy
  CUU: "DIGEST",
  CUC: "DIGEST",
  CUA: "DIGEST",
  // Chemo / minerals / acid
  GGU: "CHEM",
  GGC: "CHEM",
  GGA: "CHEM",
  // Predation
  UGG: "PRED",
  UCG: "PRED",
  UCC: "PRED",
  // Mind / intelligence
  AAA: "MIND",
  AAG: "MIND",
  AAC: "MIND",
  // Stop-like
  UAA: "NONE",
  UAG: "NONE",
  UGA: "NONE",
};

const BASES: Base[] = ["A", "T", "G", "C"];

export function randomDna(length = 48, rng: () => number = Math.random): string {
  // length multiple of 3 for codons after transcription
  const n = Math.max(12, Math.floor(length / 3) * 3);
  let s = "";
  for (let i = 0; i < n; i++) s += BASES[Math.floor(rng() * 4)]!;
  return s;
}

/** DNA replication with optional mutation */
export function replicateDna(
  dna: string,
  mutationRate: number,
  rng: () => number = Math.random,
): string {
  let out = "";
  for (const b of dna) {
    if (rng() < mutationRate) {
      const others = BASES.filter((x) => x !== b);
      out += others[Math.floor(rng() * others.length)]!;
    } else {
      out += b;
    }
  }
  return out;
}

/** Transcription: T → U */
export function transcribe(dna: string): string {
  return dna.replace(/T/g, "U");
}

/** Translation: codons → proteins */
export function translate(rna: string): Protein[] {
  const proteins: Protein[] = [];
  for (let i = 0; i + 2 < rna.length; i += 3) {
    const codon = rna.slice(i, i + 3);
    const klass = CODON_TABLE[codon] ?? "NONE";
    if (klass === "NONE") continue;
    const strength = 1 + (codon.charCodeAt(2) % 3);
    proteins.push({
      name: `${klass}-${codon}`,
      klass,
      strength,
    });
  }
  return proteins;
}

function sumClass(proteins: Protein[], klass: ProteinClass): number {
  return proteins
    .filter((p) => p.klass === klass)
    .reduce((a, p) => a + p.strength, 0);
}

export function proteinsToTraits(proteins: Protein[]): OrganismTraits {
  const struct = sumClass(proteins, "STRUCT");
  const motile = sumClass(proteins, "MOTILE");
  const photo = sumClass(proteins, "PHOTO");
  const resp = sumClass(proteins, "RESP");
  const shell = sumClass(proteins, "SHELL");
  const sense = sumClass(proteins, "SENSE");
  const rep = sumClass(proteins, "REP");
  const meta = sumClass(proteins, "META");
  const pigm = sumClass(proteins, "PIGM");
  const tox = sumClass(proteins, "TOX");
  const digest = sumClass(proteins, "DIGEST");
  const chem = sumClass(proteins, "CHEM");
  const pred = sumClass(proteins, "PRED");
  const mind = sumClass(proteins, "MIND");

  const size = clamp(0.35 + struct * 0.12 + shell * 0.05 + pred * 0.04, 0.3, 2.8);
  const speed = clamp(
    0.15 + motile * 0.14 - shell * 0.04 + meta * 0.03 + pred * 0.06,
    0.05,
    2.4,
  );
  const lightUse = clamp(photo * 0.18, 0, 1.5);
  const oxygenNeed = clamp(
    0.2 + resp * 0.1 + meta * 0.05 - photo * 0.08 + mind * 0.03,
    0.05,
    1.8,
  );
  const armor = clamp(shell * 0.2 + pred * 0.03, 0, 1.5);
  const sensing = clamp(sense * 0.15 + mind * 0.12 + pred * 0.05, 0, 1.8);
  const replicationRate = clamp(
    0.2 + rep * 0.12 - struct * 0.02 - mind * 0.03,
    0.05,
    1.5,
  );
  const metabolism = clamp(0.3 + meta * 0.15 + resp * 0.05 + pred * 0.04, 0.1, 2);
  const hue = (pigm * 47 + struct * 13 + photo * 29 + chem * 11 + mind * 17) % 360;
  const toxinResist = clamp(tox * 0.2 + chem * 0.05, 0, 1.5);
  const limbCount = Math.min(
    8,
    Math.max(0, Math.round(motile / 2 + pred * 0.3 + mind * 0.2)),
  );
  const symmetry = clamp(0.4 + struct * 0.05 - meta * 0.02 + mind * 0.04, 0.2, 1);
  const digestion = clamp(digest * 0.2 + meta * 0.04 + pred * 0.08, 0, 1.6);
  const chemoUse = clamp(chem * 0.2 + digest * 0.05, 0, 1.5);
  const seasonalHardiness = clamp(
    0.25 + shell * 0.08 + tox * 0.08 + chem * 0.06 + meta * 0.04,
    0.1,
    1.5,
  );
  const predation = clamp(pred * 0.22 + motile * 0.04 + sense * 0.03, 0, 1.8);
  const intelligence = clamp(
    mind * 0.2 + sense * 0.08 + meta * 0.04 + (mind > 0 ? 0.1 : 0),
    0,
    1.6,
  );
  const energyEfficiency = clamp(
    0.4 +
      photo * 0.08 +
      resp * 0.05 +
      chem * 0.04 +
      mind * 0.03 -
      metabolism * 0.1,
    0.1,
    1.4,
  );

  return {
    size,
    speed,
    energyEfficiency,
    lightUse,
    oxygenNeed,
    armor,
    sensing,
    replicationRate,
    metabolism,
    hue,
    toxinResist,
    limbCount,
    symmetry,
    digestion,
    chemoUse,
    seasonalHardiness,
    predation,
    intelligence,
  };
}

/**
 * Classify fauna roles from traits.
 * Full **human** is never auto-classified from DNA alone — school journey
 * introduces humans via forceRole so Years 7–10 stay wild Eden.
 */
export function classifyLifeRole(t: OrganismTraits): LifeRole {
  if (t.intelligence >= 0.55 && t.sensing >= 0.4) return "intelligent";
  if (t.predation >= 0.55 && t.speed >= 0.4) return "predator";
  if (t.lightUse >= 0.7 && t.speed < 0.45 && t.digestion < 0.35)
    return "flora-morph";
  if (t.digestion >= 0.45 && t.predation < 0.35 && t.lightUse < 0.5)
    return "scavenger";
  if (t.digestion >= 0.35 && t.predation >= 0.3) return "omnivore";
  if (t.digestion >= 0.25 || t.lightUse >= 0.35) return "herbivore";
  return "omnivore";
}

/** Map known assemblies → sim protein classes for UI / dominant-protein stats */
const STRUCTURE_TO_CLASS: Record<BioStructureId, ProteinClass> = {
  "lipid-bilayer": "STRUCT",
  "alpha-helix-bundle": "STRUCT",
  "coiled-coil": "STRUCT",
  "beta-barrel": "CHEM",
  "beta-sheet-stack": "STRUCT",
  "immunoglobulin-fold": "SENSE",
  "tim-barrel": "META",
  "leucine-rich-repeat": "SENSE",
  "zinc-finger": "MIND",
  "helix-turn-helix": "MIND",
  "kinase-domain": "META",
  "gpcr-7tm": "SENSE",
  "chaperone-fold": "META",
  "histone-fold": "MIND",
  "ubiquitin-like": "REP",
  "actin-filament": "MOTILE",
  microtubule: "MOTILE",
  "intermediate-filament": "STRUCT",
  "collagen-triple-helix": "STRUCT",
  "amyloid-fibre": "STRUCT",
  "ion-channel": "SENSE",
  "receptor-domain": "SENSE",
  "motor-protein": "MOTILE",
  "atp-synthase": "META",
  cytochrome: "RESP",
  photosystem: "PHOTO",
  "opsin-photoreceptor": "SENSE",
  "vesicle-coat": "META",
  "gap-junction": "SENSE",
  "tight-junction": "SHELL",
  "hemoglobin-fold": "RESP",
  "enzyme-pocket": "META",
  "catalytic-triad": "DIGEST",
  "dna-binding": "MIND",
  "ribosome-like": "REP",
  "nuclear-pore": "REP",
  "heat-shock": "TOX",
  "toxin-domain": "PRED",
  antifreeze: "TOX",
  bioluminescence: "PIGM",
  "nitrogenase-like": "CHEM",
  magnetosome: "SENSE",
  "extracellular-coat": "SHELL",
  "cadherin-adhesion": "STRUCT",
  "bone-matrix": "STRUCT",
  "cell-wall": "SHELL",
  "electron-transport-chain": "RESP",
  "contractile-sarcomere": "MOTILE",
  "nucleus-complex": "MIND",
  "synapse-scaffold": "SENSE",
  "cilium-flagellum": "MOTILE",
  "immune-recognition": "SENSE",
  "photosynthetic-apparatus": "PHOTO",
  "nervous-circuit": "MIND",
};

function structuresToProteins(structures: BioStructure[]): Protein[] {
  return structures.map((s) => ({
    name: s.name,
    klass: STRUCTURE_TO_CLASS[s.id] ?? "META",
    strength: Math.max(1, Math.min(3, Math.round(s.score * 3))),
  }));
}

function formatSecondarySummary(
  secondary: SecondaryElement[],
  length: number,
): string {
  let h = 0;
  let s = 0;
  let l = 0;
  for (const el of secondary) {
    const n = el.end - el.start + 1;
    if (el.type === "helix") h += n;
    else if (el.type === "sheet") s += n;
    else l += n;
  }
  const L = Math.max(1, length);
  return `α ${Math.round((h / L) * 100)}% · β ${Math.round((s / L) * 100)}% · loop ${Math.round((l / L) * 100)}%`;
}

/**
 * Full pipeline: DNA → transcription → genetic code → AA chain →
 * secondary structure → known biological assemblies → ecology traits.
 */
export function expressGene(dna: string): GeneExpression {
  const bio = expressBiology(dna);
  const structureHits = bio.structures.map(toStructureHit);
  const secondarySummary = formatSecondarySummary(
    bio.secondary,
    bio.foldStats.length,
  );

  // Short / empty peptides: fall back to legacy codon→class map for playability
  if (bio.aminoAcidSequence.length < 4 || bio.structures.length === 0) {
    const legacy = translate(bio.rna);
    const proteins = legacy.length
      ? legacy
      : structuresToProteins(bio.structures);
    const traits =
      legacy.length > 0
        ? proteinsToTraits(legacy)
        : structuresToTraits(bio.structures, bio.foldStats);
    return {
      dna: bio.dna,
      rna: bio.rna,
      proteins,
      traits,
      aminoAcidSequence: bio.aminoAcidSequence,
      secondary: bio.secondary,
      secondarySummary,
      structures: structureHits,
      complexes: bio.complexes,
      motifs: bio.motifs,
      primaryStructures: bio.primaryStructures,
    };
  }

  const traits = structuresToTraits(bio.structures, bio.foldStats);
  let proteins = structuresToProteins(bio.structures);

  // Enzyme / triad → DIGEST
  const enzyme = bio.structures.find(
    (s) => s.id === "enzyme-pocket" || s.id === "catalytic-triad",
  );
  if (enzyme && enzyme.score >= 0.5) {
    proteins = [
      ...proteins,
      {
        name: "Catalytic digestion",
        klass: "DIGEST",
        strength: Math.max(1, Math.round(enzyme.score * 3)),
      },
    ];
  }
  // Motor / sarcomere / toxin → predation
  const motor = bio.structures.find(
    (s) =>
      s.id === "motor-protein" ||
      s.id === "contractile-sarcomere" ||
      s.id === "toxin-domain",
  );
  const receptor = bio.structures.find(
    (s) => s.id === "receptor-domain" || s.id === "gpcr-7tm",
  );
  if (motor && motor.score >= 0.5 && (receptor?.score ?? 0) >= 0.28) {
    proteins = [
      ...proteins,
      {
        name: "Hunt drive assembly",
        klass: "PRED",
        strength: Math.max(
          1,
          Math.round(((motor.score + (receptor?.score ?? 0)) / 2) * 3),
        ),
      },
    ];
  }

  return {
    dna: bio.dna,
    rna: bio.rna,
    proteins,
    traits,
    aminoAcidSequence: bio.aminoAcidSequence,
    secondary: bio.secondary,
    secondarySummary,
    structures: structureHits,
    complexes: bio.complexes,
    motifs: bio.motifs,
    primaryStructures: bio.primaryStructures,
  };
}

function toStructureHit(s: BioStructure): StructureHit {
  return {
    id: s.id,
    name: s.name,
    score: s.score,
    realWorld: s.realWorld,
    description: s.description,
    level: s.level,
    complexity: s.complexity,
  };
}

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

/** Seed strains — real ATG open reading frames tuned for known structures */
export const STARTER_STRAINS: {
  id: string;
  name: string;
  dna: string;
  blurb: string;
  expectedStructures?: string[];
}[] = [
  ...BIOLOGY_STARTER_GENOMES.map((g) => ({
    id: g.id,
    name: g.name,
    dna: g.dna,
    blurb: g.blurb,
    expectedStructures: g.expectedStructures,
  })),
  {
    id: "chimera",
    name: "Chimera mix ORF",
    dna: "ATGTTCATTGCCTGTTACGAAAGAACTCATGAGAAGTAAG",
    blurb: "Mixed residues — unpredictable fold mix and morphs.",
    expectedStructures: ["Mixed assemblies"],
  },
  {
    id: "coat-shell",
    name: "Coat / shell ORF",
    dna: "ATGTGCGGACCTGGCTGCCCGGGCTGCTGCTAAG",
    blurb: "Cys + Gly/Pro — extracellular coat / cuticle armour theme.",
    expectedStructures: ["Extracellular coat", "Collagen-like"],
  },
];

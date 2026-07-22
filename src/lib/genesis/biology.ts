/**
 * Biology engine for Genesis Lab
 * ─────────────────────────────
 * Educational model grounded in real molecular biology:
 *  - DNA bases A/T/G/C
 *  - Transcription (T→U)
 *  - Standard genetic code → amino acids
 *  - Amino-acid chemistry → secondary structure propensities
 *  - Fold classes → known biological assemblies
 *
 * Not a full MD simulator — a structure-aware genotype→phenotype map
 * students can reason about with real terminology.
 */

// ─── Nucleic acids ───────────────────────────────────

export type DnaBase = "A" | "T" | "G" | "C";
export type RnaBase = "A" | "U" | "G" | "C";

export const DNA_BASES: DnaBase[] = ["A", "T", "G", "C"];

// ─── Amino acids (standard 20 + stop) ────────────────

export type AaProperty =
  | "hydrophobic"
  | "polar"
  | "positive"
  | "negative"
  | "special";

export type AminoAcidDef = {
  code: string;
  name: string;
  property: AaProperty;
  /** Chou–Fasman style propensity (simplified teaching values) */
  helix: number;
  sheet: number;
  /** mass proxy */
  bulk: number;
};

/** Real residue properties used for folding heuristics */
export const AMINO_ACIDS: Record<string, AminoAcidDef> = {
  A: { code: "A", name: "Alanine", property: "hydrophobic", helix: 1.4, sheet: 0.8, bulk: 1 },
  R: { code: "R", name: "Arginine", property: "positive", helix: 1.0, sheet: 0.9, bulk: 3 },
  N: { code: "N", name: "Asparagine", property: "polar", helix: 0.8, sheet: 0.7, bulk: 2 },
  D: { code: "D", name: "Aspartate", property: "negative", helix: 0.9, sheet: 0.6, bulk: 2 },
  C: { code: "C", name: "Cysteine", property: "special", helix: 0.7, sheet: 1.2, bulk: 1 },
  Q: { code: "Q", name: "Glutamine", property: "polar", helix: 1.1, sheet: 0.8, bulk: 2 },
  E: { code: "E", name: "Glutamate", property: "negative", helix: 1.5, sheet: 0.5, bulk: 2 },
  G: { code: "G", name: "Glycine", property: "special", helix: 0.4, sheet: 0.6, bulk: 0 },
  H: { code: "H", name: "Histidine", property: "positive", helix: 1.0, sheet: 0.9, bulk: 2 },
  I: { code: "I", name: "Isoleucine", property: "hydrophobic", helix: 1.0, sheet: 1.6, bulk: 2 },
  L: { code: "L", name: "Leucine", property: "hydrophobic", helix: 1.3, sheet: 1.2, bulk: 2 },
  K: { code: "K", name: "Lysine", property: "positive", helix: 1.2, sheet: 0.7, bulk: 2 },
  M: { code: "M", name: "Methionine", property: "hydrophobic", helix: 1.4, sheet: 1.0, bulk: 2 },
  F: { code: "F", name: "Phenylalanine", property: "hydrophobic", helix: 1.1, sheet: 1.4, bulk: 3 },
  P: { code: "P", name: "Proline", property: "special", helix: 0.3, sheet: 0.5, bulk: 1 },
  S: { code: "S", name: "Serine", property: "polar", helix: 0.8, sheet: 0.9, bulk: 1 },
  T: { code: "T", name: "Threonine", property: "polar", helix: 0.8, sheet: 1.2, bulk: 1 },
  W: { code: "W", name: "Tryptophan", property: "hydrophobic", helix: 1.0, sheet: 1.3, bulk: 4 },
  Y: { code: "Y", name: "Tyrosine", property: "polar", helix: 0.7, sheet: 1.3, bulk: 3 },
  V: { code: "V", name: "Valine", property: "hydrophobic", helix: 0.9, sheet: 1.7, bulk: 2 },
};

/**
 * Standard genetic code (RNA codons → amino acid single letter; * = stop)
 * Source: universal code taught in Year 11–12 biology.
 */
export const GENETIC_CODE: Record<string, string> = {
  UUU: "F", UUC: "F", UUA: "L", UUG: "L",
  UCU: "S", UCC: "S", UCA: "S", UCG: "S",
  UAU: "Y", UAC: "Y", UAA: "*", UAG: "*",
  UGU: "C", UGC: "C", UGA: "*", UGG: "W",
  CUU: "L", CUC: "L", CUA: "L", CUG: "L",
  CCU: "P", CCC: "P", CCA: "P", CCG: "P",
  CAU: "H", CAC: "H", CAA: "Q", CAG: "Q",
  CGU: "R", CGC: "R", CGA: "R", CGG: "R",
  AUU: "I", AUC: "I", AUA: "I", AUG: "M", // start
  ACU: "T", ACC: "T", ACA: "T", ACG: "T",
  AAU: "N", AAC: "N", AAA: "K", AAG: "K",
  AGU: "S", AGC: "S", AGA: "R", AGG: "R",
  GUU: "V", GUC: "V", GUA: "V", GUG: "V",
  GCU: "A", GCC: "A", GCA: "A", GCG: "A",
  GAU: "D", GAC: "D", GAA: "E", GAG: "E",
  GGU: "G", GGC: "G", GGA: "G", GGG: "G",
};

// ─── Secondary structure ─────────────────────────────

export type SecondaryElement = {
  type: "helix" | "sheet" | "loop";
  start: number;
  end: number;
  sequence: string;
};

/**
 * Sliding-window secondary structure assignment (Chou–Fasman inspired).
 * Real cells use hydrogen bonding; we use residue propensities for teaching.
 */
export function predictSecondary(aaSeq: string): SecondaryElement[] {
  if (aaSeq.length < 4) {
    return [{ type: "loop", start: 0, end: Math.max(0, aaSeq.length - 1), sequence: aaSeq }];
  }
  const types: ("helix" | "sheet" | "loop")[] = [];
  for (let i = 0; i < aaSeq.length; i++) {
    let h = 0;
    let s = 0;
    let n = 0;
    for (let j = Math.max(0, i - 2); j <= Math.min(aaSeq.length - 1, i + 2); j++) {
      const def = AMINO_ACIDS[aaSeq[j]!] ?? AMINO_ACIDS.A!;
      h += def.helix;
      s += def.sheet;
      n++;
    }
    h /= n;
    s /= n;
    if (h > 1.05 && h >= s) types.push("helix");
    else if (s > 1.05 && s > h) types.push("sheet");
    else types.push("loop");
  }
  // Merge runs
  const elements: SecondaryElement[] = [];
  let start = 0;
  for (let i = 1; i <= types.length; i++) {
    if (i === types.length || types[i] !== types[start]) {
      elements.push({
        type: types[start]!,
        start,
        end: i - 1,
        sequence: aaSeq.slice(start, i),
      });
      start = i;
    }
  }
  return elements;
}

// ─── Known biological structure types ────────────────

/**
 * Canonical assemblies from real molecular biology.
 * Levels: fold → domain → filament → organelle → tissue system.
 */
export type BioStructureId =
  // Folds & domains
  | "lipid-bilayer"
  | "alpha-helix-bundle"
  | "coiled-coil"
  | "beta-barrel"
  | "beta-sheet-stack"
  | "immunoglobulin-fold"
  | "tim-barrel"
  | "leucine-rich-repeat"
  | "zinc-finger"
  | "helix-turn-helix"
  | "kinase-domain"
  | "gpcr-7tm"
  | "chaperone-fold"
  | "histone-fold"
  | "ubiquitin-like"
  // Filaments & polymers
  | "actin-filament"
  | "microtubule"
  | "intermediate-filament"
  | "collagen-triple-helix"
  | "amyloid-fibre"
  // Membrane machines
  | "ion-channel"
  | "receptor-domain"
  | "motor-protein"
  | "atp-synthase"
  | "cytochrome"
  | "photosystem"
  | "opsin-photoreceptor"
  | "vesicle-coat"
  | "gap-junction"
  | "tight-junction"
  // Soluble machines
  | "hemoglobin-fold"
  | "enzyme-pocket"
  | "catalytic-triad"
  | "dna-binding"
  | "ribosome-like"
  | "nuclear-pore"
  | "heat-shock"
  | "toxin-domain"
  | "antifreeze"
  | "bioluminescence"
  | "nitrogenase-like"
  | "magnetosome"
  // ECM / adhesion / armour
  | "extracellular-coat"
  | "cadherin-adhesion"
  | "bone-matrix"
  | "cell-wall"
  // Tissue / organelle systems (supramolecular)
  | "electron-transport-chain"
  | "contractile-sarcomere"
  | "nucleus-complex"
  | "synapse-scaffold"
  | "cilium-flagellum"
  | "immune-recognition"
  | "photosynthetic-apparatus"
  | "nervous-circuit";

export type StructureLevel =
  | "fold"
  | "domain"
  | "filament"
  | "membrane-machine"
  | "soluble-machine"
  | "ecm"
  | "system";

export type BioStructure = {
  id: BioStructureId;
  name: string;
  realWorld: string;
  description: string;
  /** 0–1 confidence this genome builds it */
  score: number;
  secondarySupport: string;
  aaSupport: string;
  level: StructureLevel;
  /** Complexity rank 1–5 for teaching / UI */
  complexity: number;
};

/** Multi-subunit assemblies built when component structures co-occur */
export type BioComplex = {
  id: string;
  name: string;
  realWorld: string;
  description: string;
  components: BioStructureId[];
  score: number;
  complexity: number;
};

export type FoldStats = {
  helixFraction: number;
  sheetFraction: number;
  loopFraction: number;
  hydrophobic: number;
  polar: number;
  positive: number;
  negative: number;
  special: number;
  length: number;
  cysteine: number;
  proline: number;
  glycine: number;
  // Motif detectors (0–1)
  aromatic: number;
  histidine: number;
  serine: number;
  /** Gly-X-Y collagen-like repeat density */
  glyXY: number;
  /** Coiled-coil heptad (hydrophobic a/d) proxy */
  coiledCoil: number;
  /** Cys pairs for disulfides / zinc fingers */
  cysPairs: number;
  /** Long hydrophobic window → TM helix */
  tmWindow: number;
  /** Poly-basic stretch (NLS / DNA) */
  polyBasic: number;
  /** Ser-His-Asp catalytic triad proxy */
  catalyticTriad: number;
  /** FG / Gly-rich disordered gate */
  fgDisorder: number;
  /** GxxxxGK nucleotide-binding (Walker-like) */
  walkerLike: number;
  /** RGD adhesion motif */
  rgd: number;
  /** Leu-rich / LxxLxL */
  leuRich: number;
  /** Amphipathic helix (polar one face) */
  amphipathic: number;
};

export function foldStats(
  aaSeq: string,
  secondary: SecondaryElement[],
): FoldStats {
  let helix = 0;
  let sheet = 0;
  let loop = 0;
  for (const el of secondary) {
    const len = el.end - el.start + 1;
    if (el.type === "helix") helix += len;
    else if (el.type === "sheet") sheet += len;
    else loop += len;
  }
  const L = Math.max(1, aaSeq.length);
  const counts = {
    hydrophobic: 0,
    polar: 0,
    positive: 0,
    negative: 0,
    special: 0,
    cysteine: 0,
    proline: 0,
    glycine: 0,
    aromatic: 0,
    histidine: 0,
    serine: 0,
  };
  for (const ch of aaSeq) {
    const def = AMINO_ACIDS[ch];
    if (!def) continue;
    counts[def.property]++;
    if (ch === "C") counts.cysteine++;
    if (ch === "P") counts.proline++;
    if (ch === "G") counts.glycine++;
    if (ch === "F" || ch === "W" || ch === "Y") counts.aromatic++;
    if (ch === "H") counts.histidine++;
    if (ch === "S") counts.serine++;
  }

  // Gly-X-Y: G every 3rd residue
  let glyXYHits = 0;
  let glyXYSlots = 0;
  for (let i = 0; i + 2 < aaSeq.length; i += 3) {
    glyXYSlots++;
    if (aaSeq[i] === "G") glyXYHits++;
  }

  // Coiled-coil: hydrophobic at heptad a/d (positions 0,3 in 7)
  const hydroSet = new Set(["A", "L", "I", "V", "M", "F"]);
  let ccHits = 0;
  let ccSlots = 0;
  for (let i = 0; i < aaSeq.length; i++) {
    const pos = i % 7;
    if (pos === 0 || pos === 3) {
      ccSlots++;
      if (hydroSet.has(aaSeq[i]!)) ccHits++;
    }
  }

  // Cys spacing pairs (i, i+2..i+5)
  let cysPairs = 0;
  const cysIdx: number[] = [];
  for (let i = 0; i < aaSeq.length; i++) if (aaSeq[i] === "C") cysIdx.push(i);
  for (let a = 0; a < cysIdx.length; a++) {
    for (let b = a + 1; b < cysIdx.length; b++) {
      const d = cysIdx[b]! - cysIdx[a]!;
      if (d >= 2 && d <= 5) cysPairs++;
      if (d > 12) break;
    }
  }

  // Longest hydrophobic window (TM proxy)
  let maxTm = 0;
  let run = 0;
  for (const ch of aaSeq) {
    if (hydroSet.has(ch) || ch === "W" || ch === "Y") {
      run++;
      maxTm = Math.max(maxTm, run);
    } else run = 0;
  }

  // Poly-basic
  let maxBasic = 0;
  run = 0;
  for (const ch of aaSeq) {
    if (ch === "K" || ch === "R") {
      run++;
      maxBasic = Math.max(maxBasic, run);
    } else run = 0;
  }

  const hasS = aaSeq.includes("S");
  const hasH = aaSeq.includes("H");
  const hasD = aaSeq.includes("D") || aaSeq.includes("E");
  const catalyticTriad = hasS && hasH && hasD ? 1 : hasH && hasD ? 0.45 : 0;

  // FG / GP disorder density
  let fg = 0;
  for (let i = 0; i < aaSeq.length - 1; i++) {
    if (
      (aaSeq[i] === "F" && aaSeq[i + 1] === "G") ||
      (aaSeq[i] === "G" && aaSeq[i + 1] === "P") ||
      (aaSeq[i] === "G" && aaSeq[i + 1] === "G")
    )
      fg++;
  }

  // Walker-like G....GK
  let walker = 0;
  for (let i = 0; i < aaSeq.length - 5; i++) {
    if (aaSeq[i] === "G" && aaSeq[i + 4] === "G" && aaSeq[i + 5] === "K")
      walker++;
    if (aaSeq[i] === "G" && aaSeq.slice(i, i + 6).includes("GK")) walker += 0.3;
  }

  const rgd = /RGD/.test(aaSeq) ? 1 : /RG[DES]/.test(aaSeq) ? 0.5 : 0;

  // Leu-rich LxxLxL style
  let leuRich = 0;
  for (let i = 0; i < aaSeq.length - 5; i++) {
    if (
      aaSeq[i] === "L" &&
      aaSeq[i + 3] === "L" &&
      (aaSeq[i + 5] === "L" || aaSeq[i + 6] === "L")
    )
      leuRich++;
  }

  // Amphipathic: in helix windows, polar vs hydro split
  let amph = 0;
  for (const el of secondary) {
    if (el.type !== "helix" || el.sequence.length < 7) continue;
    let h = 0;
    let p = 0;
    for (let i = 0; i < el.sequence.length; i++) {
      const ch = el.sequence[i]!;
      if (hydroSet.has(ch)) h++;
      if ("KRDEQNST".includes(ch)) p++;
    }
    if (h > 0 && p > 0 && Math.abs(h - p) < el.sequence.length * 0.45) amph++;
  }

  return {
    helixFraction: helix / L,
    sheetFraction: sheet / L,
    loopFraction: loop / L,
    hydrophobic: counts.hydrophobic / L,
    polar: counts.polar / L,
    positive: counts.positive / L,
    negative: counts.negative / L,
    special: counts.special / L,
    length: aaSeq.length,
    cysteine: counts.cysteine / L,
    proline: counts.proline / L,
    glycine: counts.glycine / L,
    aromatic: counts.aromatic / L,
    histidine: counts.histidine / L,
    serine: counts.serine / L,
    glyXY: glyXYSlots ? glyXYHits / glyXYSlots : 0,
    coiledCoil: ccSlots ? ccHits / ccSlots : 0,
    cysPairs: Math.min(1, cysPairs / 2),
    tmWindow: Math.min(1, maxTm / 12),
    polyBasic: Math.min(1, maxBasic / 5),
    catalyticTriad,
    fgDisorder: Math.min(1, fg / Math.max(2, L / 8)),
    walkerLike: Math.min(1, walker),
    rgd: rgd,
    leuRich: Math.min(1, leuRich / 2),
    amphipathic: Math.min(1, amph / 2),
  };
}

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

/**
 * Build secondary structure + known assemblies from an amino-acid sequence.
 * Educational fold → structure map (not PDB prediction).
 */
export function buildStructuresFromAa(aaSeq: string): {
  secondary: SecondaryElement[];
  stats: FoldStats;
  structures: BioStructure[];
} {
  const secondary = predictSecondary(aaSeq);
  const stats = foldStats(aaSeq, secondary);
  const structures = assignKnownStructures(stats, aaSeq);
  return { secondary, stats, structures };
}

type StructCandidate = Omit<BioStructure, "score"> & { raw: number };

function S(
  partial: Omit<StructCandidate, "raw"> & { raw: number },
): StructCandidate {
  return partial;
}

/**
 * Assign known biological structures from sequence chemistry + motifs.
 * Scores are teaching weights, not crystallographic predictions.
 */
export function assignKnownStructures(
  stats: FoldStats,
  _aaSeq: string,
): BioStructure[] {
  const charged = stats.positive + stats.negative;
  const mix =
    1 -
    Math.abs(stats.helixFraction - 0.4) -
    Math.abs(stats.sheetFraction - 0.3);

  const candidates: StructCandidate[] = [
    // ── Folds ──────────────────────────────────────
    S({
      id: "lipid-bilayer",
      name: "Lipid bilayer membrane",
      realWorld: "Plasma membrane, ER, mitochondria, vesicles",
      description:
        "Hydrophobic TM stretches embed in phospholipid bilayers — the universal cell boundary.",
      secondarySupport: "TM helices or β-barrels",
      aaSupport: "Leu/Ile/Val/Phe/Met windows",
      level: "membrane-machine",
      complexity: 2,
      raw:
        stats.hydrophobic * 1.2 +
        stats.tmWindow * 1.4 +
        stats.helixFraction * 0.4 -
        charged * 0.25,
    }),
    S({
      id: "alpha-helix-bundle",
      name: "α-helix bundle domain",
      realWorld: "Myoglobin core, four-helix bundles, many enzymes",
      description: "Bundled α-helices pack a hydrophobic core — classic globular fold.",
      secondarySupport: "High α-helix",
      aaSupport: "Ala, Leu, Glu, Met",
      level: "fold",
      complexity: 1,
      raw: stats.helixFraction * 1.8 + stats.hydrophobic * 0.45 + stats.amphipathic * 0.3,
    }),
    S({
      id: "coiled-coil",
      name: "Coiled-coil oligomer",
      realWorld: "Myosin tails, keratin, SNARE zippers, transcription factors",
      description:
        "Heptad hydrophobic a/d positions twist two+ helices into a cable — oligomerisation scaffold.",
      secondarySupport: "Long α-helices",
      aaSupport: "Leu/Ile/Val at heptad a/d",
      level: "fold",
      complexity: 2,
      raw:
        stats.coiledCoil * 1.8 +
        stats.helixFraction * 1.0 +
        stats.hydrophobic * 0.3,
    }),
    S({
      id: "beta-barrel",
      name: "β-barrel pore",
      realWorld: "Porins, OmpA, mitochondrial VDAC",
      description: "β-strands form a barrel channel through membranes.",
      secondarySupport: "High β-sheet",
      aaSupport: "Val, Ile, Tyr, aromatics",
      level: "fold",
      complexity: 2,
      raw:
        stats.sheetFraction * 1.6 +
        stats.hydrophobic * 0.4 +
        stats.aromatic * 0.4 +
        stats.tmWindow * 0.3,
    }),
    S({
      id: "beta-sheet-stack",
      name: "β-sheet stack",
      realWorld: "β-propellers, rigid scaffolds",
      description: "Stacked β-sheets create rigid structural domains.",
      secondarySupport: "Extended β runs",
      aaSupport: "Val, Ile, Thr, Tyr",
      level: "fold",
      complexity: 1,
      raw: stats.sheetFraction * 1.5 + stats.polar * 0.2,
    }),
    S({
      id: "immunoglobulin-fold",
      name: "Immunoglobulin (Ig) fold",
      realWorld: "Antibodies, T-cell receptors, cell-adhesion Ig domains",
      description:
        "Greek-key β-sandwich — adaptive immune recognition and cell–cell adhesion.",
      secondarySupport: "β-sandwich",
      aaSupport: "Cys bridges, conserved Trp/Tyr",
      level: "fold",
      complexity: 3,
      raw:
        stats.sheetFraction * 1.2 +
        stats.cysPairs * 1.4 +
        stats.aromatic * 0.45 +
        stats.loopFraction * 0.25 -
        (stats.cysPairs < 0.3 ? 0.75 : 0) -
        stats.helixFraction * 0.35,
    }),
    S({
      id: "tim-barrel",
      name: "TIM barrel (α/β)₈",
      realWorld: "Triose phosphate isomerase, many metabolic enzymes",
      description:
        "Eight α/β repeats form a barrel with an active-site mouth — most common enzyme fold.",
      secondarySupport: "Alternating helix/sheet",
      aaSupport: "Mixed secondary, catalytic loops",
      level: "fold",
      complexity: 3,
      raw:
        mix * 1.2 +
        stats.helixFraction * 0.6 +
        stats.sheetFraction * 0.6 +
        stats.catalyticTriad * 0.5 +
        stats.loopFraction * 0.3,
    }),
    S({
      id: "leucine-rich-repeat",
      name: "Leucine-rich repeat (LRR)",
      realWorld: "Toll-like receptors, ribonuclease inhibitors",
      description: "LxxLxL arcs stack into a horseshoe — pathogen/pattern recognition.",
      secondarySupport: "Short β + loops",
      aaSupport: "Leu-rich repeats",
      level: "domain",
      complexity: 3,
      raw:
        stats.leuRich * 2.0 +
        stats.hydrophobic * 0.4 +
        stats.sheetFraction * 0.4 +
        stats.loopFraction * 0.3,
    }),
    S({
      id: "zinc-finger",
      name: "Zinc-finger domain",
      realWorld: "Classical C₂H₂ transcription factors",
      description: "Cys/His coordinate Zn²⁺; a recognition helix reads DNA base pairs.",
      secondarySupport: "Mini ββα fold",
      aaSupport: "Cys pairs + His",
      level: "domain",
      complexity: 3,
      raw:
        stats.cysPairs * 1.5 +
        stats.histidine * 1.2 +
        stats.positive * 0.5 +
        stats.helixFraction * 0.4,
    }),
    S({
      id: "helix-turn-helix",
      name: "Helix-turn-helix (HTH)",
      realWorld: "Lac repressor, homeodomains, Hox proteins",
      description: "Two helices with a turn — second helix lies in the DNA major groove.",
      secondarySupport: "Helix–loop–helix",
      aaSupport: "Arg/Lys + helix formers",
      level: "domain",
      complexity: 2,
      raw:
        stats.helixFraction * 1.0 +
        stats.polyBasic * 1.2 +
        stats.positive * 0.8 +
        stats.loopFraction * 0.3,
    }),
    S({
      id: "kinase-domain",
      name: "Protein kinase domain",
      realWorld: "Ser/Thr and Tyr kinases, signalling cascades",
      description: "ATP-binding lobe phosphorylates targets — core of cellular signalling.",
      secondarySupport: "Bilobal fold, hinge",
      aaSupport: "Walker-like + catalytic Asp",
      level: "domain",
      complexity: 4,
      raw:
        stats.walkerLike * 1.5 +
        stats.catalyticTriad * 0.6 +
        charged * 0.5 +
        stats.helixFraction * 0.4 +
        stats.sheetFraction * 0.3,
    }),
    S({
      id: "gpcr-7tm",
      name: "GPCR 7-TM scaffold",
      realWorld: "Rhodopsin, adrenaline receptors, many drug targets",
      description:
        "Seven transmembrane helices form a ligand pocket and G-protein interface.",
      secondarySupport: "Multiple TM helices",
      aaSupport: "Hydrophobic TM + aromatic lock",
      level: "membrane-machine",
      complexity: 4,
      raw:
        stats.tmWindow * 1.3 +
        stats.helixFraction * 0.9 +
        stats.hydrophobic * 0.45 +
        stats.aromatic * 0.4 +
        stats.loopFraction * 0.25 -
        (stats.tmWindow < 0.4 ? 0.7 : 0) -
        (stats.helixFraction < 0.35 ? 0.85 : 0) -
        stats.sheetFraction * 0.5 -
        stats.polyBasic * 0.4,
    }),
    S({
      id: "chaperone-fold",
      name: "Chaperone / holdase fold",
      realWorld: "Hsp70, GroEL apical domains",
      description: "Binds unfolded chains and prevents aggregation — proteostasis.",
      secondarySupport: "Mixed, mobile lids",
      aaSupport: "Hydrophobic patches + charged rims",
      level: "soluble-machine",
      complexity: 3,
      raw:
        mix * 0.8 +
        stats.hydrophobic * 0.5 +
        charged * 0.5 +
        stats.loopFraction * 0.4,
    }),
    S({
      id: "histone-fold",
      name: "Histone fold",
      realWorld: "Nucleosome core histones H2A/H2B/H3/H4",
      description: "Handshake dimers wrap DNA into nucleosomes — chromatin packaging.",
      secondarySupport: "Helix handshake",
      aaSupport: "Arg/Lys rich DNA contacts",
      level: "fold",
      complexity: 3,
      raw:
        stats.helixFraction * 1.0 +
        stats.polyBasic * 1.3 +
        stats.positive * 0.9 +
        stats.hydrophobic * 0.3,
    }),
    S({
      id: "ubiquitin-like",
      name: "Ubiquitin-like fold",
      realWorld: "Ubiquitin, SUMO — protein tagging",
      description: "β-grasp fold marks proteins for degradation or localisation.",
      secondarySupport: "β-grasp + helix",
      aaSupport: "Mixed sheet + di-Gly tail proxy",
      level: "fold",
      complexity: 2,
      raw:
        stats.sheetFraction * 1.0 +
        stats.helixFraction * 0.5 +
        stats.glycine * 0.6 +
        stats.loopFraction * 0.3,
    }),
    // ── Filaments ──────────────────────────────────
    S({
      id: "actin-filament",
      name: "Actin-like filament",
      realWorld: "Microfilaments, cell cortex, crawling",
      description: "Globular subunits polymerise into filaments for shape and force.",
      secondarySupport: "Mixed helix/sheet subunits",
      aaSupport: "Polymer interfaces",
      level: "filament",
      complexity: 3,
      raw: mix * 1.1 + stats.hydrophobic * 0.4 + stats.walkerLike * 0.4,
    }),
    S({
      id: "microtubule",
      name: "Microtubule polymer",
      realWorld: "Mitotic spindle, axonal highways",
      description: "Tubulin dimers form hollow tubes — tracks for kinesin/dynein.",
      secondarySupport: "Helix-rich globular",
      aaSupport: "Hydrophobic core, charged surface, GTPase-like",
      level: "filament",
      complexity: 3,
      raw:
        stats.helixFraction * 0.7 +
        charged * 0.55 +
        stats.hydrophobic * 0.35 +
        stats.walkerLike * 0.9 +
        mix * 0.4 -
        stats.coiledCoil * 0.35,
    }),
    S({
      id: "intermediate-filament",
      name: "Intermediate filament",
      realWorld: "Keratin, vimentin, nuclear lamins",
      description: "Coiled-coil rods assemble into tough ropes — mechanical integrity.",
      secondarySupport: "Long coiled-coils",
      aaSupport: "Heptad Leu/Ile + Cys links",
      level: "filament",
      complexity: 3,
      raw:
        stats.coiledCoil * 1.5 +
        stats.helixFraction * 0.8 +
        stats.cysteine * 0.5 +
        stats.hydrophobic * 0.3,
    }),
    S({
      id: "collagen-triple-helix",
      name: "Collagen triple helix",
      realWorld: "Tendons, bone matrix, ECM",
      description: "Gly-X-Y repeats form triple helices — high tensile strength.",
      secondarySupport: "Polyproline-II (not α)",
      aaSupport: "Gly + Pro rich",
      level: "filament",
      complexity: 3,
      raw:
        stats.glyXY * 2.0 +
        stats.glycine * 1.2 +
        stats.proline * 1.4 -
        stats.helixFraction * 0.4,
    }),
    S({
      id: "amyloid-fibre",
      name: "Amyloid / cross-β fibre",
      realWorld: "Functional amyloids, pathological plaques",
      description: "In-register β-sheets stack into insoluble fibres.",
      secondarySupport: "Continuous β",
      aaSupport: "Gln/Asn/hydrophobic stacks",
      level: "filament",
      complexity: 2,
      raw:
        stats.sheetFraction * 1.6 +
        stats.hydrophobic * 0.4 +
        stats.polar * 0.3 -
        stats.helixFraction * 0.3,
    }),
    // ── Membrane machines ──────────────────────────
    S({
      id: "ion-channel",
      name: "Ion channel / pore",
      realWorld: "Na⁺/K⁺ channels, aquaporins, nAChR",
      description: "TM fold with polar pore moves ions/water selectively.",
      secondarySupport: "TM + filter loops",
      aaSupport: "Hydrophobic exterior, polar pore",
      level: "membrane-machine",
      complexity: 4,
      raw:
        stats.tmWindow * 0.9 +
        stats.helixFraction * 0.7 +
        (stats.polar + charged) * 0.55 +
        stats.hydrophobic * 0.35,
    }),
    S({
      id: "receptor-domain",
      name: "Receptor / ligand domain",
      realWorld: "RTKs, cytokine receptors, ligand pockets",
      description: "Binds signals and changes conformation for transduction.",
      secondarySupport: "Loops + helices",
      aaSupport: "Polar/charged surface",
      level: "domain",
      complexity: 3,
      raw:
        stats.loopFraction * 0.9 +
        stats.polar * 0.7 +
        stats.helixFraction * 0.4 +
        charged * 0.4 +
        stats.rgd * 0.3,
    }),
    S({
      id: "motor-protein",
      name: "Motor protein domain",
      realWorld: "Myosin, kinesin, dynein",
      description: "ATP cycles walk on filaments — motility and trafficking.",
      secondarySupport: "Nucleotide fold + lever",
      aaSupport: "Walker + charged/hydrophobic",
      level: "soluble-machine",
      complexity: 4,
      raw:
        stats.walkerLike * 1.2 +
        stats.helixFraction * 0.8 +
        charged * 0.55 +
        stats.hydrophobic * 0.35,
    }),
    S({
      id: "atp-synthase",
      name: "ATP synthase rotor motif",
      realWorld: "F₀F₁ ATP synthase",
      description:
        "Rotary motor couples proton flow to ATP synthesis — cellular energy currency.",
      secondarySupport: "Helix rings + globular head",
      aaSupport: "Walker motifs, charged residues",
      level: "membrane-machine",
      complexity: 5,
      raw:
        stats.walkerLike * 1.6 +
        stats.helixFraction * 0.7 +
        charged * 0.5 +
        stats.tmWindow * 0.4 +
        stats.hydrophobic * 0.3,
    }),
    S({
      id: "cytochrome",
      name: "Cytochrome / redox centre",
      realWorld: "Cytochrome c, complex III/IV",
      description: "Heme-binding folds move electrons in respiration chains.",
      secondarySupport: "Helix or sheet pocket",
      aaSupport: "His/Met heme ligands, aromatics",
      level: "membrane-machine",
      complexity: 4,
      raw:
        stats.histidine * 1.3 +
        stats.aromatic * 0.7 +
        stats.helixFraction * 0.6 +
        stats.hydrophobic * 0.4,
    }),
    S({
      id: "photosystem",
      name: "Photosystem antenna",
      realWorld: "PSI / PSII light-harvesting complexes",
      description: "Membrane pigments capture photons and drive electron transport.",
      secondarySupport: "Many TM helices",
      aaSupport: "Hydrophobic + aromatic (W/F/Y) pigment sites",
      level: "membrane-machine",
      complexity: 5,
      raw:
        stats.aromatic * 1.8 +
        stats.tmWindow * 0.65 +
        stats.hydrophobic * 0.45 +
        stats.helixFraction * 0.4 +
        stats.histidine * 0.5 -
        (stats.aromatic < 0.2 ? 1.0 : 0) -
        (stats.sheetFraction > 0.7 ? 0.5 : 0),
    }),
    S({
      id: "opsin-photoreceptor",
      name: "Opsin / photoreceptor",
      realWorld: "Rhodopsin, bacteriorhodopsin, vision",
      description: "7-TM fold holds retinal — converts light into a conformational signal.",
      secondarySupport: "7-TM helix bundle",
      aaSupport: "Lys for retinal Schiff base, aromatics",
      level: "membrane-machine",
      complexity: 4,
      raw:
        stats.tmWindow * 1.2 +
        stats.helixFraction * 0.85 +
        stats.aromatic * 0.95 +
        stats.hydrophobic * 0.4 +
        stats.positive * 0.25 -
        (stats.tmWindow < 0.35 ? 0.6 : 0) -
        (stats.helixFraction < 0.3 ? 0.8 : 0) -
        stats.sheetFraction * 0.45,
    }),
    S({
      id: "vesicle-coat",
      name: "Vesicle coat assembly",
      realWorld: "Clathrin, COPI/II coats",
      description: "Cage proteins curve membranes into transport vesicles.",
      secondarySupport: "β-propeller / α-solenoid",
      aaSupport: "Hydrophobic legs, polar hubs",
      level: "membrane-machine",
      complexity: 4,
      raw:
        stats.sheetFraction * 0.7 +
        stats.helixFraction * 0.5 +
        stats.hydrophobic * 0.4 +
        stats.loopFraction * 0.4 +
        mix * 0.4,
    }),
    S({
      id: "gap-junction",
      name: "Gap junction channel",
      realWorld: "Connexins — cell–cell pores",
      description: "Hexameric pores couple cytoplasm of adjacent cells.",
      secondarySupport: "TM helices + extracellular loops",
      aaSupport: "Cys in loops, hydrophobic TM",
      level: "membrane-machine",
      complexity: 4,
      raw:
        stats.tmWindow * 0.9 +
        stats.cysPairs * 0.8 +
        stats.helixFraction * 0.5 +
        stats.polar * 0.3,
    }),
    S({
      id: "tight-junction",
      name: "Tight-junction strand",
      realWorld: "Claudins, occludin — epithelial seals",
      description: "Seals paracellular space — barrier tissues and polarity.",
      secondarySupport: "TM + adhesive loops",
      aaSupport: "Cys, hydrophobic TM",
      level: "membrane-machine",
      complexity: 3,
      raw:
        stats.tmWindow * 0.8 +
        stats.cysPairs * 0.6 +
        stats.hydrophobic * 0.5 +
        stats.sheetFraction * 0.3,
    }),
    // ── Soluble machines ───────────────────────────
    S({
      id: "hemoglobin-fold",
      name: "Globin (O₂-binding) fold",
      realWorld: "Hemoglobin, myoglobin, neuroglobin",
      description: "α-helical pocket holds heme — O₂ transport/storage.",
      secondarySupport: "High α-helix",
      aaSupport: "His ligands, hydrophobic pocket",
      level: "soluble-machine",
      complexity: 3,
      raw:
        stats.helixFraction * 1.5 +
        stats.hydrophobic * 0.45 +
        stats.histidine * 1.1,
    }),
    S({
      id: "enzyme-pocket",
      name: "Enzyme active-site fold",
      realWorld: "Metabolic enzymes, hydrolases",
      description: "Catalytic residues in a pocket accelerate chemistry.",
      secondarySupport: "Mixed + concave loops",
      aaSupport: "Polar/charged catalytic set",
      level: "soluble-machine",
      complexity: 2,
      raw:
        stats.loopFraction * 0.65 +
        (stats.polar + charged) * 0.75 +
        stats.helixFraction * 0.25 +
        stats.sheetFraction * 0.25 +
        stats.catalyticTriad * 0.4,
    }),
    S({
      id: "catalytic-triad",
      name: "Catalytic triad protease",
      realWorld: "Serine proteases (trypsin, chymotrypsin)",
      description: "Ser-His-Asp charge relay cleaves peptide bonds — digestion/signalling.",
      secondarySupport: "β-barrel or two-domain",
      aaSupport: "Ser + His + Asp/Glu",
      level: "soluble-machine",
      complexity: 3,
      raw:
        stats.catalyticTriad * 2.0 +
        stats.serine * 0.6 +
        stats.histidine * 0.5 +
        stats.sheetFraction * 0.4,
    }),
    S({
      id: "dna-binding",
      name: "DNA-binding domain",
      realWorld: "Transcription factors, repressors",
      description: "Positive surface + recognition helix reads DNA sequence.",
      secondarySupport: "HTH / Zn-finger style",
      aaSupport: "Arg/Lys rich",
      level: "domain",
      complexity: 3,
      raw:
        stats.positive * 1.4 +
        stats.polyBasic * 1.0 +
        stats.helixFraction * 0.7 +
        stats.loopFraction * 0.25,
    }),
    S({
      id: "ribosome-like",
      name: "RNA–protein (ribosomal) assembly",
      realWorld: "Ribosomal proteins, RNA chaperones",
      description: "Basic surfaces bind rRNA — translation machinery pieces.",
      secondarySupport: "β + loops",
      aaSupport: "Arg/Lys for phosphates",
      level: "soluble-machine",
      complexity: 4,
      raw:
        stats.positive * 1.2 +
        stats.sheetFraction * 0.65 +
        stats.loopFraction * 0.45 +
        stats.polyBasic * 0.4,
    }),
    S({
      id: "nuclear-pore",
      name: "Nuclear pore FG-nup style",
      realWorld: "Nuclear pore complex FG repeats",
      description: "Disordered FG mesh selectively gates nuclear transport.",
      secondarySupport: "High disorder",
      aaSupport: "Phe-Gly / Gly-Pro repeats",
      level: "soluble-machine",
      complexity: 4,
      raw:
        stats.fgDisorder * 1.6 +
        stats.loopFraction * 1.0 +
        stats.glycine * 0.7 +
        stats.proline * 0.4 +
        stats.polar * 0.3,
    }),
    S({
      id: "heat-shock",
      name: "Heat-shock / stress protein",
      realWorld: "Hsp60/70/90 family",
      description: "Upregulated under stress; refolds damaged proteins.",
      secondarySupport: "Mixed ATPase fold",
      aaSupport: "Walker + hydrophobic client sites",
      level: "soluble-machine",
      complexity: 3,
      raw:
        stats.walkerLike * 1.0 +
        mix * 0.7 +
        stats.hydrophobic * 0.45 +
        charged * 0.35,
    }),
    S({
      id: "toxin-domain",
      name: "Toxin / venom domain",
      realWorld: "Defensins, scorpion toxins, pore toxins",
      description: "Disulfide-rich or pore-forming folds disrupt membranes/channels.",
      secondarySupport: "Compact Cys-rich",
      aaSupport: "Cys pairs, positive charge",
      level: "soluble-machine",
      complexity: 3,
      raw:
        stats.cysPairs * 1.4 +
        stats.cysteine * 1.0 +
        stats.positive * 0.6 +
        stats.hydrophobic * 0.3,
    }),
    S({
      id: "antifreeze",
      name: "Antifreeze / ice-binding",
      realWorld: "AFPs in polar fish and insects",
      description: "Flat ice-binding faces stop ice crystal growth — freeze resistance.",
      secondarySupport: "Regular helix or β",
      aaSupport: "Thr/Ala/Gly faces",
      level: "soluble-machine",
      complexity: 2,
      raw:
        stats.polar * 0.6 +
        stats.glycine * 0.5 +
        stats.helixFraction * 0.5 +
        stats.serine * 0.4 +
        (1 - stats.hydrophobic) * 0.3,
    }),
    S({
      id: "bioluminescence",
      name: "Luciferase / light-emitting",
      realWorld: "Firefly luciferase, bacterial lux",
      description: "Oxidises luciferin to emit light — signalling and camouflage.",
      secondarySupport: "α/β hydrolase-like",
      aaSupport: "Catalytic Ser/His, hydrophobic pocket",
      level: "soluble-machine",
      complexity: 3,
      raw:
        stats.catalyticTriad * 0.9 +
        stats.hydrophobic * 0.5 +
        stats.aromatic * 0.6 +
        mix * 0.4,
    }),
    S({
      id: "nitrogenase-like",
      name: "Nitrogenase-like metal cluster",
      realWorld: "Nitrogenase FeMo cofactor proteins",
      description: "Metal-cluster folds fix N₂ — opens nitrogen nutrient niches.",
      secondarySupport: "Mixed, Cys-rich clusters",
      aaSupport: "Cys ligands, charged surface",
      level: "soluble-machine",
      complexity: 5,
      raw:
        stats.cysteine * 1.4 +
        stats.cysPairs * 0.8 +
        charged * 0.5 +
        stats.histidine * 0.4 +
        mix * 0.3,
    }),
    S({
      id: "magnetosome",
      name: "Magnetosome biomineral scaffold",
      realWorld: "Magnetotactic bacteria Mam proteins",
      description: "Templates Fe₃O₄ crystals for magnetic orientation.",
      secondarySupport: "Membrane + acidic loops",
      aaSupport: "Asp/Glu rich, TM anchors",
      level: "membrane-machine",
      complexity: 4,
      raw:
        stats.negative * 1.2 +
        stats.tmWindow * 0.7 +
        stats.polar * 0.4 +
        stats.helixFraction * 0.3,
    }),
    // ── ECM / coat ─────────────────────────────────
    S({
      id: "extracellular-coat",
      name: "Extracellular coat / cuticle",
      realWorld: "Exoskeleton, cuticle, shell matrix",
      description: "Cross-linked fibrous proteins armour the organism.",
      secondarySupport: "Fibrous, Cys links",
      aaSupport: "Cys, Gly/Pro",
      level: "ecm",
      complexity: 2,
      raw:
        stats.cysteine * 1.3 +
        stats.glycine * 0.55 +
        stats.proline * 0.55 +
        stats.hydrophobic * 0.35 +
        stats.sheetFraction * 0.35,
    }),
    S({
      id: "cadherin-adhesion",
      name: "Cadherin adhesion domain",
      realWorld: "E-cadherin, N-cadherin junctions",
      description: "Ca²⁺-dependent extracellular domains glue cells into tissues.",
      secondarySupport: "β-sandwich repeats",
      aaSupport: "Asp/Glu Ca sites, RGD-like",
      level: "ecm",
      complexity: 4,
      raw:
        stats.sheetFraction * 0.8 +
        stats.negative * 0.7 +
        stats.rgd * 1.0 +
        stats.loopFraction * 0.4,
    }),
    S({
      id: "bone-matrix",
      name: "Bone / mineral matrix protein",
      realWorld: "Osteopontin, bone sialoprotein",
      description: "Acidic phosphoproteins nucleate hydroxyapatite — skeleton building.",
      secondarySupport: "Disordered acidic",
      aaSupport: "Asp/Glu/Ser rich",
      level: "ecm",
      complexity: 3,
      raw:
        stats.negative * 1.3 +
        stats.serine * 0.7 +
        stats.loopFraction * 0.5 +
        stats.polar * 0.3,
    }),
    S({
      id: "cell-wall",
      name: "Cell-wall / cellulose-binding",
      realWorld: "Plant CBMs, bacterial wall proteins",
      description: "Binds polysaccharides — rigid walls and external scaffolds.",
      secondarySupport: "β-sandwich CBM",
      aaSupport: "Aromatic stacking on sugars",
      level: "ecm",
      complexity: 3,
      raw:
        stats.sheetFraction * 0.9 +
        stats.aromatic * 0.8 +
        stats.polar * 0.4 +
        stats.loopFraction * 0.3,
    }),
  ];

  // Absolute-ish scale so short random peptides don't look like full organelles
  const SCALE = 2.35;
  const base = candidates
    .map(({ raw, ...rest }) => ({
      ...rest,
      score: clamp(raw / SCALE, 0, 1),
    }))
    .filter((s) => s.score >= 0.36)
    .sort((a, b) => b.score - a.score || b.complexity - a.complexity)
    .slice(0, 12);

  // Promote systems only when component folds are genuinely present
  const systems = assignSupramolecularSystems(base);
  const merged = [...systems, ...base]
    .sort((a, b) => b.score - a.score || b.complexity - a.complexity)
    .slice(0, 14);

  return merged;
}

/**
 * Higher-order assemblies when component structures co-exist.
 * These are the “complex structures” students see as organelles / tissues.
 */
export function assignSupramolecularSystems(
  parts: BioStructure[],
): BioStructure[] {
  const sc = (id: BioStructureId) => parts.find((p) => p.id === id)?.score ?? 0;
  const min3 = (a: number, b: number, c: number) => Math.min(a, b, c);
  const avg = (...xs: number[]) => xs.reduce((s, x) => s + x, 0) / xs.length;

  const systems: BioStructure[] = [];

  const etc = avg(
    sc("photosystem"),
    sc("cytochrome"),
    sc("lipid-bilayer"),
    Math.max(sc("atp-synthase"), 0.3),
  );
  if (
    sc("photosystem") >= 0.45 &&
    sc("cytochrome") >= 0.38 &&
    sc("lipid-bilayer") >= 0.4
  ) {
    systems.push({
      id: "electron-transport-chain",
      name: "Electron transport chain",
      realWorld: "Mitochondrial ETC / photosynthetic ETC",
      description:
        "Membrane redox proteins + ATP synthase couple electron flow to energy storage.",
      score: clamp(etc * 1.05, 0, 1),
      secondarySupport: "Membrane + redox folds",
      aaSupport: "His/heme, aromatics, Walker",
      level: "system",
      complexity: 5,
    });
  }

  const photoApp = avg(sc("photosystem"), sc("lipid-bilayer"), sc("cytochrome"));
  if (
    sc("photosystem") >= 0.55 &&
    sc("lipid-bilayer") >= 0.42 &&
    (sc("cytochrome") >= 0.32 || sc("opsin-photoreceptor") >= 0.4)
  ) {
    systems.push({
      id: "photosynthetic-apparatus",
      name: "Photosynthetic apparatus",
      realWorld: "Chloroplast thylakoid stack",
      description:
        "Antenna + reaction centre + membrane — full light-to-chemical energy organelle.",
      score: clamp(Math.max(photoApp, sc("photosystem") * 0.95) * 1.05, 0, 1),
      secondarySupport: "TM pigment proteins",
      aaSupport: "Aromatic + hydrophobic TM",
      level: "system",
      complexity: 5,
    });
  }

  const sarc = avg(sc("actin-filament"), sc("motor-protein"), sc("coiled-coil"));
  if (sc("actin-filament") >= 0.4 && sc("motor-protein") >= 0.42) {
    systems.push({
      id: "contractile-sarcomere",
      name: "Contractile sarcomere unit",
      realWorld: "Muscle thin/thick filaments",
      description:
        "Actin tracks + myosin motors (+ coiled-coil tails) generate contractile force.",
      score: clamp(sarc * 1.1, 0, 1),
      secondarySupport: "Filaments + motors",
      aaSupport: "Walker motors, polymer actin",
      level: "system",
      complexity: 5,
    });
  }

  if (
    sc("dna-binding") >= 0.52 &&
    sc("histone-fold") >= 0.42 &&
    (sc("zinc-finger") >= 0.4 ||
      sc("helix-turn-helix") >= 0.48 ||
      sc("nuclear-pore") >= 0.4)
  ) {
    const nuc = avg(
      sc("dna-binding"),
      sc("histone-fold"),
      sc("zinc-finger"),
      sc("helix-turn-helix"),
    );
    systems.push({
      id: "nucleus-complex",
      name: "Nucleus-like information complex",
      realWorld: "Chromatin + nuclear envelope pores",
      description:
        "DNA packaging + regulation + gated transport — eukaryotic nucleus proxy.",
      score: clamp(nuc * 1.05, 0, 1),
      secondarySupport: "Histone + TF domains",
      aaSupport: "Basic DNA contacts, FG gates",
      level: "system",
      complexity: 5,
    });
  }

  const syn = avg(sc("ion-channel"), sc("receptor-domain"), sc("vesicle-coat"));
  if (sc("ion-channel") >= 0.42 && sc("receptor-domain") >= 0.4) {
    systems.push({
      id: "synapse-scaffold",
      name: "Synapse / signalling scaffold",
      realWorld: "Chemical synapse active zone",
      description:
        "Channels + receptors + vesicle machinery — rapid intercellular signalling.",
      score: clamp(syn * 1.05, 0, 1),
      secondarySupport: "Membrane machines",
      aaSupport: "TM pores, ligand loops",
      level: "system",
      complexity: 5,
    });
  }

  if (
    sc("microtubule") >= 0.48 &&
    sc("motor-protein") >= 0.4 &&
    sc("coiled-coil") >= 0.42
  ) {
    systems.push({
      id: "cilium-flagellum",
      name: "Cilium / flagellum axoneme",
      realWorld: "9+2 microtubule cilium, bacterial flagellar related",
      description:
        "Microtubule core + motors beat or rotate — swimming and sensing.",
      score: clamp(
        avg(sc("microtubule"), sc("motor-protein"), sc("coiled-coil")) * 1.05,
        0,
        1,
      ),
      secondarySupport: "MT + dynein motors",
      aaSupport: "Tubulin-like + ATPase",
      level: "system",
      complexity: 5,
    });
  }

  if (
    sc("immunoglobulin-fold") >= 0.55 ||
    (sc("leucine-rich-repeat") >= 0.55 && sc("receptor-domain") >= 0.4)
  ) {
    systems.push({
      id: "immune-recognition",
      name: "Immune recognition complex",
      realWorld: "Antibody/TCR or TLR pattern recognition",
      description:
        "Ig or LRR domains detect non-self patterns — adaptive/innate immunity proxy.",
      score: clamp(
        Math.max(
          sc("immunoglobulin-fold"),
          avg(sc("leucine-rich-repeat"), sc("receptor-domain")),
        ) * 1.05,
        0,
        1,
      ),
      secondarySupport: "Ig sandwich or LRR arc",
      aaSupport: "Cys bridges, Leu repeats",
      level: "system",
      complexity: 5,
    });
  }

  if (
    sc("dna-binding") >= 0.45 &&
    (sc("ion-channel") >= 0.4 || sc("opsin-photoreceptor") >= 0.42) &&
    sc("receptor-domain") >= 0.32
  ) {
    systems.push({
      id: "nervous-circuit",
      name: "Nervous-circuit proxy",
      realWorld: "Neuron: membrane excitability + gene programs",
      description:
        "Channels/opsins for signals + DNA-binding for long-term change — nervous system seed.",
      score: clamp(
        avg(
          sc("ion-channel"),
          sc("dna-binding"),
          sc("receptor-domain"),
          Math.max(sc("opsin-photoreceptor"), 0.25),
        ) * 1.08,
        0,
        1,
      ),
      secondarySupport: "Excitability + nuclear control",
      aaSupport: "TM pores + basic TFs",
      level: "system",
      complexity: 5,
    });
  }

  return systems.filter((s) => s.score >= 0.42);
}

/** Build named complexes list for UI from structure hits */
export function buildComplexList(structures: BioStructure[]): BioComplex[] {
  return structures
    .filter((s) => s.level === "system")
    .map((s) => ({
      id: s.id,
      name: s.name,
      realWorld: s.realWorld,
      description: s.description,
      components: [],
      score: s.score,
      complexity: s.complexity,
    }));
}

// ─── Full pipeline from DNA ──────────────────────────

export type BiologyExpression = {
  dna: string;
  rna: string;
  /** polypeptide (single-letter AA, no stops) */
  aminoAcidSequence: string;
  aminoAcidNames: string[];
  orfs: { start: number; end: number; aa: string }[];
  secondary: SecondaryElement[];
  foldStats: FoldStats;
  structures: BioStructure[];
  /** Supramolecular systems (complexity 5) */
  complexes: BioComplex[];
  /** Motif summary for teaching UI */
  motifs: string[];
  /** top structure ids for phenotype mapping */
  primaryStructures: BioStructureId[];
};

function motifLabels(stats: FoldStats): string[] {
  const m: string[] = [];
  if (stats.tmWindow >= 0.45) m.push("TM helix window");
  if (stats.coiledCoil >= 0.55) m.push("coiled-coil heptad");
  if (stats.glyXY >= 0.45) m.push("Gly-X-Y collagen");
  if (stats.cysPairs >= 0.4) m.push("Cys pairs / Zn");
  if (stats.polyBasic >= 0.4) m.push("poly-basic NLS/DNA");
  if (stats.catalyticTriad >= 0.9) m.push("Ser-His-Asp triad");
  if (stats.walkerLike >= 0.4) m.push("Walker-like ATP");
  if (stats.fgDisorder >= 0.35) m.push("FG/disorder gate");
  if (stats.rgd >= 0.5) m.push("RGD adhesion");
  if (stats.leuRich >= 0.4) m.push("Leu-rich repeat");
  if (stats.amphipathic >= 0.4) m.push("amphipathic helix");
  if (stats.aromatic >= 0.2) m.push("aromatic cluster");
  return m;
}

export function randomDnaBiology(
  length = 90,
  rng: () => number = Math.random,
): string {
  // Prefer starting with ATG for a real start codon when long enough
  const n = Math.max(15, Math.floor(length / 3) * 3);
  let s = "ATG";
  for (let i = 3; i < n - 3; i++) {
    s += DNA_BASES[Math.floor(rng() * 4)]!;
  }
  // mild chance of stop at end
  s += rng() > 0.5 ? "TAA" : DNA_BASES[Math.floor(rng() * 4)]! + DNA_BASES[Math.floor(rng() * 4)]! + DNA_BASES[Math.floor(rng() * 4)]!;
  return s.slice(0, n);
}

export function replicateDnaBio(
  dna: string,
  mutationRate: number,
  rng: () => number = Math.random,
): string {
  let out = "";
  for (const b of dna) {
    if (rng() < mutationRate) {
      const others = DNA_BASES.filter((x) => x !== b);
      out += others[Math.floor(rng() * others.length)]!;
    } else out += b;
  }
  return out;
}

export function transcribeDna(dna: string): string {
  return dna.toUpperCase().replace(/T/g, "U");
}

/** Translate RNA with standard code; supports multiple ORFs from AUG */
export function translateRna(rna: string): {
  aminoAcidSequence: string;
  aminoAcidNames: string[];
  orfs: { start: number; end: number; aa: string }[];
} {
  const orfs: { start: number; end: number; aa: string }[] = [];
  let i = 0;
  while (i < rna.length - 2) {
    if (rna.slice(i, i + 3) === "AUG") {
      let aa = "";
      let j = i;
      while (j < rna.length - 2) {
        const codon = rna.slice(j, j + 3);
        const res = GENETIC_CODE[codon] ?? "X";
        if (res === "*") {
          j += 3;
          break;
        }
        if (res !== "X") aa += res;
        j += 3;
      }
      if (aa.length > 0) {
        orfs.push({ start: i, end: j, aa });
      }
      i = j;
    } else {
      i++;
    }
  }
  // Fallback: translate all non-stop if no ORF found
  if (orfs.length === 0) {
    let aa = "";
    for (let k = 0; k + 2 < rna.length; k += 3) {
      const res = GENETIC_CODE[rna.slice(k, k + 3)] ?? "X";
      if (res !== "*" && res !== "X") aa += res;
    }
    if (aa.length) orfs.push({ start: 0, end: rna.length, aa });
  }

  const aminoAcidSequence = orfs.map((o) => o.aa).join("");
  const aminoAcidNames = [...aminoAcidSequence].map(
    (c) => AMINO_ACIDS[c]?.name ?? c,
  );
  return { aminoAcidSequence, aminoAcidNames, orfs };
}

/**
 * Full central dogma + structure assignment from DNA.
 */
export function expressBiology(dna: string): BiologyExpression {
  const clean = dna.toUpperCase().replace(/[^ATGC]/g, "A");
  const rna = transcribeDna(clean);
  const { aminoAcidSequence, aminoAcidNames, orfs } = translateRna(rna);
  const { secondary, stats, structures } =
    buildStructuresFromAa(aminoAcidSequence || "G");
  const complexes = buildComplexList(structures);

  return {
    dna: clean,
    rna,
    aminoAcidSequence,
    aminoAcidNames,
    orfs,
    secondary,
    foldStats: stats,
    structures,
    complexes,
    motifs: motifLabels(stats),
    primaryStructures: structures.slice(0, 6).map((s) => s.id),
  };
}

/**
 * Map known structures → organism traits for the ecology sim.
 * Bridges molecular biology to the existing evolution engine.
 */
export function structuresToTraits(
  structures: BioStructure[],
  stats: FoldStats,
): {
  size: number;
  speed: number;
  energyEfficiency: number;
  lightUse: number;
  oxygenNeed: number;
  armor: number;
  sensing: number;
  replicationRate: number;
  metabolism: number;
  hue: number;
  toxinResist: number;
  limbCount: number;
  symmetry: number;
  digestion: number;
  chemoUse: number;
  seasonalHardiness: number;
  predation: number;
  intelligence: number;
} {
  const has = (id: BioStructureId) =>
    structures.find((s) => s.id === id)?.score ?? 0;

  const membrane = has("lipid-bilayer");
  const actin = has("actin-filament");
  const mt = has("microtubule");
  const motor = has("motor-protein");
  const photo = Math.max(has("photosystem"), has("photosynthetic-apparatus") * 0.9);
  const globin = has("hemoglobin-fold");
  const enzyme = Math.max(has("enzyme-pocket"), has("catalytic-triad") * 0.85, has("tim-barrel") * 0.7);
  const channel = has("ion-channel");
  const receptor = Math.max(has("receptor-domain"), has("gpcr-7tm") * 0.85);
  const coat = Math.max(has("extracellular-coat"), has("cell-wall") * 0.7, has("bone-matrix") * 0.5);
  const collagen = Math.max(has("collagen-triple-helix"), has("intermediate-filament") * 0.6);
  const dnaBind = Math.max(
    has("dna-binding"),
    has("zinc-finger") * 0.9,
    has("helix-turn-helix") * 0.85,
    has("histone-fold") * 0.7,
    has("nucleus-complex") * 0.8,
  );
  const ribo = has("ribosome-like");
  const helix = Math.max(has("alpha-helix-bundle"), has("coiled-coil") * 0.7);
  const sarc = has("contractile-sarcomere");
  const cilium = has("cilium-flagellum");
  const synapse = Math.max(has("synapse-scaffold"), has("nervous-circuit") * 0.85);
  const etc = has("electron-transport-chain");
  const atp = has("atp-synthase");
  const immune = has("immune-recognition");
  const opsin = has("opsin-photoreceptor");
  const toxin = has("toxin-domain");
  const antifreeze = has("antifreeze");
  const adhesion = has("cadherin-adhesion");

  const size = clamp(
    0.4 +
      membrane * 0.15 +
      collagen * 0.45 +
      coat * 0.35 +
      helix * 0.15 +
      has("bone-matrix") * 0.35 +
      stats.length * 0.007,
    0.3,
    2.8,
  );
  const speed = clamp(
    0.1 +
      motor * 0.75 +
      actin * 0.4 +
      mt * 0.3 +
      sarc * 0.55 +
      cilium * 0.5 -
      coat * 0.2 -
      collagen * 0.12,
    0.05,
    2.4,
  );
  const lightUse = clamp(
    photo * 1.15 + opsin * 0.35 + membrane * 0.08 + etc * 0.15,
    0,
    1.5,
  );
  const oxygenNeed = clamp(
    0.25 + globin * 0.5 + enzyme * 0.15 + motor * 0.12 + etc * 0.2 + atp * 0.15 - photo * 0.18,
    0.05,
    1.8,
  );
  const armor = clamp(
    coat * 0.85 + collagen * 0.45 + membrane * 0.12 + has("tight-junction") * 0.2,
    0,
    1.5,
  );
  const sensing = clamp(
    receptor * 0.7 +
      channel * 0.35 +
      dnaBind * 0.2 +
      opsin * 0.45 +
      synapse * 0.4 +
      immune * 0.25,
    0,
    1.8,
  );
  const replicationRate = clamp(
    0.25 + ribo * 0.5 + enzyme * 0.18 + dnaBind * 0.12 + has("ubiquitin-like") * 0.1 - coat * 0.08,
    0.05,
    1.5,
  );
  const metabolism = clamp(
    0.3 + enzyme * 0.55 + motor * 0.2 + channel * 0.12 + atp * 0.45 + etc * 0.35 + has("kinase-domain") * 0.25,
    0.1,
    2,
  );
  const digestion = clamp(
    enzyme * 0.55 + has("catalytic-triad") * 0.5 + channel * 0.15,
    0,
    1.6,
  );
  const chemoUse = clamp(
    enzyme * 0.35 +
      channel * 0.25 +
      membrane * 0.15 +
      has("nitrogenase-like") * 0.5 +
      has("magnetosome") * 0.25,
    0,
    1.5,
  );
  const toxinResist = clamp(
    coat * 0.45 + enzyme * 0.25 + membrane * 0.15 + toxin * 0.35 + has("heat-shock") * 0.3,
    0,
    1.5,
  );
  const seasonalHardiness = clamp(
    0.25 + coat * 0.35 + collagen * 0.25 + membrane * 0.15 + antifreeze * 0.55 + has("heat-shock") * 0.25,
    0.1,
    1.5,
  );
  const predation = clamp(
    motor * 0.4 +
      sensing * 0.35 +
      actin * 0.06 +
      toxin * 0.35 +
      sarc * 0.25 -
      photo * 0.12,
    0,
    1.8,
  );
  const intelligence = clamp(
    dnaBind * 0.55 +
      has("nucleus-complex") * 0.4 +
      synapse * 0.35 +
      has("nervous-circuit") * 0.4 +
      receptor * 0.15 +
      ribo * 0.06 -
      photo * 0.04,
    0,
    1.6,
  );
  const limbCount = Math.min(
    8,
    Math.max(
      0,
      Math.round(motor * 3.5 + actin * 2.5 + mt * 1.5 + cilium * 2 + sarc * 1.5),
    ),
  );
  const symmetry = clamp(
    0.45 + helix * 0.18 + membrane * 0.1 + adhesion * 0.15 - stats.loopFraction * 0.08,
    0.2,
    1,
  );
  const energyEfficiency = clamp(
    0.4 + photo * 0.28 + globin * 0.15 + atp * 0.25 + etc * 0.2 + enzyme * 0.08 - metabolism * 0.07,
    0.1,
    1.4,
  );
  const hue =
    Math.round(
      (photo * 120 +
        opsin * 280 +
        coat * 30 +
        dnaBind * 200 +
        enzyme * 40 +
        has("bioluminescence") * 160) %
        360,
    ) || Math.round(stats.hydrophobic * 200 + stats.helixFraction * 80) % 360;

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

/** Starter genomes that encode recognisable biology themes (ATGC only) */
export const BIOLOGY_STARTER_GENOMES: {
  id: string;
  name: string;
  dna: string;
  blurb: string;
  expectedStructures: string[];
}[] = [
  {
    id: "minimal-orf",
    name: "Minimal ORF (ATG…)",
    dna: "ATGGCCCTGAAGGAGGTGGCCGACTAAG",
    blurb: "Short ORF — Ala/Leu/Lys/Glu helix-leaning peptide.",
    expectedStructures: ["α-helix bundle"],
  },
  {
    id: "membrane",
    name: "Membrane / TM ORF",
    dna: "ATGCTGATTGTGCTGTTCCTGGTGGCCATCTACCTGATTGTGTAAG",
    blurb: "Long hydrophobic windows — lipid bilayer / ion channel / GPCR theme.",
    expectedStructures: ["Lipid bilayer", "Ion channel", "GPCR 7-TM"],
  },
  {
    id: "photosystem",
    name: "Photosystem apparatus ORF",
    dna: "ATGTTCTGGTACCTGGCCCTGGGCCTGTTCTGGTACCTGCACCTGGCCTAAG",
    blurb: "Aromatic + TM + His — photosystem / photosynthetic apparatus.",
    expectedStructures: ["Photosystem", "Cytochrome", "Photosynthetic apparatus"],
  },
  {
    id: "motor",
    name: "Motor / sarcomere ORF",
    dna: "ATGGAGAAGCTGCGCAAGGAGCTGGTGGAGAAGGGCAAGGAGAAGTAAG",
    blurb: "Walker-ish charged helices — motor + contractile sarcomere path.",
    expectedStructures: ["Motor protein", "Actin", "Sarcomere"],
  },
  {
    id: "collagenoid",
    name: "Collagen / ECM ORF",
    dna: "ATGGGACCCGGACCCGGACCTGGTCCTGGCGGACCCGGACCCGGATAAG",
    blurb: "Gly-X-Y repeats — collagen triple helix + ECM coat.",
    expectedStructures: ["Collagen", "Bone matrix", "Coat"],
  },
  {
    id: "globin",
    name: "Globin / O₂ ORF",
    dna: "ATGGCCCTGCACGAGCTGGCCAAGCACCTGGCCCTGCACGAGTAAG",
    blurb: "Helix + His — O₂-binding globin fold.",
    expectedStructures: ["Globin fold", "α-helix bundle"],
  },
  {
    id: "tf-mind",
    name: "Nucleus / mind ORF",
    dna: "ATGAAGCGCAAGCGCAAGAAGAGCGCCAAGCGCAAGTGCGGCAAGTAAG",
    blurb: "Poly-basic + Cys — DNA-binding, zinc finger, nucleus complex.",
    expectedStructures: ["DNA-binding", "Zinc finger", "Nucleus complex"],
  },
  {
    id: "predator-motor",
    name: "Predator / toxin ORF",
    dna: "ATGGAGAAGATTATCCTGCGCGAGGTGGCCTGGTGCGGCTGCAAGTAAG",
    blurb: "Motor + Cys toxin motif — hunting morph.",
    expectedStructures: ["Motor", "Toxin domain", "Enzyme"],
  },
  {
    id: "atp-etc",
    name: "ATP synthase / ETC ORF",
    dna: "ATGGGCGTGGGCCTGAAGGAGGTGCTGCGCGGCCACAAGCTGTAAG",
    blurb: "Walker G…GK + helix + His — ATP synthase / electron transport.",
    expectedStructures: ["ATP synthase", "Cytochrome", "ETC"],
  },
  {
    id: "immune-ig",
    name: "Immune Ig-fold ORF",
    dna: "ATGGTGTGCATCTACGTGTCCGGCTACTGCGGCCAGGTGTGCTAAG",
    blurb: "β + Cys bridges + aromatic — immunoglobulin / immune recognition.",
    expectedStructures: ["Ig fold", "Immune complex", "β-sheet"],
  },
  {
    id: "synapse-nerve",
    name: "Synapse / nerve ORF",
    dna: "ATGCTGATTGTGAAGCGTCTGTTCCTGCGCGAGAACTACCTGTAAG",
    blurb: "TM + basic + polar loops — channel/receptor → synapse & nervous circuit.",
    expectedStructures: ["Ion channel", "Receptor", "Synapse", "Nervous circuit"],
  },
  {
    id: "flagella",
    name: "Cilium / flagellum ORF",
    dna: "ATGGAGCTGCTGAAGGAGCTGCTGCGTGAGCTGGTGGGCCTGTAAG",
    blurb: "Coiled-coil heptads + charge — microtubule motor cilium/flagellum.",
    expectedStructures: ["Coiled-coil", "Microtubule", "Cilium/flagellum"],
  },
  {
    id: "kinase-signal",
    name: "Kinase signalling ORF",
    dna: "ATGGGCGTGGGCCTGAAGGACAGCCTGCACTTCGAGGTGTAAG",
    blurb: "Walker + Ser/His/Asp — kinase domain & signalling cascade.",
    expectedStructures: ["Kinase", "Catalytic triad", "Enzyme"],
  },
  {
    id: "opsin-vision",
    name: "Opsin / vision ORF",
    dna: "ATGTTCCTGGCCCTGTACTGGCTGATTGTGAAGTTCGGCTAAG",
    blurb: "7-TM style hydrophobics + Lys/aromatic — photoreceptor opsin.",
    expectedStructures: ["Opsin", "GPCR 7-TM", "Lipid bilayer"],
  },
];

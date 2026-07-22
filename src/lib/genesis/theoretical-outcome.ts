/**
 * Theoretical outcome report for a Genesis creature.
 * Students finish the lab with a predicted phenotype, niche, survival scores,
 * and evolutionary forecast — assessable written science outcome.
 */

import type { GeneExpression, OrganismTraits, Protein } from "./dna";
import { fitness, type Organism } from "./simulate";
import {
  biomeFromEnv,
  deriveClimate,
  STAR_PRESETS,
  defaultWorld,
  type StarType,
  type WorldEnv,
} from "./world";

export type SurvivalBand = "extinct-likely" | "struggling" | "stable" | "thriving" | "dominant";

export type EnvScenarioScore = {
  id: string;
  name: string;
  fitness: number;
  band: SurvivalBand;
  note: string;
};

export type TheoreticalOutcome = {
  title: string;
  generatedAt: string;
  creatureName: string;
  generation: number;
  lineage: string;
  currentFitness: number;
  survivalBand: SurvivalBand;
  phenotype: string;
  ecologicalNiche: string;
  energyBudget: string;
  reproductiveStrategy: string;
  strengths: string[];
  vulnerabilities: string[];
  proteinProfile: { klass: string; strength: number; role: string }[];
  scenarioScores: EnvScenarioScore[];
  bestWorld: string;
  worstWorld: string;
  evolutionForecast: string;
  theoreticalPopulation: {
    shortTerm: string;
    mediumTerm: string;
    longTerm: string;
  };
  studentConclusion: string;
  assessmentRubric: { criterion: string; target: string }[];
  fullReportMarkdown: string;
};

const PROTEIN_ROLES: Record<string, string> = {
  STRUCT: "Body frame & size",
  MOTILE: "Locomotion / limbs",
  PHOTO: "Light energy capture",
  RESP: "Oxygen metabolism",
  SHELL: "Armour / protective shell",
  SENSE: "Environmental sensing",
  REP: "Self-replication drive",
  META: "Metabolic rate",
  PIGM: "Pigment / surface colour",
  TOX: "Toxin resistance",
  DIGEST: "Consume food patches / organics",
  CHEM: "Chemo / minerals / acid tolerance",
  PRED: "Predation / hunting",
  MIND: "Cognition / intelligence",
};

function bandFromFitness(f: number): SurvivalBand {
  if (f < 0.35) return "extinct-likely";
  if (f < 0.7) return "struggling";
  if (f < 1.2) return "stable";
  if (f < 2.0) return "thriving";
  return "dominant";
}

function bandLabel(b: SurvivalBand): string {
  switch (b) {
    case "extinct-likely":
      return "Likely extinction in this climate";
    case "struggling":
      return "Struggling — narrow survival margin";
    case "stable":
      return "Stable population possible";
    case "thriving":
      return "Thriving — strong niche fit";
    case "dominant":
      return "Theoretically dominant in this niche";
  }
}

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function proteinTotals(proteins: Protein[]) {
  const m = new Map<string, number>();
  for (const p of proteins) {
    m.set(p.klass, (m.get(p.klass) ?? 0) + p.strength);
  }
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}

function describePhenotype(
  t: OrganismTraits,
  proteins: Protein[],
  structures?: { name: string; score: number }[],
  secondarySummary?: string,
  aaSeq?: string,
): string {
  const tops = proteinTotals(proteins).slice(0, 3).map(([k]) => k);
  const sizeWord =
    t.size < 0.7 ? "compact" : t.size < 1.4 ? "medium-framed" : "large-bodied";
  const moveWord =
    t.limbCount === 0
      ? "sessile or drift-based"
      : t.limbCount <= 2
        ? `${t.limbCount}-appendage`
        : `multi-limbed (${t.limbCount})`;
  const energyWord =
    t.lightUse > 0.6
      ? "light-harvesting"
      : t.digestion > 0.5
        ? "detritivore / food-patch forager"
        : t.chemoUse > 0.5
          ? "chemo-mineral specialist"
          : t.metabolism > 1.2
            ? "high-metabolism consumer"
            : "balanced metaboliser";
  const armourWord =
    t.armor > 0.7 ? "heavily armoured" : t.armor > 0.3 ? "lightly shielded" : "soft-bodied";
  const seasonWord =
    t.seasonalHardiness > 0.7
      ? "winter-hardy"
      : t.seasonalHardiness < 0.35
        ? "season-sensitive"
        : "moderately seasonal";

  const structLine =
    structures && structures.length > 0
      ? ` Built structures: ${structures
          .slice(0, 4)
          .map((s) => `${s.name} (${Math.round(s.score * 100)}%)`)
          .join("; ")}.`
      : "";
  const foldLine = secondarySummary
    ? ` Fold (secondary): ${secondarySummary}.`
    : "";
  const aaLine =
    aaSeq && aaSeq.length > 0
      ? ` Polypeptide length ${aaSeq.length} aa (${aaSeq.slice(0, 24)}${aaSeq.length > 24 ? "…" : ""}).`
      : "";

  return `A ${sizeWord}, ${armourWord}, ${moveWord}, ${seasonWord} organism with ${energyWord} strategy.${aaLine}${foldLine}${structLine} Function tags: ${tops.join(", ") || "minimal"}. Hue ~${Math.round(t.hue)}° · digestion ${t.digestion.toFixed(2)} · chemo ${t.chemoUse.toFixed(2)}. Symmetry ${t.symmetry.toFixed(2)}.`;
}

function describeNiche(t: OrganismTraits, env: WorldEnv, tick = 0): string {
  const climate = deriveClimate(env, tick);
  const biome = biomeFromEnv(env, tick);
  const parts: string[] = [];

  if (t.lightUse > 0.5) {
    parts.push(
      `Favours high light under ${STAR_PRESETS[env.star].label} (light ${climate.lightLevel.toFixed(2)}, season ${climate.season})`,
    );
  } else if (t.digestion > 0.45) {
    parts.push("Niche tied to detritus/food patches more than pure starlight");
  } else if (t.chemoUse > 0.45) {
    parts.push("Chemo-mineral niche — minerals, organics, methane matter more than light");
  } else {
    parts.push("Less dependent on stellar flux — dimmer microhabitats possible");
  }

  if (t.oxygenNeed > 0.9) {
    parts.push(
      `High O₂ demand (${t.oxygenNeed.toFixed(2)}) vs air O₂ ${(env.atmosphere.oxygen * 100).toFixed(0)}% · AQ ${climate.airQuality.toFixed(2)}`,
    );
  } else if (t.oxygenNeed < 0.4) {
    parts.push("Low oxygen need — thinner O₂ atmospheres still viable");
  }

  if (climate.airQuality < 0.45 && t.toxinResist < 0.4) {
    parts.push("Poor air quality is a major filter without TOX/CHEM protection");
  }

  if (t.armor > 0.5 || t.toxinResist > 0.5) {
    parts.push("Protected against UV/toxin/smog relative to soft strains");
  }

  if (env.gravity > 1.4 && t.size > 1.5) {
    parts.push("Large size under high gravity is theoretically costly");
  } else if (env.gravity < 0.6) {
    parts.push("Low gravity reduces structural cost — large morphs more viable");
  }

  if (env.orbit.axialTilt > 20 && t.seasonalHardiness < 0.4) {
    parts.push("High axial tilt → harsh winters may cull this lineage without hardiness proteins");
  }

  parts.push(
    `Biome: ${biome.label} (~${climate.tempC.toFixed(0)}°C) · food productivity ${climate.foodProductivity.toFixed(2)} · nutrients N=${env.chemicals.nitrogenNutrient.toFixed(2)} P=${env.chemicals.phosphate.toFixed(2)}`,
  );
  return parts.join(". ") + ".";
}

function describeEnergy(t: OrganismTraits, env: WorldEnv, tick = 0): string {
  const climate = deriveClimate(env, tick);
  const light = t.lightUse * climate.lightLevel;
  const chemo =
    t.chemoUse *
    (env.chemicals.minerals + env.chemicals.organics + env.atmosphere.methane) *
    0.4;
  const meta = t.metabolism;
  const cost = t.size * env.gravity * 0.3 + t.speed * 0.15 + t.armor * 0.12;
  if (light > cost * 0.8) {
    return `Theoretical energy surplus driven by PHOTO (light ~${light.toFixed(2)}, season ${climate.season}, day-length ${climate.dayLengthFactor.toFixed(2)}) vs cost ~${cost.toFixed(2)}. Food-web productivity ${climate.foodProductivity.toFixed(2)} also feeds DIGEST morphs.`;
  }
  if (t.digestion > 0.5) {
    return `Heterotroph-leaning budget: DIGEST ${t.digestion.toFixed(2)} depends on food-patch energy and organics (${env.chemicals.organics.toFixed(2)}). Winter photo-patch collapse hurts PHOTO more than detritivores.`;
  }
  if (chemo > 0.3 || (meta > 1.0 && light < 0.3)) {
    return `Chemo/metabolic pathways matter more than light (chemo proxy ~${chemo.toFixed(2)}). Dim stars or smog (AQ ${climate.airQuality.toFixed(2)}) favour CHEM/DIGEST over pure PHOTO.`;
  }
  return `Energy budget is tight. Shifts in season, air quality, food regrowth, toxin or gravity can flip stable ↔ struggling.`;
}

function describeReproduction(t: OrganismTraits): string {
  if (t.replicationRate > 1.0) {
    return `r-strategist tendency: high REP expression predicts frequent self-replication when energy > threshold. Populations can boom, then crash if resources or climate worsen.`;
  }
  if (t.replicationRate < 0.4) {
    return `K-leaning: slow replication, invests in structure/armour. Theoretical outcome is fewer offspring but longer individual survival if the niche is stable.`;
  }
  return `Balanced replication. Theoretical steady state depends on death rate from temperature, toxin and starvation in the current world.`;
}

function strengthsVulnerabilities(
  t: OrganismTraits,
  env: WorldEnv,
  f: number,
): { strengths: string[]; vulnerabilities: string[] } {
  const strengths: string[] = [];
  const vulnerabilities: string[] = [];
  const climate = deriveClimate(env);

  if (t.lightUse > 0.5) strengths.push("Strong light-harvesting (PHOTO) for energy independence");
  if (t.digestion > 0.45) strengths.push("DIGEST proteins exploit food patches / organics");
  if (t.chemoUse > 0.45) strengths.push("CHEM tolerance for minerals, methane and acidity");
  if (t.armor > 0.5) strengths.push("Armour reduces UV/toxin/smog damage");
  if (t.toxinResist > 0.5) strengths.push("Toxin resistance expands poor-air viability");
  if (t.seasonalHardiness > 0.65) strengths.push("Seasonal hardiness buffers winter culls");
  if (t.speed > 0.8) strengths.push("High motility aids foraging food patches");
  if (t.replicationRate > 0.8) strengths.push("Fast self-replication under energy surplus");
  if (t.sensing > 0.5) strengths.push("Sensing improves food-patch tracking");
  if (f > 1.3) strengths.push("High current fitness in the active environment");

  if (t.size > 1.8 && env.gravity > 1.3)
    vulnerabilities.push("Large body + high gravity → high maintenance cost");
  if (t.oxygenNeed > 1.0 && env.atmosphere.oxygen < 0.15)
    vulnerabilities.push("Oxygen demand exceeds thin atmosphere supply");
  if (t.lightUse < 0.2 && climate.lightLevel < 0.5 && t.digestion < 0.3)
    vulnerabilities.push("Weak PHOTO and weak DIGEST on a dim/low-food world");
  if (t.armor < 0.2 && STAR_PRESETS[env.star].uv > 0.9)
    vulnerabilities.push("Soft body under high UV star stress");
  if (t.toxinResist < 0.2 && env.atmosphere.toxin > 0.3)
    vulnerabilities.push("Low TOX resistance in toxic air");
  if (climate.airQuality < 0.4 && t.toxinResist < 0.35)
    vulnerabilities.push("Poor air quality without resistance proteins");
  if (env.orbit.axialTilt > 25 && t.seasonalHardiness < 0.35)
    vulnerabilities.push("High-tilt winters threaten season-sensitive morphs");
  if (t.replicationRate < 0.3 && f < 0.8)
    vulnerabilities.push("Slow replication while stressed — recovery after losses is weak");
  if (strengths.length === 0) strengths.push("No outstanding specialisation — generalist profile");
  if (vulnerabilities.length === 0)
    vulnerabilities.push("No critical mismatch detected in current world — re-test other climates");

  return { strengths, vulnerabilities };
}

function buildScenarios(
  traits: OrganismTraits,
  base: WorldEnv,
  tick = 0,
): EnvScenarioScore[] {
  const scenarios: { id: string; name: string; env: WorldEnv; note: string }[] = [
    {
      id: "current",
      name: "Current lab world",
      env: base,
      note: "Fitness under parameters + season at this tick.",
    },
    {
      id: "earthlike",
      name: "Earth-like control",
      env: defaultWorld(),
      note: "1g, yellow star, clean air baseline.",
    },
    {
      id: "high-g",
      name: "Heavy world (2.2g)",
      env: { ...base, gravity: 2.2, name: "Heavy" },
      note: "Structural cost rises with size × gravity.",
    },
    {
      id: "low-light",
      name: "Red-dwarf dim light",
      env: { ...base, star: "red-dwarf" as StarType, name: "Dim" },
      note: "PHOTO vs DIGEST/CHEM becomes decisive.",
    },
    {
      id: "blue-uv",
      name: "Blue giant UV stress",
      env: { ...base, star: "blue-giant" as StarType, name: "UV" },
      note: "Armour and resistance matter.",
    },
    {
      id: "toxic",
      name: "Toxic / poor air",
      env: {
        ...base,
        atmosphere: {
          ...base.atmosphere,
          toxin: 0.55,
          oxygen: 0.12,
          particulates: 0.5,
          methane: 0.15,
        },
        name: "Toxic",
      },
      note: "Air quality crash — TOX/CHEM help.",
    },
    {
      id: "anoxic",
      name: "Low oxygen",
      env: {
        ...base,
        atmosphere: { ...base.atmosphere, oxygen: 0.06 },
        name: "Anoxic",
      },
      note: "High RESP/O₂-need morphs collapse.",
    },
    {
      id: "barren-food",
      name: "Barren food web",
      env: {
        ...base,
        foodWeb: {
          ...base.foodWeb,
          primaryProductivity: 0.15,
          regrowth: 0.01,
        },
        chemicals: {
          ...base.chemicals,
          organics: 0.1,
          nitrogenNutrient: 0.15,
        },
        name: "Barren",
      },
      note: "Low patches — DIGEST less useful; PHOTO/CHEM compete.",
    },
    {
      id: "high-tilt",
      name: "High-tilt seasons",
      env: {
        ...base,
        orbit: { ...base.orbit, axialTilt: 42, yearLengthTicks: 80 },
        name: "Tilt",
      },
      note: "Harsh winters — seasonal hardiness critical.",
    },
    {
      id: "greenhouse",
      name: "High CO₂ greenhouse",
      env: {
        ...base,
        atmosphere: { ...base.atmosphere, co2: 0.18, pressure: 1.4, humidity: 0.7 },
        name: "Greenhouse",
      },
      note: "PHOTO + CO₂ + humidity can boost productivity.",
    },
  ];

  return scenarios.map((s) => {
    const f = fitness(traits, s.env, tick);
    return {
      id: s.id,
      name: s.name,
      fitness: Math.round(f * 100) / 100,
      band: bandFromFitness(f),
      note: s.note,
    };
  });
}

function forecast(
  t: OrganismTraits,
  f: number,
  band: SurvivalBand,
  maxGen: number,
): TheoreticalOutcome["theoreticalPopulation"] {
  if (band === "extinct-likely") {
    return {
      shortTerm: "Population expected to shrink within tens of ticks; local extinction likely.",
      mediumTerm: "Lineage persists only if mutation invents better PHOTO/TOX/size trade-offs.",
      longTerm: "Theoretical outcome: extinction in this world without parameter change or gene rescue.",
    };
  }
  if (band === "struggling") {
    return {
      shortTerm: "Small population may flicker; births ≈ deaths.",
      mediumTerm: "Selection pressure high — survivors likely shift toward better-matching proteins.",
      longTerm: "Either specialises into a marginal niche or goes extinct; diversity may drop.",
    };
  }
  if (band === "stable") {
    return {
      shortTerm: `Stable headcount plausible; generation ladder can climb (already gen ${maxGen} in sim if running).`,
      mediumTerm: "Drift + mild selection; morph stays similar unless climate shifts.",
      longTerm: "Persistent background species — not necessarily dominant.",
    };
  }
  if (band === "thriving") {
    return {
      shortTerm: "Energy surplus → frequent self-replication; population growth expected.",
      mediumTerm: "May outcompete softer strains; protein profile can fix in the gene pool.",
      longTerm: "Theoretically common morph on this world class; still fragile if star/air changes.",
    };
  }
  return {
    shortTerm: "Boom phase: rapid replication while energy and space allow.",
    mediumTerm: "Density limits appear; still the fitness leader among tested strains.",
    longTerm: `Theoretical apex competitor for this niche until environment or a superior mutant appears. REP=${t.replicationRate.toFixed(2)}, fitness≈${f.toFixed(2)}.`,
  };
}

function evolutionForecastText(
  t: OrganismTraits,
  scenarios: EnvScenarioScore[],
): string {
  const best = [...scenarios].sort((a, b) => b.fitness - a.fitness)[0]!;
  const worst = [...scenarios].sort((a, b) => a.fitness - b.fitness)[0]!;
  const photo = t.lightUse;
  const mutPressure =
    photo > 0.6
      ? "Further mutations that increase PHOTO or CO₂ use should be favoured under bright stars."
      : t.armor > 0.5
        ? "Shell-linked mutations may lock in under UV/toxin worlds, trading speed for survival."
        : "Generalist mutations (balanced META/RESP) are the most likely path if climates keep changing.";

  return `Across test climates, best theoretical fit is “${best.name}” (fitness ${best.fitness}). Worst is “${worst.name}” (fitness ${worst.fitness}). ${mutPressure} Expect lineage branching if mutation rate rises with UV/toxin; fixations occur when one protein class consistently raises fitness.`;
}

/**
 * Build the full theoretical outcome a student can submit / study from.
 */
export function buildTheoreticalOutcome(
  org: Organism,
  env: WorldEnv,
  opts?: { simTick?: number; maxGeneration?: number },
): TheoreticalOutcome {
  const tick = opts?.simTick ?? 0;
  const expr = org.expression;
  const t = expr.traits;
  const f = fitness(t, env, tick);
  const band = bandFromFitness(f);
  const totals = proteinTotals(expr.proteins);
  const { strengths, vulnerabilities } = strengthsVulnerabilities(t, env, f);
  const scenarios = buildScenarios(t, env, tick);
  const best = [...scenarios].sort((a, b) => b.fitness - a.fitness)[0]!;
  const worst = [...scenarios].sort((a, b) => a.fitness - b.fitness)[0]!;
  const pop = forecast(t, f, band, opts?.maxGeneration ?? org.generation);

  const proteinProfile = totals.map(([klass, strength]) => ({
    klass,
    strength,
    role: PROTEIN_ROLES[klass] ?? "Functional class",
  }));

  const creatureName = `Creature ${org.lineage} · gen ${org.generation}`;
  const phenotype = describePhenotype(
    t,
    expr.proteins,
    expr.structures,
    expr.secondarySummary,
    expr.aminoAcidSequence,
  );
  const ecologicalNiche = describeNiche(t, env, tick);
  const energyBudget = describeEnergy(t, env, tick);
  const reproductiveStrategy = describeReproduction(t);
  const evolutionForecast = evolutionForecastText(t, scenarios);

  const studentConclusion = [
    `In the current world, this creature is classified as: ${bandLabel(band)} (fitness ${f.toFixed(2)}).`,
    `Theoretically it is best adapted to: ${best.name}.`,
    `It is most at risk under: ${worst.name}.`,
    `Primary strengths: ${strengths.slice(0, 2).join("; ")}.`,
    `Primary vulnerabilities: ${vulnerabilities.slice(0, 2).join("; ")}.`,
    pop.longTerm,
  ].join(" ");

  const assessmentRubric = [
    {
      criterion: "Phenotype from genotype",
      target:
        "Link DNA → amino acids → secondary structure → known assemblies (e.g. photosystem, motor) to body traits.",
    },
    {
      criterion: "Environment interaction",
      target: "Explain gravity, star, O₂/CO₂/toxin effects on fitness.",
    },
    {
      criterion: "Energy & reproduction theory",
      target: "Describe energy budget and r/K-style replication outcome.",
    },
    {
      criterion: "Scenario comparison",
      target: "Compare at least 3 climates using fitness bands.",
    },
    {
      criterion: "Forecast",
      target: "State short/medium/long-term population theory with reasons.",
    },
  ];

  const title = `Theoretical outcome — ${creatureName}`;
  const generatedAt = new Date().toISOString();

  const fullReportMarkdown = [
    `# ${title}`,
    ``,
    `Generated: ${generatedAt}`,
    `Simulation tick: ${opts?.simTick ?? "—"} · Lineage ${org.lineage}`,
    ``,
    `## 1. Survival classification`,
    `- **Current fitness:** ${f.toFixed(2)}`,
    `- **Band:** ${bandLabel(band)}`,
    `- **World:** ${env.name} · ${STAR_PRESETS[env.star].label} · ${env.gravity}g · O₂ ${(env.atmosphere.oxygen * 100).toFixed(0)}% · toxin ${(env.atmosphere.toxin * 100).toFixed(0)}%`,
    ``,
    `## 2. Theoretical phenotype`,
    phenotype,
    ``,
    `## 2b. Molecular build (central dogma)`,
    `- **DNA:** \`${expr.dna}\``,
    `- **RNA:** \`${expr.rna}\``,
    `- **Amino acids:** \`${expr.aminoAcidSequence || "—"}\` (${expr.aminoAcidSequence.length} residues)`,
    `- **Secondary structure:** ${expr.secondarySummary || "—"}`,
    `- **Motifs:** ${expr.motifs.length ? expr.motifs.join("; ") : "—"}`,
    ...(expr.complexes.length > 0
      ? [
          `- **Supramolecular systems:**`,
          ...expr.complexes.map(
            (c) =>
              `  - **${c.name}** (${Math.round(c.score * 100)}%, complexity ${c.complexity}) — ${c.realWorld}. ${c.description}`,
          ),
        ]
      : []),
    ...(expr.structures.length > 0
      ? [
          `- **Known structures assigned:**`,
          ...expr.structures.map(
            (s) =>
              `  - **${s.name}** [C${s.complexity} · ${s.level}] (${Math.round(s.score * 100)}%) — ${s.realWorld}. ${s.description}`,
          ),
        ]
      : [`- **Known structures:** none strongly assigned`]),
    ``,
    `## 3. Ecological niche (theory)`,
    ecologicalNiche,
    ``,
    `## 4. Energy budget (theory)`,
    energyBudget,
    ``,
    `## 5. Reproductive strategy (theory)`,
    reproductiveStrategy,
    ``,
    `## 6. Function tags (from structures)`,
    ...proteinProfile.map(
      (p) => `- **${p.klass}** (strength ${p.strength}) — ${p.role}`,
    ),
    ``,
    `## 7. Strengths`,
    ...strengths.map((s) => `- ${s}`),
    ``,
    `## 8. Vulnerabilities`,
    ...vulnerabilities.map((s) => `- ${s}`),
    ``,
    `## 9. Multi-world fitness (theoretical)`,
    ...scenarios.map(
      (s) =>
        `- **${s.name}:** fitness ${s.fitness} · ${bandLabel(s.band)} — ${s.note}`,
    ),
    ``,
    `Best world: **${best.name}** · Worst world: **${worst.name}**`,
    ``,
    `## 10. Population forecast`,
    `- **Short term:** ${pop.shortTerm}`,
    `- **Medium term:** ${pop.mediumTerm}`,
    `- **Long term:** ${pop.longTerm}`,
    ``,
    `## 11. Evolution forecast`,
    evolutionForecast,
    ``,
    `## 12. Student conclusion`,
    studentConclusion,
    ``,
    `## 13. Assessment rubric (use this to mark your understanding)`,
    ...assessmentRubric.map((r) => `- **${r.criterion}:** ${r.target}`),
    ``,
    `---`,
    `*Genesis Lab educational model — theoretical outcome from simplified DNA→protein→selection rules.*`,
  ].join("\n");

  return {
    title,
    generatedAt,
    creatureName,
    generation: org.generation,
    lineage: org.lineage,
    currentFitness: Math.round(f * 100) / 100,
    survivalBand: band,
    phenotype,
    ecologicalNiche,
    energyBudget,
    reproductiveStrategy,
    strengths,
    vulnerabilities,
    proteinProfile,
    scenarioScores: scenarios,
    bestWorld: best.name,
    worstWorld: worst.name,
    evolutionForecast,
    theoreticalPopulation: pop,
    studentConclusion,
    assessmentRubric,
    fullReportMarkdown,
  };
}

export { bandLabel };

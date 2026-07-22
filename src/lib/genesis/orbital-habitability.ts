/**
 * Educational stellar / planetary habitability calculator.
 * Simplified school model (not full astrophysics) — teaches:
 *  - optimal orbital distance (habitable zone) for a star type
 *  - year length vs distance (Kepler-style)
 *  - day length / spin trade-offs
 *  - planet size from surface gravity
 *  - how sim year-length & tilt map to real orbit ideas
 */

import type { StarType, WorldEnv } from "./world";
import { STAR_PRESETS, deriveClimate } from "./world";

/** Solar luminosities L/L☉ (teaching values) */
export const STAR_PHYSICS: Record<
  StarType,
  {
    label: string;
    luminosity: number; // L/Lsun
    mass: number; // M/Msun
    tempK: number;
    lifetimeGyr: number;
    color: string;
    kidBlurb: string;
    scienceBlurb: string;
  }
> = {
  "red-dwarf": {
    label: "Red dwarf (M-type)",
    luminosity: 0.04,
    mass: 0.3,
    tempK: 3200,
    lifetimeGyr: 100,
    color: "#ff6b4a",
    kidBlurb: "Small, cool, dim, lives a very long time.",
    scienceBlurb:
      "Low luminosity → habitable zone is close in. Planets may be tidally locked (one face always day).",
  },
  yellow: {
    label: "Yellow dwarf (G-type, Sol-like)",
    luminosity: 1.0,
    mass: 1.0,
    tempK: 5800,
    lifetimeGyr: 10,
    color: "#ffd666",
    kidBlurb: "Like our Sun — balanced light and heat.",
    scienceBlurb:
      "Earth sits near 1 AU where liquid water is stable. Our teaching baseline for “optimal”.",
  },
  "blue-giant": {
    label: "Blue giant (hot, bright)",
    luminosity: 25,
    mass: 8,
    tempK: 20000,
    lifetimeGyr: 0.03,
    color: "#7ec8ff",
    kidBlurb: "Huge, hot, very bright — short life, harsh UV.",
    scienceBlurb:
      "High L pushes the habitable zone far out. Strong UV stresses life; stars die young on cosmic scales.",
  },
  "white-dwarf": {
    label: "White dwarf (remnant)",
    luminosity: 0.01,
    mass: 0.6,
    tempK: 8000,
    lifetimeGyr: 5,
    color: "#e8f0ff",
    kidBlurb: "Faint leftover core of a dead star.",
    scienceBlurb:
      "Very dim → habitable zone is tiny and close. Light is scarce for photosynthesis.",
  },
};

export type HabitabilityLesson = {
  star: StarType;
  starLabel: string;
  /** Inner / outer habitable zone in AU (Earth–Sun units) */
  hzInnerAu: number;
  hzOuterAu: number;
  hzCenterAu: number;
  /** Student-chosen “mission orbit” suggestion */
  optimalAu: number;
  /** Orbital period (Earth years) at optimalAu — Kepler a^3 / M */
  yearAtOptimalEarthYears: number;
  /** Map sim yearLengthTicks → suggested real year length scaling */
  simYearTicks: number;
  suggestedSimYearTicks: number;
  /** Surface gravity g/g⊕ */
  gravityG: number;
  /** Planet radius R/R⊕ if density ≈ Earth */
  planetRadiusEarths: number;
  /** Planet mass M/M⊕ if density ≈ Earth */
  planetMassEarths: number;
  /** Escape velocity hint km/s (Earth ≈ 11.2) */
  escapeVelocityKms: number;
  /** Axial tilt lesson */
  axialTiltDeg: number;
  tiltLesson: string;
  /** Day length teaching (hours) — simplified from gravity/size */
  suggestedDayHours: number;
  dayLesson: string;
  /** Flux at optimal orbit relative to Earth (1 = Earth) */
  fluxAtOptimal: number;
  /** Flux at “current sim settings” proxy using star energy + eccentricity */
  fluxSimProxy: number;
  /** Temperature estimate °C at optimal (very rough) */
  tempOptimalC: number;
  tempSimC: number;
  habitabilityScore: number; // 0–100
  habitabilityBand: string;
  steps: { title: string; body: string }[];
  warnings: string[];
  essayPrompts: string[];
  summaryKid: string;
  summaryScience: string;
};

/** Classic Kopparapu-style rough HZ: r ∝ √L (AU) */
export function habitableZoneAu(luminosity: number): {
  inner: number;
  outer: number;
  center: number;
} {
  const L = Math.max(0.001, luminosity);
  // Approximate Earth limits scaled by sqrt(L)
  const inner = 0.95 * Math.sqrt(L);
  const outer = 1.67 * Math.sqrt(L);
  return { inner, outer, center: (inner + outer) / 2 };
}

/** Kepler’s 3rd law: P² ∝ a³ / M  → P years = sqrt(a³ / M) for solar units */
export function orbitalPeriodYears(aAu: number, massSolar: number): number {
  const M = Math.max(0.05, massSolar);
  const a = Math.max(0.01, aAu);
  return Math.sqrt((a * a * a) / M);
}

/** If density ≈ Earth: g ∝ M/R² and M ∝ R³ → g ∝ R → R ≈ g, M ≈ g³ */
export function planetSizeFromGravity(gravityG: number): {
  radiusEarths: number;
  massEarths: number;
  escapeKms: number;
} {
  const g = Math.max(0.1, gravityG);
  // R/R⊕ ≈ g/g⊕ for constant density
  const radiusEarths = g;
  const massEarths = g * g * g;
  // v_esc = sqrt(2GM/R) ∝ sqrt(M/R) → Earth 11.2 * sqrt(M/R)
  const escapeKms = 11.2 * Math.sqrt(massEarths / radiusEarths);
  return { radiusEarths, massEarths, escapeKms };
}

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

/**
 * Full teaching pack for current world star/gravity/orbit choices.
 */
export function buildHabitabilityLesson(
  env: WorldEnv,
  tick = 0,
): HabitabilityLesson {
  const star = env.star;
  const phys = STAR_PHYSICS[star];
  const preset = STAR_PRESETS[star];
  const hz = habitableZoneAu(phys.luminosity);
  // Earth-equivalent distance a ⊕ √L (classic teaching target inside the HZ)
  const optimalAu = Math.sqrt(Math.max(0.001, phys.luminosity));
  const yearOpt = orbitalPeriodYears(optimalAu, phys.mass);
  const size = planetSizeFromGravity(env.gravity);
  const climate = deriveClimate(env, tick);

  // Flux relative to Earth: F/F⊕ = L / a²
  const fluxAtOptimal = phys.luminosity / (optimalAu * optimalAu);
  // Sim proxy: star energy * orbital light mod * seasonal (rough)
  const fluxSimProxy =
    phys.luminosity *
    (0.7 + preset.energy * 0.3) *
    (1 + env.orbit.eccentricity * 0.5);

  // Blackbody-ish temp teaching: Earth ~15°C at F=1; T scales weakly with F
  const tempOptimalC = 15 + 20 * Math.log2(Math.max(0.05, fluxAtOptimal));
  const tempSimC = climate.tempC;

  // Suggested sim year length: longer real years → more ticks
  // Baseline yellow 1 yr → 200 ticks
  const suggestedSimYearTicks = Math.round(
    clamp(200 * yearOpt, 60, 500),
  );

  // Day length: larger/faster-spin worlds — teaching heuristic
  // Higher g (bigger planet) often slower spin historically → longer day
  const suggestedDayHours = clamp(12 + env.gravity * 10, 8, 48);
  const dayLesson =
    env.gravity > 1.4
      ? "Heavier (larger) planets often spin down over time → longer days, bigger day/night temperature swings."
      : env.gravity < 0.6
        ? "Low-gravity worlds may keep faster spin → shorter days, milder day/night contrast (simplified)."
        : "Earth-like gravity supports a moderate day length (~24 h). Spin is independent of orbit, but both shape climate.";

  const tilt = env.orbit.axialTilt;
  const tiltLesson =
    tilt < 8
      ? "Low tilt → weak seasons. Poles and equator stay more extreme for longer."
      : tilt > 28
        ? "High tilt → strong seasons. Summers scorch, winters freeze — hard for settlers without technology."
        : "Moderate tilt (~23°) gives familiar seasons: good for farming calendars.";

  // Habitability score: distance of sim climate from comfortable + UV + g
  let score = 100;
  score -= Math.abs(tempSimC - 18) * 1.2;
  score -= Math.abs(env.gravity - 1) * 18;
  score -= preset.uv * 12;
  score -= env.orbit.eccentricity * 40;
  score -= Math.abs(tilt - 23) * 0.6;
  // Star lifetime penalty for giants
  if (phys.lifetimeGyr < 1) score -= 15;
  if (phys.luminosity < 0.05) score -= 8;
  score = clamp(Math.round(score), 0, 100);

  const habitabilityBand =
    score >= 80
      ? "excellent"
      : score >= 65
        ? "good"
        : score >= 45
          ? "challenging"
          : score >= 25
            ? "harsh"
            : "extreme";

  const steps: HabitabilityLesson["steps"] = [
    {
      title: "1 · Know your star’s brightness (L)",
      body: `${phys.label} has luminosity ≈ ${phys.luminosity}× the Sun and mass ≈ ${phys.mass} M☉. Brighter stars push the liquid-water zone outward.`,
    },
    {
      title: "2 · Habitable zone distance (AU)",
      body: `Rule of thumb: distance scales with √L. For this star, liquid water is roughly between ${hz.inner.toFixed(2)}–${hz.outer.toFixed(2)} AU. Optimal teaching target ≈ ${optimalAu.toFixed(2)} AU (middle of the zone).`,
    },
    {
      title: "3 · Year length from orbit (Kepler)",
      body: `Period P (Earth years) ≈ √(a³ / M★). At ${optimalAu.toFixed(2)} AU around this star, one year ≈ ${yearOpt.toFixed(2)} Earth years. Longer years → longer seasons if tilt is high.`,
    },
    {
      title: "4 · Map year to the sim",
      body: `Your sim “year length” is ${env.orbit.yearLengthTicks} ticks. For this star’s optimal orbit we’d suggest about ${suggestedSimYearTicks} ticks/year so seasons feel right. Eccentricity ${env.orbit.eccentricity.toFixed(2)} makes light swing through the year.`,
    },
    {
      title: "5 · Planet size from gravity",
      body: `If density is Earth-like: radius ≈ ${size.radiusEarths.toFixed(2)} R⊕ and mass ≈ ${size.massEarths.toFixed(2)} M⊕ when gravity is ${env.gravity.toFixed(2)} g. Escape velocity ≈ ${size.escapeKms.toFixed(1)} km/s (Earth ~11.2). High g → costly bodies & buildings.`,
    },
    {
      title: "6 · Day length & tilt",
      body: `Suggested day ~${suggestedDayHours.toFixed(0)} h (teaching estimate). Axial tilt ${tilt}°. ${tiltLesson} ${dayLesson}`,
    },
    {
      title: "7 · Check heat & light in the sim",
      body: `Sim climate now ~${tempSimC.toFixed(0)}°C with light ${climate.lightLevel.toFixed(2)}. At optimal AU, flux ≈ ${fluxAtOptimal.toFixed(2)}× Earth and rough temp ~${tempOptimalC.toFixed(0)}°C. Compare: is your world too hot, cold, or just right?`,
    },
  ];

  const warnings: string[] = [];
  if (phys.lifetimeGyr < 1)
    warnings.push(
      "This star type is short-lived — a civilisation might not have billions of years to evolve.",
    );
  if (preset.uv > 0.9)
    warnings.push("High UV: DNA damage risk; favour armour, water, night activity.");
  if (optimalAu < 0.2)
    warnings.push(
      "Habitable zone is very close — tidal locking and stellar flares are real science concerns for red dwarfs.",
    );
  if (env.gravity > 1.6)
    warnings.push("High gravity: larger planet, hard on bones/structure, costly flight.");
  if (env.gravity < 0.4)
    warnings.push("Low gravity: thin air retention risk over long times (atmosphere escape).");
  if (env.orbit.eccentricity > 0.15)
    warnings.push("High eccentricity: big seasonal heat swings even with mild tilt.");
  if (Math.abs(tempSimC - 18) > 25)
    warnings.push(
      "Sim temperature is far from Earth comfort — adjust star, greenhouse gases, or accept specialist life only.",
    );

  const essayPrompts = [
    `For a ${phys.label}, calculate the habitable zone and justify an orbital distance.`,
    `Using g = ${env.gravity.toFixed(2)}, estimate planet radius and mass (constant density model) and discuss settlement difficulty.`,
    `Explain how year length and axial tilt together control seasons for farmers on this world.`,
    `Is this star a good long-term home? Use lifetime, UV and luminosity in your argument.`,
  ];

  const summaryKid = `For a ${phys.kidBlurb.toLowerCase()} the “Goldilocks” distance is about ${optimalAu.toFixed(2)} times Earth–Sun. One year there lasts ~${yearOpt.toFixed(1)} Earth years. With gravity ${env.gravity.toFixed(2)} g the planet is roughly ${size.radiusEarths.toFixed(1)}× Earth’s width. Habitability score: ${score}/100 (${habitabilityBand}).`;

  const summaryScience = `${phys.scienceBlurb} HZ ${hz.inner.toFixed(2)}–${hz.outer.toFixed(2)} AU; P(${optimalAu.toFixed(2)} AU)=${yearOpt.toFixed(2)} yr; R≈${size.radiusEarths.toFixed(2)} R⊕; score ${score}.`;

  return {
    star,
    starLabel: phys.label,
    hzInnerAu: hz.inner,
    hzOuterAu: hz.outer,
    hzCenterAu: hz.center,
    optimalAu,
    yearAtOptimalEarthYears: yearOpt,
    simYearTicks: env.orbit.yearLengthTicks,
    suggestedSimYearTicks,
    gravityG: env.gravity,
    planetRadiusEarths: size.radiusEarths,
    planetMassEarths: size.massEarths,
    escapeVelocityKms: size.escapeKms,
    axialTiltDeg: tilt,
    tiltLesson,
    suggestedDayHours,
    dayLesson,
    fluxAtOptimal,
    fluxSimProxy,
    tempOptimalC,
    tempSimC,
    habitabilityScore: score,
    habitabilityBand,
    steps,
    warnings,
    essayPrompts,
    summaryKid,
    summaryScience,
  };
}

/** Apply “optimal orbit package” suggestions onto a WorldEnv (student button) */
export function applyOptimalOrbitPackage(env: WorldEnv): WorldEnv {
  const lesson = buildHabitabilityLesson(env, 0);
  return {
    ...env,
    orbit: {
      ...env.orbit,
      yearLengthTicks: lesson.suggestedSimYearTicks,
      // keep mild eccentricity for teaching
      eccentricity: Math.min(env.orbit.eccentricity, 0.06),
      axialTilt: clamp(env.orbit.axialTilt, 15, 28),
    },
    // nudge gravity toward 1 if extreme
    gravity: clamp(env.gravity, 0.7, 1.3),
  };
}

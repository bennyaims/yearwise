"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { YearLevel } from "@/lib/types";
import { STARTER_STRAINS, type Protein } from "@/lib/genesis/dna";
import {
  applyEnvLive,
  injectFauna,
  injectFlora,
  introduceHumanity,
  seedWorld,
  stepSimulation,
  type SimState,
} from "@/lib/genesis/simulate";
import { behaviourLabel } from "@/lib/genesis/society";
import type { FaunaBlueprint, FloraBlueprint } from "@/lib/genesis/creator";
import {
  defaultJourney,
  edenWorldForSchool,
  loadJourney,
  saveJourney,
  type HumanityEntry,
  type SchoolJourneyState,
} from "@/lib/genesis/school-journey";
import {
  airQualityLabel,
  biomeFromEnv,
  deriveClimate,
  harshWorld,
  seasonLabel,
  STAR_PRESETS,
  type SeasonName,
  type StarType,
  type WorldEnv,
} from "@/lib/genesis/world";
import { deriveWeather } from "@/lib/genesis/weather";
import {
  consumePendingInjects,
  loadEconomy,
  type ShopItem,
} from "@/lib/game-economy";
import type { FaunaTemplateId } from "@/lib/genesis/creator";
import type { LifeRole } from "@/lib/genesis/dna";
import { CreatureCreator } from "./CreatureCreator";
import { GenesisWorld3D } from "./GenesisWorld3D";
import { PlanetSciencePanel } from "./PlanetSciencePanel";
import { SchoolJourneyPanel } from "./SchoolJourneyPanel";
import { ScienceTechPanel } from "./ScienceTechPanel";
import { TheoreticalOutcomePanel } from "./TheoreticalOutcomePanel";

/** Map coin-shop purchases into flora/fauna/character injects */
function applyShopItemsToSim(
  sim: SimState,
  items: ShopItem[],
  schoolYear: YearLevel,
): { sim: SimState; notes: string[] } {
  let next = sim;
  const notes: string[] = [];

  for (const item of items) {
    const fx = item.genesisEffect;
    if (fx.kind === "flora") {
      next = injectFlora(next, {
        name: item.name,
        kind: fx.floraKind,
        count: fx.count,
        height: 1,
        health: 1,
        sex: "random",
        scatter: 0.7,
        nearWater: fx.floraKind === "kelp" || fx.floraKind === "moss",
      });
      notes.push(`${item.icon} ${item.name} (+${fx.count} plants)`);
    } else if (fx.kind === "fauna") {
      const template = (fx.template as FaunaTemplateId) || "herbivore";
      next = injectFauna(next, {
        name: item.name,
        template,
        sex: "random",
        count: fx.count,
        energyBoost: 1.2,
        culture: 0.1,
        forceRole: fx.forceRole as LifeRole | undefined,
        scatter: 0.65,
      });
      notes.push(`${item.icon} ${item.name} (+${fx.count} animals)`);
    } else if (fx.kind === "human-char") {
      // Y11+ true humans; younger years get named sapient explorers
      const useHuman = schoolYear >= 11;
      next = injectFauna(next, {
        name: fx.name,
        template: useHuman ? "human" : "sapient",
        sex: "random",
        count: fx.count,
        energyBoost: 1.5,
        culture: 0.55,
        forceRole: useHuman ? "human" : "intelligent",
        scatter: 0.35,
      });
      notes.push(`${item.icon} Character: ${fx.name}`);
    } else if (fx.kind === "resource") {
      const civ = next.civilization;
      const foodBoost = fx.food ?? 0;
      next = {
        ...next,
        civilization: {
          ...civ,
          forestTimber: civ.forestTimber + (fx.timber ?? 0),
        },
        foodPatches: next.foodPatches.map((p, i) =>
          i < 4 && foodBoost > 0
            ? { ...p, energy: Math.min(40, p.energy + foodBoost / 4) }
            : p,
        ),
        log: [
          `Shop resource drop: timber +${fx.timber ?? 0}, food boost +${foodBoost}`,
          ...next.log,
        ].slice(0, 40),
      };
      notes.push(`${item.icon} Resources added`);
    } else if (fx.kind === "unlock") {
      notes.push(`${item.icon} Unlock queued: ${fx.unlockId}`);
      next = {
        ...next,
        log: [`Shop unlock: ${fx.unlockId}`, ...next.log].slice(0, 40),
      };
    }
  }

  return { sim: next, notes };
}

function Range({
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (n: number) => void;
}) {
  return (
    <label className="mt-2.5 block text-xs text-soft">
      {label} ({display})
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 w-full"
      />
    </label>
  );
}

/** Phototroph strain — fits plant-rich Eden teaching */
const DEFAULT_STRAIN =
  STARTER_STRAINS.find((s) => s.id === "photosystem") ?? STARTER_STRAINS[0]!;

function seedEdenForYear(year: YearLevel, seed?: number) {
  const env = {
    ...edenWorldForSchool(year),
    seed: seed ?? Math.floor(Math.random() * 1e6),
  };
  const allowMind = year >= 10;
  const allowHumans = false; // humans only via journey pathway
  const sim = seedWorld(env, DEFAULT_STRAIN.dna, 20, {
    allowHumans,
    allowMind,
    maxDiversity: true,
  });
  return { env, sim };
}

export function GenesisLab() {
  const [journey, setJourney] = useState<SchoolJourneyState>(() =>
    defaultJourney(7),
  );
  const [strainId, setStrainId] = useState(DEFAULT_STRAIN.id);
  const [running, setRunning] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [shopNotes, setShopNotes] = useState<string[]>([]);
  const [coins, setCoins] = useState(0);

  const strain =
    STARTER_STRAINS.find((s) => s.id === strainId) ?? DEFAULT_STRAIN;

  const boot = useMemo(() => seedEdenForYear(7, 42), []);
  const [env, setEnv] = useState<WorldEnv>(() => boot.env);
  const [sim, setSim] = useState<SimState>(() => boot.sim);

  // Load saved school journey + apply pending coin-shop injects once on client
  useEffect(() => {
    const j = loadJourney();
    setJourney(j);
    setCoins(loadEconomy().coins);
    const { env: e, sim: s } = seedEdenForYear(j.schoolYear);
    setEnv(e);
    let next = s;
    // If journey already had humanity, re-introduce
    if (j.humanityEntered && j.humanityEntry !== "none") {
      next = introduceHumanity(
        next,
        j.humanityEntry as Exclude<HumanityEntry, "none">,
        6,
      );
    }
    // Game shop drops (food, animals, characters)
    const { items } = consumePendingInjects();
    if (items.length > 0) {
      const applied = applyShopItemsToSim(next, items, j.schoolYear);
      next = applied.sim;
      setShopNotes(applied.notes);
    }
    setSim(next);
  }, []);

  useEffect(() => {
    saveJourney(journey);
  }, [journey]);

  // Live climate preview from controls + sim tick for seasons
  const climate = useMemo(
    () => deriveClimate(env, sim.stats.tick),
    [env, sim.stats.tick],
  );
  const biome = useMemo(
    () => biomeFromEnv(env, sim.stats.tick),
    [env, sim.stats.tick],
  );
  const weather = useMemo(
    () => deriveWeather(env, sim.stats.tick),
    [env, sim.stats.tick],
  );

  /** Live: every slider updates 3D + ecology without full reseed */
  const setEnvLive = useCallback((updater: (w: WorldEnv) => WorldEnv) => {
    setEnv((prev) => {
      const next = updater(prev);
      setSim((s) => applyEnvLive({ ...s, env: next }, next));
      return next;
    });
  }, []);

  const reseed = useCallback(() => {
    const { env: e, sim: s } = seedEdenForYear(journey.schoolYear);
    setEnv(e);
    let next = s;
    if (journey.humanityEntered && journey.humanityEntry !== "none") {
      next = introduceHumanity(
        next,
        journey.humanityEntry as Exclude<HumanityEntry, "none">,
        6,
      );
    }
    setSim(next);
    setSelectedId(null);
    setRunning(true);
  }, [journey.schoolYear, journey.humanityEntered, journey.humanityEntry]);

  const hardRestart = useCallback(() => {
    reseed();
  }, [reseed]);

  const addFauna = useCallback(
    (bp: FaunaBlueprint) => {
      // Gate human template until Y11
      if (bp.template === "human" && journey.schoolYear < 11) {
        setJourney((j) => ({
          ...j,
          intentionNote:
            j.intentionNote ||
            "(Tip: human template unlocks in Year 11 — keep exploring Eden!)",
        }));
        return;
      }
      setSim((s) => injectFauna(s, bp));
      if (bp.template === "human") {
        setJourney((j) => ({
          ...j,
          humanityEntered: true,
          humanityEntry:
            j.humanityEntry === "none" ? "students-seed" : j.humanityEntry,
        }));
      }
    },
    [journey.schoolYear],
  );

  const addFlora = useCallback((bp: FloraBlueprint) => {
    setSim((s) => injectFlora(s, bp));
  }, []);

  const loadEden = useCallback(() => {
    setStrainId(DEFAULT_STRAIN.id);
    const { env: e, sim: s } = seedEdenForYear(journey.schoolYear);
    setEnv(e);
    setSim(s);
    setJourney((j) => ({
      ...j,
      humanityEntered: false,
      humanityEntry: "none",
    }));
    setSelectedId(null);
    setRunning(true);
  }, [journey.schoolYear]);

  const loadHarsh = useCallback(() => {
    const next = { ...harshWorld(), seed: Math.floor(Math.random() * 1e6) };
    setEnv(next);
    setSim(
      seedWorld(next, strain.dna, 12, {
        allowHumans: journey.schoolYear >= 11 && journey.humanityEntered,
        allowMind: journey.schoolYear >= 10,
        maxDiversity: true,
      }),
    );
    setSelectedId(null);
    setRunning(true);
  }, [strain.dna, journey.schoolYear, journey.humanityEntered]);

  const onReseedEden = useCallback((year: YearLevel) => {
    const { env: e, sim: s } = seedEdenForYear(year);
    setEnv(e);
    setSim(s);
    setSelectedId(null);
    setRunning(true);
  }, []);

  const onIntroduceHumanity = useCallback(
    (entry: Exclude<HumanityEntry, "none">) => {
      setSim((s) => introduceHumanity(s, entry, 6));
      setRunning(true);
    },
    [],
  );

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setSim((s) => {
        let cur = s;
        for (let i = 0; i < speed; i++) cur = stepSimulation(cur);
        return cur;
      });
      setJourney((j) => ({
        ...j,
        ticksObserved: j.ticksObserved + speed,
      }));
    }, 120);
    return () => clearInterval(id);
  }, [running, speed]);

  // Keep sim.env in sync for climate when only orbit advances — step already uses env from state
  // When user moves sliders without apply, preview uses `env`; sim uses `sim.env` until apply.

  const selected =
    sim.organisms.find((o) => o.id === selectedId) ?? sim.organisms[0];
  const selectedExpr = selected?.expression;

  function proteinSummary(proteins: Protein[]) {
    const m = new Map<string, number>();
    for (const p of proteins)
      m.set(p.klass, (m.get(p.klass) ?? 0) + p.strength);
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }

  const aq = climate.airQuality;
  const yearPct = (climate.yearPhase * 100).toFixed(0);

  return (
    <div className="space-y-5">
      <header className="glass-strong rounded-[var(--radius-xl)] p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
          Genesis Lab · habitation science · Years 7–12
        </p>
        <h1 className="heading-display mt-2 text-2xl sm:text-3xl">
          An Earth-like world — learn it, then plan to live there
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-muted sm:text-base">
          Educational biology mission: study climate, water, chemistry,{" "}
          <strong className="text-ink">diverse flora &amp; fauna</strong>, DNA
          and food webs step by step.{" "}
          <strong className="text-ink">There is no wrong way</strong> — every
          experiment is evidence. Finish with a{" "}
          <strong className="text-ink">final essay</strong> advising how (or
          whether) humans should inhabit this world.
        </p>
        <p className="mt-3 text-sm text-soft">
          🪙 {coins} coins · Shop drops apply here after you buy food, animals or
          characters in{" "}
          <a href="/game/shop" className="text-accent underline">
            Game shop
          </a>
          .
        </p>
      </header>

      {shopNotes.length > 0 && (
        <div className="callout callout-tip">
          <p className="font-semibold text-ink">
            Game shop applied to this world
          </p>
          <ul className="mt-2 list-inside list-disc text-sm text-muted">
            {shopNotes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="btn btn-sky text-xs"
          onClick={() => {
            const { items } = consumePendingInjects();
            setCoins(loadEconomy().coins);
            if (items.length === 0) {
              setShopNotes(["No pending shop items — buy in the Game shop first."]);
              return;
            }
            setSim((s) => {
              const applied = applyShopItemsToSim(s, items, journey.schoolYear);
              setShopNotes(applied.notes);
              return applied.sim;
            });
          }}
        >
          Apply pending shop drops
        </button>
        <a href="/game" className="btn btn-ghost text-xs">
          Open Game hub
        </a>
      </div>

      <SchoolJourneyPanel
        journey={journey}
        sim={sim}
        onChange={setJourney}
        onIntroduceHumanity={onIntroduceHumanity}
        onReseedEden={onReseedEden}
      />

      <ScienceTechPanel
        sim={sim}
        onChange={setSim}
        unlocked={
          sim.stats.humanCount > 0 ||
          journey.humanityEntered ||
          journey.schoolYear >= 11
        }
      />

      <CreatureCreator onAddFauna={addFauna} onAddFlora={addFlora} />

      <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
        <div className="space-y-3">
          <GenesisWorld3D
            organisms={sim.organisms}
            env={sim.env}
            foodPatches={sim.foodPatches}
            flora={sim.flora}
            settlements={sim.settlements}
            tick={sim.stats.tick}
            running={running}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className={`btn ${running ? "btn-ghost" : "btn-primary"}`}
              onClick={() => setRunning((r) => !r)}
            >
              {running ? "Pause evolution" : "Run evolution"}
            </button>
            <button type="button" className="btn btn-sky" onClick={reseed}>
              Reseed world
            </button>
            <button type="button" className="btn btn-ghost" onClick={hardRestart}>
              Hard restart life
            </button>
            <button type="button" className="btn btn-primary" onClick={loadEden}>
              Eden Complex
            </button>
            <button type="button" className="btn btn-ghost" onClick={loadHarsh}>
              Stress world
            </button>
            <label className="flex items-center gap-2 text-sm text-muted">
              Speed
              <select
                className="rounded-lg border border-[var(--glass-border)] bg-[var(--glass)] px-2 py-1 text-ink"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
              >
                <option value={1}>1×</option>
                <option value={2}>2×</option>
                <option value={4}>4×</option>
              </select>
            </label>
            <span className="badge badge-sky">
              {seasonLabel(climate.season)} · year {yearPct}%
            </span>
            <span
              className={`badge ${aq >= 0.7 ? "badge-ok" : aq >= 0.4 ? "badge-warn" : "badge-warn"}`}
            >
              Air: {airQualityLabel(aq)}
            </span>
            <span className="badge badge-sky">
              🌤 {weather.label}
              {weather.intensity > 0.5
                ? ` · ${Math.round(weather.intensity * 100)}%`
                : ""}
            </span>
          </div>
        </div>

        <aside className="max-h-[min(80vh,900px)] space-y-3 overflow-y-auto pr-1">
          <div className="glass rounded-[var(--radius-lg)] p-4">
            <h2 className="heading-section text-base">Gravity & star</h2>
            <p className="mt-1 text-[11px] text-muted">
              Change the star or gravity — the science lab below teaches
              optimal distance, year length, planet size and seasons.
            </p>
            <Range
              label="Gravity (sets planet size)"
              value={env.gravity}
              min={0.15}
              max={2.8}
              step={0.05}
              display={`${env.gravity.toFixed(2)} g`}
              onChange={(n) => setEnvLive((w) => ({ ...w, gravity: n }))}
            />
            <label className="mt-3 block text-xs text-soft">
              Star type
              <select
                className="mt-1 w-full rounded-lg border border-[var(--glass-border)] bg-[var(--glass)] px-2 py-2 text-sm text-ink"
                value={env.star}
                onChange={(e) =>
                  setEnvLive((w) => ({
                    ...w,
                    star: e.target.value as StarType,
                  }))
                }
              >
                {(Object.keys(STAR_PRESETS) as StarType[]).map((k) => (
                  <option key={k} value={k}>
                    {STAR_PRESETS[k].label}
                  </option>
                ))}
              </select>
            </label>
            <p className="mt-1 text-xs text-muted">
              {STAR_PRESETS[env.star].blurb}
            </p>
          </div>

          <PlanetSciencePanel
            env={env}
            tick={sim.stats.tick}
            onApplyOptimal={(next) => {
              setEnvLive(() => next);
            }}
          />

          <div className="glass rounded-[var(--radius-lg)] p-4">
            <h2 className="heading-section text-base">Air quality & gases</h2>
            <Range
              label="Oxygen"
              value={env.atmosphere.oxygen}
              min={0}
              max={0.5}
              step={0.01}
              display={`${(env.atmosphere.oxygen * 100).toFixed(0)}%`}
              onChange={(n) =>
                setEnvLive((w) => ({
                  ...w,
                  atmosphere: { ...w.atmosphere, oxygen: n },
                }))
              }
            />
            <Range
              label="CO₂"
              value={env.atmosphere.co2}
              min={0}
              max={0.25}
              step={0.005}
              display={`${(env.atmosphere.co2 * 100).toFixed(1)}%`}
              onChange={(n) =>
                setEnvLive((w) => ({
                  ...w,
                  atmosphere: { ...w.atmosphere, co2: n },
                }))
              }
            />
            <Range
              label="Toxic gas"
              value={env.atmosphere.toxin}
              min={0}
              max={0.8}
              step={0.01}
              display={`${(env.atmosphere.toxin * 100).toFixed(0)}%`}
              onChange={(n) =>
                setEnvLive((w) => ({
                  ...w,
                  atmosphere: { ...w.atmosphere, toxin: n },
                }))
              }
            />
            <Range
              label="Methane / VOC"
              value={env.atmosphere.methane}
              min={0}
              max={0.4}
              step={0.01}
              display={`${(env.atmosphere.methane * 100).toFixed(0)}%`}
              onChange={(n) =>
                setEnvLive((w) => ({
                  ...w,
                  atmosphere: { ...w.atmosphere, methane: n },
                }))
              }
            />
            <Range
              label="Humidity"
              value={env.atmosphere.humidity}
              min={0}
              max={1}
              step={0.02}
              display={`${(env.atmosphere.humidity * 100).toFixed(0)}%`}
              onChange={(n) =>
                setEnvLive((w) => ({
                  ...w,
                  atmosphere: { ...w.atmosphere, humidity: n },
                }))
              }
            />
            <Range
              label="Particulates / smog"
              value={env.atmosphere.particulates}
              min={0}
              max={0.8}
              step={0.02}
              display={`${(env.atmosphere.particulates * 100).toFixed(0)}%`}
              onChange={(n) =>
                setEnvLive((w) => ({
                  ...w,
                  atmosphere: { ...w.atmosphere, particulates: n },
                }))
              }
            />
            <Range
              label="Pressure"
              value={env.atmosphere.pressure}
              min={0.3}
              max={2.5}
              step={0.05}
              display={`${env.atmosphere.pressure.toFixed(2)}×`}
              onChange={(n) =>
                setEnvLive((w) => ({
                  ...w,
                  atmosphere: { ...w.atmosphere, pressure: n },
                }))
              }
            />
            <div className="callout callout-info mt-3 text-xs">
              <strong>
                Air quality: {airQualityLabel(aq)} ({aq.toFixed(2)})
              </strong>
              <br />
              Combines toxin, dust, methane, O₂ balance & pressure.
            </div>
          </div>

          <div className="glass rounded-[var(--radius-lg)] p-4">
            <h2 className="heading-section text-base">Chemicals (soil/ocean)</h2>
            <Range
              label="Nitrogen nutrient"
              value={env.chemicals.nitrogenNutrient}
              min={0}
              max={1}
              step={0.02}
              display={env.chemicals.nitrogenNutrient.toFixed(2)}
              onChange={(n) =>
                setEnvLive((w) => ({
                  ...w,
                  chemicals: { ...w.chemicals, nitrogenNutrient: n },
                }))
              }
            />
            <Range
              label="Phosphate"
              value={env.chemicals.phosphate}
              min={0}
              max={1}
              step={0.02}
              display={env.chemicals.phosphate.toFixed(2)}
              onChange={(n) =>
                setEnvLive((w) => ({
                  ...w,
                  chemicals: { ...w.chemicals, phosphate: n },
                }))
              }
            />
            <Range
              label="Minerals"
              value={env.chemicals.minerals}
              min={0}
              max={1}
              step={0.02}
              display={env.chemicals.minerals.toFixed(2)}
              onChange={(n) =>
                setEnvLive((w) => ({
                  ...w,
                  chemicals: { ...w.chemicals, minerals: n },
                }))
              }
            />
            <Range
              label="Organics (detritus)"
              value={env.chemicals.organics}
              min={0}
              max={1}
              step={0.02}
              display={env.chemicals.organics.toFixed(2)}
              onChange={(n) =>
                setEnvLive((w) => ({
                  ...w,
                  chemicals: { ...w.chemicals, organics: n },
                }))
              }
            />
            <Range
              label="Acidity"
              value={env.chemicals.acidity}
              min={0}
              max={1}
              step={0.02}
              display={env.chemicals.acidity.toFixed(2)}
              onChange={(n) =>
                setEnvLive((w) => ({
                  ...w,
                  chemicals: { ...w.chemicals, acidity: n },
                }))
              }
            />
          </div>

          <div className="glass rounded-[var(--radius-lg)] p-4">
            <h2 className="heading-section text-base">
              Water · flora · fauna
            </h2>
            <Range
              label="Water coverage"
              value={env.surface.waterCoverage}
              min={0}
              max={0.85}
              step={0.02}
              display={`${(env.surface.waterCoverage * 100).toFixed(0)}%`}
              onChange={(n) =>
                setEnvLive((w) => ({
                  ...w,
                  surface: { ...w.surface, waterCoverage: n },
                }))
              }
            />
            <Range
              label="Flora / plant cover"
              value={env.surface.floraCoverage}
              min={0}
              max={1}
              step={0.02}
              display={`${(env.surface.floraCoverage * 100).toFixed(0)}%`}
              onChange={(n) =>
                setEnvLive((w) => ({
                  ...w,
                  surface: { ...w.surface, floraCoverage: n },
                }))
              }
            />
            <Range
              label="Canopy (trees vs moss)"
              value={env.surface.canopyRatio}
              min={0}
              max={1}
              step={0.02}
              display={`${(env.surface.canopyRatio * 100).toFixed(0)}% trees`}
              onChange={(n) =>
                setEnvLive((w) => ({
                  ...w,
                  surface: { ...w.surface, canopyRatio: n },
                }))
              }
            />
            <Range
              label="Predator pressure"
              value={env.surface.predatorPressure}
              min={0}
              max={1}
              step={0.02}
              display={env.surface.predatorPressure.toFixed(2)}
              onChange={(n) =>
                setEnvLive((w) => ({
                  ...w,
                  surface: { ...w.surface, predatorPressure: n },
                }))
              }
            />
            <Range
              label="Intelligent life seed"
              value={env.surface.intelligenceSeed}
              min={0}
              max={1}
              step={0.02}
              display={env.surface.intelligenceSeed.toFixed(2)}
              onChange={(n) =>
                setEnvLive((w) => ({
                  ...w,
                  surface: { ...w.surface, intelligenceSeed: n },
                }))
              }
            />
            <p className="mt-2 text-xs text-muted">
              Water disc scales live. Trees/shrubs/moss/kelp regenerate from
              coverage. Predators hunt; MIND morphs get tool + mind halo.
            </p>
          </div>

          <div className="glass rounded-[var(--radius-lg)] p-4">
            <h2 className="heading-section text-base">Orbit & seasons</h2>
            <Range
              label="Year length"
              value={env.orbit.yearLengthTicks}
              min={40}
              max={240}
              step={4}
              display={`${env.orbit.yearLengthTicks} ticks`}
              onChange={(n) =>
                setEnvLive((w) => ({
                  ...w,
                  orbit: { ...w.orbit, yearLengthTicks: n },
                }))
              }
            />
            <Range
              label="Axial tilt"
              value={env.orbit.axialTilt}
              min={0}
              max={45}
              step={1}
              display={`${env.orbit.axialTilt}°`}
              onChange={(n) =>
                setEnvLive((w) => ({
                  ...w,
                  orbit: { ...w.orbit, axialTilt: n },
                }))
              }
            />
            <Range
              label="Eccentricity"
              value={env.orbit.eccentricity}
              min={0}
              max={0.4}
              step={0.01}
              display={env.orbit.eccentricity.toFixed(2)}
              onChange={(n) =>
                setEnvLive((w) => ({
                  ...w,
                  orbit: { ...w.orbit, eccentricity: n },
                }))
              }
            />
            <p className="mt-2 text-xs text-muted">
              <strong className="text-ink">Year length</strong> ≈ how long one
              orbit takes · <strong className="text-ink">tilt</strong> → seasons
              · <strong className="text-ink">eccentricity</strong> → distance
              swings (hot/cold extremes). See Star &amp; planet science lab for
              optimal values.
            </p>
          </div>

          <div className="glass rounded-[var(--radius-lg)] p-4">
            <h2 className="heading-section text-base">Food sources</h2>
            <Range
              label="Primary productivity"
              value={env.foodWeb.primaryProductivity}
              min={0.1}
              max={1.2}
              step={0.05}
              display={env.foodWeb.primaryProductivity.toFixed(2)}
              onChange={(n) =>
                setEnvLive((w) => ({
                  ...w,
                  foodWeb: { ...w.foodWeb, primaryProductivity: n },
                }))
              }
            />
            <Range
              label="Patch count"
              value={env.foodWeb.patchCount}
              min={4}
              max={24}
              step={1}
              display={String(env.foodWeb.patchCount)}
              onChange={(n) =>
                setEnvLive((w) => ({
                  ...w,
                  foodWeb: { ...w.foodWeb, patchCount: n },
                }))
              }
            />
            <Range
              label="Regrowth rate"
              value={env.foodWeb.regrowth}
              min={0.01}
              max={0.12}
              step={0.005}
              display={env.foodWeb.regrowth.toFixed(3)}
              onChange={(n) =>
                setEnvLive((w) => ({
                  ...w,
                  foodWeb: { ...w.foodWeb, regrowth: n },
                }))
              }
            />
          </div>

          <div className="glass rounded-[var(--radius-lg)] p-4">
            <h2 className="heading-section text-base">Starter strain</h2>
            <select
              className="mt-2 w-full rounded-lg border border-[var(--glass-border)] bg-[var(--glass)] px-2 py-2 text-sm text-ink"
              value={strainId}
              onChange={(e) => setStrainId(e.target.value)}
            >
              {STARTER_STRAINS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <p className="mt-2 text-xs text-muted">{strain.blurb}</p>
            {strain.expectedStructures &&
              strain.expectedStructures.length > 0 && (
                <p className="mt-1.5 text-[11px] text-ink">
                  Target builds:{" "}
                  <span className="text-muted">
                    {strain.expectedStructures.join(" · ")}
                  </span>
                </p>
              )}
            <p className="mt-2 break-all font-mono text-[10px] text-soft">
              {strain.dna}
            </p>
          </div>

          <div className="callout callout-tip text-xs">
            <strong>{biome.label}</strong>
            <br />
            ~{climate.tempC.toFixed(0)}°C · light {climate.lightLevel.toFixed(2)}{" "}
            · food prod {climate.foodProductivity.toFixed(2)} · habitability{" "}
            {(climate.habitability * 100).toFixed(0)}%
          </div>
        </aside>
      </div>

      <div className="grid gap-3 grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
        <Stat label="Tick" value={String(sim.stats.tick)} />
        <Stat
          label="Season"
          value={seasonLabel(sim.stats.season as SeasonName)}
        />
        <Stat label="Population" value={String(sim.stats.population)} />
        <Stat label="Max gen" value={String(sim.stats.maxGeneration)} />
        <Stat label="Avg fitness" value={sim.stats.avgFitness.toFixed(2)} />
        <Stat label="Food energy" value={sim.stats.foodTotal.toFixed(1)} />
        <Stat label="Air quality" value={sim.stats.airQuality.toFixed(2)} />
        <Stat label="Light" value={sim.stats.lightLevel.toFixed(2)} />
        <Stat label="Temp °C" value={sim.stats.tempC.toFixed(0)} />
        <Stat label="Flora" value={String(sim.stats.floraCount)} />
        <Stat
          label="Water %"
          value={`${(sim.stats.waterCoverage * 100).toFixed(0)}%`}
        />
        <Stat label="Predators" value={String(sim.stats.predatorCount)} />
        <Stat label="Humans" value={String(sim.stats.humanCount)} />
        <Stat label="Tech" value={String(sim.stats.techLevel ?? "none")} />
        <Stat
          label="Pollution"
          value={`${sim.stats.pollutionPct ?? 0}%`}
        />
        <Stat
          label="Locked events"
          value={String(sim.stats.lockedEventCount ?? 0)}
        />
        <Stat
          label="Forest timber"
          value={String(sim.stats.forestTimber ?? 0)}
        />
        <Stat label="Wood stock" value={String(sim.stats.woodStock ?? 0)} />
        <Stat
          label="Infrastructure"
          value={`${sim.stats.infrastructurePct ?? 0}%`}
        />
        <Stat
          label="Trees cut"
          value={String(sim.stats.treesHarvested ?? 0)}
        />
        <Stat label="Intelligent" value={String(sim.stats.intelligentCount)} />
        <Stat label="Settlements" value={String(sim.stats.settlementCount)} />
        <Stat label="Matings" value={String(sim.stats.matings)} />
        <Stat
          label="Sexual births"
          value={String(sim.stats.sexualBirths)}
        />
        <Stat
          label="Asexual births"
          value={String(sim.stats.asexualBirths)}
        />
        <Stat
          label="Flora buds/seeds"
          value={`${sim.stats.floraBirths}/${sim.stats.floraSeeds}`}
        />
        <Stat label="Behaviour" value={sim.stats.dominantBehaviour} />
        <Stat label="Births" value={String(sim.stats.births)} />
        <Stat label="Deaths" value={String(sim.stats.deaths)} />
        <Stat label="Weather" value={weather.label} />
      </div>

      {sim.settlements.length > 0 && (
        <div className="glass rounded-[var(--radius-lg)] p-4">
          <h2 className="heading-section text-base">
            Settlements · built from forest &amp; minerals
          </h2>
          <p className="mt-1 text-xs text-muted">
            Infrastructure uses timber from trees and minerals from the ground —
            not free. More building → more forest harvest (locked history).
          </p>
          <ul className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 text-sm">
            {sim.settlements.map((t) => (
              <li
                key={t.id}
                className="rounded-lg bg-[var(--glass-soft)] px-3 py-2"
              >
                <div className="font-semibold text-ink">{t.name}</div>
                <div className="text-xs text-muted">
                  infra {((t.infrastructure ?? 0) * 100).toFixed(0)}% · size{" "}
                  {(t.size * 100).toFixed(0)}% · food {t.foodStore.toFixed(1)}
                </div>
                <div className="text-[11px] text-soft">
                  wood {(t.woodStore ?? 0).toFixed(1)} · minerals{" "}
                  {(t.mineralStore ?? 0).toFixed(1)} · culture{" "}
                  {(t.culture * 100).toFixed(0)}%
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="glass rounded-[var(--radius-lg)] p-4">
          <h2 className="heading-section text-base">
            Population (click to inspect)
          </h2>
          <ul className="mt-3 max-h-48 space-y-1 overflow-y-auto text-sm">
            {sim.organisms.slice(0, 40).map((o) => (
              <li key={o.id}>
                <button
                  type="button"
                  className={`w-full rounded-lg px-2 py-1.5 text-left ${
                    selected?.id === o.id
                      ? "bg-[var(--sky-soft)]"
                      : "hover:bg-[var(--glass-soft)]"
                  }`}
                  onClick={() => setSelectedId(o.id)}
                >
                  gen {o.generation} · {o.role}
                  {o.role === "human" || o.sex
                    ? ` · ${o.sex?.[0] ?? "?"}`
                    : ""}{" "}
                  · {behaviourLabel(o.behaviour)} · E {o.energy.toFixed(1)}
                  {o.sexualBirth ? " · sexual" : ""}
                  {o.kills > 0 ? ` · kills ${o.kills}` : ""}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass rounded-[var(--radius-lg)] p-4">
          <h2 className="heading-section text-base">
            Selected genome · structure build
          </h2>
          {selectedExpr ? (
            <div className="mt-2 space-y-3 text-sm">
              <p className="break-all font-mono text-[10px] text-soft">
                DNA: {selectedExpr.dna}
              </p>
              <p className="break-all font-mono text-[10px] text-soft">
                RNA: {selectedExpr.rna}
              </p>
              <p className="break-all font-mono text-[11px] text-ink">
                AA: {selectedExpr.aminoAcidSequence || "—"}
              </p>
              <p className="text-xs text-muted">
                Secondary:{" "}
                <span className="font-medium text-ink">
                  {selectedExpr.secondarySummary}
                </span>
              </p>
              {/* Secondary structure strip */}
              {selectedExpr.secondary.length > 0 && (
                <div
                  className="flex h-3 w-full overflow-hidden rounded-full border border-[var(--glass-border)]"
                  title="α-helix (violet) · β-sheet (amber) · loop (grey)"
                >
                  {selectedExpr.secondary.map((el, i) => {
                    const len = el.end - el.start + 1;
                    const total = Math.max(
                      1,
                      selectedExpr.aminoAcidSequence.length,
                    );
                    const pct = (len / total) * 100;
                    const bg =
                      el.type === "helix"
                        ? "bg-violet-500/80"
                        : el.type === "sheet"
                          ? "bg-amber-500/80"
                          : "bg-slate-400/50";
                    return (
                      <div
                        key={`${el.start}-${i}`}
                        className={bg}
                        style={{ width: `${pct}%` }}
                        title={`${el.type} ${el.start + 1}–${el.end + 1}`}
                      />
                    );
                  })}
                </div>
              )}
              {selectedExpr.motifs.length > 0 && (
                <p className="text-[11px] text-muted">
                  Motifs:{" "}
                  <span className="text-ink">
                    {selectedExpr.motifs.join(" · ")}
                  </span>
                </p>
              )}
              {selectedExpr.complexes.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                    Supramolecular systems
                  </p>
                  <ul className="mt-1.5 space-y-1.5">
                    {selectedExpr.complexes.map((c) => (
                      <li
                        key={c.id}
                        className="rounded-lg border border-[var(--sky-soft)] bg-[var(--sky-soft)]/40 px-2 py-1.5 text-xs"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-ink">
                            {c.name}
                          </span>
                          <span className="tabular-nums text-soft">
                            ★{c.complexity} · {(c.score * 100).toFixed(0)}%
                          </span>
                        </div>
                        <p className="mt-0.5 text-[10px] text-muted">
                          {c.realWorld}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-soft">
                  Known structures built
                </p>
                {selectedExpr.structures.length > 0 ? (
                  <ul className="mt-1.5 max-h-48 space-y-1.5 overflow-y-auto">
                    {selectedExpr.structures.map((s) => (
                      <li
                        key={s.id}
                        className="rounded-lg bg-[var(--glass-soft)] px-2 py-1.5 text-xs"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium text-ink">{s.name}</span>
                          <span className="tabular-nums text-soft">
                            C{s.complexity} · {(s.score * 100).toFixed(0)}%
                          </span>
                        </div>
                        <p className="mt-0.5 text-[10px] text-soft">
                          {s.level}
                          {s.level === "system" ? " · organelle/tissue" : ""}
                        </p>
                        <p className="mt-0.5 text-[10px] text-muted">
                          {s.realWorld}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-1 text-xs text-muted">
                    No strong structure assignment — try a longer ORF strain.
                  </p>
                )}
              </div>
              <p className="text-muted">
                Function tags:{" "}
                {proteinSummary(selectedExpr.proteins)
                  .map(([k, v]) => `${k}×${v}`)
                  .join(", ") || "none"}
              </p>
              <ul className="grid grid-cols-2 gap-1 text-xs text-muted">
                <li>Role: {selected?.role}</li>
                <li>Sex: {selected?.sex}</li>
                <li>
                  Behaviour:{" "}
                  {selected
                    ? behaviourLabel(selected.behaviour)
                    : "—"}
                </li>
                <li>
                  Culture:{" "}
                  {selected ? (selected.culture * 100).toFixed(0) : "—"}%
                </li>
                <li>
                  Offspring: {selected?.kin.offspringCount ?? 0}
                  {selected?.sexualBirth ? " · born sexual" : ""}
                </li>
                <li>Family: {selected?.kin.familyId ?? "—"}</li>
                <li>Speed {selectedExpr.traits.speed.toFixed(2)}</li>
                <li>Mind {selectedExpr.traits.intelligence.toFixed(2)}</li>
              </ul>
            </div>
          ) : (
            <p className="mt-2 text-sm text-muted">No organism selected.</p>
          )}
        </div>
      </div>

      <div className="glass rounded-[var(--radius-lg)] p-4">
        <h2 className="heading-section text-base">Evolution log</h2>
        <ul className="mt-2 max-h-40 space-y-1 overflow-y-auto font-mono text-[11px] text-soft">
          {sim.log.map((line, i) => (
            <li key={`${i}-${line.slice(0, 16)}`}>{line}</li>
          ))}
        </ul>
      </div>

      <TheoreticalOutcomePanel
        organism={selected}
        env={sim.env}
        simTick={sim.stats.tick}
        maxGeneration={sim.stats.maxGeneration}
      />

      <div className="callout callout-warning text-sm">
        <strong>Biology build note:</strong> DNA uses the standard genetic code
        (AUG start, UAA/UAG/UGA stop). Residues fold into α-helix / β-sheet /
        loop; chemistry scores known assemblies (membrane, photosystem, motor,
        collagen, DNA-binding…). Those structures drive traits and ecology.
        Seasons, air quality and food still filter who survives — explain in
        your theoretical outcome how structure + climate shaped the lineage.
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass-soft rounded-[var(--radius-md)] px-3 py-2">
      <div className="text-[10px] uppercase tracking-wide text-soft">{label}</div>
      <div className="truncate text-base font-semibold text-ink sm:text-lg">
        {value}
      </div>
    </div>
  );
}

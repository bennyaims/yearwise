"use client";

import { useState } from "react";
import { replicateDna } from "@/lib/genesis/dna";
import {
  createOrganism,
  type SimState,
} from "@/lib/genesis/simulate";
import { HUMAN_STARTER_DNA } from "@/lib/genesis/society";
import {
  applyExternalFix,
  applyPollutionEvent,
  applyPopulationPulse,
  applyTechUpgrade,
  EXTERNAL_FIXES,
  runScienceTest,
  SCIENCE_TESTS,
  TECH_LEVELS,
  type ExternalFixId,
  type ScienceTestId,
  type TechLevelId,
} from "@/lib/genesis/tech-science";

type Props = {
  sim: SimState;
  onChange: (s: SimState) => void;
  unlocked: boolean;
};

export function ScienceTechPanel({ sim, onChange, unlocked }: Props) {
  const [lastTeach, setLastTeach] = useState<string | null>(null);
  const civ = sim.civilization;

  if (!unlocked) {
    return (
      <div className="glass rounded-[var(--radius-lg)] p-4 text-sm text-muted">
        <h2 className="heading-section text-base text-ink">
          Technology · pollution · science tests
        </h2>
        <p className="mt-2">
          Unlocks when humans are on the world (Year 11+ habitation path). First
          survey the living planet — then study how tech and population change
          air, water and life.
        </p>
      </div>
    );
  }

  function teach(msg: string) {
    setLastTeach(msg);
  }

  function setCivEnv(
    next: { civilization: typeof civ; env: typeof sim.env },
    logLine: string,
  ) {
    onChange({
      ...sim,
      env: next.env,
      civilization: next.civilization,
      stats: {
        ...sim.stats,
        techLevel: next.civilization.techLevel,
        pollutionPct: Math.round(next.civilization.pollutionNow * 100),
        pollutionLedger: Math.round(next.civilization.pollutionLedger),
        lockedEventCount: next.civilization.lockedEvents.length,
        airQuality: sim.stats.airQuality,
      },
      log: [...sim.log.slice(-70), logLine],
    });
  }

  function upgradeTech(id: TechLevelId) {
    const { civ: c, teaching } = applyTechUpgrade(
      civ,
      id,
      sim.stats.tick,
    );
    // Apply small immediate env hit from upgrade event
    const last = c.lockedEvents[c.lockedEvents.length - 1];
    let env = sim.env;
    if (last?.impact) {
      env = {
        ...env,
        atmosphere: {
          ...env.atmosphere,
          toxin: Math.min(1, env.atmosphere.toxin + (last.impact.toxin ?? 0)),
          particulates: Math.min(
            1,
            env.atmosphere.particulates + (last.impact.particulates ?? 0),
          ),
          co2: Math.min(1, env.atmosphere.co2 + (last.impact.co2 ?? 0)),
        },
      };
    }
    teach(teaching);
    setCivEnv(
      { civilization: c, env },
      `ADJUSTMENT (locked): tech → ${id}. ${teaching.slice(0, 120)}`,
    );
  }

  function pollute(kind: "smog" | "spill" | "smoke") {
    const r = applyPollutionEvent(civ, sim.env, sim.stats.tick, kind);
    teach(r.teaching);
    setCivEnv(
      { civilization: r.civ, env: r.env },
      `ADJUSTMENT (locked): pollution “${kind}”. Cannot erase — only fix from outside.`,
    );
  }

  function popPulse() {
    const r = applyPopulationPulse(civ, sim.stats.tick, 0.7);
    const rng = () => Math.random();
    const added = [];
    for (let i = 0; i < r.extraHumans; i++) {
      added.push(
        createOrganism(
          replicateDna(HUMAN_STARTER_DNA, 0.02, rng),
          0,
          `Pulse${i}`,
          rng,
          {
            forceRole: "human",
            energyBoost: 1,
            culture: 0.35,
            sex: i % 2 === 0 ? "female" : "male",
          },
        ),
      );
    }
    teach(r.teaching);
    onChange({
      ...sim,
      organisms: [...sim.organisms, ...added].slice(0, 100),
      civilization: r.civ,
      stats: {
        ...sim.stats,
        population: Math.min(100, sim.stats.population + added.length),
        humanCount: sim.stats.humanCount + added.length,
        lockedEventCount: r.civ.lockedEvents.length,
        techLevel: r.civ.techLevel,
        pollutionPct: Math.round(r.civ.pollutionNow * 100),
      },
      log: [
        ...sim.log.slice(-70),
        `ADJUSTMENT (locked): population +${added.length}. History keeps the boom.`,
      ],
    });
  }

  function runTest(id: ScienceTestId) {
    const result = runScienceTest(
      id,
      sim.env,
      {
        tick: sim.stats.tick,
        humanCount: sim.stats.humanCount,
        population: sim.stats.population,
        floraCount: sim.stats.floraCount,
        predatorCount: sim.stats.predatorCount,
        settlementCount: sim.stats.settlementCount,
        maxGeneration: sim.stats.maxGeneration,
      },
      civ,
    );
    const teaching = `TEST “${result.title}”: score ${result.score}/100 (${result.band}). ${result.teaching} → ${result.recommendation}`;
    const tests = [result, ...civ.tests].slice(0, 12);
    const lockedEvents = [
      ...civ.lockedEvents,
      {
        id: `test-${sim.stats.tick}-${id}`,
        tick: sim.stats.tick,
        kind: "test-result" as const,
        title: `Science test logged: ${result.title}`,
        description: `Score ${result.score} (${result.band}). ${result.reading}`,
        scienceTeach: result.teaching,
        impact: {},
      },
    ];
    teach(teaching);
    onChange({
      ...sim,
      civilization: {
        ...civ,
        tests,
        lockedEvents,
        teachings: [...civ.teachings, teaching].slice(-40),
      },
      stats: {
        ...sim.stats,
        lockedEventCount: lockedEvents.length,
      },
      log: [...sim.log.slice(-70), `SCIENCE TEST: ${result.title} → ${result.score}/100 (${result.band})`],
    });
  }

  function fix(id: ExternalFixId) {
    const r = applyExternalFix(civ, sim.env, id, sim.stats.tick);
    teach(r.teaching);
    setCivEnv(
      { civilization: r.civ, env: r.env },
      `EXTERNAL FIX: ${id} — present improved; locked history unchanged (${r.civ.lockedEvents.length} events).`,
    );
  }

  const latestTest = civ.tests[0];

  return (
    <div className="glass rounded-[var(--radius-lg)] p-4 space-y-4">
      <div>
        <h2 className="heading-section text-base">
          Technology · population · pollution · tests
        </h2>
        <p className="mt-1 text-xs text-muted">
          <strong className="text-ink">Adjustments lock into history</strong>{" "}
          (cannot be undone).{" "}
          <strong className="text-ink">Outside fixes</strong> can improve air,
          water and life now — for the essay, both matter.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 text-center">
        <Stat label="Tech" value={civ.techLevel} />
        <Stat
          label="Pollution now"
          value={`${sim.stats.pollutionPct ?? Math.round(civ.pollutionNow * 100)}%`}
        />
        <Stat
          label="Forest timber"
          value={String(sim.stats.forestTimber ?? Math.round(civ.forestTimber))}
        />
        <Stat
          label="Infra / trees cut"
          value={`${sim.stats.infrastructurePct ?? 0}% / ${sim.stats.treesHarvested ?? civ.treesHarvested}`}
        />
      </div>
      <p className="text-[11px] text-muted">
        <strong className="text-ink">Resource rule:</strong> houses, roads and
        workshops need <strong className="text-ink">wood from forests</strong>{" "}
        and <strong className="text-ink">minerals from the ground</strong> on
        this planet. Dense forest = more timber; building fells trees
        (locked history).
      </p>

      {lastTeach && (
        <div className="rounded-lg border border-sky-400/30 bg-sky-500/10 p-3 text-xs leading-relaxed text-ink">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-sky-600 dark:text-sky-300">
            Teaching
          </p>
          <p className="mt-1">{lastTeach}</p>
        </div>
      )}

      {/* Tech upgrades */}
      <section>
        <h3 className="text-xs font-bold uppercase tracking-wide text-soft">
          1 · Technology ladder (locked when raised)
        </h3>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {TECH_LEVELS.filter((t) => t.id !== "none").map((t) => (
            <button
              key={t.id}
              type="button"
              className={`rounded-lg px-2.5 py-1.5 text-[11px] font-medium ${
                civ.techLevel === t.id
                  ? "bg-[var(--sky-soft)] ring-1 ring-sky-400"
                  : "bg-[var(--glass-soft)] hover:bg-[var(--sky-soft)]/40"
              }`}
              title={t.science}
              onClick={() => upgradeTech(t.id)}
            >
              {t.kidLabel}
            </button>
          ))}
        </div>
        <p className="mt-1 text-[11px] text-muted">
          {TECH_LEVELS.find((t) => t.id === civ.techLevel)?.blurb} Higher tech
          can feed more people and make more pollution.
        </p>
      </section>

      {/* Population & pollution intro */}
      <section>
        <h3 className="text-xs font-bold uppercase tracking-wide text-soft">
          2 · Population & pollution introductions (locked)
        </h3>
        <div className="mt-2 flex flex-wrap gap-2">
          <button type="button" className="btn btn-sky text-xs" onClick={popPulse}>
            + Population pulse
          </button>
          <button
            type="button"
            className="btn btn-ghost text-xs"
            onClick={() => pollute("smoke")}
          >
            Introduce smoke
          </button>
          <button
            type="button"
            className="btn btn-ghost text-xs"
            onClick={() => pollute("smog")}
          >
            Introduce smog
          </button>
          <button
            type="button"
            className="btn btn-ghost text-xs"
            onClick={() => pollute("spill")}
          >
            Introduce spill
          </button>
        </div>
        <p className="mt-1 text-[11px] text-muted">
          These create permanent history events. Air/water get worse until you
          fix from the outside.
        </p>
      </section>

      {/* Science tests */}
      <section>
        <h3 className="text-xs font-bold uppercase tracking-wide text-soft">
          3 · Scientific tests & teachings
        </h3>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {SCIENCE_TESTS.map((t) => (
            <button
              key={t.id}
              type="button"
              className="rounded-lg bg-[var(--glass-soft)] px-2.5 py-1.5 text-[11px] font-medium text-ink hover:bg-[var(--sky-soft)]"
              title={t.blurb}
              onClick={() => runTest(t.id)}
            >
              {t.kidLabel}
            </button>
          ))}
        </div>
        {latestTest && (
          <div className="mt-2 rounded-lg bg-[var(--glass-soft)] p-3 text-xs">
            <p className="font-semibold text-ink">
              Latest: {latestTest.title} · {latestTest.score}/100 ·{" "}
              <span className="uppercase text-soft">{latestTest.band}</span>
            </p>
            <p className="mt-1 font-mono text-[10px] text-muted">
              {latestTest.reading}
            </p>
            <p className="mt-2 text-muted">
              <strong className="text-ink">Teach:</strong> {latestTest.teaching}
            </p>
            <p className="mt-1 text-muted">
              <strong className="text-ink">Next step:</strong>{" "}
              {latestTest.recommendation}
            </p>
          </div>
        )}
      </section>

      {/* External fixes */}
      <section>
        <h3 className="text-xs font-bold uppercase tracking-wide text-soft">
          4 · Fix from the outside (present only)
        </h3>
        <p className="mt-1 text-[11px] text-muted">
          Cleanup does <strong className="text-ink">not</strong> delete locked
          events — it only improves conditions now (for essay honesty).
        </p>
        <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
          {EXTERNAL_FIXES.map((f) => (
            <button
              key={f.id}
              type="button"
              className="rounded-lg bg-emerald-500/15 px-2.5 py-2 text-left text-[11px] hover:bg-emerald-500/25"
              onClick={() => fix(f.id)}
            >
              <span className="font-semibold text-ink">{f.kidLabel}</span>
              <span className="mt-0.5 block text-muted">{f.blurb}</span>
              <span className="mt-0.5 block text-[10px] text-soft">
                {f.note}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Locked history log */}
      {civ.lockedEvents.length > 0 && (
        <section>
          <h3 className="text-xs font-bold uppercase tracking-wide text-soft">
            Permanent history (cannot edit)
          </h3>
          <ul className="mt-2 max-h-36 space-y-1.5 overflow-y-auto text-[11px]">
            {[...civ.lockedEvents].reverse().slice(0, 12).map((e) => (
              <li
                key={e.id}
                className="rounded-lg bg-[var(--glass-soft)] px-2 py-1.5"
              >
                <span className="font-semibold text-ink">
                  t={e.tick} · {e.title}
                </span>
                <span className="mt-0.5 block text-muted">{e.scienceTeach}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-[var(--glass-soft)] px-2 py-2">
      <div className="text-[9px] uppercase tracking-wide text-soft">{label}</div>
      <div className="truncate text-sm font-bold text-ink">{value}</div>
    </div>
  );
}

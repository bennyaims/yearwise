"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ContentBlocks } from "@/components/ContentBlocks";
import { Quiz } from "@/components/Quiz";
import {
  designToContentBlocks,
  designsForLevel,
  GEOGEBRA_DESIGNS,
  GEOGEBRA_LEVELS,
  type GeoGebraDesign,
  type GeoGebraLevel,
} from "@/content/geogebra-designs";
import { grantTestCoins } from "@/lib/game-economy";
import { loadProfile } from "@/lib/student-profile";
import type { YearLevel } from "@/lib/types";

export default function GeoGebraStudioPage() {
  const [year, setYear] = useState<YearLevel>(7);
  const [level, setLevel] = useState<GeoGebraLevel>("beginner");
  const [active, setActive] = useState<GeoGebraDesign>(
    GEOGEBRA_DESIGNS[0]!,
  );
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    setYear(loadProfile()?.yearLevel ?? 7);
  }, []);

  const list = useMemo(() => {
    return designsForLevel(level);
  }, [level]);

  const blocks = useMemo(() => designToContentBlocks(active), [active]);

  function pickLevel(lv: GeoGebraLevel) {
    setLevel(lv);
    const next = designsForLevel(lv)[0];
    if (next) setActive(next);
    setMsg(null);
  }

  return (
    <div className="page-shell page-mid space-y-6">
      <Link href="/game" className="link-back">
        ← Build Lab
      </Link>

      <header className="glass-strong rounded-[var(--radius-xl)] p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
          Maths · GeoGebra design studio
        </p>
        <h1 className="heading-display mt-2 text-3xl sm:text-4xl">
          Make maths look cool
        </h1>
        <p className="mt-3 max-w-2xl text-muted">
          Build dazzling designs in free{" "}
          <strong className="text-ink">GeoGebra</strong> — from beginner star
          bursts to expert parametric galaxies. Every project teaches real
          curriculum maths while you create something worth screenshotting.
          {year ? ` Suggested band for Year ${year}+.` : ""}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href="https://www.geogebra.org/classic"
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary text-sm"
          >
            Open GeoGebra Classic (web)
          </a>
          <a
            href="https://www.geogebra.org/download"
            target="_blank"
            rel="noreferrer"
            className="btn btn-sky text-sm"
          >
            Download GeoGebra
          </a>
          <a
            href="https://www.geogebra.org/3d"
            target="_blank"
            rel="noreferrer"
            className="btn btn-ghost text-sm"
          >
            GeoGebra 3D
          </a>
        </div>
      </header>

      <div className="flex flex-wrap gap-2">
        {GEOGEBRA_LEVELS.map((lv) => (
          <button
            key={lv.id}
            type="button"
            onClick={() => pickLevel(lv.id)}
            className={`rounded-xl px-3 py-2 text-left text-xs font-medium transition ${
              level === lv.id
                ? "bg-[var(--sky-soft)] ring-1 ring-sky-400"
                : "bg-[var(--glass-soft)]"
            }`}
          >
            <span className="block font-semibold text-ink">{lv.label}</span>
            <span className="text-soft">{lv.blurb}</span>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {list.map((d) => (
          <button
            key={d.id}
            type="button"
            className={`rounded-lg px-3 py-2 text-xs font-medium ${
              active.id === d.id
                ? "bg-[var(--sky-soft)] ring-1 ring-sky-400"
                : "bg-[var(--glass-soft)]"
            }`}
            onClick={() => {
              setActive(d);
              setMsg(null);
            }}
          >
            {d.title}
          </button>
        ))}
      </div>

      <article className="space-y-4">
        <div className="glass rounded-[var(--radius-lg)] p-4">
          <p className="text-xs text-accent font-semibold uppercase">
            {active.level} · ~{active.minutes} min · Y{active.yearMin}+
          </p>
          <h2 className="heading-section mt-1 text-xl">{active.title}</h2>
          <p className="text-sm text-muted mt-1">{active.vibe}</p>
          <p className="mt-2 text-xs text-soft">
            Maths: {active.maths.join(" · ")}
          </p>
        </div>

        <ContentBlocks blocks={blocks} />

        {msg && (
          <p className="rounded-lg bg-emerald-500/15 px-4 py-2 text-sm text-ink">
            {msg}
          </p>
        )}

        <div className="space-y-2">
          <p className="text-sm text-muted">
            Design check — proves you understand the maths behind the art (counts
            for practice coins; still finish pathway lesson quizzes for year
            progress).
          </p>
          <Quiz
            questions={active.quiz}
            onComplete={(percent) => {
              const r = grantTestCoins({
                claimKey: `geogebra-design:${active.id}`,
                percent,
                source: "guided",
                subject: "math",
              });
              setMsg(
                r.message +
                  " · Screenshot your GeoGebra design for your portfolio!",
              );
            }}
          />
        </div>
      </article>

      <section className="callout callout-tip text-sm">
        <strong className="text-ink">Classroom tip:</strong> build → screenshot →
        short caption (“I used equal radii / vertex form / a slider”). Share a
        gallery wall. Pair with your Year maths pathway lessons — designs make
        integers, graphs, and geometry stick.
      </section>
    </div>
  );
}

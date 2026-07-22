"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ContentBlocks } from "@/components/ContentBlocks";
import { Quiz } from "@/components/Quiz";
import {
  GAME_BUILD_MODULES,
  type GameBuildModule,
} from "@/content/game-build-pathway";
import {
  grantTestCoins,
  loadEconomy,
  setCsBuildLevel,
  type GameEconomyState,
} from "@/lib/game-economy";

export default function GameCodePage() {
  const [eco, setEco] = useState<GameEconomyState | null>(null);
  const [active, setActive] = useState<GameBuildModule>(GAME_BUILD_MODULES[0]!);
  const [rewardMsg, setRewardMsg] = useState<string | null>(null);

  useEffect(() => {
    setEco(loadEconomy());
  }, []);

  function onQuizComplete(percent: number) {
    const r = grantTestCoins({
      claimKey: `game-build:${active.id}`,
      percent,
      source: "cs-build",
      subject: "computerscience",
    });
    // Raise CS build level when quiz ≥ 60%
    if (percent >= 60) {
      setCsBuildLevel(active.level);
    }
    setEco(loadEconomy());
    setRewardMsg(
      r.message +
        (percent >= 60
          ? ` · CS systems level → at least ${active.level}`
          : " · Score 60%+ to unlock the next applied-project tier"),
    );
  }

  if (!eco) return <div className="page-shell">Loading…</div>;

  return (
    <div className="page-shell page-mid space-y-6">
      <Link href="/game" className="link-back">
        ← Build Lab
      </Link>

      <header className="glass-strong rounded-[var(--radius-xl)] p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
          Computer Science curriculum · applied coding
        </p>
        <h1 className="heading-display mt-2 text-3xl">Code &amp; systems</h1>
        <p className="mt-2 text-muted">
          You learn programming by building the educational systems Yearwise
          uses: progress counters, shops, simulations, and class rooms. This is
          curriculum coding — not a separate entertainment product. Each level
          deepens Digital Technologies skills and unlocks applied project tools
          for Genesis Lab.
        </p>
        <p className="mt-3 text-sm">
          🪙 {eco.coins} practice coins · CS systems level{" "}
          <strong>{eco.csBuildLevel}/6</strong>
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {GAME_BUILD_MODULES.map((m) => (
          <button
            key={m.id}
            type="button"
            className={`rounded-lg px-3 py-2 text-xs font-medium ${
              active.id === m.id
                ? "bg-[var(--sky-soft)] ring-1 ring-sky-400"
                : "bg-[var(--glass-soft)]"
            }`}
            onClick={() => {
              setActive(m);
              setRewardMsg(null);
            }}
          >
            L{m.level} · Y{m.year} · {m.title.replace(/^Level \d+ · /, "")}
          </button>
        ))}
      </div>

      <article className="glass rounded-[var(--radius-lg)] p-5 sm:p-6">
        <p className="text-xs text-accent font-semibold uppercase tracking-wide">
          Y{active.year} · Level {active.level} · {active.minutes} min
        </p>
        <h2 className="heading-section mt-1 text-xl">{active.title}</h2>
        <p className="mt-2 text-sm text-muted">{active.summary}</p>
        <p className="mt-2 text-xs text-soft">Unlocks: {active.unlocks}</p>
        <div className="mt-4">
          <ContentBlocks blocks={active.content} />
        </div>
      </article>

      {rewardMsg && (
        <p className="rounded-lg bg-emerald-500/15 px-4 py-2 text-sm text-ink">
          {rewardMsg}
        </p>
      )}

      <Quiz questions={active.quiz} onComplete={onQuizComplete} />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  loadEconomy,
  type GameEconomyState,
} from "@/lib/game-economy";
import {
  classTimeRemaining,
  ensureDemoClassesFromNow,
  listLiveClasses,
  type LiveClassSession,
} from "@/lib/live-class";

export function GameHub() {
  const [eco, setEco] = useState<GameEconomyState | null>(null);
  const [classes, setClasses] = useState<LiveClassSession[]>([]);

  useEffect(() => {
    setEco(loadEconomy());
    ensureDemoClassesFromNow();
    setClasses(listLiveClasses().filter((c) => c.status !== "ended"));
    const t = window.setInterval(() => {
      setClasses(listLiveClasses().filter((c) => c.status !== "ended"));
    }, 5000);
    return () => clearInterval(t);
  }, []);

  if (!eco) {
    return (
      <div className="page-shell">
        <p className="text-muted">Loading game…</p>
      </div>
    );
  }

  return (
    <div className="page-shell page-mid space-y-6">
      <Link href="/" className="link-back">
        ← Home
      </Link>

      <header className="glass-strong rounded-[var(--radius-xl)] p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
          Yearwise Game Mode
        </p>
        <h1 className="heading-display mt-2 text-3xl sm:text-4xl">
          Learn · earn coins · build the world
        </h1>
        <p className="mt-3 max-w-2xl text-muted">
          Pass tests in <strong className="text-ink">any subject</strong> to earn
          coins. Spend them on food, animals and characters. Computer Science
          teaches you to <strong className="text-ink">code the game</strong>.
          Blender teaches <strong className="text-ink">3D worlds</strong>. Start an{" "}
          <strong className="text-ink">app class</strong> anytime — a voice
          teacher bot reads and explains every step.
        </p>
        <div className="mt-5 flex flex-wrap gap-4">
          <div className="rounded-xl bg-[var(--sky-soft)] px-4 py-3">
            <div className="text-[10px] uppercase text-soft">Coins</div>
            <div className="text-2xl font-bold text-ink">🪙 {eco.coins}</div>
          </div>
          <div className="rounded-xl bg-[var(--glass-soft)] px-4 py-3">
            <div className="text-[10px] uppercase text-soft">CS build level</div>
            <div className="text-2xl font-bold text-ink">{eco.csBuildLevel} / 6</div>
          </div>
          <div className="rounded-xl bg-[var(--glass-soft)] px-4 py-3">
            <div className="text-[10px] uppercase text-soft">Characters unlocked</div>
            <div className="text-2xl font-bold text-ink">
              {eco.unlockedCharacters.length}
            </div>
          </div>
        </div>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <HubCard
          href="/game/live"
          title="App classes + voice teacher"
          blurb="Start a timed lesson now. Bot reads & explains."
          icon="🎙️"
        />
        <HubCard
          href="/game/shop"
          title="Coin shop"
          blurb="Buy food, animals, characters for Genesis."
          icon="🛒"
        />
        <HubCard
          href="/game/code"
          title="Code the game (CS)"
          blurb="Build shop, loops, sims — unlock shop tiers."
          icon="💻"
        />
        <HubCard
          href="/game/blender"
          title="Blender 3D"
          blurb="YouTube-guided lessons for worlds & characters."
          icon="🎨"
        />
        <HubCard
          href="/labs/genesis"
          title="Genesis world"
          blurb="Drop shop purchases into the living world."
          icon="🌍"
        />
        <HubCard
          href="/weekly-test"
          title="Weekly test"
          blurb="Earn extra coins for the shop."
          icon="⭐"
        />
      </div>

      <section className="glass rounded-[var(--radius-lg)] p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="heading-section text-lg">Open app classes</h2>
          <Link href="/game/live" className="btn btn-primary text-xs">
            Start a class
          </Link>
        </div>
        {classes.length === 0 ? (
          <p className="mt-2 text-sm text-muted">
            No open sessions yet. Start one — the voice teacher runs the lesson.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {classes.slice(0, 5).map((c) => {
              const t = classTimeRemaining(c);
              return (
                <li
                  key={c.code}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-[var(--glass-soft)] px-3 py-2 text-sm"
                >
                  <div>
                    <span className="font-semibold text-ink">{c.title}</span>
                    <span className="mt-0.5 block text-xs text-muted">
                      {c.teacherName} (voice bot) · Y{c.yearLevel} ·{" "}
                      <strong>{c.code}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`badge ${t.phase === "live" ? "badge-ok" : "badge-sky"}`}
                    >
                      {t.phase === "live" ? "LIVE" : "Soon"} · {t.label}
                    </span>
                    <Link href={`/game/live?code=${c.code}`} className="btn btn-sky text-xs">
                      Enter
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="callout callout-tip text-sm">
        <strong>How the game works:</strong> Finish any lesson quiz or weekly
        test → earn coins (+ character unlocks on high scores). CS Game-Build
        modules raise your shop level. Spend coins → items queue for Genesis.
        App classes use a teacher-style voice bot (Listen / Explain more) with
        timed steps: hook → model → practice → exit.
      </section>
    </div>
  );
}

function HubCard({
  href,
  title,
  blurb,
  icon,
}: {
  href: string;
  title: string;
  blurb: string;
  icon: string;
}) {
  return (
    <Link
      href={href}
      className="glass glass-interactive rounded-[var(--radius-lg)] p-5"
    >
      <div className="text-2xl">{icon}</div>
      <h3 className="mt-2 font-semibold text-ink">{title}</h3>
      <p className="mt-1 text-sm text-muted">{blurb}</p>
    </Link>
  );
}

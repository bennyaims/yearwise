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

/**
 * Curriculum Build Lab hub — coding, animation, and applied practice
 * that support the Australian Years 7–12 pathways (not a standalone game).
 */
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
        <p className="text-muted">Loading Build Lab…</p>
      </div>
    );
  }

  return (
    <div className="page-shell page-mid space-y-6">
      <Link href="/" className="link-back">
        ← Curriculum home
      </Link>

      <header className="glass-strong rounded-[var(--radius-xl)] p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
          Curriculum · Digital Technologies & applied practice
        </p>
        <h1 className="heading-display mt-2 text-3xl sm:text-4xl">
          Build Lab
        </h1>
        <p className="mt-3 max-w-2xl text-muted">
          Yearwise is a <strong className="text-ink">Years 7–12 curriculum</strong>.
          This lab is how Computer Science and animation are taught: students{" "}
          <strong className="text-ink">code working systems</strong> (scores,
          shops, simulations) and learn{" "}
          <strong className="text-ink">3D modelling &amp; animation</strong> in
          Blender — the same skills that power Genesis Lab and class demos. Progress
          rewards (coins) motivate practice across every subject, then feed applied
          biology projects.
        </p>
        <div className="mt-5 flex flex-wrap gap-4">
          <div className="rounded-xl bg-[var(--sky-soft)] px-4 py-3">
            <div className="text-[10px] uppercase text-soft">Practice coins</div>
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
          title="Guided classes"
          blurb="Timed lessons with a teacher-style voice that reads and explains."
          icon="🎙️"
        />
        <HubCard
          href="/game/code"
          title="Code & systems (CS)"
          blurb="Curriculum coding: loops, state, shops, sims — build real features."
          icon="💻"
        />
        <HubCard
          href="/game/blender"
          title="3D & animation"
          blurb="Blender track for worlds and characters — Digital Technologies."
          icon="🎨"
        />
        <HubCard
          href="/game/shop"
          title="Applied rewards shop"
          blurb="Spend practice coins on flora, fauna, characters for Genesis projects."
          icon="🛒"
        />
        <HubCard
          href="/labs/genesis"
          title="Genesis science lab"
          blurb="Biology & habitation curriculum — apply what you built."
          icon="🌍"
        />
        <HubCard
          href="/weekly-test"
          title="Weekly curriculum test"
          blurb="Assess learning; earn practice coins for applied projects."
          icon="⭐"
        />
      </div>

      <section className="glass rounded-[var(--radius-lg)] p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="heading-section text-lg">Open guided classes</h2>
          <Link href="/game/live" className="btn btn-primary text-xs">
            Start a class
          </Link>
        </div>
        {classes.length === 0 ? (
          <p className="mt-2 text-sm text-muted">
            No open sessions. Start one from the class catalog — the app teacher
            voice runs the curriculum script.
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
                      {c.teacherName} · Y{c.yearLevel} · {c.code}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`badge ${t.phase === "live" ? "badge-ok" : "badge-sky"}`}
                    >
                      {t.phase === "live" ? "LIVE" : "Soon"} · {t.label}
                    </span>
                    <Link
                      href={`/game/live?code=${c.code}`}
                      className="btn btn-sky text-xs"
                    >
                      Enter
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="callout callout-info text-sm">
        <strong className="text-ink">Curriculum first:</strong> core subjects
        (Maths, Science, English, History, Languages, Music, Chemistry) are the
        main pathways. Build Lab teaches{" "}
        <strong className="text-ink">coding and animation</strong> by having
        students implement and extend educational systems — not by replacing the
        curriculum with a commercial game.
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

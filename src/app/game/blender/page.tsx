"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BLENDER_LESSONS,
  youtubeEmbedUrl,
  youtubeWatchUrl,
  type BlenderLesson,
} from "@/content/blender-lessons";
import { grantTestCoins } from "@/lib/game-economy";

export default function BlenderTrackPage() {
  const [active, setActive] = useState<BlenderLesson>(BLENDER_LESSONS[0]!);
  const [msg, setMsg] = useState<string | null>(null);

  return (
    <div className="page-shell page-mid space-y-6">
      <Link href="/game" className="link-back">
        ← Build Lab
      </Link>

      <header className="glass-strong rounded-[var(--radius-xl)] p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
          Digital Technologies · 3D &amp; animation curriculum
        </p>
        <h1 className="heading-display mt-2 text-3xl">Blender 3D &amp; animation</h1>
        <p className="mt-2 max-w-2xl text-muted">
          Curriculum track for modelling and animation with free Blender and
          curated YouTube lessons. Teacher-style pause-and-practice. Skills
          support Genesis science worlds and the CS asset pipeline — animation
          taught as part of the learning program, not as a side game.
        </p>
        <a
          href="https://www.blender.org/download/"
          target="_blank"
          rel="noreferrer"
          className="btn btn-sky mt-4 text-sm"
        >
          Download Blender (free)
        </a>
      </header>

      <div className="flex flex-wrap gap-2">
        {BLENDER_LESSONS.map((l) => (
          <button
            key={l.id}
            type="button"
            className={`rounded-lg px-3 py-2 text-xs font-medium ${
              active.id === l.id
                ? "bg-[var(--sky-soft)] ring-1 ring-sky-400"
                : "bg-[var(--glass-soft)]"
            }`}
            onClick={() => setActive(l)}
          >
            Y{l.year} · {l.title}
          </button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <div className="glass rounded-[var(--radius-lg)] overflow-hidden">
          <div className="aspect-video w-full bg-black">
            <iframe
              title={active.youtubeTitle}
              src={youtubeEmbedUrl(active.youtubeId)}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="p-4">
            <p className="text-xs text-muted">
              {active.channel} ·{" "}
              <a
                href={youtubeWatchUrl(active.youtubeId)}
                target="_blank"
                rel="noreferrer"
                className="text-accent underline"
              >
                Open on YouTube
              </a>
            </p>
            <h2 className="mt-2 font-semibold text-ink">{active.youtubeTitle}</h2>
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass rounded-[var(--radius-lg)] p-4">
            <p className="text-[10px] font-semibold uppercase text-soft">
              Teacher approach · {active.minutes} min
            </p>
            <h3 className="mt-1 font-bold text-ink">{active.title}</h3>
            <p className="mt-2 text-sm text-muted">{active.teacherNotes}</p>
            <p className="mt-2 text-xs font-semibold text-ink">Objectives</p>
            <ul className="mt-1 list-disc pl-4 text-xs text-muted">
              {active.objectives.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
            <p className="mt-3 text-xs font-semibold text-ink">Practice</p>
            <p className="mt-1 text-xs text-muted">{active.practice}</p>
            <p className="mt-3 text-xs font-semibold text-ink">Links to game</p>
            <p className="mt-1 text-xs text-muted">{active.linksToGame}</p>
          </div>
          <div className="callout callout-tip text-sm">
            Pause the video every few minutes. Students copy the step, then
            continue. Portfolio = screenshots + short reflection.
          </div>
          <button
            type="button"
            className="btn btn-primary w-full text-sm"
            onClick={() => {
              const r = grantTestCoins({
                claimKey: `blender:${active.id}`,
                percent: 80,
                source: "guided",
                subject: "computerscience",
              });
              setMsg(r.message);
            }}
          >
            Mark practice complete · earn coins
          </button>
          {msg && (
            <p className="rounded-lg bg-emerald-500/15 px-3 py-2 text-sm text-ink">
              {msg}{" "}
              <Link href="/game/shop" className="text-accent underline">
                Shop →
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

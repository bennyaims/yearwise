"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CURRICULUM_SOFTWARE,
  SIGNUP_CORE_IDS,
  softwareForYear,
} from "@/content/curriculum-software";
import { youtubeEmbedUrl, youtubeWatchUrl } from "@/content/curriculum-videos";
import {
  isSignedUp,
  loadProfile,
  saveProfile,
  type StudentProfile,
} from "@/lib/student-profile";
import type { YearLevel } from "@/lib/types";

function SignupInner() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/";

  const existing = typeof window !== "undefined" ? loadProfile() : null;
  const [step, setStep] = useState(1);
  const [name, setName] = useState(existing?.name ?? "");
  const [yearLevel, setYearLevel] = useState<YearLevel>(
    existing?.yearLevel ?? 7,
  );
  const [email, setEmail] = useState(existing?.email ?? "");
  const [ready, setReady] = useState<Set<string>>(
    () => new Set(existing?.softwareReady ?? []),
  );
  const [activeTutorial, setActiveTutorial] = useState<{
    toolName: string;
    youtubeId: string;
    title: string;
  } | null>(null);

  const tools = useMemo(() => {
    const forYear = softwareForYear(yearLevel);
    // Ensure core pack order
    const coreSet = new Set<string>(SIGNUP_CORE_IDS);
    const ordered = SIGNUP_CORE_IDS.map((id) =>
      forYear.find((t) => t.id === id),
    ).filter(Boolean) as typeof forYear;
    const extras = forYear.filter((t) => !coreSet.has(t.id));
    return [...ordered, ...extras];
  }, [yearLevel]);

  function toggleReady(id: string) {
    setReady((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  }

  function finish(deferred: boolean) {
    const profile: StudentProfile = {
      name: name.trim() || "Student",
      yearLevel,
      email: email.trim() || undefined,
      signedUpAt: new Date().toISOString(),
      softwareReady: [...ready],
      deferredSoftware: deferred,
    };
    saveProfile(profile);
    router.replace(next.startsWith("/") ? next : "/");
  }

  // Already signed up → allow re-open tools step
  if (isSignedUp() && step === 1 && !params.get("edit")) {
    // fall through; user can still re-run setup via ?edit=1
  }

  return (
    <div className="page-shell page-mid space-y-6 pb-16">
      <header className="glass-strong rounded-[var(--radius-xl)] p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
          Yearwise curriculum · signup
        </p>
        <h1 className="heading-display mt-2 text-3xl sm:text-4xl">
          Get set for Years 7–12
        </h1>
        <p className="mt-3 max-w-2xl text-muted">
          Before lessons start, install the free programs your curriculum uses —
          especially <strong className="text-ink">GeoGebra</strong> for Maths and{" "}
          <strong className="text-ink">Blender</strong> for 3D animation. Each
          tool includes a starter tutorial; the same tutorials reappear inside
          matching lessons.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className={`badge ${step === 1 ? "badge-sky" : "badge-ok"}`}>
            1 · Profile
          </span>
          <span className={`badge ${step === 2 ? "badge-sky" : step > 2 ? "badge-ok" : ""}`}>
            2 · Software pack
          </span>
          <span className={`badge ${step === 3 ? "badge-sky" : ""}`}>
            3 · Tutorials &amp; start
          </span>
        </div>
      </header>

      {step === 1 && (
        <section className="glass rounded-[var(--radius-lg)] p-5 sm:p-6 space-y-4 max-w-lg">
          <h2 className="heading-section text-xl">Your details</h2>
          <label className="block text-xs text-soft">
            Preferred name
            <input
              className="mt-1 w-full rounded-lg border border-[var(--glass-border)] bg-[var(--glass)] px-3 py-2 text-ink"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="First name"
              autoComplete="name"
            />
          </label>
          <label className="block text-xs text-soft">
            Year level
            <select
              className="mt-1 w-full rounded-lg border border-[var(--glass-border)] bg-[var(--glass)] px-3 py-2 text-ink"
              value={yearLevel}
              onChange={(e) => setYearLevel(Number(e.target.value) as YearLevel)}
            >
              {[7, 8, 9, 10, 11, 12].map((y) => (
                <option key={y} value={y}>
                  Year {y}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-xs text-soft">
            Email (optional — stays on this device only)
            <input
              type="email"
              className="mt-1 w-full rounded-lg border border-[var(--glass-border)] bg-[var(--glass)] px-3 py-2 text-ink"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@school.edu.au"
            />
          </label>
          <p className="text-xs text-soft">
            Progress is saved in this browser. No password required for this
            school device signup.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            disabled={!name.trim()}
            onClick={() => setStep(2)}
          >
            Next · Software pack →
          </button>
        </section>
      )}

      {step === 2 && (
        <section className="space-y-4">
          <div className="glass rounded-[var(--radius-lg)] p-5">
            <h2 className="heading-section text-xl">
              Download your curriculum programs
            </h2>
            <p className="mt-2 text-sm text-muted">
              Free tools for Year {yearLevel}. Tick each when installed (or when
              you can open the web version). You can finish later from{" "}
              <strong className="text-ink">Tools</strong> in the menu.
            </p>
          </div>

          <ul className="space-y-3">
            {tools.map((tool) => (
              <li
                key={tool.id}
                className="glass rounded-[var(--radius-lg)] p-4 sm:p-5"
              >
                <div className="flex flex-wrap items-start gap-3">
                  <span className="text-3xl" aria-hidden>
                    {tool.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-ink">{tool.name}</h3>
                      <span className="badge badge-sky text-[10px]">
                        {tool.license}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted">{tool.purpose}</p>
                    <p className="mt-1 text-xs text-soft">{tool.platforms}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <a
                        href={tool.downloadUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-primary text-xs"
                      >
                        Download / open →
                      </a>
                      {tool.tutorials[0] && (
                        <button
                          type="button"
                          className="btn btn-sky text-xs"
                          onClick={() =>
                            setActiveTutorial({
                              toolName: tool.name,
                              youtubeId: tool.tutorials[0]!.youtubeId,
                              title: tool.tutorials[0]!.title,
                            })
                          }
                        >
                          Watch install tutorial
                        </button>
                      )}
                      <label className="flex items-center gap-2 text-xs text-muted px-2">
                        <input
                          type="checkbox"
                          checked={ready.has(tool.id)}
                          onChange={() => toggleReady(tool.id)}
                        />
                        Ready on this device
                      </label>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {activeTutorial && (
            <div className="glass-strong rounded-[var(--radius-xl)] overflow-hidden">
              <div className="flex items-center justify-between gap-2 p-3">
                <p className="text-sm font-semibold text-ink">
                  {activeTutorial.toolName}: {activeTutorial.title}
                </p>
                <button
                  type="button"
                  className="btn btn-ghost text-xs"
                  onClick={() => setActiveTutorial(null)}
                >
                  Close
                </button>
              </div>
              <div className="aspect-video w-full bg-black">
                <iframe
                  title={activeTutorial.title}
                  src={youtubeEmbedUrl(activeTutorial.youtubeId)}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <p className="p-3 text-xs text-muted">
                <a
                  href={youtubeWatchUrl(activeTutorial.youtubeId)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-accent underline"
                >
                  Open on YouTube
                </a>
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setStep(1)}
            >
              ← Back
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setStep(3)}
            >
              Next · Confirm →
            </button>
          </div>
        </section>
      )}

      {step === 3 && (
        <section className="glass rounded-[var(--radius-lg)] p-5 sm:p-6 space-y-4">
          <h2 className="heading-section text-xl">You&apos;re ready to learn</h2>
          <p className="text-muted">
            Hi <strong className="text-ink">{name.trim() || "Student"}</strong> —
            Year {yearLevel}. Lessons will include written teaching, guided
            checks, <strong className="text-ink">YouTube curriculum videos</strong>,
            and tool tutorials (GeoGebra in Maths, Blender in animation, and so
            on).
          </p>
          <ul className="list-disc pl-5 text-sm text-muted space-y-1">
            <li>
              Marked ready:{" "}
              <strong className="text-ink">
                {ready.size}/{tools.length}
              </strong>{" "}
              programs
            </li>
            <li>Re-open downloads anytime: Tools menu</li>
            <li>Fast track available when you score well on diagnostics</li>
          </ul>
          <div className="callout callout-tip text-sm">
            Priority installs: <strong>GeoGebra</strong> (Maths) and{" "}
            <strong>Blender</strong> (3D / Build Lab). Desmos works in the
            browser if GeoGebra is still downloading.
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => finish(false)}
            >
              Start curriculum →
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => finish(true)}
            >
              Start now · finish downloads later
            </button>
            <button
              type="button"
              className="btn btn-sky"
              onClick={() => setStep(2)}
            >
              ← Back to software list
            </button>
          </div>
        </section>
      )}

      <p className="text-center text-xs text-soft">
        Already set up?{" "}
        <Link href="/" className="text-accent underline">
          Home
        </Link>
        {" · "}
        <Link href="/tools" className="text-accent underline">
          Tools &amp; downloads
        </Link>
      </p>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="page-shell">
          <p className="text-muted">Loading signup…</p>
        </div>
      }
    >
      <SignupInner />
    </Suspense>
  );
}

"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { VoiceTeacher } from "@/components/game/VoiceTeacher";
import {
  CLASS_CATALOG,
  classTimeRemaining,
  currentStepIndex,
  ensureDemoClassesFromNow,
  getClassByCode,
  joinClass,
  listLiveClasses,
  pingPresence,
  presenceForClass,
  startAppClass,
  startFromCatalog,
  subjectLabel,
  type ClassCatalogItem,
  type ClassSubject,
  type LiveClassSession,
} from "@/lib/live-class";
import { stopSpeaking } from "@/lib/speech";
import { grantTestCoins } from "@/lib/game-economy";

const SUBJECTS: { id: ClassSubject; label: string }[] = [
  { id: "math", label: "Maths" },
  { id: "science", label: "Science" },
  { id: "chemistry", label: "Chemistry" },
  { id: "english", label: "English" },
  { id: "history", label: "History" },
  { id: "music", label: "Music" },
  { id: "computerscience", label: "Computer Science" },
  { id: "game-build", label: "Game Build (CS)" },
  { id: "blender", label: "Blender 3D" },
  { id: "genesis", label: "Genesis Lab" },
  { id: "language", label: "Languages" },
];

function LiveInner() {
  const params = useSearchParams();
  const initialCode = params.get("code") ?? "";
  const [name, setName] = useState("");
  const [session, setSession] = useState<LiveClassSession | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [classes, setClasses] = useState<LiveClassSession[]>([]);
  const [stepIdx, setStepIdx] = useState(0);
  const [followTimer, setFollowTimer] = useState(true);
  const [autoVoice, setAutoVoice] = useState(true);
  const [now, setNow] = useState(Date.now());
  const [subject, setSubject] = useState<ClassSubject>("science");
  const [yearLevel, setYearLevel] = useState(7);
  const [codeJoin, setCodeJoin] = useState(initialCode);
  const [exitCoins, setExitCoins] = useState<string | null>(null);

  useEffect(() => {
    ensureDemoClassesFromNow();
    setClasses(listLiveClasses().filter((c) => c.status !== "ended"));
    const t = window.setInterval(() => {
      setNow(Date.now());
      setClasses(listLiveClasses().filter((c) => c.status !== "ended"));
      if (session) {
        const s = getClassByCode(session.code);
        if (s) setSession(s);
        pingPresence(session.code, name || "Student");
      }
    }, 2000);
    return () => {
      clearInterval(t);
      stopSpeaking();
    };
  }, [session, name]);

  useEffect(() => {
    if (initialCode) setCodeJoin(initialCode);
  }, [initialCode]);

  // Auto-advance steps from class clock
  useEffect(() => {
    if (!session || !followTimer) return;
    setStepIdx(currentStepIndex(session, now));
  }, [session, now, followTimer]);

  const time = useMemo(
    () => (session ? classTimeRemaining(session) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [session, now],
  );

  const online = session ? presenceForClass(session.code) : [];
  const step = session?.lessonSteps[stepIdx];

  function beginSession(s: LiveClassSession) {
    stopSpeaking();
    setSession(s);
    setStepIdx(0);
    setFollowTimer(true);
    setExitCoins(null);
    setMsg(`Class started with ${s.teacherName}`);
    setClasses(listLiveClasses().filter((c) => c.status !== "ended"));
  }

  function startCustom() {
    const s = startAppClass({
      subject,
      yearLevel,
      studentName: name || "Student",
    });
    beginSession(s);
  }

  function startCatalog(item: ClassCatalogItem) {
    const s = startFromCatalog(item, name || "Student");
    beginSession(s);
  }

  function doJoin() {
    const r = joinClass(codeJoin, name || "Student");
    setMsg(r.message);
    if (r.ok && r.session) beginSession(r.session);
  }

  function leaveClass() {
    stopSpeaking();
    setSession(null);
    setMsg(null);
  }

  function claimExitCoins() {
    if (!session) return;
    const r = grantTestCoins({
      claimKey: `class-exit:${session.code}`,
      percent: 75,
      source: "guided",
      subject: session.subject === "game-build" ? "computerscience" : session.subject,
    });
    setExitCoins(r.message);
  }

  const practiceHref =
    session?.subject === "genesis"
      ? "/labs/genesis"
      : session?.subject === "blender"
        ? "/game/blender"
        : session?.subject === "game-build" ||
            session?.subject === "computerscience"
          ? "/game/code"
          : session?.subject === "math"
            ? "/patterns"
            : "/weekly-test";

  return (
    <div className="page-shell page-mid space-y-6">
      <Link href="/game" className="link-back">
        ← Game hub
      </Link>

      <header className="glass-strong rounded-[var(--radius-xl)] p-6">
        <h1 className="heading-display text-3xl">App classes</h1>
        <p className="mt-2 max-w-2xl text-muted">
          Classes run <strong className="text-ink">inside the app</strong> with
          a teacher-style <strong className="text-ink">voice bot</strong> that
          reads and explains each step. No human teacher needed — start any
          lesson now.
        </p>
      </header>

      {!session ? (
        <div className="space-y-6">
          <div className="glass rounded-[var(--radius-lg)] p-5 space-y-3 max-w-lg">
            <h2 className="heading-section text-lg">Start a class now</h2>
            <label className="block text-xs text-soft">
              Your name (optional)
              <input
                className="mt-1 w-full rounded-lg border border-[var(--glass-border)] bg-[var(--glass)] px-3 py-2 text-ink"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="First name"
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-xs text-soft">
                Subject
                <select
                  className="mt-1 w-full rounded-lg border border-[var(--glass-border)] bg-[var(--glass)] px-3 py-2 text-ink"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value as ClassSubject)}
                >
                  {SUBJECTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-xs text-soft">
                Year
                <select
                  className="mt-1 w-full rounded-lg border border-[var(--glass-border)] bg-[var(--glass)] px-3 py-2 text-ink"
                  value={yearLevel}
                  onChange={(e) => setYearLevel(Number(e.target.value))}
                >
                  {[7, 8, 9, 10, 11, 12].map((y) => (
                    <option key={y} value={y}>
                      Year {y}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <button type="button" className="btn btn-primary" onClick={startCustom}>
              ▶ Start with voice teacher
            </button>
            {msg && <p className="text-sm text-muted">{msg}</p>}
          </div>

          <section>
            <h2 className="heading-section text-lg">Lesson catalog</h2>
            <p className="mt-1 text-sm text-muted">
              Pick a ready lesson — the app runs the timer and voice teacher.
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {CLASS_CATALOG.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => startCatalog(item)}
                  className="glass glass-interactive rounded-[var(--radius-lg)] p-4 text-left"
                >
                  <div className="text-2xl">{item.icon}</div>
                  <div className="mt-2 font-semibold text-ink">{item.title}</div>
                  <p className="mt-1 text-sm text-muted">{item.blurb}</p>
                  <p className="mt-2 text-xs text-soft">
                    {item.durationMin} min · Y{item.yearLevel} ·{" "}
                    {subjectLabel(item.subject)}
                  </p>
                </button>
              ))}
            </div>
          </section>

          {classes.length > 0 && (
            <section className="glass rounded-[var(--radius-lg)] p-5">
              <h2 className="heading-section text-lg">Open sessions</h2>
              <p className="mt-1 text-xs text-muted">
                Optional: join a friend&apos;s code if they shared one.
              </p>
              <ul className="mt-3 space-y-2">
                {classes.map((c) => {
                  const t = classTimeRemaining(c);
                  return (
                    <li
                      key={c.code}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-[var(--glass-soft)] px-3 py-2 text-sm"
                    >
                      <div>
                        <span className="font-semibold text-ink">{c.title}</span>
                        <span className="block text-xs text-muted">
                          {c.teacherName} · {c.code} · {t.label}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="btn btn-sky text-xs"
                        onClick={() => {
                          setCodeJoin(c.code);
                          const r = joinClass(c.code, name || "Student");
                          if (r.ok && r.session) beginSession(r.session);
                          else setMsg(r.message);
                        }}
                      >
                        Enter
                      </button>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-4 flex flex-wrap gap-2 items-end">
                <label className="block text-xs text-soft flex-1 min-w-[8rem]">
                  Or enter code
                  <input
                    className="mt-1 w-full rounded-lg border border-[var(--glass-border)] bg-[var(--glass)] px-3 py-2 font-mono tracking-widest text-ink uppercase"
                    value={codeJoin}
                    onChange={(e) => setCodeJoin(e.target.value.toUpperCase())}
                    maxLength={6}
                    placeholder="ABC123"
                  />
                </label>
                <button type="button" className="btn btn-ghost text-sm" onClick={doJoin}>
                  Join code
                </button>
              </div>
            </section>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="glass-strong rounded-[var(--radius-xl)] p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs text-accent font-semibold uppercase tracking-wide">
                  {time?.phase === "live"
                    ? "● APP CLASS LIVE"
                    : time?.phase.toUpperCase()}{" "}
                  · voice teacher
                </p>
                <h2 className="heading-section text-xl mt-1">{session.title}</h2>
                <p className="text-sm text-muted">
                  {session.teacherName} · Y{session.yearLevel} ·{" "}
                  {subjectLabel(session.subject)} · code{" "}
                  <strong className="text-ink">{session.code}</strong>
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-ink">{time?.label}</p>
                <p className="text-xs text-muted">
                  {session.students.length} in session
                  {online.length > 0 ? ` · ${online.length} active` : ""}
                </p>
                <button
                  type="button"
                  className="btn btn-ghost text-xs mt-2"
                  onClick={leaveClass}
                >
                  Leave class
                </button>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {session.agenda.map((a) => (
                <span key={a} className="badge badge-sky">
                  {a}
                </span>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-3 text-xs">
              <label className="flex items-center gap-2 text-muted">
                <input
                  type="checkbox"
                  checked={followTimer}
                  onChange={(e) => setFollowTimer(e.target.checked)}
                />
                Auto-advance steps with timer
              </label>
              <label className="flex items-center gap-2 text-muted">
                <input
                  type="checkbox"
                  checked={autoVoice}
                  onChange={(e) => setAutoVoice(e.target.checked)}
                />
                Auto voice on each step
              </label>
            </div>
          </div>

          <VoiceTeacher
            name={session.teacherName}
            role="App teacher bot · reads and explains this lesson"
            boardText={step?.script ?? ""}
            voiceScript={step?.voiceScript}
            explainMore={step?.explainMore}
            autoPlay={autoVoice}
          />

          <div className="glass rounded-[var(--radius-lg)] p-5">
            <h3 className="font-semibold text-ink">Lesson board</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {session.lessonSteps.map((s, i) => (
                <button
                  key={s.title}
                  type="button"
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                    i === stepIdx
                      ? "bg-[var(--sky-soft)] ring-1 ring-sky-400"
                      : "bg-[var(--glass-soft)]"
                  }`}
                  onClick={() => {
                    setFollowTimer(false);
                    setStepIdx(i);
                  }}
                >
                  {i + 1}. {s.title}
                </button>
              ))}
            </div>
            {step && (
              <div className="mt-4 rounded-lg bg-[var(--glass-soft)] p-4">
                <p className="text-sm font-bold text-ink">{step.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted whitespace-pre-wrap">
                  {step.script}
                </p>
                {step.explainMore && (
                  <details className="mt-3 text-sm">
                    <summary className="cursor-pointer font-medium text-accent">
                      Show extra explanation
                    </summary>
                    <p className="mt-2 text-muted whitespace-pre-wrap">
                      {step.explainMore}
                    </p>
                  </details>
                )}
              </div>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                className="btn btn-ghost text-xs"
                disabled={stepIdx <= 0}
                onClick={() => {
                  setFollowTimer(false);
                  setStepIdx((i) => Math.max(0, i - 1));
                }}
              >
                ← Prev
              </button>
              <button
                type="button"
                className="btn btn-sky text-xs"
                disabled={stepIdx >= session.lessonSteps.length - 1}
                onClick={() => {
                  setFollowTimer(false);
                  setStepIdx((i) =>
                    Math.min(session.lessonSteps.length - 1, i + 1),
                  );
                }}
              >
                Next step →
              </button>
              <Link href={practiceHref} className="btn btn-primary text-xs">
                Practice / quiz (coins)
              </Link>
              <button
                type="button"
                className="btn btn-ghost text-xs"
                onClick={claimExitCoins}
              >
                Exit ticket · coins
              </button>
            </div>
            {exitCoins && (
              <p className="mt-3 text-sm text-ink rounded-lg bg-emerald-500/15 px-3 py-2">
                {exitCoins}{" "}
                <Link href="/game/shop" className="text-accent underline">
                  Shop →
                </Link>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function LiveClassPage() {
  return (
    <Suspense fallback={<div className="page-shell">Loading class…</div>}>
      <LiveInner />
    </Suspense>
  );
}

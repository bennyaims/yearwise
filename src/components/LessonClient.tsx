"use client";

import { useEffect, useMemo, useState } from "react";
import { AudioPhrases } from "@/components/AudioPhrases";
import { CompletionPanel } from "@/components/CompletionPanel";
import { ContentBlocks } from "@/components/ContentBlocks";
import { GuidedLearning } from "@/components/GuidedLearning";
import { LessonVideos } from "@/components/LessonVideos";
import { ListeningPractice } from "@/components/ListeningPractice";
import { Quiz } from "@/components/Quiz";
import { CELLS_LEARN_PATH } from "@/content/cells-learn-path";
import {
  getAudioPack,
  tierFromLessonId,
} from "@/content/language-audio";
import { enrichLesson, videosForMode } from "@/lib/lesson-enrich";
import { getNextLesson } from "@/lib/pathway";
import {
  lessonKey,
  loadProgress,
  markLessonComplete,
} from "@/lib/progress";
import {
  grantLessonRewards,
  type RewardEvent,
} from "@/lib/rewards";
import {
  BLOCK_MINUTES,
  getActiveBlock,
  saveSession,
  dateKey,
  sessionsToday,
  loadSessions,
} from "@/lib/schedule";
import {
  diagnosticPassed,
  isMastery,
  loadSelfPace,
  paceLabel,
  recordQuizResult,
  setPreferFastTrack,
  type SelfPaceState,
} from "@/lib/self-pace";
import type { AudioPhrase, LearnBeat, Lesson, ListeningItem } from "@/lib/types";

type Props = {
  lesson: Lesson;
};

type PaceMode = "guided" | "depth" | "fast";

function resolveLearnPath(lesson: Lesson): LearnBeat[] {
  if (lesson.learnPath && lesson.learnPath.length > 0) return lesson.learnPath;
  if (lesson.id === "cells-as-units") return CELLS_LEARN_PATH;
  return [];
}

export function LessonClient({ lesson }: Props) {
  const enriched = useMemo(() => enrichLesson(lesson), [lesson]);
  const [done, setDone] = useState(false);
  const [reward, setReward] = useState<RewardEvent | null>(null);
  const [showCompletion, setShowCompletion] = useState(false);
  const [pathDone, setPathDone] = useState(false);
  const [showReference, setShowReference] = useState(false);
  const [pace, setPace] = useState<SelfPaceState | null>(null);
  const [mode, setMode] = useState<PaceMode>("guided");
  const [fastUnlocked, setFastUnlocked] = useState(false);
  const [showDiagnostic, setShowDiagnostic] = useState(false);
  const [masteryNote, setMasteryNote] = useState<string | null>(null);

  const key = lessonKey(
    lesson.year,
    lesson.subject,
    lesson.id,
    lesson.language,
  );

  const learnPath = useMemo(() => resolveLearnPath(lesson), [lesson]);
  const hasGuidedPath = learnPath.length > 0;

  const nextLesson = useMemo(
    () =>
      getNextLesson(
        lesson.year,
        lesson.subject,
        lesson.id,
        lesson.language,
      ),
    [lesson],
  );

  const { phrases, listening } = useMemo(() => {
    if (lesson.subject !== "language" || !lesson.language) {
      return {
        phrases: lesson.audioPhrases ?? [],
        listening: lesson.listening ?? [],
      };
    }
    const tier = tierFromLessonId(lesson.id);
    const pack = getAudioPack(lesson.language, tier);
    const phrases: AudioPhrase[] =
      lesson.audioPhrases && lesson.audioPhrases.length > 0
        ? lesson.audioPhrases
        : pack.phrases;
    const listening: ListeningItem[] =
      lesson.listening && lesson.listening.length > 0
        ? lesson.listening
        : pack.listening;
    return { phrases, listening };
  }, [lesson]);

  const displayVideos = useMemo(() => {
    if (mode === "depth") return videosForMode(enriched.resolvedVideos, "depth");
    if (mode === "fast") return videosForMode(enriched.resolvedVideos, "fast");
    return videosForMode(enriched.resolvedVideos, "core");
  }, [enriched.resolvedVideos, mode]);

  const contentBlocks = useMemo(() => {
    if (mode === "depth") return enriched.fullContent;
    return enriched.coreContent;
  }, [enriched, mode]);

  useEffect(() => {
    const map = loadProgress();
    const isDone = Boolean(map[key]?.completed);
    setDone(isDone);
    if (isDone && !hasGuidedPath) {
      setShowCompletion(true);
    }
    if (hasGuidedPath) {
      setShowCompletion(false);
      const taught = sessionStorage.getItem(`taught:${key}`);
      if (taught === "1") setPathDone(true);
      if (taught === "fast") {
        setPathDone(true);
        setFastUnlocked(true);
        setMode("fast");
      }
    }
    const sp = loadSelfPace();
    setPace(sp);
    if (sp.preferFastTrack && hasGuidedPath) {
      setMode("fast");
      setShowDiagnostic(true);
    }
  }, [key, hasGuidedPath]);

  function onPathComplete() {
    setPathDone(true);
    try {
      sessionStorage.setItem(`taught:${key}`, "1");
    } catch {
      /* ignore */
    }
  }

  function unlockFastTrack() {
    setFastUnlocked(true);
    setPathDone(true);
    setMode("fast");
    setShowDiagnostic(false);
    try {
      sessionStorage.setItem(`taught:${key}`, "fast");
    } catch {
      /* ignore */
    }
  }

  function complete(quizScore?: number) {
    if (hasGuidedPath && !pathDone && !fastUnlocked) return;
    const wasDone = done;
    markLessonComplete(key, quizScore);
    setDone(true);
    setShowCompletion(true);

    const active = getActiveBlock();
    saveSession({
      dateKey: dateKey(),
      blockId: active?.id ?? `flex-${Date.now()}`,
      lessonKey: key,
      completedAt: new Date().toISOString(),
      minutes: lesson.estimatedMinutes || BLOCK_MINUTES,
    });

    if (!wasDone) {
      const progress = loadProgress();
      const allCompleted = Object.values(progress).filter(
        (p) => p.completed,
      ).length;
      const blocksToday = new Set(sessionsToday().map((s) => s.blockId)).size;
      const days = new Set(loadSessions().map((s) => s.dateKey)).size;
      const isPattern =
        lesson.id.includes("pattern") ||
        Boolean(lesson.strand?.toLowerCase().includes("pattern"));

      const percent = quizScore ?? 70;
      const accelerated = fastUnlocked || mode === "fast";
      const paceState = recordQuizResult(percent, { accelerated });
      setPace(paceState);

      if (isMastery(percent)) {
        setMasteryNote(
          nextLesson
            ? `Mastery ${percent}% — you can move to the next lesson now and progress faster.`
            : `Mastery ${percent}% — strong finish on this pathway block.`,
        );
      }

      const event = grantLessonRewards({
        lessonsCompletedTotal: allCompleted,
        isPatternLesson: isPattern,
        blocksToday,
        distinctStudyDays: days,
        languageFluentExit:
          lesson.subject === "language" &&
          lesson.id.includes("fluency-exit"),
        csAiBuilder:
          lesson.subject === "computerscience" &&
          lesson.id.includes("build-ai-system"),
        csAiDefender:
          lesson.subject === "computerscience" &&
          (lesson.id.includes("defend-dominance") ||
            lesson.id.includes("cs-y12-exit")),
        claimKey: `lesson:${key}`,
        quizPercent: percent,
        subject: lesson.subject,
      });
      setReward(event);
    }
  }

  function onDiagnosticComplete(percent: number) {
    if (diagnosticPassed(percent)) {
      unlockFastTrack();
      setMasteryNote(
        `Diagnostic ${percent}% — Fast track unlocked. Skip the long guided path and prove mastery on the full quiz.`,
      );
    } else {
      setShowDiagnostic(false);
      setMode("guided");
      setMasteryNote(
        `Diagnostic ${percent}% — use the guided path so every idea is solid before the quiz.`,
      );
    }
  }

  const pathwayEnd = done && !nextLesson;
  const isLanguage = lesson.subject === "language" && lesson.language;
  const quizUnlocked =
    !hasGuidedPath || pathDone || fastUnlocked || mode === "fast";

  // Fast mode without diagnostic pass still needs unlock if guided exists
  const effectiveQuizUnlocked =
    quizUnlocked &&
    (mode !== "fast" ||
      fastUnlocked ||
      !hasGuidedPath ||
      pathDone ||
      !showDiagnostic);

  return (
    <div className="space-y-6 sm:space-y-8">
      {!showCompletion && (
        <>
          {/* Self-pace + depth controls */}
          <div className="glass-strong rounded-[var(--radius-xl)] p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                  Curriculum lesson · self-paced options
                </p>
                <p className="mt-1 text-sm text-muted">
                  {pace ? paceLabel(pace) : "Loading pace…"}
                  {pace && pace.masteryCount > 0
                    ? ` · ${pace.masteryCount} mastery finishes`
                    : ""}
                </p>
              </div>
              <label className="flex items-center gap-2 text-xs text-muted">
                <input
                  type="checkbox"
                  checked={Boolean(pace?.preferFastTrack)}
                  onChange={(e) => {
                    const s = setPreferFastTrack(e.target.checked);
                    setPace(s);
                    if (e.target.checked) {
                      setMode("fast");
                      setShowDiagnostic(true);
                    }
                  }}
                />
                Prefer Fast track when ready
              </label>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                  mode === "guided"
                    ? "bg-[var(--sky-soft)] ring-1 ring-sky-400"
                    : "bg-[var(--glass-soft)]"
                }`}
                onClick={() => {
                  setMode("guided");
                  setShowDiagnostic(false);
                }}
              >
                Guided (standard)
              </button>
              <button
                type="button"
                className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                  mode === "depth"
                    ? "bg-[var(--sky-soft)] ring-1 ring-sky-400"
                    : "bg-[var(--glass-soft)]"
                }`}
                onClick={() => setMode("depth")}
              >
                In-depth (+ videos)
              </button>
              <button
                type="button"
                className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                  mode === "fast"
                    ? "bg-[var(--sky-soft)] ring-1 ring-sky-400"
                    : "bg-[var(--glass-soft)]"
                }`}
                onClick={() => {
                  setMode("fast");
                  if (hasGuidedPath && !pathDone && !fastUnlocked) {
                    setShowDiagnostic(true);
                  }
                }}
              >
                Fast track (self-learn)
              </button>
            </div>
            <p className="mt-3 text-xs text-soft">
              Strong scores unlock faster progress. Struggling? Stay on Guided
              and use the YouTube support videos. In-depth adds extra curriculum
              explanation.
            </p>
          </div>

          {masteryNote && (
            <div className="callout callout-tip text-sm">{masteryNote}</div>
          )}

          {hasGuidedPath && mode === "guided" && (
            <div className="callout callout-info">
              <strong>How this lesson works:</strong> one idea at a time — pass
              each check before the next unlocks. The quiz stays locked until
              the learning path is done (unless you pass a Fast-track
              diagnostic).
            </div>
          )}

          {mode === "fast" &&
            hasGuidedPath &&
            !fastUnlocked &&
            !pathDone &&
            showDiagnostic &&
            enriched.resolvedDiagnostic.length > 0 && (
              <section className="glass rounded-[var(--radius-xl)] p-5 space-y-3">
                <h2 className="heading-section text-lg">
                  Fast-track diagnostic
                </h2>
                <p className="text-sm text-muted">
                  Already know this? Score {80}%+ on a short check to skip the
                  full guided path and jump to the main quiz. If not, we&apos;ll
                  send you back to Guided teaching.
                </p>
                <Quiz
                  questions={enriched.resolvedDiagnostic}
                  onComplete={onDiagnosticComplete}
                />
                <button
                  type="button"
                  className="btn btn-ghost text-xs"
                  onClick={() => {
                    setMode("guided");
                    setShowDiagnostic(false);
                  }}
                >
                  Cancel — use guided path
                </button>
              </section>
            )}

          {mode === "fast" &&
            hasGuidedPath &&
            !fastUnlocked &&
            !pathDone &&
            !showDiagnostic && (
              <div className="callout callout-warning text-sm">
                Fast track needs a diagnostic pass.{" "}
                <button
                  type="button"
                  className="text-accent underline"
                  onClick={() => setShowDiagnostic(true)}
                >
                  Take diagnostic
                </button>{" "}
                or switch to Guided.
              </div>
            )}

          {hasGuidedPath &&
            !pathDone &&
            mode === "guided" && (
              <GuidedLearning
                beats={learnPath}
                lessonTitle={lesson.title}
                onPathComplete={onPathComplete}
              />
            )}

          {hasGuidedPath && pathDone && mode !== "fast" && (
            <div className="callout callout-tip">
              Learning path complete — quiz unlocked. Open reference notes or
              In-depth for more videos and detail.
            </div>
          )}

          {fastUnlocked && (
            <div className="callout callout-tip">
              Fast track active — full quiz unlocked. Optional videos below if
              you want a quick refresh.
            </div>
          )}

          {/* Core / depth written curriculum */}
          {(!hasGuidedPath ||
            showReference ||
            pathDone ||
            mode === "depth" ||
            mode === "fast") && (
            <>
              {hasGuidedPath && mode === "guided" && (
                <button
                  type="button"
                  className="btn btn-ghost btn-chip"
                  onClick={() => setShowReference((v) => !v)}
                >
                  {showReference ? "Hide" : "Show"} full reference notes
                </button>
              )}
              {(mode === "depth" ||
                mode === "fast" ||
                !hasGuidedPath ||
                showReference ||
                pathDone) && (
                <ContentBlocks
                  blocks={contentBlocks}
                  language={lesson.language}
                />
              )}
            </>
          )}

          {displayVideos.length > 0 &&
            (mode === "depth" ||
              mode === "fast" ||
              !hasGuidedPath ||
              pathDone ||
              showReference) && (
              <LessonVideos
                videos={displayVideos}
                title={
                  mode === "depth"
                    ? "In-depth curriculum videos"
                    : mode === "fast"
                      ? "Quick support videos"
                      : "Curriculum videos"
                }
              />
            )}

          {isLanguage && phrases.length > 0 && (
            <AudioPhrases phrases={phrases} language={lesson.language!} />
          )}

          {isLanguage && listening.length > 0 && (
            <ListeningPractice
              items={listening}
              language={lesson.language!}
            />
          )}

          {lesson.quiz && lesson.quiz.length > 0 && (
            <>
              {!effectiveQuizUnlocked ? (
                <div className="glass rounded-[var(--radius-xl)] p-5 text-center">
                  <p className="font-semibold text-ink">Quiz locked</p>
                  <p className="mt-2 text-sm text-muted">
                    Finish the guided path, or pass the Fast-track diagnostic
                    (80%+) if you already know this topic.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-muted">
                    Score <strong className="text-ink">85%+</strong> for mastery
                    — you can move on faster and keep Fast track for later
                    lessons.
                  </p>
                  <Quiz
                    questions={lesson.quiz}
                    onComplete={(score) => complete(score)}
                  />
                </div>
              )}
            </>
          )}

          <div className="glass flex flex-col gap-3 rounded-[var(--radius-lg)] p-4 sm:flex-row sm:flex-wrap sm:items-center sm:p-5">
            <button
              type="button"
              onClick={() => complete()}
              disabled={hasGuidedPath && !pathDone && !fastUnlocked}
              className="btn btn-ok"
            >
              Mark {lesson.estimatedMinutes || 30}-min block complete
            </button>
            <span className="text-sm text-muted">
              {hasGuidedPath && !pathDone && !fastUnlocked
                ? "Complete guided path or Fast-track diagnostic first."
                : isLanguage
                  ? "Listen, then mark complete."
                  : "Finish the quiz when ready, then mark complete."}
            </span>
          </div>

          {hasGuidedPath && pathDone && (
            <button
              type="button"
              className="btn btn-ghost btn-chip"
              onClick={() => {
                setPathDone(false);
                setFastUnlocked(false);
                try {
                  sessionStorage.removeItem(`taught:${key}`);
                } catch {
                  /* ignore */
                }
              }}
            >
              Restart guided learning from step 1
            </button>
          )}
        </>
      )}

      {showCompletion && (
        <>
          {masteryNote && (
            <div className="callout callout-tip text-sm">{masteryNote}</div>
          )}
          <CompletionPanel
            lesson={lesson}
            nextLesson={nextLesson}
            reward={reward}
            subjectComplete={pathwayEnd}
          />
          <button
            type="button"
            className="btn btn-ghost btn-chip"
            onClick={() => {
              setShowCompletion(false);
              if (hasGuidedPath) {
                setPathDone(false);
                setFastUnlocked(false);
              }
            }}
          >
            {hasGuidedPath
              ? "Retrain this lesson (guided path)"
              : "Review lesson again"}
          </button>
        </>
      )}
    </div>
  );
}

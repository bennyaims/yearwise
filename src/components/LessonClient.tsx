"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AudioPhrases } from "@/components/AudioPhrases";
import { CompletionPanel } from "@/components/CompletionPanel";
import { ContentBlocks } from "@/components/ContentBlocks";
import { GuidedLearning } from "@/components/GuidedLearning";
import { CsPathwayBadge } from "@/components/CsPathwayPicker";
import { LessonSoftware } from "@/components/LessonSoftware";
import { LessonVideos } from "@/components/LessonVideos";
import { ListeningPractice } from "@/components/ListeningPractice";
import { MathFunBanner } from "@/components/MathFunBanner";
import { Quiz } from "@/components/Quiz";
import { CELLS_LEARN_PATH } from "@/content/cells-learn-path";
import {
  getAudioPack,
  tierFromLessonId,
} from "@/content/language-audio";
import { enrichLesson, videosForMode } from "@/lib/lesson-enrich";
import { getNextLesson } from "@/lib/pathway";
import {
  isLessonUnlocked,
  YEAR_PASS_OVERALL,
} from "@/lib/progression";
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
import type { AudioPhrase, LearnBeat, Lesson, ListeningItem } from "@/lib/types";

type Props = {
  lesson: Lesson;
};

type DepthMode = "core" | "depth";

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
  const [depthMode, setDepthMode] = useState<DepthMode>("core");
  const [lastScore, setLastScore] = useState<number | null>(null);
  const [lock, setLock] = useState<{ unlocked: boolean; reason?: string }>({
    unlocked: true,
  });

  const key = lessonKey(
    lesson.year,
    lesson.subject,
    lesson.id,
    lesson.language,
  );

  const learnPath = useMemo(() => resolveLearnPath(lesson), [lesson]);
  const hasGuidedPath = learnPath.length > 0;
  const hasQuiz = Boolean(lesson.quiz && lesson.quiz.length > 0);

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

  const displayVideos = useMemo(
    () =>
      videosForMode(
        enriched.resolvedVideos,
        depthMode === "depth" ? "depth" : "core",
      ),
    [enriched.resolvedVideos, depthMode],
  );

  const contentBlocks = useMemo(
    () =>
      depthMode === "depth" ? enriched.fullContent : enriched.coreContent,
    [enriched, depthMode],
  );

  useEffect(() => {
    const map = loadProgress();
    const unlock = isLessonUnlocked(
      lesson.year,
      lesson.subject,
      lesson.id,
      lesson.language,
      map,
    );
    setLock(unlock);

    const isDone = Boolean(map[key]?.completed && map[key]?.quizScore != null);
    setDone(isDone);
    if (map[key]?.quizScore != null) setLastScore(map[key]!.quizScore!);
    if (isDone && !hasGuidedPath) {
      setShowCompletion(true);
    }
    if (hasGuidedPath) {
      setShowCompletion(false);
      const taught = sessionStorage.getItem(`taught:${key}`);
      if (taught === "1") setPathDone(true);
    }
  }, [key, hasGuidedPath, lesson]);

  function onPathComplete() {
    setPathDone(true);
    try {
      sessionStorage.setItem(`taught:${key}`, "1");
    } catch {
      /* ignore */
    }
  }

  /** Only after quiz — no skip, no mark-complete without test */
  function completeFromQuiz(quizScore: number) {
    if (hasGuidedPath && !pathDone) return;
    if (!lock.unlocked) return;

    const wasDone = done;
    markLessonComplete(key, quizScore);
    setDone(true);
    setLastScore(quizScore);
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
        quizPercent: quizScore,
        subject: lesson.subject,
      });
      setReward(event);
    }
  }

  const pathwayEnd = done && !nextLesson;
  const isLanguage = lesson.subject === "language" && lesson.language;
  const quizUnlocked = !hasGuidedPath || pathDone;

  if (!lock.unlocked) {
    return (
      <div className="space-y-4">
        <div className="callout callout-warning">
          <p className="font-semibold text-ink">Lesson locked</p>
          <p className="mt-2 text-sm text-muted">
            {lock.reason ??
              "Complete previous lesson quizzes in order. Skipping is not allowed."}
          </p>
        </div>
        <Link
          href={
            lesson.language
              ? `/year/${lesson.year}/language/${lesson.language}`
              : `/year/${lesson.year}/${lesson.subject}`
          }
          className="btn btn-primary"
        >
          ← Back to subject pathway
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {!showCompletion && (
        <>
          <div className="glass-strong rounded-[var(--radius-xl)] p-4 sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
              Curriculum rules · no skip
            </p>
            <p className="mt-2 text-sm text-muted">
              Finish the guided path (if any), then sit the{" "}
              <strong className="text-ink">full lesson quiz</strong> to
              progress. There is no skip. Year exam can be sat early, but moving
              year requires <strong className="text-ink">{YEAR_PASS_OVERALL}%
              overall</strong> across all subjects plus the year exam.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                  depthMode === "core"
                    ? "bg-[var(--sky-soft)] ring-1 ring-sky-400"
                    : "bg-[var(--glass-soft)]"
                }`}
                onClick={() => setDepthMode("core")}
              >
                Core materials
              </button>
              <button
                type="button"
                className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                  depthMode === "depth"
                    ? "bg-[var(--sky-soft)] ring-1 ring-sky-400"
                    : "bg-[var(--glass-soft)]"
                }`}
                onClick={() => setDepthMode("depth")}
              >
                In-depth + videos
              </button>
            </div>
          </div>

          <LessonSoftware subject={lesson.subject} year={lesson.year} />

          {lesson.subject === "math" && <MathFunBanner year={lesson.year} />}

          {lesson.subject === "computerscience" && (
            <CsPathwayBadge year={lesson.year} />
          )}

          {hasGuidedPath && (
            <div className="callout callout-info">
              <strong>How this lesson works:</strong> learn one idea at a time
              and pass each check. The quiz unlocks only after the full path —
              then you must sit the quiz to unlock the next lesson.
            </div>
          )}

          {hasGuidedPath && !pathDone && (
            <GuidedLearning
              beats={learnPath}
              lessonTitle={lesson.title}
              onPathComplete={onPathComplete}
            />
          )}

          {hasGuidedPath && pathDone && (
            <div className="callout callout-tip">
              Learning path complete — sit the quiz below to record your score
              and unlock the next lesson.
            </div>
          )}

          {(!hasGuidedPath || showReference || pathDone) && (
            <>
              {hasGuidedPath && (
                <button
                  type="button"
                  className="btn btn-ghost btn-chip"
                  onClick={() => setShowReference((v) => !v)}
                >
                  {showReference ? "Hide" : "Show"} full reference notes
                </button>
              )}
              {(!hasGuidedPath || showReference || pathDone) && (
                <ContentBlocks
                  blocks={contentBlocks}
                  language={lesson.language}
                />
              )}
            </>
          )}

          {displayVideos.length > 0 &&
            (!hasGuidedPath || pathDone || showReference || depthMode === "depth") && (
              <LessonVideos
                videos={displayVideos}
                title={
                  depthMode === "depth"
                    ? "In-depth curriculum videos"
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

          {hasQuiz ? (
            <>
              {!quizUnlocked ? (
                <div className="glass rounded-[var(--radius-xl)] p-5 text-center">
                  <p className="font-semibold text-ink">Quiz locked</p>
                  <p className="mt-2 text-sm text-muted">
                    Complete every guided step first. No skipping to the test.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-muted">
                    You must finish this quiz to progress. Your score counts
                    toward the <strong className="text-ink">{YEAR_PASS_OVERALL}%
                    overall</strong> required across all subjects.
                  </p>
                  <Quiz
                    questions={lesson.quiz!}
                    onComplete={(score) => completeFromQuiz(score)}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="callout callout-warning text-sm">
              This block has no quiz bank yet — open the next numbered lesson
              once available, or contact your curriculum admin. Progression
              still requires tests on all assessed lessons.
            </div>
          )}

          {hasGuidedPath && pathDone && (
            <button
              type="button"
              className="btn btn-ghost btn-chip"
              onClick={() => {
                setPathDone(false);
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
          {lastScore != null && (
            <div className="callout callout-tip text-sm">
              Quiz recorded: <strong className="text-ink">{lastScore}%</strong>.
              Next lesson unlocks only after this score is saved (done). Aim for
              high averages — year progress needs {YEAR_PASS_OVERALL}% overall
              in all subjects.
            </div>
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
              if (hasGuidedPath) setPathDone(false);
            }}
          >
            Review lesson materials again
          </button>
        </>
      )}
    </div>
  );
}

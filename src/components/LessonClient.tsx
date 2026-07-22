"use client";

import { useEffect, useMemo, useState } from "react";
import { AudioPhrases } from "@/components/AudioPhrases";
import { CompletionPanel } from "@/components/CompletionPanel";
import { ContentBlocks } from "@/components/ContentBlocks";
import { GuidedLearning } from "@/components/GuidedLearning";
import { ListeningPractice } from "@/components/ListeningPractice";
import { Quiz } from "@/components/Quiz";
import { CELLS_LEARN_PATH } from "@/content/cells-learn-path";
import {
  getAudioPack,
  tierFromLessonId,
} from "@/content/language-audio";
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
import type { AudioPhrase, LearnBeat, Lesson, ListeningItem } from "@/lib/types";

type Props = {
  lesson: Lesson;
};

function resolveLearnPath(lesson: Lesson): LearnBeat[] {
  if (lesson.learnPath && lesson.learnPath.length > 0) return lesson.learnPath;
  // Hard-wire deep path for cells so it always teaches properly
  if (lesson.id === "cells-as-units") return CELLS_LEARN_PATH;
  return [];
}

export function LessonClient({ lesson }: Props) {
  const [done, setDone] = useState(false);
  const [reward, setReward] = useState<RewardEvent | null>(null);
  const [showCompletion, setShowCompletion] = useState(false);
  const [pathDone, setPathDone] = useState(false);
  const [showReference, setShowReference] = useState(false);

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

  useEffect(() => {
    const map = loadProgress();
    const isDone = Boolean(map[key]?.completed);
    setDone(isDone);
    // Do NOT auto-open completion if they need to retrain — only if done
    // and they haven't started guided path this session
    if (isDone && !hasGuidedPath) {
      setShowCompletion(true);
    }
    // Guided lessons: start teaching even if previously marked complete
    // (old short version may have been completed without real learning)
    if (hasGuidedPath) {
      setShowCompletion(false);
      const taught = sessionStorage.getItem(`taught:${key}`);
      if (taught === "1") setPathDone(true);
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

  function complete(quizScore?: number) {
    if (hasGuidedPath && !pathDone) return;
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
        // Game Mode: every subject quiz → coins + character unlocks
        claimKey: `lesson:${key}`,
        quizPercent: quizScore ?? 70,
        subject: lesson.subject,
      });
      setReward(event);
    }
  }

  const pathwayEnd = done && !nextLesson;
  const isLanguage = lesson.subject === "language" && lesson.language;
  const quizUnlocked = !hasGuidedPath || pathDone;

  return (
    <div className="space-y-6 sm:space-y-8">
      {!showCompletion && (
        <>
          {hasGuidedPath && (
            <div className="callout callout-info">
              <strong>How this lesson works:</strong> you learn one idea at a
              time and must pass a check before the next idea unlocks. The quiz
              stays locked until the full learning path is done — so every
              question is something you already proved you understand.
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
              Learning path complete — quiz unlocked below. You can still open
              the reference notes if you want a full reread.
            </div>
          )}

          {/* Reference notes: optional for guided lessons; primary for others */}
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
              {(!hasGuidedPath || showReference) && (
                <ContentBlocks
                  blocks={lesson.content}
                  language={lesson.language}
                />
              )}
            </>
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
              {!quizUnlocked ? (
                <div className="glass rounded-[var(--radius-xl)] p-5 text-center">
                  <p className="font-semibold text-ink">Quiz locked</p>
                  <p className="mt-2 text-sm text-muted">
                    Finish every step of the guided learning path above. Each
                    check teaches the exact ideas in the quiz (including
                    “which organelle performs photosynthesis?”).
                  </p>
                </div>
              ) : (
                <Quiz
                  questions={lesson.quiz}
                  onComplete={(score) => complete(score)}
                />
              )}
            </>
          )}

          <div className="glass flex flex-col gap-3 rounded-[var(--radius-lg)] p-4 sm:flex-row sm:flex-wrap sm:items-center sm:p-5">
            <button
              type="button"
              onClick={() => complete()}
              disabled={hasGuidedPath && !pathDone}
              className="btn btn-ok"
            >
              Mark {lesson.estimatedMinutes || 30}-min block complete
            </button>
            <span className="text-sm text-muted">
              {hasGuidedPath && !pathDone
                ? "Complete the guided path (and ideally the quiz) first."
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
            {hasGuidedPath
              ? "Retrain this lesson (guided path)"
              : "Review lesson again"}
          </button>
        </>
      )}
    </div>
  );
}

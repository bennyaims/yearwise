"use client";

import { useEffect, useState } from "react";
import { LessonCard } from "@/components/LessonCard";
import { isLessonTestDone, isLessonUnlocked } from "@/lib/progression";
import { lessonKey, loadProgress } from "@/lib/progress";
import type { Lesson, ProgressMap, SubjectId, YearLevel } from "@/lib/types";

type Props = {
  lessons: Lesson[];
  year: number;
  subject: string;
  language?: string;
};

export function SubjectLessonList({ lessons, year, subject, language }: Props) {
  const [progress, setProgress] = useState<ProgressMap>({});

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  if (lessons.length === 0) {
    return (
      <p className="glass rounded-[var(--radius-lg)] border-dashed p-8 text-center text-muted">
        Lessons for this year are coming soon. The structure is ready to expand.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted">
        Lessons unlock in order. Finish each quiz to open the next — no
        skipping.
      </p>
      {lessons.map((lesson) => {
        const key = lessonKey(year, subject, lesson.id, language);
        const entry = progress[key];
        const unlock = isLessonUnlocked(
          year as YearLevel,
          subject as SubjectId,
          lesson.id,
          language as Lesson["language"],
          progress,
        );
        const href = language
          ? `/year/${year}/language/${language}/${lesson.id}`
          : `/year/${year}/${subject}/${lesson.id}`;
        const completed = isLessonTestDone(progress, key);

        if (!unlock.unlocked) {
          return (
            <div
              key={lesson.id}
              className="glass flex items-start gap-3 rounded-[var(--radius-md)] p-4 opacity-60"
            >
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full glass-soft text-sm text-muted">
                🔒
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-ink">{lesson.title}</h3>
                <p className="mt-1 text-sm text-muted">{lesson.summary}</p>
                <p className="mt-2 text-xs text-soft">
                  {unlock.reason ?? "Complete previous quizzes first."}
                </p>
              </div>
            </div>
          );
        }

        return (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            href={href}
            completed={completed}
            quizScore={entry?.quizScore}
          />
        );
      })}
    </div>
  );
}

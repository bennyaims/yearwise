"use client";

import { useEffect, useState } from "react";
import { LessonCard } from "@/components/LessonCard";
import { lessonKey, loadProgress } from "@/lib/progress";
import type { Lesson, ProgressMap } from "@/lib/types";

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
      {lessons.map((lesson) => {
        const key = lessonKey(year, subject, lesson.id, language);
        const entry = progress[key];
        const href = language
          ? `/year/${year}/${subject}/${language}/${lesson.id}`
          : `/year/${year}/${subject}/${lesson.id}`;
        return (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            href={href}
            completed={entry?.completed}
            quizScore={entry?.quizScore}
          />
        );
      })}
    </div>
  );
}

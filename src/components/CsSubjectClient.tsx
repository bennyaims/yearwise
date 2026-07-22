"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { CsPathwayPicker } from "@/components/CsPathwayPicker";
import { SubjectLessonList } from "@/components/SubjectLessonList";
import { getLessonsFor } from "@/content/lessons";
import { getCsPathway } from "@/content/cs-pathways";
import { getCsPathwayForYear } from "@/lib/cs-pathway-choice";
import type { CsPathwayId, Lesson, YearLevel } from "@/lib/types";

type Props = {
  year: YearLevel;
  subjectColor: string;
  subjectIcon: string;
  subjectName: string;
  description: string;
};

export function CsSubjectClient({
  year,
  subjectColor,
  subjectIcon,
  subjectName,
  description,
}: Props) {
  const [pathway, setPathway] = useState<CsPathwayId | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    const p = getCsPathwayForYear(year);
    setPathway(p);
    if (p) {
      setLessons(getLessonsFor(year, "computerscience", undefined, p));
    } else {
      setLessons([]);
    }
    setReady(true);
  }, [year]);

  useEffect(() => {
    refresh();
    const onUp = () => refresh();
    window.addEventListener("yearwise-cs-pathway-update", onUp);
    return () => window.removeEventListener("yearwise-cs-pathway-update", onUp);
  }, [refresh]);

  const meta = pathway ? getCsPathway(pathway) : null;

  return (
    <div className="page-shell page-narrow">
      <Link href={`/year/${year}`} className="link-back">
        ← Year {year}
      </Link>

      <div className="glass mt-4 flex items-start gap-4 rounded-[var(--radius-xl)] p-5 sm:p-6">
        <span
          className="icon-disc h-12 w-12 shrink-0 text-2xl"
          style={{
            background: `color-mix(in srgb, ${subjectColor} 16%, transparent)`,
            color: subjectColor,
          }}
        >
          {subjectIcon}
        </span>
        <div className="min-w-0">
          <h1 className="heading-display text-2xl sm:text-3xl">
            {subjectName}
          </h1>
          <p className="mt-1 text-sm text-muted sm:text-base">{description}</p>
          <p className="mt-2 text-xs text-soft">
            Each year you choose a CS pathway. Core lessons are shared; electives
            follow your track.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <CsPathwayPicker year={year} onChosen={() => refresh()} />
      </div>

      {ready && pathway && meta && (
        <div className="mt-8 space-y-4">
          <div className="callout callout-info text-sm">
            <strong>Exit goal (Year 12):</strong> every pathway still builds
            toward writing systems that create and evaluate AI-related tech, and
            designing defences against misuse — with different electives along
            the way.
          </div>
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="heading-section text-lg">
                {meta.icon} {meta.shortName} lessons · Year {year}
              </h2>
              <p className="text-sm text-muted">
                {lessons.length} lessons on this pathway (core + electives).
                Finish quizzes in order — no skipping.
              </p>
            </div>
            <Link href="/game" className="btn btn-ghost text-xs">
              Build Lab
            </Link>
          </div>
          <SubjectLessonList
            lessons={lessons}
            year={year}
            subject="computerscience"
          />
        </div>
      )}

      {ready && !pathway && (
        <p className="mt-6 text-sm text-muted">
          Choose a pathway above to unlock this year&apos;s Computer Science
          lessons.
        </p>
      )}
    </div>
  );
}

"use client";

import Link from "next/link";
import type { RewardEvent } from "@/lib/rewards";
import { badgeMeta } from "@/lib/rewards";
import type { Lesson } from "@/lib/types";
import { lessonHref, subjectHref } from "@/lib/pathway";

type Props = {
  lesson: Lesson;
  nextLesson: Lesson | null;
  reward: RewardEvent | null;
  subjectComplete: boolean;
};

export function CompletionPanel({
  lesson,
  nextLesson,
  reward,
  subjectComplete,
}: Props) {
  return (
    <div className="glass-strong space-y-5 rounded-[var(--radius-xl)] p-5 sm:p-7">
      <div className="flex items-start gap-3">
        <div
          className="icon-disc h-12 w-12 shrink-0 text-2xl"
          style={{ background: "var(--ok-soft)", color: "var(--ok)" }}
        >
          ✓
        </div>
        <div>
          <h2 className="heading-section text-xl">Block complete</h2>
          <p className="mt-1 text-sm text-muted">
            “{lesson.title}” is saved on this device
            {lesson.estimatedMinutes
              ? ` · ~${lesson.estimatedMinutes} min block`
              : ""}
            .
          </p>
        </div>
      </div>

      {reward && (
        <div className="callout callout-tip">
          <p className="font-semibold text-ink">{reward.message}</p>
          {reward.newBadges.length > 0 && (
            <ul className="mt-2 flex flex-wrap gap-2">
              {reward.newBadges.map((id) => {
                const b = badgeMeta(id);
                return (
                  <li key={id} className="badge badge-ok">
                    {b?.icon} {b?.name}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {nextLesson ? (
          <Link href={lessonHref(nextLesson)} className="btn btn-primary">
            Next fluency block
            {nextLesson.year !== lesson.year
              ? ` (Year ${nextLesson.year})`
              : ""}{" "}
            → {nextLesson.title}
          </Link>
        ) : subjectComplete && lesson.subject === "language" ? (
          <Link
            href={
              lesson.language
                ? `/year/12/language/${lesson.language}`
                : subjectHref(lesson.year, lesson.subject, lesson.language)
            }
            className="btn btn-primary"
          >
            Fluency pathway complete · View certificate status
          </Link>
        ) : subjectComplete ? (
          <Link href="/weekly-test" className="btn btn-primary">
            Subject pathway done · Take weekly test
          </Link>
        ) : (
          <Link
            href={subjectHref(lesson.year, lesson.subject, lesson.language)}
            className="btn btn-primary"
          >
            Back to subject list
          </Link>
        )}

        <Link href="/schedule" className="btn btn-ghost">
          Today&apos;s 30-min schedule
        </Link>
        <Link href="/patterns" className="btn btn-sky">
          Random integer patterns drill
        </Link>
        <Link href="/rewards" className="btn btn-ghost">
          Stars & badges
        </Link>
        {(reward?.coinsGained ?? 0) > 0 && (
          <Link href="/game/shop" className="btn btn-sky">
            Spend {reward?.coinsGained} practice coins →
          </Link>
        )}
        <Link href="/game" className="btn btn-ghost">
          Build Lab (code &amp; animation)
        </Link>
      </div>

      {!nextLesson && subjectComplete && (
        <p className="text-sm text-muted">
          Nice work — you finished every integers block in this pathway. Sit the
          weekly test for extra stars.
        </p>
      )}
    </div>
  );
}

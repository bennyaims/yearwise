"use client";

import Link from "next/link";
import { softwareForSubject } from "@/content/curriculum-software";
import type { SubjectId, YearLevel } from "@/lib/types";

type Props = {
  subject: SubjectId;
  year: YearLevel;
};

/** Download + tutorial callout at top of matching lessons */
export function LessonSoftware({ subject, year }: Props) {
  const tools = softwareForSubject(subject, year);
  if (tools.length === 0) return null;

  return (
    <aside className="callout callout-info">
      <p className="font-semibold text-ink">Programs for this lesson</p>
      <ul className="mt-2 space-y-2 text-sm text-muted">
        {tools.map((t) => (
          <li key={t.id} className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span aria-hidden>{t.icon}</span>
            <strong className="text-ink">{t.name}</strong>
            <span>— {t.lessonTip}</span>
            <a
              href={t.downloadUrl}
              target="_blank"
              rel="noreferrer"
              className="text-accent underline"
            >
              Download
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs text-soft">
        Starter tutorials are in the video section below and in{" "}
        <Link href="/tools" className="text-accent underline">
          Tools &amp; downloads
        </Link>
        . You also got these links at signup.
      </p>
    </aside>
  );
}

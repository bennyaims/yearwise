import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CsSubjectClient } from "@/components/CsSubjectClient";
import { MathFunBanner } from "@/components/MathFunBanner";
import { SubjectLessonList } from "@/components/SubjectLessonList";
import { getLessonsFor } from "@/content/lessons";
import { getSubject, YEARS } from "@/lib/subjects";
import type { SubjectId, YearLevel } from "@/lib/types";

type Props = {
  params: Promise<{ year: string; subject: string }>;
};

const SUBJECT_IDS: SubjectId[] = [
  "math",
  "science",
  "chemistry",
  "english",
  "language",
  "history",
  "music",
  "computerscience",
];

function parseYear(raw: string): YearLevel | null {
  const n = Number(raw);
  return YEARS.includes(n as YearLevel) ? (n as YearLevel) : null;
}

export async function generateStaticParams() {
  const params: { year: string; subject: string }[] = [];
  for (const year of YEARS) {
    for (const subject of SUBJECT_IDS) {
      if (subject === "language") continue;
      params.push({ year: String(year), subject });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { year, subject } = await params;
  const meta = getSubject(subject);
  return { title: meta ? `Year ${year} ${meta.name}` : `Year ${year}` };
}

export default async function SubjectPage({ params }: Props) {
  const { year: rawYear, subject: rawSubject } = await params;
  const year = parseYear(rawYear);
  if (!year) notFound();

  if (rawSubject === "language") {
    redirect(`/year/${year}/language`);
  }

  if (!SUBJECT_IDS.includes(rawSubject as SubjectId)) notFound();
  const subject = rawSubject as SubjectId;
  const meta = getSubject(subject);
  if (!meta) notFound();

  if (subject === "computerscience") {
    return (
      <CsSubjectClient
        year={year}
        subjectColor={meta.color}
        subjectIcon={meta.icon}
        subjectName={meta.name}
        description={meta.description}
      />
    );
  }

  const lessons = getLessonsFor(year, subject);

  return (
    <div className="page-shell page-narrow">
      <Link href={`/year/${year}`} className="link-back">
        ← Year {year}
      </Link>

      <div className="glass mt-4 flex items-start gap-4 rounded-[var(--radius-xl)] p-5 sm:p-6">
        <span
          className="icon-disc h-12 w-12 shrink-0 text-2xl"
          style={{
            background: `color-mix(in srgb, ${meta.color} 16%, transparent)`,
            color: meta.color,
          }}
        >
          {meta.icon}
        </span>
        <div className="min-w-0">
          <h1 className="heading-display text-2xl sm:text-3xl">{meta.name}</h1>
          <p className="mt-1 text-sm text-muted sm:text-base">
            Year {year} · {lessons.length} lesson
            {lessons.length === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      <p className="mt-4 text-sm text-muted sm:text-base">{meta.description}</p>

      {subject === "math" && (
        <div className="mt-4">
          <MathFunBanner year={year} />
        </div>
      )}

      {subject === "history" && (
        <div className="callout callout-unfiltered mt-4">
          <strong>Unfiltered track:</strong> these lessons include invasion,
          frontier violence, racial policy and contested national memory. They
          are written for secondary students who can handle evidence and debate.
        </div>
      )}

      {subject === "science" && (
        <div className="callout callout-tip mt-4">
          <strong>Genesis Lab:</strong> evolve organisms from DNA → proteins in
          a 3D world (gravity, star type, air).{" "}
          <a href="/labs/genesis" className="font-semibold underline">
            Launch simulation →
          </a>
        </div>
      )}

      <div className="mt-8">
        <SubjectLessonList lessons={lessons} year={year} subject={subject} />
      </div>
    </div>
  );
}

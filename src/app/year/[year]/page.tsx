import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SubjectCard } from "@/components/SubjectCard";
import { YearGate } from "@/components/YearGate";
import { YearProgress } from "@/components/YearProgress";
import { getLessonsFor } from "@/content/lessons";
import { subjectsForYear, YEARS } from "@/lib/subjects";
import type { YearLevel } from "@/lib/types";

type Props = { params: Promise<{ year: string }> };

function parseYear(raw: string): YearLevel | null {
  const n = Number(raw);
  if (YEARS.includes(n as YearLevel)) return n as YearLevel;
  return null;
}

export async function generateStaticParams() {
  return YEARS.map((year) => ({ year: String(year) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { year: raw } = await params;
  return { title: `Year ${raw}` };
}

export default async function YearPage({ params }: Props) {
  const { year: raw } = await params;
  const year = parseYear(raw);
  if (!year) notFound();

  const subjects = subjectsForYear(year);

  return (
    <div className="page-shell">
      <div className="mb-6">
        <Link href="/" className="link-back">
          ← All years
        </Link>
        <h1 className="heading-display mt-3 text-3xl sm:text-4xl">
          Year {year}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted sm:text-base">
          Select a subject. Finish every lesson quiz in order — no skipping.
          Year exams mix <strong className="text-ink">this year plus earlier
          years</strong> so memory stays sharp. You may sit the Year exam early;
          unlocking the next year needs{" "}
          <strong className="text-ink">92% overall</strong> across all subjects
          plus 92% on the year exam.
        </p>
      </div>

      <div className="mb-6 sm:mb-8">
        <YearProgress year={year} />
      </div>

      <YearGate year={year}>
      <div className="mb-6 flex flex-wrap gap-2">
        {YEARS.map((y) => (
          <Link
            key={y}
            href={`/year/${y}`}
            className={`btn btn-chip ${
              y === year ? "btn-primary" : "btn-ghost"
            }`}
          >
            Y{y}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {subjects.map((subject) => {
          const lessons =
            subject.id === "language"
              ? getLessonsFor(year, "language")
              : getLessonsFor(year, subject.id);
          const href =
            subject.id === "language"
              ? `/year/${year}/language`
              : `/year/${year}/${subject.id}`;
          return (
            <SubjectCard
              key={subject.id}
              subject={subject}
              href={href}
              lessonCount={
                subject.id === "language"
                  ? lessons.filter((l) => l.year === year).length
                  : lessons.length
              }
            />
          );
        })}
      </div>
      </YearGate>
    </div>
  );
}

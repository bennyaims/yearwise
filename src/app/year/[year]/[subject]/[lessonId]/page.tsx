import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LessonClient } from "@/components/LessonClient";
import { getLesson, LESSONS } from "@/content/lessons";
import { getSubject, YEARS } from "@/lib/subjects";
import type { SubjectId, YearLevel } from "@/lib/types";

type Props = {
  params: Promise<{ year: string; subject: string; lessonId: string }>;
};

function parseYear(raw: string): YearLevel | null {
  const n = Number(raw);
  return YEARS.includes(n as YearLevel) ? (n as YearLevel) : null;
}

export async function generateStaticParams() {
  return LESSONS.filter((l) => l.subject !== "language").map((l) => ({
    year: String(l.year),
    subject: l.subject,
    lessonId: l.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { year: rawYear, subject, lessonId } = await params;
  const year = parseYear(rawYear);
  if (!year) return { title: "Lesson" };
  const lesson = getLesson(year, subject as SubjectId, lessonId);
  return { title: lesson?.title ?? "Lesson" };
}

export default async function LessonPage({ params }: Props) {
  const { year: rawYear, subject: rawSubject, lessonId } = await params;
  const year = parseYear(rawYear);
  if (!year) notFound();

  const subject = rawSubject as SubjectId;
  if (subject === "language") notFound();

  const lesson = getLesson(year, subject, lessonId);
  if (!lesson) notFound();

  const meta = getSubject(subject);

  return (
    <div className="page-shell page-narrow">
      <nav className="flex flex-wrap items-center gap-2 text-sm text-muted">
        <Link href={`/year/${year}`} className="link-back">
          Year {year}
        </Link>
        <span className="text-soft">/</span>
        <Link href={`/year/${year}/${subject}`} className="link-back">
          {meta?.name ?? subject}
        </Link>
        <span className="text-soft">/</span>
        <span className="text-ink">{lesson.title}</span>
      </nav>

      <header className="glass mt-5 rounded-[var(--radius-xl)] p-5 sm:p-6">
        {lesson.strand && (
          <p className="text-sm font-medium text-accent">{lesson.strand}</p>
        )}
        <h1 className="heading-display mt-1 text-2xl sm:text-3xl">
          {lesson.title}
        </h1>
        <p className="mt-2 text-muted">{lesson.summary}</p>
        <p className="mt-3 text-xs text-soft">
          ~{lesson.estimatedMinutes} minutes
        </p>
      </header>

      <div className="mt-6 sm:mt-8">
        <LessonClient lesson={lesson} />
      </div>
    </div>
  );
}

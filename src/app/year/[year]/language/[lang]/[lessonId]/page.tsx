import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LessonClient } from "@/components/LessonClient";
import { getLesson, LESSONS } from "@/content/lessons";
import { getLanguage, YEARS } from "@/lib/subjects";
import type { LanguageId, YearLevel } from "@/lib/types";

type Props = {
  params: Promise<{ year: string; lang: string; lessonId: string }>;
};

function parseYear(raw: string): YearLevel | null {
  const n = Number(raw);
  return YEARS.includes(n as YearLevel) ? (n as YearLevel) : null;
}

export async function generateStaticParams() {
  return LESSONS.filter((l) => l.subject === "language" && l.language).map(
    (l) => ({
      year: String(l.year),
      lang: l.language!,
      lessonId: l.id,
    }),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { year: rawYear, lang, lessonId } = await params;
  const year = parseYear(rawYear);
  if (!year) return { title: "Lesson" };
  const lesson = getLesson(year, "language", lessonId, lang as LanguageId);
  return { title: lesson?.title ?? "Lesson" };
}

export default async function LanguageLessonPage({ params }: Props) {
  const { year: rawYear, lang: rawLang, lessonId } = await params;
  const year = parseYear(rawYear);
  const language = getLanguage(rawLang);
  if (!year || !language) notFound();

  const lesson = getLesson(year, "language", lessonId, language.id);
  if (!lesson) notFound();

  return (
    <div className="page-shell page-narrow">
      <nav className="flex flex-wrap items-center gap-2 text-sm text-muted">
        <Link href={`/year/${year}`} className="link-back">
          Year {year}
        </Link>
        <span className="text-soft">/</span>
        <Link
          href={`/year/${year}/language/${language.id}`}
          className="link-back"
        >
          {language.flag} {language.name}
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

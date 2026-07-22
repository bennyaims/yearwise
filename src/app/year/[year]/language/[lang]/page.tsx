import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FluencyProgressPanel } from "@/components/FluencyProgress";
import { SubjectLessonList } from "@/components/SubjectLessonList";
import { getLessonsFor } from "@/content/lessons";
import { stageForYear } from "@/lib/fluency";
import { getLanguage, LANGUAGES, YEARS } from "@/lib/subjects";
import type { LanguageId, YearLevel } from "@/lib/types";

type Props = {
  params: Promise<{ year: string; lang: string }>;
};

function parseYear(raw: string): YearLevel | null {
  const n = Number(raw);
  return YEARS.includes(n as YearLevel) ? (n as YearLevel) : null;
}

export async function generateStaticParams() {
  const params: { year: string; lang: string }[] = [];
  for (const year of YEARS) {
    for (const lang of LANGUAGES) {
      params.push({ year: String(year), lang: lang.id });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { year, lang } = await params;
  const meta = getLanguage(lang);
  return {
    title: meta ? `Year ${year} ${meta.name}` : `Year ${year} Language`,
  };
}

export default async function LanguageYearPage({ params }: Props) {
  const { year: rawYear, lang: rawLang } = await params;
  const year = parseYear(rawYear);
  const language = getLanguage(rawLang);
  if (!year || !language) notFound();

  const langId = language.id as LanguageId;
  const lessons = getLessonsFor(year, "language", langId);
  const stage = stageForYear(year);

  return (
    <div className="page-shell page-narrow">
      <Link href={`/year/${year}/language`} className="link-back">
        ← Change language
      </Link>

      <div className="glass mt-4 flex items-start gap-4 rounded-[var(--radius-xl)] p-5 sm:p-6">
        <span className="icon-disc h-12 w-12 shrink-0 text-2xl">
          {language.flag}
        </span>
        <div className="min-w-0">
          <h1 className="heading-display text-2xl sm:text-3xl">
            {language.name}
          </h1>
          <p className="mt-1 text-sm text-muted sm:text-base">
            {language.nativeName} · Year {year} · {stage.cefr} ·{" "}
            {lessons.length} block{lessons.length === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      <p className="mt-4 text-sm text-muted sm:text-base">
        {language.description}{" "}
        <strong className="text-ink">
          Design goal: fluent independent use by end of Year 12.
        </strong>
      </p>

      <div className="mt-6">
        <FluencyProgressPanel
          language={langId}
          languageName={language.name}
          flag={language.flag}
        />
      </div>

      <div className="callout callout-info mt-4">
        <strong>This year ({stage.label}):</strong> {stage.goal} Recommended:{" "}
        {stage.speakingMinutesPerWeek} min speaking +{" "}
        {stage.listeningMinutesPerWeek} min listening per week.
      </div>

      <div className="callout callout-tip mt-3">
        <strong>Audio every block:</strong> pronunciation lab + listening
        practice. Completing a block advances the fluency pathway (including
        into the next year).
      </div>

      <h2 className="heading-section mt-8 text-lg">
        Year {year} blocks · {stage.cefr}
      </h2>
      <div className="mt-4">
        <SubjectLessonList
          lessons={lessons}
          year={year}
          subject="language"
          language={langId}
        />
      </div>
    </div>
  );
}

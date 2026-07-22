"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Quiz } from "@/components/Quiz";
import {
  buildYearExamQuestions,
  getYearExam,
  saveYearExam,
  yearProgressReport,
  YEAR_PASS_OVERALL,
  type YearExamResult,
} from "@/lib/progression";
import { grantTestCoins } from "@/lib/game-economy";
import type { YearLevel } from "@/lib/types";
import { YEARS } from "@/lib/subjects";

type Props = { params: Promise<{ year: string }> };

export default function YearExamPage({ params }: Props) {
  const { year: raw } = use(params);
  const year = Number(raw) as YearLevel;
  const valid = YEARS.includes(year);

  const [existing, setExisting] = useState<YearExamResult | undefined>();
  const [result, setResult] = useState<YearExamResult | null>(null);
  const [retake, setRetake] = useState(false);
  const [reportNote, setReportNote] = useState<string | null>(null);

  const questions = useMemo(
    () => (valid ? buildYearExamQuestions(year, 20) : []),
    [year, valid],
  );

  useEffect(() => {
    if (!valid) return;
    setExisting(getYearExam(year));
  }, [year, valid]);

  if (!valid) {
    return (
      <div className="page-shell">
        <p className="text-muted">Unknown year.</p>
      </div>
    );
  }

  const showQuiz = (!existing && !result) || retake;

  function onComplete(percent: number) {
    const correct = Math.round((percent / 100) * questions.length);
    const report = yearProgressReport(year);
    const early = !report.allLessonsComplete;
    const saved = saveYearExam({
      year,
      percent,
      correct,
      total: questions.length,
      satAt: new Date().toISOString(),
      early,
    });
    setResult(saved);
    setExisting(saved);
    setRetake(false);
    grantTestCoins({
      claimKey: `year-exam:${year}:${saved.satAt}`,
      percent,
      source: "weekly-test",
      subject: "science",
    });

    const after = yearProgressReport(year);
    if (after.canProgressToNextYear) {
      setReportNote(
        `Passed Year ${year} requirements. Year ${after.nextYear} is unlocked.`,
      );
    } else if (percent >= YEAR_PASS_OVERALL && !report.allLessonsComplete) {
      setReportNote(
        `Strong year exam (${percent}%). You sat early — still finish every subject lesson quiz and hold ${YEAR_PASS_OVERALL}% overall to unlock the next year.`,
      );
    } else if (percent < YEAR_PASS_OVERALL) {
      setReportNote(
        `Year exam ${percent}% — need ${YEAR_PASS_OVERALL}% on this exam and ${YEAR_PASS_OVERALL}% overall across subjects. Retake after more study.`,
      );
    } else {
      setReportNote(
        after.blockers.slice(0, 3).join(" ") ||
          "Year exam saved. Check year progress for remaining requirements.",
      );
    }
  }

  return (
    <div className="page-shell page-narrow space-y-6">
      <Link href={`/year/${year}`} className="link-back">
        ← Year {year}
      </Link>

      <header className="glass-strong rounded-[var(--radius-xl)] p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
          Year exam · may sit early
        </p>
        <h1 className="heading-display mt-2 text-2xl sm:text-3xl">
          Year {year} exam
        </h1>
        <p className="mt-2 text-muted">
          You may sit this exam before every lesson is done. To{" "}
          <strong className="text-ink">progress to the next year</strong> you
          still must: finish <strong className="text-ink">all</strong> subject
          lesson quizzes, hold{" "}
          <strong className="text-ink">{YEAR_PASS_OVERALL}% overall</strong>{" "}
          across subjects, and score{" "}
          <strong className="text-ink">{YEAR_PASS_OVERALL}%+</strong> on this
          year exam. No skipping lessons.
        </p>
      </header>

      {existing && !showQuiz && !result && (
        <div className="glass-strong rounded-[var(--radius-xl)] p-6 space-y-3">
          <h2 className="heading-section text-xl">Recorded result</h2>
          <p className="text-3xl font-bold text-accent">{existing.percent}%</p>
          <p className="text-sm text-muted">
            {existing.correct}/{existing.total} correct
            {existing.early ? " · sat early" : ""} ·{" "}
            {new Date(existing.satAt).toLocaleString()}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="btn btn-sky text-sm"
              onClick={() => setRetake(true)}
            >
              Retake year exam
            </button>
            <Link href={`/year/${year}`} className="btn btn-ghost text-sm">
              Year progress
            </Link>
          </div>
        </div>
      )}

      {result && (
        <div className="glass-strong rounded-[var(--radius-xl)] p-6 space-y-3">
          <h2 className="heading-section text-xl">Exam submitted</h2>
          <p className="text-3xl font-bold text-accent">{result.percent}%</p>
          {reportNote && (
            <p className="text-sm text-muted">{reportNote}</p>
          )}
          <div className="flex flex-wrap gap-2">
            <Link href={`/year/${year}`} className="btn btn-primary text-sm">
              Year {year} progress
            </Link>
            <button
              type="button"
              className="btn btn-ghost text-sm"
              onClick={() => {
                setResult(null);
                setRetake(true);
              }}
            >
              Retake
            </button>
          </div>
        </div>
      )}

      {showQuiz && (
        <Quiz questions={questions} onComplete={onComplete} />
      )}
    </div>
  );
}

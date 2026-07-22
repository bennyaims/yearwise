"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Quiz } from "@/components/Quiz";
import {
  buildYearExamQuestions,
  getYearExam,
  saveYearExam,
  yearExamMixInfo,
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

  const mix = useMemo(
    () => (valid ? yearExamMixInfo(year) : null),
    [year, valid],
  );

  const questions = useMemo(
    () => (valid ? buildYearExamQuestions(year) : []),
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
          Year exam · cumulative memory · may sit early
        </p>
        <h1 className="heading-display mt-2 text-2xl sm:text-3xl">
          Year {year} exam
        </h1>
        <p className="mt-2 text-muted">
          This exam mixes <strong className="text-ink">this year&apos;s</strong>{" "}
          work with questions from{" "}
          <strong className="text-ink">previous years</strong> so knowledge
          stays in memory. It also includes{" "}
          <strong className="text-ink">times tables</strong> and mental-speed
          strategies. Items marked{" "}
          <strong className="text-ink">[Y7 memory]</strong> /{" "}
          <strong className="text-ink">[Times tables]</strong> are deliberate
          review.
        </p>
        {mix && (
          <p className="mt-2 text-sm text-soft">
            About {mix.total} questions
            {mix.reviewApprox > 0
              ? ` · ~${mix.currentApprox} from Year ${year} · ~${mix.reviewApprox} from prior years (${mix.priorYears.map((y) => `Y${y}`).join(", ")})`
              : ` · all from Year ${year} (first secondary year)`}
            . Need {YEAR_PASS_OVERALL}%+ here plus {YEAR_PASS_OVERALL}% overall
            across subjects to unlock the next year.
          </p>
        )}
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

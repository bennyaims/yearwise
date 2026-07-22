/**
 * Strict curriculum progression (no skip).
 * - Lessons unlock only after the previous lesson’s quiz is finished.
 * - Lesson complete only after the quiz is sat.
 * - Year tests may be sat early.
 * - Advance to the next year only with 92% overall across all subjects
 *   (and every lesson quiz in the year finished).
 */

import { LESSONS, getLessonsFor } from "@/content/lessons";
import { getCsPathwayForYear } from "@/lib/cs-pathway-choice";
import {
  lessonKey,
  loadPreferredLanguage,
  loadProgress,
} from "@/lib/progress";
import { SUBJECTS } from "@/lib/subjects";
import { makeRng, timesTablesForExam } from "@/lib/times-tables";
import type {
  LanguageId,
  ProgressMap,
  QuizQuestion,
  SubjectId,
  YearLevel,
} from "@/lib/types";

/** Required overall average (%) across subjects to progress year */
export const YEAR_PASS_OVERALL = 92;

const YEAR_EXAM_KEY = "yearwise-year-exams-v1";

export type YearExamResult = {
  year: YearLevel;
  percent: number;
  correct: number;
  total: number;
  satAt: string;
  early: boolean;
};

export type SubjectScore = {
  subject: SubjectId;
  name: string;
  lessonsTotal: number;
  lessonsDone: number;
  averagePercent: number | null;
  complete: boolean;
};

export type YearProgressReport = {
  year: YearLevel;
  subjects: SubjectScore[];
  /** Mean of subject averages (only subjects with scores) */
  overallPercent: number | null;
  allLessonsComplete: boolean;
  meetsOverall92: boolean;
  yearExam: YearExamResult | null;
  canProgressToNextYear: boolean;
  nextYear: YearLevel | null;
  blockers: string[];
};

function preferredLang(): LanguageId | undefined {
  const raw = loadPreferredLanguage();
  if (!raw) return undefined;
  return raw as LanguageId;
}

/** Lessons that count for a year (one language + one CS pathway) */
export function countableLessonsForYear(year: YearLevel) {
  const lang = preferredLang();
  const csPath =
    typeof window !== "undefined" ? getCsPathwayForYear(year) : null;
  return LESSONS.filter((l) => {
    if (l.year !== year) return false;
    if (l.subject === "language") {
      if (!lang) return false;
      return l.language === lang;
    }
    if (l.subject === "computerscience") {
      if (!csPath) return false;
      const tags = l.csPathways;
      if (!tags || tags.length === 0) return true;
      return tags.includes(csPath);
    }
    return true;
  });
}

export function subjectLessons(
  year: YearLevel,
  subject: SubjectId,
  language?: LanguageId,
) {
  if (subject === "language") {
    const lang = language ?? preferredLang();
    if (!lang) return [];
    return getLessonsFor(year, "language", lang);
  }
  if (subject === "computerscience") {
    // Server has no localStorage — return all CS until client filters
    if (typeof window === "undefined") {
      return getLessonsFor(year, "computerscience");
    }
    const pathway = getCsPathwayForYear(year);
    if (!pathway) return []; // must choose pathway first
    return getLessonsFor(year, "computerscience", undefined, pathway);
  }
  return getLessonsFor(year, subject);
}

/** Quiz finished = completed with a recorded quizScore */
export function isLessonTestDone(
  map: ProgressMap,
  key: string,
): boolean {
  const e = map[key];
  return Boolean(e?.completed && e.quizScore != null);
}

/**
 * Sequential unlock: first lesson free; later ones need previous quiz done.
 */
export function isLessonUnlocked(
  year: YearLevel,
  subject: SubjectId,
  lessonId: string,
  language?: LanguageId,
  map: ProgressMap = loadProgress(),
): { unlocked: boolean; reason?: string } {
  const list = subjectLessons(year, subject, language);
  const idx = list.findIndex((l) => l.id === lessonId);
  if (idx < 0) return { unlocked: false, reason: "Lesson not found." };
  if (idx === 0) return { unlocked: true };

  for (let i = 0; i < idx; i++) {
    const prev = list[i]!;
    const key = lessonKey(prev.year, prev.subject, prev.id, prev.language);
    if (!isLessonTestDone(map, key)) {
      return {
        unlocked: false,
        reason: `Finish the quiz for “${prev.title}” before this lesson unlocks. No skipping.`,
      };
    }
  }
  return { unlocked: true };
}

export function averageQuizScores(scores: number[]): number | null {
  if (scores.length === 0) return null;
  const sum = scores.reduce((a, b) => a + b, 0);
  return Math.round(sum / scores.length);
}

export function subjectProgress(
  year: YearLevel,
  subject: SubjectId,
  map: ProgressMap = loadProgress(),
  language?: LanguageId,
): SubjectScore {
  const meta = SUBJECTS.find((s) => s.id === subject);
  const list = subjectLessons(year, subject, language);
  const scores: number[] = [];
  let done = 0;
  for (const l of list) {
    const key = lessonKey(l.year, l.subject, l.id, l.language);
    if (isLessonTestDone(map, key)) {
      done += 1;
      scores.push(map[key]!.quizScore!);
    }
  }
  return {
    subject,
    name: meta?.name ?? subject,
    lessonsTotal: list.length,
    lessonsDone: done,
    averagePercent: averageQuizScores(scores),
    complete: list.length > 0 && done >= list.length,
  };
}

export function yearProgressReport(
  year: YearLevel,
  map: ProgressMap = loadProgress(),
): YearProgressReport {
  const lang = preferredLang();
  const subjectsInYear = SUBJECTS.filter((s) => s.years.includes(year));

  const subjects: SubjectScore[] = subjectsInYear
    .map((s) => {
      if (s.id === "language") {
        if (!lang) {
          return {
            subject: s.id,
            name: s.name,
            lessonsTotal: 0,
            lessonsDone: 0,
            averagePercent: null,
            complete: false,
          };
        }
        return subjectProgress(year, "language", map, lang);
      }
      return subjectProgress(year, s.id, map);
    })
    .filter((s) => s.lessonsTotal > 0 || s.subject === "language");

  // Language with no choice yet: still a blocker if language lessons exist in year
  const hasLanguageLessons = LESSONS.some(
    (l) => l.year === year && l.subject === "language",
  );
  const subjectAvgs = subjects
    .filter((s) => s.lessonsTotal > 0 && s.averagePercent != null)
    .map((s) => s.averagePercent!);

  const overallPercent = averageQuizScores(subjectAvgs);

  const nonEmpty = subjects.filter((s) => s.lessonsTotal > 0);
  const allLessonsComplete =
    nonEmpty.length > 0 &&
    nonEmpty.every((s) => s.complete) &&
    (!hasLanguageLessons || Boolean(lang));

  const meetsOverall92 =
    overallPercent != null && overallPercent >= YEAR_PASS_OVERALL;

  const yearExam = getYearExam(year) ?? null;
  const nextYear = (year < 12 ? ((year + 1) as YearLevel) : null);

  const blockers: string[] = [];
  if (hasLanguageLessons && !lang) {
    blockers.push("Choose a language pathway (Y7–Y12).");
  }
  const hasCsLessons = LESSONS.some(
    (l) => l.year === year && l.subject === "computerscience",
  );
  if (
    hasCsLessons &&
    typeof window !== "undefined" &&
    !getCsPathwayForYear(year)
  ) {
    blockers.push(`Choose a Computer Science pathway for Year ${year}.`);
  }
  for (const s of nonEmpty) {
    if (!s.complete) {
      blockers.push(
        `${s.name}: finish all lesson quizzes (${s.lessonsDone}/${s.lessonsTotal}).`,
      );
    } else if (s.averagePercent != null && s.averagePercent < YEAR_PASS_OVERALL) {
      blockers.push(
        `${s.name}: average ${s.averagePercent}% — need ${YEAR_PASS_OVERALL}% overall across subjects (improve quizzes).`,
      );
    }
  }
  if (overallPercent != null && !meetsOverall92) {
    blockers.push(
      `Overall average ${overallPercent}% — need ${YEAR_PASS_OVERALL}% across all subjects.`,
    );
  }
  if (!yearExam) {
    blockers.push("Sit the Year exam (you may sit it early).");
  } else if (yearExam.percent < YEAR_PASS_OVERALL) {
    blockers.push(
      `Year exam ${yearExam.percent}% — need ${YEAR_PASS_OVERALL}% on the year exam as well.`,
    );
  }

  const canProgressToNextYear =
    allLessonsComplete &&
    meetsOverall92 &&
    yearExam != null &&
    yearExam.percent >= YEAR_PASS_OVERALL &&
    nextYear != null;

  return {
    year,
    subjects: nonEmpty,
    overallPercent,
    allLessonsComplete,
    meetsOverall92,
    yearExam,
    canProgressToNextYear,
    nextYear,
    blockers: canProgressToNextYear ? [] : blockers,
  };
}

/** Year N is open if N===7 or previous year is fully passed */
export function isYearUnlocked(
  year: YearLevel,
  map: ProgressMap = loadProgress(),
): { unlocked: boolean; reason?: string } {
  if (year === 7) return { unlocked: true };
  const prev = (year - 1) as YearLevel;
  const report = yearProgressReport(prev, map);
  if (report.canProgressToNextYear) return { unlocked: true };
  return {
    unlocked: false,
    reason: `Year ${prev} must be finished first: all subject quizzes + ${YEAR_PASS_OVERALL}% overall + Year ${prev} exam at ${YEAR_PASS_OVERALL}%+. No skipping.`,
  };
}

function loadYearExams(): YearExamResult[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(YEAR_EXAM_KEY);
    return raw ? (JSON.parse(raw) as YearExamResult[]) : [];
  } catch {
    return [];
  }
}

function saveYearExams(list: YearExamResult[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(YEAR_EXAM_KEY, JSON.stringify(list));
}

export function getYearExam(year: YearLevel): YearExamResult | undefined {
  return loadYearExams().find((e) => e.year === year);
}

export function saveYearExam(result: YearExamResult) {
  const list = loadYearExams().filter((e) => e.year !== result.year);
  list.push(result);
  saveYearExams(list);
  return result;
}

type TaggedQ = QuizQuestion & { _fromYear: YearLevel; _subject: string };

function poolFromYear(y: YearLevel): TaggedQ[] {
  return countableLessonsForYear(y).flatMap((l) =>
    (l.quiz ?? []).map((q) => ({
      ...q,
      id: `ye-src${y}-${l.id}-${q.id}`,
      _fromYear: y,
      _subject: l.subject,
    })),
  );
}

/** How many exam questions and what share is prior-year memory work */
export function yearExamMixInfo(year: YearLevel): {
  total: number;
  currentApprox: number;
  reviewApprox: number;
  priorYears: YearLevel[];
} {
  const total = yearExamQuestionCount(year);
  const priorYears = ([7, 8, 9, 10, 11, 12] as YearLevel[]).filter(
    (y) => y < year,
  );
  const reviewShare = year === 7 ? 0 : 0.45;
  const reviewApprox = Math.round(total * reviewShare);
  return {
    total,
    currentApprox: total - reviewApprox,
    reviewApprox,
    priorYears,
  };
}

export function yearExamQuestionCount(year: YearLevel): number {
  // Slightly longer exams as more prior years stack into memory
  if (year <= 7) return 20;
  if (year <= 9) return 24;
  if (year <= 11) return 28;
  return 30;
}

function shuffleInPlace<T>(arr: T[], rng: () => number): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  }
  return arr;
}

/**
 * Build a year exam that mixes:
 * - Current-year questions (new learning)
 * - Previous years' questions (memory / retention)
 *
 * Higher years pull a larger review share so nothing is forgotten.
 * Early sit allowed — does not unlock next year without 92% rules.
 */
export function buildYearExamQuestions(
  year: YearLevel,
  count?: number,
): QuizQuestion[] {
  const total = count ?? yearExamQuestionCount(year);
  let seed = year * 9973 + 42;
  const rng = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 0x100000000;
  };

  const priorYears = YEARS_RANGE.filter((y) => y < year) as YearLevel[];
  // Y7: 100% current. Y8+: ~55% current, ~45% prior (split across earlier years).
  const reviewShare = year === 7 ? 0 : 0.45;
  const reviewTarget = Math.round(total * reviewShare);
  const currentTarget = total - reviewTarget;

  const currentPool = poolFromYear(year).map((q) => ({
    ...q,
    prompt: q.prompt,
    explanation: q.explanation,
  }));

  const reviewPools = priorYears.map((y) =>
    poolFromYear(y).map((q) => ({
      ...q,
      id: `ye-rev-Y${y}-${q.id}`,
      prompt: `[Y${y} memory] ${q.prompt}`,
      explanation: `${q.explanation} (Review from Year ${y} — keep earlier years strong.)`,
    })),
  );

  shuffleInPlace(currentPool, rng);
  for (const p of reviewPools) shuffleInPlace(p, rng);

  const selected: TaggedQ[] = [];

  // Take current-year items
  selected.push(
    ...currentPool.slice(0, Math.min(currentTarget, currentPool.length)),
  );

  // Fair share across prior years so Y7…Y(n-1) stay in memory
  if (reviewTarget > 0 && reviewPools.length > 0) {
    const perPrior = Math.max(1, Math.ceil(reviewTarget / reviewPools.length));
    let need = reviewTarget;
    for (const pool of reviewPools) {
      const take = Math.min(perPrior, pool.length, need);
      selected.push(...pool.slice(0, take));
      need -= take;
      if (need <= 0) break;
    }
    if (need > 0) {
      const leftover = reviewPools.flatMap((p) => p.slice(perPrior));
      shuffleInPlace(leftover, rng);
      selected.push(...leftover.slice(0, need));
    }
  }

  // Top up from current year if prior banks were thin
  if (selected.length < total) {
    const used = new Set(selected.map((q) => q.id));
    const extra = currentPool.filter((q) => !used.has(q.id));
    selected.push(...extra.slice(0, total - selected.length));
  }

  // Inject times tables + mental strategy items (memory & fluency)
  const tablesCount = year <= 7 ? 4 : year <= 9 ? 5 : 6;
  const tableQs = timesTablesForExam(tablesCount, year, rng);
  selected.push(
    ...tableQs.map((q) => ({
      ...q,
      _fromYear: year,
      _subject: "math",
    })),
  );

  shuffleInPlace(selected, rng);

  if (selected.length === 0) {
    return [
      {
        id: `ye-${year}-fallback`,
        prompt: `Year ${year} checkpoint: true mastery requires completing all subject lesson quizzes. Mark ready to continue studying.`,
        options: [
          "I will complete every lesson quiz",
          "I want to skip",
          "Tests are optional",
          "92% is not required",
        ],
        correctIndex: 0,
        explanation:
          "No skipping: finish every test. Overall 92% across subjects is required to progress years. Year exams also re-test earlier years so memory stays sharp.",
      },
    ];
  }

  // Prefer total + tables, but cap slightly above total so tables always appear
  const cap = total + Math.min(2, tablesCount);
  return selected.slice(0, Math.max(total, Math.min(cap, selected.length))).map(
    ({ _fromYear, _subject, ...q }) => q,
  );
}

/** Years 7…12 for exam mix */
const YEARS_RANGE: YearLevel[] = [7, 8, 9, 10, 11, 12];

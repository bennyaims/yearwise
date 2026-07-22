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
import type {
  LanguageId,
  ProgressMap,
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

/**
 * Build a year exam from existing lesson quizzes (sampled).
 * Early sit allowed — does not unlock next year without 92% rules.
 */
export function buildYearExamQuestions(year: YearLevel, count = 20) {
  const lessons = countableLessonsForYear(year);
  const pool = lessons.flatMap((l) =>
    (l.quiz ?? []).map((q) => ({
      ...q,
      id: `ye-${year}-${l.id}-${q.id}`,
    })),
  );
  // Deterministic shuffle by year
  let seed = year * 9973;
  const rng = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 0x100000000;
  };
  const shuffled = [...pool].sort(() => rng() - 0.5);
  if (shuffled.length === 0) {
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
          "No skipping: finish every test. Overall 92% across subjects is required to progress years.",
      },
    ];
  }
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

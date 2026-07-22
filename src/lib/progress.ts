import type { ProgressMap } from "./types";

const KEY = "yearwise-progress-v1";
const LANG_KEY = "yearwise-language-v1";

export function loadProgress(): ProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ProgressMap) : {};
  } catch {
    return {};
  }
}

export function saveProgress(map: ProgressMap): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(map));
}

/**
 * Mark lesson complete — quiz score is required (no skip).
 * Call only after the student finishes the lesson quiz.
 */
export function markLessonComplete(
  lessonKey: string,
  quizScore: number,
): ProgressMap {
  const map = loadProgress();
  map[lessonKey] = {
    completed: true,
    quizScore,
    updatedAt: new Date().toISOString(),
  };
  saveProgress(map);
  return map;
}

export function lessonKey(
  year: number,
  subject: string,
  lessonId: string,
  language?: string,
): string {
  return language
    ? `${year}:${subject}:${language}:${lessonId}`
    : `${year}:${subject}:${lessonId}`;
}

export function loadPreferredLanguage(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(LANG_KEY);
}

export function savePreferredLanguage(id: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LANG_KEY, id);
}

export function progressStats(map: ProgressMap, keys: string[]) {
  const total = keys.length;
  const completed = keys.filter((k) => map[k]?.completed).length;
  return {
    total,
    completed,
    percent: total === 0 ? 0 : Math.round((completed / total) * 100),
  };
}

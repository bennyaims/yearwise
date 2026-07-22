import { LESSONS } from "@/content/lessons";
import { nextInLanguagePathway } from "./fluency";
import type { LanguageId, Lesson, SubjectId, YearLevel } from "./types";
import { lessonKey } from "./progress";

export function lessonsInSubject(
  year: YearLevel,
  subject: SubjectId,
  language?: LanguageId,
): Lesson[] {
  return LESSONS.filter((l) => {
    if (l.year !== year || l.subject !== subject) return false;
    if (subject === "language") {
      return language ? l.language === language : true;
    }
    return true;
  });
}

export function getNextLesson(
  year: YearLevel,
  subject: SubjectId,
  currentLessonId: string,
  language?: LanguageId,
): Lesson | null {
  // Languages continue across years toward Y12 fluency exit
  if (subject === "language" && language) {
    return nextInLanguagePathway(language, currentLessonId);
  }
  const list = lessonsInSubject(year, subject, language);
  const idx = list.findIndex((l) => l.id === currentLessonId);
  if (idx < 0 || idx >= list.length - 1) return null;
  return list[idx + 1] ?? null;
}

export function lessonHref(lesson: Lesson): string {
  if (lesson.subject === "language" && lesson.language) {
    return `/year/${lesson.year}/language/${lesson.language}/${lesson.id}`;
  }
  return `/year/${lesson.year}/${lesson.subject}/${lesson.id}`;
}

export function subjectHref(
  year: YearLevel,
  subject: SubjectId,
  language?: LanguageId,
): string {
  if (subject === "language") {
    return language
      ? `/year/${year}/language/${language}`
      : `/year/${year}/language`;
  }
  return `/year/${year}/${subject}`;
}

export function countCompletedInSubject(
  year: YearLevel,
  subject: SubjectId,
  progress: Record<string, { completed?: boolean }>,
  language?: LanguageId,
): { completed: number; total: number; keys: string[] } {
  const list = lessonsInSubject(year, subject, language);
  const keys = list.map((l) =>
    lessonKey(l.year, l.subject, l.id, l.language),
  );
  const completed = keys.filter((k) => progress[k]?.completed).length;
  return { completed, total: keys.length, keys };
}

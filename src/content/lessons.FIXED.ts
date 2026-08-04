// FIXED lessons.ts — removes duplicate import, adds Vic expansion packs
import type { Lesson, LanguageId, SubjectId, YearLevel } from "@/lib/types";
import { buildComputerScienceLessons } from "./cs-pathway";
import { buildFluencyLanguageLessons } from "./language-pathway";
import { MATH_Y8_LESSONS } from "./math-y8";
import { MATH_Y9_LESSONS } from "./math-y9";
import { MATH_Y10_Y12_LESSONS } from "./math-y10-y12";
import { ENGLISH_Y7_12_LESSONS } from "./english-y7-12";
import { SCIENCE_VIC_LESSONS } from "./science-vic-y7-11";
import { HUMANITIES_VIC_LESSONS } from "./humanities-vic-y7-10";

export const LESSONS: Lesson[] = [
  // ─── YOUR EXISTING Y7 MATH (keep as is) — example placeholder, replace with your full Y7 block ───
  // Paste your Y7 integers etc here from original file

  // ─── MATH ───
  ...MATH_Y8_LESSONS,
  ...MATH_Y9_LESSONS,
  ...MATH_Y10_Y12_LESSONS,

  // ─── VIC EXPANSION ───
  ...ENGLISH_Y7_12_LESSONS,
  ...SCIENCE_VIC_LESSONS,
  ...HUMANITIES_VIC_LESSONS,

  // ─── LANGUAGES & CS ───
  ...buildFluencyLanguageLessons(),
  ...buildComputerScienceLessons(),
];

export function getLessonsFor(
  year: YearLevel,
  subject: SubjectId,
  language?: LanguageId,
  csPathway?: import("@/lib/types").CsPathwayId,
): Lesson[] {
  return LESSONS.filter((l) => {
    if (l.year !== year || l.subject !== subject) return false;
    if (subject === "language") return language ? l.language === language : true;
    if (subject === "computerscience" && csPathway) {
      const tags = l.csPathways;
      if (!tags || tags.length === 0) return true;
      return tags.includes(csPathway);
    }
    return true;
  });
}

export function getLesson(
  year: YearLevel,
  subject: SubjectId,
  lessonId: string,
  language?: LanguageId,
): Lesson | undefined {
  return LESSONS.find((l) => {
    if (l.year !== year || l.subject !== subject || l.id !== lessonId) return false;
    if (subject === "language") return language ? l.language === language : true;
    return true;
  });
}

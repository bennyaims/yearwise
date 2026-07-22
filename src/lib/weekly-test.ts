import { LESSONS } from "@/content/lessons";
import {
  generatePatternQuestions,
  makeRng,
  toQuizQuestions,
} from "./integer-patterns";
import { weekKey } from "./rewards";
import type { QuizQuestion } from "./types";

/**
 * Build this week's test for Year 7 integers pathway (+ randomised patterns).
 */
export function buildWeeklyTestQuestions(week = weekKey()): QuizQuestion[] {
  const seed = week.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const rng = makeRng(seed * 9973);

  const bank: QuizQuestion[] = [];

  for (const lesson of LESSONS) {
    if (
      lesson.year === 7 &&
      lesson.subject === "math" &&
      lesson.strand?.includes("Integers") &&
      lesson.quiz
    ) {
      for (const q of lesson.quiz) {
        bank.push({
          id: `${lesson.id}-${q.id}`,
          prompt: q.prompt,
          options: [...q.options],
          correctIndex: q.correctIndex,
          explanation: q.explanation,
        });
      }
    }
  }

  for (let i = bank.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [bank[i], bank[j]] = [bank[j]!, bank[i]!];
  }

  const selected = bank.slice(0, 8);
  const patterns = toQuizQuestions(generatePatternQuestions(4, rng));
  const all = [...selected, ...patterns];

  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [all[i], all[j]] = [all[j]!, all[i]!];
  }

  return all.slice(0, 12);
}

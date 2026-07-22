import { LESSONS } from "@/content/lessons";
import {
  generatePatternQuestions,
  makeRng,
  toQuizQuestions,
} from "./integer-patterns";
import { weekKey } from "./rewards";
import { generateTimesTableQuestions } from "./times-tables";
import type { QuizQuestion } from "./types";

/**
 * Weekly test: integers + patterns + times tables (facts & mental strategies).
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

  const selected = bank.slice(0, 5);
  const patterns = toQuizQuestions(generatePatternQuestions(3, rng));
  const tables = generateTimesTableQuestions(4, rng, {
    maxFactor: 12,
    includeStrategyQs: true,
  }).map((q) => ({
    ...q,
    id: `week-tt-${q.id}`,
    prompt: q.prompt.startsWith("What is")
      ? `[Times tables] ${q.prompt}`
      : `[Times tables] ${q.prompt}`,
  }));
  const all = [...selected, ...patterns, ...tables];

  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [all[i], all[j]] = [all[j]!, all[i]!];
  }

  return all.slice(0, 12);
}

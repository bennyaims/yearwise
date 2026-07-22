import type { QuizQuestion, SolveStep } from "./types";
import { MASTERY_TARGET } from "./types";

export type PracticeItem = QuizQuestion & { source: "original" | "variant" | "generated" };

/**
 * Build a full text-based solve guide for a question.
 * Prefer author-provided solveSteps; otherwise generate a solid default path.
 */
export function buildSolveSteps(question: QuizQuestion): SolveStep[] {
  if (question.solveSteps && question.solveSteps.length > 0) {
    return question.solveSteps;
  }

  const correct = question.options[question.correctIndex];
  const wrong = question.options.filter((_, i) => i !== question.correctIndex);

  return [
    {
      id: "s1-read",
      title: "Step 1 — Read the question carefully",
      teaching: `Slow down and read this once out loud:\n\n“${question.prompt}”\n\nUnderline (or note) what you are being asked for. Ignore extra detail that does not change the answer.`,
      check: {
        prompt: "What should you do first?",
        options: [
          "Guess the longest option",
          "Identify exactly what the question is asking",
          "Skip to a random answer",
          "Only read the last word",
        ],
        correctIndex: 1,
        hint: "Always start by naming the goal of the question in your own words.",
      },
    },
    {
      id: "s2-clues",
      title: "Step 2 — Gather the clues",
      teaching: `List the facts you are given. For multiple-choice, also glance at the option styles so you know what form the answer should take (a number, a name, a definition, etc.).\n\nOptions available:\n${question.options.map((o, i) => `  ${String.fromCharCode(65 + i)}. ${o}`).join("\n")}`,
      check: {
        prompt: "Which option shape matches what the question wants?",
        options: [
          "Any random string is fine",
          `Something like: “${correct}” (same kind of answer)`,
          "Only a full essay",
          "A blank page",
        ],
        correctIndex: 1,
        hint: "Match the type of answer the question is asking for.",
      },
    },
    {
      id: "s3-method",
      title: "Step 3 — Choose a method",
      teaching: `Use a reliable method, not a guess:\n\n• Restate the question in simpler words.\n• Recall the rule, formula, definition, or historical fact that applies.\n• Eliminate options you know are wrong.\n• Work toward one clear choice.\n\nWe are aiming for: ${correct}`,
      check: {
        prompt: "If two options look possible, what is best?",
        options: [
          "Pick the first one and move on",
          "Test both against the rule/fact and eliminate the weaker one",
          "Always pick C",
          "Close the app",
        ],
        correctIndex: 1,
        hint: "Elimination + checking against a rule beats lucky guessing.",
      },
    },
    (() => {
      const worked = shuffleKeepingCorrect(
        [correct, ...wrong.slice(0, 3)],
        correct,
      );
      return {
        id: "s4-work",
        title: "Step 4 — Work it through",
        teaching: `Here is the reasoning for this question:\n\n${question.explanation}\n\nRead it slowly. Point to each idea and make sure you could explain it to a friend.`,
        check: {
          prompt: "According to the worked reasoning, the correct answer is:",
          options: worked.options,
          correctIndex: worked.correctIndex,
          hint: question.explanation,
        },
      };
    })(),
    {
      id: "s5-check",
      title: "Step 5 — Check and lock it in",
      teaching: `Final check:\n\n• Does “${correct}” actually answer the question asked?\n• Why are the other options wrong?\n${wrong.map((w) => `  – “${w}” does not fit: compare it to the reasoning above.`).join("\n")}\n\nWhen you can explain both the right answer and why the others fail, you are ready to try alone.`,
      check: {
        prompt: "You are ready for independent practice when you can:",
        options: [
          "Only memorise the letter of the answer",
          "Solve the whole question and explain why other options fail",
          "Skip reading the question",
          "Rely on someone else forever",
        ],
        correctIndex: 1,
        hint: "Mastery means you can do it yourself and explain it.",
      },
    },
  ];
}

function shuffleKeepingCorrect(
  options: string[],
  correct: string,
): { options: string[]; correctIndex: number } {
  const unique = Array.from(new Set(options.filter(Boolean)));
  if (!unique.includes(correct)) unique.unshift(correct);
  // Stable-ish shuffle by rotating so correct is not always first
  const rotate = correct.length % unique.length;
  const rotated = [...unique.slice(rotate), ...unique.slice(0, rotate)];
  return {
    options: rotated,
    correctIndex: rotated.indexOf(correct),
  };
}

/**
 * Build a pool of practice questions for independent mastery.
 * Always includes enough items to reach MASTERY_TARGET.
 */
export function buildPracticePool(question: QuizQuestion): PracticeItem[] {
  const pool: PracticeItem[] = [];

  // Author variants first
  for (const v of question.practiceVariants ?? []) {
    pool.push({ ...v, source: "variant" });
  }

  // Generated conceptual drills from the same stem/explanation
  const generated = generatePracticeItems(question, MASTERY_TARGET + 3);
  for (const g of generated) {
    if (pool.length >= MASTERY_TARGET + 4) break;
    // Avoid exact duplicate prompts already in pool
    if (pool.some((p) => p.prompt === g.prompt)) continue;
    pool.push(g);
  }

  // Guarantee minimum size
  while (pool.length < MASTERY_TARGET) {
    const n = pool.length + 1;
    const shuffled = shuffleOptions(question);
    pool.push({
      ...shuffled,
      id: `${question.id}-pad-${n}`,
      prompt: `(Practice ${n}) ${question.prompt}`,
      source: "generated",
    });
  }

  return pool;
}

function shuffleOptions(q: QuizQuestion): QuizQuestion {
  const pairs = q.options.map((opt, i) => ({
    opt,
    correct: i === q.correctIndex,
  }));
  // Deterministic shuffle from id
  let seed = hashString(q.id + q.prompt);
  for (let i = pairs.length - 1; i > 0; i--) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const j = seed % (i + 1);
    [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
  }
  return {
    ...q,
    options: pairs.map((p) => p.opt),
    correctIndex: pairs.findIndex((p) => p.correct),
  };
}

function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function generatePracticeItems(
  question: QuizQuestion,
  count: number,
): PracticeItem[] {
  const items: PracticeItem[] = [];
  const correct = question.options[question.correctIndex];
  const wrong = question.options.filter((_, i) => i !== question.correctIndex);

  // 1) Same skill — shuffled options
  {
    const s = shuffleOptions({ ...question, id: `${question.id}-gen-restate` });
    items.push({
      id: `${question.id}-gen-restate`,
      prompt: `Same skill check: ${question.prompt}`,
      options: s.options,
      correctIndex: s.correctIndex,
      explanation: question.explanation,
      source: "generated",
    });
  }

  // 2) Why is the answer right?
  items.push({
    id: `${question.id}-gen-why`,
    prompt: `Why is “${correct}” the best answer to: “${question.prompt}”?`,
    options: [
      question.explanation,
      "Because it is the first option listed.",
      "Because longer answers are always right.",
      "There is no reason — pure luck.",
    ],
    correctIndex: 0,
    explanation: question.explanation,
    source: "generated",
  });

  // 3) Eliminate a wrong answer
  if (wrong[0]) {
    items.push({
      id: `${question.id}-gen-elim`,
      prompt: `For “${question.prompt}”, why is “${wrong[0]}” not correct?`,
      options: [
        `It conflicts with: ${question.explanation}`,
        "It is always correct in every question",
        "Wrong answers do not exist",
        "Because the question has no right answer",
      ],
      correctIndex: 0,
      explanation: `“${wrong[0]}” is wrong because: ${question.explanation}`,
      source: "generated",
    });
  }

  // 4) True / false on the explanation
  items.push({
    id: `${question.id}-gen-tf`,
    prompt: `True or false? ${question.explanation}`,
    options: ["True", "False", "Only true on weekends", "Cannot say"],
    correctIndex: 0,
    explanation: "That statement matches the correct reasoning for this skill.",
    source: "generated",
  });

  // 5) Pick the correct option from a fresh order
  {
    const s = shuffleOptions({ ...question, id: `${question.id}-gen-pick` });
    items.push({
      id: `${question.id}-gen-pick`,
      prompt: `Solve independently: ${question.prompt}`,
      options: s.options,
      correctIndex: s.correctIndex,
      explanation: question.explanation,
      source: "generated",
    });
  }

  // 6) What would a wrong method look like?
  items.push({
    id: `${question.id}-gen-trap`,
    prompt: `Someone guesses without reasoning on: “${question.prompt}”. What should they do instead?`,
    options: [
      "Read carefully, apply the rule/fact, eliminate, then choose",
      "Always choose the last option",
      "Change the question to something easier and leave",
      "Memorise only the letter A",
    ],
    correctIndex: 0,
    explanation:
      "Independent solving means using a method you can repeat — not lucky guesses.",
    source: "generated",
  });

  // 7) Spot the correct answer among distractors again
  {
    const s = shuffleOptions({ ...question, id: `${question.id}-gen-spot` });
    items.push({
      id: `${question.id}-gen-spot`,
      prompt: `Quick mastery check — select the correct answer:\n${question.prompt}`,
      options: s.options,
      correctIndex: s.correctIndex,
      explanation: question.explanation,
      source: "generated",
    });
  }

  // 8–N) Extra shuffled stems for longer mastery runs
  for (let n = 0; items.length < count; n++) {
    const s = shuffleOptions({
      ...question,
      id: `${question.id}-gen-extra-${n}`,
    });
    items.push({
      id: `${question.id}-gen-extra-${n}`,
      prompt: `(Practice set ${n + 1}) ${question.prompt}`,
      options: s.options,
      correctIndex: s.correctIndex,
      explanation: question.explanation,
      source: "generated",
    });
  }

  return items.slice(0, count);
}

export function isAnswerCorrect(
  question: Pick<QuizQuestion, "correctIndex">,
  chosenIndex: number | null | undefined,
): boolean {
  return chosenIndex === question.correctIndex;
}

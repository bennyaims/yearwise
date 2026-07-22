/**
 * Times tables practice + mental speed strategies.
 * Tests 1–12 facts and teaches ways to work them out in your head fast.
 */

import type { QuizQuestion } from "@/lib/types";

export type TimesStrategy = {
  id: string;
  title: string;
  /** One-line hook */
  hook: string;
  body: string;
  example: string;
  /** Which factors this mainly helps */
  helps: string;
  level: "starter" | "builder" | "pro";
};

/** Great ways to speed up mental times tables */
export const TIMES_STRATEGIES: TimesStrategy[] = [
  {
    id: "commute",
    title: "Flip it (commutative)",
    hook: "3×8 is the same as 8×3 — pick the easier way round.",
    body: "Multiplication is commutative: a×b = b×a. If you know your 8 times table better than your 3s, flip the question. Always ask: “Which way is faster for me?”",
    example: "3×9 → think 9×3 = 27. Or 7×4 → 4×7 = 28.",
    helps: "Any pair",
    level: "starter",
  },
  {
    id: "doubles",
    title: "Doubles & double-double",
    hook: "×2 is double; ×4 is double then double again.",
    body: "×2: double the number. ×4: double, then double again. ×8: double three times. This is often faster than counting up.",
    example: "7×4: 7→14→28. 6×8: 6→12→24→48.",
    helps: "2, 4, 8 tables",
    level: "starter",
  },
  {
    id: "fives",
    title: "Fives from tens",
    hook: "×5 = half of ×10 (for whole numbers).",
    body: "n×5 = (n×10)÷2. Multiply by 10 (add a zero), then half. Even n ends in 0; odd n ends in 5.",
    example: "8×5: 80÷2 = 40. 7×5: 70÷2 = 35.",
    helps: "5 table",
    level: "starter",
  },
  {
    id: "nines",
    title: "Nines: 10× minus the number",
    hook: "n×9 = n×10 − n.",
    body: "Multiply by 10, then subtract the original number. Check: digits of a 9× fact (for 1–10) add to 9 (e.g. 36 → 3+6=9).",
    example: "7×9: 70−7 = 63. 6×9: 60−6 = 54.",
    helps: "9 table",
    level: "builder",
  },
  {
    id: "elevens",
    title: "Elevens (two-digit split)",
    hook: "For 11× a single digit, write the digit twice; for 11×ab use the middle-sum trick.",
    body: "11×4 = 44. For 11×23: 2 and 3 with 2+3=5 in the middle → 253. If the middle sum is 10+, carry 1.",
    example: "11×6 = 66. 11×47: 4, 4+7=11 → write 1 carry, 7 → 517.",
    helps: "11 table",
    level: "builder",
  },
  {
    id: "distribute",
    title: "Break it up (distributive)",
    hook: "Hard facts = easy chunks added.",
    body: "a×(b+c) = a×b + a×c. Split a tough factor into 5+2, 10−1, etc. This is the pro mental move for 6s, 7s, 8s.",
    example: "7×8 = 7×(5+3) = 35+21 = 56. Or 7×8 = 7×10 − 7×2 = 70−14 = 56.",
    helps: "6, 7, 8 tables",
    level: "pro",
  },
  {
    id: "squares",
    title: "Square anchors",
    hook: "Memorise squares 1²–12² as landmarks.",
    body: "Near a square: (n+1)×n = n²+n, (n−1)×n = n²−n. Squares you know unlock neighbours.",
    example: "Know 8²=64 → 8×7 = 64−8 = 56. 9×9=81 → 9×8 = 81−9 = 72.",
    helps: "Near-square products",
    level: "pro",
  },
  {
    id: "zeros",
    title: "Zeros & place value",
    hook: "×10, ×100 first; then adjust.",
    body: "n×10 appends a zero; n×100 two zeros. For 20×6 think 2×6=12 then ×10 → 120. Keep place value separate from the hard digit product.",
    example: "30×7 = 3×7×10 = 210. 12×5 = 10×5 + 2×5 = 50+10 = 60.",
    helps: "Larger mental products",
    level: "builder",
  },
  {
    id: "clock",
    title: "Speed habit: see · say · check",
    hook: "2 seconds to attempt, then verify with a strategy.",
    body: "1) Read a×b. 2) Instant answer if known. 3) If not, pick one strategy (double, 10−n, break up). 4) Quick check: reverse (÷) or digit reasonableness.",
    example: "Stuck on 6×7? Break: 6×5+6×2 = 30+12 = 42. Check: 42÷6 = 7.",
    helps: "All tables under time",
    level: "pro",
  },
];

export type TimesDrillMode = "mixed" | "focus" | "speed" | "strategy";

function randInt(min: number, max: number, rng: () => number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function pick<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)]!;
}

function shuffleOptions(
  correct: number,
  rng: () => number,
  extra?: number[],
): { options: string[]; correctIndex: number } {
  const set = new Set<number>([correct, ...(extra ?? [])]);
  while (set.size < 4) {
    const noise = correct + randInt(-8, 8, rng);
    if (noise > 0 && noise !== correct) set.add(noise);
    else set.add(randInt(1, 144, rng));
  }
  const nums = [...set].slice(0, 4);
  // ensure correct is in list
  if (!nums.includes(correct)) nums[0] = correct;
  for (let i = nums.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [nums[i], nums[j]] = [nums[j]!, nums[i]!];
  }
  return {
    options: nums.map(String),
    correctIndex: nums.indexOf(correct),
  };
}

function strategyHint(a: number, b: number): string {
  const x = Math.min(a, b);
  const y = Math.max(a, b);
  if (x === 2) return `Strategy: double ${y} → ${2 * y}.`;
  if (x === 4) return `Strategy: double ${y} twice → ${y}→${2 * y}→${4 * y}.`;
  if (x === 5) return `Strategy: ${y}×10 = ${y * 10}, half → ${y * 5}.`;
  if (x === 9) return `Strategy: ${y}×10 − ${y} = ${y * 10}−${y} = ${y * 9}.`;
  if (x === 11 && y < 10) return `Strategy: write ${y} twice → ${y}${y}.`;
  if (x === 8) return `Strategy: double three times from ${y}.`;
  if (x === 6 || x === 7)
    return `Strategy: break up — e.g. ${y}×5 + ${y}×${x - 5} = ${y * 5}+${y * (x - 5)} = ${x * y}.`;
  return `Strategy: flip if needed (${y}×${x}), or break into tens and ones.`;
}

/**
 * Generate times-tables quiz questions.
 * @param focusFactor if set (2–12), weight that table
 */
export function generateTimesTableQuestions(
  count: number,
  rng: () => number = Math.random,
  opts?: {
    minFactor?: number;
    maxFactor?: number;
    focusFactor?: number;
    /** Include a few strategy-choice questions */
    includeStrategyQs?: boolean;
  },
): QuizQuestion[] {
  const minF = opts?.minFactor ?? 1;
  const maxF = opts?.maxFactor ?? 12;
  const focus = opts?.focusFactor;
  const out: QuizQuestion[] = [];
  const used = new Set<string>();

  while (out.length < count) {
    let a = randInt(minF, maxF, rng);
    let b = randInt(minF, maxF, rng);
    if (focus && rng() < 0.55) {
      if (rng() < 0.5) a = focus;
      else b = focus;
    }
    // Prefer “harder” cells sometimes
    if (rng() < 0.25) {
      a = randInt(6, 12, rng);
      b = randInt(6, 12, rng);
    }
    const key = `${Math.min(a, b)}x${Math.max(a, b)}`;
    if (used.has(key) && used.size < 50) continue;
    used.add(key);

    const product = a * b;
    const { options, correctIndex } = shuffleOptions(product, rng, [
      a * (b + 1),
      (a + 1) * b,
      a + b,
      product + a,
    ]);

    out.push({
      id: `tt-${a}x${b}-${out.length}`,
      prompt: `What is ${a} × ${b}?`,
      options,
      correctIndex,
      explanation: `${a} × ${b} = ${product}. ${strategyHint(a, b)}`,
    });
  }

  if (opts?.includeStrategyQs !== false) {
    // Replace last 2 with strategy recognition items
    const stratQs = buildStrategyQuestions(2, rng);
    for (let i = 0; i < stratQs.length && out.length > 0; i++) {
      out[out.length - 1 - i] = stratQs[i]!;
    }
  }

  return out;
}

function buildStrategyQuestions(
  count: number,
  rng: () => number,
): QuizQuestion[] {
  const bank: QuizQuestion[] = [
    {
      id: "tt-s-9",
      prompt: "Fastest mental route for 7 × 9?",
      options: [
        "Count 7 nine times on fingers only",
        "7×10 − 7 = 70 − 7 = 63",
        "Add 7+9",
        "Guess 72",
      ],
      correctIndex: 1,
      explanation: "n×9 = n×10 − n. 70−7=63.",
    },
    {
      id: "tt-s-5",
      prompt: "Fastest mental route for 8 × 5?",
      options: [
        "8×10 then half → 80÷2 = 40",
        "8+5 = 13",
        "Only use a calculator",
        "8×8 = 64",
      ],
      correctIndex: 0,
      explanation: "×5 is half of ×10 for whole numbers.",
    },
    {
      id: "tt-s-4",
      prompt: "What is a fast way to do 6 × 4 in your head?",
      options: [
        "Double 6 → 12, double again → 24",
        "6−4 = 2",
        "Write 46",
        "Only skip-count from 100",
      ],
      correctIndex: 0,
      explanation: "×4 = double double.",
    },
    {
      id: "tt-s-dist",
      prompt: "Use break-up for 7 × 8:",
      options: [
        "7×5 + 7×3 = 35+21 = 56",
        "7+8 = 15",
        "78",
        "7×7 = 49 only",
      ],
      correctIndex: 0,
      explanation: "Distributive property: split 8 into 5+3.",
    },
    {
      id: "tt-s-flip",
      prompt: "Why might you compute 3 × 12 as 12 × 3?",
      options: [
        "Because order never matters for addition only",
        "Commutative: same product, often easier fact",
        "It changes the answer",
        "Multiplication is not allowed to flip",
      ],
      correctIndex: 1,
      explanation: "a×b = b×a — flip to the table you know better.",
    },
    {
      id: "tt-s-sq",
      prompt: "If 9² = 81, then 9 × 8 is:",
      options: ["81 − 9 = 72", "81 + 9 = 90", "9+8=17", "89"],
      correctIndex: 0,
      explanation: "n×(n−1) = n² − n.",
    },
  ];
  const shuffled = [...bank];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
  }
  return shuffled.slice(0, count).map((q, i) => ({ ...q, id: `${q.id}-${i}` }));
}

/** Compact bank for year exams / weekly tests */
export function timesTablesForExam(
  count: number,
  year: number,
  rng: () => number,
): QuizQuestion[] {
  // Higher years: larger factors, more strategy Qs
  const maxF = year <= 7 ? 10 : year <= 9 ? 12 : 12;
  const minF = year >= 10 ? 2 : 1;
  return generateTimesTableQuestions(count, rng, {
    minFactor: minF,
    maxFactor: maxF,
    includeStrategyQs: true,
  }).map((q) => ({
    ...q,
    id: `exam-tt-${q.id}`,
    prompt: q.prompt.startsWith("What is")
      ? `[Times tables] ${q.prompt}`
      : `[Times tables · strategy] ${q.prompt}`,
  }));
}

export function makeRng(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

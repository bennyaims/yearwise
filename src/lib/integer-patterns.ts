/**
 * Randomised integer pattern teachings & questions.
 * Count by any step from negative ↔ positive.
 */

export type PatternTeaching = {
  id: string;
  title: string;
  body: string;
  example: string;
};

export type PatternQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

function randInt(min: number, max: number, rng: () => number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function pick<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)]!;
}

/** Mulberry32 — seeded PRNG for stable-ish daily sets */
export function makeRng(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function daySeed(date = new Date()): number {
  return (
    date.getFullYear() * 10000 +
    (date.getMonth() + 1) * 100 +
    date.getDate()
  );
}

export function buildSequence(
  start: number,
  step: number,
  count: number,
): number[] {
  const seq: number[] = [];
  for (let i = 0; i < count; i++) seq.push(start + i * step);
  return seq;
}

export function formatInt(n: number): string {
  return n < 0 ? `−${Math.abs(n)}` : String(n);
}

export function formatSeq(seq: number[]): string {
  return seq.map(formatInt).join(", ");
}

/** Generate a bank of pattern teachings (randomised each call) */
export function generateTeachings(
  count: number,
  rng: () => number = Math.random,
): PatternTeaching[] {
  const teachings: PatternTeaching[] = [];
  const steps = [1, 2, 3, 4, 5, 6, 10];
  const used = new Set<string>();

  while (teachings.length < count) {
    const step = pick(steps, rng);
    const rising = rng() > 0.45;
    const dir = rising ? 1 : -1;
    const actualStep = step * dir;
    const start = rising
      ? randInt(-20, 5, rng)
      : randInt(-5, 20, rng);
    const seq = buildSequence(start, actualStep, 6);
    const key = `${start}:${actualStep}`;
    if (used.has(key)) continue;
    used.add(key);

    const directionWord = rising
      ? "up (left → right on the number line, negative toward positive)"
      : "down (right → left, positive toward negative)";

    teachings.push({
      id: `teach-${teachings.length}-${key}`,
      title: `Count by ${formatInt(actualStep)} from ${formatInt(start)}`,
      body: `Start at ${formatInt(start)}. Move ${directionWord} in jumps of ${step}.\nEach jump adds ${formatInt(actualStep)} to the previous number.\nWatch zero carefully — the pattern keeps going through zero without stopping.`,
      example: formatSeq(seq),
    });
  }
  return teachings;
}

function shuffleOptions(
  correct: string,
  wrongs: string[],
  rng: () => number,
): { options: string[]; correctIndex: number } {
  const opts = [correct, ...wrongs.slice(0, 3)];
  const unique = Array.from(new Set(opts));
  while (unique.length < 4) {
    unique.push(formatInt(randInt(-30, 30, rng)));
  }
  // Fisher-Yates
  for (let i = unique.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [unique[i], unique[j]] = [unique[j]!, unique[i]!];
  }
  return { options: unique, correctIndex: unique.indexOf(correct) };
}

/** Generate multiple-choice pattern questions */
export function generatePatternQuestions(
  count: number,
  rng: () => number = Math.random,
): PatternQuestion[] {
  const questions: PatternQuestion[] = [];
  const steps = [1, 2, 3, 4, 5, 6, 10];

  for (let i = 0; i < count; i++) {
    const kind = randInt(0, 5, rng);
    const step = pick(steps, rng);
    const rising = rng() > 0.4;
    const actualStep = rising ? step : -step;
    const start = rising ? randInt(-15, 8, rng) : randInt(-8, 15, rng);
    const seq = buildSequence(start, actualStep, 5);
    const blankAt = randInt(1, 3, rng);
    const missing = seq[blankAt]!;
    const shown = seq.map((n, idx) =>
      idx === blankAt ? "□" : formatInt(n),
    );

    if (kind === 0) {
      // Fill the blank in the sequence
      const wrongs = [
        formatInt(missing + actualStep),
        formatInt(missing - actualStep),
        formatInt(missing + step),
        formatInt(-missing),
      ];
      const { options, correctIndex } = shuffleOptions(
        formatInt(missing),
        wrongs,
        rng,
      );
      questions.push({
        id: `pq-blank-${i}`,
        prompt: `Pattern (count by ${formatInt(actualStep)}): ${shown.join(", ")}. What number belongs in the box?`,
        options,
        correctIndex,
        explanation: `The rule is add ${formatInt(actualStep)} each time. The missing term is ${formatInt(missing)}. Full pattern: ${formatSeq(seq)}.`,
      });
    } else if (kind === 1) {
      // Next term
      const next = start + 5 * actualStep;
      const wrongs = [
        formatInt(next + actualStep),
        formatInt(next - actualStep),
        formatInt(seq[4]! + step),
        formatInt(-next),
      ];
      const { options, correctIndex } = shuffleOptions(
        formatInt(next),
        wrongs,
        rng,
      );
      questions.push({
        id: `pq-next-${i}`,
        prompt: `Continue the pattern: ${formatSeq(seq)}, … What comes next?`,
        options,
        correctIndex,
        explanation: `Each term increases by ${formatInt(actualStep)}. After ${formatInt(seq[4]!)} comes ${formatInt(next)}.`,
      });
    } else if (kind === 2) {
      // What is the step?
      const a = seq[0]!;
      const b = seq[1]!;
      const wrongs = [
        formatInt(-(b - a)),
        formatInt(Math.abs(b - a) + 1),
        formatInt(1),
        formatInt(b),
      ];
      const { options, correctIndex } = shuffleOptions(
        formatInt(b - a),
        wrongs,
        rng,
      );
      questions.push({
        id: `pq-step-${i}`,
        prompt: `In the pattern ${formatSeq(seq.slice(0, 4))}, what is the constant step (common difference)?`,
        options,
        correctIndex,
        explanation: `${formatInt(b)} − ${formatInt(a)} = ${formatInt(b - a)}. Every jump uses that same step.`,
      });
    } else if (kind === 3) {
      // Cross zero awareness
      const crossStart = -2 * step;
      const crossSeq = buildSequence(crossStart, step, 5);
      const ans = crossSeq[2]!; // should be near zero
      const wrongs = [
        formatInt(ans + step),
        formatInt(ans - step),
        formatInt(step),
        "undefined",
      ];
      const { options, correctIndex } = shuffleOptions(
        formatInt(ans),
        wrongs,
        rng,
      );
      questions.push({
        id: `pq-zero-${i}`,
        prompt: `Counting up by ${step} from ${formatInt(crossStart)}: ${formatSeq(crossSeq.slice(0, 2))}, □, ${formatSeq(crossSeq.slice(3))}. Fill □ (patterns continue through zero).`,
        options,
        correctIndex,
        explanation: `Zero is just another integer on the line. Pattern: ${formatSeq(crossSeq)}.`,
      });
    } else if (kind === 4) {
      // Compare two positions after counting
      const from = randInt(-10, 5, rng);
      const jumps = randInt(2, 6, rng);
      const land = from + jumps * actualStep;
      const wrongs = [
        formatInt(from + jumps * -actualStep),
        formatInt(from + jumps),
        formatInt(land + actualStep),
        formatInt(jumps),
      ];
      const { options, correctIndex } = shuffleOptions(
        formatInt(land),
        wrongs,
        rng,
      );
      questions.push({
        id: `pq-jumps-${i}`,
        prompt: `Start at ${formatInt(from)}. Count by ${formatInt(actualStep)} for ${jumps} jumps. Where do you land?`,
        options,
        correctIndex,
        explanation: `${formatInt(from)} + ${jumps} × (${formatInt(actualStep)}) = ${formatInt(land)}.`,
      });
    } else {
      // Which sequence is correct?
      const good = formatSeq(seq.slice(0, 4));
      const bad1 = formatSeq(
        buildSequence(start, -actualStep, 4),
      );
      const bad2 = formatSeq(
        buildSequence(start, actualStep + (rising ? 1 : -1), 4),
      );
      const bad3 = formatSeq(
        buildSequence(start + 1, actualStep, 4),
      );
      const { options, correctIndex } = shuffleOptions(good, [bad1, bad2, bad3], rng);
      questions.push({
        id: `pq-which-${i}`,
        prompt: `Which sequence correctly counts by ${formatInt(actualStep)} starting at ${formatInt(start)}?`,
        options,
        correctIndex,
        explanation: `Correct pattern: ${good}. Each term differs by ${formatInt(actualStep)}.`,
      });
    }
  }

  return questions;
}

/** Convert pattern questions into QuizQuestion shape */
export function toQuizQuestions(qs: PatternQuestion[]) {
  return qs.map((q) => ({
    id: q.id,
    prompt: q.prompt,
    options: q.options,
    correctIndex: q.correctIndex,
    explanation: q.explanation,
  }));
}

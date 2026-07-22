/**
 * Self-paced curriculum progression.
 * Strong students can accelerate; everyone still gets core teaching when needed.
 */

const KEY = "yearwise-self-pace-v1";

/** Quiz % that counts as mastery (unlock accelerate options) */
export const MASTERY_PERCENT = 85;
/** Diagnostic % to skip full guided path */
export const DIAGNOSTIC_PASS = 80;
/** Recent high scores needed to default into Fast track */
export const STREAK_FOR_DEFAULT_FAST = 3;

export type SelfPaceState = {
  /** Running list of recent quiz percents (newest last) */
  recentScores: number[];
  /** Prefer Fast track UI when true */
  preferFastTrack: boolean;
  /** Total lessons completed via acceleration */
  acceleratedCompletions: number;
  /** Total mastery completions (≥ MASTERY_PERCENT) */
  masteryCount: number;
  updatedAt: string;
};

export function defaultSelfPace(): SelfPaceState {
  return {
    recentScores: [],
    preferFastTrack: false,
    acceleratedCompletions: 0,
    masteryCount: 0,
    updatedAt: new Date().toISOString(),
  };
}

export function loadSelfPace(): SelfPaceState {
  if (typeof window === "undefined") return defaultSelfPace();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultSelfPace();
    return { ...defaultSelfPace(), ...JSON.parse(raw) };
  } catch {
    return defaultSelfPace();
  }
}

export function saveSelfPace(state: SelfPaceState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function recordQuizResult(
  percent: number,
  opts?: { accelerated?: boolean },
): SelfPaceState {
  const state = loadSelfPace();
  state.recentScores = [...state.recentScores, percent].slice(-12);
  if (percent >= MASTERY_PERCENT) {
    state.masteryCount += 1;
  }
  if (opts?.accelerated) {
    state.acceleratedCompletions += 1;
  }
  // Auto-enable preferred fast track after a streak of strong scores
  const tail = state.recentScores.slice(-STREAK_FOR_DEFAULT_FAST);
  if (
    tail.length >= STREAK_FOR_DEFAULT_FAST &&
    tail.every((s) => s >= MASTERY_PERCENT)
  ) {
    state.preferFastTrack = true;
  }
  // Drop out of prefer-fast if struggling
  if (percent < 50) {
    state.preferFastTrack = false;
  }
  state.updatedAt = new Date().toISOString();
  saveSelfPace(state);
  return state;
}

export function setPreferFastTrack(on: boolean): SelfPaceState {
  const state = loadSelfPace();
  state.preferFastTrack = on;
  state.updatedAt = new Date().toISOString();
  saveSelfPace(state);
  return state;
}

export function averageRecentScore(state = loadSelfPace()): number | null {
  if (state.recentScores.length === 0) return null;
  const sum = state.recentScores.reduce((a, b) => a + b, 0);
  return Math.round(sum / state.recentScores.length);
}

export function isMastery(percent: number): boolean {
  return percent >= MASTERY_PERCENT;
}

export function diagnosticPassed(percent: number): boolean {
  return percent >= DIAGNOSTIC_PASS;
}

export function paceLabel(state = loadSelfPace()): string {
  if (state.preferFastTrack) return "Fast track (self-paced)";
  const avg = averageRecentScore(state);
  if (avg != null && avg >= MASTERY_PERCENT) return "Strong — ready to accelerate";
  if (avg != null && avg < 55) return "Steady — use guided path";
  return "Standard curriculum pace";
}

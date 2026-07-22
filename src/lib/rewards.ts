/**
 * Device-local rewards: stars, badges, weekly test scores.
 * Also feeds game coins (see game-economy).
 */

import { grantTestCoins } from "./game-economy";

export type BadgeId =
  | "first-lesson"
  | "five-lessons"
  | "ten-lessons"
  | "week-warrior"
  | "pattern-pro"
  | "test-pass"
  | "test-high"
  | "streak-3"
  | "block-champion"
  | "language-fluent"
  | "cs-ai-builder"
  | "cs-ai-defender";

export type Badge = {
  id: BadgeId;
  name: string;
  description: string;
  icon: string;
};

export const BADGES: Badge[] = [
  {
    id: "first-lesson",
    name: "First step",
    description: "Completed your first lesson",
    icon: "🌱",
  },
  {
    id: "five-lessons",
    name: "Getting serious",
    description: "Completed 5 lessons",
    icon: "📘",
  },
  {
    id: "ten-lessons",
    name: "Knowledge builder",
    description: "Completed 10 lessons",
    icon: "🏅",
  },
  {
    id: "week-warrior",
    name: "Week warrior",
    description: "Finished this week’s test",
    icon: "⚔️",
  },
  {
    id: "pattern-pro",
    name: "Pattern pro",
    description: "Mastered an integer patterns block",
    icon: "🔢",
  },
  {
    id: "test-pass",
    name: "Weekly pass",
    description: "Scored 70%+ on a weekly test",
    icon: "✅",
  },
  {
    id: "test-high",
    name: "High distinction",
    description: "Scored 90%+ on a weekly test",
    icon: "🌟",
  },
  {
    id: "streak-3",
    name: "3-day streak",
    description: "Studied on 3 different days",
    icon: "🔥",
  },
  {
    id: "block-champion",
    name: "Block champion",
    description: "Completed 3 study blocks in one day",
    icon: "⏰",
  },
  {
    id: "language-fluent",
    name: "Fluent graduate",
    description: "Completed a full Y7–Y12 language pathway + Fluency Exit Gate",
    icon: "🗣️",
  },
  {
    id: "cs-ai-builder",
    name: "AI builder",
    description: "Completed CS capstone: build an AI system with code",
    icon: "🤖",
  },
  {
    id: "cs-ai-defender",
    name: "AI defender",
    description: "Completed CS exit on defending against AI dominance & misuse",
    icon: "🛡️",
  },
];

export type WeeklyTestResult = {
  weekKey: string;
  score: number;
  total: number;
  percent: number;
  starsEarned: number;
  completedAt: string;
};

export type RewardsState = {
  stars: number;
  badges: BadgeId[];
  weeklyTests: WeeklyTestResult[];
  lastLessonCompleteAt?: string;
};

const REWARDS_KEY = "yearwise-rewards-v1";

export function loadRewards(): RewardsState {
  if (typeof window === "undefined") {
    return { stars: 0, badges: [], weeklyTests: [] };
  }
  try {
    const raw = localStorage.getItem(REWARDS_KEY);
    if (!raw) return { stars: 0, badges: [], weeklyTests: [] };
    return JSON.parse(raw) as RewardsState;
  } catch {
    return { stars: 0, badges: [], weeklyTests: [] };
  }
}

export function saveRewards(state: RewardsState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(REWARDS_KEY, JSON.stringify(state));
}

export function weekKey(d = new Date()): string {
  // ISO-ish week: year-Wxx using Thursday rule simplified
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(
    ((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
  );
  return `${date.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

function unlockBadge(state: RewardsState, id: BadgeId): boolean {
  if (state.badges.includes(id)) return false;
  state.badges.push(id);
  state.stars += 5;
  return true;
}

export type RewardEvent = {
  starsGained: number;
  newBadges: BadgeId[];
  message: string;
  coinsGained?: number;
  characterUnlock?: string;
};

/** Call after a lesson is marked complete */
export function grantLessonRewards(opts: {
  lessonsCompletedTotal: number;
  isPatternLesson?: boolean;
  blocksToday?: number;
  distinctStudyDays?: number;
  /** Completed language Fluency Exit Gate */
  languageFluentExit?: boolean;
  csAiBuilder?: boolean;
  csAiDefender?: boolean;
  /** For coin grants */
  claimKey?: string;
  quizPercent?: number;
  subject?: string;
}): RewardEvent {
  const state = loadRewards();
  let starsGained = 10;
  const newBadges: BadgeId[] = [];

  const big =
    opts.languageFluentExit || opts.csAiBuilder || opts.csAiDefender;
  state.stars += big ? 50 : 10;
  if (big) starsGained = 50;
  state.lastLessonCompleteAt = new Date().toISOString();

  const tryBadge = (id: BadgeId) => {
    if (unlockBadge(state, id)) {
      newBadges.push(id);
      starsGained += 5;
    }
  };

  if (opts.lessonsCompletedTotal >= 1) tryBadge("first-lesson");
  if (opts.lessonsCompletedTotal >= 5) tryBadge("five-lessons");
  if (opts.lessonsCompletedTotal >= 10) tryBadge("ten-lessons");
  if (opts.isPatternLesson) tryBadge("pattern-pro");
  if ((opts.blocksToday ?? 0) >= 3) tryBadge("block-champion");
  if ((opts.distinctStudyDays ?? 0) >= 3) tryBadge("streak-3");
  if (opts.languageFluentExit) tryBadge("language-fluent");
  if (opts.csAiBuilder) tryBadge("cs-ai-builder");
  if (opts.csAiDefender) tryBadge("cs-ai-defender");

  saveRewards(state);

  // Game coins from quiz score (all subjects)
  let coinsGained = 0;
  let characterUnlock: string | undefined;
  if (opts.claimKey && opts.quizPercent != null) {
    const coin = grantTestCoins({
      claimKey: opts.claimKey,
      percent: opts.quizPercent,
      source: "lesson-quiz",
      subject: opts.subject,
    });
    coinsGained = coin.coinsGained;
    characterUnlock = coin.characterUnlock;
  }

  const badgeNames = newBadges
    .map((id) => BADGES.find((b) => b.id === id)?.name)
    .filter(Boolean)
    .join(", ");

  const parts = [
    `+${starsGained} stars`,
    coinsGained > 0 ? `+${coinsGained} coins` : null,
    newBadges.length > 0 ? `badge: ${badgeNames}` : null,
    characterUnlock ? `character: ${characterUnlock}` : null,
  ].filter(Boolean);

  return {
    starsGained,
    newBadges,
    coinsGained,
    characterUnlock,
    message: parts.join(" · "),
  };
}

/** Stars from weekly test: 1 star per 10%, bonus badges */
export function grantWeeklyTestRewards(
  percent: number,
  total: number,
  correct: number,
): RewardEvent {
  const state = loadRewards();
  const starsEarned = Math.max(5, Math.round(percent / 10) * 3);
  state.stars += starsEarned;

  const result: WeeklyTestResult = {
    weekKey: weekKey(),
    score: correct,
    total,
    percent,
    starsEarned,
    completedAt: new Date().toISOString(),
  };

  state.weeklyTests = [
    ...state.weeklyTests.filter((t) => t.weekKey !== result.weekKey),
    result,
  ];

  const newBadges: BadgeId[] = [];
  const tryBadge = (id: BadgeId) => {
    if (unlockBadge(state, id)) {
      newBadges.push(id);
    }
  };

  tryBadge("week-warrior");
  if (percent >= 70) tryBadge("test-pass");
  if (percent >= 90) tryBadge("test-high");

  saveRewards(state);

  const coin = grantTestCoins({
    claimKey: `weekly:${weekKey()}`,
    percent,
    source: "weekly-test",
  });

  return {
    starsGained: starsEarned + newBadges.length * 5,
    newBadges,
    coinsGained: coin.coinsGained,
    characterUnlock: coin.characterUnlock,
    message: `Weekly test ${percent}% · +${starsEarned} stars · ${coin.message}`,
  };
}

export function getThisWeekTest(): WeeklyTestResult | undefined {
  const key = weekKey();
  return loadRewards().weeklyTests.find((t) => t.weekKey === key);
}

export function badgeMeta(id: BadgeId): Badge | undefined {
  return BADGES.find((b) => b.id === id);
}

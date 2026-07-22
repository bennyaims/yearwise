import { LESSONS } from "@/content/lessons";
import type { LanguageId, Lesson, YearLevel } from "./types";
import { lessonKey, loadProgress } from "./progress";

/**
 * Fluency-first language design.
 * End of Year 12 target: independent user (CEFR B1+/B2−) —
 * sustained conversation, natural-speed listening on familiar topics,
 * opinion + narrative without collapsing into English.
 */

export type FluencyStage = {
  year: YearLevel;
  cefr: string;
  label: string;
  goal: string;
  canDo: string[];
  /** Weekly speaking minutes recommended */
  speakingMinutesPerWeek: number;
  listeningMinutesPerWeek: number;
};

export const FLUENCY_STAGES: FluencyStage[] = [
  {
    year: 7,
    cefr: "A1",
    label: "Launch",
    goal: "Survive first conversations: sound system, greetings, identity, school basics.",
    canDo: [
      "Pronounce core sounds clearly with audio models",
      "Introduce yourself and ask someone’s name",
      "Use 80–120 high-frequency words actively",
      "Understand slow, clear classroom audio",
    ],
    speakingMinutesPerWeek: 60,
    listeningMinutesPerWeek: 60,
  },
  {
    year: 8,
    cefr: "A1+ / A2−",
    label: "Expand",
    goal: "Short real dialogues: family, food, free time, classroom interaction.",
    canDo: [
      "Hold a 1–2 minute exchange on familiar topics",
      "Order, thank, apologise, ask simple questions",
      "Shadow full phrases at clear speed",
      "Recognise present-tense patterns in speech",
    ],
    speakingMinutesPerWeek: 75,
    listeningMinutesPerWeek: 75,
  },
  {
    year: 9,
    cefr: "A2",
    label: "Operate",
    goal: "Handle everyday situations with growing independence.",
    canDo: [
      "Describe routines, plans, and past weekend simply",
      "Follow short dialogues at near-natural speed",
      "Repair breakdowns (paraphrase, ask to repeat)",
      "Write short connected paragraphs",
    ],
    speakingMinutesPerWeek: 90,
    listeningMinutesPerWeek: 90,
  },
  {
    year: 10,
    cefr: "A2+ / B1−",
    label: "Connect",
    goal: "Extended interaction and simple argumentation.",
    canDo: [
      "Sustain 3–4 minutes of conversation with follow-ups",
      "Give reasons and mild opinions",
      "Understand main points of short authentic-style audio",
      "Narrate a story with sequence markers",
    ],
    speakingMinutesPerWeek: 100,
    listeningMinutesPerWeek: 100,
  },
  {
    year: 11,
    cefr: "B1",
    label: "Argue & narrate",
    goal: "Senior-ready speech: past frames, opinion structure, cultural topics.",
    canDo: [
      "Tell past events with clear time frames",
      "Justify opinions with because/therefore patterns",
      "Process multi-clause listening items",
      "Switch register (casual vs polite) deliberately",
    ],
    speakingMinutesPerWeek: 120,
    listeningMinutesPerWeek: 120,
  },
  {
    year: 12,
    cefr: "B1+ / B2−",
    label: "Fluent exit",
    goal: "Independent user: spontaneous talk, media, debate — fluency at end of studies.",
    canDo: [
      "Speak for 5+ minutes on prepared + familiar spontaneous topics",
      "Understand natural-speed audio on known themes with gist + detail",
      "Argue both sides of a simple issue",
      "Self-correct mid-speech without freezing",
      "Pass the Fluency Exit Gate (listening + oral criteria + pathway complete)",
    ],
    speakingMinutesPerWeek: 150,
    listeningMinutesPerWeek: 150,
  },
];

export function stageForYear(year: YearLevel): FluencyStage {
  return FLUENCY_STAGES.find((s) => s.year === year) ?? FLUENCY_STAGES[0]!;
}

/** Full Y7→Y12 ordered pathway for one language */
export function languagePathway(language: LanguageId): Lesson[] {
  const rank = (l: Lesson) => {
    // Fluency exit always last within its year
    if (l.id.includes("fluency-exit")) return 9000;
    const m = l.id.match(/y(\d+)-/);
    if (m) return Number(m[1]) * 100;
    return 500;
  };

  return LESSONS.filter(
    (l) => l.subject === "language" && l.language === language,
  ).sort(
    (a, b) =>
      a.year - b.year ||
      rank(a) - rank(b) ||
      a.id.localeCompare(b.id),
  );
}

export function nextInLanguagePathway(
  language: LanguageId,
  currentLessonId: string,
): Lesson | null {
  const path = languagePathway(language);
  const idx = path.findIndex((l) => l.id === currentLessonId);
  if (idx < 0 || idx >= path.length - 1) return null;
  return path[idx + 1] ?? null;
}

export type FluencyProgress = {
  language: LanguageId;
  completed: number;
  total: number;
  percent: number;
  byYear: Record<number, { completed: number; total: number }>;
  exitComplete: boolean;
  /** True when full pathway done + exit lesson complete */
  fluent: boolean;
  currentStage: FluencyStage;
  stagesCleared: YearLevel[];
};

export function computeFluencyProgress(
  language: LanguageId,
  progressMap?: ReturnType<typeof loadProgress>,
): FluencyProgress {
  const map =
    progressMap ??
    (typeof window !== "undefined" ? loadProgress() : {});
  const path = languagePathway(language);
  const keys = path.map((l) =>
    lessonKey(l.year, l.subject, l.id, l.language),
  );
  const completed = keys.filter((k) => map[k]?.completed).length;
  const total = keys.length;

  const byYear: FluencyProgress["byYear"] = {};
  for (const y of [7, 8, 9, 10, 11, 12] as YearLevel[]) {
    const yearLessons = path.filter((l) => l.year === y);
    const yKeys = yearLessons.map((l) =>
      lessonKey(l.year, l.subject, l.id, l.language),
    );
    byYear[y] = {
      completed: yKeys.filter((k) => map[k]?.completed).length,
      total: yKeys.length,
    };
  }

  const exitLesson = path.find((l) => l.id.includes("fluency-exit"));
  const exitKey = exitLesson
    ? lessonKey(
        exitLesson.year,
        exitLesson.subject,
        exitLesson.id,
        exitLesson.language,
      )
    : null;
  const exitComplete = exitKey ? Boolean(map[exitKey]?.completed) : false;

  const stagesCleared = FLUENCY_STAGES.filter((s) => {
    const y = byYear[s.year];
    return y && y.total > 0 && y.completed >= y.total;
  }).map((s) => s.year);

  // Current stage = first incomplete year, or Y12 if all done
  let current = FLUENCY_STAGES[0]!;
  for (const s of FLUENCY_STAGES) {
    const y = byYear[s.year];
    if (!y || y.total === 0 || y.completed < y.total) {
      current = s;
      break;
    }
    current = s;
  }

  // Fluent only when every block including Fluency Exit is done
  const fluent = total > 0 && completed >= total && (exitComplete || !exitLesson);

  return {
    language,
    completed,
    total,
    percent: total === 0 ? 0 : Math.round((completed / total) * 100),
    byYear,
    exitComplete: exitComplete || (fluent && Boolean(exitLesson)),
    fluent,
    currentStage: current,
    stagesCleared,
  };
}

export const FLUENCY_PLEDGE =
  "By the end of Year 12 you will function as an independent user of the language: speak at length, understand natural listening on familiar topics, and express opinions without defaulting to English.";

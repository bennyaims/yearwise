export type YearLevel = 7 | 8 | 9 | 10 | 11 | 12;

export type SubjectId =
  | "math"
  | "science"
  | "chemistry"
  | "english"
  | "language"
  | "history"
  | "music"
  | "computerscience";

export type LanguageId =
  | "spanish"
  | "russian"
  | "chinese"
  | "german"
  | "japanese"
  | "khmer"
  | "italian";

/** Curated YouTube lesson video (curriculum support) */
export type LessonVideo = {
  youtubeId: string;
  title: string;
  channel: string;
  /** Why this video is here (curriculum link) */
  why: string;
  minutes?: number;
  /** core = everyone; depth = optional deeper; accelerate = for fast self-learners */
  role?: "core" | "depth" | "accelerate";
};

export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "callout"; tone: "info" | "warning" | "tip" | "unfiltered"; text: string }
  | { type: "list"; ordered?: boolean; items: string[] }
  | { type: "formula"; latex: string; note?: string }
  | { type: "example"; title: string; body: string }
  /** Inline curated YouTube (pause-and-learn) */
  | {
      type: "video";
      youtubeId: string;
      title: string;
      channel?: string;
      note?: string;
      minutes?: number;
    }
  /** Inline playable pronunciation line (uses device TTS) */
  | {
      type: "audio";
      title: string;
      text: string;
      romanization?: string;
      meaning: string;
      note?: string;
    };

/** Playable phrase for language lab */
export type AudioPhrase = {
  id: string;
  text: string;
  romanization?: string;
  meaning: string;
  note?: string;
};

/** Listen → choose what you heard */
export type ListeningItem = {
  id: string;
  /** Text the TTS engine speaks (target language) */
  audioText: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

/** One teaching beat in the Help me solve coach */
export type SolveStep = {
  id: string;
  title: string;
  /** Plain-language teaching for this step */
  teaching: string;
  /** Optional micro-check — student must get this right to unlock the next step */
  check?: {
    prompt: string;
    options: string[];
    correctIndex: number;
    hint: string;
  };
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  /**
   * Optional hand-authored coach steps. If omitted, Yearwise builds a text
   * step-by-step guide from the prompt and explanation.
   */
  solveSteps?: SolveStep[];
  /**
   * Extra similar questions for the independent mastery loop (need 5 correct).
   * If fewer than 5, the coach generates additional practice items.
   */
  practiceVariants?: QuizQuestion[];
};

/** How many independent (no-help) solves are required before returning */
export const MASTERY_TARGET = 5;

/**
 * One beat in the guided learn path.
 * Student must pass the check (if present) before the next beat unlocks.
 */
export type LearnBeat = {
  id: string;
  title: string;
  /** Short plain teaching — what to remember */
  teach: string;
  /** Optional extra lines (bullets) */
  bullets?: string[];
  /** Memory hook / analogy */
  remember?: string;
  /** Must answer correctly to continue */
  check: {
    prompt: string;
    options: string[];
    correctIndex: number;
    /** Shown when wrong — teaches, does not just say “incorrect” */
    hint: string;
    /** Shown when right — locks the idea in */
    whyCorrect: string;
  };
};

export type Lesson = {
  id: string;
  title: string;
  summary: string;
  estimatedMinutes: number;
  year: YearLevel;
  subject: SubjectId;
  language?: LanguageId;
  strand?: string;
  content: ContentBlock[];
  /**
   * Optional deeper curriculum content (shown when student chooses In-depth).
   * Self-learners who already master core can skip and stay on Core/Fast track.
   */
  depthContent?: ContentBlock[];
  /**
   * Curated YouTube videos intertwined with the lesson.
   * Also auto-matched from the curriculum video bank when omitted.
   */
  videos?: LessonVideo[];
  /**
   * Guided learning path: teach → check → next.
   * When present, quiz stays locked until every beat is passed
   * (unless self-pace mastery / accelerate unlock).
   */
  learnPath?: LearnBeat[];
  /**
   * Short diagnostic for self-learners — pass to unlock Fast track
   * (skip full guided path, go to quiz sooner).
   */
  diagnostic?: QuizQuestion[];
  quiz?: QuizQuestion[];
  /** Pronunciation examples with play buttons */
  audioPhrases?: AudioPhrase[];
  /** Listening comprehension (hear TTS, pick meaning/phrase) */
  listening?: ListeningItem[];
};

export type SubjectMeta = {
  id: SubjectId;
  name: string;
  shortName: string;
  description: string;
  color: string;
  icon: string;
  /** Chemistry is optional/separate focus from general Science in senior years */
  years: YearLevel[];
};

export type LanguageMeta = {
  id: LanguageId;
  name: string;
  nativeName: string;
  flag: string;
  description: string;
};

export type ProgressMap = Record<
  string,
  {
    completed: boolean;
    quizScore?: number;
    updatedAt: string;
    /** Self-pace: skipped guided path via diagnostic mastery */
    accelerated?: boolean;
    /** Chose in-depth materials */
    depthMode?: boolean;
  }
>;

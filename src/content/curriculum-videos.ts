/**
 * Curated YouTube support for Australian Y7–12 curriculum.
 * Matched by subject + year band + keywords (title / strand / id).
 * Prefer stable educational channels; students pause and practice.
 */

import type { LessonVideo, SubjectId, YearLevel } from "@/lib/types";

export type VideoMatch = {
  id: string;
  subject: SubjectId | "any";
  /** Inclusive year range */
  years: YearLevel[];
  /** Match if any keyword appears in title|strand|id (case-insensitive) */
  keywords: string[];
  videos: LessonVideo[];
  /** Extra in-depth paragraphs appended when student chooses In-depth */
  depthParagraphs?: string[];
};

/**
 * Public educational videos (IDs are YouTube watch IDs).
 * Channels: Khan Academy, Crash Course, Amoeba Sisters, TED-Ed, etc.
 */
export const CURRICULUM_VIDEO_BANK: VideoMatch[] = [
  // ─── Maths ─────────────────────────────────────────
  {
    id: "math-integers",
    subject: "math",
    years: [7, 8],
    keywords: ["integer", "number line", "negative", "ordering"],
    videos: [
      {
        youtubeId: "1VuTYx5b3qY",
        title: "Intro to negative numbers",
        channel: "Khan Academy",
        why: "Builds intuition for negatives on the number line — core Y7 Number.",
        minutes: 8,
        role: "core",
      },
      {
        youtubeId: "NybHckSEQBI",
        title: "Adding & subtracting negative numbers",
        channel: "Khan Academy",
        why: "Deepens integer operations after you know the number line.",
        minutes: 10,
        role: "depth",
      },
    ],
    depthParagraphs: [
      "In depth: integers form a group under addition — every integer has an additive inverse. That idea reappears in algebra (solving equations) and coordinate geometry (reflections).",
      "Real contexts: elevation below sea level, bank overdrafts, temperature, and direction on a number line are the same mathematical object with different units.",
    ],
  },
  {
    id: "math-patterns",
    subject: "math",
    years: [7, 8, 9],
    keywords: ["pattern", "sequence", "counting", "algebra", "linear"],
    videos: [
      {
        youtubeId: "zUWCot2adcg",
        title: "Arithmetic sequences",
        channel: "Khan Academy",
        why: "Common difference links integer patterns to later algebra rules.",
        minutes: 9,
        role: "core",
      },
    ],
    depthParagraphs: [
      "In depth: an arithmetic sequence can be written aₙ = a₁ + (n−1)d. Substituting values is the same skill as function notation in later years.",
    ],
  },
  {
    id: "math-fractions",
    subject: "math",
    years: [7, 8, 9],
    keywords: ["fraction", "ratio", "percent", "decimal", "proportion"],
    videos: [
      {
        youtubeId: "uydzS5xLw4U",
        title: "Understanding fractions",
        channel: "Khan Academy",
        why: "Visual models for part–whole before operations.",
        minutes: 8,
        role: "core",
      },
    ],
  },
  {
    id: "math-algebra",
    subject: "math",
    years: [8, 9, 10, 11, 12],
    keywords: ["algebra", "equation", "variable", "expression", "solve", "linear", "quadratic"],
    videos: [
      {
        youtubeId: "NybHckSEQBI",
        title: "Variables & expressions (support)",
        channel: "Khan Academy",
        why: "Review how letters stand for numbers before solving.",
        minutes: 7,
        role: "core",
      },
      {
        youtubeId: "fNk_zzaMoSs",
        title: "Essence of linear algebra (preview)",
        channel: "3Blue1Brown",
        why: "Optional depth for students accelerating toward senior maths.",
        minutes: 10,
        role: "accelerate",
      },
    ],
    depthParagraphs: [
      "In depth: solving equations is undoing operations in reverse order. Check by substitution — a professional habit, not only a school trick.",
    ],
  },
  {
    id: "math-geometry",
    subject: "math",
    years: [7, 8, 9, 10],
    keywords: ["angle", "triangle", "area", "volume", "geometry", "circle", "pythag"],
    videos: [
      {
        youtubeId: "mLeNaZcy-hE",
        title: "Basic geometry: lines, rays, segments",
        channel: "Khan Academy",
        why: "Vocabulary and diagrams for measurement strands.",
        minutes: 6,
        role: "core",
      },
    ],
  },

  // ─── Science ───────────────────────────────────────
  {
    id: "sci-cells",
    subject: "science",
    years: [7, 8, 9, 10],
    keywords: ["cell", "organelle", "photosynthesis", "mitosis", "membrane"],
    videos: [
      {
        youtubeId: "8IlzKri08kk",
        title: "Introduction to cells",
        channel: "Amoeba Sisters",
        why: "Clear cell structures and functions — Australian Curriculum biological sciences.",
        minutes: 8,
        role: "core",
      },
      {
        youtubeId: "sQK3Yr4Sc_k",
        title: "Photosynthesis and the Teeny Tiny Pigment Pancakes",
        channel: "Amoeba Sisters",
        why: "Deepens energy flow for producers in ecosystems / Genesis projects.",
        minutes: 9,
        role: "depth",
      },
    ],
    depthParagraphs: [
      "In depth: structure–function relationships (e.g. mitochondria → ATP) are the same reasoning pattern as organ systems and ecosystems — scale changes, logic stays.",
    ],
  },
  {
    id: "sci-ecosystems",
    subject: "science",
    years: [7, 8, 9, 10],
    keywords: ["ecosystem", "food web", "energy", "habitat", "environment", "ecology"],
    videos: [
      {
        youtubeId: "v6ubvEJ3KGM",
        title: "Ecosystems and ecological networks",
        channel: "Crash Course",
        why: "Food webs and energy transfer — links to Genesis Lab habitation science.",
        minutes: 11,
        role: "core",
      },
    ],
  },
  {
    id: "sci-forces",
    subject: "science",
    years: [7, 8, 9, 10],
    keywords: ["force", "motion", "newton", "energy", "physics", "gravity"],
    videos: [
      {
        youtubeId: "kKKM8Y-u7ds",
        title: "Newton's laws overview",
        channel: "Crash Course Physics",
        why: "Core physical sciences ideas with everyday examples.",
        minutes: 10,
        role: "core",
      },
    ],
  },
  {
    id: "sci-earth",
    subject: "science",
    years: [7, 8, 9, 10],
    keywords: ["earth", "plate", "rock", "climate", "weather", "water cycle", "astronomy", "solar"],
    videos: [
      {
        youtubeId: "kwfNGatxUJI",
        title: "Plate tectonics",
        channel: "Crash Course",
        why: "Earth systems strand support.",
        minutes: 11,
        role: "core",
      },
    ],
  },

  // ─── Chemistry ─────────────────────────────────────
  {
    id: "chem-atoms",
    subject: "chemistry",
    years: [8, 9, 10, 11, 12],
    keywords: ["atom", "element", "periodic", "molecule", "bond", "particle", "matter"],
    videos: [
      {
        youtubeId: "FSyAehMdpyI",
        title: "The nucleus",
        channel: "Crash Course Chemistry",
        why: "Particle model and atomic structure for junior–senior chem.",
        minutes: 10,
        role: "core",
      },
      {
        youtubeId: "0RRVV4Diomg",
        title: "The periodic table",
        channel: "Crash Course Chemistry",
        why: "Patterns in the table — depth for students accelerating.",
        minutes: 11,
        role: "depth",
      },
    ],
  },

  // ─── English ───────────────────────────────────────
  {
    id: "eng-essay",
    subject: "english",
    years: [7, 8, 9, 10, 11, 12],
    keywords: ["essay", "argument", "persuade", "thesis", "paragraph", "peel", "analysis"],
    videos: [
      {
        youtubeId: "1z8gCZ7zpsQ",
        title: "How to write an essay (overview)",
        channel: "TED-Ed",
        why: "Structure and claims before subject-specific text analysis.",
        minutes: 5,
        role: "core",
      },
    ],
    depthParagraphs: [
      "In depth: PEEL/TEEL is a scaffold, not a cage. Strong senior writing still needs a clear claim, evidence, explanation, and link — even when the paragraph shape varies.",
    ],
  },
  {
    id: "eng-reading",
    subject: "english",
    years: [7, 8, 9, 10],
    keywords: ["reading", "comprehension", "narrative", "poetry", "media", "language"],
    videos: [
      {
        youtubeId: "ms2BvRbjOYo",
        title: "How to use rhetoric to get what you want",
        channel: "TED-Ed",
        why: "Audience, purpose, and persuasive techniques.",
        minutes: 4,
        role: "core",
      },
    ],
  },

  // ─── History ───────────────────────────────────────
  {
    id: "hist-sources",
    subject: "history",
    years: [7, 8, 9, 10, 11, 12],
    keywords: ["source", "evidence", "primary", "secondary", "histori", "australia", "colonisation", "federation"],
    videos: [
      {
        youtubeId: "hVA5d0q2fXg",
        title: "What is history for?",
        channel: "TED-Ed",
        why: "Why we study the past before examining Australian evidence carefully.",
        minutes: 5,
        role: "core",
      },
    ],
    depthParagraphs: [
      "In depth: corroboration means checking more than one source. Primary sources are powerful but partial — purpose, audience, and silence matter as much as what is written.",
    ],
  },

  // ─── Music ─────────────────────────────────────────
  {
    id: "music-basics",
    subject: "music",
    years: [7, 8, 9, 10],
    keywords: ["rhythm", "pitch", "melody", "harmony", "notation", "music", "beat", "scale"],
    videos: [
      {
        youtubeId: "rgaTLrZGlk0",
        title: "How to read music - Tim Hansen",
        channel: "TED-Ed",
        why: "Notation literacy for junior secondary music.",
        minutes: 5,
        role: "core",
      },
    ],
  },

  // ─── Computer Science ──────────────────────────────
  {
    id: "cs-loops",
    subject: "computerscience",
    years: [7, 8, 9],
    keywords: ["loop", "variable", "algorithm", "code", "program", "if", "condition", "comput"],
    videos: [
      {
        youtubeId: "6iF8Xb7Z3wQ",
        title: "What is an algorithm?",
        channel: "TED-Ed",
        why: "Computational thinking foundation for Y7–9 Digital Technologies.",
        minutes: 5,
        role: "core",
      },
      {
        youtubeId: "zOjov-2OZ0E",
        title: "Intro to programming & computer science",
        channel: "freeCodeCamp",
        why: "Broader overview for students accelerating through CS levels.",
        minutes: 15,
        role: "accelerate",
      },
    ],
    depthParagraphs: [
      "In depth: algorithms are precise instructions. Variables store state; loops repeat; conditionals branch. The Build Lab project shop uses the same ideas as real software.",
    ],
  },
  {
    id: "cs-ai",
    subject: "computerscience",
    years: [10, 11, 12],
    keywords: ["ai", "machine learning", "model", "neural", "data", "ethics", "defend"],
    videos: [
      {
        youtubeId: "aircAruvnKk",
        title: "But what is a neural network?",
        channel: "3Blue1Brown",
        why: "Senior CS intuition for models — pair with human-in-the-loop ethics.",
        minutes: 19,
        role: "depth",
      },
      {
        youtubeId: "R9OHn5ZF4Uo",
        title: "How AI could change the world (ethics framing)",
        channel: "TED-Ed",
        why: "Civic and ethical framing for defend-against-dominance pathway.",
        minutes: 6,
        role: "core",
      },
    ],
  },

  // ─── Languages (generic support) ───────────────────
  {
    id: "lang-learning",
    subject: "language",
    years: [7, 8, 9, 10, 11, 12],
    keywords: ["spanish", "german", "japanese", "chinese", "russian", "italian", "khmer", "fluency", "greet"],
    videos: [
      {
        youtubeId: "YQHsXMglC9A",
        title: "How to learn any language in six months (strategies)",
        channel: "TEDx Talks",
        why: "Self-learning strategies — immersion, high-frequency phrases, daily practice.",
        minutes: 18,
        role: "accelerate",
      },
    ],
    depthParagraphs: [
      "In depth: spaced repetition and speaking aloud beat passive reading. Use the listen packs, then record yourself and compare.",
    ],
  },
];

export function youtubeEmbedUrl(id: string): string {
  return `https://www.youtube-nocookie.com/embed/${id}?rel=0`;
}

export function youtubeWatchUrl(id: string): string {
  return `https://www.youtube.com/watch?v=${id}`;
}

function haystack(lesson: {
  id: string;
  title: string;
  strand?: string;
  summary?: string;
}): string {
  return [lesson.id, lesson.title, lesson.strand ?? "", lesson.summary ?? ""]
    .join(" ")
    .toLowerCase();
}

/** Match bank entries for a lesson */
export function matchCurriculumVideos(lesson: {
  id: string;
  title: string;
  subject: SubjectId;
  year: YearLevel;
  strand?: string;
  summary?: string;
}): { videos: LessonVideo[]; depthParagraphs: string[] } {
  const text = haystack(lesson);
  const videos: LessonVideo[] = [];
  const depthParagraphs: string[] = [];
  const seen = new Set<string>();

  for (const entry of CURRICULUM_VIDEO_BANK) {
    if (entry.subject !== "any" && entry.subject !== lesson.subject) continue;
    if (!entry.years.includes(lesson.year)) continue;
    const hit = entry.keywords.some((k) => text.includes(k.toLowerCase()));
    if (!hit) continue;
    for (const v of entry.videos) {
      if (seen.has(v.youtubeId)) continue;
      seen.add(v.youtubeId);
      videos.push(v);
    }
    if (entry.depthParagraphs) depthParagraphs.push(...entry.depthParagraphs);
  }

  // Fallback: subject default overview if nothing matched
  if (videos.length === 0) {
    const fallback = subjectFallback(lesson.subject, lesson.year);
    if (fallback) videos.push(fallback);
  }

  return { videos, depthParagraphs };
}

function subjectFallback(
  subject: SubjectId,
  year: YearLevel,
): LessonVideo | null {
  const map: Partial<Record<SubjectId, LessonVideo>> = {
    math: {
      youtubeId: "WUvTyaaNkzM",
      title: "The essence of calculus? (mindset for maths learning)",
      channel: "3Blue1Brown",
      why: `General maths thinking support for Year ${year} — watch when you need a bigger picture.`,
      minutes: 17,
      role: "accelerate",
    },
    science: {
      youtubeId: "QImCld9YubE",
      title: "Just how small is an atom?",
      channel: "TED-Ed",
      why: "Scale and scientific thinking for junior–middle secondary science.",
      minutes: 5,
      role: "core",
    },
    computerscience: {
      youtubeId: "6iF8Xb7Z3wQ",
      title: "What is an algorithm?",
      channel: "TED-Ed",
      why: "Core computational thinking for Digital Technologies.",
      minutes: 5,
      role: "core",
    },
  };
  return map[subject] ?? null;
}

/**
 * Enrich any curriculum lesson with matched YouTube + optional depth copy.
 * Does not replace authored content — merges support materials.
 */

import { matchCurriculumVideos } from "@/content/curriculum-videos";
import type {
  ContentBlock,
  Lesson,
  LessonVideo,
  QuizQuestion,
} from "@/lib/types";

export type EnrichedLesson = Lesson & {
  /** Videos after merge (authored + bank) */
  resolvedVideos: LessonVideo[];
  /** Core content only */
  coreContent: ContentBlock[];
  /** Core + depth depth */
  fullContent: ContentBlock[];
  /** Diagnostic for fast track (authored or generated from quiz) */
  resolvedDiagnostic: QuizQuestion[];
};

function dedupeVideos(list: LessonVideo[]): LessonVideo[] {
  const seen = new Set<string>();
  const out: LessonVideo[] = [];
  for (const v of list) {
    if (seen.has(v.youtubeId)) continue;
    seen.add(v.youtubeId);
    out.push(v);
  }
  return out;
}

function depthBlocksFromParagraphs(paragraphs: string[]): ContentBlock[] {
  if (paragraphs.length === 0) return [];
  const blocks: ContentBlock[] = [
    {
      type: "heading",
      text: "Go deeper",
    },
    {
      type: "callout",
      tone: "info",
      text: "Optional in-depth material. Self-learners who already scored well can skip this and move to the next lesson after the quiz.",
    },
  ];
  for (const p of paragraphs) {
    blocks.push({ type: "paragraph", text: p });
  }
  return blocks;
}

/** Build a short diagnostic from the main quiz (first 3 items) */
export function diagnosticFromQuiz(quiz?: QuizQuestion[]): QuizQuestion[] {
  if (!quiz || quiz.length === 0) return [];
  return quiz.slice(0, Math.min(3, quiz.length)).map((q, i) => ({
    ...q,
    id: `diag-${q.id}-${i}`,
  }));
}

/**
 * Resolve videos + depth for a lesson (safe on server and client).
 */
export function enrichLesson(lesson: Lesson): EnrichedLesson {
  const matched = matchCurriculumVideos(lesson);
  const authored = lesson.videos ?? [];
  const resolvedVideos = dedupeVideos([...authored, ...matched.videos]);

  const bankDepth = depthBlocksFromParagraphs(matched.depthParagraphs);
  const authoredDepth = lesson.depthContent ?? [];
  const depthMerged =
    authoredDepth.length > 0
      ? [
          ...authoredDepth,
          ...(bankDepth.length > 0
            ? [
                {
                  type: "heading" as const,
                  text: "Further depth",
                },
                ...bankDepth.filter((b) => b.type === "paragraph"),
              ]
            : []),
        ]
      : bankDepth;

  // Inject core video blocks at end of core content for offline-friendly structure
  const videoBlocks: ContentBlock[] = resolvedVideos
    .filter((v) => v.role !== "depth" && v.role !== "accelerate")
    .slice(0, 2)
    .map((v) => ({
      type: "video" as const,
      youtubeId: v.youtubeId,
      title: v.title,
      channel: v.channel,
      note: v.why,
      minutes: v.minutes,
    }));

  const coreContent: ContentBlock[] = [
    ...lesson.content,
    ...(videoBlocks.length > 0
      ? [
          {
            type: "heading" as const,
            text: "Watch · pause · learn",
          },
          {
            type: "callout" as const,
            tone: "tip" as const,
            text: "Play a short video, pause often, and connect it to the ideas above. Videos support the curriculum — they do not replace the quiz checks.",
          },
          ...videoBlocks,
        ]
      : []),
  ];

  const depthVideoBlocks: ContentBlock[] = resolvedVideos
    .filter((v) => v.role === "depth" || v.role === "accelerate")
    .slice(0, 2)
    .map((v) => ({
      type: "video" as const,
      youtubeId: v.youtubeId,
      title: v.title,
      channel: v.channel,
      note: v.why,
      minutes: v.minutes,
    }));

  const fullContent: ContentBlock[] = [
    ...coreContent,
    ...depthMerged,
    ...depthVideoBlocks,
  ];

  const resolvedDiagnostic =
    lesson.diagnostic && lesson.diagnostic.length > 0
      ? lesson.diagnostic
      : diagnosticFromQuiz(lesson.quiz);

  return {
    ...lesson,
    resolvedVideos,
    coreContent,
    fullContent,
    resolvedDiagnostic,
    depthContent: depthMerged.length > 0 ? depthMerged : lesson.depthContent,
    videos: resolvedVideos,
  };
}

export function videosForMode(
  videos: LessonVideo[],
  mode: "core" | "depth" | "fast",
): LessonVideo[] {
  if (mode === "core") {
    return videos.filter((v) => !v.role || v.role === "core");
  }
  if (mode === "depth") {
    return videos.filter((v) => v.role !== "accelerate");
  }
  // fast: core + accelerate shorts
  return videos.filter((v) => v.role !== "depth");
}

/**
 * Enrich any curriculum lesson with matched YouTube + optional depth copy.
 * Does not replace authored content — merges support materials.
 * Also attaches free software tutorials (GeoGebra, Blender, …) by subject.
 */

import { designsForYear } from "@/content/geogebra-designs";
import { matchCurriculumVideos } from "@/content/curriculum-videos";
import { softwareForSubject } from "@/content/curriculum-software";
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
      text: "Optional in-depth material — extra practice and ideas. You still must finish the lesson quiz to progress (no skipping tests).",
    },
  ];
  for (const p of paragraphs) {
    blocks.push({ type: "paragraph", text: p });
  }
  return blocks;
}

/** Fun GeoGebra design challenge matched loosely to lesson topic */
function geogebraFunBlocks(lesson: Lesson): ContentBlock[] {
  if (lesson.subject !== "math") return [];
  const designs = designsForYear(lesson.year);
  if (designs.length === 0) return [];
  const text = `${lesson.id} ${lesson.title} ${lesson.strand ?? ""} ${lesson.summary}`.toLowerCase();
  let pick = designs[0]!;
  if (/integer|number line|negative|order/.test(text)) {
    pick = designs.find((d) => d.id === "gg-number-line-art") ?? pick;
  } else if (/angle|circle|geometry|shape|polygon|triangle/.test(text)) {
    pick =
      designs.find((d) => d.id === "gg-mandala-circles") ??
      designs.find((d) => d.id === "gg-polygon-tessellation") ??
      pick;
  } else if (/algebra|equation|linear|function|graph|quadrat/.test(text)) {
    pick =
      designs.find((d) => d.id === "gg-function-mountain") ??
      designs.find((d) => d.id === "gg-family-portrait") ??
      pick;
  } else if (/trig|sin|cos|period/.test(text)) {
    pick = designs.find((d) => d.id === "gg-spiro-trig") ?? pick;
  } else if (/pattern|sequence|transform|symmetry/.test(text)) {
    pick = designs.find((d) => d.id === "gg-slider-kaleidoscope") ?? pick;
  } else {
    // Rotate fun pick by year index into available designs
    pick = designs[lesson.year % designs.length]!;
  }

  return [
    {
      type: "heading",
      text: "Make it fun · GeoGebra design challenge",
    },
    {
      type: "callout",
      tone: "tip",
      text: `🎨 ${pick.title} — ${pick.vibe}. ${pick.wow} Open GeoGebra Classic and build it, then screenshot. Full studio: Build Lab → GeoGebra design studio (beginner → expert).`,
    },
    {
      type: "list",
      ordered: true,
      items: pick.steps.slice(0, 5),
    },
    {
      type: "paragraph",
      text: `Maths you practice while designing: ${pick.maths.join(", ")}.`,
    },
  ];
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
/** Software install / how-to videos for tools used in this subject */
function softwareTutorialVideos(lesson: Lesson): LessonVideo[] {
  const tools = softwareForSubject(lesson.subject, lesson.year);
  const out: LessonVideo[] = [];
  for (const tool of tools.slice(0, 3)) {
    for (const t of tool.tutorials.slice(0, 1)) {
      out.push({
        youtubeId: t.youtubeId,
        title: `${tool.name}: ${t.title}`,
        channel: t.channel,
        why: `${tool.lessonTip} Download: ${tool.downloadUrl}`,
        minutes: t.minutes,
        role: tool.id === "geogebra" || tool.id === "blender" ? "core" : "depth",
      });
    }
  }
  return out;
}

export function enrichLesson(lesson: Lesson): EnrichedLesson {
  const matched = matchCurriculumVideos(lesson);
  const softwareVids = softwareTutorialVideos(lesson);
  const authored = lesson.videos ?? [];
  const resolvedVideos = dedupeVideos([
    ...authored,
    ...matched.videos,
    ...softwareVids,
  ]);

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

  const funBlocks = geogebraFunBlocks(lesson);

  const coreContent: ContentBlock[] = [
    ...lesson.content,
    ...funBlocks,
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

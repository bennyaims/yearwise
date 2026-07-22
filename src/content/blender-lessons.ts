/**
 * Blender track — 3D for world & character building.
 * Lessons use curated public YouTube tutorials (official / well-known channels).
 */

import type { YearLevel } from "@/lib/types";

export type BlenderLesson = {
  id: string;
  year: YearLevel;
  title: string;
  minutes: number;
  skill: string;
  /** Teacher script */
  teacherNotes: string;
  objectives: string[];
  /** YouTube video id only */
  youtubeId: string;
  youtubeTitle: string;
  channel: string;
  practice: string;
  linksToGame: string;
};

/**
 * Curated videos (stable educational channels).
 * Students watch in-class with teacher pauses.
 */
export const BLENDER_LESSONS: BlenderLesson[] = [
  {
    id: "bl-y7-interface",
    year: 7,
    title: "Blender interface & first object",
    minutes: 25,
    skill: "Navigate viewport, add mesh",
    teacherNotes:
      "I do: orbit/pan/zoom. We do: add cube. You do: rename object TreeBase. No perfection required.",
    objectives: [
      "Open Blender and navigate the 3D view",
      "Add and move a simple mesh",
      "Save a .blend file",
    ],
    youtubeId: "4haAdmHqGOw",
    youtubeTitle: "Beginner Blender 4.0 Tutorial (2023) — full fundamentals",
    channel: "Blender Guru",
    practice: "Create a scene with ground plane + 3 trees as scaled cubes.",
    linksToGame: "Block-outs become placeholders for Genesis forests.",
  },
  {
    id: "bl-y8-model-tree",
    year: 8,
    title: "Model a simple tree",
    minutes: 35,
    skill: "Edit mode, extrude",
    teacherNotes:
      "Pause video every 2–3 minutes. Students match topology roughly. Screenshot progress for portfolios.",
    objectives: [
      "Use Edit Mode",
      "Extrude a trunk and canopy volume",
      "Apply a simple material colour",
    ],
    youtubeId: "B0J27sf9N1Y",
    youtubeTitle: "Beginner Blender 4.0 — interface while building first render",
    channel: "Blender Guru",
    practice: "Make 2 tree variants (tall / wide). Export screenshot.",
    linksToGame: "Matches Genesis forest packs and timber economy visuals.",
  },
  {
    id: "bl-y9-character-block",
    year: 9,
    title: "Character block-out (humanoid)",
    minutes: 40,
    skill: "Proportions, separate objects",
    teacherNotes:
      "Focus on proportions not detail. Compare to Genesis human capsule rigs.",
    objectives: [
      "Block a humanoid with primitives",
      "Name parts (head, body, arm.L, arm.R)",
      "Pose a simple idle stance",
    ],
    youtubeId: "nIoXOplUvAw",
    youtubeTitle: "Blender 3.0 Beginner Tutorial - Part 1 (navigation & first mesh)",
    channel: "Blender Guru",
    practice: "Name objects to match game parts: head, leg0, arm0.",
    linksToGame: "Yearwise animates named parts (leg*, arm*, head, tool).",
  },
  {
    id: "bl-y10-animate-walk",
    year: 10,
    title: "Basic walk cycle ideas",
    minutes: 40,
    skill: "Keyframes, timeline",
    teacherNotes:
      "Even a bouncing ball teaches keyframes. Then try a simple arm swing on the block-out.",
    objectives: [
      "Insert keyframes on the timeline",
      "Understand frames vs seconds",
      "Preview a looping motion",
    ],
    youtubeId: "tBpnKTAc5Eo",
    youtubeTitle: "Blender beginner series Part 2 (continue modelling workflow)",
    channel: "Blender Guru",
    practice: "Animate a 24-frame bounce or arm swing loop.",
    linksToGame: "Genesis uses procedural gait; real keyframes are the industry path.",
  },
  {
    id: "bl-y11-materials-light",
    year: 11,
    title: "Materials, light, and presentation",
    minutes: 45,
    skill: "Shading, lighting for renders",
    teacherNotes:
      "Show how light sells a form. Link to Genesis day/night and star colour.",
    objectives: [
      "Apply base colour / roughness",
      "Add a sun/area light",
      "Render a turntable still",
    ],
    youtubeId: "z-Xl9tGqH14",
    youtubeTitle: "Beginner Blender Tutorial (2026) — long-form fundamentals",
    channel: "Blender Guru",
    practice: "Render forest + character under warm vs cool light.",
    linksToGame: "Star type changes light colour in Genesis — same design thinking.",
  },
  {
    id: "bl-y12-export-pipeline",
    year: 12,
    title: "Export mindset & portfolio",
    minutes: 40,
    skill: "Pipeline, glTF concepts, critique",
    teacherNotes:
      "Senior: discuss polycount, naming, licensing of tutorials, and academic honesty (credit sources).",
    objectives: [
      "Explain a mesh → game engine pipeline",
      "List export checklist (scale, transforms, names)",
      "Write a 150-word portfolio reflection",
    ],
    youtubeId: "-tbSCMbJA6o",
    youtubeTitle: "Blender 5.0 Donut course (updated beginner path)",
    channel: "Blender Guru",
    practice: "Write export checklist; attach 3 screenshots from your year of work.",
    linksToGame: "CS Level 5–6 expects you to describe how assets would ship into Yearwise.",
  },
];

export function blenderLessonsForYear(year: YearLevel): BlenderLesson[] {
  return BLENDER_LESSONS.filter((l) => l.year <= year);
}

export function youtubeEmbedUrl(id: string): string {
  return `https://www.youtube-nocookie.com/embed/${id}?rel=0`;
}

export function youtubeWatchUrl(id: string): string {
  return `https://www.youtube.com/watch?v=${id}`;
}

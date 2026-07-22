/**
 * Computer Science pathways — chosen each year (Y7–Y12).
 * Shared “core” lessons appear on every pathway; electives differ by track.
 */

import type { YearLevel } from "@/lib/types";

export type CsPathwayId = "software" | "ai-data" | "cyber" | "creative";

export type CsPathwayMeta = {
  id: CsPathwayId;
  name: string;
  shortName: string;
  icon: string;
  color: string;
  blurb: string;
  /** What you focus on this year */
  yearlyFocus: Record<YearLevel, string>;
  careers: string[];
};

export const CS_PATHWAYS: CsPathwayMeta[] = [
  {
    id: "software",
    name: "Software & App Coding",
    shortName: "Software",
    icon: "💻",
    color: "#5b9fd4",
    blurb:
      "Build programs step by step: logic, functions, data structures, and full projects. Strong path if you want to make apps and systems.",
    yearlyFocus: {
      7: "Thinking + first sequences and debugging",
      8: "Decisions, loops, functions, lists",
      9: "Objects, algorithms, efficiency",
      10: "Python projects and file data",
      11: "Larger code projects + generative tools",
      12: "Capstone software systems + responsible AI use",
    },
    careers: ["Software developer", "App engineer", "Full-stack learner pathway"],
  },
  {
    id: "ai-data",
    name: "Data Science & AI",
    shortName: "AI & Data",
    icon: "🧠",
    color: "#8b7ec8",
    blurb:
      "Data, machine learning, models, and evaluation — with ethics and safety. Build toward coding AI systems and testing them carefully.",
    yearlyFocus: {
      7: "Data representation + problem solving",
      8: "Loops & lists as data practice",
      9: "Algorithms + efficient processing of data",
      10: "What ML is, train/test, features & labels",
      11: "Code predictors, networks, training, LLMs",
      12: "Capstone AI + alignment + defend misuse",
    },
    careers: ["ML engineer (pathway)", "Data analyst", "AI safety-aware builder"],
  },
  {
    id: "cyber",
    name: "Cybersecurity & Systems",
    shortName: "Cyber",
    icon: "🛡️",
    color: "#4a9b72",
    blurb:
      "Networks, digital trust, security, and adversarial thinking. Learn how systems fail and how to defend people and data.",
    yearlyFocus: {
      7: "Binary, data integrity, careful algorithms",
      8: "Control flow for secure logic habits",
      9: "Networks, APIs, security basics",
      10: "Ethics of power, privacy, misuse",
      11: "Systems that need oversight",
      12: "Red teaming, control, defend against AI dominance",
    },
    careers: ["Security analyst pathway", "Systems admin mindset", "AI red-team habits"],
  },
  {
    id: "creative",
    name: "Creative Computing & Worlds",
    shortName: "Creative",
    icon: "🎮",
    color: "#d48a5a",
    blurb:
      "Interactive systems, game-like projects, and digital worlds. Links to Build Lab coding systems and Blender 3D animation.",
    yearlyFocus: {
      7: "Algorithms + first interactive code",
      8: "Loops & decisions for interactive behaviour",
      9: "Modelling systems & efficiency for real-time ideas",
      10: "Python projects + responsible creative AI",
      11: "Generative tools + interactive systems",
      12: "Capstone world/systems project + ethical shipping",
    },
    careers: ["Interactive media", "Technical artist pathway", "Game systems learner"],
  },
];

export function getCsPathway(id: CsPathwayId): CsPathwayMeta | undefined {
  return CS_PATHWAYS.find((p) => p.id === id);
}

export function isCsPathwayId(raw: string): raw is CsPathwayId {
  return CS_PATHWAYS.some((p) => p.id === raw);
}

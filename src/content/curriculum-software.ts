/**
 * Free curriculum software pack — shown at signup and linked from lessons.
 * Official download URLs + starter tutorial YouTube IDs.
 */

import type { SubjectId, YearLevel } from "@/lib/types";

export type SoftwareTool = {
  id: string;
  name: string;
  /** Short curriculum role */
  purpose: string;
  /** Subjects that use this tool */
  subjects: SubjectId[] | ["all"];
  years: YearLevel[] | "all";
  /** Official download / install page */
  downloadUrl: string;
  /** Optional macOS / Windows / web notes */
  platforms: string;
  icon: string;
  /** Free / freemium */
  license: string;
  /** Starter tutorial for install / first open */
  tutorials: {
    youtubeId: string;
    title: string;
    channel: string;
    minutes?: number;
  }[];
  /** In-lesson tip shown when subject matches */
  lessonTip: string;
};

/** Required / recommended programs for Years 7–12 Yearwise curriculum */
export const CURRICULUM_SOFTWARE: SoftwareTool[] = [
  {
    id: "geogebra",
    name: "GeoGebra",
    purpose:
      "Maths made visual: number lines, geometry, graphs — plus cool design projects from beginner star-bursts to expert parametric galaxies.",
    subjects: ["math"],
    years: "all",
    downloadUrl: "https://www.geogebra.org/download",
    platforms: "Windows, macOS, Linux, Chromebook, web app (Classic + 3D)",
    icon: "✨",
    license: "Free (education)",
    tutorials: [
      {
        youtubeId: "WsZjFODgk4U",
        title: "GeoGebra beginner — interface for design",
        channel: "GeoGebra",
        minutes: 12,
      },
      {
        youtubeId: "q5vrX1d2n8A",
        title: "Graphing with GeoGebra (functions as art)",
        channel: "GeoGebra",
        minutes: 10,
      },
    ],
    lessonTip:
      "Open GeoGebra Classic and make something cool for this topic (skyline, mandala, graph mountains). Screenshot for your portfolio — then try Build Lab → GeoGebra design studio.",
  },
  {
    id: "blender",
    name: "Blender",
    purpose:
      "Digital Technologies & Build Lab: 3D modelling, characters, worlds, and animation for Genesis assets.",
    subjects: ["computerscience"],
    years: "all",
    downloadUrl: "https://www.blender.org/download/",
    platforms: "Windows, macOS, Linux",
    icon: "🎨",
    license: "Free (open source)",
    tutorials: [
      {
        youtubeId: "4haAdmHqGOw",
        title: "Beginner Blender tutorial (fundamentals)",
        channel: "Blender Guru",
        minutes: 40,
      },
      {
        youtubeId: "nIoXOplUvAw",
        title: "Blender 4 beginner crash course",
        channel: "Blender",
        minutes: 20,
      },
    ],
    lessonTip:
      "Pause the Blender tutorial every 2 minutes and match the step. Save a .blend file named after this lesson.",
  },
  {
    id: "vscode",
    name: "Visual Studio Code",
    purpose:
      "Computer Science: write and run code for Build Lab systems (loops, shops, simulations).",
    subjects: ["computerscience"],
    years: [8, 9, 10, 11, 12],
    downloadUrl: "https://code.visualstudio.com/download",
    platforms: "Windows, macOS, Linux",
    icon: "💻",
    license: "Free",
    tutorials: [
      {
        youtubeId: "ORrELERGIHs",
        title: "VS Code for beginners",
        channel: "Programming with Mosh",
        minutes: 15,
      },
    ],
    lessonTip:
      "Create a folder for this lesson in VS Code. Type the pseudocode as real code where the pathway asks you to.",
  },
  {
    id: "python",
    name: "Python",
    purpose:
      "Senior CS pathway: run scripts, data basics, and AI-related practice projects.",
    subjects: ["computerscience"],
    years: [9, 10, 11, 12],
    downloadUrl: "https://www.python.org/downloads/",
    platforms: "Windows, macOS, Linux",
    icon: "🐍",
    license: "Free (open source)",
    tutorials: [
      {
        youtubeId: "kqtD5dpn9C8",
        title: "Python for beginners (core ideas)",
        channel: "Programming with Mosh",
        minutes: 60,
      },
    ],
    lessonTip:
      "Install Python, then confirm `python3 --version` (or `py`) works in a terminal before coding tasks.",
  },
  {
    id: "musescore",
    name: "MuseScore",
    purpose: "Music: write notation, play back melodies, and build portfolio scores.",
    subjects: ["music"],
    years: "all",
    downloadUrl: "https://musescore.org/en/download",
    platforms: "Windows, macOS, Linux",
    icon: "🎵",
    license: "Free (open source)",
    tutorials: [
      {
        youtubeId: "YiZniqYFHn8",
        title: "MuseScore 4 beginner tutorial",
        channel: "MuseScore",
        minutes: 15,
      },
    ],
    lessonTip:
      "Notate the example rhythm or melody in MuseScore, then export audio or PDF for your folio.",
  },
  {
    id: "audacity",
    name: "Audacity",
    purpose:
      "Music & language: record voice, edit audio, and practice listening portfolios.",
    subjects: ["music", "language", "english"],
    years: "all",
    downloadUrl: "https://www.audacityteam.org/download/",
    platforms: "Windows, macOS, Linux",
    icon: "🎙️",
    license: "Free (open source)",
    tutorials: [
      {
        youtubeId: "aQ0w2I0Eb9I",
        title: "Audacity beginner tutorial",
        channel: "Audacity",
        minutes: 12,
      },
    ],
    lessonTip:
      "Record a short reading or performance, trim silence, and export WAV/MP3 for assessment.",
  },
  {
    id: "libreoffice",
    name: "LibreOffice",
    purpose:
      "English, History, Science essays: free Writer/Calc for reports without paid Office.",
    subjects: ["english", "history", "science", "chemistry"],
    years: "all",
    downloadUrl: "https://www.libreoffice.org/download/download-libreoffice/",
    platforms: "Windows, macOS, Linux",
    icon: "📄",
    license: "Free (open source)",
    tutorials: [
      {
        youtubeId: "8yR9z3c0Y2I",
        title: "LibreOffice Writer basics",
        channel: "LibreOffice",
        minutes: 10,
      },
    ],
    lessonTip:
      "Draft your paragraph or experiment write-up in Writer. Use headings and save as .odt or .pdf.",
  },
  {
    id: "desmos",
    name: "Desmos Graphing Calculator",
    purpose:
      "Maths alternative/web: quick graphs when GeoGebra is not installed yet.",
    subjects: ["math"],
    years: "all",
    downloadUrl: "https://www.desmos.com/calculator",
    platforms: "Web (no install required)",
    icon: "📈",
    license: "Free web app",
    tutorials: [
      {
        youtubeId: "mvdID1El33w",
        title: "Desmos graphing calculator intro",
        channel: "Desmos",
        minutes: 8,
      },
    ],
    lessonTip:
      "If GeoGebra is still installing, use Desmos in the browser for the same graph task.",
  },
];

export function softwareForYear(year: YearLevel): SoftwareTool[] {
  return CURRICULUM_SOFTWARE.filter(
    (t) => t.years === "all" || t.years.includes(year),
  );
}

export function softwareForSubject(
  subject: SubjectId,
  year?: YearLevel,
): SoftwareTool[] {
  return CURRICULUM_SOFTWARE.filter((t) => {
    const yearOk =
      year == null || t.years === "all" || t.years.includes(year);
    const subOk =
      t.subjects[0] === "all" ||
      (t.subjects as SubjectId[]).includes(subject);
    return yearOk && subOk;
  });
}

/** Core pack always recommended at signup */
export const SIGNUP_CORE_IDS = [
  "geogebra",
  "blender",
  "vscode",
  "python",
  "musescore",
  "audacity",
  "libreoffice",
  "desmos",
] as const;

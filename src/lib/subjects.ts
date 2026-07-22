import type { LanguageMeta, SubjectMeta, YearLevel } from "./types";

export const YEARS: YearLevel[] = [7, 8, 9, 10, 11, 12];

export const SUBJECTS: SubjectMeta[] = [
  {
    id: "math",
    name: "Mathematics",
    shortName: "Maths",
    description:
      "Number, algebra, measurement, geometry, statistics and probability — made visual and fun with GeoGebra design projects (beginner star-bursts through expert galaxies), mapped to Australian Curriculum (v9) and senior pathways.",
    color: "#5b8fd4",
    icon: "∑",
    years: [7, 8, 9, 10, 11, 12],
  },
  {
    id: "science",
    name: "Science",
    shortName: "Science",
    description:
      "Biology, earth & space, physics foundations, and scientific inquiry across Years 7–12.",
    color: "#4a9b72",
    icon: "🔬",
    years: [7, 8, 9, 10, 11, 12],
  },
  {
    id: "chemistry",
    name: "Chemistry",
    shortName: "Chem",
    description:
      "Atomic structure, bonding, reactions, stoichiometry, organic chemistry and equilibrium — senior science focus with junior foundations.",
    color: "#8b7ec8",
    icon: "⚗️",
    years: [7, 8, 9, 10, 11, 12],
  },
  {
    id: "english",
    name: "English",
    shortName: "English",
    description:
      "Reading, writing, literature, media, argument and critical literacy aligned to Australian Curriculum English.",
    color: "#c47a8a",
    icon: "📖",
    years: [7, 8, 9, 10, 11, 12],
  },
  {
    id: "language",
    name: "Languages",
    shortName: "Language",
    description:
      "Choose one language and stay with it Y7–Y12 until fluent: Spanish, Russian, Chinese, German, Japanese, Khmer or Italian. Exit standard = independent user (B1+/B2−).",
    color: "#d48a5a",
    icon: "🌍",
    years: [7, 8, 9, 10, 11, 12],
  },
  {
    id: "history",
    name: "Australian History",
    shortName: "History",
    description:
      "Unfiltered Australian history — First Nations sovereignty, invasion/colonisation, frontier conflict, federation, war, rights and modern Australia.",
    color: "#c9a04a",
    icon: "🇦🇺",
    years: [7, 8, 9, 10, 11, 12],
  },
  {
    id: "music",
    name: "Music",
    shortName: "Music",
    description:
      "Listening, composition, performance literacy, Australian music, theory and cultural contexts.",
    color: "#c47aad",
    icon: "🎵",
    years: [7, 8, 9, 10, 11, 12],
  },
  {
    id: "computerscience",
    name: "Computer Science",
    shortName: "CS",
    description:
      "Each year choose a pathway: Software & App Coding, Data Science & AI, Cybersecurity & Systems, or Creative Computing & Worlds. Core lessons are shared; electives follow your track. Senior exit still covers build + defend AI.",
    color: "#5b9fd4",
    icon: "💻",
    years: [7, 8, 9, 10, 11, 12],
  },
];

export const LANGUAGES: LanguageMeta[] = [
  {
    id: "spanish",
    name: "Spanish",
    nativeName: "Español",
    flag: "🇪🇸",
    description: "Global language of communication, culture and travel.",
  },
  {
    id: "russian",
    name: "Russian",
    nativeName: "Русский",
    flag: "🇷🇺",
    description: "Cyrillic script, literature and Eurasian cultures.",
  },
  {
    id: "chinese",
    name: "Chinese (Mandarin)",
    nativeName: "中文",
    flag: "🇨🇳",
    description: "Mandarin Chinese — characters, tones and modern usage.",
  },
  {
    id: "german",
    name: "German",
    nativeName: "Deutsch",
    flag: "🇩🇪",
    description: "European language of science, philosophy and culture.",
  },
  {
    id: "japanese",
    name: "Japanese",
    nativeName: "日本語",
    flag: "🇯🇵",
    description: "Hiragana, katakana, kanji and contemporary Japan.",
  },
  {
    id: "khmer",
    name: "Khmer",
    nativeName: "ភាសាខ្មែរ",
    flag: "🇰🇭",
    description: "Cambodian language — script, culture and community links in Australia.",
  },
  {
    id: "italian",
    name: "Italian",
    nativeName: "Italiano",
    flag: "🇮🇹",
    description: "Romance language with deep Australian community history.",
  },
];

export function getSubject(id: string): SubjectMeta | undefined {
  return SUBJECTS.find((s) => s.id === id);
}

export function getLanguage(id: string): LanguageMeta | undefined {
  return LANGUAGES.find((l) => l.id === id);
}

export function subjectsForYear(year: YearLevel): SubjectMeta[] {
  return SUBJECTS.filter((s) => s.years.includes(year));
}

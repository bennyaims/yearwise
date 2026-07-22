import type {
  ContentBlock,
  LanguageId,
  Lesson,
  QuizQuestion,
  YearLevel,
} from "@/lib/types";

/**
 * Generates a dense Y7–Y12 fluency pathway for each language.
 * 4 blocks per year (except Y12 has 5 including Fluency Exit).
 * Target end-state: B1+/B2− independent user (fluent for school-leaving).
 */

type YearBlueprint = {
  year: YearLevel;
  cefr: string;
  blocks: {
    idSuffix: string;
    title: string;
    summary: string;
    focus: string[];
    speakingTask: string;
    listeningTask: string;
  }[];
};

const YEAR_BLUEPRINTS: YearBlueprint[] = [
  {
    year: 7,
    cefr: "A1",
    blocks: [
      {
        idSuffix: "y7-sounds",
        title: "Sound system & first hellos",
        summary: "Master the sound inventory; greet and introduce yourself.",
        focus: [
          "Map every important sound to listening + mouth position",
          "Shadow greetings daily until automatic",
          "Memorise 40 high-frequency words with audio",
        ],
        speakingTask:
          "Record (or perform aloud) a 30-second self-introduction without notes.",
        listeningTask:
          "Identify greetings and names in slow then clear-speed audio.",
      },
      {
        idSuffix: "y7-identity",
        title: "Identity, numbers, classroom",
        summary: "Age, numbers, classroom survival phrases.",
        focus: [
          "Count, dates, and classroom instructions",
          "Ask and answer simple personal questions",
          "Politeness formulas (please / thank you / sorry)",
        ],
        speakingTask: "Role-play student–teacher: ask to repeat and borrow an item.",
        listeningTask: "Follow three classroom commands from audio only.",
      },
      {
        idSuffix: "y7-family-home",
        title: "Family & home",
        summary: "Describe people and places in simple sentences.",
        focus: [
          "Family words + possessive patterns",
          "Basic adjectives (big/small, near/far)",
          "Two-sentence descriptions",
        ],
        speakingTask: "Describe your family for 45–60 seconds using audio models.",
        listeningTask: "Match spoken family descriptions to options.",
      },
      {
        idSuffix: "y7-fluency-check",
        title: "Year 7 fluency check",
        summary: "A1 gate: can you survive a first meeting without English?",
        focus: [
          "No-English 90-second conversation goal",
          "Listening accuracy on foundations pack",
          "Self-rate pronunciation against models",
        ],
        speakingTask:
          "Hold a 90-second meet-and-greet (name, age, school, one hobby).",
        listeningTask: "Score 70%+ on foundation listening items at clear speed.",
      },
    ],
  },
  {
    year: 8,
    cefr: "A1+ / A2−",
    blocks: [
      {
        idSuffix: "y8-food",
        title: "Food, likes & ordering",
        summary: "Café and meal talk with preferences.",
        focus: [
          "Food vocabulary + I like / I don’t like",
          "Ordering politely",
          "Prices and simple transactions",
        ],
        speakingTask: "Order a full meal and pay — 1 minute role-play.",
        listeningTask: "Catch items ordered in a short café dialogue.",
      },
      {
        idSuffix: "y8-free-time",
        title: "Free time & daily rhythm",
        summary: "Routines, hobbies, days of the week.",
        focus: [
          "Present tense habits",
          "Time expressions",
          "Invite a friend to do something",
        ],
        speakingTask: "Describe a typical weekday in 90 seconds.",
        listeningTask: "Note times and activities from a routine monologue.",
      },
      {
        idSuffix: "y8-dialogue",
        title: "Two-minute dialogues",
        summary: "Sustained partner talk with follow-up questions.",
        focus: [
          "Question words + follow-ups",
          "Turn-taking fillers",
          "Repair: “Can you repeat?” / paraphrase",
        ],
        speakingTask: "Sustain 2 minutes without English on free-time topics.",
        listeningTask: "Answer detail questions on a 2-minute dialogue.",
      },
      {
        idSuffix: "y8-fluency-check",
        title: "Year 8 fluency check",
        summary: "A2− gate: short independent exchange.",
        focus: [
          "2-minute conversation without script",
          "20 new active phrases this term recycled",
          "Clear-speed listening ≥75%",
        ],
        speakingTask: "Unscripted chat: food + free time combined.",
        listeningTask: "Mixed café/routine audio at clear speed.",
      },
    ],
  },
  {
    year: 9,
    cefr: "A2",
    blocks: [
      {
        idSuffix: "y9-past-simple",
        title: "Talking about the past",
        summary: "Weekend stories and simple past frames.",
        focus: [
          "Past time markers (yesterday, last week)",
          "Core past forms for high-frequency verbs",
          "Sequence: first / then / finally",
        ],
        speakingTask: "Tell a true weekend story for 2 minutes.",
        listeningTask: "Reorder events from a past-tense monologue.",
      },
      {
        idSuffix: "y9-town-travel",
        title: "Town, directions & travel",
        summary: "Get around and solve simple problems.",
        focus: [
          "Places in town + prepositions",
          "Ask for / give directions",
          "Transport and tickets",
        ],
        speakingTask: "Give directions from school to a landmark.",
        listeningTask: "Follow spoken directions on a simple map task.",
      },
      {
        idSuffix: "y9-opinions-light",
        title: "Simple opinions",
        summary: "I think / because — first argumentation.",
        focus: [
          "Opinion openers",
          "Because + reason",
          "Agree / disagree politely",
        ],
        speakingTask: "Give opinion on school uniform or phones — 2 minutes.",
        listeningTask: "Identify speaker’s opinion and one reason.",
      },
      {
        idSuffix: "y9-fluency-check",
        title: "Year 9 fluency check",
        summary: "A2 gate: operate in everyday situations.",
        focus: [
          "3-minute mixed topic talk",
          "Past + present in one monologue",
          "Near-natural listening gist",
        ],
        speakingTask: "Past weekend + future plan without notes.",
        listeningTask: "Gist + two details on a town/travel clip.",
      },
    ],
  },
  {
    year: 10,
    cefr: "A2+ / B1−",
    blocks: [
      {
        idSuffix: "y10-media",
        title: "Media, music & screen time",
        summary: "Discuss culture teens actually consume.",
        focus: [
          "Film/music vocabulary",
          "Recommend and justify",
          "Compare then vs now",
        ],
        speakingTask: "Recommend a show/song with two reasons — 3 minutes.",
        listeningTask: "Catch recommendations and adjectives in a review audio.",
      },
      {
        idSuffix: "y10-health-env",
        title: "Health & local environment",
        summary: "Issues that feed senior topics.",
        focus: [
          "Healthy habits language",
          "Simple environmental actions",
          "Modal verbs of advice (should / must)",
        ],
        speakingTask: "Advise a friend on sleep/screens — 3 minutes.",
        listeningTask: "Identify advice vs obligation in a short talk.",
      },
      {
        idSuffix: "y10-interaction",
        title: "Extended interaction",
        summary: "Interviews and follow-up pressure.",
        focus: [
          "Open questions that force detail",
          "Clarify and summarise",
          "Keep going when you forget a word",
        ],
        speakingTask: "Interview a partner for 4 minutes; then swap.",
        listeningTask: "Note three details from an interview audio.",
      },
      {
        idSuffix: "y10-fluency-check",
        title: "Year 10 fluency check",
        summary: "B1− gate: connected speech under light pressure.",
        focus: [
          "4-minute conversation with opinions",
          "No English except emergency repair",
          "Clear + natural listening mix ≥75%",
        ],
        speakingTask: "Defend a simple opinion with examples.",
        listeningTask: "Media + health mixed listening set.",
      },
    ],
  },
  {
    year: 11,
    cefr: "B1",
    blocks: [
      {
        idSuffix: "y11-narrative",
        title: "Narrative control",
        summary: "Past systems for storytelling accuracy.",
        focus: [
          "Completed vs ongoing past (where the language distinguishes)",
          "Time framing and flashbacks",
          "Emotional reaction language",
        ],
        speakingTask: "Tell a 4-minute personal story with clear timeline.",
        listeningTask: "Track timeline shifts in a narrative audio.",
      },
      {
        idSuffix: "y11-debate-basics",
        title: "Structured argument",
        summary: "Thesis, reason, example, mini-conclusion.",
        focus: [
          "Discourse markers (however, therefore, on the other hand)",
          "Concede + counter",
          "Formal vs informal register",
        ],
        speakingTask: "1-minute thesis + 3-minute expansion on a school issue.",
        listeningTask: "Label claim / evidence / counterclaim in a speech.",
      },
      {
        idSuffix: "y11-culture",
        title: "Culture & identity",
        summary: "Communities, migration, celebrations, values.",
        focus: [
          "Cultural vocabulary with respect",
          "Compare home and target culture",
          "Avoid stereotypes; use evidence",
        ],
        speakingTask: "Explain a festival or community practice for 4 minutes.",
        listeningTask: "Extract cultural practices from a monologue.",
      },
      {
        idSuffix: "y11-fluency-check",
        title: "Year 11 fluency check",
        summary: "B1 gate: senior-ready performance.",
        focus: [
          "5-minute prepared + 2-minute spontaneous follow-up",
          "Natural-speed listening on known themes",
          "Self-correction without collapse",
        ],
        speakingTask: "Prepared talk + unplanned questions.",
        listeningTask: "Natural-speed pack; target ≥80% on gist items.",
      },
    ],
  },
  {
    year: 12,
    cefr: "B1+ / B2−",
    blocks: [
      {
        idSuffix: "y12-spontaneous",
        title: "Spontaneous fluency",
        summary: "Think in the language under time pressure.",
        focus: [
          "2-minute improvised talks on random familiar cards",
          "Fillers and planning language in-target",
          "Speed without panic",
        ],
        speakingTask: "Three 2-minute improvised topics back-to-back.",
        listeningTask: "Natural-speed interview; answer in the language (notes OK).",
      },
      {
        idSuffix: "y12-media-debate",
        title: "Media & social debate",
        summary: "Argue contemporary issues at length.",
        focus: [
          "Pros/cons scaffolding",
          "Data language (many people, research suggests)",
          "Polite disagreement",
        ],
        speakingTask: "5-minute debate turn on tech, climate, or education.",
        listeningTask: "Identify stance and two arguments in a debate clip.",
      },
      {
        idSuffix: "y12-precision",
        title: "Precision & self-correction",
        summary: "Sound fluent and accurate.",
        focus: [
          "Common error patterns for this language",
          "Recast your own sentences",
          "Register polish for oral exams",
        ],
        speakingTask: "Re-tell a story twice: once free, once corrected.",
        listeningTask: "Spot mismatches between audio and transcript options.",
      },
      {
        idSuffix: "y12-endurance",
        title: "Endurance speaking",
        summary: "Stamina for real fluency.",
        focus: [
          "8–10 minutes total talk time in one session",
          "Topic shifts without freezing",
          "Listening fatigue training (longer clips)",
        ],
        speakingTask: "10-minute speaking circuit (4 topics).",
        listeningTask: "Longer multi-part audio with note-taking.",
      },
      {
        idSuffix: "fluency-exit",
        title: "Fluency Exit Gate",
        summary:
          "Final standard: independent user — you leave school fluent for real life and further study.",
        focus: [
          "Pathway complete for this language",
          "Listening at natural speed on familiar themes",
          "5+ minutes coherent speech with self-repair",
          "Opinion + narrative + interaction in one performance",
        ],
        speakingTask:
          "EXIT ORAL: 5 min prepared cultural/issue talk + 3 min spontaneous Q&A (no English).",
        listeningTask:
          "EXIT LISTENING: natural-speed set ≥80% — then certify fluency on device.",
      },
    ],
  },
];

const LANG_NAMES: Record<LanguageId, string> = {
  spanish: "Spanish",
  russian: "Russian",
  chinese: "Chinese (Mandarin)",
  german: "German",
  japanese: "Japanese",
  khmer: "Khmer",
  italian: "Italian",
};

const OPENERS: Record<LanguageId, string> = {
  spanish: "Hola — hoy practicamos con audios reales y habla en voz alta.",
  russian: "Привет — сегодня слушаем и говорим без английского, где можем.",
  chinese: "你好 — 今天认真听、跟读，尽量少用英语。",
  german: "Hallo — heute hören und sprechen wir so viel wie möglich.",
  japanese: "こんにちは。今日は聞いて、声に出して練習します。",
  khmer: "សួស្តី — ថ្ងៃនេះយើងស្តាប់ និងនិយាយឱ្យបានច្រើន។",
  italian: "Ciao — oggi ascoltiamo e parliamo il più possibile.",
};

function quizForBlock(
  lang: LanguageId,
  year: YearLevel,
  blockTitle: string,
  isExit: boolean,
): QuizQuestion[] {
  const name = LANG_NAMES[lang];
  const base: QuizQuestion[] = [
    {
      id: "fq1",
      prompt: `For ${name} Year ${year} (“${blockTitle}”), fluency grows most from:`,
      options: [
        "Only reading English notes",
        "Daily listening + speaking in the language",
        "Skipping audio forever",
        "One cram night before exams",
      ],
      correctIndex: 1,
      explanation:
        "Fluency is a skill from massive comprehensible input and output, not silent notes alone.",
    },
    {
      id: "fq2",
      prompt: "When you forget a word mid-speech you should:",
      options: [
        "Switch permanently to English and stop",
        "Paraphrase, gesture, or ask — stay in the language if you can",
        "End the conversation immediately",
        "Only spell in English",
      ],
      correctIndex: 1,
      explanation: "Repair strategies keep fluency alive under pressure.",
    },
    {
      id: "fq3",
      prompt: "Natural-speed listening should be:",
      options: [
        "Avoided until university",
        "Trained after slow/clear scaffolds, then often",
        "Replaced only by grammar drills",
        "Done without any purpose",
      ],
      correctIndex: 1,
      explanation: "Scaffold then increase speed — the exit gate expects natural pace.",
    },
  ];

  if (isExit) {
    base.push(
      {
        id: "fq4",
        prompt: "The Year 12 Fluency Exit means you can:",
        options: [
          "Only greet someone",
          "Speak at length, understand familiar natural audio, and argue simply without collapsing into English",
          "Translate word-for-word forever",
          "Pass by mute attendance",
        ],
        correctIndex: 1,
        explanation:
          "Exit standard is independent-user fluency (B1+/B2− school-leaving target).",
      },
      {
        id: "fq5",
        prompt: "To certify fluency on device you must:",
        options: [
          "Skip all previous years",
          "Complete the pathway blocks and pass exit listening/speaking criteria",
          "Only collect badges in other subjects",
          "Turn sound off",
        ],
        correctIndex: 1,
        explanation: "Fluency is earned across Y7–12 plus the exit gate.",
      },
      {
        id: "fq6",
        prompt: "A 5-minute oral with follow-up questions mainly tests:",
        options: [
          "Typing speed",
          "Spontaneous control and stamina in the language",
          "Memorising one sentence",
          "English essay structure only",
        ],
        correctIndex: 1,
        explanation: "Length + interaction = real fluency evidence.",
      },
    );
  } else {
    base.push({
      id: "fq4",
      prompt: `End-of-studies goal for ${name} is:`,
      options: [
        "A few tourist phrases only",
        "Fluent independent use (conversation, listening, opinions)",
        "Never speaking",
        "English subtitles only",
      ],
      correctIndex: 1,
      explanation: "Yearwise languages are designed for fluency by Year 12.",
    });
  }

  return base;
}

function contentFor(
  lang: LanguageId,
  bp: YearBlueprint,
  block: YearBlueprint["blocks"][0],
): ContentBlock[] {
  const name = LANG_NAMES[lang];
  const isExit = block.idSuffix === "fluency-exit";
  return [
    {
      type: "heading",
      text: isExit ? "Fluency Exit Gate" : `${name} · ${bp.cefr} · Year ${bp.year}`,
    },
    {
      type: "paragraph",
      text: block.summary,
    },
    {
      type: "example",
      title: "In-language warm-up",
      body: OPENERS[lang],
    },
    {
      type: "heading",
      text: "Focus this 30-minute block",
    },
    {
      type: "list",
      ordered: true,
      items: block.focus,
    },
    {
      type: "callout",
      tone: "tip",
      text: `Speaking task: ${block.speakingTask}`,
    },
    {
      type: "callout",
      tone: "info",
      text: `Listening task: ${block.listeningTask}`,
    },
    {
      type: "callout",
      tone: isExit ? "warning" : "tip",
      text: isExit
        ? "Complete Pronunciation lab + Listening at natural speed. Perform the oral exit. Then mark complete to certify fluency on this device."
        : "Use Pronunciation lab (play → slow → shadow) then Listening practice before the knowledge check. Fluency = ears + mouth every block.",
    },
    {
      type: "paragraph",
      text: isExit
        ? `${FLUENCY_LINE} You are certifying that standard for ${name}.`
        : `Pathway rule: every year raises the bar so that by Year 12 you are fluent in ${name} for real life — not just textbook exercises.`,
    },
  ];
}

const FLUENCY_LINE =
  "End-of-studies standard: independent user — sustained speech, natural listening on familiar topics, opinions without defaulting to English.";

export function buildFluencyLanguageLessons(): Lesson[] {
  const languages = Object.keys(LANG_NAMES) as LanguageId[];
  const lessons: Lesson[] = [];

  for (const lang of languages) {
    for (const bp of YEAR_BLUEPRINTS) {
      for (const block of bp.blocks) {
        const isExit = block.idSuffix === "fluency-exit";
        lessons.push({
          id: `${lang}-${block.idSuffix}`,
          title: block.title,
          summary: `${bp.cefr} · ${block.summary}`,
          estimatedMinutes: isExit ? 45 : 30,
          year: bp.year,
          subject: "language",
          language: lang,
          strand: isExit
            ? "Fluency Exit"
            : `Fluency · ${bp.cefr}`,
          content: contentFor(lang, bp, block),
          quiz: quizForBlock(lang, bp.year, block.title, isExit),
        });
      }
    }
  }

  return lessons;
}

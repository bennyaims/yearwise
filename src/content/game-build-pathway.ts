/**
 * Computer Science curriculum: code educational systems (Y7–Y12).
 * Students learn programming by building Yearwise features (scores, shops,
 * sims). Applied project tiers unlock as Digital Technologies outcomes.
 */

import type { ContentBlock, QuizQuestion, YearLevel } from "@/lib/types";

export type GameBuildModule = {
  id: string;
  year: YearLevel;
  level: number; // 1–6 shop unlock
  title: string;
  summary: string;
  minutes: number;
  content: ContentBlock[];
  quiz: QuizQuestion[];
  /** What this unlocks in applied project tools */
  unlocks: string;
};

export const GAME_BUILD_MODULES: GameBuildModule[] = [
  {
    id: "gb-y7-loops-world",
    year: 7,
    level: 1,
    title: "Level 1 · Loops that grow food",
    summary: "Use loops to place food plots and count practice coins.",
    minutes: 30,
    unlocks: "Project shop: food plots, herbivores, forest pack",
    content: [
      {
        type: "heading",
        text: "Curriculum coding: build systems that teach",
      },
      {
        type: "paragraph",
        text: "Yearwise is a full subject curriculum. In Computer Science you learn by building the educational systems the app uses: progress counters, project shops, and world injects for Genesis science (extra plants and animals). Coding is the lesson — the systems are practice projects.",
      },
      {
        type: "example",
        title: "Pseudocode: plant 5 food plots",
        body: "coins = 100\nfor i in 1..5:\n  if coins >= 25:\n    coins = coins - 25\n    plant_plot()\n  else:\n    break",
      },
      {
        type: "callout",
        tone: "tip",
        text: "Teacher approach: I do (demo loop) → We do (trace coins) → You do (quiz). Practice coins from any subject test feed applied Genesis projects.",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "Variables store coins and counts",
          "Loops repeat planting",
          "If-statements stop when coins run out",
        ],
      },
    ],
    quiz: [
      {
        id: "gb1q1",
        prompt: "A loop is best when you need to:",
        options: [
          "Run the same steps many times",
          "Never repeat code",
          "Only draw one pixel",
          "Delete the program",
        ],
        correctIndex: 0,
        explanation: "Loops repeat instructions — perfect for planting many plots.",
      },
      {
        id: "gb1q2",
        prompt: "If planting costs 25 coins and you have 60, how many full plots?",
        options: ["1", "2", "3", "60"],
        correctIndex: 1,
        explanation: "60÷25 = 2 full purchases (50 coins), 10 left over.",
      },
    ],
  },
  {
    id: "gb-y8-objects-animals",
    year: 8,
    level: 2,
    title: "Level 2 · Objects for animals",
    summary: "Model animals as objects with traits; unlock more fauna shop items.",
    minutes: 35,
    unlocks: "Shop: orchard, kelp, flyers, shore life, explorer/farmer characters",
    content: [
      {
        type: "heading",
        text: "Animals as data + behaviour",
      },
      {
        type: "paragraph",
        text: "Genesis creatures have DNA, energy, role, and behaviour. In code we group those fields into an object (or class).",
      },
      {
        type: "example",
        title: "Object sketch",
        body: "animal = {\n  role: \"herbivore\",\n  energy: 3,\n  x: 2,\n  z: -1\n}\nfunction step(animal):\n  animal.energy = animal.energy - 0.1",
      },
      {
        type: "callout",
        tone: "info",
        text: "This mirrors Genesis Organism type — your CS learning connects to the real lab code.",
      },
    ],
    quiz: [
      {
        id: "gb2q1",
        prompt: "An object groups:",
        options: [
          "Only numbers",
          "Related data (and sometimes functions)",
          "Random files",
          "Nothing useful",
        ],
        correctIndex: 1,
        explanation: "Objects bundle related properties for one thing (e.g. one animal).",
      },
      {
        id: "gb2q2",
        prompt: "Why use objects for many animals?",
        options: [
          "So each animal can have its own energy and position",
          "So the computer runs slower on purpose",
          "To avoid quizzes",
          "Objects are only for art",
        ],
        correctIndex: 0,
        explanation: "Each instance stores its own state while sharing the same structure.",
      },
    ],
  },
  {
    id: "gb-y9-systems-sim",
    year: 9,
    level: 3,
    title: "Level 3 · Simulation systems",
    summary: "Update many entities each tick — the heart of game loops.",
    minutes: 40,
    unlocks: "Shop: predators, scientist, builder characters",
    content: [
      {
        type: "heading",
        text: "The game loop",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "Read input / time",
          "Update world (move, eat, build, pollute)",
          "Draw / show state",
          "Repeat",
        ],
      },
      {
        type: "paragraph",
        text: "Genesis stepSimulation does this: every tick, organisms act, flora grow, settlements harvest wood, pollution updates.",
      },
      {
        type: "example",
        title: "Tick loop",
        body: "while running:\n  for each organism in world:\n    organism = update(organism, world)\n  world = update_pollution(world)\n  render(world)",
      },
    ],
    quiz: [
      {
        id: "gb3q1",
        prompt: "In a game loop, “update” means:",
        options: [
          "Change the world state for the next frame",
          "Only save a file",
          "Turn the computer off",
          "Delete animals",
        ],
        correctIndex: 0,
        explanation: "Update advances simulation logic before drawing.",
      },
      {
        id: "gb3q2",
        prompt: "Why process all organisms each tick?",
        options: [
          "So the world stays consistent and interactive",
          "Because one animal is enough forever",
          "To avoid using loops",
          "Ticks are only for clocks on walls",
        ],
        correctIndex: 0,
        explanation: "Multi-agent sims step everyone forward in shared time.",
      },
    ],
  },
  {
    id: "gb-y10-net-live",
    year: 10,
    level: 4,
    title: "Level 4 · Live classes & shared state",
    summary: "Join codes, presence, and syncing — multiplayer classroom basics.",
    minutes: 40,
    unlocks: "Shop: guardian character, tools tech unlock",
    content: [
      {
        type: "heading",
        text: "Rooms, codes, and presence",
      },
      {
        type: "paragraph",
        text: "Live mode uses a short class code. Teachers create a session; students join. Presence pings show who is online. Real multiplayer servers work the same idea at scale.",
      },
      {
        type: "example",
        title: "Join algorithm",
        body: "code = input()\nsession = find_session(code)\nif session is null: error\nelse: session.students.add(me)",
      },
      {
        type: "callout",
        tone: "tip",
        text: "Security note: real products need auth and servers. Our school version uses local/shared browser storage for learning.",
      },
    ],
    quiz: [
      {
        id: "gb4q1",
        prompt: "A class join code is mainly for:",
        options: [
          "Finding the correct live session",
          "Deleting the internet",
          "Replacing passwords forever with nothing",
          "Drawing 3D meshes",
        ],
        correctIndex: 0,
        explanation: "Codes route students into the right room/session.",
      },
      {
        id: "gb4q2",
        prompt: "Presence means:",
        options: [
          "Who is currently active in the class",
          "Only offline homework",
          "A type of virus",
          "Planet gravity",
        ],
        correctIndex: 0,
        explanation: "Presence tracks online participants.",
      },
    ],
  },
  {
    id: "gb-y11-3d-pipeline",
    year: 11,
    level: 5,
    title: "Level 5 · 3D pipeline (code + Blender)",
    summary: "How models move from Blender ideas into a game scene.",
    minutes: 45,
    unlocks: "Shop: blueprint slot; deeper character options",
    content: [
      {
        type: "heading",
        text: "Meshes, materials, animation",
      },
      {
        type: "paragraph",
        text: "Blender builds meshes. Games load them as assets. Yearwise currently draws procedural Three.js characters; your Blender practice prepares portfolio-ready models and animations.",
      },
      {
        type: "list",
        items: [
          "Model (shape)",
          "UV / material (look)",
          "Rig / keyframes (move)",
          "Export (glTF ideal for web)",
        ],
      },
      {
        type: "callout",
        tone: "info",
        text: "Complete Blender track lessons (YouTube-guided) in parallel with this module.",
      },
    ],
    quiz: [
      {
        id: "gb5q1",
        prompt: "A common web-friendly 3D export format is:",
        options: ["glTF / GLB", "MP3 only", "CSV spreadsheets", "Plain SMS"],
        correctIndex: 0,
        explanation: "glTF/GLB is standard for real-time web 3D.",
      },
      {
        id: "gb5q2",
        prompt: "Animation in games often uses:",
        options: [
          "Keyframes or skeletal rigs",
          "Only still photos forever",
          "Random deleting of vertices each frame with no plan",
          "Gravity alone without any poses",
        ],
        correctIndex: 0,
        explanation: "Rigs and keyframes drive character motion.",
      },
    ],
  },
  {
    id: "gb-y12-ship-defend",
    year: 12,
    level: 6,
    title: "Level 6 · Ship features & defend the system",
    summary: "Ship shop economy, tests-as-rewards, and ethical multiplayer design.",
    minutes: 45,
    unlocks: "Full shop access at CS level 6",
    content: [
      {
        type: "heading",
        text: "Economy + ethics of a learning game",
      },
      {
        type: "paragraph",
        text: "You designed a loop: learn any subject → pass tests → earn coins → unlock world content. As builders you must also prevent cheating, protect students, and avoid pay-to-win harming learning.",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "Reward mastery, not only speed",
          "Keep academic integrity (claim keys per quiz)",
          "Teacher controls for live classes",
          "Document how Genesis injects shop purchases",
        ],
      },
      {
        type: "callout",
        tone: "warning",
        text: "Senior task: propose one anti-cheat idea and one inclusion idea (students without home devices).",
      },
    ],
    quiz: [
      {
        id: "gb6q1",
        prompt: "Claim keys for quiz rewards help by:",
        options: [
          "Stopping infinite coin farming on the same test",
          "Making maths impossible",
          "Removing teachers",
          "Deleting forests automatically",
        ],
        correctIndex: 0,
        explanation: "One claim per assessment keeps the economy fair.",
      },
      {
        id: "gb6q2",
        prompt: "A healthy learning game should:",
        options: [
          "Balance fun rewards with real learning goals",
          "Only reward skipping lessons",
          "Hide all feedback",
          "Ban science forever",
        ],
        correctIndex: 0,
        explanation: "Rewards should reinforce learning, not replace it.",
      },
    ],
  },
];

export function gameBuildModulesForYear(year: YearLevel): GameBuildModule[] {
  return GAME_BUILD_MODULES.filter((m) => m.year <= year);
}

export function moduleById(id: string): GameBuildModule | undefined {
  return GAME_BUILD_MODULES.find((m) => m.id === id);
}

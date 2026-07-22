import type { LearnBeat } from "@/lib/types";

/**
 * Deep guided path for Year 7 Science — Cells: The Units of Life.
 * Every quiz idea is taught and checked before the quiz unlocks.
 */
export const CELLS_LEARN_PATH: LearnBeat[] = [
  {
    id: "cell-what",
    title: "What is a cell?",
    teach: "A cell is the smallest unit of life. Living things (you, a tree, a fly) are made of cells. Most cells are tiny — you need a microscope to see them well.",
    bullets: [
      "“Unit of life” means: life’s building block.",
      "Some organisms are one cell; humans are trillions of cells.",
    ],
    remember: "Cell = smallest living building block.",
    check: {
      prompt: "A cell is best described as:",
      options: [
        "A type of rock",
        "The smallest unit of life",
        "Only found in animals, never plants",
        "A whole organ like the heart",
      ],
      correctIndex: 1,
      hint: "Cells are the basic living units that make up organisms — not rocks or whole organs.",
      whyCorrect:
        "Yes. Cells are the smallest units that can carry out life processes. Organs are made of many cells.",
    },
  },
  {
    id: "cell-theory",
    title: "Cell theory — three rules",
    teach: "Scientists summarised cell biology in three rules called cell theory. You need all three:",
    bullets: [
      "1. All living things are made of one or more cells.",
      "2. The cell is the basic unit of structure and function.",
      "3. New cells come only from existing cells (cells divide).",
    ],
    remember: "Made of cells · basic unit · cells from cells.",
    check: {
      prompt: "Which statement is part of cell theory?",
      options: [
        "Living things can appear from dust with no cells",
        "All living things are made of cells",
        "Only plants have cells",
        "Cells never divide",
      ],
      correctIndex: 1,
      hint: "Cell theory says every living thing is made of cells, and new cells come from old ones.",
      whyCorrect:
        "Correct. All living things are cellular. Cells do not pop into existence from non-living dust.",
    },
  },
  {
    id: "organelle-word",
    title: "What does “organelle” mean?",
    teach: "An organelle is a specialised part inside a cell with a job — like tiny organs inside the cell.\n\nIf a question says “which organelle…”, it means “which cell part…”.",
    remember: "Organelle = cell part with a job.",
    check: {
      prompt: "In a quiz, “organelle” means:",
      options: [
        "A whole plant",
        "A specialised structure inside a cell",
        "Only the outside of the body",
        "A type of food",
      ],
      correctIndex: 1,
      hint: "Think: organ-elle — a little organ inside the cell.",
      whyCorrect:
        "Yes. Nucleus, mitochondrion, chloroplast, ribosome are all organelles (cell parts with jobs).",
    },
  },
  {
    id: "nucleus",
    title: "Nucleus — the control centre",
    teach: "The nucleus is the control centre of the cell. It contains DNA — the genetic instructions that tell the cell what to build and how to work.",
    bullets: [
      "Job: control / hold DNA.",
      "It does NOT make food from light (that’s not the nucleus).",
      "Most plant and animal cells have a nucleus.",
    ],
    remember: "Nucleus → DNA / control.",
    check: {
      prompt: "The nucleus’s main job is to:",
      options: [
        "Capture sunlight to make glucose",
        "Hold DNA and control the cell",
        "Be a rigid outer wall only",
        "Only store water",
      ],
      correctIndex: 1,
      hint: "DNA and control live in the nucleus — not photosynthesis.",
      whyCorrect:
        "Right. Nucleus = DNA + control. Photosynthesis is a different organelle.",
    },
  },
  {
    id: "mitochondrion",
    title: "Mitochondrion — energy from food",
    teach: "The mitochondrion (plural: mitochondria) releases energy from food by a process called cellular respiration.\n\nPeople call it the “powerhouse of the cell” because it supplies usable energy.\n\nImportant: mitochondria do NOT perform photosynthesis.",
    bullets: [
      "Job: respiration → energy from food.",
      "Found in both plant and animal cells.",
      "Do not confuse with chloroplasts.",
    ],
    remember: "Mitochondrion → energy FROM food (respiration). Not light food-making.",
    check: {
      prompt: "Mitochondria mainly:",
      options: [
        "Make glucose using light",
        "Release energy from food (respiration)",
        "Store the cell’s DNA",
        "Form the rigid plant cell wall",
      ],
      correctIndex: 1,
      hint: "Powerhouse = energy from food, not sunlight food-making.",
      whyCorrect:
        "Yes. Respiration in mitochondria frees energy from food. Light → food is chloroplasts.",
    },
  },
  {
    id: "ribosome",
    title: "Ribosome — builds proteins",
    teach: "Ribosomes build proteins. They follow instructions that ultimately come from DNA.\n\nProteins do many jobs (enzymes, structure, etc.). Ribosomes are not where photosynthesis happens.",
    remember: "Ribosome → proteins.",
    check: {
      prompt: "Ribosomes are the organelle that:",
      options: [
        "Perform photosynthesis",
        "Build proteins",
        "Are only the plant cell wall",
        "Store water in a large vacuole",
      ],
      correctIndex: 1,
      hint: "Protein factory = ribosome.",
      whyCorrect: "Correct. Ribosomes synthesise proteins; chloroplasts do photosynthesis.",
    },
  },
  {
    id: "photosynthesis-idea",
    title: "What is photosynthesis?",
    teach: "Photosynthesis is how plants make their own food using light.\n\nBreak the word down:\n• photo = light\n• synthesis = making\n\nSo: making food using light energy.",
    bullets: [
      "Needs: light, carbon dioxide (CO₂), water, and chlorophyll (green pigment).",
      "Makes: glucose (food) and oxygen.",
      "Word equation: carbon dioxide + water → glucose + oxygen (using light).",
    ],
    remember: "Photosynthesis = make food with light.",
    check: {
      prompt: "Photosynthesis means:",
      options: [
        "Breaking food only in animals",
        "Making food using light energy",
        "Copying DNA only",
        "Building proteins on ribosomes",
      ],
      correctIndex: 1,
      hint: "Photo = light; synthesis = making.",
      whyCorrect:
        "Yes. Plants use light to make glucose. That process is photosynthesis.",
    },
  },
  {
    id: "chloroplast",
    title: "Chloroplast — where photosynthesis happens",
    teach: "The chloroplast is the organelle where photosynthesis happens.\n\nChloroplasts contain chlorophyll (green), which captures light energy so the cell can make glucose.\n\nChloroplasts are in plant cells (green parts) and some algae — not in animal cells.",
    bullets: [
      "Organelle for photosynthesis = chloroplast.",
      "Contains chlorophyll (captures light).",
      "Animal cells do not have chloroplasts → animals cannot photosynthesise like plants.",
    ],
    remember: "Chloroplast = photosynthesis factory. Green = chlorophyll.",
    check: {
      prompt: "Which organelle performs photosynthesis?",
      options: ["Mitochondrion", "Nucleus", "Chloroplast", "Ribosome"],
      correctIndex: 2,
      hint: "You just learned: photosynthesis site = chloroplast (has chlorophyll).",
      whyCorrect:
        "Chloroplast. Mitochondrion = respiration; nucleus = DNA; ribosome = proteins.",
    },
  },
  {
    id: "compare-mito-chloro",
    title: "Don’t mix them up: mito vs chloro",
    teach: "This is the #1 trap in Year 7 quizzes.\n\n• Chloroplast → makes food using light (photosynthesis). Plants.\n• Mitochondrion → releases energy from food (respiration). Plants AND animals.\n\nBoth deal with energy, but different jobs.",
    remember: "Chloro = make food (light). Mito = use food (energy out).",
    check: {
      prompt: "A plant cell needs energy from food it already has. Which organelle releases that energy?",
      options: ["Chloroplast only", "Mitochondrion", "Cell wall", "Ribosome"],
      correctIndex: 1,
      hint: "Releasing energy from food = respiration = mitochondrion. Chloroplast makes the food.",
      whyCorrect:
        "Mitochondrion. Chloroplasts make glucose; mitochondria help get energy out of it.",
    },
  },
  {
    id: "plant-vs-animal",
    title: "Plant cell vs animal cell",
    teach: "Both plant and animal cells usually have: nucleus, cytoplasm, cell membrane, mitochondria, ribosomes.\n\nPlant cells also have extras:",
    bullets: [
      "Cell wall — rigid outer support (outside the membrane).",
      "Chloroplasts — photosynthesis (green parts).",
      "Large permanent vacuole — stores water and dissolved substances.",
    ],
    remember: "Plant extras: wall, chloroplasts, big vacuole.",
    check: {
      prompt: "Which structures do plant cells typically have that animal cells do not?",
      options: [
        "Nucleus and membrane only",
        "Cell wall and chloroplasts",
        "Only ribosomes",
        "Only cytoplasm",
      ],
      correctIndex: 1,
      hint: "Plants: wall + chloroplasts (+ large vacuole). Animals lack those.",
      whyCorrect:
        "Yes. Cell wall and chloroplasts are classic plant-only features at this level.",
    },
  },
  {
    id: "exam-run",
    title: "Exam-style run-through",
    teach: "Put it together the way a test asks:\n\nQuestion: Which organelle performs photosynthesis?\n\nStep 1: Photosynthesis = make food with light.\nStep 2: That happens in the chloroplast.\nStep 3: Cross out wrong jobs:\n• Mitochondrion → respiration\n• Nucleus → DNA\n• Ribosome → proteins\n\nAnswer: Chloroplast.",
    remember: "Always match job → organelle before looking at letters A/B/C/D.",
    check: {
      prompt: "Final dry run — which organelle performs photosynthesis?",
      options: ["Mitochondrion", "Nucleus", "Chloroplast", "Ribosome"],
      correctIndex: 2,
      hint: "Make food with light → chloroplast. You’ve answered this correctly in an earlier step.",
      whyCorrect:
        "Chloroplast. You’re ready for the quiz — same idea, you’ll recognise the trap options.",
    },
  },
];

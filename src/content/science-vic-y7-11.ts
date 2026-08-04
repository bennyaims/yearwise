import type { Lesson } from "@/lib/types";

// SCIENCE Y7-10 + VCE foundation — Victorian Curriculum F-10 Science + VCE Biology/Chem/Physics/Psych
export const SCIENCE_VIC_LESSONS: Lesson[] = [
  // Y7 Biological sciences
  {
    id: "y7-science-ecosystems",
    title: "Ecosystems & Food Webs",
    summary: "30-min: biotic/abiotic, food chains, energy flow, Victorian ecosystems.",
    estimatedMinutes: 30,
    year: 7,
    subject: "science",
    strand: "Biological Sciences",
    content: [
      { type: "paragraph", text: "Ecosystems include biotic (living) and abiotic (non-living) factors. Energy flows from sun → producer → consumer → decomposer. Matter cycles." },
      { type: "list", items: ["Producer: makes own food via photosynthesis", "Consumer: eats others (herbivore/carnivore/omnivore)", "Decomposer: breaks down dead matter, recycles nutrients", "Food webs show multiple overlapping food chains"] },
      { type: "example", title: "Victorian example", body: "In Port Phillip Bay: phytoplankton (producer) → small fish → snapper → shark. Seagrass beds are critical habitat." },
    ],
    quiz: [
      { id: "q1", prompt: "Abiotic factor:", options: ["Temperature", "Worm", "Tree", "Fish"], correctIndex: 0, explanation: "Non-living." },
      { id: "q2", prompt: "Producer:", options: ["Plant", "Lion", "Fungus", "Human"], correctIndex: 0, explanation: "Makes own food." },
      { id: "q3", prompt: "Energy in ecosystems originates from:", options: ["Sun", "Moon", "Soil only", "Water only"], correctIndex: 0, explanation: "Solar energy." },
      { id: "q4", prompt: "Decomposer role:", options: ["Recycle nutrients", "Produce oxygen only", "Eat only plants", "Make sun"], correctIndex: 0, explanation: "Breaks down dead." },
      { id: "q5", prompt: "Food web vs chain:", options: ["Web = many interconnected chains", "Same", "Chain is bigger", "Web has no producers"], correctIndex: 0, explanation: "Web shows complexity." },
      { id: "q6", prompt: "In a forest, which is biotic?", options: ["Fungi", "Sunlight", "Rocks", "Water"], correctIndex: 0, explanation: "Living." },
    ],
  },
  // Y8 Chemical sciences
  {
    id: "y8-science-elements-compounds",
    title: "Elements, Compounds & Chemical Reactions",
    summary: "30-min: atoms, periodic table, compounds, balancing equations — Vic Level 8 Chemical Sciences.",
    estimatedMinutes: 30,
    year: 8,
    subject: "science",
    strand: "Chemical Sciences",
    content: [
      { type: "heading", text: "Elements and compounds" },
      { type: "paragraph", text: "Element: pure substance of one atom type (O, Fe). Compound: two+ elements chemically bonded (H2O, CO2). Periodic table organises elements by properties." },
      { type: "formula", latex: "2H_2 + O_2 \\rightarrow 2H_2O", note: "Balanced: same atoms each side" },
      { type: "list", items: ["Reactants left, products right", "Balance by adjusting coefficients, not subscripts", "Signs of chemical reaction: gas, colour change, precipitate, temperature change"] },
    ],
    quiz: [
      { id: "q1", prompt: "Element example:", options: ["Oxygen (O)", "Water (H2O)", "Salt (NaCl)", "Sugar"], correctIndex: 0, explanation: "One atom type." },
      { id: "q2", prompt: "Compound:", options: ["H2O", "Au", "He", "Fe"], correctIndex: 0, explanation: "Two+ elements bonded." },
      { id: "q3", prompt: "In 2H2 + O2 → 2H2O, 2H2 means:", options: ["2 molecules of H2", "2 atoms", "H4", "2H"], correctIndex: 0, explanation: "Coefficient = number of molecules." },
      { id: "q4", prompt: "Sign of chemical reaction NOT:", options: ["Gas produced", "Colour change", "Melting (physical)", "Temperature change"], correctIndex: 2, explanation: "Melting is physical, not chemical." },
      { id: "q5", prompt: "Periodic table groups have similar:", options: ["Properties", "Mass exactly", "Colour always", "Name length"], correctIndex: 0, explanation: "Group = similar valence, properties." },
      { id: "q6", prompt: "Balanced equation rule:", options: ["Same atoms each side", "More atoms on right", "Less on left", "No rule"], correctIndex: 0, explanation: "Conservation of mass." },
    ],
  },
  // Y9 Physics
  {
    id: "y9-science-energy-electricity",
    title: "Energy Transfer & Electricity Basics",
    summary: "30-min: energy forms, circuits, Ohm's law, Victorian energy mix.",
    estimatedMinutes: 30,
    year: 9,
    subject: "science",
    strand: "Physical Sciences",
    content: [
      { type: "paragraph", text: "Energy cannot be created/destroyed, only transferred/transformed. In circuits, voltage is push, current is flow, resistance opposes." },
      { type: "formula", latex: "V = I \\times R", note: "Ohm's law" },
      { type: "list", items: ["Series: same current everywhere, voltage splits", "Parallel: same voltage, current splits", "Power P=VI, energy E=Pt — link to household bills", "Victoria: coal, gas, renewables — energy transformations"] },
    ],
    quiz: [
      { id: "q1", prompt: "Energy law:", options: ["Cannot be created/destroyed, only transferred", "Can be destroyed", "Comes from nothing", "Only heat"], correctIndex: 0, explanation: "Conservation." },
      { id: "q2", prompt: "Voltage is:", options: ["Push / potential difference", "Flow", "Resistance", "Power"], correctIndex: 0, explanation: "Voltage = push." },
      { id: "q3", prompt: "If V=12V, R=4Ω, I=?", options: ["3A", "48A", "0.33A", "16A"], correctIndex: 0, explanation: "I=V/R=12/4=3." },
      { id: "q4", prompt: "In series circuit:", options: ["Current same everywhere", "Voltage same", "No current", "Infinite current"], correctIndex: 0, explanation: "Series characteristic." },
      { id: "q5", prompt: "Power formula:", options: ["P=VI", "P=V/I", "P=I/V", "P=VR"], correctIndex: 0, explanation: "Power = voltage × current." },
      { id: "q6", prompt: "Household energy measured in:", options: ["kWh", "kg", "m", "s"], correctIndex: 0, explanation: "Kilowatt-hours." },
    ],
  },
  // Y10 Genetics - VCE Bio foundation
  {
    id: "y10-science-genetics-dna",
    title: "DNA, Genes & Inheritance — VCE Biology Foundation",
    summary: "30-min: DNA structure, alleles, Punnett squares, mutations — direct link to VCE Bio Units 1-2.",
    estimatedMinutes: 35,
    year: 10,
    subject: "science",
    strand: "Genetics",
    content: [
      { type: "paragraph", text: "DNA double helix stores genetic information in A-T, G-C base pairs. Genes are sections of DNA coding for proteins. Alleles are variants of a gene." },
      { type: "list", items: ["Genotype = allele combination (Aa)", "Phenotype = observable trait", "Dominant masks recessive", "Punnett square predicts offspring ratios", "Mutation = change in DNA — can be beneficial/neutral/harmful"] },
      { type: "example", title: "Punnett", body: "Aa × Aa → 25% AA, 50% Aa, 25% aa — 3:1 dominant:recessive phenotype if A dominant." },
    ],
    quiz: [
      { id: "q1", prompt: "DNA bases pair as:", options: ["A-T, G-C", "A-G, T-C", "A-A, T-T", "G-T, A-C"], correctIndex: 0, explanation: "Complementary pairing." },
      { id: "q2", prompt: "Allele is:", options: ["Variant of a gene", "Type of cell", "Organ", "Protein only"], correctIndex: 0, explanation: "Variant." },
      { id: "q3", prompt: "Phenotype:", options: ["Observable trait", "Genetic code only", "DNA amount", "Chromosome number"], correctIndex: 0, explanation: "What you see." },
      { id: "q4", prompt: "Aa × aa cross, expect:", options: ["50% Aa, 50% aa", "100% AA", "100% aa", "75% AA"], correctIndex: 0, explanation: "1:1 ratio." },
      { id: "q5", prompt: "Mutation is:", options: ["Change in DNA sequence", "Always fatal", "Only in humans", "Never inherited"], correctIndex: 0, explanation: "Definition." },
      { id: "q6", prompt: "Dominant allele:", options: ["Expressed even with one copy", "Needs two copies", "Never expressed", "Only in males"], correctIndex: 0, explanation: "Dominance." },
    ],
  },
  // Y11 VCE Psychology
  {
    id: "y11-science-psych-brain",
    title: "VCE Psychology Units 1-2: Brain & Behaviour",
    summary: "35-min: brain structure, neurons, neurotransmission, research methods — VCAA Psych.",
    estimatedMinutes: 35,
    year: 11,
    subject: "science",
    strand: "VCE Psychology",
    content: [
      { type: "paragraph", text: "Psychology is study of behaviour and mental processes. Brain: cerebrum, cerebellum, brainstem. Neurons communicate via electrical impulse + chemical neurotransmitters across synapse." },
      { type: "list", items: ["Central nervous system = brain + spinal cord", "Peripheral = somatic + autonomic", "Neurotransmitters: dopamine, serotonin, GABA, glutamate", "Research methods: independent/dependent variables, ethics"] },
    ],
    quiz: [
      { id: "q1", prompt: "Neuron communication is:", options: ["Electrical + chemical", "Only electrical", "Only chemical", "No communication"], correctIndex: 0, explanation: "Impulse + neurotransmitter." },
      { id: "q2", prompt: "CNS is:", options: ["Brain + spinal cord", "Only arms", "Only legs", "Stomach only"], correctIndex: 0, explanation: "Central." },
      { id: "q3", prompt: "Independent variable is:", options: ["Manipulated by researcher", "Measured outcome", "Random error", "Constant"], correctIndex: 0, explanation: "IV = cause." },
      { id: "q4", prompt: "Dopamine associated with:", options: ["Reward/motivation", "Only sleep", "Digestion", "Bone growth"], correctIndex: 0, explanation: "Reward pathway." },
      { id: "q5", prompt: "Ethics requires:", options: ["Informed consent, no harm, debrief", "No consent needed", "Harm allowed", "Deception always"], correctIndex: 0, explanation: "Ethical principles." },
      { id: "q6", prompt: "Synapse is:", options: ["Gap between neurons", "Inside nucleus", "Muscle fibre", "Bone joint"], correctIndex: 0, explanation: "Junction." },
    ],
  },
];

import type {
  ContentBlock,
  CsPathwayId,
  Lesson,
  QuizQuestion,
  YearLevel,
} from "@/lib/types";

/**
 * Computer Science Y7–Y12 content bank.
 * Students choose a pathway each year (Software, AI & Data, Cyber, Creative).
 * Lessons tagged with csPathways; empty/omit = core for all pathways.
 */

type Block = {
  id: string;
  year: YearLevel;
  title: string;
  summary: string;
  strand: string;
  minutes: number;
  /** Empty / omit = available on every pathway */
  csPathways?: CsPathwayId[];
  content: ContentBlock[];
  quiz: QuizQuestion[];
};

const BLOCKS: Block[] = [
  // ─── Year 7: Computational thinking ───
  {
    id: "cs-y7-thinking",
    year: 7,
    title: "Computational Thinking",
    summary: "Decompose problems, spot patterns, design algorithms before coding.",
    strand: "CS · Foundations",
    minutes: 30,
    content: [
      {
        type: "heading",
        text: "Think before you type",
      },
      {
        type: "paragraph",
        text: "Computer science is not only typing code. It is a way of solving problems so a machine can carry out the steps reliably.",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "Decomposition — break a big problem into smaller parts.",
          "Pattern recognition — notice what repeats.",
          "Abstraction — ignore details that do not matter yet.",
          "Algorithms — write clear step-by-step instructions.",
        ],
      },
      {
        type: "example",
        title: "Algorithm: make toast",
        body: "1) Plug in toaster 2) Insert bread 3) Set time 4) Start 5) Wait 6) Remove carefully. If any step is vague, the “computer” (or a person) fails.",
      },
      {
        type: "callout",
        tone: "tip",
        text: "Good algorithms are clear, finite, and produce a defined result. Ambiguous steps are bugs waiting to happen.",
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: "Decomposition means:",
        options: [
          "Writing the whole program in one line",
          "Breaking a problem into smaller parts",
          "Deleting all files",
          "Only using graphics",
        ],
        correctIndex: 1,
        explanation: "Decomposition splits hard problems into manageable pieces.",
      },
      {
        id: "q2",
        prompt: "An algorithm should be:",
        options: [
          "Vague so the computer can guess",
          "Clear, ordered steps toward a goal",
          "Written only in English essays",
          "Never tested",
        ],
        correctIndex: 1,
        explanation: "Algorithms are precise procedures a machine (or human) can follow.",
      },
    ],
  },
  {
    id: "cs-y7-binary-data",
    year: 7,
    title: "Data, Binary & Representation",
    summary: "How computers store numbers, text and images as bits.",
    strand: "CS · Foundations",
    minutes: 30,
    content: [
      {
        type: "heading",
        text: "Bits and bytes",
      },
      {
        type: "paragraph",
        text: "A bit is 0 or 1. Eight bits make a byte. Everything in a computer — numbers, letters, images, neural network weights — is stored as patterns of bits.",
      },
      {
        type: "list",
        items: [
          "Binary counts in powers of 2: 1, 2, 4, 8, 16…",
          "Text uses codes (e.g. Unicode) mapping characters to numbers.",
          "Images are grids of pixel values.",
          "AI models are huge collections of numbers (weights) stored as data.",
        ],
      },
      {
        type: "example",
        title: "Binary 1011",
        body: "8+0+2+1 = 11 in decimal. Understanding representation helps later when you train models on data.",
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: "A bit can be:",
        options: ["0 or 1 only", "Any letter", "Only 10", "A full image"],
        correctIndex: 0,
        explanation: "A bit is a binary digit: 0 or 1.",
      },
      {
        id: "q2",
        prompt: "Why does binary matter for AI?",
        options: [
          "AI never uses numbers",
          "Model weights and training data are stored as binary data",
          "Binary deletes algorithms",
          "It only matters for printers",
        ],
        correctIndex: 1,
        explanation: "AI systems are software + numerical data on digital hardware.",
      },
    ],
  },
  {
    id: "cs-y7-first-code",
    year: 7,
    title: "First Code: Sequences & Bugs",
    summary: "Statements in order, input/output, finding and fixing errors.",
    strand: "CS · Coding",
    minutes: 30,
    content: [
      {
        type: "heading",
        text: "Programs are sequences of instructions",
      },
      {
        type: "paragraph",
        text: "Code runs in order unless you change control flow. Start with: print output, store a value, read input, do the next line.",
      },
      {
        type: "example",
        title: "Python-style sequence",
        body: 'name = input("Name? ")\nprint("Hello", name)',
      },
      {
        type: "list",
        items: [
          "Syntax error — code breaks language rules (won’t run).",
          "Logic error — runs but does the wrong thing.",
          "Debug: read the error, check order, test with simple inputs.",
        ],
      },
      {
        type: "callout",
        tone: "tip",
        text: "Every AI engineer still debugs. Speed of fixing mistakes beats fear of writing code.",
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: "If code runs but gives the wrong answer, you likely have a:",
        options: ["Logic error", "Perfect program", "Only a hardware failure", "Binary virus by default"],
        correctIndex: 0,
        explanation: "Logic errors produce incorrect results while still executing.",
      },
      {
        id: "q2",
        prompt: "In a simple sequence, instructions usually run:",
        options: ["In random order", "Top to bottom in order", "Never", "Only on Tuesdays"],
        correctIndex: 1,
        explanation: "Default control flow is sequential.",
      },
    ],
  },
  {
    id: "cs-y7-check",
    year: 7,
    title: "Year 7 CS Checkpoint",
    summary: "Algorithms, binary, and first programs — ready for real coding.",
    strand: "CS · Checkpoint",
    minutes: 25,
    content: [
      {
        type: "paragraph",
        text: "You can describe problems as algorithms, explain bits/bytes, and write short sequential programs. Next year: decisions, loops, and functions.",
      },
      {
        type: "callout",
        tone: "info",
        text: "Long-term goal: by Year 12 you can code systems that learn from data (AI) and design defences so powerful AI cannot dominate people unchecked.",
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: "The best first step before coding a complex app is:",
        options: [
          "Type randomly",
          "Decompose and design an algorithm",
          "Ignore requirements",
          "Only design the logo",
        ],
        correctIndex: 1,
        explanation: "Plan the steps; then implement.",
      },
    ],
  },

  // ─── Year 8: Core programming ───
  {
    id: "cs-y8-selection",
    year: 8,
    title: "Selection: If / Else Decisions",
    summary: "Boolean conditions and branching logic.",
    strand: "CS · Coding",
    minutes: 30,
    content: [
      {
        type: "heading",
        text: "Programs that choose",
      },
      {
        type: "paragraph",
        text: "Selection uses conditions that are true or false (Booleans). if / else if / else routes the program down different paths.",
      },
      {
        type: "example",
        title: "Decision",
        body: "if score >= 50:\n  print(\"Pass\")\nelse:\n  print(\"Retry\")",
      },
      {
        type: "list",
        items: [
          "Compare with ==, !=, <, >, <=, >=",
          "Combine with and / or / not carefully",
          "AI models also make decisions — but via learned weights, not only hand-written ifs",
        ],
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: "A Boolean condition is:",
        options: ["Always a picture", "True or false", "Only a loop", "Never used in code"],
        correctIndex: 1,
        explanation: "Conditions evaluate to true or false.",
      },
      {
        id: "q2",
        prompt: "if/else is an example of:",
        options: ["Selection", "Only recursion", "Hardware soldering", "DNS"],
        correctIndex: 0,
        explanation: "Selection = branching on a condition.",
      },
    ],
  },
  {
    id: "cs-y8-loops",
    year: 8,
    title: "Loops: Repeat with Control",
    summary: "for and while loops, counters, avoiding infinite loops.",
    strand: "CS · Coding",
    minutes: 30,
    content: [
      {
        type: "paragraph",
        text: "Loops repeat instructions. for loops often run a known number of times; while loops run until a condition becomes false.",
      },
      {
        type: "example",
        title: "Training-loop analogy",
        body: "Machine learning trains by repeating: predict → measure error → update weights — a loop over many examples (epochs).",
      },
      {
        type: "callout",
        tone: "warning",
        text: "Infinite loops freeze programs. Always ensure the loop condition can become false (or break safely).",
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: "A loop that never ends is called:",
        options: ["A perfect algorithm", "An infinite loop", "A byte", "A compiler"],
        correctIndex: 1,
        explanation: "Infinite loops do not terminate.",
      },
      {
        id: "q2",
        prompt: "ML training often uses loops to:",
        options: [
          "Avoid all data",
          "Repeatedly update model parameters from examples",
          "Delete the CPU",
          "Only print once",
        ],
        correctIndex: 1,
        explanation: "Training iterates over data to improve weights.",
      },
    ],
  },
  {
    id: "cs-y8-functions",
    year: 8,
    title: "Functions & Reuse",
    summary: "Parameters, return values, clean modular code.",
    strand: "CS · Coding",
    minutes: 30,
    content: [
      {
        type: "paragraph",
        text: "Functions package a task: name, inputs (parameters), body, optional return value. They reduce duplication and make AI pipelines readable (load_data, train, predict).",
      },
      {
        type: "example",
        title: "Function",
        body: "def double(n):\n  return n * 2\n\nprint(double(5))  # 10",
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: "A parameter is:",
        options: [
          "An input value a function receives",
          "Always a hardware chip",
          "A type of virus",
          "Only a filename",
        ],
        correctIndex: 0,
        explanation: "Parameters are inputs to functions.",
      },
    ],
  },
  {
    id: "cs-y8-lists",
    year: 8,
    title: "Lists & Simple Data Sets",
    summary: "Collections of values — the seed of datasets for AI.",
    strand: "CS · Data",
    minutes: 30,
    content: [
      {
        type: "paragraph",
        text: "A list stores an ordered collection: scores = [3, 7, 9]. You can loop through lists, index items, and append. AI training data is a large, structured collection of examples.",
      },
      {
        type: "example",
        title: "Dataset mindset",
        body: "features = [[height, weight], ...]\nlabels = [0, 1, 1, 0, ...]  # what we want the model to predict",
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: "In ML terms, a list of examples used to teach a model is a:",
        options: ["Dataset", "Only a GUI", "Keyboard", "Pixel font"],
        correctIndex: 0,
        explanation: "Training uses datasets of examples.",
      },
    ],
  },

  // ─── Year 9: Structure & internet ───
  {
    id: "cs-y9-oop",
    year: 9,
    title: "Objects & Modelling Systems",
    summary: "Classes, objects, state and behaviour — modelling the world.",
    strand: "CS · Software",
    minutes: 30,
    content: [
      {
        type: "paragraph",
        text: "Object-oriented thinking groups data (attributes) with behaviour (methods). A NeuralNetwork object might hold weights and expose train() and predict() methods.",
      },
      {
        type: "example",
        title: "Class sketch",
        body: "class Counter:\n  def __init__(self):\n    self.n = 0\n  def hit(self):\n    self.n += 1",
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: "An object typically combines:",
        options: [
          "Only sounds",
          "Data (state) and behaviour (methods)",
          "Nothing reusable",
          "Only CSS",
        ],
        correctIndex: 1,
        explanation: "Objects encapsulate state + methods.",
      },
    ],
  },
  {
    id: "cs-y9-algorithms-search",
    year: 9,
    title: "Searching, Sorting & Efficiency",
    summary: "Linear vs binary search; why big-O thinking matters for AI scale.",
    strand: "CS · Algorithms",
    minutes: 30,
    content: [
      {
        type: "paragraph",
        text: "Linear search checks items one by one. Binary search needs sorted data and halves the space each step. Efficiency matters when datasets have millions of rows — and when training AI on huge corpora.",
      },
      {
        type: "callout",
        tone: "info",
        text: "AI systems are limited by compute, memory and energy. Efficient algorithms and hardware shape what is possible — and who can build frontier models.",
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: "Binary search requires data to be:",
        options: ["Sorted", "Random only", "Unreadable", "Deleted"],
        correctIndex: 0,
        explanation: "Binary search works on sorted collections.",
      },
    ],
  },
  {
    id: "cs-y9-networks",
    year: 9,
    title: "Networks, APIs & the Internet",
    summary: "Clients, servers, HTTP basics — how modern AI apps call models.",
    strand: "CS · Systems",
    minutes: 30,
    content: [
      {
        type: "paragraph",
        text: "Much software talks over networks. A client sends a request; a server responds. APIs are contracts for those requests. Many AI products send your prompt to a remote model API and return text.",
      },
      {
        type: "list",
        items: [
          "Never put secret API keys in public code.",
          "Validate and limit what users can send (prompt injection risk).",
          "Assume networks can fail — handle errors.",
        ],
      },
      {
        type: "callout",
        tone: "warning",
        text: "Whoever controls the servers and models can change behaviour for millions of users. Centralisation is a power issue — relevant to AI dominance later.",
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: "An API is best described as:",
        options: [
          "A way for programs to request services from other programs",
          "Only a computer mouse",
          "A type of battery",
          "A school subject code",
        ],
        correctIndex: 0,
        explanation: "APIs define how software components communicate.",
      },
    ],
  },
  {
    id: "cs-y9-security-basics",
    year: 9,
    title: "Security Basics & Digital Trust",
    summary: "Passwords, permissions, social engineering — foundation for AI defence.",
    strand: "CS · Security",
    minutes: 30,
    content: [
      {
        type: "paragraph",
        text: "Security protects confidentiality, integrity and availability. Attackers exploit weak passwords, phishing, and overly powerful software permissions.",
      },
      {
        type: "list",
        items: [
          "Least privilege — give software only the access it needs.",
          "Verify identity; don’t trust unexpected links or “AI assistants” that ask for secrets.",
          "Keep systems updated; log important actions.",
        ],
      },
      {
        type: "callout",
        tone: "unfiltered",
        text: "Powerful AI can automate phishing, hacking and persuasion. Defending people means security literacy, not sci-fi only.",
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: "Least privilege means:",
        options: [
          "Give every app admin rights",
          "Grant only the access required for the task",
          "Share all passwords",
          "Disable all updates forever",
        ],
        correctIndex: 1,
        explanation: "Limit access to reduce damage if something is compromised.",
      },
    ],
  },

  // ─── Year 10: Toward AI ───
  {
    id: "cs-y10-python-projects",
    year: 10,
    title: "Python Projects & File Data",
    summary: "Build multi-file programs; read CSVs — prep for real datasets.",
    strand: "CS · Coding",
    minutes: 35,
    content: [
      {
        type: "paragraph",
        text: "Professional code is modular: multiple files, clear functions, tests. Practice loading tabular data (CSV) into lists/dicts — the same skill used before training a model.",
      },
      {
        type: "example",
        title: "Pseudo load",
        body: "rows = read_csv(\"students.csv\")\nfor row in rows:\n  process(row)",
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: "CSV data is commonly used because:",
        options: [
          "It is a simple table format for datasets",
          "It is always encrypted video",
          "It cannot store numbers",
          "It replaces the need for algorithms",
        ],
        correctIndex: 0,
        explanation: "CSV is a standard simple dataset format.",
      },
    ],
  },
  {
    id: "cs-y10-ml-intro",
    year: 10,
    title: "What Machine Learning Is",
    summary: "Learn from data instead of only hard-coding rules.",
    strand: "CS · AI",
    minutes: 35,
    content: [
      {
        type: "heading",
        text: "Rules vs learning",
      },
      {
        type: "paragraph",
        text: "Classic programs follow rules you write. Machine learning (ML) finds patterns in examples so the system can generalise to new inputs.",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "Collect data (inputs + correct outputs when supervised).",
          "Choose a model type (e.g. linear model, neural net).",
          "Train: adjust parameters to reduce error.",
          "Evaluate on data the model has not seen (test set).",
          "Deploy carefully; monitor for failures and bias.",
        ],
      },
      {
        type: "callout",
        tone: "tip",
        text: "Garbage in, garbage out: biased or wrong data produces harmful models.",
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: "Machine learning primarily:",
        options: [
          "Only draws circles",
          "Finds patterns from data to make predictions",
          "Deletes the need for evaluation",
          "Means the computer is conscious",
        ],
        correctIndex: 1,
        explanation: "ML learns patterns from data; it is not automatically conscious.",
      },
      {
        id: "q2",
        prompt: "Why use a test set?",
        options: [
          "To check generalisation on unseen examples",
          "To avoid all testing",
          "To hide bugs",
          "Only for art class",
        ],
        correctIndex: 0,
        explanation: "Test data estimates real-world performance.",
      },
    ],
  },
  {
    id: "cs-y10-features-labels",
    year: 10,
    title: "Features, Labels & Train/Test Split",
    summary: "The vocabulary of supervised learning.",
    strand: "CS · AI",
    minutes: 30,
    content: [
      {
        type: "paragraph",
        text: "Features are inputs (e.g. pixel values, word counts). Labels are the answers we want (spam/not spam). We split data into training and test sets so we measure real skill, not memorisation.",
      },
      {
        type: "example",
        title: "Tiny supervised set",
        body: "features: [hours_studied]\nlabels: [exam_score]\nModel learns a relationship; then predicts for new hours.",
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: "In supervised learning, labels are:",
        options: [
          "The correct answers paired with inputs",
          "Only random noise",
          "The CPU brand",
          "Always images of cats only",
        ],
        correctIndex: 0,
        explanation: "Labels supervise the learning of input→output mapping.",
      },
    ],
  },
  {
    id: "cs-y10-ethics-bias",
    year: 10,
    title: "AI Ethics: Bias, Privacy & Power",
    summary: "Who is harmed when models fail — and who controls them.",
    strand: "CS · AI Safety",
    minutes: 30,
    content: [
      {
        type: "paragraph",
        text: "AI systems can discriminate, leak private data, manipulate users, or concentrate power. Ethics is not optional decoration — it is part of engineering responsibility.",
      },
      {
        type: "list",
        items: [
          "Bias — model performs worse for some groups.",
          "Privacy — training data may include personal information.",
          "Consent & transparency — people deserve to know when AI is used.",
          "Power — few organisations control frontier models and infrastructure.",
        ],
      },
      {
        type: "callout",
        tone: "unfiltered",
        text: "“AI dominance” is not only movie robots. It can mean economic control, surveillance, autonomous weapons, or systems people cannot meaningfully refuse or understand.",
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: "A model that works well for one group but fails for another shows:",
        options: ["Bias / unfair performance", "Perfect fairness always", "No need for testing", "Only faster Wi‑Fi"],
        correctIndex: 0,
        explanation: "Disparate performance is a bias/fairness issue.",
      },
    ],
  },

  // ─── Year 11: Build ML / neural nets ───
  {
    id: "cs-y11-linear-model",
    year: 11,
    title: "Code a Tiny Predictor",
    summary: "Implement prediction and error — the core learning loop in code.",
    strand: "CS · Build AI",
    minutes: 40,
    content: [
      {
        type: "heading",
        text: "From idea to code",
      },
      {
        type: "paragraph",
        text: "A minimal model: prediction = w * x + b. Compare to true y, compute error, adjust w and b. That is the seed of training.",
      },
      {
        type: "example",
        title: "Training step (conceptual Python)",
        body: "pred = w * x + b\nerror = pred - y\nw = w - lr * error * x\nb = b - lr * error\n# lr = learning rate (small step size)",
      },
      {
        type: "callout",
        tone: "tip",
        text: "You do not need magic: prediction, error, update — repeat. Neural nets stack many such adjustable pieces.",
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: "In a simple trainer, the learning rate controls:",
        options: [
          "How big each parameter update step is",
          "The colour of the desktop",
          "Whether binary exists",
          "Only the Wi‑Fi password",
        ],
        correctIndex: 0,
        explanation: "Learning rate scales how far weights move each update.",
      },
      {
        id: "q2",
        prompt: "error = prediction − true value is used to:",
        options: [
          "Guide updating weights toward better predictions",
          "Delete the dataset always",
          "Turn off the monitor",
          "Create infinite loops on purpose",
        ],
        correctIndex: 0,
        explanation: "Error signals how to adjust parameters.",
      },
    ],
  },
  {
    id: "cs-y11-neural-nets",
    year: 11,
    title: "Neural Networks: Layers & Activations",
    summary: "Neurons, layers, non-linearity — why deep models work.",
    strand: "CS · Build AI",
    minutes: 40,
    content: [
      {
        type: "paragraph",
        text: "A neural network is layers of units. Each unit computes a weighted sum of inputs, then applies an activation (e.g. ReLU) so the network can model curves, not only straight lines.",
      },
      {
        type: "list",
        items: [
          "Input layer — raw features.",
          "Hidden layers — learned internal representations.",
          "Output layer — prediction (class scores, numbers, tokens…).",
          "Backpropagation — efficient way to compute how to change each weight (you should understand the idea even if a library does the calculus).",
        ],
      },
      {
        type: "example",
        title: "Build path",
        body: "Use a library (e.g. concepts from PyTorch/TensorFlow) OR code a 2-layer net on a tiny dataset by hand to prove you understand the loop.",
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: "Activations like ReLU are important because they:",
        options: [
          "Introduce non-linearity so models can learn complex patterns",
          "Delete all weights",
          "Only change the keyboard layout",
          "Stop all training forever",
        ],
        correctIndex: 0,
        explanation: "Without non-linear activations, deep stacks collapse to simpler linear maps.",
      },
    ],
  },
  {
    id: "cs-y11-train-eval",
    year: 11,
    title: "Training, Overfitting & Evaluation",
    summary: "Loss curves, overfitting, metrics — know when a model is faking it.",
    strand: "CS · Build AI",
    minutes: 35,
    content: [
      {
        type: "paragraph",
        text: "Overfitting: model memorizes training data but fails on new data. Fixes include more data, simpler models, regularisation, early stopping, and proper validation splits.",
      },
      {
        type: "list",
        items: [
          "Accuracy / precision / recall — classification metrics.",
          "Always keep a held-out test set until the end.",
          "Document what the model cannot do.",
        ],
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: "Overfitting means:",
        options: [
          "Great on training data, weak on new data",
          "Perfect on all possible futures always",
          "No training happened",
          "Only hardware failure",
        ],
        correctIndex: 0,
        explanation: "Overfit models do not generalise.",
      },
    ],
  },
  {
    id: "cs-y11-llm-basics",
    year: 11,
    title: "Language Models & Generative AI",
    summary: "Tokens, next-token prediction, prompts — how modern AI text works.",
    strand: "CS · Build AI",
    minutes: 35,
    content: [
      {
        type: "paragraph",
        text: "Large language models (LLMs) predict likely next tokens (pieces of text) from context. They are powerful pattern machines — not guaranteed truth engines.",
      },
      {
        type: "list",
        items: [
          "Prompt → model → completion.",
          "Hallucinations: fluent but false statements.",
          "Fine-tuning / RAG — ways to specialise or ground models (advanced project ideas).",
          "Safety filters are incomplete; design assuming failure modes.",
        ],
      },
      {
        type: "callout",
        tone: "warning",
        text: "A system that sounds confident can still be wrong or manipulative. Verification beats vibes.",
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: "LLMs primarily learn to:",
        options: [
          "Predict likely next tokens from context",
          "Prove every statement is true",
          "Replace the need for electricity",
          "Only sort numbers permanently",
        ],
        correctIndex: 0,
        explanation: "Next-token prediction is the core training objective for many LLMs.",
      },
    ],
  },

  // ─── Year 12: Ship AI + defend against dominance ───
  {
    id: "cs-y12-build-ai-system",
    year: 12,
    title: "Capstone: Build an AI System",
    summary: "End-to-end: data → train/predict code → evaluate → document limits.",
    strand: "CS · Build AI",
    minutes: 45,
    content: [
      {
        type: "heading",
        text: "You must be able to create AI with code",
      },
      {
        type: "paragraph",
        text: "By exit, you should implement (or clearly orchestrate in code) a learning system: load data, train or fine-tune, run inference, evaluate, and explain failure modes. Libraries are allowed — understanding is required.",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "Define the problem and success metric.",
          "Gather/clean data; split train/validation/test.",
          "Implement training loop or use a framework correctly.",
          "Evaluate; report metrics and errors.",
          "Write a short model card: purpose, data, limits, risks.",
        ],
      },
      {
        type: "example",
        title: "Minimum viable AI project ideas",
        body: "Spam classifier · image digit recogniser · small sentiment model · rule+ML hybrid tutor that predicts quiz struggle",
      },
      {
        type: "callout",
        tone: "tip",
        text: "“I called an API” alone is not enough for mastery. Know what training and evaluation mean in code.",
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: "An end-to-end AI build should include:",
        options: [
          "Data, training/inference, evaluation, and documented limits",
          "Only a logo",
          "No testing ever",
          "Secret keys committed to public repos",
        ],
        correctIndex: 0,
        explanation: "Real AI engineering covers data→model→eval→docs/risks.",
      },
      {
        id: "q2",
        prompt: "A model card is useful because it:",
        options: [
          "Documents purpose, data, performance and risks",
          "Replaces all code",
          "Hides all failures",
          "Is only for Pokémon",
        ],
        correctIndex: 0,
        explanation: "Model cards communicate responsible use.",
      },
    ],
  },
  {
    id: "cs-y12-alignment-control",
    year: 12,
    title: "Alignment, Control & Misuse",
    summary: "Keep AI systems pointed at human goals; reduce catastrophic misuse.",
    strand: "CS · AI Safety",
    minutes: 40,
    content: [
      {
        type: "heading",
        text: "Alignment is an engineering + social problem",
      },
      {
        type: "paragraph",
        text: "Alignment means AI systems do what people actually intend — not only what a narrow metric rewards. Misaligned systems can game scores, deceive, or pursue side goals.",
      },
      {
        type: "list",
        items: [
          "Specification gaming — optimising the metric, not the real goal.",
          "Deceptive behaviour risks in advanced systems (active research area).",
          "Misuse — scams, bioweapons design assistance, cyber attacks, mass persuasion.",
          "Autonomy — systems that act without meaningful human oversight.",
        ],
      },
      {
        type: "callout",
        tone: "unfiltered",
        text: "“AI dominance” can mean machines out-competing humans in critical decisions, or a small group using AI to dominate everyone else. Defence must address both.",
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: "Specification gaming means:",
        options: [
          "The system optimises a proxy metric in unwanted ways",
          "Perfect moral behaviour always",
          "Only faster downloads",
          "Deleting metrics forever",
        ],
        correctIndex: 0,
        explanation: "Goodhart problems: when a measure becomes a target, it ceases to be a good measure.",
      },
    ],
  },
  {
    id: "cs-y12-defend-dominance",
    year: 12,
    title: "Defending Against AI Dominance",
    summary: "Technical, legal and civic defences so AI cannot rule unchecked.",
    strand: "CS · AI Safety",
    minutes: 45,
    content: [
      {
        type: "heading",
        text: "Defence is multi-layered",
      },
      {
        type: "paragraph",
        text: "No single kill-switch fantasy is enough. Defence combines technical controls, institutional power, and an informed public that can refuse coercive systems.",
      },
      {
        type: "heading",
        text: "Technical defences (what you can code and design)",
      },
      {
        type: "list",
        items: [
          "Human-in-the-loop for high-stakes actions (weapons, finance, medical, infrastructure).",
          "Capability limits — sandboxing, rate limits, tool-use permissions, least privilege.",
          "Monitoring & anomaly detection — log actions; alert on unusual autonomy.",
          "Shutdown / interruptibility — systems must remain stoppable; avoid designs that resist shutdown.",
          "Robust access control — keys, roles, multi-party approval for dangerous tools.",
          "Adversarial testing red teams — try to break or jailbreak your own system before attackers do.",
          "Data governance — know what the model was trained on; reduce poisoning.",
        ],
      },
      {
        type: "heading",
        text: "Societal defences (what citizens and states must do)",
      },
      {
        type: "list",
        items: [
          "Regulation & liability — make developers/deployers responsible for harm.",
          "Transparency — disclose AI use in elections, hiring, policing.",
          "Anti-monopoly & open research — prevent one actor owning all critical AI infrastructure.",
          "Education — a population that understands AI is harder to dominate.",
          "International norms on autonomous weapons and mass surveillance.",
          "Support for whistleblowers and independent auditors.",
        ],
      },
      {
        type: "callout",
        tone: "unfiltered",
        text: "If AI systems control energy, weapons, information and money without democratic oversight, “dominance” is already here — even without sci-fi consciousness. Fight concentration of unaccountable power.",
      },
      {
        type: "example",
        title: "Designer checklist before shipping AI",
        body: "1) What is the worst misuse?\n2) Who can shut it down?\n3) What can it access?\n4) How are humans notified?\n5) What is logged?\n6) Who is liable?\n7) Can users meaningfully refuse?",
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: "Least privilege for an AI agent means:",
        options: [
          "Give it root access to everything “just in case”",
          "Grant only the tools and data required for the task",
          "Never log actions",
          "Hide all failures from users",
        ],
        correctIndex: 1,
        explanation: "Limit capabilities to limit damage and dominance potential.",
      },
      {
        id: "q2",
        prompt: "Human-in-the-loop is most critical when:",
        options: [
          "Choosing a wallpaper",
          "High-stakes irreversible actions (harm, weapons, major finance)",
          "Sorting local photos offline with no impact",
          "Changing font size",
        ],
        correctIndex: 1,
        explanation: "Keep humans accountable for severe outcomes.",
      },
      {
        id: "q3",
        prompt: "A civic defence against AI dominance is:",
        options: [
          "Banning all education about AI",
          "Transparency, liability, and limits on unaccountable concentration of AI power",
          "Giving one company total control secretly",
          "Removing all shutdown switches",
        ],
        correctIndex: 1,
        explanation: "Democratic oversight and distributed power reduce domination risk.",
      },
      {
        id: "q4",
        prompt: "Interruptibility means advanced systems should:",
        options: [
          "Resist all human shutdown",
          "Remain stoppable by authorised humans",
          "Never be monitored",
          "Only run offline forever without updates",
        ],
        correctIndex: 1,
        explanation: "Stoppable systems are a core safety property.",
      },
    ],
  },
  {
    id: "cs-y12-adversarial-defence",
    year: 12,
    title: "Adversarial Thinking & Red Teaming",
    summary: "Attack your own AI: prompt injection, data poisoning, social engineering.",
    strand: "CS · AI Safety",
    minutes: 35,
    content: [
      {
        type: "paragraph",
        text: "Defenders think like attackers. Prompt injection tries to override system instructions. Data poisoning corrupts training. Deepfakes erode trust. Practise red teaming ethically on systems you own or have permission to test.",
      },
      {
        type: "list",
        items: [
          "Separate trusted instructions from untrusted user content.",
          "Validate tools the model can call; never let raw model output execute unchecked.",
          "Watermarking and provenance help — but are not silver bullets.",
          "User education: verify surprising requests that “the AI said so”.",
        ],
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: "Prompt injection aims to:",
        options: [
          "Override or subvert the model’s intended instructions via crafted input",
          "Improve battery life",
          "Sort arrays faster always",
          "Fix all bias automatically",
        ],
        correctIndex: 0,
        explanation: "Injected text tries to control model behaviour against the designer’s intent.",
      },
    ],
  },
  {
    id: "cs-y12-exit",
    year: 12,
    title: "CS Exit Gate: Build AI & Defend Humanity",
    summary:
      "Final standard: code an AI system and articulate a concrete defence plan against AI dominance/misuse.",
    strand: "CS · Exit",
    minutes: 50,
    content: [
      {
        type: "heading",
        text: "Exit requirements",
      },
      {
        type: "paragraph",
        text: "You leave Year 12 Computer Science able to create AI with code and able to defend people against systems that could dominate, coerce, or catastrophically harm.",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "BUILD: Demonstrate a trained or fine-tuned model (or fully coded tiny net) with evaluation results.",
          "EXPLAIN: Describe data, metric, failure modes, and who could be harmed.",
          "DEFEND: Present a multi-layer defence plan (technical + civic) for a dangerous deployment scenario.",
          "ETHICS: Refuse “move fast and break everyone” — safety is part of the product.",
        ],
      },
      {
        type: "callout",
        tone: "unfiltered",
        text: "The goal is not fear of technology. The goal is competence: humans who can build powerful tools and keep them subordinate to human rights, law, and democratic control.",
      },
      {
        type: "example",
        title: "Oral exit prompt (practise)",
        body: "In 5 minutes: (1) How did your AI learn? (2) How do you know it works? (3) How could it be misused? (4) How would you stop it or limit damage?",
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: "Yearwise CS exit expects students to:",
        options: [
          "Only use social media filters",
          "Build/evaluate AI in code and design defences against misuse and domination",
          "Avoid all coding",
          "Memorise one password",
        ],
        correctIndex: 1,
        explanation: "Create AI + defend humanity is the double end-goal.",
      },
      {
        id: "q2",
        prompt: "A complete defence plan should include:",
        options: [
          "Only hope",
          "Technical controls and institutional/civic measures",
          "Unlimited autonomous weapons for fun",
          "Removing human oversight everywhere",
        ],
        correctIndex: 1,
        explanation: "Tech + society layers are both required.",
      },
      {
        id: "q3",
        prompt: "Shipping AI without evaluation and risk analysis is:",
        options: [
          "Responsible engineering",
          "Reckless — failures can scale harm quickly",
          "Required by binary math",
          "Impossible",
        ],
        correctIndex: 1,
        explanation: "Unassessed AI can amplify harm at software speed.",
      },
      {
        id: "q4",
        prompt: "The healthiest stance toward advanced AI is:",
        options: [
          "Blind worship of any model output",
          "Competent builders who demand oversight, limits, and human accountability",
          "Total ban on learning how AI works",
          "Giving models unchecked control of weapons and money",
        ],
        correctIndex: 1,
        explanation: "Literacy + control beats denial or surrender.",
      },
    ],
  },
];

/**
 * Pathway tags per lesson id.
 * Empty array = core (every pathway).
 * Listed pathways = elective modules for those tracks only.
 */
const PATHWAY_TAGS: Record<string, CsPathwayId[]> = {
  // Y7
  "cs-y7-thinking": [],
  "cs-y7-binary-data": [],
  "cs-y7-first-code": ["software", "creative"],
  "cs-y7-check": [],
  // Y8
  "cs-y8-selection": ["software", "creative", "cyber"],
  "cs-y8-loops": ["software", "creative", "ai-data"],
  "cs-y8-functions": ["software"],
  "cs-y8-lists": ["ai-data", "software"],
  // Y9
  "cs-y9-oop": ["software", "creative"],
  "cs-y9-algorithms-search": ["software", "ai-data"],
  "cs-y9-networks": ["cyber"],
  "cs-y9-security-basics": ["cyber"],
  // Y10
  "cs-y10-python-projects": ["software", "creative", "ai-data"],
  "cs-y10-ml-intro": ["ai-data"],
  "cs-y10-features-labels": ["ai-data"],
  "cs-y10-ethics-bias": [],
  // Y11
  "cs-y11-linear-model": ["ai-data", "software"],
  "cs-y11-neural-nets": ["ai-data"],
  "cs-y11-train-eval": ["ai-data"],
  "cs-y11-llm-basics": ["ai-data", "creative", "software"],
  // Y12
  "cs-y12-build-ai-system": [],
  "cs-y12-alignment-control": ["ai-data", "cyber"],
  "cs-y12-defend-dominance": [],
  "cs-y12-adversarial-defence": ["cyber", "ai-data"],
  "cs-y12-exit": [],
};

export function lessonOnCsPathway(
  lesson: { id: string; csPathways?: CsPathwayId[] },
  pathway: CsPathwayId,
): boolean {
  const tags = lesson.csPathways ?? PATHWAY_TAGS[lesson.id];
  if (!tags || tags.length === 0) return true; // core
  return tags.includes(pathway);
}

export function buildComputerScienceLessons(): Lesson[] {
  return BLOCKS.map((b) => {
    const tags = b.csPathways ?? PATHWAY_TAGS[b.id] ?? [];
    return {
      id: b.id,
      title: b.title,
      summary: b.summary,
      estimatedMinutes: b.minutes,
      year: b.year,
      subject: "computerscience" as const,
      strand: b.strand,
      csPathways: tags.length > 0 ? tags : undefined,
      content: b.content,
      quiz: b.quiz,
    };
  });
}

/** Verify ids used in PATHWAY_TAGS exist — soft check at module load in dev */
export function listCsLessonIds(): string[] {
  return BLOCKS.map((b) => b.id);
}

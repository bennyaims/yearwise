/**
 * App-run classes with a teacher-style voice bot.
 * Students start lessons from the app — no human teacher required.
 * Optional join codes still work if friends share a session.
 */

export type ClassSubject =
  | "math"
  | "science"
  | "chemistry"
  | "english"
  | "history"
  | "music"
  | "computerscience"
  | "language"
  | "genesis"
  | "blender"
  | "game-build";

export type LessonStep = {
  title: string;
  minutes: number;
  /** On-screen board text */
  script: string;
  /** What the voice bot reads (clear spoken English) */
  voiceScript: string;
  /** Optional deeper explanation */
  explainMore?: string;
};

export type LiveClassSession = {
  code: string;
  title: string;
  /** Display name of the app teacher persona */
  teacherName: string;
  subject: ClassSubject;
  yearLevel: number;
  startsAt: string;
  durationMin: number;
  status: "scheduled" | "live" | "ended";
  agenda: string[];
  lessonSteps: LessonStep[];
  students: { id: string; name: string; joinedAt: string }[];
  createdAt: string;
  /** Always app-hosted; kept for clarity */
  host: "app";
};

export type LivePresence = {
  code: string;
  studentId: string;
  studentName: string;
  lastSeen: string;
  coins?: number;
};

export type ClassCatalogItem = {
  id: string;
  title: string;
  subject: ClassSubject;
  yearLevel: number;
  durationMin: number;
  blurb: string;
  icon: string;
};

const CLASSES_KEY = "yearwise-live-classes-v2";
const PRESENCE_KEY = "yearwise-live-presence-v1";
const ME_KEY = "yearwise-student-id-v1";

/** App teacher personas (voice bots) */
export const TEACHER_BOTS = [
  { name: "Coach Ava", style: "warm and clear" },
  { name: "Coach Leo", style: "upbeat and step-by-step" },
  { name: "Coach Mira", style: "calm science explainer" },
] as const;

export const CLASS_CATALOG: ClassCatalogItem[] = [
  {
    id: "cat-y7-math",
    title: "Y7 Maths · Patterns & integers",
    subject: "math",
    yearLevel: 7,
    durationMin: 25,
    blurb: "Number lines, steps, and patterns — with worked examples out loud.",
    icon: "🔢",
  },
  {
    id: "cat-y7-sci",
    title: "Y7 Science · Living world",
    subject: "science",
    yearLevel: 7,
    durationMin: 30,
    blurb: "Cells, energy, and ecosystems — evidence over guessing.",
    icon: "🔬",
  },
  {
    id: "cat-y8-cs",
    title: "Y8 CS · Code educational systems (Level 1)",
    subject: "game-build",
    yearLevel: 8,
    durationMin: 35,
    blurb: "Loops, practice coins, and food-plot logic — curriculum coding.",
    icon: "💻",
  },
  {
    id: "cat-y8-chem",
    title: "Y8 Chemistry · Particles",
    subject: "chemistry",
    yearLevel: 8,
    durationMin: 30,
    blurb: "Atoms, states of matter, and safe lab thinking.",
    icon: "⚗️",
  },
  {
    id: "cat-y9-genesis",
    title: "Y9 Genesis · Habitable worlds",
    subject: "genesis",
    yearLevel: 9,
    durationMin: 30,
    blurb: "Stars, orbits, and why life needs the right balance.",
    icon: "🌍",
  },
  {
    id: "cat-y9-blender",
    title: "Y9 Blender · Model a tree",
    subject: "blender",
    yearLevel: 9,
    durationMin: 40,
    blurb: "3D thinking for forests and characters — free tools.",
    icon: "🎨",
  },
  {
    id: "cat-y10-eng",
    title: "Y10 English · Clear claims",
    subject: "english",
    yearLevel: 10,
    durationMin: 30,
    blurb: "Thesis, evidence, and explaining ideas out loud.",
    icon: "📚",
  },
  {
    id: "cat-y10-hist",
    title: "Y10 History · Sources matter",
    subject: "history",
    yearLevel: 10,
    durationMin: 30,
    blurb: "Primary vs secondary sources — no sugar-coating.",
    icon: "📜",
  },
  {
    id: "cat-y11-cs",
    title: "Y11 CS · Systems that scale",
    subject: "computerscience",
    yearLevel: 11,
    durationMin: 40,
    blurb: "How game systems connect: shop, sim, and live rooms.",
    icon: "⚙️",
  },
  {
    id: "cat-y12-sci",
    title: "Y12 Science · Evidence essay",
    subject: "science",
    yearLevel: 12,
    durationMin: 35,
    blurb: "Structure a scientific argument for habitation decisions.",
    icon: "📝",
  },
];

function loadAll(): LiveClassSession[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CLASSES_KEY);
    if (!raw) {
      // migrate from v1 once
      const old = localStorage.getItem("yearwise-live-classes-v1");
      if (old) {
        const parsed = JSON.parse(old) as LiveClassSession[];
        return parsed.map((c) => ({ ...c, host: "app" as const }));
      }
      return [];
    }
    return JSON.parse(raw) as LiveClassSession[];
  } catch {
    return [];
  }
}

function saveAll(list: LiveClassSession[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CLASSES_KEY, JSON.stringify(list));
  try {
    window.dispatchEvent(new CustomEvent("yearwise-live-update"));
  } catch {
    /* ignore */
  }
}

export function getOrCreateStudentId(): string {
  if (typeof window === "undefined") return "server";
  let id = localStorage.getItem(ME_KEY);
  if (!id) {
    id = `stu-${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(ME_KEY, id);
  }
  return id;
}

function makeCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let c = "";
  for (let i = 0; i < 6; i++) c += chars[Math.floor(Math.random() * chars.length)]!;
  return c;
}

function pickTeacherBot(): string {
  const i = Math.floor(Math.random() * TEACHER_BOTS.length);
  return TEACHER_BOTS[i]!.name;
}

/** Start an app-run class now (student or browse catalog) */
export function startAppClass(opts: {
  subject: ClassSubject;
  yearLevel: number;
  title?: string;
  durationMin?: number;
  studentName?: string;
}): LiveClassSession {
  const pack = buildLessonScript(opts.subject, opts.yearLevel);
  const teacherName = pickTeacherBot();
  const durationMin =
    opts.durationMin ??
    Math.max(
      15,
      pack.steps.reduce((s, st) => s + st.minutes, 0),
    );

  const session: LiveClassSession = {
    code: makeCode(),
    title:
      opts.title ??
      `Y${opts.yearLevel} ${subjectLabel(opts.subject)} · with ${teacherName}`,
    teacherName,
    subject: opts.subject,
    yearLevel: opts.yearLevel,
    startsAt: new Date().toISOString(),
    durationMin,
    status: "live",
    agenda: pack.agenda,
    lessonSteps: pack.steps,
    students: [],
    createdAt: new Date().toISOString(),
    host: "app",
  };

  if (opts.studentName) {
    session.students.push({
      id: getOrCreateStudentId(),
      name: opts.studentName.trim() || "Student",
      joinedAt: new Date().toISOString(),
    });
  }

  const all = loadAll().filter((c) => c.status !== "ended").slice(-15);
  all.push(session);
  saveAll(all);
  return session;
}

/** @deprecated alias — app is the host */
export function createLiveClass(opts: {
  title: string;
  teacherName?: string;
  subject: ClassSubject;
  yearLevel: number;
  durationMin?: number;
  startsAt?: Date;
  agenda?: string[];
  studentName?: string;
}): LiveClassSession {
  const session = startAppClass({
    subject: opts.subject,
    yearLevel: opts.yearLevel,
    title: opts.title,
    durationMin: opts.durationMin,
    studentName: opts.studentName,
  });
  if (opts.teacherName) {
    session.teacherName = opts.teacherName;
    const all = loadAll();
    const idx = all.findIndex((c) => c.code === session.code);
    if (idx >= 0) {
      all[idx] = session;
      saveAll(all);
    }
  }
  return session;
}

export function startFromCatalog(
  item: ClassCatalogItem,
  studentName?: string,
): LiveClassSession {
  return startAppClass({
    subject: item.subject,
    yearLevel: item.yearLevel,
    title: item.title,
    durationMin: item.durationMin,
    studentName,
  });
}

export function listLiveClasses(): LiveClassSession[] {
  const now = Date.now();
  const all = loadAll().map((c) => {
    const start = new Date(c.startsAt).getTime();
    const end = start + c.durationMin * 60_000;
    let status: LiveClassSession["status"] = c.status;
    if (now >= end) status = "ended";
    else if (now >= start) status = "live";
    else status = "scheduled";
    return { ...c, status, host: "app" as const };
  });
  saveAll(all);
  return all.filter(
    (c) =>
      c.status !== "ended" ||
      now - new Date(c.startsAt).getTime() < 86_400_000,
  );
}

export function getClassByCode(code: string): LiveClassSession | undefined {
  return listLiveClasses().find(
    (c) => c.code.toUpperCase() === code.trim().toUpperCase(),
  );
}

export function joinClass(
  code: string,
  studentName: string,
): { ok: boolean; session?: LiveClassSession; message: string } {
  const all = loadAll();
  const idx = all.findIndex(
    (c) => c.code.toUpperCase() === code.trim().toUpperCase(),
  );
  if (idx < 0) return { ok: false, message: "Class code not found." };
  const session = all[idx]!;
  const start = new Date(session.startsAt).getTime();
  const end = start + session.durationMin * 60_000;
  const now = Date.now();
  if (now > end) return { ok: false, message: "This class has ended." };

  const id = getOrCreateStudentId();
  if (!session.students.some((s) => s.id === id)) {
    session.students.push({
      id,
      name: studentName.trim() || "Student",
      joinedAt: new Date().toISOString(),
    });
  }
  session.status = now >= start ? "live" : "scheduled";
  all[idx] = session;
  saveAll(all);
  pingPresence(session.code, studentName);

  return { ok: true, session, message: `Joined ${session.title}` };
}

export function pingPresence(code: string, studentName: string) {
  if (typeof window === "undefined") return;
  const id = getOrCreateStudentId();
  const list = loadPresence().filter(
    (p) => p.code !== code || p.studentId !== id,
  );
  list.push({
    code,
    studentId: id,
    studentName,
    lastSeen: new Date().toISOString(),
  });
  localStorage.setItem(PRESENCE_KEY, JSON.stringify(list.slice(-200)));
}

function loadPresence(): LivePresence[] {
  try {
    const raw = localStorage.getItem(PRESENCE_KEY);
    return raw ? (JSON.parse(raw) as LivePresence[]) : [];
  } catch {
    return [];
  }
}

export function presenceForClass(code: string): LivePresence[] {
  const cutoff = Date.now() - 60_000;
  return loadPresence().filter(
    (p) => p.code === code && new Date(p.lastSeen).getTime() > cutoff,
  );
}

export function classTimeRemaining(session: LiveClassSession): {
  phase: "countdown" | "live" | "ended";
  ms: number;
  label: string;
} {
  const now = Date.now();
  const start = new Date(session.startsAt).getTime();
  const end = start + session.durationMin * 60_000;
  if (now < start) {
    const ms = start - now;
    return { phase: "countdown", ms, label: formatMs(ms) + " until start" };
  }
  if (now < end) {
    const ms = end - now;
    return { phase: "live", ms, label: formatMs(ms) + " left" };
  }
  return { phase: "ended", ms: 0, label: "Ended" };
}

/** Which step should be active based on elapsed class time */
export function currentStepIndex(
  session: LiveClassSession,
  nowMs = Date.now(),
): number {
  const start = new Date(session.startsAt).getTime();
  let elapsedMin = (nowMs - start) / 60_000;
  if (elapsedMin < 0) return 0;
  let acc = 0;
  for (let i = 0; i < session.lessonSteps.length; i++) {
    acc += session.lessonSteps[i]!.minutes;
    if (elapsedMin < acc) return i;
  }
  return Math.max(0, session.lessonSteps.length - 1);
}

function formatMs(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(s / 60);
  const r = s % 60;
  if (m >= 60) {
    const h = Math.floor(m / 60);
    return `${h}h ${m % 60}m`;
  }
  return `${m}:${String(r).padStart(2, "0")}`;
}

export function subjectLabel(subject: ClassSubject): string {
  const map: Record<ClassSubject, string> = {
    math: "Maths",
    science: "Science",
    chemistry: "Chemistry",
    english: "English",
    history: "History",
    music: "Music",
    computerscience: "Computer Science",
    language: "Languages",
    genesis: "Genesis Lab",
    blender: "Blender 3D",
    "game-build": "Game Build",
  };
  return map[subject];
}

/** Teacher-style timed scripts with voice lines the bot reads aloud */
export function buildLessonScript(
  subject: ClassSubject,
  year: number,
): { agenda: string[]; steps: LessonStep[] } {
  if (subject === "genesis") {
    return {
      agenda: [
        "Learning intention",
        "Star & orbit model",
        "Explore the world",
        "Exit check",
      ],
      steps: [
        {
          title: "Welcome (3 min)",
          minutes: 3,
          script:
            "Today we study an Earth-like world. There is no wrong path — every change is evidence. We will look at star type, distance, water, and life.",
          voiceScript: `Hello. I'm your app teacher for Genesis Lab. Welcome to Year ${year}. Today we study an Earth-like world. There is no wrong path — every change you make is evidence. We will look at star type, orbit distance, water, and living things. When you're ready, we'll model one idea at a time.`,
          explainMore:
            "Scientists learn by changing one variable and watching what happens. In this class, you are the scientist. The sim is your experiment. Write one sentence: what do you expect plants to need?",
        },
        {
          title: "I do — habitability (8 min)",
          minutes: 8,
          script:
            "Teacher model: a yellow star with planet near 1 AU gets good light. Too close → hot and harsh UV. Too far → cold. Water coverage feeds weather and food webs.",
          voiceScript:
            "Watch this model. A yellow star is like our Sun. If the planet sits near one astronomical unit — about Earth's distance — light and heat are comfortable for many life forms. Move too close and it gets hot, with stronger ultraviolet light that can damage cells. Move too far and it freezes. Water coverage matters too: water drives weather and helps food webs grow. In Genesis, change one slider and notice population and plant health.",
          explainMore:
            "Astronomical unit, or A U, is the average Earth–Sun distance. Habitable zone means liquid water can exist on the surface under the right air pressure. It's a zone, not a single magic point.",
        },
        {
          title: "We do — one change (10 min)",
          minutes: 10,
          script:
            "Together: pick either water coverage or star type. Predict, change, observe, explain. Use the science panel numbers.",
          voiceScript:
            "Now we do it together. Choose only one change: either water coverage, or star type. First predict out loud what you think will happen to plants or animals. Then make the change. Watch the numbers and the 3D world. Explain what you see using one science word — for example energy, temperature, or food web.",
          explainMore:
            "A good prediction sounds like: if water increases, coastal plants and aquatic life should do better, because more habitat and moisture support producers.",
        },
        {
          title: "You do + coins (7 min)",
          minutes: 7,
          script:
            "Independent: open Genesis or a Science quiz. Earn coins for the shop — food plots and animals for the shared world.",
          voiceScript:
            "Your turn. Open Genesis Lab or take a short Science quiz. Aim for a solid score so you earn coins. Coins buy food plots and animals for the world. When you finish, write one sentence of advice: should humans live here yet, and why?",
          explainMore:
            "Exit ticket idea: humans need clean air, stable climate, food, and water. If pollution rises or forests fall too fast, fix those systems first.",
        },
      ],
    };
  }

  if (subject === "computerscience" || subject === "game-build") {
    return {
      agenda: ["Intention", "I do", "We do", "You do quiz", "Review"],
      steps: [
        {
          title: "Learning intention (2 min)",
          minutes: 2,
          script: `Year ${year}: you are a builder of Yearwise — coins, shops, and world injects — not only a player.`,
          voiceScript: `Welcome to Computer Science Year ${year}. I'm your curriculum voice teacher. Yearwise is a full school program. Today you learn coding by building educational systems inside it: variables for practice coins, loops for planting food plots, and if statements that stop when coins run out. Passing the systems quiz unlocks higher project-shop tiers for Genesis science.`,
          explainMore:
            "A variable is a named box that holds a value, like coins equals one hundred. A loop repeats steps. An if statement chooses a path based on a condition.",
        },
        {
          title: "I do — plant loop (8 min)",
          minutes: 8,
          script:
            "Model: coins = 100; for each plot if coins ≥ 25, spend and plant, else stop.",
          voiceScript:
            "I do first. Imagine coins start at one hundred. Each food plot costs twenty-five coins. We use a loop: for each new plot, check if coins are at least twenty-five. If yes, subtract twenty-five and plant. If no, break out of the loop. Trace it: after one plant, coins are seventy-five. After two, fifty. After three, twenty-five. After four, zero. So four full plots.",
          explainMore:
            "If you only have sixty coins, you can buy two plots. Sixty divided by twenty-five is two remainder ten. The leftover coins stay in the wallet.",
        },
        {
          title: "We do — trace coins (8 min)",
          minutes: 8,
          script:
            "Class traces: start 80 coins, cost 40 for an animal pack. How many packs? What remains?",
          voiceScript:
            "We do together. Start with eighty coins. An animal pack costs forty. How many packs can you buy? Two. What remains? Zero. Now try seventy coins and cost forty: you can buy one pack, and thirty coins remain. Say the rule: number of purchases is how many times the cost fits into the coins without going negative.",
          explainMore:
            "In code this is often a while loop: while coins are greater than or equal to cost, subtract cost and increase count by one.",
        },
        {
          title: "You do — Game Build quiz (12 min)",
          minutes: 12,
          script:
            "Open Code & systems, complete the level quiz at 60%+ to raise CS project tier. Practice coins still granted for any score.",
          voiceScript:
            "Your turn. Open Build Lab, then Code and systems. Pick a level, read the curriculum lesson, then take the quiz. Score sixty percent or higher to unlock that project tier. You still earn practice coins for trying. When you finish, apply something small in Genesis science — a food plot or herbivore pack.",
          explainMore:
            "Project tiers match Digital Technologies progression: early levels unlock gentle food and herbivores; higher levels unlock predators and tech once systems thinking is solid.",
        },
        {
          title: "Plenary (5 min)",
          minutes: 5,
          script:
            "Name one bug you almost made (off-by-one, wrong cost). Celebrate unlocks.",
          voiceScript:
            "Let's close. Name one mistake that is easy in code: counting one too many, or forgetting to check coins before buying. Great programmers catch those early. You built a curriculum system today. See you in the next level.",
        },
      ],
    };
  }

  if (subject === "blender") {
    return {
      agenda: ["Why 3D", "Watch + pause", "Make a prop", "Link to game"],
      steps: [
        {
          title: "Why 3D? (4 min)",
          minutes: 4,
          script:
            "Genesis worlds need forms. Blender is free industry software. We learn block-outs first, not perfection.",
          voiceScript:
            "Hello. I'm your app teacher for Blender. Why learn 3D? Because game worlds and characters need shapes. Blender is free software used in films and games. Today we care about clear block-outs — simple shapes that read as trees, rocks, or people — not perfect sculptures yet.",
          explainMore:
            "A block-out is a rough shape used early so designers can test scale and placement before fine detail.",
        },
        {
          title: "Watch + pause (12 min)",
          minutes: 12,
          script:
            "Open the Blender track. Play the YouTube lesson. Pause every two minutes and match the step.",
          voiceScript:
            "Open the Blender track in Build Lab. Press play on the curated YouTube lesson. Pause every two minutes. Match the step on your machine: orbit the view, add a mesh, rename it. If you get lost, rewind thirty seconds. Learning 3D animation is curriculum practice — muscle memory plus patience.",
          explainMore:
            "Common shortcuts: middle mouse to orbit, shift middle to pan, scroll to zoom. On a trackpad, use the emulated three-button mouse settings if needed.",
        },
        {
          title: "You do — simple tree (15 min)",
          minutes: 15,
          script:
            "Ground plane plus trunk plus canopy volumes. Screenshot for your portfolio.",
          voiceScript:
            "Your task: make a simple tree. Add a ground plane. Add a cylinder or cube for the trunk and scale it tall and thin. Add a sphere or scaled cube for the canopy. Name objects clearly: Ground, Trunk, Canopy. Take a screenshot. That screenshot is portfolio evidence.",
          explainMore:
            "Scale applies to size. Apply scale in Blender before export so games read the true size. We discuss export more in senior years.",
        },
        {
          title: "Link to game (5 min)",
          minutes: 5,
          script:
            "CS and Genesis use simple shapes until exports exist. Your models will feed the same world idea.",
          voiceScript:
            "In Yearwise, Computer Science and Genesis use simple shapes until student exports are ready. The thinking is the same: form, scale, and purpose. Next time we will talk materials and light. Earn coins by marking Blender practice complete. Well done.",
        },
      ],
    };
  }

  if (subject === "math") {
    return {
      agenda: ["Do now", "I do", "We do", "You do", "Exit"],
      steps: [
        {
          title: "Do now (3 min)",
          minutes: 3,
          script: `Silent starter: count by 3s from −9 to 12. Year ${year} number sense.`,
          voiceScript: `Welcome to maths. I'm your app teacher. Do now: count by threes from negative nine up to twelve. Say the numbers in your head: negative nine, negative six, negative three, zero, three, six, nine, twelve. Patterns on the number line make harder algebra easier later.`,
          explainMore:
            "Equal steps mean a constant difference. That difference is sometimes called the common difference in a sequence.",
        },
        {
          title: "I do — model (7 min)",
          minutes: 7,
          script:
            "Think-aloud: from −4, step +5 four times. Write the sequence and the rule n → −4 + 5n for n = 0,1,2…",
          voiceScript:
            "I do. Start at negative four. Add five each time. First term negative four. Then one, then six, then eleven. A rule can be: term number n starts at zero, value equals negative four plus five times n. Check: when n is two, negative four plus ten equals six. Correct.",
          explainMore:
            "Writing a rule helps you jump to any term without listing all of them. That is the power of algebra.",
        },
        {
          title: "We do (8 min)",
          minutes: 8,
          script:
            "Together: start at 2, step −4, five terms. What is the third term?",
          voiceScript:
            "We do together. Start at two. Step negative four each time. Terms: two, then negative two, then negative six, then negative ten, then negative fourteen. The third term is negative six. Say why: two steps of negative four from the start is negative eight added to two.",
        },
        {
          title: "You do + quiz (8 min)",
          minutes: 8,
          script:
            "Patterns drill or lesson quiz. Practice coins fund applied projects.",
          voiceScript:
            "Your turn. Open the daily patterns drill or your maths lesson quiz. Work carefully. Practice coins from curriculum tests support Genesis science projects. Mistakes are data — fix one, then try again.",
        },
        {
          title: "Exit ticket (4 min)",
          minutes: 4,
          script:
            "One sentence: what is a common difference? One question still open.",
          voiceScript:
            "Exit ticket. In one sentence, what is a common difference? Then name one question you still have. Great work today. See you next class.",
        },
      ],
    };
  }

  if (subject === "science" || subject === "chemistry") {
    const chem = subject === "chemistry";
    return {
      agenda: ["Intention", "Model", "Guided", "Check", "Exit"],
      steps: [
        {
          title: "Learning intention (3 min)",
          minutes: 3,
          script: chem
            ? `Year ${year} Chemistry: matter is made of particles; behaviour depends on arrangement and energy.`
            : `Year ${year} Science: explain living systems with evidence, not vibes.`,
          voiceScript: chem
            ? `Welcome to chemistry. I'm your app teacher. Year ${year}. Matter is made of particles. Solids, liquids, and gases differ by how tightly particles pack and how much energy they have. Today we connect particle ideas to real observations.`
            : `Welcome to science. I'm your app teacher. Year ${year}. We explain living systems with evidence, not guesses. A good scientific sentence names a cause and an effect you can check.`,
          explainMore: chem
            ? "Temperature is related to average particle kinetic energy. Heating usually makes particles move faster and can change state."
            : "Evidence can be a measurement, a controlled change in a sim, or a reliable source. Opinions need evidence too if they claim facts.",
        },
        {
          title: "I do (8 min)",
          minutes: 8,
          script: chem
            ? "Model water: ice lattice → liquid sliding → gas free. Same particles, different energy."
            : "Model a food chain: producers capture energy; consumers transfer it; waste and death feed decomposers.",
          voiceScript: chem
            ? "I do. Picture water particles. In ice they vibrate in a lattice. Heat them and they slide as liquid. Heat more and they escape as gas. Same water particles — different energy and arrangement. That is a state change, not a new substance."
            : "I do. Producers like plants capture light energy and build food. Herbivores eat producers. Predators eat consumers. When organisms die, decomposers recycle nutrients. If you remove producers, the whole web weakens.",
          explainMore: chem
            ? "Melting and boiling are physical changes. Chemical changes make new substances with different properties."
            : "Energy is not created in the chain — it is transferred and much is lost as heat at each step.",
        },
        {
          title: "We do (8 min)",
          minutes: 8,
          script:
            "Predict → change one variable → observe → explain with a science word.",
          voiceScript:
            "We do. Predict first. Change only one variable. Observe carefully. Explain with one precise word — energy, particle, producer, or temperature. If your prediction was wrong, that is still learning: update the model.",
        },
        {
          title: "You do (8 min)",
          minutes: 8,
          script:
            "Lesson quiz or Genesis science panel. Earn coins for the world shop.",
          voiceScript:
            "Your turn. Take a short quiz or explore Genesis science readouts. Earn coins for the shop. High scores can unlock character choices for the world.",
        },
        {
          title: "Exit (3 min)",
          minutes: 3,
          script: "One claim + one piece of evidence.",
          voiceScript:
            "Exit ticket: one claim and one piece of evidence. Example: plants need light, because in low light the sim population of phototrophs fell. Excellent. Class dismissed.",
        },
      ],
    };
  }

  if (subject === "english") {
    return {
      agenda: ["Hook", "Model claim", "Shared write", "Independent", "Exit"],
      steps: [
        {
          title: "Hook (3 min)",
          minutes: 3,
          script: `Year ${year}: strong writing makes a clear claim and backs it with evidence.`,
          voiceScript: `Welcome to English. I'm your app teacher. Year ${year}. Strong writing makes a clear claim and backs it with evidence. A claim is not a title — it is a sentence that takes a position.`,
          explainMore:
            "Weak: pollution is bad. Stronger: industrial pollution reduces air quality, which stresses both human and wildlife health in the sim and in real cities.",
        },
        {
          title: "I do (8 min)",
          minutes: 8,
          script:
            "Model PEEL: Point, Evidence, Explain, Link. Read a short example aloud.",
          voiceScript:
            "I do. Point: state your idea. Evidence: quote or fact. Explain: how the evidence supports the point. Link: connect back to the question. Listen to a mini paragraph: Point — forests matter for habitation. Evidence — timber and oxygen-related systems depend on tree cover. Explain — without producers and canopy, food and climate stability fall. Link — therefore any human plan must protect forest stocks first.",
        },
        {
          title: "We do (8 min)",
          minutes: 8,
          script:
            "Build one PEEL paragraph together on a shared topic (game world or text).",
          voiceScript:
            "We do. Together we build one PEEL paragraph. You may use the Genesis science world as your text: technology, pollution, or forest harvest. Say your point in one sentence. Add one evidence line. Explain it. Link it.",
        },
        {
          title: "You do (8 min)",
          minutes: 8,
          script: "Write 4–6 sentences. Then optional English quiz for coins.",
          voiceScript:
            "Your turn. Write four to six sentences using PEEL. Then, if you like, take an English quiz for coins. Read your paragraph quietly once for flow.",
        },
        {
          title: "Exit (3 min)",
          minutes: 3,
          script: "Underline your claim. Circle one evidence word.",
          voiceScript:
            "Exit: underline your claim. Circle one evidence word or number. Well done. Keep that paragraph for your portfolio.",
        },
      ],
    };
  }

  if (subject === "history") {
    return {
      agenda: ["Intention", "Source types", "Worked source", "Practice", "Exit"],
      steps: [
        {
          title: "Learning intention (3 min)",
          minutes: 3,
          script: `Year ${year}: history uses sources. We do not sugar-coat; we corroborate.`,
          voiceScript: `Welcome to history. I'm your app teacher. Year ${year}. History is built from sources. We do not sugar-coat hard events. We ask: who made this source, when, why, and what else supports it?`,
          explainMore:
            "Primary sources come from the time studied. Secondary sources interpret later. Both can be biased. Corroboration means checking more than one source.",
        },
        {
          title: "I do (8 min)",
          minutes: 8,
          script:
            "Model sourcing questions: origin, purpose, content, value, limitation.",
          voiceScript:
            "I do. For any source ask: origin — who wrote it and when? Purpose — why was it made? Content — what does it claim? Value — what can it reliably show? Limitation — what can it not show? A victory speech is useful for perspective, but weak as a full body count.",
        },
        {
          title: "We do (8 min)",
          minutes: 8,
          script:
            "Compare two short claims. Which is better supported? Why?",
          voiceScript:
            "We do. Imagine two claims about the same event. One cites a diary from the day. One cites a movie trailer. Which is stronger for factual detail? The diary is primary, but still one viewpoint. We still seek a second source.",
        },
        {
          title: "You do (8 min)",
          minutes: 8,
          script: "History lesson quiz or short source note. Coins to shop.",
          voiceScript:
            "Your turn. Complete a history lesson or quiz. Write two lines: one fact and one uncertainty. Earn practice coins for applied projects.",
        },
        {
          title: "Exit (3 min)",
          minutes: 3,
          script: "Define primary source in your own words.",
          voiceScript:
            "Exit ticket: define primary source in your own words. Class complete. Thank you for careful thinking.",
        },
      ],
    };
  }

  // music, language, default generic
  return {
    agenda: [
      "Learning intention",
      "Teacher model",
      "Guided practice",
      "Independent check",
      "Exit ticket",
    ],
    steps: [
      {
        title: "Do now (3 min)",
        minutes: 3,
        script: `Starter for Year ${year} ${subjectLabel(subject)}. Settle, focus, one quick question on the board.`,
        voiceScript: `Welcome. I'm your app teacher. This is Year ${year} ${subjectLabel(subject)}. Do now: take a breath, open your notes, and answer the starter question on the board in one sentence. We learn in clear steps: I do, we do, you do.`,
        explainMore:
          "Classroom structure helps your brain. Short chunks, active practice, and a check at the end improve memory.",
      },
      {
        title: "I do (7 min)",
        minutes: 7,
        script:
          "Teacher-style model: one worked example out loud. Students watch first.",
        voiceScript:
          "I do. I will model one example out loud, step by step. You only watch and listen first. Notice the order of thinking, not only the final answer. When I pause, predict the next step silently.",
        explainMore:
          "Think-aloud teaching makes hidden strategies visible. You can copy the strategy on a new problem later.",
      },
      {
        title: "We do (8 min)",
        minutes: 8,
        script:
          "Solve a similar problem together. Explain reasoning, not only answers.",
        voiceScript:
          "We do. We solve a similar problem together. I will ask for reasons, not only answers. If you disagree, say why with evidence. Mistakes are welcome when they teach us.",
      },
      {
        title: "You do + quiz (8 min)",
        minutes: 8,
        script:
          "Independent practice, then a quiz. Practice coins support Genesis science projects.",
        voiceScript:
          "Your turn. Practise independently, then take a quiz in this subject. Practice coins from curriculum tests support food, animals, and characters in Genesis Lab. Aim for understanding, not rushing.",
      },
      {
        title: "Exit ticket (4 min)",
        minutes: 4,
        script:
          "One sentence learned + one open question. Class ends when the timer ends.",
        voiceScript:
          "Exit ticket. Write one sentence about what you learned, and one question you still have. You did real work today. See you in the next app class.",
      },
    ],
  };
}

/** Seed a few open app classes starting from now (for the hub list) */
export function ensureDemoClassesFromNow(): LiveClassSession[] {
  const existing = listLiveClasses().filter((c) => c.status !== "ended");
  if (existing.length >= 2) return existing;

  const demos = [
    startAppClass({
      subject: "science",
      yearLevel: 7,
      title: "Y7 Science · Living world (app class)",
      durationMin: 30,
    }),
    startAppClass({
      subject: "game-build",
      yearLevel: 8,
      title: "Y8 CS · Code educational systems Level 1",
      durationMin: 35,
    }),
    startAppClass({
      subject: "blender",
      yearLevel: 9,
      title: "Y9 Blender · Trees for our world (app class)",
      durationMin: 40,
    }),
  ];
  // Stagger second/third slightly so hub shows variety
  const all = loadAll();
  const now = Date.now();
  for (let i = 0; i < all.length; i++) {
    const d = demos.find((x) => x.code === all[i]!.code);
    if (!d) continue;
    if (i === 1) {
      all[i] = {
        ...all[i]!,
        startsAt: new Date(now + 2 * 60_000).toISOString(),
        status: "scheduled",
      };
    }
    if (i === 2) {
      all[i] = {
        ...all[i]!,
        startsAt: new Date(now + 20 * 60_000).toISOString(),
        status: "scheduled",
      };
    }
  }
  saveAll(all);
  return demos;
}

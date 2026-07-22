/**
 * Yearwise practice economy (curriculum rewards)
 * ──────────────────────────────────────────────
 * All-subject curriculum tests → practice coins + unlock choices.
 * Coins fund applied Genesis science projects (flora, fauna, characters).
 * CS coding modules (Digital Technologies) unlock project-shop tiers.
 */

export type ShopItemId =
  | "food-plot"
  | "food-orchard"
  | "food-kelp-farm"
  | "animal-herbivore"
  | "animal-bird"
  | "animal-predator"
  | "animal-aquatic"
  | "char-explorer"
  | "char-farmer"
  | "char-scientist"
  | "char-builder"
  | "char-guardian"
  | "forest-pack"
  | "water-spring"
  | "tech-tools"
  | "blueprint-slot";

export type ShopCategory = "food" | "animals" | "characters" | "world" | "tech";

export type ShopItem = {
  id: ShopItemId;
  name: string;
  description: string;
  cost: number;
  category: ShopCategory;
  icon: string;
  /** CS game-build level required (1–6) */
  minCsLevel: number;
  /** Maps into Genesis creator / inject */
  genesisEffect:
    | { kind: "flora"; floraKind: "moss" | "shrub" | "tree" | "kelp"; count: number }
    | { kind: "fauna"; template: string; count: number; forceRole?: string }
    | { kind: "human-char"; name: string; count: number }
    | { kind: "resource"; timber?: number; food?: number }
    | { kind: "unlock"; unlockId: string };
};

export const SHOP_ITEMS: ShopItem[] = [
  {
    id: "food-plot",
    name: "Grow food plots",
    description: "Add crop-like plant clusters — more food pads for fauna.",
    cost: 25,
    category: "food",
    icon: "🌾",
    minCsLevel: 1,
    genesisEffect: { kind: "flora", floraKind: "shrub", count: 4 },
  },
  {
    id: "food-orchard",
    name: "Plant an orchard",
    description: "Tall food trees — big timber + shelter.",
    cost: 45,
    category: "food",
    icon: "🍎",
    minCsLevel: 2,
    genesisEffect: { kind: "flora", floraKind: "tree", count: 6 },
  },
  {
    id: "food-kelp-farm",
    name: "Kelp farm",
    description: "Underwater food for aquatic life.",
    cost: 40,
    category: "food",
    icon: "🌊",
    minCsLevel: 2,
    genesisEffect: { kind: "flora", floraKind: "kelp", count: 5 },
  },
  {
    id: "animal-herbivore",
    name: "Herbivore pack",
    description: "Gentle grazers — more diversity in the food web.",
    cost: 35,
    category: "animals",
    icon: "🦌",
    minCsLevel: 1,
    genesisEffect: { kind: "fauna", template: "herbivore", count: 3, forceRole: "herbivore" },
  },
  {
    id: "animal-bird",
    name: "Flyer morphs",
    description: "Fast aerial-style fauna.",
    cost: 40,
    category: "animals",
    icon: "🦅",
    minCsLevel: 2,
    genesisEffect: { kind: "fauna", template: "flyer-ish", count: 2 },
  },
  {
    id: "animal-predator",
    name: "Predator pair",
    description: "Hunters — use carefully so prey can survive.",
    cost: 55,
    category: "animals",
    icon: "🐺",
    minCsLevel: 3,
    genesisEffect: { kind: "fauna", template: "predator", count: 2, forceRole: "predator" },
  },
  {
    id: "animal-aquatic",
    name: "Shore life",
    description: "Water-edge creatures.",
    cost: 40,
    category: "animals",
    icon: "🐠",
    minCsLevel: 2,
    genesisEffect: { kind: "fauna", template: "aquatic", count: 3 },
  },
  {
    id: "char-explorer",
    name: "Explorer character",
    description: "Unlock a student-designed explorer for the world.",
    cost: 60,
    category: "characters",
    icon: "🧭",
    minCsLevel: 2,
    genesisEffect: { kind: "human-char", name: "Explorer", count: 1 },
  },
  {
    id: "char-farmer",
    name: "Farmer character",
    description: "Grows food and tends plots.",
    cost: 60,
    category: "characters",
    icon: "👩‍🌾",
    minCsLevel: 2,
    genesisEffect: { kind: "human-char", name: "Farmer", count: 1 },
  },
  {
    id: "char-scientist",
    name: "Scientist character",
    description: "Runs tests and teaches others.",
    cost: 70,
    category: "characters",
    icon: "🔬",
    minCsLevel: 3,
    genesisEffect: { kind: "human-char", name: "Scientist", count: 1 },
  },
  {
    id: "char-builder",
    name: "Builder character",
    description: "Turns forest timber into infrastructure.",
    cost: 70,
    category: "characters",
    icon: "🔨",
    minCsLevel: 3,
    genesisEffect: { kind: "human-char", name: "Builder", count: 1 },
  },
  {
    id: "char-guardian",
    name: "Guardian character",
    description: "Protects people and wildlife balance.",
    cost: 80,
    category: "characters",
    icon: "🛡️",
    minCsLevel: 4,
    genesisEffect: { kind: "human-char", name: "Guardian", count: 1 },
  },
  {
    id: "forest-pack",
    name: "Forest pack",
    description: "Drop a dense grove of trees.",
    cost: 50,
    category: "world",
    icon: "🌲",
    minCsLevel: 1,
    genesisEffect: { kind: "flora", floraKind: "tree", count: 10 },
  },
  {
    id: "water-spring",
    name: "Water spring boost",
    description: "More water-edge life potential (kelp + moss).",
    cost: 45,
    category: "world",
    icon: "💧",
    minCsLevel: 2,
    genesisEffect: { kind: "flora", floraKind: "kelp", count: 4 },
  },
  {
    id: "tech-tools",
    name: "Tools tech unlock",
    description: "Marks tools tier available in civilization path.",
    cost: 90,
    category: "tech",
    icon: "⚒️",
    minCsLevel: 4,
    genesisEffect: { kind: "unlock", unlockId: "tech-tools" },
  },
  {
    id: "blueprint-slot",
    name: "Extra blueprint slot",
    description: "CS builders unlock another custom design save.",
    cost: 100,
    category: "tech",
    icon: "📐",
    minCsLevel: 5,
    genesisEffect: { kind: "unlock", unlockId: "blueprint-slot" },
  },
];

export type GameEconomyState = {
  coins: number;
  /** CS game-build level 1–6 (from completing CS build lessons) */
  csBuildLevel: number;
  unlockedCharacters: string[];
  purchased: { itemId: ShopItemId; at: string }[];
  /** Pending injects for Genesis (applied when lab opens) */
  pendingInjects: {
    id: string;
    itemId: ShopItemId;
    at: string;
  }[];
  quizRewardsClaimed: string[]; // lessonKey or test id
  totalCoinsEarned: number;
  totalCoinsSpent: number;
};

const KEY = "yearwise-game-economy-v1";

export function defaultEconomy(): GameEconomyState {
  return {
    coins: 20, // starter coins
    csBuildLevel: 1,
    unlockedCharacters: [],
    purchased: [],
    pendingInjects: [],
    quizRewardsClaimed: [],
    totalCoinsEarned: 20,
    totalCoinsSpent: 0,
  };
}

export function loadEconomy(): GameEconomyState {
  if (typeof window === "undefined") return defaultEconomy();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultEconomy();
    return { ...defaultEconomy(), ...JSON.parse(raw) };
  } catch {
    return defaultEconomy();
  }
}

export function saveEconomy(state: GameEconomyState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(state));
}

/** Coins from any subject quiz % */
export function coinsFromQuizPercent(percent: number): number {
  if (percent >= 90) return 40;
  if (percent >= 70) return 25;
  if (percent >= 50) return 15;
  if (percent >= 30) return 8;
  return 5;
}

/** Weekly test → more coins */
export function coinsFromWeeklyTest(percent: number): number {
  return Math.max(15, Math.round(percent / 2) + 10);
}

/**
 * Grant coins once per claimKey (lesson quiz, weekly test, etc.)
 * High scores also unlock a random character choice option.
 */
export function grantTestCoins(opts: {
  claimKey: string;
  percent: number;
  source: "lesson-quiz" | "weekly-test" | "cs-build" | "guided";
  subject?: string;
}): {
  coinsGained: number;
  characterUnlock?: string;
  message: string;
  economy: GameEconomyState;
} {
  const state = loadEconomy();
  if (state.quizRewardsClaimed.includes(opts.claimKey)) {
    return {
      coinsGained: 0,
      message: "Coins already claimed for this test.",
      economy: state,
    };
  }

  const base =
    opts.source === "weekly-test"
      ? coinsFromWeeklyTest(opts.percent)
      : opts.source === "cs-build"
        ? coinsFromQuizPercent(opts.percent) + 15
        : coinsFromQuizPercent(opts.percent);

  const bonus =
    opts.subject === "computerscience" ? 10 : opts.subject === "science" ? 5 : 0;
  const coinsGained = base + bonus;

  state.coins += coinsGained;
  state.totalCoinsEarned += coinsGained;
  state.quizRewardsClaimed.push(opts.claimKey);

  let characterUnlock: string | undefined;
  // High score → unlock character choice for shop
  if (opts.percent >= 75) {
    const chars = ["Explorer", "Farmer", "Scientist", "Builder", "Guardian"];
    const pick = chars[Math.floor(Math.random() * chars.length)]!;
    if (!state.unlockedCharacters.includes(pick)) {
      state.unlockedCharacters.push(pick);
      characterUnlock = pick;
    }
  }

  saveEconomy(state);

  return {
    coinsGained,
    characterUnlock,
    message: characterUnlock
      ? `+${coinsGained} coins · Character unlock: ${characterUnlock}!`
      : `+${coinsGained} coins earned`,
    economy: state,
  };
}

export function setCsBuildLevel(level: number) {
  const state = loadEconomy();
  state.csBuildLevel = Math.max(state.csBuildLevel, Math.min(6, level));
  saveEconomy(state);
  return state;
}

export function purchaseItem(itemId: ShopItemId): {
  ok: boolean;
  message: string;
  economy: GameEconomyState;
} {
  const state = loadEconomy();
  const item = SHOP_ITEMS.find((i) => i.id === itemId);
  if (!item) return { ok: false, message: "Unknown item", economy: state };
  if (state.csBuildLevel < item.minCsLevel) {
    return {
      ok: false,
      message: `Need CS Game-Build level ${item.minCsLevel}. Complete more coding modules.`,
      economy: state,
    };
  }
  if (state.coins < item.cost) {
    return {
      ok: false,
      message: `Need ${item.cost} coins (you have ${state.coins}).`,
      economy: state,
    };
  }

  state.coins -= item.cost;
  state.totalCoinsSpent += item.cost;
  state.purchased.push({ itemId, at: new Date().toISOString() });
  state.pendingInjects.push({
    id: `inj-${Date.now()}-${itemId}`,
    itemId,
    at: new Date().toISOString(),
  });

  if (item.category === "characters") {
    const name = item.name.replace(" character", "");
    if (!state.unlockedCharacters.includes(name)) {
      state.unlockedCharacters.push(name);
    }
  }

  saveEconomy(state);
  return {
    ok: true,
    message: `Bought ${item.name} for ${item.cost} practice coins — ready for Genesis science lab.`,
    economy: state,
  };
}

export function consumePendingInjects(): {
  items: ShopItem[];
  economy: GameEconomyState;
} {
  const state = loadEconomy();
  const items = state.pendingInjects
    .map((p) => SHOP_ITEMS.find((i) => i.id === p.itemId))
    .filter(Boolean) as ShopItem[];
  state.pendingInjects = [];
  saveEconomy(state);
  return { items, economy: state };
}

export function shopItemsForLevel(csLevel: number): ShopItem[] {
  return SHOP_ITEMS.filter((i) => i.minCsLevel <= csLevel);
}

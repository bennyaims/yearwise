/**
 * Daily study windows with 30-minute blocks (device local time).
 *
 * Windows:
 *  10:00–12:00  (four 30-min blocks)
 *  14:00–15:00  (two blocks)
 *  16:00–17:00  (two blocks)
 *  19:00–20:00  (two blocks)
 */

export type StudyWindowId = "morning" | "afternoon" | "late-arvo" | "evening";

export type StudyWindow = {
  id: StudyWindowId;
  label: string;
  startHour: number;
  endHour: number;
};

export type TimeBlock = {
  id: string;
  windowId: StudyWindowId;
  /** Minutes from midnight */
  startMinutes: number;
  endMinutes: number;
  label: string;
  shortLabel: string;
};

export const STUDY_WINDOWS: StudyWindow[] = [
  { id: "morning", label: "Morning focus", startHour: 10, endHour: 12 },
  { id: "afternoon", label: "Afternoon", startHour: 14, endHour: 15 },
  { id: "late-arvo", label: "Late afternoon", startHour: 16, endHour: 17 },
  { id: "evening", label: "Evening", startHour: 19, endHour: 20 },
];

export const BLOCK_MINUTES = 30;

function formatHM(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  const ampm = h >= 12 ? "pm" : "am";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${h12}${ampm}` : `${h12}:${String(m).padStart(2, "0")}${ampm}`;
}

/** All 30-minute slots for the day */
export function allTimeBlocks(): TimeBlock[] {
  const blocks: TimeBlock[] = [];
  for (const w of STUDY_WINDOWS) {
    for (let h = w.startHour; h < w.endHour; h++) {
      for (const half of [0, 30]) {
        const start = h * 60 + half;
        const end = start + BLOCK_MINUTES;
        if (end > w.endHour * 60) continue;
        blocks.push({
          id: `${w.id}-${start}`,
          windowId: w.id,
          startMinutes: start,
          endMinutes: end,
          label: `${formatHM(start)} – ${formatHM(end)}`,
          shortLabel: formatHM(start),
        });
      }
    }
  }
  return blocks;
}

export function nowMinutes(date = new Date()): number {
  return date.getHours() * 60 + date.getMinutes();
}

export function getActiveBlock(date = new Date()): TimeBlock | null {
  const m = nowMinutes(date);
  return allTimeBlocks().find((b) => m >= b.startMinutes && m < b.endMinutes) ?? null;
}

export function getNextBlock(date = new Date()): TimeBlock | null {
  const m = nowMinutes(date);
  const blocks = allTimeBlocks();
  return blocks.find((b) => b.startMinutes > m) ?? blocks[0] ?? null;
}

export function isInAnyWindow(date = new Date()): boolean {
  const m = nowMinutes(date);
  return STUDY_WINDOWS.some(
    (w) => m >= w.startHour * 60 && m < w.endHour * 60,
  );
}

export function minutesUntilNextWindow(date = new Date()): number | null {
  const m = nowMinutes(date);
  for (const w of STUDY_WINDOWS) {
    const start = w.startHour * 60;
    if (start > m) return start - m;
  }
  // Next day first window
  const first = STUDY_WINDOWS[0]!.startHour * 60;
  return 24 * 60 - m + first;
}

export type SessionLog = {
  dateKey: string; // YYYY-MM-DD
  blockId: string;
  lessonKey: string;
  completedAt: string;
  minutes: number;
};

const SESSION_KEY = "yearwise-sessions-v1";

export function dateKey(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function loadSessions(): SessionLog[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as SessionLog[]) : [];
  } catch {
    return [];
  }
}

export function saveSession(log: SessionLog): void {
  if (typeof window === "undefined") return;
  const all = loadSessions();
  all.push(log);
  localStorage.setItem(SESSION_KEY, JSON.stringify(all.slice(-200)));
}

export function sessionsToday(d = new Date()): SessionLog[] {
  const key = dateKey(d);
  return loadSessions().filter((s) => s.dateKey === key);
}

export function blockCompletedToday(blockId: string, d = new Date()): boolean {
  return sessionsToday(d).some((s) => s.blockId === blockId);
}

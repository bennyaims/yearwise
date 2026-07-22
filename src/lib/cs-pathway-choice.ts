/**
 * Per-year Computer Science pathway choice (device-local).
 */

import type { CsPathwayId } from "@/content/cs-pathways";
import type { YearLevel } from "@/lib/types";

const KEY = "yearwise-cs-pathways-v1";

export type CsPathwayChoices = Partial<Record<YearLevel, CsPathwayId>>;

export function loadCsPathwayChoices(): CsPathwayChoices {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as CsPathwayChoices) : {};
  } catch {
    return {};
  }
}

export function saveCsPathwayChoices(map: CsPathwayChoices) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(map));
  try {
    window.dispatchEvent(new CustomEvent("yearwise-cs-pathway-update"));
  } catch {
    /* ignore */
  }
}

export function getCsPathwayForYear(year: YearLevel): CsPathwayId | null {
  return loadCsPathwayChoices()[year] ?? null;
}

export function setCsPathwayForYear(year: YearLevel, pathway: CsPathwayId) {
  const map = loadCsPathwayChoices();
  map[year] = pathway;
  saveCsPathwayChoices(map);
  return map;
}

export function clearCsPathwayForYear(year: YearLevel) {
  const map = loadCsPathwayChoices();
  delete map[year];
  saveCsPathwayChoices(map);
}

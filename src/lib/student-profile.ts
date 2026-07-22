/**
 * Local signup / student profile (device storage).
 * Full cloud accounts can replace this later.
 */

import type { YearLevel } from "./types";

const KEY = "yearwise-student-profile-v1";

export type StudentProfile = {
  name: string;
  yearLevel: YearLevel;
  /** ISO completed signup */
  signedUpAt: string;
  /** Software tool ids student marked as downloaded / available */
  softwareReady: string[];
  /** Skipped remaining downloads for later */
  deferredSoftware: boolean;
  email?: string;
};

export function loadProfile(): StudentProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StudentProfile;
  } catch {
    return null;
  }
}

export function saveProfile(profile: StudentProfile) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(profile));
  try {
    window.dispatchEvent(new CustomEvent("yearwise-profile-update"));
  } catch {
    /* ignore */
  }
}

export function isSignedUp(): boolean {
  const p = loadProfile();
  return Boolean(p?.name && p.signedUpAt);
}

export function clearProfile() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}

export function markSoftwareReady(toolId: string, ready: boolean) {
  const p = loadProfile();
  if (!p) return null;
  const set = new Set(p.softwareReady);
  if (ready) set.add(toolId);
  else set.delete(toolId);
  const next = { ...p, softwareReady: [...set] };
  saveProfile(next);
  return next;
}

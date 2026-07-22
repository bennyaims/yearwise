"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LANGUAGES } from "@/lib/subjects";
import { loadPreferredLanguage, savePreferredLanguage } from "@/lib/progress";
import type { LanguageId } from "@/lib/types";

type Props = {
  year: number;
  selected?: LanguageId;
};

export function LanguagePicker({ year, selected }: Props) {
  const router = useRouter();
  const [current, setCurrent] = useState<string | null>(selected ?? null);

  useEffect(() => {
    if (!selected) {
      const saved = loadPreferredLanguage();
      if (saved) setCurrent(saved);
    }
  }, [selected]);

  function choose(id: LanguageId) {
    savePreferredLanguage(id);
    setCurrent(id);
    router.push(`/year/${year}/language/${id}`);
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {LANGUAGES.map((lang) => {
        const active = current === lang.id;
        return (
          <button
            key={lang.id}
            type="button"
            onClick={() => choose(lang.id)}
            className={`glass glass-interactive rounded-[var(--radius-lg)] p-4 text-left ${
              active
                ? "ring-2 ring-[color-mix(in_srgb,var(--amber)_50%,transparent)]"
                : ""
            }`}
            style={
              active
                ? {
                    background:
                      "color-mix(in srgb, var(--amber) 12%, var(--glass-strong))",
                  }
                : undefined
            }
          >
            <div className="flex items-center gap-3">
              <span className="icon-disc h-11 w-11 text-2xl">{lang.flag}</span>
              <div className="min-w-0">
                <div className="font-semibold text-ink">{lang.name}</div>
                <div className="text-sm text-muted">{lang.nativeName}</div>
              </div>
            </div>
            <p className="mt-2 text-sm text-muted">{lang.description}</p>
          </button>
        );
      })}
    </div>
  );
}

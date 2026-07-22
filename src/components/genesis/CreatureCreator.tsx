"use client";

import { useMemo, useState } from "react";
import {
  defaultFaunaBlueprint,
  defaultFloraBlueprint,
  FAUNA_TEMPLATES,
  FLORA_KINDS,
  buildFaunaDna,
  type FaunaBlueprint,
  type FloraBlueprint,
  type FaunaTemplateId,
  type FloraKind,
} from "@/lib/genesis/creator";
import { expressGene, STARTER_STRAINS } from "@/lib/genesis/dna";
import type { Sex } from "@/lib/genesis/society";

type Props = {
  onAddFauna: (bp: FaunaBlueprint) => void;
  onAddFlora: (bp: FloraBlueprint) => void;
};

export function CreatureCreator({ onAddFauna, onAddFlora }: Props) {
  const [tab, setTab] = useState<"fauna" | "flora">("fauna");
  const [fauna, setFauna] = useState<FaunaBlueprint>(defaultFaunaBlueprint);
  const [flora, setFlora] = useState<FloraBlueprint>(defaultFloraBlueprint);
  const [flash, setFlash] = useState<string | null>(null);

  const preview = useMemo(() => {
    try {
      const dna = buildFaunaDna(fauna, () => 0.37);
      const expr = expressGene(dna);
      return { dna, expr, error: null as string | null };
    } catch {
      return { dna: "", expr: null, error: "Invalid design" };
    }
  }, [fauna]);

  function ping(msg: string) {
    setFlash(msg);
    window.setTimeout(() => setFlash(null), 2200);
  }

  return (
    <div className="glass rounded-[var(--radius-lg)] p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="heading-section text-base">Fauna &amp; flora creator</h2>
        <div className="flex gap-1 rounded-lg bg-[var(--glass-soft)] p-0.5">
          <button
            type="button"
            className={`rounded-md px-3 py-1 text-xs font-semibold ${
              tab === "fauna"
                ? "bg-[var(--sky-soft)] text-ink"
                : "text-muted hover:text-ink"
            }`}
            onClick={() => setTab("fauna")}
          >
            Fauna
          </button>
          <button
            type="button"
            className={`rounded-md px-3 py-1 text-xs font-semibold ${
              tab === "flora"
                ? "bg-[var(--sky-soft)] text-ink"
                : "text-muted hover:text-ink"
            }`}
            onClick={() => setTab("flora")}
          >
            Flora
          </button>
        </div>
      </div>
      <p className="mt-1 text-xs text-muted">
        Design life and <strong className="text-ink">add it live</strong> into
        the 3D world — DNA is built from real amino-acid themes.
      </p>

      {flash && (
        <p className="mt-2 rounded-lg bg-[var(--sky-soft)] px-3 py-1.5 text-xs font-medium text-ink">
          {flash}
        </p>
      )}

      {tab === "fauna" ? (
        <div className="mt-3 space-y-3">
          <label className="block text-xs text-soft">
            Name
            <input
              className="mt-1 w-full rounded-lg border border-[var(--glass-border)] bg-[var(--glass)] px-2 py-1.5 text-sm text-ink"
              value={fauna.name}
              onChange={(e) => setFauna((f) => ({ ...f, name: e.target.value }))}
              maxLength={24}
            />
          </label>

          <label className="block text-xs text-soft">
            Template
            <select
              className="mt-1 w-full rounded-lg border border-[var(--glass-border)] bg-[var(--glass)] px-2 py-2 text-sm text-ink"
              value={fauna.template}
              onChange={(e) => {
                const id = e.target.value as FaunaTemplateId;
                const tpl = FAUNA_TEMPLATES.find((t) => t.id === id);
                setFauna((f) => ({
                  ...f,
                  template: id,
                  forceRole: tpl?.forceRole,
                  culture: id === "human" ? 0.45 : f.culture,
                  name:
                    f.name === "Custom fauna" || f.name.startsWith("My ")
                      ? `My ${tpl?.label ?? id}`
                      : f.name,
                }));
              }}
            >
              {FAUNA_TEMPLATES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
          <p className="text-[11px] text-muted">
            {FAUNA_TEMPLATES.find((t) => t.id === fauna.template)?.blurb}
          </p>

          {fauna.template === "from-strain" && (
            <label className="block text-xs text-soft">
              Starter strain DNA
              <select
                className="mt-1 w-full rounded-lg border border-[var(--glass-border)] bg-[var(--glass)] px-2 py-2 text-sm text-ink"
                value={fauna.strainId ?? STARTER_STRAINS[0]!.id}
                onChange={(e) =>
                  setFauna((f) => ({ ...f, strainId: e.target.value }))
                }
              >
                {STARTER_STRAINS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>
          )}

          {fauna.template === "custom" && (
            <label className="block text-xs text-soft">
              Amino-acid sequence (single letters)
              <input
                className="mt-1 w-full rounded-lg border border-[var(--glass-border)] bg-[var(--glass)] px-2 py-1.5 font-mono text-sm text-ink"
                value={fauna.customAa ?? "ALKEVAD"}
                onChange={(e) =>
                  setFauna((f) => ({
                    ...f,
                    customAa: e.target.value.toUpperCase().replace(/[^A-Z]/g, ""),
                  }))
                }
                placeholder="e.g. MALKEVADFWY"
              />
              <span className="mt-0.5 block text-[10px] text-soft">
                A R N D C Q E G H I L K M F P S T W Y V — builds real DNA codons
              </span>
            </label>
          )}

          <div className="grid grid-cols-2 gap-2">
            <label className="block text-xs text-soft">
              Sex
              <select
                className="mt-1 w-full rounded-lg border border-[var(--glass-border)] bg-[var(--glass)] px-2 py-1.5 text-sm text-ink"
                value={fauna.sex}
                onChange={(e) =>
                  setFauna((f) => ({
                    ...f,
                    sex: e.target.value as Sex | "random",
                  }))
                }
              >
                <option value="random">Random</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="hermaphrodite">Hermaphrodite</option>
              </select>
            </label>
            <label className="block text-xs text-soft">
              Count ({fauna.count})
              <input
                type="range"
                min={1}
                max={8}
                step={1}
                value={fauna.count}
                onChange={(e) =>
                  setFauna((f) => ({ ...f, count: Number(e.target.value) }))
                }
                className="mt-2 w-full"
              />
            </label>
            <label className="block text-xs text-soft">
              Energy ({fauna.energyBoost.toFixed(1)})
              <input
                type="range"
                min={0}
                max={2.5}
                step={0.1}
                value={fauna.energyBoost}
                onChange={(e) =>
                  setFauna((f) => ({
                    ...f,
                    energyBoost: Number(e.target.value),
                  }))
                }
                className="mt-2 w-full"
              />
            </label>
            <label className="block text-xs text-soft">
              Scatter ({(fauna.scatter * 100).toFixed(0)}%)
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={fauna.scatter}
                onChange={(e) =>
                  setFauna((f) => ({ ...f, scatter: Number(e.target.value) }))
                }
                className="mt-2 w-full"
              />
            </label>
          </div>

          {(fauna.template === "human" || fauna.template === "sapient") && (
            <label className="block text-xs text-soft">
              Culture ({(fauna.culture * 100).toFixed(0)}%)
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={fauna.culture}
                onChange={(e) =>
                  setFauna((f) => ({ ...f, culture: Number(e.target.value) }))
                }
                className="mt-2 w-full"
              />
            </label>
          )}

          {/* Live preview */}
          {preview.expr && (
            <div className="rounded-lg bg-[var(--glass-soft)] p-3 text-xs">
              <p className="font-semibold text-ink">Structure preview</p>
              <p className="mt-1 break-all font-mono text-[10px] text-soft">
                DNA: {preview.dna.slice(0, 54)}
                {preview.dna.length > 54 ? "…" : ""}
              </p>
              <p className="mt-1 break-all font-mono text-[10px] text-ink">
                AA: {preview.expr.aminoAcidSequence || "—"}
              </p>
              <p className="mt-1 text-muted">
                Fold: {preview.expr.secondarySummary}
              </p>
              {preview.expr.structures.length > 0 && (
                <ul className="mt-1.5 max-h-24 space-y-0.5 overflow-y-auto text-[11px] text-muted">
                  {preview.expr.structures.slice(0, 5).map((s) => (
                    <li key={s.id}>
                      <span className="text-ink">{s.name}</span> · C
                      {s.complexity} · {(s.score * 100).toFixed(0)}%
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-1.5 text-[11px] text-muted">
                Traits: speed {preview.expr.traits.speed.toFixed(2)} · light{" "}
                {preview.expr.traits.lightUse.toFixed(2)} · mind{" "}
                {preview.expr.traits.intelligence.toFixed(2)} · pred{" "}
                {preview.expr.traits.predation.toFixed(2)}
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                onAddFauna(fauna);
                ping(`Added ${fauna.count}× fauna “${fauna.name}” to the world`);
              }}
            >
              Add fauna to world
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setFauna(defaultFaunaBlueprint())}
            >
              Reset
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-3 space-y-3">
          <label className="block text-xs text-soft">
            Name
            <input
              className="mt-1 w-full rounded-lg border border-[var(--glass-border)] bg-[var(--glass)] px-2 py-1.5 text-sm text-ink"
              value={flora.name}
              onChange={(e) => setFlora((f) => ({ ...f, name: e.target.value }))}
              maxLength={24}
            />
          </label>

          <label className="block text-xs text-soft">
            Plant type
            <select
              className="mt-1 w-full rounded-lg border border-[var(--glass-border)] bg-[var(--glass)] px-2 py-2 text-sm text-ink"
              value={flora.kind}
              onChange={(e) => {
                const kind = e.target.value as FloraKind;
                setFlora((f) => ({
                  ...f,
                  kind,
                  nearWater: kind === "kelp" ? true : f.nearWater,
                  name:
                    f.name === "Custom flora" || f.name.startsWith("My ")
                      ? `My ${FLORA_KINDS.find((k) => k.id === kind)?.label ?? kind}`
                      : f.name,
                }));
              }}
            >
              {FLORA_KINDS.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.label}
                </option>
              ))}
            </select>
          </label>
          <p className="text-[11px] text-muted">
            {FLORA_KINDS.find((k) => k.id === flora.kind)?.blurb}
          </p>

          <div className="grid grid-cols-2 gap-2">
            <label className="block text-xs text-soft">
              Count ({flora.count})
              <input
                type="range"
                min={1}
                max={16}
                step={1}
                value={flora.count}
                onChange={(e) =>
                  setFlora((f) => ({ ...f, count: Number(e.target.value) }))
                }
                className="mt-2 w-full"
              />
            </label>
            <label className="block text-xs text-soft">
              Size ×{flora.height.toFixed(1)}
              <input
                type="range"
                min={0.4}
                max={1.8}
                step={0.1}
                value={flora.height}
                onChange={(e) =>
                  setFlora((f) => ({ ...f, height: Number(e.target.value) }))
                }
                className="mt-2 w-full"
              />
            </label>
            <label className="block text-xs text-soft">
              Health ({(flora.health * 100).toFixed(0)}%)
              <input
                type="range"
                min={0.2}
                max={1}
                step={0.05}
                value={flora.health}
                onChange={(e) =>
                  setFlora((f) => ({ ...f, health: Number(e.target.value) }))
                }
                className="mt-2 w-full"
              />
            </label>
            <label className="block text-xs text-soft">
              Scatter ({(flora.scatter * 100).toFixed(0)}%)
              <input
                type="range"
                min={0.1}
                max={1}
                step={0.05}
                value={flora.scatter}
                onChange={(e) =>
                  setFlora((f) => ({ ...f, scatter: Number(e.target.value) }))
                }
                className="mt-2 w-full"
              />
            </label>
          </div>

          <label className="block text-xs text-soft">
            Sex
            <select
              className="mt-1 w-full rounded-lg border border-[var(--glass-border)] bg-[var(--glass)] px-2 py-1.5 text-sm text-ink"
              value={flora.sex}
              onChange={(e) =>
                setFlora((f) => ({
                  ...f,
                  sex: e.target.value as Sex | "random",
                }))
              }
            >
              <option value="random">Random</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="hermaphrodite">Hermaphrodite</option>
            </select>
          </label>

          <label className="flex items-center gap-2 text-xs text-muted">
            <input
              type="checkbox"
              checked={flora.nearWater}
              onChange={(e) =>
                setFlora((f) => ({ ...f, nearWater: e.target.checked }))
              }
            />
            Place near water (or kelp zone)
          </label>

          <div className="rounded-lg bg-[var(--glass-soft)] p-3 text-xs text-muted">
            <p className="font-semibold text-ink">Flora preview</p>
            <p className="mt-1">
              {flora.count}× {flora.kind} · height ×{flora.height.toFixed(1)} ·
              health {(flora.health * 100).toFixed(0)}% ·{" "}
              {flora.nearWater ? "shore" : "land scatter"}
            </p>
            <p className="mt-1 text-[11px]">
              Plants will grow, bud vegetatively, and seed sexually in spring /
              summer.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="btn btn-sky"
              onClick={() => {
                onAddFlora(flora);
                ping(`Added ${flora.count}× flora “${flora.name}” to the world`);
              }}
            >
              Add flora to world
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setFlora(defaultFloraBlueprint())}
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

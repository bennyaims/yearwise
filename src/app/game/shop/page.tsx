"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  loadEconomy,
  purchaseItem,
  SHOP_ITEMS,
  type GameEconomyState,
  type ShopItemId,
} from "@/lib/game-economy";

export default function ShopPage() {
  const [eco, setEco] = useState<GameEconomyState | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    setEco(loadEconomy());
  }, []);

  function buy(id: ShopItemId) {
    const r = purchaseItem(id);
    setEco(r.economy);
    setMsg(r.message);
  }

  if (!eco) return <div className="page-shell">Loading shop…</div>;

  const cats = ["food", "animals", "characters", "world", "tech"] as const;

  return (
    <div className="page-shell page-mid space-y-6">
      <Link href="/game" className="link-back">
        ← Game hub
      </Link>
      <header className="glass-strong rounded-[var(--radius-xl)] p-6">
        <h1 className="heading-display text-3xl">Coin shop</h1>
        <p className="mt-2 text-muted">
          Spend coins from <strong className="text-ink">all subject tests</strong>.
          CS Game-Build level {eco.csBuildLevel}/6 unlocks higher tiers. Items
          queue for Genesis Lab.
        </p>
        <p className="mt-3 text-2xl font-bold text-accent">🪙 {eco.coins}</p>
        {eco.unlockedCharacters.length > 0 && (
          <p className="mt-2 text-sm text-muted">
            Character unlocks from high scores:{" "}
            {eco.unlockedCharacters.join(", ")}
          </p>
        )}
      </header>

      {msg && (
        <p className="rounded-lg bg-[var(--sky-soft)] px-4 py-2 text-sm text-ink">
          {msg}
        </p>
      )}

      {cats.map((cat) => {
        const items = SHOP_ITEMS.filter((i) => i.category === cat);
        return (
          <section key={cat}>
            <h2 className="heading-section text-lg capitalize">{cat}</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => {
                const locked = eco.csBuildLevel < item.minCsLevel;
                const canAfford = eco.coins >= item.cost;
                return (
                  <div
                    key={item.id}
                    className={`glass rounded-[var(--radius-lg)] p-4 ${locked ? "opacity-50" : ""}`}
                  >
                    <div className="text-2xl">{item.icon}</div>
                    <h3 className="mt-2 font-semibold text-ink">{item.name}</h3>
                    <p className="mt-1 text-sm text-muted">{item.description}</p>
                    <p className="mt-2 text-xs text-soft">
                      {item.cost} coins · CS level {item.minCsLevel}+
                    </p>
                    <button
                      type="button"
                      className="btn btn-primary mt-3 text-xs"
                      disabled={locked || !canAfford}
                      onClick={() => buy(item.id)}
                    >
                      {locked
                        ? `Need CS L${item.minCsLevel}`
                        : canAfford
                          ? "Buy"
                          : "Not enough coins"}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}

      <p className="text-sm text-muted">
        After buying, open{" "}
        <Link href="/labs/genesis" className="text-accent underline">
          Genesis Lab
        </Link>{" "}
        to apply pending world drops.
      </p>
    </div>
  );
}

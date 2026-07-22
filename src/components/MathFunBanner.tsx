"use client";

import Link from "next/link";
import type { YearLevel } from "@/lib/types";

/** Fun GeoGebra hook shown on maths subject / lessons */
export function MathFunBanner({ year }: { year?: YearLevel }) {
  return (
    <aside className="callout callout-tip">
      <p className="font-semibold text-ink">Make this maths fun in GeoGebra</p>
      <p className="mt-1 text-sm text-muted">
        Don&apos;t only read —{" "}
        <strong className="text-ink">design</strong>. Build star bursts,
        number-line skylines, kaleidoscopes, function mountains, and (later)
        parametric galaxies. Beginner → expert tracks wait in the studio.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Link href="/game/geogebra" className="btn btn-primary text-xs">
          GeoGebra design studio
        </Link>
        <a
          href="https://www.geogebra.org/classic"
          target="_blank"
          rel="noreferrer"
          className="btn btn-sky text-xs"
        >
          Open GeoGebra Classic
        </a>
        {year != null && (
          <Link
            href={`/year/${year}/math`}
            className="btn btn-ghost text-xs"
          >
            Year {year} maths pathway
          </Link>
        )}
      </div>
    </aside>
  );
}

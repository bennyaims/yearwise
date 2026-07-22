"use client";

import Link from "next/link";
import type { YearLevel } from "@/lib/types";

/** Fun GeoGebra hook shown on maths subject / lessons */
export function MathFunBanner({ year }: { year?: YearLevel }) {
  return (
    <aside className="callout callout-tip">
      <p className="font-semibold text-ink">Make this maths fun in GeoGebra</p>
      <p className="mt-1 text-sm text-muted">
        Train <strong className="text-ink">times tables</strong> with mental
        speed strategies (doubles, nines trick, break-ups), and{" "}
        <strong className="text-ink">design</strong> in GeoGebra — star bursts,
        skylines, kaleidoscopes, function mountains, galaxies.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Link href="/times-tables" className="btn btn-primary text-xs">
          Times tables gym (speed strategies)
        </Link>
        <Link href="/game/geogebra" className="btn btn-sky text-xs">
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

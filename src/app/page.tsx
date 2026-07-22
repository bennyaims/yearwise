import Link from "next/link";
import { SchedulePanel } from "@/components/SchedulePanel";
import { YEARS, SUBJECTS } from "@/lib/subjects";

const yearLabels: Record<number, string> = {
  7: "Junior secondary foundations",
  8: "Building core knowledge",
  9: "Deepening concepts",
  10: "Senior preparation",
  11: "Senior studies",
  12: "Final year mastery",
};

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="page-shell pb-6 pt-10 sm:pb-8 sm:pt-14 lg:pt-16">
          <div className="glass-strong glass-interactive max-w-3xl rounded-[var(--radius-xl)] p-6 sm:p-8 lg:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent sm:text-sm">
              Australian secondary learning
            </p>
            <h1 className="heading-display mt-3 text-3xl sm:text-4xl lg:text-5xl">
              Years 7–12. Full subject suite.
              <span className="mt-1 block bg-gradient-to-r from-[var(--accent-deep)] via-[var(--accent)] to-[var(--sky)] bg-clip-text text-transparent">
                No sugar-coating the history.
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              Full Australian secondary{" "}
              <strong className="text-ink">curriculum</strong> (Years 7–12) —
              Maths, Science, Chemistry, English, History, Music, languages, and
              Computer Science. In-depth lessons with{" "}
              <strong className="text-ink">YouTube support videos</strong> and
              guided checks. <strong className="text-ink">No skipping</strong> —
              finish every quiz in order. Sit the Year exam early if you want,
              but you need <strong className="text-ink">92% overall</strong>{" "}
              across all subjects (and 92% on the year exam) to progress years.
              Build Lab teaches{" "}
              <strong className="text-ink">coding and 3D animation</strong> as
              curriculum Digital Technologies.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href="/signup" className="btn btn-primary">
                Sign up · software downloads
              </Link>
              <Link href="/tools" className="btn btn-sky">
                Tools (GeoGebra, Blender…)
              </Link>
              <Link href="/times-tables" className="btn btn-sky">
                Times tables gym
              </Link>
              <Link href="/game/geogebra" className="btn btn-sky">
                GeoGebra design studio (fun maths)
              </Link>
              <Link href="/year/7/math" className="btn btn-sky">
                Year 7 Maths pathway
              </Link>
              <Link href="/year/7/computerscience" className="btn btn-sky">
                Computer Science (coding → AI)
              </Link>
              <Link href="/game" className="btn btn-sky">
                Build Lab · code &amp; animation
              </Link>
              <Link href="/labs/genesis" className="btn btn-ghost">
                Genesis Lab (biology · habitation)
              </Link>
              <Link href="/game/blender" className="btn btn-ghost">
                Blender 3D &amp; animation
              </Link>
              <Link href="/game/live" className="btn btn-ghost">
                Guided classes (voice teacher)
              </Link>
              <Link href="/patterns" className="btn btn-ghost">
                Daily patterns drill
              </Link>
              <Link href="/weekly-test" className="btn btn-ghost">
                Weekly test
              </Link>
              <Link href="/rewards" className="btn btn-ghost">
                Progress &amp; badges
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell !pt-0 !pb-4">
        <SchedulePanel />
      </section>

      <section className="page-shell !pt-0">
        <div className="mb-5 sm:mb-6">
          <h2 className="heading-section text-xl sm:text-2xl">
            Choose your year
          </h2>
          <p className="mt-1.5 text-sm text-muted sm:text-base">
            Pick a year level to open all subjects and lessons.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {YEARS.map((year) => (
            <Link
              key={year}
              href={`/year/${year}`}
              className="glass glass-interactive group rounded-[var(--radius-lg)] p-5 sm:p-6"
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="heading-display text-2xl sm:text-3xl">
                  Year {year}
                </span>
                <span className="text-sm font-medium text-accent opacity-0 transition group-hover:opacity-100">
                  Open →
                </span>
              </div>
              <p className="mt-2 text-sm text-muted">{yearLabels[year]}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="page-shell !pt-2 sm:!pt-4">
        <div className="glass rounded-[var(--radius-xl)] p-5 sm:p-8">
          <h2 className="heading-section text-xl sm:text-2xl">
            Subjects included
          </h2>
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {SUBJECTS.map((s) => (
              <div
                key={s.id}
                className="glass-soft rounded-[var(--radius-md)] p-4"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="icon-disc h-11 w-11 shrink-0 text-lg"
                    style={{
                      background: `color-mix(in srgb, ${s.color} 18%, transparent)`,
                      color: s.color,
                    }}
                  >
                    {s.icon}
                  </span>
                  <div className="min-w-0">
                    <div className="truncate font-semibold text-ink">
                      {s.name}
                    </div>
                    <div className="text-xs text-soft">
                      Years {s.years[0]}–{s.years[s.years.length - 1]}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted">
            Languages: Spanish, Russian, Chinese (Mandarin), German, Japanese,
            Khmer, Italian — choose one pathway and keep building year on year.
          </p>
        </div>
      </section>
    </div>
  );
}

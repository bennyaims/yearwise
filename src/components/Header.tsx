import Link from "next/link";

export function Header() {
  return (
    <header
      className="sticky top-0 z-50 glass-strong"
      style={{ paddingTop: "var(--safe-top)" }}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-3 sm:h-16 sm:gap-3 sm:px-6">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2 font-semibold tracking-tight sm:gap-2.5"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--accent-soft)] to-[var(--accent-deep)] text-sm font-bold text-white shadow-[0_4px_14px_var(--accent-glow)]">
            Y
          </span>
          <span className="truncate text-ink">
            Yearwise
            <span className="ml-1.5 hidden text-xs font-normal text-muted md:inline">
              AU Years 7–12
            </span>
          </span>
        </Link>
        <nav className="flex shrink-0 items-center gap-0.5 text-sm sm:gap-1">
          <Link
            href="/tools"
            className="btn btn-chip btn-ghost !min-h-9 !px-2 text-muted hover:text-ink sm:!px-3"
          >
            Tools
          </Link>
          <Link
            href="/game"
            className="btn btn-chip btn-ghost !min-h-9 !px-2 text-muted hover:text-ink sm:!px-3"
          >
            Build Lab
          </Link>
          <Link
            href="/labs/genesis"
            className="btn btn-chip btn-ghost !min-h-9 !px-2 text-muted hover:text-ink sm:!px-3"
          >
            Genesis
          </Link>
          <Link
            href="/schedule"
            className="btn btn-chip btn-ghost !min-h-9 !px-2 text-muted hover:text-ink sm:!px-3"
          >
            Schedule
          </Link>
          <Link
            href="/times-tables"
            className="btn btn-chip btn-ghost !min-h-9 !px-2 text-muted hover:text-ink sm:!px-3"
          >
            × Tables
          </Link>
          <Link
            href="/weekly-test"
            className="btn btn-chip btn-ghost !min-h-9 !px-2 text-muted hover:text-ink sm:!px-3"
          >
            Test
          </Link>
          <Link
            href="/rewards"
            className="btn btn-chip btn-ghost !min-h-9 !px-2 text-muted hover:text-ink sm:!px-3"
          >
            Rewards
          </Link>
          <Link
            href="/signup?edit=1"
            className="btn btn-chip btn-ghost !min-h-9 !px-2 text-muted hover:text-ink sm:!px-3"
          >
            Profile
          </Link>
        </nav>
      </div>
    </header>
  );
}

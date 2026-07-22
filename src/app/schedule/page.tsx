import type { Metadata } from "next";
import Link from "next/link";
import { SchedulePanel } from "@/components/SchedulePanel";

export const metadata: Metadata = {
  title: "Study schedule",
};

export default function SchedulePage() {
  return (
    <div className="page-shell page-mid">
      <Link href="/" className="link-back">
        ← Home
      </Link>
      <h1 className="heading-display mt-3 text-3xl">30-minute study schedule</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Yearwise expects focused blocks in set windows so learning is regular —
        not endless scrolling. Complete one lesson (~30 min) inside a live slot
        when you can.
      </p>
      <div className="mt-8">
        <SchedulePanel compact />
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/year/7/math" className="btn btn-primary">
          Year 7 Maths pathway
        </Link>
        <Link href="/patterns" className="btn btn-sky">
          Daily integer patterns
        </Link>
        <Link href="/weekly-test" className="btn btn-ghost">
          Weekly test
        </Link>
      </div>
    </div>
  );
}

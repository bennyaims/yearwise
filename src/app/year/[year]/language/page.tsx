import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LanguagePicker } from "@/components/LanguagePicker";
import { getSubject, YEARS } from "@/lib/subjects";
import type { YearLevel } from "@/lib/types";

type Props = { params: Promise<{ year: string }> };

function parseYear(raw: string): YearLevel | null {
  const n = Number(raw);
  return YEARS.includes(n as YearLevel) ? (n as YearLevel) : null;
}

export async function generateStaticParams() {
  return YEARS.map((year) => ({ year: String(year) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { year } = await params;
  return { title: `Year ${year} Languages` };
}

export default async function LanguageIndexPage({ params }: Props) {
  const { year: raw } = await params;
  const year = parseYear(raw);
  if (!year) notFound();

  const meta = getSubject("language");

  return (
    <div className="page-shell page-mid">
      <Link href={`/year/${year}`} className="link-back">
        ← Year {year}
      </Link>

      <div className="glass mt-4 flex items-start gap-4 rounded-[var(--radius-xl)] p-5 sm:p-6">
        <span
          className="icon-disc h-12 w-12 shrink-0 text-2xl"
          style={{
            background: `color-mix(in srgb, ${meta?.color ?? "#d48a5a"} 16%, transparent)`,
            color: meta?.color,
          }}
        >
          {meta?.icon}
        </span>
        <div>
          <h1 className="heading-display text-2xl sm:text-3xl">
            Choose your language
          </h1>
          <p className="mt-1 text-sm text-muted sm:text-base">
            Year {year} · stick with one pathway for the best progress
          </p>
        </div>
      </div>

      <p className="mt-4 text-sm text-muted sm:text-base">
        {meta?.description} Your choice is remembered on this device.
      </p>

      <div className="mt-8">
        <LanguagePicker year={year} />
      </div>
    </div>
  );
}

import Link from "next/link";
import type { SubjectMeta } from "@/lib/types";

type Props = {
  subject: SubjectMeta;
  href: string;
  lessonCount: number;
  completedCount?: number;
};

export function SubjectCard({
  subject,
  href,
  lessonCount,
  completedCount = 0,
}: Props) {
  const pct =
    lessonCount === 0 ? 0 : Math.round((completedCount / lessonCount) * 100);

  return (
    <Link
      href={href}
      className="glass glass-interactive group relative flex flex-col overflow-hidden rounded-[var(--radius-lg)] p-5"
    >
      <div
        className="absolute inset-x-0 top-0 h-[3px] opacity-80"
        style={{
          background: `linear-gradient(90deg, ${subject.color}, color-mix(in srgb, ${subject.color} 40%, white))`,
        }}
      />
      <div className="mb-3 flex items-start justify-between gap-3">
        <span
          className="icon-disc h-12 w-12 text-xl"
          style={{
            background: `color-mix(in srgb, ${subject.color} 16%, transparent)`,
            color: subject.color,
          }}
        >
          {subject.icon}
        </span>
        {lessonCount > 0 && (
          <span className="badge">{completedCount}/{lessonCount} done</span>
        )}
      </div>
      <h3 className="text-lg font-semibold text-ink">{subject.name}</h3>
      <p className="mt-1.5 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">
        {subject.description}
      </p>
      {lessonCount > 0 && (
        <div className="mt-4">
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{
                width: `${pct}%`,
                background: `linear-gradient(90deg, ${subject.color}, color-mix(in srgb, ${subject.color} 60%, white))`,
              }}
            />
          </div>
        </div>
      )}
    </Link>
  );
}

import Link from "next/link";
import type { Lesson } from "@/lib/types";

type Props = {
  lesson: Lesson;
  href: string;
  completed?: boolean;
  quizScore?: number;
};

export function LessonCard({ lesson, href, completed, quizScore }: Props) {
  return (
    <Link
      href={href}
      className="glass glass-interactive flex items-start gap-3 rounded-[var(--radius-md)] p-4 sm:gap-4"
    >
      <div
        className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
          completed ? "badge-ok" : "glass-soft text-muted"
        }`}
        style={
          completed
            ? undefined
            : {
                display: "flex",
                borderRadius: "999px",
              }
        }
      >
        {completed ? "✓" : "○"}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-semibold text-ink">{lesson.title}</h3>
          {lesson.strand && <span className="badge">{lesson.strand}</span>}
        </div>
        <p className="mt-1 text-sm text-muted">{lesson.summary}</p>
        <div className="mt-2 flex flex-wrap gap-3 text-xs text-soft">
          <span>~{lesson.estimatedMinutes} min</span>
          {lesson.quiz && <span>{lesson.quiz.length} quiz Qs</span>}
          {completed && quizScore !== undefined && (
            <span className="font-medium text-accent">Quiz: {quizScore}%</span>
          )}
        </div>
      </div>
    </Link>
  );
}

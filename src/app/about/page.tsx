import type { Metadata } from "next";
import Link from "next/link";
import { LANGUAGES, SUBJECTS } from "@/lib/subjects";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <div className="page-shell page-narrow">
      <div className="glass-strong rounded-[var(--radius-xl)] p-5 sm:p-8">
        <h1 className="heading-display text-3xl">About Yearwise</h1>
        <div className="mt-6 space-y-4 text-muted">
          <p>
            Yearwise is a learning app for Australian secondary students covering
            Years 7–12 across core academic subjects, languages, music, and an
            honest treatment of Australian history.
          </p>
          <h2 className="heading-section text-xl text-ink">Subjects</h2>
          <ul className="list-disc space-y-1 pl-5">
            {SUBJECTS.map((s) => (
              <li key={s.id}>
                <strong className="text-ink">{s.name}</strong> — {s.description}
              </li>
            ))}
          </ul>
          <h2 className="heading-section text-xl text-ink">
            Language pathways
          </h2>
          <ul className="list-disc space-y-1 pl-5">
            {LANGUAGES.map((l) => (
              <li key={l.id}>
                {l.flag} {l.name} ({l.nativeName})
              </li>
            ))}
          </ul>
          <h2 className="heading-section text-xl text-ink">
            Computer Science, coding &amp; animation
          </h2>
          <p>
            Yearwise is a <strong className="text-ink">curriculum</strong>, not
            a commercial game. From Year 7 computational thinking through Year
            12, students learn to write code that builds machine-learning
            systems — and to design technical and civic defences against AI
            misuse (human-in-the-loop, least privilege, interruptibility,
            regulation, transparency). Exit gate: build + defend.
          </p>
          <p>
            The <strong className="text-ink">Build Lab</strong> is how coding
            and 3D animation are taught inside that curriculum: students
            implement educational systems (progress, shops, simulations) and
            learn Blender for world and character assets that support Genesis
            science projects. Practice coins from subject tests reward effort
            and feed those applied projects — the game-like layer is a teaching
            method, not the product identity.
          </p>
          <h2 className="heading-section text-xl text-ink">
            Unfiltered history
          </h2>
          <p>
            Australian History in Yearwise does not soft-pedal colonisation,
            frontier violence, racial exclusion policies, or ongoing justice
            debates. Facing evidence is part of a mature education — not an
            attack on the country students live in.
          </p>
          <h2 className="heading-section text-xl text-ink">Curriculum note</h2>
          <p>
            Content is structured for the Australian Curriculum Years 7–10 and
            senior secondary pathways. State syllabuses (e.g. HSC, VCE, QCE,
            SACE, WACE) differ in detail — treat lessons as a strong base and
            expand toward your school&apos;s official outcomes.
          </p>
          <p className="text-sm text-soft">
            Progress is stored in your browser (localStorage) on this device.
          </p>
        </div>
        <Link href="/" className="btn btn-ghost mt-8">
          ← Back to years
        </Link>
      </div>
    </div>
  );
}

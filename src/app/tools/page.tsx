"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CURRICULUM_SOFTWARE,
  softwareForYear,
} from "@/content/curriculum-software";
import { youtubeEmbedUrl, youtubeWatchUrl } from "@/content/curriculum-videos";
import {
  loadProfile,
  markSoftwareReady,
  type StudentProfile,
} from "@/lib/student-profile";

export default function ToolsPage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [video, setVideo] = useState<{
    title: string;
    youtubeId: string;
  } | null>(null);

  useEffect(() => {
    setProfile(loadProfile());
  }, []);

  const tools = profile
    ? softwareForYear(profile.yearLevel)
    : CURRICULUM_SOFTWARE;
  const ready = new Set(profile?.softwareReady ?? []);

  return (
    <div className="page-shell page-mid space-y-6">
      <Link href="/" className="link-back">
        ← Curriculum home
      </Link>

      <header className="glass-strong rounded-[var(--radius-xl)] p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
          Curriculum software pack
        </p>
        <h1 className="heading-display mt-2 text-3xl">Tools &amp; downloads</h1>
        <p className="mt-2 max-w-2xl text-muted">
          Free programs used across Years 7–12.{" "}
          <strong className="text-ink">GeoGebra</strong> for Maths,{" "}
          <strong className="text-ink">Blender</strong> for 3D animation, plus
          coding and folio tools. Tutorials here also appear inside matching
          lessons.
        </p>
        {profile && (
          <p className="mt-3 text-sm text-soft">
            Signed in as {profile.name} · Year {profile.yearLevel} ·{" "}
            <Link href="/signup?edit=1" className="text-accent underline">
              Edit signup
            </Link>
          </p>
        )}
      </header>

      <ul className="space-y-3">
        {tools.map((tool) => (
          <li key={tool.id} className="glass rounded-[var(--radius-lg)] p-5">
            <div className="flex flex-wrap gap-3">
              <span className="text-3xl">{tool.icon}</span>
              <div className="min-w-0 flex-1">
                <h2 className="font-semibold text-ink text-lg">{tool.name}</h2>
                <p className="mt-1 text-sm text-muted">{tool.purpose}</p>
                <p className="mt-1 text-xs text-soft">
                  {tool.platforms} · {tool.license}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <a
                    href={tool.downloadUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary text-xs"
                  >
                    Download / open
                  </a>
                  {tool.tutorials.map((t) => (
                    <button
                      key={t.youtubeId}
                      type="button"
                      className="btn btn-sky text-xs"
                      onClick={() =>
                        setVideo({ title: t.title, youtubeId: t.youtubeId })
                      }
                    >
                      Tutorial: {t.title.slice(0, 28)}
                      {t.title.length > 28 ? "…" : ""}
                    </button>
                  ))}
                  {profile && (
                    <label className="flex items-center gap-2 text-xs text-muted px-2">
                      <input
                        type="checkbox"
                        checked={ready.has(tool.id)}
                        onChange={(e) => {
                          const p = markSoftwareReady(tool.id, e.target.checked);
                          if (p) setProfile(p);
                        }}
                      />
                      Ready
                    </label>
                  )}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {video && (
        <div className="glass-strong rounded-[var(--radius-xl)] overflow-hidden">
          <div className="flex justify-between p-3">
            <p className="text-sm font-semibold text-ink">{video.title}</p>
            <button
              type="button"
              className="btn btn-ghost text-xs"
              onClick={() => setVideo(null)}
            >
              Close
            </button>
          </div>
          <div className="aspect-video bg-black">
            <iframe
              title={video.title}
              src={youtubeEmbedUrl(video.youtubeId)}
              className="h-full w-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
          <a
            href={youtubeWatchUrl(video.youtubeId)}
            className="block p-3 text-xs text-accent underline"
            target="_blank"
            rel="noreferrer"
          >
            Open on YouTube
          </a>
        </div>
      )}
    </div>
  );
}

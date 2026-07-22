"use client";

import {
  youtubeEmbedUrl,
  youtubeWatchUrl,
} from "@/content/curriculum-videos";
import type { LessonVideo } from "@/lib/types";

type Props = {
  videos: LessonVideo[];
  title?: string;
};

export function LessonVideos({
  videos,
  title = "Curriculum videos",
}: Props) {
  if (!videos.length) return null;

  return (
    <section className="space-y-4">
      <div>
        <h2 className="heading-section text-lg sm:text-xl">{title}</h2>
        <p className="mt-1 text-sm text-muted">
          Pause often. Link each idea back to the written lesson and checks
          above.
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-1">
        {videos.map((v) => (
          <article
            key={v.youtubeId}
            className="glass overflow-hidden rounded-[var(--radius-lg)]"
          >
            <div className="aspect-video w-full bg-black">
              <iframe
                title={v.title}
                src={youtubeEmbedUrl(v.youtubeId)}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="p-4">
              <div className="flex flex-wrap items-center gap-2">
                {v.role && (
                  <span className="badge badge-sky text-[10px] uppercase">
                    {v.role === "accelerate"
                      ? "Fast track"
                      : v.role === "depth"
                        ? "In-depth"
                        : "Core"}
                  </span>
                )}
                {v.minutes != null && (
                  <span className="text-xs text-soft">~{v.minutes} min</span>
                )}
              </div>
              <h3 className="mt-1 font-semibold text-ink">{v.title}</h3>
              <p className="text-xs text-muted">{v.channel}</p>
              <p className="mt-2 text-sm text-muted">{v.why}</p>
              <a
                href={youtubeWatchUrl(v.youtubeId)}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-xs text-accent underline"
              >
                Open on YouTube
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

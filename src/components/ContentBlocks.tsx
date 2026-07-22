"use client";

import { SpeakButton } from "@/components/SpeakButton";
import {
  youtubeEmbedUrl,
  youtubeWatchUrl,
} from "@/content/curriculum-videos";
import type { ContentBlock, LanguageId } from "@/lib/types";

const toneClass = {
  info: "callout callout-info",
  warning: "callout callout-warning",
  tip: "callout callout-tip",
  unfiltered: "callout callout-unfiltered",
};

const toneLabels = {
  info: "Note",
  warning: "Important",
  tip: "Tip",
  unfiltered: "Unfiltered",
};

type Props = {
  blocks: ContentBlock[];
  /** When set, example bodies can be played as audio */
  language?: LanguageId;
};

export function ContentBlocks({ blocks, language }: Props) {
  return (
    <div className="glass space-y-5 rounded-[var(--radius-xl)] p-5 sm:p-7">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "heading":
            return (
              <h2 key={i} className="heading-section text-lg sm:text-xl">
                {block.text}
              </h2>
            );
          case "paragraph":
            return (
              <p
                key={i}
                className="text-base leading-relaxed text-muted sm:leading-[1.7]"
              >
                {block.text}
              </p>
            );
          case "callout":
            return (
              <aside key={i} className={toneClass[block.tone]}>
                <div className="mb-1 text-xs font-bold uppercase tracking-wide opacity-75">
                  {toneLabels[block.tone]}
                </div>
                {block.text}
              </aside>
            );
          case "list": {
            const Tag = block.ordered ? "ol" : "ul";
            return (
              <Tag
                key={i}
                className={`space-y-2 pl-5 text-muted ${
                  block.ordered ? "list-decimal" : "list-disc"
                }`}
              >
                {block.items.map((item, j) => (
                  <li key={j} className="leading-relaxed">
                    {item}
                  </li>
                ))}
              </Tag>
            );
          }
          case "formula":
            return (
              <div key={i} className="callout callout-formula px-4 py-4">
                <div
                  className="font-mono text-base font-semibold tracking-wide sm:text-lg"
                  style={{ color: "var(--violet)" }}
                >
                  {block.latex}
                </div>
                {block.note && (
                  <p className="mt-2 text-sm text-muted">{block.note}</p>
                )}
              </div>
            );
          case "example":
            return (
              <div
                key={i}
                className="glass-soft rounded-[var(--radius-md)] px-4 py-3"
              >
                <div className="text-xs font-bold uppercase tracking-wide text-soft">
                  Example — {block.title}
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-ink">
                  {block.body}
                </p>
                {language && (
                  <div className="mt-3">
                    <SpeakButton
                      text={block.body}
                      language={language}
                      label="Hear example"
                      size="sm"
                      rate={0.85}
                    />
                  </div>
                )}
              </div>
            );
          case "audio":
            return (
              <div
                key={i}
                className="glass-soft flex flex-col gap-3 rounded-[var(--radius-md)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="text-xs font-bold uppercase tracking-wide text-soft">
                    {block.title}
                  </div>
                  <p className="mt-1 text-lg font-semibold text-ink">
                    {block.text}
                  </p>
                  {block.romanization && (
                    <p className="text-sm text-soft">{block.romanization}</p>
                  )}
                  <p className="mt-1 text-sm text-muted">{block.meaning}</p>
                  {block.note && (
                    <p className="mt-1 text-xs text-accent">{block.note}</p>
                  )}
                </div>
                {language && (
                  <SpeakButton
                    text={block.text}
                    language={language}
                    label="Play"
                    size="sm"
                  />
                )}
              </div>
            );
          case "video":
            return (
              <div
                key={i}
                className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--glass-border)]"
              >
                <div className="aspect-video w-full bg-black">
                  <iframe
                    title={block.title}
                    src={youtubeEmbedUrl(block.youtubeId)}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="bg-[var(--glass-soft)] px-4 py-3">
                  <div className="text-xs font-bold uppercase tracking-wide text-soft">
                    Video
                    {block.minutes != null ? ` · ~${block.minutes} min` : ""}
                    {block.channel ? ` · ${block.channel}` : ""}
                  </div>
                  <p className="mt-1 font-semibold text-ink">{block.title}</p>
                  {block.note && (
                    <p className="mt-1 text-sm text-muted">{block.note}</p>
                  )}
                  <a
                    href={youtubeWatchUrl(block.youtubeId)}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block text-xs text-accent underline"
                  >
                    Open on YouTube
                  </a>
                </div>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}

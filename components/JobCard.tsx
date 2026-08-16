"use client";

import { Posting } from "@/lib/types";
import { burstFrom } from "@/lib/confetti";

const SOURCE_COLOR: Record<Posting["source"], string> = {
  Jobberman: "var(--violet)",
  MyJobMag: "var(--green)",
  Fuzu: "var(--coral)",
  "Forward by Anakle": "var(--green)",
  Kuda: "var(--yellow)",
};

export default function JobCard({ posting }: { posting: Posting }) {
  return (
    <a
      href={posting.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => burstFrom(e.currentTarget)}
      className="group relative flex flex-col gap-3 rounded-2xl p-5 border-2 transition-transform hover:-translate-y-1"
      style={{ background: "var(--bg-card)", borderColor: "var(--border-soft)" }}
    >
      <span
        className="absolute -top-2.5 left-5 h-2.5 w-10 rounded-full"
        style={{ background: SOURCE_COLOR[posting.source] }}
        aria-hidden
      />

      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-xl leading-tight uppercase tracking-wide pr-2">
          {posting.title}
        </h3>
        <span
          className="font-mono-ui text-[9px] tracking-wider font-bold px-2 py-1 rounded-full whitespace-nowrap shrink-0"
          style={{ background: SOURCE_COLOR[posting.source], color: "#14110d" }}
        >
          {posting.source.toUpperCase()}
        </span>
      </div>

      {posting.company && (
        <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
          {posting.company}
        </p>
      )}

      <div className="flex items-center justify-between mt-auto pt-2">
        <span className="font-mono-ui text-xs" style={{ color: "var(--text-faint)" }}>
          {posting.location ?? "Lagos, Nigeria"}
        </span>
        <span
          className="font-mono-ui text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ color: "var(--yellow)" }}
        >
          APPLY ↗
        </span>
      </div>

      {posting.caveat && (
        <p className="font-mono-ui text-[10px] -mt-1" style={{ color: "var(--text-faint)" }}>
          ⓘ {posting.caveat}
        </p>
      )}
    </a>
  );
}

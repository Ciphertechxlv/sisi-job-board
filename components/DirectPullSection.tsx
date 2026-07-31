"use client";

import { DirectPullResult } from "@/lib/types";

export default function DirectPullSection({
  pulls,
}: {
  pulls: DirectPullResult[];
}) {
  return (
    <section>
      <div className="flex items-baseline justify-between flex-wrap gap-2 mb-4">
        <h2 className="font-display uppercase text-2xl sm:text-3xl tracking-wide">
          Straight From Their Boards
        </h2>
        <p className="font-mono-ui text-[11px]" style={{ color: "var(--text-faint)" }}>
          pulled live from their own hiring systems, no search engine involved
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        {pulls.map((pull) => (
          <div
            key={pull.id}
            className="rounded-2xl p-5 border-2"
            style={{ background: "var(--bg-card)", borderColor: pull.color }}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <h3 className="font-display text-xl uppercase tracking-wide leading-none">
                  {pull.name}
                </h3>
                <p className="text-xs mt-1.5" style={{ color: "var(--text-faint)" }}>
                  {pull.blurb}
                </p>
              </div>
              <span
                className="font-mono-ui text-[9px] font-bold px-2 py-1 rounded-full whitespace-nowrap"
                style={{ background: pull.color, color: "#14110d" }}
              >
                {pull.status === "live" ? "● LIVE" : pull.status === "empty" ? "○ NONE NOW" : "⚠ UNREACHABLE"}
              </span>
            </div>

            {pull.postings.length > 0 ? (
              <ul className="flex flex-col gap-2">
                {pull.postings.map((p, i) => (
                  <li key={i}>
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:opacity-80"
                      style={{ background: "var(--bg-soft)" }}
                    >
                      <span className="line-clamp-1">{p.title}</span>
                      <span
                        className="font-mono-ui text-[10px] shrink-0"
                        style={{ color: "var(--text-faint)" }}
                      >
                        {p.location ?? "Open ↗"}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm" style={{ color: "var(--text-faint)" }}>
                {pull.status === "error"
                  ? "Couldn't reach their board just now — refresh to try again."
                  : "Nothing matching this filter on their board right now."}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

"use client";

import { CompanyResult } from "@/lib/types";

function StatusBadge({ status }: { status: CompanyResult["status"] }) {
  const map: Record<
    CompanyResult["status"],
    { label: string; bg: string; fg: string }
  > = {
    live: { label: "● LIVE PULL", bg: "var(--green)", fg: "var(--ink)" },
    "search-only": { label: "→ QUICK SEARCH", bg: "var(--yellow)", fg: "var(--ink)" },
    empty: { label: "○ NONE RIGHT NOW", bg: "var(--paper-dim)", fg: "var(--ink)" },
    error: { label: "→ TRY SEARCH INSTEAD", bg: "var(--yellow)", fg: "var(--ink)" },
  };
  const s = map[status];
  return (
    <span
      className="font-mono-ui text-[10px] sm:text-[11px] tracking-wider font-bold px-2 py-1 rounded-full whitespace-nowrap"
      style={{ background: s.bg, color: s.fg }}
    >
      {s.label}
    </span>
  );
}

export default function CompanyCard({ result }: { result: CompanyResult }) {
  const hasLive = result.status === "live" && result.postings.length > 0;

  return (
    <div
      className="relative rounded-2xl p-5 sm:p-6 flex flex-col gap-4 border-2 transition-transform hover:-translate-y-1"
      style={{
        background: "var(--ink-soft)",
        borderColor: result.color,
      }}
    >
      {/* pinned corner tab */}
      <span
        className="absolute -top-3 left-5 h-6 w-10 rounded-sm rotate-[-4deg]"
        style={{ background: result.color, opacity: 0.9 }}
        aria-hidden
      />

      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-2xl sm:text-[28px] leading-none tracking-wide uppercase">
            {result.name}
          </h3>
          <p className="text-sm opacity-70 mt-2 max-w-[38ch]">{result.blurb}</p>
        </div>
        <StatusBadge status={result.status} />
      </div>

      {hasLive ? (
        <ul className="flex flex-col gap-2 mt-1">
          {result.postings.map((p, i) => (
            <li key={i}>
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm bg-[var(--ink)] hover:bg-black/40 transition-colors"
              >
                <span className="line-clamp-1">{p.title}</span>
                <span className="font-mono-ui text-[11px] opacity-60 group-hover:opacity-100 shrink-0">
                  {p.location ?? "Open ↗"}
                </span>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-1 flex flex-col gap-2">
          <p className="text-sm opacity-70">
            {result.status === "empty"
              ? "No open roles matching this filter right now — check back, or search fresh:"
              : result.status === "error"
              ? "Couldn't reach their board directly right now — search fresh instead:"
              : "This one's easiest to check via direct search:"}
          </p>
          <div className="flex flex-wrap gap-2">
            <a
              href={result.searchLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono-ui text-xs font-bold px-3 py-2 rounded-full border-2 hover:bg-[var(--paper)] hover:text-[var(--ink)] transition-colors"
              style={{ borderColor: result.color }}
            >
              LINKEDIN ↗
            </a>
            <a
              href={result.searchLinks.jobberman}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono-ui text-xs font-bold px-3 py-2 rounded-full border-2 hover:bg-[var(--paper)] hover:text-[var(--ink)] transition-colors"
              style={{ borderColor: result.color }}
            >
              JOBBERMAN ↗
            </a>
            <a
              href={result.careersUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono-ui text-xs font-bold px-3 py-2 rounded-full border-2 hover:bg-[var(--paper)] hover:text-[var(--ink)] transition-colors"
              style={{ borderColor: result.color }}
            >
              CAREERS PAGE ↗
            </a>
          </div>
        </div>
      )}

      <p className="font-mono-ui text-[10px] opacity-40 mt-auto pt-1">
        checked {new Date(result.checkedAt).toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </div>
  );
}

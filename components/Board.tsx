"use client";

import { useEffect, useState } from "react";
import { ROLES, RoleKey } from "@/lib/companies";
import { DirectPullResult, Posting } from "@/lib/types";
import JobCard from "./JobCard";
import DirectPullSection from "./DirectPullSection";
import ThemeToggle from "./ThemeToggle";

const TICKER_WORDS = ROLES.map((r) => r.label.toUpperCase());

export default function Board() {
  const [activeRole, setActiveRole] = useState<RoleKey | "all">("all");
  const [postings, setPostings] = useState<Posting[]>([]);
  const [directPulls, setDirectPulls] = useState<DirectPullResult[]>([]);
  const [feedStatus, setFeedStatus] = useState<"live" | "error">("live");
  const [loading, setLoading] = useState(true);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      try {
        const url =
          activeRole === "all" ? "/api/jobs" : `/api/jobs?role=${activeRole}`;
        const res = await fetch(url, { cache: "no-store" });
        const data = await res.json();
        if (!cancelled) {
          setPostings(data.postings);
          setDirectPulls(data.directPulls);
          setFeedStatus(data.feedStatus);
          setGeneratedAt(data.generatedAt);
        }
      } catch {
        if (!cancelled) {
          setPostings([]);
          setFeedStatus("error");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [activeRole]);

  return (
    <main className="min-h-screen">
      {/* HERO / MASTHEAD */}
      <header className="relative overflow-hidden border-b-4" style={{ borderColor: "var(--yellow)" }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-10 sm:pt-16 pb-8">
          <div className="flex items-center justify-between gap-4 mb-8 sm:mb-12">
            <span
              className="font-mono-ui text-[11px] sm:text-xs tracking-[0.2em]"
              style={{ color: "var(--text-faint)" }}
            >
              LAGOS, NIGERIA · LIVE
            </span>
            <div className="flex items-center gap-3">
              <span
                className="font-mono-ui text-[11px] sm:text-xs tracking-[0.2em] px-3 py-1 rounded-full font-bold"
                style={{ background: "var(--coral)", color: "#faf3e4" }}
              >
                VOL. 01
              </span>
              <ThemeToggle />
            </div>
          </div>

          <p className="font-mono-ui text-xs sm:text-sm tracking-[0.3em] mb-3" style={{ color: "var(--yellow)" }}>
            SISI&rsquo;S
          </p>
          <h1 className="font-display uppercase text-[15vw] sm:text-[9vw] lg:text-[110px] leading-[0.85] tracking-tight">
            Wanted
            <br />
            Board
          </h1>
          <p className="mt-6 max-w-[56ch] text-base sm:text-lg" style={{ color: "var(--text-soft)" }}>
            Real, open roles in brand marketing, advertising, creative
            writing, copywriting, digital marketing and graduate trainee
            programmes — pulled live from Lagos&rsquo;s biggest job board and
            straight from the hiring systems of the agencies and brands in
            Sisi&rsquo;s dream list.
          </p>
        </div>

        {/* marquee ticker */}
        <div
          className="relative py-3 border-t-2 overflow-hidden"
          style={{ borderColor: "var(--yellow)", background: "var(--bg-soft)" }}
        >
          <div className="marquee-track flex whitespace-nowrap font-mono-ui text-sm font-bold tracking-widest">
            {[...TICKER_WORDS, ...TICKER_WORDS, ...TICKER_WORDS, ...TICKER_WORDS].map(
              (w, i) => (
                <span key={i} className="mx-4 flex items-center gap-4">
                  {w}
                  <span style={{ color: "var(--coral)" }}>✦</span>
                </span>
              )
            )}
          </div>
        </div>
      </header>

      {/* FILTER BAR */}
      <div
        className="sticky top-0 z-20 backdrop-blur border-b-2"
        style={{ background: "var(--overlay)", borderColor: "var(--border-soft)" }}
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-3 flex gap-2 overflow-x-auto">
          <FilterChip
            active={activeRole === "all"}
            label="Everything"
            onClick={() => setActiveRole("all")}
          />
          {ROLES.map((r) => (
            <FilterChip
              key={r.key}
              active={activeRole === r.key}
              label={r.label}
              onClick={() => setActiveRole(r.key)}
            />
          ))}
        </div>
      </div>

      {/* BODY */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 sm:py-14 flex flex-col gap-12">
        <DirectPullSection pulls={directPulls} />

        <div>
          <div className="flex items-center justify-between flex-wrap gap-2 mb-5">
            <h2 className="font-display uppercase text-2xl sm:text-3xl tracking-wide">
              Live From Jobberman
            </h2>
            {generatedAt && (
              <p className="font-mono-ui text-[11px]" style={{ color: "var(--text-faint)" }}>
                last refreshed{" "}
                {new Date(generatedAt).toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            )}
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl h-40 animate-pulse"
                  style={{ background: "var(--bg-soft)" }}
                />
              ))}
            </div>
          ) : feedStatus === "error" ? (
            <p className="text-sm" style={{ color: "var(--text-faint)" }}>
              Couldn&rsquo;t reach Jobberman just now — refresh the page to
              try again.
            </p>
          ) : postings.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--text-faint)" }}>
              Nothing matching this filter in Lagos right now. Roles turn
              over fast here — check back soon, or try{" "}
              <button
                onClick={() => setActiveRole("all")}
                className="underline font-semibold"
                style={{ color: "var(--yellow)" }}
              >
                Everything
              </button>
              .
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {postings.map((p, i) => (
                <JobCard key={p.url + i} posting={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      <footer className="border-t-2 mt-10" style={{ borderColor: "var(--border-soft)" }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8 flex flex-col sm:flex-row justify-between gap-3">
          <p className="font-mono-ui text-[11px]" style={{ color: "var(--text-faint)" }}>
            Built for Sisi. Every listing here is a real, currently-open
            role — nothing on this page is a search link.
          </p>
          <p className="font-mono-ui text-[11px]" style={{ color: "var(--text-faint)" }}>
            GO GET IT ✦
          </p>
        </div>
      </footer>
    </main>
  );
}

function FilterChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="font-mono-ui text-xs sm:text-sm font-bold tracking-wide px-4 py-2 rounded-full border-2 whitespace-nowrap transition-colors"
      style={
        active
          ? { background: "var(--yellow)", color: "#14110d", borderColor: "var(--yellow)" }
          : { background: "transparent", color: "var(--text)", borderColor: "var(--border-soft)" }
      }
      aria-pressed={active}
    >
      {label}
    </button>
  );
}

"use client";

import { useEffect, useState } from "react";
import { ROLES, RoleKey } from "@/lib/companies";
import { CompanyResult } from "@/lib/types";
import CompanyCard from "./CompanyCard";
import GradTraineeStrip from "./GradTraineeStrip";

const TICKER_WORDS = ROLES.map((r) => r.label.toUpperCase());

export default function Board() {
  const [activeRole, setActiveRole] = useState<RoleKey | "all">("all");
  const [results, setResults] = useState<CompanyResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      try {
        // "all" fetches every company's unfiltered board; a specific role
        // narrows each company's postings down to matches for that role.
        const url =
          activeRole === "all" ? "/api/jobs" : `/api/jobs?role=${activeRole}`;
        const res = await fetch(url, { cache: "no-store" });
        const data = await res.json();
        if (!cancelled) {
          setResults(data.results);
          setGeneratedAt(data.generatedAt);
        }
      } catch {
        if (!cancelled) setResults([]);
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
            <span className="font-mono-ui text-[11px] sm:text-xs tracking-[0.2em] opacity-70">
              LAGOS, NIGERIA · EST. TODAY
            </span>
            <span
              className="font-mono-ui text-[11px] sm:text-xs tracking-[0.2em] px-3 py-1 rounded-full font-bold"
              style={{ background: "var(--coral)", color: "var(--paper)" }}
            >
              VOL. 01
            </span>
          </div>

          <p className="font-mono-ui text-xs sm:text-sm tracking-[0.3em] mb-3" style={{ color: "var(--yellow)" }}>
            SISI&rsquo;S
          </p>
          <h1 className="font-display uppercase text-[15vw] sm:text-[9vw] lg:text-[110px] leading-[0.85] tracking-tight">
            Wanted
            <br />
            Board
          </h1>
          <p className="mt-6 max-w-[52ch] text-base sm:text-lg opacity-80">
            A live desk watching brand marketing, advertising, copywriting,
            creative writing and digital marketing roles — pointed straight
            at the dream list, and every graduate trainee programme landing
            in Lagos.
          </p>
        </div>

        {/* marquee ticker */}
        <div
          className="relative py-3 border-t-2 overflow-hidden"
          style={{ borderColor: "var(--yellow)", background: "var(--ink-soft)" }}
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
        style={{ background: "rgba(20,17,13,0.9)", borderColor: "var(--ink-soft)" }}
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-3 flex gap-2 overflow-x-auto">
          <FilterChip
            active={activeRole === "all"}
            label="Everything"
            color="var(--paper)"
            onClick={() => setActiveRole("all")}
          />
          {ROLES.map((r) => (
            <FilterChip
              key={r.key}
              active={activeRole === r.key}
              label={r.label}
              color="var(--yellow)"
              onClick={() => setActiveRole(r.key)}
            />
          ))}
        </div>
      </div>

      {/* BODY */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 sm:py-14 flex flex-col gap-10">
        <GradTraineeStrip />

        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="font-display uppercase text-2xl sm:text-3xl tracking-wide">
            The Dream List
          </h2>
          {generatedAt && (
            <p className="font-mono-ui text-[11px] opacity-50">
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
                className="rounded-2xl h-56 animate-pulse"
                style={{ background: "var(--ink-soft)" }}
              />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {results.map((r) => (
              <CompanyCard key={r.id} result={r} />
            ))}
          </div>
        )}
      </div>

      <footer className="border-t-2 mt-10" style={{ borderColor: "var(--ink-soft)" }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8 flex flex-col sm:flex-row justify-between gap-3">
          <p className="font-mono-ui text-[11px] opacity-50">
            Built for Sisi. Company boards that support live pulls refresh on
            every visit; the rest link straight to a pre-filtered search.
          </p>
          <p className="font-mono-ui text-[11px] opacity-50">
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
  color,
  onClick,
}: {
  active: boolean;
  label: string;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="font-mono-ui text-xs sm:text-sm font-bold tracking-wide px-4 py-2 rounded-full border-2 whitespace-nowrap transition-colors"
      style={
        active
          ? { background: color, color: "var(--ink)", borderColor: color }
          : { background: "transparent", color: "var(--paper)", borderColor: "var(--ink-soft)" }
      }
      aria-pressed={active}
    >
      {label}
    </button>
  );
}

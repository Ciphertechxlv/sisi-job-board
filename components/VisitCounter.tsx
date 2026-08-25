"use client";

import { useEffect, useState } from "react";
import { NOTES } from "@/lib/easterEggs";
import NoteTrigger from "./NoteTrigger";

export default function VisitCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/visits", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setCount(data.count ?? null);
      })
      .catch(() => {
        if (!cancelled) setCount(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (count === null) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <NoteTrigger
        note={NOTES.counter}
        position="top-right"
        accentColor="var(--coral)"
        className="font-mono-ui text-[11px] font-bold tracking-widest px-3 py-1.5 rounded-full shadow-lg bg-[var(--yellow)] text-[#14110D]"
      >
        {count.toLocaleString()} {count === 1 ? "READER" : "READERS"} TODAY
      </NoteTrigger>
    </div>
  );
}

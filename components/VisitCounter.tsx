"use client";

import { useEffect, useState } from "react";

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
    <p
      className="font-mono-ui text-[10px] tracking-widest text-center"
      style={{ color: "var(--text-faint)" }}
    >
      {count.toLocaleString()} {count === 1 ? "READER" : "READERS"} TODAY
    </p>
  );
}

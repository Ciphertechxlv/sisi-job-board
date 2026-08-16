"use client";

import { useEffect, useRef, useState } from "react";
import { NOTES } from "@/lib/easterEggs";

export default function EndOfFeedNote() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.6 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="flex justify-center pt-2">
      <p
        className={`font-mono-ui text-xs text-center max-w-[38ch] transition-opacity duration-700 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        style={{ color: "var(--text-faint)" }}
      >
        {NOTES.endOfFeed}
      </p>
    </div>
  );
}

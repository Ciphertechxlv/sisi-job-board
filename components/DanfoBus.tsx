"use client";

import { useEffect, useRef, useState } from "react";

export default function DanfoBus() {
  const ref = useRef<HTMLDivElement>(null);
  const [drive, setDrive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDrive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative h-10 overflow-hidden" aria-hidden>
      {drive && (
        <svg
          viewBox="0 0 64 32"
          className="absolute bottom-0 h-8 w-16 danfo-drive"
          style={{ left: "-70px" }}
        >
          {/* body */}
          <rect x="4" y="8" width="52" height="16" rx="3" fill="#FFC53D" />
          {/* danfo stripe */}
          <rect x="4" y="16" width="52" height="4" fill="#14110D" />
          {/* windshield */}
          <rect x="8" y="11" width="12" height="8" rx="1.5" fill="#FAF3E4" />
          {/* wheels */}
          <circle cx="16" cy="25" r="4" fill="#14110D" />
          <circle cx="44" cy="25" r="4" fill="#14110D" />
          <circle cx="16" cy="25" r="1.6" fill="#FAF3E4" />
          <circle cx="44" cy="25" r="1.6" fill="#FAF3E4" />
        </svg>
      )}
    </div>
  );
}

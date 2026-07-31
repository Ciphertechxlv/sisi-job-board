"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const current =
      (document.documentElement.getAttribute("data-theme") as Theme) || "dark";
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading the theme the no-flash inline script already set on <html>, not a derived-state loop
    setTheme(current);
  }, []);

  function toggle() {
    const next: Theme = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("sisi-theme", next);
    } catch {
      // localStorage unavailable — theme just won't persist, no big deal
    }
  }

  // avoid a hydration mismatch flash: render a neutral placeholder until mounted
  if (!theme) {
    return <span className="w-9 h-9 sm:w-10 sm:h-10 block" aria-hidden />;
  }

  return (
    <button
      onClick={toggle}
      aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center transition-transform hover:-translate-y-0.5 shrink-0"
      style={{ borderColor: "var(--yellow)" }}
    >
      {theme === "light" ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"
            fill="var(--text)"
          />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="4.5" fill="var(--yellow)" />
          <g stroke="var(--yellow)" strokeWidth="1.8" strokeLinecap="round">
            <line x1="12" y1="1.5" x2="12" y2="4" />
            <line x1="12" y1="20" x2="12" y2="22.5" />
            <line x1="1.5" y1="12" x2="4" y2="12" />
            <line x1="20" y1="12" x2="22.5" y2="12" />
            <line x1="4.2" y1="4.2" x2="6" y2="6" />
            <line x1="18" y1="18" x2="19.8" y2="19.8" />
            <line x1="19.8" y1="4.2" x2="18" y2="6" />
            <line x1="6" y1="18" x2="4.2" y2="19.8" />
          </g>
        </svg>
      )}
    </button>
  );
}

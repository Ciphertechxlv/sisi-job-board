"use client";

import { buildGradTraineeLinks } from "@/lib/companies";

export default function GradTraineeStrip() {
  const links = buildGradTraineeLinks();
  const items = [
    { label: "LinkedIn", href: links.linkedin, color: "var(--violet)" },
    { label: "Jobberman", href: links.jobberman, color: "var(--yellow)" },
    { label: "MyJobMag", href: links.myjobmag, color: "var(--coral)" },
    { label: "Fuzu", href: links.fuzu, color: "var(--green)" },
  ];

  return (
    <section
      className="rounded-2xl p-5 sm:p-7 border-2 border-dashed"
      style={{ borderColor: "var(--yellow)" }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="font-mono-ui text-xs tracking-widest opacity-60 mb-1">
            NOT LIMITED TO THE DREAM LIST
          </p>
          <h3 className="font-display text-2xl sm:text-3xl uppercase leading-none">
            Graduate Trainee Radar — Lagos only
          </h3>
          <p className="text-sm opacity-70 mt-2 max-w-[60ch]">
            Graduate programmes open and close fast and pop up at companies
            nobody&apos;s watching yet. These are live, pre-filtered searches —
            one tap, always fresh, always Lagos-only.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-5">
        {items.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono-ui text-xs font-bold px-4 py-2.5 rounded-full transition-transform hover:-translate-y-0.5"
            style={{ background: item.color, color: "var(--ink)" }}
          >
            SEARCH {item.label.toUpperCase()} ↗
          </a>
        ))}
      </div>
    </section>
  );
}

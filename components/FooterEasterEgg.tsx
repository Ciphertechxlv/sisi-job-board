"use client";

import { NOTES } from "@/lib/easterEggs";
import NoteTrigger from "./NoteTrigger";

export default function FooterEasterEgg() {
  return (
    <NoteTrigger
      note={NOTES.footer}
      position="top-right"
      accentColor="var(--coral)"
      className="footer-star-hint font-mono-ui text-[11px]"
    >
      <span style={{ color: "var(--text-faint)" }}>GO GET IT </span>
      <span style={{ color: "var(--coral)" }}>✦</span>
    </NoteTrigger>
  );
}

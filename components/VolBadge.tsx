"use client";

import { NOTES } from "@/lib/easterEggs";
import NoteTrigger from "./NoteTrigger";

export default function VolBadge() {
  return (
    <NoteTrigger
      note={NOTES.vol}
      position="bottom-right"
      accentColor="var(--yellow)"
      className="vol-badge-hint font-mono-ui text-[11px] sm:text-xs tracking-[0.2em] px-3 py-1 rounded-full font-bold bg-[var(--coral)] text-[#faf3e4]"
    >
      VOL. 01
    </NoteTrigger>
  );
}

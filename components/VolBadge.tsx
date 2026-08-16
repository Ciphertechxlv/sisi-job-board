"use client";

import { useState } from "react";
import { NOTES } from "@/lib/easterEggs";
import NoteTrigger from "./NoteTrigger";

export default function VolBadge() {
  const [volume, setVolume] = useState(1);

  return (
    <NoteTrigger
      note={NOTES.vol}
      position="bottom-right"
      accentColor="var(--yellow)"
      onReveal={() => setVolume((v) => v + 1)}
      className="vol-badge-hint font-mono-ui text-[11px] sm:text-xs tracking-[0.2em] px-3 py-1 rounded-full font-bold bg-[var(--coral)] text-[#faf3e4]"
    >
      VOL. {String(volume).padStart(2, "0")}
    </NoteTrigger>
  );
}

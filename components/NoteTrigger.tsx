"use client";

import { useRef, useState, type ReactNode } from "react";

type Position = "bottom-right" | "bottom-left" | "top-right" | "bottom-center" | "side-right";

const POSITION_CLASSES: Record<Position, string> = {
  "bottom-right": "right-0 top-full mt-2",
  "bottom-left": "left-0 top-full mt-2",
  "top-right": "right-0 bottom-full mb-2",
  "bottom-center": "left-1/2 -translate-x-1/2 top-full mt-2",
  "side-right": "left-full ml-3 top-1/2 -translate-y-1/2",
};

export default function NoteTrigger({
  note,
  children,
  className,
  position = "bottom-right",
  accentColor = "var(--yellow)",
  onReveal,
  onDismiss,
  stretch = false,
}: {
  note: string;
  children: ReactNode;
  className?: string;
  position?: Position;
  accentColor?: string;
  /** optional side-effect fired the moment the note opens (e.g. pausing a marquee) */
  onReveal?: () => void;
  /** optional side-effect fired when the note auto-dismisses */
  onDismiss?: () => void;
  /** fills the nearest positioned ancestor instead of hugging its content —
   * for turning a whole bar into an easy tap target rather than a tiny
   * element that's awkward to hit precisely (especially mid-animation, or
   * with a finger on mobile) */
  stretch?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function reveal() {
    setOpen(true);
    onReveal?.();
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setOpen(false);
      onDismiss?.();
    }, 4200);
  }

  return (
    <span className={stretch ? "absolute inset-0 block" : "relative inline-block"}>
      <button
        onClick={reveal}
        aria-label="Reveal a note"
        className={stretch ? `absolute inset-0 w-full h-full ${className ?? ""}` : className}
      >
        {children}
      </button>
      {open && (
        <span
          role="status"
          className={`absolute ${POSITION_CLASSES[position]} w-56 rounded-xl px-3 py-2.5 text-xs leading-snug shadow-lg border-2 z-30 inline-block text-left animate-[fadeIn_0.2s_ease]`}
          style={{
            background: "var(--bg-card)",
            borderColor: accentColor,
            color: "var(--text)",
          }}
        >
          {note}
        </span>
      )}
    </span>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import NoteTrigger from "./NoteTrigger";

const SESSION_FLAG = "sisi-visit-counted";

export default function VisitCounter() {
  const [count, setCount] = useState<number | null>(null);
  const [flipping, setFlipping] = useState(false);
  const flipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;

    let alreadyCounted = false;
    try {
      alreadyCounted = sessionStorage.getItem(SESSION_FLAG) === "1";
    } catch {
      // sessionStorage unavailable — just treat every load as uncounted;
      // worst case is a slightly inflated count, not a broken page
    }

    const url = alreadyCounted ? "/api/visits" : "/api/visits?count=true";

    fetch(url, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        setCount(data.count ?? null);
        if (!alreadyCounted && data.count !== null) {
          try {
            sessionStorage.setItem(SESSION_FLAG, "1");
          } catch {
            // no-op — just means next refresh this session may count again
          }
        }
      })
      .catch(() => {
        if (!cancelled) setCount(null);
      });

    return () => {
      cancelled = true;
      if (flipTimer.current) clearTimeout(flipTimer.current);
    };
  }, []);

  if (count === null) return null;

  function handleFlip() {
    setFlipping(true);
    if (flipTimer.current) clearTimeout(flipTimer.current);
    flipTimer.current = setTimeout(() => setFlipping(false), 550);
  }

  const note = `${count.toLocaleString()} ${count === 1 ? "reader" : "readers"} today. I see you.`;

  return (
    <div className="fixed bottom-0 right-6 z-40">
      <NoteTrigger
        note={note}
        position="top-right"
        accentColor="var(--coral)"
        onReveal={handleFlip}
        className={`counter-tab ${flipping ? "counter-tab--flip" : ""}`}
      >
        <span aria-hidden>👀</span>
      </NoteTrigger>
    </div>
  );
}

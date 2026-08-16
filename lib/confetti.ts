import confetti from "canvas-confetti";

const BRAND_COLORS = ["#FFC53D", "#FF4757", "#16A672", "#7C5CFC"];

/** A small, tasteful burst originating from a clicked element — used to
 * mark the moment someone actually hits "Apply", not sprinkled everywhere. */
export function burstFrom(el: HTMLElement) {
  if (typeof window === "undefined") return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  const rect = el.getBoundingClientRect();
  const origin = {
    x: (rect.left + rect.width / 2) / window.innerWidth,
    y: (rect.top + rect.height / 2) / window.innerHeight,
  };

  confetti({
    particleCount: 36,
    spread: 55,
    startVelocity: 28,
    gravity: 1.1,
    scalar: 0.75,
    ticks: 150,
    colors: BRAND_COLORS,
    origin,
    zIndex: 9999,
    disableForReducedMotion: true,
  });
}

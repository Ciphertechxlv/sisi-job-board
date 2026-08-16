// The site's 7 note easter eggs. Each lives at its own single-tap spot —
// deliberately not a rotating pool, so each one reads like a specific,
// intentional thing left for her to find rather than a quote generator.
// Tone is mixed on purpose: some encouraging, one openly romantic, a
// couple just playful about the site itself.

export const NOTES = {
  /** the "VOL. 01" badge, top right of the masthead */
  vol: "this issue's dedicated to you, Sisi.",
  /** the footer's ✦ */
  footer: "go get it. I mean it.",
  /** the "SISI'S" kicker above the headline */
  kicker: "I'd hire you in a heartbeat if it was up to me.",
  /** any ✦ in the scrolling role ticker */
  ticker: "made a wish on this one. it was for you.",
  /** the "LAGOS, NIGERIA · LIVE" status tag */
  liveTag: "Lagos raised you well. it shows.",
  /** the "last refreshed HH:MM" timestamp */
  refreshed: "refreshed for the hundredth time today. worth it.",
  /** auto-reveals once you scroll past the last job card — no tap needed */
  endOfFeed: "that's everything for now. more tomorrow — and you'll be ready.",
} as const;

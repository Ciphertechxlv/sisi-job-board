// Sisi's Wanted Board — source configuration
//
// Philosophy: the site exists to surface real, live job postings — not to
// hand back a pile of search links. Two source types feed it:
//
//  1. Direct ATS pulls — companies whose applicant-tracking system exposes a
//     public JSON feed we can call live, server-side, on every page load.
//     Right now that's Forward by Anakle (SmartRecruiters) and Kuda
//     (Workable). This is the most direct signal there is: it's their own
//     board, unfiltered by any search index.
//  2. The live feed — three Nigerian job boards (Jobberman, MyJobMag, Fuzu)
//     that all render their category/location search pages as plain
//     server-rendered HTML (no login, no JS wall) for browsing, so they can
//     each be parsed live, on every visit, for genuinely open Lagos roles
//     across every kind of company that looks like Sisi's dream list:
//     agencies, media brands, FMCG, fintech, drinks, beauty — not just the
//     seven she named, but the whole genre they represent.
//
// If a company doesn't have a public ATS feed (most don't — Coca-Cola,
// Jameson, Darling Hair, 21Mag, etc. all sit behind platforms that block
// this), it simply isn't force-fit into a card. The seven companies are a
// taste, not a whitelist.

export type FetchStrategy = "smartrecruiters" | "workable";

export type RoleKey =
  | "brand-marketing"
  | "advertising"
  | "creative-writing"
  | "copywriting"
  | "digital-marketing"
  | "graduate-trainee";

export const ROLES: { key: RoleKey; label: string; keywords: string[] }[] = [
  {
    key: "brand-marketing",
    label: "Brand Marketing",
    keywords: ["brand", "marketing manager", "brand manager", "brand strategist", "brand executive"],
  },
  {
    key: "advertising",
    label: "Advertising",
    keywords: ["advertising", "media planner", "account executive", "ad ops", "account manager"],
  },
  {
    key: "creative-writing",
    label: "Creative Writing",
    keywords: ["creative writer", "content writer", "storyteller", "scriptwriter", "content creator"],
  },
  {
    key: "copywriting",
    label: "Copywriting",
    keywords: ["copywriter", "copy editor", "copywriting", "content strategist", "content lead"],
  },
  {
    key: "digital-marketing",
    label: "Digital Marketing",
    keywords: ["digital marketing", "social media", "seo", "performance marketing", "growth marketing", "digital marketer"],
  },
  {
    key: "graduate-trainee",
    label: "Graduate Trainee",
    keywords: [], // scoped entirely by Jobberman's own experience=graduate-trainee filter
  },
];

/**
 * Live feed sources. Each is a real, verified, server-rendered listing site
 * (confirmed by fetching real pages and checking their markup) — not a
 * guess. Every source gets its own role→URL map, its own link pattern for
 * spotting individual job postings, and its own base URL.
 */
export interface FeedSource {
  id: "jobberman" | "myjobmag" | "fuzu";
  label: string;
  baseUrl: string;
  /** matches the href of an individual job-posting link on this site */
  linkPattern: RegExp;
  /** optional cleanup for anchor text that includes extra suffix noise */
  cleanTitle?: (raw: string) => string;
  /** note shown next to results from this source, if anything is unusual */
  caveat?: string;
  roleSources: Record<RoleKey, string[]>;
}

export const FEED_SOURCES: FeedSource[] = [
  {
    id: "jobberman",
    label: "Jobberman",
    baseUrl: "https://www.jobberman.com",
    linkPattern: /\/listings\//,
    roleSources: {
      "brand-marketing": [
        "https://www.jobberman.com/jobs/marketing-communications/lagos",
        "https://www.jobberman.com/jobs/marketing-communications/lagos?page=2",
      ],
      advertising: [
        "https://www.jobberman.com/jobs/advertising-media-communications/lagos",
        "https://www.jobberman.com/jobs/marketing-communications/lagos",
      ],
      "creative-writing": [
        "https://www.jobberman.com/jobs/creative-design/lagos",
        "https://www.jobberman.com/jobs/creative-design/lagos?page=2",
      ],
      copywriting: [
        "https://www.jobberman.com/jobs/creative-design/lagos",
        "https://www.jobberman.com/jobs/marketing-communications/lagos",
      ],
      "digital-marketing": [
        "https://www.jobberman.com/jobs/marketing-communications/lagos",
        "https://www.jobberman.com/jobs/marketing-communications/lagos?page=2",
      ],
      "graduate-trainee": [
        "https://www.jobberman.com/jobs/lagos?experience=graduate-trainee",
        "https://www.jobberman.com/jobs/lagos?experience=graduate-trainee&page=2",
      ],
    },
  },
  {
    id: "myjobmag",
    label: "MyJobMag",
    baseUrl: "https://www.myjobmag.com",
    linkPattern: /^\/job\//,
    cleanTitle: (raw) => raw.replace(/\s+at\s+.+$/i, "").trim(),
    roleSources: {
      "brand-marketing": [
        "https://www.myjobmag.com/cp/marketing-jobs-lagos",
        "https://www.myjobmag.com/cp/brand-manager-jobs-lagos",
      ],
      advertising: ["https://www.myjobmag.com/cp/media-jobs-lagos"],
      "creative-writing": ["https://www.myjobmag.com/cp/media-jobs-lagos"],
      copywriting: ["https://www.myjobmag.com/cp/media-jobs-lagos"],
      "digital-marketing": [
        "https://www.myjobmag.com/cp/digital-marketing-jobs-lagos",
      ],
      "graduate-trainee": ["https://www.myjobmag.com/cp/graduate-jobs-lagos"],
    },
  },
  {
    id: "fuzu",
    label: "Fuzu",
    baseUrl: "https://www.fuzu.com",
    linkPattern: /^\/nigeria\/jobs\//,
    caveat: "free Fuzu account needed to apply",
    roleSources: {
      "brand-marketing": ["https://www.fuzu.com/nigeria/job/sales-marketing-promotion/lagos"],
      advertising: ["https://www.fuzu.com/nigeria/job/sales-marketing-promotion/lagos"],
      "creative-writing": ["https://www.fuzu.com/nigeria/job/media-communications-languages/lagos"],
      copywriting: ["https://www.fuzu.com/nigeria/job/media-communications-languages/lagos"],
      "digital-marketing": ["https://www.fuzu.com/nigeria/job/sales-marketing-promotion/lagos"],
      "graduate-trainee": [],
    },
  },
];

/** Union of every source URL across every source, for the "Everything" view. */
export const ALL_FEED_URLS = Array.from(
  new Set(FEED_SOURCES.flatMap((s) => Object.values(s.roleSources).flat()))
);

export interface DirectSource {
  id: string;
  name: string;
  blurb: string;
  color: string;
  strategy: FetchStrategy;
  atsSlug: string;
  careersUrl: string;
}

/** Companies with a genuine, publicly pollable live board. */
export const DIRECT_SOURCES: DirectSource[] = [
  {
    id: "anakle",
    name: "Forward by Anakle",
    blurb: "Digital agency crafting brand campaigns across Africa",
    color: "#16A672",
    strategy: "smartrecruiters",
    atsSlug: "Anakle",
    careersUrl: "https://jobs.smartrecruiters.com/Anakle",
  },
  {
    id: "kuda",
    name: "Kuda",
    blurb: "Africa's digital bank, brand & growth teams",
    color: "#FFC53D",
    strategy: "workable",
    atsSlug: "kuda",
    careersUrl: "https://www.kuda.com/careers/",
  },
];


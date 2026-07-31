// Sisi's Wanted Board — source configuration
// Every company is one of three fetch strategies:
//  - "smartrecruiters" / "workable" / "greenhouse": public ATS JSON APIs we can
//     call live, server-side, on every page load (genuinely real-time).
//  - "html": best-effort fetch + heuristic parse of a normal web page. Works
//     for simple sites, silently falls back to search links if the markup
//     doesn't match (JS-rendered pages, layout changes, blocks, etc).
//  - "search-only": companies whose hiring lives behind a platform we can't
//     reliably poll (Workday, LinkedIn-only, agency ATS with no public API).
//     These always resolve to fresh, pre-filtered search links instead.

export type FetchStrategy =
  | "smartrecruiters"
  | "workable"
  | "greenhouse"
  | "html"
  | "search-only";

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
    keywords: ["brand", "marketing manager", "brand manager", "brand strategist"],
  },
  {
    key: "advertising",
    label: "Advertising",
    keywords: ["advertising", "media planner", "account executive", "ad ops"],
  },
  {
    key: "creative-writing",
    label: "Creative Writing",
    keywords: ["creative writer", "content writer", "storyteller", "scriptwriter"],
  },
  {
    key: "copywriting",
    label: "Copywriting",
    keywords: ["copywriter", "copy editor", "copy writing", "content strategist"],
  },
  {
    key: "digital-marketing",
    label: "Digital Marketing",
    keywords: ["digital marketing", "social media", "seo", "performance marketing", "growth marketing"],
  },
  {
    key: "graduate-trainee",
    label: "Graduate Trainee",
    keywords: ["graduate trainee", "graduate programme", "graduate program", "entry level", "nysc"],
  },
];

export interface CompanySource {
  id: string;
  name: string;
  blurb: string;
  color: string; // tailwind-safe hex used for the company's tag/accent
  strategy: FetchStrategy;
  // For ATS strategies: the company/org slug on that platform
  atsSlug?: string;
  // Direct careers page to link out to
  careersUrl: string;
  // Pre-built search fallbacks (Google + LinkedIn + Jobberman), filled at runtime
}

export const DREAM_COMPANIES: CompanySource[] = [
  {
    id: "zikoko",
    name: "Zikoko",
    blurb: "Big Cabal Media's culture & entertainment newsroom",
    color: "#FF4757",
    strategy: "html",
    careersUrl: "https://www.zikoko.com/tag/jobs/",
  },
  {
    id: "21mag",
    name: "21Mag",
    blurb: "Independent Nigerian culture & lifestyle magazine",
    color: "#7C5CFC",
    strategy: "search-only",
    careersUrl: "https://21mag.ng",
  },
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
    id: "cocacola",
    name: "Coca-Cola",
    blurb: "Global beverage brand, Nigeria commercial team",
    color: "#FF4757",
    strategy: "search-only",
    careersUrl: "https://www.coca-colacompany.com/careers",
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
  {
    id: "darling",
    name: "Darling Hair",
    blurb: "Hair & beauty brand under Hairforce/HFC Group Nigeria",
    color: "#FF8AB0",
    strategy: "search-only",
    careersUrl: "https://www.darlinghairbeauty.com",
  },
  {
    id: "jameson",
    name: "Jameson",
    blurb: "Pernod Ricard's whiskey brand, Nigeria marketing team",
    color: "#16A672",
    strategy: "search-only",
    careersUrl: "https://www.pernod-ricard.com/en/careers",
  },
];

export function buildSearchLinks(companyName: string, roleQuery: string) {
  const q = encodeURIComponent(`${companyName} ${roleQuery} Lagos Nigeria`);
  return {
    linkedin: `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(
      `${companyName} ${roleQuery}`
    )}&location=Lagos%2C%20Nigeria`,
    google: `https://www.google.com/search?q=${q}+job+opening`,
    jobberman: `https://www.jobberman.com/jobs?q=${encodeURIComponent(
      `${companyName} ${roleQuery}`
    )}`,
  };
}

export function buildGradTraineeLinks() {
  const roleQuery = "graduate trainee";
  return {
    linkedin: `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(
      roleQuery
    )}&location=Lagos%2C%20Nigeria`,
    jobberman: `https://www.jobberman.com/jobs?q=${encodeURIComponent(
      roleQuery
    )}&l=Lagos`,
    myjobmag: `https://www.myjobmag.com/jobs-search?q=${encodeURIComponent(
      roleQuery
    )}&location=lagos`,
    fuzu: `https://www.fuzu.com/nigeria/jobs?q=${encodeURIComponent(roleQuery)}`,
  };
}

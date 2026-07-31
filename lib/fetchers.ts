import * as cheerio from "cheerio";
import { CompanySource, buildSearchLinks } from "./companies";
import { CompanyResult, Posting } from "./types";

interface SmartRecruitersPosting {
  id: string;
  name: string;
  releasedDate?: string;
  location?: { city?: string; country?: string };
}

interface WorkablePosting {
  title: string;
  url?: string;
  shortcode?: string;
  published_on?: string;
  location?: { city?: string; country?: string };
}

interface GreenhousePosting {
  title: string;
  absolute_url: string;
  updated_at?: string;
  location?: { name?: string };
}

const TIMEOUT_MS = 8000;
const UA =
  "Mozilla/5.0 (compatible; SisiWantedBoard/1.0; +https://vercel.com) job-board-aggregator";

async function fetchWithTimeout(url: string, init?: RequestInit) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: { "User-Agent": UA, Accept: "application/json, text/html", ...(init?.headers || {}) },
      // Never let Next.js cache a "real-time" job board response
      cache: "no-store",
    });
    return res;
  } finally {
    clearTimeout(timer);
  }
}

function matchesRole(text: string, keywords: string[]) {
  const t = text.toLowerCase();
  return keywords.some((k) => t.includes(k.toLowerCase()));
}

// ---- SmartRecruiters (public JSON API, no auth needed) ----
async function fetchSmartRecruiters(slug: string): Promise<Posting[]> {
  const res = await fetchWithTimeout(
    `https://api.smartrecruiters.com/v1/companies/${slug}/postings?limit=100`
  );
  if (!res.ok) throw new Error(`SmartRecruiters ${res.status}`);
  const data = await res.json();
  const items: SmartRecruitersPosting[] = data?.content ?? [];
  return items.map((p) => ({
    title: p.name,
    url: `https://jobs.smartrecruiters.com/${slug}/${p.id}`,
    location: p.location?.city
      ? `${p.location.city}${p.location.country ? ", " + p.location.country : ""}`
      : undefined,
    postedAt: p.releasedDate,
  }));
}

// ---- Workable (public widget JSON API) ----
async function fetchWorkable(slug: string): Promise<Posting[]> {
  const res = await fetchWithTimeout(
    `https://apply.workable.com/api/v1/widget/accounts/${slug}?details=true`
  );
  if (!res.ok) throw new Error(`Workable ${res.status}`);
  const data = await res.json();
  const items: WorkablePosting[] = data?.jobs ?? [];
  return items.map((p) => ({
    title: p.title,
    url: p.url || `https://apply.workable.com/${slug}/j/${p.shortcode}/`,
    location: p.location?.city
      ? `${p.location.city}${p.location.country ? ", " + p.location.country : ""}`
      : p.location?.country,
    postedAt: p.published_on,
  }));
}

// ---- Greenhouse (public boards API) ----
async function fetchGreenhouse(slug: string): Promise<Posting[]> {
  const res = await fetchWithTimeout(
    `https://boards-api.greenhouse.io/v1/boards/${slug}/jobs`
  );
  if (!res.ok) throw new Error(`Greenhouse ${res.status}`);
  const data = await res.json();
  const items: GreenhousePosting[] = data?.jobs ?? [];
  return items.map((p) => ({
    title: p.title,
    url: p.absolute_url,
    location: p.location?.name,
    postedAt: p.updated_at,
  }));
}

// ---- Generic best-effort HTML heuristic parse ----
async function fetchHtmlHeuristic(url: string): Promise<Posting[]> {
  const res = await fetchWithTimeout(url);
  if (!res.ok) throw new Error(`HTML fetch ${res.status}`);
  const html = await res.text();
  const $ = cheerio.load(html);
  const postings: Posting[] = [];
  const seen = new Set<string>();

  $("a").each((_, el) => {
    const href = $(el).attr("href");
    const text = $(el).text().trim();
    if (!href || !text || text.length < 4 || text.length > 120) return;
    const looksLikeJob =
      /job|career|vacan|hiring|apply|role|position/i.test(href) ||
      /writer|marketing|manager|editor|copywriter|advertising|trainee|associate|executive|officer/i.test(
        text
      );
    if (!looksLikeJob) return;
    const absolute = href.startsWith("http") ? href : new URL(href, url).toString();
    if (seen.has(absolute)) return;
    seen.add(absolute);
    postings.push({ title: text, url: absolute });
  });

  return postings.slice(0, 40);
}

async function fetchPostingsForCompany(company: CompanySource): Promise<Posting[]> {
  switch (company.strategy) {
    case "smartrecruiters":
      return fetchSmartRecruiters(company.atsSlug!);
    case "workable":
      return fetchWorkable(company.atsSlug!);
    case "greenhouse":
      return fetchGreenhouse(company.atsSlug!);
    case "html":
      return fetchHtmlHeuristic(company.careersUrl);
    case "search-only":
    default:
      return [];
  }
}

export async function resolveCompany(
  company: CompanySource,
  roleKeywords: string[],
  roleQuery: string
): Promise<CompanyResult> {
  const checkedAt = new Date().toISOString();
  const searchLinks = buildSearchLinks(company.name, roleQuery);
  const base: Omit<CompanyResult, "status" | "postings"> = {
    id: company.id,
    name: company.name,
    blurb: company.blurb,
    color: company.color,
    careersUrl: company.careersUrl,
    searchLinks,
    checkedAt,
  };

  if (company.strategy === "search-only") {
    return { ...base, status: "search-only", postings: [] };
  }

  try {
    const all = await fetchPostingsForCompany(company);
    const filtered = roleKeywords.length
      ? all.filter((p) => matchesRole(p.title, roleKeywords))
      : all;
    return {
      ...base,
      status: filtered.length ? "live" : "empty",
      postings: filtered.slice(0, 12),
    };
  } catch {
    return { ...base, status: "error", postings: [] };
  }
}

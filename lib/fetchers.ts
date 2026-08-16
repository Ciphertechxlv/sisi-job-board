import * as cheerio from "cheerio";
import {
  DIRECT_SOURCES,
  DirectSource,
  FEED_SOURCES,
  FeedSource,
  ROLES,
  RoleKey,
} from "./companies";
import { DirectPullResult, Posting } from "./types";

const TIMEOUT_MS = 9000;
const UA =
  "Mozilla/5.0 (compatible; SisiWantedBoard/1.0; job board aggregator for personal use)";

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

async function fetchWithTimeout(url: string) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": UA, Accept: "application/json, text/html" },
      cache: "no-store",
    });
  } finally {
    clearTimeout(timer);
  }
}

function matchesKeywords(text: string, keywords: string[]) {
  if (keywords.length === 0) return true;
  const t = text.toLowerCase();
  return keywords.some((k) => t.includes(k.toLowerCase()));
}

// ---------------------------------------------------------------------
// Direct ATS pulls — Anakle (SmartRecruiters) & Kuda (Workable)
// ---------------------------------------------------------------------

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
    source: "Forward by Anakle" as const,
  }));
}

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
    source: "Kuda" as const,
  }));
}

async function fetchDirectSource(source: DirectSource): Promise<Posting[]> {
  return source.strategy === "smartrecruiters"
    ? fetchSmartRecruiters(source.atsSlug)
    : fetchWorkable(source.atsSlug);
}

export async function resolveDirectPulls(
  roleKey: RoleKey | null
): Promise<DirectPullResult[]> {
  const role = ROLES.find((r) => r.key === roleKey);
  const keywords = role ? role.keywords : [];

  return Promise.all(
    DIRECT_SOURCES.map(async (source): Promise<DirectPullResult> => {
      const base = {
        id: source.id,
        name: source.name,
        blurb: source.blurb,
        color: source.color,
        careersUrl: source.careersUrl,
      };
      try {
        const all = await fetchDirectSource(source);
        const filtered = keywords.length
          ? all.filter((p) => matchesKeywords(p.title, keywords))
          : all;
        return {
          ...base,
          status: filtered.length ? "live" : "empty",
          postings: filtered.slice(0, 8),
        };
      } catch {
        return { ...base, status: "error", postings: [] };
      }
    })
  );
}

// ---------------------------------------------------------------------
// The live feed — a generalized scraper shared across Jobberman, MyJobMag
// and Fuzu. All three render their listing pages as plain server HTML with
// a consistent shape: an anchor to the individual posting, sitting inside a
// card that also holds the company name and a recognizable location word.
// Rather than hard-code CSS classes (which break the moment any of these
// sites redesigns), this walks the DOM looking for that shape directly.
// ---------------------------------------------------------------------

const LOCATION_WORDS =
  /(Lagos|Abuja|Remote \(Work From Home\)|Port Harcourt & Rivers State|Rest of Nigeria|Nigeria)/;

async function fetchSourcePage(
  url: string,
  source: FeedSource
): Promise<Posting[]> {
  const res = await fetchWithTimeout(url);
  if (!res.ok) throw new Error(`${source.label} ${res.status}`);
  const html = await res.text();
  const $ = cheerio.load(html);
  const postings: Posting[] = [];
  const seen = new Set<string>();

  const isJobLink = (href: string | undefined) =>
    !!href && source.linkPattern.test(href);

  $("a").each((_, el) => {
    const $a = $(el);
    const href = $a.attr("href");
    if (!isJobLink(href)) return;

    let title = ($a.attr("title") || $a.text()).trim();
    if (!title || title.length < 3) return;
    if (source.cleanTitle) title = source.cleanTitle(title);
    if (!title || seen.has(href!)) return;
    seen.add(href!);

    const fullUrl = href!.startsWith("http") ? href! : `${source.baseUrl}${href}`;

    // Walk up the DOM looking for the smallest ancestor that contains
    // exactly one job-listing link (this one — so we haven't bled into a
    // sibling card) and a recognizable location word. That's our card
    // boundary. If we never find one, we still keep the posting — just
    // without company/location — rather than risk grabbing text from the
    // next card over.
    let node = $a.parent();
    let hops = 0;
    let company: string | undefined;
    let location: string | undefined;

    while (hops < 8 && node.length) {
      const linkCount = node.find("a").filter((_, a2) => isJobLink($(a2).attr("href"))).length;
      if (linkCount > 1) break;
      const text = node.text().replace(/\s+/g, " ").trim();
      const locMatch = text.match(LOCATION_WORDS);
      if (linkCount === 1 && locMatch && text.length > title.length + 10) {
        // The title's raw DOM text may differ slightly from our (possibly
        // cleaned) `title` var, so locate it within the container text
        // rather than assuming it's a prefix — company can legitimately
        // sit either before the title (Fuzu) or after it (Jobberman,
        // MyJobMag), and we don't want to concatenate the wrong one in.
        const titleIdx = text.indexOf(title);
        const before = titleIdx > 0 ? text.slice(0, titleIdx).trim() : "";
        const afterFull =
          titleIdx >= 0 ? text.slice(titleIdx + title.length).trim() : text;
        const afterLocMatch = afterFull.match(LOCATION_WORDS);

        if (afterLocMatch && afterLocMatch.index !== undefined) {
          location = afterLocMatch[0];
          const afterCandidate = afterFull
            .slice(0, afterLocMatch.index)
            .trim()
            .replace(/^[-–|]\s*/, "");
          if (afterCandidate.length > 1 && afterCandidate.length < 70) {
            company = afterCandidate
              .replace(/^(at|by)\s+/i, "")
              .replace(/\s+\d{1,2}\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*$/i, "")
              .trim();
            if (company.length === 0) company = undefined;
          } else if (before.length > 1 && before.length < 70) {
            company = before;
          }
        } else {
          location = locMatch[0];
          if (before.length > 1 && before.length < 70) company = before;
        }
        break;
      }
      node = node.parent();
      hops++;
    }

    postings.push({
      title,
      url: fullUrl,
      company,
      location,
      source: source.label as Posting["source"],
      caveat: source.caveat,
    });
  });

  return postings;
}

export async function resolveRoleFeed(
  roleKey: RoleKey | null
): Promise<{ postings: Posting[]; status: "live" | "error" }> {
  const role = ROLES.find((r) => r.key === roleKey);

  const jobs: { url: string; source: FeedSource }[] = role
    ? FEED_SOURCES.flatMap((source) =>
        source.roleSources[role.key].map((url) => ({ url, source }))
      )
    : FEED_SOURCES.flatMap((source) =>
        Array.from(new Set(Object.values(source.roleSources).flat())).map(
          (url) => ({ url, source })
        )
      );

  const settled = await Promise.allSettled(
    jobs.map((j) => fetchSourcePage(j.url, j.source))
  );
  const ok = settled.filter(
    (s): s is PromiseFulfilledResult<Posting[]> => s.status === "fulfilled"
  );

  if (ok.length === 0) {
    return { postings: [], status: "error" };
  }

  const merged = new Map<string, Posting>();
  for (const r of ok) {
    for (const p of r.value) {
      if (!merged.has(p.url)) merged.set(p.url, p);
    }
  }

  let postings = Array.from(merged.values());

  // Graduate trainee is already scoped by each source's own experience
  // filter; everything else needs a keyword pass against the broader
  // category feed.
  if (role && role.keywords.length > 0) {
    postings = postings.filter((p) =>
      matchesKeywords(`${p.title} ${p.company ?? ""}`, role.keywords)
    );
  }

  return { postings: postings.slice(0, 90), status: "live" };
}

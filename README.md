# Sisi's Wanted Board

A live job board for brand marketing, advertising, creative writing,
copywriting, digital marketing and graduate trainee roles in Lagos, Nigeria.

Every card on this site is a direct link to a real, currently-open posting.
Nothing here is a search-engine link-out.

## How it actually finds jobs

**Live feed — three Nigerian job boards, scraped fresh on every visit:**

| Source | What it is |
|---|---|
| Jobberman | Nigeria's largest job board |
| MyJobMag | Large, well-established Nigerian job board with category + location search pages |
| Fuzu | Pan-African job platform; postings are fully visible without an account, but applying does require a free Fuzu sign-in — this is noted directly on those cards |

All three render their category/location listing pages as plain server HTML
(no login wall to browse), so the site parses them live and merges the
results, filtered to Lagos and to whichever role tab is selected.

**Direct ATS pulls — 2 of the 7 dream-list companies:**

Only **Forward by Anakle** (SmartRecruiters) and **Kuda** (Workable) have a
public, pollable hiring feed of their own, so those two get a dedicated
"Straight From Their Boards" section — pulled directly from their own
systems, not a search index. The other five (Zikoko, 21Mag, Coca-Cola,
Darling Hair, Jameson) don't expose anything scrapeable — Coca-Cola and
Jameson sit behind Workday, the others don't run a structured board at all —
so rather than fake a live card for them, the site leans on the three-board
feed to surface real openings across that same genre of company (agencies,
culture/media, FMCG, fintech, drinks, beauty) in Lagos. If any of the five
ever post through Jobberman, MyJobMag, or Fuzu, they'll show up there
naturally.

If any source is briefly unreachable, its cards say so honestly and ask you
to refresh — never a fallback to a search link.

## Light / dark mode

Toggle in the top right. Defaults to dark. Choice is remembered via
`localStorage`.

## Easter eggs

Ten of them: 7 single-tap notes, 3 small animations. All single-tap by
design — no double or triple clicking, since this gets viewed on mobile too.

**The 7 notes** — copy for all of them lives in `lib/easterEggs.ts`
(`NOTES`), each rendered via the shared `NoteTrigger` component:

| Spot | Trigger |
|---|---|
| "VOL." badge, top right | tap |
| Footer's ✦ | tap |
| "SISI'S" kicker above the headline | tap |
| The scrolling role ticker | tap anywhere on the bar |
| "LAGOS, NIGERIA · LIVE" tag | tap |
| "last refreshed HH:MM" timestamp | tap |
| End of the job feed | no tap needed — reveals itself as you scroll past |

The ticker note is a special case: rather than a tiny star that's hard to
hit while it's animating (especially with a finger on mobile), tapping
*anywhere* on the ticker bar reveals it — and the scroll pauses for the few
seconds the note is showing, then resumes.

**The 3 animations:**

- **Confetti on "Apply"** — a small, brand-colored burst from whichever job
  card you click (`lib/confetti.ts`). Respects `prefers-reduced-motion`.
- **A little danfo bus** drives across a strip above the footer once you
  scroll to the bottom (`components/DanfoBus.tsx`).
- **A small flourish on the theme toggle** — the icon spins in and two tiny
  stars twinkle every time you switch modes.

## Daily visit counter

Tucked into the footer: "N readers today." Backed by Redis so the number is
real and shared across everyone who visits, and reset automatically every
day — the counter key is namespaced by today's date in Lagos time, so a new
day just starts a fresh key at 1 with no cron job needed.

**This is the one feature that needs a one-time setup step** (everything
else on this site works with zero configuration):

1. In the Vercel dashboard, open this project → **Storage** tab
2. **Create Database** → choose **Upstash for Redis** (or search
   "Upstash" in the Marketplace tab) → follow the prompts to create a free
   database and connect it to this project — this automatically sets the
   required environment variables (`KV_REST_API_URL` / `KV_REST_API_TOKEN`,
   or `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` — the code
   checks for either naming)
3. Redeploy (Vercel usually does this automatically after connecting a new
   integration)

If you skip this, the site still works perfectly — the counter component
just detects there's nothing to connect to and quietly doesn't render,
rather than showing a broken "0" or an error.

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000. The visit counter won't appear locally unless
you also add a `.env.local` with the same env vars (`vercel env pull
.env.local` after connecting the database will do this for you).

## Deploying to Vercel

1. Push this folder to a GitHub repo, or deploy straight from your machine
   with the [Vercel CLI](https://vercel.com/docs/cli):
   ```bash
   npm install -g vercel
   cd sisi-job-board
   vercel --prod
   ```
   (The CLI route is more reliable than GitHub's drag-and-drop uploader,
   which can leave stray old files behind across uploads.)
2. If using GitHub: import the repo at https://vercel.com/new.
3. No environment variables are required.

## Extending it

Everything about roles and sources lives in `lib/companies.ts`:

- `ROLES` — the six role filters and the keywords used to match feed
  listings against them.
- `FEED_SOURCES` — the three job boards. Each has a `roleSources` map of
  which URLs feed which role, a `linkPattern` regex that identifies an
  individual job-posting link on that site, and an optional `cleanTitle`
  function for sites whose link text includes extra noise (MyJobMag's
  "Title at Company" pattern, for instance).
- `DIRECT_SOURCES` — companies with a genuine live ATS feed. To add one,
  check their careers page URL — if it's on SmartRecruiters, Workable, or a
  similar platform with a public API, the slug is usually right there in
  the URL.

The scraper (`lib/fetchers.ts`) is written defensively: for each source it
looks for links matching that source's `linkPattern`, then walks up the DOM
to find the smallest ancestor containing exactly one such link plus a
recognizable location word — that's the card boundary — rather than relying
on CSS class names, which change on every redesign. If a source's markup
changes enough to break this, cards from it will simply show fewer results
(or omit company/location) rather than display wrong data.

### Adding a fourth board

To add another Nigerian job board:
1. Confirm it renders listing pages as server-side HTML (view source in a
   browser — if you can see job titles in the raw HTML without running any
   JavaScript, it's scrapeable this way).
2. Find its category/location URL pattern (e.g. `/jobs/{category}/lagos`).
3. Find the URL pattern for an individual job posting link, and write a
   regex for it.
4. Add an entry to `FEED_SOURCES` in `lib/companies.ts`.

X/Twitter was considered and intentionally left out — its API now requires
a paid tier (~$200+/month for search access) and the site itself blocks
unauthenticated scraping, so it can't be pulled from live and for free the
way the other three can.

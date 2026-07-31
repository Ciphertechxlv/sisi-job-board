# Sisi's Wanted Board

A live job board for brand marketing, advertising, creative writing,
copywriting, digital marketing and graduate trainee roles in Lagos, Nigeria.

This is built to surface **real, currently-open listings** — every card is a
direct link to an actual job posting. Nothing on the page is a search-engine
link-out.

## How it actually finds jobs

| Source | What it is | Type |
|---|---|---|
| Jobberman | Nigeria's largest job board. Its category/location search pages are plain server-rendered HTML, so the site parses them live, on every visit, filtered to Lagos and to each role. | Live scrape |
| Forward by Anakle | Their public SmartRecruiters hiring board | Live API pull |
| Kuda | Their public Workable hiring board | Live API pull |

The seven companies from the original brief (Zikoko, 21Mag, Forward by
Anakle, Coca-Cola, Kuda, Darling Hair, Jameson) were the taste-test for what
kind of roles and companies to track — agencies, culture/media brands, FMCG,
fintech, drinks, beauty. Most of them don't expose a public feed of their own
(Coca-Cola and Jameson sit behind Workday, Darling Hair and 21Mag don't
publish a structured board at all), so rather than fake a "live" card for
them, the site leans on Jobberman to surface real openings across that whole
genre of company in Lagos — which will include those brands whenever they do
post there, plus everything else that fits the brief.

If Jobberman or a direct board is briefly unreachable, the card says so
honestly and asks you to refresh — it never falls back to a search link.

## Light / dark mode

Toggle in the top right. Defaults to dark (the masthead look). The choice is
remembered in the browser via `localStorage`.

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Deploying to Vercel

1. Push this folder to a GitHub repo (or run `vercel` from inside it with the
   [Vercel CLI](https://vercel.com/docs/cli)).
2. Import the repo at https://vercel.com/new.
3. No environment variables are required — click Deploy.
4. Share the resulting `*.vercel.app` link.

## Extending it

Everything about roles and sources lives in `lib/companies.ts`:

- `ROLES` — the six role filters and the keywords used to match Jobberman
  listings against them.
- `JOBBERMAN_ROLE_SOURCES` — which Jobberman category/location URLs feed
  each role. Add more categories or locations here.
- `DIRECT_SOURCES` — companies with a genuine live ATS feed. To add one,
  find their careers page URL — if it's on SmartRecruiters, Workable, or a
  similar platform with a public API, the slug is usually right there in the
  URL. Add an entry with `strategy: "smartrecruiters"` or `"workable"`.

The Jobberman parser itself (`lib/fetchers.ts`) is written defensively: it
looks for `/listings/` links and walks up the DOM to find each card's
boundary rather than relying on specific CSS class names, so small markup
changes on their end shouldn't break it. If it ever does break, cards will
simply show fewer results with company/location omitted rather than showing
wrong data — worth an occasional check that it's still finding matches.

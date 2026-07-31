# Sisi's Wanted Board

A live job board for brand marketing, advertising, creative writing,
copywriting, digital marketing and graduate trainee roles in Lagos, Nigeria —
built around Sisi's dream companies.

## How sourcing works

Every check happens fresh, server-side, on each page load — nothing is
pre-baked or cached.

| Company | How it's checked |
|---|---|
| Forward by Anakle | **Live pull** from their public SmartRecruiters board |
| Kuda | **Live pull** from their public Workable board |
| Zikoko | **Best-effort live pull**, parsing their jobs page directly |
| 21Mag, Coca-Cola, Darling Hair, Jameson | **Instant pre-filtered search links** (LinkedIn, Jobberman, careers page) — these run on ATS platforms (Workday, LinkedIn-only hiring, etc.) that don't offer a reliable way to pull postings automatically, so the fastest honest option is a one-tap search that's always current |
| Graduate Trainee Radar | Pre-filtered search links across LinkedIn, Jobberman, MyJobMag and Fuzu, scoped to Lagos — covers programmes beyond the dream list too |

If a live pull ever fails (site down, markup changed, rate-limited) the card
automatically falls back to the same one-tap search links, so the board never
shows a dead end.

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

## Editing the dream list

Everything about companies, roles, and keyword matching lives in
`lib/companies.ts`. To add a company:

```ts
{
  id: "unique-id",
  name: "Display Name",
  blurb: "One-line description",
  color: "#HEXCODE",
  strategy: "search-only", // or "smartrecruiters" / "workable" / "greenhouse" / "html"
  careersUrl: "https://company.com/careers",
}
```

If the company's ATS is SmartRecruiters, Workable, or Greenhouse (check their
careers page URL — it usually gives it away), set `atsSlug` to their
board slug and you'll get real live pulls for free.

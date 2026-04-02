# Technical Business Analyst Portfolio

A sleek, content-first portfolio built with Astro and TypeScript for a technical Business Analyst profile. The site is optimized for hiring managers first, with a strong narrative around implementations, integrations, data work, and practical AI.

## Stack

- Astro
- TypeScript
- Astro content collections
- Self-hosted variable fonts via Fontsource
- Static deployment on Vercel Hobby

## Routes

- `/` home page with positioning, featured work, GitHub highlights, writing, and contact CTA
- `/projects/` project index grouped by category
- `/projects/[slug]/` case study detail pages
- `/contact/` direct contact and social links

## Content Editing

- Update site-wide content in `/Users/ianwheeler/Repositories/codex-lab/src/data/site.ts`
- Add or edit case studies in `/Users/ianwheeler/Repositories/codex-lab/src/content/projects`
- Add or edit writing highlights in `/Users/ianwheeler/Repositories/codex-lab/src/content/writing`

## Local Setup

1. Install Node.js 20 or newer.
2. Install dependencies with `npm install`.
3. Run the dev server with `npm run dev`.
4. Build with `npm run build`.
5. Validate types and content with `npm run check`.

## Deployment

1. Push the repository to GitHub.
2. Import the repo into Vercel.
3. Keep the framework preset as Astro.
4. Set the production domain in `astro.config.mjs` by replacing `https://portfolio.vercel.app`.
5. Redeploy to refresh canonical URLs and sitemap output.

## Customization Notes

- Replace placeholder contact and social URLs in `/Users/ianwheeler/Repositories/codex-lab/src/data/site.ts`
- Update the default OG image in `/Users/ianwheeler/Repositories/codex-lab/public/og-image.svg` if you want branded sharing cards
- Add a resume or downloadable assets later if you decide to expand the contact funnel

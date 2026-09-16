# MyFavTool

A modern, clean directory website for curated web tools. Built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS** and **lucide-react**, and optimized for zero-cost deployment on **Vercel**.

## Features

- **Header navigation** — logo, Home / Categories / About links, search + GitHub icons, responsive mobile menu.
- **Hero section** — headline, subtitle, large centered search bar with inline icon, and action buttons.
- **Filter & sorting bar** — pill filters (All / Trending / New / Popular / Featured), category pills with counts, and a "Showing X of Y tools" counter.
- **Tool card grid** — responsive 1/2/3-column grid with logo, title, category badge, 2-line description, Featured pill, and a fully clickable card.
- **Category browsing** — grid of category cards with name, description and tool count.
- **Footer** — multi-column footer with branding, quick links, top categories and copyright.
- **Client-side search & filtering** — real-time text search across names, descriptions and categories, plus dynamic category/status filters and pagination — all without page reloads.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/
  layout.tsx            # Root layout (header + footer shell)
  page.tsx              # Home page (hero + browser + categories)
  globals.css           # Tailwind + design tokens
  categories/           # Category index + [slug] detail pages
  about/                # About page
components/
  site-header.tsx       # Sticky header + mobile nav
  site-footer.tsx       # Multi-column footer
  hero-search.tsx       # Hero + search bar
  directory-browser.tsx # Search / filters / pagination (client)
  tool-card.tsx         # Tool card
  category-card.tsx     # Category card
data/
  tools.json            # Tool data source
lib/
  tools.ts              # Data helpers
  types.ts              # TypeScript types
```

## Data

Tools live in `data/tools.json`. Each entry uses the shape:

```json
{
  "id": "1",
  "name": "Cursor",
  "slug": "cursor",
  "category": "Coding",
  "description": "…",
  "logo": "https://…",
  "url": "https://…",
  "featured": true,
  "dateAdded": "2026-08-28",
  "popularity": 98,
  "trending": true
}
```

Add, remove or edit entries there and the site updates automatically.

## Deploy to Vercel (zero cost)

1. Push this repository to GitHub.
2. In [Vercel](https://vercel.com), click **Add New → Project** and import the repo.
3. Vercel auto-detects Next.js — no configuration needed.
4. Deploy. The site is fully static-friendly and runs on Vercel's free (Hobby) plan.

## WhatsApp Number Checker

The WhatsApp checker validates the number format client-side, then calls a
server-side API route (`/api/check-whatsapp`) to determine whether the number
is actually registered on WhatsApp.

To enable the real WhatsApp lookup, add an **Abstract API** key:

1. Sign up for a free key at https://www.abstractapi.com/whatsapp-api
   (free tier: 100 lookups/month).
2. Add it as an environment variable:

   ```bash
   # local development
   echo "WHATSAPP_API_KEY=your_key_here" > .env.local

   # Vercel dashboard → Project → Settings → Environment Variables
   # Name: WHATSAPP_API_KEY  Value: your_key_here
   ```

Without a key, the tool gracefully falls back to format-only validation and
shows "could not determine" instead of a false positive.

## Scripts

```bash
npm run dev      # Start the dev server
npm run build    # Production build
npm run start    # Serve the production build
npm run lint     # Lint the project
```
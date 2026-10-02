# Huzaifa — Cinematic Portfolio

A premium, dark, cinematic portfolio for a photographer & videographer, built so the owner can
add new work **without ever touching the code**.

## Quick start

```bash
npm install
npm run dev        # → http://localhost:5173
```

Other commands:

```bash
npm run build          # production build into dist/
npm run preview        # serve the production build locally
npm run placeholders   # regenerate the demo placeholder images
```

## Where the content lives

**`public/content/portfolio.json`** — one file controls everything: hero, projects, showreel,
about, services, testimonials, social links. See **[CONTENT_GUIDE.md](CONTENT_GUIDE.md)** for
step-by-step instructions (adding projects, images, videos, YouTube/Vimeo links, CSV, …).

### The short version

- Drop photos in `public/images/<category>/` and videos in `public/videos/<category>/`.
- Name them after the project id (`wedding-003.jpg`, `wedding-003-2.jpg`, `wedding-003.mp4`)
  and they attach to that project automatically.
- Or list exact paths in `portfolio.json`. Or use YouTube/Vimeo links in `externalVideos`.
- `public/content/portfolio.csv` optionally adds projects from a spreadsheet (JSON wins on
  duplicate ids).

### How automatic file matching works

A small Vite plugin (`vite.config.js`) publishes `content/media-manifest.json` — a live index of
everything in `public/images` and `public/videos` (refreshed on every dev request, regenerated at
build). At runtime the site matches files to projects by filename prefix + category folder:

```
project id wedding-001  →  videos/weddings/wedding-001.mp4  ✔
                           images/weddings/wedding-001-2.jpg ✔ (gallery, in order)
                           videos/wedding-001.webm          ✔ (root folders also searched)
```

Missing media degrades gracefully: elegant placeholders, no broken images, video sections hide
themselves when there's nothing to play.

## Tech stack

- **React 19 + Vite 6** (JavaScript), **Tailwind CSS v4**, **Framer Motion**, **Lucide icons**,
  **Lenis** smooth scrolling, **react-router** for `/project/:id` pages.
- Features: cinematic hero (video/photo with parallax), filterable masonry gallery, hover video
  previews, fullscreen showreel & video players (YouTube/Vimeo/MP4), image lightbox with keyboard
  navigation, featured projects, services, testimonials, contact, custom cursor, magnetic buttons,
  scroll reveals, film-grain overlay, reduced-motion support, full mobile layout.

## Structure

```
public/
├── content/            ← portfolio.json (EDIT THIS), portfolio.csv
├── images/…            ← hero, portraits, weddings, events, fashion, products, commercial…
└── videos/…            ← showreel, weddings, events, fashion, commercial…
src/
├── components/         ← Navbar, Hero, SelectedWork, ProjectCard, Showreel, FeaturedProjects,
│                         About, Services, Testimonials, Contact, Footer, VideoPlayerModal,
│                         ImageLightbox, SmartImage, MagneticButton, CustomCursor, …
├── pages/              ← Home, ProjectDetail, NotFound
├── lib/                ← contentLoader (JSON+CSV), mediaResolver (auto file matching),
│                         videoUtils (YouTube/Vimeo), csv parser, smooth scroll
└── context/            ← ContentContext (loads content once, shares app-wide)
```

## Deployment

`npm run build` outputs a fully static `dist/`. Drop it on Vercel, Netlify or any static host —
`vercel.json` / `public/_redirects` already handle client-side routing for `/project/:id` links.

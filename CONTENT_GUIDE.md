# Content Guide — How to Update Your Portfolio (No Code Needed)

Everything on the website is driven by **one file**:

```
public/content/portfolio.json
```

Edit it in any text editor, save, and refresh the browser. You never need to touch React code,
unless you want to change the design itself.

> **TL;DR — add a new project**
> 1. Put photos in `public/images/<category>/` and videos in `public/videos/<category>/`.
> 2. Name files after the project id: `wedding-003.jpg`, `wedding-003-2.jpg`, `wedding-003.mp4`…
> 3. Add a small block to `projects` in `portfolio.json`. That's it — cover, gallery and videos
>    attach themselves automatically by filename.

---

## 1. File locations

```
public/
├── images/
│   ├── hero/          ← homepage background photo  (hero.jpg)
│   ├── showreel/      ← showreel poster            (showreel-poster.jpg)
│   ├── portraits/     ← your portrait + portrait projects
│   ├── weddings/
│   ├── events/
│   ├── fashion/
│   ├── commercial/
│   ├── products/
│   ├── travel/
│   ├── photography/
│   └── videography/
├── videos/
│   ├── showreel/      ← showreel.mp4 (big screen section) + hero.mp4 (homepage background)
│   ├── weddings/
│   ├── events/
│   ├── fashion/
│   └── commercial/
└── content/
    ├── portfolio.json   ← THE content file (primary)
    └── portfolio.csv    ← optional extra projects (see §9)
```

The folder names for projects don't have to match exactly — see §4. Use `.jpg / .png / .webp`
for images and `.mp4 / .webm` for videos.

---

## 2. How to add a project

Open `public/content/portfolio.json`, find the `"projects": [ ... ]` list and add a block like:

```json
{
  "id": "wedding-003",
  "title": "Ayesha & Imran",
  "category": "Weddings",
  "location": "Multan",
  "year": "2026",
  "services": ["Wedding Photography", "Wedding Film"],
  "coverImage": "",
  "images": [],
  "videos": [],
  "externalVideos": [],
  "description": "A rooftop mehndi, a rainy baraat and the calmest bride I've ever filmed."
}
```

Rules of thumb:

- **`id` must be unique** — it becomes the web address: `/project/wedding-003`. Use lowercase
  letters, numbers and dashes.
- **`category`** should be one of your filter labels (see the `"categories"` list at the top of
  the file). You can add new categories there too — the filter buttons are generated from it.
- Leave `coverImage`, `images` and `videos` as empty arrays **if your files are named after the
  id** (next section). Fill them only when you want exact control.
- To feature a project on the homepage's big cards, add its **id** to the `"featured"` list.

Refresh the browser — the project appears in the gallery, its own page works, filters update.

---

## 3. How to add images

**Automatic way (recommended).** Save your photos next to the project id:

```
public/images/weddings/wedding-003.jpg      ← becomes the cover automatically
public/images/weddings/wedding-003-2.jpg    ← gallery photo 2
public/images/weddings/wedding-003-3.jpg    ← gallery photo 3
```

Any file starting with the project id in the matching folder is picked up, in order
(`id.jpg`, then `id-2`, `id-3`, …). The cover is the exact `id.jpg` if it exists.

**Manual way.** List the paths in JSON instead (order is exactly what you write):

```json
"coverImage": "/images/weddings/my-favourite.jpg",
"images": [
  "/images/weddings/my-favourite.jpg",
  "/images/weddings/ceremony-wide.jpg"
]
```

Both ways can be mixed — manual paths come first, auto-found files are appended after them.

---

## 4. How to add local videos

1. Download / export your video as `.mp4` (H.264) or `.webm`.
2. Put it in `public/videos/<category>/` — or simply in `public/videos/`:
   ```
   public/videos/weddings/wedding-003.mp4
   ```
3. Done. A file whose name **starts with the project id** is attached automatically —
   no JSON edit needed.

The same rules as images apply: `wedding-003.mp4` is matched to project `wedding-003`, and
multiple videos (`wedding-003-2.mp4` …) appear in order. On desktop the first video also plays
as a muted preview when visitors hover the project card.

If the automatic name matching can't find it (different name, different folder), add the path
manually:

```json
"videos": ["/videos/weddings/sangeet-highlight.mp4"]
```

**Video priority:** local video first → then external links → if neither exists, the video
section is hidden automatically (never an empty box).

---

## 5. How to add YouTube videos

Copy the normal share link into `externalVideos`:

```json
"externalVideos": [
  { "type": "youtube", "url": "https://www.youtube.com/watch?v=VIDEO_ID", "label": "Wedding Film" }
]
```

Shorts and `youtu.be` links also work. The site builds a private, ad-light embed
(`youtube-nocookie`) and only loads it when the visitor clicks play.

## 6. How to add Vimeo videos

```json
"externalVideos": [
  { "type": "vimeo", "url": "https://vimeo.com/VIDEO_ID", "label": "Director's Cut" }
]
```

Direct video URLs (`https://…/film.mp4`) also work — use `"type": "file"`. Videos are never
downloaded from external services; they are embedded on demand.

A project can have **both** local videos and external links — local ones show first, then the
external buttons ("Also Watch").

---

## 7. How to change the hero (homepage) image / video

Homepage background:

```
public/images/hero/hero.jpg        ← photo background
public/videos/showreel/hero.mp4    ← video background (used if present, photo acts as poster)
```

Any file named `hero.jpg/png/webp` in `images/hero/` or `hero.mp4/webm` in `videos/showreel/`
is picked up automatically; the JSON paths (`"hero" → "heroImage"` / `"heroVideo"`) also work.
If a hero video exists the site uses it (muted, looping); with `prefers-reduced-motion` the
photo is used instead.

## 8. How to change the showreel

```
public/videos/showreel/showreel.mp4            ← the film
public/images/showreel/showreel-poster.jpg     ← the cover frame shown before playing
```

Or point at an external film in JSON: `"showreel" → "externalUrl": "https://www.youtube.com/watch?v=…"`.

---

## 9. Optional: CSV projects

If you prefer a spreadsheet, `public/content/portfolio.csv` can hold extra projects. Columns:

```
id,title,category,location,year,coverImage,video,externalVideo,description
```

- Multiple videos / links are separated by `|` (pipe), e.g. `/videos/events/a.mp4|/videos/events/b.mp4`.
- **JSON always wins**: a CSV row whose `id` already exists in JSON is ignored.
- Delete the sample row whenever you like.

## 10. Social links, contact, testimonials, services

All in `portfolio.json`:

```json
"social":   { "instagram": "…", "youtube": "…", "whatsapp": "+92 300 1234567", "email": "you@studio.com" }
```

- **WhatsApp**: a phone number is converted to a `wa.me` link automatically; a full URL also works.
- **Testimonials**: add objects to `"testimonials"` → `{ "quote", "name", "role" }`. Cards render in order.
- **Services**: add to `"services"` → `{ "title", "icon", "description" }`. `icon` can be any of:
  `Camera, Aperture, Video, Film, Clapperboard, Briefcase, ShoppingBag, Megaphone, Sparkles, Heart, Globe, Image`.
- **Stats** (50+ Projects etc.): `"hero" → "stats"`.
- **About text**: `"about" → "bio"` (a list of paragraphs).

## 11. Placeholders

The demo images/videos shipped in `public/` are generated placeholders. Replace them with your
own work — same names, same folders. Run `npm run placeholders` any time to regenerate any you
deleted (it never touches other files).

## 12. Quick checklist for new work

- [ ] Photos → `public/images/<category>/<project-id>*.jpg`
- [ ] Video → `public/videos/<category>/<project-id>.mp4`
- [ ] Add the project block in `portfolio.json`
- [ ] (Optional) Add the id to `"featured"`
- [ ] Refresh the browser — done

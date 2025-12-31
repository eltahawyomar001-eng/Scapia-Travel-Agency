# SCAPIA Travel Website - AI Agent Instructions

## Architecture Overview
Static travel website with **Sanity CMS** for content management, deployed on **Vercel**. No build process—files served as-is.

### Data Flow
```
Sanity Studio → Sanity Cloud API → js/sanity-loader.js → HTML DOM
```

### CMS Options (Both Available)
1. **Sanity CMS** (Primary - No GitHub needed for client):
   - Studio: `sanity/` folder (run `npm run dev` from there)
   - Project ID: `klhue3lk`
   - Dataset: `production`
   - Loader: `js/sanity-loader.js`

2. **DecapCMS** (Legacy - Requires GitHub):
   - Config: `admin/config.yml`
   - Admin: `/admin/` route
   - Content: `content/settings/*.json`, `content/trips/*.md`
   - Loader: `js/cms-loader.js`

### CSS Import Order (Critical)
All pages must import in this exact sequence—specificity depends on it:
```html
<link rel="stylesheet" href="css/variables.css">  <!-- 1. Design tokens -->
<link rel="stylesheet" href="css/reset.css">      <!-- 2. Browser reset -->
<link rel="stylesheet" href="css/base.css">       <!-- 3. Typography -->
<link rel="stylesheet" href="css/layout.css">     <!-- 4. Grid/containers -->
<link rel="stylesheet" href="css/components.css"> <!-- 5. UI components -->
<link rel="stylesheet" href="css/pages/[page].css"> <!-- 6. Page-specific -->
```

## Key Patterns

### HTML Page Structure
```html
<div class="page">
  <nav class="nav">...</nav>
  <main class="main"><section class="section">...</section></main>
  <footer class="footer">...</footer>
</div>
```

### BEM Naming Convention
- Block: `.service-card`, `.trip-card`
- Element: `.service-card__title`, `.service-card__icon`
- Modifier: `.nav__link--active`, `.btn--primary`

### Content Binding
HTML elements use `data-content` attributes for JS population:
```html
<h1 class="hero__title" data-content="hero-title">Fallback Text</h1>
```
Sanity loader auto-populates based on CSS selectors.

### Design Tokens (css/variables.css)
```css
--color-text-primary: #222222;    /* Use this, not --color-black-text */
--color-text-secondary: #7C7C7C;
--color-bg-secondary: #F8F8F8;
--spacing-md: 24px;               /* Prefer variables over hardcoded values */
--letter-spacing-display: -3px;   /* Required for hero headings */
```

## Development Workflow

```bash
npx serve .   # Local dev server (no build needed)
```

### Adding a New Page
1. Copy `about.html` as template (has correct CSS imports + nav)
2. Create `css/pages/[page-name].css` for page styles
3. Update nav links in ALL HTML files (no shared template)

### Adding CMS Content Type
Edit `admin/config.yml`:
```yaml
collections:
  - name: "new_type"
    folder: "content/new_type"
    fields:
      - { label: "Title", name: "title", widget: "string" }
```

### Trip Content Structure (content/trips/*.md)
```yaml
---
title: Bali Paradise Escape
price: 1299
duration: 7 Days / 6 Nights
category: adventure  # family|adventure|beach|nature|cultural|romantic|island
itinerary:
  - { day: 1, title: "Arrival", description: "..." }
---
Markdown body content here
```

## Integration Points

### Vercel + GitHub OAuth
- `api/auth/index.js` - Initiates GitHub OAuth flow
- `api/auth/callback.js` - Handles OAuth callback
- Requires env vars: `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `SITE_URL`
- `vercel.json` configures rewrites for `/api/auth/*` routes and **cache headers for `/content/`**

### External Dependencies (CDN-loaded)
- **Geist Font**: Loaded in `<head>` of each HTML file
- **DecapCMS**: Loaded from unpkg.com in `/admin/index.html`

## Critical Gotchas

1. **No shared templates**: Navigation changes require editing ALL `.html` files
2. **Mobile menu**: Toggle `.active` class on `.nav__menu` (see `js/main.js:7-30`)
3. **Section animations**: Sections use Intersection Observer; hero is excluded to stay visible
4. **Hero backgrounds**: Set inline `style="background-image: url(...)"` on `.hero__container`
5. **Legacy CSS vars**: `--color-black-text` exists but prefer `--color-text-primary`
6. **CMS caching**: `vercel.json` sets `no-cache` for `/content/*` - don't remove this or CMS updates won't appear
7. **CMS image validation**: `cms-loader.js` only applies images from full URLs (http/https) or `/images/uploads/`. Local paths like `/images/hero-bg.jpg` are ignored to prevent 404s.

## File Reference
| Purpose | File |
|---------|------|
| Design tokens | `css/variables.css` |
| CMS schema | `admin/config.yml` |
| Content loader | `js/content-loader.js` (class), `js/cms-loader.js` (page-specific) |
| Trip example | `content/trips/bali-paradise-escape.md` |
| Homepage content | `content/settings/homepage.json` |

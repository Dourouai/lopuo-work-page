# LOPUO Studio — Website

Single-page bilingual (EN/ZH) website for LOPUO Studio, showcasing HoleSnap, Zider, and Zirwork.

**Live URL**: [lopuo.work](https://lopuo.work)

## Tech Stack

- Pure HTML5 + CSS3 + Vanilla JS
- No build step required
- Hosted on Cloudflare Pages

## Local Development

```bash
# Start a local server
python3 -m http.server 8080

# Or use any static server
npx serve .
```

Then open [http://localhost:8080](http://localhost:8080).

## Deploy to Cloudflare Pages

### Option 1: Git Integration (Recommended)

1. Push this repo to GitHub or GitLab
2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) → Pages → Create a project
3. Connect your repository
4. Build settings:
   - **Build command**: _(leave empty)_
   - **Build output directory**: `/`
5. Deploy
6. Custom domain: bind `lopuo.work`

Every push to `main` will auto-deploy.

### Option 2: Direct Upload (Wrangler CLI)

```bash
# Install Wrangler
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy
wrangler pages deploy . --project-name=lopuo-studio
```

### Custom Domain

After deployment, go to **Pages → your project → Custom Domains** to add `lopuo.work`.

## Project Structure

```
.
├── index.html          # Main page (bilingual EN/ZH)
├── css/
│   └── style.css       # Styles (dark theme, responsive)
├── js/
│   └── main.js         # Language toggle + scroll animations
├── assets/             # Images, icons (add your own)
└── README.md           # This file
```

## Products

| Product | Description | URL |
|---------|-------------|-----|
| HoleSnap | Vector Pattern Generator for SVG, DXF & STP | [holesnap.com](https://holesnap.com) |
| ZIDER | Components & widgets for creator websites | [zider.ink](https://www.zider.ink) |
| Zirwork | Configurable operations workspace (coming soon) | [zirwork.com](https://zirwork.com) |

## Customization

### Branding
- Edit CSS variables in `css/style.css` (`:root` section) for colors and spacing.
- Replace inline SVG icons in `index.html` with your actual product icons.
- Product brand colors: HoleSnap `#EA7A18`, Zider `#087A46`, Zirwork `#89C941`

### Content
- All text content is in `index.html` with bilingual `data-i18n` attributes.
- Update product descriptions, links, and tags directly in the HTML.

## License

© 2026 LOPUO Studio. All rights reserved.

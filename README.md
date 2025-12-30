# SCAPIA Travel Website

A pixel-perfect responsive travel website converted from Figma designs with DecapCMS integration.

## 🚀 Quick Start

1. **Open locally**: Simply open `index.html` in your browser
2. **Or use a local server**:
   ```bash
   npx serve .
   ```

## 📁 Project Structure

```
├── index.html              # Homepage
├── about.html              # About Us page
├── blog.html               # Blog listings
├── contact.html            # Contact page
├── trip-details.html       # Trip detail template
├── css/
│   ├── variables.css       # Design tokens
│   ├── reset.css           # CSS reset
│   ├── base.css            # Typography & base styles
│   ├── layout.css          # Grid & layout utilities
│   ├── components.css      # Reusable components
│   └── pages/              # Page-specific styles
├── js/
│   └── main.js             # JavaScript functionality
├── admin/
│   ├── index.html          # DecapCMS admin UI
│   └── config.yml          # CMS configuration
└── content/                # CMS content files
    ├── settings/
    ├── trips/
    └── blog/
```

## 🎨 Design System

- **Font**: Geist (loaded via CDN)
- **Colors**: 
  - Black Text: `#222222`
  - Gray Text: `#7C7C7C`
  - White: `#FFFFFF`
  - White BG: `#FAFAFA`
  - Border: `#E3E8EF`
- **Breakpoints**:
  - Desktop: ≥1024px
  - Tablet: 768px - 1023px
  - Mobile: ≤767px

## 📝 CMS Setup (DecapCMS)

### Deploy to Vercel with GitHub

1. Push this project to GitHub
2. Connect repo to Vercel
3. Update `admin/config.yml`:
   - Replace `YOUR_GITHUB_USERNAME/travel-website` with your repo
   - Update `site_url` with your Vercel URL

### Enable Authentication

For Vercel, you'll need to set up OAuth. Options:
- **Netlify Identity**: Easiest option
- **GitHub OAuth App**: For direct GitHub auth
- **External OAuth**: Custom implementation

## 🔧 Customization

### Edit Content
- Use the CMS at `/admin/` (after auth setup)
- Or edit files directly in `/content/`

### Update Styles
- Design tokens: `css/variables.css`
- Component styles: `css/components.css`
- Page styles: `css/pages/*.css`

## 📱 Responsive Design

The site is fully responsive:
- Desktop (1440px design width)
- Tablet (768px+)
- Mobile (390px design width)

## 📄 License

MIT License

# Mountain and Memories — Frontend Prototype

A premium, editorial Himalayan travel agency web application built with **React**, **Vite**, and **Tailwind CSS**.

## Design Philosophy

- **Color Palette:**
  - Forest Green (`#244C3A`): Primary brand color, headers, CTAs, footer
  - Mountain Gold (`#D5A56A`): Accents, highlights, badges
  - Warm Ivory (`#F7F4EC`): Page backgrounds
  - Charcoal (`#343A34`): High-contrast typography
  - Stone Beige (`#E7E1D5`): Subtle borders and secondary panels
  - Pure White (`#FFFFFF`): Card surfaces and forms
- **Typography:**
  - Headings: Playfair Display (Serif)
  - Interface & Body: Inter (Sans-serif)

## Features Included

1. **Header & Navigation:**
   - Dynamic transparent-to-solid navigation header with scroll detection.
   - Destinations Mega-Dropdown on desktop with regional thumbnails.
   - Fully accessible mobile drawer with expandable destinations accordion.
2. **Homepage:**
   - Cinematic hero with call to action.
   - Editorial story section with layered imagery.
   - "Why Choose Us" core pillars.
   - Regional destination showcase (Himachal Pradesh, Uttarakhand, Ladakh, Kashmir).
   - Featured tour packages with starting price calculation.
   - Visual travel gallery with interactive preview.
   - Himalayan journal and travel guides preview.
   - Multi-step trip customization section.
3. **Tour Packages:**
   - Multi-parameter filtering (Region, Duration, Trip Style, Budget).
   - Dynamic reset and empty state handling.
   - Dedicated detail page (`/packages/:slug`) with day-by-day accordion itinerary.
   - **Interactive Accommodation Selector:** 3-Star, 4-Star, and 5-Star tiers updating prices dynamically, detailing specific inclusions, and explaining environmental restrictions where higher tiers are unavailable.
   - Inclusions, exclusions, altitude advisories, and FAQs.
4. **Interactive Lightbox Gallery:**
   - Category filtering (Landscapes, Stays, Trails, Culture).
   - Fullscreen lightbox modal with keyboard navigation (Esc, Arrow Left, Arrow Right).
5. **Himalayan Journal / Blog:**
   - Magazine-style article layout with author bios, pull quotes, and related trip links.
6. **Multi-Step Trip Customization (`/customize-trip`):**
   - Step 1: Destination, dates, duration, party size.
   - Step 2: Stay tier, budget, and travel preferences.
   - Step 3: Contact information, review summary, and client-side demo submission.

## Getting Started

```bash
cd frontend
npm install
npm run dev
```

The dev server will launch at `http://localhost:5173`.

To build for production:

```bash
npm run build
npm run preview
```

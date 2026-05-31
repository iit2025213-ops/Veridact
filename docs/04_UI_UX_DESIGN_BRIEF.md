# VERIDACT — AI Forensic Evidence Platform
# Document 04: UI/UX Design Brief

> **Tagline:** "See Through the Fake. Secure the Truth."
> **Version:** 1.0 — Hackathon MVP
> **Last Updated:** 2025
> **Status:** Active

---

## Table of Contents

1. [Design Vision](#1-design-vision)
2. [Design Inspiration Resources](#2-design-inspiration-resources)
3. [Brand Identity](#3-brand-identity)
4. [Theme Options](#4-theme-options)
5. [Final Recommended Design System](#5-final-recommended-design-system)
6. [Typography and Font Scale](#6-typography-and-font-scale)
7. [Component System](#7-component-system)
8. [Page-by-Page UI Description](#8-page-by-page-ui-description)
9. [Animation and Interaction](#9-animation-and-interaction)
10. [Accessibility](#10-accessibility)
11. [Responsive Design](#11-responsive-design)
12. [No Merge Conflict Strategy](#12-no-merge-conflict-strategy)
13. [Antigravity Megaprompt Sequence](#13-antigravity-megaprompt-sequence)

---

## 1. Design Vision

### Emotional Direction

VERIDACT handles a serious subject: cybercrime, fake evidence, and digital fraud. The UI must communicate that seriousness without becoming oppressive. Every visual decision should make the user feel:

- **Safe** — This tool will protect them or help them expose wrongdoing
- **Trusted** — The interface reflects institutional credibility, not a startup experiment
- **Capable** — Even a non-technical investigator should feel empowered by the UI
- **Modern** — This is not a 2010 police records system; it is a precision AI platform

The emotional spectrum to aim for: **Clinical precision meets controlled urgency.** Think the cockpit of a modern aircraft — clean, information-dense, every element earns its place.

### Visual Direction

VERIDACT should look like the intersection of three worlds:

1. **Cybersecurity tooling** — Dark backgrounds, monospace data, glowing status indicators, structured grids
2. **Government credibility** — Conservative typography, structured layouts, visible authority without aggression
3. **Modern AI SaaS** — Clean cards, smooth transitions, meaningful charts, clear hierarchy

### What to Avoid

- **No neon overload** — Cyberpunk aesthetic is tempting but signals toy, not tool
- **No flat corporate white** — A wall of white looks generic and lacks the forensic seriousness
- **No aggressive red everywhere** — Red is reserved for high-risk verdicts only; overusing it creates noise
- **No excessive animations** — Every animation should carry information or guide attention; not decorate
- **No overcrowded dashboards** — More space, fewer elements, higher confidence in what is shown

### The Core Visual Metaphor

VERIDACT's visual metaphor is **the forensic grid** — the precise, measured overlay a forensic analyst applies to a scene. Grid patterns, subtle crosshair accents, monospace hash displays, structured timelines, and measured confidence meters all reinforce this metaphor throughout the UI.

---

## 2. Design Inspiration Resources

### 2.1 Dashboard Layout Inspiration

#### Mobbin (`mobbin.com`)
- **What to search for:** "cybersecurity", "investigation", "analytics dashboard", "case management"
- **Keywords:** `dashboard dark`, `analytics app`, `admin panel`, `investigation app`
- **What to take:** Card arrangement patterns, sidebar widths, stat block layouts, table row designs, status badge styles from security and analytics apps
- **What not to copy:** Consumer app patterns (bright gradients, large playful illustrations, rounded everything)

#### Figma Community (`figma.com/community`)
- **What to search for:** "cybersecurity dashboard UI kit", "admin dashboard dark", "forensic UI", "SaaS dashboard free"
- **Keywords:** `dark admin kit`, `dashboard components`, `investigation UI`, `threat intelligence`
- **What to take:** Component architecture patterns, color token naming conventions, spacing systems, sidebar navigation patterns
- **What not to copy:** Paid license components; any component with a brand logo embedded

#### Dribbble (`dribbble.com`)
- **What to search for:** "cybersecurity dashboard", "investigation dashboard", "AI analytics dashboard", "forensic UI dark"
- **Keywords:** `law enforcement UI`, `threat intelligence dashboard`, `evidence management`, `dark dashboard`
- **What to take:** Visual hierarchy inspiration, accent color usage, icon style decisions, chart aesthetic references
- **What not to copy:** Exact color combinations or layout compositions — use as mood board only

#### Behance (`behance.net`)
- **What to search for:** "cybersecurity UX case study", "investigation platform UI", "government portal design", "digital forensics platform"
- **What to take:** Full-page layout compositions, how to handle dense data without clutter, sidebar design patterns
- **What not to copy:** Any copyrighted mockup directly

#### SaaS Landing Page Galleries
- **Resources:** `saaslandingpage.com`, `lapa.ninja`, `godly.website`
- **What to search for:** "AI platform", "cybersecurity SaaS", "analytics platform landing page"
- **What to take:** Hero section layouts, feature card arrangements, "How it works" step sequences
- **What not to copy:** Specific copy, specific brand colors, or hero illustrations

#### Admin Dashboard Template Galleries
- **Resources:** `themeforest.net` (browse only), `html5up.net`, `adminlte.io`, Vercel's Next.js templates
- **What to search for:** "dark admin dashboard", "analytics admin template", "case management dashboard"
- **What to take:** Navigation structure, breadcrumb patterns, filter bar layouts, table pagination styles
- **What not to copy:** Paid templates or licensed components

---

### 2.2 Color Palette Inspiration

#### Coolors (`coolors.co`)
- **How to use:** Generate palettes starting from a navy or dark slate base. Lock your primary dark background color (e.g., `#0D1117`), then generate complements.
- **For VERIDACT:** Search saved palettes tagged "cybersecurity", "forensic", "dark professional"
- **Output:** Export as Tailwind CSS hex tokens

#### Tailwind CSS Colors (`tailwindcss.com/docs/customizing-colors`)
- **How to use:** The full Tailwind 3 color palette is your vocabulary. For VERIDACT, the recommended palette pulls from: `slate`, `cyan`, `emerald`, `red`, `yellow`, `zinc`
- **Recommended starting point:** `slate-900` background, `slate-800` card, `cyan-400` accent
- **Advantage:** Everything maps directly to Tailwind class names — no custom CSS needed

#### Realtime Colors (`realtimecolors.com`)
- **How to use:** Paste in a base accent color and see it applied live to a mock UI. Instantly validates whether your color choice works in practice.
- **For VERIDACT:** Test `cyan-400` (#22D3EE) and `emerald-400` (#34D399) as accent candidates against dark backgrounds

#### Adobe Color (`color.adobe.com`)
- **How to use:** Use "Explore" tab → search "cybersecurity", "forensic", "dark tech". Also use the color wheel to find complementary/triadic sets.
- **For VERIDACT:** Find analogous palettes around cool blues and dark neutrals

#### Color Hunt (`colorhunt.co`)
- **How to use:** Filter by "dark", "tech", "professional". Browse for palettes that feel institutional but modern.
- **What to take:** 4-color palettes — background, surface, accent, text — as starting points

#### shadcn/ui Theme Generator (`ui.shadcn.com/themes`)
- **How to use:** The official shadcn/ui theme configurator. Set base color, radius, and mode. Copy the generated CSS variables directly into your `globals.css`.
- **For VERIDACT:** Start with Slate as base, Dark mode as default

#### tweakcn (`tweakcn.com`)
- **How to use:** A community-built shadcn/ui theme tweaker with live preview. More granular than the official generator.
- **For VERIDACT:** Use to fine-tune sidebar background vs. card background contrast in dark mode

---

### 2.3 Typography Inspiration

#### Google Fonts (`fonts.google.com`)
- **Filter by:** "Monospace" for data/hash display; "Sans-serif" for body and headings
- **Search:** "Inter", "DM Sans", "Space Grotesk", "IBM Plex Mono", "JetBrains Mono"
- **For VERIDACT:** Inter for body + IBM Plex Mono for hashes and data

#### Fontshare (`fontshare.com`)
- **What to browse:** Free high-quality fonts including "Satoshi" (excellent dashboard body), "Cabinet Grotesk" (strong headings)
- **For VERIDACT:** Satoshi is a strong alternative to Inter with a slightly more designed feel

#### Type Scale (`typescale.com`)
- **How to use:** Enter base font size (16px) and scale ratio (1.25 Major Third or 1.333 Perfect Fourth)
- **For VERIDACT:** Use Major Third (1.25) scale for tight, dense dashboard hierarchy

#### Utopia Type Calculator (`utopia.fyi`)
- **How to use:** Fluid responsive typography — font sizes that scale smoothly between breakpoints
- **For VERIDACT:** Use for landing page headings that look right on both 375px mobile and 1440px desktop

#### Material Design Typography Reference (`m3.material.io/styles/typography`)
- **How to use:** Reference for naming conventions (Display, Headline, Title, Body, Label) and their recommended sizes
- **For VERIDACT:** Adopt the same naming system for your design tokens

---

## 3. Brand Identity

### Product Name: VERIDACT

The name combines "Veritas" (Latin: truth) and "Act" (to take action). It suggests the act of verifying truth — appropriate for a forensic evidence platform.

### Tagline: "See Through the Fake. Secure the Truth."

The tagline has two parts: detection ("See Through the Fake") and protection ("Secure the Truth"). Both halves of the core value proposition in one line.

### Brand Personality

| Attribute | Expression |
|---|---|
| Serious | Never playful or casual in formal contexts |
| Precise | Data is always exact; confidence scores have decimals |
| Trustworthy | Consistent, structured, never alarming without reason |
| Capable | The UI shows power through clarity, not complexity |
| Objective | No emotional language in AI verdicts — factual framing only |

### Logo Direction

For the hackathon MVP, use a **text-based wordmark** with an icon accent. The logo should use:
- **Typeface:** Space Grotesk Bold or Inter Bold
- **Icon option:** A stylized "V" formed by a magnifying lens over a shield, OR a simple crosshair/fingerprint motif
- **Colors:** Accent color (cyan or emerald) + white text on dark background

A full logo design is not required for the hackathon. A text wordmark with a simple shield or lens SVG icon is sufficient.

### Icon Style

- **Library:** Lucide React (already included in the tech stack)
- **Style:** Stroke icons, consistent 1.5px stroke weight, 20px or 24px size
- **Never mix:** Fill icons and stroke icons in the same interface

### Visual Metaphors

The following visual metaphors are used throughout the product:

| Metaphor | Where Used |
|---|---|
| **Forensic grid** | Background texture on landing page; grid lines in dashboard card layout |
| **Digital fingerprint** | Logo accent; loading animation; SHA-256 hash section icon |
| **Evidence lens** | "Analyze" button icon; analysis result header icon |
| **Chain link** | Chain-of-custody timeline connector element |
| **Shield** | Trust indicators; security-related UI elements; verified evidence badge |
| **Signal / Waveform** | Audio analysis visualization; spectrogram display |

---

## 4. Theme Options

### Theme 1: Dark Forensic Navy + Cyan

**Visual Feel:** Deep naval intelligence. Serious, controlled, slightly cold. Reminiscent of secure government networks and OSINT dashboards.

| Token | Color | Tailwind Equivalent |
|---|---|---|
| Background | `#0A0F1C` | `slate-950` |
| Card Surface | `#111827` | `gray-900` |
| Border | `#1F2937` | `gray-800` |
| Primary Accent | `#22D3EE` | `cyan-400` |
| Secondary | `#0891B2` | `cyan-600` |
| Text Primary | `#F9FAFB` | `gray-50` |
| Text Muted | `#9CA3AF` | `gray-400` |
| Success | `#10B981` | `emerald-500` |
| Warning | `#F59E0B` | `amber-500` |
| Error | `#EF4444` | `red-500` |

**Best Use Case:** Investigator and admin dashboards; high-information density pages
**Pros:** Highly readable, strong cybersecurity signal, excellent contrast
**Cons:** Landing page may feel cold to non-technical citizens

---

### Theme 2: Cybersecurity Black + Neon Blue

**Visual Feel:** Terminal-inspired, hacker aesthetic. Very high contrast. Would look dramatic in a demo.

| Token | Color | Tailwind Equivalent |
|---|---|---|
| Background | `#000000` | `black` |
| Card Surface | `#0D0D0D` | near-black |
| Border | `#1A1A2E` | custom |
| Primary Accent | `#3B82F6` | `blue-500` |
| Secondary | `#818CF8` | `indigo-400` |
| Text Primary | `#FFFFFF` | `white` |
| Text Muted | `#6B7280` | `gray-500` |
| Success | `#22C55E` | `green-500` |
| Warning | `#EAB308` | `yellow-500` |
| Error | `#F43F5E` | `rose-500` |

**Best Use Case:** Demo environments; pure technical showcases
**Pros:** Maximum visual impact; strong cybersecurity aesthetic
**Cons:** Harder to read for extended use; risky accessibility contrast ratio; can feel like a toy

---

### Theme 3: Government Trust Blue + White

**Visual Feel:** Conservative, official, accessible. Feels like a legitimate government digital service.

| Token | Color | Tailwind Equivalent |
|---|---|---|
| Background | `#F8FAFC` | `slate-50` |
| Card Surface | `#FFFFFF` | `white` |
| Border | `#E2E8F0` | `slate-200` |
| Primary Accent | `#1D4ED8` | `blue-700` |
| Secondary | `#2563EB` | `blue-600` |
| Text Primary | `#0F172A` | `slate-900` |
| Text Muted | `#64748B` | `slate-500` |
| Success | `#16A34A` | `green-600` |
| Warning | `#D97706` | `amber-600` |
| Error | `#DC2626` | `red-600` |

**Best Use Case:** Citizen-facing pages (submission wizard, case tracking); situations where government legitimacy must be communicated
**Pros:** Best accessibility; most readable for non-technical users; trustworthy
**Cons:** May not impress tech-savvy hackathon judges; lacks the "forensic AI" visual punch

---

### Theme 4: Court/Legal Professional Slate + Gold

**Visual Feel:** Like a premium legal SaaS — serious, premium, court-adjacent. Gold accent communicates importance.

| Token | Color | Tailwind Equivalent |
|---|---|---|
| Background | `#0F172A` | `slate-900` |
| Card Surface | `#1E293B` | `slate-800` |
| Border | `#334155` | `slate-700` |
| Primary Accent | `#D97706` | `amber-600` |
| Secondary | `#F59E0B` | `amber-500` |
| Text Primary | `#F1F5F9` | `slate-100` |
| Text Muted | `#94A3B8` | `slate-400` |
| Success | `#10B981` | `emerald-500` |
| Warning | `#F59E0B` | `amber-500` |
| Error | `#F87171` | `red-400` |

**Best Use Case:** Report pages; court brief export; PDF reports
**Pros:** Premium feel; gold accent makes key data pop; works well for report documents
**Cons:** Gold can feel dated if not used carefully; slightly harder to implement with shadcn defaults

---

### Theme 5: Modern AI SaaS Dark Slate + Emerald ⭐ RECOMMENDED

**Visual Feel:** The sweet spot between tech credibility and modern professionalism. Feels like a real AI product — accessible enough for citizens, impressive enough for investigators and judges.

| Token | Color | Tailwind Equivalent |
|---|---|---|
| Background | `#0F172A` | `slate-900` |
| Card Surface | `#1E293B` | `slate-800` |
| Border | `#334155` | `slate-700` |
| Primary Accent | `#34D399` | `emerald-400` |
| Secondary | `#10B981` | `emerald-500` |
| Text Primary | `#F1F5F9` | `slate-100` |
| Text Muted | `#94A3B8` | `slate-400` |
| Success | `#34D399` | `emerald-400` |
| Warning | `#FBBF24` | `amber-400` |
| Error | `#F87171` | `red-400` |
| Suspicious | `#FB923C` | `orange-400` |
| Inconclusive | `#94A3B8` | `slate-400` |

**Best Use Case:** Complete VERIDACT MVP — all pages
**Pros:** Balanced; dark enough for forensic credibility; emerald accent communicates "verified truth"; excellent contrast; direct Tailwind mapping; works beautifully with shadcn/ui dark mode; easy to implement
**Cons:** Emerald is not traditional for law enforcement (that's a future concern, not a hackathon concern)

---

### Theme Comparison Table

| Theme | Visual Feel | Best Hackathon Demo? | Government Trust? | Cybersecurity Feel? | Easy with Tailwind/shadcn? | Recommended |
|---|---|---|---|---|---|---|
| Dark Navy + Cyan | Cold, precise, intelligence | ✅ Yes | ⚠️ Moderate | ✅ Strong | ✅ Yes | ✅ Alternative |
| Black + Neon Blue | Dramatic, hacker | ⚠️ High impact, risky | ❌ No | ✅ Very Strong | ⚠️ Tricky contrast | ❌ No |
| Blue + White | Official, accessible | ⚠️ Safe but plain | ✅ Very Strong | ❌ Weak | ✅ Yes | ⚠️ Citizen pages only |
| Slate + Gold | Premium, legal | ⚠️ Looks expensive | ✅ Strong | ⚠️ Moderate | ⚠️ Gold needs care | ❌ No |
| **Slate + Emerald** | **Modern AI, balanced** | **✅ Best overall** | **✅ Strong** | **✅ Strong** | **✅ Easiest** | **⭐ RECOMMENDED** |

**Final Recommendation:** Use **Theme 5 — Dark Slate + Emerald** for the full MVP. If the team prefers the more intense cybersecurity aesthetic, **Theme 1 — Dark Navy + Cyan** is the best alternative and requires only a single accent color swap.

---

## 5. Final Recommended Design System

### Color Palette (Tailwind CSS Custom Tokens)

Add to `tailwind.config.ts`:

```typescript
colors: {
  // Base backgrounds
  'surface-base': '#0F172A',     // slate-900 — page background
  'surface-card': '#1E293B',     // slate-800 — card/panel background
  'surface-elevated': '#253347', // slightly lighter — hover states, modals
  'surface-border': '#334155',   // slate-700 — all borders/dividers

  // Typography
  'text-primary': '#F1F5F9',     // slate-100
  'text-secondary': '#CBD5E1',   // slate-300
  'text-muted': '#94A3B8',       // slate-400
  'text-disabled': '#475569',    // slate-600

  // Brand accent
  'accent-primary': '#34D399',   // emerald-400 — primary buttons, links, highlights
  'accent-hover': '#10B981',     // emerald-500 — hover state
  'accent-subtle': '#064E3B',    // emerald-950 — subtle tinted backgrounds

  // Semantic colors
  'verdict-authentic': '#34D399',    // emerald-400
  'verdict-suspicious': '#FB923C',   // orange-400
  'verdict-fake': '#F87171',         // red-400
  'verdict-inconclusive': '#94A3B8', // slate-400

  'status-pending': '#FBBF24',       // amber-400
  'status-review': '#60A5FA',        // blue-400
  'status-complete': '#34D399',      // emerald-400
  'status-closed': '#94A3B8',        // slate-400
  'status-referred': '#C084FC',      // purple-400
  'status-critical': '#F87171',      // red-400
}
```

### Typography

**Primary Font:** `Inter` (Google Fonts) — all UI text
**Monospace Font:** `JetBrains Mono` (Google Fonts) — SHA-256 hashes, case numbers, code

Add to `index.html`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

### Font Sizes (Tailwind Custom Scale)

```typescript
fontSize: {
  'display': ['3rem', { lineHeight: '1.1', fontWeight: '700' }],    // 48px
  'h1':      ['2.25rem', { lineHeight: '1.2', fontWeight: '700' }], // 36px
  'h2':      ['1.875rem', { lineHeight: '1.25', fontWeight: '600' }],// 30px
  'h3':      ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }],  // 24px
  'h4':      ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }], // 20px
  'body-lg': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }],// 18px
  'body':    ['1rem', { lineHeight: '1.5', fontWeight: '400' }],    // 16px
  'body-sm': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],// 14px
  'caption': ['0.75rem', { lineHeight: '1.4', fontWeight: '400' }], // 12px
  'badge':   ['0.6875rem', { lineHeight: '1', fontWeight: '600' }], // 11px
}
```

### Border Radius

```typescript
borderRadius: {
  'sm':   '4px',   // inputs, badges
  'md':   '8px',   // cards, buttons
  'lg':   '12px',  // modals, large cards
  'xl':   '16px',  // hero sections
  'full': '9999px' // pill badges, avatar
}
```

### Shadow Style

```typescript
boxShadow: {
  'card':   '0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)',
  'card-hover': '0 4px 12px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3)',
  'accent': '0 0 0 1px #34D399, 0 0 12px rgba(52,211,153,0.15)',
  'modal':  '0 20px 60px rgba(0,0,0,0.6)',
  'none':   'none'
}
```

### Spacing System

Use Tailwind's default 4px spacing grid. Key spacing reference:
- `p-4` = 16px (standard card padding)
- `p-6` = 24px (generous card padding)
- `gap-4` = 16px (standard grid gap)
- `gap-6` = 24px (section gap)
- `mb-8` = 32px (section separator)

### Button Styles

```
Primary:   bg-accent-primary text-slate-900 font-semibold hover:bg-accent-hover transition-colors
Secondary: bg-surface-card text-text-primary border border-surface-border hover:bg-surface-elevated
Ghost:     bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface-elevated
Danger:    bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20
```

All buttons: `rounded-md px-4 py-2 text-sm font-medium transition-all duration-150`

### Card Style

```
Base card:  bg-surface-card border border-surface-border rounded-lg p-6 shadow-card
Hover card: hover:shadow-card-hover hover:border-slate-600 transition-all duration-200
Alert card: border-l-4 border-l-accent-primary bg-accent-subtle
```

### Sidebar Style

```
Width:       w-64 (256px) on desktop, collapsible to icon-only (w-16) on tablet
Background:  bg-slate-950 (slightly darker than page background)
Border:      border-r border-surface-border
Item:        px-3 py-2 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-card
Active item: bg-accent-subtle text-accent-primary border-l-2 border-accent-primary
```

### Dashboard Layout

```
Desktop:  Sidebar (256px fixed) + Main content area (flex-1) + Optional right panel (320px)
Tablet:   Collapsed icon sidebar (64px) + Main content
Mobile:   No sidebar; bottom nav or hamburger menu with Sheet overlay
```

### Mobile Behavior

- Sidebar collapses to a hamburger menu using shadcn/ui `Sheet`
- Tables become horizontally scrollable with `overflow-x-auto`
- Stats grid collapses from 4 columns to 2 columns to 1 column
- Wizard steps use full-width on mobile

### Animation Direction

- **Transitions:** 150ms for hover, 200ms for state changes, 300ms for page transitions
- **Easing:** `ease-out` for entrances, `ease-in` for exits
- **Never use:** `animate-bounce`, `animate-pulse` on important content, spin on anything except loading
- **Use Framer Motion for:** Page entry animations, confidence meter count-up, wizard step transitions

---

## 6. Typography and Font Scale

### Font 1: Inter (Google Fonts) — PRIMARY

**Why it fits VERIDACT:** The default font of modern SaaS tools. Extremely legible at small sizes in data-dense dashboards. Neutral enough to feel institutional, refined enough to feel modern.

**Where to use:** All body text, labels, form fields, table content, navigation items, button labels

**Heading style:** Inter 700 (bold) at H1/H2/H3 sizes
**Body text style:** Inter 400 (regular) at 16px/14px
**Button text style:** Inter 600 (semibold) at 14px
**Dashboard stat style:** Inter 700 at 32px–48px for large KPI numbers

---

### Font 2: JetBrains Mono (Google Fonts) — MONOSPACE DATA

**Why it fits VERIDACT:** Designed for code and data. Every character is equally wide, making SHA-256 hashes and case numbers visually aligned and scannable. The technical aesthetic reinforces the forensic platform identity.

**Where to use:** SHA-256 hash displays, case numbers (VRD-2025-NNNNNN), file sizes, timestamps in custody log, confidence scores in data view, error codes

**Style:** JetBrains Mono 400 or 500, with slight letter-spacing on hash displays

---

### Font 3: Space Grotesk (Google Fonts) — LOGO/BRAND ONLY

**Why it fits VERIDACT:** Geometric with slight personality. Better than Inter for the brand wordmark — has enough character to be memorable without being playful.

**Where to use:** Logo/wordmark only; optionally for the hero section H1 on the landing page
**Not for:** Body text, navigation, dashboard content

---

### Font 4: Satoshi (Fontshare) — ALTERNATIVE TO INTER

**Why it fits VERIDACT:** Satoshi is Inter's more designed sibling. Slightly more personality while maintaining the same legibility profile. Use if the team wants a less "default" feel.

**Where to use:** Can replace Inter entirely as the primary font
**Note:** Load from Fontshare CDN, not Google Fonts

---

### Font Size Scale Reference

| Level | Size | Line Height | Weight | Usage |
|---|---|---|---|---|
| Display | 48px / 3rem | 1.1 | 700 | Landing hero heading |
| H1 | 36px / 2.25rem | 1.2 | 700 | Page titles |
| H2 | 30px / 1.875rem | 1.25 | 600 | Section headings |
| H3 | 24px / 1.5rem | 1.3 | 600 | Card headings, panel titles |
| H4 | 20px / 1.25rem | 1.4 | 600 | Subsection headings |
| Body Large | 18px / 1.125rem | 1.6 | 400 | Landing page body, important descriptions |
| Body | 16px / 1rem | 1.5 | 400 | General body text |
| Body Small | 14px / 0.875rem | 1.5 | 400 | Table content, form labels, helper text |
| Caption | 12px / 0.75rem | 1.4 | 400 | Timestamps, secondary metadata |
| Button | 14px / 0.875rem | 1 | 600 | All buttons |
| Table Text | 14px / 0.875rem | 1.5 | 400 | Table cell content |
| Badge Text | 11px / 0.6875rem | 1 | 600 | Status badges, verdict badges, priority labels |

---

## 7. Component System

### C-01: Navbar (TopNav)

- **Purpose:** Top navigation bar for authenticated pages; shows user info, notifications, theme toggle
- **Props:** `user: User`, `onLogout: () => void`
- **Visual Style:** `bg-slate-950 border-b border-surface-border h-14 px-6` — slightly darker than the main background to create a framing effect
- **Contains:** VERIDACT wordmark (left), page title (center, on desktop), user avatar dropdown (right)
- **User dropdown menu items:** Profile, Settings (future), Logout
- **Interaction:** Avatar click opens shadcn/ui `DropdownMenu`
- **File:** `src/components/layout/TopNav.tsx`

---

### C-02: Sidebar

- **Purpose:** Primary navigation for authenticated users; role-aware menu items
- **Props:** `role: UserRole`, `currentPath: string`
- **Visual Style:** `w-64 bg-slate-950 border-r border-surface-border flex flex-col`
- **Sections:**
  - VERIDACT logo/wordmark
  - Navigation items (role-filtered)
  - Divider
  - Admin section (super_admin only)
  - Footer: version number, small system status indicator
- **Navigation items by role:**
  - All authenticated: Dashboard, Cases, Reports
  - Supervisor + Admin: Analytics
  - Admin: Admin section (Users, Custody, Settings)
- **Active state:** Left border accent + tinted background
- **Collapsible on mobile:** Uses shadcn/ui `Sheet`
- **File:** `src/components/layout/Sidebar.tsx`

---

### C-03: Hero Section

- **Purpose:** Landing page hero with headline, subheadline, CTAs
- **Visual Style:** Full-width, dark background with subtle forensic grid pattern overlay (CSS background pattern), large heading, two CTA buttons
- **Background:** CSS `background-image` with SVG grid pattern at low opacity over `bg-surface-base`
- **Heading:** Display size, Inter 700, text-primary
- **Subheadline:** Body Large, text-muted
- **CTAs:** Primary "Report AI Crime" button (emerald) + Ghost "Track My Case" button
- **Animation:** Framer Motion fade-in from below on page load, 300ms stagger
- **File:** `src/components/landing/HeroSection.tsx`

---

### C-04: Auth Card

- **Purpose:** Centered card container for Login and Register forms
- **Visual Style:** `max-w-md mx-auto bg-surface-card border border-surface-border rounded-lg p-8 shadow-modal`
- **Contains:** VERIDACT logo, heading, form, submit button, link to opposite auth page
- **File:** `src/components/layout/AuthLayout.tsx`

---

### C-05: Stats Card (Dashboard)

- **Purpose:** KPI display card for dashboard overview
- **Props:** `label: string`, `value: string | number`, `icon: LucideIcon`, `trend?: string`, `variant?: 'default' | 'warning' | 'success' | 'danger'`
- **Visual Style:** `bg-surface-card border border-surface-border rounded-lg p-6`; icon in tinted circle top-right; large number center-left; label below; optional trend indicator
- **Interaction:** None (static display)
- **File:** `src/components/dashboard/StatsCard.tsx`

---

### C-06: Evidence Upload Box

- **Purpose:** File upload dropzone for evidence submission
- **Props:** `onFileSelect: (file: File) => void`, `acceptedTypes: string`, `maxSizeMB: number`
- **Visual Style:** Dashed border `border-2 border-dashed border-surface-border` rounded-lg; icon + instruction text centered; `hover:border-accent-primary transition-colors`; active drag state: `border-accent-primary bg-accent-subtle`
- **States:** Idle, Hover (cursor dragging over), Active (file selected — shows filename, size, type icon), Error (shows rejection reason in red)
- **Interaction:** Click to open file dialog OR drag-and-drop
- **File:** `src/components/ui/FileUploadBox.tsx`

---

### C-07: Case Card

- **Purpose:** Summary card for a case in list view (alternative to table rows for mobile)
- **Props:** `case: Case`
- **Visual Style:** `bg-surface-card border border-surface-border rounded-lg p-4 hover:shadow-card-hover cursor-pointer`
- **Contains:** Case number (monospace), title, complaint type badge, priority badge, status badge, assigned investigator name, updated timestamp
- **Interaction:** Click navigates to `/dashboard/cases/:caseId`
- **File:** `src/components/cases/CaseCard.tsx`

---

### C-08: Case Status Badge

- **Purpose:** Colored pill badge showing case status
- **Props:** `status: CaseStatus`
- **Color mapping:**
  - `pending` → amber-400 background with dark text
  - `in_review` → blue-400 background
  - `analysis_complete` → emerald-400 background
  - `report_generated` → purple-400 background
  - `closed` → slate-500 background
  - `referred` → orange-400 background
- **Visual Style:** `rounded-full px-2.5 py-0.5 text-badge font-semibold uppercase tracking-wide`
- **File:** `src/components/cases/CaseStatusBadge.tsx`

---

### C-09: Verdict Badge

- **Purpose:** AI analysis verdict display, color-coded by severity
- **Props:** `verdict: Verdict`
- **Color mapping:**
  - `authentic` → emerald-400 text + emerald-950 background + emerald-500 border
  - `suspicious` → orange-400 text + orange-950 background + orange-500 border
  - `likely_fake` → red-400 text + red-950 background + red-500 border
  - `inconclusive` → slate-400 text + slate-800 background + slate-600 border
- **Visual Style:** Border-style badge with icon (shield-check / shield-alert / shield-x / help-circle from Lucide)
- **File:** `src/components/ui/VerdictBadge.tsx`

---

### C-10: Confidence Meter

- **Purpose:** Animated horizontal progress bar showing AI confidence score 0–100%
- **Props:** `score: number` (0.0–1.0), `label?: string`
- **Visual Style:** Full-width bar, rounded, dark background track, colored fill based on score value:
  - 0–0.4: emerald fill
  - 0.4–0.65: amber fill
  - 0.65–1.0: red fill (matches verdict color logic)
- **Animation:** Framer Motion `animate={{ width: `${score * 100}%` }}` from 0% on mount, duration 800ms ease-out
- **Shows:** Score value as percentage text right-aligned above bar
- **File:** `src/components/ui/ConfidenceMeter.tsx`

---

### C-11: File Metadata Card

- **Purpose:** Display uploaded evidence file details
- **Props:** `evidence: Evidence`
- **Contains:** File icon (type-specific Lucide icon), original filename, stored filename (monospace), MIME type, file size (human-readable: "2.4 MB"), upload timestamp, uploader name
- **SHA-256 section:** Monospace hash in JetBrains Mono with copy-to-clipboard button
- **Visual Style:** Card with a left accent border in the evidence type color (blue for image, purple for video, yellow for audio, slate for document)
- **File:** `src/components/evidence/FileMetadataCard.tsx`

---

### C-12: Chain-of-Custody Timeline

- **Purpose:** Vertical timeline showing all custody log events for a case
- **Props:** `logs: CustodyLog[]`
- **Visual Style:** Left-aligned vertical line; each event is a dot on the line (filled circle, accent color for latest, outline for older); event card to the right shows actor name, action label, timestamp, IP
- **Action icons (Lucide):**
  - `case_created` → FilePlus
  - `evidence_uploaded` → Upload
  - `evidence_accessed` → Eye
  - `analysis_started` → Play
  - `analysis_completed` → CheckCircle
  - `report_generated` → FileText
  - `file_downloaded` → Download
  - `case_updated` → Edit
  - `case_closed` → Archive
- **File:** `src/components/ui/CustodyTimeline.tsx`

---

### C-13: Report Download Card

- **Purpose:** Shows a generated report with metadata and download button
- **Props:** `report: Report`
- **Contains:** Report type badge, generated timestamp, generated by, report SHA-256 hash, "Download PDF" button
- **Visual Style:** Card with FileText icon; report hash displayed in monospace caption style
- **Interaction:** Download button calls `GET /api/reports/:reportId`
- **File:** `src/components/reports/ReportDownloadCard.tsx`

---

### C-14: Data Table

- **Purpose:** Reusable sortable table for case lists, user lists, custody logs
- **Props:** `columns: Column[]`, `data: any[]`, `isLoading: boolean`, `onRowClick?: (row) => void`
- **Visual Style:** `w-full border border-surface-border rounded-lg overflow-hidden`; header row: `bg-slate-950 text-text-muted text-body-sm font-semibold uppercase tracking-wider`; body rows: `bg-surface-card border-b border-surface-border hover:bg-surface-elevated cursor-pointer`
- **States:** Loading (5-row skeleton), Empty (centered empty state), Error (error message)
- **File:** `src/components/ui/DataTable.tsx`

---

### C-15: Filter Bar

- **Purpose:** Horizontal row of filter controls for case list and custody log
- **Props:** `filters: FilterConfig[]`, `onFilterChange: (filters) => void`
- **Contains:** Search input (with search icon), Status select, Complaint Type select, Priority select, Date range picker (optional), "Clear Filters" ghost button
- **Visual Style:** `bg-surface-card border border-surface-border rounded-lg p-4 flex flex-wrap gap-3`
- **File:** `src/components/ui/FilterBar.tsx`

---

### C-16: Modal / Dialog

- **Purpose:** Overlay dialogs for confirmations, edit forms, quick actions
- **Implementation:** shadcn/ui `Dialog` component
- **Animation:** Framer Motion scale + fade, 200ms
- **File:** Re-export from shadcn/ui with VERIDACT styling overrides

---

### C-17: Toast Notifications

- **Purpose:** Brief feedback messages for actions (success, error, info, warning)
- **Implementation:** shadcn/ui `Toaster` + `useToast` hook
- **Position:** Bottom-right
- **Variants:**
  - Success: emerald-400 left border
  - Error: red-400 left border
  - Warning: amber-400 left border
  - Info: blue-400 left border
- **Duration:** 4 seconds auto-dismiss

---

### C-18: Skeleton Loader

- **Purpose:** Loading placeholder that matches the shape of the real content
- **Implementation:** `animate-pulse` on div elements shaped like the target content
- **Color:** `bg-slate-700` (slightly lighter than card background)
- **Usage:** One skeleton variant per major content type (card skeleton, table skeleton, stat skeleton)
- **File:** `src/components/ui/SkeletonLoader.tsx`

---

### C-19: Empty State

- **Purpose:** Friendly message when a list or data view has no content
- **Props:** `icon: LucideIcon`, `title: string`, `description: string`, `action?: ReactNode`
- **Visual Style:** Centered in container; icon at 48px in text-muted color; title at h3; description at body-sm text-muted; optional CTA button
- **File:** `src/components/ui/EmptyState.tsx`

---

### C-20: Error State

- **Purpose:** Error message when data loading fails
- **Props:** `message: string`, `onRetry?: () => void`
- **Visual Style:** Red-tinted card with AlertTriangle icon; error message; optional "Try Again" button
- **File:** `src/components/ui/ErrorState.tsx`

---

## 8. Page-by-Page UI Description

### Page: Landing Page (`/`)

**Layout:** Full-page scroll, no sidebar, `PublicLayout` wrapper

**Section 1 — Hero**
- Full viewport height on desktop, min-height on mobile
- Dark `surface-base` background with subtle SVG crosshair grid pattern overlay
- VERIDACT wordmark top-left
- Navigation links top-right: "Track Case", "Login"
- Center content: H1 "See Through the Fake." on line 1, "Secure the Truth." on line 2 (accent color for "Secure the Truth"); body-lg subheadline; two CTA buttons side-by-side
- CTA 1: "Report AI Crime" (primary, emerald) → `/submit`
- CTA 2: "Track My Case" (ghost) → `/track`

**Section 2 — Stats Banner**
- 3-column grid: "100% Free", "Runs Locally", "Open Source"
- Each with an icon and brief description
- Subtle top/bottom border, slightly different background tint

**Section 3 — Features**
- H2: "Everything Your Investigation Needs"
- 4-card grid (2×2 on mobile, 4×1 on desktop)
- Cards: AI Detection, File Integrity (SHA-256), Forensic Reports, Chain of Custody
- Each card: icon, feature name, 1-sentence description

**Section 4 — How It Works**
- H2: "How VERIDACT Works"
- 4-step horizontal flow (numbered, connected by arrows on desktop, stacked on mobile)
- Steps: Submit → Analyze → Report → Track

**Section 5 — Footer**
- Simple dark footer: VERIDACT wordmark + tagline + links (Login, Track, GitHub placeholder)

**Mobile Behavior:** Single column; hero buttons stack vertically; features stack to 1 column

**Loading State:** N/A (static)
**Error State:** N/A

---

### Page: Login (`/login`)

**Layout:** Full screen, `AuthLayout`, centered card

**Visual:** Dark background with very faint forensic grid pattern; centered `max-w-md` auth card

**Card Contents:**
- VERIDACT logo + name at top
- H2: "Welcome Back"
- Subtext: "Sign in to access your investigations"
- Form: Email input, Password input (with show/hide toggle)
- Primary "Login" button (full width, emerald)
- Link: "Don't have an account? Register" → `/register`
- Link: "Back to home" → `/`

**Error State:** Inline error message under form with red text and AlertCircle icon

**Loading State:** Button disabled with spinner + "Logging in..."

**Mobile Behavior:** Full-width card, same layout

---

### Page: Register (`/register`)

**Layout:** Same as Login page structure

**Card Contents:**
- H2: "Create Account"
- Subtext: "Register as a citizen to submit complaints"
- Form: Full Name, Email, Password, Confirm Password
- Primary "Create Account" button
- "Already registered? Login" link

---

### Page: Citizen Submission Wizard (`/submit`)

**Layout:** `PublicLayout` header + centered wizard container (`max-w-2xl`)

**Step Indicator:** Horizontal 4-step indicator at top; completed steps filled emerald, active step filled, future steps outlined

**Step 1 — Complaint Type:**
- H2: "What type of AI crime are you reporting?"
- 7 large clickable cards in a 2-3 column grid (each with icon + label)
- Selected card: emerald border + accent background tint
- Cards: Deepfake Image (camera), Deepfake Video (film), Voice Clone (mic), Fake Document (file-text), Synthetic Identity (user-x), Scam (alert-circle), Other (help-circle)

**Step 2 — Details:**
- Standard form layout; wide textarea for description
- Optional contact fields in a collapsible section ("Add Contact Info" toggle)

**Step 3 — Upload:**
- Full-width FileUploadBox (C-06)
- Below: accepted file types listed as small badges; max size note

**Step 4 — Review:**
- Summary table: all entered data in a read-only card
- Uploaded file shown with icon, name, size
- Large "Submit Complaint" button (full width, emerald)
- Privacy note in caption text below

**Confirmation State (post-submit):**
- Green checkmark animation (Framer Motion)
- H2: "Complaint Submitted Successfully"
- Case number in JetBrains Mono, very large, with copy button
- SHA-256 hash in smaller monospace with copy button
- Two action buttons: "Download Receipt PDF" + "Track My Case"

**Mobile Behavior:** Steps are full-width; grid collapses to single column; wizard fills screen

---

### Page: Case Tracking (`/track` and `/track/:caseNumber`)

**Layout:** `PublicLayout` + centered single card (`max-w-lg`)

**`/track` Input Page:**
- H2: "Track Your Case"
- Single large input field with placeholder "VRD-2025-000042"
- "Track" button (primary)
- Helper text: "Enter the case number from your submission receipt"

**`/track/:caseNumber` Result Page:**
- Case status card with status badge (citizen-friendly label)
- Progress stepper: Received → Under Review → Analysis Complete → Closed
- Active step highlighted in emerald
- Submission date + last updated date
- Public notes section (if any)
- "Track Another Case" link

---

### Page: Dashboard Home (`/dashboard`)

**Layout:** `AppLayout` (sidebar + topnav + main content)

**Main Content Area:**
- H1: "Good morning, [Name]" or "Dashboard"
- Row 1: 4 Stats Cards (C-05) — role-dependent metrics
- Row 2 (Investigator): Recent Cases table (5 rows) + High Risk Evidence alert card (if any)
- Row 2 (Supervisor/Admin): Two charts side-by-side (Verdict Distribution + Case Type Breakdown)
- Row 3 (Supervisor/Admin): Investigator workload bar chart

**Loading State:** Stats cards show skeleton loaders
**Empty State:** "No cases yet. Seed data will show here on first startup."

---

### Page: Case List (`/dashboard/cases`)

**Layout:** AppLayout + full-width main content

**Components:**
- Page header: "Cases" H1 + "Total: N" muted count
- FilterBar (C-15) below header
- DataTable (C-14) with columns: Case #, Title, Type, Priority, Status, Assigned To, Last Updated
- Pagination controls below table (Previous/Next + page info)

**Loading State:** Table skeleton (5 rows)
**Empty State:** EmptyState with Folder icon + "No cases match your filters"
**Error State:** ErrorState with retry button

---

### Page: Case Detail (`/dashboard/cases/:caseId`)

**Layout:** AppLayout + two-column layout (main content left, actions panel right)

**Left Column (main content):**
- Breadcrumb: Cases > Case Number
- Case header: Case number (monospace), title (H2), complaint type badge, status badge, priority badge
- Tab bar (shadcn/ui Tabs): Evidence | Notes | Custody | Reports
- Tab content loads on tab switch

**Tab: Evidence**
- Upload Evidence button (top-right of tab)
- List of EvidenceCard items (C-11)
- Each card shows: file icon, filename, size, hash (truncated), status, "Analyze" or "View Analysis" button

**Tab: Notes**
- Chronological list of notes with author, visibility badge, timestamp
- "Add Note" form at bottom (textarea + visibility select + submit)

**Tab: Custody**
- CustodyTimeline component (C-12)

**Tab: Reports**
- List of ReportDownloadCard (C-13)
- "Generate New Report" button

**Right Column (Actions Panel):**
- "Update Status" section: status dropdown + "Update" button
- "Assignment" section (supervisor/admin): investigator dropdown + "Assign" button
- "Priority" section (supervisor/admin): priority select
- "Generate Report" button (investigator+)
- Danger zone: "Close Case" (admin only)

**Mobile Behavior:** Single column; Actions Panel moves to bottom as a collapsible section

---

### Page: Evidence Analysis Detail (`/dashboard/cases/:caseId/evidence/:evidenceId`)

**Layout:** AppLayout + single column max-w-4xl centered

**Structure:**
- Breadcrumb: Cases > Case > Evidence > filename
- FileMetadataCard (C-11) — full width
- Divider + "AI Analysis" section heading
- **Pre-analysis state:** Prominent "Analyze Evidence" CTA button (large, centered)
- **Analyzing state:** Spinner + progress text "Running AI analysis... (~30 seconds)" + animated forensic scanning line
- **Post-analysis state:**
  - VerdictBadge (C-09) — large, top center
  - ConfidenceMeter (C-10) — full width below verdict
  - Explanation text card: body-sm text, bg-surface-elevated, rounded
  - Model info: "Analyzed by: [model name] at [timestamp]" in caption style
  - Heatmap section (if available): image with overlay toggle button
  - "Back to Case" button

---

### Page: Reports (`/dashboard/reports`)

**Layout:** AppLayout + full-width

**Structure:**
- H1: "Reports"
- DataTable with columns: Case Number, Type, Generated By, Generated At, Download
- Download button in each row triggers `GET /api/reports/:id`

---

### Page: Analytics (`/dashboard/analytics`)

**Layout:** AppLayout + full-width, grid layout

**Structure:**
- H1: "Analytics"
- Row 1: 4 stats cards (system-wide metrics)
- Row 2: 3-column chart grid:
  - VerdictDistributionChart (Recharts PieChart)
  - DailySubmissionsChart (Recharts BarChart — 7 days)
  - CaseTypeChart (Recharts BarChart — by complaint type)
- Row 3: Investigator workload table

---

### Page: Admin Overview (`/admin`)

**Same structure as Supervisor Dashboard + System health indicators**

---

### Page: Admin Users (`/admin/users`)

**Layout:** AppLayout

**Structure:**
- H1: "User Management"
- DataTable: Name, Email, Role badge, Status (Active/Inactive toggle), Created Date, Edit button
- Edit opens shadcn/ui Sheet (side panel) with role dropdown, active toggle, org field

---

### Page: Admin Custody (`/admin/custody`)

**Layout:** AppLayout

**Structure:**
- H1: "Chain-of-Custody Audit Log"
- FilterBar: Date range, User search, Action type
- Large DataTable (paginated 50/page): Timestamp, User, Case #, Action, Evidence, IP, Notes

---

### Page: Admin Settings (`/admin/settings`)

**Layout:** AppLayout

**Structure:**
- H1: "System Settings"
- Settings displayed as labeled rows (read-only in MVP): APP_NAME, MAX_FILE_SIZE_MB, ALLOWED_ORIGINS, DEMO_MODE status
- Caption note: "Settings are configured via .env file. Contact your system administrator to change."

---

## 9. Animation and Interaction

### Button Hover Effects
```css
/* Tailwind */
hover:bg-accent-hover     /* Primary buttons: slightly darker green */
hover:bg-surface-elevated /* Secondary/ghost: subtle background lift */
active:scale-95           /* Click: brief scale-down */
transition-all duration-150
```

### Card Hover Effects
```css
hover:shadow-card-hover
hover:border-slate-600
transition-all duration-200
```

### Route Transitions
Use Framer Motion `AnimatePresence` on the route outlet:
```tsx
<motion.div
  initial={{ opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -8 }}
  transition={{ duration: 0.2, ease: "easeOut" }}
>
  {children}
</motion.div>
```
Keep subtle — `y: 8px` max, 200ms max. No sliding from full screen edges.

### Upload Progress Animation
- FileUploadBox: dashed border pulses (CSS `animate-pulse`) while processing
- After file selected: border becomes solid emerald; file info fades in (Framer `fadeIn`, 150ms)

### AI Processing Animation
- During analysis: a horizontal scanning line sweeps across the evidence file preview card (CSS `translateX` animation, 2s loop)
- Text underneath: "Running AI analysis..." with dots animating (`...` cycling)
- This makes the ~20s wait feel purposeful

### Confidence Score Animation
- ConfidenceMeter: bar width animates from 0% to final score on mount
- Framer Motion `initial={{ width: 0 }}` → `animate={{ width: score + "%" }}`
- Duration: 800ms, `easeOut`
- Score number counts up simultaneously using a simple counter effect

### Toast Notifications
- Entrance: slide-in from bottom-right, 200ms
- Exit: fade-out, 200ms
- shadcn/ui Toaster handles this by default

### Modal Transitions
- shadcn/ui Dialog uses built-in Radix animations
- Override with Tailwind: `data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0`

---

## 10. Accessibility

### Color Contrast
- All text/background combinations must meet WCAG AA (4.5:1 for body text, 3:1 for large text)
- `text-primary` (#F1F5F9) on `surface-card` (#1E293B): ~11:1 ✅
- `accent-primary` (#34D399) on `surface-card` (#1E293B): ~5.8:1 ✅
- `text-muted` (#94A3B8) on `surface-base` (#0F172A): ~4.6:1 ✅ (just passes AA)
- Avoid using `text-muted` alone for important content; pair with icons

### Keyboard Navigation
- All interactive elements are `<button>` or `<a>` — never `<div onClick>`
- Tab order follows visual reading order
- Skip-to-content link hidden until focused: `sr-only focus:not-sr-only`
- shadcn/ui components are built on Radix UI which is fully keyboard-accessible by default

### Focus States
```css
/* Add to globals.css */
:focus-visible {
  outline: 2px solid #34D399;
  outline-offset: 2px;
  border-radius: 4px;
}
```
Never remove focus rings; only style them.

### Form Labels
- Every input has a `<label>` with matching `htmlFor`
- Error messages are linked to inputs via `aria-describedby`
- Required fields marked with `aria-required="true"` and a visible asterisk `*`

### Error Messages
- Error text must appear below the relevant field, not just change border color
- Use `role="alert"` on dynamically inserted error messages

### Alt Text
- All images have `alt` text
- Evidence file thumbnails: `alt="Evidence file: {original_filename}"`
- Heatmap overlays: `alt="AI analysis heatmap for {filename}"`
- Logo: `alt="VERIDACT logo"`

### ARIA Labels
- Icon-only buttons: `aria-label="Copy SHA-256 hash"`, `aria-label="Download report"`
- Status badges: `aria-label="Case status: Under Review"`
- Verdict badges: `aria-label="AI verdict: Likely Fake"`
- Confidence meter: `role="progressbar" aria-valuenow={score} aria-valuemin={0} aria-valuemax={100}`

---

## 11. Responsive Design

### Breakpoints (Tailwind defaults)

| Name | Width | Context |
|---|---|---|
| `sm` | 640px | Large mobile, small tablet |
| `md` | 768px | Tablet |
| `lg` | 1024px | Small laptop |
| `xl` | 1280px | Desktop |
| `2xl` | 1536px | Large monitor / projector |

### Mobile (< 640px)

- Sidebar hidden; replaced by sticky bottom tab bar (5 main sections) OR hamburger menu
- Stats grid: 1 or 2 columns
- Case table: hidden columns (show only Title, Status, Action button); or replaced by case cards
- Submission wizard: full-width steps
- Hero: single column; buttons stack vertically
- Charts: hidden or simplified (single chart only)
- Auth card: full-width with padding

### Tablet (640px – 1024px)

- Sidebar collapses to icon-only (64px width)
- Stats grid: 2 columns
- Case table: fewer columns
- Wizard: full-width
- Charts: 2-column grid (2 charts side-by-side)

### Desktop (1024px+)

- Full sidebar (256px)
- Stats grid: 4 columns
- Full case table with all columns
- Charts: 3-column grid
- Two-column layout on Case Detail page

### Projector / Demo Screen (1280px+ at reduced resolution)

For hackathon demos on a projector:
- Use `2xl:text-lg` to slightly larger font sizes on demo-facing pages
- Ensure card min-heights are sufficient to be readable from 3 meters
- Never show more than 5-6 data points in a chart without a scroll
- Keep the confidence meter score percentage large (`text-2xl` minimum)

---

## 12. No Merge Conflict Strategy

### UI Ownership Boundaries

| Component/Page Group | Owner | Files |
|---|---|---|
| Design tokens + globals | Person A | `tailwind.config.ts`, `src/index.css`, `src/globals.css` |
| Layout components | Person A | `src/components/layout/` — AppLayout, PublicLayout, AuthLayout, Sidebar, TopNav |
| Shared UI components | Person A | `src/components/ui/` — all generic components (C-06 through C-20) |
| Landing page | Person A | `src/pages/LandingPage.tsx`, `src/components/landing/` |
| Auth pages | Person A | `src/pages/LoginPage.tsx`, `src/pages/RegisterPage.tsx` |
| Submission wizard | Person A | `src/pages/SubmitEvidencePage.tsx`, `src/components/evidence/SubmissionWizard.tsx` |
| Tracking pages | Person A | `src/pages/TrackCasePage.tsx`, `src/pages/TrackCaseResultPage.tsx` |
| Case-specific components | Person A | `src/components/cases/` |
| Evidence-specific components | Person A + C | `src/components/evidence/` (Person A for UI shell, Person C for analysis result display) |
| Dashboard pages | Person A | `src/pages/DashboardPage.tsx`, `src/pages/CaseListPage.tsx`, `src/pages/CaseDetailPage.tsx` |
| Evidence detail page | Person A (layout) + Person C (result card) | `src/pages/EvidenceDetailPage.tsx` |
| Report pages | Person A (layout) + Person C (content) | `src/pages/ReportsPage.tsx`, `src/components/reports/` |
| Analytics charts | Person A | `src/pages/AnalyticsPage.tsx`, `src/components/analytics/` |
| Admin pages | Person A | `src/pages/AdminPages/` |
| TypeScript types | Shared — communicate changes | `src/types/` |
| API service functions | Person A | `src/services/` — functions, not business logic |

### Design System Lock

After Phase 1 is complete:
- `tailwind.config.ts` color tokens must not be changed without a team announcement
- `globals.css` CSS variables must not be renamed (shadcn/ui depends on these names)
- shadcn/ui component files in `src/components/ui/` (auto-generated by CLI) must not be manually edited after initial setup; customization goes in wrapper components

### Component Interface Contracts

Before Person C builds `AnalysisResultCard.tsx`, Person A must publish the component's expected props interface in `src/types/analysis.types.ts`. Person C builds the data, Person A builds the display.

---

## 13. Antigravity Megaprompt Sequence

### Prompt UI-01: Configure Design Tokens and shadcn/ui Theme

**Goal:** Set up the complete VERIDACT design system — Tailwind config, CSS variables, shadcn/ui theme, fonts — so all subsequent UI work uses consistent tokens.

**Files to Create/Modify:**
- `frontend/tailwind.config.ts` (add custom colors, fonts, radii, shadows)
- `frontend/src/index.css` or `frontend/src/globals.css` (CSS variables for shadcn/ui, font imports)
- `frontend/index.html` (add Google Fonts link tags)

**Files Not to Touch:**
- `src/components/ui/` (shadcn/ui generated files — only modify via CLI or wrapper)
- Any page files

**Task:**
1. Add the full color token system from Section 5 to `tailwind.config.ts`
2. Add Inter and JetBrains Mono font families to Tailwind config
3. Add custom font size scale from Section 6 to `tailwind.config.ts`
4. Add custom border radius, shadow, and spacing tokens from Section 5
5. Add Google Fonts preconnect and link tags to `index.html`
6. Add CSS custom properties to `globals.css` mapping shadcn/ui CSS variables to VERIDACT dark slate palette
7. Set `dark` class on `<html>` element as default mode
8. Re-initialize shadcn/ui with Slate color base and dark mode: `npx shadcn-ui@latest init`

**Constraints:**
- Do not break existing page placeholder components
- All token names must use the exact names from Section 5 (used by all subsequent components)
- Do not remove any existing Tailwind defaults — only add custom tokens
- Keep app localhost-ready

**Acceptance Criteria:**
- `npm run dev` starts without errors after config changes
- Background of `App.tsx` renders as `#0F172A` (dark slate)
- A test div with `className="bg-accent-primary text-slate-900"` renders as emerald green
- JetBrains Mono font loads in browser dev tools
- shadcn/ui Button component renders with correct dark theme

**Testing:**
1. Add a test div in App.tsx: `<div className="bg-accent-primary text-surface-base p-4">VERIDACT Test</div>`
2. Start dev server — verify emerald background renders
3. Open browser dev tools → computed styles → verify font-family is Inter
4. Remove test div after verification

**Commit Message:** `feat: configure veridact design system tokens and shadcn dark theme`

---

### Prompt UI-02: Build Layout Components

**Goal:** Build the three layout wrapper components (AppLayout, PublicLayout, AuthLayout) and the Sidebar and TopNav components that all pages will use.

**Files to Create:**
- `src/components/layout/AppLayout.tsx`
- `src/components/layout/PublicLayout.tsx`
- `src/components/layout/AuthLayout.tsx`
- `src/components/layout/Sidebar.tsx`
- `src/components/layout/TopNav.tsx`

**Files Not to Touch:**
- Any page files
- `tailwind.config.ts`
- `globals.css`

**Task:**
1. `PublicLayout.tsx`: minimal header (VERIDACT wordmark left, "Track Case" + "Login" links right) + children + simple footer
2. `AuthLayout.tsx`: full-screen dark background with centered max-w-md card container
3. `Sidebar.tsx`: fixed left sidebar, 256px, role-aware nav items, collapsible on mobile via Sheet, active route highlighting
4. `TopNav.tsx`: fixed top bar, 56px, breadcrumb or page title center, user avatar dropdown right (Profile + Logout)
5. `AppLayout.tsx`: combines Sidebar + TopNav + scrollable main content area

**Constraints:**
- Sidebar must filter nav items based on `user.role` from auth context
- AppLayout must require authentication (redirect to /login if no token in localStorage)
- Mobile sidebar must use shadcn/ui Sheet (do not build custom drawer)
- All colors from design token system (no hardcoded hex values)

**Acceptance Criteria:**
- Public pages (landing, login, register, submit, track) render with PublicLayout
- All /dashboard and /admin pages render with AppLayout (sidebar + topnav)
- Sidebar shows correct nav items for each role
- Sidebar mobile menu opens/closes correctly
- User dropdown shows Logout option and calls logout function

**Commit Message:** `feat: build layout components — sidebar, topnav, app layout, public layout`

---

### Prompt UI-03: Build Shared UI Component Library

**Goal:** Build all reusable UI components that are used across multiple pages.

**Files to Create:**
- `src/components/ui/FileUploadBox.tsx` (C-06)
- `src/components/ui/ConfidenceMeter.tsx` (C-10)
- `src/components/ui/VerdictBadge.tsx` (C-09)
- `src/components/ui/CustodyTimeline.tsx` (C-12)
- `src/components/ui/SHAHashDisplay.tsx`
- `src/components/ui/DataTable.tsx` (C-14)
- `src/components/ui/FilterBar.tsx` (C-15)
- `src/components/ui/SkeletonLoader.tsx` (C-18)
- `src/components/ui/EmptyState.tsx` (C-19)
- `src/components/ui/ErrorState.tsx` (C-20)
- `src/components/cases/CaseStatusBadge.tsx` (C-08)
- `src/components/cases/PriorityBadge.tsx`
- `src/components/dashboard/StatsCard.tsx` (C-05)

**Files Not to Touch:**
- Layout components (already built in UI-02)
- Page files
- `globals.css`

**Task:**
Build each component according to the specs in Section 7. For each component:
1. Use TypeScript props interface
2. Use only Tailwind CSS classes (design tokens from UI-01)
3. Include loading, empty, and error states where applicable
4. Include Framer Motion animation for ConfidenceMeter (score bar animation)
5. Include copy-to-clipboard for SHAHashDisplay (using navigator.clipboard)
6. Include all action type icons in CustodyTimeline

**Constraints:**
- No component imports another page component
- All Lucide icons used must be from `lucide-react` — no other icon library
- FileUploadBox must validate file type by extension AND size before calling onFileSelect
- ConfidenceMeter score must animate from 0 to final value on mount

**Acceptance Criteria:**
- Each component renders in isolation with sample props (test with a simple test page)
- VerdictBadge renders 4 colors correctly
- ConfidenceMeter animates on render
- SHAHashDisplay copy button copies hash to clipboard
- DataTable renders skeleton when isLoading=true
- EmptyState and ErrorState render with correct icons and text

**Commit Message:** `feat: build shared UI component library — badges, timeline, table, upload box`

---

### Prompt UI-04: Build Landing Page and Public Pages

**Goal:** Build the complete public-facing pages: Landing Page, Case Tracking pages, and placeholder-ready auth pages.

**Files to Create/Modify:**
- `src/pages/LandingPage.tsx` (full implementation)
- `src/pages/TrackCasePage.tsx` (full implementation)
- `src/pages/TrackCaseResultPage.tsx` (full implementation)

**Files Not to Touch:**
- Layout components
- Shared UI components
- Auth pages (built separately)
- Dashboard pages

**Task:**
1. Build complete LandingPage with all 5 sections from Section 8
2. Add Framer Motion entrance animations to hero section
3. Build TrackCasePage with case number input and format validation
4. Build TrackCaseResultPage that fetches from `GET /api/public/cases/:caseNumber` and displays citizen-safe case status
5. Map internal status values to citizen-friendly labels
6. Add loading skeleton and error/not-found states to tracking result page

**Constraints:**
- Landing page must render without any API calls
- All external links must open in new tab
- Landing page CTA buttons must navigate to `/submit` and `/track`
- Tracking page must rate-limit feedback to user if 429 received

**Acceptance Criteria:**
- Landing page loads at `/` with no errors
- All 5 sections render correctly
- TrackCasePage validates VRD-YYYY-NNNNNN format before navigating
- TrackCaseResultPage shows "Case not found" for unknown case numbers
- TrackCaseResultPage shows public status correctly for seeded demo case

**Commit Message:** `feat: build landing page and citizen case tracking pages`

---

### Prompt UI-05: Build Dashboard and Case Management Pages

**Goal:** Build all authenticated dashboard and case management pages with real API integration.

**Files to Create/Modify:**
- `src/pages/DashboardPage.tsx`
- `src/pages/CaseListPage.tsx`
- `src/pages/CaseDetailPage.tsx`
- `src/pages/EvidenceDetailPage.tsx`
- `src/pages/ReportsPage.tsx`
- `src/pages/AnalyticsPage.tsx`
- `src/components/cases/CaseTable.tsx`
- `src/components/evidence/EvidenceCard.tsx`
- `src/components/evidence/AnalysisResultCard.tsx`
- `src/components/evidence/FileMetadataCard.tsx`
- `src/components/reports/ReportDownloadCard.tsx`
- `src/components/analytics/VerdictDistributionChart.tsx`
- `src/components/analytics/DailySubmissionsChart.tsx`

**Files Not to Touch:**
- Layout components
- Shared UI components (from UI-03)
- Auth pages
- Public pages
- `tailwind.config.ts`

**Task:**
Build all pages according to Section 8 specs. Wire all API service calls. Handle all loading, empty, and error states. Implement role-based component visibility (supervisor sees assignment controls, investigator does not).

**Constraints:**
- Use `useAuth` hook to get current user role for conditional rendering
- Charts must handle empty data gracefully (show "No data yet" placeholder)
- Analyze Evidence button must show loading state during analysis (~30s)
- Evidence detail page must log `evidence_accessed` (handled by backend GET)

**Acceptance Criteria:**
- Investigator dashboard shows only their assigned cases
- Case list filters work (status, type, priority)
- Case detail all 4 tabs render
- Evidence detail shows analysis result after clicking Analyze
- ConfidenceMeter animates to correct score
- PDF report can be downloaded
- Analytics charts render with seeded demo data

**Commit Message:** `feat: build authenticated dashboard and case management pages with API integration`

# MARKETON Landing Page — Build Plan

Replace the current homepage with a complete, single-route MARKETON landing page using the existing TanStack Start + Tailwind v4 stack, plus Framer Motion, lucide-react, and Recharts.

## Scope

- Single route: `src/routes/index.tsx` (homepage). All sections live here as section components.
- No backend, no auth, no DB. Pure frontend.
- Fonts (DM Serif Display + Plus Jakarta Sans) loaded via `<link>` in `src/routes/__root.tsx` head (not CSS @import — Tailwind v4 / Lightning CSS constraint).
- Design tokens added to `src/styles.css` under `@theme` (brand colors, fonts) plus custom keyframes and utility classes.

## Dependencies to install

- `framer-motion`
- `recharts`
- (`lucide-react` already present)

## Files to create / edit

1. **`src/styles.css`** — Add MARKETON tokens (`--color-navy`, `--color-orange`, `--font-display`, `--font-sans`, etc.), keyframes (`morphOrb`, marquee, shimmer), utility classes (`.btn-pill-navy`, `.btn-pill-outline`, `.card-marketon`), and `prefers-reduced-motion` overrides.
2. **`src/routes/__root.tsx`** — Add Google Fonts `<link>` preconnect + stylesheet entries for DM Serif Display and Plus Jakarta Sans.
3. **`src/routes/index.tsx`** — Compose all sections; set page `head()` (title, description, og tags).
4. **`src/components/marketon/`** — New folder with one file per section/primitive:
   - `Navbar.tsx` — floating pill, magnetic links (useSpring), scroll-compress, mobile drawer
   - `Hero.tsx` — morphing orb, ornamental SVG divider, staggered word reveal, orchestrated entrance sequence
   - `IntegrationMarquee.tsx` — two-row infinite marquee, hover decelerate
   - `PlatformTabs.tsx` — 5 tabs with morph transition; sub-components for each tab panel (LeadScoring, Omnichannel, VoiceAgent w/ waveform, WorkflowBuilder, AnalyticsDashboard w/ Recharts)
   - `ArchitectureFlow.tsx` — 17 module cards in clustered grid; SVG connectors with stroke-dashoffset draw + traveling orange dot (desktop only)
   - `DeveloperApi.tsx` — dark code card with Python/JS/cURL tab switcher + typewriter; 2×2 feature grid; pills
   - `BusinessesCan.tsx` — split section with abstract SVG illustration + play button
   - `MarketingFirstFuture.tsx` — three numbered points + floating SVG
   - `FullStackCards.tsx` — 3 large cards with gradient strips, 3D tilt hover
   - `FeaturesGrid.tsx` — 9 feature cards
   - `CaseStudies.tsx` — 3 case study cards
   - `Stats.tsx` — 4-stat row with scroll-triggered count-up
   - `EnterpriseGrade.tsx` — 3 columns
   - `Roadmap.tsx` — 4 timeline cards with scroll-linked vertical progress line
   - `FinalCta.tsx` — divider + heading + buttons + soft orb
   - `Footer.tsx` — 4-col link grid + staggered column reveal
   - `primitives/TiltCard.tsx` — reusable 3D tilt + cursor-follow glow wrapper
   - `primitives/RevealOnScroll.tsx` — stagger reveal helper
   - `primitives/CountUp.tsx` — useInView + spring counter with formatter

## Animation implementation notes

All 15 animation patterns from the brief map to Framer Motion primitives:
- Orb morph: CSS `@keyframes` (cheaper than JS) + opacity tween
- Magnetic nav: `useMotionValue` + `useSpring` (stiffness 300, damping 20)
- Staggered word reveal: split headline into words, `staggerChildren: 0.08`, ease `[0.16, 1, 0.3, 1]`
- Marquee velocity: motion value driving `x` translation, eased toward 0 on hover
- Tab morph: `AnimatePresence` with custom exit/enter (scale, y, blur, opacity)
- Architecture connectors: SVG `<path>` with `pathLength` motion value (only rendered ≥lg)
- Stat counters: `useInView` + `animate(motionValue, target, { type: "spring" })`
- 3D tilt: `useMotionValue(x,y)` → `useTransform` → `rotateX/rotateY`, radial gradient overlay tracking cursor
- Typewriter: state-driven char-by-char with token-based syntax coloring
- Roadmap progress: `useScroll({ target, offset })` → `useTransform` → `scaleY` on vertical line
- Waveform: `requestAnimationFrame` updating bar heights via `Math.sin`
- Workflow sequential activation: `staggerChildren: 0.3` on tab enter
- Footer reveal: `whileInView` staggered columns
- Global `prefers-reduced-motion`: wrap with `MotionConfig reducedMotion="user"`

## Color & typography

Defined in `@theme` so Tailwind utilities (`bg-navy`, `text-orange`, `font-display`, `font-sans`) work without inline color strings. Brand colors set as `--color-navy`, `--color-orange`, etc. Mapped to existing semantic tokens where it makes sense; otherwise used as direct brand utilities.

## Acceptance

- Single homepage replaces current content
- All 17 sections render at desktop (≥1024) and stack appropriately on mobile (<768)
- No horizontal scroll at any viewport
- Build passes (`vite build`) and preview renders without console errors
- `prefers-reduced-motion` users get static layout

## Out of scope

- Separate routes for Platform/Developers/Resources/Company (nav links scroll to in-page sections only — confirmed acceptable for a single-page landing per brief)
- Real video, CMS, or backend integrations
- Image generation (all illustrations are coded SVG/CSS)

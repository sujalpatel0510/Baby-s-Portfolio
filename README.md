# Nimbus the Sleepy Cloud ☁️

> Baby's First Website Hackathon (17–19 October 2026) · _"Every good thing starts small."_

An interactive, single-page portfolio for **Nimbus the Sleepy Cloud** — a *Cumulus
Dream Sprite* and self-declared *Junior Dream Engineer* who works nights at the
Midnight Observatory. The site is a hand-crafted, motion-rich, fully client-side
experience: part bedtime story, part toy, part portfolio.

There is **no backend, no build-time data, and no network calls at runtime**.
Everything runs in the browser — including the audio, which is synthesised live
with the Web Audio API.

---

## Table of contents

- [What's in it](#whats-in-it)
- [The story](#the-story)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Project structure](#project-structure)
- [Art direction & design system](#art-direction--design-system)
- [Motion & scroll architecture](#motion--scroll-architecture)
- [The Slumber Crib Dreambook (guestbook)](#the-slumber-crib-dreambook-guestbook)
- [Day / night theming](#day--night-theming)
- [Sound design](#sound-design)
- [Accessibility](#accessibility)
- [Motion preferences](#motion-preferences)
- [Client-side storage](#client-side-storage)
- [React Bits components](#react-bits-components)
- [Performance notes](#performance-notes)
- [Browser support](#browser-support)
- [Credits](#credits)

---

## What's in it

A scrollytelling one-pager with five themed "bands" (sections):

| Band | Anchor | What it does |
| --- | --- | --- |
| **Hero** | `#hero` | Huge editorial headline, a magnetic call-to-action, and Nimbus himself — poke him to make it rain confetti (and a raindrop sound). |
| **The File** | `#character` | A dossier card for Nimbus: stats, traits, role, and a spotlight-lit profile panel. |
| **The Workshop** | `#projects` | Three personal "toys": **LullabyLab**, **LanternGallery**, and **DeliveryRoutes** — each with its own live micro-interaction. |
| **The Story** | `#story` | A three-scene, pinned origin story ("How a cloud learned to engineer dreams") with a scrubbed progress rail and a travelling Nimbus avatar. |
| **The Dreambook** | `#guestbook` | The closing scene + the **Slumber Crib Dreambook**: leave a little dream for Nimbus and pin it to the cloud wall. |

Plus persistent, site-wide flavour:

- A short, skippable **page-load intro overlay**.
- A **retro sticky header** with nav, a visitor odometer, day/night toggle, and a mute toggle.
- A **scroll-progress ribbon** and a **film-grain** atmosphere layer.
- A **sparkle cursor trail** and a fully custom Nimbus **character cursor**.
- A hidden **easter egg**.

---

## The story

Nimbus is a Cumulus Dream Sprite and the Junior Dream Engineer at the Midnight
Observatory. Nimbus builds three things to help other little souls sleep:

1. **LullabyLab** — composes soft lullabies from cloud data.
2. **LanternGallery** — lights lanterns for every dream that arrives.
3. **DeliveryRoutes** — plans the gentlest path to deliver those dreams.

Every good thing, the story concludes, starts small.

---

## Tech stack

- **[React 19](https://react.dev/)** — UI, function components + hooks.
- **[Vite 8](https://vite.dev/)** — dev server and production bundler (Rolldown-based).
- **[Tailwind CSS 3.4](https://tailwindcss.com/)** — utility-first styling with `darkMode: 'class'`.
- **[GSAP 3](https://gsap.com/) + [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)** — all scroll-driven and pinned animation, via [`@gsap/react`](https://gsap.com/resources/React/)'s `useGSAP` hook.
- **[Motion](https://motion.dev/)** (`motion@14`) — library of micro-interaction primitives available to components.
- **[canvas-confetti](https://github.com/catdad/canvas-confetti)** — the "poke Nimbus" celebration.
- **[lucide-react](https://lucide.dev/)** — icon set.
- **[clsx](https://github.com/lukeed/clsx) + [tailwind-merge](https://github.com/dcastil/tailwind-merge)** — conditional/merged class names.
- **[oxlint](https://oxc.rs/docs/guide/usage/linter)** — fast linting.
- **Web Audio API** — all sound effects, generated at runtime (no audio files).

Fonts are loaded from Google Fonts: **Fraunces** (display serif), **Fredoka**
(bubbly UI), **JetBrains Mono** (labels/data).

---

## Getting started

Requires Node 18+ (Node 20+ recommended).

```bash
# install dependencies
npm install

# start the dev server (http://localhost:5173)
npm run dev

# type-free production build into dist/
npm run build

# lint the source
npm run lint

# preview the production build locally (http://localhost:4173)
npm run preview
```

> The site is a static bundle — deploy the contents of `dist/` to any static host
> (Netlify, Vercel, GitHub Pages, S3, …). No server or environment variables needed.

---

## Project structure

```
.
├── index.html                 # HTML shell, fonts, emoji favicon
├── tailwind.config.js         # palette, fonts, keyframe animations
├── postcss.config.js
├── vite.config.js
├── public/                    # static assets
└── src/
    ├── main.jsx               # React entry
    ├── App.jsx                # page composition, theming, global effects
    ├── index.css              # design tokens, band utilities, reduced-motion rules
    ├── lib/
    │   └── anim.js            # single GSAP + ScrollTrigger registration, helpers
    ├── hooks/
    │   ├── useSoundFX.js      # Web Audio synth (chime / click / raindrop / sparkle)
    │   └── useScrollReveal.js # [data-reveal] batch reveal via ScrollTrigger
    └── components/
        ├── RetroHeader.jsx    # sticky nav + visitor odometer + toggles
        ├── Hero.jsx           # #hero
        ├── CharacterFile.jsx  # #character (dossier)
        ├── ProjectsShowcase.jsx            # #projects wrapper
        │   └── projects/
        │       ├── LullabyLab.jsx
        │       ├── LanternGallery.jsx
        │       └── DeliveryRoutes.jsx
        ├── StoryScenes.jsx    # #story (pinned 3-scene sequence)
        ├── ClosingScene.jsx   # #closing finale + hosts the Dreambook
        ├── Guestbook.jsx      # #guestbook — the Slumber Crib Dreambook
        ├── NimbusAvatar.jsx   # reusable character (sizes: sm / md / lg)
        ├── StarField.jsx      # seeded canvas starfield
        ├── IntroOverlay.jsx   # skippable page-load intro
        ├── ScrollProgress.jsx # top progress ribbon
        ├── SparkleTrail.jsx   # pointer sparkle particles
        ├── CustomCursor.jsx   # Nimbus character cursor
        ├── HoverTilt.jsx      # pointer-based 3D tilt wrapper
        ├── EasterEggModal.jsx # hidden surprise
        └── reactbits/         # vendored open-source React Bits components
            ├── StarBorder.jsx
            ├── Magnet.jsx
            ├── SpotlightCard.jsx
            ├── GlareHover.jsx
            ├── ShinyText.jsx
            ├── DecryptedText.jsx
            └── CountUp.jsx
```

---

## Art direction & design system

The look is an **editorial "Midnight Observatory" collage**: oversized serif
headlines, mono instrumentation labels, hand-taped sticker chips, soft gradients,
and a star map that runs the whole way down. Colour and type are centralised as
tokens so sections can re-theme themselves independently.

### Colour

Defined in `tailwind.config.js` (`theme.extend.colors`) and mirrored as CSS
variables in `src/index.css`:

- **cream** `50/100/200/300` — warm paper background.
- **berry** `light / DEFAULT / dark` — the primary accent (haX berry).
- **earth** — text brown.
- **midnight** `DEFAULT/deep/card/border` — the first night palette.
- **ink** `DEFAULT/deep/card/border` — the deeper, violet-tinted night palette used by the rebuild.
- **gold** `DEFAULT/soft` — the observatory's warm glow.
- **peri** — periwinkle accent for night accents and glows.
- **cloud** `light/DEFAULT/fluff` — Nimbus himself.
- **rainbow** `pink/peach/yellow/mint/sky/lilac` — confetti + sparkle accents.

### Type

- `.display` → Fraunces, tight tracking, `line-height: 0.98` (headlines).
- `font-bubbly` → Fredoka (body, buttons).
- `.ins-label` → JetBrains Mono, 10px, wide uppercase tracking (eyebrows, field labels, data).

### Band theming (the key layout primitive)

Every section is a `.band`. A band reads a small set of local CSS variables so its
whole colour scheme can be swapped without touching the markup:

```
--band-bg  --band-fg  --band-muted  --band-line
--band-surface  --band-accent  --band-accent-soft  --band-glow
```

`<html>` / `.dark` set day or night defaults; a `.band.theme-night` forces a band
to stay night regardless of the global toggle (used for the closing scene and
footer so the page ends in the same sky it dives into).

Other utilities: `.shell` (shared max-width + responsive gutters), `.tick-rule`
(dotted rule), `.sticker` (taped chip), `.grain-layer` (film grain), `.tactile`
(press micro-interaction).

---

## Motion & scroll architecture

All GSAP is registered **exactly once**, in `src/lib/anim.js`:

```js
gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });
```

`ignoreMobileResize` prevents the reveal animations from flickering when mobile
browser toolbars show/hide and fire resize events mid-scroll.

Two animation patterns are used:

1. **One-shot reveals** — `useScrollReveal(ref)` runs a `ScrollTrigger.batch`
   over every `[data-reveal]` element inside `ref`, rising + fading each element
   into place once as it enters the viewport. Used for most narrative content.
2. **Scrub-linked reveals** — `fromTo` tweens with `scrollTrigger.scrub: true`.
   These are **tied to scroll position**, so they play forward *and* reverse
   smoothly as the visitor scrolls down and back up. The Dreambook and the pinned
   story use this approach.

The **story** (`StoryScenes.jsx`) is pinned with `gsap.matchMedia()` so desktop
and mobile get different pin lengths:

```js
// desktop: end: '+=260%'   mobile: end: '+=170%'
{ pin: frameRef, scrub: 1, anticipatePin: 1, invalidateOnRefresh: true }
```

An `onUpdate` callback drives the progress rail and the chapter index; the Nimbus
avatar travels a key-framed path across the three scenes.

Because web-fonts reflow layout *after* triggers are created, `App.jsx` calls
`ScrollTrigger.refresh()` on `document.fonts.ready`, on `window.load`, and once
more shortly after the intro overlay releases the scroll lock.

---

## The Slumber Crib Dreambook (guestbook)

The most interactive part of the site. It replaces a plain contact form with an
immersive, editorial two-column panel (`lg:col-span-5` intro / `lg:col-span-7`
form) that stacks to a single column on mobile.

**Structure**

- **Intro side** — eyebrow "Leave a little dream", the heading _"Leave a little
  stardust."_, a warm sentence, and a small listening Nimbus (`NimbusAvatar size="sm"`).
- **The dreambook** — a translucent `.dream-panel` surface containing name field,
  message textarea with a live `0/240` counter, a seven-badge picker, and a
  magnetic glowing submit button.
- **The cloud wall** — previously pinned dreams, rendered as `.dream-note` cards
  in a scrollable two-column grid.

**Behaviour**

- **Validation** — native `required` on both fields plus a guard in `handleSubmit`;
  empty submissions are blocked.
- **Loading / success / error states** — a small state machine
  (`idle → sending → success | error`) drives the button label, spinner, and a
  polite `aria-live` status region. Errors are announced via `role="alert"`.
- **No duplicate submissions** — a `submittingRef` guard plus `disabled` while a
  send is in flight.
- **Confirmation** — on success a burst of star glyphs drifts upward inside the
  panel and the newest note glows, then the styles are cleared.
- **Persistence** — dreams are saved to `localStorage` (see below). No account or
  server is created; the copy is explicit about this.
- **Reversible reveal** — the intro, panel, and wall each scrub in and out with
  scroll, so the section reads well in both directions.

**A note on the data:** the "backend" is intentionally absent. Submissions work
offline and are personal to the device. The two seed entries exist only to show
the wall isn't empty on a first visit.

---

## Day / night theming

A single boolean (`isNight`) in `App.jsx` toggles the `dark` class on `<html>`,
which Tailwind's `darkMode: 'class'` and the CSS token blocks respond to. The
transition is animated (`transition-colors duration-500`).

Sections can opt out of the global mood with `.theme-night` — the closing scene
and the footer use it so the page always finishes under a night sky, even in day
mode.

---

## Sound design

`src/hooks/useSoundFX.js` synthesises everything with the Web Audio API — there
are **no audio files**. The `AudioContext` is created lazily on the first user
gesture to satisfy autoplay policies, and every call is wrapped in a `try/catch`.

Available effects: `playChime(freq)`, `playClick()`, `playRainDrop()`,
`playSparkle()`, plus `isMuted` / `toggleMute()`. The header exposes a mute
button.

---

## Accessibility

- **Skip link** to `#main-content`.
- **Semantic landmarks** — `<header>`, `<main>`, `<section aria-label>` / `aria-labelledby`, `<footer>`.
- **Labels** — every form control has an associated `<label htmlFor>`; sticker
  buttons carry `aria-label` and expose selection via `aria-pressed`.
- **Live regions** — the guestbook status uses `role="status" aria-live="polite"`;
  errors use `role="alert"`.
- **Focus visibility** — a global character-toned `:focus-visible` ring, plus a
  stronger outline/glow on the Dreambook fields.
- **Anchor offsets** — `scroll-margin-top` keeps anchored sections clear of the
  sticky header.
- **Motion** — see below.

---

## Motion preferences

`prefers-reduced-motion: reduce` is respected across three layers:

1. **CSS** — `src/index.css` disables keyframe animations, smooth scrolling, and
   `.tactile` transforms.
2. **GSAP** — `prefersReducedMotion()` guards every tween; scrub/pinned effects
   are skipped entirely.
3. **Fallbacks** — the pinned story collapses to a plain static stack
   (`.story-static`), and the Dreambook's star-drift confirmation becomes a single
   soft flash, while reveals remain fully visible (no hidden content).

---

## Client-side storage

Two `localStorage` keys, both namespaced under `nimbus_`:

| Key | Shape | Written by | Purpose |
| --- | --- | --- | --- |
| `nimbus_visitor_count` | number (string) | `RetroHeader.jsx` | The visitor odometer. |
| `nimbus_guestbook` | `Array<{ name, text, sticker, time }>` | `Guestbook.jsx` | Pinned dreams on the cloud wall. |

Both are read lazily on mount and write failures (private mode/quota) are caught
so the UI still works in-memory. Clearing site data resets the page to its seed
state.

---

## React Bits components

Seven components are **vendored** from [React Bits](https://reactbits.dev/) into
`src/components/reactbits/` (the `'use client'` directive is stripped for Vite):

`StarBorder`, `Magnet`, `SpotlightCard`, `GlareHover`, `ShinyText`,
`DecryptedText`, `CountUp`.

They are kept verbatim wherever possible. `StarBorder` is used for the primary
buttons (submit, back-to-top); `Magnet` adds pointer-attraction to CTAs;
`SpotlightCard` lights the character dossier; the rest decorate the project toys.
Vendoring (rather than pulling more dependencies) keeps the bundle in check and
avoids version drift.

---

## Performance notes

- **No runtime network calls** — fonts are the only external request.
- **Canvas effects are seeded and cheap** — `StarField` uses a deterministic seed
  so stars don't jitter between renders.
- **Transform/opacity only** — all animated properties avoid layout/paint.
- **`ScrollTrigger.refresh()` is debounced** to font-load and layout-settle points,
  not on every resize.
- The production bundle is a single chunk; if you grow the project, code-split the
  three project toys with `React.lazy` to trim the entry bundle.

Build output is served statically; run `npm run build && npm run preview` to
verify the optimised bundle locally.

---

## Browser support

Modern evergreen browsers (Chrome, Edge, Firefox, Safari — current and previous
major). The experience depends on:

- `backdrop-filter` (translucent panels — degrades to a solid tint),
- CSS custom properties,
- Web Audio API (sound simply no-ops if unavailable),
- `IntersectionObserver` / GSAP ScrollTrigger.

The custom cursor and pointer-driven effects only activate on fine pointers
(`@media (pointer: fine)`), so touch devices get the native experience.

---

## Credits

- Built for the **Baby's First Website Hackathon**, 17–19 October 2026, by **haX**.
- Character, story, and copy: the Nimbus project.
- Interactive flourishes: [React Bits](https://reactbits.dev/).
- Animation: [GSAP](https://gsap.com/) · Icons: [Lucide](https://lucide.dev/).

_“Good things start small.”_

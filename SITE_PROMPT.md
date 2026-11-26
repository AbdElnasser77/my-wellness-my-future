# My Wellness My Future — Site Specification (prompt)

Build a single-page marketing website for **"My Wellness My Future"**, a women- and
employee-focused wellness initiative by **Everlast Wellness Medical Center** in Abu Dhabi
(launched 2023) that empowers Emirati employees to take control of their physical,
emotional and mental wellness.

The look is inspired by the "Bloom" AI-platform landing page: a **dark, cinematic forest
world** — deep greens, nature imagery, frosted-glass surfaces, a soft lime → gold → blush
gradient on headline accents, clean sans-serif type, and smooth scroll-driven transitions
where each section holds, then the next one slides over it.

---

## 1. Tech stack

- **React 19 + Vite**, plain CSS per component (no Tailwind, no TypeScript, no UI kit).
- **GSAP 3 + ScrollTrigger** for all scroll animations (scrubbed to scroll).
- **Lenis** smooth scrolling, driven by the GSAP ticker so ScrollTrigger stays in sync.
- **lucide-react** icons (custom inline SVGs for TikTok / Snapchat / Instagram).
- **@fontsource-variable/manrope** — the only font.
- Deployed as static files: **Docker multi-stage build → Caddy** server (Railway), with
  long cache headers for hashed assets and `no-cache` for `index.html`.
- Performance first: WebP images (~100–200 KB each, ≤1920px wide), lazy loading below
  the fold, YouTube loaded only on click, no WebGL.

## 2. Design system

**Colours (CSS variables on `:root`)**

| Token | Value | Use |
|---|---|---|
| `--color-night` | `#060c08` | page background, section edges |
| `--color-deep` | `#0e1e14` | darkest surfaces, dark text on light cards |
| `--color-ocean` | `#1c3824` | dark green surfaces |
| `--color-blue` | `#609648` | primary accent (buttons, icons, checks) |
| `--color-sky` | `#c4e496` | light accent (eyebrows, links, highlights) |
| `--color-cloud` | `#ecf4e6` | main light text |
| headline gradient | `#e9f59a → #c9ecb0 → #f3d6c4 → #f0b9c8` | accent words (`<em>`) in headings |

**Typography** — Manrope Variable everywhere. Headings 500 weight, tight letter-spacing
(−0.015 to −0.035em), large fluid sizes with `clamp()`. Body 1rem, line-height 1.6–1.75.
Eyebrows: small, uppercase or with a dot/line, in `--color-sky`.

**Surfaces** — frosted glass: `rgb(255 255 255 / 0.06–0.1)` + `backdrop-filter: blur(14–18px)`
+ 1px inset edge `rgb(196 228 150 / 0.2–0.3)`, radius 18–28px, soft deep shadows.

**Buttons** — pills (radius 999px), min-height 44–56px. Primary: white with dark text,
often with an arrow in a round green (`--color-blue`) icon. Secondary: glass outline.

**Accessibility** — text contrast ≥ 4.5:1, all targets ≥ 44px, visible focus rings,
`prefers-reduced-motion` disables every animation, semantic headings and labels.

## 3. Global behaviour & motion

- **Preloader**: full-screen, logo with a glowing halo, the name, and a progress bar; it
  waits for the fonts and the hero video (min 1.4s, max 8s), then fades out. Scrolling is
  locked until it's done.
- **Hero → About**: the hero pins; About slides up over it like a sheet while the hero
  scales to 0.88, rounds its corners, darkens, and its headline drifts up and fades.
- **Section-to-section "hold, then move on"** (every pair after that):
  1. When you reach the end of a section it **pins** (stays still).
  2. The next section **slides up over it** like a card on a stack.
  3. Underneath, the held section's content **zooms in to 1.08 and fades** to 0.35
     opacity while a shade layer darkens it to 70%.
  4. The incoming section's content **settles in** from scale 0.94 / opacity 0.2.
  The incoming section always covers the screen — the black page background never shows.
- **Parallax** on photo backgrounds (Testimonials, FAQ, footer).
- **Headings** revealed by a mask wiping upwards; cards fade up with a stagger.
- Sections never meet at a hard edge: each starts and ends in `--color-night`.

## 4. Sections (top to bottom)

### Navbar (overlaid on the hero)
- Left: logo (`/brand/logo.svg`) + "My Wellness My Future".
- Center: one frosted-glass pill with links — Home, About, Services, Stories,
  Membership, FAQs (active link is a white pill).
- Right: "Join us ›" glass button → `#contact`.
- Under 1100px: a menu button opens the links as a glass dropdown.

### 1. Hero (`#home`) — full screen
- Background: looping muted **video of a tree shaped like a woman in a yoga pose** on an
  island in misty water (`/hero/scene.mp4`, poster `/hero/poster.webp`), graded to a
  dusky green (`brightness .62, saturate 1.15`) with a dark radial pool behind the text.
- Centered: **"Wellness is not a destination."** with **"It's a way of living."** in the
  headline gradient; lead: "Discover the dimensions of a healthier, more balanced and
  meaningful life."; buttons **Explore the journey** (white) and **Join us** (glass).
- Bottom: a **carousel of 10 rectangular glass cards** — the dimensions of wellness, each
  with an icon: Occupational, Quantum, Financial, Emotional, Mental, Social, Cultural,
  Physical, Intellectual, Environmental (+ "Wellness"). Arrow buttons, swipe/trackpad,
  snap scrolling, faded edges. Hidden on tablets/phones.

### 2. Who We Are (`#about`) — exactly one screen tall on desktop
- Background: green radial-glow gradient (no photo).
- Left: eyebrow "Who We Are", title "My Wellness – *My Future*", intro "Is more than a
  health initiative — it's a growing community committed to empowering Emirati employees
  to take control of their physical, emotional, and mental wellness.", a "Know us more"
  pill button, and **three glass cards in a row**: Our Mission, Our Vision, Our Story
  (Story has a "Read our story" link).
- Right: tall team photo (`/about/team.webp`, rounded corners 12px/96px) and under it an
  **"Our Goals"** glass card with four checks: Promote preventive health & wellness ·
  Embrace natural, holistic beauty · Wellness for Emirati empowerment · Safe space for
  their growth.
- Phones: photo first, then text, cards stacked, goals last.

### 3. Programs & Services (`#services`)
- Background: green gradient (no photo).
- Header: eyebrow "Our Services", title "Programs *& Services*", "View all services" button.
- 12-column grid of 4 photo cards (5/7 then 7/5 widths), each with a title label. On hover
  a dark panel **slides up from the bottom** with the service icon, title, description
  and "Learn more". Always visible on touch devices.
  1. My BioFit Wellness Programs — structured, multi-stage wellness journey.
  2. Preventive Health Services — early screening and personalized risk assessments.
  3. Regenerative & Aesthetic Services — science + natural healing, aging gracefully.
  4. Wellness Membership Packages — packages that help employees thrive.

### 4. Testimonials (`#testimonials`)
- Background: misty forest with sun rays photo, faded to night at both edges.
- Header: "Testimonials & Success Stories" / "Voices of *Transformation*" / "Hear real
  stories from people who found clarity, strength, and healing."
- Three tall cards:
  - **Ahlam Elhashim** — cut-out portrait on a green glass backdrop, quote: "I struggled
    with focus at work, but after joining the program, I was able to improve my focus and
    learn how to manage my stress effectively."
  - **Omar, 29** and **Mariam, 36** — **video reviews** (YouTube). Thumbnail, quote icon,
    a 3-line excerpt with **Read more** (expands smoothly, hides the play button),
    the name, and a centered **play button**. Playing loads the YouTube video *inside the
    card* (cropped so YouTube's title bar is hidden, no YouTube controls, captions off),
    the card widens while the others narrow, custom click-to-pause, a thin progress bar,
    and an ✕ / Esc to close. Only one video plays at a time; it pauses when scrolled away.

### 5. Membership (`#membership`)
- Background: green gradient (no photo).
- Header: "Go deeper" / "Prioritize your healing with *flexible therapy plans*" /
  "Our membership options are built to support your well-being at every stage."
- **Monthly / Yearly switch** (sliding pill).
- Three plans (Premium highlighted as a light card):
  - **Free** — 0 AED. Ideal for general community members. Weekly newsletter, selected
    awareness events, some blog content, health tips, one free consultation.
  - **Premium** — 100 AED/month or 500 AED/year. Members who want more active support.
    All free benefits, monthly consultations, private webinars/workshops, discounts on
    checkups/treatments, exclusive digital resources.
  - **VIP** — 250 AED/month or 1500 AED/year. Executives using premium services. All
    Premium benefits, direct consultation with experts, priority booking, welcome gift
    box, regenerative service packages.
- Each card: CTA button, "Secure payments guaranteed", benefits with check icons.

### 6. FAQ (`#faq`)
- Background: lounge photo of people talking, behind a dark green tint.
- Left (sticky): "FAQs" / "Everything you need to know *before starting your journey*",
  then "Need more questions?" with a Contact us button.
- Right: frosted-glass accordion, numbered 01–06, one open at a time (first open), the
  section height stays fixed so nothing below jumps. Questions:
  1. What is "My Wellness – My Future"?
  2. Who can join your programs?
  3. What makes your approach different from traditional healthcare?
  4. What does the membership include?
  5. Are your services medically supervised?
  6. Do you offer online consultations or virtual programs?

### 7. Footer (`#contact`)
- Background: green rolling hills photo, dark at the top, revealing the hills at the bottom.
- Top row of two glass cards:
  - **Brand card**: logo, "My Wellness My Future", short description, Instagram / TikTok /
    Snapchat buttons.
  - **CTA card**: "Take the first step" / "Your wellness starts with a step *and lasts a
    lifetime.*" / **Book a consultation** + **Call us**.
- Wide glass panel: **Explore** (section links) · **Wellness categories** (10, with icons,
  linking to the live site pages) · **Get in touch** (phone, email, address rows).
- Bottom bar: "© {year} My Wellness My Future · Powered by Everlast Wellness", Terms of
  use, Privacy policy, Back to top.

## 5. Contact details & links

- Phone: **+971 600 551 615**
- Email: **info@mywellnessmyfuture.com**
- Address: **446 Al Khaleej Al Arabi St, Al Bateen, Abu Dhabi, UAE**
- Instagram: https://www.instagram.com/my_wellness_my_future
- TikTok: https://www.tiktok.com/@my_wellness_my_future
- Snapchat: https://t.snapchat.com/IKcYemkZ
- Join: https://mywellnessmyfuture.com/join-us/
- Powered by: https://everlastwellness.com/

## 6. Assets (in `/public`)

- `brand/logo.svg`, `favicon.svg`
- `hero/scene.mp4` (1920×1080, 10s loop, no audio), `hero/poster.webp`
- `about/team.webp`
- `services/img3|5|6|9.webp` + `icon007|010|012|022.png`
- `testimonials/ahlam.webp`, `omar.webp`, `mariam.webp`
- `faq/faq-bg.webp`
- `nature/forest-rays.webp`, `hills.webp` (+ fern, ferns, pond, moss, forest-mist spares) —
  CC0 / public-domain photos from Wikimedia Commons, darkened and compressed.

## 7. Responsive rules

- Breakpoints around 1100px, 900–960px, 640px; no horizontal scroll at 375–1920px.
- Multi-column grids collapse to one column; hover-only interactions get always-visible
  touch versions; hero carousel hidden on small screens; transitions get lighter values.

## 8. Open items

- Terms of use / Privacy policy have no pages yet (`#`).
- Contact buttons go to the footer; there is no contact form or backend.
- The two video quotes still mention "Unwind" (template text) — replace with real wording.
- The names "Omar" and "Mariam" are placeholders; use the real first names if known.

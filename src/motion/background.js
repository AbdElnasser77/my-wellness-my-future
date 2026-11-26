import { ScrollTrigger, gsap } from './core.js'

/*
 * Scroll-driven page colour.
 *
 * The page background is one CSS variable (--night, an "R G B" triplet)
 * that every section's background and edge fades use. As each section
 * takes over the middle of the screen, the whole page fades to that
 * section's own deep shade — all dark enough to keep text readable.
 * Reduced motion: the colour still changes, just instantly.
 */
const PALETTE = {
  '#home': '6 12 8', //          forest night
  '#about': '6 12 8', //         (video section)
  '#goals': '14 30 21', //       deep moss
  '#services': '9 24 27', //     dark teal pond
  '#testimonials': '16 26 13', // olive shade
  '#membership': '13 23 31', //  night blue-green
  '#faq': '20 24 15', //         bark
  '#contact': '8 18 11', //      meadow dusk
}

export function backgroundMotion() {
  const root = document.documentElement
  const instant = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const triggers = []

  const fadeTo = (rgb) =>
    gsap.to(root, { '--night': rgb, duration: instant ? 0 : 1.2, ease: 'power2.inOut', overwrite: 'auto' })

  Object.entries(PALETTE).forEach(([sel, rgb]) => {
    const el = document.querySelector(sel)
    if (!el) return
    triggers.push(
      ScrollTrigger.create({
        trigger: el,
        start: 'top 55%',
        end: 'bottom 55%',
        onToggle: (self) => self.isActive && fadeTo(rgb),
      }),
    )
  })

  return {
    revert() {
      triggers.forEach((t) => t.kill())
      gsap.killTweensOf(root)
      root.style.removeProperty('--night')
    },
  }
}

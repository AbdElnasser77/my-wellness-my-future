import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { CustomEase } from 'gsap/CustomEase'

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase)

/*
 * One motion language for the whole site.
 *   cinema  — long, soft landing (entrances)
 *   chapter — symmetric in-out (scrubbed transitions, masks)
 *   lift    — quick out (micro-interactions)
 */
CustomEase.create('cinema', '0.22, 1, 0.36, 1')
CustomEase.create('chapter', '0.65, 0, 0.35, 1')
CustomEase.create('lift', '0.33, 1, 0.68, 1')

export const DUR = { xs: 0.4, s: 0.7, m: 1, l: 1.4, xl: 2.2 }

// media-query conditions shared by every module
export const MQ = {
  desktop: '(min-width: 900px) and (prefers-reduced-motion: no-preference)',
  mobile: '(max-width: 899px) and (prefers-reduced-motion: no-preference)',
}

/*
 * Masked line-by-line heading reveal.
 * Lines rise out of their own mask with a stagger; gradient words then get
 * a slow light sweep. Splits again (and rebuilds the animation) when the
 * width changes or fonts load — SplitText's autoSplit.
 *   start: ScrollTrigger start, or null to return a paused timeline
 */
export function revealHeading(el, { start = 'top 82%', delay = 0, stagger = 0.11, duration = DUR.l, autoSplit = true } = {}) {
  if (!el) return null
  let tl
  let done = false

  const split = SplitText.create(el, {
    type: 'lines',
    mask: 'lines',
    linesClass: 'split-line',
    autoSplit,
    onSplit(self) {
      // re-split after the reveal already played (resize): just show it
      if (done) return null
      // looked up after splitting: a gradient phrase that spans two lines
      // is sliced into one piece per line
      const emphasis = el.querySelectorAll('em, .hero__gradient')
      tl = gsap.timeline({
        delay,
        paused: start === null,
        onComplete: () => { done = true },
        scrollTrigger: start ? { trigger: el, start, once: true } : undefined,
      })
      tl.from(self.lines, { yPercent: 110, duration, ease: 'cinema', stagger })
      if (emphasis.length) {
        tl.fromTo(
          emphasis,
          { backgroundPosition: '100% 0' },
          { backgroundPosition: '0% 0', duration: 2.2, ease: 'chapter' },
          `-=${duration * 0.55}`,
        )
      }
      return tl
    },
  })

  return { split, get timeline() { return tl } }
}

/* fade + rise for a group of elements, staggered, once */
export function riseIn(targets, { trigger, start = 'top 80%', y = 40, stagger = 0.08, duration = DUR.m, delay = 0, ...rest } = {}) {
  const els = gsap.utils.toArray(targets)
  if (!els.length) return null
  return gsap.from(els, {
    y,
    opacity: 0,
    duration,
    delay,
    stagger,
    ease: 'cinema',
    clearProps: 'transform,opacity',
    scrollTrigger: { trigger: trigger || els[0], start, once: true },
    ...rest,
  })
}

export { gsap, ScrollTrigger, SplitText }

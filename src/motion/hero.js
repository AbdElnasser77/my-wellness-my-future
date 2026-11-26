import { DUR, MQ, ScrollTrigger, gsap, revealHeading } from './core.js'

/*
 * Hero — cinematic entrance + the hero → "Who We Are" chapter change.
 *
 * Entrance (plays once, right as the preloader lifts):
 *   video settles from a slight zoom · atmosphere fades in · navbar drops in ·
 *   headline rises line by line · gradient line catches the light · lead
 *   arrives softly · CTAs scale in · wellness cards rise one after another.
 *
 * Scroll (desktop): the hero pins while "Who We Are" slides over it; the
 * hero shrinks, rounds and dims, its layers drifting at different speeds.
 * The video is only ever scaled uniformly — the tree is never distorted.
 */
export function heroMotion() {
  const hero = document.querySelector('#home')
  const about = document.querySelector('#about')
  if (!hero) return

  const mm = gsap.matchMedia()

  mm.add({ motion: '(prefers-reduced-motion: no-preference)', desktop: MQ.desktop }, ({ conditions }) => {
    // loops (mist, fireflies) only run while the hero is on screen
    ScrollTrigger.create({
      trigger: hero,
      start: 'top bottom',
      end: 'bottom top',
      toggleClass: { targets: hero, className: 'is-visible' },
    })

    if (!conditions.motion) return

    // ---------- entrance ----------
    const title = revealHeading(hero.querySelector('.hero__title'), {
      start: null,
      stagger: 0.14,
      duration: 1.5,
      autoSplit: false,
    })

    const intro = gsap.timeline({ defaults: { ease: 'cinema' } })
    intro
      .from('.hero__video', { scale: 1.14, duration: 3.2, ease: 'power2.out' }, 0)
      .from('.hero__atmos', { opacity: 0, duration: 2.4, ease: 'power1.out' }, 0.2)
      .from('.nav > *', { y: -24, opacity: 0, duration: DUR.m, stagger: 0.08, clearProps: 'transform,opacity' }, 0.35)
      .add(() => title?.timeline?.play(), 0.5)
      .from('.hero__lead', { y: 22, opacity: 0, duration: 1.2 }, 1.25)
      .from('.hero__actions > *', { y: 16, scale: 0.92, opacity: 0, duration: 1, stagger: 0.1, clearProps: 'transform,opacity' }, 1.45)

    if (conditions.desktop) {
      intro
        .from('.dimensions__arrow', { opacity: 0, duration: 0.8 }, 1.8)
        .from(
          '.dimension',
          { y: 50, opacity: 0, duration: 1.1, stagger: { each: 0.07, from: 'start' }, clearProps: 'transform,opacity' },
          1.7,
        )
    }

    // ---------- chapter change into "Who We Are" (desktop) ----------
    if (conditions.desktop && about) {
      ScrollTrigger.create({ trigger: hero, start: 'top top', end: 'bottom top', pin: true, pinSpacing: false })

      gsap
        .timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: about, start: 'top bottom', end: 'top top', scrub: true },
        })
        .to('.hero__stage', { scale: 0.9, borderRadius: 40 }, 0)
        .to('.hero__dim', { opacity: 0.65 }, 0)
        // layers drift at different speeds → depth
        .to('.hero__video', { yPercent: -4 }, 0)
        .to('.hero__atmos', { yPercent: -18 }, 0)
        .to('.dimensions', { y: -80, opacity: 0 }, 0)
        .to('.hero__content', { '--exit-y': '-180px', opacity: 0, duration: 0.55 }, 0)
        .fromTo(
          about,
          { borderTopLeftRadius: 56, borderTopRightRadius: 56 },
          { borderTopLeftRadius: 0, borderTopRightRadius: 0 },
          0,
        )
    }

    return () => title?.split?.revert()
  })

  return mm
}

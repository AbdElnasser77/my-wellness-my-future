import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Hero → "Who We Are" transition (GSAP ScrollTrigger, scrubbed to scroll):
 *   - the hero pins in place while section 2 slides up over it like a sheet
 *   - underneath, the hero shrinks a little, rounds its corners and darkens
 *   - the hero headline drifts up and fades out early
 *   - section 2's rounded top corners flatten as it reaches the top
 * Built once the page is ready (after the preloader), so measurements are right.
 */
export default function useHeroTransition(ready) {
  useEffect(() => {
    if (!ready) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const hero = document.querySelector('#home')
    const about = document.querySelector('#about')
    if (!hero || !about) return

    const ctx = gsap.context(() => {
      // keep the hero fixed while section 2 scrolls up over it
      ScrollTrigger.create({
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        pin: true,
        pinSpacing: false,
      })

      gsap
        .timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: about,
            start: 'top bottom', // section 2 starts entering…
            end: 'top top', // …until it covers the screen
            scrub: true,
          },
        })
        .to('.hero__stage', { scale: 0.88, borderRadius: 40 }, 0)
        .to('.hero__dim', { opacity: 0.6 }, 0)
        .to('.hero__content', { '--exit-y': '-160px', opacity: 0, duration: 0.55 }, 0)
        .fromTo(
          about,
          { borderTopLeftRadius: 56, borderTopRightRadius: 56 },
          { borderTopLeftRadius: 0, borderTopRightRadius: 0 },
          0,
        )
    })

    // fonts/images have settled by now — make sure positions are fresh
    ScrollTrigger.refresh()

    return () => ctx.revert()
  }, [ready])
}

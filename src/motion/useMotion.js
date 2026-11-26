import { useEffect } from 'react'
import { ScrollTrigger, gsap } from './core.js'
import { heroMotion } from './hero.js'
import { storyMotion } from './story.js'
import { sectionMotion } from './sections.js'
import { microMotion } from './micro.js'
import { backgroundMotion } from './background.js'
import './motion.css'

/**
 * Builds the whole motion system once the page is ready (after the
 * preloader: fonts and the hero video are in, so measurements are right).
 *
 * Order matters for ScrollTrigger: pins first (top → bottom), then the
 * reveals, then a sort + refresh so every trigger knows its real position.
 * Each module uses gsap.matchMedia(), so animations rebuild themselves at
 * breakpoint changes and vanish for prefers-reduced-motion. Everything is
 * killed and reverted on unmount (and in dev StrictMode double-mounts).
 */
export default function useMotion(ready) {
  useEffect(() => {
    if (!ready) return

    const modules = [heroMotion(), storyMotion(), sectionMotion(), microMotion(), backgroundMotion()]

    ScrollTrigger.sort()
    ScrollTrigger.refresh()

    // late layout shifts (images decoding, fonts) → re-measure once
    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', onLoad)

    return () => {
      window.removeEventListener('load', onLoad)
      modules.forEach((m) => m?.revert())
      gsap.set('.nav > *', { clearProps: 'all' })
    }
  }, [ready])
}

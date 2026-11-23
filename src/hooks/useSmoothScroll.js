import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Lenis smooth scrolling for the whole page, driven by GSAP's ticker so
 * ScrollTrigger animations stay perfectly in sync with the smoothed scroll.
 * Paused while `enabled` is false (e.g. during the preloader).
 * Skipped entirely for visitors who prefer reduced motion.
 */
export default function useSmoothScroll(enabled) {
  const lenisRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({
      lerp: 0.09, // lower = smoother / floatier
      anchors: true, // smooth-scroll for in-page links like #about
    })
    lenisRef.current = lenis

    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  useEffect(() => {
    const lenis = lenisRef.current
    if (!lenis) return
    if (enabled) lenis.start()
    else lenis.stop()
  }, [enabled])
}

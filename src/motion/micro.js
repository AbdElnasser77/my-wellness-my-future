import { gsap } from './core.js'

const MAGNETIC = [
  '[data-magnetic]',
  '.hero__button',
  '.services__all',
  '.faq__contact-button',
  '.footer__join',
].join(',')

/*
 * Magnetic buttons: on a real mouse, primary buttons lean gently toward the
 * cursor and spring back when it leaves. Uses quickTo (one tween per axis,
 * reused) so pointer moves stay cheap. Skipped on touch screens and for
 * reduced motion.
 */
export function microMotion() {
  const mm = gsap.matchMedia()

  mm.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
    const cleanups = gsap.utils.toArray(MAGNETIC).map((el) => {
      const strength = 0.22
      const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' })
      const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' })

      const move = (e) => {
        const r = el.getBoundingClientRect()
        xTo((e.clientX - (r.left + r.width / 2)) * strength)
        yTo((e.clientY - (r.top + r.height / 2)) * strength)
      }
      const leave = () => {
        xTo(0)
        yTo(0)
      }

      el.addEventListener('pointermove', move)
      el.addEventListener('pointerleave', leave)
      return () => {
        el.removeEventListener('pointermove', move)
        el.removeEventListener('pointerleave', leave)
        gsap.set(el, { x: 0, y: 0 })
      }
    })

    return () => cleanups.forEach((c) => c())
  })

  return mm
}

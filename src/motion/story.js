import { MQ, ScrollTrigger, gsap } from './core.js'

/*
 * "Who We Are" story over the forest video.
 *
 * Desktop: the section pins and scrolling steps through the four texts
 * (who we are → mission → vision → story). Each text drifts up and softly
 * blurs out as the next rises in; the 01–04 bar on the right follows, and
 * scrolling snaps to the nearest step. Phones / reduced motion: no pin,
 * the steps simply stack (the CSS default).
 *
 * The video loops continuously while the section is on screen; only the
 * text changes.
 */
export function storyMotion() {
  const section = document.querySelector('.story')
  if (!section) return null
  const video = section.querySelector('.story__video')
  const steps = gsap.utils.toArray('.story__step', section)
  const items = gsap.utils.toArray('.story__nav-item', section)
  const thumb = section.querySelector('.story__thumb')

  const mm = gsap.matchMedia()

  mm.add({ desktop: MQ.desktop, any: '(min-width: 0px)' }, ({ conditions }) => {
    // the video keeps playing the whole time the section is on screen —
    // only the text steps. It pauses once the section has fully left the
    // screen (IntersectionObserver sees the real, pinned position).
    let io
    if (video) {
      io = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {})
        else video.pause()
      })
      io.observe(section)
    }

    if (!conditions.desktop || steps.length < 2) {
      // light version: each step rises in as it scrolls by (video keeps playing)
      steps.forEach((step) => {
        gsap.from(step, {
          y: 30,
          opacity: 0,
          duration: 1,
          ease: 'cinema',
          clearProps: 'transform,opacity',
          scrollTrigger: { trigger: step, start: 'top 80%', once: true },
        })
      })
      return () => io?.disconnect()
    }

    section.classList.add('story--pinned')
    const setActive = (i) => items.forEach((el, n) => el.classList.toggle('is-active', n === i))
    setActive(0)

    const tl = gsap.timeline({ defaults: { ease: 'chapter' } })
    tl.addLabel('s0')
    gsap.set(steps.slice(1), { opacity: 0, y: 50 })

    steps.forEach((step, i) => {
      if (i === 0) return
      const prev = steps[i - 1]
      tl.to(prev, { opacity: 0, y: -50, filter: 'blur(6px)', duration: 0.5 }, `s${i - 1}+=0.5`)
        .fromTo(step, { opacity: 0, y: 50, filter: 'blur(6px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6 }, '<0.2')
        .addLabel(`s${i}`)
    })
    tl.to({}, { duration: 0.5 }) // short hold on the last step

    // the bar's thumb travels the track across the whole sequence
    if (thumb) {
      tl.fromTo(thumb, { yPercent: 0 }, { yPercent: (steps.length - 1) * 100, ease: 'none', duration: tl.duration() }, 0)
    }

    const labels = Object.values(tl.labels).map((t) => t / tl.duration())

    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: () => `+=${(steps.length - 1) * window.innerHeight}`,
      pin: true,
      scrub: 0.8,
      animation: tl,
      snap: { snapTo: labels, duration: { min: 0.3, max: 0.8 }, ease: 'power2.inOut', delay: 0.05 },
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const t = self.progress * tl.duration()
        let i = 0
        Object.values(tl.labels).forEach((at, n) => {
          if (t >= at - 0.35) i = n
        })
        setActive(i)
      },
    })

    return () => {
      io?.disconnect()
      section.classList.remove('story--pinned')
      gsap.set(steps, { clearProps: 'all' })
      items.forEach((el) => el.classList.remove('is-active'))
    }
  })

  return mm
}

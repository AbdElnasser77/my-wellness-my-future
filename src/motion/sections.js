import { DUR, MQ, gsap, revealHeading, riseIn } from './core.js'

/*
 * Per-section reveals (no parallax here — that's kept for the hero only).
 * Each section enters with a clear
 * hierarchy: heading first (masked lines), then supporting text, then the
 * cards/media. Desktop gets the full choreography; phones get shorter,
 * lighter versions of the same moves.
 */
export function sectionMotion() {
  const mm = gsap.matchMedia()
  const splits = []
  const heading = (sel, opts) => {
    const r = revealHeading(document.querySelector(sel), opts)
    if (r) splits.push(r.split)
  }

  mm.add({ desktop: MQ.desktop, mobile: MQ.mobile }, ({ conditions }) => {
    const d = conditions.desktop
    const y = d ? 48 : 28

    /* ---------------- Separators: line draws out from the centre ---------------- */
    gsap.utils.toArray('.divider').forEach((div) => {
      gsap
        .timeline({ scrollTrigger: { trigger: div, start: 'top 92%', once: true } })
        .from(div.querySelector('.divider__line'), { scaleX: 0, duration: 1.6, ease: 'chapter' })
        .from(div.querySelector('.divider__mark'), { scale: 0, opacity: 0, duration: 0.7, ease: 'back.out(2.2)' }, 0.25)
    })

    /* ---------------- Our Goals ---------------- */
    const goals = document.querySelector('.goals')
    if (goals) {
      const rows = gsap.utils.toArray('.goals__row')
      const tl = gsap.timeline({ scrollTrigger: { trigger: '.goals__card', start: 'top 80%', once: true } })
      tl.from('.goals__card', { y, opacity: 0, scale: 0.97, duration: 1.3, ease: 'cinema', clearProps: 'transform,opacity' }, 0.15)
        .from('.goals__head > *', { y: 20, opacity: 0, duration: 0.9, ease: 'cinema', stagger: 0.1, clearProps: 'transform,opacity' }, 0.5)
        .from(rows, { y: 24, opacity: 0, duration: 0.9, ease: 'cinema', stagger: 0.12, clearProps: 'transform,opacity' }, 0.65)
      // each bullet lights up as its row arrives
      tl.from('.goals__bullet', { scale: 0, duration: 0.6, ease: 'back.out(2.5)', stagger: 0.12 }, 0.8)
    }

    /* ---------------- Services ---------------- */
    heading('.services__title')
    riseIn(['.services__eyebrow', '.services__all'], { trigger: '.services__head', y: 24, stagger: 0.12 })
    gsap.utils.toArray('.services__card').forEach((card, i) => {
      const photo = card.querySelector('.services__photo')
      gsap
        .timeline({ scrollTrigger: { trigger: card, start: 'top 90%', once: true }, delay: d ? (i % 2) * 0.12 : 0 })
        .fromTo(
          card,
          { y: y * 1.4, opacity: 0, clipPath: 'inset(14% 0% 0% 0% round 24px)' },
          { y: 0, opacity: 1, clipPath: 'inset(0% 0% 0% 0% round 24px)', duration: 1.3, ease: 'cinema', clearProps: 'transform,opacity,clipPath' },
        )
        .from(photo, { scale: 1.3, duration: 1.8, ease: 'cinema', clearProps: 'transform' }, 0)
    })

    /* ---------------- Testimonials ---------------- */
    heading('.voices__title')
    riseIn(['.voices__eyebrow', '.voices__lead'], { trigger: '.voices__head', y: 20, stagger: 0.15, delay: 0.15 })
    // cards arrive at different moments and depths
    const cardMoves = [
      { y: 90, delay: 0 },
      { y: 140, delay: 0.18 },
      { y: 110, delay: 0.32 },
    ]
    gsap.utils.toArray('.voices__card').forEach((card, i) => {
      const m = cardMoves[i % cardMoves.length]
      const body = card.querySelector('.voices__body')
      gsap
        .timeline({ scrollTrigger: { trigger: '.voices__grid', start: 'top 85%', once: true }, delay: m.delay })
        .from(card, { y: d ? m.y : 40, opacity: 0, duration: 1.3, ease: 'cinema', clearProps: 'transform,opacity' })
        // quote text: masked upward reveal
        .fromTo(
          body,
          { clipPath: 'inset(100% 0% 0% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'chapter', clearProps: 'clipPath' },
          0.35,
        )
    })
    /* ---------------- Membership ---------------- */
    heading('.plans__title')
    riseIn(['.plans__eyebrow', '.plans__lead', '.plans__switch'], { trigger: '.plans__head', y: 20, stagger: 0.12, delay: 0.15 })
    const featured = document.querySelector('.plans__card--featured')
    gsap
      .timeline({ scrollTrigger: { trigger: '.plans__grid', start: 'top 85%', once: true } })
      .from('.plans__card:not(.plans__card--featured)', { y, opacity: 0, duration: 1.2, ease: 'cinema', stagger: 0.16, clearProps: 'transform,opacity' })
      // Premium arrives last, from a little further, then lights up
      .from(featured, { y: y * 1.6, scale: 0.94, opacity: 0, duration: 1.4, ease: 'cinema', clearProps: 'transform,opacity' }, 0.2)
      .add(() => featured?.classList.add('is-lit'), '-=0.5')
      .from('.plans__benefits li', { x: -10, opacity: 0, duration: 0.6, ease: 'cinema', stagger: 0.03, clearProps: 'transform,opacity' }, '-=0.9')

    /* ---------------- FAQ ---------------- */
    heading('.faq__title')
    riseIn(['.faq__eyebrow', '.faq__contact'], { trigger: '.faq__intro', y: 24, stagger: 0.2, delay: 0.3 })
    riseIn('.faq__item', { trigger: '.faq__list', start: 'top 82%', y: 30, stagger: 0.09, duration: 0.9 })

    /* ---------------- Footer ---------------- */
    heading('.footer__title', { start: 'top 85%' })
    riseIn('.footer__form', { trigger: '.footer__top', start: 'top 70%', y: 24, delay: 0.5 })
    riseIn(['.footer__brand', '.footer__col'], { trigger: '.footer__main', start: 'top 92%', y: 30, stagger: 0.1 })
    riseIn('.footer__bar > *', { trigger: '.footer__bar', start: 'top 99%', y: 10, stagger: 0.08, duration: 0.8 })

    return () => {
      splits.forEach((s) => s.revert())
      splits.length = 0
    }
  })

  return mm
}

export { DUR }

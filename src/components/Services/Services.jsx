import { useEffect, useRef } from 'react'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SERVICES } from './servicesContent.js'
import './Services.css'

gsap.registerPlugin(ScrollTrigger)

/*
 * "Programs & Services" — 12-column grid with alternating 5/7 and 7/5 card
 * widths. Each card shows its photo with a title pill + arrow; on hover/focus
 * a panel slides up from the bottom with the icon, title and description.
 */
function Services() {
  const ref = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.from('[data-reveal]', {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.08,
        clearProps: 'transform,opacity',
        scrollTrigger: { trigger: '.services__head', start: 'top 80%', once: true },
      })

      // each card rises in as it enters the viewport
      gsap.utils.toArray('.services__card').forEach((card) => {
        gsap.from(card, {
          y: 50,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: { trigger: card, start: 'top 88%', once: true },
        })
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section className="services" id="services" ref={ref} aria-labelledby="services-title">
      <div className="services__inner">
        <header className="services__head">
          <div>
            <p className="services__eyebrow" data-reveal>
              <span aria-hidden="true" />
              Our Services
            </p>
            <h2 className="services__title" id="services-title" data-reveal>
              Programs <em>&amp; Services</em>
            </h2>
          </div>
          <a href="#contact" className="services__all" data-reveal>
            View all services
            <span className="services__all-icon" aria-hidden="true">
              <ArrowRight size={18} strokeWidth={1.75} />
            </span>
          </a>
        </header>

        <div className="services__grid">
          {SERVICES.map((s) => (
            <a key={s.id} href="#contact" className="services__card">
              <img
                className="services__photo"
                src={s.image}
                alt=""
                width="1024"
                height="683"
                loading="lazy"
                decoding="async"
              />

              {/* resting state: title pill */}
              <div className="services__bar" aria-hidden="true">
                <span className="services__pill">{s.title}</span>
              </div>

              {/* hover state: slides up from the bottom */}
              <div className="services__panel">
                <span className="services__icon">
                  <img src={s.icon} alt="" width="150" height="150" loading="lazy" />
                </span>
                <h3 className="services__card-title">{s.title}</h3>
                <p className="services__card-text">{s.text}</p>
                <span className="services__more">
                  Learn more
                  <ArrowUpRight size={16} strokeWidth={1.75} aria-hidden="true" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services

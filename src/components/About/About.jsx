import { useEffect, useRef } from 'react'
import { ArrowRight, ArrowUpRight, BookOpen, Eye, Target } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { STEPS } from './aboutContent.js'
import './About.css'

gsap.registerPlugin(ScrollTrigger)

const [WHO, MISSION, VISION, STORY] = STEPS

/*
 * "Who We Are" — left: eyebrow, headline, intro, buttons and a bento of
 * Mission / Vision / Story cards. Right: tall photo with asymmetric corners.
 * Elements fade up once as they scroll into view.
 */
function About() {
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
        scrollTrigger: { trigger: ref.current, start: 'top 70%', once: true },
      })

      // photo: widens from a narrow slice to full width while it scrolls
      // into view, and the picture inside drifts/zooms (parallax)
      gsap.fromTo(
        '.about__visual',
        { clipPath: 'inset(6% 0% 6% 38% round 12px 96px 12px 96px)' },
        {
          clipPath: 'inset(0% 0% 0% 0% round 12px 96px 12px 96px)',
          ease: 'none',
          scrollTrigger: {
            trigger: '.about__visual',
            start: 'top 95%',
            end: 'top 25%',
            scrub: true,
          },
        },
      )
      gsap.fromTo(
        '.about__photo',
        { yPercent: -5, scale: 1.24 },
        {
          yPercent: 5,
          scale: 1.12, // never below 1.12, so the cut-off hands at the edges stay hidden
          ease: 'none',
          scrollTrigger: {
            trigger: '.about__visual',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      )
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section className="about" id="about" ref={ref} aria-labelledby="about-title">

      <div className="about__inner">
        {/* ---------- Left column ---------- */}
        <div className="about__text">
          <p className="about__eyebrow" data-reveal>
            <span aria-hidden="true" />
            {WHO.label}
          </p>

          <h2 className="about__title" id="about-title" data-reveal>
            {WHO.title[0]} <em>{WHO.title[1]}</em>
          </h2>

          <p className="about__lead" data-reveal>
            {WHO.text}
          </p>

          <div className="about__actions" data-reveal>
            <a href="#contact" className="about__button">
              Know us more
              <span className="about__button-icon" aria-hidden="true">
                <ArrowRight size={18} strokeWidth={1.75} />
              </span>
            </a>
          </div>

          {/* ---------- Bento cards ---------- */}
          <div className="about__cards">
            <article className="about__card about__card--ocean" data-reveal>
              <span className="about__card-icon">
                <Target size={22} strokeWidth={1.5} aria-hidden="true" />
              </span>
              <h3 className="about__card-title">{MISSION.label}</h3>
              <p className="about__card-text">
                A visionary wellness project by Everlast Wellness Medical Center, empowering
                Emirati employees since October 2023.
              </p>
            </article>

            <article className="about__card about__card--sky" data-reveal>
              <span className="about__card-icon">
                <Eye size={22} strokeWidth={1.5} aria-hidden="true" />
              </span>
              <h3 className="about__card-title">{VISION.label}</h3>
              <p className="about__card-text">
                A world where wellness is a right, not a luxury — because when women are well,
                communities thrive.
              </p>
            </article>

            <article className="about__card about__card--deep" data-reveal>
              <span className="about__card-icon">
                <BookOpen size={22} strokeWidth={1.5} aria-hidden="true" />
              </span>
              <h3 className="about__card-title">{STORY.label}</h3>
              <p className="about__card-text">
                Born in Abu Dhabi in March 2023 to help every woman take charge of her health
                journey with confidence, compassion and clarity.
              </p>
              <a href="#contact" className="about__card-link">
                Read our story
                <ArrowUpRight size={16} strokeWidth={1.75} aria-hidden="true" />
              </a>
            </article>
          </div>
        </div>

        {/* ---------- Right column: tall photo ---------- */}
        <figure className="about__visual">
          <img
            className="about__photo"
            src="/about/team.webp"
            alt="Emirati team members talking together in a bright office"
            width="890"
            height="720"
            decoding="async"
          />
        </figure>
      </div>
    </section>
  )
}

export default About

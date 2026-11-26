import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { DIMENSIONS } from './dimensions.js'
import './Hero.css'

/*
 * Everything sits in .hero__stage, which the scroll transition scales
 * and darkens as section 2 slides over (see motion/hero.js).
 *
 * Layer stack (back → front):
 *   scene   – 16:9 box holding the background video
 *   shade   – gradients that keep the text readable
 *   content – headline, copy, buttons and small controls
 */
// firefly positions (% of the hero), drift duration, delay and size
const FIREFLIES = [
  { x: 14, y: 62, d: 9, delay: 0, s: 1 },
  { x: 22, y: 38, d: 11, delay: -3, s: 0.7 },
  { x: 31, y: 70, d: 10, delay: -6, s: 0.8 },
  { x: 68, y: 58, d: 12, delay: -2, s: 1 },
  { x: 76, y: 34, d: 9.5, delay: -5, s: 0.6 },
  { x: 84, y: 66, d: 11.5, delay: -1, s: 0.9 },
  { x: 58, y: 24, d: 13, delay: -7, s: 0.6 },
  { x: 42, y: 78, d: 10.5, delay: -4, s: 0.7 },
]

function Hero({ onVideoReady }) {
  // people who ask for reduced motion get the still first frame
  const reduceMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <section className="hero" id="home">
      <div className="hero__stage">
        <div className="hero__scene">
          {/* the poster is the video's own first frame, so there's no jump
              when playback starts */}
          <video
            className="hero__layer hero__video"
            src="/hero/scene.mp4"
            poster="/hero/poster.webp"
            width="1920"
            height="1080"
            autoPlay={!reduceMotion}
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
            onCanPlayThrough={onVideoReady}
            onError={onVideoReady}
          />
        </div>

        <div className="hero__shade" aria-hidden="true" />

        {/* atmosphere: two slow mist layers and a few fireflies (decorative,
            transform-only, paused while the hero is off screen) */}
        <div className="hero__atmos" aria-hidden="true">
          <span className="hero__mist hero__mist--back" />
          <span className="hero__mist hero__mist--front" />
          {FIREFLIES.map((f, i) => (
            <span
              key={i}
              className="hero__firefly"
              style={{ left: `${f.x}%`, top: `${f.y}%`, '--d': `${f.d}s`, '--delay': `${f.delay}s`, '--s': f.s }}
            />
          ))}
        </div>

        <div className="hero__content">
          <h1 className="hero__title">
            Wellness is not a destination.
            <span className="hero__gradient">It&rsquo;s a way of living.</span>
          </h1>
          <p className="hero__lead">
            Discover the dimensions of a healthier, more balanced and meaningful life.
          </p>
          <div className="hero__actions">
            <a href="#about" className="hero__button hero__button--light">
              Explore the journey
            </a>
            <a href="#contact" className="hero__button hero__button--glass">
              Join us
            </a>
          </div>
        </div>

        <DimensionCarousel />

        {/* darkens the hero during the transition into section 2 */}
        <div className="hero__dim" aria-hidden="true" />
      </div>
    </section>
  )
}

/*
 * One row of rectangular glass cards under the tree. Scrolls sideways (arrows, swipe or
 * trackpad) with snap points; the arrows dim at either end.
 */
function DimensionCarousel() {
  const trackRef = useRef(null)
  const [edges, setEdges] = useState({ start: true, end: false })

  const update = () => {
    const el = trackRef.current
    if (!el) return
    setEdges({
      start: el.scrollLeft <= 2,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2,
    })
  }

  useEffect(() => {
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const scrollByPage = (dir) => {
    const el = trackRef.current
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' })
  }

  return (
    <nav className="dimensions" aria-label="Dimensions of wellness">
      <button
        type="button"
        className="dimensions__arrow"
        onClick={() => scrollByPage(-1)}
        disabled={edges.start}
        aria-label="Previous dimensions"
      >
        <ChevronLeft size={20} strokeWidth={1.75} />
      </button>

      <ul
        ref={trackRef}
        className={`dimensions__track${edges.start ? ' at-start' : ''}${edges.end ? ' at-end' : ''}`}
        onScroll={update}
      >
        {DIMENSIONS.map(({ name, icon: Icon }) => (
          <li key={name} className="dimension">
            <a href={`#${name.toLowerCase()}`} className="dimension__pill">
              <span className="dimension__icon">
                <Icon size={18} strokeWidth={1.5} aria-hidden="true" />
              </span>
              <span className="dimension__text">
                <strong>{name}</strong>
                Wellness
              </span>
            </a>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="dimensions__arrow"
        onClick={() => scrollByPage(1)}
        disabled={edges.end}
        aria-label="Next dimensions"
      >
        <ChevronRight size={20} strokeWidth={1.75} />
      </button>
    </nav>
  )
}



export default Hero

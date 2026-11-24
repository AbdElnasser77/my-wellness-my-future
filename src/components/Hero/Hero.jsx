import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ChevronLeft, ChevronRight, Maximize, Minimize, Mouse } from 'lucide-react'
import { DIMENSIONS } from './dimensions.js'
import './Hero.css'

/*
 * Everything sits in .hero__stage, which the scroll transition scales
 * and darkens as section 2 slides over (see hooks/useHeroTransition).
 *
 * Layer stack (back → front):
 *   scene   – 16:9 box holding the background video
 *   shade   – gradients that keep the text readable
 *   content – headline, copy, buttons and small controls
 */
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

        <div className="hero__content">
          <p className="hero__eyebrow">A new perspective on wellness</p>
          <h1 className="hero__title">
            <span>Wellness is not</span>
            <span>a destination.</span>
            <em>It’s a way of living.</em>
          </h1>
          <p className="hero__lead">
            Discover the dimensions of a healthier, more balanced and meaningful life.
          </p>
          <a href="#dimensions" className="hero__button">
            Explore the Tree
            <ArrowDown size={18} strokeWidth={1.75} aria-hidden="true" />
          </a>
        </div>

        <a href="#about" className="hero__scroll">
          <Mouse size={26} strokeWidth={1.25} aria-hidden="true" />
          Scroll to explore
        </a>

        <DimensionCarousel />

        <SectionDots />
        <FullscreenButton />

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

function SectionDots() {
  const sections = ['Home', 'The Philosophy', 'Dimensions', 'Programs']
  return (
    <nav className="hero__dots" aria-label="Page sections">
      {sections.map((label, i) => (
        <a
          key={label}
          href={i === 0 ? '#home' : `#${label.toLowerCase().replace('the ', '')}`}
          className="hero__dot"
          aria-label={label}
          aria-current={i === 0 ? 'true' : undefined}
        />
      ))}
    </nav>
  )
}

function FullscreenButton() {
  const [isFull, setIsFull] = useState(false)

  useEffect(() => {
    const onChange = () => setIsFull(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  if (!document.fullscreenEnabled) return null

  const toggle = () =>
    document.fullscreenElement
      ? document.exitFullscreen()
      : document.documentElement.requestFullscreen()

  return (
    <div className="hero__controls">
      <button
        type="button"
        className="hero__control"
        onClick={toggle}
        aria-label={isFull ? 'Exit fullscreen' : 'Enter fullscreen'}
      >
        {isFull ? <Minimize size={20} strokeWidth={1.5} /> : <Maximize size={20} strokeWidth={1.5} />}
      </button>
    </div>
  )
}

export default Hero

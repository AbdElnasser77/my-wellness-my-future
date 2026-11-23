import { useEffect, useState } from 'react'
import { ArrowDown, Maximize, Minimize, Mouse } from 'lucide-react'
import { DIMENSIONS } from './dimensions.js'
import './Hero.css'

/*
 * Everything sits in .hero__stage, which the scroll transition scales
 * and darkens as section 2 slides over (see hooks/useHeroTransition).
 *
 * Layer stack (back → front):
 *   scene   – 16:9 box holding the video, the masked image and the dimension
 *             labels, so labels stay pinned to the tree on any screen size
 *   shade   – gradients that keep the text readable
 *   content – headline, copy, buttons and small controls
 */
function Hero({ onVideoReady, onImageReady }) {
  // the image only cuts its water/mist holes once the video can play,
  // so a slow connection still shows the full still scene
  const [waterReady, setWaterReady] = useState(false)
  const handleVideoReady = () => {
    setWaterReady(true)
    onVideoReady?.()
  }
  // decode before reporting, so the image paints in one go
  const handleImageLoad = (e) => {
    e.currentTarget.decode().then(onImageReady, onImageReady)
  }

  return (
    <section className="hero" id="home">
      <div className="hero__stage">
        <div className={`hero__scene ${waterReady ? 'hero__scene--water' : ''}`}>
          {/* only the bottom strip of the scene (water + mist) is video —
              the still image covers everything above it */}
          <video
            className="hero__water"
            src="/hero/water.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
            onCanPlayThrough={handleVideoReady}
            onError={onVideoReady}
          />
          <picture>
            <source srcSet="/hero/scene.avif" type="image/avif" />
            <img
              className="hero__layer hero__image"
              src="/hero/scene.webp"
              alt=""
              width="1672"
              height="941"
              draggable="false"
              fetchPriority="high"
              onLoad={handleImageLoad}
              onError={onImageReady}
            />
          </picture>
          <DimensionLabels />
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

        <SectionDots />
        <FullscreenButton />

        {/* darkens the hero during the transition into section 2 */}
        <div className="hero__dim" aria-hidden="true" />
      </div>
    </section>
  )
}

function DimensionLabels() {
  return (
    <ul className="dimensions" aria-label="Dimensions of wellness">
      {DIMENSIONS.map(({ name, icon: Icon, x, y }, i) => (
        <li
          key={name}
          className="dimension"
          style={{ left: `${x}%`, top: `${y}%`, '--i': i }}
        >
          <a href={`#${name.toLowerCase()}`} className="dimension__pill">
            <span className="dimension__icon">
              <Icon size={20} strokeWidth={1.5} aria-hidden="true" />
            </span>
            <span className="dimension__text">
              {name}
              <br />
              Wellness
            </span>
          </a>
        </li>
      ))}
    </ul>
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

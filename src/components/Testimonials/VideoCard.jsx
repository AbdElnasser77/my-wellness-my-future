import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ChevronDown, Pause, Play, Quote, X } from 'lucide-react'

const COLLAPSED_LINES = 3
const PLAY_EVENT = 'voices:play' // only one video plays at a time

/*
 * Video review card.
 *  - Rest: thumbnail with a play button, then the quote icon, a 3-line
 *    excerpt with "Read more" and the name. Opening "Read more" expands the
 *    quote in place and hides the play button; "Read less" brings it back.
 *  - Playing: the YouTube video plays inside the card, cropped so YouTube's
 *    title bar is hidden (controls=0 removes its control bar). Our own UI replaces them: click
 *    to pause/resume, a thin progress bar, and an ✕ to go back.
 *  The player talks to YouTube through postMessage (no extra script), and it
 *  only loads when someone presses play.
 */
export default function VideoCard({ t }) {
  const cardRef = useRef(null)
  const frameRef = useRef(null)
  const playBtnRef = useRef(null)
  const captionsOffRef = useRef(false)

  const [playing, setPlaying] = useState(false) // player mounted
  const [started, setStarted] = useState(false) // first frame is actually playing
  const [paused, setPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const [expanded, setExpanded] = useState(false) // "Read more" open → play button hides

  /* ---------- player ---------- */

  const send = useCallback((func, args = []) => {
    frameRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func, args }),
      '*',
    )
  }, [])

  const stop = useCallback(() => {
    captionsOffRef.current = false
    setPlaying(false)
    setStarted(false)
    setPaused(false)
    setProgress(0)
  }, [])

  const start = () => {
    setExpanded(false)
    window.dispatchEvent(new CustomEvent(PLAY_EVENT, { detail: t.id }))
    setPlaying(true)
  }

  const close = () => {
    stop()
    playBtnRef.current?.focus()
  }

  const togglePause = () => {
    send(paused ? 'playVideo' : 'pauseVideo')
    setPaused(!paused)
  }

  // another card started playing → stop this one
  useEffect(() => {
    const onOther = (e) => e.detail !== t.id && stop()
    window.addEventListener(PLAY_EVENT, onOther)
    return () => window.removeEventListener(PLAY_EVENT, onOther)
  }, [t.id, stop])

  // listen to the player: state + time (for the progress bar)
  useEffect(() => {
    if (!playing) return
    const onMessage = (e) => {
      if (!/youtube(-nocookie)?\.com$/.test(new URL(e.origin).hostname)) return
      if (e.source !== frameRef.current?.contentWindow) return
      let data
      try {
        data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data
      } catch {
        return
      }
      const info = data?.info
      if (!info) return
      const state = typeof info === 'number' ? info : info.playerState
      if (state === 1) {
        // the videos already have subtitles burned in; hide YouTube's own captions
        if (!captionsOffRef.current) {
          captionsOffRef.current = true
          send('unloadModule', ['captions'])
          send('unloadModule', ['cc'])
        }
        setStarted(true)
        setPaused(false)
      } else if (state === 2) {
        setPaused(true)
      } else if (state === 0) {
        stop() // finished → back to the card
      }
      if (info.duration > 0 && typeof info.currentTime === 'number') {
        setProgress(info.currentTime / info.duration)
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [playing, stop, send])

  // ask the player to start sending events (retry until it's ready)
  const handleFrameLoad = () => {
    let tries = 0
    const hello = () => {
      frameRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: 'listening', id: t.id, channel: 'widget' }),
        '*',
      )
    }
    hello()
    const timer = setInterval(() => {
      tries += 1
      hello()
      if (tries > 12) clearInterval(timer)
    }, 250)
  }

  // pause when the card scrolls out of view
  useEffect(() => {
    if (!started) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          send('pauseVideo')
          setPaused(true)
        }
      },
      { threshold: 0.25 },
    )
    io.observe(cardRef.current)
    return () => io.disconnect()
  }, [started, send])

  // Esc closes the playing video
  useEffect(() => {
    if (!playing) return
    const onKey = (e) => e.key === 'Escape' && close()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  })

  const src =
    `https://www.youtube-nocookie.com/embed/${t.youtubeId}` +
    `?autoplay=1&controls=0&cc_load_policy=0&disablekb=1&rel=0&playsinline=1&iv_load_policy=3` +
    `&modestbranding=1&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`

  const classes = [
    'voices__card',
    'voices__card--video',
    playing && 'is-playing',
    started && 'is-started',
    paused && 'is-paused',
    expanded && 'is-expanded',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <figure ref={cardRef} className={classes} data-reveal>
      <img
        className="voices__photo"
        src={t.image}
        alt=""
        width="960"
        height="540"
        loading="lazy"
        decoding="async"
      />
      <div className="voices__shade" aria-hidden="true" />

      {/* ---------- rest state ---------- */}
      <button
        ref={playBtnRef}
        type="button"
        className="voices__play"
        onClick={start}
        tabIndex={playing || expanded ? -1 : 0}
        aria-label={`Play video review: ${t.title}, ${t.name}`}
      >
        <span className="voices__play-icon" aria-hidden="true">
          <Play size={24} strokeWidth={0} fill="currentColor" />
        </span>
      </button>

      <div className="voices__body" aria-hidden={playing}>
        <Quote className="voices__quote-icon" aria-hidden="true" />
        <Excerpt text={t.quote} expanded={expanded} onToggle={() => setExpanded(!expanded)} />
        <figcaption className="voices__author">— {t.name}</figcaption>
      </div>

      {/* ---------- playing state ---------- */}
      {playing && (
        <div className="voices__stage">
          <iframe
            ref={frameRef}
            src={src}
            title={`Video review: ${t.title}, ${t.name}`}
            allow="autoplay; encrypted-media; picture-in-picture"
            onLoad={handleFrameLoad}
            tabIndex={-1}
          />

          <button
            type="button"
            className="voices__toggle"
            onClick={togglePause}
            aria-label={paused ? 'Resume video' : 'Pause video'}
          >
            <span className="voices__toggle-icon" aria-hidden="true">
              {paused ? (
                <Play size={26} strokeWidth={0} fill="currentColor" />
              ) : (
                <Pause size={24} strokeWidth={0} fill="currentColor" />
              )}
            </span>
          </button>

          <span className="voices__loader" aria-hidden="true" />

          <div className="voices__progress" aria-hidden="true">
            <span style={{ transform: `scaleX(${progress})` }} />
          </div>

          <button type="button" className="voices__close" onClick={close} aria-label="Close video">
            <X size={18} strokeWidth={2} />
          </button>
        </div>
      )}
    </figure>
  )
}

/*
 * Quote clamped to a few lines; "Read more" smoothly expands it to its full
 * height (measured, so the animation works for any text length / width).
 */
function Excerpt({ text, expanded, onToggle }) {
  const boxRef = useRef(null)
  const [heights, setHeights] = useState({ collapsed: 0, full: 0 })

  useLayoutEffect(() => {
    const box = boxRef.current
    const measure = () => {
      const quote = box.firstElementChild
      const lineHeight = parseFloat(getComputedStyle(quote).lineHeight)
      setHeights({ collapsed: lineHeight * COLLAPSED_LINES, full: quote.scrollHeight })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(box)
    return () => ro.disconnect()
  }, [])

  const needsToggle = heights.full > heights.collapsed + 2

  return (
    <>
      <div
        ref={boxRef}
        className={`voices__excerpt${expanded ? ' is-expanded' : ''}${needsToggle ? ' is-clamped' : ''}`}
        style={{ maxHeight: heights.full ? (expanded ? heights.full : heights.collapsed) : undefined }}
      >
        <blockquote className="voices__quote">{text}</blockquote>
      </div>
      {needsToggle && (
        <button
          type="button"
          className="voices__more"
          onClick={onToggle}
          aria-expanded={expanded}
        >
          {expanded ? 'Read less' : 'Read more'}
          <ChevronDown size={15} strokeWidth={2} aria-hidden="true" />
        </button>
      )}
    </>
  )
}

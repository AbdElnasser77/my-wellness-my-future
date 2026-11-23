import { useEffect, useState } from 'react'
import './Preloader.css'

const EXIT_MS = 1000 // must match the fade-out transition in Preloader.css

/**
 * Full-screen brand loader. Stays until `ready`, then fades out and unmounts.
 */
function Preloader({ progress, ready }) {
  const [mounted, setMounted] = useState(true)

  useEffect(() => {
    if (!ready) return
    const t = setTimeout(() => setMounted(false), EXIT_MS)
    return () => clearTimeout(t)
  }, [ready])

  if (!mounted) return null

  return (
    <div
      className={`preloader ${ready ? 'preloader--out' : ''}`}
      role="status"
      aria-live="polite"
      aria-label={ready ? 'Loaded' : 'Loading'}
    >
      <div className="preloader__halo" aria-hidden="true" />

      <div className="preloader__mark">
        <img className="preloader__logo" src="/brand/logo.svg" alt="" />
      </div>

      <p className="preloader__name">My Wellness My Future</p>

      <div className="preloader__bar" aria-hidden="true">
        <span style={{ transform: `scaleX(${Math.max(0.04, progress)})` }} />
      </div>
    </div>
  )
}

export default Preloader

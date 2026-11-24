import { useCallback, useEffect, useState } from 'react'

const TASKS = ['video', 'fonts']
const MIN_MS = 1400 // keep the loader up long enough to not just flash
const MAX_MS = 8000 // never block the page longer than this (slow networks)

/**
 * Tracks the assets the hero needs before it can be shown cleanly.
 * Returns progress (0–1), whether everything is ready, and a callback the
 * hero video calls once it can play through.
 */
export default function useHeroAssets() {
  const [done, setDone] = useState(() => new Set())
  const [minElapsed, setMinElapsed] = useState(false)
  const [timedOut, setTimedOut] = useState(false)

  const mark = useCallback((task) => {
    setDone((prev) => (prev.has(task) ? prev : new Set(prev).add(task)))
  }, [])

  useEffect(() => {
    let cancelled = false
    const finish = (task) => () => !cancelled && mark(task)

    // 1. The fonts used above the fold
    Promise.all([
      document.fonts.load('500 1em "Cormorant Garamond"'),
      document.fonts.load('italic 500 1em "Cormorant Garamond"'),
      document.fonts.load('400 1em "Manrope Variable"'),
    ]).then(finish('fonts'), finish('fonts'))

    // 2. The video reports itself (see Hero)

    const minTimer = setTimeout(() => setMinElapsed(true), MIN_MS)
    const maxTimer = setTimeout(() => setTimedOut(true), MAX_MS)
    return () => {
      cancelled = true
      clearTimeout(minTimer)
      clearTimeout(maxTimer)
    }
  }, [mark])

  const markVideoReady = useCallback(() => mark('video'), [mark])

  const allLoaded = done.size === TASKS.length
  return {
    progress: timedOut ? 1 : done.size / TASKS.length,
    ready: (allLoaded && minElapsed) || timedOut,
    markVideoReady,
  }
}

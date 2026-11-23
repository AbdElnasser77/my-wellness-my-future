import { useEffect } from 'react'
import Preloader from './components/Preloader/Preloader.jsx'
import Navbar from './components/Navbar/Navbar.jsx'
import Hero from './components/Hero/Hero.jsx'
import About from './components/About/About.jsx'
import Services from './components/Services/Services.jsx'
import Membership from './components/Membership/Membership.jsx'
import useHeroAssets from './hooks/useHeroAssets.js'
import useSmoothScroll from './hooks/useSmoothScroll.js'
import useHeroTransition from './hooks/useHeroTransition.js'

function App() {
  const { progress, ready, markVideoReady, markImageReady } = useHeroAssets()
  useSmoothScroll(ready)
  useHeroTransition(ready)

  // no scrolling while the loader is up
  useEffect(() => {
    document.body.style.overflow = ready ? '' : 'hidden'
  }, [ready])

  return (
    <>
      <Preloader progress={progress} ready={ready} />

      {/* The page renders (and loads) behind the loader; its entrance
          animations are held until data-ready flips to true. */}
      <div className="app" data-ready={ready}>
        <Navbar />
        <main>
          <Hero onVideoReady={markVideoReady} onImageReady={markImageReady} />
          <About />
          <Services />
          <Membership />
        </main>
      </div>
    </>
  )
}

export default App

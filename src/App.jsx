import { useEffect } from 'react'
import Preloader from './components/Preloader/Preloader.jsx'
import Navbar from './components/Navbar/Navbar.jsx'
import Hero from './components/Hero/Hero.jsx'
import Story from './components/Story/Story.jsx'
import Goals from './components/Goals/Goals.jsx'
import Services from './components/Services/Services.jsx'
import Testimonials from './components/Testimonials/Testimonials.jsx'
import Membership from './components/Membership/Membership.jsx'
import Faq from './components/Faq/Faq.jsx'
import Footer from './components/Footer/Footer.jsx'
import Divider from './components/Divider/Divider.jsx'
import './theme-bloom.css' // loaded after the sections so it can restyle them
import './fit-screen.css' // one screen per section (loaded last)
import useHeroAssets from './hooks/useHeroAssets.js'
import useSmoothScroll from './hooks/useSmoothScroll.js'
import useMotion from './motion/useMotion.js'

function App() {
  const { progress, ready, markVideoReady } = useHeroAssets()
  useSmoothScroll(ready)
  useMotion(ready)

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
          <Hero onVideoReady={markVideoReady} />
          <Story />
          <Divider />
          <Goals />
          <Divider />
          <Services />
          <Divider />
          <Testimonials />
          <Divider />
          <Membership />
          <Divider />
          <Faq />
        </main>
        <Divider />
        <Footer />
      </div>
    </>
  )
}

export default App

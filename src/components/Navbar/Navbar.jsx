import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ChevronRight, Menu, X } from 'lucide-react'
import './Navbar.css'

const LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Stories', href: '#testimonials' },
  { label: 'Membership', href: '#membership' },
  { label: 'FAQs', href: '#faq' },
]

// the footer counts as the last link's neighbour: no link is active there
const TRACKED = [...LINKS.map((l) => l.href), '#contact']

/*
 * Fixed navbar.
 *  - Transparent over the hero; once you scroll it gains a glass bar.
 *  - A white pill slides behind the link of the section you're in. The
 *    section that's "current" is the last one crossing the middle of the
 *    screen — with the stacked transitions, that's the one on top.
 * The entrance animation is part of the hero intro (motion/hero.js).
 */
function Navbar() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('#home')
  const [scrolled, setScrolled] = useState(false)
  const linksRef = useRef(null)
  const pillRef = useRef(null)

  // glass bar after a little scroll (rAF-throttled)
  useEffect(() => {
    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => setScrolled(window.scrollY > 40))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  // which section is current
  useEffect(() => {
    const sections = TRACKED.map((id) => document.querySelector(id)).filter(Boolean)
    const inView = new Set()
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? inView.add(e.target) : inView.delete(e.target)))
        const current = sections.filter((s) => inView.has(s)).pop()
        if (current) setActive(`#${current.id}`)
      },
      { rootMargin: '-50% 0px -50% 0px' },
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])

  // slide the pill behind the active link
  useLayoutEffect(() => {
    const place = () => {
      const pill = pillRef.current
      const link = linksRef.current?.querySelector(`[href="${active}"]`)
      if (!pill) return
      if (!link) {
        pill.style.opacity = '0'
        return
      }
      pill.style.opacity = '1'
      pill.style.width = `${link.offsetWidth}px`
      pill.style.transform = `translateX(${link.offsetLeft}px)`
    }
    place()
    window.addEventListener('resize', place)
    document.fonts?.ready.then(place)
    return () => window.removeEventListener('resize', place)
  }, [active])

  return (
    <header className={`nav${open ? ' nav--open' : ''}${scrolled ? ' nav--scrolled' : ''}`}>
      <a href="#home" className="nav__brand" aria-label="My Wellness My Future, home">
        <img className="nav__logo" src="/brand/logo.svg" alt="" />
        <span className="nav__name">My Wellness My Future</span>
      </a>

      <nav className="nav__links" aria-label="Main" ref={linksRef}>
        <span className="nav__pill" ref={pillRef} aria-hidden="true" />
        {LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="nav__link"
            aria-current={link.href === active ? 'true' : undefined}
            onClick={() => setOpen(false)}
          >
            {link.label}
          </a>
        ))}
      </nav>

      <a href="#contact" className="nav__cta" data-magnetic>
        Join us
        <ChevronRight size={16} strokeWidth={1.75} aria-hidden="true" />
      </a>

      <button
        type="button"
        className="nav__toggle"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
      </button>
    </header>
  )
}

export default Navbar

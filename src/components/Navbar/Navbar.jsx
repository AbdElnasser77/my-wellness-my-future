import { useState } from 'react'
import { ChevronRight, Menu, X } from 'lucide-react'
import './Navbar.css'

const LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'The Philosophy', href: '#philosophy' },
  { label: 'Dimensions', href: '#dimensions' },
  { label: 'Programs', href: '#programs' },
  { label: 'Resources', href: '#resources' },
  { label: 'About', href: '#about' },
]

function Navbar() {
  const [open, setOpen] = useState(false)
  const active = '#home'

  return (
    <header className={`nav ${open ? 'nav--open' : ''}`}>
      <a href="#home" className="nav__brand" aria-label="My Wellness My Future, home">
        <img className="nav__logo" src="/brand/logo.svg" alt="" />
        <span className="nav__name">My Wellness My Future</span>
      </a>

      <nav className="nav__links" aria-label="Main">
        {LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="nav__link"
            aria-current={link.href === active ? 'page' : undefined}
            onClick={() => setOpen(false)}
          >
            {link.label}
          </a>
        ))}
      </nav>

      <a href="#journey" className="nav__cta">
        Start Your Journey
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

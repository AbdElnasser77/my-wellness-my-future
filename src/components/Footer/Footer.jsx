import { useState } from 'react'
import { Plus } from 'lucide-react'
import { CATEGORIES, CONTACT, EXPLORE, MORE_LINKS, SOCIALS } from './footerContent.js'
import './Footer.css'

const SOCIAL_ICONS = { Instagram: InstagramIcon, TikTok: TikTokIcon, Snapchat: SnapchatIcon }

/*
 * Footer — minimal, over the wildflower hills (with a dark veil).
 *   top:    one centred line + an email field with a "Join us" button
 *   middle: logo + name on the left; quick links, the ten wellness
 *           categories and address / contact on the right
 *   bar:    copyright + credit · social icons · terms & privacy
 * Normal content height (not a full screen). Carries id="contact", so every
 * "Contact us" button lands here.
 */
function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer" id="contact">
      <div className="footer__top">
        <h2 className="footer__title">
          Your wellness starts with a step — and lasts a lifetime
        </h2>
        <JoinForm />
      </div>

      <div className="footer__bottom">
        <div className="footer__main">
          <a href="#home" className="footer__brand" aria-label="My Wellness My Future, back to top">
            <img src="/brand/logo.svg" alt="" width="110" height="110" />
            <span>My Wellness My Future</span>
          </a>

          <nav className="footer__cols" aria-label="Footer">
            <div className="footer__col">
              <h3 className="footer__heading">Quick links</h3>
              <ul>
                {[...EXPLORE, ...MORE_LINKS].map((l) => (
                  <li key={l.label}><a href={l.href}>{l.label}</a></li>
                ))}
              </ul>
            </div>

            <div className="footer__col footer__col--wide">
              <h3 className="footer__heading">Wellness categories</h3>
              <ul className="footer__two">
                {CATEGORIES.map((c) => (
                  <li key={c.label}><a href={c.href}>{c.label} Wellness</a></li>
                ))}
              </ul>
            </div>

            <div className="footer__col">
              <h3 className="footer__heading">Address</h3>
              <address className="footer__address">
                <a href={CONTACT.mapUrl} target="_blank" rel="noreferrer">
                  {CONTACT.address[0]}
                  <br />
                  {CONTACT.address[1]}
                </a>
              </address>

              <h3 className="footer__heading footer__heading--gap">Contact</h3>
              <ul>
                <li><a href={CONTACT.phoneHref}><bdi>{CONTACT.phone}</bdi></a></li>
                <li><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></li>
              </ul>
            </div>
          </nav>
        </div>

        <div className="footer__bar">
          <p>
            © {year} My Wellness My Future · Powered by{' '}
            <a href="https://everlastwellness.com/" target="_blank" rel="noreferrer">Everlast Wellness</a>
          </p>

          <ul className="footer__socials" aria-label="Social media">
            {SOCIALS.map((s) => {
              const Icon = SOCIAL_ICONS[s.label]
              return (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}>
                    <Icon />
                  </a>
                </li>
              )
            })}
          </ul>

          <ul className="footer__legal">
            <li><a href="#">Terms of use</a></li>
            <li><a href="#">Privacy policy</a></li>
          </ul>
        </div>
      </div>
    </footer>
  )
}

/*
 * Email field + "Join us". There's no signup backend yet, so it opens the
 * visitor's email app with a short request to info@, their address filled in.
 */
function JoinForm() {
  const [email, setEmail] = useState('')

  const submit = (e) => {
    e.preventDefault()
    const body = `Hello,\n\nI'd like to join My Wellness – My Future.\nMy email: ${email}\n`
    window.location.href =
      `mailto:${CONTACT.email}?subject=${encodeURIComponent('Join My Wellness – My Future')}` +
      `&body=${encodeURIComponent(body)}`
  }

  return (
    <form className="footer__form" onSubmit={submit}>
      <label className="sr-only" htmlFor="footer-email">Your email</label>
      <input
        id="footer-email"
        type="email"
        required
        placeholder="Enter your email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit" className="footer__join">
        Join us
        <Plus size={16} strokeWidth={2} aria-hidden="true" />
      </button>
    </form>
  )
}

/* ---------- brand icons (lucide has no TikTok / Snapchat) ---------- */

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  )
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5" />
      <path d="M14 3c.4 2.7 2.4 4.6 5 4.8" />
    </svg>
  )
}

function SnapchatIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3c-2.9 0-5 2.2-5 5.2v2.2c-.6-.2-1.3 0-1.4.5-.1.5.6.9 1.3 1.1-.5 1.5-1.8 2.8-3.5 3.3.2.6 1.1.9 2.1 1 .1.5.2.9.6 1 .6.1 1.3-.3 2.2.1.9.4 1.7 1.6 3.7 1.6s2.8-1.2 3.7-1.6c.9-.4 1.6 0 2.2-.1.4-.1.5-.5.6-1 1-.1 1.9-.4 2.1-1-1.7-.5-3-1.8-3.5-3.3.7-.2 1.4-.6 1.3-1.1-.1-.5-.8-.7-1.4-.5V8.2C17 5.2 14.9 3 12 3z" />
    </svg>
  )
}

export default Footer

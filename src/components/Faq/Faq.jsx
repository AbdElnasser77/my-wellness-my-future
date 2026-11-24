import { useEffect, useId, useRef, useState } from 'react'
import { ArrowRight, Plus } from 'lucide-react'
import { FAQS } from './faqContent.js'
import './Faq.css'

/*
 * FAQs — the photo fills the section behind a navy tint.
 * Left: heading, short intro and the contact prompt.
 * Right: frosted-glass accordion; one answer open at a time (the first
 * starts open), answers slide open smoothly.
 */
function Faq() {
  const [open, setOpen] = useState(0)
  const baseId = useId()
  const listRef = useRef(null)
  const [listHeight, setListHeight] = useState()

  // Reserve room for the longest answer, so opening / switching questions
  // never changes the section's height (nothing below it jumps).
  useEffect(() => {
    const list = listRef.current
    const measure = () => {
      const answers = [...list.querySelectorAll('.faq__a-inner')]
      const currentOpen = answers.reduce((sum, el) => sum + el.offsetHeight, 0)
      const longest = Math.max(...answers.map((el) => el.scrollHeight))
      setListHeight(list.scrollHeight - currentOpen + longest)
    }
    let frame
    const remeasure = () => {
      cancelAnimationFrame(frame)
      setListHeight(undefined) // let it size naturally, then measure
      frame = requestAnimationFrame(() => requestAnimationFrame(measure))
    }
    remeasure()
    document.fonts?.ready.then(remeasure)
    window.addEventListener('resize', remeasure)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', remeasure)
    }
    // measured with the first answer open (the resting state); widths only
    // change on resize, which re-measures
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section className="faq" id="faq" aria-labelledby="faq-title">
      <img
        className="faq__bg"
        src="/faq/faq-bg.webp"
        alt=""
        width="1600"
        height="1067"
        loading="lazy"
        decoding="async"
      />
      <div className="faq__tint" aria-hidden="true" />

      <div className="faq__inner">
        <div className="faq__intro">
          <p className="faq__eyebrow">
            <span aria-hidden="true" />
            FAQs
          </p>
          <h2 className="faq__title" id="faq-title">
            Everything you need to know <em>before starting your journey</em>
          </h2>

          <div className="faq__contact">
            <p className="faq__contact-title">Need more questions?</p>
            <p className="faq__contact-text">
              Our team is happy to help you find the right program.
            </p>
            <a href="#contact" className="faq__contact-button">
              Contact us
              <span className="faq__contact-icon" aria-hidden="true">
                <ArrowRight size={18} strokeWidth={1.75} />
              </span>
            </a>
          </div>
        </div>

        <ul className="faq__list" ref={listRef} style={{ minHeight: listHeight }}>
          {FAQS.map((item, i) => {
            const isOpen = open === i
            const qId = `${baseId}-q${i}`
            const aId = `${baseId}-a${i}`
            return (
              <li key={item.q} className={`faq__item${isOpen ? ' is-open' : ''}`}>
                <h3 className="faq__q">
                  <button
                    type="button"
                    id={qId}
                    aria-expanded={isOpen}
                    aria-controls={aId}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                  >
                    <span className="faq__num" aria-hidden="true">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="faq__q-text">{item.q}</span>
                    <span className="faq__toggle" aria-hidden="true">
                      <Plus size={18} strokeWidth={2} />
                    </span>
                  </button>
                </h3>
                <div className="faq__a" id={aId} role="region" aria-labelledby={qId}>
                  <div className="faq__a-inner">
                    <p>{item.a}</p>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

export default Faq

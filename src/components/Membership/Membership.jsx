import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Check, ShieldCheck } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { PLANS } from './membershipContent.js'
import './Membership.css'

gsap.registerPlugin(ScrollTrigger)

/*
 * Membership / subscription plans — dark section with three plan cards
 * (Premium highlighted) and a monthly / yearly billing switch.
 */
function Membership() {
  const ref = useRef(null)
  const [billing, setBilling] = useState('monthly')

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.from('[data-reveal]', {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.1,
        clearProps: 'transform,opacity',
        scrollTrigger: { trigger: ref.current, start: 'top 70%', once: true },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section className="plans" id="membership" ref={ref} aria-labelledby="plans-title">
      <div className="plans__inner">
        <header className="plans__head">
          <p className="plans__eyebrow" data-reveal>
            <span aria-hidden="true" />
            Go deeper
          </p>
          <h2 className="plans__title" id="plans-title" data-reveal>
            Prioritize your healing with <em>flexible therapy plans</em>
          </h2>
          <p className="plans__lead" data-reveal>
            Our membership options are built to support your well-being at every stage.
          </p>

          <div className="plans__switch" role="group" aria-label="Billing period" data-reveal>
            <span className="plans__switch-thumb" data-billing={billing} aria-hidden="true" />
            {['monthly', 'yearly'].map((b) => (
              <button
                key={b}
                type="button"
                className="plans__switch-option"
                aria-pressed={billing === b}
                onClick={() => setBilling(b)}
              >
                {b === 'monthly' ? 'Monthly' : 'Yearly'}
              </button>
            ))}
          </div>
        </header>

        <div className="plans__grid">
          {PLANS.map((plan) => {
            const price = plan[billing]
            return (
              <article
                key={plan.id}
                className={`plans__card${plan.featured ? ' plans__card--featured' : ''}`}
                data-reveal
              >
                <h3 className="plans__name">{plan.name}</h3>
                <p className="plans__ideal">Ideal for: {plan.idealFor}</p>

                {/* key change re-runs the little fade when the billing period switches */}
                <p className="plans__price" key={billing}>
                  {price === 0 ? (
                    <span className="plans__amount">Free</span>
                  ) : (
                    <>
                      <span className="plans__amount">{price.toLocaleString('en-US')}</span>
                      <span className="plans__currency">
                        AED / {billing === 'monthly' ? 'month' : 'year'}
                      </span>
                    </>
                  )}
                </p>

                <a href="#contact" className="plans__cta">
                  {plan.cta}
                  <span className="plans__cta-icon" aria-hidden="true">
                    <ArrowRight size={18} strokeWidth={1.75} />
                  </span>
                </a>

                <p className="plans__secure">
                  <ShieldCheck size={16} strokeWidth={1.75} aria-hidden="true" />
                  Secure payments guaranteed
                </p>

                <h4 className="plans__benefits-title">Benefits</h4>
                <ul className="plans__benefits">
                  {plan.benefits.map((b) => (
                    <li key={b}>
                      <span className="plans__check" aria-hidden="true">
                        <Check size={13} strokeWidth={2.5} />
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Membership

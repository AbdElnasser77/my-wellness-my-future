import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ArrowRight, Check, ShieldCheck } from 'lucide-react'
import { PLANS } from './membershipContent.js'
import './Membership.css'

/*
 * Membership / subscription plans — dark section with three plan cards
 * (Premium highlighted) and a monthly / yearly billing switch.
 */
function Membership() {
  const [billing, setBilling] = useState('monthly')


  return (
    <section className="plans" id="membership" aria-labelledby="plans-title">
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
                <p className="plans__price">
                  {price === 0 ? (
                    <span className="plans__amount">Free</span>
                  ) : (
                    <>
                      <AnimatedPrice value={price} longest={Math.max(plan.monthly, plan.yearly)} />
                      <span className="plans__currency" key={billing}>
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

/*
 * Price that counts to its new value when the billing period changes.
 * Digits are tabular and the box reserves room for the longest price, so
 * nothing around it moves while it counts.
 */
// room for the longest price: tabular digits ≈ 0.6em, a comma ≈ 0.25em
const priceWidth = (n) => {
  const s = n.toLocaleString('en-US')
  const commas = (s.match(/,/g) || []).length
  return `${(s.length - commas) * 0.6 + commas * 0.25}em`
}

function AnimatedPrice({ value, longest }) {
  const ref = useRef(null)
  const shown = useRef(value)

  useEffect(() => {
    const el = ref.current
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const state = { n: shown.current }
    const tween = gsap.to(state, {
      n: value,
      duration: reduce ? 0 : 0.9,
      ease: 'power3.out',
      onUpdate: () => {
        el.textContent = Math.round(state.n).toLocaleString('en-US')
      },
      onComplete: () => {
        shown.current = value
      },
    })
    if (!reduce && value !== shown.current) {
      gsap.fromTo(el, { yPercent: 12, opacity: 0.4 }, { yPercent: 0, opacity: 1, duration: 0.6, ease: 'power3.out' })
    }
    return () => {
      tween.kill()
      shown.current = value
    }
  }, [value])

  return (
    <span
      className="plans__amount plans__amount--num"
      ref={ref}
      style={{ minWidth: priceWidth(longest) }}
    >
      {value.toLocaleString('en-US')}
    </span>
  )
}

export default Membership

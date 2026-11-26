import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { SERVICES } from './servicesContent.js'
import './Services.css'

/*
 * "Programs & Services" — 12-column grid with alternating 5/7 and 7/5 card
 * widths. Each card shows its photo with a title pill + arrow; on hover/focus
 * a panel slides up from the bottom with the icon, title and description.
 */
function Services() {
    return (
    <section className="services" id="services" aria-labelledby="services-title">
      <div className="services__inner">
        <header className="services__head">
          <div>
            <p className="services__eyebrow" data-reveal>
              <span aria-hidden="true" />
              Our Services
            </p>
            <h2 className="services__title" id="services-title" data-reveal>
              Programs <em>&amp; Services</em>
            </h2>
          </div>
          <a href="#contact" className="services__all" data-reveal>
            View all services
            <span className="services__all-icon" aria-hidden="true">
              <ArrowRight size={18} strokeWidth={1.75} />
            </span>
          </a>
        </header>

        <div className="services__grid">
          {SERVICES.map((s) => (
            <a key={s.id} href="#contact" className="services__card">
              <img
                className="services__photo"
                src={s.image}
                alt=""
                width="1024"
                height="683"
                loading="lazy"
                decoding="async"
              />

              {/* resting state: title pill */}
              <div className="services__bar" aria-hidden="true">
                <span className="services__pill">{s.title}</span>
              </div>

              {/* hover state: slides up from the bottom */}
              <div className="services__panel">
                <span className="services__icon">
                  <img src={s.icon} alt="" width="150" height="150" loading="lazy" />
                </span>
                <h3 className="services__card-title">{s.title}</h3>
                <p className="services__card-text">{s.text}</p>
                <span className="services__more">
                  Learn more
                  <ArrowUpRight size={16} strokeWidth={1.75} aria-hidden="true" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services

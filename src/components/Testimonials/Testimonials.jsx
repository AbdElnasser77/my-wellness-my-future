import { Quote } from 'lucide-react'
import { TESTIMONIALS } from './testimonialsContent.js'
import VideoCard from './VideoCard.jsx'
import './Testimonials.css'

/*
 * "Voices of Transformation" — centered heading and a row of tall cards.
 * Photo reviews: photo with a dark fade and the quote on top.
 * Video reviews: see VideoCard.jsx (short excerpt + Read more, video plays
 * inside the card).
 */
function Testimonials() {
    return (
    <section className="voices" id="testimonials" aria-labelledby="voices-title">
      <div className="voices__inner">
        <header className="voices__head">
          <p className="voices__eyebrow" data-reveal>
            <span aria-hidden="true" />
            Testimonials &amp; Success Stories
          </p>
          <h2 className="voices__title" id="voices-title" data-reveal>
            Voices of <em>Transformation</em>
          </h2>
          <p className="voices__lead" data-reveal>
            Hear real stories from people who found clarity, strength, and healing.
          </p>
        </header>

        <div className="voices__grid">
          {TESTIMONIALS.map((t) =>
            t.youtubeId ? <VideoCard key={t.id} t={t} /> : <PhotoCard key={t.id} t={t} />,
          )}
        </div>
      </div>
    </section>
  )
}

function PhotoCard({ t }) {
  return (
    <figure className="voices__card" data-reveal>
      <img
        className="voices__photo"
        src={t.image}
        alt={t.name}
        width="475"
        height="500"
        loading="lazy"
        decoding="async"
      />
      <div className="voices__shade" aria-hidden="true" />
      <div className="voices__body">
        <Quote className="voices__quote-icon" aria-hidden="true" />
        <blockquote className="voices__quote">{t.quote}</blockquote>
        <figcaption className="voices__author">
          — {t.name}
        </figcaption>
      </div>
    </figure>
  )
}

export default Testimonials

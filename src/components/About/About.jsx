import { ArrowRight, ArrowUpRight, BookOpen, Check, Eye, Target } from 'lucide-react'
import { GOALS, STEPS } from './aboutContent.js'
import './About.css'

const [WHO, MISSION, VISION, STORY] = STEPS

/*
 * "Who We Are" — left: eyebrow, headline, intro, button and the Mission /
 * Vision / Story cards. Right: photo with asymmetric corners and the
 * "Our Goals" card under it. No scroll animations.
 */
function About() {
  return (
    <section className="about" id="about" aria-labelledby="about-title">

      <div className="about__inner">
        {/* ---------- Left column ---------- */}
        <div className="about__text">
          <p className="about__eyebrow">
            <span aria-hidden="true" />
            {WHO.label}
          </p>

          <h2 className="about__title" id="about-title">
            {WHO.title[0]} <em>{WHO.title[1]}</em>
          </h2>

          <p className="about__lead">
            {WHO.text}
          </p>

          <div className="about__actions">
            <a href="#contact" className="about__button">
              Know us more
              <span className="about__button-icon" aria-hidden="true">
                <ArrowRight size={18} strokeWidth={1.75} />
              </span>
            </a>
          </div>

          {/* ---------- Bento cards ---------- */}
          <div className="about__cards">
            <article className="about__card about__card--ocean">
              <span className="about__card-icon">
                <Target size={22} strokeWidth={1.5} aria-hidden="true" />
              </span>
              <h3 className="about__card-title">{MISSION.label}</h3>
              <p className="about__card-text">
                A visionary wellness project by Everlast Wellness Medical Center, empowering
                Emirati employees since October 2023.
              </p>
            </article>

            <article className="about__card about__card--sky">
              <span className="about__card-icon">
                <Eye size={22} strokeWidth={1.5} aria-hidden="true" />
              </span>
              <h3 className="about__card-title">{VISION.label}</h3>
              <p className="about__card-text">
                A world where wellness is a right, not a luxury — because when women are well,
                communities thrive.
              </p>
            </article>

            <article className="about__card about__card--deep">
              <span className="about__card-icon">
                <BookOpen size={22} strokeWidth={1.5} aria-hidden="true" />
              </span>
              <h3 className="about__card-title">{STORY.label}</h3>
              <p className="about__card-text">
                Born in Abu Dhabi in March 2023 to help every woman take charge of her health
                journey with confidence, compassion and clarity.
              </p>
              <a href="#contact" className="about__card-link">
                Read our story
                <ArrowUpRight size={16} strokeWidth={1.75} aria-hidden="true" />
              </a>
            </article>
          </div>
        </div>

        {/* ---------- Right column: photo + goals ---------- */}
        <div className="about__side">
          <figure className="about__visual">
            <img
              className="about__photo"
              src="/about/team.webp"
              alt="Emirati team members talking together in a bright office"
              width="890"
              height="720"
              decoding="async"
            />
          </figure>

          <div className="about__goals">
            <h3 className="about__goals-title">Our Goals</h3>
            <ul className="about__goals-list">
              {GOALS.map((goal) => (
                <li key={goal}>
                  <Check size={18} strokeWidth={2.25} aria-hidden="true" />
                  {goal}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About

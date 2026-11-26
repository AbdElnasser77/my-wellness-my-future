import { BookOpen, Eye, Leaf, Target } from 'lucide-react'
import { STEPS } from './storyContent.js'
import './Story.css'

const ICONS = { leaf: Leaf, target: Target, eye: Eye, book: BookOpen }

/*
 * "Who We Are" — the forest video fills the screen behind a soft gradient,
 * and the four steps (who we are, mission, vision, story) sit centred on it.
 *
 * On desktop the motion system (motion/story.js) pins the section and steps
 * through them as you scroll, with the 01–04 bar on the right showing where
 * you are. Without that (phones, reduced motion) the steps simply stack and
 * scroll by — the default layout below.
 */
function Story() {
  return (
    <section className="story" id="about" aria-labelledby="story-title">
      <video
        className="story__video"
        src="/story/forest.mp4"
        poster="/story/forest-poster.webp"
        width="1280"
        height="720"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      />
      <div className="story__shade" aria-hidden="true" />

      <h2 className="sr-only" id="story-title">Who we are</h2>

      <div className="story__steps">
        {STEPS.map((step) => {
          const Icon = ICONS[step.icon]
          return (
            <article key={step.id} className="story__step">
              <h3 className="story__title">
                <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
                {step.title}
              </h3>
              <p className="story__text">{step.text}</p>
            </article>
          )
        })}
      </div>

      {/* scroll bar: 01–04 with a moving thumb (desktop only) */}
      <div className="story__nav" aria-hidden="true">
        <ol className="story__list">
          {STEPS.map((step, i) => (
            <li key={step.id} className="story__nav-item">
              {String(i + 1).padStart(2, '0')}
            </li>
          ))}
        </ol>
        <span className="story__track">
          <span className="story__thumb" />
        </span>
      </div>
    </section>
  )
}

export default Story

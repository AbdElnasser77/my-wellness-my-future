import { GOALS } from '../Story/storyContent.js'
import './Goals.css'

/*
 * "Our Goals" — one frosted-glass card on the plain page background.
 * Each goal is a bullet point with a short description. Minimal on purpose.
 */
function Goals() {
  return (
    <section className="goals" id="goals" aria-labelledby="goals-title">
      <div className="goals__card">
        <header className="goals__head">
          <h2 className="goals__title" id="goals-title">Our Goals</h2>
          <img className="goals__mark" src="/brand/logo.svg" alt="" width="40" height="40" />
        </header>

        <ul className="goals__list">
          {GOALS.map((goal) => (
            <li key={goal.title} className="goals__row">
              <span className="goals__bullet" aria-hidden="true" />
              <div>
                <h3 className="goals__name">{goal.title}</h3>
                <p className="goals__text">{goal.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default Goals

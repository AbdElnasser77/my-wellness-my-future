import './Hero.css'

/*
 * Layer stack (back → front):
 *   1. video  – animated water + mist (also contains falling leaves, which get covered)
 *   2. image  – the still scene, masked so it fades out over the water/mist
 */
function Hero() {
  return (
    <section className="hero">
      <div className="hero__scene" aria-hidden="true">
        <video
          className="hero__layer hero__video"
          src="/hero/scene.mp4"
          poster="/hero/scene.webp"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
        <img
          className="hero__layer hero__image"
          src="/hero/scene.webp"
          alt=""
          draggable="false"
        />
      </div>
    </section>
  )
}

export default Hero

import './Divider.css'

/*
 * Separator between two sections: a thin glowing line with a small
 * diamond emblem, sitting exactly on the boundary. It takes no height,
 * so every section stays exactly one screen tall. The line draws outward
 * from the centre when it comes into view (motion/sections.js).
 */
function Divider() {
  return (
    <div className="divider" aria-hidden="true">
      <span className="divider__line" />
      <span className="divider__mark" />
    </div>
  )
}

export default Divider

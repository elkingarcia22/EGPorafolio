import { gsap } from '@/lib/motion'
import type { Point } from './transition-nodes'

/** Cuánto se curva la fibra respecto a la distancia entre los dos puntos */
const BEND = 0.18
/** La fibra se queda encendida un instante al llegar y luego se apaga (s) */
const FIBER_FADE_S = 0.45

/** Curva suave entre dos puntos (se arquea hacia un lado, como las fibras del inicio). */
function curve(a: Point, b: Point): string {
  const mx = (a.x + b.x) / 2
  const my = (a.y + b.y) / 2
  const dx = b.x - a.x
  const dy = b.y - a.y
  // Control perpendicular al tramo, hacia el lado del centro de la pantalla: el arco no se sale de ella.
  const centerX = window.innerWidth / 2
  const centerY = window.innerHeight / 2
  const side = (centerX - mx) * -dy + (centerY - my) * dx >= 0 ? 1 : -1
  const cx = mx - dy * BEND * side
  const cy = my + dx * BEND * side
  return `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`
}

/** Punto de la curva en t (0–1), para que la neurona viaje por la misma fibra que se dibuja. */
function pointOn(path: SVGPathElement, t: number): Point {
  const p = path.getPointAtLength(path.getTotalLength() * t)
  return { x: p.x, y: p.y }
}

const SVG_NS = 'http://www.w3.org/2000/svg'

/**
 * Viaje de un punto a otro por una fibra de luz: la fibra (un trazo nuevo dentro de `layer`)
 * se dibuja detrás de la neurona (`seed`) mientras esta la recorre, y al llegar se apaga y se
 * quita. Devuelve la línea de tiempo.
 */
export function travelAlongFiber(
  layer: SVGSVGElement,
  seed: HTMLElement,
  from: Point,
  to: Point,
  duration: number,
  extra: gsap.TweenVars = {},
): gsap.core.Timeline {
  const progress = { t: 0 }
  const path = document.createElementNS(SVG_NS, 'path')
  path.setAttribute('data-fiber', '')
  const tl = gsap.timeline({ onComplete: () => path.remove(), onInterrupt: () => path.remove() })
  tl.call(() => {
    layer.appendChild(path)
    path.setAttribute('d', curve(from, to))
    const length = path.getTotalLength()
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length, autoAlpha: 1 })
  })
  tl.to(progress, {
    t: 1,
    duration,
    ease: 'expo.inOut',
    onUpdate: () => {
      const length = path.getTotalLength()
      path.style.strokeDashoffset = String(length * (1 - progress.t))
      const p = pointOn(path, progress.t)
      gsap.set(seed, { x: p.x, y: p.y })
    },
  })
  if (Object.keys(extra).length) tl.to(seed, { ...extra, duration, ease: 'expo.inOut' }, '<')
  tl.to(path, { autoAlpha: 0, duration: FIBER_FADE_S, ease: 'power1.out' })
  return tl
}

'use client'

import { useMemo, useRef } from 'react'
import type { GalleryItem } from './zoom-targets'
import { ZoomStage, type Step } from './zoom-stage'

/** Separación entre una pantalla y la vecina (px) */
const GAP = 40
/** Arrastrar de lado más que esto (px) pasa a la vecina; menos, vuelve a su sitio */
const SWIPE_PX = 60
/** El paso entre pantallas: la misma curva y duración para el carril y para cada lámina */
const SLIDE = { ms: 520, ease: 'cubic-bezier(0.16, 1, 0.3, 1)' }
/** Cómo se ven las vecinas que asoman: más pequeñas y en penumbra */
const NEIGHBOR = { scale: 0.86, opacity: 0.35 }

/** La posición en la galería, dé las vueltas que dé */
export function wrapIndex(pos: number, total: number): number {
  return ((pos % total) + total) % total
}

interface ZoomCarouselProps {
  items: GalleryItem[]
  /**
   * Posición sin límites (puede pasar del final o bajar de cero): cada lámina se identifica por
   * ella, así la que llega al centro es la misma que asomaba y el paso se anima de corrido.
   */
  pos: number
  onStep: (step: Step) => void
}

/**
 * Carrusel de las pantallas ampliadas: la del frente, y a cada lado la anterior y la siguiente,
 * que asoman al arrastrar. Al pasar, todo el carril se desliza.
 */
export function ZoomCarousel({ items, pos, onStep }: ZoomCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const total = items.length
  const hasNav = total > 1
  const slots = hasNav ? [pos - 1, pos, pos + 1] : [pos]

  /** Mueve el carril entero sin pasar por React (sigue al dedo) o lo devuelve animado */
  const moveTrack = (dx: number, animate: boolean) => {
    const track = trackRef.current
    if (!track) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    track.style.transition = animate && !reduce ? `transform ${SLIDE.ms}ms ${SLIDE.ease}` : 'none'
    track.style.transform = `translate3d(${dx}px, 0, 0)`
  }

  const onSlideRelease = (dx: number, dy: number) => {
    // El carril vuelve a cero mientras las láminas cambian de sitio con la misma curva: el
    // movimiento sigue de corrido desde donde lo dejó el dedo.
    moveTrack(0, true)
    if (Math.abs(dx) >= SWIPE_PX && Math.abs(dx) > Math.abs(dy)) onStep(dx < 0 ? 1 : -1)
  }

  return (
    <div ref={trackRef} className="absolute inset-0">
      {slots.map((slot) => (
        <Slide
          key={slot}
          item={items[wrapIndex(slot, total)]}
          offset={slot - pos}
          hasNav={hasNav}
          onSlideDrag={hasNav ? (dx) => moveTrack(dx, false) : undefined}
          onSlideRelease={hasNav ? onSlideRelease : undefined}
        />
      ))}
    </div>
  )
}

interface SlideProps {
  item: GalleryItem
  /** -1 a la izquierda, 0 al frente, 1 a la derecha */
  offset: number
  hasNav: boolean
  onSlideDrag?: (dx: number) => void
  onSlideRelease?: (dx: number, dy: number) => void
}

function Slide({ item, offset, hasNav, onSlideDrag, onSlideRelease }: SlideProps) {
  // Se prepara una vez por lámina (un tablero se copia al llegar a él, no en cada paso).
  const shot = useMemo(() => item.shot(), [item])
  const isFront = offset === 0
  return (
    <div
      aria-hidden={!isFront}
      className="absolute inset-0 transition-[transform,opacity] motion-reduce:transition-none"
      style={{
        transform: `translate3d(calc(${offset} * (100% + ${GAP}px)), 0, 0) scale(${isFront ? 1 : NEIGHBOR.scale})`,
        opacity: isFront ? 1 : NEIGHBOR.opacity,
        pointerEvents: isFront ? 'auto' : 'none',
        transitionDuration: `${SLIDE.ms}ms`,
        transitionTimingFunction: SLIDE.ease,
      }}
    >
      <div className="zoom-slide-in absolute inset-0">
        <ZoomStage shot={shot} active={isFront} hasNav={hasNav} onSlideDrag={onSlideDrag} onSlideRelease={onSlideRelease} />
      </div>
    </div>
  )
}

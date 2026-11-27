'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { getLenis } from '@/lib/motion'
import { useLocale } from '@/lib/i18n'
import { collectGallery, zoomTarget, type GalleryItem, type Shot } from './screenshot-targets'

/** Teléfono: ahí también se abren las pantallas que están dentro de un botón (en escritorio, el clic es del botón) */
const NARROW_QUERY = '(max-width: 767px)'
/** Margen alrededor de un tablero ampliado (px); en escritorio, con flechas, deja sitio a sus lados */
const BOARD_MARGIN = { x: 24, xWithArrows: 152, y: 160 }
/** Sensibilidad de la rueda del ratón al acercar */
const WHEEL_ZOOM = 0.0015
/** Límites del acercamiento */
const SCALE = { min: 1, max: 5, doubleTap: 2.5 }
/** Dos toques dentro de este tiempo (ms) y distancia (px) son un doble toque */
const DOUBLE_TAP = { ms: 300, px: 24 }
/** Un dedo que se mueve menos que esto (px) es un toque, no un arrastre */
const TAP_SLOP = 8
/** Deslizar de lado más que esto (px), sin acercar, pasa a la pantalla vecina */
const SWIPE_PX = 60
/** Cuánto sigue la imagen al dedo mientras se desliza para pasar */
const SWIPE_FOLLOW = 0.6

interface View {
  scale: number
  x: number
  y: number
}

/** Hacia dónde se pasa: a la anterior (-1) o a la siguiente (1) */
type Step = -1 | 1

interface Gallery {
  items: GalleryItem[]
  index: number
}

/** Botón redondo del visor (cerrar, anterior, siguiente) */
const ROUND_BUTTON =
  'grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition-[background-color,border-color,transform] duration-150 hover:border-white/40 hover:bg-white/20 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'

/** Precarga las imágenes vecinas para que pasar sea inmediato */
function preloadAround({ items, index }: Gallery) {
  for (const step of [-1, 1]) {
    const src = items[(index + step + items.length) % items.length]?.src
    if (src) new Image().src = src
  }
}

/**
 * Tocar (o hacer clic en) cualquier pantalla de un producto o tablero de
 * bocetos lo abre a pantalla completa: se acerca con dos dedos, doble toque o
 * la rueda del ratón, y se arrastra para recorrerlo. Con las flechas (de la
 * pantalla o del teclado) o deslizando de lado se pasa a las demás de la página.
 */
export function ScreenshotZoom() {
  const { t } = useLocale()
  const [gallery, setGallery] = useState<Gallery | null>(null)
  const [narrow, setNarrow] = useState(false)
  useEffect(() => {
    const query = window.matchMedia(NARROW_QUERY)
    const onClick = (e: MouseEvent) => {
      const next = zoomTarget(e)
      if (!next) return
      // Se abre en lugar de lo que haría el toque (pasar de lámina, abrir un enlace).
      e.preventDefault()
      e.stopPropagation()
      setNarrow(query.matches)
      setGallery(collectGallery(next))
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])

  const close = useCallback(() => setGallery(null), [])
  const go = useCallback((step: Step) => {
    setGallery((g) => (g && g.items.length > 1 ? { ...g, index: (g.index + step + g.items.length) % g.items.length } : g))
  }, [])

  // Cada pieza se prepara al llegar a ella (un tablero se copia en ese momento).
  const shot = useMemo<Shot | null>(() => (gallery ? gallery.items[gallery.index].shot() : null), [gallery])
  const total = gallery?.items.length ?? 0
  const isOpen = gallery !== null

  useEffect(() => {
    if (gallery) preloadAround(gallery)
  }, [gallery])

  useEffect(() => {
    if (!isOpen) return
    const lenis = getLenis()
    lenis?.stop()
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowLeft') go(-1)
      else if (e.key === 'ArrowRight') go(1)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
      lenis?.start()
    }
  }, [isOpen, close, go])

  if (!gallery || !shot) return null
  const canStep = total > 1
  return createPortal(
    <div
      data-zoom-viewer
      role="dialog"
      aria-modal="true"
      aria-label={shot.alt || t({ es: 'Pantalla ampliada', en: 'Enlarged screen' })}
      className="fixed inset-0 z-[220] bg-black/95"
    >
      <ZoomStage key={gallery.index} shot={shot} onSwipe={canStep ? go : undefined} />
      {canStep && (
        <p aria-live="polite" className="absolute left-4 top-[calc(1rem+env(safe-area-inset-top))] flex h-11 items-center font-mono text-[11px] uppercase tracking-[0.14em] text-white/60">
          {gallery.index + 1} / {total}
        </p>
      )}
      <p className="pointer-events-none absolute inset-x-0 bottom-[calc(1.25rem+env(safe-area-inset-bottom))] px-4 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-white/45">
        {narrow
          ? canStep
            ? t({ es: 'Desliza para pasar · pellizca o toca dos veces para acercar', en: 'Swipe to browse · pinch or double-tap to zoom' })
            : t({ es: 'Pellizca o toca dos veces para acercar', en: 'Pinch or double-tap to zoom' })
          : canStep
            ? t({
                es: '← → para pasar · rueda o doble clic para acercar · Esc para cerrar',
                en: '← → to browse · scroll or double-click to zoom · Esc to close',
              })
            : t({
                es: 'Rueda o doble clic para acercar · arrastra para recorrer · Esc para cerrar',
                en: 'Scroll or double-click to zoom · drag to pan · Esc to close',
              })}
      </p>
      {canStep && (
        <>
          <button type="button" onClick={() => go(-1)} aria-label={t({ es: 'Anterior', en: 'Previous' })} className={`absolute left-3 top-1/2 -translate-y-1/2 md:left-6 ${ROUND_BUTTON}`}>
            <Chevron dir={-1} />
          </button>
          <button type="button" onClick={() => go(1)} aria-label={t({ es: 'Siguiente', en: 'Next' })} className={`absolute right-3 top-1/2 -translate-y-1/2 md:right-6 ${ROUND_BUTTON}`}>
            <Chevron dir={1} />
          </button>
        </>
      )}
      <button type="button" onClick={close} aria-label={t({ es: 'Cerrar', en: 'Close' })} className={`absolute right-4 top-[calc(1rem+env(safe-area-inset-top))] text-xl ${ROUND_BUTTON}`}>
        ×
      </button>
    </div>,
    document.body,
  )
}

function Chevron({ dir }: { dir: Step }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d={dir === -1 ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

interface ZoomStageProps {
  shot: Shot
  /** Deslizar de lado sin acercar pasa a la vecina (solo si hay más de una) */
  onSwipe?: (step: Step) => void
}

/** La imagen o el tablero, con acercamiento por pellizco, doble toque, rueda y arrastre. */
function ZoomStage({ shot, onSwipe }: ZoomStageProps) {
  const stageRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLElement | null>(null)
  const hostRef = useRef<HTMLDivElement>(null)
  /** Un tablero se muestra a su tamaño de diseño, encogido para caber en la pantalla */
  const sideRoom = onSwipe && !window.matchMedia(NARROW_QUERY).matches ? BOARD_MARGIN.xWithArrows : BOARD_MARGIN.x
  const fit = shot.kind === 'node' ? Math.min((window.innerWidth - sideRoom) / shot.w, (window.innerHeight - BOARD_MARGIN.y) / shot.h, 1.4) : 1

  useEffect(() => {
    const host = hostRef.current
    if (shot.kind !== 'node' || !host) return
    host.replaceChildren(shot.node)
    return () => host.replaceChildren()
  }, [shot])
  const view = useRef<View>({ scale: 1, x: 0, y: 0 })
  const pointers = useRef(new Map<number, { x: number; y: number }>())
  const gesture = useRef({ moved: 0, pinched: false, start: { x: 0, y: 0 }, lastTap: { at: 0, x: 0, y: 0 } })

  /** Aplica la vista sin pasar por React (fluido mientras el dedo se mueve) */
  const apply = useCallback((next: View, animate = false) => {
    const stage = stageRef.current
    const img = imgRef.current
    if (!stage || !img) return
    // No deja que la imagen se vaya del todo fuera de la pantalla.
    const limitX = Math.max(0, (img.offsetWidth * next.scale - stage.clientWidth) / 2)
    const limitY = Math.max(0, (img.offsetHeight * next.scale - stage.clientHeight) / 2)
    const clamped = {
      scale: next.scale,
      x: Math.max(-limitX, Math.min(limitX, next.x)),
      y: Math.max(-limitY, Math.min(limitY, next.y)),
    }
    view.current = clamped
    img.style.transition = animate ? 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1)' : 'none'
    img.style.transform = `translate3d(${clamped.x}px, ${clamped.y}px, 0) scale(${clamped.scale})`
  }, [])

  /** Acerca o aleja manteniendo fijo el punto `p` (relativo al centro de la pantalla) */
  const zoomAt = useCallback(
    (scale: number, p: { x: number; y: number }, animate = false) => {
      const current = view.current
      const next = Math.max(SCALE.min, Math.min(SCALE.max, scale))
      const k = next / current.scale
      apply(
        {
          scale: next,
          x: p.x - (p.x - current.x) * k,
          y: p.y - (p.y - current.y) * k,
        },
        animate,
      )
    },
    [apply],
  )

  const local = (e: { clientX: number; clientY: number }) => {
    const r = stageRef.current?.getBoundingClientRect()
    return r
      ? {
          x: e.clientX - r.left - r.width / 2,
          y: e.clientY - r.top - r.height / 2,
        }
      : { x: 0, y: 0 }
  }

  const onPointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    if (pointers.current.size === 1) gesture.current = { ...gesture.current, moved: 0, pinched: false, start: { x: e.clientX, y: e.clientY } }
  }

  /** Sin acercar, la imagen sigue al dedo de lado para anunciar que se puede pasar */
  const follow = (e: { clientX: number }) => {
    const img = imgRef.current
    if (!img || !onSwipe) return
    img.style.transition = 'none'
    img.style.transform = `translate3d(${(e.clientX - gesture.current.start.x) * SWIPE_FOLLOW}px, 0, 0)`
  }

  /** ¿Fue un deslizamiento de lado (sin acercar ni pellizcar)? Entonces pasa a la vecina. */
  const swiped = (e: { clientX: number; clientY: number }): boolean => {
    if (!onSwipe || gesture.current.pinched || view.current.scale > SCALE.min) return false
    const dx = e.clientX - gesture.current.start.x
    const dy = e.clientY - gesture.current.start.y
    if (Math.abs(dx) < SWIPE_PX || Math.abs(dx) < Math.abs(dy)) return false
    onSwipe(dx < 0 ? 1 : -1)
    return true
  }

  const onWheel = (e: React.WheelEvent) => {
    zoomAt(view.current.scale * Math.exp(-e.deltaY * WHEEL_ZOOM), local(e))
  }

  const onPointerMove = (e: React.PointerEvent) => {
    const prev = pointers.current.get(e.pointerId)
    if (!prev) return
    const all = Array.from(pointers.current.values())
    if (all.length === 2) {
      const other = all.find((p) => p !== prev)
      if (!other) return
      const before = Math.hypot(prev.x - other.x, prev.y - other.y)
      const after = Math.hypot(e.clientX - other.x, e.clientY - other.y)
      const mid = local({
        clientX: (e.clientX + other.x) / 2,
        clientY: (e.clientY + other.y) / 2,
      })
      if (before > 0) zoomAt(view.current.scale * (after / before), mid)
      gesture.current.moved += TAP_SLOP
      gesture.current.pinched = true
    } else if (all.length === 1) {
      const dx = e.clientX - prev.x
      const dy = e.clientY - prev.y
      gesture.current.moved += Math.abs(dx) + Math.abs(dy)
      if (view.current.scale > SCALE.min)
        apply({
          ...view.current,
          x: view.current.x + dx,
          y: view.current.y + dy,
        })
      else if (!gesture.current.pinched) follow(e)
    }
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
  }

  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId)
    if (pointers.current.size > 0) return
    if (gesture.current.moved > TAP_SLOP && swiped(e)) return
    if (view.current.scale < SCALE.min + 0.02) apply({ scale: SCALE.min, x: 0, y: 0 }, true)
    if (gesture.current.moved > TAP_SLOP) return
    // Doble toque: acerca donde se tocó, o vuelve a la vista completa.
    const now = performance.now()
    const last = gesture.current.lastTap
    const isDouble = now - last.at < DOUBLE_TAP.ms && Math.hypot(e.clientX - last.x, e.clientY - last.y) < DOUBLE_TAP.px
    gesture.current.lastTap = {
      at: isDouble ? 0 : now,
      x: e.clientX,
      y: e.clientY,
    }
    if (!isDouble) return
    if (view.current.scale > SCALE.min) apply({ scale: SCALE.min, x: 0, y: 0 }, true)
    else zoomAt(SCALE.doubleTap, local(e), true)
  }

  return (
    <div
      ref={stageRef}
      className={`absolute inset-0 isolate grid touch-none select-none place-items-center overflow-hidden px-3 py-20 ${onSwipe ? 'md:px-20' : ''}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onWheel={onWheel}
    >
      {shot.kind === 'img' ? (
        // eslint-disable-next-line @next/next/no-img-element -- la imagen original, a su tamaño real, para acercarla nítida
        <img
          ref={(el) => {
            imgRef.current = el
          }}
          src={shot.src}
          alt={shot.alt}
          draggable={false}
          className="max-h-full max-w-full origin-center object-contain will-change-transform"
        />
      ) : (
        <div
          ref={(el) => {
            imgRef.current = el
          }}
          className="relative origin-center will-change-transform"
          style={{ width: shot.w * fit, height: shot.h * fit }}
        >
          <div ref={hostRef} aria-hidden="true" className="pointer-events-none absolute left-0 top-0 origin-top-left text-[#2a2d33]" style={{ width: shot.w, transform: `scale(${fit})` }} />
        </div>
      )}
    </div>
  )
}

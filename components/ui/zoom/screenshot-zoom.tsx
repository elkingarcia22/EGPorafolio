'use client'

import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { getLenis } from '@/lib/motion'
import { useLocale } from '@/lib/i18n'
import { collectGallery, zoomTarget, type GalleryItem } from './zoom-targets'
import { wrapIndex, ZoomCarousel } from './zoom-carousel'
import { NARROW_QUERY, type Step } from './zoom-stage'

/** Con más pantallas que esto, en vez de puntos se muestra «3 / 12» */
const MAX_DOTS = 10

/** Botón redondo del visor (cerrar, anterior, siguiente) */
const ROUND_BUTTON =
  'grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/30 bg-white/[0.14] text-white shadow-[0_8px_24px_-8px_rgba(0,0,0,0.8)] backdrop-blur-md transition-[background-color,border-color,color,transform] duration-150 hover:border-signal/70 hover:bg-white/20 hover:text-signal active:scale-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal'

interface Gallery {
  items: GalleryItem[]
  /** Posición sin límites: ver ZoomCarousel */
  pos: number
}

/**
 * Tocar (o hacer clic en) cualquier pantalla de un producto o tablero de bocetos lo abre a
 * pantalla completa: se acerca con dos dedos, doble toque o la rueda del ratón, y se arrastra
 * para recorrerlo. Las demás de la página forman un carrusel: se pasa deslizando de lado, con
 * las flechas (de la pantalla o del teclado) o tocando los puntos.
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
      const { items, index } = collectGallery(next)
      setGallery({ items, pos: index })
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])

  const close = useCallback(() => setGallery(null), [])
  const go = useCallback((step: Step) => {
    setGallery((g) => (g && g.items.length > 1 ? { ...g, pos: g.pos + step } : g))
  }, [])
  /** Salta a una pantalla por el camino más corto (así, si es la vecina, el paso se anima) */
  const jumpTo = useCallback((target: number) => {
    setGallery((g) => {
      if (!g) return g
      const total = g.items.length
      let delta = target - wrapIndex(g.pos, total)
      if (delta > total / 2) delta -= total
      if (delta < -total / 2) delta += total
      return { ...g, pos: g.pos + delta }
    })
  }, [])

  const isOpen = gallery !== null
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

  if (!gallery) return null
  const total = gallery.items.length
  const index = wrapIndex(gallery.pos, total)
  const current = gallery.items[index]
  const canStep = total > 1
  const prev = t({ es: 'Anterior', en: 'Previous' })
  const next = t({ es: 'Siguiente', en: 'Next' })

  return createPortal(
    <div
      data-zoom-viewer
      role="dialog"
      aria-modal="true"
      aria-roledescription={canStep ? t({ es: 'carrusel', en: 'carousel' }) : undefined}
      aria-label={current.alt || t({ es: 'Pantalla ampliada', en: 'Enlarged screen' })}
      className="zoom-viewer-in fixed inset-0 z-[220] overflow-hidden bg-black/95"
    >
      <ZoomCarousel items={gallery.items} pos={gallery.pos} onStep={go} />

      {canStep && (
        <>
          {/* Escritorio: flechas a los lados */}
          <button type="button" onClick={() => go(-1)} aria-label={prev} className={`absolute left-6 top-1/2 hidden -translate-y-1/2 md:grid ${ROUND_BUTTON}`}>
            <Chevron dir={-1} />
          </button>
          <button type="button" onClick={() => go(1)} aria-label={next} className={`absolute right-6 top-1/2 hidden -translate-y-1/2 md:grid ${ROUND_BUTTON}`}>
            <Chevron dir={1} />
          </button>

          {/* Abajo: en el teléfono, las flechas junto a los puntos; en escritorio, solo los puntos */}
          <nav
            aria-label={t({ es: 'Pantallas', en: 'Screens' })}
            className="absolute inset-x-0 bottom-[calc(3.25rem+env(safe-area-inset-bottom))] flex items-center justify-center gap-5 px-4 md:bottom-[calc(3rem+env(safe-area-inset-bottom))]"
          >
            <button type="button" onClick={() => go(-1)} aria-label={prev} className={`md:hidden ${ROUND_BUTTON}`}>
              <Chevron dir={-1} />
            </button>
            <Progress total={total} index={index} onJump={jumpTo} />
            <button type="button" onClick={() => go(1)} aria-label={next} className={`md:hidden ${ROUND_BUTTON}`}>
              <Chevron dir={1} />
            </button>
          </nav>
          <p aria-live="polite" className="sr-only">
            {index + 1} / {total}
          </p>
        </>
      )}

      <p className="pointer-events-none absolute inset-x-0 bottom-[calc(1.25rem+env(safe-area-inset-bottom))] px-4 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-white/45 md:text-[11px]">
        {hint(narrow, canStep, t)}
      </p>
      <button type="button" onClick={close} aria-label={t({ es: 'Cerrar', en: 'Close' })} className={`absolute right-4 top-[calc(1rem+env(safe-area-inset-top))] text-2xl ${ROUND_BUTTON}`}>
        ×
      </button>
    </div>,
    document.body,
  )
}

type Translate = ReturnType<typeof useLocale>['t']

/** La pista de abajo: cómo acercar y, si hay más de una, cómo pasar */
function hint(narrow: boolean, canStep: boolean, t: Translate): string {
  if (narrow)
    return canStep
      ? t({ es: 'Desliza para pasar · pellizca para acercar', en: 'Swipe to browse · pinch to zoom' })
      : t({ es: 'Pellizca o toca dos veces para acercar', en: 'Pinch or double-tap to zoom' })
  return canStep
    ? t({ es: '← → para pasar · rueda o doble clic para acercar · Esc para cerrar', en: '← → to browse · scroll or double-click to zoom · Esc to close' })
    : t({ es: 'Rueda o doble clic para acercar · arrastra para recorrer · Esc para cerrar', en: 'Scroll or double-click to zoom · drag to pan · Esc to close' })
}

interface ProgressProps {
  total: number
  index: number
  onJump: (index: number) => void
}

/** Dónde se está: un punto por pantalla (el actual se alarga en dorado), o «3 / 12» si son muchas */
function Progress({ total, index, onJump }: ProgressProps) {
  const { t } = useLocale()
  if (total > MAX_DOTS)
    return (
      <span className="min-w-[4.5rem] text-center font-mono text-xs tabular-nums tracking-[0.14em] text-white/75">
        {index + 1} <span className="text-white/35">/ {total}</span>
      </span>
    )
  return (
    <div className="flex items-center">
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onJump(i)}
          aria-label={t({ es: `Ir a la ${i + 1} de ${total}`, en: `Go to ${i + 1} of ${total}` })}
          aria-current={i === index ? 'true' : undefined}
          className="group grid h-8 place-items-center px-[5px] focus-visible:outline-none"
        >
          <span
            className={`block h-1.5 rounded-full transition-[width,background-color] duration-300 ease-expo group-focus-visible:ring-2 group-focus-visible:ring-signal ${
              i === index ? 'w-6 bg-signal' : 'w-1.5 bg-white/35 group-hover:bg-white/70'
            }`}
          />
        </button>
      ))}
    </div>
  )
}

function Chevron({ dir }: { dir: Step }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d={dir === -1 ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { getLenis } from '@/lib/motion'
import { useLocale } from '@/lib/i18n'

/** Teléfono: ahí también se abren las pantallas que están dentro de un botón (en escritorio, el clic es del botón) */
const NARROW_QUERY = '(max-width: 767px)'
/** Los tableros de bocetos (y otras piezas dibujadas) que se pueden ampliar */
const ZOOMABLE = '[data-zoomable]'
/** Margen alrededor de un tablero ampliado (px) */
const BOARD_MARGIN = { x: 24, y: 160 }
/** Sensibilidad de la rueda del ratón al acercar */
const WHEEL_ZOOM = 0.0015
/** Cada cuánto, como mucho, se mira qué pantalla queda bajo el cursor (ms) */
const HOVER_THROTTLE_MS = 60
/** Las pantallas de los productos viven en esta carpeta */
const SCREENS_PATH = '/cases/'
/** Imágenes más angostas que esto (px) son íconos o adornos, no pantallas */
const MIN_WIDTH = 100
/** Límites del acercamiento */
const SCALE = { min: 1, max: 5, doubleTap: 2.5 }
/** Dos toques dentro de este tiempo (ms) y distancia (px) son un doble toque */
const DOUBLE_TAP = { ms: 300, px: 24 }
/** Un dedo que se mueve menos que esto (px) es un toque, no un arrastre */
const TAP_SLOP = 8

interface View {
  scale: number
  x: number
  y: number
}

/** Lo que se amplía: una imagen (a su resolución original) o una copia de un tablero dibujado */
type Shot = { kind: 'img'; src: string; alt: string } | { kind: 'node'; node: HTMLElement; w: number; h: number; alt: string }

/** La imagen original (sin el redimensionado de next/image), para verla nítida al acercar. */
function originalSrc(img: HTMLImageElement): string {
  const src = img.currentSrc || img.src
  try {
    const url = new URL(src, window.location.href)
    const raw = url.pathname.startsWith('/_next/image') ? url.searchParams.get('url') : null
    return raw ?? src
  } catch {
    return src
  }
}

/** ¿Es una pantalla de producto? (de la carpeta de casos y de buen tamaño) */
function isScreenshot(img: HTMLImageElement): boolean {
  if (img.getBoundingClientRect().width < MIN_WIDTH) return false
  return decodeURIComponent(img.currentSrc || img.src).includes(SCREENS_PATH)
}

/** Lo que se puede tocar encima de una pantalla (flechas, botones): esos toques no la abren */
const INTERACTIVE = 'button, a, input, select, textarea, [role="tab"], [role="button"]'

/**
 * La pantalla que quedó bajo el dedo, aunque encima haya una capa decorativa (un velo, un
 * marco). Si lo tocado es un botón o un enlace que no la contiene, el toque es de ese control.
 */
function screenshotAt(e: MouseEvent, narrow: boolean): HTMLImageElement | null {
  const target = e.target instanceof Element ? e.target : null
  if (!target) return null
  const img =
    target instanceof HTMLImageElement
      ? isScreenshot(target)
        ? target
        : null
      : (document.elementsFromPoint(e.clientX, e.clientY).find((el): el is HTMLImageElement => el instanceof HTMLImageElement && isScreenshot(el)) ?? null)
  if (!img) return null
  const control = target.closest(INTERACTIVE)
  // Un botón o enlace que no la contiene se queda con el clic. Uno que la contiene (una lámina
  // que se elige, por ejemplo) solo cede el toque en el teléfono.
  if (control && (!control.contains(img) || !narrow)) return null
  return img
}

/** Copia estática de un tablero dibujado, con todo lo animado ya en su sitio */
function boardCopy(board: HTMLElement): HTMLElement {
  const copy = board.cloneNode(true) as HTMLElement
  copy.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    el.style.opacity = '1'
    el.style.visibility = 'visible'
    el.style.transform = 'none'
  })
  copy.querySelectorAll<SVGElement>('[data-draw]').forEach((el) => {
    el.style.strokeDashoffset = '0'
  })
  copy.style.width = `${board.offsetWidth}px`
  copy.style.minWidth = '0'
  copy.style.margin = '0'
  return copy
}

/** Lo que hay que ampliar bajo el clic: un tablero de bocetos o una pantalla del producto */
function zoomTarget(e: MouseEvent, narrow: boolean): Shot | null {
  const target = e.target instanceof Element ? e.target : null
  if (!target) return null
  const board = target.closest<HTMLElement>(ZOOMABLE)
  if (board) {
    const control = target.closest(INTERACTIVE)
    if (control && board.contains(control)) return null
    return {
      kind: 'node',
      node: boardCopy(board),
      w: board.offsetWidth,
      h: board.offsetHeight,
      alt: board.getAttribute('aria-label') ?? '',
    }
  }
  const img = screenshotAt(e, narrow)
  return img ? { kind: 'img', src: originalSrc(img), alt: img.alt } : null
}

/**
 * Tocar (o hacer clic en) cualquier pantalla de un producto o tablero de
 * bocetos lo abre a pantalla completa: se acerca con dos dedos, doble toque o
 * la rueda del ratón, y se arrastra para recorrerlo.
 */
export function ScreenshotZoom() {
  const { t } = useLocale()
  const [shot, setShot] = useState<Shot | null>(null)
  const [narrow, setNarrow] = useState(false)
  /** Escritorio: la pantalla bajo el cursor que vive dentro de un botón (su clic es del botón) */
  const [hovered, setHovered] = useState<{
    img: HTMLImageElement
    top: number
    right: number
  } | null>(null)

  // Escritorio: sobre una pantalla que está dentro de un botón (una lámina que se elige, una
  // tarjeta que lleva a otro lado) aparece un botón «Ampliar» en su esquina.
  useEffect(() => {
    const canHover = window.matchMedia('(hover: hover) and (min-width: 768px)')
    let last = 0
    const onMove = (e: PointerEvent) => {
      if (!canHover.matches || e.pointerType !== 'mouse') return
      const now = performance.now()
      if (now - last < HOVER_THROTTLE_MS) return
      last = now
      if (e.target instanceof Element && e.target.closest('[data-zoom-hint]')) return
      const img = document.elementsFromPoint(e.clientX, e.clientY).find((el): el is HTMLImageElement => el instanceof HTMLImageElement && isScreenshot(el))
      if (!img || !img.closest(INTERACTIVE)) {
        setHovered(null)
        return
      }
      const r = img.getBoundingClientRect()
      setHovered((prev) => (prev?.img === img && prev.top === r.top && prev.right === r.right ? prev : { img, top: r.top, right: r.right }))
    }
    const onScroll = () => setHovered(null)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  useEffect(() => {
    const query = window.matchMedia(NARROW_QUERY)
    const onClick = (e: MouseEvent) => {
      const next = zoomTarget(e, query.matches)
      if (!next) return
      // Se abre en lugar de lo que haría el toque (pasar de lámina, abrir un enlace).
      e.preventDefault()
      e.stopPropagation()
      setNarrow(query.matches)
      setShot(next)
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])

  const close = useCallback(() => setShot(null), [])

  useEffect(() => {
    if (!shot) return
    const lenis = getLenis()
    lenis?.stop()
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
      lenis?.start()
    }
  }, [shot, close])

  if (!shot) {
    if (!hovered) return null
    return createPortal(
      <button
        type="button"
        data-zoom-hint
        onClick={() => {
          setNarrow(false)
          setShot({
            kind: 'img',
            src: originalSrc(hovered.img),
            alt: hovered.img.alt,
          })
          setHovered(null)
        }}
        className="fixed z-[90] flex -translate-x-full items-center gap-1.5 rounded-full border border-white/20 bg-[#0b0d16]/80 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-white backdrop-blur transition-colors hover:border-white/50"
        style={{ top: hovered.top + 10, left: hovered.right - 10 }}
      >
        <span aria-hidden="true">⤢</span>
        {t({ es: 'Ampliar', en: 'Enlarge' })}
      </button>,
      document.body,
    )
  }
  return createPortal(
    <div role="dialog" aria-modal="true" aria-label={shot.alt || t({ es: 'Pantalla ampliada', en: 'Enlarged screen' })} className="fixed inset-0 z-[220] bg-black/95">
      <ZoomStage shot={shot} />
      <p className="pointer-events-none absolute inset-x-0 bottom-[calc(1.25rem+env(safe-area-inset-bottom))] text-center font-mono text-[11px] uppercase tracking-[0.14em] text-white/45">
        {narrow
          ? t({
              es: 'Pellizca o toca dos veces para acercar',
              en: 'Pinch or double-tap to zoom',
            })
          : t({
              es: 'Rueda o doble clic para acercar · arrastra para recorrer · Esc para cerrar',
              en: 'Scroll or double-click to zoom · drag to pan · Esc to close',
            })}
      </p>
      <button
        type="button"
        onClick={close}
        aria-label={t({ es: 'Cerrar', en: 'Close' })}
        className="absolute right-4 top-[calc(1rem+env(safe-area-inset-top))] grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-white/10 text-xl text-white backdrop-blur"
      >
        ×
      </button>
    </div>,
    document.body,
  )
}

/** La imagen o el tablero, con acercamiento por pellizco, doble toque, rueda y arrastre. */
function ZoomStage({ shot }: { shot: Shot }) {
  const stageRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLElement | null>(null)
  const hostRef = useRef<HTMLDivElement>(null)
  /** Un tablero se muestra a su tamaño de diseño, encogido para caber en la pantalla */
  const fit = shot.kind === 'node' ? Math.min((window.innerWidth - BOARD_MARGIN.x) / shot.w, (window.innerHeight - BOARD_MARGIN.y) / shot.h, 1.4) : 1

  useEffect(() => {
    const host = hostRef.current
    if (shot.kind !== 'node' || !host) return
    host.replaceChildren(shot.node)
    return () => host.replaceChildren()
  }, [shot])
  const view = useRef<View>({ scale: 1, x: 0, y: 0 })
  const pointers = useRef(new Map<number, { x: number; y: number }>())
  const gesture = useRef({ moved: 0, lastTap: { at: 0, x: 0, y: 0 } })

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
    if (pointers.current.size === 1) gesture.current.moved = 0
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
    }
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
  }

  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId)
    if (pointers.current.size > 0) return
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
      className="absolute inset-0 grid touch-none select-none place-items-center overflow-hidden px-3 py-20"
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

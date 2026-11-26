'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { getLenis } from '@/lib/motion'
import { useLocale } from '@/lib/i18n'

/** Solo en el teléfono: ahí las pantallas se ven pequeñas */
const NARROW_QUERY = '(max-width: 767px)'
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

interface Shot {
  src: string
  alt: string
}

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
function screenshotAt(e: MouseEvent): HTMLImageElement | null {
  const target = e.target instanceof Element ? e.target : null
  if (!target) return null
  if (target instanceof HTMLImageElement) return isScreenshot(target) ? target : null
  const img = document
    .elementsFromPoint(e.clientX, e.clientY)
    .find((el): el is HTMLImageElement => el instanceof HTMLImageElement && isScreenshot(el))
  if (!img) return null
  const control = target.closest(INTERACTIVE)
  if (control && !control.contains(img)) return null
  return img
}

/**
 * En el teléfono, tocar cualquier pantalla de un producto la abre a pantalla
 * completa: se acerca con dos dedos o con doble toque, y se arrastra para
 * recorrerla. En pantallas anchas no hace nada.
 */
export function ScreenshotZoom() {
  const { t } = useLocale()
  const [shot, setShot] = useState<Shot | null>(null)

  useEffect(() => {
    const narrow = window.matchMedia(NARROW_QUERY)
    const onClick = (e: MouseEvent) => {
      if (!narrow.matches) return
      const img = screenshotAt(e)
      if (!img) return
      // La pantalla se abre en lugar de lo que haría el toque (pasar de lámina, abrir un enlace).
      e.preventDefault()
      e.stopPropagation()
      setShot({ src: originalSrc(img), alt: img.alt })
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

  if (!shot) return null
  return createPortal(
    <div role="dialog" aria-modal="true" aria-label={shot.alt || t({ es: 'Pantalla ampliada', en: 'Enlarged screen' })} className="fixed inset-0 z-[220] bg-black/95">
      <ZoomStage src={shot.src} alt={shot.alt} />
      <p className="pointer-events-none absolute inset-x-0 bottom-[calc(1.25rem+env(safe-area-inset-bottom))] text-center font-mono text-[11px] uppercase tracking-[0.14em] text-white/45">
        {t({ es: 'Pellizca o toca dos veces para acercar', en: 'Pinch or double-tap to zoom' })}
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

/** La imagen con acercamiento por pellizco, doble toque y arrastre. */
function ZoomStage({ src, alt }: Shot) {
  const stageRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
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
  const zoomAt = useCallback((scale: number, p: { x: number; y: number }, animate = false) => {
    const current = view.current
    const next = Math.max(SCALE.min, Math.min(SCALE.max, scale))
    const k = next / current.scale
    apply({ scale: next, x: p.x - (p.x - current.x) * k, y: p.y - (p.y - current.y) * k }, animate)
  }, [apply])

  const local = (e: { clientX: number; clientY: number }) => {
    const r = stageRef.current?.getBoundingClientRect()
    return r ? { x: e.clientX - r.left - r.width / 2, y: e.clientY - r.top - r.height / 2 } : { x: 0, y: 0 }
  }

  const onPointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    if (pointers.current.size === 1) gesture.current.moved = 0
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
      const mid = local({ clientX: (e.clientX + other.x) / 2, clientY: (e.clientY + other.y) / 2 })
      if (before > 0) zoomAt(view.current.scale * (after / before), mid)
      gesture.current.moved += TAP_SLOP
    } else if (all.length === 1) {
      const dx = e.clientX - prev.x
      const dy = e.clientY - prev.y
      gesture.current.moved += Math.abs(dx) + Math.abs(dy)
      if (view.current.scale > SCALE.min) apply({ ...view.current, x: view.current.x + dx, y: view.current.y + dy })
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
    gesture.current.lastTap = { at: isDouble ? 0 : now, x: e.clientX, y: e.clientY }
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
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- la imagen original, a su tamaño real, para acercarla nítida */}
      <img ref={imgRef} src={src} alt={alt} draggable={false} className="max-h-full max-w-full origin-center object-contain will-change-transform" />
    </div>
  )
}

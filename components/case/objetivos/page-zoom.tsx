'use client'

import Image from 'next/image'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLocale } from '@/lib/i18n'
import { getLenis } from '@/lib/motion'

/** Niveles de zoom: 1 = la página cabe a lo ancho de la pantalla. */
const ZOOM_STEPS = [1, 1.5, 2, 3] as const
const PHONE_MAX = 767

interface PageZoomProps {
  src: string
  w: number
  h: number
  label: string
  path: string
  onClose: () => void
}

/**
 * La captura a pantalla completa, para ampliarla y moverse en cualquier dirección:
 * con el dedo o la rueda, arrastrando con el mouse y con − / + (o las teclas).
 */
export function PageZoom({ src, w, h, label, path, onClose }: PageZoomProps) {
  const { t } = useLocale()
  const stageRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  // En el teléfono arranca ampliada: a lo ancho de la pantalla no se lee.
  const [zi, setZi] = useState(() => (typeof window !== 'undefined' && window.innerWidth <= PHONE_MAX ? 2 : 0))
  const zoom = ZOOM_STEPS[zi]
  const center = useRef({ x: 0.5, y: 0 })

  const remember = () => {
    const el = stageRef.current
    if (!el || !el.scrollWidth) return
    center.current = { x: (el.scrollLeft + el.clientWidth / 2) / el.scrollWidth, y: el.scrollTop / el.scrollHeight }
  }
  const zoomBy = (d: number) => {
    remember()
    setZi((i) => Math.min(ZOOM_STEPS.length - 1, Math.max(0, i + d)))
  }

  // Al cambiar el zoom se conserva lo que se estaba mirando.
  useLayoutEffect(() => {
    const el = stageRef.current
    if (!el) return
    el.scrollLeft = center.current.x * el.scrollWidth - el.clientWidth / 2
    el.scrollTop = center.current.y * el.scrollHeight
  }, [zoom])

  // Abrir: congela el scroll del sitio, enfoca el cierre; Esc cierra y +/− amplían.
  useEffect(() => {
    const trigger = document.activeElement as HTMLElement | null
    const lenis = getLenis()
    lenis?.stop()
    const html = document.documentElement
    const prev = html.style.overflow
    html.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === '+' || e.key === '=') zoomBy(1)
      else if (e.key === '-') zoomBy(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      html.style.overflow = prev
      lenis?.start()
      trigger?.focus()
    }
    // zoomBy solo usa refs y el setter: no hace falta volver a suscribir.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose])

  // Arrastrar con el mouse mueve la página en las dos direcciones.
  const drag = useRef<{ x: number; y: number; left: number; top: number } | null>(null)
  const onDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return
    const el = e.currentTarget
    drag.current = { x: e.clientX, y: e.clientY, left: el.scrollLeft, top: el.scrollTop }
    el.setPointerCapture(e.pointerId)
  }
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    if (!d) return
    e.currentTarget.scrollLeft = d.left - (e.clientX - d.x)
    e.currentTarget.scrollTop = d.top - (e.clientY - d.y)
  }
  const endDrag = () => {
    drag.current = null
  }

  const btn = 'grid h-10 w-10 place-items-center rounded-full border border-white/25 text-lg text-white transition-colors hover:border-white disabled:opacity-30'

  return createPortal(
    <div role="dialog" aria-modal="true" aria-label={label} className="obj-fade fixed inset-0 z-[78] flex flex-col bg-[#05060b]/95 text-white backdrop-blur-sm">
      <header className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{label}</p>
          <p className="truncate font-mono text-[11px] text-white/45">ubits · {path}</p>
        </div>
        <button type="button" onClick={() => zoomBy(-1)} disabled={zi === 0} aria-label={t({ es: 'Alejar', en: 'Zoom out' })} className={btn}>−</button>
        <span className="w-12 text-center font-mono text-xs tabular-nums text-white/70" aria-live="polite">{Math.round(zoom * 100)} %</span>
        <button type="button" onClick={() => zoomBy(1)} disabled={zi === ZOOM_STEPS.length - 1} aria-label={t({ es: 'Acercar', en: 'Zoom in' })} className={btn}>+</button>
        <button ref={closeRef} type="button" onClick={onClose} aria-label={t({ es: 'Cerrar', en: 'Close' })} className="ml-1 grid h-10 w-10 place-items-center rounded-full bg-white text-[#05060b] transition-transform active:scale-95">
          <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9" /></svg>
        </button>
      </header>

      <div
        ref={stageRef}
        data-lenis-prevent
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="min-h-0 flex-1 cursor-grab overflow-auto overscroll-contain active:cursor-grabbing"
      >
        <div className="mx-auto p-3 sm:p-6" style={{ width: `${zoom * 100}%`, maxWidth: zoom === 1 ? `${w / 1.5}px` : undefined }}>
          <Image src={src} width={w} height={h} alt={label} sizes={`${Math.round(zoom * 100)}vw`} quality={90} draggable={false} className="block h-auto w-full select-none rounded-lg" />
        </div>
      </div>

      <p className="border-t border-white/10 px-4 py-2 text-center text-[11px] text-white/45">
        {t({ es: 'Desliza para moverte · − / + para ampliar · Esc para cerrar', en: 'Swipe to move · − / + to zoom · Esc to close' })}
      </p>
    </div>,
    document.body,
  )
}

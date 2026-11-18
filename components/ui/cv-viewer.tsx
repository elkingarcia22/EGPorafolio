'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap, getLenis } from '@/lib/motion'
import { useLocale } from '@/lib/i18n'
import { useA11y } from '@/lib/a11y'
import { COPY } from '@/lib/content/copy'

export const CV_PDF = '/cv/elkin-garcia-hoja-de-vida.pdf'
const CV_PREVIEW = '/cv/elkin-garcia-hoja-de-vida.jpg'
const CV_FILENAME = 'Elkin-Garcia-Hoja-de-vida.pdf'
/** Proporción de la página (ancho / alto) de la hoja de vida */
const PAGE_ASPECT = 2597 / 3300
/** Ancla con la que el enlace compartido abre el visor */
export const CV_HASH = '#hoja-de-vida'

/** Niveles de zoom; 1 = la página completa cabe en pantalla */
const ZOOM_STEPS = [0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3] as const
const FIT_INDEX = ZOOM_STEPS.indexOf(1)
const STAGE_PADDING_PX = 32
const COPIED_MS = 2200

interface CvViewerProps {
  open: boolean
  onClose: () => void
}

function ToolButton({ label, onClick, disabled, children }: { label: string; onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className="flex h-9 w-9 items-center justify-center text-paper/80 transition-colors hover:bg-paper hover:text-ink focus-visible:bg-paper focus-visible:text-ink disabled:pointer-events-none disabled:opacity-30"
    >
      {children}
    </button>
  )
}

const icon = 'h-4 w-4'
const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

/** Tamaño disponible para la página dentro del escenario. */
function useStageSize(ref: React.RefObject<HTMLDivElement | null>, open: boolean) {
  const [size, setSize] = useState({ w: 0, h: 0 })
  useLayoutEffect(() => {
    const el = ref.current
    if (!open || !el) return
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight })
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, open])
  return size
}

/** Copia el enlace o usa el menú nativo de compartir (móvil). */
async function shareLink(text: string): Promise<'shared' | 'copied' | 'failed'> {
  const url = `${window.location.origin}/${CV_HASH}`
  const touch = window.matchMedia('(pointer: coarse)').matches
  if (touch && navigator.share) {
    try {
      await navigator.share({ title: text, text, url })
      return 'shared'
    } catch {
      // Cancelado por el usuario o no disponible: se copia el enlace.
    }
  }
  try {
    await navigator.clipboard.writeText(url)
    return 'copied'
  } catch {
    return copyWithSelection(url) ? 'copied' : 'failed'
  }
}

/** Respaldo cuando el portapapeles moderno no está permitido. */
function copyWithSelection(text: string): boolean {
  const field = document.createElement('textarea')
  field.value = text
  field.setAttribute('readonly', '')
  field.style.position = 'fixed'
  field.style.opacity = '0'
  document.body.appendChild(field)
  field.select()
  const ok = document.execCommand('copy')
  field.remove()
  return ok
}

/**
 * Visor de la hoja de vida: la página en grande, con zoom (botones,
 * teclado o pellizco), enlace para compartir y descarga del PDF.
 */
export function CvViewer({ open, onClose }: CvViewerProps) {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const dialogRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const [zoomIndex, setZoomIndex] = useState(FIT_INDEX)
  const [copied, setCopied] = useState(false)
  const stage = useStageSize(stageRef, open)
  const zoom = ZOOM_STEPS[zoomIndex]

  const fitWidth = Math.max(0, Math.min(stage.w - STAGE_PADDING_PX * 2, (stage.h - STAGE_PADDING_PX * 2) * PAGE_ASPECT))
  const pageWidth = Math.round(fitWidth * zoom)

  const zoomBy = useCallback((delta: number) => {
    setZoomIndex((i) => Math.min(ZOOM_STEPS.length - 1, Math.max(0, i + delta)))
  }, [])
  const fit = useCallback(() => setZoomIndex(FIT_INDEX), [])

  // Al cambiar el zoom se conserva el punto central que se estaba mirando.
  const center = useRef({ x: 0.5, y: 0.5 })
  useLayoutEffect(() => {
    const el = stageRef.current
    if (!el) return
    el.scrollLeft = center.current.x * el.scrollWidth - el.clientWidth / 2
    el.scrollTop = center.current.y * el.scrollHeight - el.clientHeight / 2
  }, [pageWidth])
  const rememberCenter = () => {
    const el = stageRef.current
    if (!el || !el.scrollWidth) return
    center.current = {
      x: (el.scrollLeft + el.clientWidth / 2) / el.scrollWidth,
      y: (el.scrollTop + el.clientHeight / 2) / el.scrollHeight,
    }
  }

  // Abrir: fija el scroll de la página, enfoca el visor y anima la entrada.
  useEffect(() => {
    if (!open) return
    const trigger = document.activeElement as HTMLElement | null
    const lenis = getLenis()
    lenis?.stop()
    const html = document.documentElement
    const prevOverflow = html.style.overflow
    html.style.overflow = 'hidden'
    setZoomIndex(FIT_INDEX)
    center.current = { x: 0.5, y: 0.5 }
    closeRef.current?.focus()

    const dialog = dialogRef.current
    if (dialog && !reducedMotion) {
      gsap.fromTo(dialog, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35, ease: 'power2.out' })
      gsap.fromTo(dialog.querySelector('[data-cv-page]'), { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, delay: 0.1, ease: 'expo.out' })
    }
    return () => {
      html.style.overflow = prevOverflow
      lenis?.start()
      trigger?.focus()
    }
  }, [open, reducedMotion])

  // Teclado: Esc cierra, +/− amplían, 0 ajusta; Tab no sale del visor.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return onClose()
      if (e.key === '+' || e.key === '=') {
        e.preventDefault()
        rememberCenter()
        return zoomBy(1)
      }
      if (e.key === '-') {
        e.preventDefault()
        rememberCenter()
        return zoomBy(-1)
      }
      if (e.key === '0') return fit()
      if (e.key !== 'Tab' || !dialogRef.current) return
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], [tabindex="0"]')
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose, zoomBy, fit])

  // Pellizco en trackpad (llega como rueda + ctrl) también hace zoom.
  useEffect(() => {
    const el = stageRef.current
    if (!open || !el) return
    let last = 0
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return
      e.preventDefault()
      const now = performance.now()
      if (now - last < 120) return
      last = now
      rememberCenter()
      zoomBy(e.deltaY < 0 ? 1 : -1)
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [open, zoomBy])

  // Con zoom, arrastrar mueve la página (como en un visor de PDF).
  const startPan = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = stageRef.current
    if (!el || zoom <= 1 || e.pointerType !== 'mouse' || e.button !== 0) return
    const origin = { x: e.clientX, y: e.clientY, left: el.scrollLeft, top: el.scrollTop }
    const move = (ev: PointerEvent) => {
      el.scrollLeft = origin.left - (ev.clientX - origin.x)
      el.scrollTop = origin.top - (ev.clientY - origin.y)
    }
    const end = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', end)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', end)
  }

  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), COPIED_MS)
    return () => window.clearTimeout(timer)
  }, [copied])

  const onShare = async () => {
    const result = await shareLink(t(COPY.cv.shareText))
    if (result === 'copied') setCopied(true)
  }

  if (!open) return null

  const zoomed = zoom > 1
  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cv-title"
      className="fixed inset-0 z-[90] flex flex-col bg-void/95 text-paper backdrop-blur-md"
    >
      <div className="flex items-center justify-between gap-3 border-b border-paper/10 px-[var(--gutter)] py-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="h-6 w-px shrink-0 bg-signal" aria-hidden="true" />
          <h2 id="cv-title" className="brand-title truncate text-[11px] md:text-xs">
            {t(COPY.cv.title)}
          </h2>
        </div>

        <div className="flex items-center gap-1 md:gap-2">
          <div className="hidden items-center border border-paper/15 sm:flex" role="group" aria-label="Zoom">
            <ToolButton
              label={t(COPY.cv.zoomOut)}
              onClick={() => {
                rememberCenter()
                zoomBy(-1)
              }}
              disabled={zoomIndex === 0}
            >
              <svg viewBox="0 0 24 24" className={icon} {...stroke}><path d="M5 12h14" /></svg>
            </ToolButton>
            <button
              type="button"
              onClick={fit}
              title={t(COPY.cv.fit)}
              aria-label={`${t(COPY.cv.fit)} (${Math.round(zoom * 100)}%)`}
              className="mono-label h-9 min-w-[4.5rem] border-x border-paper/15 tabular-nums text-paper/80 transition-colors hover:bg-paper hover:text-ink"
            >
              {Math.round(zoom * 100)}%
            </button>
            <ToolButton
              label={t(COPY.cv.zoomIn)}
              onClick={() => {
                rememberCenter()
                zoomBy(1)
              }}
              disabled={zoomIndex === ZOOM_STEPS.length - 1}
            >
              <svg viewBox="0 0 24 24" className={icon} {...stroke}><path d="M5 12h14M12 5v14" /></svg>
            </ToolButton>
          </div>

          <div className="relative">
            <ToolButton label={t(COPY.cv.share)} onClick={onShare}>
              <svg viewBox="0 0 24 24" className={icon} {...stroke}>
                <path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1" />
                <path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1" />
              </svg>
            </ToolButton>
            <span
              role="status"
              className={`mono-label pointer-events-none absolute right-0 top-full mt-2 whitespace-nowrap bg-signal px-3 py-1.5 text-paper transition-all duration-300 ${copied ? 'translate-y-0 opacity-100' : '-translate-y-1 opacity-0'}`}
            >
              {copied ? t(COPY.cv.copied) : ''}
            </span>
          </div>

          <a
            href={CV_PDF}
            download={CV_FILENAME}
            className="mono-label flex h-9 items-center gap-2 bg-signal px-3 text-paper transition-colors hover:bg-paper hover:text-ink md:px-4"
          >
            <svg viewBox="0 0 24 24" className={icon} {...stroke} aria-hidden="true"><path d="M12 4v11m0 0l-4.5-4.5M12 15l4.5-4.5M5 20h14" /></svg>
            <span className="hidden sm:inline">{t(COPY.cv.download)}</span>
            <span className="sr-only sm:hidden">{t(COPY.cv.download)}</span>
          </a>

          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={t(COPY.cv.close)}
            title={`${t(COPY.cv.close)} (Esc)`}
            className="ml-1 flex h-9 w-9 items-center justify-center border border-paper/20 transition-colors hover:bg-paper hover:text-ink"
          >
            <svg viewBox="0 0 24 24" className={icon} {...stroke}><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>
      </div>

      {/* Escenario: se desplaza dentro del visor (fuera del scroll suave de la página) */}
      <div
        ref={stageRef}
        data-lenis-prevent
        tabIndex={0}
        aria-label={t(COPY.cv.title)}
        onPointerDown={startPan}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose()
        }}
        className={`relative flex-1 overflow-auto overscroll-contain outline-none ${zoomed ? 'cursor-grab active:cursor-grabbing' : ''}`}
      >
        <div
          className="flex min-h-full min-w-full items-center justify-center"
          style={{ padding: STAGE_PADDING_PX, width: zoomed ? pageWidth + STAGE_PADDING_PX * 2 : undefined }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose()
          }}
        >
          {pageWidth > 0 && (
            // eslint-disable-next-line @next/next/no-img-element -- imagen estática ya optimizada
            <img
              data-cv-page
              src={CV_PREVIEW}
              alt={t(COPY.cv.alt)}
              width={pageWidth}
              height={Math.round(pageWidth / PAGE_ASPECT)}
              draggable={false}
              className="block max-w-none bg-paper shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]"
              style={{ width: pageWidth, height: Math.round(pageWidth / PAGE_ASPECT) }}
            />
          )}
        </div>
      </div>

      {/* Zoom en móvil: abajo, al alcance del pulgar */}
      <div className="flex items-center justify-center gap-1 border-t border-paper/10 py-2 sm:hidden" role="group" aria-label="Zoom">
        <ToolButton label={t(COPY.cv.zoomOut)} onClick={() => { rememberCenter(); zoomBy(-1) }} disabled={zoomIndex === 0}>
          <svg viewBox="0 0 24 24" className={icon} {...stroke}><path d="M5 12h14" /></svg>
        </ToolButton>
        <button type="button" onClick={fit} className="mono-label h-9 min-w-[4.5rem] tabular-nums text-paper/80">
          {Math.round(zoom * 100)}%
        </button>
        <ToolButton label={t(COPY.cv.zoomIn)} onClick={() => { rememberCenter(); zoomBy(1) }} disabled={zoomIndex === ZOOM_STEPS.length - 1}>
          <svg viewBox="0 0 24 24" className={icon} {...stroke}><path d="M5 12h14M12 5v14" /></svg>
        </ToolButton>
      </div>
    </div>
  )
}

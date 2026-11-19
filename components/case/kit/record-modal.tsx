'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { getLenis } from '@/lib/motion'
import { useLocale } from '@/lib/i18n'

export interface RecordModalProps {
  /** Los registros en el orden en que se ven: las flechas los recorren. */
  ids: readonly string[]
  /** El registro abierto, o `null` con el modal cerrado. */
  openId: string | null
  /** Abre otro registro (flechas, ← →) o cierra con `null`. */
  onOpenChange: (id: string | null) => void
  /** Nombre del registro abierto. */
  title: string
  /** Antes del título: un icono o la marca del producto. */
  titleLeading?: React.ReactNode
  /** Una línea bajo el título. */
  description?: string
  /** Acciones de la cabecera, a la izquierda de las flechas. */
  actions?: React.ReactNode
  /** Texto accesible de las flechas. */
  prevLabel?: string
  nextLabel?: string
  /** El cuerpo: en las demos, el iframe. */
  children: React.ReactNode
  /** Clases del cuerpo; por defecto ocupa todo el alto sin relleno. */
  bodyClassName?: string
}

/** Si la tecla se escribió en un campo o en un menú: entonces las flechas mueven el cursor, no el registro. */
const isTyping = (target: EventTarget | null): boolean =>
  target instanceof HTMLElement &&
  (target.isContentEditable ||
    ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) ||
    target.closest("[role='combobox'], [role='listbox'], [role='menu']") !== null)

const ICON_BTN =
  'inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/15 text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal disabled:pointer-events-none disabled:opacity-35'

function Chevron({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={dir === 'left' ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'} />
    </svg>
  )
}

/**
 * Versión del portafolio del `RecordModal` de Thema: un modal casi a pantalla completa, con aire alrededor,
 * cabecera fija (marca, título, acciones, «1 de 3», X) y cuerpo propio. Se pasa al anterior o al siguiente
 * con las flechas o con ← →, y se cierra con Esc o con el velo.
 */
export function RecordModal({ ids, openId, onOpenChange, title, titleLeading, description, actions, prevLabel, nextLabel, children, bodyClassName }: RecordModalProps) {
  const { t } = useLocale()
  const closeRef = useRef<HTMLButtonElement>(null)
  const [shown, setShown] = useState(false)
  const open = openId !== null
  const index = open ? ids.indexOf(openId) : -1
  const prevId = index > 0 ? ids[index - 1] : null
  const nextId = index >= 0 && index < ids.length - 1 ? ids[index + 1] : null

  // Bloquea el scroll del sitio mientras está abierto y devuelve el foco al cerrar.
  useEffect(() => {
    if (!open) return
    const lenis = getLenis()
    lenis?.stop()
    const html = document.documentElement
    const prevOverflow = html.style.overflow
    const returnTo = document.activeElement as HTMLElement | null
    html.style.overflow = 'hidden'
    html.dataset.modalOpen = 'true'
    closeRef.current?.focus()
    const frame = requestAnimationFrame(() => setShown(true))
    return () => {
      cancelAnimationFrame(frame)
      setShown(false)
      html.style.overflow = prevOverflow
      delete html.dataset.modalOpen
      lenis?.start()
      returnTo?.focus?.()
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') return onOpenChange(null)
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey || isTyping(event.target)) return
      if (event.key === 'ArrowLeft' && prevId) onOpenChange(prevId)
      if (event.key === 'ArrowRight' && nextId) onOpenChange(nextId)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, prevId, nextId, onOpenChange])

  if (!open || typeof document === 'undefined') return null

  // En un portal: un ancestro con transform (los reveal) movería el `fixed` fuera de la pantalla.
  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6">
      <div
        className={`absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300 ${shown ? 'opacity-100' : 'opacity-0'}`}
        onClick={() => onOpenChange(null)}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="record-modal-title"
        className={`relative flex h-full w-full flex-col overflow-hidden rounded-xl bg-[#111214] text-paper shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)] ring-1 ring-white/10 transition-[opacity,transform] duration-500 ease-expo ${shown ? 'scale-100 opacity-100' : 'scale-[0.97] opacity-0'}`}
      >
        <header className="flex shrink-0 flex-col gap-3 border-b border-white/10 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between md:gap-4">
          <div className="flex min-w-0 items-center gap-3">
            {titleLeading}
            <div className="flex min-w-0 flex-col gap-1">
              <h2 id="record-modal-title" className="truncate text-lg leading-tight">{title}</h2>
              {description && <p className="truncate font-mono text-[11px] text-white/50">{description}</p>}
            </div>
          </div>
          <div className="flex min-w-0 shrink-0 flex-wrap items-center gap-2 md:justify-end">
            {actions}
            {ids.length > 1 && index >= 0 && (
              <div className="flex items-center gap-1 md:border-l md:border-white/10 md:pl-3">
                <button type="button" className={ICON_BTN} disabled={!prevId} onClick={() => prevId && onOpenChange(prevId)} aria-label={prevLabel ?? t({ es: 'Anterior', en: 'Previous' })}>
                  <Chevron dir="left" />
                </button>
                <span className="min-w-[4rem] text-center font-mono text-xs tabular-nums text-white/55" aria-live="polite">
                  {index + 1} {t({ es: 'de', en: 'of' })} {ids.length}
                </span>
                <button type="button" className={ICON_BTN} disabled={!nextId} onClick={() => nextId && onOpenChange(nextId)} aria-label={nextLabel ?? t({ es: 'Siguiente', en: 'Next' })}>
                  <Chevron dir="right" />
                </button>
              </div>
            )}
            <button ref={closeRef} type="button" className={ICON_BTN} onClick={() => onOpenChange(null)} aria-label={t({ es: 'Cerrar', en: 'Close' })}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </header>
        <div className={bodyClassName ?? 'relative flex min-h-0 flex-1 flex-col'}>{children}</div>
      </div>
    </div>,
    document.body,
  )
}

/** Enlace «Nueva pestaña» para la cabecera del modal. */
export function NewTabLink({ href }: { href: string }) {
  const { t } = useLocale()
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex h-8 items-center rounded-md border border-white/15 px-3 font-mono text-[11px] text-white/75 transition-colors hover:bg-white/10 hover:text-white">
      {t({ es: 'Nueva pestaña', en: 'New tab' })} ↗
    </a>
  )
}

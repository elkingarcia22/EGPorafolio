'use client'

import { useEffect, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { getLenis } from '@/lib/motion'
import { COPY } from '@/lib/content/copy'

/** Aparece después de bajar una pantalla completa. */
const SHOW_AFTER_VIEWPORTS = 1
const SCROLL_DURATION_S = 1.4

/** Botón flotante para volver al inicio de la página (se usa en los casos de proyecto). */
export function BackToTop() {
  const { reducedMotion } = useA11y()
  const { t } = useLocale()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const update = () => setIsVisible(window.scrollY > window.innerHeight * SHOW_AFTER_VIEWPORTS)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  const goTop = () => {
    const lenis = getLenis()
    if (lenis && !reducedMotion) lenis.scrollTo(0, { duration: SCROLL_DURATION_S })
    else window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' })
  }

  return (
    <button
      type="button"
      onClick={goTop}
      aria-label={t(COPY.backToTop.aria)}
      tabIndex={isVisible ? 0 : -1}
      aria-hidden={!isVisible}
      className={`group fixed bottom-6 right-[var(--gutter)] z-40 flex items-center gap-2 rounded-full border border-fg/20 bg-bg/80 py-2.5 pl-3.5 pr-4 text-fg shadow-lg backdrop-blur-md transition-[opacity,transform,border-color] duration-300 hover:border-fg/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg ${
        isVisible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
      }`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" />
      </svg>
      <span className="mono-label">{t(COPY.backToTop.label)}</span>
    </button>
  )
}

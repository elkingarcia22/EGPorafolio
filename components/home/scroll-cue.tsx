'use client'

import { getLenis } from '@/lib/motion'
import { useLocale } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'

const NUDGE_VIEWPORTS = 1.1

/**
 * Indicador de scroll del hero: grande, centrado y accionable
 * (clic o Enter avanza hacia la señal). Una línea con un pulso azul
 * baja continuamente para sugerir el gesto.
 */
export function ScrollCue() {
  const { t } = useLocale()

  const advance = () => {
    const target = window.scrollY + window.innerHeight * NUDGE_VIEWPORTS
    const lenis = getLenis()
    if (lenis) lenis.scrollTo(target, { duration: 1.6 })
    else window.scrollTo({ top: target, behavior: 'smooth' })
  }

  return (
    <button
      type="button"
      data-hint
      data-cursor="↓"
      onClick={advance}
      className="group absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 text-paper md:bottom-8"
    >
      <span className="flex items-center gap-3 border border-paper/30 bg-void/40 px-5 py-2.5 backdrop-blur-sm transition-colors duration-500 group-hover:border-signal group-hover:bg-signal">
        <span className="relative flex h-2 w-2" aria-hidden="true">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-75 group-hover:bg-paper" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-signal group-hover:bg-paper" />
        </span>
        <span className="brand-title whitespace-nowrap text-xs md:text-sm">{t(COPY.hero.scroll)}</span>
      </span>
      <span className="relative h-12 w-px overflow-hidden bg-paper/20 md:h-16" aria-hidden="true">
        <span className="absolute left-0 top-0 h-1/3 w-px bg-signal [animation:scroll-cue_1.8s_cubic-bezier(.65,0,.35,1)_infinite]" />
      </span>
      <span className="mono-label opacity-50" aria-hidden="true">{t(COPY.hero.scrollHint)}</span>
      <style>{`@keyframes scroll-cue { 0% { transform: translateY(-100%) } 100% { transform: translateY(300%) } }`}</style>
    </button>
  )
}

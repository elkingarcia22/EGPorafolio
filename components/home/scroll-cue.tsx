'use client'

import { getLenis } from '@/lib/motion'
import { useLocale } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'

const NUDGE_VIEWPORTS = 1.1
/** Fibra entre las dos neuronas: curva suave, como una dendrita */
const FIBER_PATH = 'M12 2 C 20 22, 4 40, 12 62'

/** Neurona-estrella: núcleo blanco, halo frío y destello en cruz (como la red Sinapsis). */
export function Neuron({ size, live = false }: { size: 'lg' | 'sm'; live?: boolean }) {
  const box = size === 'lg' ? 'h-10 w-10' : 'h-6 w-6'
  return (
    <span className={`relative grid place-items-center ${box}`} aria-hidden="true">
      <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgb(150_190_255/0.55)_0%,rgb(64_96_255/0.18)_45%,transparent_70%)] transition-[background] duration-500 group-hover:bg-[radial-gradient(circle,rgb(255_84_170/0.7)_0%,rgb(255_84_170/0.2)_45%,transparent_70%)]" />
      {live && <span className="absolute inset-[22%] rounded-full border border-[rgb(150_190_255/0.6)] [animation:cue-ring_2.4s_cubic-bezier(.2,.7,.3,1)_infinite]" />}
      <span className="absolute h-px w-[160%] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
      <span className="absolute h-[110%] w-px bg-gradient-to-b from-transparent via-white/40 to-transparent" />
      <span className={`relative rounded-full bg-white shadow-[0_0_10px_2px_rgb(150_190_255/0.9)] ${size === 'lg' ? 'h-2 w-2' : 'h-1.5 w-1.5'}`} />
    </span>
  )
}

/**
 * Indicador de scroll del hero, hecho sinapsis: una neurona que late, una
 * fibra por la que baja un impulso y una segunda neurona — de la idea al
 * producto. Es accionable (clic o Enter avanza hacia la señal).
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
      className="group absolute bottom-5 left-1/2 flex -translate-x-1/2 flex-col items-center text-paper md:bottom-7"
    >
      <span className="mb-1 flex flex-col items-center">
        <span className="brand-title whitespace-nowrap bg-gradient-to-r from-white via-[rgb(200,215,255)] to-white bg-clip-text text-xs text-transparent transition-[letter-spacing] duration-700 ease-expo group-hover:tracking-[0.42em] md:text-sm">
          {t(COPY.hero.scroll)}
        </span>
        <Neuron size="lg" live />
      </span>

      <svg viewBox="0 0 24 64" className="-my-2 h-10 w-6 overflow-visible md:h-14" aria-hidden="true">
        <defs>
          <linearGradient id="cue-fiber" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="rgb(150,190,255)" stopOpacity="0.55" />
            <stop offset="1" stopColor="rgb(150,190,255)" stopOpacity="0.12" />
          </linearGradient>
        </defs>
        <path d={FIBER_PATH} fill="none" stroke="url(#cue-fiber)" strokeWidth="1" />
        {/* Impulso: un tramo corto y brillante que recorre la fibra */}
        <path
          d={FIBER_PATH}
          fill="none"
          stroke="white"
          strokeWidth="1.6"
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray="14 86"
          className="drop-shadow-[0_0_4px_rgb(150,190,255)] [animation:cue-impulse_1.9s_cubic-bezier(.65,0,.35,1)_infinite] group-hover:[animation-duration:1.1s]"
        />
      </svg>

      <span className="flex flex-col items-center gap-1">
        <Neuron size="sm" />
        <span className="mono-label text-paper/55 transition-colors duration-500 group-hover:text-paper/90" aria-hidden="true">
          {t(COPY.hero.scrollHint)}
        </span>
      </span>

      <style>{`
        @keyframes cue-impulse { from { stroke-dashoffset: 14 } to { stroke-dashoffset: -100 } }
        @keyframes cue-ring { 0% { transform: scale(0.6); opacity: 0.9 } 100% { transform: scale(2.4); opacity: 0 } }
      `}</style>
    </button>
  )
}

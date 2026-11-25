'use client'

import { useEffect, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { SELLUP_CASE } from '@/lib/content/cases/sellup/sellup-case'

/** Lienzo del anillo (unidades del SVG) */
const S = 520
const C = S / 2
const R = 190
/** Cada cuánto se enciende el principio siguiente mientras pasan solos (ms) */
const STEP_MS = 3400
/** Si la persona elige uno, espera esto antes de seguir sola (ms) */
const RESUME_MS = 9000

/** Nombre corto de cada principio, para el nodo */
const SHORT: readonly L[] = [
  { es: 'La persona decide', en: 'The person decides' },
  { es: 'Primero lo gratis', en: 'Free first' },
  { es: 'HubSpot con permiso', en: 'HubSpot with permission' },
  { es: 'Todo deja rastro', en: 'Everything leaves a trace' },
]
/** Arriba, derecha, abajo, izquierda: de abajo sale la fibra a «Bocetos» */
const ANGLES = [-90, 0, 90, 180] as const
const pos = (deg: number) => ({ x: C + R * Math.cos((deg * Math.PI) / 180), y: C + R * Math.sin((deg * Math.PI) / 180) })

/**
 * 03 · La idea: la pregunta y, alrededor, los cuatro principios en un anillo
 * que una señal recorre sin parar. Cada principio se enciende cuando la señal
 * pasa; en el centro queda su frase. Tocar un nodo lo fija y da el detalle.
 */
export function SellUpIdea() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const { idea } = SELLUP_CASE
  const rootRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const [active, setActive] = useState(0)
  const [picked, setPicked] = useState(false)
  /** Cuartos de vuelta que lleva la señal: siempre avanza, nunca vuelve atrás */
  const [quarters, setQuarters] = useState(0)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: '0px 0px -30% 0px' })
    io.observe(root)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!inView || reducedMotion) return
    const id = window.setTimeout(() => {
      setPicked(false)
      setQuarters((q) => q + 1)
      setActive((a) => (a + 1) % idea.principles.length)
    }, picked ? RESUME_MS : STEP_MS)
    return () => window.clearTimeout(id)
  }, [inView, reducedMotion, active, picked, idea.principles.length])

  const current = idea.principles[active]

  return (
    <div ref={rootRef} className="flex flex-col items-center">
      <p data-reveal className="mono-label mb-4 text-signal">{t({ es: '¿Cómo podríamos…?', en: 'How might we…?' })}</p>
      <p data-reveal className="max-w-[34ch] text-balance text-center text-[clamp(1.4rem,1rem+1.6vw,2.4rem)] font-light leading-[1.15] tracking-tight">
        {t({ es: '…darle a cada vendedor la empresa, la persona y las palabras correctas, sin gastar de más ni escribir en HubSpot sin permiso?', en: '…give every rep the right company, person and words, without overspending or writing to HubSpot without permission?' })}
      </p>

      <div className="relative mt-10 w-full max-w-[520px]" style={{ aspectRatio: '1 / 1' }}>
        <svg viewBox={`0 0 ${S} ${S}`} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
          <defs>
            <linearGradient id="su-ring" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#285ee6" />
              <stop offset="0.5" stopColor="#7e2be0" />
              <stop offset="1" stopColor="#d22d6a" />
            </linearGradient>
          </defs>
          <circle cx={C} cy={C} r={R} fill="none" stroke="white" strokeOpacity={0.08} strokeWidth={1.5} />
          <circle cx={C} cy={C} r={R} fill="none" stroke="url(#su-ring)" strokeOpacity={0.55} strokeWidth={1.5} />
          {/* La señal recorre el anillo de un principio al siguiente y se posa en el encendido */}
          {!reducedMotion && (
            <circle cx={C} cy={C} r={R} fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" pathLength={1} strokeDasharray="0.06 0.94" strokeDashoffset={0.03 - quarters / 4} transform={`rotate(-90 ${C} ${C})`} style={{ transition: 'stroke-dashoffset 1.1s cubic-bezier(.65,0,.35,1)', filter: 'drop-shadow(0 0 6px white)' }} />
          )}
          {/* El halo del principio activo, con un tirante al centro */}
          {(() => {
            const p = pos(ANGLES[active])
            return <line key={active} x1={C} y1={C} x2={p.x} y2={p.y} stroke="rgb(var(--signal))" strokeOpacity={0.35} strokeDasharray="2 6" className="su-fade" />
          })()}
        </svg>

        {/* En el centro, la frase del principio encendido */}
        <div key={active} aria-live="polite" className="su-fade absolute inset-[24%] flex flex-col items-center justify-center text-center">
          <span className="mono-label text-signal">0{active + 1}</span>
          <p className="mt-3 text-balance text-[clamp(1rem,0.8rem+1vw,1.5rem)] font-light leading-[1.2]">{t(current.title)}</p>
          {picked && <p className="mt-3 text-balance text-[12px] leading-snug text-paper/60 max-sm:hidden">{t(current.body)}</p>}
        </div>

        {idea.principles.map((p, i) => {
          const at = pos(ANGLES[i])
          const on = i === active
          return (
            <button
              key={p.title.es}
              type="button"
              aria-pressed={on && picked}
              onClick={() => {
                setQuarters((q) => q + ((i - active + ANGLES.length) % ANGLES.length))
                setActive(i)
                setPicked(true)
              }}
              className="group absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center outline-none"
              style={{ left: `${(at.x / S) * 100}%`, top: `${(at.y / S) * 100}%` }}
            >
              <span className="relative grid h-4 w-4 place-items-center" aria-hidden="true">
                {on && <span className="absolute inset-[-8px] rounded-full border border-signal/60 animate-[nav-node-ping_2.2s_cubic-bezier(0,0,.2,1)_infinite]" />}
                <span className={`h-full w-full rounded-full border transition-all duration-500 ${on ? 'scale-125 border-white bg-[#fffaf0] shadow-[0_0_0_4px_rgb(var(--signal)/0.25),0_0_18px_4px_rgb(var(--signal)/0.7)]' : 'border-white/50 bg-void group-hover:border-white'}`} />
                {i === 2 && <span data-fiber-from="su-bocetos" className="absolute left-1/2 top-1/2 h-px w-px" />}
              </span>
              <span className={`absolute whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.14em] transition-opacity duration-500 ${on ? 'opacity-100' : 'opacity-45 group-hover:opacity-80'} ${i === 0 ? 'bottom-full mb-3' : i === 2 ? 'top-full mt-3' : `top-full mt-3 w-[6.5rem] whitespace-normal text-center sm:top-1/2 sm:mt-0 sm:w-auto sm:-translate-y-1/2 sm:whitespace-nowrap ${i === 1 ? 'right-0 sm:left-full sm:right-auto sm:ml-3 sm:text-left' : 'left-0 sm:left-auto sm:right-full sm:mr-3 sm:text-right'}`}`}>
                {t(SHORT[i])}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

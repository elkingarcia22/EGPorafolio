'use client'

import { useEffect, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { CLIPPER_CASE } from '@/lib/content/cases/barberlytics/clipper-case'
import { ClipperOrb } from '../clipper-orb'
import { AI, AiGradient, Caption, Lead, RED, useInView } from './clp-kit'

const EXCHANGES = CLIPPER_CASE.exchanges
const W = 900
const H = 120
const Y = 60
const XS = [90, 330, 570, 810] as const
const FIBER = `M${XS[0]} ${Y} C 210 ${Y - 30}, 250 ${Y + 30}, ${XS[1]} ${Y} S 450 ${Y - 30}, ${XS[2]} ${Y} S 690 ${Y + 30}, ${XS[3]} ${Y}`
/** Pasos de un intercambio: pregunta → quién → entiende → herramienta → revisa y responde (ms) */
const BEATS = [700, 700, 1100, 800, 3600] as const
const LAST = BEATS.length - 1

/**
 * 05 · Una pregunta, por dentro: una sola fibra con cuatro paradas. La pregunta
 * entra, el orbe entiende quién pregunta, elige una herramienta de su rol, revisa
 * las cifras y responde. Recorre los cuatro intercambios reales de las pruebas;
 * los números de abajo eligen uno.
 */
export function ClipperExchange() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const rootRef = useRef<HTMLDivElement>(null)
  const inView = useInView(rootRef)
  const [ex, setEx] = useState(0)
  const [step, setStep] = useState(reducedMotion ? LAST : 0)

  useEffect(() => {
    if (!inView || reducedMotion) return
    const id = window.setTimeout(() => {
      if (step < LAST) setStep(step + 1)
      else {
        setEx((e) => (e + 1) % EXCHANGES.length)
        setStep(0)
      }
    }, BEATS[step])
    return () => window.clearTimeout(id)
  }, [inView, reducedMotion, step])

  const x = EXCHANGES[ex]
  const denied = x.tool === 'nomina'
  const stations = [
    { label: t({ es: 'Quién pregunta', en: 'Who asks' }), value: t(x.role), color: AI[0] },
    { label: t({ es: 'Entiende', en: 'Understands' }), value: 'Clipper', color: AI[1] },
    { label: t({ es: 'Herramienta', en: 'Tool' }), value: t(x.toolLabel), color: denied ? RED : AI[2] },
    { label: t({ es: 'Revisa', en: 'Checks' }), value: t(x.check), color: AI[3] },
  ]

  return (
    <div ref={rootRef}>
      <Caption id={`q${ex}`} tag={t({ es: 'Una pregunta, por dentro', en: 'One question, inside' })} title={`«${t(x.q)}»`} />
      <Lead>{t({ es: 'Ejemplos de las pruebas del agente: lo que ve la persona y, en la fibra, lo que pasa por dentro.', en: 'Examples from the agent’s tests: what the person sees and, along the fiber, what happens inside.' })}</Lead>

      <div className="relative mx-auto mt-10 w-full max-w-[900px]">
        <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full overflow-visible" aria-hidden="true">
          <defs>
            <AiGradient id="clp-ex-fiber" />
          </defs>
          <path d={FIBER} fill="none" stroke="white" strokeOpacity={0.08} />
          <path
            key={ex}
            d={FIBER}
            pathLength={1}
            fill="none"
            stroke="url(#clp-ex-fiber)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeDasharray="1"
            strokeDashoffset={1 - Math.max(0, step - 1) / (XS.length - 1)}
            style={{ transition: 'stroke-dashoffset .6s cubic-bezier(.45,0,.25,1)', filter: `drop-shadow(0 0 4px ${AI[1]})` }}
          />
          {step === LAST && !reducedMotion && (
            <path d={FIBER} pathLength={1} fill="none" stroke="white" strokeWidth={2.4} strokeLinecap="round" strokeDasharray="0.05 0.95" className="clp-flow" style={{ filter: 'drop-shadow(0 0 5px white)' }} />
          )}
          {XS.map((sx, i) => {
            if (i === 1) return null
            const on = step >= i + 1
            const s = stations[i]
            return (
              <g key={i} transform={`translate(${sx} ${Y})`} data-fiber-from={i === XS.length - 1 ? 'clp-ia' : undefined}>
                <circle r={26} fill={s.color} opacity={on ? 0.16 : 0} style={{ transition: 'opacity .5s' }} />
                {on && step === i + 1 && !reducedMotion && <circle r={12} fill="none" stroke={s.color} strokeWidth={1.5} className="clp-ping" />}
                <circle r={10} fill={on ? s.color : 'rgb(var(--void))'} stroke="white" strokeOpacity={on ? 0.9 : 0.3} strokeWidth={1.4} style={{ transition: 'fill .5s' }} />
              </g>
            )
          })}
        </svg>
        {/* La segunda parada es el propio orbe */}
        <span className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${(XS[1] / W) * 100}%`, top: `${(Y / H) * 100}%` }}>
          <span className="block scale-[0.5] sm:scale-100">
            <ClipperOrb size={64} state={step === 2 ? 'thinking' : step === 1 ? 'listening' : 'idle'} />
          </span>
        </span>
        {/* Lo que dice cada parada */}
        <div className="mt-2 grid grid-cols-4 gap-2">
          {stations.map((s, i) => {
            const on = step >= i + 1
            return (
              <div key={i} className="text-center">
                <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-paper/45 sm:text-[10px]">{s.label}</p>
                <p key={`${ex}-${on}`} className={`clp-fade mx-auto mt-1 max-w-[18ch] text-[11px] leading-snug sm:text-[13px] ${on ? '' : 'opacity-0'}`} style={{ color: on && i === 2 && denied ? '#ff9aa0' : undefined }}>
                  {s.value}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* La respuesta, con el borde del gradiente de IA (en rojo si el rol no ve ese dato) */}
      <div className="mx-auto mt-8 min-h-[5.5rem] max-w-[560px]">
        {step === LAST && (
          <div key={ex} className="clp-fade flex items-start gap-3">
            <span className="mt-1 shrink-0">
              <ClipperOrb size={28} />
            </span>
            <div className="rounded-2xl rounded-tl-sm p-[1.5px]" style={{ backgroundImage: denied ? 'none' : `linear-gradient(120deg,${AI.join(',')})`, background: denied ? 'rgb(255 107 114 / 0.45)' : undefined }}>
              <p className="rounded-2xl rounded-tl-sm bg-[rgb(var(--void))] px-4 py-3 text-[14px] leading-relaxed text-paper/90">{t(x.a)}</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-center gap-2" role="tablist" aria-label={t({ es: 'Ejemplos', en: 'Examples' })}>
        {EXCHANGES.map((e, i) => (
          <button
            key={e.tool}
            type="button"
            role="tab"
            aria-selected={ex === i}
            aria-label={t(e.q)}
            onClick={() => {
              setEx(i)
              setStep(reducedMotion ? LAST : 0)
            }}
            className={`grid h-8 w-8 place-items-center rounded-full border font-mono text-[11px] transition-colors duration-300 ${ex === i ? 'border-[#f0ce86] text-[#f0ce86]' : 'border-white/15 text-paper/45 hover:border-white/40 hover:text-paper'}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  )
}

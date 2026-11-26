'use client'

import { useEffect, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { CLIPPER_CASE } from '@/lib/content/cases/barberlytics/clipper-case'
import { AI, AiGradient, Caption, Lead, useInView } from './clp-kit'
import { usePhone } from './clp-phone-kit'

const METRICS = CLIPPER_CASE.impact.metrics
const W = 900
const H = 260
const MID = 170
const AMP = 52
const X0 = 30
const X1 = 870
/** Las cifras van en las crestas de una onda de voz (la del modo voz de Clipper) */
const PEAKS = METRICS.map((_, i) => X0 + ((X1 - X0) * (i + 0.5)) / METRICS.length)
const PERIOD = (X1 - X0) / METRICS.length
const wave = (() => {
  const pts: string[] = []
  for (let x = X0; x <= X1; x += 6) {
    const y = MID - AMP * Math.cos(((x - PEAKS[0]) / PERIOD) * 2 * Math.PI) * Math.min(1, (x - X0) / 60, (X1 - x) / 60)
    pts.push(`${x.toFixed(1)} ${y.toFixed(1)}`)
  }
  return `M${pts.join(' L')}`
})()
/** Cuánto tarda en dibujarse la onda y en contar cada cifra (ms) */
const DRAW_MS = 1100
const COUNT_MS = 900
const STAGGER_MS = 180

/** Cuenta desde 0 hasta la cifra conservando su forma («−35%», «12 s», «0») */
function useCount(value: string, start: boolean, delay: number, reducedMotion: boolean) {
  const match = /(\d+)/.exec(value)
  const target = match ? Number(match[1]) : 0
  const [n, setN] = useState(reducedMotion ? target : 0)
  useEffect(() => {
    if (!start || reducedMotion) {
      if (reducedMotion) setN(target)
      return
    }
    let frame = 0
    const t0 = performance.now() + delay
    const tick = (now: number) => {
      const p = Math.min(1, Math.max(0, (now - t0) / COUNT_MS))
      setN(Math.round(target * (1 - Math.pow(1 - p, 3))))
      if (p < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [start, delay, target, reducedMotion])
  return match ? value.replace(match[1], String(n)) : value
}

function Metric({ i, start, hot, onPick }: { i: number; start: boolean; hot: boolean; onPick: () => void }) {
  const { reducedMotion } = useA11y()
  const { t } = useLocale()
  const m = METRICS[i]
  const shown = useCount(m.value, start, DRAW_MS * ((i + 0.5) / METRICS.length) + i * STAGGER_MS, reducedMotion)
  return (
    <button
      type="button"
      onClick={onPick}
      aria-pressed={hot}
      aria-label={`${m.value} ${t(m.label)}`}
      className={`absolute -translate-x-1/2 -translate-y-full pb-4 text-center transition-opacity duration-500 ${start ? 'opacity-100' : 'opacity-0'}`}
      style={{ left: `${(PEAKS[i] / W) * 100}%`, top: `${((MID - AMP) / H) * 100}%` }}
    >
      <span className={`block whitespace-nowrap text-[clamp(1.5rem,0.9rem+2.6vw,3.4rem)] font-light leading-none tabular-nums transition-colors ${hot ? 'text-white' : ''}`} style={hot ? undefined : { color: AI[i] }}>
        {shown}
      </span>
    </button>
  )
}

/**
 * 07 · Impacto: una onda de voz con el gradiente de IA se dibuja al entrar y
 * en cada cresta sube una cifra contando. Tocar una cifra dice qué mide.
 */
export function ClipperImpact() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const rootRef = useRef<HTMLDivElement>(null)
  const inView = useInView(rootRef)
  const [seen, setSeen] = useState(reducedMotion)
  const [picked, setPicked] = useState<number | null>(null)
  const phone = usePhone()
  useEffect(() => {
    if (inView) setSeen(true)
  }, [inView])

  const caption =
    picked !== null
      ? { id: `m${picked}`, tag: METRICS[picked].value, title: t(METRICS[picked].label) }
      : { id: 'all', tag: t({ es: 'En las barberías piloto', en: 'In the pilot shops' }), title: t({ es: 'Donde más se nota: en las preguntas de todos los días.', en: 'Where it shows most: in everyday questions.' }) }

  return (
    <div ref={rootRef}>
      <Caption {...caption} />
      <Lead>{t({ es: 'Ya no hay que abrir tres pantallas para saber cuánto se lleva cobrado o cuándo vuelve un cliente.', en: 'No more opening three screens to know what’s been collected or when a client is due back.' })}</Lead>

      {phone ? (
        <ImpactColumn seen={seen} reducedMotion={reducedMotion} />
      ) : (
      <div className="relative mx-auto mt-10 w-full max-w-[900px]">
        <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full overflow-visible" aria-hidden="true">
          <defs>
            <AiGradient id="clp-impact-wave" />
          </defs>
          <path d={wave} fill="none" stroke="white" strokeOpacity={0.06} strokeWidth={1} />
          <path d={wave} pathLength={1} fill="none" stroke="url(#clp-impact-wave)" strokeWidth={2.2} strokeLinecap="round" strokeDasharray="1" strokeDashoffset={seen ? 0 : 1} style={{ transition: `stroke-dashoffset ${DRAW_MS}ms cubic-bezier(.45,0,.25,1)`, filter: `drop-shadow(0 0 6px ${AI[1]})` }} />
          {seen && !reducedMotion && (
            <path d={wave} pathLength={1} fill="none" stroke="white" strokeWidth={2.4} strokeLinecap="round" strokeDasharray="0.04 0.96" className="clp-flow" style={{ animationDelay: `${DRAW_MS}ms`, filter: 'drop-shadow(0 0 5px white)' }} />
          )}
          {PEAKS.map((x, i) => (
            <g
              key={i}
              transform={`translate(${x} ${MID - AMP})`}
              onClick={() => setPicked(picked === i ? null : i)}
              className="cursor-pointer"
            >
              <circle r={22} fill={AI[i]} opacity={seen ? (picked === i ? 0.3 : 0.12) : 0} style={{ transition: `opacity .5s ${i * STAGGER_MS + 400}ms` }} />
              {picked === i && !reducedMotion && <circle r={10} fill="none" stroke="white" strokeWidth={1.4} className="clp-ping" />}
              <circle r={7} fill={picked === i ? 'white' : AI[i]} stroke="white" strokeWidth={1.3} style={{ opacity: seen ? 1 : 0, transition: `opacity .5s ${i * STAGGER_MS + 400}ms` }} />
              {/* Bajo cada cresta, una línea fina hasta la base: la cifra «pesa» sobre la onda */}
              <line y1={14} y2={AMP * 2 + 20} stroke={AI[i]} strokeOpacity={seen ? 0.25 : 0} strokeDasharray="2 4" style={{ transition: 'stroke-opacity .6s .8s' }} />
            </g>
          ))}
        </svg>
        {/* La fibra hacia «Demo» sigue la onda: sale de su punta derecha */}
        <span data-fiber-from="clp-demo" className="pointer-events-none absolute h-px w-px" style={{ left: `${(X1 / W) * 100}%`, top: `${(MID / H) * 100}%` }} />
        {METRICS.map((m, i) => (
          <Metric key={m.value} i={i} start={seen} hot={picked === i} onPick={() => setPicked(picked === i ? null : i)} />
        ))}
        {/* Bajo cada cresta, qué mide en una palabra (lo completo, al tocarla) */}
        <div className="absolute inset-x-0 bottom-0 hidden sm:block">
          {METRICS.map((m, i) => (
            <p key={m.value} className={`absolute max-w-[13rem] -translate-x-1/2 text-balance text-center text-[14px] leading-snug text-paper/70 transition-opacity duration-700 ${seen ? 'opacity-100' : 'opacity-0'}`} style={{ left: `${(PEAKS[i] / W) * 100}%`, transitionDelay: `${1000 + i * STAGGER_MS}ms` }}>
              {t(m.label)}
            </p>
          ))}
        </div>
      </div>
      )}
    </div>
  )
}

/** Teléfono: alto de cada cifra y medidas de la onda, que ahora baja */
const ROW = 116
const PW = 64
const PAMP = 20
const PCX = 30
const PH = ROW * METRICS.length
const phoneWave = (() => {
  const pts: string[] = []
  for (let y = 0; y <= PH; y += 4) {
    const fade = Math.min(1, y / 40, (PH - y) / 40)
    const x = PCX + PAMP * Math.cos(((y - ROW / 2) / ROW) * 2 * Math.PI) * fade
    pts.push(`${x.toFixed(1)} ${y}`)
  }
  return `M${pts.join(' L')}`
})()

function PhoneMetric({ i, start }: { i: number; start: boolean }) {
  const { reducedMotion } = useA11y()
  const { t } = useLocale()
  const m = METRICS[i]
  const shown = useCount(m.value, start, DRAW_MS * ((i + 0.5) / METRICS.length) + i * STAGGER_MS, reducedMotion)
  return (
    <li className={`flex flex-col justify-center transition-all duration-700 ease-expo ${start ? 'translate-x-0 opacity-100' : 'translate-x-3 opacity-0'}`} style={{ height: ROW, transitionDelay: `${300 + i * STAGGER_MS}ms` }}>
      <span className="text-[2.6rem] font-light leading-none tabular-nums" style={{ color: AI[i] }}>{shown}</span>
      <span className="mt-2 max-w-[24ch] text-[15px] leading-snug text-paper/65">{t(m.label)}</span>
    </li>
  )
}

/**
 * Impacto en el teléfono: la onda de voz baja en vertical y cada cresta
 * sostiene una cifra, con lo que mide al lado, completo y legible.
 */
function ImpactColumn({ seen, reducedMotion }: { seen: boolean; reducedMotion: boolean }) {
  return (
    <div className="relative mx-auto mt-10 flex w-full max-w-[420px] gap-4">
      <div className="relative shrink-0" style={{ width: PW, height: PH }}>
        <svg viewBox={`0 0 ${PW} ${PH}`} width={PW} height={PH} className="block overflow-visible" aria-hidden="true">
          <defs>
            <AiGradient id="clp-impact-wave-v" vertical />
          </defs>
          <path d={phoneWave} fill="none" stroke="white" strokeOpacity={0.06} />
          <path d={phoneWave} pathLength={1} fill="none" stroke="url(#clp-impact-wave-v)" strokeWidth={2.2} strokeLinecap="round" strokeDasharray="1" strokeDashoffset={seen ? 0 : 1} style={{ transition: `stroke-dashoffset ${DRAW_MS}ms cubic-bezier(.45,0,.25,1)`, filter: `drop-shadow(0 0 6px ${AI[1]})` }} />
          {seen && !reducedMotion && (
            <path d={phoneWave} pathLength={1} fill="none" stroke="white" strokeWidth={2.4} strokeLinecap="round" strokeDasharray="0.04 0.96" className="clp-flow" style={{ animationDelay: `${DRAW_MS}ms`, filter: 'drop-shadow(0 0 5px white)' }} />
          )}
          {METRICS.map((m, i) => (
            <g key={m.value} transform={`translate(${PCX + PAMP} ${ROW * i + ROW / 2})`}>
              <circle r={18} fill={AI[i]} opacity={seen ? 0.14 : 0} style={{ transition: `opacity .5s ${i * STAGGER_MS + 400}ms` }} />
              <circle r={6} fill={AI[i]} stroke="white" strokeWidth={1.3} style={{ opacity: seen ? 1 : 0, transition: `opacity .5s ${i * STAGGER_MS + 400}ms` }} />
            </g>
          ))}
        </svg>
        {/* La fibra hacia «Demo» sale de la punta de abajo de la onda */}
        <span data-fiber-from="clp-demo" className="pointer-events-none absolute h-px w-px" style={{ left: PCX, top: PH }} />
      </div>
      <ol className="min-w-0 flex-1">
        {METRICS.map((m, i) => (
          <PhoneMetric key={m.value} i={i} start={seen} />
        ))}
      </ol>
    </div>
  )
}

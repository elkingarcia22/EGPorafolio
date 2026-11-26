'use client'

import { useEffect, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { OBJ_CASE } from '@/lib/content/cases/objetivos/objetivos-case'
import { MOMENTS, ROLE_NAME } from './lifecycle-moments'
import { useNarrow } from '@/components/case/kit/use-narrow'

/** Lienzo de la escena (unidades del SVG) */
const W = 900
const H = 400
/** Los siete momentos como una montaña: de izquierda a derecha, subiendo hasta la cumbre y bajando */
const PEAKS = [300, 228, 172, 78, 160, 222, 280]
const X0 = 70
const X1 = W - 70
/** Cuánto caen bajo la línea los momentos que no existían (antes del rediseño) */
const LOOSE = { drop: 74, scale: 0.6 }
/** Se completa sola y rápido al verse: una pausa corta en el «antes» y luego cada tramo seguido del anterior (ms) */
const AUTO = { intro: 700, step: 280 }
/** Pasos: 0 = el ciclo de antes; 1–7 = se recorre cada momento y se conecta; 8 = el ciclo completo */
const LAST = MOMENTS.length + 1

const round = (n: number) => Math.round(n * 100) / 100
type Pt = { x: number; y: number }
const POINTS: readonly Pt[] = PEAKS.map((y, i) => ({ x: round(X0 + ((X1 - X0) * i) / (PEAKS.length - 1)), y }))
const at = (i: number, drop = 0): Pt => ({ x: POINTS[i].x, y: POINTS[i].y + drop })
/** Tramo suave (Catmull-Rom) entre dos momentos seguidos de la montaña */
const segment = (i: number) => {
  const p0 = POINTS[Math.max(0, i - 1)]
  const p1 = POINTS[i]
  const p2 = POINTS[i + 1]
  const p3 = POINTS[Math.min(POINTS.length - 1, i + 2)]
  const c1 = { x: round(p1.x + (p2.x - p0.x) / 6), y: round(p1.y + (p2.y - p0.y) / 6) }
  const c2 = { x: round(p2.x - (p3.x - p1.x) / 6), y: round(p2.y - (p3.y - p1.y) / 6) }
  return `C${c1.x} ${c1.y} ${c2.x} ${c2.y} ${p2.x} ${p2.y}`
}
const segmentPath = (i: number) => `M${POINTS[i].x} ${POINTS[i].y} ${segment(i)}`
/** La línea completa, para la señal que la recorre */
const FULL_PATH = `M${POINTS[0].x} ${POINTS[0].y} ${POINTS.slice(0, -1).map((_, i) => segment(i)).join(' ')}`
/** La cumbre: bajo ella va la cuenta */
const SUMMIT = POINTS[PEAKS.indexOf(Math.min(...PEAKS))]

/**
 * 01 · Los puntos, como una línea en forma de montaña que avanza sola al
 * entrar: el ciclo de antes (dos momentos conectados y cinco sueltos, caídos
 * bajo la línea) y luego un paso por cada momento, en orden. El que falta sube
 * a la línea, su tramo se conecta y la cuenta sube, hasta completar los siete y
 * que una señal la recorra. Del último sale la fibra hacia «Patrones».
 */
export function DotsScene() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const rootRef = useRef<HTMLDivElement>(null)
  // En el teléfono la montaña se vuelve un sendero de pie (ver DotsTrail).
  const narrow = useNarrow()
  const [step, setStep] = useState(reducedMotion ? LAST : 0)
  const [picked, setPicked] = useState<number | null>(null)
  /** La escena está a la vista (solo entonces avanza sola) */
  const [inView, setInView] = useState(false)
  const connected = step === LAST
  /** El momento que se está recorriendo ahora (o ninguno) */
  const current = step >= 1 && step <= MOMENTS.length ? step - 1 : null
  const covered = (i: number) => connected || MOMENTS[i].before || (current !== null && i <= current)
  const count = MOMENTS.filter((_, i) => covered(i)).length

  // Arranca cuando la escena entra en pantalla
  useEffect(() => {
    const root = rootRef.current
    if (!root || reducedMotion) {
      setStep(LAST)
      return
    }
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: '0px 0px -30% 0px' })
    observer.observe(root)
    return () => observer.disconnect()
  }, [reducedMotion])

  // Avanza sola, paso a paso y sin demorarse, mientras se ve (se detiene al pasar el cursor por un momento).
  useEffect(() => {
    if (!inView || reducedMotion || step >= LAST) return
    const id = window.setTimeout(() => setStep((s) => Math.min(LAST, s + 1)), step === 0 ? AUTO.intro : AUTO.step)
    return () => window.clearTimeout(id)
  }, [inView, reducedMotion, step])

  // Arriba queda una sola frase mientras la línea se completa; el texto de cada momento sale solo al tocarlo.
  const caption = (() => {
    if (picked !== null) {
      const m = MOMENTS[picked]
      const tag = `0${picked + 1} · ${t(m.name)}${m.before ? '' : ` · ${t({ es: 'nuevo', en: 'new' })}`}`
      return { tag, title: t(m.where), roles: m.roles }
    }
    return { tag: t({ es: 'Rediseño', en: 'Redesign' }), title: t({ es: 'Los siete momentos, conectados.', en: 'All seven moments, connected.' }) }
  })()

  return (
    <div ref={rootRef} className="relative mt-6">
      <div>
      <div className="flex flex-col items-center text-center">
        {/* Lo que dice la etapa (o el momento elegido): poco texto, sobre la escena */}
        <div key={picked ?? 'all'} className="obj-fade flex min-h-[5.5rem] max-w-[62ch] flex-col items-center justify-end">
          <p className="mono-label text-signal">{caption.tag}</p>
          <p className="mt-3 text-balance text-[clamp(1.2rem,0.95rem+1vw,1.75rem)] font-light leading-[1.2] tracking-tight">{caption.title}</p>
          {caption.roles && (
            <p className="mt-3 flex justify-center gap-2">
              {caption.roles.map((r) => (
                <span key={r} className="rounded-full border border-white/15 px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-[0.12em] text-paper/70">{t(ROLE_NAME[r])}</span>
              ))}
            </p>
          )}
        </div>

        {narrow ? (
          <DotsTrail covered={covered} current={current} picked={picked} onPick={(i) => setPicked(picked === i ? null : i)} count={count} connected={connected} />
        ) : (
        <div className="relative mx-auto mt-6 w-full max-w-[900px]">
          <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto max-h-[44vh] w-full overflow-visible" role="group" aria-label={t({ es: 'Los siete momentos del ciclo', en: 'The seven cycle moments' })}>
            <defs>
              <linearGradient id="dots-fiber" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="rgb(var(--signal))" />
                <stop offset="1" stopColor="#ff54aa" />
              </linearGradient>
            </defs>
            <g>
              {/* La montaña: tenue de fondo, y el tramo que conecta cada momento con el siguiente */}
              <path d={FULL_PATH} fill="none" stroke="white" strokeOpacity={0.07} />
              {POINTS.slice(0, -1).map((_, i) => {
                const lit = covered(i) && covered(i + 1)
                return (
                  <path
                    key={MOMENTS[i].id}
                    d={segmentPath(i)}
                    pathLength={1}
                    fill="none"
                    stroke="url(#dots-fiber)"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeDasharray="1"
                    strokeDashoffset={lit ? 0 : 1}
                    style={{ transition: `stroke-dashoffset ${AUTO.step}ms linear`, filter: 'drop-shadow(0 0 4px rgb(var(--signal) / 0.6))' }}
                  />
                )
              })}
              {/* La señal que recorre la línea, de izquierda a derecha, cuando ya está completa */}
              <path
                d={FULL_PATH}
                fill="none"
                stroke="white"
                strokeWidth={3}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray="0.04 0.96"
                className="dots-signal"
                style={{ opacity: connected ? 1 : 0, transition: 'opacity 0.6s 0.3s', filter: 'drop-shadow(0 0 6px white)' }}
              />
              {/* De aquí (el último momento, ya en la línea) sale la fibra que baja a «Patrones» */}
              <circle cx={POINTS[POINTS.length - 1].x} cy={POINTS[POINTS.length - 1].y} r={1} fill="none" data-fiber-from="obj-patrones" />
              {/* Los momentos: los que no existían quedan sueltos, fuera del anillo, hasta el rediseño */}
              {MOMENTS.map((m, i) => {
                const on = covered(i)
                const pos = on ? at(i) : at(i, LOOSE.drop)
                const hot = picked === i
                const isPicked = picked === i
                return (
                  <g
                    key={m.id}
                    role="button"
                    tabIndex={0}
                    aria-label={t(m.name)}
                    onClick={() => setPicked(isPicked ? null : i)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setPicked(isPicked ? null : i)
                      }
                    }}
                    className="cursor-pointer outline-none"
                  >
                    <g style={{ transform: `translate(${pos.x}px, ${pos.y}px) scale(${on ? 1 : LOOSE.scale})`, transition: 'transform .5s cubic-bezier(.16,1,.3,1)' }}>
                      <circle r={22} fill={hot ? '#ff54aa' : 'rgb(var(--signal))'} opacity={on || hot ? (isPicked ? 0.35 : 0.16) : 0} style={{ transition: 'opacity .5s, fill .5s' }} />
                      {hot && <circle r={14} fill="none" stroke="#ff54aa" strokeWidth={1.5} className="dots-hot" />}
                      <circle r={on ? 7 : 6} fill={on ? (isPicked ? 'white' : 'rgb(var(--signal))') : 'rgb(var(--void))'} stroke={on ? 'white' : 'rgb(255 255 255 / 0.55)'} strokeWidth={1.4} style={{ transition: 'fill .5s, stroke .5s' }} />
                    </g>
                    <g style={{ transform: `translate(${pos.x}px, ${pos.y - 30}px)`, transition: 'transform .5s cubic-bezier(.16,1,.3,1)' }}>
                      <text
                        textAnchor="middle"
                        dy="0.35em"
                        className="pointer-events-none fill-current font-mono uppercase"
                        fontSize={12}
                        letterSpacing="0.14em"
                        style={{ opacity: hot ? 1 : on ? 0.85 : 0.42, transition: 'opacity .6s' }}
                      >
                        {t(m.name)}
                      </text>
                    </g>
                  </g>
                )
              })}
              {/* Bajo la cumbre: cuántos momentos cubre; sube con cada paso */}
              <g>
              <text x={SUMMIT.x} y={SUMMIT.y + 150} textAnchor="middle" className="fill-current" fontSize={72} fontWeight={300}>
                <tspan key={count} className="ms-value">{count}</tspan>
                <tspan fontSize={26} className="opacity-40">/7</tspan>
              </text>
              <text x={SUMMIT.x} y={SUMMIT.y + 186} textAnchor="middle" className="fill-current font-mono uppercase opacity-50" fontSize={11} letterSpacing="0.14em">
                {step === 0 ? t({ es: 'cubiertos antes', en: 'covered before' }) : t({ es: 'en el rediseño', en: 'in the redesign' })}
              </text>
              </g>
            </g>
          </svg>
        </div>
        )}

        {/* Al conectarse, las cifras del punto de partida */}
        <dl className={`mx-auto mt-6 grid w-full max-w-[760px] grid-cols-2 gap-x-3 gap-y-6 md:grid-cols-4 md:gap-3 transition-all duration-700 ease-expo ${connected ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}>
          {OBJ_CASE.dots.facts.map((f) => (
            <div key={f.label.es} className="text-center">
              <dt className="sr-only">{t(f.label)}</dt>
              <dd>
                <span className="block text-[clamp(1.6rem,1.2rem+1.4vw,2.6rem)] font-light leading-none text-signal tabular-nums">{f.value}</span>
                <span className="mt-2 block text-balance text-[14px] leading-snug text-paper/70 md:text-[15px]">{t(f.label as L)}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
      </div>
    </div>
  )
}

interface DotsTrailProps {
  covered: (i: number) => boolean
  current: number | null
  picked: number | null
  onPick: (i: number) => void
  count: number
  connected: boolean
}

/**
 * Los puntos en el teléfono: la montaña se vuelve un sendero de pie. Los siete
 * momentos bajan en orden por una fibra; los que no existían quedan corridos a
 * un lado, apagados, y entran a la línea cuando el recorrido llega a ellos. La
 * cuenta sube arriba. Tocar un momento muestra, arriba, qué pasa en él.
 */
function DotsTrail({ covered, current, picked, onPick, count, connected }: DotsTrailProps) {
  const { t } = useLocale()
  const reached = connected ? MOMENTS.length : current === null ? 0 : current + 1
  return (
    <div className="mx-auto mt-6 w-full max-w-[340px]">
      <p className="mb-4 flex items-baseline justify-end gap-2" aria-live="polite">
        <span key={count} className="ms-value text-5xl font-light tabular-nums">{count}</span>
        <span className="text-lg text-paper/40">/7</span>
        <span className="ml-1 font-mono text-[11px] uppercase tracking-[0.12em] text-paper/60">{current === null && !connected ? t({ es: 'cubiertos antes', en: 'covered before' }) : t({ es: 'en el rediseño', en: 'in the redesign' })}</span>
      </p>
      <ol className="relative">
        {/* La fibra: tenue entera y, encima, lo ya recorrido */}
        <span aria-hidden="true" className="absolute bottom-6 left-[11px] top-6 w-px bg-white/12" />
        <span
          aria-hidden="true"
          className="absolute left-[11px] top-6 w-px origin-top bg-gradient-to-b from-[rgb(var(--signal))] to-[#ff54aa] shadow-[0_0_8px_rgb(var(--signal)/0.7)] transition-transform duration-300 ease-linear"
          style={{ bottom: 24, transform: `scaleY(${Math.max(0, reached - 1) / (MOMENTS.length - 1)})` }}
        />
        {MOMENTS.map((m, i) => {
          const on = covered(i)
          const isPicked = picked === i
          return (
            <li key={m.id}>
              <button type="button" onClick={() => onPick(i)} aria-pressed={isPicked} className="group relative flex w-full items-center gap-4 py-3 text-left outline-none">
                <span className="relative grid h-[23px] w-[23px] shrink-0 place-items-center">
                  <span aria-hidden="true" className={`absolute inset-[-8px] rounded-full transition-opacity duration-500 ${isPicked ? 'bg-[#ff54aa]/30 opacity-100' : 'bg-[rgb(var(--signal)/0.16)]'} ${on || isPicked ? 'opacity-100' : 'opacity-0'}`} />
                  <span
                    aria-hidden="true"
                    className={`relative h-3 w-3 rounded-full border transition-all duration-500 ease-expo ${on ? (isPicked ? 'border-white bg-white' : 'border-white bg-[rgb(var(--signal))]') : 'translate-x-3 border-white/50 bg-[rgb(var(--void))]'}`}
                  />
                  {i === MOMENTS.length - 1 && <span data-fiber-from="obj-patrones" aria-hidden="true" className="absolute left-1/2 top-1/2 h-px w-px" />}
                </span>
                <span className={`flex-1 text-base transition-all duration-500 ease-expo ${on ? 'opacity-100' : 'translate-x-3 opacity-45'}`}>{t(m.name)}</span>
                <span className={`font-mono text-[11px] uppercase tracking-[0.12em] ${m.before ? 'text-paper/60' : 'text-signal'}`}>
                  {m.before ? t({ es: 'ya existía', en: 'existed' }) : t({ es: 'nuevo', en: 'new' })}
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

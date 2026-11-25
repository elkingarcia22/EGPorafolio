'use client'

import { useEffect, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { OBJ_CASE } from '@/lib/content/cases/objetivos/objetivos-case'
import { MOMENTS, ROLE_NAME } from './lifecycle-moments'

/** Lienzo de la escena (unidades del SVG) */
const W = 800
const H = 560
const C = { x: W / 2, y: H / 2 }
const R = 190
/** Cuánto se salen del anillo los momentos que no existían (antes del rediseño) */
const LOOSE = { push: 70, scale: 0.6 }
/** Avanza sola mientras está a la vista: cuánto se queda en el «antes» y en cada paso (ms) */
const AUTO = { intro: 1800, step: 1300 }
/** Pasos: 0 = el ciclo de antes; 1–7 = se recorre cada momento y se conecta; 8 = el ciclo completo */
const LAST = MOMENTS.length + 1

const angleOf = (i: number) => ((i * 360) / MOMENTS.length - 90) * (Math.PI / 180)
const round = (n: number) => Math.round(n * 100) / 100
const onRing = (i: number, r = R) => ({ x: round(C.x + Math.cos(angleOf(i)) * r), y: round(C.y + Math.sin(angleOf(i)) * r) })
/** Arco del anillo entre dos momentos seguidos */
const arcPath = (i: number) => {
  const a = onRing(i)
  const b = onRing((i + 1) % MOMENTS.length)
  return `M${a.x} ${a.y} A${R} ${R} 0 0 1 ${b.x} ${b.y}`
}

/**
 * 01 · Los puntos, como una escena que avanza sola al entrar, sin cámara: el
 * ciclo de antes (dos momentos conectados y cinco sueltos, fuera del anillo) y
 * luego un paso por cada momento, en orden. El que falta entra al anillo, su
 * fibra se conecta y la cuenta sube, hasta completar los siete y que una señal
 * recorra el ciclo. Tocar un momento muestra qué es y quién lo vive.
 */
export function DotsScene() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const rootRef = useRef<HTMLDivElement>(null)
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
    if (!inView || reducedMotion || step >= LAST || picked !== null) return
    const id = window.setTimeout(() => setStep((s) => Math.min(LAST, s + 1)), step === 0 ? AUTO.intro : AUTO.step)
    return () => window.clearTimeout(id)
  }, [inView, reducedMotion, step, picked])

  /** Elegir un paso (o volver a empezar) */
  const goTo = (next: number) => {
    setPicked(null)
    setStep(next)
  }

  const caption = (() => {
    const focus = picked ?? current
    if (focus !== null) {
      const m = MOMENTS[focus]
      const tag = `0${focus + 1} · ${t(m.name)}${m.before ? '' : ` · ${t({ es: 'nuevo', en: 'new' })}`}`
      return { tag, title: covered(focus) ? t(m.where) : t({ es: 'No existía.', en: 'Didn’t exist.' }), roles: m.roles }
    }
    if (step === 0) return { tag: t({ es: 'Antes', en: 'Before' }), title: t(OBJ_CASE.dots.kicker) }
    return { tag: t({ es: 'Rediseño', en: 'Redesign' }), title: t({ es: 'Los siete momentos, conectados.', en: 'All seven moments, connected.' }) }
  })()

  return (
    <div ref={rootRef} className="relative mt-6">
      <div>
      <div className="flex flex-col items-center text-center">
        {/* Lo que dice la etapa (o el momento elegido): poco texto, sobre la escena */}
        <div key={`${step}-${picked}`} className="obj-fade flex min-h-[5.5rem] max-w-[62ch] flex-col items-center justify-end">
          <p className="mono-label text-signal">{caption.tag}</p>
          <p className="mt-3 text-balance text-[clamp(1.2rem,0.95rem+1vw,1.75rem)] font-light leading-[1.2] tracking-tight">{caption.title}</p>
          {caption.roles && (
            <p className="mt-3 flex justify-center gap-2">
              {caption.roles.map((r) => (
                <span key={r} className="rounded-full border border-white/15 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-paper/70">{t(ROLE_NAME[r])}</span>
              ))}
            </p>
          )}
        </div>

        <div className="relative mx-auto mt-6 w-full max-w-[760px]">
          <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto max-h-[46vh] w-full" role="group" aria-label={t({ es: 'Los siete momentos del ciclo', en: 'The seven cycle moments' })}>
            <defs>
              <linearGradient id="dots-fiber" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="rgb(var(--signal))" />
                <stop offset="1" stopColor="#ff54aa" />
              </linearGradient>
            </defs>
            <g>
              {/* El anillo: tenue de fondo, y las fibras que conectan cada momento con el siguiente */}
              <circle cx={C.x} cy={C.y} r={R} fill="none" stroke="white" strokeOpacity={0.06} />
              {MOMENTS.map((m, i) => {
                // Se conecta cuando sus dos momentos ya están; el arco que cierra el ciclo, solo al final
                const lit = i < MOMENTS.length - 1 ? covered(i) && covered(i + 1) : connected
                return (
                  <path
                    key={m.id}
                    d={arcPath(i)}
                    pathLength={1}
                    fill="none"
                    stroke="url(#dots-fiber)"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeDasharray="1"
                    strokeDashoffset={lit ? 0 : 1}
                    style={{ transition: 'stroke-dashoffset 0.9s cubic-bezier(.65,0,.35,1) 0.35s', filter: 'drop-shadow(0 0 4px rgb(var(--signal) / 0.6))' }}
                  />
                )
              })}
              {/* La señal que recorre el ciclo cuando ya está conectado */}
              <circle
                cx={C.x}
                cy={C.y}
                r={R}
                fill="none"
                stroke="white"
                strokeWidth={3}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray="0.04 0.96"
                transform={`rotate(-90 ${C.x} ${C.y})`}
                className="dots-signal"
                style={{ opacity: connected ? 1 : 0, transition: 'opacity 0.6s 1s', filter: 'drop-shadow(0 0 6px white)' }}
              />
              {/* Los momentos: los que no existían quedan sueltos, fuera del anillo, hasta el rediseño */}
              {MOMENTS.map((m, i) => {
                const on = covered(i)
                const at = on ? onRing(i) : onRing(i, R + LOOSE.push)
                const label = onRing(i, (on ? R : R + LOOSE.push) + 30)
                const hot = current === i
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
                    onMouseEnter={() => setPicked(i)}
                    onMouseLeave={() => setPicked(null)}
                    className="cursor-pointer outline-none"
                  >
                    <g style={{ transform: `translate(${at.x}px, ${at.y}px) scale(${on ? 1 : LOOSE.scale})`, transition: 'transform 1s cubic-bezier(.16,1,.3,1)' }}>
                      <circle r={22} fill={hot ? '#ff54aa' : 'rgb(var(--signal))'} opacity={on || hot ? (isPicked ? 0.35 : 0.16) : 0} style={{ transition: 'opacity .5s, fill .5s' }} />
                      {hot && <circle r={14} fill="none" stroke="#ff54aa" strokeWidth={1.5} className="dots-hot" />}
                      <circle r={on ? 7 : 6} fill={on ? (isPicked ? 'white' : 'rgb(var(--signal))') : 'rgb(var(--void))'} stroke={on ? 'white' : 'rgb(255 255 255 / 0.55)'} strokeWidth={1.4} style={{ transition: 'fill .5s, stroke .5s' }} />
                    </g>
                    <g style={{ transform: `translate(${label.x}px, ${label.y}px)`, transition: 'transform 1s cubic-bezier(.16,1,.3,1)' }}>
                      <text
                        textAnchor={label.x < C.x - 10 ? 'end' : label.x > C.x + 10 ? 'start' : 'middle'}
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
              {/* Centro: cuántos momentos cubre; sube con cada paso */}
              <g>
              <text x={C.x} y={C.y - 8} textAnchor="middle" className="fill-current" fontSize={72} fontWeight={300}>
                <tspan key={count} className="ms-value">{count}</tspan>
                <tspan fontSize={26} className="opacity-40">/7</tspan>
              </text>
              <text x={C.x} y={C.y + 30} textAnchor="middle" className="fill-current font-mono uppercase opacity-50" fontSize={11} letterSpacing="0.14em">
                {step === 0 ? t({ es: 'cubiertos antes', en: 'covered before' }) : t({ es: 'en el rediseño', en: 'in the redesign' })}
              </text>
              </g>
            </g>
          </svg>
        </div>

        {/* Los pasos: el antes, un punto por momento y el ciclo completo; avanzan solos y se pueden tocar */}
        <div className="mt-4 flex items-center gap-4">
          <ol className="relative flex items-center gap-4">
            <span className="absolute inset-x-1 top-1/2 h-px -translate-y-1/2 bg-white/12" aria-hidden="true" />
            <span className="absolute left-1 top-1/2 h-px -translate-y-1/2 origin-left bg-gradient-to-r from-signal to-[#ff54aa] transition-[width] duration-700 ease-expo" style={{ width: `calc((100% - 0.5rem) * ${step / LAST})` }} aria-hidden="true" />
            {Array.from({ length: LAST + 1 }, (_, i) => (
              <li key={i} className="relative">
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  aria-current={step === i ? 'step' : undefined}
                  aria-label={i === 0 ? t({ es: 'Antes', en: 'Before' }) : i === LAST ? t({ es: 'Rediseño', en: 'Redesign' }) : t(MOMENTS[i - 1].name)}
                  className={`block rounded-full transition-all duration-500 ease-expo ${step === i ? 'h-3 w-3 bg-signal shadow-[0_0_12px_2px_rgb(var(--signal)/0.7)]' : i < step ? 'h-2 w-2 bg-white/60' : 'h-2 w-2 border border-white/40 bg-void hover:border-white'}`}
                />
              </li>
            ))}
          </ol>
          <button
            type="button"
            onClick={() => goTo(0)}
            className={`mono-label rounded-full border border-white/12 px-3 py-1 text-paper/60 transition-all duration-500 hover:border-white/35 hover:text-paper ${connected ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
          >
            ↻ {t({ es: 'Otra vez', en: 'Replay' })}
          </button>
        </div>

        {/* Al conectarse, las cifras del punto de partida */}
        <dl className={`mx-auto mt-4 grid w-full max-w-[760px] grid-cols-4 gap-3 transition-all duration-700 ease-expo ${connected ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}>
          {OBJ_CASE.dots.facts.map((f) => (
            <div key={f.label.es} className="text-center">
              <dt className="sr-only">{t(f.label)}</dt>
              <dd>
                <span className="block text-[clamp(1.6rem,1.2rem+1.4vw,2.6rem)] font-light leading-none text-signal tabular-nums">{f.value}</span>
                <span className="mt-2 block text-[11px] leading-snug text-paper/50">{t(f.label as L)}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
      </div>
    </div>
  )
}

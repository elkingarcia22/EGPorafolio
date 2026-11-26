'use client'

import { useEffect, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { ENCUESTAS_CASE } from '@/lib/content/cases/encuestas/case'
import { useMedia, TABLET_QUERY } from '../objetivos/use-media'
import { CyclePhone } from './phone/cycle-phone'

const STATIONS = ENCUESTAS_CASE.dots.stations
/** Los momentos que no existían: sin importación y sin experiencia para responder */
const MISSING = new Set(['historico', 'responder'])

const W = 900
const H = 520
const C = { x: W / 2, y: H / 2 }
const R = 200
/** Empieza arriba y gira en el sentido del reloj */
const angle = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / STATIONS.length
const round = (n: number) => Math.round(n * 100) / 100
const pointAt = (i: number, r = R) => ({ x: round(C.x + r * Math.cos(angle(i))), y: round(C.y + r * Math.sin(angle(i))) })
/** El arco del anillo entre un momento y el siguiente */
const arc = (i: number) => {
  const a = pointAt(i)
  const b = pointAt((i + 1) % STATIONS.length)
  return `M${a.x} ${a.y} A${R} ${R} 0 0 1 ${b.x} ${b.y}`
}
/** Un momento suelto cae hacia el centro, fuera del anillo */
const LOOSE_R = R - 70
/** Pasos: 0 = el ciclo de antes; 1–6 = se recorre cada momento; 7 = el ciclo cerrado */
const LAST = STATIONS.length + 1
const AUTO = { intro: 900, step: 520 }

/**
 * 01 · Los puntos: el ciclo de una medición como un anillo de seis momentos.
 * Antes, dos no existían (traer el histórico y responder) y caían hacia dentro.
 * Al entrar, el anillo se recorre momento a momento hasta cerrarse y una señal
 * lo rodea. Tocar un momento muestra el antes y el después.
 */
export function EncCycleRing() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const rootRef = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState(reducedMotion ? LAST : 0)
  const [inView, setInView] = useState(false)
  const [picked, setPicked] = useState<number | null>(null)
  const wide = useMedia(TABLET_QUERY)
  const closed = step === LAST
  const current = step >= 1 && step <= STATIONS.length ? step - 1 : null
  const onRing = (i: number) => closed || !MISSING.has(STATIONS[i].id) || (current !== null && i <= current)

  useEffect(() => {
    const root = rootRef.current
    if (!root || reducedMotion) {
      setStep(LAST)
      return
    }
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: '0px 0px -30% 0px' })
    io.observe(root)
    return () => io.disconnect()
  }, [reducedMotion])

  useEffect(() => {
    if (!inView || reducedMotion || step >= LAST) return
    const id = window.setTimeout(() => setStep((s) => s + 1), step === 0 ? AUTO.intro : AUTO.step)
    return () => window.clearTimeout(id)
  }, [inView, reducedMotion, step])

  const focus = picked ?? current
  const st = focus !== null ? STATIONS[focus] : null

  if (!wide) {
    return (
      <div ref={rootRef}>
        <CyclePhone
          stations={STATIONS}
          onRing={STATIONS.map((_, i) => onRing(i))}
          current={current}
          picked={picked}
          onPick={(i) => setPicked(picked === i ? null : i)}
          closed={closed}
          headline={{
            label: closed ? t({ es: 'Rediseño', en: 'Redesign' }) : step === 0 ? t({ es: 'Antes', en: 'Before' }) : t(STATIONS[current ?? 0].name),
            text: closed ? t({ es: 'Un ciclo cerrado, de crear a actuar.', en: 'A closed cycle, from creating to acting.' }) : t({ es: 'Dos momentos ni siquiera existían.', en: 'Two moments didn’t even exist.' }),
          }}
          countLabel={step === 0 ? t({ es: 'existían antes', en: 'existed before' }) : t({ es: 'en el rediseño', en: 'in the redesign' })}
        />
      </div>
    )
  }

  return (
    <div ref={rootRef} className="relative mt-6">
      {/* Lo que dice el momento elegido: antes y después, una línea cada uno */}
      <div key={picked ?? 'auto'} className="obj-fade mx-auto flex min-h-[7.5rem] max-w-[64ch] flex-col items-center justify-end text-center" aria-live="polite">
        {picked !== null && st ? (
          <>
            <p className="mono-label text-signal">0{picked + 1} · {t(st.name)} · {t(st.who)}</p>
            <p className="mt-3 text-[15px] leading-relaxed text-paper/65 md:text-base"><span className="mr-2 font-mono text-[11px] uppercase tracking-[0.14em]">{t({ es: 'Antes', en: 'Before' })}</span>{t(st.before)}</p>
            <p className="mt-1.5 text-balance text-[clamp(1.05rem,0.95rem+0.5vw,1.35rem)] font-light leading-snug"><span className="mr-2 font-mono text-[11px] uppercase tracking-[0.14em] text-signal">{t({ es: 'Ahora', en: 'Now' })}</span>{t(st.after)}</p>
          </>
        ) : (
          <>
            <p className="mono-label text-signal">{closed ? t({ es: 'Rediseño', en: 'Redesign' }) : step === 0 ? t({ es: 'Antes', en: 'Before' }) : t(STATIONS[current ?? 0].name)}</p>
            <p className="mt-3 text-balance text-[clamp(1.2rem,0.95rem+1vw,1.75rem)] font-light leading-[1.2] tracking-tight">
              {closed
                ? t({ es: 'Un ciclo cerrado, de crear a actuar.', en: 'A closed cycle, from creating to acting.' })
                : t({ es: 'Dos momentos ni siquiera existían.', en: 'Two moments didn’t even exist.' })}
            </p>
          </>
        )}
      </div>

      <div className="relative mx-auto mt-4 w-full max-w-[760px]">
        <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto max-h-[56vh] w-full overflow-visible" role="group" aria-label={t({ es: 'Los seis momentos de una medición', en: 'The six moments of a measurement' })}>
          <defs>
            <linearGradient id="enc-ring" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="rgb(var(--signal))" />
              <stop offset="1" stopColor="rgb(var(--spark))" />
            </linearGradient>
          </defs>
          <circle cx={C.x} cy={C.y} r={R} fill="none" stroke="white" strokeOpacity={0.07} />
          {STATIONS.map((s, i) => {
            const lit = onRing(i) && onRing((i + 1) % STATIONS.length)
            return (
              <path
                key={s.id}
                d={arc(i)}
                pathLength={1}
                fill="none"
                stroke="url(#enc-ring)"
                strokeWidth={2}
                strokeLinecap="round"
                strokeDasharray="1"
                strokeDashoffset={lit ? 0 : 1}
                style={{ transition: `stroke-dashoffset ${AUTO.step}ms linear`, filter: 'drop-shadow(0 0 4px rgb(var(--signal) / 0.6))' }}
              />
            )
          })}
          {/* La señal que rodea el anillo cuando ya está cerrado */}
          <circle cx={C.x} cy={C.y} r={R} fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" pathLength={1} strokeDasharray="0.04 0.96" transform={`rotate(-90 ${C.x} ${C.y})`} className="dots-signal" style={{ opacity: closed ? 1 : 0, transition: 'opacity .6s .3s', filter: 'drop-shadow(0 0 6px white)' }} />

          {/* En el centro: cuántos momentos cubre el producto */}
          <text x={C.x} y={C.y + 14} textAnchor="middle" className="fill-current" fontSize={84} fontWeight={300}>
            <tspan key={STATIONS.filter((_, i) => onRing(i)).length} className="ms-value">{STATIONS.filter((_, i) => onRing(i)).length}</tspan>
            <tspan fontSize={30} className="opacity-40">/6</tspan>
          </text>
          <text x={C.x} y={C.y + 50} textAnchor="middle" className="enc-ring-sub fill-current font-mono uppercase opacity-50" letterSpacing="0.14em">
            {step === 0 ? t({ es: 'existían antes', en: 'existed before' }) : t({ es: 'en el rediseño', en: 'in the redesign' })}
          </text>

          {STATIONS.map((s, i) => {
            const on = onRing(i)
            const p = on ? pointAt(i) : pointAt(i, LOOSE_R)
            // En el anillo, el nombre va por fuera; suelto, debajo del punto
            const label = on ? pointAt(i, R + 46) : { x: p.x, y: p.y + 34 }
            const isPicked = picked === i
            const isCurrent = current === i && picked === null
            const choose = () => setPicked(isPicked ? null : i)
            return (
              <g
                key={s.id}
                role="button"
                tabIndex={0}
                aria-pressed={isPicked}
                aria-label={t(s.name)}
                onClick={choose}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    choose()
                  }
                }}
                className="cursor-pointer outline-none"
              >
                <g style={{ transform: `translate(${p.x}px, ${p.y}px) scale(${on ? 1 : 0.65})`, transition: 'transform .6s cubic-bezier(.16,1,.3,1)' }}>
                  <circle r={30} fill="transparent" />
                  <circle r={24} fill={isPicked ? '#ff54aa' : 'rgb(var(--signal))'} opacity={on ? (isPicked || isCurrent ? 0.35 : 0.14) : 0} style={{ transition: 'opacity .5s' }} />
                  {(isPicked || isCurrent) && <circle r={15} fill="none" stroke={isPicked ? '#ff54aa' : 'rgb(var(--signal))'} strokeWidth={1.5} className="dots-hot" />}
                  <circle r={on ? 8 : 6.5} fill={on ? (isPicked ? 'white' : 'rgb(var(--signal))') : 'rgb(var(--void))'} stroke={on ? 'white' : 'rgb(255 255 255 / 0.5)'} strokeWidth={1.4} strokeDasharray={on ? undefined : '2 2'} style={{ transition: 'fill .5s' }} />
                  {/* Del último momento, «Actuar», sale la fibra hacia «Patrones» */}
                  {i === STATIONS.length - 1 && <circle r={1} fill="none" data-fiber-from="enc-patrones" />}
                </g>
                <text
                  x={label.x}
                  y={label.y}
                  dy="0.35em"
                  textAnchor={!on || Math.abs(label.x - C.x) < 10 ? 'middle' : label.x > C.x ? 'start' : 'end'}
                  className="enc-ring-label pointer-events-none fill-current font-mono uppercase"
                  letterSpacing="0.12em"
                  style={{ opacity: isPicked ? 1 : on ? 0.85 : 0.4, transition: 'opacity .6s, x .6s cubic-bezier(.16,1,.3,1), y .6s cubic-bezier(.16,1,.3,1)' }}
                >
                  {t(s.name)}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

    </div>
  )
}

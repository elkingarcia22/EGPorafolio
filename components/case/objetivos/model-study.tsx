'use client'

import { useEffect, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { MODELS } from './models-data'
import { useNarrow } from '@/components/case/kit/use-narrow'

/** Lienzo de la escena (unidades del SVG) */
const W = 900
const H = 380
/** Los cinco modelos, en columna a la derecha */
const MODEL_AT = [50, 120, 190, 260, 330].map((y) => ({ x: 740, y }))
/** El constructor, a la izquierda: los cinco desembocan en él y de él sale la fibra hacia «La idea» */
const HUB = { x: 200, y: 190 }
const HUB_R = 58
/** Se completa sola y rápido al verse: una pausa corta al inicio y luego cada fibra seguida de la anterior (ms) */
const AUTO = { intro: 600, step: 420 }
/** Pasos: 0 = nada; 1–5 = llega cada modelo al constructor */
const LAST = MODEL_AT.length
const HUB_CIRC = 2 * Math.PI * HUB_R
/** Fibra de un modelo al borde del constructor: sale horizontal y entra recogiéndose, como un río que desemboca */
const fiberPath = (i: number) => {
  const a = MODEL_AT[i]
  const angle = ((i - 2) * 18 * Math.PI) / 180
  const end = { x: HUB.x + Math.cos(angle) * (HUB_R + 6), y: HUB.y + Math.sin(angle) * (HUB_R + 6) }
  return `M${a.x} ${a.y} C${a.x - 260} ${a.y} ${end.x + 200} ${end.y + Math.sin(angle) * 40} ${end.x} ${end.y}`
}

/**
 * 02 · Patrones: los cinco modelos en columna, y cada uno manda su fibra hasta
 * un solo constructor, que se va llenando a medida que llegan (un anillo de
 * cinco tramos). Se completa sola y rápido; arriba, una sola frase, y lo de
 * cada modelo sale solo al tocarlo. Del constructor sale la fibra hacia la
 * izquierda, hasta «La idea».
 */
export function ModelStudy() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const rootRef = useRef<HTMLDivElement>(null)
  // En el teléfono el dibujo va de pie: los modelos arriba y el constructor abajo (ver ModelsPortrait).
  const narrow = useNarrow()
  const [step, setStep] = useState(reducedMotion ? LAST : 0)
  const [inView, setInView] = useState(false)
  const [picked, setPicked] = useState<number | null>(null)
  const done = step === LAST

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

  useEffect(() => {
    if (!inView || reducedMotion || step >= LAST) return
    const id = window.setTimeout(() => setStep((s) => Math.min(LAST, s + 1)), step === 0 ? AUTO.intro : AUTO.step)
    return () => window.clearTimeout(id)
  }, [inView, reducedMotion, step])

  const caption = (() => {
    if (picked === LAST) return { tag: t({ es: 'Constructor', en: 'Builder' }), title: t({ es: 'Las mismas seis reglas para todos; solo cambia su posición.', en: 'The same six rules for all; only their setting changes.' }) }
    if (picked !== null) {
      const m = MODELS[picked]
      return { tag: `${t({ es: 'Modelo', en: 'Model' })} · ${m.label}`, title: t(m.tagline), sub: t(m.company) }
    }
    return { tag: t({ es: 'Cinco modelos', en: 'Five models' }), title: t({ es: 'Cinco formas de escribir objetivos, un solo constructor.', en: 'Five ways to write goals, one builder.' }) }
  })()

  const toggle = (i: number) => setPicked((p) => (p === i ? null : i))

  return (
    <figure ref={rootRef} className="mx-auto flex max-w-[900px] flex-col items-center text-center">
      <figcaption key={picked ?? 'all'} className="obj-fade flex min-h-[5.5rem] max-w-[62ch] flex-col items-center justify-end">
        <span className="mono-label text-signal">{caption.tag}</span>
        <span className="mt-3 text-balance text-[clamp(1.2rem,0.95rem+1vw,1.75rem)] font-light leading-[1.2] tracking-tight">{caption.title}</span>
        {caption.sub && <span className="mt-1 text-sm text-paper/55">{caption.sub}</span>}
      </figcaption>

      {narrow ? (
        <ModelsPortrait step={step} done={done} picked={picked} onPick={toggle} />
      ) : (
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-6 block h-auto max-h-[44vh] w-full overflow-visible" role="group" aria-label={t({ es: 'Cinco modelos, un solo constructor', en: 'Five models, one builder' })}>
        <defs>
          <linearGradient id="ms-fiber" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0" stopColor="#ff54aa" />
            <stop offset="1" stopColor="rgb(var(--signal))" />
          </linearGradient>
        </defs>

        {/* Las cinco fibras: tenues de fondo; cada una se dibuja cuando su modelo llega */}
        {MODEL_AT.map((_, i) => (
          <g key={i}>
            <path d={fiberPath(i)} fill="none" stroke="white" strokeOpacity={0.07} />
            <path
              d={fiberPath(i)}
              pathLength={1}
              fill="none"
              stroke="url(#ms-fiber)"
              strokeWidth={picked === i ? 2.6 : 1.8}
              strokeLinecap="round"
              strokeDasharray="1"
              strokeDashoffset={step > i ? 0 : 1}
              style={{ transition: `stroke-dashoffset ${AUTO.step}ms cubic-bezier(.5,0,.3,1), stroke-width .3s`, filter: 'drop-shadow(0 0 4px rgb(var(--signal) / 0.55))' }}
            />
            {/* Completo: un impulso baja por cada fibra al mismo tiempo, todos hacia el constructor */}
            <path
              d={fiberPath(i)}
              fill="none"
              stroke="white"
              strokeWidth={2.6}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="0.05 0.95"
              className="dots-signal"
              style={{ opacity: done ? 1 : 0, transition: 'opacity 0.6s 0.3s', animationDelay: `${i * 0.12}s`, filter: 'drop-shadow(0 0 5px white)' }}
            />
          </g>
        ))}

        {/* Los modelos: el nodo y su nombre a la derecha */}
        {MODEL_AT.map((p, i) => {
          const on = step > i
          const isPicked = picked === i
          return (
            <g
              key={MODELS[i].id}
              role="button"
              tabIndex={0}
              aria-label={MODELS[i].label}
              aria-pressed={isPicked}
              onClick={() => toggle(i)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  toggle(i)
                }
              }}
              className="cursor-pointer outline-none"
              transform={`translate(${p.x} ${p.y})`}
            >
              <rect x={-14} y={-16} width={150} height={32} fill="transparent" />
              <circle r={18} fill={isPicked ? '#ff54aa' : 'rgb(var(--signal))'} opacity={on ? (isPicked ? 0.3 : 0.14) : 0} style={{ transition: 'opacity .4s, fill .4s' }} />
              <circle r={6} fill={on ? (isPicked ? 'white' : 'rgb(var(--signal))') : 'rgb(var(--void))'} stroke={on ? 'white' : 'rgb(255 255 255 / 0.45)'} strokeWidth={1.4} style={{ transition: 'fill .4s, stroke .4s' }} />
              <text x={24} dy="0.35em" className="pointer-events-none fill-current font-mono uppercase" fontSize={13} letterSpacing="0.16em" style={{ opacity: isPicked ? 1 : on ? 0.85 : 0.4, transition: 'opacity .4s' }}>
                {MODELS[i].label}
              </text>
            </g>
          )
        })}

        {/* El constructor: su anillo se llena un tramo por modelo que llega, con la cuenta adentro */}
        <g
          role="button"
          tabIndex={0}
          aria-label={t({ es: 'Constructor', en: 'Builder' })}
          aria-pressed={picked === LAST}
          onClick={() => toggle(LAST)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              toggle(LAST)
            }
          }}
          className="cursor-pointer outline-none"
          transform={`translate(${HUB.x} ${HUB.y})`}
        >
          <circle r={HUB_R + 26} fill="rgb(var(--signal))" opacity={done ? 0.1 : 0.04} style={{ transition: 'opacity .6s' }} />
          <circle r={HUB_R} fill="rgb(var(--void))" stroke="white" strokeOpacity={0.1} strokeWidth={4} />
          <circle
            r={HUB_R}
            fill="none"
            stroke="url(#ms-fiber)"
            strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray={HUB_CIRC}
            strokeDashoffset={HUB_CIRC * (1 - Math.min(step, LAST) / LAST)}
            transform="rotate(-90)"
            style={{ transition: `stroke-dashoffset ${AUTO.step}ms ease-out` }}
          />
          <text y={10} textAnchor="middle" className="fill-current" fontSize={40} fontWeight={300}>
            <tspan key={step} className="ms-value">{Math.min(step, LAST)}</tspan>
            <tspan fontSize={16} className="opacity-40">/5</tspan>
          </text>
          <text y={HUB_R + 30} textAnchor="middle" className="pointer-events-none fill-current font-mono uppercase" fontSize={12} letterSpacing="0.16em" style={{ opacity: picked === LAST || done ? 1 : 0.6 }}>
            {t({ es: 'Constructor', en: 'Builder' })}
          </text>
          {/* De aquí sale la fibra que baja, por la izquierda, hasta «La idea» */}
          <circle cx={-HUB_R} cy={0} r={1} fill="none" data-fiber-from="obj-idea" />
        </g>
      </svg>
      )}
    </figure>
  )
}

/** El dibujo de pie para el teléfono, a su tamaño real (px): los textos se leen sin escalar */
const P = { w: 340, h: 290, top: 54, hub: { x: 170, y: 206 }, r: 42 }
const P_CIRC = 2 * Math.PI * P.r
const P_MODEL_X = [30, 100, 170, 240, 310]
/** Fibra de un modelo (arriba) al constructor (abajo): baja y se recoge hacia el anillo */
const portraitFiber = (i: number) => {
  const x = P_MODEL_X[i]
  const end = { x: P.hub.x + (x - P.hub.x) * 0.28, y: P.hub.y - P.r - 4 }
  return `M${x} ${P.top} C${x} ${P.top + 70} ${end.x} ${end.y - 60} ${end.x} ${end.y}`
}

interface ModelsPortraitProps {
  step: number
  done: boolean
  picked: number | null
  onPick: (i: number) => void
}

/**
 * Patrones en el teléfono: los cinco modelos en una fila arriba y cada uno baja
 * su fibra hasta el constructor, que se llena un tramo por modelo. Del anillo
 * sale la fibra hacia «La idea».
 */
function ModelsPortrait({ step, done, picked, onPick }: ModelsPortraitProps) {
  const { t } = useLocale()
  return (
    <div className="relative mt-6 w-full max-w-[340px]">
      <svg viewBox={`0 0 ${P.w} ${P.h}`} className="block h-auto w-full overflow-visible" aria-hidden="true">
        <defs>
          <linearGradient id="ms-fiber-p" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ff54aa" />
            <stop offset="1" stopColor="rgb(var(--signal))" />
          </linearGradient>
        </defs>
        {P_MODEL_X.map((x, i) => (
          <g key={x}>
            <path d={portraitFiber(i)} fill="none" stroke="white" strokeOpacity={0.08} />
            <path
              d={portraitFiber(i)}
              pathLength={1}
              fill="none"
              stroke="url(#ms-fiber-p)"
              strokeWidth={picked === i ? 2.4 : 1.6}
              strokeLinecap="round"
              strokeDasharray="1"
              strokeDashoffset={step > i ? 0 : 1}
              style={{ transition: `stroke-dashoffset ${AUTO.step}ms cubic-bezier(.5,0,.3,1)`, filter: 'drop-shadow(0 0 4px rgb(var(--signal) / 0.55))' }}
            />
            <path d={portraitFiber(i)} fill="none" stroke="white" strokeWidth={2.4} strokeLinecap="round" pathLength={1} strokeDasharray="0.06 0.94" className="dots-signal" style={{ opacity: done ? 1 : 0, transition: 'opacity 0.6s 0.3s', animationDelay: `${i * 0.12}s` }} />
            <circle cx={x} cy={P.top} r={14} fill={picked === i ? '#ff54aa' : 'rgb(var(--signal))'} opacity={step > i ? (picked === i ? 0.3 : 0.14) : 0} style={{ transition: 'opacity .4s' }} />
            <circle cx={x} cy={P.top} r={5} fill={step > i ? (picked === i ? 'white' : 'rgb(var(--signal))') : 'rgb(var(--void))'} stroke={step > i ? 'white' : 'rgb(255 255 255 / 0.45)'} strokeWidth={1.3} style={{ transition: 'fill .4s, stroke .4s' }} />
          </g>
        ))}
        <circle cx={P.hub.x} cy={P.hub.y} r={P.r + 20} fill="rgb(var(--signal))" opacity={done ? 0.1 : 0.04} style={{ transition: 'opacity .6s' }} />
        <circle cx={P.hub.x} cy={P.hub.y} r={P.r} fill="rgb(var(--void))" stroke="white" strokeOpacity={0.1} strokeWidth={3} />
        <circle
          cx={P.hub.x}
          cy={P.hub.y}
          r={P.r}
          fill="none"
          stroke="url(#ms-fiber-p)"
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={P_CIRC}
          strokeDashoffset={P_CIRC * (1 - Math.min(step, LAST) / LAST)}
          transform={`rotate(-90 ${P.hub.x} ${P.hub.y})`}
          style={{ transition: `stroke-dashoffset ${AUTO.step}ms ease-out` }}
        />
      </svg>

      {/* Los nombres de los modelos, en texto real, sobre sus nodos */}
      {P_MODEL_X.map((x, i) => (
        <button
          key={MODELS[i].id}
          type="button"
          onClick={() => onPick(i)}
          aria-pressed={picked === i}
          className={`absolute top-0 -translate-x-1/2 font-mono text-[11px] uppercase tracking-[0.1em] transition-opacity duration-300 ${picked === i ? 'opacity-100' : step > i ? 'opacity-85' : 'opacity-40'}`}
          style={{ left: `${(x / P.w) * 100}%` }}
        >
          {MODELS[i].label}
          {/* El toque alcanza también el nodo de abajo */}
          <span aria-hidden="true" className="absolute left-1/2 top-full h-10 w-10 -translate-x-1/2" />
        </button>
      ))}

      {/* El constructor: la cuenta adentro y su nombre debajo */}
      <button
        type="button"
        onClick={() => onPick(LAST)}
        aria-pressed={picked === LAST}
        aria-label={t({ es: 'Constructor', en: 'Builder' })}
        className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
        style={{ left: `${(P.hub.x / P.w) * 100}%`, top: `${(P.hub.y / P.h) * 100}%` }}
      >
        <span className="flex items-baseline">
          <span key={step} className="ms-value text-[30px] font-light leading-none tabular-nums">{Math.min(step, LAST)}</span>
          <span className="text-sm text-paper/40">/5</span>
        </span>
        <span data-fiber-from="obj-idea" aria-hidden="true" className="absolute left-1/2 top-1/2 h-px w-px" />
      </button>
      <p className={`absolute inset-x-0 text-center font-mono text-[11px] uppercase tracking-[0.14em] transition-opacity ${picked === LAST || done ? 'opacity-100' : 'opacity-60'}`} style={{ top: `${((P.hub.y + P.r + 14) / P.h) * 100}%` }}>
        {t({ es: 'Constructor', en: 'Builder' })}
      </p>
    </div>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { MODELS } from './models-data'
import { useSvgScale } from '@/components/case/kit/use-svg-scale'

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
  const svgRef = useRef<SVGSVGElement>(null)
  // En el teléfono el dibujo se encoge: los textos se agrandan para seguir leyéndose.
  const { fit } = useSvgScale(svgRef, W)
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

      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="mt-6 block h-auto max-h-[44vh] w-full overflow-visible" role="group" aria-label={t({ es: 'Cinco modelos, un solo constructor', en: 'Five models, one builder' })}>
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
              <text x={24} dy="0.35em" className="pointer-events-none fill-current font-mono uppercase" fontSize={fit(11, 13)} letterSpacing="0.16em" style={{ opacity: isPicked ? 1 : on ? 0.85 : 0.4, transition: 'opacity .4s' }}>
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
          <text y={10} textAnchor="middle" className="fill-current" fontSize={fit(20, 40)} fontWeight={300}>
            <tspan key={step} className="ms-value">{Math.min(step, LAST)}</tspan>
            <tspan fontSize={fit(9, 16)} className="opacity-40">/5</tspan>
          </text>
          <text y={HUB_R + 30} textAnchor="middle" className="pointer-events-none fill-current font-mono uppercase" fontSize={fit(10.5, 12)} letterSpacing="0.16em" style={{ opacity: picked === LAST || done ? 1 : 0.6 }}>
            {t({ es: 'Constructor', en: 'Builder' })}
          </text>
          {/* De aquí sale la fibra que baja, por la izquierda, hasta «La idea» */}
          <circle cx={-HUB_R} cy={0} r={1} fill="none" data-fiber-from="obj-idea" />
        </g>
      </svg>
    </figure>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { useNarrow } from '@/components/case/kit/use-narrow'

/** Los cuatro principios que salieron de la pregunta: nombre corto y su porqué (este solo se lee al tocarlo). */
const PRINCIPLES: readonly { title: L; body: L }[] = [
  { title: { es: 'El norte primero', en: 'North first' }, body: { es: 'Cada objetivo dice a cuál de empresa empuja; lo que no cuelga de nada se ve «sin alinear».', en: 'Every goal says which company goal it pushes; what hangs from nothing shows as “unaligned”.' } },
  { title: { es: 'Acordar antes de medir', en: 'Agree before measuring' }, body: { es: 'Sin aprobar no hay avance: el líder aprueba o devuelve con un motivo.', en: 'No approval, no progress: the lead approves or returns it with a reason.' } },
  { title: { es: 'Constancia antes que %', en: 'Habit over %' }, body: { es: 'Se premia volver a reportar; el % crudo castiga a quien se puso metas ambiciosas.', en: 'Coming back to report is rewarded; raw % punishes ambitious goals.' } },
  { title: { es: 'Contar, no exponer', en: 'Count, don’t expose' }, body: { es: 'En público solo se nombra para reconocer; un cruce de menos de 3 personas sale reservado.', en: 'In public you only name people to praise; a cell under 3 people stays private.' } },
]

/** Lienzo de la escena (unidades del SVG) */
const W = 900
const H = 380
/** La pregunta a la izquierda, los principios en columna al centro y, a la derecha, a donde llegan todos */
const FROM = { x: 90, y: 190 }
const TO = { x: 810, y: 190 }
const MID_X = 450
const MID_Y = [52, 144, 236, 328]
/** Se completa sola y rápido al verse (ms): una pausa corta, una rama por principio y al final se juntan */
const AUTO = { intro: 600, step: 320 }
/** Pasos: 0 = la pregunta; 1–4 = se abre cada rama; 5 = las cuatro se juntan a la derecha */
const LAST = PRINCIPLES.length + 1

/** Media rama: de la pregunta a un principio (se abre) o de un principio a la llegada (se cierra) */
const branchIn = (y: number) => `M${FROM.x} ${FROM.y} C${FROM.x + 170} ${FROM.y} ${MID_X - 190} ${y} ${MID_X} ${y}`
const branchOut = (y: number) => `M${MID_X} ${y} C${MID_X + 190} ${y} ${TO.x - 170} ${TO.y} ${TO.x} ${TO.y}`

interface DotProps {
  x: number
  y: number
  r: number
  on: boolean
  picked: boolean
}

function Dot({ x, y, r, on, picked }: DotProps) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r + 14} fill={picked ? '#ff54aa' : 'rgb(var(--signal))'} opacity={on ? (picked ? 0.3 : 0.14) : 0} style={{ transition: 'opacity .4s, fill .4s' }} />
      {picked && <circle r={r + 7} fill="none" stroke="#ff54aa" strokeWidth={1.5} className="dots-hot" />}
      <circle r={r} fill={on ? (picked ? 'white' : 'rgb(var(--signal))') : 'rgb(var(--void))'} stroke={on ? 'white' : 'rgb(255 255 255 / 0.45)'} strokeWidth={1.4} style={{ transition: 'fill .4s, stroke .4s' }} />
    </g>
  )
}

/**
 * 03 · La idea: la pregunta se abre en cuatro principios y los cuatro se vuelven
 * a juntar en uno solo —cada empresa, a su manera—. Las ramas se dibujan solas
 * y rápido; arriba queda la pregunta, y el porqué de cada principio sale solo
 * al tocarlo. De la llegada sale la fibra hacia la derecha, hasta «Bocetos».
 */
export function IdeaFork({ question }: { question: string }) {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const rootRef = useRef<HTMLDivElement>(null)
  // En el teléfono las ramas bajan en vez de ir de lado (ver ForkPortrait).
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

  const toggle = (i: number) => setPicked((p) => (p === i ? null : i))
  const caption =
    picked !== null
      ? { tag: `${t({ es: 'Principio', en: 'Principle' })} 0${picked + 1}`, title: t(PRINCIPLES[picked].title), sub: t(PRINCIPLES[picked].body) }
      : { tag: t({ es: '¿Cómo podríamos…?', en: 'How might we…?' }), title: question }

  return (
    <figure ref={rootRef} className="mx-auto flex max-w-[900px] flex-col items-center text-center">
      <figcaption key={picked ?? 'q'} className="obj-fade flex min-h-[7rem] max-w-[46ch] flex-col items-center justify-end">
        <span className="mono-label text-signal">{caption.tag}</span>
        <span className="mt-3 text-balance text-[clamp(1.3rem,1rem+1.2vw,2rem)] font-light leading-[1.18] tracking-tight">{caption.title}</span>
        {caption.sub && <span className="mt-2 max-w-[52ch] text-balance text-sm leading-relaxed text-paper/55">{caption.sub}</span>}
      </figcaption>

      {narrow ? (
        <ForkPortrait step={step} done={done} picked={picked} onPick={toggle} />
      ) : (
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-6 block h-auto max-h-[44vh] w-full overflow-visible" role="group" aria-label={t({ es: 'Una pregunta, cuatro principios', en: 'One question, four principles' })}>
        <defs>
          <linearGradient id="fork-fiber" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="rgb(var(--signal))" />
            <stop offset="0.5" stopColor="#ff54aa" />
            <stop offset="1" stopColor="rgb(var(--signal))" />
          </linearGradient>
        </defs>

        {MID_Y.map((y, i) => (
          <g key={y}>
            {/* Rastros tenues de las dos mitades de cada rama */}
            <path d={branchIn(y)} fill="none" stroke="white" strokeOpacity={0.07} />
            <path d={branchOut(y)} fill="none" stroke="white" strokeOpacity={0.07} />
            {/* Se abre hacia el principio… */}
            <path
              d={branchIn(y)}
              pathLength={1}
              fill="none"
              stroke="url(#fork-fiber)"
              strokeWidth={picked === i ? 2.6 : 1.8}
              strokeLinecap="round"
              strokeDasharray="1"
              strokeDashoffset={step > i ? 0 : 1}
              style={{ transition: `stroke-dashoffset ${AUTO.step}ms cubic-bezier(.5,0,.3,1), stroke-width .3s`, filter: 'drop-shadow(0 0 4px rgb(var(--signal) / 0.55))' }}
            />
            {/* …y se cierra hacia la llegada cuando ya están los cuatro */}
            <path
              d={branchOut(y)}
              pathLength={1}
              fill="none"
              stroke="url(#fork-fiber)"
              strokeWidth={picked === i ? 2.6 : 1.8}
              strokeLinecap="round"
              strokeDasharray="1"
              strokeDashoffset={done ? 0 : 1}
              style={{ transition: `stroke-dashoffset ${AUTO.step * 1.6}ms cubic-bezier(.5,0,.3,1), stroke-width .3s`, filter: 'drop-shadow(0 0 4px rgb(var(--signal) / 0.55))' }}
            />
            {/* Completo: un impulso cruza cada rama, de la pregunta a la llegada */}
            <path
              d={`${branchIn(y)} ${branchOut(y).replace(/^M[^C]+/, '')}`}
              fill="none"
              stroke="white"
              strokeWidth={2.6}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="0.04 0.96"
              className="dots-signal"
              style={{ opacity: done ? 1 : 0, transition: 'opacity 0.6s 0.5s', animationDelay: `${i * 0.15}s`, filter: 'drop-shadow(0 0 5px white)' }}
            />
          </g>
        ))}

        {/* La pregunta, de donde se abren las ramas */}
        <Dot x={FROM.x} y={FROM.y} r={10} on picked={false} />
        <text x={FROM.x} y={FROM.y + 40} textAnchor="middle" className="fill-current font-mono uppercase opacity-70" fontSize={11} letterSpacing="0.16em">
          {t({ es: 'La pregunta', en: 'The question' })}
        </text>

        {/* Los principios: el nodo y su nombre corto encima; tocarlo muestra su porqué */}
        {MID_Y.map((y, i) => {
          const on = step > i
          const isPicked = picked === i
          return (
            <g
              key={`p-${y}`}
              role="button"
              tabIndex={0}
              aria-label={t(PRINCIPLES[i].title)}
              aria-pressed={isPicked}
              onClick={() => toggle(i)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  toggle(i)
                }
              }}
              className="cursor-pointer outline-none"
            >
              <rect x={MID_X - 110} y={y - 34} width={220} height={52} fill="transparent" />
              <Dot x={MID_X} y={y} r={6} on={on} picked={isPicked} />
              <text x={MID_X} y={y - 18} textAnchor="middle" className="pointer-events-none fill-current" fontSize={14} style={{ opacity: isPicked ? 1 : on ? 0.85 : 0.35, transition: 'opacity .4s' }}>
                {t(PRINCIPLES[i].title)}
              </text>
            </g>
          )
        })}

        {/* La llegada: los cuatro se juntan en uno; de aquí sale la fibra hacia «Bocetos» */}
        <Dot x={TO.x} y={TO.y} r={12} on={done} picked={false} />
        <text x={TO.x} y={TO.y + 42} textAnchor="middle" className="fill-current font-mono uppercase" fontSize={11} letterSpacing="0.16em" style={{ opacity: done ? 0.85 : 0.35, transition: 'opacity .4s' }}>
          {t({ es: 'A su manera', en: 'Their own way' })}
        </text>
        <circle cx={TO.x} cy={TO.y} r={1} fill="none" data-fiber-from="obj-bocetos" />
      </svg>
      )}
    </figure>
  )
}

/** El dibujo de pie para el teléfono, a su tamaño real (px) */
const F = { w: 340, h: 430, from: { x: 170, y: 22 }, to: { x: 170, y: 404 } }
/** Los cuatro principios en una cuadrícula de dos por dos */
const F_AT = [
  { x: 85, y: 140 },
  { x: 255, y: 140 },
  { x: 85, y: 268 },
  { x: 255, y: 268 },
]
/** Fila de arriba de la cuadrícula */
const isTop = (p: { y: number }) => p.y === F_AT[0].y
/** Las ramas a la fila de abajo bajan por los bordes, para no cruzar los textos de arriba */
const EDGE = { left: 4, right: F.w - 4 }
const forkIn = (p: { x: number; y: number }) => {
  if (isTop(p)) return `M${F.from.x} ${F.from.y} C${F.from.x} ${F.from.y + 60} ${p.x} ${p.y - 70} ${p.x} ${p.y}`
  const e = p.x < F.from.x ? EDGE.left : EDGE.right
  return `M${F.from.x} ${F.from.y} C${F.from.x} ${F.from.y + 50} ${e} ${F.from.y + 40} ${e} ${F.from.y + 140} S${p.x} ${p.y - 50} ${p.x} ${p.y}`
}
/** Las de arriba se recogen por el centro (entre los textos de abajo); las de abajo bajan directo */
const forkOut = (p: { x: number; y: number }) => {
  if (isTop(p)) return `M${p.x} ${p.y + 50} C${p.x} ${p.y + 80} ${F.to.x} ${p.y + 60} ${F.to.x} ${p.y + 120} L${F.to.x} ${F.to.y}`
  return `M${p.x} ${p.y + 62} C${p.x} ${p.y + 110} ${F.to.x} ${F.to.y - 50} ${F.to.x} ${F.to.y}`
}

interface ForkPortraitProps {
  step: number
  done: boolean
  picked: number | null
  onPick: (i: number) => void
}

/**
 * La idea en el teléfono: de la pregunta (arriba) bajan cuatro ramas a los
 * principios, en dos por dos, y vuelven a juntarse abajo, «a su manera». De
 * ahí sale la fibra hacia «Bocetos».
 */
function ForkPortrait({ step, done, picked, onPick }: ForkPortraitProps) {
  const { t } = useLocale()
  const pct = (v: number, total: number) => `${(v / total) * 100}%`
  return (
    <div className="relative mt-6 w-full max-w-[340px]">
      <svg viewBox={`0 0 ${F.w} ${F.h}`} className="block h-auto w-full overflow-visible" aria-hidden="true">
        <defs>
          <linearGradient id="fork-fiber-p" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="rgb(var(--signal))" />
            <stop offset="0.5" stopColor="#ff54aa" />
            <stop offset="1" stopColor="rgb(var(--signal))" />
          </linearGradient>
        </defs>
        {F_AT.map((p, i) => (
          <g key={`${p.x}-${p.y}`}>
            <path d={forkIn(p)} fill="none" stroke="white" strokeOpacity={0.08} />
            <path d={forkOut(p)} fill="none" stroke="white" strokeOpacity={0.08} />
            <path d={forkIn(p)} pathLength={1} fill="none" stroke="url(#fork-fiber-p)" strokeWidth={picked === i ? 2.4 : 1.6} strokeLinecap="round" strokeDasharray="1" strokeDashoffset={step > i ? 0 : 1} style={{ transition: `stroke-dashoffset ${AUTO.step}ms cubic-bezier(.5,0,.3,1)`, filter: 'drop-shadow(0 0 4px rgb(var(--signal) / 0.55))' }} />
            <path d={forkOut(p)} pathLength={1} fill="none" stroke="url(#fork-fiber-p)" strokeWidth={1.6} strokeLinecap="round" strokeDasharray="1" strokeDashoffset={done ? 0 : 1} style={{ transition: `stroke-dashoffset ${AUTO.step}ms cubic-bezier(.5,0,.3,1) ${i * 60}ms`, filter: 'drop-shadow(0 0 4px rgb(var(--signal) / 0.55))' }} />
            <circle cx={p.x} cy={p.y} r={14} fill={picked === i ? '#ff54aa' : 'rgb(var(--signal))'} opacity={step > i ? (picked === i ? 0.3 : 0.14) : 0} style={{ transition: 'opacity .4s' }} />
            <circle cx={p.x} cy={p.y} r={5} fill={step > i ? (picked === i ? 'white' : 'rgb(var(--signal))') : 'rgb(var(--void))'} stroke={step > i ? 'white' : 'rgb(255 255 255 / 0.45)'} strokeWidth={1.3} style={{ transition: 'fill .4s, stroke .4s' }} />
          </g>
        ))}
        <circle cx={F.from.x} cy={F.from.y} r={8} fill="white" style={{ filter: 'drop-shadow(0 0 8px rgb(var(--signal)))' }} />
        <circle cx={F.to.x} cy={F.to.y} r={18} fill="rgb(var(--signal))" opacity={done ? 0.18 : 0} style={{ transition: 'opacity .5s' }} />
        <circle cx={F.to.x} cy={F.to.y} r={9} fill={done ? 'white' : 'rgb(var(--void))'} stroke="white" strokeOpacity={done ? 1 : 0.4} strokeWidth={1.4} style={{ transition: 'fill .5s', filter: done ? 'drop-shadow(0 0 8px rgb(var(--signal)))' : undefined }} />
      </svg>

      <span className="absolute -translate-y-1/2 font-mono text-[11px] uppercase tracking-[0.14em] text-paper/70" style={{ left: 'calc(50% + 18px)', top: pct(F.from.y, F.h) }}>
        {t({ es: 'La pregunta', en: 'The question' })}
      </span>
      {F_AT.map((p, i) => (
        <button
          key={PRINCIPLES[i].title.es}
          type="button"
          onClick={() => onPick(i)}
          aria-pressed={picked === i}
          className={`absolute w-[44%] -translate-x-1/2 text-balance text-center text-[15px] leading-snug transition-opacity duration-300 ${picked === i ? 'opacity-100' : step > i ? 'opacity-90' : 'opacity-40'}`}
          style={{ left: pct(p.x, F.w), top: `calc(${pct(p.y, F.h)} + 14px)` }}
        >
          {t(PRINCIPLES[i].title)}
        </button>
      ))}
      <span className={`absolute -translate-y-1/2 font-mono text-[11px] uppercase tracking-[0.14em] transition-opacity ${done ? 'opacity-85' : 'opacity-35'}`} style={{ left: 'calc(50% + 22px)', top: pct(F.to.y, F.h) }}>
        {t({ es: 'A su manera', en: 'Their own way' })}
      </span>
      <span data-fiber-from="obj-bocetos" aria-hidden="true" className="absolute h-px w-px" style={{ left: pct(F.to.x, F.w), top: pct(F.to.y, F.h) }} />
    </div>
  )
}

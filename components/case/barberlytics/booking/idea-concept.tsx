'use client'

import { useState } from 'react'
import { useLocale, type L } from '@/lib/i18n'
import { BOOKING_CASE } from '@/lib/content/cases/barberlytics/booking-case'
import { BookingLede } from './booking-lede'
import { useAutoSteps } from './use-auto-steps'
import { IdeaPhone } from './phone/idea-phone'
import { usePhone } from './use-phone'

/** Lienzo del concepto */
const W = 900
const H = 380
const MID = 190
/** Los nodos del recorrido: el celular, la pregunta, el motor, el código y la cita */
const NODE = { phone: 70, ask: 230, engine: 670, code: 770, booked: 850 }
/** Los dos caminos que salen de la pregunta y vuelven a juntarse en un solo motor */
const UP = `M${NODE.ask} ${MID} C330 60 570 60 ${NODE.engine} ${MID}`
const DOWN = `M${NODE.ask} ${MID} C330 320 570 320 ${NODE.engine} ${MID}`
/** Punto medio de cada camino (curva simétrica) */
const ARC_MID = { up: 92.5, down: 287.5 }
/** Se arma solo: entrada, pregunta, los dos caminos, el motor y la cita (ms) */
const AUTO = { intro: 300, step: 380 }
const LAST = 5

/** Dónde vive cada principio sobre el concepto */
const MARKS: readonly { x: number; y: number; at: number }[] = [
  { x: NODE.ask, y: MID, at: 2 },
  { x: NODE.engine, y: MID, at: 4 },
  { x: 450, y: MID, at: 3 },
  { x: NODE.code, y: MID, at: 5 },
]

const LABELS: Record<'phone' | 'ask' | 'engine' | 'code' | 'booked' | 'up' | 'down', L> = {
  phone: { es: 'tu celular', en: 'your phone' },
  ask: { es: '¿vuelves|o llegas?', en: 'back|or new?' },
  engine: { es: 'un motor|un cobro', en: 'one engine|one checkout' },
  code: { es: 'código', en: 'code' },
  booked: { es: 'Cita', en: 'Booked' },
  up: { es: 'Lo de siempre, en un toque', en: 'The usual, in one tap' },
  down: { es: 'Conocerte, sin formulario', en: 'Meeting you, no form' },
}

/** Una etiqueta corta en dos renglones (separados por «|»), bajo la línea central */
function TwoLines({ x, anchor, text, style }: { x: number; anchor: 'start' | 'end'; text: string; style?: React.CSSProperties }) {
  const [a, b] = text.split('|')
  return (
    <text x={x} y={MID + 44} textAnchor={anchor} className="bk-t-note fill-current font-mono uppercase opacity-60" style={style}>
      <tspan x={x}>{a}</tspan>
      <tspan x={x} dy="1.25em">{b}</tspan>
    </text>
  )
}

/**
 * 03 · La idea, sin pantallas: lo que se quería construir dibujado como un
 * concepto. Un celular entra, una sola pregunta lo parte en dos caminos —lo de
 * siempre para quien vuelve, conocerte para quien llega— y los dos se juntan en
 * un mismo motor antes del código y la cita. Los cuatro principios viven sobre
 * el dibujo: tocarlos muestra su porqué. De la cita sale la fibra a «Bocetos».
 */
export function IdeaConcept() {
  const { t } = useLocale()
  const { idea } = BOOKING_CASE
  const { ref, step, done, reducedMotion } = useAutoSteps<HTMLDivElement>(LAST, AUTO)
  const [picked, setPicked] = useState<number | null>(null)
  const draw = (on: boolean) => ({ pathLength: 1, strokeDasharray: '1', strokeDashoffset: on ? 0 : 1, style: { transition: 'stroke-dashoffset .6s cubic-bezier(.5,0,.3,1)' } })
  const show = (on: boolean, delay = 0) => ({ style: { opacity: on ? 1 : 0, transition: `opacity .5s ${delay}ms` } })

  const phone = usePhone()
  const caption =
    picked !== null
      ? { tag: `${t({ es: 'Principio', en: 'Principle' })} 0${picked + 1}`, title: t(idea.principles[picked].title), sub: t(idea.principles[picked].body) }
      : { tag: t({ es: '¿Cómo podríamos…?', en: 'How might we…?' }), title: t(idea.hmw), sub: t({ es: 'Una pregunta, dos caminos y un solo motor. Toca un número para ver cada principio.', en: 'One question, two paths and one engine. Tap a number to see each principle.' }) }

  return (
    <div ref={ref} className="flex flex-col items-center">
      <BookingLede tag={caption.tag} title={caption.title} sub={caption.sub} swapKey={picked ?? 'q'} />

      {phone ? (
        <IdeaPhone step={step} done={done} reducedMotion={reducedMotion} picked={picked} onPick={(i) => setPicked((p) => (p === i ? null : i))} labels={LABELS} marksAt={MARKS.map((m) => m.at)} principles={idea.principles} />
      ) : (
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-10 block h-auto w-full max-w-[900px] overflow-visible" role="group" aria-label={t({ es: 'La idea: una pregunta, dos caminos, un motor', en: 'The idea: one question, two paths, one engine' })}>
        {/* Del celular a la pregunta */}
        <line x1={NODE.phone} y1={MID} x2={NODE.ask} y2={MID} stroke="white" strokeOpacity={0.35} strokeWidth={1.4} {...draw(step >= 1)} />
        {/* Los dos caminos */}
        <path d={UP} fill="none" stroke="rgb(var(--bk))" strokeWidth={2} {...draw(step >= 2)} />
        <path d={DOWN} fill="none" stroke="rgb(var(--signal))" strokeWidth={2} {...draw(step >= 2)} />
        {/* Los dos hablan el mismo lenguaje de elegir */}
        <line x1={450} y1={ARC_MID.up} x2={450} y2={ARC_MID.down} stroke="white" strokeOpacity={0.25} strokeDasharray="3 6" {...show(step >= 3)} />
        {/* Del motor a la cita */}
        <line x1={NODE.engine} y1={MID} x2={NODE.booked} y2={MID} stroke="white" strokeOpacity={0.35} strokeWidth={1.4} {...draw(step >= 4)} />

        {/* La señal: un cliente que entra y toma su camino, una y otra vez */}
        {done && !reducedMotion && (
          <g aria-hidden="true">
            {[UP, DOWN].map((d, i) => (
              <circle key={d} r={4} fill={i ? 'rgb(var(--signal))' : 'rgb(var(--bk))'} style={{ filter: `drop-shadow(0 0 6px ${i ? 'rgb(var(--signal))' : 'rgb(var(--bk))'})` }}>
                <animateMotion dur="3.2s" begin={`${i * 1.6}s`} repeatCount="indefinite" path={`M${NODE.phone} ${MID} L${NODE.ask} ${MID} ${d.slice(d.indexOf('C'))} L${NODE.booked} ${MID}`} />
              </circle>
            ))}
          </g>
        )}

        {/* Los nombres de los caminos */}
        <text x={450} y={ARC_MID.up - 26} textAnchor="middle" className="bk-t-row fill-current" {...show(step >= 2, 200)}>{t(LABELS.up)}</text>
        <text x={450} y={ARC_MID.down + 44} textAnchor="middle" className="bk-t-row fill-current" {...show(step >= 2, 300)}>{t(LABELS.down)}</text>

        {/* Los nodos */}
        <g {...show(step >= 0)}>
          <circle cx={NODE.phone} cy={MID} r={9} fill="rgb(var(--void))" stroke="white" strokeWidth={1.6} />
          <text x={NODE.phone} y={MID - 28} textAnchor="middle" className="bk-t-note fill-current font-mono uppercase opacity-60">{t(LABELS.phone)}</text>
        </g>
        {/* Fuera del óvalo, en dos renglones, para que ninguna curva pase por encima */}
        <TwoLines x={NODE.ask - 26} anchor="end" text={t(LABELS.ask)} {...show(step >= 1)} />
        <TwoLines x={NODE.engine + 26} anchor="start" text={t(LABELS.engine)} {...show(step >= 4)} />
        <text x={NODE.code - 10} y={MID - 34} textAnchor="middle" className="bk-t-note fill-current font-mono uppercase opacity-60" {...show(step >= 5)}>{t(LABELS.code)}</text>
        <g {...show(step >= 5)}>
          <circle cx={NODE.booked} cy={MID} r={22} fill="rgb(var(--bk))" opacity={0.18} />
          <circle cx={NODE.booked} cy={MID} r={10} fill="rgb(var(--bk))" stroke="white" strokeWidth={1.6} />
          <text x={NODE.booked + 8} y={MID - 34} textAnchor="middle" className="bk-t-row fill-current">{t(LABELS.booked)}</text>
          {/* De la cita sale la fibra hacia «Bocetos y forma» */}
          <circle cx={NODE.booked} cy={MID} r={1} fill="none" data-fiber-from="bk-bocetos" />
        </g>

        {/* Los principios, numerados sobre el concepto: tocarlos muestra su porqué */}
        {MARKS.map((m, i) => {
          const on = step >= m.at
          const isPicked = picked === i
          return (
            <g
              key={i}
              role="button"
              tabIndex={on ? 0 : -1}
              aria-pressed={isPicked}
              aria-label={t(idea.principles[i].title)}
              onClick={() => setPicked((p) => (p === i ? null : i))}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setPicked((p) => (p === i ? null : i))
                }
              }}
              className="cursor-pointer outline-none"
              style={{ opacity: on ? 1 : 0, transition: 'opacity .5s', pointerEvents: on ? 'auto' : 'none' }}
            >
              {isPicked && <circle cx={m.x} cy={m.y} r={26} fill="none" stroke="rgb(var(--bk))" strokeOpacity={0.6} />}
              <circle cx={m.x} cy={m.y} r={17} fill={isPicked ? 'rgb(var(--bk))' : 'rgb(var(--void))'} stroke="rgb(var(--bk))" strokeWidth={1.6} style={{ transition: 'fill .3s' }} />
              <text x={m.x} y={m.y} dy="0.35em" textAnchor="middle" className="bk-t-note font-mono" fill={isPicked ? '#14110b' : 'rgb(var(--bk))'}>0{i + 1}</text>
            </g>
          )
        })}
      </svg>
      )}
    </div>
  )
}

'use client'

import { useLocale } from '@/lib/i18n'
import { BOOKING_CASE } from '@/lib/content/cases/barberlytics/booking-case'
import { LABELS, MARKS } from './idea-concept'

interface PrincipleMarkProps {
  x: number
  y: number
  index: number
  on: boolean
  picked: boolean
  label: string
  onPick: (i: number) => void
  /** Tamaño del número (unidades del SVG) */
  fontSize?: number
}

/** Un principio numerado sobre el concepto: tocarlo muestra su porqué */
export function PrincipleMark({ x, y, index, on, picked, label, onPick, fontSize }: PrincipleMarkProps) {
  return (
    <g
      role="button"
      tabIndex={on ? 0 : -1}
      aria-pressed={picked}
      aria-label={label}
      onClick={() => onPick(index)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onPick(index)
        }
      }}
      className="cursor-pointer outline-none"
      style={{ opacity: on ? 1 : 0, transition: 'opacity .5s', pointerEvents: on ? 'auto' : 'none' }}
    >
      {picked && <circle cx={x} cy={y} r={26} fill="none" stroke="rgb(var(--bk))" strokeOpacity={0.6} />}
      <circle cx={x} cy={y} r={17} fill={picked ? 'rgb(var(--bk))' : 'rgb(var(--void))'} stroke="rgb(var(--bk))" strokeWidth={1.6} style={{ transition: 'fill .3s' }} />
      <text x={x} y={y} dy="0.35em" textAnchor="middle" className={fontSize ? 'font-mono' : 'bk-t-note font-mono'} fontSize={fontSize} fill={picked ? '#14110b' : 'rgb(var(--bk))'}>
        0{index + 1}
      </text>
    </g>
  )
}

/** Lienzo vertical del teléfono: se dibuja casi a tamaño real, así la letra se lee */
const W = 360
const H = 620
const X = 180
const Y = { phone: 36, ask: 128, mid: 290, engine: 452, code: 526, booked: 592 }
/** Los dos caminos se abren a los lados y vuelven a juntarse en el motor */
const LEFT = `M${X} ${Y.ask} C10 210 10 370 ${X} ${Y.engine}`
const RIGHT = `M${X} ${Y.ask} C350 210 350 370 ${X} ${Y.engine}`
const ARC_X = { left: 52.5, right: 307.5 }
/** Letra: notas en mono y nombres de los caminos (unidades ≈ px) */
const FONT = { note: 12.5, path: 15, number: 13, booked: 17 }
/** Lo mismo que en el lienzo ancho: los principios aparecen en el mismo paso */
const MARK_Y = [Y.ask, Y.engine, Y.mid, Y.code]

interface IdeaPortraitProps {
  step: number
  done: boolean
  reducedMotion: boolean
  picked: number | null
  onPick: (i: number) => void
}

/** Una nota corta en mono, a la derecha de la línea central */
function Note({ y, text, show }: { y: number; text: string; show: boolean }) {
  return (
    <text x={X + 26} y={y} dy="0.35em" fontSize={FONT.note} letterSpacing="0.08em" className="fill-current font-mono uppercase" style={{ opacity: show ? 0.65 : 0, transition: 'opacity .5s' }}>
      {text}
    </text>
  )
}

/** El nombre de un camino en dos renglones, dentro de su lado del óvalo */
function PathName({ x, text, show }: { x: number; text: string; show: boolean }) {
  const [a, b] = text.split(', ')
  return (
    <text x={x} y={Y.mid - 40} textAnchor="middle" fontSize={FONT.path} className="fill-current" style={{ opacity: show ? 1 : 0, transition: 'opacity .5s .2s' }}>
      <tspan x={x}>{b ? `${a},` : a}</tspan>
      {b && (
        <tspan x={x} dy="1.25em">
          {b}
        </tspan>
      )}
    </text>
  )
}

/**
 * 03 · La idea en el teléfono: el mismo concepto, de arriba abajo. El celular
 * entra, la pregunta lo abre en dos caminos a los lados, se juntan en el motor y
 * bajan al código y a la cita. Menos texto y a tamaño de lectura.
 */
export function IdeaPortrait({ step, done, reducedMotion, picked, onPick }: IdeaPortraitProps) {
  const { t } = useLocale()
  const { idea } = BOOKING_CASE
  const draw = (on: boolean) => ({ pathLength: 1, strokeDasharray: '1', strokeDashoffset: on ? 0 : 1, style: { transition: 'stroke-dashoffset .6s cubic-bezier(.5,0,.3,1)' } })
  const flat = (s: string, sep: string) => s.replace('|', sep)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mt-10 block h-auto w-full max-w-[400px] overflow-visible" role="group" aria-label={t({ es: 'La idea: una pregunta, dos caminos, un motor', en: 'The idea: one question, two paths, one engine' })}>
      <line x1={X} y1={Y.phone} x2={X} y2={Y.ask} stroke="white" strokeOpacity={0.35} strokeWidth={1.4} {...draw(step >= 1)} />
      <path d={LEFT} fill="none" stroke="rgb(var(--bk))" strokeWidth={2} {...draw(step >= 2)} />
      <path d={RIGHT} fill="none" stroke="rgb(var(--signal))" strokeWidth={2} {...draw(step >= 2)} />
      <line x1={ARC_X.left} y1={Y.mid} x2={ARC_X.right} y2={Y.mid} stroke="white" strokeOpacity={0.25} strokeDasharray="3 6" style={{ opacity: step >= 3 ? 1 : 0, transition: 'opacity .5s' }} />
      <line x1={X} y1={Y.engine} x2={X} y2={Y.booked} stroke="white" strokeOpacity={0.35} strokeWidth={1.4} {...draw(step >= 4)} />

      {done && !reducedMotion && (
        <g aria-hidden="true">
          {[LEFT, RIGHT].map((d, i) => (
            <circle key={d} r={4} fill={i ? 'rgb(var(--signal))' : 'rgb(var(--bk))'} style={{ filter: `drop-shadow(0 0 6px ${i ? 'rgb(var(--signal))' : 'rgb(var(--bk))'})` }}>
              <animateMotion dur="3.2s" begin={`${i * 1.6}s`} repeatCount="indefinite" path={`M${X} ${Y.phone} L${X} ${Y.ask} ${d.slice(d.indexOf('C'))} L${X} ${Y.booked}`} />
            </circle>
          ))}
        </g>
      )}

      <PathName x={(ARC_X.left + X) / 2 + 8} text={t(LABELS.up)} show={step >= 2} />
      <PathName x={(ARC_X.right + X) / 2 - 8} text={t(LABELS.down)} show={step >= 2} />

      <circle cx={X} cy={Y.phone} r={9} fill="rgb(var(--void))" stroke="white" strokeWidth={1.6} />
      <Note y={Y.phone} text={t(LABELS.phone)} show />
      <Note y={Y.ask - 30} text={flat(t(LABELS.ask), ' ')} show={step >= 1} />
      <Note y={Y.engine + 30} text={flat(t(LABELS.engine), ' · ')} show={step >= 4} />
      <Note y={Y.code} text={t(LABELS.code)} show={step >= 5} />
      <g style={{ opacity: step >= 5 ? 1 : 0, transition: 'opacity .5s' }}>
        <circle cx={X} cy={Y.booked} r={22} fill="rgb(var(--bk))" opacity={0.18} />
        <circle cx={X} cy={Y.booked} r={10} fill="rgb(var(--bk))" stroke="white" strokeWidth={1.6} />
        <text x={X + 30} y={Y.booked} dy="0.35em" fontSize={FONT.booked} className="fill-current">{t(LABELS.booked)}</text>
        <circle cx={X} cy={Y.booked} r={1} fill="none" data-fiber-from="bk-bocetos" />
      </g>

      {MARKS.map((m, i) => (
        <PrincipleMark key={i} x={X} y={MARK_Y[i]} index={i} on={step >= m.at} picked={picked === i} label={t(idea.principles[i].title)} onPick={onPick} fontSize={FONT.number} />
      ))}
    </svg>
  )
}

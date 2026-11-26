'use client'

import { useLocale, type L } from '@/lib/i18n'

/** Lienzo vertical: el concepto baja de arriba abajo */
const W = 340
const H = 600
const X = 170
const Y = { phone: 30, ask: 120, mid: 285, engine: 450, code: 520, booked: 578 }
const LEFT = `M${X} ${Y.ask} C14 205 14 365 ${X} ${Y.engine}`
const RIGHT = `M${X} ${Y.ask} C326 205 326 365 ${X} ${Y.engine}`
const ARC_X = { left: 53, right: 287 }
/** Cada principio sobre el concepto */
const MARK_Y = [Y.ask, Y.engine, Y.mid, Y.code]
/** Posición en % del lienzo, para el texto de verdad encima del dibujo */
const px = (x: number) => `${(x / W) * 100}%`
const py = (y: number) => `${(y / H) * 100}%`

interface IdeaPhoneProps {
  step: number
  done: boolean
  reducedMotion: boolean
  picked: number | null
  onPick: (i: number) => void
  labels: Record<'phone' | 'ask' | 'engine' | 'code' | 'booked' | 'up' | 'down', L>
  /** En qué paso aparece cada principio */
  marksAt: readonly number[]
  principles: readonly { title: L }[]
}

/**
 * La idea en el teléfono: el celular entra arriba, la pregunta lo abre en dos
 * caminos a los lados, se juntan en el motor y bajan al código y a la cita. El
 * dibujo no lleva letras: los nombres son texto de verdad puesto encima, y los
 * números de los principios son botones.
 */
export function IdeaPhone({ step, done, reducedMotion, picked, onPick, labels, marksAt, principles }: IdeaPhoneProps) {
  const { t } = useLocale()
  const draw = (on: boolean) => ({ pathLength: 1, strokeDasharray: '1', strokeDashoffset: on ? 0 : 1, style: { transition: 'stroke-dashoffset .6s cubic-bezier(.5,0,.3,1)' } })
  const fade = (on: boolean, delay = 0) => ({ opacity: on ? 1 : 0, transition: `opacity .5s ${delay}ms` })
  const line = (key: keyof typeof labels, sep: string) => t(labels[key]).replace('|', sep)
  const twoLines = (key: 'up' | 'down') => t(labels[key]).split(', ')

  return (
    <div className="relative mx-auto mt-8 w-full max-w-[360px]" style={{ aspectRatio: `${W} / ${H}` }} role="group" aria-label={t({ es: 'La idea: una pregunta, dos caminos, un motor', en: 'The idea: one question, two paths, one engine' })}>
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
        <line x1={X} y1={Y.phone} x2={X} y2={Y.ask} stroke="white" strokeOpacity={0.35} strokeWidth={1.4} {...draw(step >= 1)} />
        <path d={LEFT} fill="none" stroke="rgb(var(--bk))" strokeWidth={2} {...draw(step >= 2)} />
        <path d={RIGHT} fill="none" stroke="rgb(var(--signal))" strokeWidth={2} {...draw(step >= 2)} />
        <line x1={ARC_X.left} y1={Y.mid} x2={ARC_X.right} y2={Y.mid} stroke="white" strokeOpacity={0.25} strokeDasharray="3 6" style={fade(step >= 3)} />
        <line x1={X} y1={Y.engine} x2={X} y2={Y.booked} stroke="white" strokeOpacity={0.35} strokeWidth={1.4} {...draw(step >= 4)} />
        {done && !reducedMotion &&
          [LEFT, RIGHT].map((d, i) => (
            <circle key={d} r={4} fill={i ? 'rgb(var(--signal))' : 'rgb(var(--bk))'} style={{ filter: `drop-shadow(0 0 6px ${i ? 'rgb(var(--signal))' : 'rgb(var(--bk))'})` }}>
              <animateMotion dur="3.2s" begin={`${i * 1.6}s`} repeatCount="indefinite" path={`M${X} ${Y.phone} L${X} ${Y.ask} ${d.slice(d.indexOf('C'))} L${X} ${Y.booked}`} />
            </circle>
          ))}
        <circle cx={X} cy={Y.phone} r={9} fill="rgb(var(--void))" stroke="white" strokeWidth={1.6} />
        <g style={fade(step >= 5)}>
          <circle cx={X} cy={Y.booked} r={22} fill="rgb(var(--bk))" opacity={0.18} />
          <circle cx={X} cy={Y.booked} r={10} fill="rgb(var(--bk))" stroke="white" strokeWidth={1.6} style={{ filter: 'drop-shadow(0 0 8px rgb(var(--bk) / 0.7))' }} />
          <circle cx={X} cy={Y.booked} r={1} fill="none" data-fiber-from="bk-bocetos" />
        </g>
      </svg>

      {/* Notas en mono, a la derecha de la línea central */}
      {(
        [
          { y: Y.phone, text: t(labels.phone), on: true },
          { y: Y.ask - 30, text: line('ask', ' '), on: step >= 1 },
          { y: Y.engine + 32, text: line('engine', ' · '), on: step >= 4 },
          { y: Y.code, text: t(labels.code), on: step >= 5 },
        ] as const
      ).map((n) => (
        <p key={n.text} className="absolute -translate-y-1/2 whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.1em] text-paper/60" style={{ left: px(X + 28), top: py(n.y), ...fade(n.on) }}>
          {n.text}
        </p>
      ))}
      <p className="absolute -translate-y-1/2 text-[17px] leading-none" style={{ left: px(X + 32), top: py(Y.booked), ...fade(step >= 5) }}>{t(labels.booked)}</p>

      {/* Los nombres de los caminos, cada uno dentro de su lado */}
      {(['up', 'down'] as const).map((k, i) => {
        const [a, b] = twoLines(k)
        return (
          <p key={k} className="absolute w-[34%] -translate-x-1/2 text-center text-[14px] leading-snug" style={{ left: px(i ? (ARC_X.right + X) / 2 : (ARC_X.left + X) / 2), top: py(Y.mid - 58), ...fade(step >= 2, 200) }}>
            {b ? `${a},` : a}
            {b && <br />}
            {b}
          </p>
        )
      })}

      {/* Los principios: tocarlos muestra su porqué */}
      {marksAt.map((at, i) => {
        const on = step >= at
        const isPicked = picked === i
        return (
          <button
            key={i}
            type="button"
            tabIndex={on ? 0 : -1}
            aria-pressed={isPicked}
            aria-label={t(principles[i].title)}
            onClick={() => onPick(i)}
            className="absolute grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border font-mono text-[13px] outline-none transition-[background-color,box-shadow,opacity] duration-300"
            style={{
              left: px(X),
              top: py(MARK_Y[i]),
              opacity: on ? 1 : 0,
              pointerEvents: on ? 'auto' : 'none',
              borderColor: 'rgb(var(--bk))',
              backgroundColor: isPicked ? 'rgb(var(--bk))' : 'rgb(var(--void))',
              color: isPicked ? '#14110b' : 'rgb(var(--bk))',
              boxShadow: isPicked ? '0 0 0 6px rgb(var(--bk) / 0.18), 0 0 16px rgb(var(--bk) / 0.6)' : 'none',
            }}
          >
            0{i + 1}
          </button>
        )
      })}
    </div>
  )
}

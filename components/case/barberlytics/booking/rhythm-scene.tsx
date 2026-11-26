'use client'

import { useState } from 'react'
import { useLocale, type L } from '@/lib/i18n'
import { BOOKING_CASE } from '@/lib/content/cases/barberlytics/booking-case'
import { BookingLede } from './booking-lede'
import { useAutoSteps } from './use-auto-steps'
import { useNarrow } from '../use-narrow'

/** Lienzo: doce semanas de izquierda a derecha y tres filas, una por hallazgo */
const W = 900
const H = 300
const X0 = 210
const X1 = 870
const WEEKS = 12
const ROW_Y = [60, 150, 240]
const wx = (w: number) => X0 + ((X1 - X0) * w) / (WEEKS - 1)
/** Ritmo de ejemplo de quien vuelve: cada tres semanas */
const VISITS = [0, 3, 6, 9]
/** Se arma solo: pausa corta, luego un paso por visita y uno por cada fila (ms) */
const AUTO = { intro: 500, step: 260 }
/** Pasos: 1–4 visitas de quien vuelve, 5 quien llega, 6 lo que faltaba, 7 cifras */
const LAST = VISITS.length + 3

const ROWS: readonly L[] = [
  { es: 'Quien vuelve', en: 'Returning' },
  { es: 'Quien llega', en: 'New' },
  { es: 'Recordatorios', en: 'Reminders' },
]

/** Arco de una visita a la siguiente: el salto de «lo de siempre» */
const hop = (a: number, b: number) => `M${wx(a)} ${ROW_Y[0]} Q${(wx(a) + wx(b)) / 2} ${ROW_Y[0] - 46} ${wx(b)} ${ROW_Y[0]}`

/**
 * 01 · Los puntos, como el ritmo de una barbería en doce semanas: quien vuelve
 * salta de visita en visita al mismo ritmo, quien llega cae en la primera hora
 * libre, y debajo de cada visita, el recordatorio que nunca salía. Tocar una
 * fila muestra el hallazgo; de la última sale la fibra hacia «Patrones».
 */
export function RhythmScene() {
  const { t } = useLocale()
  const { dots } = BOOKING_CASE
  const { ref, step, done } = useAutoSteps<HTMLDivElement>(LAST, AUTO)
  const [picked, setPicked] = useState<number | null>(null)

  const visitsOn = Math.min(step, VISITS.length)
  const newOn = step > VISITS.length
  const remindersOn = step > VISITS.length + 1
  const caption =
    picked !== null
      ? { tag: `0${picked + 1} · ${t(ROWS[picked])}`, title: t(dots.seen[picked].title), sub: t(dots.seen[picked].body) }
      : { tag: t({ es: 'Lo que vi', en: 'What I saw' }), title: t(dots.kicker), sub: t({ es: 'La reserva no habla con la barbería: habla con su cliente. Y ese cliente quiere lo de siempre, o la primera hora libre.', en: 'Booking doesn’t talk to the shop: it talks to its client. And that client wants the usual, or the first free slot.' }) }

  const narrow = useNarrow()
  const notes: readonly { row: number; text: L; on: boolean }[] = [
    { row: 0, text: { es: 'mismo corte · mismo barbero', en: 'same cut · same barber' }, on: visitsOn > 1 },
    { row: 1, text: { es: 'la primera hora libre', en: 'the first free slot' }, on: newOn },
    { row: 2, text: { es: '0 enviados', en: '0 sent' }, on: remindersOn },
  ]
  const toggle = (i: number) => setPicked((p) => (p === i ? null : i))

  return (
    <div ref={ref} className="flex flex-col items-center">
      <BookingLede tag={caption.tag} title={caption.title} sub={caption.sub} swapKey={picked ?? 'all'} />

      <svg viewBox={`0 0 ${W} ${H}`} className="mt-8 block h-auto max-h-[46vh] w-full max-w-[900px] overflow-visible" role="group" aria-label={t({ es: 'Doce semanas de una barbería', en: 'Twelve weeks at a barbershop' })}>
        {/* Las semanas: marcas tenues */}
        {Array.from({ length: WEEKS }, (_, w) => (
          <line key={w} x1={wx(w)} x2={wx(w)} y1={24} y2={H - 16} stroke="white" strokeOpacity={0.05} />
        ))}
        {!narrow && (
          <>
        <text x={X0} y={H + 8} className="bk-t-axis fill-current font-mono uppercase opacity-40" letterSpacing="0.14em">{t({ es: 'Hoy', en: 'Today' })}</text>
        <text x={X1} y={H + 8} textAnchor="end" className="bk-t-axis fill-current font-mono uppercase opacity-40" letterSpacing="0.14em">{t({ es: '12 semanas', en: '12 weeks' })}</text>
          </>
        )}

        {/* Las filas: tocarlas muestra el hallazgo */}
        {ROWS.map((row, i) => {
          const isPicked = picked === i
          return (
            <g
              key={row.es}
              role="button"
              tabIndex={0}
              aria-pressed={isPicked}
              aria-label={t(dots.seen[i].title)}
              onClick={() => toggle(i)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  toggle(i)
                }
              }}
              className="cursor-pointer outline-none"
            >
              <rect x={0} y={ROW_Y[i] - 40} width={W} height={80} fill={isPicked ? 'rgb(var(--bk) / 0.05)' : 'transparent'} rx={40} style={{ transition: 'fill .4s' }} />
              <line x1={X0} x2={X1} y1={ROW_Y[i]} y2={ROW_Y[i]} stroke="white" strokeOpacity={isPicked ? 0.25 : 0.1} strokeDasharray={i === 2 ? '3 6' : undefined} />
              <text x={X0 - 34} y={ROW_Y[i]} dy="0.35em" textAnchor="end" className="bk-t-row fill-current" style={{ opacity: isPicked ? 1 : 0.75 }}>{t(row)}</text>
            </g>
          )
        })}

        {/* Quien vuelve: salta de visita en visita, al mismo ritmo */}
        {VISITS.slice(1).map((v, i) => (
          <path key={`hop-${v}`} d={hop(VISITS[i], v)} fill="none" stroke="rgb(var(--bk))" strokeWidth={1.8} strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={visitsOn > i + 1 ? 0 : 1} style={{ transition: `stroke-dashoffset ${AUTO.step}ms ease-out`, filter: 'drop-shadow(0 0 4px rgb(var(--bk) / 0.6))' }} />
        ))}
        {VISITS.map((v, i) => {
          const on = visitsOn > i
          return (
            <g key={`visit-${v}`} transform={`translate(${wx(v)} ${ROW_Y[0]})`} className="pointer-events-none">
              <circle r={18} fill="rgb(var(--bk))" opacity={on ? 0.16 : 0} style={{ transition: 'opacity .4s' }} />
              <circle r={7} fill={on ? 'rgb(var(--bk))' : 'rgb(var(--void))'} stroke={on ? 'white' : 'rgb(255 255 255 / 0.3)'} strokeWidth={1.4} style={{ transition: 'fill .4s, stroke .4s' }} />
            </g>
          )
        })}
        {visitsOn > 1 && !narrow && (
          <text x={(wx(0) + wx(3)) / 2} y={ROW_Y[0] - 32} textAnchor="middle" className="bk-t-note bk-fade pointer-events-none fill-current font-mono uppercase opacity-55" letterSpacing="0.12em">
            {t({ es: 'mismo corte · mismo barbero', en: 'same cut · same barber' })}
          </text>
        )}

        {/* Quien llega: no busca barbero, cae en la primera hora libre */}
        <g className="pointer-events-none" style={{ opacity: newOn ? 1 : 0, transform: `translateX(${newOn ? 0 : 60}px)`, transition: 'opacity .5s, transform .6s cubic-bezier(.16,1,.3,1)' }}>
          <circle cx={wx(0)} cy={ROW_Y[1]} r={18} fill="rgb(var(--signal))" opacity={0.16} />
          <circle cx={wx(0)} cy={ROW_Y[1]} r={7} fill="rgb(var(--signal))" stroke="white" strokeWidth={1.4} />
          {!narrow && (
            <text x={wx(0) + 22} y={ROW_Y[1]} dy="0.35em" className="bk-t-note fill-current font-mono uppercase opacity-55" letterSpacing="0.12em">
              {t({ es: '← la primera hora libre', en: '← the first free slot' })}
            </text>
          )}
        </g>

        {/* Recordatorios: uno por visita, y ninguno salía de verdad */}
        {VISITS.map((v, i) => (
          <g key={`rem-${v}`} className="pointer-events-none" style={{ opacity: remindersOn ? 1 : 0, transition: `opacity .4s ${i * 80}ms` }}>
            <line x1={wx(v)} x2={wx(v)} y1={ROW_Y[0] + 12} y2={ROW_Y[2] - 12} stroke="white" strokeOpacity={0.12} strokeDasharray="2 5" />
            <circle cx={wx(v)} cy={ROW_Y[2]} r={7} fill="rgb(var(--void))" stroke="rgb(255 255 255 / 0.45)" strokeWidth={1.4} strokeDasharray="3 3" />
          </g>
        ))}
        {remindersOn && !narrow && (
          <text x={wx(VISITS[VISITS.length - 1]) + 24} y={ROW_Y[2]} dy="0.35em" className="bk-t-note bk-fade pointer-events-none fill-current font-mono uppercase opacity-55" letterSpacing="0.12em">
            {t({ es: '0 enviados', en: '0 sent' })}
          </text>
        )}
        {/* De aquí, el final del ritmo, sale la fibra hacia «Patrones» */}
        <circle cx={X1} cy={ROW_Y[2]} r={1} fill="none" data-fiber-from="bk-patrones" />
      </svg>

      {/* En el teléfono, el eje y las notas salen del dibujo y se leen a tamaño real */}
      {narrow && (
        <div className="mt-3 w-full">
          <p className="flex justify-between pl-[23%] font-mono text-[11px] uppercase tracking-[0.1em] text-paper/45">
            <span>{t({ es: 'Hoy', en: 'Today' })}</span>
            <span>{t({ es: '12 semanas', en: '12 weeks' })}</span>
          </p>
          <ul className="mt-5 space-y-2">
            {notes.map((n) => (
              <li key={n.row} className="flex items-baseline gap-3 text-[13px] transition-opacity duration-500" style={{ opacity: n.on ? 1 : 0.15 }}>
                <span className="w-28 shrink-0 text-paper/55">{t(ROWS[n.row])}</span>
                <span className="font-mono text-[12px] uppercase tracking-[0.06em] text-[rgb(var(--bk))]">{t(n.text)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Ya armado: las cifras del punto de partida */}
      <dl className={`mt-10 grid w-full max-w-[760px] grid-cols-2 gap-6 transition-all duration-700 ease-expo sm:grid-cols-4 ${done ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}>
        {dots.stats.map((s) => (
          <div key={s.label.es} className="text-center">
            <dt className="sr-only">{t(s.label)}</dt>
            <dd>
              <span className="block text-[clamp(1.8rem,1.3rem+1.6vw,2.8rem)] font-light leading-none text-[rgb(var(--bk))] tabular-nums">{s.value}</span>
              <span className="mt-2 block text-balance text-[11px] leading-snug text-paper/50">{t(s.label)}</span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

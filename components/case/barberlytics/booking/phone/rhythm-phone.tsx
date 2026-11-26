'use client'

import { useLocale, type L } from '@/lib/i18n'

/** Lienzo vertical: tres carriles (uno por hallazgo) y las doce semanas bajando */
const W = 340
const WEEKS = 12
const TOP = 18
const ROW = 24
const H = TOP * 2 + ROW * (WEEKS - 1)
const LANE_X = [W / 6, W / 2, (W * 5) / 6]
const wy = (w: number) => TOP + ROW * w

interface RhythmPhoneProps {
  rows: readonly L[]
  visits: readonly number[]
  /** Visitas ya dibujadas, quien llega y los recordatorios, según el paso */
  visitsOn: number
  newOn: boolean
  remindersOn: boolean
  stepMs: number
  picked: number | null
  onPick: (i: number) => void
}

/** Lo que se lee bajo cada carril cuando aparece */
const NOTES: readonly L[] = [
  { es: 'mismo corte · mismo barbero', en: 'same cut · same barber' },
  { es: 'la primera hora libre', en: 'the first free slot' },
  { es: '0 enviados', en: '0 sent' },
]

/**
 * Los puntos en el teléfono: las doce semanas bajan de arriba abajo en tres
 * carriles. Quien vuelve salta de visita en visita, quien llega cae arriba, en
 * la primera hora libre, y los recordatorios esperan al lado sin salir nunca.
 * Los nombres y las notas son texto de verdad, encima y debajo del dibujo.
 */
export function RhythmPhone({ rows, visits, visitsOn, newOn, remindersOn, stepMs, picked, onPick }: RhythmPhoneProps) {
  const { t } = useLocale()
  const lit = [visitsOn > 1, newOn, remindersOn]
  const hop = (a: number, b: number) => `M${LANE_X[0]} ${wy(a)} Q${LANE_X[0] - 34} ${(wy(a) + wy(b)) / 2} ${LANE_X[0]} ${wy(b)}`

  return (
    <div className="mt-8 w-full max-w-[380px]">
      {/* Los carriles: tocarlos muestra el hallazgo */}
      <div className="grid grid-cols-3 gap-2">
        {rows.map((row, i) => (
          <button
            key={row.es}
            type="button"
            aria-pressed={picked === i}
            onClick={() => onPick(i)}
            className={`rounded-full border px-2 py-1.5 text-[13px] leading-tight transition-colors duration-300 ${picked === i ? 'border-[rgb(var(--bk))] bg-[rgb(var(--bk)/0.12)] text-paper' : 'border-white/12 text-paper/70'}`}
          >
            {t(row)}
          </button>
        ))}
      </div>

      <div className="relative mt-3">
        <p aria-hidden="true" className="absolute -left-1 top-0 -translate-y-1/2 font-mono text-[11px] uppercase tracking-[0.1em] text-paper/40">{t({ es: 'Hoy', en: 'Today' })}</p>
        <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full overflow-visible" role="img" aria-label={t({ es: 'Doce semanas de una barbería, de arriba abajo', en: 'Twelve weeks at a barbershop, top to bottom' })}>
          {/* El carril elegido se ilumina */}
          {picked !== null && <rect x={LANE_X[picked] - 50} y={4} width={100} height={H - 8} rx={50} fill="rgb(var(--bk) / 0.06)" />}
          {/* Las semanas: marcas tenues de lado a lado */}
          {Array.from({ length: WEEKS }, (_, w) => (
            <line key={w} x1={20} x2={W - 20} y1={wy(w)} y2={wy(w)} stroke="white" strokeOpacity={0.05} />
          ))}
          {LANE_X.map((x, i) => (
            <line key={x} x1={x} x2={x} y1={TOP - 8} y2={H - TOP + 8} stroke="white" strokeOpacity={picked === i ? 0.3 : 0.12} strokeDasharray={i === 2 ? '3 6' : undefined} />
          ))}

          {/* Recordatorios: uno por visita, del carril de quien vuelve al suyo, y ninguno salía */}
          {visits.map((v, i) => (
            <g key={`rem-${v}`} style={{ opacity: remindersOn ? 1 : 0, transition: `opacity .4s ${i * 80}ms` }}>
              <line x1={LANE_X[0] + 12} x2={LANE_X[2] - 12} y1={wy(v)} y2={wy(v)} stroke="white" strokeOpacity={0.14} strokeDasharray="2 5" />
              <circle cx={LANE_X[2]} cy={wy(v)} r={7} fill="rgb(var(--void))" stroke="rgb(255 255 255 / 0.45)" strokeWidth={1.4} strokeDasharray="3 3" />
            </g>
          ))}

          {/* Quien vuelve: salta de visita en visita, al mismo ritmo */}
          {visits.slice(1).map((v, i) => (
            <path key={`hop-${v}`} d={hop(visits[i], v)} fill="none" stroke="rgb(var(--bk))" strokeWidth={1.8} strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={visitsOn > i + 1 ? 0 : 1} style={{ transition: `stroke-dashoffset ${stepMs}ms ease-out`, filter: 'drop-shadow(0 0 4px rgb(var(--bk) / 0.6))' }} />
          ))}
          {visits.map((v, i) => {
            const on = visitsOn > i
            return (
              <g key={`visit-${v}`} transform={`translate(${LANE_X[0]} ${wy(v)})`}>
                <circle r={16} fill="rgb(var(--bk))" opacity={on ? 0.16 : 0} style={{ transition: 'opacity .4s' }} />
                <circle r={7} fill={on ? 'rgb(var(--bk))' : 'rgb(var(--void))'} stroke={on ? 'white' : 'rgb(255 255 255 / 0.3)'} strokeWidth={1.4} style={{ transition: 'fill .4s, stroke .4s' }} />
              </g>
            )
          })}

          {/* Quien llega: cae arriba, en la primera hora libre */}
          <g style={{ opacity: newOn ? 1 : 0, transform: `translateY(${newOn ? 0 : -30}px)`, transition: 'opacity .5s, transform .6s cubic-bezier(.16,1,.3,1)' }}>
            <circle cx={LANE_X[1]} cy={wy(0)} r={16} fill="rgb(var(--signal))" opacity={0.16} />
            <circle cx={LANE_X[1]} cy={wy(0)} r={7} fill="rgb(var(--signal))" stroke="white" strokeWidth={1.4} />
          </g>

          {/* Del final del último carril sale la fibra hacia «Patrones» */}
          <circle cx={LANE_X[2]} cy={H - TOP} r={1} fill="none" data-fiber-from="bk-patrones" />
        </svg>
        <p aria-hidden="true" className="absolute -left-1 bottom-0 translate-y-1/2 font-mono text-[11px] uppercase tracking-[0.1em] text-paper/40">{t({ es: '12 sem.', en: '12 wk' })}</p>
      </div>

      {/* Lo que dice cada carril, debajo de él */}
      <div className="mt-6 grid grid-cols-3 gap-2 text-center">
        {NOTES.map((n, i) => (
          <p key={n.es} className="font-mono text-[11px] uppercase leading-snug tracking-[0.06em] text-[rgb(var(--bk))] transition-opacity duration-500" style={{ opacity: lit[i] ? 0.9 : 0 }}>
            {t(n)}
          </p>
        ))}
      </div>
    </div>
  )
}

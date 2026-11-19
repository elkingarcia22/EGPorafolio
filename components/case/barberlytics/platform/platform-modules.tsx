'use client'

import { useLocale, type L } from '@/lib/i18n'
import { useTick } from '../thema/live-pieces'

/** Fases del ciclo: 0 cobra; 1–4 se encienden los módulos; 5–6 todo quedó al día. */
const PHASES = 7

interface Module {
  name: L
  icon: string
  /** Lo que cambia en el módulo, antes y después del cobro */
  rows: readonly { label: L; before: string; after: string }[]
  note: L
}

const MODULES: readonly Module[] = [
  {
    name: { es: 'Clientes', en: 'Clients' },
    icon: '◎',
    rows: [
      { label: { es: 'Mariana Ramírez', en: 'Mariana Ramírez' }, before: 'En riesgo', after: 'Retenida' },
      { label: { es: 'Visitas', en: 'Visits' }, before: '7', after: '8' },
    ],
    note: { es: 'Su segmento sale de las visitas: nadie la marca a mano.', en: 'Her segment comes from visits: nobody tags it by hand.' },
  },
  {
    name: { es: 'Equipo', en: 'Team' },
    icon: '◐',
    rows: [
      { label: { es: 'Ocupación de Andrés', en: 'Andrés’s occupancy' }, before: '58 %', after: '64 %' },
      { label: { es: 'Su comisión de hoy', en: 'His commission today' }, before: 'US$ 23', after: 'US$ 53' },
    ],
    note: { es: 'La silla y lo que lleva el barbero, al momento.', en: 'The chair and what the barber has made, instantly.' },
  },
  {
    name: { es: 'Servicios', en: 'Services' },
    icon: '✂',
    rows: [
      { label: { es: 'Corte + barba este mes', en: 'Cut + beard this month' }, before: '14', after: '15' },
      { label: { es: 'Margen', en: 'Margin' }, before: '62 %', after: '62 %' },
    ],
    note: { es: 'Qué se vende y cuánto deja cada servicio.', en: 'What sells and what each service earns.' },
  },
  {
    name: { es: 'Productos', en: 'Products' },
    icon: '▣',
    rows: [
      { label: { es: 'Cera mate · stock', en: 'Matte wax · stock' }, before: '8', after: '7' },
      { label: { es: 'Vendida en el cobro', en: 'Sold at checkout' }, before: '—', after: '+1' },
    ],
    note: { es: 'Lo vendido en el cobro descuenta del inventario.', en: 'What’s sold at checkout comes off the stock.' },
  },
]

function Tile({ m, on }: { m: Module; on: boolean }) {
  const { t } = useLocale()
  return (
    <div className={`relative rounded-2xl border p-5 transition-all duration-700 ${on ? 'border-[#d9b36a]/70 bg-[#d9b36a]/[0.08] shadow-[0_0_50px_-14px_rgba(217,179,106,0.8)]' : 'border-white/10 bg-white/[0.02]'}`}>
      <div className="flex items-center gap-2">
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm transition-colors duration-700 ${on ? 'bg-[#d9b36a] text-[#16130f]' : 'bg-white/[0.06] text-white/60'}`}>{m.icon}</span>
        <span className="font-medium">{t(m.name)}</span>
        {on && <span className="ml-auto animate-[ramp-in_0.5s_cubic-bezier(0.16,1,0.3,1)_both] rounded-full bg-[#4cc98d]/15 px-2 py-0.5 text-[10px] text-[#4cc98d]">{t({ es: 'actualizado', en: 'updated' })}</span>}
      </div>
      <dl className="mt-4 space-y-2 text-sm">
        {m.rows.map((r) => (
          <div key={r.label.es} className="flex items-baseline justify-between gap-3">
            <dt className="truncate text-white/55">{t(r.label)}</dt>
            <dd className="relative h-5 min-w-[5rem] overflow-hidden text-right font-mono tabular-nums">
              <span className={`absolute right-0 transition-all duration-500 ${on ? '-translate-y-5 opacity-0' : 'translate-y-0 opacity-100'}`}>{r.before}</span>
              <span className={`absolute right-0 text-[#e9c27a] transition-all duration-500 ${on ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>{r.after}</span>
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-[11px] leading-snug text-white/40">{t(m.note)}</p>
    </div>
  )
}

/** 5.6 · Una cita cobrada alimenta, en cadena, a clientes, equipo, servicios y productos. */
export function ModulesRipple() {
  const { t } = useLocale()
  const tick = useTick(1000)
  const phase = tick % PHASES
  const paid = phase >= 1
  return (
    <div data-reveal="device" className="relative overflow-hidden rounded-3xl bg-[#0f0d0b] p-5 text-[#efe9dd] md:p-8">
      <span className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d9b36a] opacity-[0.12] blur-3xl" aria-hidden="true" />
      <div className="relative grid items-center gap-5 lg:grid-cols-[1fr_minmax(0,260px)_1fr]">
        <div className="space-y-5">
          <Tile m={MODULES[0]} on={phase >= 1 && phase <= 6} />
          <Tile m={MODULES[1]} on={phase >= 2 && phase <= 6} />
        </div>

        {/* La cita que se cobra, en el centro */}
        <div className="relative mx-auto w-full max-w-[260px]">
          <svg viewBox="0 0 260 260" className="pointer-events-none absolute inset-0 -z-0 hidden h-full w-full overflow-visible lg:block" aria-hidden="true">
            {[
              'M30 70 L-60 10',
              'M30 190 L-60 250',
              'M230 70 L320 10',
              'M230 190 L320 250',
            ].map((d, i) => (
              <path key={d} d={d} fill="none" stroke={phase > i ? '#d9b36a' : 'rgba(255,255,255,0.12)'} strokeWidth="1.5" strokeDasharray="5 6" className={phase > i ? 'animate-[dash-run_1s_linear_infinite]' : ''} />
            ))}
          </svg>
          <div className="relative rounded-2xl p-5 transition-all duration-700" style={{ background: paid ? '#4cc98d24' : '#e0b44a24', boxShadow: `inset 0 0 0 1.5px ${paid ? '#4cc98d' : '#e0b44a'}, 0 30px 70px -30px ${paid ? '#4cc98d' : '#e0b44a'}` }}>
            <p className="mono-label text-white/45">{t({ es: 'Calendario · 1:30', en: 'Calendar · 1:30' })}</p>
            <p className="mt-3 text-lg font-medium">Mariana Ramírez</p>
            <p className="text-sm text-white/55">Corte + barba + cera mate</p>
            <p className="mt-1 text-xs text-white/40">{t({ es: 'con Andrés', en: 'with Andrés' })}</p>
            <div className="mt-5 flex items-center justify-between">
              <span className="font-mono text-lg tabular-nums">US$ 74</span>
              <span key={String(paid)} className="animate-[ramp-in_0.5s_cubic-bezier(0.16,1,0.3,1)_both] rounded-lg px-3 py-1.5 text-sm font-semibold text-[#16130f]" style={{ background: paid ? '#4cc98d' : '#e0b44a' }}>
                {paid ? t({ es: '✓ Cobrada', en: '✓ Paid' }) : t({ es: 'Cobrar', en: 'Charge' })}
              </span>
            </div>
          </div>
          <p className="mt-4 text-center text-[11px] text-white/45">{t({ es: 'Un cobro. Cuatro módulos al día, sin escribir nada dos veces.', en: 'One charge. Four modules up to date, nothing typed twice.' })}</p>
        </div>

        <div className="space-y-5">
          <Tile m={MODULES[2]} on={phase >= 3 && phase <= 6} />
          <Tile m={MODULES[3]} on={phase >= 4 && phase <= 6} />
        </div>
      </div>
    </div>
  )
}

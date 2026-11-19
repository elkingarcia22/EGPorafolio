'use client'

import { useState } from 'react'
import { useLocale, type L } from '@/lib/i18n'
import { useStepper } from './forma-ui'
import {
  ALINEACION_AREA,
  ALINEACION_PROMEDIO,
  APROBACION,
  AVANCE_AREA,
  CICLO,
  DEVUELTOS_LIDER,
  EN_RACHA,
  PARTICIPACION,
  PERIODOS,
  PESO_EMPRESA,
  PODIO,
  PRONOSTICO,
  fmt,
} from './ciclo-real'

const PRIMARY = '#0c5bef'
const WARNING = '#f79009'
const SUCCESS = '#17b26a'
const DESTRUCTIVE = '#d92d20'
const MUTED = 'rgba(22,26,44,0.45)'
const STEP_MS = 5200

const draw = 'obj-draw'
const rise = 'animate-[ramp-in_0.7s_cubic-bezier(0.16,1,0.3,1)_both]'
const later = (i: number) => ({ animationDelay: `${120 + i * 90}ms` })

/* ── Los gráficos: los mismos de la plataforma, con sus cifras del staging ── */

/** LineaPronostico: avance real, lo esperado y adónde llega a este ritmo. */
function Pronostico() {
  const { avance, calendario, alCierre } = PRONOSTICO
  const W = 320
  const H = 150
  const x = (t: number) => 36 + (t / 100) * (W - 48)
  const y = (v: number) => H - 18 - (v / 100) * (H - 30)
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full overflow-visible" role="img" aria-label={`Avance ${avance} % con ${calendario} % del calendario corrido; al ritmo actual cierra en ${alCierre} %`}>
        {[0, 25, 50, 75, 100].map((v) => (
          <g key={v}>
            <line x1={36} x2={W - 12} y1={y(v)} y2={y(v)} stroke="rgba(22,26,44,0.08)" strokeDasharray="3 3" />
            <text x={30} y={y(v) + 3} textAnchor="end" fontSize={8} fill={MUTED} className="max-md:text-[14px]">{v} %</text>
          </g>
        ))}
        <line x1={36} x2={W - 12} y1={y(100)} y2={y(100)} stroke={SUCCESS} strokeDasharray="4 4" />
        <line x1={x(calendario)} x2={x(calendario)} y1={y(100)} y2={y(0)} stroke={MUTED} strokeOpacity={0.5} />
        <path d={`M${x(0)} ${y(0)} L${x(100)} ${y(100)}`} fill="none" stroke={MUTED} strokeDasharray="4 4" strokeWidth={1.5} />
        <path d={`M${x(0)} ${y(0)} L${x(calendario)} ${y(avance)}`} fill="none" stroke={PRIMARY} strokeWidth={3} strokeLinecap="round" pathLength={1} strokeDasharray={1} className={draw} />
        <path d={`M${x(calendario)} ${y(avance)} L${x(100)} ${y(alCierre)}`} fill="none" stroke={PRIMARY} strokeOpacity={0.5} strokeWidth={2} strokeDasharray="6 4" className={rise} style={later(4)} />
        <circle cx={x(100)} cy={y(alCierre)} r={4} fill={PRIMARY} className={rise} style={later(6)} />
        {['Inicio', 'Hoy', 'Cierre'].map((label, i) => (
          <text key={label} x={x([0, calendario, 100][i])} y={H - 4} textAnchor="middle" fontSize={8} fill={MUTED} className="max-md:translate-y-[9px] max-md:text-[14px]">{label}</text>
        ))}
      </svg>
      <dl className="mt-2 grid grid-cols-3 gap-2 text-[11px]">
        {[
          ['Avance real', `${avance} %`, PRIMARY],
          ['Esperado', `${calendario} %`, MUTED],
          ['Al cierre, a este ritmo', `${alCierre} %`, 'rgba(12,91,239,0.55)'],
        ].map(([k, v, c], i) => (
          <div key={k} className={rise} style={later(i)}>
            <dt className="flex items-center gap-1.5 text-black/50"><span className="h-2 w-2 rounded-sm" style={{ background: c }} />{k}</dt>
            <dd className="mt-0.5 text-base font-medium tabular-nums">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

/** BarrasCalendario: el avance por área frente al calendario; quien va por detrás, en ámbar. */
function BarrasArea() {
  const tope = 30
  const cal = PRONOSTICO.calendario
  return (
    <div className="relative">
      <ul className="space-y-2">
        {AVANCE_AREA.map((a, i) => (
          <li key={a.area} className="grid grid-cols-[7.5rem_1fr_3rem] items-center gap-2 text-[11px]">
            <span className="truncate text-black/60">{a.area}</span>
            <span className="relative h-3.5">
              <span className="absolute inset-y-0 left-0 origin-left rounded-r-md obj-bar" style={{ width: `${(a.v / tope) * 100}%`, background: a.v < cal ? WARNING : PRIMARY, animationDelay: `${i * 90}ms` }} />
            </span>
            <span className="text-right font-medium tabular-nums">{fmt(a.v)}</span>
          </li>
        ))}
      </ul>
      <span className="pointer-events-none absolute -bottom-2 -top-5 border-l border-dashed border-black/50" style={{ left: `calc(7.5rem + 0.5rem + (100% - 7.5rem - 3rem - 1rem) * ${cal / tope})` }}>
        <span className="absolute -top-0.5 left-1 whitespace-nowrap text-[9px] max-lg:text-[11px] text-black/50">Calendario {cal} %</span>
      </span>
    </div>
  )
}

/** Peso por objetivo de empresa (barra apilada) y alineación por área (radar). */
function DondeSeJuega() {
  const colors = [PRIMARY, '#6b8cff', '#a9bcff', 'rgba(22,26,44,0.18)']
  const R = 54
  const C = 70
  const n = ALINEACION_AREA.length
  const pt = (i: number, v: number) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2
    return [C + Math.cos(a) * R * (v / 100), C + Math.sin(a) * R * (v / 100)]
  }
  const poly = ALINEACION_AREA.map((a, i) => pt(i, a.v).map((c) => c.toFixed(1)).join(',')).join(' ')
  return (
    <div className="grid gap-4">
      <div>
        <p className="mb-1.5 text-[11px] text-black/50">Peso por objetivo de empresa</p>
        <div className="flex h-4 overflow-hidden rounded-md">
          {PESO_EMPRESA.map((p, i) => (
            <span key={p.id} className="obj-bar h-full border-r border-white" style={{ width: `${p.v}%`, background: colors[i], animationDelay: `${i * 120}ms` }} />
          ))}
        </div>
        <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-[10px] max-lg:text-[11px]">
          {PESO_EMPRESA.map((p, i) => (
            <li key={p.id} className="flex items-center gap-1.5"><span className="h-2 w-2 shrink-0 rounded-sm" style={{ background: colors[i] }} /><span className="truncate text-black/60">{p.label}</span><b className="ml-auto whitespace-nowrap font-medium">{`${p.v}\u00a0%`}</b></li>
          ))}
        </ul>
      </div>
      <div className="grid grid-cols-[140px_1fr] items-center gap-2">
        <svg viewBox="0 0 140 140" className="h-auto w-full" role="img" aria-label={ALINEACION_AREA.map((a) => `${a.area} ${fmt(a.v)}`).join(', ')}>
          {[0.33, 0.66, 1].map((k) => (
            <polygon key={k} points={ALINEACION_AREA.map((_, i) => pt(i, 100 * k).join(',')).join(' ')} fill="none" stroke="rgba(22,26,44,0.1)" />
          ))}
          <polygon points={poly} fill="rgba(12,91,239,0.2)" stroke={PRIMARY} strokeWidth={2} className={rise} style={{ transformOrigin: '70px 70px' }} />
          {ALINEACION_AREA.map((a, i) => {
            const [px, py] = pt(i, a.v)
            return <circle key={a.area} cx={px} cy={py} r={2.5} fill={PRIMARY} />
          })}
        </svg>
        <div className="text-[10px] max-lg:text-[11px]">
          <p className="text-black/50">Alineación por área</p>
          <p className="text-[11px]">Promedio del ciclo: <b className="font-medium">{fmt(ALINEACION_PROMEDIO)}</b></p>
          <ul className="mt-1.5 space-y-0.5">
            {ALINEACION_AREA.map((a) => (
              <li key={a.area} className="flex justify-between gap-2"><span className="truncate text-black/55">{a.area}</span><span className="tabular-nums">{fmt(a.v)}</span></li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

/** Aprobación por estado y devueltos sin corregir por líder. */
function QueHacer() {
  const max = 260
  const colors = [SUCCESS, WARNING, DESTRUCTIVE]
  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)]">
      <div>
        <p className="mb-1.5 text-[11px] text-black/50">Aprobación</p>
        <div className="flex h-28 items-end gap-3 border-b border-black/10 px-2">
          {APROBACION.map((a, i) => (
            <div key={a.id} className="flex flex-1 flex-col items-center">
              <span className="mb-1 text-[11px] font-medium tabular-nums">{a.v}</span>
              <span className="w-full origin-bottom rounded-t-md animate-[ramp-in_0.8s_cubic-bezier(0.16,1,0.3,1)_both]" style={{ height: `${Math.max(4, (a.v / max) * 88)}px`, background: colors[i], animationDelay: `${i * 120}ms` }} />
            </div>
          ))}
        </div>
        <div className="mt-1 flex gap-3 px-2 text-center text-[10px] max-lg:text-[11px] text-black/55">
          {APROBACION.map((a) => <span key={a.id} className="flex-1">{a.label}</span>)}
        </div>
      </div>
      <div>
        <p className="mb-1.5 text-[11px] text-black/50">Devueltos sin corregir, por líder</p>
        <ul className="space-y-2 text-[11px]">
          {DEVUELTOS_LIDER.map((d, i) => (
            <li key={d.lider} className={rise} style={later(i)}>
              <span className="flex justify-between"><span>{d.lider}</span><span className="tabular-nums">{fmt(d.v)}</span></span>
              <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-black/[0.06]">
                <span className="obj-bar block h-full rounded-full" style={{ width: `${d.v}%`, background: PRIMARY, animationDelay: `${200 + i * 100}ms` }} />
              </span>
              <span className="text-[10px] max-lg:text-[11px] text-black/45">{d.objetivos} objetivos</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/** Ranking: participación semanal, podio por área y rachas. */
function QuienReporta() {
  return (
    <div className="grid gap-4 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
      <div>
        <p className="mb-1.5 text-[11px] text-black/50">Participación de las últimas 8 semanas</p>
        <div className="flex h-28 items-end gap-1.5 border-b border-black/10">
          {PARTICIPACION.map((p, i) => (
            <div key={p.semana} className="flex flex-1 flex-col items-center justify-end">
              {p.v > 0 && <span className="mb-1 text-[9px] max-lg:text-[11px] tabular-nums text-black/60">{p.v} %</span>}
              <span className="w-full origin-bottom rounded-t animate-[ramp-in_0.8s_cubic-bezier(0.16,1,0.3,1)_both]" style={{ height: `${Math.max(2, (p.v / 80) * 96)}px`, background: p.semana === 'Esta' ? PRIMARY : p.v ? '#6b8cff' : 'rgba(22,26,44,0.1)', animationDelay: `${i * 70}ms` }} />
            </div>
          ))}
        </div>
        <div className="mt-1 flex gap-1.5 text-center text-[8px] max-lg:text-[11px] text-black/45">
          {PARTICIPACION.map((p) => (
            <span key={p.semana} className="flex-1 truncate max-md:flex max-md:flex-col max-md:items-center max-md:leading-tight">
              {p.semana.split(' ').map((w, i) => <span key={w}>{i ? ' ' : ''}{w}</span>)}
            </span>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-1.5 text-[11px] text-black/50">Top por área</p>
        <div className="flex items-end justify-center gap-1.5">
          {PODIO.map((p, i) => (
            <div key={p.area} className="w-[30%] text-center text-[10px] max-lg:text-[11px]">
              <p className="truncate font-medium">{p.area}</p>
              <p className="text-black/50">{fmt(p.v)}</p>
              <div className="mt-1 grid origin-bottom place-items-center rounded-t-md text-white animate-[ramp-in_0.8s_cubic-bezier(0.16,1,0.3,1)_both]" style={{ height: [52, 72, 38][i], background: p.lugar === 1 ? PRIMARY : '#6b8cff', animationDelay: `${300 + i * 100}ms` }}>{p.lugar}</div>
            </div>
          ))}
        </div>
        <p className={`${rise} mt-3 rounded-lg bg-[#0c5bef]/10 px-3 py-2 text-[11px] text-[#0c5bef]`} style={later(5)}>🔥 En racha: {EN_RACHA} personas · 3 semanas o más</p>
      </div>
    </div>
  )
}

/* ── La lectura: cinco preguntas, cada una con su bloque ── */

interface Question {
  id: string
  ask: L
  block: string
  /** Lo que dice la plataforma debajo del título del bloque. */
  says: string
  area: string
  Chart: () => JSX.Element
}

const QUESTIONS: readonly Question[] = [
  { id: 'como', ask: { es: '¿Cómo va?', en: 'How is it going?' }, block: 'Cómo va', says: PRONOSTICO.lectura, area: 'lg:col-span-3', Chart: Pronostico },
  { id: 'donde', ask: { es: '¿Dónde mirar?', en: 'Where to look?' }, block: 'Dónde mirar', says: 'Los grupos por área que se quedan atrás frente al calendario.', area: 'lg:col-span-3', Chart: BarrasArea },
  { id: 'juega', ask: { es: '¿Dónde se juega?', en: 'Where is it played?' }, block: 'Dónde se juega el ciclo', says: 'De qué objetivos de empresa cuelga el esfuerzo y qué tanto se alinea cada área con ellos.', area: 'lg:col-span-3', Chart: DondeSeJuega },
  { id: 'hacer', ask: { es: '¿Qué hacer?', en: 'What to do?' }, block: 'Qué hacer', says: 'Lo que espera visto bueno: cómo va la aprobación y lo devuelto sin corregir, por líder.', area: 'lg:col-span-3', Chart: QueHacer },
  { id: 'reporta', ask: { es: '¿Quién reporta?', en: 'Who reports?' }, block: 'Ranking', says: 'Qué parte de la gente reportó algo cada semana. Solo nombra para reconocer.', area: 'lg:col-span-6', Chart: QuienReporta },
]

/**
 * 5.1 · Leer un ciclo: las preguntas que se hace quien administra, respondidas
 * por los bloques reales de Resultados con las cifras del staging. La pregunta
 * activa enciende su bloque y redibuja su gráfico; las demás quedan en segundo plano.
 */
export function CycleReading() {
  const { t } = useLocale()
  const [pinned, setPinned] = useState(false)
  const { step, ref, set } = useStepper(STEP_MS, QUESTIONS.length, pinned)
  const active = QUESTIONS[step]

  return (
    <div ref={ref} data-reveal="device" className="relative overflow-hidden rounded-3xl bg-[#0b0d16] p-4 text-white md:p-8">
      <span className="pointer-events-none absolute -left-20 top-10 h-96 w-96 rounded-full bg-[#0c5bef] opacity-25 blur-3xl" aria-hidden="true" />
      <span className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-[#7b5cff] opacity-15 blur-3xl" aria-hidden="true" />

      {/* La pregunta, grande: es lo que guía la lectura. */}
      <div className="relative grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">{CICLO.nombre} · {t({ es: 'corte al', en: 'as of' })} {CICLO.corte}</p>
          <p key={active.id} className="mt-3 text-[clamp(2rem,1.2rem+2.6vw,3.6rem)] font-light leading-none tracking-tight animate-[spot-in_0.7s_cubic-bezier(0.16,1,0.3,1)_both]">{t(active.ask)}</p>
          <p key={`s-${active.id}`} className={`${rise} mt-3 max-w-[52ch] text-sm leading-relaxed text-white/65`}>{active.says}</p>
        </div>
        <div role="tablist" aria-label={t({ es: 'Preguntas', en: 'Questions' })} className="flex gap-1.5">
          {QUESTIONS.map((q, i) => (
            <button
              key={q.id}
              type="button"
              role="tab"
              aria-selected={i === step}
              aria-label={t(q.ask)}
              onClick={() => {
                set(i)
                setPinned(true)
              }}
              className="relative h-9 w-9 overflow-hidden rounded-full border border-white/20 font-mono text-[11px] text-white/60 transition-colors hover:border-white/60 aria-selected:border-white aria-selected:bg-white aria-selected:text-[#0b0d16]"
            >
              {i + 1}
              {i === step && !pinned && <span key={step} className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-[#0c5bef]" style={{ animation: `view-progress ${STEP_MS}ms linear both` }} aria-hidden="true" />}
            </button>
          ))}
        </div>
      </div>

      {/* La franja de periodos: el contexto de todo lo demás. */}
      <ol className="relative mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {PERIODOS.map((p) => (
          <li key={p.id} className={`rounded-xl px-3 py-2.5 ${p.estado === 'En curso' ? 'bg-white/[0.12] ring-1 ring-white/30' : 'bg-white/[0.05]'}`}>
            <p className="flex items-center justify-between text-[11px]"><b className="font-medium">{p.id}</b><span className="text-white/50">{p.estado}</span></p>
            <p className="mt-1 text-lg font-light tabular-nums">{p.avance === null ? '—' : fmt(p.avance)}</p>
            <p className="truncate text-[10px] text-white/40">{'nota' in p ? p.nota : ' '}</p>
          </li>
        ))}
      </ol>

      {/* El tablero: la pregunta activa enciende su bloque. */}
      <div className="relative mt-4 grid gap-3 lg:grid-cols-6">
        {QUESTIONS.map((q, i) => {
          const on = i === step
          return (
            <section
              key={q.id}
              onClick={() => {
                set(i)
                setPinned(true)
              }}
              className={`${q.area} cursor-pointer rounded-2xl bg-white p-4 text-[#161a2c] transition-[opacity,transform,box-shadow] duration-700 ease-expo ${on ? 'z-10 scale-[1.015] opacity-100 shadow-[0_40px_80px_-30px_rgba(12,91,239,0.9)] ring-2 ring-[#0c5bef]' : 'opacity-40 hover:opacity-70'}`}
            >
              <p className="mb-3 flex items-center justify-between text-[12px] font-medium">
                {q.block}
                <span className="font-mono text-[10px] text-black/35">0{i + 1}</span>
              </p>
              {/* Al encenderse, el bloque se monta de nuevo y su gráfico se redibuja. */}
              <div key={on ? `on-${step}` : 'off'}>
                <q.Chart />
              </div>
            </section>
          )
        })}
      </div>

      <p className="relative mt-5 text-[11px] text-white/45">
        {t({
          es: `Bloques y textos de la pestaña Resultados del playground; cifras del staging (${CICLO.personas} personas · ${CICLO.objetivos} objetivos · ${CICLO.reportaron} reportaron). Son datos sembrados, no de un cliente.`,
          en: `Blocks and copy from the playground’s Results tab; figures from staging (${CICLO.personas} people · ${CICLO.objetivos} goals · ${CICLO.reportaron} reported). Seeded data, not a client’s.`,
        })}
      </p>
    </div>
  )
}

'use client'

import { ALINEACION_PROMEDIO, AVANCE_AREA, CICLO, EN_RACHA, PARTICIPACION, PERIODOS, PESO_EMPRESA, PODIO, PRONOSTICO, fmt } from './ciclo-real'
import { GOALS } from './alignment-builder'

/**
 * 5.3 en teléfono y tableta: en vez de la captura entera (que a este ancho no se lee), una
 * recreación nítida, en HTML, de la pieza que más importa de cada página del playground, con su
 * estilo claro y las cifras del staging. Cada pieza se arma al entrar.
 */

const PRIMARY = '#0c5bef'
const WARNING = '#f79009'
const DESTRUCTIVE = '#d92d20'
const SUCCESS = '#17b26a'
const rise = 'animate-[ramp-in_0.7s_cubic-bezier(0.16,1,0.3,1)_both]'
const later = (i: number) => ({ animationDelay: `${120 + i * 110}ms` })

function Card({ title, aside, children, i = 0 }: { title: string; aside?: string; children: React.ReactNode; i?: number }) {
  return (
    <section className={`${rise} rounded-2xl border border-black/[0.07] bg-white p-4 shadow-[0_10px_30px_-18px_rgba(22,26,44,0.35)]`} style={later(i)}>
      <p className="mb-3 flex items-baseline justify-between gap-3 text-[14px] font-medium">
        {title}
        {aside && <span className="text-[11px] font-normal text-black/45">{aside}</span>}
      </p>
      {children}
    </section>
  )
}

/* ── Inicio: lo que hay que atender y el pulso ─────────────────────────── */

const ATENDER = [
  { level: 'Alta', tone: DESTRUCTIVE, title: 'Avance bajo a días del cierre', sub: 'Lanzamiento de marca · Septiembre', cta: 'Recordar a 12' },
  { level: 'Media', tone: WARNING, title: '3 personas no han reportado avance', sub: 'Lanzamiento de marca · Septiembre', cta: 'Recordar a 3' },
  { level: 'Baja', tone: PRIMARY, title: 'Cierra en 3 días', sub: 'Metas comerciales Q3', cta: 'Ver resultados' },
] as const

const PULSO = [
  { label: 'Avance promedio', v: '53,9 %', delta: '−7,5 pp', ring: 0.54, color: PRIMARY },
  { label: 'Personas reportando', v: '93,9 %', delta: '−1,7 pp', ring: 0.94, color: SUCCESS },
] as const

function Ring({ value, color }: { value: number; color: string }) {
  return (
    <svg viewBox="0 0 36 36" className="h-9 w-9 shrink-0 -rotate-90" aria-hidden="true">
      <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(22,26,44,0.08)" strokeWidth="4" />
      <circle cx="18" cy="18" r="14" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" pathLength={1} strokeDasharray={`${value} 1`} className="obj-draw" style={{ animationDelay: '400ms' }} />
    </svg>
  )
}

function Inicio() {
  return (
    <div className="space-y-3">
      <Card title="Para atender" aside="Nuevo">
        <ul className="space-y-3">
          {ATENDER.map((a, i) => (
            <li key={a.title} className={`${rise} border-t border-black/[0.06] pt-3 first:border-0 first:pt-0`} style={later(i + 1)}>
              <p className="flex items-start gap-2 text-[13px] font-medium leading-snug">
                <span className="mt-px shrink-0 rounded-full px-2 py-0.5 text-[11px]" style={{ color: a.tone, background: `${a.tone}14` }}>{a.level}</span>
                {a.title}
              </p>
              <p className="mt-1 text-[12px] text-black/50">{a.sub}</p>
              <span className="mt-2 inline-block rounded-lg border border-black/10 px-3 py-1.5 text-[12px]">{a.cta}</span>
            </li>
          ))}
        </ul>
      </Card>
      <div className="grid grid-cols-2 gap-3">
        {PULSO.map((p, i) => (
          <Card key={p.label} title={p.label} i={i + 4}>
            <div className="flex items-center justify-between gap-2">
              <span>
                <span className="block whitespace-nowrap text-[18px] font-medium tabular-nums">{p.v}</span>
                <span className="mt-1 inline-block rounded-full bg-[#d92d20]/10 px-1.5 text-[11px] text-[#d92d20]">{p.delta}</span>
              </span>
              <Ring value={p.ring} color={p.color} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

/* ── Resumen: cómo va contra el calendario ─────────────────────────────── */

function Resumen() {
  const { avance, calendario, alCierre, lectura } = PRONOSTICO
  const W = 300
  const H = 140
  const x = (v: number) => 8 + (v / 100) * (W - 16)
  const y = (v: number) => H - 10 - (v / 100) * (H - 24)
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-2">
        {PERIODOS.map((p, i) => (
          <div key={p.id} className={`${rise} rounded-xl border bg-white px-2 py-2 ${p.estado === 'En curso' ? 'border-[#0c5bef]/50' : 'border-black/[0.07]'}`} style={later(i)}>
            <span className="block text-[12px] font-medium">{p.id}</span>
            <span className="block text-[14px] tabular-nums">{p.avance === null ? '—' : fmt(p.avance)}</span>
            <span className="block truncate text-[11px] text-black/45">{p.estado}</span>
          </div>
        ))}
      </div>
      <Card title="Cómo va" aside={`Q3 · corte ${CICLO.corte}`} i={4}>
        <p className="mb-3 text-[15px] leading-snug">{lectura}</p>
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`Avance ${avance} %, esperado ${calendario} %, al cierre ${alCierre} %`}>
          <line x1={x(0)} x2={x(100)} y1={y(100)} y2={y(100)} stroke={SUCCESS} strokeDasharray="4 4" />
          <path d={`M${x(0)} ${y(0)} L${x(100)} ${y(100)}`} stroke="rgba(22,26,44,0.35)" strokeDasharray="4 4" strokeWidth={1.5} fill="none" />
          <line x1={x(calendario)} x2={x(calendario)} y1={y(100)} y2={y(0)} stroke="rgba(22,26,44,0.2)" />
          <path d={`M${x(0)} ${y(0)} L${x(calendario)} ${y(avance)}`} stroke={PRIMARY} strokeWidth={4} strokeLinecap="round" fill="none" pathLength={1} strokeDasharray={1} className="obj-draw" style={{ animationDelay: '500ms' }} />
          <path d={`M${x(calendario)} ${y(avance)} L${x(100)} ${y(alCierre)}`} stroke={PRIMARY} strokeOpacity={0.45} strokeWidth={2} strokeDasharray="6 4" fill="none" className={rise} style={later(8)} />
          <circle cx={x(100)} cy={y(alCierre)} r={5} fill={PRIMARY} className={rise} style={later(9)} />
        </svg>
        <dl className="mt-3 grid grid-cols-3 gap-2 text-[11px] text-black/55">
          {[
            ['Avance real', `${avance} %`, PRIMARY],
            ['Esperado', `${calendario} %`, 'rgba(22,26,44,0.45)'],
            ['Al cierre', `${alCierre} %`, '#6b8cff'],
          ].map(([label, v, c]) => (
            <div key={label}>
              <dt className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm" style={{ background: c }} />{label}</dt>
              <dd className="mt-0.5 text-[17px] font-medium tabular-nums text-[#161a2c]">{v}</dd>
            </div>
          ))}
        </dl>
      </Card>
      <Card title="Dónde mirar" aside={`Calendario ${calendario} %`} i={6}>
        <ul className="space-y-2">
          {AVANCE_AREA.slice(0, 3).map((a, i) => (
            <li key={a.area} className="grid grid-cols-[minmax(0,7.5rem)_1fr_2.75rem] items-center gap-2 text-[12px]">
              <span className="truncate text-black/60">{a.area}</span>
              <span className="relative h-3 rounded-r-md bg-black/[0.04]">
                <span className="obj-bar absolute inset-y-0 left-0 rounded-r-md" style={{ width: `${(a.v / calendario) * 100}%`, background: WARNING, animationDelay: `${700 + i * 120}ms` }} />
              </span>
              <span className="text-right font-medium tabular-nums">{fmt(a.v)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-[11px] text-black/50">Las áreas más atrasadas frente al {calendario} % del calendario corrido.</p>
      </Card>
    </div>
  )
}

/* ── Alineación: el peso alineado y una cascada corta ──────────────────── */

const PESO_COLOR = [PRIMARY, '#4f86ff', '#9fb2ff', 'rgba(22,26,44,0.15)']

function Alineacion() {
  return (
    <div className="space-y-3">
      <Card title="Peso por objetivo de empresa" aside={`Alineación ${fmt(ALINEACION_PROMEDIO)}`}>
        <div className="flex h-3 overflow-hidden rounded-full">
          {PESO_EMPRESA.map((p, i) => (
            <span key={p.id} className="obj-bar h-full" style={{ width: `${p.v}%`, background: PESO_COLOR[i], animationDelay: `${200 + i * 120}ms` }} />
          ))}
        </div>
        <ul className="mt-3 grid gap-1.5 text-[12px]">
          {PESO_EMPRESA.map((p, i) => (
            <li key={p.id} className="flex items-center gap-2">
              <span className="h-2 w-2 shrink-0 rounded-sm" style={{ background: PESO_COLOR[i] }} />
              <span className="min-w-0 flex-1 truncate text-black/65">{p.label}</span>
              <span className="tabular-nums">{p.v} %</span>
            </li>
          ))}
        </ul>
      </Card>
      <Card title="Qué áreas empujan cada objetivo" i={3}>
        <ul className="space-y-3">
          {GOALS.map((g, gi) => (
            <li key={g.id} className={rise} style={later(gi + 4)}>
              <div className="flex flex-wrap gap-1.5">
                {g.top.map((area) => (
                  <span key={area} className="rounded-lg border border-black/10 bg-white px-2 py-1 text-[11px] text-black/65 shadow-sm">{area}</span>
                ))}
              </div>
              <svg viewBox="0 0 20 18" className="ml-4 block h-[18px] w-5" aria-hidden="true">
                <path d="M10 0 L10 18" stroke={PRIMARY} strokeOpacity={0.6} strokeWidth={2.5} pathLength={1} strokeDasharray={1} className="obj-draw" style={{ animationDelay: `${500 + gi * 160}ms` }} />
              </svg>
              <div className="rounded-xl bg-[#0c5bef] px-3 py-2 text-white">
                <span className="block text-[13px] font-medium leading-tight">{g.title}</span>
                <span className="mt-0.5 block text-[11px] text-white/75">{g.meta}</span>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}

/* ── Ranking: el pulso semanal, el podio y las rachas ──────────────────── */

function Ranking() {
  return (
    <div className="space-y-3">
      <Card title="Participación" aside="últimas 8 semanas">
        <div className="flex h-28 items-end gap-1.5 border-b border-black/10">
          {PARTICIPACION.map((p, i) => (
            <div key={p.semana} className="flex flex-1 flex-col items-center justify-end">
              {p.v > 0 && <span className="mb-1 text-[11px] tabular-nums text-black/60">{p.v}%</span>}
              <span className={`${rise} w-full origin-bottom rounded-t`} style={{ height: `${Math.max(3, (p.v / 70) * 84)}px`, background: p.semana === 'Esta' ? PRIMARY : p.v ? '#6b8cff' : 'rgba(22,26,44,0.1)', ...later(i) }} />
            </div>
          ))}
        </div>
        <div className="mt-1 flex gap-1.5 text-center text-[11px] leading-tight text-black/45">
          {PARTICIPACION.map((p) => (
            <span key={p.semana} className="flex flex-1 flex-col items-center">
              {p.semana.split(' ').map((w) => <span key={w}>{w}</span>)}
            </span>
          ))}
        </div>
      </Card>
      <Card title="Top por área" i={3}>
        <div className="flex items-end justify-center gap-2">
          {PODIO.map((p, i) => (
            <div key={p.area} className="w-1/3 text-center">
              <p className="truncate text-[12px] font-medium">{p.area}</p>
              <p className="text-[11px] text-black/50">{fmt(p.v)}</p>
              <div className={`${rise} mt-1 grid origin-bottom place-items-center rounded-t-lg text-[13px] text-white`} style={{ height: [56, 76, 40][i], background: p.lugar === 1 ? PRIMARY : '#6b8cff', ...later(5 + i) }}>{p.lugar}</div>
            </div>
          ))}
        </div>
        <p className={`${rise} mt-3 rounded-lg bg-[#0c5bef]/10 px-3 py-2 text-[12px] text-[#0c5bef]`} style={later(9)}>🔥 En racha: {EN_RACHA} personas · 3 semanas o más</p>
      </Card>
    </div>
  )
}

export const MINI_PAGES: Record<string, () => JSX.Element> = {
  inicio: Inicio,
  resumen: Resumen,
  alineacion: Alineacion,
  ranking: Ranking,
}

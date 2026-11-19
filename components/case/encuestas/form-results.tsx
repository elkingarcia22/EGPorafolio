'use client'

import { useEffect, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { ACTIONS, AI_READING, COMMENTS, ENPS, FAVORABILITY, HEADER, PARTICIPATION_ROWS, TABS, type Chart, type Kpi, type TabId } from '@/lib/content/cases/encuestas/results-real'
import { BrowserFrame } from './form-moments'

const ROUTE = '/admin/desempeno-cultura/encuestas/c2026-1/resultados'
const TAB_MS = 4200
const COUNT_MS = 900
const GREEN = '#1aa463'
const YELLOW = '#c98a00'
const RED = '#c8102e'

/** Cuenta hacia arriba la cifra de una tarjeta, con el formato del producto (coma decimal, punto de miles). */
function useCount(kpi: Kpi, play: boolean): string {
  const [shown, setShown] = useState(play ? 0 : 1)
  useEffect(() => {
    if (!play || !kpi.count) return setShown(1)
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / COUNT_MS)
      setShown(1 - (1 - p) ** 3)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    setShown(0)
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [kpi, play])
  const c = kpi.count
  if (!c || shown >= 1) return kpi.value
  const v = c.to * shown
  const n = c.thousands ? Math.round(v).toLocaleString('es-CO') : v.toFixed(c.decimals ?? 0).replace('.', ',')
  return `${c.prefix && v > 0 ? c.prefix : ''}${n}${c.suffix ?? ''}`
}

/** La mini gráfica de la tarjeta, que se dibuja al entrar la pestaña. */
function MiniChart({ chart, play }: { chart: Chart; play: boolean }) {
  const R = 16
  const C = 2 * Math.PI * R
  const draw = (fraction: number) => ({ strokeDasharray: `${C * fraction} ${C}`, transition: play ? 'stroke-dasharray 1s cubic-bezier(0.16,1,0.3,1)' : 'none' })
  const [on, setOn] = useState(!play)
  useEffect(() => {
    if (!play) return setOn(true)
    setOn(false)
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setOn(true)))
    return () => cancelAnimationFrame(id)
  }, [chart, play])

  if (chart.kind === 'bars') {
    const max = Math.max(...chart.values)
    return (
      <span className="flex h-9 items-end gap-1.5" aria-hidden="true">
        {chart.values.map((v, i) => (
          <span key={i} className="w-4 origin-bottom rounded-[2px] bg-[#0c5bef] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" style={{ height: `${Math.max(18, (v / max) * 100)}%`, transform: on ? 'scaleY(1)' : 'scaleY(0)', transitionDelay: `${i * 90}ms` }} />
        ))}
      </span>
    )
  }
  if (chart.kind === 'gauge') {
    // Semicírculo de −100 a +100: verde claro, amarillo y la zona roja donde cae el puntaje.
    const arc = Math.PI * 22
    const reach = ((chart.value + 100) / 200) * arc
    return (
      <svg viewBox="0 0 52 30" className="h-9 w-16" aria-hidden="true">
        <path d="M4 27 A22 22 0 0 1 48 27" fill="none" stroke="#bfe8d3" strokeWidth="7" />
        <path d="M4 27 A22 22 0 0 1 48 27" fill="none" stroke={RED} strokeWidth="7" strokeDasharray={`${arc} ${arc}`} strokeDashoffset={on ? -reach : 0} style={{ transition: play ? 'stroke-dashoffset 1s cubic-bezier(0.16,1,0.3,1)' : 'none' }} />
      </svg>
    )
  }
  const parts = chart.kind === 'ring' ? [{ value: chart.value, color: chart.color }] : chart.parts
  const total = chart.kind === 'ring' ? 100 : parts.reduce((s, p) => s + p.value, 0)
  let offset = 0
  return (
    <svg viewBox="0 0 40 40" className="h-11 w-11 -rotate-90" aria-hidden="true">
      {chart.kind === 'ring' && <circle cx="20" cy="20" r={R} fill="none" stroke="#eef0f4" strokeWidth="5" />}
      {parts.map((p, i) => {
        const f = p.value / total
        const el = <circle key={i} cx="20" cy="20" r={R} fill="none" stroke={p.color} strokeWidth="5" strokeLinecap={chart.kind === 'ring' ? 'round' : 'butt'} strokeDashoffset={-C * offset} style={draw(on ? Math.max(0, f - (chart.kind === 'donut' ? 0.02 : 0)) : 0)} />
        offset += f
        return el
      })}
    </svg>
  )
}

function KpiCard({ kpi, play }: { kpi: Kpi; play: boolean }) {
  const value = useCount(kpi, play)
  return (
    <div className="flex min-w-0 items-start justify-between gap-3 px-4 py-3">
      <div className="min-w-0">
        <p className="flex items-center gap-1 text-[11px] text-[#5c646f]">{kpi.label}{kpi.info && <span className="inline-flex h-3 w-3 items-center justify-center rounded-full border border-current text-[7px]">i</span>}</p>
        <p className="mt-2 text-[19px] font-semibold tabular-nums text-[#14161a]">{value}{kpi.unit && <span className="ml-1 text-[11px] font-normal text-[#5c646f]">{kpi.unit}</span>}</p>
        <p className="mt-0.5 truncate text-[10px] text-[#5c646f]" title={kpi.detail}>{kpi.detail}</p>
      </div>
      <span className="shrink-0 pt-3"><MiniChart chart={kpi.chart} play={play} /></span>
    </div>
  )
}

const pct = (v: number, color: string) => <span className="font-medium tabular-nums" style={{ color }}>{v} %</span>
const Pill = ({ children, tone = 'yellow' }: { children: React.ReactNode; tone?: 'yellow' | 'green' | 'red' | 'blue' }) => (
  <span className={`rounded px-1.5 py-px text-[10px] font-medium tabular-nums ${tone === 'green' ? 'bg-[#e2f4ea] text-[#1a7f4b]' : tone === 'red' ? 'bg-[#fbe7e9] text-[#b02a37]' : tone === 'blue' ? 'bg-[#ecf1fa] text-[#0c5bef]' : 'bg-[#fbf3d6] text-[#8f6400]'}`}>{children}</span>
)
const pillTone = (v: string): 'yellow' | 'green' | 'red' => {
  const n = parseFloat(v.replace(',', '.').replace('+', ''))
  return v.startsWith('+') || v.startsWith('-') ? (n >= 10 ? 'green' : n < 0 ? 'red' : 'yellow') : n >= 70 ? 'green' : n < 40 ? 'red' : 'yellow'
}

function Block({ title, meta, children }: { title: string; meta: string; children: React.ReactNode }) {
  return (
    <div className="encf-page mt-3 rounded-xl border border-black/[0.07] bg-[#f6f7fb]">
      <div className="px-3 py-2"><p className="text-[12px] font-semibold">{title}</p><p className="text-[10px] text-[#5c646f]">{meta}</p></div>
      <div className="m-1 mt-0 overflow-hidden rounded-lg bg-white">{children}</div>
    </div>
  )
}

function SectionRow({ n, title, meta, value, label, depth = 0 }: { n: string; title: string; meta?: string; value: string; label: string; depth?: number }) {
  return (
    <div className="flex items-center gap-2 border-b border-black/[0.05] px-3 py-2 text-[11px]" style={{ paddingLeft: `${0.75 + depth * 1}rem` }}>
      <span className="font-mono text-[9px] text-[#5c646f]">{n}</span>
      <span className={`truncate ${depth === 0 ? 'text-[12px] font-semibold' : 'font-medium'}`}>{title}</span>
      {meta && <span className="hidden truncate text-[10px] text-[#979ba3] sm:inline">{meta}</span>}
      <span className="ml-auto flex shrink-0 items-center gap-1.5 text-[10px] text-[#5c646f]">{label}<Pill tone={pillTone(value)}>{value}</Pill></span>
    </div>
  )
}

function Body({ id }: { id: TabId }) {
  if (id === 'participacion') {
    return (
      <Block title="Detalle de la participación por colaborador" meta="520 personas">
        {PARTICIPATION_ROWS.map((r, i) => (
          <div key={r.name} className="enc-fade flex items-center gap-2 border-b border-black/[0.05] px-3 py-2 text-[11px]" style={{ animationDelay: `${i * 70}ms` }}>
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#f1f3f7] text-[8px] text-[#5c646f]">{r.initials}</span>
            <span className="min-w-0 flex-1 truncate">{r.name}</span>
            <span className="hidden w-24 text-[#5c646f] sm:block">{r.area}</span>
            <span className={`rounded px-1.5 text-[9px] ${r.status === 'Falta' ? 'bg-[#fbe7e9] text-[#b02a37]' : 'bg-[#ecf1fa] text-[#0c5bef]'}`}>{r.status}</span>
            <span className={`rounded-md border px-2 py-0.5 text-[10px] ${r.status === 'Falta' ? 'border-black/20' : 'border-black/10 text-[#979ba3]'}`}>Recordar</span>
          </div>
        ))}
      </Block>
    )
  }
  if (id === 'favorabilidad') {
    const f = FAVORABILITY
    return (
      <Block title="Detalle por secciones" meta="54 preguntas">
        <SectionRow n={f.section.n} title={f.section.title} meta={f.section.meta} value={f.section.value} label="Favorabilidad" />
        <SectionRow n={f.sub.n} title={f.sub.title} meta={f.sub.meta} value={f.sub.value} label="Favorabilidad" depth={1} />
        {f.rows.map((r, i) => (
          <div key={r.q} className="enc-fade grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-black/[0.05] py-2 pl-10 pr-3 text-[10.5px] sm:grid-cols-[minmax(0,1fr)_repeat(3,2.6rem)_auto]" style={{ animationDelay: `${i * 80}ms` }}>
            <span className="truncate">{i + 1}. {r.q}</span>
            <span className="hidden sm:block">{pct(r.fav, GREEN)}</span>
            <span className="hidden sm:block">{pct(r.neu, YELLOW)}</span>
            <span className="hidden sm:block">{pct(r.des, RED)}</span>
            <Pill tone={pillTone(r.value)}>{r.value}</Pill>
          </div>
        ))}
        {f.next.map((s) => <SectionRow key={s.n} n={s.n} title={s.title} value={s.value} label="Favorabilidad" depth={s.n.includes('.') ? 1 : 0} />)}
      </Block>
    )
  }
  if (id === 'preguntas') {
    const c = COMMENTS
    return (
      <Block title="Comentarios" meta="1.078 comentarios">
        <SectionRow n={c.section.n} title={c.section.title} meta={c.section.meta} value={c.section.negatives} label="Negativos" />
        <div className="flex items-center gap-3 border-b border-black/[0.05] py-2 pl-6 pr-3 text-[10.5px]">
          <span className="min-w-0 flex-1 truncate font-medium">{c.question.q}</span>
          <span className="hidden gap-2 sm:flex">{pct(c.question.pos, GREEN)}{pct(c.question.neu, YELLOW)}{pct(c.question.neg, RED)}</span>
          <span className="font-semibold tabular-nums">{c.question.total}</span>
        </div>
        {c.items.map((it, i) => (
          <div key={it.text} className="enc-fade border-b border-black/[0.05] py-2 pl-6 pr-3" style={{ animationDelay: `${120 + i * 120}ms` }}>
            <p className="text-[11px]">«{it.text}»</p>
            <p className="mt-1 flex flex-wrap items-center gap-1.5 text-[9.5px] text-[#5c646f]">
              {it.who}
              <span className="rounded bg-[#ecf1fa] px-1 text-[#0c5bef]">Sin leer</span>
              <span className="rounded border border-[#f3c2c8] px-1 text-[#b02a37]">Negativo</span>
              <span className="rounded border border-black/10 px-1">{it.topic}</span>
            </p>
          </div>
        ))}
      </Block>
    )
  }
  if (id === 'enps') {
    const e = ENPS
    return (
      <Block title="Detalle por secciones eNPS" meta="10 preguntas">
        <SectionRow n={e.section.n} title={e.section.title} meta={e.section.meta} value={e.section.value} label="eNPS" />
        <SectionRow n={e.sub.n} title={e.sub.title} meta={e.sub.meta} value={e.sub.value} label="eNPS" depth={1} />
        <div className="enc-fade grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-black/[0.05] py-2 pl-10 pr-3 text-[10.5px] sm:grid-cols-[minmax(0,1fr)_repeat(3,2.6rem)_auto]">
          <span className="truncate">1. {e.row.q}</span>
          <span className="hidden sm:block">{pct(e.row.pro, GREEN)}</span>
          <span className="hidden sm:block">{pct(e.row.neu, YELLOW)}</span>
          <span className="hidden sm:block">{pct(e.row.det, RED)}</span>
          <Pill tone={pillTone(e.row.value)}>{e.row.value}</Pill>
        </div>
        {e.next.map((s) => <SectionRow key={s.n} n={s.n} title={s.title} value={s.value} label="eNPS" depth={s.n.includes('.') ? 1 : 0} />)}
      </Block>
    )
  }
  if (id === 'ia') {
    return (
      <Block title="Lectura de la IA" meta="9 de 9 lecturas">
        <div className="border-b border-black/[0.05] px-3 py-2.5">
          <p className="flex justify-between gap-2 text-[11.5px] font-semibold">Resumen general<span className="hidden text-[9.5px] font-normal text-[#5c646f] sm:inline">Generado a partir de los resultados de esta medición</span></p>
          <p className="mt-1 text-[10.5px] leading-snug">{AI_READING.summary}</p>
        </div>
        <p className="flex items-center gap-2 px-3 pt-2 text-[11.5px] font-semibold">1 Hallazgos <span className="text-[9.5px] font-normal text-[#5c646f]">Qué pasó en esta medición</span><span className="ml-auto text-[9.5px] font-normal text-[#5c646f]">3 lecturas</span></p>
        {AI_READING.findings.map((f, i) => (
          <div key={f.title} className="enc-fade mx-3 border-b border-black/[0.05] py-1.5 text-[10.5px]" style={{ animationDelay: `${200 + i * 120}ms` }}>
            <p className="flex items-center gap-2"><span className="text-[#979ba3]">{i + 1}</span><span className="min-w-0 flex-1 truncate font-medium">{f.title}</span><Pill tone={f.confidence === 'Alta' ? 'green' : 'yellow'}>{f.confidence}</Pill></p>
            {'body' in f && f.body && <p className="mt-1 pl-4 text-[10px] leading-snug text-[#414a5c]">{f.body} <span className="block text-[#5c646f]">Evidencia: {f.evidence}</span></p>}
          </div>
        ))}
      </Block>
    )
  }
  return (
    <div className="encf-page">
      <div className="rounded-xl border border-black/[0.07] bg-[#f6f7fb]">
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2">
          <div><p className="text-[12px] font-semibold">Accionables</p><p className="text-[10px] text-[#5c646f]">{ACTIONS.total} acciones salidas de estos resultados</p></div>
          <p className="flex gap-1 text-[10px]"><span className="rounded-md bg-white px-2 py-0.5 font-medium shadow-sm">Todos</span><span className="px-2 py-0.5 text-[#5c646f]">Activos 0</span><span className="px-2 py-0.5 text-[#5c646f]">Sugeridos {ACTIONS.total}</span></p>
        </div>
        <p className="m-1 mt-0 rounded-lg bg-white px-3 py-2 text-[10px] leading-snug text-[#414a5c]">{ACTIONS.note}</p>
      </div>
      <div className="mt-3 rounded-xl border border-black/[0.07] bg-white">
        <p className="flex items-baseline gap-2 border-b border-black/[0.05] px-3 py-2 text-[12px] font-semibold">{ACTIONS.group.n} {ACTIONS.group.title}<span className="hidden truncate text-[9.5px] font-normal text-[#5c646f] sm:inline">{ACTIONS.group.meta}</span><span className="ml-auto shrink-0 text-[9.5px] font-normal text-[#5c646f]">{ACTIONS.group.count} accionables</span></p>
        {ACTIONS.items.map((a, i) => (
          <div key={a.title} className="enc-fade flex items-center gap-2 border-b border-black/[0.05] px-3 py-2 text-[10.5px]" style={{ animationDelay: `${i * 90}ms` }}>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-medium text-[#0c5bef]">{a.title}</span>
              <span className="block truncate text-[9.5px] text-[#5c646f]">{a.module} · {a.who}</span>
            </span>
            <Pill tone={a.score >= 95 ? 'green' : 'blue'}>{a.score}</Pill>
            <span className="hidden rounded border border-black/10 px-1 text-[9px] sm:inline">Sugerido</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/** Momento 6: la página real de resultados de Clima Q1 2026; las pestañas rotan y cada una dibuja sus cifras. */
export function ResultsReal() {
  const { reducedMotion } = useA11y()
  const box = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [hover, setHover] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = box.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.35 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const playing = visible && !hover && !reducedMotion
  useEffect(() => {
    if (!playing) return
    const id = window.setTimeout(() => setActive((a) => (a + 1) % TABS.length), TAB_MS)
    return () => window.clearTimeout(id)
  }, [playing, active])

  const tab = TABS[active]
  const animate = visible && !reducedMotion

  return (
    <div ref={box} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <BrowserFrame route={ROUTE}>
        <div className="bg-[linear-gradient(180deg,#eef3fd,#fff_30%)] px-3 pb-4 pt-3 text-[#303a47] sm:px-5">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="flex flex-wrap items-center gap-2 text-[16px] font-semibold leading-tight sm:text-[18px]">{HEADER.title}<span className="rounded bg-[#e2f4ea] px-1.5 text-[9px] font-medium text-[#1a7f4b]">{HEADER.status}</span></p>
              <p className="mt-1 flex flex-wrap gap-x-3 text-[10px] text-[#5c646f]">{HEADER.meta.map((m) => <span key={m}>{m}</span>)}</p>
            </div>
            <p className="hidden gap-1.5 text-[10px] sm:flex"><span className="rounded-md border border-black/10 bg-white px-2 py-1">Vista previa</span><span className="rounded-md bg-[#0c5bef] px-2 py-1 text-white">Descargar</span></p>
          </div>

          <div className="mt-3 flex gap-3 overflow-x-auto border-b border-black/[0.08] [scrollbar-width:none]" role="tablist" aria-label="Pestañas de resultados">
            {TABS.map((t, i) => (
              <button key={t.id} type="button" role="tab" aria-selected={i === active} onClick={() => setActive(i)} className={`relative flex shrink-0 items-center gap-1 pb-2 text-[11px] transition-colors ${i === active ? 'font-medium text-[#14161a]' : 'text-[#5c646f] hover:text-[#14161a]'}`}>
                {t.label}
                {t.isNew && <span className="rounded bg-[#ecf1fa] px-1 text-[8px] text-[#0c5bef]">Nuevo</span>}
                <span className={`absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-[#14161a] transition-transform duration-300 ${i === active ? 'scale-x-100' : 'scale-x-0'}`} />
              </button>
            ))}
          </div>

          <div key={tab.id} className="min-h-[19rem]">
            {tab.kpis.length > 0 && (
              <div className="encf-page mt-3 grid divide-y divide-black/[0.06] rounded-xl border border-black/[0.07] bg-white md:grid-cols-3 md:divide-x md:divide-y-0">
                {tab.kpis.map((k) => <KpiCard key={k.label} kpi={k} play={animate} />)}
              </div>
            )}
            <Body id={tab.id} />
          </div>
        </div>
      </BrowserFrame>
    </div>
  )
}

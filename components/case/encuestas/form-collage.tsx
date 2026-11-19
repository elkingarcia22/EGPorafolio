'use client'

import { useEffect, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { ACTIONS, AI_READING, COMMENTS, HEADER, TABS } from '@/lib/content/cases/encuestas/results-real'
import { AREAS, ROWS, type Cell } from '@/lib/content/cases/encuestas/heatmap-real'
import { favColor, Lock } from './shared'

const GREEN = '#1aa463'
const YELLOW = '#f2b51c'
const RED = '#c8102e'
const kpi = (tab: string, i: number) => TABS.find((x) => x.id === tab)?.kpis[i]

/** Cuenta hasta `to` cuando la pieza entra; con movimiento reducido se queda en el valor final. */
function useCount(to: number, on: boolean, decimals = 0, ms = 1300) {
  const { reducedMotion } = useA11y()
  const [v, setV] = useState(reducedMotion ? to : 0)
  useEffect(() => {
    if (!on || reducedMotion) return
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / ms)
      setV(to * (1 - Math.pow(1 - p, 3)))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [on, to, ms, reducedMotion])
  return v.toFixed(decimals).replace('.', ',')
}

/** Una pieza del collage: entra dispersa e inclinada y se acomoda; al pasar el cursor se endereza y sube. */
function Piece({ on, i, tilt, from, className = '', children }: { on: boolean; i: number; tilt: number; from: [number, number]; className?: string; children: React.ReactNode }) {
  return (
    <div
      className={`group relative min-w-0 transition-[transform,opacity] duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${className}`}
      style={{ transitionDelay: `${i * 110}ms`, opacity: on ? 1 : 0, transform: on ? `rotate(${tilt}deg)` : `translate(${from[0]}px, ${from[1]}px) rotate(${tilt * 4}deg) scale(0.9)` }}
    >
      <div className="flex h-full flex-col rounded-2xl bg-white p-4 text-[#303a47] shadow-[0_24px_50px_-24px_rgba(12,30,80,0.45)] ring-1 ring-black/[0.06] transition-transform duration-300 group-hover:-translate-y-1 group-hover:[transform:rotate(calc(var(--t)*-1deg))_translateY(-4px)]" style={{ ['--t' as string]: tilt }}>
        {children}
      </div>
    </div>
  )
}

function Label({ children, meta }: { children: React.ReactNode; meta?: string }) {
  return (
    <p className="flex items-baseline justify-between gap-2 text-[13px] lg:text-[11px] text-[#5c646f]">
      <span>{children}</span>
      {meta && <span className="truncate font-mono text-[11px] lg:text-[9px] text-[#979ba3]">{meta}</span>}
    </p>
  )
}

/** Barra apilada favorable/neutral/desfavorable que se llena de izquierda a derecha. */
function Stack({ parts, on }: { parts: readonly { value: number; color: string }[]; on: boolean }) {
  const total = parts.reduce((s, p) => s + p.value, 0)
  return (
    <span className="mt-2 flex h-2 overflow-hidden rounded-full bg-[#ecf1fa]">
      {parts.map((p, k) => (
        <span key={k} className="h-full transition-[width] duration-[1200ms] ease-out" style={{ width: on ? `${(p.value / total) * 100}%` : '0%', background: p.color, transitionDelay: `${400 + k * 150}ms` }} />
      ))}
    </span>
  )
}

function Ring({ value, color, on, size = 64 }: { value: number; color: string; on: boolean; size?: number }) {
  const r = 26
  const c = 2 * Math.PI * r
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className="shrink-0 -rotate-90" aria-hidden="true">
      <circle cx="32" cy="32" r={r} fill="none" stroke="#ecf1fa" strokeWidth="7" />
      <circle cx="32" cy="32" r={r} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={on ? c * (1 - value / 100) : c} className="transition-[stroke-dashoffset] duration-[1400ms] ease-out" />
    </svg>
  )
}

/** Medidor de eNPS de −100 a +100, con la aguja en el puntaje real. */
function Gauge({ value, on }: { value: number; on: boolean }) {
  const angle = on ? (value / 100) * 90 : -90
  return (
    <svg viewBox="0 0 120 68" className="w-full max-w-[11rem]" aria-hidden="true">
      <path d="M10 60 A50 50 0 0 1 43 13" fill="none" stroke={RED} strokeWidth="10" strokeLinecap="round" />
      <path d="M45 12 A50 50 0 0 1 75 12" fill="none" stroke={YELLOW} strokeWidth="10" />
      <path d="M77 13 A50 50 0 0 1 110 60" fill="none" stroke={GREEN} strokeWidth="10" strokeLinecap="round" />
      <g style={{ transform: `rotate(${angle}deg)`, transformOrigin: '60px 60px', transition: 'transform 1.6s cubic-bezier(0.34,1.4,0.64,1) 0.3s' }}>
        <line x1="60" y1="60" x2="60" y2="20" stroke="#303a47" strokeWidth="3" strokeLinecap="round" />
      </g>
      <circle cx="60" cy="60" r="5" fill="#303a47" />
    </svg>
  )
}

/** Columnas del mapa que se ven en el celular: menos áreas, cada celda más grande. */
const MOBILE_HEAT_COLS = 4

function HeatCell({ cell, on, delay, hideOnMobile }: { cell: Cell; on: boolean; delay: number; hideOnMobile: boolean }) {
  const style = cell === 'R' ? { background: '#eef0f4', color: '#979ba3' } : typeof cell === 'number' ? { background: favColor(cell), color: '#14161a' } : { background: '#f6f7fb' }
  return (
    <span className={`h-7 items-center justify-center rounded-[5px] font-mono lg:h-6 text-[11px] tabular-nums transition-[opacity,transform] duration-500 lg:text-[9px] ${hideOnMobile ? 'hidden lg:flex' : 'flex'}`} style={{ ...style, opacity: on ? 1 : 0, transform: on ? 'none' : 'scale(0.6)', transitionDelay: `${delay}ms` }}>
      {cell === 'R' ? <Lock className="h-3 w-3" /> : typeof cell === 'number' ? cell.toFixed(1).replace('.', ',') : ''}
    </span>
  )
}

/** Momento 5: varios resultados reales a la vez, como un collage sobre la mesa. */
export function ResultsCollage() {
  const box = useRef<HTMLDivElement>(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    const el = box.current
    if (!el) return
    // En celular y tableta el collage apilado es muy alto: arranca en cuanto asoma, no al llevar un cuarto a la vista.
    const stacked = window.matchMedia('(max-width: 1023px)').matches
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setOn(true), { threshold: stacked ? 0.06 : 0.25 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const enps = useCount(-3, on, 0)
  const fav = useCount(39, on, 0)
  const part = useCount(91, on, 0)
  const sentiment = useCount(45, on, 0)
  const heatCols = [0, 1, 2, 5, 7, 8]
  const heatRows = ROWS.filter((r) => r.label !== '¿Qué te ayudaría a entender mejor hacia dónde va la organización?').slice(0, 9)
  const finding = AI_READING.findings[0]
  const action = ACTIONS.items[0]

  return (
    <div ref={box} className="relative overflow-hidden rounded-3xl bg-[radial-gradient(120%_90%_at_20%_0%,#e3ebfd,#f4f6fb_55%,#eef1f7)] p-4 ring-1 ring-black/[0.05] sm:p-8">
      <div className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:radial-gradient(#c5ccd8_1px,transparent_1px)] [background-size:18px_18px]" aria-hidden="true" />
      <p className="relative mb-5 flex flex-wrap items-center gap-2 text-[13px] lg:text-[11px] text-[#5c646f]">
        <span className="rounded-md bg-white px-2 py-1 font-semibold text-[#303a47] shadow-sm">{HEADER.title}</span>
        <span className="rounded bg-[#e2f4ea] px-1.5 py-0.5 text-[12px] lg:text-[10px] text-[#1f7a4c]">{HEADER.status}</span>
        <span>{HEADER.meta.join(' · ')}</span>
      </p>

      <div className="relative grid gap-4 md:grid-cols-2 lg:grid-cols-6 lg:gap-5">
        {/* eNPS: la pieza principal. */}
        <Piece on={on} i={0} tilt={-1.5} from={[-80, 60]} className="md:row-span-2 lg:col-span-2">
          <Label meta="eNPS">Puntaje eNPS</Label>
          <p className="mt-1 text-[40px] font-semibold leading-none tabular-nums" style={{ color: RED }}>{enps}</p>
          <p className="text-[13px] lg:text-[11px] text-[#5c646f]">{kpi('enps', 0)?.detail}</p>
          <div className="mt-3 flex flex-1 items-center justify-center"><Gauge value={-3} on={on} /></div>
          <Stack on={on} parts={[{ value: 206, color: GREEN }, { value: 31, color: YELLOW }, { value: 222, color: RED }]} />
          <p className="mt-1.5 text-[12px] lg:text-[10px] text-[#5c646f]">{kpi('enps', 1)?.detail}</p>
        </Piece>

        {/* Favorabilidad. */}
        <Piece on={on} i={1} tilt={1.2} from={[90, -60]} className="lg:col-span-2">
          <Label meta="Favorabilidad">Favorabilidad general</Label>
          <div className="mt-1 flex items-center gap-3">
            <p className="flex-1 text-[30px] font-semibold leading-none tabular-nums">{fav} %</p>
            <Ring value={39} color={RED} on={on} size={56} />
          </div>
          <p className="text-[13px] lg:text-[11px] text-[#5c646f]">{kpi('favorabilidad', 0)?.detail}</p>
          <Stack on={on} parts={[{ value: 8362, color: GREEN }, { value: 9582, color: YELLOW }, { value: 3508, color: RED }]} />
          <p className="mt-1.5 text-[12px] lg:text-[10px] leading-snug text-[#5c646f]">8.362 favorables · 9.582 neutrales · 3.508 desfavorables</p>
        </Piece>

        {/* Participación. */}
        <Piece on={on} i={2} tilt={-0.8} from={[120, 40]} className="lg:col-span-2">
          <Label meta="Participación">Total de participación</Label>
          <div className="mt-1 flex items-center gap-3">
            <p className="flex-1 text-[30px] font-semibold leading-none tabular-nums">{part} %</p>
            <Ring value={91} color={GREEN} on={on} size={56} />
          </div>
          <p className="text-[13px] lg:text-[11px] text-[#5c646f]">{kpi('participacion', 0)?.detail}</p>
        </Piece>

        {/* Sentimiento de los comentarios. */}
        <Piece on={on} i={3} tilt={0.9} from={[-40, 90]} className="md:col-span-2 lg:col-span-4">
          <div className="grid gap-4 sm:grid-cols-[11rem_1fr]">
            <div>
              <Label>Sentimiento promedio</Label>
              <p className="mt-1 text-[30px] font-semibold leading-none tabular-nums" style={{ color: '#b98a0d' }}>{sentiment}</p>
              <p className="text-[13px] lg:text-[11px] text-[#5c646f]">Neutral</p>
              <Stack on={on} parts={[{ value: 353, color: GREEN }, { value: 256, color: YELLOW }, { value: 469, color: RED }]} />
              <p className="mt-1.5 text-[12px] lg:text-[10px] text-[#5c646f]">353 positivos · 256 neutrales · 469 negativos</p>
            </div>
            <div className="space-y-2">
              <p className="text-[13px] lg:text-[11px] font-medium">{COMMENTS.question.q}</p>
              {COMMENTS.items.map((c, k) => (
                <p key={c.text} className="rounded-lg bg-[#f6f7fb] p-2 text-[12px] lg:text-[10.5px] leading-snug transition-[opacity,transform] duration-700" style={{ opacity: on ? 1 : 0, transform: on ? 'none' : 'translateY(8px)', transitionDelay: `${900 + k * 250}ms` }}>
                  «{c.text}»
                  <span className="mt-1 flex gap-1.5 text-[11px] lg:text-[9px]">
                    <span className="rounded bg-[#fde8ea] px-1 text-[#b02a37]">Negativo</span>
                    <span className="rounded bg-white px-1 text-[#5c646f] ring-1 ring-black/5">{c.topic}</span>
                  </span>
                </p>
              ))}
            </div>
          </div>
        </Piece>

        {/* Recorte del mapa de calor de otra encuesta, anónima: lo reservado lleva candado. */}
        <Piece on={on} i={4} tilt={-1} from={[-100, -40]} className="md:col-span-2 lg:col-span-4 lg:row-span-2">
          <Label meta="Cultura y Valores - 2026 (2ª ola) · anónima">Mapa de calor por área</Label>
          <div className="mt-2 overflow-x-auto">
            <div className="grid grid-cols-[minmax(0,2.2fr)_repeat(4,minmax(0,1fr))] gap-1 text-[12px] lg:min-w-[26rem] lg:grid-cols-[minmax(8rem,1.4fr)_repeat(6,minmax(0,1fr))] lg:text-[9.5px]">
              <span />
              {heatCols.map((c, ci) => <span key={c} className={`truncate text-center font-mono text-[11px] uppercase text-[#5c646f] lg:block lg:text-[8.5px] ${ci >= MOBILE_HEAT_COLS ? 'hidden' : 'block'}`}>{AREAS[c]}</span>)}
              {heatRows.map((r, ri) => (
                <div key={r.numbering + r.label} className="contents">
                  <span className={`truncate ${r.depth === 1 ? 'font-semibold' : 'pl-3'}`}>{r.numbering} {r.label}</span>
                  {heatCols.map((c, ci) => <HeatCell key={c} cell={r.cells[c]} on={on} delay={700 + ri * 120 + ci * 40} hideOnMobile={ci >= MOBILE_HEAT_COLS} />)}
                </div>
              ))}
            </div>
          </div>
          <p className="mt-auto pt-2 text-[12px] lg:text-[10px] text-[#5c646f]">10 grupos · 4 con resultados reservados · mínimo 5 por grupo</p>
        </Piece>

        {/* Una lectura de la IA. */}
        <Piece on={on} i={5} tilt={1.4} from={[80, 80]} className="lg:col-span-2">
          <Label meta="Análisis con IA">Lectura de la IA</Label>
          <p className="mt-1.5 text-[14px] lg:text-[12px] font-semibold leading-snug">{finding.title}</p>
          <p className="mt-1.5 flex items-center gap-1.5 text-[12px] lg:text-[10px]"><span className="rounded bg-[#e2f4ea] px-1.5 text-[#1f7a4c]">Confiabilidad {finding.confidence}</span></p>
          <p className="mt-2 rounded-lg bg-[#f6f7fb] p-2 text-[12px] lg:text-[10px] leading-snug text-[#414a5c]"><b>Evidencia</b> · {'evidence' in finding ? finding.evidence : ''}</p>
        </Piece>

        {/* Un accionable que sale de la medición. */}
        <Piece on={on} i={6} tilt={-1.2} from={[40, 120]} className="lg:col-span-2">
          <Label meta="Accionables">{action.module}</Label>
          <p className="mt-1.5 text-[14px] lg:text-[12px] font-semibold leading-snug">{action.title}</p>
          <p className="mt-1 text-[12px] lg:text-[10px] text-[#5c646f]">{action.who}</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#ecf1fa]"><span className="block h-full rounded-full bg-[#0c5bef] transition-[width] duration-[1200ms] ease-out" style={{ width: on ? `${action.score}%` : '0%', transitionDelay: '900ms' }} /></span>
            <span className="font-mono text-[12px] lg:text-[10px] tabular-nums">{action.score}</span>
          </div>
        </Piece>
      </div>
    </div>
  )
}

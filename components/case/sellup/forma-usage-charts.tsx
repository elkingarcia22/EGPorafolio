'use client'

import { useLocale } from '@/lib/i18n'
import { useA11y } from '@/lib/a11y'
import { useInView } from './ui'

/**
 * «Cuándo se usa» y «Uso de los agentes en el tiempo» del panel de Uso de IA.
 * El patrón del mapa de calor y los valores diarios están leídos a ojo de las
 * gráficas reales (19-11-2026): son aproximados.
 */

const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

/** Intensidad 0–4 por hora: [hora, nivel]. Pico: jueves 09:00. */
const LEVELS: readonly (readonly [number, number])[][] = [
  [[6, 1], [8, 2], [9, 1], [10, 2], [11, 1], [12, 2], [13, 1], [14, 2], [16, 1], [18, 2], [20, 1]],
  [[7, 1], [8, 2], [9, 3], [10, 2], [11, 2], [12, 3], [13, 2], [14, 2], [15, 3], [16, 1], [23, 2]],
  [[8, 1], [9, 2], [10, 1], [11, 2], [13, 1], [15, 2], [17, 1], [18, 2], [20, 2], [21, 1]],
  [[8, 1], [9, 4], [10, 3], [11, 2], [12, 3], [13, 2], [14, 3], [15, 2], [16, 1], [19, 1]],
  [[10, 2], [12, 2], [14, 2], [15, 1], [17, 1]],
  [[9, 1], [10, 2], [11, 1]],
  [],
]
const LEVEL_BG = ['bg-white/[0.05]', 'bg-[#285ee6]/30', 'bg-[#285ee6]/50', 'bg-[#4f74f0]/75', 'bg-[#8fa6ff]']

export function UsageHeatmap() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const [ref, seen] = useInView<HTMLDivElement>(0.3)
  const on = seen || reducedMotion
  return (
    <div ref={ref} className="rounded-[20px] border border-white/10 bg-[#141517]/90 p-4 md:p-5">
      <p className="text-[15px] font-medium">{t({ es: 'Cuándo se usa', en: 'When it’s used' })}</p>
      <p className="mt-0.5 text-xs text-white/45">{t({ es: 'Hora pico: jueves a las 09:00 (hora de Colombia)', en: 'Peak: Thursday 09:00 (Colombia time)' })}</p>
      <div className="mt-4 grid grid-cols-[2rem_repeat(24,minmax(0,1fr))] gap-[3px] text-[10px] text-white/40">
        <span />
        {Array.from({ length: 24 }, (_, h) => <span key={h} className="text-center">{h % 3 === 0 ? h : ''}</span>)}
        {DAYS.map((d, di) => {
          const map = new Map(LEVELS[di])
          return [
            <span key={d} className="self-center">{d}</span>,
            ...Array.from({ length: 24 }, (_, h) => {
              const lvl = map.get(h) ?? 0
              const peak = di === 3 && h === 9
              return (
                <span
                  key={`${d}-${h}`}
                  className={`relative aspect-square rounded-full transition-[background-color,transform] duration-300 ${on ? LEVEL_BG[lvl] : LEVEL_BG[0]} ${peak && on ? 'scale-110' : ''}`}
                  style={{ transitionDelay: on && !reducedMotion ? `${h * 55 + di * 12}ms` : '0ms' }}
                >
                  {peak && on && !reducedMotion && <span className="absolute -inset-1 animate-ping rounded-full bg-[#8fa6ff]/40" style={{ animationDelay: '1.4s' }} />}
                </span>
              )
            }),
          ]
        })}
      </div>
      <p className="mt-3 flex items-center justify-end gap-1.5 text-[10px] text-white/40">
        {t({ es: 'Menos', en: 'Less' })}
        {LEVEL_BG.map((c) => <span key={c} className={`h-2.5 w-2.5 rounded-full ${c}`} />)}
        {t({ es: 'Más', en: 'More' })}
      </p>
    </div>
  )
}

/** Consultas por día (aprox.): Agente 1 y total apilado con Agente 2. */
const SERIES: readonly { day: string; a1: number; total: number }[] = [
  { day: '11 nov', a1: 30, total: 180 },
  { day: '12 nov', a1: 5, total: 110 },
  { day: '13 nov', a1: 70, total: 140 },
  { day: '14 nov', a1: 110, total: 120 },
  { day: '16 nov', a1: 200, total: 230 },
  { day: '17 nov', a1: 630, total: 980 },
  { day: '18 nov', a1: 10, total: 100 },
  { day: '19 nov', a1: 560, total: 760 },
]
const W = 520
const H = 200
const PAD = { l: 34, r: 12, t: 14, b: 26 }
const MAX = 1000
const x = (i: number) => PAD.l + (i * (W - PAD.l - PAD.r)) / (SERIES.length - 1)
const y = (v: number) => PAD.t + (1 - v / MAX) * (H - PAD.t - PAD.b)

/** Curva suave (Catmull-Rom → Bézier) por los puntos. */
function smooth(values: readonly number[]): string {
  const pts = values.map((v, i) => [x(i), y(v)] as const)
  return pts.reduce((d, p, i) => {
    if (i === 0) return `M${p[0]},${p[1]}`
    const p0 = pts[Math.max(0, i - 2)]
    const p1 = pts[i - 1]
    const p3 = pts[Math.min(pts.length - 1, i + 1)]
    const c1 = [p1[0] + (p[0] - p0[0]) / 6, p1[1] + (p[1] - p0[1]) / 6]
    const c2 = [p[0] - (p3[0] - p1[0]) / 6, p[1] - (p3[1] - p1[1]) / 6]
    return `${d} C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p[0].toFixed(1)},${p[1].toFixed(1)}`
  }, '')
}

const TOTAL_LINE = smooth(SERIES.map((s) => s.total))
const A1_LINE = smooth(SERIES.map((s) => s.a1))
const BASE = `L${x(SERIES.length - 1)},${y(0)} L${x(0)},${y(0)} Z`
const PEAK = SERIES.findIndex((s) => s.day === '17 nov')

export function UsageTimeline() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const [ref, seen] = useInView<HTMLDivElement>(0.3)
  const on = seen || reducedMotion
  const draw = (delay: number) => ({ strokeDasharray: 1, strokeDashoffset: on ? 0 : 1, transition: reducedMotion ? 'none' : `stroke-dashoffset 1.4s cubic-bezier(.16,1,.3,1) ${delay}ms` })
  const fill = (delay: number) => ({ opacity: on ? 1 : 0, transition: reducedMotion ? 'none' : `opacity .6s ease ${delay}ms` })
  return (
    <div ref={ref} className="rounded-[20px] border border-white/10 bg-[#141517]/90 p-4 md:p-5">
      <p className="text-[15px] font-medium">{t({ es: 'Uso de los agentes en el tiempo', en: 'Agent usage over time' })}</p>
      <p className="mt-0.5 text-xs text-white/45">{t({ es: 'Consultas por día, apiladas por agente (valores aproximados)', en: 'Queries per day, stacked by agent (approximate values)' })}</p>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 block h-auto w-full" role="img" aria-label={t({ es: 'Pico de unas 1.000 consultas el 17 de noviembre', en: 'Peak of about 1,000 queries on 17 November' })}>
        {[0, 250, 500, 750, 1000].map((v) => (
          <g key={v}>
            <line x1={PAD.l} x2={W - PAD.r} y1={y(v)} y2={y(v)} stroke="rgba(255,255,255,0.07)" strokeDasharray="3 4" />
            <text x={PAD.l - 6} y={y(v) + 3} textAnchor="end" fontSize="9" fill="rgba(255,255,255,0.4)">{v.toLocaleString('es-CO')}</text>
          </g>
        ))}
        {SERIES.map((s, i) => <text key={s.day} x={x(i)} y={H - 8} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.4)">{s.day}</text>)}
        <path d={`${TOTAL_LINE} ${BASE}`} fill="rgba(16,185,129,0.22)" style={fill(700)} />
        <path d={`${A1_LINE} ${BASE}`} fill="rgba(40,94,230,0.35)" style={fill(500)} />
        <path d={TOTAL_LINE} fill="none" stroke="#34d399" strokeWidth="1.8" pathLength={1} style={draw(150)} />
        <path d={A1_LINE} fill="none" stroke="#8fa6ff" strokeWidth="1.8" pathLength={1} style={draw(0)} />
        <g style={fill(1300)}>
          <circle cx={x(PEAK)} cy={y(SERIES[PEAK].total)} r="4" fill="#34d399" />
          {!reducedMotion && <circle cx={x(PEAK)} cy={y(SERIES[PEAK].total)} r="4" fill="none" stroke="#34d399"><animate attributeName="r" from="4" to="14" dur="1.6s" repeatCount="indefinite" /><animate attributeName="opacity" from="0.8" to="0" dur="1.6s" repeatCount="indefinite" /></circle>}
          <text x={x(PEAK) + 10} y={y(SERIES[PEAK].total) + 4} fontSize="10" fill="white">{t({ es: '17 nov · ~1.000', en: 'Nov 17 · ~1,000' })}</text>
        </g>
      </svg>
      <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-white/55">
        <span><span className="text-[#8fa6ff]">●</span> {t({ es: 'Agente 1 · Empresas', en: 'Agent 1 · Companies' })}</span>
        <span><span className="text-emerald-400">●</span> {t({ es: 'Agente 2 · Contactos', en: 'Agent 2 · Contacts' })}</span>
      </p>
    </div>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'
import { useLocale } from '@/lib/i18n'
import { PLATFORM_CASE, type Mark } from '@/lib/content/cases/barberlytics/platform-case'

const shareOf = (marks: readonly Mark[]) => marks.slice(1).reduce((n, m) => n + (m === 'yes' ? 1 : m === 'half' ? 0.5 : 0), 0) / (marks.length - 1)
const ownOf = (m: Mark) => (m === 'yes' ? 1 : m === 'half' ? 0.5 : 0)

const C = 210 // centro del radar
const R = 150 // radio
const point = (i: number, n: number, v: number) => {
  const ang = (-90 + (360 / n) * i) * (Math.PI / 180)
  return [C + Math.cos(ang) * R * v, C + Math.sin(ang) * R * v] as const
}
const polygon = (values: readonly number[]) => values.map((v, i) => point(i, values.length, Math.max(v, 0.04)).join(',')).join(' ')

/**
 * Radar del calendario: Barberlytics contra el promedio del sector en cada función.
 * Al lado, lo que se lee: dónde lidera, dónde va parejo y dónde le falta.
 */
function CalendarRadar() {
  const { t } = useLocale()
  const ref = useRef<SVGSVGElement>(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), { threshold: 0.35 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  const { matrix } = PLATFORM_CASE.patterns
  const rows = matrix.rows.map((r) => ({ fn: r.fn, own: ownOf(r.marks[0]), sector: shareOf(r.marks) }))
  const n = rows.length
  const groups = [
    { title: { es: 'Donde lidera', en: 'Where it leads' }, hue: '#d9b36a', items: rows.filter((r) => r.own - r.sector >= 0.4) },
    { title: { es: 'Parejo con el sector', en: 'On par with the industry' }, hue: '#9a9ea8', items: rows.filter((r) => Math.abs(r.own - r.sector) < 0.4) },
    { title: { es: 'Lo que falta', en: 'What’s missing' }, hue: '#ff6b72', items: rows.filter((r) => r.sector - r.own >= 0.4) },
  ]
  return (
    <figure data-reveal="device" className="overflow-hidden rounded-3xl bg-[#0f0d0b] p-5 text-white md:p-8">
      <figcaption className="mb-2 flex flex-wrap items-baseline justify-between gap-3">
        <span className="text-lg">{t({ es: 'El calendario frente al sector', en: 'The calendar against the industry' })}</span>
        <span className="flex gap-4 text-[11px] text-white/60">
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-[#d9b36a]" />Barberlytics</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm border border-white/50 bg-white/15" />{t({ es: `Promedio de ${matrix.products.length - 1} productos`, en: `Average of ${matrix.products.length - 1} products` })}</span>
        </span>
      </figcaption>
      <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <svg ref={ref} viewBox="0 0 420 420" className="mx-auto h-auto w-full max-w-[460px] overflow-visible" role="img" aria-label={t({ es: 'Radar de funciones del calendario', en: 'Calendar functions radar' })}>
          {[0.25, 0.5, 0.75, 1].map((ring) => (
            <polygon key={ring} points={polygon(rows.map(() => ring))} fill="none" stroke="rgba(255,255,255,0.08)" />
          ))}
          {rows.map((r, i) => {
            const [x, y] = point(i, n, 1)
            const [lx, ly] = point(i, n, 1.2)
            return (
              <g key={r.fn.es}>
                <line x1={C} y1={C} x2={x} y2={y} stroke="rgba(255,255,255,0.08)" />
                <foreignObject x={lx - 55} y={ly - 16} width="110" height="34">
                  <p className="text-center text-[10px] leading-tight text-white/60">{t(r.fn)}</p>
                </foreignObject>
              </g>
            )
          })}
          {seen && (
            <>
          <polygon points={polygon(rows.map((r) => r.sector))} fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" className="origin-center animate-[radar-grow_1.2s_cubic-bezier(0.16,1,0.3,1)_both]" style={{ transformOrigin: `${C}px ${C}px` }} />
          <polygon points={polygon(rows.map((r) => r.own))} fill="rgba(217,179,106,0.28)" stroke="#d9b36a" strokeWidth="2.5" className="animate-[radar-grow_1.4s_cubic-bezier(0.16,1,0.3,1)_both]" style={{ transformOrigin: `${C}px ${C}px`, animationDelay: '0.35s', filter: 'drop-shadow(0 0 14px rgba(217,179,106,0.55))' }} />
          {rows.map((r, i) => {
            const [x, y] = point(i, n, Math.max(r.own, 0.04))
            return <circle key={r.fn.es} cx={x} cy={y} r="4" fill="#d9b36a" className="animate-[ramp-in_0.6s_both]" style={{ animationDelay: `${0.9 + i * 0.07}s` }} />
          })}
            </>
          )}
        </svg>

        <div className="space-y-5">
          {groups.map((g) => (
            <div key={g.title.es} data-reveal>
              <p className="mono-label mb-2" style={{ color: g.hue }}>{t(g.title)}</p>
              <ul className="space-y-1.5">
                {g.items.map((r) => (
                  <li key={r.fn.es} className="grid grid-cols-[1fr_6rem] items-center gap-3 text-sm">
                    <span className="text-white/85">{t(r.fn)}</span>
                    <span className="relative h-2 rounded-full bg-white/[0.06]">
                      <span className="absolute inset-y-0 left-0 rounded-full bg-white/30" style={{ width: `${r.sector * 100}%` }} />
                      <span className="absolute -top-0.5 h-3 w-1 rounded-full bg-[#d9b36a]" style={{ left: `calc(${r.own * 100}% - 2px)` }} />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-4 text-[11px] text-white/40">{t(matrix.note)}</p>
    </figure>
  )
}

/** Lo que dicen barberos y dueños: un muro de citas, quejas y elogios. */
function Voices() {
  const { t } = useLocale()
  const { voices } = PLATFORM_CASE.patterns
  return (
    <section className="mt-[clamp(4rem,3rem+4vw,6rem)]">
      <h3 data-reveal="mask" className="text-[clamp(1.35rem,1rem+1vw,1.9rem)]">{t(voices.title)}</h3>
      <p data-reveal className="mb-10 mt-3 max-w-[62ch] text-sm leading-relaxed opacity-65">{t(voices.note)}</p>
      <ul className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {voices.items.map((v, i) => (
          <li
            key={v.quote.es}
            data-reveal
            className={`mb-4 break-inside-avoid rounded-2xl border p-5 ${v.tone === 'pain' ? 'border-[#e5484d]/25 bg-[#e5484d]/[0.06]' : 'border-[#2a8a5c]/35 bg-[#2a8a5c]/[0.08]'}`}
            style={{ transform: `rotate(${i % 3 === 0 ? -0.6 : i % 3 === 1 ? 0.5 : 0}deg)` }}
          >
            <span className={`mono-label ${v.tone === 'pain' ? 'text-[#ff8a8e]' : 'text-[#5fd39a]'}`}>{v.tone === 'pain' ? t({ es: 'Duele', en: 'Hurts' }) : t({ es: 'Valoran', en: 'Valued' })}</span>
            <p className={`mt-3 leading-snug ${i % 4 === 0 ? 'text-2xl font-light' : 'text-lg'}`}>{t(v.quote)}</p>
            <p className="mt-3 text-xs opacity-60">— {t(v.who)}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

/** 02 · Patrones: benchmark del calendario y la voz de barberos y dueños. */
export function PlatformPatterns() {
  const { t } = useLocale()
  const { patterns } = PLATFORM_CASE
  return (
    <div>
      <p data-reveal className="mb-10 max-w-[62ch] text-lg leading-relaxed opacity-80">{t(patterns.lead)}</p>
      <CalendarRadar />
      <Voices />
      <ol className="mt-12 space-y-4">
        {patterns.insights.map((insight, i) => (
          <li key={insight.es} data-reveal className="flex gap-5 border-t border-fg/15 pt-4">
            <span className="mono-label shrink-0 text-signal">{t({ es: 'Hallazgo', en: 'Insight' })} 0{i + 1}</span>
            <span className="text-lg leading-snug">{t(insight)}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

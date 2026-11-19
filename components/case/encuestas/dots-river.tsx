'use client'

import { useEffect, useRef } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import type { Station } from '@/lib/content/cases/encuestas/types'

const W = 1000
const H = 220
const X0 = 30
const X1 = 970
const stationX = (i: number, n: number) => 90 + (i * (W - 180)) / (n - 1)
const baseY = (x: number) => Math.round((110 + Math.sin(x / 150) * 22) * 10) / 10

/** Pseudoaleatorio estable: las mismas partículas en cada render. */
const rnd = (i: number, k: number) => {
  const v = Math.sin(i * 127.1 + k * 311.7) * 43758.5453
  return v - Math.floor(v)
}

const COUNT = 54
const PARTICLES = Array.from({ length: COUNT }, (_, i) => {
  const r = rnd(i, 3)
  // Cerca de la mitad cruza todo el río; el resto se va quedando en alguna parada (ilustrativo).
  const dropAt = r < 0.48 ? -1 : 1 + Math.floor(rnd(i, 4) * 5)
  return { phase: rnd(i, 1), speed: 0.045 + rnd(i, 2) * 0.03, lane: (rnd(i, 5) - 0.5) * 30, dropAt, size: Math.round((2.2 + rnd(i, 6) * 1.6) * 10) / 10 }
})

const RIVER = (() => {
  const top: string[] = []
  const bottom: string[] = []
  for (let x = X0; x <= X1; x += 10) {
    const w = 26 - ((x - X0) / (X1 - X0)) * 12
    top.push(`${x} ${(baseY(x) - w).toFixed(1)}`)
    bottom.unshift(`${x} ${(baseY(x) + w).toFixed(1)}`)
  }
  return `M ${top.join(' L ')} L ${bottom.join(' L ')} Z`
})()

const CENTER = (() => {
  const pts: string[] = []
  for (let x = X0; x <= X1; x += 10) pts.push(`${x} ${baseY(x)}`)
  return `M ${pts.join(' L ')}`
})()

interface RiverProps {
  stations: readonly Station[]
  active: number
  onPick: (i: number) => void
}

/** El río de participación: personas que entran por la izquierda y se van quedando en cada parada. */
export function ParticipationRiver({ stations, active, onPick }: RiverProps) {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const group = useRef<SVGGElement>(null)
  const n = stations.length

  useEffect(() => {
    const g = group.current
    if (!g) return
    const dots = Array.from(g.children) as SVGCircleElement[]
    const paint = (time: number) => {
      PARTICLES.forEach((p, i) => {
        const x = X0 + ((p.phase + time * p.speed) % 1) * (X1 - X0)
        const el = dots[i]
        if (!el) return
        const sx = p.dropAt >= 0 ? stationX(p.dropAt, n) + 14 : Infinity
        if (x > sx) {
          const dx = x - sx
          el.setAttribute('cx', String(sx + dx * 0.35))
          el.setAttribute('cy', String(baseY(sx) + p.lane * 0.6 + dx * 0.7))
          el.setAttribute('opacity', String(Math.max(0, 0.95 - dx / 130)))
          el.setAttribute('class', 'fill-[#e0675f]')
        } else {
          el.setAttribute('cx', String(x))
          el.setAttribute('cy', String(baseY(x) + p.lane * (1 - ((x - X0) / (X1 - X0)) * 0.45)))
          el.setAttribute('opacity', '0.9')
          el.setAttribute('class', 'fill-signal')
        }
      })
    }
    if (reducedMotion) return paint(0.4)
    let raf = 0
    const start = performance.now()
    const loop = (now: number) => {
      paint((now - start) / 1000)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [reducedMotion, n])

  return (
    <div className="relative pb-[4.5rem]">
      <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" role="img" aria-label={t({ es: 'Flujo ilustrativo de personas a lo largo de las seis paradas de una medición', en: 'Illustrative flow of people across the six stops of a measurement' })}>
        <defs>
          <linearGradient id="enc-river" x1="0" x2="1">
            <stop offset="0" stopColor="rgb(var(--signal))" stopOpacity="0.22" />
            <stop offset="1" stopColor="rgb(var(--signal))" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <path d={RIVER} fill="url(#enc-river)" />
        <path d={CENTER} fill="none" stroke="rgb(var(--signal))" strokeOpacity="0.5" strokeWidth="1.2" className="hd-flow" />
        <g ref={group}>
          {PARTICLES.map((p, i) => <circle key={i} r={p.size} cx={-10} cy={-10} />)}
        </g>
        {stations.map((s, i) => {
          const x = stationX(i, n)
          const y = baseY(x)
          const on = i === active
          return (
            <g key={s.id}>
              <line x1={x} x2={x} y1={y - 46} y2={y + 46} stroke="currentColor" strokeOpacity={on ? 0.5 : 0.15} strokeDasharray="2 4" />
              {on && <circle cx={x} cy={y} r="13" fill="none" stroke="rgb(var(--signal))" className="hd-ping" style={{ transformOrigin: `${x}px ${y}px` }} />}
              <circle cx={x} cy={y} r={on ? 11 : 7} className="transition-all duration-500" fill={on ? 'rgb(var(--signal))' : 'rgb(var(--bg))'} stroke="rgb(var(--signal))" strokeWidth="2" />
            </g>
          )
        })}
      </svg>
      {stations.map((s, i) => {
        const on = i === active
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => onPick(i)}
            aria-pressed={on}
            className="group absolute top-0 flex h-full w-[15%] -translate-x-1/2 flex-col items-center justify-between py-1 text-center"
            style={{ left: `${(stationX(i, n) / W) * 100}%` }}
          >
            <span className={`font-mono text-[10px] transition-opacity ${on ? 'text-signal opacity-100' : 'opacity-40 group-hover:opacity-80'}`}>{String(i + 1).padStart(2, '0')}</span>
            <span className="flex flex-col items-center gap-1">
              <span className={`text-sm leading-tight transition-opacity xl:text-base ${on ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>{t(s.name)}</span>
              <span className={`rounded-full border px-2 py-0.5 text-[9px] leading-tight transition-colors ${on ? 'border-signal text-signal' : 'border-fg/20 opacity-60'}`}>{t(s.who)}</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}

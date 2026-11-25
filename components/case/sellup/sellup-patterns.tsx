'use client'

import { useEffect, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { CaseLead } from '@/components/case/case-lead'
import { SELLUP_CASE, type AgentId, type CascadeStep } from '@/lib/content/cases/sellup/sellup-case'
import { useCompact } from './camera'

/** En qué escalón se detuvo cada agente en la corrida contada (índice del paso) */
const STOP_AT: Record<AgentId, number> = { a1: 0, a2: 0, a3: 3 }
/** Cuánto tarda en bajar un escalón (ms) */
const STEP_MS = 650
/** Cuánto se queda leyendo dónde se detuvo antes de pasar al siguiente agente (ms) */
const HOLD_MS = 4200
/** Si la persona elige algo, la escalera espera esto antes de seguir sola (ms) */
const RESUME_MS = 9000

const COST: Record<CascadeStep['cost'], { color: string; label: L }> = {
  free: { color: '#34d399', label: { es: 'Gratis', en: 'Free' } },
  low: { color: '#38bdf8', label: { es: 'Bajo costo', en: 'Low cost' } },
  paid: { color: '#f59e0b', label: { es: 'De pago', en: 'Paid' } },
  human: { color: 'rgb(var(--signal))', label: { es: 'Persona', en: 'Person' } },
}

/** Lienzo y posición de cada escalón (unidades del SVG), en escritorio y en teléfono */
const LAYOUT = {
  wide: { w: 960, h: 380, at: (i: number) => ({ x: 70 + i * 164, y: 50 + i * 50 }) },
  tall: { w: 360, h: 620, at: (i: number) => ({ x: 28 + i * 12, y: 34 + i * 108 }) },
} as const

type Pt = { x: number; y: number }
/** Un escalón: sale horizontal del nodo y baja con una curva hasta el siguiente */
const stairWide = (a: Pt, b: Pt) => `M${a.x} ${a.y} C${a.x + (b.x - a.x) * 0.7} ${a.y}, ${b.x - (b.x - a.x) * 0.25} ${b.y}, ${b.x} ${b.y}`
const stairTall = (a: Pt, b: Pt) => `M${a.x} ${a.y} C${a.x} ${a.y + (b.y - a.y) * 0.6}, ${b.x} ${b.y - (b.y - a.y) * 0.4}, ${b.x} ${b.y}`
/** El salto de donde se detuvo hasta la persona: un arco por fuera de la escalera */
const jumpWide = (a: Pt, b: Pt) => `M${a.x} ${a.y} C${a.x + 120} ${a.y - 120}, ${b.x + 60} ${b.y - 200}, ${b.x} ${b.y}`
const jumpTall = (a: Pt, b: Pt) => `M${a.x} ${a.y} C${a.x - 30} ${a.y + 120}, ${b.x - 40} ${b.y - 120}, ${b.x} ${b.y}`

/**
 * 02 · Patrones: la escalera «primero lo gratis», la misma forma en los tres
 * agentes. La señal baja escalón por escalón, de lo gratis a lo de pago, y
 * apenas cumple la meta salta a la persona: lo que no hizo falta queda apagado.
 * Pasa sola de un agente al siguiente; tocar un escalón dice qué es.
 */
export function SellUpPatterns() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const compact = useCompact()
  const { patterns } = SELLUP_CASE
  const rootRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const [agentIndex, setAgentIndex] = useState(0)
  const [walker, setWalker] = useState(-1)
  const [note, setNote] = useState<number | null>(null)
  const [heldUntil, setHeldUntil] = useState(0)

  const cascade = patterns.cascades[agentIndex]
  const stop = STOP_AT[cascade.id]
  const last = cascade.steps.length - 1
  const L_ = compact ? LAYOUT.tall : LAYOUT.wide
  const pts = cascade.steps.map((_, i) => L_.at(i))
  const stair = compact ? stairTall : stairWide
  const jump = compact ? jumpTall : jumpWide

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: '0px 0px -30% 0px' })
    io.observe(root)
    return () => io.disconnect()
  }, [])

  // La señal baja hasta su escalón y salta a la persona.
  useEffect(() => {
    if (!inView) return
    if (reducedMotion) {
      setWalker(last)
      return
    }
    setWalker(-1)
    const path = [...Array.from({ length: stop + 1 }, (_, i) => i), last]
    const timers = path.map((p, i) => window.setTimeout(() => setWalker(p), (i + 1) * STEP_MS))
    return () => timers.forEach(window.clearTimeout)
  }, [agentIndex, inView, reducedMotion, stop, last])

  // Ya en la persona, lee un momento y pasa al agente siguiente.
  useEffect(() => {
    if (!inView || reducedMotion || walker !== last) return
    const wait = Math.max(HOLD_MS, heldUntil - Date.now())
    const id = window.setTimeout(() => {
      setNote(null)
      setAgentIndex((a) => (a + 1) % patterns.cascades.length)
    }, wait)
    return () => window.clearTimeout(id)
  }, [inView, reducedMotion, walker, last, heldUntil, patterns.cascades.length])

  const pickAgent = (i: number) => {
    setNote(null)
    setAgentIndex(i)
    setHeldUntil(Date.now() + RESUME_MS)
  }
  const pickNote = (i: number) => {
    setNote(note === i ? null : i)
    setHeldUntil(Date.now() + RESUME_MS)
  }

  const reached = (i: number) => walker >= i && (i <= stop || i === last)
  const skipped = (i: number) => i > stop && i < last
  const done = walker === last
  const shown = note !== null ? cascade.steps[note] : null

  return (
    <div ref={rootRef}>
      <CaseLead className="mb-10">{t({ es: 'La misma forma apareció en los tres agentes: bajar de lo gratis a lo de pago y detenerse apenas se cumple la meta.', en: 'The same shape showed up in all three agents: step down from free to paid and stop as soon as the goal is met.' })}</CaseLead>

      {/* Los tres agentes: nodos chicos, el activo encendido */}
      <div role="tablist" aria-label={t({ es: 'Agentes', en: 'Agents' })} className="flex flex-wrap justify-center gap-x-8 gap-y-3">
        {patterns.cascades.map((c, i) => {
          const on = i === agentIndex
          return (
            <button key={c.id} type="button" role="tab" aria-selected={on} onClick={() => pickAgent(i)} className="group flex items-center gap-2.5 outline-none">
              <span className={`h-2.5 w-2.5 rounded-full border transition-all duration-500 ${on ? 'border-white bg-signal shadow-[0_0_12px_rgb(var(--signal))]' : 'border-white/40 bg-transparent'}`} />
              <span className={`text-sm transition-opacity ${on ? 'opacity-100' : 'opacity-50 group-hover:opacity-85'}`}>{t(c.agent)}</span>
            </button>
          )
        })}
      </div>
      <p key={`goal-${agentIndex}`} className="su-fade mt-4 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-paper/45">{t(cascade.goal)}</p>

      <div className="relative mx-auto mt-8 w-full" style={{ maxWidth: L_.w, aspectRatio: `${L_.w} / ${L_.h}` }}>
        <svg viewBox={`0 0 ${L_.w} ${L_.h}`} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
          {pts.slice(0, -1).map((a, i) => {
            const b = pts[i + 1]
            const lit = reached(i) && reached(i + 1) && !skipped(i + 1)
            return (
              <g key={`${cascade.id}-${i}`}>
                <path d={stair(a, b)} fill="none" stroke="white" strokeOpacity={skipped(i + 1) && done ? 0.16 : 0.12} strokeWidth={1.5} strokeDasharray={skipped(i + 1) && done ? '3 6' : undefined} />
                <path d={stair(a, b)} fill="none" stroke="rgb(var(--signal))" strokeWidth={2} pathLength={1} strokeDasharray="1" strokeDashoffset={lit ? 0 : 1} style={{ transition: `stroke-dashoffset ${STEP_MS}ms linear`, filter: 'drop-shadow(0 0 4px rgb(var(--signal) / 0.7))' }} />
              </g>
            )
          })}
          {/* Se cumplió la meta: salta por fuera de la escalera hasta la persona */}
          {stop < last - 1 && (
            <path key={`jump-${cascade.id}`} d={jump(pts[stop], pts[last])} fill="none" stroke="rgb(var(--signal))" strokeWidth={1.5} strokeDasharray="1" pathLength={1} strokeDashoffset={done ? 0 : 1} style={{ transition: `stroke-dashoffset ${STEP_MS}ms ease-out`, opacity: 0.8 }} />
          )}
        </svg>

        {cascade.steps.map((s, i) => {
          const p = pts[i]
          const isHere = walker === i
          const on = reached(i)
          const off = skipped(i) && done
          const color = COST[s.cost].color
          return (
            <button
              key={`${cascade.id}-${s.name.es}`}
              type="button"
              onClick={() => pickNote(i)}
              aria-pressed={note === i}
              className={`group absolute flex outline-none ${compact ? '-translate-y-1/2 flex-row items-center gap-3 text-left' : '-translate-x-1/2 -translate-y-[11px] flex-col items-center text-center'}`}
              style={{ left: `${(p.x / L_.w) * 100}%`, top: `${(p.y / L_.h) * 100}%`, width: compact ? '78%' : 150 }}
            >
              <span className="relative grid h-[22px] w-[22px] shrink-0 place-items-center" aria-hidden="true">
                {isHere && <span className="absolute inset-[-6px] rounded-full border animate-[nav-node-ping_1.8s_cubic-bezier(0,0,.2,1)_infinite]" style={{ borderColor: color }} />}
                <span
                  className="h-full w-full rounded-full border transition-all duration-500"
                  style={{ background: on ? color : 'rgb(var(--void))', borderColor: on ? 'white' : 'rgb(255 255 255 / 0.35)', boxShadow: on ? `0 0 16px ${color}` : 'none', opacity: off ? 0.5 : 1, transform: isHere ? 'scale(1.15)' : 'scale(1)' }}
                />
                {i === last && <span data-fiber-from="su-idea" className="absolute left-1/2 top-1/2 h-px w-px" />}
              </span>
              <span className={compact ? '' : 'mt-3'}>
                <span className={`block text-balance text-[13px] leading-snug transition-opacity duration-500 ${off ? 'line-through decoration-white/40 opacity-45' : on ? 'opacity-100' : 'opacity-55 group-hover:opacity-85'}`}>{t(s.name)}</span>
                <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.16em]" style={{ color, opacity: off ? 0.45 : 0.8 }}>{t(COST[s.cost].label)}</span>
              </span>
            </button>
          )
        })}
      </div>

      {/* Dónde se detuvo (o qué es el escalón tocado): una o dos líneas */}
      <p key={`${agentIndex}-${note ?? (done ? 'stop' : 'run')}`} aria-live="polite" className={`su-fade mx-auto mt-10 min-h-[3.2em] max-w-[60ch] text-balance text-center leading-relaxed text-paper/75 transition-opacity ${shown || done ? 'opacity-100' : 'opacity-0'}`}>
        {shown ? `${t(shown.name)} · ${t(shown.note)}` : t(cascade.stop)}
      </p>
    </div>
  )
}

'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { useStepper } from './forma-ui'

/**
 * El último paso del constructor, «Alineación», con los textos del ciclo
 * «KPIs corporativos 2026» del staging: tres objetivos de empresa a la
 * izquierda, tres metas asignadas a Comercial a la derecha. Se arrastra el
 * punto azul de cada meta hasta el objetivo de empresa al que empuja.
 */

const BLUE = '#0c5bef'
const W = 760
const H = 400
const CARD_W = 210
const LEFT_X = 90
const RIGHT_X = 460

const COMPANY = [
  { id: 'margen', title: 'Subir el margen bruto', desc: 'Margen sobre ventas del periodo, después de costo directo.', y: 70 },
  { id: 'cartera', title: 'Reducir la cartera vencida', desc: 'Saldo por cobrar con más de 60 días de mora.', y: 165 },
  { id: 'gasto', title: 'Cumplir el presupuesto de gasto', desc: 'Gasto ejecutado frente al aprobado para el periodo.', y: 260 },
] as const

const ASSIGNED = [
  { id: 'a1', title: 'Mejorar el margen del área', area: 'Comercial', weight: 40, y: 75, target: 'margen' },
  { id: 'a2', title: 'Bajar la mora de las cuentas del área', area: 'Comercial', weight: 35, y: 170, target: 'cartera' },
  { id: 'a3', title: 'Ejecutar el presupuesto del área sin desviarse', area: 'Comercial', weight: 25, y: 265, target: 'gasto' },
] as const

const CARD_H = 70
const mid = (y: number) => y + CARD_H / 2
const companyPort = (id: string) => {
  const c = COMPANY.find((x) => x.id === id)
  return { x: LEFT_X + CARD_W, y: mid(c ? c.y : 0) }
}
const assignedDot = (id: string) => {
  const a = ASSIGNED.find((x) => x.id === id)
  return { x: RIGHT_X, y: mid(a ? a.y : 0) }
}
const curve = (from: { x: number; y: number }, to: { x: number; y: number }) => {
  const dx = (from.x - to.x) / 2
  return `M${from.x} ${from.y} C${from.x - dx} ${from.y} ${to.x + dx} ${to.y} ${to.x} ${to.y}`
}

type Links = Record<string, string | null>
const EMPTY: Links = { a1: null, a2: null, a3: null }

/** Dónde cae el cursor, en coordenadas del lienzo. */
function useCanvasPoint(ref: React.RefObject<HTMLDivElement>) {
  return useCallback(
    (e: { clientX: number; clientY: number }) => {
      const r = ref.current?.getBoundingClientRect()
      if (!r) return { x: 0, y: 0 }
      return { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H }
    },
    [ref],
  )
}

export function AlignmentBuilder() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const canvas = useRef<HTMLDivElement>(null)
  const toCanvas = useCanvasPoint(canvas)
  const [links, setLinks] = useState<Links>(reducedMotion ? { a1: 'margen', a2: 'cartera', a3: 'gasto' } : EMPTY)
  const [drag, setDrag] = useState<{ from: string; x: number; y: number } | null>(null)
  const [touched, setTouched] = useState(false)
  const [ghost, setGhost] = useState<{ x: number; y: number; down: boolean } | null>(null)
  const { ref, seen } = useStepper(100000, 1)

  const done = Object.values(links).filter(Boolean).length
  const pct = Math.round((done / ASSIGNED.length) * 100)

  // Si nadie lo toca, un cursor hace las conexiones una a una; al terminar, espera y vuelve a empezar.
  useEffect(() => {
    if (touched || reducedMotion || !seen) return
    const pending = ASSIGNED.find((a) => !links[a.id])
    if (!pending) {
      const id = window.setTimeout(() => setLinks(EMPTY), 3200)
      return () => window.clearTimeout(id)
    }
    const from = assignedDot(pending.id)
    const to = companyPort(pending.target)
    let raf = 0
    let start = 0
    const DUR = 1100
    const wait = window.setTimeout(() => {
      setGhost({ ...from, down: true })
      const tick = (now: number) => {
        if (!start) start = now
        const k = Math.min(1, (now - start) / DUR)
        const e = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2
        const p = { x: from.x + (to.x - from.x) * e, y: from.y + (to.y - from.y) * e }
        setDrag({ from: pending.id, ...p })
        setGhost({ ...p, down: true })
        if (k < 1) raf = requestAnimationFrame(tick)
        else {
          setDrag(null)
          setGhost({ ...p, down: false })
          setLinks((l) => ({ ...l, [pending.id]: pending.target }))
        }
      }
      raf = requestAnimationFrame(tick)
    }, 700)
    return () => {
      window.clearTimeout(wait)
      cancelAnimationFrame(raf)
    }
  }, [links, touched, reducedMotion, seen])

  const takeOver = () => {
    setTouched(true)
    setGhost(null)
  }

  const onDotDown = (id: string) => (e: React.PointerEvent) => {
    takeOver()
    ;(e.target as Element).setPointerCapture?.(e.pointerId)
    setDrag({ from: id, ...toCanvas(e) })
  }
  const onMove = (e: React.PointerEvent) => {
    if (drag) setDrag({ ...drag, ...toCanvas(e) })
  }
  const onUp = (e: React.PointerEvent) => {
    if (!drag) return
    const p = toCanvas(e)
    const hit = COMPANY.find((c) => p.x >= LEFT_X - 10 && p.x <= LEFT_X + CARD_W + 30 && p.y >= c.y - 10 && p.y <= c.y + CARD_H + 10)
    if (hit) setLinks((l) => ({ ...l, [drag.from]: hit.id }))
    setDrag(null)
  }
  const cut = (id: string) => {
    takeOver()
    setLinks((l) => ({ ...l, [id]: null }))
  }

  return (
    <div ref={ref} data-reveal="device" className="relative overflow-hidden rounded-3xl bg-[#0b0d16] p-4 md:p-8">
      <span className="pointer-events-none absolute -left-24 top-1/3 h-96 w-96 rounded-full bg-[#0c5bef] opacity-25 blur-3xl" aria-hidden="true" />
      <div className="relative overflow-hidden rounded-2xl bg-white text-[#161a2c] shadow-[0_50px_100px_-30px_rgba(0,0,0,0.85)]">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-black/[0.06] px-5 py-4">
          <div>
            <p className="text-[15px] font-medium">Mapa de alineación</p>
            <p className="mt-0.5 text-[12px] text-black/55">
              <span className="font-medium tabular-nums" style={{ color: done === 3 ? '#067647' : BLUE }}>{done} de 3 alineados · {pct} %</span> · Cada meta asignada y el objetivo de empresa al que empuja.
            </p>
          </div>
          <span className="flex rounded-lg bg-black/[0.04] p-0.5 text-[12px]">
            {['Objetivos', 'Agrupación', 'Colaboradores'].map((v, i) => (
              <span key={v} className={`rounded-md px-3 py-1 ${i === 0 ? 'bg-white shadow-sm' : 'text-black/50'}`}>{v}</span>
            ))}
          </span>
        </div>

        <div className="overflow-x-auto">
          <div
            ref={canvas}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerLeave={() => setDrag(null)}
            className="relative min-w-[620px] touch-none select-none"
            style={{ aspectRatio: `${W} / ${H}`, backgroundColor: '#fafbfc', backgroundImage: 'radial-gradient(rgba(22,26,44,0.14) 1px, transparent 1.2px)', backgroundSize: '18px 18px' }}
          >
            {/* Las flechas: de la meta asignada al objetivo de empresa. */}
            <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden="true">
              <defs>
                <marker id="obj-arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="7" markerHeight="7" orient="auto">
                  <path d="M1,1 L9,5 L1,9 Z" fill={BLUE} />
                </marker>
              </defs>
              {ASSIGNED.map((a) => {
                const to = links[a.id]
                if (!to) return null
                const d = curve(assignedDot(a.id), companyPort(to))
                return (
                  <g key={a.id} className="group cursor-pointer" onClick={() => cut(a.id)}>
                    <path d={d} fill="none" stroke="transparent" strokeWidth={16} />
                    <path d={d} fill="none" stroke={BLUE} strokeWidth={2} markerEnd="url(#obj-arrow)" pathLength={1} strokeDasharray={1} className="obj-draw transition-[stroke] group-hover:stroke-[#d92d20]" style={{ animationDuration: '0.5s' }} />
                  </g>
                )
              })}
              {drag && <path d={curve(assignedDot(drag.from), drag)} fill="none" stroke={BLUE} strokeWidth={2} strokeDasharray="5 5" />}
            </svg>

            {COMPANY.map((c) => {
              const count = Object.values(links).filter((v) => v === c.id).length
              const hot = drag !== null
              return (
                <div key={c.id} className={`absolute rounded-xl border bg-white p-3 transition-[box-shadow,border-color] duration-300 ${hot ? 'border-[#0c5bef]/50 shadow-[0_0_0_4px_rgba(12,91,239,0.12)]' : 'border-black/10 shadow-sm'}`} style={{ left: `${(LEFT_X / W) * 100}%`, top: `${(c.y / H) * 100}%`, width: `${(CARD_W / W) * 100}%`, height: `${(CARD_H / H) * 100}%` }}>
                  <span className="absolute -left-[5px] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full" style={{ background: BLUE }} />
                  <span className="absolute -right-[4px] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[#0c5bef]/40" />
                  <p className="truncate text-[11px] font-medium">{c.title}</p>
                  <p className="truncate text-[10px] text-black/50">{c.desc}</p>
                  <span className={`mt-1 inline-block rounded px-1.5 py-0.5 text-[9px] transition-colors ${count ? 'bg-[#0c5bef]/10 text-[#0c5bef]' : 'bg-black/[0.05] text-black/40'}`}>{count ? `${count} aporte` : 'Sin aportes'}</span>
                </div>
              )
            })}

            {ASSIGNED.map((a) => {
              const linked = Boolean(links[a.id])
              return (
                <div key={a.id} className="absolute rounded-xl border border-black/10 bg-white p-3 shadow-sm" style={{ left: `${(RIGHT_X / W) * 100}%`, top: `${(a.y / H) * 100}%`, width: `${(CARD_W / W) * 100}%`, height: `${(CARD_H / H) * 100}%` }}>
                  <button
                    type="button"
                    onPointerDown={onDotDown(a.id)}
                    aria-label={`Alinear «${a.title}»`}
                    className="absolute -left-[9px] top-1/2 grid h-[18px] w-[18px] -translate-y-1/2 cursor-grab place-items-center rounded-full active:cursor-grabbing"
                  >
                    <span className={`h-3 w-3 rounded-full ${linked ? '' : 'animate-pulse'}`} style={{ background: BLUE, boxShadow: '0 0 0 4px rgba(12,91,239,0.18)' }} />
                  </button>
                  <p className="truncate text-[11px] font-medium">{a.title}</p>
                  <p className="text-[10px] text-black/50">{a.area}</p>
                  <span className="mt-1 inline-flex items-center gap-1.5 text-[9px] text-black/55">
                    <span className="rounded bg-[#0c5bef]/10 px-1.5 py-0.5 text-[#0c5bef]">{a.weight} %</span> Grupal
                  </span>
                </div>
              )
            })}

            {/* El cursor del recorrido automático. */}
            {ghost && (
              <span className="pointer-events-none absolute z-10 -translate-x-1 -translate-y-1 transition-transform duration-150" style={{ left: `${(ghost.x / W) * 100}%`, top: `${(ghost.y / H) * 100}%`, transform: ghost.down ? 'scale(0.9)' : 'scale(1)' }} aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24"><path d="M4 2 L20 12 L12 13.5 L9 21 Z" fill="#161a2c" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" /></svg>
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-black/[0.06] px-5 py-3 text-[11px] text-black/50">
          <span>⟶ Arrastra el punto azul hasta un objetivo de la empresa</span>
          <span>✂ Toca una flecha para cortarla</span>
          {touched && (
            <button type="button" onClick={() => { setTouched(false); setLinks(EMPTY) }} className="ml-auto rounded-md border border-black/10 px-2.5 py-1 text-black/70 hover:border-black/30">
              {t({ es: 'Ver la demostración', en: 'Watch the demo' })}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

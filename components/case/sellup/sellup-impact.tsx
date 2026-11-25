'use client'

import { useEffect, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { CaseLead } from '@/components/case/case-lead'
import { RECEIPTS, type Receipt } from '@/lib/content/cases/sellup/sellup-agents'

/** Cada cuánto se imprime una línea (ms) */
const LINE_MS = 260
/** Pausa entre un recibo y el siguiente (ms) */
const BETWEEN_MS = 700
/** Ya impresos, cada cuánto se enciende el siguiente para leer su nota (ms) */
const READ_MS = 4600

/** Líneas que imprime cada recibo: las suyas y el total */
const linesOf = (r: Receipt) => r.lines.length + 1

/** El borde de abajo, cortado en dientes como un ticket */
function Teeth() {
  return (
    <svg viewBox="0 0 100 6" preserveAspectRatio="none" className="block h-2 w-full" aria-hidden="true">
      <path d="M0 0 H100 V0 L95 6 L90 0 L85 6 L80 0 L75 6 L70 0 L65 6 L60 0 L55 6 L50 0 L45 6 L40 0 L35 6 L30 0 L25 6 L20 0 L15 6 L10 0 L5 6 L0 0 Z" fill="#f1ede4" />
    </svg>
  )
}

interface TicketProps {
  receipt: Receipt
  printed: number
  active: boolean
  onPick: () => void
}

/** Un recibo de una corrida real: se imprime línea por línea y cierra con su total */
function Ticket({ receipt, printed, active, onPick }: TicketProps) {
  const { t } = useLocale()
  const total = printed > receipt.lines.length
  return (
    <button
      type="button"
      onClick={onPick}
      aria-pressed={active}
      className={`group relative block w-full shrink-0 snap-center text-left outline-none transition-all duration-700 ease-expo max-md:w-[78%] ${active ? 'md:-translate-y-3' : 'md:translate-y-0'}`}
      style={{ filter: active ? 'drop-shadow(0 24px 50px rgb(var(--signal) / 0.35))' : 'drop-shadow(0 18px 30px rgb(0 0 0 / 0.5))', opacity: printed === 0 ? 0.25 : active ? 1 : 0.7 }}
    >
      <div className="rounded-t-[6px] bg-[#f1ede4] px-5 pb-4 pt-5 font-mono text-[#1c1b19]">
        <p className="flex items-baseline justify-between text-[10px] uppercase tracking-[0.14em] text-[#1c1b19]/55">
          <span>{t(receipt.agent)}</span>
          <span>{receipt.date}</span>
        </p>
        <p className="mt-2 font-sans text-[17px] font-medium leading-tight">{t(receipt.title)}</p>
        <p className="mt-3 border-t border-dashed border-[#1c1b19]/25" aria-hidden="true" />
        <ul className="mt-3 min-h-[9.5rem] space-y-1.5 text-[12px]">
          {receipt.lines.map((l, i) => (
            <li key={l.label.es} className={`flex justify-between gap-3 ${i < printed ? 'su-print' : 'invisible'}`}>
              <span className="text-[#1c1b19]/70">{t(l.label)}</span>
              <span className="tabular-nums">{l.value}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 border-t border-dashed border-[#1c1b19]/25" aria-hidden="true" />
        <p className={`relative mt-3 flex items-baseline justify-between gap-3 ${total ? 'su-print' : 'invisible'}`}>
          <span className="text-[10px] uppercase tracking-[0.12em] text-[#1c1b19]/60">{t(receipt.total.label)}</span>
          <span className="text-[22px] font-medium tabular-nums">{receipt.total.value}</span>
        </p>
      </div>
      <Teeth />
    </button>
  )
}

/**
 * 06 · Impacto: tres recibos de corridas reales en Producción, uno por
 * agente. Al entrar se imprimen uno tras otro, línea por línea; después se
 * enciende uno a la vez y debajo queda lo que enseñó. Tocar uno lo elige.
 */
export function SellUpImpact() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const rootRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  /** Cuántas líneas lleva impresas cada recibo */
  const [printed, setPrinted] = useState<readonly number[]>(() => RECEIPTS.map((r) => (reducedMotion ? linesOf(r) : 0)))
  const [active, setActive] = useState(0)
  const [picked, setPicked] = useState(false)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: '0px 0px -25% 0px' })
    io.observe(root)
    return () => io.disconnect()
  }, [])

  const printing = printed.findIndex((n, i) => n < linesOf(RECEIPTS[i]))
  const allPrinted = printing === -1

  // Se imprimen uno tras otro; mientras, el que se imprime es el activo.
  useEffect(() => {
    if (!inView || allPrinted) return
    if (reducedMotion) {
      setPrinted(RECEIPTS.map(linesOf))
      return
    }
    const first = printed[printing] === 0 && printing > 0
    const id = window.setTimeout(() => {
      setActive(printing)
      setPrinted((p) => p.map((n, i) => (i === printing ? n + 1 : n)))
    }, first ? BETWEEN_MS : LINE_MS)
    return () => window.clearTimeout(id)
  }, [inView, allPrinted, printing, printed, reducedMotion])

  // Ya impresos, se enciende uno a la vez para leer su nota.
  useEffect(() => {
    if (!inView || !allPrinted || reducedMotion) return
    const id = window.setTimeout(() => {
      setPicked(false)
      setActive((a) => (a + 1) % RECEIPTS.length)
    }, picked ? READ_MS * 2 : READ_MS)
    return () => window.clearTimeout(id)
  }, [inView, allPrinted, active, picked, reducedMotion])

  // En teléfono los recibos se deslizan: el encendido siempre queda a la vista (sin mover la página).
  useEffect(() => {
    const track = trackRef.current
    const ticket = track?.children[active] as HTMLElement | undefined
    if (!track || !ticket || track.scrollWidth <= track.clientWidth) return
    track.scrollTo({ left: ticket.offsetLeft - (track.clientWidth - ticket.offsetWidth) / 2, behavior: reducedMotion ? 'auto' : 'smooth' })
  }, [active, reducedMotion])

  const current = RECEIPTS[active]

  return (
    <div ref={rootRef}>
      <CaseLead className="mb-4">{t({ es: 'Todavía no hay ventas que atribuirle. Lo que sí está medido es cuánto cuesta cada corrida.', en: 'There are no sales to attribute to it yet. What is measured is what each run costs.' })}</CaseLead>
      <p className="mb-12 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-signal">{t({ es: 'Corridas reales en Producción · octubre de 2026', en: 'Real Production runs · October 2026' })}</p>

      <div ref={trackRef} className="relative mx-auto flex max-w-[960px] gap-5 max-md:-mx-[var(--gutter)] max-md:snap-x max-md:snap-mandatory max-md:overflow-x-auto max-md:px-[11%] max-md:pb-6 max-md:[scrollbar-width:none] md:grid md:grid-cols-3 md:gap-8 [&::-webkit-scrollbar]:hidden">
        {RECEIPTS.map((r, i) => (
          <Ticket
            key={r.title.es}
            receipt={r}
            printed={printed[i]}
            active={i === active}
            onPick={() => {
              setActive(i)
              setPicked(true)
            }}
          />
        ))}
      </div>

      {/* Lo que enseñó el recibo encendido */}
      <p key={active} aria-live="polite" className={`su-fade mx-auto mt-24 max-w-[56ch] text-balance text-center text-[clamp(1.05rem,0.9rem+0.6vw,1.4rem)] font-light leading-snug transition-opacity duration-500 ${printed[active] > 0 ? 'opacity-100' : 'opacity-0'}`}>
        {t(current.note)}
      </p>
      {/* Bajo la lección, el nodo del que sale la fibra hacia «Demo» */}
      <span aria-hidden="true" className="relative mx-auto mt-10 block h-2.5 w-2.5 rounded-full border border-white/70 bg-signal shadow-[0_0_14px_rgb(var(--signal))]">
        <span data-fiber-from="su-demo" className="absolute left-1/2 top-1/2 h-px w-px" />
      </span>
    </div>
  )
}

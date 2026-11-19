'use client'

import { useEffect, useRef, useState } from 'react'
import { useLocale, type L } from '@/lib/i18n'
import type { CascadeStep } from '@/lib/content/cases/sellup/sellup-case'

/** Paleta de SellUp (flux-ui de UBITS): grises neutros y el azul de la marca. */
export const BLUE = '#5b7eff'
export const BLUE_DEEP = '#1d3fc4'
export const OK = '#10b981'
export const WARN = '#f59e0b'

/** Escenario oscuro de las piezas en vivo. */
export const STAGE = 'relative overflow-hidden rounded-[20px] bg-[#0b0e14] p-5 text-[#e9ecf3] ring-1 ring-white/10 md:p-8'
/** Superficie clara, como una tarjeta de la plataforma. */
export const SURFACE = 'rounded-[14px] border border-black/[0.08] bg-white text-[#14161b] shadow-[0_1px_2px_rgba(0,0,0,0.05)]'

/** El logo y la palabra viven en `brand.tsx`, con la tipografía y los tokens del producto. */
export { SellUpMark, SellUpWordmark } from './brand'

const COST_STYLE: Record<CascadeStep['cost'], { label: L; cls: string }> = {
  free: { label: { es: 'Gratis', en: 'Free' }, cls: 'bg-emerald-400/15 text-emerald-300' },
  low: { label: { es: 'Bajo costo', en: 'Low cost' }, cls: 'bg-sky-400/15 text-sky-300' },
  paid: { label: { es: 'De pago', en: 'Paid' }, cls: 'bg-amber-400/15 text-amber-300' },
  human: { label: { es: 'Persona', en: 'Person' }, cls: 'bg-[#5b7eff]/20 text-[#b7c6ff]' },
}

/** Etiqueta de costo de una fuente. */
export function CostChip({ cost }: { cost: CascadeStep['cost'] }) {
  const { t } = useLocale()
  const s = COST_STYLE[cost]
  return <span className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${s.cls}`}>{t(s.label)}</span>
}

/** Verdadero desde que el elemento entra en pantalla (una sola vez). */
export function useInView<T extends HTMLElement>(threshold = 0.3): [React.RefObject<T>, boolean] {
  const ref = useRef<T>(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setSeen(true)
        io.disconnect()
      }
    }, { threshold })
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return [ref, seen]
}

/** Encabezado numerado de una sub-sección dentro de un capítulo. */
export function Section({ n, title, body, children }: { n: string; title: L; body: L; children: React.ReactNode }) {
  const { t } = useLocale()
  return (
    <section className="mt-[clamp(4rem,3rem+4vw,7rem)] first:mt-0">
      <h3 data-reveal="mask" className="mb-4 flex items-baseline gap-4 text-[clamp(1.35rem,1rem+1vw,1.9rem)]">
        <span className="mono-label text-signal">{n}</span>
        {t(title)}
      </h3>
      <p data-reveal className="mb-8 max-w-[62ch] leading-relaxed opacity-80">{t(body)}</p>
      {children}
    </section>
  )
}

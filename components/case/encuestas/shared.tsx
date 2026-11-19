'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useLocale } from '@/lib/i18n'
import { useA11y } from '@/lib/a11y'
import type { Shot } from '@/lib/content/cases/encuestas/types'

/** Tonos de la escala de favorabilidad del producto (1 a 5), del más desfavorable al más favorable. */
export const FAV = ['#e0675f', '#f0a07a', '#f1c56c', '#8ccfa4', '#43a970'] as const

/** Color de una celda según su promedio de 1 a 5, con los mismos cortes que el producto. */
export function favColor(score: number): string {
  if (score < 2) return FAV[0]
  if (score < 3) return FAV[1]
  if (score < 4) return FAV[2]
  if (score < 5) return FAV[3]
  return FAV[4]
}

/** Azul de UBITS, para las piezas que imitan el producto. */
export const UBITS_BLUE = '#0c5bef'

/** Un contador que avanza solo cada `ms` (se queda quieto con movimiento reducido). */
export function useTicker(ms: number, enabled = true): number {
  const { reducedMotion } = useA11y()
  const [tick, setTick] = useState(0)
  useEffect(() => {
    if (!enabled || reducedMotion) return
    const id = window.setInterval(() => setTick((n) => n + 1), ms)
    return () => window.clearInterval(id)
  }, [ms, enabled, reducedMotion])
  return tick
}

interface ScreenProps {
  shot: Shot
  /** Ruta real del playground, se muestra en la barra. */
  route?: string
  className?: string
  sizes?: string
  priority?: boolean
}

/** Una captura real dentro de una ventana sobria, con la ruta del producto en la barra. */
export function Screen({ shot, route, className = '', sizes = '(min-width: 1024px) 60vw, 100vw', priority = false }: ScreenProps) {
  const { t } = useLocale()
  return (
    <figure className={`overflow-hidden rounded-xl bg-white shadow-[0_30px_80px_-30px_rgba(10,11,13,0.55)] ring-1 ring-black/10 ${className}`}>
      <div className="flex items-center gap-2 border-b border-black/[0.06] bg-[#f6f7fb] px-3 py-2" aria-hidden="true">
        <span className="flex gap-1">
          <span className="h-2 w-2 rounded-full bg-black/15" />
          <span className="h-2 w-2 rounded-full bg-black/15" />
          <span className="h-2 w-2 rounded-full bg-black/15" />
        </span>
        {route && <span className="truncate font-mono text-[10px] text-black/45">{route}</span>}
      </div>
      <Image src={shot.src} width={shot.width} height={shot.height} alt={t(shot.alt)} sizes={sizes} priority={priority} className="block h-auto w-full" />
    </figure>
  )
}

/** Etiqueta de «cifra de referencia», para no hacer pasar una meta por un resultado medido. */
export function ReferenceTag() {
  const { t } = useLocale()
  return (
    <span className="ml-2 inline-flex items-center rounded-full border border-current px-1.5 py-px align-middle font-mono text-[9px] uppercase tracking-wider opacity-60">
      {t({ es: 'referencia', en: 'reference' })}
    </span>
  )
}

/** Candado pequeño de los grupos reservados. */
export function Lock({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="3.5" y="7" width="9" height="6.5" rx="1.5" />
      <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
    </svg>
  )
}

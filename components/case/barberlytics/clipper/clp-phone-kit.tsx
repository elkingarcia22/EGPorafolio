'use client'

import type { ReactNode } from 'react'
import { useNarrow } from '../use-narrow'

/** Teléfono (< 768 px): ahí cada escena se recompone en vertical, no se achica. */
export const usePhone = () => useNarrow('(max-width: 767px)')

export interface SpineItem {
  id: string
  color: string
  /** Encendido: su nodo brilla y la fibra que llega a él está dibujada */
  lit: boolean
  /** El que se mira ahora: halo más fuerte y un aro que late */
  hot?: boolean
  /** Nodo propio (el orbe, un glifo); si no, un punto con halo */
  node?: ReactNode
  children: ReactNode
  /** Tocar la fila (para ver el detalle) */
  onPick?: () => void
  label?: string
}

interface SpineProps {
  items: readonly SpineItem[]
  /** Índice del tramo por el que baja ahora un impulso (del nodo i al i+1) */
  pulseAt?: number | null
  reducedMotion: boolean
  /** Separación entre filas */
  gap?: string
  /** La fibra no llega: tramos rojos punteados que parpadean, como un cable roto */
  broken?: boolean
}

const NODE = 48

/** Un punto de la red: halo de color, núcleo blanco y, si es el que se mira, un aro que late. */
export function SpineDot({ color, lit, hot = false, reducedMotion }: { color: string; lit: boolean; hot?: boolean; reducedMotion: boolean }) {
  return (
    <span className="relative grid h-full w-full place-items-center">
      <span className="absolute h-10 w-10 rounded-full transition-opacity duration-500" style={{ background: color, opacity: lit ? (hot ? 0.3 : 0.12) : 0 }} />
      {hot && !reducedMotion && <span className="clp-ping absolute h-6 w-6 rounded-full border" style={{ borderColor: color }} />}
      <span
        className="relative h-3.5 w-3.5 rounded-full border transition-all duration-500"
        style={{ borderColor: lit ? 'white' : 'rgb(255 255 255 / 0.35)', background: lit ? (hot ? 'white' : color) : 'rgb(var(--void))', boxShadow: lit ? `0 0 12px ${color}` : 'none' }}
      />
    </span>
  )
}

/**
 * La columna del teléfono: nodos uno debajo del otro, unidos por una fibra
 * con el gradiente de IA que se enciende tramo a tramo. A la derecha de cada
 * nodo, su texto, en HTML y a tamaño de lectura.
 */
export function Spine({ items, pulseAt = null, reducedMotion, gap = 'pb-8', broken = false }: SpineProps) {
  return (
    <ol className="relative">
      {items.map((it, i) => {
        const next = items[i + 1]
        const body = (
          <>
            <span className="relative shrink-0" style={{ width: NODE, height: NODE }}>
              {it.node ?? <SpineDot color={it.color} lit={it.lit} hot={it.hot} reducedMotion={reducedMotion} />}
            </span>
            <span className="min-w-0 flex-1 pt-1 text-left">{it.children}</span>
          </>
        )
        return (
          <li key={it.id} className={`relative ${next ? gap : ''}`}>
            {next && (
              <span aria-hidden="true" className="absolute w-px" style={{ left: NODE / 2, top: NODE / 2, bottom: -NODE / 2 }}>
                <span className="absolute inset-0 bg-white/10" />
                <span
                  className={`absolute inset-0 origin-top transition-transform duration-700 ease-expo ${broken && next.lit && !reducedMotion ? 'clp-flicker' : ''}`}
                  style={{
                    backgroundImage: broken ? `repeating-linear-gradient(180deg, ${next.color} 0 5px, transparent 5px 10px)` : `linear-gradient(180deg, ${it.color}, ${next.color})`,
                    transform: next.lit ? 'scaleY(1)' : 'scaleY(0)',
                    boxShadow: broken ? 'none' : `0 0 8px ${next.color}`,
                  }}
                />
                {pulseAt === i && !reducedMotion && <span key={`p${i}`} className="clp-drop absolute -left-[2px] h-3 w-[5px] rounded-full bg-white shadow-[0_0_8px_white]" />}
              </span>
            )}
            {it.onPick ? (
              <button type="button" onClick={it.onPick} aria-pressed={it.hot} aria-label={it.label} className="flex w-full items-start gap-4 outline-none">
                {body}
              </button>
            ) : (
              <div className="flex items-start gap-4">{body}</div>
            )}
          </li>
        )
      })}
    </ol>
  )
}

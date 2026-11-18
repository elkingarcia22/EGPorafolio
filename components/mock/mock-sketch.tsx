import type { MockKind } from '@/lib/content/projects'
import { LAYOUTS } from './layouts'

interface MockSketchProps {
  kind: MockKind
  /** variante: cambia el "pulso" del trazo para que cada boceto sea distinto */
  variant?: number
  className?: string
}

const W = 100

/** Pseudoaleatorio determinista: el mismo boceto en servidor y cliente. */
function wobble(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453
  return (x - Math.floor(x) - 0.5) * 1.6
}

function roughRect(x: number, y: number, w: number, h: number, seed: number): string {
  // Redondeo: evita diferencias de coma flotante entre servidor y navegador.
  const p = (base: number, n: number) => (base + wobble(seed + n)).toFixed(2)
  return [
    `M${p(x, 1)} ${p(y, 2)}`,
    `L${p(x + w, 3)} ${p(y, 4)}`,
    `L${p(x + w, 5)} ${p(y + h, 6)}`,
    `L${p(x, 7)} ${p(y + h, 8)}`,
    `Z`,
  ].join(' ')
}

/**
 * Boceto a mano alzada generado a partir del layout: trazos irregulares
 * que se dibujan (stroke-dashoffset) cuando entran en pantalla.
 */
export function MockSketch({ kind, variant = 0, className = '' }: MockSketchProps) {
  const layout = LAYOUTS[kind]
  const H = W / layout.aspect
  return (
    <svg viewBox={`-2 -2 ${W + 4} ${H + 4}`} className={className} fill="none" aria-hidden="true">
      {layout.blocks.map((b, i) => {
        // Las variantes desplazan/omiten bloques: exploraciones distintas.
        if (variant > 0 && (i + variant) % 4 === 0) return null
        const shift = variant * 2.5 * ((i % 2) ? 1 : -1)
        const x = (b.x / 100) * W + (b.role === 'nav' ? 0 : shift * 0.3)
        const y = (b.y / 100) * H
        const w = (b.w / 100) * W
        const h = (b.h / 100) * H
        return (
          <g key={i}>
            <path
              d={roughRect(x, y, w, h, i * 7 + variant * 31)}
              data-sketch-stroke
              pathLength={1}
              strokeDasharray="1"
              className="stroke-ink"
              strokeWidth="0.45"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {b.hot && (
              <path
                d={`M${x + 1} ${y + h + 1.2} q ${w / 4} 1.2 ${w / 2} 0 t ${w / 2 - 2} 0`}
                data-sketch-stroke
                pathLength={1}
                strokeDasharray="1"
                className="stroke-signal"
                strokeWidth="0.6"
                strokeLinecap="round"
              />
            )}
          </g>
        )
      })}
    </svg>
  )
}

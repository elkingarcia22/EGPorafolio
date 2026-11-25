'use client'

import { useEffect, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { CardAnatomyBoard, ProposeBoard } from './sketch-boards'
import { ViewsBoard } from './sketch-views'
import { useInView } from './use-auto-steps'

interface Sketch {
  id: string
  name: L
  Board: React.ComponentType
  /** Cómo quedó arrugado: giro de la bola de papel */
  tilt: number
}

const SKETCHES: readonly Sketch[] = [
  { id: 'card', name: { es: 'La tarjeta dinámica', en: 'The dynamic card' }, Board: CardAnatomyBoard, tilt: -9 },
  { id: 'views', name: { es: 'Las rejillas', en: 'The grids' }, Board: ViewsBoard, tilt: 7 },
  { id: 'propose', name: { es: 'La rejilla que propone', en: 'The grid that proposes' }, Board: ProposeBoard, tilt: -4 },
]
/** Cada cuánto se abre el siguiente boceto, hasta que alguien toque uno */
const NEXT_MS = 6500
/** Ancho de diseño del tablero (su mínimo) y de la miniatura arrugada */
const BOARD_W = 820
const THUMB_W = 132

/**
 * Bocetos de «Forma»: arriba, los bocetos arrugados como bolas de papel; uno
 * a uno se abren y bajan al centro como una hoja que se despliega. Pasan
 * solos; tocar uno lo abre y se queda.
 */
export function SketchUnfold() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const rootRef = useRef<HTMLDivElement>(null)
  const inView = useInView(rootRef, '0px 0px -20% 0px')
  const [open, setOpen] = useState(0)
  const [auto, setAuto] = useState(true)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (inView) setStarted(true)
  }, [inView])
  useEffect(() => {
    if (!auto || !inView || reducedMotion) return
    const id = window.setTimeout(() => setOpen((o) => (o + 1) % SKETCHES.length), NEXT_MS)
    return () => window.clearTimeout(id)
  }, [auto, inView, reducedMotion, open])

  const current = SKETCHES[open]

  return (
    <div ref={rootRef}>
      {/* Las bolas de papel, arriba */}
      <ol className="flex items-end justify-center gap-6 sm:gap-10">
        {SKETCHES.map((s, i) => {
          const isOpen = open === i
          return (
            <li key={s.id}>
              <button
                type="button"
                aria-pressed={isOpen}
                aria-label={t(s.name)}
                onClick={() => {
                  setAuto(false)
                  setOpen(i)
                }}
                className="group flex flex-col items-center outline-none"
              >
                <span
                  className={`pl-crumple relative block overflow-hidden transition-[opacity,transform,filter] duration-500 ${isOpen ? 'scale-75 opacity-25 blur-[1px]' : 'opacity-90 group-hover:-translate-y-1 group-hover:opacity-100'}`}
                  style={{ width: THUMB_W, height: THUMB_W * 0.62, rotate: `${s.tilt}deg` }}
                  aria-hidden="true"
                >
                  <span className="pointer-events-none absolute left-0 top-0 origin-top-left" style={{ width: BOARD_W, transform: `scale(${THUMB_W / BOARD_W})` }}>
                    <s.Board />
                  </span>
                  <span className="pl-creases absolute inset-0" />
                </span>
                <span className={`mt-3 max-w-[16ch] text-balance text-center text-[12px] leading-snug transition-colors duration-300 ${isOpen ? 'text-[#d9b36a]' : 'text-paper/55 group-hover:text-paper/85'}`}>{t(s.name)}</span>
              </button>
            </li>
          )
        })}
      </ol>

      {/* El boceto abierto: baja de arriba y se despliega */}
      <div className="relative mt-12 [perspective:1600px]">
        <div key={current.id} className={`relative ${started ? 'pl-unfold' : 'opacity-0'}`}>
          <current.Board />
          <span aria-hidden="true" className={`pl-creases pointer-events-none absolute inset-0 ${started ? 'pl-creases-out' : ''}`} />
        </div>
      </div>
    </div>
  )
}

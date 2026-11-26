'use client'

import { useEffect, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { CardAnatomyBoard, ProposeBoard } from './sketch-boards'
import { ViewsBoard } from './sketch-views'
import { useInView } from './use-auto-steps'
import { useNarrow } from '../use-narrow'
import { SketchPan, type PanStop } from './sketch-pan'

interface Sketch {
  id: string
  name: L
  Board: React.ComponentType
  /** Cómo quedó arrugado: giro de la bola de papel */
  tilt: number
  /** Medidas de diseño del tablero */
  design: { w: number; h: number }
  /** En teléfono, las partes que se recorren una a una (centros, en medidas de diseño) */
  stops: readonly PanStop[]
}

/** Las siete vistas del tablero de rejillas: dónde cae cada una (como en sketch-views) */
const VIEW_STOPS: readonly PanStop[] = [
  { x: 195, y: 180 },
  ...[380, 710, 1040].map((x) => ({ x: x + 145, y: 230 })),
  ...[50, 380, 710].map((x) => ({ x: x + 145, y: 580 })),
  { x: 1190, y: 580 },
]

const SKETCHES: readonly Sketch[] = [
  { id: 'card', name: { es: 'La tarjeta dinámica', en: 'The dynamic card' }, Board: CardAnatomyBoard, tilt: -9, design: { w: 1400, h: 720 }, stops: [{ x: 370, y: 250 }, { x: 850, y: 300 }, { x: 1210, y: 300 }, { x: 450, y: 600 }] },
  { id: 'views', name: { es: 'Las rejillas', en: 'The grids' }, Board: ViewsBoard, tilt: 7, design: { w: 1400, h: 800 }, stops: VIEW_STOPS },
  { id: 'propose', name: { es: 'La rejilla que propone', en: 'The grid that proposes' }, Board: ProposeBoard, tilt: -4, design: { w: 1400, h: 720 }, stops: [{ x: 260, y: 330 }, { x: 640, y: 330 }, { x: 450, y: 600 }, { x: 1140, y: 250 }, { x: 1145, y: 560 }] },
]
/** Cada cuánto se abre el siguiente boceto, hasta que alguien toque uno */
const NEXT_MS = 6500
/** Ancho de diseño del tablero (su mínimo) y de la miniatura arrugada */
const BOARD_W = 820
const THUMB_W = 132
const THUMB_W_NARROW = 92
/** En teléfono, cada cuánto la cámara pasa a la siguiente parte del boceto */
const PAN_MS = 2800

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
  const narrow = useNarrow('(max-width: 767px)')
  const [stop, setStop] = useState(0)
  const thumbW = narrow ? THUMB_W_NARROW : THUMB_W

  useEffect(() => {
    if (inView) setStarted(true)
  }, [inView])
  const current = SKETCHES[open]
  const lastStop = current.stops.length - 1

  /** Una parte más (en teléfono); al acabar el boceto, se abre el siguiente */
  const step = (dir: 1 | -1) => {
    if (dir === 1 && stop < lastStop) return setStop(stop + 1)
    if (dir === -1 && stop > 0) return setStop(stop - 1)
    const next = (open + dir + SKETCHES.length) % SKETCHES.length
    setOpen(next)
    setStop(dir === 1 ? 0 : SKETCHES[next].stops.length - 1)
  }

  useEffect(() => {
    if (!auto || !inView || reducedMotion) return
    const id = narrow
      ? window.setTimeout(() => step(1), stop === 0 ? PAN_MS + 600 : PAN_MS)
      : window.setTimeout(() => setOpen((o) => (o + 1) % SKETCHES.length), NEXT_MS)
    return () => window.clearTimeout(id)
    // step cambia en cada render; lo que mueve el reloj es open/stop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto, inView, reducedMotion, open, stop, narrow])

  return (
    <div ref={rootRef}>
      {/* Las bolas de papel, arriba */}
      <ol className="flex items-end justify-center gap-4 sm:gap-10">
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
                  setStop(0)
                }}
                className="group flex flex-col items-center outline-none"
              >
                <span
                  className={`pl-crumple relative block overflow-hidden transition-[opacity,transform,filter] duration-500 ${isOpen ? 'scale-75 opacity-25 blur-[1px]' : 'opacity-90 group-hover:-translate-y-1 group-hover:opacity-100'}`}
                  style={{ width: thumbW, height: thumbW * 0.62, rotate: `${s.tilt}deg` }}
                  aria-hidden="true"
                >
                  <span className="pointer-events-none absolute left-0 top-0 origin-top-left" style={{ width: BOARD_W, transform: `scale(${thumbW / BOARD_W})` }}>
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
          {narrow ? (
            <SketchPan
              Board={current.Board}
              design={current.design}
              stops={current.stops}
              stop={stop}
              onNext={() => {
                setAuto(false)
                step(1)
              }}
              onPrev={() => {
                setAuto(false)
                step(-1)
              }}
            />
          ) : (
            <current.Board />
          )}
          <span aria-hidden="true" className={`pl-creases pointer-events-none absolute inset-0 ${started ? 'pl-creases-out' : ''}`} />
        </div>
      </div>
    </div>
  )
}

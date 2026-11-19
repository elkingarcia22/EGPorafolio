'use client'

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { useLocale } from '@/lib/i18n'
import { useCompact } from './camera'

/**
 * Tablero de bocetos en teléfono y tableta: en vez de encoger todo el tablero hasta
 * que la letra a mano no se lee, se dibuja a un ancho legible y se recorre deslizando,
 * con un punto de parada por columna. En escritorio el tablero queda tal cual.
 */

/** Ancho al que se dibuja el tablero: la letra más chica (0,95 cqw) queda en ~11 px. */
const BOARD_PX = 1160

interface SwipeBoardProps {
  /** Ancho de diseño del tablero (el `w` de `Board`). */
  designW: number
  /** Dónde empieza cada columna, en px de diseño. */
  stops: readonly number[]
  /** Columna a mostrar (p. ej. el agente elegido); la cámara se desliza hasta ella. */
  focus?: number
  children: ReactNode
}

export function SwipeBoard({ designW, stops, focus, children }: SwipeBoardProps) {
  const compact = useCompact()
  if (!compact) return <>{children}</>
  return <SwipeTrack designW={designW} stops={stops} focus={focus}>{children}</SwipeTrack>
}

function SwipeTrack({ designW, stops, focus, children }: SwipeBoardProps) {
  const { t } = useLocale()
  const scroller = useRef<HTMLDivElement>(null)
  const [at, setAt] = useState(0)
  const left = useCallback((i: number) => (stops[i] / designW) * BOARD_PX, [stops, designW])

  const go = useCallback((i: number) => {
    scroller.current?.scrollTo({ left: left(i), behavior: 'smooth' })
  }, [left])

  useEffect(() => {
    if (focus !== undefined) go(focus)
  }, [focus, go])

  const onScroll = () => {
    const x = scroller.current?.scrollLeft ?? 0
    const near = stops.reduce((best, _, i) => (Math.abs(left(i) - x) < Math.abs(left(best) - x) ? i : best), 0)
    setAt(near)
  }

  return (
    <div className="swipe-board">
      <div
        ref={scroller}
        onScroll={onScroll}
        className="-mx-[var(--gutter)] snap-x snap-mandatory overflow-x-auto overscroll-x-contain px-[var(--gutter)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ scrollPaddingInline: 'var(--gutter)' }}
      >
        <div className="relative" style={{ width: BOARD_PX }}>
          {children}
          {stops.map((x) => (
            <span key={x} className="pointer-events-none absolute top-0 h-px w-px snap-start" style={{ left: (x / designW) * BOARD_PX }} aria-hidden="true" />
          ))}
        </div>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <span className="font-mono text-[11px] uppercase tracking-wider text-fg/50">{t({ es: 'Desliza el tablero', en: 'Swipe the board' })} →</span>
        <span className="ml-auto flex gap-1.5">
          {stops.map((x, i) => (
            <button
              key={x}
              type="button"
              onClick={() => go(i)}
              aria-label={t({ es: `Ir a la columna ${i + 1}`, en: `Go to column ${i + 1}` })}
              aria-current={at === i}
              className="grid h-6 w-6 place-items-center"
            >
              <span className={`block h-2 rounded-full transition-all duration-300 ${at === i ? 'w-5 bg-signal' : 'w-2 bg-fg/25'}`} />
            </button>
          ))}
        </span>
      </div>
    </div>
  )
}

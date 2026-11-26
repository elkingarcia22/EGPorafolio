'use client'

import { useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { ENCUESTAS_CASE } from '@/lib/content/cases/encuestas/case'
import type { Iteration } from '@/lib/content/cases/encuestas/types'
import { useAutoplay } from '../objetivos/use-autoplay'
import { SketchDrawing } from './enc-sketch-drawings'

const ITERATIONS = ENCUESTAS_CASE.iterations
const STEP_MS = 4200
/** Cómo queda cada hoja ya pasada en la pila, debajo de la de encima: corrida y girada un poco */
const UNDER = [
  { x: -3, y: -4, r: -3.5 },
  { x: 3, y: -2.5, r: 2.5 },
  { x: -2, y: -1, r: -1.5 },
  { x: 0, y: 0, r: 0 },
]
/** El nombre corto de cada iteración */
const SHORT: Record<Iteration['shape'], L> = {
  chat: { es: 'Chat de importación', en: 'Import chat' },
  drawer: { es: 'Panel lateral', en: 'Side panel' },
  tree: { es: 'Árbol de secciones', en: 'Section tree' },
  system: { es: 'Sistema de diseño', en: 'Design system' },
}

/**
 * Los bocetos como hojas de papel calco: cada iteración se dibuja a lápiz
 * sobre una hoja cuadriculada y translúcida que se posa encima de la anterior,
 * así que lo que se descartó todavía se ve por debajo. Avanza solo; tocar una
 * pestaña trae esa hoja y dice qué se descartó y qué quedó.
 */
export function EncSketchSheets() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const rootRef = useRef<HTMLDivElement>(null)
  const [picked, setPicked] = useState(false)
  const { index, go } = useAutoplay(rootRef, { count: ITERATIONS.length, ms: STEP_MS, loop: true, disabled: reducedMotion, hold: picked })
  const it = ITERATIONS[index]

  return (
    <div ref={rootRef} className="flex flex-col items-center">
      {/* La pila de hojas: las ya pasadas quedan debajo, la actual se posa encima */}
      <div className="relative w-full max-w-[min(760px,calc((100svh-18rem)*1.5))]" style={{ aspectRatio: '600 / 400', perspective: '1600px' }}>
        {ITERATIONS.map((x, i) => {
          const on = i === index
          const under = i < index
          const p = UNDER[i]
          const transform = on
            ? 'translate3d(0,0,0) rotate(0deg) rotateX(0deg)'
            : under
              ? `translate3d(${p.x}%, ${p.y}%, 0) rotate(${p.r}deg)`
              : 'translate3d(8%, 14%, 0) rotate(6deg) rotateX(18deg)'
          return (
            <div
              key={x.id}
              aria-hidden={!on}
              className="enc-tracing absolute inset-0 rounded-[6px]"
              style={{
                transform,
                opacity: on ? 1 : under ? 0.55 - (index - i - 1) * 0.15 : 0,
                zIndex: on ? 10 : i,
                transition: reducedMotion ? 'none' : 'transform 900ms cubic-bezier(.16,1,.3,1), opacity 700ms',
              }}
            >
              {/* Al llegar arriba, el lápiz vuelve a dibujar la hoja */}
              <svg key={on ? `on-${index}` : 'idle'} viewBox="0 0 600 400" role={on ? 'img' : undefined} aria-label={on ? `${x.name}: ${t(x.tried)}` : undefined} className="h-full w-full">
                <SketchDrawing shape={x.shape} />
                <text x={566} y={28} textAnchor="end" className="font-hand" fontSize={16} fill="#3b3f46" opacity={0.7}>V{i + 1}</text>
              </svg>
            </div>
          )
        })}
      </div>

      {/* Pestañas: una por hoja */}
      <ol className="mt-10 flex flex-wrap justify-center gap-2">
        {ITERATIONS.map((x, i) => {
          const on = i === index
          return (
            <li key={x.id}>
              <button
                type="button"
                onClick={() => {
                  setPicked(true)
                  go(i)
                }}
                aria-pressed={on}
                className={`rounded-full border px-3.5 py-1.5 text-[13px] transition-colors duration-300 ${on ? 'border-signal bg-signal/15 text-paper' : 'border-white/15 text-paper/55 hover:border-white/35 hover:text-paper'}`}
              >
                <span className="mr-1.5 font-mono text-[10px] text-signal">V{i + 1}</span>
                {t(SHORT[x.shape])}
              </button>
            </li>
          )
        })}
      </ol>

      <div key={`${index}-${picked}`} className="obj-fade mx-auto mt-6 min-h-[4.5rem] w-full max-w-[820px]" aria-live="polite">
        {picked ? (
          <div className="grid gap-5 md:grid-cols-2">
            <p className="border-l border-white/15 pl-4 text-sm leading-relaxed text-paper/60"><span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.14em]">{t({ es: 'Se descartó', en: 'Dropped' })}</span>{t(it.dropped)}</p>
            <p className="border-l border-signal/60 pl-4 text-sm leading-relaxed text-paper/85"><span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.14em] text-signal">{t({ es: 'Quedó', en: 'Kept' })}</span>{t(it.kept)}</p>
          </div>
        ) : (
          <p className="text-center font-mono text-[11px] uppercase tracking-[0.12em] text-paper/50">{it.name} · {t(it.when)}</p>
        )}
      </div>
    </div>
  )
}

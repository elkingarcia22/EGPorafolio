'use client'

import { useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { ENCUESTAS_CASE } from '@/lib/content/cases/encuestas/case'
import type { Iteration } from '@/lib/content/cases/encuestas/types'
import { useAutoplay } from '../objetivos/use-autoplay'

const ITERATIONS = ENCUESTAS_CASE.iterations
const STEP_MS = 3400
/** El nombre corto de cada iteración en la línea del tiempo, por su forma */
const SHORT: Record<Iteration['shape'], L> = {
  chat: { es: 'Chat de importación', en: 'Import chat' },
  drawer: { es: 'Panel lateral', en: 'Side panel' },
  tree: { es: 'Árbol de secciones', en: 'Section tree' },
  system: { es: 'Sistema de diseño', en: 'Design system' },
}

/** Trazo de boceto: se dibuja al aparecer */
const ink = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const, pathLength: 1, strokeDasharray: 1, className: 'obj-draw' }
const soft = { ...ink, strokeOpacity: 0.45 }

/** Los cuatro bocetos, dibujados como wireframes de una sola tinta (lienzo 600 × 340) */
function Sketch({ shape }: { shape: Iteration['shape'] }) {
  if (shape === 'chat') {
    return (
      <g>
        <rect x={10} y={10} width={580} height={320} rx={14} {...soft} />
        <line x1={330} y1={10} x2={330} y2={330} {...soft} />
        {[40, 104, 168, 232].map((y, i) => (
          <rect key={y} x={i % 2 ? 120 : 34} y={y} width={i % 2 ? 186 : 200} height={44} rx={16} {...ink} style={{ animationDelay: `${i * 120}ms` }} />
        ))}
        <rect x={34} y={286} width={272} height={28} rx={14} {...soft} />
        {[44, 84, 124, 164, 204].map((y, i) => (
          <path key={y} d={`M${360 + (i % 3) * 18} ${y} h${180 - (i % 3) * 30}`} {...ink} style={{ animationDelay: `${300 + i * 90}ms` }} />
        ))}
      </g>
    )
  }
  if (shape === 'drawer') {
    return (
      <g>
        <rect x={10} y={10} width={580} height={320} rx={14} {...soft} />
        {[50, 90, 130, 170, 210, 250].map((y) => <path key={y} d={`M40 ${y} h220`} {...soft} />)}
        <rect x={320} y={10} width={270} height={320} rx={14} {...ink} />
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <circle cx={360 + i * 90} cy={52} r={12} {...ink} style={{ animationDelay: `${200 + i * 140}ms` }} />
            {i < 2 && <path d={`M${374 + i * 90} 52 h62`} {...soft} />}
          </g>
        ))}
        {[100, 156, 212].map((y, i) => <rect key={y} x={344} y={y} width={222} height={36} rx={8} {...ink} style={{ animationDelay: `${500 + i * 110}ms` }} />)}
        <rect x={470} y={282} width={96} height={30} rx={15} {...ink} style={{ animationDelay: '850ms' }} />
      </g>
    )
  }
  if (shape === 'tree') {
    const rows = [
      { d: 0, y: 40 }, { d: 1, y: 84 }, { d: 2, y: 122 }, { d: 2, y: 160 }, { d: 1, y: 204 }, { d: 0, y: 252 }, { d: 1, y: 294 },
    ]
    return (
      <g>
        <rect x={10} y={10} width={580} height={320} rx={14} {...soft} />
        <path d="M46 52 V264 M86 96 V172 M86 216 V216 M46 264" {...soft} />
        {rows.map((r, i) => (
          <g key={r.y}>
            <circle cx={46 + r.d * 40} cy={r.y + 12} r={r.d === 0 ? 8 : 6} {...ink} style={{ animationDelay: `${i * 90}ms` }} />
            <rect x={66 + r.d * 40} y={r.y} width={r.d === 2 ? 300 : 240} height={24} rx={6} {...ink} style={{ animationDelay: `${i * 90 + 60}ms` }} />
          </g>
        ))}
        <rect x={440} y={40} width={124} height={270} rx={10} {...soft} />
      </g>
    )
  }
  return (
    <g>
      <rect x={10} y={10} width={580} height={320} rx={14} {...soft} />
      <rect x={10} y={10} width={44} height={320} rx={14} {...soft} />
      <path d="M54 52 H590" {...soft} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={80} y={74 + i * 84} width={484} height={68} rx={12} {...ink} style={{ animationDelay: `${i * 160}ms` }} />
          <path d={`M100 ${96 + i * 84} h240`} {...soft} />
          {[0, 1, 2, 3, 4].map((k) => <circle key={k} cx={112 + k * 40} cy={122 + i * 84} r={8} {...ink} style={{ animationDelay: `${i * 160 + 200 + k * 50}ms` }} />)}
        </g>
      ))}
    </g>
  )
}

/**
 * 04 · Bocetos: las cuatro iteraciones como un boceto que se redibuja. Debajo,
 * la línea del tiempo con un nodo por iteración. Pasan solas; tocar una dice
 * qué se descartó y qué quedó.
 */
export function EncIterationSketch() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const rootRef = useRef<HTMLDivElement>(null)
  const [picked, setPicked] = useState<number | null>(null)
  const { index } = useAutoplay(rootRef, { count: ITERATIONS.length, ms: STEP_MS, loop: true, disabled: reducedMotion, hold: picked !== null })
  const active = picked ?? index
  const it = ITERATIONS[active]

  return (
    <div ref={rootRef} className="relative mt-6">
      <div className="mx-auto w-full max-w-[640px] text-paper/90">
        <svg key={it.id} viewBox="0 0 600 340" className="block h-auto w-full overflow-visible" role="img" aria-label={`${it.name}: ${t(it.tried)}`}>
          <Sketch shape={it.shape} />
        </svg>
      </div>

      {/* La línea del tiempo: un nodo por iteración */}
      <ol className="relative mx-auto mt-12 grid max-w-[860px] grid-cols-4">
        <span aria-hidden="true" className="absolute inset-x-[12.5%] top-[7px] h-px bg-white/12" />
        <span aria-hidden="true" className="absolute left-[12.5%] top-[7px] h-px w-3/4 origin-left bg-gradient-to-r from-signal to-[rgb(var(--spark))] transition-transform duration-700 ease-expo" style={{ transform: `scaleX(${active / (ITERATIONS.length - 1)})` }} />
        {ITERATIONS.map((x, i) => {
          const on = i === active
          return (
            <li key={x.id} className="relative flex flex-col items-center">
              <button type="button" onClick={() => setPicked(picked === i ? null : i)} aria-pressed={picked === i} className="group flex flex-col items-center outline-none">
                <span className="relative grid h-3.5 w-3.5 place-items-center" aria-hidden="true">
                  <span className={`absolute inset-0 rounded-full border transition-all duration-500 ${on ? 'scale-125 border-white bg-[#fffaf0] shadow-[0_0_0_4px_rgb(var(--signal)/0.25),0_0_18px_4px_rgb(var(--signal)/0.7)]' : i < active ? 'border-white/60 bg-signal' : 'border-white/35 bg-void'}`} />
                  {/* De la última iteración sale la fibra hacia «Forma» */}
                  {i === ITERATIONS.length - 1 && <span data-fiber-from="enc-forma" className="absolute left-1/2 top-1/2 h-px w-px" />}
                </span>
                <span className={`mt-3 font-mono text-[10px] uppercase tracking-[0.14em] transition-opacity ${on ? 'text-signal' : 'opacity-50 group-hover:opacity-80'}`}>V{i + 1}</span>
                <span className={`mt-1 max-w-[16ch] text-balance text-center text-[13px] leading-snug transition-opacity md:text-[15px] ${on ? 'opacity-100' : 'opacity-50 group-hover:opacity-80'}`}>{t(SHORT[x.shape])}</span>
              </button>
            </li>
          )
        })}
      </ol>

      <div key={`${active}-${picked !== null}`} className="obj-fade mx-auto mt-8 min-h-[5rem] max-w-[820px]" aria-live="polite">
        {picked === null ? (
          <p className="text-center">
            <span className="block text-balance text-[clamp(1.1rem,0.95rem+0.6vw,1.45rem)] font-light leading-snug">{it.name}</span>
            <span className="mt-2 block font-mono text-[11px] uppercase tracking-[0.12em] text-paper/50">{t(it.when)}</span>
          </p>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            <p className="border-l border-white/15 pl-4 text-sm leading-relaxed text-paper/60"><span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.14em]">{t({ es: 'Se descartó', en: 'Dropped' })}</span>{t(it.dropped)}</p>
            <p className="border-l border-signal/60 pl-4 text-sm leading-relaxed text-paper/85"><span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.14em] text-signal">{t({ es: 'Quedó', en: 'Kept' })}</span>{t(it.kept)}</p>
          </div>
        )}
      </div>
    </div>
  )
}

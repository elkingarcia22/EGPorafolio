'use client'

import { useState } from 'react'
import { useLocale, type L } from '@/lib/i18n'
import { favColor, Lock, UBITS_BLUE, useTicker } from './shared'

const ROUTE = '/admin/desempeno-cultura/encuestas'

interface MomentProps {
  index: string
  title: L
  why: L
  flip?: boolean
  /** La pieza ocupa todo el ancho y el texto va arriba, en dos columnas. */
  wide?: boolean
  children: React.ReactNode
}

/** Un momento ganador: la pieza animada grande y por qué gana. */
export function Moment({ index, title, why, flip = false, wide = false, children }: MomentProps) {
  const { t } = useLocale()
  if (wide) {
    return (
      <section>
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-5">
            <p data-reveal className="mono-label text-signal">{index}</p>
            <h3 data-reveal="mask" className="mt-3 text-[clamp(1.6rem,1rem+1.6vw,2.4rem)] font-light leading-[1.05]">{t(title)}</h3>
          </div>
          <p data-reveal className="leading-relaxed opacity-75 lg:col-span-7">{t(why)}</p>
        </div>
        <div data-reveal="device" className="mt-8 min-w-0">{children}</div>
      </section>
    )
  }
  return (
    <section className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
      <div data-reveal="device" className={`min-w-0 lg:col-span-8 ${flip ? 'lg:order-2' : ''}`}>{children}</div>
      <div className={`lg:col-span-4 ${flip ? 'lg:order-1' : ''}`}>
        <p data-reveal className="mono-label text-signal">{index}</p>
        <h3 data-reveal="mask" className="mt-3 text-[clamp(1.6rem,1rem+1.6vw,2.4rem)] font-light leading-[1.05]">{t(title)}</h3>
        <p data-reveal className="mt-4 leading-relaxed opacity-75">{t(why)}</p>
      </div>
    </section>
  )
}

/** Marco de navegador claro para las piezas que imitan el producto. */
export function BrowserFrame({ route, children, className = '' }: { route: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-2xl bg-[#f8faff] text-[#303a47] shadow-[0_40px_90px_-40px_rgba(10,11,13,0.55)] ring-1 ring-black/10 ${className}`}>
      <div className="flex items-center gap-2 border-b border-black/[0.06] bg-white px-3 py-2" aria-hidden="true">
        <span className="flex gap-1">
          <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
          <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
          <span className="h-2 w-2 rounded-full bg-[#28c840]" />
        </span>
        <span className="ml-2 truncate rounded-md bg-[#f1f3f8] px-2 py-0.5 font-mono text-[10px] text-black/45">{route}</span>
      </div>
      {children}
    </div>
  )
}

const AREAS = [
  { name: 'Producto', start: 9, base: [4.2, 3.6, 4.4, 3.1] },
  { name: 'Finanzas', start: 1, base: [3.4, 3.0, 3.8, 2.4] },
  { name: 'Comercial', start: 2, base: [4.4, 4.1, 3.7, 3.3] },
  { name: 'Legal', start: 0, base: [3.9, 3.5, 4.0, 2.9] },
] as const
const ROWS: readonly L[] = [
  { es: 'Propósito', en: 'Purpose' },
  { es: 'Liderazgo', en: 'Leadership' },
  { es: 'Colaboración', en: 'Collaboration' },
  { es: 'Bienestar', en: 'Well-being' },
]
const STEPS = 9

/** Momento 3: el mínimo por grupo viaja al mapa de calor; las celdas se abren solas cuando llegan respuestas. */
export function AnonymityHeatmap() {
  const { t } = useLocale()
  const tick = useTicker(1300)
  const [min, setMin] = useState(5)
  const step = tick % STEPS
  const counts = AREAS.map((a, i) => Math.min(a.start + Math.max(0, step - i), a.start + 6))
  const open = counts.filter((n) => n >= min).length
  return (
    <BrowserFrame route={`${ROUTE}/open-cultura-ola2-2026/resultados`}>
      <div className="p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold">{t({ es: 'Mapa de calor · por área', en: 'Heatmap · by area' })}</p>
          <div className="flex items-center gap-2 rounded-full bg-white px-1 py-1 text-xs ring-1 ring-black/[0.08]">
            <span className="pl-2 text-[#5c646f]">{t({ es: 'Mínimo por grupo', en: 'Group minimum' })}</span>
            <button type="button" onClick={() => setMin((m) => Math.max(3, m - 1))} disabled={min <= 3} aria-label={t({ es: 'Bajar el mínimo', en: 'Lower the minimum' })} className="h-6 w-6 rounded-full hover:bg-[#ecf1fa] disabled:opacity-30">−</button>
            <span className="w-4 text-center font-semibold tabular-nums" aria-live="polite">{min}</span>
            <button type="button" onClick={() => setMin((m) => Math.min(10, m + 1))} aria-label={t({ es: 'Subir el mínimo', en: 'Raise the minimum' })} className="h-6 w-6 rounded-full hover:bg-[#ecf1fa]">+</button>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-[minmax(4.5rem,6rem)_repeat(4,minmax(0,1fr))] gap-1.5 text-[11px]">
          <span />
          {AREAS.map((a, c) => (
            <span key={a.name} className="truncate text-center text-[#5c646f]">
              {a.name}
              <span className={`block font-mono tabular-nums transition-colors ${counts[c] < min ? 'text-[#b26b00]' : 'text-[#2c6b2f]'}`}>n={counts[c]}</span>
            </span>
          ))}
          {ROWS.map((r, ri) => (
            <div key={r.es} className="contents">
              <span className="flex items-center truncate text-[#414a5c]">{t(r)}</span>
              {AREAS.map((a, c) => {
                const n = counts[c]
                const state = n === 0 ? 'empty' : n < min ? 'reserved' : 'open'
                return (
                  <span
                    key={`${a.name}-${state}`}
                    className={`flex h-10 items-center justify-center rounded-lg font-mono tabular-nums sm:h-12 ${state === 'open' ? 'encf-unlock text-[#14161a]' : 'bg-[#eceef3] text-[#979ba3]'}`}
                    style={state === 'open' ? { background: favColor(a.base[ri]), animationDelay: `${ri * 70}ms` } : undefined}
                  >
                    {state === 'open' ? a.base[ri].toFixed(1).replace('.', ',') : state === 'reserved' ? <Lock className="h-4 w-4" /> : '—'}
                  </span>
                )
              })}
            </div>
          ))}
        </div>
        <p className="mt-4 rounded-lg bg-white px-3 py-2 text-xs leading-snug text-[#414a5c] ring-1 ring-black/[0.06]" aria-live="polite">
          {t({ es: `${open} de 4 áreas se pueden leer. Las demás tienen respuestas, pero aún no alcanzan ${min}: nadie puede adivinar quién dijo qué.`, en: `${open} of 4 areas can be read. The rest have answers but haven’t reached ${min}: nobody can guess who said what.` })}
        </p>
      </div>
    </BrowserFrame>
  )
}

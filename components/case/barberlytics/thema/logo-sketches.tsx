'use client'

import { useEffect, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { THEMA_CASE } from '@/lib/content/cases/barberlytics/thema-case'
import { useInView } from './use-in-view'
import { ChapterHead } from './chapter-head'

const GOLD = '#e9b45d'

interface Direction {
  name: L
  note: L
  paths: readonly string[]
  accent?: readonly string[]
}

/** Las seis direcciones del logo (tablero de identidad de Barberlytics), en un lienzo de 100 × 100. */
const DIRECTIONS: readonly Direction[] = [
  { name: { es: 'Impulso', en: 'Impulse' }, note: { es: 'Evolución del logo actual.', en: 'Evolves the current logo.' }, paths: ['M20,58 L40,76'], accent: ['M40,76 L80,28', 'M64,28 L80,28 L80,44'] },
  { name: { es: 'Peine', en: 'Comb' }, note: { es: 'Los dientes son barras que crecen.', en: 'The teeth are growing bars.' }, paths: ['M14,26 L86,26', 'M26,26 L26,46', 'M42,26 L42,56', 'M58,26 L58,66'], accent: ['M74,26 L74,78'] },
  { name: { es: 'Poste', en: 'Pole' }, note: { es: 'Barbería, premium.', en: 'Barbershop, premium.' }, paths: ['M38,16 L62,16 L62,84 L38,84 Z', 'M34,12 L66,12', 'M34,88 L66,88'], accent: ['M38,34 L62,22', 'M38,54 L62,42', 'M38,74 L62,62'] },
  { name: { es: 'Navaja', en: 'Razor' }, note: { es: 'Carácter.', en: 'Character.' }, paths: ['M12,58 L58,40 L86,48 L40,66 Z', 'M58,40 L84,26'] },
  { name: { es: 'Placa', en: 'Plate' }, note: { es: 'Ícono de app, genérica.', en: 'App icon, generic.' }, paths: ['M26,18 L74,18 Q82,18 82,26 L82,74 Q82,82 74,82 L26,82 Q18,82 18,74 L18,26 Q18,18 26,18 Z'], accent: ['M30,66 L48,48 L56,56 L70,38'] },
  { name: { es: 'Sello', en: 'Seal' }, note: { es: 'Serif, editorial.', en: 'Serif, editorial.' }, paths: ['M50,12 a38,38 0 1 1 -0.1,0', 'M50,22 a28,28 0 1 1 -0.1,0'], accent: ['M36,60 L48,48 L54,54 L66,40'] },
]

/** Lo que se queda, en orden: la flecha, el pulso y el isotipo (lienzo de 100 × 50) */
const KEEPS: readonly { label: L; paths: readonly string[]; accent: readonly string[] }[] = [
  { label: { es: 'La flecha que sube', en: 'The rising arrow' }, paths: ['M6,40 L54,40'], accent: ['M54,40 L94,8', 'M80,8 L94,8 L94,22'] },
  { label: { es: 'Late como un pulso', en: 'Beats like a pulse' }, paths: ['M4,30 L30,30 L38,14 L48,44 L56,30 L70,30'], accent: ['M70,30 L94,6', 'M82,6 L94,6 L94,18'] },
  { label: { es: 'El isotipo', en: 'The isotype' }, paths: [], accent: ['M24,44 L44,28 L54,36 L74,14', 'M62,14 L74,14 L74,26'] },
]

/** Ritmo de la secuencia al entrar (ms): cada dirección, cada paso de lo que se queda y el logo */
const PACE = { first: 300, sketch: 200, keep: 420 } as const
/** Pasos: 1–6 las direcciones; 7–9 lo que se queda; 10 el logo oficial */
const LAST = DIRECTIONS.length + KEEPS.length + 1

function Strokes({ paths, accent, viewBox, on }: { paths: readonly string[]; accent?: readonly string[]; viewBox: string; on: boolean }) {
  return (
    <svg viewBox={viewBox} className="h-full w-full overflow-visible" aria-hidden="true">
      {paths.map((d, i) => (
        <path key={d} d={d} pathLength={1} fill="none" stroke="rgba(239,233,221,0.8)" strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" className={on ? 'th-draw' : ''} style={{ strokeDasharray: 1, strokeDashoffset: on ? undefined : 1, animationDelay: `${i * 70}ms` }} />
      ))}
      {accent?.map((d, i) => (
        <path key={d} d={d} pathLength={1} fill="none" stroke={GOLD} strokeWidth={3.6} strokeLinecap="round" strokeLinejoin="round" className={on ? 'th-draw' : ''} style={{ strokeDasharray: 1, strokeDashoffset: on ? undefined : 1, animationDelay: `${(paths.length + i) * 70}ms` }} />
      ))}
    </svg>
  )
}

/**
 * 04 · Bocetos de Thema: la marca primero. Las seis direcciones del logo se
 * dibujan solas, una tras otra; después, lo que se queda —la flecha, el pulso,
 * el isotipo— y al final el logo oficial. Tocar una dirección muestra su nota.
 * Del logo sale la fibra hacia «Forma».
 */
export function LogoSketches() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const { chapters } = THEMA_CASE
  const rootRef = useRef<HTMLDivElement>(null)
  const { entered } = useInView(rootRef)
  const [step, setStep] = useState(reducedMotion ? LAST : 0)
  const [picked, setPicked] = useState<number | null>(null)

  useEffect(() => {
    if (!entered || reducedMotion || step >= LAST) return
    const wait = step === 0 ? PACE.first : step < DIRECTIONS.length ? PACE.sketch : PACE.keep
    const id = window.setTimeout(() => setStep((s) => s + 1), wait)
    return () => window.clearTimeout(id)
  }, [entered, reducedMotion, step])

  const logoOn = step >= LAST

  return (
    <div ref={rootRef}>
      <ChapterHead phrase={t(chapters.bocetos.phrase)} lead={t(chapters.bocetos.lead)} />

      {/* Las seis direcciones, a mano alzada */}
      <ol className="mx-auto grid max-w-[920px] grid-cols-3 gap-x-4 gap-y-8 md:grid-cols-6">
        {DIRECTIONS.map((d, i) => {
          const on = step > i
          const isPicked = picked === i
          return (
            <li key={d.name.es}>
              <button
                type="button"
                aria-pressed={isPicked}
                onClick={() => setPicked(isPicked ? null : i)}
                className="group flex w-full flex-col items-center rounded-2xl p-2 outline-none focus-visible:ring-2 focus-visible:ring-signal"
              >
                <span className={`block aspect-square w-[74%] transition-transform duration-500 ease-expo ${isPicked ? 'scale-110' : 'group-hover:scale-105'}`}>
                  <Strokes paths={d.paths} accent={d.accent} viewBox="0 0 100 100" on={on} />
                </span>
                <span className={`mt-3 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors ${isPicked ? 'text-paper' : 'text-paper/50 group-hover:text-paper/80'}`}>0{i + 1} {t(d.name)}</span>
                {isPicked && <span className="th-fade mt-1 text-center text-xs leading-snug text-paper/65">{t(d.note)}</span>}
              </button>
            </li>
          )
        })}
      </ol>

      {/* Lo que se queda, de izquierda a derecha, hasta el logo oficial */}
      <div className="mx-auto mt-[clamp(3rem,2.5rem+2vw,4.5rem)] grid max-w-[980px] items-center gap-8 md:grid-cols-[repeat(3,minmax(0,1fr))_minmax(0,2fr)] md:gap-4">
        {KEEPS.map((k, i) => {
          const on = step > DIRECTIONS.length + i
          return (
            <div key={k.label.es} className="relative flex flex-col items-center">
              <span className={`block h-14 w-28 transition-opacity duration-300 ${on ? 'opacity-100' : 'opacity-0'}`}>
                {i === KEEPS.length - 1 ? (
                  <span className="grid h-full place-items-center">
                    <span className="grid h-14 w-14 place-items-center rounded-xl bg-[#2a2d33] ring-1 ring-white/10">
                      <span className="block h-10 w-10"><Strokes paths={[]} accent={k.accent} viewBox="10 4 76 50" on={on} /></span>
                    </span>
                  </span>
                ) : (
                  <Strokes paths={k.paths} accent={k.accent} viewBox="0 0 100 50" on={on} />
                )}
              </span>
              <span className={`mt-3 text-center font-mono text-[10px] uppercase tracking-[0.14em] transition-opacity duration-500 ${on ? 'text-paper/60' : 'opacity-0'}`}>{t(k.label)}</span>
              <span aria-hidden="true" className={`absolute -right-3 top-7 hidden text-paper/30 transition-opacity duration-500 md:block ${on ? 'opacity-100' : 'opacity-0'}`}>→</span>
            </div>
          )
        })}
        <figure className={`relative flex flex-col items-center transition-[opacity,transform,filter] duration-1000 ease-expo ${logoOn ? 'scale-100 opacity-100 blur-0' : 'scale-95 opacity-0 blur-sm'}`}>
          {/* eslint-disable-next-line @next/next/no-img-element -- SVG oficial del logo */}
          <img src="/cases/barberlytics/logo-official-paper.svg" alt="Barberlytics" width={1200} height={270} className="block h-auto w-full max-w-[360px] drop-shadow-[0_0_30px_rgba(222,140,58,0.35)]" />
          <figcaption className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-paper/60">{t({ es: 'El logo oficial', en: 'The official logo' })}</figcaption>
        </figure>
      </div>
    </div>
  )
}

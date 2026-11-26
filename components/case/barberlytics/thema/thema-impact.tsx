'use client'

import { useRef } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { THEMA_CASE } from '@/lib/content/cases/barberlytics/thema-case'
import { useInView } from './use-in-view'
import { ChapterHead } from './chapter-head'

const { impact } = THEMA_CASE
const [COMPONENTS, SPEED, REVIEW, COLORS] = impact.kpis
const STAGES = impact.growth.bars
const TOTAL = STAGES[STAGES.length - 1].value
const GOLD = '#D9B36A'
/** Cada fila se dibuja un poco después de la anterior (ms) */
const ROW_DELAY_MS = 180

interface Bar {
  label: L
  /** Fracción del ancho (0–1) */
  size: number
  value: L
  now?: boolean
}

interface Row {
  value: string
  unit: string
  title: L
  /** Qué significa, en palabras simples */
  plain: L
  bars: readonly Bar[]
  /** Cifra de referencia del equipo (no una medición del sistema) */
  reference?: boolean
}

/** Cuatro cambios, cada uno con su antes y su ahora explicados */
const ROWS: readonly Row[] = [
  {
    value: String(COMPONENTS.value),
    unit: '',
    title: COMPONENTS.label,
    plain: { es: 'Piezas listas para usar, cada una con su ficha y su ejemplo. Al revisar lo que había, solo 27 estaban aprobadas.', en: 'Pieces ready to use, each with its sheet and example. When I reviewed what existed, only 27 were approved.' },
    bars: STAGES.map((s, i) => ({
      label: i === 0 ? { es: 'Al revisar lo que había', en: 'Reviewing what existed' } : i === 1 ? { es: 'Primera versión de Thema', en: 'Thema’s first version' } : { es: 'Hoy', en: 'Today' },
      size: s.value / TOTAL,
      value: { es: String(s.value), en: String(s.value) },
      now: i === STAGES.length - 1,
    })),
  },
  {
    value: String(SPEED.value),
    unit: SPEED.unit,
    title: { es: 'Más rápido armar una pantalla nueva', en: 'Faster to build a new screen' },
    plain: { es: 'Se arma con piezas que ya existen en vez de dibujarla desde cero: toma un tercio del tiempo.', en: 'It’s assembled from pieces that already exist instead of drawn from scratch: it takes a third of the time.' },
    bars: [
      { label: { es: 'Antes', en: 'Before' }, size: 1, value: ({ es: 'tiempo completo', en: 'full time' }) },
      { label: { es: 'Con Thema', en: 'With Thema' }, size: 1 / SPEED.value, value: ({ es: '⅓ del tiempo', en: '⅓ of the time' }), now: true },
    ],
    reference: true,
  },
  {
    value: String(REVIEW.value),
    unit: REVIEW.unit,
    title: { es: 'Menos correcciones al revisar', en: 'Fewer fixes in review' },
    plain: { es: 'Cada pantalla se revisa antes de publicarse. Por cada 10 arreglos de color, espacio o tamaño que se pedían antes, ahora se piden 3: las piezas ya vienen bien desde el sistema.', en: 'Every screen is reviewed before shipping. For every 10 color, spacing or size fixes requested before, now 3 are: pieces already come right from the system.' },
    bars: [
      { label: { es: 'Antes', en: 'Before' }, size: 1, value: ({ es: '10 arreglos', en: '10 fixes' }) },
      { label: { es: 'Con Thema', en: 'With Thema' }, size: 1 - REVIEW.value / 100, value: ({ es: '3 arreglos', en: '3 fixes' }), now: true },
    ],
    reference: true,
  },
  {
    value: String(COLORS.value),
    unit: '',
    title: COLORS.label,
    plain: { es: 'Un color escrito directo en el código (como #ff3b30) en lugar del color del tema. El sistema lo bloquea antes de que llegue al código, venga de una persona o de la IA.', en: 'A color written straight into the code (like #ff3b30) instead of the theme’s color. The system blocks it before it reaches the code, from a person or from AI.' },
    bars: [{ label: { es: 'Con Thema', en: 'With Thema' }, size: 0, value: ({ es: 'ninguno: se bloquean', en: 'none: they’re blocked' }), now: true }],
  },
]

/**
 * 07 · Impacto de Thema: cuatro cambios, cada uno con su número, qué significa
 * en palabras simples y su antes y ahora en barras que se dibujan al entrar.
 * Las cifras de velocidad y revisión se marcan como de referencia del equipo.
 * Debajo, la calidad que respalda las piezas; de ahí sale la fibra hacia «Demo».
 */
export function ThemaImpact() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const { chapters } = THEMA_CASE
  const rootRef = useRef<HTMLDivElement>(null)
  const { entered } = useInView(rootRef)
  const drawn = entered || reducedMotion

  return (
    <div ref={rootRef}>
      <ChapterHead phrase={t(chapters.impacto.phrase)} lead={t(chapters.impacto.lead)} />

      <ol className="swipe-row mx-auto max-w-[900px] md:block">
        {ROWS.map((row, i) => {
          return (
            <li key={row.title.es} className="border-white/[0.08] max-md:rounded-2xl max-md:border max-md:bg-white/[0.02] max-md:px-5 md:border-t md:first:border-t-0">
              <div className="grid items-center gap-x-10 gap-y-6 py-7 md:gap-y-5 md:py-8 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
                {/* El número y qué es */}
                <span className="flex flex-col items-start gap-3 md:flex-row md:gap-4">
                  <span className="min-w-[3.2ch] text-[4rem] font-light leading-none tabular-nums md:text-[clamp(2.6rem,1.8rem+2.6vw,4.2rem)]">
                    {row.value}
                    <span className="text-[0.5em]">{row.unit}</span>
                  </span>
                  <span className="flex flex-col">
                    <span className="text-[17px] leading-snug text-paper/90 md:text-base md:text-paper/85">{t(row.title)}</span>
                    <span className="mt-2 max-w-[42ch] text-pretty text-[14px] leading-relaxed text-paper/60 md:text-sm md:text-paper/55">{t(row.plain)}</span>
                    {row.reference && <span className="case-tag mt-2 md:mt-1">{t({ es: 'cifra de referencia del equipo', en: 'team reference figure' })}</span>}
                  </span>
                </span>

                {/* Antes y ahora */}
                <span className="flex flex-col gap-4 md:gap-2.5">
                  {row.bars.map((b, k) => (
                    <span key={b.label.es} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1.5 text-[13px] md:gap-y-0 md:text-xs md:grid-cols-[minmax(0,9.5rem)_minmax(0,1fr)_minmax(0,8rem)]">
                      <span className={`text-[13px] ${b.now ? 'text-paper/85' : 'text-paper/65'}`}>{t(b.label)}</span>
                      <span className="relative order-last col-span-2 flex h-3 items-center md:order-none md:col-span-1 md:h-6">
                        <span
                          aria-hidden="true"
                          className="absolute inset-y-0 left-0 rounded-full md:inset-y-1"
                          style={{
                            width: `${Math.max(b.size, 0) * 100}%`,
                            background: b.now ? `linear-gradient(90deg, ${GOLD}99, ${GOLD})` : 'rgba(239,233,221,0.22)',
                            boxShadow: b.now ? `0 0 14px -2px ${GOLD}aa` : 'none',
                            transform: `scaleX(${drawn ? 1 : 0})`,
                            transformOrigin: 'left',
                            transition: reducedMotion ? 'none' : `transform 900ms cubic-bezier(0.16,1,0.3,1) ${i * ROW_DELAY_MS + k * 120}ms`,
                          }}
                        />
                        {b.size === 0 && <span aria-hidden="true" className="absolute left-0 h-3 w-3 rounded-full border border-dashed" style={{ borderColor: GOLD }} />}
                      </span>
                      <span
                        className={`font-mono text-[12px] uppercase tracking-[0.06em] md:tracking-[0.1em] transition-opacity duration-500 ${b.now ? 'text-paper' : 'text-paper/55'}`}
                        style={{ opacity: drawn ? 1 : 0, transitionDelay: `${i * ROW_DELAY_MS + 500}ms` }}
                      >
                        {t(b.value)}
                      </span>
                    </span>
                  ))}
                </span>
              </div>
            </li>
          )
        })}
      </ol>

      {/* La calidad que respalda las piezas */}
      <ul className="relative mx-auto mt-12 grid max-w-[860px] grid-cols-2 gap-x-6 gap-y-5 text-[13px] leading-snug text-paper/55 md:mt-14 md:flex md:flex-wrap md:justify-center md:gap-x-8 md:gap-y-3 md:font-mono md:text-[11px] md:uppercase md:tracking-[0.12em]">
        <span data-fiber-from="th-demo" aria-hidden="true" className="absolute -bottom-6 left-1/2 h-px w-px" />
        {impact.quality.map((q) => (
          <li key={q.label.es}>
            <span className="block text-[28px] font-light leading-none text-paper/90 tabular-nums md:inline md:text-[11px] md:text-paper/85">{q.value}</span> {t(q.label)}
          </li>
        ))}
      </ul>
    </div>
  )
}

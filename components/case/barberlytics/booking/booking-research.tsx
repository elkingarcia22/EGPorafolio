'use client'

import { useLocale } from '@/lib/i18n'
import { BOOKING_CASE } from '@/lib/content/cases/barberlytics/booking-case'
import { Board, Hand, Pin, Sticky, type StickyColor } from '@/components/case/kit/sketch'

/** 01 · Los puntos: el contexto, lo que vimos y las cifras de partida. */
export function BookingDots() {
  const { t } = useLocale()
  const { dots } = BOOKING_CASE
  return (
    <div>
      <p data-reveal className="max-w-[22ch] text-[clamp(1.8rem,1rem+2.6vw,3.4rem)] font-light leading-[1.08] tracking-tight">{t(dots.kicker)}</p>
      <p data-reveal className="mt-8 max-w-[62ch] text-lg leading-relaxed opacity-80">{t(dots.lead)}</p>

      <p data-reveal className="mono-label mb-6 mt-16 opacity-60">{t({ es: 'Lo que vimos', en: 'What we saw' })}</p>
      <ol className="grid gap-px overflow-hidden border border-fg/15 bg-fg/15 md:grid-cols-3">
        {dots.seen.map((s, i) => (
          <li key={s.title.es} data-reveal className="bg-bg p-6">
            <span className="mono-label text-signal">0{i + 1}</span>
            <p className="mt-3 text-lg leading-snug">{t(s.title)}</p>
            <p className="mt-3 text-sm leading-relaxed opacity-70">{t(s.body)}</p>
          </li>
        ))}
      </ol>

      <dl className="mt-12 grid grid-cols-2 gap-8 lg:grid-cols-4">
        {dots.stats.map((s) => (
          <div key={s.label.es} data-reveal>
            <dt className="sr-only">{t(s.label)}</dt>
            <dd>
              <span className="block text-[clamp(2.4rem,1.6rem+2.4vw,3.8rem)] font-light leading-none text-signal tabular-nums">{s.value}</span>
              <span className="mt-3 block text-sm leading-snug opacity-70">{t(s.label)}</span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

const COLUMN_X = [30, 372, 714, 1056]
const NOTE_W = 300

/** 02 · Patrones: el benchmark agrupado como en un tablero de Miro. */
export function BookingPatterns() {
  const { t } = useLocale()
  const { patterns } = BOOKING_CASE
  return (
    <div>
      <p data-reveal className="max-w-[62ch] text-lg leading-relaxed opacity-80">{t(patterns.lead)}</p>
      <ul data-reveal className="mb-10 mt-8 flex flex-wrap gap-2" aria-label={t({ es: 'Productos comparados', en: 'Products compared' })}>
        {patterns.competitors.map((name) => (
          <li key={name} className="border border-fg/20 px-2.5 py-1 font-mono text-[11px] opacity-80">{name}</li>
        ))}
      </ul>

      <Board title={t({ es: 'Benchmark · reserva en línea', en: 'Benchmark · online booking' })} w={1400} h={800} label={t({ es: 'Tablero con los hallazgos del benchmark en cuatro columnas', en: 'Board with benchmark findings in four columns' })}>
        <Pin x={30} y={22}>
          <Hand size={2.4} className="font-bold">{t({ es: '15 productos → 4 grupos', en: '15 products → 4 groups' })}</Hand>
        </Pin>
        {patterns.columns.map((col, c) => (
          <div key={col.title.es}>
            <Pin x={COLUMN_X[c]} y={88} w={NOTE_W}>
              <Hand size={2} className="block border-b-2 border-[#2a2d33] pb-1 font-bold">{t(col.title)}</Hand>
            </Pin>
            {col.notes.map((note, i) => (
              <Pin key={note.es} x={COLUMN_X[c] + (i % 2 ? 14 : 0)} y={150 + i * 124} w={NOTE_W - 14} rotate={i % 2 ? 1.6 : -1.2}>
                <Sticky color={col.color as StickyColor}>{t(note)}</Sticky>
              </Pin>
            ))}
          </div>
        ))}
      </Board>

      <ol className="mt-12 space-y-4">
        {patterns.insights.map((insight, i) => (
          <li key={insight.es} data-reveal className="flex gap-5 border-t border-fg/15 pt-4">
            <span className="mono-label text-signal">{t({ es: 'Hallazgo', en: 'Insight' })} 0{i + 1}</span>
            <span className="text-lg leading-snug">{t(insight)}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

/** 03 · La idea: la pregunta y los principios. */
export function BookingIdea() {
  const { t } = useLocale()
  const { idea } = BOOKING_CASE
  return (
    <div>
      <p data-reveal className="mono-label mb-4 opacity-60">{t({ es: '¿Cómo podríamos…?', en: 'How might we…?' })}</p>
      <p data-reveal className="max-w-[28ch] text-[clamp(1.8rem,1rem+2.4vw,3.2rem)] font-light leading-[1.1] tracking-tight">{t(idea.hmw)}</p>
      <ol className="mt-14 grid gap-px overflow-hidden border border-fg/15 bg-fg/15 sm:grid-cols-2">
        {idea.principles.map((p, i) => (
          <li key={p.title.es} data-reveal className="bg-bg p-7">
            <span className="mono-label text-signal">{t({ es: 'Principio', en: 'Principle' })} 0{i + 1}</span>
            <p className="mt-3 text-xl leading-snug">{t(p.title)}</p>
            <p className="mt-3 text-sm leading-relaxed opacity-70">{t(p.body)}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}

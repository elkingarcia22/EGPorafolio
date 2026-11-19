'use client'

import { useLocale, type L } from '@/lib/i18n'

/** Lo que el producto cubre para que cualquier empresa entre sin cambiar su forma de trabajar. */
const COVERAGE: readonly { glyph: string; label: L }[] = [
  { glyph: '◎', label: { es: '5 modelos y uno propio', en: '5 models and a custom one' } },
  { glyph: '⇣', label: { es: 'Cascada empresa → grupo → persona', en: 'Cascade company → group → person' } },
  { glyph: '◍', label: { es: 'Por grupo o individuales', en: 'By group or individual' } },
  { glyph: '$', label: { es: '4 tipos de medida', en: '4 measure types' } },
  { glyph: '↗', label: { es: 'Aumentar, reducir o mantener', en: 'Increase, decrease or maintain' } },
  { glyph: '◷', label: { es: 'De un mes a un año', en: 'From a month to a year' } },
  { glyph: '✎', label: { es: 'Quién redacta', en: 'Who writes' } },
  { glyph: '◔', label: { es: 'Recordatorios de avance', en: 'Progress reminders' } },
  { glyph: '⇪', label: { es: 'Carga masiva por archivo', en: 'Bulk upload by file' } },
  { glyph: '✦', label: { es: 'Crear con IA', en: 'Create with AI' } },
]

/** Lo que cubre el producto para que ninguna empresa tenga que cambiar su forma de trabajar. */
export function CoverageGrid() {
  const { t } = useLocale()
  return (
    <figure data-reveal="device" className="relative overflow-hidden rounded-3xl bg-[#0b0d16] p-5 text-white md:p-8">
      <span className="pointer-events-none absolute -left-24 top-1/3 h-96 w-96 rounded-full bg-signal opacity-25 blur-3xl" aria-hidden="true" />
      <span className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#7b5cff] opacity-20 blur-3xl" aria-hidden="true" />
      <figcaption className="relative mb-4 font-mono text-[10px] uppercase tracking-[0.14em] text-white/45">{t({ es: 'Lo que cubre para que nadie cambie su forma de trabajar', en: 'What it covers so nobody changes how they work' })}</figcaption>
      <ul className="relative grid grid-cols-2 gap-2 sm:grid-cols-5">
        {COVERAGE.map((c, i) => (
          <li
            key={c.label.es}
            data-reveal="pop"
            style={{ transitionDelay: `${i * 50}ms` }}
            className="group rounded-xl bg-white/[0.04] p-3 ring-1 ring-white/10 transition-[background-color,transform] duration-300 hover:-translate-y-1 hover:bg-white/[0.08]"
          >
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-signal/20 font-mono text-[13px] text-[#9fb2ff] transition-colors group-hover:bg-signal group-hover:text-white">{c.glyph}</span>
            <span className="mt-2.5 block text-[12px] leading-snug text-white/80">{t(c.label)}</span>
          </li>
        ))}
      </ul>
    </figure>
  )
}

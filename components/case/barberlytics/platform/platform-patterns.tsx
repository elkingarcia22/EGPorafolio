'use client'

import { useLocale } from '@/lib/i18n'
import { PLATFORM_CASE, type Mark } from '@/lib/content/cases/barberlytics/platform-case'

const MARK: Record<Mark, { glyph: string; cls: string; label: { es: string; en: string } }> = {
  yes: { glyph: '●', cls: 'bg-[#2a8a5c] text-white', label: { es: 'sí', en: 'yes' } },
  half: { glyph: '◐', cls: 'bg-[#d18b1f]/80 text-[#16130f]', label: { es: 'a medias', en: 'partly' } },
  no: { glyph: '○', cls: 'bg-[#a8383f]/25 text-[#ff8a8e]', label: { es: 'no', en: 'no' } },
  unknown: { glyph: '?', cls: 'bg-white/[0.04] text-white/35', label: { es: 'sin verificar', en: 'unverified' } },
}

/** Matriz de funciones del calendario contra el sector, como mapa de calor. */
function BenchmarkMatrix() {
  const { t } = useLocale()
  const { matrix } = PLATFORM_CASE.patterns
  return (
    <figure data-reveal="device" className="overflow-hidden rounded-3xl bg-[#0f0d0b] p-5 text-white md:p-8">
      <figcaption className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
        <span className="text-lg">{t(matrix.title)}</span>
        <span className="flex flex-wrap gap-3 text-[11px] text-white/55">
          {(['yes', 'half', 'no', 'unknown'] as const).map((m) => (
            <span key={m} className="flex items-center gap-1.5">
              <span className={`flex h-4 w-4 items-center justify-center rounded text-[9px] ${MARK[m].cls}`}>{MARK[m].glyph}</span>
              {t(MARK[m].label)}
            </span>
          ))}
        </span>
      </figcaption>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-separate border-spacing-1 text-left text-xs">
          <thead>
            <tr>
              <th scope="col" className="w-[30%] px-2 pb-2 font-normal text-white/45">{t({ es: 'Función', en: 'Function' })}</th>
              {matrix.products.map((p, i) => (
                <th key={p} scope="col" className={`px-1 pb-2 text-center font-normal ${i === 0 ? 'text-[#d9b36a]' : 'text-white/55'}`}>{p}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.rows.map((row, r) => (
              <tr key={row.fn.es}>
                <th scope="row" className="px-2 py-1 font-normal text-white/80">{t(row.fn)}</th>
                {row.marks.map((m, c) => (
                  <td key={matrix.products[c]} className="p-0">
                    <span
                      className={`flex h-8 items-center justify-center rounded-md text-[11px] animate-[ramp-in_0.6s_cubic-bezier(0.16,1,0.3,1)_both] ${MARK[m].cls} ${c === 0 ? 'ring-1 ring-[#d9b36a]' : ''}`}
                      style={{ animationDelay: `${r * 60 + c * 25}ms` }}
                      title={`${matrix.products[c]} · ${t(MARK[m].label)}`}
                    >
                      {MARK[m].glyph}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-[11px] text-white/40">{t(matrix.note)}</p>
    </figure>
  )
}

/** Lo que dicen barberos y dueños: un muro de citas, quejas y elogios. */
function Voices() {
  const { t } = useLocale()
  const { voices } = PLATFORM_CASE.patterns
  return (
    <section className="mt-[clamp(4rem,3rem+4vw,6rem)]">
      <h3 data-reveal="mask" className="text-[clamp(1.35rem,1rem+1vw,1.9rem)]">{t(voices.title)}</h3>
      <p data-reveal className="mb-10 mt-3 max-w-[62ch] text-sm leading-relaxed opacity-65">{t(voices.note)}</p>
      <ul className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {voices.items.map((v, i) => (
          <li
            key={v.quote.es}
            data-reveal
            className={`mb-4 break-inside-avoid rounded-2xl border p-5 ${v.tone === 'pain' ? 'border-[#e5484d]/25 bg-[#e5484d]/[0.06]' : 'border-[#2a8a5c]/35 bg-[#2a8a5c]/[0.08]'}`}
            style={{ transform: `rotate(${i % 3 === 0 ? -0.6 : i % 3 === 1 ? 0.5 : 0}deg)` }}
          >
            <span className={`mono-label ${v.tone === 'pain' ? 'text-[#ff8a8e]' : 'text-[#5fd39a]'}`}>{v.tone === 'pain' ? t({ es: 'Duele', en: 'Hurts' }) : t({ es: 'Valoran', en: 'Valued' })}</span>
            <p className={`mt-3 leading-snug ${i % 4 === 0 ? 'text-2xl font-light' : 'text-lg'}`}>{t(v.quote)}</p>
            <p className="mt-3 text-xs opacity-60">— {t(v.who)}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

/** 02 · Patrones: benchmark del calendario y la voz de barberos y dueños. */
export function PlatformPatterns() {
  const { t } = useLocale()
  const { patterns } = PLATFORM_CASE
  return (
    <div>
      <p data-reveal className="mb-10 max-w-[62ch] text-lg leading-relaxed opacity-80">{t(patterns.lead)}</p>
      <BenchmarkMatrix />
      <Voices />
      <ol className="mt-12 space-y-4">
        {patterns.insights.map((insight, i) => (
          <li key={insight.es} data-reveal className="flex gap-5 border-t border-fg/15 pt-4">
            <span className="mono-label shrink-0 text-signal">{t({ es: 'Hallazgo', en: 'Insight' })} 0{i + 1}</span>
            <span className="text-lg leading-snug">{t(insight)}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

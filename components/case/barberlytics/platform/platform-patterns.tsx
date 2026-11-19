'use client'

import { useLocale } from '@/lib/i18n'
import { PLATFORM_CASE, type Mark } from '@/lib/content/cases/barberlytics/platform-case'

/** Posición vertical de cada burbuja (en %), para que no se pisen. */
const BUBBLE_Y = [48, 40, 20, 60, 80, 52, 24, 82]

const shareOf = (marks: readonly Mark[]) => marks.slice(1).reduce((n, m) => n + (m === 'yes' ? 1 : m === 'half' ? 0.5 : 0), 0)

/**
 * Mapa de oportunidades: cada función del calendario, de «todo el sector la tiene» (izquierda)
 * a «nadie la tiene» (derecha). El relleno dorado dice si Barberlytics la tiene.
 */
function OpportunityMap() {
  const { t, locale } = useLocale()
  const { matrix } = PLATFORM_CASE.patterns
  const rivals = matrix.products.length - 1
  return (
    <figure data-reveal="device" className="overflow-hidden rounded-3xl bg-[#0f0d0b] p-5 text-white md:p-8">
      <figcaption className="mb-2 flex flex-wrap items-baseline justify-between gap-3">
        <span className="text-lg">{t({ es: 'Dónde está el espacio libre', en: 'Where the open space is' })}</span>
        <span className="flex flex-wrap gap-4 text-[11px] text-white/60">
          <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-[#d9b36a]" />{t({ es: 'Barberlytics lo tiene', en: 'Barberlytics has it' })}</span>
          <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full border-2 border-[#d9b36a] bg-[linear-gradient(90deg,#d9b36a_50%,transparent_50%)]" />{t({ es: 'a medias', en: 'partly' })}</span>
          <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full border border-dashed border-white/40" />{t({ es: 'aún no', en: 'not yet' })}</span>
        </span>
      </figcaption>
      <p className="mb-6 max-w-[60ch] text-xs leading-relaxed text-white/50">
        {t({ es: `Cada burbuja es una función del calendario; su lugar depende de cuántos de los ${rivals} productos del sector la tienen.`, en: `Each bubble is a calendar function; its place depends on how many of the ${rivals} industry products have it.` })}
      </p>
      <div className="overflow-x-auto">
        <div className="relative h-[500px] min-w-[760px]">
          {/* La zona que nadie ocupa */}
          <div className="absolute inset-y-0 right-0 w-[30%] rounded-2xl bg-[linear-gradient(90deg,transparent,rgba(217,179,106,0.12))]" aria-hidden="true" />
          <span className="mono-label absolute right-3 top-2 text-[#d9b36a]">{t({ es: 'Espacio libre', en: 'Open space' })}</span>
          {/* Eje */}
          <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 text-[11px] text-white/45">
            <span>{t({ es: '← Todo el sector lo tiene', en: '← The whole industry has it' })}</span>
            <span className="h-px flex-1 bg-gradient-to-r from-white/30 to-[#d9b36a]/70" />
            <span>{t({ es: 'Nadie lo tiene →', en: 'Nobody has it →' })}</span>
          </div>
          {matrix.rows.map((row, i) => {
            const share = shareOf(row.marks) / rivals
            const own = row.marks[0]
            const x = 9 + (1 - share) * 82
            const alone = share === 0
            return (
              <div key={row.fn.es} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${x}%`, top: `calc(${BUBBLE_Y[i]}% - 14px)` }}>
                <div
                  className="flex h-[112px] w-[112px] animate-[ramp-in_0.8s_cubic-bezier(0.16,1,0.3,1)_both] flex-col items-center justify-center rounded-full p-3 text-center"
                  style={{
                    animationDelay: `${i * 90}ms`,
                    background: own === 'yes' ? 'radial-gradient(circle at 35% 30%, #f0d18f, #b98b3c)' : own === 'half' ? 'linear-gradient(90deg, rgba(217,179,106,0.55) 50%, rgba(255,255,255,0.03) 50%)' : 'rgba(255,255,255,0.03)',
                    border: own === 'no' ? '1.5px dashed rgba(255,255,255,0.35)' : '1.5px solid #d9b36a',
                    boxShadow: alone ? '0 0 50px -6px rgba(217,179,106,0.8)' : undefined,
                    color: own === 'yes' ? '#16130f' : '#efe9dd',
                  }}
                >
                  <span className="text-[11px] font-medium leading-tight">{t(row.fn)}</span>
                  <span className={`mt-1 font-mono text-[10px] ${own === 'yes' ? 'text-[#16130f]/70' : 'text-white/55'}`}>{share === 0 ? t({ es: 'solo nosotros', en: 'only us' }) : `${(share * rivals).toLocaleString(locale === 'es' ? 'es-CO' : 'en-US', { maximumFractionDigits: 1 })} / ${rivals}`}</span>
                </div>
              </div>
            )
          })}
        </div>
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
      <OpportunityMap />
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

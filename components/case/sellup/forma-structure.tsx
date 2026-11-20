'use client'

import { useLocale, type L } from '@/lib/i18n'

/** Estructura de un agente: sus formas de trabajar, como tarjetas numeradas. */
export interface StructureItem {
  title: L
  body: L
  note?: L
}

export function AgentStructure({ heading, items, active }: { heading: L; items: readonly StructureItem[]; active?: number }) {
  const { t } = useLocale()
  return (
    <div className="mt-8">
      <p className="mono-label mb-4 text-white/50">{t(heading)}</p>
      <ol className={`grid gap-3 sm:grid-cols-2 ${items.length > 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-3'}`}>
        {items.map((it, i) => (
          <li key={it.title.es} className={`rounded-[16px] p-4 ring-1 max-md:py-3 transition-all duration-500 ${active === i ? 'bg-[#6b8cff]/[0.12] ring-[#6b8cff]/60' : 'bg-white/[0.025] ring-white/10'}`}>
            <span className="flex items-start gap-3">
              <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[12px] tabular-nums ${active === i ? 'bg-[#6b8cff] text-[#0a0a0a]' : 'bg-white/[0.07] text-white/70'}`}>{i + 1}</span>
              <span>
                <span className="block font-medium leading-snug">{t(it.title)}</span>
                <span className="mt-1 block text-sm leading-snug text-white/60 max-md:hidden">{t(it.body)}</span>
                {it.note && <span className="mt-2 block text-xs text-[#9db0ff] max-md:hidden">{t(it.note)}</span>}
              </span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { FREE_RULE, SEARCH_MODES } from '@/lib/content/cases/sellup/sellup-agents'
import { BLUE, OK, SURFACE, SellUpMark, WARN, useInView } from './ui'

type Verdict = 'new' | 'free' | 'dup' | 'small'

const VERDICT: Record<Verdict, { label: L; cls: string }> = {
  new: { label: { es: 'Nueva', en: 'New' }, cls: 'bg-[#5b7eff]/12 text-[#3150d8]' },
  free: { label: { es: 'Libre en HubSpot', en: 'Free in HubSpot' }, cls: 'bg-emerald-500/12 text-emerald-700' },
  dup: { label: { es: 'Duplicada → Descartadas', en: 'Duplicate → Discarded' }, cls: 'bg-black/[0.06] text-black/50 line-through' },
  small: { label: { es: '< 200 empleados → Descartadas', en: '< 200 employees → Discarded' }, cls: 'bg-black/[0.06] text-black/50' },
}

/** Lote de ejemplo: empresas ficticias, para mostrar cómo se ve cada veredicto. */
const SAMPLE: readonly { name: string; size: string; v: Verdict }[] = [
  { name: 'Clínica Andina del Norte', size: '1.240', v: 'free' },
  { name: 'Grupo Salud Meridiano', size: '3.100', v: 'new' },
  { name: 'Laboratorios Ceiba', size: '640', v: 'free' },
  { name: 'Red Hospitalaria Sur', size: '2.800', v: 'dup' },
  { name: 'Óptica Lumen', size: '85', v: 'small' },
]

/** 5.1 · Las cinco formas de buscar: misma bandeja, mismas verificaciones. */
export function ModeExplorer() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const [modeId, setModeId] = useState(SEARCH_MODES[0].id)
  const mode = SEARCH_MODES.find((m) => m.id === modeId) ?? SEARCH_MODES[0]
  const [ref, seen] = useInView<HTMLDivElement>()
  const [lit, setLit] = useState(0)
  const total = mode.sources.length + SAMPLE.length

  useEffect(() => {
    if (!seen) return
    if (reducedMotion) {
      setLit(total)
      return
    }
    setLit(0)
    const id = window.setInterval(() => setLit((n) => (n >= total ? n : n + 1)), 380)
    return () => window.clearInterval(id)
  }, [modeId, seen, reducedMotion, total])

  const rows = lit - mode.sources.length
  return (
    <div ref={ref} data-reveal="device" className="grid gap-4 rounded-[20px] bg-[#f4f5f7] p-4 text-[#14161b] md:grid-cols-[220px_minmax(0,1fr)] md:p-6">
      <div role="tablist" aria-label={t({ es: 'Formas de buscar', en: 'Ways to search' })} className="flex gap-1 overflow-x-auto md:flex-col">
        {SEARCH_MODES.map((m, i) => (
          <button
            key={m.id}
            role="tab"
            aria-selected={m.id === modeId}
            onClick={() => setModeId(m.id)}
            className={`shrink-0 rounded-[12px] px-3 py-2.5 text-left text-sm transition-colors ${m.id === modeId ? 'bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06)]' : 'text-black/55 hover:text-black'}`}
          >
            <span className="mr-2 font-mono text-[11px] text-black/40">{i + 1}</span>
            {t(m.name)}
          </button>
        ))}
      </div>

      <div className={`${SURFACE} p-4 md:p-5`}>
        <div className="flex items-center gap-3 border-b border-black/[0.06] pb-3">
          <SellUpMark size={26} />
          <p className="text-sm font-medium">Rumbo</p>
          <span className="ml-auto rounded-full bg-black/[0.05] px-3 py-1 font-mono text-[11px] text-black/60">{t(mode.input)}</span>
        </div>

        <p className="mt-4 text-xs text-black/50">{t({ es: 'Fuentes, en orden', en: 'Sources, in order' })}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {mode.sources.map((s, i) => (
            <span key={s.es} className={`rounded-md border px-2 py-1 text-xs transition-all duration-500 ${i < lit ? 'border-[#5b7eff]/40 bg-[#5b7eff]/[0.07] text-[#3150d8]' : 'border-black/10 text-black/35'}`}>
              {i < lit ? '● ' : '○ '}{t(s)}
            </span>
          ))}
        </div>

        <div className="mt-5 flex items-baseline justify-between gap-3">
          <p className="text-sm font-medium">{t({ es: 'Por revisar', en: 'To review' })} · <span className="text-black/50">{t(mode.batch)}</span></p>
          <p className="font-mono text-[11px] text-black/45">{t({ es: 'datos de ejemplo', en: 'sample data' })}</p>
        </div>
        <ul className="mt-2 divide-y divide-black/[0.06] rounded-[12px] border border-black/[0.06]">
          {SAMPLE.map((r, i) => (
            <li key={r.name} className={`flex flex-wrap items-center gap-x-3 gap-y-1 px-3 py-2.5 text-sm transition-all duration-500 ${i < rows ? 'opacity-100' : 'translate-x-2 opacity-0'}`}>
              <span className={r.v === 'dup' || r.v === 'small' ? 'text-black/40' : ''}>{r.name}</span>
              <span className="font-mono text-[11px] text-black/40">{r.size} {t({ es: 'emp.', en: 'emp.' })}</span>
              <span className={`ml-auto rounded-md px-2 py-0.5 text-[11px] font-medium ${VERDICT[r.v].cls}`}>{t(VERDICT[r.v].label)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-black/60">
          <span className="font-medium text-black/80">{t({ es: 'Costo medido', en: 'Measured cost' })}:</span> {t(mode.cost)}
        </p>
      </div>
    </div>
  )
}

/** 5.2 · «Libre en HubSpot»: cinco condiciones, y un nombre parecido no basta. */
export function FreeInHubSpot() {
  const { t } = useLocale()
  const [byDomain, setByDomain] = useState(true)
  const [ref, seen] = useInView<HTMLDivElement>()
  const passes = FREE_RULE.map((_, i) => i < FREE_RULE.length - 1 || byDomain)
  const isFree = passes.every(Boolean)
  return (
    <div ref={ref} data-reveal="device" className="grid gap-6 rounded-[20px] bg-[#0b0e14] p-5 text-[#e9ecf3] ring-1 ring-white/10 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:p-8">
      <div>
        <p className="font-mono text-[11px] text-white/45">HubSpot · {t({ es: 'ficha de empresa', en: 'company record' })}</p>
        <div className="mt-3 rounded-[14px] border border-white/10 bg-white/[0.04] p-4 text-sm">
          <p className="text-base">Clínica Andina del Norte</p>
          <dl className="mt-3 grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1.5 text-xs">
            <dt className="text-white/45">{t({ es: 'Dueño', en: 'Owner' })}</dt><dd>Sales México ({t({ es: 'bolsa', en: 'pool' })})</dd>
            <dt className="text-white/45">{t({ es: 'Estado', en: 'Status' })}</dt><dd>Recycled</dd>
            <dt className="text-white/45">{t({ es: 'Última actividad', en: 'Last activity' })}</dt><dd>{t({ es: 'hace 126 días', en: '126 days ago' })}</dd>
            <dt className="text-white/45">{t({ es: 'Dominio', en: 'Domain' })}</dt><dd className="font-mono">{byDomain ? 'clinicaandina.mx' : 'clinica-andina.com'}</dd>
          </dl>
        </div>
        <p className="mt-5 text-xs text-white/55">{t({ es: 'La candidata coincide por…', en: 'The candidate matches by…' })}</p>
        <div className="mt-2 inline-flex rounded-[12px] bg-white/[0.06] p-1 text-sm" role="radiogroup">
          {[true, false].map((d) => (
            <button key={String(d)} role="radio" aria-checked={byDomain === d} onClick={() => setByDomain(d)} className={`rounded-[9px] px-3 py-1.5 transition-colors ${byDomain === d ? 'bg-white text-[#14161b]' : 'text-white/60'}`}>
              {d ? t({ es: 'Dominio exacto', en: 'Exact domain' }) : t({ es: 'Nombre parecido', en: 'Similar name' })}
            </button>
          ))}
        </div>
      </div>
      <div>
        <ul className="space-y-2">
          {FREE_RULE.map((rule, i) => (
            <li key={rule.es} className="flex items-center gap-3 rounded-[12px] border border-white/[0.08] px-3 py-2.5 text-sm transition-all duration-500" style={{ transitionDelay: seen ? `${i * 120}ms` : '0ms', opacity: seen ? 1 : 0, transform: seen ? 'none' : 'translateY(8px)' }}>
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-[11px] font-bold text-[#0b0e14]" style={{ background: passes[i] ? OK : WARN }}>{passes[i] ? '✓' : '×'}</span>
              {t(rule)}
            </li>
          ))}
        </ul>
        <p className="mt-5 rounded-[12px] px-4 py-3 text-sm transition-colors duration-500" style={{ background: isFree ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)', color: isFree ? '#6ee7b7' : '#fcd34d' }} aria-live="polite">
          {isFree
            ? t({ es: 'Entra a «Por revisar» con la insignia «Libre en HubSpot». Al aprobarla, el vendedor pasa a ser su dueño allá.', en: 'It enters “To review” with the “Free in HubSpot” badge. On approval, the rep becomes its owner there.' })
            : t({ es: 'No basta un nombre parecido: va a revisión como posible duplicada, nunca se toma sola.', en: 'A similar name isn’t enough: it goes to review as a possible duplicate, never taken automatically.' })}
        </p>
        <p className="mt-3 text-xs" style={{ color: BLUE }}>{t({ es: 'Al llegar a «Por revisar», la empresa queda reservada: una empresa, un vendedor.', en: 'Once in “To review”, the company is reserved: one company, one rep.' })}</p>
      </div>
    </div>
  )
}

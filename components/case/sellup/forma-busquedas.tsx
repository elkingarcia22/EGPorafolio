'use client'

import { useEffect, useState } from 'react'
import { useLocale } from '@/lib/i18n'
import { AppCard, AppFrame, Pill, RUMBO_GRADIENT, RumboOrb } from './platform'
import { useInView } from './ui'
import { AppButton, Kpi, SampleNote, fmt, useCount } from './forma-shared'

type Verdict = 'new' | 'hubspot' | 'free'
type Decision = 'pending' | 'ok' | 'no'

interface Candidate {
  name: string
  country: string
  industry: string
  size: string
  verdict: Verdict
  why: string
}

/** Empresas ficticias: una búsqueda «Empresas por criterios» de ejemplo. */
const CANDIDATES: readonly Candidate[] = [
  { name: 'Grupo Andino de Alimentos', country: '🇨🇴', industry: 'Alimentos', size: '1.200', verdict: 'free', why: 'Sin dueño en HubSpot hace 9 meses' },
  { name: 'Clínicas Vértice', country: '🇲🇽', industry: 'Salud', size: '850', verdict: 'new', why: 'Registro oficial · NIT verificado' },
  { name: 'Transportes Cordillera', country: '🇨🇱', industry: 'Logística', size: '640', verdict: 'hubspot', why: 'Ya la atiende otro vendedor' },
  { name: 'Banca Solar Pacífico', country: '🇵🇪', industry: 'Finanzas', size: '2.300', verdict: 'new', why: 'Web oficial + SUNAT' },
  { name: 'Hoteles Mar Azul', country: '🇩🇴', industry: 'Turismo', size: '410', verdict: 'free', why: 'Reciclada: sin actividad 12 meses' },
  { name: 'Industrias Nogal', country: '🇨🇴', industry: 'Manufactura', size: '980', verdict: 'new', why: 'Supersociedades · 980 empleados' },
]

const VERDICT = {
  new: { tone: 'blue', label: { es: 'Nueva', en: 'New' } },
  hubspot: { tone: 'red', label: { es: 'Ya en HubSpot', en: 'Already in HubSpot' } },
  free: { tone: 'green', label: { es: 'Libre en HubSpot', en: 'Free in HubSpot' } },
} as const

/** Agente 1: Búsquedas y «Por revisar». La tabla se llena y el vendedor decide. */
export function SearchReview() {
  const { t } = useLocale()
  const [ref, seen] = useInView<HTMLDivElement>(0.25)
  const [shown, setShown] = useState(0)
  const [decisions, setDecisions] = useState<readonly Decision[]>(CANDIDATES.map(() => 'pending'))

  useEffect(() => {
    if (!seen || shown >= CANDIDATES.length) return
    const id = window.setTimeout(() => setShown((s) => s + 1), shown === 0 ? 700 : 380)
    return () => window.clearTimeout(id)
  }, [seen, shown])

  const approved = decisions.filter((d) => d === 'ok').length
  const pending = decisions.slice(0, shown).filter((d) => d === 'pending').length
  const searches = useCount(34, seen)
  const review = useCount(594, seen)

  const decide = (i: number, d: Decision) => setDecisions((prev) => prev.map((x, j) => (j === i ? d : x)))
  const reset = () => {
    setDecisions(CANDIDATES.map(() => 'pending'))
    setShown(0)
  }

  return (
    <div ref={ref} data-reveal="device">
      <AppFrame active="revisar" crumb="Empresas / Por revisar">
        <div className="p-3 md:p-4">
          <div className="flex flex-wrap items-baseline gap-x-3">
            <p className="text-[17px] font-semibold">{t({ es: 'Por revisar', en: 'To review' })}</p>
            <p className="text-[11px] opacity-55">{t({ es: 'Lo que encontró Rumbo y espera tu decisión.', en: 'What Rumbo found, waiting for your call.' })}</p>
          </div>
          <AppCard className="mt-3 grid grid-cols-2 divide-white/[0.08] sm:grid-cols-4 sm:divide-x">
            <Kpi label={t({ es: 'Búsquedas', en: 'Searches' })} value={fmt(searches)} />
            <Kpi label={t({ es: 'Por revisar', en: 'To review' })} value={fmt(review + pending)} />
            <Kpi label={t({ es: 'En esta búsqueda', en: 'In this search' })} value={shown} />
            <Kpi label={t({ es: 'Aprobadas', en: 'Approved' })} value={<span className="text-emerald-300">{31 + approved}</span>} />
          </AppCard>

          <AppCard className="mt-3 overflow-hidden">
            <div className="flex items-center gap-2 border-b border-white/[0.08] px-3 py-2">
              <RumboOrb size={16} pulse={shown < CANDIDATES.length && seen} />
              <span className="truncate font-medium">{t({ es: 'Empresas por criterios · Salud y alimentos · LATAM', en: 'Companies by criteria · Health & food · LATAM' })}</span>
              <span className="ml-auto"><Pill tone="amber">{t({ es: 'Listo para revisión', en: 'Ready for review' })}</Pill></span>
            </div>
            <ul className="min-h-[300px]">
              {CANDIDATES.slice(0, shown).map((c, i) => {
                const v = VERDICT[c.verdict]
                const d = decisions[i]
                return (
                  <li
                    key={c.name}
                    className={`flex flex-wrap items-center gap-x-3 gap-y-1.5 border-b border-white/[0.06] px-3 py-2 transition-opacity duration-500 ${d === 'no' ? 'opacity-35' : ''}`}
                    style={{ animation: 'sellupRowIn .5s ease-out' }}
                  >
                    <span className="min-w-0 flex-1">
                      <span className={`block truncate font-medium ${d === 'no' ? 'line-through' : ''}`}>{c.country} {c.name}</span>
                      <span className="block truncate text-[10px] opacity-50">{c.industry} · {c.size} {t({ es: 'empleados', en: 'employees' })} · {c.why}</span>
                    </span>
                    <Pill tone={v.tone}>{t(v.label)}</Pill>
                    {d === 'pending' ? (
                      <span className="flex gap-1">
                        <button type="button" disabled={c.verdict === 'hubspot'} onClick={() => decide(i, 'ok')} className="rounded-md bg-emerald-500/15 px-2 py-1 text-[10px] text-emerald-300 ring-1 ring-emerald-400/30 transition hover:bg-emerald-500/25 disabled:cursor-not-allowed disabled:opacity-30">
                          {t({ es: 'Aprobar', en: 'Approve' })}
                        </button>
                        <button type="button" onClick={() => decide(i, 'no')} className="rounded-md bg-white/5 px-2 py-1 text-[10px] opacity-70 ring-1 ring-white/15 transition hover:opacity-100">
                          {t({ es: 'Descartar', en: 'Discard' })}
                        </button>
                      </span>
                    ) : (
                      <span className={`text-[10px] ${d === 'ok' ? 'text-emerald-300' : 'opacity-60'}`}>
                        {d === 'ok' ? t({ es: '✓ Enviada a HubSpot', en: '✓ Sent to HubSpot' }) : t({ es: 'Descartada', en: 'Discarded' })}
                      </span>
                    )}
                  </li>
                )
              })}
              {shown < CANDIDATES.length && seen && (
                <li className="flex items-center gap-2 px-3 py-3 text-[11px] opacity-60">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#8b5cf6]" />
                  {t({ es: 'Rumbo verifica número fiscal y dueño en HubSpot…', en: 'Rumbo checks tax ID and HubSpot owner…' })}
                </li>
              )}
            </ul>
          </AppCard>
          <div className="mt-3 flex justify-center">
            <AppButton gradient={RUMBO_GRADIENT} onClick={reset}>{t({ es: 'Generar con Rumbo IA', en: 'Generate with Rumbo AI' })}</AppButton>
          </div>
        </div>
      </AppFrame>
      <style>{'@keyframes sellupRowIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}'}</style>
      <SampleNote />
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useLocale, type L } from '@/lib/i18n'
import { AppCard, AppFrame, Pill } from './platform'
import { useInView } from './ui'
import { fmt, useCount } from './forma-shared'

type Status = 'verified' | 'pending' | 'manual'
type Filter = 'all' | Status

interface Source {
  name: string
  country: string
  status: Status
  use: L
}

/** Selección de filas del catálogo (fuentes públicas reales; fuera de Colombia, estado ilustrativo). */
const SOURCES: readonly Source[] = [
  { name: 'Supersociedades SIIS', country: '🇨🇴 Colombia', status: 'verified', use: { es: 'Número fiscal y tamaño por industria', en: 'Tax ID and size by industry' } },
  { name: 'Entidades públicas (CHIP + SIGEP II)', country: '🇨🇴 Colombia', status: 'verified', use: { es: 'Capa gratuita de Gobierno', en: 'Free government layer' } },
  { name: 'RUES · Cámaras de Comercio', country: '🇨🇴 Colombia', status: 'verified', use: { es: 'Enriquecer por NIT', en: 'Enrich by tax ID' } },
  { name: 'SECOP II · Proveedores', country: '🇨🇴 Colombia', status: 'verified', use: { es: 'Proveedores del Estado', en: 'Government suppliers' } },
  { name: 'DENUE', country: '🇲🇽 México', status: 'verified', use: { es: 'Directorio por actividad y tamaño', en: 'Directory by activity and size' } },
  { name: 'ChileCompra / Mercado Público', country: '🇨🇱 Chile', status: 'pending', use: { es: 'Compras públicas', en: 'Public procurement' } },
  { name: 'Registro de Empresas y Sociedades', country: '🇨🇱 Chile', status: 'pending', use: { es: 'Constitución y RUT', en: 'Incorporation and RUT' } },
  { name: 'Prensa de RR. HH. del país', country: '🌎 20 países', status: 'manual', use: { es: 'Señal para el primer contacto', en: 'Signal for first contact' } },
]

const FILTERS: readonly { id: Filter; label: L; count: number }[] = [
  { id: 'all', label: { es: 'Todas', en: 'All' }, count: 101 },
  { id: 'verified', label: { es: 'Verificadas', en: 'Verified' }, count: 81 },
  { id: 'pending', label: { es: 'Por validar', en: 'To validate' }, count: 15 },
  { id: 'manual', label: { es: 'Señal manual', en: 'Manual signal' }, count: 1 },
]

const STATUS = {
  verified: { tone: 'green', label: { es: 'Verificada', en: 'Verified' } },
  pending: { tone: 'amber', label: { es: 'Por validar', en: 'To validate' } },
  manual: { tone: 'gray', label: { es: 'Señal manual', en: 'Manual signal' } },
} as const

/** Catálogo de fuentes: de dónde puede sacar datos la IA, país por país. */
export function SourceCatalog() {
  const { t } = useLocale()
  const [ref, seen] = useInView<HTMLDivElement>(0.3)
  const [filter, setFilter] = useState<Filter>('all')
  const total = useCount(132, seen)
  const ai = useCount(101, seen)
  const rows = SOURCES.filter((s) => filter === 'all' || s.status === filter)

  return (
    <div ref={ref} data-reveal="device">
      <AppFrame active="catalogo" crumb={t({ es: 'Catálogo de fuentes', en: 'Source catalog' })}>
        <div className="p-3 md:p-4">
          <p className="text-[17px] font-semibold">{t({ es: 'Catálogo de fuentes', en: 'Source catalog' })}</p>
          <p className="text-[11px] opacity-55">{t({ es: 'Las fuentes por país que usa SellUp: en qué estado están y qué falta para usarlas.', en: 'The per-country sources SellUp uses: their status and what’s missing to use them.' })}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
            <span className="rounded-md bg-white/10 px-2 py-1">{t({ es: 'Usadas por la IA', en: 'Used by AI' })} <b className="tabular-nums">{fmt(ai)}</b></span>
            <span className="rounded-md px-2 py-1 opacity-60 ring-1 ring-white/10">{t({ es: 'De consulta manual', en: 'Manual lookup' })} 28</span>
            <span className="rounded-md px-2 py-1 opacity-60 ring-1 ring-white/10">{t({ es: 'Todas', en: 'All' })} <span className="tabular-nums">{fmt(total)}</span></span>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] ring-1 transition ${filter === f.id ? 'bg-[#5b7eff]/15 text-[#c4d0ff] ring-[#5b7eff]/60' : 'opacity-70 ring-white/15 hover:opacity-100'}`}
              >
                {t(f.label)} <span className="rounded bg-white/10 px-1 tabular-nums">{f.count}</span>
              </button>
            ))}
          </div>
          <AppCard className="mt-3 overflow-hidden">
            <div className="hidden grid-cols-[minmax(0,1.3fr)_110px_96px_minmax(0,1fr)] gap-3 border-b border-white/[0.08] px-3 py-2 text-[10px] opacity-50 sm:grid">
              <span>{t({ es: 'Fuente', en: 'Source' })}</span>
              <span>{t({ es: 'País', en: 'Country' })}</span>
              <span>{t({ es: 'Estado', en: 'Status' })}</span>
              <span>{t({ es: 'Uso por la IA', en: 'AI use' })}</span>
            </div>
            <ul className="min-h-[270px]">
              {rows.map((s, i) => (
                <li
                  key={`${filter}-${s.name}`}
                  className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-0.5 border-b border-white/[0.06] px-3 py-2 sm:grid-cols-[minmax(0,1.3fr)_110px_96px_minmax(0,1fr)] sm:items-center"
                  style={{ animation: `sellupRowIn .4s ease-out ${i * 60}ms both` }}
                >
                  <span className="truncate font-medium">{s.name}</span>
                  <span className="text-[10px] opacity-60 sm:order-none sm:text-[11px]">{s.country}</span>
                  <span><Pill tone={STATUS[s.status].tone}>{t(STATUS[s.status].label)}</Pill></span>
                  <span className="truncate text-[10px] opacity-60 sm:text-[11px]">{t(s.use)}</span>
                </li>
              ))}
            </ul>
            <p className="px-3 py-2 text-[10px] opacity-45">{t({ es: `Mostrando ${rows.length} de ${FILTERS.find((f) => f.id === filter)?.count} fuentes`, en: `Showing ${rows.length} of ${FILTERS.find((f) => f.id === filter)?.count} sources` })}</p>
          </AppCard>
        </div>
      </AppFrame>
      <style>{'@keyframes sellupRowIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}'}</style>
      <p className="mt-3 font-mono text-[10px] uppercase tracking-wider opacity-50">
        {t({ es: 'Réplica · conteos reales del catálogo (nov. 2026); filas seleccionadas, estado fuera de Colombia ilustrativo', en: 'Replica · real catalog counts (Nov 2026); selected rows, status outside Colombia illustrative' })}
      </p>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useLocale, type L } from '@/lib/i18n'
import { AppCard, AppFrame, Pill } from './platform'
import { useInView } from './ui'
import { SampleNote } from './forma-shared'

const STAGES: readonly { name: L; agent?: string; live: boolean }[] = [
  { name: { es: 'Prospección', en: 'Prospecting' }, agent: 'A1', live: true },
  { name: { es: 'Enriquecimiento', en: 'Enrichment' }, agent: 'A2', live: true },
  { name: { es: 'Primer contacto', en: 'First contact' }, agent: 'A3', live: true },
  { name: { es: 'Reunión', en: 'Meeting' }, live: false },
  { name: { es: 'Cotización', en: 'Quote' }, live: false },
  { name: { es: 'Venta interna', en: 'Internal sale' }, live: false },
  { name: { es: 'Cierre', en: 'Close' }, live: false },
]

interface Deal {
  name: string
  flag: string
  stage: number
}

const START: readonly Deal[] = [
  { name: 'Grupo Andino', flag: '🇨🇴', stage: 2 },
  { name: 'Clínicas Vértice', flag: '🇲🇽', stage: 1 },
  { name: 'Banca Solar', flag: '🇵🇪', stage: 1 },
  { name: 'Industrias Nogal', flag: '🇨🇴', stage: 0 },
  { name: 'Hoteles Mar Azul', flag: '🇩🇴', stage: 0 },
  { name: 'Cerámicas Altiplano', flag: '🇨🇱', stage: 0 },
]

const LAST_LIVE = 3 // la plataforma lleva hasta Reunión; lo demás se activa con más agentes

/** Flujo de prospección: cada empresa avanza de etapa y cada etapa tiene su agente. */
export function PipelineFlow() {
  const { t } = useLocale()
  const [ref, seen] = useInView<HTMLDivElement>(0.3)
  const [deals, setDeals] = useState<readonly Deal[]>(START)
  const [auto, setAuto] = useState(0)

  const advance = (name: string) =>
    setDeals((prev) => prev.map((d) => (d.name === name && d.stage < LAST_LIVE ? { ...d, stage: d.stage + 1 } : d)))

  useEffect(() => {
    if (!seen) return
    const id = window.setInterval(() => setAuto((n) => n + 1), 1700)
    return () => window.clearInterval(id)
  }, [seen])

  useEffect(() => {
    if (auto === 0) return
    setDeals((prev) => {
      const movable = prev.filter((d) => d.stage < LAST_LIVE)
      if (movable.length === 0) return START
      const pick = movable[auto % movable.length]
      return prev.map((d) => (d.name === pick.name ? { ...d, stage: d.stage + 1 } : d))
    })
  }, [auto])

  return (
    <div ref={ref} data-reveal="device">
      <AppFrame active="flujo" crumb={t({ es: 'Flujo de prospección', en: 'Prospecting flow' })}>
        <div className="p-3 md:p-4">
          <div className="flex flex-wrap items-baseline gap-x-3">
            <p className="text-[17px] font-semibold">{t({ es: 'Flujo de prospección', en: 'Prospecting flow' })}</p>
            <p className="text-[11px] opacity-55">{t({ es: 'En qué etapa está cada empresa, qué pasó y qué falta. Toca una para moverla.', en: 'Which stage each company is in, what happened and what’s missing. Tap one to move it.' })}</p>
          </div>
          <div className="mt-3 overflow-x-auto pb-1">
            <div className="grid min-w-[700px] grid-cols-7 gap-1.5">
              {STAGES.map((s, i) => {
                const here = deals.filter((d) => d.stage === i)
                return (
                  <AppCard key={s.name.es} className={`min-h-[230px] p-1.5 ${s.live || here.length > 0 ? '' : 'opacity-45'}`}>
                    <div className="mb-1.5 flex items-center justify-between px-1">
                      <span className="truncate text-[10px] font-medium">{t(s.name)}</span>
                      {s.agent ? <Pill tone="blue">{s.agent}</Pill> : <span className="text-[9px] opacity-60">{t({ es: 'Próx.', en: 'Soon' })}</span>}
                    </div>
                    <p className="mb-1.5 px-1 text-[16px] tabular-nums">{here.length}</p>
                    <ul className="space-y-1">
                      {here.map((d) => (
                        <li key={d.name}>
                          <button
                            type="button"
                            onClick={() => advance(d.name)}
                            className="w-full rounded-md bg-white/[0.04] px-1.5 py-1.5 text-left ring-1 ring-white/10 transition hover:bg-[#5b7eff]/15 hover:ring-[#5b7eff]/50"
                            style={{ animation: 'sellupHop .5s cubic-bezier(.16,1,.3,1)' }}
                          >
                            <span className="block truncate text-[10px]">{d.flag} {d.name}</span>
                            <span className="mt-0.5 block h-0.5 rounded-full" style={{ background: i === 0 ? '#5b7eff' : i === 1 ? '#8b5cf6' : i === 2 ? '#f59e0b' : '#34d399' }} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </AppCard>
                )
              })}
            </div>
          </div>
          <p className="mt-2 text-[10px] opacity-55">{t({ es: 'Hoy los tres agentes cubren las tres primeras etapas; Reunión, Cotización, Venta interna y Cierre se activan cuando estén sus agentes.', en: 'Today the three agents cover the first three stages; Meeting, Quote, Internal sale and Close switch on when their agents ship.' })}</p>
        </div>
      </AppFrame>
      <style>{'@keyframes sellupHop{from{opacity:0;transform:translateX(-14px) scale(.96)}to{opacity:1;transform:none}}'}</style>
      <SampleNote />
    </div>
  )
}

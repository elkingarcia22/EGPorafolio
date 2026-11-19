'use client'

import { useEffect, useState } from 'react'
import { useLocale, type L } from '@/lib/i18n'
import { AppCard, AppFrame, Pill, RumboOrb } from './platform'
import { useInView } from './ui'
import { AppButton, Kpi, SampleNote } from './forma-shared'

interface Person {
  name: string
  role: string
  source: string
  phone: boolean
  inHubSpot: boolean
}

interface Step {
  source: string
  cost: L
  note: L
  adds: readonly Person[]
  credits: number
}

/** Cascada de ejemplo para una empresa ficticia. */
const STEPS: readonly Step[] = [
  { source: 'HubSpot', cost: { es: 'Gratis', en: 'Free' }, note: { es: 'Contactos sin dueño activo', en: 'Contacts with no active owner' }, credits: 0, adds: [
    { name: 'Laura Méndez', role: 'Directora de Talento Humano', source: 'HubSpot', phone: false, inHubSpot: true },
    { name: 'Andrés Cuervo', role: 'Gerente de Formación', source: 'HubSpot', phone: true, inHubSpot: true },
  ] },
  { source: 'SellUp', cost: { es: 'Gratis', en: 'Free' }, note: { es: 'Ya conocidos, menos de 180 días', en: 'Already known, under 180 days' }, credits: 0, adds: [
    { name: 'Paula Rincón', role: 'VP de Personas', source: 'SellUp', phone: false, inHubSpot: false },
  ] },
  { source: 'Apollo', cost: { es: '1 crédito/persona', en: '1 credit/person' }, note: { es: 'Buscar gratis, completar perfil paga', en: 'Search is free, completing a profile pays' }, credits: 2, adds: [
    { name: 'Martín Ospina', role: 'Head of Learning & Development', source: 'Apollo', phone: true, inHubSpot: false },
    { name: 'Diana Torres', role: 'Directora de Cultura', source: 'Apollo', phone: false, inHubSpot: false },
  ] },
  { source: 'Lusha', cost: { es: 'Solo teléfono', en: 'Phone only' }, note: { es: 'Si Apollo no trajo el número', en: 'If Apollo had no number' }, credits: 1, adds: [] },
]

const RESERVED = 8

/** Agente 2: sección «Enriquecimiento de contactos» de la ficha de empresa. */
export function ContactEnrichment() {
  const { t } = useLocale()
  const [ref, seen] = useInView<HTMLDivElement>(0.3)
  const [phase, setPhase] = useState(-1) // -1 sin correr · 0 reserva · 1..4 fuentes · 5 listo

  useEffect(() => {
    if (phase < 0 || phase >= STEPS.length + 1) return
    const id = window.setTimeout(() => setPhase((p) => p + 1), phase === 0 ? 900 : 1300)
    return () => window.clearTimeout(id)
  }, [phase])

  useEffect(() => {
    if (seen && phase === -1) {
      const id = window.setTimeout(() => setPhase(0), 900)
      return () => window.clearTimeout(id)
    }
  }, [seen, phase])

  const done = STEPS.slice(0, Math.max(0, phase - 1))
  const people = done.flatMap((s) => s.adds).map((p) => (phase > STEPS.length && p.name === 'Diana Torres' ? { ...p, phone: true, source: 'Apollo + Lusha' } : p))
  const used = done.reduce((a, s) => a + s.credits, 0)
  const running = phase >= 0 && phase <= STEPS.length
  const finished = phase > STEPS.length

  return (
    <div ref={ref} data-reveal="device">
      <AppFrame active="flujo" crumb="Flujo de prospección / Grupo Andino de Alimentos">
        <div className="space-y-3 p-3 md:p-4">
          <AppCard className="px-3 py-2.5">
            <p className="text-[15px] font-semibold">Grupo Andino de Alimentos</p>
            <p className="mt-0.5 text-[10px] opacity-55">🇨🇴 Colombia · Alimentos · 1.200 {t({ es: 'empleados', en: 'employees' })}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Pill tone="blue">{t({ es: 'Enriquecimiento', en: 'Enrichment' })}</Pill>
              {people.length === 0 && <Pill tone="amber">{t({ es: 'Sin contactos', en: 'No contacts' })}</Pill>}
            </div>
          </AppCard>

          <AppCard className="p-3">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-medium">2. {t({ es: 'Enriquecimiento de contactos', en: 'Contact enrichment' })}</p>
              <Pill tone="blue">Agente 2A</Pill>
              <span className="ml-auto">
                <AppButton gradient="linear-gradient(90deg,#5b7eff,#8b5cf6)" disabled={running} onClick={() => setPhase(0)}>
                  <RumboOrb size={12} /> {finished ? t({ es: 'Buscar de nuevo', en: 'Search again' }) : t({ es: 'Buscar más contactos con IA', en: 'Find more contacts with AI' })}
                </AppButton>
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 rounded-lg ring-1 ring-white/[0.08] sm:grid-cols-4">
              <Kpi label={t({ es: 'Contactos', en: 'Contacts' })} value={people.length} />
              <Kpi label={t({ es: 'Decisores', en: 'Decision-makers' })} value={people.filter((p) => /Directora|VP|Head|Gerente/.test(p.role)).length} />
              <Kpi label={t({ es: 'Con teléfono', en: 'With phone' })} value={people.filter((p) => p.phone).length} />
              <Kpi label={t({ es: 'En HubSpot', en: 'In HubSpot' })} value={people.filter((p) => p.inHubSpot).length} />
            </div>

            <div className="mt-3 rounded-lg bg-black/25 p-2.5 ring-1 ring-white/[0.06]">
              <div className="flex items-center justify-between text-[10px]">
                <span className="opacity-60">{t({ es: 'Créditos reservados antes de llamar', en: 'Credits reserved before calling' })}</span>
                <span className="tabular-nums">{phase < 0 ? '—' : finished ? `${used} ${t({ es: 'usados', en: 'used' })} · ${RESERVED - used} ${t({ es: 'devueltos', en: 'returned' })}` : `${used} / ${RESERVED}`}</span>
              </div>
              <div className="mt-1.5 flex h-2 gap-0.5">
                {Array.from({ length: RESERVED }, (_, i) => (
                  <span key={i} className={`flex-1 rounded-sm transition-colors duration-500 ${phase < 0 ? 'bg-white/10' : i < used ? 'bg-amber-400' : finished ? 'bg-emerald-400/50' : 'bg-[#5b7eff]/60'}`} />
                ))}
              </div>
            </div>

            <ol className="mt-3 grid gap-1.5 sm:grid-cols-4">
              {STEPS.map((s, i) => {
                const state = phase > i + 1 || finished ? 'done' : phase === i + 1 ? 'run' : 'idle'
                return (
                  <li key={s.source} className={`rounded-lg p-2 ring-1 transition-all duration-500 ${state === 'run' ? 'bg-[#5b7eff]/10 ring-[#5b7eff]/50' : state === 'done' ? 'ring-white/10' : 'opacity-40 ring-white/[0.06]'}`}>
                    <p className="flex items-center justify-between font-medium">
                      {s.source}
                      <span className="text-[10px]">{state === 'done' ? (i === 3 ? '+1 ☎' : `+${s.adds.length}`) : state === 'run' ? '…' : ''}</span>
                    </p>
                    <p className="mt-0.5 text-[10px] opacity-55">{t(s.cost)} · {t(s.note)}</p>
                  </li>
                )
              })}
            </ol>

            <ul className="mt-3 space-y-1">
              {people.map((p) => (
                <li key={p.name} className="flex items-center gap-2 rounded-md px-2 py-1.5 ring-1 ring-white/[0.06]" style={{ animation: 'sellupRowIn .45s ease-out' }}>
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/10 text-[9px]">{p.name.split(' ').map((w) => w[0]).join('')}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate">{p.name}</span>
                    <span className="block truncate text-[10px] opacity-50">{p.role}</span>
                  </span>
                  {p.phone && <span className="text-[10px] text-emerald-300">☎</span>}
                  <Pill tone="gray">{p.source}</Pill>
                </li>
              ))}
            </ul>
            {finished && <p className="mt-2 text-[10px] text-amber-300/80">{t({ es: 'Nada se aprueba solo: los 5 contactos quedan «por revisar».', en: 'Nothing approves itself: all 5 contacts land in “to review”.' })}</p>}
          </AppCard>
        </div>
      </AppFrame>
      <style>{'@keyframes sellupRowIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}'}</style>
      <SampleNote />
    </div>
  )
}

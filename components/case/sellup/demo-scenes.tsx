'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocale, type L } from '@/lib/i18n'
import { BLUE } from './ui'

/** Avanza un paso cada `ms` tras `start()`, hasta `total`. */
function useRun(total: number, ms = 700): { step: number; running: boolean; start: () => void; reset: () => void } {
  const [step, setStep] = useState(-1)
  const timer = useRef<number | undefined>(undefined)
  const clear = () => window.clearInterval(timer.current)
  const start = useCallback(() => {
    clear()
    setStep(0)
    timer.current = window.setInterval(() => setStep((s) => (s + 1 >= total ? (clear(), total) : s + 1)), ms)
  }, [total, ms])
  const reset = useCallback(() => {
    clear()
    setStep(-1)
  }, [])
  useEffect(() => clear, [])
  return { step, running: step >= 0 && step < total, start, reset }
}

const BTN = 'rounded-[10px] px-3.5 py-2 text-sm font-medium text-white transition-opacity disabled:opacity-40'
const GHOST = 'rounded-[8px] border border-black/10 px-2.5 py-1 text-xs hover:bg-black/[0.04]'
const PANEL = 'rounded-[14px] border border-black/[0.08] bg-white p-4'

/** Pasos que muestra el panel de Rumbo mientras trabaja. */
function Progress({ steps, step }: { steps: readonly L[]; step: number }) {
  const { t } = useLocale()
  return (
    <ol className="mt-4 space-y-2 text-sm">
      {steps.map((s, i) => (
        <li key={s.es} className={`flex items-center gap-2 transition-opacity ${i <= step ? 'opacity-100' : 'opacity-30'}`}>
          <span className="grid h-5 w-5 place-items-center rounded-full text-[10px] text-white" style={{ background: i < step ? '#10b981' : i === step ? BLUE : '#c7cbd3' }}>{i < step ? '✓' : i + 1}</span>
          {t(s)}
        </li>
      ))}
    </ol>
  )
}

type Decision = 'pending' | 'approved' | 'discarded'

/* ── Agente 1 ───────────────────────────────────────────────────────── */

const COMPANIES = [
  { name: 'Clínica Andina del Norte', size: '1.240', badge: { es: 'Libre en HubSpot', en: 'Free in HubSpot' } },
  { name: 'Grupo Salud Meridiano', size: '3.100', badge: { es: 'Nueva', en: 'New' } },
  { name: 'Laboratorios Ceiba', size: '640', badge: { es: 'Libre en HubSpot', en: 'Free in HubSpot' } },
  { name: 'Hospital San Telmo', size: '980', badge: { es: 'Nueva', en: 'New' } },
  { name: 'Farmacias Prado', size: '2.050', badge: { es: 'Nueva', en: 'New' } },
] as const

const A1_STEPS: readonly L[] = [
  { es: 'Empresas libres de HubSpot · gratis', en: 'Free HubSpot companies · free' },
  { es: 'Registros oficiales del país · gratis', en: 'Official registries · free' },
  { es: 'Banco de empresas · gratis', en: 'Company bank · free' },
  { es: 'Rescate de Rumbo · completa con cita', en: 'Rumbo rescue · fills with a citation' },
]

export function CompaniesScene() {
  const { t } = useLocale()
  const run = useRun(A1_STEPS.length)
  const [country, setCountry] = useState('México')
  const [industry, setIndustry] = useState('Salud')
  const [decisions, setDecisions] = useState<Record<string, Decision>>({})
  const done = run.step >= A1_STEPS.length
  const shown = done ? COMPANIES.length : Math.max(0, run.step) + (run.step >= 0 ? 1 : 0)
  const decide = (name: string, d: Decision) => setDecisions((prev) => ({ ...prev, [name]: d }))
  const approved = Object.values(decisions).filter((d) => d === 'approved').length

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className={PANEL}>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="font-medium">{t({ es: 'Empresas · Por revisar', en: 'Companies · To review' })}</p>
          <p className="text-xs text-black/50">{approved} {t({ es: 'aprobadas', en: 'approved' })}</p>
        </div>
        {run.step < 0 && <p className="mt-10 text-center text-sm text-black/40">{t({ es: 'Pídele a Rumbo una búsqueda →', en: 'Ask Rumbo for a search →' })}</p>}
        <ul className="mt-3 divide-y divide-black/[0.06]">
          {COMPANIES.slice(0, shown).map((c) => {
            const d = decisions[c.name] ?? 'pending'
            return (
              <li key={c.name} className="flex flex-wrap items-center gap-x-3 gap-y-2 py-2.5 text-sm">
                <span className={d === 'discarded' ? 'text-black/35 line-through' : ''}>{c.name}</span>
                <span className="font-mono text-[11px] text-black/40">{c.size}</span>
                <span className="rounded-md bg-[#5b7eff]/10 px-2 py-0.5 text-[11px] text-[#3150d8]">{t(c.badge)}</span>
                <span className="ml-auto flex gap-1.5">
                  {d === 'pending' ? (
                    <>
                      <button className={GHOST} onClick={() => decide(c.name, 'approved')}>{t({ es: 'Aprobar', en: 'Approve' })}</button>
                      <button className={GHOST} onClick={() => decide(c.name, 'discarded')}>{t({ es: 'Descartar', en: 'Discard' })}</button>
                    </>
                  ) : (
                    <button className={`${GHOST} ${d === 'approved' ? 'text-emerald-700' : 'text-black/45'}`} onClick={() => decide(c.name, 'pending')}>
                      {d === 'approved' ? `✓ ${t({ es: 'Aprobada', en: 'Approved' })}` : t({ es: 'Rescatar', en: 'Restore' })}
                    </button>
                  )}
                </span>
              </li>
            )
          })}
        </ul>
      </div>
      <aside className={PANEL}>
        <p className="font-medium">Rumbo · {t({ es: 'Empresas por criterios', en: 'Companies by criteria' })}</p>
        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
          <select value={country} onChange={(e) => setCountry(e.target.value)} className="rounded-[10px] border border-black/10 bg-white px-2 py-2" aria-label={t({ es: 'País', en: 'Country' })}>
            {['México', 'Colombia', 'Chile', 'Perú'].map((c) => <option key={c}>{c}</option>)}
          </select>
          <select value={industry} onChange={(e) => setIndustry(e.target.value)} className="rounded-[10px] border border-black/10 bg-white px-2 py-2" aria-label={t({ es: 'Industria', en: 'Industry' })}>
            {['Salud', 'Retail', 'Tecnología', 'Industria'].map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <button className={`${BTN} mt-3 w-full`} style={{ background: BLUE }} disabled={run.running} onClick={() => { setDecisions({}); run.start() }}>
          {done ? t({ es: 'Buscar otra vez', en: 'Search again' }) : t({ es: 'Buscar 5 empresas', en: 'Find 5 companies' })}
        </button>
        {run.step >= 0 && <Progress steps={A1_STEPS} step={run.step} />}
        {done && <p className="mt-4 rounded-[10px] bg-emerald-500/10 px-3 py-2 text-xs text-emerald-800">{t({ es: `Meta cumplida en ${country} × ${industry} sin bases de pago. Nada entra solo: revisa la bandeja.`, en: `Goal met in ${country} × ${industry} without paid databases. Nothing gets in on its own: check the queue.` })}</p>}
      </aside>
    </div>
  )
}

/* ── Agente 2 ───────────────────────────────────────────────────────── */

const PEOPLE = [
  { name: 'Laura Méndez', role: { es: 'Directora de Gestión Humana', en: 'Head of People' }, from: 'HubSpot' },
  { name: 'Andrés Pinto', role: { es: 'Gerente de Formación', en: 'Learning Manager' }, from: 'HubSpot' },
  { name: 'Sofía Rivas', role: { es: 'VP de Talento', en: 'VP of Talent' }, from: { es: 'nuevo', en: 'new' } },
  { name: 'Mateo Gil', role: { es: 'Gerente General', en: 'General Manager' }, from: { es: 'nuevo', en: 'new' } },
] as const

const A2_STEPS: readonly L[] = [
  { es: 'HubSpot primero · 2 contactos · gratis', en: 'HubSpot first · 2 contacts · free' },
  { es: 'Base de contactos · buscar no cobra', en: 'Contact base · searching is free' },
  { es: 'Completar 2 perfiles · 3 créditos', en: 'Complete 2 profiles · 3 credits' },
]

export function ContactsScene() {
  const { t } = useLocale()
  const run = useRun(A2_STEPS.length)
  const [decisions, setDecisions] = useState<Record<string, Decision>>({})
  const [phones, setPhones] = useState<Record<string, 'loading' | 'done'>>({})
  const done = run.step >= A2_STEPS.length
  const reveal = (name: string) => {
    setPhones((p) => ({ ...p, [name]: 'loading' }))
    window.setTimeout(() => setPhones((p) => ({ ...p, [name]: 'done' })), 1400)
  }
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className={PANEL}>
        <p className="font-medium">{t({ es: 'Contactos por revisar · Grupo Salud Meridiano', en: 'Contacts to review · Grupo Salud Meridiano' })}</p>
        {!done && <p className="mt-10 text-center text-sm text-black/40">{run.running ? t({ es: 'Buscando decisores…', en: 'Finding decision-makers…' }) : t({ es: 'Pídele a Rumbo los contactos →', en: 'Ask Rumbo for contacts →' })}</p>}
        {done && (
          <ul className="mt-3 divide-y divide-black/[0.06]">
            {PEOPLE.map((p) => {
              const d = decisions[p.name] ?? 'pending'
              const ph = phones[p.name]
              return (
                <li key={p.name} className="flex flex-wrap items-center gap-x-3 gap-y-2 py-2.5 text-sm">
                  <span className="min-w-[160px]">
                    <span className={`block ${d === 'discarded' ? 'text-black/35 line-through' : ''}`}>{p.name}</span>
                    <span className="block text-xs text-black/50">{t(p.role)}</span>
                  </span>
                  <span className="rounded-md bg-black/[0.05] px-2 py-0.5 text-[11px] text-black/60">{typeof p.from === 'string' ? p.from : t(p.from)}</span>
                  <span className="font-mono text-xs text-black/60">{ph === 'done' ? '+57 3•• ••• ••48' : ph === 'loading' ? t({ es: 'Apollo → Lusha…', en: 'Apollo → Lusha…' }) : ''}</span>
                  <span className="ml-auto flex gap-1.5">
                    {!ph && <button className={GHOST} onClick={() => reveal(p.name)}>☎ {t({ es: 'Revelar', en: 'Reveal' })}</button>}
                    {d === 'pending' ? (
                      <>
                        <button className={GHOST} onClick={() => setDecisions((x) => ({ ...x, [p.name]: 'approved' }))}>{t({ es: 'Aprobar', en: 'Approve' })}</button>
                        <button className={GHOST} onClick={() => setDecisions((x) => ({ ...x, [p.name]: 'discarded' }))}>{t({ es: 'Rechazar', en: 'Reject' })}</button>
                      </>
                    ) : (
                      <span className={`px-2 py-1 text-xs ${d === 'approved' ? 'text-emerald-700' : 'text-black/45'}`}>{d === 'approved' ? `✓ ${t({ es: 'Aprobado · vinculado en HubSpot', en: 'Approved · linked in HubSpot' })}` : t({ es: 'Rechazado', en: 'Rejected' })}</span>
                    )}
                  </span>
                </li>
              )
            })}
          </ul>
        )}
      </div>
      <aside className={PANEL}>
        <p className="font-medium">Rumbo · {t({ es: 'Buscar contactos', en: 'Find contacts' })}</p>
        <p className="mt-2 text-xs text-black/55">{t({ es: 'RR. HH., People, Learning y dirección general.', en: 'HR, People, Learning and general management.' })}</p>
        <button className={`${BTN} mt-3 w-full`} style={{ background: BLUE }} disabled={run.running} onClick={() => { setDecisions({}); setPhones({}); run.start() }}>
          {done ? t({ es: 'Buscar otra vez', en: 'Search again' }) : t({ es: 'Buscar decisores', en: 'Find decision-makers' })}
        </button>
        {run.step >= 0 && <Progress steps={A2_STEPS} step={run.step} />}
        {done && <p className="mt-4 rounded-[10px] bg-[#5b7eff]/10 px-3 py-2 text-xs text-[#2a44b8]">{t({ es: '2 ya estaban en HubSpot y 2 son nuevos. El teléfono se paga solo si lo pides.', en: '2 were already in HubSpot and 2 are new. The phone is paid only if you ask.' })}</p>}
      </aside>
    </div>
  )
}

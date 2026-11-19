'use client'

import { useLocale, type L } from '@/lib/i18n'
import { useA11y } from '@/lib/a11y'
import { useTick } from '../barberlytics/thema/live-pieces'
import { APP, Pill, RumboOrb } from './platform'

/**
 * Escena de portada: Rumbo, la IA de SellUp, consulta fuentes alrededor suyo
 * y entrega, por turnos, empresas, contactos y el primer contacto.
 * Empresas y personas son de ejemplo.
 */

interface Phase {
  agent: L
  ask: L
  sources: readonly string[]
}

const PHASES: readonly Phase[] = [
  { agent: { es: 'Agente 1 · Empresas', en: 'Agent 1 · Companies' }, ask: { es: 'Buscando empresas de salud en México con más de 200 empleados…', en: 'Looking for healthcare companies in Mexico with 200+ employees…' }, sources: ['HubSpot', 'Registros', 'Banco', 'Web'] },
  { agent: { es: 'Agente 2 · Contactos', en: 'Agent 2 · Contacts' }, ask: { es: 'Buscando quién decide en Recursos Humanos…', en: 'Looking for who decides in HR…' }, sources: ['HubSpot', 'Apollo', 'Lusha', 'Sitio'] },
  { agent: { es: 'Agente 3 · Primer contacto', en: 'Agent 3 · First contact' }, ask: { es: 'Investigando la empresa y a la persona para la primera llamada…', en: 'Researching the company and the person for the first call…' }, sources: ['Sitio', 'Noticias', 'Prensa RR. HH.', 'LinkedIn'] },
]

/** Fuentes en órbita (ángulo en grados). */
const ORBIT: readonly { name: string; deg: number }[] = [
  { name: 'HubSpot', deg: -90 },
  { name: 'Registros', deg: -54 },
  { name: 'Banco', deg: -18 },
  { name: 'Web', deg: 18 },
  { name: 'Apollo', deg: 54 },
  { name: 'Lusha', deg: 90 },
  { name: 'Sitio', deg: 126 },
  { name: 'Noticias', deg: 162 },
  { name: 'Prensa RR. HH.', deg: 198 },
  { name: 'LinkedIn', deg: 234 },
]

const COMPANIES = [
  { name: 'Clínica Andina', meta: 'MX · 1.240 emp.', tag: { es: 'Libre en HubSpot', en: 'Free in HubSpot' }, tone: 'green' as const },
  { name: 'Grupo Vital Salud', meta: 'MX · 860 emp.', tag: { es: 'Nueva', en: 'New' }, tone: 'blue' as const },
  { name: 'Hospitales del Valle', meta: 'MX · 2.100 emp.', tag: { es: 'Nueva', en: 'New' }, tone: 'blue' as const },
]
const PEOPLE = [
  { name: 'Mariana R.', role: { es: 'Directora de Talento', en: 'Head of Talent' }, tag: { es: 'Decisora', en: 'Decision-maker' } },
  { name: 'Jorge P.', role: { es: 'Gerente de RR. HH.', en: 'HR Manager' }, tag: { es: 'Con teléfono', en: 'Has phone' } },
  { name: 'Lucía T.', role: { es: 'Líder de Formación', en: 'L&D Lead' }, tag: { es: 'Ya en HubSpot', en: 'In HubSpot' } },
]
const FACTS: readonly L[] = [
  { es: 'Abrió 3 clínicas en 2026 [noticias]', en: 'Opened 3 clinics in 2026 [news]' },
  { es: 'Busca 120 enfermeras este trimestre [empleo]', en: 'Hiring 120 nurses this quarter [jobs]' },
  { es: 'Mariana lidera la nueva academia interna [LinkedIn]', en: 'Mariana leads the new internal academy [LinkedIn]' },
]

const STEPS = 6

export function HeroRumbo() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const tick = useTick(1100)
  const phase = reducedMotion ? 2 : Math.floor(tick / STEPS) % PHASES.length
  const step = reducedMotion ? STEPS : tick % STEPS
  const p = PHASES[phase]

  return (
    <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-center">
      {/* Órbita */}
      <div className="relative mx-auto aspect-square w-full max-w-[460px]">
        <div className="absolute inset-[8%] rounded-full border border-white/10" aria-hidden="true" />
        <div className="absolute inset-[24%] rounded-full border border-dashed border-white/10" aria-hidden="true" />
        <div
          className="absolute inset-[8%] animate-[spin_5s_linear_infinite] rounded-full motion-reduce:animate-none"
          style={{ background: 'conic-gradient(from 0deg, rgba(139,92,246,0.35), rgba(91,126,255,0.08) 18%, transparent 30%)' }}
          aria-hidden="true"
        />
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
          {ORBIT.map((o) => {
            const on = p.sources.includes(o.name)
            const x = 50 + 42 * Math.cos((o.deg * Math.PI) / 180)
            const y = 50 + 42 * Math.sin((o.deg * Math.PI) / 180)
            return (
              <g key={o.name} style={{ opacity: on ? 1 : 0.15, transition: 'opacity 600ms' }}>
                <line x1={x} y1={y} x2="50" y2="50" stroke="url(#beam)" strokeWidth="0.4" strokeDasharray="1.5 1.5">
                  {on && !reducedMotion && <animate attributeName="stroke-dashoffset" from="6" to="0" dur="0.8s" repeatCount="indefinite" />}
                </line>
                {on && !reducedMotion && (
                  <circle r="0.9" fill="#b7c6ff">
                    <animateMotion dur="1.4s" repeatCount="indefinite" path={`M${x},${y} L50,50`} />
                  </circle>
                )}
              </g>
            )
          })}
          <defs>
            <linearGradient id="beam" x1="0" x2="1">
              <stop offset="0" stopColor="#5b7eff" />
              <stop offset="1" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
        {ORBIT.map((o) => {
          const on = p.sources.includes(o.name)
          const x = 50 + 42 * Math.cos((o.deg * Math.PI) / 180)
          const y = 50 + 42 * Math.sin((o.deg * Math.PI) / 180)
          return (
            <span
              key={o.name}
              className={`absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] ring-1 transition-all duration-500 ${on ? 'bg-[#5b7eff]/20 text-white ring-[#5b7eff]/60 shadow-[0_0_24px_rgba(91,126,255,0.45)]' : 'bg-white/[0.03] text-white/35 ring-white/10'}`}
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              {o.name}
            </span>
          )
        })}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <RumboOrb size={104} pulse={!reducedMotion} />
          <p className="mt-3 text-sm font-medium">Rumbo</p>
          <p className="text-[11px] text-white/50">{t(p.agent)}</p>
        </div>
      </div>

      {/* Lo que va entregando */}
      <div className="relative rounded-[16px] p-4 ring-1 ring-white/10 md:p-5" style={{ background: APP.card }}>
        <div className="flex items-start gap-3">
          <RumboOrb size={22} />
          <p key={phase} className="min-h-[2.6em] text-sm leading-snug text-white/85">
            {t(p.ask).slice(0, Math.max(8, Math.round((t(p.ask).length * Math.min(step + 1, 3)) / 3)))}
            {step < 2 && <span className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse bg-[#8b5cf6] align-middle" />}
          </p>
        </div>
        <div className="mt-4 flex gap-1.5" aria-hidden="true">
          {PHASES.map((_, i) => (
            <span key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
              <span className="block h-full rounded-full bg-gradient-to-r from-[#5b7eff] to-[#8b5cf6] transition-[width] duration-1000 ease-linear" style={{ width: i < phase ? '100%' : i === phase ? `${((step + 1) / STEPS) * 100}%` : '0%' }} />
            </span>
          ))}
        </div>
        <ul className="mt-4 min-h-[188px] space-y-2">
          {phase === 0 && COMPANIES.map((c, i) => (
            <Row key={c.name} show={step > i}>
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/5 text-xs font-medium">{c.name[0]}</span>
              <span className="min-w-0 flex-1"><span className="block truncate text-[13px]">{c.name}</span><span className="block text-[11px] text-white/45">{c.meta}</span></span>
              <Pill tone={c.tone}>{t(c.tag)}</Pill>
            </Row>
          ))}
          {phase === 1 && PEOPLE.map((c, i) => (
            <Row key={c.name} show={step > i}>
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#5b7eff] to-[#8b5cf6] text-xs font-medium">{c.name[0]}</span>
              <span className="min-w-0 flex-1"><span className="block truncate text-[13px]">{c.name}</span><span className="block text-[11px] text-white/45">{t(c.role)}</span></span>
              <Pill tone="green">{t(c.tag)}</Pill>
            </Row>
          ))}
          {phase === 2 && (
            <>
              {FACTS.map((f, i) => (
                <Row key={f.es} show={step > i}>
                  <span className="text-[#b7c6ff]">✦</span>
                  <span className="text-[13px] text-white/80">{t(f)}</span>
                </Row>
              ))}
              <Row show={step > 3}>
                <span className="w-full rounded-lg bg-[#5b7eff]/10 p-2.5 text-[12px] leading-snug text-white/85 ring-1 ring-[#5b7eff]/30">
                  {t({ es: '«Mariana, vi que están abriendo clínicas y contratando 120 enfermeras. ¿Cómo piensan formarlas en el primer mes?»', en: '“Mariana, I saw you’re opening clinics and hiring 120 nurses. How do you plan to train them in month one?”' })}
                </span>
              </Row>
            </>
          )}
        </ul>
        <p className="mt-3 text-right text-[10px] text-white/35">{t({ es: 'Datos de ejemplo', en: 'Sample data' })}</p>
      </div>
    </div>
  )
}

function Row({ show, children }: { show: boolean; children: React.ReactNode }) {
  return (
    <li className={`flex items-center gap-3 rounded-[10px] bg-white/[0.03] px-3 py-2 ring-1 ring-white/[0.06] transition-all duration-500 ease-expo ${show ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}>
      {children}
    </li>
  )
}

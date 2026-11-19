'use client'

import { useLocale, type L } from '@/lib/i18n'
import { useA11y } from '@/lib/a11y'
import { useTick } from '../barberlytics/thema/live-pieces'
import { RumboOrb } from './platform'

/**
 * Escena de portada: Rumbo, la IA de SellUp, en el centro consultando fuentes.
 * Alrededor, letreros de lo que hace la plataforma que se encienden por turnos.
 */

const PHASES: readonly { agent: L; sources: readonly string[] }[] = [
  { agent: { es: 'Agente 1 · Empresas', en: 'Agent 1 · Companies' }, sources: ['HubSpot', 'Registros', 'Banco', 'Web'] },
  { agent: { es: 'Agente 2 · Contactos', en: 'Agent 2 · Contacts' }, sources: ['HubSpot', 'Apollo', 'Lusha', 'Sitio'] },
  { agent: { es: 'Agente 3 · Primer contacto', en: 'Agent 3 · First contact' }, sources: ['Sitio', 'Noticias', 'Prensa RR. HH.', 'LinkedIn'] },
]

const NAMES = ['HubSpot', 'Registros', 'Banco', 'Web', 'Apollo', 'Lusha', 'Sitio', 'Noticias', 'Prensa RR. HH.', 'LinkedIn']
const ORBIT = NAMES.map((name, i) => {
  const a = ((-90 + 36 * i) * Math.PI) / 180
  return { name, x: 50 + 42 * Math.cos(a), y: 50 + 42 * Math.sin(a) }
})

interface Feature {
  phase: number
  title: L
  body: L
}

/** Lo que hace la plataforma: cuatro letreros a cada lado. */
const LEFT: readonly Feature[] = [
  { phase: 0, title: { es: 'Empresas por criterios', en: 'Companies by criteria' }, body: { es: 'País · industria · más de 200 empleados', en: 'Country · industry · 200+ employees' } },
  { phase: 0, title: { es: 'Muchas empresas por rondas', en: 'Many companies in rounds' }, body: { es: 'Hasta 200, con tope de créditos', en: 'Up to 200, with a credit cap' } },
  { phase: 0, title: { es: 'Competidores · proveedores · árbol', en: 'Competitors · suppliers · tree' }, body: { es: 'Desde una empresa de referencia', en: 'From a reference company' } },
  { phase: 0, title: { es: 'Libre en HubSpot', en: 'Free in HubSpot' }, body: { es: 'Empresas que nadie atiende, primero', en: 'Unworked companies first' } },
]
const RIGHT: readonly Feature[] = [
  { phase: 1, title: { es: 'Decisores de RR. HH.', en: 'HR decision-makers' }, body: { es: 'HubSpot → base → Apollo → Lusha', en: 'HubSpot → base → Apollo → Lusha' } },
  { phase: 1, title: { es: 'Teléfono con créditos reservados', en: 'Phone with reserved credits' }, body: { es: 'Lo que no se usa, se devuelve', en: 'Unused credits come back' } },
  { phase: 2, title: { es: 'Primer contacto por canal', en: 'First contact per channel' }, body: { es: 'Correo · LinkedIn · llamada · WhatsApp', en: 'Email · LinkedIn · call · WhatsApp' } },
  { phase: 2, title: { es: 'Cada dato con su cita', en: 'Every fact cited' }, body: { es: 'Noticias, vacantes y cambios de la empresa', en: 'News, openings and company changes' } },
]

const STEPS = 4

function Tag({ f, on, align }: { f: Feature; on: boolean; align: 'left' | 'right' }) {
  const { t } = useLocale()
  return (
    <li
      className={`relative rounded-[14px] px-3.5 py-2.5 ring-1 backdrop-blur-md transition-all duration-500 ${align === 'right' ? 'lg:text-left' : 'lg:text-right'} ${
        on ? 'bg-[#5b7eff]/[0.14] ring-[#5b7eff]/60 shadow-[0_0_0_4px_rgba(91,126,255,0.12),0_30px_60px_-30px_rgba(0,0,0,0.9)]' : 'bg-[#141517]/80 ring-white/10 opacity-60'
      }`}
    >
      <p className="text-[13px] font-medium leading-snug">{t(f.title)}</p>
      <p className="mt-0.5 text-[11px] leading-snug text-white/50">{t(f.body)}</p>
      <span
        className={`absolute top-1/2 hidden h-px w-10 -translate-y-1/2 transition-opacity duration-500 lg:block ${align === 'left' ? '-right-10' : '-left-10'} ${on ? 'opacity-100' : 'opacity-0'}`}
        style={{ background: `linear-gradient(${align === 'left' ? '90deg' : '270deg'},#5b7eff,transparent)` }}
        aria-hidden="true"
      />
    </li>
  )
}

export function HeroRumbo() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const tick = useTick(1300)
  const phase = reducedMotion ? 0 : Math.floor(tick / STEPS) % PHASES.length
  const step = tick % STEPS
  const p = PHASES[phase]
  const all = [...LEFT, ...RIGHT]
  const inPhase = all.filter((f) => f.phase === phase)
  const activeTag = reducedMotion ? null : inPhase[step % inPhase.length]

  return (
    <div className="relative grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)_minmax(0,1fr)]">
      <ul className="order-2 grid gap-3 sm:grid-cols-2 lg:order-1 lg:grid-cols-1">
        {LEFT.map((f) => <Tag key={f.title.es} f={f} on={f === activeTag || (reducedMotion && f.phase === phase)} align="left" />)}
      </ul>

      <div className="relative order-1 mx-auto aspect-square w-full max-w-[520px] lg:order-2">
        <div className="absolute inset-[8%] rounded-full border border-white/10" aria-hidden="true" />
        <div className="absolute inset-[24%] rounded-full border border-dashed border-white/10" aria-hidden="true" />
        <div
          className="absolute inset-[8%] animate-[spin_5s_linear_infinite] rounded-full motion-reduce:animate-none"
          style={{ background: 'conic-gradient(from 0deg, rgba(139,92,246,0.35), rgba(91,126,255,0.08) 18%, transparent 30%)' }}
          aria-hidden="true"
        />
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <defs>
            <linearGradient id="beam" x1="0" x2="1">
              <stop offset="0" stopColor="#5b7eff" />
              <stop offset="1" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          {ORBIT.map((o) => {
            const on = p.sources.includes(o.name)
            return (
              <g key={o.name} style={{ opacity: on ? 1 : 0.15, transition: 'opacity 600ms' }}>
                <line x1={o.x} y1={o.y} x2="50" y2="50" stroke="url(#beam)" strokeWidth="0.4" strokeDasharray="1.5 1.5">
                  {on && !reducedMotion && <animate attributeName="stroke-dashoffset" from="6" to="0" dur="0.8s" repeatCount="indefinite" />}
                </line>
                {on && !reducedMotion && (
                  <circle r="0.9" fill="#b7c6ff">
                    <animateMotion dur="1.4s" repeatCount="indefinite" path={`M${o.x},${o.y} L50,50`} />
                  </circle>
                )}
              </g>
            )
          })}
        </svg>
        {ORBIT.map((o) => {
          const on = p.sources.includes(o.name)
          return (
            <span
              key={o.name}
              className={`absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] ring-1 transition-all duration-500 ${on ? 'bg-[#5b7eff]/20 text-white ring-[#5b7eff]/60 shadow-[0_0_24px_rgba(91,126,255,0.45)]' : 'bg-[#0d0e10] text-white/35 ring-white/10'}`}
              style={{ left: `${o.x}%`, top: `${o.y}%` }}
            >
              {o.name}
            </span>
          )
        })}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <RumboOrb size={112} pulse={!reducedMotion} />
          <p className="mt-3 text-sm font-medium">Rumbo</p>
          <p className="text-[11px] text-white/50" aria-live="polite">{t(p.agent)}</p>
        </div>
      </div>

      <ul className="order-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        {RIGHT.map((f) => <Tag key={f.title.es} f={f} on={f === activeTag || (reducedMotion && f.phase === phase)} align="right" />)}
      </ul>
    </div>
  )
}

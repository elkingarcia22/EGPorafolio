'use client'

import type { ReactNode } from 'react'
import { CheckCircle2, GitMerge, Mail, Search, ShieldCheck, Zap } from 'lucide-react'

/**
 * Las dos bandejas «Por revisar» de SellUp (empresas y contactos), tal cual la app.
 * La fila nueva entra arriba, destacada. Cifras agregadas reales; filas de ejemplo.
 */

/** Fila nueva destacada: el anillo va por dentro, así no se sale del marco. */
const FRESH = {
  background: 'linear-gradient(90deg,rgba(107,140,255,0.16),rgba(126,43,224,0.05))',
  boxShadow: 'inset 0 0 0 1.5px rgba(107,140,255,0.85), inset 3px 0 0 0 #6b8cff',
} as const

function Shell({ title, sub, cardTitle, count, chips, children }: { title: string; sub: string; cardTitle: string; count: string; chips: readonly { Icon: typeof Mail; label: string; n: string; tone: string }[]; children: ReactNode }) {
  return (
    <div className="px-8 pt-7">
      <p className="flex items-baseline gap-3"><span className="text-[24px] font-semibold tracking-tight">{title}</span><span className="truncate text-[12.5px] text-white/50">{sub}</span></p>
      <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-[#121212]">
        <div className="flex items-center gap-2 px-5 py-3.5">
          <span className="mr-auto whitespace-nowrap"><span className="block text-[14px] font-medium">{cardTitle}</span><span className="block text-[12px] text-white/50">{count}</span></span>
          {chips.map(({ Icon, label, n, tone }) => (
            <span key={label} className="flex items-center gap-1.5 whitespace-nowrap rounded-xl border border-white/10 px-2.5 py-1.5 text-[12px]"><Icon className={`h-3.5 w-3.5 ${tone}`} />{label} <span className="font-medium tabular-nums">{n}</span></span>
          ))}
          <span className="grid h-8 w-8 place-items-center rounded-xl border border-white/10"><Search className="h-3.5 w-3.5 opacity-70" /></span>
        </div>
        {children}
      </div>
    </div>
  )
}

const Th = ({ children }: { children: ReactNode }) => <span className="truncate">{children}</span>
const Box = () => <span className="h-3.5 w-3.5 rounded border border-white/25" />

const CO_COLS = 'grid-cols-[16px_minmax(0,1.7fr)_88px_minmax(0,1fr)_150px_176px]'
interface Co { name: string; sector: string; owner: string; quality: string; complete: boolean; status: string; ok: boolean; score: string }
const COMPANIES: readonly Co[] = [
  { name: 'Frutícola Los Andes', sector: 'Agroindustria', owner: 'Camila Torres V.', quality: '1 dato pendiente', complete: false, status: 'Validado para revisión', ok: true, score: '100' },
  { name: 'Viñedos Cordillera', sector: 'Agroindustria', owner: 'Camila Torres V.', quality: 'Información completa', complete: true, status: 'Necesita revisión', ok: false, score: '45' },
  { name: 'Lácteos del Maule', sector: 'Agroindustria', owner: 'Diego Muñoz R.', quality: '1 dato pendiente', complete: false, status: 'Necesita revisión', ok: false, score: '40' },
  { name: 'Berries del Pacífico', sector: 'Agroindustria', owner: 'Diego Muñoz R.', quality: 'Información completa', complete: true, status: 'Validado para revisión', ok: true, score: '100' },
  { name: 'Salmones Patagonia', sector: 'Consumo Masivo', owner: 'Diego Muñoz R.', quality: 'Información completa', complete: true, status: 'Necesita revisión', ok: false, score: '55' },
  { name: 'Conservas Aconcagua', sector: 'Consumo Masivo', owner: 'Camila Torres V.', quality: '2 datos pendientes', complete: false, status: 'Necesita revisión', ok: false, score: '0' },
  { name: 'AgroValle Sur', sector: 'Agroindustria', owner: 'Camila Torres V.', quality: '1 dato pendiente', complete: false, status: 'Necesita revisión', ok: false, score: '45' },
]
const NEW_CO: Co = { name: 'Agrícola Río Claro', sector: 'Agroindustria', owner: 'Camila Torres V.', quality: 'Información completa', complete: true, status: 'Validado para revisión', ok: true, score: '100' }

function CoRow({ c }: { c: Co }) {
  return (
    <div className={`grid ${CO_COLS} items-center gap-4 border-b border-white/[0.06] px-5 py-3 text-[13px]`}>
      <Box />
      <span className="min-w-0">
        <span className="flex items-center gap-1.5 font-semibold"><span className="truncate">{c.name}</span><ShieldCheck className="h-3.5 w-3.5 shrink-0 text-[#7fa0ff]" /></span>
        <span className="block truncate text-[11.5px] text-white/45">Agente 1 · {c.sector}</span>
      </span>
      <span className="truncate">🇨🇱 Chile</span>
      <span className="truncate text-white/70">{c.sector}</span>
      <span className="flex min-w-0 items-center gap-1.5"><span className={`h-1.5 w-1.5 shrink-0 rounded-full ${c.complete ? 'bg-emerald-400' : 'bg-amber-400'}`} /><span className="truncate text-white/80">{c.complete ? 'Completa' : c.quality}</span></span>
      <span className="min-w-0"><span className={`inline-block max-w-full truncate rounded-md border px-1.5 py-px text-[11.5px] ${c.ok ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300' : 'border-amber-500/40 bg-amber-500/10 text-amber-300'}`}>{c.status}</span></span>
    </div>
  )
}

/** «Por revisar» de empresas, con la nueva arriba cuando `arrived`. */
export function CompanyReview({ arrived, focus }: { arrived: boolean; focus: boolean }) {
  return (
    <Shell
      title="Por revisar"
      sub="Empresas candidatas, generadas con IA o importadas, que esperan tu decisión antes de ser cuentas."
      cardTitle="Prospectos por revisar"
      count={`${arrived ? 613 : 612} prospectos`}
      chips={[
        { Icon: CheckCircle2, label: 'Sin bloqueos detectados', n: arrived ? '418' : '417', tone: 'text-emerald-400' },
        { Icon: GitMerge, label: 'Posibles duplicados', n: '82', tone: 'text-amber-400' },
      ]}
    >
      <div className={`grid ${CO_COLS} gap-4 border-b border-white/10 px-5 py-2.5 text-[12px] text-white/50`}>
        <Box /><Th>Empresa</Th><Th>País</Th><Th>Sector</Th><Th>Calidad</Th><Th>Estado</Th>
      </div>
      <div className="overflow-hidden transition-[max-height] duration-[400ms] ease-expo" style={{ maxHeight: arrived ? 70 : 0 }}>
        <div className="transition-all duration-[400ms]" style={focus ? FRESH : undefined}><CoRow c={NEW_CO} /></div>
      </div>
      {COMPANIES.slice(0, 6).map((c) => <CoRow key={c.name} c={c} />)}
    </Shell>
  )
}

const CT_COLS = 'grid-cols-[16px_minmax(0,1.4fr)_minmax(0,1.2fr)_minmax(0,1fr)_84px_150px]'
interface Ct { name: string; role: string; company: string; country: string; source: string; high: boolean; linkedin: boolean }
const CONTACTS: readonly Ct[] = [
  { name: 'Julián Herrera', role: 'Gerente de RR. HH.', company: 'Clínica Andina', country: 'México', source: 'HubSpot', high: true, linkedin: false },
  { name: 'Paola Cárdenas', role: 'Jefa de Formación', company: 'Clínica Andina', country: 'México', source: 'HubSpot', high: true, linkedin: false },
  { name: 'Andrés Salinas', role: 'Coordinador de Talento', company: 'Clínica Andina', country: 'México', source: 'Apollo', high: false, linkedin: true },
  { name: 'Mónica Ibarra', role: 'Jefa de Capital Humano', company: 'Grupo Vital Salud', country: 'México', source: 'HubSpot', high: true, linkedin: false },
  { name: 'Ricardo Lozano', role: 'People Partner', company: 'Grupo Vital Salud', country: 'México', source: 'Apollo', high: false, linkedin: true },
  { name: 'Fernanda Ruiz', role: 'Gerente Regional de RH', company: 'Hospitales del Valle', country: 'México', source: 'HubSpot', high: true, linkedin: false },
  { name: 'Sergio Navarro', role: 'Director de Personas', company: 'Hospitales del Valle', country: 'México', source: 'Apollo', high: false, linkedin: true },
  { name: 'Liliana Vega', role: 'Jefa de Desarrollo', company: 'Hospitales del Valle', country: 'México', source: 'HubSpot', high: true, linkedin: false },
]
const NEW_CT: Ct = { name: 'Valeria Ortiz Lagos', role: 'Directora de Talento', company: 'Clínica Andina', country: 'México', source: 'Apollo', high: true, linkedin: true }

function CtRow({ c }: { c: Ct }) {
  return (
    <div className={`grid ${CT_COLS} items-center gap-4 border-b border-white/[0.06] px-5 py-3 text-[13px]`}>
      <Box />
      <span className="flex min-w-0 items-center gap-1.5 font-semibold"><span className="truncate">{c.name}</span><span className="shrink-0 rounded-md border border-emerald-500/40 bg-emerald-500/15 px-1 text-[11px] font-normal text-emerald-300">Nuevo</span></span>
      <span className="truncate text-white/70">{c.role}</span>
      <span className="truncate text-white/80">{c.company}</span>
      <span className="truncate text-white/70">{c.source}</span>
      <span className="flex min-w-0 items-center gap-1.5">{c.high ? <><span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" /><span className="truncate">Alta · 85%</span></> : <><span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white/30" /><span className="truncate text-white/60">Baja · 25%</span></>}</span>
    </div>
  )
}

/** «Por revisar» de contactos, con la nueva arriba cuando `arrived`. */
export function ContactReview({ arrived, focus }: { arrived: boolean; focus: boolean }) {
  return (
    <Shell
      title="Por revisar"
      sub="Perfiles encontrados por el Agente de contactos que pasaron el filtro de relevancia y esperan revisión humana."
      cardTitle="Candidatos por revisar"
      count={`${arrived ? 282 : 281} candidatos`}
      chips={[
        { Icon: Zap, label: 'Alta relevancia', n: arrived ? '131' : '130', tone: 'text-[#7fa0ff]' },
        { Icon: Mail, label: 'Con email', n: arrived ? '226' : '225', tone: 'text-emerald-400' },
      ]}
    >
      <div className={`grid ${CT_COLS} gap-4 border-b border-white/10 px-5 py-2.5 text-[12px] text-white/50`}>
        <Box /><Th>Nombre</Th><Th>Cargo</Th><Th>Empresa</Th><Th>Fuente</Th><Th>Relevancia</Th>
      </div>
      <div className="overflow-hidden transition-[max-height] duration-[400ms] ease-expo" style={{ maxHeight: arrived ? 56 : 0 }}>
        <div className="transition-all duration-[400ms]" style={focus ? FRESH : undefined}><CtRow c={NEW_CT} /></div>
      </div>
      {CONTACTS.slice(0, 7).map((c) => <CtRow key={c.name} c={c} />)}
    </Shell>
  )
}

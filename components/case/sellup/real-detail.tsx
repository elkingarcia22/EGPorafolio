'use client'

import type { ReactNode } from 'react'
import { Activity, Briefcase, Building2, Calendar, ChevronDown, Database, Globe, Hash, Loader2, Mail, MapPin, MessageCircle, Network, Pencil, PhoneCall, StickyNote, Tag, User, Users, X } from 'lucide-react'
import { RumboMark, RUMBO_GRADIENT } from './platform'
import { REAL } from './real-app'

/**
 * Detalles de empresa y de contacto de SellUp, como modales sobre la pantalla
 * (coordenadas de 1240 px). Copiados de las pantallas reales; datos de ejemplo.
 */

function Modal({ show, children, inline = false }: { show: boolean; children: ReactNode; inline?: boolean }) {
  if (inline) {
    return <div className="relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#1c1c1c] text-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.95)]" style={{ fontFamily: REAL.font }}>{children}</div>
  }
  return (
    <div className={`absolute inset-0 z-20 transition-opacity duration-500 ${show ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
      <div className="absolute inset-0 bg-black/60" />
      <div
        className={`absolute bottom-4 left-[200px] right-[140px] top-4 flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#1c1c1c] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.95)] transition-transform duration-[400ms] ease-expo ${show ? 'translate-y-0 scale-100' : 'translate-y-6 scale-[0.98]'}`}
      >
        {children}
      </div>
    </div>
  )
}

function Head({ Icon, title, tag, sub }: { Icon: typeof User; title: string; tag: ReactNode; sub?: string }) {
  return (
    <div className="flex items-center gap-3 border-b border-white/10 px-5 py-3.5">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#6b8cff]/10 text-[#8fa6ff]"><Icon className="h-4 w-4" /></span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2 text-[16px] font-semibold">{title}{tag}</span>
        {sub && <span className="block text-[12.5px] text-white/55">{sub}</span>}
      </span>
      <span className="grid h-8 w-8 place-items-center rounded-full border border-white/15"><X className="h-4 w-4" /></span>
    </div>
  )
}

function Strip({ items, stack = false }: { items: readonly { Icon: typeof User; label: string; value: ReactNode }[]; stack?: boolean }) {
  return (
    <div className={`${stack ? 'mx-4' : 'mx-5'} mt-4 rounded-[16px] border border-white/10 p-[3px]`}>
      <div className={`grid ${stack ? 'grid-cols-2 gap-x-3 gap-y-3 px-3' : 'grid-cols-4 px-4'} rounded-[13px] border border-white/10 bg-[#141414] py-3.5`}>
        {items.map(({ Icon, label, value }) => (
          <div key={label} className="flex gap-2.5">
            <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white/45" />
            <span className={stack ? 'min-w-0' : undefined}><span className="block text-[11.5px] text-white/55">{label}</span><span className="block text-[13px]">{value}</span></span>
          </div>
        ))}
      </div>
    </div>
  )
}

/** En teléfono la fila de pestañas sigue fuera del marco: se desvanece en vez de cortarse. */
const TABS_FADE = { maskImage: 'linear-gradient(to right,#000 80%,transparent)', WebkitMaskImage: 'linear-gradient(to right,#000 80%,transparent)' } as const

function Tabs({ items, stack = false }: { items: readonly { label: string; Icon: typeof User }[]; stack?: boolean }) {
  return (
    <div className={`${stack ? 'mx-4' : 'mx-5'} mt-4 flex gap-0.5 overflow-hidden text-[12.5px]`} style={stack ? TABS_FADE : undefined}>
      {items.map(({ label, Icon }, i) => (
        <span key={label} className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-1.5 ${i === 0 ? 'bg-[#6b8cff] font-medium text-[#0a0a0a]' : 'text-white/65'}`}><Icon className="h-3.5 w-3.5" />{label}</span>
      ))}
    </div>
  )
}

function Panel({ Icon, title, children, className = '' }: { Icon: typeof User; title: string; children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl bg-[#232323] ${className}`}>
      <p className="flex items-center gap-2.5 border-b border-white/[0.07] px-4 py-3 text-[13.5px] font-medium">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-[#6b8cff]/10 text-[#8fa6ff]"><Icon className="h-3.5 w-3.5" /></span>{title}
      </p>
      <div className="px-4 py-3">{children}</div>
    </div>
  )
}

const Row = ({ Icon, k, v }: { Icon: typeof User; k: string; v: string }) => (
  <p className="flex items-center gap-2 py-1.5 text-[12.5px]"><Icon className="h-3.5 w-3.5 text-white/45" /><span className="text-white/65">{k}</span><span className="ml-auto">{v}</span></p>
)

/**
 * Los dos paneles del detalle. En escritorio van lado a lado; apilados (teléfono)
 * ocupan el mismo lugar y se turnan con un fundido según `panel`, para no alargar la escena.
 */
function Panels({ stack, panel, children }: { stack: boolean; panel: number; children: readonly [ReactNode, ReactNode] }) {
  if (!stack) return <div className="mx-5 mt-4 grid grid-cols-2 gap-4">{children[0]}{children[1]}</div>
  return (
    <div className="mx-4 mt-4 grid">
      {children.map((child, i) => (
        <div key={i} className="transition-[opacity,transform] duration-500 ease-expo [grid-area:1/1]" style={{ opacity: i === panel ? 1 : 0, transform: i === panel ? 'none' : 'translateY(8px)' }} aria-hidden={i !== panel}>{child}</div>
      ))}
    </div>
  )
}

/** Detalle de la empresa nueva que trajo el Agente 1. */
export function CompanyDetail({ show, inline = false, stack = false, panel = 0 }: { show: boolean; inline?: boolean; stack?: boolean; panel?: number }) {
  return (
    <Modal show={show} inline={inline}>
      <Head Icon={Building2} title="Agrícola Río Claro" tag={<span className="text-[12px] font-normal text-white/70">Nueva</span>} />
      <Strip
        items={[
          { Icon: User, label: 'Responsable', value: 'Camila Torres Vega' },
          { Icon: MapPin, label: 'Ubicación', value: 'Rancagua, O’Higgins, Chile' },
          { Icon: Globe, label: 'Sitio web', value: <span className="text-[#7fa0ff]">agricolarioclaro.cl</span> },
          { Icon: Users, label: 'Contactos', value: '0' },
        ]}
        stack={stack}
      />
      <Tabs stack={stack} items={[{ label: 'Resumen', Icon: Building2 }, { label: 'Contactos', Icon: Users }, { label: 'Primer contacto', Icon: PhoneCall }, { label: 'Actividad', Icon: Activity }, { label: 'Agentes', Icon: Database }, { label: 'Árbol', Icon: Network }, { label: 'Comentarios', Icon: MessageCircle }]} />
      <Panels stack={stack} panel={panel}>{[
        <Panel key="datos" Icon={Building2} title="Datos de la empresa">
          <Row Icon={Briefcase} k="Industria" v="Agroindustria" />
          <Row Icon={Users} k="Tamaño" v="640" />
          <Row Icon={Hash} k="ID fiscal" v="76.4XX.XXX-K" />
          <Row Icon={Tag} k="Fuente" v="Agente 1 · Registro oficial" />
          <Row Icon={Globe} k="Libre en HubSpot" v="Sí, sin dueño" />
          <Row Icon={Calendar} k="Creada" v="19 de nov de 2026" />
        </Panel>,
        <Panel key="por-que" Icon={StickyNote} title="Por qué entró" className={stack ? 'h-full' : ''}>
          <p className="text-[12.5px] leading-relaxed text-white/70">Encaja con el ICP: agroindustria en Chile, más de 200 empleados. Verificada en el registro oficial y sin responsable en HubSpot. No es duplicada.</p>
        </Panel>,
      ]}</Panels>
      <div className={`mt-auto flex items-center justify-end gap-2 border-t border-white/10 py-3 text-[13px] ${stack ? 'mt-4 flex-wrap px-4' : 'px-5'}`}>
        <span className="grid h-8 w-8 place-items-center rounded-lg border border-white/15">···</span>
        <span className="flex items-center gap-2 rounded-lg border border-white/15 px-3 py-1.5"><RumboMark size={16} />Buscar contactos con Rumbo IA</span>
        <span className="flex items-center gap-2 rounded-lg px-3 py-1.5 font-medium" style={{ background: RUMBO_GRADIENT }}><RumboMark size={16} />Preparar primer contacto con Rumbo IA</span>
      </div>
    </Modal>
  )
}

export type PhoneState = 'idle' | 'apollo' | 'lusha' | 'done'

/** Detalle del contacto nuevo que trajo el Agente 2, con «Revelar teléfono». */
export function ContactDetail({ show, phone, pressed = false, prepHighlight = false, inline = false, phoneSlot, stack = false, panel = 0 }: { show: boolean; phone: PhoneState; pressed?: boolean; prepHighlight?: boolean; inline?: boolean; phoneSlot?: React.ReactNode; stack?: boolean; panel?: number }) {
  return (
    <Modal show={show} inline={inline}>
      <Head Icon={User} title="Valeria Ortiz Lagos" tag={<span className="rounded-md border border-emerald-500/40 bg-emerald-500/15 px-1.5 text-[12px] font-normal text-emerald-300">Activo</span>} sub="Directora de Talento · Clínica Andina" />
      <Strip
        items={[
          { Icon: Building2, label: 'Empresa', value: <span className="text-[#7fa0ff]">Clínica Andina</span> },
          { Icon: Briefcase, label: 'Cargo', value: 'Directora de Talento' },
          { Icon: Tag, label: 'Rol en la empresa', value: 'Decisora' },
          { Icon: User, label: 'Seniority', value: 'Dirección' },
        ]}
        stack={stack}
      />
      <Tabs stack={stack} items={[{ label: 'Resumen', Icon: User }, { label: 'Actividad', Icon: Activity }, { label: 'Origen y calidad', Icon: Database }, { label: 'HubSpot', Icon: Globe }, { label: 'Comentarios', Icon: MessageCircle }]} />
      <Panels stack={stack} panel={panel}>{[
        <Panel key="contacto" Icon={Mail} title="Datos de contacto" className="min-h-[220px]">
          <p className="text-[11.5px] text-white/55">Email</p>
          <p className="text-[13px] text-[#7fa0ff]">valeria.ortiz@clinicaandina.mx</p>
          {phoneSlot ? (
            <div className="mt-3">{phoneSlot}</div>
          ) : phone === 'done' ? (
            <div className="mt-3 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-[13px]">
              <span className="block text-[11.5px] text-emerald-300">Teléfono · Lusha</span>+52 55 4821 0937
            </div>
          ) : (
            <span className={`mt-3 inline-flex items-center gap-2 rounded-lg bg-[#6b8cff] px-3 py-1.5 text-[13px] font-medium text-[#0a0a0a] transition-transform ${pressed ? 'scale-95' : ''}`}>
              {phone === 'idle' ? <PhoneCall className="h-3.5 w-3.5" /> : <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {phone === 'idle' ? 'Revelar teléfono' : phone === 'apollo' ? 'Consultando Apollo…' : 'Apollo sin número · probando Lusha…'}
            </span>
          )}
          <p className="mt-2.5 text-[11.5px] leading-relaxed text-white/55">Consulta Apollo y, si no hay número, Lusha. Los créditos se reservan antes de llamar y lo que no se usa se devuelve.</p>
        </Panel>,
        <Panel key="otros" Icon={Briefcase} title="Otros datos" className={stack ? 'h-full' : ''}>
          <Row Icon={Briefcase} k="Área" v="Recursos Humanos" />
          <Row Icon={Tag} k="Fuente" v="Apollo" />
          <Row Icon={Calendar} k="Creado" v="19 de nov de 2026" />
          <Row Icon={StickyNote} k="Relevancia" v="Alta · 85%" />
        </Panel>,
      ]}</Panels>
      <div className={`mt-auto flex items-center border-t border-white/10 py-3 text-[13px] ${stack ? 'mt-4 flex-wrap gap-2 px-4' : 'px-5'}`}>
        <span className="flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5">Más acciones<ChevronDown className="h-3.5 w-3.5" /></span>
        <span className={`${stack ? '' : 'mx-auto '}flex items-center gap-2 rounded-lg border px-3 py-1.5 transition-all duration-500 ${prepHighlight ? 'border-[#6b8cff] bg-[#6b8cff]/15 shadow-[0_0_0_4px_rgba(107,140,255,0.2)]' : 'border-white/15'}`}><PhoneCall className="h-3.5 w-3.5" />Preparar primer contacto</span>
        <span className="flex items-center gap-1.5 rounded-lg bg-[#6b8cff] px-3 py-1.5 font-medium text-[#0a0a0a]"><Pencil className="h-3.5 w-3.5" />Editar contacto</span>
      </div>
    </Modal>
  )
}

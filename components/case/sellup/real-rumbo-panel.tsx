'use client'

import type { ReactNode } from 'react'
import { ArrowLeft, ChevronDown, Minus, Plus, Send, X } from 'lucide-react'
import { RumboMark } from './platform'

/**
 * El panel de Rumbo tal cual la app: cabecera con su marca, pestañas, paso a paso,
 * mensajes con la marca al lado, tarjeta de opciones y el campo de texto.
 * Coordenadas de la pantalla de 1240 px (se usa dentro de `RealFrame`).
 */

export function RumboPanel({ subtitle, tabs, steps, step = 0, children, footer, back = false }: {
  subtitle: string
  tabs?: boolean
  steps?: readonly string[]
  step?: number
  children: ReactNode
  footer?: ReactNode
  back?: boolean
}) {
  return (
    <div className="absolute bottom-3 right-3 top-3 z-20 flex w-[400px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#141414] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.95)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[radial-gradient(ellipse_at_20%_0%,rgba(126,43,224,0.22),transparent_70%)]" />
      <header className="relative flex items-center gap-3 px-4 pb-3 pt-4">
        {back && <ArrowLeft className="h-4 w-4 text-white/70" />}
        <RumboMark size={34} />
        <span className="min-w-0 flex-1">
          <span className="block text-[14.5px] font-semibold">Rumbo</span>
          <span className="block truncate text-[12px] text-white/50">{subtitle}</span>
        </span>
        <Plus className="h-4 w-4 text-white/70" />
        <Minus className="ml-2 h-4 w-4 text-white/70" />
        <X className="ml-2 h-4 w-4 text-white/70" />
      </header>
      {tabs && (
        <div className="relative flex gap-5 border-b border-white/10 px-4 text-[13.5px]">
          <span className="border-b-2 border-[#6b8cff] pb-2 font-medium">Conversación</span>
          <span className="pb-2 text-white/55">Búsquedas</span>
        </div>
      )}
      {steps && (
        <div className="relative flex items-start px-4 pt-3">
          {steps.map((s, i) => (
            <div key={s} className="flex flex-1 flex-col items-center">
              <div className="flex w-full items-center">
                <span className={`mx-auto grid h-6 w-6 shrink-0 place-items-center rounded-full border text-[11px] transition-all duration-500 ${i === step ? 'border-[#6b8cff] bg-[#6b8cff] text-white' : i < step ? 'border-[#6b8cff]/60 bg-[#6b8cff]/20 text-[#9db0ff]' : 'border-white/20 text-white/45'}`}>{i + 1}</span>
              </div>
              <span className={`mt-1 text-[11px] ${i <= step ? 'text-white' : 'text-white/45'}`}>{s}</span>
            </div>
          ))}
        </div>
      )}
      <div className="relative flex min-h-0 flex-1 flex-col gap-3 overflow-hidden px-4 pt-4">{children}</div>
      {footer && <div className="relative px-4 pb-4 pt-2">{footer}</div>}
    </div>
  )
}

/** Mensaje de Rumbo: su marca a la izquierda, texto atenuado. */
export function RumboSays({ children, show = true }: { children: ReactNode; show?: boolean }) {
  return (
    <div className={`flex gap-2.5 text-[13.5px] leading-snug text-white/75 transition-all duration-500 ${show ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}>
      <RumboMark size={22} className="mt-0.5" />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}

/** Respuesta del vendedor. */
export function UserSays({ children, show = true }: { children: ReactNode; show?: boolean }) {
  return (
    <p className={`ml-auto max-w-[80%] rounded-2xl rounded-br-md bg-[#6b8cff] px-3 py-1.5 text-[13px] font-medium text-[#0a0a0a] transition-all duration-500 ${show ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}>{children}</p>
  )
}

export interface PanelOption {
  title: string
  body: string
}

/** Tarjeta de opciones numeradas («¿Qué tipo de prospectos quieres encontrar?»). */
export function OptionsCard({ title, options, picked }: { title: string; options: readonly PanelOption[]; picked?: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#121212] p-3">
      <p className="mb-2 flex items-center justify-between text-[13.5px] font-medium">{title}<span className="grid h-6 w-6 place-items-center rounded-full border border-white/15"><ChevronDown className="h-3.5 w-3.5" /></span></p>
      <div className="space-y-1.5">
        {options.map((o, i) => (
          <div
            key={o.title}
            className={`flex items-start gap-3 rounded-xl px-3 py-2 transition-all duration-500 ${picked === i ? 'bg-[#6b8cff]/15 ring-1 ring-[#6b8cff]/70' : 'bg-white/[0.04]'}`}
          >
            <span className="min-w-0 flex-1">
              <span className="block text-[13.5px] font-medium">{o.title}</span>
              <span className="block text-[12px] leading-snug text-white/55">{o.body}</span>
            </span>
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/[0.06] text-[11px] text-white/60">{i + 1}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/** Campo de texto del panel, con el borde que brilla en los colores de la IA. */
export function Composer({ text, placeholder, typing }: { text: string; placeholder: string; typing: boolean }) {
  return (
    <>
      <div className="rounded-2xl p-px" style={{ background: 'linear-gradient(120deg,rgba(40,94,230,0.7),rgba(126,43,224,0.5),rgba(235,98,51,0.6))' }}>
        <div className="flex min-h-[64px] items-start gap-2 rounded-[15px] bg-[#151515] px-3 py-3 text-[13.5px]">
          <span className={`flex-1 ${text ? 'text-white' : 'text-white/40'}`}>
            {text || placeholder}
            {typing && <span className="ml-0.5 inline-block h-3.5 w-px animate-pulse bg-white align-middle" />}
          </span>
          <span className="grid h-8 w-8 place-items-center self-end rounded-full bg-gradient-to-br from-[#7e2be0] to-[#d22d6a]"><Send className="h-3.5 w-3.5" /></span>
        </div>
      </div>
      <p className="mt-2 text-center text-[11px] text-white/40">El agente puede cometer errores. Antes de ejecutar verás el impacto.</p>
    </>
  )
}

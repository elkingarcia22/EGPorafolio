'use client'

import { Check, ChevronDown } from 'lucide-react'
import { RealCard, RealTag } from './real-app'

/**
 * Ficha de empresa de SellUp (pantalla «Flujo de prospección › empresa»):
 * cabecera, paso a paso de 7 etapas y secciones numeradas.
 */

const STAGES = ['Prospección', 'Enriquecimiento', 'Primer contacto', 'Reunión', 'Cotización', 'Venta interna', 'Cierre']

export function RecordHeader({ stage, tags }: { stage: number; tags?: React.ReactNode }) {
  return (
    <RealCard>
      <div className="px-5 py-4">
        <p className="text-[19px] font-semibold">Clínica Andina</p>
        <p className="mt-1.5 text-[12.5px] text-white/55">🇲🇽 México <span className="mx-2" />Salud / Hospitales y clínicas <span className="mx-2" />Responsable: Ana Gómez</p>
        <p className="mt-2 flex gap-1.5"><RealTag tone="blue">{STAGES[stage]} · Nueva</RealTag>{tags}</p>
      </div>
    </RealCard>
  )
}

export function RecordStepper({ stage }: { stage: number }) {
  return (
    <RealCard>
      <div className="grid grid-cols-7 px-5 pb-3 pt-4">
        {STAGES.map((s, i) => {
          const state = i < stage ? 'done' : i === stage ? 'now' : 'next'
          return (
            <div key={s} className="relative flex flex-col items-center">
              {i < STAGES.length - 1 && (
                <span className="absolute left-[calc(50%+18px)] right-[calc(-50%+18px)] top-3 h-px bg-white/15">
                  <span className="block h-full bg-[#6b8cff]" style={{ width: i < stage ? '100%' : '0%' }} />
                </span>
              )}
              <span className={`grid h-6 w-6 place-items-center rounded-full border text-[11px] ${state === 'done' ? 'border-[#6b8cff]/60 bg-[#6b8cff]/20 text-[#9db0ff]' : state === 'now' ? 'border-[#6b8cff] bg-[#6b8cff] text-white shadow-[0_0_0_5px_rgba(107,140,255,0.25)]' : 'border-white/20 text-white/40'}`}>
                {state === 'done' ? <Check className="h-3 w-3" /> : i + 1}
              </span>
              <span className={`mt-2 max-w-[84px] text-center text-[12px] leading-tight ${state === 'next' ? 'text-white/40' : 'text-white'}`}>{s}</span>
            </div>
          )
        })}
      </div>
    </RealCard>
  )
}

interface SectionProps {
  n: number
  title: string
  agent: string
  state: React.ReactNode
  body: string
  dashed?: boolean
  right?: React.ReactNode
  children?: React.ReactNode
}

/** Sección numerada de la ficha («1. Prospección», «2. Enriquecimiento de contactos»…). */
export function RecordSection({ n, title, agent, state, body, dashed, right, children }: SectionProps) {
  return (
    <RealCard dashed={dashed}>
      <div className="px-5 py-3.5">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <p className="flex items-center gap-2 text-[15px] font-semibold">{n}. {title} <RealTag tone="indigo">{agent}</RealTag>{state}</p>
            <p className="mt-1.5 text-[12.5px] text-white/55">{body}</p>
          </div>
          {right ?? (
            <span className="flex items-center gap-2 text-[12px] text-white/45">19 de nov de 2026<ChevronDown className="h-4 w-4 opacity-60" /></span>
          )}
        </div>
        {children}
      </div>
    </RealCard>
  )
}

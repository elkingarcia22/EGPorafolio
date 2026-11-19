'use client'

import { useEffect, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { CASCADE_STEPS } from '@/components/case/objetivos/alignment-builder'

const COUNTER = ['1 persona', '1 persona → 1 grupo', '1 persona → 1 grupo → 2 objetivos', '3 de 3 objetivos de empresa con aporte', '3 de 3 objetivos de empresa con aporte']

/** Los mismos datos del mapa de alineación (staging, ciclo 2026): la persona, su grupo y los objetivos de empresa. */
const PERSON = { initials: 'PO', name: 'Paula Ortiz Cifuentes', area: 'Tecnología' }
const GROUP = { area: 'Tecnología', meta: 'Área · 11 personas' }
const GOALS = [
  { title: 'Crecer los ingresos un 15 %', meta: '48,6 % del peso', viaGroup: true },
  { title: 'Ser la marca preferida', meta: '26,2 % del peso', viaGroup: true },
  { title: 'Operar con más eficiencia', meta: '23,8 % del peso', viaGroup: false },
] as const

function Step({ label, on, children }: { label: string; on: boolean; children: React.ReactNode }) {
  return (
    <div className={`min-w-0 transition-all duration-500 md:flex-1 ${on ? 'opacity-100' : 'translate-y-1 opacity-20'}`}>
      <p className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-black/45">{label}</p>
      {children}
    </div>
  )
}

/** El conector entre niveles: vertical en móvil, horizontal en tableta; se llena al encenderse. */
function Connector({ on }: { on: boolean }) {
  return (
    <span className="relative mx-auto block h-5 w-px shrink-0 bg-black/10 md:mx-0 md:mt-9 md:h-px md:w-6" aria-hidden="true">
      <span className="absolute inset-0 origin-top bg-[#0c5bef] transition-transform duration-500 md:origin-left" style={{ transform: on ? 'scale(1)' : 'scale(0)' }} />
    </span>
  )
}

/**
 * Objetivos en pantallas pequeñas: en vez de alejar la cámara sobre todo el mapa (que se vuelve
 * ilegible), la cascada se apila y se enciende nivel a nivel: persona → grupo → objetivos de empresa.
 */
export function ObjetivosCompactPreview() {
  const { reducedMotion } = useA11y()
  const last = CASCADE_STEPS.length - 1
  const [phase, setPhase] = useState(reducedMotion ? last : 0)

  useEffect(() => {
    if (reducedMotion) return
    const id = window.setTimeout(() => setPhase((p) => (p + 1) % CASCADE_STEPS.length), CASCADE_STEPS[phase] * 1.4)
    return () => window.clearTimeout(id)
  }, [phase, reducedMotion])

  const all = phase >= 3

  return (
    <div className="relative overflow-hidden bg-[#0b0d16] p-[5%]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_70%_at_25%_40%,rgba(12,91,239,0.25),transparent_70%),radial-gradient(40%_50%_at_85%_90%,rgba(123,92,255,0.2),transparent_70%)]" aria-hidden="true" />
      <div className="relative overflow-hidden rounded-lg bg-white text-[#161a2c] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.85)] ring-1 ring-white/10">
        <div className="flex items-center justify-between gap-3 border-b border-black/[0.06] px-3 py-2">
          <span className="shrink-0 text-[13px] font-semibold">Mapa de alineación</span>
          <span key={phase} className="truncate text-[11px] font-medium text-[#0c5bef] animate-[ramp-in_0.4s_cubic-bezier(0.16,1,0.3,1)_both]">{COUNTER[phase]}</span>
        </div>

        <div className="flex flex-col bg-[#fafbfc] bg-[radial-gradient(rgba(22,26,44,0.12)_1px,transparent_1.2px)] bg-[length:16px_16px] p-3 md:flex-row md:items-start md:gap-0 md:p-4">
          <Step label="Persona" on>
            <div className="flex items-center gap-2.5 rounded-xl border border-[#0c5bef] bg-white px-3 py-2 shadow-[0_0_0_4px_rgba(12,91,239,0.15)]">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#0c5bef]/10 text-[11px] font-medium text-[#0c5bef]">{PERSON.initials}</span>
              <span className="min-w-0 leading-tight">
                <span className="block truncate text-[13px] font-medium">{PERSON.name}</span>
                <span className="block truncate text-[11px] text-black/50">{PERSON.area}</span>
              </span>
            </div>
          </Step>

          <Connector on={phase >= 1} />

          <Step label="Grupo" on={phase >= 1}>
            <div className="rounded-xl border border-black/10 bg-white px-3 py-2 shadow-sm">
              <span className="block text-[13px] font-medium leading-tight">{GROUP.area}</span>
              <span className="block text-[11px] leading-tight text-black/50">{GROUP.meta}</span>
            </div>
          </Step>

          <Connector on={phase >= 2} />

          <Step label="Empresa" on={phase >= 2}>
            <ul className="space-y-1.5">
              {GOALS.map((goal) => {
                const on = all || (phase >= 2 && goal.viaGroup)
                return (
                  <li
                    key={goal.title}
                    className={`rounded-xl px-3 py-1.5 transition-all duration-500 ${on ? 'bg-[#0c5bef] text-white' : 'bg-[#0c5bef]/10 text-[#0c5bef]/50'}`}
                  >
                    <span className="block truncate text-xs font-medium leading-tight">{goal.title}</span>
                    {all && <span className="block truncate text-[11px] leading-tight opacity-75 animate-[ramp-in_0.4s_cubic-bezier(0.16,1,0.3,1)_both]">{goal.meta}</span>}
                  </li>
                )
              })}
            </ul>
          </Step>
        </div>
      </div>
      <span className="relative mt-2 block font-mono text-[11px] uppercase tracking-[0.18em] text-white/50">
        {phase >= 3 ? 'Persona → grupo → empresa' : 'Alineando'}
      </span>
      <span className="sr-only">El mapa de alineación en cascada: una persona aporta a su grupo y el grupo a los objetivos de empresa, nivel por nivel.</span>
    </div>
  )
}

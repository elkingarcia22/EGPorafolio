'use client'

import { Check, ChevronDown, ChevronUp, Globe, Loader2, Phone, SlidersHorizontal, User, Users, GitBranch, Search, LayoutGrid, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLocale, type L } from '@/lib/i18n'
import { useA11y } from '@/lib/a11y'
import { useTick } from '../barberlytics/thema/live-pieces'
import { RumboOrb, RUMBO_GRADIENT } from './platform'
import { RealCard, RealFrame, RealTag } from './real-app'
import { useInView } from './ui'

/**
 * 5.1 · Flujo de prospección, tal cual la pantalla real: una empresa (de ejemplo)
 * se destaca y avanza sola por las tres etapas que mueven los agentes.
 */

const STEPS = ['Prospección', 'Enriquecimiento', 'Primer contacto', 'Reunión', 'Cotización', 'Venta interna', 'Cierre']

const OTHERS = [
  { name: 'Grupo Vital Salud', where: '🇲🇽 México · hace 2 días', stage: 'Enriquecimiento' },
  { name: 'Hospitales del Valle', where: '🇲🇽 México · hace 3 días', stage: 'Enriquecimiento' },
  { name: 'Cerámicas Altiplano', where: '🇨🇱 Chile · hace 4 días', stage: 'Enriquecimiento' },
  { name: 'Banca Solar', where: '🇵🇪 Perú · hace 5 días', stage: 'Primer contacto' },
  { name: 'Industrias Nogal', where: '🇨🇴 Colombia · hace 6 días', stage: 'Enriquecimiento' },
  { name: 'Hoteles Mar Azul', where: '🇩🇴 Rep. Dominicana · hace 6 días', stage: 'Enriquecimiento' },
  { name: 'Logística Pacífico', where: '🇨🇱 Chile · hace 8 días', stage: 'Enriquecimiento' },
]

const PHASES: readonly { label: L; dock: string }[] = [
  { label: { es: 'Buscando empresas', en: 'Finding companies' }, dock: 'Buscando empresas con Rumbo IA' },
  { label: { es: 'Buscando contactos', en: 'Finding contacts' }, dock: 'Buscando contactos con Rumbo IA' },
  { label: { es: 'Preparando el primer contacto', en: 'Preparing the first contact' }, dock: 'Preparando primer contacto con Rumbo IA' },
]

/** Línea de tiempo (en ticks de 1 s): 0–6 empresa, 7–13 contactos, 14–20 primer contacto, 21–23 lista. */
const LOOP = 24
const phaseAt = (t: number) => (t < 7 ? 0 : t < 14 ? 1 : 2)

const P1 = ['HubSpot: no tiene dueño → libre', 'Registro oficial: empresa verificada', '1.240 empleados · encaja con el ICP']
const FACTS = ['Abrió 3 clínicas en 2026 · noticias', 'Busca 120 enfermeras este trimestre · portal de empleo', 'Mariana R. lidera la nueva academia interna · LinkedIn']

function Kpi({ Icon, label, value }: { Icon: typeof Phone; label: string; value: number }) {
  return (
    <div className="flex-1 px-4 py-3">
      <p className="flex items-center gap-2 text-[12.5px] text-white/70"><Icon className="h-3.5 w-3.5" />{label}</p>
      <p className="mt-1 pl-[22px] text-[17px] font-medium tabular-nums">{value}</p>
    </div>
  )
}

function Detail({ t: time }: { t: number }) {
  const phase = phaseAt(time)
  const done = time >= 21
  const lines = Math.min(P1.length, Math.max(0, time - 1))
  const k = (from: number, max: number) => Math.max(0, Math.min(max, time - from))
  const facts = Math.min(FACTS.length, Math.max(0, time - 15))
  const chip = Math.min(phase + (done ? 1 : 0), 3)
  return (
    <div className="space-y-2.5">
      <RealCard>
        <div className="px-5 py-4">
          <p className="text-[19px] font-semibold">Clínica Andina</p>
          <p className="mt-1.5 text-[12.5px] text-white/55">🇲🇽 México <span className="mx-2" />Salud / Hospitales y clínicas <span className="mx-2" />Responsable: Ana Gómez</p>
          <p className="mt-2 flex gap-1.5">
            <RealTag tone="blue">{STEPS[Math.min(phase + (done ? 1 : 0), 3)]} · Nueva</RealTag>
            {phase === 0 && <RealTag>Sin contactos</RealTag>}
            {phase >= 1 && time >= 10 && <RealTag tone="green">3 decisores</RealTag>}
          </p>
        </div>
      </RealCard>

      <RealCard>
        <div className="relative px-5 pb-3 pt-4">
          <div className="grid grid-cols-7">
            {STEPS.map((s, i) => {
              const state = i < chip ? 'done' : i === chip ? 'now' : 'next'
              return (
                <div key={s} className="relative flex flex-col items-center">
                  {i < STEPS.length - 1 && (
                    <span className="absolute left-[calc(50%+18px)] right-[calc(-50%+18px)] top-3 h-px overflow-hidden bg-white/15">
                      <span className="block h-full bg-[#6b8cff] transition-[width] duration-1000" style={{ width: i < chip ? '100%' : '0%' }} />
                    </span>
                  )}
                  <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border text-[11px] transition-all duration-700 ${state === 'done' ? 'border-[#6b8cff]/60 bg-[#6b8cff]/20 text-[#9db0ff]' : state === 'now' ? 'border-[#6b8cff] bg-[#6b8cff] text-white shadow-[0_0_0_5px_rgba(107,140,255,0.25)]' : 'border-white/20 text-white/40'}`}>
                    {state === 'done' ? <Check className="h-3 w-3" /> : i + 1}
                  </span>
                  <span className={`mt-2 max-w-[84px] text-center text-[12px] leading-tight transition-colors duration-700 ${state === 'next' ? 'text-white/40' : 'text-white'}`}>{s}</span>
                </div>
              )
            })}
          </div>
        </div>
      </RealCard>

      <RealCard>
        <div className="px-5 py-3.5">
          <p className="flex items-center gap-2 text-[15px] font-semibold">1. Prospección <RealTag tone="indigo">Agente 1</RealTag>
            {time >= 5 ? <RealTag tone="green">Completada</RealTag> : <RealTag tone="blue">En curso</RealTag>}
            <span className="ml-auto text-[12px] font-normal text-white/45">19 de nov de 2026</span>{phase === 0 ? <ChevronUp className="h-4 w-4 opacity-40" /> : <ChevronDown className="h-4 w-4 opacity-40" />}
          </p>
          <p className="mt-1.5 text-[12.5px] text-white/55">La empresa entra como prospecto (IA, importación o a mano), con encaje ICP y sin duplicar HubSpot.</p>
          {phase === 0 && (
            <ul className="mt-2.5 space-y-1.5">
              {P1.map((l, i) => (
                <li key={l} className={`flex items-center gap-2 text-[12.5px] transition-all duration-500 ${i < lines ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'}`}><Check className="h-3.5 w-3.5 text-emerald-400" />{l}</li>
              ))}
            </ul>
          )}
        </div>
      </RealCard>

      <RealCard>
        <div className="px-5 py-3.5">
          <p className="flex items-center gap-2 text-[15px] font-semibold">2. Enriquecimiento de contactos <RealTag tone="indigo">Agente 2A</RealTag>
            {phase === 1 ? <RealTag tone="blue">Etapa actual</RealTag> : phase > 1 ? <RealTag tone="green">Completada</RealTag> : <RealTag>Pendiente</RealTag>}
          </p>
          <p className="mt-1.5 text-[12.5px] text-white/55">Se identifican decisores y medios de contacto autorizados.</p>
          {phase === 1 && (
            <>
              <div className="mt-3 flex divide-x divide-white/10 rounded-xl border border-white/10">
                <Kpi Icon={Users} label="Contactos" value={k(7, 4)} />
                <Kpi Icon={User} label="Decisores" value={k(8, 3)} />
                <Kpi Icon={Phone} label="Con teléfono" value={k(10, 2)} />
                <Kpi Icon={Globe} label="En HubSpot" value={k(9, 2)} />
              </div>
              <p className="mt-2.5 flex items-center text-[12.5px] text-white/60">
                <span className="font-medium text-white/85">Última búsqueda:</span>&nbsp;HubSpot → Apollo → Lusha · 3 créditos
                <span className="ml-auto inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 text-[12.5px] text-white">
                  {time < 12 ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RumboOrb size={14} />} Buscar más contactos con IA
                </span>
              </p>
            </>
          )}
        </div>
      </RealCard>

      <RealCard dashed={phase < 2}>
        <div className="px-5 py-3.5">
          <p className="flex items-center gap-2 text-[15px] font-semibold">3. Primer contacto <RealTag tone="indigo">Agente 3</RealTag>
            {done ? <RealTag tone="green">Listo para revisar</RealTag> : phase === 2 ? <RealTag tone="blue">Etapa actual</RealTag> : <RealTag>Pendiente</RealTag>}
          </p>
          <p className="mt-1.5 text-[12.5px] text-white/55">El agente investiga la empresa y a sus decisores (cada dato con su fuente) y prepara qué decirle a cada uno en cada canal.</p>
          {phase === 2 && (
            <ul className="mt-2.5 space-y-1.5">
              {FACTS.map((f, i) => (
                <li key={f} className={`flex items-center gap-2 text-[12.5px] transition-all duration-500 ${i < facts ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'}`}><Sparkles className="h-3.5 w-3.5 text-[#a78bfa]" />{f}</li>
              ))}
              <li className={`rounded-lg border border-[#6b8cff]/30 bg-[#6b8cff]/10 p-2.5 text-[12.5px] leading-snug transition-all duration-500 ${time >= 19 ? 'opacity-100' : 'opacity-0'}`}>
                Llamada · Mariana R.: «Vi que están abriendo clínicas y contratando 120 enfermeras. ¿Cómo piensan formarlas en el primer mes?»
              </li>
            </ul>
          )}
        </div>
      </RealCard>
    </div>
  )
}

/** La pantalla completa del flujo, con la empresa destacada avanzando. */
function FlowScreen({ time }: { time: number }) {
  const phase = phaseAt(time)
  const done = time >= 21
  const stage = STEPS[Math.min(phase + (done ? 1 : 0), 3)]
  const arrived = time >= 1
  return (
    <div className="px-6 pt-5">
      <div className="flex items-baseline gap-3">
        <h4 className="text-[24px] font-semibold tracking-tight">Flujo de prospección</h4>
        <span className="text-[12.5px] text-white/55">En qué etapa del proceso de venta está cada empresa, qué pasó en cada una y qué falta.</span>
        <span className="ml-auto flex rounded-xl border border-white/10 p-0.5 text-[12.5px]">
          <span className="rounded-lg bg-[#6b8cff] px-3 py-1 font-medium">Recorrido</span>
          <span className="px-3 py-1 text-white/60">Tablero</span>
        </span>
      </div>
      <div className="mt-5 grid grid-cols-[280px_minmax(0,1fr)] gap-5">
        <div>
          <div className="flex items-center gap-3 rounded-xl border border-white/10 border-l-[#6b8cff] bg-[#6b8cff]/[0.06] px-3 py-2.5" style={{ borderLeftWidth: 3 }}>
            <LayoutGrid className="h-4 w-4 opacity-60" />
            <span><span className="block text-[13.5px] font-medium">Resumen del pipeline</span><span className="block text-[12px] text-white/55">{arrived ? 104 : 103} empresas · 56 requieren atención</span></span>
          </div>
          <div className="mt-3 flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 text-[13px] text-white/45"><Search className="h-4 w-4" />Buscar por nombre o dominio</div>
          <div className="mt-3 flex items-center text-[12.5px]">
            <span className="flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1"><SlidersHorizontal className="h-3.5 w-3.5" />Filtros<ChevronDown className="h-3 w-3 opacity-60" /></span>
            <span className="ml-auto text-white/45">{arrived ? 104 : 103} empresas</span>
          </div>
          <ul className="relative mt-3 space-y-2">
            <li
              className="relative overflow-hidden rounded-xl border px-3.5 py-2.5 transition-all duration-700 ease-expo"
              style={{
                borderColor: 'rgba(107,140,255,0.8)',
                background: 'linear-gradient(90deg,rgba(107,140,255,0.16),rgba(139,92,246,0.06))',
                boxShadow: '0 0 0 4px rgba(107,140,255,0.18), 0 20px 40px -20px rgba(107,140,255,0.6)',
                opacity: arrived ? 1 : 0,
                transform: arrived ? 'none' : 'translateY(-14px) scale(0.97)',
                maxHeight: arrived ? 80 : 0,
              }}
            >
              <span className="absolute inset-y-0 left-0 w-[3px] bg-[#6b8cff]" />
              <p className="flex items-center text-[14px] font-medium">Clínica Andina
                <span className="ml-auto flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#6b8cff]" /><span key={stage} className="rounded-md border border-[#3b82f6]/50 bg-[#3b82f6]/15 px-1.5 text-[12px] text-[#7fb0ff]">{stage}</span></span>
              </p>
              <p className="mt-0.5 text-[12px] text-white/55">🇲🇽 México · ahora</p>
            </li>
            {OTHERS.map((o) => (
              <li key={o.name} className="rounded-xl border border-white/10 bg-white/[0.025] px-3.5 py-2.5">
                <p className="flex items-center text-[14px]">{o.name}<span className="ml-auto flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-400" /><span className="rounded-md border border-[#3b82f6]/50 bg-[#3b82f6]/15 px-1.5 text-[12px] text-[#7fb0ff]">{o.stage}</span></span></p>
                <p className="mt-0.5 text-[12px] text-white/55">{o.where}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className={`transition-opacity duration-700 ${arrived ? 'opacity-100' : 'opacity-0'}`}><Detail t={time} /></div>
      </div>
    </div>
  )
}

/** Dock flotante real: «Cambiar etapa» y el botón de Rumbo con la acción en curso. */
function Dock({ time }: { time: number }) {
  const phase = phaseAt(time)
  const done = time >= 21
  return (
    <div className="absolute bottom-5 left-[738px] flex -translate-x-1/2 items-center gap-2 rounded-2xl border border-white/10 bg-[#141414]/95 p-1.5 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.9)] backdrop-blur">
      <span className="grid h-9 w-9 place-items-center"><RumboOrb size={18} /></span>
      <span className="flex items-center gap-2 whitespace-nowrap rounded-xl bg-[#6b8cff] px-4 py-2 text-[13.5px] font-medium text-[#0a0a0a]"><GitBranch className="h-4 w-4" />Cambiar etapa</span>
      <span className="flex min-w-[330px] items-center whitespace-nowrap justify-center gap-2 rounded-xl px-4 py-2 text-[13.5px] font-medium" style={{ background: RUMBO_GRADIENT }}>
        {done ? <Check className="h-4 w-4" /> : <Loader2 className="h-4 w-4 animate-spin" />}
        {done ? 'Listo · revisa y contacta' : PHASES[phase].dock}
      </span>
    </div>
  )
}

export function PipelineFlow() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const [ref, seen] = useInView<HTMLDivElement>(0.25)
  const tick = useTick(1000)
  const [start, setStart] = useState<number | null>(null)
  useEffect(() => {
    if (seen && start === null) setStart(tick)
  }, [seen, start, tick])
  const time = reducedMotion ? 22 : start === null ? 0 : (tick - start) % LOOP
  const phase = phaseAt(time)
  const done = time >= 21
  return (
    <div ref={ref}>
      <ol className="mb-5 grid gap-2 sm:grid-cols-3" aria-live="polite">
        {PHASES.map((p, i) => {
          const on = i === phase && !done
          const past = i < phase || done
          return (
            <li key={p.dock} className={`flex items-center gap-3 rounded-[14px] px-4 py-3 ring-1 transition-all duration-500 ${on ? 'bg-[#6b8cff]/[0.14] ring-[#6b8cff]/60' : 'bg-white/[0.02] ring-white/10'}`}>
              <RumboOrb size={22} pulse={on && !reducedMotion} />
              <span>
                <span className="mono-label block text-white/45">{t({ es: `Agente ${i + 1}`, en: `Agent ${i + 1}` })}</span>
                <span className={`text-sm ${on || past ? 'text-white' : 'text-white/45'}`}>{t(p.label)}{on ? '…' : past ? ' ✓' : ''}</span>
              </span>
            </li>
          )
        })}
      </ol>
      <RealFrame active="flujo" crumb={['Flujo de prospección', 'Clínica Andina']} height={780} overlay={<Dock time={time} />}>
        <FlowScreen time={time} />
      </RealFrame>
      <p className="mt-3 font-mono text-[11px] uppercase tracking-wider text-white/40">{t({ es: 'Réplica de la pantalla real · empresa y personas de ejemplo', en: 'Replica of the real screen · sample company and people' })}</p>
    </div>
  )
}

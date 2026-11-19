'use client'

import { AlertTriangle, Briefcase, Calendar, ChevronDown, FileText, Loader2, MessageCircle, SlidersHorizontal, Target, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLocale, type L } from '@/lib/i18n'
import { useA11y } from '@/lib/a11y'
import { useTick } from '../barberlytics/thema/live-pieces'
import { RealFrame, RealTag } from './real-app'
import { Monitor } from './device-frames'
import { useInView } from './ui'

/**
 * 5.1 · Flujo de prospección, tal cual la pantalla real: una empresa (de ejemplo)
 * se destaca y avanza sola por las tres etapas que mueven los agentes.
 */

const COLS = [
  { name: 'Prospección', sub: 'Rumbo encuentra empresas.', Icon: Target, w: 176, tone: '' },
  { name: 'Enriquecimiento', sub: 'Rumbo busca sus contactos.', Icon: Users, w: 214, tone: 'bg-[#6b8cff]/20 text-[#9db0ff]' },
  { name: 'Primer contacto', sub: 'Rumbo investiga y prepara el primer contacto.', Icon: MessageCircle, w: 214, tone: 'bg-amber-500/20 text-amber-300' },
  { name: 'Reunión', sub: 'Próximamente', Icon: Calendar, w: 128, tone: '' },
  { name: 'Cotización', sub: 'Próximamente', Icon: FileText, w: 128, tone: '' },
  { name: 'Venta interna', sub: 'Próximamente', Icon: Briefcase, w: 128, tone: '' },
]
const GAP = 12
const COL_X = COLS.map((_, i) => COLS.slice(0, i).reduce((x, c) => x + c.w + GAP, 0))
const CARD_H = 94

const ENRICH = [
  { name: 'Grupo Vital Salud', where: '🇲🇽 México · hace 2 días' },
  { name: 'Hospitales del Valle', where: '🇲🇽 México · hace 3 días' },
  { name: 'Cerámicas Altiplano', where: '🇨🇱 Chile · hace 4 días' },
  { name: 'Industrias Nogal', where: '🇨🇴 Colombia · hace 6 días' },
  { name: 'Hoteles Mar Azul', where: '🇩🇴 Rep. Dominicana · hace 6 días' },
]
const FIRST = [
  { name: 'Banca Solar', where: '🇵🇪 Perú · hace 5 días' },
  { name: 'Logística Pacífico', where: '🇨🇱 Chile · hoy' },
  { name: 'Textiles del Sur', where: '🇦🇷 Argentina · hace 3 días' },
]

const PHASES: readonly { label: L; dock: string }[] = [
  { label: { es: 'Buscando empresas', en: 'Finding companies' }, dock: 'Buscando empresas con Rumbo IA' },
  { label: { es: 'Buscando contactos', en: 'Finding contacts' }, dock: 'Buscando contactos con Rumbo IA' },
  { label: { es: 'Preparando el primer contacto', en: 'Preparing the first contact' }, dock: 'Preparando primer contacto con Rumbo IA' },
]

/** Línea de tiempo (ticks de 1 s): 0–6 encontrada, 7–13 contactos, 14–20 primer contacto, 21–23 lista. */
const LOOP = 24
const phaseAt = (t: number) => (t < 7 ? 0 : t < 14 ? 1 : 2)

function Card({ name, where, children }: { name: string; where: string; children: React.ReactNode }) {
  return (
    <div className="relative rounded-xl border border-white/10 bg-[#171717] px-3 py-2.5" style={{ height: CARD_H - 8 }}>
      <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-amber-400" />
      <p className="truncate pl-4 pr-4 text-[13.5px] font-medium">{name}</p>
      <p className="mt-1 text-[12px] text-white/55">{where}</p>
      <div className="mt-2">{children}</div>
    </div>
  )
}

/** El tablero real, con «Clínica Andina» saltando de columna en columna. */
function FlowScreen({ time }: { time: number }) {
  const phase = phaseAt(time)
  const done = time >= 21
  const shown = time >= 1
  const at = phase
  const enrichCount = 97 + (at === 1 ? 1 : 0)
  const firstCount = 6 + (at === 2 ? 1 : 0)
  const tag = (() => {
    if (phase === 0) return time < 4 ? <RealTag tone="indigo"><Loader2 className="mr-1 h-3 w-3 animate-spin" />Verificando…</RealTag> : <RealTag tone="blue">Nueva · libre en HubSpot</RealTag>
    if (phase === 1) return time < 11 ? <RealTag tone="indigo"><Loader2 className="mr-1 h-3 w-3 animate-spin" />Buscando contactos…</RealTag> : <RealTag tone="blue">3 decisores · 2 con teléfono</RealTag>
    if (!done && time < 19) return <RealTag tone="indigo"><Loader2 className="mr-1 h-3 w-3 animate-spin" />Investigando · 6 hechos</RealTag>
    return <RealTag tone="green">Lista para contacto</RealTag>
  })()
  return (
    <div className="px-6 pt-5">
      <div className="flex items-baseline gap-3">
        <h4 className="text-[24px] font-semibold tracking-tight">Flujo de prospección</h4>
        <span className="text-[12.5px] text-white/55">En qué etapa del proceso de venta está cada empresa, qué pasó en cada una y qué falta.</span>
        <span className="ml-auto flex rounded-xl border border-white/10 p-0.5 text-[12.5px]">
          <span className="px-3 py-1 text-white/60">Recorrido</span>
          <span className="rounded-lg bg-[#6b8cff] px-3 py-1 font-medium">Tablero</span>
        </span>
      </div>
      <div className="mt-4 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2" style={{ borderLeft: '3px solid #f59e0b' }}>
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-amber-500/15"><AlertTriangle className="h-4 w-4 text-amber-400" /></span>
        <span><span className="block text-[13px] font-medium">56 empresas requieren atención</span><span className="block text-[12px] text-white/50">Pulsa un motivo para ver solo esas empresas en el tablero.</span></span>
        <span className="ml-auto flex gap-2 text-[12px] font-medium">
          <span className="rounded-lg border border-white/10 px-2.5 py-1">Sin movimiento 16</span>
          <span className="rounded-lg border border-white/10 px-2.5 py-1">Sin contactos 40</span>
          <span className="rounded-lg border border-white/10 px-2.5 py-1">Última corrida falló 10</span>
        </span>
      </div>
      <div className="mt-3 flex items-center text-[12.5px]">
        <span className="flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1"><SlidersHorizontal className="h-3.5 w-3.5" />Filtros<ChevronDown className="h-3 w-3 opacity-60" /></span>
        <span className="ml-auto text-white/45">{shown ? 104 : 103} empresas</span>
      </div>

      <div className="relative mt-3 flex gap-3">
        {COLS.map((c, i) => {
          const live = i < 3
          const hosting = shown && at === i
          const list = i === 1 ? ENRICH : i === 2 ? FIRST : []
          const count = i === 1 ? enrichCount : i === 2 ? firstCount : hosting ? 1 : 0
          return (
            <div key={c.name} className={`shrink-0 rounded-2xl border p-1.5 transition-colors duration-700 ${live && (i > 0 || hosting) ? 'border-white/10 bg-white/[0.02]' : 'border-dashed border-white/10'} ${hosting ? 'border-[#6b8cff]/50' : ''}`} style={{ width: c.w }}>
              <div className="flex items-start gap-2 px-1.5 pb-2 pt-1" style={{ height: 50 }}>
                <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-md ${c.tone || 'bg-white/[0.06] text-white/60'}`}><c.Icon className="h-3.5 w-3.5" /></span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center text-[13.5px] font-medium">{c.name}{live && i > 0 && <span className="ml-auto text-[12px] tabular-nums text-white/60">{count}</span>}</span>
                  <span className="block truncate text-[11.5px] text-white/45">{i === 0 && !hosting ? 'Ya superada' : c.sub}</span>
                </span>
              </div>
              {live && (
                <div className="space-y-2">
                  <div className="transition-[height] duration-700 ease-expo" style={{ height: hosting ? CARD_H - 8 : 0 }} />
                  {list.map((o, k) => (
                    <Card key={o.name} name={o.name} where={o.where}>
                      {i === 2 && k > 0 ? <RealTag tone="green">Lista para contacto</RealTag> : <RealTag tone="blue">Nueva</RealTag>}
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )
        })}

        {/* La empresa destacada: se mueve por encima del tablero */}
        <div
          className="absolute top-[56px] transition-[transform,opacity,width] duration-[1100ms] ease-expo"
          style={{ width: COLS[at].w - 12, transform: `translate(${COL_X[at] + 6}px, ${shown ? 0 : -18}px)`, opacity: shown ? 1 : 0 }}
        >
          <div className="relative rounded-xl border px-3 py-2.5" style={{ height: CARD_H - 8, borderColor: '#6b8cff', background: 'linear-gradient(135deg,#1d2440,#1a1530)', boxShadow: '0 0 0 4px rgba(107,140,255,0.22), 0 24px 50px -16px rgba(107,140,255,0.7)' }}>
            <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-[#6b8cff]" />
            <p className="truncate pl-4 pr-4 text-[13.5px] font-semibold">Clínica Andina</p>
            <p className="mt-1 text-[12px] text-white/60">🇲🇽 México · ahora</p>
            <div className="mt-2">{tag}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

const FLOAT_TEXT: readonly { stage: string; note: L }[] = [
  { stage: 'Prospección', note: { es: 'Encontrada por el Agente 1 · libre en HubSpot', en: 'Found by Agent 1 · free in HubSpot' } },
  { stage: 'Enriquecimiento', note: { es: '3 decisores · 2 con teléfono', en: '3 decision-makers · 2 with phone' } },
  { stage: 'Primer contacto', note: { es: '6 hechos citados · guion listo', en: '6 cited facts · script ready' } },
]

/** Tarjetas que salen del monitor y destacan la empresa que avanza (solo en pantallas anchas). */
function FloatCards({ time }: { time: number }) {
  const { t } = useLocale()
  const phase = phaseAt(time)
  const f = FLOAT_TEXT[phase]
  const shown = time >= 1
  return (
    <>
      <div
        className={`pointer-events-none absolute -right-4 top-[14%] hidden w-[240px] rounded-2xl border border-[#6b8cff]/60 bg-[#141826]/95 p-4 shadow-[0_0_0_4px_rgba(107,140,255,0.15),0_30px_60px_-20px_rgba(0,0,0,0.9)] backdrop-blur transition-all duration-700 ease-expo xl:block ${shown ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0'}`}
        aria-hidden="true"
      >
        <p className="mono-label text-white/45">{t({ es: 'Empresa destacada', en: 'Highlighted company' })}</p>
        <p className="mt-1 text-lg font-medium">Clínica Andina</p>
        <p className="text-xs text-white/55">🇲🇽 México · Salud · 1.240 emp.</p>
        <p key={f.stage} className="mt-3 inline-flex rounded-md border border-[#3b82f6]/50 bg-[#3b82f6]/15 px-2 py-0.5 text-xs text-[#7fb0ff]">{f.stage}</p>
        <p className="mt-2 text-sm leading-snug text-white/80">{t(f.note)}</p>
      </div>
      <div
        className={`pointer-events-none absolute -left-4 bottom-[22%] hidden w-[210px] rounded-2xl border border-white/10 bg-[#141517]/95 p-4 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.9)] backdrop-blur transition-all duration-700 ease-expo xl:block ${shown ? 'translate-x-0 opacity-100' : '-translate-x-6 opacity-0'}`}
        aria-hidden="true"
      >
        <p className="mono-label text-white/45">{t({ es: 'Etapas con agente', en: 'Stages with an agent' })}</p>
        <ul className="mt-2 space-y-1.5 text-sm">
          {FLOAT_TEXT.map((x, i) => (
            <li key={x.stage} className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${i < phase || time >= 21 ? 'bg-emerald-400' : i === phase ? 'bg-[#6b8cff]' : 'bg-white/20'}`} />
              <span className={i <= phase ? 'text-white' : 'text-white/40'}>{x.stage}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
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
              <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full font-mono text-xs ring-1 ${on ? 'bg-[#6b8cff] text-white ring-[#6b8cff]' : past ? 'bg-white/10 text-white ring-white/20' : 'text-white/45 ring-white/15'}`}>{i + 1}</span>
              <span>
                <span className="mono-label block text-white/45">{t({ es: `Agente ${i + 1}`, en: `Agent ${i + 1}` })}</span>
                <span className={`text-sm ${on || past ? 'text-white' : 'text-white/45'}`}>{t(p.label)}{on ? '…' : past ? ' ✓' : ''}</span>
              </span>
            </li>
          )
        })}
      </ol>
      <div className="relative">
        <Monitor>
          <RealFrame active="flujo" crumb={['Flujo de prospección']} height={720}>
            <FlowScreen time={time} />
          </RealFrame>
        </Monitor>
        <FloatCards time={time} />
      </div>
      <p className="mt-3 font-mono text-[11px] uppercase tracking-wider text-white/40">{t({ es: 'Réplica de la pantalla real · empresa y personas de ejemplo', en: 'Replica of the real screen · sample company and people' })}</p>
    </div>
  )
}

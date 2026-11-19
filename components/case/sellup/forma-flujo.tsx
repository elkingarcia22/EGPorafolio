'use client'

import { Briefcase, Calendar, ChevronDown, FileText, Loader2, MessageCircle, SlidersHorizontal, Target, Users } from 'lucide-react'
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
  { name: 'Prospección', sub: 'Rumbo encuentra empresas', Icon: Target, w: 214, tone: 'bg-white/[0.06] text-white/70' },
  { name: 'Enriquecimiento', sub: 'Rumbo busca sus contactos', Icon: Users, w: 244, tone: 'bg-[#6b8cff]/20 text-[#9db0ff]' },
  { name: 'Primer contacto', sub: 'Rumbo prepara qué decir', Icon: MessageCircle, w: 244, tone: 'bg-amber-500/20 text-amber-300' },
]
/** Las etapas que aún no tienen agente, en una sola columna compacta. */
const NEXT = [
  { name: 'Reunión', Icon: Calendar },
  { name: 'Cotización', Icon: FileText },
  { name: 'Venta interna', Icon: Briefcase },
]
const GAP = 16
const COL_X = COLS.map((_, i) => COLS.slice(0, i).reduce((x, c) => x + c.w + GAP, 0))
const CARD_H = 104
/** Ancho de la barra lateral más el margen del tablero (px de diseño de la app). */
const BOARD_X = 236 + 32
/** Encuadre en pantallas chicas: la columna donde está la empresa destacada. */
const viewAt = (phase: number) => (phase === 0 ? { cx: 0, x: BOARD_X - 16, cy: 330, w: 420, h: 470 } : { cx: BOARD_X + COL_X[phase] + COLS[phase].w / 2, cy: 330, w: 420, h: 470 })

const ENRICH = [
  { name: 'Grupo Vital Salud', where: '🇲🇽 México · hace 2 días' },
  { name: 'Hospitales del Valle', where: '🇲🇽 México · hace 3 días' },
  { name: 'Cerámicas Altiplano', where: '🇨🇱 Chile · hace 4 días' },
]
const FIRST = [
  { name: 'Banca Solar', where: '🇵🇪 Perú · hace 5 días' },
  { name: 'Logística Pacífico', where: '🇨🇱 Chile · hoy' },
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
    <div className="relative rounded-xl border border-white/[0.08] bg-[#161616] px-3.5 py-3" style={{ height: CARD_H - 10 }}>
      <p className="truncate pr-4 text-[13.5px] font-medium">{name}</p>
      <p className="mt-0.5 truncate text-[12px] text-white/50">{where}</p>
      <div className="mt-2.5">{children}</div>
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
    <div className="px-8 pt-7">
      <div className="flex items-center gap-3">
        <h4 className="text-[24px] font-semibold tracking-tight">Flujo de prospección</h4>
        <span className="truncate text-[12.5px] text-white/50">En qué etapa está cada empresa y qué falta.</span>
        <span className="ml-auto flex rounded-xl border border-white/10 p-0.5 text-[12.5px]">
          <span className="px-3 py-1 text-white/60">Recorrido</span>
          <span className="rounded-lg bg-[#6b8cff] px-3 py-1 font-medium">Tablero</span>
        </span>
      </div>
      <div className="mt-5 flex items-center text-[12.5px]">
        <span className="flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1"><SlidersHorizontal className="h-3.5 w-3.5" />Filtros<ChevronDown className="h-3 w-3 opacity-60" /></span>
        <span className="ml-auto text-white/45">{shown ? 104 : 103} empresas</span>
      </div>

      <div className="relative mt-4 flex" style={{ gap: GAP }}>
        {COLS.map((c, i) => {
          const live = true
          const hosting = shown && at === i
          const list = i === 1 ? ENRICH : i === 2 ? FIRST : []
          const count = i === 1 ? enrichCount : i === 2 ? firstCount : hosting ? 1 : 0
          return (
            <div key={c.name} className={`shrink-0 rounded-2xl border p-2 transition-colors duration-[400ms] ${i > 0 || hosting ? 'border-white/10 bg-white/[0.02]' : 'border-dashed border-white/10'} ${hosting ? '!border-[#6b8cff]/50' : ''}`} style={{ width: c.w }}>
              <div className="flex items-start gap-2 px-1.5 pb-2 pt-1" style={{ height: 50 }}>
                <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-md ${c.tone}`}><c.Icon className="h-3.5 w-3.5" /></span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center text-[13.5px] font-medium">{c.name}{live && i > 0 && <span className="ml-auto text-[12px] tabular-nums text-white/60">{count}</span>}</span>
                  <span className="block truncate text-[11.5px] text-white/45">{i === 0 && !hosting ? 'Ya superada' : c.sub}</span>
                </span>
              </div>
              {live && (
                <div className="space-y-2">
                  <div className="transition-[height] duration-[400ms] ease-expo" style={{ height: hosting ? CARD_H - 8 : 0 }} />
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
        <div className="min-w-0 flex-1 rounded-2xl border border-dashed border-white/10 p-3">
          <p className="text-[12px] text-white/45">Próximamente</p>
          <ul className="mt-2.5 space-y-2">
            {NEXT.map((n) => (
              <li key={n.name} className="flex items-center gap-2 text-[13px] text-white/55"><span className="grid h-6 w-6 place-items-center rounded-md bg-white/[0.05]"><n.Icon className="h-3.5 w-3.5" /></span>{n.name}</li>
            ))}
          </ul>
        </div>

        {/* La empresa destacada: se mueve por encima del tablero */}
        <div
          className="absolute top-[58px] transition-[transform,opacity,width] duration-500 ease-expo"
          style={{ width: COLS[at].w - 16, transform: `translate(${COL_X[at] + 8}px, ${shown ? 0 : -18}px)`, opacity: shown ? 1 : 0 }}
        >
          <div className="relative rounded-xl border px-3.5 py-3" style={{ height: CARD_H - 10, borderColor: '#6b8cff', background: 'linear-gradient(135deg,#1d2440,#1a1530)', boxShadow: '0 0 0 3px rgba(107,140,255,0.2), 0 20px 40px -16px rgba(107,140,255,0.6)' }}>
            <p className="truncate pr-4 text-[13.5px] font-semibold">Clínica Andina</p>
            <p className="mt-0.5 text-[12px] text-white/60">🇲🇽 México · ahora</p>
            <div className="mt-2.5">{tag}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function PipelineFlow() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const [ref, seen] = useInView<HTMLDivElement>(0.25)
  const tick = useTick(560)
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
          <RealFrame active="flujo" crumb={['Flujo de prospección']} height={640} view={viewAt(phase)}>
            <FlowScreen time={time} />
          </RealFrame>
        </Monitor>
      </div>
      <p className="mt-3 font-mono text-[11px] uppercase tracking-wider text-white/40">{t({ es: 'Réplica de la pantalla real · empresa y personas de ejemplo', en: 'Replica of the real screen · sample company and people' })}</p>
    </div>
  )
}

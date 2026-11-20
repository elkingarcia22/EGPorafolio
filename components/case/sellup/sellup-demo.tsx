'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useLocale, type L } from '@/lib/i18n'
import { CaseDemo } from '@/components/case/kit/case-demo'
import { RecordModal } from '@/components/case/kit/record-modal'
import { useTick } from '../barberlytics/thema/live-pieces'
import { SellUpMark } from './ui'
import { useCompact } from './camera'
import { RealFrame, type RealNav } from './real-app'
import { DetailScene, Scaled } from './forma-stage'
import { FLOW_LOOP, FlowBoard, FlowScreen } from './forma-flujo'
import { MAP_H, MAP_W, SearchMap } from './forma-a1-map'
import { SearchRadarMobile } from './forma-a1-radar-mobile'
import { CompanyReview, ContactReview } from './real-review-tables'
import { CompanyDetail, ContactDetail } from './real-detail'
import { PeopleRadar, RADAR_H, RADAR_W } from './forma-a2-radar'
import { PeopleRadarMobile } from './forma-a2-radar-mobile'
import { PhoneDecoder, type A2Phone } from './forma-a2-phone'
import { MAGNET_H, MAGNET_W, MagnetScene } from './forma-a3-magnet'
import { MagnetMobile } from './forma-a3-magnet-mobile'
import { FAN_H, FAN_W, FanScene, fanView } from './forma-a3-fan'
import { CatalogScreen } from './forma-catalogo'
import { UsageMetrics } from './forma-metrics'
import { RumboSearch } from './ai-rumbo-search'

/**
 * 08 · Demo. No hay capturas de SellUp en el repositorio y la app real necesita
 * credenciales, así que la demo es una galería a pantalla completa de las réplicas de
 * cada módulo y agente, todas animadas como si estuvieran trabajando. Se recorre con
 * las pestañas, con las flechas del modal o con ← →. Datos de ejemplo.
 */

/** Ticks de 0,56 s, como el resto de las piezas del caso. */
const TICK_MS = 560
const BLUE = '91 126 255'

/** Reloj en bucle de `loop` ticks: en el modal todo está a la vista, no hace falta esperar a verlo. */
function useLoop(loop: number): number {
  return useTick(TICK_MS) % loop
}

/** Encuadre de las tablas en teléfono: desde el borde del contenido. */
const TABLE_VIEW = { cx: 0, x: 252, cy: 300, w: 400, h: 560 }

function Flow() {
  const time = useLoop(FLOW_LOOP)
  const compact = useCompact()
  if (compact) return <FlowBoard time={time} />
  return <RealFrame active="flujo" crumb={['Flujo de prospección']} height={640}><FlowScreen time={time} /></RealFrame>
}

function Agent1() {
  const time = useLoop(14)
  const compact = useCompact()
  if (compact) return <SearchRadarMobile t={time} />
  return <Scaled width={MAP_W} height={MAP_H}><SearchMap t={time} /></Scaled>
}

function Review({ kind }: { kind: 'empresas' | 'contactos' }) {
  const time = useLoop(10)
  const arrived = time >= 2
  const nav: RealNav = kind === 'empresas' ? 'revisar' : 'contactos'
  return (
    <RealFrame active={nav} crumb={[kind === 'empresas' ? 'Empresas' : 'Contactos', 'Por revisar']} height={600} view={TABLE_VIEW}>
      {kind === 'empresas' ? <CompanyReview arrived={arrived} focus={arrived} /> : <ContactReview arrived={arrived} focus={arrived} />}
    </RealFrame>
  )
}

function Company() {
  const time = useLoop(12)
  const compact = useCompact()
  if (compact) return <CompanyDetail show inline stack panel={time < 6 ? 0 : 1} />
  return <DetailScene><CompanyDetail show inline /></DetailScene>
}

function Agent2() {
  const time = useLoop(16)
  const compact = useCompact()
  if (compact) return <PeopleRadarMobile t={time} />
  return <Scaled width={RADAR_W} height={RADAR_H}><PeopleRadar t={time} /></Scaled>
}

const phoneAt = (time: number): A2Phone => (time < 3 ? 'idle' : time < 5 ? 'apollo' : time < 7 ? 'lusha' : 'done')

function Phone() {
  const time = useLoop(12)
  const compact = useCompact()
  const slot = <PhoneDecoder state={phoneAt(time)} pressed={time === 3} />
  if (compact) return <ContactDetail show inline stack phone="idle" phoneSlot={slot} />
  return <DetailScene><ContactDetail show inline phone="idle" phoneSlot={slot} /></DetailScene>
}

function Research() {
  const time = useLoop(20)
  const compact = useCompact()
  if (compact) return <MagnetMobile time={time + 4} />
  return <DetailScene width={MAGNET_W} height={MAGNET_H}><MagnetScene time={time + 4} /></DetailScene>
}

function Message() {
  const u = useLoop(24)
  const [channel, setChannel] = useState<Parameters<typeof fanView>[1]>('email')
  const compact = useCompact()
  return <DetailScene width={FAN_W} height={FAN_H} view={compact ? fanView(u, channel) : undefined}><FanScene u={u} onChannel={setChannel} /></DetailScene>
}

interface Module {
  id: string
  name: L
  hint: L
  render: () => ReactNode
}

const MODULES: readonly Module[] = [
  { id: 'flujo', name: { es: 'Flujo de prospección', en: 'Prospecting flow' }, hint: { es: 'Una empresa avanza sola por las etapas', en: 'A company moves through the stages' }, render: () => <Flow /> },
  { id: 'agente-1', name: { es: 'Agente 1 · Empresas', en: 'Agent 1 · Companies' }, hint: { es: 'El radar recorre los países, primero lo gratis', en: 'The radar sweeps the countries, free first' }, render: () => <Agent1 /> },
  { id: 'empresas', name: { es: 'Empresas por revisar', en: 'Companies to review' }, hint: { es: 'La candidata nueva llega arriba', en: 'The new candidate lands on top' }, render: () => <Review kind="empresas" /> },
  { id: 'empresa', name: { es: 'Detalle de empresa', en: 'Company detail' }, hint: { es: 'Sus datos y por qué entró', en: 'Its data and why it got in' }, render: () => <Company /> },
  { id: 'agente-2', name: { es: 'Agente 2 · Contactos', en: 'Agent 2 · Contacts' }, hint: { es: 'El radar barre las fuentes hasta dar con quien decide', en: 'The radar sweeps sources until it finds who decides' }, render: () => <Agent2 /> },
  { id: 'contactos', name: { es: 'Contactos por revisar', en: 'Contacts to review' }, hint: { es: 'La decisora nueva llega arriba', en: 'The new decision-maker lands on top' }, render: () => <Review kind="contactos" /> },
  { id: 'telefono', name: { es: 'Revelar teléfono', en: 'Reveal phone' }, hint: { es: 'Apollo y, si no hay número, Lusha', en: 'Apollo and, if no number, Lusha' }, render: () => <Phone /> },
  { id: 'agente-3', name: { es: 'Agente 3 · Investigación', en: 'Agent 3 · Research' }, hint: { es: 'Rumbo atrae las fuentes y cita cada dato', en: 'Rumbo pulls in sources and cites every fact' }, render: () => <Research /> },
  { id: 'mensaje', name: { es: 'Agente 3 · Mensaje por canal', en: 'Agent 3 · Message per channel' }, hint: { es: 'Correo, LinkedIn, llamada y WhatsApp', en: 'Email, LinkedIn, call and WhatsApp' }, render: () => <Message /> },
  { id: 'catalogo', name: { es: 'Catálogo de fuentes', en: 'Source catalog' }, hint: { es: 'Una fuente nueva se prueba y queda verificada', en: 'A new source is tested and verified' }, render: () => <CatalogScreen /> },
  { id: 'uso', name: { es: 'Uso de IA y costos', en: 'AI usage and costs' }, hint: { es: 'Costo, consultas y resultado por rol', en: 'Cost, queries and outcome by role' }, render: () => <UsageMetrics /> },
  { id: 'rumbo', name: { es: 'Rumbo · cómo busca', en: 'Rumbo · how it searches' }, hint: { es: 'Lo que piensa mientras baja la cascada', en: 'What it thinks while stepping down the cascade' }, render: () => <RumboSearch /> },
]
const IDS = MODULES.map((m) => m.id)

/** Pestañas de módulos: columna a la izquierda en escritorio, fila deslizable arriba en teléfono. */
function Tabs({ active, onPick }: { active: string; onPick: (id: string) => void }) {
  const { t } = useLocale()
  const current = useRef<HTMLButtonElement>(null)
  // En teléfono la fila se desliza: la pestaña activa (también al usar las flechas) siempre queda a la vista.
  useEffect(() => {
    current.current?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
  }, [active])
  return (
    <nav aria-label={t({ es: 'Módulos de SellUp', en: 'SellUp modules' })} className="shrink-0 border-white/10 max-lg:border-b lg:w-[240px] lg:border-r">
      <ol className="flex gap-1 overflow-x-auto px-3 py-2.5 [scrollbar-width:none] lg:flex-col lg:overflow-y-auto lg:py-4 [&::-webkit-scrollbar]:hidden">
        {MODULES.map((m, i) => {
          const on = m.id === active
          return (
            <li key={m.id} className="shrink-0">
              <button
                ref={on ? current : undefined}
                type="button"
                onClick={() => onPick(m.id)}
                aria-current={on ? 'page' : undefined}
                className={`flex w-full items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2 text-left text-[13px] transition-colors ${on ? 'bg-[#5b7eff]/[0.16] text-white ring-1 ring-[#5b7eff]/50' : 'text-white/60 hover:bg-white/[0.05] hover:text-white'}`}
              >
                <span className="font-mono text-[11px] tabular-nums text-white/40">{String(i + 1).padStart(2, '0')}</span>
                {t(m.name)}
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

function Gallery({ active, onPick }: { active: string; onPick: (id: string) => void }) {
  const { t } = useLocale()
  const m = MODULES.find((x) => x.id === active) ?? MODULES[0]
  return (
    <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
      <Tabs active={m.id} onPick={onPick} />
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4 sm:px-6 lg:px-8 lg:py-6" data-lenis-prevent>
        <div className="mx-auto max-w-[1100px]">
          <p className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-[15px] font-medium text-white">{t(m.name)}</span>
            <span className="text-[13px] text-white/55">{t(m.hint)}</span>
          </p>
          <div key={m.id} className="animate-[sellupDemoIn_.45s_cubic-bezier(.16,1,.3,1)]">{m.render()}</div>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-white/40">{t({ es: 'Réplica de la pantalla real · datos de ejemplo', en: 'Replica of the real screen · sample data' })}</p>
        </div>
      </div>
      <style>{'@keyframes sellupDemoIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}'}</style>
    </div>
  )
}

/** La vista previa de la tarjeta: el tablero real, quieto, con la empresa a mitad de camino. */
function Preview() {
  return (
    <span className="block w-full">
      <RealFrame active="flujo" crumb={['Flujo de prospección']} height={640}><FlowScreen time={9} /></RealFrame>
    </span>
  )
}

/** 08 · Demo: la plataforma completa, módulo por módulo, en réplicas que trabajan solas. */
export function SellUpDemo() {
  const { t } = useLocale()
  const [open, setOpen] = useState<string | null>(null)
  return (
    <>
      <div className="max-lg:[&>div]:grid-cols-[minmax(0,1fr)]">
        <CaseDemo
          title={{ es: 'SellUp completo, trabajando.', en: 'All of SellUp, at work.' }}
          lead={{ es: 'Cada módulo y cada agente de la plataforma, uno tras otro y animados como en el día a día: el flujo, los tres agentes, las bandejas de revisión, el catálogo de fuentes y el uso de IA. Réplicas fieles de las pantallas reales, con datos de ejemplo.', en: 'Every module and agent of the platform, one after another and animated as in daily use: the flow, the three agents, the review queues, the source catalog and AI usage. Faithful replicas of the real screens, with sample data.' }}
          url="sellup · réplica de la plataforma"
          preview={<Preview />}
          accent={BLUE}
          onOpen={() => setOpen(IDS[0])}
        />
      </div>
      <RecordModal
        ids={IDS}
        openId={open}
        onOpenChange={setOpen}
        title={t({ es: 'SellUp · la plataforma', en: 'SellUp · the platform' })}
        titleLeading={<SellUpMark size={36} />}
        description={t({ es: 'Réplicas de las pantallas reales · datos de ejemplo', en: 'Replicas of the real screens · sample data' })}
        prevLabel={t({ es: 'Módulo anterior', en: 'Previous module' })}
        nextLabel={t({ es: 'Módulo siguiente', en: 'Next module' })}
      >
        {open && <Gallery active={open} onPick={setOpen} />}
      </RecordModal>
    </>
  )
}

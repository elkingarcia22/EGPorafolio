'use client'

import { Loader2 } from 'lucide-react'
import { useLocale } from '@/lib/i18n'
import { RealFrame } from './real-app'
import { Composer, OptionsCard, RumboPanel, RumboSays, UserSays, type PanelOption } from './real-rumbo-panel'
import { CompanyReview } from './real-review-tables'
import { CompanyDetail } from './real-detail'
import { AgentStructure, type StructureItem } from './forma-structure'
import { FakeCursor, ReplicaNote, StorySteps, useStoryTime, type StoryStep } from './real-story'

/**
 * 5.2 · Agente 1: el panel de Rumbo «Generar empresas candidatas» (tal cual la app),
 * el resultado en «Por revisar» con la empresa nueva destacada y su detalle.
 */

const STEPS: readonly StoryStep[] = [
  { label: { es: 'Rumbo pregunta qué buscar', en: 'Rumbo asks what to look for' }, from: 0 },
  { label: { es: 'Llega a «Por revisar», destacada', en: 'Lands in “To review”, highlighted' }, from: 13 },
  { label: { es: 'Se abre su detalle', en: 'Its detail opens' }, from: 17 },
]
const LOOP = 31

/** Los seis tipos de búsqueda, con el texto de la app. */
const TYPES: readonly PanelOption[] = [
  { title: 'Empresas por criterios', body: 'Busca empresas según país, industria y criterios específicos.' },
  { title: 'Muchas empresas por criterios', body: 'Hasta 200 empresas de un país e industria, por rondas, con un tope de créditos que tú confirmas.' },
  { title: 'Árbol de una empresa', body: 'Desde una empresa, encuentra su grupo y matriz, sus filiales y dónde opera en otros países.' },
  { title: 'Competidores de una empresa', body: 'Encuentra empresas que compiten con una de referencia.' },
  { title: 'Proveedores de una empresa', body: 'Empresas que le venden a una empresa que tú eliges.' },
  { title: 'Enriquecer empresa de HubSpot', body: 'Pega el enlace de HubSpot: la traigo, completo sus datos y te la asigno si no tiene responsable.' },
]
const STRUCTURE: readonly StructureItem[] = TYPES.map((o, i) => ({
  title: { es: o.title, en: ['Companies by criteria', 'Many companies by criteria', 'A company’s tree', 'A company’s competitors', 'A company’s suppliers', 'Enrich a HubSpot company'][i] },
  body: { es: o.body, en: ['Searches companies by country, industry and specific criteria.', 'Up to 200 companies from one country and industry, in rounds, with a credit cap you confirm.', 'From one company, finds its group and parent, its subsidiaries and where it operates abroad.', 'Finds companies that compete with a reference one.', 'Companies that sell to a company you pick.', 'Paste the HubSpot link: I bring it, complete its data and assign it to you if it has no owner.'][i] },
}))

const STEP_NAMES = ['Tipo', 'País', 'Industria', 'Criterios', 'Resumen', 'Revisión']

function Conversation({ time }: { time: number }) {
  const picked = time >= 4
  const step = time < 4 ? 0 : time < 6 ? 1 : time < 8 ? 2 : time < 9 ? 3 : time < 11 ? 4 : 5
  return (
    <RumboPanel subtitle="Generar empresas candidatas" tabs steps={STEP_NAMES} step={step} back footer={!picked ? <OptionsCard title="¿Qué tipo de prospectos quieres encontrar?" options={TYPES} picked={time === 3 ? 0 : undefined} /> : <Composer text="" placeholder="Escribe tu respuesta…" typing={false} />}>
      {!picked ? (
        <>
          <RumboSays show={time >= 0}>Hola, te ayudaré a encontrar los prospectos que necesitas.</RumboSays>
          <RumboSays show={time >= 1}>Primero, selecciona el tipo de búsqueda que quieres realizar.</RumboSays>
          <RumboSays show={time >= 2}>¿Qué tipo de prospectos quieres encontrar?</RumboSays>
        </>
      ) : (
        <>
          <UserSays>Empresas por criterios</UserSays>
          <RumboSays show={time >= 5}>¿En qué país buscamos?</RumboSays>
          <UserSays show={time >= 6}>Chile</UserSays>
          <RumboSays show={time >= 7}>¿Qué industria?</RumboSays>
          <UserSays show={time >= 8}>Agroindustria · más de 200 empleados</UserSays>
          <RumboSays show={time >= 9}>
            <span className="block rounded-xl border border-white/10 bg-white/[0.04] p-2.5 text-[12.5px] text-white/80">
              <span className="mb-1 block font-medium text-white">Resumen antes de buscar</span>
              Hasta 12 empresas de Agroindustria en Chile. Primero HubSpot, registros oficiales y el banco; Apollo solo si falta, con tope de 10 créditos.
            </span>
          </RumboSays>
          <RumboSays show={time >= 11}>
            <span className="inline-flex items-center gap-2 text-white"><Loader2 className="h-3.5 w-3.5 animate-spin" />Buscando… 9 candidatas, 0 créditos usados</span>
          </RumboSays>
        </>
      )}
    </RumboPanel>
  )
}

export function SearchReview() {
  const { t } = useLocale()
  const [ref, time] = useStoryTime(LOOP, 20)
  const panel = time < 13
  const arrived = time >= 14
  const detail = time >= 18 && time < LOOP - 1
  const cursor = time === 3 ? { x: 960, y: 372 } : time >= 15 && time < 18 ? { x: 370, y: 256 } : time < 3 ? { x: 1080, y: 560 } : { x: 700, y: 640 }
  return (
    <div ref={ref}>
      <StorySteps steps={STEPS} time={time} kicker={{ es: 'Agente 1', en: 'Agent 1' }} />
      <RealFrame
        active="revisar"
        crumb={['Empresas', 'Por revisar']}
        height={720}
        overlay={<FakeCursor x={cursor.x} y={cursor.y} click={time === 3 || time === 17} show={time <= 4 || (time >= 15 && time < 18)} />}
      >
        <CompanyReview arrived={arrived} focus={time >= 14} />
        <div className={`absolute inset-0 transition-opacity duration-500 ${panel ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
          <div className="absolute inset-0 bg-black/40" />
          <Conversation time={time} />
        </div>
        <CompanyDetail show={detail} />
      </RealFrame>
      <ReplicaNote />
      <AgentStructure heading={{ es: 'Su estructura · seis formas de buscar empresas', en: 'Its structure · six ways to find companies' }} items={STRUCTURE} active={panel ? 0 : undefined} />
      <p className="mt-3 text-sm text-white/50">{t({ es: 'Todas terminan en la misma bandeja, con las mismas verificaciones: número fiscal, dominio, duplicados y dueño en HubSpot.', en: 'They all end in the same queue, with the same checks: tax ID, domain, duplicates and owner in HubSpot.' })}</p>
    </div>
  )
}

'use client'

import { Loader2 } from 'lucide-react'
import { useLocale } from '@/lib/i18n'
import { useA11y } from '@/lib/a11y'
import { RealFrame } from './real-app'
import { Composer, OptionsCard, RumboPanel, RumboSays, UserSays, type PanelOption } from './real-rumbo-panel'
import { CompanyReview } from './real-review-tables'
import { CompanyDetail } from './real-detail'
import { AgentStructure, type StructureItem } from './forma-structure'
import { FakeCursor, ReplicaNote, StorySteps, stepAt, type StoryStep } from './real-story'
import { DetailScene, PanelScene, useSceneTime } from './forma-stage'
import { FastStage } from './forma-a1-stage'
import { SpeedTunnel } from './forma-a1-tunnel'

/**
 * 5.2 · Agente 1: el panel de Rumbo «Generar empresas candidatas» (tal cual la app),
 * el resultado en «Por revisar» con la empresa nueva destacada y su detalle.
 */

const STEPS: readonly StoryStep[] = [
  { label: { es: 'Rumbo pregunta qué buscar', en: 'Rumbo asks what to look for' }, from: 0 },
  { label: { es: 'Viaja por las fuentes', en: 'Travels through the sources' }, from: 12 },
  { label: { es: 'Aterriza en «Por revisar»', en: 'Lands in “To review”' }, from: 18 },
  { label: { es: 'Se abre su detalle', en: 'Its detail opens' }, from: 26 },
]
/** Ticks de 0,56 s: 0–11 panel, 12–17 túnel, 18–25 tabla, 26–35 detalle. */
const LOOP = 36

/** Las filas caen escalonadas al aterrizar en la tabla. */
const LANDING_CSS = `@keyframes a1-drop{0%{transform:translateY(-14px);opacity:0}100%{transform:none;opacity:1}}.a1-land [class*="border-white/[0.06]"]{animation:a1-drop 320ms cubic-bezier(0.16,1,0.3,1) both}${Array.from({ length: 10 }, (_, i) => `.a1-land [class*="border-white/[0.06]"]:nth-child(${i + 1}){animation-delay:${i * 45}ms}`).join('')}`

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
    <RumboPanel inline subtitle="Generar empresas candidatas" tabs steps={STEP_NAMES} step={step} back footer={!picked ? <OptionsCard title="¿Qué tipo de prospectos quieres encontrar?" options={TYPES} picked={time === 3 ? 0 : undefined} /> : <Composer text="" placeholder="Escribe tu respuesta…" typing={false} />}>
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
  const { reducedMotion } = useA11y()
  const [ref, time, jump] = useSceneTime(LOOP, 22)
  const scene = stepAt(STEPS, time)
  const onRow = time >= 22 && time < 26
  return (
    <div ref={ref}>
      <style>{LANDING_CSS}</style>
      <StorySteps steps={STEPS} time={time} kicker={{ es: 'Agente 1', en: 'Agent 1' }} onPick={jump} />
      <FastStage
        active={scene}
        scenes={[
          { node: <PanelScene><Conversation time={Math.min(time, 11)} /></PanelScene> },
          { node: <SpeedTunnel active={scene === 1} still={reducedMotion} />, from: 0.6 },
          {
            from: 1.18,
            bounce: true,
            node: (
              <div key={scene === 2 ? 'land' : 'idle'} className={scene === 2 && !reducedMotion ? 'a1-land' : ''}>
                <RealFrame active="revisar" crumb={['Empresas', 'Por revisar']} height={600} overlay={<FakeCursor x={onRow ? 370 : 900} y={onRow ? 256 : 560} click={time === 25} show={onRow} />}>
                  <CompanyReview arrived={time >= 19} focus={time >= 19} />
                </RealFrame>
              </div>
            ),
          },
          { node: <DetailScene><CompanyDetail show inline /></DetailScene>, from: 0.22, origin: '30% 43%' },
        ]}
      />
      <ReplicaNote />
      <AgentStructure heading={{ es: 'Su estructura · seis formas de buscar empresas', en: 'Its structure · six ways to find companies' }} items={STRUCTURE} active={scene <= 1 ? 0 : undefined} />
      <p className="mt-3 text-sm text-white/50">{t({ es: 'Todas terminan en la misma bandeja, con las mismas verificaciones: número fiscal, dominio, duplicados y dueño en HubSpot.', en: 'They all end in the same queue, with the same checks: tax ID, domain, duplicates and owner in HubSpot.' })}</p>
    </div>
  )
}

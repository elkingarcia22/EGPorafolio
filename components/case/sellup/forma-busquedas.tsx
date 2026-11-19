'use client'

import { useLocale } from '@/lib/i18n'
import { useA11y } from '@/lib/a11y'
import { RealFrame } from './real-app'
import type { PanelOption } from './real-rumbo-panel'
import { CompanyReview } from './real-review-tables'
import { CompanyDetail } from './real-detail'
import { AgentStructure, type StructureItem } from './forma-structure'
import { FakeCursor, ReplicaNote, StorySteps, stepAt, type StoryStep } from './real-story'
import { DetailScene, Scaled, useSceneTime } from './forma-stage'
import { FastStage } from './forma-a1-stage'
import { MAP_H, MAP_SIDE_VIEW, MAP_W, SearchMap, radarAt } from './forma-a1-map'
import { useCompact } from './camera'

/**
 * 5.2 · Agente 1: arranca cuando Rumbo ya busca (radar que recorre varios países),
 * el resultado en «Por revisar» con la empresa nueva destacada y su detalle.
 */

const STEPS: readonly StoryStep[] = [
  { label: { es: 'El radar de Rumbo recorre los países', en: 'Rumbo’s radar sweeps the countries' }, from: 0 },
  { label: { es: 'Aterriza en «Por revisar»', en: 'Lands in “To review”' }, from: 11 },
  { label: { es: 'Se abre su detalle', en: 'Its detail opens' }, from: 19 },
]
/** Ticks de 0,56 s: 0–10 radar, 11–18 tabla, 19–28 detalle. */
const LOOP = 29

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

/**
 * El radar sobre el mapa. En pantallas chicas se parte en dos encuadres apilados a
 * tamaño legible: el mapa sigue al radar de país en país y, debajo, la columna de fuentes.
 */
function MapScene({ t, still }: { t: number; still: boolean }) {
  const compact = useCompact()
  if (!compact) return <Scaled width={MAP_W} height={MAP_H}><SearchMap t={t} still={still} /></Scaled>
  const [rx, ry] = radarAt(t, still)
  return (
    <div className="grid gap-2 overflow-hidden rounded-[22px] bg-[#0b0c10] md:grid-cols-[minmax(0,1fr)_316px] md:items-center">
      <Scaled width={MAP_W} height={MAP_H} view={{ cx: Math.max(rx + 20, 206), cy: ry - 10, w: 380, h: 290 }}><SearchMap t={t} still={still} /></Scaled>
      <Scaled width={MAP_W} height={MAP_H} view={MAP_SIDE_VIEW}><SearchMap t={t} still={still} /></Scaled>
    </div>
  )
}

/** Encuadres de la bandeja en pantallas chicas: la fila nueva y, un momento, su estado. */
function reviewView(time: number) {
  if (time >= 13 && time < 15) return { cx: 1060, cy: 300, w: 400, h: 560 }
  return { cx: 0, x: 252, cy: 300, w: 400, h: 560 }
}

export function SearchReview() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const [ref, time, jump] = useSceneTime(LOOP, 15)
  const scene = stepAt(STEPS, time)
  const onRow = time >= 15 && time < 19
  const compact = useCompact()
  return (
    <div ref={ref}>
      <style>{LANDING_CSS}</style>
      <StorySteps steps={STEPS} time={time} kicker={{ es: 'Agente 1', en: 'Agent 1' }} onPick={jump} />
      <FastStage
        active={scene}
        scenes={[
          { node: <MapScene t={scene === 0 ? time : 10} still={reducedMotion} />, from: 0.6 },
          {
            from: 1.18,
            bounce: true,
            node: (
              <div key={scene === 1 ? 'land' : 'idle'} className={scene === 1 && !reducedMotion ? 'a1-land' : ''}>
                <RealFrame active="revisar" crumb={['Empresas', 'Por revisar']} height={600} view={reviewView(time)} overlay={<FakeCursor x={onRow ? 370 : 900} y={onRow ? 262 : 560} click={time === 18} show={onRow} />}>
                  <CompanyReview arrived={time >= 12} focus={time >= 12} />
                </RealFrame>
              </div>
            ),
          },
          {
            // En teléfono el detalle se dibuja a su tamaño (sin escalar), con los paneles turnándose.
            node: compact ? <div className="py-2"><CompanyDetail show inline stack panel={time < 24 ? 0 : 1} /></div> : <DetailScene><CompanyDetail show inline /></DetailScene>,
            from: 0.22,
            origin: '30% 43%',
          },
        ]}
      />
      <ReplicaNote />
      <AgentStructure heading={{ es: 'Su estructura · seis formas de buscar empresas', en: 'Its structure · six ways to find companies' }} items={STRUCTURE} active={scene === 0 ? 0 : undefined} />
      <p className="mt-3 text-sm text-white/50">{t({ es: 'Todas terminan en la misma bandeja, con las mismas verificaciones: número fiscal, dominio, duplicados y dueño en HubSpot.', en: 'They all end in the same queue, with the same checks: tax ID, domain, duplicates and owner in HubSpot.' })}</p>
    </div>
  )
}

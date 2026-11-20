'use client'

import { useLocale } from '@/lib/i18n'
import { useA11y } from '@/lib/a11y'
import type { PanelOption } from './real-rumbo-panel'
import { AgentStructure, type StructureItem } from './forma-structure'
import { ReplicaNote } from './real-story'
import { Scaled, useSceneTime } from './forma-stage'
import { MAP_H, MAP_W, SearchMap } from './forma-a1-map'
import { SearchRadarMobile } from './forma-a1-radar-mobile'
import { useCompact } from './camera'

/**
 * 5.2 · Agente 1: el radar de Rumbo recorre varios países y marca las empresas que
 * encajan, primero en las fuentes gratis. La historia termina en la búsqueda.
 */

/** Ticks de 0,56 s: 0–9 el radar recorre los países, 10–13 las candidatas salen a revisar. */
const LOOP = 14

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

/** El radar. En pantallas chicas no se recorta el de escritorio: se usa una versión hecha para el teléfono. */
function MapScene({ t, still }: { t: number; still: boolean }) {
  const compact = useCompact()
  if (!compact) return <Scaled width={MAP_W} height={MAP_H}><SearchMap t={t} still={still} /></Scaled>
  return <SearchRadarMobile t={t} still={still} />
}

export function SearchReview() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const [ref, time] = useSceneTime(LOOP, 9)
  return (
    <div ref={ref}>
      <MapScene t={time} still={reducedMotion} />
      <ReplicaNote />
      <AgentStructure heading={{ es: 'Su estructura · seis formas de buscar empresas', en: 'Its structure · six ways to find companies' }} items={STRUCTURE} active={0} />
      <p className="mt-3 text-sm text-white/50 max-md:hidden">{t({ es: 'Todas terminan en la misma bandeja, con las mismas verificaciones: número fiscal, dominio, duplicados y dueño en HubSpot.', en: 'They all end in the same queue, with the same checks: tax ID, domain, duplicates and owner in HubSpot.' })}</p>
    </div>
  )
}

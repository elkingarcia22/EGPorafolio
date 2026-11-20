'use client'

import { useLocale } from '@/lib/i18n'
import { AgentStructure, type StructureItem } from './forma-structure'
import { ReplicaNote } from './real-story'
import { Scaled, useSceneTime } from './forma-stage'
import { PeopleRadar, RADAR_H, RADAR_W } from './forma-a2-radar'
import { PeopleRadarMobile } from './forma-a2-radar-mobile'
import { useCompact } from './camera'

/**
 * 5.3 · Agente 2: Rumbo abre la empresa y su radar barre las fuentes en cascada
 * (HubSpot → lo ya conocido → Apollo → Lusha) hasta dar con quien decide.
 * La historia termina en la búsqueda.
 */

/** Ticks de 0,56 s: 0–9 barrido, 10–11 suben los decisores, 12–15 salen a revisar. */
const LOOP = 16

const STRUCTURE: readonly StructureItem[] = [
  { title: { es: 'Una empresa', en: 'One company' }, body: { es: 'Por nombre, dominio o HubSpot ID. También sirve el correo de alguien que trabaje allí.', en: 'By name, domain or HubSpot ID. Someone’s work email works too.' }, note: { es: 'HubSpot → lo ya conocido → Apollo → Lusha', en: 'HubSpot → already known → Apollo → Lusha' } },
  { title: { es: 'Varias empresas por HubSpot ID', en: 'Several companies by HubSpot ID' }, body: { es: 'Hasta 10 HubSpot IDs de empresa, separados por coma o uno por fila.', en: 'Up to 10 company HubSpot IDs, comma-separated or one per line.' }, note: { es: 'Corre en segundo plano', en: 'Runs in the background' } },
  { title: { es: 'Un contacto por LinkedIn, correo o ID', en: 'One contact by LinkedIn, email or ID' }, body: { es: 'Su perfil de LinkedIn, su correo o su ID de contacto en HubSpot. Antes de gastar créditos revisa si ya lo tenemos.', en: 'Their LinkedIn profile, email or HubSpot contact ID. Before spending credits it checks whether we already have them.' }, note: { es: 'Teléfono: Apollo y, si no hay, Lusha', en: 'Phone: Apollo and, if none, Lusha' } },
]

/**
 * El radar de decisores. En pantallas chicas no se recorta el de escritorio: se usa
 * una versión hecha para el ancho del teléfono (radar completo y tarjetas debajo).
 */
function RadarScene({ t }: { t: number }) {
  const compact = useCompact()
  if (!compact) return <Scaled width={RADAR_W} height={RADAR_H}><PeopleRadar t={t} /></Scaled>
  return <PeopleRadarMobile t={t} />
}

export function ContactEnrichment() {
  const { t } = useLocale()
  const [ref, time] = useSceneTime(LOOP, 11)
  return (
    <div ref={ref}>
      <RadarScene t={time} />
      <ReplicaNote />
      <AgentStructure heading={{ es: 'Su estructura · tres formas de buscar contactos', en: 'Its structure · three ways to find contacts' }} items={STRUCTURE} active={0} />
      <p className="mt-3 text-sm text-white/50 max-md:hidden">{t({ es: 'Nada se aprueba solo: cada contacto llega a «Por revisar» con su relevancia, su fuente y lo que costó.', en: 'Nothing approves itself: every contact lands in “To review” with its relevance, source and cost.' })}</p>
    </div>
  )
}

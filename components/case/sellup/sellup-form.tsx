'use client'

import { Section } from './ui'
import { PipelineFlow } from './forma-flujo'
import { SearchReview } from './forma-busquedas'
import { ContactEnrichment } from './forma-enriquecimiento'
import { FirstContactPrep } from './forma-preparacion'
import { SourceCatalog } from './forma-catalogo'
import { UsageMetrics } from './forma-uso'

/** 05 · La forma: réplicas interactivas de la plataforma, en modo oscuro como la app. */
export function SellUpForm() {
  return (
    <div>
      <Section
        n="5.1"
        title={{ es: 'Un solo flujo, una etapa por agente', en: 'One flow, one stage per agent' }}
        body={{ es: 'La pantalla de inicio es el embudo: cada empresa dice en qué etapa está, qué pasó y qué falta. Cada etapa la mueve un agente, y una persona decide antes de pasar a la siguiente.', en: 'The home screen is the funnel: every company shows its stage, what happened and what’s missing. Each stage is moved by an agent, and a person decides before the next one.' }}
      >
        <PipelineFlow />
      </Section>
      <Section
        n="5.2"
        title={{ es: 'Agente 1 · Rumbo busca, el vendedor decide', en: 'Agent 1 · Rumbo searches, the rep decides' }}
        body={{ es: 'Las búsquedas terminan en «Por revisar». Cada empresa llega con su veredicto: nueva, ya de otro vendedor o libre en HubSpot. Solo al aprobar se escribe en el CRM. Aprueba o descarta.', en: 'Searches end in “To review”. Each company arrives with its verdict: new, owned by another rep or free in HubSpot. Only approving writes to the CRM. Approve or discard.' }}
      >
        <SearchReview />
      </Section>
      <Section
        n="5.3"
        title={{ es: 'Agente 2 · Los decisores, primero gratis', en: 'Agent 2 · Decision-makers, free first' }}
        body={{ es: 'Un clic reserva los créditos antes de llamar a nadie, recorre HubSpot y lo ya conocido, y solo después paga Apollo o Lusha. Lo que no se usa se devuelve.', en: 'One click reserves credits before calling anyone, goes through HubSpot and what’s already known, and only then pays Apollo or Lusha. Whatever isn’t used is returned.' }}
      >
        <ContactEnrichment />
      </Section>
      <Section
        n="5.4"
        title={{ es: 'Agente 3 · Qué decir, a quién y por dónde', en: 'Agent 3 · What to say, to whom and where' }}
        body={{ es: 'Rumbo investiga la empresa una vez y prepara un mensaje por decisor y por canal, con cada dato citado. Cambia de persona o de canal.', en: 'Rumbo researches the company once and prepares a message per decision-maker and per channel, every fact cited. Switch person or channel.' }}
      >
        <FirstContactPrep />
      </Section>
      <Section
        n="5.5"
        title={{ es: 'Catálogo de fuentes', en: 'Source catalog' }}
        body={{ es: 'Cada fuente oficial que la IA puede consultar, país por país, con su estado. Lo que no está verificado no se usa. Filtra por estado.', en: 'Every official source the AI can query, country by country, with its status. Nothing unverified is used. Filter by status.' }}
      >
        <SourceCatalog />
      </Section>
      <Section
        n="5.6"
        title={{ es: 'Control total de uso y costos', en: 'Full control of usage and cost' }}
        body={{ es: 'Cada corrida deja su costo, su proveedor y su resultado. Así se sabe cuánto cuesta una empresa aprobada, no solo cuánto se gastó.', en: 'Every run logs its cost, provider and outcome. So you know what an approved company costs, not just what was spent.' }}
      >
        <UsageMetrics />
      </Section>
    </div>
  )
}

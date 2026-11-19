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
        title={{ es: 'Una empresa recorre el flujo', en: 'One company moves through the flow' }}
        body={{ es: 'La pantalla de inicio de SellUp, tal cual. Sigue a una empresa: Rumbo la encuentra, busca a sus decisores y prepara el primer contacto. Cada etapa la mueve un agente y la ficha va contando qué pasó y qué falta.', en: 'SellUp’s home screen, as is. Follow one company: Rumbo finds it, looks for its decision-makers and prepares the first contact. Each stage is moved by an agent and the record keeps telling what happened and what’s missing.' }}
      >
        <PipelineFlow />
      </Section>
      <Section
        n="5.2"
        title={{ es: 'Agente 1 · De la conversación a la empresa aprobada', en: 'Agent 1 · From conversation to approved company' }}
        body={{ es: 'El vendedor le cuenta a Rumbo qué busca, en seis pasos. La búsqueda aparece en Búsquedas, encuentra candidatas, y cada una llega a «Por revisar» con su veredicto. Solo al aprobar se escribe en HubSpot.', en: 'The rep tells Rumbo what they’re after, in six steps. The search shows up in Searches, finds candidates, and each one lands in “To review” with its verdict. Only approving writes to HubSpot.' }}
      >
        <SearchReview />
      </Section>
      <Section
        n="5.3"
        title={{ es: 'Agente 2 · Un clic y llegan los decisores', en: 'Agent 2 · One click, and decision-makers arrive' }}
        body={{ es: 'En la ficha de la empresa, «Buscar más contactos con IA» reserva créditos antes de llamar a nadie, recorre HubSpot y lo ya conocido, y solo después paga Apollo o Lusha. Lo que no se usa se devuelve.', en: 'On the company record, “Find more contacts with AI” reserves credits before calling anyone, goes through HubSpot and what’s already known, and only then pays Apollo or Lusha. Whatever isn’t used is returned.' }}
      >
        <ContactEnrichment />
      </Section>
      <Section
        n="5.4"
        title={{ es: 'Agente 3 · Qué decir, a quién y por dónde', en: 'Agent 3 · What to say, to whom and where' }}
        body={{ es: '«Preparar primer contacto con Rumbo IA» investiga la empresa una vez, cita cada dato y escribe un mensaje por decisor y por canal. Puedes cambiar de persona o de canal.', en: '“Prepare first contact with Rumbo AI” researches the company once, cites every fact and writes a message per decision-maker and per channel. You can switch person or channel.' }}
      >
        <FirstContactPrep />
      </Section>
      <Section
        n="5.5"
        title={{ es: 'Catálogo de fuentes', en: 'Source catalog' }}
        body={{ es: 'Cada fuente oficial que la IA puede consultar, país por país, con su estado. Una fuente nueva no se usa hasta probarla con datos reales.', en: 'Every official source the AI can query, country by country, with its status. A new source isn’t used until it’s tested with real data.' }}
      >
        <SourceCatalog />
      </Section>
      <Section
        n="5.6"
        title={{ es: 'Control total de uso y costos', en: 'Full control of usage and cost' }}
        body={{ es: 'Cada corrida deja su costo, sus consultas y su resultado en el mismo panel. Así se sabe cuánto cuesta una empresa aprobada, no solo cuánto se gastó.', en: 'Every run logs its cost, queries and outcome on the same panel. So you know what an approved company costs, not just what was spent.' }}
      >
        <UsageMetrics />
      </Section>
    </div>
  )
}

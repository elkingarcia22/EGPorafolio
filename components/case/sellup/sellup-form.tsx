'use client'

import { Section } from './ui'
import { PipelineFlow } from './forma-flujo'
import { SearchReview } from './forma-busquedas'
import { ContactEnrichment } from './forma-enriquecimiento'
import { FirstContactPrep } from './forma-preparacion'
import { SourceCatalog } from './forma-catalog-map'
import { UsageMetrics } from './forma-metrics'

/** 05 · La forma: réplicas interactivas de la plataforma, en modo oscuro como la app. */
export function SellUpForm() {
  return (
    <div>
      <Section
        n="5.1"
        title={{ es: 'Una empresa recorre el flujo', en: 'One company moves through the flow' }}
        body={{ es: 'La pantalla de inicio de SellUp en el escritorio del vendedor. Sigue a una empresa: Rumbo la encuentra, busca a sus decisores y prepara el primer contacto. En el tablero, la tarjeta salta de columna en columna: cada etapa la mueve un agente.', en: 'SellUp’s home screen on the rep’s desk. Follow one company: Rumbo finds it, looks for its decision-makers and prepares the first contact. On the board, the card jumps from column to column: each stage is moved by an agent.' }}
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
        title={{ es: '20 países y 132 fuentes, conectados', en: '20 countries and 132 sources, connected' }}
        body={{ es: 'Antes de pagar un crédito, Rumbo consulta los registros oficiales de cada país: el número fiscal de la empresa y su tamaño real. Son millones de filas gratis que nadie usaba. Toca un país para ver sus fuentes.', en: 'Before paying a credit, Rumbo checks each country’s official registries: the company’s tax ID and its real size. Millions of free rows nobody was using. Tap a country to see its sources.' }}
      >
        <SourceCatalog />
      </Section>
      <Section
        n="5.6"
        title={{ es: 'Uso y efectividad, medidos', en: 'Usage and effectiveness, measured' }}
        body={{ es: 'Cada corrida deja su costo, sus consultas y su resultado. Así se sabe cuánto cuesta una empresa aprobada, no solo cuánto se gastó.', en: 'Every run logs its cost, queries and outcome. So you know what an approved company costs, not just what was spent.' }}
      >
        <UsageMetrics />
      </Section>
    </div>
  )
}

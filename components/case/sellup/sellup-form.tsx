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
        body={{ es: 'Tres pantallas, una tras otra: el vendedor le cuenta a Rumbo qué busca en seis pasos; las candidatas llegan a «Por revisar» con su veredicto; y al abrir una se ve por qué entró. Solo al aprobar se escribe en HubSpot. Toca un paso para saltar.', en: 'Three screens, one after another: the rep tells Rumbo what they’re after in six steps; candidates land in “To review” with their verdict; and opening one shows why it got in. Only approving writes to HubSpot. Tap a step to jump.' }}
      >
        <SearchReview />
      </Section>
      <Section
        n="5.3"
        title={{ es: 'Agente 2 · Un clic y llegan los decisores', en: 'Agent 2 · One click, and decision-makers arrive' }}
        body={{ es: 'Le das la empresa a Rumbo: reserva créditos antes de llamar a nadie, recorre HubSpot y lo ya conocido, y solo después paga Apollo o Lusha. Los decisores llegan a «Por revisar» y, en el detalle, «Revelar teléfono» hace la misma cascada. Lo que no se usa se devuelve.', en: 'You give Rumbo the company: it reserves credits before calling anyone, goes through HubSpot and what’s already known, and only then pays Apollo or Lusha. Decision-makers land in “To review” and, in the detail, “Reveal phone” runs the same cascade. Whatever isn’t used is returned.' }}
      >
        <ContactEnrichment />
      </Section>
      <Section
        n="5.4"
        title={{ es: 'Agente 3 · Qué decir, a quién y por dónde', en: 'Agent 3 · What to say, to whom and where' }}
        body={{ es: 'Desde el detalle del contacto, «Preparar primer contacto» pone a Rumbo a investigar la empresa una vez, con una cita por dato, y luego escribe un mensaje por decisor y por canal. Puedes cambiar de persona o de canal.', en: 'From the contact detail, “Prepare first contact” has Rumbo research the company once, one citation per fact, and then write a message per decision-maker and per channel. You can switch person or channel.' }}
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
        body={{ es: 'Cada corrida deja su costo, sus consultas y su resultado. El mapa de uso cruza eso por rol: quién busca, quién aprueba y cuánto cuesta cada empresa aprobada, no solo cuánto se gastó.', en: 'Every run logs its cost, queries and outcome. The usage map crosses that by role: who searches, who approves and what each approved company costs, not just what was spent.' }}
      >
        <UsageMetrics />
      </Section>
    </div>
  )
}

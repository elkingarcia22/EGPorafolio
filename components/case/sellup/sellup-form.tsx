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
        short={{ es: 'Una empresa baja por las etapas: cada una la mueve un agente.', en: 'One company moves down the stages: an agent moves each one.' }}
        body={{ es: 'La pantalla de inicio de SellUp en el escritorio del vendedor. Sigue a una empresa: Rumbo la encuentra, busca a sus decisores y prepara el primer contacto. En el tablero, la tarjeta salta de columna en columna: cada etapa la mueve un agente.', en: 'SellUp’s home screen on the rep’s desk. Follow one company: Rumbo finds it, looks for its decision-makers and prepares the first contact. On the board, the card jumps from column to column: each stage is moved by an agent.' }}
      >
        <PipelineFlow />
      </Section>
      <Section
        n="5.2"
        title={{ es: 'Agente 1 · Un radar que recorre los países', en: 'Agent 1 · A radar sweeping the countries' }}
        short={{ es: 'El radar recorre los países y marca las empresas que encajan, primero con lo gratis.', en: 'The radar sweeps the countries and marks the companies that fit, free sources first.' }}
        body={{ es: 'El radar de Rumbo recorre los países y marca las empresas que encajan. Consulta primero las fuentes gratis, verifica cada una con su sitio y su número fiscal, y solo pagaría Apollo si faltaran candidatas. Las que encajan quedan listas para que una persona las revise.', en: 'Rumbo’s radar sweeps the countries and marks the companies that fit. It checks free sources first, verifies each one against its site and tax ID, and would only pay for Apollo if candidates were missing. The ones that fit are left ready for a person to review.' }}
      >
        <SearchReview />
      </Section>
      <Section
        n="5.3"
        title={{ es: 'Agente 2 · Un clic y llegan los decisores', en: 'Agent 2 · One click, and decision-makers arrive' }}
        short={{ es: 'El radar barre las fuentes en cascada hasta dar con quien decide.', en: 'The radar sweeps the sources in a cascade until it finds who decides.' }}
        body={{ es: 'Le das la empresa a Rumbo: reserva créditos antes de llamar a nadie, recorre HubSpot y lo ya conocido, y solo después paga Apollo o Lusha. El radar barre esas fuentes en cascada hasta dar con quien decide en RR. HH. y Formación. Lo que no se usa se devuelve.', en: 'You give Rumbo the company: it reserves credits before calling anyone, goes through HubSpot and what’s already known, and only then pays Apollo or Lusha. The radar sweeps those sources in a cascade until it finds who decides in HR and L&D. Whatever isn’t used is returned.' }}
      >
        <ContactEnrichment />
      </Section>
      <Section
        n="5.4"
        title={{ es: 'Agente 3 · Qué decir, a quién y por dónde', en: 'Agent 3 · What to say, to whom and where' }}
        short={{ es: 'Rumbo investiga, cita cada dato y escribe un mensaje por canal.', en: 'Rumbo researches, cites every fact and writes one message per channel.' }}
        body={{ es: 'Desde el detalle del contacto, «Preparar primer contacto» pone a Rumbo a investigar la empresa una vez, con una cita por dato, y luego escribe un mensaje por decisor y por canal. Puedes cambiar de persona o de canal.', en: 'From the contact detail, “Prepare first contact” has Rumbo research the company once, one citation per fact, and then write a message per decision-maker and per channel. You can switch person or channel.' }}
      >
        <FirstContactPrep />
      </Section>
      <Section
        n="5.5"
        title={{ es: '20 países y 132 fuentes, conectados', en: '20 countries and 132 sources, connected' }}
        short={{ es: 'Antes de pagar, Rumbo consulta los registros oficiales de cada país. Toca un país.', en: 'Before paying, Rumbo checks each country’s official registries. Tap a country.' }}
        body={{ es: 'Antes de pagar un crédito, Rumbo consulta los registros oficiales de cada país: el número fiscal de la empresa y su tamaño real. Son millones de filas gratis que nadie usaba. Toca un país para ver sus fuentes.', en: 'Before paying a credit, Rumbo checks each country’s official registries: the company’s tax ID and its real size. Millions of free rows nobody was using. Tap a country to see its sources.' }}
      >
        <SourceCatalog />
      </Section>
      <Section
        n="5.6"
        title={{ es: 'Uso y efectividad, medidos', en: 'Usage and effectiveness, measured' }}
        short={{ es: 'Cada corrida deja su costo y su resultado, cruzados por rol.', en: 'Every run logs its cost and outcome, crossed by role.' }}
        body={{ es: 'Cada corrida deja su costo, sus consultas y su resultado. El mapa de uso cruza eso por rol: quién busca, quién aprueba y cuánto cuesta cada empresa aprobada, no solo cuánto se gastó.', en: 'Every run logs its cost, queries and outcome. The usage map crosses that by role: who searches, who approves and what each approved company costs, not just what was spent.' }}
      >
        <UsageMetrics />
      </Section>
    </div>
  )
}

'use client'

import { useLocale } from '@/lib/i18n'
import { SELLUP_CASE } from '@/lib/content/cases/sellup/sellup-case'
import { Dots, Idea } from '../barberlytics/shared/sections'
import { SellUpShell, type NextLink } from './sellup-shell'
import { SellUpHero } from './sellup-hero'
import { CascadeStairs } from './sellup-patterns'
import { SellUpSketches } from './sellup-sketches'
import { FreeInHubSpot, ModeExplorer } from './forma-empresas'
import { PhoneWaterfall, ZeroFix } from './forma-contactos'
import { MessageTypes, PrepMatrix } from './forma-primer-contacto'
import { SellUpAi } from './sellup-ai'
import { SellUpImpact } from './sellup-impact'
import { SellUpDemo } from './sellup-demo'
import { Section } from './ui'

/** 05 · La forma: los tres agentes, cada uno con sus piezas. */
function SellUpForm() {
  return (
    <div>
      <Section n="5.1" title={{ es: 'Agente 1 · Cinco formas de buscar, una sola bandeja', en: 'Agent 1 · Five ways to search, one queue' }} body={{ es: 'Por criterios, competidores, proveedores, el árbol de un grupo o una lista propia. Todas terminan en «Por revisar» con las mismas verificaciones, y cada empresa dice en una línea si es nueva, duplicada o libre.', en: 'By criteria, competitors, suppliers, a group’s tree or your own list. All end in “To review” with the same checks, and each company says in one line whether it’s new, duplicate or free.' }}>
        <ModeExplorer />
      </Section>
      <Section n="5.2" title={{ es: 'Agente 1 · «Libre en HubSpot»', en: 'Agent 1 · “Free in HubSpot”' }} body={{ es: 'La primera fuente gratis son las empresas que ya están en HubSpot y nadie atiende. La regla es estricta para no quitarle una cuenta a nadie. Cambia la coincidencia y mira qué pasa.', en: 'The first free source is companies already in HubSpot that nobody is working. The rule is strict so no one loses an account. Change the match and see what happens.' }}>
        <FreeInHubSpot />
      </Section>
      <Section n="5.3" title={{ es: 'Agente 2 · Revelar un teléfono', en: 'Agent 2 · Revealing a phone number' }} body={{ es: 'Un teléfono es dinero y es un dato personal. Por eso un clic reserva créditos antes de llamar a nadie, prueba Apollo y, solo si no hay número, Lusha por debajo. Prueba los dos caminos.', en: 'A phone number is money and personal data. So one click reserves credits before calling anyone, tries Apollo and, only if there’s no number, Lusha underneath. Try both paths.' }}>
        <PhoneWaterfall />
      </Section>
      <Section n="5.4" title={{ es: 'Agente 2 · Cuando todo daba cero', en: 'Agent 2 · When everything came back zero' }} body={{ es: 'La mayoría de las búsquedas de contactos no traía a nadie. La base sí tenía a la gente: el problema era cómo le preguntábamos.', en: 'Most contact searches brought back nobody. The base did have the people: the problem was how we were asking.' }}>
        <ZeroFix />
      </Section>
      <Section n="5.5" title={{ es: 'Agente 3 · Decisor por canal', en: 'Agent 3 · Decision-maker by channel' }} body={{ es: 'Una investigación por empresa, un redactor por decisor y una preparación por canal. Cada dato lleva su cita, y un verificador sin IA marca lo que no está en la fuente. Abre las celdas.', en: 'One research per company, one writer per decision-maker and one preparation per channel. Every fact carries its citation, and a non-AI checker flags whatever isn’t in the source. Open the cells.' }}>
        <PrepMatrix />
      </Section>
      <Section n="5.6" title={{ es: 'Agente 3 · Ocho formas de abrir la conversación', en: 'Agent 3 · Eight ways to open the conversation' }} body={{ es: 'Salen de un manual del primer contacto con fuentes y de las normas de cada país. Se vende la reunión, no la plataforma.', en: 'They come from a sourced first-contact playbook and each country’s rules. It sells the meeting, not the platform.' }}>
        <MessageTypes />
      </Section>
    </div>
  )
}

const SellUpDots = () => <Dots data={SELLUP_CASE.dots} />
const SellUpIdea = () => <Idea data={SELLUP_CASE.idea} />

/** Caso SellUp: los tres agentes, de los puntos a la demo. */
export function SellUpCase({ next }: { next: NextLink }) {
  const { t } = useLocale()
  return (
    <SellUpShell
      title={t(SELLUP_CASE.title)}
      hero={<SellUpHero />}
      next={next}
      content={{
        puntos: SellUpDots,
        patrones: CascadeStairs,
        idea: SellUpIdea,
        bocetos: SellUpSketches,
        forma: SellUpForm,
        ia: SellUpAi,
        impacto: SellUpImpact,
        demo: SellUpDemo,
      }}
    />
  )
}

'use client'

import { useLocale } from '@/lib/i18n'
import { Section } from './ui'
import { RumboOrb } from './platform'
import { RumboSearch } from './ai-rumbo-search'

/** 06 · IA: Rumbo, la IA de SellUp, y cómo busca. */
export function SellUpAi() {
  const { t } = useLocale()
  return (
    <div>
      <div className="mb-4 flex items-center gap-4" data-reveal>
        <RumboOrb size={56} pulse />
        <p className="max-w-[26ch] text-[clamp(1.8rem,1rem+2.4vw,3.2rem)] font-light leading-[1.1] tracking-tight">
          {t({ es: 'Rumbo, la IA que trabaja dentro de SellUp.', en: 'Rumbo, the AI that works inside SellUp.' })}
        </p>
      </div>
      <p data-reveal className="max-w-[62ch] leading-relaxed opacity-80 max-md:hidden">
        {t({ es: 'Rumbo no es un chat aparte: es la misma IA detrás de los tres agentes. Conversa para entender qué busca el vendedor, baja la cascada de fuentes, lee y cita, y entrega todo a una bandeja donde una persona decide.', en: 'Rumbo isn’t a separate chat: it’s the same AI behind all three agents. It talks to understand what the rep wants, steps down the cascade of sources, reads and cites, and hands everything to a queue where a person decides.' })}
      </p>
      <Section
        n="6.1"
        title={{ es: 'Cómo busca Rumbo', en: 'How Rumbo searches' }}
        short={{ es: 'Primero lo gratis, cada dato con su cita, y se detiene apenas cumple la meta.', en: 'Free first, every fact with its quote, and it stops as soon as it hits the goal.' }}
        body={{ es: 'Rumbo consulta primero lo gratis, lee la fuente, guarda la frase exacta que respalda cada dato y verifica contra el dominio o el número fiscal. Se detiene apenas cumple la meta: si no hace falta pagar, no paga.', en: 'Rumbo checks free sources first, reads the source, saves the exact quote behind every fact and verifies against the domain or tax ID. It stops as soon as it hits the goal: if it doesn’t need to pay, it doesn’t.' }}
      >
        <RumboSearch />
      </Section>
    </div>
  )
}

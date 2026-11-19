'use client'

import { useLocale } from '@/lib/i18n'
import { SELLUP_CASE } from '@/lib/content/cases/sellup/sellup-case'
import { SellUpDots } from './sellup-dots'
import { SellUpIdea } from './sellup-idea'
import { SellUpShell, type NextLink } from './sellup-shell'
import { SellUpHero } from './sellup-hero'
import { CascadeStairs } from './sellup-patterns'
import { SellUpSketches } from './sellup-sketches'
import { SellUpForm } from './sellup-form'
import { SellUpAi } from './sellup-ai'
import { SellUpImpact } from './sellup-impact'
import { SellUpDemo } from './sellup-demo'

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

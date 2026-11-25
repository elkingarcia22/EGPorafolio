'use client'

import { ToneSection } from '@/components/ui/tone-section'
import { TransitionLink } from '@/components/transition/page-transition'
import { useLocale } from '@/lib/i18n'

/**
 * El cierre del caso: un hilo baja hasta el nodo de Barberlytics (en dorado) y
 * lleva de vuelta a los otros proyectos de la marca.
 */
export function BackToHub() {
  const { t } = useLocale()
  return (
    <ToneSection tone="dark" className="px-[var(--gutter)] pb-[clamp(5rem,3rem+8vw,10rem)] pt-[clamp(3rem,2rem+4vw,6rem)]">
      <TransitionLink href="/proyectos/barberlytics" transitionLabel="Barberlytics" className="group mx-auto flex max-w-[760px] flex-col items-center text-center outline-none">
        <span aria-hidden="true" className="h-[clamp(4rem,3rem+4vw,7rem)] w-px bg-gradient-to-b from-white/0 via-white/25 to-white/60" />
        <span className="relative mt-2 grid h-24 w-24 place-items-center">
          <span aria-hidden="true" className="absolute inset-[-30%] rounded-full bg-[radial-gradient(circle,rgb(var(--bk)/0.4),transparent_70%)] opacity-60 blur-2xl transition-opacity duration-700 group-hover:opacity-100" />
          <span aria-hidden="true" className="bk-ping absolute inset-0 rounded-full border border-[rgb(var(--bk)/0.5)]" />
          <span className="relative grid h-20 w-20 place-items-center rounded-full border border-white/15 bg-[rgb(var(--void))] shadow-[0_0_0_6px_rgb(var(--bk)/0.12),0_0_40px_6px_rgb(var(--bk)/0.3)] transition-transform duration-700 ease-expo group-hover:scale-105">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/cases/barberlytics/logo-gold-paper.svg" alt="" className="h-auto w-14" />
          </span>
        </span>
        <p className="mono-label mt-8 opacity-60">{t({ es: 'Volver a Barberlytics', en: 'Back to Barberlytics' })}</p>
        <p className="mt-3 text-[clamp(2rem,1rem+4vw,4.5rem)] font-light leading-[0.95] tracking-tight transition-transform duration-700 ease-expo group-hover:-translate-y-1">
          {t({ es: 'Ver los otros proyectos', en: 'See the other projects' })} <span className="text-[rgb(var(--bk))]">↗</span>
        </p>
      </TransitionLink>
    </ToneSection>
  )
}

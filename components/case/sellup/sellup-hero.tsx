'use client'

import { useEffect, useRef, useState } from 'react'
import { ToneSection } from '@/components/ui/tone-section'
import { TransitionLink, onPageReveal } from '@/components/transition/page-transition'
import { gsap } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'
import { SELLUP_CASE } from '@/lib/content/cases/sellup/sellup-case'
import { HeroChain } from './hero-chain'
import { SellUpMark, SellUpWordmark } from './ui'

/** Portada: el nombre centrado, la frase debajo y una sola rama con los tres agentes. Los datos, a un lado. */
export function SellUpHero() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(true)

  useEffect(() => {
    const el = ref.current
    if (!el || reducedMotion) return
    let tl: gsap.core.Timeline | null = null
    const ctx = gsap.context(() => {
      // Todo empieza escondido: la portada se arma cuando la carga se va.
      gsap.set('[data-su-mark]', { autoAlpha: 0, scale: 0.3, rotate: -30, filter: 'blur(12px)' })
      gsap.set('[data-su-word]', { yPercent: 115 })
      gsap.set('[data-hero-fade]', { autoAlpha: 0, y: 20 })
      gsap.set('[data-hero-stage]', { autoAlpha: 0, scale: 0.95, y: 30, filter: 'blur(12px)' })
    }, el)
    const build = () => {
      ctx.add(() => {
        tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
          // 1 · El imán se enciende como una neurona…
          .to('[data-su-mark]', { autoAlpha: 1, scale: 1, rotate: 0, filter: 'blur(0px)', duration: 1.1 }, 0)
          // 2 · …y la palabra sube desde abajo.
          .to('[data-su-word]', { yPercent: 0, duration: 1.2 }, 0.3)
          // 3 · Después, lo que la rodea: la frase, los datos y la cadena en vivo.
          .to('[data-hero-fade]', { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.06 }, 0.8)
          .to('[data-hero-stage]', { autoAlpha: 1, scale: 1, y: 0, filter: 'blur(0px)', duration: 1.4, clearProps: 'filter' }, 1)
      })
    }
    const cancel = onPageReveal(build)
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting))
    io.observe(el)
    return () => {
      cancel()
      tl?.kill()
      ctx.revert()
      io.disconnect()
    }
  }, [reducedMotion])

  return (
    <ToneSection tone="dark" className="relative px-[var(--gutter)] pb-24 pt-32">
      <div ref={ref}>
        <div className="pointer-events-none absolute left-1/2 top-[30%] h-[44vw] max-h-[640px] w-[70vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(91,126,255,0.12),transparent)]" aria-hidden="true" />

        <div className="relative mb-14 flex flex-wrap items-center justify-between gap-x-6 gap-y-2" data-hero-fade>
          <TransitionLink href="/#work" transitionLabel={t({ es: 'Trabajo', en: 'Work' })} className="mono-label max-md:text-[12px] opacity-60 hover:opacity-100">
            ← {t({ es: 'Proyectos', en: 'Projects' })}
          </TransitionLink>
          <span className="mono-label max-md:text-[12px] opacity-60">{t(SELLUP_CASE.eyebrow)}</span>
        </div>

        {/* Centro: nombre, frase y la rama. A un lado, los datos del proyecto en columna */}
        <div className="relative grid gap-12 lg:grid-cols-[minmax(0,13rem)_minmax(0,1fr)_minmax(0,13rem)] lg:items-center">
          <dl className="order-last grid grid-cols-2 gap-x-6 gap-y-5 border-t border-fg/15 pt-8 sm:grid-cols-3 lg:order-first lg:grid-cols-1 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
            {SELLUP_CASE.meta.map((m) => (
              <div key={m.label.es} data-hero-fade>
                <dt className="mono-label max-md:text-[12px] mb-1 opacity-50">{t(m.label)}</dt>
                <dd className="text-[13px] leading-snug">{t(m.value)}</dd>
              </div>
            ))}
            <div data-hero-fade className="col-span-2 sm:col-span-1">
              <dt className="mono-label max-md:text-[12px] mb-2 opacity-50">{t(COPY.case.tools)}</dt>
              <dd className="flex flex-wrap gap-1.5">
                {SELLUP_CASE.tools.map((tool) => (
                  <span key={tool} className="rounded-full border border-fg/20 px-2 py-0.5 text-[11px]">{tool}</span>
                ))}
              </dd>
            </div>
          </dl>
          <div className="min-w-0">
            <div className="relative flex flex-col items-center text-center">
              <h1 className="flex items-center gap-[0.16em] text-[clamp(3.2rem,1rem+8vw,9.5rem)] font-light leading-[0.9] tracking-tight">
                <span data-su-mark data-transition-target className="inline-block"><SellUpMark size={96} className="!h-[0.8em] !w-[0.8em] shadow-[0_0_60px_-10px_rgba(91,126,255,0.8)]" /></span>
                <span className="inline-block overflow-hidden pb-[0.1em] align-bottom">
                  <span data-su-word className="inline-block"><SellUpWordmark /></span>
                </span>
              </h1>
              <p data-hero-fade className="mt-6 max-w-2xl text-balance text-lg leading-relaxed opacity-80">{t(SELLUP_CASE.tagline)}</p>
            </div>

            <div data-hero-stage className="relative mt-16">
              <HeroChain running={inView} reducedMotion={reducedMotion} />
            </div>
          </div>
          <span aria-hidden="true" className="hidden lg:block" />
        </div>
      </div>
    </ToneSection>
  )
}

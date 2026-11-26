'use client'

import { useEffect, useRef, useState } from 'react'
import { ToneSection } from '@/components/ui/tone-section'
import { TransitionLink, onPageReveal, type PageRevealInfo } from '@/components/transition/page-transition'
import { gsap } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { CLIPPER_CASE } from '@/lib/content/cases/barberlytics/clipper-case'
import { HeroLine } from './clp-hero-line'
import { CaseMeta } from '@/components/case/case-meta'

/** La frase de la portada: la primera idea del agente, corta */
const TAGLINE = {
  es: 'Un agente que responde con los datos de la barbería, nunca adivina y propone en vez de actuar.',
  en: 'An agent that answers with the shop’s own data, never guesses, and proposes instead of acting.',
}

/** Portada: el título centrado, la frase debajo, los datos a un lado y una línea donde una pregunta pasa por Clipper. */
export function ClipperCover() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(true)

  useEffect(() => {
    const el = ref.current
    if (!el || reducedMotion) return
    let tl: gsap.core.Timeline | null = null
    const ctx = gsap.context(() => {
      gsap.set('[data-clp-c]', { autoAlpha: 0, scale: 0.2, filter: 'blur(14px)' })
      gsap.set('[data-clp-ring]', { autoAlpha: 0, scale: 0.3 })
      gsap.set('[data-clp-letter]', { autoAlpha: 0, xPercent: -60, filter: 'blur(10px)' })
      gsap.set('[data-hero-fade]', { autoAlpha: 0, y: 20 })
      gsap.set('[data-hero-stage]', { autoAlpha: 0, scale: 0.95, y: 30, filter: 'blur(12px)' })
    }, el)
    const build = ({ seeded }: PageRevealInfo) => {
      ctx.add(() => {
        tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
        if (seeded) {
          tl.set('[data-clp-ring]', { autoAlpha: 0.9, scale: 1 }, 0)
            .fromTo('[data-clp-c]', { scale: 0.7 }, { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 0.8 }, 0)
            .to('[data-clp-ring]', { autoAlpha: 0, scale: 2.6, duration: 1.1, ease: 'power2.out' }, 0.35)
        } else {
          tl.to('[data-clp-c]', { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 1.1 }, 0)
            .to('[data-clp-ring]', { autoAlpha: 0.9, scale: 1, duration: 0.5, ease: 'power2.out' }, 0.15)
            .to('[data-clp-ring]', { autoAlpha: 0, scale: 2.6, duration: 1.1, ease: 'power2.out' }, 0.6)
        }
        tl.to('[data-clp-letter]', { autoAlpha: 1, xPercent: 0, filter: 'blur(0px)', duration: 0.9, stagger: 0.05 }, 0.55)
          .to('[data-hero-fade]', { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.06 }, 1.05)
          .to('[data-hero-stage]', { autoAlpha: 1, scale: 1, y: 0, filter: 'blur(0px)', duration: 1.4, clearProps: 'filter' }, 1.2)
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

  const title = t(CLIPPER_CASE.title)

  return (
    <ToneSection tone="dark" className="relative px-[var(--gutter)] pb-24 pt-32">
      <div ref={ref}>
        <div className="relative mb-14 flex flex-wrap items-center justify-between gap-x-6 gap-y-2" data-hero-fade>
          <TransitionLink href="/proyectos/barberlytics" transitionLabel="Barberlytics" className="mono-label opacity-60 hover:opacity-100">
            ← Barberlytics
          </TransitionLink>
          <span className="mono-label opacity-60">{t(CLIPPER_CASE.eyebrow)}</span>
        </div>

        <div className="relative grid gap-12 lg:grid-cols-[minmax(0,13rem)_minmax(0,1fr)_minmax(0,13rem)] lg:items-center">
          <CaseMeta
            className="order-last lg:order-first"
            items={CLIPPER_CASE.meta.map((m) => ({ label: t(m.label), value: t(m.value) }))}
            tools={CLIPPER_CASE.tools}
            fullClassName="grid-cols-1 gap-y-5 border-l border-fg/15 pl-5"
          />
          <div className="min-w-0">
            <div className="relative flex flex-col items-center text-center">
              <h1 className="text-[clamp(3.4rem,1rem+9vw,11rem)] font-light leading-[0.88] tracking-tight">
                {/* La portada se arma desde la «C», como una neurona que se enciende; luego el resto */}
                <span className="sr-only">{title}</span>
                <span aria-hidden="true" className="inline-flex pb-[0.08em] align-bottom">
                  <span className="relative inline-block">
                    <span data-clp-ring data-transition-target className="pointer-events-none absolute left-1/2 top-[55%] aspect-square w-[1.15em] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#f0ce86]/70 shadow-[0_0_30px_6px_rgb(222_140_58/0.5),inset_0_0_20px_rgb(46_156_176/0.4)]" />
                    <span data-clp-c className="relative inline-block bg-gradient-to-br from-[#f0ce86] via-[#de8c3a] to-[#3f72d8] bg-clip-text text-transparent">{title.slice(0, 1)}</span>
                  </span>
                  {Array.from(title.slice(1)).map((letter, i) => (
                    <span key={i} data-clp-letter className="inline-block">{letter}</span>
                  ))}
                </span>
              </h1>
              <p data-hero-fade className="mt-6 max-w-2xl text-balance text-lg leading-relaxed opacity-80">{t(TAGLINE)}</p>
            </div>

            <div data-hero-stage className="relative mt-16">
              <HeroLine running={inView} reducedMotion={reducedMotion} />
            </div>
          </div>
          <span aria-hidden="true" className="hidden lg:block" />
        </div>
      </div>
    </ToneSection>
  )
}

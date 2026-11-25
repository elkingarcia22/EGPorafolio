'use client'

import { useEffect, useRef, useState } from 'react'
import { ToneSection } from '@/components/ui/tone-section'
import { TransitionLink, onPageReveal, type PageRevealInfo } from '@/components/transition/page-transition'
import { gsap } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'
import { THEMA_CASE } from '@/lib/content/cases/barberlytics/thema-case'
import { HeroRibbon } from './hero-ribbon'

/** Portada: el título centrado, la frase debajo, los datos a un lado y una cinta donde un color se vuelve tema. */
export function ThemaHero() {
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
      gsap.set('[data-th-first]', { autoAlpha: 0, scale: 0.2, filter: 'blur(14px)' })
      gsap.set('[data-th-ring]', { autoAlpha: 0, scale: 0.3 })
      gsap.set('[data-th-letter]', { autoAlpha: 0, xPercent: -60, filter: 'blur(10px)' })
      gsap.set('[data-hero-fade]', { autoAlpha: 0, y: 20 })
      gsap.set('[data-hero-stage]', { autoAlpha: 0, scale: 0.95, y: 30, filter: 'blur(12px)' })
    }, el)
    const build = ({ seeded }: PageRevealInfo) => {
      ctx.add(() => {
        tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
        if (seeded) {
          // La última neurona de la carga llegó como anillo: dentro se enciende la «T»…
          tl.set('[data-th-ring]', { autoAlpha: 0.9, scale: 1 }, 0)
            .fromTo('[data-th-first]', { scale: 0.7 }, { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 0.8 }, 0)
            .to('[data-th-ring]', { autoAlpha: 0, scale: 2.6, duration: 1.1, ease: 'power2.out' }, 0.35)
        } else {
          tl.to('[data-th-first]', { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 1.1 }, 0)
            .to('[data-th-ring]', { autoAlpha: 0.9, scale: 1, duration: 0.5, ease: 'power2.out' }, 0.15)
            .to('[data-th-ring]', { autoAlpha: 0, scale: 2.6, duration: 1.1, ease: 'power2.out' }, 0.6)
        }
        tl
          // …de ella brotan las demás letras…
          .to('[data-th-letter]', { autoAlpha: 1, xPercent: 0, filter: 'blur(0px)', duration: 0.9, stagger: 0.06 }, 0.55)
          // …y después la frase, los datos y la cinta en vivo.
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

  const title = t(THEMA_CASE.title)

  return (
    <ToneSection tone="dark" className="relative px-[var(--gutter)] pb-24 pt-32">
      <div ref={ref}>
        <div className="pointer-events-none absolute left-1/2 top-[30%] h-[44vw] max-h-[640px] w-[70vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(217,179,106,0.10),transparent)]" aria-hidden="true" />

        <div className="relative mb-14 flex flex-wrap items-center justify-between gap-x-6 gap-y-2" data-hero-fade>
          <TransitionLink href="/proyectos/barberlytics" transitionLabel="Barberlytics" className="mono-label opacity-60 hover:opacity-100">
            ← Barberlytics
          </TransitionLink>
          <span className="mono-label opacity-60">{THEMA_CASE.index} / 04 · {t(THEMA_CASE.eyebrow)}</span>
        </div>

        {/* Centro: título, frase y la cinta. A un lado, los datos del proyecto en columna */}
        <div className="relative grid gap-12 lg:grid-cols-[minmax(0,13rem)_minmax(0,1fr)_minmax(0,13rem)] lg:items-center">
          <dl className="order-last grid grid-cols-2 gap-x-6 gap-y-5 border-t border-fg/15 pt-8 sm:grid-cols-3 lg:order-first lg:grid-cols-1 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
            {THEMA_CASE.meta.map((m) => (
              <div key={m.label.es} data-hero-fade>
                <dt className="mono-label mb-1 opacity-50">{t(m.label)}</dt>
                <dd className="text-[13px] leading-snug">{t(m.value)}</dd>
              </div>
            ))}
            <div data-hero-fade className="col-span-2 sm:col-span-1">
              <dt className="mono-label mb-2 opacity-50">{t(COPY.case.tools)}</dt>
              <dd className="flex flex-wrap gap-1.5">
                {THEMA_CASE.tools.map((tool) => (
                  <span key={tool} className="rounded-full border border-fg/20 px-2 py-0.5 text-[11px]">{tool}</span>
                ))}
              </dd>
            </div>
          </dl>
          <div className="min-w-0">
            <div className="relative flex flex-col items-center text-center">
              <h1 className="text-[clamp(3.4rem,1rem+9vw,11rem)] font-light leading-[0.88] tracking-tight">
                {/* La portada se arma desde la «T»: primero ella, como una neurona; luego el resto */}
                <span className="sr-only">{title}</span>
                <span aria-hidden="true" className="inline-flex pb-[0.08em] align-bottom">
                  <span className="relative inline-block">
                    <span data-th-ring data-transition-target className="pointer-events-none absolute left-1/2 top-[55%] aspect-square w-[1.15em] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/70 shadow-[0_0_30px_6px_rgb(var(--signal)/0.55),inset_0_0_20px_rgb(var(--signal)/0.4)]" />
                    <span data-th-first className="relative inline-block [text-shadow:0_0_40px_rgb(var(--signal)/0.6)]">{title.slice(0, 1)}</span>
                  </span>
                  {Array.from(title.slice(1)).map((letter, i) => (
                    <span key={i} data-th-letter className="inline-block">{letter}</span>
                  ))}
                </span>
              </h1>
              <p data-hero-fade className="mt-6 max-w-2xl text-balance text-lg leading-relaxed opacity-80">{t(THEMA_CASE.tagline)}</p>
            </div>

            <div data-hero-stage className="relative mt-16">
              <HeroRibbon running={inView} reducedMotion={reducedMotion} />
            </div>
          </div>
          <span aria-hidden="true" className="hidden lg:block" />
        </div>
      </div>
    </ToneSection>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'
import { ToneSection } from '@/components/ui/tone-section'
import { TransitionLink, onPageReveal, type PageRevealInfo } from '@/components/transition/page-transition'
import { gsap } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { PLATFORM_CASE } from '@/lib/content/cases/barberlytics/platform-case'
import { VisitLine } from './visit-line'
import { CaseMeta } from '@/components/case/case-meta'

/** Portada: el título centrado, la frase debajo y una sola línea por la que una cita va de agendada a cobrada. */
export function PlatformHero() {
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
      gsap.set('[data-pl-first]', { autoAlpha: 0, scale: 0.2, filter: 'blur(14px)' })
      gsap.set('[data-pl-ring]', { autoAlpha: 0, scale: 0.3 })
      gsap.set('[data-pl-letter]', { autoAlpha: 0, xPercent: -60, filter: 'blur(10px)' })
      gsap.set('[data-hero-fade]', { autoAlpha: 0, y: 20 })
      gsap.set('[data-hero-stage]', { autoAlpha: 0, scale: 0.95, y: 30, filter: 'blur(12px)' })
    }, el)
    const build = ({ seeded }: PageRevealInfo) => {
      ctx.add(() => {
        tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
        if (seeded) {
          // 1 · La última neurona de la carga llegó como anillo: dentro se enciende la «P»…
          tl.set('[data-pl-ring]', { autoAlpha: 0.9, scale: 1 }, 0)
            .fromTo('[data-pl-first]', { scale: 0.7 }, { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 0.8 }, 0)
            .to('[data-pl-ring]', { autoAlpha: 0, scale: 2.6, duration: 1.1, ease: 'power2.out' }, 0.35)
        } else {
          tl.to('[data-pl-first]', { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 1.1 }, 0)
            .to('[data-pl-ring]', { autoAlpha: 0.9, scale: 1, duration: 0.5, ease: 'power2.out' }, 0.15)
            .to('[data-pl-ring]', { autoAlpha: 0, scale: 2.6, duration: 1.1, ease: 'power2.out' }, 0.6)
        }
        tl
          // 2 · …de ella brotan las demás letras…
          .to('[data-pl-letter]', { autoAlpha: 1, xPercent: 0, filter: 'blur(0px)', duration: 0.9, stagger: 0.045 }, 0.55)
          // 3 · …y después lo que la rodea: la frase, los datos y la línea de la cita.
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

  const title = t(PLATFORM_CASE.title)

  return (
    <ToneSection tone="dark" className="relative px-[var(--gutter)] pb-24 pt-32">
      <div ref={ref}>
        <div className="pointer-events-none absolute left-1/2 top-[30%] h-[44vw] max-h-[640px] w-[70vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(217,179,106,0.08),transparent)]" aria-hidden="true" />

        <div className="relative mb-14 flex flex-wrap items-center justify-between gap-x-6 gap-y-2" data-hero-fade>
          <TransitionLink href="/proyectos/barberlytics" transitionLabel="Barberlytics" className="mono-label opacity-60 hover:opacity-100">
            ← Barberlytics
          </TransitionLink>
          <span className="mono-label opacity-60">{t(PLATFORM_CASE.eyebrow)}</span>
        </div>

        {/* Centro: título, frase y la línea. A un lado, los datos del proyecto en columna */}
        <div className="relative grid gap-12 lg:grid-cols-[minmax(0,13rem)_minmax(0,1fr)_minmax(0,13rem)] lg:items-center">
          <CaseMeta
            className="order-last lg:order-first"
            items={PLATFORM_CASE.meta.map((m) => ({ label: t(m.label), value: t(m.value) }))}
            tools={PLATFORM_CASE.tools}
            fullClassName="grid-cols-1 gap-y-5 border-l border-fg/15 pl-5"
          />
          <div className="min-w-0">
            <div className="relative flex flex-col items-center text-center">
              <h1 className="text-[clamp(3rem,0.6rem+8.6vw,10.5rem)] font-light leading-[0.88] tracking-tight">
                {/* La portada se arma desde la «P»: primero ella, como una neurona; luego el resto */}
                <span className="sr-only">{title}</span>
                <span aria-hidden="true" className="inline-flex pb-[0.08em] align-bottom">
                  <span className="relative inline-block">
                    <span data-pl-ring data-transition-target className="pointer-events-none absolute left-1/2 top-[55%] aspect-square w-[1.15em] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/70 shadow-[0_0_30px_6px_rgb(var(--signal)/0.55),inset_0_0_20px_rgb(var(--signal)/0.4)]" />
                    <span data-pl-first className="relative inline-block [text-shadow:0_0_40px_rgb(var(--signal)/0.6)]">{title.slice(0, 1)}</span>
                  </span>
                  {Array.from(title.slice(1)).map((letter, i) => (
                    <span key={i} data-pl-letter className="inline-block">{letter}</span>
                  ))}
                </span>
              </h1>
              <p data-hero-fade className="mt-6 max-w-2xl text-balance text-lg leading-relaxed opacity-80">{t(PLATFORM_CASE.tagline)}</p>
            </div>

            <div data-hero-stage className="relative mt-14">
              <VisitLine running={inView} reducedMotion={reducedMotion} />
            </div>
          </div>
          <span aria-hidden="true" className="hidden lg:block" />
        </div>
      </div>
    </ToneSection>
  )
}

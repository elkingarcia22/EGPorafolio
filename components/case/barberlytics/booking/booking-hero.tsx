'use client'

import { useEffect, useRef, useState } from 'react'
import { ToneSection } from '@/components/ui/tone-section'
import { TransitionLink, onPageReveal } from '@/components/transition/page-transition'
import { gsap } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'
import { BOOKING_CASE } from '@/lib/content/cases/barberlytics/booking-case'
import { CoverTap } from './cover-tap'

/** Portada del caso Reserva: título centrado, la frase debajo, los datos a un lado y el recorrido de un toque. */
export function BookingHero() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(true)

  useEffect(() => {
    const el = ref.current
    if (!el || reducedMotion) return
    let tl: gsap.core.Timeline | null = null
    const ctx = gsap.context(() => {
      gsap.set('[data-bk-word]', { autoAlpha: 0, yPercent: 60, filter: 'blur(10px)' })
      gsap.set('[data-hero-fade]', { autoAlpha: 0, y: 20 })
      gsap.set('[data-hero-stage]', { autoAlpha: 0, x: -40, filter: 'blur(12px)' })
    }, el)
    const build = () => {
      ctx.add(() => {
        tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
          // Las palabras suben una tras otra; luego la frase, los datos y el recorrido entra de lado.
          .to('[data-bk-word]', { autoAlpha: 1, yPercent: 0, filter: 'blur(0px)', duration: 1.1, stagger: 0.09 }, 0.1)
          .to('[data-hero-fade]', { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.06 }, 0.6)
          .to('[data-hero-stage]', { autoAlpha: 1, x: 0, filter: 'blur(0px)', duration: 1.3, clearProps: 'filter' }, 0.8)
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

  const words = t(BOOKING_CASE.title).split(' ')

  return (
    <ToneSection tone="dark" className="relative px-[var(--gutter)] pb-24 pt-32">
      <div ref={ref}>
        <div className="pointer-events-none absolute left-1/2 top-[30%] h-[44vw] max-h-[640px] w-[70vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(var(--bk)/0.10),transparent)]" aria-hidden="true" />

        <div className="relative mb-14 flex flex-wrap items-center justify-between gap-x-6 gap-y-2" data-hero-fade>
          <TransitionLink href="/proyectos/barberlytics" transitionLabel="Barberlytics" className="mono-label opacity-60 hover:opacity-100">
            ← Barberlytics
          </TransitionLink>
          <span className="mono-label opacity-60">{BOOKING_CASE.index} / 04 · {t(BOOKING_CASE.eyebrow)}</span>
        </div>

        <div className="relative grid gap-12 lg:grid-cols-[minmax(0,13rem)_minmax(0,1fr)_minmax(0,13rem)] lg:items-center">
          <dl className="order-last grid grid-cols-2 gap-x-6 gap-y-5 border-t border-fg/15 pt-8 sm:grid-cols-3 lg:order-first lg:grid-cols-1 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
            {BOOKING_CASE.meta.map((m) => (
              <div key={m.label.es} data-hero-fade>
                <dt className="mono-label mb-1 opacity-50">{t(m.label)}</dt>
                <dd className="text-[13px] leading-snug">{t(m.value)}</dd>
              </div>
            ))}
            <div data-hero-fade className="col-span-2 sm:col-span-1">
              <dt className="mono-label mb-2 opacity-50">{t(COPY.case.tools)}</dt>
              <dd className="flex flex-wrap gap-1.5">
                {BOOKING_CASE.tools.map((tool) => (
                  <span key={tool} className="rounded-full border border-fg/20 px-2 py-0.5 text-[11px]">{tool}</span>
                ))}
              </dd>
            </div>
          </dl>

          <div className="min-w-0">
            <div className="relative flex flex-col items-center text-center">
              <h1 className="text-[clamp(3.2rem,1rem+8vw,10rem)] font-light leading-[0.9] tracking-tight">
                {words.map((word, i) => (
                  <span key={`${word}-${i}`} data-bk-word className="inline-block pb-[0.08em]">
                    {word}
                    {i < words.length - 1 && ' '}
                  </span>
                ))}
              </h1>
              <p data-hero-fade className="mt-6 max-w-2xl text-balance text-lg leading-relaxed opacity-80">{t(BOOKING_CASE.tagline)}</p>
            </div>
            <div data-hero-stage className="relative mt-16">
              <CoverTap running={inView} reducedMotion={reducedMotion} />
            </div>
          </div>
          <span aria-hidden="true" className="hidden lg:block" />
        </div>
      </div>
    </ToneSection>
  )
}

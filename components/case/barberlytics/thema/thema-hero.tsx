'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { ToneSection } from '@/components/ui/tone-section'
import { TransitionLink } from '@/components/transition/page-transition'
import { gsap } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'
import { THEMA_CASE } from '@/lib/content/cases/barberlytics/thema-case'
import { ThemeShowcase } from './theme-showcase'

/** Componentes que flotan alrededor del navegador, cada uno a su profundidad. */
const FLOATING = [
  { id: 'kpi-card', w: 1400, h: 669, cls: 'left-[-2%] top-[4%] w-[30%] md:w-[24%]', depth: 0.5, tilt: 'perspective(1200px) rotateY(20deg) rotateZ(-4deg)' },
  { id: 'day-strip', w: 1400, h: 409, cls: 'left-[2%] bottom-[8%] hidden w-[26%] md:block', depth: 0.8, tilt: 'perspective(1200px) rotateY(16deg) rotateZ(3deg)' },
  { id: 'ticket-card', w: 1400, h: 415, cls: 'right-[-2%] top-[10%] w-[32%] md:w-[25%]', depth: 0.65, tilt: 'perspective(1200px) rotateY(-20deg) rotateZ(4deg)' },
  { id: 'donut-chart', w: 1400, h: 685, cls: 'right-[0%] bottom-[-10%] hidden w-[20%] md:block', depth: 0.9, tilt: 'perspective(1200px) rotateY(-14deg) rotateZ(-3deg)' },
] as const

/** Portada del caso Thema: el sistema cambiando de tema, rodeado de sus piezas. */
export function ThemaHero() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || reducedMotion) return
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'expo.out' } })
        .from('[data-hero-word]', { yPercent: 115, duration: 1.3 }, 0.15)
        .from('[data-hero-fade]', { autoAlpha: 0, y: 24, duration: 1, stagger: 0.06 }, 0.45)
        .from('[data-hero-main]', { autoAlpha: 0, y: 160, rotateX: 24, transformPerspective: 1400, duration: 1.7 }, 0.4)
        .from('[data-hero-float]', { autoAlpha: 0, scale: 0.6, y: 60, duration: 1.2, stagger: 0.12, ease: 'back.out(1.4)' }, 0.9)
      gsap.utils.toArray<HTMLElement>('[data-hero-float]').forEach((card, i) => {
        gsap.to(card, { y: -12, duration: 2.6 + i * 0.4, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2 + i * 0.2 })
      })
      gsap.utils.toArray<HTMLElement>('[data-depth]').forEach((layer) => {
        gsap.to(layer, {
          yPercent: -Number(layer.dataset.depth) * 40,
          ease: 'none',
          scrollTrigger: { trigger: '[data-hero-stage]', start: 'top bottom', end: 'bottom top', scrub: true },
        })
      })
    }, el)
    return () => ctx.revert()
  }, [reducedMotion])

  return (
    <ToneSection tone="dark" className="relative overflow-hidden px-[var(--gutter)] pb-24 pt-32">
      <div ref={ref}>
        <div className="pointer-events-none absolute left-1/2 top-[45%] h-[70vw] max-h-[1100px] w-[95vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(217,179,106,0.22),rgba(63,114,216,0.1)_55%,transparent)]" aria-hidden="true" />

        <div className="relative mb-14 flex flex-wrap items-center justify-between gap-x-6 gap-y-2" data-hero-fade>
          <TransitionLink href="/proyectos/barberlytics" transitionLabel="Barberlytics" className="mono-label opacity-60 hover:opacity-100">
            ← Barberlytics
          </TransitionLink>
          <span className="mono-label opacity-60">{THEMA_CASE.index} / 04 · {t(THEMA_CASE.eyebrow)}</span>
        </div>

        <div className="relative grid items-end gap-8 md:grid-cols-12">
          <h1 className="overflow-hidden text-[clamp(4rem,1rem+12vw,13rem)] font-light leading-[0.85] tracking-tight md:col-span-7">
            <span data-hero-word className="inline-block">{t(THEMA_CASE.title)}</span>
          </h1>
          <p data-hero-fade className="text-lg leading-relaxed opacity-85 md:col-span-5">{t(THEMA_CASE.tagline)}</p>
        </div>

        <div data-hero-stage className="relative mx-auto mt-14 max-w-6xl">
          <div data-depth="0.15" className="relative z-10 mx-auto w-[86%] md:w-[66%]">
            <div data-hero-main>
              <ThemeShowcase auto tilt="perspective(1600px) rotateX(10deg)" sizes="(min-width: 768px) 60vw, 86vw" />
            </div>
          </div>
          {FLOATING.map((f) => (
            <div key={f.id} data-depth={f.depth} className={`absolute z-20 ${f.cls}`}>
              <div data-hero-float>
                <div style={{ transform: f.tilt }} className="overflow-hidden rounded-xl shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)] ring-1 ring-white/10">
                  <Image src={`/cases/barberlytics/comp-${f.id}.webp`} width={f.w} height={f.h} alt="" sizes="(min-width: 768px) 25vw, 33vw" className="block h-auto w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <dl className="relative mt-16 grid grid-cols-2 gap-6 border-t border-fg/15 pt-8 md:grid-cols-5">
          {THEMA_CASE.meta.map((m) => (
            <div key={m.label.es} data-hero-fade>
              <dt className="mono-label mb-1 opacity-50">{t(m.label)}</dt>
              <dd className="text-sm leading-relaxed">{t(m.value)}</dd>
            </div>
          ))}
          <div data-hero-fade className="col-span-2 md:col-span-1">
            <dt className="mono-label mb-2 opacity-50">{t(COPY.case.tools)}</dt>
            <dd className="flex flex-wrap gap-1.5">
              {THEMA_CASE.tools.map((tool) => (
                <span key={tool} className="border border-fg/25 px-2 py-0.5 text-[11px]">{tool}</span>
              ))}
            </dd>
          </div>
        </dl>
      </div>
    </ToneSection>
  )
}

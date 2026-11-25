'use client'

import { useEffect, useRef, useState } from 'react'
import { ToneSection } from '@/components/ui/tone-section'
import { TransitionLink, onPageReveal, type PageRevealInfo } from '@/components/transition/page-transition'
import { gsap } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'
import { ENCUESTAS_CASE } from '@/lib/content/cases/encuestas/case'
import { ENC } from '@/lib/content/cases/encuestas/chapters'
import { EncHeroBranch } from './enc-hero-branch'

/** Portada: el título centrado, la frase debajo y una sola rama; los datos del proyecto a un lado. */
export function EncHero() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(true)

  useEffect(() => {
    const el = ref.current
    if (!el || reducedMotion) return
    let tl: gsap.core.Timeline | null = null
    const ctx = gsap.context(() => {
      gsap.set('[data-enc-e]', { autoAlpha: 0, scale: 0.2, filter: 'blur(14px)' })
      gsap.set('[data-enc-ring]', { autoAlpha: 0, scale: 0.3 })
      gsap.set('[data-enc-letter]', { autoAlpha: 0, xPercent: -60, filter: 'blur(10px)' })
      gsap.set('[data-hero-fade]', { autoAlpha: 0, y: 20 })
      gsap.set('[data-hero-stage]', { autoAlpha: 0, scale: 0.95, y: 30, filter: 'blur(12px)' })
    }, el)
    const build = ({ seeded }: PageRevealInfo) => {
      ctx.add(() => {
        tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
        if (seeded) {
          tl.set('[data-enc-ring]', { autoAlpha: 0.9, scale: 1 }, 0)
            .fromTo('[data-enc-e]', { scale: 0.7 }, { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 0.8 }, 0)
            .to('[data-enc-ring]', { autoAlpha: 0, scale: 2.6, duration: 1.1, ease: 'power2.out' }, 0.35)
        } else {
          tl.to('[data-enc-e]', { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 1.1 }, 0)
            .to('[data-enc-ring]', { autoAlpha: 0.9, scale: 1, duration: 0.5, ease: 'power2.out' }, 0.15)
            .to('[data-enc-ring]', { autoAlpha: 0, scale: 2.6, duration: 1.1, ease: 'power2.out' }, 0.6)
        }
        tl.to('[data-enc-letter]', { autoAlpha: 1, xPercent: 0, filter: 'blur(0px)', duration: 0.9, stagger: 0.03 }, 0.55)
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

  const title = t(ENCUESTAS_CASE.title)
  const words = title.split(' ')

  return (
    <ToneSection tone="dark" className="relative px-[var(--gutter)] pb-24 pt-32">
      <div ref={ref}>
        <div className="pointer-events-none absolute left-1/2 top-[30%] h-[44vw] max-h-[640px] w-[70vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(var(--signal)/0.10),transparent)]" aria-hidden="true" />

        <div className="relative mb-14 flex flex-wrap items-center justify-between gap-x-6 gap-y-2" data-hero-fade>
          <TransitionLink href="/#work" transitionLabel={t({ es: 'Trabajo', en: 'Work' })} className="mono-label opacity-60 hover:opacity-100">
            ← {t({ es: 'Proyectos', en: 'Projects' })}
          </TransitionLink>
          <span className="mono-label opacity-60">{t(ENCUESTAS_CASE.eyebrow)}</span>
        </div>

        <div className="relative grid gap-12 lg:grid-cols-[minmax(0,13rem)_minmax(0,1fr)_minmax(0,13rem)] lg:items-center">
          <dl className="order-last grid grid-cols-2 gap-x-6 gap-y-5 border-t border-fg/15 pt-8 sm:grid-cols-3 lg:order-first lg:grid-cols-1 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
            {ENC.meta.map((m) => (
              <div key={m.label.es} data-hero-fade>
                <dt className="mono-label mb-1 opacity-50">{t(m.label)}</dt>
                <dd className="text-[13px] leading-snug">{t(m.value)}</dd>
              </div>
            ))}
            <div data-hero-fade className="col-span-2 sm:col-span-1">
              <dt className="mono-label mb-2 opacity-50">{t(COPY.case.tools)}</dt>
              <dd className="flex flex-wrap gap-1.5">
                {ENC.tools.map((tool) => (
                  <span key={tool} className="rounded-full border border-fg/20 px-2 py-0.5 text-[11px]">{tool}</span>
                ))}
              </dd>
            </div>
          </dl>
          <div className="min-w-0">
            <div className="relative flex flex-col items-center text-center">
              <h1 className="text-[clamp(2.9rem,1rem+6vw,7.6rem)] font-light leading-[0.92] tracking-tight">
                <span className="sr-only">{title}</span>
                {/* Se arma desde la «E»: primero ella, como una neurona que se enciende; luego el resto */}
                <span aria-hidden="true" className="inline-flex flex-wrap justify-center gap-x-[0.28em] pb-[0.08em]">
                  {words.map((word, w) => (
                    <span key={w} className="inline-flex">
                      {Array.from(word).map((letter, i) =>
                        w === 0 && i === 0 ? (
                          <span key={i} className="relative inline-block">
                            <span data-enc-ring data-transition-target className="pointer-events-none absolute left-1/2 top-[55%] aspect-square w-[1.15em] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/70 shadow-[0_0_30px_6px_rgb(var(--signal)/0.55),inset_0_0_20px_rgb(var(--signal)/0.4)]" />
                            <span data-enc-e className="relative inline-block [text-shadow:0_0_40px_rgb(var(--signal)/0.6)]">{letter}</span>
                          </span>
                        ) : (
                          <span key={i} data-enc-letter className="inline-block">{letter}</span>
                        ),
                      )}
                    </span>
                  ))}
                </span>
              </h1>
              <p data-hero-fade className="mt-6 max-w-2xl text-balance text-lg leading-relaxed opacity-80">{t(ENC.tagline)}</p>
            </div>

            <div data-hero-stage className="relative mt-16">
              <EncHeroBranch running={inView} reducedMotion={reducedMotion} />
            </div>
          </div>
          <span aria-hidden="true" className="hidden lg:block" />
        </div>
      </div>
    </ToneSection>
  )
}

'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { ToneSection } from '@/components/ui/tone-section'
import { TransitionLink } from '@/components/transition/page-transition'
import { gsap } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'
import { PLATFORM_CASE } from '@/lib/content/cases/barberlytics/platform-case'
import type { CaseImage } from '@/lib/content/cases/barberlytics/types'

/** Pantalla de la composición: marco oscuro y la captura real. */
function Screen({ image, sizes, priority = false }: { image: CaseImage; sizes: string; priority?: boolean }) {
  const { t } = useLocale()
  return (
    <div className="overflow-hidden rounded-[12px] bg-[#0b0c0e] p-[6px] shadow-[0_60px_120px_-40px_rgba(0,0,0,0.9),inset_0_0_0_1.5px_rgba(255,255,255,0.12)]">
      <Image src={image.src} width={image.width} height={image.height} alt={t(image.alt)} sizes={sizes} className="block h-auto w-full rounded-[7px]" priority={priority} />
    </div>
  )
}

/** Los cinco roles, como las «puertas» que flotan sobre la plataforma. */
const ROLE_CHIPS = [
  { es: 'Dueño', en: 'Owner', pos: 'left-[1%] top-[2%]' },
  { es: 'Administrador', en: 'Manager', pos: 'left-[22%] -top-[4%] hidden md:flex' },
  { es: 'Recepción', en: 'Front desk', pos: 'right-[24%] -top-[3%] hidden md:flex' },
  { es: 'Barbero por comisión', en: 'Commission barber', pos: 'right-[1%] top-[8%]' },
  { es: 'Barbero de renta', en: 'Chair-rent barber', pos: 'bottom-[8%] right-[4%]' },
] as const

/** Portada del caso Plataforma: tres pantallas reales en profundidad y los cinco roles. */
export function PlatformHero() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const ref = useRef<HTMLDivElement>(null)
  const roles = PLATFORM_CASE.roles

  useEffect(() => {
    const el = ref.current
    if (!el || reducedMotion) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      tl.from('[data-hero-word]', { yPercent: 115, duration: 1.3, stagger: 0.08 }, 0.15)
        .from('[data-hero-fade]', { autoAlpha: 0, y: 24, duration: 1, stagger: 0.06 }, 0.45)
        .from('[data-hero-device]', { autoAlpha: 0, y: 180, rotateX: 26, transformPerspective: 1600, duration: 1.7, stagger: 0.14 }, 0.4)
        .from('[data-hero-glow]', { autoAlpha: 0, scale: 0.7, duration: 2.2, ease: 'power2.out' }, 0.3)
        .from('[data-hero-chip]', { autoAlpha: 0, scale: 0.5, duration: 0.8, stagger: 0.1, ease: 'back.out(1.8)' }, 1.1)

      gsap.utils.toArray<HTMLElement>('[data-hero-chip]').forEach((chip, i) => {
        gsap.to(chip, { y: -10, duration: 2.4 + i * 0.3, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.8 + i * 0.2 })
      })
      gsap.utils.toArray<HTMLElement>('[data-depth]').forEach((layer) => {
        gsap.to(layer, {
          yPercent: -Number(layer.dataset.depth) * 35,
          ease: 'none',
          scrollTrigger: { trigger: '[data-hero-stage]', start: 'top bottom', end: 'bottom top', scrub: true },
        })
      })
    }, el)
    return () => ctx.revert()
  }, [reducedMotion])

  const words = t(PLATFORM_CASE.title).split(' ')

  return (
    <ToneSection tone="dark" className="relative overflow-hidden px-[var(--gutter)] pb-24 pt-32">
      <div ref={ref}>
        <div data-hero-glow className="pointer-events-none absolute left-1/2 top-[52%] h-[70vw] max-h-[1100px] w-[95vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(217,179,106,0.26),rgba(63,114,216,0.1)_55%,transparent)]" aria-hidden="true" />

        <div className="relative mb-14 flex flex-wrap items-center justify-between gap-x-6 gap-y-2" data-hero-fade>
          <TransitionLink href="/proyectos/barberlytics" transitionLabel="Barberlytics" className="mono-label opacity-60 hover:opacity-100">
            ← Barberlytics
          </TransitionLink>
          <span className="mono-label opacity-60">{PLATFORM_CASE.index} / 04 · {t(PLATFORM_CASE.eyebrow)}</span>
        </div>

        <div className="relative grid items-end gap-8 md:grid-cols-12">
          <h1 className="text-[clamp(3.2rem,1rem+8vw,10rem)] font-light leading-[0.9] tracking-tight md:col-span-7">
            {words.map((word, i) => (
              <span key={`${word}-${i}`} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                <span data-hero-word className="inline-block">{word}&nbsp;</span>
              </span>
            ))}
          </h1>
          <p data-hero-fade className="text-lg leading-relaxed opacity-85 md:col-span-5">{t(PLATFORM_CASE.tagline)}</p>
        </div>

        <div data-hero-stage className="relative mx-auto mt-20 h-[clamp(260px,36vw,560px)] max-w-6xl [perspective:1600px]">
          <div data-depth="0.25" className="absolute left-0 top-[16%] z-10 hidden w-[40%] md:block">
            <div data-hero-device style={{ transform: 'rotateY(26deg) rotateX(8deg) rotateZ(-2deg)' }}>
              <Screen image={roles[0].image} sizes="40vw" />
            </div>
          </div>
          <div data-depth="0.4" className="absolute right-0 top-[20%] z-10 hidden w-[40%] md:block">
            <div data-hero-device style={{ transform: 'rotateY(-26deg) rotateX(8deg) rotateZ(2deg)' }}>
              <Screen image={roles[3].image} sizes="40vw" />
            </div>
          </div>
          <div data-depth="0.1" className="absolute left-1/2 top-0 z-20 w-full -translate-x-1/2 md:w-[62%]">
            <div data-hero-device style={{ transform: 'rotateX(10deg)' }}>
              <Screen image={roles[1].image} sizes="(min-width: 768px) 62vw, 100vw" priority />
            </div>
          </div>

          {ROLE_CHIPS.map((chip) => (
            <span key={chip.es} data-hero-chip className={`absolute z-30 flex items-center gap-2 whitespace-nowrap border border-paper/15 bg-void/75 px-3.5 py-2 text-xs text-paper backdrop-blur-md ${chip.pos}`}>
              <span className="h-1.5 w-1.5 rounded-full bg-[#d9b36a]" aria-hidden="true" />
              {t(chip)}
            </span>
          ))}
          <span data-hero-chip className="absolute bottom-[4%] left-[3%] z-30 flex items-center gap-2 whitespace-nowrap border border-paper/15 bg-void/75 px-3.5 py-2 text-xs text-paper backdrop-blur-md">
            {t({ es: 'Entra como cada rol, al final ↓', en: 'Enter as each role, at the end ↓' })}
          </span>
        </div>

        <dl className="relative mt-16 grid grid-cols-2 gap-6 border-t border-fg/15 pt-8 md:grid-cols-5">
          {PLATFORM_CASE.meta.map((m) => (
            <div key={m.label.es} data-hero-fade>
              <dt className="mono-label mb-1 opacity-50">{t(m.label)}</dt>
              <dd className="text-sm leading-relaxed">{t(m.value)}</dd>
            </div>
          ))}
          <div data-hero-fade className="col-span-2 md:col-span-1">
            <dt className="mono-label mb-2 opacity-50">{t(COPY.case.tools)}</dt>
            <dd className="flex flex-wrap gap-1.5">
              {PLATFORM_CASE.tools.map((tool) => (
                <span key={tool} className="border border-fg/25 px-2 py-0.5 text-[11px]">{tool}</span>
              ))}
            </dd>
          </div>
        </dl>
      </div>
    </ToneSection>
  )
}

'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { ToneSection } from '@/components/ui/tone-section'
import { TransitionLink } from '@/components/transition/page-transition'
import { PhoneBody, StatusBar } from '@/components/case/kit/device'
import { gsap } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'
import { BOOKING_CASE } from '@/lib/content/cases/barberlytics/booking-case'
import { ClipperOrb } from '../clipper-orb'

const IMG = '/cases/barberlytics'

/** Etiqueta flotante de la composición. */
function Chip({ children, className }: { children: React.ReactNode; className: string }) {
  return (
    <span data-hero-chip className={`absolute z-30 flex items-center gap-2 whitespace-nowrap border border-paper/15 bg-void/75 px-3.5 py-2 text-xs text-paper backdrop-blur-md ${className}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-[#d9b36a]" aria-hidden="true" />
      {children}
    </span>
  )
}

/** Celular de la composición: el giro va por dentro para no chocar con las animaciones. */
function HeroPhone({ src, alt, tilt }: { src: string; alt: L; tilt: string }) {
  const { t } = useLocale()
  return (
    <div style={{ transform: tilt }}>
      <PhoneBody>
        <StatusBar />
        <Image src={src} width={780} height={1688} alt={t(alt)} sizes="(min-width: 768px) 18vw, 30vw" className="block h-auto w-full" priority />
      </PhoneBody>
    </div>
  )
}

/** Portada del caso Reserva: título, aparatos que flotan y profundidad al hacer scroll. */
export function BookingHero() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const ref = useRef<HTMLDivElement>(null)
  const title = t(BOOKING_CASE.title).split(' ')

  useEffect(() => {
    const el = ref.current
    if (!el || reducedMotion) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      tl.from('[data-hero-word]', { yPercent: 115, duration: 1.3, stagger: 0.08 }, 0.15)
        .from('[data-hero-fade]', { autoAlpha: 0, y: 24, duration: 1, stagger: 0.06 }, 0.45)
        .from('[data-hero-device]', { autoAlpha: 0, y: 180, rotateX: 28, transformPerspective: 1400, duration: 1.7, stagger: 0.14 }, 0.4)
        .from('[data-hero-glow]', { autoAlpha: 0, scale: 0.7, duration: 2.2, ease: 'power2.out' }, 0.3)
        .from('[data-hero-chip]', { autoAlpha: 0, scale: 0.5, duration: 0.8, stagger: 0.12, ease: 'back.out(1.8)' }, 1.1)

      // Las etiquetas flotan suave, cada una a su ritmo.
      gsap.utils.toArray<HTMLElement>('[data-hero-chip]').forEach((chip, i) => {
        gsap.to(chip, { y: -10, duration: 2.4 + i * 0.35, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.8 + i * 0.2 })
      })

      // Profundidad: cada aparato se mueve a su velocidad al hacer scroll.
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

  return (
    <ToneSection tone="dark" className="relative overflow-hidden px-[var(--gutter)] pb-24 pt-32">
      <div ref={ref}>
        <div data-hero-glow className="pointer-events-none absolute left-1/2 top-[48%] h-[70vw] max-h-[1100px] w-[90vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(217,179,106,0.28),rgba(46,156,176,0.08)_55%,transparent)]" aria-hidden="true" />

        <div className="relative mb-14 flex flex-wrap items-center justify-between gap-x-6 gap-y-2" data-hero-fade>
          <TransitionLink href="/proyectos/barberlytics" transitionLabel="Barberlytics" className="mono-label opacity-60 hover:opacity-100">
            ← Barberlytics
          </TransitionLink>
          <span className="mono-label opacity-60">{BOOKING_CASE.index} / 04 · {t(BOOKING_CASE.eyebrow)}</span>
        </div>

        <div className="relative grid items-end gap-8 md:grid-cols-12">
          <h1 className="text-[clamp(3.2rem,1rem+8vw,10rem)] font-light leading-[0.9] tracking-tight md:col-span-8">
            {title.map((word, i) => (
              <span key={`${word}-${i}`} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                <span data-hero-word className="inline-block">{word}&nbsp;</span>
              </span>
            ))}
          </h1>
          <p data-hero-fade className="text-lg leading-relaxed opacity-85 md:col-span-4">{t(BOOKING_CASE.tagline)}</p>
        </div>

        {/* Composición de aparatos */}
        <div data-hero-stage className="relative mx-auto mt-16 h-[clamp(380px,50vw,720px)] max-w-6xl [perspective:1400px]">
          <div data-depth="0.12" className="absolute left-1/2 top-[4%] z-10 w-[52%] -translate-x-1/2 md:w-[38%]">
            <div data-hero-device>
              <div style={{ transform: 'perspective(1400px) rotateX(12deg) rotateZ(-1.5deg)' }} className="rounded-[30px] bg-[#0b0c0e] p-[12px] shadow-[0_60px_120px_-40px_rgba(0,0,0,0.9),inset_0_0_0_1.5px_rgba(255,255,255,0.12)]">
                <div className="overflow-hidden rounded-[18px]">
                  <Image src={`${IMG}/surface-tablet.webp`} width={1200} height={1615} alt={t({ es: 'La reserva en una tablet: «Reserva tu cita».', en: 'Booking on a tablet: “Book your appointment”.' })} sizes="(min-width: 768px) 38vw, 52vw" className="block h-auto w-full" priority />
                </div>
              </div>
            </div>
          </div>

          <div data-depth="0.35" className="absolute left-[1%] top-[22%] z-20 w-[31%] md:left-[9%] md:w-[19%]">
            <div data-hero-device>
              <HeroPhone src={`${IMG}/booking-return.webp`} alt={BOOKING_CASE.form.screens[0].image.alt} tilt="perspective(1200px) rotateY(24deg) rotateX(6deg) rotateZ(-6deg)" />
            </div>
          </div>

          <div data-depth="0.55" className="absolute right-[1%] top-[12%] z-20 w-[31%] md:right-[9%] md:w-[19%]">
            <div data-hero-device>
              <HeroPhone src={`${IMG}/clipper-thread.webp`} alt={BOOKING_CASE.form.screens[2].image.alt} tilt="perspective(1200px) rotateY(-24deg) rotateX(6deg) rotateZ(5deg)" />
            </div>
          </div>

          <div data-depth="0.8" className="absolute right-[6%] top-[2%] z-30 hidden md:block" data-hero-chip>
            <ClipperOrb size={58} />
          </div>
          <Chip className="left-[2%] top-[6%] hidden md:flex">{t({ es: '15 productos comparados', en: '15 products compared' })}</Chip>
          <Chip className="right-[2%] top-[66%]">{t({ es: '4 versiones · 1 motor', en: '4 versions · 1 engine' })}</Chip>
          <Chip className="bottom-[14%] left-[3%] md:bottom-[18%]">{t({ es: 'Demo en vivo al final ↓', en: 'Live demo at the end ↓' })}</Chip>
        </div>

        <dl className="relative mt-16 grid grid-cols-2 gap-6 border-t border-fg/15 pt-8 md:grid-cols-5">
          {BOOKING_CASE.meta.map((m) => (
            <div key={m.label.es} data-hero-fade>
              <dt className="mono-label mb-1 opacity-50">{t(m.label)}</dt>
              <dd className="text-sm leading-relaxed">{t(m.value)}</dd>
            </div>
          ))}
          <div data-hero-fade className="col-span-2 md:col-span-1">
            <dt className="mono-label mb-2 opacity-50">{t(COPY.case.tools)}</dt>
            <dd className="flex flex-wrap gap-1.5">
              {BOOKING_CASE.tools.map((tool) => (
                <span key={tool} className="border border-fg/25 px-2 py-0.5 text-[11px]">{tool}</span>
              ))}
            </dd>
          </div>
        </dl>
      </div>
    </ToneSection>
  )
}

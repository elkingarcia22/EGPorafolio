'use client'

import { useEffect, useRef, useState } from 'react'
import { ToneSection } from '@/components/ui/tone-section'
import { TransitionLink } from '@/components/transition/page-transition'
import { gsap } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { ENCUESTAS_CASE } from '@/lib/content/cases/encuestas/case'
import { ResultsDashboard } from './hero-mock'
import { useMedia } from './shared'
import { AiPromptCard, EnpsGauge, FloatCard, NomBadge, PhoneCard, ThanksCard } from './hero-floats'
import './hero-dots.css'

/** La vida de una encuesta, en cinco momentos; cada uno enciende su tarjeta y mueve el tablero del centro. */
const TOUR = ['ia', 'phone', 'thanks', 'enps', 'nom'] as const
type Moment = (typeof TOUR)[number]
const TOUR_MS = 3400
const BASE_ANSWERED = 487

/** Portada del caso Encuestas: el tablero de resultados vivo y, alrededor, la vida de una medición. */
export function EncuestasHero() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const ref = useRef<HTMLDivElement>(null)
  const [tick, setTick] = useState(0)
  const c = ENCUESTAS_CASE

  useEffect(() => {
    if (reducedMotion) return
    const id = window.setInterval(() => setTick((n) => n + 1), TOUR_MS)
    return () => window.clearInterval(id)
  }, [reducedMotion])

  useEffect(() => {
    const el = ref.current
    if (!el || reducedMotion) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      tl.from('[data-hero-word]', { yPercent: 115, duration: 1.3, stagger: 0.07 }, 0.15)
        .from('[data-hero-fade]', { autoAlpha: 0, y: 24, duration: 1, stagger: 0.06 }, 0.45)
        .from('[data-hero-board]', { autoAlpha: 0, y: 60, scale: 0.96, duration: 1.4 }, 0.5)
        .from('[data-hero-float]', { autoAlpha: 0, scale: 0.7, y: 50, duration: 1.1, stagger: 0.12, ease: 'back.out(1.4)' }, 1.2)
      gsap.utils.toArray<HTMLElement>('[data-hero-float]').forEach((card, i) => {
        gsap.to(card, { y: -10, duration: 2.4 + i * 0.35, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2.4 + i * 0.2 })
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

  // Sin las tarjetas flotantes (celular y tableta), el tablero lleva las animaciones al frente.
  const lively = useMedia('(max-width: 1023px)') && !reducedMotion
  const step = reducedMotion ? TOUR.length - 1 : tick % TOUR.length
  const moment: Moment = TOUR[step]
  const answered = step >= 2 ? BASE_ANSWERED + 1 : BASE_ANSWERED
  const growingN = step >= 2 ? 5 : 4
  const enps = step >= 3 ? 31 : 28
  const still = reducedMotion

  const floats: readonly { id: Moment; cls: string; depth: number; tilt: string; label: string; light?: boolean; body: React.ReactNode }[] = [
    { id: 'ia', cls: 'left-[-4%] top-[0%] w-[240px]', depth: 0.55, tilt: 'rotate(-3deg)', label: t({ es: '1 · Crear con IA', en: '1 · Create with AI' }), body: <AiPromptCard active={moment === 'ia'} still={still} /> },
    { id: 'phone', cls: 'left-[1%] bottom-[-26%] w-[170px]', depth: 0.85, tilt: 'rotate(2deg)', label: t({ es: '2 · Responder', en: '2 · Answer' }), body: <PhoneCard active={moment === 'phone'} still={still} /> },
    { id: 'thanks', cls: 'right-[-2%] top-[-2%] w-[230px]', depth: 0.7, tilt: 'rotate(3deg)', light: true, label: t({ es: '3 · Enviada', en: '3 · Sent' }), body: <ThanksCard active={moment === 'thanks'} burst={tick} /> },
    { id: 'enps', cls: 'right-[-1%] bottom-[10%] w-[200px]', depth: 0.95, tilt: 'rotate(-2deg)', label: t({ es: '4 · eNPS en vivo', en: '4 · Live eNPS' }), body: <EnpsGauge value={enps} /> },
    { id: 'nom', cls: 'left-[26%] bottom-[-12%] w-[250px]', depth: 0.4, tilt: 'rotate(-1deg)', label: t({ es: '5 · Normativa', en: '5 · Compliance' }), body: <NomBadge /> },
  ]

  const titleWords = t(c.title).split(' ')
  const headWords = t(c.headline).split(' ')

  return (
    <ToneSection tone="dark" className="relative overflow-hidden px-[var(--gutter)] pb-24 pt-32">
      <div ref={ref}>
        <div className="pointer-events-none absolute left-1/2 top-[58%] h-[70vw] max-h-[1100px] w-[95vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(12,91,239,0.28),rgba(67,169,112,0.08)_55%,transparent)]" aria-hidden="true" />

        <div className="relative mb-14 flex flex-wrap items-center justify-between gap-x-6 gap-y-2" data-hero-fade>
          <TransitionLink href="/" transitionLabel={t({ es: 'Inicio', en: 'Home' })} className="mono-label opacity-60 hover:opacity-100">
            ← {t({ es: 'Trabajo', en: 'Work' })}
          </TransitionLink>
          <span className="mono-label opacity-60">N° 05.26 · {t(c.eyebrow)}</span>
        </div>

        <div className="relative grid items-end gap-8 lg:grid-cols-12">
          <h1 className="font-light leading-[0.9] tracking-tight lg:col-span-7">
            <span className="block text-[clamp(2.8rem,1rem+5.2vw,6.5rem)]">
              {titleWords.map((w, i) => (
                <span key={`${w}-${i}`} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                  <span data-hero-word className="inline-block">{w}&nbsp;</span>
                </span>
              ))}
            </span>
            <span className="mt-2 block text-[clamp(1.6rem,0.8rem+2.6vw,3.2rem)] text-signal">
              {headWords.map((w, i) => (
                <span key={`${w}-${i}`} className="inline-block overflow-hidden pb-[0.1em] align-bottom">
                  <span data-hero-word className="inline-block">{w}&nbsp;</span>
                </span>
              ))}
            </span>
          </h1>
          <p data-hero-fade className="text-lg leading-relaxed opacity-85 lg:col-span-5">{t(c.lead)}</p>
        </div>

        <div data-hero-stage className="relative mx-auto mt-16 max-w-6xl lg:mb-32 lg:mt-24">
          <div data-depth="0.12" className="relative z-10 mx-auto w-full lg:w-[62%]">
            <div data-hero-board className="shadow-[0_60px_120px_-40px_rgba(0,0,0,0.9)]">
              <ResultsDashboard answered={answered} growingN={growingN} enps={enps} pulse={moment === 'thanks'} lively={lively} cycle={Math.floor(tick / TOUR.length)} />
            </div>
          </div>
          {floats.map((f) => (
            <div key={f.id} data-depth={f.depth} className={`absolute z-20 hidden lg:block ${f.cls}`}>
              <div data-hero-float>
                <div style={{ transform: f.tilt }}>
                  <FloatCard label={f.label} active={moment === f.id} light={f.light}>
                    {f.body}
                  </FloatCard>
                </div>
              </div>
            </div>
          ))}
        </div>

        <ol className="relative mx-auto mt-6 flex max-w-md justify-center gap-1.5 lg:hidden" aria-hidden="true">
          {TOUR.map((m, i) => <li key={m} className={`h-1 flex-1 rounded-full transition-colors duration-500 ${i <= step ? 'bg-signal' : 'bg-fg/15'}`} />)}
        </ol>
        {/* En celular y tableta el momento de la vida de la encuesta se nombra bajo la barra. */}
        <p key={moment} className="enc-fade relative mt-3 text-center font-mono text-[12px] uppercase tracking-[0.14em] text-signal lg:hidden" aria-hidden="true">
          {floats[step].label}
        </p>

        <dl className="relative mt-16 grid grid-cols-2 gap-6 border-t border-fg/15 pt-8 md:grid-cols-4">
          {c.meta.map((m) => (
            <div key={m.label.es} data-hero-fade>
              <dt className="mono-label mb-1 opacity-50">{t(m.label)}</dt>
              <dd className="text-sm leading-relaxed">{t(m.value)}</dd>
            </div>
          ))}
        </dl>
      </div>
    </ToneSection>
  )
}

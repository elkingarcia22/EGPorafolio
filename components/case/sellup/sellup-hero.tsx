'use client'

import { useEffect, useRef } from 'react'
import { ToneSection } from '@/components/ui/tone-section'
import { TransitionLink } from '@/components/transition/page-transition'
import { gsap } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'
import { SELLUP_CASE } from '@/lib/content/cases/sellup/sellup-case'
import { useTick } from '../barberlytics/thema/live-pieces'
import { BLUE, SellUpMark } from './ui'

interface Station {
  who: L
  what: L
  human: boolean
  gives: L
}

/** El recorrido de una empresa: cada agente toma el trabajo donde lo dejó el anterior, con una persona en medio. */
const ROUTE: readonly Station[] = [
  { who: { es: 'Agente 1', en: 'Agent 1' }, what: { es: 'Encuentra la empresa', en: 'Finds the company' }, human: false, gives: { es: '1.240 empleados · NIT verificado · Libre en HubSpot', en: '1,240 employees · tax ID verified · Free in HubSpot' } },
  { who: { es: 'Persona', en: 'Person' }, what: { es: 'Por revisar', en: 'To review' }, human: true, gives: { es: '✓ Aprobada · pasa a Empresas a su nombre', en: '✓ Approved · moves to Companies in their name' } },
  { who: { es: 'Agente 2', en: 'Agent 2' }, what: { es: 'Encuentra a quién llamar', en: 'Finds who to call' }, human: false, gives: { es: '3 decisores de RR. HH. · 2 ya en HubSpot', en: '3 HR decision-makers · 2 already in HubSpot' } },
  { who: { es: 'Persona', en: 'Person' }, what: { es: 'Contactos por revisar', en: 'Contacts to review' }, human: true, gives: { es: '✓ 2 aprobados · se vinculan en HubSpot', en: '✓ 2 approved · linked in HubSpot' } },
  { who: { es: 'Agente 3', en: 'Agent 3' }, what: { es: 'Prepara el primer contacto', en: 'Prepares the first contact' }, human: false, gives: { es: 'Guion, correo y LinkedIn · 6 hechos citados', en: 'Script, email and LinkedIn · 6 cited facts' } },
  { who: { es: 'Persona', en: 'Person' }, what: { es: 'Contacta', en: 'Reaches out' }, human: true, gives: { es: '«La usé» · Reunión agendada', en: '“I used it” · Meeting booked' } },
]

export function SellUpHero() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const ref = useRef<HTMLDivElement>(null)
  const tick = useTick(1700)
  const active = reducedMotion ? ROUTE.length - 1 : tick % (ROUTE.length + 1)
  const pos = Math.min(active, ROUTE.length - 1)

  useEffect(() => {
    const el = ref.current
    if (!el || reducedMotion) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      tl.from('[data-hero-word]', { yPercent: 115, duration: 1.3 }, 0.15)
        .from('[data-hero-mark]', { autoAlpha: 0, scale: 0.3, rotate: -40, duration: 1.4 }, 0.1)
        .from('[data-hero-fade]', { autoAlpha: 0, y: 24, duration: 1, stagger: 0.06 }, 0.45)
        .from('[data-hero-station]', { autoAlpha: 0, y: 40, duration: 1.1, stagger: 0.08 }, 0.6)
    }, el)
    return () => ctx.revert()
  }, [reducedMotion])

  return (
    <ToneSection tone="dark" className="relative overflow-hidden px-[var(--gutter)] pb-24 pt-32">
      <div ref={ref}>
        <div className="pointer-events-none absolute -right-[20vw] -top-[30vw] h-[80vw] w-[80vw] rounded-full bg-[radial-gradient(closest-side,rgba(91,126,255,0.22),rgba(29,63,196,0.1)_50%,transparent)]" aria-hidden="true" />

        <div className="relative mb-14 flex flex-wrap items-center justify-between gap-x-6 gap-y-2" data-hero-fade>
          <TransitionLink href="/#work" transitionLabel={t(COPY.case.back)} className="mono-label opacity-60 hover:opacity-100">
            ← {t(COPY.case.back)}
          </TransitionLink>
          <span className="mono-label opacity-60">{t(SELLUP_CASE.eyebrow)}</span>
        </div>

        <div className="relative grid items-end gap-8 md:grid-cols-12">
          <h1 className="flex items-center gap-[0.18em] text-[clamp(3.2rem,1rem+8vw,10rem)] font-light leading-[0.9] tracking-tight md:col-span-7">
            <span data-hero-mark className="inline-block"><SellUpMark size={96} className="!h-[0.78em] !w-[0.78em]" /></span>
            <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
              <span data-hero-word className="inline-block">Sell<span style={{ color: BLUE }}>Up</span></span>
            </span>
          </h1>
          <p data-hero-fade className="text-lg leading-relaxed opacity-85 md:col-span-5">{t(SELLUP_CASE.tagline)}</p>
        </div>

        {/* El recorrido */}
        <div className="relative mt-16" aria-label={t({ es: 'El recorrido de una empresa por SellUp', en: 'A company’s route through SellUp' })}>
          <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3" data-hero-fade>
            <p className="mono-label opacity-60">{t({ es: 'El recorrido de una empresa', en: 'A company’s route' })}</p>
            <p className="font-mono text-xs text-white/50">206.000 → 1 {t({ es: 'empresa', en: 'company' })} → 1 {t({ es: 'persona', en: 'person' })} → 1 {t({ es: 'reunión', en: 'meeting' })}</p>
          </div>
          <div className="relative hidden h-1 rounded-full bg-white/10 md:block" aria-hidden="true">
            <span className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-1000 ease-expo" style={{ width: `${((pos + 0.5) / ROUTE.length) * 100}%`, background: `linear-gradient(90deg,transparent,${BLUE})` }} />
            <span className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_0_6px_rgba(91,126,255,0.35)] transition-[left] duration-1000 ease-expo" style={{ left: `${((pos + 0.5) / ROUTE.length) * 100}%` }} />
          </div>
          <ol className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-6">
            {ROUTE.map((s, i) => {
              const done = i <= pos
              const isNow = i === pos
              return (
                <li
                  key={`${s.who.es}-${i}`}
                  data-hero-station
                  className={`flex min-h-[148px] flex-col rounded-[14px] border p-3.5 transition-all duration-700 ${
                    isNow ? 'border-[#5b7eff] bg-[#5b7eff]/10' : s.human ? 'border-dashed border-white/20' : 'border-white/10 bg-white/[0.03]'
                  } ${done ? 'opacity-100' : 'opacity-45'}`}
                >
                  <span className={`text-[11px] font-medium ${s.human ? 'text-[#b7c6ff]' : 'text-white/55'}`}>{s.human ? '◉ ' : ''}{t(s.who)}</span>
                  <span className="mt-1 text-sm leading-snug">{t(s.what)}</span>
                  <span className={`mt-auto pt-3 text-[11px] leading-snug transition-all duration-700 ${done ? 'translate-y-0 text-white/75 opacity-100' : 'translate-y-2 opacity-0'}`}>{t(s.gives)}</span>
                </li>
              )
            })}
          </ol>
          <p className="sr-only" aria-live="polite">{t(ROUTE[pos].what)}</p>
        </div>

        <dl className="relative mt-14 grid grid-cols-2 gap-6 border-t border-fg/15 pt-8 md:grid-cols-5">
          {SELLUP_CASE.meta.map((m) => (
            <div key={m.label.es} data-hero-fade>
              <dt className="mono-label mb-1 opacity-50">{t(m.label)}</dt>
              <dd className="text-sm leading-relaxed">{t(m.value)}</dd>
            </div>
          ))}
          <div data-hero-fade className="col-span-2 md:col-span-1">
            <dt className="mono-label mb-2 opacity-50">{t(COPY.case.tools)}</dt>
            <dd className="flex flex-wrap gap-1.5">
              {SELLUP_CASE.tools.map((tool) => (
                <span key={tool} className="border border-fg/25 px-2 py-0.5 text-[11px]">{tool}</span>
              ))}
            </dd>
          </div>
        </dl>
      </div>
    </ToneSection>
  )
}

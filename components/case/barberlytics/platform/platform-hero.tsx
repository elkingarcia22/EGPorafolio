'use client'

import { useEffect, useRef, useState } from 'react'
import { ToneSection } from '@/components/ui/tone-section'
import { TransitionLink } from '@/components/transition/page-transition'
import { gsap } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'
import { PLATFORM_CASE } from '@/lib/content/cases/barberlytics/platform-case'
import { LiveCalendar, useCalendarClock, type ColorBy, type Density } from './live-calendar'

/** La portada recorre estos ajustes, como si alguien adaptara la vista a su barbería. */
const TOUR: readonly { colorBy: ColorBy; density: Density; label: L }[] = [
  { colorBy: 'estado', density: 'normal', label: { es: 'Color por estado', en: 'Color by status' } },
  { colorBy: 'servicio', density: 'normal', label: { es: 'Color por servicio', en: 'Color by service' } },
  { colorBy: 'cliente', density: 'amplia', label: { es: 'Color por cliente · amplia', en: 'Color by client · roomy' } },
  { colorBy: 'estado', density: 'compacta', label: { es: 'Estado · compacta', en: 'Status · compact' } },
]
const TOUR_MS = 4200

const COLOR_OPTIONS: readonly { id: ColorBy; label: L }[] = [
  { id: 'neutral', label: { es: 'Neutral', en: 'Neutral' } },
  { id: 'servicio', label: { es: 'Servicio', en: 'Service' } },
  { id: 'estado', label: { es: 'Estado', en: 'Status' } },
  { id: 'cliente', label: { es: 'Cliente', en: 'Client' } },
]
const DENSITY_OPTIONS: readonly { id: Density; label: L }[] = [
  { id: 'compacta', label: { es: 'Compacta', en: 'Compact' } },
  { id: 'normal', label: { es: 'Normal', en: 'Normal' } },
  { id: 'amplia', label: { es: 'Amplia', en: 'Roomy' } },
]

function Segmented<T extends string>({ options, value, label }: { options: readonly { id: T; label: L }[]; value: T; label: string }) {
  const { t } = useLocale()
  return (
    <div>
      <p className="mb-1.5 text-[10px] uppercase tracking-[0.14em] text-white/40">{label}</p>
      <div className="flex rounded-lg bg-white/[0.05] p-0.5">
        {options.map((o) => (
          <span key={o.id} className={`flex-1 rounded-md px-2 py-1 text-center text-[11px] transition-colors duration-500 ${o.id === value ? 'bg-[#d9b36a] text-[#16130f]' : 'text-white/60'}`}>
            {t(o.label)}
          </span>
        ))}
      </div>
    </div>
  )
}

/** Portada del caso: el calendario en vivo, que se adapta solo mientras lo miras. */
export function PlatformHero() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const ref = useRef<HTMLDivElement>(null)
  const now = useCalendarClock()
  const [step, setStep] = useState(0)
  const [narrow, setNarrow] = useState(false)
  const view = TOUR[step]

  // En celular caben tres barberos.
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)')
    const update = () => setNarrow(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (reducedMotion) return
    const id = window.setInterval(() => setStep((s) => (s + 1) % TOUR.length), TOUR_MS)
    return () => window.clearInterval(id)
  }, [reducedMotion])

  useEffect(() => {
    const el = ref.current
    if (!el || reducedMotion) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      tl.from('[data-hero-word]', { yPercent: 115, duration: 1.3, stagger: 0.08 }, 0.15)
        .from('[data-hero-fade]', { autoAlpha: 0, y: 24, duration: 1, stagger: 0.06 }, 0.45)
        // El calendario está desde el inicio, vacío; luego las citas caen en sus horas.
        .from('[data-hero-calendar]', { autoAlpha: 0, duration: 0.5, ease: 'power2.out' }, 0.2)
        .from('[data-hero-panel]', { autoAlpha: 0, x: 30, duration: 1 }, 1.4)
    }, el)
    return () => ctx.revert()
  }, [reducedMotion])

  const words = t(PLATFORM_CASE.title).split(' ')

  return (
    <ToneSection tone="dark" className="relative overflow-hidden px-[var(--gutter)] pb-24 pt-32">
      <div ref={ref}>
        <div className="pointer-events-none absolute -right-[10%] top-[30%] h-[60vw] max-h-[900px] w-[60vw] rounded-full bg-[radial-gradient(closest-side,rgba(217,179,106,0.18),transparent)]" aria-hidden="true" />

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

        <div className="relative mt-16 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_240px]">
          <div data-hero-calendar>
            <LiveCalendar now={now} colorBy={view.colorBy} density={view.density} columns={narrow ? 3 : 5} intro={reducedMotion ? undefined : 1.1} />
          </div>
          <aside data-hero-panel className="rounded-2xl border border-white/10 bg-[#141210]/90 p-4 backdrop-blur" aria-label={t({ es: 'Ajustes de la vista', en: 'View settings' })}>
            <p className="text-sm font-medium">{t({ es: 'Ajustes de la vista', en: 'View settings' })}</p>
            <p className="mb-4 mt-1 text-[11px] leading-snug text-white/50">{t({ es: 'Cada barbería —y cada persona— ve el día a su manera.', en: 'Every shop —and every person— sees the day their way.' })}</p>
            <div className="space-y-4">
              <Segmented options={COLOR_OPTIONS} value={view.colorBy} label={t({ es: 'Colorear tarjetas por', en: 'Color cards by' })} />
              <Segmented options={DENSITY_OPTIONS} value={view.density} label={t({ es: 'Densidad', en: 'Density' })} />
            </div>
            <p key={step} className="mt-4 animate-[ramp-in_0.6s_cubic-bezier(0.16,1,0.3,1)_both] rounded-lg bg-[#d9b36a]/10 px-3 py-2 text-[11px] text-[#e9c27a]">
              ↻ {t(view.label)}
            </p>
          </aside>
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

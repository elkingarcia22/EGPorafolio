'use client'

import { useEffect, useRef, useState } from 'react'
import { ToneSection } from '@/components/ui/tone-section'
import { TransitionLink } from '@/components/transition/page-transition'
import { gsap } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'
import { PLATFORM_CASE } from '@/lib/content/cases/barberlytics/platform-case'
import { ALL_FIELDS, LiveCalendar, useCalendarClock, type CardFields, type CardStyle, type ColorBy, type Density } from './live-calendar'

type Knob = 'color' | 'style' | 'density' | 'fields'

interface Step {
  colorBy: ColorBy
  style: CardStyle
  density: Density
  fields: CardFields
  knob: Knob
}

/** La portada recorre los ajustes, como si alguien adaptara el calendario a su barbería. */
const TOUR: readonly Step[] = [
  { colorBy: 'estado', style: 'pastel', density: 'normal', fields: ALL_FIELDS, knob: 'color' },
  { colorBy: 'servicio', style: 'pastel', density: 'normal', fields: ALL_FIELDS, knob: 'color' },
  { colorBy: 'servicio', style: 'vivo', density: 'normal', fields: ALL_FIELDS, knob: 'style' },
  { colorBy: 'cliente', style: 'vivo', density: 'amplia', fields: ALL_FIELDS, knob: 'density' },
  { colorBy: 'cliente', style: 'vivo', density: 'amplia', fields: { ...ALL_FIELDS, price: false, time: true }, knob: 'fields' },
  { colorBy: 'estado', style: 'pastel', density: 'compacta', fields: ALL_FIELDS, knob: 'density' },
]
const TOUR_MS = 3600

function Segmented<T extends string>({ options, value }: { options: readonly { id: T; label: L }[]; value: T }) {
  const { t } = useLocale()
  return (
    <div className="flex rounded-lg bg-white/[0.06] p-0.5">
      {options.map((o) => (
        <span key={o.id} className={`flex-1 whitespace-nowrap rounded-md px-2 py-1 text-center text-[11px] transition-colors duration-500 ${o.id === value ? 'bg-[#d9b36a] text-[#16130f]' : 'text-white/60'}`}>
          {t(o.label)}
        </span>
      ))}
    </div>
  )
}

function Switch({ label, on }: { label: string; on: boolean }) {
  return (
    <p className="flex items-center justify-between gap-3 py-0.5 text-[11px] text-white/75">
      {label}
      <span className={`relative h-3.5 w-6 rounded-full transition-colors duration-500 ${on ? 'bg-[#2a8a5c]' : 'bg-white/15'}`}>
        <span className={`absolute top-0.5 h-2.5 w-2.5 rounded-full bg-white transition-transform duration-500 ${on ? 'translate-x-3' : 'translate-x-0.5'}`} />
      </span>
    </p>
  )
}

/** Una tarjeta flotante de ajustes; brilla cuando es la que está cambiando. */
function Knobcard({ title, active, children }: { title: string; active: boolean; children: React.ReactNode }) {
  return (
    <div className={`rounded-2xl border bg-[#141210]/90 p-3.5 text-white backdrop-blur-md transition-[border-color,box-shadow] duration-500 ${active ? 'border-[#d9b36a] shadow-[0_0_0_4px_rgba(217,179,106,0.15),0_40px_80px_-30px_rgba(0,0,0,0.9)]' : 'border-white/10 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)]'}`}>
      <p className="mb-2.5 text-[10px] uppercase tracking-[0.14em] text-white/50">{title}</p>
      {children}
    </div>
  )
}

/** Portada del caso: el calendario al centro y, alrededor, lo que cada barbería puede ajustar. */
export function PlatformHero() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const ref = useRef<HTMLDivElement>(null)
  const now = useCalendarClock()
  const [step, setStep] = useState(0)
  const [narrow, setNarrow] = useState(false)
  const view = TOUR[step]

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
        .from('[data-hero-float]', { autoAlpha: 0, scale: 0.7, y: 50, duration: 1.1, stagger: 0.12, ease: 'back.out(1.4)' }, 1.6)
      gsap.utils.toArray<HTMLElement>('[data-hero-float]').forEach((card, i) => {
        gsap.to(card, { y: -10, duration: 2.6 + i * 0.4, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2.8 + i * 0.2 })
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

  const words = t(PLATFORM_CASE.title).split(' ')
  const floats: readonly { id: Knob; cls: string; depth: number; tilt: string; title: string; body: React.ReactNode }[] = [
    {
      id: 'color',
      cls: 'left-[-1%] top-[6%] w-[230px]',
      depth: 0.5,
      tilt: 'rotate(-3deg)',
      title: t({ es: 'Colorear tarjetas por', en: 'Color cards by' }),
      body: <Segmented value={view.colorBy} options={[{ id: 'estado', label: { es: 'Estado', en: 'Status' } }, { id: 'servicio', label: { es: 'Servicio', en: 'Service' } }, { id: 'cliente', label: { es: 'Cliente', en: 'Client' } }]} />,
    },
    {
      id: 'fields',
      cls: 'left-[1%] bottom-[2%] w-[220px]',
      depth: 0.8,
      tilt: 'rotate(2deg)',
      title: t({ es: 'Qué muestra la tarjeta', en: 'What the card shows' }),
      body: (
        <>
          <Switch label={t({ es: 'Tipo de cliente', en: 'Client type' })} on={view.fields.type} />
          <Switch label={t({ es: 'Precio', en: 'Price' })} on={view.fields.price} />
          <Switch label={t({ es: 'Hora', en: 'Time' })} on={view.fields.time} />
          <Switch label={t({ es: 'Siguiente paso', en: 'Next step' })} on={view.fields.next} />
        </>
      ),
    },
    {
      id: 'density',
      cls: 'right-[-1%] top-[10%] w-[230px]',
      depth: 0.65,
      tilt: 'rotate(3deg)',
      title: t({ es: 'Densidad', en: 'Density' }),
      body: <Segmented value={view.density} options={[{ id: 'compacta', label: { es: 'Compacta', en: 'Compact' } }, { id: 'normal', label: { es: 'Normal', en: 'Normal' } }, { id: 'amplia', label: { es: 'Amplia', en: 'Roomy' } }]} />,
    },
    {
      id: 'style',
      cls: 'right-[1%] bottom-[8%] w-[190px]',
      depth: 0.9,
      tilt: 'rotate(-2deg)',
      title: t({ es: 'Estilo', en: 'Style' }),
      body: <Segmented value={view.style} options={[{ id: 'pastel', label: { es: 'Pastel', en: 'Pastel' } }, { id: 'vivo', label: { es: 'Vivo', en: 'Vivid' } }]} />,
    },
  ]

  return (
    <ToneSection tone="dark" className="relative overflow-hidden px-[var(--gutter)] pb-24 pt-32">
      <div ref={ref}>
        <div className="pointer-events-none absolute left-1/2 top-[55%] h-[70vw] max-h-[1100px] w-[95vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(217,179,106,0.2),rgba(63,114,216,0.08)_55%,transparent)]" aria-hidden="true" />

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

        <div data-hero-stage className="relative mx-auto mt-16 max-w-6xl">
          <div data-depth="0.12" className="relative z-10 mx-auto w-full lg:w-[66%]">
            <div data-hero-calendar>
              <LiveCalendar now={now} colorBy={view.colorBy} style={view.style} density={view.density} fields={view.fields} columns={narrow ? 3 : 4} intro={reducedMotion ? undefined : 1.1} className="shadow-[0_60px_120px_-40px_rgba(0,0,0,0.9)]" />
            </div>
          </div>
          {floats.map((f) => (
            <div key={f.id} data-depth={f.depth} className={`absolute z-20 hidden lg:block ${f.cls}`}>
              <div data-hero-float>
                <div style={{ transform: f.tilt }}>
                  <Knobcard title={f.title} active={view.knob === f.id}>{f.body}</Knobcard>
                </div>
              </div>
            </div>
          ))}
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

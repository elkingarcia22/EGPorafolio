'use client'

import { useEffect, useRef, useState } from 'react'
import { ToneSection } from '@/components/ui/tone-section'
import { TransitionLink } from '@/components/transition/page-transition'
import { gsap } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'
import { OBJ_CASE } from '@/lib/content/cases/objetivos/objetivos-case'
import { CascadeGraph } from './cascade-graph'
import { OBJETIVOS, cuenta, tramoDe, type ObjetivoPersona } from './cascade-model'
import { useCheckinLoop } from './use-checkin-loop'
import { DESKTOP_QUERY, useMedia } from './use-media'

/** Tarjeta flotante del último reporte: quién, qué objetivo y cuánto subió. */
function ReportToast({ last }: { last: { o: ObjetivoPersona; from: number } | null }) {
  const { t } = useLocale()
  if (!last) return null
  const tramo = tramoDe(last.o.avance)
  return (
    <div key={`${last.o.id}-${last.o.avance}`} className="obj-toast w-[300px] rounded-xl border border-white/10 bg-[#16171c]/90 p-4 text-paper shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)] backdrop-blur">
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/45">{t({ es: 'Reportó avance', en: 'Reported progress' })}</p>
      <p className="mt-2 text-sm font-medium">{last.o.persona} · {last.o.area}</p>
      <p className="mt-1 text-[13px] leading-snug text-white/70">{last.o.titulo}</p>
      <div className="mt-3 flex items-center gap-3">
        <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
          <span className="block h-full rounded-full transition-[width] duration-700 ease-expo" style={{ width: `${Math.min(100, last.o.avance)}%`, background: tramo.color }} />
        </span>
        <span className="font-mono text-xs tabular-nums text-white/60">{last.from} → <b className="text-white">{last.o.avance} %</b></span>
      </div>
      <p className="mt-2 text-[11px]" style={{ color: tramo.color }}>{tramo.nombre}</p>
    </div>
  )
}

/** Portada: el título y la cascada de un ciclo en vivo, con reportes que suben hasta la empresa. */
export function ObjetivosHero() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const ref = useRef<HTMLDivElement>(null)
  const { objetivos, pulse, pulseKey, last } = useCheckinLoop(OBJETIVOS, { enabled: !reducedMotion, every: 2600 })
  const [inView, setInView] = useState(true)
  const desktop = useMedia(DESKTOP_QUERY)

  useEffect(() => {
    const el = ref.current
    if (!el || reducedMotion) return
    const ctx = gsap.context(() => {
      gsap.from('[data-hero-word]', { yPercent: 110, duration: 1.2, ease: 'expo.out', stagger: 0.06, delay: 0.15 })
      gsap.from('[data-hero-fade]', { autoAlpha: 0, y: 24, duration: 1, ease: 'expo.out', stagger: 0.08, delay: 0.4 })
      gsap.from('[data-hero-stage]', { autoAlpha: 0, y: 60, duration: 1.4, ease: 'expo.out', delay: 0.5 })
    }, el)
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting))
    io.observe(el)
    return () => {
      ctx.revert()
      io.disconnect()
    }
  }, [reducedMotion])

  const approved = objetivos.filter(cuenta).length

  return (
    <ToneSection tone="dark" className="relative overflow-hidden px-[var(--gutter)] pb-24 pt-32">
      <div ref={ref}>
        <div className="pointer-events-none absolute left-1/2 top-[48%] h-[70vw] max-h-[1000px] w-[95vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(64,96,255,0.22),rgba(64,96,255,0.05)_60%,transparent)]" aria-hidden="true" />

        <div className="relative mb-14 flex flex-wrap items-center justify-between gap-x-6 gap-y-2" data-hero-fade>
          <TransitionLink href="/#work" transitionLabel={t({ es: 'Trabajo', en: 'Work' })} className="mono-label opacity-60 hover:opacity-100">
            ← {t({ es: 'Proyectos', en: 'Projects' })}
          </TransitionLink>
          <span className="mono-label opacity-60">{t(OBJ_CASE.eyebrow)}</span>
        </div>

        <div className="relative grid items-end gap-8 md:grid-cols-12">
          <h1 className="text-[clamp(3.4rem,1rem+9vw,11rem)] font-light leading-[0.88] tracking-tight md:col-span-7">
            <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
              <span data-hero-word className="inline-block">{t(OBJ_CASE.title)}</span>
            </span>
          </h1>
          <p data-hero-fade className="text-lg leading-relaxed opacity-85 md:col-span-5">{t(OBJ_CASE.tagline)}</p>
        </div>

        {desktop ? (
        <div data-hero-stage className="relative mx-auto mt-14 max-w-6xl">
          <CascadeGraph objetivos={objetivos} pulse={inView ? pulse : null} pulseKey={pulseKey} reducedMotion={reducedMotion} />
          <div className="mt-6 flex flex-wrap items-start justify-between gap-6">
          <p data-hero-fade className="flex flex-wrap gap-x-6 gap-y-1 pt-2 font-mono text-[11px] text-white/50">
            <span>{t({ es: 'Ciclo de ejemplo', en: 'Sample cycle' })} · KPIs corporativos 2026</span>
            <span>{approved} / {objetivos.length} {t({ es: 'objetivos aprobados', en: 'goals approved' })}</span>
            <span>{t({ es: 'Lo que no está aprobado no suma', en: 'Unapproved goals don’t count' })}</span>
          </p>
          <div className="hidden min-h-[150px] lg:block" aria-live="polite">
            <ReportToast last={last} />
          </div>
          </div>
        </div>
        ) : (
          /* Teléfono y tableta: la cascada de lado (empresa → áreas → personas) a tamaño legible y,
             en tableta, el último reporte al lado en vez de debajo. */
          <div data-hero-stage className="relative mt-12 md:flex md:items-center md:justify-center md:gap-8">
            <CascadeGraph layout="tall" objetivos={objetivos} pulse={inView ? pulse : null} pulseKey={pulseKey} reducedMotion={reducedMotion} className="mx-auto max-w-[400px] md:mx-0 md:w-[380px] md:shrink-0" />
            <div className="mt-6 md:mt-0">
              <div className="hidden min-h-[150px] md:block" aria-live="polite">
                <ReportToast last={last} />
              </div>
              <p data-hero-fade className="flex flex-col gap-1 pt-2 font-mono text-[11px] text-white/55 md:mt-4">
                <span>{t({ es: 'Ciclo de ejemplo', en: 'Sample cycle' })} · KPIs corporativos 2026</span>
                <span>{approved} / {objetivos.length} {t({ es: 'objetivos aprobados', en: 'goals approved' })}</span>
                <span>{t({ es: 'Lo que no está aprobado no suma', en: 'Unapproved goals don’t count' })}</span>
              </p>
            </div>
          </div>
        )}

        <dl className="relative mt-16 grid grid-cols-2 gap-6 border-t border-fg/15 pt-8 md:grid-cols-5">
          {OBJ_CASE.meta.map((m) => (
            <div key={m.label.es} data-hero-fade>
              <dt className="mono-label mb-1 opacity-50">{t(m.label)}</dt>
              <dd className="text-sm leading-relaxed">{t(m.value)}</dd>
            </div>
          ))}
          <div data-hero-fade className="col-span-2 md:col-span-1">
            <dt className="mono-label mb-2 opacity-50">{t(COPY.case.tools)}</dt>
            <dd className="flex flex-wrap gap-1.5">
              {OBJ_CASE.tools.map((tool) => (
                <span key={tool} className="border border-fg/25 px-2 py-0.5 text-[11px]">{tool}</span>
              ))}
            </dd>
          </div>
        </dl>
      </div>
    </ToneSection>
  )
}

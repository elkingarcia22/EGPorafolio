'use client'

import { useEffect, useRef } from 'react'
import { ToneSection } from '@/components/ui/tone-section'
import { SectionLabel } from '@/components/ui/section-label'
import { BroadcastVisual, FormVisual, FrequencyVisual, NoiseVisual } from './process-visuals'
import { gsap } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'

interface Stage {
  key: string
  title: L
  body: L
  ai: L
  Visual: () => React.JSX.Element
}

const STAGES: readonly Stage[] = [
  {
    key: 'noise',
    title: { es: 'Puntos', en: 'Dots' },
    body: {
      es: 'Escucho el problema sin filtros: entrevistas, datos, soporte, observación. Todavía no hay forma, solo puntos sueltos.',
      en: 'I listen to the problem unfiltered: interviews, data, support, observation. No shape yet, only scattered dots.',
    },
    ai: { es: 'La IA agrupa cientos de notas en minutos.', en: 'AI clusters hundreds of notes in minutes.' },
    Visual: NoiseVisual,
  },
  {
    key: 'frequency',
    title: { es: 'Patrones', en: 'Patterns' },
    body: {
      es: 'Encuentro el patrón que se repite: el insight que explica el dolor y la oportunidad que vale la pena.',
      en: 'I find the pattern that repeats: the insight behind the pain and the opportunity worth pursuing.',
    },
    ai: { es: 'Contrasto hipótesis con usuarios sintéticos antes de probar con reales.', en: 'I stress-test hypotheses with synthetic users before real ones.' },
    Visual: FrequencyVisual,
  },
  {
    key: 'form',
    title: { es: 'Forma', en: 'Form' },
    body: {
      es: 'Bocetos, flujos, wireframes y sistema de diseño. Pruebo rápido, descarto sin miedo y afino lo que funciona.',
      en: 'Sketches, flows, wireframes and design system. I test fast, discard fearlessly and refine what works.',
    },
    ai: { es: 'Genero variaciones y prototipos en código el mismo día.', en: 'I generate variations and coded prototypes the same day.' },
    Visual: FormVisual,
  },
  {
    key: 'broadcast',
    title: { es: 'Impacto', en: 'Impact' },
    body: {
      es: 'El producto sale al mundo y se mide: adopción, engagement, outcomes. Las conexiones se vuelven impacto.',
      en: 'The product ships and gets measured: adoption, engagement, outcomes. The connections become impact.',
    },
    ai: { es: 'Construyo herramientas que hoy usan miles de personas.', en: 'I build tools used today by thousands of people.' },
    Visual: BroadcastVisual,
  },
]

/** Las 4 etapas en un recorrido horizontal fijado (vertical en móvil). */
export function Process() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const sectionRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const meterRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track || reducedMotion) return
    const mm = gsap.matchMedia()
    mm.add('(min-width: 768px)', () => {
      const distance = () => track.scrollWidth - window.innerWidth
      gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (meterRef.current) meterRef.current.style.transform = `scaleX(${self.progress})`
          },
        },
      })
    })
    return () => mm.revert()
  }, [reducedMotion])

  return (
    <ToneSection tone="dark" id="process">
      <div ref={sectionRef} className="relative overflow-hidden md:h-[100svh]">
        <div className="flex items-center justify-between px-[var(--gutter)] pb-6 pt-28 md:absolute md:inset-x-0 md:top-0">
          <SectionLabel index="02">{t(COPY.process.label)}</SectionLabel>
          <div className="hidden w-48 items-center gap-3 md:flex" aria-hidden="true">
            <span className="mono-label opacity-50">88</span>
            <span className="relative h-px flex-1 bg-fg/20">
              <span ref={meterRef} className="absolute inset-0 origin-left scale-x-0 bg-signal" />
            </span>
            <span className="mono-label opacity-50">108</span>
          </div>
        </div>

        <div ref={trackRef} className="flex flex-col md:h-full md:w-max md:flex-row md:items-end">
          <div className="flex shrink-0 items-end px-[var(--gutter)] pb-12 md:h-full md:w-[42vw] md:pb-[12vh]">
            <h2 className="text-[clamp(2.8rem,1rem+6vw,7rem)] font-light leading-[0.9] tracking-tight">
              {t(COPY.process.title)}
            </h2>
          </div>

          {STAGES.map((stage, i) => (
            <article
              key={stage.key}
              className="flex shrink-0 flex-col justify-end gap-8 border-t border-fg/15 px-[var(--gutter)] py-12 md:h-full md:w-[34vw] md:min-w-[26rem] md:border-l md:border-t-0 md:pb-[12vh] md:pt-0"
            >
              <div className="h-32 w-32 md:h-40 md:w-40">
                <stage.Visual />
              </div>
              <div>
                <p className="mono-label mb-3 opacity-50">0{i + 1} / 04</p>
                <h3 className="brand-title mb-4 text-2xl">{t(stage.title)}</h3>
                <p className="max-w-sm leading-relaxed opacity-75">{t(stage.body)}</p>
                <p className="mt-5 flex max-w-sm items-start gap-2 text-sm">
                  <span className="mono-label mt-0.5 shrink-0 text-signal">IA ▸</span>
                  <span className="opacity-80">{t(stage.ai)}</span>
                </p>
              </div>
            </article>
          ))}
          <div className="hidden shrink-0 md:block md:w-[12vw]" aria-hidden="true" />
        </div>
      </div>
    </ToneSection>
  )
}

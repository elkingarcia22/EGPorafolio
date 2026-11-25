'use client'

import { useEffect, useRef, useState } from 'react'
import { ToneSection } from '@/components/ui/tone-section'
import { SectionLabel } from '@/components/ui/section-label'
import { TransitionLink } from '@/components/transition/page-transition'
import { gsap, ScrollTrigger } from '@/lib/motion'
import { backdropQuiet } from './backdrop-journey'
import { OrbitStage } from './work-orbit/orbit-stage'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'
import type { Project } from '@/lib/content/projects'

/** Momentos (s desde que la sección entra): título, nacimiento de la órbita y ficha */
const TITLE_AT_S = 0.15
const BURST_AT_S = 0.45
const BURST_S = 1.8
const INFO_AT_S = 1.6
const WORD_STAGGER_S = 0.09
/** Mientras se ve la órbita, el fondo se calma para que sus fibras se lean */
const QUIET_LEVEL = 0.85

/**
 * Proyectos: una órbita de nodos. Al entrar, los proyectos salen disparados
 * desde un punto central —las fibras se tienden hacia cada uno— y se acomodan
 * en un anillo en profundidad que gira como carrusel. Debajo, la ficha del
 * proyecto del frente cambia con cada giro.
 */
export function WorkList({ projects }: { projects: readonly Project[] }) {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const rootRef = useRef<HTMLDivElement>(null)
  const infoRef = useRef<HTMLDivElement>(null)
  const burst = useRef(0)
  const [target, setTarget] = useState(0)
  const count = projects.length
  const active = count ? ((target % count) + count) % count : 0
  const project = projects[active]
  const title = t(COPY.work.title)

  // Entrada: título palabra por palabra, la órbita nace del centro y llega la ficha.
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    if (reducedMotion) {
      burst.current = 1
      return
    }
    const ctx = gsap.context(() => {
      const words = root.querySelectorAll('[data-work-word]')
      const info = root.querySelector('[data-work-info]')
      const hide = () => {
        gsap.set(words, { autoAlpha: 0, yPercent: 55, filter: 'blur(10px)' })
        gsap.set(info, { autoAlpha: 0, y: 24 })
        burst.current = 0
      }
      hide()
      let intro: gsap.core.Timeline | null = null
      ScrollTrigger.create({
        trigger: root,
        start: 'top 70%',
        onEnter: () => {
          intro?.kill()
          intro = gsap.timeline()
            .to(words, { autoAlpha: 1, yPercent: 0, filter: 'blur(0px)', duration: 0.9, stagger: WORD_STAGGER_S, ease: 'expo.out' }, TITLE_AT_S)
            .to(burst, { current: 1, duration: BURST_S, ease: 'power2.out' }, BURST_AT_S)
            .to(info, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'expo.out' }, INFO_AT_S)
        },
        onLeaveBack: () => {
          intro?.kill()
          hide()
        },
      })
      // El fondo se calma mientras la órbita está en pantalla.
      ScrollTrigger.create({
        trigger: root,
        start: 'top 60%',
        end: 'bottom 30%',
        onToggle: (self) => backdropQuiet.set('work', self.isActive ? QUIET_LEVEL : 0),
      })
    }, root)
    return () => {
      backdropQuiet.set('work', 0)
      ctx.revert()
    }
  }, [reducedMotion])

  // Cada giro: la ficha cambia con un fundido corto.
  useEffect(() => {
    const info = infoRef.current
    if (!info || reducedMotion || burst.current < 1) return
    gsap.fromTo(info.querySelectorAll('[data-info-line]'), { autoAlpha: 0, y: 14, filter: 'blur(6px)' }, {
      autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.7, stagger: 0.06, ease: 'expo.out',
    })
  }, [active, reducedMotion])

  if (!project) return null
  const projectTitle = t(project.title)

  return (
    <ToneSection tone="dark" id="work" className="overflow-hidden px-[var(--gutter)] py-[clamp(5rem,3rem+8vw,10rem)]">
      <div ref={rootRef} className="mx-auto flex max-w-6xl flex-col items-center text-center">
        <SectionLabel index="01" thread={false} fiber="to" className="mb-8">{t(COPY.work.label)}</SectionLabel>
        <h2 className="text-[clamp(2.4rem,1rem+5vw,6rem)] font-light leading-[0.9] tracking-tight [text-shadow:0_2px_18px_rgb(var(--void)/0.85)]">
          {title.split(' ').map((word, i, all) => (
            <span key={i} data-work-word className="inline-block">
              {word}
              {i < all.length - 1 && ' '}
            </span>
          ))}
        </h2>

        <div className="relative mt-6 w-full">
          <OrbitStage projects={projects} target={target} onSelect={setTarget} burst={burst} reducedMotion={reducedMotion} />
        </div>

        {/* Ficha del proyecto del frente */}
        <div ref={infoRef} data-work-info aria-live="polite" className="mt-2 flex w-full max-w-2xl flex-col items-center">
          <div data-info-line className="flex items-center gap-3">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full" style={{ background: `rgb(${project.accent})` }} />
            <span className="brand-title text-[0.68rem] opacity-70">{project.client}</span>
            <span className="mono-label opacity-50">N° {project.frequency}</span>
          </div>
          <h3 data-info-line className="mt-4 text-[clamp(1.8rem,1rem+2vw,3rem)] font-light leading-[1.05] tracking-tight">
            {projectTitle}
          </h3>
          <p data-info-line className="mt-3 max-w-xl text-sm leading-relaxed opacity-65 md:text-base">{t(project.tagline)}</p>

          <div data-info-line className="mt-8 flex items-center gap-4">
            <OrbitArrow label={t(COPY.work.prev)} onClick={() => setTarget((v) => v - 1)} direction={-1} />
            <TransitionLink
              href={`/proyectos/${project.slug}`}
              transitionLabel={`N° ${project.frequency} · ${projectTitle}`}
              className="group inline-flex items-center gap-3 rounded-full border border-fg/20 px-6 py-3 transition-[border-color,background-color,color] duration-500 ease-expo hover:border-transparent hover:bg-fg hover:text-[rgb(var(--void))]"
            >
              <span className="mono-label">{t(COPY.work.open)}</span>
              <span aria-hidden="true" className="transition-transform duration-500 ease-expo group-hover:rotate-45">↗</span>
            </TransitionLink>
            <OrbitArrow label={t(COPY.work.next)} onClick={() => setTarget((v) => v + 1)} direction={1} />
          </div>

          {/* Posición en la órbita */}
          <div data-info-line className="mt-6 flex gap-2" aria-hidden="true">
            {projects.map((p, i) => (
              <span
                key={p.slug}
                className={`h-1 rounded-full transition-[width,background-color] duration-500 ease-expo ${i === active ? 'w-6 bg-fg' : 'w-1.5 bg-fg/25'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </ToneSection>
  )
}

function OrbitArrow({ label, onClick, direction }: { label: string; onClick: () => void; direction: 1 | -1 }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid h-11 w-11 place-items-center rounded-full border border-fg/15 transition-[border-color,transform] duration-500 ease-expo hover:border-fg/40 active:scale-90"
    >
      <span aria-hidden="true">{direction < 0 ? '←' : '→'}</span>
    </button>
  )
}

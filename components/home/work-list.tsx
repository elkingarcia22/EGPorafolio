'use client'

import { useEffect, useRef } from 'react'
import { ToneSection } from '@/components/ui/tone-section'
import { SectionLabel } from '@/components/ui/section-label'
import { TransitionLink } from '@/components/transition/page-transition'
import { ProjectPreview } from './project-preview'
import { gsap, scrambleText, ScrollTrigger } from '@/lib/motion'
import { backdropJourney } from './backdrop-journey'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'
import type { Project } from '@/lib/content/projects'

function WorkCard({ project }: { project: Project }) {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const titleRef = useRef<HTMLSpanElement>(null)
  const title = t(project.title)
  const accent = `rgb(${project.accent})`

  const enter = () => {
    if (titleRef.current && !reducedMotion) scrambleText(titleRef.current, title, 450)
  }

  return (
    <li data-work-card className="flex">
      <TransitionLink
        href={`/proyectos/${project.slug}`}
        transitionLabel={`N° ${project.frequency} · ${title}`}
        data-cursor={t(COPY.work.open)}
        onMouseEnter={enter}
        onFocus={enter}
        className="group relative flex w-full flex-col overflow-hidden rounded-xl border border-fg/10 bg-[rgb(var(--void)/0.6)] p-2.5 backdrop-blur-md transition-[border-color,box-shadow,transform] duration-500 ease-expo hover:-translate-y-1 hover:border-fg/25 hover:shadow-[0_24px_60px_-24px_rgb(var(--signal)/0.45)]"
      >
        <div className="relative overflow-hidden rounded-lg">
          <div className="transition-transform duration-700 ease-expo group-hover:scale-[1.035]">
            <ProjectPreview project={project} compact />
          </div>
        </div>

        <div className="flex flex-1 flex-col px-2 pb-1.5 pt-5">
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="relative flex h-1.5 w-1.5">
              <span data-work-ping className="absolute inset-0 rounded-full opacity-0" style={{ background: accent }} />
              <span className="relative h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
            </span>
            <span className="brand-title text-[0.68rem] opacity-70">{project.client}</span>
            <span className="mono-label ml-auto opacity-50">N° {project.frequency}</span>
          </div>

          <span
            ref={titleRef}
            className="mt-3 block text-[clamp(1.6rem,0.9rem+1.6vw,2.6rem)] font-light leading-[1.05] tracking-tight"
          >
            {title}
          </span>

          <p className="mb-6 mt-3 line-clamp-3 text-sm leading-relaxed opacity-65">{t(project.tagline)}</p>

          <div className="mt-auto flex items-center justify-between border-t border-fg/10 pt-4">
            <span className="mono-label opacity-70 transition-opacity group-hover:opacity-100">{t(COPY.work.open)}</span>
            <span
              aria-hidden="true"
              className="relative grid h-8 w-8 place-items-center overflow-hidden rounded-full border border-fg/15 text-base transition-[transform,background-color,border-color,color] duration-500 ease-expo group-hover:rotate-45 group-hover:border-transparent group-hover:text-paper"
            >
              <span className="absolute inset-0 scale-0 rounded-full transition-transform duration-500 ease-expo group-hover:scale-100" style={{ background: accent }} />
              <span className="relative">↗</span>
            </span>
          </div>
        </div>

        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 transition-transform duration-700 ease-expo group-hover:scale-x-100"
          style={{ background: accent }}
        />
      </TransitionLink>
    </li>
  )
}

/** Movimiento de cámara del fondo al entrar (picada a un nodo y alejarse girando) */
const JOURNEY_MS = 2400
/** Momentos (s desde que empieza la cámara): título y primeras tarjetas */
const TITLE_AT_S = 1.5
const CARDS_AT_S = 1.8
/** Paso entre tarjetas y entre palabras del título */
const CARD_STAGGER_S = 0.16
const WORD_STAGGER_S = 0.09
/** De dónde llegan las tarjetas: desde el fondo, inclinadas y desenfocadas */
const CARD_FROM = { z: -420, rotateX: 26, y: 90, blur: 12 }

/**
 * Proyectos: la cámara del fondo único entra en picada hasta una neurona (con
 * sus conexiones en primer plano) y se aleja girando hacia una esquina. Al
 * terminar, el título aparece palabra por palabra y las tarjetas llegan desde
 * el fondo en 3D, una tras otra, y su punto de color late al conectarse.
 */
export function WorkList({ projects }: { projects: readonly Project[] }) {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const rootRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const title = t(COPY.work.title)

  useEffect(() => {
    const root = rootRef.current
    const list = listRef.current
    if (!root || !list || reducedMotion) return
    /** Turno del viaje de cámara que pidió esta sección (solo ella lo suelta) */
    let turn = 0
    const ctx = gsap.context(() => {
      const words = root.querySelectorAll('[data-work-word]')
      const cards = gsap.utils.toArray<HTMLElement>('[data-work-card]', list)
      /** Momento (performance.now) en que empezó la cámara; las tarjetas esperan a que termine */
      let playedAt = 0

      const hideTitle = () => gsap.set(words, { autoAlpha: 0, yPercent: 55, filter: 'blur(10px)' })
      const hideCards = () => gsap.set(cards, { autoAlpha: 0, z: CARD_FROM.z, rotateX: CARD_FROM.rotateX, y: CARD_FROM.y, filter: `blur(${CARD_FROM.blur}px)` })
      hideTitle()
      hideCards()

      const showCard = (card: HTMLElement, order: number) => {
        const wait = playedAt ? Math.max(0, CARDS_AT_S - (performance.now() - playedAt) / 1000) : 0
        gsap.timeline({ delay: wait + order * CARD_STAGGER_S })
          .to(card, { autoAlpha: 1, z: 0, rotateX: 0, y: 0, filter: 'blur(0px)', duration: 1.3, ease: 'expo.out', clearProps: 'transform,filter' })
          // Al llegar, el punto del cliente emite un pulso: conexión encontrada.
          .fromTo(card.querySelector('[data-work-ping]'), { scale: 1, opacity: 0.85 }, { scale: 4, opacity: 0, duration: 0.9, ease: 'power2.out' }, '-=0.6')
      }

      ScrollTrigger.create({
        trigger: root,
        start: 'top 88%',
        onEnter: () => {
          playedAt = performance.now()
          turn = backdropJourney.play({ kind: 'dive-out', durationMs: JOURNEY_MS })
          gsap.to(words, { autoAlpha: 1, yPercent: 0, filter: 'blur(0px)', duration: 0.9, stagger: WORD_STAGGER_S, ease: 'expo.out', delay: TITLE_AT_S })
        },
        onLeaveBack: () => {
          backdropJourney.release(turn)
          playedAt = 0
          hideTitle()
        },
      })
      // Cada tarjeta llega cuando entra en pantalla (las primeras, al terminar la cámara).
      cards.forEach((card, i) => {
        ScrollTrigger.create({ trigger: card, start: 'top 95%', once: true, onEnter: () => showCard(card, i % 2) })
      })
      // Al dejar la sección, la cámara vuelve a flotar.
      ScrollTrigger.create({ trigger: list, start: 'bottom 40%', onEnter: () => backdropJourney.release(turn) })
    }, root)
    return () => {
      backdropJourney.release(turn)
      ctx.revert()
    }
  }, [reducedMotion, projects.length])

  return (
    <ToneSection tone="dark" id="work" className="px-[var(--gutter)] py-[clamp(5rem,3rem+8vw,10rem)]">
      <div ref={rootRef}>
        <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel index="01" className="mb-8">{t(COPY.work.label)}</SectionLabel>
            <h2 className="text-[clamp(2.4rem,1rem+5vw,6rem)] font-light leading-[0.9] tracking-tight [text-shadow:0_2px_18px_rgb(var(--void)/0.85)]">
              {title.split(' ').map((word, i, all) => (
                <span key={i} data-work-word className="inline-block">
                  {word}
                  {i < all.length - 1 && '\u00a0'}
                </span>
              ))}
            </h2>
          </div>
        </div>

        {/* Perspectiva: las tarjetas llegan desde la profundidad de la red */}
        <ul ref={listRef} className="grid gap-5 [perspective:1400px] md:grid-cols-2 lg:gap-8">
          {projects.map((project) => (
            <WorkCard key={project.slug} project={project} />
          ))}
        </ul>
      </div>
    </ToneSection>
  )
}

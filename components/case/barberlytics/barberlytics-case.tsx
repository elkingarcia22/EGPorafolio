'use client'

import { useEffect, useMemo, useRef } from 'react'
import { Chapter, type ChapterMeta } from '@/components/case/chapter'
import { ChapterNav } from '@/components/case/chapter-nav'
import { NextProject } from '@/components/case/next-project'
import { ToneSection } from '@/components/ui/tone-section'
import { gsap, ScrollTrigger } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { CLOSING, OVERVIEW } from '@/lib/content/cases/barberlytics/overview'
import { THEMA } from '@/lib/content/cases/barberlytics/thema'
import { BOOKING } from '@/lib/content/cases/barberlytics/booking'
import { PLATFORM } from '@/lib/content/cases/barberlytics/platform'
import { CLIPPER } from '@/lib/content/cases/barberlytics/clipper'
import type { Project } from '@/lib/content/projects'
import { BarberlyticsHero } from './barberlytics-hero'
import { ChapterThema } from './chapter-thema'
import { ChapterBooking } from './chapter-booking'
import { ChapterPlatform } from './chapter-platform'
import { ChapterClipper } from './chapter-clipper'

/** Todo lo marcado con data-reveal entra al aparecer en pantalla. */
function useReveal(root: React.RefObject<HTMLElement | null>, reducedMotion: boolean) {
  useEffect(() => {
    const el = root.current
    if (!el || reducedMotion) return
    const ctx = gsap.context(() => {
      ScrollTrigger.batch('[data-reveal]', {
        start: 'top 88%',
        once: true,
        onEnter: (batch) =>
          gsap.fromTo(batch, { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.06, overwrite: true }),
      })
    }, el)
    return () => ctx.revert()
  }, [root, reducedMotion])
}

/**
 * Caso Barberlytics: un producto contado en cuatro piezas —sistema de diseño,
 * reserva, plataforma y la IA—, con capturas reales y cifras del repositorio.
 */
export function BarberlyticsCase({ next }: { next: Project }) {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const ref = useRef<HTMLDivElement>(null)
  useReveal(ref, reducedMotion)

  const chapters: readonly ChapterMeta[] = useMemo(
    () => [
      { id: 'thema', index: '01', title: t(THEMA.title), tone: 'light' },
      { id: 'reserva', index: '02', title: t(BOOKING.title), tone: 'dark' },
      { id: 'plataforma', index: '03', title: t(PLATFORM.title), tone: 'light' },
      { id: 'clipper', index: '04', title: t(CLIPPER.title), tone: 'dark' },
    ],
    [t],
  )
  const content = [ChapterThema, ChapterBooking, ChapterPlatform, ChapterClipper]

  return (
    <article ref={ref}>
      <BarberlyticsHero />

      <ToneSection tone="dark" className="px-[var(--gutter)] pb-[clamp(4rem,3rem+4vw,8rem)]">
        <div className="grid gap-10 md:grid-cols-12">
          <p data-reveal className="text-[clamp(1.2rem,1rem+0.8vw,1.6rem)] font-light leading-relaxed md:col-span-7">
            {t(OVERVIEW.context)}
          </p>
          <aside data-reveal className="border-l-2 border-signal pl-5 text-sm leading-relaxed opacity-80 md:col-span-4 md:col-start-9">
            {t(OVERVIEW.honesty)}
          </aside>
        </div>
      </ToneSection>

      <div className="grid gap-10 px-[var(--gutter)] md:grid-cols-12">
        <aside className="md:col-span-3">
          <ChapterNav chapters={chapters} label={t(OVERVIEW.title)} />
        </aside>
        <div className="min-w-0 md:col-span-9">
          {chapters.map((meta, i) => {
            const Content = content[i]
            return (
              <Chapter key={meta.id} meta={meta}>
                <Content />
              </Chapter>
            )
          })}
        </div>
      </div>

      <ToneSection tone="light" className="border-t border-fg/15 px-[var(--gutter)] py-[clamp(4rem,3rem+5vw,8rem)]">
        <h2 data-reveal className="brand-title text-[clamp(1.5rem,1rem+1.6vw,2.4rem)]">{t(CLOSING.title)}</h2>
        <ol className="mt-10 grid gap-8 md:grid-cols-3">
          {CLOSING.learnings.map((l, i) => (
            <li key={l.es} data-reveal className="border-t border-fg/20 pt-4">
              <span className="mono-label text-signal">0{i + 1}</span>
              <p className="mt-3 leading-relaxed">{t(l)}</p>
            </li>
          ))}
        </ol>
        <div data-reveal className="mt-12 flex flex-wrap items-center gap-4">
          <a href={OVERVIEW.live.booking} target="_blank" rel="noopener noreferrer" className="mono-label bg-fg px-4 py-3 text-bg transition-colors hover:bg-signal hover:text-paper">
            {t({ es: 'Ver la reserva en vivo', en: 'See the live booking' })} ↗
          </a>
          <a href={OVERVIEW.live.platform} target="_blank" rel="noopener noreferrer" className="mono-label border border-fg/40 px-4 py-3 transition-colors hover:border-signal hover:text-signal">
            {t({ es: 'Explorar Thema', en: 'Explore Thema' })} ↗
          </a>
          <p className="text-sm opacity-60">{t(CLOSING.next)}</p>
        </div>
      </ToneSection>

      <NextProject project={next} />
    </article>
  )
}

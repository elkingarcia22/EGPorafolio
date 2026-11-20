'use client'

import { useEffect, useRef, useState } from 'react'
import { ScrollTrigger, scrollToTarget } from '@/lib/motion'
import { TransitionLink } from '@/components/transition/page-transition'
import { useLocale, type L } from '@/lib/i18n'
import type { ChapterMeta } from './chapter'

interface BackLink {
  href: string
  label: L
}

/** Por defecto el índice lleva de vuelta a la lista de proyectos de la portada. */
const TO_PROJECTS: BackLink = { href: '/#work', label: { es: 'Volver a proyectos', en: 'Back to projects' } }

/** Índice fijo de capítulos con el activo resaltado y una barra de progreso. */
export function ChapterNav({ chapters, label, back = TO_PROJECTS }: { chapters: readonly ChapterMeta[]; label: string; back?: BackLink }) {
  const { t } = useLocale()
  const [active, setActive] = useState(chapters[0]?.id ?? '')
  const barRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const triggers = chapters.map((c) =>
      ScrollTrigger.create({
        trigger: `#${c.id}`,
        start: 'top 50%',
        end: 'bottom 50%',
        onToggle: (self) => {
          if (self.isActive) setActive(c.id)
        },
      }),
    )
    const first = chapters[0]?.id
    const last = chapters[chapters.length - 1]?.id
    const progress =
      first && last
        ? ScrollTrigger.create({
            trigger: `#${first}`,
            endTrigger: `#${last}`,
            start: 'top 50%',
            end: 'bottom 50%',
            onUpdate: (self) => {
              if (barRef.current) barRef.current.style.transform = `scaleY(${self.progress})`
            },
          })
        : null
    return () => {
      triggers.forEach((t) => t.kill())
      progress?.kill()
    }
  }, [chapters])

  return (
    <nav aria-label={label} className="sticky top-28 hidden md:block">
      <TransitionLink
        href={back.href}
        transitionLabel={t(back.label)}
        className="group mb-8 inline-flex items-center gap-2 text-sm opacity-60 transition-opacity duration-300 hover:opacity-100"
      >
        <span className="transition-transform duration-500 ease-expo group-hover:-translate-x-1" aria-hidden="true">←</span>
        <span className="mono-label">{t(back.label)}</span>
      </TransitionLink>
      <div className="relative pl-5">
        <span className="absolute left-0 top-0 h-full w-px bg-fg/15" aria-hidden="true" />
        <span ref={barRef} className="absolute left-0 top-0 h-full w-px origin-top scale-y-0 bg-signal" aria-hidden="true" />
        <ol className="space-y-3">
          {chapters.map((c) => (
            <li key={c.id}>
              <a
                href={`#${c.id}`}
                aria-current={active === c.id ? 'true' : undefined}
                onClick={(e) => {
                  e.preventDefault()
                  scrollToTarget(`#${c.id}`)
                }}
                className="flex items-baseline gap-3 text-sm opacity-40 transition-opacity duration-300 hover:opacity-80 aria-[current=true]:opacity-100"
              >
                <span className="mono-label">{c.index}</span>
                <span>{c.title}</span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  )
}

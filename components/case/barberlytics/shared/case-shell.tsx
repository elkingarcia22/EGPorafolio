'use client'

import { useMemo, useRef } from 'react'
import { Chapter, type ChapterMeta } from '@/components/case/chapter'
import { ChapterNav } from '@/components/case/chapter-nav'
import { ToneSection } from '@/components/ui/tone-section'
import { TransitionLink } from '@/components/transition/page-transition'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'
import { useReveal } from '../use-reveal'

type ChapterKey = 'puntos' | 'patrones' | 'idea' | 'bocetos' | 'forma' | 'ia' | 'impacto' | 'demo'

/** Capítulos de todo caso de Barberlytics, en orden y con su tono. */
const CHAPTERS: readonly { id: ChapterKey; tone: 'dark' | 'light' }[] = [
  { id: 'puntos', tone: 'dark' },
  { id: 'patrones', tone: 'dark' },
  { id: 'idea', tone: 'light' },
  { id: 'bocetos', tone: 'light' },
  { id: 'forma', tone: 'light' },
  { id: 'ia', tone: 'dark' },
  { id: 'impacto', tone: 'light' },
  { id: 'demo', tone: 'dark' },
]

interface CaseShellProps {
  title: string
  hero: React.ReactNode
  content: Record<ChapterKey, React.ComponentType>
}

/**
 * Armazón de un caso de Barberlytics: portada, índice fijo y los capítulos
 * (de los puntos al impacto, más la demo), con las entradas al hacer scroll.
 */
export function CaseShell({ title, hero, content }: CaseShellProps) {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const ref = useRef<HTMLDivElement>(null)
  useReveal(ref, reducedMotion)
  const c = COPY.case.chapters

  const chapters: readonly ChapterMeta[] = useMemo(() => {
    const titles: Record<ChapterKey, string> = {
      puntos: t(c.problem),
      patrones: t(c.research),
      idea: t(c.idea),
      bocetos: t(c.sketches),
      forma: t(c.form),
      ia: t(c.ai),
      impacto: t(c.results),
      demo: t({ es: 'Demo', en: 'Demo' }),
    }
    return CHAPTERS.map((ch, i) => ({ id: ch.id, index: String(i + 1).padStart(2, '0'), title: titles[ch.id], tone: ch.tone }))
  }, [t, c])

  return (
    <article ref={ref} className="overflow-x-clip">
      {hero}
      {/* En tablet el índice se oculta: el contenido usa todo el ancho en vez de apretarse a 9 columnas. */}
      <div className="grid gap-10 px-[var(--gutter)] lg:grid-cols-12">
        <aside className="hidden lg:col-span-3 lg:block">
          <ChapterNav chapters={chapters} label={title} />
        </aside>
        <div className="min-w-0 lg:col-span-9">
          {chapters.map((meta) => {
            const Content = content[meta.id as ChapterKey]
            return (
              <Chapter key={meta.id} meta={meta}>
                <Content />
              </Chapter>
            )
          })}
        </div>
      </div>
      <ToneSection tone="dark" className="border-t border-fg/15 px-[var(--gutter)] py-[clamp(4rem,3rem+5vw,8rem)]">
        <TransitionLink href="/proyectos/barberlytics" transitionLabel="Barberlytics" className="group block">
          <p className="mono-label mb-4 opacity-60">{t({ es: 'Volver a Barberlytics', en: 'Back to Barberlytics' })}</p>
          <p className="text-[clamp(2.4rem,1rem+5vw,6rem)] font-light leading-[0.95] tracking-tight transition-transform duration-700 ease-expo group-hover:translate-x-3">
            {t({ es: 'Ver los otros proyectos', en: 'See the other projects' })} <span className="text-signal">↗</span>
          </p>
        </TransitionLink>
      </ToneSection>
    </article>
  )
}

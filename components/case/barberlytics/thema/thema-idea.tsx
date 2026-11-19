'use client'

import { useLocale } from '@/lib/i18n'
import { THEMA_CASE } from '@/lib/content/cases/barberlytics/thema-case'
import { useTick } from './live-pieces'
import { AiDemo, DeriveDemo, MeaningDemo, PiecesDemo, type ThemeDemoProps } from './thema-idea-plates'

/** Cada cuánto cambia el tema en todas las pruebas a la vez. */
const CYCLE_MS = 2800
const THEMES = THEMA_CASE.themes
const DEMOS: readonly ((props: ThemeDemoProps) => JSX.Element)[] = [DeriveDemo, MeaningDemo, PiecesDemo, AiDemo]

/** 03 · La idea de Thema: la pregunta y los cuatro principios, cada uno probándose con el mismo color. */
export function ThemaIdea() {
  const { t } = useLocale()
  const index = useTick(CYCLE_MS) % THEMES.length
  const primary = THEMES[index].primary
  const { idea } = THEMA_CASE

  return (
    <div>
      <p data-reveal className="mono-label mb-4 opacity-60">{t({ es: '¿Cómo podríamos…?', en: 'How might we…?' })}</p>
      <p data-reveal="mask" className="max-w-[26ch] text-[clamp(1.8rem,1rem+2.4vw,3.2rem)] font-light leading-[1.1] tracking-tight">
        {t({ es: '¿Cómo podríamos hacer que cada barbería sienta la app como suya con ', en: 'How might we make every shop feel the app is theirs with ' })}
        <span className="whitespace-nowrap">
          {t({ es: 'un solo color', en: 'a single color' })}
          <span className="ml-[0.2em] inline-block h-[0.62em] w-[0.62em] rounded-full align-baseline transition-colors duration-700" style={{ background: primary }} aria-hidden="true" />
        </span>
        {t({ es: ', sin que una persona o una IA puedan romperla?', en: ', without a person or an AI being able to break it?' })}
      </p>

      <ol className="mt-14 border-b border-fg/15">
        {idea.principles.map((p, i) => {
          const Demo = DEMOS[i]
          return (
            <li key={p.title.es} data-reveal className="group grid gap-6 border-t border-fg/15 py-8 md:grid-cols-12 md:gap-8">
              <div className="md:col-span-5">
                <span className="mono-label text-signal">{t({ es: 'Principio', en: 'Principle' })} 0{i + 1}</span>
                <p className="mt-3 text-[clamp(1.5rem,1rem+1.4vw,2.3rem)] font-light leading-[1.1] tracking-tight transition-transform duration-500 ease-expo group-hover:translate-x-1.5">
                  {t(p.title)}
                </p>
                <p className="mt-3 max-w-[40ch] text-sm leading-relaxed opacity-70">{t(p.body)}</p>
              </div>
              <div className="min-h-[170px] border border-fg/10 bg-fg/[0.03] p-5 md:col-span-7">
                {Demo && <Demo index={index} />}
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

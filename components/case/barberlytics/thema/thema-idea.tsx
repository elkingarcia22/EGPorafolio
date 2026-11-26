'use client'

import { useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { THEMA_CASE } from '@/lib/content/cases/barberlytics/thema-case'
import { useAutoplay } from '@/components/case/objetivos/use-autoplay'
import { useTick } from './live-pieces'
import { AiDemo, DeriveDemo, MeaningDemo, PiecesDemo, type ThemeDemoProps } from './thema-idea-plates'
import { ChapterHead } from './chapter-head'

/** Cada cuánto cambia el tema en todas las pruebas a la vez (ms) */
const CYCLE_MS = 2800
/** Cada cuánto pasa el carrusel al siguiente principio (ms) */
const SLIDE_MS = 3600
/** Separación entre cartas (px) */
const GAP = 20
const THEMES = THEMA_CASE.themes
const DEMOS: readonly ((props: ThemeDemoProps) => JSX.Element)[] = [DeriveDemo, MeaningDemo, PiecesDemo, AiDemo]

/**
 * 03 · La idea de Thema: la pregunta, con el color que cambia, y los cuatro
 * principios en un carrusel que avanza solo; cada carta se prueba con el mismo
 * tema. Tocar una la trae al centro y muestra su explicación. De la línea de
 * nodos de abajo sale la fibra hacia «Bocetos».
 */
export function ThemaIdea() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const { idea, chapters } = THEMA_CASE
  const rootRef = useRef<HTMLDivElement>(null)
  const themeIndex = useTick(CYCLE_MS) % THEMES.length
  const primary = THEMES[reducedMotion ? 0 : themeIndex].primary
  const { index: active, go } = useAutoplay(rootRef, { count: idea.principles.length, ms: SLIDE_MS, loop: true, disabled: reducedMotion })
  const [open, setOpen] = useState(false)
  const current = idea.principles[active]

  const pick = (i: number) => {
    setOpen(i === active ? !open : true)
    go(i)
  }

  return (
    <div ref={rootRef}>
      <ChapterHead
        phrase={
          <>
            {t({ es: '¿Cómo hacer que cada barbería sienta la app como suya con ', en: 'How to make every shop feel the app is theirs with ' })}
            <span className="whitespace-nowrap">
              {t({ es: 'un solo color', en: 'a single color' })}
              <span className="ml-[0.2em] inline-block h-[0.55em] w-[0.55em] rounded-full align-baseline transition-colors duration-700" style={{ background: primary }} aria-hidden="true" />
            </span>
            {t({ es: ', sin que nadie pueda romperla?', en: ', without anyone being able to break it?' })}
          </>
        }
        lead={t(chapters.idea.lead)}
      />

      {/* El carrusel: la carta activa al centro, las vecinas asoman a los lados */}
      <div
        className="relative overflow-hidden [--card:min(460px,80vw)] [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]"
        role="group"
        aria-roledescription={t({ es: 'carrusel', en: 'carousel' })}
        aria-label={t({ es: 'Los cuatro principios', en: 'The four principles' })}
      >
        <ol
          className="flex py-4 transition-transform duration-700 ease-expo"
          style={{ gap: GAP, transform: `translateX(calc(50% - var(--card) / 2 - ${active} * (var(--card) + ${GAP}px)))` }}
        >
          {idea.principles.map((p, i) => {
            const Demo = DEMOS[i]
            const isActive = i === active
            return (
              <li key={p.title.es} className="w-[var(--card)] shrink-0">
                <button
                  type="button"
                  onClick={() => pick(i)}
                  aria-current={isActive}
                  aria-expanded={isActive && open}
                  className={`flex w-full flex-col rounded-[22px] border p-5 text-left outline-none transition-[opacity,transform,border-color] duration-700 ease-expo focus-visible:ring-2 focus-visible:ring-signal md:p-6 ${isActive ? 'scale-100 border-white/20 bg-white/[0.04] opacity-100' : 'scale-[0.92] border-white/[0.08] bg-white/[0.02] opacity-40 hover:opacity-70'}`}
                >
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-signal">{t({ es: 'Principio', en: 'Principle' })} 0{i + 1}</span>
                  <span className="mt-2 text-balance text-[clamp(1.25rem,1rem+0.9vw,1.75rem)] font-light leading-tight tracking-tight">{t(p.title)}</span>
                  <span className="mt-5 block min-h-[150px]">{Demo && <Demo index={reducedMotion ? 0 : themeIndex} />}</span>
                </button>
              </li>
            )
          })}
        </ol>
      </div>

      {/* Un nodo por principio, unidos por una fibra que avanza con el carrusel */}
      <div className="relative mx-auto mt-6 flex max-w-[280px] items-center justify-between">
        <span aria-hidden="true" className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-white/12" />
        <span
          aria-hidden="true"
          className="absolute left-0 top-1/2 h-px w-full origin-left -translate-y-1/2 bg-gradient-to-r from-signal to-[rgb(var(--spark))] transition-transform duration-700 ease-expo"
          style={{ transform: `translateY(-50%) scaleX(${active / (idea.principles.length - 1)})` }}
        />
        {idea.principles.map((p, i) => (
          <button
            key={p.title.es}
            type="button"
            onClick={() => pick(i)}
            aria-label={t(p.title)}
            className="relative grid h-6 w-6 place-items-center outline-none focus-visible:ring-2 focus-visible:ring-signal rounded-full"
          >
            <span className={`h-2.5 w-2.5 rounded-full border transition-all duration-500 ${i === active ? 'scale-125 border-white bg-[#fffaf0] shadow-[0_0_0_4px_rgb(var(--signal)/0.25),0_0_14px_3px_rgb(var(--signal)/0.7)]' : i < active ? 'border-white/60 bg-signal' : 'border-white/35 bg-void'}`} />
            {i === idea.principles.length - 1 && <span data-fiber-from="th-bocetos" aria-hidden="true" className="absolute left-1/2 top-1/2 h-px w-px" />}
          </button>
        ))}
      </div>

      <div className="mx-auto mt-6 min-h-[3.5rem] max-w-[52ch] text-center" aria-live="polite">
        {open && <p key={active} className="th-fade text-balance text-base leading-relaxed text-paper/70">{t(current.body)}</p>}
      </div>
    </div>
  )
}

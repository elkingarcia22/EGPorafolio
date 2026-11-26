'use client'

import { useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { THEMA_CASE } from '@/lib/content/cases/barberlytics/thema-case'
import { useTick } from './live-pieces'
import { useMedia, TABLET_QUERY } from '@/components/case/objetivos/use-media'
import { useInView } from './use-in-view'
import { inkOn, withAlpha } from './color-utils'
import { ChapterHead } from './chapter-head'

/** Las barberías que nombra el caso: la clásica de oro y carbón, la de barrio en rojo, la moderna en verde */
const SHOP_COLORS = [
  { es: 'Clásica', en: 'Classic', colors: ['#D9B36A', '#1C1915'] },
  { es: 'De barrio', en: 'Neighborhood', colors: ['#F87171', '#2A1414'] },
  { es: 'Moderna', en: 'Modern', colors: ['#059669', '#0F1F1A'] },
] as const
/** El mismo token «Positive» según cada una de las cuatro fuentes (matriz de decisión de tokens) */
const FOUR_TRUTHS = [
  { source: 'Starter', color: '#10b981' },
  { source: 'Comparativo', color: '#17B16D' },
  { source: 'Legado', color: '#328e2c' },
  { source: 'Oficial', color: '#17B16D' },
] as const
const OK = '#17b26a'
const NO = '#e5484d'
/** Cada cuánto cambia el color de la barbería en la carta del medio (ms) */
const SHOP_MS = 1800
/** Al entrar, las cartas se reparten una tras otra (ms entre cartas) */
const DEAL_MS = 140
/** Cómo queda el abanico: giro y desplazamiento de cada carta */
const FAN = [
  { rotate: -6, y: 18 },
  { rotate: 0, y: 0 },
  { rotate: 6, y: 18 },
] as const

function BrandVisual() {
  const { t } = useLocale()
  return (
    <div className="flex items-end justify-center gap-4">
      {SHOP_COLORS.map((shop) => (
        <div key={shop.es} className="flex flex-col items-center gap-2">
          <span className="relative h-12 w-12">
            <span className="absolute inset-0 rounded-full" style={{ background: shop.colors[1], boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.12)' }} />
            <span className="absolute inset-2.5 rounded-full" style={{ background: shop.colors[0] }} />
          </span>
          <span className="font-mono text-[11px] md:text-[9px] uppercase tracking-[0.12em] text-paper/50">{t(shop)}</span>
        </div>
      ))}
    </div>
  )
}

function SafeVisual() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const tick = useTick(SHOP_MS)
  const themes = THEMA_CASE.themes
  const theme = themes[reducedMotion ? 0 : tick % themes.length]
  return (
    <div className="flex flex-col items-center gap-3">
      <span className="flex h-12 items-center gap-2 rounded-xl px-4 text-sm font-medium transition-colors duration-700" style={{ background: theme.primary, color: inkOn(theme.primary) }}>
        Aa <span className="text-[11px] md:text-[10px] opacity-80">✓ {t({ es: 'contraste', en: 'contrast' })}</span>
      </span>
      <span className="flex gap-1.5">
        {[
          { es: 'Éxito', en: 'Success', color: OK },
          { es: 'Error', en: 'Error', color: NO },
        ].map((m) => (
          <span key={m.en} className="rounded-full px-2 py-0.5 text-[11px] md:text-[10px] font-medium" style={{ background: withAlpha(m.color, 0.16), color: m.color }}>{t(m)}</span>
        ))}
      </span>
    </div>
  )
}

function TruthsVisual() {
  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-2.5 md:flex md:items-end md:justify-center md:gap-3">
      {FOUR_TRUTHS.map((s) => (
        <div key={s.source} className="flex items-center gap-2 md:flex-col md:gap-2">
          <span className="h-8 w-8 shrink-0 rounded-lg md:h-10 md:w-10" style={{ background: s.color, boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.12)' }} />
          <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-paper/60 md:text-[8.5px] md:tracking-[0.08em] md:text-paper/50">{s.source}</span>
        </div>
      ))}
    </div>
  )
}

const VISUALS = [BrandVisual, SafeVisual, TruthsVisual] as const

/**
 * 01 · Los puntos de Thema: tres cartas que se reparten en abanico al entrar
 * (cada una con su prueba visual: la marca de cada barbería, el contraste que no
 * se rompe y las cuatro verdades del token «Positive»). Tocar una la levanta y
 * muestra el porqué. Debajo, las cuatro cifras; de la última sale la fibra hacia «Patrones».
 */
export function ThemaDots() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const { dots, chapters } = THEMA_CASE
  const rootRef = useRef<HTMLDivElement>(null)
  const { entered } = useInView(rootRef)
  const dealt = entered || reducedMotion
  const [open, setOpen] = useState<number | null>(null)
  // En teléfono las cartas van una debajo de otra: sin abanico
  const fanned = useMedia(TABLET_QUERY)

  return (
    <div ref={rootRef}>
      <ChapterHead phrase={t(chapters.puntos.phrase)} lead={t(chapters.puntos.lead)} />

      <ol className="swipe-row mx-auto max-w-[960px] md:grid md:grid-cols-3 md:gap-4">
        {dots.seen.map((card, i) => {
          const Visual = VISUALS[i]
          const isOpen = open === i
          const fan = fanned ? FAN[i] : { rotate: 0, y: 0 }
          return (
            <li
              key={card.title.es}
              className="transition-[transform,opacity] duration-700 ease-expo"
              style={{
                transitionDelay: dealt && !isOpen ? `${i * DEAL_MS}ms` : '0ms',
                opacity: dealt ? 1 : 0,
                transform: dealt
                  ? `translateY(${isOpen ? -14 : fan.y}px) rotate(${isOpen ? 0 : fan.rotate}deg)`
                  : `translateY(120px) rotate(${fan.rotate * 3}deg) scale(0.9)`,
              }}
            >
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : i)}
                className={`group flex h-full w-full flex-col rounded-[22px] border p-6 text-left outline-none transition-[border-color,background-color,box-shadow] duration-500 focus-visible:ring-2 focus-visible:ring-signal ${isOpen ? 'border-white/30 bg-white/[0.06] shadow-[0_30px_80px_-30px_rgb(var(--signal)/0.6)]' : 'border-white/10 bg-white/[0.025] hover:border-white/25'}`}
              >
                <span className="font-mono text-[11px] md:text-[10px] uppercase tracking-[0.18em] text-signal">0{i + 1}</span>
                <span className="mt-6 flex min-h-[86px] items-center justify-center"><Visual /></span>
                <span className="mt-6 text-balance text-[clamp(1.15rem,1rem+0.5vw,1.4rem)] font-light leading-tight tracking-tight">{t(card.title)}</span>
                {isOpen ? (
                  <span className="th-fade mt-3 text-sm leading-relaxed text-paper/70">{t(card.body)}</span>
                ) : (
                  <span className="mt-3 font-mono text-[11px] md:text-[10px] uppercase tracking-[0.16em] text-paper/35 transition-colors group-hover:text-paper/60">{t({ es: 'Ver el porqué', en: 'See why' })} +</span>
                )}
              </button>
            </li>
          )
        })}
      </ol>

      {/* Las cifras del punto de partida, unidas por una fibra */}
      <dl className="relative mx-auto mt-[clamp(3.5rem,3rem+2vw,5rem)] grid max-w-[900px] grid-cols-2 gap-y-10 md:grid-cols-4">
        <span aria-hidden="true" className="absolute inset-x-[12.5%] top-[5px] hidden h-px bg-gradient-to-r from-[#D9B36A]/60 via-white/20 to-[#3F72D8]/60 md:block" />
        {dots.stats.map((stat, i) => (
          <div key={stat.label.es} className="relative flex flex-col items-center text-center">
            <span aria-hidden="true" className="relative mb-5 h-2.5 w-2.5 rounded-full border border-white/60 bg-signal shadow-[0_0_12px_2px_rgb(var(--signal)/0.6)]">
              {i === dots.stats.length - 1 && <span data-fiber-from="th-patrones" className="absolute left-1/2 top-1/2 h-px w-px" />}
            </span>
            <dt className="order-last mt-3 max-w-[16ch] text-balance text-sm leading-snug text-paper/60">{t(stat.label)}</dt>
            <dd className="text-[clamp(2.4rem,1.6rem+2.6vw,4rem)] font-light leading-none tabular-nums">{stat.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

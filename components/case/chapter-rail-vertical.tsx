'use client'

import { TransitionLink } from '@/components/transition/page-transition'
import { useLocale, type L } from '@/lib/i18n'
import type { ChapterMeta } from './chapter'

export interface RailBack {
  href: string
  label: L
}

interface ChapterRailVerticalProps {
  chapters: readonly ChapterMeta[]
  label: string
  active: number
  shown: boolean
  back: RailBack
  fillRef: React.Ref<HTMLSpanElement>
  onGo: (id: string) => (event: React.MouseEvent) => void
}

/**
 * El índice en escritorio: una columna angosta fija a la izquierda. Arriba, volver a
 * proyectos; debajo, la fibra vertical con un nodo por capítulo (solo números) y, al
 * pie, el nombre del capítulo en lectura. Mismo diseño de nodos que la línea horizontal.
 */
export function ChapterRailVertical({ chapters, label, active, shown, back, fillRef, onGo }: ChapterRailVerticalProps) {
  const { t } = useLocale()
  const current = chapters[active]

  return (
    <nav
      aria-label={label}
      aria-hidden={!shown || undefined}
      className={`fixed left-[var(--gutter)] top-1/2 z-30 hidden w-[72px] -translate-y-1/2 flex-col items-start transition-[opacity,transform] duration-500 ease-expo lg:flex ${shown ? 'translate-x-0 opacity-100' : 'pointer-events-none -translate-x-3 opacity-0'}`}
    >
      <TransitionLink
        href={back.href}
        transitionLabel={t(back.label)}
        aria-label={t(back.label)}
        className="group/back mb-8 flex flex-col items-start gap-2"
      >
        <span aria-hidden="true" className="grid h-8 w-8 place-items-center rounded-full border border-white/15 bg-[rgb(var(--void)/0.6)] text-sm backdrop-blur-md transition-[border-color,transform] duration-500 ease-expo group-hover/back:-translate-x-0.5 group-hover/back:border-white/40">
          ←
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.18em] opacity-50 transition-opacity duration-300 group-hover/back:opacity-90">{t(back.label)}</span>
      </TransitionLink>

      <div className="relative">
        {/* La fibra: tenue de fondo y, encima, el tramo por el que ya pasó la señal */}
        <span aria-hidden="true" className="absolute bottom-[5px] left-[5px] top-[5px] w-px bg-white/12" />
        <span
          ref={fillRef}
          aria-hidden="true"
          className="absolute bottom-[5px] left-[5px] top-[5px] w-px origin-top bg-gradient-to-b from-signal via-[rgb(var(--glow))] to-[rgb(var(--spark))] shadow-[0_0_10px_rgb(var(--signal)/0.7)] transition-transform duration-300 ease-out"
          style={{ transform: 'scaleY(0)' }}
        />
        <ol className="relative flex flex-col gap-[18px]">
          {chapters.map((c, i) => {
            const state = i === active ? 'active' : i < active ? 'past' : 'next'
            return (
              <li key={c.id}>
                <a
                  href={`#${c.id}`}
                  aria-current={state === 'active' ? 'true' : undefined}
                  aria-label={`${c.index} · ${c.title}`}
                  title={c.title}
                  data-state={state}
                  onClick={onGo(c.id)}
                  className="group/node flex items-center gap-3"
                >
                  <span className="relative grid h-[11px] w-[11px] shrink-0 place-items-center" aria-hidden="true">
                    <span className="absolute inset-0 rounded-full border border-white/30 bg-void transition-all duration-500 ease-expo group-hover/node:border-white/80 group-data-[state=past]/node:border-white/50 group-data-[state=past]/node:bg-white/50 group-data-[state=active]/node:scale-125 group-data-[state=active]/node:border-white group-data-[state=active]/node:bg-[#fffaf0] group-data-[state=active]/node:shadow-[0_0_0_4px_rgb(var(--signal)/0.25),0_0_18px_3px_rgb(var(--signal)/0.75)]" />
                    <span className="absolute inset-[-6px] rounded-full border border-signal/60 opacity-0 group-data-[state=active]/node:animate-[nav-node-ping_2.4s_cubic-bezier(0,0,.2,1)_infinite]" />
                  </span>
                  <span className="font-mono text-[10px] tabular-nums opacity-40 transition-opacity duration-300 group-hover/node:opacity-80 group-data-[state=active]/node:opacity-100">{c.index}</span>
                </a>
              </li>
            )
          })}
        </ol>
      </div>

      {/* El capítulo en lectura, al pie de la fibra */}
      <span key={current?.id} aria-hidden="true" className="brand-title mt-6 block max-w-[72px] animate-[bl-fade-in_0.5s_ease-out] text-[9px] leading-relaxed">
        {current?.title}
      </span>
    </nav>
  )
}

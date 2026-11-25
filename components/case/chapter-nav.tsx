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

/** Dónde se considera "en lectura" un capítulo (fracción del alto de pantalla) */
const READ_LINE = '50%'

interface ChapterNavProps {
  chapters: readonly ChapterMeta[]
  label: string
  back?: BackLink
}

/**
 * Índice de un caso como una fibra con neuronas: cada capítulo es un nodo y la
 * señal baja por la fibra con el scroll, hasta el capítulo que se lee (se
 * enciende y muestra su nombre; los demás, solo su número). Tocar un nodo lleva
 * a ese capítulo. En teléfono es una cápsula flotante con los nodos en fila.
 */
export function ChapterNav({ chapters, label, back = TO_PROJECTS }: ChapterNavProps) {
  const { t } = useLocale()
  const [active, setActive] = useState(0)
  const listRef = useRef<HTMLOListElement>(null)
  const fillRef = useRef<HTMLSpanElement>(null)
  const dotsFillRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const list = listRef.current
    /** Centro vertical de cada nodo dentro de la lista (px) */
    const centers = () =>
      Array.from(list?.querySelectorAll<HTMLElement>('[data-nav-node]') ?? []).map((n) => n.offsetTop + n.offsetHeight / 2)
    let ys = centers()
    const paint = (index: number, progress: number) => {
      const from = ys[index] ?? 0
      const to = ys[index + 1] ?? from
      if (fillRef.current) fillRef.current.style.transform = `translateY(0) scaleY(${(from + (to - from) * progress) / Math.max(1, list?.offsetHeight ?? 1)})`
      if (dotsFillRef.current) dotsFillRef.current.style.transform = `scaleX(${(index + progress) / Math.max(1, chapters.length - 1)})`
    }
    const onRefresh = () => {
      ys = centers()
    }
    ScrollTrigger.addEventListener('refresh', onRefresh)
    const triggers = chapters.map((c, i) =>
      ScrollTrigger.create({
        trigger: `#${c.id}`,
        start: `top ${READ_LINE}`,
        end: `bottom ${READ_LINE}`,
        onToggle: (self) => {
          if (self.isActive) setActive(i)
        },
        onUpdate: (self) => paint(i, i < chapters.length - 1 ? self.progress : 0),
      }),
    )
    return () => {
      ScrollTrigger.removeEventListener('refresh', onRefresh)
      triggers.forEach((tr) => tr.kill())
    }
  }, [chapters])

  const go = (id: string) => (event: React.MouseEvent) => {
    event.preventDefault()
    scrollToTarget(`#${id}`)
  }
  const current = chapters[active]

  return (
    <>
      <nav aria-label={label} className="sticky top-28 hidden md:block">
        <TransitionLink
          href={back.href}
          transitionLabel={t(back.label)}
          className="group mb-10 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-3.5 py-1.5 backdrop-blur-md transition-colors duration-300 hover:border-white/30"
        >
          <span className="transition-transform duration-500 ease-expo group-hover:-translate-x-1" aria-hidden="true">←</span>
          <span className="mono-label opacity-70 group-hover:opacity-100">{t(back.label)}</span>
        </TransitionLink>

        <div className="relative">
          {/* La fibra: tenue de fondo y, encima, la parte por la que ya pasó la señal */}
          <span className="absolute bottom-[6px] left-[5px] top-[6px] w-px bg-white/12" aria-hidden="true" />
          <span
            ref={fillRef}
            aria-hidden="true"
            className="absolute left-[5px] top-0 h-full w-px origin-top bg-gradient-to-b from-signal via-[#7f8fff] to-[#ff54aa] shadow-[0_0_10px_rgb(var(--signal)/0.7)] transition-transform duration-300 ease-out"
            style={{ transform: 'scaleY(0)' }}
          />
          <ol ref={listRef} className="relative space-y-6">
            {chapters.map((c, i) => {
              const state = i === active ? 'active' : i < active ? 'past' : 'next'
              return (
                <li key={c.id}>
                  <a
                    href={`#${c.id}`}
                    aria-current={state === 'active' ? 'true' : undefined}
                    data-state={state}
                    onClick={go(c.id)}
                    className="group/node flex items-center gap-4"
                  >
                    {/* Nodo: apagado, ya recorrido o encendido (con su anillo que late) */}
                    <span data-nav-node className="relative grid h-[11px] w-[11px] shrink-0 place-items-center" aria-hidden="true">
                      <span className="absolute inset-0 rounded-full border border-white/30 bg-void transition-all duration-500 ease-expo group-data-[state=past]/node:border-white/50 group-data-[state=past]/node:bg-white/50 group-data-[state=active]/node:scale-125 group-data-[state=active]/node:border-signal group-data-[state=active]/node:bg-signal group-data-[state=active]/node:shadow-[0_0_0_5px_rgb(var(--signal)/0.18),0_0_18px_3px_rgb(var(--signal)/0.7)] group-hover/node:border-white/80" />
                      <span className="absolute inset-[-6px] rounded-full border border-signal/60 opacity-0 group-data-[state=active]/node:animate-[nav-node-ping_2.4s_cubic-bezier(0,0,.2,1)_infinite]" />
                    </span>
                    <span className="mono-label tabular-nums opacity-40 transition-opacity duration-300 group-hover/node:opacity-80 group-data-[state=active]/node:opacity-100">{c.index}</span>
                    {/* Solo el capítulo en lectura muestra su nombre; los demás, al pasar el cursor */}
                    <span className="brand-title -translate-x-2 whitespace-nowrap text-[11px] opacity-0 transition-all duration-500 ease-expo group-hover/node:translate-x-0 group-hover/node:opacity-60 group-data-[state=active]/node:translate-x-0 group-data-[state=active]/node:opacity-100">
                      {c.title}
                    </span>
                  </a>
                </li>
              )
            })}
          </ol>
        </div>
      </nav>

      {/* Teléfono: cápsula flotante con los nodos en fila y el capítulo en lectura */}
      <nav aria-label={label} className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-16 md:hidden">
        <div className="flex max-w-full items-center gap-3 rounded-full border border-white/12 bg-[rgb(var(--void)/0.78)] px-4 py-2.5 shadow-[0_10px_30px_-10px_rgb(0_0_0/0.8)] backdrop-blur-xl">
          <span className="relative flex items-center gap-[9px]">
            <span className="absolute inset-x-[3px] top-1/2 h-px -translate-y-1/2 bg-white/15" aria-hidden="true" />
            <span
              ref={dotsFillRef}
              aria-hidden="true"
              className="absolute inset-x-[3px] top-1/2 h-px -translate-y-1/2 origin-left bg-gradient-to-r from-signal to-[#ff54aa] transition-transform duration-300"
              style={{ transform: 'scaleX(0)' }}
            />
            {chapters.map((c, i) => (
              <a
                key={c.id}
                href={`#${c.id}`}
                onClick={go(c.id)}
                aria-label={`${c.index} · ${c.title}`}
                aria-current={i === active ? 'true' : undefined}
                className={`relative block rounded-full transition-all duration-500 ease-expo ${i === active ? 'h-[9px] w-[9px] bg-signal shadow-[0_0_10px_2px_rgb(var(--signal)/0.7)]' : i < active ? 'h-[6px] w-[6px] bg-white/60' : 'h-[6px] w-[6px] border border-white/35 bg-void'}`}
              />
            ))}
          </span>
          <span className="brand-title max-w-[9rem] truncate text-[10px]">{current?.title}</span>
        </div>
      </nav>
    </>
  )
}

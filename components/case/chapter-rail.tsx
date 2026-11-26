'use client'

import { useEffect, useRef, useState } from 'react'
import { ScrollTrigger, scrollToTarget } from '@/lib/motion'
import type { ChapterMeta } from './chapter'
import { ChapterRailVertical, type RailBack } from './chapter-rail-vertical'

/** Dónde se considera "en lectura" un capítulo (fracción del alto de pantalla) */
const READ_LINE = '45%'
/** Altura (desde arriba) a la que debe llegar la etiqueta del primer capítulo para mostrar la línea */
const SHOW_AT = '22%'

/** Por defecto el índice lleva de vuelta a la lista de proyectos de la portada. */
const TO_PROJECTS: RailBack = { href: '/#work', label: { es: 'Proyectos', en: 'Projects' } }

interface ChapterRailProps {
  chapters: readonly ChapterMeta[]
  label: string
  back?: RailBack
}

/**
 * Índice de un caso como la fibra de Proceso del inicio: en escritorio, una columna
 * angosta fija a la izquierda (ver <ChapterRailVertical>); en pantallas chicas, una
 * línea horizontal con un nodo por capítulo que se queda fija arriba. La señal
 * avanza por la línea con la lectura; el capítulo en lectura se enciende y
 * muestra su nombre. Tocar un nodo lleva a ese capítulo.
 */
export function ChapterRail({ chapters, label, back = TO_PROJECTS }: ChapterRailProps) {
  const [active, setActive] = useState(0)
  // Solo aparece cuando la lectura ya entró al primer capítulo (y se va al terminar el último)
  const [shown, setShown] = useState(false)
  const fillRef = useRef<HTMLSpanElement>(null)
  const columnFillRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const last = Math.max(1, chapters.length - 1)
    const paint = (index: number, progress: number) => {
      const k = Math.min(1, (index + progress) / last)
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${k})`
      if (columnFillRef.current) columnFillRef.current.style.transform = `scaleY(${k})`
    }
    const triggers = chapters.map((c, i) =>
      ScrollTrigger.create({
        trigger: `#${c.id}`,
        start: `top ${READ_LINE}`,
        end: `bottom ${READ_LINE}`,
        onToggle: (self) => {
          if (self.isActive) setActive(i)
        },
        onUpdate: (self) => paint(i, i < last ? self.progress : 0),
      }),
    )
    // Aparece cuando la etiqueta del primer capítulo sube hasta arriba (ya se está leyendo), no antes
    const firstLabel = document.querySelector(`#${chapters[0]?.id} [data-lit]`) ?? `#${chapters[0]?.id}`
    const range = ScrollTrigger.create({
      trigger: firstLabel,
      endTrigger: `#${chapters[chapters.length - 1]?.id}`,
      start: `top ${SHOW_AT}`,
      end: 'bottom 30%',
      onToggle: (self) => setShown(self.isActive),
    })
    return () => {
      triggers.forEach((tr) => tr.kill())
      range.kill()
    }
  }, [chapters])

  const go = (id: string) => (event: React.MouseEvent) => {
    event.preventDefault()
    scrollToTarget(`#${id}`)
  }

  return (
    <>
    <ChapterRailVertical chapters={chapters} label={label} active={active} shown={shown} back={back} fillRef={columnFillRef} onGo={go} />
    {/* Alto cero: fija arriba sin ocupar lugar en la página, así no deja una franja antes del primer capítulo. */}
    <nav aria-label={label} aria-hidden={!shown || undefined} className="sticky top-[72px] z-30 hidden h-0 md:block lg:hidden">
      <div className={`relative -mx-[var(--gutter)] px-[var(--gutter)] pb-10 pt-4 transition-[opacity,transform] duration-500 ease-expo ${shown ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-3 opacity-0'}`}>
      {/* Velo que se desvanece hacia abajo, sin borde, para que la línea se lea sobre el contenido */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-[72px] bottom-0 bg-gradient-to-b from-[rgb(var(--void)/0.9)] from-50% to-transparent" />
      <div className="relative mx-auto max-w-5xl">
        <div className="relative">
          {/* La fibra: tenue de fondo y, encima, el tramo por el que ya pasó la señal */}
          <span aria-hidden="true" className="absolute inset-x-[5px] top-[5px] h-px bg-white/12" />
          <span
            ref={fillRef}
            aria-hidden="true"
            className="absolute inset-x-[5px] top-[5px] h-px origin-left bg-gradient-to-r from-signal via-[rgb(var(--glow))] to-[rgb(var(--spark))] shadow-[0_0_10px_rgb(var(--signal)/0.7)] transition-transform duration-300 ease-out"
            style={{ transform: 'scaleX(0)' }}
          />
          <ol className="relative flex justify-between">
            {chapters.map((c, i) => {
              const state = i === active ? 'active' : i < active ? 'past' : 'next'
              return (
                <li key={c.id} className="relative flex w-[11px] justify-center">
                  <a
                    href={`#${c.id}`}
                    aria-current={state === 'active' ? 'true' : undefined}
                    aria-label={`${c.index} · ${c.title}`}
                    data-state={state}
                    onClick={go(c.id)}
                    className="group/node flex flex-col items-center"
                  >
                    <span className="relative grid h-[11px] w-[11px] place-items-center" aria-hidden="true">
                      <span className="absolute inset-0 rounded-full border border-white/30 bg-void transition-all duration-500 ease-expo group-hover/node:border-white/80 group-data-[state=past]/node:border-white/50 group-data-[state=past]/node:bg-white/50 group-data-[state=active]/node:scale-125 group-data-[state=active]/node:border-white group-data-[state=active]/node:bg-[#fffaf0] group-data-[state=active]/node:shadow-[0_0_0_4px_rgb(var(--signal)/0.25),0_0_18px_3px_rgb(var(--signal)/0.75)]" />
                      <span className="absolute inset-[-6px] rounded-full border border-signal/60 opacity-0 group-data-[state=active]/node:animate-[nav-node-ping_2.4s_cubic-bezier(0,0,.2,1)_infinite]" />
                    </span>
                    <span className="mt-2 font-mono text-[11px] tabular-nums opacity-40 transition-opacity duration-300 group-hover/node:opacity-80 group-data-[state=active]/node:opacity-100">{c.index}</span>
                    {/* El nombre: solo el capítulo en lectura (y al pasar el cursor en escritorio) */}
                    <span className="brand-title pointer-events-none absolute top-[38px] whitespace-nowrap text-[11px] opacity-0 transition-all duration-500 ease-expo group-hover/node:opacity-60 group-data-[state=active]/node:opacity-100 max-md:group-hover/node:opacity-0 max-md:group-data-[state=active]/node:opacity-100">
                      {c.title}
                    </span>
                  </a>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
      </div>
    </nav>
    </>
  )
}

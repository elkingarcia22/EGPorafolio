'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { OBJ_CASE } from '@/lib/content/cases/objetivos/objetivos-case'

/** Tiempo en cada pestaña mientras pasan solas (ms) */
const TAB_MS = 4200
/** Cuántas hojas se asoman detrás de la del frente */
const BEHIND = 3
/** Cuánto se asoma por debajo cada hoja de atrás (px) y cuánto se achica */
const STACK = { lift: 16, shrink: 0.035 }

/**
 * Las siete pestañas reales de Resultados como una carpeta de hojas con
 * separadores: la del frente es la captura entera; detrás se asoman las
 * siguientes, y arriba quedan todos los separadores para saltar a cualquiera.
 * Pasan solas (se detienen con el cursor encima).
 */
export function ResultsFolder() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const tabs = OBJ_CASE.form.tabs
  const rootRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [hover, setHover] = useState(false)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: '0px 0px -25% 0px' })
    observer.observe(root)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!inView || hover || reducedMotion) return
    const id = window.setTimeout(() => setActive((a) => (a + 1) % tabs.length), TAB_MS)
    return () => window.clearTimeout(id)
  }, [inView, hover, reducedMotion, active, tabs.length])

  const current = tabs[active]

  return (
    <div ref={rootRef} className="mx-auto w-full max-w-[980px]" onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)}>
      {/* Los separadores: uno por pestaña, como en una carpeta */}
      <div role="tablist" aria-label={t({ es: 'Pestañas de Resultados', en: 'Results tabs' })} className="relative z-20 grid grid-cols-7 gap-1 px-2">
        {tabs.map((tab, i) => {
          const on = i === active
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setActive(i)}
              className={`truncate rounded-t-xl border border-b-0 px-1.5 pb-2 pt-2 text-center font-mono text-[10px] uppercase tracking-[0.08em] transition-all duration-500 ease-expo md:px-2 md:text-[11px] ${on ? 'translate-y-0 border-white/20 bg-white text-[#0b0d16]' : 'translate-y-1.5 border-white/10 bg-white/[0.06] text-paper/60 hover:translate-y-0.5 hover:text-paper'}`}
            >
              <span className="md:hidden">0{i + 1}</span>
              <span className="hidden md:inline">{t(tab.label)}</span>
            </button>
          )
        })}
      </div>

      {/* Las hojas: la del frente entera, y detrás se asoman las que siguen */}
      <div className="relative mb-12 aspect-[16/10] w-full">
        {tabs.map((tab, i) => {
          const d = (i - active + tabs.length) % tabs.length
          const visible = d <= BEHIND
          return (
            <figure
              key={tab.id}
              aria-hidden={d !== 0}
              className="absolute inset-0 overflow-hidden rounded-2xl border border-white/10 bg-white shadow-[0_30px_80px_-30px_rgb(0_0_0/0.9)] transition-[transform,opacity] duration-700 ease-expo"
              style={{
                zIndex: tabs.length - d,
                opacity: visible ? 1 - d * 0.22 : 0,
                transform: `translateY(${d * STACK.lift}px) scale(${1 - d * STACK.shrink})`,
                transformOrigin: '50% 100%',
              }}
            >
              <Image src={tab.shot.src} alt={t(tab.shot.alt)} fill sizes="(min-width: 980px) 980px, 100vw" className="object-cover object-top" />
              {/* Las de atrás se oscurecen un poco: la del frente manda */}
              <span aria-hidden="true" className="absolute inset-0 bg-[#0b0d16] transition-opacity duration-700" style={{ opacity: d === 0 ? 0 : 0.35 }} />
            </figure>
          )
        })}
      </div>

      {/* Qué muestra la pestaña del frente, en una línea */}
      <p key={current.id} aria-live="polite" className="obj-fade text-center">
        <span className="mono-label text-signal">0{active + 1} · {t(current.label)}</span>
        <span className="mt-2 block text-balance text-sm text-paper/65 md:text-base">{t(current.shot.caption)}</span>
      </p>
    </div>
  )
}

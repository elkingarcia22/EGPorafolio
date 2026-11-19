'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import type { Shot } from '@/lib/content/cases/objetivos/objetivos-case'
import type { Spot } from './form-spots'

const TOUR_MS = 3400
const MAX_ZOOM = 2.1

/** Acerca y centra la zona sin dejar bordes vacíos: escala según su tamaño y traslada hasta su centro. */
function framing(s: Spot): string {
  const scale = Math.min(MAX_ZOOM, Math.max(1.12, 82 / Math.max(s.w, s.h)))
  const limit = (scale - 1) * 50
  const clamp = (v: number) => Math.max(-limit, Math.min(limit, v))
  const tx = clamp(scale * (50 - (s.x + s.w / 2)))
  const ty = clamp(scale * (50 - (s.y + s.h / 2)))
  return `translate(${tx.toFixed(2)}%, ${ty.toFixed(2)}%) scale(${scale.toFixed(3)})`
}

interface ShotStageProps {
  shot: Shot
  spots: readonly Spot[]
  /** Ruta que se muestra en la barra del navegador. */
  url?: string
  /** Se llama cuando el recorrido automático termina de pasar por todas las zonas. */
  onTourEnd?: () => void
}

/**
 * Una captura real puesta en escena: el navegador flota inclinado sobre un fondo
 * oscuro y recorre sus zonas una a una, acercándose a cada una mientras la
 * leyenda explica qué hay ahí. Al tocar una zona o un punto de la leyenda, el
 * recorrido se detiene y queda lo que se eligió.
 */
export function ShotStage({ shot, spots, url = 'playground · /admin/desempeno-cultura/objetivos', onTourEnd }: ShotStageProps) {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const [active, setActive] = useState<number | null>(null)
  const [touring, setTouring] = useState(true)
  const [tick, setTick] = useState(0)
  const [inView, setInView] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // El recorrido arranca cuando la pantalla entra en vista, no antes.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.45 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Recorrido: vista completa → zona 1 → … → zona n → vista completa.
  useEffect(() => {
    if (!touring || reducedMotion || !inView) return
    const id = window.setTimeout(() => {
      if (active === null && tick > 0) {
        onTourEnd?.()
        setTouring(false)
        return
      }
      setActive((a) => (a === null ? 0 : a + 1 < spots.length ? a + 1 : null))
      setTick((n) => n + 1)
    }, active === null ? 1400 : TOUR_MS)
    return () => window.clearTimeout(id)
  }, [touring, reducedMotion, inView, active, tick, spots.length, onTourEnd])

  const choose = (i: number | null) => {
    setTouring(false)
    setActive((a) => (a === i ? null : i))
  }

  const spot = active === null ? null : spots[active]
  const zoomed = spot !== null && !reducedMotion

  return (
    <div ref={ref} className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.75fr)_minmax(0,1fr)]">
      <div className="relative overflow-hidden rounded-3xl bg-[#0b0d16] p-4 md:p-8">
        <span className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-signal opacity-30 blur-3xl" aria-hidden="true" />
        <span className="pointer-events-none absolute -bottom-32 left-10 h-72 w-72 rounded-full bg-[#7b5cff] opacity-20 blur-3xl" aria-hidden="true" />
        <div className="group relative [perspective:1600px]">
          <div className="overflow-hidden rounded-xl bg-white shadow-[0_50px_100px_-30px_rgba(0,0,0,0.85)] ring-1 ring-white/15 transition-transform duration-1000 ease-expo [transform:rotateX(5deg)_rotateY(-4deg)] group-hover:[transform:none]">
            <div className="flex items-center gap-1.5 border-b border-black/5 bg-[#f4f5f8] px-3 py-2" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-3 h-5 flex-1 truncate rounded-md bg-black/[0.05] px-2 font-mono text-[10px] leading-5 text-black/45">{url}</span>
            </div>
            <div className="relative overflow-hidden">
              <div className="relative transition-transform duration-[1100ms] ease-expo" style={{ transform: zoomed && spot ? framing(spot) : 'none' }}>
                <Image src={shot.src} width={2000} height={1250} alt={t(shot.alt)} sizes="(min-width: 1024px) 55vw, 100vw" className="block h-auto w-full" />
                {spots.map((s, i) => (
                  <button
                    key={s.title.es}
                    type="button"
                    onClick={() => choose(i)}
                    aria-label={t(s.title)}
                    aria-pressed={active === i}
                    className={`absolute rounded-lg transition-[background-color,box-shadow,opacity] duration-500 ${active === i ? 'bg-signal/10 ring-2 ring-signal' : active === null ? 'ring-[1.5px] ring-signal/60 hover:bg-signal/10' : 'opacity-0'}`}
                    style={{ left: `${s.x}%`, top: `${s.y}%`, width: `${s.w}%`, height: `${s.h}%` }}
                  >
                    <span className="absolute -left-2.5 -top-2.5 grid h-5 w-5 place-items-center rounded-full bg-signal font-mono text-[10px] text-paper shadow-[0_0_0_4px_rgba(64,96,255,0.25)]">
                      {i + 1}
                    </span>
                  </button>
                ))}
              </div>
              {/* Lo que queda fuera de la zona se apaga un poco para que la vista vaya a ella. */}
              <span className={`pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(11,13,22,0.35))] transition-opacity duration-700 ${zoomed ? 'opacity-100' : 'opacity-0'}`} aria-hidden="true" />
            </div>
          </div>
        </div>
        <p className="relative mt-5 flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.14em] text-white/50">
          <span>{touring && !reducedMotion ? t({ es: 'Recorriendo la pantalla', en: 'Touring the screen' }) : t({ es: 'Toca una zona', en: 'Tap an area' })}</span>
          <button type="button" onClick={() => choose(null)} className={`transition-opacity hover:text-white ${active === null ? 'opacity-0' : 'opacity-100'}`} tabIndex={active === null ? -1 : 0}>
            {t({ es: 'Ver completa', en: 'Full view' })} ↺
          </button>
        </p>
      </div>

      <ol className="space-y-2">
        {spots.map((s, i) => (
          <li key={s.title.es}>
            <button
              type="button"
              onClick={() => choose(i)}
              onMouseEnter={() => {
                setTouring(false)
                setActive(i)
              }}
              className={`relative flex w-full gap-4 overflow-hidden border-l-2 py-3 pl-4 text-left transition-colors duration-300 ${active === i ? 'border-signal bg-fg/[0.04]' : 'border-fg/15 hover:border-fg/40'}`}
            >
              <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full font-mono text-[11px] transition-colors ${active === i ? 'bg-signal text-paper' : 'bg-fg/10'}`}>{i + 1}</span>
              <span>
                <span className="block font-medium">{t(s.title)}</span>
                {active === i && <span className="obj-fade mt-1 block text-sm leading-relaxed opacity-70">{t(s.body)}</span>}
              </span>
              {active === i && touring && !reducedMotion && (
                <span key={tick} className="obj-progress absolute bottom-0 left-0 h-px w-full origin-left bg-signal" style={{ animationDuration: `${TOUR_MS}ms` }} aria-hidden="true" />
              )}
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}

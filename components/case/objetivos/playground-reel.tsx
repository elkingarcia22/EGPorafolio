'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { DESKTOP_QUERY, useMedia } from './use-media'
import { MINI_PAGES } from './playground-mini'

/** Proporción de la ventana del navegador (alto / ancho). */
const FRAME = 10 / 16

/** Debajo de lg, cada cuánto pasa sola a la siguiente página mientras nadie toque las pestañas. */
const MINI_MS = 7000

interface Page {
  id: string
  label: L
  path: string
  src: string
  w: number
  h: number
  note: L
}

/** Capturas de página completa del staging (1440 px de ancho, 1,5×), tomadas el 19 nov 2026. */
const PAGES: readonly Page[] = [
  { id: 'inicio', label: { es: 'Inicio', en: 'Home' }, path: '/objetivos', src: '/cases/objetivos/tall-inicio.webp', w: 2160, h: 1913, note: { es: 'Para atender, el pulso contra ciclos anteriores y la lista de ciclos.', en: 'To attend, the pulse against past cycles and the cycle list.' } },
  { id: 'resumen', label: { es: 'Resumen', en: 'Summary' }, path: '/objetivos/compania-2026-trimestres/resultados', src: '/cases/objetivos/tall-resumen.webp', w: 2160, h: 4644, note: { es: 'Cómo va, desempeño y objetivos, dónde mirar, dónde se juega el ciclo y qué hacer.', en: 'How it’s going, performance and goals, where to look, where it’s played and what to do.' } },
  { id: 'alineacion', label: { es: 'Alineación', en: 'Alignment' }, path: '/resultados · Alineación', src: '/cases/objetivos/tall-alineacion.webp', w: 2160, h: 2606, note: { es: 'Peso alineado, el mapa de área a objetivo de empresa y el aporte de cada uno.', en: 'Aligned weight, the area-to-company-goal map and each one’s contribution.' } },
  { id: 'ranking', label: { es: 'Ranking', en: 'Ranking' }, path: '/resultados · Ranking', src: '/cases/objetivos/tall-ranking.webp', w: 2160, h: 5475, note: { es: 'Pulso de reporte, podio por área, rachas y el mensaje listo para Slack, Teams o WhatsApp.', en: 'Reporting pulse, podium by area, streaks and the message ready for Slack, Teams or WhatsApp.' } },
]

/**
 * 5.3 · El playground real, sin recortes ni zoom: cada página entera baja sola
 * dentro del navegador, a su tamaño nativo, y un minimapa al lado marca qué
 * parte se está viendo. Al pasar el cursor se detiene.
 */
export function PlaygroundReel() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const [active, setActive] = useState(1)
  const desktop = useMedia(DESKTOP_QUERY)
  const [auto, setAuto] = useState(true)
  const [inView, setInView] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const page = PAGES[active]
  // Lo que se ve de la página: el alto de la ventana sobre el alto de la captura, a igual ancho.
  const visible = Math.min(1, (FRAME * page.w) / page.h)
  const shift = `${-(1 - visible) * 100}%`
  const rectShift = `${((1 - visible) / visible) * 100}%`
  const seconds = Math.max(10, Math.round(page.h / 180))
  const motion = !reducedMotion && visible < 1

  useEffect(() => {
    const el = ref.current
    if (!el || desktop) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.4 })
    io.observe(el)
    return () => io.disconnect()
  }, [desktop])

  // Teléfono y tableta: las piezas se recorren solas (como los pasos de Encuestas) hasta que alguien toca.
  useEffect(() => {
    if (desktop || !auto || !inView || reducedMotion) return
    const id = window.setTimeout(() => setActive((i) => (i + 1) % PAGES.length), MINI_MS)
    return () => window.clearTimeout(id)
  }, [active, auto, inView, desktop, reducedMotion])

  return (
    <div ref={ref} data-reveal="device" className="relative overflow-hidden rounded-3xl bg-[#0b0d16] p-4 text-white md:p-8">
      <span className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#0c5bef] opacity-25 blur-3xl" aria-hidden="true" />

      <div role="tablist" aria-label={t({ es: 'Páginas del playground', en: 'Playground pages' })} className="relative mb-5 flex flex-wrap gap-2">
        {PAGES.map((p, i) => (
          <button
            key={p.id}
            type="button"
            role="tab"
            aria-selected={i === active}
            onClick={() => {
              setAuto(false)
              setActive(i)
            }}
            className="relative overflow-hidden rounded-full border border-white/15 px-4 py-1.5 text-[13px] text-white/60 transition-colors hover:text-white aria-selected:border-white aria-selected:bg-white aria-selected:text-[#0b0d16]"
          >
            {t(p.label)}
            {!desktop && i === active && auto && inView && !reducedMotion && (
              <span key={active} className="obj-progress absolute inset-x-3 bottom-0.5 h-0.5 origin-left rounded-full bg-[#0c5bef]" style={{ animationDuration: `${MINI_MS}ms` }} aria-hidden="true" />
            )}
          </button>
        ))}
      </div>

      {desktop ? (
      <div className="group relative grid gap-5 md:grid-cols-[minmax(0,1fr)_88px]" style={{ ['--obj-shift' as string]: shift, ['--obj-rect-shift' as string]: rectShift }}>
        {/* La ventana: la página entera se desplaza adentro, sin escalarse más allá de su resolución. */}
        <div className="overflow-hidden rounded-xl bg-white shadow-[0_50px_100px_-30px_rgba(0,0,0,0.85)] ring-1 ring-white/10">
          <div className="flex items-center gap-1.5 border-b border-black/5 bg-[#f4f5f8] px-3 py-2" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            <span className="ml-3 h-5 flex-1 truncate rounded-md bg-black/[0.05] px-2 font-mono text-[10px] leading-5 text-black/45">staging-playground.ubits.co{page.path}</span>
          </div>
          <div className="relative overflow-hidden" style={{ aspectRatio: `${1 / FRAME}` }}>
            <div key={page.id} className={`absolute inset-x-0 top-0 ${motion ? 'obj-pan group-hover:[animation-play-state:paused]' : ''}`} style={{ animationDuration: `${seconds}s` }}>
              <Image src={page.src} width={page.w} height={page.h} alt={t(page.label)} sizes="(min-width: 1024px) 60vw, 100vw" quality={90} className="obj-fade block h-auto w-full" />
            </div>
          </div>
        </div>

        {/* El minimapa: la página entera en chico y el recuadro de lo que se ve. */}
        <div className="hidden md:block">
          <div className="relative overflow-hidden rounded-md ring-1 ring-white/20">
            <Image key={page.id} src={page.src} width={page.w} height={page.h} alt="" sizes="88px" className="obj-fade block h-auto w-full opacity-70" />
            <span
              className={`absolute inset-x-0 top-0 rounded-sm border-2 border-[#0c5bef] bg-[#0c5bef]/15 ${motion ? 'obj-pan-rect group-hover:[animation-play-state:paused]' : ''}`}
              style={{ height: `${visible * 100}%`, animationDuration: `${seconds}s` }}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
      ) : (
        /* Teléfono y tableta: la pieza clave de cada página, recreada en HTML para que se lea. */
        <div className="relative overflow-hidden rounded-xl bg-[#f4f5f8] shadow-[0_50px_100px_-30px_rgba(0,0,0,0.85)] ring-1 ring-white/10">
          <div className="flex min-w-0 items-center gap-1.5 border-b border-black/5 px-3 py-2" aria-hidden="true">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#28c840]" />
            <span className="ml-2 min-w-0 flex-1 truncate rounded-md bg-black/[0.05] px-2 font-mono text-[11px] leading-5 text-black/45">staging-playground.ubits.co{page.path}</span>
          </div>
          {/* Las cuatro piezas ocupan la misma celda: la caja toma el alto de la más alta y no salta al
              cambiar de pestaña. La activa se monta de nuevo para que su animación vuelva a correr. */}
          <div className="grid p-3 text-[#161a2c] sm:p-4">
            {PAGES.map((p, i) => {
              const Mini = MINI_PAGES[p.id]
              const on = i === active
              return (
                <div key={on ? `${p.id}-on` : `${p.id}-off`} className={`[grid-area:1/1] ${on ? '' : 'invisible'}`} aria-hidden={!on}>
                  <Mini />
                </div>
              )
            })}
          </div>
        </div>
      )}

      <p key={page.id} className="obj-fade relative mt-5 max-w-[62ch] text-sm leading-relaxed text-white/70">
        <b className="font-medium text-white">{t(page.label)}.</b> {t(page.note)}
        <span className="mt-1 block text-[11px] text-white/40">
          {desktop
            ? t({ es: 'Captura de página completa del staging, 19 nov 2026. Pasa el cursor para detenerla.', en: 'Full-page staging capture, Nov 19, 2026. Hover to pause.' })
            : t({ es: 'Recreado de la página del staging con sus cifras, 19 nov 2026. Toca una pestaña para elegir.', en: 'Recreated from the staging page with its figures, Nov 19, 2026. Tap a tab to choose.' })}
        </span>
      </p>
    </div>
  )
}

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
/** Pausa en cada extremo de la página antes de dar la vuelta. */
const EDGE_HOLD_MS = 1400
/** Cuánto baja o sube cada botón, en fracción de la ventana. */
const STEP_FRACTION = 0.8

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
 * La ventana del navegador en escritorio: la captura se desplaza de verdad adentro.
 * Baja y sube sola mientras nadie está encima; con la rueda, arrastrando la página,
 * con los botones o con el minimapa se recorre a mano.
 */
function PageViewer({ page, motion, seconds }: { page: Page; motion: boolean; seconds: number }) {
  const { t } = useLocale()
  const viewRef = useRef<HTMLDivElement>(null)
  const miniRef = useRef<HTMLDivElement>(null)
  const pausedRef = useRef(false)
  const [pos, setPos] = useState(0)
  const visible = Math.min(1, (FRAME * page.w) / page.h)

  // Auto-desplazamiento de ida y vuelta, con un acumulador propio: scrollTop se redondea a enteros.
  useEffect(() => {
    const el = viewRef.current
    if (!el) return
    el.scrollTop = 0
    setPos(0)
    if (!motion) return
    let y = 0
    let dir = 1
    let hold = EDGE_HOLD_MS
    let last = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const dt = now - last
      last = now
      const max = el.scrollHeight - el.clientHeight
      if (!pausedRef.current && max > 0) {
        // Si alguien la movió a mano, se sigue desde ahí.
        if (Math.abs(el.scrollTop - y) > 2) y = el.scrollTop
        if (hold > 0) hold -= dt
        else {
          y += (dir * max * dt) / (seconds * 1000)
          if (y >= max) {
            y = max
            dir = -1
            hold = EDGE_HOLD_MS
          } else if (y <= 0) {
            y = 0
            dir = 1
            hold = EDGE_HOLD_MS
          }
          el.scrollTop = y
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [page.id, motion, seconds])

  const onScroll = () => {
    const el = viewRef.current
    if (!el) return
    const max = el.scrollHeight - el.clientHeight
    setPos(max > 0 ? el.scrollTop / max : 0)
  }

  const step = (dir: 1 | -1) => {
    const el = viewRef.current
    if (el) el.scrollBy({ top: dir * el.clientHeight * STEP_FRACTION, behavior: 'smooth' })
  }

  // Arrastrar la página con el mouse, como una mano.
  const drag = useRef<{ y: number; top: number } | null>(null)
  const onViewDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return
    drag.current = { y: e.clientY, top: e.currentTarget.scrollTop }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onViewMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return
    e.currentTarget.scrollTop = drag.current.top - (e.clientY - drag.current.y)
  }
  const endDrag = () => {
    drag.current = null
  }

  // Minimapa: tocar o arrastrar centra el recuadro en ese punto.
  const seek = (clientY: number) => {
    const mini = miniRef.current
    const el = viewRef.current
    if (!mini || !el || visible >= 1) return
    const r = mini.getBoundingClientRect()
    const f = Math.min(1, Math.max(0, ((clientY - r.top) / r.height - visible / 2) / (1 - visible)))
    el.scrollTop = f * (el.scrollHeight - el.clientHeight)
  }
  const onMiniDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    seek(e.clientY)
  }
  const onMiniMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) seek(e.clientY)
  }

  const atTop = pos <= 0.001
  const atBottom = pos >= 0.999 || visible >= 1
  const btn = 'grid h-9 w-full place-items-center rounded-md border border-white/20 text-white/70 transition-colors hover:border-white/60 hover:text-white disabled:pointer-events-none disabled:opacity-25'

  return (
    <div
      className="relative grid gap-5 md:grid-cols-[minmax(0,1fr)_88px]"
      onPointerEnter={() => (pausedRef.current = true)}
      onPointerLeave={() => (pausedRef.current = false)}
      onFocus={() => (pausedRef.current = true)}
      onBlur={() => (pausedRef.current = false)}
    >
      {/* La ventana: la página entera, a su resolución, desplazable de verdad. */}
      <div className="overflow-hidden rounded-xl bg-white shadow-[0_50px_100px_-30px_rgba(0,0,0,0.85)] ring-1 ring-white/10">
        <div className="flex items-center gap-1.5 border-b border-black/5 bg-[#f4f5f8] px-3 py-2" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-3 h-5 flex-1 truncate rounded-md bg-black/[0.05] px-2 font-mono text-[10px] leading-5 text-black/45">ubits · {page.path}</span>
        </div>
        <div
          ref={viewRef}
          data-lenis-prevent
          tabIndex={0}
          aria-label={t({ es: `Página ${t(page.label)}: desplázala para recorrerla`, en: `${t(page.label)} page: scroll to explore` })}
          onScroll={onScroll}
          onPointerDown={onViewDown}
          onPointerMove={onViewMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className="relative cursor-grab overflow-y-auto overscroll-contain [scrollbar-width:none] focus-visible:outline-none active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
          style={{ aspectRatio: `${1 / FRAME}` }}
        >
          <Image
            key={page.id}
            src={page.src}
            width={page.w}
            height={page.h}
            alt={t(page.label)}
            sizes="(min-width: 1024px) 60vw, 100vw"
            quality={90}
            draggable={false}
            className="obj-fade block h-auto w-full select-none"
          />
        </div>
      </div>

      {/* El minimapa (se toca o se arrastra) y los botones para subir y bajar. */}
      <div className="hidden flex-col gap-2 md:flex">
        <div
          ref={miniRef}
          onPointerDown={onMiniDown}
          onPointerMove={onMiniMove}
          className="relative cursor-pointer touch-none overflow-hidden rounded-md ring-1 ring-white/20"
          aria-hidden="true"
        >
          <Image key={page.id} src={page.src} width={page.w} height={page.h} alt="" sizes="88px" draggable={false} className="obj-fade block h-auto w-full select-none opacity-70" />
          <span
            className="pointer-events-none absolute inset-x-0 rounded-sm border-2 border-[#0c5bef] bg-[#0c5bef]/15"
            style={{ height: `${visible * 100}%`, top: `${pos * (1 - visible) * 100}%` }}
          />
        </div>
        <button type="button" onClick={() => step(-1)} disabled={atTop} aria-label={t({ es: 'Subir', en: 'Scroll up' })} className={btn}>
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" /></svg>
        </button>
        <button type="button" onClick={() => step(1)} disabled={atBottom} aria-label={t({ es: 'Bajar', en: 'Scroll down' })} className={btn}>
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8 3v10M3.5 8.5 8 13l4.5-4.5" /></svg>
        </button>
      </div>
    </div>
  )
}

/**
 * 5.3 · El playground real, sin recortes ni zoom: cada página entera baja sola
 * dentro del navegador, a su tamaño nativo, y se puede recorrer a mano con la
 * rueda, arrastrándola, con los botones o con el minimapa.
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

      <div role="tablist" aria-label={t({ es: 'Páginas del producto', en: 'Product pages' })} className="relative mb-5 flex flex-wrap gap-2">
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
        <PageViewer page={page} motion={motion} seconds={seconds} />
      ) : (
        /* Teléfono y tableta: la pieza clave de cada página, recreada en HTML para que se lea. */
        <div className="relative overflow-hidden rounded-xl bg-[#f4f5f8] shadow-[0_50px_100px_-30px_rgba(0,0,0,0.85)] ring-1 ring-white/10">
          <div className="flex min-w-0 items-center gap-1.5 border-b border-black/5 px-3 py-2" aria-hidden="true">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#28c840]" />
            <span className="ml-2 min-w-0 flex-1 truncate rounded-md bg-black/[0.05] px-2 font-mono text-[11px] leading-5 text-black/45">ubits · {page.path}</span>
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
            ? t({ es: 'Captura de página completa del producto, 19 nov 2026. Recórrela con la rueda, arrastrándola o desde el minimapa.', en: 'Full-page product capture, Nov 19, 2026. Explore it with the wheel, by dragging or from the minimap.' })
            : t({ es: 'Recreado de la página del producto con sus cifras, 19 nov 2026. Toca una pestaña para elegir.', en: 'Recreated from the product page with its figures, Nov 19, 2026. Tap a tab to choose.' })}
        </span>
      </p>
    </div>
  )
}

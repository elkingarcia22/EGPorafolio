'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { PageZoom } from './page-zoom'

/** Proporción de la ventana del navegador en escritorio (alto / ancho). */
const FRAME = 10 / 16
/** Tras soltar el dedo, cuánto espera antes de volver a moverse sola. */
const TOUCH_RESUME_MS = 4000
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
  const [zoomOpen, setZoomOpen] = useState(false)
  const resumeTimer = useRef<number | null>(null)
  // Qué fracción de la página cabe en la ventana; se mide porque la ventana cambia de forma en el teléfono.
  const [visible, setVisible] = useState(Math.min(1, (FRAME * page.w) / page.h))
  const measure = () => {
    const el = viewRef.current
    if (el && el.scrollHeight) setVisible(Math.min(1, el.clientHeight / el.scrollHeight))
  }
  useEffect(() => {
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])
  useEffect(() => {
    pausedRef.current = zoomOpen
  }, [zoomOpen])

  const pause = () => {
    if (resumeTimer.current !== null) window.clearTimeout(resumeTimer.current)
    pausedRef.current = true
  }
  const resume = (e: React.PointerEvent) => {
    if (zoomOpen) return
    if (e.pointerType === 'mouse') {
      pausedRef.current = false
      return
    }
    // Con el dedo, se le deja un momento a quien está leyendo antes de seguir sola.
    resumeTimer.current = window.setTimeout(() => (pausedRef.current = false), TOUCH_RESUME_MS)
  }

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
    measure()
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
  const round = 'grid h-10 w-10 shrink-0 place-items-center rounded-full text-white/80 transition-colors active:bg-white/15 disabled:opacity-25'

  return (
    <div
      className="relative grid gap-5 md:grid-cols-[minmax(0,1fr)_88px]"
      onPointerEnter={pause}
      onPointerDown={pause}
      onPointerLeave={resume}
      onFocus={pause}
      onBlur={() => !zoomOpen && (pausedRef.current = false)}
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
          className="relative aspect-[4/5] cursor-grab overflow-y-auto overscroll-contain [scrollbar-width:none] focus-visible:outline-none active:cursor-grabbing sm:aspect-[4/3] md:aspect-[16/10] [&::-webkit-scrollbar]:hidden"
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
            onLoad={measure}
            className="obj-fade block h-auto w-full select-none"
          />
        </div>
      </div>

      {/* Teléfono: a la izquierda, por dónde va en la página; a la derecha, subir, bajar y ampliar. */}
      <div className="flex items-center gap-4 md:hidden">
        <div className="min-w-0 flex-1" aria-hidden="true">
          <div className="relative h-1 overflow-hidden rounded-full bg-white/10">
            <span
              className="absolute inset-y-0 rounded-full bg-[#0c5bef]"
              style={{ width: `${Math.max(visible, 0.06) * 100}%`, left: `${pos * (1 - Math.max(visible, 0.06)) * 100}%` }}
            />
          </div>
          <p className="mt-1.5 font-mono text-[10px] tabular-nums text-white/40">{Math.round(pos * 100)} %</p>
        </div>
        <div className="flex shrink-0 items-center rounded-full border border-white/15 bg-white/[0.04] p-1 backdrop-blur">
          <button type="button" onClick={() => step(-1)} disabled={atTop} aria-label={t({ es: 'Subir', en: 'Scroll up' })} className={round}>
            <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" /></svg>
          </button>
          <button type="button" onClick={() => step(1)} disabled={atBottom} aria-label={t({ es: 'Bajar', en: 'Scroll down' })} className={round}>
            <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8 3v10M3.5 8.5 8 13l4.5-4.5" /></svg>
          </button>
          <span className="mx-1 h-5 w-px bg-white/15" aria-hidden="true" />
          <button type="button" onClick={() => setZoomOpen(true)} aria-label={t({ es: 'Ampliar', en: 'Enlarge' })} className={round}>
            <ExpandIcon />
          </button>
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
        <button type="button" onClick={() => setZoomOpen(true)} aria-label={t({ es: 'Ampliar', en: 'Enlarge' })} className={btn}>
          <ExpandIcon />
        </button>
      </div>

      {zoomOpen && (
        <PageZoom src={page.src} w={page.w} h={page.h} label={t(page.label)} path={page.path} onClose={() => setZoomOpen(false)} />
      )}
    </div>
  )
}

function ExpandIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9.5 2.5h4v4M6.5 13.5h-4v-4M13.5 2.5 9 7M2.5 13.5 7 9" />
    </svg>
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
  const page = PAGES[active]
  const seconds = Math.max(10, Math.round(page.h / 180))
  const motion = !reducedMotion && (FRAME * page.w) / page.h < 1

  return (
    <div data-reveal="device" className="relative overflow-hidden rounded-3xl bg-[#0b0d16] p-4 text-white md:p-8">
      <span className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#0c5bef] opacity-25 blur-3xl" aria-hidden="true" />

      <div role="tablist" aria-label={t({ es: 'Páginas del producto', en: 'Product pages' })} className="relative mb-5 flex flex-wrap gap-2">
        {PAGES.map((p, i) => (
          <button
            key={p.id}
            type="button"
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className="relative overflow-hidden rounded-full border border-white/15 px-4 py-1.5 text-[13px] text-white/60 transition-colors hover:text-white aria-selected:border-white aria-selected:bg-white aria-selected:text-[#0b0d16]"
          >
            {t(p.label)}
          </button>
        ))}
      </div>

      <PageViewer page={page} motion={motion} seconds={seconds} />

      <p key={page.id} className="obj-fade relative mt-5 max-w-[62ch] text-sm leading-relaxed text-white/70">
        <b className="font-medium text-white">{t(page.label)}.</b> {t(page.note)}
        <span className="mt-1 block text-[11px] text-white/40">
          {t({ es: 'Captura de página completa del producto, 19 nov 2026. Recórrela a mano o amplíala para moverte por ella.', en: 'Full-page product capture, Nov 19, 2026. Scroll through it or enlarge it to move around.' })}
        </span>
      </p>
    </div>
  )
}

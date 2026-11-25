'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { SKETCH_BOARDS } from './enc-sketch-boards'

/** Ancho mínimo al que se dibuja un tablero: más angosto ya no se lee (en teléfono se desliza) */
const MIN_BOARD = 760
/** Separación entre celdas de la cuadrícula (fracción del ancho) */
const GAP = 0.035
/** Tiempo viendo la cuadrícula y cada tablero mientras avanza solo (ms) */
const GRID_MS = 2600
const BOARD_MS = 6000
/** El zoom de la cuadrícula a un tablero y de vuelta (ms) */
const ZOOM_MS = 900

/**
 * Los bocetos como una cuadrícula de cuatro tableros a mano, uno por
 * iteración. Avanza solo: muestra la cuadrícula y hace zoom a cada tablero,
 * que crece desde su celda; los demás se apagan detrás. Tocar una celda la
 * abre; «Cuadrícula» vuelve a verlos todos.
 */
export function EncSketchGrid() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const rootRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const boardRefs = useRef<(HTMLDivElement | null)[]>([])
  const [width, setWidth] = useState(0)
  const [boardH, setBoardH] = useState(0)
  const [inView, setInView] = useState(false)
  const [hover, setHover] = useState(false)
  /** 0 = la cuadrícula; 1–4 = cada tablero con zoom */
  const [pos, setPos] = useState(0)
  const focus = pos === 0 ? null : pos - 1

  useEffect(() => {
    const root = rootRef.current
    if (!root || reducedMotion) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: '0px 0px -25% 0px' })
    io.observe(root)
    return () => io.disconnect()
  }, [reducedMotion])

  useEffect(() => {
    if (!inView || hover || reducedMotion) return
    const id = window.setTimeout(() => setPos((p) => (p + 1) % (SKETCH_BOARDS.length + 1)), pos === 0 ? GRID_MS : BOARD_MS)
    return () => window.clearTimeout(id)
  }, [inView, hover, reducedMotion, pos])

  // Mide el ancho disponible y el alto de un tablero dibujado a ese ancho.
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const measure = () => {
      setWidth(stage.clientWidth)
      setBoardH(Math.max(0, ...boardRefs.current.map((b) => b?.offsetHeight ?? 0)))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(stage)
    boardRefs.current.forEach((b) => b && ro.observe(b))
    return () => ro.disconnect()
  }, [])

  // Al abrir un tablero, sus notas se pegan y sus trazos se dibujan.
  useEffect(() => {
    const board = focus === null ? null : boardRefs.current[focus]
    if (!board || reducedMotion) return
    const ctx = gsap.context(() => {
      gsap.fromTo(board.querySelectorAll('[data-reveal="pop"]'), { scale: 0.6, autoAlpha: 0, rotate: () => gsap.utils.random(-7, 7) }, { scale: 1, autoAlpha: 1, rotate: 0, duration: 0.7, ease: 'back.out(1.8)', stagger: 0.07, delay: ZOOM_MS / 1000 * 0.6 })
      gsap.fromTo(board.querySelectorAll('[data-draw]'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut', delay: ZOOM_MS / 1000 * 0.6 })
    }, board)
    return () => ctx.revert()
  }, [focus, reducedMotion])

  const boardW = Math.max(width, MIN_BOARD)
  const gap = width * GAP
  const cellW = (width - gap) / 2
  const scale = width ? cellW / boardW : 0.5
  const cellH = boardH * scale
  const cell = (i: number) => ({ x: (i % 2) * (cellW + gap), y: Math.floor(i / 2) * (cellH + gap) })
  const height = focus === null ? cellH * 2 + gap : boardH

  return (
    <div ref={rootRef} className="flex flex-col items-center" onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)}>
      <p key={pos} className="obj-fade mb-6 text-center" aria-live="polite">
        <span className="mono-label text-signal">{focus === null ? t({ es: 'Cuatro iteraciones', en: 'Four iterations' }) : t(SKETCH_BOARDS[focus].when)}</span>
        <span className="mt-2 block text-[clamp(1.3rem,1rem+1.2vw,2rem)] font-light leading-tight tracking-tight">
          {focus === null ? t({ es: 'Del chat al sistema de diseño', en: 'From chat to the design system' }) : t(SKETCH_BOARDS[focus].title)}
        </span>
      </p>

      <div
        ref={stageRef}
        data-reveal-off
        className={`swipe-board enc-wall relative mx-auto w-full max-w-[min(100%,calc((100svh-15rem)*1.7))] transition-[height] duration-700 ease-expo ${focus !== null && boardW > width ? 'overflow-x-auto overscroll-x-contain' : 'overflow-hidden'}`}
        style={{ height: boardH ? height : undefined }}
      >
        {SKETCH_BOARDS.map(({ title, Board }, i) => {
          const on = focus === i
          const c = cell(i)
          const transform = on ? 'translate(0px, 0px) scale(1)' : `translate(${c.x}px, ${c.y}px) scale(${scale})`
          return (
            <div
              key={title.es}
              ref={(el) => {
                boardRefs.current[i] = el
              }}
              aria-hidden={focus !== null && !on}
              inert={focus !== null && !on ? true : undefined}
              className="absolute left-0 top-0 origin-top-left"
              style={{
                width: boardW,
                transform,
                zIndex: on ? 2 : 1,
                opacity: focus === null || on ? 1 : 0.12,
                transition: reducedMotion ? 'none' : `transform ${ZOOM_MS}ms cubic-bezier(.16,1,.3,1), opacity 600ms`,
              }}
            >
              <Board />
              {/* En la cuadrícula, toda la celda abre el tablero */}
              {focus === null && (
                <button type="button" onClick={() => setPos(i + 1)} aria-label={t(title)} className="absolute inset-0 cursor-zoom-in rounded-xl outline-none ring-signal transition-shadow hover:ring-4 focus-visible:ring-4" />
              )}
            </div>
          )
        })}
      </div>

      {/* Un nodo por tablero y la cuadrícula entera */}
      <div className="mt-6 flex items-center gap-5">
        <ol className="relative flex items-center gap-8">
          <span className="absolute inset-x-1 top-1/2 h-px -translate-y-1/2 bg-white/12" aria-hidden="true" />
          {SKETCH_BOARDS.map((b, i) => (
            <li key={b.title.es} className="relative">
              <button
                type="button"
                onClick={() => setPos(i + 1)}
                aria-current={focus === i ? 'step' : undefined}
                aria-label={t(b.title)}
                title={t(b.title)}
                className={`block rounded-full transition-all duration-500 ease-expo ${focus === i ? 'h-3 w-3 bg-signal shadow-[0_0_12px_2px_rgb(var(--signal)/0.7)]' : 'h-2 w-2 border border-white/40 bg-void hover:border-white'}`}
              />
            </li>
          ))}
        </ol>
        <button
          type="button"
          onClick={() => setPos(0)}
          aria-pressed={focus === null}
          className="mono-label rounded-full border border-white/12 px-3 py-1 text-paper/60 transition-colors hover:border-white/35 hover:text-paper aria-pressed:border-signal aria-pressed:text-paper"
        >
          {t({ es: 'Cuadrícula', en: 'Grid' })}
        </button>
      </div>
    </div>
  )
}

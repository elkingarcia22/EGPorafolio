'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { AI, Lead } from './clp-kit'
import { CLIPPER_BOARDS } from './clp-boards'
import { useSwipe } from '@/components/case/kit/use-swipe'

const BOARDS = CLIPPER_BOARDS
/** Separación entre tableros en el muro (fracción del ancho) */
const GAP = 0.12
/** Inclinación de cada tablero sobre el muro (grados) */
const TILT = [-1.2, 1, 0.8, -1]
/** Tiempo en cada tablero mientras avanza solo (ms) */
const BOARD_MS = 6500
/** Tiempo viendo el muro entero, al empezar y entre vuelta y vuelta (ms) */
const WALL_MS = 3200
/** Viaje de la cámara: se aleja hasta ver el muro y entra al siguiente (s) */
const TRAVEL = { out: 0.55, in: 0.85 }
const GOLD = AI[0]

/**
 * 04 · Bocetos: los flujos de conversación de Clipper como un muro de cuatro
 * tableros (métricas, agendar, clientes y ayuda) unidos por fibras. Arranca
 * viendo el muro entero, la cámara entra a cada tablero y vuelve al muro.
 * Avanza solo y se detiene con el cursor encima, para poder leerlos.
 * (El mismo muro del caso Objetivos, con los tableros de Clipper.)
 */
export function ClipperSketches() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const rootRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })
  const [hover, setHover] = useState(false)
  const [inView, setInView] = useState(false)
  /** Dónde va el ciclo: 0 = el muro entero; 1–4 = cada tablero */
  const [pos, setPos] = useState(0)
  const overview = pos === 0
  const lastBoard = useRef(0)
  if (pos > 0) lastBoard.current = pos - 1
  const active = lastBoard.current

  useEffect(() => {
    const root = rootRef.current
    if (!root || reducedMotion) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: '0px 0px -25% 0px' })
    observer.observe(root)
    return () => observer.disconnect()
  }, [reducedMotion])

  // El ciclo: muro → tablero 1 → … → tablero 4 → muro → …
  useEffect(() => {
    if (!inView || hover || reducedMotion) return
    const id = window.setTimeout(() => setPos((p) => (p + 1) % (BOARDS.length + 1)), overview ? WALL_MS : BOARD_MS)
    return () => window.clearTimeout(id)
  }, [inView, hover, reducedMotion, pos, overview])

  // En el teléfono también se pasa deslizando el dedo de lado.
  useSwipe(rootRef, {
    onNext: () => setPos((p) => (p + 1) % (BOARDS.length + 1)),
    onPrev: () => setPos((p) => (p - 1 + BOARDS.length + 1) % (BOARDS.length + 1)),
  })

  // Mide el ancho de la vista y el tablero más alto: con eso se arma el muro.
  useEffect(() => {
    const view = viewRef.current
    const canvas = canvasRef.current
    if (!view || !canvas) return
    const measure = () => {
      const boards = Array.from(canvas.querySelectorAll<HTMLElement>('[data-wall-board]'))
      setSize({ w: view.clientWidth, h: Math.max(0, ...boards.map((b) => b.offsetHeight)) })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(view)
    canvas.querySelectorAll('[data-wall-board]').forEach((b) => observer.observe(b))
    return () => observer.disconnect()
  }, [])

  const gap = size.w * GAP
  const at = (i: number) => ({ x: (i % 2) * (size.w + gap), y: Math.floor(i / 2) * (size.h + gap) })
  const wall = { w: size.w * 2 + gap, h: size.h * 2 + gap }
  const fit = Math.min(size.w / wall.w, size.h / Math.max(1, wall.h)) * 0.92
  const wide = { x: (size.w - wall.w * fit) / 2, y: (size.h - wall.h * fit) / 2, scale: fit }

  // La cámara: se aleja hasta el muro y entra al tablero elegido (o se queda en el muro).
  const first = useRef(true)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !size.w) return
    const p = at(active)
    const close = { x: -p.x, y: -p.y, scale: 1 }
    if (first.current || reducedMotion) {
      first.current = false
      gsap.set(canvas, overview ? wide : close)
      return
    }
    const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' } })
    if (overview) tl.to(canvas, { ...wide, duration: TRAVEL.in })
    else tl.to(canvas, { ...wide, duration: TRAVEL.out }).to(canvas, { ...close, duration: TRAVEL.in, ease: 'expo.inOut' })
    return () => {
      tl.kill()
    }
    // `at` y `wide` dependen solo de `size`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, overview, size, reducedMotion])

  // Al llegar a un tablero, sus notas se pegan y sus flechas se dibujan.
  useEffect(() => {
    const canvas = canvasRef.current
    const board = canvas?.querySelectorAll<HTMLElement>('[data-wall-board]')[active]
    if (!board || reducedMotion || overview) return
    const delay = TRAVEL.out + TRAVEL.in * 0.6
    const ctx = gsap.context(() => {
      gsap.fromTo(board.querySelectorAll('[data-reveal="pop"]'), { scale: 0.6, autoAlpha: 0, rotate: () => gsap.utils.random(-7, 7) }, { scale: 1, autoAlpha: 1, rotate: 0, duration: 0.7, ease: 'back.out(1.8)', stagger: 0.08, delay })
      gsap.fromTo(board.querySelectorAll('[data-draw]'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut', delay })
    }, board)
    return () => ctx.revert()
  }, [active, overview, reducedMotion])

  /** Fibra de un tablero al siguiente, de borde a borde por el muro */
  const link = (i: number) => {
    const a = at(i)
    const b = at(i + 1)
    if (a.y === b.y) {
      const from = { x: a.x + size.w, y: a.y + size.h / 2 }
      const to = { x: b.x, y: b.y + size.h / 2 }
      return `M${from.x} ${from.y} C${from.x + gap / 2} ${from.y} ${to.x - gap / 2} ${to.y} ${to.x} ${to.y}`
    }
    const from = { x: a.x + size.w / 2, y: a.y + size.h }
    const to = { x: b.x + size.w / 2, y: b.y }
    return `M${from.x} ${from.y} C${from.x} ${from.y + gap * 0.8} ${to.x} ${to.y - gap * 0.8} ${to.x} ${to.y}`
  }

  return (
    <div ref={rootRef}>
      <Lead>{t({ es: 'Antes de cualquier pantalla dibujé cada conversación: qué pregunta la persona, qué consulta Clipper y qué responde.', en: 'Before any screen I drew each conversation: what the person asks, what Clipper looks up and what it answers.' })}</Lead>

      <div className="mt-10 flex flex-col items-center">
        <p key={`${active}-${overview}`} className="clp-fade mb-5 text-center">
          <span className="mono-label" style={{ color: GOLD }}>{overview ? t({ es: 'El muro', en: 'The wall' }) : `${t({ es: 'Tablero', en: 'Board' })} 0${active + 1}`}</span>
          <span className="mt-2 block text-[clamp(1.4rem,1rem+1.4vw,2.2rem)] font-light leading-tight tracking-tight">
            {overview ? t({ es: 'Cuatro conversaciones, un mismo Clipper', en: 'Four conversations, one Clipper' }) : t(BOARDS[active].title)}
          </span>
        </p>

        <div
          ref={viewRef}
          onPointerEnter={() => setHover(true)}
          onPointerLeave={() => setHover(false)}
          className="relative w-full overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(ellipse_at_50%_40%,rgba(240,206,134,0.1),transparent_70%)]"
          style={{ height: size.h ? size.h : undefined }}
        >
          <div ref={canvasRef} data-reveal-off className="absolute left-0 top-0 origin-top-left" style={{ width: wall.w || '100%', height: wall.h || undefined }}>
            {/* Las fibras que recorren el muro de tablero en tablero */}
            <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" viewBox={`0 0 ${wall.w || 1} ${wall.h || 1}`}>
              <defs>
                <linearGradient id="clp-wall-fiber" x1="0" y1="0" x2="1" y2="1">
                  {AI.map((c, k) => <stop key={c} offset={k / (AI.length - 1)} stopColor={c} />)}
                </linearGradient>
              </defs>
              {size.w > 0 && BOARDS.slice(0, -1).map((b, i) => (
                <path key={b.title.es} d={link(i)} fill="none" stroke={i < active ? 'url(#clp-wall-fiber)' : 'white'} strokeOpacity={i < active ? 0.95 : 0.4} strokeWidth={6} strokeDasharray={i < active ? undefined : '14 16'} style={{ filter: i < active ? `drop-shadow(0 0 8px ${AI[1]})` : undefined }} />
              ))}
            </svg>
            {BOARDS.map(({ title, Board }, i) => {
              const p = size.w ? at(i) : { x: 0, y: i * 2000 }
              const on = i === active && !overview
              return (
                <div
                  key={title.es}
                  data-wall-board
                  aria-hidden={!on}
                  inert={!on ? true : undefined}
                  className="absolute transition-[opacity,filter] duration-700"
                  style={{ left: p.x, top: p.y, width: size.w || '100%', opacity: on || overview ? 1 : 0.35, filter: on || overview ? 'none' : 'blur(2px)', transform: on ? 'none' : `rotate(${TILT[i]}deg)` }}
                >
                  <Board />
                </div>
              )
            })}
          </div>
        </div>

        {/* El recorrido: un nodo por tablero, y el muro entero */}
        <div className="mt-6 flex items-center gap-5">
          <ol className="relative flex items-center gap-8">
            <span className="absolute inset-x-1 top-1/2 h-px -translate-y-1/2 bg-white/12" aria-hidden="true" />
            {BOARDS.map((b, i) => {
              const current = i === active && !overview
              return (
                <li key={b.title.es} className="relative">
                  <button
                    type="button"
                    onClick={() => setPos(i + 1)}
                    aria-current={current ? 'step' : undefined}
                    aria-label={t(b.title)}
                    title={t(b.title)}
                    className={`block rounded-full transition-all duration-500 ease-expo ${current ? 'h-3 w-3' : 'h-2 w-2 border border-white/40 bg-[rgb(var(--void))] hover:border-white'}`}
                    style={current ? { background: GOLD, boxShadow: `0 0 12px 2px ${GOLD}b3` } : undefined}
                  />
                </li>
              )
            })}
          </ol>
          <button
            type="button"
            onClick={() => setPos(0)}
            aria-pressed={overview}
            className="mono-label rounded-full border border-white/12 px-3 py-1 text-paper/60 transition-colors hover:border-white/35 hover:text-paper aria-pressed:border-[#f0ce86] aria-pressed:text-paper"
          >
            {t({ es: 'El muro', en: 'The wall' })}
          </button>
          {/* Del recorrido de tableros baja la fibra hacia «Forma» */}
          <span data-fiber-from="clp-forma" className="h-px w-px" />
        </div>
      </div>
    </div>
  )
}

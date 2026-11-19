'use client'

import { createContext, useContext, useId } from 'react'

/**
 * Kit de bocetos: un tablero tipo Miro (fondo de puntos, marco con nombre),
 * post-its, letra a mano, wireframes con trazo tembloroso y flechas.
 * Todo se posiciona en las medidas de diseño del tablero (px) y escala con él.
 */

const INK = '#2a2d33'

interface BoardSize {
  w: number
  h: number
  filterId: string
}

const BoardContext = createContext<BoardSize>({ w: 1200, h: 700, filterId: 'rough' })

const pct = (value: number, total: number) => `${(value / total) * 100}%`

interface BoardProps {
  /** Nombre del marco, como en Miro */
  title: string
  /** Medidas de diseño: todo dentro se ubica en estas coordenadas */
  w?: number
  h?: number
  children: React.ReactNode
  /** Leyenda accesible del tablero */
  label: string
}

export function Board({ title, w = 1200, h = 700, children, label }: BoardProps) {
  const filterId = `rough-${useId().replace(/:/g, '')}`
  return (
    <figure data-reveal className="overflow-x-auto overscroll-x-contain" aria-label={label}>
      <div className="min-w-[820px]">
        <p className="mb-2 flex items-center gap-2 font-mono text-[11px] text-fg/60">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-signal" aria-hidden="true" />
          {title}
        </p>
        <div
          className="relative overflow-hidden rounded-xl text-[#2a2d33] ring-1 ring-black/10 shadow-[0_30px_70px_-35px_rgba(0,0,0,0.55)] [container-type:inline-size]"
          style={{
            aspectRatio: `${w} / ${h}`,
            backgroundColor: '#f6f4ee',
            backgroundImage: 'radial-gradient(rgba(42,45,51,0.16) 1px, transparent 1.2px)',
            backgroundSize: '22px 22px',
          }}
        >
          <svg width="0" height="0" className="absolute" aria-hidden="true">
            <filter id={filterId}>
              <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="4" />
              <feDisplacementMap in="SourceGraphic" scale="2.4" />
            </filter>
          </svg>
          <BoardContext.Provider value={{ w, h, filterId }}>{children}</BoardContext.Provider>
        </div>
      </div>
    </figure>
  )
}

interface PinProps {
  x: number
  y: number
  w?: number
  rotate?: number
  children: React.ReactNode
  className?: string
}

/** Coloca algo en el tablero, en coordenadas de diseño. */
export function Pin({ x, y, w, rotate = 0, children, className = '' }: PinProps) {
  const board = useContext(BoardContext)
  return (
    <div
      className={`absolute ${className}`}
      style={{ left: pct(x, board.w), top: pct(y, board.h), width: w ? pct(w, board.w) : undefined, transform: rotate ? `rotate(${rotate}deg)` : undefined }}
    >
      {children}
    </div>
  )
}

const STICKY = {
  yellow: '#ffe98a',
  pink: '#ffc2d4',
  blue: '#bfe0ff',
  green: '#c9efc0',
  orange: '#ffd2a8',
  violet: '#dcd0ff',
} as const

export type StickyColor = keyof typeof STICKY

/** Post-it con letra a mano. */
export function Sticky({ color = 'yellow', children, small = false }: { color?: StickyColor; children: React.ReactNode; small?: boolean }) {
  return (
    <div
      data-reveal="pop"
      className={`font-hand leading-[1.05] shadow-[0_6px_14px_-6px_rgba(0,0,0,0.35)] ${small ? 'p-[0.7cqw] text-[1.45cqw]' : 'p-[1cqw] text-[1.75cqw]'}`}
      style={{ background: STICKY[color] }}
    >
      {children}
    </div>
  )
}

/** Texto a mano suelto sobre el tablero (títulos, notas). */
export function Hand({ children, size = 1.6, className = '' }: { children: React.ReactNode; size?: number; className?: string }) {
  return (
    <span className={`font-hand leading-tight ${className}`} style={{ fontSize: `${size}cqw` }}>
      {children}
    </span>
  )
}

/** Caja con trazo tembloroso: base de los wireframes dibujados. */
export function Sketchy({ children, className = '', fill = 'transparent' }: { children?: React.ReactNode; className?: string; fill?: string }) {
  const { filterId } = useContext(BoardContext)
  return (
    <div className="relative">
      <div className="absolute inset-0 rounded-[0.6cqw] border-[0.18cqw] border-[#2a2d33]" style={{ filter: `url(#${filterId})`, background: fill }} />
      <div className={`relative ${className}`}>{children}</div>
    </div>
  )
}

/** Un celular dibujado a mano con su contenido. */
export function SketchPhone({ children, title }: { children: React.ReactNode; title?: string }) {
  const { filterId } = useContext(BoardContext)
  return (
    <div>
      {title && <Hand size={1.5} className="mb-[0.4cqw] block text-center">{title}</Hand>}
      <div className="relative aspect-[9/17]">
        <div className="absolute inset-0 rounded-[1.6cqw] border-[0.22cqw] border-[#2a2d33] bg-white/70" style={{ filter: `url(#${filterId})` }} />
        <div className="absolute left-1/2 top-[2.5%] h-[1.5%] w-[24%] -translate-x-1/2 rounded-full bg-[#2a2d33]/80" />
        <div className="absolute inset-[7%_7%_5%] flex flex-col gap-[0.55cqw]">{children}</div>
      </div>
    </div>
  )
}

/** Línea de texto simulada (gris) dentro de un wireframe. */
export function Bar({ w = 100, strong = false }: { w?: number; strong?: boolean }) {
  return <span className={`block h-[0.5cqw] rounded-full ${strong ? 'bg-[#2a2d33]' : 'bg-[#2a2d33]/25'}`} style={{ width: `${w}%` }} />
}

/** Botón dibujado. */
export function Btn({ children, accent = false }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <Sketchy fill={accent ? '#ffd2a8' : 'transparent'} className="px-[0.5cqw] py-[0.35cqw] text-center">
      <Hand size={1.15}>{children}</Hand>
    </Sketchy>
  )
}

interface ArrowSpec {
  d: string
  dashed?: boolean
  accent?: boolean
}

/** Flechas a mano entre elementos (rutas SVG en coordenadas del tablero). */
export function Arrows({ paths }: { paths: readonly ArrowSpec[] }) {
  const { w, h, filterId } = useContext(BoardContext)
  const marker = `${filterId}-head`
  const markerAccent = `${filterId}-head-accent`
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
      <defs>
        <marker id={marker} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M1,1 L9,5 L1,9" fill="none" stroke={INK} strokeWidth="1.6" strokeLinecap="round" />
        </marker>
        <marker id={markerAccent} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M1,1 L9,5 L1,9" fill="none" stroke="#e8743b" strokeWidth="1.8" strokeLinecap="round" />
        </marker>
      </defs>
      <g style={{ filter: `url(#${filterId})` }}>
        {paths.map((p) => (
          <path
            key={p.d}
            d={p.d}
            fill="none"
            stroke={p.accent ? '#e8743b' : INK}
            strokeWidth={p.accent ? 2.6 : 2}
            strokeLinecap="round"
            pathLength={p.dashed ? undefined : 1}
            strokeDasharray={p.dashed ? '7 7' : 1}
            data-draw={p.dashed ? undefined : ''}
            markerEnd={`url(#${p.accent ? markerAccent : marker})`}
          />
        ))}
      </g>
    </svg>
  )
}

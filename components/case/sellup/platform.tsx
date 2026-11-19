'use client'

import type { ReactNode } from 'react'
import { BLUE, SellUpMark } from './ui'

/**
 * Piezas compartidas que replican la plataforma SellUp en modo oscuro:
 * el logo con su tipografía, el orbe de Rumbo y el marco de la app.
 * Colores tomados de la app en producción (noviembre de 2026).
 */
export const APP = {
  bg: '#0d0e10',
  side: '#141517',
  card: '#18191c',
  cardHi: '#1f2024',
  line: 'rgba(255,255,255,0.08)',
  text: '#e8e9ec',
  mute: 'rgba(232,233,236,0.55)',
} as const

/** Degradado del botón «Generar con Rumbo IA». */
export const RUMBO_GRADIENT = 'linear-gradient(90deg,#285ee6 0%,#7e2be0 38%,#d22d6a 72%,#eb6233 100%)'

/** Logo completo: el ícono de la U imán y la palabra «SellUp» con «Up» en azul. */
export function SellUpLogo({ size = 40, className = '' }: { size?: number; className?: string }) {
  return (
    <span className={`inline-flex items-center ${className}`} style={{ gap: size * 0.35 }} aria-label="SellUp">
      <SellUpMark size={size} />
      <span className="relative font-light leading-none tracking-[-0.03em]" style={{ fontSize: size * 0.95 }}>
        <span className="text-[#f2f1ec]">Sell</span>
        <span style={{ color: BLUE }}>Up</span>
        <svg viewBox="0 0 20 20" className="absolute" style={{ width: size * 0.36, height: size * 0.36, left: size * 0.36, top: -size * 0.26 }} aria-hidden="true">
          <circle cx="10" cy="10" r="8" fill="none" stroke="#f2f1ec" strokeWidth="1" opacity="0.7" />
          <circle cx="10" cy="10" r="2" fill="#f2f1ec" />
        </svg>
      </span>
    </span>
  )
}

/** Rumbo en pequeño: la misma marca de la app (antes era el orbe antiguo). */
export function RumboOrb({ size = 24, pulse = false, className = '' }: { size?: number; pulse?: boolean; className?: string }) {
  return <RumboMark size={size} motion={pulse ? 'thinking' : 'still'} className={className} />
}

export type NavKey = 'flujo' | 'empresas' | 'busquedas' | 'revisar' | 'contactos' | 'uso' | 'catalogo' | 'roi'

const NAV: readonly { key: NavKey; label: string; sub?: boolean }[] = [
  { key: 'flujo', label: 'Flujo de prospección' },
  { key: 'empresas', label: 'Empresas' },
  { key: 'busquedas', label: 'Búsquedas', sub: true },
  { key: 'revisar', label: 'Por revisar', sub: true },
  { key: 'contactos', label: 'Contactos' },
  { key: 'uso', label: 'Uso de IA y costos' },
  { key: 'catalogo', label: 'Catálogo de fuentes' },
  { key: 'roi', label: 'Calculadora de ROI' },
]

interface AppFrameProps {
  active: NavKey
  crumb: string
  children: ReactNode
  /** Panel lateral derecho (por ejemplo, Rumbo). */
  aside?: ReactNode
  className?: string
}

/** Marco de la app: barra lateral, barra superior con búsqueda y contenido. */
export function AppFrame({ active, crumb, children, aside, className = '' }: AppFrameProps) {
  return (
    <div
      className={`relative flex overflow-hidden rounded-[16px] text-[12px] ring-1 ring-white/10 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.9)] ${className}`}
      style={{ background: APP.bg, color: APP.text }}
    >
      <nav className="hidden w-[168px] shrink-0 flex-col gap-0.5 p-2.5 md:flex" style={{ background: APP.side }} aria-label="SellUp">
        <div className="mb-3 flex items-center gap-2 rounded-lg px-2 py-1.5 ring-1 ring-white/10">
          <SellUpMark size={18} />
          <span className="font-medium">SellUp</span>
        </div>
        {NAV.map((n) => (
          <span
            key={n.key}
            className={`truncate rounded-md py-1.5 ${n.sub ? 'pl-6 pr-2 text-[11px]' : 'px-2'} ${active === n.key ? 'bg-[#5b7eff]/15 text-[#b7c6ff]' : 'opacity-60'}`}
          >
            {n.label}
          </span>
        ))}
      </nav>
      <div className="relative flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b px-4 py-2.5" style={{ borderColor: APP.line }}>
          <span className="truncate opacity-70">{crumb}</span>
          <span className="mx-auto hidden w-[38%] items-center gap-2 rounded-md px-2.5 py-1 ring-1 ring-white/10 sm:flex">
            <span className="opacity-40">⌕</span>
            <span className="opacity-40">Buscar en todo…</span>
          </span>
          <span className="ml-auto h-5 w-5 rounded-full bg-white/20 sm:ml-0" />
        </header>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_80%_0%,rgba(91,126,255,0.14),transparent_60%)]" />
        <div className="relative min-h-0 flex-1">{children}</div>
      </div>
      {aside}
    </div>
  )
}

/** Tarjeta de la app. */
export function AppCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-[12px] ring-1 ring-white/[0.08] ${className}`} style={{ background: APP.card }}>
      {children}
    </div>
  )
}

/** Etiqueta de estado (como «Listo para revisión» o «Verificada»). */
export function Pill({ tone = 'blue', children }: { tone?: 'blue' | 'amber' | 'green' | 'red' | 'gray'; children: ReactNode }) {
  const cls = {
    blue: 'bg-[#5b7eff]/15 text-[#a9baff] ring-[#5b7eff]/30',
    amber: 'bg-amber-400/10 text-amber-300 ring-amber-400/30',
    green: 'bg-emerald-400/10 text-emerald-300 ring-emerald-400/30',
    red: 'bg-red-400/10 text-red-300 ring-red-400/30',
    gray: 'bg-white/5 text-white/60 ring-white/15',
  }[tone]
  return <span className={`inline-flex items-center whitespace-nowrap rounded-md px-1.5 py-0.5 text-[10px] font-medium ring-1 ${cls}`}>{children}</span>
}

/** Trazos de la marca de Rumbo (SellUp, src/icons): la aguja es una flecha que sube; la cola, más tenue. */
const RUMBO_NEEDLE = 'M12 3.6 L15.4 12.6 L12 10.7 L8.6 12.6 Z'
const RUMBO_TAIL = 'M12 20.4 L10.3 14.9 L12 15.9 L13.7 14.9 Z'
/** Degradado de IA de SellUp (`.bg-ai-gradient`). */
export const AI_TILE = 'linear-gradient(135deg,#285ee6 0%,#7e2be0 38%,#d22d6a 72%,#eb6233 100%)'

/**
 * La marca de Rumbo tal cual la app (`ChatMark`): brújula blanca sobre una baldosa con el
 * degradado de IA. `breathing`: la baldosa late y la aguja oscila; `thinking`: la aguja gira.
 */
export function RumboMark({ size = 40, motion = 'still', glow = false, className = '' }: { size?: number; motion?: 'still' | 'breathing' | 'thinking'; glow?: boolean; className?: string }) {
  const tile = motion === 'breathing' ? 'rumbo-breathe 3.2s ease-in-out infinite' : motion === 'thinking' ? 'rumbo-breathe 1.6s ease-in-out infinite' : undefined
  const needle = motion === 'breathing' ? 'rumbo-sway 3.2s ease-in-out infinite' : motion === 'thinking' ? 'rumbo-spin 1.6s linear infinite' : undefined
  return (
    <span className={`relative inline-grid shrink-0 place-items-center ${className}`} style={{ width: size, height: size }} aria-hidden="true">
      <style>{'@keyframes rumbo-breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}@keyframes rumbo-sway{0%,100%{transform:rotate(-10deg)}50%{transform:rotate(10deg)}}@keyframes rumbo-spin{to{transform:rotate(360deg)}}'}</style>
      {glow && <span className="absolute -inset-[35%] rounded-full bg-[radial-gradient(closest-side,rgba(126,43,224,0.5),rgba(210,45,106,0.18)_60%,transparent)]" />}
      <span
        className="absolute inset-0 motion-reduce:!animate-none"
        style={{ background: AI_TILE, borderRadius: size <= 24 ? 6 : size * 0.27, boxShadow: '0 12px 40px -10px rgba(126,43,224,0.7)', animation: tile }}
      />
      <svg viewBox="0 0 24 24" className="relative" style={{ width: '66%', height: '66%' }} fill="white">
        <circle cx="12" cy="12" r="9.6" fill="none" stroke="white" strokeWidth="1.9" />
        <g style={{ transformBox: 'view-box', transformOrigin: '12px 12px', animation: needle }}>
          <g transform="rotate(32 12 12)">
            <path d={RUMBO_NEEDLE} />
            <path d={RUMBO_TAIL} opacity="0.55" />
          </g>
        </g>
        <circle cx="12" cy="12" r="1.2" />
      </svg>
    </span>
  )
}

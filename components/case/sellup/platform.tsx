'use client'

import type { ReactNode } from 'react'
import { BLUE, SellUpMark, SellUpWordmark } from './ui'

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
export const RUMBO_GRADIENT = 'linear-gradient(90deg,#5b7eff 0%,#8b5cf6 55%,#ef4444 100%)'

/** Logo completo: el ícono de la U imán y la palabra «SellUp» con «Up» en azul. */
export function SellUpLogo({ size = 40, className = '' }: { size?: number; className?: string }) {
  return (
    <span className={`inline-flex items-center ${className}`} style={{ gap: size * 0.35, fontSize: size * 0.95 }} aria-label="SellUp">
      <SellUpMark size={size} />
      <SellUpWordmark className="leading-none text-[#f2f1ec]" />
    </span>
  )
}

/** El orbe de Rumbo, la IA de SellUp (mismo degradado que en la app). */
export function RumboOrb({ size = 24, pulse = false, className = '' }: { size?: number; pulse?: boolean; className?: string }) {
  return (
    <span className={`relative inline-block shrink-0 ${className}`} style={{ width: size, height: size }} aria-hidden="true">
      {pulse && <span className="absolute inset-0 animate-ping rounded-full bg-[#8b5cf6]/40" />}
      <span
        className="absolute inset-0 rounded-full"
        style={{
          background: [
            'radial-gradient(ellipse at 68% 26%, rgba(165,215,255,0.95) 0%, rgba(110,175,255,0.55) 18%, transparent 42%)',
            'radial-gradient(ellipse at 28% 74%, rgba(220,50,255,0.65) 0%, transparent 46%)',
            'radial-gradient(circle at 50% 50%, #8b5cf6 0%, #6d28d9 38%, #4c1d95 62%, #2e0a7c 83%, #0e0025 100%)',
          ].join(', '),
          boxShadow: '0 2px 14px rgba(109,40,217,0.55), inset 0 1px 3px rgba(255,255,255,0.25)',
        }}
      />
    </span>
  )
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
          <SellUpWordmark />
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

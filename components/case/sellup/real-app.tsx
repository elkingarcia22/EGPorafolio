'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Bell, Building2, Calculator, ChevronDown, ChevronsUpDown, Compass, Database, LayoutGrid, MessageCircle, PanelLeft, Search, Settings2, Users } from 'lucide-react'
import { SellUpMark } from './ui'
import { Camera, useCompact, type View } from './camera'

/**
 * Réplica fiel de la app SellUp (modo oscuro, noviembre de 2026): se dibuja a
 * su tamaño real (1240 px de ancho) y se escala al contenedor como una captura viva.
 */
export const REAL = {
  width: 1240,
  bg: '#0a0a0a',
  side: '#131313',
  card: '#161616',
  line: 'rgba(255,255,255,0.1)',
  blue: '#6b8cff',
  font: 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
} as const

export type RealNav = 'flujo' | 'empresas' | 'busquedas' | 'revisar' | 'contactos' | 'alertas' | 'uso' | 'catalogo' | 'roi'

const NAV: readonly { key: RealNav; label: string; Icon: typeof Bell; caret?: boolean }[] = [
  { key: 'flujo', label: 'Flujo de prospección', Icon: LayoutGrid },
  { key: 'empresas', label: 'Empresas', Icon: Building2, caret: true },
  { key: 'contactos', label: 'Contactos', Icon: Users, caret: true },
  { key: 'alertas', label: 'Comentarios y alertas', Icon: MessageCircle },
  { key: 'uso', label: 'Uso de IA y costos', Icon: Compass },
  { key: 'catalogo', label: 'Catálogo de fuentes', Icon: Database },
  { key: 'roi', label: 'Calculadora de ROI', Icon: Calculator },
]
const SUB: readonly { key: RealNav; label: string }[] = [
  { key: 'empresas', label: 'Lista de empresas' },
  { key: 'busquedas', label: 'Búsquedas' },
  { key: 'revisar', label: 'Por revisar' },
]

function Sidebar({ active }: { active: RealNav }) {
  const companiesOpen = active === 'busquedas' || active === 'revisar' || active === 'empresas'
  return (
    <nav className="flex w-[236px] shrink-0 flex-col gap-1 border-r p-3" style={{ background: REAL.side, borderColor: REAL.line }}>
      <div className="mb-3 flex items-center gap-2.5 rounded-xl border px-2.5 py-2" style={{ borderColor: REAL.line, background: '#0f0f0f' }}>
        <SellUpMark size={26} />
        <span className="text-[14px] font-semibold">SellUp</span>
        <ChevronsUpDown className="ml-auto h-3.5 w-3.5 opacity-50" />
      </div>
      {NAV.map(({ key, label, Icon, caret }) => {
        const on = active === key || (key === 'empresas' && companiesOpen && active === 'empresas')
        return (
          <div key={key}>
            <div className={`relative flex h-9 items-center gap-3 rounded-lg px-1.5 text-[13.5px] ${on ? 'bg-[#6b8cff]/[0.12] font-medium text-[#8fa6ff]' : 'text-white/75'}`}>
              {on && <span className="absolute -left-3 top-1.5 h-6 w-[3px] rounded-r bg-[#6b8cff]" />}
              <span className="grid h-6 w-6 place-items-center rounded-full ring-1 ring-white/10"><Icon className="h-3.5 w-3.5" strokeWidth={1.75} /></span>
              {label}
              {caret && <ChevronDown className="ml-auto h-3.5 w-3.5 opacity-40" />}
            </div>
            {key === 'empresas' && companiesOpen && (
              <div className="ml-[18px] border-l pl-3" style={{ borderColor: REAL.line }}>
                {SUB.map((s) => (
                  <div key={s.key} className={`my-0.5 rounded-lg px-2 py-1.5 text-[13px] ${active === s.key ? 'bg-[#6b8cff]/[0.12] text-[#8fa6ff]' : 'text-white/60'}`}>{s.label}</div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </nav>
  )
}

function TopBar({ crumb }: { crumb: readonly string[] }) {
  return (
    <header className="flex h-[58px] shrink-0 items-center gap-3 border-b px-4" style={{ borderColor: REAL.line }}>
      <span className="grid h-8 w-8 place-items-center rounded-lg ring-1 ring-white/10"><PanelLeft className="h-4 w-4 opacity-70" /></span>
      <span className="text-[13.5px]">
        {crumb.map((c, i) => (
          <span key={c} className={i < crumb.length - 1 ? 'text-white/50' : ''}>{c}{i < crumb.length - 1 && <span className="mx-2 text-white/30">›</span>}</span>
        ))}
      </span>
      <span className="ml-auto mr-auto flex h-9 w-[340px] items-center gap-2 rounded-xl border px-3 text-[13.5px] text-white/45" style={{ borderColor: REAL.line, background: '#0f0f0f' }}>
        <Search className="h-4 w-4" /> Buscar en todo…
        <span className="ml-auto rounded-md bg-white/10 px-1.5 py-0.5 text-[11px] text-white/70">⌘K</span>
      </span>
      <span className="grid h-8 w-8 place-items-center rounded-lg ring-1 ring-white/10"><Bell className="h-4 w-4 opacity-70" /></span>
      <span className="grid h-8 w-8 place-items-center rounded-lg ring-1 ring-white/10"><Settings2 className="h-4 w-4 opacity-70" /></span>
      <span className="h-8 w-8 rounded-full bg-gradient-to-br from-white/70 to-white/20" />
    </header>
  )
}

/** Tarjeta de la app: el borde doble que usa SellUp. */
export function RealCard({ children, className = '', dashed = false }: { children: ReactNode; className?: string; dashed?: boolean }) {
  return (
    <div className={`rounded-[18px] border p-[3px] ${className}`} style={{ borderColor: REAL.line }}>
      <div className={`h-full rounded-[15px] border ${dashed ? 'border-dashed' : ''}`} style={{ borderColor: REAL.line, background: REAL.card }}>{children}</div>
    </div>
  )
}

/** Etiqueta de la app (Agente 1, Completada, Etapa actual, Pendiente…). */
export function RealTag({ tone = 'gray', children }: { tone?: 'blue' | 'indigo' | 'green' | 'amber' | 'gray'; children: ReactNode }) {
  const cls = {
    blue: 'border-[#3b82f6]/50 bg-[#3b82f6]/15 text-[#7fb0ff]',
    indigo: 'border-[#6b8cff]/50 bg-[#6b8cff]/15 text-[#9db0ff]',
    green: 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300',
    amber: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
    gray: 'border-white/10 bg-white/[0.07] text-white/85',
  }[tone]
  return <span className={`inline-flex items-center whitespace-nowrap rounded-md border px-1.5 py-[1px] text-[12px] ${cls}`}>{children}</span>
}

interface RealFrameProps {
  active: RealNav
  crumb: readonly string[]
  height: number
  children: ReactNode
  /** Capa encima de todo (cursor, dock flotante). */
  overlay?: ReactNode
  /** Encuadre legible en teléfono y tableta (px de diseño). Sin él, se escala completa. */
  view?: View
}

/** El marco completo de la app, escalado al ancho disponible (o encuadrado con `view` en pantallas chicas). */
export function RealFrame(props: RealFrameProps) {
  const compact = useCompact()
  if (compact && props.view) return <RealFrameCompact {...props} view={props.view} />
  return <RealFrameFull {...props} />
}

/** La app a su tamaño de diseño (1240 px). */
function RealApp({ active, crumb, height, children, overlay }: RealFrameProps) {
  return (
    <div className="relative flex text-white antialiased" style={{ width: REAL.width, height, background: REAL.bg, fontFamily: REAL.font }}>
      <Sidebar active={active} />
      <div className="relative flex min-w-0 flex-1 flex-col">
        <TopBar crumb={crumb} />
        <div className="pointer-events-none absolute inset-x-0 top-[58px] h-56 bg-[radial-gradient(ellipse_at_85%_0%,rgba(80,110,255,0.16),transparent_60%)]" />
        <div className="relative min-h-0 flex-1 overflow-hidden">{children}</div>
      </div>
      {overlay}
    </div>
  )
}

function RealFrameCompact({ view, ...props }: RealFrameProps & { view: View }) {
  return (
    <div className="relative w-full overflow-hidden rounded-[14px] ring-1 ring-white/10 shadow-[0_50px_100px_-40px_rgba(0,0,0,0.95)]" style={{ background: REAL.bg }}>
      <Camera width={REAL.width} height={props.height} view={view}><RealApp {...props} /></Camera>
    </div>
  )
}

function RealFrameFull({ active, crumb, height, children, overlay }: RealFrameProps) {
  const box = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  useEffect(() => {
    const el = box.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setScale(Math.min(1, e.contentRect.width / REAL.width)))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return (
    <div ref={box} className="relative w-full overflow-hidden rounded-[14px] ring-1 ring-white/10 shadow-[0_50px_100px_-40px_rgba(0,0,0,0.95)]" style={{ height: height * scale }}>
      <div
        className="absolute left-0 top-0 flex origin-top-left text-white antialiased"
        style={{ width: REAL.width, height, transform: `scale(${scale})`, background: REAL.bg, fontFamily: REAL.font }}
      >
        <Sidebar active={active} />
        <div className="relative flex min-w-0 flex-1 flex-col">
          <TopBar crumb={crumb} />
          <div className="pointer-events-none absolute inset-x-0 top-[58px] h-56 bg-[radial-gradient(ellipse_at_85%_0%,rgba(80,110,255,0.16),transparent_60%)]" />
          <div className="relative min-h-0 flex-1 overflow-hidden">{children}</div>
        </div>
        {overlay}
      </div>
    </div>
  )
}

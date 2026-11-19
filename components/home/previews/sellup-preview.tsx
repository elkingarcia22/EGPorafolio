'use client'

import { useA11y } from '@/lib/a11y'
import { useTick } from '@/components/case/barberlytics/thema/live-pieces'
import { RumboMark } from '@/components/case/sellup/platform'
import { SellUpMark } from '@/components/case/sellup/ui'

/** Guion: el radar de Rumbo encuentra empresas, llega una a «Por revisar», aparecen sus decisoras y el primer contacto queda listo. */
const STEPS = 9
const STEP_MS = 900

/** Pines de empresas sobre el radar (posición en % del radar). */
const PINS = [
  { x: 64, y: 30 }, { x: 30, y: 38 }, { x: 70, y: 66 }, { x: 40, y: 72 }, { x: 55, y: 50 },
]

/** Puntos del mapa de fondo (una cuadrícula recortada en círculo). */
const DOTS = Array.from({ length: 13 * 13 }, (_, i) => ({ x: 4 + (i % 13) * 7.6, y: 4 + Math.floor(i / 13) * 7.6 }))
  .filter((d) => (d.x - 50) ** 2 + (d.y - 50) ** 2 < 46 ** 2 && Math.sin(d.x * 0.31) + Math.cos(d.y * 0.27) > -0.6)

function Radar({ step }: { step: number }) {
  const { reducedMotion } = useA11y()
  return (
    <div className="absolute left-[4%] top-[9%] aspect-square w-[52%]">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
        {DOTS.map((d) => <circle key={`${d.x}-${d.y}`} cx={d.x} cy={d.y} r="0.9" fill="rgba(255,255,255,0.13)" />)}
        {[46, 32, 18].map((r) => <circle key={r} cx="50" cy="50" r={r} fill="none" stroke="rgba(143,166,255,0.22)" strokeWidth="0.4" />)}
      </svg>
      <div
        className={`absolute inset-[4%] rounded-full ${reducedMotion ? '' : 'animate-[spin_2.6s_linear_infinite]'}`}
        style={{ background: 'conic-gradient(from 0deg, rgba(210,45,106,0.38), rgba(126,43,224,0.18) 14%, transparent 28%)' }}
        aria-hidden="true"
      />
      {PINS.map((p, i) => {
        const on = step > i
        return (
          <span
            key={i}
            className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-500 ease-expo"
            style={{ left: `${p.x}%`, top: `${p.y}%`, background: i === 4 ? '#eb6233' : '#8fa6ff', opacity: on ? 1 : 0, transform: `translate(-50%,-50%) scale(${on ? 1 : 0.2})`, boxShadow: on ? `0 0 0 4px ${i === 4 ? 'rgba(235,98,51,0.25)' : 'rgba(143,166,255,0.2)'}` : 'none' }}
          />
        )
      })}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <RumboMark size={36} motion={reducedMotion ? 'still' : step < 5 ? 'thinking' : 'breathing'} glow />
      </div>
    </div>
  )
}

const ROWS = [
  { name: 'Frutícola Los Andes', tag: 'Nueva', tone: 'blue' },
  { name: 'Viñedos Cordillera', tag: 'Ya en HubSpot', tone: 'gray' },
  { name: 'Lácteos del Maule', tag: 'Nueva', tone: 'blue' },
] as const

function ReviewCard({ step }: { step: number }) {
  const arrived = step >= 3
  return (
    <div className="rounded-lg bg-[#141517] p-2 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.9)] ring-1 ring-white/10">
      <div className="mb-1.5 flex items-center gap-1.5">
        <SellUpMark size={12} />
        <span className="text-[8.5px] font-medium text-white/85">Por revisar</span>
        <span className="ml-auto font-mono text-[7px] text-white/40">{arrived ? 613 : 612}</span>
      </div>
      <div
        className="overflow-hidden rounded-[5px] ring-1 transition-all duration-500 ease-expo"
        style={{ maxHeight: arrived ? 40 : 0, opacity: arrived ? 1 : 0, marginBottom: arrived ? 4 : 0, background: 'linear-gradient(90deg,rgba(40,94,230,0.22),rgba(126,43,224,0.12))', boxShadow: arrived ? '0 0 0 2px rgba(107,140,255,0.35)' : 'none', '--tw-ring-color': 'rgba(107,140,255,0.8)' } as React.CSSProperties}
      >
        <div className="flex items-center gap-1.5 px-1.5 py-1">
          <span className="text-[7px]">🇨🇱</span>
          <span className="truncate text-[8px] font-semibold text-white">Agrícola Río Claro</span>
          <span className="ml-auto whitespace-nowrap rounded-[3px] bg-emerald-400/15 px-1 text-[6.5px] text-emerald-300">Nueva · libre</span>
        </div>
      </div>
      {ROWS.map((r) => (
        <div key={r.name} className="flex items-center gap-1.5 border-t border-white/[0.06] px-1.5 py-1">
          <span className="text-[7px]">🇨🇱</span>
          <span className="truncate text-[8px] text-white/70">{r.name}</span>
          <span className={`ml-auto whitespace-nowrap rounded-[3px] px-1 text-[6.5px] ${r.tone === 'blue' ? 'bg-[#6b8cff]/15 text-[#9db0ff]' : 'bg-white/[0.07] text-white/55'}`}>{r.tag}</span>
        </div>
      ))}
    </div>
  )
}

function Contacts({ step }: { step: number }) {
  const people = ['Valeria O. · Talento', 'Jorge P. · RR. HH.', 'Lucía T. · Formación']
  return (
    <div className="space-y-1">
      {people.map((p, i) => {
        const on = step >= 5
        return (
          <div
            key={p}
            className="flex items-center gap-1.5 rounded-md bg-[#141517] px-1.5 py-1 ring-1 ring-white/10 transition-all duration-500 ease-expo"
            style={{ opacity: on ? 1 : 0, transform: on ? 'none' : 'translateX(10px)', transitionDelay: `${i * 120}ms` }}
          >
            <span className="grid h-3.5 w-3.5 place-items-center rounded-full text-[6px] font-semibold text-white" style={{ background: 'linear-gradient(135deg,#285ee6,#7e2be0)' }}>{p[0]}</span>
            <span className="truncate text-[7.5px] text-white/80">{p}</span>
            {i === 0 && <span className="ml-auto font-mono text-[6.5px] text-emerald-300">☎ ✓</span>}
          </div>
        )
      })}
    </div>
  )
}

function Message() {
  return (
    <div
      className="rounded-lg p-[1px]"
      style={{ background: 'linear-gradient(90deg,#285ee6,#7e2be0,#d22d6a,#eb6233)' }}
    >
      <div className="rounded-[7px] bg-[#141517] px-2 py-1.5">
        <p className="font-mono text-[6.5px] uppercase tracking-wider text-white/40">Primer contacto · llamada</p>
        <p className="mt-0.5 text-[8px] leading-snug text-white/85">«Valeria, vi que abren 3 plantas en 2026. ¿Cómo piensan formar a los nuevos equipos?»</p>
      </div>
    </div>
  )
}

/** Vista previa de SellUp en la lista de proyectos: el radar de Rumbo encuentra la empresa, sus decisoras y qué decirles. */
export function SellUpPreview() {
  const { reducedMotion } = useA11y()
  const tick = useTick(STEP_MS)
  const step = reducedMotion ? STEPS - 1 : tick % STEPS
  const phase = step < 5 ? 0 : step < 7 ? 1 : 2
  const label = ['Agente 1 · buscando empresas', 'Agente 2 · buscando decisoras', 'Agente 3 · primer contacto'][phase]
  return (
    <div className="relative aspect-[4/3] overflow-hidden bg-[#0b0c0f]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_65%_at_28%_42%,rgba(126,43,224,0.2),transparent_70%),radial-gradient(40%_50%_at_90%_95%,rgba(235,98,51,0.12),transparent_70%)]" aria-hidden="true" />
      <Radar step={step} />
      {/* Una tarjeta a la vez: Por revisar → decisoras → primer contacto */}
      <div className="absolute right-[4%] top-1/2 w-[44%] -translate-y-1/2">
        {[<ReviewCard key="r" step={step} />, <Contacts key="c" step={step} />, <Message key="m" />].map((card, i) => {
          const on = phase === i
          return (
            <div key={i} className={`transition-all duration-500 ease-expo ${i === 0 ? 'relative' : 'absolute inset-x-0 top-1/2 -translate-y-1/2'}`} style={{ opacity: on ? 1 : 0, transform: `${i === 0 ? '' : 'translateY(-50%) '}${on ? 'none' : 'translateX(14px) scale(0.97)'}`.replace('none', 'translateX(0)') }}>
              {card}
            </div>
          )
        })}
      </div>
      <span className="absolute bottom-[4%] left-[4%] font-mono text-[9px] uppercase tracking-[0.18em] text-white/45">{label}</span>
      <span className="sr-only">El radar de Rumbo encuentra empresas en Chile, una llega a «Por revisar», aparecen sus decisoras y queda listo el primer contacto.</span>
    </div>
  )
}

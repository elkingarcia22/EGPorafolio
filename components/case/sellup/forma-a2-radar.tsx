'use client'

import { Building2, Check, Minus } from 'lucide-react'

/**
 * Agente 2 · el radar de personas: la empresa al centro se abre en una
 * constelación; cada anillo es una fuente de la cascada (HubSpot → lo ya
 * conocido → Apollo → Lusha) y un barrido ilumina a quienes encuentra. Las que
 * deciden suben con su cargo y luego salen volando hacia «Por revisar».
 * Medidas de diseño: 960 × 560 px (se escala con `Scaled`).
 */

export const RADAR_W = 960
export const RADAR_H = 560
const CX = 480
const CY = 300
export const RINGS = [
  { name: 'HubSpot', r: 92, at: 2, note: '1 decisora · gratis' },
  { name: 'Lo ya conocido', r: 150, at: 4, note: '1 decisora · gratis' },
  { name: 'Apollo', r: 208, at: 6, note: '2 decisores · 3 créditos' },
  { name: 'Lusha', r: 262, at: 8, note: 'No hizo falta' },
] as const

export interface Person {
  i: string
  ring: number
  deg: number
  role?: string
}

export const PEOPLE: readonly Person[] = [
  { i: 'VO', ring: 0, deg: 205, role: 'Directora de Talento' },
  { i: 'MR', ring: 0, deg: 320 },
  { i: 'JP', ring: 0, deg: 70 },
  { i: 'LT', ring: 1, deg: 145, role: 'Líder de Formación' },
  { i: 'AS', ring: 1, deg: 15 },
  { i: 'DF', ring: 1, deg: 260 },
  { i: 'CR', ring: 2, deg: 235, role: 'Gerente de RR. HH.' },
  { i: 'NG', ring: 2, deg: 175 },
  { i: 'EP', ring: 2, deg: 305, role: 'Jefa de Capital Humano' },
  { i: 'KM', ring: 2, deg: 40 },
  { i: 'BU', ring: 2, deg: 110 },
]
const round = (n: number) => Math.round(n * 100) / 100
const POS = PEOPLE.map((p) => {
  const a = (p.deg * Math.PI) / 180
  return { x: round(CX + RINGS[p.ring].r * Math.cos(a)), y: round(CY + RINGS[p.ring].r * Math.sin(a)) }
})
const DECIDERS = PEOPLE.map((p, k) => (p.role ? k : -1)).filter((k) => k >= 0)

const EASE = 'cubic-bezier(0.16,1,0.3,1)'
export const CREDITS = 8
/**
 * Largo del bucle (ticks). El último es la salida: personas, anillos, cascada y créditos
 * se desvanecen juntos en su lugar; al volver a 0 las personas regresan al centro ya ocultas.
 */
export const A2_LOOP = 16
export const isA2Exit = (t: number) => t >= A2_LOOP - 1

/** `t`: segundos (ticks) desde que empieza la escena del radar. */
export function PeopleRadar({ t }: { t: number }) {
  const scanning = t >= 2 && t < 10
  const rise = t >= 10
  const fly = t >= 12
  const exit = isA2Exit(t)
  const found = (ring: number) => t >= RINGS[ring].at
  const lit = (ring: number) => !exit && found(ring)
  const used = t >= 6 && !exit ? 3 : 0
  const back = t >= 10 && !exit
  const ready = t >= 1 && !exit
  return (
    <div className="relative overflow-hidden rounded-[22px] text-white" style={{ width: RADAR_W, height: RADAR_H, background: 'radial-gradient(ellipse at 50% 55%,#151a2e 0%,#0b0c10 70%)', fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' }}>
      <div className="pointer-events-none absolute inset-0 opacity-[0.18]" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.5) 1px,transparent 1px)', backgroundSize: '22px 22px' }} />
      <p className="absolute left-6 top-5 text-[12px] uppercase tracking-[0.18em] text-white/60">Agente 2 · radar de decisores</p>
      <p className="absolute left-6 top-10 text-[15px] font-medium">{fly ? 'Decisores listos para revisar →' : rise ? 'Quien decide sube con su cargo' : scanning ? `Barriendo ${RINGS[Math.min(3, Math.max(0, Math.floor((t - 2) / 2)))].name}…` : 'Abriendo Clínica Andina…'}</p>

      {/* Anillos y líneas */}
      <svg viewBox={`0 0 ${RADAR_W} ${RADAR_H}`} className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id="a2-ring" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#285ee6" />
            <stop offset="0.6" stopColor="#7e2be0" />
            <stop offset="1" stopColor="#d22d6a" />
          </linearGradient>
        </defs>
        {RINGS.map((ring, k) => (
          <circle
            key={ring.name}
            cx={CX}
            cy={CY}
            r={ring.r}
            fill="none"
            stroke={lit(k) && k < 3 ? 'url(#a2-ring)' : 'rgba(255,255,255,0.1)'}
            strokeWidth={lit(k) && k < 3 ? 1.6 : 1}
            strokeDasharray={k === 3 ? '4 6' : undefined}
            style={{ transition: `stroke 300ms, opacity 300ms`, opacity: ready ? (k === 3 && t >= 8 ? 0.35 : 1) : 0 }}
          />
        ))}
        {PEOPLE.map((p, k) => (
          <line
            key={p.i}
            x1={CX}
            y1={CY}
            x2={POS[k].x}
            y2={POS[k].y}
            stroke="rgba(155,180,255,0.25)"
            strokeDasharray="3 4"
            style={{ opacity: lit(p.ring) && !rise ? 1 : 0, transition: 'opacity 300ms' }}
          />
        ))}
      </svg>

      {/* Barrido */}
      <div
        className="pointer-events-none absolute rounded-full motion-reduce:hidden"
        style={{
          left: CX - 262,
          top: CY - 262,
          width: 524,
          height: 524,
          background: 'conic-gradient(from 0deg,rgba(126,43,224,0.45),rgba(40,94,230,0.12) 14%,transparent 26%)',
          animation: 'a2-sweep 1.1s linear infinite',
          opacity: scanning ? 1 : 0,
          transition: 'opacity 300ms',
        }}
      />
      <style>{'@keyframes a2-sweep{to{transform:rotate(360deg)}}'}</style>

      {/* Etiquetas de anillo */}
      {RINGS.map((ring, k) => (
        <span
          key={ring.name}
          className="absolute -translate-y-1/2 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] ring-1 transition-all duration-300"
          style={{
            left: Math.round(CX + ring.r * 0.978) - 6,
            top: Math.round(CY - ring.r * 0.208),
            opacity: ready ? 1 : 0,
            background: lit(k) ? (k === 3 ? 'rgba(255,255,255,0.05)' : 'rgba(107,140,255,0.2)') : 'rgba(10,10,12,0.9)',
            color: lit(k) ? (k === 3 ? 'rgba(255,255,255,0.45)' : '#fff') : 'rgba(255,255,255,0.4)',
            boxShadow: lit(k) && k < 3 ? '0 0 18px rgba(107,140,255,0.45)' : 'none',
            borderColor: 'transparent',
          }}
        >
          {k + 1} · {ring.name}
        </span>
      ))}

      {/* Personas */}
      {PEOPLE.map((p, k) => {
        const on = found(p.ring)
        const d = DECIDERS.indexOf(k)
        const isDecider = d >= 0
        const laneX = 210 + d * 180
        const x = rise && isDecider ? laneX : on ? POS[k].x : CX
        const y = rise && isDecider ? 108 : on ? POS[k].y : CY
        const gone = fly && isDecider
        return (
          <div
            key={p.i}
            className="absolute left-0 top-0"
            style={{
              transform: `translate(${gone ? 1020 : x}px, ${y}px) scale(${on ? 1 : 0.2})`,
              opacity: on && !exit ? (rise && !isDecider ? 0.18 : gone ? 0 : 1) : 0,
              filter: gone ? 'blur(6px)' : 'none',
              transition: `transform ${gone ? 380 : 450}ms ${EASE} ${gone ? d * 60 : 0}ms, opacity 300ms, filter 300ms`,
            }}
          >
            <div className="-translate-x-1/2 -translate-y-1/2">
              <span
                className="grid h-9 w-9 place-items-center rounded-full text-[12px] font-semibold"
                style={{
                  background: isDecider ? 'linear-gradient(135deg,#285ee6,#7e2be0 60%,#d22d6a)' : '#23252d',
                  boxShadow: isDecider && on ? '0 0 0 3px rgba(107,140,255,0.25), 0 0 24px rgba(126,43,224,0.6)' : 'none',
                  color: isDecider ? '#fff' : 'rgba(255,255,255,0.7)',
                }}
              >
                {p.i}
              </span>
              {isDecider && (
                <span className="absolute left-1/2 top-11 -translate-x-1/2 whitespace-nowrap rounded-md bg-white/[0.08] px-2 py-0.5 text-[11.5px] ring-1 ring-white/10 transition-opacity duration-300" style={{ opacity: rise ? 1 : 0 }}>
                  {p.role}
                </span>
              )}
            </div>
          </div>
        )
      })}

      {/* La empresa al centro */}
      <div className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-[400ms]" style={{ left: CX, top: CY, opacity: t >= 0 ? 1 : 0, transform: `translate(-50%,-50%) scale(${rise ? 0.85 : 1})` }}>
        <div className="flex items-center gap-2 rounded-2xl border border-white/15 bg-[#14161d] px-3 py-2 shadow-[0_10px_40px_-10px_rgba(40,94,230,0.6)]">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#6b8cff]/20 text-[#9db0ff]"><Building2 className="h-4 w-4" /></span>
          <span><span className="block text-[13.5px] font-semibold leading-tight">Clínica Andina</span><span className="block text-[11px] text-white/60">1.240 empleados</span></span>
        </div>
      </div>

      {/* Cascada */}
      <ul className="absolute bottom-5 left-6 w-[270px] space-y-1.5">
        {RINGS.map((ring, k) => (
          <li key={ring.name} className="flex items-center gap-2 rounded-lg bg-black/40 px-2.5 py-1.5 text-[12px] ring-1 ring-white/10 transition-all duration-300" style={{ opacity: lit(k) ? 1 : 0.35 }}>
            {lit(k) ? (k === 3 ? <Minus className="h-3.5 w-3.5 text-white/40" /> : <Check className="h-3.5 w-3.5 text-emerald-400" />) : <span className="h-3.5 w-3.5 rounded-full border border-white/25" />}
            <span className="whitespace-nowrap font-medium">{ring.name}</span>
            <span className="ml-auto whitespace-nowrap text-white/55">{lit(k) ? ring.note : '…'}</span>
          </li>
        ))}
      </ul>

      {/* Créditos */}
      <div className="absolute bottom-5 right-6 w-[230px] rounded-xl bg-black/40 p-3 ring-1 ring-white/10">
        <p className="flex items-center text-[12px] text-white/60">Créditos reservados<span className="ml-auto font-semibold tabular-nums text-white">{ready ? CREDITS : 0}</span></p>
        <div className="mt-2 grid grid-cols-8 gap-1">
          {Array.from({ length: CREDITS }, (_, k) => {
            const isUsed = k < used
            const isBack = back && !isUsed
            return (
              <span
                key={k}
                className="h-3 rounded-sm transition-all duration-300"
                style={{
                  transitionDelay: `${k * 40}ms`,
                  background: !ready ? 'rgba(255,255,255,0.08)' : isUsed ? '#eb6233' : isBack ? '#34d399' : '#6b8cff',
                  transform: isBack ? 'translateY(-3px)' : 'none',
                }}
              />
            )
          })}
        </div>
        <p className="mt-2 text-[11.5px] text-white/55">{back ? '3 usados · 5 devueltos' : used ? '3 usados en Apollo' : 'Se reservan antes de llamar'}</p>
      </div>
    </div>
  )
}

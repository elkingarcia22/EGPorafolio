'use client'

import { Building2, Check, Minus } from 'lucide-react'
import { CREDITS, PEOPLE, RINGS, isA2Exit } from './forma-a2-radar'
import { useWidth } from './camera'

/**
 * Agente 2 · el radar de decisores, rehecho para teléfono y tableta (no es un recorte
 * del de escritorio): el radar solo y completo, con los anillos ajustados al ancho y
 * avatares y textos a tamaño fijo legible; debajo, en tarjetas limpias, quién decide,
 * la cascada de fuentes y los créditos. Mismo reloj y mismos datos que en escritorio.
 */

const EASE = 'cubic-bezier(0.16,1,0.3,1)'
/** Diámetro máximo del radar en pantallas anchas (tableta). */
const MAX_D = 440
/** Margen entre el anillo exterior y el borde, para que ningún avatar se corte. */
const EDGE = 22
/** Radio del anillo interior como fracción del exterior: deja aire a la empresa del centro. */
const INNER = 0.42
const AVATAR = 30

const CARD = 'rounded-[18px] bg-[#0f1117] p-4 ring-1 ring-white/10'

/** Lo que dice el radar en cada momento (el mismo texto que en escritorio). */
function statusAt(t: number): string {
  if (t >= 12) return 'Decisores listos para revisar →'
  if (t >= 10) return 'Quien decide sube con su cargo'
  if (t >= 2) return `Barriendo ${RINGS[Math.min(3, Math.max(0, Math.floor((t - 2) / 2)))].name}…`
  return 'Abriendo Clínica Andina…'
}

/** Radio en px de cada anillo para un radar de radio exterior `outer`. */
function ringRadius(k: number, outer: number): number {
  const first = RINGS[0].r
  const last = RINGS[RINGS.length - 1].r
  return outer * (INNER + ((RINGS[k].r - first) / (last - first)) * (1 - INNER))
}

function Radar({ t }: { t: number }) {
  const [box, boxW] = useWidth<HTMLDivElement>()
  const d = Math.min(boxW, MAX_D)
  const c = d / 2
  const outer = c - EDGE
  const scanning = t >= 2 && t < 10
  const rise = t >= 10
  const exit = isA2Exit(t)
  const ready = t >= 1 && !exit
  const found = (ring: number) => t >= RINGS[ring].at
  const lit = (ring: number) => !exit && found(ring)
  const pos = (ring: number, deg: number) => {
    const a = (deg * Math.PI) / 180
    const r = ringRadius(ring, outer)
    return { x: c + r * Math.cos(a), y: c + r * Math.sin(a) }
  }
  return (
    <div ref={box} className="w-full">
      {d > 0 && (
        <div className="relative mx-auto" style={{ width: d, height: d }}>
          <svg viewBox={`0 0 ${d} ${d}`} className="absolute inset-0 h-full w-full" aria-hidden="true">
            <defs>
              <linearGradient id="a2m-ring" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0" stopColor="#285ee6" />
                <stop offset="0.6" stopColor="#7e2be0" />
                <stop offset="1" stopColor="#d22d6a" />
              </linearGradient>
            </defs>
            {RINGS.map((ring, k) => (
              <circle
                key={ring.name}
                cx={c}
                cy={c}
                r={ringRadius(k, outer)}
                fill="none"
                stroke={lit(k) && k < 3 ? 'url(#a2m-ring)' : 'rgba(255,255,255,0.12)'}
                strokeWidth={lit(k) && k < 3 ? 1.6 : 1}
                strokeDasharray={k === 3 ? '4 6' : undefined}
                style={{ transition: 'stroke 300ms, opacity 300ms', opacity: ready ? (k === 3 && t >= 8 ? 0.35 : 1) : 0 }}
              />
            ))}
            {PEOPLE.map((p) => {
              const q = pos(p.ring, p.deg)
              return <line key={p.i} x1={c} y1={c} x2={q.x} y2={q.y} stroke="rgba(155,180,255,0.25)" strokeDasharray="3 4" style={{ opacity: lit(p.ring) && !rise ? 1 : 0, transition: 'opacity 300ms' }} />
            })}
          </svg>

          {/* Barrido */}
          <div
            className="pointer-events-none absolute rounded-full motion-reduce:hidden"
            style={{ left: c - outer, top: c - outer, width: outer * 2, height: outer * 2, background: 'conic-gradient(from 0deg,rgba(126,43,224,0.45),rgba(40,94,230,0.12) 14%,transparent 26%)', animation: 'a2m-sweep 1.1s linear infinite', opacity: scanning ? 1 : 0, transition: 'opacity 300ms' }}
          />
          <style>{'@keyframes a2m-sweep{to{transform:rotate(360deg)}}'}</style>

          {/* Personas */}
          {PEOPLE.map((p) => {
            const on = found(p.ring)
            const decider = Boolean(p.role)
            const q = on ? pos(p.ring, p.deg) : { x: c, y: c }
            return (
              <span
                key={p.i}
                className="absolute left-0 top-0 grid place-items-center rounded-full text-[11px] font-semibold"
                style={{
                  width: AVATAR,
                  height: AVATAR,
                  transform: `translate(${q.x - AVATAR / 2}px, ${q.y - AVATAR / 2}px) scale(${on ? (rise && decider ? 1.15 : 1) : 0.2})`,
                  opacity: on && !exit ? (rise && !decider ? 0.2 : 1) : 0,
                  background: decider ? 'linear-gradient(135deg,#285ee6,#7e2be0 60%,#d22d6a)' : '#23252d',
                  boxShadow: decider && on ? '0 0 0 3px rgba(107,140,255,0.25), 0 0 20px rgba(126,43,224,0.6)' : 'none',
                  color: decider ? '#fff' : 'rgba(255,255,255,0.75)',
                  transition: `transform 450ms ${EASE}, opacity 300ms`,
                }}
                aria-hidden="true"
              >
                {p.i}
              </span>
            )
          })}

          {/* La empresa al centro: solo el ícono; el nombre va en la cabecera de la tarjeta */}
          <span className="absolute grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-xl border border-white/15 bg-[#14161d] text-[#9db0ff] shadow-[0_10px_40px_-10px_rgba(40,94,230,0.6)]" style={{ left: c, top: c }} aria-hidden="true">
            <Building2 className="h-5 w-5" />
          </span>
        </div>
      )}
    </div>
  )
}

/** Quienes deciden, con su cargo: aparecen cuando suben en el radar. */
function Deciders({ t }: { t: number }) {
  const exit = isA2Exit(t)
  const rise = t >= 10 && !exit
  const fly = t >= 12 && !exit
  const deciders = PEOPLE.filter((p) => p.role)
  return (
    <div className={CARD}>
      <p className="flex items-center text-[12px] text-white/60">Quien decide<span className="ml-auto text-white/45">{fly ? '→ Por revisar' : rise ? `${deciders.length} decisores` : 'buscando…'}</span></p>
      <ul className="mt-2.5 grid gap-1.5 min-[440px]:grid-cols-2 md:grid-cols-1">
        {deciders.map((p, k) => (
          <li
            key={p.i}
            className="flex min-w-0 items-center gap-2 rounded-lg bg-white/[0.04] px-2 py-1.5 ring-1 ring-white/10"
            style={{ opacity: rise ? 1 : 0.3, transform: fly ? 'translateX(6px)' : 'none', transition: `opacity 300ms ${k * 60}ms, transform 380ms ${EASE} ${k * 60}ms` }}
          >
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-semibold" style={{ background: 'linear-gradient(135deg,#285ee6,#7e2be0 60%,#d22d6a)' }}>{p.i}</span>
            <span className="truncate text-[12px]">{rise ? p.role : '…'}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** La cascada de fuentes: el mismo listado que en escritorio, a todo el ancho. */
function Cascade({ t }: { t: number }) {
  const lit = (ring: number) => !isA2Exit(t) && t >= RINGS[ring].at
  return (
    <ul className={`${CARD} space-y-1.5`}>
      {RINGS.map((ring, k) => (
        <li key={ring.name} className="flex items-center gap-2 rounded-lg bg-black/40 px-2.5 py-1.5 text-[12px] ring-1 ring-white/10 transition-all duration-300" style={{ opacity: lit(k) ? 1 : 0.4 }}>
          {lit(k) ? (k === 3 ? <Minus className="h-3.5 w-3.5 text-white/40" /> : <Check className="h-3.5 w-3.5 text-emerald-400" />) : <span className="h-3.5 w-3.5 rounded-full border border-white/25" />}
          <span className="whitespace-nowrap font-medium">{k + 1} · {ring.name}</span>
          <span className="ml-auto whitespace-nowrap text-white/55">{lit(k) ? ring.note : '…'}</span>
        </li>
      ))}
    </ul>
  )
}

/** Los créditos: se reservan antes de llamar y lo que no se usa vuelve. */
function Credits({ t }: { t: number }) {
  const exit = isA2Exit(t)
  const ready = t >= 1 && !exit
  const used = t >= 6 && !exit ? 3 : 0
  const back = t >= 10 && !exit
  return (
    <div className={CARD}>
      <p className="flex items-center text-[12px] text-white/60">Créditos reservados<span className="ml-auto font-semibold tabular-nums text-white">{ready ? CREDITS : 0}</span></p>
      <div className="mt-2 grid grid-cols-8 gap-1">
        {Array.from({ length: CREDITS }, (_, k) => {
          const isUsed = k < used
          const isBack = back && !isUsed
          return <span key={k} className="h-3 rounded-sm transition-all duration-300" style={{ transitionDelay: `${k * 40}ms`, background: !ready ? 'rgba(255,255,255,0.08)' : isUsed ? '#eb6233' : isBack ? '#34d399' : '#6b8cff', transform: isBack ? 'translateY(-3px)' : 'none' }} />
        })}
      </div>
      <p className="mt-2 text-[12px] text-white/55">{back ? '3 usados · 5 devueltos' : used ? '3 usados en Apollo' : 'Se reservan antes de llamar'}</p>
    </div>
  )
}

/** `t`: ticks desde que empieza la escena del radar (el mismo reloj que en escritorio). */
export function PeopleRadarMobile({ t }: { t: number }) {
  return (
    <div className="grid gap-2 text-white md:grid-cols-[minmax(0,1fr)_300px] md:items-start" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' }}>
      <div className="overflow-hidden rounded-[22px] p-4 ring-1 ring-white/10" style={{ background: 'radial-gradient(ellipse at 50% 60%,#151a2e 0%,#0b0c10 70%)' }}>
        <p className="text-[11px] uppercase tracking-[0.16em] text-white/45">Agente 2 · Clínica Andina · 1.240 empleados</p>
        <p className="mt-1 text-[15px] font-medium" aria-live="polite">{statusAt(t)}</p>
        <div className="mt-3"><Radar t={t} /></div>
      </div>
      <div className="space-y-2">
        <Deciders t={t} />
        <Cascade t={t} />
        <Credits t={t} />
      </div>
    </div>
  )
}

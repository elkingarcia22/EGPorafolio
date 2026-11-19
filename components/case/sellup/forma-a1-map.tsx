'use client'

import { Check, Minus } from 'lucide-react'

/**
 * Agente 1 · radar sobre el mapa: un radar con los círculos de la brújula de Rumbo
 * salta de país en país (México → Colombia → Perú → Chile); cada barrido hace
 * aparecer empresas candidatas, las fuentes se encienden en cascada (lo gratis
 * primero; Apollo solo si falta) y al final las candidatas de Chile vuelan a la tabla.
 * Medidas: 960 × 560 (se escala con `Scaled`). Empresas de ejemplo.
 */

export const MAP_W = 960
export const MAP_H = 560

type LonLat = readonly [number, number]
const px = ([lon, lat]: LonLat): [number, number] => [Math.round(60 + (lon + 120) * 6), Math.round(20 + (50 - lat) * 5)]

const LAND: readonly (readonly LonLat[])[] = [
  [[-124, 48], [-95, 49], [-83, 46], [-67, 45], [-70, 41], [-76, 35], [-81, 31], [-80, 25], [-82, 28], [-90, 30], [-97, 26], [-106, 31], [-117, 32], [-124, 40]],
  [[-117, 32], [-106, 31], [-97, 26], [-97, 22], [-94, 18], [-87, 21], [-88, 18], [-92, 15], [-97, 16], [-105, 20], [-110, 23], [-114, 30]],
  [[-92, 15], [-88, 16], [-83, 15], [-83, 11], [-77, 8], [-79, 9.5], [-83, 8], [-86, 11], [-88, 13]],
  [[-85, 22.5], [-74, 20.5], [-77, 19.5], [-84, 21.5]],
  [[-74.5, 20], [-68, 19], [-69, 17.8], [-74.5, 18]],
  [[-80, 1], [-77, 7.5], [-72, 12], [-62, 11], [-52, 5], [-50, 0], [-35, -6], [-39, -15], [-48, -26], [-58, -34], [-62, -40], [-65, -47], [-68, -55], [-74, -50], [-73, -40], [-71, -30], [-70, -18], [-76, -14], [-81, -6]],
]

function inside(p: LonLat, poly: readonly LonLat[]): boolean {
  let on = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i]
    const [xj, yj] = poly[j]
    if (yi > p[1] !== yj > p[1] && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) on = !on
  }
  return on
}

/** Puntos del mapa (rejilla fija: el mismo resultado en servidor y cliente). */
const DOTS: readonly { x: number; y: number }[] = (() => {
  const out: { x: number; y: number }[] = []
  for (let lat = 49; lat >= -56; lat -= 1.6) {
    for (let lon = -125; lon <= -34; lon += 1.25) {
      const p: LonLat = [lon, lat]
      if (LAND.some((poly) => inside(p, poly))) {
        const [x, y] = px(p)
        out.push({ x, y })
      }
    }
  }
  return out
})()

interface Stop {
  country: string
  flag: string
  query: string
  at: LonLat
  from: number
  found: number
  pins: readonly { name: string; at: LonLat; star?: boolean }[]
}

/** Las paradas del radar: cada una es una búsqueda del equipo (empresas de ejemplo). */
const STOPS: readonly Stop[] = [
  { country: 'México', flag: '🇲🇽', query: 'Salud · más de 200 empleados', at: [-101, 21], from: 0, found: 9, pins: [{ name: 'Clínica Andina', at: [-99.2, 19.5] }, { name: 'Grupo Vital Salud', at: [-103.4, 20.7] }, { name: 'Hospitales del Valle', at: [-100.3, 25.7] }] },
  { country: 'Colombia', flag: '🇨🇴', query: 'Banca y seguros', at: [-74.5, 5], from: 3, found: 6, pins: [{ name: 'Banca Solar', at: [-74.1, 4.7] }, { name: 'Seguros Ceiba', at: [-75.6, 6.2] }] },
  { country: 'Perú', flag: '🇵🇪', query: 'Minería y energía', at: [-75.5, -10], from: 5, found: 5, pins: [{ name: 'Minera Altiplano', at: [-77, -12] }, { name: 'Energía Andina', at: [-71.5, -16.4] }] },
  { country: 'Chile', flag: '🇨🇱', query: 'Agroindustria · más de 200 empleados', at: [-71, -34], from: 7, found: 7, pins: [{ name: 'Frutícola Los Andes', at: [-70.6, -32.8] }, { name: 'Agrícola Río Claro', at: [-70.7, -34.4], star: true }, { name: 'Viñedos Cordillera', at: [-71.6, -35.6] }, { name: 'Salmones Patagonia', at: [-72.9, -40] }] },
]
const FLY_AT = 10

const SOURCES = [
  { name: 'HubSpot · libres', t: 1, note: 'gratis' },
  { name: 'Registros oficiales', t: 2, note: 'gratis' },
  { name: 'Banco de empresas', t: 4, note: 'gratis' },
  { name: 'Web · sitio y dominio', t: 6, note: 'verifica' },
  { name: 'Apollo', t: 8, note: 'No hizo falta', skip: true },
] as const

const RADIUS = 92
const SPRING = 'cubic-bezier(0.34,1.56,0.64,1)'
const EXPO = 'cubic-bezier(0.16,1,0.3,1)'
const SWEEP = 'conic-gradient(from 0deg, rgba(40,94,230,0) 0deg, rgba(40,94,230,0) 250deg, rgba(40,94,230,0.25) 290deg, rgba(126,43,224,0.55) 335deg, rgba(210,45,106,0.85) 358deg, rgba(235,98,51,0) 360deg)'
const NEEDLE = 'M12 3.6 L15.4 12.6 L12 10.7 L8.6 12.6 Z'
const TAIL = 'M12 20.4 L10.3 14.9 L12 15.9 L13.7 14.9 Z'

const stopAt = (t: number) => STOPS.reduce((acc, s, i) => (t >= s.from ? i : acc), 0)

/** El radar: círculos de la brújula de Rumbo, barrido con su degradado y la aguja al centro. */
function Radar({ x, y, k, spin }: { x: number; y: number; k: number; spin: boolean }) {
  const d = RADIUS * 2
  return (
    <div className="pointer-events-none absolute" style={{ left: x - RADIUS, top: y - RADIUS, width: d, height: d, transition: `left 480ms ${EXPO}, top 480ms ${EXPO}` }}>
      {[1, 0.66, 0.33].map((r) => (
        <span key={r} className="absolute rounded-full border" style={{ inset: `${((1 - r) / 2) * 100}%`, borderColor: r === 1 ? 'rgba(157,176,255,0.5)' : 'rgba(157,176,255,0.22)' }} />
      ))}
      <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/10" />
      <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white/10" />
      {spin && <span className="absolute inset-0 rounded-full" style={{ background: SWEEP, animation: 'a1r-spin 1.05s linear infinite' }} />}
      {spin && <span key={k} className="absolute inset-0 rounded-full border-2 border-[#9db0ff]" style={{ animation: 'a1r-arrive 620ms ease-out both' }} />}
      <svg viewBox="0 0 24 24" className="absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2" fill="white" aria-hidden="true">
        <circle cx="12" cy="12" r="9.6" fill="rgba(13,14,16,0.85)" stroke="white" strokeWidth="1.6" />
        <g style={{ transformBox: 'view-box', transformOrigin: '12px 12px', animation: spin ? 'a1r-spin 1.6s linear infinite' : undefined }}>
          <g transform="rotate(32 12 12)"><path d={NEEDLE} /><path d={TAIL} opacity="0.55" /></g>
        </g>
        <circle cx="12" cy="12" r="1.2" />
      </svg>
    </div>
  )
}

/** Dónde está el radar (px de diseño) en el tick `t`: lo sigue la cámara en pantallas chicas. */
export function radarAt(tick: number, still = false): readonly [number, number] {
  return px(STOPS[stopAt(still ? FLY_AT - 1 : tick)].at)
}

/** Encuadre de la columna derecha (países, fuentes y contadores). */
export const MAP_SIDE_VIEW = { cx: MAP_W - 24 - 150, cy: 78 + 166, w: 316, h: 336 } as const

/** `t`: ticks desde que empieza la escena (0–10). */
export function SearchMap({ t: tick, still = false }: { t: number; still?: boolean }) {
  const t = still ? FLY_AT - 1 : tick
  const idx = stopAt(t)
  const stop = STOPS[idx]
  const [rx, ry] = px(stop.at)
  const fly = !still && t >= FLY_AT
  const pinOn = (s: Stop, j: number) => t >= s.from + Math.ceil(j / 2)
  const total = STOPS.reduce((n, s, i) => n + (i < idx ? s.found : i === idx ? Math.round(s.found * Math.min(1, (t - s.from + 1) / 2)) : 0), 0)
  const chile = STOPS[STOPS.length - 1]
  return (
    <div className="relative overflow-hidden rounded-[22px] text-white" style={{ width: MAP_W, height: MAP_H, background: 'radial-gradient(ellipse at 35% 55%,#151a2e 0%,#0b0c10 70%)', fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' }}>
      <style>{'@keyframes a1r-spin{to{transform:rotate(360deg)}}@keyframes a1r-arrive{0%{transform:scale(.4);opacity:1}100%{transform:scale(1.6);opacity:0}}@keyframes a1r-ping{0%{transform:scale(.6);opacity:.9}100%{transform:scale(2.8);opacity:0}}'}</style>
      <p className="absolute left-6 top-5 text-[12px] uppercase tracking-[0.18em] text-white/45">Agente 1 · radar de búsqueda</p>
      <p key={idx} className="absolute left-6 top-10 text-[15px] font-medium" style={{ animation: still ? undefined : 'a1-fadein 300ms ease-out' }}>
        {fly ? 'Candidatas listas para revisar →' : `${stop.flag} ${stop.country} · ${stop.query}`}
      </p>
      <style>{'@keyframes a1-fadein{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}@keyframes a1-bump{from{transform:scale(1.18);color:#b7c6ff}to{transform:none}}'}</style>

      {/* Mapa */}
      <div className="absolute left-0 top-0 h-full w-[620px] overflow-hidden" style={{ maskImage: 'linear-gradient(to bottom,transparent 0,#000 96px)', WebkitMaskImage: 'linear-gradient(to bottom,transparent 0,#000 96px)' }}>
        <svg viewBox={`0 0 620 ${MAP_H}`} className="absolute inset-0 h-full w-full" aria-hidden="true">
          {DOTS.map((d) => {
            const near = Math.hypot(d.x - rx, d.y - ry) < RADIUS
            return <circle key={`${d.x}-${d.y}`} cx={d.x} cy={d.y} r={near ? 2.3 : 2} fill={near ? '#7d93ff' : 'rgba(255,255,255,0.15)'} style={{ transition: 'fill 350ms' }} />
          })}
          {STOPS.map((s, i) =>
            s.pins.map((p, j) => {
              const [x, y] = px(p.at)
              const on = still ? i === STOPS.length - 1 || i < idx : i < idx || (i === idx && pinOn(s, j))
              const dim = i < idx && !p.star
              return (
                <g key={p.name} style={{ transform: on ? 'scale(1)' : 'scale(0)', transformBox: 'fill-box', transformOrigin: 'center', transition: `transform 380ms ${SPRING}`, opacity: dim ? 0.55 : 1 }}>
                  <circle cx={x} cy={y} r={p.star ? 5 : 3.6} fill={p.star ? '#fff' : '#b7c6ff'} stroke={p.star ? '#d22d6a' : 'none'} strokeWidth={2} />
                  {on && !still && i === idx && <circle cx={x} cy={y} r={4} fill="none" stroke={p.star ? '#eb6233' : '#9db0ff'} style={{ transformBox: 'fill-box', transformOrigin: 'center', animation: 'a1r-ping 900ms ease-out 2' }} />}
                </g>
              )
            }),
          )}
        </svg>
        {/* Nombre de la empresa junto a su blip (solo la parada activa) */}
        {stop.pins.map((p, j) => {
          const [x, y] = px(p.at)
          const on = still || pinOn(stop, j)
          return (
            <span
              key={`chip-${p.name}`}
              className="absolute whitespace-nowrap rounded-md px-1.5 py-0.5 text-[11px]"
              style={{
                left: x + 9,
                top: y - 9,
                background: p.star ? 'linear-gradient(90deg,#285ee6,#7e2be0)' : 'rgba(20,22,30,0.9)',
                boxShadow: '0 0 0 1px rgba(157,176,255,0.3)',
                opacity: on && !fly ? 1 : 0,
                transform: on ? 'none' : 'translateX(-6px) scale(0.9)',
                transition: `opacity 260ms, transform 320ms ${SPRING}`,
              }}
            >
              {p.name}{p.star ? ' · Nueva' : ''}
            </span>
          )
        })}
        <Radar x={rx} y={ry} k={idx} spin={!still && !fly} />
        <span className="absolute left-[470px] top-[70px] rounded-full bg-white/[0.06] px-2 py-0.5 text-[11px] text-white/50 ring-1 ring-white/10">+ España</span>
      </div>

      {/* Columna derecha: países, fuentes y contadores */}
      <div className="absolute right-6 top-[78px] w-[300px]">
        <div className="flex gap-1.5">
          {STOPS.map((s, i) => (
            <span key={s.country} className="flex-1 rounded-lg px-2 py-1.5 text-center text-[11.5px] ring-1" style={{ background: i === idx && !fly ? 'linear-gradient(135deg,rgba(40,94,230,0.35),rgba(126,43,224,0.25))' : i < idx ? 'rgba(255,255,255,0.05)' : 'transparent', color: i <= idx ? '#fff' : 'rgba(255,255,255,0.35)', borderColor: 'transparent', boxShadow: i === idx && !fly ? '0 0 0 1px rgba(157,176,255,0.55)' : '0 0 0 1px rgba(255,255,255,0.08)', transition: `all 300ms ${EXPO}` }}>
              {s.flag} {s.country}
            </span>
          ))}
        </div>
        <p className="mt-4 text-[11px] uppercase tracking-[0.16em] text-white/40">Fuentes · primero lo gratis</p>
        <ul className="mt-2 space-y-1">
          {SOURCES.map((s) => {
            const on = still || t >= s.t
            const skip = 'skip' in s && s.skip
            return (
              <li key={s.name} className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[12.5px]" style={{ background: on && !skip ? 'rgba(107,140,255,0.14)' : 'rgba(255,255,255,0.03)', color: on ? (skip ? 'rgba(255,255,255,0.45)' : '#fff') : 'rgba(255,255,255,0.35)', transform: on ? 'none' : 'translateX(-6px)', transition: `all 300ms ${EXPO}` }}>
                {on ? (skip ? <Minus className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5 text-emerald-300" />) : <span className="h-3.5 w-3.5 rounded-full border border-white/20" />}
                {s.name}
                <span className="ml-auto text-[11px] text-white/50">{on ? s.note : ''}</span>
              </li>
            )
          })}
        </ul>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-white/[0.04] px-3 py-2 ring-1 ring-white/10"><p key={total} className="text-[24px] font-semibold tabular-nums" style={{ animation: still ? undefined : 'a1-bump 260ms ease-out' }}>{still ? 27 : total}</p><p className="text-[11px] text-white/50">candidatas</p></div>
          <div className="rounded-xl bg-white/[0.04] px-3 py-2 ring-1 ring-white/10"><p className="text-[24px] font-semibold tabular-nums text-emerald-300">0</p><p className="text-[11px] text-white/50">créditos usados</p></div>
        </div>
        <ul className="mt-4 space-y-1">
          {chile.pins.map((p, k) => {
            const on = still || (idx === STOPS.length - 1 && pinOn(chile, k))
            return (
              <li
                key={p.name}
                className="flex items-center gap-2 rounded-md px-2 py-1 text-[12px]"
                style={{
                  opacity: on ? (fly ? 0 : 1) : 0,
                  transform: fly ? `translate(90px,${40 - k * 6}px) scale(0.9)` : on ? 'none' : 'translateX(-14px)',
                  transition: `transform ${fly ? 420 : 360}ms ${fly ? EXPO : SPRING} ${fly ? k * 50 : k * 40}ms, opacity 280ms ${fly ? k * 50 : 0}ms`,
                  background: p.star ? 'linear-gradient(90deg,rgba(107,140,255,0.22),rgba(126,43,224,0.1))' : 'transparent',
                  boxShadow: p.star && on ? '0 0 0 1px rgba(107,140,255,0.6)' : 'none',
                }}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${p.star ? 'bg-white' : 'bg-[#9db0ff]'}`} />
                <span className="truncate">{p.name}</span>
                <span className="ml-auto text-[11px] text-white/45">{p.star ? 'Nueva · libre' : 'Chile'}</span>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

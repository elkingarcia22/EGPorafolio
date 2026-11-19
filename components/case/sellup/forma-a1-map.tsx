'use client'

import { Check, Minus } from 'lucide-react'

/**
 * Agente 1 · el mapa de búsqueda: los 20 países de UBITS en un mapa de puntos.
 * Rumbo hace foco en el país pedido (Chile · Agroindustria), un barrido lo
 * recorre, saltan las empresas candidatas y las fuentes se encienden en cascada
 * (lo gratis primero; Apollo solo si falta). Medidas: 960 × 560 (se escala con `Scaled`).
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
const CHILE: readonly LonLat[] = [[-70.3, -17.5], [-68.4, -21], [-67.8, -26], [-69.8, -32], [-70.8, -39], [-71.6, -46], [-67.5, -55], [-75, -52], [-74.6, -44], [-73.6, -37], [-72, -30], [-70.9, -23]]

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
const DOTS: readonly { x: number; y: number; cl: boolean }[] = (() => {
  const out: { x: number; y: number; cl: boolean }[] = []
  for (let lat = 49; lat >= -56; lat -= 1.6) {
    for (let lon = -125; lon <= -34; lon += 1.25) {
      const p: LonLat = [lon, lat]
      const cl = inside(p, CHILE)
      if (cl || LAND.some((poly) => inside(p, poly))) {
        const [x, y] = px(p)
        out.push({ x, y, cl })
      }
    }
  }
  return out
})()

const CAPITALS: readonly LonLat[] = [
  [-77, 39], [-99, 19.4], [-90.5, 14.6], [-89.2, 13.7], [-87.2, 14.1], [-86.3, 12.1], [-84, 9.9], [-79.5, 9], [-69.9, 18.5],
  [-74, 4.7], [-66.9, 10.5], [-78.5, -0.2], [-77, -12], [-68.1, -16.5], [-70.6, -33.4], [-58.4, -34.6], [-56.2, -34.9], [-57.6, -25.3], [-47.9, -15.8],
]

/** Empresas candidatas (de ejemplo) y su ciudad. */
const PINS: readonly { name: string; city: string; at: LonLat; t: number; star?: boolean }[] = [
  { name: 'Frutícola Los Andes', city: 'Los Andes', at: [-70.6, -32.8], t: 2 },
  { name: 'Agrícola Río Claro', city: 'Rancagua', at: [-70.7, -34.2], t: 2, star: true },
  { name: 'Viñedos Cordillera', city: 'Curicó', at: [-71.2, -35], t: 3 },
  { name: 'Lácteos del Maule', city: 'Talca', at: [-71.7, -35.6], t: 3 },
  { name: 'Berries del Pacífico', city: 'Chillán', at: [-72.1, -36.6], t: 4 },
  { name: 'AgroValle Sur', city: 'Temuco', at: [-72.6, -38.7], t: 4 },
  { name: 'Salmones Patagonia', city: 'Puerto Montt', at: [-72.9, -41.5], t: 5 },
]

const SOURCES = [
  { name: 'HubSpot · libres', t: 1, note: '3 empresas' },
  { name: 'Registros oficiales · SII', t: 2, note: '4 empresas' },
  { name: 'Banco de empresas', t: 3, note: '1 empresa' },
  { name: 'Web · sitio y dominio', t: 4, note: 'verifica' },
  { name: 'Apollo', t: 5, note: 'No hizo falta', skip: true },
] as const

const SPRING = 'cubic-bezier(0.34,1.56,0.64,1)'
const EXPO = 'cubic-bezier(0.16,1,0.3,1)'
/** Foco en Chile: el centro del país va al centro del mapa, más grande. */
const [CHX, CHY] = px([-71, -36])
const ZOOM = `translate(300px,330px) scale(1.45) translate(${-CHX}px,${-CHY}px)`

/** `t`: ticks desde que empieza la escena (0–8). */
export function SearchMap({ t, still = false }: { t: number; still?: boolean }) {
  const focus = still || t >= 1
  const fly = !still && t >= 7
  const found = still ? PINS.length : PINS.filter((p) => t >= p.t).length
  const lit = (at: number) => still || t >= at
  return (
    <div className="relative overflow-hidden rounded-[22px] text-white" style={{ width: MAP_W, height: MAP_H, background: 'radial-gradient(ellipse at 35% 55%,#151a2e 0%,#0b0c10 70%)', fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' }}>
      <style>{'@keyframes a1-scan{0%{transform:translateY(-40px)}100%{transform:translateY(240px)}}@keyframes a1-ping{0%{transform:scale(.6);opacity:.9}100%{transform:scale(2.6);opacity:0}}'}</style>
      <p className="absolute left-6 top-5 text-[12px] uppercase tracking-[0.18em] text-white/45">Agente 1 · mapa de búsqueda</p>
      <p className="absolute left-6 top-10 text-[15px] font-medium">{fly ? 'Candidatas listas para revisar →' : focus ? 'Chile · Agroindustria · más de 200 empleados' : 'Buscando en 20 países…'}</p>

      {/* Mapa */}
      <div className="absolute left-0 top-0 h-full w-[620px] overflow-hidden" style={{ maskImage: 'linear-gradient(to bottom,transparent 0,#000 96px)', WebkitMaskImage: 'linear-gradient(to bottom,transparent 0,#000 96px)' }}>
        <svg viewBox={`0 0 620 ${MAP_H}`} className="h-full w-full" aria-hidden="true">
          <defs>
            <clipPath id="a1-chile"><polygon points={CHILE.map((p) => px(p).join(',')).join(' ')} /></clipPath>
            <linearGradient id="a1-beam" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#285ee6" stopOpacity="0" />
              <stop offset="0.7" stopColor="#7e2be0" stopOpacity="0.55" />
              <stop offset="1" stopColor="#d22d6a" stopOpacity="0.9" />
            </linearGradient>
          </defs>
          <g style={{ transform: focus ? ZOOM : 'none', transformOrigin: '0 0', transition: `transform 700ms ${EXPO}` }}>
            {DOTS.map((d) => (
              <circle key={`${d.x}-${d.y}`} cx={d.x} cy={d.y} r={d.cl ? 2.4 : 2} fill={d.cl && focus ? '#6b8cff' : 'rgba(255,255,255,0.16)'} style={{ transition: 'fill 400ms', opacity: fly && !d.cl ? 0.5 : 1 }} />
            ))}
            {CAPITALS.map((c) => {
              const [x, y] = px(c)
              return (
                <g key={`${x}-${y}`} style={{ opacity: focus ? 0 : 1, transition: 'opacity 300ms' }}>
                  <circle cx={x} cy={y} r={3} fill="#9db0ff" />
                  {!still && <circle cx={x} cy={y} r={3} fill="none" stroke="#9db0ff" style={{ transformBox: 'fill-box', transformOrigin: 'center', animation: 'a1-ping 1.2s ease-out infinite' }} />}
                </g>
              )
            })}
            {/* Barrido sobre Chile */}
            {!still && (
              <g clipPath="url(#a1-chile)" style={{ opacity: focus && t < 6 ? 1 : 0, transition: 'opacity 300ms' }}>
                <rect x={CHX - 40} y={px([-71, -17])[1]} width={80} height={36} fill="url(#a1-beam)" style={{ animation: 'a1-scan 1.1s linear infinite' }} />
              </g>
            )}
            {PINS.map((p) => {
              const [x, y] = px(p.at)
              const on = still || t >= p.t
              return (
                <g key={p.name} style={{ transform: on ? 'scale(1)' : 'scale(0)', transformBox: 'fill-box', transformOrigin: 'center', transition: `transform 420ms ${SPRING}` }}>
                  <circle cx={x} cy={y} r={p.star ? 4.5 : 3.4} fill={p.star ? '#fff' : '#b7c6ff'} stroke={p.star ? '#7e2be0' : 'none'} strokeWidth={2} />
                  {on && !still && <circle cx={x} cy={y} r={4} fill="none" stroke={p.star ? '#d22d6a' : '#9db0ff'} style={{ transformBox: 'fill-box', transformOrigin: 'center', animation: 'a1-ping 1s ease-out 2' }} />}
                </g>
              )
            })}
          </g>
        </svg>
        <span className="absolute left-[470px] top-[70px] rounded-full bg-white/[0.06] px-2 py-0.5 text-[11px] text-white/50 ring-1 ring-white/10 transition-opacity duration-300" style={{ opacity: focus ? 0 : 1 }}>+ España</span>
      </div>

      {/* Panel derecho: fuentes en cascada y candidatas */}
      <div className="absolute right-6 top-[78px] w-[300px]">
        <p className="text-[11px] uppercase tracking-[0.16em] text-white/40">Fuentes · primero lo gratis</p>
        <ul className="mt-2 space-y-1.5">
          {SOURCES.map((s) => {
            const on = lit(s.t)
            const skip = 'skip' in s && s.skip
            return (
              <li key={s.name} className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[12.5px] ring-1" style={{ background: on && !skip ? 'rgba(107,140,255,0.16)' : 'rgba(255,255,255,0.03)', boxShadow: on && !skip ? '0 0 18px rgba(107,140,255,0.3)' : 'none', color: on ? (skip ? 'rgba(255,255,255,0.45)' : '#fff') : 'rgba(255,255,255,0.35)', transition: `all 300ms ${EXPO}`, borderColor: 'transparent' }}>
                {on ? (skip ? <Minus className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5 text-emerald-300" />) : <span className="h-3.5 w-3.5 rounded-full border border-white/20" />}
                {s.name}
                <span className="ml-auto text-[11px] text-white/50">{on ? s.note : ''}</span>
              </li>
            )
          })}
        </ul>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-white/[0.04] px-3 py-2 ring-1 ring-white/10"><p className="text-[22px] font-semibold tabular-nums">{found}</p><p className="text-[11px] text-white/50">candidatas</p></div>
          <div className="rounded-xl bg-white/[0.04] px-3 py-2 ring-1 ring-white/10"><p className="text-[22px] font-semibold tabular-nums text-emerald-300">0</p><p className="text-[11px] text-white/50">créditos usados</p></div>
        </div>
        <ul className="mt-4 space-y-1">
          {PINS.map((p, k) => {
            const on = still || t >= p.t
            return (
              <li
                key={p.name}
                className="flex items-center gap-2 rounded-md px-2 py-1 text-[12px]"
                style={{
                  opacity: on ? (fly ? 0 : 1) : 0,
                  transform: fly ? `translate(80px,${40 - k * 6}px) scale(0.9)` : on ? 'none' : 'translateX(-14px)',
                  transition: `transform ${fly ? 420 : 380}ms ${fly ? EXPO : SPRING} ${fly ? k * 40 : 0}ms, opacity 300ms ${fly ? k * 40 : 0}ms`,
                  background: p.star ? 'linear-gradient(90deg,rgba(107,140,255,0.22),rgba(126,43,224,0.1))' : 'transparent',
                  boxShadow: p.star && on ? '0 0 0 1px rgba(107,140,255,0.6)' : 'none',
                }}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${p.star ? 'bg-white' : 'bg-[#9db0ff]'}`} />
                <span className="truncate">{p.name}</span>
                <span className="ml-auto text-[11px] text-white/45">{p.star && (still || t >= 6) ? 'Nueva · libre' : p.city}</span>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useNarrow } from './camera'
import { useLocale, type L } from '@/lib/i18n'

/** Cada cuánto se enciende el país siguiente (ms) */
const COUNTRY_MS = 520
/** Ya todos encendidos, cuánto se queda antes de volver a empezar (ms) */
const HOLD_MS = 4200
/** Empresas que el agente 1 encontró en Producción (tableros de SellUp, 11 al 25 de nov. de 2026) */
const FOUND = 1589

type LonLat = readonly [number, number]
/** Proyección simple del mapa (unidades del SVG) */
const px = ([lon, lat]: LonLat): [number, number] => [60 + (lon + 120) * 6, 20 + (50 - lat) * 5]

/** Contorno de América (simplificado): Norteamérica, México, Centroamérica, Caribe y Suramérica */
const LAND: readonly (readonly LonLat[])[] = [
  [[-124, 48], [-95, 49], [-83, 46], [-67, 45], [-70, 41], [-76, 35], [-81, 31], [-80, 25], [-82, 28], [-90, 30], [-97, 26], [-106, 31], [-117, 32], [-124, 40]],
  [[-117, 32], [-106, 31], [-97, 26], [-97, 22], [-94, 18], [-87, 21], [-88, 18], [-92, 15], [-97, 16], [-105, 20], [-110, 23], [-114, 30]],
  [[-92, 15], [-88, 16], [-83, 15], [-83, 11], [-77, 8], [-79, 9.5], [-83, 8], [-86, 11], [-88, 13]],
  [[-85, 22.5], [-74, 20.5], [-77, 19.5], [-84, 21.5]],
  [[-74.5, 20], [-68, 19], [-69, 17.8], [-74.5, 18]],
  [[-80, 1], [-77, 7.5], [-72, 12], [-62, 11], [-52, 5], [-50, 0], [-35, -6], [-39, -15], [-48, -26], [-58, -34], [-62, -40], [-65, -47], [-68, -55], [-74, -50], [-73, -40], [-71, -30], [-70, -18], [-76, -14], [-81, -6]],
]

interface Country {
  code: string
  name: L
  /** Puntos de referencia (lon, lat): cada punto del mapa pertenece al país con el más cercano */
  seeds: readonly LonLat[]
}

/** Los 20 países donde vende UBITS, en el orden en que se encienden (España va aparte, fuera del mapa) */
const COUNTRIES: readonly Country[] = [
  { code: 'MX', name: { es: 'México', en: 'Mexico' }, seeds: [[-102, 23.5], [-110, 28], [-92, 18]] },
  { code: 'GT', name: { es: 'Guatemala', en: 'Guatemala' }, seeds: [[-90.3, 15.5]] },
  { code: 'SV', name: { es: 'El Salvador', en: 'El Salvador' }, seeds: [[-88.9, 13.7]] },
  { code: 'HN', name: { es: 'Honduras', en: 'Honduras' }, seeds: [[-86.6, 14.8]] },
  { code: 'NI', name: { es: 'Nicaragua', en: 'Nicaragua' }, seeds: [[-85, 12.6]] },
  { code: 'CR', name: { es: 'Costa Rica', en: 'Costa Rica' }, seeds: [[-84, 9.9]] },
  { code: 'PA', name: { es: 'Panamá', en: 'Panama' }, seeds: [[-80, 8.5]] },
  { code: 'DO', name: { es: 'Rep. Dominicana', en: 'Dominican Rep.' }, seeds: [[-70.5, 18.8]] },
  { code: 'CO', name: { es: 'Colombia', en: 'Colombia' }, seeds: [[-73.5, 4], [-75, 8]] },
  { code: 'VE', name: { es: 'Venezuela', en: 'Venezuela' }, seeds: [[-66, 7]] },
  { code: 'EC', name: { es: 'Ecuador', en: 'Ecuador' }, seeds: [[-78.4, -1.5]] },
  { code: 'PE', name: { es: 'Perú', en: 'Peru' }, seeds: [[-76, -7], [-73, -13]] },
  { code: 'BO', name: { es: 'Bolivia', en: 'Bolivia' }, seeds: [[-64.5, -17]] },
  { code: 'BR', name: { es: 'Brasil', en: 'Brazil' }, seeds: [[-55, -5], [-45, -9], [-52, -15], [-50, -24], [-62, -8]] },
  { code: 'PY', name: { es: 'Paraguay', en: 'Paraguay' }, seeds: [[-58, -23.5]] },
  { code: 'UY', name: { es: 'Uruguay', en: 'Uruguay' }, seeds: [[-56, -32.8]] },
  { code: 'AR', name: { es: 'Argentina', en: 'Argentina' }, seeds: [[-63, -28], [-63, -36], [-67, -45], [-69, -51]] },
  { code: 'CL', name: { es: 'Chile', en: 'Chile' }, seeds: [[-70, -22], [-71, -30], [-72.5, -38], [-73, -46], [-72, -53]] },
  { code: 'US', name: { es: 'Estados Unidos', en: 'United States' }, seeds: [[-98, 39], [-112, 40], [-85, 38], [-118, 45]] },
  { code: 'ES', name: { es: 'España', en: 'Spain' }, seeds: [] },
]
/** Más lejos que esto (grados) de cualquier país, el punto queda gris: no es un país donde vende UBITS */
const MAX_DIST = 6.5

function inside(p: LonLat, poly: readonly LonLat[]): boolean {
  let on = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i]
    const [xj, yj] = poly[j]
    if (yi > p[1] !== yj > p[1] && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) on = !on
  }
  return on
}

/** Los puntos del mapa, cada uno con su país (−1 si no es de los 20). Rejilla fija: igual en servidor y cliente. */
function buildDots(): readonly { x: number; y: number; c: number }[] {
  const out: { x: number; y: number; c: number }[] = []
  for (let lat = 49; lat >= -56; lat -= 1.6) {
    for (let lon = -125; lon <= -34; lon += 1.3) {
      const p: LonLat = [lon, lat]
      if (!LAND.some((poly) => inside(p, poly))) continue
      let best = -1
      let bestD = MAX_DIST
      COUNTRIES.forEach((country, ci) => {
        country.seeds.forEach(([sx, sy]) => {
          const d = Math.hypot(sx - lon, sy - lat)
          if (d < bestD) {
            bestD = d
            best = ci
          }
        })
      })
      const [x, y] = px(p)
      out.push({ x: Math.round(x), y: Math.round(y), c: best })
    }
  }
  return out
}

/**
 * Agente 1 · Empresas: el mapa de los 20 países donde vende UBITS se va
 * llenando, país por país, mientras el contador suma las empresas que el
 * agente encontró en Producción. Al completarse, se queda un momento y vuelve
 * a empezar.
 */
export function Agent1Map() {
  const { t, locale } = useLocale()
  const { reducedMotion } = useA11y()
  const rootRef = useRef<HTMLDivElement>(null)
  const dots = useMemo(buildDots, [])
  /** En teléfono el mapa se dibuja a ~0,6×: la etiqueta de España se dobla para seguir leyéndose */
  const narrow = useNarrow()
  const [inView, setInView] = useState(false)
  /** Cuántos países van encendidos */
  const [lit, setLit] = useState(reducedMotion ? COUNTRIES.length : 0)
  const [shown, setShown] = useState(reducedMotion ? FOUND : 0)
  const shownRef = useRef(shown)
  shownRef.current = shown

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: '0px 0px -20% 0px' })
    io.observe(root)
    return () => io.disconnect()
  }, [])

  // País por país; al final se queda un rato y vuelve a empezar.
  useEffect(() => {
    if (!inView || reducedMotion) return
    const done = lit >= COUNTRIES.length
    const id = window.setTimeout(() => setLit((n) => (done ? 0 : n + 1)), done ? HOLD_MS : lit === 0 ? 500 : COUNTRY_MS)
    return () => window.clearTimeout(id)
  }, [inView, reducedMotion, lit])

  // El contador corre hacia la suma de los países encendidos.
  const target = Math.round((FOUND * lit) / COUNTRIES.length)
  useEffect(() => {
    if (reducedMotion) return
    if (target === 0) {
      setShown(0)
      return
    }
    let raf = 0
    const from = shownRef.current
    const start = performance.now()
    const tick = (now: number) => {
      const k = Math.min(1, (now - start) / COUNTRY_MS)
      setShown(Math.round(from + (target - from) * k))
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, reducedMotion])

  const current = lit > 0 ? COUNTRIES[Math.min(lit, COUNTRIES.length) - 1] : null
  const fmt = (n: number) => n.toLocaleString(locale === 'en' ? 'en-US' : 'es-CO')

  return (
    <div ref={rootRef} className="mx-auto grid max-w-[940px] items-center gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
      <svg viewBox="20 10 580 550" className="mx-auto w-full max-w-[460px] overflow-visible" role="img" aria-label={t({ es: 'Mapa de los 20 países donde vende UBITS, que se llena a medida que el agente encuentra empresas', en: 'Map of the 20 countries where UBITS sells, filling up as the agent finds companies' })}>
        {dots.map((d, i) => {
          const on = d.c >= 0 && d.c < lit
          const fresh = on && d.c === lit - 1
          return (
            <circle
              key={i}
              cx={d.x}
              cy={d.y}
              r={on ? 3.3 : 2.4}
              fill={on ? (fresh ? '#ffffff' : 'rgb(var(--signal))') : 'white'}
              style={{
                opacity: on ? (fresh ? 1 : 0.85) : d.c >= 0 ? 0.2 : 0.08,
                transition: 'opacity .5s, fill .8s',
                filter: fresh ? 'drop-shadow(0 0 4px rgb(var(--signal)))' : undefined,
              }}
            />
          )
        })}
        {/* España, fuera del mapa: un nodo aparte que se enciende de último */}
        <g transform="translate(560 120)">
          <circle r={7} fill={lit >= COUNTRIES.length ? 'rgb(var(--signal))' : 'rgb(var(--void))'} stroke="white" strokeOpacity={lit >= COUNTRIES.length ? 1 : 0.4} style={{ transition: 'fill .5s' }} />
          <text y={narrow ? -18 : -14} textAnchor="middle" className="fill-paper font-mono uppercase" fontSize={narrow ? 20 : 10} letterSpacing="0.12em" opacity={narrow ? 0.75 : 0.55}>{t({ es: 'España', en: 'Spain' })}</text>
        </g>
      </svg>

      <div className="text-center md:text-left">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-paper/55 md:text-[10px] md:text-paper/45">{t({ es: 'Empresas encontradas', en: 'Companies found' })}</p>
        <p className="mt-3 text-[clamp(3rem,2rem+4vw,5.5rem)] font-light leading-none tabular-nums" style={{ filter: 'drop-shadow(0 0 24px rgb(var(--signal) / 0.45))' }}>{fmt(shown)}</p>
        <div className="mt-5 flex items-center justify-center gap-3 md:justify-start">
          <span className="font-mono text-[12px] tabular-nums text-signal">{String(Math.min(lit, COUNTRIES.length)).padStart(2, '0')} / {COUNTRIES.length}</span>
          <span className="text-[12px] text-paper/50">{t({ es: 'países', en: 'countries' })}</span>
          {current && <span key={current.code} className="su-fade rounded-full border border-white/15 px-2.5 py-0.5 text-[12px] text-paper/80">{t(current.name)}</span>}
        </div>
        <span aria-hidden="true" className="mt-5 block h-1 w-full max-w-[320px] overflow-hidden rounded-full bg-white/10 max-md:mx-auto">
          <span className="block h-full origin-left rounded-full bg-gradient-to-r from-[#285ee6] via-[#7e2be0] to-[#d22d6a] transition-transform duration-500 ease-out" style={{ transform: `scaleX(${Math.min(lit, COUNTRIES.length) / COUNTRIES.length})` }} />
        </span>
        <p className="mt-5 text-[12px] leading-relaxed text-paper/45">{t({ es: 'Total real en Producción, del 11 al 25 de nov. de 2026.', en: 'Real total in Production, Nov 11–25, 2026.' })}</p>
      </div>
    </div>
  )
}

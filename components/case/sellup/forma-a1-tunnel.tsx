'use client'

import { useEffect, useRef } from 'react'
import { useLocale } from '@/lib/i18n'

/**
 * Túnel de velocidad del Agente 1: mientras Rumbo busca, la búsqueda viaja por
 * un túnel de estelas y anillos (canvas, requestAnimationFrame) y por los lados
 * pasan volando las fuentes y las empresas que va revisando. Acelera, sostiene
 * y desacelera para «aterrizar» en los resultados. Datos de ejemplo.
 */

const DURATION = 3400
const STOPS = ['#285ee6', '#7e2be0', '#d22d6a', '#eb6233'] as const

const FLYERS: readonly { text: string; kind: 'source' | 'company' }[] = [
  { text: 'HubSpot', kind: 'source' },
  { text: 'Agrícola Río Claro', kind: 'company' },
  { text: 'SII · Chile', kind: 'source' },
  { text: 'Frutícola Los Andes', kind: 'company' },
  { text: 'Banco de empresas', kind: 'source' },
  { text: 'Viñedos Cordillera', kind: 'company' },
  { text: 'Registros oficiales', kind: 'source' },
  { text: 'Lácteos del Maule', kind: 'company' },
  { text: 'Búsqueda web', kind: 'source' },
  { text: 'Berries del Pacífico', kind: 'company' },
  { text: 'Apollo · solo si falta', kind: 'source' },
  { text: 'Salmones Patagonia', kind: 'company' },
]

interface Star { x: number; y: number; z: number; pz: number; c: string }

/** Velocidad de 0 a 1 según el tiempo: arranca rápido, sostiene y frena al final. */
function speedAt(ms: number): number {
  if (ms < 500) return 1 - Math.pow(1 - ms / 500, 3)
  if (ms > DURATION - 800) return Math.max(0.04, Math.pow(Math.max(0, DURATION - ms) / 800, 2))
  return 1
}

function useTunnel(canvas: React.RefObject<HTMLCanvasElement>, counter: React.RefObject<HTMLSpanElement>, active: boolean, still: boolean) {
  useEffect(() => {
    const el = canvas.current
    const ctx = el?.getContext('2d')
    if (!el || !ctx) return
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    const fit = () => {
      el.width = el.clientWidth * dpr
      el.height = el.clientHeight * dpr
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    const stars: Star[] = Array.from({ length: 520 }, (_, i) => {
      const z = Math.random()
      return { x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2, z, pz: z, c: STOPS[i % STOPS.length] }
    })
    let raf = 0
    let t0 = performance.now()
    let ring = 0
    const draw = (now: number) => {
      const ms = still ? DURATION / 2 : now - t0
      const v = still ? 0.5 : speedAt(ms)
      const w = el.width
      const h = el.height
      const cx = w / 2
      const cy = h / 2
      const f = Math.min(w, h) * 0.55
      ctx.fillStyle = `rgba(6,6,10,${0.32 + (1 - v) * 0.5})`
      ctx.fillRect(0, 0, w, h)
      // Anillos que pasan hacia la cámara
      ring = (ring + 0.012 + v * 0.05) % 1
      for (let k = 0; k < 6; k += 1) {
        const z = 1 - ((ring + k / 6) % 1)
        const r = f * 0.12 / Math.max(0.04, z)
        if (r > Math.hypot(w, h)) continue
        ctx.strokeStyle = STOPS[k % STOPS.length]
        ctx.globalAlpha = Math.min(0.55, (1 - z) * 0.7) * (0.4 + v * 0.6)
        ctx.lineWidth = (1 + (1 - z) * 4) * dpr
        ctx.beginPath()
        ctx.ellipse(cx, cy, r, r * 0.86, 0, 0, Math.PI * 2)
        ctx.stroke()
      }
      // Estelas
      for (const s of stars) {
        s.pz = s.z
        s.z -= 0.003 + v * 0.03
        if (s.z <= 0.02) {
          s.x = (Math.random() - 0.5) * 2
          s.y = (Math.random() - 0.5) * 2
          s.z = 1
          s.pz = 1
        }
        const x = cx + (s.x / s.z) * f
        const y = cy + (s.y / s.z) * f
        const px = cx + (s.x / s.pz) * f
        const py = cy + (s.y / s.pz) * f
        ctx.globalAlpha = Math.min(1, (1 - s.z) * 1.4)
        ctx.strokeStyle = s.c
        ctx.lineWidth = (1 - s.z) * 2.6 * dpr
        ctx.beginPath()
        ctx.moveTo(px, py)
        ctx.lineTo(x + (x - px) * v * 2.5, y + (y - py) * v * 2.5)
        ctx.stroke()
      }
      ctx.globalAlpha = 1
      // Núcleo brillante
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, f * 0.45)
      g.addColorStop(0, `rgba(255,255,255,${0.35 * v + 0.1})`)
      g.addColorStop(0.25, 'rgba(126,43,224,0.25)')
      g.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)
      if (counter.current) {
        const p = Math.min(1, ms / (DURATION - 500))
        counter.current.textContent = Math.round(1246 * (1 - Math.pow(1 - p, 2))).toLocaleString('es-CO')
      }
      if (!still && ms < DURATION + 400) raf = requestAnimationFrame(draw)
    }
    if (active || still) {
      t0 = performance.now()
      raf = requestAnimationFrame(draw)
    }
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [canvas, counter, active, still])
}

/** El túnel completo: canvas, nombres que pasan volando y el contador. */
export function SpeedTunnel({ active, still }: { active: boolean; still: boolean }) {
  const { t } = useLocale()
  const canvas = useRef<HTMLCanvasElement>(null)
  const counter = useRef<HTMLSpanElement>(null)
  useTunnel(canvas, counter, active, still)
  return (
    <div className="relative h-[clamp(320px,52vw,560px)] overflow-hidden rounded-[18px] bg-[#06060a] ring-1 ring-white/10">
      <style>{`@keyframes a1-fly{0%{transform:translate(-50%,-50%) translate(0,0) scale(.15);opacity:0;filter:blur(2px)}15%{opacity:1;filter:blur(0)}80%{opacity:1;filter:blur(0)}100%{transform:translate(-50%,-50%) translate(var(--dx),var(--dy)) scale(2.2);opacity:0;filter:blur(6px)}}`}</style>
      <canvas ref={canvas} className="absolute inset-0 h-full w-full" aria-hidden="true" />
      {active && !still && (
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          {FLYERS.map((f, i) => {
            const a = (i / FLYERS.length) * Math.PI * 2 + 0.4
            return (
              <span
                key={f.text}
                className={`absolute left-1/2 top-1/2 whitespace-nowrap rounded-full px-3 py-1 text-[13px] font-medium ring-1 ${f.kind === 'source' ? 'bg-[#285ee6]/25 text-[#c7d4ff] ring-[#6b8cff]/50' : 'bg-white/10 text-white ring-white/25'}`}
                style={{ ['--dx' as string]: `${Math.cos(a) * 46}vw`, ['--dy' as string]: `${Math.sin(a) * 30}vw`, animation: `a1-fly 1.15s cubic-bezier(.55,0,.9,.4) ${i * 0.22}s 1 both` }}
              >
                {f.text}
              </span>
            )
          })}
        </div>
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-black/70 to-transparent p-5 text-white">
        <p>
          <span ref={counter} className="block font-mono text-[clamp(1.8rem,1rem+2.4vw,3rem)] font-light leading-none tabular-nums">0</span>
          <span className="mt-1 block text-xs text-white/60">{t({ es: 'empresas revisadas en HubSpot, registros y el banco', en: 'companies checked in HubSpot, registries and the bank' })}</span>
        </p>
        <p className="text-right text-xs text-white/60">
          <span className="block text-sm font-medium text-white">Agroindustria · Chile</span>
          {t({ es: '0 créditos de pago hasta ahora', en: '0 paid credits so far' })}
        </p>
      </div>
    </div>
  )
}

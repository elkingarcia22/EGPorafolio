'use client'

import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import { useLocale } from '@/lib/i18n'
import { useA11y } from '@/lib/a11y'
import { useTick } from '../barberlytics/thema/live-pieces'
import { SellUpMark, useInView } from './ui'
import { COUNTRIES, FEATURED } from './forma-catalog-data'
import { CatalogScreen } from './forma-catalogo'
import { Tablet } from './device-frames'

/** 5.5 · El catálogo como red: SellUp conectado a 20 países y sus fuentes oficiales. */

const NODES = COUNTRIES.map((c, i) => {
  const a = ((-90 + (360 / COUNTRIES.length) * i) * Math.PI) / 180
  return { ...c, x: Math.round((50 + 42 * Math.cos(a)) * 100) / 100, y: Math.round((50 + 42 * Math.sin(a)) * 100) / 100 }
})

/** Cuenta de 0 al valor cuando `on` se vuelve verdadero. */
export function useCount(target: number, on: boolean, ms = 1400): number {
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!on) return
    const t0 = performance.now()
    let raf = 0
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / ms)
      setV(Math.round(target * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, on, ms])
  return v
}

function Big({ value, label, on }: { value: number; label: string; on: boolean }) {
  const n = useCount(value, on)
  return (
    <div className="rounded-[18px] border border-white/10 bg-white/[0.03] p-5">
      <p className="text-[clamp(2.4rem,1.6rem+2.4vw,3.8rem)] font-light leading-none tabular-nums text-signal">{n.toLocaleString('es-CO')}</p>
      <p className="mt-2 text-sm leading-snug text-white/65">{label}</p>
    </div>
  )
}

export function SourceCatalog() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const [ref, seen] = useInView<HTMLDivElement>(0.2)
  const tick = useTick(2200)
  const [picked, setPicked] = useState<number | null>(null)
  const active = picked ?? (reducedMotion ? 0 : tick % NODES.length)
  const c = NODES[active]

  return (
    <div ref={ref}>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Big value={132} on={seen} label={t({ es: 'fuentes en el catálogo', en: 'sources in the catalog' })} />
        <Big value={101} on={seen} label={t({ es: 'las consulta la IA sola', en: 'queried by the AI on its own' })} />
        <Big value={81} on={seen} label={t({ es: 'verificadas con datos reales', en: 'verified with real data' })} />
        <Big value={20} on={seen} label={t({ es: 'países conectados', en: 'countries connected' })} />
      </div>

      <div className="mt-10 grid items-center gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <div className="relative mx-auto aspect-square w-full max-w-[560px]">
          <div className="absolute inset-[8%] rounded-full border border-white/10" aria-hidden="true" />
          <div className="absolute inset-[30%] rounded-full border border-dashed border-white/10" aria-hidden="true" />
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <defs>
              <linearGradient id="cat-beam" x1="0" x2="1">
                <stop offset="0" stopColor="#285ee6" />
                <stop offset="1" stopColor="#6b8cff" />
              </linearGradient>
            </defs>
            {NODES.map((n, i) => {
              const on = i === active
              const lit = seen && (on || reducedMotion)
              return (
                <g key={n.code}>
                  <line x1="50" y1="50" x2={n.x} y2={n.y} stroke={on ? 'url(#cat-beam)' : 'rgba(255,255,255,0.12)'} strokeWidth={on ? 0.6 : 0.25} strokeDasharray={on ? '1.4 1' : undefined} style={{ transition: 'stroke 500ms' }}>
                    {lit && !reducedMotion && <animate attributeName="stroke-dashoffset" from="5" to="0" dur="0.7s" repeatCount="indefinite" />}
                  </line>
                  {lit && !reducedMotion && (
                    <circle r="0.9" fill="#b7c6ff">
                      <animateMotion dur="1.2s" repeatCount="indefinite" path={`M${n.x},${n.y} L50,50`} />
                    </circle>
                  )}
                </g>
              )
            })}
          </svg>
          {NODES.map((n, i) => {
            const on = i === active
            return (
              <button
                key={n.code}
                type="button"
                onClick={() => setPicked(i)}
                onMouseEnter={() => setPicked(i)}
                aria-pressed={on}
                aria-label={n.name}
                className={`absolute grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-[clamp(0.9rem,0.6rem+1vw,1.35rem)] ring-1 transition-all duration-500 ${on ? 'h-[11%] w-[11%] bg-[#6b8cff]/25 ring-[#6b8cff] shadow-[0_0_30px_rgba(107,140,255,0.6)]' : 'h-[8.5%] w-[8.5%] bg-[#141517] ring-white/15 hover:ring-white/40'}`}
                style={{ left: `${n.x}%`, top: `${n.y}%`, opacity: seen ? 1 : 0, transitionDelay: seen ? `${i * 30}ms` : '0ms' }}
              >
                <span aria-hidden="true">{n.flag}</span>
              </button>
            )
          })}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <SellUpMark size={72} className="shadow-[0_0_60px_rgba(91,126,255,0.5)]" />
            <p className="mt-2 text-sm font-medium">SellUp</p>
            <p className="font-mono text-[10px] text-white/45">{c.code} · {c.taxId}</p>
          </div>
        </div>

        <div key={c.code} className="rounded-[20px] border border-[#6b8cff]/40 bg-gradient-to-br from-[#161c33] to-[#121318] p-6 shadow-[0_30px_80px_-30px_rgba(40,94,230,0.55)]">
          <p className="flex items-center gap-3">
            <span className="text-4xl" aria-hidden="true">{c.flag}</span>
            <span>
              <span className="block text-2xl font-light">{c.name}</span>
              <span className="mono-label text-white/45">{t({ es: 'Identificador fiscal', en: 'Tax ID' })} · {c.taxId}</span>
            </span>
          </p>
          <p className="mono-label mt-6 text-[#9db0ff]">{t({ es: 'Número fiscal por nombre', en: 'Tax ID by name' })}</p>
          <ul className="mt-2 space-y-1.5">
            {c.identity.map((s) => <li key={s} className="flex items-start gap-2 text-sm"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />{s}</li>)}
          </ul>
          <p className="mono-label mt-5 text-[#9db0ff]">{t({ es: 'Capa gratis por industria', en: 'Free layer by industry' })}</p>
          <ul className="mt-2 space-y-1.5">
            {c.free.map((s) => <li key={s} className="flex items-start gap-2 text-sm"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />{s}</li>)}
          </ul>
          <p className="mt-6 border-t border-white/10 pt-4 text-xs leading-relaxed text-white/50">
            {t({ es: 'Cada corrida pasa por estas dos capas gratis antes de pagarle a Apollo o Lusha. Toca otro país para ver sus fuentes.', en: 'Every run goes through these two free layers before paying Apollo or Lusha. Tap another country to see its sources.' })}
          </p>
        </div>
      </div>

      <p className="mono-label mb-4 mt-14 text-white/50">{t({ es: 'Fuentes destacadas · filas en Producción', en: 'Featured sources · rows in Production' })}</p>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURED.map((f, i) => (
          <li key={f.name} data-reveal className={`rounded-[18px] border p-5 ${i === 4 ? 'border-[#6b8cff]/50 bg-[#6b8cff]/10' : 'border-white/10 bg-white/[0.03]'}`}>
            <p className="flex items-center gap-2 text-sm text-white/70"><span aria-hidden="true">{f.flag}</span>{f.name}</p>
            <p className="mt-3 text-[clamp(1.8rem,1.2rem+1.6vw,2.6rem)] font-light leading-none tabular-nums">{f.value}</p>
            <p className="mt-2 text-xs text-white/55">{f.note}</p>
          </li>
        ))}
      </ul>

      <div className="mt-14 grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
        <p className="max-w-[40ch] leading-relaxed text-white/70">
          {t({ es: 'En la app, cada fuente tiene su estado, su siguiente acción y si la IA puede usarla sola. Una fuente nueva queda «Por validar» hasta probarla con datos reales.', en: 'In the app, every source has its status, next action and whether the AI can use it on its own. A new source stays “To validate” until it’s tested with real data.' })}
        </p>
        <Tablet><CatalogScreen /></Tablet>
      </div>
      <p className="mt-3 font-mono text-[11px] uppercase tracking-wider text-white/40">{t({ es: 'Datos reales del catálogo (14-10-2026) · la pantalla es una réplica', en: 'Real catalog data (14 Oct 2026) · the screen is a replica' })}</p>
    </div>
  )
}

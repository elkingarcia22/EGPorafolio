'use client'

import { useRef } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { MODELS, type ModelId } from './models-data'
import { useAutoplay } from './use-autoplay'

const AUTO_MS = 3400

interface Knob {
  label: L
  options: readonly L[]
  /** Qué opción usa cada modelo (índice en `options`), según models-data.ts. */
  pick: Record<ModelId, number>
}

const OPT: L = { es: 'Opcional', en: 'Optional' }
const REQ: L = { es: 'Obligatorio', en: 'Required' }

/** Las mismas seis perillas para todos los modelos: solo cambia en qué posición está cada una. */
const KNOBS: readonly Knob[] = [
  { label: { es: 'Norte', en: 'North' }, options: [OPT, REQ], pick: { smart: 0, okr: 1, kpi: 0, nct: 1, mbo: 1 } },
  { label: { es: 'Alineación', en: 'Alignment' }, options: [OPT, REQ], pick: { smart: 0, okr: 1, kpi: 0, nct: 0, mbo: 1 } },
  { label: { es: 'Debajo', en: 'Below' }, options: [{ es: 'Nada', en: 'None' }, OPT, REQ], pick: { smart: 1, okr: 2, kpi: 0, nct: 2, mbo: 1 } },
  { label: { es: 'Cierre', en: 'Closing' }, options: [{ es: 'Acumulado', en: 'Cumulative' }, { es: 'Umbral', en: 'Threshold' }, { es: 'Sí / no', en: 'Yes / no' }], pick: { smart: 0, okr: 0, kpi: 1, nct: 0, mbo: 2 } },
  { label: { es: 'Reporte', en: 'Reporting' }, options: [{ es: 'Libre', en: 'Free' }, { es: 'Semanal', en: 'Weekly' }, { es: 'Mensual', en: 'Monthly' }], pick: { smart: 0, okr: 1, kpi: 2, nct: 1, mbo: 0 } },
  { label: { es: 'Duración', en: 'Length' }, options: [{ es: 'Mes', en: 'Month' }, { es: 'Trimestre', en: 'Quarter' }, { es: 'Año', en: 'Year' }], pick: { smart: 1, okr: 1, kpi: 0, nct: 1, mbo: 2 } },
]

/** Lienzo (unidades del SVG) */
const W = 800
const H = 500
const HUB = { x: 400, y: 300 }
/** Los cinco modelos, en un arco arriba */
const MODEL_AT = MODELS.map((_, i) => ({ x: 160 + i * 120, y: 70 + Math.abs(i - 2) * 14 }))
/** Las seis perillas: tres a cada lado del constructor */
const DIAL_AT = [0, 1, 2, 3, 4, 5].map((i) => ({ x: i < 3 ? 150 : 650, y: 230 + (i % 3) * 105 }))
const DIAL_R = 26
/** Arco de cada perilla: de dónde a dónde van sus opciones (grados; 0 = derecha) */
const DIAL_ARC = { from: 215, to: 325 }

const polar = (cx: number, cy: number, r: number, deg: number) => ({ x: cx + r * Math.cos((deg * Math.PI) / 180), y: cy + r * Math.sin((deg * Math.PI) / 180) })
/** Ángulo de la opción `i` de `n` sobre el arco de la perilla */
const optionAngle = (i: number, n: number) => DIAL_ARC.from + ((DIAL_ARC.to - DIAL_ARC.from) * i) / Math.max(1, n - 1)
/** Fibra suave entre dos puntos (sale y llega en vertical u horizontal según la dirección) */
const fiber = (a: { x: number; y: number }, b: { x: number; y: number }, horizontal: boolean) =>
  horizontal
    ? `M${a.x} ${a.y} C${(a.x + b.x) / 2} ${a.y} ${(a.x + b.x) / 2} ${b.y} ${b.x} ${b.y}`
    : `M${a.x} ${a.y} C${a.x} ${(a.y + b.y) / 2} ${b.x} ${(a.y + b.y) / 2} ${b.x} ${b.y}`

/**
 * 02 · Patrones, el estudio de modelos como una red: los cinco modelos arriba;
 * el que está activo manda su señal al constructor del centro, y de ahí a las
 * seis perillas, que giran a la posición de ese modelo. Avanza solo; tocar un
 * modelo lo elige.
 */
export function ModelStudy() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const rootRef = useRef<HTMLDivElement>(null)
  const { index: active, go: choose } = useAutoplay(rootRef, { count: MODELS.length, ms: AUTO_MS, loop: true, disabled: reducedMotion })
  const current = MODELS[active]
  /** La llave cambia con el modelo: las señales vuelven a recorrer las fibras */
  const wave = active

  return (
    <figure ref={rootRef} className="mx-auto flex max-w-[820px] flex-col items-center text-center">
      <figcaption key={current.id} className="obj-fade flex min-h-[6rem] flex-col items-center justify-end">
        <span className="mono-label text-signal">{t({ es: 'Modelo', en: 'Model' })} · {current.label}</span>
        <span className="mt-3 text-[clamp(1.4rem,1rem+1.4vw,2.2rem)] font-light leading-[1.15] tracking-tight">{t(current.tagline)}</span>
        <span className="mt-1 text-sm text-paper/55">{t(current.company)}</span>
      </figcaption>

      <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 block h-auto w-full max-w-[760px]" role="group" aria-label={t({ es: 'Cinco modelos, las mismas seis perillas', en: 'Five models, the same six knobs' })}>
        <defs>
          <linearGradient id="ms-fiber" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="rgb(var(--signal))" />
            <stop offset="1" stopColor="#ff54aa" />
          </linearGradient>
          <radialGradient id="ms-hub">
            <stop offset="0" stopColor="rgb(var(--signal))" stopOpacity="0.45" />
            <stop offset="1" stopColor="rgb(var(--signal))" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* La fibra que une los modelos */}
        <path d={`M${MODEL_AT[0].x} ${MODEL_AT[0].y} ${MODEL_AT.slice(1).map((p) => `L${p.x} ${p.y}`).join(' ')}`} fill="none" stroke="white" strokeOpacity={0.12} />

        {/* Del modelo activo al constructor, y del constructor a cada perilla */}
        {MODEL_AT.map((p, i) => (
          <path key={MODELS[i].id} d={fiber(p, { x: HUB.x, y: HUB.y - 34 }, false)} fill="none" stroke={i === active ? 'url(#ms-fiber)' : 'white'} strokeOpacity={i === active ? 0.9 : 0.06} strokeWidth={i === active ? 1.6 : 1} style={{ transition: 'stroke-opacity .6s' }} />
        ))}
        <path key={`down-${wave}`} d={fiber(MODEL_AT[active], { x: HUB.x, y: HUB.y - 34 }, false)} fill="none" stroke="white" strokeWidth={2.4} strokeLinecap="round" pathLength={1} strokeDasharray="0.08 0.92" className="ms-pulse" style={{ filter: 'drop-shadow(0 0 5px white)' }} />
        {DIAL_AT.map((d, i) => {
          const from = { x: HUB.x + (d.x < HUB.x ? -34 : 34), y: HUB.y }
          const to = { x: d.x + (d.x < HUB.x ? DIAL_R + 8 : -DIAL_R - 8), y: d.y }
          const path = fiber(from, to, true)
          return (
            <g key={KNOBS[i].label.es}>
              <path d={path} fill="none" stroke="url(#ms-fiber)" strokeOpacity={0.45} strokeWidth={1.2} />
              <path key={`p-${wave}`} d={path} fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" pathLength={1} strokeDasharray="0.1 0.9" className="ms-pulse" style={{ animationDelay: `${0.55 + i * 0.06}s`, filter: 'drop-shadow(0 0 4px white)' }} />
            </g>
          )
        })}

        {/* El constructor: el mismo para todos */}
        <circle cx={HUB.x} cy={HUB.y} r={70} fill="url(#ms-hub)" />
        <circle cx={HUB.x} cy={HUB.y} r={34} fill="rgb(var(--void))" stroke="rgb(var(--signal))" strokeWidth={1.5} style={{ filter: 'drop-shadow(0 0 10px rgb(var(--signal) / 0.7))' }} />
        <text x={HUB.x} y={HUB.y + 4} textAnchor="middle" className="fill-current font-mono uppercase" fontSize={9} letterSpacing="0.14em">{t({ es: 'Constructor', en: 'Builder' })}</text>

        {/* Las seis perillas: su aguja gira a la opción del modelo activo */}
        {KNOBS.map((k, i) => {
          const d = DIAL_AT[i]
          const at = k.pick[current.id]
          const n = k.options.length
          const left = d.x < HUB.x
          const needle = optionAngle(at, n)
          return (
            <g key={k.label.es}>
              <circle cx={d.x} cy={d.y} r={DIAL_R} fill="rgb(var(--void))" stroke="white" strokeOpacity={0.18} />
              {k.options.map((o, oi) => {
                const p = polar(d.x, d.y, DIAL_R - 7, optionAngle(oi, n))
                return <circle key={o.es} cx={p.x} cy={p.y} r={oi === at ? 3 : 1.8} fill={oi === at ? 'white' : 'rgb(255 255 255 / 0.3)'} style={{ transition: 'r .5s, fill .5s' }} />
              })}
              <g style={{ transform: `rotate(${needle}deg)`, transformOrigin: `${d.x}px ${d.y}px`, transition: `transform .8s cubic-bezier(.16,1,.3,1) ${0.55 + i * 0.06}s` }}>
                <line x1={d.x} y1={d.y} x2={d.x + DIAL_R - 9} y2={d.y} stroke="rgb(var(--signal))" strokeWidth={2} strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 4px rgb(var(--signal)))' }} />
              </g>
              <circle cx={d.x} cy={d.y} r={3} fill="rgb(var(--signal))" />
              <text x={d.x + (left ? -DIAL_R - 12 : DIAL_R + 12)} y={d.y - 6} textAnchor={left ? 'end' : 'start'} className="fill-current font-mono uppercase" fontSize={10} letterSpacing="0.14em" opacity={0.5}>{t(k.label)}</text>
              <text key={`${current.id}-${i}`} x={d.x + (left ? -DIAL_R - 12 : DIAL_R + 12)} y={d.y + 14} textAnchor={left ? 'end' : 'start'} className="ms-value fill-current" fontSize={15} style={{ animationDelay: `${0.6 + i * 0.06}s` }}>{t(k.options[at])}</text>
            </g>
          )
        })}

        {/* Los cinco modelos: tocarlos los elige */}
        {MODELS.map((m, i) => {
          const p = MODEL_AT[i]
          const on = i === active
          return (
            <g
              key={m.id}
              role="button"
              tabIndex={0}
              aria-pressed={on}
              aria-label={m.label}
              onClick={() => choose(i)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  choose(i)
                }
              }}
              className="cursor-pointer outline-none"
            >
              <circle cx={p.x} cy={p.y} r={26} fill="rgb(var(--signal))" opacity={on ? 0.2 : 0} style={{ transition: 'opacity .5s' }} />
              <circle cx={p.x} cy={p.y} r={on ? 9 : 6} fill={on ? 'rgb(var(--signal))' : 'rgb(var(--void))'} stroke={on ? 'white' : 'rgb(255 255 255 / 0.45)'} strokeWidth={1.4} style={{ transition: 'r .5s, fill .5s' }} />
              <text x={p.x} y={p.y - 22} textAnchor="middle" className="fill-current font-mono" fontSize={12} letterSpacing="0.1em" opacity={on ? 1 : 0.45} style={{ transition: 'opacity .5s' }}>{m.label}</text>
            </g>
          )
        })}
      </svg>
    </figure>
  )
}

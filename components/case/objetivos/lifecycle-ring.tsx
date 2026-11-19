'use client'

import { useEffect, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'

type Role = 'admin' | 'lider' | 'colaborador'

interface Moment {
  id: string
  name: L
  roles: readonly Role[]
  /** Si la plataforma actual lo cubría. */
  before: boolean
  where: L
}

/** Los siete momentos de un ciclo de objetivos y quién los vive. */
const MOMENTS: readonly Moment[] = [
  { id: 'configurar', name: { es: 'Configurar', en: 'Set up' }, roles: ['admin'], before: true, where: { es: 'Escala de cumplimiento, niveles de desempeño y permisos.', en: 'Attainment scale, performance levels and permissions.' } },
  { id: 'crear', name: { es: 'Crear', en: 'Create' }, roles: ['admin', 'lider', 'colaborador'], before: true, where: { es: 'Constructor de 5 pasos o carga masiva; RR. HH. o cada quien redacta.', en: '5-step builder or bulk upload; HR or each person writes.' } },
  { id: 'alinear', name: { es: 'Alinear', en: 'Align' }, roles: ['admin', 'lider'], before: false, where: { es: 'Cada objetivo cuelga de uno de empresa; lo demás queda «sin alinear».', en: 'Every goal hangs from a company goal; the rest is “unaligned”.' } },
  { id: 'aprobar', name: { es: 'Aprobar', en: 'Approve' }, roles: ['lider'], before: false, where: { es: 'El líder aprueba o devuelve con un motivo; sin aprobar no hay avance.', en: 'The lead approves or sends back with a reason; no approval, no progress.' } },
  { id: 'reportar', name: { es: 'Reportar', en: 'Report' }, roles: ['colaborador'], before: false, where: { es: 'Valor, comentario y evidencia; cada reporte queda en el historial.', en: 'Value, comment and evidence; every report stays in the history.' } },
  { id: 'leer', name: { es: 'Leer', en: 'Read' }, roles: ['admin', 'lider'], before: false, where: { es: 'Resumen, alineación, cumplimiento, ranking y lectura con IA.', en: 'Summary, alignment, attainment, ranking and AI reading.' } },
  { id: 'cerrar', name: { es: 'Cerrar', en: 'Close' }, roles: ['admin'], before: false, where: { es: 'Accionables que siguen al cierre: 360, matriz de talento y PDI.', en: 'Actions after close: 360, talent matrix and development plans.' } },
]

const ROLE_NAME: Record<Role, L> = {
  admin: { es: 'Admin', en: 'Admin' },
  lider: { es: 'Líder', en: 'Lead' },
  colaborador: { es: 'Colaborador', en: 'Employee' },
}

const SIZE = 420
const CX = SIZE / 2
const RADIUS = 160
const GAP = 4 // grados entre arcos

const polar = (deg: number, r: number) => {
  const rad = ((deg - 90) * Math.PI) / 180
  // Redondeado: servidor y navegador deben escribir la misma cifra al hidratar.
  return { x: Math.round((CX + r * Math.cos(rad)) * 100) / 100, y: Math.round((CX + r * Math.sin(rad)) * 100) / 100 }
}

const arc = (from: number, to: number, r: number) => {
  const a = polar(from, r)
  const b = polar(to, r)
  return `M${a.x} ${a.y} A${r} ${r} 0 ${to - from > 180 ? 1 : 0} 1 ${b.x} ${b.y}`
}

/** 01 · El ciclo de vida: lo que la plataforma cubría y lo que cubre el rediseño, momento a momento. */
export function LifecycleRing() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const [mode, setMode] = useState<'antes' | 'rediseno'>('antes')
  const [active, setActive] = useState(0)
  const [auto, setAuto] = useState(true)
  const step = 360 / MOMENTS.length

  // Recorre los momentos solo mientras nadie haya tocado el anillo.
  useEffect(() => {
    if (!auto || reducedMotion) return
    const id = window.setInterval(() => setActive((i) => (i + 1) % MOMENTS.length), 2200)
    return () => window.clearInterval(id)
  }, [auto, reducedMotion])

  const moment = MOMENTS[active]
  const covered = (m: Moment) => mode === 'rediseno' || m.before
  const coveredCount = MOMENTS.filter(covered).length

  return (
    <figure data-reveal className="grid items-center gap-10 border border-fg/15 p-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:p-10">
      <div className="relative mx-auto w-full max-w-[420px]">
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="h-auto w-full" role="group" aria-label={t({ es: 'Momentos del ciclo de objetivos', en: 'Goal cycle moments' })}>
          {MOMENTS.map((m, i) => {
            const from = i * step + GAP / 2
            const to = (i + 1) * step - GAP / 2
            const on = covered(m)
            const label = polar((from + to) / 2, RADIUS + 38)
            return (
              <g key={m.id}>
                <path
                  d={arc(from, to, RADIUS)}
                  fill="none"
                  strokeLinecap="round"
                  strokeWidth={i === active ? 26 : 18}
                  className={`cursor-pointer transition-[stroke,stroke-width] duration-500 ${on ? 'stroke-signal' : 'stroke-fg/10'}`}
                  style={{ opacity: on ? (i === active ? 1 : 0.55) : 1 }}
                  onClick={() => {
                    setAuto(false)
                    setActive(i)
                  }}
                />
                <text x={label.x} y={label.y} textAnchor="middle" dy="0.35em" fontSize={13} className={`pointer-events-none fill-current transition-opacity duration-500 ${on ? 'opacity-90' : 'opacity-35'}`}>
                  {t(m.name)}
                </text>
              </g>
            )
          })}
          <text x={CX} y={CX - 14} textAnchor="middle" className="fill-current" fontSize={64} fontWeight={300}>
            {coveredCount}
            <tspan fontSize={24} className="opacity-50">/7</tspan>
          </text>
          <text x={CX} y={CX + 26} textAnchor="middle" fontSize={12} className="fill-current opacity-60">
            {mode === 'antes' ? t({ es: 'momentos cubiertos hoy', en: 'moments covered today' }) : t({ es: 'en el rediseño', en: 'in the redesign' })}
          </text>
        </svg>
      </div>

      <div>
        <div role="radiogroup" aria-label={t({ es: 'Comparar', en: 'Compare' })} className="mb-8 inline-flex border border-fg/20 p-1">
          {(['antes', 'rediseno'] as const).map((id) => (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={mode === id}
              onClick={() => setMode(id)}
              className="mono-label px-4 py-2 transition-colors aria-checked:bg-fg aria-checked:text-bg"
            >
              {id === 'antes' ? t({ es: 'Plataforma actual', en: 'Current platform' }) : t({ es: 'Rediseño', en: 'Redesign' })}
            </button>
          ))}
        </div>
        <p className="mono-label text-signal">0{active + 1} · {t(moment.name)}</p>
        <p key={`${moment.id}-${mode}`} className="obj-fade mt-3 text-[clamp(1.3rem,1rem+1vw,1.8rem)] font-light leading-snug">
          {covered(moment) ? t(moment.where) : t({ es: 'No existía: el producto terminaba al crear el ciclo.', en: 'Didn’t exist: the product ended when the cycle was created.' })}
        </p>
        <ul className="mt-6 flex flex-wrap gap-2" aria-label={t({ es: 'Quién lo vive', en: 'Who lives it' })}>
          {moment.roles.map((r) => (
            <li key={r} className={`border px-2.5 py-1 font-mono text-[11px] ${covered(moment) ? 'border-signal/60 text-signal' : 'border-fg/20 opacity-50'}`}>
              {t(ROLE_NAME[r])}
            </li>
          ))}
        </ul>
      </div>
    </figure>
  )
}

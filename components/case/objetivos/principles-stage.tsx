'use client'

import { useEffect, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { TABLET_QUERY, useMedia } from './use-media'

const AUTO_MS = 6000
/** Lo que tarda el escenario en desvanecerse antes de pasar solo al siguiente principio. */
const LEAVE_MS = 450
const BLUE = 'rgb(64,96,255)'

/**
 * Un momento de la escena: qué estado muestra (`s`), cuánto dura y si la escena está oculta.
 * Los bucles cierran así: el último estado se sostiene, la escena se desvanece entera sin
 * cambiar, se reinicia mientras está oculta y vuelve a aparecer en el primer estado.
 */
interface Beat {
  s: number
  ms: number
  hidden?: boolean
}

const EXIT_MS = 600
const RESET_MS = 900

/** Recorre los momentos mientras el movimiento esté permitido; con movimiento reducido, el estado final. */
function useBeats(beats: readonly Beat[]): Beat {
  const { reducedMotion } = useA11y()
  const [i, setI] = useState(beats[0].hidden ? 1 : 0)
  useEffect(() => {
    if (reducedMotion) return
    const id = window.setTimeout(() => setI((v) => (v + 1) % beats.length), beats[i].ms)
    return () => window.clearTimeout(id)
  }, [i, beats, reducedMotion])
  if (reducedMotion) return { s: Math.max(...beats.map((b) => b.s)), ms: 0 }
  return beats[i]
}

/** Arma un bucle con cierre: oculto y reiniciado, los pasos, el final sostenido y la salida. */
const loopBeats = (steps: readonly number[], hold: number): readonly Beat[] => {
  const last = steps.length - 1
  return [
    { s: 0, ms: RESET_MS, hidden: true },
    ...steps.map((ms, s) => ({ s, ms: s === last ? hold : ms })),
    { s: last, ms: EXIT_MS, hidden: true },
  ]
}

/** El contenedor que desvanece la escena entera al cerrar el bucle. */
function LoopFade({ hidden, children }: { hidden?: boolean; children: React.ReactNode }) {
  return (
    <div className="h-full transition-opacity duration-500 ease-out" style={{ opacity: hidden ? 0 : 1 }}>
      {children}
    </div>
  )
}

/* ── 01 · El norte primero ─────────────────────────────────────────────── */

const LEAVES = [
  { label: 'Cumplir el presupuesto de ventas', x: 20, aligned: true },
  { label: 'Abrir 2 cuentas nuevas', x: 200, aligned: true },
  { label: 'Ordenar el archivo', x: 380, aligned: false },
]

/** Medidas del escenario: ancho en escritorio y tableta, angosto (las hojas más altas) en teléfono. */
const NORTH = {
  wide: { w: 560, h: 300, root: { x: 120, w: 320 }, rootFont: 20, leafX: (x: number) => x, leafW: 160, leafY: 200, leafH: 70, leafFont: 15, mid: 280 },
  narrow: { w: 340, h: 300, root: { x: 20, w: 300 }, rootFont: 19, leafX: (x: number) => 4 + (x / 180) * 114, leafW: 104, leafY: 168, leafH: 98, leafFont: 15, mid: 170 },
} as const

const NORTH_BEATS = loopBeats([700, 1300, 1300, 1300], 2400)

function NorthScene() {
  const { s: step, hidden } = useBeats(NORTH_BEATS)
  const narrow = !useMedia(TABLET_QUERY)
  const g = narrow ? NORTH.narrow : NORTH.wide
  return (
    <LoopFade hidden={hidden}>
    <svg viewBox={`0 0 ${g.w} ${g.h}`} className="h-full w-full" role="img" aria-label="Tres objetivos: dos cuelgan del norte de la empresa y uno queda sin alinear">
      <rect x={g.root.x} y="16" width={g.root.w} height="60" rx="14" fill={BLUE} />
      <text x={g.mid} y="53" textAnchor="middle" fontSize={g.rootFont} fill="#fff">Crecer los ingresos un 15 %</text>
      {LEAVES.map((leaf, i) => {
        const shown = step > i
        const x = g.leafX(leaf.x)
        const cx = x + g.leafW / 2
        const path = `M${cx} ${g.leafY} C${cx} ${g.leafY - 60} ${g.mid} ${g.leafY - 70} ${g.mid} 76`
        return (
          <g key={leaf.label} className="transition-opacity duration-700" style={{ opacity: shown ? 1 : 0.15 }}>
            <path d={path} fill="none" stroke={leaf.aligned ? BLUE : 'currentColor'} strokeOpacity={leaf.aligned ? 0.9 : 0.35} strokeWidth={leaf.aligned ? 3 : 1.5} strokeDasharray={leaf.aligned ? undefined : '5 6'} />
            {/* La chispa se apaga con su hoja en vez de desaparecer de golpe. */}
            {leaf.aligned && <path d={path} fill="none" stroke={BLUE} strokeWidth={7} strokeLinecap="round" pathLength={1} strokeDasharray="0.04 0.96" className="obj-flow transition-opacity duration-700" style={{ opacity: shown ? 1 : 0 }} />}
            <rect x={x} y={g.leafY} width={g.leafW} height={g.leafH} rx="12" fill="var(--obj-card)" stroke={leaf.aligned ? BLUE : 'currentColor'} strokeOpacity={leaf.aligned ? 0.6 : 0.25} />
            <foreignObject x={x + 10} y={g.leafY + 8} width={g.leafW - 20} height={g.leafH - 14}>
              <p style={{ fontSize: g.leafFont, lineHeight: 1.2, margin: 0 }}>{leaf.label}</p>
            </foreignObject>
            {!leaf.aligned && (
              <text x={cx} y={g.leafY + g.leafH + 22} textAnchor="middle" fontSize="15" fill="#e8743b">sin alinear</text>
            )}
          </g>
        )
      })}
    </svg>
    </LoopFade>
  )
}

/* ── 02 · Acordar antes de medir ───────────────────────────────────────── */

const APPROVE_BEATS = loopBeats([900, 1500, 1500, 1500], 2200)

function ApproveScene() {
  const { s: step, hidden } = useBeats(APPROVE_BEATS)
  const approved = step >= 2
  return (
    <LoopFade hidden={hidden}>
    <div className="flex h-full flex-col justify-center gap-5 px-2">
      <div className="relative rounded-2xl bg-[var(--obj-card)] p-5 shadow-[0_24px_50px_-30px_rgba(0,0,0,0.5)] ring-1 ring-fg/10">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[15px]">Reducir el tiempo de respuesta</span>
          <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] transition-colors duration-500 ${approved ? 'bg-[#17b26a]/15 text-[#17b26a]' : 'bg-[#f38744]/15 text-[#f38744]'}`}>{approved ? 'Aprobado' : 'Por aprobar'}</span>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-fg/10">
          <span className="block h-full origin-left rounded-full transition-transform duration-1000 ease-expo" style={{ background: BLUE, transform: `scaleX(${step === 3 ? 0.46 : 0})` }} />
        </div>
        <p className="mt-2 font-mono text-[11px] opacity-60">{step === 3 ? '46 % · cuenta para el área' : approved ? 'listo para reportar' : 'sin avance hasta aprobar'}</p>
      </div>
      <div className={`flex items-center gap-3 transition-[opacity,transform] duration-500 ${step === 1 ? 'translate-y-0 opacity-100' : step > 1 ? 'opacity-40' : 'translate-y-2 opacity-0'}`}>
        <span className="grid h-8 w-8 place-items-center rounded-full bg-fg text-[11px] text-bg">LC</span>
        <span className="rounded-full px-4 py-1.5 text-[12px] text-paper" style={{ background: BLUE }}>Aprobar</span>
        <span className="rounded-full border border-fg/25 px-4 py-1.5 text-[12px]">Devolver con motivo</span>
      </div>
    </div>
    </LoopFade>
  )
}

/* ── 03 · Constancia antes que % ───────────────────────────────────────── */

/** Nueve semanas (0 a 8) a 650 ms; la última se sostiene antes de cerrar. */
const STREAK_BEATS = loopBeats(Array.from({ length: 9 }, () => 650), 2000)

function StreakScene() {
  const { s: week, hidden } = useBeats(STREAK_BEATS)
  const people = [
    { who: 'Ana · meta retadora', pct: 41, weeks: 8 },
    { who: 'Luis · meta cómoda', pct: 96, weeks: 2 },
  ]
  return (
    <LoopFade hidden={hidden}>
    <div className="flex h-full flex-col justify-center gap-6 px-2">
      {people.map((p) => {
        const filled = Math.min(week, p.weeks)
        const streak = filled >= 3
        return (
          <div key={p.who}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-[14px]">{p.who}</span>
              <span className="font-mono text-[11px] opacity-50">{p.pct} % de avance</span>
            </div>
            <div className="mt-2 flex items-center gap-1.5">
              {Array.from({ length: 8 }, (_, i) => (
                <span key={i} className="h-9 flex-1 rounded-md transition-[background-color,transform] duration-300" style={{ background: i < filled ? BLUE : 'rgb(var(--fg) / 0.08)', transform: i === filled - 1 ? 'scaleY(1.12)' : 'none' }} />
              ))}
              <span className={`ml-2 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] transition-opacity duration-500 ${streak ? 'opacity-100' : 'opacity-0'}`} style={{ background: 'rgba(64,96,255,0.12)', color: BLUE }}>
                En racha · {filled}
              </span>
            </div>
          </div>
        )
      })}
      <p className="font-mono text-[11px] opacity-60">se reconoce a Ana: volvió cada semana aunque su % sea menor</p>
    </div>
    </LoopFade>
  )
}

/* ── 04 · Contar, no exponer ───────────────────────────────────────────── */

const CELLS = [
  { area: 'Comercial', n: 14 },
  { area: 'Servicio', n: 9 },
  { area: 'Finanzas', n: 2 },
  { area: 'Marca', n: 6 },
]

/** Nombres ↔ cifra: un fundido cruzado en ambos sentidos, sin reinicio. */
const COUNT_BEATS: readonly Beat[] = [{ s: 0, ms: 1800 }, { s: 1, ms: 1800 }]

function CountScene() {
  const { s: step } = useBeats(COUNT_BEATS)
  const names = ['Ricardo T.', 'Nicolás R.', 'Carlos N.']
  return (
    <div className="flex h-full flex-col justify-center gap-5 px-2">
      <div className="relative grid h-32 place-items-center">
        <ul className={`absolute space-y-1.5 text-[12px] transition-[opacity,filter] duration-700 ${step === 0 ? 'opacity-100 blur-0' : 'opacity-0 blur-md'}`} aria-hidden={step !== 0}>
          {names.map((n) => (
            <li key={n} className="rounded-lg bg-[var(--obj-card)] px-3 py-1.5 ring-1 ring-fg/10">{n} · sin reportar</li>
          ))}
        </ul>
        <span className={`absolute text-center transition-[opacity,transform] duration-700 ${step === 1 ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
          <span className="block text-6xl font-light" style={{ color: BLUE }}>3</span>
          <span className="text-[12px] opacity-70">personas no han reportado</span>
        </span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {CELLS.map((c) => {
          const reserved = c.n < 3
          return (
            <div key={c.area} className={`min-w-0 rounded-xl p-2 md:p-3 ${reserved ? 'border border-dashed border-fg/30' : 'bg-[var(--obj-card)] ring-1 ring-fg/10'}`}>
              <span className="block truncate text-[11px] opacity-60">{c.area}</span>
              <span className="mt-1 block text-lg font-light leading-none">{reserved ? '🔒' : c.n}</span>
              <span className="mt-1 block truncate font-mono text-[11px] opacity-50">{reserved ? 'reservado' : 'personas'}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const PRINCIPLES: readonly { title: L; body: L; Scene: () => JSX.Element }[] = [
  { title: { es: 'El norte primero', en: 'North first' }, body: { es: 'Cada objetivo dice a cuál de empresa empuja. Lo que no cuelga de nada se ve como «sin alinear».', en: 'Every goal says which company goal it pushes. What hangs from nothing shows as “unaligned”.' }, Scene: NorthScene },
  { title: { es: 'Acordar antes de medir', en: 'Agree before measuring' }, body: { es: 'Un objetivo sin aprobar no lleva avance: el líder lo aprueba o lo devuelve con un motivo.', en: 'An unapproved goal carries no progress: the lead approves or returns it with a reason.' }, Scene: ApproveScene },
  { title: { es: 'Constancia antes que %', en: 'Habit over %' }, body: { es: 'Se premia volver a reportar. El porcentaje crudo castiga a quien se puso metas ambiciosas.', en: 'Coming back to report is rewarded. Raw % punishes ambitious goals.' }, Scene: StreakScene },
  { title: { es: 'Contar, no exponer', en: 'Count, don’t expose' }, body: { es: 'En público solo se nombra para reconocer. Un cruce de menos de 3 personas sale reservado.', en: 'In public you only name people to praise. A cell under 3 people stays private.' }, Scene: CountScene },
]

/** Acercamiento a la neurona activa */
const ZOOM = 1.55

/**
 * Los cuatro principios como neuronas en una fibra: la cámara lleva la activa
 * al centro y se acerca; encima, su nombre y una línea; debajo, colgando de la
 * neurona, su demostración. El tramo hacia la siguiente se va llenando mientras
 * se lee. Avanza solo mientras está en vista; tocar una neurona la elige.
 */
export function PrinciplesStage() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const [active, setActive] = useState(0)
  const [auto, setAuto] = useState(true)
  const [inView, setInView] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.4 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Al pasar solo, la demostración se desvanece primero; la siguiente entra con su propio fundido.
  useEffect(() => {
    if (!auto || reducedMotion || !inView) return
    const leave = window.setTimeout(() => setLeaving(true), AUTO_MS - LEAVE_MS)
    const next = window.setTimeout(() => {
      setActive((i) => (i + 1) % PRINCIPLES.length)
      setLeaving(false)
    }, AUTO_MS)
    return () => {
      window.clearTimeout(leave)
      window.clearTimeout(next)
      setLeaving(false)
    }
  }, [active, auto, reducedMotion, inView])

  const { Scene, title, body } = PRINCIPLES[active]
  const choose = (i: number) => {
    setAuto(false)
    setActive(i)
  }
  const running = auto && inView && !reducedMotion
  const count = PRINCIPLES.length
  /** Cámara: lleva la neurona activa al centro de la fila y se acerca */
  const shift = 50 - ((active + 0.5) / count) * 100

  return (
    <div ref={ref} className="mx-auto flex max-w-[820px] flex-col items-center text-center">
      {/* Lo que dice el principio activo */}
      <div key={`txt-${active}`} aria-live="polite" className="obj-fade flex min-h-[7rem] max-w-[40ch] flex-col items-center justify-end">
        <span className="mono-label text-signal">{t({ es: 'Principio', en: 'Principle' })} 0{active + 1}</span>
        <p className="mt-3 text-[clamp(1.5rem,1.1rem+1.4vw,2.4rem)] font-light leading-[1.1] tracking-tight">{t(title)}</p>
        <p className="mt-2 text-sm leading-relaxed text-paper/55">{t(body)}</p>
      </div>

      {/* La fibra con las cuatro neuronas: la cámara se mueve sobre ella */}
      <div className="relative mt-8 h-16 w-full overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_18%,#000_82%,transparent)]">
        <div
          role="tablist"
          aria-label={t({ es: 'Principios', en: 'Principles' })}
          className="absolute inset-0 transition-transform duration-[1100ms] ease-expo"
          style={{ transform: reducedMotion ? undefined : `scale(${ZOOM}) translateX(${shift}%)` }}
        >
          <span className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-white/12" aria-hidden="true" />
          {/* Tramos ya recorridos y el que se va llenando hacia la siguiente neurona */}
          {PRINCIPLES.map((p, i) => {
            if (i === count - 1) return null
            const from = ((i + 0.5) / count) * 100
            const fill = i < active ? 1 : i === active && running ? undefined : 0
            return (
              <span key={`seg-${p.title.es}`} className="absolute top-1/2 h-px -translate-y-1/2 overflow-hidden" style={{ left: `${from}%`, width: `${100 / count}%` }} aria-hidden="true">
                <span
                  key={`${active}-${running}`}
                  className={`block h-full origin-left bg-gradient-to-r from-signal to-[#ff54aa] shadow-[0_0_8px_rgb(var(--signal)/0.7)] ${fill === undefined ? 'obj-progress' : ''}`}
                  style={fill === undefined ? { animationDuration: `${AUTO_MS}ms` } : { transform: `scaleX(${fill})` }}
                />
              </span>
            )
          })}
          {PRINCIPLES.map((p, i) => {
            const on = i === active
            return (
              <button
                key={p.title.es}
                type="button"
                role="tab"
                aria-selected={on}
                aria-label={t(p.title)}
                onClick={() => choose(i)}
                className="group absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${((i + 0.5) / count) * 100}%` }}
              >
                <span className={`relative grid h-[22px] w-[22px] place-items-center rounded-full border font-mono text-[7px] tabular-nums transition-all duration-500 ease-expo ${on ? 'border-white bg-signal text-on-signal shadow-[0_0_0_6px_rgb(var(--signal)/0.18),0_0_22px_4px_rgb(var(--signal)/0.7)]' : i < active ? 'border-white/60 bg-white/20 text-white/80' : 'border-white/35 bg-void text-white/50 group-hover:border-white'}`}>
                  0{i + 1}
                  {on && <span className="absolute inset-[-7px] rounded-full border border-signal/60 animate-[nav-node-ping_2.4s_cubic-bezier(0,0,.2,1)_infinite]" />}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* De la neurona cuelga su demostración */}
      <span className="h-10 w-px bg-gradient-to-b from-signal to-white/10 shadow-[0_0_8px_rgb(var(--signal)/0.6)]" aria-hidden="true" />
      <div role="tabpanel" className="relative w-full max-w-[600px] overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] text-left shadow-[0_30px_80px_-40px_rgb(var(--signal)/0.5)] backdrop-blur-md [--obj-card:rgb(var(--void))]">
        <span className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-signal opacity-15 blur-3xl" aria-hidden="true" />
        <div className="relative transition-opacity ease-out" style={{ opacity: leaving ? 0 : 1, transitionDuration: `${LEAVE_MS}ms` }}>
          <div key={active} className="obj-rise relative h-[260px] p-5 sm:h-[300px] md:p-8">
            <Scene />
          </div>
        </div>
      </div>
    </div>
  )
}

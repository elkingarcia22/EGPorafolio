'use client'

import { useEffect, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'

const AUTO_MS = 6000
const BLUE = 'rgb(64,96,255)'

/** Un contador que avanza solo mientras el movimiento esté permitido. */
function useTick(ms: number, steps: number): number {
  const { reducedMotion } = useA11y()
  const [i, setI] = useState(0)
  useEffect(() => {
    if (reducedMotion) return
    const id = window.setInterval(() => setI((v) => (v + 1) % steps), ms)
    return () => window.clearInterval(id)
  }, [ms, steps, reducedMotion])
  return reducedMotion ? steps - 1 : i
}

/* ── 01 · El norte primero ─────────────────────────────────────────────── */

const LEAVES = [
  { label: 'Cumplir el presupuesto de ventas', x: 20, aligned: true },
  { label: 'Abrir 2 cuentas nuevas', x: 200, aligned: true },
  { label: 'Ordenar el archivo', x: 380, aligned: false },
]

function NorthScene() {
  const step = useTick(1300, 4)
  return (
    <svg viewBox="0 0 560 300" className="h-full w-full" role="img" aria-label="Tres objetivos: dos cuelgan del norte de la empresa y uno queda sin alinear">
      <rect x="120" y="16" width="320" height="60" rx="14" fill={BLUE} />
      <text x="280" y="53" textAnchor="middle" fontSize="20" fill="#fff">Crecer los ingresos un 15 %</text>
      {LEAVES.map((leaf, i) => {
        const shown = step > i
        const path = `M${leaf.x + 80} 200 C${leaf.x + 80} 140 280 130 280 76`
        return (
          <g key={leaf.label} className="transition-opacity duration-700" style={{ opacity: shown ? 1 : 0.15 }}>
            <path d={path} fill="none" stroke={leaf.aligned ? BLUE : 'currentColor'} strokeOpacity={leaf.aligned ? 0.9 : 0.35} strokeWidth={leaf.aligned ? 3 : 1.5} strokeDasharray={leaf.aligned ? undefined : '5 6'} />
            {leaf.aligned && shown && <path d={path} fill="none" stroke={BLUE} strokeWidth={7} strokeLinecap="round" pathLength={1} strokeDasharray="0.04 0.96" className="obj-flow" />}
            <rect x={leaf.x} y="200" width="160" height="70" rx="12" fill="var(--obj-card)" stroke={leaf.aligned ? BLUE : 'currentColor'} strokeOpacity={leaf.aligned ? 0.6 : 0.25} />
            <foreignObject x={leaf.x + 10} y="208" width="140" height="56">
              <p style={{ fontSize: 15, lineHeight: 1.2, margin: 0 }}>{leaf.label}</p>
            </foreignObject>
            {!leaf.aligned && (
              <text x={leaf.x + 80} y="292" textAnchor="middle" fontSize="15" fill="#e8743b">sin alinear</text>
            )}
          </g>
        )
      })}
    </svg>
  )
}

/* ── 02 · Acordar antes de medir ───────────────────────────────────────── */

function ApproveScene() {
  const step = useTick(1500, 4)
  const approved = step >= 2
  return (
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
  )
}

/* ── 03 · Constancia antes que % ───────────────────────────────────────── */

function StreakScene() {
  const week = useTick(650, 10)
  const people = [
    { who: 'Ana · meta retadora', pct: 41, weeks: 8 },
    { who: 'Luis · meta cómoda', pct: 96, weeks: 2 },
  ]
  return (
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
  )
}

/* ── 04 · Contar, no exponer ───────────────────────────────────────────── */

const CELLS = [
  { area: 'Comercial', n: 14 },
  { area: 'Servicio', n: 9 },
  { area: 'Finanzas', n: 2 },
  { area: 'Marca', n: 6 },
]

function CountScene() {
  const step = useTick(1800, 2)
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
            <div key={c.area} className={`rounded-xl p-3 ${reserved ? 'border border-dashed border-fg/30' : 'bg-[var(--obj-card)] ring-1 ring-fg/10'}`}>
              <span className="block truncate text-[11px] opacity-60">{c.area}</span>
              <span className="mt-1 block text-lg font-light leading-none">{reserved ? '🔒' : c.n}</span>
              <span className="mt-1 block truncate font-mono text-[10px] opacity-50">{reserved ? 'reservado' : 'personas'}</span>
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

/**
 * Los cuatro principios como un índice editorial: a la izquierda, los números
 * grandes; a la derecha, un escenario que cambia con cada uno. Avanza solo
 * mientras está en vista y nadie lo toca.
 */
export function PrinciplesStage() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const [active, setActive] = useState(0)
  const [auto, setAuto] = useState(true)
  const [inView, setInView] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.4 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!auto || reducedMotion || !inView) return
    const id = window.setTimeout(() => setActive((i) => (i + 1) % PRINCIPLES.length), AUTO_MS)
    return () => window.clearTimeout(id)
  }, [active, auto, reducedMotion, inView])

  const { Scene, title, body } = PRINCIPLES[active]

  return (
    <div ref={ref} data-reveal className="grid gap-8 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] xl:gap-12">
      <ol role="tablist" aria-label={t({ es: 'Principios', en: 'Principles' })}>
        {PRINCIPLES.map((p, i) => (
          <li key={p.title.es} className="border-t border-fg/15 last:border-b">
            <button
              type="button"
              role="tab"
              aria-selected={i === active}
              onClick={() => {
                setAuto(false)
                setActive(i)
              }}
              className="group relative flex w-full items-baseline gap-5 py-5 text-left"
            >
              <span className={`font-light tabular-nums leading-none transition-[color,opacity] duration-500 text-[clamp(2.2rem,1.4rem+2vw,3.4rem)] ${i === active ? 'text-signal' : 'opacity-20 group-hover:opacity-50'}`}>0{i + 1}</span>
              <span className={`text-[clamp(1.1rem,0.9rem+0.6vw,1.5rem)] leading-snug transition-opacity duration-500 ${i === active ? 'opacity-100' : 'opacity-45 group-hover:opacity-80'}`}>{t(p.title)}</span>
              {i === active && auto && inView && !reducedMotion && (
                <span key={active} className="obj-progress absolute -top-px left-0 h-0.5 w-full origin-left bg-signal" style={{ animationDuration: `${AUTO_MS}ms` }} aria-hidden="true" />
              )}
            </button>
          </li>
        ))}
      </ol>

      <div role="tabpanel" className="relative overflow-hidden rounded-3xl bg-fg/[0.04] ring-1 ring-fg/10 [--obj-card:rgb(var(--bg))]">
        <span className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-signal opacity-15 blur-3xl" aria-hidden="true" />
        <div key={active} className="obj-rise relative h-[300px] p-6 md:p-8">
          <Scene />
        </div>
        <div key={`txt-${active}`} className="obj-fade relative border-t border-fg/10 p-6 md:p-8">
          <span className="mono-label text-signal">{t({ es: 'Principio', en: 'Principle' })} 0{active + 1}</span>
          <p className="mt-2 text-xl leading-snug">{t(title)}</p>
          <p className="mt-2 max-w-[52ch] text-sm leading-relaxed opacity-70">{t(body)}</p>
        </div>
      </div>
    </div>
  )
}

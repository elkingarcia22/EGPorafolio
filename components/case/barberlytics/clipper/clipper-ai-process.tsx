'use client'

import { useEffect, useState } from 'react'
import { useLocale, type L } from '@/lib/i18n'
import { useA11y } from '@/lib/a11y'
import { CLIPPER_CASE } from '@/lib/content/cases/barberlytics/clipper-case'
import { ClipperOrb } from '../clipper-orb'
import { useTick } from '../thema/live-pieces'
import { AI_GRADIENT } from './clipper-pieces'

const STAGE = 'relative isolate overflow-hidden rounded-3xl bg-[#0f0d0b] p-5 text-[#efe9dd] md:p-8'
const RED = '#ff6b72'
const GREEN = '#5fd39a'

function Glow() {
  return (
    <span className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
      <span className="absolute -left-[10%] top-[5%] h-[80%] w-[45%] animate-[aurora-drift_20s_ease-in-out_infinite] rounded-full bg-[#de8c3a] opacity-[0.14] blur-[100px]" />
      <span className="absolute -right-[10%] bottom-0 h-[80%] w-[45%] animate-[aurora-drift_24s_ease-in-out_infinite_reverse] rounded-full bg-[#2e9cb0] opacity-[0.14] blur-[100px]" />
    </span>
  )
}

/* ── Las 60 preguntas, como 60 puntos que se reagrupan ─────────────────── */

type Mode = 'idioma' | 'espera'
const W = 640
const H = 170
const CELL = 19

interface Group {
  label: L
  value: number
  color: string
}

/** Posición de cada punto: los grupos van lado a lado, cada uno en una rejilla compacta. */
function layout(groups: readonly Group[]) {
  const gap = 44
  const cols = groups.map((g) => Math.ceil(Math.sqrt(g.value * 1.4)))
  const total = cols.reduce((a, c) => a + c * CELL, 0) + gap * (groups.length - 1)
  let x = (W - total) / 2
  const pts: { x: number; y: number; color: string }[] = []
  const heads: { x: number; w: number }[] = []
  groups.forEach((g, gi) => {
    const c = cols[gi]
    const rows = Math.ceil(g.value / c)
    const top = H - rows * CELL
    for (let k = 0; k < g.value; k++) pts.push({ x: x + (k % c) * CELL + CELL / 2, y: top + Math.floor(k / c) * CELL + CELL / 2, color: g.color })
    heads.push({ x, w: c * CELL })
    x += c * CELL + gap
  })
  return { pts, heads }
}

/** A qué grupo de «lo que se espera» va cada pregunta (un orden mezclado, para que se vea el cambio). */
const SHUFFLE = Array.from({ length: 60 }, (_, i) => (i * 37) % 60)

function EvalSwarm() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const { evals } = CLIPPER_CASE.build
  const [mode, setMode] = useState<Mode>('idioma')
  const [pinned, setPinned] = useState(false)
  useEffect(() => {
    if (pinned || reducedMotion) return
    const id = window.setInterval(() => setMode((m) => (m === 'idioma' ? 'espera' : 'idioma')), 3600)
    return () => window.clearInterval(id)
  }, [pinned, reducedMotion])

  const byLang: Group[] = evals.languages.map((l, i) => ({ label: l.label, value: l.value, color: ['#f0ce86', '#de8c3a', '#2e9cb0'][i] }))
  const byBehavior: Group[] = evals.behaviors.map((b, i) => ({ label: b.label, value: b.value, color: ['#2e9cb0', '#de8c3a', '#9a9ea8'][i] }))
  const groups = mode === 'idioma' ? byLang : byBehavior
  const { pts, heads } = layout(groups)
  // En «espera», cada pregunta salta a otro lugar: así se ve que son las mismas 60, ordenadas de otra forma.
  const at = (i: number) => (mode === 'idioma' ? pts[i] : pts[SHUFFLE[i]])

  return (
    <div data-reveal="device" className={STAGE}>
      <Glow />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-end gap-4">
          <p className="bg-clip-text text-[clamp(4rem,2rem+5vw,6.5rem)] font-light leading-[0.85] text-transparent" style={{ backgroundImage: AI_GRADIENT }}>60</p>
          <p className="pb-1 text-sm leading-snug text-white/65">{t({ es: 'preguntas para', en: 'questions to' })}<br />{t({ es: 'evaluar a Clipper', en: 'evaluate Clipper' })}</p>
        </div>
        <div role="radiogroup" aria-label={t({ es: 'Agrupar por', en: 'Group by' })} className="flex rounded-lg bg-white/[0.06] p-0.5">
          {(['idioma', 'espera'] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="radio"
              aria-checked={mode === m}
              onClick={() => {
                setMode(m)
                setPinned(true)
              }}
              className="rounded-md px-3 py-1.5 text-xs text-white/65 transition-colors hover:text-white aria-checked:bg-[#d9b36a] aria-checked:text-[#16130f]"
            >
              {m === 'idioma' ? t({ es: 'Por idioma', en: 'By language' }) : t({ es: 'Por lo que se espera', en: 'By expected behavior' })}
            </button>
          ))}
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H + 40}`} className="mt-6 block h-auto w-full" role="img" aria-label={groups.map((g) => `${t(g.label)}: ${g.value}`).join(', ')}>
        {heads.map((h, gi) => (
          <g key={`${mode}-${gi}`} className="animate-[ramp-in_0.6s_cubic-bezier(0.16,1,0.3,1)_both] max-sm:hidden" style={{ animationDelay: '350ms' }}>
            <text x={h.x + h.w / 2} y={H + 22} textAnchor="middle" fontSize="13" fill="rgba(239,233,221,0.85)">{t(groups[gi].label)}</text>
            <text x={h.x + h.w / 2} y={H + 38} textAnchor="middle" fontSize="11" fontFamily="var(--font-mono, monospace)" fill={groups[gi].color}>{groups[gi].value}</text>
          </g>
        ))}
        {Array.from({ length: 60 }, (_, i) => {
          const p = at(i)
          return (
            <circle
              key={i}
              cx={0}
              cy={0}
              r={6.2}
              fill={p.color}
              style={{ transform: `translate(${p.x}px, ${p.y}px)`, transition: `transform 900ms cubic-bezier(0.16,1,0.3,1) ${(i % 12) * 18}ms, fill 600ms` }}
            />
          )
        })}
      </svg>
      {/* En el celular las etiquetas del SVG quedarían diminutas: van como leyenda en texto. */}
      <ul key={`legend-${mode}`} className="mt-4 grid animate-[ramp-in_0.6s_cubic-bezier(0.16,1,0.3,1)_both] gap-2 sm:hidden">
        {groups.map((g) => (
          <li key={g.label.es} className="flex items-center gap-2.5 text-[13px] text-white/85">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: g.color }} />
            {t(g.label)}
            <span className="ml-auto font-mono text-[12px]" style={{ color: g.color }}>{g.value}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap items-center gap-1.5">
        {evals.categories.map((c) => <span key={c} className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[10px] text-white/60">{c}</span>)}
      </div>
      <div className="mt-6 flex items-start gap-4 border-t border-white/10 pt-5">
        <span className="relative mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-[#de8c3a]/70 font-mono text-[10px] text-[#f0ce86]">90 %</span>
        <p className="text-sm leading-relaxed text-white/65">{t(evals.note)}</p>
      </div>
    </div>
  )
}

/* ── El filtro de cifras: un recorrido de modelo a pantalla ────────────── */

const GUARD_STEPS = 6

function GuardFlow() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const { guard } = CLIPPER_CASE.build
  const tick = useTick(1500)
  const step = reducedMotion ? 5 : tick % GUARD_STEPS
  // 0 el modelo escribe · 1 viaja al filtro · 2 lo frena · 3 vuelve a corregir · 4 viaja de nuevo · 5 llega a la pantalla
  const packetX = [8, 50, 50, 8, 50, 92][step]
  const caught = step === 2 || step === 3
  const passed = step === 5
  const text = step >= 3 ? t(guard.after) : t(guard.before)
  const node = (x: number, label: L, sub: L, on: boolean, tone?: string) => (
    <div className="absolute top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2" style={{ left: `${x}%` }}>
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl border transition-all duration-500" style={{ borderColor: on ? tone ?? '#de8c3a' : 'rgba(255,255,255,0.15)', background: on ? `${tone ?? '#de8c3a'}22` : '#141210', boxShadow: on ? `0 0 30px ${tone ?? '#de8c3a'}55` : 'none' }}>
        {label.es === 'Modelo' ? <ClipperOrb size={30} state={step === 0 || step === 3 ? 'thinking' : 'idle'} /> : label.es === 'Filtro' ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" /><path d="M9 12l2 2 4-4" /></svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /></svg>
        )}
      </span>
      <span className="text-center text-[12px] font-medium">{t(label)}</span>
      <span className="text-center text-[10px] text-white/45">{t(sub)}</span>
    </div>
  )
  return (
    <div data-reveal="device" className={STAGE}>
      <Glow />
      <p className="mono-label mb-2 text-white/50">{t({ es: 'El filtro de cifras', en: 'The number guard' })}</p>
      <p className="max-w-[60ch] text-lg leading-snug">{t({ es: 'Ningún número llega a la pantalla si no salió de los datos.', en: 'No number reaches the screen unless it came from the data.' })}</p>

      <div className="relative mt-8 h-[170px]">
        <span className="absolute left-[8%] right-[8%] top-1/2 h-px -translate-y-[26px] bg-white/10" aria-hidden="true" />
        <span className="absolute left-[8%] top-1/2 h-[2px] -translate-y-[26px] rounded-full transition-[width] duration-700 ease-expo" style={{ width: `${packetX - 8}%`, backgroundImage: caught ? `linear-gradient(90deg,#de8c3a,${RED})` : AI_GRADIENT }} aria-hidden="true" />
        {node(8, { es: 'Modelo', en: 'Model' }, { es: 'escribe la respuesta', en: 'writes the answer' }, step === 0 || step === 3)}
        {node(50, { es: 'Filtro', en: 'Guard' }, { es: 'compara con lo consultado', en: 'checks against the lookup' }, step >= 1 && step <= 4, caught ? RED : GREEN)}
        {node(92, { es: 'Pantalla', en: 'Screen' }, { es: 'lo que ve la persona', en: 'what the person sees' }, passed, GREEN)}
        {/* El paquete que viaja */}
        <span className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-[31px] rounded-full transition-[left,background-color] duration-700 ease-expo" style={{ left: `${packetX}%`, background: caught ? RED : passed ? GREEN : '#f0ce86', boxShadow: `0 0 16px ${caught ? RED : '#de8c3a'}` }} aria-hidden="true" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-center">
        <div className="rounded-2xl border p-5 font-mono text-sm transition-colors duration-500" style={{ borderColor: caught ? `${RED}88` : passed ? `${GREEN}88` : 'rgba(255,255,255,0.12)', background: '#141210' }}>
          <p key={text}>
            {step < 3
              ? text.split(guard.flagged).map((part, i, arr) => (
                  <span key={i}>{part}{i < arr.length - 1 && <mark className={`rounded px-1 transition-colors duration-300 ${caught ? 'bg-[#ff6b72]/30 text-[#ff8a8e]' : 'bg-transparent text-inherit'}`}>{guard.flagged}</mark>}</span>
                ))
              : <span style={{ color: passed ? GREEN : undefined }}>{text}</span>}
          </p>
          <p className="mt-3 min-h-[1.2em] text-xs" style={{ color: caught ? RED : passed ? GREEN : 'rgba(255,255,255,0.4)' }}>
            {caught ? `✕ ${t({ es: '«12 %» no sale de los datos · se le pide corregir una vez', en: '“12%” isn’t in the data · it’s asked to fix it once' })}` : passed ? `✓ ${t({ es: 'cada cifra sale de lo consultado', en: 'every figure comes from the lookup' })}` : t({ es: 'revisando cifras…', en: 'checking figures…' })}
          </p>
        </div>
        <p className="text-sm leading-relaxed text-white/65">{t({ es: 'Si vuelve a fallar, no la muestra: «La respuesta traía cifras que no salen de los datos».', en: 'If it fails again, it won’t show it: “The answer had figures that don’t come from the data”.' })}</p>
      </div>
    </div>
  )
}

/* ── Las fases, como una línea de tiempo ───────────────────────────────── */

function Phases() {
  const { t } = useLocale()
  const { phases } = CLIPPER_CASE.build
  return (
    <ol className="relative grid gap-10 md:grid-cols-3 md:gap-6">
      <span className="absolute left-0 right-[33%] top-[11px] hidden h-[2px] md:block" style={{ backgroundImage: AI_GRADIENT }} aria-hidden="true" />
      <span className="absolute left-[67%] right-0 top-[11px] hidden border-t-2 border-dashed border-fg/25 md:block" aria-hidden="true" />
      {phases.map((p, i) => {
        const pending = i === phases.length - 1
        return (
          <li key={p.title.es} data-reveal className="relative">
            <span className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold ${pending ? 'border-2 border-dashed border-fg/40 bg-bg' : 'text-[#16130f]'}`} style={pending ? undefined : { backgroundImage: AI_GRADIENT }}>
              {pending ? '' : '✓'}
            </span>
            <p className="mt-4 text-xl font-light leading-tight">{t(p.title)}</p>
            <p className="mt-2 text-sm leading-relaxed opacity-70">{t(p.body)}</p>
          </li>
        )
      })}
    </ol>
  )
}

/** 06 · La IA en el proceso: cómo se evalúa, cómo se frenan las cifras inventadas y en qué fase va. */
export function ClipperAiProcess() {
  return (
    <div className="space-y-12">
      <EvalSwarm />
      <GuardFlow />
      <Phases />
    </div>
  )
}

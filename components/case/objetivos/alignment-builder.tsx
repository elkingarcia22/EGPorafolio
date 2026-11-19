'use client'

import { useEffect, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'

/**
 * Alinear, en cascada: persona → grupo → objetivo de empresa, como la vista
 * «Colaboradores» del mapa de alineación del constructor. La cámara arranca
 * encima de una sola tarjeta y se aleja hasta mostrar todo el ciclo.
 *
 * Personas, áreas, tamaños de grupo y qué áreas empujan más a cada objetivo
 * vienen del ciclo «Objetivos de compañía 2026 · por trimestres» del staging
 * (corte al 19 nov 2026). Cada objetivo recibe aporte de las diez áreas: las
 * tres que más empujan van en trazo grueso; el resto, en trazo fino.
 */

const BLUE = '#0c5bef'
const W = 1500
const H = 860

const PERSON = { x: 60, w: 250, h: 56 }
const GROUP = { x: 620, w: 250, h: 66 }
const GOAL = { x: 1180, w: 270, h: 86 }

const PEOPLE = [
  { name: 'Paula Ortiz Cifuentes', area: 'Tecnología' },
  { name: 'Santiago Bermúdez Restrepo', area: 'Gente y Cultura' },
  { name: 'Nicolás López Escobar', area: 'Comercial' },
  { name: 'Alejandro Duarte Bermúdez', area: 'Comercial' },
  { name: 'Felipe Rodríguez Moreno', area: 'Marketing' },
  { name: 'Mariana Quintero Gómez', area: 'Marketing' },
  { name: 'Iván Navarro Cifuentes', area: 'Logística' },
  { name: 'Manuela Hernández Navarro', area: 'Legal' },
].map((p, i) => ({ ...p, y: 50 + i * 82 }))

const GROUPS = [
  { area: 'Tecnología', people: 11 },
  { area: 'Gente y Cultura', people: 3 },
  { area: 'Comercial', people: 7 },
  { area: 'Marketing', people: 11 },
  { area: 'Logística', people: 13 },
  { area: 'Legal', people: 4 },
  { area: 'Operaciones', people: 11 },
  { area: 'Finanzas', people: 9 },
].map((g, i) => ({ ...g, y: 40 + i * 98 }))

const GOALS = [
  { id: 'ingresos', title: 'Crecer los ingresos un 15 %', meta: '48,6 % del peso · avance 9,8 %', top: ['Operaciones', 'Tecnología', 'Logística'], y: 150 },
  { id: 'marca', title: 'Ser la marca preferida de los clientes', meta: '26,2 % del peso · avance 11 %', top: ['Tecnología', 'Operaciones', 'Logística'], y: 380 },
  { id: 'eficiencia', title: 'Operar con más eficiencia', meta: '23,8 % del peso · avance 8,3 %', top: ['Marketing', 'Logística', 'Finanzas'], y: 610 },
] as const

const FOCUS = PEOPLE[0]
const FOCUS_GROUP = GROUPS[0]

const curve = (x1: number, y1: number, x2: number, y2: number) => {
  const dx = (x2 - x1) / 2
  return `M${x1} ${y1} C${x1 + dx} ${y1} ${x2 - dx} ${y2} ${x2} ${y2}`
}
const groupY = (area: string) => {
  const g = GROUPS.find((x) => x.area === area)
  return g ? g.y + GROUP.h / 2 : 0
}

/** La cámara de cada momento: dónde mira y cuánto acerca. */
const SHOTS = [
  { cx: PERSON.x + PERSON.w / 2, cy: FOCUS.y + PERSON.h / 2, s: 2.6, ms: 900 },
  { cx: (PERSON.x + GROUP.x + GROUP.w) / 2, cy: (FOCUS.y + FOCUS_GROUP.y) / 2 + 40, s: 1.8, ms: 1000 },
  { cx: (GROUP.x + GOAL.x + GOAL.w) / 2, cy: 300, s: 1.35, ms: 1100 },
  { cx: W / 2, cy: H / 2, s: 1, ms: 2600 },
  { cx: W / 2, cy: H / 2, s: 1, ms: 1800 },
] as const

const camera = (shot: (typeof SHOTS)[number]) => {
  const tx = (0.5 - (shot.s * shot.cx) / W) * 100
  const ty = (0.5 - (shot.s * shot.cy) / H) * 100
  return `translate(${tx.toFixed(2)}%, ${ty.toFixed(2)}%) scale(${shot.s})`
}

/** Cuánto dura cada toma; el lienzo pasa a la siguiente al terminar. */
export const CASCADE_STEPS = SHOTS.map((shot) => shot.ms)

/** El lienzo de la cascada con su cámara: se usa en el caso y en la vista previa de la portada. */
export function CascadeCanvas({ phase, className = '' }: { phase: number; className?: string }) {
  const { reducedMotion } = useA11y()
  const shot = SHOTS[phase]
  const all = phase >= 3
  return (
    <div className={`relative overflow-hidden [container-type:inline-size] ${className}`} style={{ aspectRatio: `${W} / ${H}`, backgroundColor: '#fafbfc', backgroundImage: 'radial-gradient(rgba(22,26,44,0.12) 1px, transparent 1.2px)', backgroundSize: '16px 16px' }}>
      <div className="absolute inset-0 origin-top-left will-change-transform" style={{ transform: camera(shot), transition: reducedMotion ? 'none' : 'transform 1.1s cubic-bezier(0.65, 0, 0.35, 1)' }}>
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden="true">
          {/* Persona → grupo. */}
          {PEOPLE.map((p, i) => {
            const on = i === 0 ? phase >= 1 : all
            if (!on) return null
            return <path key={p.name} d={curve(PERSON.x + PERSON.w, p.y + PERSON.h / 2, GROUP.x, groupY(p.area))} fill="none" stroke={BLUE} strokeOpacity={0.7} strokeWidth={2.5} pathLength={1} strokeDasharray={1} className="obj-draw" style={{ animationDuration: '0.6s', animationDelay: i === 0 ? '200ms' : `${200 + i * 70}ms` }} />
          })}
          {/* Grupo → objetivo de empresa: todas las áreas aportan; las tres que más empujan, en grueso. */}
          {GOALS.flatMap((goal, gi) =>
            GROUPS.map((g, i) => {
              const strong = (goal.top as readonly string[]).includes(g.area)
              const focusLink = g.area === FOCUS_GROUP.area && strong
              const on = focusLink ? phase >= 2 : all
              if (!on) return null
              return (
                <path
                  key={`${goal.id}-${g.area}`}
                  d={curve(GROUP.x + GROUP.w, g.y + GROUP.h / 2, GOAL.x, goal.y + GOAL.h / 2)}
                  fill="none"
                  stroke={BLUE}
                  strokeOpacity={strong ? 0.75 : 0.14}
                  strokeWidth={strong ? 3 : 1.2}
                  pathLength={1}
                  strokeDasharray={1}
                  className="obj-draw"
                  style={{ animationDuration: '0.7s', animationDelay: focusLink ? '200ms' : `${700 + gi * 160 + i * 40}ms` }}
                />
              )
            }),
          )}
          {/* «Ser la marca preferida» también contribuye a «Crecer los ingresos». */}
          {all && <path d={`M${GOAL.x + GOAL.w} ${GOALS[1].y + 20} C${GOAL.x + GOAL.w + 50} ${GOALS[1].y} ${GOAL.x + GOAL.w + 50} ${GOALS[0].y + GOAL.h} ${GOAL.x + GOAL.w} ${GOALS[0].y + GOAL.h - 20}`} fill="none" stroke={BLUE} strokeWidth={2} strokeDasharray="5 5" className="animate-[ramp-in_0.6s_cubic-bezier(0.16,1,0.3,1)_both]" style={{ animationDelay: '1.4s' }} />}
        </svg>

        {PEOPLE.map((p, i) => {
          const on = i === 0 || all
          return (
            <div key={p.name} className={`absolute flex items-center gap-2 rounded-xl border bg-white px-2.5 transition-opacity duration-500 ${i === 0 ? 'border-[#0c5bef] shadow-[0_0_0_4px_rgba(12,91,239,0.15)]' : 'border-black/10 shadow-sm'}`} style={{ left: `${(PERSON.x / W) * 100}%`, top: `${(p.y / H) * 100}%`, width: `${(PERSON.w / W) * 100}%`, height: `${(PERSON.h / H) * 100}%`, opacity: on ? 1 : 0.15, transitionDelay: on && i ? `${i * 60}ms` : '0ms' }}>
              <span className="grid aspect-square h-[55%] shrink-0 place-items-center rounded-full bg-[#0c5bef]/10 text-[0.55em] font-medium text-[#0c5bef]" style={{ fontSize: '1.2cqw' }}>{p.name.split(' ').slice(0, 2).map((w) => w[0]).join('')}</span>
              <span className="min-w-0 leading-tight" style={{ fontSize: '1.2cqw' }}>
                <span className="block truncate font-medium">{p.name}</span>
                <span className="block truncate text-black/50">{p.area}</span>
              </span>
              <span className="absolute -right-[4px] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[#0c5bef]" />
            </div>
          )
        })}
        <div className={`absolute grid place-items-center rounded-xl border border-dashed border-black/20 text-black/45 transition-opacity duration-500 ${all ? 'opacity-100' : 'opacity-0'}`} style={{ left: `${(PERSON.x / W) * 100}%`, top: `${((50 + 8 * 82) / H) * 100}%`, width: `${(PERSON.w / W) * 100}%`, height: `${(PERSON.h / H) * 100}%`, fontSize: '1.2cqw' }}>
          + 72 personas más
        </div>

        {GROUPS.map((g, i) => {
          const on = i === 0 ? phase >= 1 : all
          return (
            <div key={g.area} className={`absolute rounded-xl border bg-white px-3 py-2 transition-opacity duration-500 ${i === 0 && phase >= 1 ? 'border-[#0c5bef]/60' : 'border-black/10'} shadow-sm`} style={{ left: `${(GROUP.x / W) * 100}%`, top: `${(g.y / H) * 100}%`, width: `${(GROUP.w / W) * 100}%`, height: `${(GROUP.h / H) * 100}%`, opacity: on ? 1 : 0.12, fontSize: '1.3cqw', transitionDelay: on && i ? `${300 + i * 50}ms` : '0ms' }}>
              <span className="absolute -left-[4px] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[#0c5bef]/50" />
              <span className="absolute -right-[4px] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[#0c5bef]" />
              <span className="block truncate font-medium">{g.area}</span>
              <span className="block truncate text-black/50">Área · {g.people} personas</span>
            </div>
          )
        })}

        {GOALS.map((goal, i) => {
          const on = phase >= 2 ? (all || goal.id !== 'eficiencia') : false
          return (
            <div key={goal.id} className="absolute rounded-xl border border-[#0c5bef]/30 bg-[#0c5bef] px-3 py-2.5 text-white shadow-[0_14px_30px_-12px_rgba(12,91,239,0.8)] transition-opacity duration-500" style={{ left: `${(GOAL.x / W) * 100}%`, top: `${(goal.y / H) * 100}%`, width: `${(GOAL.w / W) * 100}%`, height: `${(GOAL.h / H) * 100}%`, opacity: on ? 1 : 0.12, fontSize: '1.3cqw', transitionDelay: on ? `${200 + i * 80}ms` : '0ms' }}>
              <span className="absolute -left-[4px] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-white" />
              <span className="block font-medium leading-tight">{goal.title}</span>
              <span className="mt-1 block truncate text-white/70">{goal.meta}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function AlignmentBuilder() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const [phase, setPhase] = useState(reducedMotion ? 4 : 0)
  const [inView, setInView] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (reducedMotion || !inView) return
    const id = window.setTimeout(() => setPhase((p) => (p + 1) % SHOTS.length), SHOTS[phase].ms)
    return () => window.clearTimeout(id)
  }, [phase, inView, reducedMotion])

  const all = phase >= 3
  const counter = all ? '3 de 3 objetivos de empresa con aporte' : phase >= 2 ? '1 persona → 1 grupo → 2 objetivos' : phase >= 1 ? '1 persona → 1 grupo' : '1 persona'

  return (
    <div ref={ref} data-reveal="device" className="relative overflow-hidden rounded-3xl bg-[#0b0d16] p-4 md:p-8">
      <span className="pointer-events-none absolute -left-24 top-1/3 h-96 w-96 rounded-full bg-[#0c5bef] opacity-25 blur-3xl" aria-hidden="true" />
      <div className="relative overflow-hidden rounded-2xl bg-white text-[#161a2c] shadow-[0_50px_100px_-30px_rgba(0,0,0,0.85)]">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-black/[0.06] px-5 py-4">
          <div>
            <p className="text-[15px] font-medium">Mapa de alineación</p>
            <p className="mt-0.5 text-[12px] text-black/55">
              <span key={counter} className="font-medium tabular-nums text-[#0c5bef] animate-[ramp-in_0.4s_cubic-bezier(0.16,1,0.3,1)_both]">{counter}</span> · La contribución de cada persona y de qué grupos le llega.
            </p>
          </div>
          <span className="flex rounded-lg bg-black/[0.04] p-0.5 text-[12px]">
            {['Objetivos', 'Agrupación', 'Colaboradores'].map((v) => (
              <span key={v} className={`rounded-md px-3 py-1 ${v === 'Colaboradores' ? 'bg-white shadow-sm' : 'text-black/50'}`}>{v}</span>
            ))}
          </span>
        </div>

        <CascadeCanvas phase={phase} />

        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-black/[0.06] px-5 py-3 text-[11px] text-black/50">
          <span className="flex items-center gap-1.5"><span className="h-0.5 w-5 rounded bg-[#0c5bef]" /> {t({ es: 'Las tres áreas que más empujan', en: 'The three areas that push most' })}</span>
          <span className="flex items-center gap-1.5"><span className="h-px w-5 bg-[#0c5bef]/30" /> {t({ es: 'El resto de las áreas', en: 'The other areas' })}</span>
          <span className="flex items-center gap-1.5"><span className="h-0 w-5 border-t-2 border-dashed border-[#0c5bef]" /> {t({ es: 'Objetivo que aporta a otro', en: 'Goal feeding another' })}</span>
        </div>
      </div>
    </div>
  )
}

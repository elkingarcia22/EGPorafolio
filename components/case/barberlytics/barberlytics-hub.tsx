'use client'

import Image from 'next/image'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ToneSection } from '@/components/ui/tone-section'
import { TransitionLink } from '@/components/transition/page-transition'
import { NextProject } from '@/components/case/next-project'
import { NeuralBackdrop } from '@/components/home/neural-backdrop'
import { backdropQuiet } from '@/components/home/backdrop-journey'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'
import { OVERVIEW } from '@/lib/content/cases/barberlytics/overview'
import type { Project } from '@/lib/content/projects'
import { ClipperHubCard } from './clipper/clipper-hub-card'
import { LiveCalendarCard } from './platform/live-calendar'
import { useReveal } from './use-reveal'

interface HubProject {
  slug: string
  index: string
  title: L
  what: L
  body: L
  stat: L
  ready: boolean
  visual: React.ReactNode
}

const IMG = '/cases/barberlytics'

/** Tres temas de la documentación en abanico: un sistema, varias identidades. */
function ThemaFan() {
  const fan = [
    { id: 'thema', cls: 'left-[5%] top-[24%] z-10', rest: 'rotateY(26deg) rotateZ(-6deg)', open: 'rotateY(18deg) rotateZ(-9deg) translateX(-8%)' },
    { id: 'emerald', cls: 'right-[5%] top-[24%] z-10', rest: 'rotateY(-26deg) rotateZ(6deg)', open: 'rotateY(-18deg) rotateZ(9deg) translateX(8%)' },
    { id: 'premium', cls: 'left-1/2 top-[15%] z-20 -translate-x-1/2', rest: 'translateZ(40px)', open: 'translateZ(60px) translateY(-4%)' },
  ]
  const swatches = ['#D9B36A', '#0C5BEF', '#059669', '#F87171', '#7C3AED', '#7FD8AF']
  return (
    <div className="relative h-full bg-[radial-gradient(circle_at_50%_40%,rgba(217,179,106,0.28),transparent_62%)] [perspective:1400px]">
      {fan.map((f) => (
        <div key={f.id} className={`absolute w-[56%] ${f.cls}`}>
          <div
            className="overflow-hidden rounded-lg shadow-[0_30px_60px_-25px_rgba(0,0,0,0.9)] ring-1 ring-white/10 transition-transform duration-700 ease-expo [transform:var(--rest)] group-hover:[transform:var(--open)]"
            style={{ '--rest': f.rest, '--open': f.open } as React.CSSProperties}
          >
            <Image src={`${IMG}/theme-${f.id}.webp`} width={1400} height={817} alt="" sizes="(min-width: 768px) 25vw, 55vw" className="block h-auto w-full" />
          </div>
        </div>
      ))}
      <div className="absolute bottom-[6%] left-1/2 z-30 flex -translate-x-1/2 gap-2 rounded-full bg-black/50 px-3 py-2 backdrop-blur">
        {swatches.map((c) => <span key={c} className="h-3.5 w-3.5 rounded-full ring-1 ring-white/20" style={{ background: c }} />)}
      </div>
    </div>
  )
}

const PROJECTS: readonly HubProject[] = [
  {
    slug: 'thema',
    index: '01',
    title: { es: 'Thema', en: 'Thema' },
    what: { es: 'Sistema de diseño', en: 'Design system' },
    body: { es: 'De un legado con cuatro fuentes de tokens a 218 componentes, 10 temas y reglas que la IA también sigue.', en: 'From a legacy with four token sources to 218 components, 10 themes and rules the AI follows too.' },
    stat: { es: '218 componentes · 22 familias', en: '218 components · 22 families' },
    ready: true,
    visual: <ThemaFan />,
  },
  {
    slug: 'reserva',
    index: '02',
    title: { es: 'Reserva en línea', en: 'Online booking' },
    what: { es: 'Booking flow', en: 'Booking flow' },
    body: { es: 'Quince productos comparados, cuatro versiones y un flujo que reserva «lo de siempre» en un toque.', en: 'Fifteen products compared, four versions and a flow that books “the usual” in one tap.' },
    stat: { es: '4 versiones · demo en vivo', en: '4 versions · live demo' },
    ready: true,
    visual: (
      <div className="flex h-full items-end justify-center gap-4 bg-[radial-gradient(circle_at_50%_120%,rgba(217,179,106,0.35),transparent_60%)] pt-8">
        {['booking-return', 'clipper-thread'].map((name, i) => (
          <div key={name} className={`w-[38%] max-w-[180px] overflow-hidden rounded-t-[26px] bg-[#0b0c0e] p-1.5 pb-0 ${i ? 'translate-y-6' : ''}`}>
            <Image src={`${IMG}/${name}.webp`} width={780} height={1688} alt="" sizes="180px" className="block h-auto w-full rounded-t-[20px]" />
          </div>
        ))}
      </div>
    ),
  },
  {
    slug: 'plataforma',
    index: '03',
    title: { es: 'Plataforma', en: 'Platform' },
    what: { es: 'El calendario, en el centro', en: 'The calendar, at the center' },
    body: { es: 'Un calendario que se adapta a la barbería y lleva cada cita de agendada a cobrada sin salir de la rejilla.', en: 'A calendar that adapts to the shop and takes every visit from booked to paid without leaving the grid.' },
    stat: { es: '22 calendarios comparados · 6 etapas en vivo', en: '22 calendars compared · 6 live stages' },
    ready: true,
    visual: <LiveCalendarCard />,
  },
  {
    slug: 'clipper',
    index: '04',
    title: { es: 'Clipper', en: 'Clipper' },
    what: { es: 'La IA y su identidad', en: 'The AI and its identity' },
    body: { es: 'El poste de barbería hecho esfera: un asistente que consulta antes de responder y propone antes de actuar.', en: 'The barber pole turned sphere: an assistant that looks things up before answering and proposes before acting.' },
    stat: { es: '18 herramientas · 60 evaluaciones', en: '18 tools · 60 evaluations' },
    ready: true,
    visual: <ClipperHubCard />,
  },
]

/** Cada cuánto la señal salta del centro al siguiente proyecto mientras pasan solos (ms) */
const PULSE_MS = 2600

type Pt = { x: number; y: number }
/** Fibra del centro a un proyecto: sale horizontal y entra recogiéndose */
const fiber = (a: Pt, b: Pt) => `M${a.x} ${a.y} C${(a.x + b.x) / 2} ${a.y} ${(a.x + b.x) / 2} ${b.y} ${b.x} ${b.y}`

function ProjectNode({ project, lit, nodeRef }: { project: HubProject; lit: boolean; nodeRef: (el: HTMLDivElement | null) => void }) {
  const { t } = useLocale()
  return (
    <div ref={nodeRef}>
    <TransitionLink
      href={`/proyectos/barberlytics/${project.slug}`}
      transitionLabel={t(project.title)}
      data-cursor={t(COPY.work.open)}
      className="group block outline-none"
    >
      {/* La vista del proyecto, sin marco: crece y se enciende cuando la señal llega */}
      <div data-hub-visual className={`relative aspect-[16/10] overflow-hidden rounded-2xl bg-[#0b0c0e] transition-[transform,box-shadow] duration-700 ease-expo ${lit ? 'scale-[1.02] shadow-[0_0_0_1px_rgb(var(--signal)/0.5),0_30px_80px_-30px_rgb(var(--signal)/0.6)]' : 'shadow-[0_30px_70px_-35px_rgba(0,0,0,0.9)] group-hover:scale-[1.02]'}`}>
        <div className="h-full w-full">{project.visual}</div>
      </div>
      <div className="mt-4 flex items-end justify-between gap-4">
        <div>
          <p className={`font-mono text-[10px] uppercase tracking-[0.16em] transition-colors duration-500 ${lit ? 'text-signal' : 'text-paper/45'}`}>{project.index} · {t(project.what)}</p>
          <p className="mt-1.5 text-[clamp(1.5rem,1.1rem+1.2vw,2.2rem)] font-light leading-tight tracking-tight">{t(project.title)}</p>
          <p className="mt-1 text-[12px] text-paper/55">{t(project.stat)}</p>
        </div>
        <span aria-hidden="true" className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border transition-[transform,border-color,background-color] duration-500 ease-expo group-hover:rotate-45 ${lit ? 'border-signal/60 bg-signal/10' : 'border-white/15'}`}>↗</span>
      </div>
    </TransitionLink>
    </div>
  )
}

/**
 * Portada de Barberlytics como una red: el producto en el centro y sus cuatro
 * proyectos alrededor, unidos por fibras. La señal salta del centro a cada
 * uno, por turnos; cada proyecto lleva a su caso.
 */
export function BarberlyticsHub({ next }: { next: Project }) {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const ref = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const hubRef = useRef<HTMLDivElement>(null)
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([])
  const [paths, setPaths] = useState<{ d: string[]; w: number; h: number }>({ d: [], w: 1, h: 1 })
  const [lit, setLit] = useState(0)
  const [inView, setInView] = useState(false)
  useReveal(ref, reducedMotion)

  // El fondo de red, muy calmado (como en los casos)
  useEffect(() => {
    backdropQuiet.set('case', 1)
    return () => backdropQuiet.set('case', 0)
  }, [])

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: '0px 0px -25% 0px' })
    io.observe(stage)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!inView || reducedMotion) return
    const id = window.setTimeout(() => setLit((i) => (i + 1) % PROJECTS.length), PULSE_MS)
    return () => window.clearTimeout(id)
  }, [inView, reducedMotion, lit])

  // Las fibras se miden sobre las piezas reales (en teléfono van apiladas y no se dibujan)
  useLayoutEffect(() => {
    const stage = stageRef.current
    const hub = hubRef.current
    if (!stage || !hub) return
    const measure = () => {
      const box = stage.getBoundingClientRect()
      const h = hub.getBoundingClientRect()
      const c = { x: h.left + h.width / 2 - box.left, y: h.top + h.height / 2 - box.top }
      const d = nodeRefs.current.map((el) => {
        const r = el?.querySelector('[data-hub-visual]')?.getBoundingClientRect()
        if (!r) return ''
        const leftSide = r.left + r.width / 2 < h.left
        const end = { x: (leftSide ? r.right : r.left) - box.left, y: r.top + r.height / 2 - box.top }
        const start = { x: c.x + (leftSide ? -h.width / 2 : h.width / 2), y: c.y }
        return fiber(start, end)
      })
      setPaths({ d, w: box.width, h: box.height })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(stage)
    return () => ro.disconnect()
  }, [])

  const node = (i: number) => (
    <ProjectNode
      project={PROJECTS[i]}
      lit={i === lit}
      nodeRef={(el) => {
        nodeRefs.current[i] = el
      }}
    />
  )

  return (
    <article ref={ref} className="overflow-x-clip">
      <NeuralBackdrop />
      <ToneSection tone="dark" className="relative px-[var(--gutter)] pb-[clamp(4rem,3rem+5vw,8rem)] pt-32">
        <div className="mb-14 flex items-center justify-between">
          <TransitionLink href="/#work" transitionLabel="EG" className="mono-label opacity-60 hover:opacity-100">
            ← {t(COPY.case.back)}
          </TransitionLink>
          <span className="mono-label opacity-60">{t(OVERVIEW.eyebrow)}</span>
        </div>

        {/* Centro: el título y la frase; a un lado, los datos del producto en columna */}
        <div className="grid gap-12 lg:grid-cols-[minmax(0,13rem)_minmax(0,1fr)_minmax(0,13rem)] lg:items-center">
          <dl className="order-last grid grid-cols-2 gap-x-6 gap-y-5 border-t border-fg/15 pt-8 lg:order-first lg:grid-cols-1 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
            {OVERVIEW.meta.map((m) => (
              <div key={m.label.es}>
                <dt className="mono-label mb-1 opacity-50">{t(m.label)}</dt>
                <dd className="text-[13px] leading-snug">{t(m.value)}</dd>
              </div>
            ))}
          </dl>
          <div className="flex flex-col items-center text-center">
            <h1 className="text-[clamp(3.2rem,1rem+8vw,10rem)] font-light leading-[0.9] tracking-tight">{t(OVERVIEW.title)}</h1>
            <p className="mt-6 max-w-[56ch] text-balance text-lg leading-relaxed opacity-80">{t(OVERVIEW.tagline)}</p>
          </div>
          <span aria-hidden="true" className="hidden lg:block" />
        </div>

        {/* La red: el producto en el centro y sus cuatro proyectos alrededor */}
        <p data-reveal className="mono-label mt-24 text-center opacity-60">{t({ es: 'Cuatro proyectos de un mismo producto · elige uno', en: 'Four projects, one product · pick one' })}</p>
        <div ref={stageRef} className="relative mx-auto mt-10 max-w-[1240px]">
          <svg aria-hidden="true" className="pointer-events-none absolute inset-0 hidden h-full w-full overflow-visible lg:block" viewBox={`0 0 ${paths.w} ${paths.h}`} preserveAspectRatio="none">
            <defs>
              <linearGradient id="hub-fiber" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="rgb(var(--signal))" />
                <stop offset="1" stopColor="rgb(var(--spark))" />
              </linearGradient>
            </defs>
            {paths.d.map((d, i) => (
              <g key={i}>
                <path d={d} fill="none" stroke="white" strokeOpacity={0.1} />
                <path d={d} fill="none" stroke="url(#hub-fiber)" strokeWidth={1.6} strokeOpacity={i === lit ? 1 : 0.25} style={{ transition: 'stroke-opacity .6s', filter: i === lit ? 'drop-shadow(0 0 5px rgb(var(--signal) / 0.7))' : 'none' }} />
                {i === lit && !reducedMotion && (
                  <path key={`p-${lit}`} d={d} fill="none" stroke="white" strokeWidth={2.4} strokeLinecap="round" pathLength={1} strokeDasharray="0.06 0.94" className="hub-pulse" style={{ filter: 'drop-shadow(0 0 5px white)' }} />
                )}
              </g>
            ))}
          </svg>

          <div className="relative grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-16">
            <div className="flex flex-col gap-14">
              {node(0)}
              {node(2)}
            </div>
            {/* El producto: la neurona del centro, con su marca y su halo */}
            <div ref={hubRef} className="relative mx-auto grid h-28 w-28 place-items-center">
              <span aria-hidden="true" className="absolute inset-[-35%] rounded-full bg-[radial-gradient(circle,rgb(var(--signal)/0.4),transparent_70%)] blur-xl" />
              <span aria-hidden="true" className="absolute inset-0 rounded-full border border-signal/50 animate-[nav-node-ping_2.6s_cubic-bezier(0,0,.2,1)_infinite]" />
              <span className="relative grid h-24 w-24 place-items-center rounded-full border border-white/15 bg-[rgb(var(--void))] shadow-[0_0_0_6px_rgb(var(--signal)/0.12),0_0_40px_6px_rgb(var(--signal)/0.35)]">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-paper/80">{t({ es: 'Producto', en: 'Product' })}</span>
              </span>
            </div>
            <div className="flex flex-col gap-14">
              {node(1)}
              {node(3)}
            </div>
          </div>
        </div>

        <p data-reveal className="mx-auto mt-20 max-w-[60ch] text-balance text-center text-sm leading-relaxed text-paper/55">{t(OVERVIEW.honesty)}</p>
      </ToneSection>
      <NextProject project={next} />
      <style>{'.hub-pulse { stroke-dashoffset: 0.06; animation: hub-pulse 1.1s cubic-bezier(.45,0,.25,1) both; } @keyframes hub-pulse { from { stroke-dashoffset: 0.06; opacity: 1; } 92% { opacity: 1; } to { stroke-dashoffset: -0.94; opacity: 0; } }'}</style>
    </article>
  )
}

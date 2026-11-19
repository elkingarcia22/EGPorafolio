'use client'

import { useEffect, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { AGREEMENT, CLOSING, OUTLINE, PAGE_CLARITY, PAGE_NPS, SURVEY, WELCOME } from '@/lib/content/cases/encuestas/answer-preview'
import { UBITS_BLUE } from './shared'

type Page = 'welcome' | 'clarity' | 'nps' | 'closing'
interface Frame {
  page: Page
  likert?: readonly (number | null)[]
  nps?: number | null
  typed?: number
  /** El botón principal se ve presionado justo antes de pasar de página. */
  press?: boolean
  ms: number
}

const FOLLOW_UP_ANSWER = 'El equipo con el que trabajo y lo que aprendo cada semana.'
const TYPE_STEPS = 8
const FRAMES: readonly Frame[] = [
  { page: 'welcome', ms: 2600 },
  { page: 'welcome', press: true, ms: 380 },
  { page: 'clarity', likert: [null, null, null], ms: 1000 },
  { page: 'clarity', likert: [4, null, null], ms: 900 },
  { page: 'clarity', likert: [4, 5, null], ms: 900 },
  { page: 'clarity', likert: [4, 5, 3], ms: 1200 },
  { page: 'clarity', likert: [4, 5, 3], press: true, ms: 380 },
  { page: 'nps', nps: null, ms: 1300 },
  { page: 'nps', nps: 9, ms: 900 },
  ...Array.from({ length: TYPE_STEPS }, (_, i): Frame => ({ page: 'nps', nps: 9, typed: (i + 1) / TYPE_STEPS, ms: 170 })),
  { page: 'nps', nps: 9, typed: 1, ms: 700 },
  { page: 'nps', nps: 9, typed: 1, press: true, ms: 380 },
  { page: 'closing', ms: 0 },
]
const LAST = FRAMES.length - 1
const PAGE_NUMBER: Record<Page, number> = { welcome: 1, clarity: PAGE_CLARITY.page, nps: PAGE_NPS.page, closing: SURVEY.pages }

/** Lo respondido en esta prueba: en la demostración se saltan las páginas 3 a 16 y la 18, como si ya estuvieran listas. */
function answeredOf(f: Frame): number {
  if (f.page === 'welcome') return 0
  if (f.page === 'clarity') return (f.likert ?? []).filter((v) => v !== null).length
  if (f.page === 'nps') return SURVEY.questions - 1 - 5 + (f.nps !== null && f.nps !== undefined ? 1 : 0)
  return SURVEY.questions
}

const Icon = {
  layers: 'M12 3 3 8l9 5 9-5-9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5',
  list: 'M9 6h11M9 12h11M9 18h11M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2',
  clock: 'M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  calendar: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
  check: 'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0ZM8 12l3 3 5-6',
}
function Svg({ d, className = 'h-3.5 w-3.5' }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d={d} />
    </svg>
  )
}

/** La lluvia de confeti del producto (`LluviaConfeti`): canvas, balanceo, giro y gravedad que crece; aquí cae dentro de la ventana. */
function Rain() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    ctx.scale(dpr, dpr)
    const colors = [UBITS_BLUE, '#1f9d55', '#f59e0b', '#e5484d', '#0ea5e9', '#7c3aed']
    const pieces = Array.from({ length: 110 }, () => ({
      x: Math.random() * w,
      y: -20 - Math.random() * h * 0.6,
      vx: Math.random() * 5 - 2.5,
      vy: Math.random() * 3 + 2.5,
      phase: Math.random() * Math.PI * 2,
      step: Math.random() * 0.09 + 0.04,
      side: Math.random() * 4 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      spin: Math.random() * 360,
      vSpin: Math.random() * 8 - 4,
    }))
    const frames = Math.round(3600 / 16)
    let frame = 0
    let raf = 0
    const paint = () => {
      ctx.clearRect(0, 0, w, h)
      for (const p of pieces) {
        p.phase += p.step
        p.y += p.vy + frame * 0.01
        p.x += p.vx + Math.sin(p.phase) * 0.9
        p.spin += p.vSpin
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate((p.spin * Math.PI) / 180)
        ctx.fillStyle = p.color
        ctx.globalAlpha = Math.max(0, 1 - frame / frames)
        ctx.fillRect(-p.side / 2, -p.side, p.side, p.side * 2.2)
        ctx.restore()
      }
      frame += 1
      if (frame < frames) raf = requestAnimationFrame(paint)
    }
    raf = requestAnimationFrame(paint)
    return () => cancelAnimationFrame(raf)
  }, [])
  return <canvas ref={ref} className="pointer-events-none absolute inset-0 z-30 h-full w-full" aria-hidden="true" />
}

function Welcome() {
  return (
    <div className="encf-page space-y-3">
      <div className="flex gap-1.5">
        <span className="rounded-md bg-[#ecf1fa] px-1.5 py-0.5 text-[10px] font-medium text-[#0c5bef]">{SURVEY.kind}</span>
        <span className="flex items-center gap-1 rounded-md border border-black/10 px-1.5 py-0.5 text-[10px]"><Svg d={Icon.eye} className="h-3 w-3" />{SURVEY.visibility}</span>
      </div>
      <p className="text-[19px] font-semibold leading-tight">{SURVEY.name}</p>
      <p className="text-[12px] leading-snug text-[#5c646f]">{SURVEY.description}</p>
      <p className="flex flex-wrap gap-x-4 text-[11px] text-[#5c646f]">
        <span className="flex items-center gap-1"><Svg d={Icon.calendar} />Abre el {SURVEY.opens}</span>
        <span className="flex items-center gap-1"><Svg d={Icon.clock} />Cierra el {SURVEY.closes}</span>
      </p>
      <div className="grid grid-cols-2 gap-3 rounded-xl border border-black/[0.07] bg-white p-3 sm:grid-cols-4">
        {[
          [Icon.layers, String(SURVEY.sections), 'Secciones'],
          [Icon.list, String(SURVEY.questions), 'Preguntas'],
          [Icon.clock, `${SURVEY.minutes} min`, 'Tiempo estimado'],
          [Icon.eye, SURVEY.visibility, 'Respuestas con nombre'],
        ].map(([d, v, l]) => (
          <div key={l}>
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#ecf1fa] text-[#0c5bef]"><Svg d={d} /></span>
            <p className="mt-1.5 text-[13px] font-bold">{v}</p>
            <p className="text-[10px] text-[#5c646f]">{l}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-black/[0.07] bg-[#f6f7fb]">
        <p className="px-3 pt-2 text-[11px] font-semibold">Antes de empezar</p>
        <div className="m-1 space-y-1.5 rounded-lg bg-white p-3 text-[11px] leading-snug">
          {WELCOME.map((p) => (
            <p key={p.text}>{p.strong ? <b>{p.text}</b> : p.text}{p.rest}</p>
          ))}
        </div>
      </div>
    </div>
  )
}

function Cover({ trail, numbering, title, description, count, minutes }: { trail: string; numbering: string; title: string; description?: string; count: number; minutes: number }) {
  return (
    <div className="rounded-t-xl border border-b-0 border-black/[0.07] bg-[#f6f7fb] px-3 pb-2.5 pt-2">
      <p className="flex items-center gap-1.5 text-[10px] text-[#5c646f]">{trail} › <span className="rounded-full bg-[#ecf1fa] px-1.5 text-[#0c5bef]">Subsección {numbering}</span></p>
      <p className="mt-1 text-[15px] font-semibold">{title}</p>
      {description && <p className="text-[11px] text-[#5c646f]">{description}</p>}
      <p className="mt-1 flex gap-3 text-[10px] text-[#5c646f]">
        <span className="flex items-center gap-1"><Svg d={Icon.list} className="h-3 w-3" />{count} {count === 1 ? 'pregunta' : 'preguntas'}</span>
        <span className="flex items-center gap-1"><Svg d={Icon.clock} className="h-3 w-3" />{minutes} min aprox.</span>
      </p>
    </div>
  )
}

function QuestionCard({ n, statement, answered, children }: { n: number; statement: string; answered: boolean; children: React.ReactNode }) {
  return (
    <div className="border border-t-0 border-black/[0.07] bg-white p-3 first-of-type:border-t">
      <p className="flex items-start gap-2 text-[12px] font-semibold leading-snug">
        <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] tabular-nums transition-colors duration-300 ${answered ? 'bg-[#0c5bef] text-white' : 'bg-[#ecf1fa] text-[#303a47]'}`}>{n}</span>
        {statement}
      </p>
      <div className="mt-2">{children}</div>
    </div>
  )
}

function Clarity({ likert }: { likert: readonly (number | null)[] }) {
  return (
    <div className="encf-page">
      <p className="mb-2 text-[10px] text-[#5c646f]">{PAGE_CLARITY.trail} / <b className="text-[#303a47]">Subsección {PAGE_CLARITY.numbering} · {PAGE_CLARITY.title}</b></p>
      <Cover trail={PAGE_CLARITY.trail} numbering={PAGE_CLARITY.numbering} title={PAGE_CLARITY.title} description={PAGE_CLARITY.description} count={3} minutes={PAGE_CLARITY.minutes} />
      <div className="overflow-hidden rounded-b-xl">
        {PAGE_CLARITY.questions.map((q, i) => (
          <QuestionCard key={q} n={i + 1} statement={q} answered={likert[i] !== null}>
            {/* La barra Likert del producto: cinco segmentos pegados; el elegido toma el color de marca. */}
            <div className="grid grid-cols-5 overflow-hidden rounded-lg border border-black/10">
              {AGREEMENT.map((label, s) => {
                const on = likert[i] === s + 1
                return (
                  <span key={label} className={`flex min-h-[2.4rem] items-center justify-center border-l border-black/10 px-1 text-center text-[9.5px] leading-tight transition-colors duration-300 first:border-l-0 ${on ? 'encf-tap bg-[#0c5bef]/10 font-semibold text-[#0c5bef] ring-1 ring-inset ring-[#0c5bef]' : ''}`}>
                    {label}
                  </span>
                )
              })}
            </div>
          </QuestionCard>
        ))}
      </div>
    </div>
  )
}

function Nps({ nps, typed = 0 }: { nps: number | null; typed?: number }) {
  const prompt = nps === null ? null : nps <= 6 ? PAGE_NPS.followUps.detractors : nps <= 8 ? PAGE_NPS.followUps.neutrals : PAGE_NPS.followUps.promoters
  return (
    <div className="encf-page">
      <p className="mb-2 text-[10px] text-[#5c646f]">{PAGE_NPS.trail} / <b className="text-[#303a47]">Subsección {PAGE_NPS.numbering} · {PAGE_NPS.title}</b></p>
      <Cover trail={PAGE_NPS.trail} numbering={PAGE_NPS.numbering} title={PAGE_NPS.title} count={1} minutes={PAGE_NPS.minutes} />
      <div className="overflow-hidden rounded-b-xl">
        <QuestionCard n={1} statement={PAGE_NPS.statement} answered={nps !== null}>
          <div className="grid grid-cols-11 gap-1">
            {Array.from({ length: 11 }, (_, i) => (
              <span key={i} className={`flex h-8 items-center justify-center rounded-md border text-[11px] tabular-nums transition-colors duration-300 ${nps === i ? 'encf-tap border-[#0c5bef] bg-[#0c5bef]/10 font-semibold text-[#0c5bef]' : 'border-black/10'}`}>{i}</span>
            ))}
          </div>
          <p className="mt-1 flex justify-between text-[9.5px] text-[#5c646f]"><span>{PAGE_NPS.minLabel}</span><span>{PAGE_NPS.maxLabel}</span></p>
          {prompt && (
            <div className="enc-fade mt-3">
              <p className="text-[11px] font-medium">{prompt}</p>
              <p className="mt-1 min-h-[3.4rem] rounded-lg border border-black/15 bg-white p-2 text-[11px] text-[#303a47]">
                {typed > 0 ? FOLLOW_UP_ANSWER.slice(0, Math.round(FOLLOW_UP_ANSWER.length * typed)) : <span className="text-[#979ba3]">Escribe tu respuesta</span>}
                {typed > 0 && typed < 1 && <span className="ml-px inline-block h-3 w-px animate-pulse bg-[#303a47] align-middle" />}
              </p>
            </div>
          )}
        </QuestionCard>
      </div>
    </div>
  )
}

function Closing({ onRestart }: { onRestart: () => void }) {
  return (
    <div className="encf-page flex flex-col items-center gap-3 py-2 text-center">
      <span className="encf-pop flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e2f4ea] text-[#1f9d55]"><Svg d={Icon.check} className="h-6 w-6" /></span>
      <p className="text-[19px] font-semibold">Respuestas enviadas</p>
      <p className="-mt-2 text-[11px] text-[#5c646f]">Esto es lo que verá el participante al terminar.</p>
      <div className="w-full space-y-1.5 rounded-xl border border-black/[0.07] bg-white p-3 text-left text-[11px] leading-snug">
        {CLOSING.map((p) => <p key={p.text}>{p.strong ? <b>{p.text}</b> : p.text}</p>)}
      </div>
      <div className="grid w-full grid-cols-3 divide-x divide-black/10 rounded-xl border border-black/[0.07] bg-white py-2 text-left">
        {[[`${SURVEY.questions}/${SURVEY.questions}`, 'Respondidas en esta prueba'], [String(SURVEY.sections), 'Secciones'], [`${SURVEY.minutes} min`, 'Tiempo estimado']].map(([v, l]) => (
          <div key={l} className="px-3"><p className="text-[13px] font-bold tabular-nums">{v}</p><p className="text-[10px] text-[#5c646f]">{l}</p></div>
        ))}
      </div>
      <button type="button" onClick={onRestart} className="flex items-center gap-1.5 rounded-lg border border-black/15 bg-white px-3 py-1.5 text-[11px] font-medium hover:bg-[#f6f7fb]">↺ Volver a empezar la vista previa</button>
    </div>
  )
}

/** «Tu avance»: lo respondido y el índice, con la página actual resaltada. */
function Progress({ answered, page }: { answered: number; page: Page }) {
  // Cuánto va de cada sección: la página 1.1 cuenta sus respuestas; en el 7.1 las secciones 1 a 6 ya están completas.
  const done = (n: string, total: number): number => {
    if (page === 'closing') return total
    if (page === 'clarity') return n === '1' || n === '1.1' ? Math.min(answered, total) : 0
    if (page === 'nps') return n === '7' || n === '7.1' ? (answered > SURVEY.questions - 6 ? 1 : 0) : n === '7.2' ? 0 : total
    return 0
  }
  return (
    <aside className="hidden w-[13.5rem] shrink-0 rounded-xl border border-black/[0.07] bg-[#f6f7fb] md:block">
      <p className="px-3 pt-2 text-[11px] font-semibold">Tu avance</p>
      <div className="m-1 rounded-lg bg-white p-3">
        <p className="text-[12px] font-semibold leading-tight">{SURVEY.name}</p>
        <span className="mt-1 inline-block rounded bg-[#ecf1fa] px-1 text-[9px]">{SURVEY.kind}</span>
        <p className="mt-2 flex justify-between text-[10px]"><span className="font-medium">Preguntas respondidas</span><span className="tabular-nums text-[#5c646f]">{answered} de {SURVEY.questions}</span></p>
        <span className="mt-1 block h-1 overflow-hidden rounded-full bg-[#ecf1fa]"><span className="block h-full rounded-full bg-[#0c5bef] transition-[width] duration-700" style={{ width: `${(answered / SURVEY.questions) * 100}%` }} /></span>
        <p className="mt-3 font-mono text-[8.5px] uppercase tracking-wider text-[#979ba3]">Contenido</p>
        <ul className="mt-1 space-y-0.5 text-[10px]">
          <li className={`rounded px-1.5 py-0.5 ${page === 'welcome' ? 'bg-[#ecf1fa] font-medium' : ''}`}>Bienvenida</li>
          {OUTLINE.map((s) => (
            <li key={s.n}>
              <p className="flex justify-between gap-2 px-1.5 py-0.5"><span className="truncate font-medium">{s.n} {s.title}</span><span className="tabular-nums text-[#979ba3]">{done(s.n, s.total)}/{s.total}</span></p>
              {s.subs && ((s.n === '1' && page === 'clarity') || (s.n === '7' && page === 'nps')) && s.subs.map((c) => (
                <p key={c.n} className={`ml-2 flex justify-between gap-2 rounded px-1.5 py-0.5 text-[#5c646f] ${(c.n === '1.1' && page === 'clarity') || (c.n === '7.1' && page === 'nps') ? 'bg-[#ecf1fa] text-[#303a47]' : ''}`}>
                  <span className="truncate">{c.n} {c.title}</span><span className="tabular-nums">{done(c.n, c.total)}/{c.total}</span>
                </p>
              ))}
            </li>
          ))}
          <li className={`rounded px-1.5 py-0.5 ${page === 'closing' ? 'bg-[#ecf1fa] font-medium' : ''}`}>Cierre</li>
        </ul>
      </div>
    </aside>
  )
}

/** Momento 4: la vista previa real del colaborador, respondida sola de la bienvenida al cierre con confeti. */
export function PhoneAnswer() {
  const { reducedMotion } = useA11y()
  const box = useRef<HTMLDivElement>(null)
  const [i, setI] = useState(reducedMotion ? LAST : 0)
  const [run, setRun] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = box.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.4 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (reducedMotion || !visible || i >= LAST) return
    const id = window.setTimeout(() => setI((v) => v + 1), FRAMES[i].ms)
    return () => window.clearTimeout(id)
  }, [i, visible, reducedMotion, run])

  const f = FRAMES[i]
  const answered = answeredOf(f)
  const restart = () => {
    setI(0)
    setRun((r) => r + 1)
  }
  const cta = f.page === 'welcome' ? 'Comenzar encuesta' : f.page === 'nps' ? 'Continuar' : f.page === 'closing' ? 'Cerrar vista previa' : 'Continuar'

  return (
    <div ref={box} className="relative overflow-hidden rounded-2xl bg-[#e9edf5] p-2 shadow-[0_40px_90px_-40px_rgba(10,11,13,0.55)] ring-1 ring-black/10 sm:p-4">
      <div className="relative overflow-hidden rounded-xl bg-white text-[#303a47] shadow-lg">
        <div className="flex items-start justify-between border-b border-black/[0.07] px-4 py-2.5">
          <div>
            <p className="text-[13px] font-semibold">Vista previa</p>
            <p className="text-[10px] text-[#5c646f]">{SURVEY.name}</p>
          </div>
          <p className="flex items-center gap-2 text-[10px] font-medium text-[#5c646f]">
            <span key={f.page} className="enc-fade tabular-nums">Pág. {PAGE_NUMBER[f.page]} de {SURVEY.pages}</span>
            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-black/10">×</span>
          </p>
        </div>
        <div className="flex h-[30rem] gap-3 bg-[linear-gradient(180deg,#f3f6fd,#fff_40%)] p-3 sm:h-[32rem] sm:p-4">
          <div className="flex min-w-0 flex-1 flex-col">
            <div key={`${f.page}-${run}`} className="min-h-0 flex-1 overflow-hidden [mask-image:linear-gradient(180deg,#000_88%,transparent)]">
              {f.page === 'welcome' && <Welcome />}
              {f.page === 'clarity' && <Clarity likert={f.likert ?? [null, null, null]} />}
              {f.page === 'nps' && <Nps nps={f.nps ?? null} typed={f.typed} />}
              {f.page === 'closing' && <Closing onRestart={restart} />}
            </div>
            {f.page !== 'closing' && (
              <div className="flex shrink-0 items-center justify-between pt-3">
                <span className={`rounded-lg border border-black/15 px-3 py-1.5 text-[11px] ${f.page === 'welcome' ? 'invisible' : ''}`}>‹ Volver</span>
                <span className={`rounded-lg px-3 py-1.5 text-[11px] font-medium text-white transition-transform duration-150 ${f.press ? 'scale-95' : ''}`} style={{ background: UBITS_BLUE }}>{cta} ›</span>
              </div>
            )}
          </div>
          <Progress answered={answered} page={f.page} />
        </div>
        {f.page === 'closing' && !reducedMotion && <Rain key={run} />}
      </div>
      {f.page === 'nps' && f.nps === null && (
        <p className="enc-fade absolute left-1/2 top-[3.6rem] z-20 -translate-x-1/2 rounded-full bg-[#303a47] px-2.5 py-1 text-[10px] text-white">Demostración: de la página 2 salta a la 17</p>
      )}
    </div>
  )
}

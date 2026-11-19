'use client'

import { useEffect, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { CLOSING, PAGE_NPS, SURVEY } from '@/lib/content/cases/encuestas/answer-preview'
import { UBITS_BLUE } from './shared'

type Page = 'nps' | 'closing'
interface Frame {
  page: Page
  nps?: number | null
  typed?: number
  /** El botón principal se ve presionado justo antes de pasar de página. */
  press?: boolean
  ms: number
}

const FOLLOW_UP_ANSWER = 'El equipo con el que trabajo y lo que aprendo cada semana.'
const TYPE_STEPS = 8
/** Arranca en la penúltima pantalla (el 0 a 10 con su pregunta de seguimiento) y cierra con «Respuestas enviadas». */
const FRAMES: readonly Frame[] = [
  { page: 'nps', nps: null, ms: 1100 },
  { page: 'nps', nps: 9, ms: 800 },
  ...Array.from({ length: TYPE_STEPS }, (_, i): Frame => ({ page: 'nps', nps: 9, typed: (i + 1) / TYPE_STEPS, ms: 150 })),
  { page: 'nps', nps: 9, typed: 1, ms: 600 },
  { page: 'nps', nps: 9, typed: 1, press: true, ms: 350 },
  { page: 'closing', ms: 0 },
]
const LAST = FRAMES.length - 1

/** Lo respondido en esta prueba: la demostración arranca en la página 17, con las anteriores ya respondidas. */
function answeredOf(f: Frame): number {
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

function Nps({ nps, typed = 0 }: { nps: number | null; typed?: number }) {
  const prompt = nps === null ? null : nps <= 6 ? PAGE_NPS.followUps.detractors : nps <= 8 ? PAGE_NPS.followUps.neutrals : PAGE_NPS.followUps.promoters
  return (
    <div className="encf-page">
      <p className="mb-2 text-[10px] text-[#5c646f]">{PAGE_NPS.trail} / <b className="text-[#303a47]">Subsección {PAGE_NPS.numbering} · {PAGE_NPS.title}</b></p>
      <Cover trail={PAGE_NPS.trail} numbering={PAGE_NPS.numbering} title={PAGE_NPS.title} count={1} minutes={PAGE_NPS.minutes} />
      <div className="overflow-hidden rounded-b-xl">
        <QuestionCard n={1} statement={PAGE_NPS.statement} answered={nps !== null}>
          <div className="grid grid-cols-6 gap-1">
            {Array.from({ length: 11 }, (_, i) => (
              <span key={i} className={`flex h-8 items-center justify-center rounded-md border text-[11px] tabular-nums transition-colors duration-300 ${nps === i ? 'encf-tap border-[#0c5bef] bg-[#0c5bef]/10 font-semibold text-[#0c5bef]' : 'border-black/10'}`}>{i}</span>
            ))}
          </div>
          <p className="mt-1 flex justify-between text-[9.5px] text-[#5c646f] max-lg:text-[11px]"><span>{PAGE_NPS.minLabel}</span><span>{PAGE_NPS.maxLabel}</span></p>
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

/** Momento 4: la vista previa real del colaborador en un celular, respondida sola de la bienvenida al cierre con confeti. */
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
  const cta = 'Continuar'

  return (
    <div ref={box} className="relative flex justify-center py-4">
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-72 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(12,91,239,0.18),transparent)]" aria-hidden="true" />
      {/* Un celular: marco, isla y barra de estado; adentro, la vista previa en su versión angosta (sin «Tu avance», con «Contenido»). */}
      <div className="relative w-[21rem] rounded-[3rem] bg-[#16181d] p-[10px] shadow-[0_50px_100px_-40px_rgba(10,11,13,0.75),inset_0_0_0_2px_#2c2f36]">
        <span className="absolute -left-[3px] top-28 h-12 w-[3px] rounded-l bg-[#2c2f36]" aria-hidden="true" />
        <span className="absolute -right-[3px] top-36 h-16 w-[3px] rounded-r bg-[#2c2f36]" aria-hidden="true" />
        <div className="relative flex h-[39rem] flex-col overflow-hidden rounded-[2.4rem] bg-white text-[#303a47]">
          <div className="relative flex h-9 shrink-0 items-center justify-between px-6 text-[11px] font-semibold" aria-hidden="true">
            <span>9:41</span>
            <span className="absolute left-1/2 top-2 h-[22px] w-[86px] -translate-x-1/2 rounded-full bg-[#16181d]" />
            <span className="flex items-center gap-1">
              <span className="flex h-2.5 items-end gap-[1.5px]">{[4, 6, 8, 10].map((h) => <span key={h} className="w-[2.5px] rounded-sm bg-[#303a47]" style={{ height: h }} />)}</span>
              <span className="ml-1 h-[10px] w-[20px] rounded-[3px] border border-[#303a47] p-[1.5px]"><span className="block h-full w-3/4 rounded-[1px] bg-[#303a47]" /></span>
            </span>
          </div>
          <div className="flex shrink-0 items-start justify-between gap-2 border-b border-black/[0.07] px-4 pb-2.5 pt-1">
            <div className="min-w-0">
              <p className="text-[13px] font-semibold">Vista previa</p>
              <p className="truncate text-[10px] text-[#5c646f]">{SURVEY.name}</p>
            </div>
            <p className="flex shrink-0 items-center gap-1.5 text-[10px]">
              <span className="rounded-md border border-black/15 px-1.5 py-1">☰ Contenido ⌄</span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-black/10">×</span>
            </p>
          </div>
          <div className="h-[3px] shrink-0 bg-[#ecf1fa]" aria-hidden="true">
            <span className="block h-full bg-[#0c5bef] transition-[width] duration-700" style={{ width: `${(answered / SURVEY.questions) * 100}%` }} />
          </div>
          <div className="flex min-h-0 flex-1 flex-col bg-[linear-gradient(180deg,#f3f6fd,#fff_40%)] px-3 pt-3">
            <div key={`${f.page}-${run}`} className="min-h-0 flex-1 overflow-hidden [mask-image:linear-gradient(180deg,#000_90%,transparent)]">
              {f.page === 'nps' && <Nps nps={f.nps ?? null} typed={f.typed} />}
              {f.page === 'closing' && <Closing onRestart={restart} />}
            </div>
            {f.page !== 'closing' && (
              <div className="flex shrink-0 items-center justify-between py-3">
                <span className={`rounded-lg border border-black/15 px-3 py-1.5 text-[11px]`}>‹ Volver</span>
                <span className={`rounded-lg px-3 py-1.5 text-[11px] font-medium text-white transition-transform duration-150 ${f.press ? 'scale-95' : ''}`} style={{ background: UBITS_BLUE }}>{cta} ›</span>
              </div>
            )}
          </div>
          <span className="mx-auto mb-2 mt-1 block h-1 w-28 shrink-0 rounded-full bg-[#303a47]/80" aria-hidden="true" />
          {f.page === 'closing' && !reducedMotion && <Rain key={run} />}
        </div>
      </div>
    </div>
  )
}

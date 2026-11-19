'use client'

import { useEffect, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { AI_GRADIENT, BUILDER, HOME, ORB, QUESTION_TYPE, REQUEST, SECTIONS, STEPS } from '@/lib/content/cases/encuestas/orbit-real'

type Msg =
  | { kind: 'agent'; text: string; muted?: boolean }
  | { kind: 'kicker'; text: string }
  | { kind: 'chips'; items: readonly string[]; picked?: number; done?: boolean; soft?: boolean }
  | { kind: 'user'; text: string }
  | { kind: 'thinking'; text: string; live: boolean }
  | { kind: 'actions' }
  | { kind: 'discard' }

interface Frame {
  part: 1 | 2
  context: { label: string; detail: string }
  msgs: readonly Msg[]
  composer: { text: string; placeholder: string; focus?: boolean }
  /** Cuánto de la encuesta ya se creó (unidades de `UNITS`). */
  built: number
  step: number
  ms: number
}

/** El orden en que Orbit crea: sección, subsección, sus preguntas; la sección se pliega al terminar. */
const UNITS = ['s1', 's1.1', 'q', 'q', 'q', 'q', 's1-done', 's2', 's2.1', 's2.2', 'q', 'q', 'q', 'q', 's2-done'] as const

function buildFrames(): Frame[] {
  const f: Frame[] = []
  const home = [
    { kind: 'agent', text: HOME.greeting } as Msg,
    { kind: 'kicker', text: HOME.kicker } as Msg,
    { kind: 'chips', items: HOME.suggestions, soft: true } as Msg,
  ]
  f.push({ part: 1, context: HOME.context, msgs: home, composer: { text: '', placeholder: HOME.placeholder }, built: 0, step: 0, ms: 1800 })
  const steps = 14
  for (let i = 1; i <= steps; i++) {
    f.push({ part: 1, context: HOME.context, msgs: home, composer: { text: REQUEST.slice(0, Math.round((REQUEST.length * i) / steps)), placeholder: HOME.placeholder, focus: true }, built: 0, step: 0, ms: 75 })
  }
  f.push({ part: 1, context: HOME.context, msgs: home, composer: { text: REQUEST, placeholder: HOME.placeholder, focus: true }, built: 0, step: 0, ms: 500 })

  // Al pedir crear, Orbit pasa al constructor con lo pedido ya en su chat.
  const base: Msg[] = [{ kind: 'agent', text: BUILDER.continued }, { kind: 'user', text: REQUEST }]
  const ask = BUILDER.placeholderAsk
  f.push({ part: 1, context: BUILDER.contextBefore, msgs: base, composer: { text: '', placeholder: ask }, built: 0, step: 0, ms: 900 })
  const style: Msg[] = [...base, { kind: 'agent', text: BUILDER.understood }, { kind: 'agent', text: BUILDER.styleQuestion }, { kind: 'chips', items: BUILDER.styleChips }]
  f.push({ part: 1, context: BUILDER.contextBefore, msgs: style, composer: { text: '', placeholder: ask }, built: 0, step: 0, ms: 1900 })
  const stylePicked: Msg[] = [...style.slice(0, -1), { kind: 'chips', items: BUILDER.styleChips, picked: 0 }]
  f.push({ part: 1, context: BUILDER.contextBefore, msgs: stylePicked, composer: { text: '', placeholder: ask }, built: 0, step: 0, ms: 450 })
  const size: Msg[] = [...style.slice(0, -1), { kind: 'chips', items: BUILDER.styleChips, done: true }, { kind: 'user', text: BUILDER.styleChips[0] }, { kind: 'agent', text: BUILDER.thanks }, { kind: 'agent', text: BUILDER.sizeQuestion }, { kind: 'chips', items: BUILDER.sizeChips }]
  f.push({ part: 1, context: BUILDER.contextBefore, msgs: size, composer: { text: '', placeholder: ask }, built: 0, step: 0, ms: 1700 })
  f.push({ part: 1, context: BUILDER.contextBefore, msgs: [...size.slice(0, -1), { kind: 'chips', items: BUILDER.sizeChips, picked: 0 }], composer: { text: '', placeholder: ask }, built: 0, step: 0, ms: 450 })
  const started: Msg[] = [...size.slice(0, -1), { kind: 'chips', items: BUILDER.sizeChips, done: true }, { kind: 'user', text: BUILDER.sizeChips[0] }, { kind: 'agent', text: BUILDER.start }]
  f.push({ part: 1, context: BUILDER.contextBefore, msgs: started, composer: { text: '', placeholder: BUILDER.placeholderBusy }, built: 0, step: 0, ms: 1500 })

  // Parte 2: el panel se acopla a la derecha y la encuesta crece a la izquierda.
  const working: Msg[] = [...started, { kind: 'agent', text: BUILDER.working }]
  f.push({ part: 2, context: BUILDER.contextAfter, msgs: working, composer: { text: '', placeholder: BUILDER.placeholderBusy }, built: 0, step: 3, ms: 1200 })
  UNITS.forEach((u, i) => {
    const current = i < 7 ? 'Liderazgo' : 'Carga de trabajo'
    const secs = Math.max(1, Math.round(((i + 1) * 7) / UNITS.length))
    f.push({ part: 2, context: BUILDER.contextAfter, msgs: [...working, { kind: 'thinking', text: `Creando «${current}» ${secs}s`, live: true }], composer: { text: '', placeholder: BUILDER.placeholderBusy }, built: i + 1, step: 3, ms: u === 'q' ? 380 : 620 })
  })
  const done: Msg[] = [...working, { kind: 'thinking', text: BUILDER.reasoned, live: false }, { kind: 'agent', text: BUILDER.done, muted: true }, { kind: 'actions' }, { kind: 'chips', items: BUILDER.followUps, soft: true }, { kind: 'discard' }]
  f.push({ part: 2, context: BUILDER.contextAfter, msgs: done, composer: { text: '', placeholder: BUILDER.placeholderAdjust }, built: UNITS.length, step: 3, ms: 0 })
  return f
}

const FRAMES = buildFrames()
const LAST = FRAMES.length - 1

function Orb({ className = 'h-6 w-6' }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={ORB} alt="" aria-hidden="true" width={48} height={48} draggable={false} className={`shrink-0 select-none rounded-full ${className}`} />
}

/** Copiar, me gusta, no me gusta, leer en voz alta y más: la fila bajo cada respuesta del agente. */
const ACTION_ICONS = [
  'M8 8h11v11H8zM5 16V5h11',
  'M7 11v9H4v-9h3Zm0 0 4-7a2 2 0 0 1 3 2l-1 4h6a2 2 0 0 1 2 2l-2 7a2 2 0 0 1-2 1H7',
  'M7 13V4H4v9h3Zm0 0 4 7a2 2 0 0 0 3-2l-1-4h6a2 2 0 0 0 2-2l-2-7a2 2 0 0 0-2-1H7',
  'M4 9v6h4l5 4V5L8 9H4Zm12 0a4 4 0 0 1 0 6',
  'M12 5h.01M12 12h.01M12 19h.01',
]

function Message({ m }: { m: Msg }) {
  if (m.kind === 'agent')
    return (
      <div className="enc-ai-in flex items-start gap-2.5">
        <Orb className="mt-0.5 h-5 w-5" />
        <p className={`text-[13px] leading-relaxed ${m.muted ? 'text-[#5c646f]' : 'text-[#414a5c]'}`}>{m.text}</p>
      </div>
    )
  if (m.kind === 'kicker') return <p className="enc-ai-in text-[10px] font-medium uppercase tracking-[0.12em] text-[#5c646f]">{m.text}</p>
  if (m.kind === 'user')
    return (
      <p className="enc-ai-in ml-auto max-w-[85%] rounded-[16px_16px_6px_16px] bg-[#f1f3f6] px-3.5 py-2.5 text-[13px] leading-relaxed text-[#303a47]">{m.text}</p>
    )
  if (m.kind === 'chips')
    return (
      <div className={`enc-ai-in flex flex-wrap gap-1.5 ${m.soft ? '' : 'pl-7'}`}>
        {m.items.map((c, i) => (
          <span
            key={c}
            className={`rounded-full border px-3 py-1.5 text-[12px] leading-snug transition-colors duration-300 ${m.picked === i ? 'border-[#285ee6] bg-[#285ee6]/10 text-[#285ee6]' : m.done ? 'border-black/10 text-[#979ba3]' : 'border-black/15 text-[#303a47]'}`}
          >
            {c}
          </span>
        ))}
      </div>
    )
  if (m.kind === 'thinking')
    return (
      <div className="enc-ai-in flex items-center gap-2.5">
        <Orb className={`h-5 w-5 ${m.live ? 'enc-ai-spin' : ''}`} />
        {m.live ? (
          <span className="enc-ai-shimmer bg-[linear-gradient(90deg,#979ba3,#303a47,#979ba3)] bg-clip-text text-[13px] text-transparent">{m.text} ⌄</span>
        ) : (
          <span className="text-[13px] text-[#5c646f]">{m.text} ⌄</span>
        )}
      </div>
    )
  if (m.kind === 'actions')
    return (
      <p className="enc-ai-in flex gap-3.5 pl-7 text-[#5c646f]" aria-hidden="true">
        {ACTION_ICONS.map((d) => (
          <svg key={d} viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
        ))}
      </p>
    )
  return (
    <span className="enc-ai-in ml-7 inline-flex w-fit items-center gap-2 rounded-full border border-black/15 px-3 py-1.5 text-[12px] font-medium text-[#303a47]">
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" /></svg>
      {BUILDER.discard}
    </span>
  )
}

/** El panel lateral de Orbit: cabecera, franja de contexto, conversación y compositor, como `ContextPanel`. */
function Panel({ f }: { f: Frame }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-black/[0.08] bg-white text-[#303a47] shadow-[0_30px_70px_-30px_rgba(40,94,230,0.35)]">
      <div className="flex items-center gap-2.5 border-b border-black/[0.06] px-4 py-3">
        <Orb className="h-7 w-7" />
        <p className="flex-1 text-[15px] font-semibold">Orbit</p>
        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-black/10 text-[12px] text-[#5c646f]">✕</span>
      </div>
      <p className="flex items-center gap-2 border-b border-black/[0.06] bg-[#f6f7f9] px-4 py-2 text-[12px] text-[#5c646f]">
        <span aria-hidden="true">▤</span>
        <span className="truncate">
          Contexto: <span key={f.context.label} className="enc-ai-in inline-block text-[#303a47]">{f.context.label}</span> · {f.context.detail}
        </span>
      </p>
      {/* La conversación se lee desde abajo, como en el producto: lo nuevo empuja lo anterior hacia arriba. */}
      <div className="flex min-h-0 flex-1 flex-col justify-end gap-3 overflow-hidden px-4 py-3 [mask-image:linear-gradient(180deg,transparent,#000_14%)]">
        {f.msgs.map((m, i) => <Message key={`${i}-${m.kind}`} m={m} />)}
      </div>
      <div className="px-3 pb-2">
        <div className="rounded-[20px] p-[1.5px] transition-[background] duration-500" style={{ background: f.composer.focus ? AI_GRADIENT : 'rgba(0,0,0,0.08)' }}>
          <div className="rounded-[18.5px] bg-white px-3 pb-2 pt-2.5">
            <p className="min-h-[2.4rem] text-[13px] leading-snug">
              {f.composer.text ? (
                <>
                  {f.composer.text}
                  <span className="enc-ai-caret ml-px inline-block h-3.5 w-px bg-[#303a47] align-middle" />
                </>
              ) : (
                <span className="text-[#979ba3]">{f.composer.placeholder}</span>
              )}
            </p>
            <p className="mt-1 flex items-center gap-2 text-[12px]">
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-black/10">+</span>
              <span className="ml-auto rounded-full border border-black/10 px-2.5 py-1">ı|ı Voz</span>
              <span className={`flex h-7 w-7 items-center justify-center rounded-full text-white transition-opacity ${f.composer.text ? 'opacity-100' : 'opacity-40'}`} style={{ background: '#285ee6' }}>↑</span>
            </p>
          </div>
        </div>
        <p className="mt-1.5 text-center text-[10px] text-[#979ba3]">{BUILDER.disclaimer}</p>
      </div>
    </div>
  )
}

function AiBadge({ creating }: { creating: boolean }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-black/10 bg-white px-1.5 py-0.5 text-[10px]">
      <Orb className={`h-3 w-3 ${creating ? 'enc-ai-spin' : ''}`} />
      {creating ? 'Creando…' : 'Creada con IA'}
    </span>
  )
}

/** «Crear encuesta» en el paso 4: lo que Orbit va creando, con «Creando…» y luego «Creada con IA». */
function Platform({ built }: { built: number }) {
  const seen = (i: number) => built > i
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-black/[0.08] bg-[linear-gradient(170deg,#f3f6fd,#fff_35%)] text-[#303a47]">
      <div className="px-5 pt-4">
        <p className="text-[20px] font-bold leading-tight">Crear encuesta</p>
        <p className="text-[11px] text-[#5c646f]">Paso 4 de 5 · Arma las secciones y las preguntas que van a responder los participantes.</p>
        <ol className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[10.5px]">
          {STEPS.map((s, i) => (
            <li key={s} className="flex items-center gap-1.5">
              <span className={`flex h-4 w-4 items-center justify-center rounded-full text-[9px] ${i < 3 ? 'bg-[#0c5bef] text-white' : i === 3 ? 'bg-[#0c5bef] text-white' : 'border border-black/15 text-[#979ba3]'}`}>{i < 3 ? '✓' : i + 1}</span>
              <span className={i > 3 ? 'text-[#979ba3]' : ''}>{s}</span>
            </li>
          ))}
        </ol>
      </div>
      <div className="mt-3 min-h-0 flex-1 space-y-2 overflow-hidden px-5 [mask-image:linear-gradient(180deg,#000_85%,transparent)]">
        {SECTIONS.map((sec, si) => {
          const start = si === 0 ? 0 : 7
          const doneAt = si === 0 ? 6 : 14
          if (!seen(start)) return null
          const creating = !seen(doneAt)
          const collapsed = si === 0 && !creating
          return (
            <div key={sec.n} className={`enc-ai-pop rounded-xl border bg-white transition-[border-color,box-shadow] duration-500 ${creating ? 'border-[#7e2be0] shadow-[inset_0_0_0_0.5px_#7e2be0,0_8px_22px_-14px_rgba(126,43,224,0.6)]' : 'border-black/[0.08]'}`}>
              <div className="flex items-start gap-2 px-3 py-2.5">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#0c5bef] text-[9px] text-white">{sec.n}</span>
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-center gap-1.5 text-[13px] font-semibold"><AiBadge creating={creating} />{sec.title}</p>
                  <p className="truncate text-[10.5px] text-[#5c646f]">{sec.description}</p>
                </div>
                <span className="text-[11px] text-[#979ba3]">{collapsed ? '⌄' : '⌃'}</span>
              </div>
              {!collapsed && (
                <div className="space-y-1 border-t border-black/[0.06] px-3 py-2">
                  {sec.subs.map((sub) => {
                    const subAt = sub.n === '1.1' ? 1 : sub.n === '2.1' ? 8 : 9
                    if (!seen(subAt)) return null
                    return (
                      <div key={sub.n} className="enc-ai-in">
                        <p className="flex items-center gap-1.5 text-[12px] font-medium">
                          <span className="rounded border border-black/10 px-1 font-mono text-[9px]">{sub.n}</span>
                          {sub.title}
                          <span className="truncate text-[10px] font-normal text-[#5c646f]">· {sub.questions ? `${sub.questions.length} preguntas` : '4 preguntas'}</span>
                        </p>
                        {sub.questions?.map((qq, k) => {
                          const at = (sub.n === '1.1' ? 2 : 10) + k
                          if (!seen(at)) return null
                          return (
                            <div key={qq.n} className="enc-ai-pop ml-5 border-b border-black/[0.05] py-1.5 last:border-0">
                              <p className="text-[11.5px]"><span className="text-[#979ba3]">{qq.n}</span> {qq.text}</p>
                              <p className="mt-0.5 flex gap-1 text-[9px]">
                                <span className="inline-flex items-center gap-0.5 rounded border border-black/10 px-1"><Orb className="h-2.5 w-2.5" />IA</span>
                                <span className="rounded border border-black/10 px-1">{QUESTION_TYPE}</span>
                              </p>
                            </div>
                          )
                        })}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
      <p className="m-3 flex items-center justify-between rounded-xl border border-black/[0.08] bg-white px-3 py-2 text-[10.5px]">
        <span className="rounded-full border border-black/10 px-2 py-0.5">{built >= UNITS.length ? 'Guardado' : 'Cambios sin guardar'}</span>
        <span className="flex gap-1.5"><span className="rounded-md border border-black/10 px-2 py-1">‹ Atrás</span><span className="rounded-md bg-[#0c5bef] px-2 py-1 text-white">Continuar ›</span></span>
      </p>
    </div>
  )
}

/** El guion corre más rápido que el producto real, para que se lea como una demostración y no como una espera. */
const SPEED = 0.6

/** Orbit creando una encuesta: primero el panel solo, después acoplado mientras la encuesta crece en la plataforma. */
export function OrbitBuilder() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const box = useRef<HTMLDivElement>(null)
  const [i, setI] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = box.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.35 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (reducedMotion || !visible || i >= LAST) return
    const id = window.setTimeout(() => setI((v) => v + 1), FRAMES[i].ms * SPEED)
    return () => window.clearTimeout(id)
  }, [i, visible, reducedMotion])

  const f = FRAMES[reducedMotion ? LAST : i]
  const docked = f.part === 2
  // Trabajando: desde que se envía el pedido hasta que termina de crear.
  const working = i > 0 && i < LAST && f.msgs.some((m) => m.kind === 'user')

  return (
    <div ref={box}>
      <div className="mb-4 flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.12em]">
        <span className={`transition-opacity ${docked ? 'opacity-40' : 'text-signal'}`}>1 · {t({ es: 'El panel de Orbit', en: 'The Orbit panel' })}</span>
        <span className="opacity-30">→</span>
        <span className={`transition-opacity ${docked ? 'text-signal' : 'opacity-40'}`}>2 · {t({ es: 'Construye en la plataforma', en: 'Builds in the platform' })}</span>
        {i >= LAST && (
          <button type="button" onClick={() => setI(0)} className="ml-auto rounded-full border border-fg/25 px-3 py-1 normal-case tracking-normal transition-colors hover:border-signal hover:text-signal">
            ↺ {t({ es: 'Repetir', en: 'Replay' })}
          </button>
        )}
      </div>
      {/* El escenario: un halo con los cuatro colores de la IA de Flux UI, como `cn-ai-halo`. */}
      <div className="relative h-[38rem] overflow-hidden rounded-3xl bg-[#f7f8fb] [container-type:inline-size]">
        <div
          className="enc-ai-aurora pointer-events-none absolute -inset-[8%] transition-opacity duration-700"
          style={{ opacity: docked ? 0.45 : 1, background: 'radial-gradient(60% 95% at 4% 0%, color-mix(in oklab, #285ee6 22%, transparent), transparent 72%), radial-gradient(50% 80% at 36% 0%, color-mix(in oklab, #7e2be0 15%, transparent), transparent 72%), radial-gradient(50% 85% at 66% 0%, color-mix(in oklab, #d22d6a 15%, transparent), transparent 72%), radial-gradient(58% 95% at 98% 0%, color-mix(in oklab, #eb6233 22%, transparent), transparent 72%)' }}
          aria-hidden="true"
        />
        {/* Plataforma: entra por la izquierda cuando Orbit se acopla (en móvil ocupa todo el escenario). */}
        <div
          className="absolute inset-y-4 left-4 right-4 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] md:right-[calc(23rem+2rem)]"
          style={{ opacity: docked ? 1 : 0, transform: docked ? 'none' : 'translateX(-24px)' }}
          aria-hidden={!docked}
        >
          <Platform built={f.built} />
        </div>
        {/* Orbit: centrado en la parte 1; en la 2 se acopla a la derecha (en móvil se oculta para dejar ver la plataforma). */}
        <div
          className={`absolute inset-y-4 right-4 w-[calc(100%-2rem)] transition-[transform,opacity] duration-[900ms] ease-[cubic-bezier(0.32,0.72,0,1)] md:w-[23rem] ${docked ? 'max-md:pointer-events-none max-md:opacity-0' : ''}`}
          style={{ transform: docked ? 'none' : 'translateX(min(0px, calc(-50cqw + 11.5rem + 1rem)))' }}
        >
          {/* Mientras Orbit trabaja, el degradado de IA recorre el borde del panel: un solo trazo continuo que gira. */}
          <div className={`pointer-events-none absolute -inset-[2px] transition-opacity duration-500 ${working ? 'opacity-100' : 'opacity-0'}`} aria-hidden="true">
            <span className="enc-ai-border absolute inset-0 rounded-[18px] opacity-60 blur-md" />
            <span className="enc-ai-border enc-ai-border-line absolute inset-0 rounded-[18px]" />
          </div>
          <div className="relative h-full">
            <Panel f={f} />
          </div>
          {docked && working && (
            <div className="pointer-events-none absolute left-0 top-[38%] hidden md:block" aria-hidden="true">
              {[0, 1, 2, 3].map((k) => (
                <span key={k} className="enc-ai-spark absolute h-2 w-2 rounded-full" style={{ top: k * 22, animationDelay: `${k * 0.27}s`, ['--d' as string]: `-${180 + k * 40}px`, background: ['#285ee6', '#7e2be0', '#d22d6a', '#eb6233'][k], boxShadow: '0 0 12px currentColor' }} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

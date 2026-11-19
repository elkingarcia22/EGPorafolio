'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { SHOTS } from '@/lib/content/cases/encuestas/case'
import { ANALYSIS, DROPZONE, FILE, GENERAL, GROUPS, HEADER, STEPS, STRUCTURE, SUMMARY, analyzingStatus } from '@/lib/content/cases/encuestas/upload-real'
import { BrowserFrame } from './form-moments'
import { UBITS_BLUE } from './shared'

type Scene = 'home' | 'empty' | 'file' | 'analyzing' | 'general' | 'type' | 'typed' | 'summary' | 'scrolled' | 'done'
const SCENES: readonly { scene: Scene; ms: number; press?: boolean }[] = [
  { scene: 'home', ms: 800 },
  { scene: 'empty', ms: 1500 },
  { scene: 'file', ms: 1300 },
  { scene: 'file', ms: 350, press: true },
  { scene: 'analyzing', ms: Math.ceil((100 - ANALYSIS.start) / ANALYSIS.step) * ANALYSIS.tickMs + 300 },
  { scene: 'general', ms: 1400 },
  { scene: 'type', ms: 1000 },
  { scene: 'typed', ms: 1200 },
  { scene: 'typed', ms: 350, press: true },
  { scene: 'summary', ms: 2600 },
  { scene: 'scrolled', ms: 2200 },
  { scene: 'scrolled', ms: 400, press: true },
  { scene: 'done', ms: 0 },
]
const LAST = SCENES.length - 1
const STEP_OF: Partial<Record<Scene, number>> = { empty: 1, file: 1, general: 2, type: 2, typed: 2, summary: 3, scrolled: 3, done: 3 }
const TONE = { positive: 'bg-[#e2f4ea] text-[#1f7a46]', warning: 'bg-[#fbf3d6] text-[#8f6400]', neutral: 'bg-[#eceef2] text-[#5c646f]' } as const

/** El orbe de IA de la cabecera del panel (la carga la hace la IA). */
const Orb = () => <span className="h-8 w-8 shrink-0 rounded-full bg-[conic-gradient(from_200deg,#0c5bef,#7c3aed,#ec4899,#f59e0b,#0c5bef)] shadow-inner" aria-hidden="true" />

function Stepper({ active }: { active: number }) {
  return (
    <div className="flex items-center gap-2 border-b border-black/[0.07] px-4 py-2 text-[10.5px]">
      {STEPS.map((s, i) => {
        const n = i + 1
        const done = n < active
        const on = n === active
        return (
          <span key={s} className="flex min-w-0 items-center gap-1.5">
            {i > 0 && <span className={`h-px w-4 shrink-0 sm:w-8 ${n <= active ? 'bg-[#0c5bef]' : 'bg-black/10'}`} />}
            <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] transition-colors duration-300 ${done || on ? 'bg-[#0c5bef] text-white' : 'border border-black/15 text-[#5c646f]'}`}>{done ? '✓' : n}</span>
            <span className={`truncate ${on ? 'font-semibold' : ''}`}>{s}</span>
          </span>
        )
      })}
    </div>
  )
}

function Pill({ children, primary = false, press = false, disabled = false }: { children: React.ReactNode; primary?: boolean; press?: boolean; disabled?: boolean }) {
  return (
    <span className={`rounded-full px-3 py-1.5 text-[11px] font-medium transition-all duration-150 ${primary ? 'text-white' : 'border border-black/15'} ${press ? 'scale-95' : ''} ${disabled ? 'opacity-40' : ''}`} style={primary ? { background: UBITS_BLUE } : undefined}>
      {children}
    </span>
  )
}

function Head({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <p className="text-[13px] font-semibold">{title}</p>
      <p className="text-[10.5px] leading-snug text-[#5c646f]">{description}</p>
    </div>
  )
}

/** Cuenta hasta el valor real cuando aparece el resumen. */
function CountUp({ to, format, run }: { to: number; format: (v: number) => string; run: boolean }) {
  const { reducedMotion } = useA11y()
  const [v, setV] = useState(reducedMotion ? to : 0)
  useEffect(() => {
    if (!run || reducedMotion) return setV(to)
    let raf = 0
    const t0 = performance.now()
    const tick = (now: number) => {
      const k = Math.min(1, (now - t0) / 900)
      setV(to * (1 - Math.pow(1 - k, 3)))
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [to, run, reducedMotion])
  return <>{format(v)}</>
}

function Body({ scene, progress }: { scene: Scene; progress: number }) {
  if (scene === 'empty' || scene === 'file') {
    return (
      <div className="space-y-3">
        <Head title={DROPZONE.title} description={DROPZONE.description} />
        <div className="flex flex-col items-center gap-1 rounded-xl border border-dashed border-[#c5ccd8] bg-[#f8faff] px-3 py-5 text-center">
          <span className="text-lg text-[#0c5bef]" aria-hidden="true">⤒</span>
          <p className="text-[11px] font-medium">{DROPZONE.zoneTitle}</p>
          <p className="text-[10px] text-[#5c646f]">{DROPZONE.zoneDescription}</p>
        </div>
        {scene === 'file' && (
          <div className="encf-drop flex items-center gap-2 rounded-lg border border-black/10 bg-white p-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#e2f4ea] text-[10px] font-bold text-[#1f7a46]">XLS</span>
            <span className="min-w-0 flex-1"><span className="block truncate text-[11px] font-medium">{FILE.name}</span><span className="block text-[10px] text-[#5c646f]">{FILE.size}</span></span>
            <span className="text-[#1f7a46]" aria-hidden="true">✓</span>
          </div>
        )}
      </div>
    )
  }
  if (scene === 'analyzing') {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <span className="h-10 w-10 animate-spin rounded-full bg-[conic-gradient(from_0deg,#0c5bef,#7c3aed,#ec4899,transparent_70%)] [mask:radial-gradient(circle,transparent_52%,#000_54%)]" aria-hidden="true" />
        <p key={analyzingStatus(progress)} className="enc-fade text-[12px] font-medium">{analyzingStatus(progress)}</p>
        <span className="block h-1.5 w-56 max-w-full overflow-hidden rounded-full bg-[#ecf1fa]"><span className="block h-full rounded-full bg-[linear-gradient(90deg,#0c5bef,#7c3aed,#ec4899)] transition-[width] duration-75" style={{ width: `${progress}%` }} /></span>
        <p className="text-[10px] text-[#5c646f]">{FILE.name}</p>
      </div>
    )
  }
  if (scene === 'general' || scene === 'type' || scene === 'typed') {
    const field = 'mt-1 rounded-lg border border-black/15 bg-white px-2.5 py-1.5 text-[11px]'
    return (
      <div className="space-y-3">
        <Head title={GENERAL.title} description={GENERAL.description} />
        <div><p className="text-[10.5px] font-medium">Nombre de la encuesta</p><p className={field}>{GENERAL.name}</p></div>
        <div className="relative">
          <p className="text-[10.5px] font-medium">Tipo de encuesta</p>
          <p className={`${field} flex justify-between ${scene === 'type' ? 'border-[#0c5bef] ring-2 ring-[#0c5bef]/20' : ''}`}>
            <span className={scene === 'typed' ? 'encf-pop' : 'text-[#979ba3]'}>{scene === 'typed' ? 'Clima' : 'Elige el tipo'}</span><span aria-hidden="true">⌄</span>
          </p>
          {scene === 'type' && (
            <div className="enc-fade absolute left-0 right-0 top-full z-10 mt-1 rounded-lg border border-black/10 bg-white p-1 shadow-lg">
              {GENERAL.types.map((ty, i) => <p key={ty} className={`rounded-md px-2 py-1 text-[11px] ${i === 0 ? 'bg-[#ecf1fa] text-[#0c5bef]' : ''}`}>{ty}</p>)}
            </div>
          )}
          <p className="mt-1 text-[10px] leading-snug text-[#5c646f]">{GENERAL.typeHint}</p>
        </div>
        <div><p className="text-[10.5px] font-semibold">Periodo de la medición</p><p className="mt-1 text-[10.5px] font-medium">Fecha de inicio y de cierre</p><p className={field}>{GENERAL.dates}</p></div>
        <div>
          <p className="text-[10.5px] font-medium">Visibilidad de la encuesta</p>
          <p className="text-[10px] text-[#5c646f]">{GENERAL.visibilityHint}</p>
          <div className="mt-1 grid grid-cols-2 gap-2">
            {['Pública', 'Anónima'].map((v, i) => (
              <span key={v} className={`flex items-center gap-2 rounded-lg border px-2 py-1.5 text-[11px] ${i === 0 ? 'border-[#0c5bef] bg-[#0c5bef]/5' : 'border-black/10'}`}>
                <span className={`h-3 w-3 rounded-full border ${i === 0 ? 'border-[4px] border-[#0c5bef]' : 'border-black/25'}`} />{v}
              </span>
            ))}
          </div>
        </div>
      </div>
    )
  }
  // Resumen («Estructura»): indicadores, participantes y cómo queda armada.
  const scrolled = scene === 'scrolled' || scene === 'done'
  const total = STRUCTURE.sections.reduce((s, [, n]) => s + n, 0)
  return (
    <div className="space-y-3 transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]" style={{ transform: scrolled ? 'translateY(-46%)' : 'none' }}>
      <Head title={SUMMARY.title} description={SUMMARY.description} />
      <div className="rounded-xl border border-black/[0.07] bg-[#f6f7fb]">
        <p className="px-3 pt-2 text-[11px] font-semibold">Indicadores</p>
        <p className="px-3 text-[10px] text-[#5c646f]">Los calculamos con las respuestas del archivo.</p>
        <div className="m-1 mt-2 grid grid-cols-3 divide-x divide-black/10 rounded-lg bg-white py-2">
          {SUMMARY.indicators.map((c) => (
            <div key={c.label} className="min-w-0 px-2.5">
              <p className="truncate text-[10px] text-[#5c646f]">{c.label}</p>
              <p className="text-[15px] font-semibold tabular-nums"><CountUp to={c.value} format={c.format} run /></p>
              <p className="text-[9.5px] leading-tight text-[#5c646f]">{c.detail}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-xl border border-black/[0.07] bg-[#f6f7fb]">
        <p className="px-3 pt-2 text-[11px] font-semibold">Participantes</p>
        <p className="px-3 text-[10px] leading-snug text-[#5c646f]">{SUMMARY.participantsNote}</p>
        <div className="m-1 mt-2 space-y-1">
          {GROUPS.map((g, gi) => {
            const open = g.tone === 'warning'
            return (
              <div key={g.title} className="enc-fade rounded-lg bg-white px-3 py-2" style={{ animationDelay: `${gi * 120}ms` }}>
                <p className="flex items-center justify-between text-[11px] font-medium">
                  <span className="flex items-center gap-2">{g.title}<span className={`rounded-full px-1.5 text-[10px] tabular-nums ${TONE[g.tone]}`}>{g.count}</span></span>
                  <span aria-hidden="true">{open ? '⌃' : '⌄'}</span>
                </p>
                {open && (
                  <div className="mt-1.5 space-y-2">
                    <p className="text-[9.5px] leading-snug text-[#5c646f]">{g.note}</p>
                    {g.people.slice(0, 1).map((p) => (
                      <div key={p.id} className="border-t border-black/[0.06] pt-2">
                        <p className="text-[11px] font-medium">{p.name} <span className="font-normal text-[#5c646f]">{p.id} · {p.idType} · sin coincidencia en UBITS</span></p>
                        {p.suggestion && <p className="mt-1 text-[10px] text-[#5c646f]">Mismo nombre y apellido que un usuario de UBITS: <b className="text-[#303a47]">{p.suggestion.name}</b> ({p.suggestion.username} · {p.suggestion.context})</p>}
                        <p className="mt-1.5 flex flex-wrap gap-1.5 text-[10px]">
                          <span className="rounded-md border border-black/15 px-2 py-0.5">✓ Sí, es el mismo usuario</span>
                          <span className="rounded-md border border-black/15 px-2 py-0.5">Dejar sin match</span>
                          <span className="px-1 py-0.5">Asociar otro usuario</span>
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
      <div className="rounded-xl border border-black/[0.07] bg-[#f6f7fb]">
        <p className="px-3 pt-2 text-[11px] font-semibold">Estructura</p>
        <p className="px-3 text-[10px] text-[#5c646f]">{STRUCTURE.sections.length} secciones · {total} preguntas</p>
        <div className="m-1 mt-2 space-y-1.5 rounded-lg bg-white p-3">
          <p className="flex flex-wrap items-center gap-1 text-[10px]"><span className="mr-1 text-[#5c646f]">Demográficos</span>{STRUCTURE.demographics.map((d) => <span key={d} className="rounded-md border border-black/15 px-1.5">{d}</span>)}</p>
          {STRUCTURE.sections.map(([name, n]) => (
            <p key={name} className="flex justify-between border-t border-black/[0.06] pt-1.5 text-[11px]"><span>{name}</span><span className="text-[#5c646f]">{n} {n === 1 ? 'pregunta' : 'preguntas'}</span></p>
          ))}
        </div>
      </div>
    </div>
  )
}

/** Momento 5: el panel real «Cargar encuestas», recorrido de punta a punta con el archivo de muestra del producto. */
export function UploadReal() {
  const { reducedMotion } = useA11y()
  const box = useRef<HTMLDivElement>(null)
  const [i, setI] = useState(reducedMotion ? LAST : 0)
  const [run, setRun] = useState(0)
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState<number>(ANALYSIS.start)

  useEffect(() => {
    const el = box.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.4 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (reducedMotion || !visible || i >= LAST) return
    const id = window.setTimeout(() => setI((v) => v + 1), SCENES[i].ms)
    return () => window.clearTimeout(id)
  }, [i, visible, reducedMotion, run])

  const { scene, press } = SCENES[i]
  // La barra del análisis avanza como en el producto: arranca en 35 y sube 2 cada 70 ms.
  useEffect(() => {
    if (scene !== 'analyzing') return setProgress(ANALYSIS.start)
    const id = window.setInterval(() => setProgress((p) => Math.min(100, p + ANALYSIS.step)), ANALYSIS.tickMs)
    return () => window.clearInterval(id)
  }, [scene])

  const step = STEP_OF[scene]
  const drawer = scene !== 'home'
  const analyzing = scene === 'analyzing'

  return (
    <div ref={box}>
      <BrowserFrame route="/admin/desempeno-cultura/encuestas · Cargar encuestas">
        <div className="relative h-[32rem] overflow-hidden bg-white">
          {/* Detrás, el inicio real de Encuestas, que se desenfoca cuando abre el panel. */}
          <Image src={SHOTS.lista.src} width={SHOTS.lista.width} height={SHOTS.lista.height} alt="" sizes="(min-width: 1024px) 50vw, 100vw" className={`absolute inset-0 h-full w-full object-cover object-left-top transition-[filter] duration-700 ${drawer ? 'blur-[3px] brightness-95' : ''}`} />
          <div className={`absolute inset-0 bg-black/10 transition-opacity duration-700 ${drawer ? 'opacity-100' : 'opacity-0'}`} aria-hidden="true" />

          <div className={`absolute inset-y-2 right-2 flex w-[calc(100%-1rem)] flex-col overflow-hidden rounded-2xl bg-white text-[#303a47] shadow-2xl transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:w-[25rem] ${drawer ? 'translate-x-0' : 'translate-x-[110%]'}`}>
            {step && step > 1 && !analyzing ? <p className="border-b border-black/[0.07] px-4 py-1.5 text-[10.5px] text-[#5c646f]">‹ Volver</p> : null}
            <div className="flex items-start gap-3 px-4 py-3">
              <Orb />
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold">{analyzing ? HEADER.analyzingTitle : HEADER.title}</p>
                <p className="text-[10.5px] leading-snug text-[#5c646f]">{analyzing ? HEADER.analyzingDescription : HEADER.description}</p>
              </div>
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-black/10 text-[11px]" aria-hidden="true">×</span>
            </div>
            {step === 1 && <p className="border-y border-black/[0.07] px-4 py-1.5 text-[10.5px] text-[#5c646f]">Ver cargas</p>}
            {step && !analyzing ? <Stepper active={step} /> : null}
            <div key={`${scene === 'scrolled' || scene === 'done' ? 'summary' : scene === 'type' || scene === 'typed' ? 'general' : scene === 'file' ? 'empty' : scene}-${run}`} className="encf-page min-h-0 flex-1 overflow-hidden px-4 py-3 [mask-image:linear-gradient(180deg,#000_90%,transparent)]">
              <Body scene={scene} progress={progress} />
            </div>
            {!analyzing && step ? (
              <div className="flex shrink-0 justify-end gap-2 border-t border-black/[0.07] px-4 py-2.5">
                {step === 1 && <Pill>× Cancelar</Pill>}
                {step === 1 && <Pill primary disabled={scene === 'empty'} press={press}>⌕ Analizar archivo</Pill>}
                {step === 2 && <Pill primary disabled={scene !== 'typed'} press={press}>Continuar ›</Pill>}
                {step === 3 && <Pill primary press={press}>⤓ Cargar encuesta</Pill>}
              </div>
            ) : null}
          </div>

          {scene === 'done' && !reducedMotion && (
            <button type="button" onClick={() => { setI(0); setRun((r) => r + 1) }} className="absolute bottom-3 left-3 z-10 rounded-full bg-white/95 px-3 py-1 text-[11px] text-[#0c5bef] shadow ring-1 ring-black/5 hover:bg-[#ecf1fa]">
              ↺ Repetir
            </button>
          )}
        </div>
      </BrowserFrame>
    </div>
  )
}

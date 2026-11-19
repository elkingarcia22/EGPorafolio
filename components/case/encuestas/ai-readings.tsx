'use client'

import { useEffect, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { AI_READING, HEADER, TABS } from '@/lib/content/cases/encuestas/results-real'

const ORB = '/cases/encuestas/orbit-orb.webp'
const AI_GRADIENT = 'linear-gradient(90deg,#285ee6,#7e2be0,#d22d6a,#eb6233)'
const KPIS = TABS.find((x) => x.id === 'ia')?.kpis ?? []
const CONF: Record<string, string> = { Alta: 'bg-[#e2f4ea] text-[#1f7a4c]', Media: 'bg-[#fdf3d9] text-[#8f6400]' }
/** Los otros dos grupos de la lectura (`ia-analisis.tsx`, KINDS): en el producto se pliegan bajo los hallazgos. */
const GROUPS = [
  { n: 2, title: 'Riesgos', hint: 'Qué está en juego si no se atiende', count: '3 lecturas' },
  { n: 3, title: 'Qué hacer', hint: 'Por dónde abrir el plan', count: '3 lecturas' },
] as const

/** Paso de la animación: 0 cifras, 1 resumen, 2–4 cada hallazgo, 5 evidencia abierta, 6 grupos plegados. */
function useSteps(box: React.RefObject<HTMLElement | null>) {
  const { reducedMotion } = useA11y()
  const [step, setStep] = useState(reducedMotion ? 6 : 0)
  const [typed, setTyped] = useState(reducedMotion ? 1 : 0)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = box.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.35 })
    io.observe(el)
    return () => io.disconnect()
  }, [box])
  useEffect(() => {
    if (!visible || reducedMotion || step >= 6) return
    if (step === 1 && typed < 1) {
      const id = window.setTimeout(() => setTyped((v) => Math.min(1, v + 0.04)), 28)
      return () => window.clearTimeout(id)
    }
    const id = window.setTimeout(() => setStep((s) => s + 1), step === 0 ? 900 : 650)
    return () => window.clearTimeout(id)
  }, [visible, reducedMotion, step, typed])
  const replay = () => {
    setTyped(0)
    setStep(0)
  }
  return { step, typed, replay, done: step >= 6 }
}

/** «Análisis con IA» de Clima Q1 2026: cifras, resumen y lecturas con su confiabilidad y su evidencia. */
export function AiReadingPanel() {
  const box = useRef<HTMLDivElement>(null)
  const { step, typed, replay, done } = useSteps(box)
  const summary = AI_READING.summary.slice(0, Math.round(AI_READING.summary.length * typed))

  return (
    <div ref={box} className="relative overflow-hidden rounded-3xl bg-[#f7f8fb] p-3 text-[#303a47] ring-1 ring-black/[0.06] sm:p-5">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 opacity-70" style={{ background: 'radial-gradient(50% 100% at 10% 0%, rgba(40,94,230,0.18), transparent 70%), radial-gradient(50% 100% at 90% 0%, rgba(235,98,51,0.16), transparent 70%)' }} aria-hidden="true" />
      <div className="relative">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-[15px] font-bold">{HEADER.title} <span className="ml-1 rounded bg-[#e2f4ea] px-1.5 py-0.5 text-[10px] font-medium text-[#1f7a4c]">{HEADER.status}</span></p>
          {done && <button type="button" onClick={replay} className="rounded-full border border-black/10 bg-white px-2.5 py-1 text-[10px] text-[#5c646f] hover:text-[#303a47]">↺ Re-analizar</button>}
        </div>
        <p className="mt-2 flex gap-4 overflow-x-auto border-b border-black/10 text-[11px] text-[#5c646f]">
          {TABS.map((tab) => (
            <span key={tab.id} className={`shrink-0 pb-1.5 ${tab.id === 'ia' ? 'border-b-2 border-[#303a47] font-semibold text-[#303a47]' : ''}`}>
              {tab.label}{tab.isNew && <span className="ml-1 rounded bg-[#ecf1fa] px-1 text-[8.5px] text-[#0c5bef]">Nuevo</span>}
            </span>
          ))}
        </p>

        {/* Las tres cifras de la pestaña. */}
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {KPIS.map((k, i) => (
            <div key={k.label} className="enc-ai-pop rounded-xl bg-white p-3 ring-1 ring-black/[0.06]" style={{ animationDelay: `${i * 90}ms` }}>
              <p className="text-[10.5px] text-[#5c646f]">{k.label}</p>
              <p className="mt-1 text-[20px] font-semibold tabular-nums">{k.value}<span className="ml-1 text-[10px] font-normal text-[#5c646f]">{k.unit}</span></p>
              <p className="truncate text-[10px] text-[#5c646f]">{k.detail}</p>
            </div>
          ))}
        </div>

        {/* La lectura: resumen, hallazgos abiertos y los demás grupos plegados. */}
        <div className="mt-3 overflow-hidden rounded-2xl bg-white ring-1 ring-black/[0.06]">
          <div className="flex items-center justify-between gap-2 border-b border-black/[0.06] px-3 py-2.5">
            <p className="flex items-center gap-2 text-[12.5px] font-semibold">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={ORB} alt="" width={18} height={18} className={`h-[18px] w-[18px] ${!done ? 'enc-ai-spin' : ''}`} />
              Lectura de la IA <span className="rounded bg-[#f1f3f7] px-1 text-[10px] font-normal">9</span>
            </p>
            <p className="flex gap-1.5 text-[10px]">
              <span className="rounded-md border border-black/10 px-2 py-1">Personalizar</span>
              <span className="relative overflow-hidden rounded-md px-2 py-1 text-white" style={{ backgroundImage: AI_GRADIENT }}>Re-analizar</span>
            </p>
          </div>

          <div className="px-3 py-3">
            <p className="flex justify-between gap-2 text-[11.5px] font-semibold">Resumen general <span className="hidden text-[9.5px] font-normal text-[#979ba3] sm:inline">Generado a partir de los resultados de esta medición</span></p>
            <p className="mt-1 min-h-[4.5rem] text-[11px] leading-relaxed text-[#414a5c]">
              {step >= 1 ? summary : ''}
              {step === 1 && typed < 1 && <span className="enc-ai-caret ml-px inline-block h-3 w-[2px] translate-y-0.5 bg-[#7e2be0]" />}
            </p>
          </div>

          <div className="border-t border-black/[0.06] px-3 py-2.5">
            <p className="flex flex-wrap items-center justify-between gap-2 text-[12px]">
              <span><span className="mr-1.5 rounded-full bg-[#f1f3f7] px-1.5 text-[10px]">1</span><b>Hallazgos</b> <span className="text-[10px] text-[#5c646f]">Qué pasó en esta medición</span></span>
              <span className="flex gap-1 text-[9.5px]"><span className="text-[#5c646f]">3 lecturas</span><span className={`rounded px-1 ${CONF.Alta}`}>2 alta</span><span className={`rounded px-1 ${CONF.Media}`}>1 media</span></span>
            </p>
            <ul className="mt-2 divide-y divide-black/[0.06] rounded-xl ring-1 ring-black/[0.06]">
              {AI_READING.findings.map((r, i) => {
                const shown = step >= 2 + i
                const open = i === 0 && step >= 5
                return (
                  <li key={r.title} className="transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" style={{ opacity: shown ? 1 : 0, transform: shown ? 'none' : 'translateX(-12px)' }}>
                    <p className="flex items-center gap-2 px-3 py-2 text-[11.5px]">
                      <span className="w-3 text-[#979ba3]">{i + 1}</span>
                      <span className="min-w-0 flex-1 font-medium">{r.title}</span>
                      <span className={`rounded px-1.5 text-[9.5px] transition-transform duration-300 ${CONF[r.confidence] ?? ''} ${shown ? 'scale-100' : 'scale-0'}`}>{r.confidence}</span>
                      <span className={`text-[10px] text-[#979ba3] transition-transform ${open ? 'rotate-180' : ''}`}>⌄</span>
                    </p>
                    {'body' in r && (
                      <div className="grid transition-[grid-template-rows] duration-500" style={{ gridTemplateRows: open ? '1fr' : '0fr' }}>
                        <div className="overflow-hidden">
                          <div className="mx-3 mb-3 rounded-lg bg-[#f7f8fb] p-2.5 text-[10.5px] leading-relaxed">
                            <p>{r.body}</p>
                            <p className="mt-1.5 text-[#5c646f]">Evidencia</p>
                            <p className="font-medium">{r.evidence}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>

          {GROUPS.map((g) => (
            <p key={g.n} className="flex items-center justify-between gap-2 border-t border-black/[0.06] px-3 py-2.5 text-[12px] transition-opacity duration-500" style={{ opacity: step >= 6 ? 1 : 0 }}>
              <span><span className="mr-1.5 rounded-full bg-[#f1f3f7] px-1.5 text-[10px]">{g.n}</span><b>{g.title}</b> <span className="text-[10px] text-[#5c646f]">{g.hint}</span></span>
              <span className="text-[9.5px] text-[#5c646f]">{g.count} ›</span>
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}

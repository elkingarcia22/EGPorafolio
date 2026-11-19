'use client'

import { useEffect, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { CLIMA, NOM_SHELF, SHORTCUTS } from '@/lib/content/cases/encuestas/templates-real'
import { BrowserFrame } from './form-moments'
import { UBITS_BLUE } from './shared'

type Drawer = null | 'clima' | 'nom'
interface Frame {
  hover?: string
  press?: string
  drawer: Drawer
  length?: 'corta' | 'completa'
  ms: number
}

/** El recorrido: se pasa por los atajos, se abre Clima, se elige la completa, se cierra y se abre la NOM 035. */
const FRAMES: readonly Frame[] = [
  { drawer: null, ms: 900 },
  { hover: 'nom035', drawer: null, ms: 650 },
  { hover: 'cultura', drawer: null, ms: 650 },
  { hover: 'clima', drawer: null, ms: 700 },
  { hover: 'clima', press: 'clima', drawer: null, ms: 260 },
  { drawer: 'clima', length: 'corta', ms: 2200 },
  { drawer: 'clima', length: 'completa', ms: 2600 },
  { drawer: null, ms: 900 },
  { hover: 'nom035', drawer: null, ms: 700 },
  { hover: 'nom035', press: 'nom035', drawer: null, ms: 260 },
  { drawer: 'nom', ms: 3200 },
  { drawer: null, ms: 800 },
]

function useLoop(box: React.RefObject<HTMLElement | null>) {
  const { reducedMotion } = useA11y()
  const [i, setI] = useState(0)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = box.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.4 })
    io.observe(el)
    return () => io.disconnect()
  }, [box])
  useEffect(() => {
    if (reducedMotion || !visible) return
    const id = window.setTimeout(() => setI((v) => (v + 1) % FRAMES.length), FRAMES[i].ms)
    return () => window.clearTimeout(id)
  }, [i, visible, reducedMotion])
  const at = reducedMotion ? 5 : i
  // El último panel abierto hasta este paso: lo que muestra el panel se queda mientras sale deslizándose.
  const lastOpen = FRAMES.slice(0, at + 1).reverse().find((x) => x.drawer)?.drawer ?? 'clima'
  return { f: FRAMES[at], lastOpen }
}

function Figure({ value, label }: { value: string; label: string }) {
  return (
    <div className="px-3 first:pl-0">
      <p key={value} className="enc-fade text-[13px] font-bold tabular-nums">{value}</p>
      <p className="text-[10px] text-[#5c646f]">{label}</p>
    </div>
  )
}

function ClimaDrawer({ length }: { length: 'corta' | 'completa' }) {
  const chosen = CLIMA.lengths.find((l) => l.id === length) ?? CLIMA.lengths[0]
  return (
    <>
      <p className="border-b border-black/[0.07] px-3 py-1.5 text-[10px] text-[#5c646f]">‹ Volver a todas las plantillas</p>
      <div className="flex items-center gap-2.5 border-b border-black/[0.07] px-4 py-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={CLIMA.icon} alt="" width={32} height={32} className="h-8 w-8" />
        <div>
          <p className="text-[14px] font-semibold leading-tight">{CLIMA.name}</p>
          <p className="text-[10px] text-[#5c646f]">{CLIMA.route}</p>
        </div>
      </div>
      <div className="min-h-0 flex-1 space-y-3 overflow-hidden p-3 [mask-image:linear-gradient(180deg,#000_85%,transparent)]">
        <div className="rounded-xl border border-black/[0.07] bg-[#f6f7fb]">
          <p className="px-3 pt-2 text-[11px] font-semibold">Número de preguntas</p>
          <p className="px-3 text-[10px] text-[#5c646f]">Las dos tienen las mismas secciones: la completa suma preguntas en cada una.</p>
          <div className="m-1 mt-2 grid gap-1.5 rounded-lg bg-white p-2 sm:grid-cols-2">
            {CLIMA.lengths.map((l) => {
              const on = l.id === length
              return (
                <div key={l.id} className={`flex gap-2 rounded-lg border p-2 transition-colors duration-300 ${on ? 'border-[#0c5bef] bg-[#0c5bef]/[0.06]' : 'border-black/10'}`}>
                  <span className={`mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border transition-colors ${on ? 'border-[#0c5bef]' : 'border-black/25'}`}>
                    {on && <span className="encf-pop h-1.5 w-1.5 rounded-full bg-[#0c5bef]" />}
                  </span>
                  <span>
                    <span className="block text-[11px] font-medium">{l.questions} preguntas · {l.name}</span>
                    <span className="block text-[9.5px] leading-snug text-[#5c646f]">Unos {l.minutes} min. {l.for}</span>
                  </span>
                </div>
              )
            })}
          </div>
        </div>
        <div className="rounded-xl border border-black/[0.07] bg-[#f6f7fb]">
          <p className="px-3 pt-2 text-[11px] font-semibold"><span className="text-[#0c5bef]">◎</span> Objetivo</p>
          <p className="px-3 text-[10px] text-[#5c646f]">{CLIMA.objective}</p>
          <div className="m-1 mt-2 grid grid-cols-3 divide-x divide-black/10 rounded-lg bg-white p-2">
            <Figure value={String(CLIMA.sections)} label="Secciones" />
            <Figure value={String(chosen.questions)} label="Preguntas" />
            <Figure value={`${chosen.minutes} min`} label="Tiempo aproximado" />
          </div>
        </div>
        <div>
          <p className="text-[11px] font-semibold">Contenido</p>
          <p className="text-[10px] text-[#5c646f]">Abre una sección para ver sus preguntas y qué tipo de respuesta pide cada una.</p>
          <div className="mt-2 space-y-1.5">
            {CLIMA.content.map((s, i) => (
              <div key={s.title} className="rounded-lg border border-black/[0.07] bg-white px-2.5 py-1.5">
                <p className="flex items-center gap-2 text-[11px] font-semibold">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#ecf1fa] text-[10px] text-[#0c5bef]">{i + 1}</span>
                  {s.title}
                  <span key={length} className="enc-fade ml-auto text-[9.5px] font-normal text-[#5c646f]">{length === 'corta' ? 3 : 5} preguntas</span>
                </p>
                {'questions' in s && (
                  <ol className="mt-1.5 space-y-1 pl-7 text-[10px] text-[#414a5c]">
                    {s.questions.map((q) => <li key={q} className="list-decimal">{q}</li>)}
                  </ol>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-end border-t border-black/[0.07] p-2.5">
        <span className="rounded-lg px-3 py-1.5 text-[11px] font-medium text-white" style={{ background: UBITS_BLUE }}>Usar plantilla →</span>
      </div>
    </>
  )
}

function NomDrawer() {
  return (
    <>
      <div className="flex items-center gap-2.5 border-b border-black/[0.07] px-4 py-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ecf1fa] text-[13px] text-[#0c5bef]">▦</span>
        <div>
          <p className="text-[14px] font-semibold leading-tight">Crear con plantilla</p>
          <p className="text-[10px] text-[#5c646f]">Elige una para empezar tu encuesta.</p>
        </div>
      </div>
      <div className="min-h-0 flex-1 p-3">
        <div className="rounded-xl border-2 border-[#0c5bef]/40 bg-[#f6f7fb]">
          <div className="flex items-center gap-2 px-3 pt-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={NOM_SHELF.icon} alt="" width={20} height={20} className="h-5 w-5" />
            <p className="text-[11px] font-semibold">{NOM_SHELF.path}</p>
          </div>
          <p className="px-3 text-[10px] text-[#5c646f]">{NOM_SHELF.description}</p>
          <div className="m-1 mt-2 space-y-1 rounded-lg bg-white p-1.5">
            {NOM_SHELF.templates.map((tp) => (
              <div key={tp.name} className="flex items-center gap-2 rounded-md px-2 py-1.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={NOM_SHELF.icon} alt="" width={22} height={22} className="h-5 w-5" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[11px] font-medium">{tp.name}</span>
                  <span className="block text-[9.5px] text-[#5c646f]">{tp.sections} secciones · {tp.questions} preguntas · {tp.minutes} min</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

/** Momento 1: el inicio de Encuestas real, sus cinco atajos y lo que abre cada uno. */
export function TemplatesReal() {
  const box = useRef<HTMLDivElement>(null)
  const { f, lastOpen } = useLoop(box)
  return (
    <div ref={box}>
      <BrowserFrame route="/admin/desempeno-cultura/encuestas">
        <div className="relative h-[26rem] overflow-hidden bg-[linear-gradient(160deg,#fff,#f3f6fd)] sm:h-[28rem]">
          <div className={`p-4 transition-[filter,opacity] duration-500 sm:p-5 ${f.drawer ? 'opacity-60 blur-[2px]' : ''}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[20px] font-bold leading-tight">Encuestas</p>
                <p className="text-[11px] text-[#5c646f]">Aquí creas las encuestas de clima, cultura y eNPS de tu empresa y lees sus resultados.</p>
              </div>
              <p className="flex gap-1.5">
                <span className="rounded-lg border border-black/10 bg-white px-2 py-1 text-[10px]">Crear con plantilla</span>
                <span className="rounded-lg px-2 py-1 text-[10px] text-white" style={{ background: UBITS_BLUE }}>+ Crear encuesta</span>
              </p>
            </div>
            <p className="mt-3 flex gap-4 border-b border-black/10 text-[11px]"><span className="border-b-2 border-[#303a47] pb-1.5 font-medium">Encuestas</span><span className="text-[#5c646f]">Datos demográficos</span></p>
            <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5" aria-label="Crea algo nuevo">
              {SHORTCUTS.map((s) => {
                const hover = f.hover === s.id
                return (
                  <li
                    key={s.id}
                    className={`flex flex-col items-center gap-1.5 rounded-xl border bg-white px-2 py-3 text-center transition-[transform,box-shadow,border-color] duration-200 ${hover ? '-translate-y-0.5 border-[#0c5bef]/30 shadow-md' : 'border-black/10'} ${f.press === s.id ? 'scale-[0.97]' : ''}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.icon} alt="" width={40} height={40} className={`h-10 w-10 transition-transform duration-200 ${hover ? 'scale-105' : ''}`} draggable={false} />
                    <span className="text-[11px] font-medium leading-tight">{s.title}</span>
                    <span className="text-[9.5px] leading-tight text-[#5c646f]">{s.description}</span>
                  </li>
                )
              })}
            </ul>
            <div className="mt-4 rounded-xl border border-black/[0.07] bg-white/70 p-3">
              <p className="text-[11px] font-semibold">Para atender <span className="ml-1 rounded bg-[#ecf1fa] px-1 text-[9px] font-normal text-[#0c5bef]">Nuevo</span></p>
              <p className="mt-1.5 text-[10px] text-[#5c646f]"><span className="mr-1 rounded bg-[#fbe7e9] px-1 text-[#b02a37]">Alta</span>No cumple la participación de la norma · NOM 035 - Riesgo psicosocial</p>
            </div>
          </div>

          {/* El panel lateral de plantillas, como el DrawerShell del producto. */}
          <div className={`absolute inset-y-2 right-2 flex w-[min(24rem,calc(100%-1rem))] flex-col overflow-hidden rounded-xl bg-white shadow-[0_30px_60px_-20px_rgba(10,11,13,0.45)] ring-1 ring-black/10 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${f.drawer ? 'translate-x-0' : 'translate-x-[110%]'}`} aria-hidden={!f.drawer}>
            {lastOpen === 'clima' ? <ClimaDrawer length={f.length ?? 'completa'} /> : <NomDrawer />}
          </div>
        </div>
      </BrowserFrame>
    </div>
  )
}

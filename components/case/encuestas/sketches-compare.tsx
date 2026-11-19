'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { ENCUESTAS_CASE, SHOTS, type ShotKey } from '@/lib/content/cases/encuestas/case'
import type { Iteration } from '@/lib/content/cases/encuestas/types'
import { useMedia, zoomBox } from './shared'
import './patterns-sketches.css'

const INK = '#2a2d33'
const ACCENT = '#e8743b'

/** Una pieza del boceto en porcentajes de la captura: caja, línea o círculo. */
type Mark = { k: 'box' | 'line' | 'dot'; x: number; y: number; w?: number; h?: number; accent?: boolean }

interface Pin {
  x: number
  y: number
  label: L
}

interface Compare {
  shot: ShotKey
  marks: readonly Mark[]
  pins: readonly Pin[]
}

const blurList: readonly Mark[] = [
  { k: 'line', x: 3, y: 11, w: 18 },
  { k: 'box', x: 3, y: 27, w: 17, h: 14 },
  { k: 'box', x: 23, y: 27, w: 17, h: 14 },
  { k: 'line', x: 4, y: 72, w: 40 },
  { k: 'line', x: 4, y: 79, w: 36 },
  { k: 'line', x: 4, y: 86, w: 38 },
]

/** Cada iteración: su boceto dibujado sobre la captura real y lo que sobrevivió del papel a la plataforma. */
const COMPARES: Record<Iteration['shape'], Compare> = {
  chat: {
    shot: 'cargarAnaliza',
    marks: [
      ...blurList,
      { k: 'box', x: 50, y: 2, w: 48, h: 95 },
      { k: 'dot', x: 53, y: 5 },
      { k: 'line', x: 57, y: 5, w: 22 },
      { k: 'box', x: 54, y: 16, w: 30, h: 7 },
      { k: 'box', x: 64, y: 27, w: 31, h: 7, accent: true },
      { k: 'box', x: 54, y: 38, w: 26, h: 7 },
      { k: 'line', x: 60, y: 24, w: 28, accent: true },
      { k: 'box', x: 53, y: 88, w: 42, h: 6 },
    ],
    pins: [
      { x: 74, y: 5, label: { es: 'El chat se volvió un panel lateral: la lista sigue a la vista detrás.', en: 'The chat became a side panel: the list stays visible behind.' } },
      { x: 57, y: 20, label: { es: 'Cada burbuja quedó en una sola línea que dice qué hace la IA ahora.', en: 'Each bubble became one line saying what the AI is doing now.' } },
      { x: 86, y: 25, label: { es: 'Una sola barra de avance, con el nombre del archivo debajo.', en: 'One progress bar, with the file name below.' } },
    ],
  },
  drawer: {
    shot: 'cargarEstructura',
    marks: [
      ...blurList,
      { k: 'box', x: 50, y: 2, w: 48, h: 95 },
      { k: 'dot', x: 53, y: 18 },
      { k: 'line', x: 55, y: 18, w: 12 },
      { k: 'dot', x: 71, y: 18 },
      { k: 'line', x: 73, y: 18, w: 12 },
      { k: 'dot', x: 89, y: 18, accent: true },
      { k: 'box', x: 52, y: 34, w: 44, h: 20, accent: true },
      { k: 'box', x: 52, y: 58, w: 44, h: 15 },
      { k: 'box', x: 52, y: 76, w: 44, h: 10 },
      { k: 'box', x: 84, y: 93, w: 13, h: 4 },
    ],
    pins: [
      { x: 74, y: 18, label: { es: 'Archivos, datos generales y estructura: los tres pasos del papel.', en: 'Files, general data and structure: the three steps from paper.' } },
      { x: 74, y: 46, label: { es: 'Los indicadores se calculan del archivo antes de cargar nada.', en: 'Indicators are computed from the file before loading anything.' } },
      { x: 62, y: 77, label: { es: 'El match dudoso no se resuelve solo: lo decide la persona.', en: 'A doubtful match isn’t resolved alone: the person decides.' } },
      { x: 91, y: 95, label: { es: 'Un solo botón al final, cuando ya se revisó todo.', en: 'One button at the end, once everything is reviewed.' } },
    ],
  },
  tree: {
    shot: 'secciones',
    marks: [
      { k: 'line', x: 11, y: 11, w: 16 },
      { k: 'dot', x: 12, y: 22 },
      { k: 'line', x: 14, y: 22, w: 12 },
      { k: 'dot', x: 29, y: 22 },
      { k: 'line', x: 31, y: 22, w: 12 },
      { k: 'dot', x: 46, y: 22 },
      { k: 'line', x: 48, y: 22, w: 12 },
      { k: 'dot', x: 64, y: 22, accent: true },
      { k: 'dot', x: 81, y: 22 },
      { k: 'box', x: 11, y: 37, w: 56, h: 33 },
      { k: 'line', x: 15, y: 40, w: 22 },
      { k: 'line', x: 18, y: 49, w: 22, accent: true },
      { k: 'line', x: 18, y: 57, w: 22, accent: true },
      { k: 'box', x: 11, y: 73, w: 56, h: 8 },
      { k: 'box', x: 11, y: 85, w: 56, h: 8 },
      { k: 'box', x: 69, y: 28, w: 23, h: 66 },
      { k: 'line', x: 71, y: 52, w: 12 },
      { k: 'line', x: 72, y: 58, w: 12 },
      { k: 'line', x: 72, y: 65, w: 12 },
    ],
    pins: [
      { x: 64, y: 22, label: { es: 'Cinco pasos que se desbloquean en orden.', en: 'Five steps that unlock in order.' } },
      { x: 18, y: 49, label: { es: 'La numeración 1.1, 1.2 sale de la posición: nadie la escribe.', en: 'Numbering 1.1, 1.2 comes from position: nobody types it.' } },
      { x: 62, y: 67, label: { es: '«Agregar» ofrece subsección solo mientras quepa un nivel más.', en: '“Add” offers a subsection only while one more level fits.' } },
      { x: 80, y: 58, label: { es: 'El resumen vivo cuenta preguntas por sección a la derecha.', en: 'The live summary counts questions per section on the right.' } },
    ],
  },
  system: {
    shot: 'heatmap',
    marks: [
      { k: 'line', x: 13, y: 11, w: 30 },
      { k: 'line', x: 12, y: 21, w: 8 },
      { k: 'line', x: 21, y: 21, w: 8, accent: true },
      { k: 'line', x: 30, y: 21, w: 6 },
      { k: 'box', x: 11, y: 27, w: 81, h: 6 },
      { k: 'box', x: 11, y: 37, w: 26, h: 14 },
      { k: 'box', x: 39, y: 37, w: 26, h: 14 },
      { k: 'box', x: 66, y: 37, w: 26, h: 14 },
      { k: 'box', x: 11, y: 55, w: 81, h: 43 },
      { k: 'box', x: 40, y: 65, w: 5, h: 4 },
      { k: 'box', x: 46, y: 65, w: 5, h: 4 },
      { k: 'box', x: 52, y: 65, w: 5, h: 4 },
      { k: 'box', x: 74, y: 65, w: 5, h: 4, accent: true },
      { k: 'box', x: 80, y: 65, w: 5, h: 4, accent: true },
      { k: 'box', x: 86, y: 65, w: 5, h: 4, accent: true },
    ],
    pins: [
      { x: 23, y: 21, label: { es: 'Una pestaña por pregunta: participación, favorabilidad, preguntas, eNPS.', en: 'One tab per question: participation, favorability, questions, eNPS.' } },
      { x: 50, y: 30, label: { es: 'Si la encuesta sigue abierta, lo dice antes que cualquier número.', en: 'If the survey is still open, it says so before any number.' } },
      { x: 52, y: 44, label: { es: 'Tres tarjetas: el global, la distribución y dónde mirar primero.', en: 'Three cards: the total, the distribution and where to look first.' } },
      { x: 82, y: 67, label: { es: 'Los grupos bajo el mínimo se ven, pero con candado.', en: 'Groups below the minimum show, but locked.' } },
    ],
  },
}

/** Caja a mano alzada: esquinas que no cierran perfecto y un segundo trazo leve. */
function sketchBox(x: number, y: number, w: number, h: number): string {
  return `M${x + 0.6} ${y} L${x + w} ${y + 0.4} L${x + w - 0.3} ${y + h} L${x} ${y + h - 0.4} Z M${x + 1.2} ${y + 0.8} L${x + w - 0.8} ${y + 0.6}`
}

function Wire({ marks, ratio }: { marks: readonly Mark[]; ratio: number }) {
  const H = 100 / ratio
  return (
    <svg viewBox={`0 0 100 ${H}`} className="absolute inset-0 h-full w-full" aria-hidden="true">
      {marks.map((m, i) => {
        const y = (m.y / 100) * H
        const h = ((m.h ?? 0) / 100) * H
        const stroke = m.accent ? ACCENT : INK
        if (m.k === 'dot') return <circle key={i} cx={m.x} cy={y} r={1.4} fill="none" stroke={stroke} strokeWidth={0.45} />
        const d = m.k === 'box' ? sketchBox(m.x, y, m.w ?? 10, h) : `M${m.x} ${y} q ${(m.w ?? 10) / 2} -0.6 ${m.w ?? 10} 0.2`
        return <path key={i} d={d} fill="none" stroke={stroke} strokeWidth={m.accent ? 0.6 : 0.4} strokeLinecap="round" strokeLinejoin="round" />
      })}
    </svg>
  )
}

/** En el celular la comparación se ve casi cuadrada y acercada a la nota elegida, no la pantalla entera encogida. */
const MOBILE_RATIO = 1
const MOBILE_ZOOM = 2.2
/** En tableta, ventana apaisada y acercamiento suave. */
const TABLET_RATIO = 1.35
const TABLET_ZOOM = 1.6

/** Boceto encima, plataforma debajo: la cortina se arrastra (o se mueve con el teclado). */
function CompareSlider({ shape }: { shape: Iteration['shape'] }) {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const c = COMPARES[shape]
  const shot = SHOTS[c.shot]
  const [pos, setPos] = useState(55)
  const [pin, setPin] = useState<number | null>(null)
  const [picked, setPicked] = useState(0)
  const phone = useMedia('(max-width: 767px)')
  const mobile = useMedia('(max-width: 1023px)')
  const ref = useRef<HTMLDivElement>(null)

  // Al aparecer, la cortina barre de boceto a plataforma y vuelve al centro.
  useEffect(() => {
    const el = ref.current
    setPicked(0)
    if (!el || reducedMotion) return
    const state = { v: 100 }
    setPos(100)
    const tween = gsap.to(state, { v: 55, duration: 1.6, ease: 'expo.inOut', delay: 0.3, scrollTrigger: { trigger: el, start: 'top 75%', once: true }, onUpdate: () => setPos(state.v) })
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [shape, reducedMotion])

  // Ventana y acercamiento: en escritorio la captura entera; en el celular, acercada a la nota activa.
  const imageRatio = shot.width / shot.height
  const frameRatio = !mobile ? imageRatio : phone ? MOBILE_RATIO : TABLET_RATIO
  const focus = c.pins[mobile ? picked : (pin ?? picked)] ?? c.pins[0]
  const z = mobile ? zoomBox({ cx: focus.x, cy: focus.y, zoom: phone ? MOBILE_ZOOM : TABLET_ZOOM, frameRatio, imageRatio }) : { tx: 0, ty: 0, zoom: 1 }
  // La cortina vive en la ventana; el boceto, en la captura acercada: se traduce la posición de una a la otra.
  const paperPos = Math.min(100, Math.max(0, ((pos / 100 - z.tx) / z.zoom) * 100))
  const toFrame = (p: Pin) => ({ left: (z.tx + (z.zoom * p.x) / 100) * 100, top: (z.ty + (z.zoom * p.y) / 100 / imageRatio) * frameRatio * 100 })

  return (
    <div>
      <div ref={ref} className="relative overflow-hidden rounded-xl bg-white shadow-[0_30px_70px_-35px_rgba(10,11,13,0.6)] ring-1 ring-black/10" style={{ aspectRatio: frameRatio }}>
        <div
          className="absolute inset-x-0 top-0 origin-top-left transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ aspectRatio: `${shot.width} / ${shot.height}`, transform: mobile ? `translate(${z.tx * 100}%, ${z.ty * imageRatio * 100}%) scale(${z.zoom})` : undefined }}
        >
          <Image src={shot.src} alt={t(shot.alt)} fill sizes="(min-width: 1024px) 50vw, 220vw" className="object-cover" />
          <div className="enc-paper absolute inset-0" style={{ clipPath: `inset(0 ${100 - paperPos}% 0 0)` }}>
            <Wire marks={c.marks} ratio={imageRatio} />
            <span className="absolute left-3 top-3 -rotate-2 font-hand text-xl text-[#b0412a] max-md:origin-top-left max-md:scale-[0.5]">{t({ es: 'boceto', en: 'sketch' })}</span>
          </div>
        </div>
        <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-[#0c5bef] px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-white max-md:text-[11px]" style={{ opacity: pos > 88 ? 0 : 1 }}>
          {t({ es: 'plataforma', en: 'platform' })}
        </span>
        <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-[#0c5bef]" style={{ left: `${pos}%` }}>
          <span className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#0c5bef] text-sm text-white shadow-lg">⇆</span>
        </div>
        {c.pins.map((p, i) => {
          const at = toFrame(p)
          const inside = at.left > 2 && at.left < 98 && at.top > 2 && at.top < 98
          return (
            <button
              key={p.label.es}
              type="button"
              data-on={String(pin === i)}
              onMouseEnter={() => setPin(i)}
              onMouseLeave={() => setPin(null)}
              onFocus={() => !mobile && setPin(i)}
              onBlur={() => setPin(null)}
              onClick={() => setPicked(i)}
              aria-label={`${i + 1}. ${t(p.label)}`}
              className={`enc-pin absolute z-20 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-[#0c5bef] font-mono text-[11px] font-semibold text-white shadow-md transition-[left,top,opacity] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${pin === null ? 'enc-pin-pulse' : ''}`}
              style={{ left: `${at.left}%`, top: `${at.top}%`, opacity: inside ? 1 : 0, pointerEvents: inside ? undefined : 'none' }}
            >
              {i + 1}
            </button>
          )
        })}
        <input
          type="range"
          min={0}
          max={100}
          value={Math.round(pos)}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label={t({ es: 'Mover la cortina entre boceto y plataforma', en: 'Move the curtain between sketch and platform' })}
          className="absolute inset-x-0 bottom-0 z-10 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>
      <ol className="mt-4 space-y-2">
        {c.pins.map((p, i) => {
          const dim = mobile ? picked !== i : pin !== null && pin !== i
          return (
            <li key={p.label.es}>
              {/* En el celular cada nota es un botón que lleva la ventana a su punto. */}
              <button
                type="button"
                onClick={() => setPicked(i)}
                aria-pressed={mobile ? picked === i : undefined}
                tabIndex={mobile ? undefined : -1}
                className={`flex w-full gap-3 text-left text-sm leading-snug transition-opacity max-md:text-[15px] ${dim ? 'opacity-40' : ''} ${mobile ? '' : 'cursor-default'}`}
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0c5bef] font-mono text-[10px] text-white max-md:h-6 max-md:w-6 max-md:text-[11px]">{i + 1}</span>
                {t(p.label)}
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

/** Las cuatro iteraciones: pestañas, la comparación boceto ↔ plataforma y lo probado, descartado y conservado. */
export function IterationCompare() {
  const { t } = useLocale()
  const list = ENCUESTAS_CASE.iterations
  const [active, setActive] = useState(0)
  const it = list[active]
  const rows: readonly { k: L; v: L; c: string }[] = [
    { k: { es: 'Probamos', en: 'We tried' }, v: it.tried, c: 'rgb(var(--fg))' },
    { k: { es: 'Descartamos', en: 'We dropped' }, v: it.dropped, c: '#b0412a' },
    { k: { es: 'Se quedó', en: 'We kept' }, v: it.kept, c: '#2c6b2f' },
  ]
  return (
    <div data-reveal>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label={t({ es: 'Iteraciones', en: 'Iterations' })}>
        {list.map((x, i) => (
          <button key={x.id} type="button" role="tab" aria-selected={i === active} onClick={() => setActive(i)} className={`flex items-baseline gap-2 border px-3 py-2 text-left transition-colors ${i === active ? 'border-fg bg-fg text-bg' : 'border-fg/25 hover:border-fg/60'}`}>
            <span className="font-mono text-[10px] opacity-60">0{i + 1}</span>
            <span className="text-sm">{x.name}</span>
          </button>
        ))}
      </div>
      <div key={it.id} className="enc-fade mt-6 grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)]">
        <CompareSlider shape={it.shape} />
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider opacity-60">{t(it.when)}</p>
          <ol className="relative mt-5 space-y-6 border-l border-fg/20 pl-6">
            {rows.map((row) => (
              <li key={row.k.es} className="relative">
                <span className="absolute -left-[1.85rem] top-1.5 h-3 w-3 rounded-full border-2 border-bg" style={{ background: row.c }} />
                <p className="font-hand text-2xl leading-none" style={{ color: row.c }}>{t(row.k)}</p>
                <p className="mt-2 text-[15px] leading-relaxed">{t(row.v)}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}

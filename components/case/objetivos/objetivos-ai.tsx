'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'

/**
 * «Crear con IA» del constructor, con el orbe de la IA de UBITS (el mismo del
 * producto). Las dos preguntas y su respuesta, y los objetivos que devolvió la
 * plataforma, son los del staging (ciclo «KPIs corporativos 2026», 19 nov 2026).
 */
const INPUTS = [
  { tag: 'El reto', text: 'Perdemos clientes en el segundo año y conseguir uno nuevo cuesta cada vez más' },
  { tag: 'Al cierre', text: 'Los clientes se quedan más tiempo y crecemos sin subir el gasto en adquisición' },
] as const
const OUTPUTS = [
  { title: 'Subir la satisfacción de los clientes', measure: 'Porcentaje', range: '64 % → 74 %', up: true },
  { title: 'Aumentar la retención de los clientes', measure: 'Porcentaje', range: '68 % → 74 %', up: true },
  { title: 'Reducir los tickets de soporte sin resolver', measure: 'Numérico', range: '35 → 16', up: false },
  { title: 'Subir la satisfacción de los clientes', measure: 'Porcentaje', range: '69 % → 79 %', up: true },
] as const

/** El ciclo de la escena (ms): escribe las dos respuestas, el orbe piensa, salen los objetivos y se queda un rato */
const BEATS = { intro: 450, type: 1300, think: 1000, out: 320, hold: 2800 }
/** Al cerrar la vuelta, todo se desvanece suave antes de volver a empezar (ms) */
const FADE_MS = 500
/** Pasos: 0 nada · 1–2 cada respuesta entra al orbe · 3 piensa · 4–7 sale cada objetivo · 8 listo */
const THINK = INPUTS.length + 1
const LAST = THINK + OUTPUTS.length + 1

const msFor = (step: number) => (step === 0 ? BEATS.intro : step <= INPUTS.length ? BEATS.type : step === THINK ? BEATS.think : step < LAST ? BEATS.out : BEATS.hold)

/** Escribe un texto letra a letra mientras `on` */
function useTyped(text: string, on: boolean) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!on) return setN(0)
    // Una letra a la vez, a ritmo parejo: se lee como alguien que escribe, no como un bloque que aparece
    const id = window.setInterval(() => setN((v) => (v >= text.length ? (window.clearInterval(id), v) : v + 1)), 15)
    return () => window.clearInterval(id)
  }, [text, on])
  return text.slice(0, n)
}

type Pt = { x: number; y: number }
/** Fibra suave entre dos puntos: horizontal si van de lado a lado, vertical si van de arriba a abajo */
const fiber = (a: Pt, b: Pt) =>
  Math.abs(b.x - a.x) >= Math.abs(b.y - a.y)
    ? `M${a.x} ${a.y} C${(a.x + b.x) / 2} ${a.y} ${(a.x + b.x) / 2} ${b.y} ${b.x} ${b.y}`
    : `M${a.x} ${a.y} C${a.x} ${(a.y + b.y) / 2} ${b.x} ${(a.y + b.y) / 2} ${b.x} ${b.y}`

function InputPill({ tag, text, on, done }: { tag: string; text: string; on: boolean; done: boolean }) {
  const typed = useTyped(text, on || done)
  return (
    <div className={`rounded-2xl border px-4 py-3 text-left transition-[border-color,background-color,opacity,box-shadow] duration-700 ease-out ${on ? 'border-signal/50 bg-white/[0.07] shadow-[0_0_30px_-8px_rgb(var(--signal)/0.6)]' : done ? 'border-white/20 bg-white/[0.06]' : 'border-white/8 bg-white/[0.02] opacity-50'}`}>
      <p className="mono-label text-signal">{tag}</p>
      <p className="mt-1.5 min-h-[2.8em] text-[13px] leading-snug text-paper/85">
        {done ? text : typed}
        {on && typed.length < text.length && <span className="ml-0.5 inline-block h-[1em] w-px translate-y-[2px] animate-pulse bg-signal" />}
      </p>
    </div>
  )
}

/**
 * 05 · IA en el proceso: el orbe de la IA en el centro. Entran las dos
 * respuestas de quien arma el ciclo (cada una por su fibra), el orbe piensa y
 * salen, uno a uno, los objetivos con su medida. Se repite sola; tocar un
 * objetivo muestra su medida arriba.
 */
export function ObjetivosAi() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const rootRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const orbRef = useRef<HTMLDivElement>(null)
  const inRefs = useRef<(HTMLDivElement | null)[]>([])
  const outRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [step, setStep] = useState(reducedMotion ? LAST : 0)
  const [inView, setInView] = useState(false)
  const [picked, setPicked] = useState<number | null>(null)
  const [paths, setPaths] = useState<{ ins: string[]; outs: string[]; w: number; h: number }>({ ins: [], outs: [], w: 1, h: 1 })

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: '0px 0px -25% 0px' })
    io.observe(root)
    return () => io.disconnect()
  }, [])

  // El ciclo: entra, piensa, sale, se desvanece suave y vuelve a empezar
  const [fading, setFading] = useState(false)
  useEffect(() => {
    if (!inView || reducedMotion) return
    if (step >= LAST) {
      const fade = window.setTimeout(() => setFading(true), BEATS.hold)
      const restart = window.setTimeout(() => {
        setPicked(null)
        setStep(0)
        setFading(false)
      }, BEATS.hold + FADE_MS)
      return () => {
        window.clearTimeout(fade)
        window.clearTimeout(restart)
      }
    }
    const id = window.setTimeout(() => setStep((s) => s + 1), msFor(step))
    return () => window.clearTimeout(id)
  }, [inView, reducedMotion, step])

  // Las fibras se miden sobre las piezas reales (cambian de lugar entre escritorio y teléfono)
  useLayoutEffect(() => {
    const root = stageRef.current
    const orb = orbRef.current
    if (!root || !orb) return
    const measure = () => {
      const box = root.getBoundingClientRect()
      const o = orb.getBoundingClientRect()
      const center = { x: o.left + o.width / 2 - box.left, y: o.top + o.height / 2 - box.top }
      const side = (el: Element | null, toward: 'left' | 'right'): Pt => {
        const r = el?.getBoundingClientRect()
        if (!r) return center
        const stacked = Math.abs(r.left + r.width / 2 - (o.left + o.width / 2)) < r.width / 2
        if (stacked) return { x: r.left + r.width / 2 - box.left, y: (r.top < o.top ? r.bottom : r.top) - box.top }
        return { x: (toward === 'right' ? r.right : r.left) - box.left, y: r.top + r.height / 2 - box.top }
      }
      const edge = (p: Pt): Pt => {
        const dx = p.x - center.x
        const dy = p.y - center.y
        const len = Math.hypot(dx, dy) || 1
        const r = o.width / 2 + 6
        return { x: center.x + (dx / len) * r, y: center.y + (dy / len) * r }
      }
      const ins = inRefs.current.map((el) => {
        const a = side(el, 'right')
        return fiber(a, edge(a))
      })
      const outs = outRefs.current.map((el) => {
        const b = side(el, 'left')
        return fiber(edge(b), b)
      })
      setPaths({ ins, outs, w: box.width, h: box.height })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(root)
    return () => ro.disconnect()
  }, [])

  const thinking = step === THINK
  const shownOut = Math.max(0, Math.min(OUTPUTS.length, step - THINK))
  const done = step === LAST
  const caption =
    picked !== null
      ? { tag: `${t({ es: 'Objetivo', en: 'Goal' })} 0${picked + 1}`, title: OUTPUTS[picked].title, sub: `${OUTPUTS[picked].measure} · ${OUTPUTS[picked].up ? '↗' : '↘'} ${OUTPUTS[picked].range}` }
      : done
        ? { tag: t({ es: 'Listo', en: 'Ready' }), title: t({ es: '7 objetivos de la empresa, con dirección y medida.', en: '7 company goals, with direction and measure.' }) }
        : { tag: t({ es: 'Crear con IA', en: 'Create with AI' }), title: t({ es: 'Dos respuestas entran; salen objetivos que se pueden medir.', en: 'Two answers go in; measurable goals come out.' }) }

  return (
    <div ref={rootRef} className="relative mx-auto max-w-[1040px]">
      <p key={`${picked}-${done}`} className="obj-fade mx-auto flex min-h-[5.5rem] max-w-[52ch] flex-col items-center justify-end text-center">
        <span className="mono-label text-signal">{caption.tag}</span>
        <span className="mt-2 text-balance text-[clamp(1.2rem,0.95rem+1vw,1.75rem)] font-light leading-[1.2] tracking-tight">{caption.title}</span>
        {'sub' in caption && caption.sub && <span className="mt-1 text-sm text-paper/60">{caption.sub}</span>}
      </p>

      <div ref={stageRef} className="relative mt-10 transition-opacity duration-700 ease-out" style={{ opacity: fading ? 0 : 1 }}>
        {/* Las fibras: tenues de fondo, y se encienden cuando su pieza entra o sale del orbe */}
        <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" viewBox={`0 0 ${paths.w} ${paths.h}`} preserveAspectRatio="none">
          {[...paths.ins.map((d, i) => ({ d, on: step >= i + 1, live: step === i + 1, key: `i${i}`, ms: BEATS.type })), ...paths.outs.map((d, i) => ({ d, on: i < shownOut, live: i === shownOut - 1 && step < LAST, key: `o${i}`, ms: 500 }))].map(({ d, on, live, key, ms }) => (
            <g key={key}>
              <path d={d} fill="none" stroke="white" strokeOpacity={0.08} />
              {/* La fibra se tiende al ritmo de lo que viaja por ella (lo que se escribe entra mientras se escribe) */}
              <path d={d} fill="none" stroke="url(#ai-fiber)" strokeWidth={1.8} strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={on ? 0 : 1} style={{ transition: `stroke-dashoffset ${ms}ms cubic-bezier(.45,0,.25,1)`, filter: 'drop-shadow(0 0 4px rgb(123 92 255 / 0.6))' }} />
              {/* Mientras viaja algo, un impulso la recorre */}
              {live && !reducedMotion && (
                <path d={d} fill="none" stroke="white" strokeWidth={2.4} strokeLinecap="round" pathLength={1} strokeDasharray="0.06 0.94" className="dots-signal" style={{ filter: 'drop-shadow(0 0 5px white)' }} />
              )}
            </g>
          ))}
          <defs>
            <linearGradient id="ai-fiber" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#0c5bef" />
              <stop offset="0.5" stopColor="#7b5cff" />
              <stop offset="1" stopColor="#ff5ca8" />
            </linearGradient>
          </defs>
        </svg>

        <div className="relative grid items-center gap-10 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:gap-14">
          {/* Lo que responde quien arma el ciclo */}
          <div className="flex flex-col gap-4">
            {INPUTS.map((input, i) => (
              <div key={input.tag} ref={(el) => { inRefs.current[i] = el }}>
                <InputPill tag={input.tag} text={input.text} on={step === i + 1} done={step > i + 1} />
              </div>
            ))}
          </div>

          {/* El orbe de la IA de UBITS: respira siempre, y al pensar gira su halo y suelta ondas */}
          <div ref={orbRef} className="relative mx-auto grid h-[168px] w-[168px] place-items-center transition-transform duration-700 ease-out" style={{ transform: thinking ? 'scale(1.08)' : 'scale(1)' }}>
            <span aria-hidden="true" className="absolute inset-[-40%] rounded-full bg-[conic-gradient(from_200deg,#ff5ca8,#7b5cff,#0c5bef,#ff9a5c,#ff5ca8)] opacity-25 blur-3xl transition-opacity duration-700" style={{ opacity: thinking || done ? 0.45 : 0.22 }} />
            {thinking && !reducedMotion && (
              <>
                <span aria-hidden="true" className="absolute inset-0 rounded-full border border-[#b9a6ff]/60 animate-[nav-node-ping_1.3s_cubic-bezier(0,0,.2,1)_infinite]" />
                <span aria-hidden="true" className="absolute inset-0 rounded-full border border-[#ff9ac9]/50 animate-[nav-node-ping_1.3s_cubic-bezier(0,0,.2,1)_0.45s_infinite]" />
              </>
            )}
            {/* Del centro del orbe (por detrás) sale la fibra que baja hasta «Impacto» */}
            <span data-fiber-from="obj-impacto" aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-px w-px" />
            <Image
              src="/cases/objetivos/orbe-ia.png"
              alt={t({ es: 'El orbe de la IA de UBITS', en: 'The UBITS AI orb' })}
              width={168}
              height={168}
              priority={false}
              className={`relative rounded-full shadow-[0_20px_60px_-15px_rgb(123_92_255/0.8)] ${reducedMotion ? '' : 'animate-[orb-breathe_4.5s_ease-in-out_infinite]'}`}
            />
          </div>

          {/* Lo que devolvió: los objetivos, uno a uno, con su medida */}
          <div className="flex flex-col gap-2.5">
            {OUTPUTS.map((o, i) => {
              const on = i < shownOut
              return (
                <button
                  key={`${o.title}-${o.range}`}
                  ref={(el) => { outRefs.current[i] = el }}
                  type="button"
                  onClick={() => setPicked((p) => (p === i ? null : i))}
                  aria-pressed={picked === i}
                  className={`rounded-2xl bg-white px-4 py-2.5 text-left text-[#161a2c] shadow-[0_24px_50px_-25px_rgba(0,0,0,0.9)] transition-[transform,opacity,box-shadow] duration-700 ease-expo ${on ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'} ${picked === i ? 'ring-2 ring-[#ff5ca8]' : ''}`}
                >
                  <span className="block text-[13px] font-medium leading-snug">{o.title}</span>
                  <span className="mt-1 flex items-center gap-2 text-[11px] text-black/60">
                    <span className="rounded bg-black/[0.06] px-1.5 py-0.5">{o.measure}</span>
                    <span>{o.up ? '↗' : '↘'} {o.range}</span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

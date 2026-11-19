'use client'

import { useEffect, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { OBJ_CASE } from '@/lib/content/cases/objetivos/objetivos-case'

/**
 * Crear objetivos con IA, como lo hace el playground («Crear la estrategia con IA»,
 * paso 2 del constructor). Textos, opciones y resultado son los del staging
 * (ciclo «KPIs corporativos 2026», 19 nov 2026): el reto y la apuesta se escribieron
 * como ejemplo y lo demás es lo que devolvió la plataforma.
 */

const BLUE = '#0c5bef'
const ramp = 'animate-[ramp-in_0.5s_cubic-bezier(0.16,1,0.3,1)_both]'
const delay = (ms: number) => ({ animationDelay: `${ms}ms` })

/** Escribe un texto letra a letra desde un retraso. */
function useTyped(text: string, wait = 250, speed = 14): string {
  const { reducedMotion } = useA11y()
  const [n, setN] = useState(reducedMotion ? text.length : 0)
  useEffect(() => {
    if (reducedMotion) return setN(text.length)
    setN(0)
    let id = 0
    const start = window.setTimeout(() => {
      id = window.setInterval(() => setN((v) => (v >= text.length ? (window.clearInterval(id), v) : v + 2)), speed)
    }, wait)
    return () => {
      window.clearTimeout(start)
      window.clearInterval(id)
    }
  }, [text, wait, speed, reducedMotion])
  return text.slice(0, n)
}

function Caret({ on }: { on: boolean }) {
  return on ? <span className="ml-0.5 inline-block h-[1em] w-px translate-y-[2px] animate-pulse bg-[#0c5bef]" /> : null
}

/** La cabecera del panel de IA, igual en todos los pasos. */
function AiHead({ sub }: { sub: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-[conic-gradient(from_200deg,#ff5ca8,#7b5cff,#0c5bef,#ff9a5c,#ff5ca8)]" />
      <span>
        <span className="block text-[15px] font-medium">Crear la estrategia con IA</span>
        <span className="block text-[12px] text-black/55">{sub}</span>
      </span>
    </div>
  )
}

function Panel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`w-full max-w-[520px] rounded-2xl bg-gradient-to-br from-[#f1edff] via-white to-[#ffeef3] p-5 text-[#161a2c] shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9)] ring-1 ring-black/5 ${className}`}>{children}</div>
}

function TypedField({ label, text, hint, wait }: { label: string; text: string; hint?: string; wait?: number }) {
  const typed = useTyped(text, wait)
  return (
    <div>
      <p className="mb-1.5 text-[13px] font-medium">{label}</p>
      <div className="min-h-[3.4em] rounded-xl border-2 border-[#0c5bef]/70 bg-white px-3 py-2 text-[13px] shadow-[0_0_0_4px_rgba(12,91,239,0.12)]">
        {typed}
        <Caret on={typed.length < text.length} />
      </div>
      {hint && <p className="mt-1.5 text-[12px] text-black/50">{hint}</p>}
    </div>
  )
}

/* ── Las escenas: una cosa a la vez ── */

function SceneButton() {
  return (
    <div className="relative">
      <span className="relative z-10 flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[17px] font-medium text-[#161a2c] shadow-[0_20px_60px_-10px_rgba(123,92,255,0.9)] animate-[ramp-in_0.5s_cubic-bezier(0.16,1,0.3,1)_both]">
        <span className="h-5 w-5 rounded-full bg-[conic-gradient(from_200deg,#ff5ca8,#7b5cff,#0c5bef,#ff9a5c,#ff5ca8)]" />
        Crear con IA
      </span>
      <span className="pointer-events-none absolute -bottom-4 -right-4 h-10 w-10 animate-[tap-ping_1.2s_ease-out_0.5s_infinite] rounded-full border-2 border-white/80" aria-hidden="true" />
    </div>
  )
}

function SceneReto() {
  return (
    <Panel className={ramp}>
      <AiHead sub="Paso 1 de 2 · El problema. Escribe el reto y suma contexto solo si lo tienes a mano." />
      <div className="mt-4">
        <TypedField label="¿Cuál es el mayor reto de la empresa hoy?" text="Perdemos clientes en el segundo año y conseguir uno nuevo cuesta cada vez más" hint="El problema que, si se resuelve, mueve todo lo demás." />
      </div>
    </Panel>
  )
}

function SceneContexto() {
  return (
    <Panel className={ramp}>
      <p className="mb-2 text-[12px] text-black/50">Suma contexto si lo tienes (opcional):</p>
      <div className="mb-4 flex flex-wrap gap-1.5 text-[12px]">
        {['Qué la frena', 'En qué es buena', 'Qué pasa afuera', 'Qué no es prioridad'].map((c, i) => (
          <span key={c} className={`rounded-lg border px-2.5 py-1 transition-colors ${i === 0 ? 'border-[#0c5bef] bg-[#0c5bef] text-white' : 'border-black/15 bg-white'}`}>+ {c}</span>
        ))}
      </div>
      <TypedField label="Qué la frena" text="El servicio posventa tarda y nadie lo mide" wait={450} />
    </Panel>
  )
}

function SceneApuesta() {
  return (
    <Panel className={ramp}>
      <AiHead sub="Paso 2 de 2 · La apuesta. Solo la meta es obligatoria." />
      <div className="mt-4">
        <TypedField label="¿Qué tiene que ser verdad al cierre del ciclo?" text="Los clientes se quedan más tiempo y crecemos sin subir el gasto en adquisición" hint="El resultado, no las tareas: cómo se ve la empresa si el ciclo sale bien." />
      </div>
    </Panel>
  )
}

function SceneFrentes() {
  const fronts = ['Crecimiento', 'Rentabilidad', 'Clientes', 'Personas', 'Operación', 'Producto']
  return (
    <Panel className={ramp}>
      <p className="mb-3 text-[15px] font-medium">¿En qué frentes se juega?</p>
      <div className="flex flex-wrap gap-2 text-[13px]">
        {fronts.map((f, i) => {
          const on = f === 'Clientes'
          return (
            <span key={f} className={`${ramp} rounded-lg border px-3 py-1.5 ${on ? 'border-[#0c5bef]/40 bg-[#0c5bef]/10 text-[#0c5bef]' : 'border-black/15 bg-white'}`} style={delay(i * 70)}>
              {on ? '✓' : '+'} {f}
            </span>
          )
        })}
      </div>
      <p className={`${ramp} mt-3 text-[12px] text-black/50`} style={delay(500)}>Vienen marcados los que aparecen en tu diagnóstico. Hasta tres es lo recomendable.</p>
    </Panel>
  )
}

function Segmented({ options, on, wait }: { options: readonly string[]; on: string; wait: number }) {
  const [picked, setPicked] = useState(false)
  useEffect(() => {
    const id = window.setTimeout(() => setPicked(true), wait)
    return () => window.clearTimeout(id)
  }, [wait])
  return (
    <div className="flex rounded-xl border border-black/10 bg-white p-0.5 text-[13px]">
      {options.map((o) => (
        <span key={o} className={`flex-1 rounded-lg px-2 py-1.5 text-center transition-colors duration-300 ${picked && o === on ? 'bg-[#0c5bef] font-medium text-white' : 'text-black/70'}`}>{o}</span>
      ))}
    </div>
  )
}

function SceneCuantos() {
  return (
    <Panel className={ramp}>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-[15px] font-medium">¿Cuántos objetivos?</p>
          <Segmented options={['3', '4', '5']} on="4" wait={400} />
          <p className="mt-1.5 text-[12px] text-black/50">Lo habitual</p>
        </div>
        <div>
          <p className="mb-2 text-[15px] font-medium">¿Qué tan exigentes?</p>
          <Segmented options={['Conservador', 'Retador', 'Agresivo']} on="Retador" wait={900} />
          <p className="mt-1.5 text-[12px] text-black/50">Exige mejorar</p>
        </div>
      </div>
    </Panel>
  )
}

function SceneArmando() {
  const [s, setS] = useState(0)
  useEffect(() => {
    const id = window.setInterval(() => setS((v) => v + 1), 1000)
    return () => window.clearInterval(id)
  }, [])
  return (
    <Panel className={ramp}>
      <AiHead sub="Cruzamos el diagnóstico con la apuesta para proponer objetivos medibles." />
      <p className="mt-5 flex items-center gap-2.5 text-[14px]">
        <span className="h-4 w-4 animate-spin rounded-full bg-[conic-gradient(from_0deg,transparent,#7b5cff,#0c5bef)] [mask:radial-gradient(circle,transparent_45%,#000_46%)]" />
        Armando la estrategia… <span className="text-black/45">{s + 1}s</span>
      </p>
      <div className="mt-4 space-y-2">
        {[0, 1, 2].map((i) => (
          <span key={i} className="block h-3 overflow-hidden rounded-full bg-black/[0.05]">
            <span className="block h-full w-1/3 animate-[obj-shimmer_1.2s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-transparent via-[#7b5cff]/40 to-transparent" style={delay(i * 150)} />
          </span>
        ))}
      </div>
    </Panel>
  )
}

/** Lo que devolvió la plataforma con ese brief. */
const RESULT = [
  { title: 'Subir la satisfacción de los clientes', measure: 'Porcentaje', range: '64 % → 74 %', up: true },
  { title: 'Aumentar la retención de los clientes', measure: 'Porcentaje', range: '68 % → 74 %', up: true },
  { title: 'Reducir los tickets de soporte sin resolver', measure: 'Numérico', range: '35 → 16', up: false },
  { title: 'Subir la satisfacción de los clientes', measure: 'Porcentaje', range: '69 % → 79 %', up: true },
]

function SceneResultado() {
  return (
    <div className="w-full max-w-[520px] space-y-2">
      {RESULT.map((r, i) => (
        <div key={i} className={`${ramp} rounded-2xl bg-white px-4 py-3 text-[#161a2c] shadow-[0_24px_50px_-25px_rgba(0,0,0,0.9)]`} style={delay(i * 260)}>
          <p className="text-[14px] font-medium">{r.title}</p>
          <p className="mt-1 flex items-center gap-2 text-[12px] text-black/60">
            <span className="rounded bg-black/[0.06] px-1.5 py-0.5 text-[11px]">{r.measure}</span>
            <span>{r.up ? '↗' : '↘'} {r.range}</span>
          </p>
        </div>
      ))}
    </div>
  )
}

function SceneListo() {
  const items = ['Subir el margen bruto', 'Reducir la cartera vencida', 'Cumplir el presupuesto de gasto', ...RESULT.map((r) => r.title)]
  return (
    <div className={`${ramp} w-full max-w-[420px] rounded-2xl bg-white p-5 text-[#161a2c] shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9)]`}>
      <p className="text-[13px] text-black/50">Así va el ciclo</p>
      <p className="mt-1 text-[17px] font-medium">KPIs corporativos 2026</p>
      <ul className="mt-3 space-y-1.5 text-[13px]">
        {items.map((it, i) => (
          <li key={i} className={`flex items-center justify-between gap-3 ${i >= 3 ? ramp : ''}`} style={i >= 3 ? delay((i - 3) * 220) : undefined}>
            <span className="truncate">{i + 1}. {it}</span>
            <span className="shrink-0 rounded-full bg-[#17b26a]/12 px-2 py-0.5 text-[11px] text-[#067647]">✓ Listo</span>
          </li>
        ))}
      </ul>
      <p className={`${ramp} mt-3 text-[13px] text-[#067647]`} style={delay(1100)}>✓ 7 objetivos de la empresa listos.</p>
    </div>
  )
}

const SCENES: readonly { id: string; label: L; ms: number; Scene: () => JSX.Element }[] = [
  { id: 'boton', label: { es: 'Crear con IA', en: 'Create with AI' }, ms: 1500, Scene: SceneButton },
  { id: 'reto', label: { es: 'El reto', en: 'The challenge' }, ms: 2600, Scene: SceneReto },
  { id: 'contexto', label: { es: 'Contexto', en: 'Context' }, ms: 2200, Scene: SceneContexto },
  { id: 'apuesta', label: { es: 'La apuesta', en: 'The bet' }, ms: 2600, Scene: SceneApuesta },
  { id: 'frentes', label: { es: 'Frentes', en: 'Fronts' }, ms: 1900, Scene: SceneFrentes },
  { id: 'cuantos', label: { es: 'Cuántos y qué tan exigentes', en: 'How many and how demanding' }, ms: 1900, Scene: SceneCuantos },
  { id: 'armando', label: { es: 'Armando', en: 'Building' }, ms: 1700, Scene: SceneArmando },
  { id: 'resultado', label: { es: 'Objetivos', en: 'Goals' }, ms: 2600, Scene: SceneResultado },
  { id: 'listo', label: { es: 'Listos', en: 'Ready' }, ms: 2600, Scene: SceneListo },
]

/** 06 · IA en el proceso: crear objetivos con IA, una pieza a la vez. */
export function ObjetivosAi() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const [i, setI] = useState(0)
  const [pinned, setPinned] = useState(false)
  const [inView, setInView] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.4 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (pinned || reducedMotion || !inView) return
    const id = window.setTimeout(() => setI((v) => (v + 1) % SCENES.length), SCENES[i].ms)
    return () => window.clearTimeout(id)
  }, [i, pinned, reducedMotion, inView])

  const scene = SCENES[reducedMotion ? SCENES.length - 1 : i]

  return (
    <div>
      <p data-reveal className="max-w-[62ch] text-lg leading-relaxed opacity-80">{t(OBJ_CASE.ai.lead)}</p>

      <div ref={ref} data-reveal="device" className="relative mt-10 overflow-hidden rounded-3xl bg-[#0b0d16] text-white">
        <span className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[conic-gradient(from_200deg,#ff5ca8,#7b5cff,#0c5bef,#ff9a5c,#ff5ca8)] opacity-25 blur-3xl transition-transform duration-[1200ms] ease-expo" style={{ transform: `translate(-50%, -50%) rotate(${i * 40}deg) scale(${1 + (i % 3) * 0.08})` }} aria-hidden="true" />

        {/* El escenario: una sola pieza en primer plano. */}
        <div className="relative grid min-h-[420px] place-items-center px-4 py-12 md:min-h-[460px]">
          <div key={scene.id} className="grid w-full place-items-center">
            <scene.Scene />
          </div>
        </div>

        {/* La línea del flujo: marca dónde va y deja saltar a una pieza. */}
        <ol className="relative flex gap-1 border-t border-white/10 px-4 py-4 md:px-8">
          {SCENES.map((s, k) => (
            <li key={s.id} className="flex-1">
              <button
                type="button"
                onClick={() => {
                  setI(k)
                  setPinned(true)
                }}
                aria-current={k === i}
                aria-label={t(s.label)}
                className="group block w-full py-1 text-left"
              >
                <span className="relative block h-1 overflow-hidden rounded-full bg-white/15">
                  {k < i && <span className="absolute inset-0 bg-white/60" />}
                  {k === i && <span key={`${i}-${pinned}`} className="absolute inset-0 origin-left bg-gradient-to-r from-[#7b5cff] to-[#0c5bef]" style={pinned || reducedMotion ? undefined : { animation: `view-progress ${s.ms}ms linear both` }} />}
                </span>
                <span className={`mt-2 hidden truncate text-[11px] transition-colors md:block ${k === i ? 'text-white' : 'text-white/40 group-hover:text-white/70'}`}>{t(s.label)}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>

      <p className="mt-4 text-[12px] opacity-55">
        {t({ es: 'Recreado con los textos, las opciones y el resultado de «Crear la estrategia con IA» en el staging (KPIs corporativos 2026). El reto, el contexto y la apuesta son un ejemplo escrito para la prueba. En el prototipo la IA son reglas sobre el brief, sin modelo.', en: 'Recreated with the copy, options and result of “Create the strategy with AI” on staging (KPIs corporativos 2026). The challenge, context and bet are an example written for the test. In the prototype the AI is rules over the brief, no model.' })}
      </p>
    </div>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { ENCUESTAS_CASE } from '@/lib/content/cases/encuestas/case'

interface Track {
  name: L
  /** Escenario de referencia: punto de partida estimado → meta, y cuánto cambia */
  from: string
  to: string
  delta: string
  moves: L
  how: L
}

/**
 * Las metas del caso (case.ts › impact.goals), puestas como escenario de
 * referencia: el punto de partida es estimado. El módulo aún no corre con
 * clientes; con las cifras medidas solo se reemplazan estos valores.
 */
const TRACKS: readonly Track[] = [
  {
    name: { es: 'Armar un clima desde plantilla', en: 'Build a climate survey from a template' },
    from: '60 min',
    to: '42 min',
    delta: '−30 %',
    moves: { es: 'Plantillas con sus reglas, cinco pasos con resumen vivo y «Crear con IA».', en: 'Templates with their rules, five steps with a live summary and “Create with AI”.' },
    how: { es: 'Tiempo de «Crear» a publicar, en el registro de eventos.', en: 'Time from “Create” to publish, in the event log.' },
  },
  {
    name: { es: 'Participación', en: 'Participation' },
    from: '70 %',
    to: '75 %',
    delta: '+5 pp',
    moves: { es: 'Recordatorios por grupo, una página por tema y el avance visible al responder.', en: 'Per-group reminders, one page per topic and visible progress while answering.' },
    how: { es: 'Respuestas sobre participantes, en cada medición.', en: 'Answers over participants, in each measurement.' },
  },
  {
    name: { es: 'Línea base de un cliente nuevo', en: 'A new customer’s baseline' },
    from: '2 sem',
    to: '1 día',
    delta: '−13 días',
    moves: { es: 'La carga histórica: subir el archivo, confirmar lo detectado y cargarlo en segundo plano.', en: 'Historical upload: upload the file, confirm what was detected, load it in the background.' },
    how: { es: 'Días desde el alta hasta la primera medición comparable.', en: 'Days from onboarding to the first comparable measurement.' },
  },
]
const STEP_MS = 4200

/**
 * 07 · Impacto: arriba, el alcance cerrado (real). Debajo, tres pistas del
 * escenario de referencia: un punto viaja del antes a la meta. Pasan solas;
 * tocar una dice qué la mueve y cómo se mide.
 */
export function EncImpactTracks() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const rootRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const [active, setActive] = useState(0)
  const [hold, setHold] = useState(false)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: '0px 0px -25% 0px' })
    io.observe(root)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!inView || reducedMotion || hold) return
    const id = window.setTimeout(() => setActive((a) => (a + 1) % TRACKS.length), STEP_MS)
    return () => window.clearTimeout(id)
  }, [inView, reducedMotion, hold, active])

  const current = TRACKS[active]
  const arrived = reducedMotion || inView

  return (
    <div ref={rootRef} className="mx-auto max-w-[1000px]">
      {/* El alcance: lo que sí está cerrado y se puede contar */}
      <dl className="grid grid-cols-2 gap-y-8 md:grid-cols-4">
        {ENCUESTAS_CASE.impact.scope.map((f) => (
          <div key={f.label.es} className="px-3 text-center">
            <dt className="sr-only">{t(f.label)}</dt>
            <dd>
              <span className="block bg-gradient-to-b from-white to-white/60 bg-clip-text text-[clamp(2.2rem,1.4rem+2.6vw,3.8rem)] font-light leading-none text-transparent tabular-nums">{f.value}</span>
              <span className="mx-auto mt-3 block max-w-[24ch] text-[12px] leading-snug text-paper/55">{t(f.label)}</span>
            </dd>
          </div>
        ))}
      </dl>

      <p className="mt-20 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-paper/45">{t({ es: 'Escenario de referencia · metas para medir al salir', en: 'Reference scenario · goals to measure at launch' })}</p>

      {/* Las pistas: del antes a la meta */}
      <ul className="mx-auto mt-8 max-w-[880px] space-y-3">
        {TRACKS.map((tr, i) => {
          const on = i === active
          const pos = arrived && on ? 1 : 0
          return (
            <li key={tr.name.es}>
              <button
                type="button"
                onClick={() => {
                  setHold(true)
                  setActive(i)
                }}
                aria-pressed={on}
                className="group grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 py-3 text-left outline-none md:grid-cols-[14rem_minmax(0,1fr)_5rem]"
              >
                <span className={`text-[15px] leading-snug transition-opacity md:text-base ${on ? 'opacity-100' : 'opacity-55 group-hover:opacity-85'}`}>{t(tr.name)}</span>
                <span className={`order-last col-span-2 flex items-center gap-3 font-mono text-[11px] tabular-nums md:order-none md:col-span-1 ${on ? '' : 'opacity-50'}`}>
                  <span className="w-12 text-right text-paper/50">{tr.from}</span>
                  <span className="relative h-px flex-1 bg-white/15">
                    <span
                      className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white bg-signal shadow-[0_0_14px_3px_rgb(var(--signal)/0.6)] transition-[left] duration-[1400ms] ease-expo"
                      style={{ left: `${pos * 100}%` }}
                    />
                    {/* De la última pista sale la fibra hacia «Demo» */}
                    {i === TRACKS.length - 1 && <span data-fiber-from="enc-demo" aria-hidden="true" className="absolute left-1/2 top-1/2 h-px w-px" />}
                  </span>
                  <span className="w-12 text-paper">{tr.to}</span>
                </span>
                <span className={`justify-self-end rounded-full px-2.5 py-0.5 text-sm tabular-nums transition-colors ${on ? 'bg-signal text-on-signal' : 'border border-white/15 text-paper/60'}`}>{tr.delta}</span>
              </button>
            </li>
          )
        })}
      </ul>

      <div key={active} aria-live="polite" className="obj-fade mx-auto mt-8 grid max-w-[880px] gap-6 md:grid-cols-2">
        {[
          { tag: t({ es: 'Qué la mueve', en: 'What moves it' }), text: t(current.moves) },
          { tag: t({ es: 'Cómo se mide', en: 'How it’s measured' }), text: t(current.how) },
        ].map((col) => (
          <div key={col.tag} className="border-l border-white/12 pl-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-signal">{col.tag}</p>
            <p className="mt-2 text-sm leading-relaxed text-paper/75">{col.text}</p>
          </div>
        ))}
      </div>

      <p className="mx-auto mt-14 max-w-[60ch] text-balance text-center text-sm leading-relaxed text-paper/55">
        <span className="mr-2 text-lg font-light text-paper">0</span>
        {t({ es: 'descargas muestran un grupo por debajo del mínimo: no es una meta, es una regla del producto.', en: 'downloads show a group below the minimum: not a goal, a product rule.' })}
      </p>
    </div>
  )
}

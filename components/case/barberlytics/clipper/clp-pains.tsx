'use client'

import { useEffect, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { CLIPPER_CASE } from '@/lib/content/cases/barberlytics/clipper-case'
import { ClipperOrb } from '../clipper-orb'
import { AI, Caption, Lead, useAutoSteps, useInView } from './clp-kit'
import { Spine, usePhone } from './clp-phone-kit'

const PAINS = CLIPPER_CASE.pains
const ROWS = PAINS[0].rows.length
/** Pasos: 0 nada · 1–3 se repite agendar · 4–6 se repite saber · 7 Clipper lo vuelve una frase */
const LAST = ROWS * 2 + 1
const msFor = (s: number) => (s === 0 ? 500 : s === ROWS * 2 ? 1200 : 900)

const rowLabel = (r: string | L, t: (l: L) => string) => (typeof r === 'string' ? r : t(r))

interface LaneProps {
  lane: number
  shown: number
  collapsed: boolean
}

/** Un carril: el mismo camino repetido, fila tras fila, y al final una sola frase. */
function Lane({ lane, shown, collapsed }: LaneProps) {
  const { t } = useLocale()
  const pain = PAINS[lane]
  const color = lane === 0 ? AI[1] : AI[2]
  return (
    <div>
      <p className="mono-label text-paper/50">{t(pain.who)}</p>
      <div className="relative mt-4">
        <div className={`transition-all duration-700 ease-expo ${collapsed ? 'scale-[0.97] opacity-20 blur-[1px]' : ''}`}>
          {/* Los pasos, una sola vez arriba */}
          <div className="flex items-end gap-2 pb-3">
            <span className="w-16 shrink-0 sm:w-[6.5rem]" />
            <span className="mx-5 flex flex-1 justify-between">
              {pain.steps.map((s, k) => (
                <span key={k} className="w-0 whitespace-nowrap text-center font-mono text-[8px] uppercase tracking-normal text-paper/60 sm:tracking-[0.08em]">
                  <span className="inline-block -translate-x-1/2">{t(s)}</span>
                </span>
              ))}
            </span>
          </div>
          {/* Y el mismo camino, fila tras fila */}
          <ul className="space-y-4">
            {pain.rows.map((r, i) => (
              <li key={i} className={`flex items-center gap-2 transition-all duration-500 ease-expo ${i < shown ? 'translate-x-0 opacity-100' : '-translate-x-3 opacity-0'}`}>
                <span className="w-16 shrink-0 sm:w-[6.5rem] truncate text-[12px] text-paper/70 sm:text-[13px]">{rowLabel(r, t)}</span>
                <span className="relative mx-5 flex flex-1 items-center justify-between">
                  <span className="absolute inset-x-0 top-1/2 h-px origin-left transition-transform duration-700 ease-expo" style={{ background: `${color}66`, transform: i < shown ? 'scaleX(1)' : 'scaleX(0)' }} />
                  {pain.steps.map((_, k) => (
                    <span key={k} className="relative w-0">
                      <span className="block h-2.5 w-2.5 -translate-x-1/2 rounded-full border border-white/70 transition-colors duration-300" style={{ background: i < shown ? color : 'rgb(var(--void))', boxShadow: i < shown ? `0 0 8px ${color}` : 'none', transitionDelay: `${k * 90}ms` }} />
                    </span>
                  ))}
                </span>
              </li>
            ))}
          </ul>
        </div>
        {/* Lo mismo, dicho en una frase a Clipper */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-expo ${collapsed ? 'scale-100 opacity-100' : 'pointer-events-none scale-95 opacity-0'}`}>
          <span className="relative flex items-center gap-3 rounded-full border border-white/15 bg-[rgb(var(--void))]/80 py-2 pl-2 pr-5 backdrop-blur">
            <ClipperOrb size={34} state="listening" />
            <span className="text-[15px] sm:text-[17px]">{t(pain.said)}</span>
            {lane === 1 && <span data-fiber-from="clp-idea" className="absolute left-[19px] top-1/2 h-px w-px" />}
          </span>
        </div>
      </div>
    </div>
  )
}

/**
 * 02 · Patrones: lo que se repetía en las barberías. Agendar era el mismo
 * camino largo con cada cliente, y saber algo del negocio costaba tres
 * pantallas por pregunta. Al final, cada carril se vuelve una sola frase.
 */
export function ClipperPains() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const rootRef = useRef<HTMLDivElement>(null)
  const inView = useInView(rootRef)
  const [step] = useAutoSteps({ last: LAST, ms: msFor, run: inView, reducedMotion, loopAfter: 5200 })
  const phone = usePhone()
  const collapsed = step === LAST
  const shownA = Math.min(ROWS, step)
  const shownB = Math.max(0, Math.min(ROWS, step - ROWS))

  const caption = collapsed
    ? { id: 'done', tag: t({ es: 'El patrón', en: 'The pattern' }), title: t({ es: 'Los mismos pasos, una y otra vez. Ahí cabía una sola frase.', en: 'The same steps, again and again. One sentence could fit there.' }) }
    : step > ROWS
      ? { id: 'b', tag: t(PAINS[1].who), title: t(PAINS[1].title) }
      : { id: 'a', tag: t(PAINS[0].who), title: t(PAINS[0].title) }

  return (
    <div ref={rootRef}>
      <Caption {...caption} />
      <Lead>{t({ es: 'Lo que más se repetía al ver trabajar a recepción y a los dueños: agendar y preguntar.', en: 'What repeated most watching front desks and owners work: booking and asking.' })}</Lead>
      {phone ? (
        <PainsColumn step={step} reducedMotion={reducedMotion} />
      ) : (
        <div className="mx-auto mt-12 grid max-w-[980px] gap-12 lg:grid-cols-2 lg:gap-16">
          <Lane lane={0} shown={shownA} collapsed={collapsed} />
          <Lane lane={1} shown={shownB} collapsed={collapsed} />
        </div>
      )}
    </div>
  )
}

/** Cada paso del camino se enciende tras el anterior (ms) */
const WALK_MS = 150

/**
 * Patrones en el teléfono: un carril a la vez. Los pasos bajan en columna y
 * se recorren enteros con cada cliente (o con cada pregunta), uno tras otro;
 * al final, los dos carriles se vuelven una frase dicha a Clipper.
 */
function PainsColumn({ step, reducedMotion }: { step: number; reducedMotion: boolean }) {
  const { t } = useLocale()
  const collapsed = step === LAST
  const lane = step > ROWS ? 1 : 0
  const row = Math.max(0, Math.min(ROWS, lane === 0 ? step : step - ROWS) - 1)
  const started = lane === 1 || step > 0
  const pain = PAINS[lane]
  const color = lane === 0 ? AI[1] : AI[2]

  // Con cada fila, el camino se recorre de nuevo desde el primer paso.
  const [walk, setWalk] = useState(reducedMotion ? pain.steps.length : 0)
  useEffect(() => {
    if (reducedMotion) {
      setWalk(pain.steps.length)
      return
    }
    if (!started) {
      setWalk(0)
      return
    }
    setWalk(0)
    let k = 0
    const id = window.setInterval(() => {
      k += 1
      setWalk(k)
      if (k >= pain.steps.length) window.clearInterval(id)
    }, WALK_MS)
    return () => window.clearInterval(id)
  }, [lane, row, started, reducedMotion, pain.steps.length])

  return (
    <div className="mx-auto mt-10 w-full max-w-[420px]">
      {/* Los dos carriles: se ve uno a la vez */}
      <div className="flex gap-2" aria-hidden="true">
        {PAINS.map((p, i) => (
          <span key={i} className={`grid flex-1 place-items-center rounded-xl border px-2 py-2 text-center font-mono text-[11px] uppercase leading-tight tracking-[0.08em] transition-colors duration-500 ${!collapsed && lane === i ? 'text-paper' : 'border-white/10 text-paper/60'}`} style={!collapsed && lane === i ? { borderColor: i === 0 ? AI[1] : AI[2] } : undefined}>
            {t(p.who)}
          </span>
        ))}
      </div>

      <div className="relative mt-6 min-h-[22rem]">
        {collapsed ? (
          <div className="clp-fade flex min-h-[22rem] flex-col justify-center gap-4">
            {PAINS.map((p, i) => (
              <span key={i} className="flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.04] py-2 pl-2 pr-5">
                <ClipperOrb size={36} state="listening" />
                <span className="text-[16px] leading-snug">{t(p.said)}</span>
              </span>
            ))}
            <p className="mt-2 text-center text-[14px] text-paper/55">{t({ es: 'Una frase en vez del camino entero.', en: 'One sentence instead of the whole path.' })}</p>
          </div>
        ) : (
          <div key={lane} className="clp-fade">
            <div className="flex items-baseline justify-between gap-3">
              <span key={row} className="clp-fade text-[20px] font-light">{started ? rowLabel(pain.rows[row], t) : '…'}</span>
              <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-paper/60">
                {row + 1} {t({ es: 'de', en: 'of' })} {ROWS}
              </span>
            </div>
            {/* Las veces que ya se recorrió: una marca por cada una */}
            <div className="mt-2 flex gap-1.5" aria-hidden="true">
              {pain.rows.map((_, i) => (
                <span key={i} className="h-1 flex-1 rounded-full transition-colors duration-500" style={{ background: started && i <= row ? color : 'rgb(255 255 255 / 0.1)' }} />
              ))}
            </div>
            <div className="mt-6">
              <Spine
                reducedMotion={reducedMotion}
                gap="pb-2"
                items={pain.steps.map((s, k) => ({
                  id: `${k}`,
                  color,
                  lit: k < walk,
                  hot: k === walk - 1,
                  children: <span className={`block pt-2.5 text-[16px] transition-colors duration-300 ${k < walk ? 'text-paper/90' : 'text-paper/35'}`}>{t(s)}</span>,
                }))}
              />
            </div>
          </div>
        )}
      </div>
      {/* De aquí baja la fibra hacia «La idea» */}
      <span data-fiber-from="clp-idea" className="mx-auto block h-px w-px" />
    </div>
  )
}

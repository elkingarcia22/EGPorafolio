'use client'

import { useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { CLIPPER_CASE } from '@/lib/content/cases/barberlytics/clipper-case'
import { ClipperOrb } from '../clipper-orb'
import { AI, Caption, Lead, RED, onActivate, useAutoSteps, useInView } from './clp-kit'

const { products, zones, clipperAt } = CLIPPER_CASE.patterns
/** Fila de cada nombre sobre la línea, para que los vecinos no se pisen */
const ROWS = [0, 1, 0, 1, 2, 0, 1] as const
/** Pasos: cae cada producto sobre la línea; luego Clipper se ubica en el medio */
const LAST = products.length + 1
const msFor = (s: number) => (s === 0 ? 500 : s < products.length ? 220 : 700)
const ZONE_OF_CLIPPER = Math.floor(clipperAt * zones.length)

/** Un nombre en el borde se alinea hacia adentro para no salirse */
const anchor = (at: number) => (at < 0.12 ? 'translate-x-[-12%]' : at > 0.9 ? 'translate-x-[-88%]' : '-translate-x-1/2')

/** Dónde cae el punto dentro del nombre (en %), según cómo se alinea */
const anchorAt = (at: number) => (at < 0.12 ? 12 : at > 0.9 ? 88 : 50)

/**
 * 02 · Patrones: una sola línea, de «solo ayuda» a «actúa solo». Caen sobre
 * ella los asistentes comparados (en rojo, los que más quejas acumulan) y al
 * final el orbe de Clipper se desliza hasta el medio: propone; una persona aplica.
 */
export function ClipperSpectrum() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const rootRef = useRef<HTMLDivElement>(null)
  const inView = useInView(rootRef)
  const [step] = useAutoSteps({ last: LAST, ms: msFor, run: inView, reducedMotion })
  const [picked, setPicked] = useState<number | null>(null)
  const done = step === LAST

  const caption =
    picked !== null
      ? { id: `p${picked}`, tag: products[picked].name, title: t(products[picked].note), sub: t(zones[Math.min(zones.length - 1, Math.floor(products[picked].at * zones.length))].label) }
      : done
        ? { id: 'done', tag: 'Clipper', title: t({ es: 'En el medio: responde con datos y propone; una persona aplica.', en: 'In the middle: answers with data and proposes; a person applies.' }) }
        : { id: 'intro', tag: t({ es: '15 productos comparados', en: '15 products compared' }), title: t({ es: '¿Cuánto deja actuar a la máquina cada asistente?', en: 'How much does each assistant let the machine act?' }) }

  return (
    <div ref={rootRef}>
      <Caption {...caption} />
      <Lead>{t({ es: 'Asistentes de barbería y salón junto a calendarios con IA. Las quejas se amontonan en los dos extremos.', en: 'Barbershop and salon assistants next to AI calendars. Complaints pile up at both ends.' })}</Lead>

      <div className="relative mx-auto mt-14 w-full max-w-[920px] px-2">
        {/* Los nombres, en tres filas sobre la línea */}
        <div className="relative h-[5.5rem]">
          {products.map((p, i) => {
            const on = i < step
            return (
              <button
                key={p.name}
                type="button"
                onClick={() => setPicked(picked === i ? null : i)}
                aria-pressed={picked === i}
                className={`absolute whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.08em] transition-all duration-500 ease-expo sm:text-[11px] ${anchor(p.at)} ${on ? 'opacity-100' : 'translate-y-2 opacity-0'} ${picked === i ? 'text-paper' : p.bad ? 'text-[#ff9aa0]' : 'text-paper/60'} hover:text-paper`}
                style={{ left: `${p.at * 100}%`, bottom: `${ROWS[i] * 1.6}rem` }}
              >
                {p.name}
                {/* Un hilo fino del nombre a su punto en la línea */}
                <span aria-hidden="true" className="pointer-events-none absolute top-full w-px bg-white/15" style={{ left: `${anchorAt(p.at)}%`, height: `calc(${ROWS[i] * 1.6}rem + 2rem)` }} />
              </button>
            )
          })}
        </div>

        {/* La línea: tenue de fondo y, encima, la zona del medio que se enciende al final */}
        <div className="relative h-16">
          <div className="absolute inset-x-0 top-1/2 h-px bg-white/15" />
          <div
            className="absolute top-1/2 h-[3px] -translate-y-1/2 rounded-full transition-opacity duration-700"
            style={{ left: `${(ZONE_OF_CLIPPER / zones.length) * 100}%`, width: `${100 / zones.length}%`, opacity: done ? 1 : 0, backgroundImage: `linear-gradient(90deg,${AI.join(',')})`, boxShadow: `0 0 18px ${AI[1]}` }}
          />
          {products.map((p, i) => {
            const on = i < step
            return (
              <span
                key={p.name}
                role="button"
                tabIndex={0}
                aria-label={p.name}
                onClick={() => setPicked(picked === i ? null : i)}
                onKeyDown={onActivate(() => setPicked(picked === i ? null : i))}
                className="absolute top-1/2 z-10 grid h-7 w-7 -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center outline-none"
                style={{ left: `${p.at * 100}%` }}
              >
                <span
                  className={`block h-3 w-3 rounded-full border transition-all duration-500 ease-expo ${on ? 'scale-100 opacity-100' : '-translate-y-6 scale-50 opacity-0'} ${picked === i ? 'border-white bg-white' : p.bad ? 'border-white/70' : 'border-white/70 bg-[rgb(var(--void))]'}`}
                  style={p.bad && picked !== i ? { background: RED, boxShadow: `0 0 12px ${RED}` } : undefined}
                />
              </span>
            )
          })}
          {/* Clipper: entra por la izquierda y se desliza hasta el medio */}
          <span
            className="pointer-events-none absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${(done ? clipperAt : 0) * 100}%`, opacity: step >= products.length ? 1 : 0, transition: 'left 1.1s cubic-bezier(.65,0,.35,1), opacity .4s' }}
          >
            <ClipperOrb size={44} state={done ? 'idle' : 'listening'} />
            <span data-fiber-from="clp-idea" className="absolute left-1/2 top-1/2 h-px w-px" />
          </span>
        </div>

        {/* Las cuatro zonas, debajo */}
        <div className="mt-2 grid grid-cols-4 gap-2">
          {zones.map((z, i) => (
            <div key={z.id} className={`text-center transition-colors duration-700 ${done && i === ZONE_OF_CLIPPER ? 'text-[#f0ce86]' : 'text-paper/45'}`}>
              <p className="font-mono text-[9px] uppercase leading-snug tracking-[0.1em] sm:text-[11px]">{t(z.label)}</p>
              <p className="mt-1 hidden text-[12px] leading-snug text-paper/40 sm:block">{t(z.note)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

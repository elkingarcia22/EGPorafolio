'use client'

import { useEffect, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { CaseLead } from '@/components/case/case-lead'
import { useCompact } from './camera'
import { Scaled, DetailScene } from './forma-stage'
import { A1_LOOP, MAP_H, MAP_W, SearchMap } from './forma-a1-map'
import { SearchRadarMobile } from './forma-a1-radar-mobile'
import { A2_LOOP, PeopleRadar, RADAR_H, RADAR_W } from './forma-a2-radar'
import { PeopleRadarMobile } from './forma-a2-radar-mobile'
import { FAN_H, FAN_W, FanScene, fanView } from './forma-a3-fan'
import type { Channel } from './forma-a3-devices'

/** Los ticks de las réplicas: 0,56 s, como en el resto del caso */
const TICK_MS = 560
/** Vueltas de la escena del agente 3 (el mensaje que se abre en abanico) */
const A3_LOOP = 24
/** Si la persona elige un agente, se queda en él al menos esto (ms) */
const RESUME_MS = 12000

interface Station {
  id: string
  name: L
  line: L
  loop: number
  /** Momento quieto con movimiento reducido: uno que cuenta la escena completa */
  still: number
}

const STATIONS: readonly Station[] = [
  { id: 'a1', name: { es: 'Agente 1 · Empresas', en: 'Agent 1 · Companies' }, line: { es: 'Recorre los países, primero lo gratis, y marca las empresas que encajan.', en: 'Sweeps the countries, free first, and marks the companies that fit.' }, loop: A1_LOOP, still: 9 },
  { id: 'a2', name: { es: 'Agente 2 · Contactos', en: 'Agent 2 · Contacts' }, line: { es: 'Barre las fuentes en cascada hasta dar con quien decide.', en: 'Sweeps the sources in a cascade until it finds who decides.' }, loop: A2_LOOP, still: 11 },
  { id: 'a3', name: { es: 'Agente 3 · Primer contacto', en: 'Agent 3 · First contact' }, line: { es: 'Cita cada dato y escribe un mensaje por canal.', en: 'Cites every fact and writes one message per channel.' }, loop: A3_LOOP, still: 12 },
]

/** Un reloj (en ticks) que solo corre mientras la pieza está a la vista */
function useStationClock(ref: React.RefObject<HTMLElement | null>, reducedMotion: boolean): number {
  const [inView, setInView] = useState(false)
  const [time, setTime] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: '0px 0px -20% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [ref])
  useEffect(() => {
    if (!inView || reducedMotion) return
    const id = window.setInterval(() => setTime((n) => n + 1), TICK_MS)
    return () => window.clearInterval(id)
  }, [inView, reducedMotion])
  return time
}

/** La escena real de cada agente, a su tamaño en escritorio y encuadrada en teléfono */
function Scene({ index, time }: { index: number; time: number }) {
  const compact = useCompact()
  const [channel, setChannel] = useState<Channel>('email')
  if (index === 0) return compact ? <SearchRadarMobile t={time} /> : <Scaled width={MAP_W} height={MAP_H}><SearchMap t={time} /></Scaled>
  if (index === 1) return compact ? <PeopleRadarMobile t={time} /> : <Scaled width={RADAR_W} height={RADAR_H}><PeopleRadar t={time} /></Scaled>
  return <DetailScene width={FAN_W} height={FAN_H} view={compact ? fanView(time, channel) : undefined}><FanScene u={time} onChannel={setChannel} /></DetailScene>
}

/**
 * La forma (dentro de «04 · Bocetos y forma»): los tres agentes construidos,
 * en una sola pieza. Arriba, la fibra con un nodo por agente; abajo, la
 * pantalla real de ese agente trabajando. Cuando su escena da la vuelta, pasa
 * sola al siguiente; tocar un nodo lo elige.
 */
export function SellUpForm() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const rootRef = useRef<HTMLDivElement>(null)
  const raw = useStationClock(rootRef, reducedMotion)
  /** El agente a la vista y el tick en que empezó su escena */
  const [at, setAt] = useState({ index: 0, start: 0 })
  const [held, setHeld] = useState(false)
  const { index } = at
  const station = STATIONS[index]
  const elapsed = raw - at.start
  const time = reducedMotion ? station.still : elapsed % station.loop

  // Al terminar su vuelta, el agente le pasa el turno al siguiente (salvo que se haya elegido uno).
  useEffect(() => {
    if (reducedMotion || held || elapsed < station.loop) return
    setAt({ index: (index + 1) % STATIONS.length, start: raw })
  }, [elapsed, raw, index, station.loop, held, reducedMotion])

  // Lo elegido se queda una vuelta más y luego vuelve a pasar solo.
  useEffect(() => {
    if (!held) return
    const id = window.setTimeout(() => setHeld(false), RESUME_MS)
    return () => window.clearTimeout(id)
  }, [held, index])

  const fill = index / (STATIONS.length - 1)

  return (
    <div ref={rootRef}>
      <CaseLead className="mb-10">{t({ es: 'Lo construido: los tres agentes en sus pantallas reales, uno tras otro.', en: 'What got built: the three agents on their real screens, one after another.' })}</CaseLead>

      {/* La fibra de los tres agentes: el nodo del que está trabajando, encendido */}
      <ol className="relative mx-auto grid max-w-[820px] grid-cols-3">
        <span aria-hidden="true" className="absolute inset-x-[16.6%] top-[7px] h-px bg-white/12" />
        <span aria-hidden="true" className="absolute left-[16.6%] top-[7px] h-px w-[66.8%] origin-left bg-gradient-to-r from-[#285ee6] via-[#7e2be0] to-[#d22d6a] shadow-[0_0_10px_rgb(var(--signal)/0.7)] transition-transform duration-700 ease-out" style={{ transform: `scaleX(${fill})` }} />
        {STATIONS.map((s, i) => {
          const on = i === index
          return (
            <li key={s.id} className="relative flex flex-col items-center">
              <button
                type="button"
                aria-pressed={on}
                onClick={() => {
                  setAt({ index: i, start: raw })
                  setHeld(true)
                }}
                className="group flex flex-col items-center outline-none"
              >
                <span className="relative grid h-3.5 w-3.5 place-items-center" aria-hidden="true">
                  <span className={`absolute inset-0 rounded-full border transition-all duration-500 ${on ? 'scale-125 border-white bg-[#fffaf0] shadow-[0_0_0_4px_rgb(var(--signal)/0.25),0_0_18px_4px_rgb(var(--signal)/0.7)]' : i < index ? 'border-white/60 bg-signal' : 'border-white/35 bg-void'}`} />
                  {on && <span className="absolute inset-[-7px] rounded-full border border-signal/60 animate-[nav-node-ping_2.2s_cubic-bezier(0,0,.2,1)_infinite]" />}
                </span>
                <span className={`mt-3 text-balance text-center text-[13px] leading-tight transition-opacity duration-500 ${on ? 'opacity-100' : 'opacity-45 group-hover:opacity-80'}`}>{t(s.name)}</span>
              </button>
            </li>
          )
        })}
      </ol>
      <p key={station.id} className="su-fade mx-auto mt-5 max-w-[52ch] text-balance text-center text-sm text-paper/60">{t(station.line)}</p>

      {/* La pantalla real del agente; de detrás de ella sale la fibra hacia «IA en el proceso» */}
      <div className="relative mt-8">
        <span data-fiber-from="su-ia" aria-hidden="true" className="pointer-events-none absolute bottom-0 left-1/2 h-px w-px" />
        <div key={station.id} className="su-fade relative">
          <Scene index={index} time={time} />
        </div>
        <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-white/35">{t({ es: 'Réplica de la pantalla real · datos de ejemplo', en: 'Replica of the real screen · sample data' })}</p>
      </div>
    </div>
  )
}

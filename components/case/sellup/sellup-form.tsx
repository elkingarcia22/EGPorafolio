'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { CaseLead } from '@/components/case/case-lead'
import { useCompact } from './camera'
import { DetailScene, SceneStage, Scaled } from './forma-stage'
import { MAGNET_H, MAGNET_W, MagnetScene } from './forma-a3-magnet'
import { MagnetMobile } from './forma-a3-magnet-mobile'
import { A2_LOOP, PeopleRadar, RADAR_H, RADAR_W } from './forma-a2-radar'
import { PeopleRadarMobile } from './forma-a2-radar-mobile'
import { FAN_H, FAN_W, FanScene, fanView } from './forma-a3-fan'
import type { Channel } from './forma-a3-devices'
import { Agent1Map } from './agent1-map'
import { AppGallery } from './app-gallery'

/** Los ticks de las réplicas: 0,56 s, como en el resto del caso */
const TICK_MS = 560

/** Un reloj en ticks que solo corre mientras la pieza está a la vista, en bucle de `loop` */
function useSceneClock(ref: React.RefObject<HTMLElement | null>, loop: number, still: number): number {
  const { reducedMotion } = useA11y()
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
    const id = window.setInterval(() => setTime((n) => (n + 1) % loop), TICK_MS)
    return () => window.clearInterval(id)
  }, [inView, reducedMotion, loop])
  return reducedMotion ? still : time
}

/** Agente 2 · Contactos: el radar que barre las fuentes hasta dar con quien decide */
function Agent2() {
  const ref = useRef<HTMLDivElement>(null)
  const time = useSceneClock(ref, A2_LOOP, 11)
  const compact = useCompact()
  return <div ref={ref}>{compact ? <PeopleRadarMobile t={time} /> : <Scaled width={RADAR_W} height={RADAR_H}><PeopleRadar t={time} /></Scaled>}</div>
}

/** Agente 3 · Primer contacto: dos escenas seguidas, como en la plataforma */
const A3_STEPS: readonly { label: L; from: number }[] = [
  { label: { es: 'Rumbo atrae las fuentes y cita cada dato', en: 'Rumbo pulls in sources and cites every fact' }, from: 0 },
  { label: { es: 'El mensaje se abre a cada canal', en: 'The message fans out to every channel' }, from: 14 },
]
/** Largo del bucle completo (ticks): el imán y luego el abanico */
const A3_FULL = 37
/** Ticks del fundido entre escenas */
const A3_FADE = 2

function Agent3() {
  const { t } = useLocale()
  const ref = useRef<HTMLDivElement>(null)
  const time = useSceneClock(ref, A3_FULL, 25)
  const compact = useCompact()
  const [channel, setChannel] = useState<Channel>('email')
  const fanFrom = A3_STEPS[1].from
  const scene = time >= fanFrom ? 1 : 0
  // Cada escena se reinicia solo mientras está oculta: el imán vuelve al principio cuando el
  // abanico ya lo cubrió, y el abanico conserva su último estado mientras se desvanece.
  const magnetTime = time < fanFrom + A3_FADE ? time + 5 : 5
  const u = time >= fanFrom ? time - fanFrom : time < A3_FADE ? A3_FULL - 1 - fanFrom : 0
  return (
    <div ref={ref}>
      {/* Las dos escenas como dos nodos: la que corre, encendida */}
      <ol className="mx-auto mb-6 flex max-w-[640px] items-center justify-center gap-3">
        {A3_STEPS.map((step, i) => (
          <li key={step.from} className="flex items-center gap-3">
            {i > 0 && <span aria-hidden="true" className="h-px w-8 bg-white/20 md:w-14" />}
            <span className={`h-2.5 w-2.5 shrink-0 rounded-full border transition-all duration-500 ${scene === i ? 'border-white bg-signal shadow-[0_0_12px_rgb(var(--signal))]' : 'border-white/40'}`} />
            <span className={`text-balance text-[13px] leading-snug transition-opacity duration-500 ${scene === i ? 'opacity-100' : 'opacity-45'}`}>{t(step.label)}</span>
          </li>
        ))}
      </ol>
      <SceneStage
        active={scene}
        scenes={[
          compact ? <MagnetMobile key="magnet" time={magnetTime} /> : <DetailScene key="magnet" width={MAGNET_W} height={MAGNET_H}><MagnetScene time={magnetTime} /></DetailScene>,
          <DetailScene key="fan" width={FAN_W} height={FAN_H} view={compact ? fanView(u, channel) : undefined}><FanScene u={u} onChannel={setChannel} /></DetailScene>,
        ]}
      />
    </div>
  )
}

interface StationProps {
  index: string
  title: L
  lead: L
  fiberFrom?: string
  children: React.ReactNode
}

/**
 * Una estación de la fibra que recorre la forma: el hilo baja hasta su nodo,
 * debajo el nombre y una línea, y colgando del nodo la pieza, sin marco.
 */
function Station({ index, title, lead, fiberFrom, children }: StationProps) {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root || reducedMotion) return
    const ctx = gsap.context(() => {
      gsap.fromTo('[data-station-thread]', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: root, start: 'top 90%', end: 'top 45%', scrub: 0.4 } })
      gsap.from('[data-station-node]', { scale: 0, autoAlpha: 0, duration: 0.7, ease: 'back.out(2)', scrollTrigger: { trigger: root, start: 'top 50%', once: true } })
      gsap.from('[data-station-piece]', { y: 60, autoAlpha: 0, scale: 0.96, filter: 'blur(8px)', duration: 1.2, ease: 'expo.out', clearProps: 'transform,filter,opacity,visibility', scrollTrigger: { trigger: '[data-station-piece]', start: 'top 85%', once: true } })
    }, root)
    return () => ctx.revert()
  }, [reducedMotion])

  return (
    <section ref={rootRef} className="relative flex flex-col items-center pt-[clamp(5rem,4rem+4vw,8rem)]">
      <span data-station-thread aria-hidden="true" className="absolute left-1/2 top-0 h-[clamp(5rem,4rem+4vw,8rem)] w-px origin-top -translate-x-1/2 bg-gradient-to-b from-white/5 via-signal/70 to-signal shadow-[0_0_10px_rgb(var(--signal)/0.6)]" />
      <span data-station-node aria-hidden="true" className="relative block h-3.5 w-3.5 rounded-full border border-white bg-signal shadow-[0_0_0_6px_rgb(var(--signal)/0.18),0_0_20px_4px_rgb(var(--signal)/0.7)]">
        <span className="absolute inset-[-7px] rounded-full border border-signal/60 animate-[nav-node-ping_2.6s_cubic-bezier(0,0,.2,1)_infinite]" />
      </span>
      <h3 data-reveal className="mt-5 text-center">
        <span className="mono-label max-md:text-[12px] text-signal">{index}</span>
        <span className="mt-2 block text-[clamp(1.4rem,1rem+1.4vw,2.2rem)] font-light leading-tight tracking-tight">{t(title)}</span>
      </h3>
      <CaseLead className="mt-4">{t(lead)}</CaseLead>
      <span aria-hidden="true" className="mt-6 h-10 w-px bg-gradient-to-b from-signal to-white/10" />
      <div data-station-piece className="relative mt-2 w-full">
        {fiberFrom && <span data-fiber-from={fiberFrom} aria-hidden="true" className="pointer-events-none absolute bottom-0 left-1/2 h-px w-px" />}
        {children}
      </div>
    </section>
  )
}

/**
 * La forma (dentro de «04 · Bocetos y forma»): cada agente en su estación,
 * con su propia animación, y al final la app real en un carrusel 3D.
 */
export function SellUpForm() {
  const { t } = useLocale()
  return (
    <div>
      <CaseLead>{t({ es: 'Lo construido: tres agentes, cada uno con su trabajo, y la plataforma donde viven.', en: 'What got built: three agents, each with its job, and the platform they live in.' })}</CaseLead>

      <Station index="4.1" title={{ es: 'Agente 1 · Empresas', en: 'Agent 1 · Companies' }} lead={{ es: 'Recorre los 20 países, primero lo gratis, y deja listas las empresas libres.', en: 'Goes through the 20 countries, free sources first, and readies the unowned companies.' }}>
        <Agent1Map />
      </Station>

      <Station index="4.2" title={{ es: 'Agente 2 · Contactos', en: 'Agent 2 · Contacts' }} lead={{ es: 'Recorre las fuentes en cascada hasta dar con quien decide.', en: 'Goes through the sources in a cascade until it finds who decides.' }}>
        <Agent2 />
      </Station>

      <Station index="4.3" title={{ es: 'Agente 3 · Primer contacto', en: 'Agent 3 · First contact' }} lead={{ es: 'Investiga la empresa, cita cada dato y escribe un mensaje por canal.', en: 'Researches the company, cites every fact and writes one message per channel.' }}>
        <Agent3 />
      </Station>

      <Station index="4.4" title={{ es: 'La plataforma', en: 'The platform' }} lead={{ es: 'Las pantallas reales de SellUp en Producción.', en: 'SellUp’s real screens in Production.' }} fiberFrom="su-ia">
        <AppGallery />
      </Station>
    </div>
  )
}

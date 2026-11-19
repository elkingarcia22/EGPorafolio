'use client'

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { RecordModal } from '@/components/case/kit/record-modal'
import { useLocale, type L } from '@/lib/i18n'
import { AppFrame, type NavKey } from './platform'
import { SellUpMark, useInView } from './ui'
import { SceneContacts, SceneFirstContact, ScenePipeline, SceneReview, SceneRumbo, SceneUsage } from './demo-tour-scenes'

interface Scene {
  id: string
  nav: NavKey
  crumb: string
  title: L
  render: (sub: number) => ReactNode
  /** Dónde hace clic el cursor en cada sub-paso. */
  cursor: (sub: number) => string | null
}

const SCENES: readonly Scene[] = [
  { id: 'rumbo', nav: 'busquedas', crumb: 'Empresas / Búsquedas', title: { es: 'Rumbo recibe el pedido', en: 'Rumbo takes the request' }, render: (s) => <SceneRumbo sub={s} />, cursor: (s) => (s === 0 ? 'rumbo' : null) },
  { id: 'revisar', nav: 'revisar', crumb: 'Empresas / Por revisar', title: { es: 'Las candidatas llegan a revisión', en: 'Candidates land in review' }, render: (s) => <SceneReview sub={s} approving={false} />, cursor: () => null },
  { id: 'aprobar', nav: 'revisar', crumb: 'Empresas / Por revisar', title: { es: 'El vendedor aprueba', en: 'The rep approves' }, render: (s) => <SceneReview sub={s} approving />, cursor: (s) => (s < 4 ? `approve-${s}` : null) },
  { id: 'flujo', nav: 'flujo', crumb: 'Flujo de prospección', title: { es: 'Entra al flujo de prospección', en: 'It enters the pipeline' }, render: (s) => <ScenePipeline sub={s} />, cursor: (s) => (s >= 4 ? 'contacts' : null) },
  { id: 'contactos', nav: 'contactos', crumb: 'Contactos', title: { es: 'El Agente 2 encuentra a los decisores', en: 'Agent 2 finds the decision-makers' }, render: (s) => <SceneContacts sub={s} />, cursor: () => null },
  { id: 'primer', nav: 'flujo', crumb: 'Flujo de prospección / Primer contacto', title: { es: 'El Agente 3 prepara el primer contacto', en: 'Agent 3 prepares the first contact' }, render: (s) => <SceneFirstContact sub={s} />, cursor: () => null },
  { id: 'uso', nav: 'uso', crumb: 'Uso de IA y costos', title: { es: 'Todo queda medido', en: 'Everything is measured' }, render: (s) => <SceneUsage sub={s} />, cursor: () => null },
]

const SUBS = 6
const SUB_MS = 550
const IDS = SCENES.map((s) => s.id)

interface TourState {
  scene: number
  sub: number
  playing: boolean
}

/** La réplica de la app con su cursor simulado. */
function TourFrame({ state, className }: { state: TourState; className: string }) {
  const scene = SCENES[state.scene]
  const box = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 70, y: 70, click: 0 })
  const target = scene.cursor(state.sub)

  useLayoutEffect(() => {
    const root = box.current
    if (!root || !target) return
    const el = root.querySelector<HTMLElement>(`[data-target="${target}"]`)
    if (!el) return
    const r = el.getBoundingClientRect()
    const o = root.getBoundingClientRect()
    setPos((p) => ({ x: r.left - o.left + r.width / 2, y: r.top - o.top + r.height / 2, click: p.click + 1 }))
  }, [target, state.scene])

  return (
    <div ref={box} className={`relative ${className}`}>
      <AppFrame active={scene.nav} crumb={scene.crumb} className="h-full">
        <div key={scene.id} className="h-full animate-[ramp-in_.45s_ease]">{scene.render(state.sub)}</div>
      </AppFrame>
      <span className="pointer-events-none absolute left-0 top-0 z-10 transition-transform duration-700 ease-expo" style={{ transform: `translate(${pos.x - 3}px, ${pos.y - 2}px)` }} aria-hidden="true">
        <span key={pos.click} className="absolute -left-3 -top-3 h-7 w-7 animate-ping rounded-full bg-white/40 [animation-iteration-count:1]" />
        <svg width="18" height="22" viewBox="0 0 18 22"><path d="M1 1 L1 17 L5.5 13 L8.5 20 L11 19 L8 12 L14 12 Z" fill="#fff" stroke="#000" strokeWidth="1.2" strokeLinejoin="round" /></svg>
      </span>
    </div>
  )
}

/** Controles: play/pausa y pasos clicables con su barra de progreso. */
function TourControls({ state, onScene, onToggle, extra }: { state: TourState; onScene: (i: number) => void; onToggle: () => void; extra?: ReactNode }) {
  const { t } = useLocale()
  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <button onClick={onToggle} className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-fg text-bg" aria-label={state.playing ? t({ es: 'Pausar', en: 'Pause' }) : t({ es: 'Reproducir', en: 'Play' })}>
        {state.playing ? '❚❚' : '▶'}
      </button>
      <ol className="flex min-w-0 flex-1 gap-1.5">
        {SCENES.map((s, i) => (
          <li key={s.id} className="min-w-0 flex-1">
            <button onClick={() => onScene(i)} className="group w-full text-left" aria-current={i === state.scene} aria-label={t(s.title)}>
              <span className="block h-1 overflow-hidden rounded-full bg-fg/15">
                <span className="block h-full bg-signal transition-[width] duration-[950ms] ease-linear" style={{ width: i < state.scene ? '100%' : i === state.scene ? `${((state.sub + 1) / SUBS) * 100}%` : '0%' }} />
              </span>
              <span className={`mt-1.5 hidden truncate text-[11px] lg:block ${i === state.scene ? '' : 'opacity-45 group-hover:opacity-80'}`}>{t(s.title)}</span>
            </button>
          </li>
        ))}
      </ol>
      {extra}
    </div>
  )
}

/** 08 · Demo: un recorrido animado por la plataforma, de Rumbo a las métricas. */
export function SellUpDemo() {
  const { t } = useLocale()
  const [ref, seen] = useInView<HTMLDivElement>(0.25)
  const [state, setState] = useState<TourState>({ scene: 0, sub: 0, playing: true })
  const [full, setFull] = useState(false)

  useEffect(() => {
    if (!state.playing || !(seen || full)) return
    const id = window.setTimeout(() => {
      setState((s) => (s.sub + 1 < SUBS ? { ...s, sub: s.sub + 1 } : { ...s, scene: (s.scene + 1) % SCENES.length, sub: 0 }))
    }, SUB_MS)
    return () => window.clearTimeout(id)
  }, [state, seen, full])

  const goTo = (i: number) => setState((s) => ({ ...s, scene: i, sub: 0 }))
  const toggle = () => setState((s) => ({ ...s, playing: !s.playing }))
  const current = SCENES[state.scene]

  return (
    <div ref={ref}>
      <p data-reveal className="mb-8 max-w-[62ch] leading-relaxed opacity-80">
        {t({ es: 'Un recorrido por la plataforma tal como se ve en modo oscuro: de pedirle empresas a Rumbo hasta ver cuánto costó cada paso. Se reproduce solo; puedes pausarlo, saltar a un paso o verlo a pantalla completa. Empresas y personas son datos de ejemplo.', en: 'A walk through the platform as it looks in dark mode: from asking Rumbo for companies to seeing what each step cost. It plays by itself; pause it, jump to a step or watch it full screen. Companies and people are sample data.' })}
      </p>
      <p className="mb-3 flex items-baseline gap-3 text-lg" aria-live="polite">
        <span className="mono-label text-signal">0{state.scene + 1}</span>{t(current.title)}
      </p>
      <div data-reveal="device">
        <TourFrame state={state} className="h-[440px] md:h-[520px]" />
      </div>
      <TourControls
        state={state}
        onScene={goTo}
        onToggle={toggle}
        extra={
          <button onClick={() => setFull(true)} className="shrink-0 bg-void/85 px-3.5 py-2 text-paper transition-colors hover:bg-signal">
            <span className="mono-label">⤢ {t({ es: 'Pantalla completa', en: 'Full screen' })}</span>
          </button>
        }
      />
      <RecordModal
        ids={IDS}
        openId={full ? current.id : null}
        onOpenChange={(id) => (id ? goTo(IDS.indexOf(id)) : setFull(false))}
        title={t(current.title)}
        titleLeading={<SellUpMark size={32} />}
        description={t({ es: 'SellUp · recorrido animado · datos de ejemplo', en: 'SellUp · animated tour · sample data' })}
        prevLabel={t({ es: 'Paso anterior', en: 'Previous step' })}
        nextLabel={t({ es: 'Paso siguiente', en: 'Next step' })}
        bodyClassName="flex min-h-0 flex-1 flex-col p-3 md:p-6"
      >
        {full && (
          <div className="flex min-h-0 flex-1 flex-col text-paper">
            <TourFrame state={state} className="min-h-0 flex-1" />
            <TourControls state={state} onScene={goTo} onToggle={toggle} />
          </div>
        )}
      </RecordModal>
    </div>
  )
}

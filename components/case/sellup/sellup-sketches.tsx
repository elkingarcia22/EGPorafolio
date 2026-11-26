'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { Arrows, Bar, Board, Btn, Hand, Pin, Sketchy, Sticky } from '@/components/case/kit/sketch'
import { CaseLead } from '@/components/case/case-lead'
import { SwipeBoard, SwipeFocusContext } from './swipe-board'
import { useCompact } from './camera'
import { CascadeBoard } from './sketch-cascade-board'
import { RumboSketchBoard } from './sketch-rumbo-board'

/** Una celda dibujada de la matriz decisor × canal. */
function Cell({ state }: { state: 'done' | 'empty' | 'review' }) {
  const fill = state === 'done' ? '#c9efc0' : state === 'review' ? '#ffe98a' : 'transparent'
  return (
    <Sketchy fill={fill} className="grid aspect-[4/3] place-items-center">
      <Hand size={1.4}>{state === 'done' ? '✓' : state === 'review' ? '!' : '+'}</Hand>
    </Sketchy>
  )
}

/** Tablero de las tres bandejas donde decide la persona. */
function QueuesBoard() {
  const { t } = useLocale()
  const matrix: ('done' | 'empty' | 'review')[][] = [
    ['done', 'done', 'review', 'empty'],
    ['done', 'empty', 'empty', 'empty'],
    ['empty', 'empty', 'empty', 'empty'],
  ]
  return (
    <>
      <SwipeBoard designW={1400} stops={[20, 494, 968]}>
      <Board title={t({ es: 'SellUp · donde decide la persona', en: 'SellUp · where the person decides' })} w={1400} h={820} label={t({ es: 'Bocetos de las tres bandejas de revisión', en: 'Sketches of the three review queues' })}>
        <Pin x={36} y={26}><Hand size={2.4} className="font-bold">{t({ es: 'Tres bandejas, una regla: nada entra solo', en: 'Three queues, one rule: nothing gets in on its own' })}</Hand></Pin>

        {/* 1 · Por revisar */}
        <Pin x={36} y={110} w={380}>
          <Hand size={1.6} className="mb-2 block font-bold">1 · {t({ es: 'Por revisar', en: 'To review' })}</Hand>
          <Sketchy fill="#fff" className="space-y-[0.7cqw] p-[1.2cqw]">
            <Bar w={60} strong />
            <div className="flex gap-[0.5cqw]">
              <Sketchy fill="#c9efc0" className="px-[0.5cqw]"><Hand size={1}>{t({ es: 'Libre en HubSpot', en: 'Free in HubSpot' })}</Hand></Sketchy>
              <Sketchy className="px-[0.5cqw]"><Hand size={1}>NIT ✓</Hand></Sketchy>
            </div>
            <Hand size={1.15} className="block">{t({ es: '«Está en HubSpot, en la bolsa Sales México, sin actividad hace 120 días»', en: '“It’s in HubSpot, in the Sales Mexico pool, no activity for 120 days”' })}</Hand>
            <Bar w={90} /><Bar w={70} />
            <div className="grid grid-cols-2 gap-[0.6cqw] pt-[0.4cqw]"><Btn accent>{t({ es: 'Aprobar', en: 'Approve' })}</Btn><Btn>{t({ es: 'Descartar', en: 'Discard' })}</Btn></div>
          </Sketchy>
        </Pin>
        <Pin x={60} y={560} w={300} rotate={-2}><Sticky color="yellow">{t({ es: 'Una frase que diga si es nueva, duplicada o libre… y DÓNDE está', en: 'One sentence saying if it’s new, duplicate or free… and WHERE it is' })}</Sticky></Pin>

        {/* 2 · Contactos */}
        <Pin x={510} y={110} w={380}>
          <Hand size={1.6} className="mb-2 block font-bold">2 · {t({ es: 'Contactos por revisar', en: 'Contacts to review' })}</Hand>
          <Sketchy fill="#fff" className="space-y-[0.9cqw] p-[1.2cqw]">
            {[0, 1, 2].map((r) => (
              <div key={r} className="flex items-center gap-[0.6cqw]">
                <span className="h-[2cqw] w-[2cqw] shrink-0 rounded-full border-[0.18cqw] border-[#2a2d33]" />
                <div className="flex-1 space-y-[0.3cqw]"><Bar w={70} strong={r === 0} /><Bar w={45} /></div>
                <Hand size={0.95}>{r === 1 ? 'HubSpot' : t({ es: 'nuevo', en: 'new' })}</Hand>
              </div>
            ))}
            <Btn accent>☎ {t({ es: 'Revelar teléfono', en: 'Reveal phone' })}</Btn>
          </Sketchy>
        </Pin>
        <Pin x={540} y={520} w={320} rotate={1.8}><Sticky color="pink">{t({ es: 'Un clic, dos proveedores: Apollo y, si no hay, Lusha. Tope 13 créditos', en: 'One click, two providers: Apollo and, if nothing, Lusha. Cap 13 credits' })}</Sticky></Pin>
        <Pin x={560} y={680} w={290} rotate={-1.4}><Sticky color="blue" small>{t({ es: '¿Ya lo pagamos? → «Ver más números» gratis', en: 'Already paid? → “See more numbers” for free' })}</Sticky></Pin>

        {/* 3 · Primer contacto */}
        <Pin x={984} y={110} w={380}>
          <Hand size={1.6} className="mb-2 block font-bold">3 · {t({ es: 'Primer contacto', en: 'First contact' })}</Hand>
          <Sketchy fill="#fff" className="p-[1.2cqw]">
            <div className="mb-[0.6cqw] grid grid-cols-[3.5cqw_repeat(4,minmax(0,1fr))] gap-[0.5cqw] text-center">
              <span />
              {['☎', '✉', 'WA', 'in'].map((c) => <Hand key={c} size={1.1}>{c}</Hand>)}
            </div>
            {matrix.map((row, r) => (
              <div key={r} className="mb-[0.5cqw] grid grid-cols-[3.5cqw_repeat(4,minmax(0,1fr))] items-center gap-[0.5cqw]">
                <span className="h-[2.2cqw] w-[2.2cqw] rounded-full border-[0.18cqw] border-[#2a2d33]" />
                {row.map((s, c) => <Cell key={c} state={s} />)}
              </div>
            ))}
            <div className="pt-[0.6cqw]"><Btn accent>{t({ es: 'Preparar lo que falta', en: 'Prepare what’s missing' })}</Btn></div>
          </Sketchy>
        </Pin>
        <Pin x={1010} y={560} w={320} rotate={-1.6}><Sticky color="green">{t({ es: 'Decisor × canal. Cada celda vacía prepara justo eso', en: 'Decision-maker × channel. Each empty cell prepares exactly that' })}</Sticky></Pin>
        <Pin x={1040} y={700} w={280} rotate={2}><Sticky color="orange" small>{t({ es: 'Cada dato con su cita. Sin cita = no es un hecho', en: 'Every fact with its quote. No quote = not a fact' })}</Sticky></Pin>

        <Arrows paths={[{ d: 'M420 300 C 455 290, 470 290, 505 300', accent: true }, { d: 'M894 300 C 930 290, 945 290, 980 300', accent: true }]} />
        <Pin x={432} y={250}><Hand size={1.2} className="text-[#e8743b]">{t({ es: 'aprobar', en: 'approve' })}</Hand></Pin>
        <Pin x={906} y={250}><Hand size={1.2} className="text-[#e8743b]">{t({ es: 'aprobar', en: 'approve' })}</Hand></Pin>
      </Board>
      </SwipeBoard>
    </>
  )
}

/** Una vuelta completa de la cortina, de un lado al otro y de vuelta (ms) */
const WIPE_MS = 7000
/** Vueltas de cortina antes de pasar al par siguiente */
const WIPES_PER_PAIR = 2
/** Si la persona arrastra la cortina, se queda quieta esto antes de seguir sola (ms) */
const RESUME_MS = 7000
/** Hasta dónde llega la cortina en cada lado (%) */
const WIPE_MAX = 92
/** La cortina arranca y vuelve siempre al medio */
const MID = 50
/** En teléfono y tableta, columnas del tablero que recorre la cortina: una por vuelta */
const COMPACT_COLS = 3

interface Pair {
  id: string
  label: L
  caption: L
  Board: () => React.ReactNode
  shot: string
  shotName: L
}

/** Cada boceto con la pantalla real en que se convirtió */
const PAIRS: readonly Pair[] = [
  { id: 'bandejas', label: { es: 'Las bandejas', en: 'The queues' }, caption: { es: 'Donde la cadena se detiene, decide la persona.', en: 'Where the chain stops, the person decides.' }, Board: QueuesBoard, shot: '/cases/sellup/app-contactos.jpg', shotName: { es: 'Contactos por revisar', en: 'Contacts to review' } },
  { id: 'rumbo', label: { es: 'Rumbo', en: 'Rumbo' }, caption: { es: 'Una sola voz para los tres agentes: una conversación, no un formulario.', en: 'One voice for all three agents: a conversation, not a form.' }, Board: RumboSketchBoard, shot: '/cases/sellup/app-rumbo.jpg', shotName: { es: 'Rumbo, dentro de la lista', en: 'Rumbo, inside the list' } },
  { id: 'cadena', label: { es: 'La cadena', en: 'The chain' }, caption: { es: 'Tres agentes en cascada: la empresa avanza de etapa en etapa.', en: 'Three agents in a cascade: the company moves stage by stage.' }, Board: CascadeBoard, shot: '/cases/sellup/app-tablero.jpg', shotName: { es: 'Flujo de prospección · tablero', en: 'Prospecting flow · board' } },
]

/**
 * 04 · Bocetos: del boceto a la pantalla. Cada boceto está encima de la
 * pantalla real en que se convirtió y una cortina va y viene sola,
 * mostrando el dibujo de un lado y el producto del otro. Se puede arrastrar.
 * Después de dos vueltas pasa al par siguiente.
 */
export function SellUpSketches() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const rootRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const [active, setActive] = useState(0)
  /** Posición de la cortina (% desde la izquierda): a la izquierda, el boceto */
  const [pos, setPos] = useState(MID)
  const [dragging, setDragging] = useState(false)
  const [heldUntil, setHeldUntil] = useState(0)
  /** En teléfono, la columna del tablero (y el tramo de la pantalla) a la vista */
  const [col, setCol] = useState(0)
  const compact = useCompact()
  const wipes = compact ? COMPACT_COLS : WIPES_PER_PAIR

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: '0px 0px -25% 0px' })
    io.observe(root)
    return () => io.disconnect()
  }, [])

  // La cortina va y viene sola; tras dos vueltas, pasa al par siguiente.
  useEffect(() => {
    if (!inView || reducedMotion || dragging) return
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      if (now < heldUntil) {
        raf = requestAnimationFrame(tick)
        return
      }
      const k = (now - Math.max(start, heldUntil)) / WIPE_MS
      if (k >= wipes - (compact ? col : 0)) {
        setActive((a) => (a + 1) % PAIRS.length)
        setCol(0)
        return
      }
      // En teléfono cada vuelta enfoca la columna siguiente del tablero
      if (compact) setCol((c) => Math.min(COMPACT_COLS - 1, Math.max(c, col + Math.floor(k))))
      // Seno: empieza a media cortina, abre el boceto entero, cruza al producto y vuelve al medio
      setPos(MID + (WIPE_MAX - MID) * Math.sin(k * 2 * Math.PI))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, reducedMotion, dragging, active, heldUntil, wipes, compact, col])

  const moveTo = useCallback((clientX: number) => {
    const r = stageRef.current?.getBoundingClientRect()
    if (!r) return
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)))
  }, [])

  const pick = (i: number) => {
    setActive(i)
    setCol(0)
    setPos(MID)
    setHeldUntil(performance.now() + RESUME_MS / 3)
  }

  const pair = PAIRS[active]
  const Sketch = pair.Board

  return (
    <div ref={rootRef}>
      <CaseLead className="mb-8">{t({ es: 'Antes de escribir un agente, lo dibujé. Así se volvió producto.', en: 'Before writing an agent, I drew it. This is how it became product.' })}</CaseLead>

      {/* Los pares: un nodo por boceto */}
      <div role="tablist" aria-label={t({ es: 'Bocetos', en: 'Sketches' })} className="mb-6 flex flex-wrap justify-center gap-x-8 gap-y-3">
        {PAIRS.map((p, i) => (
          <button key={p.id} type="button" role="tab" aria-selected={i === active} onClick={() => pick(i)} className="group flex items-center gap-2.5 outline-none">
            <span className={`h-2.5 w-2.5 rounded-full border transition-all duration-500 ${i === active ? 'border-white bg-signal shadow-[0_0_12px_rgb(var(--signal))]' : 'border-white/40'}`} />
            <span className={`text-sm transition-opacity ${i === active ? 'opacity-100' : 'opacity-50 group-hover:opacity-85'}`}>{t(p.label)}</span>
          </button>
        ))}
      </div>

      {/* El escenario: abajo la pantalla real; encima el boceto, recortado por la cortina */}
      <div
        ref={stageRef}
        key={pair.id}
        className="su-fade relative aspect-[0.56] w-full sm:aspect-[0.95] lg:aspect-[1.5] touch-pan-y select-none overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-[0_40px_100px_-50px_rgb(var(--signal)/0.6)]"
        onPointerDown={(e) => {
          setDragging(true)
          ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
          moveTo(e.clientX)
        }}
        onPointerMove={(e) => dragging && moveTo(e.clientX)}
        onPointerUp={() => {
          setDragging(false)
          setHeldUntil(performance.now() + RESUME_MS)
        }}
        onPointerCancel={() => setDragging(false)}
      >
        <Image src={pair.shot} alt={t(pair.shotName)} fill sizes="(min-width: 1024px) 1100px, 100vw" className="pointer-events-none object-cover transition-[object-position] duration-1000 ease-out" style={{ objectPosition: compact ? `${(col / (COMPACT_COLS - 1)) * 100}% top` : 'center top' }} />
        <div className="pointer-events-none absolute inset-0 overflow-hidden bg-[#f6f1e6]" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }} aria-hidden="true">
          {/* En teléfono el tablero va a tamaño legible y la cortina enfoca una columna por vuelta; sin sus controles de deslizar */}
          <div className="w-full [&_.swipe-board>div:last-child]:hidden">
            <SwipeFocusContext.Provider value={compact ? col : undefined}>
              <Sketch />
            </SwipeFocusContext.Provider>
          </div>
        </div>

        {/* Qué es cada lado */}
        <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-[#2a2d33] px-3 py-1 font-mono text-[11px] md:text-[10px] uppercase tracking-[0.14em] text-[#f6f1e6] transition-opacity duration-300" style={{ opacity: pos > 18 ? 1 : 0 }}>{t({ es: 'Boceto', en: 'Sketch' })}</span>
        <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-signal px-3 py-1 font-mono text-[11px] md:text-[10px] uppercase tracking-[0.14em] text-on-signal transition-opacity duration-300" style={{ opacity: pos < 82 ? 1 : 0 }}>{t({ es: 'Pantalla real', en: 'Real screen' })}</span>

        {/* La cortina: una fibra con su nodo para arrastrar */}
        <div className="absolute inset-y-0 w-0" style={{ left: `${pos}%` }}>
          <span aria-hidden="true" className="absolute inset-y-0 -left-px w-0.5 bg-white shadow-[0_0_16px_rgb(var(--signal)),0_0_4px_white]" />
          <button
            type="button"
            aria-label={t({ es: 'Mover la cortina entre boceto y pantalla', en: 'Move the curtain between sketch and screen' })}
            onKeyDown={(e) => {
              if (e.key === 'ArrowLeft') setPos((p) => Math.max(0, p - 5))
              if (e.key === 'ArrowRight') setPos((p) => Math.min(100, p + 5))
              setHeldUntil(performance.now() + RESUME_MS)
            }}
            className="absolute left-0 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize place-items-center rounded-full border border-white bg-[#0b0d16]/80 text-paper shadow-[0_0_0_6px_rgb(var(--signal)/0.25),0_0_24px_rgb(var(--signal)/0.7)] backdrop-blur outline-none focus-visible:ring-2 focus-visible:ring-signal"
          >
            <span aria-hidden="true" className="font-mono text-[13px]">‹ ›</span>
          </button>
        </div>
      </div>

      {/* En teléfono, qué columna del tablero está a la vista */}
      {compact && (
        <div className="mt-4 flex justify-center gap-1.5">
          {Array.from({ length: COMPACT_COLS }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setCol(i)
                setPos(MID)
                setHeldUntil(performance.now() + RESUME_MS)
              }}
              aria-label={t({ es: `Ver la parte ${i + 1} del boceto`, en: `See part ${i + 1} of the sketch` })}
              aria-current={col === i}
              className="grid h-7 w-7 place-items-center"
            >
              <span className={`block h-2 rounded-full transition-all duration-300 ${col === i ? 'w-5 bg-signal' : 'w-2 bg-white/30'}`} />
            </button>
          ))}
        </div>
      )}

      <p key={`cap-${pair.id}`} aria-live="polite" className="su-fade mt-6 text-center lg:mt-8">
        <span className="mono-label text-signal">{t(pair.label)} → {t(pair.shotName)}</span>
        <span className="mt-2 block text-balance text-sm text-paper/65 md:text-base">{t(pair.caption)}</span>
      </p>
    </div>
  )
}

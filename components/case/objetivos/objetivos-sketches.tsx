'use client'

import { CaseLead } from '@/components/case/case-lead'
import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { Arrows, Bar, Board, Btn, Hand, Pin, Sketchy, Sticky } from '@/components/case/kit/sketch'
import { PiecesBoard, ReportBoard } from './objetivos-sketches-more'
import { useAutoplay } from './use-autoplay'

type Writer = 'rrhh' | 'otros'

/** Un paso del recorrido dibujado; se apaga si no está en el camino elegido. */
function StepBox({ label, on }: { label: string; on: boolean }) {
  return (
    <div className={`transition-opacity duration-500 ${on ? 'opacity-100' : 'opacity-25'}`}>
      <Sketchy fill={on ? '#fffdf6' : 'transparent'} className="px-[0.8cqw] py-[0.6cqw] text-center">
        <Hand size={1.35}>{label}</Hand>
      </Sketchy>
    </div>
  )
}

/** Tablero 1: el recorrido del constructor cambia según quién redacta los objetivos. */
function WriterBoard() {
  const { t } = useLocale()
  const [writer, setWriter] = useState<Writer>('rrhh')
  const hr = writer === 'rrhh'
  const row = 300
  const steps = [
    { x: 40, label: 'Parametrización', on: true },
    { x: 250, label: 'Obj. de la empresa', on: true },
    { x: 460, label: 'Participantes', on: true },
    { x: 690, label: 'Obj. asignados', on: hr },
    { x: 900, label: 'Alineación', on: hr },
  ]
  return (
    <div>
      <div role="radiogroup" aria-label={t({ es: '¿Quién redacta los objetivos?', en: 'Who writes the goals?' })} className="mb-4 flex flex-wrap gap-2">
        {([
          ['rrhh', { es: 'Redacta RR. HH.', en: 'HR writes' }],
          ['otros', { es: 'Redactan líderes o colaboradores', en: 'Leads or employees write' }],
        ] as const).map(([id, label]) => (
          <button key={id} type="button" role="radio" aria-checked={writer === id} onClick={() => setWriter(id)} className="mono-label border border-fg/25 px-3 py-2 transition-colors aria-checked:border-signal aria-checked:bg-signal aria-checked:text-on-signal">
            {t(label)}
          </button>
        ))}
      </div>
      <Board title={t({ es: 'Constructor · ¿quién redacta?', en: 'Builder · who writes?' })} w={1200} h={640} label={t({ es: 'Boceto del recorrido del constructor', en: 'Builder flow sketch' })}>
        <Pin x={40} y={30}>
          <Hand size={2.4} className="font-bold">{t({ es: 'El recorrido no es fijo', en: 'The path isn’t fixed' })}</Hand>
        </Pin>
        <Pin x={40} y={92} w={520}>
          <Hand size={1.5} className="opacity-70">{t({ es: 'Lo decide una sola pregunta en la parametrización.', en: 'One question in setup decides it.' })}</Hand>
        </Pin>
        {steps.map((s) => (
          <Pin key={s.label} x={s.x} y={row} w={190}>
            <StepBox label={s.label} on={s.on} />
          </Pin>
        ))}
        <Arrows
          paths={[
            { d: 'M232 330 L248 330', accent: true },
            { d: 'M442 330 L458 330', accent: true },
            { d: 'M652 330 L688 330', accent: hr, dashed: !hr },
            { d: 'M882 330 L898 330', accent: hr, dashed: !hr },
            { d: 'M560 370 C560 450 600 470 650 480', accent: !hr, dashed: hr },
          ]}
        />
        <Pin x={1000} y={420} w={180}>
          <div className={`transition-opacity duration-500 ${hr ? 'opacity-100' : 'opacity-25'}`}>
            <Btn accent>Crear ciclo</Btn>
          </div>
        </Pin>
        <Pin x={660} y={455} w={300}>
          <div className={`transition-opacity duration-500 ${hr ? 'opacity-25' : 'opacity-100'}`}>
            <Btn accent>Lanzar ciclo</Btn>
            <Hand size={1.35} className="mt-[0.6cqw] block">→ {t({ es: 'cada quien escribe lo suyo → «por aprobar» → el líder aprueba o devuelve', en: 'each person writes theirs → “to approve” → the lead approves or returns' })}</Hand>
          </div>
        </Pin>
        <Pin x={40} y={440} w={250} rotate={-2}>
          <Sticky color="yellow">{t({ es: 'Sin aprobar no lleva avance', en: 'No approval, no progress' })}</Sticky>
        </Pin>
        <Pin x={330} y={500} w={260} rotate={1.5}>
          <Sticky color="blue" small>{t({ es: 'Alineación: detrás de un flag, llega en Q1 2027', en: 'Alignment: behind a flag, lands in Q1 2027' })}</Sticky>
        </Pin>
        <Pin x={900} y={150} w={250} rotate={2}>
          <Sticky color="pink" small>{t({ es: '¿El peso tiene que sumar 100? → no: solo pasarse es error', en: 'Must weight add to 100? → no: only going over is an error' })}</Sticky>
        </Pin>
      </Board>
    </div>
  )
}

const BLOCKS = ['Cómo va', 'Desempeño y objetivos', 'Dónde mirar', 'Dónde se juega el ciclo', 'Qué hacer']

/** Tablero 2: el resumen de resultados y el mapa de alineación, a mano. */
function SummaryBoard() {
  const { t } = useLocale()
  return (
    <Board title={t({ es: 'Resultados · resumen y alineación', en: 'Results · summary and alignment' })} w={1200} h={660} label={t({ es: 'Boceto del resumen y del mapa de alineación', en: 'Summary and alignment map sketch' })}>
      <Pin x={40} y={30}>
        <Hand size={2.4} className="font-bold">{t({ es: 'Un resumen que se lee de arriba abajo', en: 'A summary read top to bottom' })}</Hand>
      </Pin>
      <Pin x={40} y={110} w={430}>
        <Sketchy fill="#fffdf6" className="flex flex-col gap-[0.7cqw] p-[1cqw]">
          {BLOCKS.map((b, i) => (
            <Sketchy key={b} className="flex flex-col gap-[0.4cqw] p-[0.7cqw]">
              <Hand size={1.3} className="font-bold">{i + 1}. {b}</Hand>
              <Bar w={i % 2 ? 60 : 85} />
              <Bar w={i % 2 ? 40 : 55} strong={i === 0} />
            </Sketchy>
          ))}
        </Sketchy>
      </Pin>
      <Pin x={500} y={130} w={210} rotate={-2}>
        <Sticky color="orange">{t({ es: 'Elegido entre seis versiones (23-oct)', en: 'Picked among six versions (Oct 23)' })}</Sticky>
      </Pin>
      <Pin x={760} y={110} w={400}>
        <Hand size={1.6} className="mb-[0.6cqw] block font-bold">{t({ es: 'Alineación', en: 'Alignment' })}</Hand>
        <svg viewBox="0 0 400 300" className="h-auto w-full" aria-hidden="true">
          {[40, 95, 150, 205, 260].map((y, i) => (
            <g key={y}>
              <rect x={8} y={y - 12} width={10} height={24} fill="#2a2d33" rx={2} />
              <path d={`M18 ${y} C200 ${y} 200 ${[70, 70, 150, 230, 230][i]} 372 ${[70, 70, 150, 230, 230][i]}`} fill="none" stroke={i === 2 ? '#e8743b' : '#2a2d33'} strokeOpacity={i === 2 ? 0.9 : 0.35} strokeWidth={[14, 6, 18, 9, 4][i]} strokeLinecap="round" pathLength={1} strokeDasharray={1} data-draw="" />
            </g>
          ))}
          {[70, 150, 230].map((y) => (
            <rect key={y} x={372} y={y - 26} width={12} height={52} fill="#2a2d33" rx={2} />
          ))}
        </svg>
      </Pin>
      <Pin x={780} y={450} w={190} rotate={2}>
        <Sticky color="green" small>{t({ es: 'grosor = cuánto aporta', en: 'thickness = contribution' })}</Sticky>
      </Pin>
      <Pin x={990} y={470} w={180} rotate={-1.5}>
        <Sticky color="violet" small>{t({ es: 'color = cómo va', en: 'colour = progress' })}</Sticky>
      </Pin>
      <Pin x={520} y={520} w={240} rotate={1}>
        <Sticky color="yellow" small>{t({ es: 'Lo que no cuelga de nada → «Sin alinear»', en: 'What hangs from nothing → “Unaligned”' })}</Sticky>
      </Pin>
    </Board>
  )
}

/** Los cuatro tableros, en el orden en que se discutieron */
const BOARDS: readonly { title: L; Board: () => JSX.Element }[] = [
  { title: { es: 'Un objetivo, desarmado', en: 'A goal, taken apart' }, Board: PiecesBoard },
  { title: { es: '¿Quién redacta?', en: 'Who writes?' }, Board: WriterBoard },
  { title: { es: 'Reportar en segundos', en: 'Reporting in seconds' }, Board: ReportBoard },
  { title: { es: 'Resumen y alineación', en: 'Summary and alignment' }, Board: SummaryBoard },
]
/** Separación entre tableros en el muro (fracción del ancho) */
const GAP = 0.12
/** Inclinación de cada tablero sobre el muro (grados) */
const TILT = [-1.2, 1, 0.8, -1]
/** Tiempo en cada tablero mientras avanza solo (ms) */
const BOARD_MS = 8000
/** Viaje de la cámara: se aleja hasta ver el muro y entra al siguiente (s) */
const TRAVEL = { out: 0.55, in: 0.85 }

/**
 * Los bocetos como un muro: los cuatro tableros clavados en una cuadrícula y
 * unidos por fibras, en el orden en que se discutieron. La cámara está en uno;
 * para pasar al siguiente se aleja hasta ver el muro entero y entra al otro.
 * Avanza solo (se detiene con el cursor encima, para poder tocarlos).
 */
function SketchWall() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const rootRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })
  const [hover, setHover] = useState(false)
  const [overview, setOverview] = useState(false)
  const { index: active, go } = useAutoplay(rootRef, { count: BOARDS.length, ms: BOARD_MS, loop: true, disabled: reducedMotion, hold: hover || overview })

  // Mide el ancho de la vista y el tablero más alto: con eso se arma el muro.
  useEffect(() => {
    const view = viewRef.current
    const canvas = canvasRef.current
    if (!view || !canvas) return
    const measure = () => {
      const boards = Array.from(canvas.querySelectorAll<HTMLElement>('[data-wall-board]'))
      setSize({ w: view.clientWidth, h: Math.max(0, ...boards.map((b) => b.offsetHeight)) })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(view)
    canvas.querySelectorAll('[data-wall-board]').forEach((b) => observer.observe(b))
    return () => observer.disconnect()
  }, [])

  const gap = size.w * GAP
  const at = (i: number) => ({ x: (i % 2) * (size.w + gap), y: Math.floor(i / 2) * (size.h + gap) })
  const wall = { w: size.w * 2 + gap, h: size.h * 2 + gap }
  const fit = Math.min(size.w / wall.w, size.h / Math.max(1, wall.h)) * 0.92
  const wide = { x: (size.w - wall.w * fit) / 2, y: (size.h - wall.h * fit) / 2, scale: fit }

  // La cámara: se aleja hasta el muro y entra al tablero elegido (o se queda viendo el muro).
  const first = useRef(true)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !size.w) return
    const p = at(active)
    const close = { x: -p.x, y: -p.y, scale: 1 }
    if (first.current || reducedMotion) {
      first.current = false
      gsap.set(canvas, overview ? wide : close)
      return
    }
    const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' } })
    if (overview) tl.to(canvas, { ...wide, duration: TRAVEL.in })
    else tl.to(canvas, { ...wide, duration: TRAVEL.out }).to(canvas, { ...close, duration: TRAVEL.in, ease: 'expo.inOut' })
    return () => {
      tl.kill()
    }
    // `at` y `wide` dependen solo de `size`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, overview, size, reducedMotion])

  // Al llegar a un tablero, sus notas se pegan y sus trazos se dibujan.
  useEffect(() => {
    const canvas = canvasRef.current
    const board = canvas?.querySelectorAll<HTMLElement>('[data-wall-board]')[active]
    if (!board || reducedMotion || overview) return
    const delay = first.current ? 0.2 : TRAVEL.out + TRAVEL.in * 0.6
    const ctx = gsap.context(() => {
      gsap.fromTo(board.querySelectorAll('[data-reveal="pop"]'), { scale: 0.6, autoAlpha: 0, rotate: () => gsap.utils.random(-7, 7) }, { scale: 1, autoAlpha: 1, rotate: 0, duration: 0.7, ease: 'back.out(1.8)', stagger: 0.06, delay })
      gsap.fromTo(board.querySelectorAll('[data-draw]'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut', delay })
    }, board)
    return () => ctx.revert()
  }, [active, overview, reducedMotion])

  const choose = (i: number) => {
    setOverview(false)
    go(i)
  }
  /** Fibra de un tablero al siguiente, de borde a borde por el muro (en fila: costado a costado; al bajar: de abajo a arriba) */
  const link = (i: number) => {
    const a = at(i)
    const b = at(i + 1)
    if (a.y === b.y) {
      const from = { x: a.x + size.w, y: a.y + size.h / 2 }
      const to = { x: b.x, y: b.y + size.h / 2 }
      return `M${from.x} ${from.y} C${from.x + gap / 2} ${from.y} ${to.x - gap / 2} ${to.y} ${to.x} ${to.y}`
    }
    const from = { x: a.x + size.w / 2, y: a.y + size.h }
    const to = { x: b.x + size.w / 2, y: b.y }
    return `M${from.x} ${from.y} C${from.x} ${from.y + gap * 0.8} ${to.x} ${to.y - gap * 0.8} ${to.x} ${to.y}`
  }

  return (
    <div ref={rootRef} className="flex flex-col items-center">
      <p key={`${active}-${overview}`} className="obj-fade mb-5 text-center">
        <span className="mono-label text-signal">{overview ? t({ es: 'El muro', en: 'The wall' }) : `${t({ es: 'Tablero', en: 'Board' })} 0${active + 1}`}</span>
        <span className="mt-2 block text-[clamp(1.4rem,1rem+1.4vw,2.2rem)] font-light leading-tight tracking-tight">{overview ? t({ es: 'Cuatro tableros, un recorrido', en: 'Four boards, one path' }) : t(BOARDS[active].title)}</span>
      </p>

      <div
        ref={viewRef}
        onPointerEnter={() => setHover(true)}
        onPointerLeave={() => setHover(false)}
        className="relative w-full overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(ellipse_at_50%_40%,rgb(var(--signal)/0.1),transparent_70%)]"
        style={{ height: size.h ? size.h : undefined }}
      >
        <div ref={canvasRef} data-reveal-off className="absolute left-0 top-0 origin-top-left" style={{ width: wall.w || '100%', height: wall.h || undefined }}>
          {/* Las fibras que recorren el muro de tablero en tablero */}
          <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" viewBox={`0 0 ${wall.w || 1} ${wall.h || 1}`}>
            {size.w > 0 && BOARDS.slice(0, -1).map((b, i) => (
              <path key={b.title.es} d={link(i)} fill="none" stroke={i < active ? 'url(#wall-fiber)' : 'white'} strokeOpacity={i < active ? 0.95 : 0.4} strokeWidth={6} strokeDasharray={i < active ? undefined : '14 16'} style={{ filter: i < active ? 'drop-shadow(0 0 8px rgb(var(--signal) / 0.8))' : undefined }} />
            ))}
            <defs>
              <linearGradient id="wall-fiber" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="rgb(var(--signal))" />
                <stop offset="1" stopColor="#ff54aa" />
              </linearGradient>
            </defs>
          </svg>
          {BOARDS.map(({ title, Board }, i) => {
            const p = size.w ? at(i) : { x: 0, y: i * 2000 }
            const on = i === active && !overview
            return (
              <div
                key={title.es}
                data-wall-board
                aria-hidden={!on}
                inert={!on ? true : undefined}
                className="absolute transition-[opacity,filter] duration-700"
                style={{ left: p.x, top: p.y, width: size.w || '100%', opacity: on || overview ? 1 : 0.35, filter: on || overview ? 'none' : 'blur(2px)', transform: on ? 'none' : `rotate(${TILT[i]}deg)` }}
              >
                <Board />
              </div>
            )
          })}
        </div>
      </div>

      {/* El recorrido: un nodo por tablero, y el muro entero */}
      <div className="mt-6 flex items-center gap-5">
        <ol className="relative flex items-center gap-8">
          <span className="absolute inset-x-1 top-1/2 h-px -translate-y-1/2 bg-white/12" aria-hidden="true" />
          {BOARDS.map((b, i) => (
            <li key={b.title.es} className="relative">
              <button
                type="button"
                onClick={() => choose(i)}
                aria-current={i === active && !overview ? 'step' : undefined}
                aria-label={t(b.title)}
                title={t(b.title)}
                className={`block rounded-full transition-all duration-500 ease-expo ${i === active && !overview ? 'h-3 w-3 bg-signal shadow-[0_0_12px_2px_rgb(var(--signal)/0.7)]' : 'h-2 w-2 border border-white/40 bg-void hover:border-white'}`}
              />
            </li>
          ))}
        </ol>
        <button
          type="button"
          onClick={() => setOverview((v) => !v)}
          aria-pressed={overview}
          className="mono-label rounded-full border border-white/12 px-3 py-1 text-paper/60 transition-colors hover:border-white/35 hover:text-paper aria-pressed:border-signal aria-pressed:text-paper"
        >
          {overview ? t({ es: 'Volver al tablero', en: 'Back to board' }) : t({ es: 'Ver el muro', en: 'See the wall' })}
        </button>
      </div>
    </div>
  )
}

/** 04 · Bocetos: antes de las pantallas, los cuatro tableros en un muro que se recorre con la cámara. */
export function ObjetivosSketches() {
  const { t } = useLocale()
  return (
    <div>
      <CaseLead className="mb-10">
        {t({
          es: 'Cuatro tableros, en el orden en que se discutieron: del objetivo desarmado en piezas a cómo leer un ciclo sin abrir siete reportes.',
          en: 'Four boards, in the order they were discussed: from a goal taken apart to reading a cycle without opening seven reports.',
        })}
      </CaseLead>
      <SketchWall />
    </div>
  )
}

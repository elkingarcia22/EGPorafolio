'use client'

import type { Iteration } from '@/lib/content/cases/encuestas/types'

/** Grafito: el trazo de lápiz de los bocetos */
const GRAPHITE = '#3b3f46'
const ORANGE = '#e8743b'

/** Trazo de lápiz: se dibuja cuando la hoja llega arriba de la pila */
const pencil = (delay = 0) => ({
  fill: 'none',
  stroke: GRAPHITE,
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  pathLength: 1,
  strokeDasharray: 1,
  className: 'enc-pencil',
  style: { animationDelay: `${delay}ms` },
})
const faint = (delay = 0) => ({ ...pencil(delay), strokeOpacity: 0.45, strokeWidth: 1.5 })

/** Nota a mano sobre la hoja */
function Note({ x, y, children, accent = false, size = 17, struck = false }: { x: number; y: number; children: string; accent?: boolean; size?: number; struck?: boolean }) {
  return (
    <text x={x} y={y} className="font-hand" fontSize={size} fill={accent ? ORANGE : GRAPHITE} textDecoration={struck ? 'line-through' : undefined}>
      {children}
    </text>
  )
}

/** Una tachadura en naranja sobre lo que se descartó */
function Cross({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return <path d={`M${x} ${y} L${x + w} ${y + h} M${x + w} ${y} L${x} ${y + h}`} {...pencil(900)} stroke={ORANGE} strokeWidth={3} />
}

/** V1 · chat de importación: la conversación a la izquierda y la estructura detectada a la derecha */
function Chat() {
  return (
    <g>
      <rect x={30} y={40} width={540} height={300} rx={14} {...faint()} />
      <path d="M300 40 V340" {...faint(100)} />
      {[70, 130, 190, 250].map((y, i) => (
        <g key={y}>
          <rect x={i % 2 ? 130 : 50} y={y} width={150} height={42} rx={16} {...pencil(150 + i * 110)} />
          <path d={`M${(i % 2 ? 130 : 50) + 16} ${y + 21} h${i % 2 ? 70 : 110}`} {...faint(250 + i * 110)} />
        </g>
      ))}
      {[80, 115, 150, 185, 220].map((y, i) => (
        <path key={y} d={`M${330 + (i % 3) * 22} ${y} h${200 - (i % 3) * 40}`} {...pencil(400 + i * 80)} />
      ))}
      <path d="M285 300 C320 300 330 250 345 238" {...pencil(800)} stroke={ORANGE} />
      <Note x={330} y={290}>el parser es la verdad</Note>
      <Note x={40} y={372} accent struck>«Continuar análisis local»</Note>
      <Cross x={34} y={356} w={230} h={22} />
    </g>
  )
}

/** V2 · panel lateral de tres pasos sobre la lista */
function Drawer() {
  return (
    <g>
      <rect x={30} y={40} width={540} height={300} rx={14} {...faint()} />
      {[80, 115, 150, 185, 220, 255].map((y, i) => <path key={y} d={`M60 ${y} h${[200, 160, 210, 140, 180, 190][i]}`} {...faint(80 + i * 40)} />)}
      <rect x={320} y={40} width={250} height={300} rx={14} {...pencil(200)} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <circle cx={360 + i * 85} cy={80} r={14} {...pencil(350 + i * 120)} />
          {i < 2 && <path d={`M${376 + i * 85} 80 h52`} {...faint(400 + i * 120)} />}
        </g>
      ))}
      {[120, 170, 220].map((y, i) => <rect key={y} x={340} y={y} width={210} height={34} rx={8} {...pencil(650 + i * 100)} />)}
      <rect x={460} y={290} width={90} height={30} rx={15} {...pencil(950)} stroke={ORANGE} />
      <Note x={334} y={376}>visibilidad: se deriva, no se elige</Note>
      <Note x={40} y={376} accent struck>tipo por nombre de archivo</Note>
      <Cross x={36} y={360} w={232} h={22} />
    </g>
  )
}

/** V3 · el árbol de secciones de tres niveles */
function Tree() {
  const rows = [
    { d: 0, y: 70, n: '1' },
    { d: 1, y: 115, n: '1.1' },
    { d: 2, y: 155, n: '1.1.1' },
    { d: 2, y: 195, n: '1.1.2' },
    { d: 1, y: 240, n: '1.2' },
    { d: 0, y: 290, n: '2' },
  ]
  return (
    <g>
      <rect x={30} y={40} width={540} height={300} rx={14} {...faint()} />
      <path d="M62 82 V290 M102 127 V195" {...faint(100)} />
      {rows.map((r, i) => (
        <g key={r.n}>
          <text x={70 + r.d * 40} y={r.y + 6} className="font-hand" fontSize={15} fill={ORANGE}>{r.n}</text>
          <rect x={110 + r.d * 40} y={r.y - 13} width={r.d === 2 ? 230 : 200} height={26} rx={6} {...pencil(150 + i * 110)} />
        </g>
      ))}
      <rect x={440} y={100} width={110} height={30} rx={8} {...pencil(850)} />
      <Note x={452} y={121} size={15}>Mover a…</Note>
      <path d="M440 115 C410 118 395 130 382 140" {...pencil(950)} stroke={ORANGE} />
      <Note x={404} y={190}>numeración</Note>
      <Note x={404} y={212}>automática</Note>
      <Note x={40} y={376} accent struck>arrastrar entre ramas</Note>
      <Cross x={36} y={360} w={200} h={22} />
    </g>
  )
}

/** V4 · en Flux UI: una tarjeta por enunciado en vez de la matriz */
function Cards() {
  return (
    <g>
      <rect x={30} y={40} width={540} height={300} rx={14} {...faint()} />
      <path d="M30 80 H570" {...faint(80)} />
      <rect x={30} y={40} width={44} height={300} rx={14} {...faint(120)} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={100} y={100 + i * 76} width={440} height={60} rx={12} {...pencil(200 + i * 160)} />
          <path d={`M120 ${120 + i * 76} h${[220, 170, 240][i]}`} {...faint(260 + i * 160)} />
          {[0, 1, 2, 3, 4].map((k) => (
            <circle key={k} cx={130 + k * 36} cy={142 + i * 76} r={8} {...pencil(360 + i * 160 + k * 40)} fill={k === [3, 4, 2][i] ? ORANGE : 'none'} />
          ))}
        </g>
      ))}
      <Note x={360} y={376}>99 funcionalidades · 487 casos</Note>
      <Note x={40} y={376} accent struck>la matriz Likert como tabla</Note>
      <Cross x={36} y={360} w={238} h={22} />
    </g>
  )
}

/** El boceto de cada iteración, a lápiz sobre una hoja de 600 × 400 */
export function SketchDrawing({ shape }: { shape: Iteration['shape'] }) {
  if (shape === 'chat') return <Chat />
  if (shape === 'drawer') return <Drawer />
  if (shape === 'tree') return <Tree />
  return <Cards />
}

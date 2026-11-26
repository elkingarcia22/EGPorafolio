'use client'

import { useLocale } from '@/lib/i18n'
import { Arrows, Bar, Board, Btn, Hand, Pin, Sketchy, Sticky, type StickyColor } from '@/components/case/kit/sketch'
import { SECTIONS } from '@/lib/content/cases/encuestas/orbit-real'

/**
 * Los mismos cuatro bocetos, dibujados de nuevo para el teléfono: un tablero
 * vertical con menos piezas y letra grande (el tablero ancho, encogido, dejaba
 * la letra en 6–9 px). Medidas de diseño 400×600: 1cqw ≈ 3,4 px a 375 px.
 */
const W = 400
const H = 600
/** Tamaños de letra en cqw: título ≈ 24 px, notas ≈ 15 px, detalles ≈ 13 px */
const SIZE = { title: 7, note: 4.4, small: 3.9 } as const

function Note({ color, children, dropped = false }: { color: StickyColor; children: React.ReactNode; dropped?: boolean }) {
  return (
    <Sticky color={color}>
      <Hand size={SIZE.note} className={`block p-[1.6cqw] ${dropped ? 'line-through decoration-[#e8743b] decoration-[0.6cqw]' : ''}`}>{children}</Hand>
    </Sticky>
  )
}

function Title({ children }: { children: React.ReactNode }) {
  return (
    <Pin x={22} y={20} w={356}>
      <Hand size={SIZE.title} className="block font-bold">{children}</Hand>
    </Pin>
  )
}

function ChatPhone() {
  const { t } = useLocale()
  return (
    <Board title="V1" w={W} h={H} label={t({ es: 'Boceto del asistente de importación en chat', en: 'Import chat assistant sketch' })}>
      <Title>{t({ es: 'Importar conversando', en: 'Importing by chatting' })}</Title>
      <Pin x={22} y={110} w={250}>
        <Sketchy fill="#fffdf6" className="flex flex-col gap-[2.4cqw] p-[3cqw]">
          {[{ me: false, w: [80, 55] }, { me: true, w: [45] }, { me: false, w: [70, 45] }].map((b, i) => (
            <div key={i} className={`w-[72%] ${b.me ? 'self-end' : ''}`}>
              <Sketchy fill={b.me ? '#bfe0ff' : 'transparent'} className="flex flex-col gap-[1.4cqw] p-[2cqw]">
                {b.w.map((w) => <Bar key={w} w={w} strong={!b.me && w > 60} />)}
              </Sketchy>
            </div>
          ))}
        </Sketchy>
      </Pin>
      <Pin x={232} y={300} w={150} rotate={3}>
        <Note color="pink" dropped>«Continuar análisis local»</Note>
      </Pin>
      <Arrows paths={[{ d: 'M150 330 C150 380 120 400 110 420', accent: true }]} />
      <Pin x={22} y={425} w={250} rotate={-2}>
        <Note color="yellow">{t({ es: 'El parser es la verdad; la IA interpreta', en: 'The parser is the truth; AI interprets' })}</Note>
      </Pin>
      <Pin x={22} y={540} w={356}>
        <Hand size={SIZE.small} className="opacity-70">{t({ es: '→ el chat alargaba lo obvio', en: '→ chat dragged out the obvious' })}</Hand>
      </Pin>
    </Board>
  )
}

function DrawerPhone() {
  const { t } = useLocale()
  return (
    <Board title="V2" w={W} h={H} label={t({ es: 'Boceto del panel lateral de tres pasos', en: 'Three-step side panel sketch' })}>
      <Title>{t({ es: 'Tres pasos, sin salir de la lista', en: 'Three steps, without leaving the list' })}</Title>
      <Pin x={22} y={150} w={356}>
        <Sketchy fill="#fffdf6" className="p-[3cqw]">
          <div className="flex items-start justify-between gap-[2cqw]">
            {[1, 2, 3].map((n) => (
              <Sketchy key={n} fill={n === 1 ? '#ffd2a8' : 'transparent'} className="grid h-[9cqw] w-[9cqw] place-items-center"><Hand size={SIZE.note}>{n}</Hand></Sketchy>
            ))}
          </div>
          <div className="mt-[3cqw] flex flex-col gap-[2cqw]">
            {[60, 45, 70].map((w) => (
              <Sketchy key={w} className="flex h-[8cqw] items-center px-[2cqw]"><Bar w={w} /></Sketchy>
            ))}
          </div>
          <div className="ml-auto mt-[3cqw] w-[45%]"><Btn accent><Hand size={SIZE.small}>{t({ es: 'Siguiente', en: 'Next' })}</Hand></Btn></div>
        </Sketchy>
      </Pin>
      <Pin x={22} y={440} w={230} rotate={-1.5}>
        <Note color="green">{t({ es: 'Pública solo si hay una fila por persona', en: 'Public only with one row per person' })}</Note>
      </Pin>
      <Pin x={262} y={470} w={120} rotate={3}>
        <Note color="pink" dropped>{t({ es: 'Inferir el tipo por el nombre', en: 'Infer the type from the name' })}</Note>
      </Pin>
    </Board>
  )
}

function TreePhone() {
  const { t } = useLocale()
  const s = SECTIONS[0]
  const rows = [
    { n: s.n, depth: 0 },
    { n: s.subs[0].n, depth: 1 },
    ...(s.subs[0].questions ?? []).slice(0, 2).map((q) => ({ n: q.n, depth: 2 })),
    { n: SECTIONS[1].n, depth: 0 },
  ]
  return (
    <Board title="V3" w={W} h={H} label={t({ es: 'Boceto del árbol de secciones', en: 'Section tree sketch' })}>
      <Title>{t({ es: 'Un árbol que se numera solo', en: 'A tree that numbers itself' })}</Title>
      <Pin x={22} y={150} w={260}>
        <Sketchy fill="#fffdf6" className="flex flex-col gap-[2cqw] p-[3cqw]">
          {rows.map((r) => (
            <div key={r.n} style={{ paddingLeft: `${r.depth * 7}cqw` }}>
              <Sketchy fill={r.depth === 1 ? '#bfe0ff' : 'transparent'} className="flex items-center gap-[2cqw] px-[2cqw] py-[1.4cqw]">
                <Hand size={SIZE.note} className="font-bold text-[#e8743b]">{r.n}</Hand>
                <Bar w={r.depth === 2 ? 55 : 75} strong={r.depth === 0} />
              </Sketchy>
            </div>
          ))}
        </Sketchy>
      </Pin>
      <Pin x={262} y={430} w={120} rotate={3}>
        <Note color="orange">{t({ es: 'Tope: tres niveles', en: 'Cap: three levels' })}</Note>
      </Pin>
      <Pin x={22} y={470} w={220} rotate={-2}>
        <Note color="yellow">{t({ es: 'Arrastrar solo reordena hermanas', en: 'Dragging only reorders siblings' })}</Note>
      </Pin>
    </Board>
  )
}

function SystemPhone() {
  const { t } = useLocale()
  return (
    <Board title="V4" w={W} h={H} label={t({ es: 'Boceto de las tarjetas por enunciado', en: 'One-card-per-statement sketch' })}>
      <Title>{t({ es: 'Un enunciado, una tarjeta', en: 'One statement, one card' })}</Title>
      <Pin x={22} y={150} w={356}>
        <div className="flex flex-col gap-[3cqw]">
          {[0, 1, 2].map((i) => (
            <Sketchy key={i} fill="#fffdf6" className="flex flex-col gap-[2.4cqw] p-[3cqw]">
              <Bar w={[75, 60, 82][i]} strong />
              <div className="flex gap-[4cqw]">
                {[0, 1, 2, 3, 4].map((k) => (
                  <span key={k} className={`h-[5cqw] w-[5cqw] rounded-full border-[0.5cqw] border-[#2a2d33] ${k === [3, 4, 2][i] ? 'bg-[#e8743b]' : ''}`} />
                ))}
              </div>
            </Sketchy>
          ))}
        </div>
      </Pin>
      <Pin x={22} y={470} w={200} rotate={-2}>
        <Note color="blue">{t({ es: '99 funcionalidades con fecha', en: '99 features with a date' })}</Note>
      </Pin>
      <Pin x={242} y={490} w={140} rotate={3}>
        <Note color="pink" dropped>{t({ es: 'La matriz como tabla', en: 'The matrix as a table' })}</Note>
      </Pin>
    </Board>
  )
}

/** Medidas de diseño de los tableros del teléfono (ancho / alto) */
export const PHONE_BOARD_RATIO = `${W} / ${H}`

/** Los cuatro tableros del teléfono, en el orden de las iteraciones */
export const SKETCH_BOARDS_PHONE: readonly (() => JSX.Element)[] = [ChatPhone, DrawerPhone, TreePhone, SystemPhone]

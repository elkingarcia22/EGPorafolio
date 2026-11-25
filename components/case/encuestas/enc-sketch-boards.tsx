'use client'

import { useLocale, type L } from '@/lib/i18n'
import { Arrows, Bar, Board, Btn, Hand, Pin, Sketchy, Sticky } from '@/components/case/kit/sketch'
import { SECTIONS } from '@/lib/content/cases/encuestas/orbit-real'

/** Algo que se probó y se descartó: tachado en naranja */
function Dropped({ children }: { children: React.ReactNode }) {
  return <span className="line-through decoration-[#e8743b] decoration-[0.2cqw]">{children}</span>
}

/** V1 · Carga histórica como un chat: una decisión por turno, la estructura detectada al lado. */
function ChatBoard() {
  const { t } = useLocale()
  return (
    <Board title="Carga histórica · V1" w={1200} h={680} label={t({ es: 'Boceto del asistente de importación en chat', en: 'Import chat assistant sketch' })}>
      <Pin x={40} y={28}>
        <Hand size={2.4} className="font-bold">{t({ es: 'Importar conversando', en: 'Importing by chatting' })}</Hand>
      </Pin>
      <Pin x={40} y={92} w={500}>
        <Hand size={1.5} className="opacity-70">{t({ es: 'Una decisión por turno', en: 'One decision per turn' })}</Hand>
      </Pin>
      <Pin x={40} y={150} w={480}>
        <Sketchy fill="#fffdf6" className="flex flex-col gap-[1cqw] p-[1.2cqw]">
          {[{ me: false, w: [80, 55] }, { me: true, w: [40] }, { me: false, w: [70, 45] }, { me: true, w: [30] }].map((b, i) => (
            <div key={i} className={`w-[72%] ${b.me ? 'self-end' : ''}`}>
              <Sketchy fill={b.me ? '#bfe0ff' : 'transparent'} className="flex flex-col gap-[0.4cqw] p-[0.7cqw]">
                {b.w.map((w) => <Bar key={w} w={w} strong={!b.me && w > 60} />)}
              </Sketchy>
            </div>
          ))}
        </Sketchy>
      </Pin>
      <Pin x={690} y={150} w={440}>
        <Hand size={1.6} className="mb-[0.6cqw] block font-bold">{t({ es: 'Estructura detectada', en: 'Detected structure' })}</Hand>
        <Sketchy className="flex flex-col gap-[0.7cqw] p-[1.2cqw]">
          {[90, 70, 70, 90, 60].map((w, i) => (
            <div key={i} className={i % 3 ? 'pl-[2cqw]' : ''}><Bar w={w} strong={i % 3 === 0} /></div>
          ))}
        </Sketchy>
      </Pin>
      <Arrows paths={[{ d: 'M530 300 C590 300 620 280 680 260', accent: true }]} />
      <Pin x={700} y={450} w={260} rotate={-2}>
        <Sticky color="yellow">{t({ es: 'El parser es la verdad; la IA interpreta', en: 'The parser is the truth; AI interprets' })}</Sticky>
      </Pin>
      <Pin x={990} y={470} w={180} rotate={2}>
        <Sticky color="pink" small><Dropped>«Continuar análisis local»</Dropped></Sticky>
      </Pin>
      <Pin x={60} y={560} w={430}>
        <Hand size={1.35} className="opacity-70">{t({ es: '→ el chat alargaba decisiones obvias', en: '→ chat dragged out obvious decisions' })}</Hand>
      </Pin>
    </Board>
  )
}

/** V2 · Un panel lateral de tres pasos sobre la lista. */
function DrawerBoard() {
  const { t } = useLocale()
  const steps = [t({ es: 'Archivos', en: 'Files' }), t({ es: 'Datos generales', en: 'General data' }), t({ es: 'Estructura', en: 'Structure' })]
  return (
    <Board title="Carga histórica · V2" w={1200} h={680} label={t({ es: 'Boceto del panel lateral de tres pasos', en: 'Three-step side panel sketch' })}>
      <Pin x={40} y={28}>
        <Hand size={2.4} className="font-bold">{t({ es: 'Tres pasos, sin salir de la lista', en: 'Three steps, without leaving the list' })}</Hand>
      </Pin>
      <Pin x={40} y={130} w={500}>
        <div className="flex flex-col gap-[1.2cqw] opacity-50">
          {[85, 70, 90, 60, 75, 80].map((w, i) => <Bar key={i} w={w} />)}
        </div>
      </Pin>
      <Pin x={600} y={100} w={540}>
        <Sketchy fill="#fffdf6" className="p-[1.4cqw]">
          <div className="flex items-start justify-between gap-[1cqw]">
            {steps.map((s, i) => (
              <div key={s} className="flex flex-1 flex-col items-center gap-[0.4cqw]">
                <Sketchy fill={i === 0 ? '#ffd2a8' : 'transparent'} className="grid h-[2.6cqw] w-[2.6cqw] place-items-center"><Hand size={1.3}>{i + 1}</Hand></Sketchy>
                <Hand size={1.25} className="text-center">{s}</Hand>
              </div>
            ))}
          </div>
          <div className="mt-[1.6cqw] flex flex-col gap-[0.9cqw]">
            {[0, 1, 2].map((i) => (
              <Sketchy key={i} className="flex h-[3cqw] items-center px-[0.8cqw]"><Bar w={[60, 45, 70][i]} /></Sketchy>
            ))}
          </div>
          <div className="mt-[1.4cqw] ml-auto w-[30%]"><Btn accent>{t({ es: 'Siguiente', en: 'Next' })}</Btn></div>
        </Sketchy>
      </Pin>
      <Pin x={60} y={470} w={330} rotate={-1.5}>
        <Sticky color="green">{t({ es: 'Visibilidad: no se elige. Pública solo si hay una fila por persona', en: 'Visibility isn’t chosen: public only with one row per person' })}</Sticky>
      </Pin>
      <Pin x={440} y={500} w={260} rotate={2}>
        <Sticky color="pink" small><Dropped>{t({ es: 'Inferir el tipo por el nombre del archivo', en: 'Infer the type from the filename' })}</Dropped></Sticky>
      </Pin>
      <Arrows paths={[{ d: 'M390 520 C470 520 540 420 600 380', dashed: true }]} />
    </Board>
  )
}

/** V3 · El árbol de secciones de tres niveles, con «Mover a…». */
function TreeBoard() {
  const { t } = useLocale()
  const s = SECTIONS[0]
  const sub = s.subs[0]
  const rows: { n: string; label: string; depth: number }[] = [
    { n: s.n, label: s.title, depth: 0 },
    { n: sub.n, label: sub.title, depth: 1 },
    ...(sub.questions ?? []).slice(0, 2).map((q) => ({ n: q.n, label: q.text, depth: 2 })),
    { n: SECTIONS[1].n, label: SECTIONS[1].title, depth: 0 },
  ]
  return (
    <Board title={t({ es: 'Secciones y subsecciones · V3', en: 'Sections and subsections · V3' })} w={1200} h={680} label={t({ es: 'Boceto del árbol de secciones', en: 'Section tree sketch' })}>
      <Pin x={40} y={28}>
        <Hand size={2.4} className="font-bold">{t({ es: 'Un árbol que se numera solo', en: 'A tree that numbers itself' })}</Hand>
      </Pin>
      <Pin x={40} y={120} w={700}>
        <Sketchy fill="#fffdf6" className="flex flex-col gap-[0.8cqw] p-[1.2cqw]">
          {rows.map((r) => (
            <div key={r.n} style={{ paddingLeft: `${r.depth * 3}cqw` }}>
              <Sketchy fill={r.depth === 1 ? '#bfe0ff' : 'transparent'} className="flex items-center gap-[0.8cqw] px-[0.8cqw] py-[0.5cqw]">
                <Hand size={1.3} className="font-bold text-[#e8743b]">{r.n}</Hand>
                <Hand size={r.depth === 2 ? 1.15 : 1.4} className="truncate">{r.label}</Hand>
              </Sketchy>
            </div>
          ))}
        </Sketchy>
      </Pin>
      <Pin x={800} y={140} w={180}>
        <Btn>{t({ es: 'Mover a…', en: 'Move to…' })}</Btn>
      </Pin>
      <Arrows paths={[{ d: 'M795 165 C760 170 720 200 690 215', accent: true }]} />
      <Pin x={800} y={240} w={330} rotate={2}>
        <Sticky color="yellow">{t({ es: 'Arrastrar solo reordena hermanas', en: 'Dragging only reorders siblings' })}</Sticky>
      </Pin>
      <Pin x={830} y={420} w={260} rotate={-2}>
        <Sticky color="orange" small>{t({ es: 'Tope: tres niveles', en: 'Cap: three levels' })}</Sticky>
      </Pin>
      <Pin x={60} y={560} w={600}>
        <Hand size={1.35} className="opacity-70">{t({ es: '→ el mismo borrador alimenta vista previa, resultados y archivos', en: '→ the same draft feeds preview, results and files' })}</Hand>
      </Pin>
    </Board>
  )
}

/** V4 · En Flux UI: la matriz Likert se vuelve una tarjeta por enunciado. */
function SystemBoard() {
  const { t } = useLocale()
  return (
    <Board title="Flux UI · V4" w={1200} h={680} label={t({ es: 'Boceto de la matriz Likert y las tarjetas', en: 'Likert matrix and cards sketch' })}>
      <Pin x={40} y={28}>
        <Hand size={2.4} className="font-bold">{t({ es: 'Un enunciado, una tarjeta', en: 'One statement, one card' })}</Hand>
      </Pin>
      <Pin x={40} y={140} w={380}>
        <div className="relative">
          <Sketchy className="grid grid-cols-[2fr_repeat(5,1fr)] gap-[0.5cqw] p-[1cqw] opacity-60">
            {Array.from({ length: 24 }, (_, i) => (i % 6 === 0 ? <Bar key={i} w={90} /> : <span key={i} className="mx-auto h-[1cqw] w-[1cqw] rounded-full border-[0.15cqw] border-[#2a2d33]" />))}
          </Sketchy>
          <span aria-hidden="true" className="absolute inset-0 grid place-items-center font-hand text-[8cqw] leading-none text-[#e8743b]">×</span>
        </div>
        <Hand size={1.3} className="mt-[0.6cqw] block opacity-70"><Dropped>{t({ es: 'La matriz como tabla', en: 'The matrix as a table' })}</Dropped></Hand>
      </Pin>
      <Pin x={520} y={110} w={620}>
        <div className="flex flex-col gap-[1cqw]">
          {[0, 1, 2].map((i) => (
            <Sketchy key={i} fill="#fffdf6" className="flex flex-col gap-[0.7cqw] p-[1cqw]">
              <Bar w={[75, 60, 82][i]} strong />
              <div className="flex gap-[1.4cqw]">
                {[0, 1, 2, 3, 4].map((k) => (
                  <span key={k} className={`h-[1.6cqw] w-[1.6cqw] rounded-full border-[0.18cqw] border-[#2a2d33] ${k === [3, 4, 2][i] ? 'bg-[#e8743b]' : ''}`} />
                ))}
              </div>
            </Sketchy>
          ))}
        </div>
      </Pin>
      <Pin x={60} y={470} w={310} rotate={-2}>
        <Sticky color="blue">{t({ es: '99 funcionalidades con fecha de llegada', en: '99 features with a delivery date' })}</Sticky>
      </Pin>
      <Pin x={600} y={540} w={280} rotate={1.5}>
        <Sticky color="violet" small>{t({ es: '487 casos de uso, cada uno con su subtarea', en: '487 use cases, each with its subtask' })}</Sticky>
      </Pin>
    </Board>
  )
}

/** Los cuatro tableros, en el orden de las iteraciones */
export const SKETCH_BOARDS: readonly { title: L; when: L; Board: () => JSX.Element }[] = [
  { title: { es: 'Importar conversando', en: 'Importing by chatting' }, when: { es: 'V1 · may – jul 2026', en: 'V1 · May – Jul 2026' }, Board: ChatBoard },
  { title: { es: 'Un panel de tres pasos', en: 'A three-step panel' }, when: { es: 'V2 · jul 2026', en: 'V2 · Jul 2026' }, Board: DrawerBoard },
  { title: { es: 'Un árbol que se numera solo', en: 'A tree that numbers itself' }, when: { es: 'V3 · ago – sep 2026', en: 'V3 · Aug – Sep 2026' }, Board: TreeBoard },
  { title: { es: 'Un enunciado, una tarjeta', en: 'One statement, one card' }, when: { es: 'V4 · sep – nov 2026', en: 'V4 · Sep – Nov 2026' }, Board: SystemBoard },
]

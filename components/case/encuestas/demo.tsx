'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useLocale, type L } from '@/lib/i18n'
import { RecordModal } from '@/components/case/kit/record-modal'
import { SHOTS, type ShotKey } from '@/lib/content/cases/encuestas/case'
import { AnswerPage, EMPTY_ANSWERS, LIKERT_QUESTIONS, PAGES, type Answers, type Page } from './demo-answer'
import { FAV, favColor, Lock, UBITS_BLUE } from './shared'

const RECORDS = [
  { id: 'responder', name: { es: 'Responder como colaborador', en: 'Answer as an employee' }, hint: { es: 'Bienvenida, Likert, recomendabilidad con profundidad y cierre', en: 'Welcome, Likert, recommendation with depth and closing' } },
  { id: 'resultados', name: { es: 'Ver lo que ve RR. HH.', en: 'See what HR sees' }, hint: { es: 'Tu respuesta suma a tu área y la saca de «Reservado»', en: 'Your answer joins your area and takes it out of “Reserved”' } },
  { id: 'pantallas', name: { es: 'Las 25 pantallas reales', en: 'The 25 real screens' }, hint: { es: 'Todo el producto, capturado del playground', en: 'The whole product, captured from the playground' } },
] as const

type RecordId = (typeof RECORDS)[number]['id']

/** Áreas del resultado: Comercial es la tuya y empieza con 4 respuestas, una menos que el mínimo. */
const AREAS = [
  { name: 'Producto', n: 48, mine: false },
  { name: 'Tecnología', n: 61, mine: false },
  { name: 'Comercial', n: 4, mine: true },
] as const
/** Promedio Likert de cada área antes de tu respuesta (1.1 lo mueves tú; 1.2 no estaba en tu encuesta). */
const LEADER = [3.9, 3.4, 3.1] as const
const RECOGNITION = [3.6, 2.8, 2.6] as const
/** Promotores y detractores de cada área antes de tu respuesta, para el eNPS. */
const NPS_BASE = [
  { pro: 22, det: 13 },
  { pro: 21, det: 24 },
  { pro: 1, det: 2 },
] as const
const MIN_GROUP = 5

function Responder({ answers, setAnswers, onSent }: { answers: Answers; setAnswers: (a: Answers) => void; onSent: () => void }) {
  const { t } = useLocale()
  const [page, setPage] = useState<Page>('bienvenida')
  const i = PAGES.indexOf(page)
  const answered = answers.likert.filter((v) => v !== null).length + (answers.nps !== null ? 1 : 0)
  const blocked = (page === 'lider' && answers.likert.some((v) => v === null)) || (page === 'recomendacion' && answers.nps === null)
  const next = PAGES[i + 1]
  const label = page === 'bienvenida' ? t({ es: 'Comenzar encuesta', en: 'Start survey' }) : next === 'cierre' ? t({ es: 'Enviar y finalizar', en: 'Send and finish' }) : t({ es: 'Continuar', en: 'Continue' })

  return (
    <div className="grid min-h-0 flex-1 gap-0 overflow-y-auto bg-[#eef1f7] md:grid-cols-[minmax(0,1fr)_16rem]">
      <div className="flex justify-center p-4 sm:p-8">
        <div className="flex w-full max-w-[40rem] flex-col rounded-2xl bg-white p-5 text-[#303a47] shadow-sm sm:p-7">
          <div className="flex-1">
            <AnswerPage page={page} answers={answers} onChange={setAnswers} />
          </div>
          <div className="mt-6 flex items-center justify-between gap-3 border-t border-black/10 pt-4">
            {page !== 'bienvenida' && page !== 'cierre' ? (
              <button type="button" onClick={() => setPage(PAGES[i - 1])} className="rounded-lg border border-black/15 px-3 py-2 text-sm">‹ {t({ es: 'Volver', en: 'Back' })}</button>
            ) : <span />}
            {blocked && <span className="text-xs text-[#b02a37]">{t({ es: 'Responde las preguntas obligatorias para seguir.', en: 'Answer the required questions to continue.' })}</span>}
            {page === 'cierre' ? (
              <button type="button" onClick={onSent} className="rounded-lg px-4 py-2 text-sm font-medium text-white" style={{ background: UBITS_BLUE }}>{t({ es: 'Ver cómo cambia el resultado →', en: 'See how the result changes →' })}</button>
            ) : (
              <button type="button" disabled={blocked} onClick={() => next && setPage(next)} className="rounded-lg px-4 py-2 text-sm font-medium text-white transition-opacity disabled:opacity-40" style={{ background: UBITS_BLUE }}>{label} ›</button>
            )}
          </div>
        </div>
      </div>
      <aside className="border-t border-black/10 bg-white p-5 text-[#303a47] md:border-l md:border-t-0">
        <p className="text-xs font-semibold">{t({ es: 'Tu avance', en: 'Your progress' })}</p>
        <p className="mt-3 flex justify-between text-xs text-[#5c646f]"><span>{t({ es: 'Preguntas respondidas', en: 'Questions answered' })}</span><span className="tabular-nums">{answered} / 4</span></p>
        <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-[#ecf1fa]"><span className="block h-full rounded-full transition-[width] duration-500" style={{ width: `${(answered / 4) * 100}%`, background: UBITS_BLUE }} /></span>
        <ol className="mt-5 space-y-1 text-sm">
          {[
            { id: 'bienvenida', label: { es: 'Bienvenida', en: 'Welcome' }, done: i > 0 },
            { id: 'lider', label: { es: '1.1 Mi líder directo', en: '1.1 My direct leader' }, done: answers.likert.every((v) => v !== null) },
            { id: 'recomendacion', label: { es: '2.1 Recomendabilidad', en: '2.1 Recommendation' }, done: answers.nps !== null },
            { id: 'cierre', label: { es: 'Cierre', en: 'Closing' }, done: page === 'cierre' },
          ].map((row) => (
            <li key={row.id} className={`flex items-center justify-between rounded-md px-2 py-1.5 ${row.id === page ? 'bg-[#ecf1fa] text-[#0c5bef]' : ''}`}>
              <span>{t(row.label as L)}</span>
              {row.done && <span className="text-[#2c6b2f]">✓</span>}
            </li>
          ))}
        </ol>
      </aside>
    </div>
  )
}

function Cell({ reserved, bg, children }: { reserved: boolean; bg: string; children: React.ReactNode }) {
  const { t } = useLocale()
  return (
    <span className="bg-white p-2">
      <span className="flex h-12 items-center justify-center rounded-lg font-mono tabular-nums transition-[background-color] duration-700" style={reserved ? { background: '#f1f3f7', color: '#979ba3' } : { background: bg, color: '#14161a' }}>
        {reserved ? <span className="flex items-center gap-1 text-xs"><Lock className="h-4 w-4" /> {t({ es: 'Reservado', en: 'Reserved' })}</span> : children}
      </span>
    </span>
  )
}

const signed = (v: number) => `${v > 0 ? '+' : ''}${Math.round(v)}`
const npsColor = (v: number) => (v < 0 ? FAV[1] : v < 30 ? FAV[2] : FAV[3])

function Results({ answers, sent, onAnswer }: { answers: Answers; sent: boolean; onAnswer: () => void }) {
  const { t } = useLocale()
  const mine = answers.likert.filter((v): v is number => v !== null)
  const cols = AREAS.map((a, i) => {
    const add = a.mine && sent ? 1 : 0
    const n = a.n + add
    const leader = add ? (LEADER[i] * a.n * 3 + mine.reduce((s, v) => s + v, 0)) / (n * 3) : LEADER[i]
    const nps = answers.nps ?? 0
    const pro = NPS_BASE[i].pro + (add && nps >= 9 ? 1 : 0)
    const det = NPS_BASE[i].det + (add && nps <= 6 ? 1 : 0)
    return { ...a, n, leader, recognition: RECOGNITION[i], enps: ((pro - det) / n) * 100, reserved: n < MIN_GROUP }
  })
  const rows: readonly { label: L; render: (c: (typeof cols)[number]) => React.ReactNode }[] = [
    { label: { es: '1.1 Mi líder directo', en: '1.1 My direct leader' }, render: (c) => <Cell reserved={c.reserved} bg={favColor(c.leader)}>{c.leader.toFixed(1).replace('.', ',')}</Cell> },
    { label: { es: '1.2 Reconocimiento', en: '1.2 Recognition' }, render: (c) => <Cell reserved={c.reserved} bg={favColor(c.recognition)}>{c.recognition.toFixed(1).replace('.', ',')}</Cell> },
    { label: { es: '2.1 Recomendabilidad · eNPS', en: '2.1 Recommendation · eNPS' }, render: (c) => <Cell reserved={c.reserved} bg={npsColor(c.enps)}>{signed(c.enps)}</Cell> },
  ]
  return (
    <div className="min-h-0 flex-1 overflow-y-auto bg-[#f8faff] p-4 text-[#303a47] sm:p-8">
      <div className="mx-auto max-w-[52rem]">
        <p className="text-xs text-[#5c646f]">{t({ es: 'Resultados › Favorabilidad › Mapa de calor por área', en: 'Results › Favorability › Heatmap by area' })}</p>
        <h3 className="mt-1 text-2xl font-semibold">{t({ es: 'Pulso de clima · Noviembre', en: 'Climate pulse · November' })}</h3>
        <p className="mt-1 text-sm text-[#5c646f]">{t({ es: 'Anónima · mínimo 5 respuestas por grupo', en: 'Anonymous · minimum 5 answers per group' })}</p>
        {!sent && (
          <p className="mt-4 rounded-xl bg-[#fbf3d6] px-4 py-3 text-sm text-[#8f6400]">
            {t({ es: 'Comercial tiene 4 respuestas: le falta una para el mínimo de 5. ', en: 'Sales has 4 answers: it needs one more to reach the minimum of 5. ' })}
            <button type="button" onClick={onAnswer} className="font-semibold underline">{t({ es: 'Responde tú la encuesta', en: 'Answer the survey yourself' })}</button>
          </p>
        )}
        {sent && (
          <p className="enc-fade mt-4 rounded-xl bg-[#e2f1e2] px-4 py-3 text-sm text-[#2c6b2f]">
            {t({ es: 'Con tu respuesta, Comercial llegó a 5: sus resultados ya se pueden leer, y nadie sabe cuál de las cinco es la tuya.', en: 'With your answer, Sales reached 5: its results can now be read, and nobody knows which of the five is yours.' })}
          </p>
        )}
        <div className="mt-6 overflow-hidden rounded-2xl bg-white ring-1 ring-black/10">
          <div className="grid grid-cols-[minmax(0,1.6fr)_repeat(3,minmax(0,1fr))] gap-px bg-black/[0.06] text-sm">
            <span className="bg-white p-3 text-xs font-semibold">{t({ es: 'Sección', en: 'Section' })}</span>
            {cols.map((c) => (
              <span key={c.name} className="bg-white p-3 text-center text-xs font-semibold">
                {c.name}{c.mine && <span className="ml-1 text-[#0c5bef]">· {t({ es: 'tu área', en: 'your area' })}</span>}
                <span className="block font-mono text-[10px] font-normal text-[#979ba3]">n={c.n}</span>
              </span>
            ))}
            {rows.map((r) => (
              <div key={r.label.es} className="contents">
                <span className="flex items-center bg-white p-3">{t(r.label)}</span>
                {cols.map((c) => <span key={c.name} className="contents">{r.render(c)}</span>)}
              </div>
            ))}
          </div>
        </div>
        {sent && (
          <div className="enc-fade mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-white p-4 ring-1 ring-black/10">
              <p className="text-xs font-semibold">{t({ es: 'Lo que entró de ti', en: 'What came in from you' })}</p>
              <ul className="mt-2 space-y-1 text-xs text-[#5c646f]">
                {LIKERT_QUESTIONS.map((q, i) => <li key={q.es} className="flex justify-between gap-3"><span className="truncate">{t(q)}</span><span className="font-mono">{answers.likert[i]}</span></li>)}
                <li className="flex justify-between"><span>{t({ es: 'Recomendabilidad (0 a 10)', en: 'Recommendation (0 to 10)' })}</span><span className="font-mono">{answers.nps}</span></li>
              </ul>
            </div>
            <div className="rounded-2xl bg-white p-4 ring-1 ring-black/10">
              <p className="text-xs font-semibold">{t({ es: 'Cómo aparece tu comentario', en: 'How your comment shows' })}</p>
              <p className="mt-2 text-sm">«{answers.depth.trim() || t({ es: '(sin comentario: la profundidad era opcional)', en: '(no comment: depth was optional)' })}»</p>
              <p className="mt-2 font-mono text-[10px] text-[#979ba3]">{t({ es: 'Participante 5 · sin área ni país: la encuesta es anónima', en: 'Participant 5 · no area or country: the survey is anonymous' })}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const GALLERY: readonly ShotKey[] = ['lista', 'plantillas', 'crear', 'general', 'participantes', 'demograficos', 'secciones', 'banco', 'bienvenida', 'previewBienvenida', 'previewPreguntas', 'previewFinal', 'cargarAnaliza', 'cargarDatos', 'cargarEstructura', 'participacion', 'favorabilidad', 'heatmap', 'personas', 'comentarios', 'enps', 'ia', 'accionables', 'descargas', 'comparativo']

function Gallery() {
  const { t } = useLocale()
  const [i, setI] = useState(0)
  const shot = SHOTS[GALLERY[i]]
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="relative flex min-h-0 flex-1 items-center justify-center bg-[#0b0c0e] p-3">
        <Image key={shot.src} src={shot.src} width={shot.width} height={shot.height} alt={t(shot.alt)} sizes="90vw" className="enc-fade max-h-full w-auto rounded-lg object-contain" />
      </div>
      <div className="flex shrink-0 items-center gap-3 border-t border-white/10 px-4 py-3">
        <p className="min-w-0 flex-1 truncate text-sm text-white/80"><span className="mr-2 font-mono text-[11px] text-white/45">{i + 1}/{GALLERY.length}</span>{t(shot.alt)}</p>
        <button type="button" onClick={() => setI((v) => (v - 1 + GALLERY.length) % GALLERY.length)} className="rounded-md border border-white/15 px-3 py-1.5 text-xs text-white/80 hover:bg-white/10">‹ {t({ es: 'Anterior', en: 'Previous' })}</button>
        <button type="button" onClick={() => setI((v) => (v + 1) % GALLERY.length)} className="rounded-md border border-white/15 px-3 py-1.5 text-xs text-white/80 hover:bg-white/10">{t({ es: 'Siguiente', en: 'Next' })} ›</button>
      </div>
    </div>
  )
}

/** 08 · Demo: el ciclo en un modal a pantalla completa, de responder a leer el resultado. */
export function SurveyDemo() {
  const { t } = useLocale()
  const [open, setOpen] = useState<RecordId | null>(null)
  const [answers, setAnswers] = useState<Answers>(EMPTY_ANSWERS)
  const [sent, setSent] = useState(false)
  const record = RECORDS.find((r) => r.id === open)

  return (
    <div>
      <div className="mb-10 grid gap-6 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <p data-reveal className="text-[clamp(1.6rem,1rem+1.8vw,2.6rem)] font-light leading-tight">{t({ es: 'Responde, y mira qué cambia.', en: 'Answer, and watch what changes.' })}</p>
          <p data-reveal className="mt-4 leading-relaxed opacity-80">{t({ es: 'Tu área empieza con una respuesta menos que el mínimo. Contesta la encuesta como colaborador y luego mira el mapa de calor como RR. HH.: tu respuesta es la que la saca de «Reservado», sin que tu nombre aparezca en ningún lado.', en: 'Your area starts one answer short of the minimum. Answer the survey as an employee, then look at the heatmap as HR: your answer is the one that takes it out of “Reserved”, without your name appearing anywhere.' })}</p>
        </div>
        <ul data-reveal className="flex flex-col gap-2 lg:col-span-5">
          {RECORDS.map((r, i) => (
            <li key={r.id}>
              <button type="button" onClick={() => setOpen(r.id)} className="group flex w-full items-baseline gap-3 border border-fg/25 px-4 py-3 text-left transition-colors hover:border-signal hover:bg-signal hover:text-paper">
                <span className="font-mono text-[10px] opacity-60">0{i + 1}</span>
                <span className="flex-1">
                  <span className="block">{t(r.name)} ↗</span>
                  <span className="block text-xs opacity-60">{t(r.hint)}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <button type="button" onClick={() => setOpen('responder')} data-reveal="device" className="group relative block w-full [perspective:1800px]">
        <span className="block overflow-hidden rounded-xl bg-[#0b0c0e] shadow-[0_60px_120px_-40px_rgba(0,0,0,0.85)] ring-1 ring-white/10 transition-transform duration-700 ease-expo [transform:rotateX(8deg)] group-hover:[transform:none]">
          <Image src={SHOTS.previewPreguntas.src} width={SHOTS.previewPreguntas.width} height={SHOTS.previewPreguntas.height} alt="" sizes="(min-width: 1024px) 70vw, 100vw" className="block h-auto w-full transition-[filter] duration-500 group-hover:brightness-75" />
        </span>
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex items-center gap-3 bg-void/85 px-6 py-4 text-paper backdrop-blur transition-colors group-hover:bg-signal">
            <span className="mono-label">⤢ {t({ es: 'Abrir la demo a pantalla completa', en: 'Open the demo full screen' })}</span>
          </span>
        </span>
      </button>

      <RecordModal
        ids={RECORDS.map((r) => r.id)}
        openId={open}
        onOpenChange={(id) => setOpen(id as RecordId | null)}
        title={record ? `Encuestas · ${t(record.name)}` : 'Encuestas'}
        titleLeading={<span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-semibold text-white" style={{ background: UBITS_BLUE }}>En</span>}
        description={record ? t(record.hint) : undefined}
        actions={
          (sent || answers.nps !== null) && (
            <button type="button" onClick={() => { setAnswers(EMPTY_ANSWERS); setSent(false); setOpen('responder') }} className="inline-flex h-8 items-center rounded-md border border-white/15 px-3 font-mono text-[11px] text-white/75 hover:bg-white/10">
              ↺ {t({ es: 'Empezar de nuevo', en: 'Start over' })}
            </button>
          )
        }
        prevLabel={t({ es: 'Vista anterior', en: 'Previous view' })}
        nextLabel={t({ es: 'Vista siguiente', en: 'Next view' })}
      >
        {open === 'responder' && <Responder key={sent ? 'sent' : 'new'} answers={answers} setAnswers={setAnswers} onSent={() => { setSent(true); setOpen('resultados') }} />}
        {open === 'resultados' && <Results answers={answers} sent={sent} onAnswer={() => setOpen('responder')} />}
        {open === 'pantallas' && <Gallery />}
      </RecordModal>
    </div>
  )
}

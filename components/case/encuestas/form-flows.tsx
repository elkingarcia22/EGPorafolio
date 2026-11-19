'use client'

import { useState } from 'react'
import { useLocale, type L } from '@/lib/i18n'
import { BrowserFrame } from './form-moments'
import { FAV, favColor, UBITS_BLUE, useTicker } from './shared'

const ROUTE = '/admin/desempeno-cultura/encuestas'

const STAGES: readonly L[] = [
  { es: 'Archivo', en: 'File' },
  { es: 'Análisis', en: 'Analysis' },
  { es: 'Match', en: 'Match' },
  { es: 'Listo', en: 'Ready' },
]
const ANALYSIS: readonly L[] = [
  { es: 'Leyendo la estructura del archivo', en: 'Reading the file structure' },
  { es: 'Sugiriendo fechas a partir del nombre', en: 'Suggesting dates from the file name' },
  { es: 'Haciendo match con la estructura de UBITS', en: 'Matching against the UBITS structure' },
  { es: 'Calculando favorabilidad y eNPS', en: 'Computing favorability and eNPS' },
]
/** Personas del archivo contra usuarios de UBITS: correo idéntico, solo el nombre o nada. */
const PEOPLE: readonly { file: string; kind: 'match' | 'maybe' | 'none' }[] = [
  { file: 'a.rojas@empresa.co', kind: 'match' },
  { file: 'Francisca Leiva Toro', kind: 'maybe' },
  { file: 'jmendez', kind: 'match' },
  { file: 'Ext-0412', kind: 'none' },
  { file: 'c.patino@empresa.co', kind: 'match' },
]
const KIND = {
  match: { color: '#43a970', label: { es: 'Hacen match con UBITS', en: 'Match UBITS' }, n: 18, note: { es: 'Usuario o correo idéntico: se vinculan solos', en: 'Identical user or email: linked automatically' } },
  maybe: { color: '#7aa2ff', label: { es: 'Posibles match', en: 'Possible matches' }, n: 4, note: { es: 'Solo coincide el nombre: decide la persona', en: 'Only the name matches: a person decides' } },
  none: { color: '#979ba3', label: { es: 'Sin match', en: 'No match' }, n: 6, note: { es: 'Se cargan sin usuario', en: 'Loaded without a user' } },
} as const
const CYCLE = 7

/** Momento 5: el archivo cae, la IA lo lee, las personas se conectan con sus usuarios y salen los indicadores. */
export function UploadPipeline() {
  const { t } = useLocale()
  const tick = useTicker(1700)
  const step = tick % CYCLE
  const stage = step === 0 ? 0 : step <= 2 ? 1 : step <= 4 ? 2 : 3
  const row = 34

  return (
    <BrowserFrame route={`${ROUTE} · ${t({ es: 'Cargar encuestas', en: 'Upload surveys' })}`}>
      <div className="p-4 sm:p-6">
        <ol className="flex items-center gap-1.5 text-[11px]" aria-label={t({ es: 'Etapas de la carga', en: 'Upload stages' })}>
          {STAGES.map((s, i) => (
            <li key={s.es} className="flex min-w-0 flex-1 items-center gap-1.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] text-white transition-colors duration-500" style={{ background: i <= stage ? UBITS_BLUE : '#c5ccd8' }}>{i < stage ? '✓' : i + 1}</span>
              <span className={`truncate ${i === stage ? 'font-semibold' : 'text-[#5c646f]'}`}>{t(s)}</span>
              {i < STAGES.length - 1 && <span className="h-px min-w-2 flex-1 transition-colors duration-500" style={{ background: i < stage ? UBITS_BLUE : '#d0d2d5' }} />}
            </li>
          ))}
        </ol>

        <div className="relative mt-5 min-h-[17rem]" aria-live="polite">
          {stage === 0 && (
            <div key="drop" className="enc-fade flex h-[17rem] flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#0c5bef]/40 bg-white">
              <span className="encf-drop flex items-center gap-2 rounded-lg bg-[#e2f1e2] px-3 py-2 font-mono text-xs text-[#2c6b2f] shadow-xl">▦ Clima 2025.xlsx</span>
              <p className="mt-5 text-sm">{t({ es: 'Suelta el archivo aquí', en: 'Drop the file here' })}</p>
              <p className="text-xs text-[#979ba3]">{t({ es: 'Excel, CSV, PDF o imágenes', en: 'Excel, CSV, PDF or images' })}</p>
            </div>
          )}
          {stage === 1 && (
            <ul key="an" className="enc-fade space-y-2.5 rounded-xl bg-white p-5 ring-1 ring-black/[0.06]">
              {ANALYSIS.map((m, i) => {
                const done = i < (step - 1) * 2 + 1
                return (
                  <li key={m.es} className={`flex items-center gap-3 text-sm transition-opacity duration-500 ${done ? '' : 'opacity-40'}`}>
                    <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${done ? 'bg-[#e2f1e2] text-[#2c6b2f]' : 'enc-pulse bg-[#ecf1fa] text-[#0c5bef]'}`}>{done ? '✓' : '◆'}</span>
                    {t(m)}…
                  </li>
                )
              })}
            </ul>
          )}
          {stage === 2 && (
            <div key="match" className="enc-fade grid grid-cols-[minmax(0,1fr)_3.5rem_minmax(0,1fr)] items-start sm:grid-cols-[minmax(0,1fr)_6rem_minmax(0,1fr)]">
              <ul className="space-y-1.5">
                <li className="h-5 font-mono text-[10px] uppercase text-[#979ba3]">{t({ es: 'En el archivo', en: 'In the file' })}</li>
                {PEOPLE.map((p) => (
                  <li key={p.file} className="truncate rounded-md bg-white px-2 py-1.5 font-mono text-[10px] ring-1 ring-black/[0.06] sm:text-[11px]" style={{ height: row - 6 }}>{p.file}</li>
                ))}
              </ul>
              <svg viewBox={`0 0 100 ${PEOPLE.length * row + 20}`} preserveAspectRatio="none" className="h-full w-full" aria-hidden="true">
                {PEOPLE.map((p, i) => {
                  if (p.kind === 'none') return null
                  const y = 26 + i * row + (row - 6) / 2
                  return <path key={p.file} d={`M0 ${y} C 50 ${y}, 50 ${y}, 100 ${y}`} pathLength={1} fill="none" stroke={KIND[p.kind].color} strokeWidth="2.5" strokeDasharray={p.kind === 'maybe' ? '0.06 0.04' : undefined} className={p.kind === 'match' ? 'encf-link' : ''} style={{ animationDelay: `${i * 0.15}s` }} vectorEffect="non-scaling-stroke" />
                })}
              </svg>
              <ul className="space-y-1.5">
                <li className="h-5 font-mono text-[10px] uppercase text-[#979ba3]">UBITS</li>
                {PEOPLE.map((p) => (
                  <li key={p.file} className="flex items-center gap-1.5 truncate rounded-md px-2 py-1.5 text-[10px] sm:text-[11px]" style={{ height: row - 6, background: p.kind === 'none' ? 'transparent' : '#fff', color: KIND[p.kind].color, boxShadow: p.kind === 'none' ? 'inset 0 0 0 1px #d0d2d5' : `inset 0 0 0 1.5px ${KIND[p.kind].color}` }}>
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: KIND[p.kind].color }} />
                    <span className="truncate">{t(KIND[p.kind].label)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {stage === 3 && (
            <div key="ready" className="enc-fade space-y-3">
              <div className="grid grid-cols-3 gap-2 rounded-xl bg-white p-3 ring-1 ring-black/[0.06] sm:p-4">
                {[
                  ['87,5 %', { es: 'Participación · 28 de 32', en: 'Participation · 28 of 32' }],
                  ['+65', { es: 'Favorabilidad neta', en: 'Net favorability' }],
                  ['50', { es: 'eNPS', en: 'eNPS' }],
                ].map(([v, l], i) => (
                  <div key={String(v)} className="encf-pop" style={{ animationDelay: `${i * 0.12}s` }}>
                    <p className="text-xl font-semibold tabular-nums sm:text-2xl">{String(v)}</p>
                    <p className="text-[10px] leading-tight text-[#5c646f] sm:text-[11px]">{t(l as L)}</p>
                  </div>
                ))}
              </div>
              {(['match', 'maybe', 'none'] as const).map((k, i) => (
                <div key={k} className="flex items-center gap-3 rounded-xl bg-white px-3 py-2.5 ring-1 ring-black/[0.06]">
                  <span className="w-8 font-mono text-lg font-semibold tabular-nums" style={{ color: KIND[k].color }}>{KIND[k].n}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-medium">{t(KIND[k].label)}</span>
                    <span className="block truncate text-[10px] text-[#5c646f]">{t(KIND[k].note)}</span>
                  </span>
                  <span className="encf-grow hidden h-1.5 w-24 rounded-full sm:block" style={{ background: KIND[k].color, width: `${(KIND[k].n / 18) * 6}rem`, animationDelay: `${i * 0.12}s` }} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </BrowserFrame>
  )
}

type TabId = 'participacion' | 'favorabilidad' | 'heatmap' | 'enps' | 'comentarios'
const TABS: readonly { id: TabId; name: L; question: L }[] = [
  { id: 'participacion', name: { es: 'Participación', en: 'Participation' }, question: { es: '¿Quién respondió y quién falta?', en: 'Who answered and who’s missing?' } },
  { id: 'favorabilidad', name: { es: 'Favorabilidad', en: 'Favorability' }, question: { es: '¿Qué tan bien salió, y dónde?', en: 'How did it go, and where?' } },
  { id: 'heatmap', name: { es: 'Mapa de calor', en: 'Heatmap' }, question: { es: '¿Qué grupo se separa del resto?', en: 'Which group stands apart?' } },
  { id: 'enps', name: { es: 'eNPS', en: 'eNPS' }, question: { es: '¿Nos recomiendan?', en: 'Would they recommend us?' } },
  { id: 'comentarios', name: { es: 'Comentarios', en: 'Comments' }, question: { es: '¿Qué dijo la gente, con sus palabras?', en: 'What did people say, in their words?' } },
]
const SECTIONS: readonly [L, number][] = [
  [{ es: 'Propósito', en: 'Purpose' }, 82],
  [{ es: 'Liderazgo', en: 'Leadership' }, 64],
  [{ es: 'Colaboración', en: 'Collaboration' }, 76],
  [{ es: 'Bienestar', en: 'Well-being' }, 48],
]
const COMMENTS: readonly { text: L; mood: 'pos' | 'neu' | 'neg'; topic: L }[] = [
  { text: { es: 'Mi líder escucha y cumple lo que acordamos.', en: 'My leader listens and keeps what we agree.' }, mood: 'pos', topic: { es: 'Liderazgo', en: 'Leadership' } },
  { text: { es: 'Las reuniones se comen la tarde entera.', en: 'Meetings eat the whole afternoon.' }, mood: 'neg', topic: { es: 'Carga', en: 'Workload' } },
  { text: { es: 'Me gustaría saber hacia dónde va el área.', en: 'I’d like to know where the area is heading.' }, mood: 'neu', topic: { es: 'Propósito', en: 'Purpose' } },
]
const MOOD = { pos: { c: '#43a970', l: { es: 'Positivo', en: 'Positive' } }, neu: { c: '#b28a1f', l: { es: 'Neutral', en: 'Neutral' } }, neg: { c: '#e0675f', l: { es: 'Negativo', en: 'Negative' } } } as const

function Chart({ id }: { id: TabId }) {
  const { t } = useLocale()
  if (id === 'participacion') {
    const r = 46
    const c = 2 * Math.PI * r
    return (
      <div className="flex items-center gap-6">
        <svg viewBox="0 0 120 120" className="h-32 w-32 shrink-0 -rotate-90" aria-hidden="true">
          <circle cx="60" cy="60" r={r} fill="none" stroke="#ecf1fa" strokeWidth="12" />
          <circle cx="60" cy="60" r={r} fill="none" stroke={UBITS_BLUE} strokeWidth="12" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c} className="transition-[stroke-dashoffset] duration-1000" style={{ strokeDashoffset: c * 0.22 }} />
        </svg>
        <div>
          <p className="text-3xl font-semibold tabular-nums">78 %</p>
          <p className="text-xs text-[#5c646f]">{t({ es: '405 de 520 · recordar a los 115 que faltan', en: '405 of 520 · remind the 115 left' })}</p>
        </div>
      </div>
    )
  }
  if (id === 'favorabilidad')
    return (
      <ul className="space-y-2.5">
        {SECTIONS.map(([s, v], i) => (
          <li key={s.es} className="grid grid-cols-[5.5rem_1fr_2.5rem] items-center gap-2 text-xs">
            <span className="truncate">{t(s)}</span>
            <span className="h-3 overflow-hidden rounded-full bg-[#eceef3]"><span className="encf-grow block h-full rounded-full" style={{ width: `${v}%`, background: favColor(1 + (v / 100) * 4), animationDelay: `${i * 0.1}s` }} /></span>
            <span className="text-right font-mono tabular-nums">{v} %</span>
          </li>
        ))}
      </ul>
    )
  if (id === 'heatmap')
    return (
      <div className="grid grid-cols-5 gap-1">
        {Array.from({ length: 20 }, (_, i) => {
          const v = 2.2 + ((i * 7) % 11) / 4
          return <span key={i} className="encf-unlock flex h-8 items-center justify-center rounded-md font-mono text-[10px] text-[#14161a]" style={{ background: favColor(v), animationDelay: `${i * 35}ms` }}>{v.toFixed(1).replace('.', ',')}</span>
        })}
      </div>
    )
  if (id === 'enps')
    return (
      <div>
        <p className="text-3xl font-semibold tabular-nums">+32</p>
        <div className="mt-3 flex h-6 overflow-hidden rounded-full text-[10px] font-medium text-[#14161a]">
          {[
            [18, FAV[0], { es: 'Detractores', en: 'Detractors' }],
            [32, FAV[2], { es: 'Neutros', en: 'Passives' }],
            [50, FAV[4], { es: 'Promotores', en: 'Promoters' }],
          ].map(([w, c, l], i) => (
            <span key={String(c)} className="encf-grow flex items-center justify-center truncate" style={{ width: `${w}%`, background: String(c), animationDelay: `${i * 0.15}s` }}>{t(l as L)} {String(w)} %</span>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-[#5c646f]">{t({ es: 'Promotores menos detractores: 50 − 18', en: 'Promoters minus detractors: 50 − 18' })}</p>
      </div>
    )
  return (
    <ul className="space-y-2">
      {COMMENTS.map((c, i) => (
        <li key={c.text.es} className="encf-pop flex items-start gap-2 rounded-lg bg-white p-2.5 text-xs ring-1 ring-black/[0.06]" style={{ animationDelay: `${i * 0.12}s` }}>
          <span className="flex-1">«{t(c.text)}»</span>
          <span className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ background: `${MOOD[c.mood].c}1f`, color: MOOD[c.mood].c }}>{t(MOOD[c.mood].l)}</span>
          <span className="hidden shrink-0 rounded-full bg-[#ecf1fa] px-2 py-0.5 text-[10px] text-[#0c5bef] sm:inline">{t(c.topic)}</span>
        </li>
      ))}
    </ul>
  )
}

/** Momento 6: cada pestaña de resultados responde una sola pregunta, con su propia gráfica. */
export function ResultsTabs() {
  const { t } = useLocale()
  const [picked, setPicked] = useState<number | null>(null)
  const tick = useTicker(3200, picked === null)
  const active = picked ?? tick % TABS.length
  const tab = TABS[active]
  return (
    <BrowserFrame route={`${ROUTE}/c2026-1/resultados`}>
      <div className="flex gap-1 overflow-x-auto overflow-y-hidden border-b border-black/[0.06] bg-white px-3" role="tablist" aria-label={t({ es: 'Pestañas de resultados', en: 'Results tabs' })}>
        {TABS.map((x, i) => (
          <button key={x.id} type="button" role="tab" aria-selected={i === active} onClick={() => setPicked(i)} className={`-mb-px shrink-0 border-b-2 px-3 py-2.5 text-xs transition-colors ${i === active ? 'border-[#0c5bef] font-semibold text-[#0c5bef]' : 'border-transparent text-[#5c646f] hover:text-[#303a47]'}`}>
            {t(x.name)}
          </button>
        ))}
      </div>
      <p className="px-5 pt-3 text-right font-mono text-[9px] uppercase tracking-wider text-[#979ba3] sm:px-7">{t({ es: 'Datos de ejemplo del prototipo', en: 'Prototype sample data' })}</p>
      <div className="grid gap-6 p-5 pt-2 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] sm:p-7" role="tabpanel">
        <p key={`q-${tab.id}`} className="enc-fade text-[clamp(1.2rem,1rem+0.8vw,1.6rem)] font-light leading-tight">«{t(tab.question)}»</p>
        <div key={tab.id} className="enc-fade min-w-0">
          <Chart id={tab.id} />
        </div>
      </div>
    </BrowserFrame>
  )
}

'use client'

import { useLocale, type L } from '@/lib/i18n'
import { favColor, Lock, UBITS_BLUE, useTicker } from './shared'
import './form.css'

/**
 * Las mini interfaces de «Con el rediseño» para celular y tableta: en vez de encoger la composición de escritorio
 * (abanico con letras de 9 px, recortado), cada parada muestra una sola mejora concreta, a lo ancho y con letra legible.
 */

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div className="relative min-h-[17rem] overflow-hidden rounded-xl bg-[#f8faff] p-3.5 text-[#303a47] ring-1 ring-black/10">{children}</div>
)

const STEPS: readonly L[] = [
  { es: 'Datos generales', en: 'General data' },
  { es: 'Participantes', en: 'Participants' },
  { es: 'Datos demográficos', en: 'Demographics' },
  { es: 'Secciones y preguntas', en: 'Sections and questions' },
  { es: 'Bienvenida y cierre', en: 'Welcome and closing' },
]

/** Crear: los cinco pasos se desbloquean en orden y el resumen vivo suma lo que ya está listo. */
function CreateMobile() {
  const { t } = useLocale()
  const n = useTicker(900) % (STEPS.length + 2)
  const done = Math.min(n, STEPS.length)
  const summary: readonly [L, string][] = [
    [{ es: 'Participantes', en: 'Participants' }, done > 1 ? '520' : '—'],
    [{ es: 'Secciones', en: 'Sections' }, done > 3 ? '2' : '—'],
    [{ es: 'Preguntas', en: 'Questions' }, done > 3 ? '9' : '—'],
  ]
  return (
    <Frame>
      <ol className="space-y-1">
        {STEPS.map((st, i) => {
          const state = i < done ? 'done' : i === done ? 'now' : 'locked'
          return (
            <li key={st.es} className={`flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-[13px] transition-colors duration-300 ${state === 'now' ? 'bg-white font-semibold ring-2 ring-[#0c5bef]' : ''}`}>
              <span
                key={state}
                className="encf-pop flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold"
                style={state === 'locked' ? { background: '#eceef2', color: '#979ba3' } : { background: UBITS_BLUE, color: '#fff' }}
              >
                {state === 'done' ? '✓' : state === 'now' ? i + 1 : <Lock className="h-3.5 w-3.5" />}
              </span>
              <span className={state === 'locked' ? 'text-[#979ba3]' : ''}>{t(st)}</span>
            </li>
          )
        })}
      </ol>
      <div className="mt-2.5 grid grid-cols-3 gap-1.5 rounded-lg bg-white p-2 ring-1 ring-black/[0.06]">
        <p className="col-span-3 text-[11px] font-semibold text-[#5c646f]">{t({ es: 'Así va la encuesta', en: 'How the survey is going' })}</p>
        {summary.map(([k, v]) => (
          <p key={k.es} className="text-[11px] text-[#5c646f]">
            <span key={v} className="hd-rise block text-[17px] font-semibold tabular-nums text-[#303a47]">{v}</span>
            {t(k)}
          </p>
        ))}
      </div>
    </Frame>
  )
}

/** Estructurar: el árbol crece hasta tres niveles y la numeración se deriva sola. */
function TreeMobile() {
  const { t } = useLocale()
  const n = (useTicker(800) % 7) + 1
  const rows: readonly [string, number, L][] = [
    ['1', 0, { es: 'Liderazgo', en: 'Leadership' }],
    ['1.1', 1, { es: 'Mi líder directo', en: 'My direct leader' }],
    ['1.1.1', 2, { es: 'Confianza', en: 'Trust' }],
    ['1.2', 1, { es: 'Reconocimiento', en: 'Recognition' }],
    ['2', 0, { es: 'Bienestar', en: 'Well-being' }],
    ['2.1', 1, { es: 'Carga de trabajo', en: 'Workload' }],
  ]
  return (
    <Frame>
      <ul className="min-h-[13.5rem] space-y-1.5">
        {rows.slice(0, n).map(([num, depth, title]) => (
          <li key={num} className="hd-rise flex items-center gap-2 rounded-lg bg-white px-2.5 py-1.5 text-[13px] ring-1 ring-black/[0.06]" style={{ marginLeft: depth * 18 }}>
            <span className="rounded px-1.5 font-mono text-[12px]" style={{ background: depth === 0 ? UBITS_BLUE : '#ecf1fa', color: depth === 0 ? '#fff' : UBITS_BLUE }}>{num}</span>
            <span className={depth === 0 ? 'font-semibold' : ''}>{t(title)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-[11px] text-[#5c646f]">{t({ es: 'Máximo tres niveles · nadie escribe la numeración', en: 'Three levels max · nobody types the numbering' })}</p>
    </Frame>
  )
}

/** Traer el histórico: cada columna del archivo encuentra su campo, de a una. */
function UploadMobile() {
  const { t } = useLocale()
  const n = useTicker(750) % 6
  const cols: readonly [string, L][] = [
    ['correo', { es: 'Participante', en: 'Participant' }],
    ['area', { es: 'Demográfico', en: 'Demographic' }],
    ['P1_lider', { es: 'Pregunta 1.1', en: 'Question 1.1' }],
    ['P2_recon', { es: 'Pregunta 1.2', en: 'Question 1.2' }],
  ]
  return (
    <Frame>
      <p className="mb-2.5 flex items-center gap-2 text-[13px] font-semibold">
        <span className="rounded bg-[#2e8a55] px-1.5 text-[11px] text-white">XLSX</span> clima_2025.xlsx
        <span className="ml-auto text-[11px] font-normal tabular-nums text-[#5c646f]">{Math.min(n, 4)}/4</span>
      </p>
      <ul className="space-y-1.5">
        {cols.map(([col, field], i) => {
          const ok = i < n
          return (
            <li key={col} className="grid grid-cols-[minmax(0,1fr)_1.25rem_minmax(0,1fr)] items-center gap-1.5 text-[12px]">
              <span className="truncate rounded-md bg-white px-2 py-1 font-mono ring-1 ring-black/[0.06]">{col}</span>
              <span className={`text-center transition-colors duration-300 ${ok ? 'text-[#2e8a55]' : 'text-black/20'}`}>{ok ? '✓' : '→'}</span>
              <span className={`truncate rounded-md px-2 py-1 transition-colors duration-300 ${ok ? 'bg-[#e2f1e2] text-[#2c6b2f]' : 'bg-black/[0.04] text-black/30'}`}>{t(field)}</span>
            </li>
          )
        })}
      </ul>
      <p className="mt-2.5 text-[11px] text-[#5c646f]">{t({ es: 'Se carga en segundo plano: puedes seguir trabajando', en: 'Loads in the background: keep working' })}</p>
    </Frame>
  )
}

/** Responder: una página por subsección, la opción elegida y el avance siempre a la vista. */
function AnswerMobile() {
  const { t } = useLocale()
  const page = useTicker(1000) % 5
  const options: readonly L[] = [
    { es: 'Poco', en: 'A little' },
    { es: 'Neutral', en: 'Neutral' },
    { es: 'Bastante', en: 'Quite a lot' },
  ]
  const done = page === 4
  return (
    <Frame>
      <div className="mx-auto w-full max-w-[15rem] rounded-[22px] border-[5px] border-[#2a2d33] bg-white p-3">
        <div className="h-1.5 overflow-hidden rounded-full bg-[#ecf1fa]">
          <span className="block h-full rounded-full transition-[width] duration-500" style={{ width: `${((page + 1) / 5) * 100}%`, background: UBITS_BLUE }} />
        </div>
        <p className="mt-2 text-[11px] text-[#5c646f]">{t({ es: `Página ${page + 1} de 5`, en: `Page ${page + 1} of 5` })}</p>
        <p className="mt-1 text-[13px] font-semibold leading-snug">{t({ es: 'Mi líder reconoce mi trabajo.', en: 'My leader recognizes my work.' })}</p>
        <ul className="mt-2 space-y-1">
          {options.map((o, i) => (
            <li key={o.es} className="rounded-md border px-2 py-1 text-[12px] transition-colors duration-300" style={i === page % 3 ? { borderColor: UBITS_BLUE, background: 'rgba(12,91,239,0.08)', color: UBITS_BLUE } : { borderColor: '#e2e4e8' }}>
              {t(o)}
            </li>
          ))}
        </ul>
        <span key={String(done)} className="hd-rise mt-2 block rounded-md py-1.5 text-center text-[12px] font-semibold text-white" style={{ background: done ? '#2e8a55' : UBITS_BLUE }}>
          {done ? t({ es: '¡Enviada!', en: 'Sent!' }) : t({ es: 'Siguiente', en: 'Next' })}
        </span>
      </div>
    </Frame>
  )
}

const HEAT = [
  [4.2, 3.4, 2.6, 4.4],
  [3.7, 2.8, 3.9, 4.1],
  [4.5, 3.1, 2.2, 3.6],
]

/** Leer: el mapa de calor grande; la columna de Comercial se abre cuando llega al mínimo. */
function HeatMobile() {
  const { t } = useLocale()
  const open = useTicker(1500) % 2 === 1
  return (
    <Frame>
      <div className="grid grid-cols-4 gap-1.5">
        {['Prod.', 'Tec.', 'Gente', 'Com.'].map((h, c) => (
          <span key={h} className={`text-center text-[12px] ${c === 3 ? 'font-semibold text-[#946200]' : 'text-[#5c646f]'}`}>
            {h}
            <span className="block font-mono text-[11px]">n={c === 3 ? (open ? 5 : 4) : 20 + c * 7}</span>
          </span>
        ))}
        {HEAT.flatMap((row, r) =>
          row.map((v, c) => {
            const locked = c === 3 && !open
            return (
              <span key={`${r}-${c}-${locked}`} className={`flex h-10 items-center justify-center rounded-md font-mono text-[13px] ${c === 3 && !locked ? 'hd-unlock' : ''}`} style={locked ? { background: '#e9eaed', color: '#979ba3' } : { background: favColor(v) }}>
                {locked ? <Lock className="h-4 w-4" /> : v.toFixed(1).replace('.', ',')}
              </span>
            )
          }),
        )}
      </div>
      <p key={String(open)} className="hd-rise mt-2.5 text-[12px] leading-snug">
        {open ? t({ es: 'Comercial llegó a 5: ya se puede leer.', en: 'Sales reached 5: it can be read now.' }) : t({ es: 'Comercial tiene 4 respuestas: candado, nunca un número.', en: 'Sales has 4 answers: a lock, never a number.' })}
      </p>
    </Frame>
  )
}

const STATUS: readonly { label: L; color: string; pct: number }[] = [
  { label: { es: 'Por empezar', en: 'To start' }, color: '#979ba3', pct: 8 },
  { label: { es: 'En curso', en: 'In progress' }, color: UBITS_BLUE, pct: 55 },
  { label: { es: 'Hecha', en: 'Done' }, color: '#2e8a55', pct: 100 },
]

/** Actuar: el resultado se vuelve una acción con dueño, fecha y estado que avanza. */
function ActMobile() {
  const { t } = useLocale()
  const s = STATUS[useTicker(1300) % 3]
  return (
    <Frame>
      <div className="rounded-lg bg-white p-3 shadow-sm ring-1 ring-black/[0.06]">
        <p className="text-[11px] text-[#5c646f]">{t({ es: 'Accionable · Reconocimiento 2,3', en: 'Action · Recognition 2.3' })}</p>
        <p className="mt-1 text-[15px] font-semibold leading-snug">{t({ es: 'Ritual mensual de reconocimiento en Gente', en: 'Monthly recognition ritual in People' })}</p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <span className="flex items-center gap-2 text-[12px]">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#7a5af5] text-[11px] font-semibold text-white">LM</span>
            {t({ es: 'Líder de Gente · 30 nov', en: 'People lead · Nov 30' })}
          </span>
          <span key={s.label.es} className="hd-rise rounded-full px-2.5 py-1 text-[12px] font-semibold text-white" style={{ background: s.color }}>{t(s.label)}</span>
        </div>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-black/[0.06]">
        <span className="block h-full rounded-full transition-[width] duration-700" style={{ width: `${s.pct}%`, background: s.color }} />
      </div>
    </Frame>
  )
}

export const STATION_MOCKS_MOBILE: Record<string, React.ComponentType> = {
  crear: CreateMobile,
  estructurar: TreeMobile,
  historico: UploadMobile,
  responder: AnswerMobile,
  leer: HeatMobile,
  actuar: ActMobile,
}

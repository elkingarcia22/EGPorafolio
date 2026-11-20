'use client'

import { useLocale, type L } from '@/lib/i18n'
import { favColor, Lock, LoopFade, UBITS_BLUE, useLoop, useTicker } from './shared'

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div className="relative h-40 overflow-hidden rounded-xl bg-[#f8faff] p-3 text-[#303a47] ring-1 ring-black/10">{children}</div>
)

const TEMPLATES: readonly { name: string; color: string; icon: string }[] = [
  { name: 'NOM 035', icon: '/cases/encuestas/glass/nom035.webp', color: '#2e8a55' },
  { name: 'Clima', icon: '/cases/encuestas/glass/clima.webp', color: '#e8743b' },
  { name: 'Cultura', icon: '/cases/encuestas/glass/cultura.webp', color: '#c2417a' },
  { name: 'eNPS', icon: '/cases/encuestas/glass/enps.webp', color: '#7a5af5' },
  { name: 'U. Corporativa', icon: '/cases/encuestas/glass/universidad.webp', color: UBITS_BLUE },
]

/** Crear: las plantillas se abren en abanico, como en el inicio de Encuestas. */
function CreateMock() {
  const open = useTicker(1600) % 2 === 1
  return (
    <Frame>
      <div className="absolute inset-x-0 bottom-3 flex justify-center">
        {TEMPLATES.map((tpl, i) => {
          const k = i - 2
          return (
            <span
              key={tpl.name}
              className="-mx-5 flex h-24 w-20 flex-col justify-end rounded-lg bg-white p-2 shadow-md ring-1 ring-black/10 transition-transform duration-700"
              style={{ transform: open ? `translateX(${k * 22}px) rotate(${k * 9}deg) translateY(${Math.abs(k) * 6}px)` : `rotate(${k * 2}deg)`, transformOrigin: 'bottom center', zIndex: 5 - Math.abs(k) }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={tpl.icon} alt="" width={28} height={28} className="mb-auto h-7 w-7 select-none" draggable={false} />
              <span className="text-[9px] font-semibold leading-tight">{tpl.name}</span>
            </span>
          )
        })}
      </div>
    </Frame>
  )
}

/** Estructurar: el árbol crece hasta tres niveles, con la numeración derivada. */
function TreeMock() {
  const { t } = useLocale()
  // Cinco filas y una pausa con el árbol completo; luego todo se desvanece junto y vuelve a crecer.
  const { step, cycle, leaving } = useLoop(900, 6)
  const n = Math.min(step + 1, 5)
  const rows: readonly [string, number, L][] = [
    ['1', 0, { es: 'Liderazgo', en: 'Leadership' }],
    ['1.1', 1, { es: 'Mi líder directo', en: 'My direct leader' }],
    ['1.1.1', 2, { es: 'Confianza', en: 'Trust' }],
    ['1.2', 1, { es: 'Reconocimiento', en: 'Recognition' }],
    ['2', 0, { es: 'Bienestar', en: 'Well-being' }],
  ]
  return (
    <Frame>
      <LoopFade cycle={cycle} leaving={leaving}>
        <ul className="space-y-1">
          {rows.slice(0, n).map(([num, depth, title]) => (
            <li key={num} className="hd-rise flex items-center gap-1.5 rounded-md bg-white px-2 py-1 text-[10px] ring-1 ring-black/[0.06]" style={{ marginLeft: depth * 14 }}>
              <span className="rounded px-1 font-mono text-[9px]" style={{ background: depth === 0 ? UBITS_BLUE : '#ecf1fa', color: depth === 0 ? '#fff' : UBITS_BLUE }}>{num}</span>
              {t(title)}
            </li>
          ))}
        </ul>
      </LoopFade>
    </Frame>
  )
}

/** Traer el histórico: las columnas del archivo encuentran su campo. */
function UploadMock() {
  const { t } = useLocale()
  const { step: n, cycle, leaving } = useLoop(800, 6)
  const cols: readonly [string, L][] = [
    ['correo', { es: 'Participante', en: 'Participant' }],
    ['area', { es: 'Demográfico', en: 'Demographic' }],
    ['P1_lider', { es: 'Pregunta 1.1', en: 'Question 1.1' }],
    ['P2_recon', { es: 'Pregunta 1.2', en: 'Question 1.2' }],
  ]
  return (
    <Frame>
      <p className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold">
        <span className="rounded bg-[#2e8a55] px-1 text-[8px] text-white">XLSX</span> clima_2025.xlsx
      </p>
      <LoopFade cycle={cycle} leaving={leaving}>
        <ul className="space-y-1">
          {cols.map(([col, field], i) => {
            const ok = i < n
            return (
              <li key={col} className="grid grid-cols-[1fr_auto_1fr] items-center gap-1.5 text-[9px]">
                <span className="truncate rounded bg-white px-1.5 py-0.5 font-mono ring-1 ring-black/[0.06]">{col}</span>
                <span className={`transition-colors duration-300 ${ok ? 'text-[#2e8a55]' : 'text-black/20'}`}>{ok ? '✓' : '→'}</span>
                <span className={`truncate rounded px-1.5 py-0.5 transition-colors duration-300 ${ok ? 'bg-[#e2f1e2] text-[#2c6b2f]' : 'bg-black/[0.04] text-black/30'}`}>{t(field)}</span>
              </li>
            )
          })}
        </ul>
      </LoopFade>
    </Frame>
  )
}

/** Responder: una página por subsección y el avance a la vista. */
function AnswerMock() {
  const { t } = useLocale()
  // Cinco páginas y una pausa en «¡Enviada!»; la pantalla se apaga antes de volver a la página 1.
  const { step, cycle, leaving } = useLoop(900, 6)
  const page = Math.min(step, 4)
  return (
    <Frame>
      <LoopFade cycle={cycle} leaving={leaving} className="mx-auto w-28 rounded-2xl border-4 border-[#2a2d33] bg-white p-2">
        <div className="h-1 overflow-hidden rounded-full bg-[#ecf1fa]">
          <span className="block h-full rounded-full transition-[width] duration-500" style={{ width: `${((page + 1) / 5) * 100}%`, background: UBITS_BLUE }} />
        </div>
        <p className="mt-1.5 text-[8px] text-[#5c646f]">{t({ es: `Página ${page + 1} de 5`, en: `Page ${page + 1} of 5` })}</p>
        {[0, 1, 2].map((i) => (
          <span key={i} className="mt-1 block h-3 rounded border text-[7px] transition-colors duration-300" style={i === page % 3 ? { borderColor: UBITS_BLUE, background: 'rgba(12,91,239,0.1)' } : { borderColor: '#e2e4e8' }} />
        ))}
        <span className="mt-1.5 block rounded py-0.5 text-center text-[7px] font-semibold text-white" style={{ background: page === 4 ? '#2e8a55' : UBITS_BLUE }}>
          {page === 4 ? t({ es: '¡Enviada!', en: 'Sent!' }) : t({ es: 'Siguiente', en: 'Next' })}
        </span>
      </LoopFade>
    </Frame>
  )
}

const HEAT = [
  [4.2, 3.4, 2.6, 4.4],
  [3.7, 2.8, 3.9, 4.1],
  [4.5, 3.1, 2.2, 3.6],
]

/** Leer: el mapa de calor, con la columna que se abre cuando llega al mínimo. */
function HeatMock() {
  const open = useTicker(1500) % 2 === 1
  return (
    <Frame>
      <div className="grid grid-cols-4 gap-1">
        {['Prod.', 'Tec.', 'Gente', 'Com.'].map((h, c) => (
          <span key={h} className="text-center text-[9px] text-[#5c646f]">
            {h}
            <span className="block font-mono text-[8px]">n={c === 3 ? (open ? 5 : 4) : 20 + c * 7}</span>
          </span>
        ))}
        {HEAT.flatMap((row, r) =>
          row.map((v, c) => {
            const locked = c === 3 && !open
            return (
              <span key={`${r}-${c}-${locked}`} className={`flex h-7 items-center justify-center rounded font-mono text-[9px] ${c === 3 ? 'hd-unlock' : ''}`} style={locked ? { background: '#e9eaed', color: '#979ba3' } : { background: favColor(v) }}>
                {locked ? <Lock className="h-3 w-3" /> : v.toFixed(1)}
              </span>
            )
          }),
        )}
      </div>
    </Frame>
  )
}

const STATUS: readonly { label: L; color: string }[] = [
  { label: { es: 'Por empezar', en: 'To start' }, color: '#979ba3' },
  { label: { es: 'En curso', en: 'In progress' }, color: UBITS_BLUE },
  { label: { es: 'Hecha', en: 'Done' }, color: '#2e8a55' },
]

/** Actuar: el resultado se vuelve una acción con dueño y fecha. */
function ActMock() {
  const { t } = useLocale()
  // Tres estados y una pausa en «Hecha»; la barra no rebobina a la vista: se apaga y la acción siguiente entra de cero.
  const { step, cycle, leaving } = useLoop(1300, 4)
  const s = STATUS[Math.min(step, 2)]
  return (
    <Frame>
      <LoopFade cycle={cycle} leaving={leaving}>
        <div className="rounded-lg bg-white p-2.5 shadow-sm ring-1 ring-black/[0.06]">
          <p className="text-[9px] text-[#5c646f]">{t({ es: 'Accionable · Reconocimiento 2,3', en: 'Action · Recognition 2.3' })}</p>
          <p className="mt-1 text-[11px] font-semibold leading-snug">{t({ es: 'Ritual mensual de reconocimiento en Gente', en: 'Monthly recognition ritual in People' })}</p>
          <div className="mt-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[9px]">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#7a5af5] text-[8px] font-semibold text-white">LM</span>
              {t({ es: 'Líder de Gente · 30 nov', en: 'People lead · Nov 30' })}
            </span>
            <span key={s.label.es} className="hd-rise rounded-full px-1.5 py-0.5 text-[8px] font-semibold text-white" style={{ background: s.color }}>{t(s.label)}</span>
          </div>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/[0.06]">
          <span className="block h-full rounded-full transition-[width] duration-700" style={{ width: s.color === '#2e8a55' ? '100%' : s.color === UBITS_BLUE ? '55%' : '8%', background: s.color }} />
        </div>
      </LoopFade>
    </Frame>
  )
}

export const STATION_MOCKS: Record<string, React.ComponentType> = {
  crear: CreateMock,
  estructurar: TreeMock,
  historico: UploadMock,
  responder: AnswerMock,
  leer: HeatMock,
  actuar: ActMock,
}

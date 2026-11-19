'use client'

import { useLocale, type L } from '@/lib/i18n'
import { FAV, favColor, Lock, UBITS_BLUE, useTicker } from './shared'

const LIKERT: readonly L[] = [
  { es: 'Nada', en: 'None' },
  { es: 'Poco', en: 'Little' },
  { es: 'Neutral', en: 'Neutral' },
  { es: 'Bastante', en: 'Quite' },
  { es: 'Mucho', en: 'A lot' },
]

function LikertPiece({ tick }: { tick: number }) {
  const { t } = useLocale()
  const on = [3, 4, 2, 3, 1][tick % 5]
  return (
    <div className="grid grid-cols-5 gap-1">
      {LIKERT.map((o, i) => (
        <span key={o.es} className="flex h-9 items-center justify-center rounded-md border text-[10px] transition-all duration-500" style={i === on ? { borderColor: UBITS_BLUE, background: 'rgba(12,91,239,0.08)', color: UBITS_BLUE, fontWeight: 600 } : { borderColor: '#d0d2d5', color: '#5c646f' }}>
          {t(o)}
        </span>
      ))}
    </div>
  )
}

function StepperPiece({ tick }: { tick: number }) {
  const current = (tick % 5) + 1
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((n) => {
        const done = n < current
        const here = n === current
        return (
          <div key={n} className="flex flex-1 items-center last:flex-none">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold transition-colors duration-500" style={done || here ? { background: UBITS_BLUE, color: '#fff' } : { background: '#eef0f3', color: '#979ba3' }}>
              {done ? '✓' : here ? n : <Lock className="h-3.5 w-3.5" />}
            </span>
            {n < 5 && <span className="mx-1 h-0.5 flex-1 rounded transition-colors duration-500" style={{ background: done ? UBITS_BLUE : '#e2e4e8' }} />}
          </div>
        )
      })}
    </div>
  )
}

function NumberingPiece() {
  const rows = [
    { n: '1', title: 'Liderazgo', depth: 0 },
    { n: '1.2', title: 'Reconocimiento', depth: 1 },
    { n: '1.2.1', title: 'Entre pares', depth: 2 },
  ]
  return (
    <ul className="space-y-1.5">
      {rows.map((r) => (
        <li key={r.n} className="flex items-center gap-2 rounded-md border border-black/[0.08] bg-white px-2 py-1.5 text-[12px]" style={{ marginLeft: `${r.depth * 0.9}rem` }}>
          <span className="rounded px-1.5 py-0.5 font-mono text-[10px]" style={r.depth === 0 ? { background: UBITS_BLUE, color: '#fff' } : { background: '#ecf1fa', color: UBITS_BLUE }}>{r.n}</span>
          <span className="truncate">{r.title}</span>
        </li>
      ))}
    </ul>
  )
}

function LockPiece({ tick }: { tick: number }) {
  const n = 3 + (tick % 4)
  const cells = [4.3, 3.2, 2.6]
  return (
    <div>
      <div className="grid grid-cols-4 gap-1">
        {cells.map((s) => (
          <span key={s} className="flex h-9 items-center justify-center rounded-md font-mono text-[11px] text-[#14161a]" style={{ background: favColor(s) }}>{s.toFixed(1).replace('.', ',')}</span>
        ))}
        <span className="flex h-9 items-center justify-center rounded-md font-mono text-[11px] transition-colors duration-500" style={n < 5 ? { background: '#eef0f3', color: '#979ba3' } : { background: favColor(3.8), color: '#14161a' }}>
          {n < 5 ? <Lock className="h-3.5 w-3.5" /> : '3,8'}
        </span>
      </div>
      <p className="mt-2 font-mono text-[10px] text-[#5c646f]">n = {n} · mín. 5</p>
    </div>
  )
}

function EnpsPiece() {
  const { t } = useLocale()
  const bands = [
    { w: 22, c: FAV[0], l: { es: 'Detractores 0–6', en: 'Detractors 0–6' } },
    { w: 30, c: FAV[2], l: { es: 'Neutros 7–8', en: 'Passives 7–8' } },
    { w: 48, c: FAV[4], l: { es: 'Promotores 9–10', en: 'Promoters 9–10' } },
  ]
  return (
    <div>
      <div className="flex h-3 overflow-hidden rounded-full">
        {bands.map((b) => <span key={b.l.es} style={{ width: `${b.w}%`, background: b.c }} />)}
      </div>
      <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-[#5c646f]">
        {bands.map((b) => (
          <span key={b.l.es} className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full" style={{ background: b.c }} />{t(b.l)}</span>
        ))}
      </p>
      <p className="mt-1 text-lg font-semibold text-[#303a47]">eNPS +26</p>
    </div>
  )
}

/** Las piezas de la plataforma en que terminaron los bocetos, construidas en código y en movimiento. */
export function PlatformPieces() {
  const { t } = useLocale()
  const tick = useTicker(1600)
  const pieces: readonly { from: L; name: L; node: React.ReactNode }[] = [
    { from: { es: 'del boceto 03', en: 'from sketch 03' }, name: { es: 'Pasos con candado', en: 'Locked steps' }, node: <StepperPiece tick={tick} /> },
    { from: { es: 'del boceto 03', en: 'from sketch 03' }, name: { es: 'Numeración derivada', en: 'Derived numbering' }, node: <NumberingPiece /> },
    { from: { es: 'del boceto 04', en: 'from sketch 04' }, name: { es: 'Escala Likert', en: 'Likert scale' }, node: <LikertPiece tick={tick} /> },
    { from: { es: 'del boceto 04', en: 'from sketch 04' }, name: { es: 'Celda reservada', en: 'Reserved cell' }, node: <LockPiece tick={tick} /> },
    { from: { es: 'del boceto 04', en: 'from sketch 04' }, name: { es: 'Bandas de eNPS', en: 'eNPS bands' }, node: <EnpsPiece /> },
  ]
  return (
    <div>
      <p data-reveal className="mono-label mb-5 opacity-60">{t({ es: 'En qué piezas terminaron los bocetos', en: 'The pieces the sketches turned into' })}</p>
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {pieces.map((p) => (
          <li key={p.name.es} data-reveal="pop" className="flex min-w-0 flex-col justify-between gap-4 rounded-xl bg-[#f8faff] p-4 text-[#303a47] ring-1 ring-black/10">
            <div>{p.node}</div>
            <p className="border-t border-black/10 pt-3">
              <span className="block text-sm font-medium">{t(p.name)}</span>
              <span className="font-hand text-lg leading-none text-[#b0412a]">{t(p.from)}</span>
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}

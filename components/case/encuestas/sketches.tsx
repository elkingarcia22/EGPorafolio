'use client'

import { useState } from 'react'
import { useLocale } from '@/lib/i18n'
import { ENCUESTAS_CASE } from '@/lib/content/cases/encuestas/case'
import type { Iteration } from '@/lib/content/cases/encuestas/types'

const INK = '#2a2d33'
const ACCENT = '#e8743b'
const PAPER = '#fbfaf6'

/** Un trazo que se dibuja al entrar en pantalla. */
function Stroke({ d, accent = false, width = 2.2 }: { d: string; accent?: boolean; width?: number }) {
  return <path d={d} fill="none" stroke={accent ? ACCENT : INK} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} data-draw="" />
}

/** Rectángulo a mano alzada (esquinas que no cierran perfecto). */
const box = (x: number, y: number, w: number, h: number) => `M${x + 2} ${y} L${x + w} ${y + 1} L${x + w - 1} ${y + h} L${x} ${y + h - 1} Z`

const MD_LINES = [
  { indent: 0, text: '# Liderazgo', level: 1 },
  { indent: 0, text: '## Mi líder directo', level: 2 },
  { indent: 1, text: '- Me da retroalimentación útil [escala]', level: 0 },
  { indent: 0, text: '### Confianza', level: 3 },
  { indent: 1, text: '- Puedo equivocarme sin miedo [escala]', level: 0 },
  { indent: 0, text: '#### Detalle', level: 4 },
  { indent: 0, text: '## Reconocimiento', level: 2 },
  { indent: 1, text: '- ¿Qué cambiarías? [abierta]', level: 0 },
] as const

/** Boceto 1: la gramática que convierte un archivo de texto en el árbol de la encuesta. */
function TreeGrammar() {
  const { t } = useLocale()
  return (
    <figure data-reveal className="overflow-hidden rounded-xl p-6 text-[#2a2d33] shadow-[0_20px_60px_-30px_rgba(0,0,0,0.4)] ring-1 ring-black/10" style={{ background: PAPER }}>
      <figcaption className="font-hand text-2xl">{t({ es: 'Un archivo de texto ya es una encuesta', en: 'A text file already is a survey' })}</figcaption>
      <div className="mt-6 grid gap-8 md:grid-cols-[1fr_auto_1fr] md:items-center">
        <ol className="space-y-2 font-mono text-[12px]">
          {MD_LINES.map((l) => (
            <li key={l.text} className={`${l.indent ? 'pl-5 opacity-70' : ''} ${l.level === 4 ? 'text-[#b0412a] line-through decoration-2' : ''}`}>{l.text}</li>
          ))}
        </ol>
        <svg viewBox="0 0 90 60" className="mx-auto w-20 rotate-90 md:rotate-0" aria-hidden="true">
          <Stroke d="M6 30 C 30 22, 55 38, 80 30" accent />
          <Stroke d="M70 22 L 82 30 L 70 38" accent />
        </svg>
        <div className="space-y-2 font-hand text-[1.35rem] leading-tight">
          <p><span className="mr-2 font-mono text-xs opacity-60">1</span>Liderazgo</p>
          <p className="pl-6"><span className="mr-2 font-mono text-xs opacity-60">1.1</span>Mi líder directo <span className="text-base opacity-60">· 1 {t({ es: 'pregunta', en: 'question' })}</span></p>
          <p className="pl-12"><span className="mr-2 font-mono text-xs opacity-60">1.1.1</span>Confianza</p>
          <p className="pl-6"><span className="mr-2 font-mono text-xs opacity-60">1.2</span>Reconocimiento</p>
          <p className="mt-4 inline-block -rotate-2 border-2 border-[#e8743b] px-2 py-1 text-lg text-[#b0412a]">{t({ es: 'máx. 3 niveles · la numeración no se escribe', en: 'max 3 levels · numbering isn’t typed' })}</p>
        </div>
      </div>
    </figure>
  )
}

/** Boceto de cada iteración, según su forma. */
function Wire({ shape }: { shape: Iteration['shape'] }) {
  const paths: Record<Iteration['shape'], string[]> = {
    chat: [box(10, 10, 170, 200), 'M24 40 h110', 'M24 52 h80', box(60, 72, 110, 30), 'M24 120 h120', 'M24 132 h70', box(10, 220 - 34, 170, 24), box(196, 10, 114, 200), 'M208 34 h86', 'M208 52 h60', 'M208 70 h76', 'M208 88 h50'],
    drawer: [box(10, 10, 300, 200), 'M24 30 h90', 'M24 48 h140', 'M24 66 h120', box(176, 10, 134, 200), 'M190 34 h28 M226 34 h28 M262 34 h28', box(190, 56, 106, 26), box(190, 92, 106, 26), box(190, 128, 106, 46), box(240, 184, 56, 16)],
    tree: [box(10, 10, 300, 200), 'M24 30 h12 M42 30 h90', 'M40 54 h12 M58 54 h80', 'M56 78 h12 M74 78 h70', 'M40 102 h12 M58 102 h90', 'M24 132 h12 M42 132 h100', 'M40 156 h12 M58 156 h60', box(200, 24, 96, 170), 'M210 44 h60', 'M210 60 h40'],
    system: [box(10, 10, 300, 200), 'M24 30 h40 M80 30 h40 M136 30 h40 M192 30 h40', box(24, 48, 60, 40), box(92, 48, 60, 40), box(160, 48, 60, 40), box(228, 48, 68, 40), box(24, 100, 272, 92), 'M36 120 h120', 'M36 140 h180', 'M36 160 h150'],
  }
  const accent: Record<Iteration['shape'], string> = {
    chat: box(60, 72, 110, 30),
    drawer: box(240, 184, 56, 16),
    tree: 'M40 54 h12 M58 54 h80',
    system: box(24, 48, 60, 40),
  }
  return (
    <svg viewBox="0 0 320 220" className="w-full" aria-hidden="true">
      {paths[shape].map((d) => <Stroke key={d} d={d} />)}
      <Stroke d={accent[shape]} accent width={3} />
    </svg>
  )
}

/** Boceto 2: las cuatro iteraciones, de la conversación al sistema de diseño. */
function Iterations() {
  const { t } = useLocale()
  const list = ENCUESTAS_CASE.iterations
  const [active, setActive] = useState(0)
  const it = list[active]
  return (
    <div data-reveal>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label={t({ es: 'Iteraciones', en: 'Iterations' })}>
        {list.map((x, i) => (
          <button key={x.id} type="button" role="tab" aria-selected={i === active} onClick={() => setActive(i)} className={`flex items-baseline gap-2 border px-3 py-2 text-left transition-colors ${i === active ? 'border-fg bg-fg text-bg' : 'border-fg/25 hover:border-fg/60'}`}>
            <span className="font-mono text-[10px] opacity-60">0{i + 1}</span>
            <span className="text-sm">{x.name}</span>
          </button>
        ))}
      </div>
      <figure key={it.id} className="enc-fade mt-6 grid gap-8 rounded-xl p-6 text-[#2a2d33] ring-1 ring-black/10 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]" style={{ background: PAPER }}>
        <div>
          <Wire shape={it.shape} />
          <p className="mt-3 font-mono text-[10px] uppercase tracking-wider opacity-60">{t(it.when)}</p>
        </div>
        <dl className="space-y-5">
          {[
            { k: { es: 'Probamos', en: 'We tried' }, v: it.tried, c: INK },
            { k: { es: 'Descartamos', en: 'We dropped' }, v: it.dropped, c: '#b0412a' },
            { k: { es: 'Se quedó', en: 'We kept' }, v: it.kept, c: '#2c6b2f' },
          ].map((row) => (
            <div key={row.k.es}>
              <dt className="font-hand text-2xl" style={{ color: row.c }}>{t(row.k)}</dt>
              <dd className="mt-1 leading-relaxed">{t(row.v)}</dd>
            </div>
          ))}
        </dl>
      </figure>
    </div>
  )
}

/** 04 · Bocetos: la gramática del árbol y las cuatro iteraciones. */
export function IterationSketches() {
  const { t } = useLocale()
  return (
    <div className="space-y-16">
      <p data-reveal className="max-w-[62ch] text-lg leading-relaxed opacity-80">
        {t({
          es: 'El producto se dibujó cuatro veces antes de quedarse quieto. Primero en papel, la regla que ordena todo lo demás: una encuesta es un árbol de tres niveles, y un archivo de texto con almohadillas ya lo describe.',
          en: 'The product was drawn four times before it settled. First on paper, the rule that orders everything else: a survey is a three-level tree, and a text file with hashes already describes it.',
        })}
      </p>
      <TreeGrammar />
      <Iterations />
    </div>
  )
}

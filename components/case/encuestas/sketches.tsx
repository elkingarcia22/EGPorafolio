'use client'

import { useLocale } from '@/lib/i18n'
import { IterationCompare } from './sketches-compare'
import { PlatformPieces } from './sketches-pieces'
import './patterns-sketches.css'

const INK = '#2a2d33'
const ACCENT = '#e8743b'

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
    <figure data-reveal className="enc-paper relative overflow-hidden rounded-xl p-6 text-[#2a2d33] shadow-[0_20px_60px_-30px_rgba(0,0,0,0.4)] ring-1 ring-black/10 sm:p-8">
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

/** 04 · Bocetos: la gramática del árbol y las cuatro iteraciones. */
export function IterationSketches() {
  const { t } = useLocale()
  return (
    <div className="space-y-16">
      <p data-reveal className="max-w-[62ch] text-lg leading-relaxed opacity-80">
        {t({
          es: 'El producto se dibujó cuatro veces antes de quedarse quieto. Primero en papel, la regla que ordena todo lo demás: una encuesta es un árbol de tres niveles. Después, cada boceto encima de la pantalla en que se convirtió: arrastra la cortina para ver qué sobrevivió.',
          en: 'The product was drawn four times before it settled. First on paper, the rule that orders everything else: a survey is a three-level tree. Then each sketch over the screen it became: drag the curtain to see what survived.',
        })}
      </p>
      <TreeGrammar />
      <IterationCompare />
      <PlatformPieces />
    </div>
  )
}

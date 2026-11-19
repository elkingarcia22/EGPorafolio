'use client'

import { useState } from 'react'
import { useLocale } from '@/lib/i18n'
import { ENCUESTAS_CASE } from '@/lib/content/cases/encuestas/case'
import { favColor, Lock, UBITS_BLUE } from './shared'
import { TemplateSpectrum } from './idea-spectrum'

/** Áreas de ejemplo con sus respuestas y su promedio; una cola larga de áreas pequeñas, como en el producto. */
const GROUPS = [
  { name: 'Tecnología', n: 61, score: 3.8, chile: 14 },
  { name: 'Producto', n: 48, score: 4.1, chile: 9 },
  { name: 'Gente y Cultura', n: 22, score: 3.0, chile: 6 },
  { name: 'Logística', n: 9, score: 3.4, chile: 4 },
  { name: 'Legal', n: 7, score: 3.6, chile: 2 },
  { name: 'Comercial', n: 6, score: 2.7, chile: 3 },
  { name: 'Finanzas', n: 4, score: 3.2, chile: 1 },
  { name: 'Marketing', n: 3, score: 4.4, chile: 0 },
] as const

const MIN_FLOOR = 3
const MIN_CEIL = 10
const MIN_DEFAULT = 5

/** El laboratorio de la promesa: cambia la visibilidad, el mínimo y un filtro, y mira qué se puede leer. */
function AnonymityLab() {
  const { t } = useLocale()
  const [anonymous, setAnonymous] = useState(true)
  const [min, setMin] = useState(MIN_DEFAULT)
  const [chile, setChile] = useState(false)
  const threshold = anonymous ? min : 1
  const rows = GROUPS.map((g) => ({ ...g, count: chile ? g.chile : g.n }))
  const reserved = rows.filter((r) => r.count > 0 && r.count < threshold).length

  const seg = (on: boolean) => `flex-1 rounded-md px-3 py-2 text-sm transition-colors ${on ? 'bg-white text-[#303a47] shadow-sm' : 'text-[#5c646f] hover:text-[#303a47]'}`

  return (
    <div data-reveal className="mt-16 overflow-hidden rounded-2xl bg-[#f8faff] text-[#303a47] ring-1 ring-black/10">
      <div className="grid gap-6 border-b border-black/10 p-6 md:grid-cols-3">
        <div>
          <p className="text-xs font-semibold">{t({ es: 'Tipo de visibilidad', en: 'Visibility' })}</p>
          <div className="mt-2 flex rounded-lg bg-[#ecf1fa] p-1" role="group">
            <button type="button" aria-pressed={!anonymous} onClick={() => setAnonymous(false)} className={seg(!anonymous)}>{t({ es: 'Pública', en: 'Public' })}</button>
            <button type="button" aria-pressed={anonymous} onClick={() => setAnonymous(true)} className={seg(anonymous)}>{t({ es: 'Anónima', en: 'Anonymous' })}</button>
          </div>
        </div>
        <div className={anonymous ? '' : 'pointer-events-none opacity-35'} aria-hidden={!anonymous}>
          <p className="text-xs font-semibold">{t({ es: 'Mínimo de respuestas por grupo', en: 'Minimum answers per group' })}</p>
          <div className="mt-2 flex items-center gap-2">
            <button type="button" onClick={() => setMin((m) => Math.max(MIN_FLOOR, m - 1))} disabled={min <= MIN_FLOOR} aria-label={t({ es: 'Bajar el mínimo', en: 'Lower the minimum' })} className="h-9 w-9 rounded-md border border-[#d0d2d5] bg-white text-lg disabled:opacity-35">−</button>
            <span className="w-10 text-center text-xl font-semibold tabular-nums">{min}</span>
            <button type="button" onClick={() => setMin((m) => Math.min(MIN_CEIL, m + 1))} disabled={min >= MIN_CEIL} aria-label={t({ es: 'Subir el mínimo', en: 'Raise the minimum' })} className="h-9 w-9 rounded-md border border-[#d0d2d5] bg-white text-lg disabled:opacity-35">+</button>
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold">{t({ es: 'Filtrar a fondo', en: 'Deep filter' })}</p>
          <button type="button" aria-pressed={chile} onClick={() => setChile((c) => !c)} className="mt-2 flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors" style={chile ? { borderColor: UBITS_BLUE, color: UBITS_BLUE, background: 'rgba(12,91,239,0.06)' } : { borderColor: '#d0d2d5' }}>
            {chile ? '✓ ' : '+ '}
            {t({ es: 'País: Chile', en: 'Country: Chile' })}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 p-6 sm:grid-cols-4">
        {rows.map((r) => {
          const empty = r.count === 0
          const locked = !empty && r.count < threshold
          return (
            <div key={r.name} className="rounded-xl border border-black/[0.07] bg-white p-3 transition-all duration-500">
              <p className="truncate text-xs text-[#5c646f]">{r.name}</p>
              <div
                className="mt-2 flex h-14 items-center justify-center rounded-lg font-mono text-lg tabular-nums transition-[background-color,color] duration-500"
                style={empty || locked ? { background: '#f1f3f7', color: '#979ba3' } : { background: favColor(r.score), color: '#14161a' }}
              >
                {empty ? '—' : locked ? <Lock className="h-5 w-5" /> : r.score.toFixed(1).replace('.', ',')}
              </div>
              <p className="mt-2 flex items-center justify-between font-mono text-[10px] text-[#979ba3]">
                <span>n={r.count}</span>
                <span>{empty ? t({ es: 'Sin respuestas', en: 'No answers' }) : locked ? t({ es: 'Reservado', en: 'Reserved' }) : anonymous ? '' : t({ es: 'con nombre', en: 'named' })}</span>
              </p>
            </div>
          )
        })}
      </div>

      <p className="border-t border-black/10 px-6 py-4 text-sm leading-relaxed text-[#5c646f]" aria-live="polite">
        {!anonymous
          ? t({ es: 'Pública: el mínimo es 1 y se puede ver quién respondió qué. Lo único gris es un grupo sin respuestas.', en: 'Public: the minimum is 1 and you can see who answered what. Only a group with no answers is grey.' })
          : min === MIN_FLOOR
            ? t({ es: 'El mínimo no baja de 3: con dos respuestas, cada persona puede deducir la de la otra.', en: 'The minimum never goes below 3: with two answers, each person can deduce the other’s.' })
            : t({ es: `${reserved} ${reserved === 1 ? 'grupo queda reservado' : 'grupos quedan reservados'}: el conteo no es secreto, el resultado sí.${chile ? ' Al filtrar, cada grupo tiene menos gente y más grupos cruzan el mínimo.' : ''}`, en: `${reserved} ${reserved === 1 ? 'group is' : 'groups are'} reserved: the count isn’t secret, the result is.${chile ? ' Filtering leaves fewer people per group, so more groups cross the minimum.' : ''}` })}
      </p>
    </div>
  )
}

/** 03 · La idea: la pregunta, los principios y la promesa de anonimato para tocarla. */
export function PromiseIdea() {
  const { t } = useLocale()
  const d = ENCUESTAS_CASE.idea
  return (
    <div>
      <p data-reveal className="mono-label mb-4 opacity-60">{t({ es: '¿Cómo podríamos…?', en: 'How might we…?' })}</p>
      <p data-reveal="mask" className="max-w-[30ch] text-[clamp(1.8rem,1rem+2.4vw,3.2rem)] font-light leading-[1.1] tracking-tight">{t(d.hmw)}</p>

      <div className="mt-16 grid gap-6 lg:grid-cols-12 lg:items-end">
        <p data-reveal className="text-[clamp(1.3rem,1rem+0.9vw,1.8rem)] font-light leading-tight lg:col-span-5">{t(d.axis.title)}</p>
        <p data-reveal className="leading-relaxed opacity-80 lg:col-span-7">{t(d.axis.body)}</p>
      </div>
      <div className="mt-8">
        <TemplateSpectrum />
      </div>
      <p data-reveal className="mt-3 text-xs leading-relaxed opacity-60">
        {t({ es: 'Las siete plantillas reales del catálogo, medidas como las mide el producto. Las de la NOM 035 son las del prototipo: una muestra del cuestionario oficial con su misma estructura.', en: 'The catalog’s seven real templates, measured the way the product measures them. The NOM 035 ones are the prototype’s: a sample of the official questionnaire with the same structure.' })}
      </p>

      <ol className="mt-20 grid gap-x-10 gap-y-10 sm:grid-cols-2">
        {d.principles.map((p, i) => (
          <li key={p.title.es} data-reveal className="relative pl-14">
            <span className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border border-fg/25 font-mono text-xs">{i + 1}</span>
            <p className="text-xl leading-snug">{t(p.title)}</p>
            <p className="mt-2 text-sm leading-relaxed opacity-70">{t(p.body)}</p>
          </li>
        ))}
      </ol>

      <p data-reveal className="mono-label mt-20 opacity-60">{t({ es: 'El principio 1, para tocarlo', en: 'Principle 1, hands on' })}</p>
      <p data-reveal className="mt-3 max-w-[60ch] leading-relaxed opacity-80">
        {t({ es: 'La regla que más pantallas toca: en una encuesta anónima, un grupo solo muestra su resultado cuando alcanza el mínimo. Cambia la visibilidad, baja el mínimo o filtra por país.', en: 'The rule that touches the most screens: in an anonymous survey, a group only shows its result once it reaches the minimum. Switch visibility, lower the minimum or filter by country.' })}
      </p>
      <AnonymityLab />
    </div>
  )
}

'use client'

import { useLocale, type L } from '@/lib/i18n'
import { FAV, UBITS_BLUE } from './shared'

export interface Answers {
  likert: readonly (number | null)[]
  nps: number | null
  depth: string
}

export const EMPTY_ANSWERS: Answers = { likert: [null, null, null], nps: null, depth: '' }

export const LIKERT_QUESTIONS: readonly L[] = [
  { es: 'Mi líder me da retroalimentación que me ayuda a mejorar.', en: 'My leader gives me feedback that helps me improve.' },
  { es: 'Puedo equivocarme sin miedo a las consecuencias.', en: 'I can make mistakes without fear of the consequences.' },
  { es: 'Tengo tiempo suficiente para hacer bien mi trabajo.', en: 'I have enough time to do my work well.' },
]

const SCALE: readonly L[] = [
  { es: 'Totalmente en desacuerdo', en: 'Strongly disagree' },
  { es: 'En desacuerdo', en: 'Disagree' },
  { es: 'Neutral', en: 'Neutral' },
  { es: 'De acuerdo', en: 'Agree' },
  { es: 'Totalmente de acuerdo', en: 'Strongly agree' },
]

/** Seguimiento de profundidad según la banda del NPS: detractores 0–6, neutros 7–8, promotores 9–10. */
export function depthPrompt(nps: number): L {
  if (nps <= 6) return { es: '¿Qué tendría que cambiar para que nos recomendaras?', en: 'What would have to change for you to recommend us?' }
  if (nps <= 8) return { es: '¿Qué nos falta para que nos recomiendes sin dudar?', en: 'What are we missing for you to recommend us without hesitation?' }
  return { es: '¿Qué es lo que más valoras de trabajar aquí?', en: 'What do you value most about working here?' }
}

export const PAGES = ['bienvenida', 'lider', 'recomendacion', 'cierre'] as const
export type Page = (typeof PAGES)[number]

interface AnswerFlowProps {
  page: Page
  answers: Answers
  onChange: (next: Answers) => void
}

/** Las páginas que ve el colaborador: bienvenida, una subsección Likert, recomendabilidad con profundidad y cierre. */
export function AnswerPage({ page, answers, onChange }: AnswerFlowProps) {
  const { t } = useLocale()

  if (page === 'bienvenida') {
    return (
      <div className="enc-fade">
        <p className="inline-flex rounded-full bg-[#ecf1fa] px-2 py-0.5 text-[11px] text-[#0c5bef]">{t({ es: 'Clima · Anónima', en: 'Climate · Anonymous' })}</p>
        <h3 className="mt-3 text-2xl font-semibold">{t({ es: 'Pulso de clima · Noviembre', en: 'Climate pulse · November' })}</h3>
        <div className="mt-5 grid grid-cols-3 gap-2 rounded-xl border border-black/10 p-3 text-center">
          {[
            ['2', { es: 'Secciones', en: 'Sections' }],
            ['4', { es: 'Preguntas', en: 'Questions' }],
            ['2 min', { es: 'Tiempo estimado', en: 'Estimated time' }],
          ].map(([v, l]) => (
            <div key={String(v)}>
              <p className="text-lg font-semibold">{String(v)}</p>
              <p className="text-[11px] text-[#5c646f]">{t(l as L)}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-xl bg-[#f8faff] p-4 text-sm leading-relaxed">
          <p className="font-semibold">{t({ es: 'Antes de empezar', en: 'Before you start' })}</p>
          <p className="mt-2 text-[#414a5c]">{t({ es: 'Tus respuestas son anónimas. Los resultados se muestran siempre agrupados, nunca de forma individual, y un grupo solo ve sus resultados cuando al menos 5 personas han respondido.', en: 'Your answers are anonymous. Results are always shown grouped, never individually, and a group only sees its results once at least 5 people have answered.' })}</p>
        </div>
      </div>
    )
  }

  if (page === 'lider') {
    return (
      <div className="enc-fade space-y-3">
        <p className="text-xs text-[#5c646f]">1. Liderazgo › <span className="text-[#0c5bef]">{t({ es: 'Subsección 1.1', en: 'Subsection 1.1' })}</span></p>
        <h3 className="text-xl font-semibold">{t({ es: 'Mi líder directo', en: 'My direct leader' })}</h3>
        {LIKERT_QUESTIONS.map((q, qi) => (
          <fieldset key={q.es} className="rounded-xl border border-black/10 p-3">
            <legend className="sr-only">{t(q)}</legend>
            <p className="text-sm font-medium"><span className="mr-2 text-[#979ba3]">{qi + 1}</span>{t(q)}</p>
            <div className="mt-2 grid grid-cols-5 gap-1">
              {SCALE.map((s, si) => {
                const on = answers.likert[qi] === si + 1
                return (
                  <button
                    key={s.es}
                    type="button"
                    aria-pressed={on}
                    onClick={() => onChange({ ...answers, likert: answers.likert.map((v, i) => (i === qi ? si + 1 : v)) })}
                    className="min-h-[2.6rem] rounded-lg border px-1 text-[10px] leading-tight transition-colors"
                    style={on ? { borderColor: UBITS_BLUE, background: 'rgba(12,91,239,0.08)', color: UBITS_BLUE, fontWeight: 600 } : { borderColor: '#d0d2d5' }}
                  >
                    {t(s)}
                  </button>
                )
              })}
            </div>
          </fieldset>
        ))}
      </div>
    )
  }

  if (page === 'recomendacion') {
    return (
      <div className="enc-fade space-y-4">
        <p className="text-xs text-[#5c646f]">2. {t({ es: 'Experiencia general', en: 'Overall experience' })} › <span className="text-[#0c5bef]">{t({ es: 'Subsección 2.1', en: 'Subsection 2.1' })}</span></p>
        <h3 className="text-xl font-semibold">{t({ es: 'Recomendabilidad', en: 'Recommendation' })}</h3>
        <div className="rounded-xl border border-black/10 p-3">
          <p className="text-sm font-medium">{t({ es: '¿Qué tan probable es que recomiendes la empresa como un buen lugar para trabajar?', en: 'How likely are you to recommend the company as a good place to work?' })}</p>
          <div className="mt-3 grid grid-cols-11 gap-1">
            {Array.from({ length: 11 }, (_, n) => {
              const on = answers.nps === n
              const band = n <= 6 ? FAV[0] : n <= 8 ? FAV[2] : FAV[4]
              return (
                <button key={n} type="button" aria-pressed={on} onClick={() => onChange({ ...answers, nps: n })} className="h-9 rounded-md border text-xs tabular-nums transition-colors" style={on ? { background: band, borderColor: band, color: '#14161a', fontWeight: 700 } : { borderColor: '#d0d2d5' }}>
                  {n}
                </button>
              )
            })}
          </div>
          <p className="mt-1 flex justify-between text-[10px] text-[#979ba3]"><span>{t({ es: 'Nada probable', en: 'Not likely' })}</span><span>{t({ es: 'Muy probable', en: 'Very likely' })}</span></p>
        </div>
        {answers.nps !== null && (
          <label className="enc-fade block rounded-xl border border-dashed border-[#0c5bef]/40 bg-[#f8faff] p-3">
            <span className="text-sm font-medium">{t(depthPrompt(answers.nps))}</span>
            <span className="ml-2 text-[10px] text-[#979ba3]">{t({ es: 'pregunta de profundidad · opcional', en: 'depth question · optional' })}</span>
            <textarea value={answers.depth} onChange={(e) => onChange({ ...answers, depth: e.target.value.slice(0, 300) })} rows={2} className="mt-2 w-full resize-none rounded-lg border border-black/10 bg-white p-2 text-sm outline-none focus:border-[#0c5bef]" placeholder={t({ es: 'Cuéntanos por qué elegiste esta respuesta', en: 'Tell us why you chose this answer' })} />
          </label>
        )}
      </div>
    )
  }

  return (
    <div className="enc-fade relative overflow-hidden py-10 text-center">
      {Array.from({ length: 18 }, (_, i) => (
        <span key={i} className="enc-confetti absolute top-0 h-2 w-1.5 rounded-sm" style={{ left: `${(i * 37) % 100}%`, background: [UBITS_BLUE, ...FAV][i % 6], animationDelay: `${(i % 6) * 0.08}s` }} aria-hidden="true" />
      ))}
      <p className="text-4xl">✓</p>
      <h3 className="mt-3 text-2xl font-semibold">{t({ es: '¡Gracias por tu participación!', en: 'Thanks for taking part!' })}</h3>
      <p className="mx-auto mt-3 max-w-sm text-sm text-[#414a5c]">{t({ es: 'Tus respuestas se suman a las de tu área. Los resultados de cada grupo se publican cuando alcanzan el mínimo.', en: 'Your answers join your area’s. Each group’s results are published once they reach the minimum.' })}</p>
    </div>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { FAV, UBITS_BLUE } from './shared'

type Page = 'welcome' | 'likert' | 'nps' | 'sending' | 'thanks'
interface Frame {
  page: Page
  ans?: readonly (number | null)[]
  nps?: number | null
  typed?: number
  ms: number
}

const DEPTH: L = { es: 'Mi equipo me respalda y aprendo cada semana.', en: 'My team backs me up and I learn every week.' }
const QUESTIONS: readonly L[] = [
  { es: 'Mi líder me da retroalimentación que me ayuda a mejorar.', en: 'My leader gives me feedback that helps me improve.' },
  { es: 'Puedo equivocarme sin miedo a las consecuencias.', en: 'I can make mistakes without fear of the consequences.' },
  { es: 'Tengo tiempo suficiente para hacer bien mi trabajo.', en: 'I have enough time to do my work well.' },
]
const SCALE: readonly L[] = [
  { es: 'Nada', en: 'Not at all' },
  { es: 'Poco', en: 'A little' },
  { es: 'Neutral', en: 'Neutral' },
  { es: 'De acuerdo', en: 'Agree' },
  { es: 'Total', en: 'Fully' },
]

const TYPE_STEPS = 6
const FRAMES: readonly Frame[] = [
  { page: 'welcome', ms: 1900 },
  { page: 'likert', ans: [null, null, null], ms: 900 },
  { page: 'likert', ans: [4, null, null], ms: 850 },
  { page: 'likert', ans: [4, 5, null], ms: 850 },
  { page: 'likert', ans: [4, 5, 3], ms: 1100 },
  { page: 'nps', nps: null, ms: 1000 },
  { page: 'nps', nps: 9, ms: 900 },
  ...Array.from({ length: TYPE_STEPS }, (_, i): Frame => ({ page: 'nps', nps: 9, typed: (i + 1) / TYPE_STEPS, ms: 230 })),
  { page: 'sending', ms: 1200 },
  { page: 'thanks', ms: 0 },
]
const LAST = FRAMES.length - 1
const PROGRESS: Record<Page, number> = { welcome: 0, likert: 34, nps: 67, sending: 100, thanks: 100 }

/** Pseudoaleatorio estable: el confeti sale igual en el servidor y en el navegador. */
const rand = (i: number, salt: number) => {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453
  return x - Math.floor(x)
}
const PIECES = Array.from({ length: 90 }, (_, i) => ({
  dx: (rand(i, 1) - 0.5) * 760,
  up: -120 - rand(i, 2) * 220,
  dy: 220 + rand(i, 3) * 320,
  rot: (rand(i, 4) - 0.5) * 1440,
  dur: 1.6 + rand(i, 5) * 1.4,
  delay: rand(i, 6) * 0.25,
  w: 6 + rand(i, 7) * 7,
  round: rand(i, 8) > 0.7,
  color: [UBITS_BLUE, ...FAV, '#7a5cf0', '#ffffff'][i % 8],
}))

function Confetti() {
  return (
    <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden" aria-hidden="true">
      {PIECES.map((p, i) => (
        <span
          key={i}
          className="encf-piece"
          style={{
            width: p.w,
            height: p.round ? p.w : p.w * 0.45,
            borderRadius: p.round ? '50%' : 2,
            background: p.color,
            ['--dx' as string]: `${p.dx}px`,
            ['--up' as string]: `${p.up}px`,
            ['--dy' as string]: `${p.dy}px`,
            ['--rot' as string]: `${p.rot}deg`,
            ['--dur' as string]: `${p.dur}s`,
            ['--delay' as string]: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

function Screen({ f }: { f: Frame }) {
  const { t } = useLocale()
  if (f.page === 'welcome')
    return (
      <div className="enc-fade flex h-full flex-col">
        <span className="w-fit rounded-full bg-[#ecf1fa] px-2 py-0.5 text-[10px] text-[#0c5bef]">{t({ es: 'Clima · Anónima', en: 'Climate · Anonymous' })}</span>
        <p className="mt-3 text-lg font-semibold leading-tight">{t({ es: 'Pulso de clima · Noviembre', en: 'Climate pulse · November' })}</p>
        <p className="mt-3 text-[11px] leading-relaxed text-[#414a5c]">{t({ es: 'Tus respuestas son anónimas: los resultados se muestran agrupados y solo cuando al menos 5 personas de tu grupo responden.', en: 'Your answers are anonymous: results are grouped and shown only once at least 5 people in your group answer.' })}</p>
        <p className="mt-auto rounded-xl py-2.5 text-center text-xs font-semibold text-white" style={{ background: UBITS_BLUE }}>{t({ es: 'Comenzar · 2 min', en: 'Start · 2 min' })}</p>
      </div>
    )
  if (f.page === 'likert')
    return (
      <div className="enc-fade space-y-2.5">
        <p className="text-[10px] text-[#5c646f]">1. Liderazgo › <span className="text-[#0c5bef]">1.1</span></p>
        {QUESTIONS.map((q, qi) => (
          <div key={q.es} className="rounded-xl border border-black/[0.08] p-2">
            <p className="text-[10.5px] font-medium leading-snug">{t(q)}</p>
            <div className="mt-1.5 grid grid-cols-5 gap-0.5">
              {SCALE.map((s, si) => {
                const on = f.ans?.[qi] === si + 1
                return (
                  <span key={s.es} className={`flex h-6 items-center justify-center rounded-md border text-[8px] leading-none transition-colors duration-300 ${on ? 'encf-tap font-semibold' : ''}`} style={on ? { borderColor: UBITS_BLUE, background: 'rgba(12,91,239,0.1)', color: UBITS_BLUE } : { borderColor: '#d0d2d5' }}>
                    {t(s)}
                  </span>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    )
  if (f.page === 'nps') {
    const text = t(DEPTH)
    return (
      <div className="enc-fade">
        <p className="text-[10px] text-[#5c646f]">2. {t({ es: 'Experiencia', en: 'Experience' })} › <span className="text-[#0c5bef]">2.1</span></p>
        <p className="mt-2 text-[11px] font-medium leading-snug">{t({ es: '¿Qué tan probable es que recomiendes la empresa como lugar para trabajar?', en: 'How likely are you to recommend the company as a place to work?' })}</p>
        <div className="mt-2 grid grid-cols-11 gap-0.5">
          {Array.from({ length: 11 }, (_, n) => {
            const on = f.nps === n
            const band = n <= 6 ? FAV[0] : n <= 8 ? FAV[2] : FAV[4]
            return (
              <span key={n} className={`flex h-6 items-center justify-center rounded text-[8px] tabular-nums ${on ? 'encf-tap font-bold' : ''}`} style={on ? { background: band, color: '#14161a' } : { boxShadow: `inset 0 -2px 0 ${band}`, background: '#f1f3f8' }}>
                {n}
              </span>
            )
          })}
        </div>
        {f.nps != null && (
          <div className="enc-fade mt-3 rounded-xl border border-dashed border-[#0c5bef]/40 bg-[#f8faff] p-2">
            <p className="text-[10.5px] font-medium">{t({ es: '¿Qué es lo que más valoras de trabajar aquí?', en: 'What do you value most about working here?' })}</p>
            <p className="mt-0.5 text-[8.5px] text-[#979ba3]">{t({ es: 'Aparece porque elegiste 9 · opcional', en: 'Shown because you picked 9 · optional' })}</p>
            <p className="mt-1.5 min-h-[2.4rem] rounded-lg bg-white p-1.5 text-[10px] leading-snug ring-1 ring-black/[0.06]">
              {text.slice(0, Math.round(text.length * (f.typed ?? 0)))}
              {f.typed !== undefined && f.typed < 1 && <span className="enc-pulse">|</span>}
            </p>
          </div>
        )}
      </div>
    )
  }
  if (f.page === 'sending')
    return (
      <div className="enc-fade flex h-full flex-col items-center justify-center gap-3">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-[#ecf1fa] border-t-[#0c5bef] motion-reduce:animate-none" />
        <p className="text-xs text-[#5c646f]">{t({ es: 'Enviando y finalizando…', en: 'Sending and finishing…' })}</p>
      </div>
    )
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <span className="encf-pop flex h-16 w-16 items-center justify-center rounded-full text-3xl text-white shadow-[0_12px_30px_-8px_rgba(12,91,239,0.7)]" style={{ background: UBITS_BLUE }}>✓</span>
      <p className="encf-pop mt-4 text-lg font-semibold leading-tight [animation-delay:0.15s]">{t({ es: '¡Gracias por tu participación!', en: 'Thanks for taking part!' })}</p>
      <p className="encf-pop mt-2 text-[11px] leading-relaxed text-[#414a5c] [animation-delay:0.3s]">{t({ es: 'Tus respuestas se suman a las de tu área y se publican cuando el grupo alcanza el mínimo.', en: 'Your answers join your area’s and are published once the group reaches the minimum.' })}</p>
    </div>
  )
}

/** Momento 4: un colaborador responde en el celular y termina en una celebración. */
export function PhoneAnswer() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const ref = useRef<HTMLDivElement>(null)
  const [i, setI] = useState(reducedMotion ? LAST : 0)
  const [run, setRun] = useState(0)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), { threshold: 0.35 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (reducedMotion && run === 0) setI(LAST)
  }, [reducedMotion, run])

  useEffect(() => {
    if ((!seen && run === 0) || (reducedMotion && run === 0) || i >= LAST) return
    const id = window.setTimeout(() => setI((n) => n + 1), FRAMES[i].ms)
    return () => window.clearTimeout(id)
  }, [i, seen, run, reducedMotion])

  const f = FRAMES[i]
  const replay = () => {
    setI(0)
    setRun((r) => r + 1)
  }

  return (
    <div ref={ref} className="relative overflow-hidden rounded-3xl bg-[radial-gradient(120%_90%_at_50%_0%,#dfe8ff,#eef1f7_60%)] px-4 py-10 sm:py-14">
      {f.page === 'thanks' && <Confetti key={run} />}
      <div className="relative mx-auto w-[15.5rem] rounded-[2.4rem] bg-[#14161a] p-2.5 shadow-[0_50px_100px_-40px_rgba(10,11,13,0.8)] sm:w-[17rem]">
        <div className="absolute left-1/2 top-3.5 z-10 h-4 w-20 -translate-x-1/2 rounded-full bg-black" aria-hidden="true" />
        <div className="relative flex h-[30rem] flex-col overflow-hidden rounded-[1.9rem] bg-white px-4 pb-4 pt-9 text-[#303a47] sm:h-[32rem]">
          <div className="mb-3 h-1 overflow-hidden rounded-full bg-[#ecf1fa]" role="progressbar" aria-valuenow={PROGRESS[f.page]} aria-valuemin={0} aria-valuemax={100} aria-label={t({ es: 'Avance', en: 'Progress' })}>
            <span className="block h-full rounded-full transition-[width] duration-700" style={{ width: `${PROGRESS[f.page]}%`, background: UBITS_BLUE }} />
          </div>
          <div className="min-h-0 flex-1" aria-live="polite">
            <Screen key={`${f.page}-${f.page === 'thanks' ? run : ''}`} f={f} />
          </div>
          {(f.page === 'likert' || f.page === 'nps') && (
            <p className="mt-3 rounded-xl py-2 text-center text-[11px] font-semibold text-white transition-opacity" style={{ background: UBITS_BLUE, opacity: f.page === 'likert' ? (f.ans?.every((a) => a !== null) ? 1 : 0.35) : 1 }}>
              {f.page === 'nps' ? t({ es: 'Enviar y finalizar', en: 'Send and finish' }) : t({ es: 'Siguiente', en: 'Next' })}
            </p>
          )}
        </div>
      </div>
      <div className="encf-float absolute left-[6%] top-[18%] hidden rounded-xl bg-white px-3 py-2 text-xs text-[#303a47] shadow-lg lg:block">🔒 {t({ es: 'Anónima · mínimo 5', en: 'Anonymous · min 5' })}</div>
      <div className="encf-float absolute bottom-[20%] right-[6%] hidden rounded-xl bg-white px-3 py-2 text-xs text-[#303a47] shadow-lg [animation-delay:1.2s] lg:block">⏱ {t({ es: '2 min · 4 preguntas', en: '2 min · 4 questions' })}</div>
      <div className="relative mt-6 flex justify-center">
        <button type="button" onClick={replay} className="rounded-full bg-[#14161a] px-4 py-2 text-xs font-medium text-white transition-transform hover:scale-105 focus-visible:scale-105">
          ↻ {f.page === 'thanks' ? t({ es: 'Repetir', en: 'Replay' }) : t({ es: 'Reiniciar', en: 'Restart' })}
        </button>
      </div>
    </div>
  )
}

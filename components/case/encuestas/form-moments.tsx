'use client'

import { useState } from 'react'
import { useLocale, type L } from '@/lib/i18n'
import { SHOTS, type ShotKey } from '@/lib/content/cases/encuestas/case'
import { favColor, Lock, Screen, UBITS_BLUE, useTicker } from './shared'

const ROUTE = '/admin/desempeno-cultura/encuestas'

interface MomentProps {
  index: string
  title: L
  why: L
  shot: ShotKey
  route?: string
  flip?: boolean
  children: React.ReactNode
}

/** Un momento ganador: la pieza animada grande, por qué gana y la pantalla real a un clic. */
export function Moment({ index, title, why, shot, route = ROUTE, flip = false, children }: MomentProps) {
  const { t } = useLocale()
  const [real, setReal] = useState(false)
  const s = SHOTS[shot]
  return (
    <section className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
      <div data-reveal="device" className={`min-w-0 lg:col-span-8 ${flip ? 'lg:order-2' : ''}`}>
        {real ? (
          <div key="real" className="enc-fade">
            <Screen shot={s} route={route} />
          </div>
        ) : (
          <div key="mock">{children}</div>
        )}
      </div>
      <div className={`lg:col-span-4 ${flip ? 'lg:order-1' : ''}`}>
        <p data-reveal className="mono-label text-signal">{index}</p>
        <h3 data-reveal="mask" className="mt-3 text-[clamp(1.6rem,1rem+1.6vw,2.4rem)] font-light leading-[1.05]">{t(title)}</h3>
        <p data-reveal className="mt-4 leading-relaxed opacity-75">{t(why)}</p>
        <button
          type="button"
          data-reveal
          onClick={() => setReal((v) => !v)}
          aria-pressed={real}
          className="group mt-6 flex w-full items-center gap-3 rounded-xl border border-fg/15 p-2 pr-4 text-left transition-colors hover:border-signal focus-visible:border-signal"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={s.src} alt="" width={96} height={60} className="h-14 w-24 shrink-0 rounded-md object-cover object-top ring-1 ring-black/10 transition-transform duration-300 group-hover:scale-105" loading="lazy" />
          <span className="text-sm">
            <span className="block font-medium">{real ? t({ es: 'Volver a la pieza animada', en: 'Back to the animated piece' }) : t({ es: 'Ver pantalla real', en: 'See the real screen' })}</span>
            <span className="block text-xs opacity-60">{t(s.alt)}</span>
          </span>
        </button>
      </div>
    </section>
  )
}

/** Marco de navegador claro para las piezas que imitan el producto. */
export function BrowserFrame({ route, children, className = '' }: { route: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-2xl bg-[#f8faff] text-[#303a47] shadow-[0_40px_90px_-40px_rgba(10,11,13,0.55)] ring-1 ring-black/10 ${className}`}>
      <div className="flex items-center gap-2 border-b border-black/[0.06] bg-white px-3 py-2" aria-hidden="true">
        <span className="flex gap-1">
          <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
          <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
          <span className="h-2 w-2 rounded-full bg-[#28c840]" />
        </span>
        <span className="ml-2 truncate rounded-md bg-[#f1f3f8] px-2 py-0.5 font-mono text-[10px] text-black/45">{route}</span>
      </div>
      {children}
    </div>
  )
}

const TEMPLATES: readonly { name: string; hint: L; color: string; detail: L }[] = [
  { name: 'NOM 035', hint: { es: 'Cumple la norma en México', en: 'Meets the Mexican norm' }, color: '#22a06b', detail: { es: 'Cuestionario oficial de solo lectura · exige el 100 % de participación y al menos un dato demográfico', en: 'Read-only official questionnaire · requires 100% participation and at least one demographic' } },
  { name: 'Universidad Corporativa', hint: { es: 'Mide la formación', en: 'Measures learning' }, color: '#e8743b', detail: { es: 'Lista para medir la experiencia de formación', en: 'Ready to measure the learning experience' } },
  { name: 'Cultura', hint: { es: 'Mide tus valores', en: 'Measures your values' }, color: '#d9467a', detail: { es: 'Versión corta de 30 preguntas o completa de 50, para comparar año a año', en: 'Short 30-question or full 50-question version, to compare year over year' } },
  { name: 'Clima', hint: { es: 'Mide el ambiente laboral', en: 'Measures the work climate' }, color: '#d14b8f', detail: { es: 'Diez secciones · 30 o 50 preguntas, mismas secciones y mismo nombre', en: 'Ten sections · 30 or 50 questions, same sections and name' } },
  { name: 'eNPS', hint: { es: 'Mide si te recomiendan', en: 'Measures if they recommend you' }, color: '#7a5cf0', detail: { es: 'De 0 a 10 · detractores 0–6, neutros 7–8, promotores 9–10', en: '0 to 10 · detractors 0–6, passives 7–8, promoters 9–10' } },
]

/** Momento 1: las cinco plantillas se abren en abanico y una pasa al frente. */
export function TemplatesFan() {
  const { t } = useLocale()
  const tick = useTicker(2400)
  const [picked, setPicked] = useState<number | null>(null)
  const active = picked ?? tick % TEMPLATES.length
  const mid = (TEMPLATES.length - 1) / 2
  return (
    <BrowserFrame route={ROUTE}>
      <div className="relative px-4 pb-6 pt-5 sm:px-8">
        <p className="text-lg font-semibold">{t({ es: 'Encuestas', en: 'Surveys' })}</p>
        <p className="text-xs text-[#5c646f]">{t({ es: 'Elige por dónde empezar', en: 'Choose where to start' })}</p>
        <div className="relative mx-auto mt-6 h-[13.5rem] max-w-[34rem] [--spread:2.4rem] sm:h-[15rem] sm:[--spread:4.4rem]" role="radiogroup" aria-label={t({ es: 'Plantillas', en: 'Templates' })}>
          {TEMPLATES.map((tp, i) => {
            const on = i === active
            const off = i - mid
            return (
              <button
                key={tp.name}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setPicked(i)}
                className="absolute bottom-0 left-1/2 w-[7.2rem] origin-bottom rounded-2xl border bg-white p-3 text-left shadow-[0_18px_40px_-18px_rgba(10,11,13,0.45)] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:w-[9rem]"
                style={{
                  transform: `translateX(calc(-50% + ${on ? 0 : off} * var(--spread))) rotate(${on ? 0 : off * 9}deg) translateY(${on ? -2.4 : Math.abs(off) * 0.5}rem) scale(${on ? 1.18 : 0.92})`,
                  zIndex: on ? 20 : 10 - Math.abs(Math.round(off)),
                  borderColor: on ? UBITS_BLUE : 'rgba(0,0,0,0.08)',
                }}
              >
                <span className="flex h-16 items-center justify-center rounded-xl sm:h-20" style={{ background: `${tp.color}1f` }}>
                  <span className="h-8 w-8 rounded-[10px] shadow-inner sm:h-10 sm:w-10" style={{ background: `linear-gradient(135deg, ${tp.color}, ${tp.color}99)` }} />
                </span>
                <span className="mt-2 block text-[11px] font-semibold leading-tight sm:text-xs">{t({ es: 'Crear', en: 'Create' })} {tp.name}</span>
                <span className="block text-[10px] leading-tight text-[#5c646f]">{t(tp.hint)}</span>
              </button>
            )
          })}
        </div>
        <div key={active} className="enc-fade mx-auto mt-6 flex max-w-[34rem] items-center gap-3 rounded-xl bg-white p-3 ring-1 ring-black/[0.06]">
          <span className="h-9 w-1.5 shrink-0 rounded-full" style={{ background: TEMPLATES[active].color }} />
          <p className="min-w-0 flex-1 text-xs leading-snug text-[#414a5c]">{t(TEMPLATES[active].detail)}</p>
          <span className="hidden shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold text-white sm:inline" style={{ background: UBITS_BLUE }}>{t({ es: 'Usar plantilla', en: 'Use template' })}</span>
        </div>
      </div>
    </BrowserFrame>
  )
}

const AREAS = [
  { name: 'Producto', start: 9, base: [4.2, 3.6, 4.4, 3.1] },
  { name: 'Finanzas', start: 1, base: [3.4, 3.0, 3.8, 2.4] },
  { name: 'Comercial', start: 2, base: [4.4, 4.1, 3.7, 3.3] },
  { name: 'Legal', start: 0, base: [3.9, 3.5, 4.0, 2.9] },
] as const
const ROWS: readonly L[] = [
  { es: 'Propósito', en: 'Purpose' },
  { es: 'Liderazgo', en: 'Leadership' },
  { es: 'Colaboración', en: 'Collaboration' },
  { es: 'Bienestar', en: 'Well-being' },
]
const STEPS = 9

/** Momento 3: el mínimo por grupo viaja al mapa de calor; las celdas se abren solas cuando llegan respuestas. */
export function AnonymityHeatmap() {
  const { t } = useLocale()
  const tick = useTicker(1300)
  const [min, setMin] = useState(5)
  const step = tick % STEPS
  const counts = AREAS.map((a, i) => Math.min(a.start + Math.max(0, step - i), a.start + 6))
  const open = counts.filter((n) => n >= min).length
  return (
    <BrowserFrame route={`${ROUTE}/open-cultura-ola2-2026/resultados`}>
      <div className="p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold">{t({ es: 'Mapa de calor · por área', en: 'Heatmap · by area' })}</p>
          <div className="flex items-center gap-2 rounded-full bg-white px-1 py-1 text-xs ring-1 ring-black/[0.08]">
            <span className="pl-2 text-[#5c646f]">{t({ es: 'Mínimo por grupo', en: 'Group minimum' })}</span>
            <button type="button" onClick={() => setMin((m) => Math.max(3, m - 1))} disabled={min <= 3} aria-label={t({ es: 'Bajar el mínimo', en: 'Lower the minimum' })} className="h-6 w-6 rounded-full hover:bg-[#ecf1fa] disabled:opacity-30">−</button>
            <span className="w-4 text-center font-semibold tabular-nums" aria-live="polite">{min}</span>
            <button type="button" onClick={() => setMin((m) => Math.min(10, m + 1))} aria-label={t({ es: 'Subir el mínimo', en: 'Raise the minimum' })} className="h-6 w-6 rounded-full hover:bg-[#ecf1fa]">+</button>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-[minmax(4.5rem,6rem)_repeat(4,minmax(0,1fr))] gap-1.5 text-[11px]">
          <span />
          {AREAS.map((a, c) => (
            <span key={a.name} className="truncate text-center text-[#5c646f]">
              {a.name}
              <span className={`block font-mono tabular-nums transition-colors ${counts[c] < min ? 'text-[#b26b00]' : 'text-[#2c6b2f]'}`}>n={counts[c]}</span>
            </span>
          ))}
          {ROWS.map((r, ri) => (
            <div key={r.es} className="contents">
              <span className="flex items-center truncate text-[#414a5c]">{t(r)}</span>
              {AREAS.map((a, c) => {
                const n = counts[c]
                const state = n === 0 ? 'empty' : n < min ? 'reserved' : 'open'
                return (
                  <span
                    key={`${a.name}-${state}`}
                    className={`flex h-10 items-center justify-center rounded-lg font-mono tabular-nums sm:h-12 ${state === 'open' ? 'encf-unlock text-[#14161a]' : 'bg-[#eceef3] text-[#979ba3]'}`}
                    style={state === 'open' ? { background: favColor(a.base[ri]), animationDelay: `${ri * 70}ms` } : undefined}
                  >
                    {state === 'open' ? a.base[ri].toFixed(1).replace('.', ',') : state === 'reserved' ? <Lock className="h-4 w-4" /> : '—'}
                  </span>
                )
              })}
            </div>
          ))}
        </div>
        <p className="mt-4 rounded-lg bg-white px-3 py-2 text-xs leading-snug text-[#414a5c] ring-1 ring-black/[0.06]" aria-live="polite">
          {t({ es: `${open} de 4 áreas se pueden leer. Las demás tienen respuestas, pero aún no alcanzan ${min}: nadie puede adivinar quién dijo qué.`, en: `${open} of 4 areas can be read. The rest have answers but haven’t reached ${min}: nobody can guess who said what.` })}
        </p>
      </div>
    </BrowserFrame>
  )
}

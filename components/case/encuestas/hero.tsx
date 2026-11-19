'use client'

import { useEffect, useRef } from 'react'
import { ToneSection } from '@/components/ui/tone-section'
import { TransitionLink } from '@/components/transition/page-transition'
import { gsap } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { ENCUESTAS_CASE } from '@/lib/content/cases/encuestas/case'
import { favColor, Lock, UBITS_BLUE, useTicker } from './shared'

const OPTIONS = [
  { es: 'Totalmente en desacuerdo', en: 'Strongly disagree' },
  { es: 'En desacuerdo', en: 'Disagree' },
  { es: 'Neutral', en: 'Neutral' },
  { es: 'De acuerdo', en: 'Agree' },
  { es: 'Totalmente de acuerdo', en: 'Strongly agree' },
] as const

const SECTIONS = [
  { es: 'Propósito', en: 'Purpose' },
  { es: 'Liderazgo', en: 'Leadership' },
  { es: 'Colaboración', en: 'Collaboration' },
  { es: 'Bienestar', en: 'Well-being' },
] as const

/** Áreas con sus respuestas; Comercial empieza bajo el mínimo y lo alcanza durante la animación. */
const AREAS = [
  { name: 'Producto', n: 48, base: [4.2, 3.6, 4.4, 3.1] },
  { name: 'Tecnología', n: 61, base: [3.9, 3.2, 4.1, 2.6] },
  { name: 'Finanzas', n: 4, base: [3.4, 3.0, 3.8, 2.4] },
  { name: 'Comercial', n: 2, base: [4.4, 4.1, 3.7, 3.3] },
  { name: 'Gente', n: 22, base: [3.6, 2.8, 3.9, 2.2] },
] as const

const MIN_GROUP = 5
const CYCLE = 9

/** La portada: alguien responde, el conteo sube y un área cruza el mínimo de anonimato. */
function LiveMeasurement() {
  const { t } = useLocale()
  const tick = useTicker(1400)
  const step = tick % CYCLE
  const picked = (tick * 3 + 1) % OPTIONS.length
  const comercial = Math.min(AREAS[3].n + step, 8)
  const answered = 312 + step * 7

  return (
    <div className="relative mx-auto w-full max-w-[34rem]" data-hero-fade>
      <div className="relative z-10 rounded-2xl bg-white p-5 text-[#303a47] shadow-[0_40px_90px_-30px_rgba(0,0,0,0.8)]">
        <p className="font-mono text-[10px] uppercase tracking-wider text-[#5c646f]">2.1 · {t({ es: 'Mi líder directo', en: 'My direct leader' })}</p>
        <p className="mt-2 text-[15px] font-medium leading-snug">{t({ es: 'Mi líder me da retroalimentación que me sirve para mejorar.', en: 'My leader gives me feedback that helps me improve.' })}</p>
        <div className="mt-4 grid grid-cols-5 gap-1.5" role="presentation">
          {OPTIONS.map((o, i) => (
            <span
              key={o.es}
              className="flex min-h-[3.2rem] items-center justify-center rounded-lg border px-1 text-center text-[10px] leading-tight transition-all duration-500"
              style={i === picked ? { borderColor: UBITS_BLUE, background: 'rgba(12,91,239,0.08)', color: UBITS_BLUE, fontWeight: 600 } : { borderColor: '#d0d2d5' }}
            >
              {t(o)}
            </span>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between gap-3 text-[11px] text-[#5c646f]">
          <span>
            <span className="tabular-nums font-semibold text-[#303a47]">{answered}</span> {t({ es: 'de 520 respondieron', en: 'of 520 answered' })}
          </span>
          <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#ecf1fa]">
            <span className="block h-full rounded-full transition-[width] duration-700" style={{ width: `${(answered / 520) * 100}%`, background: UBITS_BLUE }} />
          </span>
        </div>
      </div>

      <div className="relative -mt-6 ml-6 rounded-2xl border border-white/10 bg-[#15171b]/95 p-4 pt-9 backdrop-blur">
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <p className="mono-label text-white/60">{t({ es: 'Mapa de calor por área', en: 'Heatmap by area' })}</p>
          <p className="font-mono text-[10px] text-white/45">{t({ es: `mínimo ${MIN_GROUP} por grupo`, en: `min ${MIN_GROUP} per group` })}</p>
        </div>
        <div className="grid grid-cols-[5.5rem_repeat(5,minmax(0,1fr))] gap-1 text-[10px]">
          <span />
          {AREAS.map((a, c) => {
            const n = c === 3 ? comercial : a.n
            return (
              <span key={a.name} className="truncate text-center text-white/55">
                {a.name}
                <span className={`block tabular-nums ${n < MIN_GROUP ? 'text-[#f1c56c]' : 'text-white/35'}`}>n={n}</span>
              </span>
            )
          })}
          {SECTIONS.map((s, r) => (
            <div key={s.es} className="contents">
              <span className="flex items-center text-white/70">{t(s)}</span>
              {AREAS.map((a, c) => {
                const n = c === 3 ? comercial : a.n
                const reserved = n < MIN_GROUP
                const score = a.base[r]
                return (
                  <span
                    key={a.name}
                    className="flex h-8 items-center justify-center rounded-md font-mono tabular-nums transition-[background-color,color] duration-700"
                    style={reserved ? { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.45)' } : { background: favColor(score), color: '#14161a' }}
                    title={reserved ? t({ es: 'Reservado: por debajo del mínimo', en: 'Reserved: below the minimum' }) : undefined}
                  >
                    {reserved ? <Lock className="h-3.5 w-3.5" /> : score.toFixed(1).replace('.', ',')}
                  </span>
                )
              })}
            </div>
          ))}
        </div>
        <p className="mt-3 text-[11px] leading-snug text-white/55" aria-live="polite">
          {comercial < MIN_GROUP
            ? t({ es: `Comercial lleva ${comercial} respuestas: sus resultados siguen reservados.`, en: `Sales has ${comercial} answers: its results stay reserved.` })
            : t({ es: 'Comercial llegó al mínimo: ahora sí se puede leer sin señalar a nadie.', en: 'Sales reached the minimum: now it can be read without pointing at anyone.' })}
        </p>
      </div>
    </div>
  )
}

/** Portada del caso Encuestas. */
export function EncuestasHero() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const ref = useRef<HTMLDivElement>(null)
  const c = ENCUESTAS_CASE

  useEffect(() => {
    const el = ref.current
    if (!el || reducedMotion) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      tl.from('[data-hero-word]', { yPercent: 115, duration: 1.3, stagger: 0.05 }, 0.15).from('[data-hero-fade]', { autoAlpha: 0, y: 28, duration: 1.1, stagger: 0.08 }, 0.4)
    }, el)
    return () => ctx.revert()
  }, [reducedMotion])

  return (
    <ToneSection tone="dark" className="relative overflow-hidden px-[var(--gutter)] pb-24 pt-32">
      <div ref={ref}>
        <div className="pointer-events-none absolute -right-[20vw] top-0 h-[60vw] w-[60vw] rounded-full bg-[radial-gradient(closest-side,rgba(12,91,239,0.22),transparent)]" aria-hidden="true" />
        <div className="relative mb-14 flex flex-wrap items-center justify-between gap-x-6 gap-y-2" data-hero-fade>
          <TransitionLink href="/" transitionLabel={t({ es: 'Inicio', en: 'Home' })} className="mono-label opacity-60 hover:opacity-100">
            ← {t({ es: 'Trabajo', en: 'Work' })}
          </TransitionLink>
          <span className="mono-label opacity-60">N° 05.26 · {t(c.eyebrow)}</span>
        </div>

        <div className="relative grid items-center gap-16 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <h1 className="overflow-hidden pb-2 text-[clamp(3.4rem,1rem+9vw,9rem)] font-light leading-[0.88] tracking-tight">
              <span data-hero-word className="inline-block">{t(c.title)}</span>
            </h1>
            <p data-hero-fade className="mt-6 text-[clamp(1.4rem,1rem+1.4vw,2.2rem)] font-light leading-tight text-signal">{t(c.headline)}</p>
            <p data-hero-fade className="mt-6 max-w-[54ch] leading-relaxed opacity-80">{t(c.lead)}</p>
            <dl data-hero-fade className="mt-10 grid grid-cols-2 gap-x-8 gap-y-5 border-t border-fg/15 pt-6">
              {c.meta.map((m) => (
                <div key={m.label.es}>
                  <dt className="mono-label opacity-50">{t(m.label)}</dt>
                  <dd className="mt-1 text-sm">{t(m.value)}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="lg:col-span-6">
            <LiveMeasurement />
          </div>
        </div>
      </div>
    </ToneSection>
  )
}

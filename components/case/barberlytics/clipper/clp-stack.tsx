'use client'

import { Fragment, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { CLIPPER_CASE } from '@/lib/content/cases/barberlytics/clipper-case'
import { ClipperOrb } from '../clipper-orb'
import { AI, Caption, Lead, useAutoSteps, useInView } from './clp-kit'
import { Spine, usePhone } from './clp-phone-kit'

const STACK = CLIPPER_CASE.stack
const EVALS = CLIPPER_CASE.build.evals
const MODEL = STACK.findIndex((s) => s.id === 'modelo')
/** Una pregunta recorre la cadena de punta a punta, y vuelve a empezar */
const LAST = STACK.length
const STEP_MS = 1000
const LOOP_MS = 1800

const tech = (v: string | L, t: (l: L) => string) => (typeof v === 'string' ? v : t(v))
const colorAt = (i: number) => AI[Math.round((i / (STACK.length - 1)) * (AI.length - 1))]

/**
 * 06 · IA en el proceso: cómo está conectado Clipper. Una pregunta entra por
 * voz o texto, pasa por el servidor (el rol), el modelo de Anthropic, las 18
 * herramientas y el filtro de cifras, y sale escrita o en voz. Tocar una pieza
 * dice qué hace y con qué está hecha.
 */
export function ClipperStack() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const rootRef = useRef<HTMLDivElement>(null)
  const inView = useInView(rootRef)
  const [step] = useAutoSteps({ last: LAST, ms: () => STEP_MS, run: inView, reducedMotion, loopAfter: LOOP_MS })
  const [picked, setPicked] = useState<number | null>(null)
  const phone = usePhone()
  const active = step >= 1 && step <= STACK.length ? step - 1 : null
  const focus = picked ?? active

  const caption =
    focus !== null && !phone
      ? { id: `s${focus}`, tag: `${t(STACK[focus].name)} · ${tech(STACK[focus].tech, t)}`, title: t(STACK[focus].body) }
      : { id: 'all', tag: t({ es: 'Cómo está construido', en: 'How it’s built' }), title: t({ es: 'Un modelo de IA conectado a los datos de la barbería, con frenos de por medio.', en: 'An AI model wired to the shop’s data, with brakes in between.' }) }

  return (
    <div ref={rootRef}>
      <Caption {...caption} />
      <Lead>{t({ es: 'El modelo no ve la base de datos: solo puede pedir lo que sus herramientas le dejan, según el rol.', en: 'The model doesn’t see the database: it can only ask for what its tools allow, by role.' })}</Lead>

      {phone ? (
        <div className="mx-auto mt-10 w-full max-w-[420px]">
          <Spine
            reducedMotion={reducedMotion}
            pulseAt={active !== null && active > 0 ? active - 1 : null}
            gap="pb-5"
            items={STACK.map((s, i) => {
              const lit = active !== null && i <= active
              const hot = focus === i
              const color = colorAt(i)
              return {
                id: s.id,
                color,
                lit,
                hot,
                onPick: () => setPicked(picked === i ? null : i),
                node:
                  i === MODEL ? (
                    <span className="relative grid h-full w-full place-items-center">
                      <ClipperOrb size={48} state={active === i ? 'thinking' : 'idle'} />
                    </span>
                  ) : undefined,
                children: (
                  <span className="relative block">
                    <span className={`block text-[17px] leading-tight transition-colors ${hot ? 'text-paper' : lit ? 'text-paper/85' : 'text-paper/45'}`}>{t(s.name)}</span>
                    <span className="mt-1 block font-mono text-[11px] uppercase tracking-[0.08em]" style={{ color: lit ? color : 'rgb(var(--paper) / 0.35)' }}>{tech(s.tech, t)}</span>
                    {hot && <span className="clp-fade mt-2 block text-[14px] leading-relaxed text-paper/60">{t(s.body)}</span>}
                    {i === STACK.length - 1 && <span data-fiber-from="clp-impacto" className="pointer-events-none absolute -left-10 top-5 h-px w-px" />}
                  </span>
                ),
              }
            })}
          />
        </div>
      ) : (
      <ol className="mx-auto mt-12 flex max-w-[1040px] flex-col items-center lg:flex-row lg:items-start">
        {STACK.map((s, i) => {
          const lit = active !== null && i <= active
          const hot = focus === i
          const color = colorAt(i)
          return (
            <Fragment key={s.id}>
              {i > 0 && (
                <li aria-hidden="true" className="relative h-8 w-px shrink-0 lg:mt-[27px] lg:h-px lg:w-auto lg:flex-1">
                  <span className="absolute inset-0 bg-white/10" />
                  <span
                    className="absolute inset-0 origin-top transition-transform duration-700 ease-expo lg:origin-left"
                    style={{ backgroundImage: `linear-gradient(90deg,${colorAt(i - 1)},${color})`, transform: lit ? 'scale(1)' : 'scale(0)', boxShadow: `0 0 8px ${color}` }}
                  />
                </li>
              )}
              <li className="shrink-0">
                <button
                  type="button"
                  aria-pressed={picked === i}
                  onClick={() => setPicked(picked === i ? null : i)}
                  className="group relative flex w-[8.5rem] flex-col items-center text-center outline-none"
                >
                  {/* La fibra hacia «Impacto» sigue la cadena: sale del costado derecho de la última pieza */}
                  {i === STACK.length - 1 && <span data-fiber-from="clp-impacto" className="pointer-events-none absolute left-full top-[28px] h-px w-px" />}
                  <span className="relative grid h-[56px] w-[56px] place-items-center">
                    {i === MODEL ? (
                      <ClipperOrb size={56} state={active === i ? 'thinking' : 'idle'} />
                    ) : (
                      <span
                        className="h-4 w-4 rounded-full border transition-all duration-500 group-hover:scale-125 group-focus-visible:scale-125"
                        style={{ borderColor: 'white', background: lit ? color : 'rgb(var(--void))', boxShadow: hot ? `0 0 0 8px ${color}33, 0 0 18px ${color}` : lit ? `0 0 12px ${color}` : 'none' }}
                      />
                    )}
                    {hot && !reducedMotion && i !== MODEL && <span className="clp-ping absolute h-6 w-6 rounded-full border border-white" />}
                  </span>
                  <span className={`mt-3 text-[14px] leading-tight transition-colors ${hot ? 'text-paper' : lit ? 'text-paper/85' : 'text-paper/45'}`}>{t(s.name)}</span>
                  <span className="mt-1 font-mono text-[11px] uppercase tracking-[0.08em]" style={{ color: lit ? color : 'rgb(var(--paper) / 0.35)' }}>{tech(s.tech, t)}</span>
                </button>
              </li>
            </Fragment>
          )
        })}
      </ol>
      )}

      {/* Y de vuelta: lo que se aprende de cada respuesta */}
      <div className="mx-auto mt-14 flex max-w-[760px] flex-col items-center gap-3 text-center sm:flex-row sm:justify-center sm:gap-6">
        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-paper/60">👍 / 👎 → {t({ es: 'evaluación', en: 'evaluation' })}</span>
        <span className="hidden h-px w-10 bg-white/15 sm:block" />
        <span className="text-[15px] text-paper/75">
          {EVALS.total} {t({ es: 'preguntas reales en 3 idiomas', en: 'real questions in 3 languages' })} · {t({ es: 'meta 90 %', en: '90% target' })}
        </span>
      </div>
      <p className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-[0.12em] text-paper/60 max-md:hidden">
        {CLIPPER_CASE.tools.map((x) => <span key={x}>{x}</span>)}
      </p>
    </div>
  )
}

'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { OBJ_CASE, type Shot } from '@/lib/content/cases/objetivos/objetivos-case'
import { Block, Body, SubHead } from '@/components/case/barberlytics/ui'
import { ESCALA, tramoDe } from './cascade-model'

const STEP_MS = 4200

/** Ventana de navegador con la captura; al cambiar de captura se cruza con un fundido. */
function BrowserShot({ shot, sizes = '(min-width: 1024px) 70vw, 100vw' }: { shot: Shot; sizes?: string }) {
  const { t } = useLocale()
  return (
    <div className="overflow-hidden rounded-[10px] bg-void ring-1 ring-fg/15 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.55)]">
      <div className="flex items-center gap-1.5 border-b border-paper/10 px-3 py-2" aria-hidden="true">
        <span className="h-2 w-2 rounded-full bg-paper/25" />
        <span className="h-2 w-2 rounded-full bg-paper/25" />
        <span className="h-2 w-2 rounded-full bg-paper/25" />
        <span className="ml-3 h-4 flex-1 rounded bg-paper/[0.06] px-2 font-mono text-[9px] leading-4 text-paper/40">playground · /admin/desempeno-cultura/objetivos</span>
      </div>
      <Image key={shot.src} src={shot.src} width={2000} height={1250} alt={t(shot.alt)} sizes={sizes} className="obj-fade block h-auto w-full" />
    </div>
  )
}

/** El constructor paso a paso: avanza solo hasta que alguien elige un paso. */
function BuilderStepper() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const steps = OBJ_CASE.form.steps
  const [active, setActive] = useState(0)
  const [auto, setAuto] = useState(true)

  useEffect(() => {
    if (!auto || reducedMotion) return
    const id = window.setTimeout(() => setActive((i) => (i + 1) % steps.length), STEP_MS)
    return () => window.clearTimeout(id)
  }, [active, auto, reducedMotion, steps.length])

  const step = steps[active]
  return (
    <figure data-reveal>
      <ol className="mb-5 grid grid-cols-2 gap-px overflow-hidden border border-fg/15 bg-fg/15 md:grid-cols-4">
        {steps.map((s, i) => (
          <li key={s.id}>
            <button
              type="button"
              aria-current={i === active}
              onClick={() => {
                setAuto(false)
                setActive(i)
              }}
              className="relative block w-full bg-bg px-4 py-3 text-left transition-colors hover:bg-fg/[0.04]"
            >
              <span className={`mono-label ${i === active ? 'text-signal' : 'opacity-50'}`}>0{i + 1}</span>
              <span className="mt-1 block text-sm">{t(s.label)}</span>
              {i === active && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-fg/10">
                  <span key={`${active}-${auto}`} className="block h-full bg-signal" style={auto && !reducedMotion ? { animation: `obj-grow ${STEP_MS}ms linear forwards` } : { width: '100%' }} />
                </span>
              )}
            </button>
          </li>
        ))}
      </ol>
      <BrowserShot shot={step.shot} />
      <figcaption className="mono-label mt-3 opacity-60">{t(step.shot.caption)}</figcaption>
    </figure>
  )
}

/** La escala de cumplimiento: arrastra el avance y mira en qué tramo cae. */
function ScaleExplorer() {
  const { t } = useLocale()
  const [value, setValue] = useState(78)
  const tramo = tramoDe(value)
  const max = 150
  return (
    <figure data-reveal className="border border-fg/15 p-6 md:p-8">
      <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_16rem] md:items-center">
        <div>
          <div className="relative h-10">
            <div className="absolute inset-x-0 top-3 flex h-4 overflow-hidden rounded-full">
              {ESCALA.map((b) => (
                <span key={b.id} title={b.nombre} style={{ width: `${((b.hasta - b.desde + 1) / (max + 1)) * 100}%`, background: b.color, opacity: b.id === tramo.id ? 1 : 0.28 }} className="transition-opacity duration-300" />
              ))}
            </div>
            <span className="absolute top-0 h-10 w-0.5 -translate-x-1/2 bg-fg transition-[left] duration-150" style={{ left: `${(value / max) * 100}%` }} aria-hidden="true" />
          </div>
          <label className="mt-4 block">
            <span className="sr-only">{t({ es: 'Avance del objetivo', en: 'Goal progress' })}</span>
            <input type="range" min={0} max={max} value={value} onChange={(e) => setValue(Number(e.target.value))} className="w-full accent-[rgb(var(--signal))]" />
          </label>
          <div className="mt-2 flex justify-between font-mono text-[10px] opacity-50">
            <span>0 %</span>
            <span>70</span>
            <span>100</span>
            <span>150 %</span>
          </div>
        </div>
        <div className="rounded-lg bg-fg/[0.04] p-5">
          <p className="mono-label opacity-60">{t({ es: 'Aumentar las ventas del trimestre', en: 'Grow quarterly sales' })}</p>
          <p className="mt-3 text-5xl font-light tabular-nums">{value}<span className="text-2xl opacity-50"> %</span></p>
          <p className="mt-3 inline-block rounded-full px-3 py-1 text-sm font-medium transition-colors" style={{ background: `${tramo.color}22`, color: tramo.color }}>{tramo.nombre}</p>
        </div>
      </div>
      <figcaption className="mt-6 text-sm leading-relaxed opacity-70">
        {t({ es: 'La escala de la plataforma (30-oct): 0 no cumplió, 1–69 parcialmente, 70–99 en parte, 100 cumplido y hasta 150 sobrecumplió. Cada empresa puede ajustar los tramos y permitir resultados negativos.', en: 'The platform scale (Oct 30): 0 not met, 1–69 partly not met, 70–99 partly met, 100 met and up to 150 exceeded. Each company can tune the bands and allow negative results.' })}
      </figcaption>
    </figure>
  )
}

/** Las siete pestañas de resultados como un mazo: la elegida pasa al frente. */
function ResultsDeck() {
  const { t } = useLocale()
  const tabs = OBJ_CASE.form.tabs
  const [active, setActive] = useState(0)
  return (
    <figure data-reveal className="grid gap-8 lg:grid-cols-[13rem_minmax(0,1fr)]">
      <ol role="tablist" aria-label={t({ es: 'Pestañas de resultados', en: 'Results tabs' })} className="flex gap-1 overflow-x-auto lg:flex-col">
        {tabs.map((tab, i) => (
          <li key={tab.id}>
            <button
              type="button"
              role="tab"
              aria-selected={i === active}
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              className="group flex w-full items-baseline gap-3 whitespace-nowrap border-l-2 border-transparent px-3 py-2 text-left transition-colors aria-selected:border-signal aria-selected:bg-fg/[0.05]"
            >
              <span className="font-mono text-[10px] opacity-50">{String(i + 1).padStart(2, '0')}</span>
              <span className="text-sm group-aria-selected:text-signal">{t(tab.label)}</span>
            </button>
          </li>
        ))}
      </ol>
      <div>
        <div className="relative aspect-[1.6/1]">
          {tabs.map((tab, i) => {
            const offset = (i - active + tabs.length) % tabs.length
            const visible = offset < 3
            return (
              <div
                key={tab.id}
                className="absolute inset-0 origin-top transition-[transform,opacity] duration-700 ease-expo"
                style={{
                  transform: `translateY(${offset * -18}px) scale(${1 - offset * 0.05})`,
                  opacity: visible ? 1 - offset * 0.3 : 0,
                  zIndex: tabs.length - offset,
                }}
                aria-hidden={offset !== 0}
              >
                <div className="overflow-hidden rounded-[10px] ring-1 ring-fg/15 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.5)]">
                  <Image src={tab.shot.src} width={2000} height={1250} alt={t(tab.shot.alt)} sizes="(min-width: 1024px) 60vw, 100vw" className="block h-auto w-full" />
                </div>
              </div>
            )
          })}
        </div>
        <figcaption key={tabs[active].id} className="obj-fade mono-label mt-4 opacity-70">{t(tabs[active].shot.caption)}</figcaption>
      </div>
    </figure>
  )
}

/** 05 · La forma: el producto construido, en capturas reales del playground. */
export function ObjetivosForm() {
  const { t } = useLocale()
  const { form } = OBJ_CASE
  return (
    <div>
      <p data-reveal className="max-w-[62ch] text-lg leading-relaxed opacity-80">{t(form.lead)}</p>

      <Block className="!mt-12">
        <SubHead index="5.1">{t({ es: 'Inicio: qué atender antes de abrir un ciclo', en: 'Home: what to attend before opening a cycle' })}</SubHead>
        <Body className="mb-8">{t({ es: '«Para atender» ordena por prioridad lo que pide acción —avance bajo a días del cierre, personas sin reportar— y el pulso compara cada cifra con los ciclos anteriores.', en: '“To attend” ranks what needs action —low progress days before close, people not reporting— and the pulse compares each figure with past cycles.' })}</Body>
        <div data-reveal="device">
          <BrowserShot shot={form.home} />
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {[form.noGoals, form.periods].map((shot) => (
            <figure key={shot.src} data-reveal>
              <div className="overflow-hidden rounded-[10px] ring-1 ring-fg/15">
                <Image src={shot.src} width={2000} height={1250} alt={t(shot.alt)} sizes="(min-width: 768px) 35vw, 100vw" className="block h-auto w-full" />
              </div>
              <figcaption className="mono-label mt-3 opacity-60">{t(shot.caption)}</figcaption>
            </figure>
          ))}
        </div>
      </Block>

      <Block>
        <SubHead index="5.2">{t({ es: 'Crear: el constructor de ciclos', en: 'Create: the cycle builder' })}</SubHead>
        <Body className="mb-8">{t({ es: 'Autoguarda cada pocos segundos y el panel «Así va el ciclo» cuenta lo que falta. El peso se revisa por persona: quedarse debajo de 100 % vale, pasarse no.', en: 'It autosaves every few seconds and the “How the cycle is going” panel counts what’s missing. Weight is checked per person: staying under 100 % is fine, going over isn’t.' })}</Body>
        <BuilderStepper />
      </Block>

      <Block>
        <SubHead index="5.3">{t({ es: 'Medir: una escala que se entiende', en: 'Measure: a scale people understand' })}</SubHead>
        <ScaleExplorer />
      </Block>

      <Block>
        <SubHead index="5.4">{t({ es: 'Leer: siete pestañas de resultados', en: 'Read: seven results tabs' })}</SubHead>
        <Body className="mb-10">{t({ es: 'Del resumen a los accionables, cada pestaña responde una pregunta distinta del mismo ciclo. Pasa por la lista.', en: 'From summary to actions, each tab answers a different question about the same cycle. Hover the list.' })}</Body>
        <ResultsDeck />
      </Block>
    </div>
  )
}

'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useLocale } from '@/lib/i18n'
import { OBJ_CASE, type Shot } from '@/lib/content/cases/objetivos/objetivos-case'
import { Block, Body, SubHead } from '@/components/case/barberlytics/ui'
import { ESCALA, tramoDe } from './cascade-model'
import { HOME_SPOTS } from './form-spots'
import { CycleReading } from './forma-lectura'
import { ShotStage } from './shot-stage'

/** Dos capturas en abanico: al pasar el cursor se abren y la elegida pasa al frente. */
function FanPair({ shots }: { shots: readonly Shot[] }) {
  const { t } = useLocale()
  const [front, setFront] = useState(1)
  return (
    <div data-reveal className="group relative mx-auto mt-16 aspect-[1.9/1] w-full max-w-[880px]">
      {shots.map((shot, i) => {
        const isFront = i === front
        const side = i === 0 ? -1 : 1
        return (
          <figure
            key={shot.src}
            onMouseEnter={() => setFront(i)}
            onFocus={() => setFront(i)}
            tabIndex={0}
            className="absolute top-0 w-[62%] cursor-pointer outline-none transition-[transform,opacity] duration-700 ease-expo"
            style={{
              left: i === 0 ? '0%' : '38%',
              zIndex: isFront ? 2 : 1,
              transform: `rotate(${side * (isFront ? 1.5 : 4)}deg) translateY(${isFront ? 0 : 26}px) scale(${isFront ? 1 : 0.94})`,
              opacity: isFront ? 1 : 0.75,
            }}
          >
            <div className="overflow-hidden rounded-xl bg-white shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)] ring-1 ring-fg/15">
              <Image src={shot.src} width={2000} height={1250} alt={t(shot.alt)} sizes="(min-width: 768px) 40vw, 70vw" className="block h-auto w-full" />
            </div>
            <figcaption className={`mono-label mt-3 transition-opacity duration-500 ${isFront ? 'opacity-70' : 'opacity-0'}`}>{t(shot.caption)}</figcaption>
          </figure>
        )
      })}
    </div>
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

/** 05 · La forma: el producto construido, en capturas reales del playground. */
export function ObjetivosForm() {
  const { t } = useLocale()
  const { form } = OBJ_CASE
  return (
    <div>
      <p data-reveal className="max-w-[62ch] text-lg leading-relaxed opacity-80">{t(form.lead)}</p>

      <Block className="!mt-12">
        <SubHead index="5.1">{t({ es: 'Leer un ciclo en cinco preguntas', en: 'Reading a cycle in five questions' })}</SubHead>
        <Body className="mb-8">{t({ es: 'Resultados no es un tablero de cifras sueltas: está ordenado por las preguntas que se hace quien administra. Cada pregunta enciende su bloque real, con su gráfico y las cifras de un ciclo del staging. Avanza solo o toca un número.', en: 'Results isn’t a board of loose figures: it’s ordered by the questions an admin asks. Each question lights up its real block, with its chart and the figures of a staging cycle. It advances on its own, or tap a number.' })}</Body>
        <CycleReading />
      </Block>

      <Block>
        <SubHead index="5.2">{t({ es: 'Medir: una escala que se entiende', en: 'Measure: a scale people understand' })}</SubHead>
        <ScaleExplorer />
      </Block>

      <Block>
        <SubHead index="5.3">{t({ es: 'Y así se ve en el playground', en: 'And this is how it looks in the playground' })}</SubHead>
        <Body className="mb-8">{t({ es: 'La captura real del inicio, recorrida zona por zona: «Para atender» ordena por prioridad lo que pide acción y el pulso compara cada cifra con los ciclos anteriores.', en: 'The real home screenshot, toured area by area: “To attend” ranks what needs action and the pulse compares each figure with past cycles.' })}</Body>
        <div data-reveal="device">
          <ShotStage shot={form.home} spots={HOME_SPOTS} />
        </div>
        <FanPair shots={[form.noGoals, form.periods]} />
      </Block>
    </div>
  )
}

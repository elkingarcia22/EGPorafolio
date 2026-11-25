'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useLocale, type L } from '@/lib/i18n'
import { Arrows, Bar, Board, Btn, Hand, Pin, Sketchy, SketchPhone, Sticky, type StickyColor } from '@/components/case/kit/sketch'
import { BOOKING_CASE } from '@/lib/content/cases/barberlytics/booking-case'
import { SKETCH_STEPS } from './sketch-steps'

const { form, idea, impact } = BOOKING_CASE
const BOARD = { w: 1200, h: 700 }

/** La tira de días que reemplaza al calendario */
function DayStrip() {
  return (
    <div className="flex gap-[0.3cqw]">
      {[0, 1, 2, 3, 4].map((d) => (
        <Sketchy key={d} fill={d === 1 ? '#ffd2a8' : 'transparent'} className="h-[1.6cqw] flex-1" />
      ))}
    </div>
  )
}

/** Lo que se dibujó dentro de cada celular, en el orden de SKETCH_STEPS */
function CoverSketch() {
  return (
    <>
      <Hand size={1.25} className="mt-[1cqw] font-bold">Reserva tu cita</Hand>
      <Bar w={70} />
      <div className="mt-[1.5cqw]">
        <Sketchy fill="#fffdf6" className="px-[0.5cqw] py-[0.4cqw]">
          <Hand size={1}>📱 320 217 …</Hand>
        </Sketchy>
      </div>
      <Btn accent>Continuar</Btn>
      <div className="mt-auto flex flex-col gap-[0.4cqw]">
        <Bar w={45} />
        <Bar w={35} />
      </div>
    </>
  )
}

function ReturnSketch() {
  return (
    <>
      <Hand size={1.25} className="font-bold">Arma tu cita</Hand>
      {['sede ✓', 'servicio ✓', 'barbero ✓'].map((s) => (
        <Sketchy key={s} fill="#c9efc0" className="px-[0.5cqw] py-[0.3cqw]">
          <Hand size={0.95}>{s}</Hand>
        </Sketchy>
      ))}
      <DayStrip />
      <div className="grid grid-cols-2 gap-[0.3cqw]">
        <Btn>4:30</Btn>
        <Btn accent>5:00</Btn>
      </div>
    </>
  )
}

function NewSketch() {
  return (
    <>
      <Hand size={1.25} className="font-bold">Conozcámonos</Hand>
      <Bar w={85} />
      {['nombre', 'apellido', 'correo'].map((s) => (
        <Sketchy key={s} className="px-[0.5cqw] py-[0.3cqw]">
          <Hand size={0.95} className="opacity-60">{s}</Hand>
        </Sketchy>
      ))}
      <Hand size={0.95}>☐ promociones</Hand>
      <div className="mt-auto">
        <Btn accent>Seguir</Btn>
      </div>
    </>
  )
}

function ClipperSketch() {
  return (
    <>
      <Hand size={1.25} className="font-bold">Clipper</Hand>
      <div className="ml-auto w-[85%]">
        <Sketchy fill="#bfe0ff" className="px-[0.5cqw] py-[0.3cqw]">
          <Hand size={0.95}>corte mañana a las 5</Hand>
        </Sketchy>
      </div>
      <div className="w-[85%]">
        <Sketchy className="flex flex-col gap-[0.3cqw] px-[0.5cqw] py-[0.4cqw]">
          <Bar w={80} />
          <Hand size={0.95}>1 · 5:30</Hand>
          <Hand size={0.95}>2 · 6:00</Hand>
        </Sketchy>
      </div>
      <div className="mt-auto">
        <Sketchy className="px-[0.5cqw] py-[0.3cqw]">
          <Hand size={0.95} className="opacity-60">escribe o habla 🎙</Hand>
        </Sketchy>
      </div>
    </>
  )
}

const SKETCHES = [CoverSketch, ReturnSketch, NewSketch, ClipperSketch]
const STICKY: readonly StickyColor[] = ['yellow', 'green', 'pink', 'blue']

/** Página 1: la portada se parte en dos caminos; tocar un celular lo vuelve la pantalla real */
function CoverPage() {
  const { t } = useLocale()
  const [real, setReal] = useState<number | null>(null)
  const xs = [60, 370, 650, 940]
  return (
    <Board title="" {...BOARD} label={t({ es: 'Boceto: portada, quien vuelve, quien llega y Clipper', en: 'Sketch: cover, returning, new and Clipper' })}>
      <Pin x={40} y={30}>
        <Hand size={2.4} className="font-bold">{t({ es: 'Un campo decide el camino', en: 'One field decides the path' })}</Hand>
      </Pin>
      <Pin x={40} y={92} w={620}>
        <Hand size={1.5} className="opacity-70">{t({ es: 'Con solo el celular ya sé si vuelves o si llegas.', en: 'From the phone alone I know if you’re back or new.' })}</Hand>
      </Pin>
      {SKETCH_STEPS.map((s, i) => {
        const Sketch = SKETCHES[i]
        const on = real === i
        return (
          <Pin key={s.image} x={xs[i]} y={170} w={190}>
            <button type="button" onClick={() => setReal((p) => (p === i ? null : i))} aria-pressed={on} aria-label={t(s.title)} className="relative block w-full text-left outline-none transition-transform duration-300 hover:-translate-y-1">
              <SketchPhone title={t(s.title)}>
                <Sketch />
              </SketchPhone>
              <span className="pointer-events-none absolute inset-x-0 bottom-0 top-[2.2cqw] overflow-hidden rounded-[1.6cqw] shadow-[0_12px_30px_-12px_rgba(0,0,0,0.6)] transition-[opacity,transform] duration-500 ease-expo" style={{ opacity: on ? 1 : 0, transform: `scale(${on ? 1 : 0.94})` }}>
                <Image src={`/cases/barberlytics/${s.image}.webp`} fill sizes="200px" alt={t(s.alt)} className="object-cover object-top" />
              </span>
            </button>
          </Pin>
        )
      })}
      <Arrows paths={[{ d: 'M258 330 C300 300 330 290 366 300', accent: true }, { d: 'M258 400 C380 560 560 560 646 470', accent: true }, { d: 'M565 220 C640 130 860 130 936 210' }]} />
      <Pin x={272} y={260} w={110} rotate={-4}>
        <Hand size={1.3}>{t({ es: 'vuelve', en: 'back' })}</Hand>
      </Pin>
      <Pin x={420} y={545} w={110} rotate={3}>
        <Hand size={1.3}>{t({ es: 'llega', en: 'new' })}</Hand>
      </Pin>
      <Pin x={700} y={120} w={240} rotate={-2}>
        <Hand size={1.2} className="opacity-70">{t({ es: 'siempre a mano · toca un celular', en: 'always at hand · tap a phone' })}</Hand>
      </Pin>
      {SKETCH_STEPS.map((s, i) => (
        <Pin key={`note-${s.image}`} x={xs[i] + (i % 2 ? 20 : -10)} y={590} w={210} rotate={i % 2 ? 2 : -2}>
          <Sticky color={STICKY[i]} small>{t(s.sketch)}</Sticky>
        </Pin>
      ))}
    </Board>
  )
}

/** Celular grande a la izquierda y sus decisiones anotadas a la derecha, con flechas a cada zona */
const PHONE = { x: 140, y: 100, w: 270 }
/** El dibujo ocupa la mitad de arriba del celular: la zona de la captura se comprime a esa altura */
const SKETCH_SPAN = 0.55
const phoneY = (pct: number) => PHONE.y + 40 + (pct / 100) * SKETCH_SPAN * ((PHONE.w * 17) / 9)

function CalloutPage({ screen, sketch: Sketch, title }: { screen: number; sketch: () => JSX.Element; title: L }) {
  const { t } = useLocale()
  const { callouts } = form.screens[screen]
  const rowY = (i: number) => 110 + i * (callouts.length > 3 ? 135 : 170)
  const tx = PHONE.x + PHONE.w * 0.88
  return (
    <Board title="" {...BOARD} label={t(title)}>
      <Pin x={40} y={30}>
        <Hand size={2.4} className="font-bold">{t(title)}</Hand>
      </Pin>
      <Pin x={PHONE.x} y={PHONE.y} w={PHONE.w}>
        <SketchPhone>
          <Sketch />
        </SketchPhone>
      </Pin>
      {callouts.map((c, i) => (
        <Pin key={c.title.es} x={560} y={rowY(i)} w={300} rotate={i % 2 ? 1.5 : -1.5}>
          <Sticky color={STICKY[(screen + i) % STICKY.length]} small>{t(c.title)}</Sticky>
        </Pin>
      ))}
      {callouts.map((c, i) => (
        <Pin key={`b-${c.title.es}`} x={890} y={rowY(i) + 4} w={280}>
          <Hand size={1.2} className="opacity-75">{t(c.body)}</Hand>
        </Pin>
      ))}
      <Arrows paths={callouts.map((c, i) => ({ d: `M555 ${rowY(i) + 26} C500 ${rowY(i) + 26} ${tx + 70} ${phoneY(c.y + c.h / 2)} ${tx} ${phoneY(c.y + c.h / 2)}`, accent: i === 1 }))} />
    </Board>
  )
}

export const ReturnPage = () => <CalloutPage screen={0} sketch={ReturnSketch} title={{ es: 'Quien vuelve: todo listo', en: 'Returning: all set' }} />
export const NewPage = () => <CalloutPage screen={1} sketch={NewSketch} title={{ es: 'Quien llega: conozcámonos', en: 'New: let’s meet' }} />
export const ClipperPage = () => <CalloutPage screen={2} sketch={ClipperSketch} title={{ es: 'Clipper: dime qué necesitas', en: 'Clipper: tell me what you need' }} />

/** Página 5: un solo lenguaje de elegir, círculo para una, casilla para varias */
function ChoosePage() {
  const { t } = useLocale()
  const p = idea.principles[2]
  const rows = (mark: (i: number) => string) =>
    [0, 1, 2].map((i) => (
      <div key={i} className="flex items-center gap-[0.8cqw]">
        <Hand size={2}>{mark(i)}</Hand>
        <Bar w={[70, 50, 60][i]} strong={i === 1} />
      </div>
    ))
  return (
    <Board title="" {...BOARD} label={t(p.title)}>
      <Pin x={40} y={30}>
        <Hand size={2.4} className="font-bold">{t(p.title)}</Hand>
      </Pin>
      <Pin x={120} y={170} w={380}>
        <Hand size={1.6} className="mb-[0.6cqw] block">{t({ es: 'una sola opción', en: 'one option' })}</Hand>
        <Sketchy fill="#fffdf6" className="flex flex-col gap-[1cqw] p-[1.4cqw]">{rows((i) => (i === 1 ? '◉' : '○'))}</Sketchy>
      </Pin>
      <Pin x={640} y={170} w={380}>
        <Hand size={1.6} className="mb-[0.6cqw] block">{t({ es: 'varias', en: 'several' })}</Hand>
        <Sketchy fill="#fffdf6" className="flex flex-col gap-[1cqw] p-[1.4cqw]">{rows((i) => (i === 2 ? '☐' : '☑'))}</Sketchy>
      </Pin>
      <Pin x={330} y={500} w={520} rotate={-1.5}>
        <Sticky color="yellow">{t(p.body)}</Sticky>
      </Pin>
    </Board>
  )
}

/** Página 6: identidad cuando hace falta, el código llega antes de cobrar */
function IdentityPage() {
  const { t } = useLocale()
  const p = idea.principles[3]
  const steps: readonly { label: L; accent?: boolean }[] = [
    { label: { es: 'celular', en: 'phone' } },
    { label: { es: 'mirar horas', en: 'browse slots' } },
    { label: { es: 'elegir', en: 'choose' } },
    { label: { es: 'código', en: 'code' }, accent: true },
    { label: { es: 'pagar', en: 'pay' } },
    { label: { es: 'cita ✓', en: 'booked ✓' } },
  ]
  const x = (i: number) => 50 + i * 190
  return (
    <Board title="" {...BOARD} label={t(p.title)}>
      <Pin x={40} y={30}>
        <Hand size={2.4} className="font-bold">{t(p.title)}</Hand>
      </Pin>
      {steps.map((s, i) => (
        <Pin key={s.label.es} x={x(i)} y={270} w={150}>
          <Sketchy fill={s.accent ? '#ffd2a8' : '#fffdf6'} className="px-[0.6cqw] py-[1cqw] text-center">
            <Hand size={1.5} className={s.accent ? 'font-bold' : ''}>{t(s.label)}</Hand>
          </Sketchy>
        </Pin>
      ))}
      <Arrows paths={steps.slice(0, -1).map((_, i) => ({ d: `M${x(i) + 152} 300 Q${x(i) + 171} 292 ${x(i + 1) - 4} 300`, accent: i === 2 }))} />
      <Pin x={600} y={200} w={300} rotate={-2}>
        <Hand size={1.6}>{t({ es: '↓ no antes de mirar horas', en: '↓ not before browsing slots' })}</Hand>
      </Pin>
      <Pin x={330} y={430} w={420} rotate={-1.5}>
        <Sticky color="orange">{t(p.body)}</Sticky>
      </Pin>
      <Pin x={800} y={470} w={300} rotate={2}>
        <Sticky color="pink" small>{t(impact.closed[1])}</Sticky>
      </Pin>
    </Board>
  )
}

export interface NotebookPage {
  Page: () => JSX.Element
  title: L
  note: L
}

/** Las páginas del cuaderno, en el orden en que se dibujaron */
export const NOTEBOOK_PAGES: readonly NotebookPage[] = [
  { Page: CoverPage, title: { es: 'La portada decide', en: 'The cover decides' }, note: { es: 'Un campo y nada más; de ahí salen dos caminos y Clipper queda a mano.', en: 'One field, nothing else; two paths come out of it and Clipper stays at hand.' } },
  { Page: ReturnPage, title: { es: 'Quien vuelve', en: 'Returning' }, note: SKETCH_STEPS[1].sketch },
  { Page: NewPage, title: { es: 'Quien llega', en: 'New client' }, note: SKETCH_STEPS[2].sketch },
  { Page: ClipperPage, title: { es: 'Clipper', en: 'Clipper' }, note: SKETCH_STEPS[3].sketch },
  { Page: ChoosePage, title: idea.principles[2].title, note: idea.principles[2].body },
  { Page: IdentityPage, title: idea.principles[3].title, note: idea.principles[3].body },
]

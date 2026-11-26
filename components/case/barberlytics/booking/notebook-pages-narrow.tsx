'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useLocale, type L } from '@/lib/i18n'
import { Arrows, Bar, Board, Hand, Pin, Sketchy, SketchPhone, Sticky } from '@/components/case/kit/sketch'
import { BOOKING_CASE } from '@/lib/content/cases/barberlytics/booking-case'
import { SKETCH_STEPS } from './sketch-steps'
import { SKETCHES, STICKY, SketchScale } from './notebook-pages'

/**
 * Las mismas páginas del cuaderno, recompuestas para el teléfono: hoja vertical,
 * menos notas y la letra a mano a un tamaño que se lee (≥ 11 px a 375 px).
 * Todo se mide en coordenadas de la hoja (400 de ancho): 1cqw = 4 unidades.
 */
const { form, idea, impact } = BOOKING_CASE
export const NARROW_BOARD = { w: 400, h: 720 }
/** La letra de los celulares dibujados crece en esta proporción */
const K = 3.5
/** Tamaños de letra en la hoja angosta (cqw) */
const SIZE = { title: 6.4, label: 4.2, note: 3.9 }

/** Post-it con la letra grande de la hoja angosta */
function BigSticky({ color, children }: { color: (typeof STICKY)[number] | 'orange'; children: React.ReactNode }) {
  return (
    <div className="[&>div]:!p-[2.2cqw] [&>div]:!text-[3.9cqw] [&>div]:!leading-[1.1]">
      <Sticky color={color}>{children}</Sticky>
    </div>
  )
}

function Title({ children }: { children: React.ReactNode }) {
  return (
    <Pin x={20} y={22} w={360}>
      <Hand size={SIZE.title} className="font-bold leading-[1]">{children}</Hand>
    </Pin>
  )
}

/** Página 1: los cuatro celulares en dos filas; tocar uno lo vuelve la pantalla real */
function CoverPageNarrow() {
  const { t } = useLocale()
  const [real, setReal] = useState<number | null>(null)
  const spots = [
    { x: 24, y: 118 },
    { x: 236, y: 118 },
    { x: 24, y: 430 },
    { x: 236, y: 430 },
  ]
  return (
    <Board title="" {...NARROW_BOARD} label={t({ es: 'Boceto: portada, quien vuelve, quien llega y Clipper', en: 'Sketch: cover, returning, new and Clipper' })}>
      <Title>{t({ es: 'Un campo decide el camino', en: 'One field decides the path' })}</Title>
      <SketchScale.Provider value={K}>
        {SKETCH_STEPS.map((s, i) => {
          const Sketch = SKETCHES[i]
          const on = real === i
          return (
            <Pin key={s.image} x={spots[i].x} y={spots[i].y - 26} w={140}>
              <Hand size={SIZE.label} className="mb-[0.6cqw] block text-center">{t(s.title)}</Hand>
              <button type="button" onClick={() => setReal((p) => (p === i ? null : i))} aria-pressed={on} aria-label={t(s.title)} className="relative block w-full text-left outline-none">
                <SketchPhone>
                  <Sketch />
                </SketchPhone>
                <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-[3cqw] shadow-[0_12px_30px_-12px_rgba(0,0,0,0.6)] transition-[opacity,transform] duration-500 ease-expo" style={{ opacity: on ? 1 : 0, transform: `scale(${on ? 1 : 0.94})` }}>
                  <Image src={`/cases/barberlytics/${s.image}.webp`} fill sizes="140px" alt={t(s.alt)} className="object-cover object-top" />
                </span>
              </button>
            </Pin>
          )
        })}
      </SketchScale.Provider>
      <Arrows paths={[{ d: 'M168 230 C190 222 212 222 232 230', accent: true }, { d: 'M94 384 C100 392 100 398 94 404', accent: true }, { d: 'M168 370 C200 380 222 392 236 402' }]} />
      <Pin x={176} y={196} w={60} rotate={-4}>
        <Hand size={SIZE.note}>{t({ es: 'vuelve', en: 'back' })}</Hand>
      </Pin>
      <Pin x={108} y={382} w={70} rotate={3}>
        <Hand size={SIZE.note}>{t({ es: 'llega', en: 'new' })}</Hand>
      </Pin>
      <Pin x={20} y={680} w={360}>
        <Hand size={SIZE.note} className="block text-center opacity-70">{t({ es: 'toca un celular para ver la pantalla real', en: 'tap a phone to see the real screen' })}</Hand>
      </Pin>
    </Board>
  )
}

/** El celular dibujado a la izquierda */
const PHONE = { x: 16, y: 96, w: 190 }
const PHONE_H = (PHONE.w * 17) / 9
/** El dibujo, con la letra grande, ocupa casi todo el alto del celular */
const SKETCH_SPAN = 0.66
const phoneY = (pct: number) => PHONE.y + PHONE_H * 0.07 + (pct / 100) * SKETCH_SPAN * PHONE_H * 0.88

/** Páginas 2–4: el celular a la izquierda, sus decisiones a la derecha; tocar una nota muestra el porqué abajo */
function CalloutPageNarrow({ screen, title }: { screen: number; title: L }) {
  const { t } = useLocale()
  const [picked, setPicked] = useState(0)
  const { callouts } = form.screens[screen]
  const Sketch = SKETCHES[screen + 1]
  const gap = callouts.length > 3 ? 84 : 108
  const rowY = (i: number) => 104 + i * gap
  return (
    <Board title="" {...NARROW_BOARD} label={t(title)}>
      <Title>{t(title)}</Title>
      <Pin x={PHONE.x} y={PHONE.y} w={PHONE.w}>
        <SketchScale.Provider value={K}>
          <SketchPhone>
            <Sketch />
          </SketchPhone>
        </SketchScale.Provider>
      </Pin>
      {callouts.map((c, i) => (
        <Pin key={c.title.es} x={226} y={rowY(i)} w={160} rotate={i % 2 ? 1.5 : -1.5}>
          <button type="button" aria-pressed={picked === i} onClick={() => setPicked(i)} className={`block w-full text-left outline-none transition-transform duration-300 ${picked === i ? 'scale-[1.04]' : 'opacity-80'}`}>
            <BigSticky color={STICKY[(screen + i) % STICKY.length]}>
              <span className="mr-[1cqw] font-bold">{i + 1}</span>
              {t(c.title)}
            </BigSticky>
          </button>
        </Pin>
      ))}
      <Arrows paths={callouts.map((c, i) => ({ d: `M222 ${rowY(i) + 20} C212 ${rowY(i) + 20} ${PHONE.x + PHONE.w + 14} ${phoneY(c.y + c.h / 2)} ${PHONE.x + PHONE.w * 0.9} ${phoneY(c.y + c.h / 2)}`, accent: i === picked }))} />
      <Pin x={20} y={PHONE.y + PHONE_H + 26} w={360}>
        <p key={picked} className="bk-fade">
          <Hand size={SIZE.label} className="font-bold">
            {picked + 1} · {t(callouts[picked].title)}
          </Hand>
          <br />
          <Hand size={SIZE.label} className="opacity-80">{t(callouts[picked].body)}</Hand>
        </p>
      </Pin>
    </Board>
  )
}

const ReturnPageNarrow = () => <CalloutPageNarrow screen={0} title={{ es: 'Quien vuelve: todo listo', en: 'Returning: all set' }} />
const NewPageNarrow = () => <CalloutPageNarrow screen={1} title={{ es: 'Quien llega: conozcámonos', en: 'New: let’s meet' }} />
const ClipperPageNarrow = () => <CalloutPageNarrow screen={2} title={{ es: 'Clipper: dime qué necesitas', en: 'Clipper: tell me what you need' }} />

/** Página 5: círculo para una, casilla para varias, una sobre otra */
function ChoosePageNarrow() {
  const { t } = useLocale()
  const p = idea.principles[2]
  const box = (label: L, mark: (i: number) => string) => (
    <>
      <Hand size={SIZE.label} className="mb-[1.5cqw] block">{t(label)}</Hand>
      <Sketchy fill="#fffdf6" className="flex flex-col gap-[2.4cqw] p-[3.4cqw]">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-[2.5cqw]">
            <Hand size={6}>{mark(i)}</Hand>
            <Bar w={[70, 50, 60][i]} strong={i === 1} />
          </div>
        ))}
      </Sketchy>
    </>
  )
  return (
    <Board title="" {...NARROW_BOARD} label={t(p.title)}>
      <Title>{t(p.title)}</Title>
      <Pin x={40} y={150} w={320}>{box({ es: 'una sola opción', en: 'one option' }, (i) => (i === 1 ? '◉' : '○'))}</Pin>
      <Pin x={40} y={370} w={320}>{box({ es: 'varias', en: 'several' }, (i) => (i === 2 ? '☐' : '☑'))}</Pin>
      <Pin x={50} y={600} w={300} rotate={-1.5}>
        <BigSticky color="yellow">{t(p.body)}</BigSticky>
      </Pin>
    </Board>
  )
}

/** Página 6: el recorrido en dos filas de tres; el código, justo antes de pagar */
function IdentityPageNarrow() {
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
  const x = (i: number) => 18 + (i % 3) * 130
  const y = (i: number) => (i < 3 ? 160 : 300)
  const W = 104
  return (
    <Board title="" {...NARROW_BOARD} label={t(p.title)}>
      <Title>{t(p.title)}</Title>
      {steps.map((s, i) => (
        <Pin key={s.label.es} x={x(i)} y={y(i)} w={W}>
          <Sketchy fill={s.accent ? '#ffd2a8' : '#fffdf6'} className="flex min-h-[13cqw] items-center justify-center px-[1cqw] py-[2cqw] text-center">
            <Hand size={SIZE.label} className={s.accent ? 'font-bold' : ''}>{t(s.label)}</Hand>
          </Sketchy>
        </Pin>
      ))}
      <Arrows
        paths={[
          ...[0, 1, 3, 4].map((i) => ({ d: `M${x(i) + W + 3} ${y(i) + 26} Q${x(i) + W + 13} ${y(i) + 20} ${x(i + 1) - 3} ${y(i) + 26}`, accent: i === 4 })),
          { d: `M${x(2) + W / 2} ${y(2) + 58} C${x(2) + W / 2} 270 ${x(3) + W / 2 + 40} 240 ${x(3) + W / 2} ${y(3) - 6}`, accent: true },
        ]}
      />
      <Pin x={18} y={372} w={260} rotate={-2}>
        <Hand size={SIZE.label}>{t({ es: '↑ no antes de mirar horas', en: '↑ not before browsing slots' })}</Hand>
      </Pin>
      <Pin x={30} y={440} w={340} rotate={-1.5}>
        <BigSticky color="orange">{t(p.body)}</BigSticky>
      </Pin>
      <Pin x={110} y={590} w={260} rotate={2}>
        <BigSticky color="pink">{t(impact.closed[1])}</BigSticky>
      </Pin>
    </Board>
  )
}

/** En el mismo orden que NOTEBOOK_PAGES */
export const NOTEBOOK_PAGES_NARROW: readonly (() => JSX.Element)[] = [CoverPageNarrow, ReturnPageNarrow, NewPageNarrow, ClipperPageNarrow, ChoosePageNarrow, IdentityPageNarrow]

'use client'

import Image from 'next/image'
import { useLocale, type L } from '@/lib/i18n'
import { useA11y } from '@/lib/a11y'
import { PhoneBody, StatusBar } from '@/components/case/kit/device'
import { ClipperOrb } from '../clipper-orb'
import { useTick } from '../thema/live-pieces'
import { AI_GRADIENT } from './clipper-pieces'
import { useNarrow } from '../use-narrow'

const GOLD = '#d9b36a'

function useStep(ms: number, steps: number): number {
  const { reducedMotion } = useA11y()
  const tick = useTick(ms)
  return reducedMotion ? steps - 2 : tick % steps
}

function Show({ on, children, className = '' }: { on: boolean; children: React.ReactNode; className?: string }) {
  return <div className={`transition-all duration-500 ease-expo ${on ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'} ${className}`}>{children}</div>
}

/** Anillo que late sobre lo que hay que mirar. */
function Pulse({ x, y, w, h, on }: { x: number; y: number; w: number; h: number; on: boolean }) {
  return (
    <span className={`pointer-events-none absolute rounded-lg ring-2 ring-signal transition-opacity duration-300 ${on ? 'opacity-100' : 'opacity-0'}`} style={{ left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%` }} aria-hidden="true">
      {on && <span className="absolute inset-0 animate-[tap-ping_1.4s_ease-out_infinite] rounded-lg ring-2 ring-signal" />}
    </span>
  )
}

/* ── Laptop: la plataforma real y el panel de Clipper que entra ─────────── */

const LAPTOP_STEPS = 8
const LEGEND: readonly { at: number; title: L; body: L }[] = [
  { at: 0, title: { es: 'Desde cualquier pantalla', en: 'From any screen' }, body: { es: 'El botón de Clipper vive arriba, en la plataforma.', en: 'Clipper’s button lives at the top of the platform.' } },
  { at: 1, title: { es: 'Un panel, no otra página', en: 'A panel, not another page' }, body: { es: 'Entra por el lado y deja ver lo que estabas mirando.', en: 'It slides in from the side and keeps what you were looking at in view.' } },
  { at: 3, title: { es: 'Dice qué consultó', en: 'It says what it looked up' }, body: { es: 'Cada cifra trae la herramienta de la que salió.', en: 'Every figure carries the tool it came from.' } },
  { at: 5, title: { es: 'Propone con antes y después', en: 'Proposes with before and after' }, body: { es: 'Y avisa si choca con otra cita. Aplica una persona.', en: 'And warns if it clashes with another visit. A person applies.' } },
]

function Laptop({ step }: { step: number }) {
  const { t } = useLocale()
  const open = step >= 1 && step <= 6
  // Sigue «Aplicada» mientras el panel sale (paso 7): no cambia de texto a media salida.
  const applied = step >= 6
  // En el celular se hace zoom a la mitad derecha de la pantalla: el panel de Clipper ocupa casi todo y se lee.
  const narrow = useNarrow()
  return (
    <div data-reveal="device">
      {/* Pantalla con bisel y cámara */}
      <div className="relative mx-auto rounded-t-[18px] bg-[#0b0c0e] p-[1.4%] pb-[2%] shadow-[0_50px_90px_-35px_rgba(0,0,0,0.75),inset_0_0_0_1.5px_rgba(255,255,255,0.12)]">
        <span className="absolute left-1/2 top-[0.6%] h-[5px] w-[5px] -translate-x-1/2 rounded-full bg-[#23252b]" aria-hidden="true" />
        <div className="relative overflow-hidden rounded-[6px] max-sm:aspect-[4/5]">
          <Image src="/cases/barberlytics/role-owner-metrics.webp" width={2000} height={1250} alt={t({ es: 'Métricas del dueño en la plataforma, con el panel de Clipper abierto.', en: 'Owner metrics in the platform, with the Clipper panel open.' })} sizes="(min-width: 1024px) 60vw, 100vw" className={`block h-auto w-full transition-[filter] duration-700 max-sm:h-full max-sm:object-cover max-sm:object-right-top ${open ? 'brightness-[0.55]' : ''}`} />
          <Pulse x={narrow ? 63 : 81.5} y={11.4} w={narrow ? 14.4 : 7.2} h={4.6} on={step === 0} />

          {/* El panel de Clipper */}
          <aside className={`absolute inset-y-0 right-0 flex w-[38%] flex-col border-l border-white/10 bg-[#141210]/95 p-[1.4%] max-sm:w-[86%] max-sm:p-3 text-[#efe9dd] backdrop-blur transition-transform duration-700 ease-expo ${open ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="flex items-center gap-2 border-b border-white/10 pb-2">
              <ClipperOrb size={20} state={step === 2 ? 'thinking' : 'idle'} />
              <span className="bg-clip-text text-[clamp(9px,1vw,13px)] font-medium max-sm:text-[14px] text-transparent" style={{ backgroundImage: AI_GRADIENT }}>Clipper</span>
              <span className="ml-auto text-[clamp(8px,0.8vw,10px)] text-white/40 max-sm:text-[11px]">{t({ es: 'Dueño', en: 'Owner' })}</span>
            </div>
            <div className="flex min-h-0 flex-1 flex-col justify-end gap-[2.5%] overflow-hidden py-1.5 text-[clamp(7px,0.72vw,11px)] leading-snug max-sm:text-[12.5px]">
              <Show on={step >= 2} className="ml-auto max-w-[88%]">
                <p className="rounded-xl rounded-tr-sm bg-white/[0.09] px-2.5 py-1.5">{t({ es: 'Pásale la de Santiago a la tarde con Lorena', en: 'Move Santiago’s to the afternoon with Lorena' })}</p>
              </Show>
              <Show on={step >= 3}>
                <span className="inline-flex items-center gap-1 rounded-full border border-[#2e9cb0]/40 bg-[#2e9cb0]/10 px-2 py-0.5 font-mono text-[0.85em] text-[#7fd3e3]">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#7fd3e3]" />
                  {t({ es: 'Consultó · Agenda de Lorena', en: 'Looked up · Lorena’s schedule' })}
                </span>
              </Show>
              <Show on={step >= 4}>
                <div className="relative rounded-xl border border-white/15 bg-[#1c1916] p-2">
                  <p className="flex justify-between text-[0.85em] text-white/50"><span>{t({ es: 'Mover la cita', en: 'Move the visit' })}</span><span>{applied ? t({ es: 'Aplicada', en: 'Applied' }) : t({ es: 'Propuesta', en: 'Proposal' })}</span></p>
                  <p className="mt-1">Santiago Jiménez · <span className="text-white/40 line-through">10:15</span> → <span style={{ color: '#e9c27a' }}>4:30 p. m.</span></p>
                  <p className="mt-0.5"><span className="text-white/40 line-through">Andrés</span> → Lorena</p>
                  <p className={`relative mt-1 rounded-md bg-[#3a2a17] px-1.5 py-0.5 text-[0.9em] text-[#f2c48a] ${step === 5 ? 'ring-2 ring-signal' : ''}`}>
                    {t({ es: 'Choca con 16:30 · Camila Rodríguez', en: 'Clashes with 4:30 · Camila Rodríguez' })}
                  </p>
                  <div className="mt-1.5 flex gap-1.5">
                    <span className={`rounded-md px-2 py-0.5 font-semibold text-[#141210] transition-colors duration-500 ${step === 5 ? 'scale-95' : ''}`} style={{ background: applied ? '#4cc98d' : GOLD }}>
                      {applied ? `✓ ${t({ es: 'Aplicada', en: 'Applied' })}` : t({ es: 'Aplicar', en: 'Apply' })}
                    </span>
                    <span className="rounded-md border border-white/20 px-2 py-0.5">{applied ? t({ es: 'Deshacer', en: 'Undo' }) : t({ es: 'Descartar', en: 'Discard' })}</span>
                  </div>
                </div>
              </Show>
            </div>
            <div className="rounded-lg border border-white/10 px-2 py-1.5 text-[clamp(8px,0.8vw,11px)] text-white/35 max-sm:text-[12px]">{t({ es: 'Pregúntale a Clipper…', en: 'Ask Clipper…' })}</div>
          </aside>
        </div>
      </div>
      {/* Base de la laptop */}
      <div className="relative mx-auto h-[14px] w-[108%] -translate-x-[3.7%] rounded-b-[14px] bg-gradient-to-b from-[#2a2d33] to-[#16171a] shadow-[0_24px_40px_-14px_rgba(0,0,0,0.7)]" aria-hidden="true">
        <span className="absolute left-1/2 top-0 h-[5px] w-[14%] -translate-x-1/2 rounded-b-md bg-[#0b0c0e]" />
      </div>
    </div>
  )
}

/* ── Celular: Clipper en la reserva ────────────────────────────────────── */

const PHONE_STEPS = 6

function Phone({ step }: { step: number }) {
  const { t } = useLocale()
  const thread = step >= 3
  return (
    <div data-reveal="device" className="relative mx-auto w-full max-w-[270px]">
      <PhoneBody>
        <StatusBar />
        <div className="relative">
          <Image src="/cases/barberlytics/clipper-home.webp" width={780} height={1688} alt={t({ es: 'Clipper en la reserva: «¿Qué cita te agendo?» con atajos numerados.', en: 'Booking Clipper: “What should I book for you?” with numbered shortcuts.' })} sizes="270px" className={`block h-auto w-full transition-opacity duration-700 ${thread ? 'opacity-0' : 'opacity-100'}`} />
          <Image src="/cases/barberlytics/clipper-thread.webp" width={780} height={1688} alt={t({ es: 'Clipper saluda a Marcela y le propone horarios.', en: 'Clipper greets Marcela and proposes times.' })} sizes="270px" className={`absolute inset-0 block h-auto w-full transition-opacity duration-700 ${thread ? 'opacity-100' : 'opacity-0'}`} />
          <Pulse x={5} y={47} w={90} h={7} on={step === 1} />
          <Pulse x={5} y={23} w={90} h={9} on={step === 2} />
          <Pulse x={5} y={46} w={90} h={30} on={step === 4} />
        </div>
      </PhoneBody>
    </div>
  )
}

const PHONE_NOTES: readonly { at: number[]; text: L }[] = [
  { at: [0, 1], text: { es: 'Atajos numerados: «Lo de siempre» es el primero.', en: 'Numbered shortcuts: “The usual” comes first.' } },
  { at: [2], text: { es: 'Se pide con palabras, por escrito o por voz.', en: 'Ask in words, typed or spoken.' } },
  { at: [3, 4, 5], text: { es: 'Saluda por el nombre y propone horas para elegir.', en: 'Greets by name and proposes times to pick.' } },
]

/** 5.6 · Clipper en la plataforma (laptop) y en la reserva (celular), animados sobre pantallas reales. */
export function ClipperInPlatform() {
  const { t } = useLocale()
  const laptop = useStep(1500, LAPTOP_STEPS)
  const phone = useStep(1700, PHONE_STEPS)
  const legendAt = LEGEND.reduce((acc, l, i) => (laptop >= l.at ? i : acc), 0)

  return (
    <div className="space-y-16">
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
        <Laptop step={laptop} />
        <ol className="space-y-4">
          {LEGEND.map((l, i) => (
            <li key={l.title.es} className={`flex gap-4 border-l-2 pl-4 transition-colors duration-500 ${i === legendAt ? 'border-signal' : 'border-fg/15 opacity-55'}`}>
              <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-[11px] transition-colors duration-500 ${i === legendAt ? 'bg-signal text-paper' : 'bg-fg/10'}`}>{i + 1}</span>
              <span>
                <span className="block font-medium">{t(l.title)}</span>
                <span className="mt-1 block text-sm leading-relaxed opacity-70">{t(l.body)}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div className="grid items-center gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <Phone step={phone} />
        <div>
          <p className="mono-label mb-4 opacity-60">{t({ es: 'En la reserva', en: 'In booking' })}</p>
          <ul className="space-y-3">
            {PHONE_NOTES.map((n) => (
              <li key={n.text.es} className={`border-l-2 pl-4 text-lg font-light leading-snug transition-all duration-500 ${n.at.includes(phone) ? 'border-signal opacity-100' : 'border-fg/15 opacity-40'}`}>{t(n.text)}</li>
            ))}
          </ul>
          <div className="mt-8 hidden w-[80%] -rotate-2 overflow-hidden rounded-xl shadow-[0_30px_60px_-25px_rgba(0,0,0,0.6)] ring-1 ring-fg/15 sm:block">
            <Image src="/cases/barberlytics/clipper-action.webp" width={1040} height={730} alt={t({ es: 'Tarjeta de propuesta real: antes tachado, después al lado, aviso de choque.', en: 'Real proposal card: before struck through, after beside it, clash warning.' })} sizes="(min-width: 768px) 30vw, 80vw" className="block h-auto w-full" />
          </div>
          <p className="mt-2 hidden text-xs opacity-60 sm:block">{t({ es: 'La tarjeta de propuesta real, tal como sale en la plataforma.', en: 'The real proposal card, as it appears in the platform.' })}</p>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useLocale, type L } from '@/lib/i18n'
import { useA11y } from '@/lib/a11y'
import { CLIPPER_CASE } from '@/lib/content/cases/barberlytics/clipper-case'
import { ClipperOrb } from '../clipper-orb'
import { useTick } from '../thema/live-pieces'
import { AI_GRADIENT, Wave } from './clipper-pieces'

const RED = '#ff6b72'

function useStep(ms: number, steps: number): number {
  const { reducedMotion } = useA11y()
  const tick = useTick(ms)
  return reducedMotion ? steps - 1 : tick % steps
}

/* ── La carcasa sin cerebro, y lo que costaba responder a mano ─────────── */

/** Izquierda: el panel se ve de primera, pero la pregunta se queda sin respuesta. */
function EmptyShell({ step }: { step: number }) {
  const { t } = useLocale()
  const asked = step >= 1
  const thinking = step >= 2 && step < 5
  const failed = step >= 5
  return (
    <div className="relative flex h-full flex-col rounded-2xl border border-white/10 bg-[#141210] p-5">
      <div className="flex items-center gap-2">
        <ClipperOrb size={26} state={thinking ? 'thinking' : 'idle'} />
        <span className="bg-clip-text text-sm font-medium text-transparent" style={{ backgroundImage: AI_GRADIENT }}>Clipper</span>
        <span className="ml-auto flex gap-1.5 text-[10px] text-white/40">
          <span className="rounded-full border border-white/10 px-2 py-0.5">{t({ es: 'Historial', en: 'History' })}</span>
          <span className="rounded-full border border-white/10 px-2 py-0.5">{t({ es: 'Voz', en: 'Voice' })}</span>
        </span>
      </div>
      <div className="mt-5 flex flex-1 flex-col justify-end gap-3">
        <p className={`ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-white/[0.08] px-3.5 py-2.5 text-sm transition-all duration-500 ${asked ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}>
          {t({ es: '¿Cuánto llevo cobrado hoy?', en: 'How much have I collected today?' })}
        </p>
        <div className={`flex items-center gap-2 transition-opacity duration-300 ${thinking ? 'opacity-100' : 'opacity-0'}`}>
          <Wave active={thinking} bars={10} />
          <span className="font-mono text-[11px] text-white/45">{t({ es: 'pensando…', en: 'thinking…' })}</span>
        </div>
        <p className={`max-w-[85%] rounded-2xl rounded-tl-sm border px-3.5 py-2.5 text-sm transition-all duration-500 ${failed ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`} style={{ borderColor: `${RED}66`, color: RED }}>
          {t({ es: 'No pude responder. Intenta de nuevo.', en: 'I couldn’t answer. Try again.' })}
        </p>
      </div>
      <div className="mt-4 flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-[12px] text-white/35">
        {t({ es: 'Pregúntale a Clipper…', en: 'Ask Clipper…' })}
        <span className="ml-auto h-6 w-6 rounded-full" style={{ backgroundImage: AI_GRADIENT }} aria-hidden="true" />
      </div>
      <span className="absolute -top-3 left-5 rounded-full bg-[#0b0c0e] px-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/50">{t({ es: 'La carcasa', en: 'The shell' })}</span>
    </div>
  )
}

const SCREENS: readonly { name: L; line: L; x: string; y: string }[] = [
  { name: { es: 'Caja', en: 'Till' }, line: { es: 'Cobrado hoy · US$ 658', en: 'Collected today · US$ 658' }, x: '0%', y: '0%' },
  { name: { es: 'Agenda', en: 'Schedule' }, line: { es: 'Mateo · 4:00 · va tarde', en: 'Mateo · 4:00 · running late' }, x: '16%', y: '30%' },
  { name: { es: 'Clientes', en: 'Clients' }, line: { es: 'Gael vuelve en 3 semanas', en: 'Gael is due in 3 weeks' }, x: '32%', y: '60%' },
]

/** Derecha: lo que hacía recepción mientras tanto, una pantalla tras otra. */
function ThreeScreens({ step }: { step: number }) {
  const { t } = useLocale()
  const open = Math.min(Math.max(step - 1, 0), SCREENS.length)
  return (
    <div className="relative h-full min-h-[300px]">
      {SCREENS.map((s, i) => (
        <div
          key={s.name.es}
          className={`absolute w-[68%] rounded-xl border border-white/10 bg-[#1b1916] shadow-[0_24px_50px_-20px_rgba(0,0,0,0.9)] transition-all duration-500 ease-expo ${i < open ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
          style={{ left: s.x, top: s.y }}
        >
          <div className="flex items-center gap-1.5 border-b border-white/[0.07] px-3 py-2" aria-hidden="true">
            <span className="h-2 w-2 rounded-full bg-white/20" />
            <span className="h-2 w-2 rounded-full bg-white/20" />
            <span className="ml-2 text-[11px] text-white/70">{t(s.name)}</span>
          </div>
          <div className="space-y-1.5 p-3">
            <span className="block h-1.5 w-[70%] rounded-full bg-white/10" />
            <p className="text-[12px] text-white/85">{t(s.line)}</p>
            <span className="block h-1.5 w-[45%] rounded-full bg-white/10" />
          </div>
        </div>
      ))}
      <div className="absolute bottom-0 right-0 text-right">
        <p className="text-5xl font-light tabular-nums text-white">{open}</p>
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">{t({ es: 'pantallas para una respuesta', en: 'screens for one answer' })}</p>
      </div>
    </div>
  )
}

function ShellVsDesk() {
  const { t } = useLocale()
  const step = useStep(900, 8)
  return (
    <div data-reveal="device" className="mt-14 grid gap-8 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-stretch">
      <EmptyShell step={step} />
      <div className="flex items-center justify-center md:flex-col">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">{t({ es: 'mientras tanto', en: 'meanwhile' })}</span>
      </div>
      <ThreeScreens step={step} />
    </div>
  )
}

/* ── Lo que vimos, cada hallazgo en su escena ──────────────────────────── */

/** 01 · El botón promete IA y debajo hay una regla fija. */
function FakeAi() {
  const { t } = useLocale()
  const step = useStep(1300, 3)
  const peeled = step >= 1
  return (
    <div className="relative flex h-full flex-col items-center justify-end gap-3 pb-2">
      <div className="relative h-11 w-[230px]">
        <code className="absolute inset-0 flex items-center justify-center rounded-lg border border-dashed border-white/20 font-mono text-[11px] text-white/70">if (sábado) return «lleno»</code>
        <span
          className="absolute inset-0 flex items-center justify-center rounded-lg text-sm font-semibold text-[#16130f] transition-transform duration-700 ease-expo"
          style={{ backgroundImage: AI_GRADIENT, transform: peeled ? 'translate(6%, -108%) rotate(-4deg)' : 'none' }}
        >
          ✦ {t({ es: 'Sugerencia con IA', en: 'AI suggestion' })}
        </span>
      </div>
      <p className={`font-mono text-[10px] uppercase tracking-[0.14em] transition-opacity duration-500 ${step >= 2 ? 'opacity-100' : 'opacity-0'}`} style={{ color: RED }}>
        {t({ es: 'debajo · una regla fija', en: 'underneath · a fixed rule' })}
      </p>
    </div>
  )
}

/** 02 · Se le pregunta por el negocio y responde con el centro de ayuda. */
function NoData() {
  const { t } = useLocale()
  const step = useStep(1200, 3)
  return (
    <div className="flex h-full flex-col justify-center gap-2 text-[12px]">
      <p className="ml-auto rounded-2xl rounded-tr-sm bg-white/[0.08] px-3 py-2">{t({ es: '¿Quién va tarde hoy?', en: 'Who’s late today?' })}</p>
      <p className={`max-w-[90%] rounded-2xl rounded-tl-sm border border-white/10 px-3 py-2 text-white/60 transition-all duration-500 ${step >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}>
        {t({ es: 'Puedes ver tus citas en la sección Calendario. ', en: 'You can see your visits in the Calendar section. ' })}
        <span className="underline">{t({ es: 'Centro de ayuda ›', en: 'Help center ›' })}</span>
      </p>
      <p className={`font-mono text-[10px] uppercase tracking-[0.14em] transition-opacity duration-500 ${step >= 2 ? 'opacity-100' : 'opacity-0'}`} style={{ color: RED }}>
        {t({ es: 'ni un dato del negocio', en: 'not one business fact' })}
      </p>
    </div>
  )
}

/** 03 · O callan o se pasan: la aguja salta entre los extremos y el medio queda vacío. */
function Extremes() {
  const { t } = useLocale()
  const step = useStep(1100, 4)
  const pos = step === 3 ? 50 : step % 2 === 0 ? 6 : 94
  return (
    <div className="flex h-full flex-col justify-center gap-4">
      <div className="relative h-2 rounded-full bg-white/10">
        <span className="absolute inset-y-0 left-[35%] w-[30%] rounded-full transition-opacity duration-500" style={{ backgroundImage: AI_GRADIENT, opacity: step === 3 ? 1 : 0.2 }} />
        <span className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#0b0c0e] bg-white transition-[left] duration-700 ease-expo" style={{ left: `${pos}%` }} />
      </div>
      <div className="grid grid-cols-3 gap-2 text-[11px]">
        <p className={step % 2 === 0 && step !== 3 ? 'text-white' : 'text-white/40'}>«{t({ es: 'No entendí', en: 'I didn’t get that' })}»</p>
        <p className={`text-center ${step === 3 ? 'text-white' : 'text-white/30'}`}>{t({ es: 'Propone · una persona aplica', en: 'Proposes · a person applies' })}</p>
        <p className={`text-right ${step === 1 ? 'text-white' : 'text-white/40'}`}>«{t({ es: 'Moví 3 citas', en: 'Moved 3 visits' })}»</p>
      </div>
    </div>
  )
}

const SCENES = [FakeAi, NoData, Extremes]

/** 01 · Los puntos de Clipper: la carcasa sin cerebro, la recepción haciendo el trabajo a mano y lo que faltaba en el sector. */
export function ClipperDots() {
  const { t } = useLocale()
  const { dots } = CLIPPER_CASE
  return (
    <div>
      <p data-reveal="mask" className="max-w-[24ch] text-[clamp(1.8rem,1rem+2.6vw,3.4rem)] font-light leading-[1.08] tracking-tight">{t(dots.kicker)}</p>
      <p data-reveal className="mt-8 max-w-[62ch] text-lg leading-relaxed opacity-80">{t(dots.lead)}</p>

      <ShellVsDesk />

      <p data-reveal className="mono-label mb-6 mt-20 opacity-60">{t({ es: 'Lo que vimos', en: 'What we saw' })}</p>
      <ol className="grid gap-4 md:grid-cols-3">
        {dots.seen.map((s, i) => {
          const Scene = SCENES[i]
          return (
            <li key={s.title.es} data-reveal className={`flex flex-col border border-fg/15 ${i === 1 ? 'md:translate-y-8' : ''}`}>
              <div className="h-[160px] border-b border-fg/10 bg-white/[0.02] p-5">{Scene && <Scene />}</div>
              <div className="p-5">
                <span className="mono-label text-signal">0{i + 1}</span>
                <p className="mt-2 text-lg leading-snug">{t(s.title)}</p>
                <p className="mt-2 text-sm leading-relaxed opacity-70">{t(s.body)}</p>
              </div>
            </li>
          )
        })}
      </ol>

      <dl className="mt-20 grid grid-cols-2 gap-8 lg:grid-cols-4">
        {dots.stats.map((s) => (
          <div key={s.label.es} data-reveal>
            <dt className="sr-only">{t(s.label)}</dt>
            <dd>
              <span data-count={s.value} className="block text-[clamp(2.4rem,1.6rem+2.4vw,3.8rem)] font-light leading-none text-signal tabular-nums">{s.value}</span>
              <span className="mt-3 block text-sm leading-snug opacity-70">{t(s.label)}</span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

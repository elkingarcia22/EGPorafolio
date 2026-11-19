'use client'

import { useEffect, useRef, useState } from 'react'
import { useLocale, type L } from '@/lib/i18n'
import { useA11y } from '@/lib/a11y'
import { PhoneBody, StatusBar } from '@/components/case/kit/device'
import { ClipperOrb } from '../clipper-orb'
import { useTick } from '../thema/live-pieces'
import { AI_GRADIENT } from './clipper-pieces'

/* Réplica del modo voz de Barberlytics (ChatVoiceMode): ondas en lienzo con el gradiente de IA,
   lo dicho en grande, la respuesta debajo y la píldora con micrófono, estado, «Escribir» y enviar. */

type WaveState = 'listening' | 'thinking' | 'idle'
type Status = 'listening' | 'thinking' | 'speaking' | 'answered'

const STOPS: Record<number, string> = { 1: '#f0ce86', 2: '#de8c3a', 3: '#2e9cb0', 5: '#3f72d8' }
const MOTION: Record<WaveState, { amplitude: number; speed: number }> = {
  listening: { amplitude: 0.55, speed: 1 },
  thinking: { amplitude: 0.3, speed: 2.4 },
  idle: { amplitude: 0.06, speed: 0.35 },
}
const LAYERS = [
  { frequency: 1.6, speed: 1.1, scale: 1, width: 2.4, alpha: 0.9, stops: [1, 2, 3] },
  { frequency: 2.3, speed: -0.8, scale: 0.8, width: 1.8, alpha: 0.7, stops: [2, 3, 5] },
  { frequency: 1.1, speed: 0.6, scale: 0.65, width: 1.6, alpha: 0.6, stops: [5, 1, 2] },
  { frequency: 2.9, speed: -1.4, scale: 0.45, width: 1.2, alpha: 0.5, stops: [3, 5, 1] },
] as const
const POINTS = 100

/** Las ondas del modo voz: cuatro curvas superpuestas que se levantan cuando llega voz. */
function VoiceWaves({ state, pulse, className = '' }: { state: WaveState; pulse: unknown; className?: string }) {
  const { reducedMotion } = useA11y()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const target = useRef(MOTION[state])
  const boost = useRef(0)
  useEffect(() => {
    target.current = MOTION[state]
  }, [state])
  useEffect(() => {
    boost.current = Math.min(1, boost.current + 0.45)
  }, [pulse])
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    let amplitude = target.current.amplitude
    let speed = target.current.speed
    let phase = 0
    let frame = 0
    let last = performance.now()
    const resize = () => {
      const ratio = window.devicePixelRatio || 1
      const { width, height } = canvas.getBoundingClientRect()
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      amplitude += (target.current.amplitude + boost.current * 0.35 - amplitude) * 0.06
      speed += (target.current.speed - speed) * 0.06
      boost.current *= 0.92
      phase += dt * speed * 2.2
      const { width, height } = canvas.getBoundingClientRect()
      const middle = height / 2
      ctx.clearRect(0, 0, width, height)
      ctx.globalCompositeOperation = 'lighter'
      LAYERS.forEach((layer, index) => {
        const gradient = ctx.createLinearGradient(0, 0, width, 0)
        gradient.addColorStop(0, STOPS[layer.stops[0]])
        gradient.addColorStop(0.5, STOPS[layer.stops[1]])
        gradient.addColorStop(1, STOPS[layer.stops[2]])
        const peak = middle * 0.9 * amplitude * layer.scale
        const curve = new Path2D()
        for (let p = 0; p <= POINTS; p += 1) {
          const t = p / POINTS
          const envelope = Math.sin(Math.PI * t) ** 2
          const wobble = Math.sin(phase * 0.7 + index) * 0.25 + 1
          const y = middle + Math.sin(t * Math.PI * 2 * layer.frequency + phase * layer.speed + index * 1.3) * peak * envelope * wobble
          if (p === 0) curve.moveTo(t * width, y)
          else curve.lineTo(t * width, y)
        }
        const body = new Path2D(curve)
        body.lineTo(width, middle)
        body.lineTo(0, middle)
        body.closePath()
        ctx.globalAlpha = layer.alpha * 0.18
        ctx.fillStyle = gradient
        ctx.fill(body)
        ctx.globalAlpha = layer.alpha
        ctx.lineWidth = layer.width
        ctx.strokeStyle = gradient
        ctx.stroke(curve)
      })
      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = 'source-over'
      if (!reducedMotion) frame = requestAnimationFrame(draw)
    }
    draw(last)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [reducedMotion])
  return (
    <div className={`relative ${className}`} aria-hidden="true">
      <div className="pointer-events-none absolute inset-x-[15%] inset-y-[20%] rounded-full bg-[radial-gradient(closest-side,rgba(222,140,58,0.35),rgba(240,206,134,0.15)_55%,transparent)]" />
      <canvas ref={canvasRef} className="relative h-full w-full" />
    </div>
  )
}

/* ── Guiones: lo que pasa en cada momento de la llamada y del dictado ───── */

interface Beat {
  status: Status
  heard: string
  reply?: L
  followups?: readonly L[]
  note: number
}

const SAID = 'corte para Martín mañana a las 4 con Nicolás'
const CALL: readonly Beat[] = [
  { status: 'speaking', heard: '', reply: { es: '¡Hola! Soy Clipper. ¿Qué cita te agendo?', en: 'Hi! I’m Clipper. What should I book for you?' }, note: 1 },
  { status: 'listening', heard: 'corte para Martín', note: 0 },
  { status: 'listening', heard: 'corte para Martín mañana a las', note: 0 },
  { status: 'listening', heard: 'corte para Martín mañana a las', note: 0 },
  { status: 'listening', heard: SAID, note: 0 },
  { status: 'thinking', heard: SAID, note: 2 },
  { status: 'speaking', heard: '', reply: { es: '¡Listo, Martín! Nicolás te espera mañana a las 4. ¿Te lo confirmo?', en: 'Done, Martín! Nicolás will see you tomorrow at 4. Shall I confirm?' }, followups: [{ es: 'Sí, confírmala', en: 'Yes, confirm' }, { es: 'Otra hora', en: 'Another time' }], note: 1 },
  { status: 'speaking', heard: '', reply: { es: '¡Listo, Martín! Nicolás te espera mañana a las 4. ¿Te lo confirmo?', en: 'Done, Martín! Nicolás will see you tomorrow at 4. Shall I confirm?' }, followups: [{ es: 'Sí, confírmala', en: 'Yes, confirm' }, { es: 'Otra hora', en: 'Another time' }], note: 2 },
]

const DICTATED = '¿cuánto llevo cobrado hoy?'
const DICTATION: readonly Beat[] = [
  { status: 'listening', heard: '', note: 3 },
  { status: 'listening', heard: '¿cuánto llevo', note: 0 },
  { status: 'listening', heard: DICTATED, note: 0 },
  { status: 'thinking', heard: DICTATED, note: 3 },
  { status: 'answered', heard: DICTATED, reply: { es: 'Llevas US$ 658 cobrados de US$ 2.676 del día. Faltan 4 citas por cobrar.', en: 'You’ve collected US$ 658 of today’s US$ 2,676. 4 visits left to charge.' }, followups: [{ es: '¿Quién falta por cobrar?', en: 'Who’s left to charge?' }], note: 3 },
  { status: 'answered', heard: DICTATED, reply: { es: 'Llevas US$ 658 cobrados de US$ 2.676 del día. Faltan 4 citas por cobrar.', en: 'You’ve collected US$ 658 of today’s US$ 2,676. 4 visits left to charge.' }, followups: [{ es: '¿Quién falta por cobrar?', en: 'Who’s left to charge?' }], note: 3 },
]

function Icon({ name }: { name: 'mic' | 'pause' | 'send' | 'edit' | 'back' }) {
  const d = {
    mic: 'M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zM5 11a7 7 0 0 0 14 0M12 18v3',
    pause: 'M9 5v14M15 5v14',
    send: 'M5 12h14M13 6l6 6-6 6',
    edit: 'M4 20h4L19 9l-4-4L4 16zM14 6l4 4',
    back: 'M19 12H5M11 6l-6 6 6 6',
  }[name]
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  )
}

/** La pantalla del modo voz, tal como se ve: cabecera, ondas, lo dicho, la respuesta y la píldora. */
function VoiceScreen({ beat, seconds, compact, call }: { beat: Beat; seconds: number; compact: boolean; call: boolean }) {
  const { t } = useLocale()
  const active = beat.status === 'listening' || beat.status === 'speaking'
  const wave: WaveState = beat.status === 'thinking' ? 'thinking' : active ? 'listening' : 'idle'
  const label =
    beat.status === 'listening' ? t({ es: 'Te escucho · español', en: 'Listening · Spanish' })
    : beat.status === 'speaking' ? t({ es: 'Clipper responde', en: 'Clipper is answering' })
    : t({ es: 'En pausa · español', en: 'Paused · Spanish' })
  const hint =
    beat.status === 'listening' ? t({ es: 'haz una pausa y sigo esperando', en: 'pause and I’ll keep waiting' })
    : beat.status === 'speaking' ? t({ es: 'toca el micrófono para interrumpir', en: 'tap the mic to interrupt' })
    : beat.status === 'thinking' ? t({ es: 'estoy preparando la respuesta', en: 'preparing the answer' })
    : t({ es: 'toca el micrófono para seguir', en: 'tap the microphone to continue' })
  const title = beat.heard ? `«${beat.heard}»` : call && beat.reply ? t({ es: 'Te escucho.', en: 'I’m listening.' }) : t({ es: 'Di lo que necesitas y haz una pausa para que responda.', en: 'Say what you need and pause so I can answer.' })
  const canSend = beat.heard.length > 0
  const s = compact ? 'text-[10px]' : 'text-[12px]'

  return (
    <div className={`relative flex h-full flex-col overflow-hidden bg-[#121110] text-[#efe9dd] ${s}`}>
      {/* Fondo: en la reserva, la rejilla de puntos de Clipper; en el equipo, la malla de IA */}
      {call ? (
        <span className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_35%,#000_40%,transparent_100%)]" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.14) 1px, transparent 1px)', backgroundSize: '18px 18px' }} aria-hidden="true" />
      ) : (
        <span className="pointer-events-none absolute inset-0 animate-[aurora-drift_16s_ease-in-out_infinite]" style={{ backgroundImage: 'radial-gradient(55% 34% at 18% 0%, rgba(240,206,134,0.34), transparent 65%), radial-gradient(45% 30% at 55% 0%, rgba(222,140,58,0.22), transparent 65%), radial-gradient(50% 34% at 88% 0%, rgba(46,156,176,0.3), transparent 65%)' }} aria-hidden="true" />
      )}

      <header className="relative flex items-center gap-2 px-3 py-2.5">
        <span className="flex items-center gap-1.5 rounded-md px-1.5 py-1 text-white/75"><Icon name="back" /> {t({ es: 'Volver al chat', en: 'Back to chat' })}</span>
        <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-2.5 py-0.5 text-white/70">
          <span className={`h-1.5 w-1.5 rounded-full ${active ? 'animate-pulse bg-[#e5484d]' : 'bg-white/40'}`} />
          {active ? t({ es: 'Modo voz activo', en: 'Voice mode on' }) : t({ es: 'Micrófono en pausa', en: 'Microphone paused' })}
        </span>
      </header>

      <div className="relative flex flex-1 flex-col items-center justify-center gap-[4%] px-4 text-center">
        <VoiceWaves state={wave} pulse={beat.heard + beat.status} className={compact ? 'h-24 w-full' : 'h-20 w-full max-w-md'} />
        <p key={title} className={`max-w-[95%] animate-[ramp-in_0.4s_both] text-balance font-semibold tracking-tight ${compact ? 'text-[15px] leading-snug' : 'text-[18px] leading-tight'}`} aria-live="polite">
          {title}
        </p>
        {beat.reply && (
          <div key={t(beat.reply)} className="flex w-full max-w-md animate-[ramp-in_0.5s_cubic-bezier(0.16,1,0.3,1)_both] flex-col items-center gap-2.5">
            <div className="flex items-start gap-2 text-left">
              <span className="mt-0.5 shrink-0"><ClipperOrb size={compact ? 16 : 20} /></span>
              <p className="text-white/70">{t(beat.reply)}</p>
            </div>
            {beat.followups && (
              <div className="flex flex-wrap justify-center gap-1.5">
                {beat.followups.map((f) => <span key={f.es} className="rounded-full border border-white/20 px-2.5 py-1 text-white/80">{t(f)}</span>)}
              </div>
            )}
          </div>
        )}
      </div>

      {/* La píldora de abajo */}
      <div className="relative px-3 pb-3 pt-2">
        <div className="flex items-center gap-2 rounded-full border border-white/15 bg-[#1c1a17]/90 p-1.5 backdrop-blur">
          <span className={`flex shrink-0 items-center justify-center rounded-full ${compact ? 'h-7 w-7 text-[12px]' : 'h-9 w-9 text-[15px]'} ${beat.status === 'listening' ? 'bg-[#efe9dd] text-[#121110]' : 'border border-white/20 text-white/70'}`}>
            <Icon name={beat.status === 'listening' ? 'pause' : 'mic'} />
          </span>
          <span className="min-w-0 flex-1 text-left">
            <span className="block truncate font-medium">{label}</span>
            <span className="block truncate tabular-nums text-white/45">{`0:${String(seconds).padStart(2, '0')}`} · {hint}</span>
          </span>
          {!compact && <span className="flex items-center gap-1 rounded-full px-2 py-1 text-white/65"><Icon name="edit" /> {t({ es: 'Escribir', en: 'Write' })}</span>}
          <span className={`flex shrink-0 items-center justify-center rounded-full ${compact ? 'h-7 w-7 text-[12px]' : 'h-9 w-9 text-[15px]'} ${canSend ? 'text-[#121110]' : 'border border-white/15 text-white/35'}`} style={canSend ? { backgroundImage: AI_GRADIENT } : undefined}>
            <Icon name="send" />
          </span>
        </div>
      </div>
    </div>
  )
}

const NOTES: readonly { k: L; v: L }[] = [
  { k: { es: 'Escucha con paciencia', en: 'Listens patiently' }, v: { es: 'Una pausa de 1,6 s es «terminé». Si la frase queda abierta —«con», «a las»— espera el doble.', en: 'A 1.6 s pause means “done”. If the phrase is left open —“with”, “at”— it waits twice as long.' } },
  { k: { es: 'Habla como una llamada', en: 'Talks like a call' }, v: { es: 'En la reserva saluda, contesta en voz alta con la voz «Achird» de Gemini y vuelve a escuchar.', en: 'In booking it greets, answers aloud with Gemini’s “Achird” voice and listens again.' } },
  { k: { es: 'Se interrumpe con un toque', en: 'One tap interrupts' }, v: { es: 'Mientras habla, las ondas siguen cada palabra; tocar el micrófono la corta y vuelve a escuchar.', en: 'While it talks, the waves follow each word; tapping the mic cuts it and listens again.' } },
  { k: { es: 'En el equipo, dictado', en: 'In the team app, dictation' }, v: { es: 'Lo dicho se envía al chat y la respuesta llega escrita. La conversación por voz aquí está pendiente.', en: 'What’s said goes to the chat and the answer comes in writing. Voice conversation here is pending.' } },
]

/** 5.x · La voz: el modo voz real, en la reserva (llamada, en el celular) y en el equipo (dictado, en la laptop). */
export function ClipperVoice() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const [mode, setMode] = useState<'reserva' | 'equipo'>('reserva')
  const script = mode === 'reserva' ? CALL : DICTATION
  const tick = useTick(1500)
  const [origin, setOrigin] = useState(0)
  const i = reducedMotion ? script.length - 1 : (tick - origin + script.length * 100) % script.length
  const beat = script[i]
  const seconds = Math.round(i * 1.5)

  return (
    <div data-reveal="device" className="relative isolate overflow-hidden rounded-3xl bg-[#0f0d0b] p-5 text-[#efe9dd] md:p-8">
      <span className="pointer-events-none absolute -left-[10%] top-[10%] -z-10 h-[70%] w-[50%] animate-[aurora-drift_18s_ease-in-out_infinite] rounded-full bg-[#de8c3a] opacity-[0.14] blur-[90px]" aria-hidden="true" />
      <span className="pointer-events-none absolute -right-[8%] bottom-0 -z-10 h-[70%] w-[50%] animate-[aurora-drift_22s_ease-in-out_infinite_reverse] rounded-full bg-[#2e9cb0] opacity-[0.14] blur-[90px]" aria-hidden="true" />

      <div role="radiogroup" aria-label={t({ es: 'Dónde', en: 'Where' })} className="mb-8 flex w-fit rounded-lg bg-white/[0.06] p-0.5">
        {[
          { id: 'reserva' as const, label: { es: 'En la reserva · llamada', en: 'In booking · call' } },
          { id: 'equipo' as const, label: { es: 'En el equipo · dictado', en: 'In the team app · dictation' } },
        ].map((m) => (
          <button key={m.id} type="button" role="radio" aria-checked={mode === m.id} onClick={() => {
            setMode(m.id)
            setOrigin(tick)
          }} className="rounded-md px-3 py-1.5 text-xs text-white/65 transition-colors hover:text-white aria-checked:bg-[#d9b36a] aria-checked:text-[#16130f]">
            {t(m.label)}
          </button>
        ))}
      </div>

      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        {mode === 'reserva' ? (
          <div className="mx-auto w-full max-w-[290px]">
            <PhoneBody>
              <StatusBar />
              <div className="aspect-[9/17.5]"><VoiceScreen beat={beat} seconds={seconds} compact call /></div>
            </PhoneBody>
          </div>
        ) : (
          <div>
            <div className="relative rounded-t-[16px] bg-[#0b0c0e] p-[1.4%] pb-[2%] shadow-[0_50px_90px_-35px_rgba(0,0,0,0.75),inset_0_0_0_1.5px_rgba(255,255,255,0.12)]">
              <div className="aspect-[16/10] overflow-hidden rounded-[6px]"><VoiceScreen beat={beat} seconds={seconds} compact={false} call={false} /></div>
            </div>
            <div className="relative mx-auto h-[12px] w-[108%] -translate-x-[3.7%] rounded-b-[12px] bg-gradient-to-b from-[#2a2d33] to-[#16171a]" aria-hidden="true">
              <span className="absolute left-1/2 top-0 h-[4px] w-[14%] -translate-x-1/2 rounded-b-md bg-[#0b0c0e]" />
            </div>
          </div>
        )}
        <ul className="space-y-4 text-sm">
          {NOTES.map((n, k) => (
            <li key={n.k.es} className={`border-l-2 pl-4 transition-all duration-500 ${k === beat.note ? 'border-[#de8c3a] opacity-100' : 'border-white/10 opacity-45'}`}>
              <p className="font-medium">{t(n.k)}</p>
              <p className="mt-1 leading-relaxed text-white/60">{t(n.v)}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

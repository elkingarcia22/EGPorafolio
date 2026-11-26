'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { PhoneBody, StatusBar } from '@/components/case/kit/device'
import { CLIPPER_CASE } from '@/lib/content/cases/barberlytics/clipper-case'
import { ClipperOrb } from '../clipper-orb'
import { AI, Caption, Lead, useInView } from './clp-kit'
import { VoiceWaves, type WaveState } from './clp-voice-waves'

const VOICE = CLIPPER_CASE.voice
const GRADIENT = `linear-gradient(90deg,${AI.join(',')})`

/** Los momentos de la llamada: Clipper saluda, escucha, piensa y responde. */
type Phase = 'greet' | 'listen' | 'think' | 'reply' | 'rest'
/** Duración de cada momento cuando se ve sin sonido (ms) */
const SILENT_MS: Record<Phase, number> = { greet: 3800, listen: 3400, think: 1300, reply: 4200, rest: 2200 }
const NEXT: Record<Phase, Phase> = { greet: 'listen', listen: 'think', think: 'reply', reply: 'rest', rest: 'greet' }
/** Cada cuánto aparece una palabra de lo que dice el cliente (ms) */
const WORD_MS = 320
/** Cuántas letras dice por segundo, para seguirla si la voz no avisa cada palabra */
const CHARS_PER_S = 13

/** La llamada grabada con una voz de ElevenLabs (scripts/clipper-voice.mjs) */
const AUDIO_DIR = '/cases/barberlytics'
type VoiceLine = 'greeting' | 'reply'

const WAVE_OF: Record<Phase, WaveState> = { greet: 'speaking', listen: 'listening', think: 'thinking', reply: 'speaking', rest: 'idle' }

/** Cada palabra con la posición en que empieza (para iluminarla cuando se dice) */
const withOffsets = (text: string) => {
  const parts = text.split(' ')
  return parts.map((w, k) => ({ w, at: parts.slice(0, k).reduce((n, p) => n + p.length + 1, 0) }))
}

/** Voces de sistema que suenan a persona, y las de juguete que no */
const HUMAN = /paulina|m[oó]nica|jorge|juan|diego|sabina|dalia|samantha|daniel|karen/i
const NOVELTY = /grandma|grandpa|rocko|eddy|flo|reed|sandy|shelley|bad news|bells|bubbles|zarvox|whisper|trinoids|albert|jester|organ|cellos|wobble|superstar|boing/i

/** La voz más humana que tenga el navegador en ese idioma. */
function pickVoice(lang: 'es' | 'en'): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith(lang))
  if (!voices.length) return null
  const score = (v: SpeechSynthesisVoice) =>
    (/natural|neural|premium|enhanced|mejorada|siri/i.test(v.name) ? 8 : 0) +
    (/google|microsoft/i.test(v.name) ? 4 : 0) +
    (HUMAN.test(v.name) ? 3 : 0) +
    (NOVELTY.test(v.name) ? -10 : 0) +
    (lang === 'es' && /-(co|mx|us|419)/i.test(v.lang) ? 2 : 0) +
    (v.localService ? 0 : 1)
  return [...voices].sort((a, b) => score(b) - score(a))[0]
}

/**
 * 05 · Forma: la voz de Clipper. El modo voz real (ondas con el gradiente de
 * IA, lo dicho en grande y la píldora del micrófono) en una llamada de la
 * reserva. Se ve solo, en silencio; al tocar «Escuchar», Clipper habla.
 */
export function ClipperVoice() {
  const { t, locale } = useLocale()
  const { reducedMotion } = useA11y()
  const rootRef = useRef<HTMLDivElement>(null)
  const inView = useInView(rootRef)
  const [phase, setPhase] = useState<Phase>(reducedMotion ? 'reply' : 'greet')
  const [words, setWords] = useState(0)
  const [spoken, setSpoken] = useState(-1)
  const [talking, setTalking] = useState(false)
  const [canSpeak, setCanSpeak] = useState(false)
  const [note, setNote] = useState<number | null>(null)
  const run = useRef(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  /** Calla lo que esté sonando: la grabación o la voz del navegador */
  const silence = () => {
    audioRef.current?.pause()
    audioRef.current = null
    if ('speechSynthesis' in window) window.speechSynthesis.cancel()
  }

  const heard = t(VOICE.heard).split(' ')

  useEffect(() => {
    setCanSpeak(true)
    if ('speechSynthesis' in window) window.speechSynthesis.getVoices()
    return () => {
      audioRef.current?.pause()
      if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    }
  }, [])

  // Sin sonido: la llamada se repite sola mientras se ve
  useEffect(() => {
    if (talking || !inView || reducedMotion) return
    const id = window.setTimeout(() => setPhase((p) => NEXT[p]), SILENT_MS[phase])
    return () => window.clearTimeout(id)
  }, [phase, talking, inView, reducedMotion])

  // Lo que dice el cliente aparece palabra por palabra
  useEffect(() => {
    if (phase !== 'listen') {
      setWords(phase === 'think' ? heard.length : 0)
      return
    }
    setWords(0)
    const id = window.setInterval(() => setWords((w) => Math.min(heard.length, w + 1)), WORD_MS)
    return () => window.clearInterval(id)
  }, [phase, heard.length])

  /** Con la voz del navegador, si no hay grabación */
  const sayWithBrowser = useCallback(
    (text: string, onEnd: () => void, token: number) => {
      if (!('speechSynthesis' in window)) return onEnd()
      const u = new SpeechSynthesisUtterance(text)
      const lang = locale === 'en' ? 'en' : 'es'
      const voice = pickVoice(lang)
      if (voice) u.voice = voice
      u.lang = voice?.lang ?? (lang === 'es' ? 'es-CO' : 'en-US')
      u.rate = 1.02
      u.pitch = 1
      u.onboundary = (e) => {
        if (run.current === token) setSpoken((n) => Math.max(n, e.charIndex))
      }
      // Algunas voces no avisan palabra por palabra: se estima por el tiempo
      let clock = 0
      u.onstart = () => {
        const start = performance.now()
        clock = window.setInterval(() => {
          if (run.current !== token) return window.clearInterval(clock)
          setSpoken((n) => Math.max(n, Math.floor(((performance.now() - start) / 1000) * CHARS_PER_S)))
        }, 120)
      }
      const finish = () => {
        window.clearInterval(clock)
        if (run.current === token) {
          setSpoken(text.length)
          onEnd()
        }
      }
      u.onend = finish
      u.onerror = finish
      window.speechSynthesis.speak(u)
    },
    [locale],
  )

  /** Con la llamada grabada; si no carga, con la voz del navegador. */
  const say = useCallback(
    (line: VoiceLine, onEnd: () => void, token: number) => {
      const text = t(VOICE[line])
      const audio = new Audio(`${AUDIO_DIR}/clipper-voice-${line}-${locale === 'en' ? 'en' : 'es'}.mp3`)
      audioRef.current = audio
      let clock = 0
      const finish = () => {
        window.clearInterval(clock)
        if (run.current === token) {
          setSpoken(text.length)
          onEnd()
        }
      }
      audio.onplaying = () => {
        // Las palabras se encienden al ritmo de la grabación
        clock = window.setInterval(() => {
          if (run.current !== token || !audio.duration) return
          setSpoken(Math.floor((audio.currentTime / audio.duration) * text.length))
        }, 90)
      }
      audio.onended = finish
      audio.onerror = () => {
        if (run.current === token) sayWithBrowser(text, onEnd, token)
      }
      audio.play().catch(() => {
        if (run.current === token) sayWithBrowser(text, onEnd, token)
      })
    },
    [locale, t, sayWithBrowser],
  )

  /** La llamada con sonido: saluda, escucha, piensa y responde en voz alta. */
  const listen = () => {
    if (!canSpeak) return
    silence()
    const token = ++run.current
    setTalking(true)
    setSpoken(-1)
    setPhase('greet')
    say('greeting', () => {
      setPhase('listen')
      window.setTimeout(() => {
        if (run.current !== token) return
        setPhase('think')
        window.setTimeout(() => {
          if (run.current !== token) return
          setSpoken(-1)
          setPhase('reply')
          say('reply', () => {
            setPhase('rest')
            setTalking(false)
          }, token)
        }, SILENT_MS.think)
      }, heard.length * WORD_MS + 900)
    }, token)
  }

  const stop = () => {
    run.current += 1
    silence()
    setTalking(false)
    setPhase('rest')
  }

  const line = phase === 'greet' ? t(VOICE.greeting) : phase === 'reply' || phase === 'rest' ? t(VOICE.reply) : ''
  const title = phase === 'listen' || phase === 'think' ? `«${heard.slice(0, words).join(' ')}${words < heard.length ? '…' : ''}»` : phase === 'greet' ? t({ es: 'Te escucho.', en: 'I’m listening.' }) : `«${t(VOICE.heard)}»`
  const status =
    phase === 'listen' ? t({ es: 'Te escucho · español', en: 'Listening · Spanish' })
    : phase === 'think' ? t({ es: 'Preparando la respuesta', en: 'Preparing the answer' })
    : phase === 'rest' ? t({ es: 'Toca el micrófono para seguir', en: 'Tap the mic to continue' })
    : t({ es: 'Clipper responde', en: 'Clipper is answering' })

  const caption =
    note !== null
      ? { id: `n${note}`, tag: t(VOICE.notes[note].k), title: t(VOICE.notes[note].v) }
      : { id: 'voz', tag: t({ es: 'La voz de Clipper', en: 'Clipper’s voice' }), title: t({ es: 'Agendar hablando, como una llamada a la barbería.', en: 'Booking by talking, like calling the shop.' }) }

  return (
    <div ref={rootRef}>
      <Caption {...caption} />
      <Lead>{t({ es: 'Saluda, escucha con paciencia y contesta en voz alta. Las ondas siguen cada palabra.', en: 'It greets, listens patiently and answers aloud. The waves follow every word.' })}</Lead>

      <div className="mx-auto mt-10 grid max-w-[980px] items-center gap-10 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)] lg:gap-16">
        {/* El modo voz, tal como se ve en el celular */}
        <div className="mx-auto w-full max-w-[290px]">
          <PhoneBody>
            <StatusBar />
            <div className="relative flex aspect-[9/17.5] flex-col overflow-hidden bg-[#121110] text-[12px] text-[#efe9dd]">
              <span className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_35%,#000_40%,transparent_100%)]" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.14) 1px, transparent 1px)', backgroundSize: '18px 18px' }} aria-hidden="true" />
              <header className="relative flex items-center gap-2 px-3 py-2.5">
                <ClipperOrb size={22} state={phase === 'think' ? 'thinking' : phase === 'rest' ? 'idle' : 'listening'} />
                <span className="font-medium">Clipper</span>
                <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-2.5 py-0.5 text-[11px] text-white/70 sm:text-[10px]">
                  <span className={`h-1.5 w-1.5 rounded-full ${phase !== 'rest' ? 'animate-pulse bg-[#e5484d]' : 'bg-white/40'}`} />
                  {phase !== 'rest' ? t({ es: 'Modo voz activo', en: 'Voice mode on' }) : t({ es: 'En pausa', en: 'Paused' })}
                </span>
              </header>
              <div className="relative flex flex-1 flex-col items-center justify-center gap-5 px-4 text-center">
                <VoiceWaves state={WAVE_OF[phase]} pulse={`${phase}-${words}-${spoken}`} className="h-28 w-full" />
                <p key={phase === 'listen' ? 'l' : title} className="clp-fade min-h-[3em] text-balance text-[16px] font-semibold leading-snug tracking-tight" aria-live="polite">
                  {title}
                </p>
                {line && (
                  <div key={line} className="clp-fade flex items-start gap-2 text-left">
                    <span className="mt-0.5 shrink-0"><ClipperOrb size={16} /></span>
                    <p className="text-white/70">{line}</p>
                  </div>
                )}
              </div>
              <div className="relative px-3 pb-3 pt-2">
                <div className="flex items-center gap-2 rounded-full border border-white/15 bg-[#1c1a17]/90 p-1.5">
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${phase === 'listen' ? 'bg-[#efe9dd] text-[#121110]' : 'border border-white/20 text-white/70'}`} aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zM5 11a7 7 0 0 0 14 0M12 18v3" /></svg>
                  </span>
                  <span className="min-w-0 flex-1 truncate text-left text-[11px]">{status}</span>
                  <span className="h-8 w-8 shrink-0 rounded-full" style={{ backgroundImage: GRADIENT, opacity: phase === 'think' ? 1 : 0.35 }} aria-hidden="true" />
                </div>
              </div>
            </div>
          </PhoneBody>
        </div>

        {/* Escucharlo: el saludo y la respuesta, en voz alta */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <button
            type="button"
            onClick={talking ? stop : listen}
            disabled={!canSpeak}
            className="group relative flex items-center gap-4 rounded-full p-[1.5px] transition-transform duration-500 ease-expo hover:scale-[1.03] disabled:opacity-50"
            style={{ backgroundImage: GRADIENT }}
          >
            <span className="flex items-center gap-4 rounded-full bg-[rgb(var(--void))] py-2 pl-2 pr-6">
              <ClipperOrb size={48} state={talking ? 'listening' : 'idle'} />
              <span className="text-left">
                <span className="block text-[17px] font-light">{talking ? t({ es: 'Detener', en: 'Stop' }) : t({ es: 'Escuchar a Clipper', en: 'Hear Clipper' })}</span>
                <span className="block font-mono text-[11px] uppercase tracking-[0.12em] text-paper/50 sm:text-[10px]">{t({ es: 'Activa el sonido', en: 'Turn sound on' })}</span>
              </span>
            </span>
            <span data-fiber-from="clp-ia" className="absolute left-1/2 top-full h-px w-px" />
          </button>

          {/* Lo que dice, palabra por palabra mientras habla */}
          <p className="mt-8 max-w-[34ch] text-balance text-[clamp(1.25rem,1rem+1vw,1.75rem)] font-light leading-snug">
            {withOffsets(phase === 'reply' || phase === 'rest' ? t(VOICE.reply) : t(VOICE.greeting)).map(({ w, at }, k) => (
              <span key={k} className={`transition-colors duration-200 ${!talking || spoken >= at ? 'text-paper' : 'text-paper/30'}`}>{w} </span>
            ))}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-2 lg:justify-start">
            {VOICE.notes.map((n, i) => (
              <button
                key={n.k.es}
                type="button"
                aria-pressed={note === i}
                onClick={() => setNote(note === i ? null : i)}
                className={`rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase sm:text-[10px] tracking-[0.1em] transition-colors ${note === i ? 'border-[#f0ce86] text-[#f0ce86]' : 'border-white/15 text-paper/55 hover:border-white/40 hover:text-paper'}`}
              >
                {t(n.k)}
              </button>
            ))}
          </div>
          <p className="case-note mt-4">
            {t({ es: 'Una simulación de la llamada, con una voz de ElevenLabs. En la reserva real, Clipper habla con la voz «Achird» de Gemini.', en: 'A simulation of the call, with an ElevenLabs voice. In real booking, Clipper speaks with Gemini’s “Achird” voice.' })}
          </p>
        </div>
      </div>
    </div>
  )
}

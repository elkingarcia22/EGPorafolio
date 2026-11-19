'use client'

import { useEffect, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { CLIPPER_CASE, type ToolRole } from '@/lib/content/cases/barberlytics/clipper-case'
import { ClipperOrb } from '../clipper-orb'
import { useTick } from '../thema/live-pieces'

export const AI_GRADIENT = 'linear-gradient(120deg,#f0ce86,#de8c3a 45%,#2e9cb0 75%,#3f72d8)'
const STAGE = 'relative overflow-hidden rounded-3xl bg-[#0f0d0b] p-5 text-[#efe9dd] md:p-8'

/** Ondas de voz: barras que suben y bajan mientras alguien habla. */
export function Wave({ active, bars = 24, className = '' }: { active: boolean; bars?: number; className?: string }) {
  return (
    <span className={`flex h-6 items-center gap-[3px] ${className}`} aria-hidden="true">
      {Array.from({ length: bars }, (_, i) => (
        <span
          key={i}
          className={`w-[3px] rounded-full ${active ? 'animate-[wave_1s_ease-in-out_infinite]' : ''}`}
          style={{ height: active ? `${30 + ((i * 37) % 70)}%` : '18%', animationDelay: `${(i % 7) * 0.09}s`, background: i % 3 === 0 ? '#2e9cb0' : i % 3 === 1 ? '#de8c3a' : '#f0ce86' }}
        />
      ))}
    </span>
  )
}

/** Escribe un texto letra a letra mientras `on` sea verdadero. */
function useTyped(text: string, on: boolean, speed = 28) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!on) {
      setN(0)
      return
    }
    if (n >= text.length) return
    const id = window.setTimeout(() => setN((k) => k + 1), speed)
    return () => window.clearTimeout(id)
  }, [n, on, text, speed])
  return text.slice(0, n)
}

/* ── 5.1 · Una pregunta, por dentro ──────────────────────────────────── */

const LOOP_STEPS: readonly L[] = [
  { es: 'Entiende la pregunta y quién la hace', en: 'Understands the question and who asks' },
  { es: 'Elige una herramienta de su rol', en: 'Picks a tool from their role' },
  { es: 'Revisa que cada cifra salga de los datos', en: 'Checks every figure comes from the data' },
  { es: 'Responde y dice qué consultó', en: 'Answers and says what it looked up' },
]
const PHASES_PER_Q = 6

export function AgentLoop() {
  const { t } = useLocale()
  const tick = useTick(1300)
  const qi = Math.floor(tick / PHASES_PER_Q) % CLIPPER_CASE.exchanges.length
  const phase = tick % PHASES_PER_Q
  const ex = CLIPPER_CASE.exchanges[qi]
  const denied = ex.tool === 'nomina'
  const answer = useTyped(t(ex.a), phase >= 4)
  return (
    <div data-reveal="device" className={STAGE}>
      <span className="pointer-events-none absolute -left-24 top-1/3 h-[420px] w-[420px] rounded-full opacity-25 blur-3xl" style={{ backgroundImage: AI_GRADIENT }} aria-hidden="true" />
      <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        {/* La conversación */}
        <div className="flex min-h-[360px] flex-col gap-3 rounded-2xl border border-white/10 bg-[#141210] p-5">
          <div className="mb-2 flex items-center gap-2">
            <ClipperOrb size={22} state={phase >= 1 && phase <= 3 ? 'thinking' : 'idle'} />
            <span className="text-sm font-medium">Clipper</span>
            <span className="ml-auto rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] text-white/55">{t(ex.role)}</span>
          </div>
          <p key={`q-${qi}`} className="ml-auto max-w-[85%] animate-[ramp-in_0.5s_cubic-bezier(0.16,1,0.3,1)_both] rounded-2xl rounded-tr-sm bg-white/[0.08] px-4 py-2.5 text-sm">{t(ex.q)}</p>
          {phase >= 1 && phase < 4 && <p className="font-mono text-[11px] text-white/45">{t({ es: 'Razonando…', en: 'Reasoning…' })}</p>}
          {phase >= 4 && (
            <div className="max-w-[92%] rounded-2xl rounded-tl-sm p-[1.5px]" style={{ backgroundImage: denied ? 'none' : AI_GRADIENT, background: denied ? 'rgba(255,107,114,0.4)' : undefined }}>
              <div className="rounded-[15px] bg-[#141210] px-4 py-3">
                <p className="text-sm leading-relaxed">{answer}<span className="ml-0.5 inline-block h-3.5 w-[2px] translate-y-0.5 animate-pulse bg-[#de8c3a]" aria-hidden="true" /></p>
                {phase >= 5 && (
                  <p className="mt-3 animate-[ramp-in_0.4s_both] border-t border-white/10 pt-2 font-mono text-[10px] text-white/45">
                    {denied ? t({ es: 'No permitido para este rol', en: 'Not allowed for this role' }) : `${t({ es: 'Consulté', en: 'Looked up' })} · ${t(ex.toolLabel)}`}
                  </p>
                )}
              </div>
            </div>
          )}
          {phase >= 5 && (
            <div className="mt-auto flex animate-[ramp-in_0.4s_both] gap-3 font-mono text-[10px] text-white/45">
              <span>Copiar</span><span>👍</span><span>👎</span><span>Regenerar</span><span>{t({ es: 'Leer en voz alta', en: 'Read aloud' })}</span>
            </div>
          )}
        </div>

        {/* Por dentro */}
        <div>
          <p className="mono-label mb-4 text-white/50">{t({ es: 'Por dentro', en: 'Inside' })}</p>
          <ol className="space-y-3">
            {LOOP_STEPS.map((s, i) => {
              const on = phase >= i && phase < 6
              return (
                <li key={s.es} className={`rounded-xl border p-3.5 transition-all duration-500 ${on ? 'border-white/20 bg-white/[0.05]' : 'border-white/[0.06] opacity-45'}`}>
                  <p className="flex items-center gap-3 text-sm">
                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-[10px] ${on ? 'text-[#16130f]' : 'border border-white/20 text-white/50'}`} style={on ? { backgroundImage: AI_GRADIENT } : undefined}>{i + 1}</span>
                    {t(s)}
                  </p>
                  {i === 1 && on && (
                    <p className={`ml-9 mt-2 inline-flex animate-[ramp-in_0.4s_both] items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[11px] ${denied ? 'bg-[#ff6b72]/15 text-[#ff8a8e]' : 'bg-[#2e9cb0]/15 text-[#7fd3e3]'}`}>
                      {ex.tool}{denied ? ' ✕' : ''}
                    </p>
                  )}
                  {i === 2 && on && <p className="ml-9 mt-2 animate-[ramp-in_0.4s_both] text-[11px] text-[#5fd39a]">✓ {t(ex.check)}</p>}
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </div>
  )
}

/* ── 5.2 · Las 18 herramientas, según el rol ─────────────────────────── */

const ROLES: readonly { id: ToolRole; label: L }[] = [
  { id: 'dueno', label: { es: 'Dueño', en: 'Owner' } },
  { id: 'recepcion', label: { es: 'Recepción', en: 'Front desk' } },
  { id: 'barbero', label: { es: 'Barbero', en: 'Barber' } },
]

export function ToolsByRole() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const [role, setRole] = useState<ToolRole>('dueno')
  const [pinned, setPinned] = useState(false)
  useEffect(() => {
    if (pinned || reducedMotion) return
    const id = window.setInterval(() => setRole((r) => ROLES[(ROLES.findIndex((x) => x.id === r) + 1) % ROLES.length].id), 3200)
    return () => window.clearInterval(id)
  }, [pinned, reducedMotion])
  const tools = CLIPPER_CASE.toolset
  const count = tools.filter((x) => x.roles.includes(role)).length
  return (
    <div data-reveal="device" className={STAGE}>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div role="radiogroup" aria-label={t({ es: 'Rol', en: 'Role' })} className="flex rounded-lg bg-white/[0.06] p-0.5">
          {ROLES.map((r) => (
            <button
              key={r.id}
              type="button"
              role="radio"
              aria-checked={role === r.id}
              onClick={() => {
                setRole(r.id)
                setPinned(true)
              }}
              className="rounded-md px-4 py-1.5 text-xs text-white/65 transition-colors hover:text-white aria-checked:bg-[#d9b36a] aria-checked:text-[#16130f]"
            >
              {t(r.label)}
            </button>
          ))}
        </div>
        <span className="font-mono text-xs text-white/55">{count} / 18 {t({ es: 'herramientas', en: 'tools' })}</span>
        <span className="ml-auto flex gap-4 text-[11px] text-white/55">
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#2e9cb0]" />{t({ es: 'Consulta', en: 'Reads' })}</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#de8c3a]" />{t({ es: 'Propone', en: 'Proposes' })}</span>
        </span>
      </div>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {tools.map((tool) => {
          const on = tool.roles.includes(role)
          const hue = tool.kind === 'read' ? '#2e9cb0' : '#de8c3a'
          return (
            <li
              key={tool.id}
              className="rounded-xl border p-3 transition-all duration-500"
              style={{ borderColor: on ? `${hue}88` : 'rgba(255,255,255,0.06)', background: on ? `${hue}1f` : 'transparent', opacity: on ? 1 : 0.3, transform: on ? 'none' : 'scale(0.96)' }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: hue, display: 'block' }} />
              <p className="mt-2 text-[12px] leading-tight">{t(tool.label)}</p>
              <p className="mt-1 truncate font-mono text-[9px] text-white/40">{tool.id}</p>
            </li>
          )
        })}
      </ul>
      <p className="mt-5 text-xs text-white/45">{t({ es: 'Nunca: cobrar, devolver dinero ni escribirle a un cliente. Para eso, manda a la ayuda.', en: 'Never: charge, refund or message a client. For that, it sends to help.' })}</p>
    </div>
  )
}

/* ── 5.3 · Propone; tú aplicas ───────────────────────────────────────── */

export function ProposalFlow() {
  const { t } = useLocale()
  const tick = useTick(1400)
  const phase = tick % 6 // 0 pregunta · 1 propuesta · 2 aplicando · 3 aplicado · 4 deshecho · 5 pausa
  const stateLabel = [t({ es: 'Propuesta', en: 'Proposal' }), t({ es: 'Propuesta', en: 'Proposal' }), t({ es: 'Aplicando…', en: 'Applying…' }), t({ es: 'Aplicado', en: 'Applied' }), t({ es: 'Deshecho', en: 'Undone' }), t({ es: 'Deshecho', en: 'Undone' })][phase]
  return (
    <div data-reveal="device" className={STAGE}>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <p className="ml-auto max-w-[90%] rounded-2xl rounded-tr-sm bg-white/[0.08] px-4 py-2.5 text-sm">{t({ es: 'Mueve la primera cita de mañana una hora más tarde', en: 'Move tomorrow’s first visit an hour later' })}</p>
          <div className={`rounded-2xl border p-4 transition-all duration-500 ${phase >= 1 ? 'opacity-100' : 'opacity-0'} ${phase === 3 ? 'border-[#4cc98d]/60' : 'border-white/15'}`}>
            <div className="flex items-center justify-between">
              <p className="font-medium">{t({ es: 'Mover la cita', en: 'Move the visit' })}</p>
              <span key={phase} className="animate-[ramp-in_0.4s_both] rounded-full bg-white/[0.08] px-2 py-0.5 font-mono text-[10px]">{stateLabel}</span>
            </div>
            <p className="mt-2 text-sm text-white/60">Marcela García · Corte niño · Lorena</p>
            <p className="mt-2 text-sm">
              {t({ es: 'Cuándo', en: 'When' })}: <span className={phase === 3 ? 'text-white/40 line-through' : ''}>jue 8:30</span> → <span className="text-[#e9c27a]">jue 9:30</span>
            </p>
            <div className="mt-4 flex gap-2 text-xs">
              {phase <= 2 ? (
                <>
                  <span className={`relative rounded-md px-3 py-1.5 font-semibold text-[#16130f] ${phase === 2 ? 'bg-[#d9b36a]/60' : 'bg-[#d9b36a]'}`}>
                    {phase === 2 ? t({ es: 'Aplicando…', en: 'Applying…' }) : t({ es: 'Aplicar', en: 'Apply' })}
                    {phase === 1 && <span className="pointer-events-none absolute -bottom-3 -right-3 h-7 w-7 animate-[tap-ping_1.4s_ease-out_infinite] rounded-full border-2 border-white/80" aria-hidden="true" />}
                  </span>
                  <span className="rounded-md border border-white/20 px-3 py-1.5">{t({ es: 'Descartar', en: 'Discard' })}</span>
                </>
              ) : (
                <span className="rounded-md border border-white/20 px-3 py-1.5">{phase === 3 ? t({ es: 'Deshacer', en: 'Undo' }) : t({ es: 'Volvió a jue 8:30', en: 'Back to Thu 8:30' })}</span>
              )}
            </div>
          </div>
          <p className="text-[11px] text-white/45">{t({ es: '«Nunca digas que ya está hecho: di que quedó lista para aplicar.» Lo aplicado queda en el historial como hecho por Clipper.', en: '“Never say it’s done: say it’s ready to apply.” What’s applied is logged as done by Clipper.' })}</p>
        </div>

        <div className="space-y-3">
          <p className="ml-auto max-w-[90%] rounded-2xl rounded-tr-sm bg-white/[0.08] px-4 py-2.5 text-sm">{t({ es: 'Anótale a Mateo Vargas que es alérgico al látex', en: 'Note that Mateo Vargas is allergic to latex' })}</p>
          <div className="rounded-2xl border border-[#f2a03a]/50 p-4">
            <div className="flex items-center justify-between">
              <p className="font-medium">{t({ es: 'Nota del cliente', en: 'Client note' })}</p>
              <span className="rounded-full bg-white/[0.08] px-2 py-0.5 font-mono text-[10px]">{t({ es: 'Propuesta', en: 'Proposal' })}</span>
            </div>
            <p className="mt-2 text-sm">Mateo Vargas · «{t({ es: 'Alérgico al látex', en: 'Allergic to latex' })}»</p>
            <p className="mt-3 rounded-lg bg-[#f2a03a]/15 px-3 py-2 text-xs text-[#f2b14d]">⚠ {t({ es: 'Es un dato de salud: confírmalo con el cliente antes de aplicar.', en: 'It’s health data: confirm it with the client before applying.' })}</p>
          </div>
          <div className="rounded-2xl border border-[#ff6b72]/40 p-4 text-xs">
            <p className="text-[#ff8a8e]">⚠ {t({ es: 'Choca con: Diego Moreno · 9:30', en: 'Clashes with: Diego Moreno · 9:30' })}</p>
            <p className="mt-1 text-white/50">{t({ es: 'Si la propuesta choca con otra cita, lo avisa antes de que alguien la aplique.', en: 'If a proposal clashes with another visit, it warns before anyone applies it.' })}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── 5.4 · La voz ────────────────────────────────────────────────────── */

const SPOKEN = 'corte para Martín mañana a las'
const SPOKEN_END = ' 4 con Nicolás'

export function VoiceMode() {
  const { t } = useLocale()
  const [mode, setMode] = useState<'equipo' | 'reserva'>('reserva')
  const tick = useTick(1200)
  const phase = tick % 8 // 0-2 escucha · 3 pausa larga («a las») · 4 sigue · 5 pensando · 6-7 responde
  const heard = phase < 3 ? SPOKEN.slice(0, Math.round((SPOKEN.length * (phase + 1)) / 3)) : phase === 3 ? SPOKEN : SPOKEN + SPOKEN_END
  const statusText =
    phase <= 2 ? t({ es: 'Te escucho · Español', en: 'Listening · Spanish' })
    : phase === 3 ? t({ es: 'Haz una pausa y sigo esperando', en: 'Pause and I’ll keep waiting' })
    : phase === 4 ? t({ es: 'Te escucho · Español', en: 'Listening · Spanish' })
    : phase === 5 ? t({ es: 'Estoy preparando la respuesta', en: 'Preparing the answer' })
    : mode === 'reserva' ? t({ es: 'Clipper responde', en: 'Clipper answers' }) : t({ es: 'Enviado al chat', en: 'Sent to chat' })
  const listening = phase <= 4
  return (
    <div data-reveal="device" className={STAGE}>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div role="radiogroup" aria-label={t({ es: 'Dónde', en: 'Where' })} className="flex rounded-lg bg-white/[0.06] p-0.5">
          {[
            { id: 'reserva' as const, label: { es: 'En la reserva · conversación', en: 'In booking · conversation' } },
            { id: 'equipo' as const, label: { es: 'En el equipo · dictado', en: 'In the team app · dictation' } },
          ].map((m) => (
            <button key={m.id} type="button" role="radio" aria-checked={mode === m.id} onClick={() => setMode(m.id)} className="rounded-md px-3 py-1.5 text-xs text-white/65 transition-colors hover:text-white aria-checked:bg-[#d9b36a] aria-checked:text-[#16130f]">
              {t(m.label)}
            </button>
          ))}
        </div>
      </div>
      <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="flex flex-col items-center rounded-2xl border border-white/10 bg-[#141210] px-6 py-10 text-center">
          <ClipperOrb size={140} state={listening ? 'listening' : phase === 5 ? 'thinking' : 'idle'} />
          <p key={statusText} className="mt-8 animate-[ramp-in_0.4s_both] text-sm text-white/70">{statusText}</p>
          <p className="mt-3 min-h-[1.5rem] font-mono text-sm">«{heard}{listening ? '…' : '»'}</p>
          {phase === 3 && (
            <span className="mt-4 block h-1 w-48 overflow-hidden rounded-full bg-white/10">
              <span className="block h-full animate-[view-progress_1.2s_linear_both] origin-left rounded-full bg-[#de8c3a]" />
            </span>
          )}
          <Wave active={listening || (phase >= 6 && mode === 'reserva')} className="mt-6" />
          {phase >= 6 && mode === 'reserva' && (
            <p className="mt-6 max-w-sm animate-[ramp-in_0.5s_both] rounded-2xl bg-white/[0.06] px-4 py-3 text-sm">{t({ es: '¡Listo, Martín! Nicolás te espera mañana a las 4. ¿Te lo confirmo?', en: 'Done, Martín! Nicolás will see you tomorrow at 4. Shall I confirm?' })}</p>
          )}
          <p className="mt-6 font-mono text-[10px] text-white/40">{mode === 'reserva' ? t({ es: 'Toca el micrófono para interrumpir', en: 'Tap the mic to interrupt' }) : t({ es: 'Enviar lo que dije', en: 'Send what I said' })}</p>
        </div>
        <ul className="space-y-3 text-sm">
          {[
            { k: { es: 'Escucha', en: 'Listens' }, v: { es: 'Con el reconocimiento de voz del navegador. Una pausa de 1,6 s es «terminé»; si la frase queda abierta —«con», «a las»— espera el doble.', en: 'With the browser’s speech recognition. A 1.6 s pause means “done”; if the phrase is left open —“with”, “at”— it waits twice as long.' } },
            { k: { es: 'Habla', en: 'Speaks' }, v: { es: 'Gemini, con la voz «Achird», «como un barbero amable que atiende por teléfono». Si no hay proveedor, usa la voz del navegador.', en: 'Gemini, with the “Achird” voice, “like a friendly barber answering the phone”. Without a provider, it uses the browser’s voice.' } },
            { k: { es: 'En la reserva', en: 'In booking' }, v: { es: 'Conversación como una llamada: saluda, responde en voz y vuelve a escuchar; se interrumpe tocando el micrófono.', en: 'A call-like conversation: it greets, answers aloud and listens again; tap the mic to interrupt.' } },
            { k: { es: 'En el equipo', en: 'In the team app' }, v: { es: 'Dictado: lo dicho se envía al chat y la respuesta llega escrita. La conversación por voz aquí está pendiente.', en: 'Dictation: what’s said goes to the chat and the answer comes in writing. Voice conversation here is pending.' } },
          ].map((row) => (
            <li key={row.k.es} data-reveal="right" className="border-l-2 border-white/10 pl-4">
              <p className="font-medium">{t(row.k)}</p>
              <p className="mt-1 leading-relaxed text-white/60">{t(row.v)}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

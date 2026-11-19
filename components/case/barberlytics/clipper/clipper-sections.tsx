'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { getLenis } from '@/lib/motion'
import { useLocale } from '@/lib/i18n'
import { CLIPPER_CASE } from '@/lib/content/cases/barberlytics/clipper-case'
import { Arrows, Board, Btn, Hand, Pin, Sketchy, Sticky } from '@/components/case/kit/sketch'
import { ClipperOrb, type ClipperOrbState } from '../clipper-orb'
import { useTick } from '../thema/live-pieces'
import { AI_GRADIENT, Wave } from './clipper-pieces'

const STAGE = 'relative overflow-hidden rounded-3xl bg-[#0f0d0b] p-5 text-[#efe9dd] md:p-8'

/* ── 02 · Patrones: el espectro de autonomía ─────────────────────────── */

export function AutonomySpectrum() {
  const { t } = useLocale()
  const { patterns } = CLIPPER_CASE
  const ref = useRef<HTMLDivElement>(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), { threshold: 0.3 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div>
      <p data-reveal className="mb-10 max-w-[62ch] text-lg leading-relaxed opacity-80">{t(patterns.lead)}</p>
      <div ref={ref} data-reveal="device" className={STAGE}>
        <p className="mb-8 text-lg">{t({ es: '¿Cuánto deja actuar a la máquina?', en: 'How much does it let the machine act?' })}</p>
        <div className="overflow-x-auto">
          <div className="relative min-w-[760px] pb-4 pt-40">
            {/* Zonas */}
            <div className="grid grid-cols-4 gap-1">
              {patterns.zones.map((z) => (
                <div key={z.id} className={`rounded-xl px-3 py-3 ${z.id === 'propose' ? 'bg-[#de8c3a]/15 ring-1 ring-[#de8c3a]/50' : 'bg-white/[0.04]'}`}>
                  <p className={`text-sm ${z.id === 'propose' ? 'text-[#f0ce86]' : ''}`}>{t(z.label)}</p>
                  <p className="mt-1 text-[11px] text-white/45">{t(z.note)}</p>
                </div>
              ))}
            </div>
            {/* Productos sobre el eje */}
            {patterns.products.map((p, i) => (
              <div
                key={p.name}
                className="absolute flex -translate-x-1/2 flex-col items-center transition-all duration-1000 ease-expo"
                style={{ left: `${(seen ? p.at : 0.5) * 100}%`, top: `${i % 2 ? 46 : 4}px`, opacity: seen ? 1 : 0, transitionDelay: `${i * 90}ms` }}
              >
                <span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] ${p.bad ? 'bg-[#ff6b72]/15 text-[#ff8a8e]' : 'bg-white/[0.07] text-white/75'}`}>{p.name}</span>
                <span className="mt-1 whitespace-nowrap text-[9px] text-white/40">{t(p.note)}</span>
              </div>
            ))}
            {/* Clipper */}
            <div className="absolute top-[92px] flex -translate-x-1/2 items-center gap-2 transition-all duration-[1400ms] ease-expo" style={{ left: `${(seen ? patterns.clipperAt : 0) * 100}%`, transitionDelay: '700ms' }}>
              <ClipperOrb size={34} />
              <span className="bg-clip-text text-sm font-medium text-transparent" style={{ backgroundImage: AI_GRADIENT }}>Clipper</span>
            </div>
          </div>
        </div>
        <p className="mt-4 text-[11px] text-white/40">{t({ es: 'Rojo: donde se acumulan las quejas en reseñas. De la investigación del agente y del calendario con IA.', en: 'Red: where complaints pile up in reviews. From the agent and AI-calendar research.' })}</p>
      </div>
      <ol className="mt-12 space-y-4">
        {patterns.insights.map((insight, i) => (
          <li key={insight.es} data-reveal className="flex gap-5 border-t border-fg/15 pt-4">
            <span className="mono-label shrink-0 text-signal">{t({ es: 'Hallazgo', en: 'Insight' })} 0{i + 1}</span>
            <span className="text-lg leading-snug">{t(insight)}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

/* ── 04 · Bocetos: anatomía de una respuesta ─────────────────────────── */

export function AnswerBoard() {
  const { t } = useLocale()
  return (
    <Board title={t({ es: 'Clipper · anatomía de una respuesta', en: 'Clipper · anatomy of an answer' })} w={1400} h={640} label={t({ es: 'Boceto a mano de una respuesta de Clipper con sus partes', en: 'Hand sketch of a Clipper answer with its parts' })}>
      <Pin x={50} y={30}><Hand size={2.4} className="font-bold">{t({ es: 'Una respuesta que se gana la confianza', en: 'An answer that earns trust' })}</Hand></Pin>
      <Pin x={120} y={120} w={560}>
        <div className="flex justify-end"><Sketchy fill="#fff7ea" className="px-[1cqw] py-[0.6cqw]"><Hand size={1.5}>{t({ es: '¿Cuánto llevo cobrado hoy?', en: 'How much have I collected today?' })}</Hand></Sketchy></div>
        <div className="mt-[1.4cqw]"><Sketchy fill="rgba(255,255,255,0.75)" className="px-[1.2cqw] py-[1cqw]">
          <Hand size={1.5}>{t({ es: 'Llevas US$ 658 de US$ 2.676. Faltan 4 por cobrar.', en: 'You’ve got US$ 658 of US$ 2,676. 4 left to charge.' })}</Hand>
          <span className="mt-[0.8cqw] block border-t border-dashed border-[#2a2d33]/40 pt-[0.5cqw]"><Hand size={1.15} className="opacity-70">{t({ es: 'Consulté · Cuentas del periodo', en: 'Looked up · Period accounts' })}</Hand></span>
        </Sketchy></div>
        <div className="mt-[1.4cqw]"><Sketchy fill="#ffe7d3" className="px-[1.2cqw] py-[1cqw]">
          <Hand size={1.4} className="font-bold">{t({ es: 'Mover la cita', en: 'Move the visit' })}</Hand>
          <span className="block"><Hand size={1.25}>4:00 → 5:00</Hand></span>
          <div className="mt-[0.6cqw] flex gap-[0.8cqw]"><Btn accent>Aplicar</Btn><Btn>Descartar</Btn></div>
        </Sketchy></div>
        <div className="mt-[1cqw] flex gap-[1.4cqw]"><Hand size={1.15} className="opacity-60">Copiar · 👍 👎 · Regenerar · Leer en voz alta</Hand></div>
      </Pin>
      <Pin x={760} y={150} w={300}><Hand size={1.5}>{t({ es: '1 a 4 frases. Se lee entre un corte y otro.', en: '1 to 4 sentences. Read between cuts.' })}</Hand></Pin>
      <Pin x={760} y={265} w={300}><Hand size={1.5}>{t({ es: 'De dónde salió: la herramienta, a la vista', en: 'Where it came from: the tool, in view' })}</Hand></Pin>
      <Pin x={760} y={390} w={300}><Hand size={1.5} className="font-bold text-[#e8743b]">{t({ es: 'Propone. Aplica una persona.', en: 'Proposes. A person applies.' })}</Hand></Pin>
      <Pin x={760} y={520} w={300}><Hand size={1.5}>{t({ es: '👎 abre «¿Qué falló?» y alimenta la evaluación', en: '👎 opens “What went wrong?” and feeds the eval' })}</Hand></Pin>
      <Arrows paths={[
        { d: 'M755,170 C720,180 700,200 690,230' },
        { d: 'M755,280 C700,290 640,300 600,305' },
        { d: 'M755,405 C700,420 560,440 470,445', accent: true },
        { d: 'M755,535 C680,560 560,575 470,580' },
      ]} />
      <Pin x={1110} y={120} w={240} rotate={2}><Sticky color="yellow">{t({ es: 'Nunca adivines: para cualquier cifra, consulta', en: 'Never guess: for any figure, look it up' })}</Sticky></Pin>
      <Pin x={1120} y={330} w={230} rotate={-2}><Sticky color="pink">{t({ es: 'Nada de gráficas inventadas: texto, fuente y tarjetas', en: 'No invented charts: text, source and cards' })}</Sticky></Pin>
      <Pin x={1110} y={520} w={240} rotate={1.5}><Sticky color="blue">{t({ es: 'Un solo símbolo de IA: el orbe', en: 'One AI symbol: the orb' })}</Sticky></Pin>
    </Board>
  )
}

/* ── 5.5 · El orbe ───────────────────────────────────────────────────── */

const ORB_STATES: readonly { id: ClipperOrbState; label: { es: string; en: string }; body: { es: string; en: string } }[] = [
  { id: 'idle', label: { es: 'En reposo', en: 'Idle' }, body: { es: 'Respira cada 4,5 s y gira despacio.', en: 'Breathes every 4.5 s and spins slowly.' } },
  { id: 'listening', label: { es: 'Escuchando', en: 'Listening' }, body: { es: 'Las franjas corren y late cada 1,2 s.', en: 'Stripes run and it beats every 1.2 s.' } },
  { id: 'thinking', label: { es: 'Pensando', en: 'Thinking' }, body: { es: 'El halo y el anillo se aceleran.', en: 'Halo and ring speed up.' } },
]

export function OrbSection() {
  const { t } = useLocale()
  const tick = useTick(2600)
  const [pinned, setPinned] = useState<ClipperOrbState | null>(null)
  const state = pinned ?? ORB_STATES[tick % ORB_STATES.length].id
  const current = ORB_STATES.find((s) => s.id === state) ?? ORB_STATES[0]
  return (
    <div data-reveal="device" className={STAGE}>
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div className="flex flex-col items-center py-6">
          <ClipperOrb size={220} state={state} />
          <p className="mt-10 bg-clip-text text-3xl font-medium text-transparent" style={{ backgroundImage: AI_GRADIENT }}>Clipper</p>
          <p key={state} className="mt-2 animate-[ramp-in_0.4s_both] font-mono text-xs text-white/55">{t(current.label)} · {t(current.body)}</p>
          <div role="radiogroup" aria-label={t({ es: 'Estado del orbe', en: 'Orb state' })} className="mt-6 flex rounded-lg bg-white/[0.06] p-0.5">
            {ORB_STATES.map((s) => (
              <button key={s.id} type="button" role="radio" aria-checked={state === s.id} onClick={() => setPinned(s.id)} className="rounded-md px-3 py-1.5 text-xs text-white/65 aria-checked:bg-[#d9b36a] aria-checked:text-[#16130f]">
                {t(s.label)}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="leading-relaxed text-white/75">{t({ es: 'Clipper no tiene un icono: tiene una presencia. Es el poste de barbería hecho esfera de vidrio, pintada con el gradiente de IA del tema. Es el único símbolo de IA del producto: si algo lo lleva, pasa por un modelo.', en: 'Clipper doesn’t have an icon: it has a presence. The barber pole turned glass sphere, painted with the theme’s AI gradient. It’s the product’s only AI symbol: if something carries it, it goes through a model.' })}</p>
          <p className="mono-label mb-4 mt-8 text-white/50">{t({ es: 'Se simplifica al achicarse', en: 'It simplifies as it shrinks' })}</p>
          <div className="flex items-end gap-6">
            {[96, 48, 28, 20].map((size) => (
              <div key={size} className="flex flex-col items-center gap-2">
                <ClipperOrb size={size} state={state} />
                <span className="font-mono text-[10px] text-white/45">{size}px</span>
              </div>
            ))}
          </div>
          <ul className="mt-8 space-y-2 text-sm text-white/70">
            <li>✓ {t({ es: 'Úsalo siempre que haya que mostrar «la IA».', en: 'Use it whenever “the AI” needs showing.' })}</li>
            <li>✕ {t({ es: 'No dibujes otro destello ni otro icono de IA.', en: 'Don’t draw any other sparkle or AI icon.' })}</li>
            <li>✕ {t({ es: 'No lo uses como adorno donde no hay IA.', en: 'Don’t use it as decoration where there’s no AI.' })}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

/* ── 06 · Cómo se construyó: evaluaciones y el filtro de cifras ──────── */

function Stack({ title, parts, colors }: { title: string; parts: readonly { label: { es: string; en: string }; value: number }[]; colors: readonly string[] }) {
  const { t } = useLocale()
  return (
    <div>
      <p className="mb-2 text-xs text-white/55">{title}</p>
      <div className="flex h-9 overflow-hidden rounded-lg">
        {parts.map((p, i) => (
          <span key={p.label.es} data-reveal="right" className="flex items-center justify-center font-mono text-xs text-[#16130f]" style={{ width: `${(p.value / 60) * 100}%`, background: colors[i] }}>{p.value}</span>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-white/55">
        {parts.map((p, i) => (
          <span key={p.label.es} className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: colors[i] }} />{t(p.label)}</span>
        ))}
      </div>
    </div>
  )
}

export function BuildSection() {
  const { t } = useLocale()
  const { build } = CLIPPER_CASE
  const tick = useTick(1600)
  const fixed = tick % 3 === 2
  const flagged = tick % 3 === 1
  return (
    <div className="space-y-12">
      <div data-reveal="device" className={STAGE}>
        <div className="grid gap-10 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center">
          <div className="text-center">
            <p className="bg-clip-text text-[clamp(4rem,2rem+5vw,7rem)] font-light leading-none text-transparent" style={{ backgroundImage: AI_GRADIENT }}>60</p>
            <p className="text-sm text-white/60">{t({ es: 'preguntas de evaluación', en: 'evaluation questions' })}</p>
          </div>
          <div className="space-y-6">
            <Stack title={t({ es: 'Por idioma', en: 'By language' })} parts={build.evals.languages} colors={['#f0ce86', '#de8c3a', '#2e9cb0']} />
            <Stack title={t({ es: 'Por lo que se espera', en: 'By expected behavior' })} parts={build.evals.behaviors} colors={['#2e9cb0', '#de8c3a', '#9a9ea8']} />
            <div className="flex flex-wrap gap-1.5">
              {build.evals.categories.map((c) => <span key={c} className="rounded-full bg-white/[0.06] px-2.5 py-1 font-mono text-[10px] text-white/60">{c}</span>)}
            </div>
          </div>
        </div>
        <p className="mt-8 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-relaxed text-white/65">{t(build.evals.note)}</p>
      </div>

      <div data-reveal="device" className={STAGE}>
        <p className="mono-label mb-4 text-white/50">{t({ es: 'El filtro de cifras', en: 'The number guard' })}</p>
        <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
          <div className="rounded-2xl border border-white/10 bg-[#141210] p-5 font-mono text-sm">
            <p className={fixed ? 'text-white/35 line-through' : ''}>
              {t(build.guard.before).split(build.guard.flagged).map((part, i, arr) => (
                <span key={i}>{part}{i < arr.length - 1 && <mark className={`rounded px-1 ${flagged || fixed ? 'bg-[#ff6b72]/30 text-[#ff8a8e]' : 'bg-transparent text-inherit'}`}>{build.guard.flagged}</mark>}</span>
              ))}
            </p>
            {flagged && <p className="mt-3 animate-[ramp-in_0.4s_both] text-xs text-[#ff8a8e]">✕ {t({ es: '«12 %» no sale de los datos consultados', en: '“12%” doesn’t come from the data looked up' })}</p>}
            {fixed && <p className="mt-3 animate-[ramp-in_0.4s_both] text-[#5fd39a]">✓ {t(build.guard.after)}</p>}
          </div>
          <p className="leading-relaxed text-white/70">{t({ es: 'Si una respuesta trae un número que no está en lo consultado ni en la pregunta, el servidor le pide al modelo que lo corrija una vez. Si vuelve a fallar, no la muestra: «La respuesta traía cifras que no salen de los datos».', en: 'If an answer has a number that isn’t in the lookup or the question, the server asks the model to fix it once. If it fails again, it won’t show it: “The answer had figures that don’t come from the data”.' })}</p>
        </div>
      </div>

      <ol className="grid gap-px overflow-hidden border border-fg/15 bg-fg/15 md:grid-cols-3">
        {build.phases.map((p, i) => (
          <li key={p.title.es} data-reveal className="bg-bg p-6">
            <span className="mono-label text-signal">0{i + 1}</span>
            <p className="mt-3 font-medium">{t(p.title)}</p>
            <p className="mt-2 text-sm leading-relaxed opacity-70">{t(p.body)}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}

/* ── 07 · Impacto ────────────────────────────────────────────────────── */

export function ClipperImpact() {
  const { t } = useLocale()
  const { impact } = CLIPPER_CASE
  return (
    <div>
      <p data-reveal className="max-w-[62ch] text-lg leading-relaxed opacity-80">{t(impact.lead)}</p>
      <dl className="mt-12 grid gap-px overflow-hidden border border-fg/15 bg-fg/15 sm:grid-cols-2 lg:grid-cols-4">
        {impact.metrics.map((m) => (
          <div key={m.label.es} data-reveal className="bg-bg p-6">
            <dt className="sr-only">{t(m.label)}</dt>
            <dd>
              <span className="block text-[clamp(2.4rem,1.6rem+2.4vw,3.8rem)] font-light leading-none text-signal tabular-nums">{m.value}</span>
              <span className="mt-3 block text-sm leading-snug opacity-70">{t(m.label)}</span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

/* ── 08 · Demo a pantalla completa ───────────────────────────────────── */

function FullscreenClipper({ onClose }: { onClose: () => void }) {
  const { t } = useLocale()
  const closeRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    const lenis = getLenis()
    lenis?.stop()
    const html = document.documentElement
    const prev = html.style.overflow
    html.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      html.style.overflow = prev
      lenis?.start()
    }
  }, [onClose])
  return (
    <div role="dialog" aria-modal="true" aria-label={t({ es: 'Clipper, en vivo', en: 'Clipper, live' })} className="fixed inset-0 z-[100] flex flex-col bg-[#0b0c0e]">
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-2.5 text-paper">
        <ClipperOrb size={20} />
        <span className="font-mono text-[11px] text-white/50">Clipper · {t({ es: 'en la reserva', en: 'in booking' })}</span>
        <a href={CLIPPER_CASE.demo.url.replace('embed=1&', '')} target="_blank" rel="noopener noreferrer" className="ml-auto font-mono text-[11px] text-white/60 hover:text-white">{t({ es: 'Nueva pestaña', en: 'New tab' })} ↗</a>
        <button ref={closeRef} type="button" onClick={onClose} className="rounded-md border border-white/20 px-3 py-1.5 font-mono text-[11px] text-white transition-colors hover:bg-white hover:text-black">
          {t({ es: 'Cerrar', en: 'Close' })} · Esc
        </button>
      </div>
      <iframe src={CLIPPER_CASE.demo.url} title={t({ es: 'Clipper en la reserva, en vivo', en: 'Clipper in booking, live' })} allow="microphone; autoplay" className="w-full flex-1 bg-[#121009]" />
    </div>
  )
}

export function ClipperDemo() {
  const { t } = useLocale()
  const { demo } = CLIPPER_CASE
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  return (
    <div>
      <div className="mb-10 grid gap-6 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <p data-reveal className="text-[clamp(1.6rem,1rem+1.8vw,2.6rem)] font-light leading-tight">{t({ es: 'Háblale.', en: 'Talk to it.' })}</p>
          <p data-reveal className="mt-4 leading-relaxed opacity-80">{t(demo.lead)}</p>
        </div>
        <dl data-reveal className="divide-y divide-fg/15 border-y border-fg/15 lg:col-span-5">
          {demo.tryIt.map((item) => (
            <div key={item.label.es} className="flex items-baseline justify-between gap-4 py-3 text-sm">
              <dt className="opacity-60">{t(item.label)}</dt>
              <dd className="text-right font-mono">{typeof item.value === 'string' ? item.value : t(item.value)}</dd>
            </div>
          ))}
        </dl>
      </div>
      <button type="button" onClick={() => setOpen(true)} data-reveal="device" className="group relative block w-full overflow-hidden rounded-3xl bg-[#0f0d0b] px-6 py-20 text-[#efe9dd]">
        <span className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-3xl transition-opacity duration-700 group-hover:opacity-50" style={{ backgroundImage: AI_GRADIENT }} aria-hidden="true" />
        <span className="relative flex flex-col items-center gap-8">
          <ClipperOrb size={150} state="listening" />
          <Wave active bars={32} />
          <span className="flex items-center gap-3 bg-void/85 px-6 py-4 text-paper backdrop-blur transition-colors group-hover:bg-signal">
            <span className="mono-label">⤢ {t({ es: 'Abrir Clipper a pantalla completa', en: 'Open Clipper full screen' })}</span>
          </span>
        </span>
      </button>
      {open && <FullscreenClipper onClose={close} />}
    </div>
  )
}

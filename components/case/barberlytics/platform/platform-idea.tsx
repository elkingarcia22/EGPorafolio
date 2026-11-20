'use client'

import { useLocale } from '@/lib/i18n'
import { useA11y } from '@/lib/a11y'
import { PLATFORM_CASE } from '@/lib/content/cases/barberlytics/platform-case'
import { useTick } from '../thema/live-pieces'
import { APPTS, CLIENT, SERVICE, STAGE, fmt, type ColorBy, type Stage } from './calendar-model'

const GOLD = '#d9b36a'
const PANEL = 'relative h-full overflow-hidden rounded-xl bg-[#141210] p-4 text-[#efe9dd] ring-1 ring-white/10'

/** Paso de un guion de `steps` pasos (quieto en el último con movimiento reducido). */
function useStep(ms: number, steps: number): number {
  const { reducedMotion } = useA11y()
  const tick = useTick(ms)
  return reducedMotion ? steps - 1 : tick % steps
}

/* ── 01 · Se adapta: el mismo día, pintado como lo quiere cada barbería ── */

const MODES: readonly { id: ColorBy; es: string; en: string; px: number }[] = [
  { id: 'estado', es: 'Por estado', en: 'By status', px: 18 },
  { id: 'servicio', es: 'Por servicio', en: 'By service', px: 14 },
  { id: 'cliente', es: 'Por cliente', en: 'By client', px: 22 },
  { id: 'neutral', es: 'Neutral', en: 'Neutral', px: 16 },
]
const MINI = APPTS.filter((a) => a.col < 4 && a.start < 7)
const STAGE_OF: Stage[] = ['paid', 'seated', 'waiting', 'upcoming', 'late', 'toCollect']

function AdaptDemo() {
  const { t } = useLocale()
  const mode = MODES[useStep(1800, MODES.length)]
  const hueOf = (i: number) => {
    const a = MINI[i]
    if (mode.id === 'estado') return STAGE[STAGE_OF[i % STAGE_OF.length]].hue
    if (mode.id === 'servicio') return SERVICE[a.services[0]].hue
    if (mode.id === 'cliente') return CLIENT[a.type]
    return '#8a8a8a'
  }
  return (
    <div className={PANEL}>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[11px] text-white/50">{t({ es: 'Colorear tarjetas', en: 'Color cards' })}</span>
        <span className="flex rounded-md bg-white/[0.06] p-0.5 text-[10px]">
          {MODES.map((m) => (
            <span key={m.id} className={`rounded px-2 py-0.5 transition-colors duration-300 ${m.id === mode.id ? 'bg-[#d9b36a] text-[#16130f]' : 'text-white/50'}`}>{t(m)}</span>
          ))}
        </span>
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        {[0, 1, 2, 3].map((col) => (
          <div key={col} className="relative transition-[height] duration-700 ease-expo" style={{ height: 7 * mode.px }}>
            {MINI.map((a, i) =>
              a.col !== col ? null : (
                <span
                  key={a.client}
                  className="absolute inset-x-0 overflow-hidden rounded-[5px] border-l-2 px-1.5 text-[9px] leading-tight transition-[top,height,background-color,border-color] duration-700 ease-expo"
                  style={{ top: a.start * mode.px, height: a.len * mode.px - 2, borderColor: hueOf(i), background: `${hueOf(i)}2e` }}
                >
                  {a.len * mode.px > 18 && a.client.split(' ')[0]}
                </span>
              ),
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── 02 · El siguiente paso, en la tarjeta ─────────────────────────────── */

const FLOW: readonly Stage[] = ['upcoming', 'waiting', 'seated', 'paid']

function NextStepDemo() {
  const { t } = useLocale()
  const step = useStep(1300, FLOW.length * 2)
  const stage = FLOW[Math.floor(step / 2)]
  const tapping = step % 2 === 1 && stage !== 'paid'
  const s = STAGE[stage]
  return (
    <div className={`${PANEL} flex flex-col justify-center gap-4`}>
      <div className="relative rounded-lg border-l-[3px] p-3 transition-colors duration-500" style={{ borderColor: s.hue, background: `${s.hue}1f` }}>
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[13px] font-medium">Mariana Ramírez</p>
            <p className="text-[11px] text-white/55">Corte + barba · US$ 59</p>
          </div>
          <span className="rounded-full border border-white/15 px-1.5 py-px text-[9px] text-white/60">RETENIDO</span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[11px]" style={{ color: s.hue }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.hue }} /> {s.label}
          </span>
          {s.next ? (
            <span className={`relative rounded-md px-3 py-1 text-[11px] font-semibold text-[#16130f] transition-transform duration-200 ${tapping ? 'scale-90' : ''}`} style={{ background: GOLD }}>
              {tapping && <span className="absolute inset-0 animate-[tap-ping_0.8s_ease-out_both] rounded-md ring-2 ring-[#d9b36a]" aria-hidden="true" />}
              {s.next}
            </span>
          ) : (
            <span className="text-[11px] text-[#4cc98d]">✓ {t({ es: 'Cobrada', en: 'Paid' })}</span>
          )}
        </div>
      </div>
      <ol className="flex items-center gap-1.5 text-[10px] text-white/45">
        {FLOW.map((st, i) => (
          <li key={st} className="flex items-center gap-1.5">
            <span className={i <= FLOW.indexOf(stage) ? 'text-white/90' : ''}>{STAGE[st].label}</span>
            {i < FLOW.length - 1 && <span aria-hidden="true">→</span>}
          </li>
        ))}
        <span className="ml-auto font-mono">{t({ es: '1 toque cada paso', en: '1 tap per step' })}</span>
      </ol>
    </div>
  )
}

/* ── 03 · Todo en un panel: la rejilla sigue a la vista ────────────────── */

function PanelDemo() {
  const { t } = useLocale()
  const step = useStep(1500, 4)
  const open = step >= 1 && step <= 2
  const lit = APPTS[3]
  return (
    <div className={`${PANEL} flex gap-3 p-3`}>
      <div className="grid flex-1 grid-cols-3 gap-1 transition-all duration-700 ease-expo">
        {[0, 1, 2].map((col) => (
          <div key={col} className="relative h-[150px] rounded-md bg-white/[0.03]">
            {APPTS.filter((a) => a.col === col && a.start < 7).map((a) => (
              <span
                key={a.client}
                className="absolute inset-x-1 rounded-[4px] transition-all duration-500"
                style={{ top: a.start * 20 + 4, height: a.len * 20 - 3, background: a === lit && open ? `${GOLD}66` : 'rgba(255,255,255,0.09)', outline: a === lit && open ? `1.5px solid ${GOLD}` : undefined }}
              />
            ))}
          </div>
        ))}
      </div>
      <aside className={`overflow-hidden rounded-lg bg-white/[0.06] transition-[width,opacity] duration-700 ease-expo ${open ? 'w-[46%] opacity-100' : 'w-0 opacity-0'}`}>
        <div className="w-[190px] space-y-2 p-3 text-[11px]">
          <p className="font-medium">{lit.client}</p>
          <p className="text-white/55">{t({ es: 'En la silla con Emilio · termina en 15 min', en: 'In the chair with Emilio · ends in 15 min' })}</p>
          <div className="space-y-1 border-t border-white/10 pt-2 text-[10px] text-white/50">
            <p>{t({ es: 'Agendada', en: 'Booked' })} · {fmt(lit.start - 4)}</p>
            <p>{t({ es: 'Llegó', en: 'Arrived' })} · {fmt(lit.start)}</p>
          </div>
          <span className="block rounded-md py-1 text-center font-semibold text-[#16130f]" style={{ background: GOLD }}>{t({ es: 'Cobrar', en: 'Charge' })}</span>
        </div>
      </aside>
    </div>
  )
}

/* ── 04 · Propone en la rejilla y se deshace ───────────────────────────── */

const SHIFT = [
  { name: 'Gael · fade', start: 0 },
  { name: 'Marcela · fade', start: 1.6 },
  { name: 'Santi · barba', start: 3.2 },
]

function ProposeDemo() {
  const { t } = useLocale()
  const step = useStep(1400, 5)
  const proposing = step >= 1
  const applied = step === 3
  const undone = step === 4
  // En el paso 0 la barra sale en fundido: conserva «Deshecho» hasta desaparecer.
  const offset = applied ? 0.8 : 0
  return (
    <div className={`${PANEL} flex flex-col gap-3`}>
      <p className="text-[11px]">
        <span className="text-[#ff6b72]">●</span> {t({ es: 'Emilio llega 20 min tarde', en: 'Emilio is 20 min late' })}
      </p>
      <div className="relative h-[140px] overflow-hidden rounded-md bg-white/[0.03]">
        {SHIFT.map((c) => (
          <div key={c.name}>
            {proposing && !applied && !undone && (
              <span className="absolute inset-x-3 h-[34px] rounded-[5px] border border-dashed border-[#d9b36a]/80 transition-all duration-500" style={{ top: (c.start + 0.8) * 22 + 4 }} aria-hidden="true" />
            )}
            <span className="absolute inset-x-3 flex h-[34px] items-center rounded-[5px] bg-white/[0.09] px-2 text-[10px] transition-[top] duration-700 ease-expo" style={{ top: (c.start + offset) * 22 + 4 }}>
              {c.name}
            </span>
          </div>
        ))}
      </div>
      <div className={`flex items-center justify-between rounded-lg bg-white/[0.07] px-3 py-2 text-[11px] transition-opacity duration-500 ${proposing ? 'opacity-100' : 'opacity-0'}`}>
        <span className="text-white/80">
          {applied
            ? t({ es: 'Movidas 3 citas · por el retraso de Emilio', en: 'Moved 3 visits · Emilio’s delay' })
            : undone || step === 0
              ? t({ es: 'Deshecho · todo como estaba', en: 'Undone · back as it was' })
              : t({ es: 'Mover 3 citas de Emilio +20 min', en: 'Move 3 of Emilio’s visits +20 min' })}
        </span>
        <span className="flex gap-1.5">
          <span className={`rounded px-2 py-0.5 font-semibold text-[#16130f] ${step === 2 ? 'ring-2 ring-white/60' : ''}`} style={{ background: GOLD }}>{t({ es: 'Aplicar', en: 'Apply' })}</span>
          <span className={`rounded border border-white/20 px-2 py-0.5 ${applied ? 'ring-2 ring-white/60' : ''}`}>{t({ es: 'Deshacer', en: 'Undo' })}</span>
        </span>
      </div>
    </div>
  )
}

const DEMOS = [AdaptDemo, NextStepDemo, PanelDemo, ProposeDemo]

/** 03 · La idea del calendario: la pregunta y cuatro principios, cada uno funcionando en un trozo de la app. */
export function PlatformIdea() {
  const { t } = useLocale()
  const { idea } = PLATFORM_CASE
  return (
    <div>
      <p data-reveal className="mono-label mb-4 opacity-60">{t({ es: '¿Cómo podríamos…?', en: 'How might we…?' })}</p>
      <p data-reveal="mask" className="max-w-[28ch] text-[clamp(1.8rem,1rem+2.4vw,3.2rem)] font-light leading-[1.1] tracking-tight">{t(idea.hmw)}</p>

      <ol className="mt-14 border-b border-fg/15">
        {idea.principles.map((p, i) => {
          const Demo = DEMOS[i]
          return (
            <li key={p.title.es} data-reveal className="group grid gap-6 border-t border-fg/15 py-8 md:grid-cols-12 md:gap-8">
              <div className="md:col-span-5">
                <span className="mono-label text-signal">{t({ es: 'Principio', en: 'Principle' })} 0{i + 1}</span>
                <p className="mt-3 text-[clamp(1.5rem,1rem+1.4vw,2.3rem)] font-light leading-[1.1] tracking-tight transition-transform duration-500 ease-expo group-hover:translate-x-1.5">{t(p.title)}</p>
                <p className="mt-3 max-w-[40ch] text-sm leading-relaxed opacity-70">{t(p.body)}</p>
              </div>
              <div className="min-h-[200px] md:col-span-7">{Demo && <Demo />}</div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

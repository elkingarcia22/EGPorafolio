'use client'

import { useLocale, type L } from '@/lib/i18n'
import { EMPRESA } from './cascade-model'
import { AppWindow, Pill, ProgressBar, Stage, UBITS_BLUE, useStepper } from './forma-ui'

const GREEN = '#17b26a'
const STEPS = ['Parametrización', 'Objetivos de la empresa', 'Participantes', 'Objetivos asignados', 'Alineación'] as const

/** Lo que pide «Así va el ciclo» antes de continuar (texto del playground). */
const NEEDS = ['Nombre del ciclo', 'Duración', 'Fechas del ciclo', 'Modelo de medición', 'Objetivos de la empresa', 'Quién redacta los objetivos'] as const

/** Cada cuadro de la animación: en qué paso está y cuántas cosas ya se llenaron. */
const FRAMES: readonly { step: number; filled: number }[] = [
  { step: 0, filled: 0 },
  { step: 0, filled: 1 },
  { step: 0, filled: 2 },
  { step: 0, filled: 4 },
  { step: 0, filled: 6 },
  { step: 1, filled: 1 },
  { step: 1, filled: 2 },
  { step: 1, filled: 3 },
  { step: 2, filled: 1 },
  { step: 3, filled: 1 },
  { step: 3, filled: 2 },
  { step: 4, filled: 1 },
]

const PEOPLE = [
  { who: 'Valentina Ríos', weights: [50, 30, 20] },
  { who: 'Esteban Díaz', weights: [40, 40, 30] },
]

function Field({ label, value, on }: { label: string; value: string; on: boolean }) {
  return (
    <div>
      <p className="mb-1 text-[11px] font-medium text-black/55">{label}</p>
      <div className={`rounded-lg border px-3 py-2 text-[12px] transition-colors duration-500 ${on ? 'border-[#0c5bef]/40 bg-white text-black/85' : 'border-black/10 bg-white text-black/30'}`}>{on ? value : '—'}</div>
    </div>
  )
}

function StepBody({ step, filled }: { step: number; filled: number }) {
  if (step === 0) {
    return (
      <div className="grid gap-3">
        <Field label="Nombre del ciclo" value="KPIs corporativos 2026" on={filled >= 1} />
        <div>
          <p className="mb-1 text-[11px] font-medium text-black/55">Duración</p>
          <div className="grid grid-cols-5 gap-1.5 text-[11px]">
            {['Mes', 'Trimestre', 'Semestre', 'Año', 'A medida'].map((d) => {
              const on = filled >= 2 && d === 'Trimestre'
              return (
                <span key={d} className={`rounded-lg border px-2 py-1.5 text-center transition-colors duration-500 ${on ? 'border-[#0c5bef] bg-[#0c5bef]/10 text-[#0c5bef]' : 'border-black/10 bg-white text-black/55'}`}>{d}</span>
              )
            })}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Modelo de medición" value="SMART" on={filled >= 4} />
          <Field label="Quién redacta" value="Líder" on={filled >= 6} />
        </div>
      </div>
    )
  }
  if (step === 1) {
    return (
      <div className="grid gap-2">
        <div className="mb-1 flex items-center justify-between text-[11px] text-black/55">
          <span>{filled} objetivos de la empresa en este ciclo.</span>
          <span className="rounded-full bg-gradient-to-r from-[#7b5cff] to-[#0c5bef] px-3 py-1 text-white">✦ Crear con IA</span>
        </div>
        {EMPRESA.slice(0, filled).map((e) => (
          <div key={e.id} className="flex animate-[ramp-in_0.5s_cubic-bezier(0.16,1,0.3,1)_both] items-center justify-between rounded-lg border border-black/10 bg-white px-3 py-2.5 text-[12px]">
            {e.titulo}
            <Pill color={GREEN}>Listo</Pill>
          </div>
        ))}
      </div>
    )
  }
  if (step === 2) {
    return (
      <div className="grid gap-2 text-[12px]">
        <p className="text-[11px] text-black/55">Elige los líderes que van a crear los objetivos de sus equipos.</p>
        {[['Comercial', '637 personas', true], ['Marketing', '84 personas', false], ['Operaciones', '212 personas', false]].map(([g, n, on]) => (
          <div key={g as string} className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors duration-500 ${on ? 'border-[#0c5bef]/40 bg-white' : 'border-black/10 bg-white/60 text-black/45'}`}>
            <span className={`grid h-4 w-4 place-items-center rounded text-[10px] text-white ${on ? 'bg-[#0c5bef]' : 'border border-black/25'}`}>{on ? '✓' : ''}</span>
            <span className="flex-1">{g}</span>
            <span className="text-black/45">{n}</span>
          </div>
        ))}
      </div>
    )
  }
  if (step === 3) {
    return (
      <div className="grid gap-3 text-[12px]">
        <p className="text-[11px] text-black/55">El peso se revisa por persona: quedarse debajo de 100 % vale, pasarse no.</p>
        {PEOPLE.map((p, i) => {
          const total = p.weights.reduce((a, b) => a + b, 0)
          const shown = filled > i
          const over = total > 100
          return (
            <div key={p.who} className={`rounded-lg border bg-white px-3 py-2.5 transition-opacity duration-500 ${shown ? 'opacity-100' : 'opacity-30'} ${shown && over ? 'border-[#d92d20]/50' : 'border-black/10'}`}>
              <div className="flex items-center justify-between">
                <span>{p.who}</span>
                <span className="font-mono text-[11px]" style={{ color: shown && over ? '#d92d20' : 'rgba(0,0,0,0.55)' }}>{total} %</span>
              </div>
              <div className="mt-2 flex h-2 overflow-hidden rounded-full bg-black/[0.06]">
                {p.weights.map((w, k) => (
                  <span key={k} className="h-full border-r border-white transition-transform duration-700" style={{ width: `${(w / Math.max(total, 100)) * 100}%`, background: ['#0c5bef', '#7b5cff', '#17b26a'][k], transform: shown ? 'scaleX(1)' : 'scaleX(0)', transformOrigin: 'left' }} />
                ))}
              </div>
              {shown && over && <p className="mt-1.5 text-[11px] text-[#d92d20]">Se pasa por {total - 100} %: ajusta un peso.</p>}
            </div>
          )
        })}
      </div>
    )
  }
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-[11px]">
      <div className="grid gap-2">
        {['Comercial', 'Marketing', 'Operaciones'].map((a) => (
          <span key={a} className="rounded-lg border border-black/10 bg-white px-3 py-2">{a}</span>
        ))}
      </div>
      <svg viewBox="0 0 60 120" className="h-28 w-14" aria-hidden="true">
        {[[18, 18], [60, 60], [102, 102]].map(([a, b], i) => (
          <path key={i} d={`M0 ${a} C30 ${a} 30 ${b} 60 ${b}`} fill="none" stroke={UBITS_BLUE} strokeWidth={[6, 3, 4][i]} strokeOpacity={0.7} pathLength={1} strokeDasharray={1} className="obj-draw" />
        ))}
      </svg>
      <div className="grid gap-2">
        {EMPRESA.map((e) => (
          <span key={e.id} className="rounded-lg bg-[#0c5bef] px-3 py-2 text-white">{e.corto}</span>
        ))}
      </div>
    </div>
  )
}

const NOTES: readonly L[] = [
  { es: 'Una sola pregunta, «quién redacta», decide si hay participantes y asignación.', en: 'One question, “who writes”, decides whether there are participants and assignment.' },
  { es: 'El norte primero: con Crear con IA salen de cinco preguntas.', en: 'North first: Create with AI drafts them from five questions.' },
  { es: 'Con líder, se eligen los líderes que van a redactar para sus equipos.', en: 'With leads, you pick the leads who’ll write for their teams.' },
  { es: 'El peso se valida por persona y avisa justo donde se pasa.', en: 'Weight is validated per person and flags exactly where it goes over.' },
  { es: 'Cada área queda colgando de un objetivo de empresa.', en: 'Every area ends up hanging from a company goal.' },
]

/** 5.2 · El constructor, llenándose solo: los cinco pasos y el panel que cuenta lo que falta. */
export function BuilderLive() {
  const { t } = useLocale()
  const { step: frame, ref, set } = useStepper(1500, FRAMES.length)
  const { step, filled } = FRAMES[frame]
  const missing = step === 0 ? NEEDS.length - filled : 0

  return (
    <div ref={ref}>
      <Stage>
        <ol className="mb-5 flex flex-wrap gap-2">
          {STEPS.map((s, i) => (
            <li key={s}>
              <button
                type="button"
                onClick={() => set(FRAMES.findIndex((f) => f.step === i))}
                className={`flex items-center gap-2 rounded-full py-1 pl-1 pr-3 text-[12px] transition-colors duration-500 ${i === step ? 'bg-white text-[#0b0d16]' : i < step ? 'text-white/80' : 'text-white/40 hover:text-white/70'}`}
              >
                <span className={`grid h-5 w-5 place-items-center rounded-full text-[10px] ${i < step ? 'bg-[#0c5bef] text-white' : i === step ? 'bg-[#0c5bef] text-white' : 'border border-white/25'}`}>{i < step ? '✓' : i + 1}</span>
                {s}
              </button>
            </li>
          ))}
        </ol>

        <AppWindow title={step === 0 ? 'Crear ciclo de objetivos' : 'Editar ciclo'} meta={`Paso ${step + 1} de 5 · ${STEPS[step]}`}>
          <div className="grid gap-4 p-4 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
            <div key={step} className="animate-[ramp-in_0.5s_cubic-bezier(0.16,1,0.3,1)_both]">
              <StepBody step={step} filled={filled} />
            </div>
            <aside className="rounded-xl border border-black/[0.06] bg-white p-4 text-[12px]">
              <p className="font-medium">Así va el ciclo</p>
              <p className="mt-2 text-[15px] font-medium">{filled >= 1 || step > 0 ? 'KPIs corporativos 2026' : 'Sin nombre todavía'}</p>
              {step === 0 ? (
                <>
                  <p className="mt-3 flex items-center justify-between">
                    <span className={missing ? 'text-[#b54708]' : 'text-[#067647]'}>{missing ? `⚠ Faltan ${missing} datos` : '✓ Todo listo'}</span>
                    <span className="text-black/45">{NEEDS.length - missing} de {NEEDS.length}</span>
                  </p>
                  <ProgressBar value={NEEDS.length - missing} max={NEEDS.length} color={missing ? '#f79009' : GREEN} className="mt-2 h-1.5" />
                  <ul className="mt-3 space-y-1">
                    {NEEDS.map((n, i) => (
                      <li key={n} className={`flex items-center gap-2 transition-colors duration-500 ${i < filled ? 'text-black/35 line-through' : 'text-black/70'}`}>
                        <span className={i < filled ? 'text-[#17b26a]' : 'text-black/30'}>{i < filled ? '✓' : '•'}</span>
                        {n}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <ul className="mt-3 space-y-2 text-black/65">
                  {[
                    ['Objetivos de la empresa', step >= 1 ? (step === 1 ? filled : 3) : 0],
                    ['Personas con objetivos', step >= 3 ? 637 : 0],
                    ['Objetivos alineados', step >= 4 ? 3 : 0],
                  ].map(([k, v]) => (
                    <li key={k as string} className="flex justify-between"><span>{k}</span><span className="font-medium tabular-nums text-black/85">{v}</span></li>
                  ))}
                </ul>
              )}
            </aside>
          </div>
        </AppWindow>
        <p key={`n-${step}`} className="mt-5 max-w-[62ch] animate-[ramp-in_0.6s_cubic-bezier(0.16,1,0.3,1)_both] text-sm leading-relaxed text-white/70">{t(NOTES[step])}</p>
      </Stage>
    </div>
  )
}

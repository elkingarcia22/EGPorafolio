'use client'

import { useLocale, type L } from '@/lib/i18n'
import { APP, Pill, RumboOrb } from './platform'
import { useInView } from './ui'
import { useLoop } from './ai-hooks'

interface Source {
  name: string
  cost: 'free' | 'low' | 'paid'
  found: L
  x: number
  y: number
}

/** Fuentes en el orden de la cascada: primero lo gratis. */
const SOURCES: readonly Source[] = [
  { name: 'HubSpot', cost: 'free', found: { es: '3 libres', en: '3 free' }, x: 200, y: 34 },
  { name: 'Registro oficial', cost: 'free', found: { es: '6 por NIT', en: '6 by tax ID' }, x: 346, y: 104 },
  { name: 'Banco SellUp', cost: 'free', found: { es: '2 verificadas', en: '2 verified' }, x: 346, y: 226 },
  { name: 'Web', cost: 'low', found: { es: '4 páginas leídas', en: '4 pages read' }, x: 200, y: 290 },
  { name: 'Apollo', cost: 'paid', found: { es: 'No hizo falta', en: 'Not needed' }, x: 54, y: 226 },
  { name: 'Lusha', cost: 'paid', found: { es: 'No hizo falta', en: 'Not needed' }, x: 54, y: 104 },
]

const COST_COLOR = { free: '#10b981', low: '#5b7eff', paid: '#f59e0b' } as const

/** Lo que Rumbo «piensa» en cada paso. */
const THOUGHTS: readonly L[] = [
  { es: 'Pedido: empresas de salud en México con más de 200 empleados. Meta: 12.', en: 'Request: healthcare companies in Mexico with 200+ employees. Goal: 12.' },
  { es: 'Empiezo por lo gratis: HubSpot tiene 3 empresas sin dueño que encajan.', en: 'Starting free: HubSpot has 3 ownerless companies that fit.' },
  { es: 'Leo el registro oficial por industria y tamaño: 6 más, con número fiscal.', en: 'Reading the official registry by industry and size: 6 more, with tax ID.' },
  { es: 'El banco de SellUp ya tenía 2 verificadas esperando dueño.', en: 'SellUp’s bank already had 2 verified ones waiting for an owner.' },
  { es: 'Abro el sitio de cada una para confirmar sector y tamaño. Guardo la frase exacta.', en: 'Opening each site to confirm sector and size. Saving the exact quote.' },
  { es: 'Cruzo dominio exacto y número fiscal: 2 eran duplicadas, las saco.', en: 'Matching exact domain and tax ID: 2 were duplicates, removed.' },
  { es: 'Llegué a la meta sin pagar. No abro Apollo ni Lusha.', en: 'Goal reached without paying. Not opening Apollo or Lusha.' },
  { es: 'Entrego 12 candidatas a «Por revisar», cada dato con su fuente.', en: 'Handing 12 candidates to “To review”, every fact with its source.' },
]

const RESULTS: readonly { name: string; cite: L; tone: 'green' | 'blue' }[] = [
  { name: 'Clínica Andina del Norte', cite: { es: 'HubSpot · sin dueño', en: 'HubSpot · no owner' }, tone: 'green' },
  { name: 'Grupo Salud Meridiano', cite: { es: 'Registro oficial · NIT', en: 'Official registry · tax ID' }, tone: 'blue' },
  { name: 'Laboratorios Ceiba', cite: { es: 'Sitio web · «1.200 colaboradores»', en: 'Website · “1,200 staff”' }, tone: 'blue' },
]

const TOTAL = THOUGHTS.length + 3

/** Cómo busca Rumbo: baja la cascada de fuentes, lee, cita, verifica y se detiene. */
export function RumboSearch() {
  const { t } = useLocale()
  const [ref, seen] = useInView<HTMLDivElement>(0.35)
  const [step] = useLoop(TOTAL, 1300, seen)
  const goal = step >= 6
  const active = step >= 1 && step <= 4 ? step - 1 : -1

  const state = (i: number): 'idle' | 'busy' | 'done' | 'skip' => {
    if (SOURCES[i].cost === 'paid') return goal ? 'skip' : 'idle'
    if (i === active) return 'busy'
    return step > i + 1 ? 'done' : 'idle'
  }

  return (
    <div ref={ref} className="grid gap-4 overflow-hidden rounded-[20px] p-4 ring-1 ring-white/10 md:p-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]" style={{ background: APP.bg, color: APP.text }} data-reveal="device">
      <svg viewBox="0 0 400 324" className="h-auto w-full" role="img" aria-label={t({ es: 'Rumbo consultando fuentes en cascada', en: 'Rumbo querying sources in a cascade' })}>
        <defs>
          <radialGradient id="rumbo-halo"><stop offset="0" stopColor="#7e2be0" stopOpacity="0.45" /><stop offset="1" stopColor="#7e2be0" stopOpacity="0" /></radialGradient>
        </defs>
        <circle cx="200" cy="162" r={goal ? 90 : 70} fill="url(#rumbo-halo)" style={{ transition: 'r 900ms' }} />
        {SOURCES.map((s, i) => {
          const st = state(i)
          const path = `M200 162 L${s.x} ${s.y}`
          return (
            <g key={s.name}>
              <path d={path} stroke={st === 'skip' ? 'rgba(255,255,255,0.08)' : COST_COLOR[s.cost]} strokeOpacity={st === 'idle' ? 0.18 : 0.8} strokeWidth={st === 'busy' ? 2 : 1} strokeDasharray={st === 'skip' ? '3 5' : st === 'busy' ? '6 4' : undefined} fill="none">
                {st === 'busy' && <animate attributeName="stroke-dashoffset" from="20" to="0" dur="0.6s" repeatCount="indefinite" />}
              </path>
              {st === 'busy' && (
                <circle r="3.5" fill={COST_COLOR[s.cost]}>
                  <animateMotion dur="0.9s" repeatCount="indefinite" path={`M${s.x} ${s.y} L200 162`} />
                </circle>
              )}
              <g transform={`translate(${s.x} ${s.y})`} opacity={st === 'skip' ? 0.35 : st === 'idle' ? 0.55 : 1} style={{ transition: 'opacity 500ms' }}>
                <rect x="-48" y="-17" width="96" height="34" rx="9" fill={APP.card} stroke={st === 'busy' || st === 'done' ? COST_COLOR[s.cost] : 'rgba(255,255,255,0.12)'} />
                <text y="-2" textAnchor="middle" fontSize="10.5" fill={APP.text}>{s.name}</text>
                <text y="10" textAnchor="middle" fontSize="8.5" fill={st === 'done' ? COST_COLOR[s.cost] : 'rgba(232,233,236,0.5)'}>
                  {st === 'done' || st === 'skip' ? t(s.found) : st === 'busy' ? t({ es: 'consultando…', en: 'querying…' }) : s.cost === 'paid' ? t({ es: 'de pago', en: 'paid' }) : t({ es: 'gratis', en: 'free' })}
                </text>
              </g>
            </g>
          )
        })}
        <foreignObject x="176" y="138" width="48" height="48"><RumboOrb size={48} pulse={!goal} /></foreignObject>
        <text x="200" y="208" textAnchor="middle" fontSize="11" fill={APP.text}>Rumbo</text>
      </svg>

      <div className="flex min-w-0 flex-col">
        <p className="mono-label mb-3 flex items-center gap-2 opacity-60"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#7e2be0]" />{t({ es: 'Lo que Rumbo está pensando', en: 'What Rumbo is thinking' })}</p>
        <ol className="space-y-2 text-[13px]">
          {THOUGHTS.map((th, i) => {
            const shown = i <= step
            return (
              <li key={th.es} className={`flex gap-2 transition-all duration-500 ${shown ? 'opacity-100' : 'translate-y-1 opacity-0'} ${i === Math.min(step, THOUGHTS.length - 1) ? '' : 'text-white/50'}`}>
                <span className="font-mono text-[10px] text-[#a78bfa]">{String(i + 1).padStart(2, '0')}</span>
                <span className="leading-snug">{t(th)}</span>
              </li>
            )
          })}
        </ol>
        <ul className={`mt-4 space-y-1.5 transition-all duration-700 ${step >= THOUGHTS.length - 1 ? 'opacity-100' : 'translate-y-2 opacity-0'}`}>
          {RESULTS.map((r) => (
            <li key={r.name} className="flex items-center justify-between gap-2 rounded-[10px] px-3 py-2 ring-1 ring-white/[0.08]" style={{ background: APP.card }}>
              <span className="truncate text-[12px]">{r.name}</span>
              <Pill tone={r.tone}>{t(r.cite)}</Pill>
            </li>
          ))}
          <li className="px-1 text-[11px] opacity-50">{t({ es: '+ 9 más · costo de la corrida US$0,42 · 0 créditos pagos · datos de ejemplo', en: '+ 9 more · run cost US$0.42 · 0 paid credits · sample data' })}</li>
        </ul>
      </div>
    </div>
  )
}

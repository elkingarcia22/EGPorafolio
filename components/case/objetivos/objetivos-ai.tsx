'use client'

import { useEffect, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { OBJ_CASE } from '@/lib/content/cases/objetivos/objetivos-case'
import { useStepper } from './forma-ui'

const STEP_MS = 9000
const ramp = 'animate-[ramp-in_0.6s_cubic-bezier(0.16,1,0.3,1)_both]'
const after = (ms: number) => ({ animationDelay: `${ms}ms` })

/** Escribe un texto letra a letra a partir de un retraso; sin movimiento, lo muestra entero. */
function useTyped(text: string, delay: number, speed = 16): string {
  const { reducedMotion } = useA11y()
  const [n, setN] = useState(reducedMotion ? text.length : 0)
  useEffect(() => {
    if (reducedMotion) {
      setN(text.length)
      return
    }
    setN(0)
    let id = 0
    const start = window.setTimeout(() => {
      id = window.setInterval(() => setN((v) => (v >= text.length ? (window.clearInterval(id), v) : v + 2)), speed)
    }, delay)
    return () => {
      window.clearTimeout(start)
      window.clearInterval(id)
    }
  }, [text, delay, speed, reducedMotion])
  return text.slice(0, n)
}

/* ── 1 · Propone: «Crear con IA» (aiObjectiveBrief.ts) ── */

/** Las cinco preguntas del brief; las respuestas abiertas son un ejemplo de lo que escribiría alguien. */
const BRIEF = [
  { q: '¿Cuántos objetivos?', a: '3' },
  { q: '¿En qué se juega el ciclo?', a: 'Clientes' },
  { q: '¿Qué momento vive la empresa?', a: 'Entran clientes, pero se van rápido' },
  { q: '¿Qué tan exigentes deben ser las metas?', a: 'Retador · Exige mejorar' },
  { q: '¿Qué más hay que tener en cuenta?', a: 'Sin presupuesto nuevo' },
]
const SEEDS = [
  { title: 'Subir la satisfacción de los clientes', dir: 'Aumentar', measure: 'Porcentaje' },
  { title: 'Aumentar la retención de los clientes', dir: 'Aumentar', measure: 'Porcentaje' },
  { title: 'Reducir los tickets de soporte sin resolver', dir: 'Reducir', measure: 'Numérico' },
]

function Seed({ s, i }: { s: (typeof SEEDS)[number]; i: number }) {
  const typed = useTyped(s.title, 1800 + i * 900)
  return (
    <li className={`${ramp} rounded-xl bg-white p-3 text-[#161a2c]`} style={after(1700 + i * 900)}>
      <p className="min-h-[1.3em] text-[13px] font-medium">{typed}</p>
      <p className="mt-1.5 flex gap-1.5 text-[10px]">
        <span className="rounded bg-[#0c5bef]/10 px-1.5 py-0.5 text-[#0c5bef]">{s.dir === 'Aumentar' ? '↗' : '↘'} {s.dir}</span>
        <span className="rounded bg-black/[0.05] px-1.5 py-0.5 text-black/60">{s.measure}</span>
      </p>
    </li>
  )
}

function Proposes() {
  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <ol className="space-y-2.5">
        {BRIEF.map((b, i) => (
          <li key={b.q} className={ramp} style={after(i * 260)}>
            <p className="text-[12px] text-white/50">{b.q}</p>
            <p className="mt-1 inline-flex rounded-full bg-white px-3 py-1 text-[13px] text-[#0b0d16]">{b.a}</p>
          </li>
        ))}
        <li className={`${ramp} pt-1`} style={after(1350)}>
          <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#7b5cff] to-[#0c5bef] px-4 py-2 text-[12px] font-medium">✦ Crear con IA</span>
        </li>
      </ol>
      <ul className="space-y-2">
        {SEEDS.map((s, i) => <Seed key={s.title} s={s} i={i} />)}
      </ul>
    </div>
  )
}

/* ── 2 · Lee: «Análisis con IA», lectura real del staging (19 nov 2026) ── */

const READING = [
  { kind: 'Hallazgo', color: '#6b8cff', title: '72 % de los objetivos empuja un objetivo de empresa', level: 'Alta' },
  { kind: 'Riesgo', color: '#ff6b5c', title: 'El avance va 9 puntos por detrás del calendario', level: 'Alta', proof: 'Avance general 9,1 % frente a 18 % del calendario corrido.' },
  { kind: 'Qué hacer', color: '#17b26a', title: 'Desbloquear 42 objetivos antes de mirar cualquier otra cifra', level: 'Alta', proof: '29 por aprobar y 13 devueltos.' },
]
const SCANNED = [
  ['286', 'objetivos'],
  ['80', 'personas'],
  ['9,1 %', 'avance'],
  ['18 %', 'calendario'],
]

function Reads() {
  const summary = useTyped('Va en 9,1 % de avance general, con 0 % de los objetivos en meta. El ritmo va por detrás del calendario (18 % corrido). Hay 42 objetivos sin aprobar que todavía no cuentan.', 900, 14)
  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
      <div>
        <div className="relative grid grid-cols-2 gap-2 overflow-hidden rounded-xl">
          {SCANNED.map(([v, k]) => (
            <div key={k} className="rounded-lg bg-white/[0.06] p-3">
              <p className="text-xl font-light tabular-nums">{v}</p>
              <p className="text-[11px] text-white/45">{k}</p>
            </div>
          ))}
          {/* La pasada que lee las cifras. */}
          <span className="obj-scan pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-transparent via-[#7b5cff]/40 to-transparent" aria-hidden="true" />
        </div>
        <p className="mt-4 min-h-[5.5em] text-[13px] leading-relaxed text-white/75">{summary}</p>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/40">9 lecturas · 78 % con confiabilidad alta</p>
      </div>
      <ul className="space-y-2">
        {READING.map((r, i) => (
          <li key={r.title} className={`${ramp} rounded-xl bg-white p-3.5 text-[#161a2c]`} style={after(600 + i * 450)}>
            <p className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.12em]">
              <span style={{ color: r.color === '#6b8cff' ? '#0c5bef' : r.color === '#ff6b5c' ? '#d92d20' : '#067647' }}>{r.kind}</span>
              <span className="rounded-full bg-[#17b26a]/12 px-2 py-0.5 normal-case tracking-normal text-[#067647]">Confiabilidad {r.level.toLowerCase()}</span>
            </p>
            <p className="mt-1.5 text-[13px] font-medium">{r.title}</p>
            {r.proof && <p className="mt-1 text-[11px] text-black/50">Evidencia: {r.proof}</p>}
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ── 3 · Sincroniza: Claude entre el código y los casos de uso ── */

const COMMITS = [
  'resultados: «Para atender» ordena por prioridad',
  'constructor: el peso solo avisa al pasarse de 100 %',
  'alineación: arrastrar el punto azul al objetivo',
  'ranking: grupos de menos de 3 no se comparan',
]

function Syncs() {
  const { reducedMotion } = useA11y()
  const [count, setCount] = useState(reducedMotion ? 926 : 880)
  useEffect(() => {
    if (reducedMotion) return
    const id = window.setInterval(() => setCount((c) => (c >= 926 ? (window.clearInterval(id), c) : c + 2)), 60)
    return () => window.clearInterval(id)
  }, [reducedMotion])
  return (
    <div className="grid items-center gap-6 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
      <div>
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/45">Código del playground</p>
        <ul className="space-y-1.5 font-mono text-[11px]">
          {COMMITS.map((c, i) => (
            <li key={c} className={`${ramp} rounded-md bg-white/[0.06] px-2.5 py-1.5 text-white/75`} style={after(i * 300)}>
              <span className="text-[#9fb2ff]">●</span> {c}
            </li>
          ))}
        </ul>
      </div>
      <div className="relative mx-auto grid h-28 w-28 place-items-center">
        <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90" aria-hidden="true">
          <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="5" />
          <circle cx="50" cy="50" r="44" fill="none" stroke="url(#obj-ai-grad)" strokeWidth="5" strokeLinecap="round" pathLength={1} strokeDasharray={1} className="obj-draw" style={{ animationDuration: `${STEP_MS - 800}ms`, animationTimingFunction: 'linear' }} />
          <defs>
            <linearGradient id="obj-ai-grad" x1="0" x2="1">
              <stop offset="0" stopColor="#7b5cff" />
              <stop offset="1" stopColor="#0c5bef" />
            </linearGradient>
          </defs>
        </svg>
        <span className="text-center">
          <span className="block text-2xl font-light">15</span>
          <span className="block text-[10px] text-white/50">min</span>
        </span>
      </div>
      <div>
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/45">Casos de uso</p>
        <p className="text-[clamp(2.4rem,1.6rem+2vw,3.4rem)] font-light leading-none tabular-nums">{count}</p>
        <div className={`${ramp} mt-4 rounded-xl bg-white p-3 text-[#161a2c]`} style={after(1600)}>
          <p className="text-[12px] font-medium">Propuesta con pantallazo</p>
          <p className="mt-0.5 text-[11px] text-black/55">Actualizar 3 casos de alineación</p>
          <div className="mt-2 flex gap-1.5 text-[11px]">
            <span className="rounded-md bg-[#0c5bef] px-2.5 py-1 text-white">Aprobar</span>
            <span className="rounded-md border border-black/10 px-2.5 py-1">Ver cambio</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── El escenario: tres tiempos unidos por un haz ── */

const TIMES: readonly { id: string; verb: L; where: L; what: L; Panel: () => JSX.Element }[] = [
  { id: 'propone', verb: { es: 'Propone', en: 'Proposes' }, where: { es: 'Crear con IA', en: 'Create with AI' }, what: { es: 'Cinco preguntas, ninguna técnica, y salen los objetivos de la empresa con dirección y medida deducidas.', en: 'Five questions, none technical, and the company goals come out with direction and measure deduced.' }, Panel: Proposes },
  { id: 'lee', verb: { es: 'Lee', en: 'Reads' }, where: { es: 'Análisis con IA', en: 'AI analysis' }, what: { es: 'Lee el ciclo entero y lo devuelve en hallazgos, riesgos y qué hacer, cada uno con su evidencia y su confiabilidad.', en: 'It reads the whole cycle and returns findings, risks and what to do, each with its evidence and confidence.' }, Panel: Reads },
  { id: 'sincroniza', verb: { es: 'Sincroniza', en: 'Syncs' }, where: { es: 'Claude en el proceso', en: 'Claude in the process' }, what: { es: 'Cada 15 minutos cruza los cambios del playground con los casos de uso y deja propuestas con pantallazo. Una persona aprueba.', en: 'Every 15 minutes it matches playground changes with the use cases and leaves screenshot proposals. A person approves.' }, Panel: Syncs },
]

const NODE_X = [80, 400, 720]

/** 06 · IA en el proceso: propone, lee y sincroniza. */
export function ObjetivosAi() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const [pinned, setPinned] = useState(false)
  const { step, ref, set } = useStepper(STEP_MS, TIMES.length, pinned)
  const active = TIMES[step]
  const pick = (i: number) => {
    set(i)
    setPinned(true)
  }

  return (
    <div>
      <p data-reveal className="max-w-[62ch] text-lg leading-relaxed opacity-80">{t(OBJ_CASE.ai.lead)}</p>

      {/* Los tres verbos, grandes: el que está en juego se enciende. */}
      <p data-reveal className="mt-12 flex flex-wrap gap-x-5 text-[clamp(2.6rem,1.4rem+4.4vw,5.6rem)] font-light leading-[0.95] tracking-tight">
        {TIMES.map((x, i) => (
          <button key={x.id} type="button" onClick={() => pick(i)} className={`transition-[color,opacity] duration-700 ${i === step ? 'bg-gradient-to-r from-[#9f8cff] to-[#4f86ff] bg-clip-text text-transparent' : 'opacity-25 hover:opacity-50'}`}>
            {t(x.verb)}.
          </button>
        ))}
      </p>

      <div ref={ref} data-reveal="device" className="relative mt-10 overflow-hidden rounded-3xl bg-[#0b0d16] p-4 text-white md:p-8">
        <span className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[#7b5cff] opacity-20 blur-3xl transition-transform duration-1000 ease-expo" style={{ transform: `translateX(${(step - 1) * 60}%)` }} aria-hidden="true" />

        {/* El haz: tres nodos y un pulso que viaja al que está activo. */}
        <div className="relative">
          <svg viewBox="0 0 800 70" className="h-auto w-full" aria-hidden="true">
            <defs>
              <linearGradient id="obj-beam" x1="0" x2="1">
                <stop offset="0" stopColor="#7b5cff" />
                <stop offset="1" stopColor="#0c5bef" />
              </linearGradient>
            </defs>
            <line x1={NODE_X[0]} x2={NODE_X[2]} y1={35} y2={35} stroke="rgba(255,255,255,0.12)" strokeWidth={2} />
            <line x1={NODE_X[0]} x2={NODE_X[step]} y1={35} y2={35} stroke="url(#obj-beam)" strokeWidth={3} className="transition-all duration-1000 ease-expo" />
            {!reducedMotion && <line x1={NODE_X[0]} x2={NODE_X[2]} y1={35} y2={35} stroke="#fff" strokeOpacity={0.7} strokeWidth={2} pathLength={1} strokeDasharray="0.05 0.95" className="obj-flow" />}
            {TIMES.map((x, i) => (
              <g key={x.id} onClick={() => pick(i)} className="cursor-pointer">
                {i === step && !reducedMotion && <circle cx={NODE_X[i]} cy={35} r={22} fill="none" stroke="#9f8cff" strokeWidth={2} className="animate-[tap-ping_1.8s_ease-out_infinite]" style={{ transformOrigin: `${NODE_X[i]}px 35px` }} />}
                <circle cx={NODE_X[i]} cy={35} r={i === step ? 16 : 10} fill={i <= step ? 'url(#obj-beam)' : '#1d2030'} stroke="rgba(255,255,255,0.25)" className="transition-all duration-700" />
              </g>
            ))}
          </svg>
          <div className="grid grid-cols-3 text-center">
            {TIMES.map((x, i) => (
              <button key={x.id} type="button" onClick={() => pick(i)} className={`text-[12px] transition-opacity ${i === step ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}>
                <span className="block font-medium">{t(x.verb)}</span>
                <span className="block text-white/50">{t(x.where)}</span>
              </button>
            ))}
          </div>
        </div>

        <div key={active.id} className="relative mt-8">
          <p className={`${ramp} mb-6 max-w-[60ch] text-[15px] leading-relaxed text-white/75`}>{t(active.what)}</p>
          <active.Panel />
        </div>

        <p className="relative mt-8 text-[11px] text-white/40">
          {t({ es: 'Lo que lee el Análisis con IA es la lectura real del staging (19 nov 2026). En el prototipo, propone y lee con reglas sobre las cifras, sin modelo.', en: 'What AI analysis reads is the real staging reading (Nov 19, 2026). In the prototype it proposes and reads with rules over the numbers, no model.' })}
        </p>
      </div>
    </div>
  )
}

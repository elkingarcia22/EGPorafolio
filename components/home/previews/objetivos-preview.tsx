'use client'

import { useEffect, useState } from 'react'
import { useA11y } from '@/lib/a11y'

/**
 * Vista previa de Objetivos en la lista de proyectos: «Crear con IA» escribe un
 * objetivo, se alinea a uno de empresa y el avance del ciclo sube. Los textos, el
 * pulso inicial y el objetivo generado son del playground (staging, 19 nov 2026);
 * el avance de cada objetivo de empresa es ilustrativo.
 */
const STEPS = 9
const STEP_MS = 950
const BLUE = '#0c5bef'
const GREEN = '#17b26a'
const NEW_GOAL = 'Aumentar la retención de los clientes'

const GOALS = [
  { title: 'Crecer los ingresos un 15 %', from: 48, to: 56 },
  { title: 'Ser la marca preferida de los clientes', from: 61, to: 74 },
  { title: 'Operar con más eficiencia', from: 39, to: 45 },
]

function useStep(): number {
  const { reducedMotion } = useA11y()
  const [n, setN] = useState(0)
  useEffect(() => {
    if (reducedMotion) return
    const id = window.setInterval(() => setN((v) => v + 1), STEP_MS)
    return () => window.clearInterval(id)
  }, [reducedMotion])
  return reducedMotion ? STEPS - 1 : n % STEPS
}

/** La ventana del producto: objetivos de empresa con su avance. */
function Dashboard({ step }: { step: number }) {
  const grown = step >= 6
  const added = step >= 5
  return (
    <div className="absolute left-[4%] top-[7%] w-[68%] overflow-hidden rounded-lg bg-[#f6f7fb] text-[#161a2c] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.85)] ring-1 ring-white/10 [transform:perspective(900px)_rotateY(9deg)] [transform-origin:left_center]">
      <div className="flex items-center justify-between border-b border-black/[0.06] bg-white px-2.5 py-1.5">
        <span className="text-[10px] font-semibold">Objetivos</span>
        <span className="rounded-full bg-[#0c5bef] px-1.5 py-px text-[7px] text-white">+ Crear ciclo</span>
      </div>
      <div className="grid grid-cols-3 gap-1 p-2">
        {[
          ['Avance', grown ? '58 %' : '53,9 %'],
          ['Cumplidos', grown ? '33 %' : '30,4 %'],
          ['Reportando', '93,9 %'],
        ].map(([k, v]) => (
          <div key={k} className="rounded-md bg-white px-1.5 py-1">
            <p className="text-[6.5px] text-black/45">{k}</p>
            <p className="text-[10px] font-semibold tabular-nums transition-colors duration-500">{v}</p>
          </div>
        ))}
      </div>
      <div className="space-y-1 px-2 pb-2">
        {GOALS.map((g, i) => {
          const v = grown ? g.to : g.from
          const lit = step >= 4 && step <= 6 && i === 1
          return (
            <div key={g.title} className={`rounded-md bg-white px-1.5 py-1 transition-shadow duration-500 ${lit ? 'shadow-[0_0_0_1.5px_#0c5bef]' : ''}`}>
              <p className="flex items-center justify-between gap-1 text-[7.5px]">
                <span className="truncate font-medium">{g.title}</span>
                <span className="shrink-0 tabular-nums text-black/55">{v} %</span>
              </p>
              <span className="mt-0.5 block h-1 overflow-hidden rounded-full bg-black/[0.06]">
                <span className="block h-full origin-left rounded-full transition-transform duration-1000 ease-expo" style={{ background: BLUE, transform: `scaleX(${v / 100})` }} />
              </span>
            </div>
          )
        })}
        <div className={`rounded-md border border-dashed px-1.5 py-1 transition-all duration-500 ${added ? 'border-[#17b26a]/50 bg-white opacity-100' : 'border-transparent opacity-0'}`}>
          <p className="flex items-center justify-between gap-1 text-[7.5px]">
            <span className="truncate font-medium">{NEW_GOAL}</span>
            <span className="shrink-0 rounded-full px-1 text-[6.5px]" style={{ background: `${GREEN}22`, color: '#067647' }}>Aprobado</span>
          </p>
          <p className="mt-0.5 text-[6.5px] text-black/45">Porcentaje · 68 % → 74 % · aporta a «Ser la marca preferida»</p>
        </div>
      </div>
    </div>
  )
}

/** La tarjeta de «Crear con IA»: escribe, propone y se va a la lista. */
function AiCard({ step }: { step: number }) {
  const typed = NEW_GOAL.slice(0, step < 1 ? 0 : step === 1 ? 14 : step === 2 ? 28 : NEW_GOAL.length)
  const leaving = step >= 5
  return (
    <div className={`absolute bottom-[8%] right-[4%] w-[40%] rounded-xl bg-gradient-to-br from-[#f1edff] via-white to-[#ffeef3] p-2.5 text-[#161a2c] shadow-[0_40px_70px_-20px_rgba(0,0,0,0.9)] ring-1 ring-white/20 transition-[transform,opacity] duration-700 ease-expo ${leaving ? 'opacity-0' : 'opacity-100'}`} style={{ transform: leaving ? 'translate(-30%, -40%) scale(0.7) rotate(-2deg)' : 'rotate(-2deg)' }}>
      <p className="flex items-center gap-1.5 text-[8.5px] font-semibold">
        <span className="h-3 w-3 rounded-full bg-[conic-gradient(from_200deg,#ff5ca8,#7b5cff,#0c5bef,#ff9a5c,#ff5ca8)]" />
        Crear con IA
      </p>
      <p className="mt-1.5 text-[7px] text-black/50">¿Qué tiene que ser verdad al cierre?</p>
      <p className="mt-0.5 min-h-[2.4em] rounded-md border border-[#0c5bef]/60 bg-white px-1.5 py-1 text-[8px] leading-tight">
        {typed}
        {step >= 1 && step <= 3 && <span className="ml-px inline-block h-[1em] w-px translate-y-[1px] animate-pulse bg-[#0c5bef]" />}
      </p>
      <div className="mt-1.5 flex gap-1 text-[6.5px]">
        <span className={`rounded px-1 py-px transition-colors duration-300 ${step >= 3 ? 'bg-[#0c5bef]/10 text-[#0c5bef]' : 'bg-black/[0.05] text-black/45'}`}>Porcentaje</span>
        <span className={`rounded px-1 py-px transition-colors duration-300 ${step >= 3 ? 'bg-[#0c5bef]/10 text-[#0c5bef]' : 'bg-black/[0.05] text-black/45'}`}>↗ 68 % → 74 %</span>
      </div>
      <span className={`relative mt-2 block rounded-md py-1 text-center text-[8px] font-semibold text-white transition-colors duration-300 ${step >= 4 ? 'bg-[#17b26a]' : 'bg-[#0c5bef]'}`}>
        {step >= 4 ? '✓ Alineado' : 'Generar objetivos'}
        {step === 3 && <span className="absolute inset-0 animate-[tap-ping_1s_ease-out_infinite] rounded-md bg-white/40" aria-hidden="true" />}
      </span>
    </div>
  )
}

export function ObjetivosPreview() {
  const step = useStep()
  return (
    <div className="relative aspect-[4/3] overflow-hidden bg-[#0b0d16]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_70%_at_30%_40%,rgba(12,91,239,0.22),transparent_70%),radial-gradient(40%_50%_at_85%_90%,rgba(123,92,255,0.2),transparent_70%)]" aria-hidden="true" />
      <Dashboard step={step} />
      {/* El trazo del objetivo nuevo al de empresa */}
      <svg className={`pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-500 ${step >= 4 && step <= 5 ? 'opacity-100' : 'opacity-0'}`} viewBox="0 0 100 75" preserveAspectRatio="none" aria-hidden="true">
        <path d="M72 50 C 66 44, 60 40, 56 38" fill="none" stroke="#9fb2ff" strokeWidth="0.5" strokeDasharray="1.5 1.2" className="animate-[dash-run_0.8s_linear_infinite]" vectorEffect="non-scaling-stroke" />
      </svg>
      <AiCard step={step} />
      <span className="absolute bottom-[3%] left-[4%] font-mono text-[9px] uppercase tracking-[0.18em] text-white/45">
        {step >= 6 ? 'Alineado → el ciclo avanza' : step >= 4 ? 'Alineando' : 'Crear con IA'}
      </span>
      <span className="sr-only">Crear con IA escribe un objetivo, se alinea a un objetivo de empresa y el avance del ciclo sube.</span>
    </div>
  )
}

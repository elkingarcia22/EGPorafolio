'use client'

import { useEffect, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { OBJ_CASE } from '@/lib/content/cases/objetivos/objetivos-case'
import { ModelConfigurator } from './model-configurator'

/** Un contador que avanza solo mientras el movimiento esté permitido. */
function useTick(ms: number, steps: number): number {
  const { reducedMotion } = useA11y()
  const [i, setI] = useState(0)
  useEffect(() => {
    if (reducedMotion) return
    const id = window.setInterval(() => setI((v) => (v + 1) % steps), ms)
    return () => window.clearInterval(id)
  }, [ms, steps, reducedMotion])
  return reducedMotion ? steps - 1 : i
}

/** El norte primero: el objetivo personal encaja debajo del de empresa. */
function NorthDemo() {
  const step = useTick(1600, 3)
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 text-[12px]">
      <span className="rounded-md bg-signal px-3 py-1.5 text-paper">Crecer los ingresos un 15 %</span>
      <span className={`h-6 w-px bg-signal transition-transform duration-500 origin-top ${step > 0 ? 'scale-y-100' : 'scale-y-0'}`} />
      <span className={`rounded-md border border-fg/25 bg-bg px-3 py-1.5 transition-all duration-700 ease-expo ${step > 0 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-30'}`}>
        Cumplir el presupuesto de ventas
      </span>
      <span className={`font-mono text-[10px] transition-opacity duration-500 ${step > 1 ? 'text-signal opacity-100' : 'opacity-0'}`}>aporta 50 %</span>
    </div>
  )
}

/** Sin aprobar no cuenta: el avance aparece solo cuando el líder aprueba. */
function ApproveDemo() {
  const step = useTick(1500, 3)
  const approved = step > 0
  return (
    <div className="flex h-full flex-col justify-center gap-3 px-2 text-[12px]">
      <div className="flex items-center justify-between gap-2">
        <span>Reducir el tiempo de respuesta</span>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] transition-colors duration-500 ${approved ? 'bg-[#067647]/15 text-[#17b26a]' : 'bg-[#f38744]/15 text-[#f38744]'}`}>
          {approved ? 'Aprobado' : 'Por aprobar'}
        </span>
      </div>
      <span className="h-1.5 overflow-hidden rounded-full bg-fg/10">
        <span className="block h-full rounded-full bg-signal transition-[width] duration-700 ease-expo" style={{ width: step === 2 ? '46%' : '0%' }} />
      </span>
      <span className="font-mono text-[10px] opacity-60">{approved ? (step === 2 ? '46 % · cuenta para el área' : 'listo para reportar') : 'sin avance hasta aprobar'}</span>
    </div>
  )
}

/** Constancia antes que %: ocho semanas de reporte y la racha que crece. */
function StreakDemo() {
  const step = useTick(700, 9)
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <div className="flex gap-1.5">
        {Array.from({ length: 8 }, (_, i) => (
          <span key={i} className={`h-8 w-4 rounded-sm transition-colors duration-300 ${i < step ? 'bg-signal' : 'bg-fg/10'}`} />
        ))}
      </div>
      <span className="font-mono text-[11px] opacity-70">{step >= 3 ? `En racha · ${step} semanas` : 'Reportó esta semana'}</span>
    </div>
  )
}

/** A quien falta se le cuenta: los nombres se vuelven una cifra. */
function CountDemo() {
  const step = useTick(1800, 2)
  const names = ['Ricardo T.', 'Nicolás R.', 'Carlos N.']
  return (
    <div className="relative flex h-full items-center justify-center text-[12px]">
      <ul className={`space-y-1 transition-all duration-700 ${step === 0 ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'}`} aria-hidden={step !== 0}>
        {names.map((n) => (
          <li key={n} className="rounded border border-fg/15 px-2 py-0.5">{n} · sin reportar</li>
        ))}
      </ul>
      <span className={`absolute text-center transition-all duration-700 ${step === 1 ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
        <span className="block text-3xl font-light text-signal">3</span>
        <span className="text-[11px] opacity-70">personas no han reportado</span>
      </span>
    </div>
  )
}

const PRINCIPLES: readonly { title: L; body: L; Demo: () => JSX.Element }[] = [
  { title: { es: 'El norte primero', en: 'North first' }, body: { es: 'Cada objetivo dice a cuál de empresa empuja. Lo que no cuelga de nada se ve como «sin alinear».', en: 'Every goal says which company goal it pushes. What hangs from nothing shows as “unaligned”.' }, Demo: NorthDemo },
  { title: { es: 'Acordar antes de medir', en: 'Agree before measuring' }, body: { es: 'Un objetivo sin aprobar no lleva avance: el líder lo aprueba o lo devuelve con un motivo.', en: 'An unapproved goal carries no progress: the lead approves or returns it with a reason.' }, Demo: ApproveDemo },
  { title: { es: 'Constancia antes que %', en: 'Habit over %' }, body: { es: 'Se premia volver a reportar. El porcentaje crudo castiga a quien se puso metas ambiciosas.', en: 'Coming back to report is rewarded. Raw % punishes ambitious goals.' }, Demo: StreakDemo },
  { title: { es: 'Contar, no exponer', en: 'Count, don’t expose' }, body: { es: 'En público solo se nombra para reconocer. Un cruce de menos de 3 personas sale reservado.', en: 'In public you only name people to praise. A cell under 3 people stays private.' }, Demo: CountDemo },
]

/** 03 · La idea: la pregunta y cuatro principios, cada uno con su demostración. */
export function ObjetivosIdea() {
  const { t } = useLocale()
  return (
    <div>
      <p data-reveal className="mono-label mb-4 opacity-60">{t({ es: '¿Cómo podríamos…?', en: 'How might we…?' })}</p>
      <p data-reveal="mask" className="max-w-[26ch] text-[clamp(1.8rem,1rem+2.4vw,3.2rem)] font-light leading-[1.1] tracking-tight">{t(OBJ_CASE.idea.hmw)}</p>
      <p data-reveal className="mt-8 max-w-[62ch] text-lg leading-relaxed opacity-80">
        {t({
          es: 'Lo central de la idea: no obligar a ninguna empresa a cambiar su método. El modelo, quién redacta, la medida y la duración se eligen; todo lo que viene después lee esas reglas.',
          en: 'The core of the idea: never force a company to change its method. Model, who writes, measure and length are chosen; everything after that reads those rules.',
        })}
      </p>
      <div className="mt-12">
        <ModelConfigurator />
      </div>

      <p data-reveal className="mono-label mb-6 mt-16 opacity-60">{t({ es: 'Y cuatro principios que valen para cualquier modelo', en: 'And four principles that hold for any model' })}</p>
      <ol className="grid gap-4 sm:grid-cols-2">
        {PRINCIPLES.map(({ title, body, Demo }, i) => (
          <li key={title.es} data-reveal className={`grid grid-rows-[150px_auto] border border-fg/15 ${i % 2 ? 'sm:translate-y-10' : ''}`}>
            <div className="border-b border-fg/10 bg-fg/[0.03] p-4">
              <Demo />
            </div>
            <div className="p-6">
              <span className="mono-label text-signal">{t({ es: 'Principio', en: 'Principle' })} 0{i + 1}</span>
              <p className="mt-3 text-xl leading-snug">{t(title)}</p>
              <p className="mt-3 text-sm leading-relaxed opacity-70">{t(body)}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

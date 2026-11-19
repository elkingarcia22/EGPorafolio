'use client'

import { useState } from 'react'
import { useLocale, type L } from '@/lib/i18n'
import { OBJ_CASE } from '@/lib/content/cases/objetivos/objetivos-case'

interface Reference {
  name: string
  kind: L
  pattern: L
  landed: L
}

/** Las herramientas revisadas para el ranking (30-oct) y el patrón que se llevó cada una. */
const REFS: readonly Reference[] = [
  { name: 'Lattice', kind: { es: 'Desempeño', en: 'Performance' }, pattern: { es: 'Objetivos y check-ins en el mismo lugar que la conversación con el líder.', en: 'Goals and check-ins in the same place as the talk with the lead.' }, landed: { es: 'Ficha de la persona', en: 'Person profile' } },
  { name: 'Viva Goals', kind: { es: 'OKR', en: 'OKR' }, pattern: { es: 'Cada resultado cuelga de uno superior: la alineación se ve, no se supone.', en: 'Each result hangs from a higher one: alignment is seen, not assumed.' }, landed: { es: 'Mapa de alineación', en: 'Alignment map' } },
  { name: 'Geekbot', kind: { es: 'Check-ins', en: 'Check-ins' }, pattern: { es: 'Reportar donde ya se conversa, sin abrir otra herramienta.', en: 'Report where people already talk, without opening another tool.' }, landed: { es: 'Mensaje a Slack, Teams o WhatsApp', en: 'Message to Slack, Teams or WhatsApp' } },
  { name: 'Duolingo', kind: { es: 'Hábito', en: 'Habit' }, pattern: { es: 'La racha premia volver, no acertar.', en: 'The streak rewards coming back, not getting it right.' }, landed: { es: '«En racha»: 3 semanas o más', en: '“On a streak”: 3+ weeks' } },
  { name: 'Strava', kind: { es: 'Comunidad', en: 'Community' }, pattern: { es: 'El reconocimiento entre pares pesa más que la tabla.', en: 'Peer recognition weighs more than the table.' }, landed: { es: 'Botón «Felicitar»', en: '“Congratulate” button' } },
  { name: 'Ambition', kind: { es: 'Ventas', en: 'Sales' }, pattern: { es: 'Tablas que se reinician cada semana para que todos puedan volver a empezar.', en: 'Boards that reset weekly so anyone can start over.' }, landed: { es: 'Pulso de la semana', en: 'Weekly pulse' } },
  { name: 'Spinify', kind: { es: 'Gamificación', en: 'Gamification' }, pattern: { es: 'Competir entre equipos parecidos, no contra el más grande.', en: 'Compete among similar teams, not against the biggest one.' }, landed: { es: 'Grupos de tamaño parecido', en: 'Similar-size groups' } },
]

function RefCard({ r, index }: { r: Reference; index: number }) {
  const { t } = useLocale()
  const [flipped, setFlipped] = useState(false)
  return (
    <li data-reveal="pop" className="[perspective:1000px]">
      <button
        type="button"
        aria-pressed={flipped}
        onClick={() => setFlipped((f) => !f)}
        onMouseEnter={() => setFlipped(true)}
        onMouseLeave={() => setFlipped(false)}
        className="relative block h-[230px] w-full text-left"
      >
        <span className={`absolute inset-0 transition-transform duration-700 ease-expo [transform-style:preserve-3d] ${flipped ? '[transform:rotateY(180deg)]' : ''}`}>
          <span className="absolute inset-0 flex flex-col justify-between border border-fg/20 bg-bg p-5 [backface-visibility:hidden]">
            <span className="mono-label opacity-50">0{index + 1} · {t(r.kind)}</span>
            <span className="text-[clamp(1.6rem,1.2rem+1vw,2.2rem)] font-light tracking-tight">{r.name}</span>
            <span className="mono-label opacity-40">{t({ es: 'Gira', en: 'Flip' })} ↻</span>
          </span>
          <span className="absolute inset-0 flex flex-col justify-between bg-signal p-5 text-paper [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <span className="text-[15px] leading-snug">{t(r.pattern)}</span>
            <span>
              <span className="mono-label block opacity-70">{t({ es: 'Dónde se nota', en: 'Where it shows' })}</span>
              <span className="mt-1 block text-sm font-medium">{t(r.landed)}</span>
            </span>
          </span>
        </span>
      </button>
    </li>
  )
}

/** 02 · Patrones: las herramientas revisadas y las reglas que quedaron escritas en el código. */
export function ObjetivosPatterns() {
  const { t } = useLocale()
  const { patterns } = OBJ_CASE
  return (
    <div>
      <p data-reveal className="max-w-[62ch] text-lg leading-relaxed opacity-80">{t(patterns.lead)}</p>
      <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {REFS.map((r, i) => (
          <RefCard key={r.name} r={r} index={i} />
        ))}
        <li data-reveal="pop" className="flex h-[230px] flex-col justify-end border border-dashed border-fg/25 p-5">
          <p className="text-sm leading-relaxed opacity-70">
            {t({ es: 'La pregunta de partida, el 30 de octubre: «estas métricas no me hacen sentido… para incentivar que pongan el progreso».', en: 'The starting question, on October 30: “these metrics don’t make sense to me… to encourage people to log progress”.' })}
          </p>
        </li>
      </ul>

      <p data-reveal className="mono-label mb-6 mt-16 opacity-60">{t({ es: 'Las reglas que quedaron', en: 'The rules that stayed' })}</p>
      <ol className="space-y-px overflow-hidden border border-fg/15 bg-fg/15">
        {patterns.insights.map((rule, i) => (
          <li key={rule.es} data-reveal className="group grid gap-4 bg-bg p-5 transition-colors hover:bg-fg/[0.04] md:grid-cols-[7rem_minmax(0,1fr)]">
            <span className="font-mono text-xs text-signal">regla_{String(i + 1).padStart(2, '0')}</span>
            <span className="text-lg leading-snug">{t(rule)}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useLocale } from '@/lib/i18n'
import { Arrows, Bar, Board, Btn, Hand, Pin, Sketchy, Sticky } from '@/components/case/kit/sketch'

type Writer = 'rrhh' | 'otros'

/** Un paso del recorrido dibujado; se apaga si no está en el camino elegido. */
function StepBox({ label, on }: { label: string; on: boolean }) {
  return (
    <div className={`transition-opacity duration-500 ${on ? 'opacity-100' : 'opacity-25'}`}>
      <Sketchy fill={on ? '#fffdf6' : 'transparent'} className="px-[0.8cqw] py-[0.6cqw] text-center">
        <Hand size={1.35}>{label}</Hand>
      </Sketchy>
    </div>
  )
}

/** Tablero 1: el recorrido del constructor cambia según quién redacta los objetivos. */
function WriterBoard() {
  const { t } = useLocale()
  const [writer, setWriter] = useState<Writer>('rrhh')
  const hr = writer === 'rrhh'
  const row = 300
  const steps = [
    { x: 40, label: 'Parametrización', on: true },
    { x: 250, label: 'Obj. de la empresa', on: true },
    { x: 460, label: 'Participantes', on: true },
    { x: 690, label: 'Obj. asignados', on: hr },
    { x: 900, label: 'Alineación', on: hr },
  ]
  return (
    <div>
      <div role="radiogroup" aria-label={t({ es: '¿Quién redacta los objetivos?', en: 'Who writes the goals?' })} className="mb-4 flex flex-wrap gap-2">
        {([
          ['rrhh', { es: 'Redacta RR. HH.', en: 'HR writes' }],
          ['otros', { es: 'Redactan líderes o colaboradores', en: 'Leads or employees write' }],
        ] as const).map(([id, label]) => (
          <button key={id} type="button" role="radio" aria-checked={writer === id} onClick={() => setWriter(id)} className="mono-label border border-fg/25 px-3 py-2 transition-colors aria-checked:border-signal aria-checked:bg-signal aria-checked:text-paper">
            {t(label)}
          </button>
        ))}
      </div>
      <Board title={t({ es: 'Constructor · ¿quién redacta?', en: 'Builder · who writes?' })} w={1200} h={640} label={t({ es: 'Boceto del recorrido del constructor', en: 'Builder flow sketch' })}>
        <Pin x={40} y={30}>
          <Hand size={2.4} className="font-bold">{t({ es: 'El recorrido no es fijo', en: 'The path isn’t fixed' })}</Hand>
        </Pin>
        <Pin x={40} y={92} w={520}>
          <Hand size={1.5} className="opacity-70">{t({ es: 'Lo decide una sola pregunta en la parametrización.', en: 'One question in setup decides it.' })}</Hand>
        </Pin>
        {steps.map((s) => (
          <Pin key={s.label} x={s.x} y={row} w={190}>
            <StepBox label={s.label} on={s.on} />
          </Pin>
        ))}
        <Arrows
          paths={[
            { d: 'M232 330 L248 330', accent: true },
            { d: 'M442 330 L458 330', accent: true },
            { d: 'M652 330 L688 330', accent: hr, dashed: !hr },
            { d: 'M882 330 L898 330', accent: hr, dashed: !hr },
            { d: 'M560 370 C560 450 600 470 650 480', accent: !hr, dashed: hr },
          ]}
        />
        <Pin x={1000} y={420} w={180}>
          <div className={`transition-opacity duration-500 ${hr ? 'opacity-100' : 'opacity-25'}`}>
            <Btn accent>Crear ciclo</Btn>
          </div>
        </Pin>
        <Pin x={660} y={455} w={300}>
          <div className={`transition-opacity duration-500 ${hr ? 'opacity-25' : 'opacity-100'}`}>
            <Btn accent>Lanzar ciclo</Btn>
            <Hand size={1.35} className="mt-[0.6cqw] block">→ {t({ es: 'cada quien escribe lo suyo → «por aprobar» → el líder aprueba o devuelve', en: 'each person writes theirs → “to approve” → the lead approves or returns' })}</Hand>
          </div>
        </Pin>
        <Pin x={40} y={440} w={250} rotate={-2}>
          <Sticky color="yellow">{t({ es: 'Sin aprobar no lleva avance', en: 'No approval, no progress' })}</Sticky>
        </Pin>
        <Pin x={330} y={500} w={260} rotate={1.5}>
          <Sticky color="blue" small>{t({ es: 'Alineación: detrás de un flag, llega en Q1 2027', en: 'Alignment: behind a flag, lands in Q1 2027' })}</Sticky>
        </Pin>
        <Pin x={900} y={150} w={250} rotate={2}>
          <Sticky color="pink" small>{t({ es: '¿El peso tiene que sumar 100? → no: solo pasarse es error', en: 'Must weight add to 100? → no: only going over is an error' })}</Sticky>
        </Pin>
      </Board>
    </div>
  )
}

const BLOCKS = ['Cómo va', 'Desempeño y objetivos', 'Dónde mirar', 'Dónde se juega el ciclo', 'Qué hacer']

/** Tablero 2: el resumen de resultados y el mapa de alineación, a mano. */
function SummaryBoard() {
  const { t } = useLocale()
  return (
    <Board title={t({ es: 'Resultados · resumen y alineación', en: 'Results · summary and alignment' })} w={1200} h={660} label={t({ es: 'Boceto del resumen y del mapa de alineación', en: 'Summary and alignment map sketch' })}>
      <Pin x={40} y={30}>
        <Hand size={2.4} className="font-bold">{t({ es: 'Un resumen que se lee de arriba abajo', en: 'A summary read top to bottom' })}</Hand>
      </Pin>
      <Pin x={40} y={110} w={430}>
        <Sketchy fill="#fffdf6" className="flex flex-col gap-[0.7cqw] p-[1cqw]">
          {BLOCKS.map((b, i) => (
            <Sketchy key={b} className="flex flex-col gap-[0.4cqw] p-[0.7cqw]">
              <Hand size={1.3} className="font-bold">{i + 1}. {b}</Hand>
              <Bar w={i % 2 ? 60 : 85} />
              <Bar w={i % 2 ? 40 : 55} strong={i === 0} />
            </Sketchy>
          ))}
        </Sketchy>
      </Pin>
      <Pin x={500} y={130} w={210} rotate={-2}>
        <Sticky color="orange">{t({ es: 'Elegido entre seis versiones (23-oct)', en: 'Picked among six versions (Oct 23)' })}</Sticky>
      </Pin>
      <Pin x={760} y={110} w={400}>
        <Hand size={1.6} className="mb-[0.6cqw] block font-bold">{t({ es: 'Alineación', en: 'Alignment' })}</Hand>
        <svg viewBox="0 0 400 300" className="h-auto w-full" aria-hidden="true">
          {[40, 95, 150, 205, 260].map((y, i) => (
            <g key={y}>
              <rect x={8} y={y - 12} width={10} height={24} fill="#2a2d33" rx={2} />
              <path d={`M18 ${y} C200 ${y} 200 ${[70, 70, 150, 230, 230][i]} 372 ${[70, 70, 150, 230, 230][i]}`} fill="none" stroke={i === 2 ? '#e8743b' : '#2a2d33'} strokeOpacity={i === 2 ? 0.9 : 0.35} strokeWidth={[14, 6, 18, 9, 4][i]} strokeLinecap="round" pathLength={1} strokeDasharray={1} data-draw="" />
            </g>
          ))}
          {[70, 150, 230].map((y) => (
            <rect key={y} x={372} y={y - 26} width={12} height={52} fill="#2a2d33" rx={2} />
          ))}
        </svg>
      </Pin>
      <Pin x={780} y={450} w={190} rotate={2}>
        <Sticky color="green" small>{t({ es: 'grosor = cuánto aporta', en: 'thickness = contribution' })}</Sticky>
      </Pin>
      <Pin x={990} y={470} w={180} rotate={-1.5}>
        <Sticky color="violet" small>{t({ es: 'color = cómo va', en: 'colour = progress' })}</Sticky>
      </Pin>
      <Pin x={520} y={520} w={240} rotate={1}>
        <Sticky color="yellow" small>{t({ es: 'Lo que no cuelga de nada → «Sin alinear»', en: 'What hangs from nothing → “Unaligned”' })}</Sticky>
      </Pin>
    </Board>
  )
}

/** 04 · Bocetos: antes de las pantallas, los dos recorridos que más se discutieron. */
export function ObjetivosSketches() {
  const { t } = useLocale()
  return (
    <div className="space-y-16">
      <p data-reveal className="max-w-[62ch] text-lg leading-relaxed opacity-80">
        {t({
          es: 'Dos tableros. El primero responde la pregunta que cambia todo el constructor: ¿quién escribe los objetivos? El segundo, cómo leer un ciclo sin abrir siete reportes. Prueba los dos caminos del primero.',
          en: 'Two boards. The first answers the question that changes the whole builder: who writes the goals? The second, how to read a cycle without opening seven reports. Try both paths on the first one.',
        })}
      </p>
      <WriterBoard />
      <SummaryBoard />
    </div>
  )
}

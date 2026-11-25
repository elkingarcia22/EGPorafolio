'use client'

import { useState } from 'react'
import { useLocale } from '@/lib/i18n'
import { Arrows, Bar, Board, Btn, Doodle, Hand, Pin, Sketchy, SketchPhone, Sticky } from '@/components/case/kit/sketch'
import { MODELS, type ModelId } from './models-data'

/** Qué piezas usa cada modelo en el boceto (de las reglas del playground). */
const PIECES: Record<ModelId, { north: boolean; kids: string | null; closing: string; cadence: string }> = {
  smart: { north: false, kids: 'acciones (plan)', closing: 'acumulado', cadence: 'libre' },
  okr: { north: true, kids: 'resultados clave', closing: 'acumulado', cadence: 'semanal' },
  kpi: { north: false, kids: null, closing: 'umbral', cadence: 'mensual' },
  nct: { north: true, kids: 'tareas', closing: 'acumulado', cadence: 'semanal' },
  mbo: { north: true, kids: 'hitos', closing: 'cumplió / no', cadence: 'libre' },
}

function Piece({ on, children, fill = '#fffdf6' }: { on: boolean; children: React.ReactNode; fill?: string }) {
  return (
    <div className={`transition-[opacity,transform] duration-500 ${on ? 'opacity-100' : 'scale-95 opacity-20'}`}>
      <Sketchy fill={on ? fill : 'transparent'} className="px-[0.9cqw] py-[0.6cqw] text-center">
        {children}
      </Sketchy>
    </div>
  )
}

/** Tablero 3: un objetivo desarmado en piezas; cada modelo enciende las suyas. */
export function PiecesBoard() {
  const { t } = useLocale()
  const [model, setModel] = useState<ModelId>('okr')
  const p = PIECES[model]
  return (
    <div>
      <div role="radiogroup" aria-label={t({ es: 'Modelo del boceto', en: 'Sketch model' })} className="mb-4 flex flex-wrap gap-2">
        {MODELS.map((m) => (
          <button key={m.id} type="button" role="radio" aria-checked={model === m.id} onClick={() => setModel(m.id)} className="mono-label border border-fg/25 px-3 py-2 transition-colors aria-checked:border-signal aria-checked:bg-signal aria-checked:text-on-signal">
            {m.label}
          </button>
        ))}
      </div>
      <Board title={t({ es: 'Modelo · las mismas piezas', en: 'Model · the same pieces' })} w={1200} h={660} label={t({ es: 'Boceto de un objetivo desarmado en piezas', en: 'Sketch of a goal taken apart into pieces' })}>
        <Pin x={40} y={30}>
          <Hand size={2.4} className="font-bold">{t({ es: 'Un objetivo, desarmado', en: 'A goal, taken apart' })}</Hand>
        </Pin>
        <Pin x={40} y={92} w={460}>
          <Hand size={1.5} className="opacity-70">{t({ es: 'Si cada modelo es una combinación, el producto solo tiene que exponer las piezas.', en: 'If each model is a combination, the product only has to expose the pieces.' })}</Hand>
        </Pin>

        <Pin x={420} y={170} w={360}>
          <Piece on={p.north} fill="#bfe0ff">
            <Hand size={1.5}>★ norte de la empresa</Hand>
          </Piece>
        </Pin>
        <Pin x={380} y={290} w={440}>
          <Piece on>
            <Hand size={1.8} className="font-bold">{t({ es: 'objetivo', en: 'goal' })}</Hand>
            <div className="mx-auto mt-[0.5cqw] flex w-[80%] flex-col items-center gap-[0.4cqw]">
              <Bar w={90} strong />
              <Bar w={60} />
            </div>
          </Piece>
        </Pin>
        <Pin x={300} y={470} w={270}>
          <Piece on={p.kids !== null}>
            <Hand size={1.4}>{p.kids ?? 'nada debajo'}</Hand>
          </Piece>
        </Pin>
        <Pin x={630} y={470} w={270}>
          <Piece on={p.kids !== null}>
            <Hand size={1.4}>{p.kids ?? 'nada debajo'}</Hand>
          </Piece>
        </Pin>

        {[
          { y: 200, label: 'medida', value: '$ % # ✓' },
          { y: 300, label: 'cierre', value: p.closing },
          { y: 400, label: 'cadencia', value: p.cadence },
        ].map((tag) => (
          <Pin key={tag.label} x={930} y={tag.y} w={220}>
            <Sketchy fill="#fffdf6" className="flex items-baseline justify-between gap-[0.6cqw] px-[0.8cqw] py-[0.5cqw]">
              <Hand size={1.2} className="opacity-60">{tag.label}</Hand>
              <Hand key={tag.value} size={1.45} className="obj-fade font-bold">{tag.value}</Hand>
            </Sketchy>
          </Pin>
        ))}

        <Arrows
          paths={[
            { d: 'M600 240 L600 286', accent: p.north, dashed: !p.north },
            { d: 'M520 420 C480 440 450 450 440 466', accent: p.kids !== null, dashed: p.kids === null },
            { d: 'M680 420 C720 440 750 450 760 466', accent: p.kids !== null, dashed: p.kids === null },
            { d: 'M822 340 L924 330' },
          ]}
        />

        <Pin x={40} y={230} w={250} rotate={-2.5}>
          <Sticky color="yellow">{t({ es: 'BHAG no entra: 10 a 25 años no caben en un ciclo', en: 'BHAG is out: 10 to 25 years don’t fit a cycle' })}</Sticky>
        </Pin>
        <Pin x={40} y={430} w={220} rotate={2}>
          <Sticky color="pink" small>{t({ es: '«Personalizado» = el mismo panel con los candados abiertos', en: '“Custom” = the same panel with the locks open' })}</Sticky>
        </Pin>
        <Pin x={930} y={500} w={230} rotate={-1.5}>
          <Sticky color="green" small>{t({ es: 'Cada modelo trae su vocabulario: Indicador, Compromiso, Meta…', en: 'Each model brings its words: Indicator, Commitment, Goal…' })}</Sticky>
        </Pin>
      </Board>
    </div>
  )
}

/** Tablero 4: el colaborador reporta desde el celular y el líder aprueba o devuelve. */
export function ReportBoard() {
  const { t } = useLocale()
  return (
    <Board title={t({ es: 'Colaborador y líder · reportar y aprobar', en: 'Employee and lead · report and approve' })} w={1400} h={760} label={t({ es: 'Boceto de tres pantallas de celular y la bandeja del líder', en: 'Sketch of three phone screens and the lead’s inbox' })}>
      <Pin x={40} y={30}>
        <Hand size={2.2} className="font-bold">{t({ es: 'Reportar tiene que tomar segundos', en: 'Reporting has to take seconds' })}</Hand>
      </Pin>

      <Pin x={60} y={120} w={210}>
        <SketchPhone title={t({ es: '1 · mis objetivos', en: '1 · my goals' })}>
          {['Ventas Q4', 'NPS', 'Lanzar CRM'].map((g, i) => (
            <Sketchy key={g} className="flex flex-col gap-[0.35cqw] p-[0.55cqw]">
              <Hand size={1.05} className="font-bold">{g}</Hand>
              <Bar w={[62, 40, 85][i]} strong={i === 0} />
            </Sketchy>
          ))}
          <Hand size={0.95} className="mt-auto text-center opacity-60">3 · por aprobar 1</Hand>
        </SketchPhone>
      </Pin>
      <Pin x={330} y={120} w={210}>
        <SketchPhone title={t({ es: '2 · reportar', en: '2 · report' })}>
          <Hand size={1.05} className="font-bold">Ventas Q4</Hand>
          <Sketchy fill="#fffdf6" className="p-[0.55cqw] text-center">
            <Hand size={1.8}>$ 62 M</Hand>
          </Sketchy>
          <Sketchy className="p-[0.5cqw]">
            <Bar w={80} />
            <Bar w={50} />
          </Sketchy>
          <Hand size={0.95} className="opacity-60">📎 evidencia</Hand>
          <div className="mt-auto">
            <Btn accent>Reportar</Btn>
          </div>
        </SketchPhone>
      </Pin>
      <Pin x={600} y={120} w={210}>
        <SketchPhone title={t({ es: '3 · listo', en: '3 · done' })}>
          <div className="mt-[1cqw] flex flex-1 flex-col items-center gap-[0.6cqw]">
            <div className="w-[60%]">
              <Doodle paths={['M20 52 L42 72 L80 30']} accent={['M50 6 A44 44 0 1 1 49.9 6']} />
            </div>
            <Hand size={1.3} className="text-center font-bold">En racha · 4 semanas</Hand>
            <Hand size={1} className="text-center opacity-60">queda en el historial</Hand>
          </div>
        </SketchPhone>
      </Pin>
      <Arrows paths={[{ d: 'M276 360 L322 360', accent: true }, { d: 'M546 360 L592 360', accent: true }]} />

      <Pin x={900} y={110} w={460}>
        <Hand size={1.5} className="mb-[0.6cqw] block font-bold">{t({ es: 'Bandeja del líder', en: 'Lead inbox' })}</Hand>
        <Sketchy fill="#fffdf6" className="flex flex-col gap-[0.6cqw] p-[1cqw]">
          {[
            ['Carlos N.', 'Cerrar 12 cuentas'],
            ['Marta R.', 'Bajar quejas a 10'],
            ['Iván T.', 'Mejorar el servicio'],
          ].map(([who, goal], i) => (
            <Sketchy key={who} className="flex items-center gap-[0.8cqw] p-[0.6cqw]">
              <span className="block h-[2.2cqw] w-[2.2cqw] shrink-0 rounded-full border-[0.18cqw] border-[#2a2d33]" />
              <span className="flex-1">
                <Hand size={1.1} className="block font-bold">{who}</Hand>
                <Hand size={1} className="block opacity-70">{goal}</Hand>
              </span>
              <span className="w-[24%]"><Btn accent={i < 2}>{i < 2 ? 'Aprobar' : 'Devolver'}</Btn></span>
            </Sketchy>
          ))}
        </Sketchy>
      </Pin>
      <Pin x={1010} y={470} w={300} rotate={2}>
        <Sticky color="orange" small>{t({ es: 'Devolver pide un motivo: «no es medible», «no apunta al norte»…', en: 'Returning asks for a reason: “not measurable”, “doesn’t point north”…' })}</Sticky>
      </Pin>
      <Pin x={80} y={600} w={300} rotate={-2}>
        <Sticky color="yellow">{t({ es: 'Se premia volver a reportar, no el % crudo', en: 'Coming back to report is rewarded, not raw %' })}</Sticky>
      </Pin>
      <Pin x={450} y={620} w={330} rotate={1.5}>
        <Sticky color="blue" small>{t({ es: 'Recordatorios: de diario a cada 6 meses, según el ciclo', en: 'Reminders: from daily to every 6 months, per cycle' })}</Sticky>
      </Pin>
      <Pin x={860} y={600} w={140} rotate={-3}>
        <Sticky color="violet" small>{t({ es: 'sin aprobar = sin avance', en: 'no approval = no progress' })}</Sticky>
      </Pin>
    </Board>
  )
}

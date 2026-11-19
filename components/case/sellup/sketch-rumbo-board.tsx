'use client'

import { useLocale } from '@/lib/i18n'
import { Arrows, Bar, Board, Btn, Doodle, Guides, Hand, Pin, Sketchy, Sticky } from '@/components/case/kit/sketch'
import { SwipeBoard } from './swipe-board'

/**
 * Boceto de cómo se construyó Rumbo: la marca, la conversación, un solo Rumbo
 * para los tres agentes y su línea de tiempo (fechas de los PR del repo SellUp).
 */

const ORB = ['M50 18 A32 32 0 1 1 49.9 18', 'M62 30 Q70 34 72 44']
const SPARK = ['M50 14 L56 44 L86 50 L56 56 L50 86 L44 56 L14 50 L44 44 Z']
const CROSS = ['M14 14 L86 86', 'M86 14 L14 86']
const COMPASS = ['M50 14 A36 36 0 1 1 49.9 14']
const NEEDLE = ['M60 26 L58 54 L50 48 L44 58 Z']

export function RumboSketchBoard() {
  const { t } = useLocale()
  const steps = ['Tipo', 'País', 'Industria', 'Criterios', 'Resumen', 'Revisión']
  return (
    <SwipeBoard designW={1400} stops={[20, 490, 920, 990]}>
    <Board title={t({ es: 'Rumbo · cómo se construyó', en: 'Rumbo · how it was built' })} w={1400} h={850} label={t({ es: 'Bocetos de la construcción de Rumbo', en: 'Sketches of how Rumbo was built' })}>
      <Pin x={36} y={26}><Hand size={2.4} className="font-bold">{t({ es: 'Rumbo: una sola IA que te dice qué sigue', en: 'Rumbo: one AI that tells you what’s next' })}</Hand></Pin>

      {/* 1 · La marca */}
      <Pin x={36} y={100} w={400}><Hand size={1.6} className="font-bold">1 · {t({ es: 'La marca', en: 'The mark' })}</Hand></Pin>
      <Pin x={40} y={150} w={110}><div className="relative"><Doodle paths={ORB} /><div className="absolute inset-0 opacity-60"><Doodle paths={CROSS} strokeWidth={2} /></div></div></Pin>
      <Pin x={30} y={268} w={140}><Hand size={1.05}>{t({ es: '¿una esfera? no dice qué hace', en: 'a sphere? says nothing' })}</Hand></Pin>
      <Pin x={180} y={150} w={110}><div className="relative"><Doodle paths={SPARK} /><div className="absolute inset-0 opacity-60"><Doodle paths={CROSS} strokeWidth={2} /></div></div></Pin>
      <Pin x={176} y={268} w={130}><Hand size={1.05}>{t({ es: 'la chispa: es de todos', en: 'the spark: everyone uses it' })}</Hand></Pin>
      <Pin x={320} y={140} w={130}><Doodle paths={COMPASS} accent={NEEDLE} /></Pin>
      <Pin x={306} y={278} w={170}><Hand size={1.1} className="font-bold">{t({ es: '✓ brújula: la aguja es una flecha que sube', en: '✓ compass: the needle is an arrow going up' })}</Hand></Pin>
      <Pin x={40} y={340} w={400} rotate={-1.5}><Sticky color="pink">{t({ es: '«Donde esté lo de IA debe estar el logo de Rumbo» → en botones, cargadores y cabeceras', en: '“Wherever AI is, Rumbo’s logo goes” → buttons, loaders and headers' })}</Sticky></Pin>

      {/* 2 · La conversación */}
      <Pin x={500} y={100} w={420}><Hand size={1.6} className="font-bold">2 · {t({ es: 'Una conversación, no un formulario', en: 'A conversation, not a form' })}</Hand></Pin>
      <Pin x={500} y={150} w={400}>
        <Sketchy fill="#fff" className="space-y-[0.8cqw] p-[1.2cqw]">
          <div className="flex items-center gap-[0.6cqw]">
            <span className="inline-block h-[2cqw] w-[2cqw] rounded-[0.5cqw] border-2 border-[#2a2d33]" />
            <Hand size={1.3} className="font-bold">Rumbo</Hand>
            <Hand size={0.95} className="opacity-60">{t({ es: 'generar empresas', en: 'generate companies' })}</Hand>
          </div>
          <div className="flex justify-between">
            {steps.map((s, i) => (
              <span key={s} className="flex flex-col items-center">
                <span className={`grid h-[1.6cqw] w-[1.6cqw] place-items-center rounded-full border-2 border-[#2a2d33] ${i === 1 ? 'bg-[#e8743b]' : ''}`} />
                <Hand size={0.8}>{s}</Hand>
              </span>
            ))}
          </div>
          <Bar w={70} /><Bar w={55} />
          <div className="ml-auto w-[45%]"><Sketchy fill="#dfe6ff" className="px-[0.6cqw]"><Hand size={1}>México</Hand></Sketchy></div>
          <Bar w={60} />
          <div className="space-y-[0.4cqw]">
            <Btn>{t({ es: 'Empresas por criterios', en: 'Companies by criteria' })}</Btn>
            <Btn>{t({ es: 'Competidores de una empresa', en: 'A company’s competitors' })}</Btn>
            <Btn accent>{t({ es: 'Ver resumen antes de buscar', en: 'See summary before searching' })}</Btn>
          </div>
        </Sketchy>
      </Pin>
      <Pin x={930} y={190} w={200} rotate={2}><Sticky color="yellow">{t({ es: 'Preguntar solo lo justo: 6 pasos, una pregunta por paso', en: 'Ask only what’s needed: 6 steps, one question each' })}</Sticky></Pin>
      <Pin x={930} y={380} w={200} rotate={-2}><Sticky color="green">{t({ es: 'El resumen con el costo va ANTES de gastar créditos', en: 'The summary with the cost comes BEFORE spending credits' })}</Sticky></Pin>

      {/* 3 · Un solo Rumbo */}
      <Pin x={1170} y={100} w={220}><Hand size={1.6} className="font-bold">3 · {t({ es: 'Un solo Rumbo', en: 'One Rumbo' })}</Hand></Pin>
      <Pin x={1205} y={160} w={150}><Sketchy fill="#f4e9ff" className="py-[0.8cqw] text-center"><Hand size={1.4} className="font-bold">Rumbo</Hand></Sketchy></Pin>
      <Pin x={1170} y={290} w={210}><Sketchy fill="#fff" className="px-[0.8cqw] py-[0.4cqw]"><Hand size={1.05}>A1 · {t({ es: 'busca empresas', en: 'finds companies' })}</Hand></Sketchy></Pin>
      <Pin x={1170} y={360} w={210}><Sketchy fill="#fff" className="px-[0.8cqw] py-[0.4cqw]"><Hand size={1.05}>A2 · {t({ es: 'busca contactos', en: 'finds contacts' })}</Hand></Sketchy></Pin>
      <Pin x={1170} y={430} w={210}><Sketchy fill="#fff" className="px-[0.8cqw] py-[0.4cqw]"><Hand size={1.05}>A3 · {t({ es: 'investiga y prepara', en: 'researches & prepares' })}</Hand></Sketchy></Pin>
      <Pin x={1170} y={510} w={210}>
        <Hand size={1.05} className="mb-1 block">{t({ es: 'y se abre desde la barra:', en: 'and opens from the bar:' })}</Hand>
        <Sketchy fill="#fff" className="flex gap-[0.4cqw] p-[0.5cqw]"><Btn>⋮</Btn><Btn accent>{t({ es: 'Generar con Rumbo', en: 'Generate with Rumbo' })}</Btn></Sketchy>
      </Pin>

      {/* 4 · Línea de tiempo */}
      <Pin x={36} y={640}><Hand size={1.6} className="font-bold">4 · {t({ es: 'Cuatro días de octubre', en: 'Four days in October' })}</Hand></Pin>
      <Guides lines={[{ d: 'M60 740 L1340 740', accent: true }]} />
      {[
        { x: 60, d: '18-10', es: 'Nace Rumbo: investiga al decisor y conoce el portafolio de UBITS', en: 'Rumbo is born: researches the decision-maker and knows UBITS’s portfolio' },
        { x: 380, d: '19-10', es: 'Su marca en todo lo de IA; un redactor por canal; estilo de cada país', en: 'Its mark on all AI; one writer per channel; each country’s style' },
        { x: 700, d: '20-10', es: 'Un solo panel, Rumbo desde la barra; listo para los 20 países', en: 'One panel, Rumbo from the bar; ready for 20 countries' },
        { x: 1020, d: '21-10', es: 'Robusto y que aprende: de los descartes y de «La usé»', en: 'Robust and learning: from discards and “I used it”' },
      ].map((m) => (
        <Pin key={m.d} x={m.x} y={705} w={300}>
          <span className="block h-[1.4cqw] w-[1.4cqw] rounded-full border-2 border-[#2a2d33] bg-[#e8743b]" />
          <Hand size={1.4} className="mt-[0.8cqw] block font-bold">{m.d}</Hand>
          <Hand size={1.1} className="block">{t({ es: m.es, en: m.en })}</Hand>
        </Pin>
      ))}

      <Arrows
        paths={[
          { d: 'M290 210 Q300 205 316 205', accent: true },
          { d: 'M1280 222 L1260 286' },
          { d: 'M1280 222 Q1150 300 1170 370', dashed: true },
          { d: 'M1280 222 Q1420 330 1380 440', dashed: true },
          { d: 'M905 300 Q920 280 930 260' },
        ]}
      />
    </Board>
    </SwipeBoard>
  )
}

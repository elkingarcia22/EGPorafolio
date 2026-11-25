'use client'

import { useLocale } from '@/lib/i18n'
import { Arrows, Bar, Board, Btn, Hand, Pin, Sketchy, Sticky } from '@/components/case/kit/sketch'
import { CaseLead } from '@/components/case/case-lead'
import { SwipeBoard } from './swipe-board'

/** Una celda dibujada de la matriz decisor × canal. */
function Cell({ state }: { state: 'done' | 'empty' | 'review' }) {
  const fill = state === 'done' ? '#c9efc0' : state === 'review' ? '#ffe98a' : 'transparent'
  return (
    <Sketchy fill={fill} className="grid aspect-[4/3] place-items-center">
      <Hand size={1.4}>{state === 'done' ? '✓' : state === 'review' ? '!' : '+'}</Hand>
    </Sketchy>
  )
}

/** 04 · Bocetos: las tres bandejas donde decide la persona, dibujadas antes de construir. */
export function SellUpSketches() {
  const { t } = useLocale()
  const matrix: ('done' | 'empty' | 'review')[][] = [
    ['done', 'done', 'review', 'empty'],
    ['done', 'empty', 'empty', 'empty'],
    ['empty', 'empty', 'empty', 'empty'],
  ]
  return (
    <div>
      <CaseLead className="mb-10">
        {t({
          es: 'Antes de escribir un agente dibujé dónde se detiene la cadena: tres bandejas donde decide la persona.',
          en: 'Before writing an agent I drew where the chain stops: three queues where the person decides.',
        })}
      </CaseLead>
      <SwipeBoard designW={1400} stops={[20, 494, 968]}>
      <Board title={t({ es: 'SellUp · donde decide la persona', en: 'SellUp · where the person decides' })} w={1400} h={820} label={t({ es: 'Bocetos de las tres bandejas de revisión', en: 'Sketches of the three review queues' })}>
        <Pin x={36} y={26}><Hand size={2.4} className="font-bold">{t({ es: 'Tres bandejas, una regla: nada entra solo', en: 'Three queues, one rule: nothing gets in on its own' })}</Hand></Pin>

        {/* 1 · Por revisar */}
        <Pin x={36} y={110} w={380}>
          <Hand size={1.6} className="mb-2 block font-bold">1 · {t({ es: 'Por revisar', en: 'To review' })}</Hand>
          <Sketchy fill="#fff" className="space-y-[0.7cqw] p-[1.2cqw]">
            <Bar w={60} strong />
            <div className="flex gap-[0.5cqw]">
              <Sketchy fill="#c9efc0" className="px-[0.5cqw]"><Hand size={1}>{t({ es: 'Libre en HubSpot', en: 'Free in HubSpot' })}</Hand></Sketchy>
              <Sketchy className="px-[0.5cqw]"><Hand size={1}>NIT ✓</Hand></Sketchy>
            </div>
            <Hand size={1.15} className="block">{t({ es: '«Está en HubSpot, en la bolsa Sales México, sin actividad hace 120 días»', en: '“It’s in HubSpot, in the Sales Mexico pool, no activity for 120 days”' })}</Hand>
            <Bar w={90} /><Bar w={70} />
            <div className="grid grid-cols-2 gap-[0.6cqw] pt-[0.4cqw]"><Btn accent>{t({ es: 'Aprobar', en: 'Approve' })}</Btn><Btn>{t({ es: 'Descartar', en: 'Discard' })}</Btn></div>
          </Sketchy>
        </Pin>
        <Pin x={60} y={560} w={300} rotate={-2}><Sticky color="yellow">{t({ es: 'Una frase que diga si es nueva, duplicada o libre… y DÓNDE está', en: 'One sentence saying if it’s new, duplicate or free… and WHERE it is' })}</Sticky></Pin>

        {/* 2 · Contactos */}
        <Pin x={510} y={110} w={380}>
          <Hand size={1.6} className="mb-2 block font-bold">2 · {t({ es: 'Contactos por revisar', en: 'Contacts to review' })}</Hand>
          <Sketchy fill="#fff" className="space-y-[0.9cqw] p-[1.2cqw]">
            {[0, 1, 2].map((r) => (
              <div key={r} className="flex items-center gap-[0.6cqw]">
                <span className="h-[2cqw] w-[2cqw] shrink-0 rounded-full border-[0.18cqw] border-[#2a2d33]" />
                <div className="flex-1 space-y-[0.3cqw]"><Bar w={70} strong={r === 0} /><Bar w={45} /></div>
                <Hand size={0.95}>{r === 1 ? 'HubSpot' : t({ es: 'nuevo', en: 'new' })}</Hand>
              </div>
            ))}
            <Btn accent>☎ {t({ es: 'Revelar teléfono', en: 'Reveal phone' })}</Btn>
          </Sketchy>
        </Pin>
        <Pin x={540} y={520} w={320} rotate={1.8}><Sticky color="pink">{t({ es: 'Un clic, dos proveedores: Apollo y, si no hay, Lusha. Tope 13 créditos', en: 'One click, two providers: Apollo and, if nothing, Lusha. Cap 13 credits' })}</Sticky></Pin>
        <Pin x={560} y={680} w={290} rotate={-1.4}><Sticky color="blue" small>{t({ es: '¿Ya lo pagamos? → «Ver más números» gratis', en: 'Already paid? → “See more numbers” for free' })}</Sticky></Pin>

        {/* 3 · Primer contacto */}
        <Pin x={984} y={110} w={380}>
          <Hand size={1.6} className="mb-2 block font-bold">3 · {t({ es: 'Primer contacto', en: 'First contact' })}</Hand>
          <Sketchy fill="#fff" className="p-[1.2cqw]">
            <div className="mb-[0.6cqw] grid grid-cols-[3.5cqw_repeat(4,minmax(0,1fr))] gap-[0.5cqw] text-center">
              <span />
              {['☎', '✉', 'WA', 'in'].map((c) => <Hand key={c} size={1.1}>{c}</Hand>)}
            </div>
            {matrix.map((row, r) => (
              <div key={r} className="mb-[0.5cqw] grid grid-cols-[3.5cqw_repeat(4,minmax(0,1fr))] items-center gap-[0.5cqw]">
                <span className="h-[2.2cqw] w-[2.2cqw] rounded-full border-[0.18cqw] border-[#2a2d33]" />
                {row.map((s, c) => <Cell key={c} state={s} />)}
              </div>
            ))}
            <div className="pt-[0.6cqw]"><Btn accent>{t({ es: 'Preparar lo que falta', en: 'Prepare what’s missing' })}</Btn></div>
          </Sketchy>
        </Pin>
        <Pin x={1010} y={560} w={320} rotate={-1.6}><Sticky color="green">{t({ es: 'Decisor × canal. Cada celda vacía prepara justo eso', en: 'Decision-maker × channel. Each empty cell prepares exactly that' })}</Sticky></Pin>
        <Pin x={1040} y={700} w={280} rotate={2}><Sticky color="orange" small>{t({ es: 'Cada dato con su cita. Sin cita = no es un hecho', en: 'Every fact with its quote. No quote = not a fact' })}</Sticky></Pin>

        <Arrows paths={[{ d: 'M420 300 C 455 290, 470 290, 505 300', accent: true }, { d: 'M894 300 C 930 290, 945 290, 980 300', accent: true }]} />
        <Pin x={432} y={250}><Hand size={1.2} className="text-[#e8743b]">{t({ es: 'aprobar', en: 'approve' })}</Hand></Pin>
        <Pin x={906} y={250}><Hand size={1.2} className="text-[#e8743b]">{t({ es: 'aprobar', en: 'approve' })}</Hand></Pin>
      </Board>
      </SwipeBoard>
    </div>
  )
}

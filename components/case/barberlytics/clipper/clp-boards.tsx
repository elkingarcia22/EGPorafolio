'use client'

import { useLocale } from '@/lib/i18n'
import { Arrows, Board, Btn, Hand, Pin, Sketchy, SketchPhone, Sticky } from '@/components/case/kit/sketch'
import { CLIPPER_CASE } from '@/lib/content/cases/barberlytics/clipper-case'
import { ClipperOrb } from '../clipper-orb'

const FLOWS = CLIPPER_CASE.flows
/** Dónde va cada post-it a la derecha del tablero */
const STICKY_AT = [
  { y: 120, rotate: -2 },
  { y: 300, rotate: 1.5 },
  { y: 460, rotate: -1 },
] as const

/**
 * Un tablero de bocetos: la conversación dibujada en tres celulares (lo que
 * pregunta la persona, Clipper consultando y la respuesta) y, al lado, los
 * post-its con las reglas que ese flujo tenía que cumplir.
 */
function FlowBoard({ i }: { i: number }) {
  const { t } = useLocale()
  const f = FLOWS[i]
  return (
    <Board title={`Clipper · ${t(f.name).toLowerCase()}`} w={1200} h={660} label={t({ es: `Boceto del flujo de ${t(f.name).toLowerCase()}`, en: `${t(f.name)} flow sketch` })}>
      <Pin x={40} y={30}>
        <Hand size={2.4} className="font-bold">{t(f.name)}</Hand>
        <span className="ml-[1cqw] font-mono text-[1.1cqw] uppercase tracking-[0.12em] opacity-50">{t(f.who)}</span>
      </Pin>

      <Pin x={40} y={110} w={220}>
        <SketchPhone title={t({ es: '1 · pregunta', en: '1 · asks' })}>
          <div className="my-auto ml-auto w-[92%]">
            <Sketchy fill="#fffdf6" className="p-[0.7cqw]">
              <Hand size={1.45}>«{t(f.q)}»</Hand>
            </Sketchy>
          </div>
          <Hand size={1.05} className="text-right opacity-55">{t({ es: 'por voz o escrito', en: 'by voice or typed' })}</Hand>
        </SketchPhone>
      </Pin>

      <Pin x={320} y={110} w={220}>
        <SketchPhone title={t({ es: '2 · Clipper consulta', en: '2 · Clipper looks up' })}>
          <div className="flex flex-1 flex-col items-center justify-center gap-[0.8cqw]">
            <ClipperOrb size={72} state="thinking" />
            <Hand size={1.25} className="opacity-60">{t({ es: 'elige la herramienta', en: 'picks the tool' })}</Hand>
            <Sketchy className="px-[0.6cqw] py-[0.3cqw]">
              <span className="font-mono text-[1.05cqw]">{f.tool}</span>
            </Sketchy>
          </div>
        </SketchPhone>
      </Pin>

      <Pin x={600} y={110} w={220}>
        <SketchPhone title={t({ es: '3 · responde', en: '3 · answers' })}>
          <div className="my-auto w-[96%]">
            <Sketchy fill="#ffe7c7" className="p-[0.7cqw]">
              <Hand size={1.35}>{t(f.a)}</Hand>
            </Sketchy>
          </div>
          {'actions' in f && (
            <div className="grid grid-cols-2 gap-[0.4cqw]">
              {f.actions.map((a, k) => (
                <Btn key={a.es} accent={k === 0}>{t(a)}</Btn>
              ))}
            </div>
          )}
        </SketchPhone>
      </Pin>

      <Arrows paths={[{ d: 'M266 360 L314 360', accent: true }, { d: 'M546 360 L594 360', accent: true }]} />

      {f.stickies.map((s, k) => (
        <Pin key={s.text.es} x={870} y={STICKY_AT[k].y} w={290} rotate={STICKY_AT[k].rotate}>
          <Sticky color={s.color}>{t(s.text)}</Sticky>
        </Pin>
      ))}
    </Board>
  )
}

/** Los cuatro tableros, uno por necesidad */
export const CLIPPER_BOARDS = FLOWS.map((f, i) => ({
  title: f.name,
  Board: function ClipperFlowBoard() {
    return <FlowBoard i={i} />
  },
}))

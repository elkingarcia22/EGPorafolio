'use client'

import { useLocale } from '@/lib/i18n'
import { Arrows, Board, Btn, Hand, Pin, Sketchy, Sticky } from '@/components/case/kit/sketch'

/* ── Tablero 1: anatomía de la tarjeta ───────────────────────────────── */

const DENSITIES = [
  { label: 'compacta', h: 60 },
  { label: 'normal', h: 84 },
  { label: 'amplia', h: 112 },
] as const

export function CardAnatomyBoard() {
  const { t } = useLocale()
  return (
    <Board title={t({ es: 'Calendario · anatomía de la tarjeta', en: 'Calendar · card anatomy' })} w={1400} h={720} label={t({ es: 'Boceto a mano de la tarjeta de una cita con sus partes anotadas', en: 'Hand sketch of an appointment card with its parts annotated' })}>
      <Pin x={50} y={30}>
        <Hand size={2.4} className="font-bold">{t({ es: 'La tarjeta: todo lo que se ve sin abrir nada', en: 'The card: everything visible without opening anything' })}</Hand>
      </Pin>

      <Pin x={120} y={150} w={500}>
        <Sketchy fill="#fff7ea" className="px-[1.4cqw] py-[1.2cqw]">
          <div className="flex items-center gap-[0.8cqw]">
            <span className="h-[0.9cqw] w-[0.9cqw] rounded-full border-[0.18cqw] border-[#2a2d33] bg-[#bfe0ff]" />
            <Hand size={2} className="font-bold">Mariana Ramírez</Hand>
            <span className="ml-auto"><Sketchy className="px-[0.6cqw]"><Hand size={1.2}>RETENIDO</Hand></Sketchy></span>
          </div>
          <div className="mt-[0.8cqw]"><Hand size={1.5} className="opacity-70">Corte + barba · US$ 59</Hand></div>
          <div className="mt-[2.4cqw] flex items-center justify-between">
            <Sketchy fill="#ffd2a8" className="px-[0.8cqw]"><Hand size={1.3}>● En silla</Hand></Sketchy>
            <Btn accent>Cobrar</Btn>
          </div>
        </Sketchy>
      </Pin>

      <Pin x={700} y={120} w={300}><Hand size={1.5}>{t({ es: 'tipo de cliente: Nuevo → Retenido → Frecuente → VIP', en: 'client type: New → Retained → Frequent → VIP' })}</Hand></Pin>
      <Pin x={700} y={235} w={300}><Hand size={1.5}>{t({ es: 'servicio + precio (se pueden ocultar)', en: 'service + price (can be hidden)' })}</Hand></Pin>
      <Pin x={700} y={330} w={300}><Hand size={1.5}>{t({ es: 'etapa en vivo: se deduce sola (5 min sin llegar = Tarde)', en: 'live stage: worked out alone (5 min no-show = Late)' })}</Hand></Pin>
      <Pin x={700} y={440} w={300}><Hand size={1.5} className="font-bold text-[#e8743b]">{t({ es: 'UN botón: el siguiente paso', en: 'ONE button: the next step' })}</Hand></Pin>
      <Arrows
        paths={[
          { d: 'M695,140 C640,140 610,165 590,180' },
          { d: 'M695,250 C600,250 520,240 470,232' },
          { d: 'M695,345 C560,350 380,330 300,318' },
          { d: 'M695,455 C650,440 600,360 585,325', accent: true },
        ]}
      />

      <Pin x={1060} y={120} w={300} rotate={2}>
        <Sticky color="yellow">{t({ es: 'Color por estado, servicio o cliente: lo elige cada persona', en: 'Color by status, service or client: each person chooses' })}</Sticky>
      </Pin>
      <Pin x={1070} y={330} w={290} rotate={-1.5}>
        <Sticky color="pink">{t({ es: 'Alergia: el único aviso que no se puede apagar', en: 'Allergy: the only hint that can’t be turned off' })}</Sticky>
      </Pin>

      <Pin x={120} y={560}><Hand size={1.5} className="font-bold">{t({ es: 'densidad →', en: 'density →' })}</Hand></Pin>
      {DENSITIES.map((d, i) => (
        <Pin key={d.label} x={290 + i * 150} y={560} w={120}>
          <Sketchy fill="rgba(255,255,255,0.7)" className="px-[0.6cqw] py-[0.4cqw]">
            <span className="block" style={{ height: `${d.h / 14}cqw` }}><Hand size={1.15}>{d.label}</Hand></span>
          </Sketchy>
        </Pin>
      ))}
    </Board>
  )
}

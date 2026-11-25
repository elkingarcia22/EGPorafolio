'use client'

import { useLocale } from '@/lib/i18n'
import { Arrows, Board, Btn, Guides, Hand, Pin, Sketchy, Sticky } from '@/components/case/kit/sketch'

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

/* ── Tablero 2: el calendario que propone ─────────────────────────────── */

const SLOT = 70 // px de tablero por media hora
const TOP = 160
const COLS = [130, 380, 630]
const COL_INNER = 225
const BARBERS = ['Andrés', 'Emilio', 'Paola']
const TIMES = ['3:00', '3:30', '4:00', '4:30', '5:00', '5:30']

const APPTS = [
  { col: 1, start: 0, len: 1.5, name: 'Gael · corte' },
  { col: 1, start: 1.5, len: 1.5, name: 'Marcela · fade' },
  { col: 1, start: 3, len: 1, name: 'Santi · barba' },
  { col: 0, start: 1, len: 2, name: 'Renata · VIP' },
  { col: 2, start: 2, len: 1.5, name: 'Diego · corte' },
]

const LATE = 0.6 // medias horas de retraso (≈ 20 min)

export function ProposeBoard() {
  const { t } = useLocale()
  return (
    <Board title={t({ es: 'Calendario · reacomodo por retraso', en: 'Calendar · delay reflow' })} w={1400} h={720} label={t({ es: 'Wireframe a mano del calendario que propone mover citas', en: 'Hand-drawn wireframe of the calendar proposing to move appointments' })}>
      <Pin x={40} y={30}>
        <Hand size={2.4} className="font-bold">{t({ es: '«Emilio llega 20 min tarde»', en: '“Emilio is running 20 min late”' })}</Hand>
      </Pin>

      <Pin x={40} y={100} w={830}>
        <Sketchy className="h-[33cqw]" />
      </Pin>
      {BARBERS.map((b, i) => (
        <Pin key={b} x={COLS[i]} y={112} w={COL_INNER}>
          <Hand size={1.6} className={`block text-center font-bold ${i === 1 ? 'text-[#e8743b]' : ''}`}>{b}</Hand>
        </Pin>
      ))}
      {TIMES.map((time, i) => (
        <Pin key={time} x={52} y={TOP + i * SLOT - 6}>
          <Hand size={1.35} className="opacity-70">{time}</Hand>
        </Pin>
      ))}
      <Guides lines={TIMES.map((_, i) => ({ d: `M120,${TOP + i * SLOT} L860,${TOP + i * SLOT}` }))} />

      {APPTS.map((a) => (
        <Pin key={a.name} x={COLS[a.col] + 6} y={TOP + a.start * SLOT + 4} w={COL_INNER - 12}>
          <Sketchy fill={a.col === 1 ? '#ffe7d3' : 'rgba(255,255,255,0.7)'} className="flex items-start px-[0.6cqw] py-[0.4cqw]">
            <span style={{ height: `${(a.len * SLOT - 10) / 14}cqw` }} className="block">
              <Hand size={1.25}>{a.name}</Hand>
            </span>
          </Sketchy>
        </Pin>
      ))}
      {APPTS.filter((a) => a.col === 1).map((a) => (
        <Pin key={`ghost-${a.name}`} x={COLS[1] + 18} y={TOP + (a.start + LATE) * SLOT + 4} w={COL_INNER - 12}>
          <div data-reveal="pop" className="rounded-[0.6cqw] border-[0.2cqw] border-dashed border-[#e8743b] bg-[#e8743b]/[0.06]" style={{ height: `${(a.len * SLOT - 10) / 14}cqw` }} />
        </Pin>
      ))}
      <Arrows
        paths={[
          { d: `M${COLS[1] + COL_INNER + 6},${TOP + 40} C${COLS[1] + COL_INNER + 40},${TOP + 60} ${COLS[1] + COL_INNER + 30},${TOP + 80} ${COLS[1] + COL_INNER + 4},${TOP + 86}`, accent: true },
        ]}
      />

      <Pin x={150} y={590} w={600}>
        <Sketchy fill="#2a2d33" className="flex items-center gap-[1cqw] px-[1cqw] py-[0.8cqw]">
          <Hand size={1.4} className="flex-1 text-[#f6f4ee]">{t({ es: 'Mover 3 citas de Emilio +20 min', en: 'Move 3 of Emilio’s visits +20 min' })}</Hand>
          <Btn accent>{t({ es: 'Aplicar', en: 'Apply' })}</Btn>
          <span className="text-[#f6f4ee]"><Btn>{t({ es: 'Deshacer', en: 'Undo' })}</Btn></span>
        </Sketchy>
      </Pin>
      <Pin x={150} y={668}>
        <Hand size={1.3} className="opacity-70">{t({ es: 'vista previa primero · nada se mueve sin «Aplicar»', en: 'preview first · nothing moves without “Apply”' })}</Hand>
      </Pin>

      <Pin x={920} y={100} w={210} rotate={-2}>
        <Sticky color="yellow">{t({ es: 'La IA propone en la rejilla, no en un chat', en: 'AI proposes on the grid, not in a chat' })}</Sticky>
      </Pin>
      <Pin x={1150} y={130} w={210} rotate={2}>
        <Sticky color="green">{t({ es: 'Lo que el cliente eligió no se mueve solo', en: 'What the client chose never moves on its own' })}</Sticky>
      </Pin>
      <Pin x={930} y={330} w={210} rotate={1.5}>
        <Sticky color="blue">{t({ es: 'Deshacer siempre: quién lo movió y por qué', en: 'Always undo: who moved it and why' })}</Sticky>
      </Pin>
      <Pin x={1160} y={350} w={200} rotate={-1.5}>
        <Sticky color="pink">{t({ es: '✕ Mover sin preguntar (lo castigan las reseñas)', en: '✕ Moving without asking (reviews punish it)' })}</Sticky>
      </Pin>
      <Pin x={930} y={570} w={430}>
        <Hand size={1.5} className="block font-bold">{t({ es: '22 calendarios comparados', en: '22 calendars compared' })}</Hand>
        <Hand size={1.3} className="mt-[0.4cqw] block opacity-75">{t({ es: '12 de productividad · 10 de barbería y salón', en: '12 productivity · 10 barbershop and salon' })}</Hand>
      </Pin>
    </Board>
  )
}

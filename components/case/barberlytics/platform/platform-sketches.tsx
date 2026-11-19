'use client'

import { useLocale, type L } from '@/lib/i18n'
import { Arrows, Board, Btn, Guides, Hand, Pin, Sketchy, Sticky } from '@/components/case/kit/sketch'

/* ── Tablero 1: quién ve qué ──────────────────────────────────────────── */

const MODULES: readonly L[] = [
  { es: 'Métricas', en: 'Metrics' },
  { es: 'Calendario', en: 'Calendar' },
  { es: 'Nómina', en: 'Payroll' },
  { es: 'Clientes', en: 'Clients' },
  { es: 'Caja', en: 'Till' },
]

type Cell = 'all' | 'none' | L

const MATRIX: readonly { role: L; cells: readonly Cell[] }[] = [
  { role: { es: 'Dueño', en: 'Owner' }, cells: ['all', 'all', 'all', 'all', 'all'] },
  { role: { es: 'Administrador', en: 'Manager' }, cells: [{ es: 'su sede', en: 'their site' }, { es: 'su sede', en: 'their site' }, { es: 'su sede', en: 'their site' }, { es: 'su sede', en: 'their site' }, { es: 'su sede', en: 'their site' }] },
  { role: { es: 'Recepción', en: 'Front desk' }, cells: ['none', 'all', 'none', { es: 'para agendar', en: 'to book' }, { es: 'cobra, sin totales', en: 'charges, no totals' }] },
  { role: { es: 'Barbero comisión', en: 'Commission barber' }, cells: ['none', { es: 'su columna', en: 'own column' }, { es: '«lo que llevo»', en: '“what I’ve made”' }, { es: 'los suyos', en: 'their own' }, 'none'] },
  { role: { es: 'Barbero renta', en: 'Chair-rent barber' }, cells: [{ es: '«mi negocio»', en: '“my business”' }, { es: 'su columna', en: 'own column' }, { es: '«mi negocio»', en: '“my business”' }, { es: 'los suyos', en: 'their own' }, 'none'] },
]

const COL_X = [340, 510, 680, 850, 1020]
const COL_W = 160
const ROW_Y = [170, 268, 366, 464, 562]
const GRID = { left: 50, right: 1185, top: 110, bottom: 650 }

function MarkCell({ cell }: { cell: Cell }) {
  const { t } = useLocale()
  if (cell === 'all') return <Hand size={2.2} className="font-bold">✓</Hand>
  if (cell === 'none') return <Hand size={2} className="opacity-35">✕</Hand>
  return <Hand size={1.55} className="font-bold text-[#e8743b]">{t(cell)}</Hand>
}

export function RoleMapBoard() {
  const { t } = useLocale()
  const lines = [
    ...ROW_Y.map((y) => ({ d: `M${GRID.left},${y - 18} L${GRID.right},${y - 18}` })),
    { d: `M${GRID.left},${GRID.bottom} L${GRID.right},${GRID.bottom}` },
    ...COL_X.map((x) => ({ d: `M${x - 8},${GRID.top} L${x - 8},${GRID.bottom}` })),
  ]
  return (
    <Board title={t({ es: 'Roles · quién ve qué', en: 'Roles · who sees what' })} w={1400} h={720} label={t({ es: 'Mapa a mano de qué ve cada rol en cada módulo', en: 'Hand-drawn map of what each role sees in each module' })}>
      <Pin x={50} y={30}>
        <Hand size={2.4} className="font-bold">{t({ es: '5 roles × lo que ve cada uno', en: '5 roles × what each one sees' })}</Hand>
      </Pin>
      <Guides lines={lines} />
      {MODULES.map((m, c) => (
        <Pin key={m.es} x={COL_X[c]} y={GRID.top + 12} w={COL_W}>
          <Hand size={1.6} className="block text-center font-bold">{t(m)}</Hand>
        </Pin>
      ))}
      {MATRIX.map((row, r) => (
        <div key={row.role.es}>
          <Pin x={GRID.left + 10} y={ROW_Y[r] + 4} w={270}>
            <Hand size={1.7}>{t(row.role)}</Hand>
          </Pin>
          {row.cells.map((cell, c) => (
            <Pin key={`${row.role.es}-${c}`} x={COL_X[c]} y={ROW_Y[r] + 2} w={COL_W} className="text-center">
              <MarkCell cell={cell} />
            </Pin>
          ))}
        </div>
      ))}

      <Pin x={1210} y={110} w={170} rotate={2}>
        <Sticky color="yellow" small>{t({ es: 'El servidor recorta. La pantalla no esconde: no recibe.', en: 'The server trims. The screen doesn’t hide: it never receives.' })}</Sticky>
      </Pin>
      <Pin x={1215} y={300} w={165} rotate={-2}>
        <Sticky color="blue" small>{t({ es: '«Ver como» solo para dueño y admin', en: '“View as” only for owner and manager' })}</Sticky>
      </Pin>
      <Pin x={1210} y={470} w={170} rotate={1.5}>
        <Sticky color="pink" small>{t({ es: 'Nadie fuerza citas encima de otra ni fuera de horario', en: 'Nobody forces bookings on top of another or out of hours' })}</Sticky>
      </Pin>
      <Arrows paths={[{ d: 'M1205,520 C1150,560 1120,585 1105,600', accent: true }]} />
      <Pin x={50} y={680}>
        <Hand size={1.7}>{t({ es: '692 acciones revisadas → 16 decisiones', en: '692 actions reviewed → 16 decisions' })}</Hand>
      </Pin>
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

'use client'

import { useLocale, type L } from '@/lib/i18n'
import { Board, Hand, Pin, Sketchy, Sticky, type StickyColor } from '@/components/case/kit/sketch'

const INK = '#2a2d33'
const W = 290
const H = 190
const COLS = [50, 380, 710, 1040]
const ROWS = [120, 470]

/** Bloque de cita dibujado dentro de una vista. */
function Slot({ x, y, w, h, accent = false }: { x: number; y: number; w: number; h: number; accent?: boolean }) {
  return (
    <span
      className="absolute rounded-[0.3cqw] border-[0.14cqw]"
      style={{ left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%`, borderColor: INK, background: accent ? '#ffd2a8' : 'rgba(42,45,51,0.07)' }}
    />
  )
}

/* Cada vista, como garabato: solo la estructura que la hace distinta. */
const DRAW: Record<string, () => JSX.Element> = {
  dia: () => (
    <>
      {[0, 1, 2, 3].map((c) => <span key={c} className="absolute inset-y-[6%] w-px bg-[#2a2d33]/30" style={{ left: `${8 + c * 23}%` }} />)}
      <Slot x={10} y={10} w={19} h={22} />
      <Slot x={33} y={8} w={19} h={34} accent />
      <Slot x={56} y={30} w={19} h={20} />
      <Slot x={79} y={14} w={18} h={28} />
      <Slot x={10} y={56} w={19} h={26} />
      <Slot x={56} y={62} w={19} h={24} />
      <span className="absolute inset-x-[4%] top-[48%] h-[0.2cqw] bg-[#e5484d]" />
    </>
  ),
  semana: () => (
    <>
      {Array.from({ length: 7 }, (_, c) => (
        <span key={c} className="absolute bottom-[8%] w-[10%] rounded-t-[0.3cqw] border-[0.14cqw] border-[#2a2d33]" style={{ left: `${6 + c * 13}%`, height: `${[45, 38, 52, 64, 78, 86, 22][c]}%`, background: c === 5 ? '#ffd2a8' : 'rgba(42,45,51,0.07)' }} />
      ))}
    </>
  ),
  mes: () => (
    <>
      {Array.from({ length: 28 }, (_, i) => (
        <span key={i} className="absolute h-[18%] w-[11%] rounded-[0.2cqw] border-[0.12cqw] border-[#2a2d33]/60" style={{ left: `${5 + (i % 7) * 13}%`, top: `${8 + Math.floor(i / 7) * 22}%`, background: `rgba(255,170,90,${((i * 37) % 10) / 14})` }} />
      ))}
    </>
  ),
  agenda: () => (
    <>
      {[0, 1, 2, 3, 4].map((r) => (
        <span key={r} className="absolute inset-x-[6%] flex h-[13%] items-center gap-[4%] border-b-[0.12cqw] border-[#2a2d33]/40" style={{ top: `${8 + r * 17}%` }}>
          <span className="h-[30%] w-[10%] rounded-full bg-[#2a2d33]/50" />
          <span className="h-[30%] w-[45%] rounded-full bg-[#2a2d33]/20" />
          <span className="ml-auto h-[60%] w-[18%] rounded-[0.3cqw] border-[0.12cqw] border-[#2a2d33]" style={{ background: r === 1 ? '#ffd2a8' : 'transparent' }} />
        </span>
      ))}
    </>
  ),
  linea: () => (
    <>
      {[0, 1, 2].map((r) => (
        <span key={r} className="absolute inset-x-[6%] h-px bg-[#2a2d33]/30" style={{ top: `${24 + r * 26}%` }} />
      ))}
      <Slot x={8} y={14} w={26} h={18} />
      <Slot x={40} y={14} w={18} h={18} accent />
      <Slot x={22} y={40} w={30} h={18} />
      <Slot x={60} y={66} w={28} h={18} />
      <span className="absolute inset-y-[6%] left-[46%] w-[0.2cqw] bg-[#e5484d]" />
    </>
  ),
  silla: () => (
    <>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <span key={i} className="absolute flex h-[36%] w-[27%] flex-col justify-end rounded-[0.5cqw] border-[0.14cqw] border-[#2a2d33] p-[2%]" style={{ left: `${6 + (i % 3) * 31}%`, top: `${8 + Math.floor(i / 3) * 46}%`, background: i === 1 ? '#ffd2a8' : 'transparent' }}>
          <span className="h-[18%] w-[70%] rounded-full bg-[#2a2d33]/40" />
        </span>
      ))}
    </>
  ),
  estado: () => (
    <>
      {[0, 1, 2, 3].map((c) => (
        <span key={c} className="absolute top-[8%] h-[84%] w-[21%] rounded-[0.4cqw] bg-[#2a2d33]/[0.05]" style={{ left: `${4 + c * 24}%` }}>
          {Array.from({ length: [3, 2, 2, 1][c] }, (_, k) => (
            <span key={k} className="absolute inset-x-[8%] h-[20%] rounded-[0.3cqw] border-[0.12cqw] border-[#2a2d33]" style={{ top: `${12 + k * 26}%`, background: c === 2 && k === 0 ? '#ffd2a8' : 'white' }} />
          ))}
        </span>
      ))}
    </>
  ),
}

interface Option {
  id: keyof typeof DRAW
  name: L
  for: L
  shipped: boolean
}

const OPTIONS: readonly Option[] = [
  { id: 'dia', name: { es: 'Día · por barbero', en: 'Day · by barber' }, for: { es: 'recepción, todo el día', en: 'front desk, all day' }, shipped: true },
  { id: 'semana', name: { es: 'Semana · ocupación', en: 'Week · occupancy' }, for: { es: 'el dueño: qué días pesan', en: 'the owner: which days are heavy' }, shipped: true },
  { id: 'mes', name: { es: 'Mes · calor', en: 'Month · heat' }, for: { es: 'ver el mes de un vistazo', en: 'the month at a glance' }, shipped: true },
  { id: 'agenda', name: { es: 'Agenda · lista', en: 'Agenda · list' }, for: { es: 'el barbero, en el celular', en: 'the barber, on the phone' }, shipped: true },
  { id: 'linea', name: { es: 'Línea de tiempo', en: 'Timeline' }, for: { es: 'el día en horizontal', en: 'the day, horizontal' }, shipped: false },
  { id: 'silla', name: { es: 'Por silla', en: 'By chair' }, for: { es: 'quién está en cada puesto ahora', en: 'who’s in each chair now' }, shipped: false },
  { id: 'estado', name: { es: 'Por estado', en: 'By status' }, for: { es: 'columnas: llega, espera, silla, cobro', en: 'columns: arriving, waiting, chair, pay' }, shipped: false },
]

/** Tablero 3 · Cómo se mira el día: las vistas bocetadas, las que quedaron y las otras opciones. */
export function ViewsBoard() {
  const { t } = useLocale()
  return (
    <Board title={t({ es: 'Calendario · formas de ver el día', en: 'Calendar · ways to see the day' })} w={1400} h={800} label={t({ es: 'Bocetos de siete vistas posibles del calendario', en: 'Sketches of seven possible calendar views' })}>
      <Pin x={50} y={30}>
        <Hand size={2.4} className="font-bold">{t({ es: '¿Cómo se mira el día? Siete formas', en: 'How do you look at the day? Seven ways' })}</Hand>
      </Pin>
      {OPTIONS.map((o, i) => {
        const x = COLS[i % 4]
        const y = ROWS[Math.floor(i / 4)]
        const Draw = DRAW[o.id]
        const color: StickyColor = o.shipped ? 'green' : 'yellow'
        return (
          <div key={o.id}>
            <Pin x={x} y={y - 40} w={W}>
              <Hand size={1.6} className="block font-bold">{t(o.name)}</Hand>
            </Pin>
            <Pin x={x} y={y} w={W}>
              <Sketchy fill="rgba(255,255,255,0.7)">
                <div className="relative" style={{ aspectRatio: `${W} / ${H}` }}>
                  <Draw />
                </div>
              </Sketchy>
            </Pin>
            <Pin x={x + 10} y={y + H + 18} w={W - 40} rotate={i % 2 ? 1.5 : -1.5}>
              <Sticky color={color} small>
                {o.shipped ? '✓ ' : ''}
                {t(o.for)}
              </Sticky>
            </Pin>
          </div>
        )
      })}
      <Pin x={1040} y={480} w={300} rotate={-2}>
        <Sticky color="blue">
          {t({ es: 'Las cuatro con ✓ quedaron en la app, con atajo: D · W · M · A', en: 'The four with ✓ made it to the app, with shortcuts: D · W · M · A' })}
        </Sticky>
      </Pin>
    </Board>
  )
}

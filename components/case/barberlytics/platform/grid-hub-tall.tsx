'use client'

import { useLocale } from '@/lib/i18n'
import { APPTS, BARBERS, STAGE, stageAt } from './calendar-model'
import { Branch, FEEDS, ROLES, SNAPSHOT_NOW, type HubNode, type Pick } from './grid-hub'

/** Medidas del dibujo en vertical (unidades del SVG ≈ px en un teléfono de 375) */
const W = 340
const H = 600
const NODE_X = [58, 170, 282]
const ROLE_Y = 92
const FEED_Y = 508
/** La rejilla, alta como la pantalla del teléfono */
const GRID = { x: 92, y: 180, w: 156, h: 240 }
const MID = GRID.x + GRID.w / 2

const inPath = (x: number) => `M${x} ${ROLE_Y} C${x} ${ROLE_Y + 50} ${MID} ${GRID.y - 50} ${MID} ${GRID.y}`
const outPath = (x: number) => `M${MID} ${GRID.y + GRID.h} C${MID} ${GRID.y + GRID.h + 50} ${x} ${FEED_Y - 50} ${x} ${FEED_Y}`
const pct = (v: number, total: number) => `${(v / total) * 100}%`

interface HubTallProps {
  step: number
  pick: Pick
  toggle: (next: Pick) => void
}

function Node({ x, y, on, active }: { x: number; y: number; on: boolean; active: boolean }) {
  return (
    <g>
      <circle cx={x} cy={y} r={20} fill="rgb(var(--signal))" opacity={on ? (active ? 0.3 : 0.12) : 0} style={{ transition: 'opacity .4s' }} />
      {active && <circle cx={x} cy={y} r={13} fill="none" stroke="#d9b36a" strokeWidth={1.5} className="pl-hot" />}
      <circle cx={x} cy={y} r={7} fill={on ? (active ? '#fffaf0' : 'rgb(var(--signal))') : 'rgb(var(--void))'} stroke={on ? 'white' : 'rgb(255 255 255 / 0.4)'} strokeWidth={1.4} style={{ transition: 'fill .4s, stroke .4s' }} />
    </g>
  )
}

/** Nombre y papel de un nodo, en HTML: arriba de los roles, abajo de lo que se alimenta */
function NodeLabel({ node, x, y, below, on, active, onPick }: { node: HubNode; x: number; y: number; below: boolean; on: boolean; active: boolean; onPick: () => void }) {
  const { t } = useLocale()
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onPick}
      className={`absolute flex w-[31%] -translate-x-1/2 flex-col items-center text-center outline-none transition-opacity duration-500 ${below ? 'pt-7' : 'flex-col-reverse -translate-y-full pb-7'}`}
      style={{ left: pct(x, W), top: pct(y, H), opacity: on ? 1 : 0.3 }}
    >
      <span className={`text-[15px] leading-tight ${active ? 'text-[#d9b36a]' : ''}`}>{t(node.name)}</span>
      <span className={`font-mono text-[11px] uppercase leading-snug tracking-[0.08em] text-paper/60 ${below ? 'mt-1' : 'mb-1'}`}>{t(node.sub)}</span>
    </button>
  )
}

/**
 * «Los puntos» en el teléfono: el mismo mapa, de arriba abajo. Arriba quienes
 * usan la rejilla, al centro la rejilla alta como una pantalla y abajo lo que
 * se alimenta de ella; las fibras bajan de unos a otros.
 */
export function HubTall({ step, pick, toggle }: HubTallProps) {
  const { t } = useLocale()
  const gridOn = step >= 4
  const colW = GRID.w / BARBERS.length
  const unit = (GRID.h - 28) / 10

  return (
    <div className="relative mx-auto mt-4 w-full max-w-[380px]" style={{ aspectRatio: `${W} / ${H}` }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
        {NODE_X.map((x, i) => (
          <Branch key={`in-${x}`} d={inPath(x)} on={step > i} active={pick?.side === 'role' && pick.i === i} delay={i * 0.25} />
        ))}
        {NODE_X.map((x, i) => (
          <Branch key={`out-${x}`} d={outPath(x)} on={step > 4 + i} active={pick?.side === 'feed' && pick.i === i} delay={0.9 + i * 0.25} />
        ))}

        <rect x={GRID.x - 14} y={GRID.y - 14} width={GRID.w + 28} height={GRID.h + 28} rx={24} fill="rgba(217,179,106,0.08)" opacity={gridOn ? 1 : 0} style={{ transition: 'opacity .6s', filter: 'blur(10px)' }} />
        <rect x={GRID.x} y={GRID.y} width={GRID.w} height={GRID.h} rx={16} fill="#141210" stroke={pick?.side === 'grid' ? '#d9b36a' : 'rgb(255 255 255 / 0.14)'} strokeWidth={pick?.side === 'grid' ? 2 : 1} style={{ transition: 'stroke .3s' }} />
        {BARBERS.map((b, c) => (
          <g key={b}>
            {c > 0 && <line x1={GRID.x + c * colW} x2={GRID.x + c * colW} y1={GRID.y + 8} y2={GRID.y + GRID.h - 8} stroke="white" strokeOpacity={0.06} />}
            <rect x={GRID.x + c * colW + 5} y={GRID.y + 10} width={colW - 10} height={4} rx={2} fill="white" opacity={0.18} />
          </g>
        ))}
        {APPTS.map((a, i) => {
          const hue = STAGE[stageAt(a, SNAPSHOT_NOW)].hue
          return (
            <rect
              key={a.client}
              x={GRID.x + a.col * colW + 3}
              y={GRID.y + 22 + a.start * unit}
              width={colW - 6}
              height={a.len * unit - 3}
              rx={4}
              fill={hue}
              fillOpacity={0.55}
              stroke={hue}
              style={{ opacity: gridOn ? 1 : 0, transform: gridOn ? 'none' : 'translateY(-6px)', transition: `opacity .4s ${i * 35}ms, transform .5s ${i * 35}ms cubic-bezier(.16,1,.3,1)` }}
            />
          )
        })}
        <line x1={GRID.x + 2} x2={GRID.x + GRID.w - 2} y1={GRID.y + 22 + SNAPSHOT_NOW * unit} y2={GRID.y + 22 + SNAPSHOT_NOW * unit} stroke="#e5484d" strokeWidth={1.4} opacity={gridOn ? 1 : 0} style={{ transition: 'opacity .4s .5s' }} />

        {NODE_X.map((x, i) => (
          <Node key={`r-${x}`} x={x} y={ROLE_Y} on={step > i} active={pick?.side === 'role' && pick.i === i} />
        ))}
        {NODE_X.map((x, i) => (
          <Node key={`f-${x}`} x={x} y={FEED_Y} on={step > 4 + i} active={pick?.side === 'feed' && pick.i === i} />
        ))}
      </svg>

      {ROLES.map((r, i) => (
        <NodeLabel key={r.name.es} node={r} x={NODE_X[i]} y={ROLE_Y} below={false} on={step > i} active={pick?.side === 'role' && pick.i === i} onPick={() => toggle({ side: 'role', i })} />
      ))}
      {FEEDS.map((f, i) => (
        <NodeLabel key={f.name.es} node={f} x={NODE_X[i]} y={FEED_Y} below on={step > 4 + i} active={pick?.side === 'feed' && pick.i === i} onPick={() => toggle({ side: 'feed', i })} />
      ))}

      {/* La rejilla se toca entera; su nombre va al costado */}
      <button
        type="button"
        aria-pressed={pick?.side === 'grid'}
        aria-label={t({ es: 'La rejilla', en: 'The grid' })}
        onClick={() => toggle({ side: 'grid' })}
        className="absolute rounded-2xl outline-none"
        style={{ left: pct(GRID.x, W), top: pct(GRID.y, H), width: pct(GRID.w, W), height: pct(GRID.h, H) }}
      />
      <span
        aria-hidden="true"
        className="absolute -translate-x-1/2 -translate-y-1/2 -rotate-90 whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.14em] text-paper/55 transition-opacity duration-500"
        style={{ left: pct(GRID.x + GRID.w + 26, W), top: pct(GRID.y + GRID.h / 2, H), opacity: gridOn ? 1 : 0 }}
      >
        {t({ es: 'El calendario', en: 'The calendar' })}
      </span>
    </div>
  )
}

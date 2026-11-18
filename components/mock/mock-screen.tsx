import type { MockKind } from '@/lib/content/projects'
import { LAYOUTS, type Block } from './layouts'

export type MockMode = 'wire' | 'ui'

interface MockScreenProps {
  kind: MockKind
  mode: MockMode
  /** triplete RGB del proyecto */
  accent: string
  className?: string
}

function pos(b: Block): React.CSSProperties {
  return { left: `${b.x}%`, top: `${b.y}%`, width: `${b.w}%`, height: `${b.h}%` }
}

/** Contenido "falso pero creíble" de cada bloque en la UI final. */
function UiBlock({ block, accent }: { block: Block; accent: string }) {
  const hot = `rgb(${accent})`
  const soft = `rgb(${accent} / 0.12)`
  const base = 'absolute overflow-hidden'
  switch (block.role) {
    case 'nav':
      return (
        <div className={`${base} flex flex-col gap-[6%] bg-[#1d2026] p-[8%]`} style={pos(block)}>
          <div className="h-[4%] w-1/2 rounded-sm" style={{ background: hot }} />
          {[70, 55, 80, 60, 45].map((w, i) => (
            <div key={i} className="h-[2.5%] rounded-sm bg-white/25" style={{ width: `${w}%` }} />
          ))}
        </div>
      )
    case 'header':
      return (
        <div className={`${base} flex items-center justify-between`} style={pos(block)}>
          <div className="h-1/2 w-1/3 rounded-sm bg-[#2a2d33]" />
          <div className="aspect-square h-full rounded-full" style={{ background: soft, border: `1px solid ${hot}` }} />
        </div>
      )
    case 'kpi':
    case 'card':
      return (
        <div className={`${base} flex flex-col justify-between rounded-md border border-black/10 bg-white p-[3%]`} style={pos(block)}>
          <div className="h-[14%] w-1/2 rounded-sm bg-black/15" />
          <div className="h-[30%] w-2/3 rounded-sm" style={{ background: block.hot ? hot : '#2a2d33' }} />
        </div>
      )
    case 'chart':
      return (
        <div className={`${base} flex items-end gap-[3%] rounded-md border border-black/10 bg-white p-[4%]`} style={pos(block)}>
          {[40, 62, 48, 75, 58, 88, 70].map((h, i) => (
            <div key={i} className="flex-1 rounded-t-sm" style={{ height: `${h}%`, background: i === 5 ? hot : soft }} />
          ))}
        </div>
      )
    case 'avatar':
      return (
        <div className={`${base} flex flex-col items-center justify-center gap-[8%] rounded-md bg-white`} style={{ ...pos(block), outline: block.hot ? `2px solid ${hot}` : undefined }}>
          <div className="aspect-square h-1/2 rounded-full bg-[#2a2d33]/80" />
          <div className="h-[8%] w-1/2 rounded-sm bg-black/20" />
        </div>
      )
    case 'slot':
    case 'button':
      return (
        <div
          className={`${base} flex items-center justify-center rounded-md`}
          style={{ ...pos(block), background: block.hot ? hot : 'white', border: block.hot ? 'none' : '1px solid rgb(0 0 0 / 0.12)' }}
        >
          <div className="h-[22%] w-1/3 rounded-sm" style={{ background: block.hot ? 'rgb(255 255 255 / 0.85)' : 'rgb(0 0 0 / 0.2)' }} />
        </div>
      )
    case 'panel':
      return <div className={`${base} rounded-md border border-black/10`} style={{ ...pos(block), background: block.hot ? soft : 'white' }} />
    case 'total':
      return (
        <div className={`${base} flex items-center justify-between rounded-md px-[2%]`} style={{ ...pos(block), background: '#2a2d33' }}>
          <div className="h-1/4 w-1/5 rounded-sm bg-white/40" />
          <div className="h-2/5 w-1/6 rounded-sm" style={{ background: hot }} />
        </div>
      )
    default:
      return (
        <div className={`${base} flex items-center gap-[3%] rounded-sm border-b border-black/10 bg-white px-[2%]`} style={pos(block)}>
          <div className="aspect-square h-1/2 rounded-full" style={{ background: soft }} />
          <div className="h-[22%] w-1/3 rounded-sm bg-black/25" />
          <div className="ml-auto h-[22%] w-1/6 rounded-sm bg-black/10" />
        </div>
      )
  }
}

function WireBlock({ block }: { block: Block }) {
  const big = block.w * block.h > 600
  return (
    <div className="absolute flex items-center justify-center border border-dashed border-[#2a2d33]/45" style={pos(block)}>
      {big && (
        <svg className="absolute inset-0 h-full w-full text-[#2a2d33]/15" preserveAspectRatio="none" viewBox="0 0 100 100" aria-hidden="true">
          <path d="M0 0L100 100M100 0L0 100" stroke="currentColor" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
        </svg>
      )}
      <span className="relative font-mono text-[clamp(6px,0.7vw,10px)] uppercase tracking-wider text-[#2a2d33]/55">{block.role}</span>
    </div>
  )
}

/** Pantalla simulada: misma estructura en modo wireframe o interfaz final. */
export function MockScreen({ kind, mode, accent, className = '' }: MockScreenProps) {
  const layout = LAYOUTS[kind]
  return (
    <div
      className={`relative w-full overflow-hidden ${mode === 'ui' ? 'bg-[#f5f5f2]' : 'bg-[#fbfbf9]'} ${className}`}
      style={{ aspectRatio: String(layout.aspect) }}
      aria-hidden="true"
    >
      {layout.blocks.map((block, i) =>
        mode === 'ui' ? <UiBlock key={i} block={block} accent={accent} /> : <WireBlock key={i} block={block} />,
      )}
    </div>
  )
}

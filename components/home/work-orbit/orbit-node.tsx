import { ClipboardList, Compass, Scissors, Sparkles, Target, type LucideIcon } from 'lucide-react'
import type { Project } from '@/lib/content/projects'
import { SellUpMark, SellUpWordmark } from '@/components/case/sellup/brand'

/** Proyectos que llevan su propia marca (logo y palabra) en vez de ícono y nombre */
const BRANDED: Partial<Record<string, { tile: React.ReactNode; name: React.ReactNode }>> = {
  sellup: {
    tile: <SellUpMark size={64} className="!h-full !w-full" />,
    name: <SellUpWordmark className="text-paper" />,
  },
}

/** Ícono y nombre corto de cada proyecto dentro de su nodo */
const MARKS: Partial<Record<string, { icon: LucideIcon; name: string }>> = {
  objetivos: { icon: Target, name: 'Objetivos' },
  encuestas: { icon: ClipboardList, name: 'Encuestas' },
  sellup: { icon: Compass, name: 'SellUp' },
  barberlytics: { icon: Scissors, name: 'Barberlytics' },
}

interface OrbitNodeProps {
  project: Project
  active: boolean
}

/**
 * Cara de un nodo de la órbita: una neurona de vidrio oscuro. Anillo fino del
 * color del proyecto, una órbita punteada que gira lenta, el ícono al centro
 * con su brillo, y debajo el nombre y el número (N°), en la tipografía del sitio.
 * El nodo del frente se enciende: el anillo y el brillo suben.
 */
export function OrbitNode({ project, active }: OrbitNodeProps) {
  const mark = MARKS[project.slug] ?? { icon: Sparkles, name: project.client }
  const Icon = mark.icon
  const brand = BRANDED[project.slug]
  const accent = (alpha: number) => `rgb(${project.accent} / ${alpha})`

  return (
    <span className="pointer-events-none absolute inset-0 grid place-items-center">
      {/* Fondo: vidrio oscuro con un resplandor del color del proyecto */}
      <span
        className="absolute inset-0 rounded-full transition-opacity duration-700"
        style={{
          background: `radial-gradient(circle at 50% 38%, ${accent(active ? 0.3 : 0.22)} 0%, ${accent(0.08)} 48%, rgb(18 20 26 / 0.94) 78%)`,
        }}
      />
      {/* Órbita interna punteada, girando lenta */}
      <svg viewBox="0 0 100 100" className="absolute inset-[9%] animate-[spin_38s_linear_infinite] motion-reduce:animate-none" aria-hidden="true">
        <circle cx="50" cy="50" r="49" fill="none" stroke="white" strokeOpacity={active ? 0.22 : 0.12} strokeWidth="0.4" strokeDasharray="0.6 3.2" />
        <circle cx="50" cy="1" r="1.3" fill={`rgb(${project.accent})`} />
      </svg>
      {/* Anillo exterior */}
      <span
        className="absolute inset-0 rounded-full border transition-colors duration-700"
        style={{ borderColor: accent(active ? 0.75 : 0.5), boxShadow: `inset 0 1px 0 rgb(255 255 255 / 0.12), inset 0 0 40px ${accent(active ? 0.18 : 0.1)}` }}
      />

      <span className="relative flex flex-col items-center gap-[0.55em] text-[clamp(0.62rem,0.4rem+0.55vw,0.95rem)]">
        <span className="mono-label tabular-nums text-paper/45">N° {project.frequency}</span>
        <span
          className="grid h-[4.2em] w-[4.2em] place-items-center overflow-hidden rounded-[1.05em] border border-white/10"
          style={{
            background: brand ? undefined : `linear-gradient(160deg, ${accent(0.95)}, ${accent(0.55)})`,
            boxShadow: `0 0 0 0.45em ${accent(0.1)}, 0 0.8em 2.4em -0.6em ${accent(active ? 0.8 : 0.4)}`,
          }}
        >
          {brand ? brand.tile : <Icon className="h-[1.9em] w-[1.9em] text-white" strokeWidth={1.6} aria-hidden="true" />}
        </span>
        <span className="mt-[0.2em] text-[1.55em] font-light leading-none tracking-tight text-paper">{brand ? brand.name : mark.name}</span>
        <span className="brand-title text-[0.72em] text-paper/50">{project.client}</span>
      </span>
    </span>
  )
}

/**
 * Marca pequeña de un proyecto (para menús): su ícono sobre el color del
 * proyecto, o su logo si lo tiene. Se dibuja al tamaño de su contenedor.
 */
export function ProjectGlyph({ project, className = '' }: { project: Project; className?: string }) {
  const mark = MARKS[project.slug] ?? { icon: Sparkles, name: project.client }
  const Icon = mark.icon
  const brand = BRANDED[project.slug]
  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center overflow-hidden rounded-[30%] border border-white/10 ${className}`}
      style={{ background: brand ? undefined : `linear-gradient(160deg, rgb(${project.accent} / 0.95), rgb(${project.accent} / 0.55))` }}
    >
      {brand ? brand.tile : <Icon className="h-[52%] w-[52%] text-white" strokeWidth={1.7} />}
    </span>
  )
}

import { Hero } from '@/components/home/hero'
import { NeuralBackdrop } from '@/components/home/neural-backdrop'
import { Manifesto } from '@/components/home/manifesto'
import { ProcessFlow } from '@/components/home/process-flow'
import { WorkList } from '@/components/home/work-list'
import { SectionFiber } from '@/components/home/section-fiber'
import { Trajectory } from '@/components/home/trajectory'
import { Agent } from '@/components/home/agent'
import { Contact } from '@/components/home/contact'
import { listProjects } from '@/lib/data/projects-repository'

/** Regenera la página como máximo cada 5 min si cambia el contenido en Supabase. */
export const revalidate = 300

export default async function HomePage() {
  const { projects } = await listProjects()
  return (
    <>
      {/* Un solo fondo de red para todo el inicio: sin cortes entre secciones */}
      <NeuralBackdrop />
      <Hero />
      {/* Fibras de la red entre secciones: del «00» de Enfoque al «01» de Proyectos (por la izquierda),
          y del «01» al «02» de Proceso (por la derecha) */}
      <SectionFiber id="enfoque">
        <Manifesto />
        <SectionFiber id="proyectos" side="right">
          <WorkList projects={projects} />
          <ProcessFlow />
        </SectionFiber>
      </SectionFiber>
      <Trajectory />
      <Agent projects={projects} />
      <Contact />
    </>
  )
}

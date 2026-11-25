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
      {/* Una fibra de la red une el «00» de Enfoque con el «01» de Proyectos */}
      <SectionFiber>
        <Manifesto />
        <WorkList projects={projects} />
      </SectionFiber>
      <ProcessFlow />
      <Trajectory />
      <Agent projects={projects} />
      <Contact />
    </>
  )
}

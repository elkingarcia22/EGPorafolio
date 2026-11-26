import { Hero } from '@/components/home/hero'
import { NeuralBackdrop } from '@/components/home/neural-backdrop'
import { Manifesto } from '@/components/home/manifesto'
import { ProcessFlow } from '@/components/home/process-flow'
import { WorkList } from '@/components/home/work-list'
import { SectionFiber } from '@/components/home/section-fiber'
import { ConvergeFibers } from '@/components/home/converge-fibers'
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
          del «01» al «02» de Proceso (por la derecha), del final de Proceso al «03» de Trayectoria,
          y de las cajas de Trayectoria al Agente. A Contacto baja la luz azul, como a Enfoque */}
      <SectionFiber id="enfoque" narrowFromBelow={false}>
        <Manifesto />
        <SectionFiber id="proyectos" side="right" narrowFromBelow={false}>
          <WorkList projects={projects} />
          <SectionFiber id="proceso" side="right" narrowFromBelow={false}>
            <ProcessFlow />
            <ConvergeFibers>
              <Trajectory />
              <Agent projects={projects} />
            </ConvergeFibers>
          </SectionFiber>
        </SectionFiber>
      </SectionFiber>
      <Contact />
    </>
  )
}

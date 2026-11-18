import { Hero } from '@/components/home/hero'
import { Manifesto } from '@/components/home/manifesto'
import { Process } from '@/components/home/process'
import { WorkList } from '@/components/home/work-list'
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
      <Hero />
      <Manifesto />
      <WorkList projects={projects} />
      <Process />
      <Trajectory />
      <Agent projects={projects} />
      <Contact />
    </>
  )
}

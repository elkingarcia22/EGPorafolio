import { IntroGate } from '@/components/intro/intro-gate'
import { Hero } from '@/components/home/hero'
import { Manifesto } from '@/components/home/manifesto'
import { Process } from '@/components/home/process'
import { WorkList } from '@/components/home/work-list'
import { Trajectory } from '@/components/home/trajectory'
import { Agent } from '@/components/home/agent'
import { Contact } from '@/components/home/contact'

export default function HomePage() {
  return (
    <>
      <IntroGate />
      <Hero />
      <Manifesto />
      <WorkList />
      <Process />
      <Trajectory />
      <Agent />
      <Contact />
    </>
  )
}

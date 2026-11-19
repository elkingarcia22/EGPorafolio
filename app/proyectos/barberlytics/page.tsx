import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BarberlyticsHub } from '@/components/case/barberlytics/barberlytics-hub'
import { findProject } from '@/lib/data/projects-repository'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Barberlytics — Elkin Garcia',
  description: 'Software para barberías de punta a punta: sistema de diseño, reserva, plataforma y Clipper, su IA.',
}

/** Portada de Barberlytics: los cuatro proyectos del producto. */
export default async function BarberlyticsPage() {
  const found = await findProject('barberlytics')
  if (!found) notFound()
  return <BarberlyticsHub next={found.next} />
}

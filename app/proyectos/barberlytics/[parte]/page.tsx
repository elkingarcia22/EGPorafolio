import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BookingCase } from '@/components/case/barberlytics/booking/booking-case'
import { ThemaCase } from '@/components/case/barberlytics/thema/thema-case'
import { PlatformCase } from '@/components/case/barberlytics/platform/platform-case'
import { ClipperCase } from '@/components/case/barberlytics/clipper/clipper-case'

interface PartPageProps {
  params: Promise<{ parte: string }>
}

/** Proyectos de Barberlytics con caso propio (los demás se suman al terminarlos). */
const PARTS = {
  thema: { title: 'Thema, sistema de diseño · Barberlytics — Elkin Garcia', Case: ThemaCase },
  reserva: { title: 'Reserva en línea · Barberlytics — Elkin Garcia', Case: BookingCase },
  plataforma: { title: 'Plataforma · Barberlytics — Elkin Garcia', Case: PlatformCase },
  clipper: { title: 'Clipper · Barberlytics — Elkin Garcia', Case: ClipperCase },
} as const

type PartSlug = keyof typeof PARTS

const isPart = (slug: string): slug is PartSlug => slug in PARTS

export function generateStaticParams() {
  return Object.keys(PARTS).map((parte) => ({ parte }))
}

export const dynamicParams = false

export async function generateMetadata({ params }: PartPageProps): Promise<Metadata> {
  const { parte } = await params
  return isPart(parte) ? { title: PARTS[parte].title } : {}
}

export default async function BarberlyticsPartPage({ params }: PartPageProps) {
  const { parte } = await params
  if (!isPart(parte)) notFound()
  const { Case } = PARTS[parte]
  return <Case />
}

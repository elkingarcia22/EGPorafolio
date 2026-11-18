'use client'

import { useLocale } from '@/lib/i18n'
import { buildCv } from './cv-content'
import { ProposalPaper } from './proposal-paper'
import { ProposalDark } from './proposal-dark'
import { ProposalSystem } from './proposal-system'

const PROPOSALS = [
  {
    id: 'a',
    name: 'A · Papel y conexiones',
    note: 'Evoluciona tu hoja actual: papel y carbón, barras gruesas, y la experiencia como nodos azules unidos por una línea.',
    Page: ProposalPaper,
  },
  {
    id: 'b',
    name: 'B · Red en la oscuridad',
    note: 'El tono del hero: el EG como red, cifras grandes y etiquetas tipo sistema. Muy de marca; en impresión gasta tinta.',
    Page: ProposalDark,
  },
  {
    id: 'c',
    name: 'C · Sistema',
    note: 'Retícula suiza con una columna azul de señal. El perfil como titular grande; la más fácil de escanear para reclutadores.',
    Page: ProposalSystem,
  },
] as const

/** Las tres propuestas de hoja de vida, una al lado de la otra. */
export function CvProposals() {
  const { t } = useLocale()
  const cv = buildCv(t)
  return (
    <section className="min-h-screen bg-[#16181c] px-[var(--gutter)] pb-24 pt-28 text-paper">
      <p className="mono-label text-paper/60">Hoja de vida · propuestas</p>
      <h1 className="mt-3 text-[clamp(2rem,1rem+3vw,3.4rem)] font-light">Tres direcciones para tu hoja de vida</h1>
      <div className="mt-14 space-y-20">
        {PROPOSALS.map(({ id, name, note, Page }) => (
          <div key={id} id={`propuesta-${id}`} className="flex flex-col gap-6 xl:flex-row xl:items-start xl:gap-12">
            <div className="xl:sticky xl:top-28 xl:w-72">
              <h2 className="brand-title text-sm">{name}</h2>
              <p className="mt-3 text-sm leading-relaxed text-paper/70">{note}</p>
            </div>
            <div className="overflow-x-auto">
              <div className="shadow-[0_40px_90px_-30px_rgba(0,0,0,0.8)]">
                <Page cv={cv} t={t} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

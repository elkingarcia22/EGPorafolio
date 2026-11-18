'use client'

import type { L } from '@/lib/i18n'
import { CV_LABELS, PAGE, type CvView } from './cv-content'
import { Constellation, GlyphNetwork, SPARSE_GLYPH } from './network-svg'

interface ProposalProps {
  cv: CvView
  t: (text: L) => string
}

function Heading({ children }: { children: React.ReactNode }) {
  return <h3 className="brand-title mb-3 text-[13px] tracking-[0.38em] text-ink">{children}</h3>
}

/**
 * A · Papel y conexiones: la hoja de vida actual, evolucionada. Papel y
 * carbón, barras verticales, y la experiencia como una red de nodos unidos.
 */
export function ProposalPaper({ cv, t }: ProposalProps) {
  return (
    <article
      className="relative flex flex-col overflow-hidden bg-paper px-12 pb-10 pt-11 text-ink"
      style={{ width: PAGE.width, height: PAGE.height }}
    >
      <Constellation width={PAGE.width} height={150} count={46} reach={70} seed={11} className="pointer-events-none absolute bottom-0 left-0 text-ink/40" />

      {/* Cabecera */}
      <header className="flex items-start justify-between">
        <ul className="relative space-y-1.5 border-l-[5px] border-ink py-1 pl-4">
          {cv.contact.map((c) => (
            <li key={c.label} className="flex items-baseline gap-3 text-[10.5px]">
              <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-signal">{c.label}</span>
              <span>{c.value}</span>
            </li>
          ))}
        </ul>
        <div className="flex items-start gap-5">
          <div className="text-right">
            <p className="text-[34px] font-light leading-none tracking-[0.06em]">{cv.firstName}</p>
            <p className="mt-1 text-[58px] font-medium leading-none tracking-[0.2em]">{cv.lastName}</p>
            <p className="mt-3 inline-flex items-center gap-3 text-[13px]">
              <span className="h-5 w-px bg-ink" />
              {cv.role}
            </p>
          </div>
          <GlyphNetwork text="EG" height={60} options={SPARSE_GLYPH} className="mt-1 text-ink" />
        </div>
      </header>

      <div className="relative mt-9 grid flex-1 grid-cols-[1fr_210px] gap-10">
        <div>
          <Heading>{t(CV_LABELS.profile)}</Heading>
          <p className="border-l-[5px] border-ink pl-4 text-[10.5px] leading-[1.6]">{cv.summary}</p>

          <div className="mt-7">
            <Heading>{t(CV_LABELS.experience)}</Heading>
            {/* Línea de tiempo: cada empleo es un nodo conectado al siguiente */}
            <ol className="relative ml-1 border-l border-ink/30 pl-6">
              {cv.jobs.map((job) => (
                <li key={job.company} className="relative pb-4 last:pb-0">
                  <span className="absolute -left-[29px] top-[3px] h-[9px] w-[9px] bg-signal ring-4 ring-paper" />
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="brand-title text-[11px] tracking-[0.24em]">{job.company}</p>
                    <p className="font-mono text-[8.5px] uppercase tracking-[0.14em] text-ink/60">{job.period}</p>
                  </div>
                  <ul className="mt-1 space-y-0.5">
                    {job.roles.map((r) => (
                      <li key={r.title} className="flex justify-between gap-3 text-[10px] font-medium">
                        <span>{r.title}</span>
                        <span className="font-mono text-[8px] text-ink/50">{r.period}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-1.5 text-[9.5px] leading-[1.55] text-ink/80">{job.summary}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-6">
            <Heading>{t(CV_LABELS.earlier)}</Heading>
            <ul className="divide-y divide-ink/15 border-y border-ink/15">
              {cv.earlier.map((job) => (
                <li key={job.company} className="flex items-baseline justify-between gap-3 py-1 text-[9.5px]">
                  <span>
                    <span className="font-medium">{job.title}</span> · {job.company}
                  </span>
                  <span className="font-mono text-[8px] text-ink/50">{job.period}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="border-l border-ink/20 pl-7">
          <div className="mb-7 grid grid-cols-3 gap-2 border-b border-ink/15 pb-5">
            {cv.stats.map((s) => (
              <div key={s.label}>
                <p className="text-[24px] font-medium leading-none text-signal">{s.value}</p>
                <p className="mt-1 font-mono text-[7px] uppercase leading-tight tracking-[0.12em] text-ink/60">{s.label}</p>
              </div>
            ))}
          </div>

          <Heading>{t(CV_LABELS.education)}</Heading>
          <ul className="space-y-2.5">
            {cv.studies.map((s) => (
              <li key={s.title}>
                <p className="text-[9.5px] font-semibold uppercase leading-snug tracking-[0.06em]">{s.title}</p>
                <p className="text-[9px] text-ink/60">
                  {s.school} | {s.period}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-6">
            <Heading>{t(CV_LABELS.skills)}</Heading>
            <ul className="space-y-1 text-[9.5px]">
              {cv.skills.map((s) => (
                <li key={s} className="flex items-center gap-2">
                  <span className="h-1 w-1 bg-signal" />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6">
            <Heading>{t(CV_LABELS.tools)}</Heading>
            {cv.tools.map((g) => (
              <p key={g.title} className="mb-1.5 text-[9.5px] leading-snug">
                <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-signal">{g.title} </span>
                {g.tools.join(' · ')}
              </p>
            ))}
          </div>
        </aside>
      </div>
    </article>
  )
}

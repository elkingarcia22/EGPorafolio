'use client'

import type { L } from '@/lib/i18n'
import { CV_LABELS, PAGE, type CvView } from './cv-content'
import { Constellation } from './network-svg'

interface ProposalProps {
  cv: CvView
  t: (text: L) => string
}

function SideTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-2.5 font-mono text-[8px] uppercase tracking-[0.22em] text-paper/70">{children}</h3>
}

function MainTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="brand-title mb-4 flex items-center gap-3 text-[12px] tracking-[0.36em]">
      {children}
      <span className="h-px flex-1 bg-ink/20" />
    </h3>
  )
}

/**
 * C · Sistema: retícula suiza con una columna azul de "señal". El perfil
 * como titular grande y la experiencia en una grilla de fechas y nodos.
 */
export function ProposalSystem({ cv, t }: ProposalProps) {
  return (
    <article className="relative grid grid-cols-[236px_1fr] overflow-hidden bg-paper text-ink" style={{ width: PAGE.width, height: PAGE.height }}>
      <aside className="relative flex flex-col overflow-hidden bg-signal px-8 pb-9 pt-11 text-paper">
        <Constellation width={236} height={220} count={22} reach={70} seed={23} accentEvery={1000} className="pointer-events-none absolute bottom-0 left-0 text-paper/60" />

        <div className="relative flex h-14 items-center pl-3 text-[26px] font-semibold tracking-tight">
          <span className="absolute left-0 top-0 h-7 w-[3px] bg-paper" />
          EG
          <span className="absolute bottom-0 left-[58px] h-6 w-[3px] bg-paper" />
        </div>

        <div className="relative mt-9 space-y-7">
          <div>
            <SideTitle>{t(CV_LABELS.contact)}</SideTitle>
            <ul className="space-y-1.5 text-[9.5px] leading-snug">
              {cv.contact.map((c) => (
                <li key={c.label} className="break-all">
                  {c.value}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SideTitle>{t(CV_LABELS.education)}</SideTitle>
            <ul className="space-y-2">
              {cv.studies.map((s) => (
                <li key={s.title} className="text-[9.5px] leading-snug">
                  <p className="font-medium">{s.title}</p>
                  <p className="text-paper/70">
                    {s.school} · {s.period}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SideTitle>{t(CV_LABELS.tools)}</SideTitle>
            {cv.tools.map((g) => (
              <div key={g.title} className="mb-2">
                <p className="font-mono text-[7.5px] uppercase tracking-[0.16em] text-paper/60">{g.title}</p>
                <p className="text-[9.5px] leading-snug">{g.tools.join(', ')}</p>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <div className="flex flex-col px-11 pb-9 pt-11">
        <header>
          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-signal">{cv.role}</p>
          <h2 className="mt-2 leading-[0.9]">
            <span className="block text-[38px] font-light tracking-[0.04em]">{cv.firstName}</span>
            <span className="block text-[66px] font-medium tracking-[0.16em]">{cv.lastName}</span>
          </h2>
        </header>

        <p className="mt-6 text-[15px] font-light leading-[1.45]">{cv.summary}</p>

        <div className="mt-5 flex gap-8 border-y border-ink/15 py-3">
          {cv.stats.map((s) => (
            <p key={s.label} className="flex items-baseline gap-2">
              <span className="text-[22px] font-medium text-signal">{s.value}</span>
              <span className="font-mono text-[7.5px] uppercase tracking-[0.14em] text-ink/60">{s.label}</span>
            </p>
          ))}
        </div>

        <div className="mt-6">
          <MainTitle>{t(CV_LABELS.experience)}</MainTitle>
          <ol className="space-y-3.5">
            {cv.jobs.map((job) => (
              <li key={job.company} className="grid grid-cols-[86px_1fr] gap-4">
                <p className="pt-0.5 font-mono text-[8.5px] uppercase tracking-[0.1em] text-ink/60">{job.period}</p>
                <div>
                  <p className="brand-title text-[11px] tracking-[0.24em]">{job.company}</p>
                  {/* Roles conectados: cada ascenso es un nodo más en la línea */}
                  <ul className="mt-1.5 border-l border-signal/50 pl-3">
                    {job.roles.map((r) => (
                      <li key={r.title} className="relative flex justify-between gap-3 text-[9.5px] font-medium leading-relaxed">
                        <span className="absolute -left-[15px] top-[6px] h-[6px] w-[6px] bg-signal" />
                        <span>{r.title}</span>
                        <span className="font-mono text-[7.5px] font-normal text-ink/50">{r.period}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-1.5 text-[9.5px] leading-[1.55] text-ink/75">{job.summary}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-8">
          <div>
            <MainTitle>{t(CV_LABELS.earlier)}</MainTitle>
            <ul className="space-y-1">
              {cv.earlier.map((job) => (
                <li key={job.company} className="flex justify-between gap-2 text-[9px] leading-snug">
                  <span>
                    {job.title} · <span className="text-ink/60">{job.company}</span>
                  </span>
                  <span className="font-mono text-[7.5px] text-ink/50">{job.period}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <MainTitle>{t(CV_LABELS.skills)}</MainTitle>
            <ul className="grid grid-cols-1 gap-y-1 text-[9px]">
              {cv.skills.map((s) => (
                <li key={s} className="flex items-center gap-2">
                  <span className="h-1 w-1 bg-signal" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </article>
  )
}

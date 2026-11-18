'use client'

import type { L } from '@/lib/i18n'
import { CV_LABELS, PAGE, type CvView } from './cv-content'
import { Constellation, GlyphNetwork } from './network-svg'

interface ProposalProps {
  cv: CvView
  t: (text: L) => string
}

function Label({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <h3 className="mb-3 flex items-center gap-3 font-mono text-[8.5px] uppercase tracking-[0.2em] text-paper/60">
      <span className="text-signal">{index}</span>
      <span className="h-px w-6 bg-paper/30" />
      {children}
    </h3>
  )
}

/**
 * B · Red en la oscuridad: el tono del hero. El EG como red de nodos,
 * cifras grandes y la información como etiquetas de sistema.
 */
export function ProposalDark({ cv, t }: ProposalProps) {
  return (
    <article
      className="relative flex flex-col overflow-hidden bg-void px-12 pb-10 pt-11 text-paper"
      style={{ width: PAGE.width, height: PAGE.height }}
    >
      <Constellation width={360} height={300} count={40} reach={72} seed={4} className="pointer-events-none absolute -right-6 -top-6 text-paper/50" />

      <header className="relative flex items-end gap-8 border-b border-paper/15 pb-7">
        <GlyphNetwork text="EG" height={112} className="text-paper" />
        <div>
          <p className="text-[30px] font-light leading-none tracking-[0.05em]">{cv.firstName}</p>
          <p className="mt-1 text-[60px] font-medium leading-none tracking-[0.2em]">{cv.lastName}</p>
          <p className="mt-3 flex items-center gap-2.5 font-mono text-[9px] uppercase tracking-[0.2em] text-paper/70">
            <span className="h-1.5 w-1.5 rounded-full bg-signal" />
            {cv.role}
          </p>
        </div>
      </header>

      <div className="relative mt-6 grid grid-cols-[1fr_auto] items-end gap-10">
        <p className="max-w-[46ch] text-[13px] font-light leading-[1.55] text-paper/90">{cv.summary}</p>
        <div className="flex gap-6">
          {cv.stats.map((s) => (
            <div key={s.label} className="text-right">
              <p className="text-[34px] font-light leading-none text-signal tabular-nums">{s.value}</p>
              <p className="mt-1 font-mono text-[7px] uppercase tracking-[0.14em] text-paper/50">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="relative mt-8 grid flex-1 grid-cols-[1fr_200px] gap-10">
        <div>
          <Label index="01">{t(CV_LABELS.experience)}</Label>
          <ol className="space-y-6">
            {cv.jobs.map((job, i) => (
              <li key={job.company} className="grid grid-cols-[34px_1fr] border-t border-paper/15 pt-3">
                <span className="font-mono text-[9px] text-signal">0{i + 1}</span>
                <div>
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="brand-title text-[12px] tracking-[0.26em]">{job.company}</p>
                    <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-paper/50">{job.period}</p>
                  </div>
                  <p className="mt-1 text-[10px] text-paper/80">{job.roles.map((r) => r.title).join(' → ')}</p>
                  <p className="mt-2 text-[10px] leading-[1.6] text-paper/70">{job.summary}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-9">
            <Label index="02">{t(CV_LABELS.earlier)}</Label>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-1.5">
              {cv.earlier.map((job) => (
                <li key={job.company} className="text-[9px] leading-snug">
                  <span className="text-paper/90">{job.title}</span>
                  <span className="block font-mono text-[7.5px] uppercase tracking-[0.1em] text-paper/45">
                    {job.company} · {job.period}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="space-y-8">
          <div>
            <Label index="03">{t(CV_LABELS.education)}</Label>
            <ul className="space-y-2">
              {cv.studies.map((s) => (
                <li key={s.title} className="text-[9px] leading-snug">
                  <p className="text-paper/90">{s.title}</p>
                  <p className="font-mono text-[7.5px] uppercase tracking-[0.1em] text-paper/45">
                    {s.school} · {s.period}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Label index="04">{t(CV_LABELS.tools)}</Label>
            <div className="flex flex-wrap gap-1">
              {cv.tools.flatMap((g) => g.tools).map((tool, i) => (
                <span key={tool} className={`border px-1.5 py-0.5 text-[8.5px] ${i < 6 ? 'border-signal text-paper' : 'border-paper/25 text-paper/70'}`}>
                  {tool}
                </span>
              ))}
            </div>
          </div>
          <div>
            <Label index="05">{t(CV_LABELS.skills)}</Label>
            <p className="text-[9px] leading-[1.7] text-paper/75">{cv.skills.join(' · ')}</p>
          </div>
        </aside>
      </div>

      <footer className="relative mt-6 flex justify-between border-t border-paper/15 pt-3 font-mono text-[8px] uppercase tracking-[0.14em] text-paper/60">
        {cv.contact.map((c) => (
          <span key={c.label}>
            <span className="text-signal">{c.label} </span>
            {c.value}
          </span>
        ))}
      </footer>
    </article>
  )
}

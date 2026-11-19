'use client'

import { useLocale } from '@/lib/i18n'
import { CLIPPER } from '@/lib/content/cases/barberlytics/clipper'
import { ClipperOrb } from './clipper-orb'
import { LogoRounds, OrbStates } from './clipper-identity'
import { Block, Body, ChapterOpening, Shot, SubHead } from './ui'

const EVAL_TOTAL = CLIPPER.build.evals.split.reduce((sum, s) => sum + s.value, 0)

/** Capítulo 4 · Clipper: identidad, personalidad, interacción, capacidades y construcción. */
export function ChapterClipper() {
  const { t } = useLocale()
  const { voice, interactions, tools, build, booking } = CLIPPER

  return (
    <>
      <ChapterOpening intro={CLIPPER.intro} />

      <OrbStates />

      <Block>
        <LogoRounds />
      </Block>

      <Block>
        <SubHead index="4.3">{t(voice.title)}</SubHead>
        <div data-reveal className="mb-10 flex items-center gap-4">
          <ClipperOrb size={44} />
          <p className="text-[clamp(1.6rem,1rem+1.8vw,2.6rem)] font-light">{t(voice.greeting)}</p>
        </div>
        <dl className="divide-y divide-fg/15 border-y border-fg/15">
          {voice.lines.map((line) => (
            <div key={line.rule.es} data-reveal className="grid gap-2 py-5 md:grid-cols-12 md:gap-8">
              <dt className="text-lg leading-snug md:col-span-7">{t(line.rule)}</dt>
              <dd className="text-sm leading-relaxed opacity-70 md:col-span-5">{t(line.why)}</dd>
            </div>
          ))}
        </dl>
      </Block>

      <Block>
        <SubHead index="4.4">{t(interactions.title)}</SubHead>
        <Body>{t(interactions.lead)}</Body>
        <dl className="mt-8 grid gap-px overflow-hidden border border-fg/15 bg-fg/15 sm:grid-cols-2 lg:grid-cols-4">
          {interactions.items.map((item, i) => (
            <div key={item.title.es} data-reveal className="bg-bg p-5">
              <dt className="flex items-baseline gap-2 font-medium">
                <span className="mono-label text-signal">{String(i + 1).padStart(2, '0')}</span>
                {t(item.title)}
              </dt>
              <dd className="mt-2 text-sm leading-relaxed opacity-70">{t(item.body)}</dd>
            </div>
          ))}
        </dl>
        <Shot image={interactions.screen} className="mt-10" />
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {interactions.cards.map((img) => (
            <Shot key={img.src} image={img} frame="plain" sizes="(min-width: 768px) 40vw, 100vw" />
          ))}
        </div>
      </Block>

      <Block>
        <SubHead index="4.5">{t(tools.title)}</SubHead>
        <div className="grid gap-10 lg:grid-cols-2">
          <div data-reveal>
            <p className="mono-label mb-4 opacity-60">{t(tools.alone)} · 13</p>
            <dl className="space-y-4">
              {tools.groups.map((g) => (
                <div key={g.name.es}>
                  <dt className="text-sm font-medium">{t(g.name)}</dt>
                  <dd className="mt-1.5 flex flex-wrap gap-1.5">
                    {g.items.map((tool) => (
                      <code key={tool} className="border border-fg/15 px-2 py-0.5 text-[11px] opacity-80">{tool}</code>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div data-reveal>
            <p className="mono-label mb-4 text-signal">{t(tools.approval)} · 5</p>
            <ul className="flex flex-wrap gap-1.5">
              {tools.proposals.map((tool) => (
                <li key={tool}>
                  <code className="border border-signal/60 px-2 py-0.5 text-[11px]">{tool}</code>
                </li>
              ))}
            </ul>
            <p className="mt-8 border-l-2 border-fg/40 pl-4 text-lg font-light leading-snug">{t(tools.never)}</p>
          </div>
        </div>
      </Block>

      <Block>
        <SubHead index="4.6">{t(build.title)}</SubHead>
        <ol className="grid gap-px overflow-hidden border border-fg/15 bg-fg/15 md:grid-cols-3">
          {build.phases.map((p, i) => (
            <li key={p.title.es} data-reveal className={`bg-bg p-6 ${i === 2 ? 'opacity-70' : ''}`}>
              <p className="font-medium">{t(p.title)}</p>
              <p className="mt-2 text-sm leading-relaxed opacity-75">{t(p.body)}</p>
            </li>
          ))}
        </ol>

        <div className="mt-12 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p data-reveal className="text-xl font-light">{t(build.evals.title)}</p>
            <Body className="mt-4">{t(build.evals.body)}</Body>
            <div data-reveal className="mt-8 flex h-3 w-full overflow-hidden" role="img" aria-label={build.evals.split.map((s) => `${s.value} ${t(s.label)}`).join(', ')}>
              {build.evals.split.map((s, i) => (
                <span key={s.label.es} className={i === 0 ? 'bg-signal' : i === 1 ? 'bg-fg/60' : 'bg-fg/25'} style={{ width: `${(s.value / EVAL_TOTAL) * 100}%` }} />
              ))}
            </div>
            <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
              {build.evals.split.map((s) => (
                <li key={s.label.es}>
                  <span className="tabular-nums">{s.value}</span> <span className="opacity-60">{t(s.label)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4 lg:col-span-5">
            {build.evals.examples.map((ex) => (
              <figure key={ex.q.es} data-reveal className="border border-fg/15 p-5">
                <blockquote className="text-sm font-medium">{t(ex.q)}</blockquote>
                <figcaption className="mt-2 text-sm opacity-70">→ {t(ex.a)}</figcaption>
              </figure>
            ))}
          </div>
        </div>
        <ul className="mt-10 flex flex-wrap gap-2">
          {build.stack.map((item) => (
            <li key={item.es} data-reveal className="border border-fg/20 px-3 py-1.5 text-xs">{t(item)}</li>
          ))}
        </ul>
      </Block>

      <Block>
        <SubHead index="4.7">{t(booking.title)}</SubHead>
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="grid grid-cols-2 gap-6 lg:col-span-6">
            {booking.images.map((img) => (
              <Shot key={img.src} image={img} frame="phone" sizes="(min-width: 1024px) 20vw, 45vw" />
            ))}
          </div>
          <div className="lg:col-span-6">
            <Body>{t(booking.body)}</Body>
            <p data-reveal className="mt-6 text-sm opacity-60">{t(booking.note)}</p>
          </div>
        </div>
      </Block>
    </>
  )
}

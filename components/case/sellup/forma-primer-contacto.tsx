'use client'

import { useEffect, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { CHANNELS, MESSAGE_TYPES, type Channel } from '@/lib/content/cases/sellup/sellup-agents'
import { BLUE, OK, WARN, useInView } from './ui'

/** Ejemplo ficticio: dos decisores de «Grupo Meridiano». */
const PEOPLE = [
  { id: 'p1', initials: 'AR', name: 'Ana R.', role: { es: 'Gerente de Talento', en: 'Talent Manager' } },
  { id: 'p2', initials: 'JC', name: 'Jorge C.', role: { es: 'Gerente General', en: 'General Manager' } },
] as const

const FACTS: readonly L[] = [
  { es: '[1] «Abrimos dos plantas en Monterrey este año» — sitio oficial, 02-10', en: '[1] “We opened two plants in Monterrey this year” — official site, 02-Oct' },
  { es: '[2] 38 vacantes de supervisión publicadas — portal de empleo de la empresa', en: '[2] 38 supervisor openings posted — company careers page' },
]

const MESSAGES: Record<Channel, L> = {
  call: { es: '«Buenos días, Ana. ¿Me regala 30 segundos? Vi que abrieron dos plantas en Monterrey [1] y que buscan 38 supervisores [2]…»', en: '“Good morning, Ana. Could I have 30 seconds? I saw you opened two plants in Monterrey [1] and are hiring 38 supervisors [2]…”' },
  email: { es: 'Asunto: Supervisores nuevos\n\nAna, con dos plantas nuevas [1] y 38 vacantes de supervisión [2], ¿cómo están preparando a esos líderes? ¿Le parece una conversación de 20 minutos?', en: 'Subject: New supervisors\n\nAna, with two new plants [1] and 38 supervisor openings [2], how are you preparing those leaders? Would a 20-minute conversation work?' },
  whatsapp: { es: 'Ana, buen día. Le escribo de UBITS por las plantas nuevas de Monterrey [1]. ¿Me permite enviarle una idea corta por aquí?', en: 'Ana, good morning. I’m writing from UBITS about the new Monterrey plants [1]. May I send you a short idea here?' },
  linkedin: { es: 'Ana, vi la apertura de las plantas en Monterrey [1]. Me interesa cómo forman a los supervisores nuevos. Encantado de seguirla.', en: 'Ana, I saw the Monterrey plants opening [1]. I’m interested in how you train new supervisors. Glad to follow your work.' },
}

/** El texto que el verificador marca: una cifra sin fuente y una frase que suena a cliente inventado. */
const FLAGGED: { es: readonly { s: string; flag?: L }[]; en: readonly { s: string; flag?: L }[] } = {
  es: [{ s: 'Jorge, ' }, { s: 'las empresas como la suya reducen 40 % la rotación', flag: { es: 'Cifra sin fuente', en: 'Unsourced figure' } }, { s: ' y ' }, { s: 'trabajamos con muchos grupos industriales', flag: { es: 'Suena a cliente inventado', en: 'Sounds like a made-up client' } }, { s: '. ¿Agendamos 20 minutos?' }],
  en: [{ s: 'Jorge, ' }, { s: 'companies like yours cut turnover by 40%', flag: { es: 'Cifra sin fuente', en: 'Unsourced figure' } }, { s: ' and ' }, { s: 'we work with many industrial groups', flag: { es: 'Suena a cliente inventado', en: 'Sounds like a made-up client' } }, { s: '. Shall we book 20 minutes?' }],
}

type CellKey = `${string}:${Channel}`
const REVIEW_CELL: CellKey = 'p2:email'
const PLANNED: readonly CellKey[] = ['p1:call', 'p1:email', 'p1:whatsapp', 'p1:linkedin', 'p2:email']

/** 5.5 · Decisor × canal: una investigación, un redactor por decisor, una preparación por celda. */
export function PrepMatrix() {
  const { t, locale } = useLocale()
  const { reducedMotion } = useA11y()
  const [ref, seen] = useInView<HTMLDivElement>()
  const [ready, setReady] = useState(0)
  const [open, setOpen] = useState<CellKey>('p1:email')

  useEffect(() => {
    if (!seen) return
    if (reducedMotion) {
      setReady(PLANNED.length)
      return
    }
    const id = window.setInterval(() => setReady((n) => (n >= PLANNED.length ? n : n + 1)), 520)
    return () => window.clearInterval(id)
  }, [seen, reducedMotion])

  const [pid, ch] = open.split(':') as [string, Channel]
  const person = PEOPLE.find((p) => p.id === pid) ?? PEOPLE[0]
  const isReview = open === REVIEW_CELL

  return (
    <div ref={ref} data-reveal="device" className="grid gap-4 rounded-[20px] bg-[#f4f5f7] p-4 text-[#14161b] md:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <div className="rounded-[14px] border border-black/[0.08] bg-white p-4">
        <p className="text-sm font-medium">Grupo Meridiano · {t({ es: 'Primer contacto', en: 'First contact' })}</p>
        <p className="mt-1 text-xs text-black/50">{t({ es: '1 investigación vigente 30 días · datos de ejemplo', en: '1 research valid 30 days · sample data' })}</p>
        <table className="mt-4 w-full border-separate border-spacing-1.5 text-xs">
          <thead>
            <tr><th className="sr-only">{t({ es: 'Decisor', en: 'Decision-maker' })}</th>{CHANNELS.map((c) => <th key={c.id} className="font-normal text-black/50">{t(c.name)}</th>)}</tr>
          </thead>
          <tbody>
            {PEOPLE.map((p) => (
              <tr key={p.id}>
                <th scope="row" className="pr-1 text-left font-normal"><span className="grid h-8 w-8 place-items-center rounded-full bg-[#5b7eff]/12 text-[11px] text-[#3150d8]" title={p.name}>{p.initials}</span></th>
                {CHANNELS.map((c) => {
                  const key = `${p.id}:${c.id}` as CellKey
                  const idx = PLANNED.indexOf(key)
                  const done = idx >= 0 && idx < ready
                  const review = key === REVIEW_CELL && done
                  const selected = key === open
                  return (
                    <td key={c.id}>
                      <button
                        type="button"
                        onClick={() => done && setOpen(key)}
                        aria-pressed={selected}
                        aria-label={`${p.name} · ${t(c.name)}`}
                        className="grid h-11 w-full place-items-center rounded-[10px] border text-sm transition-all duration-300"
                        style={{
                          borderColor: selected ? BLUE : 'rgba(0,0,0,0.08)',
                          background: review ? 'rgba(245,158,11,0.15)' : done ? 'rgba(16,185,129,0.12)' : 'transparent',
                          color: review ? '#b45309' : done ? '#047857' : 'rgba(0,0,0,0.3)',
                        }}
                      >
                        {review ? '!' : done ? '✓' : '+'}
                      </button>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 text-xs text-black/55">{t({ es: 'Cada celda vacía prepara justo eso. «Preparar lo que falta» marca todo lo pendiente.', en: 'Each empty cell prepares exactly that. “Prepare what’s missing” marks everything pending.' })}</p>
      </div>

      <div className="rounded-[14px] border border-black/[0.08] bg-white p-4" aria-live="polite">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium">{person.name} · {t(CHANNELS.find((c) => c.id === ch)?.name ?? CHANNELS[0].name)}</p>
          <span className="ml-auto rounded-md px-2 py-0.5 text-[11px] font-medium" style={{ background: isReview ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.12)', color: isReview ? '#b45309' : '#047857' }}>
            {isReview ? t({ es: 'Para revisar', en: 'To review' }) : t({ es: 'Lista', en: 'Ready' })}
          </span>
        </div>
        {isReview ? (
          <p className="mt-4 text-sm leading-relaxed">
            {FLAGGED[locale].map((part) =>
              part.flag ? (
                <mark key={part.s} className="rounded bg-amber-200/70 px-0.5 text-inherit">{part.s}<sup className="ml-1 font-mono text-[10px] text-amber-800">{t(part.flag)}</sup></mark>
              ) : (
                <span key={part.s}>{part.s}</span>
              ),
            )}
          </p>
        ) : (
          <p className="mt-4 whitespace-pre-line text-sm leading-relaxed">{t(MESSAGES[ch])}</p>
        )}
        <div className="mt-4 border-t border-black/[0.06] pt-3">
          <p className="text-[11px] text-black/45">{isReview ? t({ es: 'El verificador sin IA no encontró estas frases en los hechos citados.', en: 'The non-AI checker didn’t find these phrases in the cited facts.' }) : t({ es: 'Hechos citados', en: 'Cited facts' })}</p>
          {!isReview && <ul className="mt-2 space-y-1">{FACTS.map((f) => <li key={f.es} className="text-xs text-black/65">{t(f)}</li>)}</ul>}
        </div>
        <p className="mt-3 text-[11px] text-black/45">{t(CHANNELS.find((c) => c.id === ch)?.rule ?? CHANNELS[0].rule)}</p>
      </div>
    </div>
  )
}

/** 5.6 · Ocho formas de abrir la conversación, elegidas por contexto. */
export function MessageTypes() {
  const { t } = useLocale()
  return (
    <ol className="grid gap-px overflow-hidden rounded-[20px] border border-fg/15 bg-fg/15 sm:grid-cols-2 lg:grid-cols-4">
      {MESSAGE_TYPES.map((m, i) => (
        <li key={m.name.es} data-reveal className={`bg-bg p-5 ${m.off ? 'opacity-50' : ''}`}>
          <span className="font-mono text-[11px]" style={{ color: m.off ? WARN : OK }}>{String(i + 1).padStart(2, '0')}{m.off ? ` · ${t({ es: 'apagado', en: 'off' })}` : ''}</span>
          <p className="mt-2 leading-snug">{t(m.name)}</p>
          <p className="mt-2 text-sm leading-relaxed opacity-65">{t(m.when)}</p>
        </li>
      ))}
    </ol>
  )
}

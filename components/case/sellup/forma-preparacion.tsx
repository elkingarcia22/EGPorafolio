'use client'

import { useEffect, useState } from 'react'
import { useLocale, type L } from '@/lib/i18n'
import { AppCard, AppFrame, Pill, RumboOrb } from './platform'
import { useInView } from './ui'
import { SampleNote } from './forma-shared'

type Channel = 'email' | 'linkedin' | 'call' | 'whatsapp'
type PersonId = 'p1' | 'p2'

const CHANNELS: readonly { id: Channel; label: L }[] = [
  { id: 'email', label: { es: 'Correo', en: 'Email' } },
  { id: 'linkedin', label: { es: 'LinkedIn', en: 'LinkedIn' } },
  { id: 'call', label: { es: 'Llamada', en: 'Call' } },
  { id: 'whatsapp', label: { es: 'WhatsApp', en: 'WhatsApp' } },
]

const PEOPLE: Record<PersonId, { name: string; role: string }> = {
  p1: { name: 'Laura Méndez', role: 'Directora de Talento Humano' },
  p2: { name: 'Martín Ospina', role: 'Head of Learning & Development' },
}

/** Hechos citados de la investigación (válida 30 días para toda la empresa). */
const FACTS: readonly { text: L; source: string }[] = [
  { text: { es: 'Abrió 3 plantas nuevas en 2026 y contrata 400 operarios.', en: 'Opened 3 new plants in 2026 and is hiring 400 operators.' }, source: 'Sitio oficial · Noticias' },
  { text: { es: 'Su informe de sostenibilidad pide «cerrar brechas de liderazgo».', en: 'Its sustainability report asks to “close leadership gaps”.' }, source: 'Informe 2025 · p. 34' },
  { text: { es: 'Rotación alta en mandos medios, según su propia vacante.', en: 'High middle-manager turnover, per its own job post.' }, source: 'Vacante publicada · oct.' },
]

/** Mensajes de ejemplo por decisor y canal. */
function draft(p: PersonId, c: Channel, es: boolean): string {
  const name = PEOPLE[p].name.split(' ')[0]
  const focus = p === 'p1'
    ? (es ? 'los 400 operarios que van a entrar con las plantas nuevas' : 'the 400 operators joining with the new plants')
    : (es ? 'la brecha de liderazgo que menciona su informe' : 'the leadership gap your report mentions')
  const m: Record<Channel, string> = es
    ? {
        email: `Asunto: ${p === 'p1' ? 'Onboarding para 3 plantas' : 'Brechas de liderazgo'}\n\nHola ${name}, vi que Grupo Andino abrió tres plantas este año. Con ${focus}, ¿le sirve conversar 20 minutos sobre cómo otras empresas de alimentos lo resolvieron?`,
        linkedin: `Hola ${name}, leí la noticia de las plantas nuevas: felicitaciones. Trabajo con equipos de personas en alimentos y me interesa cómo están pensando ${focus}.`,
        call: `Apertura: «${name}, le llamo por ${focus}».\nPregunta: ¿cómo están formando hoy a quien entra?\nSi dice «no es buen momento»: proponer 15 min el jueves.`,
        whatsapp: `Hola ${name} 👋 Soy de UBITS. Vi lo de las plantas nuevas de Grupo Andino. ¿Le escribo por correo una idea corta sobre ${focus}?`,
      }
    : {
        email: `Subject: ${p === 'p1' ? 'Onboarding for 3 plants' : 'Leadership gaps'}\n\nHi ${name}, I saw Grupo Andino opened three plants this year. With ${focus}, would a 20-minute chat on how other food companies solved it help?`,
        linkedin: `Hi ${name}, I read about the new plants: congratulations. I work with people teams in food and I’m curious how you’re approaching ${focus}.`,
        call: `Opener: “${name}, I’m calling about ${focus}.”\nQuestion: how are you training new hires today?\nIf “bad timing”: propose 15 min on Thursday.`,
        whatsapp: `Hi ${name} 👋 I’m with UBITS. Saw the news on Grupo Andino’s new plants. Can I email you a short idea about ${focus}?`,
      }
  return m[c]
}

/** Agente 3: la preparación del primer contacto, decisor × canal. */
export function FirstContactPrep() {
  const { t, locale } = useLocale()
  const [ref, seen] = useInView<HTMLDivElement>(0.3)
  const [person, setPerson] = useState<PersonId>('p1')
  const [channel, setChannel] = useState<Channel>('email')
  const [typed, setTyped] = useState(0)
  const [facts, setFacts] = useState(0)
  const text = draft(person, channel, locale === 'es')

  useEffect(() => {
    if (!seen || facts >= FACTS.length) return
    const id = window.setTimeout(() => setFacts((f) => f + 1), 600)
    return () => window.clearTimeout(id)
  }, [seen, facts])

  useEffect(() => setTyped(0), [person, channel, locale])

  useEffect(() => {
    if (facts < FACTS.length || typed >= text.length) return
    const id = window.setTimeout(() => setTyped((n) => Math.min(text.length, n + 3)), 18)
    return () => window.clearTimeout(id)
  }, [facts, typed, text.length])

  return (
    <div ref={ref} data-reveal="device">
      <AppFrame active="flujo" crumb="Flujo de prospección / Grupo Andino de Alimentos">
        <div className="p-3 md:p-4">
          <AppCard className="p-3">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-medium">3. {t({ es: 'Primer contacto', en: 'First contact' })}</p>
              <Pill tone="blue">Agente 3</Pill>
              <span className="ml-auto flex items-center gap-1.5 text-[10px] opacity-70">
                <RumboOrb size={14} pulse={facts < FACTS.length && seen} />
                {facts < FACTS.length ? t({ es: 'Rumbo investiga la empresa…', en: 'Rumbo researches the company…' }) : t({ es: 'Investigación lista · vale 30 días', en: 'Research ready · valid 30 days' })}
              </span>
            </div>

            <div className="mt-3 grid gap-3 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              <div>
                <p className="mb-1.5 text-[10px] uppercase tracking-wider opacity-50">{t({ es: 'Lo que sabemos, con su fuente', en: 'What we know, with its source' })}</p>
                <ul className="space-y-1.5">
                  {FACTS.slice(0, facts).map((f) => (
                    <li key={f.source} className="rounded-lg bg-black/25 p-2 ring-1 ring-white/[0.06]" style={{ animation: 'sellupRowIn .45s ease-out' }}>
                      <p className="leading-snug">{t(f.text)}</p>
                      <p className="mt-1 font-mono text-[9px] text-[#a9baff]">↗ {f.source}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="min-w-0">
                <div className="flex gap-1">
                  {(Object.keys(PEOPLE) as PersonId[]).map((id) => (
                    <button key={id} type="button" onClick={() => setPerson(id)} className={`min-w-0 flex-1 rounded-lg px-2 py-1.5 text-left ring-1 transition ${person === id ? 'bg-[#5b7eff]/15 ring-[#5b7eff]/50' : 'opacity-60 ring-white/10 hover:opacity-100'}`}>
                      <span className="block truncate">{PEOPLE[id].name}</span>
                      <span className="block truncate text-[9px] opacity-60">{PEOPLE[id].role}</span>
                    </button>
                  ))}
                </div>
                <div role="tablist" className="mt-2 flex gap-1 overflow-x-auto">
                  {CHANNELS.map((c) => (
                    <button key={c.id} role="tab" aria-selected={channel === c.id} type="button" onClick={() => setChannel(c.id)} className={`whitespace-nowrap rounded-md px-2 py-1 text-[10px] transition ${channel === c.id ? 'bg-white text-black' : 'opacity-60 ring-1 ring-white/10 hover:opacity-100'}`}>
                      {t(c.label)}
                    </button>
                  ))}
                </div>
                <div className="mt-2 min-h-[150px] whitespace-pre-line rounded-lg bg-black/30 p-2.5 font-mono text-[11px] leading-relaxed ring-1 ring-white/[0.06]">
                  {facts < FACTS.length ? <span className="opacity-40">{t({ es: 'Esperando la investigación…', en: 'Waiting for research…' })}</span> : text.slice(0, typed)}
                  {facts >= FACTS.length && typed < text.length && <span className="ml-0.5 inline-block h-3 w-1.5 animate-pulse bg-[#a9baff] align-middle" />}
                </div>
                <p className="mt-1.5 text-[10px] opacity-55">{t({ es: 'Un verificador sin IA comprueba que cada dato esté en la fuente. No se envía nada solo.', en: 'A non-AI checker confirms every fact is in the source. Nothing is sent on its own.' })}</p>
              </div>
            </div>
          </AppCard>
        </div>
      </AppFrame>
      <style>{'@keyframes sellupRowIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}'}</style>
      <SampleNote />
    </div>
  )
}

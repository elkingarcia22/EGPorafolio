'use client'

import { useEffect, useState } from 'react'
import { Check, GitBranch, Linkedin, Loader2, Mail, MessageCircle, Phone, ShieldCheck } from 'lucide-react'
import { RumboMark } from './platform'
import { ContactDetail } from './real-detail'
import { RealFrame, RealTag } from './real-app'
import { RecordHeader, RecordSection, RecordStepper } from './real-record'
import { FakeCursor, HIGHLIGHT, RealDock, ReplicaNote, StorySteps, stepAt, useStoryTime, type StoryStep } from './real-story'

/**
 * 5.4 · Agente 3: en la ficha real, «Preparar primer contacto con Rumbo IA»
 * investiga la empresa con fuentes y escribe un mensaje por decisor y canal.
 * Se puede elegir decisor y canal; si no, el recorrido avanza solo.
 */

const STEPS: readonly StoryStep[] = [
  { label: { es: 'Desde el contacto: «Preparar primer contacto»', en: 'From the contact: “Prepare first contact”' }, from: 0 },
  { label: { es: 'Rumbo investiga, cada dato con fuente', en: 'Rumbo researches, every fact sourced' }, from: 8 },
  { label: { es: 'Escribe por decisor y canal', en: 'Writes per person and channel' }, from: 14 },
]
const LOOP = 32
/** Segundos que se ve el detalle del contacto antes de la ficha. */
const INTRO = 4

type Channel = 'email' | 'linkedin' | 'call' | 'whatsapp'
const CHANNELS: readonly { id: Channel; label: string; Icon: typeof Mail }[] = [
  { id: 'email', label: 'Correo', Icon: Mail },
  { id: 'linkedin', label: 'LinkedIn', Icon: Linkedin },
  { id: 'call', label: 'Llamada', Icon: Phone },
  { id: 'whatsapp', label: 'WhatsApp', Icon: MessageCircle },
]
const PEOPLE = [
  { name: 'Mariana Rojas', role: 'Directora de Talento' },
  { name: 'Jorge Peña', role: 'Gerente de Recursos Humanos' },
]
const FACTS = [
  { text: 'Abrió 3 clínicas nuevas en 2026.', source: 'Sitio oficial · Noticias' },
  { text: 'Busca 120 enfermeras este trimestre.', source: 'Portal de empleo · nov.' },
  { text: 'Mariana lidera la nueva academia interna.', source: 'LinkedIn · publicación' },
]

function draft(p: number, c: Channel): string {
  const name = PEOPLE[p].name.split(' ')[0]
  const focus = p === 0 ? 'cómo va a formar a las 120 enfermeras que entran' : 'el onboarding de las 3 clínicas nuevas'
  const m: Record<Channel, string> = {
    email: `Asunto: ${p === 0 ? 'La academia y las 120 enfermeras' : 'Onboarding de 3 clínicas'}\n\nHola ${name}, vi que Clínica Andina abrió tres clínicas este año. Me interesa ${focus}. ¿Le sirve conversar 20 minutos sobre cómo lo resolvieron otras redes de salud?`,
    linkedin: `Hola ${name}, leí su publicación sobre la academia interna: felicitaciones. Trabajo con equipos de personas en salud y me interesa ${focus}.`,
    call: `Apertura: «${name}, le llamo por ${focus}».\nPregunta: ¿cómo forman hoy a quien entra en el primer mes?\nSi dice «no es buen momento»: proponer 15 minutos el jueves.`,
    whatsapp: `Hola ${name} 👋 Soy de UBITS. Vi lo de las clínicas nuevas. ¿Le escribo por correo una idea corta sobre ${focus}?`,
  }
  return m[c]
}

const AUTO: readonly [number, Channel, number][] = [[10, 'email', 0], [15, 'linkedin', 0], [19, 'call', 1], [24, 'whatsapp', 1]]

function Prep({ time }: { time: number }) {
  const [pick, setPick] = useState<{ p: number; c: Channel } | null>(null)
  const auto = AUTO.reduce<{ p: number; c: Channel }>((acc, [at, c, p]) => (time >= at ? { p, c } : acc), { p: 0, c: 'email' })
  const { p, c } = pick ?? auto
  const text = draft(p, c)
  const [typed, setTyped] = useState(0)
  useEffect(() => setTyped(0), [p, c])
  useEffect(() => {
    if (time < 10 || typed >= text.length) return
    const id = window.setTimeout(() => setTyped((n) => Math.min(text.length, n + 3)), 22)
    return () => window.clearTimeout(id)
  }, [time, typed, text.length])
  useEffect(() => {
    if (time === 0) setPick(null)
  }, [time])
  const facts = Math.max(0, Math.min(FACTS.length, time - 4))
  const ready = time >= 10
  return (
    <div className="mt-3 grid grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-3">
      <div>
        <p className="mb-2 text-[12px] font-medium text-white/60">Lo que sabemos, con su fuente</p>
        <ul className="space-y-1.5">
          {FACTS.map((f, i) => (
            <li key={f.source} className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 transition-all duration-500" style={{ opacity: i < facts ? 1 : 0, transform: i < facts ? 'none' : 'translateY(8px)' }}>
              <p className="text-[12.5px]">{f.text}</p>
              <p className="mt-1 flex items-center gap-1.5 text-[11.5px] text-[#9db0ff]">↗ {f.source}<span className={`ml-auto flex items-center gap-1 text-emerald-300 transition-opacity duration-500 ${time >= 8 ? 'opacity-100' : 'opacity-0'}`}><ShieldCheck className="h-3 w-3" />En la fuente</span></p>
            </li>
          ))}
        </ul>
        <p className={`mt-2 text-[11.5px] text-white/45 transition-opacity duration-500 ${time >= 8 ? 'opacity-100' : 'opacity-0'}`}>Un verificador sin IA comprueba cada cita. La investigación vale 30 días para toda la empresa.</p>
      </div>
      <div className={`transition-opacity duration-500 ${ready ? 'opacity-100' : 'opacity-30'}`}>
        <div className="flex gap-1.5">
          {PEOPLE.map((person, i) => (
            <button key={person.name} type="button" onClick={() => setPick({ p: i, c })} className="flex-1 rounded-xl border px-3 py-1.5 text-left transition-all" style={p === i ? HIGHLIGHT : { borderColor: 'rgba(255,255,255,0.1)' }}>
              <span className="block text-[12.5px] font-medium">{person.name}</span>
              <span className="block text-[11px] text-white/50">{person.role}</span>
            </button>
          ))}
        </div>
        <div className="mt-2 flex gap-1.5" role="tablist">
          {CHANNELS.map(({ id, label, Icon }) => (
            <button key={id} type="button" role="tab" aria-selected={c === id} onClick={() => setPick({ p, c: id })} className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[12px] transition-all ${c === id ? 'bg-white text-[#0a0a0a]' : 'border border-white/10 text-white/65 hover:text-white'}`}>
              <Icon className="h-3.5 w-3.5" />{label}
            </button>
          ))}
        </div>
        <div className="mt-2 min-h-[150px] whitespace-pre-line rounded-xl border border-white/10 bg-[#0d0d0d] p-3 text-[12.5px] leading-relaxed">
          {ready ? text.slice(0, typed) : <span className="text-white/40">Esperando la investigación…</span>}
          {ready && typed < text.length && <span className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse bg-[#9db0ff] align-middle" />}
        </div>
        <p className="mt-1.5 flex items-center gap-2 text-[11.5px] text-white/50"><RealTag tone="amber">Para revisar</RealTag>No se envía nada solo: el vendedor lo usa o lo ajusta.</p>
      </div>
    </div>
  )
}

function Screen({ time }: { time: number }) {
  const started = time >= 4
  const ready = time >= 10
  return (
    <div className="space-y-2.5 px-6 pt-5">
      <RecordHeader stage={2} tags={<RealTag tone="green">3 decisores</RealTag>} />
      <RecordStepper stage={2} />
      <RecordSection n={2} title="Enriquecimiento de contactos" agent="Agente 2A" state={<RealTag tone="green">Completada</RealTag>} body="4 contactos · 3 decisores · 2 con teléfono · 2 en HubSpot." />
      <RecordSection
        n={3}
        title="Primer contacto"
        agent="Agente 3"
        state={ready ? <RealTag tone="amber">Listo para revisar</RealTag> : started ? <RealTag tone="blue">Investigando</RealTag> : <RealTag>Pendiente</RealTag>}
        body="El agente investiga la empresa y a sus decisores (cada dato con su fuente) y prepara qué decirle a cada uno en cada canal."
        dashed={!started}
        right={
          <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1.5 text-[12.5px] transition-all" style={time >= 1 && time < 4 ? HIGHLIGHT : { borderColor: 'rgba(255,255,255,0.15)' }}>
            {started && !ready ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : ready ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <RumboMark size={14} />}Preparar primer contacto con Rumbo IA
          </span>
        }
      >
        {started && <Prep time={time} />}
      </RecordSection>
    </div>
  )
}

export function FirstContactPrep() {
  const [ref, time] = useStoryTime(LOOP, 16)
  const now = stepAt(STEPS, time)
  const inner = Math.max(0, time - INTRO)
  const intro = time < INTRO
  return (
    <div ref={ref}>
      <StorySteps steps={STEPS} time={time} kicker={{ es: 'Agente 3', en: 'Agent 3' }} />
      <RealFrame
        active="flujo"
        crumb={['Flujo de prospección', 'Clínica Andina']}
        height={900}
        overlay={
          <>
            <RealDock busy={now === 1} label={now === 0 ? 'Preparar primer contacto con Rumbo IA' : now === 1 ? 'Investigando con Rumbo IA' : 'Primer contacto listo para revisar'} done={now === 2}>
              <span className="flex items-center gap-2 whitespace-nowrap rounded-xl bg-[#6b8cff] px-4 py-2 text-[13.5px] font-medium text-[#0a0a0a]"><GitBranch className="h-4 w-4" />Cambiar etapa</span>
            </RealDock>
            {intro ? (
              <FakeCursor x={time < 1 ? 1000 : 768} y={time < 1 ? 700 : 858} click={time === 2} show />
            ) : (
              <FakeCursor x={inner < 1 ? 900 : 1045} y={inner < 1 ? 640 : 448} click={inner === 3} show={inner < 5} />
            )}
          </>
        }
      >
        <Screen time={inner} />
        <ContactDetail show={intro} phone="done" prepHighlight={time >= 1} pressed={time === 2} />
      </RealFrame>
      <ReplicaNote />
    </div>
  )
}

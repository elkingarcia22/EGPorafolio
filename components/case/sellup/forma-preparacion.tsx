'use client'

import { useEffect, useState } from 'react'
import { Linkedin, Loader2, Mail, MessageCircle, Phone, ShieldCheck } from 'lucide-react'
import { RumboMark } from './platform'
import { ContactDetail } from './real-detail'
import { REAL, RealTag } from './real-app'
import { FakeCursor, HIGHLIGHT, ReplicaNote, StorySteps, stepAt, type StoryStep } from './real-story'
import { DetailScene, SceneStage, useSceneTime } from './forma-stage'

/**
 * 5.4 · Agente 3, en tres escenas: el detalle del contacto («Preparar primer contacto»),
 * Rumbo investigando con fuentes y la preparación por decisor y canal.
 * Se puede elegir decisor y canal; si no, el recorrido avanza solo.
 */

const STEPS: readonly StoryStep[] = [
  { label: { es: 'Desde el contacto: «Preparar primer contacto»', en: 'From the contact: “Prepare first contact”' }, from: 0 },
  { label: { es: 'Rumbo investiga, cada dato con fuente', en: 'Rumbo researches, every fact sourced' }, from: 5 },
  { label: { es: 'Escribe por decisor y canal', en: 'Writes per person and channel' }, from: 12 },
]
const LOOP = 32

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

const AUTO: readonly [number, Channel, number][] = [[0, 'email', 0], [5, 'linkedin', 0], [10, 'call', 1], [15, 'whatsapp', 1]]

const FONT = { fontFamily: REAL.font }

/** Escena 2: Rumbo investiga; cada hecho aparece con su fuente y luego se verifica. */
function Research({ time }: { time: number }) {
  const facts = Math.max(0, Math.min(FACTS.length, time - 5))
  const checked = time >= 10
  return (
    <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-[#141414] p-6 text-white" style={FONT}>
      <div className="flex items-center gap-3">
        <RumboMark size={34} motion={checked ? 'still' : 'thinking'} />
        <span><span className="block text-[15px] font-semibold">Rumbo</span><span className="block text-[12.5px] text-white/50">Preparar primer contacto · Clínica Andina</span></span>
        <span className="ml-auto">{checked ? <RealTag tone="green">3 de 3 en la fuente</RealTag> : <RealTag tone="blue"><Loader2 className="mr-1 h-3 w-3 animate-spin" />Investigando</RealTag>}</span>
      </div>
      <p className="mt-5 text-[13px] font-medium text-white/60">Lo que sabemos, con su fuente</p>
      <ul className="mt-2 space-y-2">
        {FACTS.map((f, i) => (
          <li key={f.source} className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 transition-all duration-500" style={{ opacity: i < facts ? 1 : 0, transform: i < facts ? 'none' : 'translateY(8px)' }}>
            <p className="text-[14px]">{f.text}</p>
            <p className="mt-1 flex items-center gap-1.5 text-[12px] text-[#9db0ff]">↗ {f.source}<span className={`ml-auto flex items-center gap-1 text-emerald-300 transition-opacity duration-500 ${checked ? 'opacity-100' : 'opacity-0'}`}><ShieldCheck className="h-3.5 w-3.5" />En la fuente</span></p>
          </li>
        ))}
      </ul>
      <p className={`mt-auto text-[12px] text-white/45 transition-opacity duration-500 ${checked ? 'opacity-100' : 'opacity-0'}`}>Un verificador sin IA comprueba cada cita. La investigación vale 30 días para toda la empresa.</p>
    </div>
  )
}

/** Escena 3: el mensaje por decisor y canal, escribiéndose. */
function Drafts({ time }: { time: number }) {
  const [pick, setPick] = useState<{ p: number; c: Channel } | null>(null)
  const auto = AUTO.reduce<{ p: number; c: Channel }>((acc, [at, c, p]) => (time >= at ? { p, c } : acc), { p: 0, c: 'email' })
  const { p, c } = pick ?? auto
  const text = draft(p, c)
  const [typed, setTyped] = useState(0)
  useEffect(() => setTyped(0), [p, c])
  useEffect(() => {
    if (typed >= text.length) return
    const id = window.setTimeout(() => setTyped((n) => Math.min(text.length, n + 3)), 22)
    return () => window.clearTimeout(id)
  }, [typed, text.length])
  useEffect(() => {
    if (time === 0) setPick(null)
  }, [time])
  return (
    <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-[#141414] p-6 text-white" style={FONT}>
      <p className="flex items-center gap-2 text-[15px] font-semibold">Primer contacto · Clínica Andina <RealTag tone="amber">Para revisar</RealTag></p>
      <div className="mt-4 flex gap-2">
        {PEOPLE.map((person, i) => (
          <button key={person.name} type="button" onClick={() => setPick({ p: i, c })} className="flex-1 rounded-xl border px-4 py-2 text-left transition-all" style={p === i ? HIGHLIGHT : { borderColor: 'rgba(255,255,255,0.1)' }}>
            <span className="block text-[14px] font-medium">{person.name}</span>
            <span className="block text-[12px] text-white/50">{person.role}</span>
          </button>
        ))}
      </div>
      <div className="mt-3 flex gap-2" role="tablist">
        {CHANNELS.map(({ id, label, Icon }) => (
          <button key={id} type="button" role="tab" aria-selected={c === id} onClick={() => setPick({ p, c: id })} className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] transition-all ${c === id ? 'bg-white text-[#0a0a0a]' : 'border border-white/10 text-white/65 hover:text-white'}`}>
            <Icon className="h-3.5 w-3.5" />{label}
          </button>
        ))}
      </div>
      <div className="mt-3 flex-1 whitespace-pre-line rounded-xl border border-white/10 bg-[#0d0d0d] p-4 text-[14px] leading-relaxed">
        {text.slice(0, typed)}
        {typed < text.length && <span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse bg-[#9db0ff] align-middle" />}
      </div>
      <p className="mt-3 text-[12px] text-white/50">No se envía nada solo: el vendedor lo usa o lo ajusta. Toca otro decisor o canal.</p>
    </div>
  )
}

export function FirstContactPrep() {
  const [ref, time, jump] = useSceneTime(LOOP, 16)
  const scene = stepAt(STEPS, time)
  return (
    <div ref={ref}>
      <StorySteps steps={STEPS} time={time} kicker={{ es: 'Agente 3', en: 'Agent 3' }} onPick={jump} />
      <SceneStage
        active={scene}
        scenes={[
          <DetailScene key="contact">
            <div className="relative h-full">
              <ContactDetail show inline phone="done" prepHighlight={time >= 1} pressed={time === 3} />
              <FakeCursor x={time < 1 ? 700 : 470} y={time < 1 ? 420 : 572} click={time === 3} show={time < 5} />
            </div>
          </DetailScene>,
          <DetailScene key="research" width={760} height={520}><Research time={time} /></DetailScene>,
          <DetailScene key="drafts" width={760} height={520}><Drafts time={Math.max(0, time - 12)} /></DetailScene>,
        ]}
      />
      <ReplicaNote />
    </div>
  )
}

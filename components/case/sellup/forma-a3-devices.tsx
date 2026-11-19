'use client'

import { Linkedin, Mail, MessageCircle, Phone } from 'lucide-react'
import type { ReactNode } from 'react'

/**
 * 5.4 · Los cuatro canales del primer contacto, cada uno en su propio aparato:
 * ventana de correo, tarjeta de LinkedIn, guion en tablet y WhatsApp en celular.
 * Los textos llevan las citas resaltadas ([…]).
 */

export type Channel = 'email' | 'linkedin' | 'call' | 'whatsapp'

export const CHANNELS: readonly { id: Channel; label: string; Icon: typeof Mail }[] = [
  { id: 'email', label: 'Correo', Icon: Mail },
  { id: 'linkedin', label: 'LinkedIn', Icon: Linkedin },
  { id: 'call', label: 'Llamada', Icon: Phone },
  { id: 'whatsapp', label: 'WhatsApp', Icon: MessageCircle },
]

export const PEOPLE = [
  { name: 'Valeria Ortiz', first: 'Valeria', role: 'Directora de Talento', mail: 'valeria.ortiz' },
  { name: 'Jorge Peña', first: 'Jorge', role: 'Gerente de Recursos Humanos', mail: 'jorge.pena' },
] as const

/** El mensaje base por decisor: frases con sus citas entre corchetes. */
export const BASE: readonly (readonly string[])[] = [
  ['Hola Valeria,', 'vi que Clínica Andina abrió 3 clínicas este año [Noticias]', 'y que buscan 120 enfermeras este trimestre [Empleo].', 'Como lidera la academia interna [LinkedIn], ¿cómo piensan formarlas en el primer mes?'],
  ['Hola Jorge,', 'con 1.240 colaboradores [Sitio oficial]', 'y una rotación del 28 % en salud [Prensa RR. HH.],', '¿cómo sostienen el onboarding de las 3 clínicas nuevas [Noticias]?'],
]

/** Pinta un texto con las citas «[…]» como chips de fuente. */
export function Cited({ text, className = '' }: { text: string; className?: string }) {
  const parts = text.split(/(\[[^\]]+\])/g)
  return (
    <span className={className}>
      {parts.map((p, i) =>
        p.startsWith('[') ? (
          <span key={i} className="mx-0.5 whitespace-nowrap rounded bg-gradient-to-r from-[#7e2be0]/35 to-[#d22d6a]/35 px-1 text-[0.85em] text-[#f1d6ff]">↗ {p.slice(1, -1)}</span>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </span>
  )
}

const strip = (s: string) => s.replace(/\s*\[[^\]]+\]/g, '')

export function EmailWindow({ p }: { p: number }) {
  const person = PEOPLE[p]
  return (
    <div className="w-[300px] overflow-hidden rounded-xl border border-white/15 bg-[#151515] text-[12px] shadow-2xl">
      <div className="flex items-center gap-1.5 border-b border-white/10 bg-[#1d1d1d] px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" /><span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" /><span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
        <span className="ml-2 text-white/55">Nuevo mensaje</span>
      </div>
      <div className="space-y-1.5 p-3 leading-snug">
        <p className="text-white/50">Para: <span className="text-white/85">{person.mail}@clinicaandina.mx</span></p>
        <p className="border-b border-white/10 pb-1.5 text-white/50">Asunto: <span className="text-white/90">{p === 0 ? 'La academia y las 120 enfermeras' : 'Onboarding de 3 clínicas'}</span></p>
        <p className="text-white/85">{BASE[p].map((s) => <Cited key={s} text={`${s} `} />)}</p>
        <p className="text-white/85">¿Le sirven 20 minutos el jueves?</p>
      </div>
    </div>
  )
}

export function LinkedInCard({ p }: { p: number }) {
  const person = PEOPLE[p]
  return (
    <div className="w-[260px] rounded-xl border border-white/15 bg-[#1b1f23] p-3 text-[12px] shadow-2xl">
      <div className="flex items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[#0a66c2] to-[#5b9bd5] text-[13px] font-semibold">{person.first[0]}</span>
        <span className="min-w-0"><span className="block truncate font-semibold">{person.name}</span><span className="block truncate text-[11px] text-white/50">{person.role} · Clínica Andina</span></span>
        <Linkedin className="ml-auto h-4 w-4 text-[#5b9bd5]" />
      </div>
      <p className="mt-2.5 rounded-lg bg-white/[0.05] p-2.5 leading-snug text-white/85">
        <Cited text={p === 0 ? 'Valeria, leí su publicación sobre la academia interna [LinkedIn]: felicitaciones. Me interesa cómo forman a quien entra.' : 'Jorge, vi lo de las 3 clínicas nuevas [Noticias]. Me interesa cómo sostienen el onboarding.'} />
      </p>
      <span className="mt-2 inline-block rounded-full bg-[#0a66c2] px-3 py-1 text-[11px] font-semibold">Conectar con nota</span>
    </div>
  )
}

export function CallTablet({ p }: { p: number }) {
  const person = PEOPLE[p]
  return (
    <div className="w-[300px] rounded-[22px] border-[7px] border-[#2a2a2e] bg-[#111] p-3 text-[12px] shadow-2xl">
      <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-white/45"><Phone className="h-3.5 w-3.5" />Guion de llamada · {person.first}</p>
      <ol className="mt-2 space-y-1.5 leading-snug">
        <li><span className="text-[#c9b3ff]">Apertura · </span><Cited text={strip(BASE[p][1]) + (p === 0 ? ' [Noticias]' : ' [Sitio oficial]')} /></li>
        <li><span className="text-[#c9b3ff]">Pregunta · </span>{strip(BASE[p][3])}</li>
        <li><span className="text-[#c9b3ff]">Si dice «no es buen momento» · </span>proponer 15 min el jueves.</li>
      </ol>
    </div>
  )
}

export function WhatsAppPhone({ p }: { p: number }) {
  const person = PEOPLE[p]
  return (
    <div className="w-[176px] rounded-[30px] border-[6px] border-[#2a2a2e] bg-[#0b141a] p-1.5 shadow-2xl">
      <span className="mx-auto mb-1 block h-1.5 w-12 rounded-full bg-black/60" />
      <div className="flex items-center gap-1.5 rounded-t-[18px] bg-[#1f2c34] px-2 py-1.5 text-[11px]">
        <span className="grid h-6 w-6 place-items-center rounded-full bg-[#25d366]/30 text-[10px]">{person.first[0]}</span>
        <span className="truncate font-semibold">{person.first}</span>
        <MessageCircle className="ml-auto h-3.5 w-3.5 text-[#25d366]" />
      </div>
      <div className="h-[190px] space-y-1.5 bg-[#0b141a] p-2 text-[11px] leading-snug">
        <p className="ml-auto w-[92%] rounded-lg rounded-tr-none bg-[#005c4b] p-2 text-white/90">
          <Cited text={`Hola ${person.first} 👋 Soy de UBITS. ${p === 0 ? 'Vi lo de las 120 enfermeras [Empleo].' : 'Vi lo de las clínicas nuevas [Noticias].'} ¿Le escribo por correo una idea corta?`} />
          <span className="mt-1 block text-right text-[9px] text-white/50">9:41 ✓✓</span>
        </p>
      </div>
    </div>
  )
}

export function Device({ channel, p }: { channel: Channel; p: number }): ReactNode {
  if (channel === 'email') return <EmailWindow p={p} />
  if (channel === 'linkedin') return <LinkedInCard p={p} />
  if (channel === 'call') return <CallTablet p={p} />
  return <WhatsAppPhone p={p} />
}

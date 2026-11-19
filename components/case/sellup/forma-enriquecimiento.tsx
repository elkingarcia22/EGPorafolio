'use client'

import { Check, Globe, GitBranch, Loader2, Phone, User, Users, Lock } from 'lucide-react'
import { RumboOrb } from './platform'
import { RealFrame, RealTag } from './real-app'
import { RecordHeader, RecordSection, RecordStepper } from './real-record'
import { FakeCursor, HIGHLIGHT, RealDock, ReplicaNote, StorySteps, stepAt, useStoryTime, type StoryStep } from './real-story'

/**
 * 5.3 · Agente 2: desde la ficha real, un clic en «Buscar más contactos con IA»
 * reserva créditos, baja por la cascada de fuentes y trae a los decisores.
 */

const STEPS: readonly StoryStep[] = [
  { label: { es: 'Clic en «Buscar más contactos con IA»', en: 'Click “Find more contacts with AI”' }, from: 0 },
  { label: { es: 'Reserva créditos y recorre las fuentes', en: 'Reserves credits and walks the sources' }, from: 4 },
  { label: { es: 'Llegan los decisores', en: 'Decision-makers arrive' }, from: 12 },
]
const LOOP = 24

const SOURCES = [
  { name: 'HubSpot', cost: 'Gratis', found: 2, at: 5 },
  { name: 'Lo que SellUp ya conocía', cost: 'Gratis', found: 0, at: 7 },
  { name: 'Apollo', cost: '1 crédito por persona', found: 2, at: 9 },
  { name: 'Lusha', cost: 'Solo si falta el teléfono', found: 0, at: 11 },
]

const PEOPLE = [
  { name: 'Mariana Rojas', role: 'Directora de Talento', from: 'HubSpot', tags: ['Decisora', 'En HubSpot'] },
  { name: 'Jorge Peña', role: 'Gerente de Recursos Humanos', from: 'HubSpot', tags: ['Decisor', 'En HubSpot'] },
  { name: 'Lucía Torres', role: 'Líder de Formación', from: 'Apollo', tags: ['Decisora'] },
  { name: 'Andrés Lima', role: 'Coordinador de Nómina', from: 'Apollo', tags: ['Influenciador'] },
]

function Kpi({ Icon, label, value }: { Icon: typeof Phone; label: string; value: number }) {
  return (
    <div className="flex-1 px-4 py-3">
      <p className="flex items-center gap-2 text-[12.5px] text-white/70"><Icon className="h-3.5 w-3.5" />{label}</p>
      <p className="mt-1 pl-[22px] text-[17px] font-medium tabular-nums">{value}</p>
    </div>
  )
}

function Screen({ time }: { time: number }) {
  const running = time >= 4 && time < 12
  const people = Math.max(0, Math.min(PEOPLE.length, time - 12))
  const revealed = time >= 17
  const settled = time >= 19
  const used = Math.min(3, Math.max(0, time >= 9 ? 2 : 0) + (revealed ? 1 : 0))
  return (
    <div className="space-y-2.5 px-6 pt-5">
      <RecordHeader stage={1} tags={people > 0 ? <RealTag tone="green">{Math.min(people, 3)} decisores</RealTag> : <RealTag tone="amber">Sin contactos</RealTag>} />
      <RecordStepper stage={1} />
      <RecordSection n={1} title="Prospección" agent="Agente 1" state={<RealTag tone="green">Completada</RealTag>} body="La empresa entra como prospecto (IA, importación o a mano), con encaje ICP y sin duplicar HubSpot." />
      <RecordSection n={2} title="Enriquecimiento de contactos" agent="Agente 2A" state={<RealTag tone="blue">Etapa actual</RealTag>} body="Se identifican decisores y medios de contacto autorizados.">
        <div className="mt-3 flex divide-x divide-white/10 rounded-xl border border-white/10">
          <Kpi Icon={Users} label="Contactos" value={people} />
          <Kpi Icon={User} label="Decisores" value={Math.min(people, 3)} />
          <Kpi Icon={Phone} label="Con teléfono" value={people >= 2 ? 1 + (revealed ? 1 : 0) : 0} />
          <Kpi Icon={Globe} label="En HubSpot" value={Math.min(people, 2)} />
        </div>

        <div className={`overflow-hidden transition-all duration-700 ${time >= 4 ? 'mt-3 max-h-[120px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="flex items-center gap-3 rounded-xl border border-[#6b8cff]/30 bg-[#6b8cff]/[0.07] px-3 py-2 text-[12.5px]">
            <Lock className="h-4 w-4 text-[#9db0ff]" />
            <span><span className="font-medium">8 créditos reservados</span> antes de llamar a nadie</span>
            <span className="ml-auto flex gap-1">{Array.from({ length: 8 }, (_, i) => <span key={i} className={`h-2 w-5 rounded-sm ${i < used ? 'bg-[#6b8cff]' : settled && i >= used ? 'bg-emerald-400/60' : 'bg-white/15'}`} />)}</span>
            <span className="w-[150px] text-right text-white/60">{settled ? `${used} usados · ${8 - used} devueltos` : `${used} usados`}</span>
          </div>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {SOURCES.map((s) => {
              const on = time >= s.at && time < s.at + 2 && running
              const done = time >= s.at + 1
              return (
                <div key={s.name} className="rounded-xl border px-3 py-2 transition-all duration-500" style={on ? HIGHLIGHT : { borderColor: 'rgba(255,255,255,0.1)' }}>
                  <p className="flex items-center gap-1.5 text-[12.5px] font-medium">{on ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : done ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <span className="h-3.5 w-3.5 rounded-full border border-white/20" />}{s.name}</p>
                  <p className="mt-0.5 text-[11.5px] text-white/50">{s.cost}{done ? ` · ${s.found === 0 ? (s.at === 11 ? 'no hizo falta' : 'sin nuevos') : `${s.found} encontrados`}` : ''}</p>
                </div>
              )
            })}
          </div>
        </div>

        <ul className="mt-3 space-y-1.5">
          {PEOPLE.map((p, i) => {
            const hero = i === 0
            const show = i < people
            return (
              <li key={p.name} className="flex items-center gap-3 rounded-xl border px-3 py-2 transition-all duration-500" style={{ ...(hero && show ? HIGHLIGHT : { borderColor: 'rgba(255,255,255,0.08)' }), opacity: show ? 1 : 0, transform: show ? 'none' : 'translateY(8px)', display: time >= 12 ? 'flex' : 'none' }}>
                <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[#6b8cff] to-[#7e2be0] text-[12px] font-medium">{p.name[0]}</span>
                <span className="w-[230px]"><span className="block text-[13.5px] font-medium">{p.name}</span><span className="text-[12px] text-white/50">{p.role}</span></span>
                <span className="flex gap-1.5">{p.tags.map((tg) => <RealTag key={tg} tone={tg === 'En HubSpot' ? 'gray' : 'green'}>{tg}</RealTag>)}</span>
                <span className="text-[11.5px] text-white/40">vía {p.from}</span>
                <span className="ml-auto text-[12.5px]">
                  {hero ? (revealed ? <span className="font-mono text-emerald-300">+52 55 •••• 3418</span> : <span className="flex items-center gap-1.5 rounded-lg border border-white/15 px-2.5 py-1"><Phone className="h-3.5 w-3.5" />Revelar teléfono · 1 crédito</span>) : <span className="text-white/40">Correo verificado</span>}
                </span>
              </li>
            )
          })}
        </ul>
        <p className="mt-2.5 flex items-center text-[12.5px] text-white/60">
          <span className="font-medium text-white/85">Última búsqueda:</span>&nbsp;{settled ? 'Listo para revisión · 4 contactos · 3 créditos' : time >= 4 ? 'Buscando…' : 'Listo para revisión · Lusha · 11 de nov de 2026 · 0 aprobados'}
          <span className="ml-auto inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[12.5px] text-white transition-all duration-300" style={time >= 2 && time < 4 ? HIGHLIGHT : { borderColor: 'rgba(255,255,255,0.15)' }}>
            {running ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RumboOrb size={14} />} Buscar más contactos con IA
          </span>
        </p>
      </RecordSection>
    </div>
  )
}

export function ContactEnrichment() {
  const [ref, time] = useStoryTime(LOOP, 20)
  const now = stepAt(STEPS, time)
  return (
    <div ref={ref}>
      <StorySteps steps={STEPS} time={time} kicker={{ es: 'Agente 2', en: 'Agent 2' }} />
      <RealFrame
        active="flujo"
        crumb={['Flujo de prospección', 'Clínica Andina']}
        height={1000}
        overlay={
          <>
            <RealDock busy={now === 1} label={now === 1 ? 'Buscando contactos con Rumbo IA' : 'Buscar contactos con Rumbo IA'} done={time >= 19}>
              <span className="grid h-9 w-9 place-items-center"><RumboOrb size={18} /></span>
              <span className="flex items-center gap-2 whitespace-nowrap rounded-xl bg-[#6b8cff] px-4 py-2 text-[13.5px] font-medium text-[#0a0a0a]"><GitBranch className="h-4 w-4" />Cambiar etapa</span>
            </RealDock>
            <FakeCursor x={time < 2 ? 900 : 1075} y={time < 2 ? 760 : 590} click={time === 3} show={time < 5} />
          </>
        }
      >
        <Screen time={time} />
      </RealFrame>
      <ReplicaNote />
    </div>
  )
}

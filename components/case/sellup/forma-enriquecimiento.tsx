'use client'

import { Check, Minus } from 'lucide-react'
import { useLocale } from '@/lib/i18n'
import { RealFrame } from './real-app'
import { Composer, OptionsCard, RumboPanel, RumboSays, UserSays } from './real-rumbo-panel'
import { ContactReview } from './real-review-tables'
import { ContactDetail, type PhoneState } from './real-detail'
import { AgentStructure, type StructureItem } from './forma-structure'
import { FakeCursor, ReplicaNote, StorySteps, useStoryTime, type StoryStep } from './real-story'

/**
 * 5.3 · Agente 2: el panel de Rumbo «Enriquecer contactos», el resultado en
 * «Por revisar» con la decisora nueva destacada y su detalle con «Revelar teléfono».
 */

const STEPS: readonly StoryStep[] = [
  { label: { es: 'Le das la empresa a Rumbo', en: 'You give Rumbo the company' }, from: 0 },
  { label: { es: 'Llega a «Por revisar», destacada', en: 'Lands in “To review”, highlighted' }, from: 13 },
  { label: { es: 'Su detalle y su teléfono', en: 'Its detail and phone' }, from: 17 },
]
const LOOP = 33
const COMPANY = 'Clínica Andina'

const STRUCTURE: readonly StructureItem[] = [
  { title: { es: 'Una empresa', en: 'One company' }, body: { es: 'Por nombre, dominio o HubSpot ID. También sirve el correo de alguien que trabaje allí.', en: 'By name, domain or HubSpot ID. Someone’s work email works too.' }, note: { es: 'HubSpot → lo ya conocido → Apollo → Lusha', en: 'HubSpot → already known → Apollo → Lusha' } },
  { title: { es: 'Varias empresas por HubSpot ID', en: 'Several companies by HubSpot ID' }, body: { es: 'Hasta 10 HubSpot IDs de empresa, separados por coma o uno por fila.', en: 'Up to 10 company HubSpot IDs, comma-separated or one per line.' }, note: { es: 'Corre en segundo plano', en: 'Runs in the background' } },
  { title: { es: 'Un contacto por LinkedIn, correo o ID', en: 'One contact by LinkedIn, email or ID' }, body: { es: 'Su perfil de LinkedIn, su correo o su ID de contacto en HubSpot. Antes de gastar créditos revisa si ya lo tenemos.', en: 'Their LinkedIn profile, email or HubSpot contact ID. Before spending credits it checks whether we already have them.' }, note: { es: 'Teléfono: Apollo y, si no hay, Lusha', en: 'Phone: Apollo and, if none, Lusha' } },
]

const CASCADE = [
  { at: 8, name: 'HubSpot', result: '2 contactos · gratis', used: true },
  { at: 9, name: 'Lo que SellUp ya conocía', result: '1 contacto · gratis', used: true },
  { at: 10, name: 'Apollo', result: '3 decisores · 3 créditos', used: true },
  { at: 11, name: 'Lusha', result: 'No hizo falta', used: false },
]

function Conversation({ time }: { time: number }) {
  const typed = time < 2 ? 0 : Math.min(COMPANY.length, (time - 1) * 4)
  const sent = time >= 6
  return (
    <RumboPanel
      subtitle="Enriquecer contactos"
      footer={
        <>
          {!sent && (
            <div className="mb-3">
              <OptionsCard
                title="¿Prefieres otra forma de buscar?"
                options={[
                  { title: 'Varias empresas por HubSpot ID', body: 'Hasta 10 HubSpot IDs de empresa, separados por coma o uno por fila.' },
                  { title: 'Un contacto por LinkedIn, correo o ID de HubSpot', body: 'Su perfil de LinkedIn, su correo o su ID de contacto en HubSpot. Antes de gastar créditos reviso si ya lo tenemos.' },
                ]}
              />
            </div>
          )}
          <Composer text={sent ? '' : COMPANY.slice(0, typed)} placeholder="Nombre o dominio de la empresa" typing={!sent && time >= 2} />
        </>
      }
    >
      <RumboSays>
        <span className="block">Hola. Puedo ayudarte a preparar una búsqueda de contactos para una empresa.</span>
        <span className="mt-2 block">Para empezar, dime el nombre, dominio o HubSpot ID de la empresa. También sirve el correo de alguien que trabaje allí.</span>
      </RumboSays>
      {sent && (
        <>
          <UserSays>{COMPANY}</UserSays>
          <RumboSays show={time >= 7}>Encontré Clínica Andina · clinicaandina.mx · 1.240 empleados. Reservo 8 créditos y busco primero en lo gratis.</RumboSays>
          <div className="ml-8 space-y-1.5">
            {CASCADE.map((c) => (
              <p key={c.name} className={`flex items-center gap-2 rounded-lg border border-white/10 px-2.5 py-1.5 text-[12.5px] transition-all duration-500 ${time >= c.at ? 'opacity-100' : 'opacity-0'}`}>
                {c.used ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Minus className="h-3.5 w-3.5 text-white/40" />}
                <span className="font-medium">{c.name}</span>
                <span className={`ml-auto ${c.used ? 'text-white/70' : 'text-white/40'}`}>{c.result}</span>
              </p>
            ))}
          </div>
          <RumboSays show={time >= 12}>Listo: 4 contactos a «Por revisar». Devolví los 5 créditos que no usé.</RumboSays>
        </>
      )}
    </RumboPanel>
  )
}

function phoneAt(time: number): PhoneState {
  if (time < 22) return 'idle'
  if (time < 24) return 'apollo'
  if (time < 26) return 'lusha'
  return 'done'
}

export function ContactEnrichment() {
  const { t } = useLocale()
  const [ref, time] = useStoryTime(LOOP, 28)
  const panel = time < 13
  const detail = time >= 18 && time < LOOP - 1
  const onRow = time >= 15 && time < 18
  const onPhone = time >= 20 && time < 23
  const cursor = onRow ? { x: 370, y: 248 } : onPhone ? { x: 520, y: 418 } : { x: 1000, y: 640 }
  return (
    <div ref={ref}>
      <StorySteps steps={STEPS} time={time} kicker={{ es: 'Agente 2', en: 'Agent 2' }} />
      <RealFrame
        active="contactos"
        crumb={['Contactos', 'Por revisar']}
        height={720}
        overlay={<FakeCursor x={cursor.x} y={cursor.y} click={time === 17 || time === 21} show={onRow || onPhone} />}
      >
        <ContactReview arrived={time >= 14} focus={time >= 14} />
        <div className={`absolute inset-0 transition-opacity duration-500 ${panel ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
          <div className="absolute inset-0 bg-black/40" />
          <Conversation time={time} />
        </div>
        <ContactDetail show={detail} phone={phoneAt(time)} pressed={time === 21} />
      </RealFrame>
      <ReplicaNote />
      <AgentStructure heading={{ es: 'Su estructura · tres formas de buscar contactos', en: 'Its structure · three ways to find contacts' }} items={STRUCTURE} active={panel ? 0 : undefined} />
      <p className="mt-3 text-sm text-white/50">{t({ es: 'Nada se aprueba solo: cada contacto llega a «Por revisar» con su relevancia, su fuente y lo que costó.', en: 'Nothing approves itself: every contact lands in “To review” with its relevance, source and cost.' })}</p>
    </div>
  )
}

'use client'

import type { ReactNode } from 'react'
import { useLocale } from '@/lib/i18n'
import { RealFrame } from './real-app'
import { Composer, OptionsCard, RumboPanel, RumboSays, UserSays } from './real-rumbo-panel'
import { ContactReview } from './real-review-tables'
import { ContactDetail } from './real-detail'
import { AgentStructure, type StructureItem } from './forma-structure'
import { FakeCursor, ReplicaNote, StorySteps, stepAt, type StoryStep } from './real-story'
import { DetailScene, PanelScene, SceneStage, Scaled, useSceneTime } from './forma-stage'
import { PeopleRadar, RADAR_H, RADAR_W } from './forma-a2-radar'
import { PhoneDecoder, type A2Phone } from './forma-a2-phone'

/**
 * 5.3 · Agente 2: el panel de Rumbo «Enriquecer contactos», el resultado en
 * «Por revisar» con la decisora nueva destacada y su detalle con «Revelar teléfono».
 */

const STEPS: readonly StoryStep[] = [
  { label: { es: 'Le das la empresa a Rumbo', en: 'You give Rumbo the company' }, from: 0 },
  { label: { es: 'El radar barre las fuentes', en: 'The radar sweeps the sources' }, from: 8 },
  { label: { es: 'Las decisoras llegan a «Por revisar»', en: 'Decision-makers land in “To review”' }, from: 21 },
  { label: { es: 'Su detalle: se descifra el teléfono', en: 'Their detail: the phone gets decoded' }, from: 26 },
]
const LOOP = 38
const COMPANY = 'Clínica Andina'

const STRUCTURE: readonly StructureItem[] = [
  { title: { es: 'Una empresa', en: 'One company' }, body: { es: 'Por nombre, dominio o HubSpot ID. También sirve el correo de alguien que trabaje allí.', en: 'By name, domain or HubSpot ID. Someone’s work email works too.' }, note: { es: 'HubSpot → lo ya conocido → Apollo → Lusha', en: 'HubSpot → already known → Apollo → Lusha' } },
  { title: { es: 'Varias empresas por HubSpot ID', en: 'Several companies by HubSpot ID' }, body: { es: 'Hasta 10 HubSpot IDs de empresa, separados por coma o uno por fila.', en: 'Up to 10 company HubSpot IDs, comma-separated or one per line.' }, note: { es: 'Corre en segundo plano', en: 'Runs in the background' } },
  { title: { es: 'Un contacto por LinkedIn, correo o ID', en: 'One contact by LinkedIn, email or ID' }, body: { es: 'Su perfil de LinkedIn, su correo o su ID de contacto en HubSpot. Antes de gastar créditos revisa si ya lo tenemos.', en: 'Their LinkedIn profile, email or HubSpot contact ID. Before spending credits it checks whether we already have them.' }, note: { es: 'Teléfono: Apollo y, si no hay, Lusha', en: 'Phone: Apollo and, if none, Lusha' } },
]

function Conversation({ time }: { time: number }) {
  const typed = time < 1 ? 0 : Math.min(COMPANY.length, time * 4)
  const sent = time >= 5
  return (
    <RumboPanel
      inline
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
          <Composer text={sent ? '' : COMPANY.slice(0, typed)} placeholder="Nombre o dominio de la empresa" typing={!sent && time >= 1} />
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
          <RumboSays show={time >= 6}>Encontré Clínica Andina · clinicaandina.mx · 1.240 empleados. Reservo 8 créditos y busco primero en lo gratis.</RumboSays>
          <RumboSays show={time >= 7}>Barro HubSpot, lo ya conocido, Apollo y Lusha, en ese orden…</RumboSays>
        </>
      )}
    </RumboPanel>
  )
}

function phoneAt(time: number): A2Phone {
  if (time < 28) return 'idle'
  if (time < 30) return 'apollo'
  if (time < 32) return 'lusha'
  return 'done'
}

/** Entrada con velocidad: la escena llega desde un zoom con desenfoque. */
function Warp({ on, children }: { on: boolean; children: ReactNode }) {
  return (
    <div className="motion-reduce:!transform-none motion-reduce:!filter-none" style={{ transform: on ? 'none' : 'scale(1.08)', filter: on ? 'none' : 'blur(10px)', transition: 'transform 380ms cubic-bezier(0.16,1,0.3,1), filter 320ms ease-out' }}>
      {children}
    </div>
  )
}

export function ContactEnrichment() {
  const { t } = useLocale()
  const [ref, time, jump] = useSceneTime(LOOP, 33)
  const scene = stepAt(STEPS, time)
  const onRow = time >= 23 && time < 26
  const onPhone = time >= 26 && time < 29
  return (
    <div ref={ref}>
      <StorySteps steps={STEPS} time={time} kicker={{ es: 'Agente 2', en: 'Agent 2' }} onPick={jump} />
      <SceneStage
        active={scene}
        scenes={[
          <PanelScene key="panel" height={700}><Conversation time={Math.min(time, 8)} /></PanelScene>,
          <Warp key="radar" on={scene === 1}>
            <Scaled width={RADAR_W} height={RADAR_H}><PeopleRadar t={scene === 1 ? time - 8 : scene > 1 ? 13 : 0} /></Scaled>
          </Warp>,
          <Warp key="table" on={scene === 2}>
            <RealFrame active="contactos" crumb={['Contactos', 'Por revisar']} height={600} overlay={<FakeCursor x={onRow ? 370 : 900} y={onRow ? 248 : 560} click={time === 25} show={onRow} />}>
              <ContactReview arrived={time >= 22} focus={time >= 22} />
            </RealFrame>
          </Warp>,
          <Warp key="detail" on={scene === 3}>
            <DetailScene>
              <div className="relative h-full">
                <ContactDetail show inline phone="idle" />
                <div className="absolute z-20" style={{ left: A2_BTN.x, top: A2_BTN.y }}>
                  <PhoneDecoder state={phoneAt(time)} pressed={time === 28} />
                </div>
                <FakeCursor x={onPhone ? A2_BTN.x + 60 : 600} y={onPhone ? A2_BTN.y + 18 : 520} click={time === 28} show={onPhone} />
              </div>
            </DetailScene>
          </Warp>,
        ]}
      />
      <ReplicaNote />
      <AgentStructure heading={{ es: 'Su estructura · tres formas de buscar contactos', en: 'Its structure · three ways to find contacts' }} items={STRUCTURE} active={scene === 0 ? 0 : undefined} />
      <p className="mt-3 text-sm text-white/50">{t({ es: 'Nada se aprueba solo: cada contacto llega a «Por revisar» con su relevancia, su fuente y lo que costó.', en: 'Nothing approves itself: every contact lands in “To review” with its relevance, source and cost.' })}</p>
    </div>
  )
}

/** Dónde queda el botón «Revelar teléfono» dentro del detalle (px de diseño, 960 × 600). */
const A2_BTN = { x: 39, y: 362 }

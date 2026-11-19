'use client'

import type { ReactNode } from 'react'
import { useLocale } from '@/lib/i18n'
import { RealFrame } from './real-app'
import { ContactReview } from './real-review-tables'
import { ContactDetail } from './real-detail'
import { AgentStructure, type StructureItem } from './forma-structure'
import { FakeCursor, ReplicaNote, StorySteps, stepAt, type StoryStep } from './real-story'
import { DetailScene, SceneStage, Scaled, useSceneTime } from './forma-stage'
import { PeopleRadar, RADAR_H, RADAR_W } from './forma-a2-radar'
import { PhoneDecoder, type A2Phone } from './forma-a2-phone'

/**
 * 5.3 · Agente 2: arranca cuando Rumbo ya busca (radar de decisores), el resultado en
 * «Por revisar» con la decisora nueva destacada y su detalle con «Revelar teléfono».
 */

const STEPS: readonly StoryStep[] = [
  { label: { es: 'El radar barre las fuentes', en: 'The radar sweeps the sources' }, from: 0 },
  { label: { es: 'Las decisoras llegan a «Por revisar»', en: 'Decision-makers land in “To review”' }, from: 13 },
  { label: { es: 'Su detalle: se descifra el teléfono', en: 'Their detail: the phone gets decoded' }, from: 18 },
]
const LOOP = 30

const STRUCTURE: readonly StructureItem[] = [
  { title: { es: 'Una empresa', en: 'One company' }, body: { es: 'Por nombre, dominio o HubSpot ID. También sirve el correo de alguien que trabaje allí.', en: 'By name, domain or HubSpot ID. Someone’s work email works too.' }, note: { es: 'HubSpot → lo ya conocido → Apollo → Lusha', en: 'HubSpot → already known → Apollo → Lusha' } },
  { title: { es: 'Varias empresas por HubSpot ID', en: 'Several companies by HubSpot ID' }, body: { es: 'Hasta 10 HubSpot IDs de empresa, separados por coma o uno por fila.', en: 'Up to 10 company HubSpot IDs, comma-separated or one per line.' }, note: { es: 'Corre en segundo plano', en: 'Runs in the background' } },
  { title: { es: 'Un contacto por LinkedIn, correo o ID', en: 'One contact by LinkedIn, email or ID' }, body: { es: 'Su perfil de LinkedIn, su correo o su ID de contacto en HubSpot. Antes de gastar créditos revisa si ya lo tenemos.', en: 'Their LinkedIn profile, email or HubSpot contact ID. Before spending credits it checks whether we already have them.' }, note: { es: 'Teléfono: Apollo y, si no hay, Lusha', en: 'Phone: Apollo and, if none, Lusha' } },
]

function phoneAt(time: number): A2Phone {
  if (time < 20) return 'idle'
  if (time < 22) return 'apollo'
  if (time < 24) return 'lusha'
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
  const [ref, time, jump] = useSceneTime(LOOP, 25)
  const scene = stepAt(STEPS, time)
  const onRow = time >= 15 && time < 18
  const onPhone = time >= 18 && time < 21
  return (
    <div ref={ref}>
      <StorySteps steps={STEPS} time={time} kicker={{ es: 'Agente 2', en: 'Agent 2' }} onPick={jump} />
      <SceneStage
        active={scene}
        scenes={[
          <Warp key="radar" on={scene === 0}>
            <Scaled width={RADAR_W} height={RADAR_H}><PeopleRadar t={scene === 0 ? time : 13} /></Scaled>
          </Warp>,
          <Warp key="table" on={scene === 1}>
            <RealFrame active="contactos" crumb={['Contactos', 'Por revisar']} height={600} overlay={<FakeCursor x={onRow ? 370 : 900} y={onRow ? 248 : 560} click={time === 17} show={onRow} />}>
              <ContactReview arrived={time >= 14} focus={time >= 14} />
            </RealFrame>
          </Warp>,
          <Warp key="detail" on={scene === 2}>
            <DetailScene>
              <div className="relative h-full">
                <ContactDetail show inline phone="idle" />
                <div className="absolute z-20" style={{ left: A2_BTN.x, top: A2_BTN.y }}>
                  <PhoneDecoder state={phoneAt(time)} pressed={time === 20} />
                </div>
                <FakeCursor x={onPhone ? A2_BTN.x + 60 : 600} y={onPhone ? A2_BTN.y + 18 : 520} click={time === 20} show={onPhone} />
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

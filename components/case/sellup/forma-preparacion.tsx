'use client'

import { ContactDetail } from './real-detail'
import { FakeCursor, ReplicaNote, StorySteps, stepAt, type StoryStep } from './real-story'
import { DetailScene, SceneStage, useSceneTime } from './forma-stage'
import { MAGNET_H, MAGNET_W, MagnetScene } from './forma-a3-magnet'
import { FAN_H, FAN_W, FanScene } from './forma-a3-fan'

/**
 * 5.4 · Agente 3, en tres escenas con su propio lenguaje visual:
 * el detalle del contacto («Preparar primer contacto»), Rumbo como imán que atrae
 * fragmentos de fuentes y los vuelve hechos citados, y el mensaje que se arma y
 * se abre en abanico hacia correo, LinkedIn, llamada y WhatsApp.
 */

const STEPS: readonly StoryStep[] = [
  { label: { es: 'Desde el contacto: «Preparar primer contacto»', en: 'From the contact: “Prepare first contact”' }, from: 0 },
  { label: { es: 'Rumbo atrae las fuentes y cita cada dato', en: 'Rumbo pulls in sources and cites every fact' }, from: 5 },
  { label: { es: 'El mensaje se abre a cada canal', en: 'The message fans out to every channel' }, from: 19 },
]
const LOOP = 42

export function FirstContactPrep() {
  const [ref, time, jump] = useSceneTime(LOOP, 30)
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
          <DetailScene key="magnet" width={MAGNET_W} height={MAGNET_H}><MagnetScene time={time} /></DetailScene>,
          <DetailScene key="fan" width={FAN_W} height={FAN_H}><FanScene u={Math.max(0, time - 19)} /></DetailScene>,
        ]}
      />
      <ReplicaNote />
    </div>
  )
}

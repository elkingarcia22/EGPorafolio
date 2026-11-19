'use client'

import { ReplicaNote, StorySteps, stepAt, type StoryStep } from './real-story'
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
  { label: { es: 'Rumbo atrae las fuentes y cita cada dato', en: 'Rumbo pulls in sources and cites every fact' }, from: 0 },
  { label: { es: 'El mensaje se abre a cada canal', en: 'The message fans out to every channel' }, from: 14 },
]
const LOOP = 37

export function FirstContactPrep() {
  const [ref, time, jump] = useSceneTime(LOOP, 25)
  const scene = stepAt(STEPS, time)
  return (
    <div ref={ref}>
      <StorySteps steps={STEPS} time={time} kicker={{ es: 'Agente 3', en: 'Agent 3' }} onPick={jump} />
      <SceneStage
        active={scene}
        scenes={[
          <DetailScene key="magnet" width={MAGNET_W} height={MAGNET_H}><MagnetScene time={time + 5} /></DetailScene>,
          <DetailScene key="fan" width={FAN_W} height={FAN_H}><FanScene u={Math.max(0, time - 14)} /></DetailScene>,
        ]}
      />
      <ReplicaNote />
    </div>
  )
}

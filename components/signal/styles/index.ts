import type { NetworkStyleId } from '../network-style-store'
import type { NetworkStyle } from './types'
import { createClassicStyle } from './classic'
import { createNeuronStyle } from './neuron'
import { createSynapseStyle } from './synapse'
import { createPlexusStyle } from './plexus'

export type { Frame, FrameLink, FrameNode, FramePulse, NetworkStyle } from './types'
export { hash } from './paint'

/** Un juego de estilos por lienzo: cada uno guarda sus propias capas y partículas. */
export function createNetworkStyles(): Record<NetworkStyleId, NetworkStyle> {
  return {
    classic: createClassicStyle(),
    neuron: createNeuronStyle(),
    synapse: createSynapseStyle(),
    plexus: createPlexusStyle(),
  }
}

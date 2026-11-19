'use client'

import { useA11y } from '@/lib/a11y'
import { ClipperOrb, type ClipperOrbState } from '../clipper-orb'
import { useTick } from '../thema/live-pieces'

/** El orbe pasa por sus estados: escucha, piensa y queda en reposo. */
const STATES: readonly ClipperOrbState[] = ['idle', 'listening', 'thinking', 'idle']
const STEP_MS = 1600

/** Portada de Clipper en el hub: el orbe al centro con sus órbitas girando. */
export function ClipperHubCard() {
  const { reducedMotion } = useA11y()
  const tick = useTick(STEP_MS)
  const state = reducedMotion ? 'idle' : STATES[tick % STATES.length]

  return (
    <div className="relative h-full overflow-hidden bg-[radial-gradient(circle_at_50%_50%,rgba(222,140,58,0.22),rgba(46,156,176,0.12)_40%,transparent_70%)]">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 scale-[0.7] sm:scale-100">
        {[1, 0.72].map((s, i) => (
          <span key={s} className="absolute left-1/2 top-1/2 aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.09]" style={{ width: `${s * 240}px` }} aria-hidden="true">
            <span className="absolute inset-0 rounded-full" style={{ animation: `orbit ${16 + i * 7}s linear infinite${i ? ' reverse' : ''}` }}>
              <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full" style={{ background: ['#de8c3a', '#2e9cb0'][i] }} />
            </span>
          </span>
        ))}
        <ClipperOrb size={110} state={state} />
      </div>
    </div>
  )
}

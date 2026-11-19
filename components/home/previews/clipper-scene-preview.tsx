'use client'

import { useA11y } from '@/lib/a11y'
import { ClipperOrb, type ClipperOrbState } from '@/components/case/barberlytics/clipper-orb'
import { useTick } from '@/components/case/barberlytics/thema/live-pieces'

const ORB_STATES: readonly ClipperOrbState[] = ['listening', 'thinking', 'idle']
const STEP_MS = 1800
const LOGO_RATIO = '452.7 / 102'

/**
 * Vista previa de Barberlytics: el orbe de Clipper solo, al centro, con sus órbitas; abajo el logo
 * de Barberlytics se dibuja de izquierda a derecha y un brillo lo recorre una y otra vez.
 */
export function ClipperScenePreview() {
  const { reducedMotion } = useA11y()
  const tick = useTick(STEP_MS)
  const state = reducedMotion ? 'idle' : ORB_STATES[tick % ORB_STATES.length]

  return (
    <div className="relative flex aspect-[4/3] flex-col items-center justify-center gap-[15%] overflow-hidden bg-[radial-gradient(circle_at_50%_42%,rgba(222,140,58,0.24),rgba(46,156,176,0.12)_40%,transparent_70%)] bg-[#0f0d0b]">
      <div className="relative">
        {[1, 0.72].map((s, i) => (
          <span key={s} className="absolute left-1/2 top-1/2 aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.09]" style={{ width: `${s * 200}px` }} aria-hidden="true">
            <span className="absolute inset-0 rounded-full" style={{ animation: reducedMotion ? 'none' : `orbit ${16 + i * 7}s linear infinite${i ? ' reverse' : ''}` }}>
              <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full" style={{ background: ['#de8c3a', '#2e9cb0'][i] }} />
            </span>
          </span>
        ))}
        <ClipperOrb size={100} state={state} />
      </div>

      <div className="relative w-[46%]" style={{ aspectRatio: LOGO_RATIO }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/cases/barberlytics/logo-official-paper.svg"
          alt="Barberlytics"
          className="absolute inset-0 h-full w-full"
          style={{ animation: reducedMotion ? 'none' : 'logo-draw 1.4s cubic-bezier(0.16,1,0.3,1) 0.3s both' }}
        />
        {!reducedMotion && (
          <span
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
            style={{
              WebkitMaskImage: 'url(/cases/barberlytics/logo-official-paper.svg)',
              maskImage: 'url(/cases/barberlytics/logo-official-paper.svg)',
              WebkitMaskSize: '100% 100%',
              maskSize: '100% 100%',
              background: 'linear-gradient(100deg, transparent 35%, rgba(255,255,255,0.9) 50%, transparent 65%)',
              backgroundSize: '250% 100%',
              animation: 'logo-shine 3.2s ease-in-out 1.6s infinite',
            }}
          />
        )}
      </div>
    </div>
  )
}

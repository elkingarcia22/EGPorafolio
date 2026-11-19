'use client'

import { useId } from 'react'
import { useLocale } from '@/lib/i18n'
import { Arrows, Board, Hand, Pin, Sticky } from '@/components/case/kit/sketch'
import { ClipperOrb } from '../clipper-orb'

const INK = '#2a2d33'
const STOPS = ['#f0ce86', '#de8c3a', '#2e9cb0', '#3f72d8'] as const
const STEP_X = [70, 400, 730, 1060]
const STEP_Y = 150
const SIZE = 240

/** Franjas del poste a 45°: 12 de grosor cada 24, en un lienzo de 100×100 (como el orbe real). */
function stripes(color: string) {
  return Array.from({ length: 10 }, (_, i) => {
    const b = -96 + i * 24
    return <path key={i} d={`M-2,${b + 52}L102,${b - 52}L102,${b - 40}L-2,${b + 64}Z`} fill={color} />
  })
}

/** Lienzo de un paso: un SVG cuadrado con trazo de lápiz. */
function Canvas({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="-10 -10 120 120" className="block h-auto w-full overflow-visible" aria-hidden="true">
      {children}
    </svg>
  )
}

/** 1 · El poste de barbería, de pie. */
function Pole() {
  const id = useId()
  return (
    <Canvas>
      <defs>
        <clipPath id={id}><rect x="32" y="8" width="36" height="84" rx="4" /></clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        <rect x="32" y="8" width="36" height="84" fill="#fff" />
        {stripes('#e5484d')}
      </g>
      <rect x="32" y="8" width="36" height="84" rx="4" fill="none" stroke={INK} strokeWidth="1.6" />
      <rect x="28" y="2" width="44" height="8" rx="3" fill="#fff" stroke={INK} strokeWidth="1.6" />
      <rect x="28" y="90" width="44" height="8" rx="3" fill="#fff" stroke={INK} strokeWidth="1.6" />
    </Canvas>
  )
}

/** 2 · Recortado en círculo, con sus medidas. */
function Cut() {
  const id = useId()
  return (
    <Canvas>
      <defs>
        <clipPath id={id}><circle cx="50" cy="50" r="46" /></clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>{stripes('rgba(42,45,51,0.75)')}</g>
      <circle cx="50" cy="50" r="46" fill="none" stroke={INK} strokeWidth="1.6" strokeDasharray="3 2" />
      {/* 45° */}
      <path d="M8,92 L30,92" stroke="#e8743b" strokeWidth="1" />
      <path d="M22,92 A14,14 0 0 0 18,82" fill="none" stroke="#e8743b" strokeWidth="1" />
      <text x="24" y="86" fontSize="6" fill="#e8743b" fontFamily="var(--font-hand)">45°</text>
      {/* grosor y periodo */}
      <path d="M104,28 L104,40 M101,28 L107,28 M101,40 L107,40" stroke="#e8743b" strokeWidth="1" />
      <text x="108" y="36" fontSize="6" fill="#e8743b" fontFamily="var(--font-hand)">12</text>
      <path d="M104,52 L104,76 M101,52 L107,52 M101,76 L107,76" stroke="#e8743b" strokeWidth="1" />
      <text x="108" y="66" fontSize="6" fill="#e8743b" fontFamily="var(--font-hand)">24</text>
    </Canvas>
  )
}

/** 3 · El gradiente de IA debajo de las franjas. */
function Gradient() {
  const id = useId()
  return (
    <Canvas>
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="0.6">
          {STOPS.map((c, i) => <stop key={c} offset={[0, 0.45, 0.75, 1][i]} stopColor={c} />)}
        </linearGradient>
        <clipPath id={id}><circle cx="50" cy="50" r="46" /></clipPath>
      </defs>
      <circle cx="50" cy="50" r="46" fill={`url(#${id}-g)`} />
      <g clipPath={`url(#${id})`} style={{ mixBlendMode: 'multiply' }}>{stripes('rgba(10,11,13,0.82)')}</g>
      <circle cx="50" cy="50" r="46" fill="none" stroke={INK} strokeWidth="1.6" />
      {STOPS.map((c, i) => (
        <g key={c}>
          <circle cx={10 + i * 27} cy="108" r="4" fill={c} stroke={INK} strokeWidth="1" />
        </g>
      ))}
    </Canvas>
  )
}

/** 4 · Vidrio, anillo y halo encima. */
function Glass() {
  const id = useId()
  return (
    <Canvas>
      <defs>
        <radialGradient id={`${id}-shine`} cx="0.3" cy="0.24" r="0.34">
          <stop offset="0" stopColor="#fff" stopOpacity="0.85" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.15" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-edge`} cx="0.42" cy="0.38" r="0.62">
          <stop offset="0.6" stopColor={INK} stopOpacity="0" />
          <stop offset="1" stopColor={INK} stopOpacity="0.55" />
        </radialGradient>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="0.6">
          {STOPS.map((c, i) => <stop key={c} offset={[0, 0.45, 0.75, 1][i]} stopColor={c} />)}
        </linearGradient>
        <clipPath id={id}><circle cx="50" cy="50" r="40" /></clipPath>
      </defs>
      <circle cx="50" cy="50" r="58" fill="none" stroke="#de8c3a" strokeOpacity="0.5" strokeWidth="1" strokeDasharray="2 3" />
      <path d="M50,6 A44,44 0 0 1 92,62" fill="none" stroke="#2e9cb0" strokeWidth="2" />
      <circle cx="50" cy="50" r="40" fill={`url(#${id}-g)`} />
      <g clipPath={`url(#${id})`} style={{ mixBlendMode: 'multiply' }}>{stripes('rgba(10,11,13,0.82)')}</g>
      <circle cx="50" cy="50" r="40" fill={`url(#${id}-edge)`} />
      <circle cx="50" cy="50" r="40" fill={`url(#${id}-shine)`} />
      <circle cx="50" cy="50" r="40" fill="none" stroke={INK} strokeWidth="1.6" />
    </Canvas>
  )
}

const STEPS = [Pole, Cut, Gradient, Glass]

/** Tablero · Del poste a la esfera: la construcción del orbe paso a paso, con sus medidas reales. */
export function OrbConstructionBoard() {
  const { t } = useLocale()
  const labels = [
    t({ es: '1 · el poste de barbería', en: '1 · the barber pole' }),
    t({ es: '2 · lo recorto en círculo', en: '2 · cut into a circle' }),
    t({ es: '3 · el gradiente de IA', en: '3 · the AI gradient' }),
    t({ es: '4 · vidrio, anillo y halo', en: '4 · glass, ring and halo' }),
  ]
  return (
    <Board title={t({ es: 'Clipper · construcción del orbe', en: 'Clipper · building the orb' })} w={1400} h={780} label={t({ es: 'Bocetos de cómo el poste de barbería se vuelve el orbe de Clipper, con medidas', en: 'Sketches of how the barber pole becomes Clipper’s orb, with measures' })}>
      <Pin x={60} y={30}>
        <Hand size={2.4} className="font-bold">{t({ es: 'Del poste de barbería a la esfera', en: 'From barber pole to sphere' })}</Hand>
      </Pin>
      {STEPS.map((Step, i) => (
        <div key={i}>
          <Pin x={STEP_X[i]} y={STEP_Y - 40} w={SIZE + 40}>
            <Hand size={1.7} className="font-bold">{labels[i]}</Hand>
          </Pin>
          <Pin x={STEP_X[i]} y={STEP_Y} w={SIZE}>
            <Step />
          </Pin>
        </div>
      ))}
      <Arrows
        paths={[
          { d: `M${STEP_X[0] + SIZE - 30},${STEP_Y + 120} C${STEP_X[1] - 40},${STEP_Y + 100} ${STEP_X[1] - 30},${STEP_Y + 110} ${STEP_X[1] + 10},${STEP_Y + 120}` },
          { d: `M${STEP_X[1] + SIZE + 10},${STEP_Y + 120} C${STEP_X[2] - 30},${STEP_Y + 100} ${STEP_X[2] - 20},${STEP_Y + 110} ${STEP_X[2] + 10},${STEP_Y + 120}` },
          { d: `M${STEP_X[2] + SIZE + 10},${STEP_Y + 120} C${STEP_X[3] - 30},${STEP_Y + 100} ${STEP_X[3] - 20},${STEP_Y + 110} ${STEP_X[3]},${STEP_Y + 120}`, accent: true },
        ]}
      />
      <Pin x={STEP_X[2]} y={STEP_Y + SIZE + 20} w={260}>
        <Hand size={1.3} className="opacity-70">{t({ es: 'oro · cobre · petróleo · azul', en: 'gold · copper · teal · blue' })}</Hand>
      </Pin>

      <Pin x={70} y={540} w={330} rotate={-1.5}>
        <Sticky color="yellow">{t({ es: 'Franjas a 45°, 12 de grosor, cada 24. Al correrlas 24, el giro empalma sin salto.', en: 'Stripes at 45°, 12 thick, every 24. Shift them 24 and the spin loops seamlessly.' })}</Sticky>
      </Pin>
      <Pin x={440} y={560} w={300} rotate={1.5}>
        <Sticky color="blue">{t({ es: 'El gradiente sale del tema: cambia con cada barbería.', en: 'The gradient comes from the theme: it changes with each shop.' })}</Sticky>
      </Pin>
      <Pin x={780} y={540} w={300} rotate={-1}>
        <Sticky color="green">{t({ es: 'El único símbolo de IA: si algo lo lleva, pasa por un modelo.', en: 'The only AI symbol: if something carries it, it goes through a model.' })}</Sticky>
      </Pin>
      <Pin x={1120} y={520} w={220}>
        <div className="flex flex-col items-center gap-3 rounded-xl bg-[#0b0a09] p-5">
          <ClipperOrb size={110} />
          <Hand size={1.4} className="text-white/80">{t({ es: 'así quedó', en: 'how it ended up' })}</Hand>
        </div>
      </Pin>
    </Board>
  )
}

const STATES = [
  { state: 'idle' as const, es: 'Reposo', en: 'Idle', noteEs: 'las franjas giran lento (1,6 s)', noteEn: 'stripes spin slowly (1.6 s)' },
  { state: 'listening' as const, es: 'Escucha', en: 'Listening', noteEs: 'giran más rápido (0,9 s) y la esfera late', noteEn: 'they spin faster (0.9 s) and the sphere beats' },
  { state: 'thinking' as const, es: 'Piensa', en: 'Thinking', noteEs: 'el halo se aviva y el anillo corre (1,4 s)', noteEn: 'the halo brightens and the ring runs (1.4 s)' },
]

/** Tablero · Capas y estados: el orbe desarmado en capas y cómo se mueve en cada estado. */
export function OrbLayersBoard() {
  const { t } = useLocale()
  const layers = [
    t({ es: 'halo · cónico, desenfocado, respira', en: 'halo · conic, blurred, breathes' }),
    t({ es: 'anillo · un arco que da la vuelta', en: 'ring · an arc running around' }),
    t({ es: 'esfera · el gradiente de IA', en: 'sphere · the AI gradient' }),
    t({ es: 'franjas · el poste, en multiplicar', en: 'stripes · the pole, multiplied' }),
    t({ es: 'vidrio · brillo arriba, borde oscuro', en: 'glass · shine on top, dark edge' }),
  ]
  return (
    <Board title={t({ es: 'Clipper · capas y estados del orbe', en: 'Clipper · orb layers and states' })} w={1400} h={700} label={t({ es: 'Boceto del orbe separado en capas y de sus tres estados', en: 'Sketch of the orb split into layers and its three states' })}>
      <Pin x={60} y={30}>
        <Hand size={2.4} className="font-bold">{t({ es: 'Cinco capas, tres estados', en: 'Five layers, three states' })}</Hand>
      </Pin>
      {/* Capas desarmadas, en perspectiva */}
      {layers.map((label, i) => (
        <div key={label}>
          <Pin x={90} y={120 + i * 95} w={200}>
            <div className="h-[5.4cqw] rounded-[50%] border-[0.18cqw] [transform:perspective(700px)_rotateX(55deg)]" style={{ borderColor: INK, background: ['rgba(222,140,58,0.25)', 'rgba(46,156,176,0.2)', 'linear-gradient(100deg,#f0ce86,#de8c3a,#2e9cb0,#3f72d8)', 'repeating-linear-gradient(135deg,rgba(42,45,51,0.7) 0 8px,transparent 8px 16px)', 'radial-gradient(circle at 30% 30%,#fff,rgba(255,255,255,0.2) 40%,rgba(42,45,51,0.35))'][i] }} />
          </Pin>
          <Pin x={340} y={140 + i * 95} w={340}>
            <Hand size={1.5}>{label}</Hand>
          </Pin>
        </div>
      ))}

      {/* Estados */}
      {STATES.map((s, i) => (
        <div key={s.state}>
          <Pin x={760 + i * 210} y={150} w={180}>
            <div className="flex flex-col items-center gap-3 rounded-xl bg-[#0b0a09] py-6">
              <ClipperOrb size={88} state={s.state} />
            </div>
          </Pin>
          <Pin x={760 + i * 210} y={340} w={180}>
            <Hand size={1.8} className="block font-bold">{t({ es: s.es, en: s.en })}</Hand>
            <Hand size={1.35} className="block opacity-70">{t({ es: s.noteEs, en: s.noteEn })}</Hand>
          </Pin>
        </div>
      ))}
      <Pin x={780} y={500} w={360} rotate={-1.5}>
        <Sticky color="pink">{t({ es: 'Con «reducir movimiento» el orbe se queda quieto.', en: 'With “reduce motion” the orb stays still.' })}</Sticky>
      </Pin>
    </Board>
  )
}

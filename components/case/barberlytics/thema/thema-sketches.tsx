'use client'

import { useLocale, type L } from '@/lib/i18n'
import { Arrows, Bar, Board, Doodle, Guides, Hand, Pin, Sketchy, Sticky } from '@/components/case/kit/sketch'

/* ── Dibujos ─────────────────────────────────────────────────────────── */

const SCISSORS = [
  'M30,72 a12,12 0 1 1 -0.1,0',
  'M62,72 a12,12 0 1 1 -0.1,0',
  'M36,62 L78,12',
  'M56,62 L18,12',
]
const CHART = ['M12,12 L12,86 L90,86', 'M24,86 L24,62', 'M40,86 L40,52', 'M56,86 L56,40', 'M72,86 L72,30']
const CHART_ARROW = ['M18,60 L38,48 L52,54 L84,20', 'M70,20 L84,20 L84,34']
const LOGO_LINE = ['M4,30 L58,30 L66,46 L96,6', 'M84,6 L96,6 L96,18']

/** Las seis direcciones del logo, dibujadas. */
const DIRECTIONS: readonly { name: L; note: L; paths: readonly string[]; accent?: readonly string[] }[] = [
  { name: { es: '01 Impulso', en: '01 Impulse' }, note: { es: 'evolución del actual', en: 'evolves the current one' }, paths: ['M20,58 L40,76'], accent: ['M40,76 L80,28', 'M64,28 L80,28 L80,44'] },
  { name: { es: '02 Peine', en: '02 Comb' }, note: { es: 'dientes = barras que crecen', en: 'teeth = growing bars' }, paths: ['M14,26 L86,26', 'M26,26 L26,46', 'M42,26 L42,56', 'M58,26 L58,66'], accent: ['M74,26 L74,78'] },
  { name: { es: '03 Poste', en: '03 Pole' }, note: { es: 'barbería, premium', en: 'barbershop, premium' }, paths: ['M38,16 L62,16 L62,84 L38,84 Z', 'M34,12 L66,12', 'M34,88 L66,88'], accent: ['M38,34 L62,22', 'M38,54 L62,42', 'M38,74 L62,62'] },
  { name: { es: '04 Navaja', en: '04 Razor' }, note: { es: 'carácter', en: 'character' }, paths: ['M12,58 L58,40 L86,48 L40,66 Z', 'M58,40 L84,26'] },
  { name: { es: '05 Placa', en: '05 Plate' }, note: { es: 'ícono de app, genérica', en: 'app icon, generic' }, paths: ['M26,18 L74,18 Q82,18 82,26 L82,74 Q82,82 74,82 L26,82 Q18,82 18,74 L18,26 Q18,18 26,18 Z'], accent: ['M30,66 L48,48 L56,56 L70,38'] },
  { name: { es: '06 Sello', en: '06 Seal' }, note: { es: 'serif, editorial', en: 'serif, editorial' }, paths: ['M50,12 a38,38 0 1 1 -0.1,0', 'M50,22 a28,28 0 1 1 -0.1,0'], accent: ['M36,60 L48,48 L54,54 L66,40'] },
]

/* ── Tablero 1 · El logo ─────────────────────────────────────────────── */

export function LogoBoard() {
  const { t } = useLocale()
  const s = (es: string, en: string): string => t({ es, en } satisfies L)
  return (
    <Board title={s('Identidad · logo de Barberlytics', 'Identity · Barberlytics logo')} w={1500} h={860} label={s('Bocetos del logo: barbería más métricas', 'Logo sketches: barbershop plus metrics')}>
      <Pin x={40} y={24}>
        <Hand size={2.4} className="font-bold">{s('Barber + lytics: una barbería que crece', 'Barber + lytics: a barbershop that grows')}</Hand>
      </Pin>

      {/* La ecuación */}
      <Pin x={60} y={110} w={150}>
        <Doodle paths={SCISSORS} />
        <Hand size={1.7} className="mt-2 block text-center">{s('barbería', 'barbershop')}</Hand>
      </Pin>
      <Pin x={240} y={150}><Hand size={5}>+</Hand></Pin>
      <Pin x={320} y={110} w={160}>
        <Doodle paths={CHART} accent={CHART_ARROW} />
        <Hand size={1.7} className="mt-2 block text-center">{s('métricas', 'metrics')}</Hand>
      </Pin>
      <Pin x={512} y={150}><Hand size={5}>=</Hand></Pin>
      <Pin x={600} y={128} w={430}>
        <span className="block font-bold leading-none" style={{ fontSize: '4.6cqw', fontFamily: 'var(--font-hand)' }}>
          Barber<span className="text-[#c8862e]">lytics</span>
        </span>
        <div className="ml-[45%] w-[52%]">
          <Doodle paths={[LOGO_LINE[0]]} accent={[LOGO_LINE[1]]} viewBox="0 0 100 50" />
        </div>
      </Pin>
      <Pin x={1090} y={84} w={340} rotate={2}>
        <Sticky color="pink">{s('Hoy: sin isotipo, el oro #F0B669 da 1.8:1 sobre blanco y el gráfico pesa distinto que la letra.', 'Today: no isotype, the gold #F0B669 gives 1.8:1 on white and the mark weighs differently from the type.')}</Sticky>
      </Pin>

      {/* Las seis direcciones */}
      <Pin x={40} y={372}>
        <Hand size={1.9} className="font-bold">{s('Seis direcciones, el mismo ADN: carbón, oro y crecimiento', 'Six directions, same DNA: charcoal, gold and growth')}</Hand>
      </Pin>
      {DIRECTIONS.map((d, i) => (
        <Pin key={d.name.es} x={40 + i * 240} y={425} w={210}>
          <Sketchy className="p-[0.8cqw]">
            <div className="mx-auto w-[62%]">
              <Doodle paths={d.paths} accent={d.accent} />
            </div>
            <Hand size={1.6} className="mt-[0.4cqw] block font-bold">{t(d.name)}</Hand>
            <Hand size={1.25} className="block opacity-70">{t(d.note)}</Hand>
          </Sketchy>
        </Pin>
      ))}

      {/* El camino final */}
      <Pin x={40} y={700} w={260}>
        <Hand size={1.9} className="font-bold">{s('Lo que se queda:', 'What stays:')}</Hand>
      </Pin>
      <Pin x={300} y={690} w={210}>
        <Sketchy className="p-[0.7cqw]">
          <Hand size={1.5} className="block">{s('la flecha que sube', 'the rising arrow')}</Hand>
          <Doodle paths={['M6,40 L54,40']} accent={['M54,40 L94,8', 'M80,8 L94,8 L94,22']} viewBox="0 0 100 50" />
        </Sketchy>
      </Pin>
      <Pin x={600} y={690} w={210}>
        <Sketchy className="p-[0.7cqw]">
          <Hand size={1.5} className="block">{s('late como un pulso', 'beats like a pulse')}</Hand>
          <Doodle paths={['M4,30 L30,30 L38,14 L48,44 L56,30 L70,30']} accent={['M70,30 L94,6', 'M82,6 L94,6 L94,18']} viewBox="0 0 100 50" />
        </Sketchy>
      </Pin>
      <Pin x={900} y={680} w={150}>
        <Sketchy fill="#2a2d33" className="flex aspect-square items-center justify-center p-[1.2cqw]">
          <svg viewBox="0 0 100 100" className="w-full" aria-hidden="true">
            <path d="M14,70 L46,46 L58,58 L86,26 M70,26 L86,26 L86,42" fill="none" stroke="#e9b45d" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Sketchy>
        <Hand size={1.4} className="mt-[0.3cqw] block text-center">{s('isotipo', 'isotype')}</Hand>
      </Pin>
      <Arrows paths={[{ d: 'M512,740 L596,740' }, { d: 'M812,740 L896,740', accent: true }]} />
      <Pin x={1120} y={680} w={330} rotate={-2}>
        <Sticky color="green">{s('Cada propuesta se prueba en claro, oscuro, a 32 px y a 16 px.', 'Every option is tested light, dark, at 32 px and at 16 px.')}</Sticky>
      </Pin>
      <Arrows paths={[{ d: 'M300,640 C320,670 300,690 300,700', dashed: true }]} />
    </Board>
  )
}

/* ── Tablero 2 · Cómo se construye el sistema ────────────────────────── */

const STEP_X = [40, 285, 530, 775, 1020, 1265]
const STEP_W = 200

function Swatches({ colors }: { colors: readonly string[] }) {
  return (
    <span className="flex flex-wrap gap-[0.35cqw]">
      {colors.map((c) => (
        <span key={c} className="h-[1.2cqw] w-[1.2cqw] rounded-full border-[0.12cqw] border-[#2a2d33]" style={{ background: c }} />
      ))}
    </span>
  )
}

export function SystemBoard() {
  const { t } = useLocale()
  const s = (es: string, en: string): string => t({ es, en } satisfies L)
  const steps = [
    { title: s('4 fuentes de tokens', '4 token sources'), body: <Swatches colors={['#3b6cf0', '#5a7bd6', '#0c5bef', '#4467c9']} /> },
    { title: s('Una decisión por token', 'One decision per token'), body: <span className="flex flex-col gap-[0.35cqw]"><Bar w={90} strong /><Bar w={70} /><Bar w={80} /><Bar w={60} /></span> },
    { title: s('Un primario = un tema', 'One primary = a theme'), body: <span className="flex items-center gap-[0.5cqw]"><span className="h-[2.6cqw] w-[2.6cqw] rounded-full border-[0.15cqw] border-[#2a2d33] bg-[#d9b36a]" /><Hand size={1.6}>→</Hand><Swatches colors={['#efe3c8', '#d9b36a', '#8a6420', '#2e9cb0', '#3f72d8']} /></span> },
    { title: s('113 tokens', '113 tokens'), body: <span className="grid grid-cols-8 gap-[0.2cqw]">{Array.from({ length: 24 }, (_, i) => <span key={i} className="aspect-square border-[0.1cqw] border-[#2a2d33]/60" style={{ background: i % 7 === 0 ? '#d9b36a' : 'transparent' }} />)}</span> },
    { title: s('218 componentes', '218 components'), body: <span className="flex flex-col gap-[0.35cqw]"><Sketchy className="px-[0.4cqw] py-[0.5cqw]"><Bar w={60} strong /></Sketchy><span className="flex gap-[0.3cqw]"><Sketchy fill="#ffd2a8" className="flex-1 py-[0.5cqw]" /><Sketchy className="flex-1 py-[0.5cqw]" /></span></span> },
    { title: s('Pantallas armadas, no dibujadas', 'Screens assembled, not drawn'), body: <Sketchy className="flex gap-[0.35cqw] p-[0.4cqw]"><span className="w-[22%] bg-[#2a2d33]/80" /><span className="flex flex-1 flex-col gap-[0.3cqw]"><Bar w={70} strong /><Bar w={90} /><Bar w={50} /></span></Sketchy> },
  ]
  const ai = [
    s('AGENTS.md · 5 reglas', 'AGENTS.md · 5 rules'),
    s('Catálogo generado', 'Generated catalog'),
    s('npm run check · 9 reglas', 'npm run check · 9 rules'),
    s('Guardián antes del disco', 'Guard before the disk'),
  ]
  return (
    <Board title={s('Construcción · de los tokens a las pantallas', 'Construction · from tokens to screens')} w={1500} h={780} label={s('Mapa de cómo se construye el sistema', 'Map of how the system is built')}>
      <Pin x={40} y={24}>
        <Hand size={2.4} className="font-bold">{s('Del caos a un sistema que se arma solo', 'From chaos to a system that assembles itself')}</Hand>
      </Pin>
      {steps.map((step, i) => (
        <Pin key={step.title} x={STEP_X[i]} y={120} w={STEP_W}>
          <Sketchy className="flex min-h-[11cqw] flex-col gap-[0.7cqw] p-[0.9cqw]">
            <Hand size={1.55} className="font-bold">{step.title}</Hand>
            {step.body}
          </Sketchy>
        </Pin>
      ))}
      <Arrows paths={STEP_X.slice(0, -1).map((x, i) => ({ d: `M${x + STEP_W + 4},210 L${STEP_X[i + 1] - 6},210`, accent: i === 1 }))} />

      <Pin x={500} y={330} w={260} rotate={-2}>
        <Sticky color="yellow" small>{s('Añadir un tema = añadir una línea', 'Adding a theme = adding one line')}</Sticky>
      </Pin>
      <Pin x={760} y={340} w={260} rotate={2}>
        <Sticky color="pink" small>{s('El significado no se tematiza: éxito, error, aviso', 'Meaning isn’t themed: success, error, warning')}</Sticky>
      </Pin>
      <Pin x={1180} y={330} w={260} rotate={-1.5}>
        <Sticky color="green" small>{s('Toda pantalla: carga, vacío y error', 'Every screen: loading, empty and error')}</Sticky>
      </Pin>

      <Pin x={40} y={470}>
        <Hand size={2} className="font-bold">{s('La IA lee el mismo sistema', 'AI reads the same system')}</Hand>
      </Pin>
      {ai.map((label, i) => (
        <Pin key={label} x={40 + i * 300} y={540} w={260}>
          <Sketchy fill="rgba(220,208,255,0.55)" className="p-[0.9cqw]">
            <Hand size={1.6} className="font-bold">{label}</Hand>
          </Sketchy>
        </Pin>
      ))}
      <Arrows paths={[{ d: 'M1170,560 C1180,420 1120,360 1120,312', dashed: true }, { d: 'M470,560 C520,430 1260,420 1330,312', dashed: true }]} />
      <Pin x={1240} y={540} w={230} rotate={2}>
        <Sticky color="blue" small>{s('Si la IA rompe una regla, el código no se escribe', 'If the AI breaks a rule, the code isn’t written')}</Sticky>
      </Pin>
      <Pin x={40} y={660} w={620}>
        <Hand size={1.4} className="opacity-70">{s('Fases reconstruidas: 5D temas · 7B auditoría · 8.0 reglas de pantalla · 8.5 iconos · 8.7 piezas de IA', 'Reconstructed phases: 5D themes · 7B audit · 8.0 screen rules · 8.5 icons · 8.7 AI pieces')}</Hand>
      </Pin>
    </Board>
  )
}

/* ── Tablero 3 · Construcción del logo (SVG oficial y sus medidas reales) ─ */

/** Medidas del logo (src/components/ui/barberlyticsLogoPaths.ts), en unidades del SVG. */
const LOGO = { x: 44.13, y: 135.57, w: 452.7, h: 102 }
const METRICS = [
  { key: 'capTop', y: 137.51, label: { es: 'tope de mayúsculas', en: 'cap height' } },
  { key: 'xHeight', y: 152.2, label: { es: 'minúsculas = punta de la flecha', en: 'x-height = arrow tip' }, accent: true },
  { key: 'baseline', y: 188.27, label: { es: 'línea base', en: 'baseline' } },
  { key: 'descender', y: 201.83, label: { es: 'descendente de la «y»', en: '“y” descender' } },
  { key: 'pulse', y: 237.57, label: { es: 'fondo del pulso', en: 'pulse bottom' } },
] as const
const PULSE_START = 368.12
const LOGO_X = 188.27 - 137.51

/** Ancho de diseño del tablero de construcción */
const BOARD_W = 1500

/** Posición del logo en el tablero (px de diseño). */
const PLACE = { x: 170, y: 190, w: 960 }
const scale = PLACE.w / LOGO.w
const toY = (y: number) => PLACE.y + (y - LOGO.y) * scale
const toX = (x: number) => PLACE.x + (x - LOGO.x) * scale

export function LogoConstructionBoard() {
  const { t } = useLocale()
  const s = (es: string, en: string): string => t({ es, en } satisfies L)
  const pad = LOGO_X * scale
  const height = LOGO.h * scale
  const palette = [
    { name: s('Carbón', 'Charcoal'), hex: '#171717' },
    { name: s('Oro anterior · 1.8:1 ✕', 'Old gold · 1.8:1 ✕'), hex: '#F0B669' },
    { name: s('Oro tinta · claro', 'Ink gold · light'), hex: '#A86F1F' },
    { name: s('Gradiente de IA', 'AI gradient'), hex: 'linear-gradient(90deg,#F0CE86,#DE8C3A,#2E9CB0)' },
  ]
  return (
    <Board title={s('Construcción · el logo oficial y sus medidas', 'Construction · the official logo and its measures')} w={1500} h={760} label={s('Logo oficial con sus líneas de construcción', 'Official logo with its construction lines')}>
      <Pin x={40} y={24}>
        <Hand size={2.4} className="font-bold">{s('Todo el aire se mide en «x»: la altura de la B', 'All space is measured in “x”: the height of the B')}</Hand>
      </Pin>

      {/* Espacio de respeto: 1x alrededor */}
      <Pin x={PLACE.x - pad} y={PLACE.y - pad} w={PLACE.w + pad * 2}>
        <div className="rounded-[0.4cqw] border-[0.12cqw] border-dashed border-[#e8743b]/70" style={{ height: `${((height + pad * 2) / BOARD_W) * 100}cqw` }} />
      </Pin>
      <Pin x={PLACE.x} y={PLACE.y} w={PLACE.w}>
        {/* eslint-disable-next-line @next/next/no-img-element -- SVG oficial, se muestra tal cual */}
        <img src="/cases/barberlytics/logo-official-ink.svg" alt={s('Logo oficial de Barberlytics', 'Official Barberlytics logo')} className="block h-auto w-full" />
      </Pin>
      <Guides
        lines={[
          ...METRICS.map((m) => ({ d: `M${PLACE.x - 40},${toY(m.y)} L${PLACE.x + PLACE.w + 30},${toY(m.y)}`, accent: 'accent' in m && m.accent })),
          { d: `M${toX(PULSE_START)},${toY(LOGO.y) - 30} L${toX(PULSE_START)},${toY(237.57) + 30}` },
        ]}
      />
      {METRICS.map((m) => (
        <Pin key={m.key} x={PLACE.x + PLACE.w + 40} y={toY(m.y) - 14} w={300}>
          <Hand size={1.35} className={'accent' in m && m.accent ? 'font-bold text-[#c8642b]' : 'opacity-75'}>{t(m.label)}</Hand>
        </Pin>
      ))}
      <Pin x={toX(PULSE_START) - 70} y={toY(237.57) + 34} w={190}>
        <Hand size={1.3} className="opacity-75">{s('el pulso nace bajo la «i»', 'the pulse starts under the “i”')}</Hand>
      </Pin>
      <Pin x={PLACE.x - pad - 4} y={PLACE.y - pad - 34} w={260}>
        <Hand size={1.3} className="text-[#c8642b]">{s('1x de aire alrededor', '1x clear space around')}</Hand>
      </Pin>

      {/* Paleta real del logo */}
      <Pin x={40} y={600}>
        <Hand size={1.8} className="font-bold">{s('La paleta', 'The palette')}</Hand>
      </Pin>
      {palette.map((p, i) => (
        <Pin key={p.name} x={40 + i * 260} y={650} w={230}>
          <span className="flex items-center gap-[0.6cqw]">
            <span className="h-[3cqw] w-[3cqw] shrink-0 rounded-[0.5cqw] border-[0.12cqw] border-[#2a2d33]" style={{ background: p.hex }} />
            <Hand size={1.35}>{p.name}</Hand>
          </span>
        </Pin>
      ))}
      <Pin x={1120} y={600} w={330} rotate={2}>
        <Sticky color="yellow" small>{s('Un solo trazo de 0,14 em, puntas redondas: baja a 45° y sube a 67°.', 'One 0.14 em stroke, round caps: down at 45°, up at 67°.')}</Sticky>
      </Pin>
    </Board>
  )
}

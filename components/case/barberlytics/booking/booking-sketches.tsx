'use client'

import { useLocale, type L } from '@/lib/i18n'
import { Arrows, Bar, Board, Btn, Hand, Pin, SketchPhone, Sketchy, Sticky } from '@/components/case/kit/sketch'

/* ── Piezas de wireframe que se repiten ──────────────────────────────── */

function Input({ label }: { label: string }) {
  return (
    <Sketchy className="px-[0.5cqw] py-[0.45cqw]">
      <Hand size={1.05} className="opacity-60">{label}</Hand>
    </Sketchy>
  )
}

function Row({ dot = false }: { dot?: boolean }) {
  return (
    <Sketchy className="flex items-center gap-[0.5cqw] px-[0.5cqw] py-[0.55cqw]">
      {dot && <span className="h-[1cqw] w-[1cqw] shrink-0 rounded-full border-[0.15cqw] border-[#2a2d33]" />}
      <span className="flex flex-1 flex-col gap-[0.3cqw]">
        <Bar w={70} strong />
        <Bar w={45} />
      </span>
    </Sketchy>
  )
}

function Chips({ n = 4, accent = -1 }: { n?: number; accent?: number }) {
  return (
    <span className="grid grid-cols-3 gap-[0.35cqw]">
      {Array.from({ length: n }, (_, i) => (
        <Sketchy key={i} fill={i === accent ? '#ffd2a8' : 'transparent'} className="py-[0.5cqw]" />
      ))}
    </span>
  )
}

function Bubble({ me = false, w = 70 }: { me?: boolean; w?: number }) {
  return (
    <span className={`flex ${me ? 'justify-end' : ''}`}>
      <Sketchy fill={me ? 'rgba(42,45,51,0.08)' : 'transparent'} className="px-[0.5cqw] py-[0.45cqw]">
        <span className="block" style={{ width: `${w * 0.11}cqw` }}>
          <Bar w={100} />
        </span>
      </Sketchy>
    </span>
  )
}

/* ── Tablero 1 · El mapa del flujo ───────────────────────────────────── */

export function FlowMapBoard() {
  const { t } = useLocale()
  const s = (es: string, en: string): string => t({ es, en } satisfies L)
  return (
    <Board title={s('Mapa del flujo · Según el cliente', 'Flow map · By client')} w={1500} h={760} label={s('Boceto del flujo de reserva con sus dos caminos', 'Sketch of the booking flow with its two paths')}>
      <Pin x={40} y={24}>
        <Hand size={2.3} className="font-bold">{s('Una portada, dos caminos, un final', 'One cover, two paths, one ending')}</Hand>
      </Pin>

      <Pin x={40} y={170} w={150}>
        <SketchPhone title={s('Portada', 'Cover')}>
          <Bar w={65} strong />
          <Bar w={85} />
          <Input label={s('celular', 'phone')} />
          <span className="flex-1" />
          <Btn accent>{s('Continuar', 'Continue')}</Btn>
        </SketchPhone>
      </Pin>

      <Pin x={250} y={300} w={96}>
        <div className="flex aspect-square rotate-45 items-center justify-center border-[0.2cqw] border-[#2a2d33] bg-white/70">
          <Hand size={1.5} className="-rotate-45 text-center font-bold">{s('¿vuelve?', 'back?')}</Hand>
        </div>
      </Pin>
      <Pin x={352} y={225}><Hand size={1.5}>{s('sí', 'yes')}</Hand></Pin>
      <Pin x={352} y={480}><Hand size={1.5}>{s('no', 'no')}</Hand></Pin>

      <Pin x={420} y={80} w={150}>
        <SketchPhone title={s('Arma tu cita', 'Build it')}>
          <Bar w={60} strong />
          <Row />
          <Row />
          <Row />
          <span className="grid grid-cols-5 gap-[0.25cqw]">
            {Array.from({ length: 5 }, (_, i) => <Sketchy key={i} fill={i === 0 ? '#ffd2a8' : 'transparent'} className="py-[0.7cqw]" />)}
          </span>
          <Chips n={3} />
        </SketchPhone>
      </Pin>

      <Pin x={420} y={430} w={150}>
        <SketchPhone title={s('Conozcámonos', 'Let’s meet')}>
          <Bar w={70} strong />
          <Input label={s('nombre', 'name')} />
          <Input label={s('apellido', 'last name')} />
          <Input label={s('correo', 'email')} />
          <span className="flex items-center gap-[0.4cqw]">
            <span className="h-[0.9cqw] w-[0.9cqw] border-[0.15cqw] border-[#2a2d33]" />
            <Bar w={70} />
          </span>
          <span className="flex-1" />
          <Btn accent>{s('Seguir', 'Next')}</Btn>
        </SketchPhone>
      </Pin>

      <Pin x={660} y={215} w={150}>
        <SketchPhone title={s('Elige hora', 'Pick a time')}>
          <Bar w={55} strong />
          <Hand size={1.05} className="opacity-60">{s('mañana', 'morning')}</Hand>
          <Chips n={3} />
          <Hand size={1.05} className="opacity-60">{s('tarde', 'afternoon')}</Hand>
          <Chips n={6} accent={1} />
          <span className="flex-1" />
          <Btn>{s('Avísame si se libera', 'Notify me')}</Btn>
        </SketchPhone>
      </Pin>

      <Pin x={880} y={215} w={150}>
        <SketchPhone title={s('Confirma', 'Confirm')}>
          <Bar w={65} strong />
          <Sketchy className="flex flex-col gap-[0.4cqw] p-[0.6cqw]">
            <Bar w={80} strong />
            <Bar w={60} />
            <Bar w={70} />
          </Sketchy>
          <Row dot />
          <Row dot />
          <span className="flex-1" />
          <Btn accent>{s('Pagar', 'Pay')}</Btn>
        </SketchPhone>
      </Pin>

      <Pin x={1090} y={215} w={150}>
        <SketchPhone title={s('Código', 'Code')}>
          <Bar w={70} strong />
          <Bar w={85} />
          <span className="grid grid-cols-6 gap-[0.25cqw]">
            {Array.from({ length: 6 }, (_, i) => <Sketchy key={i} className="py-[0.9cqw]" />)}
          </span>
          <span className="flex-1" />
        </SketchPhone>
      </Pin>

      <Pin x={1300} y={215} w={150}>
        <SketchPhone title={s('¡Listo!', 'Done!')}>
          <span className="mx-auto mt-[1cqw] flex h-[4cqw] w-[4cqw] items-center justify-center rounded-full border-[0.2cqw] border-[#2a2d33]">
            <Hand size={2.4}>✓</Hand>
          </span>
          <Bar w={70} strong />
          <Bar w={55} />
          <span className="flex-1" />
          <Btn>{s('Al calendario', 'To calendar')}</Btn>
          <Btn>{s('Fijar la cita', 'Make it recurring')}</Btn>
        </SketchPhone>
      </Pin>

      <Arrows
        paths={[
          { d: 'M194,330 C215,335 228,345 250,350' },
          { d: 'M318,302 C350,240 375,205 418,200' },
          { d: 'M318,398 C350,470 375,540 418,560' },
          { d: 'M574,230 C620,245 630,290 656,320', accent: true },
          { d: 'M574,575 C620,520 630,440 656,400' },
          { d: 'M814,360 L876,360' },
          { d: 'M1034,360 L1086,360', accent: true },
          { d: 'M1244,360 L1296,360' },
        ]}
      />

      <Pin x={196} y={96} w={190} rotate={-3}>
        <Sticky color="blue" small>{s('Ya conozco a quien vuelve: «lo de siempre» puesto', 'I already know who’s back: “the usual” preset')}</Sticky>
      </Pin>
      <Pin x={640} y={585} w={210} rotate={2.5}>
        <Sticky color="pink" small>{s('¿Día sin horas? → otros barberos con habilidades parecidas', 'Day with no slots? → barbers with similar skills')}</Sticky>
      </Pin>
      <Pin x={870} y={70} w={200} rotate={-2}>
        <Sticky color="yellow" small>{s('El código va ANTES de cobrar, no antes de mirar', 'The code comes BEFORE paying, not before browsing')}</Sticky>
      </Pin>
      <Pin x={1270} y={590} w={200} rotate={2}>
        <Sticky color="green" small>{s('Fijarla cada 1–4 semanas, hasta 6 veces', 'Repeat every 1–4 weeks, up to 6 times')}</Sticky>
      </Pin>
    </Board>
  )
}

/* ── Tablero 2 · Cuatro versiones ────────────────────────────────────── */

const VERSION_X = [70, 410, 750, 1090]

export function VersionsBoard() {
  const { t } = useLocale()
  const s = (es: string, en: string): string => t({ es, en } satisfies L)
  const versions = [
    { name: s('Paso a paso', 'Step by step'), q: s('«¿Quién eres?»', '“Who are you?”'), note: s('Para quien vuelve por lo de siempre', 'For the returning regular'), color: 'yellow' as const },
    { name: s('Agenda en lista', 'List agenda'), q: s('«Arma tu cita»', '“Build your appointment”'), note: s('Para quien busca hueco pronto', 'For the next-free-slot seeker'), color: 'blue' as const },
    { name: s('Según el cliente', 'By client'), q: s('«La portada decide»', '“The cover decides”'), note: s('Para todos · queda por defecto', 'For everyone · the default'), color: 'green' as const },
    { name: 'Clipper', q: s('«Dime qué necesitas»', '“Tell me what you need”'), note: s('Para quien prefiere escribir o hablar', 'For those who’d rather type or talk'), color: 'violet' as const },
  ]
  return (
    <Board title={s('Exploración · cuatro versiones', 'Exploration · four versions')} w={1400} h={760} label={s('Bocetos de las cuatro versiones de la reserva', 'Sketches of the four booking versions')}>
      <Pin x={70} y={24}>
        <Hand size={2.3} className="font-bold">{s('No son pieles de lo mismo: cada una parte de una pregunta', 'Not skins of the same thing: each starts from a question')}</Hand>
      </Pin>
      {versions.map((v, i) => (
        <Pin key={v.name} x={VERSION_X[i]} y={92} w={240}>
          <Hand size={1.9} className="block font-bold">{v.name}</Hand>
          <Hand size={1.5} className="block opacity-70">{v.q}</Hand>
        </Pin>
      ))}

      <Pin x={VERSION_X[0]} y={170} w={230}>
        <SketchPhone>
          <span className="grid grid-cols-6 gap-[0.2cqw]">
            {Array.from({ length: 6 }, (_, i) => <span key={i} className={`h-[0.45cqw] rounded-full ${i < 2 ? 'bg-[#e8743b]' : 'bg-[#2a2d33]/20'}`} />)}
          </span>
          <Bar w={65} strong />
          <Row dot />
          <Row dot />
          <Row dot />
          <span className="flex-1" />
          <Btn accent>{s('Siguiente', 'Next')}</Btn>
        </SketchPhone>
      </Pin>

      <Pin x={VERSION_X[1]} y={170} w={230}>
        <SketchPhone>
          <Bar w={55} strong />
          {[0, 1, 2, 3].map((i) => (
            <Sketchy key={i} className="flex items-center justify-between px-[0.6cqw] py-[0.7cqw]">
              <Bar w={55} strong />
              <Hand size={1.2}>›</Hand>
            </Sketchy>
          ))}
          <Chips n={6} accent={2} />
          <span className="flex-1" />
          <Btn accent>{s('Confirma tu cita', 'Confirm')}</Btn>
        </SketchPhone>
      </Pin>

      <Pin x={VERSION_X[2]} y={170} w={230}>
        <SketchPhone>
          <Sketchy fill="rgba(42,45,51,0.12)" className="h-[6cqw]" />
          <Bar w={60} strong />
          <Bar w={80} />
          <Input label={s('+57 · celular', '+57 · phone')} />
          <Row />
          <span className="flex-1" />
          <Btn accent>{s('Continuar', 'Continue')}</Btn>
        </SketchPhone>
      </Pin>

      <Pin x={VERSION_X[3]} y={170} w={230}>
        <SketchPhone>
          <span
            className="mx-auto h-[3.2cqw] w-[3.2cqw] rounded-full border-[0.18cqw] border-[#2a2d33]"
            style={{ background: 'repeating-linear-gradient(135deg, #f0ce86 0 6px, #2e9cb0 6px 12px)' }}
          />
          <Bubble me w={60} />
          <Bubble w={80} />
          <Sketchy className="flex flex-col gap-[0.35cqw] p-[0.5cqw]">
            <Bar w={60} strong />
            {['1', '2', '3'].map((n) => (
              <span key={n} className="flex items-center justify-between">
                <Bar w={60} />
                <Hand size={1}>{n}</Hand>
              </span>
            ))}
          </Sketchy>
          <span className="flex-1" />
          <Input label={s('escribe o habla…', 'type or talk…')} />
        </SketchPhone>
      </Pin>

      {versions.map((v, i) => (
        <Pin key={`note-${v.name}`} x={VERSION_X[i] + 10} y={630} w={210} rotate={i % 2 ? 2 : -2}>
          <Sticky color={v.color} small>{v.note}</Sticky>
        </Pin>
      ))}
    </Board>
  )
}

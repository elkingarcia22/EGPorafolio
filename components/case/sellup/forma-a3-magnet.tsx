'use client'

import { Briefcase, Globe, Linkedin, MessageSquare, Newspaper, ShieldCheck, Users, X } from 'lucide-react'
import { RumboMark } from './platform'
import { REAL } from './real-app'

/**
 * 5.4 · Escena 2: la investigación como imán. Fragmentos de fuentes flotan alrededor
 * de Rumbo; uno a uno, un trazo de luz los atrae al centro y se vuelven un hecho citado.
 * Un verificador sin IA tacha el que no está en la fuente. Datos de ejemplo.
 */

export const MAGNET_W = 1040
export const MAGNET_H = 560
const MX = 370
const MY = 285

interface Fragment {
  kind: string
  Icon: typeof Globe
  title: string
  meta: string
  fact: string
  source: string
  x: number
  y: number
  rot: number
  /** No está en la fuente citada: el verificador lo tacha. */
  fake?: boolean
}

export const FRAGMENTS: readonly Fragment[] = [
  { kind: 'Noticia', Icon: Newspaper, title: 'Clínica Andina abre 3 sedes nuevas en el norte', meta: 'Diario regional · 12 oct', fact: 'Abrió 3 clínicas en 2026', source: 'Noticias', x: 140, y: 95, rot: -4 },
  { kind: 'Vacante', Icon: Briefcase, title: 'Se buscan 120 enfermeras · turno rotativo', meta: 'Portal de empleo · nov', fact: 'Busca 120 enfermeras este trimestre', source: 'Empleo', x: 610, y: 85, rot: 3 },
  { kind: 'LinkedIn', Icon: Linkedin, title: '«Lanzamos nuestra academia interna 🎓»', meta: 'Valeria Ortiz · publicación', fact: 'Valeria lidera la academia interna', source: 'LinkedIn', x: 600, y: 300, rot: 2 },
  { kind: 'Sitio oficial', Icon: Globe, title: 'Nosotros · 1.240 colaboradores en 9 sedes', meta: 'clinicaandina.mx', fact: '1.240 colaboradores', source: 'Sitio oficial', x: 120, y: 300, rot: -2 },
  { kind: 'Prensa RR. HH.', Icon: Users, title: 'La rotación en salud llega al 28 % en México', meta: 'Revista de capital humano', fact: 'Rotación en salud: 28 % en México', source: 'Prensa RR. HH.', x: 250, y: 480, rot: 3 },
  { kind: 'Foro', Icon: MessageSquare, title: '¿Clínica Andina está en venta?', meta: 'Comentario anónimo', fact: 'Clínica Andina está en venta', source: 'Foro', x: 545, y: 485, rot: -3, fake: true },
]

/** Tick (dentro del bucle de la pieza) en que Rumbo atrae cada fragmento. */
export const fragAt = (i: number) => 6 + i * 2

function FragmentCard({ f, state }: { f: Fragment; state: 'idle' | 'pull' | 'gone' | 'struck' }) {
  const dx = MX - f.x
  const dy = MY - f.y
  const absorbed = state === 'gone'
  return (
    <div
      className="absolute w-[220px] transition-[transform,opacity,filter] duration-[380ms] ease-[cubic-bezier(.6,0,.2,1)]"
      style={{
        left: f.x - 110,
        top: f.y - 42,
        zIndex: state === 'pull' ? 5 : 1,
        transform: absorbed ? `translate(${dx}px, ${dy}px) scale(0.18) rotate(0deg)` : `rotate(${f.rot}deg) scale(${state === 'pull' ? 1.06 : 1})`,
        opacity: absorbed ? 0 : state === 'struck' ? 0.45 : 1,
        filter: absorbed ? 'blur(6px)' : 'none',
      }}
    >
      <div className="a3-bob motion-reduce:animate-none" style={{ animationDelay: `${(f.x % 7) * -0.4}s` }}>
        <div
          className="relative rounded-xl border px-3 py-2.5 shadow-[0_18px_40px_-20px_rgba(0,0,0,0.9)] transition-[border-color,box-shadow] duration-300"
          style={{
            background: '#161616',
            borderColor: state === 'pull' ? (f.fake ? '#f87171' : '#7e2be0') : 'rgba(255,255,255,0.1)',
            boxShadow: state === 'pull' ? `0 0 0 3px ${f.fake ? 'rgba(248,113,113,0.25)' : 'rgba(126,43,224,0.3)'}, 0 20px 50px -18px rgba(126,43,224,0.7)` : undefined,
          }}
        >
          <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-white/45"><f.Icon className="h-3.5 w-3.5" />{f.kind}</p>
          <p className={`mt-1 text-[13px] font-medium leading-snug ${state === 'struck' ? 'line-through decoration-red-400 decoration-2' : ''}`}>{f.title}</p>
          <p className="mt-1 text-[11px] text-white/45">{f.meta}</p>
          {state === 'struck' && (
            <span className="absolute -right-3 -top-3 flex items-center gap-1 rounded-full bg-red-500 px-2 py-0.5 text-[11px] font-semibold text-white shadow-lg">
              <X className="h-3 w-3" />No está en la fuente
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export function MagnetScene({ time }: { time: number }) {
  const stateOf = (i: number): 'idle' | 'pull' | 'gone' | 'struck' => {
    const at = fragAt(i)
    if (time < at) return 'idle'
    if (time === at) return 'pull'
    return FRAGMENTS[i].fake ? 'struck' : 'gone'
  }
  const facts = FRAGMENTS.map((f, i) => ({ f, i, on: time > fragAt(i) }))
  const kept = facts.filter((x) => x.on && !x.f.fake).length
  const pulling = FRAGMENTS.some((_, i) => time === fragAt(i))
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 text-white" style={{ width: MAGNET_W, height: MAGNET_H, background: 'radial-gradient(ellipse at 36% 50%, #1b1430 0%, #0d0d0f 60%)', fontFamily: REAL.font }}>
      <style>{'@keyframes a3-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}.a3-bob{animation:a3-bob 3.2s ease-in-out infinite}@keyframes a3-ring{0%{transform:scale(.6);opacity:0}15%{opacity:.7}100%{transform:scale(2.4);opacity:0}}'}</style>

      {/* Campo magnético */}
      {[0, 1, 2].map((k) => (
        <span key={k} className="absolute h-[140px] w-[140px] rounded-full border border-[#7e2be0]/50 motion-reduce:hidden" style={{ left: MX - 70, top: MY - 70, animation: `a3-ring 2.4s ease-out ${k * 0.8}s infinite` }} aria-hidden="true" />
      ))}

      {/* Trazos de luz hacia Rumbo */}
      <svg className="pointer-events-none absolute inset-0" width={MAGNET_W} height={MAGNET_H} aria-hidden="true">
        <defs>
          <linearGradient id="a3-trail" x1="0" x2="1">
            <stop offset="0" stopColor="#eb6233" />
            <stop offset="0.5" stopColor="#d22d6a" />
            <stop offset="1" stopColor="#7e2be0" />
          </linearGradient>
        </defs>
        {FRAGMENTS.map((f, i) => {
          const on = time === fragAt(i)
          const cx = (f.x + MX) / 2 + (f.y < MY ? -60 : 60)
          const cy = (f.y + MY) / 2
          return (
            <path
              key={f.title}
              d={`M${f.x} ${f.y} Q${cx} ${cy} ${MX} ${MY}`}
              fill="none"
              stroke={f.fake ? '#f87171' : 'url(#a3-trail)'}
              strokeWidth={on ? 3 : 1}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={on ? 0 : 1}
              style={{ transition: 'stroke-dashoffset 320ms ease-out, opacity 300ms', opacity: on ? 1 : 0, filter: on ? 'drop-shadow(0 0 6px rgba(210,45,106,0.8))' : undefined }}
            />
          )
        })}
      </svg>

      {FRAGMENTS.map((f, i) => <FragmentCard key={f.title} f={f} state={stateOf(i)} />)}

      {/* Rumbo, el imán */}
      <div className="absolute flex flex-col items-center" style={{ left: MX - 60, top: MY - 60, width: 120 }}>
        <div className={`transition-transform duration-200 ${pulling ? 'scale-110' : 'scale-100'}`}>
          <RumboMark size={88} motion="thinking" glow />
        </div>
        <p className="mt-3 whitespace-nowrap text-[13px] font-semibold">Rumbo investiga</p>
        <p className="whitespace-nowrap text-[11px] text-white/50">Clínica Andina · Valeria Ortiz</p>
      </div>

      {/* Hechos citados */}
      <div className="absolute right-0 top-0 flex h-full w-[290px] flex-col border-l border-white/10 bg-[#121212]/90 p-4 backdrop-blur">
        <p className="flex items-center text-[13px] font-semibold">Hechos citados<span className="ml-auto rounded-md bg-white/10 px-1.5 text-[12px] tabular-nums">{kept}</span></p>
        <ul className="mt-3 space-y-2">
          {facts.map(({ f, on }) => (
            <li
              key={f.title}
              className="rounded-lg border px-3 py-2 transition-[transform,opacity] duration-300 ease-out"
              style={{ borderColor: f.fake ? 'rgba(248,113,113,0.4)' : 'rgba(255,255,255,0.1)', background: f.fake ? 'rgba(248,113,113,0.06)' : 'rgba(255,255,255,0.03)', opacity: on ? 1 : 0, transform: on ? 'none' : 'translateX(-40px) scale(0.9)' }}
            >
              <p className={`text-[12.5px] leading-snug ${f.fake ? 'text-red-300 line-through decoration-red-400' : ''}`}>{f.fact}</p>
              <p className="mt-1 flex items-center gap-1 text-[11px]">
                {f.fake ? <span className="text-red-300">✕ Descartado por el verificador</span> : <><span className="rounded bg-[#7e2be0]/25 px-1.5 text-[#c9b3ff]">↗ {f.source}</span><ShieldCheck className="ml-auto h-3.5 w-3.5 text-emerald-400" /></>}
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-auto text-[11px] leading-snug text-white/45">Un verificador sin IA compara cada cita con su fuente. Lo que no está, no entra al mensaje.</p>
      </div>
    </div>
  )
}

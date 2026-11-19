'use client'

import { ArrowUpDown, Check, ChevronDown, Minus, Plus, Search, Sheet, Upload, X, Grip, Settings } from 'lucide-react'
import { RumboOrb } from './platform'
import { RealCard, RealFrame, RealTag } from './real-app'
import { FakeCursor, HIGHLIGHT, RealDock, ReplicaNote, StorySteps, stepAt, useStoryTime, type StoryStep } from './real-story'

/**
 * 5.2 · Agente 1: Rumbo arma una búsqueda conversando, la búsqueda aparece en
 * la tabla real de Búsquedas y el vendedor aprueba una empresa en «Por revisar».
 */

const STEPS: readonly StoryStep[] = [
  { label: { es: 'Rumbo pregunta qué buscar', en: 'Rumbo asks what to look for' }, from: 0 },
  { label: { es: 'La búsqueda encuentra empresas', en: 'The search finds companies' }, from: 10 },
  { label: { es: 'El vendedor aprueba', en: 'The rep approves' }, from: 18 },
]
const LOOP = 28

const ROWS = [
  { q: 'Empresas por criterios · Colombia', form: 'Empresas por criterios', found: 16, review: 6, ok: 1, date: '19 de nov de 2026', who: 'Sergio C.' },
  { q: 'Competidores de una empresa', form: 'Competidores de una emp…', found: 4, review: 2, ok: 0, date: '19 de nov de 2026', who: 'Diego U.' },
  { q: 'Empresas por criterios · Perú', form: 'Empresas por criterios', found: 18, review: 10, ok: 0, date: '19 de nov de 2026', who: 'Noé S.' },
  { q: 'Empresas por criterios · Chile', form: 'Empresas por criterios', found: 10, review: 10, ok: 0, date: '18 de nov de 2026', who: 'Andrés P.' },
  { q: 'Archivo importado · Ecuador', form: 'Archivo importado', found: 169, review: 103, ok: 0, date: '17 de nov de 2026', who: 'Daniel S.' },
  { q: 'Empresas por criterios · Panamá', form: 'Empresas por criterios', found: 9, review: 6, ok: 0, date: '17 de nov de 2026', who: 'Rocío G.' },
  { q: 'Proveedores de una empresa', form: 'Proveedores de una em…', found: 13, review: 8, ok: 2, date: '16 de nov de 2026', who: 'Pedro T.' },
]

const CANDIDATES = [
  { name: 'Clínica Andina', meta: 'Salud · 1.240 empleados', why: 'Sin dueño en HubSpot hace 9 meses', tag: 'Libre en HubSpot', tone: 'green' as const },
  { name: 'Grupo Vital Salud', meta: 'Salud · 860 empleados', why: 'Registro oficial · RFC verificado', tag: 'Nueva', tone: 'blue' as const },
  { name: 'Hospitales del Valle', meta: 'Salud · 2.100 empleados', why: 'Web oficial + registro', tag: 'Nueva', tone: 'blue' as const },
  { name: 'Laboratorios Sierra', meta: 'Farmacéutica · 530 empleados', why: 'La atiende otro vendedor', tag: 'Ya en HubSpot', tone: 'amber' as const },
  { name: 'Red Médica Norte', meta: 'Salud · 720 empleados', why: 'Registro oficial · RFC verificado', tag: 'Nueva', tone: 'blue' as const },
]

const TYPES = ['Empresas por criterios', 'Muchas empresas por criterios', 'Árbol de una empresa', 'Competidores de una empresa', 'Proveedores de una empresa']

function Bubble({ me, show, children }: { me?: boolean; show: boolean; children: React.ReactNode }) {
  return (
    <div className={`flex gap-2 transition-all duration-500 ${me ? 'justify-end' : ''} ${show ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}>
      {!me && <RumboOrb size={18} />}
      <p className={`max-w-[230px] text-[12.5px] leading-snug ${me ? 'rounded-xl bg-[#6b8cff] px-3 py-1.5 text-white' : 'text-white/85'}`}>{children}</p>
    </div>
  )
}

/** Panel de Rumbo tal cual: cabecera, pestañas, stepper de 6 pasos y conversación. */
function RumboPanel({ time }: { time: number }) {
  const step = time < 3 ? 0 : time < 5 ? 1 : time < 7 ? 2 : time < 8 ? 3 : time < 9 ? 4 : 5
  const open = time < 10
  return (
    <div className="absolute bottom-2 right-2 top-2 z-20 flex w-[330px] flex-col rounded-2xl border border-white/10 bg-[#141414] shadow-[-30px_0_60px_-20px_rgba(0,0,0,0.9)] transition-all duration-700 ease-expo" style={{ transform: open ? 'none' : 'translateX(110%)', opacity: open ? 1 : 0 }}>
      <div className="flex items-center gap-2.5 px-4 pt-3.5">
        <RumboOrb size={30} />
        <span><span className="block text-[14px] font-semibold">Rumbo</span><span className="block text-[11.5px] text-white/50">Generar empresas candidatas</span></span>
        <span className="ml-auto flex gap-3 text-white/60"><Plus className="h-4 w-4" /><Minus className="h-4 w-4" /><X className="h-4 w-4" /></span>
      </div>
      <div className="mt-3 flex gap-5 border-b border-white/10 px-4 text-[13px]">
        <span className="border-b-2 border-[#6b8cff] pb-2 font-medium">Conversación</span>
        <span className="pb-2 text-white/55">Búsquedas</span>
      </div>
      <div className="flex items-start px-4 pt-3">
        {['Tipo', 'País', 'Industria', 'Criterios', 'Resumen', 'Revisión'].map((s, i) => (
          <div key={s} className="flex flex-1 flex-col items-center">
            <span className={`grid h-5 w-5 place-items-center rounded-full border text-[10px] transition-all duration-500 ${i < step ? 'border-[#6b8cff]/60 bg-[#6b8cff]/20 text-[#9db0ff]' : i === step ? 'border-[#6b8cff] bg-[#6b8cff] text-white' : 'border-white/20 text-white/40'}`}>{i < step ? <Check className="h-2.5 w-2.5" /> : i + 1}</span>
            <span className={`mt-1 text-[10.5px] ${i <= step ? 'text-white' : 'text-white/40'}`}>{s}</span>
          </div>
        ))}
      </div>
      <div className="flex-1 space-y-2.5 overflow-hidden px-4 pt-4">
        <Bubble show>Hola, te ayudaré a encontrar los prospectos que necesitas. ¿Qué tipo de prospectos quieres encontrar?</Bubble>
        <Bubble me show={time >= 3}>Empresas por criterios</Bubble>
        <Bubble show={time >= 3.5}>¿En qué país buscamos?</Bubble>
        <Bubble me show={time >= 5}>México</Bubble>
        <Bubble show={time >= 5.5}>¿Qué industria?</Bubble>
        <Bubble me show={time >= 7}>Salud · más de 200 empleados</Bubble>
        <Bubble show={time >= 8}>Busco en HubSpot, registros oficiales y la web antes de pagar nada. Te dejo las candidatas en «Por revisar».</Bubble>
      </div>
      <div className={`m-3 rounded-xl border border-white/10 p-2 transition-opacity duration-500 ${time < 3 ? 'opacity-100' : 'opacity-0'}`}>
        <p className="mb-1.5 flex items-center px-1 text-[12px] font-medium">¿Qué tipo de prospectos quieres encontrar?<ChevronDown className="ml-auto h-3.5 w-3.5 opacity-50" /></p>
        {TYPES.map((tp, i) => (
          <p key={tp} className={`mb-1 rounded-lg border px-2.5 py-1.5 text-[12px] transition-all duration-300 ${i === 0 && time >= 2 ? 'border-[#6b8cff] bg-[#6b8cff]/15' : 'border-white/10'}`}>{tp}<span className="float-right text-white/40">{i + 1}</span></p>
        ))}
      </div>
    </div>
  )
}

function KpiStrip({ items }: { items: readonly { label: string; value: string; note: string; hot?: boolean }[] }) {
  return (
    <RealCard>
      <div className="grid grid-cols-4 divide-x divide-white/10">
        {items.map((k) => (
          <div key={k.label} className="px-4 py-3">
            <p className="text-[12.5px] text-white/60">{k.label}</p>
            <p className={`mt-1 text-[22px] font-semibold tabular-nums transition-colors duration-500 ${k.hot ? 'text-[#9db0ff]' : ''}`}>{k.value}</p>
            <p className="text-[11.5px] text-white/45">{k.note}</p>
          </div>
        ))}
      </div>
    </RealCard>
  )
}

function SearchesScreen({ time }: { time: number }) {
  const arrived = time >= 10
  const ready = time >= 13
  const found = arrived ? Math.min(12, Math.max(0, (time - 10) * 4)) : 0
  const th = 'px-3 py-2.5 text-left font-medium text-white/60'
  return (
    <div className="px-6 pt-5">
      <h4 className="text-[24px] font-semibold tracking-tight">Búsquedas</h4>
      <p className="mt-1 max-w-[560px] text-[12.5px] text-white/55">Lo que buscaste con Rumbo o importaste, y lo que te asignaron: qué encontró cada búsqueda y qué falta por revisar.</p>
      <div className="mt-4">
        <KpiStrip items={[
          { label: 'Búsquedas', value: arrived ? '35' : '34', note: 'Las tuyas o con empresas asignadas', hot: arrived },
          { label: 'Por revisar', value: String(594 + found), note: 'Esperan una decisión', hot: arrived },
          { label: 'Abiertas', value: arrived ? '35' : '34', note: 'Con empresas por revisar' },
          { label: 'Aprobadas', value: '31', note: 'Ya son empresas' },
        ]} />
      </div>
      <RealCard className="mt-4">
        <p className="flex items-center px-4 py-3 text-[14px] font-medium">Búsquedas<span className="ml-auto flex gap-2 text-white/60"><Search className="h-4 w-4" /><Sheet className="h-4 w-4" /></span></p>
        <table className="w-full text-[12.5px]">
          <thead className="border-y border-white/10">
            <tr>{['Búsqueda', 'Forma', 'Estado', 'Encontradas', 'Por revisar', 'Aprobadas', 'Fecha'].map((h) => <th key={h} className={th}>{h} <ArrowUpDown className="inline h-3 w-3 opacity-40" /></th>)}</tr>
          </thead>
          <tbody>
            <tr className="transition-all duration-700" style={{ opacity: arrived ? 1 : 0, ...(arrived ? { background: HIGHLIGHT.background, boxShadow: 'inset 3px 0 0 #6b8cff' } : {}) }}>
              {arrived && (
                <>
                  <td className="px-3 py-2.5 text-[#8fa6ff]">Empresas por criterios · México · Salud</td>
                  <td className="px-3">Empresas por criterios</td>
                  <td className="px-3">{ready ? <RealTag tone="amber">Listo para revisión</RealTag> : <RealTag tone="blue">Buscando…</RealTag>}</td>
                  <td className="px-3 tabular-nums">{found}</td>
                  <td className="px-3"><span className="rounded-full bg-amber-500/20 px-2 text-amber-300">{found}</span></td>
                  <td className="px-3">0</td>
                  <td className="px-3"><span className="block">19 de nov de 2026</span><span className="text-[11px] text-white/45">Tú</span></td>
                </>
              )}
            </tr>
            {ROWS.map((r) => (
              <tr key={r.q} className="border-t border-white/[0.06]">
                <td className="max-w-[200px] truncate px-3 py-2.5 text-[#8fa6ff]">{r.q}</td>
                <td className="px-3">{r.form}</td>
                <td className="px-3"><RealTag tone="amber">Listo para revisión</RealTag></td>
                <td className="px-3 tabular-nums">{r.found}</td>
                <td className="px-3"><span className="rounded-full bg-amber-500/20 px-2 text-amber-300">{r.review}</span></td>
                <td className="px-3">{r.ok}</td>
                <td className="px-3"><span className="block">{r.date}</span><span className="text-[11px] text-white/45">{r.who}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </RealCard>
    </div>
  )
}

function ReviewScreen({ time }: { time: number }) {
  const approved = time >= 21
  const gone = time >= 24
  return (
    <div className="px-6 pt-5">
      <h4 className="text-[24px] font-semibold tracking-tight">Por revisar</h4>
      <p className="mt-1 text-[12.5px] text-white/55">Empresas candidatas de tus búsquedas. Al aprobar, pasan a tu lista y se escriben en HubSpot a tu nombre.</p>
      <p className="mt-4 flex gap-2 text-[12.5px]">
        {['Todas 12', 'Nuevas 9', 'Libres en HubSpot 2', 'Ya en HubSpot 1'].map((c, i) => <span key={c} className={`rounded-lg border px-2.5 py-1 ${i === 0 ? 'border-[#6b8cff] bg-[#6b8cff]/15' : 'border-white/10 text-white/70'}`}>{c}</span>)}
        <span className="ml-auto text-white/50">Empresas por criterios · México · Salud</span>
      </p>
      <ul className="mt-4 space-y-2">
        {CANDIDATES.map((c, i) => {
          const hero = i === 0
          return (
            <li
              key={c.name}
              className="flex items-center gap-4 rounded-xl border px-4 py-3 transition-all duration-700 ease-expo"
              style={hero ? { ...HIGHLIGHT, ...(approved ? { borderColor: 'rgba(52,211,153,0.7)', background: 'rgba(16,185,129,0.12)', boxShadow: '0 0 0 4px rgba(16,185,129,0.15)' } : {}), transform: gone ? 'translateX(60%)' : 'none', opacity: gone ? 0 : 1 } : { borderColor: 'rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }}
            >
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 text-[13px] font-medium">{c.name[0]}</span>
              <span className="w-[230px]"><span className="block text-[14px] font-medium">{c.name}</span><span className="text-[12px] text-white/50">🇲🇽 México · {c.meta}</span></span>
              <RealTag tone={c.tone}>{c.tag}</RealTag>
              <span className="flex-1 text-[12px] text-white/55">{c.why}</span>
              {hero && approved ? (
                <span className="flex items-center gap-1.5 text-[13px] text-emerald-300"><Check className="h-4 w-4" />Aprobada · pasa a tu lista</span>
              ) : (
                <span className="flex gap-2 text-[12.5px]">
                  <span className={`rounded-lg px-3 py-1.5 ${c.tone === 'amber' ? 'bg-white/5 text-white/30' : 'bg-[#6b8cff] text-[#0a0a0a]'}`}>Aprobar</span>
                  <span className="rounded-lg border border-white/15 px-3 py-1.5 text-white/70">Descartar</span>
                </span>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export function SearchReview() {
  const [ref, time] = useStoryTime(LOOP, 22)
  const review = stepAt(STEPS, time) === 2
  const busy = time >= 9 && time < 13
  return (
    <div ref={ref}>
      <StorySteps steps={STEPS} time={time} kicker={{ es: 'Agente 1', en: 'Agent 1' }} />
      <RealFrame
        active={review ? 'revisar' : 'busquedas'}
        crumb={['Empresas', review ? 'Por revisar' : 'Búsquedas']}
        height={720}
        overlay={
          <>
            <RumboPanel time={time} />
            <RealDock busy={busy} label={busy ? 'Buscando empresas con Rumbo IA' : 'Generar con Rumbo IA'}>
              <span className="flex gap-3 px-2 text-white/60"><Grip className="h-4 w-4" /><Settings className="h-4 w-4" /><Upload className="h-4 w-4" /></span>
            </RealDock>
            <FakeCursor x={time < 19 ? 900 : 1108} y={time < 19 ? 560 : 166} click={time === 20} show={review && time < 22} />
          </>
        }
      >
        <div className="relative h-full">
          <div className={`absolute inset-0 transition-opacity duration-700 ${review ? 'opacity-0' : 'opacity-100'}`}><SearchesScreen time={time} /></div>
          <div className={`absolute inset-0 transition-opacity duration-700 ${review ? 'opacity-100' : 'opacity-0'}`}><ReviewScreen time={time} /></div>
        </div>
      </RealFrame>
      <ReplicaNote />
    </div>
  )
}

'use client'

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react'
import { AI_READING } from '@/lib/content/cases/encuestas/results-real'
import { TEMPLATES } from './form-fan'
import { favColor, Lock, UBITS_BLUE } from './shared'
import './form.css'

/**
 * El recorrido de La forma en celular y tableta: en vez de acercar una captura de escritorio (borrosa), cada parada se
 * dibuja en HTML nítido con el mismo estilo claro de UBITS, y el recuadro activo se enciende mientras el resto se apaga.
 */

/** Retraso escalonado de las piezas que entran. */
const rise = (i: number, base = 0): React.CSSProperties => ({ animationDelay: `${base + i * 90}ms` })

function Block({ active, title, children }: { active: boolean; title?: React.ReactNode; children: React.ReactNode }) {
  // Cuenta las veces que el recuadro se enciende: solo entonces sus piezas vuelven a entrar (al apagarse se quedan).
  const [turns, setTurns] = useState(0)
  useEffect(() => {
    if (active) setTurns((n) => n + 1)
  }, [active])
  return (
    <section
      className={`rounded-xl border bg-white p-3 transition-[opacity,transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${active ? 'border-[#0c5bef] opacity-100 shadow-[0_0_0_4px_rgba(12,91,239,0.14),0_18px_40px_-24px_rgba(12,40,110,0.5)]' : 'scale-[0.98] border-black/[0.07] opacity-40'}`}
    >
      {title && <p className="mb-2 flex items-center gap-2 text-[13px] font-semibold">{title}</p>}
      <div key={turns}>{children}</div>
    </section>
  )
}

function Head({ title, sub }: { title: React.ReactNode; sub: string }) {
  return (
    <header>
      <p className="text-[19px] font-bold leading-tight">{title}</p>
      <p className="mt-0.5 text-[12px] leading-snug text-[#5c646f]">{sub}</p>
    </header>
  )
}

const New = () => <span className="rounded bg-[#e8effd] px-1.5 py-px text-[11px] font-medium text-[#0c5bef]">Nuevo</span>

function Inicio({ spot }: { spot: number }) {
  const items = [
    { tag: 'Alta', tone: 'bg-[#fde8ea] text-[#b02a37]', title: 'No cumple la participación de la norma', meta: 'NOM 035 · Riesgo psicosocial', cta: 'Recordar a 10' },
    { tag: 'Media', tone: 'bg-[#fdf3dc] text-[#946200]', title: 'Áreas bajo el mínimo de anonimato', meta: 'Clima Organizacional · Q3 2026', cta: 'Recordar a 14' },
    { tag: 'Baja', tone: 'bg-[#e8effd] text-[#0c5bef]', title: 'Comentarios por revisar', meta: 'NPS Clientes Premium · Q3 2026', cta: 'Revisar comentarios' },
  ]
  return (
    <>
      <Head title="Encuestas" sub="Crea encuestas de clima, cultura y eNPS y lee sus resultados." />
      <Block active={spot === 0}>
        <p className="mb-2 text-[12px] text-[#5c646f]">Cinco plantillas, NOM 035 primero</p>
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
          {TEMPLATES.map((tp, i) => (
            <div key={tp.name} className="hd-rise flex items-center gap-1.5 rounded-lg border border-black/[0.07] px-1.5 py-1.5" style={rise(i)}>
              <img src={tp.icon} alt="" width={64} height={64} draggable={false} className="h-7 w-7 shrink-0 select-none" />
              <p className="min-w-0 text-[12px] font-semibold leading-tight">{tp.name === 'Universidad Corporativa' ? 'Universidad' : tp.name}</p>
            </div>
          ))}
        </div>
      </Block>
      <Block active={spot === 1} title={<>Para atender <New /></>}>
        <ul className="divide-y divide-black/[0.06]">
          {items.map((it, i) => (
            <li key={it.title} className="hd-rise py-2" style={rise(i, 100)}>
              <p className="flex items-start gap-1.5 text-[13px] font-medium leading-snug">
                <span className={`mt-px shrink-0 rounded px-1.5 text-[11px] ${it.tone}`}>{it.tag}</span>
                {it.title}
              </p>
              <p className="mt-1 flex items-center justify-between gap-2 text-[11px] text-[#5c646f]">
                <span className="truncate">{it.meta}</span>
                <span className="shrink-0 rounded-md border border-black/10 px-2 py-0.5 text-[#303a47]">{it.cta}</span>
              </p>
            </li>
          ))}
        </ul>
      </Block>
    </>
  )
}

function Crear({ spot }: { spot: number }) {
  const steps = ['Datos generales', 'Participantes', 'Demográficos', 'Secciones', 'Bienvenida']
  const tree = [
    { n: '1', t: 'Propósito y estrategia', q: '6 preguntas', d: 0 },
    { n: '1.1', t: 'Misión y objetivos', q: '3 preguntas', d: 1 },
    { n: '1.2', t: 'Alineación con el día a día', q: '3 preguntas', d: 1 },
    { n: '2', t: 'Liderazgo', q: '9 preguntas', d: 0 },
    { n: '2.1', t: 'Mi líder directo', q: '6 preguntas', d: 1 },
  ]
  return (
    <>
      <Head title="Editar encuesta" sub="Paso 4 de 5 · Arma las secciones y las preguntas." />
      <Block active={spot === 0}>
        <ol className="flex items-center">
          {steps.map((s, i) => (
            <li key={s} className={`flex items-center ${i < steps.length - 1 ? 'flex-1' : ''}`}>
              <span className="encf-pop flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold" style={{ ...rise(i), ...(i < 4 ? { background: UBITS_BLUE, color: '#fff' } : { border: '1px solid rgba(0,0,0,0.15)', color: '#979ba3' }) }}>
                {i < 3 ? '✓' : i + 1}
              </span>
              {i < steps.length - 1 && <span className="encf-grow mx-1 h-0.5 flex-1 rounded-full" style={{ ...rise(i, 60), background: i < 3 ? UBITS_BLUE : '#e3e6ec' }} />}
            </li>
          ))}
        </ol>
        <p className="mt-2 text-[12px]"><span className="font-semibold text-[#0c5bef]">4 · Secciones y preguntas</span> <span className="text-[#979ba3]">· se desbloquean en orden</span></p>
      </Block>
      <Block active={spot === 1}>
        <ul className="space-y-1.5">
          {tree.map((r, i) => (
            <li key={r.n} className="hd-rise flex items-center gap-2 rounded-lg border border-black/[0.07] px-2 py-1.5" style={{ ...rise(i), marginLeft: r.d * 16 }}>
              <span className={`rounded px-1.5 font-mono text-[11px] ${r.d === 0 ? 'bg-[#0c5bef] text-white' : 'bg-[#ecf1fa] text-[#0c5bef]'}`}>{r.n}</span>
              <span className={`truncate text-[13px] ${r.d === 0 ? 'font-semibold' : ''}`}>{r.t}</span>
            </li>
          ))}
        </ul>
      </Block>
      <Block active={spot === 2} title="Así va la encuesta">
        <ul className="space-y-1">
          {tree.map((r, i) => (
            <li key={r.n} className="hd-rise flex items-center justify-between gap-2 text-[12px]" style={rise(i)}>
              <span className="truncate" style={{ paddingLeft: r.d * 12 }}>{r.n}. {r.t}</span>
              <span className="shrink-0 rounded-full bg-[#e2f4ea] px-2 text-[11px] text-[#1f7a4c]">✓ {r.q}</span>
            </li>
          ))}
        </ul>
      </Block>
    </>
  )
}

function Responder({ spot }: { spot: number }) {
  const options = ['Totalmente en desacuerdo', 'En desacuerdo', 'Neutral', 'De acuerdo', 'Totalmente de acuerdo']
  const content = [
    { n: '1', t: 'Propósito y estrategia', v: '1/6', on: true },
    { n: '2', t: 'Liderazgo', v: '0/12' },
    { n: '3', t: 'Colaboración y comunicación', v: '0/7' },
    { n: '4', t: 'Desarrollo y crecimiento', v: '0/6' },
  ]
  return (
    <>
      <Head title="Vista previa" sub="Clima Organizacional - Q1 2026 · Pág. 2 de 19" />
      <Block active={spot === 0} title={<><span className="rounded bg-[#e8effd] px-1.5 text-[11px] font-medium text-[#0c5bef]">Subsección 1.1</span> Claridad estratégica</>}>
        <p className="text-[13px] font-medium leading-snug">1 · Entiendo claramente la misión de la organización y hacia dónde va.</p>
        <ul className="mt-2 grid gap-1">
          {options.map((o, i) => (
            <li key={o} className={`hd-rise flex items-center gap-2 rounded-md border px-2 py-1.5 text-[12px] ${i === 3 && spot === 0 ? 'enc-tour-pick' : 'border-black/10'}`} style={rise(i)}>
              <span className="h-3.5 w-3.5 shrink-0 rounded-full border border-black/25" />
              {o}
            </li>
          ))}
        </ul>
      </Block>
      <Block active={spot === 1} title="Tu avance">
        <p className="flex justify-between text-[12px]"><span>Preguntas respondidas</span><span className="tabular-nums text-[#5c646f]">1 de 54</span></p>
        <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-[#ecf1fa]"><span className="encf-grow block h-full w-[8%] rounded-full" style={{ background: UBITS_BLUE }} /></span>
        <ul className="mt-2 space-y-1">
          {content.map((c, i) => (
            <li key={c.n} className={`hd-rise flex justify-between rounded-md px-2 py-1 text-[12px] ${c.on ? 'bg-[#f1f4fa] font-semibold' : ''}`} style={rise(i, 150)}>
              <span className="truncate">{c.n} {c.t}</span>
              <span className="shrink-0 tabular-nums text-[#5c646f]">{c.v}</span>
            </li>
          ))}
        </ul>
      </Block>
    </>
  )
}

function Historico({ spot }: { spot: number }) {
  const kpis = [
    { k: 'Participación', v: '87,5 %', d: '28 de 32' },
    { k: 'Favorabilidad', v: '+65', d: '74 % favorable' },
    { k: 'eNPS', v: '50', d: '64 % promotores' },
  ]
  return (
    <>
      <Head title="Cargar encuestas" sub="Archivos ✓ · Datos generales ✓ · 3 Estructura" />
      <Block active={spot === 0} title={<>Indicadores <span className="text-[11px] font-normal text-[#5c646f]">· salen del archivo</span></>}>
        <div className="grid grid-cols-3 divide-x divide-black/[0.07]">
          {kpis.map((x, i) => (
            <div key={x.k} className="encf-pop px-2 first:pl-0" style={rise(i)}>
              <p className="text-[11px] text-[#5c646f]">{x.k}</p>
              <p className="text-[19px] font-semibold tabular-nums">{x.v}</p>
              <p className="text-[11px] leading-tight text-[#5c646f]">{x.d}</p>
            </div>
          ))}
        </div>
      </Block>
      <Block active={spot === 1} title="Participantes">
        <p className="hd-rise flex items-center justify-between rounded-lg border border-black/[0.07] px-2.5 py-2 text-[13px]">
          Hacen match con UBITS <span className="rounded-full bg-[#e2f4ea] px-2 text-[12px] font-semibold text-[#1f7a4c]">18 ✓</span>
        </p>
        <div className="hd-rise mt-1.5 rounded-lg border border-black/[0.07] px-2.5 py-2" style={rise(1)}>
          <p className="flex items-center justify-between text-[13px]">Posibles match <span className="rounded-full bg-[#fdf3dc] px-2 text-[12px] font-semibold text-[#946200]">4</span></p>
          <p className="mt-1.5 text-[13px] font-medium">Francisca Leiva Toro</p>
          <p className="mt-1.5 flex flex-wrap gap-1.5 text-[11px]">
            {['Es el mismo', 'Es otro', 'Sin usuario'].map((o, i) => (
              <span key={o} className={`encf-pop rounded-full border px-2 py-0.5 ${i === 0 && spot === 1 ? 'border-[#0c5bef] bg-[#e8effd] text-[#0c5bef]' : 'border-black/15'}`} style={rise(i, 350)}>{o}</span>
            ))}
          </p>
        </div>
      </Block>
    </>
  )
}

function Resultados({ spot }: { spot: number }) {
  const rows = [
    { s: 'Propósito', v: [4.3, 3.9, 3.5] },
    { s: 'Liderazgo', v: [3.7, 3.3, 4.2] },
    { s: 'Bienestar', v: [3.6, 2.9, 2.6] },
  ]
  return (
    <>
      <Head title={<>Clima Organizacional - Q1 2026 <span className="align-middle text-[11px] font-medium text-[#1f7a4c]">Finalizada</span></>} sub="Participación · Favorabilidad · Preguntas · eNPS" />
      <Block active={spot === 0} title="Favorabilidad general">
        <p className="flex items-baseline gap-2"><span className="text-[28px] font-semibold leading-none">39 %</span><span className="text-[12px] text-[#5c646f]">Desfavorable · meta 70 %</span></p>
        <span className="mt-2 flex h-2 overflow-hidden rounded-full">
          {[[39, '#1aa463'], [45, '#f2b51c'], [16, '#c8102e']].map(([w, c], i) => <span key={String(c)} className="encf-grow h-full" style={{ ...rise(i, 100), width: `${w}%`, background: String(c) }} />)}
        </span>
        <p className="mt-1.5 text-[11px] text-[#5c646f]">8.362 favorables · 9.582 neutrales · 3.508 desfavorables</p>
        <p className="mt-2 text-[12px]">Área más desfavorable: <b>Gente y Cultura 3,0</b></p>
      </Block>
      <Block active={spot === 1} title="Mapa de calor por área">
        <div className="grid grid-cols-[5.2rem_repeat(4,minmax(0,1fr))] gap-1 text-[11px]">
          <span />
          {['Producto', 'Tecnol.', 'Finanzas', 'Comercial'].map((a, i) => <span key={a} className={`truncate text-center ${i === 3 ? 'font-semibold text-[#946200]' : 'text-[#5c646f]'}`}>{a}</span>)}
          {rows.map((r, ri) => (
            <div key={r.s} className="contents">
              <span className="truncate">{r.s}</span>
              {r.v.map((v, ci) => <span key={ci} className="encf-pop flex h-7 items-center justify-center rounded-md font-mono" style={{ ...rise(ri * 4 + ci), background: favColor(v) }}>{v.toFixed(1).replace('.', ',')}</span>)}
              <span className="encf-pop flex h-7 items-center justify-center rounded-md bg-[#eef0f4] text-[#979ba3]" style={rise(ri * 4 + 3)}><Lock className="h-3.5 w-3.5" /></span>
            </div>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-[#5c646f]">Comercial · n=4, mínimo 5: candado, nunca un número.</p>
      </Block>
    </>
  )
}

function Ia({ spot }: { spot: number }) {
  const f = AI_READING.findings[0]
  return (
    <>
      <Head title="Clima Organizacional - Q1 2026" sub="Resultados · Lectura de la IA" />
      <Block active={spot === 0}>
        <p className="flex flex-wrap gap-x-3 gap-y-1 text-[12px]">
          <span className="text-[#979ba3]">Favorabilidad</span>
          <span className="encf-pop flex items-center gap-1 border-b-2 border-[#303a47] font-semibold">Análisis con IA <New /></span>
          <span className="encf-pop flex items-center gap-1" style={rise(1)}>Accionables <New /></span>
        </p>
        <p className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-[#5c646f]">
          <span className="hd-rise rounded-lg bg-[#f6f7fb] p-2" style={rise(2)}><b className="block text-[19px] text-[#303a47]">9</b>lecturas · 67 % alta</span>
          <span className="hd-rise rounded-lg bg-[#f6f7fb] p-2" style={rise(3)}><b className="block text-[19px] text-[#303a47]">81,1 %</b>mayor foco accionable</span>
        </p>
      </Block>
      <Block active={spot === 1} title="Hallazgos">
        <p className="hd-rise flex items-start justify-between gap-2 text-[13px] font-medium leading-snug">{f.title}<span className="shrink-0 rounded bg-[#e2f4ea] px-1.5 text-[11px] text-[#1f7a4c]">{f.confidence}</span></p>
        <p className="hd-rise mt-2 rounded-lg bg-[#f6f7fb] p-2 text-[12px] leading-snug" style={rise(1)}><b>Evidencia</b> · {f.evidence}</p>
      </Block>
    </>
  )
}

const STOPS = [Inicio, Crear, Responder, Historico, Resultados, Ia] as const

/** Cuánto se queda la parada anterior debajo de la nueva mientras esta aparece encima. */
const CROSSFADE_MS = 700

/**
 * La parada `stop` dibujada en HTML, con el recuadro `spot` encendido. Al cambiar de parada (también al volver de la
 * última a la primera) la anterior se queda quieta debajo mientras la nueva aparece encima: nunca hay un cuadro vacío.
 */
export function NativeStop({ stop, spot }: { stop: number; spot: number }) {
  const [shown, setShown] = useState(stop)
  const [prev, setPrev] = useState<number | null>(null)
  if (stop !== shown) {
    setPrev(shown)
    setShown(stop)
  }
  useEffect(() => {
    if (prev === null) return
    const id = window.setTimeout(() => setPrev(null), CROSSFADE_MS)
    return () => window.clearTimeout(id)
  }, [prev])
  const layers = prev !== null && prev !== stop ? [prev, stop] : [stop]
  return (
    <div className="relative">
      {layers.map((k) => {
        const Stop = STOPS[k] ?? Inicio
        const on = k === stop
        return (
          <div
            key={k}
            aria-hidden={!on}
            className={`flex min-h-[29rem] flex-col gap-3 bg-[linear-gradient(170deg,#f3f6fd,#fff_40%)] p-4 text-[#303a47] ${on ? 'enc-fade relative' : 'pointer-events-none absolute inset-0 overflow-hidden'}`}
          >
            <Stop spot={on ? spot : -1} />
          </div>
        )
      })}
    </div>
  )
}

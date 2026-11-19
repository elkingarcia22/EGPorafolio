'use client'

import { ArrowRight, ArrowUpDown, Check, GripVertical, Loader2, MoreHorizontal, Search, Sheet } from 'lucide-react'
import { RealCard, RealFrame, RealTag } from './real-app'
import { HIGHLIGHT, ReplicaNote, StorySteps, stepAt, useStoryTime, type StoryStep } from './real-story'

/**
 * 5.5 · Catálogo de fuentes, como la pantalla real: una fuente nueva llega
 * «Por validar», se prueba con datos reales y queda «Verificada» para la IA.
 * Conteos reales del catálogo; la validación de la fila destacada es ilustrativa.
 */

const STEPS: readonly StoryStep[] = [
  { label: { es: 'Una fuente nueva llega por validar', en: 'A new source arrives to validate' }, from: 0 },
  { label: { es: 'Se prueba con datos reales', en: 'It’s tested with real data' }, from: 5 },
  { label: { es: 'Queda verificada y la IA la usa', en: 'Verified, and the AI uses it' }, from: 11 },
]
const LOOP = 20

const ROWS = [
  { name: 'Supersociedades SIIS', country: 'Colombia', next: 'Snapshot SIIS 2024 cargado con 10.000 empresas. Primera fuente de NIT por nombre en cada corrida del Agente 1; alimenta la capa gratuita por industria.', use: 'Conectada' },
  { name: 'Entidades públicas (CHIP + SIGEP II)', country: 'Colombia', next: 'Conectada en el código: en cada corrida del Agente 1 da el NIT de alcaldías, ministerios y entidades públicas con su número de servidores.', use: 'Conectada · número fiscal por' },
  { name: 'Personas Jurídicas Cámaras de Comercio', country: 'Colombia', next: 'Conectada a enrichment por NIT y a la búsqueda en vivo del NIT por nombre cuando SIIS no da un NIT seguro.', use: 'Conectada' },
  { name: 'SECOP II Proveedores Registrados', country: 'Colombia', next: 'Conectada a enrichment B2G por NIT.', use: 'Conectada' },
  { name: 'RUES (Registro Único Empresarial)', country: 'Colombia', next: 'Son los mismos datos de las Cámaras de Comercio: la conexión técnica es la fuente «Personas Jurídicas».', use: 'Conectada' },
]

function Chip({ label, n, on }: { label: string; n: number; on: boolean }) {
  return (
    <span className="flex items-center gap-1.5 whitespace-nowrap rounded-xl border px-2.5 py-1.5 text-[12px] transition-all duration-500" style={on ? HIGHLIGHT : { borderColor: 'rgba(255,255,255,0.1)' }}>
      <span className="font-medium">{label}</span>
      <span className={`rounded-full px-1.5 text-[11px] tabular-nums ${on ? 'bg-[#6b8cff] text-white' : 'bg-white/10 text-white/70'}`}>{n}</span>
      <span className={`h-3.5 w-3.5 rounded-full border ${on ? 'border-[#6b8cff] bg-[#6b8cff] shadow-[inset_0_0_0_3px_#161616]' : 'border-white/30'}`} />
    </span>
  )
}

function Screen({ time }: { time: number }) {
  const now = stepAt(STEPS, time)
  const verified = now === 2
  const testing = now === 1
  const progress = testing ? Math.min(10, (time - 5) * 2) : verified ? 10 : 0
  const filter = verified ? 'Verificadas' : 'Por validar'
  const th = 'px-3 py-2.5 text-left font-medium text-white/60'
  return (
    <div className="px-6 pt-5">
      <h4 className="text-[24px] font-semibold tracking-tight">Catálogo de fuentes</h4>
      <p className="mt-1 text-[12.5px] text-white/55">Las fuentes de datos por país que usa SellUp: en qué estado están y qué falta para poder usarlas.</p>
      <p className="mt-4 inline-flex rounded-xl border border-white/10 bg-white/[0.03] p-1 text-[12.5px]">
        <span className="rounded-lg bg-white/10 px-3 py-1 font-medium">Usadas por la IA <span className="text-white/50">101</span></span>
        <span className="px-3 py-1 text-white/60">De consulta manual <span className="text-white/40">28</span></span>
        <span className="px-3 py-1 text-white/60">Todas <span className="text-white/40">132</span></span>
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Chip label="Todas" n={101} on={false} />
        <Chip label="Verificadas" n={verified ? 82 : 81} on={filter === 'Verificadas'} />
        <Chip label="Por validar" n={verified ? 14 : 15} on={filter === 'Por validar'} />
        <Chip label="Señal manual" n={1} on={false} />
        <Chip label="Solo validación" n={1} on={false} />
        <Chip label="Snapshot parcial" n={2} on={false} />
      </div>
      <RealCard className="mt-4">
        <p className="flex items-start px-4 py-3">
          <span><span className="block text-[14px] font-medium">Usadas por la IA</span><span className="text-[12px] text-white/50">Fuentes que la IA puede consultar al buscar empresas.</span></span>
          <span className="ml-auto flex gap-2 text-white/60"><Search className="h-4 w-4" /><Sheet className="h-4 w-4" /></span>
        </p>
        <table className="w-full table-fixed text-[12.5px]">
          <colgroup><col className="w-[28px]" /><col className="w-[220px]" /><col className="w-[100px]" /><col className="w-[120px]" /><col /><col className="w-[150px]" /><col className="w-[130px]" /></colgroup>
          <thead className="border-y border-white/10">
            <tr><th /><th className={th}>Fuente <ArrowUpDown className="inline h-3 w-3 opacity-40" /></th><th className={th}>País</th><th className={th}>Estado</th><th className={th}>Siguiente acción</th><th className={th}>Uso por la IA</th><th className={th}>Acción</th></tr>
          </thead>
          <tbody>
            <tr className="transition-all duration-700" style={{ background: HIGHLIGHT.background, boxShadow: `inset 3px 0 0 ${verified ? '#34d399' : '#6b8cff'}` }}>
              <td className="pl-2 text-white/30"><GripVertical className="h-4 w-4" /></td>
              <td className="px-3 py-3 font-medium">DENUE · Directorio de unidades económicas</td>
              <td className="px-3">México</td>
              <td className="px-3">{verified ? <RealTag tone="green">Verificada</RealTag> : <RealTag tone="amber">Por validar</RealTag>}</td>
              <td className="px-3 leading-snug text-white/75">
                {verified ? 'Validada con 10 empresas de prueba: 10 con RFC y tamaño. Entra a la capa gratuita del Agente 1 para México.' : testing ? (
                  <span className="flex items-center gap-2"><Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" />Probando con empresas reales: {progress} de 10 con RFC y tamaño</span>
                ) : 'Probar la descarga por actividad y tamaño antes de conectarla.'}
                {testing && <span className="mt-1.5 block h-1 overflow-hidden rounded-full bg-white/10"><span className="block h-full bg-[#6b8cff] transition-[width] duration-700" style={{ width: `${progress * 10}%` }} /></span>}
              </td>
              <td className="px-3">{verified ? <span className="flex items-center gap-1.5 text-emerald-300"><Check className="h-3.5 w-3.5" />Conectada</span> : <span className="text-white/45">Sin conectar</span>}</td>
              <td className="px-3"><span className="flex items-center gap-1 font-medium">Ver detalle <ArrowRight className="h-3.5 w-3.5" /></span></td>
            </tr>
            {ROWS.map((r) => (
              <tr key={r.name} className={`border-t border-white/[0.06] transition-opacity duration-500 ${verified ? 'opacity-100' : 'opacity-35'}`}>
                <td className="pl-2 text-white/30"><GripVertical className="h-4 w-4" /></td>
                <td className="px-3 py-3 font-medium">{r.name}</td>
                <td className="px-3">{r.country}</td>
                <td className="px-3"><RealTag tone="green">Verificada</RealTag></td>
                <td className="px-3 py-2 leading-snug text-white/75">{r.next}</td>
                <td className="truncate px-3">{r.use}</td>
                <td className="px-3"><span className="flex items-center gap-1 whitespace-nowrap font-medium">Ver detalle <ArrowRight className="h-3.5 w-3.5" /><MoreHorizontal className="ml-2 h-4 w-4 text-white/40" /></span></td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="border-t border-white/10 px-4 py-2.5 text-[12px] text-white/50">Mostrando 6 de {verified ? 82 : 101} fuentes</p>
      </RealCard>
    </div>
  )
}

export function SourceCatalog() {
  const [ref, time] = useStoryTime(LOOP, 14)
  return (
    <div ref={ref}>
      <StorySteps steps={STEPS} time={time} kicker={{ es: 'Catálogo', en: 'Catalog' }} />
      <RealFrame active="catalogo" crumb={['Catálogo de fuentes']} height={820}>
        <Screen time={time} />
      </RealFrame>
      <ReplicaNote />
    </div>
  )
}

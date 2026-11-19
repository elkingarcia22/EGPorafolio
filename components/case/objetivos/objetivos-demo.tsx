'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useLocale, type L } from '@/lib/i18n'
import { OBJ_CASE } from '@/lib/content/cases/objetivos/objetivos-case'
import { NewTabLink, RecordModal } from '@/components/case/kit/record-modal'

/** El staging público del playground de UBITS; `ver=backlog` abre el alcance completo. */
const STAGING = 'https://staging-playground.ubits.co'
const BASE = '/admin/desempeno-cultura/objetivos'

type EntryId = 'inicio' | 'crear' | 'resultados'

const ENTRIES: readonly { id: EntryId; path: string; name: L; does: L }[] = [
  { id: 'inicio', path: BASE, name: { es: 'Inicio', en: 'Home' }, does: { es: 'Para atender, el pulso y la lista de ciclos', en: 'To attend, the pulse and the cycle list' } },
  { id: 'crear', path: `${BASE}/crear`, name: { es: 'Crear un ciclo', en: 'Create a cycle' }, does: { es: 'El constructor paso a paso, con Crear con IA', en: 'The step-by-step builder, with Create with AI' } },
  { id: 'resultados', path: `${BASE}/compania-2026-trimestres/resultados`, name: { es: 'Resultados', en: 'Results' }, does: { es: 'Un ciclo anual por trimestres, en sus pestañas', en: 'A yearly cycle by quarters, across its tabs' } },
]

const urlOf = (path: string) => `${STAGING}${path}?ver=backlog`

/** 08 · Demo: el módulo real de Objetivos (vista de administrador) en el staging, dentro del modal. */
export function ObjetivosDemo() {
  const { t } = useLocale()
  const [open, setOpen] = useState<EntryId | null>(null)
  const entry = ENTRIES.find((e) => e.id === open)

  return (
    <div>
      <div className="mb-10 max-w-[62ch]">
        <p data-reveal className="text-[clamp(1.6rem,1rem+1.8vw,2.6rem)] font-light leading-tight">{t({ es: 'El producto real, como administrador.', en: 'The real product, as admin.' })}</p>
        <p data-reveal className="mt-4 leading-relaxed opacity-80">{t(OBJ_CASE.demo.lead)}</p>
      </div>

      <div data-reveal="device" className="relative grid overflow-hidden rounded-3xl bg-[#0b0d16] text-white lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
        <span className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-signal opacity-30 blur-3xl" aria-hidden="true" />
        <ul className="relative flex flex-col divide-y divide-white/10">
          {ENTRIES.map((e, i) => (
            <li key={e.id} className="flex-1">
              <button type="button" onClick={() => setOpen(e.id)} className="group flex h-full w-full items-center justify-between gap-4 p-6 text-left transition-colors hover:bg-signal">
                <span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/50">0{i + 1} · {t({ es: 'Entrar por', en: 'Enter through' })}</span>
                  <span className="mt-1 block text-xl">{t(e.name)}</span>
                  <span className="mt-1 block text-sm text-white/60 group-hover:text-white/85">{t(e.does)}</span>
                </span>
                <span className="text-2xl transition-transform duration-500 ease-expo group-hover:translate-x-1" aria-hidden="true">⤢</span>
              </button>
            </li>
          ))}
        </ul>
        <button type="button" onClick={() => setOpen('inicio')} className="group relative p-6 [perspective:1600px] md:p-10" aria-label={t({ es: 'Abrir la demo en el inicio', en: 'Open the demo at the home' })}>
          <span className="block overflow-hidden rounded-xl bg-white shadow-[0_50px_100px_-30px_rgba(0,0,0,0.85)] ring-1 ring-white/15 transition-transform duration-1000 ease-expo [transform:rotateX(6deg)_rotateY(-6deg)] group-hover:[transform:none]">
            <span className="flex items-center gap-1.5 border-b border-black/5 bg-[#f4f5f8] px-3 py-2" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-3 h-5 flex-1 truncate rounded-md bg-black/[0.05] px-2 text-left font-mono text-[10px] leading-5 text-black/45">staging-playground.ubits.co{BASE}</span>
            </span>
            <Image src={OBJ_CASE.form.home.src} width={2000} height={1250} alt="" sizes="(min-width: 1024px) 45vw, 100vw" className="block h-auto w-full" />
          </span>
          <span className="mt-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/55">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#17b26a]" aria-hidden="true" />
            {t({ es: 'En vivo · staging', en: 'Live · staging' })}
          </span>
        </button>
      </div>

      <dl data-reveal className="mt-8 grid gap-px overflow-hidden border border-fg/15 bg-fg/15 sm:grid-cols-3">
        {[
          { k: { es: 'Prueba', en: 'Try' }, v: { es: 'Crea un ciclo y responde quién redacta', en: 'Create a cycle and answer who writes' } },
          { k: { es: 'Prueba', en: 'Try' }, v: { es: 'En resultados, pasa por las siete pestañas', en: 'In results, go through the seven tabs' } },
          { k: { es: 'Atajos', en: 'Shortcuts' }, v: { es: '← → cambian de entrada · Esc cierra', en: '← → switch entry · Esc closes' } },
        ].map((item) => (
          <div key={item.v.es} className="bg-bg p-4 text-sm">
            <dt className="opacity-60">{t(item.k)}</dt>
            <dd className="mt-1 font-mono text-[12px]">{t(item.v)}</dd>
          </div>
        ))}
      </dl>

      <RecordModal
        ids={ENTRIES.map((e) => e.id)}
        openId={open}
        onOpenChange={(id) => setOpen(id as EntryId | null)}
        title={entry ? `${t({ es: 'Objetivos · Admin', en: 'Goals · Admin' })} — ${t(entry.name)}` : t(OBJ_CASE.title)}
        titleLeading={<span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0c5bef] font-mono text-xs font-semibold text-white">Ob</span>}
        description={entry && `staging-playground.ubits.co${entry.path}`}
        actions={entry && <NewTabLink href={urlOf(entry.path)} />}
        prevLabel={t({ es: 'Entrada anterior', en: 'Previous entry' })}
        nextLabel={t({ es: 'Entrada siguiente', en: 'Next entry' })}
      >
        {entry && <iframe key={entry.id} src={urlOf(entry.path)} title={t({ es: 'Objetivos de UBITS, en vivo', en: 'UBITS Goals, live' })} className="w-full flex-1 bg-white" />}
      </RecordModal>
    </div>
  )
}

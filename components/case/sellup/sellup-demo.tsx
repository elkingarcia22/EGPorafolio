'use client'

import { useCallback, useEffect, useState } from 'react'
import { RecordModal } from '@/components/case/kit/record-modal'
import { useLocale, type L } from '@/lib/i18n'
import { CHANNELS, type Channel } from '@/lib/content/cases/sellup/sellup-agents'
import { CompaniesScene, ContactsScene } from './demo-scenes'
import { BLUE, SellUpMark } from './ui'

/* ── Agente 3 ───────────────────────────────────────────────────────── */

const DECISORS = ['Sofía Rivas', 'Mateo Gil'] as const

const RESEARCH: readonly L[] = [
  { es: 'Lo que SellUp ya sabe', en: 'What SellUp already knows' },
  { es: 'Sitio oficial · 5 páginas', en: 'Official site · 5 pages' },
  { es: 'Noticias y talento · con fecha', en: 'News and talent · dated' },
  { es: 'Verificador de citas', en: 'Citation checker' },
]

function FirstContactScene() {
  const { t } = useLocale()
  const [who, setWho] = useState<readonly string[]>(['Sofía Rivas'])
  const [channels, setChannels] = useState<readonly Channel[]>(['email', 'linkedin'])
  const [step, setStep] = useState(-1)
  const [open, setOpen] = useState<string | null>(null)
  const done = step >= RESEARCH.length

  useEffect(() => {
    if (step < 0 || done) return
    const id = window.setTimeout(() => setStep((s) => s + 1), 750)
    return () => window.clearTimeout(id)
  }, [step, done])

  const toggle = <T,>(list: readonly T[], v: T): readonly T[] => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v])
  const cells = who.flatMap((w) => channels.map((c) => `${w}|${c}`))

  return (
    <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
      <aside className="rounded-[14px] border border-black/[0.08] bg-white p-4">
        <p className="font-medium">Rumbo · {t({ es: 'Preparar el primer contacto', en: 'Prepare the first contact' })}</p>
        <p className="mt-3 text-xs text-black/55">{t({ es: 'Decisores (hasta 5)', en: 'Decision-makers (up to 5)' })}</p>
        {DECISORS.map((d) => (
          <label key={d} className="mt-1.5 flex items-center gap-2 text-sm"><input type="checkbox" checked={who.includes(d)} onChange={() => { setWho(toggle(who, d)); setStep(-1) }} className="accent-[#5b7eff]" />{d}</label>
        ))}
        <p className="mt-4 text-xs text-black/55">{t({ es: 'Canales', en: 'Channels' })}</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {CHANNELS.map((c) => (
            <button key={c.id} aria-pressed={channels.includes(c.id)} onClick={() => { setChannels(toggle(channels, c.id)); setStep(-1) }} className={`rounded-[8px] border px-2.5 py-1 text-xs ${channels.includes(c.id) ? 'border-[#5b7eff] bg-[#5b7eff]/10 text-[#2a44b8]' : 'border-black/10'}`}>{t(c.name)}</button>
          ))}
        </div>
        <button className="mt-4 w-full rounded-[10px] px-3.5 py-2 text-sm font-medium text-white disabled:opacity-40" style={{ background: BLUE }} disabled={cells.length === 0 || (step >= 0 && !done)} onClick={() => { setOpen(null); setStep(0) }}>
          {t({ es: `Preparar ${cells.length} ${cells.length === 1 ? 'mensaje' : 'mensajes'}`, en: `Prepare ${cells.length} ${cells.length === 1 ? 'message' : 'messages'}` })}
        </button>
        <p className="mt-2 text-[11px] text-black/45">{t({ es: '1 investigación + 1 redactor por decisor', en: '1 research + 1 writer per decision-maker' })}</p>
        {step >= 0 && (
          <ol className="mt-4 space-y-2 text-sm">
            {RESEARCH.map((r, i) => (
              <li key={r.es} className={`flex items-center gap-2 ${i <= step ? '' : 'opacity-30'}`}>
                <span className="grid h-5 w-5 place-items-center rounded-full text-[10px] text-white" style={{ background: i < step ? '#10b981' : i === step ? BLUE : '#c7cbd3' }}>{i < step ? '✓' : i + 1}</span>{t(r)}
              </li>
            ))}
          </ol>
        )}
      </aside>
      <div className="rounded-[14px] border border-black/[0.08] bg-white p-4">
        <p className="font-medium">Grupo Salud Meridiano · {t({ es: 'Primer contacto', en: 'First contact' })}</p>
        {!done ? (
          <p className="mt-10 text-center text-sm text-black/40">{step >= 0 ? t({ es: 'Investigando con citas…', en: 'Researching with citations…' }) : t({ es: 'Elige decisores y canales ←', en: 'Pick decision-makers and channels ←' })}</p>
        ) : (
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {cells.map((key, i) => {
              const [w, c] = key.split('|') as [string, Channel]
              const review = i === cells.length - 1 && cells.length > 2
              const name = CHANNELS.find((x) => x.id === c)?.name
              return (
                <li key={key}>
                  <button onClick={() => setOpen(open === key ? null : key)} className="w-full rounded-[12px] border border-black/[0.08] p-3 text-left text-sm hover:border-[#5b7eff]">
                    <span className="flex items-center gap-2">
                      {w} · {name ? t(name) : c}
                      <span className={`ml-auto rounded-md px-2 py-0.5 text-[11px] ${review ? 'bg-amber-500/15 text-amber-800' : 'bg-emerald-500/12 text-emerald-700'}`}>{review ? t({ es: 'Para revisar', en: 'To review' }) : t({ es: 'Lista', en: 'Ready' })}</span>
                    </span>
                    {open === key && (
                      <span className="mt-3 block border-t border-black/[0.06] pt-3 text-xs leading-relaxed text-black/70">
                        {review
                          ? t({ es: '«…reducen 40 % la rotación…» — cifra sin fuente: el verificador la marcó. Una corrección automática y, si sigue, la revisa el vendedor.', en: '“…cut turnover by 40%…” — unsourced figure: the checker flagged it. One automatic fix and, if it persists, the rep reviews it.' })
                          : t({ es: `${w.split(' ')[0]}, vi que abrieron dos sedes este año [1]. ¿Cómo están formando a los líderes nuevos? [1] sitio oficial, 02-10.`, en: `${w.split(' ')[0]}, I saw you opened two sites this year [1]. How are you training the new leaders? [1] official site, 02-Oct.` })}
                      </span>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
        {done && <p className="mt-4 text-xs text-black/50">{t({ es: 'No envía nada. «La usé» registra qué pasó: reunión, interesado, no por ahora…', en: 'It sends nothing. “I used it” logs what happened: meeting, interested, not now…' })}</p>}
      </div>
    </div>
  )
}

/* ── El modal y su lanzador ─────────────────────────────────────────── */

const SCENES: readonly { id: string; title: L; nav: L; Scene: React.ComponentType }[] = [
  { id: 'empresas', title: { es: 'Agente 1 · Empresas', en: 'Agent 1 · Companies' }, nav: { es: 'Empresas', en: 'Companies' }, Scene: CompaniesScene },
  { id: 'contactos', title: { es: 'Agente 2 · Contactos', en: 'Agent 2 · Contacts' }, nav: { es: 'Contactos', en: 'Contacts' }, Scene: ContactsScene },
  { id: 'primer-contacto', title: { es: 'Agente 3 · Primer contacto', en: 'Agent 3 · First contact' }, nav: { es: 'Primer contacto', en: 'First contact' }, Scene: FirstContactScene },
]
const IDS = SCENES.map((s) => s.id)

function DemoApp({ id, onNav }: { id: string; onNav: (id: string) => void }) {
  const { t } = useLocale()
  const scene = SCENES.find((s) => s.id === id) ?? SCENES[0]
  const { Scene } = scene
  return (
    <div className="flex min-h-0 flex-1 bg-[#f4f5f7] text-[#14161b]">
      <nav className="hidden w-[200px] shrink-0 flex-col gap-1 border-r border-black/[0.06] bg-white p-3 md:flex" aria-label="SellUp">
        <p className="mb-3 flex items-center gap-2 px-2 text-sm font-semibold"><SellUpMark size={22} />SellUp</p>
        {SCENES.map((s) => (
          <button key={s.id} onClick={() => onNav(s.id)} className={`rounded-[10px] px-3 py-2 text-left text-sm ${s.id === id ? 'bg-[#5b7eff]/10 font-medium text-[#2a44b8]' : 'text-black/60 hover:bg-black/[0.03]'}`}>{t(s.nav)}</button>
        ))}
        <p className="mt-auto px-2 text-[11px] text-black/40">{t({ es: 'Demo con datos de ejemplo', en: 'Demo with sample data' })}</p>
      </nav>
      <div className="min-w-0 flex-1 overflow-y-auto p-4 md:p-6">
        <Scene key={id} />
      </div>
    </div>
  )
}

/** 08 · Demo: SellUp recreado con datos de ejemplo, a pantalla completa. */
export function SellUpDemo() {
  const { t } = useLocale()
  const [openId, setOpenId] = useState<string | null>(null)
  const close = useCallback((id: string | null) => setOpenId(id), [])
  const current = SCENES.find((s) => s.id === openId)
  return (
    <div>
      <p data-reveal className="text-[clamp(1.6rem,1rem+1.8vw,2.6rem)] font-light leading-tight">{t({ es: 'Pruébalo: de la empresa al primer mensaje.', en: 'Try it: from the company to the first message.' })}</p>
      <p data-reveal className="mt-4 max-w-[62ch] leading-relaxed opacity-80">{t({ es: 'SellUp trabaja con datos reales de clientes, así que la demo lo recrea con empresas y personas ficticias. Los pasos, las reglas y las bandejas son los del producto.', en: 'SellUp runs on real customer data, so the demo recreates it with fictional companies and people. The steps, rules and queues are the product’s own.' })}</p>
      <div className="mt-10 grid gap-3 md:grid-cols-3">
        {SCENES.map((s, i) => (
          <button key={s.id} type="button" onClick={() => setOpenId(s.id)} data-reveal="device" className="group relative overflow-hidden rounded-[20px] border border-white/10 bg-[#0b0e14] p-6 text-left text-[#e9ecf3] transition-colors hover:border-[#5b7eff]">
            <span className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-30 blur-3xl transition-opacity duration-700 group-hover:opacity-60" style={{ background: BLUE }} aria-hidden="true" />
            <span className="relative font-mono text-[11px] text-white/45">0{i + 1}</span>
            <span className="relative mt-8 block text-xl">{t(s.title)}</span>
            <span className="relative mt-6 inline-flex items-center gap-2 bg-void/85 px-4 py-2.5 text-paper transition-colors group-hover:bg-signal">
              <span className="mono-label">⤢ {t({ es: 'Abrir a pantalla completa', en: 'Open full screen' })}</span>
            </span>
          </button>
        ))}
      </div>
      <RecordModal
        ids={IDS}
        openId={openId}
        onOpenChange={close}
        title={current ? t(current.title) : 'SellUp'}
        titleLeading={<SellUpMark size={32} />}
        description={t({ es: 'SellUp · datos de ejemplo', en: 'SellUp · sample data' })}
        prevLabel={t({ es: 'Agente anterior', en: 'Previous agent' })}
        nextLabel={t({ es: 'Agente siguiente', en: 'Next agent' })}
        bodyClassName="flex min-h-0 flex-1 flex-col"
      >
        {openId && <DemoApp id={openId} onNav={setOpenId} />}
      </RecordModal>
    </div>
  )
}

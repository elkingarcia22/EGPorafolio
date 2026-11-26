'use client'

import Image from 'next/image'
import { useLocale, type L } from '@/lib/i18n'

interface TryItem {
  label: L
  value: string | L
}

export interface CaseDemoProps {
  /** Frase grande: qué se va a abrir. */
  title: L
  /** Una línea o dos de contexto. */
  lead: L
  /** Lo que se ve en la barra del navegador (sin https://). */
  url: string
  /** Captura de la pantalla real… */
  image?: { src: string; width: number; height: number }
  /** …o una vista propia (Clipper, por ejemplo). */
  preview?: React.ReactNode
  /** Color del proyecto, «r g b». */
  accent: string
  /** Datos para probar (celular, código, frases…). */
  tryIt?: readonly TryItem[]
  /** Abre la demo a pantalla completa. */
  onOpen: () => void
}

/**
 * La demo de cada caso con una sola forma: el texto y un solo botón a la izquierda, la pantalla real en
 * un navegador a la derecha. Toda la tarjeta abre lo mismo que el botón; cada caso pone su propio modal.
 */
export function CaseDemo({ title, lead, url, image, preview, accent, tryIt, onOpen }: CaseDemoProps) {
  const { t } = useLocale()
  const color = `rgb(${accent})`
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-12 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <p data-reveal className="mono-label mb-5 flex items-center gap-2 opacity-70">
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="absolute inset-0 animate-ping rounded-full bg-[#43a970] opacity-70" />
            <span className="relative h-2 w-2 rounded-full bg-[#43a970]" />
          </span>
          {t({ es: 'Demo en vivo', en: 'Live demo' })}
        </p>
        <p data-reveal className="text-[clamp(1.8rem,1rem+2vw,2.8rem)] font-light leading-[1.05] tracking-tight">{t(title)}</p>
        <p data-reveal className="mt-5 max-w-[46ch] leading-relaxed opacity-75">{t(lead)}</p>

        {tryIt && tryIt.length > 0 && (
          <dl data-reveal className="mt-8 divide-y divide-fg/15 border-y border-fg/15">
            {tryIt.map((item) => (
              <div key={item.label.es} className="flex items-baseline justify-between gap-4 py-2.5 text-sm">
                <dt className="opacity-60">{t(item.label)}</dt>
                <dd className="min-w-0 break-words text-right font-mono">{typeof item.value === 'string' ? item.value : t(item.value)}</dd>
              </div>
            ))}
          </dl>
        )}

        <button
          data-reveal
          type="button"
          onClick={onOpen}
          className="group mt-8 inline-flex items-center gap-4 bg-signal px-6 py-4 text-on-signal transition-[transform,box-shadow] duration-500 ease-expo hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-15px_rgb(var(--signal))]"
        >
          <span className="mono-label">{t({ es: 'Ver la demo', en: 'Open the demo' })}</span>
          <span className="transition-transform duration-500 ease-expo group-hover:translate-x-1" aria-hidden="true">⤢</span>
        </button>
      </div>

      <div className="lg:col-span-7">
        <button type="button" onClick={onOpen} tabIndex={-1} aria-hidden="true" data-reveal="device" className="group relative block w-full [perspective:1800px]">
          <span className="pointer-events-none absolute -inset-10 rounded-full opacity-25 blur-3xl transition-opacity duration-700 group-hover:opacity-45" style={{ background: `radial-gradient(closest-side, ${color}, transparent)` }} />
          <span className="relative block overflow-hidden rounded-xl bg-[#0b0c0e] shadow-[0_60px_120px_-40px_rgba(0,0,0,0.85)] ring-1 ring-white/10 transition-transform duration-1000 ease-expo [transform:rotateY(-8deg)_rotateX(4deg)] group-hover:[transform:none]">
            <span className="flex items-center gap-1.5 px-3 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-3 flex h-5 min-w-0 flex-1 items-center gap-2 truncate rounded-md bg-white/[0.06] px-2 font-mono text-[11px] text-white/60">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: color }} />
                {url}
              </span>
            </span>
            <span className="relative block aspect-[16/10] overflow-hidden">
              {image ? (
                <Image src={image.src} width={image.width} height={image.height} alt="" sizes="(min-width: 1024px) 55vw, 100vw" className="block h-full w-full object-cover object-top transition-[filter,transform] duration-700 ease-expo group-hover:scale-[1.02] group-hover:brightness-90" />
              ) : (
                <span className="flex h-full w-full items-center justify-center">{preview}</span>
              )}
            </span>
          </span>
        </button>
      </div>
    </div>
  )
}

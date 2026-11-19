'use client'

import Image from 'next/image'
import { useLocale } from '@/lib/i18n'
import type { CaseImage, ChapterIntro } from '@/lib/content/cases/barberlytics/types'

type Frame = 'browser' | 'phone' | 'plain'

interface ShotProps {
  image: CaseImage
  frame?: Frame
  /** Ancho que ocupará en pantalla, para que Next sirva el tamaño justo */
  sizes?: string
  className?: string
  priority?: boolean
}

/** Captura del producto con su marco (navegador, celular o sin marco) y su pie. */
export function Shot({ image, frame = 'browser', sizes = '(min-width: 768px) 70vw, 100vw', className = '', priority }: ShotProps) {
  const { t } = useLocale()
  const img = (
    <Image
      src={image.src}
      width={image.width}
      height={image.height}
      alt={t(image.alt)}
      sizes={sizes}
      priority={priority}
      className="block h-auto w-full"
    />
  )
  return (
    <figure data-reveal className={className}>
      {frame === 'browser' && (
        <div className="overflow-hidden rounded-[10px] bg-void ring-1 ring-fg/15 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)]">
          <div className="flex items-center gap-1.5 border-b border-paper/10 px-3 py-2" aria-hidden="true">
            <span className="h-2 w-2 rounded-full bg-paper/25" />
            <span className="h-2 w-2 rounded-full bg-paper/25" />
            <span className="h-2 w-2 rounded-full bg-paper/25" />
          </div>
          {img}
        </div>
      )}
      {frame === 'phone' && (
        <div className="overflow-hidden rounded-[28px] bg-void p-1.5 ring-1 ring-fg/20 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.7)]">
          <div className="overflow-hidden rounded-[22px]">{img}</div>
        </div>
      )}
      {frame === 'plain' && <div className="overflow-hidden rounded-[10px] ring-1 ring-fg/10">{img}</div>}
      {image.caption && <figcaption className="mono-label mt-3 opacity-60">{t(image.caption)}</figcaption>}
    </figure>
  )
}

/** Apertura de cada capítulo: pregunta, texto y cifras. */
export function ChapterOpening({ intro }: { intro: ChapterIntro }) {
  const { t } = useLocale()
  return (
    <div className="mb-[clamp(3rem,2rem+4vw,6rem)]">
      <p data-reveal className="max-w-[24ch] text-[clamp(1.8rem,1rem+2.6vw,3.4rem)] font-light leading-[1.08] tracking-tight">
        {t(intro.kicker)}
      </p>
      <p data-reveal className="mt-8 max-w-[62ch] text-lg leading-relaxed opacity-80">
        {t(intro.lead)}
      </p>
      <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden border border-fg/15 bg-fg/15 lg:grid-cols-4">
        {intro.stats.map((s) => (
          <div key={s.label.es} data-reveal className="bg-bg p-5">
            <dt className="sr-only">{t(s.label)}</dt>
            <dd>
              <span className="block text-[clamp(2rem,1.4rem+2vw,3rem)] font-light leading-none text-signal tabular-nums">{s.value}</span>
              <span className="mt-3 block text-sm leading-snug opacity-70">{t(s.label)}</span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

/** Subtítulo numerado dentro de un capítulo: «2.3 · Título». */
export function SubHead({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <h3 data-reveal className="mb-6 flex items-baseline gap-4 text-[clamp(1.35rem,1rem+1vw,1.9rem)] font-normal tracking-tight">
      <span className="mono-label text-signal">{index}</span>
      <span>{children}</span>
    </h3>
  )
}

/** Bloque de subsección con su respiro vertical. */
export function Block({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <section className={`mt-[clamp(4rem,3rem+4vw,7rem)] ${className}`}>{children}</section>
}

/** Texto de apoyo con ancho de lectura. */
export function Body({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <p data-reveal className={`max-w-[62ch] leading-relaxed opacity-80 ${className}`}>
      {children}
    </p>
  )
}

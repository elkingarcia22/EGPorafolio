'use client'

import { Fragment, useEffect, useRef, useState } from 'react'
import { ToneSection } from '@/components/ui/tone-section'
import { SectionLabel } from '@/components/ui/section-label'
import { backdropQuiet } from './backdrop-journey'
import { ScrollTrigger } from '@/lib/motion'
import { useRiseIn } from './use-rise-in'
import { useEnterSequence, type EnterStep } from './use-enter-sequence'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { ContactIcon, useContactChannels, type ContactChannel } from '@/components/ui/contact-channels'
import { COPY } from '@/lib/content/copy'
import { PROFILE } from '@/lib/content/profile'

const COPIED_RESET_MS = 2000

/** Entrada: los canales se conectan uno tras otro, después del titular. */
const ENTER_STEPS: readonly EnterStep[] = [
  { selector: '[data-ct-available]', from: { autoAlpha: 0, y: 12 } },
  { selector: '[data-ct-body]', from: { autoAlpha: 0, y: 20 }, at: 0.25 },
  { selector: '[data-ct-channel]', from: { autoAlpha: 0, y: 30, scale: 0.94, filter: 'blur(6px)' }, at: 0.35 },
]
/** Mientras se ve el cierre, el fondo se calma un poco */
const QUIET_LEVEL = 0.6

/** Canal de contacto: tarjeta de vidrio con su ícono en una neurona que se enciende al pasar. */
function ChannelCard({ channel, index }: { channel: ContactChannel; index: number }) {
  const { t } = useLocale()
  return (
    <li data-ct-channel className="flex">
      <a
        href={channel.href}
        target={channel.external ? '_blank' : undefined}
        rel={channel.external ? 'noopener noreferrer' : undefined}
        data-cursor="↗"
        className="group relative flex w-full flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-7 text-center backdrop-blur-sm transition-[border-color,background-color,transform,box-shadow] duration-500 ease-expo hover:-translate-y-1 hover:border-white/30 hover:bg-white/[0.06] hover:shadow-[0_24px_60px_-24px_rgb(var(--signal)/0.6)] focus-visible:-translate-y-1 focus-visible:border-white/30"
      >
        <span className="mono-label absolute left-4 top-4 opacity-35">0{index + 1}</span>
        {/* El ícono en una neurona: el halo se enciende al pasar */}
        <span className="relative grid h-14 w-14 place-items-center rounded-full border border-white/15 bg-[rgb(var(--void)/0.6)] transition-[border-color,box-shadow] duration-500 ease-expo group-hover:border-white/40 group-hover:shadow-[0_0_0_6px_rgb(var(--signal)/0.12),0_0_28px_6px_rgb(var(--signal)/0.45)]">
          <ContactIcon name={channel.icon} className="h-6 w-6" />
        </span>
        <span className="min-w-0">
          <span className="mono-label block opacity-55">{t(channel.label)}</span>
          <span className="mt-1.5 block text-sm leading-snug text-paper/85 [overflow-wrap:anywhere] md:text-base">
            {/* El correo parte antes de la @, nunca a mitad de palabra */}
            {channel.value.split('@').map((part, i) => (i === 0 ? part : <Fragment key={i}><wbr />@{part}</Fragment>))}
          </span>
        </span>
        <span aria-hidden="true" className="text-lg opacity-50 transition-all duration-500 ease-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100">↗</span>
      </a>
    </li>
  )
}

/**
 * Contacto: el cierre de la red. La luz azul baja hasta «05 · Contacto»
 * (como en Enfoque); debajo, centrados, el titular, una frase y
 * los canales directos (correo, llamada, WhatsApp, LinkedIn) como tarjetas de
 * vidrio.
 */
export function Contact() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const [copied, setCopied] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLSpanElement>(null)
  const title = t(COPY.contact.title).toUpperCase()
  useRiseIn(titleRef, reducedMotion)
  useEnterSequence(rootRef, ENTER_STEPS, reducedMotion)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), COPIED_RESET_MS)
    } catch {
      // Sin permiso de portapapeles: el correo sigue visible como enlace.
    }
  }

  const channels = useContactChannels()

  // El fondo se calma un poco mientras se ve el cierre.
  useEffect(() => {
    const root = rootRef.current
    if (!root || reducedMotion) return
    const trigger = ScrollTrigger.create({
      trigger: root,
      start: 'top 70%',
      end: 'bottom top',
      onToggle: (self) => backdropQuiet.set('contact', self.isActive ? QUIET_LEVEL : 0),
    })
    return () => {
      trigger.kill()
      backdropQuiet.set('contact', 0)
    }
  }, [reducedMotion])

  return (
    <ToneSection tone="dark" as="footer" id="contact" className="px-[var(--gutter)] pb-10 pt-[clamp(5rem,3rem+8vw,10rem)]">
      <div ref={rootRef} className="mx-auto flex max-w-5xl flex-col items-center text-center">
        {/* La luz azul nace detrás del chat del agente y baja hasta esta etiqueta */}
        <SectionLabel index="05" threadFrom="[data-ag-panel]" className="mb-10">{t(COPY.contact.label)}</SectionLabel>

        <p data-ct-available className="mono-label mb-6 flex items-center gap-2 text-signal">
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
          </span>
          {t(COPY.contact.available)}
        </p>
        <h2 className="text-[clamp(2.8rem,0.5rem+7vw,7.5rem)] font-medium leading-[0.85] tracking-[0.06em]">
          <span ref={titleRef} className="inline-block">{title}</span>
          <span className="text-signal">.</span>
        </h2>
        <p data-ct-body className="mt-6 max-w-md leading-relaxed opacity-70">{t(COPY.contact.body)}</p>

        <ul className="mt-12 grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {channels.map((channel, i) => (
            <ChannelCard key={channel.icon} channel={channel} index={i} />
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm">
          <button type="button" onClick={copy} className="mono-label opacity-60 underline-offset-4 hover:underline hover:opacity-100" aria-live="polite">
            {copied ? `✓ ${t(COPY.contact.copied)}` : t(COPY.contact.copy)}
          </button>
          <span className="opacity-60">{t(PROFILE.location)}</span>
        </div>
      </div>

      <div className="mx-auto mt-24 flex max-w-6xl flex-col items-center gap-2 border-t border-white/10 pt-6 text-xs opacity-50 md:flex-row md:justify-between">
        <span className="mono-label">© {PROFILE.currentYear} Elkin Garcia</span>
        <span className="mono-label">{t(COPY.footer.built)}</span>
      </div>
    </ToneSection>
  )
}

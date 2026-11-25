'use client'

import { useLocale } from '@/lib/i18n'
import { PROFILE } from '@/lib/content/profile'
import { ContactIcon } from '@/components/ui/contact-channels'

/**
 * 07 · Demo: SellUp trabaja sobre el CRM y los datos comerciales de UBITS,
 * así que no tiene una demo pública. El nodo que recibe la fibra de «Impacto»
 * invita a verlo en vivo, por correo o WhatsApp.
 */
export function SellUpDemo() {
  const { t } = useLocale()
  const subject = t({ es: 'Demostración en vivo · SellUp', en: 'Live demo · SellUp' })
  const message = t({ es: 'Hola Elkin, quiero ver SellUp en vivo.', en: 'Hi Elkin, I’d like to see SellUp live.' })
  const mail = `mailto:${PROFILE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`
  const whatsapp = `https://wa.me/${PROFILE.phone}?text=${encodeURIComponent(message)}`

  return (
    <div className="mx-auto flex max-w-[640px] flex-col items-center text-center">
      {/* El nodo: late, como una señal que espera respuesta */}
      <span aria-hidden="true" className="relative grid h-16 w-16 place-items-center">
        <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgb(var(--signal)/0.35),transparent_70%)]" />
        <span className="absolute inset-2 rounded-full border border-signal/50 animate-[nav-node-ping_2.4s_cubic-bezier(0,0,.2,1)_infinite]" />
        <span className="relative h-4 w-4 rounded-full border border-white bg-[#fffaf0] shadow-[0_0_0_5px_rgb(var(--signal)/0.25),0_0_24px_6px_rgb(var(--signal)/0.7)]" />
      </span>

      <h3 className="mt-8 text-balance text-[clamp(1.6rem,1.1rem+1.8vw,2.6rem)] font-light leading-[1.1] tracking-tight">
        {t({ es: 'Míralo en vivo.', en: 'See it live.' })}
      </h3>
      <p className="mt-4 max-w-[52ch] text-balance text-base leading-relaxed text-paper/65 md:text-lg">
        {t({
          es: 'SellUp trabaja con el CRM y los datos comerciales de UBITS, así que no se muestra aquí. Te lo enseño en una demostración en vivo.',
          en: 'SellUp runs on UBITS’ CRM and sales data, so it isn’t shown here. I’ll walk you through it in a live demo.',
        })}
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <a
          href={mail}
          className="group inline-flex items-center gap-3 rounded-full bg-signal py-2.5 pl-3 pr-5 text-on-signal shadow-[0_0_30px_-6px_rgb(var(--signal)/0.8)] transition-transform duration-300 ease-expo hover:-translate-y-0.5"
        >
          <ContactIcon name="mail" className="h-5 w-5" />
          <span className="text-sm font-medium">{t({ es: 'Agendar una demostración', en: 'Book a demo' })}</span>
        </a>
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/[0.04] py-2.5 pl-3 pr-5 text-sm text-paper/85 transition-colors duration-300 hover:border-white/40 hover:text-paper"
        >
          <ContactIcon name="whatsapp" className="h-5 w-5" />
          {t({ es: 'Escribirme por WhatsApp', en: 'Message me on WhatsApp' })}
        </a>
      </div>
    </div>
  )
}

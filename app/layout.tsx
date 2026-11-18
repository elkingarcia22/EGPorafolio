import type { Metadata, Viewport } from 'next'
import { Jost, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { LocaleProvider } from '@/lib/i18n'
import { A11yProvider } from '@/lib/a11y'
import { SmoothScroll } from '@/components/providers/smooth-scroll'
import { SiteHeader } from '@/components/ui/site-header'
import { Cursor } from '@/components/ui/cursor'
import { TransitionOverlay } from '@/components/transition/page-transition'

// Jost: geométrica tipo Futura, como la hoja de vida.
const display = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Elkin Garcia — Diseñador UX/UI que construye con IA',
  description:
    'Portafolio de Elkin Garcia: Senior Product & UX/UI Designer. De puntos sueltos a producto: investigación, diseño, sistemas y productos construidos con IA.',
  authors: [{ name: 'Elkin Garcia' }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0b0d',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" data-tone="dark" className={`${display.variable} ${mono.variable}`}>
      <body>
        <LocaleProvider>
          <A11yProvider>
            <a
              href="#main"
              className="sr-only-focusable fixed left-4 top-4 z-[90] bg-signal px-4 py-2 text-paper"
            >
              Saltar al contenido / Skip to content
            </a>
            <SmoothScroll />
            <SiteHeader />
            <main id="main">{children}</main>
            <TransitionOverlay />
            <Cursor />
            <div className="grain" aria-hidden="true" />
          </A11yProvider>
        </LocaleProvider>
      </body>
    </html>
  )
}

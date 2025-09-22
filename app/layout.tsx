import type { Metadata, Viewport } from 'next'
import { Inter, Poppins, Montserrat } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { LanguageProvider } from '@/contexts/language-context'

const inter = Inter({ subsets: ['latin'] })
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins'
})
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-montserrat'
})

export const metadata: Metadata = {
  title: 'Portfolio UX/UI Designer',
  description: 'Portfolio profesional de diseñador UX/UI con estilo neomorfismo',
  keywords: ['UX', 'UI', 'Design', 'Portfolio', 'Neomorphism'],
  authors: [{ name: 'Elkin Mac' }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
      return (
        <html lang="es" suppressHydrationWarning>
          <body className={`${inter.className} ${poppins.variable} ${montserrat.variable}`}>
            <svg width="0" height="0" style={{ position: 'absolute' }}>
              <defs>
                <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3498db" />
                  <stop offset="20%" stopColor="#5dade2" />
                  <stop offset="40%" stopColor="#1abc9c" />
                  <stop offset="60%" stopColor="#2ecc71" />
                  <stop offset="100%" stopColor="#3498db" />
                </linearGradient>
              </defs>
            </svg>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              <LanguageProvider>
                {children}
              </LanguageProvider>
            </ThemeProvider>
          </body>
        </html>
      )
}

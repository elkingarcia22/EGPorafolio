import type { Metadata, Viewport } from 'next'
import { Inter, Poppins, Montserrat } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'

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
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </body>
        </html>
      )
}

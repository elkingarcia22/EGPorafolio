import { DM_Sans, Fraunces, Inter, Plus_Jakarta_Sans, Space_Grotesk } from 'next/font/google'

/*
 * Familias del sistema Thema para la muestra tipográfica del caso. Sin precarga:
 * solo se descargan cuando la sección aparece.
 */
const fraunces = Fraunces({ subsets: ['latin'], weight: ['400', '600'], display: 'swap', preload: false })
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['400', '700'], display: 'swap', preload: false })
const inter = Inter({ subsets: ['latin'], weight: ['400', '600'], display: 'swap', preload: false })
const grotesk = Space_Grotesk({ subsets: ['latin'], weight: ['400', '600'], display: 'swap', preload: false })
const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '600'], display: 'swap', preload: false })

export const SPECIMEN_FONTS = [
  { name: 'Fraunces', role: 'Títulos · editorial', className: fraunces.className },
  { name: 'Plus Jakarta Sans', role: 'Cuerpo · Premium', className: jakarta.className },
  { name: 'Inter', role: 'Cuerpo · por defecto', className: inter.className },
  { name: 'Space Grotesk', role: 'Cuerpo · técnica', className: grotesk.className },
  { name: 'DM Sans', role: 'Cuerpo · amable', className: dmSans.className },
] as const

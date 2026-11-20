import localFont from 'next/font/local'

/*
 * Familias del sistema Thema para la muestra tipográfica del caso. Sin precarga:
 * solo se descargan cuando la sección aparece.
 */
const fraunces = localFont({ src: '../../../../app/fonts/fraunces.woff2', weight: '100 900', display: 'swap', preload: false })
const jakarta = localFont({ src: '../../../../app/fonts/plus-jakarta-sans.woff2', weight: '200 800', display: 'swap', preload: false })
const inter = localFont({ src: '../../../../app/fonts/inter.woff2', weight: '100 900', display: 'swap', preload: false })
const grotesk = localFont({ src: '../../../../app/fonts/space-grotesk.woff2', weight: '300 700', display: 'swap', preload: false })
const dmSans = localFont({ src: '../../../../app/fonts/dm-sans.woff2', weight: '100 1000', display: 'swap', preload: false })

export const SPECIMEN_FONTS = [
  { name: 'Fraunces', role: 'Títulos · editorial', className: fraunces.className },
  { name: 'Plus Jakarta Sans', role: 'Cuerpo · Premium', className: jakarta.className },
  { name: 'Inter', role: 'Cuerpo · por defecto', className: inter.className },
  { name: 'Space Grotesk', role: 'Cuerpo · técnica', className: grotesk.className },
  { name: 'DM Sans', role: 'Cuerpo · amable', className: dmSans.className },
] as const

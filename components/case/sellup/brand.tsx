import localFont from 'next/font/local'

/**
 * La marca de SellUp tal como está en el producto (repo SellUp, `app-sidebar.tsx` y `globals.css`): la palabra va en
 * Inter negrita con tracking apretado y «Up» en el color de marca; el ícono es la U imán sobre el degradado de marca.
 * Inter es una tercera familia en el portafolio, pero solo para la palabra: es la tipografía real del producto.
 */
const inter = localFont({ src: '../../../app/fonts/inter.woff2', weight: '100 900', display: 'swap' })

type Tone = 'light' | 'dark'

/** `--su-brand` y `--brand-gradient` del producto, en tema claro (Azul) y oscuro. */
export const SU_BRAND: Record<Tone, string> = {
  light: 'oklch(0.52 0.233 261.971)',
  dark: 'oklch(0.69 0.16 266.043)',
}
const BRAND_GRADIENT: Record<Tone, string> = {
  light: 'linear-gradient(135deg, oklch(0.64 0.19 261.971) 0%, oklch(0.52 0.233 261.971) 52%, oklch(0.44 0.2 261.971) 100%)',
  dark: 'linear-gradient(135deg, oklch(0.78 0.12 266.043) 0%, oklch(0.69 0.16 266.043) 52%, oklch(0.58 0.2 266.043) 100%)',
}

interface MarkProps {
  size?: number
  tone?: Tone
  className?: string
}

/** El logo «U imán»: la U de «Up» atrae tres puntos que bajan creciendo. Baldosa con radio de 12/48, como `icon.svg`. */
export function SellUpMark({ size = 32, tone = 'dark', className = '' }: MarkProps) {
  return (
    <span
      className={`inline-grid shrink-0 place-items-center text-white ${className}`}
      style={{ width: size, height: size, borderRadius: '25%', backgroundImage: BRAND_GRADIENT[tone] }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeLinecap="round" style={{ width: '72%', height: '72%' }}>
        <path d="M14 22 V30 A10 10 0 0 0 34 30 V22" strokeWidth="7" />
        <path d="M14 15 V19.5 M34 15 V19.5" strokeWidth="7" opacity="0.55" />
        <circle cx="24" cy="5.4" r="1.9" fill="currentColor" stroke="none" opacity="0.6" />
        <circle cx="24" cy="12" r="2.6" fill="currentColor" stroke="none" />
        <circle cx="24" cy="21" r="3.2" fill="currentColor" stroke="none" />
      </svg>
    </span>
  )
}

/**
 * La palabra «SellUp» del logotipo completo: la U imán reemplaza a la letra y queda «Sell·U·p». Medidas de
 * `.magnet-word` (repo SellUp, `logo-propuestas`): 700 con tracking −0,04em, la U de 0,82 × 1,05em bajada 0,12em y
 * la «p» en 800, ambas en el color de marca. Hereda el tamaño y el color de «Sell» del contenedor.
 */
export function SellUpWordmark({ tone = 'dark', className = '' }: { tone?: Tone; className?: string }) {
  const brand = SU_BRAND[tone]
  return (
    <span className={`${inter.className} inline-flex items-baseline font-bold tracking-[-0.04em] ${className}`} aria-label="SellUp" role="img">
      <span aria-hidden="true">Sell</span>
      <svg viewBox="0 0 24 30" fill="none" stroke={brand} strokeLinecap="round" aria-hidden="true" className="mx-[0.02em] h-[1.05em] w-[0.82em] shrink-0 translate-y-[0.12em]">
        <path d="M5 13 V19 A7 7 0 0 0 19 19 V13" strokeWidth="4.6" />
        <path d="M5 7.5 V10 M19 7.5 V10" strokeWidth="4.6" opacity="0.5" />
        <circle cx="12" cy="5" r="1.8" fill={brand} stroke="none" />
        <circle cx="12" cy="11.5" r="2.3" fill={brand} stroke="none" />
      </svg>
      <span aria-hidden="true" className="font-extrabold" style={{ color: brand }}>p</span>
    </span>
  )
}

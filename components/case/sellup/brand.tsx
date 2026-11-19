import { Inter } from 'next/font/google'

/**
 * La marca de SellUp tal como está en el producto (repo SellUp, `app-sidebar.tsx` y `globals.css`): la palabra va en
 * Inter negrita con tracking apretado y «Up» en el color de marca; el ícono es la U imán sobre el degradado de marca.
 * Inter es una tercera familia en el portafolio, pero solo para la palabra: es la tipografía real del producto.
 */
const inter = Inter({ subsets: ['latin'], weight: ['700'], display: 'swap' })

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

/** La palabra «SellUp»: hereda el tamaño y el color de «Sell» del contenedor. */
export function SellUpWordmark({ tone = 'dark', className = '' }: { tone?: Tone; className?: string }) {
  return (
    <span className={`${inter.className} font-bold tracking-tight ${className}`}>
      Sell<span style={{ color: SU_BRAND[tone] }}>Up</span>
    </span>
  )
}

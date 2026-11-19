/** Utilidades de color: lo que el sistema deriva de un solo primario. */

export function toRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace('#', ''), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

export function toHsl(hex: string): [number, number, number] {
  const [r, g, b] = toRgb(hex).map((v) => v / 255)
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return [0, 0, l * 100]
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  const h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4
  return [h * 60, s * 100, l * 100]
}

/** El fin del gradiente de IA: el primario girado 120° en el círculo cromático. */
export function aiEndFrom(hex: string, dark: boolean): string {
  const [h, s] = toHsl(hex)
  return `hsl(${(h + 120) % 360} ${Math.max(s, 86)}% ${dark ? 58 : 50}%)`
}

/** Texto encima del primario: blanco o tinta, según la luminancia. */
export function inkOn(hex: string): string {
  const [r, g, b] = toRgb(hex).map((v) => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.45 ? '#16130f' : '#ffffff'
}

export function withAlpha(hex: string, a: number): string {
  const [r, g, b] = toRgb(hex)
  return `rgba(${r}, ${g}, ${b}, ${a})`
}

/** Mezcla con blanco (t > 0) o negro (t < 0). */
export function shade(hex: string, t: number): string {
  const [r, g, b] = toRgb(hex)
  const target = t > 0 ? 255 : 0
  const a = Math.abs(t)
  const c = (v: number) => Math.round(v + (target - v) * a).toString(16).padStart(2, '0')
  return `#${c(r)}${c(g)}${c(b)}`
}

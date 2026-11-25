/**
 * Paletas de prueba para la "señal". Cada una define cuatro tonos (canales RGB
 * separados por espacio, como el resto de tokens):
 * - signal: color principal de la atmósfera (canvas, nubes y halos de fondo)
 * - ui: color sólido de los elementos (botones, nodos, líneas activas). Si no
 *   se define, es el mismo `signal`. Sirve cuando un tono luce bien difuso en
 *   el fondo pero chillón como relleno sólido.
 * - spark: chispa / acento secundario (antes el magenta)
 * - ice: versión clara del principal, para halos y bordes
 * - cyan: tono de apoyo para fibras y estelas
 * - projects: tono de cada proyecto en el inicio, para que armonicen con la
 *   paleta (si no se define, cada proyecto usa su color de marca)
 */
export interface Palette {
  id: string
  name: string
  signal: string
  ui?: string
  spark: string
  ice: string
  cyan: string
  projects?: Readonly<Record<ProjectSlug, string>>
}

export type ProjectSlug = 'objetivos' | 'barberlytics' | 'sellup' | 'encuestas'
const PROJECT_SLUGS: readonly ProjectSlug[] = ['objetivos', 'barberlytics', 'sellup', 'encuestas']

/** Color de un proyecto en el inicio: sigue a la paleta activa. */
export function projectTone(slug: string): string {
  return `var(--project-${slug})`
}

export const PALETTES: readonly Palette[] = [
  { id: 'original', name: 'Azul · Magenta', signal: '64 96 255', spark: '255 84 170', ice: '150 190 255', cyan: '110 220 255' },
  // Colores de IA de Clipper (tema Premium dorado de Barberlytics): cobre y petróleo
  { id: 'clipper', name: 'Clipper · Dorado', signal: '222 140 58', ui: '217 179 106', spark: '46 156 176', ice: '240 206 134', cyan: '127 211 227',
    projects: { objetivos: '217 179 106', barberlytics: '222 140 58', sellup: '63 114 216', encuestas: '46 156 176' } },
  { id: 'azul-amarillo', name: 'Azul · Amarillo', signal: '36 104 255', spark: '255 210 40', ice: '150 196 255', cyan: '255 232 130',
    projects: { objetivos: '36 104 255', barberlytics: '255 196 56', sellup: '120 160 255', encuestas: '80 190 255' } },
  { id: 'ambar', name: 'Ámbar · Turquesa', signal: '255 138 36', spark: '32 214 190', ice: '255 204 150', cyan: '255 226 120',
    projects: { objetivos: '255 138 36', barberlytics: '255 190 90', sellup: '32 214 190', encuestas: '120 200 230' } },
  { id: 'esmeralda', name: 'Esmeralda · Coral', signal: '24 196 128', spark: '255 108 88', ice: '150 236 196', cyan: '170 255 150',
    projects: { objetivos: '24 196 128', barberlytics: '255 108 88', sellup: '110 220 190', encuestas: '255 170 120' } },
  { id: 'rojo', name: 'Rojo señal · Oro', signal: '240 56 64', spark: '255 196 56', ice: '255 170 166', cyan: '255 222 150',
    projects: { objetivos: '240 56 64', barberlytics: '255 196 56', sellup: '255 120 110', encuestas: '255 160 70' } },
  { id: 'lima', name: 'Lima · Cian', signal: '150 220 30', ui: '78 196 204', spark: '0 214 255', ice: '214 250 160', cyan: '120 240 255',
    projects: { objetivos: '78 196 204', barberlytics: '176 212 120', sellup: '96 156 232', encuestas: '60 170 150' } },
] as const

export const DEFAULT_PALETTE_ID = 'clipper'
const STORAGE_KEY = 'eg-palette'
export const PALETTE_EVENT = 'eg:palettechange'

export function findPalette(id: string | null | undefined): Palette {
  return PALETTES.find((p) => p.id === id) ?? PALETTES[0]
}

export function readStoredPaletteId(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? DEFAULT_PALETTE_ID
  } catch {
    return DEFAULT_PALETTE_ID
  }
}

/** Pone los tokens en <html>, la guarda y avisa a los canvas. */
export function applyPalette(id: string): Palette {
  const palette = findPalette(id)
  const root = document.documentElement
  root.dataset.palette = palette.id
  root.style.setProperty('--signal', palette.ui ?? palette.signal)
  root.style.setProperty('--glow', palette.signal)
  root.style.setProperty('--spark', palette.spark)
  root.style.setProperty('--ice', palette.ice)
  root.style.setProperty('--cyan', palette.cyan)
  for (const slug of PROJECT_SLUGS) {
    const tone = palette.projects?.[slug]
    if (tone) root.style.setProperty(`--project-${slug}`, tone)
    else root.style.removeProperty(`--project-${slug}`)
  }
  try {
    localStorage.setItem(STORAGE_KEY, palette.id)
  } catch {
    /* sin almacenamiento: la paleta dura solo esta visita */
  }
  window.dispatchEvent(new CustomEvent<Palette>(PALETTE_EVENT, { detail: palette }))
  return palette
}

/** "64 96 255" → "64,96,255" (formato que usan los canvas) */
export function toCanvasRgb(channels: string): string {
  return channels.trim().split(/\s+/).join(',')
}

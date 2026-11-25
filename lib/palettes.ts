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
  // La de SellUp: el azul eléctrico con el magenta/violeta del comienzo
  { id: 'original', name: 'Azul · Magenta', signal: '64 96 255', spark: '255 84 170', ice: '150 190 255', cyan: '110 220 255',
    projects: { objetivos: '64 96 255', barberlytics: '232 140 48', sellup: '91 126 255', encuestas: '12 91 239' } },
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
  // La de Objetivos: azul de UBITS con violeta y rosado, los tonos de sus gráficos
  { id: 'objetivos', name: 'Azul · Violeta', signal: '123 92 255', ui: '79 134 255', spark: '255 84 170', ice: '169 190 255', cyan: '190 150 255',
    projects: { objetivos: '79 134 255', barberlytics: '232 140 48', sellup: '91 126 255', encuestas: '12 91 239' } },
  { id: 'lima', name: 'Lima · Cian', signal: '150 220 30', ui: '78 196 204', spark: '0 214 255', ice: '214 250 160', cyan: '120 240 255',
    projects: { objetivos: '78 196 204', barberlytics: '176 212 120', sellup: '96 156 232', encuestas: '60 170 150' } },
] as const

/** Paleta del inicio y de las páginas que no son de un proyecto. */
export const HOME_PALETTE_ID = 'clipper'

/** Cada proyecto tiene su propia paleta; al entrar a él, la página cambia de color. */
export const PROJECT_PALETTE: Readonly<Record<ProjectSlug, string>> = {
  sellup: 'original',
  barberlytics: 'clipper',
  objetivos: 'objetivos',
  encuestas: 'azul-amarillo',
}

export const PALETTE_EVENT = 'eg:palettechange'

export function findPalette(id: string | null | undefined): Palette {
  return PALETTES.find((p) => p.id === id) ?? PALETTES[0]
}

/** La paleta que corresponde a una ruta: /proyectos/<slug>/… usa la del proyecto. */
export function paletteForPath(pathname: string): Palette {
  const slug = /^\/proyectos\/([^/?#]+)/.exec(pathname)?.[1] as ProjectSlug | undefined
  return findPalette((slug && PROJECT_PALETTE[slug]) || HOME_PALETTE_ID)
}

type Rgb = readonly [number, number, number]

/** Tokens ya resueltos, en números, para poder mezclar dos paletas. */
export interface PaletteTokens {
  signal: Rgb
  glow: Rgb
  spark: Rgb
  ice: Rgb
  cyan: Rgb
  projects: Readonly<Record<ProjectSlug, Rgb>>
}

function parse(channels: string): Rgb {
  const [r, g, b] = channels.trim().split(/\s+/).map(Number)
  return [r, g, b]
}

export function tokensOf(palette: Palette): PaletteTokens {
  const projects = Object.fromEntries(
    PROJECT_SLUGS.map((slug) => [slug, parse(palette.projects?.[slug] ?? palette.ui ?? palette.signal)]),
  ) as Record<ProjectSlug, Rgb>
  return {
    signal: parse(palette.ui ?? palette.signal),
    glow: parse(palette.signal),
    spark: parse(palette.spark),
    ice: parse(palette.ice),
    cyan: parse(palette.cyan),
    projects,
  }
}

function mix(a: Rgb, b: Rgb, t: number): Rgb {
  return [0, 1, 2].map((i) => Math.round(a[i] + (b[i] - a[i]) * t)) as unknown as Rgb
}

/** Mezcla dos paletas (t = 0 → a, t = 1 → b). */
export function blendTokens(a: PaletteTokens, b: PaletteTokens, t: number): PaletteTokens {
  const projects = Object.fromEntries(PROJECT_SLUGS.map((slug) => [slug, mix(a.projects[slug], b.projects[slug], t)])) as Record<ProjectSlug, Rgb>
  return {
    signal: mix(a.signal, b.signal, t),
    glow: mix(a.glow, b.glow, t),
    spark: mix(a.spark, b.spark, t),
    ice: mix(a.ice, b.ice, t),
    cyan: mix(a.cyan, b.cyan, t),
    projects,
  }
}

function luminance([r, g, b]: Rgb): number {
  const lin = (v: number) => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

/** Texto sobre un relleno de señal: oscuro si el color es claro, blanco si es oscuro. */
function onSignal(signal: Rgb): string {
  const l = luminance(signal)
  const withDark = (l + 0.05) / (luminance([10, 11, 13]) + 0.05)
  const withWhite = 1.05 / (l + 0.05)
  return withDark >= withWhite ? '10 11 13' : '255 255 255'
}

const css = (c: Rgb) => c.join(' ')

const TOKEN_VARS = ['--signal', '--on-signal', '--glow', '--spark', '--ice', '--cyan', ...PROJECT_SLUGS.map((slug) => `--project-${slug}`)]

/**
 * Pone los tokens en <html> (o solo en `scope`) y avisa a los canvas.
 * Cambiar las variables en <html> recalcula los estilos de toda la página: mientras la
 * cortina de transición la tapa, los pasos intermedios se pintan solo en la cortina.
 */
export function applyTokens(tokens: PaletteTokens, scope?: readonly HTMLElement[]): void {
  const values = [css(tokens.signal), onSignal(tokens.signal), css(tokens.glow), css(tokens.spark), css(tokens.ice), css(tokens.cyan), ...PROJECT_SLUGS.map((slug) => css(tokens.projects[slug]))]
  for (const el of scope ?? [document.documentElement]) {
    TOKEN_VARS.forEach((name, i) => el.style.setProperty(name, values[i]))
  }
  window.dispatchEvent(new CustomEvent<PaletteTokens>(PALETTE_EVENT, { detail: tokens }))
}

/** Quita los tokens puestos en `scope`: vuelven a heredar los de <html>. */
export function clearScopedTokens(scope: readonly HTMLElement[]): void {
  for (const el of scope) TOKEN_VARS.forEach((name) => el.style.removeProperty(name))
}

/**
 * Los tokens de la paleta del inicio como variables CSS: el encabezado los fija en su raíz para
 * verse siempre igual, aunque la página cambie de paleta al entrar a un proyecto.
 */
export function homePaletteVars(): Record<string, string> {
  const tokens = tokensOf(findPalette(HOME_PALETTE_ID))
  const vars: Record<string, string> = {
    '--signal': css(tokens.signal),
    '--on-signal': onSignal(tokens.signal),
    '--glow': css(tokens.glow),
    '--spark': css(tokens.spark),
    '--ice': css(tokens.ice),
    '--cyan': css(tokens.cyan),
  }
  for (const slug of PROJECT_SLUGS) vars[`--project-${slug}`] = css(tokens.projects[slug])
  return vars
}

/** [64, 96, 255] → "64,96,255" (formato que usan los canvas) */
export function toCanvasRgb(c: Rgb): string {
  return c.join(',')
}

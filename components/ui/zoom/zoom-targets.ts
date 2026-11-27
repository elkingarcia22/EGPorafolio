/**
 * Qué se puede ampliar en una página de proyecto (pantallas del producto y tableros de bocetos)
 * y la galería que forman, en el orden en que aparecen, para pasar de una a otra en el visor.
 */

/** Los tableros de bocetos (y otras piezas dibujadas) que se pueden ampliar */
export const ZOOMABLE = '[data-zoomable]'
/** El visor abierto: lo que se toca ahí dentro no vuelve a abrirlo */
export const VIEWER = '[data-zoom-viewer]'
/** Las pantallas de los productos viven en esta carpeta */
const SCREENS_PATH = '/cases/'
/** Imágenes más angostas que esto (px) son íconos o adornos, no pantallas */
const MIN_WIDTH = 100
/** Miniaturas dentro de un selector (más angostas que esto, px): su toque elige, no amplía */
const THUMB_MAX_WIDTH = 220
/** Opacidad mínima para considerar que una pantalla se está viendo */
const VISIBLE_OPACITY = 0.3
/** Lo que se puede tocar encima de una pantalla (flechas, botones): esos toques no la abren */
const INTERACTIVE = 'button, a, input, select, textarea, [role="tab"], [role="button"]'

/** Lo que se amplía: una imagen (a su resolución original) o una copia de un tablero dibujado */
export type Shot = { kind: 'img'; src: string; alt: string } | { kind: 'node'; node: HTMLElement; w: number; h: number; alt: string }

/** Una pieza de la galería: `key` la identifica (la ruta de la imagen o el tablero) y `shot` la prepara al mostrarla */
export interface GalleryItem {
  key: string | HTMLElement
  /** Cómo se nombra al mostrarla (el texto alternativo de la imagen o el nombre del tablero) */
  alt: string
  shot: () => Shot
}

/** La imagen original (sin el redimensionado de next/image), para verla nítida al acercar. */
function originalSrc(img: HTMLImageElement): string {
  const src = img.currentSrc || img.src
  try {
    const url = new URL(src, window.location.href)
    const raw = url.pathname.startsWith('/_next/image') ? url.searchParams.get('url') : null
    return raw ?? src
  } catch {
    return src
  }
}

/** ¿Es una pantalla de producto? (de la carpeta de casos y de buen tamaño) */
function isScreenshot(img: HTMLImageElement): boolean {
  if (img.getBoundingClientRect().width < MIN_WIDTH) return false
  // Dentro de un enlace (la tarjeta de un proyecto) el toque abre ese proyecto, no el visor.
  if (img.closest('a')) return false
  return decodeURIComponent(img.currentSrc || img.src).includes(SCREENS_PATH)
}

/** ¿Es la miniatura de un selector? (una imagen pequeña dentro de un botón) */
function isThumbnail(img: HTMLImageElement): boolean {
  return img.getBoundingClientRect().width < THUMB_MAX_WIDTH && !!img.closest('button, [role="tab"], [role="button"]')
}

/** ¿Se ve? (ni oculta ni casi transparente, sumando la opacidad de lo que la contiene) */
function isShown(el: Element): boolean {
  let opacity = 1
  for (let node: Element | null = el; node && node !== document.body; node = node.parentElement) {
    const style = getComputedStyle(node)
    if (style.visibility === 'hidden' || style.display === 'none') return false
    opacity *= Number(style.opacity)
  }
  return opacity >= VISIBLE_OPACITY
}

/**
 * Pantallas que no reciben clics (`pointer-events: none`, para no estorbar a la animación que tienen
 * encima): la última visible bajo el punto, que es la que queda al frente.
 */
function hiddenScreenshotAt(x: number, y: number): HTMLImageElement | null {
  const found = Array.from(document.querySelectorAll<HTMLImageElement>('main img')).filter((img) => {
    if (getComputedStyle(img).pointerEvents !== 'none' || !isScreenshot(img)) return false
    const r = img.getBoundingClientRect()
    return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom && isShown(img)
  })
  return found.at(-1) ?? null
}

/**
 * La pantalla que quedó bajo el dedo, aunque encima haya una capa decorativa (un velo, un
 * marco). Si lo tocado es un botón o un enlace que no la contiene, el toque es de ese control.
 */
function screenshotAt(e: MouseEvent): HTMLImageElement | null {
  const target = e.target instanceof Element ? e.target : null
  if (!target) return null
  const img =
    (target instanceof HTMLImageElement && isScreenshot(target) ? target : null) ??
    document.elementsFromPoint(e.clientX, e.clientY).find((el): el is HTMLImageElement => el instanceof HTMLImageElement && isScreenshot(el)) ??
    hiddenScreenshotAt(e.clientX, e.clientY)
  if (!img) return null
  const control = target.closest(INTERACTIVE)
  // Un botón que no la contiene se queda con el clic; una lámina que la contiene se amplía (las
  // miniaturas de un selector, no: esas eligen).
  if (control && (!control.contains(img) || isThumbnail(img))) return null
  return img
}

/** Copia estática de un tablero dibujado, con todo lo animado ya en su sitio */
function boardCopy(board: HTMLElement): HTMLElement {
  const copy = board.cloneNode(true) as HTMLElement
  copy.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    el.style.opacity = '1'
    el.style.visibility = 'visible'
    el.style.transform = 'none'
  })
  copy.querySelectorAll<SVGElement>('[data-draw]').forEach((el) => {
    el.style.strokeDashoffset = '0'
  })
  copy.style.width = `${board.offsetWidth}px`
  copy.style.minWidth = '0'
  copy.style.margin = '0'
  return copy
}

function imageItem(img: HTMLImageElement): GalleryItem {
  const src = originalSrc(img)
  const alt = img.alt
  return { key: src, alt, shot: () => ({ kind: 'img', src, alt }) }
}

function boardItem(board: HTMLElement): GalleryItem {
  const alt = board.getAttribute('aria-label') ?? ''
  return {
    alt,
    // Un mismo boceto puede salir dos veces (en grande y en la miniatura de su selector): se reconoce por su nombre.
    key: board.getAttribute('aria-label') || board,
    shot: () => ({
      kind: 'node',
      node: boardCopy(board),
      w: board.offsetWidth,
      h: board.offsetHeight,
      alt,
    }),
  }
}

/** Lo que hay que ampliar bajo el clic: un tablero de bocetos o una pantalla del producto */
export function zoomTarget(e: MouseEvent): GalleryItem | null {
  const target = e.target instanceof Element ? e.target : null
  if (!target || target.closest(VIEWER)) return null
  // Una pieza que, al tocarla, amplía otra (p. ej. la tarjeta del teléfono abre el boceto completo)
  const proxy = target.closest<HTMLElement>('[data-zoom-for]')
  const source = proxy ? document.getElementById(proxy.dataset.zoomFor ?? '')?.querySelector<HTMLElement>(ZOOMABLE) : null
  if (source) return boardItem(source)
  const board = target.closest<HTMLElement>(ZOOMABLE)
  if (board) {
    const control = target.closest(INTERACTIVE)
    return control && board.contains(control) ? null : boardItem(board)
  }
  const img = screenshotAt(e)
  return img ? imageItem(img) : null
}

/** ¿Entra en la galería? Las imágenes de dentro de un tablero ya van con él; las ocultas del todo, no. */
function inGallery(el: HTMLElement): GalleryItem | null {
  if (el instanceof HTMLImageElement) return !el.closest(ZOOMABLE) && isScreenshot(el) ? imageItem(el) : null
  return el.offsetWidth > 0 ? boardItem(el) : null
}

/**
 * Todo lo ampliable de la página, en el orden en que aparece y sin repetir (una pantalla que sale
 * en el carrusel y en su miniatura cuenta una vez). Incluye las láminas de un carrusel que no
 * están al frente, para poder recorrerlas todas desde el visor.
 */
export function collectGallery(current: GalleryItem): { items: GalleryItem[]; index: number } {
  const found = new Map<GalleryItem['key'], { item: GalleryItem; width: number }>()
  document.querySelectorAll<HTMLElement>(`main img, main ${ZOOMABLE}`).forEach((el) => {
    const item = inGallery(el)
    if (!item) return
    const width = el.offsetWidth
    const prev = found.get(item.key)
    // Si se repite, vale la versión más grande, pero en el lugar donde apareció primero.
    if (!prev || width > prev.width) found.set(item.key, { item, width })
  })
  const items = Array.from(found.values(), ({ item }) => item)
  const index = items.findIndex((item) => item.key === current.key)
  return index === -1 ? { items: [current], index: 0 } : { items, index }
}

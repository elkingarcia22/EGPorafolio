/**
 * Los nodos entre los que viaja la transición: sale del nodo de la sección
 * donde se hizo clic (o del nodo del proyecto, p. ej. la O de Objetivos) y
 * aterriza en el nodo de la sección o del proyecto de destino.
 *
 * Marcas que se leen en el DOM:
 * - `data-section-node`: el nodo de cada etiqueta de sección (<SectionLabel>)
 * - `data-transition-source`: nodo de salida explícito (p. ej. el círculo de cada proyecto en la
 *   órbita); si hay varios en la sección, sale del que está al frente (`aria-current`)
 * - `data-transition-source="page"`: nodo de salida de lo que está a la vista (p. ej. la hoja de vida)
 * - `data-transition-target`: nodo de llegada de una página (también sirve de salida al dejarla)
 * - `data-transition-land`: punto de llegada sin anillo propio (p. ej. el nodo de la hoja de vida)
 */

export interface Point {
  x: number
  y: number
}

export interface Landing extends Point {
  /** Tamaño final del anillo que aterriza (px) */
  size: number
}

/** De dónde sale el viaje; `size` cuando sale de un anillo (p. ej. el de la O) */
export interface Source extends Point {
  size?: number
}

/** Anillo de llegada sobre un nodo de sección: el mismo de su retícula */
const SECTION_RING_PX = 46

function visibleCenter(el: Element | null | undefined): Point | null {
  if (!el) return null
  const r = el.getBoundingClientRect()
  const visible = r.width + r.height > 0 && r.bottom > 0 && r.right > 0 && r.top < window.innerHeight && r.left < window.innerWidth
  return visible ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : null
}

/** El nodo de sección a la vista más cercano al centro de la pantalla. */
function nearestSectionNode(): Element | null {
  const cx = window.innerWidth / 2
  const cy = window.innerHeight / 2
  let best: Element | null = null
  let bestDistance = Infinity
  document.querySelectorAll('[data-section-node]').forEach((node) => {
    const c = visibleCenter(node)
    if (!c) return
    const d = Math.hypot(c.x - cx, c.y - cy)
    if (d < bestDistance) {
      bestDistance = d
      best = node
    }
  })
  return best
}

/** De dónde sale el viaje: el nodo de la sección del enlace, el del proyecto o el más cercano. */
export function sourcePoint(trigger?: Element | null): Source {
  const candidates = [
    trigger?.closest('[data-transition-source]'),
    trigger?.closest('section, [data-section-tone]')?.querySelector('[data-transition-source][aria-current="true"]'),
    trigger?.closest('section, [data-section-tone]')?.querySelector('[data-section-node]'),
    document.querySelector('[data-transition-source="page"]'),
    document.querySelector('[data-transition-target]'),
    nearestSectionNode(),
  ]
  for (const el of candidates) {
    const c = visibleCenter(el)
    if (!c) continue
    // Un anillo de proyecto: sale desde su letra, con su tamaño.
    if (el instanceof HTMLElement && el.hasAttribute('data-transition-target')) return landingOf(el) ?? c
    // Un círculo de proyecto: el destello nace con su tamaño.
    if (el?.hasAttribute('data-transition-source') && el.getAttribute('data-transition-source') !== 'page') return { ...c, size: el.getBoundingClientRect().width }
    return c
  }
  return visibleCenter(trigger) ?? { x: window.innerWidth / 2, y: window.innerHeight / 2 }
}

function hashSectionNode(): Element | null {
  const hash = window.location.hash
  if (hash.length < 2) return null
  try {
    return document.querySelector(hash)?.querySelector('[data-section-node]') ?? null
  } catch {
    // Un ancla que no es un selector válido: no hay nodo al que llegar.
    return null
  }
}

/** El elemento, si está a la vista (para aterrizar en él). */
export function visibleElement(el: Element | null | undefined): HTMLElement | null {
  return el instanceof HTMLElement && visibleCenter(el) ? el : null
}

/** Dónde aterriza el viaje en la página nueva (o null si no hay nodo a la vista). */
export function landingNode(): HTMLElement | null {
  const candidates = [document.querySelector('[data-transition-land]'), hashSectionNode(), document.querySelector('[data-transition-target]'), nearestSectionNode()]
  for (const el of candidates) {
    if (el instanceof HTMLElement && visibleCenter(el)) return el
  }
  return null
}

export function landingOf(node: HTMLElement): Landing | null {
  if (node.hasAttribute('data-transition-target')) {
    // El anillo rodea una letra (la O): se centra en ella. Si no hay texto, su posición de maqueta
    // (puede estar animándose; está centrado con translate).
    const letter = textCenter(node.parentElement)
    if (letter) return { ...letter, size: node.offsetWidth }
    const box = node.offsetParent?.getBoundingClientRect()
    if (!box) return null
    return { x: box.left + node.offsetLeft, y: box.top + node.offsetTop, size: node.offsetWidth }
  }
  const c = visibleCenter(node)
  return c && { ...c, size: SECTION_RING_PX }
}

/** Centro del texto que hay dentro de `el` (sin contar elementos posicionados como el anillo). */
function textCenter(el: Element | null): Point | null {
  if (!el) return null
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
  const range = document.createRange()
  let found: DOMRect | null = null
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (!n.textContent?.trim()) continue
    range.selectNodeContents(n)
    const r = range.getBoundingClientRect()
    if (!r.width || !r.height) continue
    found = found
      ? new DOMRect(Math.min(found.left, r.left), Math.min(found.top, r.top), Math.max(found.right, r.right) - Math.min(found.left, r.left), Math.max(found.bottom, r.bottom) - Math.min(found.top, r.top))
      : r
  }
  return found && { x: found.left + found.width / 2, y: found.top + found.height / 2 }
}

/** Al aterrizar, el nodo de sección se enciende con su retícula. */
export function lightNode(node: HTMLElement): void {
  const label = node.closest<HTMLElement>('[data-lit]')
  if (label) label.dataset.lit = 'true'
}

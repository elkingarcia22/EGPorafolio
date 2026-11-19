'use client'

import { useEffect, useRef, useState } from 'react'
import { useLocale, type L } from '@/lib/i18n'
import { UBITS_BLUE } from './shared'
import { useBuilderDemo } from './form-builder-demo'

interface Node {
  id: string
  title: string
  questions: number
  children: readonly Node[]
}

interface Entry {
  node: Node
  depth: number
  numbering: string
  path: readonly number[]
}

const MAX_DEPTH = 3
const MINUTES_PER_QUESTION = 0.5
const DEPTH_LABEL: Record<number, L> = {
  1: { es: 'Sección', en: 'Section' },
  2: { es: 'Subsección', en: 'Subsection' },
  3: { es: 'Sub-subsección', en: 'Sub-subsection' },
}

const SEED: readonly Node[] = [
  {
    id: 's1',
    title: 'Liderazgo',
    questions: 0,
    children: [
      { id: 's1a', title: 'Mi líder directo', questions: 2, children: [{ id: 's1a1', title: 'Confianza', questions: 2, children: [] }] },
      { id: 's1b', title: 'Reconocimiento', questions: 3, children: [] },
    ],
  },
  { id: 's2', title: 'Bienestar', questions: 0, children: [{ id: 's2a', title: 'Carga y balance', questions: 2, children: [] }] },
]

let uid = 0
const newId = () => `n${++uid}`

/** Recorre el árbol en orden visual; la numeración sale de la posición, nunca se guarda. */
function flatten(nodes: readonly Node[], prefix = '', depth = 1, path: readonly number[] = []): Entry[] {
  return nodes.flatMap((node, i) => {
    const numbering = prefix ? `${prefix}.${i + 1}` : `${i + 1}`
    const here = [...path, i]
    return [{ node, depth, numbering, path: here }, ...flatten(node.children, numbering, depth + 1, here)]
  })
}

/** Devuelve un árbol nuevo con el nodo de `path` transformado (o quitado si `fn` devuelve null). */
function updateAt(nodes: readonly Node[], path: readonly number[], fn: (n: Node) => Node | null): readonly Node[] {
  const [head, ...rest] = path
  return nodes.flatMap((n, i) => {
    if (i !== head) return [n]
    if (rest.length === 0) {
      const next = fn(n)
      return next ? [next] : []
    }
    return [{ ...n, children: updateAt(n.children, rest, fn) }]
  })
}

/** Intercambia un nodo con su hermano (solo reordena dentro del mismo padre). */
function swapSibling(nodes: readonly Node[], path: readonly number[], dir: -1 | 1): readonly Node[] {
  if (path.length === 1) {
    const i = path[0]
    const j = i + dir
    if (j < 0 || j >= nodes.length) return nodes
    const copy = [...nodes]
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
    return copy
  }
  return updateAt(nodes, path.slice(0, -1), (parent) => ({ ...parent, children: swapSibling(parent.children, [path[path.length - 1]], dir) }))
}

const countQ = (n: Node): number => n.questions + n.children.reduce((s, c) => s + countQ(c), 0)
const countDesc = (n: Node): number => n.children.reduce((s, c) => s + 1 + countDesc(c), 0)
const isFilled = (n: Node): boolean => (n.questions > 0 || n.children.length > 0) && n.children.every(isFilled)

/** El paso «Secciones y preguntas» en miniatura: un árbol de tres niveles que se puede editar de verdad. */
export function LiveBuilder() {
  const { t } = useLocale()
  const [tree, setTree] = useState<readonly Node[]>(SEED)
  const [toast, setToast] = useState<string | null>(null)
  const [pendingDelete, setPendingDelete] = useState<string | null>(null)
  const box = useRef<HTMLDivElement>(null)
  const demo = useBuilderDemo(box, () => {
    setTree(SEED)
    setPendingDelete(null)
  })
  const entries = flatten(tree)
  const totalQ = tree.reduce((s, n) => s + countQ(n), 0)
  const allFilled = tree.every(isFilled)

  useEffect(() => {
    if (!toast) return
    const id = window.setTimeout(() => setToast(null), 2600)
    return () => window.clearTimeout(id)
  }, [toast])

  const addChild = (e: Entry) => {
    if (e.depth >= MAX_DEPTH) return setToast(t({ es: 'Alcanzaste el máximo de 3 niveles', en: 'You reached the 3-level maximum' }))
    setTree((tr) => updateAt(tr, e.path, (n) => ({ ...n, children: [...n.children, { id: newId(), title: `${t(DEPTH_LABEL[e.depth + 1])} ${e.numbering}.${n.children.length + 1}`, questions: 0, children: [] }] })))
  }
  const addQuestion = (e: Entry) => setTree((tr) => updateAt(tr, e.path, (n) => ({ ...n, questions: n.questions + 1 })))
  const addRoot = () => setTree((tr) => [...tr, { id: newId(), title: `${t(DEPTH_LABEL[1])} ${tr.length + 1}`, questions: 0, children: [] }])
  const remove = (e: Entry) => {
    const heavy = e.node.questions > 0 || e.node.children.length > 0
    if (heavy && pendingDelete !== e.node.id) return setPendingDelete(e.node.id)
    setPendingDelete(null)
    setTree((tr) => updateAt(tr, e.path, () => null))
    setToast(e.depth === 1 ? t({ es: 'Sección eliminada', en: 'Section deleted' }) : t({ es: 'Subsección eliminada', en: 'Subsection deleted' }))
  }

  const iconBtn = 'flex h-7 w-7 items-center justify-center rounded-md text-[13px] text-[#5c646f] transition-colors hover:bg-[#ecf1fa] hover:text-[#303a47] disabled:opacity-30'

  return (
    <div ref={box} className="relative overflow-hidden bg-[#f8faff] text-[#303a47]" onPointerDown={demo.auto ? demo.takeOver : undefined}>
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_15rem]">
        <ul className="min-w-0 space-y-1.5 p-4 sm:p-5">
          {entries.map((e) => {
            const isLastRoot = e.depth === 1 && tree.length === 1
            const empty = e.node.questions === 0 && e.node.children.length === 0
            return (
              <li key={e.node.id} data-depth={e.depth} className="enc-fade" style={{ marginLeft: `${(e.depth - 1) * 1.1}rem` }}>
                <div className={`flex items-center gap-2 rounded-lg border bg-white px-3 py-2 ${empty ? 'border-dashed border-[#f0a07a]' : 'border-black/[0.08]'}`}>
                  <span className="rounded px-1.5 py-0.5 font-mono text-[10px]" style={{ background: e.depth === 1 ? UBITS_BLUE : '#ecf1fa', color: e.depth === 1 ? '#fff' : UBITS_BLUE }}>{e.numbering}</span>
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">{e.node.title}</span>
                  <span className="hidden font-mono text-[10px] text-[#979ba3] sm:inline">{e.node.questions} {t({ es: 'preg.', en: 'q.' })}</span>
                  <button type="button" data-act={`up:${e.node.id}`} className={iconBtn} onClick={() => setTree((tr) => swapSibling(tr, e.path, -1))} aria-label={t({ es: `Subir ${e.node.title}`, en: `Move ${e.node.title} up` })}>↑</button>
                  <button type="button" data-act={`q:${e.node.id}`} className={iconBtn} onClick={() => addQuestion(e)} aria-label={t({ es: `Agregar pregunta a ${e.node.title}`, en: `Add question to ${e.node.title}` })}>?+</button>
                  <button type="button" data-act={`child:${e.node.id}`} className={iconBtn} onClick={() => addChild(e)} aria-label={t({ es: `Agregar subsección a ${e.node.title}`, en: `Add subsection to ${e.node.title}` })}>⊕</button>
                  <button type="button" data-act={`remove:${e.node.id}`} className={`${iconBtn} hover:!text-[#b02a37]`} onClick={() => remove(e)} disabled={isLastRoot} title={isLastRoot ? t({ es: 'La encuesta debe tener al menos una sección', en: 'The survey needs at least one section' }) : undefined} aria-label={t({ es: `Eliminar ${e.node.title}`, en: `Delete ${e.node.title}` })}>✕</button>
                </div>
                {pendingDelete === e.node.id && (
                  <div className="enc-fade mt-1 flex flex-wrap items-center gap-2 rounded-lg bg-[#fbe7e9] px-3 py-2 text-xs text-[#b02a37]">
                    <span className="flex-1">
                      {t({ es: `Se eliminará junto con ${countDesc(e.node)} subsecciones y ${countQ(e.node)} preguntas. No se puede deshacer.`, en: `It will be deleted with ${countDesc(e.node)} subsections and ${countQ(e.node)} questions. This can’t be undone.` })}
                    </span>
                    <button type="button" onClick={() => setPendingDelete(null)} className="rounded-md px-2 py-1 hover:bg-white/60">{t({ es: 'Cancelar', en: 'Cancel' })}</button>
                    <button type="button" data-act={`confirm:${e.node.id}`} onClick={() => remove(e)} className="rounded-md bg-[#b02a37] px-2 py-1 text-white">{t({ es: 'Eliminar', en: 'Delete' })}</button>
                  </div>
                )}
              </li>
            )
          })}
          <li>
            <button type="button" data-act="root" onClick={addRoot} className="mt-2 w-full rounded-lg border border-dashed border-[#c5ccd8] px-3 py-2 text-left text-sm text-[#5c646f] transition-colors hover:border-[#0c5bef] hover:text-[#0c5bef]">
              + {t({ es: 'Agregar sección', en: 'Add section' })}
            </button>
          </li>
        </ul>

        <aside className="border-t border-black/10 bg-white p-5 md:border-l md:border-t-0">
          <p className="text-xs font-semibold">{t({ es: 'Así va la encuesta', en: 'Survey so far' })}</p>
          <dl className="mt-4 space-y-2 text-sm">
            {[
              [t({ es: 'Secciones', en: 'Sections' }), tree.length],
              [t({ es: 'Subsecciones', en: 'Subsections' }), entries.length - tree.length],
              [t({ es: 'Preguntas', en: 'Questions' }), totalQ],
              [t({ es: 'Tiempo estimado', en: 'Estimated time' }), `${Math.ceil(totalQ * MINUTES_PER_QUESTION)} min`],
            ].map(([k, v]) => (
              <div key={String(k)} className="flex justify-between">
                <dt className="text-[#5c646f]">{k}</dt>
                <dd key={String(v)} className="enc-fade font-semibold tabular-nums">{v}</dd>
              </div>
            ))}
          </dl>
          <p className={`mt-5 rounded-lg px-3 py-2 text-xs leading-snug ${allFilled ? 'bg-[#e2f1e2] text-[#2c6b2f]' : 'bg-[#fbf3d6] text-[#8f6400]'}`} aria-live="polite">
            {allFilled
              ? t({ es: '✓ Todas las secciones tienen sus preguntas.', en: '✓ Every section has its questions.' })
              : t({ es: 'Todas las secciones deben tener al menos una pregunta para continuar.', en: 'Every section needs at least one question to continue.' })}
          </p>
          <p className="mt-4" aria-live="polite">
            {demo.auto ? (
              <span className="flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[10px] text-[#5c646f] shadow-sm ring-1 ring-black/5">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#0c5bef]" />
                {t({ es: 'Demostración · tócalo para usarlo', en: 'Demo · touch it to use it' })}
              </span>
            ) : (
              <button type="button" onClick={demo.replay} className="rounded-full bg-white px-2.5 py-1 text-[10px] text-[#0c5bef] shadow-sm ring-1 ring-black/5 hover:bg-[#ecf1fa]">
                ↺ {t({ es: 'Ver la demostración', en: 'Watch the demo' })}
              </button>
            )}
          </p>
        </aside>
      </div>
      {demo.cursor && (
        <span
          className="pointer-events-none absolute left-0 top-0 z-30 transition-transform duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ transform: `translate(${demo.cursor.x - 4}px, ${demo.cursor.y - 3}px)` }}
          aria-hidden="true"
        >
          <span className={`absolute -left-3 -top-3 h-8 w-8 rounded-full bg-[#0c5bef]/25 transition-transform duration-200 ${demo.cursor.pressing ? 'scale-100' : 'scale-0'}`} />
          <svg width="20" height="22" viewBox="0 0 20 22" className={`relative drop-shadow-md transition-transform duration-150 ${demo.cursor.pressing ? 'scale-90' : ''}`}>
            <path d="M2 1.5 L17 11 L10 12.3 L13.6 19.6 L10.8 20.9 L7.2 13.6 L2 18 Z" fill="#303a47" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
        </span>
      )}
      {toast && (
        <p role="status" className="enc-fade absolute bottom-4 left-1/2 -translate-x-1/2 rounded-lg bg-[#303a47] px-4 py-2 text-xs text-white shadow-lg">
          {toast}
        </p>
      )}
    </div>
  )
}

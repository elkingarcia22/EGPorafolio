import type { MockKind, Project } from './types'

const MOCK_KINDS: readonly MockKind[] = ['dashboard', 'mobile', 'upload', 'table']

type Obj = Record<string, unknown>

const isObj = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v)
const isText = (v: unknown): boolean => isObj(v) && typeof v.es === 'string' && typeof v.en === 'string'
const isTextList = (v: unknown): boolean => Array.isArray(v) && v.every(isText)
const isList = (v: unknown, item: (x: unknown) => boolean): boolean => Array.isArray(v) && v.every(item)

/**
 * Valida que un valor externo (fila de Supabase) tenga la forma de un
 * Project antes de renderizarlo. Si algo falta, se descarta el caso.
 */
export function isProject(value: unknown): value is Project {
  if (!isObj(value)) return false
  const v = value
  const problem = v.problem as Obj | undefined
  const research = v.research as Obj | undefined
  const idea = v.idea as Obj | undefined
  const sketches = v.sketches as Obj | undefined
  const form = v.form as Obj | undefined
  const ai = v.ai as Obj | undefined
  const results = v.results as Obj | undefined

  return (
    typeof v.slug === 'string' &&
    /^[a-z0-9-]+$/.test(v.slug) &&
    typeof v.frequency === 'string' &&
    typeof v.client === 'string' &&
    typeof v.year === 'string' &&
    typeof v.accent === 'string' &&
    /^\d{1,3} \d{1,3} \d{1,3}$/.test(v.accent) &&
    MOCK_KINDS.includes(v.mock as MockKind) &&
    [v.title, v.tagline, v.role, v.team, v.duration].every(isText) &&
    isList(v.tools, (t) => typeof t === 'string') &&
    isObj(problem) && isText(problem.context) &&
    isList(problem.quotes, (q) => isObj(q) && isText(q.text) && isText(q.who)) &&
    isList(problem.stats, (s) => isObj(s) && typeof s.value === 'string' && isText(s.label)) &&
    isObj(research) && isText(research.method) && isTextList(research.insights) &&
    isList(research.clusters, (c) => isObj(c) && isText(c.title) && isTextList(c.notes)) &&
    isObj(idea) && isText(idea.hmw) &&
    isList(idea.principles, (p) => isObj(p) && isText(p.title) && isText(p.body)) &&
    isObj(sketches) && isText(sketches.caption) && isTextList(sketches.notes) &&
    isObj(form) && isText(form.caption) &&
    isObj(ai) && isText(ai.intro) &&
    isList(ai.steps, (s) => isObj(s) && typeof s.tool === 'string' && isText(s.prompt) && isText(s.output)) &&
    isObj(results) && isTextList(results.learnings) &&
    isList(results.metrics, (m) => isObj(m) && typeof m.value === 'number' && typeof m.suffix === 'string' && isText(m.label))
  )
}

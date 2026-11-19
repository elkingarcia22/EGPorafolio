import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { PROJECTS as LOCAL_PROJECTS } from '@/lib/content/projects'
import { isProject } from '@/lib/content/projects/validate'
import type { Project } from '@/lib/content/projects/types'

/**
 * Fuente de los casos de estudio (solo servidor).
 * Lee de Supabase si está configurado; si no hay variables, la consulta
 * falla o no hay filas válidas, usa el contenido local de lib/content.
 */

export interface ProjectsResult {
  projects: readonly Project[]
  source: 'supabase' | 'local'
}

let client: SupabaseClient | null | undefined

function getClient(): SupabaseClient | null {
  if (client !== undefined) return client
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  client = url && key ? createClient(url, key, { auth: { persistSession: false } }) : null
  return client
}

const LOCAL: ProjectsResult = { projects: LOCAL_PROJECTS, source: 'local' }

export async function listProjects(): Promise<ProjectsResult> {
  const supabase = getClient()
  if (!supabase) return LOCAL

  const { data, error } = await supabase
    .from('projects')
    .select('content')
    .eq('published', true)
    .order('position', { ascending: true })

  if (error) {
    console.error('[projects] Supabase no respondió, uso contenido local:', error.message)
    return LOCAL
  }

  const rows: unknown[] = (data ?? []).map((row) => (row as { content: unknown }).content)
  const valid = rows.filter(isProject)
  if (valid.length < rows.length) {
    console.error(`[projects] ${rows.length - valid.length} fila(s) con formato inválido fueron omitidas`)
  }
  return valid.length > 0 ? { projects: withCodeCases(valid), source: 'supabase' } : LOCAL
}

/** Casos con diseño propio: viven en el código y se listan aunque no tengan fila en Supabase. */
const CODE_CASES: ReadonlySet<string> = new Set(['sellup', 'encuestas'])

/** Suma los casos del código que falten, en la posición que tienen en el orden local. */
function withCodeCases(projects: readonly Project[]): readonly Project[] {
  const present = new Set(projects.map((p) => p.slug))
  return LOCAL_PROJECTS.reduce<readonly Project[]>((acc, local, index) => {
    if (!CODE_CASES.has(local.slug) || present.has(local.slug)) return acc
    const at = Math.min(index, acc.length)
    return [...acc.slice(0, at), local, ...acc.slice(at)]
  }, projects)
}

export async function findProject(slug: string): Promise<{ project: Project; next: Project } | null> {
  const { projects } = await listProjects()
  const index = projects.findIndex((p) => p.slug === slug)
  if (index === -1) return null
  return { project: projects[index], next: projects[(index + 1) % projects.length] }
}

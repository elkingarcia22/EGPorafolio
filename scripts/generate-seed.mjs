// Genera supabase/seed.sql a partir de los casos en lib/content/projects.
// Uso: npm run db:seed-sql
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import path from 'node:path'

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const sourceDir = path.join(root, 'lib/content/projects')
const outDir = mkdtempSync(path.join(tmpdir(), 'eg-seed-'))

try {
  const require = createRequire(import.meta.url)
  const ts = require('typescript')

  // Transpila solo los datos (los imports de tipos desaparecen al transpilar).
  for (const file of readdirSync(sourceDir).filter((f) => f.endsWith('.ts'))) {
    const source = readFileSync(path.join(sourceDir, file), 'utf8')
    const { outputText } = ts.transpileModule(source, {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2019 },
    })
    writeFileSync(path.join(outDir, file.replace(/\.ts$/, '.js')), outputText)
  }

  const { PROJECTS } = require(path.join(outDir, 'index.js'))

  const quote = (value) => `'${String(value).replace(/'/g, "''")}'`
  const rows = PROJECTS.map(
    (project, index) =>
      `  (${quote(project.slug)}, ${index}, true, ${quote(JSON.stringify(project))}::jsonb)`,
  )

  const sql = [
    '-- Generado por scripts/generate-seed.mjs — no editar a mano.',
    '-- Contenido PROVISIONAL de ejemplo (reemplazar por los casos reales).',
    'insert into public.projects (slug, position, published, content) values',
    rows.join(',\n'),
    'on conflict (slug) do update',
    '  set position = excluded.position,',
    '      published = excluded.published,',
    '      content = excluded.content;',
    '',
  ].join('\n')

  writeFileSync(path.join(root, 'supabase/seed.sql'), sql)
  process.stdout.write(`supabase/seed.sql: ${PROJECTS.length} proyectos\n`)
} finally {
  rmSync(outDir, { recursive: true, force: true })
}

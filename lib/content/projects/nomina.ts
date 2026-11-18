import type { Project } from './types'

/** CONTENIDO PROVISIONAL — caso de ejemplo mientras se documentan los reales. */
export const nomina: Project = {
  slug: 'nomina',
  frequency: '04.19',
  title: { es: 'Nómina sin fricción', en: 'Frictionless payroll' },
  client: 'Siigo',
  year: '2019',
  accent: '214 64 72',
  mock: 'table',
  tagline: {
    es: 'Liquidar la nómina de una pyme pasó de un día de hojas de cálculo a un flujo guiado con validaciones antes del error.',
    en: 'Running payroll for a small business went from a day of spreadsheets to a guided flow that validates before the mistake.',
  },
  role: { es: 'Senior UX/UI · flujo y componentes', en: 'Senior UX/UI · flow and components' },
  team: { es: '2 diseñadores, 6 devs', en: '2 designers, 6 devs' },
  duration: { es: '4 meses', en: '4 months' },
  tools: ['Sketch', 'Figma', 'Miro', 'Maze'],
  problem: {
    context: {
      es: 'Contadores liquidaban nómina saltando entre pantallas y Excel. Un error se descubría cuando el empleado reclamaba.',
      en: 'Accountants ran payroll jumping between screens and Excel. Mistakes were found when the employee complained.',
    },
    quotes: [
      { text: { es: '“Reviso todo dos veces porque no confío en el sistema.”', en: '“I check everything twice because I don’t trust the system.”' }, who: { es: 'Contadora independiente', en: 'Freelance accountant' } },
      { text: { es: '“Las novedades me llegan por correo y las paso a mano.”', en: '“Changes reach me by email and I enter them by hand.”' }, who: { es: 'Auxiliar contable', en: 'Accounting assistant' } },
    ],
    stats: [
      { value: '7 h', label: { es: 'por liquidación', en: 'per payroll run' } },
      { value: '1 de 5', label: { es: 'nóminas con corrección', en: 'payrolls needing a fix' } },
    ],
  },
  research: {
    method: {
      es: 'Indagación contextual con 10 contadores y pruebas de usabilidad del flujo existente.',
      en: 'Contextual inquiry with 10 accountants and usability tests of the existing flow.',
    },
    clusters: [
      {
        title: { es: 'Novedades', en: 'Changes' },
        notes: [
          { es: 'Llegan por correo', en: 'Arrive by email' },
          { es: 'Horas extra a mano', en: 'Manual overtime' },
        ],
      },
      {
        title: { es: 'Confianza', en: 'Trust' },
        notes: [
          { es: 'Doble revisión', en: 'Double check' },
          { es: 'Totales ocultos', en: 'Hidden totals' },
          { es: 'Miedo a la DIAN', en: 'Fear of the tax office' },
        ],
      },
    ],
    insights: [
      { es: 'El contador necesita ver el impacto de cada cambio en el total.', en: 'Accountants need to see each change’s impact on the total.' },
      { es: 'Validar antes es más barato que corregir después.', en: 'Validating early is cheaper than fixing later.' },
    ],
  },
  idea: {
    hmw: {
      es: '¿Cómo podríamos hacer que el contador confíe en el total sin revisar dos veces?',
      en: 'How might we make accountants trust the total without double-checking?',
    },
    principles: [
      { title: { es: 'Total siempre visible', en: 'Total always visible' }, body: { es: 'Cada cambio muestra su efecto.', en: 'Every change shows its effect.' } },
      { title: { es: 'Pasos claros', en: 'Clear steps' }, body: { es: 'Novedades, revisión, aprobación.', en: 'Changes, review, approval.' } },
    ],
  },
  sketches: {
    caption: { es: 'Explorando cómo mostrar el total "vivo" mientras se editan novedades.', en: 'Exploring how to show a "live" total while editing changes.' },
    notes: [
      { es: 'total fijo', en: 'sticky total' },
      { es: 'alerta antes', en: 'warn early' },
      { es: 'por empleado', en: 'per employee' },
    ],
  },
  form: {
    caption: { es: 'La tabla final: edición en línea y total que reacciona al instante.', en: 'The final table: inline editing and a total that reacts instantly.' },
  },
  ai: {
    intro: { es: 'En 2019 la IA aún no era parte del proceso; hoy la aplicaría así:', en: 'In 2019 AI wasn’t part of the process yet; today I would apply it like this:' },
    steps: [
      { tool: 'Claude', prompt: { es: 'Lee los correos de novedades y conviértelos en registros de nómina.', en: 'Read the change emails and turn them into payroll records.' }, output: { es: 'Novedades precargadas para revisar', en: 'Pre-filled changes to review' } },
      { tool: 'Claude', prompt: { es: 'Detecta valores atípicos frente a los últimos 6 meses.', en: 'Flag outliers against the last 6 months.' }, output: { es: 'Alertas antes de aprobar', en: 'Warnings before approval' } },
    ],
  },
  results: {
    metrics: [
      { value: 65, prefix: '−', suffix: '%', label: { es: 'tiempo de liquidación', en: 'payroll time' } },
      { value: 70, prefix: '−', suffix: '%', label: { es: 'correcciones', en: 'corrections' } },
    ],
    learnings: [
      { es: 'La confianza es una métrica de diseño.', en: 'Trust is a design metric.' },
    ],
  },
}

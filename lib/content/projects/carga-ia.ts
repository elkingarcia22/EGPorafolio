import type { Project } from './types'

/** CONTENIDO PROVISIONAL — caso de ejemplo mientras se documentan los reales. */
export const cargaIa: Project = {
  slug: 'carga-masiva-ia',
  frequency: '03.26',
  title: { es: 'Carga masiva con IA', en: 'AI bulk import' },
  client: 'UBITS',
  year: '2026',
  accent: '38 178 120',
  mock: 'upload',
  tagline: {
    es: 'Una herramienta que entiende el Excel desordenado del cliente y lo convierte en datos listos, en vez de pedirle que lo arregle.',
    en: 'A tool that understands the client’s messy spreadsheet and turns it into clean data, instead of asking them to fix it.',
  },
  role: { es: 'Diseño y construcción · de la idea al código', en: 'Design and build · from idea to code' },
  team: { es: 'Yo + 1 dev backend', en: 'Me + 1 backend dev' },
  duration: { es: '6 semanas', en: '6 weeks' },
  tools: ['Claude Code', 'Cursor', 'Figma', 'n8n'],
  problem: {
    context: {
      es: 'Subir datos históricos exigía una plantilla rígida. El 70% de los archivos fallaban y soporte terminaba haciéndolo a mano.',
      en: 'Uploading historical data required a rigid template. 70% of files failed and support ended up doing it by hand.',
    },
    quotes: [
      { text: { es: '“Me dice ‘error en la fila 312’ y no sé qué significa.”', en: '“It says ‘error in row 312’ and I don’t know what it means.”' }, who: { es: 'Admin de cliente', en: 'Client admin' } },
      { text: { es: '“Cada carga es un ticket para nosotros.”', en: '“Every upload becomes a ticket for us.”' }, who: { es: 'Equipo de soporte', en: 'Support team' } },
    ],
    stats: [
      { value: '70%', label: { es: 'archivos rechazados', en: 'files rejected' } },
      { value: '3 días', label: { es: 'promedio por carga', en: 'average per import' } },
      { value: '120', label: { es: 'tickets al mes', en: 'tickets per month' } },
    ],
  },
  research: {
    method: {
      es: 'Análisis de 300 archivos reales fallidos y 8 sesiones con admins mientras subían datos.',
      en: 'Analysis of 300 real failed files and 8 sessions with admins while uploading data.',
    },
    clusters: [
      {
        title: { es: 'Formato', en: 'Format' },
        notes: [
          { es: 'Columnas con otro nombre', en: 'Columns named differently' },
          { es: 'Fechas en 5 formatos', en: 'Dates in 5 formats' },
        ],
      },
      {
        title: { es: 'Confianza', en: 'Trust' },
        notes: [
          { es: '¿Se subió bien?', en: 'Did it upload right?' },
          { es: 'Miedo a duplicar', en: 'Fear of duplicates' },
          { es: 'Errores crípticos', en: 'Cryptic errors' },
        ],
      },
    ],
    insights: [
      { es: 'El usuario no debe adaptarse al sistema: el sistema debe leer al usuario.', en: 'Users shouldn’t adapt to the system: the system should read the user.' },
      { es: 'La confianza viene de ver el resultado antes de confirmar.', en: 'Trust comes from seeing the result before confirming.' },
    ],
  },
  idea: {
    hmw: {
      es: '¿Cómo podríamos aceptar cualquier archivo y explicar cada cambio en lenguaje humano?',
      en: 'How might we accept any file and explain every change in plain language?',
    },
    principles: [
      { title: { es: 'Cualquier archivo', en: 'Any file' }, body: { es: 'La IA mapea columnas y formatos.', en: 'AI maps columns and formats.' } },
      { title: { es: 'Vista previa', en: 'Preview' }, body: { es: 'Ves los datos limpios antes de confirmar.', en: 'See clean data before confirming.' } },
      { title: { es: 'Errores que ayudan', en: 'Helpful errors' }, body: { es: 'Cada problema trae su solución sugerida.', en: 'Every issue comes with a suggested fix.' } },
    ],
  },
  sketches: {
    caption: { es: 'El boceto clave: una sola pantalla con el archivo a la izquierda y la interpretación de la IA a la derecha.', en: 'The key sketch: one screen with the file on the left and the AI’s reading on the right.' },
    notes: [
      { es: 'antes / después', en: 'before / after' },
      { es: 'confianza %', en: 'confidence %' },
      { es: 'arreglar en línea', en: 'inline fix' },
    ],
  },
  form: {
    caption: { es: 'Diseñado y construido por mí: el wireframe se convirtió directamente en código.', en: 'Designed and built by me: the wireframe turned straight into code.' },
  },
  ai: {
    intro: { es: 'Aquí la IA fue material de diseño y también de construcción.', en: 'Here AI was both design material and building material.' },
    steps: [
      { tool: 'Claude', prompt: { es: 'Clasifica estos 300 archivos fallidos por tipo de error.', en: 'Classify these 300 failed files by error type.' }, output: { es: '9 patrones que cubren el 94% de fallos', en: '9 patterns covering 94% of failures' } },
      { tool: 'Claude Code', prompt: { es: 'Implementa el mapeo de columnas con nivel de confianza y explicación.', en: 'Implement column mapping with confidence level and explanation.' }, output: { es: 'Motor de mapeo en producción', en: 'Mapping engine in production' } },
      { tool: 'Figma', prompt: { es: 'Sistema de estados: leyendo, dudoso, corregido, listo.', en: 'State system: reading, uncertain, fixed, ready.' }, output: { es: '4 estados en el sistema de diseño', en: '4 states in the design system' } },
    ],
  },
  results: {
    metrics: [
      { value: 92, suffix: '%', label: { es: 'archivos aceptados', en: 'files accepted' } },
      { value: 8, suffix: ' min', label: { es: 'promedio por carga', en: 'average per import' } },
      { value: 85, prefix: '−', suffix: '%', label: { es: 'tickets de soporte', en: 'support tickets' } },
    ],
    learnings: [
      { es: 'Construir yo mismo eliminó la pérdida entre diseño y desarrollo.', en: 'Building it myself removed the loss between design and dev.' },
      { es: 'Explicar la IA es parte de la interfaz.', en: 'Explaining the AI is part of the interface.' },
    ],
  },
}

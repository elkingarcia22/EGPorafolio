/**
 * El inicio de Encuestas y el catálogo de plantillas tal como están en el playground (`crea-algo-nuevo.tsx`,
 * `detalle-plantilla.tsx`, `catalogo-plantillas.tsx`, `templateCatalog.ts`, `plantillasPorLargo.ts`), medidos con el
 * `measureTemplate` del producto. Solo en español, como el producto.
 */

const GLASS = '/cases/encuestas/glass'

export const SHORTCUTS = [
  { id: 'nom035', title: 'Crear NOM 035', description: 'Cumple la norma en México.', icon: `${GLASS}/nom035.webp` },
  { id: 'universidad', title: 'Crear Universidad Corporativa', description: 'Mide la formación.', icon: `${GLASS}/universidad.webp` },
  { id: 'cultura', title: 'Crear Cultura', description: 'Mide tus valores.', icon: `${GLASS}/cultura.webp` },
  { id: 'clima', title: 'Crear Clima', description: 'Mide el ambiente laboral.', icon: `${GLASS}/clima.webp` },
  { id: 'enps', title: 'Crear eNPS', description: 'Mide si te recomiendan.', icon: `${GLASS}/enps.webp` },
] as const

/** La ficha de Clima: el largo se elige antes de «Usar plantilla». */
export const CLIMA = {
  name: 'Clima',
  route: 'Organizacional',
  icon: `${GLASS}/clima.webp`,
  objective: 'Cuestionario para explorar las diversas dimensiones del clima y ambiente de trabajo.',
  lengths: [
    { id: 'corta', questions: 30, name: 'Corta', minutes: 15, for: 'Una lectura rápida de cada sección.' },
    { id: 'completa', questions: 50, name: 'Completa', minutes: 25, for: 'Más detalle en cada sección.' },
  ],
  sections: 10,
  /** Las secciones con sus preguntas en la versión corta (3 cada una); la completa suma 2 por sección. */
  content: [
    { title: 'Orientación organizacional', questions: ['Conozco la dirección estratégica de la empresa.', 'Entiendo cómo mi trabajo aporta a los resultados de la empresa.', 'Las metas de mi área están claras.'] },
    { title: 'Gestión del talento humano' },
    { title: 'Estilo de liderazgo' },
    { title: 'Comunicación organizacional' },
    { title: 'Colaboración' },
  ],
} as const

/** El estante que abre «Crear NOM 035»: las guías oficiales de la norma. */
export const NOM_SHELF = {
  path: 'Legales › NOM 035 › México',
  description: 'Guías de referencia oficiales de la NOM-035 (STPS) para cumplir con la norma en México.',
  icon: `${GLASS}/nom035.webp`,
  templates: [
    { name: 'Acontecimientos traumáticos severos', sections: 4, questions: 20, minutes: 10 },
    { name: 'Riesgo psicosocial (- 50 colaboradores)', sections: 4, questions: 13, minutes: 7 },
    { name: 'Riesgo psicosocial (+ 50 colaboradores)', sections: 5, questions: 17, minutes: 9 },
  ],
} as const

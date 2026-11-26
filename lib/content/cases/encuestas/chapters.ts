import type { L } from '@/lib/i18n'

/**
 * Textos cortos del caso Encuestas con el lenguaje de Objetivos: una idea por
 * capítulo, en dos renglones como máximo. Las cifras salen de `case.ts` y de los
 * archivos `*-real.ts` (capturados del producto); las que no están medidas van
 * marcadas como «Escenario de referencia».
 */
export const ENC = {
  tagline: {
    es: 'De preguntar a entender: crear, responder y convertir los resultados en acciones, sin romper la promesa de anonimato.',
    en: 'From asking to understanding: create, answer and turn results into actions, without breaking the anonymity promise.',
  } satisfies L,
  meta: [
    { label: { es: 'Rol', en: 'Role' }, value: { es: 'Diseño de producto end-to-end', en: 'End-to-end product design' } },
    { label: { es: 'Año', en: 'Year' }, value: { es: '2026 · may – nov', en: '2026 · May – Nov' } },
    { label: { es: 'Equipo', en: 'Team' }, value: { es: 'Diseño, producto y desarrollo de UBITS', en: 'UBITS design, product and engineering' } },
    { label: { es: 'Alcance', en: 'Scope' }, value: { es: '99 funcionalidades · 6 superficies', en: '99 features · 6 surfaces' } },
  ] satisfies readonly { label: L; value: L }[],
  tools: ['React', 'Flux UI', 'Claude Code', 'Vite', 'Figma'] as readonly string[],

  leads: {
    puntos: { es: 'Una encuesta no termina cuando se cierra: termina cuando alguien hace algo con ella. Había que cubrir el ciclo entero.', en: 'A survey doesn’t end when it closes: it ends when someone acts on it. The whole cycle had to be covered.' },
    patrones: { es: 'Diez hallazgos de recorrer la plataforma con una cuenta real. Se juntan en tres ideas.', en: 'Ten findings from walking the platform with a real account. They come together in three ideas.' },
    idea: { es: 'Un solo constructor, tan personalizable que cabe cualquier caso de uso: del pulso de cinco preguntas a la norma de un país.', en: 'A single builder, customizable enough to fit any use case: from a five-question pulse to a country’s regulation.' },
    bocetos: { es: 'Cuatro iteraciones en siete meses: del chat al sistema de diseño de la empresa.', en: 'Four iterations in seven months: from chat to the company design system.' },
    forma: { es: 'Seis superficies y una sola encuesta por debajo: ninguna pantalla puede contradecir a otra.', en: 'Six surfaces and a single survey underneath: no screen can contradict another.' },
    ia: { es: 'Cuentas qué quieres medir y Orbit, el agente de UBITS, arma la encuesta. Pregunta solo lo que falta.', en: 'You say what you want to measure and Orbit, UBITS’s agent, builds the survey. It only asks what’s missing.' },
    impacto: { es: 'Cómo se mide el rediseño en el uso del producto, empresa por empresa.', en: 'How the redesign is measured in product usage, company by company.' },
  } satisfies Record<string, L>,
} as const
